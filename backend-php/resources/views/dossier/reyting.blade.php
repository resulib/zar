@extends('layouts.dossier')
@section('wrap', 'sayt')
@section('robots', 'index, follow')
@section('title', 'Müstəntiq reytinqi')

@push('head')
<meta name="description" content="Ən çox iş bağlayan müstəntiqlərin siyahısı.">
<link rel="stylesheet" href="{{ asset('assets/dossier-profil.css') }}">
@endpush

{{-- AXTARIŞA AÇIQDIR — `/is` və `/is/{slug}` kimi satış üzüdür.
     Görünən yeganə şəxsi məlumat istifadəçinin ÖZÜNÜN seçdiyi addır;
     e-poçt, uuid və qeydiyyat tarixi buraya çıxmır. `is_public = false`
     olan profil siyahıda yoxdur. --}}
@section('content')
@include('dossier.partials.ust')

@include('dossier.partials.bas', [
  'ust' => 'Kadr şöbəsi',
  'bas' => 'Müstəntiq reytinqi',
  'alt' => 'Bağlanmış işlər, doğru sonluqlar və birinci cəhddən tapılanlar. Yalnız açıq profillər siyahıdadır.',
])

<section class="pr">
  <div class="sayt-en">


    @php($tablar = [
      'xp'        => 'XP',
      'isler'     => 'Bağlanmış iş',
      'sonluqlar' => 'Doğru sonluq',
      'ilk-cehd'  => 'Birinci cəhddən',
    ])
    @php($pencereler = ['hamisi' => 'Bütün dövr', 'ay' => 'Bu ay', 'hefte' => 'Bu həftə'])

    <nav class="pr-tablar">
      @foreach($tablar as $k => $ad)
        <a href="{{ route('dossier.reyting', ['sirala' => $k, 'pencere' => $pencere]) }}"
           class="{{ $sirala === $k ? 'aktiv' : '' }}">{{ $ad }}</a>
      @endforeach
    </nav>

    <nav class="pr-pencere">
      @foreach($pencereler as $k => $ad)
        <a href="{{ route('dossier.reyting', ['sirala' => $sirala, 'pencere' => $k]) }}"
           class="{{ $pencere === $k ? 'aktiv' : '' }}">{{ $ad }}</a>
      @endforeach
    </nav>

    @if($sirala === 'ilk-cehd')
      <p class="pr-qeyd pr-izah">Birinci cəhddən, yanlış ittiham olmadan bağlanan işlər —
        əsl bacarığı ölçən göstərici budur.</p>
    @endif

    @if(count($setirler) === 0)
      <div class="pr-bos">
        <p>Bu dövr üçün hələ nəticə yoxdur.</p>
        <a class="pr-btn" href="{{ route('dossier.index') }}#isler">İşlərə bax</a>
      </div>
    @else
      {{-- Sütun başlıqları siyahıdan ƏVVƏL gəlir və sətrin şəbəkəsini
           EYNİLƏ təkrarlayır — avatar sütunu üçün boş xana da daxil. --}}
      <div class="pr-basliqlar">
        <span>mövqe</span><span></span><span>müstəntiq</span><span>pillə</span>
        <span>iş</span><span>sonluq</span><span>1-ci</span><span>XP</span>
      </div>

      <ol class="pr-lovhe">
        @foreach($setirler as $s)
          <li class="pr-sira {{ $mene && $mene->id === $s['id'] ? 'menim' : '' }}">
            <span class="pr-movqe-n">{{ $s['movqe'] }}</span>

            <span class="pr-avatar">
              @if($s['avatar'])
                <img src="{{ route('dossier.profil.foto', $s['avatar']) }}" alt="" loading="lazy">
              @else
                <svg viewBox="0 0 40 40" aria-hidden="true">
                  <circle cx="20" cy="15" r="7"/><path d="M6 38a14 10 0 0 1 28 0z"/>
                </svg>
              @endif
            </span>

            <span class="pr-s-ad">
              <b>{{ $s['ad'] }}</b>
              <small>{{ $s['rutbe'] }} · {{ $s['nisanNo'] }}</small>
            </span>

            <span class="pr-s-pille" style="--r:{{ $s['reng'] }}" title="{{ $s['rutbe'] }}">
              {{ $s['pille'] }}
            </span>

            <span class="pr-s-say" title="Bağlanmış iş">{{ $s['isler'] }}</span>
            <span class="pr-s-say" title="Doğru sonluq">{{ $s['sonluqlar'] }}</span>
            <span class="pr-s-say" title="Birinci cəhddən">{{ $s['ilk'] }}</span>
            <span class="pr-s-xp">{{ $s['xp'] }}</span>
          </li>
        @endforeach
      </ol>

    @endif

    {{-- ÖZ SƏTRİM — siyahıda olmasam da (gizli profil, və ya siyahının
         kənarında qalan mövqe) göstərilir. --}}
    @if($mene && $movqem)
      <div class="pr-menim-setir">
        <span class="pr-movqe-n">{{ $movqem }}</span>
        <span class="pr-s-ad"><b>{{ $mene->adi() }}</b>
          <small>{{ $mene->rank?->title_az }} · {{ $mene->badge_number }}</small></span>
        <span class="pr-s-say">{{ $menim['isler'] ?? 0 }}</span>
        <span class="pr-s-say">{{ $menim['sonluqlar'] ?? 0 }}</span>
        <span class="pr-s-say">{{ $menim['ilk'] ?? 0 }}</span>
        <span class="pr-s-xp">{{ $menim['xp'] ?? 0 }}</span>
        @unless($mene->is_public)
          <span class="pr-gizli">yalnız sizə görünür</span>
        @endunless
      </div>
    @endif

  </div>
</section>

@include('dossier.partials.altliq')
@endsection
