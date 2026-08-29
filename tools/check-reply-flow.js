/* Cavab rejimi — SPA redaktorunun `/?cavab=REG&tip=KIND` axını.
   İşlətmək: node tools/check-reply-flow.js   (npm run test:reply-flow)

   Backend lazım deyil: `/api/*` sorğuları nümunə JSON ilə cavablanır və
   `/api/catalog` qəsdən 404 verir — beləcə statik `replies.js` ehtiyat
   budağı da yoxlanılmış olur.

   `check-viewer.js` /r/ səhifəsindəki modalı, bu isə modaldan sonrakı
   redaktoru yoxlayır — ikisi birlikdə bütün cavab axınını əhatə edir. */
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', 'frontend');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2' };

const ORIG = {
  regNo: 'ZRF-2026-9482', templateId: 'remote-control', layout: 'sertifikat', palette: 'steel',
  tone: 'zarafat', title: 'Pult Üzərində Müstəsna Nəzarət Sertifikatı',
  to: 'Nurlan Əliyev', from: 'Rəşad Quliyev',
  preamble: 'Bu sertifikat Nurlan Əliyev adlı şəxsin televizor pultu üzərində müstəsna nəzarət hüququnu təsdiq edir.',
  powers: 'a\nb\nc\nd', penalty: 'x', date: '26.08.2026', paid: true, state: 'active',
  replyTo: null, replyTopic: null, replyDepth: 0, replyCount: 0,
  verifyUrl: 'http://localhost:4243/r/ZRF-2026-9482'
};

const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  if (url === '/api/health') { res.writeHead(200, {'Content-Type':'application/json'}); return res.end('{"ok":true,"provider":"simulation"}'); }
  if (url === '/api/me') { res.writeHead(200, {'Content-Type':'application/json'}); return res.end('{"credits":5}'); }
  if (url === '/api/me/documents') { res.writeHead(200, {'Content-Type':'application/json'}); return res.end('[]'); }
  if (url === '/api/catalog') { res.writeHead(404); return res.end(); }   // statik kataloqa düşsün
  if (url === '/api/olcu') { res.writeHead(200, {'Content-Type':'application/json'}); return res.end('{"ok":true}'); }
  if (/^\/api\/registry\//.test(url)) { res.writeHead(200, {'Content-Type':'application/json'}); return res.end(JSON.stringify(ORIG)); }
  const f = path.join(ROOT, url === '/' ? '/index.html' : url);
  if (!f.startsWith(ROOT) || !fs.existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'text/plain' });
  fs.createReadStream(f).pipe(res);
});

let pass = 0, fail = 0;
const check = (n, c, x) => c ? (pass++, console.log('  ✓', n))
                             : (fail++, console.log('  ✗', n, x === undefined ? '' : JSON.stringify(x)));

(async () => {
  await new Promise(r => server.listen(4243, r));
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1280, height: 1400 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));

  console.log('\n1. Cavab rejiminə giriş (tip=redd)');
  await p.goto('http://localhost:4243/?cavab=ZRF-2026-9482&tip=redd', { waitUntil: 'networkidle' });
  await p.waitForTimeout(900);

  check('cavab zolağı görünür', !(await p.$eval('#replyBar', e => e.hidden)));
  check('zolaqda orijinalın nömrəsi var',
    (await p.$eval('#replyBar', e => e.textContent)).indexOf('ZRF-2026-9482') >= 0);
  check('query URL-dən silinib', !(await p.evaluate(() => location.search)));

  const tabs = await p.$$eval('#tabs button', b => b.map(x => x.textContent.trim()));
  check('kateqoriya zolağı niyyətlərə çevrilib', tabs.length === 5, tabs);
  check('«Rədd et» niyyəti var', tabs.some(t => t.indexOf('Rədd et') >= 0), tabs);

  const tpl = await p.evaluate(() => document.querySelector('#cards button[aria-pressed="true"]')?.textContent || '');
  check('rədd şablonu seçilib', tpl.indexOf('Rədd') >= 0, tpl.slice(0, 60));
  check('kart kodu CVB prefiksi ilədir',
    (await p.$eval('#cards .code', e => e.textContent)).indexOf('CVB-') === 0);

  console.log('\n2. Avtomatik doldurma və önizləmə');
  check('«kimə» orijinaldan gəlir', (await p.$eval('#fTo', e => e.value)) === 'Nurlan Əliyev');
  check('«kimdən» orijinaldan gəlir', (await p.$eval('#fFrom', e => e.value)) === 'Rəşad Quliyev');
  const svg = await p.$eval('#preview', e => e.innerHTML);
  check('önizləmədə cavab lenti var', svg.indexOf('data-rp=') >= 0);
  check('lentdə orijinalın nömrəsi var', svg.indexOf('ZRF-2026-9482') >= 0);
  check('reyestr rozeti RDD prefiksi göstərir',
    (await p.$eval('#regBadge', e => e.textContent)).indexOf('RDD-') === 0);

  console.log('\n3. Niyyət dəyişmə və qura');
  await p.click('#tabs button:nth-child(4)');       // Ləğv et
  await p.waitForTimeout(200);
  const n = await p.$$eval('#cards button', b => b.length);
  check('ləğv niyyətində kartlar var', n > 0, n);
  await p.click('#cards button:first-child');
  await p.waitForTimeout(300);
  check('ləğv şablonu LGV prefiksi verir',
    (await p.$eval('#regBadge', e => e.textContent)).indexOf('LGV-') === 0);

  await p.click('#replyDice');
  await p.waitForTimeout(400);
  check('qura düyməsi şablon seçir',
    /^(RDD|ETZ|TKR|LGV|QVD)-/.test(await p.$eval('#regBadge', e => e.textContent)));

  console.log('\n4. Cavab rejimindən çıxış');
  await p.click('#replyExit');
  await p.waitForTimeout(400);
  check('zolaq gizlənir', await p.$eval('#replyBar', e => e.hidden));
  check('kateqoriyalar qayıdır', (await p.$$eval('#tabs button', b => b.length)) === 12);
  check('önizləmədə lent qalmır', (await p.$eval('#preview', e => e.innerHTML)).indexOf('data-rp=') < 0);
  check('adi prefiks qayıdır', (await p.$eval('#regBadge', e => e.textContent)).indexOf('ZRF-') === 0);

  console.log('\n5. Boş tip — bütün variantlar');
  await p.goto('http://localhost:4243/?cavab=ZRF-2026-9482', { waitUntil: 'networkidle' });
  await p.waitForTimeout(900);
  const all = await p.$$eval('#cards button', b => b.length);
  check('bütün uyğun cavablar göstərilir', all >= 5, all);

  check('brauzer xətası yoxdur', errs.length === 0, errs);
  console.log('\n' + pass + ' keçdi, ' + fail + ' uğursuz');
  await b.close(); server.close();
  process.exit(fail ? 1 : 0);
})();
