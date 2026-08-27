/* Code 39 cədvəlinin bütövlüyü + kodlayıcının geri oxunması.
   Cədvəl kod deyil, məlumatdır — bir səhv «n/w» gözəl render olunan,
   amma zibil kimi oxunan barkod verir. Bu testin yeganə işi budur. */
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT_DIR = path.join(__dirname, '..');

/* doc.js brauzer faylıdır: canvas və QRZ-i stub-layırıq */
const stubCtx = { font: '', measureText: t => ({ width: String(t).length * 6 }) };
const sandbox = {
  window: {}, QRZ: null,
  document: { createElement: () => ({ getContext: () => stubCtx }) },
  Math, Date, JSON, String, Number, Array, Object, isNaN, parseInt, parseFloat
};
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(ROOT_DIR, 'frontend', 'doc.js'), 'utf8'), sandbox);
const D = sandbox.window.DOCGEN;

let pass = 0, fail = 0;
const check = (n, c, x) => c ? (pass++, console.log('  ✓', n))
                             : (fail++, console.log('  ✗', n, x === undefined ? '' : JSON.stringify(x)));

console.log('\n1. Cədvəlin statik invariantları');
const T = D.C39, keys = Object.keys(T);
check('44 giriş', keys.length === 44, keys.length);
check('hamısı 9 element', keys.every(k => T[k].length === 9), keys.filter(k => T[k].length !== 9));
check('hər birində dəqiq 3 enli', keys.every(k => (T[k].match(/w/g) || []).length === 3),
  keys.filter(k => (T[k].match(/w/g) || []).length !== 3));
check('yalnız n/w simvolları', keys.every(k => /^[nw]{9}$/.test(T[k])), keys.filter(k => !/^[nw]{9}$/.test(T[k])));
const seen = {}, dup = [];
keys.forEach(k => { if (seen[T[k]]) dup.push(seen[T[k]] + '=' + k); seen[T[k]] = k; });
check('təkrarlanan naxış yoxdur', dup.length === 0, dup);
/* Code 39-da adi simvollarda 2 enli bar + 1 enli boşluq olur;
   xüsusi simvollarda ($ / + %) 0 enli bar + 3 enli boşluq. */
const bad = keys.filter(k => {
  const bars = [0, 2, 4, 6, 8].filter(i => T[k][i] === 'w').length;
  const sp = [1, 3, 5, 7].filter(i => T[k][i] === 'w').length;
  return !((bars === 2 && sp === 1) || (bars === 0 && sp === 3));
});
check('bar/boşluq paylanması düzgün', bad.length === 0, bad);

console.log('\n2. Kodlayıcının geri oxunması (round-trip)');
/* Modul enləri massivini geri mətnə çevirir */
function decode(els, ratio) {
  const wide = ratio || 2, inv = {};
  keys.forEach(k => inv[T[k]] = k);
  let out = '', i = 0;
  while (i + 9 <= els.length) {
    let pat = '';
    for (let j = 0; j < 9; j++) pat += els[i + j] === wide ? 'w' : 'n';
    if (!inv[pat]) return null;
    out += inv[pat];
    i += 9;
    if (i < els.length) { if (els[i] !== 1) return null; i += 1; }
  }
  if (i !== els.length) return null;
  if (out[0] !== '*' || out[out.length - 1] !== '*') return null;
  return out.slice(1, -1);
}
['ZRF-2026-9482', 'ZRF-2026-0001', '2026-9482', 'ZNP-514', 'ABC XYZ 0123456789', '-. $/+%'].forEach(t => {
  const got = decode(D.code39(t));
  check('«' + t + '» geri oxunur', got === t.toUpperCase(), got);
});
check('3:1 nisbətində də oxunur', decode(D.code39('ZRF-2026-9482', 3), 3) === 'ZRF-2026-9482');

console.log('\n3. Modul sayı və eni');
const mods = D.code39('ZRF-2026-9482').reduce((a, b) => a + b, 0);
check('ZRF-2026-9482 = 194 modul', mods === 194, mods);
[['notarial', 210], ['sertifikat', 200], ['blank', 190], ['lisenziya', 180], ['diplom', 190]].forEach(([n, w]) => {
  const m = w / mods;
  check(n + ' dar modulu ≥ 0.90px (' + m.toFixed(3) + ')', m >= 0.90, m);
});

/* 4. Ən güclü mərhələ: render olunmuş PNG-dən piksel səviyyəsində oxumaq.
      `npm run render` işlədilibsə avtomatik qaçır. */
const shot = path.join(ROOT_DIR, 'tools', 'render', 'full-notarial.png');
if (!fs.existsSync(shot)) {
  console.log('\n4. Rasterdən oxuma — atlandı (əvvəlcə `npm run render`)');
  finish();
} else {
  console.log('\n4. Render olunmuş PNG-dən oxuma');
  const inv = {};
  keys.forEach(k => inv[T[k]] = k);
  const S = 1.6;                              // render-all.js deviceScaleFactor
  const bx = Math.round(176 * S) - 6;         // notarial barkodu: x=176, y=1022, w=210, h=26
  const by = Math.round((1022 + 13) * S);
  const bw = Math.round(210 * S) + 12;
  require('sharp')(shot)
    .extract({ left: bx, top: by, width: bw, height: 1 })
    .greyscale().raw().toBuffer({ resolveWithObject: true })
    .then(({ data, info }) => {
      const runs = [];
      let cur = data[0] < 128 ? 1 : 0, n = 0;
      for (let i = 0; i < info.width; i++) {
        const b = data[i] < 128 ? 1 : 0;
        if (b === cur) n++; else { runs.push([cur, n]); cur = b; n = 1; }
      }
      runs.push([cur, n]);
      while (runs.length && runs[0][0] === 0) runs.shift();
      while (runs.length && runs[runs.length - 1][0] === 0) runs.pop();
      const lens = runs.map(r => r[1]);
      const thr = (Math.min.apply(null, lens) + Math.max.apply(null, lens)) / 2;
      const pat = lens.map(l => l > thr ? 'w' : 'n');
      let out = '', i = 0, ok = true;
      while (i + 9 <= pat.length) {
        const p = pat.slice(i, i + 9).join('');
        if (!inv[p]) { ok = false; break; }
        out += inv[p]; i += 9;
        if (i < pat.length) i += 1;
      }
      check('PNG-dən oxunan barkod düzgün dekod olunur', ok, out);
      check('start/stop işarələri var', /^\*.*\*$/.test(out), out);
      check('reyestr nömrəsi dəqiq oxunur', /^\*ZRF-\d{4}-\d{4}\*$/.test(out), out);
      finish();
    })
    .catch(e => { check('raster oxuma', false, String(e.message)); finish(); });
}

function finish() {
  console.log('\n' + pass + ' keçdi, ' + fail + ' uğursuz');
  process.exit(fail ? 1 : 0);
}
