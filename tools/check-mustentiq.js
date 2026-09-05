/* MÜSTƏNTİQ PROFİLİ — statik yoxlamalar.
 *
 * Server lazım deyil. `check-dossier.js` ilə eyni forma: nömrələnmiş
 * bölmələr, ✓/✗ və sıfırdan fərqli çıxış kodu.
 *
 * XP düsturunun JS ƏKİZİ burada QƏSDƏN saxlanılır — `BlokSxemi` ↔ bu faylın
 * JS twin-i ilə eyni intizam: PHP tərəf serverin yazdığını qoruyur, JS tərəf
 * isə konfiqurasiyanın gözlənilən dəyərlərdən sürüşmədiyini.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const APP  = path.join(ROOT, 'backend-php');
const FE   = path.join(ROOT, 'frontend');

let pass = 0, fail = 0;
const check = (ad, ok, ekstra) => {
  if (ok) { pass++; console.log('  ✓ ' + ad); }
  else { fail++; console.log('  ✗ ' + ad + (ekstra === undefined ? '' : ' → ' + JSON.stringify(ekstra))); }
};
const bas = (t) => console.log('\n' + t);

const oxu = (...p) => fs.readFileSync(path.join(...p), 'utf8');

/* «İ».toLowerCase() iki kod nöqtəsidir və JS-in `i` bayrağı onu tutmur —
   müqayisələr ASCII-yə qatlanır (check-dossier.js ilə eyni funksiya). */
const fold = (s) => s
  .replace(/[İIı]/g, 'i').replace(/[Əə]/g, 'e').replace(/[Öö]/g, 'o')
  .replace(/[Üü]/g, 'u').replace(/[Çç]/g, 'c').replace(/[Şş]/g, 's')
  .replace(/[Ğğ]/g, 'g').toLowerCase();

const cfg  = oxu(APP, 'config', 'dossier.php');
const seed = oxu(APP, 'database', 'seeders', 'RankSeeder.php');
const kart = oxu(APP, 'app', 'Services', 'CardRenderer.php');
const xpPhp = oxu(APP, 'app', 'Support', 'Dossier', 'Xp.php');
const nomre = oxu(APP, 'app', 'Support', 'Dossier', 'VesiqeNo.php');
const marsrut = oxu(APP, 'routes', 'web.php');

/* --- 1. Rütbələr -------------------------------------------------------- */
bas('1. Rütbələr');

const RUTBE = [...seed.matchAll(/\[(\d+),\s*'([^']+)',\s*'([^']+)',\s*(\d+),\s*'([^']+)',\s*'([^']+)'\]/g)]
  .map(m => ({ level: +m[1], ad: m[2], qisa: m[3], xp: +m[4], nisan: m[5], reng: m[6] }));

check('doqquz rütbə var', RUTBE.length === 9, RUTBE.length);
check('səviyyələr 1..9 və bitişikdir',
  RUTBE.every((r, i) => r.level === i + 1), RUTBE.map(r => r.level));
check('ilk pillə sıfırdan başlayır', RUTBE[0] && RUTBE[0].xp === 0, RUTBE[0] && RUTBE[0].xp);
check('XP həddi ciddi artır',
  RUTBE.every((r, i) => i === 0 || r.xp > RUTBE[i - 1].xp), RUTBE.map(r => r.xp));

/* «ARTAN SÜRƏT» fərziyyə deyil, İDDİADIR: hər addım əvvəlkindən böyük
   olmalıdır ki, ilk yüksəliş asan, sonuncusu ciddi olsun. */
const DELTA = RUTBE.slice(1).map((r, i) => r.xp - RUTBE[i].xp);
check('hər addım əvvəlkindən böyükdür',
  DELTA.every((d, i) => i === 0 || d > DELTA[i - 1]), DELTA);

check('rütbə adları təkrarlanmır', new Set(RUTBE.map(r => r.ad)).size === RUTBE.length);
check('qısa adlar boş deyil', RUTBE.every(r => r.qisa.length > 0 && r.qisa.length <= 24));

/* Hər nişan növünün `CardRenderer`-də bir qolu olmalıdır — yoxsa naməlum
   növ səssizcə boş şevrona düşər. */
for (const r of RUTBE) {
  check('nişan «' + r.nisan + '» çəkilir', kart.indexOf("'" + r.nisan + "'") >= 0);
}

/* Rəng tokeni HƏRFİ hex-ə çevrilməlidir: kart <img> ilə kətana çəkilir və
   orada `var(--buff)` həll olunmur. */
const RENGLER = {};
const rengBlok = (cfg.match(/'rank_colors'\s*=>\s*\[([\s\S]*?)\]/) || [, ''])[1];
for (const m of rengBlok.matchAll(/'([a-z0-9]+)'\s*=>\s*'(#[0-9A-Fa-f]{6})'/g)) RENGLER[m[1]] = m[2];

for (const r of RUTBE) {
  check('rəng tokeni «' + r.reng + '» config-də var', RENGLER[r.reng] !== undefined);
}

/* Hex dəyərləri `dossier.css` :root bloku ilə EYNİ olmalıdır — iki fərqli
   qırmızı kartı oyunun qalanından qoparardı. */
const css = oxu(FE, 'dossier.css');
for (const [token, hex] of Object.entries(RENGLER)) {
  const m = css.match(new RegExp('--' + token + ':(#[0-9A-Fa-f]{6})'));
  check('rəng «' + token + '» dossier.css ilə eynidir',
    m !== null && m[1].toLowerCase() === hex.toLowerCase(), [hex, m && m[1]]);
}

/* Şərhlərdə qaydanın özü izah olunur, ona görə yalnız KODA baxılır:
   emissiya olunan sətirlərdə `var(--…)` olmamalıdır. */
const kartKod = kart.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
check('kartda CSS dəyişəni işlədilmir', kartKod.indexOf('var(--') < 0);

/* --- 2. Şöbələr --------------------------------------------------------- */
bas('2. Şöbələr');

const SOBE = {};
const sobeBlok = (cfg.match(/'sobeler'\s*=>\s*\[([\s\S]*?)\n    \]/) || [, ''])[1];
for (const m of sobeBlok.matchAll(/'([A-Z]{2})'\s*=>\s*'([^']+)'/g)) SOBE[m[1]] = m[2];

check('beş şöbə var', Object.keys(SOBE).length === 5, Object.keys(SOBE));
check('kodlar iki BÖYÜK LATIN hərfidir',
  Object.keys(SOBE).every(k => /^[A-Z]{2}$/.test(k)), Object.keys(SOBE));
check('kodlar təkrarlanmır', new Set(Object.keys(SOBE)).size === Object.keys(SOBE).length);

/* Kod vəsiqə nömrəsinə, nömrə isə Code-39 barkoduna girir. */
const C39_ELIFBA = /^[0-9A-Z\-. $/+%]+$/;
check('kodlar Code-39 əlifbasındadır',
  Object.keys(SOBE).every(k => C39_ELIFBA.test(k)), Object.keys(SOBE));

/* ƏSAS REQRESSİYA TESTİ: «Məhkəmə-Tibb Ekspertizası» real dövlət qurumunun
   adıdır və `org_ban` siyahısındadır — şöbə siyahısına qayıtmamalıdır. */
const ORG_BAN = ((cfg.match(/'org_ban'\s*=>\s*\[([\s\S]*?)\n    \]/) || [, ''])[1])
  .split('\n').map(l => (l.match(/'([^']+)'/) || [])[1]).filter(Boolean);
check('qadağan siyahısı oxundu', ORG_BAN.length >= 10, ORG_BAN.length);

for (const [kod, ad] of Object.entries(SOBE)) {
  const tapilan = ORG_BAN.filter(w => fold(ad).indexOf(fold(w)) >= 0);
  check('şöbə «' + ad + '» (' + kod + ') real qurum deyil', tapilan.length === 0, tapilan);
}

/* --- 3. XP düsturu — JS əkizi ------------------------------------------ */
bas('3. XP düsturu');

const XP = {};
const xpBlok = (cfg.match(/'xp'\s*=>\s*\[([\s\S]*?)\n    \],/) || [, ''])[1];
const bazaBlok = (xpBlok.match(/'baza'\s*=>\s*\[([\s\S]*?)\]/) || [, ''])[1];
XP.baza = {};
for (const m of bazaBlok.matchAll(/'(\w+)'\s*=>\s*(\d+)/g)) XP.baza[m[1]] = +m[2];
for (const k of ['dogru_sonluq', 'ilk_cehd', 'kodlar', 'sehv_ceza']) {
  const m = xpBlok.match(new RegExp("'" + k + "'\\s*=>\\s*([\\d.]+)"));
  XP[k] = m ? parseFloat(m[1]) : null;
}

check('dörd çətinlik var', Object.keys(XP.baza).length === 4, XP.baza);
check('bazalar artan sıradadır',
  XP.baza.asan < XP.baza.orta && XP.baza.orta < XP.baza.cetin && XP.baza.cetin < XP.baza.kabus, XP.baza);
check('bonus və cəza dəyərləri oxundu',
  XP.dogru_sonluq > 0 && XP.ilk_cehd > 0 && XP.kodlar > 0 && XP.sehv_ceza > 0, XP);

/* PHP tərəfin əkizi. Sürüşmə olarsa aşağıdakı cədvəl uyğun gəlməyəcək. */
const xal = (c, dogru, ilk, kodlar, sehv) => {
  let carpan = 1 + (dogru ? XP.dogru_sonluq : 0) + (ilk && sehv === 0 ? XP.ilk_cehd : 0);
  let x = Math.round((XP.baza[c] !== undefined ? XP.baza[c] : XP.baza.orta) * carpan);
  if (kodlar) x += XP.kodlar;
  x -= XP.sehv_ceza * Math.max(0, sehv);
  return Math.max(0, x);
};

const CEDVEL = [
  ['asan',  false, false, false, 0, 20],
  ['orta',  false, false, false, 0, 40],
  ['cetin', false, false, false, 0, 70],
  ['kabus', false, false, false, 0, 120],
  ['orta',  true,  false, false, 0, 60],   // ×1.5
  ['orta',  false, true,  false, 0, 52],   // ×1.3
  ['orta',  true,  true,  false, 0, 72],   // ×1.8 — TOPLANIR, vurulmur
  ['orta',  true,  true,  true,  0, 92],   // + sabit kod bonusu
  ['orta',  true,  true,  true,  1, 70],   // səhv ilk-cəhd bonusunu da söndürür
  ['asan',  false, false, false, 99, 0],   // SIFIR DÖŞƏMƏSİ
  ['kabus', true,  true,  true,  0, 236],
];
for (const [c, d, i, k, s, gozlenen] of CEDVEL) {
  check('xal(' + [c, d, i, k, s].join(',') + ') = ' + gozlenen, xal(c, d, i, k, s) === gozlenen, xal(c, d, i, k, s));
}

/* İKİNCİ RÜTBƏ ZƏMANƏTLİDİR: pulsuz `orta` işin ƏN PİS nəticəsi ikinci
   pillənin həddinə çatmalıdır, yoxsa «ilk addım asan olsun» şərti pozulur. */
check('pulsuz işin ən pis halı ikinci rütbəyə çatdırır',
  xal('orta', true, false, false, 2) >= RUTBE[1].xp, [xal('orta', true, false, false, 2), RUTBE[1].xp]);

check('düstur yalnız Xp sinifindədir',
  (xpPhp.match(/round\(/g) || []).length >= 1
  && oxu(APP, 'app', 'Services', 'RankService.php').indexOf('round($xal') < 0);

/* --- 4. Vəsiqə nömrəsi -------------------------------------------------- */
bas('4. Vəsiqə nömrəsi');

check('nizam sabiti var', /NIZAM\s*=\s*'\/\^\[A-Z\]\{2\}-/.test(nomre));
check('tavan 9999-dur', /TAVAN\s*=\s*9999/.test(nomre));
check('sıfırla doldurma var', nomre.indexOf("'%04d'") >= 0);

/* Nömrə TƏSADÜFİ OLMAMALIDIR — ardıcıllıq real xidmət nişanının şərtidir
   və `issueBadge()` növbətini `ORDER BY ... DESC` ilə tapır. */
const profilServis = oxu(APP, 'app', 'Services', 'ProfileService.php');
for (const [f, src] of [['VesiqeNo', nomre], ['ProfileService', profilServis], ['RankSeeder', seed]]) {
  check(f + ' təsadüfi ədəd işlətmir', !/\b(rand|mt_rand|random_int)\s*\(/.test(src));
}
check('nömrə sətir kilidi altında verilir',
  profilServis.indexOf('lockForUpdate') >= 0 && profilServis.indexOf('DB::transaction') >= 0);

/* --- 5. Marşrutlar və görünüşlər --------------------------------------- */
bas('5. Marşrutlar və görünüşlər');

const VIEWS = path.join(APP, 'resources', 'views');
const GORUNUS = ['dossier/mustentiq', 'dossier/ayarlar', 'dossier/hesab', 'dossier/reyting',
                 'dossier/partials/vesiqe-yoxdur', 'dossier/partials/emr',
                 'dossier/partials/flash', 'admin/avatars'];
for (const g of GORUNUS.filter(g => !g.endsWith('vesiqe-yoxdur'))) {
  check('görünüş ' + g + ' var', fs.existsSync(path.join(VIEWS, g + '.blade.php')));
}

const ADLAR = ['dossier.profil', 'dossier.profil.ayarlar', 'dossier.profil.ad',
  'dossier.profil.sobe', 'dossier.profil.gizlilik', 'dossier.profil.foto',
  'dossier.profil.foto.store', 'dossier.profil.emr', 'dossier.reyting',
  'dossier.hesab', 'dossier.register', 'dossier.login', 'dossier.logout'];
for (const a of ADLAR) {
  check('marşrut «' + a + '» qeydiyyatdadır', marsrut.indexOf("'" + a + "'") >= 0);
}

/* İdarə paneli marşrutları `Route::name('admin.')` qrupunun içindədir, ona
   görə faylda yalnız SONLUQ yazılır — tam ad `tests/audit.php`-də yoxlanılır. */
const ADMIN_ADLAR = ['avatars', 'avatars.approve', 'avatars.reject',
  'avatars.image', 'profiles.xp', 'profiles.recalc'];
for (const a of ADMIN_ADLAR) {
  check('marşrut «admin.' + a + '» qeydiyyatdadır',
    new RegExp("name\\('" + a.replace('.', '\\.') + "'\\)").test(marsrut));
}

/* Profil və hesab BAĞLI, reytinq AÇIQ — hər iki istiqamət yoxlanılır. */
const robots = oxu(APP, 'public', 'robots.txt');
check('profil robots.txt-də bağlıdır', robots.indexOf('Disallow: /is/mustentiq') >= 0);
check('hesab robots.txt-də bağlıdır', robots.indexOf('Disallow: /is/hesab') >= 0);
check('reytinq robots.txt-də BAĞLI DEYİL', robots.indexOf('Disallow: /is/reyting') < 0);
check('reytinq görünüşü indekslənir',
  oxu(VIEWS, 'dossier', 'reyting.blade.php').indexOf("@section('robots', 'index, follow')") >= 0);
check('profil görünüşü indekslənmir',
  oxu(VIEWS, 'dossier', 'mustentiq.blade.php').indexOf("'index, follow'") < 0);

/* --- 6. Qurulma zənciri ------------------------------------------------ */
bas('6. Qurulma zənciri');

const build = oxu(ROOT, 'tools', 'build-laravel.js');
const ASSETS = path.join(APP, 'public', 'assets');
for (const a of ['dossier-profil.css', 'dossier-profil.js']) {
  check(a + ' ASSETS siyahısındadır', build.indexOf("'" + a + "'") >= 0);
  check(a + ' public/assets-də var', fs.existsSync(path.join(ASSETS, a)));
  check(a + ' brend taramasındadır', oxu(ROOT, 'tools', 'check-dossier.js').indexOf("'" + a + "'") >= 0);
}

/* Kart PNG kimi paylaşılır — çevirici brauzerdədir və `export.js` tələb edir. */
check('profil səhifəsi export.js yükləyir',
  oxu(VIEWS, 'dossier', 'mustentiq.blade.php').indexOf('assets/export.js') >= 0);
check('endirmə ZEXPORT işlədir',
  oxu(FE, 'dossier-profil.js').indexOf('ZEXPORT.pngBlob') >= 0);

/* --- 7. Hüquqi qalxan --------------------------------------------------- */
bas('7. Hüquqi qalxan');

/* Yaxa vəsiqəsi BEŞİNCİ paylaşılan artefaktdır: PNG kimi çıxarılıb Story-yə
   qoyulur, yəni saytdan kənarda yaşayır — qeyd onun ÜZƏRİNDƏ olmalıdır. */
check('kart fiktivlik qeydi daşıyır', kart.indexOf('Byuro::QEYD_QISA') >= 0);
check('kart büro adını daşıyır', kart.indexOf('Byuro::AD') >= 0);
check('kart mikromətn zolağı çəkir', /function mikro/.test(kart));

const QADAGAN = ['zarafat', 'notariat', 'reyestr', 'parodiya', 'znp', 'quvvesi',
                 'eylence meqsedli', 'palatasi', 'devetname', 'davetim'];
const TARANAN = [
  path.join(FE, 'dossier-profil.js'), path.join(FE, 'dossier-profil.css'),
  path.join(APP, 'app', 'Services', 'CardRenderer.php'),
  path.join(APP, 'app', 'Support', 'Dossier', 'Xp.php'),
  path.join(APP, 'app', 'Support', 'Dossier', 'VesiqeNo.php'),
  path.join(VIEWS, 'dossier', 'mustentiq.blade.php'),
  path.join(VIEWS, 'dossier', 'ayarlar.blade.php'),
  path.join(VIEWS, 'dossier', 'hesab.blade.php'),
  path.join(VIEWS, 'dossier', 'reyting.blade.php'),
];
for (const f of TARANAN) {
  const body = fold(oxu(f));
  const tapilan = QADAGAN.filter(w => body.indexOf(fold(w)) >= 0);
  check(path.basename(f) + ' brend sözü daşımır', tapilan.length === 0, tapilan);
}

/* Qonağın vəsiqəsi olmamalıdır — kartın qazanılan bir şey olması
   qeydiyyatın bütün motivasiyasıdır. */
const profilBlade = oxu(VIEWS, 'dossier', 'mustentiq.blade.php');
check('qonaq üçün kart render olunmur', /\$qonaq\b/.test(profilBlade));
check('qonağa qeydiyyat çağırışı göstərilir', profilBlade.indexOf('dossier.hesab') >= 0);

/* --- 8. Möhür və holoqram ---------------------------------------------- */
bas('8. Möhür və holoqram');

/* Vəsiqə də vərəq kimi qorunma nişanı daşıyır — ortaq komponentlərdən,
   ayrıca çəkilmiş nüsxədən yox. */
check('möhür ortaq komponentdən gəlir', /Nisan::mohur\(/.test(kart));
check('holoqram ortaq komponentdən gəlir', /Nisan::holoqram\(/.test(kart));

/* `Nisan::mohur()` və `holoqram()` `url(#id-…)` ilə bağlanır: eyni səhifədə
   iki eyni id qövsü və qradiyenti üst-üstə salır (reytinq bir səhifədə
   onlarla kart çəkir). Ona görə ikisi də çağıranın `$id` prefiksini almalıdır. */
check('möhürün id-si prefiksdən törəyir', /Nisan::mohur\(\$id \. '-\w+'/.test(kart));
check('holoqramın id-si prefiksdən törəyir', /Nisan::holoqram\(\$id \. '-\w+'/.test(kart));

/* Möhür QIRMIZIDIR və rəng hərfi hex-dir — kətanda `var(--red)` həll olunmur. */
const QIRMIZI = (kart.match(/QIRMIZI\s*=\s*'(#[0-9A-Fa-f]{6})'/) || [])[1];
check('qırmızı sabit elan olunub', QIRMIZI !== undefined, QIRMIZI);
const cssRed = (css.match(/--red:(#[0-9A-Fa-f]{6})/) || [])[1];
check('qırmızı dossier.css --red ilə eynidir',
  QIRMIZI && cssRed && QIRMIZI.toLowerCase() === cssRed.toLowerCase(), [QIRMIZI, cssRed]);
check('möhür qırmızı sabitlə çağırılır', /'reng'\s*=>\s*self::QIRMIZI/.test(kart));

/* MÖHÜR YALNIZ VƏSİQƏ VERİLƏNDƏ vurulur: nömrəsi olmayan kart hələ
   verilməyib, möhür isə verilmə faktının özüdür. Holoqram isə həmişədir —
   folqa kartın materialıdır, vurulan akt deyil. */
const mohurBlok = kart.slice(kart.indexOf('Nisan::holoqram('), kart.indexOf('// Barkod'));
check('möhür `$verilb` şərtinin içindədir', /if \(\$verilb\) \{[\s\S]*Nisan::mohur\(/.test(mohurBlok));
check('holoqram şərtsizdir', mohurBlok.indexOf('Nisan::holoqram(') < mohurBlok.indexOf('if ($verilb)'));

/* SAHƏ SƏTRİ: etiket və dəyər EYNİ xətt üzərindədir. Dəyər aşağı sürüşsə
   (`$y + 30` idi) öz etiketindən uzaq, növbəti etiketə yaxın düşür —
   «şöbə boşdur, nömrə şöbədir» kimi oxunur. */
const saheBlok = (kart.match(/protected function sahe\([\s\S]*?\n    \}/) || [''])[0];
const saheY = [...saheBlok.matchAll(/\$this->t\([^;]*?,\s*(?:36|self::EN - 36),\s*\$y([^,)]*)/g)]
  .map(m => m[1].trim());
check('etiket və dəyər eyni y-dədir', saheY.length === 2 && saheY.every(v => v === ''), saheY);
check('nöqtəli xətt sətrin ALTINDADIR', /M36 ' \. \(\$y \+ 1[0-9]\)/.test(saheBlok));
console.log('\n' + pass + ' keçdi, ' + fail + ' uğursuz');
process.exit(fail ? 1 : 0);
