# ============================================================================
#  Zarafat Notariat Palatası — tək əmrlə lokal quraşdırma (Windows)
#
#  İşlətmək (PowerShell):
#     Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
#     .\setup.ps1
# ============================================================================

$ErrorActionPreference = 'Stop'

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$App  = Join-Path $Root 'backend-php'

function Step($t) { Write-Host "`n> $t" -ForegroundColor White }
function Ok($t)   { Write-Host "  [+] $t" -ForegroundColor Green }
function Warn($t) { Write-Host "  [!] $t" -ForegroundColor Yellow }
function Die($t)  { Write-Host "`n  [x] $t`n" -ForegroundColor Red; exit 1 }

Write-Host "`n  ZARAFAT NOTARIAT PALATASI" -ForegroundColor White
Write-Host "  Lokal qurasdirma`n"

# ---------------------------------------------------------------- 1. Mühit
Step '1/7  Muhit yoxlanilir'

if (-not (Get-Command php -ErrorAction SilentlyContinue)) {
  Die 'PHP tapilmadi. Laragon (https://laragon.org) en rahat variantdir.'
}

$phpVer = (php -r 'echo PHP_VERSION;')
$phpOk  = (php -r 'echo version_compare(PHP_VERSION, "8.2.0", ">=") ? "1" : "0";')
if ($phpOk -ne '1') { Die "PHP $phpVer kohnedir. En azi 8.2 lazimdir (tovsiye 8.4)." }
Ok "PHP $phpVer"

$missing = @()
foreach ($ext in @('pdo','mbstring','openssl','curl','fileinfo','tokenizer')) {
  php -r "exit(extension_loaded('$ext') ? 0 : 1);"
  if ($LASTEXITCODE -ne 0) { $missing += $ext }
}
php -r "exit((extension_loaded('pdo_sqlite') || extension_loaded('pdo_mysql')) ? 0 : 1);"
if ($LASTEXITCODE -ne 0) { $missing += 'pdo_sqlite / pdo_mysql' }

if ($missing.Count -gt 0) {
  Die ("PHP genislenmeleri catismir: " + ($missing -join ', ') + "`n     php.ini faylinda ilgili 'extension=...' setirlerinden ';' isaresini silin.")
}
Ok 'Genislenmeler yerindedir'

if (-not (Get-Command composer -ErrorAction SilentlyContinue)) {
  Die 'Composer tapilmadi: https://getcomposer.org/download/'
}
Ok 'Composer tapildi'

if (-not (Test-Path $App)) { Die 'backend-php qovlugu tapilmadi. Skripti layihenin kokunden isledin.' }
Set-Location $App

# ---------------------------------------------------------------- 2. Paketlər
Step '2/7  PHP paketleri qurasdirilir (bir nece deqiqe cheke biler)'

if ((Test-Path 'vendor/autoload.php')) {
  Ok 'vendor/ artiq movcuddur - oturulur'
} else {
  $log = composer install --no-interaction --prefer-dist 2>&1 | Tee-Object -Variable out
  $out | ForEach-Object { Write-Host $_ }
  $text = ($out -join "`n")

  if ($LASTEXITCODE -ne 0) {
    # Yalniz "bu versiya yoxdur" xetasinda geri donuruk.
    if ($text -match '(?i)could not be resolved|no matching package|could not find package|does not match') {
      Warn 'Laravel 13 tapilmadi - 12-ye kecirilir'
      php -r '$f="composer.json"; $j=file_get_contents($f); $j=str_replace("\"laravel/framework\": \"^13.0\"","\"laravel/framework\": \"^12.0\"",$j); file_put_contents($f,$j);'
      Remove-Item 'composer.lock' -ErrorAction SilentlyContinue
      composer install --no-interaction --prefer-dist
      if ($LASTEXITCODE -ne 0) { Die 'composer install alinmadi. Yuxaridaki xeta metnini mene gonderin.' }
      Warn 'Laravel 12 istifade olunur (composer.json yenilendi)'
    } elseif ($text -match '(?i)curl error|could not resolve host|connection|timed out|403') {
      Die "Internet baglantisi problemi - packagist.org-a cixis yoxdur.`n     Proxy/VPN isledirsinizse sondurub yeniden cehd edin."
    } else {
      Die 'composer install alinmadi. Yuxaridaki xeta metnini mene gonderin.'
    }
  }
  Ok 'Paketler qurasdirildi'
}

# ---------------------------------------------------------------- 3. .env
Step '3/7  Konfiqurasiya'

if (Test-Path '.env') {
  Ok '.env artiq var - toxunulmur'
} else {
  Copy-Item '.env.example' '.env'
  Ok '.env yaradildi'
}

if ((Get-Content '.env' -Raw) -match '(?m)^APP_KEY=base64:') {
  Ok 'APP_KEY yerindedir'
} else {
  php artisan key:generate --ansi
  if ($LASTEXITCODE -ne 0) { Die 'APP_KEY yaradila bilmedi' }
  Ok 'APP_KEY yaradildi'
}

# ---------------------------------------------------------------- 4. Baza
Step '4/7  Verilenler bazasi'

$envText = Get-Content '.env' -Raw
$dbConn  = 'sqlite'
if ($envText -match '(?m)^DB_CONNECTION=(.+)$') { $dbConn = $Matches[1].Trim().Trim('"') }

if ($dbConn -eq 'sqlite') {
  New-Item -ItemType Directory -Force -Path 'database' | Out-Null
  if (Test-Path 'database/database.sqlite') {
    Ok 'SQLite fayli artiq var'
  } else {
    New-Item -ItemType File -Path 'database/database.sqlite' | Out-Null
    Ok 'database/database.sqlite yaradildi'
  }
} else {
  Ok "Baglanti: $dbConn (.env-deki melumatlarla)"
}

# ---------------------------------------------------------------- 5. Miqrasiya
Step '5/7  Cedveller ve admin hesabi'

php artisan migrate --seed --force --ansi
if ($LASTEXITCODE -ne 0) { Die 'Miqrasiya alinmadi. Diaqnostika:  php backend-php\doctor.php' }
Ok 'Miqrasiyalar isledi, admin hesabi hazirdir'

# ---------------------------------------------------------------- 6. Assetlər
Step '6/7  Frontend fayllari'

if (Test-Path 'public/assets/app.js') {
  Ok 'Frontend fayllari yerindedir'
} else {
  Warn 'public/assets bosdur. Layihenin kokunde:  npm install; npm run build:laravel'
}

# ---------------------------------------------------------------- 7. Yekun
$adminEmail = 'admin@zarafat.az'
$adminPass  = 'admin12345'
if ($envText -match '(?m)^ADMIN_EMAIL=(.+)$')    { $adminEmail = $Matches[1].Trim().Trim('"') }
if ($envText -match '(?m)^ADMIN_PASSWORD=(.+)$') { $adminPass  = $Matches[1].Trim().Trim('"') }

Step '7/7  Hazirdir'
Write-Host ""
Write-Host "  Unvanlar" -ForegroundColor White
Write-Host "    Sayt      http://localhost:8000"
Write-Host "    Kabinet   http://localhost:8000/kabinet      (qonaq ucun de aciqdir)"
Write-Host "    Admin     http://localhost:8000/admin/giris"
Write-Host ""
Write-Host "  Idareci girisi" -ForegroundColor White
Write-Host "    E-poct    $adminEmail"
Write-Host "    Parol     $adminPass"
Write-Host "    (istehsalatda mutleq deyisin)"
Write-Host ""
Write-Host "  Problem olarsa:  php backend-php\doctor.php"
Write-Host ""

$ans = Read-Host '  Serveri indi basladim? [B/x]'
if ($ans -match '^[Xx]') {
  Write-Host "`n  Sonra ozunuz baslada bilersiniz:  cd backend-php; php artisan serve`n"
} else {
  Write-Host ""
  php artisan serve
}
