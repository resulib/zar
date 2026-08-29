/* WOFF2 / TTF / OTF faylından cmap cədvəlini oxuyur və əhatə olunan kod
   nöqtələrini qaytarır. Xarici asılılıq yoxdur — WOFF2 gövdəsi brotli ilə
   sıxılıb, Node-un zlib modulunda brotliDecompressSync var, `cmap` isə
   WOFF2-də transformasiya olunmayan cədvəldir, yəni olduğu kimi oxunur.

   Layihədə PDF, QR və Code-39 də əl ilə yazılıb — eyni prinsip. */
'use strict';
const zlib = require('zlib');

/* WOFF2 spesifikasiyasındakı tanınan teq siyahısı (0..62). cmap = 0. */
const KNOWN_TAGS = [
  'cmap', 'head', 'hhea', 'hmtx', 'maxp', 'name', 'OS/2', 'post', 'cvt ', 'fpgm',
  'glyf', 'loca', 'prep', 'CFF ', 'VORG', 'EBDT', 'EBLC', 'gasp', 'hdmx', 'kern',
  'LTSH', 'PCLT', 'VDMX', 'vhea', 'vmtx', 'BASE', 'GDEF', 'GPOS', 'GSUB', 'EBSC',
  'JSTF', 'MATH', 'CBDT', 'CBLC', 'COLR', 'CPAL', 'SVG ', 'sbix', 'acnt', 'avar',
  'bdat', 'bloc', 'bsln', 'cvar', 'fdsc', 'feat', 'fmtx', 'fvar', 'gvar', 'hsty',
  'just', 'lcar', 'mort', 'morx', 'opbd', 'prop', 'trak', 'Zapf', 'Silf', 'Glat',
  'Gloc', 'Feat', 'Sill'
];

/* UIntBase128: hər baytın aşağı 7 biti dəyər, yuxarı bit davam nişanıdır. */
function uintBase128(buf, pos) {
  let v = 0;
  for (let i = 0; i < 5; i++) {
    const b = buf[pos.i++];
    if (b === undefined) throw new Error('UIntBase128 kəsilib');
    if (i === 0 && b === 0x80) throw new Error('UIntBase128 sıfırla başlayır');
    if (v & 0xfe000000) throw new Error('UIntBase128 daşıb');
    v = (v << 7) | (b & 0x7f);
    if (!(b & 0x80)) return v >>> 0;
  }
  throw new Error('UIntBase128 çox uzundur');
}

/* WOFF2 → { tag: Buffer } (yalnız transformasiya olunmamış cədvəllər etibarlıdır) */
function woff2Tables(buf) {
  if (buf.toString('latin1', 0, 4) !== 'wOF2') throw new Error('wOF2 imzası yoxdur');
  const numTables = buf.readUInt16BE(12);
  const totalCompressed = buf.readUInt32BE(20);
  const flavor = buf.toString('latin1', 4, 8);

  const pos = { i: 48 };
  const dir = [];
  for (let n = 0; n < numTables; n++) {
    const flags = buf[pos.i++];
    const idx = flags & 0x3f;
    const transform = (flags >> 6) & 0x03;
    let tag;
    if (idx === 0x3f) { tag = buf.toString('latin1', pos.i, pos.i + 4); pos.i += 4; }
    else { tag = KNOWN_TAGS[idx] || ('?' + idx); }

    const origLength = uintBase128(buf, pos);
    /* glyf/loca üçün 0 = transformasiya olunub, 3 = yox.
       Digər cədvəllərdə əksi: 0 = transformasiya yoxdur. */
    const transformed = (tag === 'glyf' || tag === 'loca') ? transform !== 3 : transform !== 0;
    const length = transformed ? uintBase128(buf, pos) : origLength;
    dir.push({ tag, length, transformed });
  }

  if (flavor === 'ttcf') throw new Error('şrift kolleksiyası dəstəklənmir');

  const body = zlib.brotliDecompressSync(buf.subarray(pos.i, pos.i + totalCompressed));

  const out = {};
  let off = 0;
  for (const t of dir) {
    if (!t.transformed) out[t.tag] = body.subarray(off, off + t.length);
    off += t.length;
  }
  return out;
}

/* Adi sfnt (ttf/otf) → { tag: Buffer } */
function sfntTables(buf) {
  const numTables = buf.readUInt16BE(4);
  const out = {};
  for (let n = 0; n < numTables; n++) {
    const p = 12 + n * 16;
    const tag = buf.toString('latin1', p, p + 4);
    out[tag] = buf.subarray(buf.readUInt32BE(p + 8), buf.readUInt32BE(p + 8) + buf.readUInt32BE(p + 12));
  }
  return out;
}

/* cmap format 4 — BMP, seqmentli */
function readFormat4(t, o, set) {
  const segX2 = t.readUInt16BE(o + 6), seg = segX2 / 2;
  const endO = o + 14, startO = endO + segX2 + 2, deltaO = startO + segX2, rangeO = deltaO + segX2;
  for (let s = 0; s < seg; s++) {
    const end = t.readUInt16BE(endO + s * 2), start = t.readUInt16BE(startO + s * 2);
    if (start > end) continue;
    const delta = t.readInt16BE(deltaO + s * 2), rangeOff = t.readUInt16BE(rangeO + s * 2);
    for (let c = start; c <= end && c !== 0xffff; c++) {
      let g;
      if (rangeOff === 0) g = (c + delta) & 0xffff;
      else {
        const gi = rangeO + s * 2 + rangeOff + (c - start) * 2;
        if (gi + 1 >= t.length) continue;
        g = t.readUInt16BE(gi);
        if (g !== 0) g = (g + delta) & 0xffff;
      }
      if (g !== 0) set.add(c);
    }
  }
}

/* cmap format 12 — tam Unicode, qruplu */
function readFormat12(t, o, set) {
  const groups = t.readUInt32BE(o + 12);
  for (let g = 0; g < groups; g++) {
    const p = o + 16 + g * 12;
    const start = t.readUInt32BE(p), end = t.readUInt32BE(p + 4), gid = t.readUInt32BE(p + 8);
    if (gid === 0) continue;
    for (let c = start; c <= end && c - start < 0x20000; c++) set.add(c);
  }
}

/** Fayl buferindən əhatə olunan kod nöqtələri (Set<number>). */
function coverage(buf) {
  const sig = buf.toString('latin1', 0, 4);
  const tables = sig === 'wOF2' ? woff2Tables(buf) : sfntTables(buf);
  const cmap = tables['cmap'];
  if (!cmap) throw new Error('cmap cədvəli yoxdur');

  const n = cmap.readUInt16BE(2);
  let best = null, bestScore = -1;
  for (let i = 0; i < n; i++) {
    const p = 4 + i * 8;
    const plat = cmap.readUInt16BE(p), enc = cmap.readUInt16BE(p + 2), off = cmap.readUInt32BE(p + 4);
    const fmt = cmap.readUInt16BE(off);
    let score = -1;
    if (plat === 3 && enc === 10 && fmt === 12) score = 4;
    else if (plat === 0 && fmt === 12) score = 3;
    else if (plat === 3 && enc === 1 && fmt === 4) score = 2;
    else if (plat === 0 && fmt === 4) score = 1;
    if (score > bestScore) { bestScore = score; best = { off, fmt }; }
  }
  if (!best) throw new Error('uyğun cmap alt-cədvəli yoxdur');

  const set = new Set();
  if (best.fmt === 12) readFormat12(cmap, best.off, set);
  else if (best.fmt === 4) readFormat4(cmap, best.off, set);
  else throw new Error('cmap format ' + best.fmt + ' dəstəklənmir');
  return set;
}

module.exports = { coverage, woff2Tables, sfntTables };
