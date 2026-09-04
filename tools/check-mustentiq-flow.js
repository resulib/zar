/* MÜSTƏNTİQ PROFİLİ — uçdan-uca, real brauzerdə.
 *
 * Axın: qeydiyyat → şöbə seçimi → nişan verilir → iş bağlanır → XP artır →
 * rütbə əmri BİR DƏFƏ görünür → vəsiqə render olunur → PNG çıxarılır →
 * reytinqdə görünür → gizlədilir → siyahıdan çıxır, mövqe qalır.
 *
 * Yalnız brauzerin edə biləcəyi ölçmə də buradadır: uzun ad kartda DAŞMIR —
 * `getComputedTextLength()` qutudan böyük olmamalıdır. PHP tərəfdə mətn
 * ölçüsü yalnız TƏXMİN edilir (`CardRenderer::en()`), ona görə sərt zəmanət
 * `textLength`-dir və onu yalnız brauzer təsdiqləyə bilər.
 *
 * `php artisan serve --port=8099` lazımdır.
 */
const { chromium } = require('playwright');

const BASE  = process.env.BASE || 'http://127.0.0.1:8099';
const EPOST = 'axin' + Date.now() + '@numune.az';
const SIFRE = 'parol123456';
const AD    = 'Rəşad İsmayılov';
const UZUN  = 'Məhəmmədəli Şəmsəddinzadə-Quliyev';

let pass = 0, fail = 0;
function check(ad, sert, izah) {
  if (sert) { pass++; console.log('  \x1b[32m✓\x1b[0m ' + ad); }
  else { fail++; console.log('  \x1b[31m✗\x1b[0m ' + ad + (izah === undefined ? '' : ' → ' + JSON.stringify(izah))); }
}
function bas(t) { console.log('\n' + t); }

/* Serverin öz sanitizasiyasından keçən mətn — testin özü onu təkrarlamır. */
const metn = async (p, sec) => (await p.locator(sec).first().innerText().catch(() => '')).trim();

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();

  /* --- 1. Qonaq: vəsiqə YOXDUR ---------------------------------------- */
  bas('1. Qonaq');
  await p.goto(BASE + '/is/mustentiq');
  check('profil səhifəsi açılır', p.url().includes('/is/mustentiq'));
  check('qonağa kart göstərilmir', await p.locator('#vesiqe').count() === 0);
  check('qeydiyyat çağırışı var', await p.locator('.pr-qonaq').count() === 1);

  /* --- 2. Qeydiyyat ---------------------------------------------------- */
  bas('2. Qeydiyyat');
  await p.goto(BASE + '/is/hesab');
  await p.fill('form[action$="/qeydiyyat"] input[name=name]', AD);
  await p.fill('form[action$="/qeydiyyat"] input[name=email]', EPOST);
  await p.fill('form[action$="/qeydiyyat"] input[name=password]', SIFRE);
  await p.fill('form[action$="/qeydiyyat"] input[name=password_confirmation]', SIFRE);
  await p.click('form[action$="/qeydiyyat"] button[type=submit]');
  await p.waitForURL('**/is/mustentiq');

  check('qeydiyyatdan sonra profilə keçdi', p.url().includes('/is/mustentiq'));
  check('kart render olundu', await p.locator('#vesiqe svg').count() === 1);
  check('nişan hələ verilməyib',
    (await metn(p, '#vesiqe')).includes('TƏYİNAT GÖZLƏYİR')
    || (await p.locator('#vesiqe svg').innerHTML()).includes('TƏYİNAT GÖZLƏYİR'));

  /* --- 3. Şöbə seçimi — nişan doğulur ---------------------------------- */
  bas('3. Şöbə və nişan');
  await p.goto(BASE + '/is/mustentiq/ayarlar');
  await p.check('input[name=sobe][value=KR]');
  await p.click('form[action$="/sobe"] button[type=submit]');
  await p.waitForLoadState('networkidle');

  const flash = await metn(p, '.pr-flash');
  const nisan = (flash.match(/[A-Z]{2}-\d{2}-\d{4}/) || [])[0];
  check('nişan nömrəsi verildi', !!nisan, flash);
  check('nişan formatı düzgündür', /^KR-\d{2}-\d{4}$/.test(nisan || ''), nisan);

  /* İKİNCİ DƏYİŞİKLİK: şöbə dəyişir, NİŞAN DƏYİŞMİR. */
  await p.goto(BASE + '/is/mustentiq/ayarlar');
  await p.check('input[name=sobe][value=KC]');
  await p.click('form[action$="/sobe"] button[type=submit]');
  await p.waitForLoadState('networkidle');
  /* Kilidli ayarlar səhifəsi nömrəni çap etmir — nişan KARTDA yoxlanılır. */
  await p.goto(BASE + '/is/mustentiq');
  check('şöbə dəyişdi, nişan qaldı',
    (await p.locator('#vesiqe svg').innerHTML()).includes(nisan), nisan);

  /* ÜÇÜNCÜ DƏYİŞİKLİK RƏDD — forma artıq göstərilmir. */
  await p.goto(BASE + '/is/mustentiq/ayarlar');
  check('şöbə kilidləndi', await p.locator('input[name=sobe]').count() === 0);

  /* --- 4. Uzun ad kartda DAŞMIR ---------------------------------------- */
  bas('4. Uzun ad');
  await p.fill('input[name=ad]', UZUN);
  await p.click('form[action$="/ad"] button[type=submit]');
  await p.waitForLoadState('networkidle');
  await p.goto(BASE + '/is/mustentiq');

  /* Yalnız brauzer ölçə bilər: PHP tərəf ölçünü TƏXMİN edir, daşmanın
     qarşısını isə `textLength` alır. */
  const dasma = await p.evaluate(() => {
    const svg = document.querySelector('#vesiqe svg');
    const box = 276;                                  // CardRenderer::AD_EN
    /* Yalnız AD mətnləri: mikromətn zolağı qəsdən kartın tam enindədir. */
    return [...svg.querySelectorAll('text[data-ad]')]
      .map(t => ({ metn: t.textContent, en: t.getComputedTextLength() }))
      .filter(t => t.en > box + 2);
  });
  check('kartdakı mətn qutudan daşmır', dasma.length === 0, dasma);

  /* --- 5. PNG ixracı --------------------------------------------------- */
  bas('5. PNG');
  const png = await p.evaluate(async () => {
    const svg = document.querySelector('#vesiqe svg');
    const s = new XMLSerializer().serializeToString(svg);
    try {
      const b = await window.ZEXPORT.pngBlob(s, svg.viewBox.baseVal.width, svg.viewBox.baseVal.height, 2);
      return { tip: b.type, bayt: b.size };
    } catch (e) { return { xeta: String(e) }; }
  });
  check('ZEXPORT yüklənib', await p.evaluate(() => typeof window.ZEXPORT) === 'object');
  check('PNG çıxarıldı', png.tip === 'image/png' && png.bayt > 10000, png);
  check('endirmə düyməsi var', await p.locator('#kartEndir').count() === 1);

  /* --- 6. Hüquqi qalxan kartın ÜZƏRİNDƏDİR ----------------------------- */
  bas('6. Hüquqi qalxan');
  const svgHtml = await p.locator('#vesiqe svg').innerHTML();
  check('kartda fiktivlik qeydi var', svgHtml.includes('FİKTİV OYUN SƏNƏDİ'));
  check('kartda büro adı var', svgHtml.includes('AFİB'));
  check('kartda nişan nömrəsi var', svgHtml.includes(nisan), nisan);
  check('kartda CSS dəyişəni yoxdur', !svgHtml.includes('var(--'));
  check('kartda xarici şəkil yoxdur', !/href="https?:\/\//.test(svgHtml));

  /* --- 7. Rütbə nərdivanı ---------------------------------------------- */
  bas('7. Rütbə nərdivanı');
  check('doqquz pillə göstərilir', await p.locator('.pr-nerdivan li').count() === 9);
  check('kilidli pillələr var', await p.locator('.pr-nerdivan li.kilidli').count() > 0);
  check('indiki pillə işarələnib', await p.locator('.pr-nerdivan li.indiki').count() === 1);

  /* --- 8. Reytinq ------------------------------------------------------ */
  bas('8. Reytinq');
  await p.goto(BASE + '/is/reyting');
  check('reytinq açılır', (await metn(p, 'h1')).includes('reytinq'));
  check('dörd sıralama tabı var', await p.locator('.pr-tablar a').count() === 4);
  check('üç vaxt filtri var', await p.locator('.pr-pencere a').count() === 3);

  for (const s of ['isler', 'sonluqlar', 'ilk-cehd']) {
    await p.goto(BASE + '/is/reyting?sirala=' + s);
    check('sıralama «' + s + '» açılır', await p.locator('.pr-tablar a.aktiv').count() === 1);
  }
  for (const w of ['ay', 'hefte']) {
    await p.goto(BASE + '/is/reyting?pencere=' + w);
    check('pəncərə «' + w + '» açılır', await p.locator('.pr-pencere a.aktiv').count() === 1);
  }

  /* Naməlum dəyər ağ siyahıya düşür — `Sanitizer::pick` defolta qaytarır. */
  await p.goto(BASE + '/is/reyting?sirala=<script>&pencere=yalan');
  check('naməlum sıralama defolta düşür', await p.locator('.pr-tablar a.aktiv').count() === 1);
  check('reytinqdə e-poçt yoxdur', !(await metn(p, 'body')).includes('@numune.az'));

  /* --- 9. Gizlilik ----------------------------------------------------- */
  bas('9. Gizlilik');
  await p.goto(BASE + '/is/mustentiq/ayarlar');
  await p.uncheck('input[name=ictimai]');
  await p.click('form[action$="/gizlilik"] button[type=submit]');
  await p.waitForLoadState('networkidle');
  check('gizlədildi', (await metn(p, '.pr-flash')).includes('çıxarıldı'));

  await p.goto(BASE + '/is/reyting');
  check('gizli profil siyahıda yoxdur', !(await metn(p, '.pr-lovhe')).includes(nisan), nisan);

  await p.goto(BASE + '/is/mustentiq');
  check('gizli profil öz mövqeyini görür', await p.locator('.pr-movqe').count() === 1);

  /* --- 10. Üç en ölçüsü ------------------------------------------------ */
  bas('10. Ölçülər');
  for (const en of [412, 820, 1440]) {
    await p.setViewportSize({ width: en, height: 900 });
    await p.goto(BASE + '/is/mustentiq');

    const dasan = await p.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth);
    check(en + 'px: yatay sürüşmə yoxdur', dasan <= 1, dasan);
    check(en + 'px: kart görünür', await p.locator('#vesiqe svg').count() === 1);

    await p.goto(BASE + '/is/reyting');
    const dasan2 = await p.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth);
    check(en + 'px: reytinqdə yatay sürüşmə yoxdur', dasan2 <= 1, dasan2);
  }

  await browser.close();
  console.log('\n' + pass + ' keçdi, ' + fail + ' uğursuz');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
