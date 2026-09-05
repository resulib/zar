{{-- Sənəd surəti — kağız faktura fonu ilə.
     Əyilik sabit deyil, şəklin id-sindən törəyir və artıq ortaq yapışdırma
     komponentindən gəlir (<x-yapisiq> `bucaq` alır): iki surət yan-yana
     düşəndə eyni bucaqla dayanmaları onları çap məhsulu deyil, şablon
     göstərir. --}}
<figure class="p-sekil p-sekil-scan">
  <x-yapisiq :bucaq="$bucaq" :mid="'ps-' . $sekil->id">
    <div class="ps-cer">
      <img src="{{ $src }}" alt="{{ $izah }}" loading="lazy">
    </div>
  </x-yapisiq>
  @if($izah !== '')<figcaption class="ps-izah">{{ $izah }}</figcaption>@endif
</figure>
