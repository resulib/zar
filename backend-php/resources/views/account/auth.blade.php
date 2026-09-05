@extends('layouts.panel')
@section('title', 'Hesab')
@section('bar', 'İstifadəçi kabineti')
@section('side-title', 'Kabinet')
@section('side') @include('partials.account-nav') @endsection
@section('nav')
  <a href="{{ url('/') }}">Sənəd yarat</a>
  <a href="{{ url('/#reyestr') }}">Reyestr</a>
  <a href="{{ route('account.index') }}">Kabinet</a>
@endsection

@section('content')
<div class="page-head"><div><h1>Hesab</h1><div class="sub">Üç yol var — hansını seçdiyiniz balansı dəyişmir</div></div></div>

@if (! $user->isGuest())
  <div class="panel" style="max-width:520px">
    <div class="panel-head"><span class="label">Hesab məlumatları</span></div>
    <div class="panel-body">
      <dl class="kv">
        <div><dt>Ad</dt><dd>{{ $user->name ?: '—' }}</dd></div>
        <div><dt>E-poçt</dt><dd>{{ $user->email }}</dd></div>
        <div><dt>Giriş üsulu</dt><dd>
          @if($user->hasGoogle() && $user->hasPassword()) Google + parol
          @elseif($user->hasGoogle()) Google
          @else Parol @endif
        </dd></div>
        <div><dt>Balans</dt><dd>{{ $user->credits }} kredit</dd></div>
        <div><dt>Qeydiyyat</dt><dd>{{ $user->created_at->format('d.m.Y') }}</dd></div>
      </dl>

      @if($google && ! $user->hasGoogle())
        {{-- Parolla açılmış hesab Google-a BAĞLANA bilər: eyni e-poçt
             olduğu üçün `AccountService::googleIle()` yeni hesab açmır. --}}
        <a class="btn btn-google" href="{{ route('oauth.google', ['davam' => 'kabinet']) }}">
          @include('partials.google-g') <span>Google hesabını bağla</span>
        </a>
      @endif

      <form method="POST" action="{{ route('account.logout') }}" style="margin-top:18px">
        @csrf
        <button class="btn btn-ghost" type="submit">Hesabdan çıx</button>
      </form>
    </div>
  </div>
@else
  @if($google)
    <div class="panel" style="max-width:760px;margin-bottom:18px">
      <div class="panel-body" style="text-align:center">
        <a class="btn btn-google btn-block" href="{{ route('oauth.google', ['davam' => 'kabinet']) }}">
          @include('partials.google-g') <span>Google ilə davam et</span>
        </a>
        <p class="small" style="margin:12px 0 0">
          Ən sürətli yol — parol düşünmək lazım deyil. Balansınız
          ({{ $user->credits }} kredit) və sənədləriniz olduğu kimi qalır.
        </p>
      </div>
    </div>
    <div class="ayirici"><span>və ya</span></div>
  @endif

  <div class="cols2">
    <div class="panel">
      <div class="panel-head"><span class="label">Parol ilə hesab aç</span></div>
      <div class="panel-body">
        <p class="small" style="margin-bottom:16px">
          Mövcud balansınız və sənədləriniz olduğu kimi qalır —
          sadəcə başqa cihazdan da girə biləcəksiniz.
        </p>
        <form method="POST" action="{{ route('account.register') }}">
          @csrf
          <div class="field">
            <label class="label" for="name">Ad</label>
            <input class="input" id="name" name="name" value="{{ old('name') }}" required maxlength="60">
          </div>
          <div class="field">
            <label class="label" for="email">E-poçt</label>
            <input class="input" id="email" name="email" type="email" value="{{ old('email') }}" required>
          </div>
          <div class="field">
            <label class="label" for="password">Parol</label>
            <input class="input" id="password" name="password" type="password" required minlength="8">
            <span class="hint">Ən azı 8 simvol.</span>
          </div>
          <div class="field">
            <label class="label" for="password_confirmation">Parolu təkrarla</label>
            <input class="input" id="password_confirmation" name="password_confirmation" type="password" required>
          </div>
          <button class="btn btn-block" type="submit">Hesab aç</button>
        </form>
      </div>
    </div>

    <div class="panel">
      <div class="panel-head"><span class="label">Hesabınız var?</span></div>
      <div class="panel-body">
        <p class="small" style="margin-bottom:16px">
          Giriş etdikdə bu brauzerdəki qonaq sessiyası — balans və sənədlər — hesabınıza birləşdiriləcək.
        </p>
        <form method="POST" action="{{ route('account.login') }}">
          @csrf
          <div class="field">
            <label class="label" for="lemail">E-poçt</label>
            <input class="input" id="lemail" name="email" type="email" required>
          </div>
          <div class="field">
            <label class="label" for="lpassword">Parol</label>
            <input class="input" id="lpassword" name="password" type="password" required>
          </div>
          <button class="btn btn-ghost btn-block" type="submit">Giriş</button>
        </form>
      </div>
    </div>
  </div>

  {{-- QONAQ REJİMİ AÇIQ YAZILIR. Sayt onsuz da qonaq üçün tam işləyir və
       ziyarətçi artıq avtomatik qeydə alınıb ({{ $user->displayName() }}) —
       əvvəllər bu seçim heç yerdə görünmürdü, ona görə adam qeydiyyatdan
       başqa yol olmadığını düşünürdü. --}}
  <div class="panel" style="max-width:760px;margin-top:18px">
    <div class="panel-body">
      <div class="label" style="margin-bottom:6px">Qonaq kimi davam et</div>
      <p class="small" style="margin:0 0 14px">
        Siz artıq <b>{{ $user->displayName() }}</b> adı ilə avtomatik qeydə alınmısınız.
        Sənəd yaratmaq, dərc etmək və balans artırmaq üçün qeydiyyat lazım deyil —
        yalnız nəticələr bu brauzerə bağlı qalır.
      </p>
      <form method="POST" action="{{ route('oauth.guest') }}">
        @csrf
        <input type="hidden" name="davam" value="kabinet">
        <button class="btn btn-ghost" type="submit">Qonaq kimi davam et</button>
      </form>
    </div>
  </div>
@endif
@endsection
