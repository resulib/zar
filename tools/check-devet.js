/* Dəvətnamə redaktoru — real brauzerdə uçdan-uca yoxlama.
   `npm run test:devet-flow`. Backend lazım deyil: statik fayl serveri qurulur.

   Node stubu bu iş üçün yaramır — canvas, şrift metrikaları və toBlob lazımdır. */
'use strict';
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');

const ROOT = path.join(__dirname, '..', 'frontend');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2' };
const PORT = 4288;

const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  const f = path.join(ROOT, url === '/' ? '/devet.html' : url);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'text/plain' });
  fs.createReadStream(f).pipe(res);
});

let pass = 0, fail = 0;
const check = (n, c, x) => c ? (pass++, console.log('  ✓', n))
                             : (fail++, console.log('  ✗', n, x === undefined ? '' : JSON.stringify(x)));
const bas = t => console.log('\n' + t);

(async () => {
  await new Promise(r => server.listen(PORT, r));
  const b = await chromium.launch();
  const page = await b.newPage({ viewport: { width: 1280, height: 1000 } });
  const errs = [], uğursuz = [];
  page.on('pageerror', e => errs.push(e.message));
  /* Bu yoxlamada backend yoxdur, ona görə /api/ sorğularının 404 verməsi
     GÖZLƏNİLƏNDİR — səhifə serversiz də işləməlidir. Şəbəkə səs-küyü
     süzülür, amma /api/ xaricindəki hər uğursuz sorğu xəta sayılır. */
  page.on('console', m => {
    if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errs.push(m.text());
  });
  page.on('response', r => {
    if (r.status() >= 400 && r.url().indexOf('/api/') < 0) uğursuz.push(r.status() + ' ' + r.url());
  });

  await page.goto('http://localhost:' + PORT + '/devet.html', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => window.DAVET.ready());
  await page.waitForTimeout(400);

  bas('1. Səhifə qurulur');
  check('JS xətası yoxdur', errs.length === 0, errs);
  check('bütün assetlər yüklənir', uğursuz.length === 0, uğursuz);
  /* Backend yoxdursa paylaşma bölməsi ümumiyyətlə göstərilmir — yükləmə
     isə serversiz işləməyə davam edir. */
  check('serversiz paylaşma bölməsi gizlidir', await page.$eval('#paylas', e => e.hidden));
  check('11 tədbir düyməsi', await page.$$eval('#tedbirler .tedbir', e => e.length) === 11);
  check('3 dizayn variantı', await page.$$eval('#dizaynlar .dizayn', e => e.length) === 3);
  check('12 palitra', await page.$$eval('#palitralar .palitra', e => e.length) === 12);
  check('3 nisbət düyməsi', await page.$$eval('#nisbetler .nisbet', e => e.length) === 3);

  const bosOlmayan = async sel => page.$eval(sel, c => {
    const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
    let n = 0;
    for (let i = 0; i < d.length; i += 40) if (d[i] !== d[0] || d[i + 1] !== d[1]) n++;
    return n;
  });
  check('önizləmə kətanı boş deyil', (await bosOlmayan('#onizleme')) > 500);
  check('dizayn kiçik önizləmələri çəkilib',
    (await page.$$eval('#dizaynlar canvas', cs => cs.filter(c => c.width > 100).length)) === 3);

  bas('2. Azərbaycan hərfləri həqiqətən şriftdən gəlir');
  /* Şriftdə hərf yoxdursa brauzer nəzarət ailəsi ilə eyni fallback-a düşər və
     iki şəkil eyni çıxar. Fərq varsa hərf məhz seçilmiş şriftdəndir. */
  const harfler = await page.evaluate(() => {
    const test = (ch, fam) => {
      const c = document.createElement('canvas');
      c.width = 220; c.height = 220;
      const x = c.getContext('2d');
      x.fillStyle = '#fff'; x.fillRect(0, 0, 220, 220);
      x.fillStyle = '#000'; x.font = '160px ' + fam;
      x.textBaseline = 'middle'; x.textAlign = 'center';
      x.fillText(ch, 110, 110);
      return c.toDataURL();
    };
    const out = {};
    for (const fam of ['"Davet Serif"', '"Davet Display"', '"Davet Sans"', '"Davet Script"', '"Davet Yumsaq"']) {
      out[fam] = 'ƏəĞğİıŞşÇçÖöÜü'.split('').filter(ch => test(ch, fam) === test(ch, '"YoxOlanSriftAdi"'));
    }
    return out;
  });
  for (const fam of Object.keys(harfler)) {
    check(fam + ' bütün hərfləri çəkir', harfler[fam].length === 0, harfler[fam]);
  }

  bas('3. Forma önizləməni dəyişir');
  const evvel = await page.$eval('#onizleme', c => c.toDataURL().length);
  await page.fill('#fHosts', 'Şəhla və Elçin');
  await page.waitForTimeout(400);
  const sonra = await page.$eval('#onizleme', c => c.toDataURL().length);
  check('yazdıqca önizləmə yenilənir', evvel !== sonra, { evvel, sonra });

  await page.click('.tedbir[data-event="usaq-ad-gunu"]');
  await page.waitForTimeout(500);
  check('tədbir dəyişəndə dizaynlar yenilənir',
    (await page.$$eval('#dizaynlar .dizayn', e => e.map(x => x.dataset.design)))
      .every(id => id.indexOf('usaq') === 0));
  check('uşaq tədbirində foto yükləmə düyməsi yoxdur',
    (await page.$$('input[type=file]')).length === 0);
  await page.click('.tedbir[data-event="toy"]');
  await page.waitForTimeout(500);

  bas('4. Üç nisbət');
  for (const [r, w, h] of [['kart', 1240, 1748], ['kvadrat', 1080, 1080], ['hekaye', 1080, 1920]]) {
    await page.click('.nisbet[data-ratio="' + r + '"]');
    await page.waitForTimeout(300);
    const nisbet = await page.$eval('#onizleme', c => c.width / c.height);
    check(r + ' nisbəti düzgündür (' + w + '×' + h + ')', Math.abs(nisbet - w / h) < 0.01, nisbet);
  }
  await page.click('.nisbet[data-ratio="kart"]');

  bas('5. İxrac');
  const ixrac = await page.evaluate(async () => {
    const D = window.DAVET;
    await D.ready();
    const inv = { design: 'toy-qizil', palette: 'qizil', event: 'toy', hosts: 'Aygün & Rəşad',
                  title: 'Toy şənliyimizə dəvətlisiniz', date: '2026-09-19', time: '18:00',
                  venue: 'Gülüstan', address: 'Bakı', phone: '+994 50 000 00 00', note: 'Gözləyirik' };
    const ket = r => { const s = D.RATIOS[r], c = document.createElement('canvas');
      c.width = s.w; c.height = s.h; D.draw(c.getContext('2d'), inv, { ratio: r }); return c; };
    const png = c => new Promise(res => c.toBlob(b => res(b), 'image/png'));

    const out = {};
    for (const r of ['kart', 'kvadrat', 'hekaye']) {
      const c = ket(r), blob = await png(c);
      out[r] = { w: c.width, h: c.height, bayt: blob.size, tip: blob.type };
    }
    const pdf = await ZEXPORT.canvasPdf(ket('kart'), 'devetname',
      { pw: ZEXPORT.PAGE.a6.pw, ph: ZEXPORT.PAGE.a6.ph, producer: 'Devetname' });
    out.pdf = { bayt: pdf.size, tip: pdf.type, bas: await pdf.slice(0, 8).text(),
                son: await pdf.slice(-5).text(),
                metn: await pdf.slice(0, 900).text() };
    /* su nişanı: eyni sənəd nişanlı və nişansız fərqli olmalıdır */
    const a = ket('kvadrat').toDataURL();
    const c2 = document.createElement('canvas');
    c2.width = D.RATIOS.kvadrat.w; c2.height = D.RATIOS.kvadrat.h;
    D.draw(c2.getContext('2d'), inv, { ratio: 'kvadrat', suNisani: true });
    out.nisanFerqi = a !== c2.toDataURL();
    return out;
  });

  check('kart PNG 1240×1748', ixrac.kart.w === 1240 && ixrac.kart.h === 1748, ixrac.kart);
  check('kvadrat PNG 1080×1080', ixrac.kvadrat.w === 1080 && ixrac.kvadrat.h === 1080, ixrac.kvadrat);
  check('status PNG 1080×1920', ixrac.hekaye.w === 1080 && ixrac.hekaye.h === 1920, ixrac.hekaye);
  check('PNG faylları boş deyil',
    ['kart', 'kvadrat', 'hekaye'].every(r => ixrac[r].bayt > 20000 && ixrac[r].tip === 'image/png'));
  check('PDF %PDF ilə başlayır', ixrac.pdf.bas.indexOf('%PDF-1.4') === 0, ixrac.pdf.bas);
  check('PDF %%EOF ilə bitir', ixrac.pdf.son === '%%EOF', ixrac.pdf.son);
  check('PDF A6 ölçüsündədir', ixrac.pdf.metn.indexOf('MediaBox[0 0 297.64 419.53]') > 0);
  check('PDF-də kənar brend adı yoxdur', ixrac.pdf.metn.toLowerCase().indexOf('zarafat') < 0);
  check('su nişanı nəticəni dəyişir', ixrac.nisanFerqi === true);

  bas('6. Brend sızması');
  const metn = (await page.evaluate(() => document.body.innerText)).toLowerCase()
    .replace(/ə/g, 'e').replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ş/g, 's')
    .replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/ç/g, 'c');
  for (const w of ['zarafat', 'notariat', 'reyestr', 'parodiya', 'mohur', 'znp']) {
    check('səhifə mətnində «' + w + '» yoxdur', metn.indexOf(w) < 0);
  }
  const yuklenen = await page.evaluate(() =>
    Array.from(document.querySelectorAll('script[src],link[href]'))
      .map(e => e.src || e.href).filter(u => u.indexOf('data:') !== 0)
      .map(u => u.replace(location.origin, '')));
  check('yalnız dəvətnamə assetləri yüklənir',
    yuklenen.every(u => /devet|invite|export/.test(u)), yuklenen);

  check('sonda da JS xətası yoxdur', errs.length === 0, errs);
  check('sonda da uğursuz asset yoxdur', uğursuz.length === 0, uğursuz);

  console.log('\n' + pass + ' keçdi, ' + fail + ' uğursuz');
  await b.close(); server.close();
  process.exit(fail ? 1 : 0);
})();
