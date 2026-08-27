#!/usr/bin/env bash
# ============================================================================
#  Zarafat Notariat Palatası — tək əmrlə lokal quraşdırma
#  macOS · Linux · Windows (WSL və ya Git Bash)
#
#  İşlətmək:  bash setup.sh
# ============================================================================
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP="$ROOT/backend-php"

bold=$'\033[1m'; dim=$'\033[2m'; red=$'\033[31m'; grn=$'\033[32m'; ylw=$'\033[33m'; off=$'\033[0m'
step() { printf '\n%s▸ %s%s\n' "$bold" "$1" "$off"; }
ok()   { printf '  %s✓%s %s\n' "$grn" "$off" "$1"; }
warn() { printf '  %s!%s %s\n' "$ylw" "$off" "$1"; }
die()  { printf '\n  %s✗ %s%s\n\n' "$red" "$1" "$off"; exit 1; }

printf '%s\n' "$bold"
cat <<'BANNER'
  ZARAFAT NOTARİAT PALATASI
  Lokal quraşdırma
BANNER
printf '%s' "$off"

# ---------------------------------------------------------------- 1. Mühit
step "1/7  Mühit yoxlanılır"

command -v php >/dev/null 2>&1 || die "PHP tapılmadı. Quraşdırın: https://www.php.net/downloads (8.2+)"

PHP_VER="$(php -r 'echo PHP_VERSION;')"
PHP_OK="$(php -r 'echo version_compare(PHP_VERSION, "8.2.0", ">=") ? "1" : "0";')"
[ "$PHP_OK" = "1" ] || die "PHP $PHP_VER köhnədir. Ən azı 8.2 lazımdır (tövsiyə: 8.4)."
ok "PHP $PHP_VER"

MISSING=""
for ext in pdo mbstring openssl curl fileinfo tokenizer; do
  php -r "exit(extension_loaded('$ext') ? 0 : 1);" || MISSING="$MISSING $ext"
done
php -r "exit((extension_loaded('pdo_sqlite') || extension_loaded('pdo_mysql')) ? 0 : 1);" \
  || MISSING="$MISSING pdo_sqlite(və-ya)pdo_mysql"

if [ -n "$MISSING" ]; then
  die "PHP genişlənmələri çatışmır:$MISSING
     Ubuntu:  sudo apt install php8.4-{sqlite3,mbstring,curl,xml}
     macOS :  brew install php
     Windows: php.ini faylında ilgili extension sətirlərindən ';' silin"
fi
ok "Genişlənmələr yerindədir"

command -v composer >/dev/null 2>&1 || die "Composer tapılmadı: https://getcomposer.org/download/"
ok "Composer $(composer --version 2>/dev/null | head -1 | awk '{print $3}')"

[ -d "$APP" ] || die "backend-php qovluğu tapılmadı. Skripti layihənin kökündən işlədin."

cd "$APP" || die "backend-php qovluğuna keçmək alınmadı"

# ---------------------------------------------------------------- 2. Paketlər
step "2/7  PHP paketləri quraşdırılır (bir neçə dəqiqə çəkə bilər)"

if [ -d vendor ] && [ -f vendor/autoload.php ]; then
  ok "vendor/ artıq mövcuddur — ötürülür"
else
  LOG="$(mktemp)"
  composer install --no-interaction --prefer-dist 2>&1 | tee "$LOG"
  RC=${PIPESTATUS[0]}

  if [ "$RC" -ne 0 ]; then
    # Yalnız «bu versiya yoxdur» xətasında geri dönürük.
    # Şəbəkə problemi versiyanı endirmək üçün səbəb deyil.
    if grep -qiE 'could not be resolved|no matching package|could not find package|does not match' "$LOG"; then
      warn "Laravel 13 tapılmadı — 12-yə keçirilir"
      php -r '
        $f = "composer.json";
        $j = file_get_contents($f);
        $j = str_replace("\"laravel/framework\": \"^13.0\"", "\"laravel/framework\": \"^12.0\"", $j);
        file_put_contents($f, $j);
      '
      rm -f composer.lock
      composer install --no-interaction --prefer-dist \
        || die "composer install alınmadı. Yuxarıdakı xəta mətnini mənə göndərin."
      warn "Laravel 12 istifadə olunur (composer.json yeniləndi)"
    elif grep -qiE 'curl error|could not resolve host|connection|timed out|403' "$LOG"; then
      die "İnternet bağlantısı problemi — packagist.org-a çıxış yoxdur.
     Proxy/VPN işlədirsinizsə söndürüb yenidən cəhd edin, sonra: bash setup.sh"
    else
      die "composer install alınmadı. Yuxarıdakı xəta mətnini mənə göndərin."
    fi
  fi

  rm -f "$LOG"
  ok "Paketlər quraşdırıldı"
fi

# ---------------------------------------------------------------- 3. .env
step "3/7  Konfiqurasiya"

if [ -f .env ]; then
  ok ".env artıq var — toxunulmur"
else
  cp .env.example .env || die ".env yaradıla bilmədi"
  ok ".env yaradıldı"
fi

if grep -q '^APP_KEY=base64:' .env 2>/dev/null; then
  ok "APP_KEY yerindədir"
else
  php artisan key:generate --ansi || die "APP_KEY yaradıla bilmədi"
  ok "APP_KEY yaradıldı"
fi

# ---------------------------------------------------------------- 4. Baza
step "4/7  Verilənlər bazası"

DB_CONN="$(grep -E '^DB_CONNECTION=' .env | head -1 | cut -d= -f2- | tr -d '\r' | tr -d '"')"
DB_CONN="${DB_CONN:-sqlite}"

if [ "$DB_CONN" = "sqlite" ]; then
  mkdir -p database
  if [ -f database/database.sqlite ]; then
    ok "SQLite faylı artıq var"
  else
    : > database/database.sqlite
    ok "database/database.sqlite yaradıldı"
  fi
else
  ok "Bağlantı: $DB_CONN (.env-dəki məlumatlarla)"
fi

# ---------------------------------------------------------------- 5. Miqrasiya
step "5/7  Cədvəllər və admin hesabı"

if php artisan migrate --seed --force --ansi; then
  ok "Miqrasiyalar işlədi, admin hesabı hazırdır"
else
  die "Miqrasiya alınmadı. Diaqnostika üçün:  php backend-php/doctor.php"
fi

# ---------------------------------------------------------------- 6. İcazələr
step "6/7  Qovluq icazələri"

chmod -R 775 storage bootstrap/cache 2>/dev/null && ok "storage/ və bootstrap/cache yazıla bilir" \
  || warn "İcazələri dəyişmək alınmadı — Windows-da bu normaldır"

if [ -f public/assets/app.js ]; then
  ok "Frontend faylları yerindədir"
else
  warn "public/assets boşdur. Layihənin kökündə:  npm install && npm run build:laravel"
fi

# ---------------------------------------------------------------- 7. Yekun
ADMIN_EMAIL="$(grep -E '^ADMIN_EMAIL=' .env | head -1 | cut -d= -f2- | tr -d '\r"' )"
ADMIN_PASS="$(grep -E '^ADMIN_PASSWORD=' .env | head -1 | cut -d= -f2- | tr -d '\r"' )"

step "7/7  Hazırdır"
cat <<INFO

  ${bold}Ünvanlar${off}
    Sayt      http://localhost:8000
    Kabinet   http://localhost:8000/kabinet      ${dim}(qonaq üçün də açıqdır)${off}
    Admin     http://localhost:8000/admin/giris

  ${bold}İdarəçi girişi${off}
    E-poçt    ${ADMIN_EMAIL:-admin@zarafat.az}
    Parol     ${ADMIN_PASS:-admin12345}
    ${dim}(istehsalatda mütləq dəyişin)${off}

  ${bold}Serveri başlatmaq${off}
    cd backend-php && php artisan serve

  ${bold}Problem olarsa${off}
    php backend-php/doctor.php

INFO

read -r -p "  Serveri indi başladım? [B/x] " ans
case "${ans:-b}" in
  [Xx]* ) printf '\n  Sonra özünüz başlada bilərsiniz.\n\n' ;;
  *     ) printf '\n' ; exec php artisan serve ;;
esac
