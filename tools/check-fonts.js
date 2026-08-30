/* Şrift əhatəsi yoxlanışı — Azərbaycan əlifbası hər şriftdə tam olmalıdır.
   `npm run test:fonts`

   NİYƏ LAZIMDIR: gözəl bir dekorativ şriftlə bütün dizaynları hazırlayıb sonra
   «Əziz» sözünün pozulduğunu görmək bütün işi yenidən etdirər. Üstəlik
   `pyftsubset` mənbədə olmayan kod nöqtəsini SƏSSİZCƏ buraxır — yəni kəsilmiş
   fayl heç bir xəbərdarlıq olmadan naqis çıxa bilər. Ona görə yoxlama
   nəticə fayllarının üzərində aparılır.

   İstifadə:
     node tools/check-fonts.js                  frontend/fonts/*.woff2 (ailə-ailə)
     node tools/check-fonts.js a.woff2 b.woff2  konkret fayllar
     node tools/check-fonts.js --menbe          @fontsource namizədlərini süz
*/
'use strict';
const fs = require('fs'), path = require('path');
const { coverage } = require('./woff2-cmap.js');

const ROOT = path.join(__dirname, '..');
const FONTS = path.join(ROOT, 'frontend', 'fonts');
const SRC = path.join(ROOT, 'node_modules', '@fontsource');

/* --- Tələb olunan simvollar ------------------------------------------- */

/* Azərbaycan əlifbası — tam. Bunlardan biri yoxdursa şrift işə yaramır. */
const AZ = 'AaBbCcÇçDdEeƏəFfGgĞğHhXxIıİiJjKkQqLlMmNnOoÖöPpRrSsŞşTtUuÜüVvYyZz';
/* Əlifbada olmayan, amma mətndə şübhəsiz işlənən latın hərfləri (Wi-Fi, VIP…) */
const LAT = 'WwWw';
const RAQEM = '0123456789';
/* Minimum durğu dəsti — dəvətnamə mətnində real işlənənlər */
const DURGU = ' .,:;!?\'"()-/&';
/* Tipoqrafik simvollar — olmasa dizayn kasıblaşır, amma sınmır */
const ISTEK = '«»–—‘’“”…·° @#%+*=[]';

const cps = s => [...new Set([...s].map(c => c.codePointAt(0)))];
const MECBURI = cps(AZ + LAT + RAQEM + DURGU);
const OPSIYON = cps(ISTEK);

const ad = cp => String.fromCodePoint(cp) + ' (U+' + cp.toString(16).toUpperCase().padStart(4, '0') + ')';

/* --- Ailəyə görə qruplaşdırma ----------------------------------------- */

/* plex-sans-400-latin.woff2 + plex-sans-400-latin-ext.woff2 → bir ailə.
   Alt-dəstlər ayrı fayllardadır, əhatə onların BİRLƏŞMƏSİDİR — tək faylı
   yoxlamaq yanlış nəticə verər. */
function ailesi(file) {
  return path.basename(file, '.woff2').replace(/-latin(-ext)?$/, '');
}

function qruplasdir(files) {
  const m = new Map();
  for (const f of files) {
    const k = ailesi(f);
    if (!m.has(k)) m.set(k, []);
    m.get(k).push(f);
  }
  return m;
}

/* --- Yoxlama ----------------------------------------------------------- */

let pass = 0, fail = 0;
const check = (n, c, x) => c ? (pass++, console.log('  ✓', n))
                             : (fail++, console.log('  ✗', n, x === undefined ? '' : x));

function birlesmisEhate(files) {
  const set = new Set();
  for (const f of files) for (const cp of coverage(fs.readFileSync(f))) set.add(cp);
  return set;
}

function yoxla(ad_, files) {
  let set;
  try { set = birlesmisEhate(files); }
  catch (e) { check(ad_, false, 'oxuna bilmədi — ' + e.message); return null; }

  const yox = MECBURI.filter(cp => !set.has(cp));
  const zeif = OPSIYON.filter(cp => !set.has(cp));
  const say = files.length + ' fayl · ' + set.size + ' simvol';

  check(ad_ + '  [' + say + ']', yox.length === 0, yox.length ? 'çatışmır: ' + yox.map(ad).join(' ') : '');
  if (!yox.length && zeif.length) console.log('    ~ tipoqrafik simvol çatışmır:', zeif.map(ad).join(' '));
  return { set, yox, zeif };
}

/* --- @fontsource namizədlərinin süzülməsi ------------------------------ */

/* Dizayna başlamazdan ƏVVƏL işlədilir: hansı ailənin `ə` hərfi var, hansının yox.
   Kiril alt-dəsti olan ailələr Azərbaycan hərflərini daha çox daşıyır. */
/* ÖLÇÜLMÜŞ NƏTİCƏ (2026-08-30, @fontsource son versiyalar).
   Bunu yenidən yoxlamağa ehtiyac yoxdur — `--menbe` rejimi ilə alınıb.

     KEÇDİ : cormorant-garamond · playfair-display · eb-garamond · montserrat ·
             inter · nunito · raleway · mulish · spectral · caveat · great-vibes ·
             pacifico · bad-script · baloo-2 · comfortaa
     SINDI : manrope (Ə yoxdur) · jost · marck-script · yeseva-one · cinzel ·
             marcellus (Ə, ə yoxdur) · prata · fredoka (7 hərf yoxdur)

   Seçilən dəst: Cormorant Garamond · Playfair Display · Montserrat ·
   Great Vibes · Baloo 2. Bax: tools/subset-fonts.js DAVET cədvəli. */
const NAMIZEDLER = [
  // display serif
  'cormorant-garamond', 'playfair-display', 'eb-garamond', 'cormorant',
  // modern sans
  'manrope', 'jost', 'inter', 'montserrat', 'nunito', 'raleway', 'mulish', 'cinzel', 'marcellus', 'prata', 'spectral',
  // əl yazısı / script
  'caveat', 'marck-script', 'great-vibes', 'pacifico', 'bad-script', 'yeseva-one',
  // uşaq display
  'baloo-2', 'fredoka', 'comfortaa'
];

function menbeYoxla() {
  console.log('@fontsource namizədləri (mənbə faylları):\n');
  if (!fs.existsSync(SRC)) { console.log('  node_modules/@fontsource tapılmadı — əvvəlcə npm install'); return; }

  for (const pkg of NAMIZEDLER) {
    const dir = path.join(SRC, pkg, 'files');
    if (!fs.existsSync(dir)) { console.log('  –', pkg, '— paket quraşdırılmayıb'); continue; }

    const files = fs.readdirSync(dir).filter(f => /-latin(-ext)?-\d+-normal\.woff2$/.test(f));
    const cekiler = [...new Set(files.map(f => f.match(/-(\d+)-normal\.woff2$/)[1]))].sort();
    for (const w of cekiler) {
      const set = files.filter(f => f.endsWith('-' + w + '-normal.woff2')).map(f => path.join(dir, f));
      yoxla(pkg + ' ' + w, set);
    }
  }
}

/* --- Giriş ------------------------------------------------------------- */

const args = process.argv.slice(2);

if (args[0] === '--menbe') {
  menbeYoxla();
} else {
  const files = args.length ? args.map(f => path.resolve(f))
    : fs.readdirSync(FONTS).filter(f => f.endsWith('.woff2')).sort().map(f => path.join(FONTS, f));

  console.log('Şrift əhatəsi — ' + MECBURI.length + ' məcburi simvol:\n');
  for (const [k, v] of qruplasdir(files)) yoxla(k, v);
}

console.log('\n' + pass + ' keçdi, ' + fail + ' uğursuz');
process.exit(fail ? 1 : 0);
