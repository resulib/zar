@if(! empty($c['body']))
<div class="p-body">
@foreach($c['body'] as $p)<p>{!! \App\Support\Dossier\Metn::inline($p, $vals) !!}</p>
@endforeach
</div>
@endif
