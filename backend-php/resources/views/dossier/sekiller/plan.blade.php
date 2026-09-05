{{-- Mənzil/ərazi planı — ağ fon, nazik texniki haşiyə.
     Fon qəsdən vərəqin özündən ağdır: plan çap olunmuş cizgidir, fotoşəkil
     deyil, və onu kağızdan ayıran şey məhz bu təmiz sahədir. Çap özü isə
     vərəqə yapışdırılıb (<x-yapisiq>) — bütün şəkil yerləri kimi. --}}
<figure class="p-sekil p-sekil-plan">
  <x-yapisiq :bucaq="$bucaq" :mid="'ps-' . $sekil->id">
    <div class="ps-cer"><img src="{{ $src }}" alt="{{ $izah }}" loading="lazy"></div>
  </x-yapisiq>
  @if($izah !== '')<figcaption class="ps-izah">{{ $izah }}</figcaption>@endif
</figure>
