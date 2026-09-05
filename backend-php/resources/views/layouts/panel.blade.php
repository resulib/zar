<!DOCTYPE html>
<html lang="az">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="csrf-token" content="{{ csrf_token() }}">
<title>@yield('title', 'Panel') — Zarafat Notariat Palatası</title>
<meta name="robots" content="noindex">
<link rel="icon" href="{{ asset('assets/favicon.svg') }}">
{{-- KEŞ DAMĞASI. `public/assets/*` build çıxışıdır və `npm run build:laravel`
     onları üzərinə yazır, amma faylın ADI dəyişmir — brauzer köhnə nüsxəni
     saxlayır və panel «yenilənmir». `spa.blade.php` bunu build vaxtı sha1 ilə
     həll edir; bu layout əl ilə yazıldığı üçün burada faylın dəyişmə vaxtı
     işlədilir — nəticə eynidir, addım azdır. --}}
@php($v = static fn (string $p): string => asset($p) . '?v=' . (string) (@filemtime(public_path($p)) ?: 0))
<link rel="stylesheet" href="{{ $v('assets/fonts.css') }}">
<link rel="stylesheet" href="{{ $v('assets/site.css') }}">
<link rel="stylesheet" href="{{ $v('assets/panel.css') }}">
  {{-- Səhifəyə xas üslub: iş qovluğu redaktorunun önizləməsi oyunun öz
       `dossier.css` faylını tələb edir. Panelin qalan səhifələri buraya
       heç nə yazmır. --}}
  @stack('head')
</head>
<body>

<div class="gov-bar">
  <div class="wrap">
    <span><b>ZNP</b><span class="long"> · @yield('bar', 'Daxili sistem')</span></span>
    <span class="right">
      @auth
        <span>{{ auth()->user()->email }}</span>
      @else
        <span><span class="dot"></span>Qonaq sessiyası</span>
      @endauth
    </span>
  </div>
</div>

<header class="masthead">
  <div class="wrap">
    <svg class="crest" viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="30" fill="#17355d"/>
      <circle cx="32" cy="32" r="25.5" fill="none" stroke="#8fa8c6" stroke-width="1"/>
      <circle cx="32" cy="32" r="21" fill="none" stroke="#c9d6e6" stroke-width="1.6"/>
      <path d="M32 13 L34.6 19.6 L41.6 19.9 L36.1 24.2 L38.1 30.9 L32 26.9 L25.9 30.9 L27.9 24.2 L22.4 19.9 L29.4 19.6 Z" fill="#c9a94a" opacity=".9"/>
      <text x="32" y="47" text-anchor="middle" font-family="Georgia, serif" font-size="15" font-weight="700" fill="#fff" letter-spacing="1">ZNP</text>
    </svg>
    <div class="mast-name">
      <div class="n1">Zarafat Notariat Palatası</div>
      <div class="n2">@yield('subtitle', 'Uydurma qurum · qeyri-rəsmi sənədlər reyestri')</div>
    </div>
    <div class="mast-tools">
      <a class="chip" href="{{ url('/') }}">Sayta qayıt</a>
      @yield('tools')
    </div>
  </div>
</header>

<nav class="nav">
  <div class="wrap">@yield('nav')</div>
</nav>

{{-- Səhifə öz sarğısını genişləndirə bilər. Panelin ümumi eni 1180px-dir
     (`site.css` `--max`) və oxunuş üçün doğrudur, amma iki sütunlu iş
     qovluğu redaktoru ora sığmır: mətn və vərəq yan-yana durmalıdır.
     Defolt boşdur — qalan səhifələr toxunulmur. --}}
<div class="wrap @yield('shell')">
  <div class="panel-shell">
    <aside class="side">
      <h4>@yield('side-title', 'Bölmələr')</h4>
      <nav>@yield('side')</nav>
    </aside>

    <main>
      @include('partials.flash')
      @yield('content')
    </main>
  </div>
</div>

<footer class="site-foot">
  <div class="wrap" style="padding-top:22px;padding-bottom:20px">
    <div class="foot-legal">
      © {{ date('Y') }} ZARAFAT NOTARİAT PALATASI (UYDURMA QURUM) · BÜTÜN SƏNƏDLƏR HÜQUQİ QÜVVƏDƏN MƏHRUMDUR
    </div>
  </div>
</footer>

@stack('scripts')

</body>
</html>
