{{-- PROTOKOL / AKT — hərəkəti qeydə alan sənəd. Fərqi: başlığın altında
     «tərtib olundu» zolağı var — yer, tarix və iştirakçı sayı. Real
     protokolda bu üç şey mətndən əvvəl, ayrıca çərçivədə durur, çünki
     sənədin hüquqi dəyəri məhz onlardan asılıdır. --}}
@props(['head' => [], 'dossier', 'doc'])
<div class="p-blank p-blank-protokol">
  <x-blank.ust :head="$head" :olcu="70"/>
</div>
<div class="p-rule"></div>
<div class="p-tertib">
  <span><em>Tərtib olundu:</em> {{ $dossier->place }}</span>
  {{-- Tarix protokolun ən vacib rekvizitidir: sənədin hüquqi dəyəri
       hərəkətin NƏ VAXT edildiyindən asılıdır. --}}
  <span><em>Tarix:</em> {{ \App\Support\Dossier\Tarix::qisa($dossier->vereqTarixi($doc)) ?: '—' }}</span>
  <span><em>İş №</em> {{ $dossier->no }}</span>
  <span><em>Vərəq</em> {{ $doc->page }}</span>
</div>
