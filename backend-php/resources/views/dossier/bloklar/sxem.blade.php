{{-- Sxem bloku — SVG bazadan gəlir və olduğu kimi çıxarılır (süzgəcdən sonra).
     Nişanlar sxemin ÖZ KODUNDA DEYİL, ayrıca məlumatdır: eyni sxemi müxtəlif
     mərhələlərdə fərqli nişanlarla göstərmək mümkün olsun deyə. --}}
@php($sxem = \App\Support\Dossier\Sxem::temizle($b['svg'] ?? ''))
@php($nisanlar = (array) ($b['nisanlar'] ?? []))
@if($sxem !== '')
<div class="p-sxem">
  {!! $nisanlar === [] ? $sxem : \App\Support\Dossier\Sxem::nisanla($sxem, $nisanlar) !!}
</div>
@if($nisanlar !== [])
  @php($izahlar = array_values(array_filter($nisanlar, fn ($n) => ($n['nov'] ?? '') === 'noqte' && ! empty($n['izah']))))
  @if($izahlar !== [])
  <div class="p-sxem-izah">
    @foreach($izahlar as $n){{ $n['no'] ?? ($loop->index + 1) }} — {{ $n['izah'] }}@if(! $loop->last) · @endif @endforeach
  </div>
  @endif
@endif
@endif
@include('dossier.partials.kenar')
