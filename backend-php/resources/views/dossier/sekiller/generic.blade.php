{{-- Sadə haşiyə — növü seçilməmiş şəkil bura düşür.
     Bütün beş qardaşı kimi: şəkil, altında quru izah sətri. --}}
<figure class="p-sekil p-sekil-generic">
  <div class="ps-cer"><img src="{{ $src }}" alt="{{ $izah }}" loading="lazy"></div>
  @if($izah !== '')<figcaption class="ps-izah">{{ $izah }}</figcaption>@endif
</figure>
