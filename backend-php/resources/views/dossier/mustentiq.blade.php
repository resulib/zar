@extends('layouts.dossier')
@section('wrap', 'sayt')
@section('title', 'Müstəntiq vəsiqəsi')

@push('head')
<link rel="stylesheet" href="{{ asset('assets/dossier-profil.css') }}">
@endpush

{{-- Bu səhifə axtarışa BAĞLIDIR (layout defoltu `noindex`, üstəlik
     robots.txt): burada real adamın adı və şəkli var. Reytinq isə açıqdır —
     o, satış üzüdür. --}}
@section('content')
@include('dossier.partials.ust')

<section class="pr">
  <div class="sayt-en">

    @include('dossier.partials.flash')

    @if($qonaq)
      {{-- QONAQ: vəsiqə yoxdur və bu, qəsdəndir. Kartın qazanılan bir şey
           olması qeydiyyat üçün ən güclü arqumentdir. --}}
      <div class="pr-qonaq sbas">
        @include('dossier.partials.lovhe')
        <div class="pr-qonaq-in">
          <span class="nisan-q">TƏYİNAT VERİLMƏYİB</span>
          <h1>Müstəntiq vəsiqəniz hazır deyil</h1>
          @if($profile && $profile->cases_solved > 0)
            <p>Siz artıq <b>{{ $profile->cases_solved }}</b> iş bağlamısınız və
               <b>{{ $profile->xp }} XP</b> toplamısınız. Nəticəni saxlamaq və
               xidməti vəsiqə almaq üçün qeydiyyatdan keçin.</p>
          @else
            <p>Bir iş bağlayın — nəticəniz yazılacaq. Vəsiqə almaq və reytinqdə
               görünmək üçün qeydiyyat lazımdır.</p>
          @endif
          <a class="pr-btn" href="{{ route('dossier.hesab') }}">Qeydiyyatdan keç</a>
        </div>
      </div>
    @else

      @if($emr)
        {{-- RÜTBƏ ƏMRİ — bir dəfə göstərilir (`seen_at`). Quru dildə, blank
             estetikası ilə: bu, paylaşılmağa dəyər bir andır. --}}
        @include('dossier.partials.emr', ['emr' => $emr, 'profile' => $profile])
      @endif

      <div class="pr-baslq">
        <h1>Xidməti vəsiqə</h1>
        <a class="pr-link" href="{{ route('dossier.profil.ayarlar') }}">Ayarlar</a>
      </div>
      {{-- Başlıq buradadır, ortaq `bas` partial-ında yox: qonaq və hesablı
           ziyarətçi tamam fərqli birinci ekran görür (biri çağırış, digəri
           vəsiqə), ona görə ikisi bir başlığı bölüşə bilməz. --}}

      <div class="pr-tor">

        <div class="pr-kart-sut">
          <div class="pr-kart" id="vesiqe">{!! $kart !!}</div>
          <button type="button" class="pr-btn pr-btn-tam" id="kartEndir">Vəsiqəni endir</button>
          @unless($profile->hasBadge())
            <p class="pr-qeyd">Vəsiqə nömrəsi şöbə seçildikdə verilir.
               <a href="{{ route('dossier.profil.ayarlar') }}">Şöbə seçin</a>.</p>
          @endunless
        </div>

        <div class="pr-yan">

          <div class="pr-blok">
            <div class="pr-blok-bas">
              <span>{{ $profile->rank?->title_az ?? 'Stajçı' }}</span>
              <b>{{ $profile->xp }} XP</b>
            </div>
            @if($irəli['next'])
              <div class="pr-zolaq"><i style="width:{{ $irəli['percent'] }}%"></i></div>
              <p class="pr-qeyd">
                <b>{{ $irəli['next']->title_az }}</b> rütbəsinə
                <b>{{ $irəli['need'] }} XP</b> qalıb.
              </p>
            @else
              <p class="pr-qeyd">Ən yüksək rütbədəsiniz.</p>
            @endif
          </div>

          <dl class="pr-say">
            <div><dt>Bağlanmış iş</dt><dd>{{ $profile->cases_solved }}</dd></div>
            <div><dt>Doğru sonluq</dt><dd>{{ $profile->true_endings }}</dd></div>
            <div><dt>Birinci cəhddən</dt><dd>{{ $profile->first_try_solves }}</dd></div>
            <div><dt>Yanlış ittiham</dt><dd>{{ $profile->total_wrong_accusations }}</dd></div>
          </dl>

          @if($movqe)
            <div class="pr-blok pr-movqe">
              <span>Ümumi sıralamada</span>
              <b>{{ $movqe }}</b>
              @unless($profile->is_public)
                <p class="pr-qeyd">Profiliniz reytinqdə görünmür, amma mövqeyiniz sayılır.</p>
              @endunless
            </div>
          @endif

        </div>
      </div>

      {{-- RÜTBƏ NƏRDİVANI tam göstərilir, kilidli pillələr solğun.
           Bu gün cəmi üç iş var və yuxarı pillələr əlçatmazdır — boş tavan
           səhv deyil, məzmun vədidir. --}}
      <h2 class="pr-alt-bas">Rütbə nərdivanı</h2>
      <ol class="pr-nerdivan">
        @foreach($rutbeler as $r)
          @php($aktiv = $profile->xp >= $r->xp_required)
          <li class="{{ $aktiv ? 'var' : 'kilidli' }} {{ $profile->rank_id === $r->id ? 'indiki' : '' }}">
            <i style="background:{{ $r->reng() }}"></i>
            <span class="pr-n-ad">{{ $r->title_az }}</span>
            <span class="pr-n-xp">{{ $r->xp_required }} XP</span>
          </li>
        @endforeach
      </ol>
      <p class="pr-qeyd">Yuxarı rütbələr üçün növbəti işlər hazırlanır.</p>

      @if($isler->isNotEmpty())
        <h2 class="pr-alt-bas">İşlərim</h2>
        <div class="pr-isler">
          @foreach($isler as $c)
            <div class="pr-is {{ $c->is_solved ? '' : 'yarim' }}">
              <span class="pr-is-no">İŞ № {{ $c->dossier?->no ?? '—' }}</span>
              <span class="pr-is-ad">{{ $c->dossier?->title ?? 'Silinmiş iş' }}</span>
              <span class="pr-is-alt">
                {{ $c->is_solved ? 'bağlandı' : 'bağlanmadı' }}
                @if($c->duration_seconds) · {{ \App\Support\Dossier\Dossier::deqiqe($c->duration_seconds) }} dəq @endif
                @if($c->wrong_attempts > 0) · {{ $c->wrong_attempts }} yanlış @endif
              </span>
              <span class="pr-is-xp">+{{ $c->xp_awarded }}</span>
            </div>
          @endforeach
        </div>
      @endif

    @endif

  </div>
</section>

@include('dossier.partials.altliq')
@endsection

@push('scripts')
{{-- `export.js` bölmənin ortaq asseti: SVG→PNG çevirməsi brauzerdədir,
     çünki serverdə çevirici yoxdur (bax `dossier-cert.js`). --}}
<script src="{{ asset('assets/export.js') }}"></script>
<script src="{{ asset('assets/dossier-profil.js') }}"></script>
@endpush
