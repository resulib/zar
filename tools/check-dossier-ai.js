/* «AI ilə iş qur» — uçdan-uca, real brauzerdə.

   Test OpenAI-yə ÇIXMIR: bu fayl özü lokal saxta OpenAI serveri qaldırır və
   backend-in ona baxdığını gözləyir. Serveri belə başladın:

     cd backend-php
     OPENAI_API_KEY=sk-test \
     OPENAI_ENDPOINT=http://127.0.0.1:8097/v1/chat/completions \
     php artisan serve --port=8096

   sonra:  npm run test:dossier-ai

   Yoxlanan əsas iddia: MODELƏ ETİBAR EDİLMİR. Cavabda emoji, markdown
   başlığı, real qurum adı, siyahıdan kənar qatil indeksi, təkrarlanan vərəq
   nömrəsi və uydurma blank növü var — hamısı ya təmizlənməli, ya da
   xəbərdarlığa çevrilməlidir. Üz qabığı isə ümumiyyətlə modeldən
   soruşulmur. */
'use strict';
const http = require('http');
const { chromium } = require('playwright');

const B     = (process.argv[2] || 'http://127.0.0.1:8096').replace(/\/$/, '');
const FAKE  = Number(process.env.FAKE_PORT || 8097);
const EMAIL = process.argv[3] || 'admin@zarafat.az';
const PASS  = process.argv[4] || 'admin12345';
const SAY   = 8;

let pass = 0, fail = 0;
const check = (n, c, x) => c ? (pass++, console.log('  \x1b[32m✓\x1b[0m ' + n))
                             : (fail++, console.log('  \x1b[31m✗\x1b[0m ' + n + (x === undefined ? '' : ' → ' + JSON.stringify(x).slice(0, 260))));
const bas = t => console.log('\n' + t);

/* ---------- saxta model cavabları ---------- */
const ADLAR = ['Aygün Məmmədova', 'Rəşad Quliyev', 'Nurlan Əliyev', 'Səidə Vəliyeva'];

const SKELET = {
  title: 'Anbarda gecə növbəsi 😀',
  place: 'Sumqayıt, 3-cü sənaye zolağı',
  period: '14 sentyabr 2026, gecə',
  blurb: 'Anbardar gecə növbəsində ölü tapılır.',
  intro: 'Zəng saat 04:12-də daxil olub. Anbarın qapısı içəridən bağlı idi.',
  suspects: ADLAR.map((name, i) => ({
    init: name.split(' ').map(w => w[0]).join(''),
    name,
    role: (28 + i * 4) + ' yaş · anbar işçisi',
    bio: 'Gecə növbəsində binada olub.',
    camera: '0' + (i + 1) + ':1' + i + '-də kameraya düşüb',
    bars: [[i * 10, 30]],
  })),
  /* Siyahıdan KƏNAR indeks — normallaşdırma onu sıfıra çəkməlidir. */
  culprit: 9,
  motive: 'Anbardan aparılan malın üstü açılırdı',
  motive_wrong: ['Şəxsi borc', 'Köhnə mübahisə', 'Növbə cədvəli'],
  proof: 'Növbə jurnalı və kamera çıxarışı',
  proof_wrong: ['Qəbz və zəng detallaşdırması', 'Ekspert rəyi və sxem', 'İzahat və qapı jurnalı'],
  chronology: [['23:40', 'Növbə təhvil verilir'], ['00:15', 'İşıq kəsilir'], ['04:12', 'Zəng daxil olur']],
  axis: ['23:30', '01:30', '05:00'],
  solution: ['Birinci abzas.', 'İkinci abzas.', 'Üçüncü abzas.'],
  documents: Array.from({ length: SAY }, (_, i) => ({
    name: 'Sənəd ' + (i + 1),
    kind: i === 0 ? 'Qərar' : 'Protokol',
    /* Uydurma növ — ağ siyahıdan keçməlidir. */
    doc_type: i === 1 ? 'uydurma-nov' : 'protocol',
    blank_nov: i === 1 ? 'yalan-blank' : 'protokol',
    brief: 'Bu vərəqin tapşırığı.',
  })),
  lock: { code: '69-18', hint: 'Rəqəmlər iki vərəqdə gizlənib.', doc: SAY, sources: [2, 3, 99] },
};

/* Bir vərəq QƏSDƏN buraxılır (no: 3 yoxdur) — dövrə bağlanmamalıdır. */
const SENEDLER = no => ({
  documents: no.filter(n => n !== 3).map(n => ({
    no: n,
    meta_line: 'Protokol № ' + n + ' · 14.09.2026',
    body: '## Başlıq\n- siyahı nişanı\nSaat **23:40**-da növbə təhvil verildi. 🚔\n\n[[Qeyd: saat uyğun gəlmir.]]',
  })),
});

let cagirisSayi = 0;

const server = http.createServer((req, res) => {
  let govde = '';
  req.on('data', d => { govde += d; });
  req.on('end', () => {
    cagirisSayi++;
    const istek = JSON.parse(govde || '{}');
    const ad = ((istek.response_format || {}).json_schema || {}).name || '';

    let cavab;

    if (ad === 'is_qovlugu_skeleti') {
      cavab = SKELET;
    } else {
      /* Hansı vərəqlərin istəndiyini istifadəçi mesajından çıxarırıq. */
      const metn = (istek.messages || []).map(m => m.content).join('\n');
      const no = [...metn.matchAll(/#(\d+) ·/g)].map(m => Number(m[1]));
      cavab = SENEDLER(no);
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      model: 'gpt-saxta',
      usage: { prompt_tokens: 10, completion_tokens: 20 },
      choices: [{ message: { content: JSON.stringify(cavab) } }],
    }));
  });
});

(async () => {
  await new Promise(r => server.listen(FAKE, r));

  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1500, height: 1000 } });
  const p = await ctx.newPage();

  bas('1. Giriş');
  await p.goto(B + '/admin/giris');
  await p.fill('input[name="email"]', EMAIL);
  await p.fill('input[name="password"]', PASS);
  await p.click('button[type="submit"]');
  await p.waitForLoadState('networkidle');
  check('admin panelinə giriş', !p.url().includes('/giris'), p.url());

  await p.goto(B + '/admin/qovluqlar');
  check('AI paneli göstərilir', await p.locator('#qvAi').count() === 1);

  bas('2. İş qurulur');
  await p.click('#qvAi > summary');
  await p.fill('#qvAiBrief', 'Sumqayıtda anbarda gecə növbəsində ölüm.');
  await p.fill('#qvAiSay', String(SAY));
  await p.selectOption('#qvAiCetin', 'cetin');
  await p.click('#qvAiBasla');

  await p.waitForURL(/\/admin\/qovluqlar\/\d+$/, { timeout: 60000 });
  check('redaktora keçildi', /\/admin\/qovluqlar\/\d+$/.test(p.url()), p.url());
  /* Bir skelet + partiyalar. */
  check('bir neçə çağırış edildi', cagirisSayi >= 1 + Math.ceil(SAY / 4), cagirisSayi);

  bas('3. Hekayə qurulub');
  check('ad qoyulub', (await p.inputValue('input[name="title"]')).includes('Anbarda'));
  check('emoji silinib', !(await p.inputValue('input[name="title"]')).includes('😀'));
  check('çətinlik seçilib', (await p.inputValue('select[name="difficulty"]')) === 'cetin');
  check('qaralamadır', (await p.inputValue('select[name="status"]')) === 'draft');

  await p.click('.qv-tab[data-tab="subheliler"]');
  /* «Yeni şübhəli» forması da ad sahəsi daşıyır — qatil bayrağı yalnız
     mövcud kartlardadır. */
  check('dörd şübhəli var',
    await p.locator('.qv-panel[data-panel="subheliler"] input[name="is_culprit"]').count() === 4);
  /* Model 9 verdi — siyahıdan kənar indeks sıfıra çəkilməlidir. */
  check('qatil bir nəfərdir',
    await p.locator('.qv-panel[data-panel="subheliler"] input[name="is_culprit"]:checked').count() === 1);
  check('qatil birinci şübhəlidir',
    (await p.locator('.qv-panel[data-panel="subheliler"] .qv-rejim').innerText()).includes(ADLAR[0]));

  await p.click('.qv-tab[data-tab="hekaye"]');
  check('xronologiya var', (await p.inputValue('textarea[name="chronology"]')).includes('23:40'));
  check('alibi oxu üç sətirdir',
    (await p.inputValue('textarea[name="axis"]')).trim().split('\n').length === 3);
  check('həll var', (await p.inputValue('textarea[name="solution"]')).includes('Birinci abzas'));

  await p.click('.qv-tab[data-tab="cavab"]');
  check('üç sual qurulub', await p.locator('.qv-panel[data-panel="cavab"] select[name="correct"]').count() === 3);
  const q1 = await p.locator('.qv-panel[data-panel="cavab"] select[name="correct"] option:checked').first().innerText();
  check('birinci sualın cavabı qatildir', q1.includes(ADLAR[0]), q1);

  bas('4. Vərəqlər');
  await p.click('.qv-tab[data-tab="senedler"]');
  check('istənilən sayda vərəq var', await p.locator('#qvSenedler .qv-row').count() === SAY, SAY);
  check('vərəq nömrələri təkrarlanmır',
    new Set(await p.locator('#qvSenedler .qv-no').allTextContents()).size === SAY);
  check('bir vərəq kilidlidir', await p.locator('#qvSenedler .qv-kilid').count() === 1);

  /* Birinci vərəqin mətni: emoji, markdown başlığı və siyahı nişanı getməli. */
  await p.locator('#qvSenedler .qv-ad').first().click();
  await p.waitForLoadState('networkidle');
  await p.waitForTimeout(2200);
  const govde = await p.inputValue('#qvBody');
  check('mətn yazılıb', govde.includes('növbə təhvil verildi'), govde.slice(0, 80));
  check('emoji silinib', !govde.includes('🚔'));
  check('markdown başlığı silinib', !govde.includes('## '));
  check('siyahı nişanı silinib', !/^- /m.test(govde));
  check('işarələr saxlanılıb', govde.includes('**23:40**') && govde.includes('[[Qeyd'));
  check('meta sətri yazılıb', (await p.inputValue('input[name="meta_line"]')).includes('Protokol №'));
  check('blank növü ağ siyahıdadır',
    ['resmi', 'qerar', 'arayis', 'protokol', 'ekspert', 'izahat']
      .includes(await p.inputValue('select[name="blank_nov"]')));

  const kadr = p.frameLocator('#qvOnizleme');
  check('vərəq render olunur', (await kadr.locator('.p-body').count()) >= 1);
  check('fiktivlik zolağı var', (await kadr.locator('.p-fiktiv').count()) === 1);
  check('üz qabığı büronundur', (await kadr.locator('.p-head').innerText()).includes('AFİB'));

  /* Model üçüncü vərəqi buraxmışdı — dövrə bağlanmamalı, sətir yazılmalıdır. */
  await p.goBack();
  await p.waitForLoadState('networkidle');
  await p.click('.qv-tab[data-tab="senedler"]');
  await p.locator('#qvSenedler .qv-ad').nth(2).click();
  await p.waitForLoadState('networkidle');
  check('buraxılan vərəq boş qalmır',
    (await p.inputValue('#qvBody')).includes('əl ilə yazın'), await p.inputValue('#qvBody'));

  bas('5. Yoxlayıcı və qurum qalxanı');
  await p.goBack();
  await p.waitForLoadState('networkidle');
  const rapor = await p.locator('.qv-rapor').innerText();
  check('yoxlama paneli işləyir', rapor.length > 0);
  check('dərcə mane olan xəta yoxdur', await p.locator('.qv-xeta').count() === 0, rapor.slice(0, 200));

  /* Üz qabığı MODELDƏN soruşulmur — `Byuro` sabitlərindən qurulur. */
  const oyun = await ctx.newPage();
  const slug = (await p.inputValue('input[name="slug"]'));
  await p.click('.qv-tab[data-tab="umumi"]');
  await p.selectOption('select[name="status"]', 'published');
  await p.click('.qv-panel[data-panel="umumi"] button[type="submit"]');
  await p.waitForLoadState('networkidle');
  check('AI işi dərc oluna bilir', (await p.inputValue('select[name="status"]')) === 'published');

  await oyun.goto(B + '/is/' + slug);
  const teq = await oyun.locator('body').innerText();
  check('təqdimat səhifəsi açılır', teq.includes('Anbarda'), teq.slice(0, 200));
  check('real qurum adı yoxdur',
    !/DAXİLİ İŞLƏR|POLİS BÖLMƏSİ|prokurorluq/i.test(teq));
  await oyun.close();

  bas('6. Təmizlik');
  await p.click('.qv-tab[data-tab="umumi"]');
  await p.selectOption('select[name="status"]', 'draft');
  await p.click('.qv-panel[data-panel="umumi"] button[type="submit"]');
  await p.waitForLoadState('networkidle');
  await p.goto(B + '/admin/qovluqlar');
  await p.locator('tr', { hasText: 'Anbarda' }).first().locator('button:has-text("Sil")').click();
  await p.waitForLoadState('networkidle');
  check('sınaq işi silindi', await p.locator('tr', { hasText: 'Anbarda' }).count() === 0);

  await browser.close();
  server.close();
  console.log('\n' + pass + ' keçdi, ' + fail + ' uğursuz');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); server.close(); process.exit(1); });
