{{-- Effekt nümunəsi: eyni mətn, fərqli fiziki qat. --}}
@php($egilme = $kagiz['egilme'] ?? null)
<div class="paper {{ \App\Services\DossierService::kagizSinif($kagiz) }}"
     @if($egilme)style="--egilme:{{ $egilme }}deg"@endif>
  @include('dossier.partials.kagiz')
  <div class="p-body"><p>Baxış «Sədəf» şadlıq sarayının mətbəx blokunun arxasındakı
    texniki dəhlizdə aparılmışdır. Dəhliz eni 1 m 40 sm, uzunluğu 9 m-dir.</p></div>
</div>
