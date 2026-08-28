/* Bütün şablonları render edir: hər ton üçün tam ölçülü nümunələr + tona görə
   iki kontakt vərəqi (zarafat və xatirə). */
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT_DIR = path.join(__dirname, '..');
const ROOT = path.join(ROOT_DIR, 'frontend');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/index.html';
  const f = path.join(ROOT, p);
  if (!f.startsWith(ROOT) || !fs.existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'text/plain' });
  fs.createReadStream(f).pipe(res);
});

(async () => {
  await new Promise(r => server.listen(4199, r));
  const b = await chromium.launch();
  const page = await b.newPage({ viewport: { width: 900, height: 1300 }, deviceScaleFactor: 1.6 });
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  await page.goto('http://localhost:4199/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(700);

  const mk = (tplId, paid, verified, layoutOverride) => page.evaluate(([id, paid, verified, layoutOverride]) => {
    const t = TEMPLATES.find(x => x.id === id);
    const to = 'Günel Şəkərova', from = 'Elvin Məmmədov';
    const doc = {
      templateId: t.id, tone: t.tone, layout: layoutOverride || t.layout, palette: t.palette,
      toLabel: t.toLabel || null, fromLabel: t.fromLabel || null,
      powersLabel: t.powersLabel || null, penaltyLabel: t.penaltyLabel || null,
      title: t.title, to, from, powers: t.powers, penalty: t.penalty,
      preamble: t.preamble.replace(/\{to\}/g, to).replace(/\{from\}/g, from),
      regNo: 'ZRF-2026-' + (1000 + (t.title.length * 137) % 9000),
      date: '26.08.2026', paid: paid,
      verifyUrl: 'https://zarafat.az/r/ZRF-2026-' + (1000 + (t.title.length * 137) % 9000)
    };
    return DOCGEN.a4(doc, { idPrefix: 'x' + id.replace(/[^a-z0-9]/gi, ''), verified: verified });
  }, [tplId, paid, verified, layoutOverride]);

  const outDir = path.join(ROOT_DIR, 'tools', 'render');
  fs.rmSync(outDir, { recursive: true, force: true }); fs.mkdirSync(outDir, { recursive: true });

  const layouts = await page.evaluate(() => DOCGEN.LAYOUTS);
  const tones = await page.evaluate(() => DOCGEN.TONES);
  const tpls = await page.evaluate(() => TEMPLATES.map(t =>
    ({ id: t.id, tone: t.tone, layout: t.layout, palette: t.palette, title: t.title })));

  // 1) hər ton × hər layout üçün bir tam ölçülü nümunə (ödənişli)
  for (const tone of tones) {
    const pool = tpls.filter(t => t.tone === tone);
    for (const L of layouts) {
      const t = pool.find(x => x.layout === L) || pool[0];   // hələ şablonu olmayan yeni dizayn
      const svg = await mk(t.id, true, false, L);
      await page.setContent('<body style="margin:0;width:794px">' + svg + '</body>');
      await page.setViewportSize({ width: 794, height: 1123 });
      await page.screenshot({ path: `${outDir}/full-${tone}-${L}.png` });
    }
  }

  // 2) kontakt vərəqi: hər ton üçün ayrıca, bütün şablonlar kiçik ölçüdə
  for (const tone of tones) {
    const pool = tpls.filter(t => t.tone === tone);
    const all = [];
    for (const t of pool) all.push(await mk(t.id, true, false));
    const grid = all.map((svg, i) =>
      `<div style="width:198px"><div style="border:1px solid #ccc;overflow:hidden">${svg.replace('width="794" height="1123"', 'width="198" height="280"')}</div>` +
      `<div style="font:10px/1.3 Arial;padding:3px 0 8px">${i + 1}. ${pool[i].title} <span style="color:#888">· ${pool[i].layout}/${pool[i].palette}</span></div></div>`).join('');
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.setContent(`<body style="margin:0;background:#fff;padding:14px"><div style="display:flex;flex-wrap:wrap;gap:12px">${grid}</div></body>`);
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${outDir}/contact-sheet-${tone}.png`, fullPage: true });
  }

  console.log('Render edildi:', tones.length * layouts.length, 'tam +', tpls.length, 'kiçik');
  console.log('Xətalar:', errs.length ? errs : 'yoxdur');
  await b.close(); server.close();
})();
