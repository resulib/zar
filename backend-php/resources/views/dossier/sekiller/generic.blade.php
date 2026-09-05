{{-- Sadə haşiyə — növü seçilməmiş şəkil bura düşür.
     Bütün beş qardaşı kimi: yapışdırılmış çap (<x-yapisiq>), altında quru
     izah sətri. --}}
<figure class="p-sekil p-sekil-generic">
  <x-yapisiq :bucaq="$bucaq" :mid="'ps-' . $sekil->id">
    <div class="ps-cer"><img src="{{ $src }}" alt="{{ $izah }}" loading="lazy"></div>
  </x-yapisiq>
  @if($izah !== '')<figcaption class="ps-izah">{{ $izah }}</figcaption>@endif
</figure>
