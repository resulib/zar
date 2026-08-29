/* Mətn keyfiyyəti auditi: üslub (§9) və variant siyahıları (§10).
   Qaydalar `tools/copy-rules.js`-dədir; bu skript onları bütün kataloqa
   (216 əsas + 71 cavab şablonu) tətbiq edir.

   İşlətmək:
     node tools/check-copy.js                 — bütün kataloq
     node tools/check-copy.js couples work    — yalnız göstərilən kateqoriyalar
     node tools/check-copy.js zarafat         — yalnız bir ton
     node tools/check-copy.js replies         — yalnız cavab şablonları  */
const fs = require('fs'), path = require('path'), vm = require('vm');
const R = require('./copy-rules.js');
const ROOT_DIR = path.join(__dirname, '..');
const FRONT = path.join(ROOT_DIR, 'frontend');

const sb = { window: {}, QRZ: null, Math, Date, JSON, String, Number, Array, Object,
             isNaN, parseInt, parseFloat, RegExp };
sb.globalThis = sb; vm.createContext(sb);
for (const f of ['templates.js', 'templates-xatire.js', 'replies.js'])
  vm.runInContext(fs.readFileSync(path.join(FRONT, f), 'utf8'), sb);

const MAIN = sb.window.TEMPLATES, REPLY = sb.window.REPLIES;
const ALL = MAIN.concat(REPLY);

const args = process.argv.slice(2);
let list = ALL, scope = 'bütün kataloq (' + ALL.length + ' şablon)';
if (args.length) {
  if (args.length === 1 && args[0] === 'replies') { list = REPLY; scope = 'cavab şablonları'; }
  else if (args.length === 1 && (args[0] === 'zarafat' || args[0] === 'xatire')) {
    list = ALL.filter(t => t.tone === args[0]); scope = args[0] + ' tonu';
  } else { list = ALL.filter(t => args.indexOf(t.cat) >= 0); scope = args.join(', '); }
  if (!list.length) { console.log('Bu filtrə uyğun şablon yoxdur: ' + args.join(' ')); process.exit(2); }
}

console.log('\nMətn auditi — ' + scope + ' · ' + list.length + ' şablon');

let fail = 0;
const section = (title, errs) => {
  console.log('\n' + title);
  if (!errs.length) { console.log('  ✓ problem tapılmadı'); return; }
  fail += errs.length;
  console.log('  ✗ ' + errs.length + ' problem:');
  errs.forEach(e => console.log('      ' + e));
};

section('9. Üslub keyfiyyəti', R.styleErrors(list));
section('10. Variant siyahıları', R.optionErrors(list));

/* Məlumat üçün: variant siyahısı olan şablonların payı. */
const withOpts = list.filter(t => t.titleOptions || t.powersOptions || t.penaltyOptions).length;
const withFields = list.filter(t => t.fields).length;
console.log('\n11. Əhatə');
console.log('  variant siyahısı olan: ' + withOpts + ' / ' + list.length +
            '  ·  anketli (variant ala bilməz): ' + withFields);

console.log('\n' + (fail ? fail + ' problem' : 'təmizdir'));
process.exit(fail ? 1 : 0);
