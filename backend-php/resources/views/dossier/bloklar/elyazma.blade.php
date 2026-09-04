{{-- Əlyazma bloku — QISA mətn üçün. Uzun izahatı bununla vermə: yoxlayıcı
     həddi aşan mətnə xəbərdarlıq verir.
     Xarakter parametrdir; hər biri fərqli şrift, əyilmə və sətir aralığıdır.
     Azərbaycan hərflərini daşıyan cəmi iki əlyazma ailəsi var, ona görə dörd
     xarakter iki ailə + əyilmə/sıxlıq/ölçü ilə qurulur. --}}
@php($x = in_array($b['xarakter'] ?? '', \App\Support\Dossier\BlokSxemi::XARAKTERLER, true) ? $b['xarakter'] : 'sakit')
<div class="p-elyazma p-el-{{ $x }}" @if(isset($b['bucaq']))style="--bucaq:{{ (float) $b['bucaq'] }}deg"@endif>{!! \App\Support\Dossier\Metn::inline($b['metn'] ?? '', $vals) !!}</div>
@include('dossier.partials.kenar')
