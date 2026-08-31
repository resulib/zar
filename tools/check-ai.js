/* AI şablon köməkçisinin uçdan-uca yoxlaması.

   Test OpenAI-yə ÇIXMIR: bu fayl özü lokal saxta OpenAI serveri qaldırır
   (:8099) və backend-in ona baxdığını gözləyir. Ona görə serveri belə
   başladın:

     cd backend-php
     OPENAI_API_KEY=sk-test \
     OPENAI_ENDPOINT=http://127.0.0.1:8099/v1/chat/completions \
     AI_MODEL=gpt-5.5-mini \
     php artisan serve --port=8080

   sonra:  npm run test:ai
   Ünvan:  node tools/check-ai.js http://127.0.0.1:8080 [email] [parol]

   Yoxlanan əsas iddia: modelin cavabına ETİBAR EDİLMİR — emoji silinir,
   bəndlərin nömrəsi atılır, real qurum adı boşaldılır, variant siyahılarının
   birinci sətri şablonun öz mətninə bərabərləşdirilir, və nəticə serverin öz
   `templateSave()` yoxlamasından problemsiz keçir. */
'use strict';
const http = require('http');
const { chromium } = require('playwright');

const B     = (process.argv[2] || 'http://127.0.0.1:8080').replace(/\/$/, '');
const EMAIL = process.argv[3] || 'admin@zarafat.az';
const PASS  = process.argv[4] || 'admin12345';
const OUT   = process.env.AI_SHOT_DIR || null;

let pass = 0, fail = 0;
const check = (n, c, x) => c ? (pass++, console.log('  ✓', n))
                             : (fail++, console.log('  ✗', n, x === undefined ? '' : JSON.stringify(x).slice(0, 300)));
const bas = t => console.log('\n' + t);

const REPLY = {
  title: 'Gecə Saatlarında Xoruldama Fəaliyyətinə Dair Xüsusi Lisenziya',
  tag: 'Ən çox seçilən',
  preamble: '{from} tərəfindən {to} adlı şəxsə yaşayış sahəsinin yataq otağında gecə saat 23:00-dan səhər 07:00-dək xoruldama fəaliyyəti ilə məşğul olmaq üçün müddətli lisenziya verilir. Lisenziya üçüncü şəxslərin yuxu hüququnu məhdudlaşdırmır.',
  powers: [
    '1. Gecə ərzində ən çoxu iki dəfə səs həddini aşmaq hüququ verilir. 😀',
    '2. Yastığın dəyişdirilməsi tələbi rədd edilə bilməz.',
    '3. Yan çevrilmə xəbərdarlığı bir dəfə şifahi verilir.',
    '4. Səhər qəhvəsinin hazırlanması öhdəliyi lisenziya sahibinin üzərindədir.',
  ],
  penalty: 'Şərtlərin pozulması halında lisenziya dayandırılır və sahibi divanda yatmaq rejiminə keçirilir.',
  signOrg: 'Məişət Səs-Küyü üzrə Baş İdarə',
  signTitle: 'Baş İnspektor',
  share: 'Nəhayət rəsmiləşdirdim 🛂',
  titleOptions: ['Yataq Otağında Səs Rejiminə Dair Lisenziya', 'Xoruldama Fəaliyyəti üçün Müvəqqəti İcazə'],
  powersOptions: [
    'Qonaq gələndə səs həddi avtomatik olaraq yarıya endirilir.',
    'Yastığın dəyişdirilməsi tələbi rədd edilə bilməz.',
    'Televizorun səsini artırmaq əks-tədbir sayılmır.',
    'Səhər saatlarında şikayət qəbul edilmir.',
  ],
  penaltyOptions: ['Təkrar pozuntu halında lisenziya birdəfəlik ləğv edilir və divan rejimi tətbiq olunur.'],
};
const ANKET = {
  title: 'Ev İşlərinin Bölgüsünə Dair Rəsmi Öhdəlik Müqaviləsi',
  tag: 'Yeni',
  preamble: '{from} ilə {to} arasında {{otaq}} otağında {{ohdeler}} işlərinin yerinə yetirilməsi barədə razılıq əldə edilmişdir. Öhdəliyin icra müddəti {{muddet}} saatdır.',
  powers: ['Qab yumaq növbəsi pozula bilməz.', 'Zibil çıxarmaq öhdəliyi ötürülmür.',
           'Səhər durmaq növbəsi həftəlik dəyişir.', 'Bazarlıq siyahısı yazılı formada verilir.'],
  penalty: 'Öhdəlik pozulduqda növbəti həftənin bütün işləri pozan tərəfin üzərinə keçir.',
  signOrg: 'Məişət Öhdəlikləri üzrə Komissiya',
  signTitle: 'Baş Nəzarətçi',
  share: 'Rəsmiləşdirdik 📝',
  notes: ['Müqavilə şifahi formada dəyişdirilə bilməz.', 'Müqavilə şifahi formada dəyişdirilə bilməz.'],
  fields: [
    { k: 'Otaq', t: 'select', label: 'Hansı otaq', row: 'OTAQ',
      opts: ['Mətbəx', 'Qonaq otağı', 'Balkon'], min: -1, max: -1, unit: '', hint: '' },
    { k: 'ohdeler', t: 'multi', label: 'Öhdəliklər', row: '',
      opts: ['Qab yumaq', 'Zibil', 'Bazarlıq'], min: -1, max: -1, unit: '', hint: '' },
    { k: 'muddet', t: 'number', label: 'Neçə saat', row: 'MÜDDƏT',
      opts: [], min: 1, max: 48, unit: 'saat', hint: '' },
  ],
};

const fake = http.createServer((req, res) => {
  let body = '';
  req.on('data', c => (body += c));
  req.on('end', () => {
    const req_ = JSON.parse(body);
    const anket = req_.messages.some(m => m.content.indexOf('ANKET SXEMİ') >= 0);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      model: 'gpt-5.5-mini-2026-01-01',
      choices: [{ message: { content: JSON.stringify(anket ? ANKET : REPLY) } }],
      usage: { prompt_tokens: 1240, completion_tokens: 680 },
    }));
  });
});

(async () => {
  await new Promise(r => fake.listen(8099, r));

  const b = await chromium.launch();
  const page = await b.newPage({ viewport: { width: 1440, height: 1200 }, deviceScaleFactor: 2 });
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  await page.goto(B + '/admin/giris', { waitUntil: 'domcontentloaded' });
  await page.fill('input[name="email"]', EMAIL);
  await page.fill('input[name="password"]', PASS);
  await page.click('form[action*="giris"] button[type="submit"]');
  await page.waitForTimeout(900);

  bas('1. Parametrlər — model dəyişilir');
  await page.goto(B + '/admin/parametrler', { waitUntil: 'domcontentloaded' });
  check('AI paneli açıq görünür', (await page.$eval('.panel:has(#ai_model) .pill', e => e.textContent.trim())) === 'açıqdır');
  check('açar maskalanır', /^sk-•+ocal$/.test(await page.$eval('.panel:has(#ai_model) .mono', e => e.textContent.trim())),
    await page.$eval('.panel:has(#ai_model) .mono', e => e.textContent.trim()));
  await page.fill('#ai_model', 'gpt-5.5');
  await page.click('button:has-text("Modeli yadda saxla")'); await page.waitForTimeout(600);
  check('model saxlanıldı', (await page.$eval('#ai_model', e => e.value)) === 'gpt-5.5');
  await page.fill('#ai_model', 'pis model!!');
  await page.click('button:has-text("Modeli yadda saxla")'); await page.waitForTimeout(600);
  check('yanlış model adı rədd edilir', /yalnız hərf, rəqəm/.test(await page.content()));
  await page.fill('#ai_model', 'gpt-5.5-mini');
  await page.click('button:has-text("Modeli yadda saxla")'); await page.waitForTimeout(600);

  bas('2. Şablon forması — qaralama');
  await page.goto(B + '/admin/sablonlar/yeni', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  check('formada AI paneli var', (await page.$('#aiRun')) !== null);
  check('panel cari modeli göstərir', (await page.$eval('#aiModelName', e => e.textContent.trim())) === 'gpt-5.5-mini');

  await page.click('label[data-layout="lisenziya"]');
  await page.fill('#aiBrief', 'Gecə xoruldayan ər üçün lisenziya.');
  await page.click('#aiRun');
  await page.waitForTimeout(2500);

  const v = await page.evaluate(() => {
    const f = document.getElementById('tplForm').elements;
    const g = n => (f[n] ? f[n].value : null);
    return { title: g('title'), preamble: g('preamble'), powers: g('powers'), penalty: g('penalty'),
             org: g('sign_org'), share: g('share'), tag: g('tag'),
             tOpts: g('title_options'), pOpts: g('powers_options'), qOpts: g('penalty_options'),
             pMin: g('powers_min'), pMax: g('powers_max'),
             msg: document.getElementById('aiMsg').textContent.replace(/\s+/g, ' ').trim(),
             state: document.getElementById('aiState').textContent,
             model: document.getElementById('aiModelName').textContent };
  });

  check('başlıq dolduruldu', /Lisenziya$/.test(v.title), v.title);
  check('bəndlərdən nömrə silindi', /^Gecə ərzində/.test(v.powers.split('\n')[0]), v.powers.split('\n')[0]);
  check('emoji sənəd mətnindən silindi', v.powers.indexOf('😀') < 0);
  check('paylaşım mətnində emoji qaldı', v.share.indexOf('🛂') >= 0, v.share);
  check('4 bənd gəldi', v.powers.split('\n').length === 4, v.powers);
  check('uydurma qurum qaldı', v.org === 'Məişət Səs-Küyü üzrə Baş İdarə', v.org);
  check('titleOptions[0] = başlıq', v.tOpts.split('\n')[0] === v.title, v.tOpts.split('\n')[0]);
  check('ilk 4 bənd variantı öz bəndləridir',
    v.pOpts.split('\n').slice(0, 4).join('\n') === v.powers, v.pOpts);
  check('penaltyOptions[0] = cəza bəndi', v.qOpts.split('\n')[0] === v.penalty);
  check('powersMax 4-ü aşmır', +v.pMax <= 4 && +v.pMin >= 1, [v.pMin, v.pMax]);
  check('uğur mesajı göstərilir', /forma sahələrinə yazıldı/.test(v.msg), v.msg.slice(0, 120));
  check('token statistikası göstərilir', /1240 \+ 680/.test(v.state), v.state);
  check('serverin qaytardığı model adı yazılır', v.model === 'gpt-5.5-mini-2026-01-01', v.model);

  bas('3. Təmizləmə və önizləmə');
  const prev = await page.$eval('#prevDoc', e => e.textContent);
  check('önizləmə AI mətni ilə yenidən çəkildi', prev.indexOf('MƏİŞƏT SƏS-KÜYÜ') >= 0 || prev.indexOf('Məişət Səs-Küyü') >= 0,
    prev.slice(0, 160));
  check('vərəqdə xəbərdarlıq yoxdur / varsa görünür',
    (await page.$eval('#prevMsg', e => e.textContent)).length > 0);

  await page.evaluate(() => document.getElementById('aiRun').scrollIntoView({ block: 'start' }));
  await page.waitForTimeout(300);
  if (OUT) await page.screenshot({ path: OUT + '/ai-panel.png' });

  bas('4. Boş tapşırıq');
  await page.fill('#aiBrief', '');
  await page.click('#aiRun'); await page.waitForTimeout(400);
  check('boş tapşırıq bloklanır', /Əvvəlcə nə istədiyinizi yazın/.test(await page.$eval('#aiMsg', e => e.textContent)));

  bas('5. Anket rejimi');
  await page.goto(B + '/admin/sablonlar/yeni', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  await page.click('label[data-layout="muqavile"]');
  await page.selectOption('#aiMode', 'anket');
  await page.fill('#aiBrief', 'Ev işlərinin bölgüsü müqaviləsi, anketlə.');
  await page.click('#aiRun');
  await page.waitForTimeout(2500);

  check('anket kartları quruldu', (await page.$$eval('#fbList .fb-card', e => e.length)) === 3);
  await page.evaluate(() => { document.getElementById('fieldsRaw').open = true; });
  const fj = JSON.parse(await page.$eval('#fields', e => e.value));
  check('açar ASCII-yə salındı', fj[0].k === 'otaq', fj[0].k);
  check('multi üçün min/max quruldu', fj[1].min === 1 && fj[1].max === 3, fj[1]);
  check('təkrar qeyd atıldı',
    (await page.$eval('#notes', e => e.value)).split('\n').length === 1);
  check('anket rejimi variant siyahılarını boşaldır',
    (await page.$eval('#title_options', e => e.value)) === '');
  /* `muqavile` blankı cədvəli çəkmir (yalnız viza/ekspertiza çəkir) — anket
     cavabları bəndlərə düşür, ona görə yoxlama oradan aparılır. */
  check('anket cavabları önizləməyə düşür',
    (await page.$eval('#prevDoc', e => e.textContent)).indexOf('Qab yumaq') >= 0,
    (await page.$eval('#prevDoc', e => e.textContent)).slice(0, 200));

  bas('6. Qaralama serverin yoxlamasından keçir');
  const tslug = 'ai-sinaq-' + Date.now().toString(36).slice(-5);
  await page.selectOption('#category_id', { index: 0 });
  await page.fill('#slug', tslug);
  await page.click('button:has-text("Yadda saxla")');
  await page.waitForTimeout(1200);
  const saved = await page.evaluate(async (s) =>
    (await (await fetch('/api/catalog')).json()).templates.find(t => t.id === s), tslug);
  check('AI qaralaması serverin yoxlamasından keçir və saxlanılır', !!saved,
    (await page.$$eval('.flash li, .flash', e => e.map(x => x.textContent.trim()))).slice(0, 4));
  if (saved) {
    check('anket sxemi kataloqa düşür', Array.isArray(saved.fields) && saved.fields.length === 3, saved.fields);
    await page.goto(B + '/admin/sablonlar?q=' + tslug, { waitUntil: 'domcontentloaded' });
    await page.click('a:has-text("Redaktə")'); await page.waitForTimeout(900);
    await page.click('button:has-text("Şablonu sil")'); await page.waitForTimeout(800);
  }

  check('brauzer xətası yoxdur', errs.length === 0, errs);
  console.log(`\n${pass} keçdi, ${fail} uğursuz`);
  await b.close();
  fake.close();
  if (fail) console.log('Qeyd: backend saxta OpenAI ünvanı ilə başladılıbmı? Faylın başındakı əmrə baxın.');
  process.exit(fail ? 1 : 0);
})();
