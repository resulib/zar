{{-- Foto kartoçkası — qovluğa yapışdırılmış şəkil, altında rəsmi izah.
     Mövcud `foto` blokunun görkəmi ilə eynidir (<x-yapisiq>); fərq yalnız
     ondadır ki, bu, mətnin ORTASINA düşür və bloklar siyahısına yazılmır. --}}
<figure class="p-sekil p-sekil-photo">
  <x-yapisiq :bucaq="$bucaq" :mid="'ps-' . $sekil->id">
    <div class="ps-cer"><img src="{{ $src }}" alt="{{ $izah }}" loading="lazy"></div>
  </x-yapisiq>
  @if($izah !== '')<figcaption class="ps-izah">{{ $izah }}</figcaption>@endif
</figure>
