{{-- Sənəd surəti — azca əyri yerləşdirilmiş, kağız faktura fonu ilə.
     Əyilik sabit deyil, şəklin id-sindən törəyir: iki surət yan-yana düşəndə
     eyni bucaqla dayanmaları onları çap məhsulu deyil, şablon göstərir. --}}
<figure class="p-sekil p-sekil-scan" style="--ps-bucaq:{{ $bucaq }}deg">
  <div class="ps-cer">
    <img src="{{ $src }}" alt="{{ $izah }}" loading="lazy">
  </div>
  @if($izah !== '')<figcaption class="ps-izah">{{ $izah }}</figcaption>@endif
</figure>
