{{-- Fiziki qat — substrat. Hamısı CSS və SVG-dir: hazır şəkil faylı yoxdur,
     çünki sənəd hər ölçüdə iti qalmalı və mətni seçilə bilən olmalıdır.
     Qat mətnin ALTINDADIR (`pointer-events:none`), ona görə seçməyə mane olmur.

     BİR SƏNƏDDƏ ÜÇDƏN ÇOX AĞIR EFFEKT OLMAZ — hər vərəq ləkəli və qatlanmış
     olanda heç biri seçilmir. Qayda `BlokSxemi`-də xəta kimi yoxlanılır. --}}
<div class="kagiz-qat" aria-hidden="true">
  @foreach((array) ($kagiz['qat'] ?? []) as $yer)
    <span class="kagiz-qatxett" style="--yer:{{ (float) $yer * 100 }}%"></span>
  @endforeach

  @foreach((array) ($kagiz['leke'] ?? []) as $l)
    <span class="kagiz-leke kagiz-leke-{{ $l['nov'] ?? 'qehve' }}"
          style="--x:{{ (float) ($l['x'] ?? 50) }}%;--y:{{ (float) ($l['y'] ?? 50) }}%;--o:{{ (float) ($l['olcu'] ?? 22) }}%"></span>
  @endforeach

  @foreach((array) ($kagiz['barmaq'] ?? []) as $bm)
    <span class="kagiz-barmaq" style="--x:{{ (float) ($bm['x'] ?? 50) }}%;--y:{{ (float) ($bm['y'] ?? 50) }}%"></span>
  @endforeach

  @if(! empty($kagiz['atac']))
    <span class="kagiz-atac kagiz-atac-{{ $kagiz['atac'] }}"></span>
  @endif
</div>
