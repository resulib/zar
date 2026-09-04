/* Sosial kimlik kartı axını — REAL BRAUZERDƏ, uçdan-uca.
   İşlətmək: php artisan serve --port=8099 sonra
             node tools/check-sosial-flow.js [http://127.0.0.1:8099]
             (npm run test:sosial-flow)

   Serverli testdir (`check-devet-view.js` kimi): link → profil → panel →
   kart → yaratma → dərc → reyestr səhifəsi → PNG/PDF ixracı.

   Kənar platformaya real sorğu gedir. Bloklansa da test sınmır: axın
   «ən yaxşı cəhd» üzərində qurulub və sahələr onsuz da əl ilə doldurulur. */
const { chromium } = require('playwright');
const B = process.argv[2] || process.env.ZARAFAT_URL || 'http://127.0.0.1:8099';

let pass = 0, fail = 0;
const ok = (n, c, x) => c ? (pass++, console.log('  ✓', n))
                          : (fail++, console.log('  ✗', n, x === undefined ? '' : JSON.stringify(x)));

(async () => {
  const br = await chromium.launch();
  const p  = await br.newPage({ viewport: { width: 1280, height: 1000 } });
  const errs = [];
  p.on('pageerror', e => errs.push(String(e)));
  p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });

  await p.goto(B + '/', { waitUntil: 'networkidle' });

  console.log('\n1. Giriş qutusu');
  ok('sosial qutu görünür', await p.isVisible('#sosialBox'));
  ok('kataloq yükləndi (6 kart)', await p.evaluate(() => window.SOSIAL_CARDS.length) === 6);

  console.log('\n2. Profil yapışdırılır (real TikTok linki)');
  await p.selectOption('#sosialPlat', 'tiktok');
  await p.fill('#sosialUrl', 'https://www.tiktok.com/@scout2015');
  await p.click('#sosialGo');
  await p.waitForSelector('#socialPanel:not([hidden])', { timeout: 20000 });

  ok('panel açıldı', await p.isVisible('#socialPanel'));
  ok('istifadəçi adı paneldə', (await p.textContent('.sos-id strong')).includes('@scout2015'));
  ok('platforma paneldə', (await p.textContent('.sos-id span')) === 'TikTok');
  const nameVal = await p.inputValue('input[data-sos="name"]');
  ok('ad avtomatik gəldi', nameVal.length > 0, nameVal);
  ok('izləyici sahəsi boş və redaktə edilə bilir',
     (await p.inputValue('input[data-sos="followers"]')) === '');
  ok('ad sahələri gizlədilib (profildən gəlir)', await p.isHidden('#fNamesRow'));
  ok('zolaq platforma seçicisinə çevrildi',
     (await p.$$eval('#tabs button', b => b.map(x => x.dataset.sk))).join() === 'tiktok,instagram');
  ok('kartlar SOS- kodu ilə', (await p.textContent('#cards .code')).startsWith('SOS-'));

  console.log('\n2b. Dizayn seçicisi kart stillərinə çevrildi');
  ok('etiket «Kartın stili»', (await p.textContent('#designLabel')) === 'Kartın stili');
  ok('3 stil düyməsi', (await p.$$eval('#layoutPicker button', b => b.map(x => x.dataset.cardstyle))).join() === 'resmi,tund,sade');
  ok('6 palitra qalır', (await p.$$eval('#palettePicker button', b => b.length)) === 6);

  console.log('\n3. Sahələr doldurulur → önizləmə');
  await p.fill('input[data-sos="followers"]', '12437');
  await p.fill('input[data-sos="posts"]', '284');
  await p.fill('input[data-sos="following"]', '391');
  await p.waitForTimeout(500);
  let svg = await p.innerHTML('#preview');
  ok('A4 sənəd DEYİL — kart ölçüsü 1080×1350', /width="1080" height="1350"/.test(svg));
  ok('iki üzlü: ÖN və ARXA', svg.includes('ÖN / FRONT') && svg.includes('ARXA / BACK'));
  ok('kart başlığı önizləmədə', svg.includes('SOSİAL KİMLİK KARTI'));
  ok('platforma nişanı çəkilib', svg.includes('data-sl="1"'));
  ok('izləyici sayı formatlanıb (12,4 K)', svg.includes('12,4 K'));
  ok('kartdakı hər sahə paneldən doldurula bilir', svg.includes('284') && svg.includes('391'));
  ok('parodiya nişanları yerində', svg.includes('data-wm=') && svg.includes('data-dc='));

  console.log('\n3b. Kart stili dəyişdirilir');
  await p.click('#layoutPicker button[data-cardstyle="tund"]');
  await p.waitForTimeout(400);
  const dark = await p.innerHTML('#preview');
  ok('tünd stil tətbiq olundu', dark.includes('#0e1420') && dark !== svg);
  await p.click('#layoutPicker button[data-cardstyle="resmi"]');
  await p.waitForTimeout(400);

  console.log('\n4. Avatar yüklənir');
  const png = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
  await p.setInputFiles('#sosAvatar', { name: 'a.png', mimeType: 'image/png', buffer: png });
  await p.waitForTimeout(700);
  svg = await p.innerHTML('#preview');
  ok('avatar sənədə data URI kimi düşdü', svg.includes('<image href="data:image/jpeg;base64,'));
  ok('paneldə şəkil göstərilir', await p.isVisible('.sos-av img'));

  console.log('\n5. Sənəd yaradılır');
  await p.click('#btnCreate');
  await p.waitForFunction(() => !/————/.test(document.getElementById('regBadge').textContent), null, { timeout: 15000 });
  const reg = (await p.textContent('#regBadge')).trim();
  ok('reyestr nömrəsi SOS prefiksi ilə', /^SOS-\d{4}-\d{4}$/.test(reg), reg);

  console.log('\n6. Kredit alınır və dərc olunur');
  /* Real axın: «Reyestrə yaz» → kredit yoxdursa ödəniş pəncərəsi → paket seçimi
     → paket avtomatik dərci davam etdirir (renderPacks içindəki payFlow). */
  await p.click('#aPay');
  await p.waitForSelector('#payModal:not([hidden]) #packs button', { timeout: 10000 });
  await p.click('#packs button[data-pack="p3"]');
  await p.waitForSelector('#aHd', { timeout: 25000 });
  ok('sənəd dərc olundu', await p.isVisible('#aHd'));

  console.log('\n7. Reyestr səhifəsi /r/' + reg);
  const v = await br.newPage({ viewport: { width: 1280, height: 1200 } });
  const verrs = [];
  v.on('pageerror', e => verrs.push(String(e)));
  await v.goto(B + '/r/' + reg, { waitUntil: 'networkidle' });
  await v.waitForSelector('#doc:not([hidden])', { timeout: 15000 });
  await v.waitForTimeout(1200);
  const vsvg = await v.innerHTML('#doc');
  ok('reyestrdə də kart ölçüsündədir', /width="1080" height="1350"/.test(vsvg));
  ok('kart reyestrdə çəkilir', vsvg.includes('SOSİAL KİMLİK KARTI'));
  ok('istifadəçi adı reyestrdə', vsvg.includes('@scout2015'));
  ok('izləyici sayı reyestrdə', vsvg.includes('12,4 K'));
  ok('avatar reyestrdə bərpa olundu', vsvg.includes('<image href="data:image/jpeg;base64,'));
  ok('parodiya nişanları reyestrdə', vsvg.includes('data-wm=') && vsvg.includes('data-dc='));
  ok('baxış səhifəsində JS xətası yoxdur', verrs.length === 0, verrs);

  console.log('\n8. PNG və PDF ixracı');
  const exp = await v.evaluate(async () => {
    const svg = document.querySelector('#doc svg').outerHTML;
    const png = await ZEXPORT.pngBlob(svg, DOCGEN.W, DOCGEN.H, 2);
    const pdf = await ZEXPORT.pdfBlob(svg, DOCGEN.W, DOCGEN.H, 2, 'test');
    return { png: png.size, pdf: pdf.size };
  });
  ok('PNG ixracı işləyir (avatar kətanı çirkləndirmir)', exp.png > 40000, exp);
  ok('PDF ixracı işləyir', exp.pdf > 20000, exp);

  console.log('\n9. Rejimdən çıxış');
  await p.click('#sosExit');
  await p.waitForTimeout(400);
  ok('panel bağlandı', await p.isHidden('#socialPanel'));
  ok('etiket «Blank forması»-na qayıtdı', (await p.textContent('#designLabel')) === 'Blank forması');
  ok('12 dizayn geri gəldi', (await p.$$eval('#layoutPicker button', b => b.length)) === 12);
  ok('adi sənəd yenə A4-dür', /width="794" height="1123"/.test(await p.innerHTML('#preview')));
  ok('adi kataloq qayıtdı', (await p.$$eval('#tabs button', b => b.length)) === 12);
  ok('redaktorda JS xətası yoxdur', errs.length === 0, errs.slice(0, 3));

  console.log('\n' + pass + ' keçdi · ' + fail + ' xəta');
  await br.close();
  process.exit(fail > 0 ? 1 : 0);
})().catch(e => { console.error('PARTLADI:', e.message); process.exit(1); });
