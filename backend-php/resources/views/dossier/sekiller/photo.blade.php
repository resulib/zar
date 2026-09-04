{{-- Foto kartoçkası — qovluğa tikilmiş şəkil, altında rəsmi izah.
     Mövcud `foto` blokunun görkəmi ilə eynidir; fərq yalnız ondadır ki, bu,
     mətnin ORTASINA düşür və bloklar siyahısına yazılmır. --}}
<figure class="p-sekil p-sekil-photo">
  <div class="ps-cer"><img src="{{ $src }}" alt="{{ $izah }}" loading="lazy"></div>
  @if($izah !== '')<figcaption class="ps-izah">{{ $izah }}</figcaption>@endif
</figure>
