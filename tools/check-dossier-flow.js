/* İş qovluğu — uçdan-uca yoxlama, real brauzerdə. TELEFON reqressiyasıdır:
   bütün kontekstlər 412×880-dədir. Ölçülərin yoxlaması ayrıca fayldadır
   (tools/check-dossier-sizes.js) ki, bu fayl saf telefon testi qalsın.
   Node stubu yaramır: qabıq fetch ilə işləyir və sertifikat kətanda çəkilir.

   Əvvəlcə serveri qaldır:
     cd backend-php && php artisan serve --port=8099
   Sonra:  node tools/check-dossier-flow.js  [ünvan]

   Ən vacib yoxlama 3-cü bölmədədir: səhifənin MƏNBƏ KODUNDA nə kilidin
   kodu, nə düzgün cavab, nə də açılmamış sənədin məzmunu olmamalıdır. */
const { chromium } = require('playwright');

const BASE = (process.argv[2] || 'http://127.0.0.1:8099').replace(/\/$/, '');
const SLUG = '2026-0847';
const KOD = '0903';
const DUZ = [0, 1, 1];

let pass = 0, fail = 0;
const check = (ad, ok, ekstra) => {
  if (ok) { pass++; console.log('  ✓ ' + ad); }
  else { fail++; console.log('  ✗ ' + ad + (ekstra === undefined ? '' : ' → ' + JSON.stringify(ekstra))); }
};
const bas = (t) => console.log('\n' + t);

const ac = async (ctx, ad) => {
  const page = await ctx.newPage();
  await page.goto(BASE + '/is/' + SLUG + '/qovluq', { waitUntil: 'networkidle' });
  await page.fill('#who', ad);
  await page.click('#openBtn');
  await page.waitForSelector('#s-index.on', { timeout: 8000 });
  return page;
};

(async () => {
  const browser = await chromium.launch();

  /* --- 1. Siyahı ------------------------------------------------------ */
  bas('1. Ana səhifə');
  const c0 = await browser.newContext({ viewport: { width: 412, height: 880 } });
  const p0 = await c0.newPage();
  const r0 = await p0.goto(BASE + '/is', { waitUntil: 'networkidle' });
  check('/is açılır', r0.status() === 200, r0.status());
  check('qovluq kartı görünür', (await p0.locator('.kart').count()) >= 1);
  check('nümunə vərəqlər var', (await p0.locator('.numune-verq').count()) >= 3);
  check('FAQ açılır', (await p0.locator('.sual').count()) >= 5);

  /* Ana səhifə HƏQİQİ sənəd göstərir — sirr yoxlaması burada daha vacibdir. */
  const anaXam = await p0.content();
  check('ana səhifədə kilidin kodu yoxdur', anaXam.indexOf(KOD) < 0);
  check('ana səhifədə izah yoxdur', anaXam.indexOf('Hüseynova 23:51-də çıxıb') < 0);
  check('ana səhifədə şübhəli adları yoxdur', anaXam.indexOf('Səbinə Hüseynova') < 0);
  check('ana səhifədə açar sənəd yoxdur', anaXam.indexOf('GENERATOR QURĞUSUNUN') < 0);
  check('ana səhifə indekslənir', /index, follow/.test(anaXam));

  /* --- 2. Üz qabığı --------------------------------------------------- */
  bas('2. Təqdimat və üz qabığı');
  const rt = await p0.goto(BASE + '/is/' + SLUG, { waitUntil: 'networkidle' });
  check('təqdimat səhifəsi açılır', rt.status() === 200, rt.status());
  check('materialların adları görünür', (await p0.locator('.teq-siyahi li').count()) === 16);
  const teqXam = await p0.content();
  check('təqdimatda sənəd məzmunu yoxdur', teqXam.indexOf('mərmər lövhə') < 0);
  check('təqdimatda şübhəlilər yoxdur', teqXam.indexOf('Səbinə Hüseynova') < 0);

  const r1 = await p0.goto(BASE + '/is/' + SLUG + '/qovluq', { waitUntil: 'networkidle' });
  check('oyun açılır', r1.status() === 200, r1.status());
  check('oyun səhifəsi noindex-dir', /noindex/i.test(r1.headers()['x-robots-tag'] || ''), r1.headers()['x-robots-tag']);
  check('üz qabığı görünür', await p0.locator('#s-cover.on').isVisible());
  check('ad boş ikən düymə bağlıdır', await p0.locator('#openBtn').isDisabled());
  check('üz qabığında məcburi qeyd var',
    (await p0.locator('.cov-note').textContent()).trim().indexOf('FİKTİV OYUN SƏNƏDİ') === 0);
  check('üz qabığında büro kodu var', (await p0.locator('.cov-kod').textContent()).trim() === 'AFİB');

  /* --- 3. Sirr sızması ------------------------------------------------ */
  bas('3. Səhifənin mənbə kodu');
  const xam = await p0.content();
  check('kilidin kodu HTML-də yoxdur', xam.indexOf(KOD) < 0);
  check('düzgün cavab HTML-də yoxdur', xam.indexOf('correct') < 0);
  check('izah HTML-də yoxdur', xam.indexOf('Hüseynova 23:51-də çıxıb') < 0);
  check('sənəd məzmunu HTML-də yoxdur', xam.indexOf('mərmər lövhə') < 0);
  check('şübhəlilər HTML-də yoxdur', xam.indexOf('Səbinə Hüseynova') < 0);

  /* --- 4. Qovluğun açılması ------------------------------------------- */
  bas('4. Materiallar');
  const c1 = await browser.newContext({ viewport: { width: 412, height: 880 } });
  const p1 = await ac(c1, 'Rəsulov Elçin');
  const say = await p1.locator('#list .docrow').count();
  check('16 sənəd sıralanır', say === 16, say);
  check('alt lent göründü', await p1.locator('#tabbar.on').isVisible());
  check('sayğac işləyir', /^\d\d:\d\d$/.test(await p1.locator('#clock').textContent()));

  await p1.locator('#list .docrow').first().click();
  await p1.waitForSelector('.paper .p-title');
  check('qərar açıldı', (await p1.locator('.p-title').textContent()).trim() === 'QƏRAR');
  check('müstəntiqin adı sənədə düşdü', (await p1.locator('.p-body').textContent()).includes('Rəsulov Elçin'));

  /* Fiktivlik qeydi sənədin OZUNDƏ görünməlidir — ekran görüntüsü
     kontekstdən qopanda ətrafdakı səhifə onunla getmir. */
  check('sənəddə fiktivlik qeydi görünür', await p1.locator('.p-fiktiv').isVisible());
  check('qeydin mətni dəqiqdir',
    (await p1.locator('.p-fiktiv').textContent()).trim() ===
    'FİKTİV OYUN SƏNƏDİ — yalnız əyləncə məqsədi ilə hazırlanmışdır. Real hüquqi və ya rəsmi sənəd deyil.');
  check('vərəq başlığı AFİB-dir', (await p1.locator('.p-head').textContent()).includes('AFİB'));

  /* Sənəd şablon deyil, blokların ardıcıllığıdır. Qərar vərəqi beş blokdan
     ibarətdir: blank · başlıq · mətn · imza · çərçivəli mətn (qeyd qutusu). */
  check('blank bloku render olundu', (await p1.locator('.paper .p-head').count()) === 1);
  check('başlıq bloku render olundu', (await p1.locator('.paper .p-title').count()) === 1);
  check('mətn bloku render olundu', (await p1.locator('.paper .p-body p').count()) === 3);
  check('imza bloku render olundu', (await p1.locator('.paper .p-sign .sig').count()) === 1);
  /* Qeyd qutusu ayrıca blok növü deyil — `cerceve: true` olan mətn blokudur. */
  check('çərçivəli mətn bloku render olundu', (await p1.locator('.paper .p-note').count()) === 1);

  /* Sahə bloku növbəti vərəqdədir — eyni komponent, başqa sıra. */
  await p1.click('.tab[data-go="index"]');
  await p1.locator('#list .docrow').nth(1).click();
  await p1.waitForSelector('.paper .p-fields', { timeout: 8000 });
  check('sahə bloku render olundu', (await p1.locator('.paper .p-fields div').count()) >= 4);
  /* Boş dəyər icazəlidir: real blankda doldurulmamış sahə olur. */
  check('sahə xətti hər sətirdə var', (await p1.locator('.paper .p-fields i').count()) >= 4);

  /* --- 5. Qeyd dəftəri ------------------------------------------------ */
  bas('5. Qeyd dəftəri');
  await p1.click('#pin');
  await p1.waitForSelector('#pin.on');
  check('sənəd sancıldı', await p1.locator('#pin.on').isVisible());
  check('nişan görünür', (await p1.locator('#nb').textContent()) === '1');
  await p1.click('.tab[data-go="notes"]');
  check('qeydlərdə bir sətir var', (await p1.locator('.note').count()) === 1);

  /* --- 6. Kilid ------------------------------------------------------- */
  bas('6. Kodla bağlı sənəd');
  await p1.click('.tab[data-go="index"]');
  await p1.locator('#list .docrow.locked').first().click();
  await p1.waitForSelector('.lockwrap');
  check('klaviatura göründü', await p1.locator('.keys .key').count() === 12);
  check('kilidli sənəd də qeyd daşıyır', await p1.locator('.p-fiktiv').isVisible());
  check('kod klaviaturada yoxdur', (await p1.locator('.lockwrap').innerHTML()).indexOf(KOD) < 0);

  for (const d of '1234') await p1.click('.key[data-k="' + d + '"]');
  await p1.click('.key[data-k="ok"]');
  await p1.waitForFunction(() => document.querySelector('#lerr') && document.querySelector('#lerr').textContent.length > 0);
  check('səhv kod rədd olunur', (await p1.locator('#lerr').textContent()).length > 0);

  for (const d of KOD) await p1.click('.key[data-k="' + d + '"]');
  await p1.click('.key[data-k="ok"]');
  await p1.waitForSelector('.paper .ev', { timeout: 8000 });
  check('düz kod qutunu açır', (await p1.locator('.p-title').textContent()).includes('QUTUNUN'));
  check('açılmış məzmunda kod yoxdur', (await p1.content()).indexOf('lock_code') < 0);

  /* --- 7. Səhv rəy ×3 -------------------------------------------------- */
  bas('7. Yekun rəy — cəhdlər');
  await p1.click('.tab[data-go="answer"]');
  await p1.waitForSelector('.q');
  check('3 sual var', (await p1.locator('.q').count()) === 3);

  for (let tur = 1; tur <= 3; tur++) {
    for (let q = 0; q < 3; q++) await p1.click('.opt[data-q="' + q + '"][data-o="3"]');
    await p1.click('#submit');
    await p1.waitForTimeout(700);
  }
  await p1.waitForSelector('#s-result.on', { timeout: 8000 });
  check('üç səhvdən sonra izah açılır', (await p1.locator('.expl p').count()) === 4);
  check('sertifikat verilmir', (await p1.locator('#cert').count()) === 0);
  check('rədd mətni görünür', (await p1.locator('.verdict.no').count()) === 1);

  /* --- 8. Düzgün rəy və sertifikat ------------------------------------ */
  bas('8. Düzgün rəy');
  const c2 = await browser.newContext({ viewport: { width: 412, height: 880 } });
  const p2 = await ac(c2, 'Nərmin Əliyeva');
  await p2.click('.tab[data-go="answer"]');
  await p2.waitForSelector('.q');
  for (let q = 0; q < 3; q++) await p2.click('.opt[data-q="' + q + '"][data-o="' + DUZ[q] + '"]');
  await p2.click('#submit');
  await p2.waitForSelector('#s-result.on', { timeout: 8000 });

  check('sertifikat çıxdı', (await p2.locator('#cert').count()) === 1);
  check('təsdiq mətni', (await p2.locator('.verdict.ok').count()) === 1);
  const cert = await p2.locator('#cert').textContent();
  check('sertifikatda ad var', cert.includes('NƏRMİN'));
  check('sertifikatda qatilin adı yoxdur', !cert.includes('Səbinə') && !cert.includes('Hüseynova'));
  check('sertifikatda motiv yoxdur', !cert.includes('torpaq') && !cert.includes('Novxanı'));
  check('sertifikatda fiktivlik qeydi var', cert.includes('FİKTİV OYUN SƏNƏDİ'));
  check('paylaşma düyməsi var', (await p2.locator('#share').count()) === 1);

  /* Sertifikat kətanda həqiqətən çəkilirmi — SVG → JPEG. */
  const olcu = await p2.evaluate(async () => {
    const b = await window.DCERT.ogJpeg({ no: '2026/0847', title: 'T', name: 'Ad', minutes: 5, pinned: 2, stamp: ['İŞ', 'BAĞLANDI'] });
    return { size: b.size, type: b.type };
  });
  check('OG şəkli kətanda çəkilir', olcu.size > 3000 && olcu.type === 'image/jpeg', olcu);

  const story = await p2.evaluate(async () => {
    const b = await window.DCERT.storyPng({ no: '2026/0847', title: 'T', name: 'Ad', minutes: 5, pinned: 2 });
    return b.size;
  });
  check('story şəkli (1080×1920) çəkilir', story > 5000, story);

  /* --- 9. İrəliləyiş yenidən yüklənəndə qalır -------------------------- */
  bas('9. İrəliləyiş bazadadır');
  await p1.goto(BASE + '/is/' + SLUG + '/qovluq', { waitUntil: 'networkidle' });
  await p1.waitForSelector('#s-result.on, #s-index.on', { timeout: 8000 });
  check('səhv rəy verən istifadəçi nəticə ekranında qalır', await p1.locator('#s-result.on').isVisible());
  check('izah yenidən görünür', (await p1.locator('.expl p').count()) === 4);

  await p2.goto(BASE + '/is/' + SLUG + '/qovluq', { waitUntil: 'networkidle' });
  await p2.waitForSelector('#s-result.on', { timeout: 8000 });
  check('həll edən üçün sertifikat qalır', (await p2.locator('#cert').count()) === 1);

  await browser.close();
  console.log('\n' + pass + ' keçdi, ' + fail + ' uğursuz');
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error('XƏTA:', e.message); process.exit(1); });
