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

/* SIRA QAPISI: vərəqlər yalnız ardıcıl açılır, ona görə testin özü də
   qovluğu əvvəldən sona qədər keçməlidir. Şübhəlilər və yekun rəy lentləri
   bundan əvvəl bağlıdır. */
const gozle = async (page) => {
  await page.waitForSelector('#s-doc.on', { timeout: 8000 });
  await page.waitForFunction(() => {
    const b = document.querySelector('#docbody');
    return b && b.textContent.indexOf('Açılır…') < 0;
  }, { timeout: 8000 });
};

const hamsiniKec = async (page, say) => {
  for (let i = 0; i < say; i++) {
    await page.click('.tab[data-go="index"]');
    await page.locator('#list .docrow').nth(i).click();
    await gozle(page);
  }
};

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
  check('materialların adları görünür', (await p0.locator('.teq-siyahi li').count()) === 28);
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
  check('28 sənəd sıralanır', say === 28, say);
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

  /* --- 4b. Sıra qapısı ------------------------------------------------ */
  bas('4b. Sıra qapısı');
  check('vərəqin altında «Davam et» var', (await p1.locator('#davam').count()) === 1);
  check('«Davam et» növbəti vərəqi göstərir',
    (await p1.locator('#davam').getAttribute('data-i')) !== null);

  await p1.click('.tab[data-go="index"]');
  check('uzaqdakı vərəq bağlıdır',
    await p1.locator('#list .docrow').nth(5).evaluate(el => el.classList.contains('qapali')));
  check('birinci vərəq bağlı deyil',
    !(await p1.locator('#list .docrow').first().evaluate(el => el.classList.contains('qapali'))));

  /* Bağlı sətrə tıklamaq sənədi açmır — ekran materiallarda qalır.
     `force` lazımdır: sətir `aria-disabled` daşıyır və Playwright onu
     tıklanmaz sayır. Real brauzerdə klik BAŞ VERİR (`disabled` deyil),
     ona görə qarşısını alan JS qapısıdır — məhz onu yoxlayırıq. */
  await p1.locator('#list .docrow').nth(5).click({ force: true });
  await p1.waitForTimeout(400);
  check('bağlı vərəqə tıklamaq keçid vermir', await p1.locator('#s-index.on').isVisible());

  /* QƏRARI SERVER VERİR: ünvan birbaşa çağırılanda da 403 qayıdır. */
  const uzaq = await p1.evaluate(async (slug) => {
    const r = await fetch('/api/is/' + slug + '/sened/' + window.DOSSIER.docs[5].id,
      { credentials: 'same-origin', headers: { Accept: 'application/json' } });
    return r.status;
  }, SLUG);
  check('server uzaq vərəqi 403 ilə rədd edir', uzaq === 403, uzaq);

  check('şübhəlilər lenti bağlıdır',
    await p1.locator('.tab[data-go="suspects"]').evaluate(el => el.classList.contains('kilidli')));
  check('yekun rəy lenti bağlıdır',
    await p1.locator('.tab[data-go="answer"]').evaluate(el => el.classList.contains('kilidli')));
  await p1.locator('.tab[data-go="answer"]').click({ force: true });
  await p1.waitForTimeout(300);
  check('bağlı lentə tıklamaq keçid vermir', !(await p1.locator('#s-answer.on').isVisible()));

  /* Sahə bloku növbəti vərəqdədir — eyni komponent, başqa sıra.
     «Davam et» ilə keçirik: düymənin özü də bu yolla yoxlanılır. */
  await p1.click('.tab[data-go="index"]');
  await p1.locator('#list .docrow').first().click();
  await gozle(p1);
  await p1.click('#davam');
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
  await hamsiniKec(p1, say);
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
  check('bütün vərəqlərdən sonra rəy lenti açılır',
    !(await p1.locator('.tab[data-go="answer"]').evaluate(el => el.classList.contains('kilidli'))));
  check('şübhəlilər lenti də açılır',
    !(await p1.locator('.tab[data-go="suspects"]').evaluate(el => el.classList.contains('kilidli'))));
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
  /* İŞİN SONLUĞU cəhdlər bitəndə də açılır — uduzan oyunçu hekayənin sonunu
     bilmədən qalmasın. Blok `.expl`-dən KƏNARDADIR, ona görə yuxarıdakı
     «izah dörd abzasdır» yoxlaması pozulmur. */
  check('sonluq vərəqləri açılır', (await p1.locator('.son-list .son-row').count()) === 2);
  check('rədd mətni görünür', (await p1.locator('.verdict.no').count()) === 1);

  /* --- 8. Düzgün rəy və sertifikat ------------------------------------ */
  bas('8. Düzgün rəy');
  const c2 = await browser.newContext({ viewport: { width: 412, height: 880 } });
  const p2 = await ac(c2, 'Nərmin Əliyeva');
  await hamsiniKec(p2, say);
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
  bas('8b. İşin sonluğu');
  /* Materiallar siyahısında GÖRÜNMÜR, nəticə ekranında görünür. */
  check('siyahıda hələ də 28 vərəq var', (await p2.locator('#list .docrow').count()) === 28);
  check('nəticədə iki sonluq vərəqi var', (await p2.locator('.son-list .son-row').count()) === 2);

  const sonAd = await p2.locator('.son-row .son-ad').first().innerText();
  await p2.locator('.son-row').first().click();
  await gozle(p2);
  check('sonluq vərəqi açılır', (await p2.locator('#ttl').innerText()) === sonAd, sonAd);
  check('vərəqdə fiktivlik zolağı var', (await p2.locator('.p-fiktiv').count()) === 1);
  check('vərəqdə möhür var', (await p2.locator('.p-mohur').count()) >= 1);
  check('dindirilmə sual-cavabdır', (await p2.locator('#docbody').innerText()).includes('Sual:'));
  check('«Nəticəyə qayıt» düyməsi var', (await p2.locator('#geriNetice').count()) === 1);

  await p2.click('#geriNetice');
  check('nəticə ekranına qayıdır', (await p2.locator('#s-result.on').count()) === 1);

  await p2.locator('.son-row').nth(1).click();
  await gozle(p2);
  const hokm = await p2.locator('#docbody').innerText();
  check('məhkəmə qərarı açılır', hokm.includes('MƏHKƏMƏ'), hokm.slice(0, 80));
  check('həbs müddəti yazılıb', /\d+\s*\([^)]+\)\s*il/u.test(hokm), hokm.slice(0, 200));
  await p2.click('#geriNetice');

  bas('8c. Sonluq həll olunmadan bağlıdır');
  const c3 = await browser.newContext({ viewport: { width: 412, height: 880 } });
  const bagli = await ac(c3, 'Kənar Adam');
  const xam2 = await bagli.content();
  check('sonluq vərəqinin adı HTML-də yoxdur', xam2.indexOf('dindirilmə protokolu') < 0);
  check('məhkəmə qərarı HTML-də yoxdur', xam2.indexOf('Məhkəmə qərarı') < 0);
  const spoilerId = await p2.locator('.son-row').first().getAttribute('data-i');
  const cavab = await bagli.evaluate(async (id) => {
    const r = await fetch('/api/is/2026-0847/sened/' + id);
    return r.status;
  }, spoilerId);
  check('həll olunmadan sonluq 403 verir', cavab === 403, cavab);
  await c3.close();

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
