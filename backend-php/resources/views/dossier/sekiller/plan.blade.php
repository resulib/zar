{{-- Mənzil/ərazi planı — ağ fon, nazik texniki haşiyə.
     Fon qəsdən vərəqin özündən ağdır: plan çap olunmuş cizgidir, fotoşəkil
     deyil, və onu kağızdan ayıran şey məhz bu təmiz sahədir. --}}
<figure class="p-sekil p-sekil-plan">
  <div class="ps-cer"><img src="{{ $src }}" alt="{{ $izah }}" loading="lazy"></div>
  @if($izah !== '')<figcaption class="ps-izah">{{ $izah }}</figcaption>@endif
</figure>
