{{-- Şəkil kartoçkası — foto və ya sənəd surəti, altında rəsmi izah və nömrə.
     Şəkil yoxdursa boş çərçivə render olunur: sxem hazırdır, fayl sonra
     gələ bilər və o vaxt heç nə dəyişmir.

     Şəkil KİTABXANA AÇARI ilə göstərilir, fayl adı və ya URL ilə yox —
     `kart` blokunun qaydası: fayl yenidən yüklənəndə adı dəyişir, açar isə
     qalır. Şəkil olanda çap vərəqə YAPIŞDIRILMIŞ görünür (<x-yapisiq>):
     ağ haşiyə, skoç, kənarında möhür — bölmənin bütün şəkil yerləri kimi.

     Əyilik blokun öz məzmunundan törəyir, `rand()`-dan yox: yenidən açılanda
     yerini dəyişən yapışdırma sənədi saxta elan edir. --}}
@php($sekiller = $sekiller ?? [])
@php($acar = (string) ($b['sekil'] ?? ''))
@php($sekil = $acar !== '' ? ($sekiller[$acar] ?? null) : null)
@php($fTox = crc32($acar . '|' . (string) ($b['izah'] ?? '') . '|' . (string) ($b['no'] ?? '')))
<div class="p-foto p-foto-{{ str_replace(':', '-', (string) ($b['nisbet'] ?? '4:3')) }}">
  <x-yapisiq :bos="$sekil === null"
             :bucaq="($fTox % 9 - 4) * 0.35"
             :mid="'pf-' . substr(md5((string) $fTox), 0, 6)"
             no="{{ isset($b['no']) ? '№ ' . $b['no'] : '' }}">
    @if($sekil !== null)
      <img src="{{ $sekil->url($slug ?? '', 'orta') }}" alt="{{ $b['izah'] ?? '' }}" loading="lazy">
    @else
      <span class="ev-foto-bos">foto əlavə edilməyib</span>
    @endif
  </x-yapisiq>
  <div class="p-foto-izah">@if(isset($b['no']))Şəkil {{ $b['no'] }} — @endif{{ $b['izah'] ?? '' }}</div>
</div>
@include('dossier.partials.kenar')
