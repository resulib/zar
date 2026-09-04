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
  {{-- Gerb ORTAQ komponentdir: həndəsə `App\Support\Nisan`-dadır, burada
       yalnız mətn verilir. Eyni komponent üz qabığında və başqa yerlərdə də
       işlənir — dizayn bir yerdə dəyişir, hər yerdə dəyişir. --}}
  <x-gerb class="p-gerb" ad="{{ \App\Support\Dossier\Byuro::QISA }}"
          alt="EST. 2026" lent="İSTİNTAQ BÖLMƏSİ" :olcu="76"/>
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
