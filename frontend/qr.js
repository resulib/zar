/* ------------------------------------------------------------------
   Minimal QR encoder — byte mode, ECC level M, versions 1..6.
   Kitabxana asılılığı yoxdur. qrMatrix(text) -> [[0|1, ...], ...]
   ------------------------------------------------------------------ */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.QRZ = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /* ---- GF(256), primitive polynomial 0x11D ---- */
  var EXP = new Uint8Array(512), LOG = new Uint8Array(256);
  (function () {
    var x = 1;
    for (var i = 0; i < 255; i++) { EXP[i] = x; LOG[x] = i; x <<= 1; if (x & 0x100) x ^= 0x11D; }
    for (var j = 255; j < 512; j++) EXP[j] = EXP[j - 255];
  })();

  function gmul(a, b) { return (a === 0 || b === 0) ? 0 : EXP[LOG[a] + LOG[b]]; }

  function rsGenPoly(deg) {
    var poly = [1];
    for (var i = 0; i < deg; i++) {
      var root = EXP[i], next = new Array(poly.length + 1).fill(0);
      for (var j = 0; j < poly.length; j++) {
        next[j] ^= poly[j];
        next[j + 1] ^= gmul(poly[j], root);
      }
      poly = next;
    }
    return poly;
  }

  function rsEncode(data, ecLen) {
    var gen = rsGenPoly(ecLen);
    var res = new Uint8Array(data.length + ecLen);
    res.set(data, 0);
    for (var i = 0; i < data.length; i++) {
      var factor = res[i];
      if (factor === 0) continue;
      for (var j = 1; j < gen.length; j++) res[i + j] ^= gmul(gen[j], factor);
      res[i] = 0;
    }
    return res.slice(data.length);
  }

  /* ---- ECC M cədvəli, v1..v6 ---- */
  var EC = {
    1: { total: 26,  ec: 10, blocks: [16] },
    2: { total: 44,  ec: 16, blocks: [28] },
    3: { total: 70,  ec: 26, blocks: [44] },
    4: { total: 100, ec: 18, blocks: [32, 32] },
    5: { total: 134, ec: 24, blocks: [43, 43] },
    6: { total: 172, ec: 16, blocks: [27, 27, 27, 27] }
  };
  var ALIGN = { 1: [], 2: [6, 18], 3: [6, 22], 4: [6, 26], 5: [6, 30], 6: [6, 34] };

  function utf8Bytes(str) {
    var out = [], enc = encodeURIComponent(str);
    for (var i = 0; i < enc.length; i++) {
      if (enc[i] === '%') { out.push(parseInt(enc.substr(i + 1, 2), 16)); i += 2; }
      else out.push(enc.charCodeAt(i));
    }
    return out;
  }

  function pickVersion(byteLen) {
    for (var v = 1; v <= 6; v++) {
      var dataCw = EC[v].blocks.reduce(function (a, b) { return a + b; }, 0);
      if (byteLen <= dataCw - 2) return v;
    }
    throw new Error('QR: mətn çox uzundur (maks ~106 bayt)');
  }

  function buildCodewords(bytes, version) {
    var spec = EC[version];
    var dataCw = spec.blocks.reduce(function (a, b) { return a + b; }, 0);
    var bits = [];
    function push(val, len) { for (var i = len - 1; i >= 0; i--) bits.push((val >>> i) & 1); }

    push(0b0100, 4);          // byte mode
    push(bytes.length, 8);    // char count (v1-9 byte mode = 8 bit)
    for (var i = 0; i < bytes.length; i++) push(bytes[i], 8);

    var cap = dataCw * 8;
    for (var t = 0; t < 4 && bits.length < cap; t++) bits.push(0);   // terminator
    while (bits.length % 8 !== 0) bits.push(0);                       // byte align

    var cw = [];
    for (var b = 0; b < bits.length; b += 8) {
      var v = 0;
      for (var k = 0; k < 8; k++) v = (v << 1) | bits[b + k];
      cw.push(v);
    }
    var pad = [0xEC, 0x11], pi = 0;
    while (cw.length < dataCw) cw.push(pad[pi++ % 2]);

    /* blok bölgüsü + ECC */
    var dataBlocks = [], ecBlocks = [], off = 0;
    for (var bi = 0; bi < spec.blocks.length; bi++) {
      var len = spec.blocks[bi];
      var blk = Uint8Array.from(cw.slice(off, off + len));
      off += len;
      dataBlocks.push(blk);
      ecBlocks.push(rsEncode(blk, spec.ec));
    }

    /* interleave */
    var out = [], maxData = Math.max.apply(null, spec.blocks);
    for (var c = 0; c < maxData; c++)
      for (var d = 0; d < dataBlocks.length; d++)
        if (c < dataBlocks[d].length) out.push(dataBlocks[d][c]);
    for (var e = 0; e < spec.ec; e++)
      for (var f = 0; f < ecBlocks.length; f++) out.push(ecBlocks[f][e]);

    return out;
  }

  function formatBits(eccBits, mask) {
    var data = (eccBits << 3) | mask, rem = data;
    for (var i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
    return ((data << 10 | rem) ^ 0x5412) & 0x7FFF;
  }

  function maskFn(m, x, y) {
    switch (m) {
      case 0: return (x + y) % 2 === 0;
      case 1: return y % 2 === 0;
      case 2: return x % 3 === 0;
      case 3: return (x + y) % 3 === 0;
      case 4: return (Math.floor(y / 2) + Math.floor(x / 3)) % 2 === 0;
      case 5: return ((x * y) % 2) + ((x * y) % 3) === 0;
      case 6: return (((x * y) % 2) + ((x * y) % 3)) % 2 === 0;
      case 7: return (((x + y) % 2) + ((x * y) % 3)) % 2 === 0;
    }
  }

  function qrMatrix(text, forceMask) {
    var bytes = utf8Bytes(text);
    var version = pickVersion(bytes.length);
    var size = version * 4 + 17;
    var mod = [], fn = [];
    for (var i = 0; i < size; i++) { mod.push(new Array(size).fill(0)); fn.push(new Array(size).fill(false)); }

    function setFn(x, y, v) { if (x >= 0 && y >= 0 && x < size && y < size) { mod[y][x] = v ? 1 : 0; fn[y][x] = true; } }

    /* finder + separator */
    [[0, 0], [size - 7, 0], [0, size - 7]].forEach(function (p) {
      for (var dy = -1; dy <= 7; dy++) for (var dx = -1; dx <= 7; dx++) {
        var xx = p[0] + dx, yy = p[1] + dy;
        if (xx < 0 || yy < 0 || xx >= size || yy >= size) continue;
        var m = Math.max(Math.abs(dx - 3), Math.abs(dy - 3));
        setFn(xx, yy, m !== 2 && m !== 4);
      }
    });

    /* timing */
    for (var t = 0; t < size; t++) { if (!fn[6][t]) setFn(t, 6, t % 2 === 0); if (!fn[t][6]) setFn(6, t, t % 2 === 0); }

    /* alignment */
    var pos = ALIGN[version];
    for (var a = 0; a < pos.length; a++) for (var b = 0; b < pos.length; b++) {
      var cx = pos[a], cy = pos[b];
      if ((cx === 6 && cy === 6) || (cx === 6 && cy === size - 7) || (cx === size - 7 && cy === 6)) continue;
      for (var dy2 = -2; dy2 <= 2; dy2++) for (var dx2 = -2; dx2 <= 2; dx2++)
        setFn(cx + dx2, cy + dy2, Math.max(Math.abs(dx2), Math.abs(dy2)) !== 1);
    }

    /* format info sahələri (dəyər sonra yazılır) */
    for (var k = 0; k <= 8; k++) { if (k !== 6) { setFn(k, 8, false); setFn(8, k, false); } }
    for (var q = 0; q < 8; q++) { setFn(size - 1 - q, 8, false); setFn(8, size - 1 - q, false); }
    setFn(8, size - 8, true); // dark module

    /* data yerləşdirmə (zigzag) */
    var cw = buildCodewords(bytes, version);
    var bitLen = cw.length * 8, bi = 0;
    function bitAt(idx) { return (cw[idx >>> 3] >>> (7 - (idx & 7))) & 1; }

    for (var right = size - 1; right >= 1; right -= 2) {
      if (right === 6) right = 5;
      for (var vert = 0; vert < size; vert++) {
        for (var j = 0; j < 2; j++) {
          var x = right - j;
          var upward = ((right + 1) & 2) === 0;
          var y = upward ? size - 1 - vert : vert;
          if (!fn[y][x] && bi < bitLen) { mod[y][x] = bitAt(bi); bi++; }
        }
      }
    }

    /* maska seçimi */
    function applyMask(m) {
      for (var y = 0; y < size; y++) for (var x = 0; x < size; x++)
        if (!fn[y][x] && maskFn(m, x, y)) mod[y][x] ^= 1;
    }
    function writeFormat(m) {
      /* setModule(x, y) -> mod[y][x] */
      var bits = formatBits(0 /* ECC M */, m);
      for (var i = 0; i <= 5; i++) mod[i][8] = (bits >>> i) & 1;
      mod[7][8] = (bits >>> 6) & 1;
      mod[8][8] = (bits >>> 7) & 1;
      mod[8][7] = (bits >>> 8) & 1;
      for (var j = 9; j <= 14; j++) mod[8][14 - j] = (bits >>> j) & 1;
      for (var k = 0; k <= 7; k++) mod[8][size - 1 - k] = (bits >>> k) & 1;
      for (var l = 8; l <= 14; l++) mod[size - 15 + l][8] = (bits >>> l) & 1;
      mod[size - 8][8] = 1;
    }
    function penalty() {
      var p = 0, dark = 0, n = size;
      /* rule 1 */
      for (var y = 0; y < n; y++) {
        var runC = 1;
        for (var x = 1; x < n; x++) {
          if (mod[y][x] === mod[y][x - 1]) { runC++; if (runC === 5) p += 3; else if (runC > 5) p += 1; }
          else runC = 1;
        }
      }
      for (var x2 = 0; x2 < n; x2++) {
        var runR = 1;
        for (var y2 = 1; y2 < n; y2++) {
          if (mod[y2][x2] === mod[y2 - 1][x2]) { runR++; if (runR === 5) p += 3; else if (runR > 5) p += 1; }
          else runR = 1;
        }
      }
      /* rule 2 */
      for (var y3 = 0; y3 < n - 1; y3++) for (var x3 = 0; x3 < n - 1; x3++) {
        var v = mod[y3][x3];
        if (v === mod[y3][x3 + 1] && v === mod[y3 + 1][x3] && v === mod[y3 + 1][x3 + 1]) p += 3;
      }
      /* rule 3 */
      var A = [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0], B = [0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1];
      function match(get, i) {
        var okA = true, okB = true;
        for (var d = 0; d < 11; d++) { var g = get(i + d); if (g !== A[d]) okA = false; if (g !== B[d]) okB = false; }
        return (okA ? 1 : 0) + (okB ? 1 : 0);
      }
      for (var y4 = 0; y4 < n; y4++) for (var x4 = 0; x4 + 11 <= n; x4++)
        p += 40 * match(function (i) { return mod[y4][i]; }, x4);
      for (var x5 = 0; x5 < n; x5++) for (var y5 = 0; y5 + 11 <= n; y5++)
        p += 40 * match(function (i) { return mod[i][x5]; }, y5);
      /* rule 4 */
      for (var y6 = 0; y6 < n; y6++) for (var x6 = 0; x6 < n; x6++) dark += mod[y6][x6];
      var pct = dark * 100 / (n * n);
      p += Math.floor(Math.abs(pct - 50) / 5) * 10;
      return p;
    }

    var best = -1, bestScore = Infinity;
    if (typeof forceMask === 'number') { applyMask(forceMask); writeFormat(forceMask); return mod; }
    for (var m2 = 0; m2 < 8; m2++) {
      applyMask(m2); writeFormat(m2);
      var s = penalty();
      if (s < bestScore) { bestScore = s; best = m2; }
      applyMask(m2); // geri qaytar
    }
    applyMask(best); writeFormat(best);

    return mod;
  }

  /* SVG <path> d atributu — modul ölçüsü 1 vahid */
  function qrPath(text) {
    var m = qrMatrix(text), d = '';
    for (var y = 0; y < m.length; y++) for (var x = 0; x < m.length; x++)
      if (m[y][x]) d += 'M' + x + ' ' + y + 'h1v1h-1z';
    return { d: d, size: m.length };
  }

  return { matrix: qrMatrix, path: qrPath };
});
