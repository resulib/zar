@extends('layouts.dossier')
@section('wrap', 'sayt')
@section('title', 'Giriş və qeydiyyat')

@push('head')
<link rel="stylesheet" href="{{ asset('assets/dossier-profil.css') }}">
@endpush

{{-- Bölmənin ÖZ hesab ekranı. Saytın digər məhsulunun kabinetinə link
     verilmir — iki bölmə bir-birini tanımır. Autentifikasiya məntiqi
     təkrarlanmır: eyni `AccountService` çağırılır. --}}
@section('content')
@include('dossier.partials.ust')

<section class="pr">
  <div class="sayt-en pr-dar">

    @include('dossier.partials.flash')

    <div class="pr-hesab-bas">
      <span class="pr-etiket">Kadr şöbəsi</span>
      <h1>Müstəntiq vəsiqəsi</h1>
      @if($isler > 0)
        <p>Siz artıq <b>{{ $isler }}</b> iş bağlamısınız və <b>{{ $xp }} XP</b>
           toplamısınız. Qeydiyyat bu nəticəni hesabınıza yazır — heç nə itmir.</p>
      @else
        <p>Vəsiqə, rütbə və reytinqdə yer qeydiyyatdan sonra açılır.
           Bağladığınız işlər hesabınıza yazılır.</p>
      @endif
    </div>

    <div class="pr-hesab">

      <div class="pr-blok pr-form">
        <h2>Qeydiyyat</h2>
        <form method="POST" action="{{ route('dossier.register') }}">
          @csrf
          <label class="pr-etiket-s">Ad Soyad</label>
          <input class="pr-input" type="text" name="name" maxlength="60"
                 value="{{ old('name') }}" required>

          <label class="pr-etiket-s">E-poçt</label>
          <input class="pr-input" type="email" name="email" maxlength="120"
                 value="{{ old('email') }}" required>

          <label class="pr-etiket-s">Parol</label>
          <input class="pr-input" type="password" name="password" minlength="8" required>

          <label class="pr-etiket-s">Parolu təkrarlayın</label>
          <input class="pr-input" type="password" name="password_confirmation" minlength="8" required>

          <button type="submit" class="pr-btn pr-btn-tam">Vəsiqə al</button>
        </form>
      </div>

      <div class="pr-blok pr-form">
        <h2>Giriş</h2>
        <p class="pr-qeyd">Hesabınız varsa, bu cihazdakı nəticələr ora köçürüləcək.</p>
        <form method="POST" action="{{ route('dossier.login') }}">
          @csrf
          <label class="pr-etiket-s">E-poçt</label>
          <input class="pr-input" type="email" name="email" value="{{ old('email') }}" required>

          <label class="pr-etiket-s">Parol</label>
          <input class="pr-input" type="password" name="password" required>

          <button type="submit" class="pr-btn pr-btn-tam">Daxil ol</button>
        </form>
      </div>

    </div>
  </div>
</section>

@include('dossier.partials.altliq')
@endsection
