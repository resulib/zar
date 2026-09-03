@extends('layouts.dossier')
@section('wrap', 'sayt')
@section('title', 'Komponent qalereyası')

{{-- YALNIZ İŞLƏYİCİLƏR ÜÇÜN. Marşrut istehsalatda qeydiyyatdan keçmir, yəni
     ünvan orada MÖVCUD DEYİL — parol unudulma riski yoxdur.
     İki işə yarayır: yeni qovluq yazanda hansı blokun mövcud olduğunu
     göstərir, və yeni komponent əlavə edəndə əvvəlcə burada sınanır. --}}
@section('content')
@include('dossier.partials.ust')

<section class="qal">
  <div class="sayt-en">
    <h1 class="qal-bas">Komponent qalereyası</h1>
    <p class="qal-l">Sənəd hazır şablon deyil — blokların ardıcıllığıdır. Aşağıdakı
      {{ count($bloklar) }} blok növü, {{ count($elyazma) }} əlyazma xarakteri,
      {{ count($kagiz) }} fiziki effekt və {{ count($mohurler) }} möhür variantı mövcuddur.
      Hər nümunənin yanında onun JSON parçası var — kopyalayıb yeni qovluqda işlət.</p>

    <nav class="qal-nav">
      <a href="#bloklar">Bloklar</a><a href="#elyazma">Əlyazma</a><a href="#kenar">Kənar qeydi</a>
      <a href="#kagiz">Fiziki effektlər</a><a href="#mohur">Möhürlər</a><a href="#kilid">Kilid</a>
    </nav>

    <h2 class="qal-h" id="bloklar">Blok növləri</h2>
    @foreach($bloklar as $n)
      <div class="qal-blok">
        <div class="qal-ad"><code>{{ $n['ad'] }}</code></div>
        <p class="qal-izah">{{ $n['izah'] }}</p>
        <div class="qal-cut">
          <div class="qal-render"><div class="paper">@include('dossier.qal-blok', ['b' => $n['blok']])</div></div>
          <pre class="qal-json">{{ json_encode($n['blok'], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) }}</pre>
        </div>
      </div>
    @endforeach

    <h2 class="qal-h" id="elyazma">Əlyazma xarakterləri</h2>
    <p class="qal-izah">Azərbaycan hərflərini daşıyan cəmi iki əlyazma ailəsi var
      (Caveat, Bad Script), ona görə dörd xarakter iki ailə + əyilmə/sıxlıq/ölçü ilə qurulur.
      Blok qısa mətn üçündür: {{ $elyazmaHedd }} simvolu aşan mətn yoxlayıcıda xəbərdarlıq alır.</p>
    <div class="qal-setir">
      @foreach($elyazma as $n)
        <div class="qal-kicik">
          <div class="qal-ad"><code>{{ $n['ad'] }}</code></div>
          <div class="paper">@include('dossier.qal-blok', ['b' => $n['blok']])</div>
        </div>
      @endforeach
    </div>

    <h2 class="qal-h" id="kenar">Kənar qeydi</h2>
    <p class="qal-izah">Blok deyil — istənilən blokun qəbul etdiyi nişandır.
      Hansı SÖZƏ aid olduğu isə mətnin içində <code>%%söz%%</code> ilə göstərilir:
      söz indeksi mətn dəyişəndə sürüşür, işarə isə sözlə birlikdə gəzir.</p>
    <div class="qal-setir">
      @foreach($kenar as $b)
        <div class="qal-kicik">
          <div class="qal-ad"><code>{{ $b['kenar']['nov'] }}</code></div>
          <div class="paper">@include('dossier.qal-blok', ['b' => $b])</div>
        </div>
      @endforeach
    </div>

    <h2 class="qal-h" id="kagiz">Fiziki effektlər</h2>
    <p class="qal-izah">Hamısı CSS və SVG-dir — hazır şəkil faylı yoxdur, çünki sənəd
      hər ölçüdə iti qalmalı və mətni seçilə bilən olmalıdır.
      <b>Bir sənəddə üçdən çox ağır effekt olmaz</b> (ləkə · cırılma · kseroks · köhnəlmə ≥ 2):
      hər vərəq ləkəli olanda heç biri seçilmir. Qayda yoxlayıcıda xətadır.</p>
    <div class="qal-setir">
      @foreach($kagiz as $n)
        <div class="qal-kicik">
          <div class="qal-ad"><code>{{ $n['ad'] }}</code></div>
          @include('dossier.qal-kagiz', ['kagiz' => $n['kagiz']])
        </div>
      @endforeach
    </div>

    <h2 class="qal-h" id="mohur">Möhürlər</h2>
    <p class="qal-izah">Möhürün mətni, forması, rəngi, bucağı, şəffaflığı və vərəqdəki yeri
      məlumatdan gəlir; bir sənəddə bir neçəsi ola bilər. Şəffaflıq məcburidir —
      möhür mətnin üstünə düşəndə mətn oxunaqlı qalmalıdır.</p>
    <div class="qal-setir">
      @foreach($mohurler as $mohur)
        <div class="qal-kicik">
          <div class="qal-ad"><code>{{ $mohur['forma'] }} · {{ $mohur['reng'] }}</code></div>
          <div class="paper qal-mohurluq">
            <div class="p-body"><p>Möhürün altındakı mətn oxunaqlı qalmalıdır. Bu abzas
              məhz onun üçün buradadır.</p></div>
            @include('dossier.partials.mohur')
          </div>
        </div>
      @endforeach
    </div>

    <h2 class="qal-h" id="kilid">Kilid növləri</h2>
    <p class="qal-izah">Kilid sənədin növü deyil, <b>xassəsidir</b>: istənilən sənəd kilidli
      ola bilər — cədvəl də, yazışma da, sxem də. Kilidli sənədin blokları heç bir halda
      brauzerə göndərilmir; kod yalnız serverdə yoxlanılır.</p>
    <div class="qal-setir">
      @foreach($kilidler as $k)
        <div class="qal-kicik">
          <div class="qal-ad"><code>{{ $k['nov'] }}</code></div>
          <pre class="qal-json">{{ json_encode($k, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) }}</pre>
        </div>
      @endforeach
    </div>

    <div style="height:40px"></div>
  </div>
</section>

@include('dossier.partials.altliq')
@endsection
