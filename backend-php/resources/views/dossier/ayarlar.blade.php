@extends('layouts.dossier')
@section('wrap', 'sayt')
@section('title', 'Vəsiqə ayarları')

@push('head')
<link rel="stylesheet" href="{{ asset('assets/dossier-profil.css') }}">
@endpush

@section('content')
@include('dossier.partials.ust')

<section class="pr">
  <div class="sayt-en pr-dar">

    @include('dossier.partials.flash')

    <div class="pr-baslq">
      <h1>Vəsiqə ayarları</h1>
      <a class="pr-link" href="{{ route('dossier.profil') }}">Vəsiqəyə qayıt</a>
    </div>

    {{-- ŞÖBƏ — nişan nömrəsini doğuran seçim. --}}
    <div class="pr-blok pr-form">
      <h2>Şöbə</h2>
      @if($profile->department_locked)
        <p class="pr-qeyd">
          Şöbəniz <b>{{ $profile->departmentLabel() }}</b>. Dəyişiklik haqqınızı
          istifadə etmisiniz — şöbə bir dəfə dəyişdirilə bilər.
        </p>
      @else
        <p class="pr-qeyd">
          @if($profile->hasBadge())
            Şöbəni <b>bir dəfə</b> dəyişə bilərsiniz. Vəsiqə nömrəniz
            (<b>{{ $profile->badge_number }}</b>) dəyişmir — nömrə vəzifəyə yox,
            adama verilir.
          @else
            Şöbə seçildikdə vəsiqə nömrəniz veriləcək və bir daha dəyişməyəcək.
            Sonradan şöbəni yalnız <b>bir dəfə</b> dəyişmək olar.
          @endif
        </p>

        <form method="POST" action="{{ route('dossier.profil.sobe') }}" class="pr-sobeler">
          @csrf
          @foreach($sobeler as $kod => $ad)
            <label class="pr-sobe {{ $profile->department === $kod ? 'secili' : '' }}">
              <input type="radio" name="sobe" value="{{ $kod }}"
                     @checked($profile->department === $kod)>
              <b>{{ $kod }}</b>
              <span>{{ $ad }}</span>
            </label>
          @endforeach
          <button type="submit" class="pr-btn">
            {{ $profile->hasBadge() ? 'Şöbəni dəyiş' : 'Təyinatı təsdiqlə' }}
          </button>
        </form>
      @endif
    </div>

    {{-- AD --}}
    <div class="pr-blok pr-form">
      <h2>Göstərilən ad</h2>
      <p class="pr-qeyd">Vəsiqədə və reytinqdə bu ad görünür.</p>
      <form method="POST" action="{{ route('dossier.profil.ad') }}" class="pr-setir">
        @csrf
        <input class="pr-input" type="text" name="ad" maxlength="40"
               value="{{ old('ad', $profile->display_name) }}" placeholder="Ad Soyad">
        <button type="submit" class="pr-btn">Yadda saxla</button>
      </form>
    </div>

    {{-- PROFİL ŞƏKLİ --}}
    <div class="pr-blok pr-form">
      <h2>Profil şəkli</h2>

      @switch($profile->avatar_status)
        @case(\App\Models\InvestigatorProfile::AVATAR_GOZLEYIR)
          <p class="pr-qeyd pr-hal gozleyir">Şəkil yoxlanılır. Təsdiqlənənə qədər onu
             yalnız siz görürsünüz — başqaları boş siluet görür.</p>
          @break
        @case(\App\Models\InvestigatorProfile::AVATAR_TESDIQ)
          <p class="pr-qeyd pr-hal tesdiq">Şəkil təsdiqlənib və vəsiqədə görünür.</p>
          @break
        @case(\App\Models\InvestigatorProfile::AVATAR_REDD)
          <p class="pr-qeyd pr-hal redd">Şəkil qəbul edilmədi.
             @if($profile->avatar_reason !== '') Səbəb: {{ $profile->avatar_reason }} @endif
             Başqa şəkil yükləyə bilərsiniz.</p>
          @break
        @default
          <p class="pr-qeyd">Kvadrat kəsim avtomatik edilir. JPEG, PNG və ya WEBP,
             ən çoxu 5 MB. Şəkil yoxlamadan keçdikdən sonra ictimai yerlərdə görünür.</p>
      @endswitch

      <div class="pr-foto-setir">
        @if($profile->avatar_path)
          <img class="pr-foto-onizleme"
               src="{{ route('dossier.profil.foto', $profile->id) }}" alt="">
        @endif
        <form method="POST" action="{{ route('dossier.profil.foto.store') }}"
              enctype="multipart/form-data" class="pr-setir">
          @csrf
          <input class="pr-input" type="file" name="foto" accept="image/jpeg,image/png,image/webp" required>
          <button type="submit" class="pr-btn">Yüklə</button>
        </form>
      </div>
    </div>

    {{-- GİZLİLİK --}}
    <div class="pr-blok pr-form">
      <h2>Reytinqdə görünmə</h2>
      <p class="pr-qeyd">
        Söndürsəniz siyahıda görünməzsiniz, amma öz mövqeyinizi vəsiqə
        səhifənizdə görməyə davam edərsiniz.
      </p>
      <form method="POST" action="{{ route('dossier.profil.gizlilik') }}" class="pr-setir">
        @csrf
        <label class="pr-secim">
          <input type="checkbox" name="ictimai" value="1" @checked($profile->is_public)>
          <span>Reytinq siyahısında görünüm</span>
        </label>
        <button type="submit" class="pr-btn">Yadda saxla</button>
      </form>
    </div>

    <form method="POST" action="{{ route('dossier.logout') }}" class="pr-cixis">
      @csrf
      <button type="submit" class="pr-link">Çıxış</button>
    </form>

  </div>
</section>

@include('dossier.partials.altliq')
@endsection
