{{-- Yapışdırılmış çap — bölmənin BÜTÜN şəkil yerlərinin ortaq görkəmi.

     Şəkil sənədin içinə yerləşdirilmiş qrafika deyil, ÜSTÜNƏ yapışdırılmış
     çapdır: ağ çap haşiyəsi, yüngül əyilik, kölgə, yuxarı künclərdə skoç
     lenti və çapın kənarına oturan möhür — yarısı fotoda, yarısı vərəqdə,
     ki fotonu dəyişdirmək möhürü də pozmadan mümkün olmasın. Maddi sübut
     kartları, `foto` bloku və mətndaxili şəkil üslubları hamısı bu
     komponentdən keçir: qayda bir yerdə yaşayır və yeni şəkil yeri açılanda
     görkəm özü gəlir.

     <x-yapisiq :bos="$sekil === null" :bucaq="-1.2" mid="pf-a1b2c3" no="№ 3">
       <img …> və ya <span class="ev-foto-bos">foto əlavə edilməyib</span>
     </x-yapisiq>

     `bos` — çərçivə ayrılıb, hələ heç nə yapışdırılmayıb: nə lent, nə möhür,
     nə əyilik («foto sonra əlavə ediləcək» halı). `bucaq` HEÇ VAXT təsadüfi
     olmur — indeksdən və ya şəklin öz məzmunundan törəyir: yenidən açılanda
     yerini dəyişən yapışdırma sənədi saxta elan edir (`Imza::yol()` qaydası).
     `mid` möhürün id-sidir və səhifə daxilində unikal olmalıdır — qövs
     yazısı `href="#id-u"` ilə bağlanır.

     Sinif adları `ev-*` tarixidir: naxış maddi sübut kartlarından doğulub
     və `check-dossier-admin.js` onları ölçür — ad dəyişməsi testləri də,
     CSS-i də boş yerə tərpədərdi. --}}
@props([
    'bos'    => false,
    'bucaq'  => 0,
    'mid'    => '',
    'ust'    => \App\Support\Dossier\Byuro::QISA . ' · İŞ MATERİALI',
    'orta'   => 'FOTO',
    'no'     => '',
    'etiket' => 'FİKTİV',
    'alt'    => 'QEYDƏ ALINIB',
])
<div {{ $attributes->merge(['class' => 'ev-foto' . ($bos ? '' : ' ev-foto-var')]) }}
     style="--ev-bucaq:{{ number_format((float) $bucaq, 2, '.', '') }}deg">
  <div class="ev-foto-k">{{ $slot }}</div>

  @unless($bos)
    {{-- İki lent YUXARI künclərdə: şəkil belə vurulur. Aşağı sağ künc
         möhürə qalır. --}}
    <span class="ev-skoc ev-skoc-u" aria-hidden="true"></span>
    <span class="ev-skoc ev-skoc-a" aria-hidden="true"></span>
    <span class="ev-foto-m" aria-hidden="true">
      <x-mohur :id="$mid" :ust="$ust" :orta="$orta" :no="$no"
               :etiket="$etiket" :alt="$alt" :olcu="84"/>
    </span>
  @endunless
</div>
