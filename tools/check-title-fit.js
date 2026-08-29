/* Başlığın sığması: uzun rəsmi adlar 12 dizaynda və paylaşım kartında «…» ilə
   kəsilməməlidir. Node-un stub kanvası (`measureText = uzunluq × 6.1`) bu ölçü
   üçün yararsızdır — real şrift metrikası lazımdır, ona görə brauzerdə işləyir.

   İşlətmək:  node tools/check-title-fit.js ["Başlıq"] ...
   Arqument verilməsə kataloqdakı ƏN UZUN başlıqlar yoxlanılır. */
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT_DIR = path.join(__dirname, '..');
const ROOT = path.join(ROOT_DIR, 'frontend');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2' };

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/index.html';
  const f = path.join(ROOT, p);
  if (!f.startsWith(ROOT) || !fs.existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'text/plain' });
  fs.createReadStream(f).pipe(res);
});

/* Arqument yoxdursa kataloqdan ən uzun 12 başlığı götürür. */
function catalogTitles() {
  const sb = { window: {}, QRZ: null, Math, Date, JSON, String, Number, Array, Object, isNaN, parseInt, parseFloat, RegExp };
  sb.globalThis = sb; vm.createContext(sb);
  for (const f of ['templates.js', 'templates-xatire.js', 'replies.js'])
    vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), sb);
  return sb.window.TEMPLATES.concat(sb.window.REPLIES)
    .map(t => t.title).sort((a, b) => b.length - a.length).slice(0, 12);
}

const TITLES = process.argv.slice(2).length ? process.argv.slice(2) : catalogTitles();

(async () => {
  await new Promise(r => server.listen(4207, r));
  const b = await chromium.launch();
  const page = await b.newPage({ viewport: { width: 900, height: 1300 } });
  await page.goto('http://localhost:4207/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(600);

  const rows = await page.evaluate(TT => {
    const out = [];
    for (const title of TT) {
      for (const layout of DOCGEN.LAYOUTS) {
        const d = {
          layout, palette: 'gold', tone: 'zarafat', title,
          to: 'Günel Şəkərova', from: 'Elvin Məmmədov',
          preamble: 'Aparılmış araşdırma nəticəsində müəyyən edilmişdir ki, sözügedən məsələ üzrə tərəflərin mövqeyi nəzərə alınmaqla yekun qərar qəbul edilmişdir.',
          powers: 'Birinci bənd mətni burada yazılır.\nİkinci bənd mətni burada yazılır.\nÜçüncü bənd mətni burada yazılır.\nDördüncü bənd mətni burada yazılır.',
          penalty: 'Şərtlərin pozulması halında sənəd qüvvədən düşmüş hesab edilir və yenidən verilmir.',
          signOrg: 'Evdaxili Münasibətlərin Tənzimlənməsi üzrə Ali Şura',
          regNo: 'ZRF-2026-9482', date: '26.08.2026', paid: true,
          verifyUrl: 'https://zarafat.az/r/ZRF-2026-9482'
        };
        /* Sənədin sabit alt mətnlərində də «…» var, ona görə yalnız başlığın öz
           sözlərini daşıyan <text> elementlərinə baxılır. */
        const key = title.split(' ')[0].toUpperCase().slice(0, 6);
        for (const [kind, svg] of [['a4', DOCGEN.a4(d)], ['story', DOCGEN.story(d)]]) {
          const box = document.createElement('div'); box.innerHTML = svg;
          let cut = false;
          box.querySelectorAll('text').forEach(t => {
            const s = t.textContent || '';
            if (s.toUpperCase().indexOf(key) >= 0 && s.indexOf('…') >= 0) cut = true;
          });
          out.push({ len: title.length, where: layout + '/' + kind, cut });
        }
      }
    }
    return out;
  }, TITLES);

  await b.close(); server.close();

  let fail = 0;
  const stride = rows.length / TITLES.length;
  TITLES.forEach((t, i) => {
    const bad = rows.slice(i * stride, (i + 1) * stride).filter(r => r.cut).map(r => r.where);
    if (bad.length) { fail++; console.log('  ✗ [' + t.length + '] ' + t + '\n      kəsilir: ' + bad.join(', ')); }
    else console.log('  ✓ [' + t.length + '] ' + t);
  });
  console.log('\n' + (TITLES.length - fail) + ' başlıq sığır, ' + fail + ' kəsilir');
  process.exit(fail ? 1 : 0);
})();
