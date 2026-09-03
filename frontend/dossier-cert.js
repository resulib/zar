/* Sertifikat şəkli.
   İçində QATİLİN ADI, MOTİV və heç bir sənəd məzmunu yoxdur — bu şəkil
   Story-yə atılır və dostun oyununu korlamamalıdır. Yalnız iş nömrəsi,
   müstəntiqin adı, dəqiqə və sancılmış sənəd sayı görünür.

   Şrift adları ümumidir: SVG kətan üzərində rasterləşir və kətan
   @font-face ilə yüklənmiş şriftləri götürmür. */
(function (global) {
  'use strict';

  /* Tək dırnaq bilərəkdən: ad SVG atributunun içinə düşür və atribut cüt
     dırnaqla bağlanır — cüt dırnaqlı şrift adı XML-i pozar və şəkil
     ümumiyyətlə rasterləşməz. */
  var MONO = "'Courier New',Courier,monospace";
  var SANS = 'Helvetica,Arial,sans-serif';

  var C = {
    desk: '#191C1A', paper: '#E9E4D6', paper3: '#CFC6AE',
    ink: '#26221D', ink2: '#5D564A', buff: '#C2A468', stamp: '#5A3E8C'
  };

  var STORY = { w: 1080, h: 1920 };
  var OG = { w: 1200, h: 630 };

  /* Şəkil saytdan kənarda yaşayır — Story-yə atılır, WhatsApp önizləməsində
     görünür. Qeyd onun İÇİNDƏ olmalıdır, ətrafındakı səhifədə deyil.
     Mətn `App\Support\Dossier\Byuro::QEYD_QISA` ilə eynidir. */
  var FIKTIV = 'FİKTİV OYUN SƏNƏDİ · REAL RƏSMİ SƏNƏD DEYİL';
  var BASLIQ = 'AFİB · OYUN NƏTİCƏSİ';

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /* Azərbaycan hərflərində `toUpperCase()` düzgün işləyir, amma `i` hərfi
     `I` verir. Sertifikatda ad böyük hərflə yazılır, ona görə əl ilə. */
  function boyuk(s) {
    return String(s || '').replace(/i/g, 'İ').replace(/ı/g, 'I').toUpperCase();
  }

  function T(x, y, txt, o) {
    o = o || {};
    return '<text x="' + x + '" y="' + y + '"' +
      ' font-family="' + (o.sans ? SANS : MONO) + '"' +
      ' font-size="' + (o.size || 24) + '"' +
      ' font-weight="' + (o.weight || 400) + '"' +
      ' fill="' + (o.fill || C.ink) + '"' +
      ' text-anchor="' + (o.anchor || 'middle') + '"' +
      (o.spacing ? ' letter-spacing="' + o.spacing + '"' : '') +
      '>' + esc(txt) + '</text>';
  }

  /* Dairəvi möhür — üz qabığındakı möhürün eynisi, mətni məzmundan gəlir. */
  function mohur(cx, cy, r, lines) {
    var out = '<g transform="rotate(-9 ' + cx + ' ' + cy + ')">' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="' + C.stamp + '" stroke-width="' + (r * 0.038) + '" opacity="0.62"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r - r * 0.09) + '" fill="none" stroke="' + C.stamp + '" stroke-width="' + (r * 0.015) + '" opacity="0.62"/>';
    var fs = r * 0.19, top = cy - ((lines.length - 1) * fs * 0.72) / 2 + fs * 0.34;
    for (var i = 0; i < lines.length; i++) {
      out += T(cx, top + i * fs * 1.44, lines[i], { size: fs, weight: 600, fill: C.stamp, spacing: fs * 0.09 });
    }
    return out + '</g>';
  }

  function tile(x, y, w, h, deyer, etiket) {
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + C.paper + '" stroke="' + C.paper3 + '" stroke-width="2"/>' +
      T(x + w / 2, y + h * 0.52, deyer, { size: h * 0.34, weight: 600 }) +
      T(x + w / 2, y + h * 0.8, etiket, { size: h * 0.16, fill: C.ink2 });
  }

  /**
   * d = { no, title, name, minutes, pinned, stamp:[sətirlər], footer }
   * format = 'story' | 'og'
   */
  function svg(d, format) {
    d = d || {};
    var story = format !== 'og';
    var S = story ? STORY : OG;
    var m = story ? 70 : 40;
    var cx = S.w / 2;
    var cw = S.w - m * 2;
    var ch = S.h - m * 2;
    var stampLines = (d.stamp && d.stamp.length) ? d.stamp : ['İŞ', 'BAĞLANDI'];

    var out = '<svg xmlns="http://www.w3.org/2000/svg" width="' + S.w + '" height="' + S.h + '" viewBox="0 0 ' + S.w + ' ' + S.h + '">';
    out += '<rect width="' + S.w + '" height="' + S.h + '" fill="' + C.desk + '"/>';
    out += '<rect x="' + m + '" y="' + m + '" width="' + cw + '" height="' + ch + '" fill="' + C.paper + '"/>';

    if (story) {
      var y = m + 190;
      out += T(cx, y, BASLIQ, { size: 30, weight: 500, fill: C.ink2, spacing: 5 });
      out += T(cx, y + 130, 'İŞ AÇILDI', { size: 92, weight: 600 });
      out += T(cx, y + 200, 'İş № ' + (d.no || ''), { size: 34, fill: C.ink2 });
      out += T(cx, y + 258, d.title || '', { size: 30, fill: C.ink2 });

      var tw = (cw - 60) / 2, th = 220, ty = y + 340;
      out += tile(m + 20, ty, tw, th, String(d.minutes == null ? '—' : d.minutes), 'dəqiqə');
      out += tile(m + 40 + tw, ty, tw, th, String(d.pinned == null ? '—' : d.pinned), 'sancılmış sənəd');

      out += T(cx, ty + th + 110, boyuk(d.name || ''), { size: 40, weight: 600, spacing: 6 });
      out += mohur(cx, ty + th + 330, 165, stampLines.concat([d.no || '']));

      var f = d.footer || 'Nəticə spoiler saxlamır — dostun eyni qovluğu təmiz açacaq.';
      out += T(cx, S.h - m - 150, f, { size: 26, fill: C.ink2, sans: true });
      out += T(cx, S.h - m - 106, d.link || '', { size: 24, fill: C.ink2 });
      out += '<line x1="' + (m + 60) + '" y1="' + (S.h - m - 78) + '" x2="' + (S.w - m - 60) +
        '" y2="' + (S.h - m - 78) + '" stroke="' + C.paper3 + '" stroke-width="2"/>';
      out += T(cx, S.h - m - 44, FIKTIV, { size: 22, weight: 600, fill: C.ink2, spacing: 2 });
    } else {
      var by = m + 96;
      out += T(m + 60, by, BASLIQ, { size: 22, weight: 500, fill: C.ink2, spacing: 4, anchor: 'start' });
      out += T(m + 60, by + 82, 'İŞ AÇILDI', { size: 66, weight: 600, anchor: 'start' });
      out += T(m + 60, by + 130, 'İş № ' + (d.no || '') + ' · ' + (d.title || ''), { size: 24, fill: C.ink2, anchor: 'start' });
      out += T(m + 60, by + 210, boyuk(d.name || ''), { size: 30, weight: 600, spacing: 4, anchor: 'start' });
      out += T(m + 60, by + 268, (d.minutes == null ? '—' : d.minutes) + ' dəqiqə · ' + (d.pinned == null ? '—' : d.pinned) + ' sancılmış sənəd',
        { size: 26, fill: C.ink2, anchor: 'start' });
      out += mohur(S.w - m - 150, S.h / 2, 108, stampLines);
      out += '<line x1="' + (m + 60) + '" y1="' + (S.h - m - 62) + '" x2="' + (S.w - m - 300) +
        '" y2="' + (S.h - m - 62) + '" stroke="' + C.paper3 + '" stroke-width="2"/>';
      out += T(m + 60, S.h - m - 32, FIKTIV, { size: 20, weight: 600, fill: C.ink2, spacing: 1.5, anchor: 'start' });
    }

    return out + '</svg>';
  }

  /* Kətan JPEG-ə çevrilir: server yalnız JPEG qəbul edir və 1200×630
     şəkil onsuz da kiçikdir. */
  function jpeg(svgText, w, h, quality) {
    return global.ZEXPORT.svgToCanvas(svgText, w, h, 1).then(function (c) {
      return new Promise(function (res, rej) {
        c.toBlob(function (b) { b ? res(b) : rej(new Error('kətan')); }, 'image/jpeg', quality || 0.88);
      });
    });
  }

  global.DCERT = {
    STORY: STORY,
    OG: OG,
    svg: svg,
    jpeg: jpeg,
    storyPng: function (d) { return global.ZEXPORT.pngBlob(svg(d, 'story'), STORY.w, STORY.h, 1); },
    ogJpeg: function (d) { return jpeg(svg(d, 'og'), OG.w, OG.h, 0.88); }
  };
})(window);
