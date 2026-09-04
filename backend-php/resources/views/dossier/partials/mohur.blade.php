{{-- Möhür ayrıca qatdır: mətni, forması, rəngi, bucağı, şəffaflığı və
     vərəqdəki yeri məlumatdan gəlir. Bir sənəddə bir neçəsi ola bilər.
     Şəffaflıq məcburidir — möhür mətnin üstünə düşəndə mətn oxunaqlı qalmalıdır
     (yoxlayıcı 0.15–0.9 aralığını tələb edir).

     DAİRƏVİ MÖHÜR ORTAQ KOMPONENTDİR (`<x-mohur>`): halqalar, qövs boyu yazı
     və mərkəz sətirləri `App\Support\Nisan`-dadır. Düzbucaqlı möhür isə sadə
     çərçivədir və burada qalır.

     `metn` massivi belə oxunur: birinci sətir yuxarı qövs, sonuncu sətir aşağı
     qövs, aradakılar mərkəz. Beləliklə mövcud seed məlumatı dəyişmədən işləyir.

     `mix-blend-mode:multiply` mürəkkəbi kağıza hopdurur: möhür yapışdırılmış
     etiket kimi yox, içinə çəkilmiş mürəkkəb kimi görünür. --}}
@php($f = $mohur['forma'] ?? 'daire')
@php($setir = array_values(array_filter(array_map(
    static fn ($x) => trim((string) $x), (array) ($mohur['metn'] ?? [])
), static fn ($x) => $x !== '')))
@php($say = count($setir))
@php($uid = 'mh-' . $doc->id . '-' . $loop->index)
<div class="p-mohur p-mohur-{{ $f }} p-mohur-{{ $mohur['reng'] ?? 'mor' }}"
     aria-hidden="true"
     style="--x:{{ (float) ($mohur['x'] ?? 70) }}%;--y:{{ (float) ($mohur['y'] ?? 60) }}%;
            --olcu:{{ (float) ($mohur['olcu'] ?? 120) }}px;
            --bucaq:{{ (float) ($mohur['bucaq'] ?? -12) }}deg;
            --op:{{ (float) ($mohur['seffaflik'] ?? 0.55) }}">
@if($f === 'daire')
  <x-mohur :id="$uid"
           ust="{{ $setir[0] ?? '' }}"
           orta="{{ $say > 2 ? $setir[1] : ($say === 2 ? $setir[1] : '') }}"
           no="{{ $say > 3 ? $setir[2] : '' }}"
           etiket="{{ $say > 4 ? $setir[3] : '' }}"
           alt="{{ $say > 2 ? $setir[$say - 1] : '' }}"
           :olcu="(float) ($mohur['olcu'] ?? 120)"/>
@else
  <svg viewBox="0 0 100 52">
    <rect x="2" y="2" width="96" height="48"/>
    <rect class="ic" x="6" y="6" width="88" height="40"/>
    @foreach($setir as $i => $l)
      <text class="ort" x="50" y="{{ 29 + ($i - ($say - 1) / 2) * 11 }}"
            text-anchor="middle">{{ $l }}</text>
    @endforeach
  </svg>
@endif
</div>
