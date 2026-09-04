{{-- İmza bloku — solda vəzifə, imza və çap adı; sağda tarix.

     İMZA ŞRİFT DEYİL, CIZMADIR. Əvvəllər burada əlyazma şrifti ilə yazılmış
     soyad dururdu və məhz ona görə saxta görünürdü: real imzada soyad
     oxunmur. `Imza::yol()` saytın digər bölməsindəki `doc.js signature()`
     funksiyasının eynisidir — hətta yol sətri də bayt-bayt üst-üstə düşür,
     yəni iki bölmənin imzası bir əldən çıxmış kimi görünür.

     ÇAP ADI QALIR: rəsmi sənəddə imzanın altında həmişə mötərizədə ad-soyad
     yazılır — imzanın kimə aid olduğunu oxunmaz cızma yox, məhz o sətir
     bildirir. İmza xətti də vacibdir: imza boşluqda durmur, xəttin üstündə
     durur və onu bir az kəsir. Ad boş olanda cızma yoxdur, yalnız boş xətt
     qalır — bəzi sənədlərdə imza yeri doldurulmamış olur. --}}
@php($ad = trim((string) ($b['ad'] ?? '')))
<div class="p-sign">
  <div class="p-sign-l">
    <div class="p-sign-v">{{ $b['vezife'] ?? '' }}</div>
    <div class="p-sign-x">
      @if($ad !== '')
        <span class="sig" role="img" aria-label="imza">
          <svg viewBox="0 0 {{ \App\Support\Dossier\Imza::EN }} {{ \App\Support\Dossier\Imza::HUND }}">
            <path d="{{ \App\Support\Dossier\Imza::yol($ad) }}"/>
          </svg>
        </span>
      @endif
    </div>
    <div class="p-sign-c">{{ $ad !== '' ? '(' . $ad . ')' : '(imza)' }}</div>
  </div>
  <div class="p-sign-d">{{ $b['tarix'] ?? '' }}</div>
</div>
@include('dossier.partials.kenar')
