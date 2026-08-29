<!DOCTYPE html>
<html lang="az">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Sənəd — Zarafat Notariat Palatası</title>
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#3a3d42">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%230e2340'/%3E%3Ccircle cx='32' cy='32' r='21' fill='none' stroke='%23c9d3e6' stroke-width='2'/%3E%3Ctext x='32' y='39' text-anchor='middle' font-family='Georgia,serif' font-size='19' font-weight='bold' fill='%23ffffff'%3EZ%3C/text%3E%3C/svg%3E">
<link rel="stylesheet" href="{{ asset('assets/fonts.css') }}?v=4974ddd3">
<link rel="stylesheet" href="{{ asset('assets/viewer.css') }}?v=ffa5e763">
<meta name="csrf-token" content="{{ csrf_token() }}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Zarafat Notariat Palatası">
<meta property="og:title" content="Zarafat Notariat Palatası — {{ $regNo }}">
<meta property="og:description" content="Qeyri-rəsmi, əyləncə məqsədli sənəd. Hüquqi qüvvəyə malik deyil.">
<meta property="og:url" content="{{ url()->current() }}">
<meta name="twitter:card" content="summary">
</head>
<body>

<div class="vw-page">
  <div id="vwState" class="vw-state">Reyestrdən oxunur…</div>
  <div id="vwBanner" class="vw-banner" hidden></div>
  <div id="vwReplyRef" class="vw-replyref" hidden></div>
  <div id="doc" class="vw-doc" hidden></div>

  <!-- Cavab çağırışı və sənəd tarixçəsi — sənədin altında, sıra ilə -->
  <div id="vwCta" class="vw-cta" hidden>
    <b>Bu sənədlə razı deyilsən?</b>
    <span>Rəsmi cavab hazırla — reyestrdə öz nömrəsini alsın.</span>
    <button class="vw-btn" id="vwReplyBig" type="button">Cavab sənədi hazırla →</button>
  </div>
  <div id="vwChain" class="vw-chain" hidden></div>
</div>

<div class="vw-bar" id="vwBar" hidden>
  <button id="vwReply" type="button" class="accent">Cavab ver</button>
  <button id="vwPdf" type="button">PDF</button>
  <button id="vwPng" type="button">PNG</button>
  <button id="vwStory" type="button">Story</button>
  <button id="vwLink" type="button">Link</button>
  <button id="vwRep" type="button" class="danger">Şikayət</button>
</div>

<!-- Cavab niyyəti seçimi. Kartlar viewer.js-də qurulur: baxış səhifəsinə
     kataloq yüklənmir, buradan yalnız niyyət seçilir və SPA-ya keçilir. -->
<div class="vw-modal" id="vwReplyModal">
  <div class="vw-box wide">
    <div class="vw-box-head">
      <h3>Bu sənədə necə cavab verirsən?</h3>
      <button class="vw-x" id="vwReplyClose" type="button" aria-label="Bağla">×</button>
    </div>
    <div class="vw-box-body">
      <p class="vw-small">Cavab verilən sənəd: <b class="vw-mono" id="vwReplyReg">—</b></p>
      <div class="vw-reply-grid" id="vwReplyCards"></div>
    </div>
    <div class="vw-box-foot spread">
      <button class="vw-btn ghost" id="vwReplyRandom" type="button">🎲 Mənim yerimə seç</button>
      <button class="vw-btn ghost" id="vwReplyAny" type="button">Bütün variantlara bax →</button>
    </div>
  </div>
</div>

<div class="vw-modal" id="vwRepModal">
  <div class="vw-box">
    <div class="vw-box-head">
      <h3>Şikayət və silinmə</h3>
      <button class="vw-x" id="vwRepClose" type="button" aria-label="Bağla">×</button>
    </div>
    <div class="vw-box-body">
      <p class="vw-small">Sənəd nömrəsi: <b class="vw-mono" id="vwRepReg">—</b></p>
      <label class="vw-label" for="vwRepReason">Səbəb</label>
      <select id="vwRepReason" class="vw-input">
        <option>Mənim adımdan icazəsiz yaradılıb</option>
        <option>Təhqiredici məzmun</option>
        <option>Şəxsi məlumat var</option>
        <option>Digər</option>
      </select>
      <label class="vw-label" for="vwRepNote">Əlavə qeyd</label>
      <textarea id="vwRepNote" class="vw-input" rows="3" placeholder="İstəyə bağlı"></textarea>
      <p class="vw-micro">Öz yaratdığınız sənəd dərhal silinir. Digər sənədlər moderasiyaya düşür.</p>
    </div>
    <div class="vw-box-foot">
      <button class="vw-btn ghost" id="vwRepCancel" type="button">İmtina</button>
      <button class="vw-btn danger" id="vwRepSend" type="button">Göndər</button>
    </div>
  </div>
</div>

<div id="vwToast"><div class="msg"></div></div>

<script src="{{ asset('assets/qr.js') }}?v=2387c0c7"></script>
<script src="{{ asset('assets/doc.js') }}?v=7516e7b3"></script>
<script src="{{ asset('assets/export.js') }}?v=85c3fca0"></script>
<script src="{{ asset('assets/viewer.js') }}?v=bb5dcfad"></script>
</body>
</html>
