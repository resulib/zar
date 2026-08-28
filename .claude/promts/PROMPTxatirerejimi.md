# Tapşırıq: «Xatirə» rejimi — səmimi sənədlər

Bu mətni layihə açıq olan AI sessiyasına olduğu kimi yapışdırın.

---

## Kontekst

Layihə: **Zarafat Notariat Palatası** — rəsmi görünüşlü, hüquqi qüvvəsi olmayan sənəd
generatoru (Azərbaycan bazarı). Sənədlər SVG kimi qurulur, PNG kimi eksport olunur;
1 AZN ödənişlə reyestrə düşür və QR kod alır.

Stack və struktur:

```
frontend/
  index.html          # markup (CSS framework YOXDUR — site.css əl ilə yazılıb)
  site.css            # dizayn sistemi: --paper, --ink, --blue, --red, --mono ...
  panel.css           # kabinet/admin üslubu
  fonts.css + fonts/  # lokal IBM Plex, Azərbaycan əlifbasına görə kəsilmiş (27 KB)
  templates.js        # window.CATEGORIES + window.TEMPLATES (36 şablon)
  doc.js              # window.DOCGEN — 5 layout, 5 palitra, A4 + Story render
  qr.js               # window.QRZ — sıfırdan yazılmış QR kodlayıcı
  app.js              # tətbiq məntiqi, API qatı, localStorage fallback
backend-php/          # Laravel 13 / PHP 8.4 (API + kabinet + admin panel)
backend-node/         # köhnə Fastify backend-i (arxiv, eyni API müqaviləsi)
tools/                # build-laravel.js, e2e.js, shots.js, render-all.js, verify-qr.js
build.js              # tək fayllıq dist/zarafat-mvp.html
```

Mövcud 5 layout: `notarial` · `blank` · `diplom` · `sertifikat` · `lisenziya`
Mövcud 5 palitra: `gold` · `steel` · `burgundy` · `forest` · `ink`

Hər sənəddə məcburi elementlər var: qırmızı dairəvi möhür, saxta notarius imzası,
ştrix-kod, QR kod (ödənişdən sonra), diaqonal su nişanı, alt disclaimer zolağı.

---

## Məqsəd

Sayta **ikinci ton** əlavə etmək: zarafat sənədlərinin yanında **səmimi xatirə sənədləri**
(sevgi, təşəkkür, ad günü, bayram, ailə, nailiyyət).

Səbəb: zarafat sənədi paylaşılır və unudulur; xatirə sənədi saxlanılır, çərçivəyə salınır,
hədiyyə edilir. Fərqli emosional an, fərqli ödəmə istəyi.

---

## Verilmiş qərarlar (dəyişdirmə)

1. **İki rejim, yuxarıda keçid.** Saytın başında «Zarafat / Xatirə» keçidi. Seçilən rejim
   kateqoriyaları, şablonları və sənədin tonunu birdən dəyişir.
2. **Rəsmi quruluş, yumşaq sözlər.** Möhür, imza, qeydiyyat nömrəsi, QR — hamısı qalır.
   Yalnız zarafat sözləri əvəzlənir.
3. **6 səmimi kateqoriya:** sevgi · təşəkkür · mərhələ · dostluq · ailə · təbriklər.

---

## 1. Ton sistemi — `frontend/doc.js`

Sənəd obyektinə `tone` sahəsi əlavə et: `'zarafat'` (default) və ya `'xatire'`.
`DOCGEN.a4()` və `DOCGEN.story()` bu sahəyə görə aşağıdakıları dəyişsin.
Layout funksiyalarının quruluşuna toxunma — yalnız ortaq elementləri parametrləşdir.

| Element | `zarafat` | `xatire` |
|---|---|---|
| Möhürün mərkəzi (kiçik yazı) | `PARODİYA` | `XATİRƏ` |
| Möhürün alt qövsü | `ƏYLƏNCƏ MƏQSƏDLİDİR` | `XATİRƏ SƏNƏDİ` |
| Su nişanı mətni | `ZARAFAT` + `HÜQUQİ QÜVVƏSİ YOXDUR` | mətn yoxdur — yalnız çox zəif (opacity ~0.05) ornament rozeta |
| Ödənişsiz «NÜMUNƏ» kafel su nişanı | qalır | qalır (paywall vasitəsidir, tondan asılı deyil) |
| Alt zolaq | `BU SƏNƏD TAMAMİLƏ ƏYLƏNCƏ MƏQSƏDİ DAŞIYIR VƏ HEÇ BİR HÜQUQİ QÜVVƏYƏ MALİK DEYİL.` | `BU SƏNƏD XATİRƏ MƏQSƏDLİDİR VƏ HEÇ BİR HÜQUQİ QÜVVƏYƏ MALİK DEYİL.` |
| Qurum adı (başlıq) | `ZARAFAT NOTARİAT PALATASI` | `XATİRƏ SƏNƏDLƏRİ PALATASI` |
| Qurum alt yazısı | `QEYRİ-RƏSMİ SƏNƏDLƏR VAHİD REYESTRİ` | `XATİRƏ SƏNƏDLƏRİ REYESTRİ` |
| Notarius sətri | `Növbətçi notarius: Ə. ZARAFATOV (uydurma şəxs)` | `Qeydiyyat: X. XATİRƏLİ (uydurma şəxs)` |

**Vacib:** «hüquqi qüvvəyə malik deyil» ifadəsi hər iki tonda qalır — hüquqi qalxanın əsasıdır.

### Yeni palitra: `rose`

`PALETTES` obyektinə əlavə et (mövcud palitraların sahə quruluşu ilə eyni):

```js
rose: {
  paper:'#fdf7f4', ink:'#2a1e20', head:'#6b2233', accent:'#a8586b',
  accentL:'#e0b3bf', accentD:'#7d3145', muted:'#6f5b60',
  seal:'#a8586b', soft:'#fbeef1'
}
```

### Etiket fallback-ları

`xatire` tonunda default etiketlər dəyişsin (şablon öz etiketini verməyibsə):

| Sahə | `zarafat` default | `xatire` default |
|---|---|---|
| `toLabel` | `KİMƏ VERİLİR` | `KİMƏ` |
| `fromLabel` | `KİMDƏN VERİLİR` | `KİMDƏN` |
| `powersLabel` | `SƏLAHİYYƏTLƏR VƏ ŞƏRTLƏR` | `ƏSASLAR` |
| `penaltyLabel` | `CƏZA BƏNDİ` | `SON SÖZ` |

`xatire` tonunda «cəza» qutusunun qırmızı vurğusu palitranın `accent` rənginə keçsin
(qırmızı xəbərdarlıq hissi səmimi sənəddə yersizdir).

`DOCGEN` ixracına `TONES = ['zarafat', 'xatire']` və `TONE_NAMES = { zarafat: 'Zarafat', xatire: 'Xatirə' }` əlavə et.

---

## 2. Şablonlar

### Fayl bölgüsü

- `frontend/templates.js` — mövcud 36 zarafat şablonu. Hər `CATEGORIES` elementinə və hər
  şablona `tone: 'zarafat'` əlavə et.
- `frontend/templates-xatire.js` — **yeni fayl.** 6 kateqoriya + 36 şablon,
  `window.CATEGORIES.push(...)` və `window.TEMPLATES.push(...)` ilə əlavə edilir.
  `templates.js`-dən sonra yüklənməlidir.

`index.html`, `build.js` və `tools/build-laravel.js` fayllarında yeni skript qeyd olunmalıdır.

### Şablon obyektinin sxemi

```js
{
  id: 'sevgi-etirafi',            // unikal, kebab-case
  cat: 'love',                    // kateqoriya id
  tone: 'xatire',
  layout: 'notarial',             // 5 layoutdan biri
  palette: 'rose',                // 6 palitradan biri
  title: 'Sevgi Etirafnaməsi',
  tag: 'Ən çox seçilən',          // qısa nişan (kartda görünür)
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN',        // istəyə bağlı
  powersLabel: 'ƏSASLAR', penaltyLabel: 'SON SÖZ',
  preamble: '... {to} ... {from} ...',          // 2–3 cümlə
  powers: 'Sətir 1\nSətir 2\nSətir 3\nSətir 4', // 4 sətir
  penalty: '...'                                 // 1–2 cümlə
}
```

**Sahələrin mənası `xatire` tonunda dəyişir** (mühərrik dəyişmir, yalnız etiketlər və mətn):

- `powers` → səbəblər / xidmətlər / arzular siyahısı
- `penalty` → bağlayıcı cümlə, arzu və ya qeyd

### Mətn qaydaları

- Azərbaycan dili, düzgün orfoqrafiya (`ə ğ ı İ ö ş ü ç`).
- **Səmimi, lakin ölçülü.** Klişe yoxdur («ürəyimin başı», «mələyim», «canım»).
  Ton: hörmətli, isti, bir az rəsmi — sanki doğrudan da bir qurum təsdiqləyir.
- Emoji yoxdur. Nida işarəsi minimuma endirilsin.
- Preambula rəsmi sənəd sintaksisini saxlasın: «Bu sənədlə təsdiq olunur ki, …»,
  «… {from} tərəfindən {to} adlı şəxsə təqdim olunur.»
- Zarafat şablonlarının uzunluq ölçüsünə riayət et: preambula ≤ 4 sətirlik yerə sığmalıdır
  (təxminən 320 simvol), hər `powers` sətri ≤ 90 simvol, `penalty` ≤ 220 simvol.

### Kateqoriyalar və şablonlar

```js
window.CATEGORIES.push(
  { id:'love',      tone:'xatire', name:'Sevgi',            icon:'♥', blurb:'Etiraf, təklif, ildönümü — saxlanılası sənədlər.' },
  { id:'thanks',    tone:'xatire', name:'Təşəkkür',         icon:'✎', blurb:'Minnətdarlıq, fəxri fərman, tərif.' },
  { id:'milestone', tone:'xatire', name:'Mərhələ',          icon:'✦', blurb:'Məzuniyyət, ilk addım, nailiyyət.' },
  { id:'bonds',     tone:'xatire', name:'Dostluq',          icon:'❋', blurb:'Uzunillik dostluğun səmimi qeydi.' },
  { id:'family',    tone:'xatire', name:'Ailə',             icon:'⌂', blurb:'Valideynlər, nənə-baba, bacı-qardaş.' },
  { id:'greetings', tone:'xatire', name:'Təbriklər',        icon:'✧', blurb:'Ad günü, yubiley, bayram təbrikləri.' }
);
```

Aşağıdakı 36 şablonu bu ad, layout və palitra bölgüsü ilə yaz:

**Sevgi (`love`)** — etiketlər: `KİMƏ` / `KİMDƏN` / `ƏSASLAR` / `SON SÖZ`
| # | Başlıq | layout | palette |
|---|---|---|---|
| 1 | Sevgi Etirafnaməsi | notarial | rose |
| 2 | Evlilik Təklifi Sənədi | diplom | burgundy |
| 3 | İldönümü Xatirə Şəhadətnaməsi | sertifikat | rose |
| 4 | «Səni Seçirəm» Bəyannaməsi | blank | burgundy |
| 5 | İlk Görüşün Xatirə Qeydi | notarial | gold |
| 6 | Birgə Gələcək Bəyannaməsi | diplom | gold |

**Təşəkkür (`thanks`)** — etiketlər: `TƏLTİF OLUNAN` / `TƏQDİM EDƏN` / `XİDMƏTLƏR` / `QEYD`
| # | Başlıq | layout | palette |
|---|---|---|---|
| 1 | Təşəkkürnamə | blank | steel |
| 2 | Fəxri Fərman | diplom | burgundy |
| 3 | Müəllimə Minnətdarlıq Məktubu | notarial | forest |
| 4 | «İlin Anası» Fəxri Fərmanı | diplom | rose |
| 5 | Həkimə Minnətdarlıq Sənədi | sertifikat | steel |
| 6 | Komandaya Təşəkkür Sertifikatı | sertifikat | forest |

**Mərhələ (`milestone`)** — etiketlər: `SƏNƏD SAHİBİ` / `TƏQDİM EDƏN` / `QEYDƏ ALINAN` / `ARZU`
| # | Başlıq | layout | palette |
|---|---|---|---|
| 1 | Məzuniyyət Xatirə Diplomu | diplom | gold |
| 2 | İlk Addım Şəhadətnaməsi | sertifikat | rose |
| 3 | Vərdişi Tərgitmə Sertifikatı | sertifikat | forest |
| 4 | İdman Nailiyyəti Sənədi | sertifikat | steel |
| 5 | İlk İş Günü Xatirə Sənədi | blank | ink |
| 6 | Yeni Ev Xatirə Sənədi | notarial | gold |

**Dostluq (`bonds`)** — etiketlər: `KİMƏ` / `KİMDƏN` / `ƏSASLAR` / `SON SÖZ`
| # | Başlıq | layout | palette |
|---|---|---|---|
| 1 | Dostluq Şəhadətnaməsi | notarial | gold |
| 2 | «Ən Yaxşı Dost» Fəxri Fərmanı | diplom | burgundy |
| 3 | Uzunillik Dostluq Nişanı | sertifikat | forest |
| 4 | «Həmişə Yanımda» Minnətdarlıq Sənədi | notarial | rose |
| 5 | Dost Qrupu Xatirə Sənədi | blank | steel |
| 6 | Sirdaş Etimadnaməsi | lisenziya | ink |

**Ailə (`family`)** — etiketlər: `KİMƏ` / `KİMDƏN` / `ƏSASLAR` / `QEYD`
| # | Başlıq | layout | palette |
|---|---|---|---|
| 1 | Valideynlərə Minnətdarlıq Sənədi | diplom | gold |
| 2 | Nənə və Babaya Xatirə Sənədi | notarial | rose |
| 3 | Bacı-Qardaş Şəhadətnaməsi | sertifikat | burgundy |
| 4 | Yeni Doğulanın Xatirə Şəhadətnaməsi | sertifikat | rose |
| 5 | Ailə Birliyi Bəyannaməsi | blank | forest |
| 6 | Ailə Toplantısı Xatirə Protokolu | blank | ink |

**Təbriklər (`greetings`)** — etiketlər: `TƏBRİK OLUNAN` / `TƏBRİK EDƏN` / `ARZULAR` / `QEYD`
| # | Başlıq | layout | palette |
|---|---|---|---|
| 1 | Ad Günü Təbriknaməsi | diplom | rose |
| 2 | Yubiley Fəxri Fərmanı | diplom | gold |
| 3 | Novruz Təbriknaməsi | notarial | forest |
| 4 | Yeni İl Təbriknaməsi | sertifikat | burgundy |
| 5 | Bayram Təbriknaməsi | notarial | gold |
| 6 | 8 Mart Təbriknaməsi | sertifikat | rose |

---

## 3. Frontend — `index.html` və `app.js`

### Rejim keçidi

`nav` zolağının altında, `BÖLMƏ I`-dən əvvəl iki düyməli keçid (`.segmented` sinfi
onsuz da mövcuddur, təkrar istifadə et):

```html
<div class="mode-switch" id="modeSwitch" role="tablist"></div>
```

- `state.mode` = `'zarafat' | 'xatire'`, default `'zarafat'`.
- `localStorage['zrf_mode']` ilə yadda saxlansın.
- Rejim dəyişəndə: `state.cat` həmin rejimin ilk kateqoriyasına keçsin, axtarış təmizlənsin,
  kartlar və önizləmə yenidən qurulsun, hero nümunəsi həmin tondan bir şablonla dəyişsin.
- `renderTabs()` yalnız `CATEGORIES.filter(c => c.tone === state.mode)` göstərsin.
- `renderCards()` yalnız cari rejimin şablonlarını göstərsin; axtarış da rejim daxilində işləsin.
- `formDoc()` qaytardığı obyektə `tone: state.tpl.tone` əlavə olunsun.
- Səhifə başlığındakı mətnlər rejimə görə dəyişsin (hero `h1`, `lede`, `eyebrow`).

### Vizual

`site.css`-ə `.mode-switch` üçün üslub əlavə et — mövcud tokenlərdən istifadə et
(`--rule-hard`, `--blue`, `--sheet`, `--mono`). Yeni rəng dəyəri **əlavə etmə**,
yeni CSS framework **gətirmə**.

---

## 4. Backend — `backend-php/`

1. Yeni miqrasiya: `documents` cədvəlinə `tone` sütunu
   (`string(10)`, default `'zarafat'`, indeksli).
2. `app/Models/Document.php`: `$fillable`-a `tone`; `toApiArray()`-ə `'tone' => $this->tone`.
3. `app/Services/DocumentService.php`: `Sanitizer::pick($input['tone'] ?? null, ['zarafat','xatire'], 'zarafat')`.
4. `app/Http/Controllers/Api/DocumentController.php`: validasiyaya `'tone' => ['nullable','string','max:10']`.
5. `config/zarafat.php`: `'tones' => ['zarafat', 'xatire']`.
6. Admin paneldə (`resources/views/admin/documents.blade.php`) ton üzrə süzgəc və sütun əlavə et.

Eyni dəyişikliyi `backend-node/` üçün **etmə** — o arxivdir.

---

## 5. Build və testlər

```bash
npm run build            # dist/zarafat-mvp.html
npm run build:laravel    # public/assets + spa.blade.php
npm run render           # 72 şablonun hamısını render edir → tools/render/
npm run shots            # masaüstü + mobil ekran görüntüləri
npm run test:e2e         # brauzer + Node backend uçdan-uca
npm run test:dist        # tək fayllıq versiyanın yoxlanışı
php backend-php/tests/audit.php    # sintaksis, Blade balansı, route adları, PSR-4
```

`tools/render-all.js` faylını 72 şablonu render edəcək şəkildə yenilə və kontakt vərəqini
rejimə görə iki hissəyə böl.

---

## 6. Dəyişməz qaydalar

- **Hüquqi qalxan.** Heç bir tonda dövlət gerbi, «Azərbaycan Respublikası», real nazirlik
  və ya notariat idarəsinin adı istifadə olunmur. Qurum uydurmadır, notarius uydurmadır,
  alt zolaqdakı «hüquqi qüvvəyə malik deyil» hər sənəddə qalır.
- **CSS framework yoxdur.** Tailwind və s. gətirmə; `site.css` əl ilə yazılıb və tokenlərlə işləyir.
- **Şriftlər lokaldır.** CDN sorğusu əlavə etmə.
- **Sənəd SVG-dir.** `foreignObject`, xarici şəkil və ya web font istifadə etmə —
  PNG eksportu canvas üzərindən gedir və onları render etmir.
- **`String.replace` tələsi.** Sətir əvəzləməsində `$$`, `$&`, `$'` xüsusi simvoldur —
  build skriptlərində əvəzləmə funksiya ilə edilməlidir.
- **Azərbaycan `İ` tələsi.** JS-də case-insensitive regex `İ` hərfini uyğunlaşdırmır
  (`'İ'.toLowerCase()` iki simvoldur) — testlərdə bu hərfsiz alt sətirlərdən istifadə et.

---

## 7. Qəbul meyarları

1. Saytda «Zarafat / Xatirə» keçidi var, seçim `localStorage`-də saxlanılır.
2. Hər rejimdə 36 şablon və öz kateqoriyaları görünür; axtarış rejim daxilində işləyir.
3. Xatirə sənədində möhürdə `PARODİYA` yazmır, su nişanında `ZARAFAT` yoxdur,
   alt zolaqda «xatirə məqsədlidir» yazır — amma «hüquqi qüvvəyə malik deyil» qalır.
4. `rose` palitrası 5 layoutun hamısında düzgün render olunur.
5. Ton backend-də saxlanılır və reyestrdən açılanda eyni görünür.
6. `npm run render` 72 şablonu xətasız render edir; heç birində mətn kəsilmir və ya daşmır.
7. `npm run test:e2e`, `npm run test:dist`, `php backend-php/tests/audit.php` — hamısı yaşıl.
8. Mobil görünüş pozulmur.
