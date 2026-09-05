# Lokalda qurma — addım-addım

Bu sənəd layihəni öz kompüterinizdə sıfırdan işlətmək üçündür.
Backend **Laravel 13 / PHP 8.4**, frontend isə adi HTML/CSS/JS-dir (build tələb etmir).

> **Vacib qeyd.** Bu Laravel kodu yazıldığı mühitdə **işlədilə bilməyib** —
> orada `packagist.org` bağlı idi, yəni `composer install` mümkün olmayıb.
> Kodun sintaksisi, Blade balansı, route adları, görünüş yolları və PSR-4 uyğunluğu
> statik olaraq yoxlanılıb (`php backend-php/tests/audit.php`), framework-siz məntiq
> isə real testlərdən keçib (`php backend-php/tests/logic.php`, 55 test).
> İlk işə salışda kiçik səhvlərlə qarşılaşsanız, mətni mənə göndərin — dərhal düzəldim.

---

## Ən sürətli yol — tək əmr

Faylları açandan sonra layihənin kökündə:

**macOS / Linux / WSL / Git Bash**

```bash
bash setup.sh
```

**Windows PowerShell**

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\setup.ps1
```

Skript hər şeyi özü edir: mühiti yoxlayır, `composer install` işlədir, `.env` yaradır,
`APP_KEY` generasiya edir, SQLite faylını qurur, cədvəlləri yaradır, admin hesabı açır,
icazələri düzəldir və istəsəniz serveri başladır.

Nəsə alınmasa, diaqnostika işlədin — hansı addımın pozulduğunu və necə düzəldiləcəyini göstərir:

```bash
php backend-php/doctor.php
```

Aşağıdakı bölmələr həmin addımları əl ilə etmək istəyənlər üçündür.

---

## 0. Nə lazımdır

| Alət | Versiya | Yoxlama |
|---|---|---|
| PHP | 8.4+ | `php -v` |
| Composer | 2.x | `composer -V` |
| Git | istənilən | `git --version` |
| MySQL | 8+ *(istəyə bağlı)* | `mysql --version` |

PHP genişlənmələri: `pdo`, `pdo_sqlite` (və ya `pdo_mysql`), `mbstring`, `openssl`, `curl`, `fileinfo`.
Yoxlamaq üçün: `php -m`

**Windows:** ən rahatı [Laragon](https://laragon.org) və ya XAMPP.
**macOS:** `brew install php composer`.
**Linux (Ubuntu 24.04+):** `sudo apt install php8.4-cli php8.4-sqlite3 php8.4-mbstring php8.4-curl php8.4-xml composer`

---

## 1. Faylları əldə edin

### Variant A — arxivdən (ən sadə)

Sizə göndərdiyim `zarafat.zip` faylını açın:

```bash
unzip zarafat.zip
cd zarafat
```

### Variant B — öz git repozitoriyanıza qoyun

Layihə artıq git repozitoriyası kimi hazırlanıb (ilk commit edilib). GitHub-da boş repo yaradın, sonra:

```bash
cd zarafat
git remote add origin https://github.com/ISTIFADECI-ADI/zarafat.git
git branch -M main
git push -u origin main
```

Sonra istənilən kompüterdə:

```bash
git clone https://github.com/ISTIFADECI-ADI/zarafat.git
cd zarafat
```

---

## 2. Backend-i qurun

```bash
cd backend-php
composer install
```

> **Əgər `laravel/framework ^13.0` tapılmadı deyə xəta versə** — həmin versiya hələ
> buraxılmayıbsa, `composer.json`-da `"laravel/framework": "^13.0"` sətrini `"^12.0"`
> ilə əvəz edin və yenidən `composer install` edin. Koda başqa dəyişiklik lazım deyil.

Sonra konfiqurasiya faylını hazırlayın:

```bash
cp .env.example .env
php artisan key:generate
```

---

## 3. Verilənlər bazası

### Variant A — SQLite (lokal üçün tövsiyə edirəm, heç nə quraşdırmaq lazım deyil)

`.env`-də bu sətir onsuz da var:

```
DB_CONNECTION=sqlite
```

Boş baza faylı yaradın:

```bash
touch database/database.sqlite          # Windows PowerShell: New-Item database/database.sqlite
```

### Variant B — MySQL

Bazanı yaradın:

```sql
CREATE DATABASE zarafat CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

`.env`-də SQLite sətirlərini şərhə alıb bunları yazın:

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=zarafat
DB_USERNAME=root
DB_PASSWORD=
```

### Cədvəlləri yaradın və admin hesabı açın

```bash
php artisan migrate --seed
```

Admin məlumatları `.env`-dəki `ADMIN_EMAIL` və `ADMIN_PASSWORD` dəyərlərindən götürülür
(ilkin: `admin@zarafat.az` / `admin12345`). **İstehsalatda mütləq dəyişin.**

### AI şablon köməkçisi (istəyə bağlı)

Admin paneldə şablonu OpenAI ilə hazırlamaq üçün `.env` faylına açar yazın:

```env
OPENAI_API_KEY=sk-...
AI_MODEL=gpt-5.4-mini
```

- Açar **yalnız `.env`-dədir** — bazaya yazılmır ki, baza ehtiyat nüsxəsi və
  «Kataloqu ixrac et» ilə birlikdə yayılmasın.
- **Modeli admin paneldən dəyişmək olar**: `/admin/parametrler` → «AI şablon köməkçisi».
  Oradakı dəyər `.env`-dəkindən üstündür, boş qoysanız `AI_MODEL` işlənir.
  İstənilən OpenAI model adı yazıla bilər — icazə siyahısı yoxdur, yalnız format yoxlanılır.
- Açar yoxdursa bölmə sadəcə görünmür; qalan hər şey əvvəlki kimi işləyir.
- Köməkçi kataloqa **heç nə yazmır** — yalnız formanı doldurur. Sənəd yalnız siz
  «Yadda saxla» düyməsinə basanda yaranır və adi yoxlamalardan keçir.

---

## 4. İşə salın

```bash
php artisan serve
```

Brauzerdə açın:

| Ünvan | Nədir |
|---|---|
| http://localhost:8000 | Sənəd generatoru (əsas sayt) |
| http://localhost:8000/kabinet | İstifadəçi kabineti — **qonaq üçün də açıqdır** |
| http://localhost:8000/admin/giris | İdarəçi girişi |

### Tez sınaq ssenarisi

1. Ana səhifədə şablon seçin, adları yazın → **«Sənədi rəsmiləşdir»**
2. **«1 AZN — reyestrə yaz»** → paket seçin (test rejimində ödəniş dərhal keçir)
3. Sənədin QR kodunu skan edin və ya nömrəni **Reyestr** bölməsində axtarın
4. `/kabinet` — balans, əməliyyat tarixçəsi və sənədləriniz görünür
5. `/admin` — statistika, sənədlər, ödənişlər, istifadəçilər, şikayətlər

---

## 5. Frontend-i dəyişdikdə

Frontend faylları `frontend/` qovluğundadır. Onları dəyişəndən sonra Laravel-in
`public/assets` qovluğuna köçürmək lazımdır:

```bash
cd ..           # layihənin kökünə
npm install     # bir dəfə
npm run build:laravel
```

Bu əmr `frontend/` fayllarını `backend-php/public/assets/` qovluğuna köçürür və
`resources/views/spa.blade.php` görünüşünü yenidən yaradır.

Backend olmadan sınamaq üçün tək fayllıq versiya da var:

```bash
npm run build          # dist/zarafat-mvp.html
```

---

## 6. Ödənişi Epoint-ə keçirin

`.env`-də:

```
PAYMENT_PROVIDER=epoint
ALLOW_SIMULATED_PAYMENTS=false
EPOINT_PUBLIC_KEY=sizin_public_key
EPOINT_PRIVATE_KEY=sizin_private_key
```

Epoint kabinetində callback ünvanı olaraq bunu göstərin:

```
https://sizin-domen.az/api/payments/callback
```

**Diqqət:** `APP_URL` düzgün olmalıdır — QR kodlar və callback ünvanları ondan qurulur.
Domeni sonradan dəyişsəniz, köhnə sənədlərdəki QR kodlar işləməyəcək.

---

## 7. İstehsalata çıxarkən

```bash
composer install --no-dev --optimize-autoloader
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan migrate --force
```

`.env` üçün hazır nümunə var — əl ilə yığmaq lazım deyil:

```bash
cd backend-php
cp .env.production.example .env
php artisan key:generate
# APP_URL, EPOINT_* və (istəsəniz) GOOGLE_* / OPENAI_API_KEY doldurun
php doctor.php
```

Ən vacib sətirlər:

```
APP_ENV=production
APP_DEBUG=false
APP_URL=https://sizin-domen.az
PAYMENT_PROVIDER=epoint
ALLOW_SIMULATED_PAYMENTS=false
ADMIN_PASSWORD=            # boş → seeder təsadüfi güclü parol yaradır və bir dəfə yazır
```

### Hansı bölmələr canlı olacaq

`APP_ENV=production` olduqda sayt **yalnız iş qovluğu ilə** qalxır — bu, ilkin
dəyərin özündədir, `.env`-də unudula bilən sətir deyil:

| ünvan | cavab |
|---|---|
| `/` | 302 → `/is` |
| `/is`, `/is/balans`, `/is/reyting`, `/is/mustentiq` | açıq |
| `/devetname`, `/kabinet`, `/r/{nömrə}`, `/api/catalog` | **404** |
| `/api/packs`, ödəniş, giriş yolları | açıq (kredit hər iki məhsulda işlənir) |

Bölmələri sonradan **`/admin/parametrler`** səhifəsindən açıb-bağlaya
bilərsiniz; oradakı seçim `.env`-dən də, ilkin dəyərdən də üstündür. Panel
həm də vəziyyətin mənbəyini yazır (saxlanmış seçim, yoxsa mühitin ilkin
dəyəri) və «seçimi sil» düyməsi ilə ilkin dəyərə qaytarır.

> **Zarafat bölməsini açmazdan əvvəl bilin:** o bağlı olduqda `/r/{nömrə}` də
> bağlıdır, yəni dərc olunmuş sənədlərin QR ünvanları 404 verir.

### Təhlükəsizlik yoxlama siyahısı

| Nə | Niyə |
|---|---|
| `APP_ENV=production` | Simulyasiya ödənişini məcburi bağlayır — əks halda `/api/payments/checkout` pulsuz kredit yazır. |
| `APP_URL` https ilə başlasın | Sessiya və qonaq cookie-ləri avtomatik `secure` olur. |
| `ADMIN_PASSWORD` dəyişdirilsin | `admin12345` istehsalatda seeder tərəfindən rədd edilir; boş buraxsanız təsadüfi parol yaradılır. |
| `php artisan migrate --force` | `cache` cədvəli olmadan bütün `throttle:*` limitləri (brute-force qoruması) səssizcə işləmir. |
| `APP_DEBUG=false` | Xəta səhifələri konfiqurasiyanı və yolları açır. |
| `.env.production.example`-dən başlayın | Əl ilə yığılan `.env`-də ən çox `CACHE_STORE` və `ALLOW_SIMULATED_PAYMENTS` unudulur. |
| `settings` cədvəlində `bolme_*` sətri olmasın | Varsa, o, `APP_ENV`-dən üstündür — yerli bazanı köçürmüsünüzsə bölmələr açıq qalxa bilər. Paneldəki «seçimi sil» düyməsi onu təmizləyir. |

Quraşdırmadan sonra davranışı yoxlayın:

```bash
php artisan serve --port=8000 &
php backend-php/tests/security.php http://127.0.0.1:8000
```

**Shared hostinq (cPanel):** domeni birbaşa `backend-php/public` qovluğuna yönləndirin.
Bu mümkün deyilsə, `public/` içindəkiləri `public_html`-ə köçürüb `index.php`-dəki
iki `require` yolunu düzəldin.

**İcazələr:**

```bash
chmod -R 775 storage bootstrap/cache
```

---

## 8. Tez-tez rast gəlinən xətalar

| Xəta | Səbəb və həlli |
|---|---|
| `No application encryption key has been specified` | `php artisan key:generate` |
| `SQLSTATE[HY000] [14] unable to open database file` | `database/database.sqlite` faylı yoxdur — `touch` edin |
| `could not find driver` | PHP-də `pdo_sqlite` və ya `pdo_mysql` genişlənməsi yoxdur |
| `The stream or file storage/logs/laravel.log could not be opened` | `chmod -R 775 storage` |
| `419 Page Expired` | Sessiya bitib — səhifəni yeniləyin. Davam edərsə `SESSION_DRIVER=file` sınayın |
| `Class "App\..." not found` | `composer dump-autoload` |
| Admin girişi işləmir | `php artisan db:seed` işlədin; `.env`-dəki `ADMIN_EMAIL`/`ADMIN_PASSWORD`-a baxın |
| Şriftlər görünmür | `npm run build:laravel` işlədilməyib — `public/assets/fonts/` boşdur |
| QR kod səhv ünvana aparır | `.env`-də `APP_URL` yanlışdır; `php artisan config:clear` |
| «AI ilə hazırla» bölməsi görünmür | `.env`-də `OPENAI_API_KEY` boşdur; yazandan sonra `php artisan config:clear` |
| AI «Model tapılmadı (404)» deyir | `/admin/parametrler`-dəki model adı yanlışdır və ya hesabınıza açıq deyil |
| AI «OpenAI açarı qəbul edilmədi (401)» deyir | Açar səhvdir və ya vaxtı bitib |

---

## 9. Yoxlama əmrləri

```bash
php backend-php/doctor.php      # mühit diaqnostikası — problem varsa nə etməli
cd backend-php
php tests/logic.php             # framework-siz məntiq: paketlər, imza, ton, moderasiya (55 test)
php tests/audit.php             # sintaksis, Blade balansı, route adları, PSR-4
```

Frontend tərəfi (Node tələb olunur, layihənin kökündən):

```bash
npm run test:qr         # QR kodlayıcının referans kitabxana ilə müqayisəsi
npm run test:e2e        # brauzer + köhnə Node backend-i ilə uçdan-uca
npm run test:dist       # tək fayllıq versiyanın yoxlanışı
```
