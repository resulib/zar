{{-- Kartoçka siyahısı — nömrələnmiş bloklar, hər birində başlıq və təsvir.
     Maddi sübutlar, əşyaların siyahısı, qutunun içindəkilər — hamısı bu.

     HƏR SÜBUTUN ŞƏKİL YERİ VAR və şəkil olmayanda da qalır: real maddi
     sübut protokolunda hər əşyanın fotosu üçün yer ayrılır və boş qalan
     çərçivə «foto sonra əlavə ediləcək» deməkdir. Yer sonradan açılsaydı,
     vərəqin quruluşu şəkil gələndə dəyişərdi.

     FOTO VƏRƏQƏ YAPIŞDIRILMIŞ ÇAPDIR, sənədin içinə yerləşdirilmiş şəkil
     deyil: ağ haşiyəsi, kölgəsi və künclərində skoç lenti var, üstündən isə
     möhür vurulub — YARISI FOTODA, YARISI VƏRƏQDƏ. Möhürün bu cür oturması
     təsadüfi deyil: real qovluqda o, məhz fotonun sənədə aid olduğunu təsdiq
     etmək üçün ikisinin sərhədinə vurulur, yəni fotonu dəyişdirmək möhürü də
     pozmadan mümkün olmasın.

     Şəkil KİTABXANA AÇARI ilə göstərilir, fayl adı ilə yox: sətir silinib
     yenidən yüklənəndə fayl adı dəyişir, açar isə qalır. --}}
@php($sekiller = $sekiller ?? [])
{{-- Möhürün id-si səhifə daxilində UNİKAL olmalıdır — qövs yazısı
     `href="#id-u"` ilə bağlanır. Blokun məzmunundan törəyir, `rand()`-dan
     yox: vərəq ikinci dəfə açılanda eyni qalmalıdır. --}}
@php($evUid = substr(md5(json_encode($b['kartlar'] ?? [])), 0, 6))
@foreach($b['kartlar'] ?? [] as $i => $k)
<div class="ev">
  <div class="ev-h"><span class="ev-n">{{ $i + 1 }}</span><span class="ev-t">{{ $k['ad'] ?? '' }}</span></div>

  @php($acar = (string) ($k['sekil'] ?? ''))
  @php($sekil = $acar !== '' ? ($sekiller[$acar] ?? null) : null)
  {{-- Əyilik indeksdən törəyir: iki foto yan-yana eyni bucaqda dayansaydı,
       onlar əl ilə yapışdırılmış deyil, şablon görünərdi. Yapışdırma görkəmi
       (haşiyə, skoç, möhür) ortaq komponentdədir — <x-yapisiq>. --}}
  <x-yapisiq :bos="$sekil === null"
             :bucaq="(($i * 37) % 9 - 4) * 0.4"
             :mid="'ev-' . $evUid . '-' . $i"
             ust="{{ \App\Support\Dossier\Byuro::QISA }} · MADDİ SÜBUT"
             orta="ƏŞYA" no="№ {{ $i + 1 }}">
    @if($sekil !== null)
      <img src="{{ $sekil->url($slug ?? '', 'orta') }}" alt="{{ $k['ad'] ?? '' }}" loading="lazy">
    @else
      <span class="ev-foto-bos">foto əlavə edilməyib</span>
    @endif
  </x-yapisiq>

  <div class="ev-d @if(! empty($k['elyazma'])) ev-el @endif">{!! \App\Support\Dossier\Metn::inline($k['metn'] ?? '', $vals) !!}</div>
</div>
@endforeach
@include('dossier.partials.kenar')
