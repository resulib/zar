{{-- Blankın ORTAQ üst hissəsi — gerb və qurum sətirləri.
     Hər blank növü bunu işlədir, altındakı hissə isə növə görə dəyişir.
     `.p-head` SARĞI OLARAQ QALIR: vərəq başlığının müqaviləsi budur, həm
     brauzer testi, həm də `tests/security.php` bu sinfi axtarır. --}}
@props(['head' => [], 'olcu' => 76, 'qeyd' => 'İSTİNTAQ MATERİALI · SURƏTİN ÇIXARILMASI QADAĞANDIR'])
@php($ad = $head[0] ?? '')
@php($alt = array_slice($head, 1))
<x-gerb class="p-gerb" ad="{{ \App\Support\Dossier\Byuro::QISA }}"
        alt="EST. 2026" lent="İSTİNTAQ BÖLMƏSİ" :olcu="$olcu"/>
<div class="p-head">
  <div class="p-qurum">{{ $ad }}</div>
  @foreach($alt as $l)
    <div class="p-qurum2">{{ $l }}</div>
  @endforeach
  @if($qeyd !== '')
    <div class="p-qurum3">{{ $qeyd }}</div>
  @endif
</div>
