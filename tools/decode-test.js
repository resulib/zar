const QRZ = require('../frontend/qr.js');
const jsQR = require('jsqr');
const cases = [
  'https://zarafat.az/r/ZRF-2026-9482',
  'ZRF-2026-1234',
  'Şəkərova Günel — ə,ğ,ı,ö,ş,ü',
  'https://zarafat-notariat-palatasi.az/reyestr/ZRF-2026-777777'
];
let fail = 0;
for (const s of cases) {
  const m = QRZ.matrix(s);
  const q = 4, scale = 6, n = m.length, W = (n + q * 2) * scale;
  const buf = new Uint8ClampedArray(W * W * 4).fill(255);
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (m[y][x])
    for (let dy = 0; dy < scale; dy++) for (let dx = 0; dx < scale; dx++) {
      const px = ((y + q) * scale + dy) * W + ((x + q) * scale + dx);
      buf[px*4] = buf[px*4+1] = buf[px*4+2] = 0;
    }
  const r = jsQR(buf, W, W);
  const ok = r && r.data === s;
  if (!ok) fail++;
  console.log(ok ? 'SKAN OK  ' : 'SKAN FAIL', JSON.stringify(s.slice(0,45)), '->', r ? JSON.stringify(r.data.slice(0,45)) : 'null');
}
process.exit(fail ? 1 : 0);
