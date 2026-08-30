/* Bütün dəvətnamə dizaynlarını real brauzerdə render edir → tools/davet/
   Node stubu yaramır: canvas ölçüləri və şrift metrikaları lazımdır. */
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');

const ROOT = path.join(__dirname, '..', 'frontend');
const OUT = path.join(__dirname, 'davet');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2' };
const PORT = 4242;

const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  const f = path.join(ROOT, url === '/' ? '/index.html' : url);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'text/plain' });
  fs.createReadStream(f).pipe(res);
});

const PAGE = `<!doctype html><meta charset="utf-8">
<link rel="stylesheet" href="/devet-fonts.css">
<script src="/devet-designs.js"></script>
<script src="/invite.js"></script>
<body style="margin:0;background:#888"></body>`;

const NUMUNE = {
  date: '2026-09-19', time: '18:00',
  address: 'Bakı, Nizami küç. 12, «Park» binası',
  phone: '+994 50 123 45 67', guest: ''
};

(async () => {
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });
  await new Promise(r => server.listen(PORT, r));
  const b = await chromium.launch();
  const page = await b.newPage({ viewport: { width: 1200, height: 900 } });
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  await page.route('**/index.html', r => r.fulfill({ contentType: 'text/html', body: PAGE }));
  await page.goto('http://localhost:' + PORT + '/index.html', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => window.DAVET.ready());

  const only = process.argv[2];
  const list = await page.evaluate(() => window.DAVET_DESIGNS.map(d => d.id));
  const ratios = (process.argv[3] || 'kart,kvadrat,hekaye').split(',');

  for (const id of list) {
    if (only && only !== 'hamisi' && id.indexOf(only) < 0) continue;
    for (const r of ratios) {
      const dataUrl = await page.evaluate(async ([id, r, num]) => {
        const d = window.DAVET.designOf(id), ev = window.DAVET.eventOf(d.event);
        const size = window.DAVET.RATIOS[r];
        const cv = document.createElement('canvas');
        cv.width = size.w; cv.height = size.h;
        const inv = Object.assign({}, num, {
          design: id, palette: d.palette, event: d.event,
          hosts: ev.numune.adlar, title: ev.numune.baslik,
          venue: ev.numune.mekan, note: ev.numune.qeyd
        });
        window.DAVET.draw(cv.getContext('2d'), inv, { ratio: r });
        return cv.toDataURL('image/png');
      }, [id, r, NUMUNE]);
      fs.writeFileSync(path.join(OUT, id + '-' + r + '.png'),
        Buffer.from(dataUrl.split(',')[1], 'base64'));
    }
    process.stdout.write('.');
  }

  /* Kontakt vərəqi — bir baxışda hamısı */
  const sheet = await page.evaluate(async ([num, ratio]) => {
    const ids = window.DAVET_DESIGNS.map(d => d.id);
    const cols = 6, cw = 300, ch = Math.round(300 * window.DAVET.RATIOS[ratio].h / window.DAVET.RATIOS[ratio].w);
    const rows = Math.ceil(ids.length / cols);
    const sh = document.createElement('canvas');
    sh.width = cols * cw; sh.height = rows * (ch + 26);
    const sc = sh.getContext('2d');
    sc.fillStyle = '#5a5a5a'; sc.fillRect(0, 0, sh.width, sh.height);
    for (let i = 0; i < ids.length; i++) {
      const d = window.DAVET.designOf(ids[i]), ev = window.DAVET.eventOf(d.event);
      const size = window.DAVET.RATIOS[ratio];
      const cv = document.createElement('canvas');
      cv.width = size.w; cv.height = size.h;
      window.DAVET.draw(cv.getContext('2d'), Object.assign({}, num, {
        design: ids[i], palette: d.palette, event: d.event,
        hosts: ev.numune.adlar, title: ev.numune.baslik, venue: ev.numune.mekan, note: ev.numune.qeyd
      }), { ratio: ratio });
      const x = (i % cols) * cw, y = Math.floor(i / cols) * (ch + 26);
      sc.drawImage(cv, x + 4, y + 4, cw - 8, ch - 8);
      sc.fillStyle = '#fff'; sc.font = '13px sans-serif'; sc.textAlign = 'center';
      sc.fillText(ids[i], x + cw / 2, y + ch + 14);
    }
    return sh.toDataURL('image/png');
  }, [NUMUNE, ratios[0]]);
  fs.writeFileSync(path.join(OUT, '_kontakt.png'), Buffer.from(sheet.split(',')[1], 'base64'));

  console.log('\nJS xətası:', errs.length ? errs : 'yoxdur');
  console.log('Çıxış:', OUT);
  await b.close(); server.close();
})();
