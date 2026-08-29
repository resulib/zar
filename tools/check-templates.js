/* Şablon kataloqunun bütövlüyü: unikal id, kateqoriya uyğunluğu,
   server mətn büdcəsi və layout/palitra paylanması. */
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT_DIR = path.join(__dirname, '..');

const sandbox = { window: {} };
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
/* Xatirə kataloqu templates.js-ə əlavə edir — yükləmə sırası vacibdir. */
vm.runInContext(fs.readFileSync(path.join(ROOT_DIR, 'frontend', 'templates.js'), 'utf8'), sandbox);
vm.runInContext(fs.readFileSync(path.join(ROOT_DIR, 'frontend', 'templates-xatire.js'), 'utf8'), sandbox);
const T = sandbox.window.TEMPLATES, C = sandbox.window.CATEGORIES;

/* doc.js-dən layout/palitra siyahısı */
const stub = { font: '', measureText: t => ({ width: String(t).length * 6 }) };
const s2 = { window: {}, QRZ: null, document: { createElement: () => ({ getContext: () => stub }) },
             Math, Date, JSON, String, Number, Array, Object, isNaN, parseInt, parseFloat, RegExp };
s2.globalThis = s2; vm.createContext(s2);
vm.runInContext(fs.readFileSync(path.join(ROOT_DIR, 'frontend', 'doc.js'), 'utf8'), s2);
const LAYOUTS = s2.window.DOCGEN.LAYOUTS, PALETTES = s2.window.DOCGEN.PALETTES, TONES = s2.window.DOCGEN.TONES;

/* Server bu hədləri sükutla kəsir — config/zarafat.php */
const LIMIT = { title: 120, to: 60, from: 60, preamble: 700, powers: 600, penalty: 300, powerLines: 8, id: 40, label: 40,
                signTitle: 40, signOrg: 60 };
/* Qurum adı masthead-in altındakı sətrdir — 794px enində rahat sığması üçün
   DB sütunundan (60) bir az dar tutulur. */
const ORG_AIM = 56;
/* Uydurma qurum real bir qurumu təqlid etməməlidir (CLAUDE.md hüquqi qalxanı).
   Diqqət: JS-in `i` bayrağı «İ»-ni tutmur, ona görə fraqmentlər hərfi müqayisə
   olunur və içində «İ» olan variantlar ayrıca sadalanır. «Dövlət Şurası»
   qadağan DEYİL — uydurma qurum ailəsinin bir hissəsidir. */
const ORG_BAN = ['Nazirliy', 'Nazirlər Kabineti', 'Azərbaycan Respublikası',
                 'Dövlət Agentliyi', 'Dövlət Komitəsi', 'Prezident', 'Prokurorluq',
                 'Polis', 'FIFA', 'UEFA', 'UNESCO', 'Interpol', 'İnterpol'];
/* Vizual olaraq rahat oxunan diapazon */
const AIM = { title: 92, tag: 24, preamble: [140, 380], powers: 300, penalty: [65, 240] };

let pass = 0, fail = 0, warn = 0;
const check = (n, c, x) => c ? (pass++, console.log('  ✓', n))
                             : (fail++, console.log('  ✗', n, x === undefined ? '' : JSON.stringify(x)));

console.log('\n1. Say və struktur');
check('18 kateqoriya', C.length === 18, C.length);
check('216 şablon', T.length === 216, T.length);
const catByTone = tone => C.filter(c => c.tone === tone).length;
const tplByTone = tone => T.filter(t => t.tone === tone).length;
check('zarafat: 12 kateqoriya · 144 şablon', catByTone('zarafat') === 12 && tplByTone('zarafat') === 144,
  [catByTone('zarafat'), tplByTone('zarafat')]);
check('xatire: 6 kateqoriya · 72 şablon', catByTone('xatire') === 6 && tplByTone('xatire') === 72,
  [catByTone('xatire'), tplByTone('xatire')]);
const ids = T.map(t => t.id);
check('id-lər unikaldır', new Set(ids).size === ids.length,
  ids.filter((v, i) => ids.indexOf(v) !== i));
check('id-lər kebab-case və ≤40', T.every(t => /^[a-z0-9-]{1,40}$/.test(t.id)),
  T.filter(t => !/^[a-z0-9-]{1,40}$/.test(t.id)).map(t => t.id));
check('weekend-pass qorunub (testlər ondan asılıdır)', ids.indexOf('weekend-pass') >= 0);

console.log('\n2. Kateqoriya uyğunluğu və ton');
const catIds = C.map(c => c.id);
check('kateqoriya id-ləri unikaldır', new Set(catIds).size === catIds.length,
  catIds.filter((v, i) => catIds.indexOf(v) !== i));
check('hər kateqoriyanın tonu tanınır', C.every(c => TONES.indexOf(c.tone) >= 0),
  C.filter(c => TONES.indexOf(c.tone) < 0).map(c => c.id));
check('hər şablonun tonu tanınır', T.every(t => TONES.indexOf(t.tone) >= 0),
  T.filter(t => TONES.indexOf(t.tone) < 0).map(t => t.id));
check('hər şablonun kateqoriyası mövcuddur', T.every(t => catIds.indexOf(t.cat) >= 0),
  T.filter(t => catIds.indexOf(t.cat) < 0).map(t => t.id));
check('şablonun tonu kateqoriyasının tonu ilə üst-üstə düşür',
  T.every(t => { const c = C.filter(x => x.id === t.cat)[0]; return c && c.tone === t.tone; }),
  T.filter(t => { const c = C.filter(x => x.id === t.cat)[0]; return !c || c.tone !== t.tone; }).map(t => t.id));
const perCat = {};
catIds.forEach(c => perCat[c] = T.filter(t => t.cat === c).length);
check('hər kateqoriyada 12 şablon', catIds.every(c => perCat[c] === 12), perCat);

console.log('\n3. Layout və palitra');
check('layoutlar doc.js-də mövcuddur', T.every(t => LAYOUTS.indexOf(t.layout) >= 0),
  T.filter(t => LAYOUTS.indexOf(t.layout) < 0).map(t => t.id + ':' + t.layout));
check('palitralar doc.js-də mövcuddur', T.every(t => PALETTES.indexOf(t.palette) >= 0),
  T.filter(t => PALETTES.indexOf(t.palette) < 0).map(t => t.id + ':' + t.palette));
const missL = catIds.filter(c => {
  const used = new Set(T.filter(t => t.cat === c).map(t => t.layout));
  return LAYOUTS.some(l => !used.has(l));
});
check('hər kateqoriya 12 dizaynın hamısını əhatə edir', missL.length === 0, missL);
/* Palitra əhatəsi tona bağlı deyil: `rose` yalnız xatirə kataloqunda işlənir,
   ona görə hər kateqoriyadan ən azı 5 fərqli palitra tələb olunur, qlobal
   səviyyədə isə hər palitranın işləndiyi yoxlanılır. */
const thinP = catIds.filter(c => new Set(T.filter(t => t.cat === c).map(t => t.palette)).size < 5);
check('hər kateqoriya ən azı 5 palitra işlədir', thinP.length === 0, thinP);
const unusedP = PALETTES.filter(pl => !T.some(t => t.palette === pl));
check('hər palitra ən azı bir şablonda işlənir', unusedP.length === 0, unusedP);

console.log('\n4. Məcburi sahələr');
['cat', 'layout', 'palette', 'title', 'tag', 'preamble', 'powers', 'penalty'].forEach(f => {
  const bad = T.filter(t => typeof t[f] !== 'string' || !t[f].trim());
  check('«' + f + '» hər şablonda var', bad.length === 0, bad.map(t => t.id));
});
/* Diplom və vəsiqə kimi sənədlər yalnız bir tərəfi adlandırır — biri kifayətdir */
check('preamble ən azı bir yer tutucu daşıyır',
  T.every(t => t.preamble.indexOf('{to}') >= 0 || t.preamble.indexOf('{from}') >= 0),
  T.filter(t => t.preamble.indexOf('{to}') < 0 && t.preamble.indexOf('{from}') < 0).map(t => t.id));
check('powers 4 sətirdir', T.every(t => t.powers.split('\n').length === 4),
  T.filter(t => t.powers.split('\n').length !== 4).map(t => t.id + ':' + t.powers.split('\n').length));

console.log('\n5. Anket sahələri');
const F_TYPES = ['text', 'select', 'multi', 'list', 'scale', 'number', 'time', 'date', 'datetime'];
const withFields = T.filter(t => t.fields);
const fErr = [];
withFields.forEach(t => {
  const keys = new Set();
  let expiry = 0;
  t.fields.forEach(f => {
    if (F_TYPES.indexOf(f.t) < 0) fErr.push(t.id + ': naməlum tip ' + f.t);
    if (!/^[a-z0-9_]{1,20}$/.test(f.k || '')) fErr.push(t.id + ': yanlış açar ' + f.k);
    if (keys.has(f.k)) fErr.push(t.id + ': təkrar açar ' + f.k);
    keys.add(f.k);
    if (!f.label && !f.auto) fErr.push(t.id + ': etiketsiz sahə ' + f.k);
    if (f.expiry) expiry++;
    if (f.t === 'multi') {
      if (!Array.isArray(f.opts) || f.opts.length < 2) fErr.push(t.id + ': multi variantsız ' + f.k);
      else if (!(f.min >= 1 && f.min <= f.max && f.max <= f.opts.length))
        fErr.push(t.id + ': multi min/max ' + f.k);
      if (f.def && (f.def.length < f.min || f.def.some(d => f.opts.indexOf(d) < 0)))
        fErr.push(t.id + ': multi defolt variantda yoxdur ' + f.k);
    }
    if (f.t === 'select' && (!Array.isArray(f.opts) || !f.opts.length)) fErr.push(t.id + ': select variantsız ' + f.k);
    if (f.t === 'scale' && !(f.min < f.max && f.max <= 10)) fErr.push(t.id + ': scale aralığı ' + f.k);
    if (f.into && ['to', 'from', 'title'].indexOf(f.into) < 0) fErr.push(t.id + ': naməlum into ' + f.into);
  });
  if (expiry > 1) fErr.push(t.id + ': birdən çox expiry sahəsi');
  if (t.cancelReasons && expiry !== 1) fErr.push(t.id + ': cancelReasons var, expiry sahəsi yoxdur');
  /* Server hədləri: notes ≤ 8 × 180, share ≤ 180 */
  (t.notes || []).forEach(n => { if (n.length > 180) fErr.push(t.id + ': qeyd 180-i aşır'); });
  if ((t.notes || []).length > 8) fErr.push(t.id + ': 8-dən çox qeyd');
  if (t.share && t.share.length > 180) fErr.push(t.id + ': paylaşım mətni 180-i aşır');
  /* Hər {{k}} mövcud sahəyə uyğun gəlməlidir */
  const refs = (t.preamble + ' ' + (t.share || '') + ' ' + (t.notes || []).join(' ')).match(/\{\{(\w+)\}\}/g) || [];
  refs.forEach(r => { const k = r.slice(2, -2); if (!keys.has(k)) fErr.push(t.id + ': naməlum yer tutucu ' + r); });
});
check('anketli şablonlar var', withFields.length >= 5, withFields.length);
check('anket sxemi etibarlıdır', fErr.length === 0, fErr);
/* `fields` olmayan şablonda `{{}}` yer tutucusu heç vaxt əvəzlənməzdi */
const strayTpl = T.filter(t => !t.fields && /\{\{/.test(t.preamble + (t.share || '')));
check('anketsiz şablonda yer tutucu yoxdur', strayTpl.length === 0, strayTpl.map(t => t.id));

console.log('\n6. Server mətn büdcəsi (bu hədlər aşılsa server sükutla kəsir)');
const over = [];
T.forEach(t => {
  if (t.title.length > LIMIT.title) over.push(t.id + ' title ' + t.title.length);
  if (t.preamble.length > LIMIT.preamble) over.push(t.id + ' preamble ' + t.preamble.length);
  if (t.powers.length > LIMIT.powers) over.push(t.id + ' powers ' + t.powers.length);
  if (t.penalty.length > LIMIT.penalty) over.push(t.id + ' penalty ' + t.penalty.length);
  if (t.powers.split('\n').length > LIMIT.powerLines) over.push(t.id + ' powerLines');
  ['toLabel', 'fromLabel', 'powersLabel', 'penaltyLabel'].forEach(f => {
    if (t[f] && t[f].length > LIMIT.label) over.push(t.id + ' ' + f + ' ' + t[f].length);
  });
  ['signTitle', 'signOrg'].forEach(f => {
    if (t[f] && t[f].length > LIMIT[f]) over.push(t.id + ' ' + f + ' ' + t[f].length);
  });
});
check('heç bir sahə server limitini aşmır', over.length === 0, over);

console.log('\n6b. Verən qurum (signOrg)');
const noOrg = T.filter(t => !t.signOrg || !t.signOrg.trim()).map(t => t.id);
check('hər şablonun qurum adı var', noOrg.length === 0, noOrg);

const wideOrg = T.filter(t => t.signOrg && t.signOrg.length > ORG_AIM)
                 .map(t => t.id + ' ' + t.signOrg.length);
check('qurum adı masthead sətrinə sığır (≤' + ORG_AIM + ')', wideOrg.length === 0, wideOrg);

const realOrg = [];
T.forEach(t => ORG_BAN.forEach(b => {
  if (t.signOrg && t.signOrg.indexOf(b) >= 0) realOrg.push(t.id + ' → ' + b);
}));
check('heç bir qurum adı real qurumu təqlid etmir', realOrg.length === 0, realOrg);

console.log('\n7. Vizual diapazon (xəbərdarlıq)');
const w = [];
T.forEach(t => {
  if (t.title.length > AIM.title) w.push(t.id + ' title ' + t.title.length);
  if (t.tag.length > AIM.tag) w.push(t.id + ' tag ' + t.tag.length);
  if (t.preamble.length < AIM.preamble[0] || t.preamble.length > AIM.preamble[1])
    w.push(t.id + ' preamble ' + t.preamble.length);
  if (t.powers.length > AIM.powers) w.push(t.id + ' powers ' + t.powers.length);
  if (t.penalty.length < AIM.penalty[0] || t.penalty.length > AIM.penalty[1])
    w.push(t.id + ' penalty ' + t.penalty.length);
});
if (w.length) { warn = w.length; console.log('  ! ' + w.length + ' sahə tövsiyə olunan diapazondan kənardadır:'); w.forEach(x => console.log('      ' + x)); }
else console.log('  ✓ bütün mətnlər tövsiyə olunan diapazondadır');

console.log('\n8. Paylanma');
const cnt = (key, list) => list.map(v => v + ':' + T.filter(t => t[key] === v).length).join('  ');
console.log('  dizayn:  ' + cnt('layout', LAYOUTS));
console.log('  palitra: ' + cnt('palette', PALETTES));
console.log('  ton:     ' + cnt('tone', TONES));

console.log('\n' + pass + ' keçdi, ' + fail + ' uğursuz' + (warn ? ', ' + warn + ' xəbərdarlıq' : ''));
process.exit(fail ? 1 : 0);
