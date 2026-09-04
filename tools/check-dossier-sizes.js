/* İş qovluğu — üç ölçüdə görünüş yoxlaması.
   Ayrıca fayldır ki, tools/check-dossier-flow.js saf TELEFON reqressiyası qalsın.

     cd backend-php && php artisan serve --port=8099
     node tools/check-dossier-sizes.js  [ünvan]

   Yoxlanan üç şey: sətir uzunluğu (80 simvoldan az), masaüstündə iki panel
   və lentin yuxarı keçməsi, kataloq şəbəkəsinin sütun sayı. */
const { chromium } = require('playwright');

const BASE = (process.argv[2] || 'http://127.0.0.1:8099').replace(/\/$/, '');
const SLUG = '2026-0847';

let pass = 0, fail = 0;
const check = (ad, ok, ekstra) => {
  if (ok) { pass++; console.log('  ✓ ' + ad); }
  else { fail++; console.log('  ✗ ' + ad + (ekstra === undefined ? '' : ' → ' + JSON.stringify(ekstra))); }
};
const bas = (t) => console.log('\n' + t);

/* Ölçülər `dossier.css`-dəki sınıq nöqtələrinin hər tərəfini tutur:
   412 telefon · 820 planşet (720-dən yuxarı) · 1440 kompüter (1080-dən yuxarı). */
const OLCULER = [
  { ad: 'telefon',  w: 412,  h: 900,  sutun: 1 },
  { ad: 'planşet',  w: 820,  h: 1100, sutun: 2 },
  { ad: 'kompüter', w: 1440, h: 900,  sutun: 3 },
];

/* IBM Plex Mono-nun addımı 600/1000 em-dir: 1ch = font-size × 0.6.
   Yəni bu hesab təxmin deyil, həqiqi simvol sayıdır. */
const simvol = (page) => page.evaluate(() => {
  var b = document.querySelector('.p-body');
  if (!b) return null;
  return b.clientWidth / (parseFloat(getComputedStyle(b).fontSize) * 0.6);
});

const acqi = async (page, ad) => {
  await page.goto(BASE + '/is/' + SLUG + '/qovluq', { waitUntil: 'networkidle' });
  await page.fill('#who', ad);
  await page.click('#openBtn');
  await page.waitForSelector('#s-index.on', { timeout: 8000 });
};

(async () => {
  const browser = await chromium.launch();

  for (const o of OLCULER) {
    bas(o.ad + ' — ' + o.w + 'px');
    const ctx = await browser.newContext({ viewport: { width: o.w, height: o.h } });
    const page = await ctx.newPage();

    /* --- kataloq şəbəkəsi --- */
    await page.goto(BASE + '/is', { waitUntil: 'networkidle' });
    const sutun = await page.evaluate(() =>
      getComputedStyle(document.getElementById('kataloq')).gridTemplateColumns.split(' ').length);
    check('kataloq ' + o.sutun + ' sütundur', sutun === o.sutun, sutun);

    /* Səhifə üfüqi sürüşmür — hər ölçüdə əsas tələb. */
    const dasir = await page.evaluate(() =>
      document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    check('ana səhifə üfüqi daşmır', !dasir);

    /* --- oyun --- */
    await acqi(page, 'Ölçü Testi');
    /* SIRA QAPISI: ikinci vərəq yalnız birinci keçiləndən sonra açılır.
       Ölçü yoxlaması üçün lazım olan `.p-body` ikinci vərəqdədir. */
    await page.locator('#list .docrow').first().click();
    await page.waitForSelector('#s-doc.on .paper', { timeout: 8000 });
    await page.click('.tab[data-go="index"]');
    await page.locator('#list .docrow').nth(1).click();
    await page.waitForSelector('.p-body', { timeout: 8000 });

    const ch = await simvol(page);
    check('sənəd sətri 80 simvoldan azdır', ch !== null && ch < 80, ch === null ? null : Math.round(ch * 10) / 10);

    const ikiPanel = await page.evaluate(() => {
      var l = document.getElementById('s-index');
      var d = document.getElementById('s-doc');
      var g = (e) => e.getBoundingClientRect();
      return { siyahi: g(l).width > 0, sened: g(d).width > 0, yanasi: g(l).right <= g(d).left + 1 };
    });

    if (o.w >= 1080) {
      check('siyahı və sənəd birlikdə görünür', ikiPanel.siyahi && ikiPanel.sened, ikiPanel);
      check('siyahı solda, sənəd sağdadır', ikiPanel.yanasi, ikiPanel);

      const lentUst = await page.evaluate(() =>
        document.getElementById('tabbar').getBoundingClientRect().top <
        document.getElementById('main').getBoundingClientRect().top);
      check('naviqasiya lenti yuxarıdadır', lentUst);

      /* Ortaq vaxt oxu: bütün alibi zolaqları eyni x-dən başlamalıdır.
         Şübhəlilər lenti SIRA QAPISININ arxasındadır — əvvəlcə qovluğu
         əvvəldən sona keçirik. */
      const say = await page.locator('#list .docrow').count();
      for (let i = 0; i < say; i++) {
        await page.click('.tab[data-go="index"]');
        await page.locator('#list .docrow').nth(i).click();
        await page.waitForFunction(() => {
          const b = document.querySelector('#docbody');
          return b && b.textContent.indexOf('Açılır…') < 0 && b.textContent.length > 0;
        }, { timeout: 8000 });
      }
      await page.locator('.tab[data-go="suspects"]').click();
      await page.waitForSelector('.sus .bar');
      const oxlar = await page.evaluate(() =>
        Array.prototype.map.call(document.querySelectorAll('.sus .bar'),
          (b) => Math.round(b.getBoundingClientRect().left)));
      check('alibi zolaqları ortaq oxdadır', new Set(oxlar).size === 1, oxlar);

      const nisanSayi = await page.evaluate(() =>
        Array.prototype.filter.call(document.querySelectorAll('.bar-l'),
          (e) => getComputedStyle(e).display !== 'none').length);
      check('vaxt nişanları bir dəfə göstərilir', nisanSayi === 1, nisanSayi);
    } else {
      check('yalnız bir ekran görünür', ikiPanel.sened && !ikiPanel.siyahi, ikiPanel);

      const lentAsagi = await page.evaluate(() =>
        document.getElementById('tabbar').getBoundingClientRect().top >
        document.getElementById('main').getBoundingClientRect().top);
      check('naviqasiya lenti aşağıdadır', lentAsagi);
    }

    await ctx.close();
  }

  await browser.close();
  console.log('\n' + pass + ' keçdi, ' + fail + ' uğursuz');
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error('XƏTA:', e.message); process.exit(1); });
