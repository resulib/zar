/* Bayt-eyniliyi qapısı.
   Mövcud 10 dizaynın `zarafat` və `xatire` çıxışı refaktorinq zamanı bayt-bayt
   dəyişməməlidir (CLAUDE.md). Bu skript hər kombinasiyanı tək sha256-ya yığır.

   İşlətmək:  node tools/hash-layouts.js
   Dəyişiklikdən əvvəl və sonra çağırıb heşləri müqayisə edin. */
const fs = require('fs'), path = require('path'), vm = require('vm'), crypto = require('crypto');
const ROOT_DIR = path.join(__dirname, '..');

/* check-doc.js ilə eyni sandbox — canvas ölçüsü determinist stub-dur */
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

/* Refaktorinqdən əvvəlki dizaynlar — yeni layoutlar bu siyahıya ƏLAVƏ EDİLMİR,
   əks halda qapı öz mənasını itirir. */
const BASE_LAYOUTS = ['notarial', 'blank', 'diplom', 'sertifikat', 'lisenziya',
                      'arayis', 'qerar', 'muqavile', 'teleqram', 'vesiqe'];

const mkDoc = (layout, palette, tone, paid) => ({
  layout, palette, tone,
  title: 'Həftəsonu Çölə Çıxma Etibarnaməsi',
  to: 'Günel Şəkərova', from: 'Elvin Məmmədov',
  preamble: 'Bu etibarnamə ilə təsdiq olunur ki, Elvin Məmmədov tərəfindən Günel Şəkərova adlı '
    + 'şəxsə həftəsonu evdən kənara çıxmaq və müəyyən edilmiş saatda geri qayıtmaq səlahiyyəti verilmişdir.',
  powers: 'Həftədə bir dəfə evdən çıxmaq.\nHər 45 dəqiqədən bir mesaj göndərmək.\n'
    + 'Qayıdarkən əli boş qayıtmamaq.\nSəsli mesaja üç dəqiqə ərzində cavab vermək.',
  penalty: 'Şərtlərin pozulması halında sənəd sahibi növbəti iki həftəsonu qab-qacaq yumaq öhdəliyi daşıyır.',
  regNo: 'ZRF-2026-9482', date: '26.08.2026',
  paid, verifyUrl: 'https://zarafat.az/r/ZRF-2026-9482'
});

const h = crypto.createHash('sha256');
let n = 0;
for (const tone of D.TONES) {
  for (const layout of BASE_LAYOUTS) {
    for (const palette of D.PALETTES) {
      for (const paid of [true, false]) {
        const doc = mkDoc(layout, palette, tone, paid);
        h.update(D.a4(doc, { idPrefix: 'chk' }));
        h.update(D.a4(doc, { idPrefix: 'chk', verified: true }));
        h.update(D.story(doc, { idPrefix: 'stry' }));
        n += 3;
      }
    }
  }
}

console.log(n + ' render · ' + h.digest('hex'));
