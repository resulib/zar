/* Sosial kimlik kartlarının bütövlüyü — frontend/sosial.js
   İşlətmək: node tools/check-sosial.js   (npm run test:sosial)

   `check-replies.js`-in qardaşıdır və eyni səbəbdən AYRI skriptdir: kartlar
   `window.CATEGORIES` / `window.TEMPLATES` massivlərində deyil, ayrıca qlobal
   dəyişənlərdədir, ona görə oradakı «12 şablon · 12 dizayn» invariantları
   burada tətbiq olunmur (bax: sosial.js başlığı).

   Burada öz qaydaları var: platforma ağ siyahıları PHP konfiqi ilə bayt-bayt
   eynidir, hər platformanın ən azı bir kartı var, qurum adları nə real qurumu,
   nə də PLATFORMANI təqlid edir, və hər kart parodiya nişanları ilə çəkilir. */
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
const FE = f => fs.readFileSync(path.join(ROOT, 'frontend', f), 'utf8');

/* Sosial kataloq */
const sb = { window: {}, Object, Array, String, Number, RegExp, Math, JSON };
sb.globalThis = sb;
vm.createContext(sb);
vm.runInContext(FE('sosial.js'), sb);
const KINDS = sb.window.SOSIAL_KINDS, SC = sb.window.SOSIAL_CATEGORIES,
      S = sb.window.SOSIAL_CARDS, PARSE = sb.window.SOSIAL_PARSE;

/* doc.js — dizayn/palitra siyahıları və render */
const stubCtx = { font: '', measureText: t => ({ width: String(t).length * 6.1 }) };
const db = {
  window: {}, QRZ: null,
  document: { createElement: () => ({ getContext: () => stubCtx }) },
  Math, Date, JSON, String, Number, Array, Object, isNaN, parseInt, parseFloat, RegExp
};
db.globalThis = db;
vm.createContext(db);
vm.runInContext(FE('doc.js'), db);
const D = db.window.DOCGEN;

const PHP = fs.readFileSync(path.join(ROOT, 'backend-php', 'config', 'sosial.php'), 'utf8');

const ORG_BAN = ['Nazirliy', 'Nazirlər Kabineti', 'Azərbaycan Respublikası',
                 'Dövlət Agentliyi', 'Dövlət Komitəsi', 'Prezident', 'Prokurorluq',
                 'Polis', 'FIFA', 'UEFA', 'UNESCO', 'Interpol', 'İnterpol'];
/* Qurum PLATFORMANIN adını daşıya bilməz: kart platformanın verdiyi sənəd
   təəssüratı yaratmamalıdır — bu, ticarət nişanı riskinin əsas hissəsidir. */
const BRAND_BAN = ['TikTok', 'Tiktok', 'Instagram', 'Meta', 'ByteDance'];
const ORG_AIM = 56;

/* MRZ hər simvolu ayrıca `<tspan>`-dədir; sətri geri yığırıq. */
const mrzOf = (svg) => (svg.match(/<text[^>]*>(?:<tspan[^>]*>[^<]*<\/tspan>)+<\/text>/g) || [])
  .map(t => (t.match(/<tspan[^>]*>([^<]*)<\/tspan>/g) || [])
    .map(x => x.replace(/<[^>]*>/g, '')
      .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')).join(''))
  .filter(l => l.length === 44);

/* Möhürün alt yazısı — TONE.zarafat.sealBot */
const SEAL_TXT = 'ƏYLƏNCƏ MƏQSƏDLİDİR';

let pass = 0, fail = 0;
const check = (n, c, x) => c ? (pass++, console.log('  ✓', n))
                             : (fail++, console.log('  ✗', n, x === undefined ? '' : JSON.stringify(x)));
const head = t => console.log('\n' + t);

/* ==================== 1. Saylar və ayrılıq ==================== */
head('1. Saylar və ayrılıq');
check('2 platforma', KINDS.length === 2, KINDS.map(k => k.k));
check('1 kateqoriya', SC.length === 1, SC.map(c => c.id));
check('6 kart', S.length === 6, S.length);
check('massivdə boşluq (elision) yoxdur',
  S.every((_, i) => Object.prototype.hasOwnProperty.call(S, i)));

/* Faylın ana kataloqa toxunmadığı — replies.js ilə eyni qayda. */
const nb = { window: {}, Object, Array, String, Number, RegExp, Math, JSON };
nb.globalThis = nb;
vm.createContext(nb);
vm.runInContext(FE('templates.js'), nb);
vm.runInContext(FE('templates-xatire.js'), nb);
const beforeC = nb.window.CATEGORIES.length, beforeT = nb.window.TEMPLATES.length;
vm.runInContext(FE('sosial.js'), nb);
check('sosial.js ana kataloqa HEÇ NƏ əlavə etmir',
  nb.window.CATEGORIES.length === beforeC && nb.window.TEMPLATES.length === beforeT,
  [beforeC, nb.window.CATEGORIES.length, beforeT, nb.window.TEMPLATES.length]);

/* ==================== 2. Ağ siyahılar ↔ config/sosial.php ==================== */
head('2. Ağ siyahılar PHP konfiqi ilə eynidir');
const phpList = (name) => {
  const m = PHP.match(new RegExp("'" + name + "'\\s*=>\\s*\\[([^\\]]*)\\]"));
  return m ? (m[1].match(/'([^']+)'/g) || []).map(x => x.slice(1, -1)) : null;
};
check('platforms siyahısı eynidir',
  JSON.stringify(phpList('platforms')) === JSON.stringify(KINDS.map(k => k.k)),
  [phpList('platforms'), KINDS.map(k => k.k)]);

KINDS.forEach(k => {
  const m = PHP.match(new RegExp("'" + k.k + "'\\s*=>\\s*\\[([^\\]]*)\\]"));
  const hosts = m ? (m[1].match(/'([^']+)'/g) || []).map(x => x.slice(1, -1)) : null;
  check(k.k + ' hostları eynidir', JSON.stringify(hosts) === JSON.stringify(k.hosts), [hosts, k.hosts]);
  check(k.k + ' görünən adı konfiqdədir',
    new RegExp("'" + k.k + "'\\s*=>\\s*'" + k.name + "'").test(PHP), k.name);
});

/* ==================== 3. Kartın sxemi ==================== */
head('3. Kartın sxemi');
const ids = S.map(t => t.id);
check('id-lər unikaldır', new Set(ids).size === ids.length,
  ids.filter((x, i) => ids.indexOf(x) !== i));
check('bütün id-lər «s-» ilə başlayır', S.every(t => /^s-[a-z0-9-]+$/.test(t.id)),
  S.filter(t => !/^s-[a-z0-9-]+$/.test(t.id)).map(t => t.id));
check('hamısı `vesiqe` dizaynındadır', S.every(t => t.layout === 'vesiqe'),
  S.filter(t => t.layout !== 'vesiqe').map(t => t.id + ':' + t.layout));
check('dizayn və palitra doc.js-də mövcuddur',
  S.every(t => D.LAYOUTS.indexOf(t.layout) >= 0 && D.PALETTES.indexOf(t.palette) >= 0));
check('hamısı `zarafat` tonundadır', S.every(t => t.tone === 'zarafat'));
check('kateqoriya mövcuddur', S.every(t => SC.some(c => c.id === t.cat)),
  S.filter(t => !SC.some(c => c.id === t.cat)).map(t => t.id));
check('kateqoriya `isSocial` daşıyır', SC.every(c => c.isSocial === true));
check('prefiks ASCII və 2–4 hərfdir', S.every(t => /^[A-Z]{2,4}$/.test(t.regPrefix)),
  S.map(t => t.regPrefix));
check('socialKind ağ siyahıdadır',
  S.every(t => !t.socialKind || KINDS.some(k => k.k === t.socialKind)),
  S.filter(t => t.socialKind && !KINDS.some(k => k.k === t.socialKind)).map(t => t.id));
check('hər platformanın ən azı bir kartı var',
  KINDS.every(k => S.some(t => !t.socialKind || t.socialKind === k.k)));
check('ən azı 4 fərqli palitra', new Set(S.map(t => t.palette)).size >= 4,
  [...new Set(S.map(t => t.palette))]);

/* ==================== 4. Variant siyahıları ==================== */
head('4. Variant siyahıları');
check('hər kartın variant siyahıları var',
  S.every(t => t.titleOptions && t.powersOptions && t.penaltyOptions),
  S.filter(t => !t.titleOptions).map(t => t.id));
check('titleOptions[0] kartın öz başlığıdır',
  S.every(t => t.titleOptions[0] === t.title),
  S.filter(t => t.titleOptions[0] !== t.title).map(t => t.id));
check('penaltyOptions[0] kartın öz cəza bəndidir',
  S.every(t => t.penaltyOptions[0] === t.penalty),
  S.filter(t => t.penaltyOptions[0] !== t.penalty).map(t => t.id));
check('ilk powersMax variant kartın öz bəndləridir',
  S.every(t => t.powersOptions.slice(0, t.powersMax).join('\n') === t.powers),
  S.filter(t => t.powersOptions.slice(0, t.powersMax).join('\n') !== t.powers).map(t => t.id));
check('powersMin 2 · powersMax 4', S.every(t => t.powersMin === 2 && t.powersMax === 4));
check('anket sahələri YOXDUR (variant siyahısı ilə birgə ola bilməz)',
  S.every(t => !t.fields), S.filter(t => t.fields).map(t => t.id));

/* ==================== 5. Hüquqi qalxan ==================== */
head('5. Hüquqi qalxan');
check('hər kartın imzalayan orqanı var', S.every(t => !!t.signOrg),
  S.filter(t => !t.signOrg).map(t => t.id));
check('qurum adı ' + ORG_AIM + ' simvola sığır',
  S.every(t => t.signOrg.length <= ORG_AIM),
  S.filter(t => t.signOrg.length > ORG_AIM).map(t => t.id + ':' + t.signOrg.length));
const realOrg = [];
S.forEach(t => ORG_BAN.forEach(b => {
  if (t.signOrg.indexOf(b) >= 0) realOrg.push(t.id + ' → ' + b);
}));
check('heç bir qurum adı real qurumu təqlid etmir', realOrg.length === 0, realOrg);
const brandOrg = [];
S.forEach(t => BRAND_BAN.forEach(b => {
  if (t.signOrg.indexOf(b) >= 0) brandOrg.push(t.id + ' → ' + b);
}));
check('heç bir qurum adı platformanın adını daşımır', brandOrg.length === 0, brandOrg);
check('bir kateqoriyada ən çoxu 3 qurum',
  new Set(S.map(t => t.signOrg)).size <= 3, [...new Set(S.map(t => t.signOrg))]);

/* ==================== 6. Link parsinqi ==================== */
head('6. Link parsinqi');
const p = (t, f) => PARSE.parse(t, f);
check('tam TikTok linki',
  JSON.stringify(p('https://www.tiktok.com/@aysel_92')) === '{"platform":"tiktok","username":"aysel_92"}');
check('video linkindən istifadəçi adı', p('https://www.tiktok.com/@scout2015/video/671833').username === 'scout2015');
check('Instagram linki', p('https://instagram.com/aysel.92/').platform === 'instagram');
check('paylaşım linki profil deyil', p('https://www.instagram.com/p/CXY123/') === null);
check('naməlum host rədd edilir', p('https://facebook.com/aysel') === null);
check('boşluqlu mətn ad sayılmır', p('salam dunya', 'tiktok') === null);
check('«@ad» seçilmiş platforma ilə', p('@aysel_92', 'tiktok').username === 'aysel_92');
check('platformasız «@ad» rədd edilir', p('@aysel_92') === null);
check('boş giriş', p('') === null && p(null) === null);

/* ==================== 7. Render — KİMLİK KARTI ==================== */
head('7. Render — kimlik kartı, parodiya nişanları ilə');

const mkDoc = (t, social, avatar, paid) => Object.assign({
  templateId: t.id, tone: t.tone, layout: t.layout, palette: t.palette,
  cardStyle: t.cardStyle || null,
  title: t.title, to: 'Aysel M.', from: 'TikTok',
  signOrg: t.signOrg, signTitle: t.signTitle || null,
  preamble: t.preamble.replace(/\{\{(\w+)\}\}/g, '—').replace(/\{from\}/g, 'TikTok'),
  powers: t.powers, penalty: t.penalty,
  regNo: 'SOS-2026-1471', date: '31.08.2026', paid: paid !== false,
  verifyUrl: 'https://zarafat.az/r/SOS-2026-1471'
}, social ? { social: social } : {}, avatar ? { avatar: avatar } : {});

const SOC = { platform: 'tiktok', username: 'aysel_92', name: 'Aysel M.',
              followers: 12437, posts: 284, following: 391, verified: true };
const AV = 'data:image/jpeg;base64,' + 'A'.repeat(64);

check('kart `LAYOUTS` reyestrinə DAXİL EDİLMƏYİB (bijeksiya tələsi)',
  D.LAYOUTS.length === 12 && D.LAYOUTS.indexOf('kimlik') < 0 && D.LAYOUTS.indexOf('kart') < 0,
  D.LAYOUTS.length);
check('kart ölçüsü kredit kartı nisbətindədir',
  D.KART_W === 1080 && D.KART_H === 1350, [D.KART_W, D.KART_H]);
check('3 kart stili elan olunub', D.KART_STILLER.length === 3, D.KART_STILLER);
check('hər stilin adı var', D.KART_STILLER.every(k => !!D.KART_STIL_ADI[k]));

let bad = [];
S.forEach(t => {
  if (t.cardStyle && D.KART_STILLER.indexOf(t.cardStyle) < 0) bad.push(t.id + ': naməlum stil ' + t.cardStyle);
  const svg = D.kart(mkDoc(t, SOC, AV), { idPrefix: 'chk' });
  const g = (svg.match(/<g[ >]/g) || []).length, gc = (svg.match(/<\/g>/g) || []).length;
  if (g !== gc) bad.push(t.id + ': <g> balansı ' + g + '/' + gc);
  if (!/^<svg /.test(svg) || !/<\/svg>$/.test(svg)) bad.push(t.id + ': svg sarğısı pozuq');
  /* hüquqi qalxan — kart `inner()` qapısından KƏNARDADIR, hər nişan açıq çəkilir */
  if (svg.indexOf('data-wm="1"') < 0) bad.push(t.id + ': su nişanı yoxdur');
  if (svg.indexOf('data-dc="1"') < 0) bad.push(t.id + ': disclaimer yoxdur');
  if (svg.indexOf(SEAL_TXT) < 0) bad.push(t.id + ': möhür yoxdur');
  if (svg.indexOf('SOSİAL KİMLİK KARTI') < 0) bad.push(t.id + ': kart başlığı yoxdur');
  if (svg.indexOf('data-sl="1"') < 0) bad.push(t.id + ': platforma nişanı yoxdur');
  if (svg.indexOf('<image href="data:image/jpeg;base64,') < 0) bad.push(t.id + ': avatar çəkilməyib');
  if (svg.indexOf('@aysel_92') < 0) bad.push(t.id + ': istifadəçi adı yoxdur');
  if (svg.indexOf('12,4 K') < 0) bad.push(t.id + ': izləyici sayı yoxdur');
  if (mrzOf(svg).filter(l => l.indexOf('PARODIYA') >= 0).length !== 2) bad.push(t.id + ': MRZ-də PARODIYA yoxdur');
});
check('bütün kartlar tam hüquqi qalxanla çəkilir', bad.length === 0, bad);

/* Hər stil ayrıca çəkilir */
let sbad = [];
D.KART_STILLER.forEach(st => {
  D.PALETTES.forEach(pal => {
    const doc = mkDoc(S[0], SOC, AV);
    doc.cardStyle = st; doc.palette = pal;
    const svg = D.kart(doc, { idPrefix: 'chk' });
    const g = (svg.match(/<g[ >]/g) || []).length, gc = (svg.match(/<\/g>/g) || []).length;
    if (g !== gc) sbad.push(st + '/' + pal + ': <g> balansı');
    if (svg.indexOf('data-wm="1"') < 0 || svg.indexOf('data-dc="1"') < 0) sbad.push(st + '/' + pal + ': nişan əskik');
  });
});
check('3 stil × 6 palitra = 18 kombinasiya təmiz çəkilir', sbad.length === 0, sbad);

/* Ödənilməmiş kartda NÜMUNƏ damğası və QR əvəzinə xəbərdarlıq olmalıdır */
const free = D.kart(mkDoc(S[0], SOC, AV, false), { idPrefix: 'chk' });
check('ödənilməmiş kartda NÜMUNƏ damğası var', free.indexOf('NÜMUNƏ') >= 0);
check('ödənilməmiş kartda QR yoxdur, xəbərdarlıq var',
  free.indexOf('REYESTRDƏ QEYDİYYATDAN KEÇMƏYİB') >= 0 && free.indexOf('REYESTRDƏ YOXLA') < 0);

/* Avatar YALNIZ `data:` URI ola bilər — kənar link sənədi pozar və
   baxan hər kəsin IP-si platformanın CDN-inə düşərdi. */
const evil = D.kart(mkDoc(S[0], SOC, 'https://cdn.evil/x.jpg'), { idPrefix: 'chk' });
check('kənar şəkil linki karta DÜŞMÜR',
  evil.indexOf('https://cdn.evil') < 0 && evil.indexOf('FOTO / PHOTO') >= 0);

/* Story formatı */
const st = D.kartStory(mkDoc(S[0], SOC, AV), { idPrefix: 'chk' });
check('story formatı 1080×1920-dir', /width="1080" height="1920"/.test(st));
check('story formatında da hüquqi qalxan var',
  st.indexOf('data-wm="1"') >= 0 && st.indexOf('data-dc="1"') >= 0);

/* Dispetçer */
const asSocial = D.sheet(mkDoc(S[0], SOC, AV), { idPrefix: 'chk' });
const asPlain  = D.sheet(mkDoc(S[0], null, null), { idPrefix: 'chk' });
check('sheet(): sosial profil varsa kart qaytarır',
  asSocial.kart === true && asSocial.w === D.KART_W && asSocial.h === D.KART_H);
check('sheet(): sosial profil yoxdursa A4 sənəd qaytarır',
  asPlain.kart === false && asPlain.w === D.W && asPlain.h === D.H);
check('share(): hər iki halda story ölçüsü verir',
  D.share(mkDoc(S[0], SOC, AV)).w === 1080 && D.share(mkDoc(S[0], null, null)).h === 1920);

/* ==================== 8. Qeydiyyat ==================== */
head('8. Qeydiyyat — sosial.js dörd yerdə elan olunmalıdır');
const reg = {
  'frontend/index.html': /<script src="\/sosial\.js"><\/script>/,
  'build.js': /'sosial\.js'/,
  'tools/build-laravel.js': /'sosial\.js'/,
  'tools/export-catalog.js': /'sosial\.js'/
};
Object.keys(reg).forEach(f => {
  check(f + ' sosial.js-i tanıyır', reg[f].test(fs.readFileSync(path.join(ROOT, f), 'utf8')));
});
/* viewer.html QƏSDƏN kataloq yükləmir — replies.js ilə eyni qayda. */
check('viewer.html sosial.js YÜKLƏMİR',
  !/sosial\.js/.test(fs.readFileSync(path.join(ROOT, 'frontend', 'viewer.html'), 'utf8')));

console.log('\n' + pass + ' keçdi · ' + fail + ' xəta');
process.exit(fail > 0 ? 1 : 0);
