{{-- İş qovluğu bölməsinin öz görünüş çərçivəsi.
     layouts/panel.blade.php İŞLƏDİLMİR və site.css/app.js heç vaxt
     yüklənmir: bu tərəfdə oxucu yalnız istintaq materiallarını görməlidir.
     Saytın digər məhsuluna nə link var, nə də ad. --}}
<!doctype html>
<html lang="az">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>@yield('title')</title>
{{-- Oyun və sertifikat bağlı qalır, satış səhifələri isə `robots` bölməsini
     boşaldır: kataloq məxfi məlumat deyil, satılan məhsuldur. --}}
<meta name="robots" content="@yield('robots', 'noindex, nofollow')">
<meta name="theme-color" content="#191C1A">
<meta name="csrf-token" content="{{ csrf_token() }}">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='12' fill='%23191C1A'/%3E%3Ccircle cx='32' cy='32' r='25' fill='none' stroke='%23C2A468' stroke-width='2'/%3E%3Cpath d='M24 18h13l9 9v20H24z' fill='none' stroke='%23C2A468' stroke-width='2.6'/%3E%3Cpath d='M37 18v9h9' fill='none' stroke='%23C2A468' stroke-width='2.6'/%3E%3C/svg%3E">
<link rel="stylesheet" href="{{ asset('assets/dossier-fonts.css') }}">
<link rel="stylesheet" href="{{ asset('assets/dossier.css') }}">
@stack('head')
</head>
<body>
{{-- Sarğı seçilir: oyun telefon çərçivəsində qalır (`frame`), satış
     səhifələri isə tam eni tutur (`sayt`). --}}
<div class="@yield('wrap', 'frame')">
@yield('content')
</div>
<div id="bildiris" class="bildiris"><span class="mesaj"></span></div>
@stack('scripts')
</body>
</html>
