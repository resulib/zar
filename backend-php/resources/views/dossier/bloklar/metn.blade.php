{{-- Mətn bloku — adi abzaslar. `cerceve` ilə qeyd qutusuna çevrilir.
     İçindəki işarələr `Metn::inline()` tərəfindən açılır: qalın söz,
     əl ilə əlavə, üstündən xətt, oxunmaz hissə, dairəyə alınmış söz. --}}
@php($sinif = ! empty($b['cerceve']) ? 'p-note' : 'p-body')
<div class="{{ $sinif }} @if(($b['duz'] ?? true) === false) p-sol @endif">
@foreach($b['abzaslar'] ?? [] as $p)<p>{!! \App\Support\Dossier\Metn::inline($p, $vals) !!}</p>
@endforeach
</div>
@include('dossier.partials.kenar')
