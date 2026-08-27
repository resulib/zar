/* Blade panellərinin markup-ını statik HTML kimi qurur — dizaynı Laravel olmadan
   görmək və CSS-i yoxlamaq üçün. Real səhifələr eyni sinifləri istifadə edir. */
const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, 'panel-preview');
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const CREST = `<svg class="crest" viewBox="0 0 64 64" aria-hidden="true">
  <circle cx="32" cy="32" r="30" fill="#17355d"/>
  <circle cx="32" cy="32" r="25.5" fill="none" stroke="#8fa8c6" stroke-width="1"/>
  <circle cx="32" cy="32" r="21" fill="none" stroke="#c9d6e6" stroke-width="1.6"/>
  <path d="M32 13 L34.6 19.6 L41.6 19.9 L36.1 24.2 L38.1 30.9 L32 26.9 L25.9 30.9 L27.9 24.2 L22.4 19.9 L29.4 19.6 Z" fill="#c9a94a" opacity=".9"/>
  <text x="32" y="47" text-anchor="middle" font-family="Georgia, serif" font-size="15" font-weight="700" fill="#fff" letter-spacing="1">ZNP</text>
</svg>`;

const shell = (title, bar, sideTitle, side, nav, content, tools = '') => `<!DOCTYPE html>
<html lang="az"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<link rel="stylesheet" href="../../frontend/fonts.css">
<link rel="stylesheet" href="../../frontend/site.css">
<link rel="stylesheet" href="../../frontend/panel.css">
</head><body>
<div class="gov-bar"><div class="wrap"><span><b>ZNP</b><span class="long"> · ${bar}</span></span>
<span class="right">${tools || '<span><span class="dot live"></span>admin@zarafat.az</span>'}</span></div></div>
<header class="masthead"><div class="wrap">${CREST}
<div class="mast-name"><div class="n1">Zarafat Notariat Palatası</div>
<div class="n2">Uydurma qurum · qeyri-rəsmi sənədlər reyestri</div></div>
<div class="mast-tools">${tools.includes('Qonaq') ? '<a class="chip" href="#">Sayta qayıt</a>' : '<a class="chip" href="#">Sayta qayıt</a><button class="chip">Çıxış</button>'}</div></div></header>
<nav class="nav"><div class="wrap">${nav}</div></nav>
<div class="wrap"><div class="panel-shell">
<aside class="side"><h4>${sideTitle}</h4><nav>${side}</nav></aside>
<main>${content}</main>
</div></div>
<footer class="site-foot"><div class="wrap" style="padding-top:22px;padding-bottom:20px">
<div class="foot-legal">© 2026 ZARAFAT NOTARİAT PALATASI (UYDURMA QURUM) · BÜTÜN SƏNƏDLƏR HÜQUQİ QÜVVƏDƏN MƏHRUMDUR</div>
</div></footer></body></html>`;

/* ---------------- admin: ümumi baxış ---------------- */
const adminSide = `
<a href="#" aria-current="page">Ümumi baxış</a>
<a href="#">Sənədlər</a>
<a href="#">Ödənişlər</a>
<a href="#">Əməliyyatlar</a>
<a href="#">İstifadəçilər</a>
<a href="#">Şikayətlər <span class="count badge-open">3</span></a>
<a href="#">Parametrlər</a>`;

const days = [4,7,3,9,12,6,15,11,18,9,22,14,26,19];
const rev  = [4,7,2,9,12,6,15,11,18,9,22,14,26,19].map(d => d * 0.9);
const W = 980, H = 150, gap = 8, n = days.length, bw = (W - gap * (n - 1)) / n;
const maxD = Math.max(...days), maxR = Math.max(...rev);
let bars = '', pts = [];
days.forEach((d, i) => {
  const x = i * (bw + gap), bh = d / maxD * (H - 22);
  bars += `<rect x="${x.toFixed(1)}" y="${(H - bh).toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" fill="#17355d" opacity="${i === n - 1 ? 1 : .72}"/>`;
  bars += `<text x="${(x + bw / 2).toFixed(1)}" y="${(H - bh - 6).toFixed(1)}" text-anchor="middle" font-family="'Plex Mono',monospace" font-size="10" fill="#565a61">${d}</text>`;
  bars += `<text x="${(x + bw / 2).toFixed(1)}" y="${H + 16}" text-anchor="middle" font-family="'Plex Mono',monospace" font-size="9.5" fill="#8a8c93">${String(14 + i).padStart(2, '0')}.08</text>`;
  pts.push(`${(x + bw / 2).toFixed(1)},${(H - rev[i] / maxR * (H - 30)).toFixed(1)}`);
});

const payRows = [
  ['ZRFMK3P9A2X', '27.08 14:22', 'aysel@mail.az', '5.00', 'ok', 'Ödənilib'],
  ['ZRFMK3P812K', '27.08 13:47', 'Qonaq #7c1a4b02', '2.00', 'ok', 'Ödənilib'],
  ['ZRFMK3P74QQ', '27.08 12:05', 'Qonaq #2f9e11d0', '1.00', 'wait', 'Gözləyir'],
  ['ZRFMK3P6ZZ1', '27.08 09:31', 'tural@mail.az', '2.00', 'bad', 'Uğursuz'],
].map(r => `<tr><td class="mono">${r[0]}<br><span class="s">${r[1]}</span></td>
<td><span class="s">${r[2]}</span></td><td class="num">${r[3]} AZN</td>
<td><span class="pill ${r[4]}">${r[5]}</span></td></tr>`).join('');

const docRows = [
  ['Həftəsonu Çölə Çıxma Etibarnaməsi', 'ZRF-2026-9482 · notarial', 'ok', 'published'],
  ['Dost Satqını Sertifikatı', 'ZRF-2026-4471 · sertifikat', 'ok', 'published'],
  ['Xoruldama Lisenziyası', 'ZRF-2026-1180 · lisenziya', 'mute', 'draft'],
  ['İlin İşçisi Diplomu', 'ZRF-2026-7734 · diplom', 'bad', 'removed'],
].map(r => `<tr><td><span class="t" style="font-size:13px">${r[0]}</span><span class="s">${r[1]}</span></td>
<td><span class="pill ${r[2]}">${r[3]}</span></td><td><a class="btn btn-ghost btn-sm" href="#">Bax</a></td></tr>`).join('');

const adminContent = `
<div class="page-head"><div><h1>Ümumi baxış</h1><div class="sub">27.08.2026 14:35</div></div></div>

<dl class="stats">
  <div class="accent"><dt>Bu gün gəlir</dt><dd>18.00 <small>AZN</small></dd></div>
  <div><dt>Ümumi gəlir</dt><dd>412.00 <small>AZN</small></dd></div>
  <div><dt>Bu gün sənəd</dt><dd>19</dd></div>
  <div><dt>Reyestrdə</dt><dd>187</dd></div>
</dl>

<dl class="stats">
  <div><dt>Ümumi sənəd</dt><dd>294</dd></div>
  <div><dt>İstifadəçi</dt><dd>212</dd><div class="sub">34 qeydiyyatlı</div></div>
  <div><dt>Xərclənməmiş kredit</dt><dd>63</dd></div>
  <div class="warn"><dt>Açıq şikayət</dt><dd>3</dd></div>
</dl>

<div class="chart">
  <h3>Son 14 gün</h3>
  <div class="cap">Sütun — sənəd sayı · xətt — gündəlik gəlir (AZN)</div>
  <svg viewBox="0 0 ${W} ${H + 26}">
    <line x1="0" y1="${H}" x2="${W}" y2="${H}" stroke="#d6d1c3" stroke-width="1"/>
    ${bars}
    <polyline points="${pts.join(' ')}" fill="none" stroke="#a3232c" stroke-width="1.6"/>
    ${pts.map(p => { const [x, y] = p.split(','); return `<circle cx="${x}" cy="${y}" r="2.4" fill="#a3232c"/>`; }).join('')}
  </svg>
</div>

<div class="cols2">
  <div>
    <div class="page-head" style="margin-bottom:12px"><h1 style="font-size:17px">Son ödənişlər</h1>
      <div class="right"><a class="btn btn-ghost btn-sm" href="#">Hamısı</a></div></div>
    <div class="tbl-wrap"><table class="tbl"><tbody>${payRows}</tbody></table></div>
  </div>
  <div>
    <div class="page-head" style="margin-bottom:12px"><h1 style="font-size:17px">Son sənədlər</h1>
      <div class="right"><a class="btn btn-ghost btn-sm" href="#">Hamısı</a></div></div>
    <div class="tbl-wrap"><table class="tbl"><tbody>${docRows}</tbody></table></div>
  </div>
</div>`;

fs.writeFileSync(path.join(OUT, 'admin.html'),
  shell('İdarə paneli', 'İdarə paneli', 'İdarəetmə', adminSide,
    '<a href="#">İdarə paneli</a><a href="#">Sayt</a>', adminContent));

/* ---------------- admin: sənədlər siyahısı ---------------- */
const listRows = [
  ['ZRF-2026-9482', '27.08.2026 14:22', 'Həftəsonu Çölə Çıxma Etibarnaməsi', 'Günel Şəkərova ← Elvin Məmmədov', 'aysel@mail.az', 'notarial', 'gold', 'ok', 'published', '41'],
  ['ZRF-2026-4471', '27.08.2026 13:10', 'Dost Satqını Sertifikatı', 'Rəşad Quliyev ← Tural Əliyev', 'Qonaq #7c1a4b02', 'sertifikat', 'burgundy', 'ok', 'published', '12'],
  ['ZRF-2026-1180', '27.08.2026 11:54', 'Xoruldama Lisenziyası', 'Nərmin Bağırlı ← Aysel Hüseynova', 'Qonaq #2f9e11d0', 'lisenziya', 'ink', 'mute', 'draft', '0'],
  ['ZRF-2026-7734', '26.08.2026 18:02', 'İlin İşçisi Diplomu', 'Tural Əliyev ← Kollektiv', 'tural@mail.az', 'diplom', 'forest', 'bad', 'removed', '8'],
  ['ZRF-2026-3025', '26.08.2026 16:40', 'Kofe Maşını Üzərində Nəzarət Səlahiyyəti', 'Elvin Məmmədov ← Ofis', 'Qonaq #9b0c33fa', 'notarial', 'gold', 'ok', 'published', '27'],
].map(r => `<tr>
<td class="mono">${r[0]}<br><span class="s">${r[1]}</span></td>
<td><span class="t">${r[2]}</span><span class="s">${r[3]}</span></td>
<td><span class="s">${r[4]}</span></td>
<td class="mono">${r[5]}<br><span class="s">${r[6]}</span></td>
<td><span class="pill ${r[7]}">${r[8]}</span></td>
<td class="num">${r[9]}</td>
<td><div class="acts"><a class="btn btn-ghost btn-sm" href="#">Bax</a></div></td></tr>`).join('');

const docsContent = `
<div class="page-head"><div><h1>Sənədlər</h1><div class="sub">294 qeyd</div></div></div>
<form class="filters">
  <input class="input grow" placeholder="Nömrə, başlıq və ya ad" value="">
  <select class="input"><option>Bütün vəziyyətlər</option><option>Qaralama</option><option>Reyestrdə</option></select>
  <select class="input"><option>Bütün formalar</option><option>notarial</option><option>blank</option></select>
  <button class="btn btn-sm" type="button">Süz</button>
  <a class="btn btn-ghost btn-sm" href="#">Sıfırla</a>
</form>
<div class="tbl-wrap"><table class="tbl">
<thead><tr><th>Nömrə</th><th>Sənəd</th><th>İstifadəçi</th><th>Forma</th><th>Vəziyyət</th><th class="num">Baxış</th><th></th></tr></thead>
<tbody>${listRows}</tbody></table></div>
<nav class="pager"><span class="pager-btn is-off">Əvvəlki</span><span class="pager-info">1–25 / 294</span><a class="pager-btn" href="#">Növbəti</a></nav>`;

fs.writeFileSync(path.join(OUT, 'admin-documents.html'),
  shell('Sənədlər', 'İdarə paneli', 'İdarəetmə',
    adminSide.replace('aria-current="page"', '').replace('<a href="#">Sənədlər</a>', '<a href="#" aria-current="page">Sənədlər</a>'),
    '<a href="#">İdarə paneli</a><a href="#">Sayt</a>', docsContent));

/* ---------------- kabinet ---------------- */
const accSide = `
<a href="#" aria-current="page">Ümumi baxış</a>
<a href="#">Sənədlərim <span class="count">7</span></a>
<a href="#">Əməliyyatlar</a>
<a href="#">Hesab</a>`;

const txRows = [
  ['Balans artımı', '27.08.2026 14:22 · Sifariş ZRFMK3P9A2X', '+3', '3', 'var(--green)'],
  ['Sənəd rəsmiləşdirilməsi', '27.08.2026 14:24 · Sənəd ZRF-2026-9482', '−1', '2', 'var(--red)'],
  ['Sənəd rəsmiləşdirilməsi', '27.08.2026 15:02 · Sənəd ZRF-2026-4471', '−1', '1', 'var(--red)'],
  ['Admin tərəfindən verilib', '26.08.2026 10:15 · kompensasiya', '+2', '3', 'var(--green)'],
].map(r => `<tr><td><span class="t" style="font-size:13px">${r[0]}</span><span class="s">${r[1]}</span></td>
<td class="num" style="color:${r[4]}">${r[2]}</td><td class="num">${r[3]}</td></tr>`).join('');

const myDocRows = [
  ['Həftəsonu Çölə Çıxma Etibarnaməsi', 'ZRF-2026-9482 · 27.08.2026', 'ok', 'Reyestrdə'],
  ['Dost Satqını Sertifikatı', 'ZRF-2026-4471 · 27.08.2026', 'ok', 'Reyestrdə'],
  ['Xoruldama Lisenziyası', 'ZRF-2026-1180 · 27.08.2026', 'mute', 'Qaralama'],
].map(r => `<tr><td><span class="t">${r[0]}</span><span class="s">${r[1]}</span></td>
<td class="num"><span class="pill ${r[2]}">${r[3]}</span></td></tr>`).join('');

const accContent = `
<div class="page-head">
  <div><h1>Ümumi baxış</h1><div class="sub">Qonaq sessiyası · 7c1a4b02</div></div>
  <div class="right"><a class="btn btn-ghost btn-sm" href="#">Yeni sənəd</a></div>
</div>

<dl class="stats">
  <div class="accent"><dt>Balans</dt><dd>1 <small>sənəd</small></dd></div>
  <div><dt>Hazırlanıb</dt><dd>7</dd></div>
  <div><dt>Reyestrdə</dt><dd>5</dd></div>
  <div><dt>Ödənilib</dt><dd>8.00 <small>AZN</small></dd></div>
</dl>

<div class="notice" style="margin-bottom:22px">
  <div class="t">Qonaq sessiyası</div>
  <p>Hər şey işləyir — sənəd yarada və ödəniş edə bilərsiniz. Lakin balans yalnız bu brauzerdə
  saxlanılır: cookie silinsə itə bilər. İstəsəniz <a href="#">hesab aça bilərsiniz</a> —
  mövcud balans və sənədlər olduğu kimi qalır.</p>
</div>

<div class="panel" style="margin-bottom:22px">
  <div class="panel-head"><span class="label">Balans artır</span><span class="right label">1 kredit = 1 sənəd</span></div>
  <div class="panel-body"><div class="pack-grid">
    <button class="pack"><span><span class="n">1 sənəd</span><br><span class="d">Tək sənəd üçün</span></span><span class="p">1.00 AZN</span></button>
    <button class="pack best"><span><span class="n">3 sənəd</span><br><span class="d">Ən çox seçilən</span></span><span class="p">2.00 AZN</span></button>
    <button class="pack"><span><span class="n">10 sənəd</span><br><span class="d">Dost qrupu üçün</span></span><span class="p">5.00 AZN</span></button>
  </div></div>
</div>

<div class="cols2">
  <div>
    <div class="page-head" style="margin-bottom:12px"><h1 style="font-size:17px">Son sənədlər</h1>
      <div class="right"><a class="btn btn-ghost btn-sm" href="#">Hamısı</a></div></div>
    <div class="tbl-wrap"><table class="tbl"><tbody>${myDocRows}</tbody></table></div>
  </div>
  <div>
    <div class="page-head" style="margin-bottom:12px"><h1 style="font-size:17px">Son əməliyyatlar</h1>
      <div class="right"><a class="btn btn-ghost btn-sm" href="#">Hamısı</a></div></div>
    <div class="tbl-wrap"><table class="tbl"><tbody>${txRows}</tbody></table></div>
  </div>
</div>`;

fs.writeFileSync(path.join(OUT, 'kabinet.html'),
  shell('Kabinet', 'İstifadəçi kabineti', 'Kabinet', accSide,
    '<a href="#">Sənəd yarat</a><a href="#">Reyestr</a><a href="#">Kabinet</a>', accContent,
    '<span><span class="dot"></span>Qonaq sessiyası</span>'));

console.log('Önizləmə hazırdır:', OUT);
