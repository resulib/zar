{{-- Cədvəl bloku — sütun sayı SABİT DEYİL, başlıqların sayı qədərdir.
     Bəzi sətirlər vurğulana bilər, yekun sətri istəyə bağlıdır. --}}
@php($vurgu = (array) ($b['vurgu'] ?? []))
<table class="p-tbl">
  <tr>@foreach($b['basliqlar'] ?? [] as $h)<th>{{ $h }}</th>@endforeach</tr>
  @foreach($b['setirler'] ?? [] as $i => $row)
  <tr @if(in_array($i, $vurgu, true)) class="hi" @endif>
    @foreach($row as $cell)<td>{!! \App\Support\Dossier\Metn::inline($cell, $vals) !!}</td>@endforeach
  </tr>
  @endforeach
  @if(! empty($b['yekun']))
  <tr>@foreach($b['yekun'] as $f)<th>{{ $f }}</th>@endforeach</tr>
  @endif
</table>
@include('dossier.partials.kenar')
