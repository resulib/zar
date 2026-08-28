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

const mkDoc = (layout, palette, paid, tone) => ({
  layout, palette, tone: tone || 'zarafat', title: 'Həftəsonu Çölə Çıxma Etibarnaməsi',
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

console.log('\n1. Layout, palitra və ton siyahıları');
check('12 layout qeydiyyatdadır', D.LAYOUTS.length === 12, D.LAYOUTS);
check('hər layoutun adı var', D.LAYOUTS.every(l => !!D.LAYOUT_NAMES[l]),
  D.LAYOUTS.filter(l => !D.LAYOUT_NAMES[l]));
check('6 palitra qeydiyyatdadır', D.PALETTES.length === 6, D.PALETTES);
check('2 ton qeydiyyatdadır', D.TONES.length === 2, D.TONES);
check('hər tonun adı var', D.TONES.every(t => !!D.TONE_NAMES[t]), D.TONES);

/* Hüquqi qalxanın hər iki tonda dəyişməyən nüvəsi. Su nişanı və alt zolaq
   mətnə görə deyil, `data-wm` / `data-dc` markerlərinə görə yoxlanılır —
   xatirə tonunda su nişanının heç bir mətni yoxdur. */
const SHIELD = 'HÜQUQİ QÜVVƏYƏ MALİK DEYİL';

/* Tona xas nişanlar: [olmalıdır], [olmamalıdır] */
const TONE_MARKS = {
  zarafat: [['PARODİYA', 'ƏYLƏNCƏ MƏQSƏDİ DAŞIYIR', 'ZARAFAT NOTARİAT PALATASI'], []],
  xatire:  [['XATİRƏ MƏQSƏDLİDİR', 'XATİRƏ SƏNƏDLƏRİ PALATASI'],
            ['PARODİYA', 'ƏYLƏNCƏ MƏQSƏDİ DAŞIYIR', 'ZARAFAT NOTARİAT PALATASI', 'ZARAFATOV',
             'ZARAFAT MƏHKƏMƏSİ', 'Zarafat küç', 'Zarafat Apellyasiya', 'BAKI ZARAFAT']]
};

console.log('\n2. Hər ton · hər layout · hər palitra');
for (const tone of D.TONES) {
  const [must, mustNot] = TONE_MARKS[tone];
  let bad = 0;
  for (const L of D.LAYOUTS) {
    for (const pal of D.PALETTES) {
      const svg = D.a4(mkDoc(L, pal, true, tone), { idPrefix: 'chk' });
      const txt = svg.replace(/<[^>]*>/g, '');
      const d = depth(svg);
      const tag = tone + ' ' + L + '/' + pal;
      if (d.end !== 0 || d.min < 0) { check(tag + ' <g> balanslıdır', false, d); bad++; continue; }
      if ((svg.match(/data-wm=/g) || []).length !== 1) { check(tag + ' bir su nişanı var', false); bad++; continue; }
      if ((svg.match(/data-dc=/g) || []).length !== 1) { check(tag + ' bir disclaimer var', false); bad++; continue; }
      if (txt.indexOf(SHIELD) < 0) { check(tag + ' hüquqi qalxan var', false); bad++; continue; }
      if (txt.indexOf('uydurma şəxs') < 0) { check(tag + ' uydurma notarius var', false); bad++; continue; }
      const miss = must.filter(m => txt.indexOf(m) < 0);
      if (miss.length) { check(tag + ' ton nişanları var', false, miss); bad++; continue; }
      const leak = mustNot.filter(m => txt.indexOf(m) >= 0);
      if (leak.length) { check(tag + ' yad ton sızmayıb', false, leak); bad++; continue; }
      const n = countNodes(svg);
      if (n <= 60) { check(tag + ' >60 element', false, n); bad++; continue; }
      pass++;
    }
  }
  if (!bad) console.log('  ✓ ' + tone + ': ' + (D.LAYOUTS.length * D.PALETTES.length) +
    ' kombinasiya — <g> balansı, su nişanı, disclaimer, ton nişanları, notarius, element sayı');
}

console.log('\n3. Ödənilməmiş sənəd (NÜMUNƏ kafeli tondan asılı deyil)');
for (const L of D.LAYOUTS) {
  const svg = D.a4(mkDoc(L, 'gold', false, (L === 'vesiqe' || L === 'viza') ? 'xatire' : 'zarafat'), { idPrefix: 'u' });
  if (svg.indexOf('NÜMUNƏ') < 0) check(L + ' NÜMUNƏ tərtibi var', false);
  else if (depth(svg).end !== 0) check(L + ' <g> balanslıdır', false);
  else pass++;
}
console.log('  ✓ ödənilməmiş rejimdə NÜMUNƏ tərtibi və balans');

console.log('\n4. Story formatı');
const st = D.story(mkDoc('notarial', 'gold'), { idPrefix: 's' });
const sx = D.story(mkDoc('diplom', 'rose', true, 'xatire'), { idPrefix: 'sx' });
check('story render olunur', st.indexOf('<svg') === 0 && depth(st).end === 0);
check('story su nişanı daşıyır', st.indexOf('data-wm=') >= 0);
check('xatirə story render olunur', sx.indexOf('<svg') === 0 && depth(sx).end === 0);
check('xatirə story hüquqi qalxanı daşıyır', sx.replace(/<[^>]*>/g, '').indexOf(SHIELD) >= 0);

console.log('\n5. MRZ (ICAO TD3)');
const vs = D.a4(mkDoc('vesiqe', 'steel'), { idPrefix: 'm' }).replace(/<[^>]*>/g, '');
const vx = D.a4(mkDoc('vesiqe', 'rose', true, 'xatire'), { idPrefix: 'mx' }).replace(/<[^>]*>/g, '');
check('zarafat MRZ-də PARODIYA var', /PARODIYA/.test(vs));
check('xatirə MRZ-də XATIRE var', /XATIRE/.test(vx));
check('xatirə MRZ-də PARODIYA qalmayıb', !/PARODIYA/.test(vx));

/* Viza dekorativ MRZ daşıyır, amma qalxan eynidir: optional data sahəsi tonun nişanıdır */
const zs = D.a4(mkDoc('viza', 'steel'), { idPrefix: 'mv' }).replace(/<[^>]*>/g, '');
const zx = D.a4(mkDoc('viza', 'rose', true, 'xatire'), { idPrefix: 'mvx' }).replace(/<[^>]*>/g, '');
check('viza MRZ-də PARODIYA var', /PARODIYA/.test(zs));
check('viza xatirə MRZ-də XATIRE var', /XATIRE/.test(zx));
check('viza xatirə MRZ-də PARODIYA qalmayıb', !/PARODIYA/.test(zx));

console.log('\n6. Struktur bloklar və vəziyyət ştampları');
const strDoc = Object.assign(mkDoc('ekspertiza', 'forest'), {
  data: [['OYUN', 'FIFA'], ['SÜNİ İNTELLEKT SƏVİYYƏSİ', 'Əfsanəvi']],
  checks: ['Eyni hərəkəti dövri olaraq təkrarlayır', 'Küncdə dayanıb gözləyir'],
  scale: { label: 'ZƏİFLİK DƏRƏCƏSİ', v: 7, max: 10 }
});
const str = D.a4(strDoc, { idPrefix: 'st' });
check('şkala rəqəmi çıxır', str.replace(/<[^>]*>/g, '').indexOf('7/10') >= 0);
const CELL = /height="14" fill="[^"]*" stroke="[^"]*" stroke-width="0\.8"\/>/g;
check('şkala 10 xana çəkir', (str.match(CELL) || []).length === 10, (str.match(CELL) || []).length);
check('çoxseçim bəndləri çıxır', str.replace(/<[^>]*>/g, '').indexOf('Küncdə dayanıb') >= 0);
check('struktur blokla balans pozulmur', depth(str).end === 0);

for (const [st8, mark] of [['expired', 'MÜDDƏTİ BİTİB'], ['cancelled', 'LƏĞV EDİLDİ']]) {
  for (const L of ['viza', 'ekspertiza']) {
    const sv = D.a4(Object.assign(mkDoc(L, 'steel'), { state: st8, cancelReason: 'Cavabsız zəng' }), { idPrefix: 'ss' });
    check(L + ' «' + mark + '» ştampı və balans',
      sv.replace(/<[^>]*>/g, '').indexOf(mark) >= 0 && depth(sv).end === 0);
  }
}

console.log('\n7. Naməlum layout notarial-a düşür');
const unk = D.a4(mkDoc('yoxdur', 'gold'), { idPrefix: 'z' });
check('naməlum layout render olunur', unk.length > 5000 && depth(unk).end === 0);

console.log('\n' + pass + ' keçdi, ' + fail + ' uğursuz');
process.exit(fail ? 1 : 0);
