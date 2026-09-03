<div class="p-title">{{ $c['title'] ?? '' }}</div>
@if(trim((string) ($c['subtitle'] ?? '')) !== '')
<div class="p-sub">{{ $c['subtitle'] }}</div>
@endif
