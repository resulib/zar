/* Baxış səhifəsi (/r/{regNo}): yalnız sənəd görünür, zolaq işləyir,
   PDF quruluşu düzgündür, çapda zolaq gizlənir.

   Backend lazım deyil — `/api/registry/*` sorğuları nümunə JSON ilə cavablanır.
   İşlətmək:  node tools/check-viewer.js */
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');

const ROOT = path.join(__dirname, '..', 'frontend');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2' };

const BASE_DOC = {
  regNo: 'ZRF-2026-9482', templateId: 'weekend-pass', layout: 'notarial', palette: 'gold',
  tone: 'zarafat', title: 'Həftəsonu Çölə Çıxma Etibarnaməsi',
  to: 'Günel Şəkərova', from: 'Elvin Məmmədov',
  preamble: 'Bu etibarnamə ilə təsdiq olunur ki, Elvin Məmmədov tərəfindən Günel Şəkərova adlı şəxsə səlahiyyət verilmişdir.',
  powers: 'Birinci bənd.\nİkinci bənd.\nÜçüncü bənd.\nDördüncü bənd.',
  penalty: 'Şərtlərin pozulması halında qab-qacaq yumaq öhdəliyi yaranır.',
  date: '26.08.2026', paid: true, state: 'active',
  verifyUrl: 'http://localhost:4231/r/ZRF-2026-9482'
};

/* Nömrəyə görə nümunə seçilir */
function fixture(reg) {
  if (reg === 'ZRF-2026-0000') return null;                                   // 404
  if (reg === 'ZRF-2026-1111') return Object.assign({}, BASE_DOC, { regNo: reg, state: 'expired' });
  if (reg === 'ZRF-2026-2222') return Object.assign({}, BASE_DOC, {
    regNo: reg, state: 'cancelled', cancelReason: 'Cavabsız zəng' });
  /* Cavab sənədi: valideynə istinad + zəncirdə ikinci sətir */
  if (reg === 'RDD-2026-3333') return Object.assign({}, BASE_DOC, {
    regNo: reg, templateId: 'r-redd-couples', layout: 'qerar', palette: 'burgundy',
    title: 'Gecikmə Bəhanəsinin Rədd Edilməsi Qərarı',
    replyTo: 'ZRF-2026-9482', replyToTitle: 'Həftəsonu Çölə Çıxma Etibarnaməsi', replyDepth: 1 });
  return Object.assign({}, BASE_DOC, { regNo: reg, replyCount: reg === 'ZRF-2026-9482' ? 1 : 0 });
}

/* `/api/registry/{reg}/zencir` — yalnız iki nömrə üçün zəncir qaytarılır */
const CHAIN = {
  'ZRF-2026-9482': 0, 'RDD-2026-3333': 1
};
function chainFixture(reg) {
  if (!(reg in CHAIN)) return { count: 0, items: [] };
  const items = [
    { regNo: 'ZRF-2026-9482', title: 'Həftəsonu Çölə Çıxma Etibarnaməsi', date: '26.08.2026',
      depth: 0, state: 'active', kind: null, kindLabel: '', current: reg === 'ZRF-2026-9482' },
    { regNo: 'RDD-2026-3333', title: 'Gecikmə Bəhanəsinin Rədd Edilməsi Qərarı', date: '29.08.2026',
      depth: 1, state: 'active', kind: 'redd', kindLabel: 'Rədd', current: reg === 'RDD-2026-3333' }
  ];
  return { count: items.length, items };
}

const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);

  const chain = url.match(/^\/api\/registry\/(.+)\/zencir$/);
  if (chain) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(chainFixture(chain[1].toUpperCase())));
  }
  /* Ölçmə endpoint-i: baxış səhifəsi onu «unut və davam et» kimi çağırır. */
  if (url === '/api/olcu') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end('{"ok":true}');
  }

  const api = url.match(/^\/api\/registry\/(.+)$/);
  if (api) {
    const d = fixture(api[1].toUpperCase());
    res.writeHead(d ? 200 : 404, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(d || { error: 'not_found' }));
  }
  if (/^\/r\//.test(url)) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    return res.end(fs.readFileSync(path.join(ROOT, 'viewer.html')));
  }

  const f = path.join(ROOT, url === '/' ? '/index.html' : url);
  if (!f.startsWith(ROOT) || !fs.existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'text/plain' });
  fs.createReadStream(f).pipe(res);
});

let pass = 0, fail = 0;
const check = (n, c, x) => c ? (pass++, console.log('  ✓', n))
                             : (fail++, console.log('  ✗', n, x === undefined ? '' : JSON.stringify(x)));

(async () => {
  await new Promise(r => server.listen(4231, r));
  const b = await chromium.launch();
  const page = await b.newPage({ viewport: { width: 1100, height: 1200 } });
  const errs = [], reqs = [];
  page.on('pageerror', e => errs.push(e.message));
  page.on('request', q => reqs.push(q.url()));

  console.log('\n1. Aktiv sənəd');
  await page.goto('http://localhost:4231/r/ZRF-2026-9482', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1200);

  const n = await page.$eval('#doc svg', e => e.querySelectorAll('text,rect,path').length);
  check('sənəd render olunur (' + n + ' element)', n > 60, n);

  const svg = await page.$eval('#doc', e => e.innerHTML);
  check('su nişanı markeri var', svg.indexOf('data-wm=') >= 0);
  check('disclaimer markeri var', svg.indexOf('data-dc=') >= 0);
  check('hüquqi qalxan mətni var',
    (await page.$eval('#doc', e => e.textContent)).indexOf('HÜQUQİ QÜVVƏYƏ MALİK DEYİL') >= 0);

  const chrome = await page.evaluate(() =>
    document.querySelectorAll('.gov-bar, .masthead, footer, #reyestr, #yarat, .hero, .act-grid').length);
  check('səhifədə başqa heç nə yoxdur', chrome === 0, chrome);

  const bad = reqs.filter(u => /templates(-xatire)?\.js|\/app\.js|site\.css|panel\.css/.test(u));
  check('artıq asset yüklənmir', bad.length === 0, bad.map(u => u.split('/').pop()));

  check('zolaqda 6 düymə var', (await page.$$eval('#vwBar button', b => b.length)) === 6);
  check('şikayət düyməsi var', (await page.$eval('#vwRep', e => e.textContent)).indexOf('Şikayət') >= 0);
  check('cavab düyməsi var', (await page.$eval('#vwReply', e => e.textContent)).indexOf('Cavab') >= 0);
  check('banner aktiv sənəddə gizlidir', await page.$eval('#vwBanner', e => e.hidden));
  check('adi sənəddə cavab istinadı yoxdur', await page.$eval('#vwReplyRef', e => e.hidden));

  console.log('\n1b. Cavab qatı');
  await page.click('#vwReply');
  check('cavab modalı açılır', await page.$eval('#vwReplyModal', e => e.classList.contains('open')));
  check('5 niyyət kartı var', (await page.$$eval('#vwReplyCards .vw-reply-card', b => b.length)) === 5);
  check('modalda sənədin nömrəsi var',
    (await page.$eval('#vwReplyReg', e => e.textContent)) === 'ZRF-2026-9482');
  await page.keyboard.press('Escape');
  check('Escape modalı bağlayır', !(await page.$eval('#vwReplyModal', e => e.classList.contains('open'))));

  /* Zəncir asinxron yüklənir — göründüyünü gözləyirik. */
  await page.waitForSelector('#vwChain:not([hidden])', { timeout: 4000 });
  check('zəncirdə 2 sətir var', (await page.$$eval('#vwChain li', e => e.length)) === 2);
  check('cavab sayı göstərilir',
    (await page.$eval('#vwChain p', e => e.textContent)).indexOf('1') >= 0);
  check('cari sənəd vurğulanır',
    (await page.$$eval('#vwChain li.here', e => e.length)) === 1);
  check('cavab çağırışı görünür', !(await page.$eval('#vwCta', e => e.hidden)));

  /* Cavab sənədinin öz səhifəsi: künc lenti + valideynə kliklənən istinad */
  const rp = await b.newPage();
  await rp.goto('http://localhost:4231/r/RDD-2026-3333', { waitUntil: 'domcontentloaded' });
  await rp.waitForTimeout(1200);
  check('cavab sənədində istinad zolağı var', !(await rp.$eval('#vwReplyRef', e => e.hidden)));
  check('istinad valideynə keçid verir',
    (await rp.$eval('#vwReplyRef a', e => e.getAttribute('href'))) === '/r/ZRF-2026-9482');
  const rpSvg = await rp.$eval('#doc', e => e.innerHTML);
  check('vərəqdə cavab lenti var', rpSvg.indexOf('data-rp=') >= 0);
  check('lentdə orijinalın nömrəsi var', rpSvg.indexOf('ZRF-2026-9482') >= 0);
  await rp.close();

  console.log('\n2. Çap görünüşü');
  await page.emulateMedia({ media: 'print' });
  check('çapda zolaq gizlənir',
    (await page.$eval('#vwBar', e => getComputedStyle(e).display)) === 'none');
  check('çapda sənəd qalır',
    (await page.$eval('#doc', e => getComputedStyle(e).display)) !== 'none');
  await page.emulateMedia({ media: 'screen' });

  console.log('\n3. PDF quruluşu');
  const r = await page.evaluate(async () => {
    const blob = await ZEXPORT.pdfBlob(DOCGEN.a4({
      layout: 'notarial', palette: 'gold', tone: 'zarafat', title: 'T', to: 'A B', from: 'C D',
      preamble: 'P', powers: 'a\nb\nc\nd', penalty: 'x', regNo: 'ZRF-2026-9482',
      date: '26.08.2026', paid: true, verifyUrl: 'u'
    }, { idPrefix: 'ex' }), DOCGEN.W, DOCGEN.H, 2, 'ZRF-2026-9482');
    const buf = new Uint8Array(await blob.arrayBuffer());
    let s = ''; for (let i = 0; i < buf.length; i++) s += String.fromCharCode(buf[i]);
    return { type: blob.type, s: s, size: buf.length };
  });
  check('MIME application/pdf', r.type === 'application/pdf', r.type);
  check('%PDF- ilə başlayır', r.s.slice(0, 5) === '%PDF-');
  check('%%EOF ilə bitir', r.s.slice(-5) === '%%EOF');
  check('DCTDecode və DeviceRGB var', r.s.indexOf('/DCTDecode') > 0 && r.s.indexOf('/ColorSpace/DeviceRGB') > 0);
  check('MediaBox A4-dür', r.s.indexOf('/MediaBox[0 0 595.28 841.89]') > 0);

  const sx = r.s.lastIndexOf('startxref');
  const xrefAt = parseInt(r.s.slice(sx + 9).trim(), 10);
  check('startxref «xref» sözünə düşür', r.s.slice(xrefAt, xrefAt + 4) === 'xref', r.s.slice(xrefAt, xrefAt + 10));
  const rows = r.s.slice(xrefAt).split('\n').slice(3, 9);
  const ok5 = r.s.slice(parseInt(rows[4].slice(0, 10), 10), parseInt(rows[4].slice(0, 10), 10) + 7);
  check('xref şəkil obyektinə düşür', ok5 === '5 0 obj', ok5);
  check('xref sətirləri 20 baytdır', rows.every(x => x.length === 19));

  console.log('\n4. Müddəti bitmiş və ləğv edilmiş');
  await page.goto('http://localhost:4231/r/ZRF-2026-1111', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(900);
  check('müddəti bitmiş sənəd render olunur', (await page.$$eval('#doc svg', e => e.length)) === 1);
  check('müddət banneri çıxır',
    (await page.$eval('#vwBanner', e => e.textContent)).indexOf('müddəti bitib') >= 0);

  await page.goto('http://localhost:4231/r/ZRF-2026-2222', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(900);
  check('ləğv edilmiş sənəd render olunur', (await page.$$eval('#doc svg', e => e.length)) === 1);
  check('ləğv səbəbi bannerdə var',
    (await page.$eval('#vwBanner', e => e.textContent)).indexOf('Cavabsız zəng') >= 0);

  console.log('\n5. Reyestrdə olmayan nömrə');
  await page.goto('http://localhost:4231/r/ZRF-2026-0000', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(900);
  check('sənəd göstərilmir', (await page.$$eval('#doc svg', e => e.length)) === 0);
  check('zolaq gizlidir', await page.$eval('#vwBar', e => e.hidden));
  check('sərt mətn olduğu kimi qalır',
    (await page.$eval('#vwState', e => e.textContent))
      .indexOf('Reyestrdə olmayan sənəd bu qurumun verdiyi sənəd sayılmır.') >= 0);

  console.log('\n6. Mətn sinxronu (brauzersiz)');
  const STERN = 'Reyestrdə olmayan sənəd bu qurumun verdiyi sənəd sayılmır.';
  const appJs = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');
  const vwJs  = fs.readFileSync(path.join(ROOT, 'viewer.js'), 'utf8');
  check('sərt mətn hər iki faylda eynidir', appJs.indexOf(STERN) >= 0 && vwJs.indexOf(STERN) >= 0);

  check('brauzer xətası yoxdur', errs.length === 0, errs);
  console.log('\n' + pass + ' keçdi, ' + fail + ' uğursuz');
  await b.close(); server.close();
  process.exit(fail ? 1 : 0);
})();
