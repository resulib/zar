/* Şriftləri Azərbaycan əlifbası + istifadə olunan durğu işarələrinə görə kəsir.
   İki dəst çıxarır:
     · IBM Plex          → frontend/fonts.css        (zarafat saytının şriftləri)
     · Dəvətnamə dəsti   → frontend/devet-fonts.css  (dəvətnamə bölməsi)
   Hər iki .css faylı BU SKRİPTİN NƏTİCƏSİDİR — əl ilə redaktə etmə.

   Bütün ailələr `tools/check-fonts.js --menbe` yoxlamasından keçib: Ə/ə hərfi
   olmayan ailə dəstə düşmür. Bax: check-fonts.js-dəki nəticə cədvəli. */
const { execSync } = require('child_process');
const fs = require('fs'), path = require('path');

const SRC = path.join(__dirname, '..', 'node_modules', '@fontsource');
const OUT = path.join(__dirname, '..', 'frontend', 'fonts');

const LATIN = 'U+0020-007E,U+00A0,U+00AB,U+00B0,U+00B7,U+00BB,U+00C7,U+00D6,U+00DC,U+00E7,U+00F6,U+00FC,U+0131,U+2013,U+2014,U+2018,U+2019,U+201C,U+201D,U+2026';
const EXT   = 'U+011E,U+011F,U+0130,U+015E,U+015F,U+018F,U+0259';

/* Sayt şriftləri — dekorativ deyil, OpenType xüsusiyyətləri lazım deyil. */
const PLEX = [
  { pkg: 'ibm-plex-sans',  w: 400, out: 'plex-sans-400',  fam: 'Plex Sans' },
  { pkg: 'ibm-plex-sans',  w: 600, out: 'plex-sans-600',  fam: 'Plex Sans' },
  { pkg: 'ibm-plex-serif', w: 600, out: 'plex-serif-600', fam: 'Plex Serif' },
  { pkg: 'ibm-plex-mono',  w: 500, out: 'plex-mono-500',  fam: 'Plex Mono' }
];

/* Dəvətnamə şriftləri. Ailə adları neytraldır — brend sözü yoxdur. */
const DAVET = [
  { pkg: 'cormorant-garamond', w: 400, out: 'davet-serif-400',   fam: 'Davet Serif' },
  { pkg: 'cormorant-garamond', w: 600, out: 'davet-serif-600',   fam: 'Davet Serif' },
  { pkg: 'playfair-display',   w: 700, out: 'davet-display-700', fam: 'Davet Display' },
  { pkg: 'montserrat',         w: 400, out: 'davet-sans-400',    fam: 'Davet Sans' },
  { pkg: 'montserrat',         w: 600, out: 'davet-sans-600',    fam: 'Davet Sans' },
  { pkg: 'montserrat',         w: 800, out: 'davet-sans-800',    fam: 'Davet Sans' },
  { pkg: 'great-vibes',        w: 400, out: 'davet-script-400',  fam: 'Davet Script' },
  { pkg: 'baloo-2',            w: 500, out: 'davet-yumsaq-500',  fam: 'Davet Yumsaq' },
  { pkg: 'baloo-2',            w: 700, out: 'davet-yumsaq-700',  fam: 'Davet Yumsaq' },
];

/* pyftsubset PATH-da olmaya bilər (pip --user quraşdırması). Modul çağırışı
   həmişə işləyir, ona görə əvvəlcə əmri, sonra modulu sınayırıq. */
function subsetter() {
  for (const cmd of ['pyftsubset', 'python3 -m fontTools.subset', 'python -m fontTools.subset']) {
    try { execSync(cmd + ' --help', { stdio: 'ignore' }); return cmd; } catch (e) { /* növbəti */ }
  }
  console.error('XƏTA: fonttools tapılmadı. Quraşdır:  python3 -m pip install --user fonttools brotli');
  process.exit(1);
}
const SUB = subsetter();

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

/* `keepFeatures` — dekorativ şriftlərdə kern/liga saxlanılır, yoxsa əl yazısı
   şriftlərin hərf birləşmələri pozulur. Sayt şriftlərində buna ehtiyac yoxdur. */
function kes(faces, keepFeatures) {
  let total = 0;
  for (const f of faces) {
    for (const [sub, uni] of [['latin', LATIN], ['latin-ext', EXT]]) {
      const src = path.join(SRC, f.pkg, 'files', `${f.pkg}-${sub}-${f.w}-normal.woff2`);
      const dst = path.join(OUT, `${f.out}-${sub}.woff2`);
      if (!fs.existsSync(src)) { console.error('XƏTA: mənbə yoxdur —', src); process.exit(1); }
      execSync(`${SUB} "${src}" --output-file="${dst}" --flavor=woff2 --unicodes="${uni}"` +
               (keepFeatures ? '' : " --layout-features=''") + ' --no-hinting --desubroutinize');
      const kb = fs.statSync(dst).size / 1024;
      total += kb;
      console.log(`  ${path.basename(dst)}  ${kb.toFixed(1)} KB`);
    }
  }
  return total;
}

/* @font-face bəyannaməsi. unicode-range bilərəkdən kəsilmiş dəstdən genişdir:
   brauzer hansı faylı yükləyəcəyini bu aralıqla seçir. */
const RANGE_LATIN = 'U+0000-00FF,U+0131,U+2013,U+2014,U+2018,U+2019,U+201C,U+201D,U+2026';
const RANGE_EXT   = 'U+0100-02BA,U+1E00-1E9F';
const face = (fam, w, name) => [
  `@font-face{font-family:'${fam}';font-style:normal;font-weight:${w};font-display:swap;` +
  `src:url(fonts/${name}-latin.woff2) format('woff2');unicode-range:${RANGE_LATIN}}`,
  `@font-face{font-family:'${fam}';font-style:normal;font-weight:${w};font-display:swap;` +
  `src:url(fonts/${name}-latin-ext.woff2) format('woff2');unicode-range:${RANGE_EXT}}`
].join('\n');

const css = (faces) => faces.map(f => face(f.fam, f.w, f.out)).join('\n') + '\n';

console.log('IBM Plex:');
const t1 = kes(PLEX, false);
fs.writeFileSync(path.join(__dirname, '..', 'frontend', 'fonts.css'),
  '/* Lokal IBM Plex — Azərbaycan əlifbasına görə kəsilmiş. CDN yoxdur. */\n' + css(PLEX));
console.log(`Cəmi: ${t1.toFixed(1)} KB → fonts.css`);

console.log('\nDəvətnamə dəsti:');
const t2 = kes(DAVET, true);
fs.writeFileSync(path.join(__dirname, '..', 'frontend', 'devet-fonts.css'),
  '/* Dəvətnamə şriftləri — Azərbaycan əlifbasına görə kəsilmiş. CDN yoxdur.\n' +
  '   Hər ailə tools/check-fonts.js yoxlamasından keçib (Ə, ə, Ğ, ğ, İ, ı, Ş, ş var). */\n' + css(DAVET));
console.log(`Cəmi: ${t2.toFixed(1)} KB → devet-fonts.css`);
