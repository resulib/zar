{{-- Gilyoş naxışı — TƏKRAR İŞLƏNƏN komponent.
     <x-naxis :opaklik="0.14"/>  — valideynin rəngini götürür (`currentColor`).
     Vərəqin ARXA qatındadır: mətnin oxunuşuna mane olmamalıdır, ona görə
     opaklıq kiçikdir və xətt qalınlığı 0.16 vahiddir. --}}
@props(['opaklik' => 0.16])
<span {{ $attributes->merge(['class' => 'nisan-naxis']) }} aria-hidden="true"
      style="display:block;line-height:0">
  {{-- Nisbət SAXLANILIR: uzadılanda rozet dalğalanan cızığa çevrilir və
       naxış «qiymətli kağız» hissini itirir. --}}
  <svg viewBox="0 0 100 100" style="width:100%;height:auto;display:block">
    {!! \App\Support\Nisan::naxis(['opaklik' => (float) $opaklik]) !!}
  </svg>
</span>
