const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT_DIR = path.join(__dirname, '..');
const ROOT = path.join(__dirname, '..');
const MIME = { '.html':'text/html', '.css':'text/css', '.js':'text/javascript', '.woff2':'font/woff2' };

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  const f = path.join(ROOT, p);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'text/plain' });
  fs.createReadStream(f).pipe(res);
});
const wait = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  await new Promise(r => server.listen(4177, r));
  const b = await chromium.launch();
  const errs = [];
  for (const [file, name, h] of [['admin.html','admin',1400],['admin-documents.html','admin-documents',1000],['kabinet.html','kabinet',1300]]) {
    const p = await b.newPage({ viewport: { width: 1400, height: h }, deviceScaleFactor: 2 });
    p.on('pageerror', e => errs.push(name + ': ' + e.message));
    await p.goto(`http://localhost:4177/tools/panel-preview/${file}`, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    await wait(500);
    await p.screenshot({ path: path.join(ROOT_DIR, 'tools', 'shots', `panel-${name}.png`), fullPage: true });
    await p.close();
  }
  console.log('Panel görüntüləri hazırdır. Xətalar:', errs.length ? errs : 'yoxdur');
  await b.close(); server.close();
})();
