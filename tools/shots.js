/* Sayt ekran görüntüləri: masaüstü (tam səhifə), mobil, və bir neçə fraqment */
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = '/root/zarafat/frontend';
const MIME = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.woff2':'font/woff2' };

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/index.html';
  const f = path.join(ROOT, p);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'text/plain' });
  fs.createReadStream(f).pipe(res);
});
const wait = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  await new Promise(r => server.listen(4188, r));
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox'] });
  const out = '/root/zarafat/tools/shots';
  fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true });

  const errs = [];
  const p = await b.newPage({ viewport: { width: 1400, height: 1000 }, deviceScaleFactor: 2 });
  p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:4188/', { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await wait(700);

  await p.screenshot({ path: `${out}/01-hero.png` });
  await p.evaluate(() => document.getElementById('yarat').scrollIntoView());
  await wait(400);
  await p.screenshot({ path: `${out}/02-templates.png` });

  await p.fill('#fTo', 'Günel Şəkərova'); await p.fill('#fFrom', 'Elvin Məmmədov'); await wait(500);
  await p.evaluate(() => document.querySelector('.editor').scrollIntoView());
  await wait(400);
  await p.screenshot({ path: `${out}/03-editor.png` });

  await p.click('#btnCreate'); await wait(800);
  await p.click('#aPay'); await wait(400);
  await p.screenshot({ path: `${out}/04-payment.png` });
  await p.click('[data-pack="p3"]'); await wait(1100);
  const reg = (await p.$eval('#regBadge', e => e.textContent)).trim();
  await p.fill('#qReg', reg); await p.click('#btnSearch'); await wait(800);
  await p.evaluate(() => document.getElementById('reyestr').scrollIntoView());
  await wait(400);
  await p.screenshot({ path: `${out}/05-registry.png` });

  await p.evaluate(() => document.getElementById('nece').scrollIntoView());
  await wait(400);
  await p.screenshot({ path: `${out}/06-rules.png` });

  /* şrift yoxlaması: bütün Azərbaycan hərfləri */
  await p.setContent(`<style>${fs.readFileSync(ROOT + '/fonts.css','utf8').replace(/url\(fonts\//g,'url(http://localhost:4188/fonts/')}
    body{margin:0;padding:26px;background:#fff}
    p{margin:0 0 14px;font-size:26px}
    .s{font-family:'Plex Sans'}.f{font-family:'Plex Serif';font-weight:600}.m{font-family:'Plex Mono';font-weight:500}</style>
    <p class="s">Ə ə Ğ ğ I ı İ i Ö ö Ş ş Ü ü Ç ç — Plex Sans</p>
    <p class="s" style="font-weight:600">Şəkərova Günel · Həftəsonu Çölə Çıxma Etibarnaməsi</p>
    <p class="f">Zarafat Notariat Palatası — Plex Serif 600</p>
    <p class="m">ZRF-2026-9482 · ƏYLƏNCƏ · 0123456789 — Plex Mono</p>`);
  await p.evaluate(() => document.fonts.ready);
  await wait(600);
  await p.screenshot({ path: `${out}/00-fonts.png`, fullPage: true });

  /* mobil */
  const m = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  m.on('pageerror', e => errs.push('mobil: ' + e.message));
  await m.goto('http://localhost:4188/', { waitUntil: 'networkidle' });
  await m.evaluate(() => document.fonts.ready);
  await wait(600);
  await m.screenshot({ path: `${out}/10-mobile-hero.png` });
  await m.evaluate(() => document.getElementById('yarat').scrollIntoView());
  await wait(400);
  await m.screenshot({ path: `${out}/11-mobile-templates.png` });

  console.log('Ekran görüntüləri hazırdır. Xətalar:', errs.length ? errs : 'yoxdur');
  await b.close(); server.close();
})();
