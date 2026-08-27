/* Tək fayllıq bundle-ın file:// rejimində işlədiyini yoxlayır */
const { chromium } = require('playwright');
const wait = ms => new Promise(r => setTimeout(r, ms));
let pass = 0, fail = 0;
const check = (n, c, x) => c ? (pass++, console.log('  ✓', n)) : (fail++, console.log('  ✗', n, x === undefined ? '' : JSON.stringify(x)));

(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1400, height: 1000 }, deviceScaleFactor: 2 });
  const errs = []; p.on('pageerror', e => errs.push(e.message));

  await p.goto('file:///root/zarafat/dist/zarafat-mvp.html');
  await wait(1000);

  check('36 şablon yüklənir', (await p.evaluate(() => TEMPLATES.length)) === 36);
  check('5 dizayn mövcuddur', (await p.evaluate(() => DOCGEN.LAYOUTS.length)) === 5);

  await p.fill('#fTo', 'Günel Şəkərova'); await p.fill('#fFrom', 'Elvin Məmmədov'); await wait(500);

  // hər dizaynı önizləmədə keçir
  for (const L of ['notarial', 'blank', 'diplom', 'sertifikat', 'lisenziya']) {
    await p.click(`[data-layout="${L}"]`); await wait(320);
    const n = await p.$eval('#preview svg', e => e.querySelectorAll('text,rect,path').length);
    check(`dizayn "${L}" render olunur (${n} element)`, n > 60, n);
  }

  await p.click('[data-tpl="weekend-pass"]'); await wait(300);
  await p.click('#btnCreate'); await wait(700);
  await p.click('#aPay'); await wait(400);
  await p.click('[data-pack="p3"]'); await wait(1100);
  const reg = (await p.$eval('#regBadge', e => e.textContent)).trim();
  check('sənəd yaradıldı və ödənildi', /^ZRF-\d{4}-\d{4}$/.test(reg), reg);

  await p.fill('#qReg', reg); await p.click('#btnSearch'); await wait(700);
  const msg = await p.$eval('#searchMsg', e => e.innerText);
  check('reyestr axtarışı işləyir', (/rəsmi/i.test(msg) && /olunub/i.test(msg)), msg.split('\n')[0]);

  check('brauzer xətası yoxdur', errs.length === 0, errs);
  console.log(`\n${pass} keçdi, ${fail} uğursuz`);
  await b.close();
  process.exit(fail ? 1 : 0);
})();
