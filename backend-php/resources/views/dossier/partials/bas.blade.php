{{-- BÖLMƏNİN ORTAQ SƏHİFƏ BAŞLIĞI — istintaq lövhəsi dili.

     Ana səhifədəki birinci ekranın kiçildilmiş variantıdır: eyni ölçü
     şəbəkəsi, eyni barmaq izi, eyni qırmızı nişan. Ayrıca partial-dır ki,
     altı səhifə eyni fonu təkrar yazmasın — effekti köçürmək onun altı
     yerdə bir-birindən sürüşməsi deməkdir.

     Dəyişənlər: $nisan (qırmızı çip), $ust (kiçik sətir), $bas (h1),
     $alt (izah) — hamısı könüllüdür. --}}
<section class="sbas">
  @include('dossier.partials.lovhe')

  {{-- `dar` — məzmun sütunu dar olanda (`pr` səhifələri) başlıq da onunla
       eyni enə oturur; əks halda h1 məzmundan yüzlərlə piksel sola qaçır. --}}
  <div class="sayt-en sbas-in @if(! empty($dar)) pr-dar @endif">
    @if(! empty($ust) || ! empty($nisan))
      <p class="sbas-ust">
        @if(! empty($nisan))<span class="nisan-q">{{ $nisan }}</span>@endif
        @if(! empty($ust)){{ $ust }}@endif
      </p>
    @endif
    <h1>{{ $bas }}</h1>
    @if(! empty($alt))<p class="sbas-alt">{{ $alt }}</p>@endif
    {{ $slot ?? '' }}
  </div>
</section>
