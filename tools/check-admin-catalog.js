/* Admin kataloq panelinin uçdan-uca yoxlaması: kateqoriya və şablon yaratmaq,
   aktiv/deaktiv etmək, anket sxeminin validasiyası və saytın dərhal yenilənməsi.

   İşlətmək:  node tools/check-admin-catalog.js [base] [email] [parol]
   Standart:  http://127.0.0.1:8080  ·  .env-dəki admin */
const { chromium } = require('playwright');

const BASE  = process.argv[2] || 'http://127.0.0.1:8080';
const EMAIL = process.argv[3] || 'admin@zarafat.az';
const PASS  = process.argv[4] || 'admin12345';

let pass = 0, fail = 0;
const check = (n, c, x) => c ? (pass++, console.log('  ✓', n))
                             : (fail++, console.log('  ✗', n, x === undefined ? '' : JSON.stringify(x)));

(async () => {
  const b = await chromium.launch();
  const page = await b.newPage({ viewport: { width: 1400, height: 1100 } });
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));

  /* --- giriş --- */
  await page.goto(BASE + '/admin/giris', { waitUntil: 'domcontentloaded' });
  await page.fill('input[name="email"]', EMAIL);
  await page.fill('input[name="password"]', PASS);
  await page.click('form[action*="giris"] button[type="submit"]');
  await page.waitForTimeout(900);
  check('admin girişi', page.url().indexOf('/admin') >= 0 && page.url().indexOf('giris') < 0, page.url());

  /* --- kateqoriya yaratmaq --- */
  const stamp = Date.now().toString(36).slice(-5);
  const slug = 'test-kat-' + stamp;
  const catName = 'Sınaq Kat ' + stamp;
  await page.goto(BASE + '/admin/kateqoriyalar/yeni', { waitUntil: 'domcontentloaded' });
  await page.fill('#name', catName);
  await page.fill('#slug', slug);
  await page.fill('#blurb', 'Avtomatik sınaq üçün yaradılıb.');
  await page.click('button:has-text("Yadda saxla")');
  await page.waitForTimeout(700);
  const inApi = (kind, id) => page.evaluate(async ([k, i]) =>
    (await (await fetch('/api/catalog')).json())[k].some(x => x.id === i), [kind, id]);
  check('kateqoriya yaradıldı', await inApi('categories', slug));

  /* --- eyni açarla ikinci kateqoriya rədd olunur --- */
  await page.goto(BASE + '/admin/kateqoriyalar/yeni', { waitUntil: 'domcontentloaded' });
  await page.fill('#name', 'Təkrar'); await page.fill('#slug', slug);
  await page.click('button:has-text("Yadda saxla")'); await page.waitForTimeout(600);
  check('təkrar açar rədd olunur', (await page.content()).indexOf('Formada xəta var') >= 0);

  /* --- istifadəçi seçimləri (variant siyahıları) --- */
  await page.goto(BASE + '/admin/sablonlar?q=snoring-license', { waitUntil: 'domcontentloaded' });
  await page.click('a:has-text("Redaktə")'); await page.waitForTimeout(1100);
  const keepOpts = await page.$eval('#powers_options', e => e.value);

  await page.fill('#powers_options', 'a'.repeat(120)); await page.waitForTimeout(600);
  check('uzun variant önizləmədə xəbərdarlıq verir',
    (await page.$eval('#prevMsg', e => e.textContent)).indexOf('90 simvolu aşır') >= 0);
  await page.click('button:has-text("Yadda saxla")'); await page.waitForTimeout(700);
  check('uzun variant serverdə rədd edilir', (await page.content()).indexOf('90 simvolu aşır') >= 0);

  await page.fill('#title_options', 'Xoruldama Lisenziyası\nGecə Səs Lisenziyası');
  await page.fill('#powers_options',
    'Gecə 23:00-dan 07:00-a qədər xoruldamaq.\nSəhər «mən xoruldamıram» demək hüququ.\n' +
    'Divana sürgün edilməyə etiraz etmək.\nQulaq tıxacının qiymətini ödəməmək.\nYastığı tək başına işlətmək.');
  await page.fill('#powers_min', '2'); await page.fill('#powers_max', '3');
  await page.fill('#penalty_options',
    'Səs həddi keçdikdə lisenziya bir gecəlik dayandırılır.\nLisenziya növbəti həftəyə keçirilir.');
  await page.waitForTimeout(700);
  check('önizləmə ilk başlıq variantını göstərir',
    (await page.$eval('#prevDoc', e => e.textContent)).indexOf('XORULDAMA LİSENZİYASI') >= 0);
  await page.click('button:has-text("Yadda saxla")'); await page.waitForTimeout(900);
  const optApi = await page.evaluate(async () => {
    const t = (await (await fetch('/api/catalog')).json()).templates.find(x => x.id === 'snoring-license');
    return { t: (t.titleOptions || []).length, p: (t.powersOptions || []).length,
             mn: t.powersMin, mx: t.powersMax, q: (t.penaltyOptions || []).length };
  });
  check('variantlar kataloqa düşür',
    optApi.t === 2 && optApi.p === 5 && optApi.mn === 2 && optApi.mx === 3 && optApi.q === 2, optApi);

  /* --- saytda dropdown və çoxseçim --- */
  const site0 = await b.newPage();
  await site0.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  await site0.waitForTimeout(2200);
  await site0.click('#tabs button:has-text("Cütlüklər")'); await site0.waitForTimeout(300);
  await site0.click('[data-tpl="snoring-license"]'); await site0.waitForTimeout(600);
  check('saytda başlıq açılan siyahıdır', (await site0.$eval('#fTitle', e => e.tagName)) === 'SELECT');
  check('saytda cəza bəndi açılan siyahıdır', (await site0.$eval('#fPenalty', e => e.tagName)) === 'SELECT');
  check('saytda bənd çoxseçimi var', (await site0.$$eval('#fPowersField [data-pow]', b => b.length)) === 5);
  check('min sayda bənd öncədən seçilib',
    (await site0.$$eval('#fPowersField [data-pow][aria-pressed="true"]', b => b.length)) === 2);
  await site0.click('#fPowersField [data-pow="4"]'); await site0.waitForTimeout(500);
  check('seçim sənədə düşür', (await site0.$eval('#preview', e => e.textContent)).indexOf('Yastığı tək başına') >= 0);
  check('bənd sırası variant sırasındadır',
    (await site0.$eval('#fPowers', e => e.value)).split('\n')[0].indexOf('Gecə 23:00') >= 0);
  await site0.click('[data-tpl="weekend-pass"]'); await site0.waitForTimeout(500);
  check('variantsız şablon kilidlidir',
    await site0.$eval('#fTitle', e => e.tagName === 'INPUT' && e.readOnly));
  await site0.close();

  /* --- anketli şablonda variant qadağandır --- */
  await page.goto(BASE + '/admin/sablonlar?q=cole-cixma-vizasi', { waitUntil: 'domcontentloaded' });
  await page.click('a:has-text("Redaktə")'); await page.waitForTimeout(900);
  await page.fill('#title_options', 'Bir variant'); await page.waitForTimeout(600);
  check('anketlə toqquşma önizləmədə görünür',
    (await page.$eval('#prevMsg', e => e.textContent)).indexOf('işləmir') >= 0);
  await page.click('button:has-text("Yadda saxla")'); await page.waitForTimeout(800);
  check('anketlə toqquşma serverdə rədd edilir', (await page.content()).indexOf('işləmir') >= 0);

  /* --- variantları geri qaytar --- */
  await page.goto(BASE + '/admin/sablonlar?q=snoring-license', { waitUntil: 'domcontentloaded' });
  await page.click('a:has-text("Redaktə")'); await page.waitForTimeout(800);
  await page.fill('#title_options', ''); await page.fill('#penalty_options', '');
  await page.fill('#powers_options', keepOpts);
  await page.click('button:has-text("Yadda saxla")'); await page.waitForTimeout(800);
  check('variantlar geri qaytarıldı', await page.evaluate(async () =>
    !(await (await fetch('/api/catalog')).json()).templates.find(x => x.id === 'snoring-license').titleOptions));

  /* --- canlı önizləmə --- */
  await page.goto(BASE + '/admin/sablonlar?q=snoring-license', { waitUntil: 'domcontentloaded' });
  await page.click('a:has-text("Redaktə")'); await page.waitForTimeout(1200);
  check('önizləmə çəkilir', (await page.$$eval('#prevDoc svg', e => e.length)) === 1);
  check('şablonun mətni önizləmədədir',
    (await page.$eval('#prevDoc', e => e.textContent)).indexOf('Divana sürgün') >= 0);
  await page.fill('#title', 'Önizləmə Sınağı'); await page.waitForTimeout(600);
  check('başlıq dəyişikliyi önizləməyə düşür',
    (await page.$eval('#prevDoc', e => e.textContent)).indexOf('ÖNİZLƏMƏ SINAĞI') >= 0);
  await page.selectOption('#layout', 'viza'); await page.waitForTimeout(700);
  check('dizayn dəyişikliyi önizləməyə düşür',
    (await page.$eval('#prevDoc', e => e.textContent)).indexOf('VİZA / VISA') >= 0);
  check('ödənişsiz görünüşdə NÜMUNƏ var',
    (await page.$eval('#prevDoc', e => e.textContent)).indexOf('NÜMUNƏ') >= 0);
  await page.check('#prevPaid'); await page.waitForTimeout(600);
  check('ödənişli görünüşdə QR bloku var',
    (await page.$eval('#prevDoc', e => e.textContent)).indexOf('REYESTRDƏ YOXLA') >= 0);
  await page.fill('#fields', '[{"k":"a",]'); await page.waitForTimeout(600);
  check('sınmış JSON önizləmədə dərhal bildirilir',
    (await page.$eval('#prevMsg', e => e.textContent)).indexOf('JSON oxunmadı') >= 0);

  /* --- anketli şablonun önizləməsi --- */
  await page.goto(BASE + '/admin/sablonlar?q=cole-cixma-vizasi', { waitUntil: 'domcontentloaded' });
  await page.click('a:has-text("Redaktə")'); await page.waitForTimeout(1300);
  const pv = await page.$eval('#prevDoc', e => e.textContent);
  check('anket cavabları önizləmə cədvəlində',
    pv.indexOf('TƏYİNAT YERİ') >= 0 && pv.indexOf('Çayxana') >= 0);
  check('önizləmədə yer tutucu qalmır', pv.indexOf('{{') < 0);

  /* --- kateqoriyadan öz şablonlarına keçid --- */
  await page.goto(BASE + '/admin/kateqoriyalar', { waitUntil: 'domcontentloaded' });
  await page.click('tr:has-text("couples") a:has-text("Şablonlar")');
  await page.waitForTimeout(600);
  const catRows = await page.$$eval('tbody tr:has(a[href*="/sablonlar/"])', r => r.length);
  check('kateqoriya öz şablonlarını sadalayır', catRows === 12, catRows);
  check('şablonun mətni siyahıda görünür', (await page.content()).indexOf('Xoruldama Lisenziyası') >= 0);

  await page.click('tr:has-text("snoring-license") a:has-text("Redaktə")');
  await page.waitForTimeout(600);
  check('siyahıdan redaktəyə keçir',
    (await page.$eval('#title', e => e.value)) === 'Xoruldama Lisenziyası');
  const oldPenalty = await page.$eval('#penalty', e => e.value);
  await page.fill('#penalty', 'Sınaq cəza bəndi — avtomatik test.');
  await page.click('button:has-text("Yadda saxla")'); await page.waitForTimeout(700);
  const saved = await page.evaluate(async () =>
    (await (await fetch('/api/catalog')).json()).templates.find(t => t.id === 'snoring-license').penalty);
  check('mətn dəyişikliyi saytın kataloquna düşür', saved.indexOf('Sınaq cəza bəndi') >= 0, saved);
  await page.goto(BASE + '/admin/sablonlar?q=snoring-license', { waitUntil: 'domcontentloaded' });
  await page.click('a:has-text("Redaktə")'); await page.waitForTimeout(500);
  await page.fill('#penalty', oldPenalty);
  await page.click('button:has-text("Yadda saxla")'); await page.waitForTimeout(700);
  check('mətn geri qaytarıldı', (await page.evaluate(async () =>
    (await (await fetch('/api/catalog')).json()).templates.find(t => t.id === 'snoring-license').penalty)) === oldPenalty);

  /* --- şablon: yanlış anket sxemi --- */
  const tslug = 'test-sablon-' + Date.now().toString(36).slice(-5);
  await page.goto(BASE + '/admin/kateqoriyalar', { waitUntil: 'domcontentloaded' });
  await page.click(`tr:has-text("${slug}") a:has-text("Şablonlar")`); await page.waitForTimeout(600);
  await page.click('a:has-text("Şablon əlavə et")'); await page.waitForTimeout(700);
  check('kateqoriyadan əlavə edəndə kateqoriya öncədən seçilir',
    (await page.$eval('#category_id option:checked', e => e.textContent.trim())).indexOf(catName) >= 0);
  await page.fill('#title', 'Sınaq Şablonu');
  await page.fill('#slug', tslug);
  await page.fill('#preamble', '{from} tərəfindən {to} adlı şəxsə sınaq icazəsi verilir.');
  await page.fill('#powers', 'Bir.\nİki.\nÜç.\nDörd.');
  await page.fill('#penalty', 'Sınaq şərtləri pozulduqda sənəd qüvvədən düşür.');
  await page.fill('#fields', '[{"k":"BAD KEY","t":"yoxdur","label":"X"}]');
  await page.click('button:has-text("Yadda saxla")'); await page.waitForTimeout(700);
  let html = await page.content();
  check('naməlum tip tutulur', /naməlum tip/i.test(html), html.indexOf('Formada xəta') >= 0);
  check('yanlış açar tutulur', /yalnız kiçik hərf/i.test(html));

  /* --- şablon: sınmış JSON --- */
  await page.fill('#fields', '[{"k":"a",]');
  await page.click('button:has-text("Yadda saxla")'); await page.waitForTimeout(700);
  check('sınmış JSON tutulur', /JSON oxunmadı/i.test(await page.content()));

  /* --- şablon: uyğunsuz yer tutucu --- */
  await page.fill('#fields', '[{"k":"teyinat","t":"select","label":"Təyinat","opts":["Bir","İki"]}]');
  await page.fill('#preamble', '{from} tərəfindən {to} adlı şəxsə {{yoxdur}} üçün icazə verilir.');
  await page.click('button:has-text("Yadda saxla")'); await page.waitForTimeout(700);
  check('uyğunsuz yer tutucu tutulur', /uyğun gəlmir/i.test(await page.content()));

  /* --- şablon: düzgün sxem --- */
  await page.fill('#preamble', '{from} tərəfindən {to} adlı şəxsə {{teyinat}} üçün icazə verilir.');
  await page.fill('#share', 'Sınaq paylaşımı {{teyinat}}');
  await page.fill('#reg_prefix', 'TST');
  await page.click('button:has-text("Yadda saxla")'); await page.waitForTimeout(800);
  html = await page.content();
  check('düzgün şablon saxlanılır', await inApi('templates', tslug),
    (html.match(/<li>[^<]{0,160}<\/li>/g) || []).slice(0, 4));

  /* --- saytda dərhal görünür --- */
  const site = await b.newPage();
  const siteErrs = [];
  site.on('pageerror', e => siteErrs.push(e.message));
  await site.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  await site.waitForTimeout(2200);
  check('yeni kateqoriya saytda göründü',
    (await site.$$eval('#tabs button', b => b.map(x => x.textContent))).some(t => t.indexOf(catName) >= 0));
  await site.click('#tabs button:has-text("' + catName + '")');
  await site.waitForTimeout(400);
  check('yeni şablon kart kimi çıxdı', (await site.$$eval('#cards button', b => b.length)) === 1);
  await site.click(`[data-tpl="${tslug}"]`); await site.waitForTimeout(600);
  check('anket sahəsi qurulur', (await site.$$eval('#fFields .field', e => e.length)) === 1);
  check('şablona xas prefiks tətbiq olunur', /^TST-/.test(await site.$eval('#regBadge', e => e.textContent)));
  const preview = await site.$eval('#preview', e => e.textContent);
  check('anket cavabı sənədə düşür', preview.indexOf('Bir') >= 0 && preview.indexOf('{{') < 0);

  /* --- söndürmək --- */
  await page.goto(BASE + '/admin/sablonlar?q=' + tslug, { waitUntil: 'domcontentloaded' });
  await page.click('button:has-text("Söndür")'); await page.waitForTimeout(700);
  check('şablon söndürüldü', (await page.content()).indexOf('söndürüldü') >= 0);

  await site.reload({ waitUntil: 'domcontentloaded' }); await site.waitForTimeout(2200);
  const tabs = await site.$$eval('#tabs button', b => b.map(x => x.textContent));
  const empty = tabs.filter(t => t.indexOf(catName) >= 0)[0] || '';
  check('söndürülmüş şablon saytdan çıxdı', /0/.test(empty), empty);

  /* --- təmizlik: şablonu və kateqoriyanı sil --- */
  await page.goto(BASE + '/admin/sablonlar?q=' + tslug, { waitUntil: 'domcontentloaded' });
  await page.click('a:has-text("Redaktə")'); await page.waitForTimeout(600);
  await page.click('button:has-text("Şablonu sil")'); await page.waitForTimeout(700);
  check('şablon silindi', (await page.content()).indexOf('silindi') >= 0);

  await page.goto(BASE + '/admin/kateqoriyalar', { waitUntil: 'domcontentloaded' });
  const row = await page.$(`tr:has-text("${slug}") a:has-text("Şablonlar")`);
  if (row) { await row.click(); await page.waitForTimeout(600);
    await page.click('button:has-text("Kateqoriyanı sil")'); await page.waitForTimeout(700); }
  check('kateqoriya silindi', (await page.content()).indexOf(slug) < 0);

  check('admin brauzer xətası yoxdur', errs.length === 0, errs);
  check('sayt brauzer xətası yoxdur', siteErrs.length === 0, siteErrs);

  console.log('\n' + pass + ' keçdi, ' + fail + ' uğursuz');
  await b.close();
  process.exit(fail ? 1 : 0);
})();
