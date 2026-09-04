{{-- Zəng tarixçəsi — vaxt, istiqamət, abunəçinin telefondakı adı, müddət. --}}
<div class="calls">
@foreach($b['zengler'] ?? [] as $z)
  @php($v = ! empty($z['vurgu']))
  <div class="call @if($v) hi @endif">
    <div class="call-t">{{ $z['saat'] ?? '' }}</div>
    <div class="call-b">{{ ($z['yon'] ?? '') === 'cixan' ? 'Çıxan' : 'Gələn' }} — {{ $z['abunec'] ?? '' }}<small>{{ $z['muddet'] ?? '' }}</small></div>
  </div>
@endforeach
</div>
@include('dossier.partials.kenar')
