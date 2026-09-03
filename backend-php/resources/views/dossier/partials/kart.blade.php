{{-- Kataloq kartı — qovluğun üz qabığı formasında.
     Süzgəclər `data-` atributları üzərində işləyir (dossier-site.js). --}}
@php($nisan = $is->badgeLabel())
<a class="kart" href="{{ route('dossier.show', $is->slug) }}"
   data-cetinlik="{{ $is->difficulty }}" data-deqiqe="{{ $is->read_minutes }}">
  @if($nisan !== '')
    <span class="kart-lent">{{ $nisan }}</span>
  @endif

  <span class="kart-no">İŞ № {{ $is->no }}</span>
  <span class="kart-ad">{{ $is->title }}</span>
  @if($is->place !== '')
    <span class="kart-yer">{{ $is->place }}</span>
  @endif

  <span class="kart-mohur" aria-hidden="true"><span>AFİB<br>FİKTİV<br>MATERİAL</span></span>

  <span class="kart-alt">
    <span>{{ $is->documents_count ?? $is->documents()->count() }} sənəd</span>
    <span>{{ $is->read_minutes }} dəqiqə</span>
    <span>{{ config('dossier.difficulty_labels')[$is->difficulty] ?? $is->difficulty }}</span>
  </span>

  <span class="kart-qiymet">
    @if(array_key_exists($is->id, $acilan))
      <b>{{ $acilan[$is->id] ? 'bağlanıb' : 'açıqdır' }}</b>
    @elseif($is->isFree())
      <b>pulsuz</b>
    @else
      <b>{{ $is->price_credits }} kredit</b>
    @endif
  </span>
</a>
