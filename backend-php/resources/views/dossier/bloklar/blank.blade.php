{{-- Blank başlığı — gerb, qurumun adı, qəbul sətri, ikiqat ayırıcı.
     Sənədin növündən asılı olmayaraq eyni komponentdir, mətn parametrdir:
     boş buraxılsa qovluğun öz başlıq sətirləri işlənir.

     RƏSMİ BLANKIN QURULUŞU: yuxarıda gerb, altında qurumun adı iri və
     hərfləri aralı, onun altında bölmə sətri, sonra ikiqat xətt — və yalnız
     bundan sonra qəbul sətri: solda çıxış nömrəsi, ortada «QEYDƏ ALINIB»
     möhürü, sağda vərəq nişanı. Ortadakı möhür məhz mərkəzdə durur, çünki
     real blankda kargüzarlıq möhürü sənədin ağzına vurulur.

     Nişan heç bir real dövlət simvolunu təkrarlamamalıdır: kəsik künclü
     vərəq konturu və iki nazik dairə — ulduz, aypara, alov, çələng yoxdur. --}}
@php($setirler = array_values(array_filter((array) ($b['setirler'] ?? []))) ?: $head)
@php($ad = $setirler[0] ?? '')
@php($alt = array_slice($setirler, 1))
<div class="p-blank">
  <div class="p-gerb" aria-hidden="true">
    <svg viewBox="0 0 72 72">
      <circle cx="36" cy="36" r="34"/>
      <circle class="ic" cx="36" cy="36" r="29"/>
      <path d="M25 18h15l11 11v25H25z"/>
      <path d="M40 18v11h11"/>
      <text x="36" y="48" text-anchor="middle">AFİB</text>
    </svg>
  </div>
  {{-- `.p-head` SARĞI OLARAQ QALIR: vərəq başlığının müqaviləsi budur və
       həm brauzer testi, həm də `tests/security.php` bu sinfi axtarır.
       Görkəm içəridəki elementlərdədir, ona görə sarğının adı dəyişmir. --}}
  <div class="p-head">
    <div class="p-qurum">{{ $ad }}</div>
    @foreach($alt as $l)
      <div class="p-qurum2">{{ $l }}</div>
    @endforeach
    <div class="p-qurum3">İSTİNTAQ MATERİALI · SURƏTİN ÇIXARILMASI QADAĞANDIR</div>
  </div>
</div>
<div class="p-rule"></div>

<div class="p-qebul">
  <div class="p-qebul-s">
    <div>Çıxış № <b>{{ $dossier->kod() }}-{{ $dossier->nomre() }}</b></div>
    <div>Vərəq <b>{{ $doc->page }}</b></div>
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
@include('dossier.partials.kenar')
