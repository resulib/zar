{{-- Bir sənədin tam gövdəsi. Bu görünüş AJAX ilə gətirilir və qabıqdakı
     ekrana yazılır — sənədlərin məzmunu heç vaxt qabaqcadan yüklənmir. --}}
<div class="paper" data-sened="{{ $doc->id }}">
@if($bagli)
  @include('dossier.partials.kilid')
@else
  @include('dossier.partials.bas')
  @include($partial)
@endif

{{-- MEXANİKİ QAPI. Fiktivlik qeydi ayrı-ayrı sənəd növlərinə deyil, HƏR
     sənədin keçdiyi bu YEGANƏ sarğıya yazılır — `doc.js`-dəki `inner()`
     qapısının eyni məntiqi. Doqquz növ var və sabah onuncusu gələcək;
     növ-növ yazılan qayda unudulan qaydadır.
     Kilidli sənəd də zolağı alır: klaviatura ekranı da fiktiv artefaktdır.
     `data-fq` markeri mətnə görə deyil, atributa görə yoxlanılır. --}}
<div class="p-fiktiv" data-fq="1">{{ \App\Support\Dossier\Byuro::QEYD }}</div>
</div>
