{{-- LÖVHƏ QATLARI — barmaq izi və (istəyə görə) qırmızı sap.

     Ayrıca partial-dır, çünki üç yerdə lazımdır: ana səhifənin birinci
     ekranı, ortaq səhifə başlığı və müstəntiq səhifəsindəki qonaq çağırışı.
     SVG-ni köçürmək onun üç yerdə bir-birindən sürüşməsi demək olardı.

     $sap — sapı çəkmək (yalnız birinci ekranda: orada boş yer var). --}}
<div class="sbas-lovhe" aria-hidden="true">
  {{-- Barmaq izi UYDURMADIR: doqquz iç-içə ellips. Konkret adamın izi
       deyil və ola bilməz. --}}
  <svg class="sbas-iz" viewBox="0 0 200 240" preserveAspectRatio="xMidYMid meet">
    @for($i = 0; $i < 9; $i++)
      <ellipse cx="100" cy="120" rx="{{ 16 + $i * 9 }}" ry="{{ 22 + $i * 11 }}"
               transform="rotate({{ -8 + $i }} 100 120)"/>
    @endfor
    <path d="M100 62v116M74 78c14 26 14 62 0 88M126 78c-14 26-14 62 0 88"/>
  </svg>

  @if(! empty($sap))
    <span class="hero-sap hero-sap-1"></span>
    <span class="hero-sap hero-sap-2"></span>
  @endif
</div>
