/* ==================================================================
   Sənədin eksportu — PNG · PDF · nativ paylaşma.

   Həm redaktor səhifəsi (app.js), həm də baxış səhifəsi (viewer.js)
   bunu işlədir, ona görə ayrıca fayldır.

   Kitabxana yoxdur: PDF sıfırdan yazılıb, eynilə qr.js kimi.
   ================================================================== */
window.ZEXPORT = (function () {
  'use strict';

  /* SVG sətrini kətana çəkir. Kətan ağ ilə doldurulur — JPEG-in alfa kanalı
     yoxdur, şəffaf sahələr qara çıxardı. */
  function svgToCanvas(svg, w, h, scale) {
    return new Promise(function (res, rej) {
      var url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));
      var img = new Image();
      img.onload = function () {
        var c = document.createElement('canvas');
        c.width = Math.round(w * scale);
        c.height = Math.round(h * scale);
        var ctx = c.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, c.width, c.height);
        ctx.drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        res(c);
      };
      img.onerror = function (e) { URL.revokeObjectURL(url); rej(e); };
      img.src = url;
    });
  }

  function toBlob(canvas, mime, quality) {
    return new Promise(function (res, rej) {
      canvas.toBlob(function (b) { b ? res(b) : rej(new Error('toBlob boş')); }, mime, quality);
    });
  }

  function pngBlob(svg, w, h, scale) {
    return svgToCanvas(svg, w, h, scale).then(function (c) { return toBlob(c, 'image/png'); });
  }

  /* ---------------- PDF ----------------
     Tək A4 səhifə, içində bir JPEG. Altı obyekt:
       1 Catalog · 2 Pages · 3 Page · 4 məzmun axını · 5 şəkil · 6 Info

     `/CreationDate` QƏSDƏN yoxdur: verilmiş kətan üçün nəticə determinist
     qalsın (doc.js-dəki «Date.now() çağırma» intizamının davamı) və test
     quruluşu sabit yoxlaya bilsin. `/Producer` diakritikasız yazılır ki,
     UTF-16BE sətir kodlayıcısı lazım olmasın. */

  var A4_W = 595.28, A4_H = 841.89;   /* punktla — 794×1123 px ilə nisbət fərqi 0.04% */

  function pad10(n) { return ('0000000000' + n).slice(-10); }

  /* `o` — {pw, ph, producer}. Səhifə ölçüsü parametrdir, çünki dəvətnamə
     kartı A6-dır; `producer` də parametrdir ki, dəvətnamə PDF-inə kənar
     məhsulun adı düşməsin. Verilməsə köhnə davranış qalır (A4). */
  function buildPdf(jpg, cw, ch, title, o) {
    o = o || {};
    var PW = o.pw || A4_W, PH = o.ph || A4_H;
    var TE = new TextEncoder();
    var parts = [], len = 0, offs = [];

    function put(u8) { parts.push(u8); len += u8.length; }
    function putA(s) { put(TE.encode(s)); }
    function obj(n, body) { offs[n] = len; putA(n + ' 0 obj\n' + body + '\nendobj\n'); }

    putA('%PDF-1.4\n');
    /* Binar fayl işarəsi — XAM baytlarla: TextEncoder onları UTF-8-də ikiqat edərdi. */
    put(new Uint8Array([0x25, 0xE2, 0xE3, 0xCF, 0xD3, 0x0A]));

    obj(1, '<</Type/Catalog/Pages 2 0 R>>');
    obj(2, '<</Type/Pages/Kids[3 0 R]/Count 1>>');
    obj(3, '<</Type/Page/Parent 2 0 R/MediaBox[0 0 ' + PW + ' ' + PH + ']' +
           '/Resources<</XObject<</Im0 5 0 R>>/ProcSet[/PDF/ImageC]>>/Contents 4 0 R>>');

    var content = 'q\n' + PW + ' 0 0 ' + PH + ' 0 0 cm\n/Im0 Do\nQ\n';
    obj(4, '<</Length ' + TE.encode(content).length + '>>\nstream\n' + content + 'endstream');

    /* 5-ci obyekt yeganədir ki, binar məzmun daşıyır */
    offs[5] = len;
    putA('5 0 obj\n<</Type/XObject/Subtype/Image/Width ' + cw + '/Height ' + ch +
         '/ColorSpace/DeviceRGB/BitsPerComponent 8/Filter/DCTDecode/Length ' + jpg.length + '>>\nstream\n');
    put(jpg);
    putA('\nendstream\nendobj\n');

    obj(6, '<</Title(' + title + ')/Producer(' + (o.producer || 'Zarafat Notariat Palatasi') + ')>>');

    var xrefAt = len;
    var x = 'xref\n0 7\n0000000000 65535 f \n';
    for (var n = 1; n <= 6; n++) x += pad10(offs[n]) + ' 00000 n \n';
    /* `%%EOF` sonda yeni sətirsizdir — test `endsWith` ilə yoxlaya bilsin. */
    x += 'trailer\n<</Size 7/Root 1 0 R/Info 6 0 R>>\nstartxref\n' + xrefAt + '\n%%EOF';
    putA(x);

    return new Blob(parts, { type: 'application/pdf' });
  }

  /* Miqyas 3 → 2382×3369 (288 dpi). Zəif cihazda kətan alınmasa 2-yə enir. */
  function pdfBlob(svg, w, h, scale, title, o) {
    var q = 0.92;
    function attempt(s) {
      return svgToCanvas(svg, w, h, s)
        .then(function (c) { return canvasPdf(c, title, o); });
    }
    return attempt(scale).catch(function (e) {
      if (scale <= 2) throw e;
      return attempt(2);
    });
  }

  /* Hazır kətandan PDF. Dəvətnamə motoru birbaşa canvas-a çəkir (veb şriftlər
     SVG→<img> yolunda itdiyi üçün), ona görə SVG-siz giriş nöqtəsi lazımdır.
     `o` — {pw, ph, producer, quality}. */
  function canvasPdf(canvas, title, o) {
    o = o || {};
    return toBlob(canvas, 'image/jpeg', o.quality || 0.92)
      .then(function (b) { return b.arrayBuffer(); })
      .then(function (buf) {
        return buildPdf(new Uint8Array(buf), canvas.width, canvas.height,
                        safeName(title, o.fallback), o);
      });
  }

  /* Kağız ölçüləri punktla — buildPdf `pw`/`ph` gözləyir. */
  var PAGE = {
    a4: { pw: A4_W, ph: A4_H },
    a6: { pw: 297.64, ph: 419.53 },
    kvadrat: { pw: 419.53, ph: 419.53 }
  };

  /* ---------------- yükləmə ---------------- */

  function saveBlob(blob, name) {
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    /* 10 saniyə: iOS Quick Look blob-u klikdən sonra alır, tez ləğv etsək boş fayl açılır. */
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 10000);
  }

  function safeName(s, fallback) {
    return String(s == null ? '' : s).replace(/[^A-Za-z0-9-]+/g, '') || (fallback || 'sened');
  }

  /* ---------------- nativ paylaşma ----------------
     Yoxlama MÜTLƏQ fayl yükü ilə aparılmalıdır: masaüstü Chrome
     `navigator.share`-i açıq göstərir, amma faylı rədd edir. */

  function canShareFiles() {
    try {
      if (!navigator.canShare || !navigator.share || typeof File !== 'function') return false;
      var probe = new File([new Blob([new Uint8Array(1)])], 'a.png', { type: 'image/png' });
      return navigator.canShare({ files: [probe] });
    } catch (e) { return false; }
  }

  /* `url` QƏSDƏN göndərilmir: Instagram və WhatsApp `url` olduqda faylı
     sükutla atır. Link `text`-in içinə qoyulur. */
  function shareFile(blob, name, mime, meta) {
    if (!canShareFiles()) return Promise.reject({ code: 'unsupported' });
    var file = new File([blob], name, { type: mime });
    return navigator.share({ files: [file], title: meta.title || '', text: meta.text || '' });
  }

  /* İstifadəçi paylaşma vərəqini bağlayıbsa bu xəta deyil. */
  function isAbort(err) {
    if (!err) return false;
    if (err.name === 'AbortError') return true;
    return /abort|cancel/i.test(String(err.message || ''));
  }

  return {
    svgToCanvas: svgToCanvas,
    pngBlob: pngBlob,
    pdfBlob: pdfBlob,
    canvasPdf: canvasPdf,
    PAGE: PAGE,
    saveBlob: saveBlob,
    safeName: safeName,
    canShareFiles: canShareFiles,
    shareFile: shareFile,
    isAbort: isAbort,
    A4_W: A4_W, A4_H: A4_H
  };
})();
