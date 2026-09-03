{{-- Zəng tarixçəsi — vaxt, istiqamət, abunəçi adı və müddət. --}}
@include('dossier.partials.basliq')
<div class="calls">
@foreach($c['calls'] ?? [] as $z)
  <div class="call">
    <div class="call-t">@if(! empty($z['hi']))<b>{{ $z['t'] ?? '' }}</b>@else{{ $z['t'] ?? '' }}@endif</div>
    <div class="call-b">@if(! empty($z['hi']))<b>{{ $z['line'] ?? '' }}</b>@else{{ $z['line'] ?? '' }}@endif<small>{{ $z['sub'] ?? '' }}</small></div>
  </div>
@endforeach
</div>
@include('dossier.partials.qeyd')
