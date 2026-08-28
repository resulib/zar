/* Uçdan-uca: real backend + brauzer */
const { chromium } = require('playwright');
const path = require('path');
const ROOT_DIR = path.join(__dirname, '..');
const { spawn } = require('child_process');
const fs = require('fs');

const DB = '/tmp/zarafat-e2e-' + Date.now() + '.db';
const env = Object.assign({}, process.env, {
  PORT: '3111', DB_PATH: DB, PUBLIC_URL: 'http://localhost:3111',
  FRONTEND_DIR: path.join(ROOT_DIR, 'frontend'), LOG_LEVEL: 'warn'
});

const srv = spawn('node', [path.join(ROOT_DIR, 'backend-node', 'server.js')], { env, stdio: ['ignore', 'pipe', 'pipe'] });
srv.stderr.on('data', d => process.stderr.write('[server] ' + d));

let pass = 0, fail = 0;
const check = (n, c, x) => c ? (pass++, console.log('  ✓', n)) : (fail++, console.log('  ✗', n, x === undefined ? '' : JSON.stringify(x)));

const wait = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  // serverin qalxmasını gözlə
  for (let i = 0; i < 40; i++) {
    try { const r = await fetch('http://localhost:3111/api/health'); if (r.ok) break; } catch (e) {}
    await wait(250);
  }

  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));

  await p.goto('http://localhost:3111/', { waitUntil: 'domcontentloaded' });
  await wait(900);

  check('server rejimi aşkarlanır', (await p.$eval('#modeBadge', e => e.textContent)).includes('Server'), await p.$eval('#modeBadge', e => e.textContent));

  await p.fill('#fTo', 'Günel Şəkərova');
  await p.fill('#fFrom', 'Elvin Məmmədov');
  await wait(400);
  await p.click('#btnCreate');
  await wait(900);

  let reg = (await p.$eval('#regBadge', e => e.textContent)).trim();
  check('backend qeydiyyat nömrəsi verdi', /^ZRF-\d{4}-\d{4}$/.test(reg), reg);

  // dizayn seçimi: layout + palitra dəyiş, backend-də saxlanmasını yoxla
  await p.click('[data-layout="lisenziya"]'); await wait(300);
  await p.click('[data-palette="forest"]'); await wait(400);
  await p.click('#btnCreate'); await wait(900);
  const reg2 = (await p.$eval('#regBadge', e => e.textContent)).trim();
  const mine = await (await fetch('http://localhost:3111/api/me/documents', {
    headers: { cookie: (await ctx.cookies()).map(c => c.name + '=' + c.value).join('; ') } })).json();
  const d2 = mine.find(x => x.regNo === reg2);
  check('dizayn backend-də saxlanılır', d2 && d2.layout === 'lisenziya' && d2.palette === 'forest', d2 && [d2.layout, d2.palette]);

  // rejim keçidi — kateqoriyalar və şablonlar tona görə süzülür
  await p.click('#modeSwitch button[data-mode="xatire"]'); await wait(700);
  check('xatirə rejimində 6 kateqoriya var', (await p.$$eval('#tabs button', b => b.length)) === 6);
  const xCards = await p.$$eval('#cards button', b => b.length);
  check('xatirə kateqoriyasında 12 kart var', xCards === 12, xCards);
  await p.click('#modeSwitch button[data-mode="zarafat"]'); await wait(700);
  check('zarafat rejiminə qayıdır', (await p.$$eval('#tabs button', b => b.length)) === 12);

  // şablon axtarışı
  await p.fill('#fSearch', 'kofe'); await wait(400);
  const found = await p.$$eval('#cards button', els => els.map(e => e.textContent));
  check('axtarış şablonu tapır', found.length >= 1 && found.length <= 3 && found.some(t => /Kofe/.test(t)), found.length);
  await p.fill('#fSearch', 'senedxxx'); await wait(400);
  check('nəticəsiz axtarış boş vəziyyət göstərir', await p.$eval('#cardsEmpty', e => !e.hidden));
  await p.fill('#fSearch', ''); await wait(300);

  // ilk sənədə qayıt
  await p.click('[data-tpl="weekend-pass"]'); await wait(400);
  await p.fill('#fTo', 'Günel Şəkərova'); await p.fill('#fFrom', 'Elvin Məmmədov'); await wait(400);
  await p.click('#btnCreate'); await wait(900);
  reg = (await p.$eval('#regBadge', e => e.textContent)).trim();

  // ödənişdən əvvəl reyestrdə olmamalıdır
  let api = await (await fetch('http://localhost:3111/api/registry/' + reg)).status;
  check('ödənişsiz sənəd reyestrdə yoxdur', api === 404, api);

  await p.click('#aPay'); await wait(400);
  await p.click('[data-pack="p1"]'); await wait(1200);
  check('balans düyməsi yeniləndi', (await p.$eval('#creditCount', e => e.textContent)) === '0', await p.$eval('#creditCount', e => e.textContent));
  check('HD yükləmə düyməsi çıxdı', !!(await p.$('#aHd')));

  const regJson = await (await fetch('http://localhost:3111/api/registry/' + reg)).json();
  check('ödənişdən sonra reyestrdə var', regJson.regNo === reg && regJson.paid === true, regJson);
  check('verifyUrl serverdən gəlir', regJson.verifyUrl === 'http://localhost:3111/r/' + reg, regJson.verifyUrl);

  // QR linkini birbaşa aç (skan simulyasiyası)
  const p2 = await ctx.newPage();
  await p2.goto('http://localhost:3111/r/' + reg, { waitUntil: 'domcontentloaded' });
  await wait(1600);
  const msg = await p2.$eval('#searchMsg', e => e.innerText);
  check('QR linki avtomatik təsdiq göstərir', (/rəsmi/i.test(msg) && /olunub/i.test(msg)), msg.split('\n')[0]);
  await p2.screenshot({ path: path.join(ROOT_DIR, 'tools', 'out-qr-landing.png') });
  await p2.close();

  // PNG eksportu (server rejimində)
  const b64 = await p.evaluate(async (r) => {
    const doc = await (await fetch('/api/registry/' + r)).json();
    const svg = DOCGEN.a4(doc, { idPrefix: 'ex' });
    const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));
    const img = new Image();
    await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = url; });
    const c = document.createElement('canvas'); c.width = 794 * 3; c.height = 1123 * 3;
    const cx = c.getContext('2d'); cx.fillStyle = '#fff'; cx.fillRect(0, 0, c.width, c.height);
    cx.drawImage(img, 0, 0, c.width, c.height);
    return c.toDataURL('image/png').split(',')[1];
  }, reg);
  fs.writeFileSync(path.join(ROOT_DIR, 'tools', 'out-e2e.png'), Buffer.from(b64, 'base64'));

  const { PNG } = require('pngjs'); const jsQR = require('jsqr');
  const png = PNG.sync.read(fs.readFileSync(path.join(ROOT_DIR, 'tools', 'out-e2e.png')));
  const q = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);
  check('eksport PNG-dəki QR reyestr linkinə aparır', q && q.data === 'http://localhost:3111/r/' + reg, q && q.data);

  // şikayət / silmə
  await p.click('#aReport'); await wait(300);
  await p.click('#repSend'); await wait(800);
  const after = await (await fetch('http://localhost:3111/api/registry/' + reg)).status;
  check('sahibi silən kimi reyestrdən çıxır', after === 404, after);

  check('brauzer xətası yoxdur', errs.length === 0, errs);

  console.log(`\n${pass} keçdi, ${fail} uğursuz`);
  await b.close(); srv.kill();
  process.exit(fail ? 1 : 0);
})();
