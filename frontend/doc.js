/* ==================================================================
   Zarafat Notariat Palatası — çox-dizaynlı SVG sənəd generatoru
   Layoutlar: notarial · blank · diplom · sertifikat · lisenziya
              arayis · qerar · muqavile · teleqram · vesiqe
   Ölçülər:   A4 794×1123 · Story 1080×1920
   Xarici asılılıq: yalnız QRZ (qr.js)
   ================================================================== */
window.DOCGEN = (function () {
  'use strict';

  var W = 794, H = 1123;
  var SERIF = "Georgia, 'Times New Roman', 'Liberation Serif', 'Noto Serif', serif";
  var SANS  = "'Helvetica Neue', Helvetica, Arial, 'Liberation Sans', sans-serif";
  var MONO  = "'Courier New', Courier, 'Liberation Mono', 'DejaVu Sans Mono', monospace";

  /* ---------------- ton sistemi ----------------
     İki ton var: 'zarafat' (default) və 'xatire'. Layoutların quruluşu eynidir —
     yalnız ortaq mətnlər bu cədvəldən oxunur. «Hüquqi qüvvəyə malik deyil»
     ifadəsi hər iki tonda qalır: hüquqi qalxanın əsasıdır. */
  var TONE = {
    zarafat: {
      org:        'ZARAFAT NOTARİAT PALATASI',
      orgSub:     'QEYRİ-RƏSMİ SƏNƏDLƏR VAHİD REYESTRİ',
      orgAgency:  'UYDURMA QURUM · QEYRİ-RƏSMİ SƏNƏDLƏR İDARƏSİ',
      notary:     'Ə. ZARAFATOV',
      notaryCap:  'Ə. Zarafatov',
      role:       'Növbətçi notarius',
      notaryLine: 'Növbətçi notarius: Ə. ZARAFATOV (uydurma şəxs)',
      court:      'ZARAFAT MƏHKƏMƏSİ',
      courtFrom:  'ZARAFAT MƏHKƏMƏSİ ADINDAN',
      courtSub:   'UYDURMA MƏHKƏMƏ ORQANI · HEÇ BİR YURİSDİKSİYASI YOXDUR',
      judgeRole:  'Hakim',
      partyA:     'İDDİAÇI:',
      partyB:     'CAVABDEH:',
      subject:    'İŞİN PREDMETİ:',
      appeal:     'Qərardan 10 gün müddətində Zarafat Apellyasiya İnstansiyasına (mövcud deyil) ' +
                  'şikayət verilə bilər. Şikayət gülüşlə qarşılanacaq.',
      addr:       'Bakı ş., Zarafat küç. 1 · tel: (012) 000-00-00 (mövcud deyil)',
      wire:       'BAKI ZARAFAT KUC 1',
      nation:     'ZARAFAT / ZRF',
      comp:       'Zarafat Məhkəməsi, hakim Ə. ZARAFATOV (uydurma şəxs) sədrliyi və katib ' +
                  'N. Gülüşovanın iştirakı ilə, açıq məhkəmə iclasında aşağıdakı işə baxaraq',
      press:      '«Zarafat-Poliqrafiya» MMC (mövcud deyil)',
      sealBot:    'ƏYLƏNCƏ MƏQSƏDLİDİR',
      sealTag:    'PARODİYA',
      micro:      'ZARAFAT \u2022 H\u00dcQUQ\u0130 Q\u00dcVV\u018fS\u0130 YOXDUR \u2022 PAROD\u0130YA \u2022 ',
      wmTop:      'ZARAFAT',
      wmSub:      'HÜQUQİ QÜVVƏSİ YOXDUR',
      band:       'BU SƏNƏD TAMAMİLƏ ƏYLƏNCƏ MƏQSƏDİ DAŞIYIR VƏ HEÇ BİR HÜQUQİ QÜVVƏYƏ MALİK DEYİL.',
      mrzOpt:     'PARODIYA',
      storyFoot:  'Yalnız əyləncə üçün · Hüquqi qüvvəsi yoxdur',
      /* ekspertiza dizaynının başlıqları — xatirə tonunda klinik səslənməsin deyə ayrıdır */
      expHead:    'EKSPERTİZA RƏYİ',
      expNo:      'RƏY №',
      expFound:   'MÜƏYYƏN EDİLMİŞDİR',
      expMarks:   'AŞKARLANMIŞ ƏLAMƏTLƏR',
      penAccent:  false
    },
    xatire: {
      org:        'XATİRƏ SƏNƏDLƏRİ PALATASI',
      orgSub:     'XATİRƏ SƏNƏDLƏRİ REYESTRİ',
      orgAgency:  'UYDURMA QURUM · XATİRƏ SƏNƏDLƏRİ İDARƏSİ',
      notary:     'X. XATİRƏLİ',
      notaryCap:  'X. Xatirəli',
      role:       'Qeydiyyat məmuru',
      notaryLine: 'Qeydiyyat: X. XATİRƏLİ (uydurma şəxs)',
      court:      'XATİRƏ ŞURASI',
      courtFrom:  'XATİRƏ ŞURASI ADINDAN',
      courtSub:   'UYDURMA ŞURA ORQANI · HEÇ BİR YURİSDİKSİYASI YOXDUR',
      judgeRole:  'Sədr',
      partyA:     'MÜRACİƏT EDƏN:',
      partyB:     'BARƏSİNDƏ:',
      subject:    'MÜRACİƏTİN PREDMETİ:',
      appeal:     'Qərar barədə istənilən vaxt Xatirə Şurasına müraciət edilə bilər (mövcud deyil). ' +
                  'Müraciət xoş qarşılanacaq.',
      addr:       'Bakı ş., Xatirə küç. 1 · tel: (012) 000-00-00 (mövcud deyil)',
      wire:       'BAKI XATIRE KUC 1',
      nation:     'XATİRƏ / ZRF',
      comp:       'Xatirə Sənədləri Palatasının Şurası, sədr X. XATİRƏLİ (uydurma şəxs) ' +
                  'sədrliyi və katib N. Gülüşovanın iştirakı ilə, açıq iclasda aşağıdakı müraciətə baxaraq',
      press:      '«Xatirə-Poliqrafiya» MMC (mövcud deyil)',
      sealBot:    'XATİRƏ SƏNƏDİ',
      sealTag:    'XATİRƏ',
      micro:      'XAT\u0130R\u018f \u2022 H\u00dcQUQ\u0130 Q\u00dcVV\u018fS\u0130 YOXDUR \u2022 XAT\u0130R\u018f S\u018fN\u018fD\u0130 \u2022 ',
      wmTop:      null,
      wmSub:      null,
      band:       'BU SƏNƏD XATİRƏ MƏQSƏDLİDİR VƏ HEÇ BİR HÜQUQİ QÜVVƏYƏ MALİK DEYİL.',
      mrzOpt:     'XATIRE',
      storyFoot:  'Xatirə sənədi · Hüquqi qüvvəsi yoxdur',
      expHead:    'QEYD VƏRƏQİ',
      expNo:      'QEYD №',
      expFound:   'QEYDƏ ALINMIŞDIR',
      expMarks:   'QEYD OLUNANLAR',
      penAccent:  true
    }
  };

  var TONES = ['zarafat', 'xatire'];
  var TONE_NAMES = { zarafat: 'Zarafat', xatire: 'Xatirə' };

  /* Cari ton — hər render başlanğıcında `ctxFor` təyin edir. Render sinxrondur,
     ona görə modul səviyyəsində saxlamaq təhlükəsizdir və `seal`, `crest`,
     `emboss` kimi `doc` almayan köməkçilərə imza dəyişmədən ton çatdırır. */
  var CUR = TONE.zarafat;
  function TT() { return CUR; }

  /* Cəza/penalty bloklarının vurğusu: xatirə tonunda qırmızı xəbərdarlıq hissi yersizdir. */
  function penC(P) { return CUR.penAccent ? P.accent : P.seal; }

  /* ---------------- palitralar ---------------- */
  var PALETTES = {
    gold:     { paper:'#fbf7ec', ink:'#1b2436', head:'#132644', accent:'#b0882a', accentL:'#dcbe63', accentD:'#7d5f14', muted:'#5d6577', seal:'#a1202b', soft:'#fdf1f0' },
    steel:    { paper:'#ffffff', ink:'#1a2230', head:'#0f2740', accent:'#2f5d8a', accentL:'#9dc0dd', accentD:'#1d3f61', muted:'#5a6675', seal:'#1f4c8f', soft:'#eef4fa' },
    burgundy: { paper:'#fdf6ef', ink:'#25191c', head:'#5a1220', accent:'#8d1d33', accentL:'#d3a2ac', accentD:'#5f0f20', muted:'#6b5b60', seal:'#8d1d33', soft:'#fbeef0' },
    forest:   { paper:'#fbfdfa', ink:'#17241d', head:'#123a2a', accent:'#1f7a52', accentL:'#8fcfb2', accentD:'#0f4a31', muted:'#586b61', seal:'#1b6a48', soft:'#ecf7f1' },
    ink:      { paper:'#f7f8fb', ink:'#151b26', head:'#101828', accent:'#3b4b6b', accentL:'#a3b2ce', accentD:'#232f47', muted:'#5b6579', seal:'#8a2a2a', soft:'#eef1f7' },
    rose:     { paper:'#fdf7f4', ink:'#2a1e20', head:'#6b2233', accent:'#a8586b', accentL:'#e0b3bf', accentD:'#7d3145', muted:'#6f5b60', seal:'#a8586b', soft:'#fbeef1' }
  };

  var LAYOUT_NAMES = {
    notarial:   'Notarial akt',
    blank:      'Rəsmi blank',
    diplom:     'Diplom',
    sertifikat: 'Sertifikat',
    lisenziya:  'Lisenziya kartı',
    arayis:     'Arayış',
    qerar:      'Məhkəmə qərarı',
    muqavile:   'Müqavilə',
    teleqram:   'Teleqram',
    vesiqe:     'Vəsiqə',
    viza:       'Viza',
    ekspertiza: 'Ekspertiza rəyi'
  };

  /* ---------------- ölçmə və mətn ---------------- */
  var _mc = document.createElement('canvas').getContext('2d');
  function font(size, weight, fam, style) {
    return (style ? style + ' ' : '') + (weight ? weight + ' ' : '') + size + 'px ' + (fam || SERIF);
  }
  function measure(t, f) { _mc.font = f; return _mc.measureText(t).width; }

  /* Azərbaycan dilində i → İ və ı → I olur; JS-in toUpperCase()-i bunu bilmir
     və «Lisenziyası» sözünü «LISENZIYASI» kimi verir. */
  function upper(str) {
    return String(str == null ? '' : str).replace(/i/g, 'İ').replace(/ı/g, 'I').toUpperCase();
  }

  /* Azərbaycan dilində I → ı və İ → i olur; JS-in toLowerCase()-i «İ»-ni
     iki simvola (i + birləşən nöqtə) çevirir. */
  function lower(str) {
    return String(str == null ? '' : str).replace(/İ/g, 'i').replace(/I/g, 'ı').toLowerCase();
  }

  /* Sahə etiketi: şablonun öz etiketi → xatirə tonunun yumşaq etiketi → layoutun
     öz fallback-ı. Layout fallback-ı cümlə registrindədirsə («Kimə verilir»),
     yumşaq etiket də həmin registrə salınır. */
  var XLABEL = { toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'SON SÖZ' };
  function lbl(doc, key, fallback) {
    if (doc[key]) return doc[key];
    if (!CUR.penAccent) return fallback;
    var x = XLABEL[key];
    return upper(fallback) === fallback ? x : x.charAt(0) + lower(x.slice(1));
  }

  /* Masthead-in altındakı «verən qurum» sətri. Şablonun `signOrg` sahəsi
     doludursa onu, boşdursa dizaynın öz mətnini yazır. `caps` slotun
     registrindəndir: qrifi böyük hərflə yazan dizaynlarda true, cümlə
     registrində olanlarda (blank, müqavilə) false.
     `fallback` boş sətirdirsə (öz alt sətri olmayan üç dizayn) `signOrg`
     yox ikən heç nə emissiya olunmur — çıxış bayt-bayt dəyişmir
     (bax: tools/hash-layouts.js). */
  function qurumSetri(doc, fallback, caps, x, y, o) {
    var s = doc.signOrg ? (caps ? upper(doc.signOrg) : doc.signOrg) : fallback;
    return s ? T(s, x, y, o) : '';
  }

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

  /* Birinci sətri abzaslı sarğı — rəsmi sənədlərin mətn bloku belə başlayır. */
  function wrapIndent(text, f, w, indent, maxLines) {
    var words = String(text || '').trim().split(/\s+/), first = '', i = 0;
    while (i < words.length) {
      var t = first ? first + ' ' + words[i] : words[i];
      if (measure(t, f) > w - indent && first) break;
      first = t; i++;
    }
    var rest = words.slice(i).join(' ');
    var lines = rest ? wrap(rest, f, w, maxLines ? maxLines - 1 : 0) : [];
    return [first].concat(lines);
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

  function pad(n, len) {
    var t = String(n);
    while (t.length < len) t = '0' + t;
    return t;
  }

  /* ==================================================================
     ÜÇ QAT QAYDASI — yeni element əlavə edərkən mütləq oxunmalıdır.

       1. SUBSTRAT   — `var bs = out.length` sətrindən ƏVVƏL. Sürüşmür.
       2. GÖVDƏ      — `bs` ilə `centerBody(...)` arasında. `dy` qədər sürüşür.
       3. AVADANLIQ  — `centerBody(...)` çağırışından SONRA. Sürüşmür.

     `bs` sətrin bayt ofsetidir: `bs` ilə `centerBody` arasına salınan hər şey
     səssizcə sürüşən qrupa qoşulur və 130px-ə qədər yerini dəyişir.
     Substrat üçün `paperBase()`, avadanlıq üçün `pageFurniture()` işlədilir —
     adları məhz qatlarını bildirsin deyə seçilib.

     `dy = min(0.45*slack, maxShift)` və `0.45*slack < slack` olduğuna görə
     sürüşən gövdə heç vaxt `footerTop`-u keçmir: `footerTop`-dan aşağı
     sancılan hər şey konstruksiyaya görə toqquşmur.
     ================================================================== */

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

  /* Parametrik beşguşəli ulduz — masthead ulduzunun (index.html) miqyaslana bilən əkizi. */
  function star5(cx, cy, rO, rI) {
    var d = '';
    for (var i = 0; i < 10; i++) {
      var a = -Math.PI / 2 + i * Math.PI / 5, rr = (i % 2) ? rI : rO;
      d += (i ? 'L' : 'M') + (cx + rr * Math.cos(a)).toFixed(2) + ' ' + (cy + rr * Math.sin(a)).toFixed(2);
    }
    return d + 'Z';
  }

  /* Dəfnə budağı: R radiuslu qövs + üstündə n yarpaq. Açılar dərəcə ilə. */
  function laurel(cx, cy, R, a0, a1, n, len, C) {
    var out = '<g fill="' + C + '" opacity="0.8"><path d="', i, a, ar, lr, x, y;
    for (i = 0; i <= 20; i++) {
      ar = (a0 + (a1 - a0) * i / 20) * Math.PI / 180;
      out += (i ? 'L' : 'M') + (cx + R * Math.cos(ar)).toFixed(2) + ' ' + (cy + R * Math.sin(ar)).toFixed(2);
    }
    out += '" fill="none" stroke="' + C + '" stroke-width="' + (len * 0.22).toFixed(2) + '" stroke-linecap="round"/>';
    lr = R + len * 0.62;
    for (i = 0; i < n; i++) {
      a = a0 + (a1 - a0) * (i + 0.5) / n;
      ar = a * Math.PI / 180;
      x = cx + lr * Math.cos(ar); y = cy + lr * Math.sin(ar);
      out += '<ellipse cx="0" cy="0" rx="' + len.toFixed(2) + '" ry="' + (len * 0.40).toFixed(2) +
        '" transform="translate(' + x.toFixed(2) + ',' + y.toFixed(2) + ') rotate(' + (a + 104).toFixed(1) + ')"/>';
    }
    return out + '</g>';
  }

  /* Heraldik gerb — `emblem`-i əvəz edir.
     o = { sub, banner, solid, mono, op, detail:'auto'|'full'|'min'|'ghost' }

     Uydurma gerbdir: alov yoxdur, palıd+sünbül çələngi yoxdur, bayraq rəngləri
     əsas sxem deyil — ulduz palitranın `accent` rəngini götürür. */
  function crest(cx, cy, r, P, o) {
    o = o || {};
    var det = o.detail && o.detail !== 'auto' ? o.detail : (r >= 30 ? 'full' : 'min');
    var ringC = o.mono || P.accent;
    var ring2C = o.mono || P.accentL;
    var textC = o.mono || (o.solid ? '#ffffff' : P.accentD);
    var leafC = o.mono || P.accentD;
    var g = '<g' + (o.op ? ' opacity="' + o.op + '"' : '') + '>';

    if (o.solid) g += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + P.head + '"/>';

    if (det === 'full') {
      var lf = laurel(cx, cy, r * 1.06, 96, 202, 8, r * 0.132, leafC);
      g += lf + '<g transform="translate(' + (2 * cx).toFixed(2) + ',0) scale(-1,1)">' + lf + '</g>';
    }

    g += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="' + ringC + '" stroke-width="' + (r * 0.055).toFixed(2) + '"/>';
    g += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r * 0.80).toFixed(2) + '" fill="none" stroke="' + ring2C + '" stroke-width="' + (r * 0.030).toFixed(2) + '"/>';
    if (det !== 'ghost')
      g += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r * 0.66).toFixed(2) + '" fill="none" stroke="' + ringC + '" stroke-width="' + (r * 0.022).toFixed(2) + '"/>';
    if (det === 'full')
      g += '<path d="' + rosette(cx, cy, r * 0.58, 9, 0.2) + '" fill="none" stroke="' + ring2C + '" stroke-width="0.5"/>';

    g += '<path d="' + star5(cx, cy - r * 0.34, r * 0.26, r * 0.115) + '" fill="' + (o.mono || P.accent) + '" opacity="0.92"/>';
    g += T('ZNP', cx, cy + r * 0.22, { anchor: 'middle', size: r * 0.44, weight: 'bold', fill: textC, ls: r * 0.02 });
    if (o.sub !== false && det === 'full')
      g += T('EST. 2026', cx, cy + r * 0.54, { anchor: 'middle', size: r * 0.145, fam: SANS, fill: textC, ls: r * 0.03 });

    var bt = o.banner === undefined ? CUR.sealTag : o.banner;
    if (bt && (det === 'full' || det === 'ghost')) {
      var bw = r * 1.72, bh = r * 0.34, by = cy + r * 0.84, nt = r * 0.16;
      g += '<path d="M ' + (cx - bw / 2).toFixed(2) + ' ' + by.toFixed(2) +
        ' L ' + (cx + bw / 2).toFixed(2) + ' ' + by.toFixed(2) +
        ' L ' + (cx + bw / 2 - nt).toFixed(2) + ' ' + (by + bh / 2).toFixed(2) +
        ' L ' + (cx + bw / 2).toFixed(2) + ' ' + (by + bh).toFixed(2) +
        ' L ' + (cx - bw / 2).toFixed(2) + ' ' + (by + bh).toFixed(2) +
        ' L ' + (cx - bw / 2 + nt).toFixed(2) + ' ' + (by + bh / 2).toFixed(2) +
        ' Z" fill="' + (o.mono ? 'none' : P.paper) + '" stroke="' + leafC + '" stroke-width="' + (r * 0.02).toFixed(2) + '"/>';
      var bs2 = fit(bt, bw - nt * 2.4, r * 0.19, r * 0.09, 'bold', SANS);
      g += T(bt, cx, by + bh * 0.72, { anchor: 'middle', size: bs2, weight: 'bold', fam: SANS, fill: leafC, ls: r * 0.012 });
    }
    return g + '</g>';
  }

  /* Kənarlar boyunca mikromətn. `textPath` yox — 4 tərəf `rotate` + `textLength`
     ilə çəkilir, belədə <defs>-ə id əlavə etmək lazım gəlmir.
     Hər tərəf bir <text> elementidir. */
  function microtext(x, y, w, h, P, o) {
    o = o || {};
    var txt = o.txt || CUR.micro;
    var size = o.size || 2.4;
    var sides = o.sides || {};
    var f = font(size * 10, '', SANS);
    var uw = measure(txt, f) / 10;
    if (!(uw > 0)) return '';
    var attrs = ' font-family="' + SANS + '" font-size="' + size + '" fill="' + (o.fill || P.accentD) +
      '" opacity="' + (o.op === undefined ? 0.6 : o.op) + '"';
    function run(px, py, deg, len) {
      var reps = Math.ceil(len / uw) + 1, str = '';
      while (str.length < reps * txt.length) str += txt;
      return '<text transform="translate(' + px.toFixed(2) + ',' + py.toFixed(2) + ') rotate(' + deg + ')" x="0" y="0"' +
        attrs + ' textLength="' + len.toFixed(2) + '" lengthAdjust="spacingAndGlyphs">' + esc(str) + '</text>';
    }
    var out = '';
    if (sides.t !== 0) out += run(x, y + size, 0, w);
    if (sides.r !== 0) out += run(x + w - size, y, 90, h);
    if (sides.b !== 0) out += run(x + w, y + h - size, 180, w);
    if (sides.l !== 0) out += run(x + size, y + h, 270, h);
    return out;
  }

  /* Tərəzi piktoqramı — «hesab bağlandı» möhrünün mərkəzi. */
  function terezi(cx, cy, r, C) {
    var a = 'stroke="' + C + '" stroke-width="1.3" fill="none" stroke-linecap="round"';
    return '<g ' + a + '>' +
      '<path d="M ' + cx + ' ' + (cy - r) + ' V ' + (cy + r * 0.9) + '"/>' +
      '<path d="M ' + (cx - r) + ' ' + (cy - r * 0.62) + ' H ' + (cx + r) + '"/>' +
      '<path d="M ' + (cx - r * 0.62) + ' ' + (cy + r * 0.9) + ' H ' + (cx + r * 0.62) + '"/>' +
      '<path d="M ' + (cx - r) + ' ' + (cy - r * 0.62) + ' l ' + (-r * 0.42) + ' ' + (r * 0.72) + ' h ' + (r * 0.84) + ' Z"/>' +
      '<path d="M ' + (cx + r) + ' ' + (cy - r * 0.62) + ' l ' + (-r * 0.42) + ' ' + (r * 0.72) + ' h ' + (r * 0.84) + ' Z"/>' +
      '</g>';
  }

  /* `o` — dizayna xas ikinci dərəcəli möhür üçün: {color, top, bot, tag, center, glyph}.
     Arqumentsiz çağırışda hər şey `CUR`-dan gəlir, yəni parodiya möhrü olduğu kimi qalır. */
  function seal(cx, cy, r, P, regNo, idp, rot, o) {
    o = o || {};
    var top = 'M ' + (cx - (r - 15)) + ' ' + cy + ' A ' + (r - 15) + ' ' + (r - 15) + ' 0 1 1 ' + (cx + (r - 15)) + ' ' + cy;
    var bot = 'M ' + (cx - (r - 17)) + ' ' + cy + ' A ' + (r - 17) + ' ' + (r - 17) + ' 0 0 0 ' + (cx + (r - 17)) + ' ' + cy;
    var C = o.color || P.seal;
    /* Halqa yazısı qövsdən uzun olarsa kəsilir — kiçik radiuslarda şrifti sığdırırıq.
       `measure` hərf aralığını saymır, ona görə onu ayrıca çıxırıq. */
    var topTxt = o.top || CUR.org, botTxt = o.bot || CUR.sealBot;
    var szT = fit(topTxt, Math.PI * (r - 15) * 0.94 - topTxt.length * 0.9, 8.6, 5.4, 'bold', SANS);
    var szB = fit(botTxt, Math.PI * (r - 17) * 0.94 - botTxt.length * 0.9, 8, 5.2, 'bold', SANS);
    var s = '<g transform="rotate(' + (rot === undefined ? -11 : rot) + ' ' + cx + ' ' + cy + ')" opacity="0.88">';
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="' + C + '" stroke-width="3.2"/>';
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r - 7) + '" fill="none" stroke="' + C + '" stroke-width="1.1"/>';
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r - 30) + '" fill="none" stroke="' + C + '" stroke-width="1.1"/>';
    s += '<path id="' + idp + '-st" d="' + top + '" fill="none"/><path id="' + idp + '-sb" d="' + bot + '" fill="none"/>';
    s += '<text font-family="' + SANS + '" font-size="' + szT.toFixed(1) + '" font-weight="bold" fill="' + C + '" letter-spacing="0.9">' +
      '<textPath href="#' + idp + '-st" startOffset="50%" text-anchor="middle">' + esc(topTxt) + '</textPath></text>';
    s += '<text font-family="' + SANS + '" font-size="' + szB.toFixed(1) + '" font-weight="bold" fill="' + C + '" letter-spacing="0.9">' +
      '<textPath href="#' + idp + '-sb" startOffset="50%" text-anchor="middle">' + esc(botTxt) + '</textPath></text>';
    s += o.glyph === 'terezi' ? terezi(cx, cy - 10, 15, C)
      : T(o.center || 'ZNP', cx, cy - 8, { anchor: 'middle', size: 19, weight: 'bold', fill: C, ls: 1 });
    s += T(regNo, cx, cy + 8, { anchor: 'middle', size: 7.5, fam: SANS, fill: C, ls: 0.6 });
    s += '<path d="M ' + (cx - 22) + ' ' + (cy + 15) + ' H ' + (cx + 22) + '" stroke="' + C + '" stroke-width="0.9"/>';
    s += T(o.tag || CUR.sealTag, cx, cy + 26, { anchor: 'middle', size: 7, fam: SANS, fill: C, ls: 0.5 });
    return s + '</g>';
  }

  /* Quru (relyef) möhür — mürəkkəbsiz basma. Eyni halqa dəstinin iki sürüşmüş
     nüsxəsi: kölgə və işıq. Ağ kağızda (steel) yalnız boz kölgə görünür —
     əsl quru möhür ağ vərəqdə məhz belə oxunur.
     `idp` lazımdır: qövs üzərindəki mətn üçün id elan olunur (defs-ə toxunmur). */
  function emboss(cx, cy, r, P, idp, o) {
    o = o || {};
    var idT = idp + '-eb' + (o.k || 1);
    var arc = 'M ' + (cx - (r - 9)) + ' ' + cy + ' A ' + (r - 9) + ' ' + (r - 9) + ' 0 1 1 ' + (cx + (r - 9)) + ' ' + cy;
    function ring(C, op, d) {
      var g = '<g transform="translate(' + d + ',' + d + ')" opacity="' + op + '">';
      g += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="' + C + '" stroke-width="1.6"/>';
      g += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r - 5) + '" fill="none" stroke="' + C + '" stroke-width="0.7"/>';
      g += '<path d="' + rosette(cx, cy, r - 11, 7, 0.18) + '" fill="none" stroke="' + C + '" stroke-width="0.5"/>';
      g += '<text font-family="' + SANS + '" font-size="' + (r * 0.155).toFixed(1) + '" font-weight="bold" fill="' + C + '" letter-spacing="0.5">' +
        '<textPath href="#' + idT + '" startOffset="50%" text-anchor="middle">' + esc(o.top || CUR.org) + '</textPath></text>';
      g += T('ZNP', cx, cy + r * 0.14, { anchor: 'middle', size: r * 0.42, weight: 'bold', fill: C });
      g += T(o.tag || CUR.sealTag, cx, cy + r * 0.56, { anchor: 'middle', size: r * 0.16, fam: SANS, fill: C, ls: 0.5 });
      return g + '</g>';
    }
    return '<g transform="rotate(' + (o.rot === undefined ? -4 : o.rot) + ' ' + cx + ' ' + cy + ')">' +
      '<path id="' + idT + '" d="' + arc + '" fill="none"/>' +
      ring(P.ink, 0.14, 0.9) + ring('#ffffff', 0.85, -0.9) + '</g>';
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

  /* Kağız kütləsinə qarışmış təhlükəsizlik lifləri. Substrat qatındadır:
     dəndən dərhal sonra, hər şeydən əvvəl çəkilir. */
  function fibers(seedStr, P, x, y, w, h, n) {
    var r = rng(seedStr + 'fib'), cols = [P.seal, P.accent, P.accentL, P.muted], out = '', i;
    n = n || 70;
    out += '<g fill="none" stroke-linecap="round">';
    for (i = 0; i < n; i++) {
      var fx = x + r() * w, fy = y + r() * h, len = 6 + r() * 8, a = r() * Math.PI * 2;
      var ex = fx + Math.cos(a) * len, ey = fy + Math.sin(a) * len;
      var qx = (fx + ex) / 2 + (r() - 0.5) * len * 0.8, qy = (fy + ey) / 2 + (r() - 0.5) * len * 0.8;
      out += '<path d="M' + fx.toFixed(1) + ' ' + fy.toFixed(1) + 'Q' + qx.toFixed(1) + ' ' + qy.toFixed(1) +
        ' ' + ex.toFixed(1) + ' ' + ey.toFixed(1) + '" stroke="' + cols[Math.floor(r() * 4)] +
        '" stroke-width="' + (0.55 + r() * 0.25).toFixed(2) + '" opacity="' + (0.28 + r() * 0.17).toFixed(2) + '"/>';
    }
    return out + '</g>';
  }

  /* ---------------- Code 39 (real, oxunan barkod) ----------------
     Hər simvol 9 elementdir: bar/boşluq növbələşir, 3-ü enlidir.
     Öz-özünü yoxlayır — yoxlama rəqəmi lazım deyil. '*' start/stop-dur. */
  var C39 = {
    '0': 'nnnwwnwnn', '1': 'wnnwnnnnw', '2': 'nnwwnnnnw', '3': 'wnwwnnnnn', '4': 'nnnwwnnnw',
    '5': 'wnnwwnnnn', '6': 'nnwwwnnnn', '7': 'nnnwnnwnw', '8': 'wnnwnnwnn', '9': 'nnwwnnwnn',
    'A': 'wnnnnwnnw', 'B': 'nnwnnwnnw', 'C': 'wnwnnwnnn', 'D': 'nnnnwwnnw', 'E': 'wnnnwwnnn',
    'F': 'nnwnwwnnn', 'G': 'nnnnnwwnw', 'H': 'wnnnnwwnn', 'I': 'nnwnnwwnn', 'J': 'nnnnwwwnn',
    'K': 'wnnnnnnww', 'L': 'nnwnnnnww', 'M': 'wnwnnnnwn', 'N': 'nnnnwnnww', 'O': 'wnnnwnnwn',
    'P': 'nnwnwnnwn', 'Q': 'nnnnnnwww', 'R': 'wnnnnnwwn', 'S': 'nnwnnnwwn', 'T': 'nnnnwnwwn',
    'U': 'wwnnnnnnw', 'V': 'nwwnnnnnw', 'W': 'wwwnnnnnn', 'X': 'nwnnwnnnw', 'Y': 'wwnnwnnnn',
    'Z': 'nwwnwnnnn', '-': 'nwnnnnwnw', '.': 'wwnnnnwnn', ' ': 'nwwnnnwnn', '$': 'nwnwnwnnn',
    '/': 'nwnwnnnwn', '+': 'nwnnnwnwn', '%': 'nnnwnwnwn', '*': 'nwnnwnwnn'
  };

  /* Mətni modul enləri massivinə çevirir. Cüt indeks = bar, tək = boşluq. */
  function code39(data, ratio) {
    var wide = ratio || 2;
    var txt = '*' + String(data).toUpperCase().replace(/[^0-9A-Z\-. $\/+%]/g, '-') + '*';
    var els = [], i, j, pat;
    for (i = 0; i < txt.length; i++) {
      pat = C39[txt.charAt(i)] || C39['-'];
      for (j = 0; j < 9; j++) els.push(pat.charAt(j) === 'w' ? wide : 1);
      if (i < txt.length - 1) els.push(1);   // simvollararası dar boşluq
    }
    return els;
  }
  function code39Modules(data, ratio) {
    var e = code39(data, ratio), n = 0;
    for (var i = 0; i < e.length; i++) n += e[i];
    return n;
  }

  /* barcode(data, x, y, w, h, o) — çağırış imzası dəyişməyib, `seed` artıq `data`dır.
     o = { hri, color, bg, ratio, P } */
  function barcode(data, x, y, w, h, o) {
    o = o || {};
    var txt = String(data == null ? '' : data).toUpperCase();
    var mods = code39Modules(txt, o.ratio);
    /* Dar modul 0.90px-dən nazik düşərsə yalnız rəqəm quyruğunu kodlayırıq —
       oxunaqlılıq qorunur, insan üçün yazılan sətir tam nömrəni göstərir. */
    var enc = txt;
    if (w / mods < 0.90) {
      var tail = txt.replace(/^[A-Z]+-/, '');
      if (code39Modules(tail, o.ratio) < mods) { enc = tail; mods = code39Modules(tail, o.ratio); }
    }
    var m = w / mods, els = code39(enc, o.ratio), d = '', cx = x, i;
    for (i = 0; i < els.length; i++) {
      var ew = els[i] * m;
      if (i % 2 === 0) d += 'M' + cx.toFixed(2) + ' ' + y + 'h' + ew.toFixed(2) + 'v' + h + 'h' + (-ew).toFixed(2) + 'z';
      cx += ew;
    }
    var out = '';
    if (o.bg) out += '<rect x="' + (x - 2) + '" y="' + (y - 2) + '" width="' + (w + 4) + '" height="' + (h + 4) + '" fill="#ffffff"/>';
    out += '<path d="' + d + '" fill="' + (o.color || '#16202f') + '"/>';
    if (o.hri) {
      out += T(txt, x + w / 2, y + h + 10, {
        anchor: 'middle', size: Math.min(8.5, w / 16), fam: MONO,
        fill: (o.P && o.P.muted) || '#5d6577', ls: 1.2
      });
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

  /* `data-wm` markeri tondan asılı deyil — `inner()` qapısı su nişanının
     mövcudluğunu məhz ona görə mətnə yox, bu atributa baxaraq yoxlayır
     (xatirə tonunda su nişanının heç bir mətni yoxdur). */
  function watermark(P, paid) {
    var op = paid ? 0.09 : 0.2, out = '';
    if (CUR.wmTop) {
      out += '<g data-wm="1" opacity="' + op + '" transform="rotate(-31 ' + (W / 2) + ' ' + (H / 2) + ')">' +
        T(CUR.wmTop, W / 2, H / 2 - 14, { anchor: 'middle', size: 52, weight: 'bold', fam: SANS, fill: P.head, ls: 7 }) +
        T(CUR.wmSub, W / 2, H / 2 + 28, { anchor: 'middle', size: 20, weight: 'bold', fam: SANS, fill: P.head, ls: 4 }) +
        '</g>';
    } else {
      out += '<g data-wm="1" opacity="0.05" fill="none" stroke="' + P.head + '" stroke-width="1.1">' +
        '<path d="' + rosette(W / 2, H / 2, 300, 15, 0.16) + '"/>' +
        '<path d="' + rosette(W / 2, H / 2, 214, 11, 0.2) + '"/>' +
        '<circle cx="' + (W / 2) + '" cy="' + (H / 2) + '" r="120"/>' +
        '</g>';
    }
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
    return '<rect data-dc="1" x="' + x + '" y="' + y + '" width="' + w + '" height="26" fill="' + P.head + '" opacity="0.93"/>' +
      T(CUR.band, x + w / 2, y + 17, { anchor: 'middle', size: 9.2, fam: SANS, fill: '#f3e6bf', ls: 0.7 });
  }

  /* Diaqonal qutu ştampı — təsdiq, müddət bitməsi, ləğv və dizayna xas ştamplar.
     `verifiedStamp` bunun sabit arqumentli halıdır: defolt dəyərlər hərfi olaraq
     əvvəlki çıxışı verir, ona görə mövcud dizaynların baytı dəyişmir. */
  function stateStamp(cx, cy, o) {
    o = o || {};
    var C = o.color || '#1d6b3f';
    var w = o.w || 270, h = o.h || 74;
    var s = '<g transform="rotate(' + (o.rot || -14) + ' ' + cx + ' ' + cy + ')" opacity="' + (o.op || 0.85) + '">';
    s += '<rect x="' + (cx - w / 2) + '" y="' + (cy - h / 2) + '" width="' + w + '" height="' + h +
      '" fill="none" stroke="' + C + '" stroke-width="4" rx="6"/>';
    s += '<rect x="' + (cx - w / 2 + 8) + '" y="' + (cy - h / 2 + 8) + '" width="' + (w - 16) + '" height="' + (h - 16) +
      '" fill="none" stroke="' + C + '" stroke-width="1.2" rx="3"/>';
    s += T(o.top || '', cx, cy - 3,
      { anchor: 'middle', size: o.topSize || 19, weight: 'bold', fam: SANS, fill: C, ls: o.topLs === undefined ? 1.6 : o.topLs });
    if (o.bot) s += T(o.bot, cx, cy + 19,
      { anchor: 'middle', size: o.botSize || 12, weight: 'bold', fam: SANS, fill: C, ls: o.botLs === undefined ? 2.6 : o.botLs });
    if (o.sub) s += T(o.sub, cx, cy + h / 2 - 8,
      { anchor: 'middle', size: 8.6, fam: SANS, fill: C, ls: 0.6 });
    return s + '</g>';
  }

  /* Sənədin reyestrdəki vəziyyətinə görə ştamp. `doc.state` serverdə hesablanır —
     doc.js-də Date.now() ÇAĞIRILMIR, render determinist qalmalıdır. */
  function docStateStamp(doc, cx, cy) {
    if (doc.state === 'expired')
      return stateStamp(cx, cy, { color: '#5d6577', top: 'MÜDDƏTİ BİTİB', rot: -24, w: 340, h: 68, topSize: 22, op: 0.78 });
    if (doc.state === 'cancelled')
      return stateStamp(cx, cy, { color: '#a1202b', top: 'LƏĞV EDİLDİ', sub: doc.cancelReason || '', rot: -24, w: 366, h: 84, topSize: 24, op: 0.82 });
    return '';
  }

  function verifiedStamp(cx, cy, rot) {
    return stateStamp(cx, cy, { color: '#1d6b3f', top: 'RƏSMİ TƏSDİQ', bot: 'OLUNUB', rot: rot });
  }

  /* ---------------- blank avadanlığı ---------------- */

  /* Qatlama izləri — səhifənin 1/3 və 2/3 hündürlüyündə kənar cizgiləri. */
  function foldMarks(P, lx, rx) {
    lx = lx === undefined ? 10 : lx;
    rx = rx === undefined ? W - 10 : rx;
    var o = '', ys = [H / 3, H * 2 / 3], i;
    for (i = 0; i < 2; i++) {
      var y = ys[i].toFixed(1);
      o += '<path d="M ' + lx + ' ' + y + ' h 9" stroke="' + P.muted + '" stroke-width="0.6" opacity="0.4"/>' +
        '<path d="M ' + (rx - 9) + ' ' + y + ' h 9" stroke="' + P.muted + '" stroke-width="0.6" opacity="0.4"/>';
    }
    return o;
  }

  /* Blank nömrəsi — reyestr nömrəsindən deterministik törəyir. */
  function formNo(doc) {
    var t = [1000, 2000, 5000, 10000][hash(doc.regNo + 't') % 4];
    return 'Forma № ZNP-' + pad(hash(doc.regNo + 'f') % 24 + 1, 2) +
      ' · Tiraj ' + t + ' · Sifariş № ' + pad(hash(doc.regNo + 's') % 10000, 4) +
      ' · ' + CUR.press;
  }
  function formLine(P, doc, x, y, anchor) {
    return T(formNo(doc), x, y, { size: 6.8, fam: SANS, fill: P.muted, op: 0.75, anchor: anchor });
  }
  function pageMark(P, x, y, anchor) {
    return T('Səh. 1 / 1', x, y, { size: 7.2, fam: SANS, fill: P.muted, op: 0.8, anchor: anchor });
  }

  /* Notarial təsdiq düsturu — əsl notarial aktın bağlanış abzasının parodiyası.
     `attestLines` sətirləri qaytarır ki, çağıran `y`-ni davam etdirə bilsin. */
  var ATTEST = {
    zarafat: 'Mən, Zarafat Notariat Palatasının növbətçi notariusu Ə. ZARAFATOV (uydurma şəxs), ' +
      'bu sənədin mətninin tərəflərə ucadan oxunduğunu, tərəflərin gülməkdən imza atmaqda çətinlik ' +
      'çəkdiyini və sənədin heç bir hüquqi nəticə doğurmadığını təsdiq edirəm. Şəxsiyyət yoxlanılmadı, ' +
      'fəaliyyət qabiliyyəti şübhə altında qaldı. Reyestrdə № {reg} altında qeydə alındı. ' +
      'Dövlət rüsumu alınmadı — bu qurum mövcud deyil.',
    xatire: 'Mən, Xatirə Sənədləri Palatasının qeydiyyat məmuru X. XATİRƏLİ (uydurma şəxs), ' +
      'bu sənədin mətninin tərəflərə ucadan oxunduğunu, deyilən sözlərin səmimiliyinə şübhə ' +
      'olmadığını və sənədin heç bir hüquqi nəticə doğurmadığını təsdiq edirəm. Sənəd illər sonra ' +
      'yenidən oxunmaq üçün verilir. Reyestrdə № {reg} altında qeydə alındı. ' +
      'Dövlət rüsumu alınmadı — bu qurum mövcud deyil.'
  };

  function attestLines(doc, w, maxLines) {
    var t = ATTEST[doc.tone === 'xatire' ? 'xatire' : 'zarafat'];
    return wrap(t.replace('{reg}', doc.regNo), font(9.4, '', SERIF, 'italic'), w - 14, maxLines || 5);
  }
  function attestation(P, lines, x, y, w) {
    return '<path d="M ' + x + ' ' + (y - 13) + ' H ' + (x + w) + '" stroke="' + P.accent + '" stroke-width="0.5" opacity="0.7"/>' +
      '<rect x="' + x + '" y="' + (y - 9) + '" width="3" height="' + (lines.length * 13.6 + 3).toFixed(1) + '" fill="' + P.accentD + '" opacity="0.5"/>' +
      block(lines, x + 12, y + 1, 13.6, { size: 9.4, style: 'italic', fill: P.muted });
  }

  /* Kargüzarlıq ştampı. Mürəkkəbi bilərəkdən palitradan asılı deyil —
     qırmızı möhürdən fərqli ikinci mürəkkəb çoxmöhürlü sənəd təsirini verir. */
  function intakeStamp(x, y, P, doc, rot) {
    var C = '#1e4b9c', w = 158, h = 62, cx = x + w / 2;
    var r = rot === undefined ? (hash(doc.regNo + 'in') % 9) - 4 : rot;
    var g = '<g transform="rotate(' + r + ' ' + cx + ' ' + (y + h / 2) + ')" opacity="0.72">';
    g += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="2" fill="none" stroke="' + C + '" stroke-width="1.6"/>';
    g += '<rect x="' + (x + 4) + '" y="' + (y + 4) + '" width="' + (w - 8) + '" height="' + (h - 8) + '" rx="1" fill="none" stroke="' + C + '" stroke-width="0.6"/>';
    g += T(CUR.org, cx, y + 16, { anchor: 'middle', size: 6.4, fam: SANS, fill: C, ls: 0.6 });
    g += T('DAXİL OLDU', cx, y + 33, { anchor: 'middle', size: 12, weight: 'bold', fam: SANS, fill: C, ls: 1.8 });
    g += T(doc.date, x + 12, y + 50, { size: 8.4, fam: MONO, fill: C });
    g += T('№ ______', x + w - 12, y + 50, { anchor: 'end', size: 8.4, fam: MONO, fill: C });
    return g + '</g>';
  }

  /* ---------------- MRZ (ICAO TD3) — yalnız `vesiqe` ---------------- */
  function mrzTrans(str) {
    var map = { 'Ə': 'E', 'ə': 'E', 'Ç': 'C', 'ç': 'C', 'Ğ': 'G', 'ğ': 'G', 'İ': 'I', 'ı': 'I',
                'Ö': 'O', 'ö': 'O', 'Ş': 'S', 'ş': 'S', 'Ü': 'U', 'ü': 'U' };
    return String(str || '').replace(/[ƏəÇçĞğİıÖöŞşÜü]/g, function (c) { return map[c]; })
      .toUpperCase().replace(/[^A-Z]+/g, '<');
  }
  function mrzCheck(str) {
    var wts = [7, 3, 1], sum = 0, i, c, v;
    for (i = 0; i < str.length; i++) {
      c = str.charAt(i);
      if (c >= '0' && c <= '9') v = c.charCodeAt(0) - 48;
      else if (c >= 'A' && c <= 'Z') v = c.charCodeAt(0) - 55;
      else v = 0;
      sum += v * wts[i % 3];
    }
    return String(sum % 10);
  }
  function mrzFix(str, n) {
    str = String(str);
    if (str.length > n) return str.slice(0, n);
    while (str.length < n) str += '<';
    return str;
  }
  /* PARODIYA sözü həm 1-ci sətirdə, həm də 2-ci sətrin «optional data»
     sahəsindədir (29–42) — PNG-ni oxuyan OCR sahibin nömrəsini belə göstərəcək. */
  function mrzPair(doc) {
    var parts = String(doc.to || '').trim().split(/\s+/);
    var sur = mrzTrans(parts.length > 1 ? parts[parts.length - 1] : (parts[0] || 'X'));
    var giv = mrzTrans(parts.slice(0, -1).join(' ')) || 'X';
    var l1 = 'P<ZRF' + mrzFix(sur + '<<' + giv, 29) + '<<' + CUR.mrzOpt;

    var digits = String(doc.regNo || '').replace(/\D/g, '');
    var docNo = mrzFix('Z' + (digits.length >= 8 ? digits.slice(-8) : pad(digits, 8)), 9);
    var h = hash(doc.regNo + 'dob');
    var dob = pad(70 + h % 30, 2) + pad(1 + h % 12, 2) + pad(1 + h % 28, 2);
    var dm = String(doc.date || '').match(/(\d{2})\.(\d{2})\.(\d{4})/);
    var exp = dm ? pad((parseInt(dm[3], 10) + 10) % 100, 2) + dm[2] + dm[1] : '360101';
    var opt = mrzFix(CUR.mrzOpt, 14);
    var core = docNo + mrzCheck(docNo) + dob + mrzCheck(dob) + exp + mrzCheck(exp) + opt + mrzCheck(opt);
    var l2 = docNo + mrzCheck(docNo) + 'ZRF' + dob + mrzCheck(dob) + '<' + exp + mrzCheck(exp) +
      opt + mrzCheck(opt) + mrzCheck(core);
    return [mrzFix(l1, 44), mrzFix(l2, 44)];
  }
  /* Viza səhifəsinin maşınoxunan zonası. `mrzPair`-dən fərqi: TD3 deyil,
     dekorativdir — buna baxmayaraq 29–42 mövqelərində `CUR.mrzOpt` daşıyır,
     yəni istənilən OCR sənədin parodiya olduğunu oxuyur (hüquqi qalxan).
     `doc.until` — qayıdış vaxtı; yoxdursa sənədin tarixi işlədilir. */
  function mrzViza(doc) {
    var parts = String(doc.to || '').trim().split(/\s+/);
    var sur = mrzTrans(parts.length > 1 ? parts[parts.length - 1] : (parts[0] || 'X'));
    var giv = mrzTrans(parts.slice(0, -1).join(' ')) || 'X';
    var opt = mrzFix(CUR.mrzOpt, 14);
    /* 5 (prefiks) + 23 (ad) = 28, sonra 29–42 optional data, sonuncu iki xana doldurucu */
    var l1 = mrzFix('V<AZE' + mrzFix(sur + '<<' + giv, 23) + opt, 44);

    var digits = String(doc.regNo || '').replace(/\D/g, '');
    var docNo = mrzFix('V' + (digits.length >= 8 ? digits.slice(-8) : pad(digits, 8)), 9);
    var until = mrzFix(mrzTrans(String(doc.until || doc.date || '')), 10);
    var l2 = mrzFix(docNo + mrzCheck(docNo) + 'ZRF' + until + mrzCheck(until) + opt + mrzCheck(opt), 44);
    return [l1, l2];
  }

  /* Bir <text> + 44 <tspan>: həqiqi monospace addım, cəmi bir element düyünü. */
  function mrzLine(str, x, y, adv, size, fill) {
    var t = '<text font-family="' + MONO + '" font-size="' + size + '" fill="' + fill + '">', i;
    for (i = 0; i < str.length; i++)
      t += '<tspan x="' + (x + i * adv).toFixed(2) + '" y="' + y + '">' + esc(str.charAt(i)) + '</tspan>';
    return t + '</text>';
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

  /* ---------------- struktur bloklar ----------------
     Anket cavablarını sənədə çevirən üç köməkçi: `doc.data` etiket→dəyər
     sətirləri, `doc.checks` seçilmiş bəndlər, `doc.scale` isə 1–10 şkalası.
     Hər biri {s, y} qaytarır — `y` növbəti blokun başlanğıc nöqtəsidir.

     Bu köməkçiləri YALNIZ yeni dizaynlar çağırır. Mövcud on dizayn öz əl ilə
     yazılmış cədvəllərini saxlayır ki, `zarafat` çıxışı bayt-bayt eyni qalsın
     (bax: tools/hash-layouts.js). */

  /* Etiket→dəyər cədvəli. Üç üslub:
       'rule' — dəyər etiketdən sağda, altdan nöqtəli xətt (vəsiqə/viza)
       'grid' — haşiyəli qutu, etiket xanası boyalı (rəsmi blank)
       'dots' — etiket solda, dəyər sağda, aralarında nöqtəli aparıcı (arayış) */
  function kvTable(rows, x, y, w, P, o) {
    o = o || {};
    var style = o.style || 'rule', lw = o.lw || 200, rh = o.rh || 26;
    var ls = o.labelSize || 8.6, vs = o.valueSize || 12.5;
    var lf = font(ls, 'bold', SANS), vf = font(vs, 'bold', SANS);
    var s = '', i, r, lab, val, vw, top = y - 14, H = rows.length * rh + 8;

    if (style === 'grid') {
      s += '<rect x="' + x + '" y="' + top + '" width="' + w + '" height="' + H +
        '" fill="none" stroke="' + P.accent + '" stroke-width="0.9"/>';
      s += '<path d="M ' + (x + lw) + ' ' + top + ' V ' + (top + H) +
        '" stroke="' + P.accent + '" stroke-width="0.7"/>';
    }

    for (i = 0; i < rows.length; i++) {
      r = rows[i] || [];
      lab = upper(String(r[0] === undefined || r[0] === null ? '' : r[0]));
      val = String(r[1] === undefined || r[1] === null || r[1] === '' ? '—' : r[1]);

      if (style === 'dots') {
        vw = measure(val, vf);
        s += T(lab, x, y, { size: ls + 1.4, fam: SANS, fill: P.muted });
        s += '<path d="M ' + (x + measure(lab, lf) + 8) + ' ' + (y - 3) + ' H ' + (x + w - vw - 8) +
          '" stroke="' + P.muted + '" stroke-width="0.7" stroke-dasharray="1 2.5" opacity="0.8"/>';
        s += T(val, x + w, y, { anchor: 'end', size: vs, weight: 'bold', fam: SANS, fill: P.head });
      } else {
        if (style === 'grid') {
          s += '<rect x="' + x + '" y="' + (y - 14) + '" width="' + lw + '" height="' + rh +
            '" fill="' + P.soft + '" opacity="0.55"/>';
          if (i) s += '<path d="M ' + x + ' ' + (y - 14) + ' H ' + (x + w) +
            '" stroke="' + P.accent + '" stroke-width="0.5"/>';
        }
        s += T(lab, x + (style === 'grid' ? 8 : 0), y,
          { size: ls, fam: SANS, weight: 'bold', fill: P.accentD, ls: 1.2 });
        s += T(wrap(val, vf, w - lw - 14, 1)[0], x + lw + (style === 'grid' ? 10 : 0), y,
          { size: vs, weight: 'bold', fam: SANS, fill: P.head });
        if (style === 'rule') s += '<path d="M ' + x + ' ' + (y + 7) + ' H ' + (x + w) +
          '" stroke="' + P.accent + '" stroke-width="0.4" stroke-dasharray="2 2" opacity="0.7"/>';
      }
      y += rh;
    }
    return { s: s, y: y + 6 };
  }

  /* İşarələnmiş siyahı — çoxseçimli sahənin cavabları. */
  function checkList(list, x, y, w, P, o) {
    o = o || {};
    var mark = o.mark || '▪', size = o.size || 11.5, lh = o.lh || 19, ind = o.ind || 16;
    var gap = o.gap === undefined ? 4 : o.gap;
    var a = (list && list.length ? list : ['—']).slice(0, o.max || 6);
    var s = '', i, ln;
    for (i = 0; i < a.length; i++) {
      ln = wrap(String(a[i]), font(size, '', SANS), w - ind, 2);
      s += T(mark, x, y, { size: size, fam: SANS, weight: 'bold', fill: o.markFill || P.accentD });
      s += block(ln, x + ind, y, lh, { size: size, fam: SANS, fill: o.fill || P.ink });
      y += ln.length * lh + gap;
    }
    return { s: s, y: y };
  }

  /* Vizual şkala: dolu və boş xanalar + «7/10».
     Xanalar <rect>-dir, ▓/░ simvolu deyil — blok simvolları hər şriftdə yoxdur
     və PNG eksportu canvas üzərindən getdiyi üçün nəticə maşından maşına dəyişərdi. */
  function scaleBar(label, v, max, x, y, w, P, o) {
    o = o || {};
    var cells = o.cells || 10, gap = o.gap === undefined ? 3 : o.gap;
    var capW = o.capW || 54, ch = o.h || 14;
    var n = Math.max(0, Math.min(cells, Math.round(Number(v) / (Number(max) || 1) * cells)));
    var barW = w - capW, cw = (barW - gap * (cells - 1)) / cells;
    var s = '', i, by;
    if (label) s += T(upper(label), x, y, { size: 8.6, fam: SANS, weight: 'bold', fill: P.accentD, ls: 1.2 });
    by = label ? y + 10 : y - 10;
    for (i = 0; i < cells; i++)
      s += '<rect x="' + (x + i * (cw + gap)).toFixed(1) + '" y="' + by + '" width="' + cw.toFixed(1) +
        '" height="' + ch + '" fill="' + (i < n ? P.accentD : 'none') +
        '" stroke="' + P.accent + '" stroke-width="0.8"/>';
    s += T(v + '/' + max, x + w, by + ch - 2,
      { anchor: 'end', size: 13, fam: MONO, weight: 'bold', fill: P.head });
    return { s: s, y: by + ch + 16 };
  }

  /* ---------------- kompozisiya köməkçiləri ----------------
     İki funksiyadır, bir dənə deyil: substrat `bs`-dən əvvəl, su nişanı isə
     `centerBody`-dən sonra emissiya olunmalıdır (bax: ÜÇ QAT QAYDASI).

     `pageFurniture` su nişanı ilə disclaimer-i blank nömrəsi ilə eyni çağırışa
     qaynaqlayır — beləcə onları unutmaq mümkün deyil. */

  /* SUBSTRAT — `var bs = out.length` sətrindən ƏVVƏL çağırılır. */
  function paperBase(doc, C, o) {
    o = o || {};
    var P = C.P, out = '';
    if (o.paper !== false) out += '<rect width="' + W + '" height="' + H + '" fill="' + P.paper + '"/>';
    if (o.grain !== false) out += '<rect width="' + W + '" height="' + H + '" fill="url(#' + C.idp + '-grain)"/>';
    if (o.fibers !== 0) out += fibers(doc.regNo, P, 0, 0, W, H, o.fibers || 70);
    if (o.ghost) out += crest(o.ghost[0], o.ghost[1], o.ghost[2], P, {
      detail: 'ghost', op: o.ghost[3] || 0.06, mono: P.accentD, banner: 'HÜQUQİ QÜVVƏSİ YOXDUR'
    });
    if (o.fold) out += foldMarks(P, o.fold[0], o.fold[1]);
    if (o.micro) out += microtext(o.micro[0], o.micro[1], o.micro[2], o.micro[3], P, { sides: o.micro[4] });
    return out;
  }

  /* AVADANLIQ — `centerBody(...)` çağırışından SONRA, layoutun ən sonunda. */
  function pageFurniture(doc, C, o) {
    o = o || {};
    var P = C.P, d = o.disclaimer, out = '';
    if (o.form) out += formLine(P, doc, o.form[0], o.form[1], o.form[2]);
    if (o.page) out += pageMark(P, o.page[0], o.page[1], o.page[2]);
    out += watermark(P, doc.paid);
    out += disclaimer(P, d ? d[0] : 0, d ? d[1] : H - 26, d ? d[2] : W);
    return out;
  }

  /* ==================================================================
     LAYOUT 1 — NOTARIAL AKT (pergament + qızıl haşiyə)
     ================================================================== */
  function L_notarial(doc, C) {
    var P = C.P, idp = C.idp, M = 80, CW = W - M * 2, out = '';

    out += paperBase(doc, C, {
      fibers: 70, ghost: [W / 2, 620, 150], fold: [10, W - 10],
      micro: [34.5, 34.5, W - 69, H - 69]      /* x=32 və x=37 haşiyələri arasındakı kanal */
    });
    out += guilloche(W / 2, 470, P);

    out += '<rect x="22" y="22" width="' + (W - 44) + '" height="' + (H - 44) + '" fill="none" stroke="url(#' + idp + '-metal)" stroke-width="3.5"/>';
    out += '<rect x="32" y="32" width="' + (W - 64) + '" height="' + (H - 64) + '" fill="none" stroke="' + P.accent + '" stroke-width="0.9"/>';
    out += '<rect x="37" y="37" width="' + (W - 74) + '" height="' + (H - 74) + '" fill="none" stroke="' + P.accent + '" stroke-width="0.4" stroke-dasharray="3 3"/>';
    out += corner(44, 44, 1, 1, P) + corner(W - 44, 44, -1, 1, P) + corner(44, H - 44, 1, -1, P) + corner(W - 44, H - 44, -1, -1, P);

    out += crest(W / 2, 116, 40, P);
    out += T(CUR.org, W / 2, 186, { anchor: 'middle', size: 16, weight: 'bold', fill: P.head, ls: 4.5 });
    out += qurumSetri(doc, CUR.orgSub + ' · ZARAFAT.AZ', true, W / 2, 205, { anchor: 'middle', size: 9, fam: SANS, fill: P.muted, ls: 2.6 });
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
    [[lbl(doc, 'toLabel', 'KİMƏ VERİLİR'), doc.to, M], [lbl(doc, 'fromLabel', 'KİMDƏN VERİLİR'), doc.from, M + colW + 34]].forEach(function (c) {
      out += T(c[0], c[2], y, { size: 8.8, fam: SANS, weight: 'bold', fill: P.accentD, ls: 1.9 });
      var vl = wrap(c[1] || '—', font(16, 'bold'), colW, 2);
      maxV = Math.max(maxV, vl.length);
      out += block(vl, c[2], y + 22, 19, { size: 16, weight: 'bold', fill: P.head });
      out += '<path d="M ' + c[2] + ' ' + (y + 30 + (vl.length - 1) * 19) + ' H ' + (c[2] + colW) + '" stroke="' + P.accent + '" stroke-width="0.8" stroke-dasharray="2 2"/>';
    });
    y += 30 + (maxV - 1) * 19 + 32;

    out += T(lbl(doc, 'powersLabel', 'SƏLAHİYYƏTLƏR VƏ ŞƏRTLƏR'), M, y, { size: 8.8, fam: SANS, weight: 'bold', fill: P.accentD, ls: 1.9 });
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
    out += '<rect x="' + M + '" y="' + y + '" width="' + CW + '" height="' + bh + '" fill="' + P.soft + '" stroke="' + penC(P) + '" stroke-width="0.9" opacity="0.95"/>';
    out += '<rect x="' + M + '" y="' + y + '" width="4" height="' + bh + '" fill="' + penC(P) + '"/>';
    out += T(lbl(doc, 'penaltyLabel', 'CƏZA BƏNDİ'), M + 18, y + 18, { size: 8.8, fam: SANS, weight: 'bold', fill: penC(P), ls: 1.9 });
    out += block(pen, M + 18, y + 38, 20, { size: 13, fill: P.ink });
    y += bh + 30;

    var al = attestLines(doc, CW, 4);
    out += attestation(P, al, M, y, CW);
    y += al.length * 13.6 + 6;

    out = centerBody(out, bs, y, 846, 120);               /* --- gövdə bitdi --- */

    out += '<path d="M ' + M + ' 862 H ' + (W - M) + '" stroke="' + P.accent + '" stroke-width="0.7"/>';
    out += T('TƏSDİQ TARİXİ: ' + doc.date, M, 886, { size: 9.5, fam: SANS, fill: P.muted, ls: 1.2 });
    out += signature(doc.regNo + doc.from, M + 8, 896, 190, 42);
    out += '<path d="M ' + M + ' 946 H ' + (M + 230) + '" stroke="' + P.ink + '" stroke-width="0.7"/>';
    out += T(CUR.notaryLine, M, 960, { size: 9, fam: SANS, fill: P.muted, ls: 0.8 });
    out += seal(608, 908, 74, P, doc.regNo, idp);
    out += qrOrHint(doc, P, M, 978, 84, M + 96);
    out += barcode(doc.regNo, M + 96, doc.paid ? 1022 : 1024, 210, doc.paid ? 26 : 24);
    if (doc.paid) out += T(doc.regNo, M + 96, 1058, { size: 8, fam: MONO, fill: P.muted, ls: 2 });
    out += emboss(410, 930, 46, P, idp);
    out += intakeStamp(534, 990, P, doc);

    if (C.verified) out += verifiedStamp(565, 700);
    out += pageFurniture(doc, C, {
      form: [M, 1066], page: [W - M, 1066, 'end'], disclaimer: [40, 1074, W - 80]
    });
    return out;
  }

  /* ==================================================================
     LAYOUT 2 — RƏSMİ BLANK (dövlət blankı üslubu, cədvəlli)
     ================================================================== */
  function L_blank(doc, C) {
    var P = C.P, idp = C.idp, M = 72, CW = W - M * 2, out = '';

    out += paperBase(doc, C, {
      fibers: 55, ghost: [W / 2, 660, 145], fold: [10, W - 10],
      micro: [26, 26, W - 52, H - 52]
    });
    /* blankın haşiyəsi yoxdur — mikromətni vizual olaraq əsaslandıran nazik cizgi */
    out += '<rect x="22" y="22" width="' + (W - 44) + '" height="' + (H - 44) + '" fill="none" stroke="' + P.accent + '" stroke-width="0.4" opacity="0.5"/>';
    out += '<rect x="0" y="0" width="' + W + '" height="6" fill="' + P.accent + '"/>';
    out += '<rect x="0" y="6" width="' + W + '" height="2" fill="' + P.accentL + '"/>';

    out += crest(M + 26, 74, 26, P, { sub: false });
    out += T(CUR.org, M + 62, 66, { size: 12.5, weight: 'bold', fam: SANS, fill: P.head, ls: 1.6 });
    out += qurumSetri(doc, 'Qeyri-rəsmi sənədlər vahid reyestri', false, M + 62, 82, { size: 9, fam: SANS, fill: P.muted, ls: 0.6 });
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
    out += T(CUR.role + ' ' + CUR.notaryCap, W - M, 166, { anchor: 'end', size: 8.6, fam: SANS, fill: P.muted });
    out += T('«' + doc.date.slice(0, 2) + '» ' + doc.date.slice(3), W - M, 180, { anchor: 'end', size: 8.6, fam: SANS, fill: P.muted });

    var ts = fit(upper(doc.title), CW, 21, 13, 'bold', SANS);
    var tl = wrap(upper(doc.title), font(ts, 'bold', SANS), CW, 3);
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
      [lbl(doc, 'toLabel', 'Kimə verilir'), doc.to],
      [lbl(doc, 'fromLabel', 'Kimdən verilir'), doc.from],
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

    out += T(lbl(doc, 'powersLabel', 'ŞƏRTLƏR VƏ ÖHDƏLİKLƏR'), M, y, { size: 9.4, fam: SANS, weight: 'bold', fill: P.accentD, ls: 1.6 });
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
    out += T('2.1.', M, y + 10, { size: 11.5, weight: 'bold', fam: SANS, fill: penC(P) });
    out += block(pen, M + 32, y + 10, 18.5, { size: 11.8, fam: SANS, fill: penC(P) });
    y += pen.length * 18.5 + 34;

    var al = attestLines(doc, CW, 4);
    out += attestation(P, al, M, y, CW);
    y += al.length * 13.6 + 4;

    out = centerBody(out, bs, y, 880, 120);

    out += '<path d="M ' + M + ' 900 H ' + (W - M) + '" stroke="' + P.accent + '" stroke-width="0.5"/>';
    out += signature(doc.regNo + doc.to, M + 6, 912, 170, 38);
    out += '<path d="M ' + M + ' 958 H ' + (M + 220) + '" stroke="' + P.ink + '" stroke-width="0.7"/>';
    out += T('imza', M + 100, 970, { anchor: 'middle', size: 8, fam: SANS, fill: P.muted, ls: 1.2 });
    out += T(CUR.notary, M, 990, { size: 10, weight: 'bold', fam: SANS, fill: P.head, ls: 0.8 });
    out += T(CUR.role + ' (uydurma şəxs)', M, 1004, { size: 8.4, fam: SANS, fill: P.muted });
    out += seal(624, 944, 66, P, doc.regNo, idp, -8);

    out += emboss(300, 952, 44, P, idp);
    out += qrOrHint(doc, P, M, 1018, 52, M + 64);
    out += barcode(doc.regNo, W - M - 190, 1030, 190, 22);
    out += T(doc.regNo, W - M, 1062, { anchor: 'end', size: 7.6, fam: MONO, fill: P.muted, ls: 1.6 });

    if (C.verified) out += verifiedStamp(560, 700, -12);
    /* blank giriş ştampı almır — qeydiyyat qutusu onsuz da bu rolu oynayır */
    out += pageFurniture(doc, C, { form: [M, 1084], page: [W - M, 1084, 'end'] });
    return out;
  }

  /* ==================================================================
     LAYOUT 3 — DİPLOM (medalyon, iri ad, iki imza)
     ================================================================== */
  function L_diplom(doc, C) {
    var P = C.P, idp = C.idp, M = 96, CW = W - M * 2, out = '';

    out += paperBase(doc, C, {
      fibers: 65, ghost: [W / 2, 700, 170], fold: [10, W - 10],
      micro: [43, 43, W - 86, H - 86]           /* x=40 və x=46 haşiyələri arasındakı kanal */
    });
    out += guilloche(W / 2, H / 2, P, 0.13, 1.25);

    out += '<rect x="26" y="26" width="' + (W - 52) + '" height="' + (H - 52) + '" fill="none" stroke="url(#' + idp + '-metal)" stroke-width="9"/>';
    out += '<rect x="40" y="40" width="' + (W - 80) + '" height="' + (H - 80) + '" fill="none" stroke="' + P.accentD + '" stroke-width="1.2"/>';
    out += '<rect x="46" y="46" width="' + (W - 92) + '" height="' + (H - 92) + '" fill="none" stroke="' + P.accent + '" stroke-width="0.5" stroke-dasharray="6 4"/>';
    out += corner(56, 56, 1, 1, P) + corner(W - 56, 56, -1, 1, P) + corner(56, H - 56, 1, -1, P) + corner(W - 56, H - 56, -1, -1, P);

    var mx = W / 2, my = 138;
    out += '<path d="M ' + (mx - 30) + ' ' + (my + 34) + ' L ' + (mx - 44) + ' ' + (my + 92) + ' L ' + (mx - 14) + ' ' + (my + 76) + ' L ' + mx + ' ' + (my + 96) + ' L ' + (mx + 14) + ' ' + (my + 76) + ' L ' + (mx + 44) + ' ' + (my + 92) + ' L ' + (mx + 30) + ' ' + (my + 34) + ' Z" fill="' + P.accent + '" opacity="0.85"/>';
    out += '<circle cx="' + mx + '" cy="' + my + '" r="46" fill="' + P.paper + '" stroke="url(#' + idp + '-metal)" stroke-width="5"/>';
    out += crest(mx, my, 30, P, { banner: '' });
    out += T(CUR.org, W / 2, 268, { anchor: 'middle', size: 11.5, fam: SANS, weight: 'bold', fill: P.muted, ls: 4 });
    out += qurumSetri(doc, '', true, W / 2, 286, { anchor: 'middle', size: 8.4, fam: SANS, fill: P.muted, ls: 2.4 });

    var bs = out.length;                                  /* --- gövdə --- */

    var ts = fit(upper(doc.title), CW - 20, 34, 17, 'bold', SERIF);
    var tl = wrap(upper(doc.title), font(ts, 'bold'), CW - 20, 2);
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
    y += pen.length * 19 + 30;

    var al = attestLines(doc, CW - 60, 3);
    out += block(al, W / 2, y, 13.6, { size: 9.4, style: 'italic', fill: P.muted, anchor: 'middle' });
    y += al.length * 13.6;

    out = centerBody(out, bs, y, 826, 110);

    var sy = 892;
    [[M + 30, doc.from || '—', lbl(doc, 'fromLabel', 'Təqdim edən')], [W - M - 30 - 200, CUR.notary, CUR.role]].forEach(function (s, i) {
      out += signature(doc.regNo + s[1] + i, s[0] + 14, sy - 44, 170, 38);
      out += '<path d="M ' + s[0] + ' ' + sy + ' H ' + (s[0] + 200) + '" stroke="' + P.ink + '" stroke-width="0.8"/>';
      out += T(wrap(s[1], font(11, 'bold', SANS), 200, 1)[0], s[0] + 100, sy + 16, { anchor: 'middle', size: 11, weight: 'bold', fam: SANS, fill: P.head });
      out += T(s[2], s[0] + 100, sy + 30, { anchor: 'middle', size: 8.4, fam: SANS, fill: P.muted, ls: 0.8 });
    });
    out += seal(W / 2, sy - 6, 62, P, doc.regNo, idp, 6);

    out += T('QEYDİYYAT №: ' + doc.regNo + ' · ' + doc.date, W / 2, 976, { anchor: 'middle', size: 9.4, fam: SANS, fill: P.muted, ls: 1.4 });
    out += qrOrHint(doc, P, M - 20, 994, 58, M + 46);
    out += barcode(doc.regNo, W - M - 190, 1006, 190, 22);
    /* Mürəkkəbsiz relyef möhür üst-üstə düşəndə daha inandırıcı görünür —
       yeganə bilərəkdən mətnin üstünə salınan element. */
    out += emboss(W / 2, 752, 52, P, idp);

    if (C.verified) out += verifiedStamp(W / 2, 640, -8);
    out += pageFurniture(doc, C, {
      form: [150, 1046], page: [W - 56, 1046, 'end'], disclaimer: [56, 1058, W - 112]   /* QR 76–134-ü tutur */
    });
    return out;
  }

  /* ==================================================================
     LAYOUT 4 — MÜASİR SERTİFİKAT (yan rəngli zolaq, iki sütun)
     ================================================================== */
  function L_sertifikat(doc, C) {
    var P = C.P, idp = C.idp, BAND = 78, M = BAND + 46, CW = W - M - 56, out = '';

    out += paperBase(doc, C, {
      grain: false, fibers: 60, ghost: [W - 210, 800, 150], fold: [BAND + 14, W - 10],
      micro: [BAND + 20, 26, W - BAND - 46, H - 52, { l: 0 }]   /* sol tərəf tünd zolaqdır */
    });
    out += '<rect x="0" y="0" width="' + BAND + '" height="' + H + '" fill="' + P.head + '"/>';
    out += '<rect x="' + BAND + '" y="0" width="7" height="' + H + '" fill="' + P.accent + '"/>';
    out += '<g opacity="0.12">' + guilloche(W - 120, H - 160, P, 1, 0.75) + '</g>';

    out += '<g transform="translate(' + (BAND / 2) + ',' + (H - 110) + ') rotate(-90)">' +
      T(CUR.org + ' · ZARAFAT.AZ', 0, 5, { size: 11, fam: SANS, weight: 'bold', fill: P.accentL, ls: 4.4 }) + '</g>';
    out += crest(BAND / 2, 56, 24, P, { mono: P.accentL, sub: false });
    out += T('2026', BAND / 2, H - 46, { anchor: 'middle', size: 9, fam: SANS, fill: P.accentL, ls: 1.6 });

    out += qurumSetri(doc, '', true, M, 76, { size: 8.2, fam: SANS, fill: P.muted, ls: 2.4 });
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

    [[lbl(doc, 'toLabel', 'KİMƏ VERİLİR'), doc.to], [lbl(doc, 'fromLabel', 'KİMDƏN VERİLİR'), doc.from],
     ['TARİX', doc.date], ['SERİYA', seriya(doc)]].forEach(function (f) {
      out += T(f[0], colL, y, { size: 8.4, fam: SANS, weight: 'bold', fill: P.accent, ls: 1.8 });
      var vl = wrap(f[1] || '—', font(14, 'bold', SANS), colLW, 2);
      out += block(vl, colL, y + 20, 18, { size: 14, weight: 'bold', fam: SANS, fill: P.head });
      y += 20 + vl.length * 18 + 18;
    });

    var yR = yStart;
    out += T(lbl(doc, 'powersLabel', 'ŞƏRTLƏR'), colR, yR, { size: 8.4, fam: SANS, weight: 'bold', fill: P.accent, ls: 1.8 });
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
    out += '<rect x="' + M + '" y="' + y + '" width="4" height="' + bh + '" fill="' + penC(P) + '"/>';
    out += T(lbl(doc, 'penaltyLabel', 'CƏZA BƏNDİ'), M + 16, y + 17, { size: 8.4, fam: SANS, weight: 'bold', fill: penC(P), ls: 1.8 });
    out += block(pen, M + 16, y + 35, 18, { size: 11.6, fam: SANS, fill: P.ink });
    y += bh;

    y += 30;
    var al = attestLines(doc, CW, 4);
    out += attestation(P, al, M, y, CW);
    y += al.length * 13.6 + 4;

    out = centerBody(out, bs, y, 872, 130);

    out += '<path d="M ' + M + ' 892 H ' + (W - 56) + '" stroke="' + P.accent + '" stroke-width="0.5"/>';
    out += signature(doc.regNo + doc.to, M + 4, 906, 160, 36);
    out += '<path d="M ' + M + ' 952 H ' + (M + 200) + '" stroke="' + P.ink + '" stroke-width="0.7"/>';
    out += T(CUR.notary + ' · ' + CUR.role, M, 966, { size: 8.6, fam: SANS, fill: P.muted });
    out += seal(W - 150, 934, 62, P, doc.regNo, idp, -6);
    out += qrOrHint(doc, P, M, 992, 66, M + 80);
    out += barcode(doc.regNo, M + 80, 1048, 200, 20);
    out += emboss(520, 1016, 40, P, idp);

    if (C.verified) out += verifiedStamp(500, 700, -10);
    /* sertifikat giriş ştampı almır — footer doludur */
    out += pageFurniture(doc, C, {
      form: [M, 1084], page: [W - 56, 1084, 'end'], disclaimer: [BAND + 7, H - 26, W - BAND - 7]
    });
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
    var ts = fit(upper(doc.title), fw, 19, 12, 'bold', SANS);
    var tl = wrap(upper(doc.title), font(ts, 'bold', SANS), fw, 3);
    var fields = [
      [lbl(doc, 'toLabel', 'LİSENZİYA SAHİBİ'), doc.to],
      [lbl(doc, 'fromLabel', 'VERƏN TƏRƏF'), doc.from],
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
    out += paperBase(doc, C, { fibers: 75, fold: [10, W - 10] });
    out += T(CUR.org, W / 2, 62, { anchor: 'middle', size: 12, fam: SANS, weight: 'bold', fill: P.head, ls: 4.4 });
    out += qurumSetri(doc, 'QEYRİ-RƏSMİ LİSENZİYALAR REYESTRİ', true, W / 2, 80, { anchor: 'middle', size: 8.4, fam: SANS, fill: P.muted, ls: 3 });
    out += '<path d="M 200 96 H ' + (W - 200) + '" stroke="' + P.accent + '" stroke-width="0.8"/>';

    /* --- kart --- */
    out += '<rect x="' + CX + '" y="' + CY + '" width="' + CWid + '" height="' + CHt + '" rx="18" fill="' + P.soft + '" stroke="' + P.accentD + '" stroke-width="2"/>';
    out += '<rect x="' + (CX + 8) + '" y="' + (CY + 8) + '" width="' + (CWid - 16) + '" height="' + (CHt - 16) + '" rx="12" fill="none" stroke="' + P.accent + '" stroke-width="0.6" stroke-dasharray="4 3"/>';
    out += '<g opacity="0.18">' + guilloche(W / 2, CY + CHt / 2, P, 1, 0.62) + '</g>';
    out += crest(CX + CWid - 120, CY + CHt - 125, 88, P, {
      detail: 'ghost', op: 0.07, mono: P.accentD, banner: 'HÜQUQİ QÜVVƏSİ YOXDUR'
    });
    out += microtext(CX + 14, CY + 14, CWid - 28, CHt - 28, P);
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
    out += T(lbl(doc, 'powersLabel', 'LİSENZİYANIN ƏHATƏ ETDİYİ SƏLAHİYYƏTLƏR'), CX + 26, sy, { size: 8, fam: SANS, weight: 'bold', fill: P.accent, ls: 1.6 });
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
    out += '<rect x="70" y="' + (by - 14) + '" width="4" height="' + (pen.length * 17 + 24) + '" fill="' + penC(P) + '"/>';
    out += T(lbl(doc, 'penaltyLabel', 'LƏĞVETMƏ ŞƏRTİ'), 84, by, { size: 8, fam: SANS, weight: 'bold', fill: penC(P), ls: 1.6 });
    out += block(pen, 84, by + 16, 17, { size: 11.4, fam: SANS, fill: P.ink });
    by += 16 + pen.length * 17;

    by += 26;
    var al = attestLines(doc, W - 140, 2);
    out += attestation(P, al, 70, by, W - 140);
    by += al.length * 13.6;

    /* Əsl vəsiqədə quru möhür məhz fotonun kənarından keçir */
    out += emboss(px + pw - 8, py + ph - 18, 40, P, idp);

    var sealY = Math.max(Math.min(by + 46, 958), 886);
    out += seal(650, sealY, 62, P, doc.regNo, idp, -9);
    out += qrOrHint(doc, P, 70, 1000, 58, 138);
    out += barcode(doc.regNo, W - 250, 1012, 180, 20);
    out += T(doc.regNo, W - 70, 1046, { anchor: 'end', size: 7.6, fam: MONO, fill: P.muted, ls: 1.6 });

    if (C.verified) out += verifiedStamp(520, CY + CHt - 90, -11);
    out += pageFurniture(doc, C, { form: [70, 1084], page: [W - 70, 1084, 'end'] });
    return out;
  }

  /* ==================================================================
     LAYOUT 6 — ARAYIŞ (klassik dövlət blankı: qrif, ünvan, faktura cədvəli)
     ================================================================== */
  function L_arayis(doc, C) {
    var P = C.P, idp = C.idp, M = 76, CW = W - M * 2, out = '';

    out += paperBase(doc, C, {
      fibers: 70, ghost: [W / 2, 630, 155], fold: [10, W - 10],
      micro: [30, 30, W - 60, H - 60]
    });

    out += crest(W / 2, 92, 34, P, { solid: true });
    out += T(CUR.org, W / 2, 152, { anchor: 'middle', size: 15, weight: 'bold', fill: P.head, ls: 3.5 });
    out += qurumSetri(doc, CUR.orgAgency, true, W / 2, 169, { anchor: 'middle', size: 8.2, fam: SANS, fill: P.muted, ls: 2.4 });
    out += T(CUR.addr, W / 2, 182, { anchor: 'middle', size: 7.4, fam: SANS, fill: P.muted });
    out += '<path d="M ' + M + ' 194 H ' + (W - M) + '" stroke="' + P.accentD + '" stroke-width="1.6"/>';
    out += '<path d="M ' + M + ' 198 H ' + (W - M) + '" stroke="' + P.accentD + '" stroke-width="0.5"/>';

    /* sol qrif */
    var gy = 228;
    out += T('Çıxış № ' + doc.regNo, M, gy, { size: 9.5, fam: SANS, fill: P.ink });
    out += '<path d="M ' + M + ' ' + (gy + 5) + ' H ' + (M + 200) + '" stroke="' + P.accent + '" stroke-width="0.4" stroke-dasharray="2 2"/>';
    out += T('«' + doc.date.slice(0, 2) + '» ' + doc.date.slice(3) + '-cı il', M, gy + 26, { size: 9.5, fam: SANS, fill: P.ink });
    out += '<path d="M ' + M + ' ' + (gy + 31) + ' H ' + (M + 200) + '" stroke="' + P.accent + '" stroke-width="0.4" stroke-dasharray="2 2"/>';

    /* sağ ünvan bloku */
    out += T('TƏLƏB EDƏN', W - M, gy - 14, { anchor: 'end', size: 8.2, weight: 'bold', fam: SANS, fill: P.accentD, ls: 1.6 });
    var fl = wrap(doc.from || '—', font(11.5, 'bold', SANS), 230, 2);
    out += block(fl, W - M, gy + 6, 16, { size: 11.5, weight: 'bold', fam: SANS, fill: P.head, anchor: 'end' });

    out += intakeStamp(M + 226, 214, P, doc);

    var bs = out.length;                                  /* --- gövdə başlayır --- */

    var y = 328;
    out += T('A R A Y I Ş', W / 2, y, { anchor: 'middle', size: 26, weight: 'bold', fill: P.head, ls: 8 });
    out += '<path d="M ' + (W / 2 - 66) + ' ' + (y + 13) + ' H ' + (W / 2 + 66) + '" stroke="' + P.accent + '" stroke-width="1"/>';
    y += 54;

    var pf = font(13.2, '', SERIF);
    var pre = wrapIndent(doc.preamble, pf, CW, 28, 6);
    out += T(pre[0], M + 28, y, { size: 13.2, fill: P.ink });
    if (pre.length > 1) out += block(pre.slice(1), M, y + 22, 22, { size: 13.2, fill: P.ink });
    y += pre.length * 22 + 20;

    /* seyrək nöqtəli faktura cədvəli */
    var rows = [
      [lbl(doc, 'toLabel', 'Arayış verilir'), doc.to],
      [lbl(doc, 'fromLabel', 'Təqdim edən'), doc.from],
      ['Verilmə tarixi', doc.date],
      ['Seriya və nömrə', seriya(doc) + ' · ' + doc.regNo]
    ];
    rows.forEach(function (r) {
      var lf = font(10.5, '', SANS), vf = font(11.5, 'bold', SANS);
      var lw = measure(r[0], lf), vw = measure(String(r[1] || '—'), vf);
      out += T(r[0], M, y, { size: 10.5, fam: SANS, fill: P.muted });
      out += '<path d="M ' + (M + lw + 8) + ' ' + (y - 3) + ' H ' + (W - M - vw - 8) + '" stroke="' + P.muted + '" stroke-width="0.7" stroke-dasharray="1 2.5" opacity="0.8"/>';
      out += T(r[1] || '—', W - M, y, { anchor: 'end', size: 11.5, weight: 'bold', fam: SANS, fill: P.head });
      y += 26;
    });
    y += 20;

    var its = items(doc, 5);
    for (var i = 0; i < its.length && y < 700; i++) {
      var ln = wrap(its[i], font(12.6, '', SERIF), CW - 26, 2);
      out += T((i + 1) + '.', M, y, { size: 12.6, weight: 'bold', fill: P.accentD });
      out += block(ln, M + 24, y, 20, { size: 12.6, fill: P.ink });
      y += ln.length * 20 + 8;
    }
    y += 16;

    var pen = wrap(doc.penalty || '—', font(11, '', SERIF, 'italic'), CW - 24, 2);
    out += '<rect x="' + M + '" y="' + (y - 12) + '" width="3" height="' + (pen.length * 18 + 6) + '" fill="' + penC(P) + '" opacity="0.8"/>';
    out += T('Əsas:', M + 12, y, { size: 11, weight: 'bold', style: 'italic', fill: penC(P) });
    out += block(pen, M + 56, y, 18, { size: 11, style: 'italic', fill: P.muted });
    y += pen.length * 18 + 30;

    var al = attestLines(doc, CW, 4);
    out += attestation(P, al, M, y, CW);
    y += al.length * 13.6 + 4;

    out = centerBody(out, bs, y, 838, 110);               /* --- gövdə bitdi --- */

    out += '<path d="M ' + M + ' 856 H ' + (W - M) + '" stroke="' + P.accent + '" stroke-width="0.7"/>';
    out += T(CUR.role, M, 880, { size: 9.5, fam: SANS, fill: P.muted, ls: 1.2 });
    out += signature(doc.regNo + doc.from, M + 8, 890, 180, 40);
    out += '<path d="M ' + M + ' 940 H ' + (M + 220) + '" stroke="' + P.ink + '" stroke-width="0.7"/>';
    out += T(CUR.notary + ' (uydurma şəxs)', M, 956, { size: 9, fam: SANS, fill: P.muted, ls: 0.8 });
    out += seal(602, 902, 68, P, doc.regNo, idp, -9);
    out += emboss(414, 950, 42, P, idp);
    out += qrOrHint(doc, P, M, 992, 60, M + 72);
    out += barcode(doc.regNo, W - M - 190, 1000, 190, 22, { hri: true, P: P });

    if (C.verified) out += verifiedStamp(540, 660, -12);
    out += pageFurniture(doc, C, {
      form: [M, 1064], page: [W - M, 1064, 'end'], disclaimer: [0, H - 26, W]
    });
    return out;
  }

  /* ==================================================================
     LAYOUT 7 — QƏRAR (məhkəmə qərarı üslubu; bilərəkdən bəzəksizdir)
     ================================================================== */
  function L_qerar(doc, C) {
    var P = C.P, idp = C.idp, M = 84, CW = W - M * 2, out = '';

    /* Bu layoutda guilloche və qızıl haşiyə yoxdur: məhkəmə sənədi
       inandırıcılığı bəzəkdən yox, tipoqrafik nizamdan alır. */
    out += paperBase(doc, C, {
      fibers: 50, ghost: [W / 2, 610, 150], fold: [10, W - 10],
      micro: [26, 26, W - 52, H - 52]
    });

    out += crest(W / 2, 84, 30, P);
    out += T(CUR.courtFrom, W / 2, 142, { anchor: 'middle', size: 10, fam: SANS, fill: P.muted, ls: 3 });
    out += T(CUR.court, W / 2, 166, { anchor: 'middle', size: 18, weight: 'bold', fill: P.head, ls: 4 });
    out += T(doc.signOrg ? upper(doc.signOrg) + ' · UYDURMA ORQAN' : CUR.courtSub, W / 2, 182,
      { anchor: 'middle', size: 8, fam: SANS, fill: P.muted, ls: 2 });
    out += '<path d="M ' + M + ' 194 H ' + (W - M) + '" stroke="' + P.accentD + '" stroke-width="1.2"/>';

    out += intakeStamp(W - M - 158, 208, P, doc);

    var bs = out.length;                                  /* --- gövdə başlayır --- */

    var y = 254;
    out += T('Q Ə R A R', W / 2, y, { anchor: 'middle', size: 24, weight: 'bold', fill: P.head, ls: 10 });
    y += 24;
    out += T('İş № ' + doc.regNo + ' · ser. ' + seriya(doc), W / 2, y, { anchor: 'middle', size: 10, fam: SANS, fill: P.muted, ls: 1.2 });
    y += 28;
    out += T('Bakı şəhəri', M, y, { size: 10, fam: SANS, fill: P.muted });
    out += T(doc.date, W - M, y, { anchor: 'end', size: 10, fam: SANS, fill: P.muted });
    y += 8;
    out += '<path d="M ' + M + ' ' + y + ' H ' + (W - M) + '" stroke="' + P.accent + '" stroke-width="0.5"/>';
    y += 26;

    var cf = font(12.2, '', SERIF);
    var comp = wrap(CUR.comp, cf, CW, 2);
    out += block(comp, M, y, 19, { size: 12.2, fill: P.ink });
    y += comp.length * 19 + 18;

    [[CUR.partyA, doc.from], [CUR.partyB, doc.to]].forEach(function (r) {
      out += T(r[0], M, y, { size: 8.6, weight: 'bold', fam: SANS, fill: P.accentD, ls: 1.6 });
      out += T(wrap(r[1] || '—', font(13, 'bold'), CW - 130, 1)[0], M + 120, y, { size: 13, weight: 'bold', fill: P.head });
      out += '<path d="M ' + (M + 120) + ' ' + (y + 5) + ' H ' + (W - M) + '" stroke="' + P.accent + '" stroke-width="0.4" stroke-dasharray="2 2"/>';
      y += 22;
    });
    out += T(CUR.subject, M, y, { size: 8.6, weight: 'bold', fam: SANS, fill: P.accentD, ls: 1.6 });
    var tl = wrap(doc.title, font(12.6, '', SERIF), CW - 130, 2);
    out += block(tl, M + 120, y, 17, { size: 12.6, fill: P.ink });
    y += tl.length * 17 + 22;

    /* iki tərəfdən xətlə əhatələnmiş başlıq — bu sənəd sinfinin imzası */
    function ruled(label, yy) {
      var lw = measure(label, font(12.5, 'bold', SANS)) / 2 + 16;
      return '<path d="M ' + M + ' ' + (yy - 4) + ' H ' + (W / 2 - lw) + '" stroke="' + P.accentD + '" stroke-width="0.7"/>' +
        '<path d="M ' + (W / 2 + lw) + ' ' + (yy - 4) + ' H ' + (W - M) + '" stroke="' + P.accentD + '" stroke-width="0.7"/>' +
        T(label, W / 2, yy, { anchor: 'middle', size: 12.5, weight: 'bold', fam: SANS, fill: P.head, ls: 4 });
    }

    out += ruled('M Ü Ə Y Y Ə N\u00a0\u00a0\u00a0E T D İ :', y);
    y += 24;
    var pre = wrapIndent(doc.preamble, cf, CW, 28, 5);
    out += T(pre[0], M + 28, y, { size: 12.2, fill: P.ink });
    if (pre.length > 1) out += block(pre.slice(1), M, y + 19, 19, { size: 12.2, fill: P.ink });
    y += pre.length * 19 + 22;

    out += ruled('Q Ə R A R A\u00a0\u00a0\u00a0A L D I :', y);
    y += 22;
    var its = items(doc, 4), n = 0;
    for (var i = 0; i < its.length && y < 782; i++) {
      var ln = wrap(its[i], cf, CW - 26, 2);
      out += T((i + 1) + '.', M, y, { size: 12.2, weight: 'bold', fill: P.accentD });
      out += block(ln, M + 24, y, 18, { size: 12.2, fill: P.ink });
      y += ln.length * 18 + 6;
      n++;
    }
    var pen = wrap(doc.penalty || '—', cf, CW - 26, 2);
    out += T((n + 1) + '.', M, y, { size: 12.2, weight: 'bold', fill: penC(P) });
    out += block(pen, M + 24, y, 18, { size: 12.2, fill: penC(P) });
    y += pen.length * 18 + 14;

    var ap = wrap(CUR.appeal, font(10.8, '', SERIF, 'italic'), CW, 2);
    out += block(ap, M, y, 17, { size: 10.8, style: 'italic', fill: P.muted });
    y += ap.length * 17 + 24;

    var al = attestLines(doc, CW, 3);
    out += attestation(P, al, M, y, CW);
    y += al.length * 13.6 + 4;

    out = centerBody(out, bs, y, 862, 90);               /* --- gövdə bitdi --- */

    [[M, CUR.judgeRole, CUR.notary], [M + 330, 'Katib', 'N. GÜLÜŞOVA']].forEach(function (b, i) {
      out += T(b[1], b[0], 892, { size: 9, fam: SANS, fill: P.muted, ls: 1.2 });
      out += signature(doc.regNo + b[2] + i, b[0] + 6, 902, 150, 34);
      out += '<path d="M ' + b[0] + ' ' + 946 + ' H ' + (b[0] + 200) + '" stroke="' + P.ink + '" stroke-width="0.7"/>';
      out += T(b[2] + ' (uydurma şəxs)', b[0], 962, { size: 8.6, fam: SANS, fill: P.muted });
    });
    out += seal(W - 168, 924, 66, P, doc.regNo, idp, -7);
    out += emboss(M + 258, 878, 38, P, idp);
    out += qrOrHint(doc, P, M, 992, 56, M + 68);
    out += barcode(doc.regNo, W - M - 190, 1000, 190, 22, { hri: true, P: P });

    if (C.verified) out += verifiedStamp(520, 660, -10);
    out += pageFurniture(doc, C, {
      form: [M, 1064], page: [W - M, 1064, 'end'], disclaimer: [0, H - 26, W]
    });
    return out;
  }

  /* ==================================================================
     LAYOUT 8 — MÜQAVİLƏ (tərəflər bloku, nömrələnmiş maddələr, ikili imza)
     ================================================================== */
  function L_muqavile(doc, C) {
    var P = C.P, idp = C.idp, M = 78, CW = W - M * 2, out = '';

    out += paperBase(doc, C, {
      fibers: 60, ghost: [W / 2, 640, 150], fold: [10, W - 10],
      micro: [28, 28, W - 56, H - 56]
    });
    out += '<rect x="24" y="24" width="' + (W - 48) + '" height="' + (H - 48) + '" fill="none" stroke="' + P.accent + '" stroke-width="0.6" opacity="0.7"/>';

    out += crest(M + 22, 70, 22, P, { sub: false });
    out += T(CUR.org, M + 56, 64, { size: 12.5, weight: 'bold', fam: SANS, fill: P.head, ls: 1.6 });
    out += qurumSetri(doc, 'Qeyri-rəsmi müqavilələr reyestri · uydurma qurum', false, M + 56, 80, { size: 8.6, fam: SANS, fill: P.muted });

    var bx = W - M - 208;
    out += '<rect x="' + bx + '" y="46" width="208" height="60" fill="none" stroke="' + P.accent + '" stroke-width="1"/>';
    out += '<path d="M ' + bx + ' 70 H ' + (bx + 208) + '" stroke="' + P.accent + '" stroke-width="0.6"/>';
    out += T('MÜQAVİLƏ №', bx + 104, 62, { anchor: 'middle', size: 7.6, fam: SANS, fill: P.muted, ls: 1.4 });
    out += T(doc.regNo, bx + 104, 88, { anchor: 'middle', size: 15, weight: 'bold', fam: SANS, fill: P.head, ls: 1.2 });
    out += T('ser. ' + seriya(doc), bx + 104, 100, { anchor: 'middle', size: 7.4, fam: SANS, fill: P.muted });

    out += '<path d="M ' + M + ' 120 H ' + (W - M) + '" stroke="' + P.accentD + '" stroke-width="1.6"/>';
    out += '<path d="M ' + M + ' 124 H ' + (W - M) + '" stroke="' + P.accentD + '" stroke-width="0.5"/>';

    var bs = out.length;                                  /* --- gövdə başlayır --- */

    out += T('M Ü Q A V İ L Ə', W / 2, 158, { anchor: 'middle', size: 20, weight: 'bold', fill: P.head, ls: 10 });
    var ts = fit(doc.title, CW - 40, 22, 14, 'bold', SANS);
    var tl = wrap(doc.title, font(ts, 'bold', SANS), CW - 40, 2);
    out += block(tl, W / 2, 186, ts + 6, { size: ts, weight: 'bold', fam: SANS, fill: P.head, anchor: 'middle' });
    var y = 186 + (tl.length - 1) * (ts + 6) + 26;
    out += T('Bakı şəhəri', M, y, { size: 10, fam: SANS, fill: P.muted });
    out += T(doc.date, W - M, y, { anchor: 'end', size: 10, fam: SANS, fill: P.muted });
    y += 6;
    out += '<path d="M ' + M + ' ' + y + ' H ' + (W - M) + '" stroke="' + P.accent + '" stroke-width="0.5"/>';
    y += 22;

    /* tərəflər qutusu */
    var half = CW / 2;
    out += '<rect x="' + M + '" y="' + y + '" width="' + CW + '" height="104" fill="' + P.soft + '" stroke="' + P.accent + '" stroke-width="0.6" opacity="0.85"/>';
    out += '<path d="M ' + (M + half) + ' ' + y + ' V ' + (y + 104) + '" stroke="' + P.accent + '" stroke-width="0.6"/>';
    [[M + 16, 'TƏRƏF A («SİFARİŞÇİ»)', doc.from], [M + half + 16, 'TƏRƏF B («İCRAÇI»)', doc.to]].forEach(function (c) {
      out += T(c[1], c[0], y + 20, { size: 8.4, weight: 'bold', fam: SANS, fill: P.accentD, ls: 1.6 });
      out += T(wrap(c[2] || '—', font(15, 'bold', SANS), half - 32, 1)[0], c[0], y + 42, { size: 15, weight: 'bold', fam: SANS, fill: P.head });
      ['ŞV: AZE ' + (hash(doc.regNo + c[2]) % 9000000 + 1000000), 'Ünvan: Bakı ş. (uydurma)', 'Tel: — · e-poçt: —'].forEach(function (t, i) {
        out += T(t, c[0], y + 62 + i * 13, { size: 8.2, fam: SANS, fill: P.muted });
      });
    });
    y += 124;

    /* maddələr */
    function art(no, label) {
      out += T(no + '. ' + label, M, y, { size: 10.5, weight: 'bold', fam: SANS, fill: P.accentD, ls: 1.2 });
      out += '<path d="M ' + M + ' ' + (y + 6) + ' H ' + (W - M) + '" stroke="' + P.accent + '" stroke-width="0.4" opacity="0.6"/>';
      y += 20;
    }
    function clause(no, text, col, maxL) {
      var ln = wrap(text, font(11.8, '', SERIF), CW - 34, maxL || 3);
      out += T(no, M, y, { size: 11.5, weight: 'bold', fam: SANS, fill: col || P.accentD });
      out += block(ln, M + 34, y, 18, { size: 11.8, fill: col || P.ink });
      y += ln.length * 18 + 6;
    }

    art(1, 'MÜQAVİLƏNİN PREDMETİ');
    clause('1.1.', doc.preamble, null, 4);
    y += 10;
    art(2, lbl(doc, 'powersLabel', 'TƏRƏFLƏRİN ÖHDƏLİKLƏRİ'));
    items(doc, 4).forEach(function (it, i) { clause('2.' + (i + 1) + '.', it, null, 2); });
    y += 10;
    art(3, lbl(doc, 'penaltyLabel', 'MƏSULİYYƏT'));
    clause('3.1.', doc.penalty || '—', penC(P), 2);
    y += 10;
    art(4, 'YEKUN MÜDDƏALAR');
    clause('4.1.', 'Bu müqavilə heç bir hüquqi qüvvəyə malik deyil və heç bir məhkəmədə istinad edilə bilməz.', null, 2);
    clause('4.2.', 'Müqavilə iki nüsxədə tərtib olunub; hər ikisi eyni dərəcədə gülməlidir.', null, 1);
    y += 12;

    var al = attestLines(doc, CW, 3);
    out += attestation(P, al, M, y, CW);
    y += al.length * 13.6 + 4;

    out = centerBody(out, bs, y, 824, 80);                /* --- gövdə bitdi --- */

    out += T('TƏRƏFLƏRİN İMZALARI', W / 2, 850, { anchor: 'middle', size: 9, weight: 'bold', fam: SANS, fill: P.accentD, ls: 2 });
    out += '<path d="M ' + M + ' 858 H ' + (W - M) + '" stroke="' + P.accent + '" stroke-width="0.5"/>';
    [[M, 'TƏRƏF A', doc.from], [M + half + 10, 'TƏRƏF B', doc.to]].forEach(function (c, i) {
      out += T(c[1], c[0], 880, { size: 8.2, weight: 'bold', fam: SANS, fill: P.accentD, ls: 1.4 });
      out += T(wrap(c[2] || '—', font(11, 'bold', SANS), 260, 1)[0], c[0], 896, { size: 11, weight: 'bold', fam: SANS, fill: P.head });
      out += signature(doc.regNo + c[2] + i, c[0] + 10, 904, 160, 36);
      out += '<path d="M ' + c[0] + ' 950 H ' + (c[0] + 240) + '" stroke="' + P.ink + '" stroke-width="0.7"/>';
      out += T('imza', c[0] + 120, 962, { anchor: 'middle', size: 8, fam: SANS, fill: P.muted, ls: 1.2 });
    });
    out += seal(W / 2, 936, 62, P, doc.regNo, idp, 5);
    out += emboss(390, 1012, 36, P, idp);
    out += qrOrHint(doc, P, M, 992, 56, M + 68);
    out += barcode(doc.regNo, W - M - 200, 1000, 200, 20, { hri: true, P: P });

    if (C.verified) out += verifiedStamp(520, 660, -9);
    out += pageFurniture(doc, C, {
      form: [M, 1064], page: [W - M, 1064, 'end'], disclaimer: [0, H - 26, W]
    });
    return out;
  }

  /* ==================================================================
     LAYOUT 9 — TELEQRAM (teletayp lenti, tam böyük hərflər, « TCK »)
     ================================================================== */
  function L_teleqram(doc, C) {
    var P = C.P, idp = C.idp, M = 84, CW = W - M * 2, out = '';

    out += paperBase(doc, C, {
      fibers: 40, ghost: [W / 2, 640, 150], fold: [38, W - 38],
      micro: [38, 38, W - 76, H - 76]
    });

    /* zolaqlı lent — alt zolaq disclaimer zolağının üstündə qalır */
    var TP = 'url(#' + idp + '-tape)';
    out += '<rect x="0" y="0" width="' + W + '" height="26" fill="' + TP + '"/>';
    out += '<rect x="0" y="' + (H - 54) + '" width="' + W + '" height="26" fill="' + TP + '"/>';
    out += '<rect x="0" y="26" width="26" height="' + (H - 80) + '" fill="' + TP + '"/>';
    out += '<rect x="' + (W - 26) + '" y="26" width="26" height="' + (H - 80) + '" fill="' + TP + '"/>';

    out += T('ZNP TELEQRAF', M, 70, { size: 18, weight: 'bold', fam: SANS, fill: P.head, ls: 6 });
    out += qurumSetri(doc, '', true, M, 87, { size: 8, fam: SANS, fill: P.muted, ls: 1.6 });
    out += '<rect x="' + (W - M - 132) + '" y="50" width="132" height="30" fill="none" stroke="' + P.head + '" stroke-width="1.4"/>';
    out += T('TELEQRAM', W - M - 66, 70, { anchor: 'middle', size: 13, weight: 'bold', fam: SANS, fill: P.head, ls: 2.4 });
    out += '<path d="M ' + M + ' 92 H ' + (W - M) + '" stroke="' + P.head + '" stroke-width="1.4"/>';

    /* teletayp başlıq şəbəkəsi — söz sayı mətindən real hesablanır */
    var words = String(doc.preamble || '').trim().split(/\s+/).length;
    var hh = hash(doc.regNo + 'hh');
    var cells = [
      'KATEQORİYA: TƏCİLİ', 'NÖV: ADİ', 'SÖZ SAYI: ' + pad(words, 3),
      'QƏBUL: ' + pad(hh % 24, 2) + ':' + pad(hh % 60, 2), 'XƏTT: ZRF-07', 'OPERATOR: ' + pad(hh % 90 + 10, 2)
    ];
    out += '<rect x="' + M + '" y="104" width="' + CW + '" height="58" fill="none" stroke="' + P.accent + '" stroke-width="0.8"/>';
    out += '<path d="M ' + M + ' 133 H ' + (W - M) + '" stroke="' + P.accent + '" stroke-width="0.4"/>';
    cells.forEach(function (c, i) {
      var col = i % 3, row = Math.floor(i / 3);
      if (col) out += '<path d="M ' + (M + col * CW / 3) + ' ' + (104 + row * 29) + ' v 29" stroke="' + P.accent + '" stroke-width="0.4"/>';
      out += T(c, M + col * CW / 3 + 10, 104 + row * 29 + 19, { size: 9, fam: MONO, fill: P.ink });
    });

    out += intakeStamp(W - M - 158, 178, P, doc);

    var bs = out.length;                                  /* --- gövdə başlayır --- */

    var y = 272;
    [['KİMƏ', upper(doc.to)], ['ÜNVAN', CUR.wire], ['KİMDƏN', upper(doc.from)]].forEach(function (r) {
      out += T(r[0] + ' =', M, y, { size: 12, fam: MONO, fill: P.muted });
      out += T(wrap(r[1] || '—', font(12, 'bold', MONO), CW - 100, 1)[0], M + 100, y, { size: 12, weight: 'bold', fam: MONO, fill: P.head });
      y += 22;
    });
    y += 8;
    out += '<path d="M ' + M + ' ' + y + ' H ' + (W - M) + '" stroke="' + P.accent + '" stroke-width="0.6" stroke-dasharray="4 3"/>';
    y += 30;

    var bf = font(13.5, '', MONO);
    var body = upper(doc.preamble).replace(/\.\s*/g, ' TCK ');
    var bl = wrap(body, bf, CW - 62, 8);   /* ls:1.2 `measure`-də sayılmır */
    out += block(bl, M, y, 24, { size: 13.5, fam: MONO, fill: P.ink, ls: 1.2 });
    y += bl.length * 24 + 16;

    items(doc, 4).forEach(function (it) {
      var ln = wrap('- ' + upper(it).replace(/\.$/, '') + ' TCK', font(12.5, '', MONO), CW, 2);
      out += block(ln, M, y, 21, { size: 12.5, fam: MONO, fill: P.ink });
      y += ln.length * 21 + 4;
    });
    y += 12;

    var pen = wrap(upper(doc.penalty || '—').replace(/\.$/, '') + ' TCK', font(12.5, '', MONO), CW, 2);
    out += block(pen, M, y, 21, { size: 12.5, fam: MONO, fill: penC(P) });
    y += pen.length * 21 + 22;

    out += T('SON TCK', M, y, { size: 13, weight: 'bold', fam: MONO, fill: P.head, ls: 2 });
    y += 20;
    out += T('= = = = = = = = = = = = = = = =', M, y, { size: 11, fam: MONO, fill: P.muted, ls: 1 });
    y += 30;

    /* təsdiq düsturu bilərəkdən serif-italikdir: ötürmədən SONRA vurulmuş qeyd */
    var al = attestLines(doc, CW, 3);
    out += attestation(P, al, M, y, CW);
    y += al.length * 13.6 + 4;

    out = centerBody(out, bs, y, 860, 110);               /* --- gövdə bitdi --- */

    out += T('QƏBUL EDƏN OPERATOR', M, 886, { size: 9, fam: SANS, fill: P.muted, ls: 1.2 });
    out += signature(doc.regNo + 'op', M + 8, 896, 170, 38);
    out += '<path d="M ' + M + ' 946 H ' + (M + 220) + '" stroke="' + P.ink + '" stroke-width="0.7"/>';
    out += T(CUR.notary + ' (uydurma şəxs)', M, 962, { size: 8.6, fam: SANS, fill: P.muted });
    out += seal(W - 176, 930, 62, P, doc.regNo, idp, 4);
    out += emboss(M + 258, 880, 38, P, idp);
    out += qrOrHint(doc, P, M, 990, 54, M + 66);
    out += barcode(doc.regNo, W - M - 190, 998, 190, 22, { hri: true, bg: true, P: P });

    if (C.verified) out += verifiedStamp(520, 660, -8);
    out += pageFurniture(doc, C, {
      form: [M, 1064], page: [W - M, 1064, 'end'], disclaimer: [0, H - 26, W]
    });
    return out;
  }

  /* ==================================================================
     LAYOUT 10 — VƏSİQƏ (pasport məlumat səhifəsi + ICAO TD3 MRZ)
     `centerBody` işlətmir: MRZ kartın alt kənarından sabit məsafədə
     durmalıdır, ona görə hündürlük əvvəlcə hesablanır (lisenziya üslubu).
     ================================================================== */
  function L_vesiqe(doc, C) {
    var P = C.P, idp = C.idp, out = '';
    var CX = 48, CWid = W - CX * 2, CY = 118;

    var px = CX + 24, py = CY + 72, pw = 152, ph = 192;
    var fx = px + pw + 30, fw = CX + CWid - 24 - fx;

    var parts = String(doc.to || '—').trim().split(/\s+/);
    var sur = parts.length > 1 ? parts[parts.length - 1] : (parts[0] || '—');
    var giv = parts.slice(0, -1).join(' ') || '—';
    var h = hash(doc.regNo + 'dob');
    var dob = pad(1 + h % 28, 2) + '.' + pad(1 + h % 12, 2) + '.' + (1970 + h % 30);
    var exp = doc.date.slice(0, 6) + (parseInt(doc.date.slice(6), 10) + 10);
    var fields = [
      ['SOYADI / SURNAME', upper(sur)], ['ADI / GIVEN NAMES', upper(giv)],
      ['VƏTƏNDAŞLIĞI / NATIONALITY', CUR.nation], ['DOĞUM TARİXİ / DATE OF BIRTH', dob],
      ['SƏNƏD № / DOCUMENT NO', doc.regNo], ['VERİLMƏ · ETİBARLIDIR / ISSUE · EXPIRY', doc.date + '  —  ' + exp],
      [lbl(doc, 'fromLabel', 'VERƏN ORQAN / AUTHORITY'), doc.from]
    ];
    var mrzH = 66;
    var fieldsEnd = py + 8 + fields.length * 40 + 46;
    var photoEnd = py + ph + 12 + 68 + 14 + 48 + 18;
    var CHt = Math.max(Math.max(fieldsEnd, photoEnd) - CY + 26 + mrzH, 560);
    var mrzY = CY + CHt - mrzH - 12;

    out += paperBase(doc, C, { fibers: 80, fold: [10, W - 10] });
    out += T(CUR.org, W / 2, 60, { anchor: 'middle', size: 12, fam: SANS, weight: 'bold', fill: P.head, ls: 4.4 });
    out += qurumSetri(doc, 'ŞƏXSİYYƏT VƏSİQƏLƏRİ REYESTRİ · UYDURMA QURUM', true, W / 2, 78, { anchor: 'middle', size: 8.2, fam: SANS, fill: P.muted, ls: 2.6 });
    out += '<path d="M 190 92 H ' + (W - 190) + '" stroke="' + P.accent + '" stroke-width="0.8"/>';

    /* --- kart --- */
    out += '<rect x="' + CX + '" y="' + CY + '" width="' + CWid + '" height="' + CHt + '" rx="14" fill="' + P.paper + '" stroke="' + P.accentD + '" stroke-width="1.6"/>';
    out += '<rect x="' + (CX + 8) + '" y="' + (CY + 8) + '" width="' + (CWid - 16) + '" height="' + (CHt - 16) + '" rx="10" fill="none" stroke="' + P.accent + '" stroke-width="0.6" stroke-dasharray="4 3"/>';
    out += '<g opacity="0.16">' + guilloche(W / 2, CY + CHt / 2, P, 1, 0.6) + '</g>';
    out += crest(CX + CWid - 130, CY + CHt - 150, 92, P, {
      detail: 'ghost', op: 0.07, mono: P.accentD, banner: 'HÜQUQİ QÜVVƏSİ YOXDUR'
    });
    out += microtext(CX + 14, CY + 14, CWid - 28, CHt - 28, P);

    out += '<rect x="' + CX + '" y="' + CY + '" width="' + CWid + '" height="44" rx="14" fill="' + P.head + '"/>';
    out += '<rect x="' + CX + '" y="' + (CY + 28) + '" width="' + CWid + '" height="16" fill="' + P.head + '"/>';
    out += T('VƏSİQƏ / IDENTITY CARD', CX + 22, CY + 29, { size: 11, fam: SANS, weight: 'bold', fill: '#fff', ls: 2.2 });
    out += T('№ ' + doc.regNo, CX + CWid - 22, CY + 29, { anchor: 'end', size: 11, fam: SANS, weight: 'bold', fill: P.accentL, ls: 1.2 });

    /* foto sütunu */
    out += '<rect x="' + px + '" y="' + py + '" width="' + pw + '" height="' + ph + '" fill="#fff" stroke="' + P.accent + '" stroke-width="1"/>';
    out += '<circle cx="' + (px + pw / 2) + '" cy="' + (py + 68) + '" r="34" fill="' + P.accentL + '" opacity="0.5"/>';
    out += '<path d="M ' + (px + pw / 2 - 52) + ' ' + (py + ph - 10) + ' a 52 60 0 0 1 104 0 Z" fill="' + P.accentL + '" opacity="0.5"/>';
    out += T('FOTO / PHOTO', px + pw / 2, py + ph - 12, { anchor: 'middle', size: 8, fam: SANS, fill: '#fff', ls: 1.6 });
    /* ikinci, solğun portret — pasport lüğətinin özəyi */
    var gx = px + pw / 2 - 27, gy2 = py + ph + 12;
    out += '<g opacity="0.35"><rect x="' + gx + '" y="' + gy2 + '" width="54" height="68" fill="none" stroke="' + P.accent + '" stroke-width="0.6"/>' +
      '<circle cx="' + (gx + 27) + '" cy="' + (gy2 + 24) + '" r="12" fill="' + P.accentL + '"/>' +
      '<path d="M ' + (gx + 27 - 19) + ' ' + (gy2 + 66) + ' a 19 22 0 0 1 38 0 Z" fill="' + P.accentL + '"/></g>';
    var hy = gy2 + 68 + 14 + 24;
    out += '<circle cx="' + (px + pw / 2) + '" cy="' + hy + '" r="24" fill="url(#' + idp + '-holo)" opacity="0.6"/>';
    out += '<path d="' + rosette(px + pw / 2, hy, 21, 13, 0.18) + '" fill="none" stroke="' + P.accentD + '" stroke-width="0.5" opacity="0.7"/>';
    out += T('HOLOQRAM / HOLOGRAM', px + pw / 2, hy + 38, { anchor: 'middle', size: 7, fam: SANS, fill: P.muted, ls: 1.2 });

    /* ikidilli sahələr */
    var y = py + 8;
    fields.forEach(function (f) {
      out += T(f[0], fx, y, { size: 7.4, fam: SANS, weight: 'bold', fill: P.accent, ls: 1.4 });
      out += T(wrap(String(f[1] || '—'), font(14, 'bold', SANS), fw, 1)[0], fx, y + 20, { size: 14, weight: 'bold', fam: SANS, fill: P.head });
      out += '<path d="M ' + fx + ' ' + (y + 27) + ' H ' + (fx + fw) + '" stroke="' + P.accent + '" stroke-width="0.4" stroke-dasharray="2 2"/>';
      y += 40;
    });
    out += T('SAHİBİN İMZASI / HOLDER SIGNATURE', fx, y + 4, { size: 7.4, fam: SANS, weight: 'bold', fill: P.accent, ls: 1.4 });
    out += signature(doc.regNo + doc.to, fx, y + 8, 150, 34);

    /* MRZ zolağı — həmişə ağ fonda */
    var mrz = mrzPair(doc), adv = (CWid - 44) / 44;
    out += '<rect x="' + (CX + 10) + '" y="' + mrzY + '" width="' + (CWid - 20) + '" height="60" fill="#ffffff" opacity="0.93"/>';
    out += mrzLine(mrz[0], CX + 22, mrzY + 26, adv, 13.5, '#101827');
    out += mrzLine(mrz[1], CX + 22, mrzY + 50, adv, 13.5, '#101827');

    /* Əsl vəsiqədə quru möhür fotonun kənarından keçir */
    out += emboss(px + pw - 8, py + ph - 18, 40, P, idp);

    /* kartdan sonra */
    var by = CY + CHt + 32;
    var pre = wrap(doc.preamble, font(11.6, '', SANS), W - 140, 3);
    out += block(pre, 70, by, 18, { size: 11.6, fam: SANS, fill: P.ink });
    by += pre.length * 18 + 22;
    var pen = wrap(doc.penalty || '—', font(11.2, '', SANS), 440, 2);
    out += '<rect x="70" y="' + (by - 14) + '" width="4" height="' + (pen.length * 17 + 24) + '" fill="' + penC(P) + '"/>';
    out += T(lbl(doc, 'penaltyLabel', 'ETİBARSIZLIQ ŞƏRTİ'), 84, by, { size: 8, fam: SANS, weight: 'bold', fill: penC(P), ls: 1.6 });
    out += block(pen, 84, by + 16, 17, { size: 11.2, fam: SANS, fill: P.ink });
    by += 16 + pen.length * 17 + 28;

    var al = attestLines(doc, W - 140, 3);
    out += attestation(P, al, 70, by, W - 140);

    out += seal(646, 950, 62, P, doc.regNo, idp, -8);
    out += qrOrHint(doc, P, 70, 998, 56, 138);
    out += barcode(doc.regNo, W - 250, 1006, 180, 20, { hri: true, bg: true, P: P });

    if (C.verified) out += verifiedStamp(430, CY + CHt - 150, -11);
    out += pageFurniture(doc, C, { form: [70, 1084], page: [W - 70, 1084, 'end'] });
    return out;
  }

  /* ==================================================================
     LAYOUT 11 — VİZA (pasport səhifəsi: holoqram şəbəkəsi, MRZ zolağı)
     ================================================================== */
  function L_viza(doc, C) {
    var P = C.P, idp = C.idp, M = 70, CW = W - M * 2, out = '', i, j;

    /* --- QAT 1: substrat --- */
    out += paperBase(doc, C, {
      fibers: 90, ghost: [W / 2, 600, 158, 0.05], fold: [10, W - 10],
      micro: [30, 30, W - 60, H - 60]
    });
    /* holoqram şəbəkəsi — pasport səhifəsinin optik qoruması */
    out += '<g opacity="0.07">';
    for (i = 0; i < 4; i++)
      for (j = 0; j < 6; j++)
        out += '<path d="' + rosette(140 + i * 172, 268 + j * 126, 38, 11, 0.2) +
          '" fill="url(#' + idp + '-holo)" stroke="' + P.accent + '" stroke-width="0.3"/>';
    out += '</g>';

    out += T(CUR.org, W / 2, 58, { anchor: 'middle', size: 12, fam: SANS, weight: 'bold', fill: P.head, ls: 4.2 });
    out += qurumSetri(doc, CUR.orgAgency, true, W / 2, 76,
      { anchor: 'middle', size: 8.2, fam: SANS, fill: P.muted, ls: 2.6 });
    out += '<path d="M ' + M + ' 92 H ' + (W - M) + '" stroke="' + P.accentD + '" stroke-width="1.4"/>';
    out += '<path d="M ' + M + ' 96 H ' + (W - M) + '" stroke="' + P.accent + '" stroke-width="0.5"/>';

    var bs = out.length;                       /* --- QAT 2: gövdə --- */

    var y = 124;
    out += '<rect x="' + M + '" y="' + y + '" width="' + CW + '" height="46" fill="' + P.head + '"/>';
    out += T('VİZA / VISA', M + 18, y + 30, { size: 15, fam: SANS, weight: 'bold', fill: '#fff', ls: 3.4 });
    out += T('№ ' + doc.regNo, W - M - 18, y + 30,
      { anchor: 'end', size: 12.5, fam: SANS, weight: 'bold', fill: P.accentL, ls: 1.4 });
    y += 46 + 26;

    var ts = fit(upper(doc.title || ''), CW, 17, 11, 'bold', SANS);
    out += T(upper(doc.title || ''), M, y, { size: ts, fam: SANS, weight: 'bold', fill: P.head, ls: 1 });
    y += 26;

    var rows = (doc.data && doc.data.length) ? doc.data : [
      [lbl(doc, 'toLabel', 'SOYAD, AD / SURNAME'), doc.to],
      [lbl(doc, 'fromLabel', 'VERƏN ORQAN / AUTHORITY'), doc.from],
      ['VERİLMƏ TARİXİ / DATE', doc.date],
      ['SERİYA / SERIES', seriya(doc)]
    ];
    var kv = kvTable(rows.slice(0, 10), M, y, CW, P, { style: 'rule', lw: 250, rh: 25 });
    out += kv.s; y = kv.y + 12;

    out += T('QEYDLƏR / REMARKS', M, y, { size: 8.6, fam: SANS, weight: 'bold', fill: P.accentD, ls: 1.8 });
    y += 16;
    var notes = (doc.notes && doc.notes.length) ? doc.notes : items(doc, 7);
    for (i = 0; i < notes.length && y < 720; i++) {
      var ln = wrap(String(notes[i]), font(10.6, '', SERIF), CW - 22, 2);
      out += T((i + 1) + '.', M, y, { size: 10.6, weight: 'bold', fill: P.accentD });
      out += block(ln, M + 20, y, 16, { size: 10.6, fill: P.ink });
      y += ln.length * 16 + 5;
    }
    y += 12;

    var pen = wrap(doc.penalty || '—', font(10.6, '', SERIF, 'italic'), CW - 22, 2);
    out += '<rect x="' + M + '" y="' + (y - 12) + '" width="3" height="' + (pen.length * 16 + 6) + '" fill="' + penC(P) + '" opacity="0.85"/>';
    out += T(lbl(doc, 'penaltyLabel', 'ETİBARSIZLIQ ŞƏRTİ'), M + 12, y,
      { size: 9, fam: SANS, weight: 'bold', fill: penC(P), ls: 1.2 });
    out += block(pen, M + 12, y + 15, 16, { size: 10.6, style: 'italic', fill: P.muted });
    y += pen.length * 16 + 26;

    var al = attestLines(doc, CW, 3);
    out += attestation(P, al, M, y, CW);
    y += al.length * 13.6 + 6;

    out = centerBody(out, bs, y, 820, 150);    /* sürüşmə yalnız gövdəyə aiddir — MRZ və möhür sonra gəlir */

    /* --- QAT 3-dən əvvəl: imza, möhür, MRZ, kodlar --- */
    out += T(upper(doc.signTitle || CUR.role), W - M - 190, 842,
      { size: 8.4, fam: SANS, weight: 'bold', fill: P.accent, ls: 1.6 });
    out += signature(doc.regNo + doc.from, W - M - 190, 848, 178, 38);
    out += '<path d="M ' + (W - M - 190) + ' 890 H ' + (W - M) + '" stroke="' + P.accent + '" stroke-width="0.7"/>';
    out += T(CUR.notaryLine, W - M - 190, 902, { size: 8, fam: SANS, fill: P.muted });

    out += seal(M + 74, 866, 56, P, doc.regNo, idp, -9);
    if (doc.paid && doc.state === 'active')
      out += stateStamp(W / 2 - 30, 800, { color: '#1e4b9c', top: 'BURAXILIŞ VERİLDİ', sub: doc.date, rot: -7, w: 300, h: 70, topSize: 16, op: 0.8 });
    out += docStateStamp(doc, W / 2, 560);

    var mrz = mrzViza(doc), adv = (CW - 26) / 44;
    out += '<rect x="' + M + '" y="916" width="' + CW + '" height="58" fill="#ffffff" opacity="0.93" stroke="' + P.accent + '" stroke-width="0.5"/>';
    out += mrzLine(mrz[0], M + 13, 940, adv, 13, '#101827');
    out += mrzLine(mrz[1], M + 13, 962, adv, 13, '#101827');

    out += emboss(W - M - 60, 830, 40, P, idp);
    out += qrOrHint(doc, P, M, 992, 54, M + 68);
    out += barcode(doc.regNo, W - M - 190, 1000, 190, 20, { hri: true, bg: true, P: P });

    if (C.verified) out += verifiedStamp(W / 2 + 40, 700, -12);
    out += pageFurniture(doc, C, { form: [M, 1084], page: [W - M, 1084, 'end'] });
    return out;
  }

  /* ==================================================================
     LAYOUT 12 — EKSPERTİZA RƏYİ (texniki hesabat: panel, cədvəl, şkala)
     ================================================================== */
  function L_ekspertiza(doc, C) {
    var P = C.P, idp = C.idp, M = 70, CW = W - M * 2, out = '', i;

    /* --- QAT 1: substrat --- */
    out += paperBase(doc, C, { fibers: 60, fold: [10, W - 10], micro: [28, 28, W - 56, H - 56] });
    /* Skan xətləri yalnız bu dizaynda işlənir, ona görə `defs()`-ə əlavə edilmir:
       ortaq defs-ə toxunmaq bütün dizaynların baytını dəyişərdi. */
    out += '<pattern id="' + idp + '-scan" width="4" height="4" patternUnits="userSpaceOnUse">' +
      '<path d="M 0 0 H 4" stroke="' + P.accentL + '" stroke-width="0.6" opacity="0.5"/></pattern>';

    out += T(CUR.org, W / 2, 56, { anchor: 'middle', size: 11.5, fam: SANS, weight: 'bold', fill: P.head, ls: 4 });
    out += qurumSetri(doc, CUR.orgAgency, true, W / 2, 74,
      { anchor: 'middle', size: 8.2, fam: SANS, fill: P.muted, ls: 2.4 });
    out += '<path d="M ' + M + ' 90 H ' + (W - M) + '" stroke="' + P.accentD + '" stroke-width="1.2"/>';

    var bs = out.length;                       /* --- QAT 2: gövdə --- */

    var y = 118;
    out += '<rect x="' + M + '" y="' + y + '" width="' + CW + '" height="64" fill="' + P.head + '"/>';
    out += '<rect x="' + M + '" y="' + y + '" width="' + CW + '" height="64" fill="url(#' + idp + '-scan)" opacity="0.22"/>';
    out += T(CUR.expHead, M + 18, y + 28, { size: 16, fam: SANS, weight: 'bold', fill: '#fff', ls: 2.8 });
    out += T(CUR.expNo + ' ' + doc.regNo + '  ·  ' + doc.date + '  ·  ' + seriya(doc), M + 18, y + 50,
      { size: 10, fam: MONO, fill: P.accentL, ls: 0.6 });
    y += 64 + 26;

    var ts = fit(upper(doc.title || ''), CW, 16, 11, 'bold', SANS);
    out += T(upper(doc.title || ''), M, y, { size: ts, fam: SANS, weight: 'bold', fill: P.head, ls: 0.8 });
    y += 26;

    out += T(CUR.expFound, M, y, { size: 8.8, fam: SANS, weight: 'bold', fill: P.accentD, ls: 1.8 });
    y += 16;
    var pre = wrapIndent(doc.preamble || '—', font(11.8, '', SERIF), CW, 24, 5);
    out += T(pre[0], M + 24, y, { size: 11.8, fill: P.ink });
    if (pre.length > 1) out += block(pre.slice(1), M, y + 19, 19, { size: 11.8, fill: P.ink });
    y += pre.length * 19 + 20;

    out += T(CUR.expMarks, M, y, { size: 8.8, fam: SANS, weight: 'bold', fill: P.accentD, ls: 1.8 });
    y += 16;
    var cl = checkList(doc.checks && doc.checks.length ? doc.checks : items(doc, 5), M, y, CW, P, { max: 5 });
    out += cl.s; y = cl.y + 12;

    var rows = (doc.data && doc.data.length) ? doc.data : [
      ['BARƏSİNDƏ', doc.to],
      ['EKSPERTİZANI APARAN', doc.from],
      ['RƏYİN TARİXİ', doc.date],
      ['SERİYA', seriya(doc)]
    ];
    var kv = kvTable(rows.slice(0, 8), M, y + 14, CW, P, { style: 'grid', lw: 260, rh: 26 });
    out += kv.s; y = kv.y + 14;

    if (doc.scale && doc.scale.max) {
      var sc = scaleBar(doc.scale.label || 'DƏRƏCƏ', doc.scale.v, doc.scale.max, M, y, CW, P);
      out += sc.s; y = sc.y;
    }

    var pen = wrap(doc.penalty || '—', font(11, '', SERIF), CW - 26, 3);
    out += '<rect x="' + M + '" y="' + (y - 14) + '" width="' + CW + '" height="' + (pen.length * 17 + 26) +
      '" fill="' + P.soft + '" opacity="0.5"/>';
    out += '<rect x="' + M + '" y="' + (y - 14) + '" width="3.5" height="' + (pen.length * 17 + 26) + '" fill="' + penC(P) + '"/>';
    out += T(lbl(doc, 'penaltyLabel', 'NƏTİCƏ'), M + 14, y + 2,
      { size: 9, fam: SANS, weight: 'bold', fill: penC(P), ls: 1.4 });
    out += block(pen, M + 14, y + 18, 17, { size: 11, fill: P.ink });
    y += pen.length * 17 + 32;

    var al = attestLines(doc, CW, 3);
    out += attestation(P, al, M, y, CW);
    y += al.length * 13.6 + 6;

    out = centerBody(out, bs, y, 856, 130);

    /* --- QAT 3-dən əvvəl --- */
    out += T(upper(doc.signTitle || CUR.role), M, 884,
      { size: 8.4, fam: SANS, weight: 'bold', fill: P.accent, ls: 1.6 });
    out += signature(doc.regNo + doc.from, M, 890, 176, 38);
    out += '<path d="M ' + M + ' 932 H ' + (M + 190) + '" stroke="' + P.accent + '" stroke-width="0.7"/>';
    out += T(CUR.notaryLine, M, 944, { size: 8, fam: SANS, fill: P.muted });

    out += seal(W - M - 96, 906, 58, P, doc.regNo, idp, -8);
    out += emboss(W / 2 + 10, 950, 42, P, idp);
    out += docStateStamp(doc, W / 2, 596);

    out += qrOrHint(doc, P, M, 986, 54, M + 68);
    out += barcode(doc.regNo, W - M - 190, 994, 190, 20, { hri: true, P: P });

    if (C.verified) out += verifiedStamp(W / 2 + 30, 720, -12);
    out += pageFurniture(doc, C, { form: [M, 1084], page: [W - M, 1084, 'end'] });
    return out;
  }

  var LAYOUTS = {
    notarial: L_notarial, blank: L_blank, diplom: L_diplom, sertifikat: L_sertifikat, lisenziya: L_lisenziya,
    arayis: L_arayis, qerar: L_qerar, muqavile: L_muqavile, teleqram: L_teleqram, vesiqe: L_vesiqe,
    viza: L_viza, ekspertiza: L_ekspertiza
  };

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
      '<pattern id="' + idp + '-tape" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">' +
      '<rect width="14" height="14" fill="' + P.paper + '"/>' +
      '<rect width="7" height="14" fill="' + P.seal + '" opacity="0.75"/>' +
      '<rect x="7" width="7" height="14" fill="' + P.head + '" opacity="0.55"/></pattern>' +
      '</defs>';
  }

  function ctxFor(doc, opts) {
    opts = opts || {};
    CUR = TONE[doc && doc.tone] || TONE.zarafat;
    var P = PALETTES[doc.palette] || PALETTES.gold;
    var idp = opts.idPrefix || ('d' + (hash(doc.regNo + (doc.layout || '')) % 99999));
    return { P: P, idp: idp, verified: !!opts.verified, tone: CUR };
  }

  /* Parodiya nişanlarının mexaniki qorunması: su nişanı və disclaimer olmadan
     heç bir layout çıxa bilməz — yeni dizayn yazan onları unutsa belə. */
  function inner(doc, C) {
    var s = (LAYOUTS[doc.layout] || LAYOUTS.notarial)(doc, C);
    if (s.indexOf('data-wm=') < 0) s += watermark(C.P, doc.paid);
    if (s.indexOf('data-dc=') < 0) s += disclaimer(C.P, 0, H - 26, W);
    return s;
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
    s += T(CUR.org, SW / 2, 132, { anchor: 'middle', size: 27, fam: SANS, weight: 'bold', fill: P.accentL, ls: 6 });
    var hl = wrap(upper(doc.title), font(43, 'bold', SANS), 920, 2);
    s += block(hl, SW / 2, 198, 50, { size: 43, weight: 'bold', fam: SANS, fill: '#fff', anchor: 'middle', ls: 1 });
    s += '<g transform="translate(' + dx + ',' + dy + ') scale(' + sc + ')">';
    s += '<rect x="-6" y="-6" width="' + (W + 12) + '" height="' + (H + 12) + '" fill="#000" opacity="0.35"/>';
    s += inner(doc, C) + '</g>';
    s += T(doc.regNo, SW / 2, SH - 118, { anchor: 'middle', size: 32, fam: SANS, weight: 'bold', fill: P.accentL, ls: 3 });
    s += T('Sən də yarat → zarafat.az', SW / 2, SH - 72, { anchor: 'middle', size: 23, fam: SANS, fill: '#c9d3e6', ls: 2 });
    s += T(CUR.storyFoot, SW / 2, SH - 36, { anchor: 'middle', size: 17, fam: SANS, fill: '#7f8ba3', ls: 1.4 });
    return s + '</svg>';
  }

  return {
    a4: a4, story: story,
    W: W, H: H, STORY_W: 1080, STORY_H: 1920,
    LAYOUTS: Object.keys(LAYOUTS), LAYOUT_NAMES: LAYOUT_NAMES, PALETTES: Object.keys(PALETTES),
    TONES: TONES, TONE_NAMES: TONE_NAMES,
    code39: code39, C39: C39
  };
})();
