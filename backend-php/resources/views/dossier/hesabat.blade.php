@extends('layouts.dossier')
{{-- SAYT QABIĞI, OYUN ÇƏRÇİVƏSİ DEYİL. Bu səhifə əvvəllər `frame` qabığında
     idi: masaüstündə oyun lentinin `order` qaydaları ona da tətbiq olunur,
     altlıq yuxarı çıxır və düymələr nəhəng bloklara çevrilirdi. O, oyun
     ekranı deyil — dosta göndərilən müstəqil səhifədir. --}}
@section('wrap', 'sayt')
@section('title', 'İş № ' . $dossier->no . ' bağlandı')

@push('head')
<meta name="description" content="{{ $og['description'] }}">
<meta property="og:type" content="website">
<meta property="og:title" content="{{ $og['title'] }}">
<meta property="og:description" content="{{ $og['description'] }}">
<meta property="og:url" content="{{ url()->current() }}">
@if($og['image'] !== '')
<meta property="og:image" content="{{ $og['image'] }}">
<meta property="og:image:width" content="{{ config('dossier.cert.width') }}">
<meta property="og:image:height" content="{{ config('dossier.cert.height') }}">
<meta name="twitter:card" content="summary_large_image">
@else
<meta name="twitter:card" content="summary">
@endif
@endpush

{{-- SPOILER SAXLAMIR. Bu səhifə dosta göndərilir: qatilin adı, motiv və
     heç bir sənəd məzmunu burada yoxdur. --}}
@section('content')
@include('dossier.partials.ust')

@include('dossier.partials.bas', [
  'nisan' => 'İŞ BAĞLANDI',
  'ust'   => 'AFİB · oyun nəticəsi',
  'bas'   => $dossier->title,
  'alt'   => 'Bu qovluq bağlanıb. Nəticədə qatilin adı, motiv və sənəd məzmunu YOXDUR —'
      . ' qovluğu təmiz aça bilərsiniz.',
])

{{-- Lent sərhəddir: buradan o tərəfə bağlanmış iş başlayır. Kartın
     ÜSTÜNDƏN keçmir — orada «İŞ AÇILDI» sətri və fiktivlik qeydi var,
     ikisi də bağlanmamalıdır. --}}
<div class="skoc-eyri">@include('dossier.partials.skoc')</div>

<section class="hsb">
  <div class="sayt-en hsb-in">

    {{-- Sertifikat lövhəyə sancılıb — bölmənin bütün sənədləri kimi.
         Əyilmə sabitdir: hər açılışda eyni görünməlidir. --}}
    <div class="hsb-kart">
      <span class="hero-iyne"></span>
      <span class="hero-skoc hero-skoc-sol"></span>
      <span class="hero-skoc hero-skoc-sag"></span>

      <div class="cert">
        <div class="cert-k">{{ \App\Support\Dossier\Byuro::BASLIQ }}</div>
        <div class="cert-t">İŞ AÇILDI</div>
        <div class="cert-n">İş № {{ $dossier->no }} · {{ $dossier->title }}</div>
        <div class="cert-g">
          <div><b>{{ $minutes }}</b><small>dəqiqə</small></div>
          <div><b>{{ $pinned }}</b><small>sancılmış sənəd</small></div>
        </div>
        @if($p->investigator !== '')
          <div class="cert-k">{{ mb_strtoupper(str_replace(['i', 'ı'], ['İ', 'I'], $p->investigator), 'UTF-8') }}</div>
        @endif
        <div class="cert-f">Nəticə spoiler saxlamır — qovluğu təmiz aça bilərsən.</div>
        {{-- Bu səhifə saytdan kənarda yaşayır: linki dosta göndərilir və çox vaxt
             yeganə görünən şey elə bu kartdır. Qeyd onun İÇİNDƏ olmalıdır. --}}
        <div class="cert-fiktiv" data-fq="1">{{ \App\Support\Dossier\Byuro::QEYD }}</div>
        <div class="stamp" style="position:static;margin:16px auto 0;transform:rotate(-9deg)">
          <span>@foreach((array) ((array) $dossier->cover)['closeStamp'] ?? [] as $l){{ $l }}@if(! $loop->last)<br>@endif @endforeach</span>
        </div>
      </div>
    </div>

    <div class="hsb-yan">
      <h2 class="bolme-bas">Növbəti addım</h2>
      <p class="hsb-l">Eyni qovluğu özünüz açsanız, nəticəniz bu kartın yerini tutacaq.
        Materiallar eynidir — nə vaxt tapdığınız isə sizin işinizdir.</p>
      <a class="duyme" href="{{ route('dossier.show', $dossier->slug) }}">Bu qovluğu özün aç</a>
      <a class="duyme duyme-bos" href="{{ route('dossier.index') }}">Bütün qovluqlar</a>
    </div>

  </div>
</section>

@include('dossier.partials.altliq')
@endsection
