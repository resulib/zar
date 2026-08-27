const QRZ = require('../frontend/qr.js');
const QR = require('qrcode');

const samples = [
  'https://zarafat.az/r/ZRF-2026-9482',
  'https://zarafat.az/r/ZRF-2026-0001',
  'ZRF-2026-1234',
  'https://zarafat.az/r/ZRF-2026-9482?v=1',
  'Şəkərova Günel — ə,ğ,ı,ö,ş,ü',
  'https://zarafat-notariat-palatasi.az/reyestr/ZRF-2026-777777'
];

let fail = 0;
for (const s of samples) {
  const mine = QRZ.matrix(s);
  // Referansı da byte rejiminə məcbur edirik (node-qrcode default olaraq qarışıq segment optimallaşdırması edir)
  const ref = QR.create([{ data: s, mode: 'byte' }], { errorCorrectionLevel: 'M' });
  const refSize = ref.modules.size;
  const refData = ref.modules.data;

  if (mine.length !== refSize) {
    console.log(`FAIL (ölçü) "${s}": mənimki ${mine.length}, referans ${refSize}`);
    fail++; continue;
  }
  let diff = 0;
  for (let y = 0; y < refSize; y++)
    for (let x = 0; x < refSize; x++)
      if (mine[y][x] !== (refData[y * refSize + x] ? 1 : 0)) diff++;

  if (diff) { console.log(`FAIL "${s}": ${diff} modul fərqi (ölçü ${refSize})`); fail++; }
  else console.log(`OK   "${s.slice(0, 40)}" — v${(refSize - 17) / 4}, ${refSize}x${refSize}, tam uyğun`);
}
console.log(fail ? `\n${fail} test uğursuz` : '\nBütün testlər uğurlu ✓');
process.exit(fail ? 1 : 0);
