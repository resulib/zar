{{-- Dairəvi möhür — TƏKRAR İŞLƏNƏN komponent.
     <x-mohur id="m1" ust="AFİB · İSTİNTAQ BÖLMƏSİ" orta="QEYDƏ ALINIB"
              no="№ 04-A" etiket="FİKTİV" alt="OYUN MATERİALI" :olcu="140"/>
     `id` səhifə daxilində unikal olmalıdır: qövs yazısı `href="#id-u"` ilə
     bağlanır və eyni id iki dəfə işlənsə, hər iki möhür eyni qövsə düşür. --}}
@props(['id', 'ust' => '', 'alt' => '', 'orta' => '', 'no' => '', 'etiket' => '', 'olcu' => 140])
<span {{ $attributes->merge(['class' => 'nisan-mohur']) }}
      style="display:inline-block;width:{{ (int) $olcu }}px;line-height:0"
      aria-hidden="true">
  <svg viewBox="0 0 100 100" style="width:100%;height:auto;display:block;overflow:visible">
    {!! \App\Support\Nisan::mohur($id, [
        'ust' => $ust, 'alt' => $alt, 'orta' => $orta, 'no' => $no, 'etiket' => $etiket,
    ]) !!}
  </svg>
</span>
