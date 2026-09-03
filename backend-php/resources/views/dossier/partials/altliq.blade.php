<footer class="altliq">
  <div class="sayt-en">
    <div class="altliq-s">
      <a href="{{ route('dossier.index') }}#isler">İşlər</a>
      <a href="{{ route('dossier.terms') }}">İstifadə şərtləri</a>
      @if(config('dossier.contact') !== '')
        <a href="mailto:{{ config('dossier.contact') }}">{{ config('dossier.contact') }}</a>
      @endif
    </div>
    <p class="altliq-q">Bədii əsərdir. Personajlar, qurumlar və hadisələr uydurmadır.
      Real şəxs və ya təşkilatla oxşarlıq təsadüfdür.</p>
  </div>
</footer>
