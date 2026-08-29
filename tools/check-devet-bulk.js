/* Toplu dəvətnamə və sahibin lövhəsi — uçdan-uca.
   `npm run test:devet-bulk` — İŞLƏYƏN backend tələb edir:
       php artisan serve --port=8099 */
'use strict';
const { chromium } = require('playwright');
const fs = require('fs'), os = require('os'), path = require('path');
const { execFileSync } = require('child_process');

const BASE = (process.argv[2] || process.env.DEVET_BASE || 'http://127.0.0.1:8099').replace(/\/$/, '');

/* Linkin bazası `config('devet.public_url')`-dandır, yəni yerləşdirmə
   parametridir — test onu yoxlamır, sadəcə yol hissəsini işlədir.
   (Ayrı domenə keçid də məhz buna görə bir .env sətridir.) */
const yerli = u => BASE + (u || '').replace(/^https?:\/\/[^/]+/, '');

let pass = 0, fail = 0;
const check = (n, c, x) => c ? (pass++, console.log('  ✓', n))
                             : (fail++, console.log('  ✗', n, x === undefined ? '' : JSON.stringify(x).slice(0, 300)));
const bas = t => console.log('\n' + t);

const ADLAR = ['Rəşad müəllim', 'Aygün xanım', 'Şəhla Əliyeva', 'İlqar Hüseynov', 'Nərmin & Elçin'];

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1280, height: 1000 }, acceptDownloads: true });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));

  bas('1. Dəvətnamə hazırlanır və dərc olunur');
  await page.goto(BASE + '/devetname', { waitUntil: 'networkidle' });
  await page.evaluate(() => window.DAVET.ready());
  await page.waitForTimeout(400);
  await page.click('.tedbir[data-event="nisan"]');
  await page.waitForTimeout(300);
  await page.fill('#fHosts', 'Nərmin & Elvin');
  await page.fill('#fDate', '2026-10-11');
  await page.fill('#fTime', '17:30');
  await page.fill('#fVenue', 'Zəfər Restoranı');
  await page.fill('#fAddress', 'Bakı, Xaqani küç. 8');
  await page.waitForTimeout(400);
  await page.click('#btnDerc');
  await page.waitForTimeout(1500);
  if (await page.$eval('#odenisModal', e => !e.hidden)) {
    await page.click('.paket[data-pack="p10"]');
    await page.waitForTimeout(4500);
  }
  const link = await page.$eval('#linkSahe', e => e.value);
  const token = (link.match(/\/d\/([A-Za-z0-9]{22})/) || [])[1];
  check('dəvətnamə dərc olundu', !!token, link);

  bas('2. Sahibin lövhəsi');
  const lovhe = await page.goto(BASE + '/devetnamelerim/' + token, { waitUntil: 'networkidle' });
  check('lövhə 200 qaytarır', lovhe.status() === 200, lovhe.status());
  check('lövhə noindex-dir', /noindex/.test(lovhe.headers()['x-robots-tag'] || ''));
  await page.waitForTimeout(900);
  check('lövhədə JS xətası yoxdur', errs.length === 0, errs);

  /* Alıcının öz səhifəsində də kənar məhsulun adı görünməməlidir. */
  const metn = (await page.evaluate(() => document.body.innerText + ' ' + document.title)).toLowerCase()
    .replace(/ə/g, 'e').replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ş/g, 's')
    .replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/ç/g, 'c');
  for (const w of ['zarafat', 'notariat', 'reyestr', 'parodiya']) {
    check('lövhədə «' + w + '» yoxdur', metn.indexOf(w) < 0);
  }
  const assetler = await page.evaluate(() =>
    Array.from(document.querySelectorAll('script[src],link[href]'))
      .map(e => e.src || e.href).filter(u => u.indexOf('data:') !== 0)
      .map(u => u.replace(location.origin, '')));
  check('yalnız dəvətnamə assetləri yüklənir',
    assetler.every(u => /devet|invite|export|zip/.test(u)), assetler);

  bas('3. Qonaq siyahısı');
  await page.fill('#qonaqMetn', ADLAR.join('\n') + '\n\n' + ADLAR[0]);   // boş sətir + təkrar
  await page.click('#siyahiYaz');
  await page.waitForTimeout(2000);
  const setirler = await page.$$eval('#qonaqCedvel tbody tr', rs =>
    rs.map(r => Array.from(r.children).map(c => c.textContent.trim())));
  check('5 qonaq yarandı (boş sətir və təkrar atıldı)', setirler.length === 5, setirler.length);
  check('adlar sıra ilə düzülüb',
    setirler.map(r => r[0]).join('|') === ADLAR.join('|'), setirler.map(r => r[0]));
  check('hər qonağın öz linki var',
    setirler.every(r => /\/d\/[A-Za-z0-9]{22}\/q\/[A-Za-z0-9]{22}$/.test(r[4])), setirler[0] && setirler[0][4]);
  check('linklər bir-birindən fərqlidir',
    new Set(setirler.map(r => r[4])).size === 5);
  check('hamısı cavabsızdır', setirler.every(r => r[1] === 'Cavabsız'));

  bas('4. Adlı link qonağın adını göstərir');
  const qonaqLink = setirler[0][4];
  const q = await ctx.newPage();
  const qerrs = [];
  q.on('pageerror', e => qerrs.push(e.message));
  await q.goto(yerli(qonaqLink), { waitUntil: 'networkidle' });
  await q.waitForTimeout(1200);
  check('adlı səhifə açılır', (await q.$eval('#kart', c => c.width)) > 100);
  check('adlı səhifədə JS xətası yoxdur', qerrs.length === 0, qerrs);
  check('başlıqda qonağın adı var',
    (await q.$eval('#cavabBasliq', e => e.textContent)).indexOf('Rəşad müəllim') === 0,
    await q.$eval('#cavabBasliq', e => e.textContent));
  check('adlı linkdə ad soruşulmur', !(await q.$eval('#adSahe', e => !!e.offsetParent)));

  await q.click('.secim[data-rsvp="gelirem"]');
  await q.fill('#cNefer', '2');
  await q.click('#cGonder');
  await q.waitForTimeout(1500);

  /* Səhifə yenidən açılanda cavab yadda qalmalıdır — qonaq fikrini
     dəyişə bilməlidir. */
  await q.reload({ waitUntil: 'networkidle' });
  await q.waitForTimeout(1200);
  check('cavab yadda qalır',
    await q.$eval('.secim[data-rsvp="gelirem"]', e => e.getAttribute('aria-pressed') === 'true'));

  bas('5. Cavab lövhəyə düşür');
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  const yekun = await page.$$eval('.yekun dd', ds => ds.map(d => d.textContent.trim()));
  check('gələn sayı 1', yekun[0] === '1', yekun);
  check('nəfər sayı 2', yekun[1] === '2', yekun);
  check('cavabsız 4', yekun[4] === '4', yekun);

  bas('6. ZIP arxivi');
  const [zip] = await Promise.all([
    page.waitForEvent('download', { timeout: 90000 }),
    page.click('#zipYukle')
  ]);
  const zipYol = path.join(os.tmpdir(), 'devet-test.zip');
  await zip.saveAs(zipYol);
  check('arxiv adı düzgündür', /-qonaqlar\.zip$/.test(zip.suggestedFilename()), zip.suggestedFilename());
  check('arxiv boş deyil', fs.statSync(zipYol).size > 50000, fs.statSync(zipYol).size);

  /* Arxivin quruluşunu sistemin öz `unzip`-i oxuyur — əl ilə yazılmış
     yazarın mərkəzi kataloqu doğrudan da etibarlıdır. */
  let siyahi = '';
  try { siyahi = execFileSync('unzip', ['-l', zipYol], { encoding: 'utf8' }); }
  catch (e) { siyahi = 'unzip alınmadı'; }
  check('unzip arxivi oxuyur', siyahi.indexOf('5 files') > 0, siyahi.split('\n').slice(-4).join(' '));
  check('fayl adları ASCII-dir və nömrələnib',
    /001-Resad-muellim\.png/.test(siyahi) && /005-Nermin-Elcin\.png/.test(siyahi),
    siyahi.split('\n').filter(l => /png/.test(l)).join(' | '));
  try {
    execFileSync('unzip', ['-t', zipYol], { encoding: 'utf8' });
    check('unzip -t bütövlüyü təsdiqləyir', true);
  } catch (e) { check('unzip -t bütövlüyü təsdiqləyir', false, String(e.message).slice(0, 200)); }
  fs.unlinkSync(zipYol);

  bas('7. CSV');
  const csv = await ctx.request.get(BASE + '/devetnamelerim/' + token + '/cedvel.csv');
  const csvMetn = await csv.text();
  check('CSV verilir', csv.status() === 200, csv.status());
  check('CSV UTF-8 BOM ilə başlayır', csvMetn.charCodeAt(0) === 0xFEFF);
  check('CSV-də bütün qonaqlar var', ADLAR.every(a => csvMetn.indexOf(a) > 0));
  check('CSV-də cavab yazılıb', csvMetn.indexOf('Gəlir') > 0);

  bas('8. Məxfilik');
  const yad = await b.newContext();
  const yadLovhe = await yad.request.get(BASE + '/devetnamelerim/' + token);
  check('yad adam lövhəni görmür (404)', yadLovhe.status() === 404, yadLovhe.status());
  const yadCsv = await yad.request.get(BASE + '/devetnamelerim/' + token + '/cedvel.csv');
  check('yad adam CSV-ni endirə bilmir', yadCsv.status() === 404, yadCsv.status());
  await yad.close();

  console.log('\n' + pass + ' keçdi, ' + fail + ' uğursuz');
  await b.close();
  process.exit(fail ? 1 : 0);
})();
