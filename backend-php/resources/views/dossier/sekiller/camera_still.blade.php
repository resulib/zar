{{-- Kamera kadrı — boz haşiyə, künclərdə vaxt damğası, yüngül dənəvər filtr.
     Damğanın mətni izahın ilk hissəsindən götürülmür: kadr nə vaxt çəkildiyini
     özü bildirməlidir, ona görə `damga` ayrıca verilir və boş qala bilər. --}}
<figure class="p-sekil p-sekil-kamera">
  <div class="ps-cer">
    <img src="{{ $src }}" alt="{{ $izah }}" loading="lazy">
    <span class="ps-dene" aria-hidden="true"></span>
    @if($damga !== '')
      <span class="ps-vaxt ps-vaxt-sag">{{ $damga }}</span>
    @endif
    <span class="ps-vaxt ps-vaxt-sol">CAM</span>
  </div>
  @if($izah !== '')<figcaption class="ps-izah">{{ $izah }}</figcaption>@endif
</figure>
