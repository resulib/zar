{{-- Kodla bağlı sənəd. Kod BURADA YOXDUR: rəqəmlər sorğu ilə serverə gedir,
     müqayisə orada aparılır və düzgün olarsa sənədin məzmunu qaytarılır. --}}
<div class="lockwrap" data-kilid="{{ $doc->id }}">
  <div class="lock-t">{{ $c['lockTitle'] ?? 'BAĞLI SƏNƏD' }}</div>
  <div class="lock-s">{!! \App\Support\Dossier\Metn::inline($c['lockSub'] ?? '') !!}</div>
  <div class="dots" id="dots"><div class="dot"></div><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>
  <div class="keys">
    @foreach([1,2,3,4,5,6,7,8,9] as $n)<button class="key" type="button" data-k="{{ $n }}">{{ $n }}</button>@endforeach
    <button class="key" type="button" data-k="x">←</button>
    <button class="key" type="button" data-k="0">0</button>
    <button class="key" type="button" data-k="ok">↵</button>
  </div>
  <div class="lock-err" id="lerr"></div>
  @if(trim((string) $doc->lock_hint) !== '')
  <div class="p-note lock-hint">{{ $doc->lock_hint }}</div>
  @endif
</div>
