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

echo "\n5. Ödəniş callback-i\n";
$r = req($base . '/api/payments/callback', 'POST', ['order_id' => 'ZRFYOXDUR', 'status' => 'success']);
check('naməlum sifariş kredit yazmır', $r['status'] !== 500 && ! str_contains($r['body'], 'credits'), [$r['status'], substr($r['body'], 0, 100)]);

echo "\n6. Admin paneli girişsiz açılmır\n";
foreach (['/admin', '/admin/senedler', '/admin/istifadeciler', '/admin/parametrler', '/admin/odenisler'] as $path) {
    $r = req($base . $path);
    check("{$path} → yönləndirilir", $r['status'] === 302, $r['status']);
}

echo "\n7. Reyestr yalnız dərc olunmuş sənədi verir\n";
$r = req($base . '/api/registry/HACK-1-1');
check('yanlış format qəbul edilmir', in_array($r['status'], [400, 404, 429], true), $r['status']);

echo "\n" . $pass . ' keçdi, ' . $fail . " uğursuz\n";
exit($fail > 0 ? 1 : 0);
