/* Sıxılmasız (store) ZIP yazarı — window.ZIPZ.

   Kitabxana əlavə etmirik: layihədə PDF, QR və Code-39 də əl ilə yazılıb,
   üstəlik burada sıxılma onsuz da mənasızdır — PNG faylları artıq
   sıxılmışdır və deflate onları kiçiltmir, sadəcə vaxt aparardı.

   Tarix sabitdir: eyni siyahı həmişə eyni arxivi versin (doc.js-dəki
   «Date.now() işlətmə» qaydası ilə eyni səbəb). */
(function (root) {
  'use strict';

  /* CRC-32 cədvəli bir dəfə qurulur. */
  var TABLE = (function () {
    var t = new Uint32Array(256), c, n, k;
    for (n = 0; n < 256; n++) {
      c = n;
      for (k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      t[n] = c >>> 0;
    }
    return t;
  })();

  function crc32(u8) {
    var c = 0xFFFFFFFF;
    for (var i = 0; i < u8.length; i++) c = TABLE[(c ^ u8[i]) & 0xFF] ^ (c >>> 8);
    return (c ^ 0xFFFFFFFF) >>> 0;
  }

  function yaz(arr, off, v, bayt) {
    for (var i = 0; i < bayt; i++) arr[off + i] = (v >>> (i * 8)) & 0xFF;
  }

  var UTF8 = new TextEncoder();

  /* MS-DOS tarix/saat formatı: 2026-01-01 00:00 */
  var DOS_TIME = 0;
  var DOS_DATE = ((2026 - 1980) << 9) | (1 << 5) | 1;

  /**
   * fayllar — [{ ad: 'x.png', data: Uint8Array }]
   * qaytarır: Blob (application/zip)
   */
  function qur(fayllar) {
    var yerli = [], merkez = [], off = 0, i;

    for (i = 0; i < fayllar.length; i++) {
      var f = fayllar[i];
      var ad = UTF8.encode(f.ad);
      var data = f.data;
      var crc = crc32(data);

      var lh = new Uint8Array(30 + ad.length);
      yaz(lh, 0, 0x04034B50, 4);      // yerli başlıq imzası
      yaz(lh, 4, 20, 2);              // tələb olunan versiya
      yaz(lh, 6, 0x0800, 2);          // bayraq: ad UTF-8-dədir
      yaz(lh, 8, 0, 2);               // metod: store
      yaz(lh, 10, DOS_TIME, 2);
      yaz(lh, 12, DOS_DATE, 2);
      yaz(lh, 14, crc, 4);
      yaz(lh, 18, data.length, 4);    // sıxılmış ölçü
      yaz(lh, 22, data.length, 4);    // əsl ölçü
      yaz(lh, 26, ad.length, 2);
      yaz(lh, 28, 0, 2);              // əlavə sahə yoxdur
      lh.set(ad, 30);

      var ch = new Uint8Array(46 + ad.length);
      yaz(ch, 0, 0x02014B50, 4);      // mərkəzi kataloq imzası
      yaz(ch, 4, 20, 2);              // yaradan versiya
      yaz(ch, 6, 20, 2);
      yaz(ch, 8, 0x0800, 2);
      yaz(ch, 10, 0, 2);
      yaz(ch, 12, DOS_TIME, 2);
      yaz(ch, 14, DOS_DATE, 2);
      yaz(ch, 16, crc, 4);
      yaz(ch, 20, data.length, 4);
      yaz(ch, 24, data.length, 4);
      yaz(ch, 28, ad.length, 2);
      yaz(ch, 30, 0, 2);              // əlavə
      yaz(ch, 32, 0, 2);              // şərh
      yaz(ch, 34, 0, 2);              // disk
      yaz(ch, 36, 0, 2);              // daxili atributlar
      yaz(ch, 38, 0, 4);              // xarici atributlar
      yaz(ch, 42, off, 4);            // yerli başlığın yeri
      ch.set(ad, 46);

      yerli.push(lh, data);
      merkez.push(ch);
      off += lh.length + data.length;
    }

    var cdOlcu = 0;
    for (i = 0; i < merkez.length; i++) cdOlcu += merkez[i].length;

    var son = new Uint8Array(22);
    yaz(son, 0, 0x06054B50, 4);       // mərkəzi kataloqun sonu
    yaz(son, 4, 0, 2);
    yaz(son, 6, 0, 2);
    yaz(son, 8, fayllar.length, 2);
    yaz(son, 10, fayllar.length, 2);
    yaz(son, 12, cdOlcu, 4);
    yaz(son, 16, off, 4);            // mərkəzi kataloqun yeri
    yaz(son, 20, 0, 2);               // şərh yoxdur

    return new Blob(yerli.concat(merkez, [son]), { type: 'application/zip' });
  }

  root.ZIPZ = { qur: qur, crc32: crc32 };
})(typeof window !== 'undefined' ? window : this);
