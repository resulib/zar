{{-- Qurumun gerbi — TƏKRAR İŞLƏNƏN komponent.
     Həndəsə `App\Support\Nisan::gerb()`-dədir, mətn parametrdir:
     <x-gerb ad="AFİB" alt="EST. 2026" lent="İSTİNTAQ BÖLMƏSİ" :olcu="56"/>
     Rəng `currentColor`-dur, yəni valideyn elementin rəngini götürür. --}}
@props(['ad' => 'AFİB', 'alt' => '', 'lent' => '', 'olcu' => 56, 'rozet' => true, 'celeng' => true])
<span {{ $attributes->merge(['class' => 'nisan-gerb']) }}
      style="display:inline-block;width:{{ (int) $olcu }}px;line-height:0"
      aria-hidden="true">
  <svg viewBox="0 0 100 100" style="width:100%;height:auto;display:block;overflow:visible">
    {!! \App\Support\Nisan::gerb(['ad' => $ad, 'alt' => $alt, 'lent' => $lent, 'rozet' => $rozet, 'celeng' => $celeng]) !!}
  </svg>
</span>
