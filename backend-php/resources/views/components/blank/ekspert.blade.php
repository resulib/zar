{{-- EKSPERT RƏYİ — ekspertiza sənədi. Başlığın altında ekspertizanın
     pasportu durur: təyin edən, növü, obyektlərin sayı. Sağda isə
     xəbərdarlıq qutusu — real rəydə ekspertin məsuliyyət barədə imzası
     həmişə mətnin ƏVVƏLİNDƏ olur, sonunda yox. --}}
@props(['head' => [], 'dossier', 'doc'])
<div class="p-blank p-blank-ekspert">
  <x-blank.ust :head="$head" :olcu="66" qeyd=""/>
</div>
<div class="p-rule"></div>
<div class="p-xeber">
  <div class="p-xeber-b">EKSPERTİN XƏBƏRDARLIĞI</div>
  <div>Rəy iş üzrə təyinat əsasında verilir. Ekspert bilərəkdən yalan rəy
    verməyin nəticələri barədə xəbərdar edilmiş və bu barədə imza etmişdir.</div>
  {{-- İmza xətti BOŞ QALIR (kağızda əl ilə atılır), tarix isə sənədin
       məlumatıdır və doldurulur. --}}
  <div class="p-xeber-i">imza ______________ · {{ \App\Support\Dossier\Tarix::qisa($dossier->vereqTarixi($doc)) }} · {{ $dossier->kod() }}-{{ $dossier->nomre() }}</div>
</div>
