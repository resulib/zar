@extends('layouts.panel')
@section('title', 'Parametrlər')
@section('bar', 'İdarə paneli')
@section('side-title', 'İdarəetmə')
@section('side') @include('partials.admin-nav') @endsection
@section('nav')<a href="{{ route('admin.dashboard') }}">İdarə paneli</a><a href="{{ url('/') }}">Sayt</a>@endsection
@section('tools')<form method="POST" action="{{ route('admin.logout') }}">@csrf<button class="chip" type="submit">Çıxış</button></form>@endsection

@section('content')
<div class="page-head"><div><h1>Parametrlər</h1><div class="sub">Sistem vəziyyəti və moderasiya</div></div></div>

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
