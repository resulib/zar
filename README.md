# Zarafat Notariat Palatası — MVP

Rəsmi görünüşlü, tamamilə əyləncə məqsədli sənəd generatoru. Cütlüklər, dostlar və iş yeri
üçün möhürlü, imzalı, QR kodlu sənədlər; 1 AZN ödənişlə reyestrdə qeydiyyat.

**36 şablon · 3 kateqoriya · 5 fərqli sənəd dizaynı · 5 rəng palitrası.**
İstifadəçi istənilən şablona istənilən dizaynı və rəngi tətbiq edə bilər.

---

## Tez başlanğıc

### Variant A — yalnız frontend (heç nə quraşdırmadan)

`dist/zarafat-mvp.html` faylını brauzerdə açın. Bütün kod (Tailwind, QR kodlayıcı,
sənəd generatoru, tətbiq məntiqi) tək fayla yığılıb. Bu rejimdə reyestr `localStorage`-də
saxlanılır və başlıqda «Demo rejimi» yazısı görünür.

### Variant B — Laravel backend ilə (tam məhsul)

```bash
cd backend-php
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate --seed
php artisan serve            # http://localhost:8000
```

Addım-addım təlimat: **[QURASDIRMA.md](QURASDIRMA.md)**

| Ünvan | Nədir |
|---|---|
| `/` | Sənəd generatoru |
| `/kabinet` | İstifadəçi kabineti — qonaq üçün də açıqdır |
| `/admin/giris` | İdarəçi paneli |

### Variant C — köhnə Node backend-i (arxiv)

`backend-node/` qovluğu ilk MVP-nin Fastify + SQLite backend-idir. Eyni API müqaviləsini
verir və burada tam test edilib; Laravel versiyası üçün istinad nöqtəsi kimi saxlanılır.

### Frontend-i yenidən yığmaq

```bash
npm install        # kök qovluqda (test alətləri)
npm run build      # dist/zarafat-mvp.html yenilənir
npm run fonts      # şriftləri yenidən kəsir (yalnız şrift dəyişəndə lazımdır)
```

---

## Struktur

```
frontend/
  index.html      # markup
  site.css        # əl ilə yazılmış üslub sistemi (CSS framework yoxdur)
  fonts.css       # @font-face — lokal IBM Plex
  fonts/          # 8 woff2 faylı, Azərbaycan əlifbasına görə kəsilmiş (cəmi 27 KB)
  templates.js    # 36 sənəd şablonu (3 kateqoriya, hər birinə dizayn təyin olunub)
  qr.js           # sıfırdan yazılmış QR kodlayıcı (byte mode, ECC M, v1–6)
  doc.js          # SVG sənəd generatoru: 5 layout + 5 palitra (A4 + Story 1080×1920)
  app.js          # tətbiq məntiqi, API qatı, localStorage fallback
backend-php/        # ƏSAS BACKEND — Laravel 13 / PHP 8.4
  app/Support/      # framework-siz məntiq (paketlər, imza, moderasiya, reyestr nömrəsi)
  app/Services/     # kredit ledger-i, sənədlər, ödənişlər, hesablar
  app/Http/         # API, kabinet və admin controller-ləri + middleware
  resources/views/  # əl işi Blade panelləri (sayt üslubunda)
  database/         # 6 miqrasiya + admin seeder
  tests/            # logic.php (51 test) və audit.php (statik yoxlama)
backend-node/       # köhnə Fastify + SQLite backend-i (arxiv, eyni API)
tools/
  verify-qr.js    # QR kodlayıcının referans kitabxana ilə müqayisəsi
  e2e.js          # brauzer + backend uçdan-uca testi
build.js          # tək fayllıq bundle
```

---

## Saytın dizaynı

Konsepsiya: **rəsmi qurum portalı estetikası**. Sayt özü ciddi bir idarənin veb səhifəsi kimi
qurulub — zarafat məhz bu ciddi üzlə məzmun arasındakı ziddiyyətdən doğur.

- **Fon və rənglər.** Kətan-ağ kağız fonu (`#f1efe8`), ağ vərəqlər, nazik cədvəl xətləri
  (`#d6d1c3`), institusional göy (`#17355d`) və ştamp qırmızısı (`#a3232c`). Qradiyent,
  parıltı və şüşə effekti yoxdur; kölgə yalnız sənəd vərəqinin altındadır.
- **Tipoqrafiya.** IBM Plex superailəsi: Serif başlıqlar üçün, Sans mətn üçün, Mono isə
  qeydiyyat nömrələri və etiketlər üçün. Şriftlər lokaldır və Azərbaycan əlifbasına görə
  kəsilib — CDN sorğusu yoxdur, cəmi 27 KB.
- **Struktur.** Səhifə rəsmi form kimi bölünüb: BÖLMƏ I (növ seçimi), BÖLMƏ II (məlumatlar),
  BÖLMƏ III (reyestr), BÖLMƏ IV (sənədlər). Hero asimmetrikdir və sağ tərəfdə real sənəd
  nümunəsi göstərilir.
- **CSS framework yoxdur.** `site.css` əl ilə yazılıb (~19 KB), real sinif adları ilə
  (`.masthead`, `.tmpl`, `.sec-head`, `.verdict`).

---

## Sənəd dizaynları

| Dizayn | Görünüş | Nə üçün uyğundur |
|---|---|---|
| `notarial` | Pergament kağız, qızılı ikiqat haşiyə, künc ornamentləri, guilloche fon | Etibarnamə, müqavilə, səlahiyyətnamə |
| `blank` | Dövlət blankı üslubu: sol qrif, sağda qeydiyyat qutusu, «TƏSDİQ EDİRƏM» bloku, sahə cədvəli, nömrələnmiş bəndlər | Fərman, protokol, akt, vədnamə |
| `diplom` | Qalın ornamental haşiyə, lentli medalyon, iri kalliqrafik ad, iki imza bloku | Diplom, təltif, barışıq sazişi |
| `sertifikat` | Müasir: sol tərəfdə tünd rəngli şaquli zolaq, iki sütunlu məzmun | Sertifikat, nəzarət səlahiyyəti |
| `lisenziya` | Vəsiqə kartı: foto yeri, holoqram, punktir sahə cədvəli | Lisenziya, vəsiqə, icazə |

Palitralar: `gold` (qızılı), `steel` (polad mavi), `burgundy` (bordo), `forest` (zümrüd), `ink` (qrafit).

Hər dizayn məcburi elementləri saxlayır: qırmızı dairəvi möhür («ƏYLƏNCƏ MƏQSƏDLİDİR» + «PARODİYA»),
saxta notarius imzası, ştrix-kod, QR kod (ödənişdən sonra), diaqonal su nişanı və alt disclaimer zolağı.

Yeni dizayn əlavə etmək üçün `doc.js`-də bir `L_ad(doc, C)` funksiyası yazıb `LAYOUTS` obyektinə
qeyd etmək kifayətdir — ortaq elementlər (möhür, QR, su nişanı, disclaimer) hazır funksiyalardır.

---

## Yoxlanılmış nöqtələr

| Test | Nə yoxlayır | Nəticə |
|---|---|---|
| `node tools/verify-qr.js` | QR matrisinin `qrcode` kitabxanası ilə bit-bit uyğunluğu | 6/6 |
| `node tools/decode-test.js` | Yaradılan QR-ın `jsQR` ilə real skan olunması | 4/4 |
| `php backend-php/tests/logic.php` | Paketlər, Epoint imzası, reyestr nömrəsi, moderasiya, mətn təmizləmə | 51/51 |
| `php backend-php/tests/audit.php` | PHP sintaksisi, Blade balansı, route adları, view yolları, PSR-4 | 6/6 |
| `node backend-node/test-api.js` | Köhnə Node API-si: kredit, publish, reyestr, icazələr | 30/30 |
| `node tools/e2e.js` | Brauzer + backend: dizayn seçimi, axtarış, yaratma → ödəniş → QR → reyestr → silmə | 14/14 |
| `node tools/dist-check.js` | Tək fayllıq bundle `file://` rejimində, 5 dizaynın hamısı | 10/10 |
| `node tools/shots.js` | Masaüstü + mobil ekran görüntüləri, şrift yoxlaması (`tools/shots/`) | xətasız |
| `node tools/render-all.js` | 36 şablonun hamısını render edir (`tools/render/`) | xətasız |

Eksport edilən PNG-dəki QR kod real decoder ilə oxunur və reyestr linkinə aparır.

---

## İstifadəçilər, balans və panellər

**Qonaq hər şeyi auth-suz edir.** `zrf_uid` cookie-si ilə tanınan bir istifadəçi sətri
yaradılır: sənəd yaradır, ödəniş edir, kabinetdə balansını və tarixçəsini görür.

**Qeydiyyat istəyə bağlıdır.** Qonaq e-poçt və parol təyin etdikdə həmin sətir hesaba
çevrilir — balans və sənədlər yerində qalır. Başqa cihazdan giriş edildikdə isə oradakı
qonaq sessiyası hesaba birləşdirilir (`AccountService::mergeGuestInto`).

**Kredit tarixçəsi.** Balans `users.credits` sütunundadır, hər dəyişiklik `transactions`
cədvəlinə yazılır: `topup` · `spend` · `grant` · `refund`. Kabinet və admin panel
tarixçəni buradan göstərir, balans isə sətir kilidi altında dəyişdirilir.

### Kabinet (`/kabinet`)

Balans və paket alışı · əməliyyat tarixçəsi · sənədlər siyahısı · hesab (qeydiyyat/giriş).

### Admin panel (`/admin`)

Ümumi baxış (gəlir, sənəd, istifadəçi statistikası + 14 günlük SVG qrafik) ·
sənədlər (filtr, baxış, reyestrdən çıxarma/bərpa) · ödənişlər · kredit əməliyyatları ·
istifadəçilər (kredit vermə, bloklama) · şikayət növbəsi · parametrlər (moderasiya siyahısı).

Panellər saytın öz dizayn sistemində əl ilə yazılıb — hazır admin paneli istifadə olunmayıb.

---

## Ödəniş

Ödəniş qatı provider-aqnostikdir (`backend-php/app/Support/Payments/`). MVP-də `simulation` işləyir.

Epoint-ə keçmək üçün `.env`-də:

```
PAYMENT_PROVIDER=epoint
ALLOW_SIMULATED_PAYMENTS=false
EPOINT_PUBLIC_KEY=...
EPOINT_PRIVATE_KEY=...
```

`EpointProvider` imzalama sxemini (`base64(json)` + `base64(sha1(private+data+private))`)
tətbiq edir, callback-də imzanı `hash_equals` ilə yoxlayır və ödənişi idempotent şəkildə
tətbiq edir (eyni sifariş iki dəfə gəlsə kredit bir dəfə yazılır).
**Sahə adlarını öz Epoint müqavilənizin sənədi ilə tutuşdurun** — versiyalar arasında fərq ola bilər.

### Kredit paketləri

| Paket | Qiymət | Sənəd |
|---|---|---|
| p1 | 1 AZN | 1 |
| p3 | 2 AZN | 3 |
| p10 | 5 AZN | 10 |

Paketlər `backend/payments.js` içindəki `PACKS` obyektindədir; frontend-dəki `PACKS` massivi
ilə eyni saxlanmalıdır (`GET /api/packs` marşrutu da var).

---

## API

| Metod | Yol | Təyinat |
|---|---|---|
| GET | `/api/health` | server + aktiv ödəniş provideri |
| GET | `/api/me` | anonim istifadəçi + balans |
| GET | `/api/me/documents` | öz sənədləri |
| POST | `/api/documents` | qaralama sənəd yaradır, `regNo` qaytarır |
| POST | `/api/documents/:regNo/publish` | 1 kredit xərcləyib reyestrə yazır |
| GET | `/api/registry/:regNo` | yalnız dərc olunmuş sənədi qaytarır |
| POST | `/api/payments/simulate` | test ödənişi (istehsalatda söndürün) |
| POST | `/api/payments/checkout` | real provider üçün sifariş yaradır |
| POST | `/api/payments/callback` | provider webhook-u |
| POST | `/api/reports` | şikayət; sahibi öz sənədini dərhal silir |
| GET | `/r/:regNo` | QR kodun düşdüyü səhifə (SPA) |

POST sorğuları CSRF tokeni tələb edir — frontend onu `<meta name="csrf-token">`
və `XSRF-TOKEN` cookie-sindən oxuyub başlıqda göndərir. Yalnız provayder callback-i
istisnadır (imza ilə qorunur).

---

## Hüquqi qalxan — dizayna hopdurulmuş qərarlar

Bunlar təsadüfi deyil, məqsədli seçimlərdir:

- **Dövlət rəmzi yoxdur.** Gerb, «Azərbaycan Respublikası», real nazirlik və ya notariat
  idarəsinin adı heç yerdə istifadə olunmur. Emblem uydurma «ZNP» monoqramıdır.
- **Uydurma qurum və şəxs.** «Zarafat Notariat Palatası», «Notarius Ə. Zarafatov (uydurma şəxs)».
- **Prefiks rəsmi görünmür.** `ZRF-2026-9482` — dövlət reyestri formatını təqlid etmir.
- **Möhürün özündə etiraf var:** dairə boyunca «ƏYLƏNCƏ MƏQSƏDLİDİR», mərkəzdə «PARODİYA».
- **Su nişanı həmişə var** — ödənişli variantda zəifləyir, amma yox olmur.
- **Sənədin alt zolağında disclaimer** — şəkil kontekstdən ayrılıb WhatsApp-da gəzəndə də qalır.
- **Şikayət/sil mexanizmi** hər sənədin yanında; sahibi dərhal silir, yad sənəd moderasiyaya düşür.
- **Moderasiya süzgəci** `BANNED_WORDS` ilə (istehsalatda genişləndirin).

---

## Növbəti addımlar (MVP-dən sonra)

1. **Domen və hosting** — `PUBLIC_URL` QR koda hopdurulur, ona görə domeni erkən sabitləyin.
2. **OG meta teqləri** — `/r/:regNo` səhifəsi üçün dinamik `og:image` (sənədin PNG-si).
   WhatsApp-da link paylaşılanda önizləmə çıxsın; viral döngənin ikinci yarısı budur.
3. **Server tərəfli PNG** — hazırda şəkil brauzerdə yaranır; OG üçün serverdə də lazım olacaq
   (`resvg` və ya `sharp` ilə SVG→PNG).
4. **Rate limit sərtləşdirmə** — IP + cookie birlikdə, sənəd yaratma üçün gündəlik limit.
5. **Merchant hesabı** — Epoint üçün VÖEN/fərdi sahibkarlıq tələb olunur.
6. **Şablon genişlənməsi** — bayram/mövsüm şablonları viral zirvələri idarə etməyin ən ucuz yoludur;
   yeni şablon `templates.js`-ə bir obyekt əlavə etməkdir.

---

## Lisenziya və məsuliyyət

Bu layihə əyləncə məhsuludur. Yaranan sənədlərin heç bir hüquqi qüvvəsi yoxdur.
Sənədlərdən şantaj, saxtakarlıq və ya üçüncü şəxsi aldatmaq məqsədilə istifadə qadağandır.
