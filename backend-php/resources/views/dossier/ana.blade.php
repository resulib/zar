@extends('layouts.dossier')
@section('wrap', 'sayt')
@section('robots', 'index, follow')
@section('title', config('dossier.brand') . ' — onlayn cinayət işi qovluğu')

@push('head')
<meta name="description" content="Bir cinayət işinin bütün materialları telefonunda. Sənədləri oxu, ziddiyyəti tap, qatili özün göstər. Birinci qovluq pulsuzdur.">
<meta property="og:type" content="website">
<meta property="og:title" content="{{ config('dossier.brand') }} — onlayn cinayət işi qovluğu">
<meta property="og:description" content="Sənədləri oxu, ziddiyyəti tap, qatili özün göstər.">
<meta property="og:url" content="{{ url()->current() }}">
@if($showcase && $showcase->ogUrl() !== '')
<meta property="og:image" content="{{ $showcase->ogUrl() }}">
<meta property="og:image:width" content="{{ config('dossier.og.width') }}">
<meta property="og:image:height" content="{{ config('dossier.og.height') }}">
<meta name="twitter:card" content="summary_large_image">
@endif
@endpush

@section('content')
@include('dossier.partials.ust')

{{-- ══ 0. İŞ LENTİ — büronun vəziyyət sətri ════════════════════════════
     Rəqəmlər bazadan gəlir. Sabit yazılsaydı, dördüncü iş əlavə olunanda
     lent yalan danışardı — və məhz belə sətirlər ən uzun müddət yalan
     danışır, çünki heç kim onlara baxmır. --}}
<div class="lent" role="status">
  <div class="sayt-en lent-in">
    <span class="lent-nq" aria-hidden="true"></span>
    <span class="lent-b">AFİB · İSTİNTAQ BÖLMƏSİ</span>
    <span class="lent-d"><b>{{ $lent['is'] }}</b> aktiv iş</span>
    <span class="lent-d"><b>{{ $lent['sened'] }}</b> sənəd</span>
    <span class="lent-d"><b>{{ $lent['subheli'] }}</b> şübhəli</span>
    <span class="lent-d lent-gizle"><b>{{ $lent['deqiqe'] }}</b> dəqiqə material</span>
    <span class="lent-son">HƏLL EDİLMƏYİB</span>
  </div>
</div>

{{-- ══ 1. Birinci ekran: şüar deyil, məhsulun özü ══════════════════════
     Sağdakı vərəq şəkil DEYİL — saytın öz render qatı ilə çıxarılır, ona
     görə hər ölçüdə düzgün oturur və şəkil ağırlığı yaratmır.

     BU EKRAN İSTİNTAQ LÖVHƏSİDİR. Vərəq lövhəyə SANCILIB: əyilib, künclərində
     lent var, üstündə iynə və qırmızı sap. Səbəb məhsulun öz məntiqidir —
     oyunçu materialı masada araşdırır, ona görə birinci ekran da masa
     olmalıdır, kataloq kartı yox. Hər şey CSS və SVG-dir: bölmədə şəkil
     faylı yoxdur və olmamalıdır (vərəq hər ölçüdə iti qalmalıdır). --}}
<section class="hero">
  {{-- Lövhənin qatları: barmaq izi, ölçü şəbəkəsi, qırmızı sap. --}}
  @include('dossier.partials.lovhe', ['sap' => true])

  <div class="sayt-en hero-in">
    <div class="hero-metn">
      <p class="hero-ust"><span class="hero-ust-x">İŞ AÇIQDIR</span> Onlayn iş qovluğu</p>
      {{-- Başlıqdakı örtük: söz REDAKTƏ EDİLİB kimi qaralanıb və üstünə
           gələndə açılır. Mətn HƏMİŞƏ DOM-dadır — örtük yalnız rəngdir,
           yəni ekran oxuyucusu və axtarış sistemi tam cümləni görür. --}}
      <h1>Bir cinayət işi. Bütün materiallar. Qatili
        <span class="ortuk"><span>özün</span></span> tapırsan.</h1>
      <p class="hero-l">Protokollar, ekspert rəyi, zəng detallaşdırması, yazışma çıxarışları —
        həqiqi iş qovluğu kimi. Ziddiyyəti tapmaq sənin işindir.</p>
      @if($showcase)
        <a class="duyme duyme-is" href="{{ route('dossier.play', $showcase->slug) }}">
          Birinci işi pulsuz aç
        </a>
        <p class="hero-alt">{{ $showcase->documents_count }} sənəd ·
          {{ $showcase->read_minutes }} dəqiqə · qeydiyyat tələb olunmur</p>
      @endif
    </div>

    @if($hero !== '')
      {{-- Sancılmış vərəq. Əyilmə SABİTDİR (təsadüfi deyil): səhifə hər
           açılışda eyni görünməlidir — `Imza::yol()`-un qaydası. --}}
      <div class="hero-sened" aria-hidden="true">
        <span class="hero-iyne"></span>
        <span class="hero-skoc hero-skoc-sol"></span>
        <span class="hero-skoc hero-skoc-sag"></span>
        <span class="hero-grif">İSTİNTAQ MATERİALI</span>
        {!! $hero !!}
      </div>
    @endif
  </div>
  <p class="hero-fiktiv">{{ \App\Support\Dossier\Byuro::QEYD }}
    Qurum — {{ \App\Support\Dossier\Byuro::AD }} ({{ \App\Support\Dossier\Byuro::QISA }}) — uydurmadır.</p>
</section>

{{-- ══ 2. Necə işləyir — izah deyil, göstərmə ══════════════════════════ --}}
@if($showcase)
<section class="addimlar">
  <div class="sayt-en">
    <h2 class="bolme-bas">Necə işləyir</h2>
    <div class="addim-list">

      <div class="addim">
        <div class="addim-metn">
          <span class="addim-no">01</span>
          <h3>Qovluğu aç</h3>
          <p>Adını yazırsan, iş sənin adına rəsmiləşir. Birinci qovluq pulsuzdur.</p>
        </div>
        <div class="addim-numune" aria-hidden="true">
          @php($qab = (array) $showcase->cover)
          <div class="mini-qab">
            <div class="mini-org">{{ implode(' · ', array_slice((array) ($qab['org'] ?? []), 1)) }}</div>
            <div class="mini-kind">{{ $qab['kind'] ?? 'CİNAYƏT İŞİ' }}</div>
            <div class="mini-no">{{ $showcase->no }}</div>
            <div class="mini-sub">{{ $qab['opened'] ?? '' }}</div>
          </div>
        </div>
      </div>

      <div class="addim">
        <div class="addim-metn">
          <span class="addim-no">02</span>
          <h3>Sənədləri oxu</h3>
          <p>Vərəq-vərəq. Oxuduğunu qeyd dəftərinə sancırsan, kodla bağlı sənədi açırsan.</p>
        </div>
        <div class="addim-numune" aria-hidden="true">
          @if($yazisma !== '')
            <div class="mini-telefon"><div class="mini-ekran">{!! $yazisma !!}</div></div>
          @endif
        </div>
      </div>

      <div class="addim">
        <div class="addim-metn">
          <span class="addim-no">03</span>
          <h3>Qatili göstər</h3>
          <p>Kim, niyə və hansı iki sənədin ziddiyyəti bunu sübut edir. Üç cəhdin var.</p>
        </div>
        <div class="addim-numune" aria-hidden="true">
          {{-- Bilərəkdən ÜÇÜNCÜ sual: onun variantları sənəd adlarıdır.
               Birinci sual şübhəlilərin adını ana səhifədə açardı. --}}
          @if($sual)
            <div class="mini-cavab">
              <div class="q-t">{{ $sual->prompt }}</div>
              @foreach(array_slice((array) $sual->options, 0, 3) as $i => $o)
                <div class="opt {{ $i === 1 ? 'sel' : '' }}">{{ $o }}</div>
              @endforeach
            </div>
          @endif
        </div>
      </div>

    </div>
  </div>
</section>
@endif

{{-- ══ 3. İşlərin siyahısı ═════════════════════════════════════════════ --}}
<section class="kataloq" id="isler">
  <div class="sayt-en">
    <h2 class="bolme-bas">İş qovluqları</h2>

    @if($list->count() > 3)
      {{-- Süzgəclər yalnız siyahı uzun olanda görünür — üç kart üçün lazım deyil. --}}
      <div class="suzgec" id="suzgec">
        <div class="suzgec-q">
          <span class="suzgec-l">Çətinlik</span>
          <button type="button" class="suzgec-d on" data-sahe="cetinlik" data-deyer="">hamısı</button>
          @foreach(config('dossier.difficulties') as $c)
            <button type="button" class="suzgec-d" data-sahe="cetinlik" data-deyer="{{ $c }}">{{ config('dossier.difficulty_labels')[$c] ?? $c }}</button>
          @endforeach
        </div>
        <div class="suzgec-q">
          <span class="suzgec-l">Uzunluq</span>
          <button type="button" class="suzgec-d on" data-sahe="deqiqe" data-deyer="">hamısı</button>
          <button type="button" class="suzgec-d" data-sahe="deqiqe" data-deyer="0-30">30 dəqiqəyə qədər</button>
          <button type="button" class="suzgec-d" data-sahe="deqiqe" data-deyer="31-999">30 dəqiqədən çox</button>
        </div>
      </div>
    @endif

    <div class="kataloq-list" id="kataloq">
      @forelse($list as $is)
        @include('dossier.partials.kart')
      @empty
        <div class="empty">Hələ qovluq yoxdur.</div>
      @endforelse
    </div>
    <p class="kataloq-bos" id="kataloqBos" hidden>Bu süzgəclərə uyğun iş yoxdur.</p>
  </div>
</section>

{{-- ══ 4. Qovluqdan nümunə ═════════════════════════════════════════════ --}}
@if(count($numune) > 1)
<section class="numune">
  <div class="sayt-en">
    <h2 class="bolme-bas">Qovluqdan nümunə</h2>
    <p class="bolme-l">Bunlar həqiqi vərəqlərdir, uydurma nümunə deyil — sadəcə hekayənin
      açarını verməyən yerlərindən seçilib.</p>

    <div class="numune-qutu" id="numune">
      <button type="button" class="numune-ox sol" id="numuneSol" aria-label="Əvvəlki vərəq">‹</button>
      <div class="numune-lent" id="numuneLent">
        @foreach($numune as $n)
          <div class="numune-verq">
            <div class="numune-ad">v. {{ $n['doc']->page }} — {{ $n['doc']->name }}</div>
            {!! $n['html'] !!}
          </div>
        @endforeach
      </div>
      <button type="button" class="numune-ox sag" id="numuneSag" aria-label="Növbəti vərəq">›</button>
    </div>

    <p class="numune-alt">Qovluqda bunlardan {{ $showcase->documents_count }}-si var.</p>
  </div>
</section>
@endif

{{-- ══ 5. Qiymət ═══════════════════════════════════════════════════════ --}}
<section class="qiymet">
  <div class="sayt-en">
    <h2 class="bolme-bas">Qiymət</h2>
    <p class="qiymet-m">Birinci iş pulsuzdur — qeydiyyat da tələb olunmur, sadəcə açırsan.
      Sonrakı qovluqlar {{ config('dossier.price_credits') }} kreditdir və bir dəfə alınır:
      açdığın qovluğa istədiyin qədər qayıda bilərsən.</p>
    @if($showcase)
      <a class="duyme" href="{{ route('dossier.play', $showcase->slug) }}">Birinci işi pulsuz aç</a>
    @endif
  </div>
</section>

{{-- ══ 6. Suallar ══════════════════════════════════════════════════════ --}}
<section class="suallar" id="suallar">
  <div class="sayt-en">
    <h2 class="bolme-bas">Tez-tez verilən suallar</h2>
    @foreach(config('dossier.faq') as $f)
      <details class="sual">
        <summary>{{ $f['s'] }}</summary>
        <p>{{ $f['c'] }}</p>
      </details>
    @endforeach
  </div>
</section>

@include('dossier.partials.altliq')
@endsection

@push('scripts')
<script src="{{ asset('assets/dossier-site.js') }}"></script>
@endpush
