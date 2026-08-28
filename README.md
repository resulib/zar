# Zarafat Notariat Palatası — MVP

Rəsmi görünüşlü, tamamilə əyləncə məqsədli sənəd generatoru. Cütlüklər, dostlar və iş yeri
üçün möhürlü, imzalı, QR kodlu sənədlər; 1 AZN ödənişlə reyestrdə qeydiyyat.

Sayt **iki tonludur**: «Zarafat» rejimi gülməli sənədlər, «Xatirə» rejimi isə saxlanılası,
çərçivəyə salınası səmimi sənədlər verir. Quruluş hər iki tonda eyni dərəcədə rəsmidir.

**216 şablon · 18 kateqoriya · 12 fərqli sənəd dizaynı · 6 rəng palitrası.**
İstifadəçi istənilən şablona istənilən dizaynı və rəngi tətbiq edə bilər.

| Rejim | Şablon | Kateqoriya |
|---|---|---|
| Zarafat | 132 | cütlüklər · dostlar · iş yeri · ailə · qohumlar · tələbələr · qonşular · bayram · səyahət · ev heyvanları · oyunçular |
| Xatirə  | 72  | sevgi · təşəkkür · mərhələ · dostluq · ailə · təbriklər |

---

## Tez başlanğıc

### Variant A — yalnız frontend (heç nə quraşdırmadan)

`dist/zarafat-mvp.html` faylını brauzerdə açın. Bütün kod (Tailwind, QR kodlayıcı,
sənəd generatoru, tətbiq məntiqi) tək fayla yığılıb. Bu rejimdə reyestr `localStorage`-də
saxlanılır və başlıqda «Demo rejimi» yazısı görünür.

### Variant B — Laravel backend ilə (tam məhsul)

Layihənin kökündə tək əmr:

```bash
bash setup.sh                # Windows: .\setup.ps1
```

Skript mühiti yoxlayır, paketləri quraşdırır, `.env` və bazanı hazırlayır, admin hesabı
açır və serveri başladır. Problem olarsa: `php backend-php/doctor.php`

Addımları əl ilə etmək üçün: **[QURASDIRMA.md](QURASDIRMA.md)**

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
  templates.js    # 132 zarafat şablonu (11 kateqoriya, hər birinə dizayn təyin olunub)
  templates-xatire.js # 72 xatirə şablonu (6 kateqoriya) — templates.js-dən SONRA yüklənir
  qr.js           # sıfırdan yazılmış QR kodlayıcı (byte mode, ECC M, v1–6)
  doc.js          # SVG sənəd generatoru: 10 layout + 6 palitra + 2 ton + təhlükəsizlik çapı (A4 + Story)
  app.js          # tətbiq məntiqi, API qatı, localStorage fallback
backend-php/        # ƏSAS BACKEND — Laravel 13 / PHP 8.4
  app/Support/      # framework-siz məntiq (paketlər, imza, moderasiya, reyestr nömrəsi)
  app/Services/     # kredit ledger-i, sənədlər, ödənişlər, hesablar
  app/Http/         # API, kabinet və admin controller-ləri + middleware
  resources/views/  # əl işi Blade panelləri (sayt üslubunda)
  database/         # 7 miqrasiya + admin seeder
  tests/            # logic.php (55 test) və audit.php (statik yoxlama)
backend-node/       # köhnə Fastify + SQLite backend-i (arxiv, eyni API)
tools/
  verify-qr.js    # QR kodlayıcının referans kitabxana ilə müqayisəsi
  e2e.js          # brauzer + backend uçdan-uca testi
build.js          # tək fayllıq bundle
setup.sh · setup.ps1  # tək əmrlə lokal quraşdırma
backend-php/doctor.php # mühit diaqnostikası
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

## İki ton — Zarafat və Xatirə

Saytın başında iki düyməli keçid var; seçim `localStorage`-də saxlanılır. Rejim kateqoriyaları,
şablonları, saytın başlığını və sənədin tonunu birdən dəyişir.

| Element | `zarafat` | `xatire` |
|---|---|---|
| Qurum adı | ZARAFAT NOTARİAT PALATASI | XATİRƏ SƏNƏDLƏRİ PALATASI |
| Möhürün mərkəzi / alt qövsü | PARODİYA · ƏYLƏNCƏ MƏQSƏDLİDİR | XATİRƏ · XATİRƏ SƏNƏDİ |
| Su nişanı | ZARAFAT + HÜQUQİ QÜVVƏSİ YOXDUR | mətn yoxdur — yalnız çox zəif ornament rozeta |
| Alt zolaq | BU SƏNƏD TAMAMİLƏ ƏYLƏNCƏ MƏQSƏDİ DAŞIYIR… | BU SƏNƏD XATİRƏ MƏQSƏDLİDİR… |
| Notarius | Ə. ZARAFATOV (uydurma şəxs) | X. XATİRƏLİ (uydurma şəxs) |
| MRZ optional-data | `PARODIYA` | `XATIRE` |
| Cəza qutusunun vurğusu | ştamp qırmızısı | palitranın öz `accent` rəngi |

**«Hüquqi qüvvəyə malik deyil» ifadəsi hər iki tonda qalır** — hüquqi qalxanın əsasıdır.
Ödənişsiz sənədin «NÜMUNƏ» kafel su nişanı da tondan asılı deyil, paywall vasitəsidir.

Ton `doc.js`-dəki `TONE` cədvəlindədir; layout funksiyalarının quruluşu dəyişmir, yalnız ortaq
mətnlər oradan oxunur. Sənəd obyektinin `tone` sahəsi backend-də `documents.tone` sütununda
saxlanılır, ona görə reyestrdən açılan sənəd eyni tonda görünür.

---

## Sənəd dizaynları

| Dizayn | Görünüş | Nə üçün uyğundur |
|---|---|---|
| `notarial` | Pergament kağız, qızılı ikiqat haşiyə, künc ornamentləri, guilloche fon | Etibarnamə, akt, səlahiyyətnamə |
| `blank` | Dövlət blankı üslubu: sol qrif, sağda qeydiyyat qutusu, «TƏSDİQ EDİRƏM» bloku, sahə cədvəli | Fərman, protokol, vədnamə |
| `diplom` | Qalın ornamental haşiyə, lentli medalyon, iri kalliqrafik ad, iki imza bloku | Diplom, təltif, fəxri ad |
| `sertifikat` | Müasir: sol tərəfdə tünd rəngli şaquli zolaq, iki sütunlu məzmun | Sertifikat, nəzarət səlahiyyəti |
| `lisenziya` | Vəsiqə kartı: foto yeri, holoqram, punktir sahə cədvəli | Lisenziya, icazə |
| `arayis` | Klassik dövlət blankı: doldurulmuş gerb diski, ikiqat xətt, sol «Çıxış №» qrifi, sağ ünvan bloku, seyrək nöqtəli cədvəl | Arayış, təsdiq, icazə |
| `qerar` | Bilərəkdən bəzəksiz məhkəmə qərarı: iş nömrəsi, xətlə əhatələnmiş «MÜƏYYƏN ETDİ» / «QƏRARA ALDI» blokları, hakim + katib imzaları | Qərar, hökm, intizam işi |
| `muqavile` | Tərəflər qutusu, `1.1.` / `2.1.` maddə nömrələmə, altda ikili imza şəbəkəsi, ortada möhür | Müqavilə, saziş, protokol |
| `teleqram` | Teletayp lenti: zolaqlı kənarlar, tam böyük hərflər, monospace mətn, cümlə sonu « TCK » | Bildiriş, xəbərdarlıq, təbrik |
| `vesiqe` | Pasport məlumat səhifəsi: ikidilli sahələr, foto + kölgə portret + holoqram, ICAO TD3 MRZ zolağı | Vəsiqə, şəxsiyyət sənədi |

| `viza` | Pasport viza səhifəsi: holoqram şəbəkəsi, etiket→dəyər cədvəli, nömrələnmiş qeydlər, dekorativ MRZ | Viza, buraxılış, icazə |
| `ekspertiza` | Texniki rəy: tünd panel, işarələnmiş siyahı, cədvəl və 1–10 şkalası | Ekspertiza, qiymətləndirmə |

Palitralar: `gold` (qızılı), `steel` (polad mavi), `burgundy` (bordo), `forest` (zümrüd),
`ink` (qrafit), `rose` (çəhrayı).

### Təhlükəsizlik çapı

Hər dizayn eyni «blank avadanlığını» daşıyır: heraldik gerb (halqa, ulduz, dəfnə çələngi, lent),
haşiyə boyunca **mikromətn**, təhlükəsizlik **lifləri**, solğun **kölgə təsvir**, **quru (relyef) möhür**,
qırmızı dairəvi möhür, saxta notarius imzası, notarial təsdiq düsturu, **real oxunan Code-39 barkod**,
QR kod (ödənişdən sonra), qatlama izləri, `Forma № ZNP-…` blank nömrəsi, `Səh. 1 / 1`,
diaqonal su nişanı və alt disclaimer zolağı. `arayis`, `qerar` və `teleqram` əlavə olaraq mavi
«DAXİL OLDU» kargüzarlıq ştampı alır; `vesiqe` isə format baxımından düzgün ICAO TD3 MRZ daşıyır.

**Parodiya nişanları güclənir, zəifləmir.** Sənəd nə qədər inandırıcı görünürsə, saxta olduğu bir o
qədər aydın yazılır:

- Mikromətnin özü disclaimer-dir: `ZARAFAT • HÜQUQİ QÜVVƏSİ YOXDUR • PARODİYA •` təkrarı.
- Kölgə təsvirin lenti «HÜQUQİ QÜVVƏSİ YOXDUR» yazır.
- MRZ-in «optional data» sahəsində (29–42 mövqe) hərfi mənada `PARODIYA` yazılır — PNG-ni oxuyan
  istənilən OCR tətbiqi sahibin şəxsi nömrəsini belə göstərəcək.
- Gerb uydurmadır: alov yoxdur, palıd-sünbül çələngi yoxdur, ulduz palitranın rəngini götürür.
- `qerar` uydurma məhkəmə adı (`ZARAFAT MƏHKƏMƏSİ`), `arayis` isə uydurma qurum adı işlədir.
- `inner()` funksiyası qapı rolunu oynayır: su nişanı və disclaimer olmadan heç bir layout çıxa bilmir —
  yeni dizayn yazan onları unutsa belə avtomatik əlavə olunur.

### Yeni dizayn əlavə etmək

`doc.js`-də bir `L_ad(doc, C)` funksiyası yazıb `LAYOUTS` və `LAYOUT_NAMES`-ə qeyd etmək kifayətdir —
substrat üçün `paperBase()`, avadanlıq üçün `pageFurniture()` hazır köməkçilərdir. Sonra `app.js`-də
`LAYOUT_EDGE` və `LAYOUT_ICON`, backend-də isə `config/zarafat.php` ağ siyahısı genişləndirilir.

> **Üç qat qaydası.** `paperBase()` `var bs = out.length` sətrindən **əvvəl**, `pageFurniture()` isə
> `centerBody(...)` çağırışından **sonra** gəlir. `bs` ilə `centerBody` arasına salınan hər şey
> sürüşən gövdə qrupuna qoşulur və 130px-ə qədər yerini dəyişir.

---

## Yoxlanılmış nöqtələr

| Test | Nə yoxlayır | Nəticə |
|---|---|---|
| `npm run test:qr` | QR matrisinin `qrcode` kitabxanası ilə bit-bit uyğunluğu | 6/6 |
| `npm run test:barcode` | Code-39 cədvəlinin invariantları + kodlayıcının geri oxunması | 19/19 |
| `npm run test:doc` | 2 ton × 12 layout × 6 palitra: `<g>` balansı, ton nişanları, struktur bloklar, MRZ | 180/180 |
| `npm run test:templates` | 216 şablon: unikal id, ton uyğunluğu, anket sxemi, mətn büdcəsi | 32/32 |
| `node tools/decode-test.js` | Yaradılan QR-ın `jsQR` ilə real skan olunması | 4/4 |
| `php backend-php/tests/logic.php` | Paketlər, Epoint imzası, prefikslər, variant siyahıları, anket cavabları | 137/137 |
| `php backend-php/tests/audit.php` | PHP sintaksisi, Blade balansı, route adları, view yolları, PSR-4 | 6/6 |
| `php backend-php/tests/security.php` | İşləyən serverə qarşı: limitlər, CSRF, **şablon kilidi**, kataloq qorunması | 40/40 |
| `node backend-node/test-api.js` | Köhnə Node API-si: kredit, publish, reyestr, icazələr | 30/30 |
| `node tools/e2e.js` | Brauzer + backend: rejim keçidi, dizayn seçimi, axtarış, yaratma → ödəniş → QR → reyestr → silmə | 17/17 |
| `npm run test:dist` | Tək fayllıq bundle `file://` rejimində, 12 dizayn + anket + rejim keçidi | 28/28 |
| `npm run test:admin` | Admin kataloq paneli: variant siyahıları, canlı önizləmə, sxem validasiyası | 48/48 |
| `npm run test:viewer` | Baxış səhifəsi: yalnız sənəd, zolaq, çap, PDF quruluşu, beş vəziyyət | 28/28 |
| `node tools/shots.js` | Masaüstü + mobil ekran görüntüləri, şrift yoxlaması (`tools/shots/`) | xətasız |
| `npm run render` | Hər tonda 12 dizaynın nümunəsi + tona görə iki kontakt vərəqi (216 şablon) | xətasız |

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

Şablon kataloqu buradan idarə olunur: **Şablonlar** və **Kateqoriyalar** bölmələri.
Kateqoriyanı açanda onun bütün şablonları sıra ilə sadalanır — hər birini oradaca redaktə etmək,
söndürmək, yaxud «Şablon əlavə et» ilə həmin kateqoriyaya yenisini yaratmaq olar.

Hər şablonda **istifadəçi seçimləri** təyin olunur: «Başlıq variantları», «Bənd variantları»
(+ ən azı/ən çoxu neçəsinin seçiləcəyi) və «Cəza bəndi variantları» — hər sətir bir variant.
Saytda ziyarətçi yalnız adları yazır; başlıq və cəza bəndi açılan siyahıdan, bəndlər isə
çoxseçimdən gəlir. Variant yazılmayıbsa şablonun öz mətni dəyişdirilə bilməyən şəkildə görünür.
Bu, yalnız görünüş deyil: server də sənədi kataloqdan qurur, ona görə brauzer konsolundan
göndərilən saxta mətn sənədə düşmür.

Şablon redaktəsində **canlı önizləmə** var: mətni, dizaynı və ya palitranı dəyişdikcə sənəd
sağ tərəfdə dərhal yenidən çəkilir. «Ödənişli» keçidi su nişanısız və QR kodlu görünüşü,
«Reyestr təsdiqi» isə yaşıl təsdiq ştampını göstərir. Anket sxemindəki səhvlər vərəqin altında
sətir-sətir yazılır.
Kateqoriya və şablon yaratmaq, redaktə etmək, sıralamaq, aktiv/deaktiv etmək, nüsxə çıxarmaq
və silmək mümkündür. Anket sahələri (`fields`), qeydlər və ləğv səbəbləri JSON kimi yazılır və
yadda saxlayanda server sxemi tam yoxlayır — naməlum tip, təkrar açar, yanlış min/max və
uyğunsuz `{{yer-tutucu}}` sətir-sətir izahla rədd edilir.

Kataloq bazadadır; `frontend/templates.js` yalnız ilkin doldurma və offline ehtiyatdır.
Söndürülmüş şablon və kateqoriya saytdan dərhal yığışdırılır, amma silinmir — onunla yaradılmış
sənədlər reyestrdə qalır. «Kataloqu ixrac et» düyməsi cari bazanı `catalog.json` kimi verir.

Ümumi baxış (gəlir, sənəd, istifadəçi statistikası + 14 günlük SVG qrafik) ·
sənədlər (filtr, baxış, reyestrdən çıxarma/bərpa) · ödənişlər · kredit əməliyyatları ·
istifadəçilər (kredit vermə, bloklama) · şikayət növbəsi · parametrlər (moderasiya siyahısı).

Panellər saytın öz dizayn sistemində əl ilə yazılıb — hazır admin paneli istifadə olunmayıb.

---

## Sənədi yaydıqdan sonra

Sənəd rəsmiləşdiriləndən sonra dörd əməliyyat açılır:

- **PDF yüklə** — A4, 288 dpi, tək səhifə. PDF sıfırdan yazılıb: kitabxana və CDN yoxdur,
  eynilə QR kodlayıcısı kimi.
- **HD PNG** və **Story formatı** (1080×1920). Telefonda «Story paylaş» nativ paylaşma vərəqini
  açır — Instagram, WhatsApp, Telegram; şəkil və link birlikdə gedir. Masaüstündə sadəcə yüklənir.
- **Reyestr linki** — panoya kopyalanır.

Linki açan adam **yalnız sənədi görür**: `/r/ZRF-2026-9482` ayrıca, yüngül səhifədir (~169 KB,
saytın özü ~390 KB). Nə başlıq, nə menyu, nə futer — tünd fonda vərəq və altda kiçik zolaq:
PDF · PNG · Story · Link · Şikayət. `Ctrl+P` ilə çap edəndə zolaq da yox olur.
Müddəti bitmiş və ləğv edilmiş sənədlərdə vərəqin üstündə nazik izah zolağı çıxır; reyestrdə
olmayan nömrədə isə yalnız sərt xəbərdarlıq göstərilir.

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
