{{-- Bir sənədin tam gövdəsi. Bu görünüş AJAX ilə gətirilir və qabıqdakı
     ekrana yazılır — sənədlərin məzmunu heç vaxt qabaqcadan yüklənmir.

     Sənəd HAZIR ŞABLON DEYİL, blokların ardıcıllığıdır: aşağıdakı döngü
     hekayəni tanımır, yalnız blok növünü tanıyır.

     VƏRƏQİN ÇƏRÇİVƏSİ BLOK DEYİL. Mikromətn haşiyəsi, çərçivə, kölgə gerbi,
     forma sətri və fiktivlik zolağı burada — HƏR sənədin keçdiyi yeganə
     sarğıda — durur. Blok-blok yazılan qayda unudulan qaydadır; sarğıya
     yazılan qaydanı isə heç bir blok növü yandan keçə bilmir. --}}
@php($mikro = trim(str_repeat(\App\Support\Dossier\Byuro::QISA . ' · FİKTİV OYUN SƏNƏDİ · REAL RƏSMİ SƏNƏD DEYİL · ', 14)))
<div class="paper {{ $kagizSinif }}" data-sened="{{ $doc->id }}" @if($egilme)style="--egilme:{{ $egilme }}deg"@endif>

{{-- FİZİKİ QAT — substrat. Blok növlərindən asılı deyil, istənilən sənədə
     verilir. Hamısı CSS/SVG-dir: sənəd hər ölçüdə iti qalmalı və mətni
     seçilə bilən olmalıdır. --}}
@if($kagiz !== [])
  @include('dossier.partials.kagiz')
@endif

{{-- QORUYUCU ÇAP — çərçivə və kölgə gerbi. Mətnin ALTINDADIR (`z-index:0`),
     ona görə oxunuşa mane olmur, amma vərəqi «boş kağız» olmaqdan çıxarır. --}}
<div class="p-cerceve p-qat" aria-hidden="true"></div>
{{-- Gilyoş — ortaq komponent. Vərəqi «ağ kağız» olmaqdan çıxaran qatdır. --}}
<div class="p-naxis p-qat" aria-hidden="true"><x-naxis :opaklik="0.13"/></div>
<div class="p-hayalet p-qat" aria-hidden="true">
  <x-gerb ad="{{ \App\Support\Dossier\Byuro::QISA }}" :olcu="290" :rozet="false"/>
</div>

<div class="p-mikro" aria-hidden="true">{{ $mikro }}</div>

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

{{-- Vərəqin altlığı: forma nömrəsi və vərəq nişanı. Real blankın ən son
     sətri həmişə budur və məhz o, vərəqi «çap məhsulu» kimi göstərir. --}}
{{-- Holoqram yaması — optik qoruma nişanı, forma sətrinin yanında. --}}
<div class="p-holo">
  <x-holoqram :id="'ho-' . $doc->id" :olcu="52" etiket="HOLOQRAM"/>
</div>

<div class="p-forma">
  <span>Forma № {{ \App\Support\Dossier\Byuro::QISA }}-{{ str_pad((string) $doc->sort, 2, '0', STR_PAD_LEFT) }}
    · İş № {{ $dossier->no }} · Nüsxə 1
    · «{{ \App\Support\Dossier\Byuro::QISA }}-Poliqrafiya» (mövcud deyil)</span>
  <span>Vərəq {{ $doc->page }}</span>
</div>

{{-- MEXANİKİ QAPI. Fiktivlik qeydi ayrı-ayrı bloklara deyil, HƏR sənədin
     keçdiyi bu YEGANƏ sarğıya yazılır — `doc.js`-dəki `inner()` qapısının
     eyni məntiqi. On üç blok növü var və sabah on dördüncüsü gələcək;
     blok-blok yazılan qayda unudulan qaydadır.
     Kilidli sənəd də zolağı alır: klaviatura ekranı da fiktiv artefaktdır.
     `data-fq` markeri mətnə görə deyil, atributa görə yoxlanılır. --}}
<div class="p-fiktiv" data-fq="1">{{ \App\Support\Dossier\Byuro::QEYD }}</div>
<div class="p-mikro p-mikro-alt" aria-hidden="true">{{ $mikro }}</div>
</div>
