<?php

/**
 * Zarafat — mühit diaqnostikası.
 *
 * Laravel yüklənmədən işləyir: hansı addımın alınmadığını və necə düzəldiləcəyini göstərir.
 * İşlətmək:  php backend-php/doctor.php
 */

declare(strict_types=1);

$root = __DIR__;
$ok = 0; $problems = [];

$bold = "\033[1m"; $dim = "\033[2m"; $red = "\033[31m"; $grn = "\033[32m"; $ylw = "\033[33m"; $off = "\033[0m";

function head(string $t): void { global $bold, $off; echo "\n{$bold}▸ {$t}{$off}\n"; }
function good(string $t): void { global $ok, $grn, $off; $ok++; echo "  {$grn}✓{$off} {$t}\n"; }
function bad(string $t, string $fix): void {
    global $problems, $red, $off, $dim;
    $problems[] = [$t, $fix];
    echo "  {$red}✗{$off} {$t}\n    {$dim}→ {$fix}{$off}\n";
}
function note(string $t): void { global $ylw, $off; echo "  {$ylw}!{$off} {$t}\n"; }

/** .env faylını sadə şəkildə oxuyur (Laravel olmadan). */
function envFile(string $path): array
{
    if (! is_file($path)) {
        return [];
    }

    $out = [];
    foreach (file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [] as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#') || ! str_contains($line, '=')) {
            continue;
        }
        [$k, $v] = explode('=', $line, 2);
        $out[trim($k)] = trim(trim($v), "\"'");
    }

    return $out;
}

echo "{$bold}\n  ZARAFAT — MÜHİT DİAQNOSTİKASI{$off}\n";

/* ---------------------------------------------------------------- PHP */
head('PHP');

version_compare(PHP_VERSION, '8.2.0', '>=')
    ? good('Versiya ' . PHP_VERSION)
    : bad('PHP ' . PHP_VERSION . ' köhnədir', 'Ən azı 8.2 lazımdır (tövsiyə 8.4)');

foreach (['pdo', 'mbstring', 'openssl', 'curl', 'fileinfo', 'tokenizer'] as $ext) {
    extension_loaded($ext)
        ? good("Genişlənmə: {$ext}")
        : bad("Genişlənmə yoxdur: {$ext}", "php.ini-də 'extension={$ext}' sətrini aktivləşdirin");
}

$sqlite = extension_loaded('pdo_sqlite');
$mysql  = extension_loaded('pdo_mysql');
($sqlite || $mysql)
    ? good('Baza sürücüsü: ' . implode(', ', array_filter([$sqlite ? 'pdo_sqlite' : null, $mysql ? 'pdo_mysql' : null])))
    : bad('Nə pdo_sqlite, nə pdo_mysql var', 'Birini quraşdırın (lokal üçün pdo_sqlite kifayətdir)');

/* ---------------------------------------------------------------- Composer */
head('Paketlər');

is_file("$root/vendor/autoload.php")
    ? good('vendor/ quraşdırılıb')
    : bad('vendor/ yoxdur', 'cd backend-php && composer install');

if (is_file("$root/composer.json")) {
    $cj = json_decode((string) file_get_contents("$root/composer.json"), true);
    $lv = $cj['require']['laravel/framework'] ?? '?';
    good("composer.json: laravel/framework {$lv}");
}

/* ---------------------------------------------------------------- .env */
head('Konfiqurasiya');

$envPath = "$root/.env";
$env = envFile($envPath);

is_file($envPath)
    ? good('.env mövcuddur')
    : bad('.env yoxdur', 'cp .env.example .env && php artisan key:generate');

if ($env !== []) {
    str_starts_with($env['APP_KEY'] ?? '', 'base64:')
        ? good('APP_KEY təyin edilib')
        : bad('APP_KEY boşdur', 'php artisan key:generate');

    $appUrl = $env['APP_URL'] ?? '';
    $appUrl !== ''
        ? good("APP_URL: {$appUrl}   " . ($dim = '') . '(QR kodlar bu ünvana bağlanır)')
        : bad('APP_URL boşdur', '.env-də APP_URL=http://localhost:8000 yazın');

    $provider = $env['PAYMENT_PROVIDER'] ?? 'simulation';
    if ($provider === 'epoint') {
        (! empty($env['EPOINT_PUBLIC_KEY']) && ! empty($env['EPOINT_PRIVATE_KEY']))
            ? good('Epoint açarları yerindədir')
            : bad('PAYMENT_PROVIDER=epoint, amma açarlar boşdur', 'EPOINT_PUBLIC_KEY və EPOINT_PRIVATE_KEY əlavə edin');
    } else {
        good('Ödəniş provayderi: simulation (test rejimi)');
        if (($env['APP_ENV'] ?? 'local') === 'production') {
            note('İstehsalatda ALLOW_SIMULATED_PAYMENTS=false edin');
        }
    }

    /* AI köməkçisi istəyə bağlıdır — açar yoxdursa bu, səhv deyil. */
    $aiKey = trim((string) ($env['OPENAI_API_KEY'] ?? ''));
    if ($aiKey === '') {
        note('AI şablon köməkçisi bağlıdır (OPENAI_API_KEY boşdur) — istəyə bağlıdır');
    } else {
        good('AI köməkçisi açıqdır · model: ' . (($env['AI_MODEL'] ?? '') ?: 'gpt-5.5-mini')
            . ' (admin paneldən dəyişilə bilər)');
    }
}

/* ---------------------------------------------------------------- Baza */
head('Verilənlər bazası');

$conn = $env['DB_CONNECTION'] ?? 'sqlite';

try {
    if ($conn === 'sqlite') {
        $file = $env['DB_DATABASE'] ?? "$root/database/database.sqlite";
        if (! is_file($file)) {
            bad("SQLite faylı yoxdur: {$file}", 'touch backend-php/database/database.sqlite');
            throw new RuntimeException('skip');
        }
        good('SQLite faylı: ' . basename($file));
        $pdo = new PDO('sqlite:' . $file);
    } else {
        $dsn = sprintf('mysql:host=%s;port=%s;dbname=%s',
            $env['DB_HOST'] ?? '127.0.0.1', $env['DB_PORT'] ?? '3306', $env['DB_DATABASE'] ?? '');
        $pdo = new PDO($dsn, $env['DB_USERNAME'] ?? 'root', $env['DB_PASSWORD'] ?? '');
        good('MySQL bağlantısı quruldu');
    }

    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $tables = [];
    if ($conn === 'sqlite') {
        foreach ($pdo->query("SELECT name FROM sqlite_master WHERE type='table'") as $r) {
            $tables[] = $r['name'];
        }
    } else {
        foreach ($pdo->query('SHOW TABLES') as $r) {
            $tables[] = array_values($r)[0];
        }
    }

    $need = ['users', 'documents', 'payments', 'transactions', 'reports', 'settings', 'sessions'];
    $missing = array_values(array_diff($need, $tables));

    $missing === []
        ? good('Bütün cədvəllər yerindədir (' . count($tables) . ' cədvəl)')
        : bad('Cədvəllər çatışmır: ' . implode(', ', $missing), 'php artisan migrate --seed');

    if (in_array('users', $tables, true)) {
        $admins = (int) $pdo->query('SELECT COUNT(*) FROM users WHERE is_admin = 1')->fetchColumn();
        $users  = (int) $pdo->query('SELECT COUNT(*) FROM users')->fetchColumn();
        $docs   = in_array('documents', $tables, true)
            ? (int) $pdo->query('SELECT COUNT(*) FROM documents')->fetchColumn() : 0;

        $admins > 0
            ? good("İdarəçi hesabı: {$admins} · istifadəçi: {$users} · sənəd: {$docs}")
            : bad('İdarəçi hesabı yoxdur', 'php artisan db:seed');
    }
} catch (Throwable $e) {
    if ($e->getMessage() !== 'skip') {
        bad('Bazaya qoşulmaq alınmadı: ' . $e->getMessage(),
            $conn === 'sqlite'
                ? 'database/database.sqlite faylını yaradın'
                : '.env-dəki DB_HOST / DB_DATABASE / DB_USERNAME / DB_PASSWORD dəyərlərini yoxlayın');
    }
}

/* ---------------------------------------------------------------- İcazələr */
head('Qovluqlar');

foreach (['storage', 'storage/logs', 'storage/framework/views', 'storage/framework/sessions', 'bootstrap/cache'] as $dir) {
    $p = "$root/$dir";
    if (! is_dir($p)) {
        bad("Qovluq yoxdur: {$dir}", "mkdir -p backend-php/{$dir}");
    } elseif (! is_writable($p)) {
        bad("Yazıla bilmir: {$dir}", 'chmod -R 775 storage bootstrap/cache');
    } else {
        good("Yazıla bilir: {$dir}");
    }
}

/* ---------------------------------------------------------------- Frontend */
head('Frontend faylları');

$assets = ['app.js', 'doc.js', 'qr.js', 'templates.js', 'site.css', 'panel.css', 'fonts.css'];
$absent = array_values(array_filter($assets, fn ($f) => ! is_file("$root/public/assets/$f")));

$absent === []
    ? good('public/assets tamdır (' . count($assets) . ' fayl)')
    : bad('Assetlər çatışmır: ' . implode(', ', $absent), 'Layihənin kökündə: npm install && npm run build:laravel');

$fontDir = "$root/public/assets/fonts";
$fonts = is_dir($fontDir) ? glob("$fontDir/*.woff2") : [];
count($fonts) >= 8
    ? good('Şriftlər: ' . count($fonts) . ' fayl')
    : bad('Şrift faylları çatışmır (' . count($fonts) . '/8)', 'npm run build:laravel');

is_file("$root/resources/views/spa.blade.php")
    ? good('spa.blade.php yerindədir')
    : bad('spa.blade.php yoxdur', 'npm run build:laravel');

/* ---------------------------------------------------------------- Yekun */
echo "\n{$bold}────────────────────────────────────────{$off}\n";

if ($problems === []) {
    echo "  {$grn}{$bold}Hər şey qaydasındadır — {$ok} yoxlama keçdi.{$off}\n";
    echo "  Serveri başlatmaq üçün:  {$bold}cd backend-php && php artisan serve{$off}\n\n";
    exit(0);
}

echo "  {$ok} yoxlama keçdi, {$red}" . count($problems) . " problem{$off} var:\n\n";
foreach ($problems as $i => [$what, $fix]) {
    echo '  ' . ($i + 1) . ". {$what}\n     {$dim}{$fix}{$off}\n";
}
echo "\n  Düzəltmək alınmasa, bu siyahını mənə göndərin.\n\n";
exit(1);
