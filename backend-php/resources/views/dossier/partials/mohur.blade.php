{{-- Möhür ayrıca qatdır: mətni, forması, rəngi, bucağı, şəffaflığı və
     vərəqdəki yeri məlumatdan gəlir. Bir sənəddə bir neçəsi ola bilər.
     Şəffaflıq məcburidir — möhür mətnin üstünə düşəndə mətn oxunaqlı qalmalıdır
     (yoxlayıcı 0.15–0.9 aralığını tələb edir).

     MÖHÜR CSS ÇƏRÇİVƏSİ DEYİL, SVG-DİR. Səbəb: real möhürdə yazı dairənin
     KƏNARI BOYUNCA əyilir və bunu `border-radius` ilə etmək mümkün deyil —
     düz sətirli dairə möhürə yox, çərçivəyə oxşayır. `textPath` ilə birinci
     sətir yuxarı qövsə, sonuncu sətir aşağı qövsə düşür, aradakılar mərkəzdə
     qalır. Ölçü `viewBox` ilə verilir, yəni möhür hər ölçüdə iti qalır.

     `mix-blend-mode:multiply` mürəkkəbi kağıza hopdurur: möhür kağızın
     ÜSTÜNDƏ yapışdırılmış etiket kimi yox, içinə çəkilmiş mürəkkəb kimi
     görünür və altındakı mətn oxunaqlı qalır. --}}
@php($f = $mohur['forma'] ?? 'daire')
@php($setir = array_values(array_filter(array_map(
    static fn ($x) => trim((string) $x), (array) ($mohur['metn'] ?? [])
), static fn ($x) => $x !== '')))
@php($say = count($setir))
@php($ust = $setir[0] ?? '')
@php($alt = $say > 1 ? $setir[$say - 1] : '')
@php($orta = $say > 2 ? array_slice($setir, 1, -1) : [])
@php($uid = 'mh-' . $doc->id . '-' . $loop->index)
<div class="p-mohur p-mohur-{{ $f }} p-mohur-{{ $mohur['reng'] ?? 'mor' }}"
     aria-hidden="true"
     style="--x:{{ (float) ($mohur['x'] ?? 70) }}%;--y:{{ (float) ($mohur['y'] ?? 60) }}%;
            --olcu:{{ (float) ($mohur['olcu'] ?? 120) }}px;
            --bucaq:{{ (float) ($mohur['bucaq'] ?? -12) }}deg;
            --op:{{ (float) ($mohur['seffaflik'] ?? 0.55) }}">
@if($f === 'daire')
  <svg viewBox="0 0 100 100">
    <defs>
      {{-- Yuxarı qövs soldan sağa yuxarıdan keçir, aşağı qövs soldan sağa
           aşağıdan: hər iki yazı normal istiqamətdə oxunur. --}}
      <path id="{{ $uid }}-u" d="M 17,50 A 33,33 0 0 1 83,50" fill="none"/>
      <path id="{{ $uid }}-a" d="M 19,50 A 31,31 0 0 0 81,50" fill="none"/>
    </defs>
    <circle cx="50" cy="50" r="47"/>
    <circle class="ic" cx="50" cy="50" r="40"/>
    @if($ust !== '')
      <text class="qov"><textPath href="#{{ $uid }}-u" startOffset="50%">{{ $ust }}</textPath></text>
    @endif
    @if($alt !== '')
      <text class="qov"><textPath href="#{{ $uid }}-a" startOffset="50%">{{ $alt }}</textPath></text>
    @endif
    @foreach($orta as $i => $l)
      <text class="ort" x="50" y="{{ 52 + ($i - (count($orta) - 1) / 2) * 11 }}"
            text-anchor="middle">{{ $l }}</text>
    @endforeach
    <line class="ic" x1="24" y1="50" x2="34" y2="50"/>
    <line class="ic" x1="66" y1="50" x2="76" y2="50"/>
  </svg>
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
