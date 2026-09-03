@extends('layouts.dossier')
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
<main>
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

  <a class="btn" href="{{ route('dossier.show', $dossier->slug) }}" style="text-align:center;text-decoration:none">Bu qovluğu özün aç</a>
  <a class="btn ghost" href="{{ route('dossier.index') }}" style="text-align:center;text-decoration:none">Bütün qovluqlar</a>
  <div style="height:20px"></div>
</main>

@include('dossier.partials.altliq')
@endsection
