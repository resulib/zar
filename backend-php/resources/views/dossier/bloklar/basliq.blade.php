{{-- Başlıq bloku — mərkəzdə sənədin adı, altında kiçik izah sətri. --}}
<div class="p-title">{{ $b['ad'] ?? '' }}</div>
@if(trim((string) ($b['alt'] ?? '')) !== '')
<div class="p-sub">{{ $b['alt'] }}</div>
@endif
@include('dossier.partials.kenar')
