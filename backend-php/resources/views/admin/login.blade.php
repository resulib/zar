<!DOCTYPE html>
<html lang="az">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>İdarəçi girişi — ZNP</title>
<meta name="robots" content="noindex">
<link rel="stylesheet" href="{{ asset('assets/fonts.css') }}">
<link rel="stylesheet" href="{{ asset('assets/site.css') }}">
<link rel="stylesheet" href="{{ asset('assets/panel.css') }}">
</head>
<body>
<div class="gov-bar"><div class="wrap"><span><b>ZNP</b><span class="long"> · Daxili sistem</span></span></div></div>

<div class="wrap auth-wrap">
  <div class="panel">
    <div class="panel-head"><span class="label">İdarəçi girişi</span></div>
    <div class="panel-body">
      @include('partials.flash')
      <form method="POST" action="{{ route('admin.login.post') }}">
        @csrf
        <div class="field">
          <label class="label" for="email">E-poçt</label>
          <input class="input" id="email" name="email" type="email" value="{{ old('email') }}" required autofocus>
        </div>
        <div class="field">
          <label class="label" for="password">Parol</label>
          <input class="input" id="password" name="password" type="password" required>
        </div>
        <button class="btn btn-block" type="submit">Daxil ol</button>
      </form>
    </div>
  </div>
  <p class="micro" style="text-align:center;margin-top:14px">
    <a href="{{ url('/') }}">Sayta qayıt</a>
  </p>
</div>
</body>
</html>
