{{-- RƏSMİ BLANK — standart hal. Gerb, qurum, ikiqat xətt, qəbul sətri:
     solda çıxış nömrəsi, ORTADA kargüzarlıq möhürü, sağda sənədin adı.
     Möhür mərkəzdədir, çünki real blankda o, sənədin ağzına vurulur. --}}
@props(['head' => [], 'dossier', 'doc'])
<div class="p-blank p-blank-resmi">
  <x-blank.ust :head="$head"/>
</div>
<div class="p-rule"></div>
<div class="p-qebul">
  <div class="p-qebul-s">
    <div>Çıxış № <b>{{ $dossier->kod() }}-{{ $dossier->nomre() }}</b></div>
    <div>Vərəq <b>{{ $doc->page }}</b></div>
    <div>{{ \App\Support\Dossier\Tarix::qisa($dossier->vereqTarixi($doc)) }}</div>
  </div>
  <div class="p-damga" aria-hidden="true">
    <span class="p-damga-u">{{ \App\Support\Dossier\Byuro::QISA }} · İSTİNTAQ BÖLMƏSİ</span>
    <span class="p-damga-o">QEYDƏ ALINIB</span>
    <span class="p-damga-a">iş üzrə material</span>
  </div>
  <div class="p-qebul-g">
    <div>{{ $doc->kind }}</div>
    <div><b>{{ $doc->name }}</b></div>
  </div>
</div>
