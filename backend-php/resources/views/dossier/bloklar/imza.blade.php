{{-- İmza bloku — solda vəzifə və imza, sağda tarix. --}}
<div class="p-sign">
  <div>{{ $b['vezife'] ?? '' }}<br><span class="sig">{{ $b['ad'] ?? '' }}</span></div>
  <div>{{ $b['tarix'] ?? '' }}</div>
</div>
@include('dossier.partials.kenar')
