{{-- Nömrələnmiş kartoçkalar. `pen` — əl yazısı ilə qeyd. --}}
@foreach($c['items'] ?? [] as $i => $it)
<div class="ev">
  <div class="ev-h"><span class="ev-n">{{ $i + 1 }}</span><span class="ev-t">{{ $it['t'] ?? '' }}</span></div>
  <div class="ev-d @if(! empty($it['pen'])) ev-el @endif">{!! \App\Support\Dossier\Metn::inline($it['d'] ?? '', $vals) !!}</div>
</div>
@endforeach
