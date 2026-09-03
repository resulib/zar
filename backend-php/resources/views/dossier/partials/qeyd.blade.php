@if(trim((string) ($c['note'] ?? '')) !== '')
<div class="p-note">{!! \App\Support\Dossier\Metn::inline($c['note'], $vals) !!}</div>
@endif
