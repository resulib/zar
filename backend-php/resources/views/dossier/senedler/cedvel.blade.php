{{-- Cədvəl — üç-dörd sütun, bəzi sətirlər vurğulanmış. --}}
@include('dossier.partials.basliq')
@php($t = (array) ($c['table'] ?? []))
@if(! empty($t['rows']))
<table class="p-tbl">
  @if(! empty($t['head']))
  <tr>@foreach($t['head'] as $h)<th>{{ $h }}</th>@endforeach</tr>
  @endif
  @foreach($t['rows'] as $i => $row)
  <tr @if(in_array($i, (array) ($t['hi'] ?? []), true)) class="hi" @endif>
    @foreach($row as $cell)<td>{!! \App\Support\Dossier\Metn::inline($cell, $vals) !!}</td>@endforeach
  </tr>
  @endforeach
  @if(! empty($t['foot']))
  <tr>@foreach($t['foot'] as $f)<th>{{ $f }}</th>@endforeach</tr>
  @endif
</table>
@endif
@include('dossier.partials.metn')
@include('dossier.partials.imza')
@include('dossier.partials.qeyd')
