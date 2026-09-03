@if(! empty($c['sign']))
<div class="p-sign">
  <div>{{ $c['sign']['post'] ?? '' }}<br><span class="sig">{{ $c['sign']['who'] ?? '' }}</span></div>
  <div>{{ $c['sign']['date'] ?? '' }}</div>
</div>
@endif
