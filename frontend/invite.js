/* Dəvətnamə çəkiliş motoru — window.DAVET.
   Asılılığı yoxdur; devet-designs.js-dən sonra yüklənməlidir.

   NİYƏ SVG YOX, CANVAS: doc.js saf SVG qaytarır və PNG ixracı
   SVG → Blob → <img> → canvas yolu ilə gedir; bu yolda VEB ŞRİFTLƏR İTİR
   (məhz ona görə doc.js Georgia/Helvetica kimi ümumi yığınlardan istifadə edir).
   Dəvətnamədə isə şrift məhsulun özüdür, ona görə birbaşa canvas 2D API-si
   işlədilir: ctx.fillText səhifənin @font-face şriftlərini olduğu kimi çəkir.

   DETERMİNİSTİK: Date.now() və Math.random() İŞLƏDİLMİR — eyni məlumat həmişə
   eyni şəkli verir, yoxsa istifadəçinin yüklədiyi PNG ilə linkdə görünən
   nüsxə fərqlənərdi. Təsadüfilik lazım olanda rng(seed) işlədilir. */
(function (root) {
  'use strict';

  var PALETTES = root.DAVET_PALETTES || {};
  var EVENTS   = root.DAVET_EVENTS || [];
  var DESIGNS  = root.DAVET_DESIGNS || [];

  /* --- Ölçülər ---------------------------------------------------------
     kart  — A6, 300 dpi (105×148 mm), çap üçün
     kvadrat — Instagram
     hekaye  — WhatsApp statusu / story */
  var RATIOS = {
    kart:    { w: 1240, h: 1748, ad: 'Çap kartı (A6)',      qisa: 'Kart' },
    kvadrat: { w: 1080, h: 1080, ad: 'Instagram kvadrat',   qisa: 'Kvadrat' },
    hekaye:  { w: 1080, h: 1920, ad: 'WhatsApp statusu',    qisa: 'Status' }
  };
  var OG = { w: 1200, h: 630 };

  /* --- Şriftlər — hamısı tools/check-fonts.js yoxlamasından keçib ------ */
  var F = {
    serif:   '"Davet Serif", Georgia, "Times New Roman", serif',
    display: '"Davet Display", Georgia, "Times New Roman", serif',
    sans:    '"Davet Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
    script:  '"Davet Script", "Davet Serif", Georgia, cursive',
    yumsaq:  '"Davet Yumsaq", "Davet Sans", Helvetica, Arial, sans-serif'
  };
  var FACES = [
    '400 100px "Davet Serif"', '600 100px "Davet Serif"', '700 100px "Davet Display"',
    '400 100px "Davet Sans"', '600 100px "Davet Sans"', '800 100px "Davet Sans"',
    '400 100px "Davet Script"', '500 100px "Davet Yumsaq"', '700 100px "Davet Yumsaq"'
  ];

  /* Şriftlər yüklənməmiş çəkmək fallback şriftlə nəticələnir — ixracdan
     əvvəl mütləq gözlənilməlidir. */
  function ready() {
    if (typeof document === 'undefined' || !document.fonts) return Promise.resolve();
    var all = FACES.map(function (f) { return document.fonts.load(f, 'Əə Ğğ İı Şş'); });
    return Promise.all(all).then(function () { return document.fonts.ready; });
  }

  /* --- Azərbaycan hərf registri ---------------------------------------
     'i'.toUpperCase() === 'I' olduğu üçün standart metod yaramır. */
  var UP = { 'i': 'İ', 'ı': 'I', 'ə': 'Ə', 'ğ': 'Ğ', 'ç': 'Ç', 'ş': 'Ş', 'ö': 'Ö', 'ü': 'Ü' };
  function upper(s) {
    s = String(s == null ? '' : s);
    var out = '', i, c;
    for (i = 0; i < s.length; i++) { c = s.charAt(i); out += UP[c] || c.toUpperCase(); }
    return out;
  }

  /* --- Deterministik təsadüfilik --------------------------------------- */
  function hash(str) {
    var h = 2166136261, i;
    str = String(str == null ? '' : str);
    for (i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = (h * 16777619) >>> 0; }
    return h >>> 0;
  }
  function rng(seed) {
    var s = seed >>> 0;
    return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  }

  /* --- Mətn köməkçiləri ------------------------------------------------ */
  function font(size, weight, fam) { return (weight || 400) + ' ' + Math.round(size) + 'px ' + fam; }

  function olc(ctx, text, f) { ctx.font = f; return ctx.measureText(text).width; }

  /* Söz-söz sarınma; son sətir sığmasa üç nöqtə ilə kəsilir. */
  function sar(ctx, text, f, maxW, maxLines) {
    text = String(text == null ? '' : text).trim();
    if (!text) return [];
    maxLines = maxLines || 3;
    ctx.font = f;
    var words = text.split(/\s+/), lines = [], cur = '';
    for (var i = 0; i < words.length; i++) {
      var t = cur ? cur + ' ' + words[i] : words[i];
      if (ctx.measureText(t).width <= maxW || !cur) { cur = t; }
      else { lines.push(cur); cur = words[i]; if (lines.length === maxLines) break; }
    }
    if (lines.length < maxLines && cur) lines.push(cur);
    if (lines.length === maxLines) {
      var last = lines[maxLines - 1];
      if (ctx.measureText(last).width > maxW) {
        while (last.length > 1 && ctx.measureText(last + '…').width > maxW) last = last.slice(0, -1);
        lines[maxLines - 1] = last + '…';
      }
    }
    return lines;
  }

  /* Bir sətrin enə sığması üçün ölçünü kiçildir. */
  function sigdir(ctx, text, fam, weight, maxW, start, min) {
    var s = start;
    while (s > min && olc(ctx, text, font(s, weight, fam)) > maxW) s -= 1;
    return s;
  }

  /* Hərf aralığı canvas-da standart deyil (ctx.letterSpacing hər brauzerdə
     yoxdur), ona görə aralıqlı mətn hərf-hərf çəkilir. */
  function cizSetir(ctx, text, x, y, ls, align) {
    if (!ls) { ctx.textAlign = align; ctx.fillText(text, x, y); return; }
    ctx.textAlign = 'left';
    var i, w = 0;
    for (i = 0; i < text.length; i++) w += ctx.measureText(text.charAt(i)).width + ls;
    w -= ls;
    var sx = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x;
    for (i = 0; i < text.length; i++) {
      ctx.fillText(text.charAt(i), sx, y);
      sx += ctx.measureText(text.charAt(i)).width + ls;
    }
  }

  /* --- Yığın (vertical stack) ------------------------------------------
     Blokların ümumi hündürlüyü hesablanır və qutunun içində şaquli
     mərkəzləşdirilir. Üç fərqli nisbət eyni koddan düzgün çıxsın deyə
     yerləşdirmə sabit koordinatlarla deyil, yığınla qurulur. */
  function olcYigin(ctx, items, maxW, k) {
    var h = 0;
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      if (it._size0 == null) { it._size0 = it.size || 0; it._gap0 = it.gap || 0; it._h0 = it.h || 0; }
      it.size = it._size0 * k;
      it._gap = it._gap0 * k;
      if (it.tip === 'ara' || it.tip === 'ciz' || it.tip === 'orn') { it._h = it._h0 * k; }
      else {
        var f = font(it.size, it.weight, it.fam);
        it._lines = it.tekSetir ? [String(it.s)] : sar(ctx, it.s, f, it.maxW || maxW, it.maxLines || 2);
        it._h = it._lines.length * it.size * (it.lh || 1.28);
      }
      h += it._h + (i ? it._gap : 0);
    }
    return h;
  }

  /* Yığın qutunun içində şaquli mərkəzləşdirilir. İki tənzimləmə var:
       · sığmırsa — bütün ölçülər eyni əmsalla kiçildilir (kvadrat nisbətdə lazım olur);
       · çox boş qalırsa — YALNIZ aralıqlar genişlənir, şrift ölçüsü toxunulmur.
     Bu, üç fərqli nisbətin (kart · kvadrat · status) eyni koddan düzgün
     çıxmasını təmin edir: sabit koordinat yazsaydıq hər nisbət üçün ayrıca
     yerləşdirmə lazım olardı. */
  function cizYigin(C, items, box) {
    var ctx = C.ctx, i, it;

    var k = 1, total = olcYigin(ctx, items, box.w, 1);
    if (total > box.h) {
      k = Math.max(0.58, (box.h / total) * 0.99);
      total = olcYigin(ctx, items, box.w, k);
    }

    /* Elastik aralıq: blok qutunun 80%-ni tutana qədər aralıqlar açılır. */
    var dolgun = box.dolgun == null ? 0.80 : box.dolgun;
    var gapSum = 0;
    for (i = 1; i < items.length; i++) gapSum += items[i]._gap;
    for (i = 0; i < items.length; i++) if (items[i].tip === 'ara') gapSum += items[i]._h;
    var artiq = box.h * dolgun - total;
    if (artiq > 0 && gapSum > 0) {
      var m = Math.min(2.6, (gapSum + artiq) / gapSum);
      for (i = 0; i < items.length; i++) {
        items[i]._gap *= m;
        if (items[i].tip === 'ara') items[i]._h *= m;
      }
      total = 0;
      for (i = 0; i < items.length; i++) total += items[i]._h + (i ? items[i]._gap : 0);
    }

    var y = box.y + (box.h - total) / 2;
    if (y < box.y) y = box.y;
    var ax = box.align === 'left' ? box.x : box.align === 'right' ? box.x + box.w : box.x + box.w / 2;

    for (i = 0; i < items.length; i++) {
      it = items[i];
      if (i) y += it._gap;
      if (it.tip === 'ara') { y += it._h; continue; }
      if (it.tip === 'ciz' || it.tip === 'orn') { it.ciz(C, ax, y, box, it._h); y += it._h; continue; }

      ctx.font = font(it.size, it.weight, it.fam);
      ctx.fillStyle = it.reng;
      ctx.textBaseline = 'top';
      if (it.op != null) ctx.globalAlpha = it.op;
      var lh = it.size * (it.lh || 1.28);
      for (var l = 0; l < it._lines.length; l++) {
        cizSetir(ctx, it._lines[l], ax, y + l * lh + (lh - it.size) / 2, (it.ls || 0) * k, box.align || 'center');
      }
      ctx.globalAlpha = 1;
      y += it._h;
    }
    return y;
  }

  /* --- Fon və bəzək ----------------------------------------------------- */

  function fonDoldur(C, qradiyent) {
    var ctx = C.ctx, P = C.P;
    if (qradiyent) {
      var g = ctx.createLinearGradient(0, 0, C.W * 0.4, C.H);
      g.addColorStop(0, P.kagiz);
      g.addColorStop(1, P.kagiz2);
      ctx.fillStyle = g;
    } else { ctx.fillStyle = P.kagiz; }
    ctx.fillRect(0, 0, C.W, C.H);
  }

  /* Kağız toxuması — çox zəif nöqtələr. Deterministik seed ilə. */
  function toxuma(C, op) {
    var ctx = C.ctx, r = rng(C.seed), n = Math.round(C.W * C.H / 5200);
    ctx.save();
    ctx.globalAlpha = op == null ? 0.05 : op;
    ctx.fillStyle = C.P.murekkeb;
    for (var i = 0; i < n; i++) {
      ctx.fillRect(Math.floor(r() * C.W), Math.floor(r() * C.H), 1, 1);
    }
    ctx.restore();
  }

  function cerceve(C, inset, ikiqat) {
    var ctx = C.ctx, u = C.u, m = inset * u;
    ctx.strokeStyle = C.P.vurgu;
    ctx.lineWidth = Math.max(1, 2 * u);
    ctx.strokeRect(m, m, C.W - m * 2, C.H - m * 2);
    if (ikiqat) {
      var m2 = m + 9 * u;
      ctx.lineWidth = Math.max(1, 1 * u);
      ctx.globalAlpha = 0.6;
      ctx.strokeRect(m2, m2, C.W - m2 * 2, C.H - m2 * 2);
      ctx.globalAlpha = 1;
    }
  }

  /* Künc naxışı — dörd küncdə güzgü şəklində. */
  function kuncNaxis(C, inset, uz) {
    var ctx = C.ctx, u = C.u, m = inset * u, L = uz * u;
    ctx.strokeStyle = C.P.vurgu;
    ctx.lineWidth = Math.max(1, 1.6 * u);
    var kuncler = [[m, m, 1, 1], [C.W - m, m, -1, 1], [m, C.H - m, 1, -1], [C.W - m, C.H - m, -1, -1]];
    for (var i = 0; i < 4; i++) {
      var k = kuncler[i];
      ctx.beginPath();
      ctx.moveTo(k[0] + k[2] * L, k[1]);
      ctx.lineTo(k[0], k[1]);
      ctx.lineTo(k[0], k[1] + k[3] * L);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(k[0] + k[2] * L * 0.28, k[1] + k[3] * L * 0.28, 3.2 * u, 0, Math.PI * 2);
      ctx.fillStyle = C.P.vurgu;
      ctx.fill();
    }
  }

  /* Ayırıcı — ortasında romb olan iki xətt. */
  function ayirici(C, cx, y, w, reng) {
    var ctx = C.ctx, u = C.u, h = w / 2, d = 5 * u;
    ctx.strokeStyle = reng || C.P.vurgu;
    ctx.fillStyle = reng || C.P.vurgu;
    ctx.lineWidth = Math.max(1, 1.2 * u);
    ctx.beginPath();
    ctx.moveTo(cx - h, y); ctx.lineTo(cx - d * 2, y);
    ctx.moveTo(cx + d * 2, y); ctx.lineTo(cx + h, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx, y - d); ctx.lineTo(cx + d, y); ctx.lineTo(cx, y + d); ctx.lineTo(cx - d, y);
    ctx.closePath(); ctx.fill();
  }

  function ulduz(ctx, cx, cy, r, uc) {
    uc = uc || 5;
    ctx.beginPath();
    for (var i = 0; i < uc * 2; i++) {
      var a = -Math.PI / 2 + i * Math.PI / uc, rr = i % 2 ? r * 0.42 : r;
      ctx[i ? 'lineTo' : 'moveTo'](cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
    }
    ctx.closePath();
  }

  function qarDenesi(ctx, cx, cy, r) {
    ctx.beginPath();
    for (var i = 0; i < 6; i++) {
      var a = i * Math.PI / 3;
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
      ctx.moveTo(cx + Math.cos(a) * r * 0.6, cy + Math.sin(a) * r * 0.6);
      ctx.lineTo(cx + Math.cos(a) * r * 0.6 + Math.cos(a + 0.9) * r * 0.3,
                 cy + Math.sin(a) * r * 0.6 + Math.sin(a + 0.9) * r * 0.3);
      ctx.moveTo(cx + Math.cos(a) * r * 0.6, cy + Math.sin(a) * r * 0.6);
      ctx.lineTo(cx + Math.cos(a) * r * 0.6 + Math.cos(a - 0.9) * r * 0.3,
                 cy + Math.sin(a) * r * 0.6 + Math.sin(a - 0.9) * r * 0.3);
    }
    ctx.stroke();
  }

  /* --- Motivlər — ümumi mövzular, brendsiz, vektor --------------------- */
  var MOTIF = {
    kosmos: function (C, x, y, s) {
      var ctx = C.ctx, P = C.P, r = rng(C.seed + 7);
      ctx.save();
      ctx.fillStyle = P.vurgu;
      for (var i = 0; i < 22; i++) ulduz(ctx, x - s + r() * s * 2, y - s * 0.6 + r() * s * 1.2, s * (0.02 + r() * 0.04)), ctx.fill();
      /* raket */
      ctx.translate(x, y); ctx.rotate(-0.35);
      ctx.fillStyle = P.vurgu;
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.42); ctx.quadraticCurveTo(s * 0.17, -s * 0.1, s * 0.14, s * 0.24);
      ctx.lineTo(-s * 0.14, s * 0.24); ctx.quadraticCurveTo(-s * 0.17, -s * 0.1, 0, -s * 0.42);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = P.kagiz;
      ctx.beginPath(); ctx.arc(0, -s * 0.09, s * 0.075, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = P.murekkeb2;
      ctx.beginPath();
      ctx.moveTo(-s * 0.14, s * 0.1); ctx.lineTo(-s * 0.3, s * 0.3); ctx.lineTo(-s * 0.14, s * 0.24);
      ctx.moveTo(s * 0.14, s * 0.1); ctx.lineTo(s * 0.3, s * 0.3); ctx.lineTo(s * 0.14, s * 0.24);
      ctx.fill();
      ctx.restore();
      /* planet */
      ctx.save();
      ctx.strokeStyle = P.vurgu; ctx.lineWidth = Math.max(1, 2 * C.u);
      ctx.beginPath(); ctx.arc(x + s * 0.72, y + s * 0.3, s * 0.16, 0, Math.PI * 2); ctx.stroke();
      ctx.translate(x + s * 0.72, y + s * 0.3); ctx.rotate(-0.4); ctx.scale(1, 0.32);
      ctx.beginPath(); ctx.arc(0, 0, s * 0.27, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    },
    dinozavr: function (C, x, y, s) {
      var ctx = C.ctx, P = C.P;
      ctx.save(); ctx.translate(x, y);
      ctx.fillStyle = P.vurgu;
      ctx.beginPath();
      ctx.moveTo(-s * 0.55, s * 0.3);
      ctx.quadraticCurveTo(-s * 0.42, -s * 0.05, -s * 0.1, -s * 0.12);
      ctx.quadraticCurveTo(0, -s * 0.4, s * 0.22, -s * 0.32);
      ctx.quadraticCurveTo(s * 0.42, -s * 0.26, s * 0.4, -s * 0.05);
      ctx.quadraticCurveTo(s * 0.38, s * 0.16, s * 0.16, s * 0.2);
      ctx.lineTo(s * 0.16, s * 0.3); ctx.lineTo(s * 0.05, s * 0.3);
      ctx.lineTo(s * 0.05, s * 0.2); ctx.lineTo(-s * 0.12, s * 0.2);
      ctx.lineTo(-s * 0.12, s * 0.3); ctx.lineTo(-s * 0.24, s * 0.3);
      ctx.quadraticCurveTo(-s * 0.3, s * 0.2, -s * 0.55, s * 0.3);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = P.kagiz;
      ctx.beginPath(); ctx.arc(s * 0.26, -s * 0.2, s * 0.032, 0, Math.PI * 2); ctx.fill();
      /* kürək lövhələri */
      ctx.fillStyle = P.murekkeb2;
      for (var i = 0; i < 4; i++) {
        var px = -s * 0.3 + i * s * 0.11;
        ctx.beginPath();
        ctx.moveTo(px, -s * 0.11 - i * s * 0.03);
        ctx.lineTo(px + s * 0.05, -s * 0.24 - i * s * 0.03);
        ctx.lineTo(px + s * 0.1, -s * 0.11 - i * s * 0.03);
        ctx.closePath(); ctx.fill();
      }
      ctx.restore();
    },
    deniz: function (C, x, y, s) {
      var ctx = C.ctx, P = C.P;
      ctx.save();
      ctx.strokeStyle = P.vurgu; ctx.lineWidth = Math.max(1, 3 * C.u);
      for (var j = 0; j < 3; j++) {
        ctx.globalAlpha = 1 - j * 0.28;
        ctx.beginPath();
        for (var i = -1; i <= 1.01; i += 0.02) {
          var px = x + i * s, py = y + s * 0.22 + j * s * 0.13 + Math.sin(i * 7) * s * 0.045;
          if (i === -1) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      /* balıq */
      ctx.fillStyle = P.vurgu;
      ctx.beginPath();
      ctx.moveTo(x - s * 0.34, y - s * 0.12);
      ctx.quadraticCurveTo(x, y - s * 0.34, x + s * 0.26, y - s * 0.12);
      ctx.quadraticCurveTo(x, y + s * 0.1, x - s * 0.34, y - s * 0.12);
      ctx.closePath(); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x + s * 0.24, y - s * 0.12);
      ctx.lineTo(x + s * 0.42, y - s * 0.26);
      ctx.lineTo(x + s * 0.42, y + s * 0.02);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = P.kagiz;
      ctx.beginPath(); ctx.arc(x - s * 0.18, y - s * 0.15, s * 0.028, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    },
    heyvanlar: function (C, x, y, s) {
      var ctx = C.ctx, P = C.P;
      ctx.save();
      /* ayı üzü */
      ctx.fillStyle = P.vurgu;
      ctx.beginPath(); ctx.arc(x - s * 0.36, y - s * 0.2, s * 0.1, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(x - s * 0.04, y - s * 0.2, s * 0.1, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(x - s * 0.2, y, s * 0.24, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = P.kagiz;
      ctx.beginPath(); ctx.arc(x - s * 0.27, y - s * 0.05, s * 0.03, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(x - s * 0.13, y - s * 0.05, s * 0.03, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(x - s * 0.2, y + s * 0.07, s * 0.05, s * 0.035, 0, 0, Math.PI * 2); ctx.fill();
      /* dovşan */
      ctx.fillStyle = P.murekkeb2;
      ctx.beginPath(); ctx.ellipse(x + s * 0.34, y - s * 0.22, s * 0.045, s * 0.13, -0.2, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(x + s * 0.48, y - s * 0.22, s * 0.045, s * 0.13, 0.2, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(x + s * 0.41, y, s * 0.17, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = P.kagiz;
      ctx.beginPath(); ctx.arc(x + s * 0.35, y - s * 0.03, s * 0.024, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(x + s * 0.47, y - s * 0.03, s * 0.024, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    },
    nagil: function (C, x, y, s) {
      var ctx = C.ctx, P = C.P;
      ctx.save();
      ctx.fillStyle = P.vurgu;
      /* tac */
      ctx.beginPath();
      ctx.moveTo(x - s * 0.34, y + s * 0.16);
      ctx.lineTo(x - s * 0.42, y - s * 0.2);
      ctx.lineTo(x - s * 0.17, y - s * 0.02);
      ctx.lineTo(x, y - s * 0.28);
      ctx.lineTo(x + s * 0.17, y - s * 0.02);
      ctx.lineTo(x + s * 0.42, y - s * 0.2);
      ctx.lineTo(x + s * 0.34, y + s * 0.16);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = P.kagiz;
      for (var i = -1; i <= 1; i++) {
        ctx.beginPath(); ctx.arc(x + i * s * 0.19, y + s * 0.04, s * 0.033, 0, Math.PI * 2); ctx.fill();
      }
      ctx.fillStyle = P.murekkeb2;
      ulduz(ctx, x - s * 0.6, y - s * 0.2, s * 0.07); ctx.fill();
      ulduz(ctx, x + s * 0.62, y - s * 0.12, s * 0.055); ctx.fill();
      ctx.restore();
    },
    avtomobil: function (C, x, y, s) {
      var ctx = C.ctx, P = C.P;
      ctx.save();
      ctx.fillStyle = P.vurgu;
      ctx.beginPath();
      ctx.moveTo(x - s * 0.52, y + s * 0.12);
      ctx.quadraticCurveTo(x - s * 0.5, y - s * 0.04, x - s * 0.3, y - s * 0.06);
      ctx.quadraticCurveTo(x - s * 0.18, y - s * 0.3, x + s * 0.06, y - s * 0.3);
      ctx.quadraticCurveTo(x + s * 0.28, y - s * 0.3, x + s * 0.36, y - s * 0.06);
      ctx.quadraticCurveTo(x + s * 0.52, y - s * 0.03, x + s * 0.52, y + s * 0.12);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = P.kagiz;
      ctx.beginPath();
      ctx.moveTo(x - s * 0.22, y - s * 0.09); ctx.quadraticCurveTo(x - s * 0.14, y - s * 0.25, x - s * 0.01, y - s * 0.25);
      ctx.lineTo(x - s * 0.01, y - s * 0.09); ctx.closePath(); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x + s * 0.05, y - s * 0.25); ctx.quadraticCurveTo(x + s * 0.2, y - s * 0.24, x + s * 0.28, y - s * 0.09);
      ctx.lineTo(x + s * 0.05, y - s * 0.09); ctx.closePath(); ctx.fill();
      ctx.fillStyle = P.murekkeb;
      ctx.beginPath(); ctx.arc(x - s * 0.28, y + s * 0.14, s * 0.11, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(x + s * 0.3, y + s * 0.14, s * 0.11, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = P.kagiz;
      ctx.beginPath(); ctx.arc(x - s * 0.28, y + s * 0.14, s * 0.045, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(x + s * 0.3, y + s * 0.14, s * 0.045, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    },
    cicek: function (C, x, y, s) {
      var ctx = C.ctx, P = C.P, i, k;
      ctx.save();
      ctx.strokeStyle = P.vurgu; ctx.lineWidth = Math.max(1, 1.8 * C.u);
      for (k = -1; k <= 1; k += 2) {
        ctx.beginPath();
        ctx.moveTo(x, y + s * 0.16);
        ctx.quadraticCurveTo(x + k * s * 0.3, y + s * 0.05, x + k * s * 0.62, y - s * 0.14);
        ctx.stroke();
        for (i = 1; i <= 3; i++) {
          var t = i / 3.4, px = x + k * s * 0.62 * t, py = y + s * 0.16 - s * 0.3 * t * t - s * 0.02;
          ctx.beginPath();
          ctx.ellipse(px, py, s * 0.075, s * 0.035, k * (-0.5 - t), 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      ctx.fillStyle = P.vurgu;
      for (i = 0; i < 6; i++) {
        var a = i * Math.PI / 3;
        ctx.beginPath();
        ctx.ellipse(x + Math.cos(a) * s * 0.11, y - s * 0.12 + Math.sin(a) * s * 0.11, s * 0.08, s * 0.05, a, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = P.kagiz;
      ctx.beginPath(); ctx.arc(x, y - s * 0.12, s * 0.06, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
  };

  /* --- Məzmun sətirləri -------------------------------------------------- */
  function eventOf(id) {
    for (var i = 0; i < EVENTS.length; i++) if (EVENTS[i].id === id) return EVENTS[i];
    return EVENTS[0] || { id: '', ad: '', ust: 'DƏVƏTNAMƏ', nisan: '◆' };
  }
  function designOf(id) {
    for (var i = 0; i < DESIGNS.length; i++) if (DESIGNS[i].id === id) return DESIGNS[i];
    return DESIGNS[0];
  }

  var AYLAR = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun', 'İyul',
               'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'];
  var GUNLER = ['Bazar', 'Bazar ertəsi', 'Çərşənbə axşamı', 'Çərşənbə',
                'Cümə axşamı', 'Cümə', 'Şənbə'];

  /* '2026-08-30' → '30 Avqust 2026, Şənbə'. Saat ayrıca sətirdir. */
  function tarixSetri(iso) {
    if (!iso) return '';
    var m = String(iso).match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!m) return String(iso);
    var d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
    return (+m[3]) + ' ' + AYLAR[+m[2] - 1] + ' ' + m[1] + ', ' + GUNLER[d.getUTCDay()];
  }
  function saatSetri(hhmm) {
    if (!hhmm) return '';
    var m = String(hhmm).match(/^(\d{1,2}):(\d{2})/);
    return m ? ('saat ' + (m[1].length < 2 ? '0' + m[1] : m[1]) + ':' + m[2]) : String(hhmm);
  }

  /* --- Üslublar ---------------------------------------------------------
     Hər üslub fonu, bəzəyi və yığını özü çəkir. Ortaq olan yalnız
     cizYigin() və bəzək köməkçiləridir. */

  function qutu(C, pad) {
    var m = pad * C.u;
    return { x: m, y: m, w: C.W - m * 2, h: C.H - m * 2, align: 'center' };
  }

  function ustSetir(C, t, size) {
    return { s: upper(t), fam: F.sans, weight: 600, size: size * C.u,
             reng: C.P.murekkeb2, ls: 6 * C.u, gap: 0, maxLines: 1, tekSetir: true };
  }

  function tarixBloku(C, S, size, reng, fam) {
    var out = [];
    fam = fam || F.sans;
    if (S.tarix) out.push({ s: S.tarix, fam: fam, weight: 600, size: size * C.u,
                            reng: reng || C.P.murekkeb, gap: 0, maxLines: 2 });
    if (S.saat) out.push({ s: S.saat, fam: fam, weight: 400, size: size * 0.86 * C.u,
                           reng: reng || C.P.murekkeb2, gap: 8 * C.u, maxLines: 1 });
    return out;
  }

  function mekanBloku(C, S, size, fam) {
    var out = [];
    if (S.mekan) out.push({ s: S.mekan, fam: fam || F.serif, weight: 600, size: size * C.u,
                            reng: C.P.murekkeb, gap: 0, maxLines: 2 });
    if (S.unvan) out.push({ s: S.unvan, fam: F.sans, weight: 400, size: size * 0.66 * C.u,
                            reng: C.P.murekkeb2, gap: 8 * C.u, maxLines: 2 });
    return out;
  }

  function altBloku(C, S, size, fam) {
    var out = [];
    if (S.qeyd) out.push({ s: S.qeyd, fam: fam || F.serif, weight: 400, size: size * C.u,
                           reng: C.P.murekkeb2, gap: 26 * C.u, maxLines: 2 });
    if (S.telefon) out.push({ s: S.telefon, fam: F.sans, weight: 600, size: size * 0.9 * C.u,
                              reng: C.P.vurgu, gap: 14 * C.u, maxLines: 1, ls: 1 * C.u });
    return out;
  }

  function qonaqSetri(C, S, size, fam) {
    if (!S.qonaq) return [];
    return [{ s: S.qonaq, fam: fam || F.serif, weight: 400, size: size * C.u,
              reng: C.P.murekkeb2, gap: 0, maxLines: 1 }];
  }

  var STYLE = {

    klassik: function (C, S) {
      fonDoldur(C, false); toxuma(C, 0.045);
      cerceve(C, 44, true);
      var b = qutu(C, 96), it = [];
      it = it.concat(qonaqSetri(C, S, 26));
      it.push(ustSetir(C, S.ust, 23)); it[it.length - 1].gap = S.qonaq ? 26 * C.u : 0;
      it.push({ tip: 'orn', h: 30 * C.u, gap: 22 * C.u, ciz: function (Cx, ax, y) { ayirici(Cx, ax, y + 15 * Cx.u, 130 * Cx.u); } });
      it.push({ s: S.adlar, fam: F.display, weight: 700, size: 80 * C.u, reng: C.P.murekkeb,
                gap: 18 * C.u, maxLines: 2, lh: 1.16 });
      if (S.baslik) it.push({ s: S.baslik, fam: F.serif, weight: 400, size: 32 * C.u,
                              reng: C.P.murekkeb2, gap: 22 * C.u, maxLines: 2 });
      it.push({ tip: 'orn', h: 30 * C.u, gap: 30 * C.u, ciz: function (Cx, ax, y) { ayirici(Cx, ax, y + 15 * Cx.u, 130 * Cx.u); } });
      it = it.concat(tarixBloku(C, S, 33));
      it.push({ tip: 'ara', h: 22 * C.u });
      it = it.concat(mekanBloku(C, S, 37));
      it = it.concat(altBloku(C, S, 25));
      cizYigin(C, it, b);
    },

    zerif: function (C, S) {
      fonDoldur(C, true); toxuma(C, 0.035);
      kuncNaxis(C, 52, 78);
      var b = qutu(C, 108), it = [];
      it = it.concat(qonaqSetri(C, S, 26));
      it.push(ustSetir(C, S.ust, 20)); it[it.length - 1].gap = S.qonaq ? 24 * C.u : 0;
      it.push({ s: S.adlar, fam: F.script, weight: 400, size: 118 * C.u, reng: C.P.vurgu,
                gap: 28 * C.u, maxLines: 2, lh: 1.14 });
      if (S.baslik) it.push({ s: S.baslik, fam: F.serif, weight: 400, size: 31 * C.u,
                              reng: C.P.murekkeb2, gap: 18 * C.u, maxLines: 2 });
      it.push({ tip: 'orn', h: 26 * C.u, gap: 30 * C.u, ciz: function (Cx, ax, y) { ayirici(Cx, ax, y + 13 * Cx.u, 110 * Cx.u); } });
      it = it.concat(tarixBloku(C, S, 32));
      it.push({ tip: 'ara', h: 20 * C.u });
      it = it.concat(mekanBloku(C, S, 35));
      it = it.concat(altBloku(C, S, 24));
      cizYigin(C, it, b);
    },

    modern: function (C, S) {
      fonDoldur(C, false);
      var ctx = C.ctx, u = C.u;
      /* tək aksent zolağı — sol kənar */
      ctx.fillStyle = C.P.vurgu;
      ctx.fillRect(56 * u, 56 * u, 7 * u, C.H - 112 * u);
      var m = 96 * u;
      var b = { x: m, y: 86 * u, w: C.W - m - 62 * u, h: C.H - 172 * u, align: 'left' };
      var it = [];
      it = it.concat(qonaqSetri(C, S, 25, F.sans));
      it.push(ustSetir(C, S.ust, 21)); it[it.length - 1].gap = S.qonaq ? 22 * C.u : 0;
      it[it.length - 1].reng = C.P.vurgu;
      it.push({ s: S.adlar, fam: F.sans, weight: 800, size: 74 * u, reng: C.P.murekkeb,
                gap: 26 * u, maxLines: 3, lh: 1.1 });
      if (S.baslik) it.push({ s: S.baslik, fam: F.sans, weight: 400, size: 30 * u,
                              reng: C.P.murekkeb2, gap: 20 * u, maxLines: 3 });
      it.push({ tip: 'orn', h: 3 * u, gap: 34 * u, ciz: function (Cx, ax, y, bx) {
        Cx.ctx.fillStyle = Cx.P.xett; Cx.ctx.fillRect(bx.x, y, bx.w * 0.34, Math.max(1, 3 * Cx.u)); } });
      it = it.concat(tarixBloku(C, S, 33));
      it.push({ tip: 'ara', h: 20 * u });
      it = it.concat(mekanBloku(C, S, 35, F.sans));
      it = it.concat(altBloku(C, S, 24, F.sans));
      cizYigin(C, it, b);
    },

    rengli: function (C, S) {
      var ctx = C.ctx, u = C.u, P = C.P;
      var g = ctx.createLinearGradient(0, 0, C.W * 0.5, C.H);
      g.addColorStop(0, P.qara ? P.kagiz2 : P.vurgu);
      g.addColorStop(1, P.qara ? P.kagiz : P.vurguSoft);
      ctx.fillStyle = g; ctx.fillRect(0, 0, C.W, C.H);
      /* iç kart */
      var m = 54 * u;
      ctx.fillStyle = P.qara ? P.kagiz : P.kagiz;
      ctx.globalAlpha = P.qara ? 0.14 : 0.95;
      ctx.fillRect(m, m, C.W - m * 2, C.H - m * 2);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = P.qara ? P.vurgu : P.vurgu;
      ctx.lineWidth = Math.max(1, 1.5 * u);
      ctx.strokeRect(m + 12 * u, m + 12 * u, C.W - (m + 12 * u) * 2, C.H - (m + 12 * u) * 2);

      var b = qutu(C, 122), it = [];
      it = it.concat(qonaqSetri(C, S, 26));
      it.push(ustSetir(C, S.ust, 22)); it[it.length - 1].gap = S.qonaq ? 24 * u : 0;
      it[it.length - 1].reng = P.vurgu;
      it.push({ s: S.adlar, fam: F.display, weight: 700, size: 88 * u, reng: P.murekkeb,
                gap: 24 * u, maxLines: 2, lh: 1.12 });
      if (S.baslik) it.push({ s: S.baslik, fam: F.serif, weight: 400, size: 32 * u,
                              reng: P.murekkeb2, gap: 20 * u, maxLines: 2 });
      it.push({ tip: 'orn', h: 26 * u, gap: 28 * u, ciz: function (Cx, ax, y) { ayirici(Cx, ax, y + 13 * Cx.u, 120 * Cx.u); } });
      it = it.concat(tarixBloku(C, S, 34));
      it.push({ tip: 'ara', h: 20 * u });
      it = it.concat(mekanBloku(C, S, 36));
      it = it.concat(altBloku(C, S, 24));
      cizYigin(C, it, b);
    },

    motiv: function (C, S, des) {
      fonDoldur(C, true);
      var u = C.u, ctx = C.ctx, P = C.P;
      /* yuxarı və aşağı motiv zolağı */
      var mf = MOTIF[des.motiv] || MOTIF.cicek;
      mf(C, C.W / 2, C.H * 0.155, C.W * 0.2);
      ctx.save(); ctx.globalAlpha = 0.5;
      mf(C, C.W / 2, C.H * 0.875, C.W * 0.12);
      ctx.restore();
      /* nöqtəli haşiyə */
      ctx.strokeStyle = P.xett; ctx.lineWidth = Math.max(1, 2 * u);
      if (ctx.setLineDash) ctx.setLineDash([6 * u, 7 * u]);
      ctx.strokeRect(34 * u, 34 * u, C.W - 68 * u, C.H - 68 * u);
      if (ctx.setLineDash) ctx.setLineDash([]);

      var b = { x: 84 * u, y: C.H * 0.27, w: C.W - 168 * u, h: C.H * 0.52, align: 'center' };
      var it = [];
      it = it.concat(qonaqSetri(C, S, 27, F.yumsaq));
      it.push(ustSetir(C, S.ust, 22)); it[it.length - 1].gap = S.qonaq ? 22 * u : 0;
      it[it.length - 1].reng = P.vurgu;
      it.push({ s: S.adlar, fam: F.yumsaq, weight: 700, size: 80 * u, reng: P.murekkeb,
                gap: 20 * u, maxLines: 2, lh: 1.14 });
      if (S.baslik) it.push({ s: S.baslik, fam: F.yumsaq, weight: 500, size: 31 * u,
                              reng: P.murekkeb2, gap: 16 * u, maxLines: 2 });
      it.push({ tip: 'ara', h: 22 * u });
      it = it.concat(tarixBloku(C, S, 33, null, F.yumsaq));
      it.push({ tip: 'ara', h: 18 * u });
      it = it.concat(mekanBloku(C, S, 35, F.yumsaq));
      it = it.concat(altBloku(C, S, 24, F.yumsaq));
      cizYigin(C, it, b);
    },

    korporativ: function (C, S) {
      var ctx = C.ctx, u = C.u, P = C.P;
      fonDoldur(C, false);
      /* üst zolaq */
      ctx.fillStyle = P.vurgu;
      ctx.fillRect(0, 0, C.W, 14 * u);
      ctx.strokeStyle = P.xett; ctx.lineWidth = Math.max(1, 1 * u);
      ctx.beginPath(); ctx.moveTo(72 * u, C.H - 96 * u); ctx.lineTo(C.W - 72 * u, C.H - 96 * u); ctx.stroke();

      var b = { x: 84 * u, y: 96 * u, w: C.W - 168 * u, h: C.H - 220 * u, align: 'left' };
      var it = [];
      it = it.concat(qonaqSetri(C, S, 25, F.sans));
      it.push(ustSetir(C, S.ust, 20)); it[it.length - 1].gap = S.qonaq ? 20 * u : 0;
      it[it.length - 1].reng = P.vurgu;
      it.push({ s: S.adlar, fam: F.sans, weight: 600, size: 64 * u, reng: P.murekkeb,
                gap: 22 * u, maxLines: 3, lh: 1.16 });
      if (S.baslik) it.push({ s: S.baslik, fam: F.sans, weight: 400, size: 29 * u,
                              reng: P.murekkeb2, gap: 18 * u, maxLines: 3 });
      it.push({ tip: 'orn', h: 2 * u, gap: 32 * u, ciz: function (Cx, ax, y, bx) {
        Cx.ctx.fillStyle = Cx.P.xett; Cx.ctx.fillRect(bx.x, y, bx.w, Math.max(1, 2 * Cx.u)); } });
      it = it.concat(tarixBloku(C, S, 31));
      it.push({ tip: 'ara', h: 18 * u });
      it = it.concat(mekanBloku(C, S, 33, F.sans));
      it = it.concat(altBloku(C, S, 23, F.sans));
      cizYigin(C, it, b);
    }
  };

  /* --- Su nişanı --------------------------------------------------------
     Pulsuz önizləmə üçün. Neytral söz — brend sözü yoxdur. */
  function suNisani(C) {
    var ctx = C.ctx, u = C.u;
    ctx.save();
    ctx.globalAlpha = C.P.qara ? 0.16 : 0.13;
    ctx.fillStyle = C.P.murekkeb;
    ctx.font = font(30 * u, 700, F.sans);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.translate(C.W / 2, C.H / 2);
    ctx.rotate(-Math.PI / 5);
    var step = 150 * u, n = Math.ceil(Math.max(C.W, C.H) / step) + 2;
    for (var r = -n; r <= n; r++) {
      for (var c = -n; c <= n; c++) {
        cizSetir(ctx, 'NÜMUNƏ', c * step * 1.9, r * step, 8 * u, 'center');
      }
    }
    ctx.restore();
  }

  /* --- Giriş nöqtəsi ---------------------------------------------------- */

  function kontekst(ctx, inv, w, h, ratio) {
    var des = designOf(inv.design);
    var P = PALETTES[inv.palette || (des && des.palette)] || PALETTES.qizil;
    return { ctx: ctx, W: w, H: h, r: ratio, P: P, des: des,
             u: w / 1000, seed: hash((inv.design || '') + '|' + (inv.hosts || '') + '|' + (inv.venue || '')) };
  }

  function mezmun(inv) {
    var ev = eventOf(inv.event);
    return {
      qonaq:   inv.guest ? ('Əziz ' + String(inv.guest).trim() + ',') : '',
      ust:     inv.ust || ev.ust,
      adlar:   inv.hosts || '',
      baslik:  inv.title || '',
      tarix:   inv.dateText != null ? inv.dateText : tarixSetri(inv.date),
      saat:    inv.timeText != null ? inv.timeText : saatSetri(inv.time),
      mekan:   inv.venue || '',
      unvan:   inv.address || '',
      telefon: inv.phone || '',
      qeyd:    inv.note || ''
    };
  }

  /**
   * ctx  — 2D kontekst; ölçüsü artıq təyin edilmiş canvas
   * inv  — {design, palette, event, guest, hosts, title, date, time, venue, address, phone, note}
   * opts — {ratio:'kart'|'kvadrat'|'hekaye', suNisani:bool}
   */
  function draw(ctx, inv, opts) {
    opts = opts || {};
    var r = RATIOS[opts.ratio] || RATIOS.kart;
    var C = kontekst(ctx, inv, r.w, r.h, opts.ratio || 'kart');
    var S = mezmun(inv);
    ctx.save();
    ctx.textBaseline = 'top';
    (STYLE[C.des && C.des.style] || STYLE.klassik)(C, S, C.des);
    ctx.restore();
    if (opts.suNisani) suNisani(C);
    return C;
  }

  /* WhatsApp önizləməsi. ÜNVAN VƏ TELEFON BURADA YOXDUR — link önizləməsi
     hər kəsin söhbətində görünür, məkan və nömrə isə yalnız linki açan
     qonağa aiddir. */
  function drawOg(ctx, inv) {
    var C = kontekst(ctx, inv, OG.w, OG.h, 'og');
    var S = mezmun(inv), u = C.u, P = C.P;
    ctx.save();
    ctx.textBaseline = 'top';
    if (C.des && C.des.style === 'rengli') {
      var g = ctx.createLinearGradient(0, 0, OG.w * 0.6, OG.h);
      g.addColorStop(0, P.qara ? P.kagiz2 : P.vurguSoft);
      g.addColorStop(1, P.kagiz);
      ctx.fillStyle = g; ctx.fillRect(0, 0, OG.w, OG.h);
    } else { fonDoldur(C, true); }
    ctx.fillStyle = P.vurgu; ctx.fillRect(0, 0, OG.w, 9 * u);
    kuncNaxis(C, 26, 34);

    var it = [];
    it.push(ustSetir(C, S.ust, 21));
    it.push({ s: S.adlar, fam: C.des && C.des.style === 'motiv' ? F.yumsaq : F.display,
              weight: 700, size: 62 * u, reng: P.murekkeb, gap: 22 * u, maxLines: 2, lh: 1.12 });
    if (S.tarix) it.push({ s: S.tarix + (S.saat ? ' · ' + S.saat : ''), fam: F.sans, weight: 600,
                           size: 24 * u, reng: P.murekkeb2, gap: 24 * u, maxLines: 1 });
    cizYigin(C, it, { x: 60 * u, y: 60 * u, w: OG.w - 120 * u, h: OG.h - 120 * u, align: 'center' });
    ctx.restore();
    return C;
  }

  root.DAVET = {
    draw: draw, drawOg: drawOg, ready: ready,
    RATIOS: RATIOS, OG: OG, FONTS: F,
    designOf: designOf, eventOf: eventOf,
    tarixSetri: tarixSetri, saatSetri: saatSetri,
    upper: upper, MOTIF: MOTIF
  };
})(typeof window !== 'undefined' ? window : this);
