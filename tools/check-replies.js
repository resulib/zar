/* Cavab kataloqunun bütövlüyü — frontend/replies.js
   İşlətmək: node tools/check-replies.js   (npm run test:replies)

   `check-templates.js`-in ekiz qardaşıdır, amma AYRI skriptdir: cavab
   şablonları `window.CATEGORIES` / `window.TEMPLATES` massivlərində deyil,
   ayrıca qlobal dəyişənlərdədir — ona görə oradakı «12 şablon · 12 dizayn»
   invariantları burada tətbiq olunmur (bax: replies.js başlığı).

   Əvəzində burada öz qaydaları var: hər niyyət hər kateqoriyanı əhatə edir,
   hər niyyətin universal ehtiyatı var, `replyCats` real kateqoriyalara işarə
   edir və qurum adları hüquqi qalxandan keçir. */
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
const FE = f => fs.readFileSync(path.join(ROOT, 'frontend', f), 'utf8');

/* Cavab kataloqu */
const sb = { window: {} };
vm.createContext(sb);
vm.runInContext(FE('replies.js'), sb);
const KINDS = sb.window.REPLY_KINDS, RC = sb.window.REPLY_CATEGORIES, R = sb.window.REPLIES;

/* Ana kataloq — `replyCats` onun kateqoriya id-lərinə işarə edir */
const mb = { window: {} };
vm.createContext(mb);
vm.runInContext(FE('templates.js'), mb);
vm.runInContext(FE('templates-xatire.js'), mb);
const MAIN_CATS = mb.window.CATEGORIES.map(c => c.id);

/* Dizayn və palitra siyahıları doc.js-dən — sabit siyahı saxlamırıq */
const stubCtx = { font: '', measureText: t => ({ width: String(t).length * 6.1 }) };
const db = {
  window: {}, QRZ: null,
  document: { createElement: () => ({ getContext: () => stubCtx }) },
  Math, Date, JSON, String, Number, Array, Object, isNaN, parseInt, parseFloat, RegExp
};
db.globalThis = db;
vm.createContext(db);
vm.runInContext(FE('doc.js'), db);
const LAYOUTS = db.window.DOCGEN.LAYOUTS, PALETTES = db.window.DOCGEN.PALETTES, TONES = db.window.DOCGEN.TONES;

/* Server hədləri — config/zarafat.php `limits` və migrasiya sütunları */
const LIMIT = { title: 120, preamble: 700, powers: 600, penalty: 300, powerLines: 8,
                id: 40, label: 40, tag: 40, signTitle: 40, signOrg: 60, prefix: 4 };
/* Masthead sütunu 60 px-dir, hədəf 56 — `check-templates.js` ilə eyni rəqəm */
const ORG_AIM = 56;
/* Hüquqi qalxan: uydurma qurum real qurumu təqlid etməməlidir.
   JS-in `i` bayrağı «İ» hərfini qatlamır, ona görə fraqmentlər hərfi yazılır. */
const ORG_BAN = ['Nazirliy', 'Nazirlər Kabineti', 'Azərbaycan Respublikası', 'Dövlət Agentliyi',
                 'Dövlət Komitəsi', 'Prezident', 'Prokurorluq', 'Polis', 'FIFA', 'UEFA',
                 'UNESCO', 'Interpol', 'İnterpol'];
/* Vizual aralıq — pozulsa yalnız xəbərdarlıq */
const AIM = { title: 92, tag: 24, preamble: [140, 380], powers: 300, penalty: [65, 240] };

let pass = 0, fail = 0, warn = 0;
const check = (n, ok, x) => ok
  ? (pass++, console.log('  ✓', n))
  : (fail++, console.log('  ✗', n, x === undefined ? '' : JSON.stringify(x)));
const note = (n, x) => { warn++; console.log('  !', n, x === undefined ? '' : JSON.stringify(x)); };

/* ---------------- 1. Saylar və struktur ---------------- */
console.log('\n1. Saylar');
check('71 cavab şablonu', R.length === 71, R.length);
check('6 cavab kateqoriyası', RC.length === 6, RC.length);
check('6 niyyət', KINDS.length === 6, KINDS.length);

const kindKeys = KINDS.map(k => k.k);
check('niyyət açarları unikaldır', new Set(kindKeys).size === kindKeys.length, kindKeys);
check('hər niyyətin tonu tanınır', KINDS.every(k => TONES.indexOf(k.tone) >= 0),
  KINDS.filter(k => TONES.indexOf(k.tone) < 0).map(k => k.k));
check('hər niyyətin ikonu, adı və izahı var',
  KINDS.every(k => k.icon && k.name && k.blurb),
  KINDS.filter(k => !(k.icon && k.name && k.blurb)).map(k => k.k));

const ids = R.map(t => t.id);
check('şablon id-ləri unikaldır', new Set(ids).size === ids.length,
  ids.filter((v, i) => ids.indexOf(v) !== i));
check('id-lər formata uyğundur', R.every(t => /^[a-z0-9-]{1,40}$/.test(t.id)),
  R.filter(t => !/^[a-z0-9-]{1,40}$/.test(t.id)).map(t => t.id));
check('cavab id-ləri ana kataloqla toqquşmur',
  !ids.some(i => mb.window.TEMPLATES.some(t => t.id === i)),
  ids.filter(i => mb.window.TEMPLATES.some(t => t.id === i)));

const rcIds = RC.map(c => c.id);
check('kateqoriya id-ləri unikaldır', new Set(rcIds).size === rcIds.length, rcIds);
check('cavab kateqoriyaları ana kataloqla toqquşmur',
  !rcIds.some(i => MAIN_CATS.indexOf(i) >= 0),
  rcIds.filter(i => MAIN_CATS.indexOf(i) >= 0));
check('hər kateqoriya isReply daşıyır', RC.every(c => c.isReply === true),
  RC.filter(c => c.isReply !== true).map(c => c.id));

/* ---------------- 2. Niyyət və kateqoriya uyğunluğu ---------------- */
console.log('\n2. Niyyət uyğunluğu');
check('hər şablonun replyKind-i tanınır', R.every(t => kindKeys.indexOf(t.replyKind) >= 0),
  R.filter(t => kindKeys.indexOf(t.replyKind) < 0).map(t => t.id));
check('hər şablonun kateqoriyası mövcuddur', R.every(t => rcIds.indexOf(t.cat) >= 0),
  R.filter(t => rcIds.indexOf(t.cat) < 0).map(t => t.id));

const catTone = {};
RC.forEach(c => { catTone[c.id] = c.tone; });
check('şablonun tonu kateqoriyasının tonu ilə üst-üstə düşür',
  R.every(t => catTone[t.cat] === t.tone),
  R.filter(t => catTone[t.cat] !== t.tone).map(t => t.id));

const kindTone = {};
KINDS.forEach(k => { kindTone[k.k] = k.tone; });
check('şablonun tonu niyyətin tonu ilə üst-üstə düşür',
  R.every(t => kindTone[t.replyKind] === t.tone),
  R.filter(t => kindTone[t.replyKind] !== t.tone).map(t => t.id));

/* Zarafat niyyətləri: 12 mövzu + 1 universal.
   Bu, «Sistem bütün cavabları universal etməsin» tələbinin avtomatlaşdırılmasıdır. */
const zKinds = KINDS.filter(k => k.tone === 'zarafat').map(k => k.k);
const zCats = mb.window.CATEGORIES.filter(c => c.tone === 'zarafat').map(c => c.id);
const missing = [];
zKinds.forEach(k => {
  const set = R.filter(t => t.replyKind === k);
  zCats.forEach(c => {
    if (!set.some(t => Array.isArray(t.replyCats) && t.replyCats.indexOf(c) >= 0))
      missing.push(k + '←' + c);
  });
});
check('hər zarafat niyyəti 12 kateqoriyanın hamısını əhatə edir', missing.length === 0, missing);

const noFallback = zKinds.filter(k => !R.some(t => t.replyKind === k && !t.replyCats));
check('hər zarafat niyyətinin universal ehtiyatı var', noFallback.length === 0, noFallback);

const badCats = [];
R.forEach(t => {
  if (!t.replyCats) return;
  if (!Array.isArray(t.replyCats) || !t.replyCats.length) return badCats.push(t.id + ': boş massiv');
  t.replyCats.forEach(c => {
    if (MAIN_CATS.indexOf(c) < 0) badCats.push(t.id + ': naməlum kateqoriya ' + c);
  });
});
check('replyCats real kateqoriyalara işarə edir', badCats.length === 0, badCats);

/* Universal şablon `replyCats` DAŞIMAMALIDIR — boş massiv serverdə də
   universal deməkdir, amma iki fərqli yazılış qarışıqlıq yaradır. */
check('universal şablonlarda replyCats açarı yoxdur',
  R.every(t => t.replyCats === undefined || Array.isArray(t.replyCats)),
  R.filter(t => t.replyCats !== undefined && !Array.isArray(t.replyCats)).map(t => t.id));

/* ---------------- 3. Dizayn, palitra, prefiks ---------------- */
console.log('\n3. Dizayn və prefiks');
check('hər dizayn doc.js-də mövcuddur', R.every(t => LAYOUTS.indexOf(t.layout) >= 0),
  R.filter(t => LAYOUTS.indexOf(t.layout) < 0).map(t => t.id + ':' + t.layout));
check('hər palitra doc.js-də mövcuddur', R.every(t => PALETTES.indexOf(t.palette) >= 0),
  R.filter(t => PALETTES.indexOf(t.palette) < 0).map(t => t.id + ':' + t.palette));

/* Prefiks QR kodun URL-inə düşür: yalnız ASCII böyük hərflər.
   RegistryNumber::PATTERN = [A-Z]{2,4}, /r/{regNo} marşrutu da eynidir. */
check('hər şablonun qeydiyyat prefiksi var', R.every(t => !!t.regPrefix),
  R.filter(t => !t.regPrefix).map(t => t.id));
check('prefikslər yalnız ASCII böyük hərflərdir', R.every(t => /^[A-Z]{2,4}$/.test(t.regPrefix || '')),
  R.filter(t => !/^[A-Z]{2,4}$/.test(t.regPrefix || '')).map(t => t.id + ':' + t.regPrefix));

/* Bir niyyət = bir prefiks. Beləcə hər niyyət ildə öz 9000 nömrəsini alır
   (RegistryNumber cəmi 4 rəqəm verir) və zəncirdə nömrədən niyyət oxunur. */
const pfxByKind = {};
const mixed = [];
R.forEach(t => {
  if (pfxByKind[t.replyKind] && pfxByKind[t.replyKind] !== t.regPrefix)
    mixed.push(t.id + ': ' + t.regPrefix + ' ≠ ' + pfxByKind[t.replyKind]);
  pfxByKind[t.replyKind] = pfxByKind[t.replyKind] || t.regPrefix;
});
check('hər niyyət bir prefiks işlədir', mixed.length === 0, mixed);
const pfxVals = Object.keys(pfxByKind).map(k => pfxByKind[k]);
check('prefikslər niyyətlər arasında unikaldır', new Set(pfxVals).size === pfxVals.length, pfxByKind);

/* ---------------- 4. Məcburi sahələr ---------------- */
console.log('\n4. Məcburi sahələr');
['cat', 'tone', 'layout', 'palette', 'title', 'tag', 'preamble', 'powers', 'penalty', 'replyKind']
  .forEach(f => {
    const bad = R.filter(t => typeof t[f] !== 'string' || !t[f].trim());
    check('«' + f + '» hər şablonda var', bad.length === 0, bad.map(t => t.id));
  });

check('preamble {to} və ya {from} daşıyır',
  R.every(t => t.preamble.indexOf('{to}') >= 0 || t.preamble.indexOf('{from}') >= 0),
  R.filter(t => t.preamble.indexOf('{to}') < 0 && t.preamble.indexOf('{from}') < 0).map(t => t.id));

/* Dizaynlar 4–7 bənd çəkir, beşi isə yalnız 4 — ana kataloqla eyni qayda. */
check('powers düz 4 sətirdir', R.every(t => t.powers.split('\n').length === 4),
  R.filter(t => t.powers.split('\n').length !== 4).map(t => t.id + ':' + t.powers.split('\n').length));

/* Cavab şablonları anket daşımır: variant kilidi ilə anket qatı bir-birini
   istisna edir (`CatalogController::templateSave`). */
check('cavab şablonlarında anket sxemi yoxdur', R.every(t => !t.fields),
  R.filter(t => t.fields).map(t => t.id));
check('anketsiz şablonda {{ }} yer tutucusu yoxdur',
  R.every(t => (t.preamble + (t.share || '')).indexOf('{{') < 0),
  R.filter(t => (t.preamble + (t.share || '')).indexOf('{{') >= 0).map(t => t.id));

/* ---------------- 5. Server hədləri ---------------- */
console.log('\n5. Server hədləri');
const over = [];
R.forEach(t => {
  [['title', LIMIT.title], ['preamble', LIMIT.preamble], ['powers', LIMIT.powers],
   ['penalty', LIMIT.penalty], ['tag', LIMIT.tag], ['id', LIMIT.id]].forEach(([k, max]) => {
    if (t[k] && t[k].length > max) over.push(t.id + ': ' + k + ' ' + t[k].length + '>' + max);
  });
  if (t.powers.split('\n').length > LIMIT.powerLines) over.push(t.id + ': powers sətir sayı');
  ['toLabel', 'fromLabel', 'powersLabel', 'penaltyLabel'].forEach(k => {
    if (t[k] && t[k].length > LIMIT.label) over.push(t.id + ': ' + k + ' ' + t[k].length);
  });
  if (t.signTitle && t.signTitle.length > LIMIT.signTitle) over.push(t.id + ': signTitle');
  if (t.signOrg && t.signOrg.length > LIMIT.signOrg) over.push(t.id + ': signOrg sütunu');
});
check('heç bir sahə server limitini aşmır', over.length === 0, over);

/* ---------------- 6. Qurum adı — hüquqi qalxan ---------------- */
console.log('\n6. Verən qurum');
const noOrg = R.filter(t => !t.signOrg || !t.signOrg.trim());
check('hər şablonun qurum adı var', noOrg.length === 0, noOrg.map(t => t.id));

const wideOrg = R.filter(t => (t.signOrg || '').length > ORG_AIM);
check('qurum adı masthead sətrinə sığır (≤' + ORG_AIM + ')', wideOrg.length === 0,
  wideOrg.map(t => t.id + ':' + t.signOrg.length));

const realOrg = [];
R.forEach(t => ORG_BAN.forEach(b => {
  if ((t.signOrg || '').indexOf(b) >= 0) realOrg.push(t.id + ': ' + b);
}));
check('heç bir qurum adı real qurumu təqlid etmir', realOrg.length === 0, realOrg);

/* ---------------- 7. Vizual aralıq (yalnız xəbərdarlıq) ---------------- */
console.log('\n7. Vizual aralıq');
R.forEach(t => {
  if (t.title.length > AIM.title) note(t.id + ': başlıq uzundur', t.title.length);
  if (t.tag.length > AIM.tag) note(t.id + ': etiket uzundur', t.tag.length);
  if (t.preamble.length < AIM.preamble[0] || t.preamble.length > AIM.preamble[1])
    note(t.id + ': preamble aralıqdan kənardır', t.preamble.length);
  if (t.powers.length > AIM.powers) note(t.id + ': bəndlər uzundur', t.powers.length);
  if (t.penalty.length < AIM.penalty[0] || t.penalty.length > AIM.penalty[1])
    note(t.id + ': cəza bəndi aralıqdan kənardır', t.penalty.length);
});
if (!warn) console.log('  ✓ bütün mətnlər hədəf aralığındadır');

/* ---------------- 8. Render yoxlaması ---------------- */
console.log('\n8. Render');
const D = db.window.DOCGEN;
const broken = [];
R.forEach(t => {
  const doc = {
    layout: t.layout, palette: t.palette, tone: t.tone,
    title: t.title, to: 'Nurlan Əliyev', from: 'Rəşad Quliyev',
    toLabel: t.toLabel, fromLabel: t.fromLabel,
    powersLabel: t.powersLabel, penaltyLabel: t.penaltyLabel,
    signOrg: t.signOrg, signTitle: t.signTitle,
    preamble: t.preamble.replace(/\{to\}/g, 'Nurlan Əliyev').replace(/\{from\}/g, 'Rəşad Quliyev'),
    powers: t.powers, penalty: t.penalty,
    regNo: t.regPrefix + '-2026-9482', date: '29.08.2026',
    paid: true, state: 'active', replyTo: 'ZRF-2026-8472',
    verifyUrl: 'https://zarafat.az/r/' + t.regPrefix + '-2026-9482'
  };
  const svg = D.a4(doc, { idPrefix: 'chk', verified: true });
  let d = 0, min = 0;
  svg.replace(/<(\/?)g\b/g, (_, c) => { d += c ? -1 : 1; min = Math.min(min, d); return ''; });
  if (d !== 0 || min < 0) broken.push(t.id + ': <g> balansı');
  if ((svg.match(/data-wm=/g) || []).length !== 1) broken.push(t.id + ': su nişanı');
  if ((svg.match(/data-dc=/g) || []).length !== 1) broken.push(t.id + ': disclaimer');
  if ((svg.match(/data-rp=/g) || []).length !== 1) broken.push(t.id + ': cavab lenti');
  if (svg.indexOf('ZRF-2026-8472') < 0) broken.push(t.id + ': orijinalın nömrəsi yoxdur');
  if ((svg.match(/<(text|rect|path|circle|ellipse)\b/g) || []).length < 60) broken.push(t.id + ': az element');
});
check('hər cavab şablonu düzgün render olunur', broken.length === 0, broken);

/* ---------------- 9. Bölgü ---------------- */
console.log('\n9. Bölgü');
const cnt = (key, list) => list.map(v => v + ':' + R.filter(t => t[key] === v).length).join('  ');
console.log('  niyyət  ', cnt('replyKind', kindKeys));
console.log('  dizayn  ', cnt('layout', LAYOUTS.filter(l => R.some(t => t.layout === l))));
console.log('  palitra ', cnt('palette', PALETTES.filter(p => R.some(t => t.palette === p))));
console.log('  ton     ', cnt('tone', TONES));

console.log('\n' + pass + ' keçdi · ' + fail + ' xəta · ' + warn + ' xəbərdarlıq');
process.exit(fail > 0 ? 1 : 0);
