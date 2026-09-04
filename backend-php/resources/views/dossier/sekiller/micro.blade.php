{{-- Mikroskop kadrı — dairəvi maska, obyektiv görkəmi.
     Dairə `clip-path`-dir, şəkil faylı deyil: kadr hər ölçüdə iti qalmalıdır. --}}
<figure class="p-sekil p-sekil-micro">
  <div class="ps-cer">
    <img src="{{ $src }}" alt="{{ $izah }}" loading="lazy">
    <span class="ps-tor" aria-hidden="true"></span>
  </div>
  @if($izah !== '')<figcaption class="ps-izah">{{ $izah }}</figcaption>@endif
</figure>
