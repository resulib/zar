@extends('layouts.panel')
@section('title', 'Parametrlər')
@section('bar', 'İdarə paneli')
@section('side-title', 'İdarəetmə')
@section('side') @include('partials.admin-nav') @endsection
@section('nav')<a href="{{ route('admin.dashboard') }}">İdarə paneli</a><a href="{{ url('/') }}">Sayt</a>@endsection
@section('tools')<form method="POST" action="{{ route('admin.logout') }}">@csrf<button class="chip" type="submit">Çıxış</button></form>@endsection

@section('content')
<div class="page-head"><div><h1>Parametrlər</h1><div class="sub">Sistem vəziyyəti və moderasiya</div></div></div>

{{-- BÖLMƏLƏR — saytın hansı məhsullarının canlı olduğu.
     Bağlı bölmənin ünvanları 404 qaytarır; admin isə onları yoxlaya
     bilir, yoxsa açmadan öncə baxmaq mümkün olmazdı. --}}
<div class="panel" style="margin-bottom:22px">
  <div class="panel-head">
    <span class="label">Bölmələr</span>
    <span class="right label">bağlı bölmə 404 verir</span>
  </div>
  <div class="panel-body">
    <p class="small" style="margin:0 0 16px">
      Sayt üç ayrı məhsul daşıyır. Hazır olmayanı bağlaya bilərsiniz — onun bütün
      ünvanları ziyarətçi üçün mövcud olmayacaq. <b>Siz admin olduğunuz üçün bağlı
      bölməni yenə aça bilirsiniz</b>, ona görə yoxlamaq mümkündür.
    </p>

    {{-- Vəziyyətin MƏNBƏYİ göstərilir: eyni nəticə həm saxlanmış seçim, həm
         də `APP_ENV`-dən gələn ilkin dəyər ola bilər və admin fərqi görməlidir. --}}
    <p class="small" style="margin:0 0 16px">
      @if ($bolmeYazilib)
        Vəziyyət <b>burada saxlanılıb</b> və mühitin ilkin dəyərini üstələyir.
      @else
        Hələ heç nə saxlanılmayıb — <b>«{{ $appEnv }}» mühitinin ilkin dəyəri</b> işləyir.
        İstehsalatda («production») yalnız iş qovluğu açıq qalxır.
      @endif
    </p>

    <form method="POST" action="{{ route('admin.settings.sections') }}">
      @csrf
      <div class="bolme-siyahi">
        @foreach ($bolmeler as $acar => $aciqdir)
          @php($m = $bolmeMeta[$acar] ?? [])
          <label class="bolme @if(! $aciqdir) bolme-bagli @endif">
            <input type="checkbox" name="bolme_{{ $acar }}" value="1" @checked($aciqdir)>
            <span class="bolme-govde">
              <span class="bolme-ad">{{ $m['ad'] ?? $acar }}
                <span class="pill {{ $aciqdir ? 'ok' : 'wait' }}">{{ $aciqdir ? 'açıq' : 'bağlı' }}</span>
              </span>
              <span class="bolme-izah">{{ $m['izah'] ?? '' }}</span>
              <span class="bolme-yollar mono">{{ implode(' · ', (array) ($m['yollar'] ?? [])) }}</span>
            </span>
          </label>
        @endforeach
      </div>

      <div class="field" style="margin-top:18px">
        <span class="label">Ana səhifə — «/» hansı bölməyə aparır</span>
        <div class="bolme-ana">
          @foreach ($bolmeler as $acar => $aciqdir)
            <label class="bolme-ana-s">
              <input type="radio" name="bolme_ana" value="{{ $acar }}" @checked($bolmeAna === $acar)>
              <span>{{ $bolmeMeta[$acar]['ad'] ?? $acar }}</span>
              <span class="mono">{{ $bolmeMeta[$acar]['ana'] ?? '/' }}</span>
            </label>
          @endforeach
        </div>
        <span class="hint">
          Kök ünvan seçilmiş bölməyə yönləndirir (302). Seçilmiş bölmə bağlıdırsa
          açıq olanlardan birincisi işlənir — yəni bir parametr bütün saytı bağlaya bilmir.
          @if ($bolmeFakt !== null && $bolmeFakt !== $bolmeAna)
            <b>Hazırda «{{ $bolmeMeta[$bolmeFakt]['ad'] ?? $bolmeFakt }}» işləyir, çünki seçim bağlıdır.</b>
          @elseif ($bolmeFakt === null)
            <b>Heç bir bölmə açıq deyil — sayt kökü «texniki fasilə» səhifəsi göstərir (503).</b>
          @endif
        </span>
      </div>

      <button class="btn" type="submit" style="margin-top:16px">Yadda saxla</button>
    </form>

    @if ($bolmeYazilib)
      {{-- Saxlanmış seçimi silmək «eyni dəyəri saxlamaq»dan fərqlidir:
           silindikdən sonra vəziyyət `APP_ENV` ilə birlikdə dəyişir. --}}
      <form method="POST" action="{{ route('admin.settings.sections.reset') }}" style="margin-top:10px">
        @csrf
        <button class="btn btn-ghost btn-sm" type="submit">Seçimi sil — mühitin ilkin dəyərinə qayıt</button>
      </form>
    @endif
  </div>
</div>

<div class="cols2">
  <div class="panel">
    <div class="panel-head"><span class="label">Sistem</span></div>
    <div class="panel-body">
      <dl class="kv">
        <div><dt>Ödəniş provayderi</dt><dd><span class="pill {{ $provider === 'epoint' ? 'ok' : 'wait' }}">{{ $provider }}</span></dd></div>
        <div><dt>Test ödənişi</dt><dd>{{ $simulation ? 'Açıqdır — istehsalatda söndürün' : 'Söndürülüb' }}</dd></div>
        <div><dt>Public URL</dt><dd class="mono">{{ $publicUrl }}</dd></div>
        <div><dt>Reyestr prefiksi</dt><dd class="mono">{{ config('zarafat.reg_prefix') }}</dd></div>
      </dl>
      <p class="micro" style="margin-top:14px;line-height:1.6">
        Bu dəyərlər <code>.env</code> faylından oxunur. Provayderi dəyişmək üçün
        <code>PAYMENT_PROVIDER=epoint</code> yazın və Epoint açarlarını əlavə edin.
      </p>
    </div>
  </div>

  <div class="panel">
    <div class="panel-head"><span class="label">Kredit paketləri</span></div>
    <div class="panel-body">
      <div class="tbl-wrap" style="border:0">
        <table class="tbl">
          <thead><tr><th>Paket</th><th class="num">Qiymət</th><th class="num">Kredit</th></tr></thead>
          <tbody>
          @foreach ($packs as $p)
            <tr>
              <td>{{ $p['label'] }}<br><span class="s mono">{{ $p['id'] }}</span></td>
              <td class="num">{{ number_format((float) $p['amount'], 2) }} AZN</td>
              <td class="num">{{ $p['credits'] }}</td>
            </tr>
          @endforeach
          </tbody>
        </table>
      </div>
      <p class="micro" style="margin-top:12px">Paketlər <code>config/zarafat.php</code> faylındadır.</p>
    </div>
  </div>
</div>

<div class="panel" style="margin-top:22px">
  <div class="panel-head">
    <span class="label">AI şablon köməkçisi</span>
    <span class="right"><span class="pill {{ $aiEnabled ? 'ok' : 'mute' }}">{{ $aiEnabled ? 'açıqdır' : 'bağlıdır' }}</span></span>
  </div>
  <div class="panel-body">
    @if ($aiEnabled)
      <p class="micro" style="margin-bottom:14px;line-height:1.65">
        Açar <code>.env</code> faylındadır: <span class="mono">{{ $aiKeyHint }}</span>.
        Şablon formasında «AI ilə hazırla» bölməsi işləyir.
      </p>
    @else
      <p class="note-box">
        Köməkçi bağlıdır. Açmaq üçün <code>.env</code> faylına
        <code>OPENAI_API_KEY=sk-…</code> yazın və serveri yenidən başladın.
        <br>Açar qəsdən bazada saxlanılmır — baza ehtiyat nüsxəsi və kataloq
        ixracı ilə birlikdə yayılmasın deyə.
      </p>
    @endif

    <form method="POST" action="{{ route('admin.settings.ai') }}">
      @csrf
      <div class="field" style="margin-bottom:10px">
        <label class="label" for="ai_model">Model</label>
        <input class="input mono" id="ai_model" name="ai_model" maxlength="60"
               list="aiModels" placeholder="{{ config('ai.model') }}"
               value="{{ old('ai_model', $aiModel) }}">
        <datalist id="aiModels">
          @foreach ($aiSuggested as $m)<option value="{{ $m }}">@endforeach
        </datalist>
        <span class="hint">
          İstənilən OpenAI model adı yazıla bilər — siyahı yalnız təklifdir.
          Boş qoysanız <code>.env</code>-dəki <code>AI_MODEL</code> (default
          <code>{{ config('ai.model') }}</code>) işlənir.
        </span>
        @error('ai_model')<span class="err">{{ $message }}</span>@enderror
      </div>
      <button class="btn" type="submit">Modeli yadda saxla</button>
    </form>
  </div>
</div>

<div class="panel" style="margin-top:22px">
  <div class="panel-head">
    <span class="label">Moderasiya siyahısı</span>
    <span class="right label">{{ $wordCount }} söz</span>
  </div>
  <div class="panel-body">
    <form method="POST" action="{{ route('admin.settings.update') }}">
      @csrf
      <div class="field">
        <label class="label" for="banned_words">Qadağan olunmuş ifadələr</label>
        <textarea class="textarea" id="banned_words" name="banned_words" rows="6"
                  placeholder="vergüllə ayırın">{{ old('banned_words', $bannedWords) }}</textarea>
        <span class="hint">
          Vergüllə ayrılır. Müqayisə Azərbaycan hərflərini normallaşdıraraq aparılır —
          «QADAĞAN» və «qadagan» eyni sayılır.
        </span>
      </div>
      <button class="btn" type="submit">Yadda saxla</button>
    </form>
  </div>
</div>
@endsection
