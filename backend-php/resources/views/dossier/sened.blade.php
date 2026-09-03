{{-- Bir sənədin tam gövdəsi. Bu görünüş AJAX ilə gətirilir və qabıqdakı
     ekrana yazılır — sənədlərin məzmunu heç vaxt qabaqcadan yüklənmir.

     Sənəd HAZIR ŞABLON DEYİL, blokların ardıcıllığıdır: aşağıdakı döngü
     hekayəni tanımır, yalnız blok növünü tanıyır. --}}
<div class="paper {{ $kagizSinif }}" data-sened="{{ $doc->id }}" @if($egilme)style="--egilme:{{ $egilme }}deg"@endif>

{{-- FİZİKİ QAT — substrat. Blok növlərindən asılı deyil, istənilən sənədə
     verilir. Hamısı CSS/SVG-dir: sənəd hər ölçüdə iti qalmalı və mətni
     seçilə bilən olmalıdır. --}}
@if($kagiz !== [])
  @include('dossier.partials.kagiz')
@endif

@if($bagli)
  @include('dossier.partials.kilid')
@else
  @foreach($bloklar as $b)
    @php($blokView = 'dossier.bloklar.' . $b['tip'])
    @include($blokView)
  @endforeach
@endif

{{-- MÖHÜR QATI — mətnin üstündə, amma fiktivlik zolağının altında. --}}
@foreach($mohurler as $mohur)
  @include('dossier.partials.mohur')
@endforeach

{{-- MEXANİKİ QAPI. Fiktivlik qeydi ayrı-ayrı bloklara deyil, HƏR sənədin
     keçdiyi bu YEGANƏ sarğıya yazılır — `doc.js`-dəki `inner()` qapısının
     eyni məntiqi. On üç blok növü var və sabah on dördüncüsü gələcək;
     blok-blok yazılan qayda unudulan qaydadır.
     Kilidli sənəd də zolağı alır: klaviatura ekranı da fiktiv artefaktdır.
     `data-fq` markeri mətnə görə deyil, atributa görə yoxlanılır. --}}
<div class="p-fiktiv" data-fq="1">{{ \App\Support\Dossier\Byuro::QEYD }}</div>
</div>
