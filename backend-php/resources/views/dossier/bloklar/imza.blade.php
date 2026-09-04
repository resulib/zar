{{-- İmza bloku — solda vəzifə, imzanın özü və çap adı; sağda tarix.

     İMZA XƏTTİ VACİBDİR. Rəsmi sənəddə imza boşluqda durmur: xəttin üstündə
     durur, altında isə həmin adam ÇAP HƏRFLƏRİ ilə yazılır. Əlyazma adı
     xətti bir az kəsir — real imza da kəsir və məhz bu, «yazılmış» hissini
     verir. Ad boş olanda yalnız vəzifə qalır: bəzi sənədlərdə imza yeri
     doldurulmamış olur və bu da real haldır. --}}
<div class="p-sign">
  <div class="p-sign-l">
    <div class="p-sign-v">{{ $b['vezife'] ?? '' }}</div>
    @if(($b['ad'] ?? '') !== '')
      <div class="p-sign-x"><span class="sig">{{ $b['ad'] }}</span></div>
      <div class="p-sign-c">({{ $b['ad'] }})</div>
    @else
      <div class="p-sign-x"></div>
      <div class="p-sign-c">(imza)</div>
    @endif
  </div>
  <div class="p-sign-d">{{ $b['tarix'] ?? '' }}</div>
</div>
@include('dossier.partials.kenar')
