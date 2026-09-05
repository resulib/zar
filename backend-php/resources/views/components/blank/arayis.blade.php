{{-- ARAYIŞ — təqdim olunmaq üçün verilən sənəd. Gerb SOLDA və kiçikdir,
     qurum sətirləri onun yanında sola düzülür; sağda isə ünvan bloku durur.
     Bu, arayışın öz forması — mərkəzləşdirilmiş başlıq deyil, məktub kimi
     sol-sağ bölünmüş baş hissə. --}}
@props(['head' => [], 'dossier', 'doc'])
<div class="p-blank p-blank-arayis">
  <div class="p-arayis-sol">
    <x-blank.ust :head="$head" :olcu="52" qeyd=""/>
    <div class="p-arayis-no">
      <div>№ <b>{{ $dossier->kod() }}-{{ $dossier->nomre() }}</b></div>
      <div>{{ \App\Support\Dossier\Tarix::yaz($dossier->vereqTarixi($doc)) }}</div>
    </div>
  </div>
  <div class="p-arayis-sag">
    <div class="p-arayis-k">TƏQDİM OLUNUR</div>
    <div>İş üzrə istintaq materiallarına</div>
    <div>əlavə edilmək üçün</div>
    <div class="p-arayis-v">vərəq {{ $doc->page }}</div>
  </div>
</div>
<div class="p-rule"></div>
