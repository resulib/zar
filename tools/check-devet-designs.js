/* Dəvətnamə kataloqunun bütövlüyü — `npm run test:devet`
   Node/vm; brauzer lazım deyil. check-templates.js üslubunda.

   Ən vacib yoxlama SONUNCUDUR: brend sızması. Toy dəvətnaməsinin altında
   «zarafat» sözünü görən qonaq dəvəti ciddi qəbul etmir — bu, texniki səhv
   deyil, məhsulu öldürən səhvdir, ona görə avtomatlaşdırılıb. */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');

const ROOT = path.join(__dirname, '..');
const FE = path.join(ROOT, 'frontend');

let pass = 0, fail = 0;
const check = (n, c, x) => c ? (pass++, console.log('  ✓', n))
                             : (fail++, console.log('  ✗', n, x === undefined ? '' : JSON.stringify(x)));
const bas = t => console.log('\n' + t);

/* --- kataloqu yüklə --------------------------------------------------- */
const sandbox = { window: {}, Math, JSON, String, Number, Array, Object };
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(FE, 'devet-designs.js'), 'utf8'), sandbox);
const W = sandbox.window;
const EVENTS = W.DAVET_EVENTS, DESIGNS = W.DAVET_DESIGNS,
      PALETTES = W.DAVET_PALETTES, MOTIFS = W.DAVET_MOTIFS, STYLES = W.DAVET_STYLES;

/* --- config/devet.php ağ siyahıları ------------------------------------
   env()/storage_path() Laravel-siz işləmədiyi üçün fayl mətnindən oxunur. */
const PHP = fs.readFileSync(path.join(ROOT, 'backend-php', 'config', 'devet.php'), 'utf8');
function phpList(key) {
  const m = PHP.match(new RegExp("'" + key + "'\\s*=>\\s*\\[([\\s\\S]*?)\\n?\\s*\\],"));
  if (!m) return null;
  return (m[1].match(/'([^']+)'/g) || []).map(s => s.slice(1, -1));
}

/* --- 1. quruluş -------------------------------------------------------- */
bas('1. Quruluş');
check('11 tədbir', EVENTS.length === 11, EVENTS.length);
check('33 dizayn', DESIGNS.length === 33, DESIGNS.length);
/* Massiv boşluğu (`[{}, , {}]`) filter/every tərəfindən görünmür, amma
   length-i şişirdir — sayğaclar səssizcə sürüşər. */
check('massiv boşluğu yoxdur',
  DESIGNS.every((_, i) => Object.prototype.hasOwnProperty.call(DESIGNS, i)) &&
  EVENTS.every((_, i) => Object.prototype.hasOwnProperty.call(EVENTS, i)));

const dIds = DESIGNS.map(d => d.id), eIds = EVENTS.map(e => e.id);
check('dizayn id-ləri unikaldır', new Set(dIds).size === dIds.length);
check('tədbir id-ləri unikaldır', new Set(eIds).size === eIds.length);
check('id-lər ASCII-dir (URL və fayl adında işlənir)', dIds.concat(eIds).every(i => /^[a-z0-9-]+$/.test(i)),
  dIds.concat(eIds).filter(i => !/^[a-z0-9-]+$/.test(i)));

bas('2. Hər tədbirdə ən azı 3 variant');
for (const e of EVENTS) {
  const list = DESIGNS.filter(d => d.event === e.id);
  check(e.id + ' — ' + list.length + ' variant', list.length >= 3, list.length);
}

bas('3. Sahələr və ağ siyahılar');
check('hər dizaynın tədbiri mövcuddur', DESIGNS.every(d => eIds.indexOf(d.event) >= 0),
  DESIGNS.filter(d => eIds.indexOf(d.event) < 0).map(d => d.id));
check('hər dizaynın üslubu tanınır', DESIGNS.every(d => STYLES.indexOf(d.style) >= 0),
  DESIGNS.filter(d => STYLES.indexOf(d.style) < 0).map(d => d.id));
check('hər dizaynın palitrası mövcuddur', DESIGNS.every(d => !!PALETTES[d.palette]),
  DESIGNS.filter(d => !PALETTES[d.palette]).map(d => d.id));
check('hər dizaynın adı və izahı var', DESIGNS.every(d => d.ad && d.blurb));
check('bütün üslublar işlədilir', STYLES.every(s => DESIGNS.some(d => d.style === s)),
  STYLES.filter(s => !DESIGNS.some(d => d.style === s)));
check('bütün palitralar işlədilir', Object.keys(PALETTES).every(p => DESIGNS.some(d => d.palette === p)),
  Object.keys(PALETTES).filter(p => !DESIGNS.some(d => d.palette === p)));

const PAL_KEYS = ['ad', 'kagiz', 'kagiz2', 'murekkeb', 'murekkeb2', 'vurgu', 'vurguSoft', 'xett'];
check('palitralarda bütün açarlar var',
  Object.keys(PALETTES).every(k => PAL_KEYS.every(x => PALETTES[k][x])),
  Object.keys(PALETTES).filter(k => !PAL_KEYS.every(x => PALETTES[k][x])));
check('palitra rəngləri hex-dir',
  Object.keys(PALETTES).every(k => PAL_KEYS.slice(1).every(x => /^#[0-9a-f]{6}$/.test(PALETTES[k][x]))));

bas('4. Motiv qaydası');
check('motiv yalnız «motiv» üslubunda',
  DESIGNS.every(d => (d.style === 'motiv') === !!d.motiv),
  DESIGNS.filter(d => (d.style === 'motiv') !== !!d.motiv).map(d => d.id));
check('motivlər təsdiqlənmiş siyahıdandır',
  DESIGNS.every(d => !d.motiv || MOTIFS.indexOf(d.motiv) >= 0),
  DESIGNS.filter(d => d.motiv && MOTIFS.indexOf(d.motiv) < 0).map(d => d.motiv));
/* Multfilm qəhrəmanı, film personajı və brend simvolu qadağandır —
   motiv siyahısı ümumi mövzulardan ibarətdir və qapalıdır. */
check('motiv siyahısı ümumi mövzulardır',
  MOTIFS.join(',') === 'kosmos,dinozavr,deniz,heyvanlar,nagil,avtomobil,cicek', MOTIFS);

bas('5. Uşaq tədbirləri');
const usaq = EVENTS.filter(e => e.usaq).map(e => e.id);
check('uşaq tədbirləri işarələnib (' + usaq.join(', ') + ')', usaq.length >= 3, usaq);
check('HEÇ BİR dizaynda foto yükləmə yoxdur (v1)', DESIGNS.every(d => d.photo === false),
  DESIGNS.filter(d => d.photo !== false).map(d => d.id));

bas('6. config/devet.php ilə uyğunluq');
for (const [key, js] of [['designs', dIds], ['events', eIds],
                         ['palettes', Object.keys(PALETTES)], ['motifs', MOTIFS], ['styles', STYLES]]) {
  const php = phpList(key);
  check("config '" + key + "' siyahısı eynidir",
    php && php.length === js.length && php.every((v, i) => v === js[i]),
    php ? { php: php.length, js: js.length, ferq: js.filter(x => php.indexOf(x) < 0) } : 'tapılmadı');
}

bas('7. Nümunə mətnlər');
const L = { adlar: 120, baslik: 140, mekan: 120, qeyd: 300 };
for (const e of EVENTS) {
  const n = e.numune || {};
  const uzun = Object.keys(L).filter(k => (n[k] || '').length > L[k]);
  check(e.id + ' nümunə mətnləri limitə sığır', uzun.length === 0, uzun);
  check(e.id + ' üst sətri BÖYÜK hərflə', e.ust === e.ust.toUpperCase() || /[İIƏĞŞÇÖÜ]/.test(e.ust), e.ust);
}

/* --- 8. BREND SIZMASI --------------------------------------------------
   Bölmənin bütün mənası budur: dəvətnamə tərəfində zarafat məhsulunun
   adı, dili və atributları görünməməlidir. */
bas('8. Brend sızması');
const QADAGAN = ['zarafat', 'notariat', 'reyestr', 'parodiya', 'znp', 'mohur', 'quvvesi',
                 'eylence meqsedli', 'senedin', 'palatasi'];
/* Azərbaycan hərfləri ASCII-yə çevrilir: 'İ'.toLowerCase() iki kod nöqtəsidir
   və JS-in `i` bayrağı `İ` hərfini tutmur. */
const fold = s => String(s)
  .replace(/[ƏƏə]/g, 'e').replace(/[Ğğ]/g, 'g').replace(/[İI]/g, 'i').replace(/ı/g, 'i')
  .replace(/[Öö]/g, 'o').replace(/[Şş]/g, 's').replace(/[Üü]/g, 'u').replace(/[Çç]/g, 'c')
  .toLowerCase();

const SCAN = ['devet-designs.js', 'invite.js', 'devet.html', 'devet.css', 'devet-app.js',
              'devet-view.html', 'devet-view.css', 'devet-view.js', 'devet-fonts.css', 'zip.js',
              'devet-panel.css', 'devet-board.js']
  .map(f => path.join(FE, f))
  .concat([path.join(ROOT, 'backend-php', 'config', 'devet.php')])
  .filter(f => fs.existsSync(f));

for (const f of SCAN) {
  const body = fold(fs.readFileSync(f, 'utf8'));
  const tapilan = QADAGAN.filter(w => body.indexOf(fold(w)) >= 0);
  check(path.basename(f) + ' təmizdir', tapilan.length === 0, tapilan);
}
check('yoxlanan fayl sayı', SCAN.length >= 3, SCAN.length);

console.log('\n' + pass + ' keçdi, ' + fail + ' uğursuz');
process.exit(fail ? 1 : 0);
