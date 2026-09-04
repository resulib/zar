{{-- Yazışma bloku — ŞƏKİL DEYİL, HTML. Kağızın üstünə çap edilmiş ekran
     görüntüsü kimi çərçivəyə salınır və altında izah sətri olur.
     Silinmiş mesaj oyunda dəlildir: mətni serverdə sabitdir, məzmundan
     gəlmir — belədə heç bir qovluq onu «yumşalda» bilmir. --}}
@php($c = (array) ($b['chat'] ?? $b))
<div class="shot">
  <div class="shot-bar">
    <div class="shot-av"></div>
    <div class="shot-nm">{{ $b['sohbet'] ?? '' }}<small>{{ $b['gorulme'] ?? '' }}</small></div>
  </div>
  @foreach($b['gunler'] ?? [] as $gun)
    @if(! empty($gun['tarix']))<div class="shot-day">{{ $gun['tarix'] }}</div>@endif
    @foreach($gun['mesajlar'] ?? [] as $mi => $m)
      @php($nov = $m['nov'] ?? 'metn')
      @php($yan = ($m['yon'] ?? 'gelen') === 'cixan' ? 'i' : 'u')
      @if($nov === 'sistem')
        <div class="shot-sistem">{{ $m['metn'] ?? '' }}</div>
      @elseif($nov === 'silinmis')
        <div class="bub del">Bu mesaj silinib<time>{{ $m['saat'] ?? '' }}</time></div>
      @elseif($nov === 'sesli')
        {{-- Dalğa məlumatdan gəlir; yoxdursa müddət və mesajın sırasından
             DETERMİNİK qurulur — render təsadüfi ola bilməz. --}}
        @php($dalga = (array) ($m['dalga'] ?? []))
        @php($say = 28)
        <div class="bub {{ $yan }} ses">
          <span class="ses-oynat" aria-hidden="true">▶</span>
          <span class="ses-dalga">
            @for($i = 0; $i < $say; $i++)
              {{-- Determinik dalğa: `Math.random()` yoxdur, yoxsa hər render
                   fərqli olardı və sənəd sabit qalmazdı. --}}
              @php($t = ($i * 13 + $mi * 7 + (int) ($m['saniye'] ?? 0)) % 17)
              @php($h = $dalga[$i] ?? (2 + abs(8 - $t) + ($t % 5)))
              <i style="height:{{ max(3, min(22, 2 + $h * 1.5)) }}px"></i>
            @endfor
          </span>
          <span class="ses-vaxt">{{ sprintf('%d:%02d', intdiv((int) ($m['saniye'] ?? 0), 60), ((int) ($m['saniye'] ?? 0)) % 60) }}</span>
          @if(! empty($m['ses']))<audio controls preload="none" src="{{ $m['ses'] }}"></audio>@endif
          <time>{{ $m['saat'] ?? '' }}</time>
        </div>
      @elseif($nov === 'sekil')
        <div class="bub {{ $yan }} sekilli">
          <span class="msj-sekil">@if(! empty($m['sekil']))<img src="{{ $m['sekil'] }}" alt="">@else<span>şəkil</span>@endif</span>
          @if(! empty($m['izah']))<small>{{ $m['izah'] }}</small>@endif
          <time>{{ $m['saat'] ?? '' }}</time>
        </div>
      @elseif($nov === 'sened')
        <div class="bub {{ $yan }} senedli">
          <span class="msj-sened">▤</span>
          <span class="msj-ad">{{ $m['ad'] ?? '' }}<small>{{ $m['olcu'] ?? '' }}</small></span>
          <time>{{ $m['saat'] ?? '' }}</time>
        </div>
      @else
        <div class="bub {{ $yan }}">{{ $m['metn'] ?? '' }}<time>{{ $m['saat'] ?? '' }}@if(! empty($m['oxunub']))<span class="oxundu">✓✓</span>@endif</time></div>
      @endif
    @endforeach
  @endforeach
</div>
@if(trim((string) ($b['izah'] ?? '')) !== '')
<div class="cap">{{ $b['izah'] }}</div>
@endif
@include('dossier.partials.kenar')
