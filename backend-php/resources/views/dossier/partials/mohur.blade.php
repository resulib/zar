{{-- Möhür ayrıca qatdır: mətni, forması, rəngi, bucağı, şəffaflığı və
     vərəqdəki yeri məlumatdan gəlir. Bir sənəddə bir neçəsi ola bilər.
     Şəffaflıq məcburidir — möhür mətnin üstünə düşəndə mətn oxunaqlı qalmalıdır
     (yoxlayıcı 0.15–0.9 aralığını tələb edir). --}}
@php($f = $mohur['forma'] ?? 'daire')
<div class="p-mohur p-mohur-{{ $f }} p-mohur-{{ $mohur['reng'] ?? 'mor' }}"
     aria-hidden="true"
     style="--x:{{ (float) ($mohur['x'] ?? 70) }}%;--y:{{ (float) ($mohur['y'] ?? 60) }}%;
            --olcu:{{ (float) ($mohur['olcu'] ?? 120) }}px;
            --bucaq:{{ (float) ($mohur['bucaq'] ?? -12) }}deg;
            --op:{{ (float) ($mohur['seffaflik'] ?? 0.55) }}">
  <span>@foreach((array) ($mohur['metn'] ?? []) as $l){{ $l }}@if(! $loop->last)<br>@endif @endforeach</span>
</div>
