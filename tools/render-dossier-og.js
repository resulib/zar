/* İş qovluqlarının sosial önizləmə şəkilləri.
   → frontend/dossier-og/<slug>.jpg  (1200×630)

   Serverdə şəkil boru xətti yoxdur, ona görə bu şəkillər BUILD VAXTI bir
   dəfə hazırlanır və git-ə düşür: deploy tərəfdə nə playwright, nə sharp
   lazım olur. Mənbə seed fayllarıdır — baza da lazım deyil.

   Şəkildə SPOİLER YOXDUR: yalnız üz qabığı, iş nömrəsi və qısa təsvir.
   Şəkildə FİKTİVLİK QEYDİ VAR: bu fayl saytdan kənarda yaşayır (WhatsApp,
   Telegram önizləməsi) və kontekstdən qopanda tək qalan şey odur. */
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..', 'frontend');
const SEED = path.join(__dirname, '..', 'backend-php', 'database', 'seeders', 'dossier');
const OUT = path.join(ROOT, 'dossier-og');
const W = 1200, H = 630;
const PORT = 4243;
const MIME = { '.css': 'text/css', '.woff2': 'font/woff2', '.js': 'text/javascript' };

const server = http.createServer((req, res) => {
  const f = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'text/plain' });
  fs.createReadStream(f).pipe(res);
});

const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function sehife(q) {
  const c = q.cover || {};
  return `<!doctype html><meta charset="utf-8">
<link rel="stylesheet" href="/dossier-fonts.css">
<link rel="stylesheet" href="/dossier.css">
<style>
html,body{width:${W}px;height:${H}px;margin:0;display:block;background:#191C1A}
.og{width:${W}px;height:${H}px;display:flex;box-sizing:border-box}
.og-l{width:470px;background:radial-gradient(120% 80% at 50% 0%,#D0B378 0%,#C2A468 45%,#A8894F 100%);
  color:#3A2E14;padding:54px 44px;box-sizing:border-box;position:relative}
.og-r{flex:1;padding:64px 56px;box-sizing:border-box;color:#E9E4D6;display:flex;flex-direction:column;justify-content:center}
.og-org{font:500 15px/1.8 var(--mono);letter-spacing:.16em;color:#6B5525}
.og-kind{font:600 17px var(--mono);letter-spacing:.2em;color:#5C4A1E;margin-top:26px}
/* Büro kodu ayrıca sətirdədir: «AFİB-2026/0847» tam halda 68px-də iki sətrə
   düşür və möhürün üstünə çıxır. */
.og-kod{font:600 18px var(--mono);letter-spacing:.22em;color:#5C4A1E;margin-top:14px}
.og-no{font:600 62px/1 var(--mono);margin:4px 0 8px;color:#2E2410}
.og-op{font:400 17px var(--mono);color:#6B5525}
.og-t{font:600 44px/1.25 var(--sans);margin:0 0 22px}
.og-b{font:400 21px/1.7 var(--mono);color:#8B8271;margin:0 0 26px}
.og-f{font:500 17px var(--mono);color:#8B8271;letter-spacing:.06em}
.og-q{font:600 15px/1.5 var(--mono);color:#C2A468;letter-spacing:.04em;
  margin-top:22px;padding-top:14px;border-top:1px solid #343A33}
.og .stamp{right:34px;top:380px;width:150px;height:150px}
.og .stamp span{font:600 12px/1.45 var(--mono);max-width:106px}
</style>
<div class="og">
  <div class="og-l">
    <div class="og-org">${(c.org || []).map(esc).join('<br>')}</div>
    <div class="og-kind">${esc(c.kind || 'İŞ')}</div>
    <div class="og-kod">${esc(String(q.no).split('-')[0])}</div>
    <div class="og-no">${esc(String(q.no).split('-').slice(1).join('-'))}</div>
    <div class="og-op">${esc(c.opened || '')}</div>
    <div class="stamp"><span>${(c.stamp || []).map(esc).join('<br>')}</span></div>
  </div>
  <div class="og-r">
    <div class="og-t">${esc(q.title)}</div>
    <div class="og-b">${esc(q.blurb)}</div>
    <div class="og-f">${esc(q.readMinutes)} DƏQİQƏ · ${esc((q.documents || []).length)} SƏNƏD · ${esc((q.questions || []).length)} SUAL</div>
    <div class="og-q">FİKTİV OYUN SƏNƏDİ · REAL RƏSMİ SƏNƏD DEYİL</div>
  </div>
</div>`;
}

(async () => {
  if (!fs.existsSync(SEED)) { console.error('XƏTA: seed qovluğu yoxdur —', SEED); process.exit(1); }

  const files = fs.readdirSync(SEED).filter(f => f.endsWith('.json')).sort();
  if (!files.length) { console.error('XƏTA: seed faylı yoxdur.'); process.exit(1); }

  fs.mkdirSync(OUT, { recursive: true });
  await new Promise(r => server.listen(PORT, r));

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });

  for (const f of files) {
    const q = JSON.parse(fs.readFileSync(path.join(SEED, f), 'utf8'));
    await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'domcontentloaded' });
    await page.setContent(sehife(q), { waitUntil: 'load' });
    /* setContent nisbi ünvanları itirir — stil və şrift əl ilə qoşulur. */
    await page.addStyleTag({ url: `http://127.0.0.1:${PORT}/dossier-fonts.css` });
    await page.addStyleTag({ url: `http://127.0.0.1:${PORT}/dossier.css` });
    await page.evaluate(() => document.fonts.ready);

    const png = await page.screenshot({ clip: { x: 0, y: 0, width: W, height: H } });
    const dst = path.join(OUT, q.slug + '.jpg');
    await sharp(png).jpeg({ quality: 86 }).toFile(dst);
    console.log('  ' + path.basename(dst) + '  ' + (fs.statSync(dst).size / 1024).toFixed(1) + ' KB');
  }

  await browser.close();
  server.close();
  console.log(files.length + ' önizləmə şəkli → frontend/dossier-og/');
})();
