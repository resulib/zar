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
<div class="page-head"><div><h1>Hesab</h1><div class="sub">Qeydiyyat istəyə bağlıdır</div></div></div>

@if (! $user->isGuest())
  <div class="panel" style="max-width:520px">
    <div class="panel-head"><span class="label">Hesab məlumatları</span></div>
    <div class="panel-body">
      <dl class="kv">
        <div><dt>Ad</dt><dd>{{ $user->name ?: '—' }}</dd></div>
        <div><dt>E-poçt</dt><dd>{{ $user->email }}</dd></div>
        <div><dt>Balans</dt><dd>{{ $user->credits }} kredit</dd></div>
        <div><dt>Qeydiyyat</dt><dd>{{ $user->created_at->format('d.m.Y') }}</dd></div>
      </dl>
      <form method="POST" action="{{ route('account.logout') }}" style="margin-top:18px">
        @csrf
        <button class="btn btn-ghost" type="submit">Hesabdan çıx</button>
      </form>
    </div>
  </div>
@else
  <div class="cols2">
    <div class="panel">
      <div class="panel-head"><span class="label">Hesab aç</span></div>
      <div class="panel-body">
        <p class="small" style="margin-bottom:16px">
          Mövcud balansınız ({{ $user->credits }} kredit) və sənədləriniz olduğu kimi qalır —
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
@endif
@endsection
