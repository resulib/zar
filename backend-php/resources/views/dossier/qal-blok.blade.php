{{-- Qalereya bir bloku təkbaşına render edir, ona görə sənəd sarğısının
     verdiyi dəyişənləri burada təmin edir. --}}
@php($vals = ['mustentiq' => 'Rəsulov Elçin'])
@php($head = [\App\Support\Dossier\Byuro::AD . ' (' . \App\Support\Dossier\Byuro::QISA . ')',
              \App\Support\Dossier\Byuro::BOLME . ' · İŞ № AFİB-2026/0847'])
@php($qalView = 'dossier.bloklar.' . $b['tip'])
@include($qalView)
