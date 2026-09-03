{{-- Blank başlığı — qurumun adı, iş nömrəsi, ayırıcı xətt.
     Sənədin növündən asılı olmayaraq eyni komponentdir, mətn parametrdir:
     boş buraxılsa qovluğun öz başlıq sətirləri işlənir. --}}
@php($setirler = array_values(array_filter((array) ($b['setirler'] ?? []))) ?: $head)
<div class="p-head">{!! implode('<br>', array_map(fn ($l) => e($l), $setirler)) !!}</div>
<div class="p-rule"></div>
@include('dossier.partials.kenar')
