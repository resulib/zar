{{-- QƏRAR / ƏMR — hökm sənədi. Qəbul sətri YOXDUR: qərar qeydə alınan
     material deyil, onu DOĞURAN sənəddir. Onun yerinə sağ yuxarıda
     «TƏSDİQ EDİRƏM» qrifi durur — Azərbaycan sərəncam sənədinin ən tanınan
     cizgisi məhz odur: vəzifə, imza xətti və tarix, hamısı sağ küncdə. --}}
@props(['head' => [], 'dossier', 'doc'])
<div class="p-qrif">
  <div class="p-qrif-b">TƏSDİQ EDİRƏM</div>
  <div>{{ \App\Support\Dossier\Byuro::QISA }} bölmə rəisi</div>
  <div class="p-qrif-x"></div>
  {{-- Tarix işin başlanma tarixindən və vərəqin sırasından törəyir
       (`Dossier::vereqTarixi()`) — boş forma sətri deyil. --}}
  <div class="p-qrif-t">{{ \App\Support\Dossier\Tarix::yaz($dossier->vereqTarixi($doc)) }}</div>
</div>
<div class="p-blank p-blank-qerar">
  <x-blank.ust :head="$head" :olcu="86" qeyd=""/>
</div>
<div class="p-rule p-rule-qalin"></div>
