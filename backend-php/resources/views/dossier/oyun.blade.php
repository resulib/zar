@extends('layouts.dossier')
@section('title', 'İş № ' . $dossier->no . ' — ' . $dossier->title)

@push('head')
{{-- Bu səhifə axtarışa bağlıdır və paylaşılmır — sosial önizləmə təqdimat
     səhifəsindədir. Burada yalnız təsvir qalır. --}}
<meta name="description" content="{{ $dossier->blurb }}">
@endpush

@section('content')
@php($cover = (array) $dossier->cover)

<header id="topbar">
  <button class="tb-back" id="back" type="button">‹ Geri</button>
  <div class="tb-title" id="ttl">İş materialları</div>
  <div class="tb-clock" id="clock">00:00</div>
</header>

<main id="main">

  {{-- ÜZ QABIĞI. Ödəniş olmayana yalnız bu görünür: sənədlərin adları
       siyahıdadır, məzmunu isə serverdən ümumiyyətlə göndərilmir. --}}
  <section class="screen {{ $access ? '' : 'on' }}" id="s-cover">
    <div class="cov-edge"></div>
    <div class="cov">
      <div class="cov-org">@foreach((array) ($cover['org'] ?? []) as $l){{ $l }}@if(! $loop->last)<br>@endif @endforeach</div>
      <div class="cov-rule"></div>
      <div class="cov-kind">{{ $cover['kind'] ?? 'İŞ' }}</div>
      {{-- Büro kodu ayrıca sətirdədir: tam nömrə 46px-lik sətrə sığmır. --}}
      <div class="cov-kod">{{ $dossier->kod() }}</div>
      <div class="cov-no">{{ $dossier->nomre() }}</div>
      <div class="cov-sub">{{ $cover['opened'] ?? '' }}</div>
      <div class="stamp"><span>@foreach((array) ($cover['stamp'] ?? []) as $l){{ $l }}@if(! $loop->last)<br>@endif @endforeach</span></div>

      <div class="cov-body">
        @foreach((array) ($cover['assign'] ?? []) as $l){!! \App\Support\Dossier\Metn::inline($l) !!}<br>@endforeach
        <input class="blank" id="who" placeholder="soyad, ad"
               maxlength="{{ config('dossier.limits.investigator') }}" autocomplete="off"
               value="{{ $data['state']['investigator'] ?? '' }}">-a tapşırılsın.
      </div>

      <div class="cov-blurb">{{ $dossier->blurb }}</div>

      @if(! $access && ! $dossier->isFree())
        <div class="cov-price">Qovluğun açılması — {{ $dossier->price_credits }} kredit.</div>
      @elseif(! $access)
        <div class="cov-price">Giriş qovluğu — pulsuzdur.</div>
      @endif

      <div class="cov-spacer"></div>
      <button class="btn-open" id="openBtn" type="button" disabled>Qovluğu aç</button>
      {{-- Üz qabığı da paylaşıla bilən artefaktdır: məcburi qeydin DƏQİQ
           mətni burada da durur, ardınca personaj bəndi gəlir. --}}
      <div class="cov-note">{{ \App\Support\Dossier\Byuro::QEYD }}
        Personajlar, qurumlar və hadisələr uydurmadır.</div>
    </div>
  </section>

  <section class="screen" id="s-index">
    <div class="meta"><dl id="meta"></dl></div>
    <div class="sect-h">MATERİALLARIN SİYAHISI</div>
    <div id="list"></div>
    <div style="height:16px"></div>
  </section>

  {{-- `#docbody` daxilində BOŞLUQ OLMAMALIDIR: masaüstündə boş sağ pəncərənin
       yazısı `#docbody:empty` seçicisi ilə göstərilir və bir boşluq onu susdurur. --}}
  <section class="screen" id="s-doc"><div id="docbody"></div></section>

  <section class="screen" id="s-suspects">
    <div class="sect-h">DİNDİRİLƏNLƏR</div>
    <div id="sus"></div>
    <div class="sect-h">GECƏNİN XRONOLOGİYASI</div>
    <div class="meta"><dl id="chrono"></dl></div>
    <div style="height:20px"></div>
  </section>

  <section class="screen" id="s-notes">
    <div class="sect-h">İŞÇİ QEYDLƏR</div>
    <div id="notes"></div>
    <div style="height:20px"></div>
  </section>

  {{-- YEKUN EKRANI İKİ FORMANI DAŞIYIR və hansının görünəcəyini CSS həll
       edir: `.sonluq` sinfi `dossier.js` tərəfindən qoyulur. Rejim işin
       sonluq sətri olub-olmamasından TÖRƏYİR — iki ayrı ekran qursaydıq,
       naviqasiya və lent məntiqi də ikiləşərdi. --}}
  <section class="screen" id="s-answer">
    <div class="sect-h">YEKUN RƏY</div>
    <div id="qs"></div>
    <div class="left-note" id="left"></div>
    <button class="btn" id="submit" type="button" disabled>Rəyi təsdiq et</button>

    <div class="sect-h end-h">KİM?</div>
    <p class="end-n">Şübhəlilərdən birini seçin. Seçiminizə uyğun sonluq açılacaq.</p>
    <div id="ends"></div>
  </section>

  <section class="screen" id="s-result"><div id="res"></div></section>
</main>

<nav id="tabbar">
  <button class="tab on" type="button" data-go="index"><svg viewBox="0 0 24 24"><path d="M4 4h10l6 6v10H4z"/><path d="M14 4v6h6"/></svg>Materiallar</button>
  <button class="tab" type="button" data-go="suspects"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.4"/><path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6"/></svg>Şübhəlilər</button>
  <button class="tab" type="button" data-go="notes"><svg viewBox="0 0 24 24"><path d="M6 3h12v18l-6-4-6 4z"/></svg>Qeydlər<span class="badge" id="nb" hidden>0</span></button>
  <button class="tab" type="button" data-go="answer"><svg viewBox="0 0 24 24"><path d="M5 12l5 5L19 7"/></svg>Cavab</button>
</nav>
@endsection

@push('scripts')
<script>window.DOSSIER = @json($data);</script>
<script src="{{ asset('assets/export.js') }}"></script>
<script src="{{ asset('assets/dossier-cert.js') }}"></script>
<script src="{{ asset('assets/dossier.js') }}"></script>
@endpush
