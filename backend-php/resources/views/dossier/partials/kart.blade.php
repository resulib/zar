{{-- Kataloq kartı — qovluğun üz qabığı formasında.
     Süzgəclər `data-` atributları üzərində işləyir (dossier-site.js). --}}
@php($nisan = $is->badgeLabel())
@php($qabiq = $is->cover_image_id !== null)
<a class="kart @if($qabiq) kart-sekilli @endif" href="{{ route('dossier.show', $is->slug) }}"
   data-cetinlik="{{ $is->difficulty }}" data-deqiqe="{{ $is->read_minutes }}">

  {{-- ZOLAQ HƏMİŞƏ VAR, ŞƏKİL İSƏ OLA DA BİLƏR. Yalnız şəkilli kartda
       zolaq çəkilsəydi, kartlar müxtəlif hündürlükdə olar və kataloq
       şəbəkəsi dağılardı; şəkilsiz qovluq isə «yarımçıq» görünərdi.
       Boş zolaq iş nömrəsini daşıyır — qovluğun beli kimi.

       ŞƏKİL KARTIN İÇİNDƏ, ONUN FONU DEYİL: `background-image` çap olunmur
       və yüklənməsi gecikəndə kart boş qutuya çevrilir; `<img>` isə
       `aspect-ratio` ilə öz yerini əvvəlcədən tutur. --}}
  <span class="kart-sek @if(! $qabiq) kart-sek-bos @endif">
    @if($qabiq)
      <img src="{{ route('dossier.qabiq', [$is->slug, 'orta']) }}" alt="" loading="lazy" decoding="async">
    @else
      <span class="kart-sek-no" aria-hidden="true">{{ $is->no }}</span>
    @endif
  </span>

  @if($nisan !== '')
    <span class="kart-lent">{{ $nisan }}</span>
  @endif

  <span class="kart-govde">
    <span class="kart-no">İŞ № {{ $is->no }}</span>
    <span class="kart-ad">{{ $is->title }}</span>
    @if($is->place !== '')
      <span class="kart-yer">{{ $is->place }}</span>
    @endif

    <span class="kart-mohur" aria-hidden="true"><span>AFİB<br>FİKTİV<br>MATERİAL</span></span>

    {{-- GÖSTƏRİCİLƏR. Hamısı bazadan gəlir: sənəd sayı sonluq vərəqlərini
         saymır, baxış sayğacı sessiya başına bir dəfə artır. Sıfır baxış
         GÖSTƏRİLMİR — «0 baxış» yeni işi ölü göstərir. --}}
    <span class="kart-olcu">
      <span><b>{{ $is->documents_count ?? $is->documents()->count() }}</b> sənəd</span>
      <span><b>{{ $is->read_minutes }}</b> dəqiqə</span>
      <span>{{ config('dossier.difficulty_labels')[$is->difficulty] ?? $is->difficulty }}</span>
      @if($is->views_count > 0)
        <span class="kart-bax"><b>{{ $is->views_count }}</b> baxış</span>
      @endif
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
  </span>
</a>