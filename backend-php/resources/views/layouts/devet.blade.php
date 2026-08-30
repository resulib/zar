{{-- Dəvətnamə bölməsinin öz görünüş çərçivəsi.
     layouts/panel.blade.php İŞLƏDİLMİR: onun başlığı və stili saytın digər
     məhsuluna aiddir, tədbir sahibi isə burada yalnız öz məhsulunu
     görməlidir. --}}
<!doctype html>
<html lang="az">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>@yield('title') — Dəvətnamə</title>
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#f7f4ef">
<meta name="csrf-token" content="{{ csrf_token() }}">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='12' fill='%23a2683f'/%3E%3Cpath d='M14 22h36v22a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4z' fill='none' stroke='%23fff' stroke-width='3'/%3E%3Cpath d='M14 22l18 13 18-13' fill='none' stroke='%23fff' stroke-width='3'/%3E%3C/svg%3E">
<link rel="stylesheet" href="{{ asset('assets/devet-fonts.css') }}">
<link rel="stylesheet" href="{{ asset('assets/devet.css') }}">
<link rel="stylesheet" href="{{ asset('assets/devet-panel.css') }}">
</head>
<body>

<header class="ust">
  <div class="wrap ust-in">
    <a class="marka" href="{{ route('devet.builder') }}">
      <svg viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="14"/><path d="M14 22h36v22a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4z" class="zarf"/><path d="M14 22l18 13 18-13" class="zarf"/></svg>
      <span>Dəvətnamə</span>
    </a>
    <nav class="ust-nav">
      <a href="{{ route('devet.builder') }}">Yeni dəvətnamə</a>
      <a href="{{ route('devet.list') }}">Dəvətnamələrim</a>
    </nav>
  </div>
</header>

<main class="wrap">
  @if(session('status'))
    <p class="kicik" style="margin-top:18px">{{ session('status') }}</p>
  @endif
  @yield('content')
</main>

<div id="bildiris" class="bildiris"><span class="mesaj"></span></div>

@stack('scripts')
</body>
</html>
