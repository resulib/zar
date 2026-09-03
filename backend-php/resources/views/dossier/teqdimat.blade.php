@extends('layouts.dossier')
@section('wrap', 'sayt')
@section('robots', 'index, follow')
@section('title', 'İş № ' . $dossier->no . ' — ' . $dossier->title)

@push('head')
<meta name="description" content="{{ $dossier->blurb }}">
<meta property="og:type" content="website">
<meta property="og:title" content="{{ $dossier->ogMeta()['title'] }}">
<meta property="og:description" content="{{ $dossier->ogMeta()['description'] }}">
<meta property="og:url" content="{{ url()->current() }}">
@if($dossier->ogUrl() !== '')
<meta property="og:image" content="{{ $dossier->ogUrl() }}">
<meta property="og:image:width" content="{{ config('dossier.og.width') }}">
<meta property="og:image:height" content="{{ config('dossier.og.height') }}">
<meta name="twitter:card" content="summary_large_image">
@else
<meta name="twitter:card" content="summary">
@endif
@endpush

{{-- Bu səhifə adamın alıb-almayacağını həll edir, ona görə burada nə var,
     nə yox — hər ikisi qəsdəndir: sənədlərin ADLARI var, MƏZMUNU yox. --}}
@section('content')
@include('dossier.partials.ust')

<section class="teq">
  <div class="sayt-en teq-in">

    <div class="teq-sol">
      <p class="teq-no">İŞ № {{ $dossier->no }}</p>
      <h1 class="teq-ad">{{ $dossier->title }}</h1>
      <p class="teq-yer">
        @if($dossier->place !== ''){{ $dossier->place }}@endif
        @if($dossier->period !== '') · {{ $dossier->period }}@endif
      </p>

      <p class="teq-giris">{{ $dossier->intro !== '' ? $dossier->intro : $dossier->blurb }}</p>

      <dl class="teq-fakt">
        <div><dt>Sənəd</dt><dd>{{ $docs->count() }} vərəq</dd></div>
        <div><dt>Vaxt</dt><dd>təxminən {{ $dossier->read_minutes }} dəqiqə</dd></div>
        <div><dt>Çətinlik</dt><dd>{{ config('dossier.difficulty_labels')[$dossier->difficulty] ?? $dossier->difficulty }}</dd></div>
        @if($stats['show'] && $stats['plays'] > 0)
          <div><dt>Oynayıb</dt><dd>{{ $stats['plays'] }} nəfər</dd></div>
          @if($stats['firstTry'] !== null)
            <div class="teq-vurgu"><dt>İlk cəhddə</dt><dd>{{ $stats['firstTry'] }}%-i tapıb</dd></div>
          @endif
        @endif
      </dl>

      <a class="duyme" href="{{ route('dossier.play', $dossier->slug) }}">
        @if($access)
          {{ $solved ? 'Qovluğa qayıt' : 'Davam et' }}
        @elseif($dossier->isFree())
          Qovluğu pulsuz aç
        @else
          Qovluğu aç — {{ $dossier->price_credits }} kredit
        @endif
      </a>
      <p class="teq-qeyd">Bədii əsərdir. Personajlar, qurumlar və hadisələr uydurmadır.</p>
    </div>

    <div class="teq-sag">
      <h2 class="teq-bas">Qovluqdakı materiallar</h2>
      <p class="teq-l">Adları göstərilir, məzmunu qovluq açılandan sonra oxunur.</p>
      <ol class="teq-siyahi">
        @foreach($docs as $d)
          <li>
            <span class="teq-v">v. {{ $d->page }}</span>
            <span class="teq-n">{{ $d->name }}</span>
            <span class="teq-k">{{ $d->is_locked ? 'kodla bağlıdır' : $d->kind }}</span>
          </li>
        @endforeach
      </ol>
    </div>

  </div>
</section>

@include('dossier.partials.altliq')
@endsection
