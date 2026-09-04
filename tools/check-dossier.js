/* İş qovluğu bölməsinin statik yoxlaması — server lazım deyil.
   node tools/check-dossier.js

   Üç şeyi qoruyur:
     · seed fayllarının quruluşu (növlər, kod, cavab indeksi, boşluqlar)
     · BREND SIZMASI — bu tərəfdə saytın digər məhsulunun adı olmamalıdır
     · SİRR SIZMASI — kilidin kodu və düzgün cavablar frontend fayllarında
       və ya konfiqurasiyada heç bir halda görünməməlidir */
const fs = require('fs'), path = require('path');

const ROOT = path.join(__dirname, '..');
const FE = path.join(ROOT, 'frontend');
const APP = path.join(ROOT, 'backend-php');
const SEED = path.join(APP, 'database', 'seeders', 'dossier');
const VIEWS = path.join(APP, 'resources', 'views', 'dossier');

let pass = 0, fail = 0;
const check = (ad, ok, ekstra) => {
  if (ok) { pass++; console.log('  ✓ ' + ad); }
  else { fail++; console.log('  ✗ ' + ad + (ekstra === undefined ? '' : ' → ' + JSON.stringify(ekstra))); }
};
const bas = (t) => console.log('\n' + t);

/* --- 1. Seed faylları ------------------------------------------------ */
bas('1. Seed faylları');
check('seed qovluğu var', fs.existsSync(SEED));
const files = fs.existsSync(SEED) ? fs.readdirSync(SEED).filter(f => f.endsWith('.json')).sort() : [];
check('ən azı bir qovluq var', files.length >= 1, files.length);

const qovluqlar = files.map(f => JSON.parse(fs.readFileSync(path.join(SEED, f), 'utf8')));

for (const q of qovluqlar) {
  const ad = q.slug || '(slugsuz)';
  check(ad + ' — slug ünvana yarayır', /^[0-9]{4}-[0-9]{4}$/.test(q.slug || ''), q.slug);
  check(ad + ' — nömrə büro kodu ilə slug-a uyğundur',
    q.no === 'AFİB-' + String(q.slug || '').replace('-', '/'), q.no);
  check(ad + ' — başlıq və təsvir var', !!q.title && !!q.blurb);
  check(ad + ' — üz qabığında qurum sətirləri var', ((q.cover || {}).org || []).length >= 1);
  /* Təqdimat səhifəsinin mətnləri. Boş qalsa səhifə yarımçıq görünər. */
  check(ad + ' — yer göstərilib', String(q.place || '').length > 4, q.place);
  check(ad + ' — dövr göstərilib', String(q.period || '').length > 3, q.period);
  check(ad + ' — giriş mətni var', String(q.intro || '').length > 120, (q.intro || '').length);
  check(ad + ' — alibi oxu 3 nişandır', (q.axis || []).length === 3, q.axis);
  check(ad + ' — kağız başlığı var', ((q.cover || {}).paperHead || []).length >= 1);
  check(ad + ' — şübhəlilər var', (q.suspects || []).length >= 2, (q.suspects || []).length);
  check(ad + ' — xronologiya var', (q.chronology || []).length >= 3, (q.chronology || []).length);
  check(ad + ' — izah bəndləri var', (q.solution || []).length >= 2, (q.solution || []).length);
  /* Massivdəki boşluq (`[{…}, , {…}]`) filter/every tərəfindən görünmür,
     amma `length` onu sayır — sayları səssizcə sürüşdürür. */
  check(ad + ' — massivlərdə boşluq yoxdur',
    [q.documents, q.questions, q.suspects].every(a => (a || []).every((x, i) => i in a)));
}

/* --- 2. Blok növləri ↔ komponentlər ---------------------------------- */
bas('2. Blok növləri');
const cfg = fs.readFileSync(path.join(APP, 'config', 'dossier.php'), 'utf8');
const BLOKLAR = (cfg.match(/'bloklar'\s*=>\s*\[([\s\S]*?)\n    \]/) || [, ''])[1]
  .split('\n').map(l => (l.match(/'([a-z]+)'/) || [])[1]).filter(Boolean);

check('konfiqurasiyada 13 blok növü var', BLOKLAR.length === 13, BLOKLAR);

for (const t of BLOKLAR) {
  check('«' + t + '» üçün komponent var', fs.existsSync(path.join(VIEWS, 'bloklar', t + '.blade.php')));
}

/* Köhnə sabit şablonlar getməlidir: render qatı hekayəni tanımamalıdır. */
check('köhnə növ şablonları silinib', ! fs.existsSync(path.join(VIEWS, 'senedler')));

/* Hər blok növü ən azı bir yerdə göstərilməlidir — QOVLUQDA yox, QALEREYADA:
   qovluq yalnız ona lazım olan blokları işlədir, qalereya isə hamısını
   göstərməlidir, çünki yeni qovluq yazan adam ona baxır. */
const qal = fs.readFileSync(path.join(APP, 'app', 'Support', 'Dossier', 'Qalereya.php'), 'utf8');
const qalBlok = new Set([...qal.matchAll(/'tip'\s*=>\s*'([a-z]+)'/g)].map(m => m[1]));
/* Əlyazma və kənar nümunələri ayrı metodlardadır — onları da say. */
for (const t of ['elyazma', 'metn']) if (qal.indexOf("'" + t + "'") >= 0) qalBlok.add(t);
check('qalereya hər blok növünü göstərir', BLOKLAR.every(t => qalBlok.has(t)),
  BLOKLAR.filter(t => !qalBlok.has(t)));

/* Qalereya YALNIZ lokal mühitdə açılır — istehsalatda marşrut yoxdur. */
const marshrut = fs.readFileSync(path.join(APP, 'routes', 'web.php'), 'utf8');
check('qalereya marşrutu mühitə bağlıdır',
  /environment\(\['local', 'testing'\]\)[\s\S]{0,120}dossier\.gallery/.test(marshrut));

const islenen = new Set();
for (const q of qovluqlar) {
  for (const d of q.documents || []) {
    const bl = (d.content || {}).bloklar;
    check(q.slug + ' v.' + d.page + ' — blok siyahısı var', Array.isArray(bl) && bl.length > 0);
    check(q.slug + ' v.' + d.page + ' — köhnə «type» qalmayıb', d.type === undefined, d.type);
    for (const b of bl || []) {
      islenen.add(b.tip);
      if (BLOKLAR.indexOf(b.tip) < 0) check(q.slug + ' v.' + d.page + ' — naməlum blok «' + b.tip + '»', false);
    }
  }
}
check('qovluqlarda ən azı 8 blok növü işlənir', islenen.size >= 8, [...islenen].sort());

/* Blank başlığının növləri: config ↔ komponent faylları ↔ BlokSxemi.
   Blok növləri ilə eyni intizam — siyahının bir tərəfi dəyişsə, suit sınır. */
const BLANK_NOV = (cfg.match(/'blank_novleri'\s*=>\s*\[([^\]]*)\]/) || [, ''])[1]
  .split(',').map(x => (x.match(/'([a-z]+)'/) || [])[1]).filter(Boolean);
check('blank növləri config-də var', BLANK_NOV.length >= 4, BLANK_NOV);
for (const n of BLANK_NOV) {
  check('blank növü «' + n + '» üçün komponent var',
    fs.existsSync(path.join(APP, 'resources', 'views', 'components', 'blank', n + '.blade.php')));
}
{
  const sxemi = fs.readFileSync(path.join(APP, 'app', 'Support', 'Dossier', 'BlokSxemi.php'), 'utf8');
  const php = (sxemi.match(/BLANK_NOV\s*=\s*\[([^\]]*)\]/) || [, ''])[1]
    .split(',').map(x => (x.match(/'([a-z]+)'/) || [])[1]).filter(Boolean);
  check('blank növləri BlokSxemi ilə üst-üstə düşür',
    php.join(',') === BLANK_NOV.join(','), [php, BLANK_NOV]);
}
/* Seed-dəki hər `nov` ağ siyahıdadır — yoxsa render `resmi`-yə düşür və
   səhv səssizcə itər. */
for (const q of qovluqlar) {
  for (const d of q.documents || []) {
    for (const b of ((d.content || {}).bloklar) || []) {
      if (b.tip === 'blank' && b.nov !== undefined) {
        check(q.slug + ' v.' + d.page + ' — blank növü tanınır',
          BLANK_NOV.indexOf(b.nov) >= 0, b.nov);
      }
    }
  }
}

/* --- 3. Kilid və cavablar -------------------------------------------- */
bas('3. Kilid və cavablar');
for (const q of qovluqlar) {
  const kilidli = (q.documents || []).filter(d => d.locked);
  check(q.slug + ' — ən azı bir kilidli sənəd var', kilidli.length >= 1, kilidli.length);

  for (const d of kilidli) {
    /* Kilid NÖV DEYİL, XASSƏDİR: istənilən blok tərkibi kilidli ola bilər. */
    const k = d.kilid || {};
    check(q.slug + ' v.' + d.page + ' — kilid xassəsi var', !!k.nov, Object.keys(d));
    check(q.slug + ' v.' + d.page + ' — kod növə uyğundur',
      k.nov !== 'reqem' || /^\d{4}$/.test(k.kod || ''), k.kod);
    check(q.slug + ' v.' + d.page + ' — ipucu var', String(k.ipucu || '').length > 20);
    check(q.slug + ' v.' + d.page + ' — kod məzmunda təkrarlanmır',
      JSON.stringify(d.content || {}).indexOf(k.kod) < 0);
  }

  for (const d of (q.documents || []).filter(x => !x.locked)) {
    check(q.slug + ' v.' + d.page + ' — kilidsiz sənəddə kilid yoxdur', !d.kilid);
  }

  check(q.slug + ' — 3 sual var', (q.questions || []).length === 3, (q.questions || []).length);
  for (const s of q.questions || []) {
    check(q.slug + ' — «' + s.prompt.slice(0, 22) + '…» variant sayı 2–8',
      (s.options || []).length >= 2 && (s.options || []).length <= 8, (s.options || []).length);
    check(q.slug + ' — «' + s.prompt.slice(0, 22) + '…» düzgün indeks aralıqdadır',
      Number.isInteger(s.correct) && s.correct >= 0 && s.correct < (s.options || []).length, s.correct);
  }
}

/* --- 3b. Satış üzü: nişan, nümunə, açar sənəd ------------------------- */
bas('3b. Satış üzü');

const BADGES = (cfg.match(/'badges'\s*=>\s*\[([\s\S]*?)\]/) || [, ''])[1]
  .split(',').map(x => (x.match(/'([a-z-]+)'/) || [])[1]).filter(Boolean);
check('nişan ağ siyahısı doludur', BADGES.length >= 1, BADGES);

const showcase = qovluqlar.filter(q => q.showcase === true);
/* Ana səhifədəki hero və nümunə lenti BİR qovluqdan gəlir: ikisi olsa
   hansının seçildiyi sıraya bağlı olardı, heç biri olmasa səhifə boşalardı. */
check('tam olaraq bir qovluq showcase-dir', showcase.length === 1, showcase.map(q => q.slug));

for (const q of qovluqlar) {
  const ad = q.slug;

  if (q.badge) {
    check(ad + ' — nişan ağ siyahıdadır', BADGES.indexOf(q.badge) >= 0, q.badge);
  }

  const numune = (q.documents || []).filter(d => d.sample);
  check(ad + ' — 3–6 nümunə vərəq var', numune.length >= 3 && numune.length <= 6, numune.length);
  check(ad + ' — nümunə vərəqlərin heç biri kilidli deyil', numune.every(d => !d.locked));
  /* Lent müxtəlif olmalıdır ki, adam nə alacağını görsün. Sənədin «növü»
     yoxdur, ona görə ölçü vahidi BLOK TƏRKİBİDİR. */
  const seciciler = ['cedvel', 'yazisma', 'sxem', 'kart', 'zeng', 'foto', 'elave'];
  const imza = numune.map(d => (((d.content || {}).bloklar) || [])
    .map(b => b.tip).filter(t => seciciler.indexOf(t) >= 0).join('+'));
  check(ad + ' — nümunələrin blok tərkibi müxtəlifdir', new Set(imza).size === imza.length, imza);

  /* HEKAYƏNİN AÇARI. İki sənəd ziddiyyət təşkil edir və məhz onlar
     ana səhifədə pulsuz göstərilməməlidir — yoxsa oyun pulsuz həll olunur. */
  const acar = (q.documents || []).filter(d => d.key);
  check(ad + ' — ən azı iki açar sənəd işarələnib', acar.length >= 2, acar.length);
  check(ad + ' — açar sənəd nümunə deyil', acar.every(d => !d.sample),
    acar.filter(d => d.sample).map(d => d.page));

  /* Ana səhifə cavab vərəqinin SONUNCU sualını göstərir. Onun variantları
     sənəd adları olmalıdır: birinci sual şübhəlilərin adını açardı. */
  const son = (q.questions || [])[(q.questions || []).length - 1];
  const adlar = (q.suspects || []).map(x => x.name);
  const sizan = (son ? son.options || [] : []).filter(o => adlar.some(n => o.indexOf(n) >= 0));
  check(ad + ' — sonuncu sual şübhəli adı daşımır', sizan.length === 0, sizan);
}

check('FAQ ən azı beş bənddir', (cfg.match(/'s' =>/g) || []).length >= 5,
  (cfg.match(/'s' =>/g) || []).length);

/* Azərbaycan hərfləri ASCII-yə çevrilir: 'İ'.toLowerCase() iki kod nöqtəsidir
   və JS-in `i` bayrağı `İ` hərfini tutmur. Həm brend, həm də qurum
   taramaları bu funksiyadan keçir. */
const fold = s => String(s)
  .replace(/[Əə]/g, 'e').replace(/[Ğğ]/g, 'g').replace(/[İI]/g, 'i').replace(/ı/g, 'i')
  .replace(/[Öö]/g, 'o').replace(/[Şş]/g, 's').replace(/[Üü]/g, 'u').replace(/[Çç]/g, 'c')
  .toLowerCase();

/* --- 3c. Fiktiv qurum — hüquqi qalxan --------------------------------- */
bas('3c. Fiktiv qurum');

const byuro = fs.readFileSync(path.join(APP, 'app', 'Support', 'Dossier', 'Byuro.php'), 'utf8');
const byuroSabit = (ad) => (byuro.match(new RegExp("const " + ad + " = '([^']+)'")) || [, ''])[1];

const AD = byuroSabit('AD');
const QISA = byuroSabit('QISA');
/* Qeyd iki sətrə bölünüb, ona görə ayrıca yığılır. */
const QEYD = (byuro.match(/const QEYD = '([^']+)'\s*\n\s*\. '([^']+)'/) || [, '', '']).slice(1).join('');

check('büro adı təyin olunub', AD !== '' && QISA === 'AFİB', [AD, QISA]);
/* Mətn hüquqi tələbdir — hərfi yoxlanılır. */
check('məcburi qeydin mətni dəqiqdir',
  QEYD === 'FİKTİV OYUN SƏNƏDİ — yalnız əyləncə məqsədi ilə hazırlanmışdır. '
    + 'Real hüquqi və ya rəsmi sənəd deyil.', QEYD);

/* MEXANİKİ QAPI: qeyd ayrı-ayrı növlərə deyil, hər sənədin keçdiyi yeganə
   sarğıya yazılıb. `doc.js`-dəki `inner()` ilə eyni məntiq. */
const sarqi = fs.readFileSync(path.join(VIEWS, 'sened.blade.php'), 'utf8');
check('sənəd sarğısı qeydi əlavə edir',
  /Byuro::QEYD/.test(sarqi) && /data-fq="1"/.test(sarqi));
/* Paylaşılan sertifikat səhifəsi saytdan kənarda yaşayır. */
const hesabat = fs.readFileSync(path.join(VIEWS, 'hesabat.blade.php'), 'utf8');
check('sertifikat səhifəsi qeyd daşıyır', /Byuro::QEYD/.test(hesabat));
check('sertifikat səhifəsi footer daxil edir', /partials\.altliq/.test(hesabat));
/* Paylaşılan şəkillər — Story və link önizləməsi. */
for (const [f, ad] of [['dossier-cert.js', 'sertifikat şəkli'], ['dossier.js', 'oyun içindəki sertifikat']]) {
  check(ad + ' qeyd daşıyır',
    fs.readFileSync(path.join(FE, f), 'utf8').indexOf('FİKTİV OYUN SƏNƏDİ') >= 0);
}
check('OG şəkli qeyd daşıyır',
  fs.readFileSync(path.join(ROOT, 'tools', 'render-dossier-og.js'), 'utf8')
    .indexOf('FİKTİV OYUN SƏNƏDİ') >= 0);

/* MÜSBƏT TƏSDİQ: verən qurum qara siyahı ilə deyil, BƏRABƏRLİKLƏ yoxlanılır.
   Qara siyahı gözlənilməyən ifadədə açıq sınır, bərabərlik bağlı sınır. */
for (const q of qovluqlar) {
  const ad = q.slug;
  const org = (q.cover || {}).org || [];
  check(ad + ' — verən qurum AFİB-dir', org[0] === AD, org[0]);
  check(ad + ' — qurum sətrində büro kodu var', String(org[1] || '').indexOf(QISA) >= 0, org[1]);
  check(ad + ' — vərəq başlığı büro kodu daşıyır',
    ((q.cover || {}).paperHead || []).some(l => l.indexOf(QISA) >= 0), (q.cover || {}).paperHead);
  check(ad + ' — möhürdə «FİKTİV» var',
    ((q.cover || {}).stamp || []).indexOf('FİKTİV') >= 0, (q.cover || {}).stamp);
}

/* DAR QARA SİYAHI: yalnız çoxsözlü, birmənalı ifadələr. Tək «polis»
   qadağan olunsaydı, adi cümlə yazmaq mümkün olmazdı. */
const ORG_BAN = (cfg.match(/'org_ban'\s*=>\s*\[([\s\S]*?)\n    \]/) || [, ''])[1]
  .split('\n').map(l => (l.match(/'([^']+)'/) || [])[1]).filter(Boolean);
check('qadağan siyahısı doludur', ORG_BAN.length >= 10, ORG_BAN.length);

const KOMPONENT = path.join(APP, 'resources', 'views', 'components');

/* Komponentlər alt qovluqlara bölünür (`components/blank/*`), ona görə
   siyahı REKURSİVDİR — yoxsa yeni qovluq qalxanın taramasından yayınardı. */
const komponentFayllari = (dir) => (fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }) : [])
  .flatMap(e => e.isDirectory() ? komponentFayllari(path.join(dir, e.name))
    : (e.name.endsWith('.blade.php') ? [path.join(dir, e.name)] : []));

const QURUM_SCAN = files.map(f => path.join(SEED, f))
  .concat(fs.readdirSync(VIEWS).filter(f => f.endsWith('.blade.php')).map(f => path.join(VIEWS, f)))
  .concat(fs.readdirSync(path.join(VIEWS, 'bloklar')).map(f => path.join(VIEWS, 'bloklar', f)))
  .concat(fs.readdirSync(path.join(VIEWS, 'partials')).map(f => path.join(VIEWS, 'partials', f)))
  /* ORTAQ NİŞAN KOMPONENTLƏRİ (`<x-gerb>`, `<x-mohur>`) sənədin üzərində
     görünür, yəni hüquqi qalxan onlara da aiddir. `views/components/`
     `views/dossier/`-dən kənardadır — siyahıya əl ilə əlavə olunur. */
  .concat(komponentFayllari(KOMPONENT))
  .concat([path.join(APP, 'app', 'Support', 'Nisan.php')])
  .concat(['dossier.js', 'dossier-site.js', 'dossier-cert.js', 'dossier.css'].map(f => path.join(FE, f)))
  .concat([path.join(ROOT, 'tools', 'render-dossier-og.js')]);

/* `qaydalar.blade.php` taramadan KƏNARDADIR və bu, boşluq deyil: onun işi
   məhz həmin qurumların adını çəkib «bunlarla əlaqəli deyil» demək,
   yəni inkar cümləsi qadağan sözləri saxlamalıdır. Deşik açılmasın deyə
   fayl əvəzində MÜSBƏT yoxlanılır — inkarın orada olduğu təsdiqlənir. */
const QAYDALAR = path.join(VIEWS, 'qaydalar.blade.php');
const qaydalar = fs.readFileSync(QAYDALAR, 'utf8');
check('qaydalar səhifəsi qurumu inkar edir',
  /mövcud deyil/.test(qaydalar) && /əlaqəli deyil/.test(qaydalar) && /Byuro::AD/.test(qaydalar));

for (const f of QURUM_SCAN.filter(f => f !== QAYDALAR)) {
  const body = fold(fs.readFileSync(f, 'utf8'));
  const tapilan = ORG_BAN.filter(w => body.indexOf(w) >= 0);
  check(path.basename(f) + ' real qurum daşımır', tapilan.length === 0, tapilan);
}

/* --- 4. Sirr sızması -------------------------------------------------- */
bas('4. Sirr sızması');
const SIRR = [];
for (const q of qovluqlar) {
  for (const d of (q.documents || []).filter(x => x.locked)) SIRR.push((d.kilid || {}).kod);
  for (const s of q.questions || []) SIRR.push((s.options || [])[s.correct]);
  for (const p of q.solution || []) SIRR.push(p.slice(0, 40));
}

const MUSTERI = ['dossier.js', 'dossier-site.js', 'dossier-cert.js', 'dossier.css', 'dossier-fonts.css']
  .map(f => path.join(FE, f))
  .concat(fs.readdirSync(VIEWS).filter(f => f.endsWith('.blade.php')).map(f => path.join(VIEWS, f)))
  .concat([path.join(APP, 'resources', 'views', 'layouts', 'dossier.blade.php')]);

for (const f of MUSTERI) {
  const body = fs.readFileSync(f, 'utf8');
  const tapilan = SIRR.filter(s => s && body.indexOf(s) >= 0);
  check(path.basename(f) + ' sirr daşımır', tapilan.length === 0, tapilan);
}

/* Model səviyyəsində gizlətmə — ikinci müdafiə xətti. */
const doc = fs.readFileSync(path.join(APP, 'app', 'Models', 'DossierDocument.php'), 'utf8');
const sual = fs.readFileSync(path.join(APP, 'app', 'Models', 'DossierQuestion.php'), 'utf8');
check('DossierDocument `lock_code` və `content` gizlədir',
  /\$hidden\s*=\s*\['lock_code',\s*'content'\]/.test(doc));
check('DossierQuestion `correct_index` və `explanation` gizlədir',
  /\$hidden\s*=\s*\['correct_index',\s*'explanation'\]/.test(sual));

/* --- 5. Brend sızması ------------------------------------------------- */
bas('5. Brend sızması');
/* `mohur` siyahıda YOXDUR: bu bölmədə möhür istintaq möhürüdür və üz
   qabığının bir hissəsidir. Qalanları kənar məhsulun lüğətidir. */
const QADAGAN = ['zarafat', 'notariat', 'reyestr', 'parodiya', 'znp', 'quvvesi',
                 'eylence meqsedli', 'palatasi', 'devetname', 'davetim'];

const SCAN = MUSTERI
  .concat([path.join(APP, 'config', 'dossier.php')])
  .concat(fs.readdirSync(path.join(VIEWS, 'bloklar')).map(f => path.join(VIEWS, 'bloklar', f)))
  .concat(fs.readdirSync(path.join(VIEWS, 'partials')).map(f => path.join(VIEWS, 'partials', f)))
  .concat(files.map(f => path.join(SEED, f)))
  .concat([path.join(ROOT, 'tools', 'render-dossier-og.js')]);

for (const f of SCAN) {
  const body = fold(fs.readFileSync(f, 'utf8'));
  const tapilan = QADAGAN.filter(w => body.indexOf(fold(w)) >= 0);
  check(path.basename(f) + ' təmizdir', tapilan.length === 0, tapilan);
}
check('yoxlanan fayl sayı', SCAN.length >= 15, SCAN.length);

/* --- 6. Qurulma zənciri ----------------------------------------------- */
bas('6. Qurulma zənciri');
const build = fs.readFileSync(path.join(ROOT, 'tools', 'build-laravel.js'), 'utf8');
const FRONT = ['dossier.css', 'dossier-fonts.css', 'dossier.js', 'dossier-cert.js', 'dossier-site.js'];
for (const a of FRONT) {
  check(a + ' ASSETS siyahısındadır', build.indexOf("'" + a + "'") >= 0);
}
const ASSETS = path.join(APP, 'public', 'assets');
for (const a of FRONT) {
  check(a + ' public/assets-də var', fs.existsSync(path.join(ASSETS, a)));
}

/* Bölmənin adı MÜVƏQQƏTİDİR və yalnız config-dədir: ad seçiləndə dəyişəcək
   yeganə yer bir sətir olsun deyə Blade-lərdə sabit yazılmamalıdır. */
const BREND = (cfg.match(/'brand'\s*=>\s*'([^']+)'/) || [, ''])[1];
check('brend adı config-də təyin olunub', BREND !== '', BREND);
const bladeler = fs.readdirSync(VIEWS).filter(f => f.endsWith('.blade.php'))
  .map(f => path.join(VIEWS, f))
  .concat(fs.readdirSync(path.join(VIEWS, 'partials')).map(f => path.join(VIEWS, 'partials', f)))
  .concat([path.join(APP, 'resources', 'views', 'layouts', 'dossier.blade.php')]);
const sabit = bladeler.filter(f => fs.readFileSync(f, 'utf8').indexOf(BREND) >= 0);
check('brend adı Blade-lərdə sabit yazılmayıb', sabit.length === 0, sabit.map(f => path.basename(f)));
check('şrift dəsti çıxarılıb',
  fs.readdirSync(path.join(FE, 'fonts')).filter(f => f.indexOf('dossier-') === 0).length === 20);
check('əlyazma üzləri var',
  ['dossier-elyazma-400', 'dossier-elyazma-700', 'dossier-qelem-400']
    .every(f => fs.existsSync(path.join(FE, 'fonts', f + '-latin.woff2'))));
check('maili üz var', fs.existsSync(path.join(FE, 'fonts', 'dossier-mono-400i-latin.woff2')));

/* Satış səhifələri AÇIQDIR, oyun və sertifikat bağlıdır. Ümumi
   `Disallow: /is/` sətri qayıtsa, ana səhifə də axtarışdan düşərdi. */
const robots = fs.readFileSync(path.join(APP, 'public', 'robots.txt'), 'utf8');
check('robots.txt oyunu bağlayır', robots.indexOf('Disallow: /is/*/qovluq') >= 0);
check('robots.txt sertifikatı bağlayır', robots.indexOf('Disallow: /is/*/hesabat/') >= 0);
check('robots.txt satış səhifələrini bağlamır', !/Disallow: \/is\/\s*$/m.test(robots));

for (const q of qovluqlar) {
  check(q.slug + ' — önizləmə şəkli hazırdır', fs.existsSync(path.join(FE, 'dossier-og', q.slug + '.jpg')));
}

console.log('\n' + pass + ' keçdi, ' + fail + ' uğursuz');
process.exit(fail ? 1 : 0);
