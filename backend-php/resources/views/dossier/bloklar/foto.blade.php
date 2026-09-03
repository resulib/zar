{{-- Şəkil kartoçkası — foto və ya sənəd surəti, altında rəsmi izah və nömrə.
     Şəkil yoxdursa boş çərçivə render olunur: sxem hazırdır, fayl sonra
     gələ bilər və o vaxt heç nə dəyişmir. --}}
<div class="p-foto p-foto-{{ str_replace(':', '-', (string) ($b['nisbet'] ?? '4:3')) }}">
  <div class="p-foto-cer">
    @if(! empty($b['sekil']))
      <img src="{{ $b['sekil'] }}" alt="{{ $b['izah'] ?? '' }}">
    @else
      <span class="p-foto-bos">foto əlavə edilməyib</span>
    @endif
  </div>
  <div class="p-foto-izah">@if(isset($b['no']))Şəkil {{ $b['no'] }} — @endif{{ $b['izah'] ?? '' }}</div>
</div>
@include('dossier.partials.kenar')
