{{-- Kartoçka siyahısı — nömrələnmiş bloklar, hər birində başlıq və təsvir.
     Maddi sübutlar, əşyaların siyahısı, qutunun içindəkilər — hamısı bu. --}}
@foreach($b['kartlar'] ?? [] as $i => $k)
<div class="ev">
  <div class="ev-h"><span class="ev-n">{{ $i + 1 }}</span><span class="ev-t">{{ $k['ad'] ?? '' }}</span></div>
  <div class="ev-d @if(! empty($k['elyazma'])) ev-el @endif">{!! \App\Support\Dossier\Metn::inline($k['metn'] ?? '', $vals) !!}</div>
</div>
@endforeach
@include('dossier.partials.kenar')
