{{-- MƏHKƏMƏ QƏRARI — işin hüquqi sonu.

     `qerar` blankından ayrıdır və ayrı olmalıdır: orada grif «AFİB bölmə
     rəisi» yazır, yəni sənədi İSTİNTAQ təsdiq edir. Hökmü isə istintaq
     çıxara bilməz — ittihamı o irəli sürür, cəzanı məhkəmə verir. Eyni
     blankı işlətmək sənədin mənasını pozardı.

     Qurum sətri də ona görə `Byuro::MEHKEME`-dir, `$head` deyil: bu vərəq
     büronun blankında çıxmır.

     Qəbul sətri YOXDUR — hökm qeydə alınan material deyil, işi BAĞLAYAN
     sənəddir. --}}
@props(['head' => [], 'dossier', 'doc'])
<div class="p-blank p-blank-mehkeme">
  <x-blank.ust :head="[\App\Support\Dossier\Byuro::MEHKEME, \App\Support\Dossier\Byuro::QISA . ' · MƏHKƏMƏ HEYƏTİ']"
               :olcu="86" qeyd="AZADLIQDAN MƏHRUMETMƏ HAQQINDA"/>
</div>
<div class="p-rule p-rule-qalin"></div>
<div class="p-hokm">
  <span>AZƏRBAYCAN FİKTİV MƏHKƏMƏ KOLLEGİYASININ ADINDAN</span>
  <span>İş № {{ $dossier->no }} · {{ $dossier->place }}</span>
  {{-- Tarixsiz hökm hökm deyil: qərarın qüvvəyə minmə anı ondan sayılır. --}}
  <span>{{ \App\Support\Dossier\Tarix::yaz($dossier->vereqTarixi($doc)) }}</span>
</div>
