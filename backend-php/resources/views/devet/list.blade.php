@extends('layouts.devet')
@section('title', 'Dəvətnamələrim')

@section('content')
  <div class="panel-bas">
    <h1>Dəvətnamələrim</h1>
    <p>Hazırladığınız dəvətnamələr və qonaq cavabları.</p>
  </div>

  @if($invites->isEmpty())
    <div class="bos">
      <p>Hələ dəvətnamə hazırlamamısınız.</p>
      <a class="dugme" href="{{ route('devet.builder') }}">İlk dəvətnaməni hazırla</a>
    </div>
  @else
    <div class="devet-siyahi">
      @foreach($invites as $inv)
        <div class="devet-setir">
          <div>
            <p class="ad">{{ $inv->host_names !== '' ? $inv->host_names : 'Adsız dəvətnamə' }}</p>
            <div class="alt">
              {{ $adlar[$inv->event] ?? $inv->event }}
              @if($inv->event_at) · {{ $inv->event_at->format('d.m.Y') }}@endif
              @if($inv->isPublished()) · {{ $sayilar[$inv->id]['gelirem'] ?? 0 }} gələn
                · {{ $sayilar[$inv->id]['cavabsiz'] ?? 0 }} cavabsız @endif
            </div>
          </div>
          <div class="sira">
            <span class="hal-nisan {{ $inv->isPublished() ? 'hal-derc' : 'hal-qaralama' }}">
              {{ $inv->isPublished() ? 'Dərc olunub' : 'Qaralama' }}
            </span>
            @if($inv->isPublished())
              <a class="dugme-kicik" href="{{ route('devet.board', $inv->token) }}">Cavablar</a>
              <a class="dugme-kicik" href="{{ $inv->link() }}" target="_blank" rel="noopener">Bax</a>
            @endif
          </div>
        </div>
      @endforeach
    </div>
  @endif
@endsection
