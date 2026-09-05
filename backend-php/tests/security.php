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

    return ['status' => $status, 'head' => $head, 'body' => substr($raw, $hlen), 'cookies' => implode('; ', $out)];
}

/** Səhifədən CSRF tokenini və sessiya cookie-lərini götürür. */
function session(string $url): array
{
    $r = req($url);
    preg_match('/name="_token" value="([^"]+)"/', $r['body'], $m);

    return ['token' => $m[1] ?? '', 'cookies' => $r['cookies']];
}

/** Dəvətnamə səhifələrində CSRF tokeni meta teqindədir, forma sahəsində yox. */
function metaSession(string $url): array
{
    $r = req($url);
    preg_match('/name="csrf-token" content="([^"]+)"/', $r['body'], $m);

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
/* Gözlənilən başlıq kataloqun ÖZÜNDƏN alınır. Sabit sətir yazılsaydı
   (əvvəl belə idi) hər mətn redaktəsi bu təhlükəsizlik testini yalançı
   şəkildə qırardı — yoxlanan şey isə başlığın mətni deyil, onun
   MÜŞTƏRİDƏN YOX, ŞABLONDAN gəlməsidir. */
$kat = json_decode(req($base . '/api/catalog', 'GET')['body'], true);
$gozlenen = '';
foreach ($kat['templates'] ?? [] as $t) {
    if (($t['id'] ?? '') === 'weekend-pass') {
        $gozlenen = (string) ($t['title'] ?? '');
    }
}
check('kataloqda weekend-pass var', $gozlenen !== '', $gozlenen);
check('başlıq şablondan gəlir', ($d['title'] ?? '') === $gozlenen, [$d['title'] ?? null, $gozlenen]);
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

/* Cavab sənədi qapıları. Kilid `DocumentService::resolveParent()`-dədir:
   klient yalnız nömrə göndərir, valideyni, tonu, mövzunu və dərinliyi server
   həll edir. Aşağıdakılar həmin qapıların hər birini ayrıca yoxlayır. */
echo "\n11. Cavab sənədi kilidi\n";
$s5 = session($base . '/admin/giris');

/* Cookie qabını AD ÜZRƏ birləşdirir. Sadə `a; b` yapışdırması eyni adlı
   cookie-ni iki dəfə göndərir (Laravel sessiyanı hər cavabda yenidən verir)
   və curl hansını seçdiyi qeyri-müəyyən olur — kredit başqa qonağa yazılır. */
$merge = static function (string $jar, string $add): string {
    $map = [];
    foreach (explode(';', $jar . ';' . $add) as $kv) {
        $kv = trim($kv);
        if ($kv === '') {
            continue;
        }
        [$k, $v] = array_pad(explode('=', $kv, 2), 2, '');
        if ($k !== '') {
            $map[$k] = $v;
        }
    }
    $out = [];
    foreach ($map as $k => $v) {
        $out[] = $k . '=' . $v;
    }

    return implode('; ', $out);
};

/* SIRA VACİBDİR: qonaq sətri ilk sənəd sorğusunda yaranır və `zrf_uid`
   cookie-si məhz onun cavabında gəlir. Krediti bundan əvvəl alsaq, o, BAŞQA
   qonağın balansına düşür və dərc «no_credits» verir. */
$r = req($base . '/api/documents', 'POST', [
    'templateId' => 'remote-control', 'title' => 'X', 'to' => 'Nurlan Aliyev',
    'from' => 'Rasad Quliyev', '_token' => $s5['token'],
], $s5['cookies']);
$own5 = $merge($s5['cookies'], $r['cookies']);
$orig = json_decode($r['body'], true)['regNo'] ?? null;
check('orijinal sənəd yaradıldı', $orig !== null, [$r['status'], substr($r['body'], 0, 120)]);

$r    = req($base . '/api/payments/simulate', 'POST', ['packId' => 'p10', '_token' => $s5['token']], $own5);
$own5 = $merge($own5, $r['cookies']);
check('kredit alındı', $r['status'] === 200, [$r['status'], substr($r['body'], 0, 80)]);

$r    = req($base . '/api/documents/' . $orig . '/publish', 'POST', ['_token' => $s5['token']], $own5);
$own5 = $merge($own5, $r['cookies']);
check('orijinal dərc olundu', $r['status'] === 200, [$r['status'], substr($r['body'], 0, 120)]);

/* Cavabın özü: nömrə serverdə valideynə çevrilir. */
$r = req($base . '/api/documents', 'POST', [
    'templateId' => 'r-redd-couples', 'title' => 'X', 'to' => 'Nurlan Aliyev',
    'from' => 'Rasad Quliyev', 'replyTo' => $orig, '_token' => $s5['token'],
], $own5);
$rep = json_decode($r['body'], true);
check('cavab sənədi yaradıldı', ($rep['regNo'] ?? null) !== null, [$r['status'], substr($r['body'], 0, 140)]);
check('cavab orijinala bağlandı', ($rep['replyTo'] ?? null) === $orig, $rep['replyTo'] ?? null);
check('cavab öz prefiksini aldı', str_starts_with((string) ($rep['regNo'] ?? ''), 'RDD-'), $rep['regNo'] ?? null);
check('dərinlik serverdə hesablanır', ($rep['replyDepth'] ?? null) === 1, $rep['replyDepth'] ?? null);
check('zəncirin mövzusu saxlanılır', ($rep['replyTopic'] ?? null) === 'couples', $rep['replyTopic'] ?? null);

$mk = static function (array $extra) use ($base, $s5, $own5): array {
    return req($base . '/api/documents', 'POST', array_merge([
        'title' => 'X', 'to' => 'Nurlan Aliyev', 'from' => 'Rasad Quliyev',
        '_token' => $s5['token'],
    ], $extra), $own5);
};

/* Adi şablon cavab kimi göndərilə bilməz — əks halda istənilən sənəd
   özgəsinin zəncirinə yapışdırılardı. */
$r = $mk(['templateId' => 'weekend-pass', 'replyTo' => $orig]);
check('adi şablon + replyTo 422', $r['status'] === 422, [$r['status'], substr($r['body'], 0, 80)]);

/* Cavab şablonu tək başına işlədilə bilməz — bu qayda cavab kataloqunu
   ana axından tam kənarda saxlayır. */
$r = $mk(['templateId' => 'r-redd-couples']);
check('cavab şablonu replyTo-suz 422', $r['status'] === 422, [$r['status'], substr($r['body'], 0, 80)]);

$r = $mk(['templateId' => 'r-redd-couples', 'replyTo' => 'ZRF-2026-0001']);
check('mövcud olmayan orijinal 422', $r['status'] === 422, [$r['status'], substr($r['body'], 0, 80)]);

$r = $mk(['templateId' => 'r-redd-couples', 'replyTo' => 'HACK-1-1']);
check('yanlış formatlı nömrə 422', $r['status'] === 422, [$r['status'], substr($r['body'], 0, 80)]);

/* Mövzu uyğunluğu: oyunçu cavabı cütlüklər sənədinə düşmür. */
$r = $mk(['templateId' => 'r-redd-gaming', 'replyTo' => $orig]);
check('uyğun olmayan kateqoriya 422', $r['status'] === 422, [$r['status'], substr($r['body'], 0, 80)]);

/* Ton uyğunluğu: xatirə cavabı zarafat sənədinə yapışdırıla bilməz. */
$r = $mk(['templateId' => 'r-xatire-tesekkur', 'replyTo' => $orig]);
check('ton uyğunsuzluğu 422', $r['status'] === 422, [$r['status'], substr($r['body'], 0, 80)]);

/* Universal cavab isə hər mövzuya keçir — ehtiyat dəst budur. */
$r = $mk(['templateId' => 'r-redd-umumi', 'replyTo' => $orig]);
check('universal cavab qəbul edilir', $r['status'] === 200, [$r['status'], substr($r['body'], 0, 80)]);

/* Dərc olunmamış sənəd reyestrdə yoxdur — ona cavab da yoxdur. */
$r = $mk(['templateId' => 'remote-control']);
$draft = json_decode($r['body'], true)['regNo'] ?? null;
$r = $mk(['templateId' => 'r-redd-umumi', 'replyTo' => $draft]);
check('dərc olunmamış sənədə cavab 422', $r['status'] === 422, [$r['status'], substr($r['body'], 0, 80)]);

echo "\n12. Ölçmə endpoint-i ağ siyahıdadır\n";
$r = req($base . '/api/olcu', 'POST', ['event' => 'reply_click', 'regNo' => $orig, '_token' => $s5['token']], $own5);
check('tanınan hadisə qəbul edilir', $r['status'] === 200, [$r['status'], substr($r['body'], 0, 80)]);

$r = req($base . '/api/olcu', 'POST', ['event' => 'drop_table', 'regNo' => $orig, '_token' => $s5['token']], $own5);
check('naməlum hadisə 422', $r['status'] === 422, [$r['status'], substr($r['body'], 0, 80)]);

$r = req($base . '/api/olcu', 'POST', ['event' => 'reply_created', 'regNo' => $orig, '_token' => $s5['token']], $own5);
check('server hadisəsi klientdən qəbul edilmir', $r['status'] === 422, [$r['status'], substr($r['body'], 0, 80)]);

$r = req($base . '/api/olcu', 'POST', ['event' => 'reply_click']);
check('tokensiz ölçmə 419', $r['status'] === 419, $r['status']);

echo "\n13. Dəvətnamə — server məzmuna sahibdir\n";

$ds = metaSession($base . '/devetname');
check('dəvətnamə səhifəsi CSRF tokeni verir', $ds['token'] !== '');

/* CSRF olmadan yazma yolu bağlıdır. */
$r = req($base . '/api/devet', 'POST', ['design' => 'toy-qizil'], $ds['cookies']);
check('tokensiz dəvətnamə yaradılmır', $r['status'] === 419, $r['status']);

/* Dizayn adı ağ siyahıdadır — müştəri uydurma dizayn göndərə bilmir. */
$r = req($base . '/api/devet', 'POST',
    ['_token' => $ds['token'], 'design' => 'yoxdur-bele-dizayn'], $ds['cookies']);
check('naməlum dizayn 422', $r['status'] === 422, [$r['status'], substr($r['body'], 0, 90)]);

/* Xəritə linki server tərəfdə ağ siyahıdan keçir: əks halda dəvətnamə
   açıq yönləndirmə vasitəsinə çevrilərdi — qonaq «Xəritədə göstər»
   düyməsinə basıb kənar sayta düşərdi. */
$r = req($base . '/api/devet', 'POST', [
    '_token'  => $ds['token'],
    'design'  => 'toy-qizil',
    'hosts'   => 'Test Tədbiri',
    'address' => 'Bakı, Test küç. 1',
    'mapUrl'  => 'https://pis.example/yonlendirme',
    'phone'   => '+994 55 555 55 55',
], $ds['cookies']);
$own = $ds['cookies'] . ($r['cookies'] !== '' ? '; ' . $r['cookies'] : '');
$inv = json_decode($r['body'], true);
check('dəvətnamə yaradıldı', ($inv['token'] ?? null) !== null, [$r['status'], substr($r['body'], 0, 120)]);
check('kənar xəritə linki saxlanılmır',
    ! str_contains((string) ($inv['mapUrl'] ?? ''), 'pis.example'), $inv['mapUrl'] ?? null);
check('ünvandan təhlükəsiz xəritə linki qurulur',
    str_starts_with((string) ($inv['mapUrl'] ?? ''), 'https://www.google.com/maps/search/'), $inv['mapUrl'] ?? null);

$tok = (string) ($inv['token'] ?? '');
check('token 22 simvoldur', strlen($tok) === 22, $tok);

/* Dərc olunmayan dəvətnamə heç kimə görünmür. */
check('dərc olunmamış dəvətnamə API-də yoxdur',
    req($base . '/api/devet/' . $tok, 'GET', [], $own)['status'] === 404);
check('dərc olunmamışa cavab verilmir',
    req($base . '/api/devet/' . $tok . '/cavab', 'POST',
        ['_token' => $ds['token'], 'rsvp' => 'gelirem', 'name' => 'X Y'], $own)['status'] === 404);
check('önizləmə şəkli yoxdursa 404', req($base . '/d/' . $tok . '/on.jpg')['status'] === 404);

/* Şəkil açıq verildiyi üçün növü və ölçüsü mütləq yoxlanılmalıdır. */
$r = req($base . '/api/devet/' . $tok . '/onizleme', 'POST',
    ['_token' => $ds['token'], 'x' => 'bu JPEG deyil'], $own);
check('JPEG olmayan önizləmə rədd edilir', $r['status'] === 422, $r['status']);

/* Başqasının dəvətnaməsində 403 yox, 404 qaytarılır — «403» cavabı
   tokenin mövcudluğunu təsdiqləyərdi. */
$yad = metaSession($base . '/devetname');
check('yad adam qonaq siyahısını görmür',
    req($base . '/api/devet/' . $tok . '/qonaqlar', 'GET', [], $yad['cookies'])['status'] === 404);
check('yad adam lövhəni görmür',
    req($base . '/devetnamelerim/' . $tok, 'GET', [], $yad['cookies'])['status'] === 404);
check('yad adam dərc edə bilmir',
    in_array(req($base . '/api/devet/' . $tok . '/derc', 'POST',
        ['_token' => $yad['token']], $yad['cookies'])['status'], [403, 404], true));

check('qısa token marşrutu tutmur', req($base . '/d/qisa')['status'] === 404);
check('uzun token marşrutu tutmur', req($base . '/d/' . str_repeat('a', 30))['status'] === 404);

$r = req($base . '/devetname');
check('redaktor səhifəsi noindex-dir', str_contains(strtolower($r['body']), 'noindex'));
$rob = req($base . '/robots.txt');
check('robots.txt dəvətnamə yollarını bağlayır',
    str_contains($rob['body'], 'Disallow: /d/')
    && str_contains($rob['body'], 'Disallow: /devetnamelerim'), substr($rob['body'], 0, 160));

echo "\n14. İş qovluğu — sirr serverdə qalır\n";

$SLUG = '2026-0847';
$is = metaSession($base . '/is/' . $SLUG . '/qovluq');
check('qovluq səhifəsi CSRF tokeni verir', $is['token'] !== '');

/* Səhifənin MƏNBƏ KODU. Oyunun bütün mənası budur: DevTools açan adam
   nə kodu, nə cavabı, nə də açılmamış sənədin məzmununu görməməlidir. */
$govde = req($base . '/is/' . $SLUG . '/qovluq')['body'];
check('kilidin kodu HTML-də yoxdur', ! str_contains($govde, '0903'));
check('sənəd məzmunu HTML-də yoxdur', ! str_contains($govde, 'mərmər lövhə'));
check('şübhəlilər HTML-də yoxdur', ! str_contains($govde, 'Səbinə Hüseynova'));
check('izah HTML-də yoxdur', ! str_contains($govde, 'Generator 00:32-də'));
/* İŞİN SONLUĞU — dindirilmə protokolu və məhkəmə qərarı. Onlar qovluğun
   vərəqləridir, amma yalnız iş bağlandıqdan sonra açılır: adı belə
   sızsaydı, oyunçu materiallar siyahısında qatilin etirafını görərdi. */
check('sonluq vərəqinin adı HTML-də yoxdur', ! str_contains($govde, 'dindirilmə protokolu'));
check('məhkəmə qərarı HTML-də yoxdur', ! str_contains($govde, 'Məhkəmə qərarı'));
check('oyun səhifəsi noindex-dir', str_contains(strtolower($govde), 'noindex'));

/* SATIŞ ÜZÜ. Ana səhifə HƏQİQİ sənəd göstərir (hero və nümunə vərəqlər),
   ona görə sirr yoxlaması burada oyun səhifəsindən də vacibdir. */
$ana = req($base . '/is')['body'];
check('ana səhifədə kilidin kodu yoxdur', ! str_contains($ana, '0903'));
check('ana səhifədə şübhəlilər yoxdur', ! str_contains($ana, 'Səbinə Hüseynova'));
check('ana səhifədə izah yoxdur', ! str_contains($ana, 'Generator 00:32-də'));
check('ana səhifədə açar sənəd yoxdur', ! str_contains($ana, 'GENERATOR QURĞUSUNUN'));
/* Satış səhifələri axtarışa AÇIQDIR — kataloq məxfi məlumat deyil. */
check('ana səhifə indekslənir', str_contains($ana, 'index, follow'));

$teq = req($base . '/is/' . $SLUG)['body'];
check('təqdimatda sənəd məzmunu yoxdur', ! str_contains($teq, 'mərmər lövhə'));
check('təqdimatda sonluq vərəqi yoxdur', ! str_contains($teq, 'Məhkəmə qərarı'));
check('təqdimatda şübhəlilər yoxdur', ! str_contains($teq, 'Səbinə Hüseynova'));
check('təqdimat indekslənir', str_contains($teq, 'index, follow'));

/* FİKTİV QURUM. Sənədlər rəsmi sənədin vizual dilini təqlid edir, ona görə
   fiktivlik artefaktın ÖZ ÜZƏRİNDƏ olmalıdır — ekran görüntüsü kontekstdən
   qopanda ətrafdakı səhifə onunla getmir. */
$QEYD = 'FİKTİV OYUN SƏNƏDİ';
$QADAGAN = ['POLİS BÖLMƏSİ', 'POLİS İDARƏSİ', 'DAXİLİ İŞLƏR', 'ədliyyə leytenantı',
    'ədliyyə mayoru', 'Məhkəmə-tibb eksperti'];

foreach (['/is', '/is/' . $SLUG, '/is/' . $SLUG . '/qovluq'] as $yol) {
    $b = req($base . $yol)['body'];
    $tapilan = array_values(array_filter($QADAGAN, static fn ($q) => str_contains($b, $q)));
    check('real qurum yoxdur: ' . $yol, $tapilan === [], $tapilan);
}
check('ana səhifədə fiktivlik qeydi var', str_contains($ana, $QEYD));
check('üz qabığında büro adı var', str_contains($govde, 'FİKTİV İSTİNTAQ BÜROSU'));

/* Ödəniş qatı yalnız görünüş deyil: giriş olmadan məzmun ucu bağlıdır. */
$r = req($base . '/api/is/' . $SLUG . '/sened/1', 'GET', [], $is['cookies']);
check('giriş olmadan sənəd verilmir', $r['status'] === 403, $r['status']);
$r = req($base . '/api/is/' . $SLUG . '/rey', 'POST',
    ['_token' => $is['token'], 'cavablar' => [0, 1, 1]], $is['cookies']);
check('giriş olmadan rəy qəbul edilmir', $r['status'] === 403, $r['status']);

/* CSRF olmadan yazma yolu bağlıdır. */
$r = req($base . '/api/is/' . $SLUG . '/ac', 'POST', ['ad' => 'Test Ad'], $is['cookies']);
check('tokensiz qovluq açılmır', $r['status'] === 419, $r['status']);

$r = req($base . '/api/is/' . $SLUG . '/ac', 'POST',
    ['_token' => $is['token'], 'ad' => 'Test Ad'], $is['cookies']);
$acildi = json_decode($r['body'], true);
$own = $is['cookies'] . ($r['cookies'] !== '' ? '; ' . $r['cookies'] : '');
check('qovluq açıldı', ($acildi['ok'] ?? false) === true, [$r['status'], substr($r['body'], 0, 120)]);
check('cavabda düzgün variant göstərilmir',
    ! str_contains($r['body'], 'correct') && ! str_contains($r['body'], '0903'));

$kilidli = null;
foreach ((array) ($acildi['docs'] ?? []) as $d) {
    if (($d['locked'] ?? false) === true) { $kilidli = (int) $d['id']; break; }
}
check('kilidli sənəd siyahıda var', $kilidli !== null);

/* Sənədin ÖZÜ qeydi daşımalıdır: `sened.blade.php` sarğısı onu məcburi
   əlavə edir və heç bir sənəd növü ondan yayına bilmir. */
/* Sənəd id-si seed-dən sonra dəyişir — siyahıdan götürülür, sabit yazılmır. */
$docs = (array) ($acildi['docs'] ?? []);
$ilk = (int) ($docs[0]['id'] ?? 0);
$r = req($base . '/api/is/' . $SLUG . '/sened/' . $ilk, 'GET', [], $own);
$sened = json_decode($r['body'], true);
$html = (string) ($sened['html'] ?? '');
check('sənəd render olundu', $html !== '', $r['status']);
check('sənədin üzərində fiktivlik qeydi var', str_contains($html, $QEYD));
check('qeyd markeri var', str_contains($html, 'data-fq="1"'));
check('sənəd başlığı büro kodu daşıyır', str_contains($html, 'AFİB'));

/* SIRA QAPISI — vərəq yalnız ondan ƏVVƏLKİLƏR keçiləndən sonra açılır.
   Qapı serverdədir: qabıq bağlı sətri sönük göstərir, amma bu ünvan
   birbaşa da çağırıla bilər. Yuxarıda yalnız BİRİNCİ vərəq oxunub. */
$uzaq = (int) ($docs[5]['id'] ?? 0);
$r = req($base . '/api/is/' . $SLUG . '/sened/' . $uzaq, 'GET', [], $own);
check('sıradan kənar vərəq 403 verir', $r['status'] === 403, $r['status']);

/* Yekun rəy də bağlıdır — və bu, CƏHD SAYILMIR: aşağıdakı kilid
   yoxlamaları hələ üç cəhdin heç birini yandırmamalıdır. */
$r = req($base . '/api/is/' . $SLUG . '/rey', 'POST',
    ['_token' => $is['token'], 'cavablar' => [0, 1, 1]], $own);
check('bütün vərəqlər keçilmədən rəy qəbul edilmir', $r['status'] === 403, $r['status']);

/* Qovluğu sıra ilə keçirik — kilidli sənəd sonuncudur və ona qapıdan
   keçmədən çatmaq olmur. */
foreach ($docs as $d) {
    req($base . '/api/is/' . $SLUG . '/sened/' . (int) $d['id'], 'GET', [], $own);
}

/* KİLİD NÖV DEYİL, XASSƏDİR: istənilən blok tərkibi kilidli ola bilər və
   kilidli sənədin BLOKLARI ümumiyyətlə brauzerə göndərilmir — yalnız
   klaviatura render olunur. */
$kr = req($base . '/api/is/' . $SLUG . '/sened/' . $kilidli, 'GET', [], $own);
$khtml = (string) (json_decode($kr['body'], true)['html'] ?? '');
check('kilidli sənəddə klaviatura var', str_contains($khtml, 'lockwrap'));
check('kilidli sənədin blokları göndərilmir',
    ! str_contains($khtml, 'QUTUNUN İÇİNDƏKİLƏR') && ! str_contains($khtml, 'ev-t'));
check('kilidli sənəd də fiktivlik qeydi daşıyır', str_contains($khtml, $QEYD));
$tapilan = array_values(array_filter($QADAGAN, static fn ($q) => str_contains($html, $q)));
check('sənəddə real qurum yoxdur', $tapilan === [], $tapilan);

/* Səhv kod nə ipucu, nə də kodun özünü qaytarır. */
$r = req($base . '/api/is/' . $SLUG . '/kilid/' . $kilidli, 'POST',
    ['_token' => $is['token'], 'kod' => '1111'], $own);
check('səhv kod 422 verir', $r['status'] === 422, $r['status']);
check('səhv kodun cavabı kodu açmır', ! str_contains($r['body'], '0903'));

/* Dörd rəqəm limitsiz halda dəqiqələr içində tapılardı — kilidin əsl
   qorunması `throttle:dossier-kilid` limitidir. */
$limit = false;
for ($i = 0; $i < 14; $i++) {
    $r = req($base . '/api/is/' . $SLUG . '/kilid/' . $kilidli, 'POST',
        ['_token' => $is['token'], 'kod' => str_pad((string) $i, 4, '0', STR_PAD_LEFT)], $own);
    if ($r['status'] === 429) { $limit = true; break; }
}
check('kilid cəhdləri limitlənir', $limit);

/* Başqasının irəliləyişi görünmür: yeni ziyarətçi eyni qovluğa girişsizdir. */
$yad = metaSession($base . '/is/' . $SLUG);
$r = req($base . '/api/is/' . $SLUG . '/sened/1', 'GET', [], $yad['cookies']);
check('yad ziyarətçi başqasının qovluğunu aça bilmir', $r['status'] === 403, $r['status']);

check('naməlum qovluq 404', req($base . '/is/9999-9999')['status'] === 404);
check('səhv formatlı slug marşrutu tutmur', req($base . '/is/pis-slug')['status'] === 404);

$rob = req($base . '/robots.txt');
check('robots.txt oyunu və sertifikatı bağlayır',
    str_contains($rob['body'], 'Disallow: /is/*/qovluq')
    && str_contains($rob['body'], 'Disallow: /is/*/hesabat/'));
/* Ümumi `Disallow: /is/` qayıtsa, satış səhifələri də axtarışdan düşərdi. */
check('robots.txt satış səhifələrini bağlamır',
    preg_match('#^Disallow: /is/\s*$#m', $rob['body']) === 0);

echo "\n15. Müstəntiq profili — kimlik və gizlilik\n";

/* İNDEKSLƏMƏ HƏR İKİ İSTİQAMƏTDƏ.

   Profil və hesab BAĞLIDIR: orada real adamın adı və şəkli var.
   Reytinq isə AÇIQDIR — o, `/is` və `/is/{slug}` kimi satış üzüdür.
   Ümumi `Disallow: /is/` qayıtsa hər üçü birdən düşərdi. */
$prof = req($base . '/is/mustentiq');
check('profil səhifəsi açılır', $prof['status'] === 200, $prof['status']);
check('profil səhifəsi noindex-dir', str_contains(strtolower($prof['body']), 'noindex'));

$reyt = req($base . '/is/reyting');
check('reytinq açılır', $reyt['status'] === 200, $reyt['status']);
check('reytinq indekslənir', str_contains($reyt['body'], 'index, follow'));

check('robots.txt profili bağlayır', str_contains($rob['body'], 'Disallow: /is/mustentiq'));
check('robots.txt hesabı bağlayır', str_contains($rob['body'], 'Disallow: /is/hesab'));
check('robots.txt reytinqi BAĞLAMIR', ! str_contains($rob['body'], 'Disallow: /is/reyting'));

/* REYTİNQ ŞƏXSİ MƏLUMAT SIZDIRMIR. Görünən yeganə ad istifadəçinin
   ÖZÜNÜN seçdiyi addır; e-poçt və uuid heç vaxt siyahıya düşmür. */
check('reytinqdə e-poçt yoxdur', ! preg_match('/@[a-z0-9.-]+\.[a-z]{2,}/i', strip_tags($reyt['body'])));
check('reytinqdə uuid yoxdur',
    preg_match('/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/', $reyt['body']) === 0);

/* QONAĞIN VƏSİQƏSİ YOXDUR — kartın qazanılan bir şey olması bütün
   mexanizmin özəyidir. */
check('qonağa vəsiqə göstərilmir', ! str_contains($prof['body'], 'Vəsiqəni endir'));
check('qonağa qeydiyyat təklif olunur', str_contains($prof['body'], 'Qeydiyyatdan keç'));

/* Şəkil ucu: mövcud olmayan profil üçün 404 — 403 deyil.
   «İcazə yoxdur» mesajının özü məlumatdır. */
$r = req($base . '/is/mustentiq/999999/foto.jpg');
check('naməlum profilin şəkli 404 verir', $r['status'] === 404, $r['status']);

/* CSRF olmadan yazma yolu bağlıdır. */
$pv = metaSession($base . '/is/hesab');
$r = req($base . '/is/mustentiq/sobe', 'POST', ['sobe' => 'KR'], $pv['cookies']);
check('tokensiz şöbə seçilmir', $r['status'] === 419, $r['status']);

/* İdarə paneli qapalıdır. */
foreach (['/admin/avatarlar'] as $yol) {
    $r = req($base . $yol);
    check('giriş olmadan ' . $yol . ' bağlıdır', in_array($r['status'], [302, 403], true), $r['status']);
}


/* ==================================================================
   15. Giriş yolları — Google OAuth və avtomatik qonaq qeydiyyatı
   ================================================================== */
echo "\n15. Giriş yolları\n";

/* AÇIQ YÖNLƏNDİRMƏ OLMAMALIDIR. `?davam=` marşrut adı deyil, ağ siyahı
   açarıdır; kənar ünvan verilsə default-a düşməlidir. Bu, bölmənin ən
   çox səhv edilən yeridir: «girişdən sonra hara qayıdaq» parametri
   dünyada ən çox istismar olunan açıq yönləndirmə səthidir. */
foreach (['https://evil.example/', '//evil.example', '/admin', 'http://evil'] as $pis) {
    $r = req($base . '/giris/google?davam=' . rawurlencode($pis));
    $yer = '';
    if (preg_match('/^Location:\s*(.+)$/mi', (string) $r['head'], $m)) { $yer = trim($m[1]); }
    /* Açar tanınmırsa ya konfiqurasiya yoxdur (kabinetə qayıdış), ya da
       Google-a gedir — hər iki halda `evil.example` görünməməlidir. */
    check('«' . $pis . '» yönləndirməsi qəbul edilmir',
        stripos($yer, 'evil') === false && stripos($yer, '/admin') !== 0, $yer);
}

/* Cavab ucu — `state` uyğun gəlmədikdə giriş baş tutmamalıdır. Sessiyada
   heç nə yoxdursa da eyni cavab: 302 + xəta, heç vaxt giriş. */
$r = req($base . '/giris/google/cavab?code=OGURLANMIS&state=YALAN');
check('yad state ilə giriş olmur', $r['status'] === 302, $r['status']);
check('yad state sessiya açmır', stripos($r['cookies'], 'remember_web') === false, $r['cookies']);

/* Avtomatik qonaq qeydiyyatı: sətir YARANIR və ADI OLUR. Adsız sətir
   iş qovluğu bölməsində reytinqdə «—» kimi çıxırdı. */
$evvel = usersCount();
$sn = session($base . '/is/hesab');   // səhifənin özü qonaq sətrini yaradır
$r  = req($base . '/qonaq', 'POST', ['_token' => $sn['token'], 'davam' => 'is'], $sn['cookies']);
check('qonaq kimi davam 302 verir', $r['status'] === 302, $r['status']);
check('qonaq sətri avtomatik yaranıb', usersCount() > $evvel, usersCount() . ' / ' . $evvel);

$db = new PDO('sqlite:' . __DIR__ . '/../database/database.sqlite');
$son = $db->query('SELECT name, email, auto_name FROM users ORDER BY id DESC LIMIT 1')->fetch(PDO::FETCH_ASSOC);
check('qonağın avtomatik adı var', (bool) preg_match('/^Qonaq-\d{4,}$/', (string) ($son['name'] ?? '')), $son['name'] ?? '');
check('qonaq e-poçtsuz qalır', ($son['email'] ?? null) === null, $son['email'] ?? 'NULL');
check('avtomatik ad işarələnib', (int) ($son['auto_name'] ?? 0) === 1, $son['auto_name'] ?? '');

/* CSRF olmadan qonaq marşrutu da bağlıdır — yazma yoludur. */
$r = req($base . '/qonaq', 'POST', ['davam' => 'is'], $sn['cookies']);
check('tokensiz qonaq marşrutu bağlıdır', $r['status'] === 419, $r['status']);

/* AÇARLAR SƏHİFƏYƏ SIZMIR. `client_secret` heç bir halda HTML-də
   görünməməlidir; `client_id` isə Google-un ünvanında onsuz da açıqdır,
   amma sirr olan digəri ilə bir yerdə yoxlanılır. */
$env = @file_get_contents(__DIR__ . '/../.env');
$sirr = '';
if (is_string($env) && preg_match('/^GOOGLE_CLIENT_SECRET=(.+)$/m', $env, $m)) { $sirr = trim($m[1]); }
foreach (['/is/hesab', '/kabinet/hesab'] as $yol) {
    $r = req($base . $yol);
    check($yol . ' sirri sızdırmır',
        $sirr === '' || stripos($r['body'], $sirr) === false);
}

echo "\n" . $pass . ' keçdi, ' . $fail . " uğursuz\n";
exit($fail > 0 ? 1 : 0);
