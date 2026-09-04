{{-- Holoqram yaması — TƏKRAR İŞLƏNƏN komponent.
     <x-holoqram id="h1" :olcu="44" etiket="HOLOQRAM"/>
     `id` səhifə daxilində unikal olmalıdır: qradiyent `url(#id-h)` ilə
     bağlanır və eyni id iki yamada rəngi bir yerdən çəkərdi. --}}
@props(['id', 'olcu' => 44, 'etiket' => '', 'opaklik' => 0.55])
<span {{ $attributes->merge(['class' => 'nisan-holo']) }} aria-hidden="true"
      style="display:inline-block;width:{{ (int) $olcu }}px;line-height:0;text-align:center">
  <svg viewBox="0 0 100 100" style="width:100%;height:auto;display:block;overflow:visible">
    {!! \App\Support\Nisan::holoqram($id, ['opaklik' => (float) $opaklik]) !!}
  </svg>
  @if($etiket !== '')
    <span class="nisan-holo-e">{{ $etiket }}</span>
  @endif
</span>
