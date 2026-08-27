/* ==================================================================
   Zarafat Notariat Palatası — çox-dizaynlı SVG sənəd generatoru
   Layoutlar: notarial · blank · diplom · sertifikat · lisenziya
   Ölçülər:   A4 794×1123 · Story 1080×1920
   Xarici asılılıq: yalnız QRZ (qr.js)
   ================================================================== */
window.DOCGEN = (function () {
  'use strict';

  var W = 794, H = 1123;
  var SERIF = "Georgia, 'Times New Roman', 'Liberation Serif', 'Noto Serif', serif";
  var SANS  = "'Helvetica Neue', Helvetica, Arial, 'Liberation Sans', sans-serif";

  /* ---------------- palitralar ---------------- */
  var PALETTES = {
    gold:     { paper:'#fbf7ec', ink:'#1b2436', head:'#132644', accent:'#b0882a', accentL:'#dcbe63', accentD:'#7d5f14', muted:'#5d6577', seal:'#a1202b', soft:'#fdf1f0' },
    steel:    { paper:'#ffffff', ink:'#1a2230', head:'#0f2740', accent:'#2f5d8a', accentL:'#9dc0dd', accentD:'#1d3f61', muted:'#5a6675', seal:'#1f4c8f', soft:'#eef4fa' },
    burgundy: { paper:'#fdf6ef', ink:'#25191c', head:'#5a1220', accent:'#8d1d33', accentL:'#d3a2ac', accentD:'#5f0f20', muted:'#6b5b60', seal:'#8d1d33', soft:'#fbeef0' },
    forest:   { paper:'#fbfdfa', ink:'#17241d', head:'#123a2a', accent:'#1f7a52', accentL:'#8fcfb2', accentD:'#0f4a31', muted:'#586b61', seal:'#1b6a48', soft:'#ecf7f1' },
    ink:      { paper:'#f7f8fb', ink:'#151b26', head:'#101828', accent:'#3b4b6b', accentL:'#a3b2ce', accentD:'#232f47', muted:'#5b6579', seal:'#8a2a2a', soft:'#eef1f7' }
  };

  var LAYOUT_NAMES = {
    notarial:   'Notarial akt',
    blank:      'Rəsmi blank',
    diplom:     'Diplom',
    sertifikat: 'Sertifikat',
    lisenziya:  'Lisenziya kartı'
  };

  /* ---------------- ölçmə və mətn ---------------- */
  var _mc = document.createElement('canvas').getContext('2d');
  function font(size, weight, fam, style) {
    return (style ? style + ' ' : '') + (weight ? weight + ' ' : '') + size + 'px ' + (fam || SERIF);
  }
  function measure(t, f) { _mc.font = f; return _mc.measureText(t).width; }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function wrap(text, f, maxW, maxLines) {
    var words = String(text || '').trim().split(/\s+/), lines = [], cur = '';
    for (var i = 0; i < words.length; i++) {
      var test = cur ? cur + ' ' + words[i] : words[i];
      if (measure(test, f) > maxW && cur) { lines.push(cur); cur = words[i]; }
      else cur = test;
      if (maxLines && lines.length === maxLines) break;
    }
    if (cur && (!maxLines || lines.length < maxLines)) lines.push(cur);
    if (maxLines && lines.length >= maxLines) {
      var consumed = lines.slice(0, maxLines).join(' ').split(/\s+/).length;
      if (consumed < words.length) {
        var last = lines[maxLines - 1];
        while (measure(last + '…', f) > maxW && last.length > 1) last = last.slice(0, -1);
        lines[maxLines - 1] = last.replace(/\s+\S*$/, '') + '…';
      }
      lines = lines.slice(0, maxLines);
    }
    return lines.length ? lines : [''];
  }

  /* bir sətrə sığdırmaq üçün şrift ölçüsünü kiçildir */
  function fit(text, maxW, start, min, weight, fam, style) {
    var s = start;
    while (s > min && measure(text, font(s, weight, fam, style)) > maxW) s -= 1;
    return s;
  }

  function tspans(lines, x, y, lh) {
    return lines.map(function (l, i) {
      return '<tspan x="' + x + '" y="' + (y + i * lh) + '">' + esc(l) + '</tspan>';
    }).join('');
  }

  function T(str, x, y, o) {
    o = o || {};
    return '<text x="' + x + '" y="' + y + '"' +
      ' font-family="' + (o.fam || SERIF) + '"' +
      ' font-size="' + (o.size || 13) + '"' +
      (o.weight ? ' font-weight="' + o.weight + '"' : '') +
      (o.style ? ' font-style="' + o.style + '"' : '') +
      ' fill="' + (o.fill || '#000') + '"' +
      (o.ls ? ' letter-spacing="' + o.ls + '"' : '') +
      (o.anchor ? ' text-anchor="' + o.anchor + '"' : '') +
      (o.op ? ' opacity="' + o.op + '"' : '') +
      '>' + esc(str) + '</text>';
  }

  function block(lines, x, y, lh, o) {
    o = o || {};
    return '<text font-family="' + (o.fam || SERIF) + '" font-size="' + (o.size || 13) + '"' +
      (o.weight ? ' font-weight="' + o.weight + '"' : '') +
      (o.style ? ' font-style="' + o.style + '"' : '') +
      ' fill="' + (o.fill || '#000') + '"' +
      (o.ls ? ' letter-spacing="' + o.ls + '"' : '') +
      (o.anchor ? ' text-anchor="' + o.anchor + '"' : '') +
      '>' + tspans(lines, x, y, lh) + '</text>';
  }

  function hash(str) {
    var h = 2166136261 >>> 0, s = String(str);
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    return h >>> 0;
  }
  function rng(seed) {
    var s = hash(seed) || 1;
    return function () { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return (s >>> 8) / 16777216; };
  }

  /* ---------------- dekorativ elementlər ---------------- */
  function rosette(cx, cy, R, k, amp, steps) {
    steps = steps || 540; var d = '';
    for (var i = 0; i <= steps; i++) {
      var t = i / steps * Math.PI * 2;
      var r = R * (1 - amp + amp * Math.cos(k * t));
      d += (i ? 'L' : 'M') + (cx + r * Math.cos(t)).toFixed(1) + ' ' + (cy + r * Math.sin(t)).toFixed(1);
    }
    return d + 'Z';
  }

  function guilloche(cx, cy, P, op, scale) {
    scale = scale || 1;
    return '<g opacity="' + (op || 0.16) + '" stroke="' + P.accentD + '" fill="none" stroke-width="0.5">' +
      '<path d="' + rosette(cx, cy, 320 * scale, 11, 0.16) + '"/>' +
      '<path d="' + rosette(cx, cy, 300 * scale, 17, 0.12) + '"/>' +
      '<path d="' + rosette(cx, cy, 250 * scale, 7, 0.22) + '"/></g>';
  }

  function corner(x, y, sx, sy, P) {
    return '<g transform="translate(' + x + ',' + y + ') scale(' + sx + ',' + sy + ')" fill="none" stroke="' + P.accent + '" stroke-width="1.4">' +
      '<path d="M0 26 L0 8 Q0 0 8 0 L26 0"/>' +
      '<path d="M6 30 L6 14 Q6 6 14 6 L30 6" stroke-width="0.8"/>' +
      '<circle cx="13" cy="13" r="2.6" fill="' + P.accent + '" stroke="none"/></g>';
  }

  function emblem(cx, cy, r, P, sub) {
    return '<g>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="' + P.accent + '" stroke-width="1.6"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r - 7) + '" fill="none" stroke="' + P.accent + '" stroke-width="0.7"/>' +
      '<path d="' + rosette(cx, cy, r - 11, 9, 0.2) + '" fill="none" stroke="' + P.accentL + '" stroke-width="0.6"/>' +
      T('ZNP', cx, cy + r * 0.13, { anchor: 'middle', size: r * 0.6, weight: 'bold', fill: P.accentD, ls: 1 }) +
      (sub === false ? '' : T('EST. 2026', cx, cy + r * 0.55, { anchor: 'middle', size: r * 0.17, fam: SANS, fill: P.accentD, ls: 1.4 })) +
      '</g>';
  }

  function seal(cx, cy, r, P, regNo, idp, rot) {
    var top = 'M ' + (cx - (r - 15)) + ' ' + cy + ' A ' + (r - 15) + ' ' + (r - 15) + ' 0 1 1 ' + (cx + (r - 15)) + ' ' + cy;
    var bot = 'M ' + (cx - (r - 17)) + ' ' + cy + ' A ' + (r - 17) + ' ' + (r - 17) + ' 0 0 0 ' + (cx + (r - 17)) + ' ' + cy;
    var C = P.seal;
    var s = '<g transform="rotate(' + (rot === undefined ? -11 : rot) + ' ' + cx + ' ' + cy + ')" opacity="0.88">';
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="' + C + '" stroke-width="3.2"/>';
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r - 7) + '" fill="none" stroke="' + C + '" stroke-width="1.1"/>';
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r - 30) + '" fill="none" stroke="' + C + '" stroke-width="1.1"/>';
    s += '<path id="' + idp + '-st" d="' + top + '" fill="none"/><path id="' + idp + '-sb" d="' + bot + '" fill="none"/>';
    s += '<text font-family="' + SANS + '" font-size="8.6" font-weight="bold" fill="' + C + '" letter-spacing="0.9">' +
      '<textPath href="#' + idp + '-st" startOffset="50%" text-anchor="middle">ZARAFAT NOTARİAT PALATASI</textPath></text>';
    s += '<text font-family="' + SANS + '" font-size="8" font-weight="bold" fill="' + C + '" letter-spacing="0.9">' +
      '<textPath href="#' + idp + '-sb" startOffset="50%" text-anchor="middle">ƏYLƏNCƏ MƏQSƏDLİDİR</textPath></text>';
    s += T('ZNP', cx, cy - 8, { anchor: 'middle', size: 19, weight: 'bold', fill: C, ls: 1 });
    s += T(regNo, cx, cy + 8, { anchor: 'middle', size: 7.5, fam: SANS, fill: C, ls: 0.6 });
    s += '<path d="M ' + (cx - 22) + ' ' + (cy + 15) + ' H ' + (cx + 22) + '" stroke="' + C + '" stroke-width="0.9"/>';
    s += T('PARODİYA', cx, cy + 26, { anchor: 'middle', size: 7, fam: SANS, fill: C, ls: 0.5 });
    return s + '</g>';
  }

  function signature(seedStr, x, y, w, h) {
    var r = rng(seedStr), d = 'M ' + x + ' ' + (y + h * 0.75), n = 5, step = w / n;
    for (var i = 1; i <= n; i++) {
      var px = x + step * i;
      d += ' C ' + (px - step * 0.7) + ' ' + (y + h * r()) + ', ' + (px - step * 0.25) + ' ' + (y + h * r()) + ', ' + px + ' ' + (y + h * (0.25 + 0.5 * r()));
    }
    d += ' q ' + (-w * 0.55) + ' ' + (h * 0.42) + ' ' + (-w * 0.15) + ' ' + (h * 0.5);
    return '<path d="' + d + '" fill="none" stroke="#17356b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>';
  }

  function barcode(seedStr, x, y, w, h) {
    var r = rng(seedStr), out = '', cx = x;
    while (cx < x + w - 4) {
      var bw = 1 + Math.floor(r() * 3), gap = 1 + Math.floor(r() * 3);
      if (cx + bw > x + w) break;
      out += '<rect x="' + cx.toFixed(1) + '" y="' + y + '" width="' + bw + '" height="' + h + '" fill="#16202f"/>';
      cx += bw + gap;
    }
    return out;
  }

  function qrBlock(url, x, y, size) {
    if (!window.QRZ || !url) return '';
    var p = QRZ.path(url), sc = size / (p.size + 8);
    return '<g transform="translate(' + x + ',' + y + ')">' +
      '<rect width="' + size + '" height="' + size + '" fill="#fff"/>' +
      '<g transform="translate(' + (4 * sc) + ',' + (4 * sc) + ') scale(' + sc + ')"><path d="' + p.d + '" fill="#101827"/></g></g>';
  }

  /* ödəniş olunmayıbsa QR yerinə xəbərdarlıq */
  function qrOrHint(doc, P, x, y, size, textX) {
    if (doc.paid && doc.verifyUrl) {
      return qrBlock(doc.verifyUrl, x, y, size) +
        T('REYESTRDƏ YOXLA', textX, y + 20, { size: 9, fam: SANS, weight: 'bold', fill: P.head, ls: 0.8 }) +
        T(String(doc.verifyUrl).replace(/^https?:\/\//, ''), textX, y + 34, { size: 8, fam: SANS, fill: P.muted });
    }
    return '<rect x="' + x + '" y="' + y + '" width="' + size + '" height="' + size + '" fill="none" stroke="' + P.muted + '" stroke-width="0.9" stroke-dasharray="4 3"/>' +
      T('QR', x + size / 2, y + size / 2 - 2, { anchor: 'middle', size: 8, fam: SANS, fill: P.muted }) +
      T('KODU', x + size / 2, y + size / 2 + 10, { anchor: 'middle', size: 8, fam: SANS, fill: P.muted }) +
      T('REYESTRDƏ QEYDİYYATDAN KEÇMƏYİB', textX, y + 22, { size: 9, fam: SANS, weight: 'bold', fill: P.muted, ls: 0.8 }) +
      T('Ödənişdən sonra QR kod və reyestr qeydi yaranır.', textX, y + 37, { size: 8, fam: SANS, fill: P.muted });
  }

  function watermark(P, paid) {
    var op = paid ? 0.09 : 0.2, out = '';
    out += '<g opacity="' + op + '" transform="rotate(-31 ' + (W / 2) + ' ' + (H / 2) + ')">' +
      T('ZARAFAT', W / 2, H / 2 - 14, { anchor: 'middle', size: 52, weight: 'bold', fam: SANS, fill: P.head, ls: 7 }) +
      T('HÜQUQİ QÜVVƏSİ YOXDUR', W / 2, H / 2 + 28, { anchor: 'middle', size: 20, weight: 'bold', fam: SANS, fill: P.head, ls: 4 }) +
      '</g>';
    if (!paid) {
      out += '<g opacity="0.13" transform="rotate(-31 ' + (W / 2) + ' ' + (H / 2) + ')" font-family="' + SANS + '" font-size="17" font-weight="bold" fill="' + P.head + '" letter-spacing="5">';
      for (var ry = -100; ry < H + 200; ry += 128)
        for (var rx = -160; rx < W + 200; rx += 230)
          if (Math.abs(ry - H / 2) > 90) out += '<text x="' + rx + '" y="' + ry + '">NÜMUNƏ</text>';
      out += '</g>';
    }
    return out;
  }

  function disclaimer(P, x, y, w) {
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="26" fill="' + P.head + '" opacity="0.93"/>' +
      T('BU SƏNƏD TAMAMİLƏ ƏYLƏNCƏ MƏQSƏDİ DAŞIYIR VƏ HEÇ BİR HÜQUQİ QÜVVƏYƏ MALİK DEYİL.',
        x + w / 2, y + 17, { anchor: 'middle', size: 9.2, fam: SANS, fill: '#f3e6bf', ls: 0.7 });
  }

  function verifiedStamp(cx, cy, rot) {
    var C = '#1d6b3f';
    return '<g transform="rotate(' + (rot || -14) + ' ' + cx + ' ' + cy + ')" opacity="0.85">' +
      '<rect x="' + (cx - 135) + '" y="' + (cy - 37) + '" width="270" height="74" fill="none" stroke="' + C + '" stroke-width="4" rx="6"/>' +
      '<rect x="' + (cx - 127) + '" y="' + (cy - 29) + '" width="254" height="58" fill="none" stroke="' + C + '" stroke-width="1.2" rx="3"/>' +
      T('RƏSMİ TƏSDİQ', cx, cy - 3, { anchor: 'middle', size: 19, weight: 'bold', fam: SANS, fill: C, ls: 1.6 }) +
      T('OLUNUB', cx, cy + 19, { anchor: 'middle', size: 12, weight: 'bold', fam: SANS, fill: C, ls: 2.6 }) +
      '</g>';
  }

  function items(doc, max) {
    var a = String(doc.powers || '').split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
    return a.length ? a.slice(0, max || 6) : ['—'];
  }
  function seriya(doc) { return 'ZNP-' + (hash(doc.regNo) % 900 + 100); }

  /* Gövdəni şaquli optik mərkəzə yaxınlaşdırır: qısa mətnlərdə səhifənin
     ortasında böyük boşluq qalmasın deyə gövdə blokunu aşağı sürüşdürür. */
  function centerBody(out, bodyStart, contentEnd, footerTop, maxShift) {
    var slack = footerTop - contentEnd;
    var dy = Math.max(0, Math.min(slack * 0.45, maxShift === undefined ? 130 : maxShift));
    if (dy < 6) return out;
    return out.slice(0, bodyStart) + '<g transform="translate(0,' + dy.toFixed(1) + ')">' + out.slice(bodyStart) + '</g>';
  }

  /* ==================================================================
     LAYOUT 1 — NOTARIAL AKT (pergament + qızıl haşiyə)
     ================================================================== */
  function L_notarial(doc, C) {
    var P = C.P, idp = C.idp, M = 80, CW = W - M * 2, out = '';

    out += '<rect width="' + W + '" height="' + H + '" fill="' + P.paper + '"/>';
    out += '<rect width="' + W + '" height="' + H + '" fill="url(#' + idp + '-grain)"/>';
    out += guilloche(W / 2, 470, P);

    out += '<rect x="22" y="22" width="' + (W - 44) + '" height="' + (H - 44) + '" fill="none" stroke="url(#' + idp + '-metal)" stroke-width="3.5"/>';
    out += '<rect x="32" y="32" width="' + (W - 64) + '" height="' + (H - 64) + '" fill="none" stroke="' + P.accent + '" stroke-width="0.9"/>';
    out += '<rect x="37" y="37" width="' + (W - 74) + '" height="' + (H - 74) + '" fill="none" stroke="' + P.accent + '" stroke-width="0.4" stroke-dasharray="3 3"/>';
    out += corner(44, 44, 1, 1, P) + corner(W - 44, 44, -1, 1, P) + corner(44, H - 44, 1, -1, P) + corner(W - 44, H - 44, -1, -1, P);

    out += emblem(W / 2, 116, 40, P);
    out += T('ZARAFAT NOTARİAT PALATASI', W / 2, 186, { anchor: 'middle', size: 16, weight: 'bold', fill: P.head, ls: 4.5 });
    out += T('QEYRİ-RƏSMİ SƏNƏDLƏR VAHİD REYESTRİ · ZARAFAT.AZ', W / 2, 205, { anchor: 'middle', size: 9, fam: SANS, fill: P.muted, ls: 2.6 });
    out += '<path d="M ' + M + ' 220 H ' + (W - M) + '" stroke="' + P.accent + '" stroke-width="1"/>';
    out += '<path d="M ' + (W / 2 - 40) + ' 220 L ' + (W / 2) + ' 214 L ' + (W / 2 + 40) + ' 220 L ' + (W / 2) + ' 226 Z" fill="' + P.paper + '" stroke="' + P.accent + '" stroke-width="1"/>';

    var bs = out.length;                                  /* --- gövdə başlayır --- */

    var ts = 27, tl;
    while (true) { tl = wrap(doc.title, font(ts, 'bold'), CW - 20, 3); if (tl.length <= 2 || ts <= 19) break; ts -= 2; }
    var y = 268;
    out += block(tl, W / 2, y, ts + 8, { size: ts, weight: 'bold', fill: P.head, anchor: 'middle', ls: 0.6 });
    y += (tl.length - 1) * (ts + 8) + 24;

    out += '<path d="M ' + (W / 2 - 46) + ' ' + y + ' H ' + (W / 2 + 46) + '" stroke="' + P.accent + '" stroke-width="0.8"/>';
    out += '<circle cx="' + (W / 2) + '" cy="' + y + '" r="2.4" fill="' + P.accent + '"/>';
    y += 22;
    out += T('QEYDİYYAT №: ' + doc.regNo + '  ·  TARİX: ' + doc.date + '  ·  SERİYA: ' + seriya(doc),
      W / 2, y, { anchor: 'middle', size: 10.5, fam: SANS, fill: P.muted, ls: 1.4 });
    y += 34;

    var pf = font(13.5, '', SERIF);
    var pre = wrap(doc.preamble, pf, CW, 4);
    out += block(pre, M, y, 21.5, { size: 13.5, fill: P.ink });
    y += pre.length * 21.5 + 26;

    var colW = (CW - 34) / 2, maxV = 1;
    [[doc.toLabel || 'KİMƏ VERİLİR', doc.to, M], [doc.fromLabel || 'KİMDƏN VERİLİR', doc.from, M + colW + 34]].forEach(function (c) {
      out += T(c[0], c[2], y, { size: 8.8, fam: SANS, weight: 'bold', fill: P.accentD, ls: 1.9 });
      var vl = wrap(c[1] || '—', font(16, 'bold'), colW, 2);
      maxV = Math.max(maxV, vl.length);
      out += block(vl, c[2], y + 22, 19, { size: 16, weight: 'bold', fill: P.head });
      out += '<path d="M ' + c[2] + ' ' + (y + 30 + (vl.length - 1) * 19) + ' H ' + (c[2] + colW) + '" stroke="' + P.accent + '" stroke-width="0.8" stroke-dasharray="2 2"/>';
    });
    y += 30 + (maxV - 1) * 19 + 32;

    out += T(doc.powersLabel || 'SƏLAHİYYƏTLƏR VƏ ŞƏRTLƏR', M, y, { size: 8.8, fam: SANS, weight: 'bold', fill: P.accentD, ls: 1.9 });
    y += 20;
    var its = items(doc, 6);
    for (var i = 0; i < its.length && y < 680; i++) {
      var ln = wrap(its[i], pf, CW - 26, 2);
      out += T((i + 1) + '.', M, y + 11, { size: 13, weight: 'bold', fill: P.accentD });
      out += block(ln, M + 22, y + 11, 20, { size: 13.5, fill: P.ink });
      y += ln.length * 20 + 9;
    }
    y += 14;

    var pen = wrap(doc.penalty || '—', font(13, '', SERIF), CW - 44, 3);
    var bh = pen.length * 20 + 44;
    out += '<rect x="' + M + '" y="' + y + '" width="' + CW + '" height="' + bh + '" fill="' + P.soft + '" stroke="' + P.seal + '" stroke-width="0.9" opacity="0.95"/>';
    out += '<rect x="' + M + '" y="' + y + '" width="4" height="' + bh + '" fill="' + P.seal + '"/>';
    out += T(doc.penaltyLabel || 'CƏZA BƏNDİ', M + 18, y + 18, { size: 8.8, fam: SANS, weight: 'bold', fill: P.seal, ls: 1.9 });
    out += block(pen, M + 18, y + 38, 20, { size: 13, fill: P.ink });
    y += bh;

    out = centerBody(out, bs, y, 846, 120);               /* --- gövdə bitdi --- */

    out += '<path d="M ' + M + ' 862 H ' + (W - M) + '" stroke="' + P.accent + '" stroke-width="0.7"/>';
    out += T('TƏSDİQ TARİXİ: ' + doc.date, M, 886, { size: 9.5, fam: SANS, fill: P.muted, ls: 1.2 });
    out += signature(doc.regNo + doc.from, M + 8, 896, 190, 42);
    out += '<path d="M ' + M + ' 946 H ' + (M + 230) + '" stroke="' + P.ink + '" stroke-width="0.7"/>';
    out += T('Növbətçi notarius: Ə. ZARAFATOV (uydurma şəxs)', M, 960, { size: 9, fam: SANS, fill: P.muted, ls: 0.8 });
    out += seal(608, 908, 74, P, doc.regNo, idp);
    out += qrOrHint(doc, P, M, 978, 84, M + 96);
    out += barcode(doc.regNo, M + 96, doc.paid ? 1022 : 1024, 210, doc.paid ? 26 : 24);
    if (doc.paid) out += T(doc.regNo, M + 96, 1058, { size: 8, fam: SANS, fill: P.muted, ls: 2 });

    if (C.verified) out += verifiedStamp(565, 700);
    out += watermark(P, doc.paid);
    out += disclaimer(P, 40, 1074, W - 80);
    return out;
  }

  /* ==================================================================
     LAYOUT 2 — RƏSMİ BLANK (dövlət blankı üslubu, cədvəlli)
     ================================================================== */
  function L_blank(doc, C) {
    var P = C.P, idp = C.idp, M = 72, CW = W - M * 2, out = '';

    out += '<rect width="' + W + '" height="' + H + '" fill="' + P.paper + '"/>';
    out += '<rect x="0" y="0" width="' + W + '" height="6" fill="' + P.accent + '"/>';
    out += '<rect x="0" y="6" width="' + W + '" height="2" fill="' + P.accentL + '"/>';

    out += emblem(M + 26, 74, 26, P, false);
    out += T('ZARAFAT NOTARİAT PALATASI', M + 62, 66, { size: 12.5, weight: 'bold', fam: SANS, fill: P.head, ls: 1.6 });
    out += T('Qeyri-rəsmi sənədlər vahid reyestri', M + 62, 82, { size: 9, fam: SANS, fill: P.muted, ls: 0.6 });
    out += T('zarafat.az · uydurma qurum', M + 62, 96, { size: 8.4, fam: SANS, fill: P.muted, ls: 0.6 });

    var bx = W - M - 208;
    out += '<rect x="' + bx + '" y="46" width="208" height="60" fill="none" stroke="' + P.accent + '" stroke-width="1"/>';
    out += '<path d="M ' + bx + ' 70 H ' + (bx + 208) + '" stroke="' + P.accent + '" stroke-width="0.6"/>';
    out += T('QEYDİYYAT NÖMRƏSİ', bx + 104, 62, { anchor: 'middle', size: 7.6, fam: SANS, fill: P.muted, ls: 1.4 });
    out += T(doc.regNo, bx + 104, 88, { anchor: 'middle', size: 15, weight: 'bold', fam: SANS, fill: P.head, ls: 1.2 });
    out += T('ser. ' + seriya(doc), bx + 104, 100, { anchor: 'middle', size: 7.4, fam: SANS, fill: P.muted });

    out += '<path d="M ' + M + ' 126 H ' + (W - M) + '" stroke="' + P.accentD + '" stroke-width="1.6"/>';
    out += '<path d="M ' + M + ' 130 H ' + (W - M) + '" stroke="' + P.accentD + '" stroke-width="0.5"/>';

    var bs = out.length;                                  /* --- gövdə --- */

    out += T('TƏSDİQ EDİRƏM', W - M, 152, { anchor: 'end', size: 9, fam: SANS, weight: 'bold', fill: P.ink, ls: 1.4 });
    out += T('Növbətçi notarius Ə. Zarafatov', W - M, 166, { anchor: 'end', size: 8.6, fam: SANS, fill: P.muted });
    out += T('«' + doc.date.slice(0, 2) + '» ' + doc.date.slice(3), W - M, 180, { anchor: 'end', size: 8.6, fam: SANS, fill: P.muted });

    var ts = fit(doc.title.toUpperCase(), CW, 21, 13, 'bold', SANS);
    var tl = wrap(doc.title.toUpperCase(), font(ts, 'bold', SANS), CW, 3);
    var y = 216;
    out += block(tl, W / 2, y, ts + 8, { size: ts, weight: 'bold', fam: SANS, fill: P.head, anchor: 'middle', ls: 2 });
    y += (tl.length - 1) * (ts + 8) + 12;
    out += '<path d="M ' + (W / 2 - 90) + ' ' + y + ' H ' + (W / 2 + 90) + '" stroke="' + P.accent + '" stroke-width="1"/>';
    y += 28;

    out += T('Bakı şəhəri', M, y, { size: 10, fam: SANS, fill: P.muted });
    out += T(doc.date, W - M, y, { anchor: 'end', size: 10, fam: SANS, fill: P.muted });
    y += 26;

    var pre = wrap(doc.preamble, font(12.6, '', SANS), CW, 5);
    out += block(pre, M, y, 20, { size: 12.6, fam: SANS, fill: P.ink });
    y += pre.length * 20 + 26;

    var rows = [
      [doc.toLabel || 'Kimə verilir', doc.to],
      [doc.fromLabel || 'Kimdən verilir', doc.from],
      ['Sənədin növü', LAYOUT_NAMES[doc.layout || 'blank']],
      ['Qüvvədə olma müddəti', 'Müddətsiz (və ya tərəflər barışana qədər)']
    ];
    var lw = 210, rh = 31;
    out += '<rect x="' + M + '" y="' + y + '" width="' + CW + '" height="' + (rh * rows.length) + '" fill="none" stroke="' + P.accent + '" stroke-width="1"/>';
    out += '<path d="M ' + (M + lw) + ' ' + y + ' V ' + (y + rh * rows.length) + '" stroke="' + P.accent + '" stroke-width="0.7"/>';
    rows.forEach(function (r, i) {
      var ry = y + rh * i;
      if (i) out += '<path d="M ' + M + ' ' + ry + ' H ' + (W - M) + '" stroke="' + P.accent + '" stroke-width="0.5"/>';
      out += '<rect x="' + M + '" y="' + ry + '" width="' + lw + '" height="' + rh + '" fill="' + P.soft + '"/>';
      out += T(r[0], M + 12, ry + 20, { size: 10, fam: SANS, fill: P.muted, ls: 0.4 });
      var v = wrap(r[1] || '—', font(11.5, 'bold', SANS), CW - lw - 24, 1);
      out += T(v[0], M + lw + 12, ry + 20, { size: 11.5, weight: 'bold', fam: SANS, fill: P.head });
    });
    y += rh * rows.length + 30;

    out += T((doc.powersLabel || 'ŞƏRTLƏR VƏ ÖHDƏLİKLƏR'), M, y, { size: 9.4, fam: SANS, weight: 'bold', fill: P.accentD, ls: 1.6 });
    y += 8;
    out += '<path d="M ' + M + ' ' + y + ' H ' + (W - M) + '" stroke="' + P.accent + '" stroke-width="0.5"/>';
    y += 20;
    var its = items(doc, 6);
    for (var i = 0; i < its.length && y < 700; i++) {
      var ln = wrap(its[i], font(12, '', SANS), CW - 34, 2);
      out += T('1.' + (i + 1) + '.', M, y + 10, { size: 11.5, weight: 'bold', fam: SANS, fill: P.accentD });
      out += block(ln, M + 32, y + 10, 18.5, { size: 12, fam: SANS, fill: P.ink });
      y += ln.length * 18.5 + 10;
    }
    y += 10;
    var pen = wrap(doc.penalty || '—', font(11.8, '', SANS), CW - 34, 3);
    out += T('2.1.', M, y + 10, { size: 11.5, weight: 'bold', fam: SANS, fill: P.seal });
    out += block(pen, M + 32, y + 10, 18.5, { size: 11.8, fam: SANS, fill: P.seal });
    y += pen.length * 18.5 + 10;

    out = centerBody(out, bs, y, 880, 120);

    out += '<path d="M ' + M + ' 900 H ' + (W - M) + '" stroke="' + P.accent + '" stroke-width="0.5"/>';
    out += signature(doc.regNo + doc.to, M + 6, 912, 170, 38);
    out += '<path d="M ' + M + ' 958 H ' + (M + 220) + '" stroke="' + P.ink + '" stroke-width="0.7"/>';
    out += T('imza', M + 100, 970, { anchor: 'middle', size: 8, fam: SANS, fill: P.muted, ls: 1.2 });
    out += T('Ə. ZARAFATOV', M, 990, { size: 10, weight: 'bold', fam: SANS, fill: P.head, ls: 0.8 });
    out += T('Növbətçi notarius (uydurma şəxs)', M, 1004, { size: 8.4, fam: SANS, fill: P.muted });
    out += seal(624, 944, 66, P, doc.regNo, idp, -8);

    out += qrOrHint(doc, P, M, 1018, 52, M + 64);
    out += barcode(doc.regNo, W - M - 190, 1030, 190, 22);
    out += T(doc.regNo, W - M, 1062, { anchor: 'end', size: 7.6, fam: SANS, fill: P.muted, ls: 1.6 });

    if (C.verified) out += verifiedStamp(560, 700, -12);
    out += watermark(P, doc.paid);
    out += disclaimer(P, 0, H - 26, W);
    return out;
  }

  /* ==================================================================
     LAYOUT 3 — DİPLOM (medalyon, iri ad, iki imza)
     ================================================================== */
  function L_diplom(doc, C) {
    var P = C.P, idp = C.idp, M = 96, CW = W - M * 2, out = '';

    out += '<rect width="' + W + '" height="' + H + '" fill="' + P.paper + '"/>';
    out += '<rect width="' + W + '" height="' + H + '" fill="url(#' + idp + '-grain)"/>';
    out += guilloche(W / 2, H / 2, P, 0.13, 1.25);

    out += '<rect x="26" y="26" width="' + (W - 52) + '" height="' + (H - 52) + '" fill="none" stroke="url(#' + idp + '-metal)" stroke-width="9"/>';
    out += '<rect x="40" y="40" width="' + (W - 80) + '" height="' + (H - 80) + '" fill="none" stroke="' + P.accentD + '" stroke-width="1.2"/>';
    out += '<rect x="46" y="46" width="' + (W - 92) + '" height="' + (H - 92) + '" fill="none" stroke="' + P.accent + '" stroke-width="0.5" stroke-dasharray="6 4"/>';
    out += corner(56, 56, 1, 1, P) + corner(W - 56, 56, -1, 1, P) + corner(56, H - 56, 1, -1, P) + corner(W - 56, H - 56, -1, -1, P);

    var mx = W / 2, my = 138;
    out += '<path d="M ' + (mx - 30) + ' ' + (my + 34) + ' L ' + (mx - 44) + ' ' + (my + 92) + ' L ' + (mx - 14) + ' ' + (my + 76) + ' L ' + mx + ' ' + (my + 96) + ' L ' + (mx + 14) + ' ' + (my + 76) + ' L ' + (mx + 44) + ' ' + (my + 92) + ' L ' + (mx + 30) + ' ' + (my + 34) + ' Z" fill="' + P.accent + '" opacity="0.85"/>';
    out += '<circle cx="' + mx + '" cy="' + my + '" r="46" fill="' + P.paper + '" stroke="url(#' + idp + '-metal)" stroke-width="5"/>';
    out += emblem(mx, my, 34, P);
    out += T('ZARAFAT NOTARİAT PALATASI', W / 2, 268, { anchor: 'middle', size: 11.5, fam: SANS, weight: 'bold', fill: P.muted, ls: 4 });

    var bs = out.length;                                  /* --- gövdə --- */

    var ts = fit(doc.title.toUpperCase(), CW - 20, 34, 17, 'bold', SERIF);
    var tl = wrap(doc.title.toUpperCase(), font(ts, 'bold'), CW - 20, 2);
    var y = 320;
    out += block(tl, W / 2, y, ts + 10, { size: ts, weight: 'bold', fill: P.head, anchor: 'middle', ls: 2.5 });
    y += (tl.length - 1) * (ts + 10) + 38;

    out += T('Bu sənəd aşağıda adı çəkilən şəxsə təqdim olunur:', W / 2, y, { anchor: 'middle', size: 12.5, style: 'italic', fill: P.muted });
    y += 50;

    var ns = fit(doc.to || '—', CW - 40, 40, 20, 'bold', SERIF, 'italic');
    out += T(doc.to || '—', W / 2, y, { anchor: 'middle', size: ns, weight: 'bold', style: 'italic', fill: P.accentD });
    y += 16;
    out += '<path d="M ' + (W / 2 - 170) + ' ' + y + ' H ' + (W / 2 + 170) + '" stroke="' + P.accent + '" stroke-width="1"/>';
    out += '<circle cx="' + (W / 2 - 178) + '" cy="' + y + '" r="3" fill="' + P.accent + '"/>';
    out += '<circle cx="' + (W / 2 + 178) + '" cy="' + y + '" r="3" fill="' + P.accent + '"/>';
    y += 40;

    var pre = wrap(doc.preamble, font(13, '', SERIF), CW - 40, 4);
    out += block(pre, W / 2, y, 23, { size: 13, fill: P.ink, anchor: 'middle' });
    y += pre.length * 23 + 34;

    var its = items(doc, 4);
    for (var i = 0; i < its.length && y < 720; i++) {
      var ln = wrap('✦  ' + its[i], font(12.6, '', SERIF), CW - 60, 1);
      out += T(ln[0], W / 2, y, { anchor: 'middle', size: 12.6, fill: P.ink });
      y += 25;
    }
    y += 14;
    var pen = wrap(doc.penalty || '—', font(11.6, '', SERIF, 'italic'), CW - 90, 2);
    out += block(pen, W / 2, y, 19, { size: 11.6, style: 'italic', fill: P.muted, anchor: 'middle' });
    y += pen.length * 19;

    out = centerBody(out, bs, y, 826, 110);

    var sy = 892;
    [[M + 30, doc.from || '—', doc.fromLabel || 'Təqdim edən'], [W - M - 30 - 200, 'Ə. ZARAFATOV', 'Növbətçi notarius']].forEach(function (s, i) {
      out += signature(doc.regNo + s[1] + i, s[0] + 14, sy - 44, 170, 38);
      out += '<path d="M ' + s[0] + ' ' + sy + ' H ' + (s[0] + 200) + '" stroke="' + P.ink + '" stroke-width="0.8"/>';
      out += T(wrap(s[1], font(11, 'bold', SANS), 200, 1)[0], s[0] + 100, sy + 16, { anchor: 'middle', size: 11, weight: 'bold', fam: SANS, fill: P.head });
      out += T(s[2], s[0] + 100, sy + 30, { anchor: 'middle', size: 8.4, fam: SANS, fill: P.muted, ls: 0.8 });
    });
    out += seal(W / 2, sy - 6, 62, P, doc.regNo, idp, 6);

    out += T('QEYDİYYAT №: ' + doc.regNo + ' · ' + doc.date, W / 2, 976, { anchor: 'middle', size: 9.4, fam: SANS, fill: P.muted, ls: 1.4 });
    out += qrOrHint(doc, P, M - 20, 994, 58, M + 46);
    out += barcode(doc.regNo, W - M - 170, 1006, 170, 22);

    if (C.verified) out += verifiedStamp(W / 2, 640, -8);
    out += watermark(P, doc.paid);
    out += disclaimer(P, 56, 1058, W - 112);
    return out;
  }

  /* ==================================================================
     LAYOUT 4 — MÜASİR SERTİFİKAT (yan rəngli zolaq, iki sütun)
     ================================================================== */
  function L_sertifikat(doc, C) {
    var P = C.P, idp = C.idp, BAND = 78, M = BAND + 46, CW = W - M - 56, out = '';

    out += '<rect width="' + W + '" height="' + H + '" fill="' + P.paper + '"/>';
    out += '<rect x="0" y="0" width="' + BAND + '" height="' + H + '" fill="' + P.head + '"/>';
    out += '<rect x="' + BAND + '" y="0" width="7" height="' + H + '" fill="' + P.accent + '"/>';
    out += '<g opacity="0.12">' + guilloche(W - 120, H - 160, P, 1, 0.75) + '</g>';

    out += '<g transform="translate(' + (BAND / 2) + ',' + (H - 110) + ') rotate(-90)">' +
      T('ZARAFAT NOTARİAT PALATASI · ZARAFAT.AZ', 0, 5, { size: 11, fam: SANS, weight: 'bold', fill: P.accentL, ls: 4.4 }) + '</g>';
    out += '<circle cx="' + (BAND / 2) + '" cy="56" r="26" fill="none" stroke="' + P.accentL + '" stroke-width="1.6"/>';
    out += T('ZNP', BAND / 2, 62, { anchor: 'middle', size: 16, weight: 'bold', fill: P.accentL, ls: 1 });
    out += T('2026', BAND / 2, H - 46, { anchor: 'middle', size: 9, fam: SANS, fill: P.accentL, ls: 1.6 });

    out += T('SERTİFİKAT', M, 96, { size: 10, fam: SANS, weight: 'bold', fill: P.accent, ls: 5 });
    out += T('№ ' + doc.regNo, W - 56, 96, { anchor: 'end', size: 10, fam: SANS, fill: P.muted, ls: 1.2 });
    out += '<path d="M ' + M + ' 112 H ' + (W - 56) + '" stroke="' + P.accent + '" stroke-width="0.6"/>';

    var bs = out.length;                                  /* --- gövdə --- */
    var y = 156;

    var ts = fit(doc.title, CW, 33, 18, 'bold', SANS);
    var tl = wrap(doc.title, font(ts, 'bold', SANS), CW, 3);
    out += block(tl, M, y, ts + 8, { size: ts, weight: 'bold', fam: SANS, fill: P.head });
    y += (tl.length - 1) * (ts + 8) + 32;

    out += '<rect x="' + M + '" y="' + y + '" width="56" height="4" fill="' + P.accent + '"/>';
    y += 32;

    var pre = wrap(doc.preamble, font(12.8, '', SANS), CW, 5);
    out += block(pre, M, y, 20.5, { size: 12.8, fam: SANS, fill: P.ink });
    y += pre.length * 20.5 + 34;

    var colL = M, colLW = 232, colR = M + colLW + 34, colRW = CW - colLW - 34;
    var yStart = y;

    [[doc.toLabel || 'KİMƏ VERİLİR', doc.to], [doc.fromLabel || 'KİMDƏN VERİLİR', doc.from],
     ['TARİX', doc.date], ['SERİYA', seriya(doc)]].forEach(function (f) {
      out += T(f[0], colL, y, { size: 8.4, fam: SANS, weight: 'bold', fill: P.accent, ls: 1.8 });
      var vl = wrap(f[1] || '—', font(14, 'bold', SANS), colLW, 2);
      out += block(vl, colL, y + 20, 18, { size: 14, weight: 'bold', fam: SANS, fill: P.head });
      y += 20 + vl.length * 18 + 18;
    });

    var yR = yStart;
    out += T(doc.powersLabel || 'ŞƏRTLƏR', colR, yR, { size: 8.4, fam: SANS, weight: 'bold', fill: P.accent, ls: 1.8 });
    yR += 24;
    var its = items(doc, 6);
    for (var i = 0; i < its.length && yR < 760; i++) {
      var ln = wrap(its[i], font(11.8, '', SANS), colRW - 20, 2);
      out += '<circle cx="' + (colR + 4) + '" cy="' + (yR - 4) + '" r="3" fill="' + P.accent + '"/>';
      out += block(ln, colR + 18, yR, 17.5, { size: 11.8, fam: SANS, fill: P.ink });
      yR += ln.length * 17.5 + 11;
    }

    y = Math.max(y, yR) + 16;
    var pen = wrap(doc.penalty || '—', font(11.6, '', SANS), CW - 30, 3);
    var bh = pen.length * 18 + 40;
    out += '<rect x="' + M + '" y="' + y + '" width="' + CW + '" height="' + bh + '" fill="' + P.soft + '"/>';
    out += '<rect x="' + M + '" y="' + y + '" width="4" height="' + bh + '" fill="' + P.seal + '"/>';
    out += T(doc.penaltyLabel || 'CƏZA BƏNDİ', M + 16, y + 17, { size: 8.4, fam: SANS, weight: 'bold', fill: P.seal, ls: 1.8 });
    out += block(pen, M + 16, y + 35, 18, { size: 11.6, fam: SANS, fill: P.ink });
    y += bh;

    out = centerBody(out, bs, y, 872, 130);

    out += '<path d="M ' + M + ' 892 H ' + (W - 56) + '" stroke="' + P.accent + '" stroke-width="0.5"/>';
    out += signature(doc.regNo + doc.to, M + 4, 906, 160, 36);
    out += '<path d="M ' + M + ' 952 H ' + (M + 200) + '" stroke="' + P.ink + '" stroke-width="0.7"/>';
    out += T('Ə. ZARAFATOV · Növbətçi notarius', M, 966, { size: 8.6, fam: SANS, fill: P.muted });
    out += seal(W - 150, 934, 62, P, doc.regNo, idp, -6);
    out += qrOrHint(doc, P, M, 992, 66, M + 80);
    out += barcode(doc.regNo, M + 80, 1048, 200, 20);

    if (C.verified) out += verifiedStamp(500, 700, -10);
    out += watermark(P, doc.paid);
    out += disclaimer(P, BAND + 7, H - 26, W - BAND - 7);
    return out;
  }

  /* ==================================================================
     LAYOUT 5 — LİSENZİYA KARTI (vəsiqə üslubu, foto yeri, holoqram)
     ================================================================== */
  function L_lisenziya(doc, C) {
    var P = C.P, idp = C.idp, out = '';
    var CX = 54, CWid = W - CX * 2, CY = 132;

    /* --- əvvəlcə kartın hündürlüyünü hesabla --- */
    var px = CX + 26, py = CY + 76, pw = 150, ph = 186;
    var fx = px + pw + 34, fw = CX + CWid - 26 - fx;
    var ts = fit(doc.title.toUpperCase(), fw, 19, 12, 'bold', SANS);
    var tl = wrap(doc.title.toUpperCase(), font(ts, 'bold', SANS), fw, 3);
    var fields = [
      [doc.toLabel || 'LİSENZİYA SAHİBİ', doc.to],
      [doc.fromLabel || 'VERƏN TƏRƏF', doc.from],
      ['VERİLMƏ TARİXİ', doc.date],
      ['QÜVVƏDƏ OLMA', 'Müddətsiz'],
      ['SERİYA', seriya(doc)]
    ];
    var fieldsEnd = py + 4 + 12 + tl.length * (ts + 5) + 12 + 20 + fields.length * 42;
    var photoEnd = py + ph + 42 + 30 + 26;                       /* foto + holoqram + yazı */
    var its = items(doc, 4);
    var powH = 18 + its.length * 20 + 22;
    var CHt = Math.max(fieldsEnd, photoEnd) + 26 + powH - CY;
    CHt = Math.max(CHt, 580);                    /* kart çox alçaq görünməsin */
    var powTop = CY + CHt - powH;                /* səlahiyyətlər kartın altına bağlanır */

    /* --- kağız və başlıq --- */
    out += '<rect width="' + W + '" height="' + H + '" fill="' + P.paper + '"/>';
    out += '<rect width="' + W + '" height="' + H + '" fill="url(#' + idp + '-grain)"/>';
    out += T('ZARAFAT NOTARİAT PALATASI', W / 2, 62, { anchor: 'middle', size: 12, fam: SANS, weight: 'bold', fill: P.head, ls: 4.4 });
    out += T('QEYRİ-RƏSMİ LİSENZİYALAR REYESTRİ', W / 2, 80, { anchor: 'middle', size: 8.4, fam: SANS, fill: P.muted, ls: 3 });
    out += '<path d="M 200 96 H ' + (W - 200) + '" stroke="' + P.accent + '" stroke-width="0.8"/>';

    /* --- kart --- */
    out += '<rect x="' + CX + '" y="' + CY + '" width="' + CWid + '" height="' + CHt + '" rx="18" fill="' + P.soft + '" stroke="' + P.accentD + '" stroke-width="2"/>';
    out += '<rect x="' + (CX + 8) + '" y="' + (CY + 8) + '" width="' + (CWid - 16) + '" height="' + (CHt - 16) + '" rx="12" fill="none" stroke="' + P.accent + '" stroke-width="0.6" stroke-dasharray="4 3"/>';
    out += '<g opacity="0.18">' + guilloche(W / 2, CY + CHt / 2, P, 1, 0.62) + '</g>';
    out += '<rect x="' + CX + '" y="' + CY + '" width="' + CWid + '" height="52" rx="18" fill="' + P.head + '"/>';
    out += '<rect x="' + CX + '" y="' + (CY + 34) + '" width="' + CWid + '" height="18" fill="' + P.head + '"/>';
    out += T('LİSENZİYA / VƏSİQƏ', CX + 22, CY + 33, { size: 13, fam: SANS, weight: 'bold', fill: '#fff', ls: 3.2 });
    out += T('№ ' + doc.regNo, CX + CWid - 22, CY + 33, { anchor: 'end', size: 12, fam: SANS, weight: 'bold', fill: P.accentL, ls: 1.4 });

    /* foto + holoqram */
    out += '<rect x="' + px + '" y="' + py + '" width="' + pw + '" height="' + ph + '" fill="#fff" stroke="' + P.accent + '" stroke-width="1"/>';
    out += '<circle cx="' + (px + pw / 2) + '" cy="' + (py + 66) + '" r="34" fill="' + P.accentL + '" opacity="0.55"/>';
    out += '<path d="M ' + (px + pw / 2 - 52) + ' ' + (py + ph - 10) + ' a 52 60 0 0 1 104 0 Z" fill="' + P.accentL + '" opacity="0.55"/>';
    out += T('FOTO', px + pw / 2, py + ph - 14, { anchor: 'middle', size: 9, fam: SANS, fill: '#fff', ls: 2.4 });
    out += '<circle cx="' + (px + pw / 2) + '" cy="' + (py + ph + 42) + '" r="30" fill="url(#' + idp + '-holo)" opacity="0.55"/>';
    out += '<path d="' + rosette(px + pw / 2, py + ph + 42, 27, 13, 0.18) + '" fill="none" stroke="' + P.accentD + '" stroke-width="0.5" opacity="0.7"/>';
    out += T('HOLOQRAM', px + pw / 2, py + ph + 88, { anchor: 'middle', size: 7.4, fam: SANS, fill: P.muted, ls: 1.6 });

    /* sahələr */
    var y = py + 4;
    out += block(tl, fx, y + 12, ts + 5, { size: ts, weight: 'bold', fam: SANS, fill: P.head, ls: 1.2 });
    y += 12 + tl.length * (ts + 5) + 12;
    out += '<path d="M ' + fx + ' ' + y + ' H ' + (fx + fw) + '" stroke="' + P.accent + '" stroke-width="0.7"/>';
    y += 20;
    fields.forEach(function (f) {
      out += T(f[0], fx, y, { size: 7.8, fam: SANS, weight: 'bold', fill: P.accent, ls: 1.6 });
      out += T(wrap(f[1] || '—', font(13.5, 'bold', SANS), fw, 1)[0], fx, y + 18, { size: 13.5, weight: 'bold', fam: SANS, fill: P.head });
      out += '<path d="M ' + fx + ' ' + (y + 25) + ' H ' + (fx + fw) + '" stroke="' + P.accent + '" stroke-width="0.4" stroke-dasharray="2 2"/>';
      y += 42;
    });

    /* səlahiyyətlər */
    var sy = powTop;
    out += T(doc.powersLabel || 'LİSENZİYANIN ƏHATƏ ETDİYİ SƏLAHİYYƏTLƏR', CX + 26, sy, { size: 8, fam: SANS, weight: 'bold', fill: P.accent, ls: 1.6 });
    sy += 18;
    its.forEach(function (it) {
      out += T('▸', CX + 26, sy, { size: 9, fam: SANS, fill: P.accent });
      out += T(wrap(it, font(11.4, '', SANS), CWid - 72, 1)[0], CX + 42, sy, { size: 11.4, fam: SANS, fill: P.ink });
      sy += 20;
    });

    /* kartdan sonra */
    var by = CY + CHt + 34;
    var pre = wrap(doc.preamble, font(11.8, '', SANS), W - 140, 3);
    out += block(pre, 70, by, 18.5, { size: 11.8, fam: SANS, fill: P.ink });
    by += pre.length * 18.5 + 22;
    var pen = wrap(doc.penalty || '—', font(11.4, '', SANS), 430, 3);
    out += '<rect x="70" y="' + (by - 14) + '" width="4" height="' + (pen.length * 17 + 24) + '" fill="' + P.seal + '"/>';
    out += T(doc.penaltyLabel || 'LƏĞVETMƏ ŞƏRTİ', 84, by, { size: 8, fam: SANS, weight: 'bold', fill: P.seal, ls: 1.6 });
    out += block(pen, 84, by + 16, 17, { size: 11.4, fam: SANS, fill: P.ink });
    by += 16 + pen.length * 17;

    var sealY = Math.max(Math.min(by + 10, 946), 880);
    out += seal(650, sealY, 62, P, doc.regNo, idp, -9);
    out += qrOrHint(doc, P, 70, 1000, 58, 138);
    out += barcode(doc.regNo, W - 250, 1012, 180, 20);
    out += T(doc.regNo, W - 70, 1046, { anchor: 'end', size: 7.6, fam: SANS, fill: P.muted, ls: 1.6 });

    if (C.verified) out += verifiedStamp(520, CY + CHt - 90, -11);
    out += watermark(P, doc.paid);
    out += disclaimer(P, 0, H - 26, W);
    return out;
  }

  var LAYOUTS = { notarial: L_notarial, blank: L_blank, diplom: L_diplom, sertifikat: L_sertifikat, lisenziya: L_lisenziya };

  /* ---------------- defs ---------------- */
  function defs(idp, P) {
    return '<defs>' +
      '<linearGradient id="' + idp + '-metal" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0%" stop-color="' + P.accentL + '"/><stop offset="35%" stop-color="' + P.accentD + '"/>' +
      '<stop offset="60%" stop-color="' + P.accentL + '"/><stop offset="100%" stop-color="' + P.accent + '"/></linearGradient>' +
      '<linearGradient id="' + idp + '-holo" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0%" stop-color="#8fd6ff"/><stop offset="30%" stop-color="#c9a7ff"/>' +
      '<stop offset="60%" stop-color="#ffd6a5"/><stop offset="100%" stop-color="#9bf6c8"/></linearGradient>' +
      '<pattern id="' + idp + '-grain" width="6" height="6" patternUnits="userSpaceOnUse">' +
      '<circle cx="1" cy="1" r="0.45" fill="' + P.accentD + '" opacity="0.09"/>' +
      '<circle cx="4" cy="3.5" r="0.35" fill="' + P.accentD + '" opacity="0.07"/></pattern>' +
      '</defs>';
  }

  function ctxFor(doc, opts) {
    opts = opts || {};
    var P = PALETTES[doc.palette] || PALETTES.gold;
    var idp = opts.idPrefix || ('d' + (hash(doc.regNo + (doc.layout || '')) % 99999));
    return { P: P, idp: idp, verified: !!opts.verified };
  }

  function inner(doc, C) {
    return (LAYOUTS[doc.layout] || LAYOUTS.notarial)(doc, C);
  }

  /* ---------------- ictimai API ---------------- */
  function a4(doc, opts) {
    var C = ctxFor(doc, opts);
    return '<svg xmlns="http://www.w3.org/2000/svg" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '">' +
      defs(C.idp, C.P) + inner(doc, C) + '</svg>';
  }

  function story(doc, opts) {
    opts = opts || {};
    var C = ctxFor(doc, { idPrefix: opts.idPrefix || ('s' + (hash(doc.regNo) % 99999)), verified: opts.verified });
    var P = C.P, SW = 1080, SH = 1920, sc = 1.22, dx = (SW - W * sc) / 2, dy = 300;
    var s = '<svg xmlns="http://www.w3.org/2000/svg" width="' + SW + '" height="' + SH + '" viewBox="0 0 ' + SW + ' ' + SH + '">';
    s += '<defs><linearGradient id="' + C.idp + '-bg" x1="0" y1="0" x2="0.4" y2="1">' +
      '<stop offset="0%" stop-color="#0a1526"/><stop offset="55%" stop-color="' + P.head + '"/><stop offset="100%" stop-color="#08101e"/>' +
      '</linearGradient></defs>' + defs(C.idp, P);
    s += '<rect width="' + SW + '" height="' + SH + '" fill="url(#' + C.idp + '-bg)"/>';
    s += '<g opacity="0.09" stroke="' + P.accentL + '" fill="none" stroke-width="1"><path d="' + rosette(SW / 2, SH / 2, 620, 13, 0.14) + '"/></g>';
    s += T('ZARAFAT NOTARİAT PALATASI', SW / 2, 132, { anchor: 'middle', size: 27, fam: SANS, weight: 'bold', fill: P.accentL, ls: 6 });
    var hl = wrap(doc.title.toUpperCase(), font(43, 'bold', SANS), 920, 2);
    s += block(hl, SW / 2, 198, 50, { size: 43, weight: 'bold', fam: SANS, fill: '#fff', anchor: 'middle', ls: 1 });
    s += '<g transform="translate(' + dx + ',' + dy + ') scale(' + sc + ')">';
    s += '<rect x="-6" y="-6" width="' + (W + 12) + '" height="' + (H + 12) + '" fill="#000" opacity="0.35"/>';
    s += inner(doc, C) + '</g>';
    s += T(doc.regNo, SW / 2, SH - 118, { anchor: 'middle', size: 32, fam: SANS, weight: 'bold', fill: P.accentL, ls: 3 });
    s += T('Sən də yarat → zarafat.az', SW / 2, SH - 72, { anchor: 'middle', size: 23, fam: SANS, fill: '#c9d3e6', ls: 2 });
    s += T('Yalnız əyləncə üçün · Hüquqi qüvvəsi yoxdur', SW / 2, SH - 36, { anchor: 'middle', size: 17, fam: SANS, fill: '#7f8ba3', ls: 1.4 });
    return s + '</svg>';
  }

  return {
    a4: a4, story: story,
    W: W, H: H, STORY_W: 1080, STORY_H: 1920,
    LAYOUTS: Object.keys(LAYOUTS), LAYOUT_NAMES: LAYOUT_NAMES, PALETTES: Object.keys(PALETTES)
  };
})();
