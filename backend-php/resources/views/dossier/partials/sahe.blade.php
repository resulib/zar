{{-- Nöqtəli xətlərlə doldurulan sahələr — blankın üstündən yazılmış kimi. --}}
@if(! empty($c['fields']))
<div class="p-fields">
@foreach($c['fields'] as $f)
<div><b>{{ $f[0] ?? '' }}</b><i></i><span>{{ $f[1] ?? '' }}</span></div>
@endforeach
</div>
@endif
