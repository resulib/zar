<!doctype html>
<html lang="az">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex, nofollow, noarchive">
<meta name="theme-color" content="#f7f4ef">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='12' fill='%23a2683f'/%3E%3Cpath d='M14 22h36v22a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4z' fill='none' stroke='%23fff' stroke-width='3'/%3E%3Cpath d='M14 22l18 13 18-13' fill='none' stroke='%23fff' stroke-width='3'/%3E%3C/svg%3E">
<link rel="stylesheet" href="{{ asset('assets/devet-fonts.css') }}?v=38e3d822">
<link rel="stylesheet" href="{{ asset('assets/devet-view.css') }}?v=f8ea54cc">
<meta name="csrf-token" content="{{ csrf_token() }}">
<title>{{ $og['title'] }}</title>
<meta name="description" content="{{ $og['description'] }}">
<meta property="og:type" content="website">
<meta property="og:title" content="{{ $og['title'] }}">
<meta property="og:description" content="{{ $og['description'] }}">
<meta property="og:url" content="{{ url()->current() }}">
@if($og['image'] !== '')
<meta property="og:image" content="{{ $og['image'] }}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
@else
<meta name="twitter:card" content="summary">
@endif
</head>
<body>

<div id="hal" class="hal">
  <div class="firlanan" aria-hidden="true"></div>
  <p>Dəvətnamə açılır…</p>
</div>

<main id="mezmun" hidden>

  <div class="kart-yer">
    <canvas id="kart"></canvas>
  </div>

  <section class="lovhe">
    <dl class="setirler" id="setirler"></dl>

    <div class="dugme-setir">
      <a class="dugme" id="xerite" target="_blank" rel="noopener" hidden>Xəritədə göstər</a>
      <a class="dugme dugme-ikinci" id="zeng" hidden>Zəng et</a>
    </div>
  </section>

  <section class="cavab" id="cavabBlok" hidden>
    <h2 id="cavabBasliq">Gələcəksiniz?</h2>
    <div class="secimler" id="secimler"></div>

    <div class="cavab-detal" id="cavabDetal" hidden>
      <label class="sahe" id="adSahe" hidden>
        <span class="etiket">Adınız</span>
        <input class="giris-sahe" id="cAd" maxlength="80" placeholder="Ad Soyad">
      </label>
      <label class="sahe" id="neferSahe" hidden>
        <span class="etiket">Neçə nəfər</span>
        <input class="giris-sahe" id="cNefer" type="number" min="1" max="20" value="1">
      </label>
      <label class="sahe">
        <span class="etiket">Qeyd <em>(istəyə bağlı)</em></span>
        <input class="giris-sahe" id="cQeyd" maxlength="200" placeholder="Bir az gecikə bilərəm">
      </label>
      <button type="button" class="dugme dugme-genis" id="cGonder">Cavabı göndər</button>
    </div>

    <p class="cavab-hal" id="cavabHal"></p>
  </section>

  <div class="alt-setir">
    <button type="button" class="dugme-kicik" id="yukleKart">Şəkli yüklə</button>
    <button type="button" class="dugme-kicik" id="linkKopyala">Linki kopyala</button>
  </div>

</main>

<div id="bildiris" class="bildiris"><span class="mesaj"></span></div>

<script src="{{ asset('assets/devet-designs.js') }}?v=249bedab"></script>
<script src="{{ asset('assets/invite.js') }}?v=2883d959"></script>
<script src="{{ asset('assets/export.js') }}?v=5f74b5a6"></script>
<script src="{{ asset('assets/devet-view.js') }}?v=44b9faaf"></script>
</body>
</html>
