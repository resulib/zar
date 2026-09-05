@extends('layouts.dossier')
@section('wrap', 'sayt')
@section('robots', 'index, follow')
@section('title', 'İstifadə şərtləri — ' . config('dossier.brand'))

@section('content')
@include('dossier.partials.ust')

@include('dossier.partials.bas', [
  'nisan' => 'RƏSMİ SƏNƏD DEYİL',
  'ust'   => 'Hüquqi qeyd',
  'bas'   => 'İstifadə şərtləri və məxfilik',
  'alt'   => 'Bu bölmə bədii detektiv oyunudur. Aşağıdakılar onun nə olduğunu və nə OLMADIĞINI dəqiq yazır.',
])

<section class="metn-sehife">
  <div class="sayt-en">

    <h2>Məhsul nədir</h2>
    <p>Bu bölmə bədii detektiv oyunudur. Hər iş qovluğu uydurmadır: personajlar, qurumlar,
      ünvanlar, sənədlər və hadisələr müəllif tərəfindən yazılıb. Real şəxs, təşkilat və ya
      hadisə ilə oxşarlıq təsadüfdür. Qovluqlardakı sənədlər rəsmi sənəd deyil,
      heç bir orqana aid deyil və heç bir hüquqi nəticə doğurmur.</p>

    <h2>Qurum uydurmadır</h2>
    <p>Sənədləri verən qurum — <b>{{ \App\Support\Dossier\Byuro::AD }}
      ({{ \App\Support\Dossier\Byuro::QISA }})</b> — mövcud deyil. O, heç bir real polis
      bölməsi, nazirlik, prokurorluq və ya digər dövlət strukturu ilə əlaqəli deyil və
      onların adından çıxış etmir. Qovluqlardakı vəzifələr, möhürlər, blanklar və iş
      nömrələri də bu uydurma büroya aiddir.</p>
    <p>Hər sənədin altında dəyişməz qeyd var:
      «{{ \App\Support\Dossier\Byuro::QEYD }}»</p>

    <h2>Ödəniş</h2>
    <p>Giriş qovluğu pulsuzdur. Qalan qovluqlar kredit ilə açılır və bir dəfə ödənilir —
      açdığınız qovluğa istədiyiniz qədər qayıda bilərsiniz. Kredit hesabınızda qalır və
      istifadə edilmədikcə itmir.</p>

    <h2>Nə saxlayırıq</h2>
    <p>Oyunu yarımçıq qoyub sonra davam edə biləsiniz deyə irəliləyişiniz bazada saxlanılır:
      hansı sənədləri oxuduğunuz, hansılarını qeyd dəftərinə sancdığınız, kilidin açılıb-açılmadığı,
      işə başlama vaxtınız və rəy cəhdləriniz. Üz qabığında yazdığınız ad da saxlanılır — o,
      sənədlərin içində və sertifikatda görünür.</p>
    <p>Sizi tanımaq üçün brauzerinizə bir kimlik çərəzi qoyulur. Hesab yaratsanız, qonaq
      sessiyanızdakı irəliləyiş hesabınıza köçürülür.</p>

    <h2>Paylaşdığınız sertifikat</h2>
    <p>İşi bağlayanda çıxan sertifikat linki açıqdır — linki bilən hər kəs onu aça bilər.
      Sertifikatda qatilin adı, motiv və heç bir sənəd məzmunu yoxdur; yalnız iş nömrəsi,
      yazdığınız ad, sərf etdiyiniz dəqiqə və sancdığınız sənəd sayı görünür.</p>

    <h2>Nə etməmək lazımdır</h2>
    <p>Qovluqların mətnini, sənədlərini və həll açarını başqa yerdə dərc etmək, satmaq və ya
      yaymaq olmaz. Cavabları açıq şəkildə paylaşmaq başqalarının oyununu korlayır.</p>

    @if(config('dossier.contact') !== '')
      <h2>Əlaqə</h2>
      <p><a href="mailto:{{ config('dossier.contact') }}">{{ config('dossier.contact') }}</a></p>
    @endif
  </div>
</section>

@include('dossier.partials.altliq')
@endsection
