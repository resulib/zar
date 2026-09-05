{{-- Kamera kadrı — boz haşiyə, künclərdə vaxt damğası, yüngül dənəvər filtr.
     Damğanın mətni izahın ilk hissəsindən götürülmür: kadr nə vaxt çəkildiyini
     özü bildirməlidir, ona görə `damga` ayrıca verilir və boş qala bilər.
     Çap vərəqə yapışdırılmış görünür — <x-yapisiq>, bütün şəkil yerləri kimi. --}}
<figure class="p-sekil p-sekil-kamera">
  <x-yapisiq :bucaq="$bucaq" :mid="'ps-' . $sekil->id">
    <div class="ps-cer">
      <img src="{{ $src }}" alt="{{ $izah }}" loading="lazy">
      <span class="ps-dene" aria-hidden="true"></span>
      @if($damga !== '')
        <span class="ps-vaxt ps-vaxt-sag">{{ $damga }}</span>
      @endif
      <span class="ps-vaxt ps-vaxt-sol">CAM</span>
    </div>
  </x-yapisiq>
  @if($izah !== '')<figcaption class="ps-izah">{{ $izah }}</figcaption>@endif
</figure>
