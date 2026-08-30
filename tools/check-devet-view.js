/* Dəvətnamənin uçdan-uca yoxlaması: dərc → paylaşım linki → önizləmə şəkli
   → qonaq səhifəsi → cavab → sahibin lövhəsi.

   `npm run test:devet-view` — İŞLƏYƏN backend tələb edir:
       php artisan serve --port=8099
   Ünvanı dəyişmək üçün: node tools/check-devet-view.js http://127.0.0.1:8000 */
'use strict';
const { chromium } = require('playwright');

const BASE = (process.argv[2] || process.env.DEVET_BASE || 'http://127.0.0.1:8099').replace(/\/$/, '');

/* Linkin bazası `config('devet.public_url')`-dandır, yəni yerləşdirmə
   parametridir — test onu yoxlamır, sadəcə yol hissəsini işlədir.
   (Ayrı domenə keçid də məhz buna görə bir .env sətridir.) */
const yerli = u => BASE + (u || '').replace(/^https?:\/\/[^/]+/, '');

let pass = 0, fail = 0;
const check = (n, c, x) => c ? (pass++, console.log('  ✓', n))
                             : (fail++, console.log('  ✗', n, x === undefined ? '' : JSON.stringify(x).slice(0, 300)));
const bas = t => console.log('\n' + t);

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1280, height: 1000 } });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  page.on('console', m => { if (m.type() === 'error' && !/favicon/.test(m.text())) errs.push(m.text()); });

  bas('1. Redaktor açılır');
  const r = await page.goto(BASE + '/devetname', { waitUntil: 'networkidle' });
  check('/devetname 200 qaytarır', r.status() === 200, r.status());
  check('X-Robots-Tag noindex', /noindex/.test(r.headers()['x-robots-tag'] || ''), r.headers()['x-robots-tag']);
  await page.evaluate(() => window.DAVET.ready());
  await page.waitForTimeout(500);
  check('paylaşma bölməsi görünür (server tanınıb)', await page.$eval('#paylas', e => !e.hidden));
  check('JS xətası yoxdur', errs.length === 0, errs);

  bas('2. Forma doldurulur');
  await page.click('.tedbir[data-event="toy"]');
  await page.fill('#fHosts', 'Aygün & Rəşad');
  await page.fill('#fTitle', 'Toy şənliyimizə dəvətlisiniz');
  await page.fill('#fDate', '2026-09-19');
  await page.fill('#fTime', '18:00');
  await page.fill('#fVenue', 'Gülüstan Şadlıq Sarayı');
  await page.fill('#fAddress', 'Bakı, Nizami küç. 12');
  await page.fill('#fPhone', '+994 50 123 45 67');
  await page.fill('#fNote', 'Təşrifinizi gözləyirik');
  await page.waitForTimeout(400);
  check('önizləmə çəkilib', (await page.$eval('#onizleme', c => c.width)) > 100);

  bas('3. Dərc — kredit yoxdursa ödəniş pəncərəsi açılır');
  await page.click('#btnDerc');
  await page.waitForTimeout(1500);
  const modalAcildi = await page.$eval('#odenisModal', e => !e.hidden);
  check('kreditsiz dərc ödəniş pəncərəsi açır', modalAcildi === true);

  if (modalAcildi) {
    check('yetərsiz paket söndürülüb', await page.$eval('.paket[data-pack="p3"]', e => e.disabled));
    check('yetərli paket açıqdır', !(await page.$eval('.paket[data-pack="p10"]', e => e.disabled)));
    check('lazım olan kredit yazılıb',
      /5 kredit lazımdır/.test(await page.$eval('#odenisQeyd', e => e.textContent)),
      await page.$eval('#odenisQeyd', e => e.textContent));
    await page.click('.paket[data-pack="p10"]');
    await page.waitForTimeout(4500);
  }

  const link = await page.$eval('#linkSahe', e => e.value);
  check('paylaşım linki yarandı', /\/d\/[A-Za-z0-9]{22}$/.test(link), link);
  check('linkdə kənar brend sözü yoxdur', link.toLowerCase().indexOf('zarafat') < 0, link);
  check('WhatsApp düyməsi hazırdır', /^https:\/\/wa\.me\//.test(await page.$eval('#btnWa', e => e.href)));

  const token = (link.match(/\/d\/([A-Za-z0-9]{22})/) || [])[1];
  check('token 22 simvoldur', !!token && token.length === 22, token);

  bas('4. Sosial önizləmə — ünvan və telefon SIZMAMALIDIR');
  await page.waitForTimeout(2500);   /* şəkil yüklənməsi arxa fonda gedir */
  const html = await (await ctx.request.get(yerli(link))).text();
  const og = k => (html.match(new RegExp('property="og:' + k + '" content="([^"]*)"')) || [])[1] || '';
  check('og:title dolu', og('title').length > 0, og('title'));
  check('og:image var', /\/on\.jpg$/.test(og('image')), og('image'));
  check('og:image ölçüsü elan olunub', html.indexOf('og:image:width" content="1200"') > 0);
  check('ÜNVAN server HTML-ində yoxdur', html.indexOf('Nizami küç') < 0);
  check('TELEFON server HTML-ində yoxdur', html.indexOf('123 45 67') < 0);
  check('og:description-da ünvan yoxdur', og('description').indexOf('Nizami') < 0, og('description'));
  check('səhifə noindex-dir', /noindex/.test(html));
  check('server HTML-ində kənar brend adı yoxdur', html.toLowerCase().indexOf('zarafat') < 0);

  const sekil = await ctx.request.get(BASE + '/d/' + token + '/on.jpg');
  check('önizləmə şəkli verilir', sekil.status() === 200, sekil.status());
  check('şəkil image/jpeg-dir', (sekil.headers()['content-type'] || '').indexOf('image/jpeg') === 0,
    sekil.headers()['content-type']);
  check('nosniff başlığı var', (sekil.headers()['x-content-type-options'] || '') === 'nosniff');
  check('şəkil boş deyil', (await sekil.body()).length > 5000);

  bas('5. Qonaq səhifəsi');
  const qonaq = await ctx.newPage();
  const qerrs = [];
  qonaq.on('pageerror', e => qerrs.push(e.message));
  await qonaq.goto(yerli(link), { waitUntil: 'networkidle' });
  await qonaq.waitForTimeout(1200);
  check('dəvətnamə kartı çəkilir', (await qonaq.$eval('#kart', c => c.width)) > 100);
  /* `hidden` atributuna baxmaq azdır — sinifdəki `display` onu üstələyə bilir,
     ona görə elementin REAL ölçüsü yoxlanılır. */
  const gorunur = sel => qonaq.$eval(sel, e => !!e.offsetParent && e.getBoundingClientRect().height > 0);
  check('yüklənmə halı gizlənib', !(await gorunur('#hal')));
  check('qonaq səhifəsində JS xətası yoxdur', qerrs.length === 0, qerrs);

  const gorunen = await qonaq.evaluate(() => document.body.innerText);
  check('ünvan qonağa GÖRÜNÜR', gorunen.indexOf('Nizami küç') > 0);
  check('telefon qonağa GÖRÜNÜR', gorunen.indexOf('123 45 67') > 0);
  check('xəritə düyməsi görünür', await gorunur('#xerite'));
  const xeriteLink = await qonaq.$eval('#xerite', e => e.href);
  check('xəritə linki google.com/maps-ədir', xeriteLink.indexOf('https://www.google.com/maps/search/') === 0, xeriteLink);
  check('zəng düyməsi görünür', await gorunur('#zeng'));
  check('cavab bloku görünür', await gorunur('#cavabBlok'));
  check('cavab detalları hələ gizlidir', !(await gorunur('#cavabDetal')));

  bas('6. Qonaq cavab verir');
  await qonaq.click('.secim[data-rsvp="gelirem"]');
  await qonaq.waitForTimeout(250);
  check('«neçə nəfər» sahəsi açılır', await gorunur('#neferSahe'));
  check('ad sahəsi ümumi linkdə soruşulur', await gorunur('#adSahe'));
  await qonaq.fill('#cAd', 'Nərmin Əliyeva');
  await qonaq.fill('#cNefer', '3');
  await qonaq.fill('#cQeyd', 'Bir az gecikə bilərəm');
  await qonaq.click('#cGonder');
  await qonaq.waitForTimeout(1600);
  check('cavab qeydə alındı',
    (await qonaq.$eval('#cavabHal', e => e.textContent)).indexOf('göndərildi') > 0,
    await qonaq.$eval('#cavabHal', e => e.textContent));

  bas('7. Sahibin lövhəsi');
  const lovhe = await (await ctx.request.get(BASE + '/api/devet/' + token + '/qonaqlar')).json();
  check('cavab lövhədə görünür', (lovhe.guests || []).length === 1, lovhe);
  check('ad düzgündür', (lovhe.guests || [])[0] && lovhe.guests[0].name === 'Nərmin Əliyeva');
  check('gələn sayı 1', lovhe.yekun && lovhe.yekun.gelirem === 1, lovhe.yekun);
  check('nəfər sayı 3', lovhe.yekun && lovhe.yekun.nefer === 3, lovhe.yekun);

  bas('8. Məxfilik sərhədləri');
  const yad = await b.newContext();   /* başqa ziyarətçi — öz cookie-si */
  const yadLovhe = await yad.request.get(BASE + '/api/devet/' + token + '/qonaqlar');
  check('yad adam qonaq siyahısını görmür', yadLovhe.status() === 404, yadLovhe.status());
  const yoxToken = await yad.request.get(BASE + '/api/devet/' + 'a'.repeat(22));
  check('naməlum token 404', yoxToken.status() === 404, yoxToken.status());
  const qisaToken = await yad.request.get(BASE + '/d/qisa');
  check('qısa token marşrutu tutmur', qisaToken.status() === 404, qisaToken.status());
  const robots = await yad.request.get(BASE + '/robots.txt');
  check('robots.txt /d/ yolunu bağlayır', (await robots.text()).indexOf('Disallow: /d/') > 0);
  await yad.close();

  console.log('\n' + pass + ' keçdi, ' + fail + ' uğursuz');
  await b.close();
  process.exit(fail ? 1 : 0);
})();
