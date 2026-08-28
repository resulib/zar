/* Tək fayllıq bundle-ın file:// rejimində işlədiyini yoxlayır */
const { chromium } = require('playwright');
const path = require('path');
const ROOT_DIR = path.join(__dirname, '..');
const wait = ms => new Promise(r => setTimeout(r, ms));
let pass = 0, fail = 0;
const check = (n, c, x) => c ? (pass++, console.log('  ✓', n)) : (fail++, console.log('  ✗', n, x === undefined ? '' : JSON.stringify(x)));

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1400, height: 1000 }, deviceScaleFactor: 2 });
  const errs = []; p.on('pageerror', e => errs.push(e.message));

  await p.goto('file://' + path.join(ROOT_DIR, 'dist', 'zarafat-mvp.html'));
  await wait(1000);

  const nTpl = await p.evaluate(() => TEMPLATES.length);
  const nCat = await p.evaluate(() => CATEGORIES.length);
  check(`${nTpl} şablon yüklənir`, nTpl === 216, nTpl);
  check(`${nCat} kateqoriya yüklənir`, nCat === 18, nCat);
  check('12 dizayn mövcuddur', (await p.evaluate(() => DOCGEN.LAYOUTS.length)) === 12);
  check('6 palitra mövcuddur', (await p.evaluate(() => DOCGEN.PALETTES.length)) === 6);

  await p.fill('#fTo', 'Günel Şəkərova'); await p.fill('#fFrom', 'Elvin Məmmədov'); await wait(500);

  // hər dizaynı önizləmədə keçir
  for (const L of await p.evaluate(() => DOCGEN.LAYOUTS)) {
    await p.click(`[data-layout="${L}"]`); await wait(320);
    const n = await p.$eval('#preview svg', e => e.querySelectorAll('text,rect,path').length);
    check(`dizayn "${L}" render olunur (${n} element)`, n > 60, n);
  }

  // rejim keçidi: kateqoriyalar, kartlar və sənədin tonu birdən dəyişir
  await p.click('#modeSwitch button[data-mode="xatire"]'); await wait(700);
  check('xatirə rejimində 6 kateqoriya', (await p.$$eval('#tabs button', b => b.length)) === 6);
  const xTxt = (await p.$eval('#preview', e => e.innerHTML)).replace(/<[^>]*>/g, '');
  check('xatirə sənədində PARODİYA yoxdur', xTxt.indexOf('PAROD') < 0);
  check('xatirə sənədində xatirə zolağı var', xTxt.indexOf('XATİRƏ MƏQSƏDLİDİR') >= 0);
  check('hüquqi qalxan hər iki tonda qalır', xTxt.indexOf('HÜQUQİ QÜVVƏYƏ MALİK DEYİL') >= 0);
  await p.click('#modeSwitch button[data-mode="zarafat"]'); await wait(700);
  check('zarafat rejiminə qayıdır', (await p.$$eval('#tabs button', b => b.length)) === 12);

  await p.click('[data-tpl="weekend-pass"]'); await wait(300);
  await p.click('#btnCreate'); await wait(700);
  await p.click('#aPay'); await wait(400);
  await p.click('[data-pack="p3"]'); await wait(1100);
  const reg = (await p.$eval('#regBadge', e => e.textContent)).trim();
  check('sənəd yaradıldı və ödənildi', /^ZRF-\d{4}-\d{4}$/.test(reg), reg);

  // viral şablon: anket, şablona xas prefiks və paylaşım mətni
  await p.click('#tabs button:has-text("Viral")'); await wait(400);
  await p.click('[data-tpl="cole-cixma-vizasi"]'); await wait(500);
  check('anket sahələri qurulur', (await p.$$eval('#fFields .field', e => e.length)) === 8);
  await p.selectOption('select[data-fk="teyinat"]', 'Mangal'); await wait(400);
  const vTxt = (await p.$eval('#preview', e => e.innerHTML)).replace(/<[^>]*>/g, '');
  check('anket cavabı sənədə düşür', vTxt.indexOf('Mangal') >= 0);
  check('viza dizaynı render olunur', vTxt.indexOf('VİZA / VISA') >= 0);
  await p.click('#btnCreate'); await wait(800);
  const vReg = (await p.$eval('#regBadge', e => e.textContent)).trim();
  check('şablona xas prefiks verilir', /^CCV-\d{4}-\d{4}$/.test(vReg), vReg);

  await p.fill('#qReg', reg); await p.click('#btnSearch'); await wait(700);
  const msg = await p.$eval('#searchMsg', e => e.innerText);
  check('reyestr axtarışı işləyir', (/rəsmi/i.test(msg) && /olunub/i.test(msg)), msg.split('\n')[0]);

  check('brauzer xətası yoxdur', errs.length === 0, errs);
  console.log(`\n${pass} keçdi, ${fail} uğursuz`);
  await b.close();
  process.exit(fail ? 1 : 0);
})();
