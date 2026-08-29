@extends('layouts.panel')
@section('title', 'Cavab statistikası')
@section('bar', 'İdarə paneli')
@section('subtitle', 'Daxili sistem · yalnız idarəçilər üçün')
@section('side-title', 'İdarəetmə')
@section('side') @include('partials.admin-nav') @endsection
@section('nav')
  <a href="{{ route('admin.dashboard') }}">İdarə paneli</a>
  <a href="{{ url('/') }}">Sayt</a>
@endsection
@section('tools')
  <form method="POST" action="{{ route('admin.logout') }}">@csrf
    <button class="chip" type="submit">Çıxış</button>
  </form>
@endsection

@section('content')
<div class="page-head">
  <div>
    <h1>Cavab sənədi statistikası</h1>
    <div class="sub">Viral döngənin ölçüləri · {{ now()->format('d.m.Y H:i') }}</div>
  </div>
</div>

{{-- Əsas metrik (§14). İki nisbət ayrı sualı cavablandırır: birincisi
     «sənədə baxanlar cavab yazırmı», ikincisi «düyməni basanlar sona çatırmı». --}}
<dl class="stats">
  <div class="accent">
    <dt>Cavab konversiyası</dt>
    <dd>{{ $rates['view_to_reply'] }}<small>%</small></dd>
    <div class="sub">{{ $headline['answered'] }} / {{ $headline['viewed'] }} baxılmış sənəd</div>
  </div>
  <div>
    <dt>Ən uzun zəncir</dt>
    <dd>{{ $rates['max_depth'] }}<small> səviyyə</small></dd>
    <div class="sub">tavan {{ \App\Support\ReplyKinds::MAX_DEPTH }}</div>
  </div>
  <div>
    <dt>Sənəd başına cavab</dt>
    <dd>{{ number_format($rates['per_document'], 2) }}</dd>
    <div class="sub">{{ $headline['replies'] }} cavab / {{ $headline['roots'] }} əsas sənəd</div>
  </div>
  <div>
    <dt>Reyestrdə cavab</dt>
    <dd>{{ $headline['published'] }}</dd>
    <div class="sub">{{ $headline['replies'] }} yaradılıb</div>
  </div>
</dl>

<div class="panel" style="margin-top:20px">
  <div class="panel-head"><span class="label">Huni</span></div>
  <div class="panel-body">
    @php
      $steps = [
        ['Cavab düyməsi klikləndi', $events['reply_click'] ?? 0],
        ['Redaktor açıldı',         $events['reply_open'] ?? 0],
        ['Sənəd yaradıldı',         $events['reply_created'] ?? 0],
        ['Paylaşıldı',              $events['reply_shared'] ?? 0],
      ];
      $top = max(1, $steps[0][1]);
    @endphp
    @if ($top === 1 && $steps[0][1] === 0)
      <p class="empty" style="padding:14px">Hələ ölçmə yığılmayıb. Bir sənədə cavab verdikdən sonra rəqəmlər burada görünəcək.</p>
    @else
      <table class="tbl">
        <thead><tr><th>Mərhələ</th><th style="width:52%">Nisbət</th><th class="num">Say</th><th class="num">%</th></tr></thead>
        <tbody>
        @foreach ($steps as [$label, $n])
          <tr>
            <td>{{ $label }}</td>
            <td>
              {{-- Sadə zolaq: qrafik kitabxanası yoxdur, panel üslubu ilə eynidir --}}
              <span style="display:block;height:9px;background:var(--rule);border-radius:2px;overflow:hidden">
                <span style="display:block;height:9px;width:{{ $top > 0 ? round($n * 100 / $top, 1) : 0 }}%;background:var(--blue)"></span>
              </span>
            </td>
            <td class="num mono">{{ $n }}</td>
            <td class="num mono">{{ $top > 0 ? round($n * 100 / $top, 1) : 0 }}%</td>
          </tr>
        @endforeach
        </tbody>
      </table>
      <p class="hint" style="margin-top:10px">
        Faizlər birinci addıma görədir. Addımlar arasında nisbət hesablanmır:
        <code>/?cavab=…</code> linkini birbaşa açan istifadəçi «klik» addımını yaratmır,
        ona görə sonrakı sayların birincidən böyük olması normaldır.
      </p>
    @endif
  </div>
</div>

<div class="cols2" style="margin-top:20px;display:grid;grid-template-columns:1fr 1fr;gap:16px">
  <div class="panel">
    <div class="panel-head"><span class="label">Zəncir dərinliyi</span></div>
    <div class="panel-body">
      @if (empty($depths))
        <p class="empty" style="padding:14px">Hələ cavab zənciri yoxdur.</p>
      @else
        @php($maxD = max(array_column($depths, 'n')))
        <table class="tbl">
          <thead><tr><th>Səviyyə</th><th style="width:60%"></th><th class="num">Sənəd</th></tr></thead>
          <tbody>
          @foreach ($depths as $d)
            <tr>
              <td class="mono">{{ $d['depth'] }}</td>
              <td>
                <span style="display:block;height:9px;background:var(--rule);border-radius:2px;overflow:hidden">
                  <span style="display:block;height:9px;width:{{ round($d['n'] * 100 / max(1, $maxD), 1) }}%;background:var(--green)"></span>
                </span>
              </td>
              <td class="num mono">{{ $d['n'] }}</td>
            </tr>
          @endforeach
          </tbody>
        </table>
        <p class="hint" style="margin-top:10px">
          Səviyyə 1 — orijinala birbaşa cavab. Tavan {{ \App\Support\ReplyKinds::MAX_DEPTH }} səviyyədir.
        </p>
      @endif
    </div>
  </div>

  <div class="panel">
    <div class="panel-head"><span class="label">Ən populyar cavab tipləri</span></div>
    <div class="panel-body">
      @if (empty($kinds))
        <p class="empty" style="padding:14px">Hələ cavab sənədi yaradılmayıb.</p>
      @else
        @php($maxK = max(array_column($kinds, 'n')))
        <table class="tbl">
          <thead><tr><th>Niyyət</th><th style="width:55%"></th><th class="num">Say</th></tr></thead>
          <tbody>
          @foreach ($kinds as $k)
            <tr>
              <td>{{ $k['label'] }}</td>
              <td>
                <span style="display:block;height:9px;background:var(--rule);border-radius:2px;overflow:hidden">
                  <span style="display:block;height:9px;width:{{ round($k['n'] * 100 / max(1, $maxK), 1) }}%;background:var(--blue)"></span>
                </span>
              </td>
              <td class="num mono">{{ $k['n'] }}</td>
            </tr>
          @endforeach
          </tbody>
        </table>
      @endif
    </div>
  </div>
</div>

<div class="panel" style="margin-top:20px">
  <div class="panel-head"><span class="label">Kateqoriya üzrə cavab bölgüsü</span></div>
  <div class="panel-body">
    @if (empty($categories))
      <p class="empty" style="padding:14px">Hələ kateqoriya üzrə ölçmə yoxdur.</p>
    @else
      <table class="tbl">
        <thead><tr><th>Kateqoriya</th><th class="num">Klik</th><th class="num">Cavab</th><th class="num">Payı</th></tr></thead>
        <tbody>
        @foreach ($categories as $c)
          <tr>
            <td class="mono">{{ $c['cat'] }}</td>
            <td class="num mono">{{ $c['clicks'] }}</td>
            <td class="num mono">{{ $c['created'] }}</td>
            <td class="num mono">{{ $c['share'] }}%</td>
          </tr>
        @endforeach
        </tbody>
      </table>
      <p class="hint" style="margin-top:10px">
        «Payı» — həmin kateqoriyanın bütün cavablar içindəki çəkisi, yəni hansı mövzular
        döngəni işə salır. Kateqoriya hadisə yazılan anda saxlanılır: şablon sonradan
        başqa kateqoriyaya köçürülsə də tarixi rəqəm dəyişmir.
      </p>
    @endif
  </div>
</div>
@endsection
