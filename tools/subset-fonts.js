/* IBM Plex şriftlərini Azərbaycan əlifbası + istifadə olunan durğu işarələrinə görə kəsir */
const { execSync } = require('child_process');
const fs = require('fs'), path = require('path');

const SRC = path.join(__dirname, '..', 'node_modules', '@fontsource');
const OUT = path.join(__dirname, '..', 'frontend', 'fonts');

const LATIN = 'U+0020-007E,U+00A0,U+00AB,U+00B0,U+00B7,U+00BB,U+00C7,U+00D6,U+00DC,U+00E7,U+00F6,U+00FC,U+0131,U+2013,U+2014,U+2018,U+2019,U+201C,U+201D,U+2026';
const EXT   = 'U+011E,U+011F,U+0130,U+015E,U+015F,U+018F,U+0259';

const FACES = [
  { pkg: 'ibm-plex-sans',  file: 'ibm-plex-sans',  w: 400, out: 'plex-sans-400' },
  { pkg: 'ibm-plex-sans',  file: 'ibm-plex-sans',  w: 600, out: 'plex-sans-600' },
  { pkg: 'ibm-plex-serif', file: 'ibm-plex-serif', w: 600, out: 'plex-serif-600' },
  { pkg: 'ibm-plex-mono',  file: 'ibm-plex-mono',  w: 500, out: 'plex-mono-500' }
];

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

let total = 0;
for (const f of FACES) {
  for (const [sub, uni] of [['latin', LATIN], ['latin-ext', EXT]]) {
    const src = path.join(SRC, f.pkg, 'files', `${f.file}-${sub}-${f.w}-normal.woff2`);
    const dst = path.join(OUT, `${f.out}-${sub}.woff2`);
    execSync(`pyftsubset "${src}" --output-file="${dst}" --flavor=woff2 --unicodes="${uni}" --layout-features='' --no-hinting --desubroutinize`);
    const kb = fs.statSync(dst).size / 1024;
    total += kb;
    console.log(`  ${path.basename(dst)}  ${kb.toFixed(1)} KB`);
  }
}
console.log(`Cəmi: ${total.toFixed(1)} KB`);

/* @font-face bəyannaməsi */
const RANGE_LATIN = 'U+0000-00FF,U+0131,U+2013,U+2014,U+2018,U+2019,U+201C,U+201D,U+2026';
const RANGE_EXT   = 'U+0100-02BA,U+1E00-1E9F';
const face = (fam, w, name) => [
  `@font-face{font-family:'${fam}';font-style:normal;font-weight:${w};font-display:swap;` +
  `src:url(fonts/${name}-latin.woff2) format('woff2');unicode-range:${RANGE_LATIN}}`,
  `@font-face{font-family:'${fam}';font-style:normal;font-weight:${w};font-display:swap;` +
  `src:url(fonts/${name}-latin-ext.woff2) format('woff2');unicode-range:${RANGE_EXT}}`
].join('\n');

fs.writeFileSync(path.join(__dirname, '..', 'frontend', 'fonts.css'),
  '/* Lokal IBM Plex — Azərbaycan əlifbasına görə kəsilmiş. CDN yoxdur. */\n' +
  [face('Plex Sans', 400, 'plex-sans-400'),
   face('Plex Sans', 600, 'plex-sans-600'),
   face('Plex Serif', 600, 'plex-serif-600'),
   face('Plex Mono', 500, 'plex-mono-500')].join('\n') + '\n');
console.log('fonts.css yazıldı');
