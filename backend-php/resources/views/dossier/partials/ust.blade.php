{{-- Saytın üst lenti. Ad `config('dossier.brand')`-dədir və MÜVƏQQƏTİDİR —
     Blade-lərdə sabit yazılmır ki, ad seçiləndə bir sətir dəyişsin. --}}
<header class="sayt-ust">
  <div class="sayt-en sayt-ust-in">
    <a class="marka" href="{{ route('dossier.index') }}">
      <svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="29"/><path d="M22 15h14l10 10v24H22z"/><path d="M36 15v10h10"/><text class="afib-h" x="32" y="42" text-anchor="middle">AFİB</text></svg>
      <span>{{ config('dossier.brand') }}</span>
    </a>
    <nav class="sayt-nav">
      <a href="{{ route('dossier.index') }}#isler">İşlər</a>
      <a href="{{ route('dossier.reyting') }}">Reytinq</a>
      {{-- Kassa bölmənin ÖZ ekranıdır: kabinet digər məhsuldur və bağlana bilər. --}}
      <a href="{{ route('dossier.balans') }}">Balans</a>
      @if(auth()->check())
        <a href="{{ route('dossier.profil') }}">Vəsiqəm</a>
      @else
        <a href="{{ route('dossier.hesab') }}">Giriş</a>
      @endif
      <a href="{{ route('dossier.index') }}#suallar">Suallar</a>
    </nav>
  </div>
</header>
