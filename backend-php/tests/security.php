<?php

/**
 * Təhlükəsizlik yoxlamaları — işləyən serverə qarşı real HTTP sorğuları.
 *
 * Statik audit (audit.php) sintaksisə baxır; bu fayl davranışa baxır:
 * limitlər, CSRF, admin qorunması, qonaq sətrinin yaradılması.
 *
 * İşlətmək:
 *   php artisan serve --port=8130 &
 *   php tests/security.php http://127.0.0.1:8130
 */

declare(strict_types=1);

$base = rtrim($argv[1] ?? 'http://127.0.0.1:8000', '/');
$pass = 0;
$fail = 0;

function check(string $name, bool $ok, mixed $extra = null): void
{
    global $pass, $fail;

    if ($ok) {
        $pass++;
        echo "  ✓ {$name}\n";
    } else {
        $fail++;
        echo "  ✗ {$name}" . ($extra === null ? '' : ' → ' . json_encode($extra, JSON_UNESCAPED_UNICODE)) . "\n";
    }
}

/**
 * @param array<string,string> $form
 * @return array{status:int,body:string,cookies:string}
 */
function req(string $url, string $method = 'GET', array $form = [], string $cookies = ''): array
{
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HEADER         => true,
        CURLOPT_TIMEOUT        => 15,
        CURLOPT_FOLLOWLOCATION => false,
    ]);

    if ($method !== 'GET') {
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($form));
    }

    if ($cookies !== '') {
        curl_setopt($ch, CURLOPT_COOKIE, $cookies);
    }

    $raw    = (string) curl_exec($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $hlen   = (int) curl_getinfo($ch, CURLINFO_HEADER_SIZE);

    $head = substr($raw, 0, $hlen);
    $jar  = [];
    if (preg_match_all('/^Set-Cookie:\s*([^=]+)=([^;]*)/mi', $head, $m, PREG_SET_ORDER)) {
        foreach ($m as $c) {
            $jar[trim($c[1])] = $c[2];
        }
    }

    $out = [];
    foreach ($jar as $k => $v) {
        $out[] = $k . '=' . $v;
    }

    return ['status' => $status, 'body' => substr($raw, $hlen), 'cookies' => implode('; ', $out)];
}

/** Səhifədən CSRF tokenini və sessiya cookie-lərini götürür. */
function session(string $url): array
{
    $r = req($url);
    preg_match('/name="_token" value="([^"]+)"/', $r['body'], $m);

    return ['token' => $m[1] ?? '', 'cookies' => $r['cookies']];
}

function usersCount(): int
{
    $db = new PDO('sqlite:' . __DIR__ . '/../database/database.sqlite');

    return (int) $db->query('SELECT COUNT(*) FROM users')->fetchColumn();
}

echo "\nHədəf: {$base}\n";

echo "\n1. Giriş üçün brute-force limiti\n";
$s     = session($base . '/admin/giris');
$codes = [];
for ($i = 0; $i < 12; $i++) {
    $codes[] = req($base . '/admin/giris', 'POST', [
        '_token'   => $s['token'],
        'email'    => 'admin@zarafat.az',
        'password' => 'yanlis-parol-' . $i,
    ], $s['cookies'])['status'];
}
$first429 = array_search(429, $codes, true);
check('parol sınağı limitə düşür', $first429 !== false, $codes);
check('limit 10-cu sınaqdan gec işə düşmür', $first429 !== false && $first429 <= 10, $first429);

echo "\n2. Reyestr sadalamasına limit\n";
$codes = [];
for ($i = 0; $i < 80; $i++) {
    $codes[] = req($base . '/api/registry/ZRF-2026-' . str_pad((string) $i, 4, '0', STR_PAD_LEFT))['status'];
}
check('ardıcıl sadalama limitə düşür', in_array(429, $codes, true), array_count_values($codes));

echo "\n3. Anonim GET qonaq sətri yaratmır\n";
$before = usersCount();
for ($i = 0; $i < 15; $i++) {
    req($base . '/api/registry/ZRF-2026-0001');
    req($base . '/r/ZRF-2026-0001');
}
$after = usersCount();
check('15 cütlük sorğudan sonra users cədvəli artmır', $after === $before, [$before, $after]);

echo "\n4. CSRF\n";
$r = req($base . '/api/documents', 'POST', ['title' => 'T', 'to' => 'A B', 'from' => 'C D']);
check('tokensiz POST 419 qaytarır', $r['status'] === 419, $r['status']);
$r = req($base . '/kabinet/giris', 'POST', ['email' => 'a@b.c', 'password' => 'x']);
check('tokensiz giriş 419 qaytarır', $r['status'] === 419, $r['status']);

echo "\n5. Sənədin ləğvi\n";
$r = req($base . '/api/documents/CCV-2026-0001/cancel', 'POST', ['reason' => 'Cavabsız zəng']);
check('tokensiz ləğv 419 qaytarır', $r['status'] === 419, $r['status']);

$s2 = session($base . '/admin/giris');
$r = req($base . '/api/documents/CCV-2026-9999/cancel', 'POST',
    ['reason' => 'Cavabsız zəng', '_token' => $s2['token']], $s2['cookies']);
check('mövcud olmayan sənəd 404 qaytarır', $r['status'] === 404, [$r['status'], substr($r['body'], 0, 120)]);

$r = req($base . '/api/documents/SALAM/cancel', 'POST',
    ['reason' => 'x', '_token' => $s2['token']], $s2['cookies']);
check('yanlış nömrə formatı 400 və ya 404 qaytarır', in_array($r['status'], [400, 404], true), $r['status']);

$r = req($base . '/api/documents', 'POST',
    ['title' => 'Ləğv sınağı', 'to' => 'A B', 'from' => 'C D',
     'templateId' => 'weekend-pass', '_token' => $s2['token']], $s2['cookies']);
$reg = json_decode($r['body'], true)['regNo'] ?? null;
check('sənəd yaradıldı', $reg !== null, [$r['status'], substr($r['body'], 0, 120)]);
/* Qonaq sətri məhz bu sorğuda yaranır və `zrf_uid` cookie-si cavabla gəlir —
   sahiblik yoxlaması üçün onu sonrakı sorğulara daşımaq lazımdır. */
$own = $s2['cookies'] . ($r['cookies'] !== '' ? '; ' . $r['cookies'] : '');
if ($reg !== null) {
    $r = req($base . '/api/documents/' . $reg . '/cancel', 'POST',
        ['reason' => 'Cavabsız zəng', '_token' => $s2['token']], $own);
    check('dərc olunmamış sənəd 409 qaytarır', $r['status'] === 409, [$r['status'], substr($r['body'], 0, 120)]);

    $s3 = session($base . '/admin/giris');
    $r = req($base . '/api/documents/' . $reg . '/cancel', 'POST',
        ['reason' => 'Cavabsız zəng', '_token' => $s3['token']], $s3['cookies']);
    check('özgə sənədi 403 qaytarır', $r['status'] === 403, [$r['status'], substr($r['body'], 0, 120)]);
}

echo "\n6. Ödəniş callback-i\n";
$r = req($base . '/api/payments/callback', 'POST', ['order_id' => 'ZRFYOXDUR', 'status' => 'success']);
check('naməlum sifariş kredit yazmır', $r['status'] !== 500 && ! str_contains($r['body'], 'credits'), [$r['status'], substr($r['body'], 0, 100)]);

echo "\n7. Admin paneli girişsiz açılmır\n";
foreach (['/admin', '/admin/senedler', '/admin/istifadeciler', '/admin/parametrler', '/admin/odenisler',
          '/admin/sablonlar', '/admin/sablonlar/yeni', '/admin/kateqoriyalar', '/admin/sablonlar/ixrac'] as $path) {
    $r = req($base . $path);
    check("{$path} → yönləndirilir", $r['status'] === 302, $r['status']);
}

echo "\n8. Şablon kilidi — saxta mətn sənədə düşmür\n";
$s4 = session($base . '/admin/giris');

$r = req($base . '/api/documents', 'POST',
    ['title' => 'X', 'to' => 'A B', 'from' => 'C D', '_token' => $s4['token']], $s4['cookies']);
check('templateId olmadan sənəd yaranmır', in_array($r['status'], [302, 422], true), $r['status']);

$r = req($base . '/api/documents', 'POST',
    ['title' => 'X', 'to' => 'A B', 'from' => 'C D',
     'templateId' => 'yoxdur-bele-sablon', '_token' => $s4['token']], $s4['cookies']);
check('naməlum şablon 422', $r['status'] === 422, [$r['status'], substr($r['body'], 0, 80)]);

$r = req($base . '/api/documents', 'POST', [
    'templateId' => 'weekend-pass',
    'title'      => 'SAXTA BAŞLIQ',
    'to'         => 'Günel Şəkərova',
    'from'       => 'Elvin Məmmədov',
    'powers'     => 'SAXTA BƏND',
    'penalty'    => 'SAXTA CƏZA',
    'preamble'   => 'SAXTA PREAMBLE',
    '_token'     => $s4['token'],
], $s4['cookies']);
$own4 = $s4['cookies'] . ($r['cookies'] !== '' ? '; ' . $r['cookies'] : '');
$d    = json_decode($r['body'], true);

check('sənəd yaradıldı', ($d['regNo'] ?? null) !== null, [$r['status'], substr($r['body'], 0, 120)]);
check('saxta başlıq rədd edilir', ! str_contains($d['title'] ?? '', 'SAXTA'), $d['title'] ?? null);
check('saxta bənd rədd edilir', ! str_contains($d['powers'] ?? '', 'SAXTA'), $d['powers'] ?? null);
check('saxta cəza rədd edilir', ! str_contains($d['penalty'] ?? '', 'SAXTA'), $d['penalty'] ?? null);
check('saxta preamble rədd edilir', ! str_contains($d['preamble'] ?? '', 'SAXTA'), substr($d['preamble'] ?? '', 0, 80));
check('başlıq şablondan gəlir', ($d['title'] ?? '') === 'Həftəsonu Çölə Çıxma Etibarnaməsi', $d['title'] ?? null);
check('preamble göndərilən adlarla qurulur',
    str_contains($d['preamble'] ?? '', 'Günel Şəkərova') && str_contains($d['preamble'] ?? '', 'Elvin Məmmədov'),
    substr($d['preamble'] ?? '', 0, 120));

/* Anketli şablon: preamble-ın `{{açar}}` hissəsi serverdə `answers`-dən qurulur.
   Bu, `App\Support\Answers` ilə `frontend/app.js` arasındakı fərqə qarşı yeganə netdir. */
$r = req($base . '/api/documents', 'POST', [
    'templateId' => 'cole-cixma-vizasi',
    'title'      => 'Çölə Çıxma Vizası',
    'to'         => 'Elvin Məmmədov',
    'from'       => 'Həyat yoldaşı',
    'answers'    => ['teyinat' => 'Mangal', 'radius' => 'Şəhər daxili', 'qayidis_vaxti' => '23:30'],
    'preamble'   => 'SAXTA PREAMBLE',
    '_token'     => $s4['token'],
], $own4);
$d2 = json_decode($r['body'], true);
check('anketli şablonda saxta preamble rədd edilir',
    ! str_contains($d2['preamble'] ?? '', 'SAXTA'), substr($d2['preamble'] ?? '', 0, 80));
check('anket cavabları preamble-a düşür',
    str_contains($d2['preamble'] ?? '', 'Mangal')
    && str_contains($d2['preamble'] ?? '', 'Şəhər daxili')
    && str_contains($d2['preamble'] ?? '', '23:30'),
    substr($d2['preamble'] ?? '', 0, 160));
check('doldurulmamış yer tutucu qalmır', ! str_contains($d2['preamble'] ?? '', '{{'), $d2['preamble'] ?? null);

/* Siyahıdan kənar ləğv səbəbi defolta düşür */
if (($d['regNo'] ?? null) !== null) {
    req($base . '/api/payments/simulate', 'POST', ['packId' => 'p1', '_token' => $s4['token']], $own4);
    req($base . '/api/documents/' . $d['regNo'] . '/publish', 'POST', ['_token' => $s4['token']], $own4);
    $r = req($base . '/api/documents/' . $d['regNo'] . '/cancel', 'POST',
        ['reason' => 'SAXTA SƏBƏB', '_token' => $s4['token']], $own4);
    $d3 = json_decode($r['body'], true);
    check('siyahıdan kənar ləğv səbəbi defolta düşür',
        ($d3['cancelReason'] ?? '') === 'Səbəb göstərilmədi', $d3['cancelReason'] ?? null);
}

echo "\n9. Kataloq yazma əməliyyatları qorunur\n";
foreach ([
    '/admin/kateqoriyalar/yeni' => 'kateqoriya yaratmaq',
    '/admin/sablonlar/yeni'     => 'şablon yaratmaq',
] as $path => $label) {
    $r = req($base . $path, 'POST', ['name' => 'X', 'slug' => 'x']);
    check("{$label} girişsiz mümkün deyil", in_array($r['status'], [302, 419], true), $r['status']);
}
$r = req($base . '/api/catalog');
$cat = json_decode($r['body'], true);
check('kataloq API-si açıqdır', $r['status'] === 200 && isset($cat['categories'], $cat['templates']), $r['status']);
check('kataloq boş deyil', count($cat['templates'] ?? []) > 0, count($cat['templates'] ?? []));

echo "\n10. Reyestr yalnız dərc olunmuş sənədi verir\n";
$r = req($base . '/api/registry/HACK-1-1');
check('yanlış format qəbul edilmir', in_array($r['status'], [400, 404, 429], true), $r['status']);

echo "\n" . $pass . ' keçdi, ' . $fail . " uğursuz\n";
exit($fail > 0 ? 1 : 0);
