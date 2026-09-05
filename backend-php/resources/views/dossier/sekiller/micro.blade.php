{{-- Mikroskop kadrı — dairəvi maska, obyektiv görkəmi.
     Dairə `clip-path`-dir, şəkil faylı deyil: kadr hər ölçüdə iti qalmalıdır.
     Dairəvi çap ağ kağıza çap olunub və vərəqə yapışdırılıb (<x-yapisiq>). --}}
<figure class="p-sekil p-sekil-micro">
  <x-yapisiq :bucaq="$bucaq" :mid="'ps-' . $sekil->id">
    <div class="ps-cer">
      <img src="{{ $src }}" alt="{{ $izah }}" loading="lazy">
      <span class="ps-tor" aria-hidden="true"></span>
    </div>
  </x-yapisiq>
  @if($izah !== '')<figcaption class="ps-izah">{{ $izah }}</figcaption>@endif
</figure>
