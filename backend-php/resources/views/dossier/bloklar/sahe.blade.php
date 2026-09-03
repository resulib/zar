{{-- Sahə siyahısı — solda ad, sağda dəyər, aralarında nöqtəli xətt.
     Rəsmi blanklarda ən çox görünən formadır. DƏYƏR BOŞ QALA BİLƏR:
     real sənəddə doldurulmamış sahə olur və xətt yenə çəkilir. --}}
<div class="p-fields">
@foreach($b['setirler'] ?? [] as $s)
<div><b>{{ $s[0] ?? '' }}</b><i></i><span>{{ $s[1] ?? '' }}</span></div>
@endforeach
</div>
@include('dossier.partials.kenar')
