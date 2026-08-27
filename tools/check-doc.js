/* Sənəd generatorunun bütövlüyü: hər layout üçün parodiya nişanları,
   balanslı <g> yuvalanması, element sayı və MRZ formatı. */
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT_DIR = path.join(__dirname, '..');

const stubCtx = { font: '', measureText: t => ({ width: String(t).length * 6.1 }) };
const sandbox = {
  window: {}, QRZ: null,
  document: { createElement: () => ({ getContext: () => stubCtx }) },
  Math, Date, JSON, String, Number, Array, Object, isNaN, parseInt, parseFloat, RegExp
};
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(ROOT_DIR, 'frontend', 'doc.js'), 'utf8'), sandbox);
const D = sandbox.window.DOCGEN;

let pass = 0, fail = 0;
const check = (n, c, x) => c ? (pass++, console.log('  ✓', n))
                             : (fail++, console.log('  ✗', n, x === undefined ? '' : JSON.stringify(x)));

const mkDoc = (layout, palette, paid) => ({
  layout, palette, title: 'Həftəsonu Çölə Çıxma Etibarnaməsi',
  to: 'Günel Şəkərova', from: 'Elvin Məmmədov',
  preamble: 'Bu etibarnamə ilə təsdiq olunur ki, Elvin Məmmədov tərəfindən Günel Şəkərova adlı şəxsə həftəsonu evdən kənara çıxmaq səlahiyyəti verilmişdir.',
  powers: 'Birinci bənd mətni.\nİkinci bənd mətni.\nÜçüncü bənd mətni.\nDördüncü bənd mətni.',
  penalty: 'Şərtlərin pozulması halında sənəd sahibi qab-qacaq yumaq öhdəliyi daşıyır.',
  regNo: 'ZRF-2026-9482', date: '26.08.2026', paid: paid !== false,
  verifyUrl: 'https://zarafat.az/r/ZRF-2026-9482'
});

/* <g> yuvalanmasının balansını yoxlayır */
function depth(svg) {
  const toks = svg.match(/<g[\s>]|<\/g>/g) || [];
  let d = 0, min = 0;
  for (const t of toks) { d += t === '</g>' ? -1 : 1; if (d < min) min = d; }
  return { end: d, min };
}
const countNodes = svg => (svg.match(/<(text|rect|path|circle|ellipse)[\s>]/g) || []).length;

console.log('\n1. Layoutların sayı');
check('10 layout qeydiyyatdadır', D.LAYOUTS.length === 10, D.LAYOUTS);
check('hər layoutun adı var', D.LAYOUTS.every(l => !!D.LAYOUT_NAMES[l]),
  D.LAYOUTS.filter(l => !D.LAYOUT_NAMES[l]));

console.log('\n2. Hər layout · hər palitra');
for (const L of D.LAYOUTS) {
  for (const pal of D.PALETTES) {
    const svg = D.a4(mkDoc(L, pal), { idPrefix: 'chk' });
    const d = depth(svg);
    const tag = L + '/' + pal;
    if (d.end !== 0 || d.min < 0) { check(tag + ' <g> balanslıdır', false, d); continue; }
    if (svg.indexOf('HÜQUQİ QÜVVƏSİ YOXDUR') < 0) { check(tag + ' su nişanı var', false); continue; }
    if (svg.indexOf('ƏYLƏNCƏ MƏQSƏDİ DAŞIYIR') < 0) { check(tag + ' disclaimer var', false); continue; }
    if (svg.indexOf('PARODİYA') < 0) { check(tag + ' PARODİYA nişanı var', false); continue; }
    if (svg.indexOf('uydurma şəxs') < 0) { check(tag + ' uydurma notarius var', false); continue; }
    const n = countNodes(svg);
    if (n <= 60) { check(tag + ' >60 element', false, n); continue; }
    pass++;
  }
}
console.log('  ✓ 10 layout × 5 palitra: <g> balansı, su nişanı, disclaimer, PARODİYA, notarius, element sayı');

console.log('\n3. Ödənilməmiş sənəd');
for (const L of D.LAYOUTS) {
  const svg = D.a4(mkDoc(L, 'gold', false), { idPrefix: 'u' });
  if (svg.indexOf('NÜMUNƏ') < 0) check(L + ' NÜMUNƏ tərtibi var', false);
  else if (depth(svg).end !== 0) check(L + ' <g> balanslıdır', false);
  else pass++;
}
console.log('  ✓ ödənilməmiş rejimdə NÜMUNƏ tərtibi və balans');

console.log('\n4. Story formatı');
const st = D.story(mkDoc('notarial', 'gold'), { idPrefix: 's' });
check('story render olunur', st.indexOf('<svg') === 0 && depth(st).end === 0);
check('story su nişanı daşıyır', st.indexOf('HÜQUQİ QÜVVƏSİ YOXDUR') >= 0);

console.log('\n5. MRZ (ICAO TD3)');
const vs = D.a4(mkDoc('vesiqe', 'steel'), { idPrefix: 'm' });
check('MRZ-də PARODIYA var', vs.indexOf('P') >= 0 && /PARODIYA/.test(vs.replace(/<[^>]*>/g, '')));

console.log('\n6. Naməlum layout notarial-a düşür');
const unk = D.a4(mkDoc('yoxdur', 'gold'), { idPrefix: 'z' });
check('naməlum layout render olunur', unk.length > 5000 && depth(unk).end === 0);

console.log('\n' + pass + ' keçdi, ' + fail + ' uğursuz');
process.exit(fail ? 1 : 0);
