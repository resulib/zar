<?php

/**
 * Laravel qurulmadan aparıla bilən statik yoxlamalar:
 *   1. Bütün PHP fayllarının sintaksisi
 *   2. Blade direktivlərinin balansı (@if/@endif, @foreach/@endforeach, ...)
 *   3. Görünüşlərdə istifadə olunan route() adlarının routes/web.php-də mövcudluğu
 *   4. Controller-lərin qaytardığı view adlarının fayl kimi mövcudluğu
 *   5. @extends/@include ilə çağırılan görünüşlərin mövcudluğu
 *
 * İşlətmək:  php tests/audit.php
 */

declare(strict_types=1);

$root = dirname(__DIR__);
$pass = 0;
$fail = 0;

function ok(string $m): void   { global $pass; $pass++; echo "  ✓ {$m}\n"; }
function bad(string $m): void  { global $fail; $fail++; echo "  ✗ {$m}\n"; }

/** @return list<string> */
function files(string $dir, string $ext): array
{
    if (! is_dir($dir)) {
        return [];
    }

    $out = [];
    $it  = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir, FilesystemIterator::SKIP_DOTS));

    foreach ($it as $f) {
        if ($f->isFile() && str_ends_with($f->getFilename(), $ext)) {
            $out[] = $f->getPathname();
        }
    }

    sort($out);

    return $out;
}

/* ---------------------------------------------------------------- 1 */
echo "\n1. PHP sintaksisi\n";
$php = array_merge(
    files("$root/app", '.php'),
    files("$root/config", '.php'),
    files("$root/database", '.php'),
    files("$root/routes", '.php'),
    files("$root/bootstrap", '.php'),
    files("$root/public", '.php'),
    files("$root/tests", '.php'),
);

$badSyntax = [];
foreach ($php as $f) {
    exec('php -l ' . escapeshellarg($f) . ' 2>&1', $out, $code);
    if ($code !== 0) {
        $badSyntax[] = str_replace("$root/", '', $f) . ': ' . implode(' ', $out);
    }
    $out = [];
}

count($badSyntax) === 0
    ? ok(count($php) . ' PHP faylının hamısı sintaktik düzgündür')
    : bad('sintaksis xətaları: ' . implode(' | ', $badSyntax));

/* ---------------------------------------------------------------- 2 */
echo "\n2. Blade direktiv balansı\n";
$views  = files("$root/resources/views", '.blade.php');
$pairs  = [
    'if' => 'endif', 'foreach' => 'endforeach', 'forelse' => 'endforelse',
    'for' => 'endfor', 'while' => 'endwhile', 'section' => 'endsection',
    'php' => 'endphp', 'auth' => 'endauth', 'guest' => 'endguest',
    'isset' => 'endisset', 'empty' => 'endempty', 'verbatim' => 'endverbatim',
];

$unbalanced = [];
foreach ($views as $view) {
    $src  = (string) file_get_contents($view);
    $name = str_replace("$root/resources/views/", '', $view);

    foreach ($pairs as $open => $close) {
        // @section('ad') tək sətirlik variantda bağlanmır — onları saymırıq
        if ($open === 'section') {
            preg_match_all('/@section\s*\(([^)]*)\)/', $src, $m);
            $opens = 0;
            foreach ($m[1] as $args) {
                if (substr_count($args, ',') === 0) {
                    $opens++;                       // @section('ad') → bağlanmalıdır
                }
            }
            $closes = preg_match_all('/@endsection\b/', $src);
        } elseif ($open === 'php') {
            // @php(...) tək sətirlik formadır və bağlanmır; blok forması @php-dir
            $opens  = preg_match_all('/@php(?!\s*\()/', $src);
            $closes = preg_match_all('/@endphp\b/', $src);
        } elseif ($open === 'empty') {
            // @forelse içindəki @empty budaqdır; blok forması @empty($var)-dır
            $opens  = preg_match_all('/@empty\s*\(/', $src);
            $closes = preg_match_all('/@endempty\b/', $src);
        } else {
            $opens  = preg_match_all('/@' . $open . '\s*[\(\s]/', $src);
            $closes = preg_match_all('/@' . $close . '\b/', $src);
        }

        if ($opens !== $closes) {
            $unbalanced[] = "{$name}: @{$open} × {$opens} ≠ @{$close} × {$closes}";
        }
    }
}

count($unbalanced) === 0
    ? ok(count($views) . ' Blade faylında direktivlər balanslıdır')
    : bad('balanssız direktivlər: ' . implode(' | ', $unbalanced));

/* ---------------------------------------------------------------- 3 */
echo "\n3. route() adları\n";
$routesSrc = (string) file_get_contents("$root/routes/web.php");

// ->name('x') zəncirləri və qrup adları
preg_match_all("/->name\('([^']+)'\)/", $routesSrc, $m);
$leafNames = $m[1];

preg_match_all("/->name\('([^']+)'\)->group/", $routesSrc, $gm);
preg_match_all("/name\('([^']+)'\)->group/", $routesSrc, $gm2);
$groupPrefixes = array_unique(array_merge($gm[1], $gm2[1]));

$defined = [];
foreach ($leafNames as $n) {
    if (in_array($n, $groupPrefixes, true)) {
        continue;                                   // qrup prefiksidir, marşrut deyil
    }
    $defined[] = $n;
    foreach ($groupPrefixes as $p) {
        $defined[] = $p . $n;
    }
}
$defined = array_unique($defined);

$used = [];
foreach ($views as $view) {
    preg_match_all("/route\('([^']+)'/", (string) file_get_contents($view), $rm);
    foreach ($rm[1] as $n) {
        $used[$n] = str_replace("$root/resources/views/", '', $view);
    }
}
foreach (files("$root/app/Http/Controllers", '.php') as $c) {
    preg_match_all("/route\('([^']+)'/", (string) file_get_contents($c), $rm);
    foreach ($rm[1] as $n) {
        $used[$n] = str_replace("$root/", '', $c);
    }
}

$missing = [];
foreach ($used as $name => $where) {
    if (! in_array($name, $defined, true)) {
        $missing[] = "{$name} ({$where})";
    }
}

count($missing) === 0
    ? ok(count($used) . ' route() adının hamısı routes/web.php-də mövcuddur')
    : bad('tapılmayan route adları: ' . implode(' | ', $missing));

/* ---------------------------------------------------------------- 4 */
echo "\n4. Controller → view\n";
$missingViews = [];
foreach (files("$root/app/Http/Controllers", '.php') as $c) {
    preg_match_all("/view\('([^']+)'/", (string) file_get_contents($c), $vm);
    foreach ($vm[1] as $v) {
        $path = "$root/resources/views/" . str_replace('.', '/', $v) . '.blade.php';
        if (! file_exists($path)) {
            $missingViews[] = $v . ' (' . str_replace("$root/", '', $c) . ')';
        }
    }
}

count($missingViews) === 0
    ? ok('controller-lərin göstərdiyi bütün görünüşlər mövcuddur')
    : bad('tapılmayan görünüşlər: ' . implode(' | ', $missingViews));

/* ---------------------------------------------------------------- 5 */
echo "\n5. @extends / @include\n";
$missingIncludes = [];
foreach ($views as $view) {
    $src = (string) file_get_contents($view);
    preg_match_all("/@(?:extends|include)\s*\(\s*'([^']+)'/", $src, $im);
    foreach ($im[1] as $v) {
        $path = "$root/resources/views/" . str_replace('.', '/', $v) . '.blade.php';
        if (! file_exists($path)) {
            $missingIncludes[] = $v . ' (' . str_replace("$root/resources/views/", '', $view) . ')';
        }
    }
}

count($missingIncludes) === 0
    ? ok('bütün @extends/@include hədəfləri mövcuddur')
    : bad('tapılmayan: ' . implode(' | ', $missingIncludes));

/* ---------------------------------------------------------------- 6 */
echo "\n6. Sinif adı ↔ fayl yolu (PSR-4)\n";
$psr4 = [];
foreach (files("$root/app", '.php') as $f) {
    $src = (string) file_get_contents($f);
    if (preg_match('/^namespace\s+([^;]+);/m', $src, $nm) !== 1) {
        continue;
    }
    $expected = 'App\\' . str_replace('/', '\\', trim(dirname(str_replace("$root/app", '', $f)), '/'));
    $expected = rtrim($expected, '\\');
    if (trim($nm[1]) !== $expected) {
        $psr4[] = str_replace("$root/", '', $f) . ': ' . trim($nm[1]) . ' ≠ ' . $expected;
    }
}

count($psr4) === 0
    ? ok('bütün namespace-lər qovluq quruluşuna uyğundur')
    : bad('uyğunsuzluq: ' . implode(' | ', $psr4));

echo "\n{$pass} keçdi, {$fail} uğursuz\n";
exit($fail > 0 ? 1 : 0);
