@extends('layouts.devet')
@section('title', $invite->host_names !== '' ? $invite->host_names : 'Cavablar')

@section('content')
  <div class="panel-bas">
    <a class="geri" href="{{ route('devet.list') }}">← Bütün dəvətnamələr</a>
    <h1>{{ $invite->host_names !== '' ? $invite->host_names : 'Dəvətnamə' }}</h1>
    <p>
      {{ $adlar[$invite->event] ?? $invite->event }}
      @if($invite->event_at) · {{ $invite->event_at->format('d.m.Y') }}@endif
      @if($invite->event_time !== '') · {{ $invite->event_time }}@endif
      · {{ $invite->views }} baxış
    </p>
  </div>

  <dl class="yekun">
    <div><dt>Gəlir</dt><dd class="yasil">{{ $yekun['gelirem'] }}</dd></div>
    <div><dt>Ümumi nəfər</dt><dd class="yasil">{{ $yekun['nefer'] }}</dd></div>
    <div><dt>Gələ bilmir</dt><dd>{{ $yekun['gelmirem'] }}</dd></div>
    <div><dt>Hələ bilmir</dt><dd>{{ $yekun['bilmirem'] }}</dd></div>
    <div><dt>Cavabsız</dt><dd class="solgun">{{ $yekun['cavabsiz'] }}</dd></div>
  </dl>

  <div class="sira" style="margin-bottom:22px">
    <a class="dugme-kicik" href="{{ $invite->link() }}" target="_blank" rel="noopener">Dəvətnaməyə bax</a>
    <a class="dugme-kicik" href="{{ route('devet.csv', $invite->token) }}">Cədvəli endir (CSV)</a>
    <button type="button" class="dugme-kicik" id="umumiLink"
            data-link="{{ $invite->link() }}">Ümumi linki kopyala</button>
  </div>

  {{-- Toplu dəvətnamə: bölmənin ən dəyərli hissəsi. Yüzlərlə dəvətnaməni
       əl ilə düzəltmək əvəzinə siyahı yazılır, hər qonaq üçün adı yazılmış
       ayrıca kart və ayrıca link hazırlanır. --}}
  <div class="cedvel-cerceve toplu" style="padding:20px">
    <h2 style="font:400 21px/1.2 var(--display);margin:0 0 6px">Qonaq siyahısı</h2>
    <p class="kicik" style="margin:0 0 14px">
      Hər sətirdə bir ad yazın. Hər qonaq üçün adı yazılmış ayrıca dəvətnamə və
      ayrıca link hazırlanır — kim açdı, kim nə cavab verdi, aşağıdakı cədvəldə görünür.
    </p>
    <textarea id="qonaqMetn" placeholder="Rəşad müəllim&#10;Aygün xanım&#10;Nərmin Əliyeva">{{ $siyahi }}</textarea>
    <div class="toplu-dugmeler">
      <button type="button" class="dugme" id="siyahiYaz">Siyahını yadda saxla</button>
      <button type="button" class="dugme dugme-ikinci" id="zipYukle">Adlı kartları ZIP-lə endir</button>
      <div class="proqres" id="proqres" hidden><span></span></div>
    </div>
  </div>

  <div class="cedvel-cerceve" style="margin-top:22px">
    <div class="cedvel-sar">
      <table class="cedvel" id="qonaqCedvel">
        <thead>
          <tr><th>Ad</th><th>Cavab</th><th>Nəfər</th><th>Qeyd</th><th>Link</th><th></th></tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
  </div>
@endsection

@push('scripts')
<script>
  window.DEVET_TOKEN = @json($invite->token);
  window.DEVET_INV = @json($doc);
</script>
<script src="{{ asset('assets/devet-designs.js') }}"></script>
<script src="{{ asset('assets/invite.js') }}"></script>
<script src="{{ asset('assets/export.js') }}"></script>
<script src="{{ asset('assets/zip.js') }}"></script>
<script src="{{ asset('assets/devet-board.js') }}"></script>
@endpush
