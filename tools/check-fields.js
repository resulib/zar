/* Anket qatı: dinamik forma, çoxseçim, şkala, ad siyahısı və yer tutucular.
   Brauzerdə real UI üzərində işləyir, backend tələb etmir. */
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', 'frontend');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]); if (p === '/') p = '/index.html';
  const f = path.join(ROOT, p);
  if (!f.startsWith(ROOT) || !fs.existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'text/plain' });
  fs.createReadStream(f).pipe(res);
});
let pass = 0, fail = 0;
const check = (n, c, x) => c ? (pass++, console.log('  ✓', n)) : (fail++, console.log('  ✗', n, x === undefined ? '' : JSON.stringify(x)));
(async () => {
  await new Promise(r => server.listen(4213, r));
  const b = await chromium.launch();
  const page = await b.newPage({ viewport: { width: 1280, height: 1100 } });
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  await page.goto('http://localhost:4213/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(800);

  check('viral tab görünür', (await page.$$eval('#tabs button', b => b.map(x => x.textContent))).some(t => /Viral/.test(t)));
  await page.click('#tabs button:has-text("Viral")');
  await page.waitForTimeout(300);
  check('viral kateqoriyada 12 kart', (await page.$$eval('#cards button', b => b.length)) === 12);

  await page.click('[data-tpl="cole-cixma-vizasi"]');
  await page.waitForTimeout(400);
  check('anket sahələri göründü', await page.$eval('#fFields', e => !e.hidden && e.children.length === 8));
  check('mətn sahələri gizləndi', await page.$eval('#fPowersField', e => e.hidden));
  check('anketdə cəza sahəsi də gizlidir', await page.$eval('#fPenaltyField', e => e.hidden));
  check('sənədin adı sahəsi gizləndi', await page.$eval('#fTitleField', e => e.hidden));
  check('vaxt sahəsi defolt aldı', /^\d{2}:\d{2}$/.test(await page.$eval('#ff-qayidis_vaxti', e => e.value)));
  check('önizləmə viza dizaynındadır', (await page.$eval('#preview', e => e.textContent)).indexOf('VİZA / VISA') >= 0);
  check('reyestr nişanı CCV prefiksi ilə', /^CCV-\d{4}-/.test(await page.$eval('#regBadge', e => e.textContent)));

  await page.selectOption('select[data-fk="teyinat"]', 'Mangal');
  await page.fill('#ff-soyad_ad', 'Elvin Məmmədov');
  await page.waitForTimeout(400);
  let txt = await page.$eval('#preview', e => e.textContent);
  check('seçim sənədə düşdü', txt.indexOf('Mangal') >= 0);
  check('ad böyük hərflə düşdü', txt.indexOf('ELVİN MƏMMƏDOV') >= 0, txt.slice(0, 0));
  check('{{teyinat}} qeydlərdə əvəzləndi', txt.indexOf('{{') < 0);

  await page.selectOption('select[data-fk="teyinat"]', '__free');
  await page.waitForTimeout(200);
  check('sərbəst mətn sahəsi açıldı', await page.$eval('input[data-fk="teyinat"][data-free]', e => !e.hidden));
  await page.fill('input[data-fk="teyinat"][data-free]', 'Bərbər');
  await page.waitForTimeout(400);
  check('sərbəst mətn sənədə düşdü', (await page.$eval('#preview', e => e.textContent)).indexOf('Bərbər') >= 0);

  // çoxseçim + şkala
  await page.click('[data-tpl="bot-kimi-oynayir"]');
  await page.waitForTimeout(400);
  check('şkala göstəricisi var', (await page.$eval('.range-val', e => e.textContent)) === '7/10');
  check('iki bənd öncədən seçilib', (await page.$$eval('.checks button[aria-pressed="true"]', b => b.length)) === 2);
  await page.click('.checks button:nth-child(4)');
  await page.waitForTimeout(350);
  check('üçüncü bənd seçildi', (await page.$$eval('.checks button[aria-pressed="true"]', b => b.length)) === 3);
  txt = await page.$eval('#preview', e => e.textContent);
  check('seçilmiş bənd sənəddə var', txt.indexOf('Qapıçı ilə top saxlayır') >= 0);
  check('şkala sənəddə var', txt.indexOf('7/10') >= 0);
  await page.$eval('.range', e => { e.value = '3'; e.dispatchEvent(new Event('input', { bubbles: true })); });
  await page.waitForTimeout(350);
  check('şkala dəyişdi', (await page.$eval('#preview', e => e.textContent)).indexOf('3/10') >= 0);

  // ad siyahısı
  await page.click('[data-tpl="hesab-davasi-qalibi"]');
  await page.waitForTimeout(400);
  check('siyahı sahəsi bir sətirlə başlayır', (await page.$$eval('.list-row', b => b.length)) === 1);
  await page.click('[data-list="add"]');
  await page.waitForTimeout(250);
  check('siyahıya sətir əlavə olundu', (await page.$$eval('.list-row', b => b.length)) === 2);
  await page.fill('.list-row:nth-child(1) input', 'Rəşad Quliyev');
  await page.fill('.list-row:nth-child(2) input', 'Tural Əliyev');
  await page.waitForTimeout(400);
  txt = await page.$eval('#preview', e => e.textContent);
  check('siyahı sənədə düşdü', txt.indexOf('Rəşad Quliyev, Tural Əliyev') >= 0);
  check('preamble yer tutucuları əvəzləndi', txt.indexOf('{{') < 0 && txt.indexOf('AZN məbləğində') >= 0);

  // köhnə şablon toxunulmamış qalır
  await page.click('#tabs button:has-text("Cütlüklər")');
  await page.waitForTimeout(300);
  await page.click('[data-tpl="weekend-pass"]');
  await page.waitForTimeout(400);
  check('köhnə şablonda anket gizlidir', await page.$eval('#fFields', e => e.hidden));
  check('köhnə şablonda mətn sahələri görünür', await page.$eval('#fPowersField', e => !e.hidden));
  /* Anketsiz şablonda variant qatı: başlıq və cəza <select>, bəndlər isə
     seçilə bilən düymələrdir. Defolt seçim `powersMax` qədərdir, yəni sənəd
     şablonun öz dörd bəndi ilə açılır (app.js renderPicks). */
  check('başlıq variant siyahısıdır', await page.$eval('#fTitle', e => e.tagName === 'SELECT'));
  check('cəza bəndi variant siyahısıdır', await page.$eval('#fPenalty', e => e.tagName === 'SELECT'));
  check('bənd düymələri qurulub', await page.$$eval('#fPowersField [data-pow]', b => b.length >= 4));
  check('defolt seçim dörd bənddir',
    (await page.$eval('#fPowers', e => e.value)).split('\n').length === 4);
  check('defolt bəndlər şablonun öz mətnidir',
    (await page.$eval('#fPowers', e => e.value)).indexOf('Həftədə bir dəfə') >= 0);
  check('köhnə şablonda ZRF prefiksi', /^ZRF-/.test(await page.$eval('#regBadge', e => e.textContent)));

  /* Seçim dəyişdirildikdə sənəd yenilənir. */
  await page.click('#fPowersField [data-pow="0"]');       /* birinci bəndi çıxar */
  await page.click('#fPowersField [data-pow="5"]');       /* siyahıdan başqasını əlavə et */
  await page.waitForTimeout(400);
  check('seçilmiş bənd sənədə düşdü',
    (await page.$eval('#preview', e => e.textContent)).indexOf('Görüşün keçirildiyi ünvanı') >= 0);
  check('çıxarılmış bənd sənəddən getdi',
    (await page.$eval('#preview', e => e.textContent)).indexOf('ən çoxu dörd saat') < 0);

  /* Variant siyahısı olmayan şablon hələ də kilidli işləməlidir — admin belə
     şablon yarada bilər və `dist` rejimində köhnə kataloq da belə ola bilər. */
  await page.evaluate(() => {
    const t = TEMPLATES.find(x => x.id === 'weekend-pass');
    TEMPLATES.push(Object.assign({}, t, {
      id: 'kilidli-sinaq', title: 'Kilidli Sınaq Şablonu',
      titleOptions: undefined, powersOptions: undefined, penaltyOptions: undefined
    }));
  });
  await page.evaluate(() => document.querySelector('[data-tpl="weekend-pass"]').click());
  await page.waitForTimeout(200);
  await page.evaluate(() => {
    const t = TEMPLATES.find(x => x.id === 'kilidli-sinaq');
    document.querySelector('[data-tpl="weekend-pass"]').dataset.tpl = 'kilidli-sinaq';
    void t;
  });
  await page.click('[data-tpl="kilidli-sinaq"]');
  await page.waitForTimeout(400);
  check('variantsız şablonda başlıq kilidlidir', await page.$eval('#fTitle', e => e.readOnly === true));
  check('variantsız şablonda bəndlər kilidlidir', await page.$eval('#fPowers', e => e.readOnly === true));

  check('brauzer xətası yoxdur', errs.length === 0, errs);
  console.log('\n' + pass + ' keçdi, ' + fail + ' uğursuz');
  await b.close(); server.close();
  process.exit(fail ? 1 : 0);
})();
