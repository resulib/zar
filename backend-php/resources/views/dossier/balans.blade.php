@extends('layouts.dossier')
@section('wrap', 'sayt')
@section('title', 'Balans')

@push('head')
<link rel="stylesheet" href="{{ asset('assets/dossier-profil.css') }}">
@endpush

{{-- Bölmənin ÖZ balans ekranı. `/kabinet`-ə link verilmir: o, saytın
     digər məhsuludur və bağlana bilər. Ödəniş məntiqi təkrarlanmır —
     eyni `PaymentService` çağırılır. --}}
@section('content')
@include('dossier.partials.ust')

<section class="pr">
  <div class="sayt-en pr-dar">

    @include('dossier.partials.flash')

    @if($netice === 'ugurlu')
      <div class="pr-flash ok">Ödəniş qəbul edildi. Balans bir neçə saniyə ərzində yenilənir.</div>
    @elseif($netice === 'xeta')
      <div class="pr-flash xeta"><span>Ödəniş tamamlanmadı. Kart məlumatlarını yoxlayıb yenidən cəhd edin.</span></div>
    @endif

    <div class="pr-hesab-bas">
      <span class="pr-etiket">Kassa</span>
      <h1>Balans</h1>
      <p>Hazırkı balansınız <b>{{ $user->credits }} kredit</b>.
         Bir iş qovluğu <b>{{ $qiymet }} kredit</b>dir və bir dəfə alınır —
         açdığınız işə istənilən vaxt qayıda bilərsiniz.</p>
    </div>

    <div class="pr-blok">
      <h2>Paket seç</h2>
      <form method="POST" action="{{ route('dossier.balans.al') }}" class="pr-paketler">
        @csrf
        @foreach ($packs as $pack)
          <button class="pr-paket @if($pack['best'] ?? false) pr-paket-yaxsi @endif"
                  name="pack" value="{{ $pack['id'] }}" type="submit">
            <span class="pr-paket-ad">{{ $pack['label'] }}</span>
            <span class="pr-paket-izah">{{ $pack['note'] ?? '' }}</span>
            <span class="pr-paket-qiymet">{{ number_format((float) $pack['amount'], 2) }} AZN</span>
          </button>
        @endforeach
      </form>
      <p class="pr-qeyd">Ödəniş bank səhifəsində aparılır. Kart məlumatları bu sayta düşmür.</p>
    </div>

    <div class="pr-blok">
      <h2>Kredit nəyə xərclənir</h2>
      <p class="pr-qeyd">
        Yalnız qovluğun açılmasına. Giriş işi pulsuzdur; sənədləri oxumaq,
        kodları açmaq, qatili adlandırmaq və sertifikat almaq üçün əlavə
        ödəniş yoxdur. Açılmış qovluq geri alınmır.
      </p>
      <a class="pr-btn pr-btn-bos" href="{{ route('dossier.index') }}">Kataloqa qayıt</a>
    </div>

  </div>
</section>

@include('dossier.partials.altliq')
@endsection
