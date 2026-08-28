@extends('layouts.panel')
@section('title', 'İdarə paneli')
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
  <div><h1>Ümumi baxış</h1><div class="sub">{{ now()->format('d.m.Y H:i') }}</div></div>
</div>

<dl class="stats">
  <div class="accent"><dt>Bu gün gəlir</dt><dd>{{ number_format($stats['revenue_today'], 2) }} <small>AZN</small></dd></div>
  <div><dt>Ümumi gəlir</dt><dd>{{ number_format($stats['revenue_total'], 2) }} <small>AZN</small></dd></div>
  <div><dt>Bu gün sənəd</dt><dd>{{ $stats['documents_today'] }}</dd></div>
  <div><dt>Reyestrdə</dt><dd>{{ $stats['documents_published'] }}</dd></div>
</dl>

<dl class="stats">
  <div><dt>Ümumi sənəd</dt><dd>{{ $stats['documents_total'] }}</dd></div>
  <div><dt>İstifadəçi</dt><dd>{{ $stats['users_total'] }}</dd>
    <div class="sub">{{ $stats['users_registered'] }} qeydiyyatlı</div></div>
  <div><dt>Xərclənməmiş kredit</dt><dd>{{ $stats['credits_outstanding'] }}</dd></div>
  <div class="{{ $stats['reports_open'] > 0 ? 'warn' : '' }}"><dt>Açıq şikayət</dt><dd>{{ $stats['reports_open'] }}</dd></div>
</dl>

{{-- Dərc nisbəti: sənəd brauzerdə render olunduğu üçün ödənişsiz şəkil almaq
     texniki olaraq mümkündür. Belə istifadəçi sənəd yaradır, amma dərc etmir —
     nisbətin kəskin enməsi həmin üsulun yayıldığına işarə ola bilər. --}}
<dl class="stats">
  <div class="{{ $publish['drop'] ? 'warn' : '' }}">
    <dt>Dərc nisbəti · 7 gün</dt>
    <dd>{{ $publish['rate_7'] === null ? '—' : number_format($publish['rate_7'], 0) }}<small>%</small></dd>
    <div class="sub">{{ $publish['pub_7'] }} / {{ $publish['made_7'] }} sənəd</div>
  </div>
  <div>
    <dt>Dərc nisbəti · ümumi</dt>
    <dd>{{ $publish['rate_all'] === null ? '—' : number_format($publish['rate_all'], 0) }}<small>%</small></dd>
    <div class="sub">{{ $publish['made_all'] }} sənəd üzrə</div>
  </div>
</dl>

<p class="stat-note {{ $publish['drop'] ? 'warn' : '' }}">
  @if ($publish['thin'])
    Son 7 gündə 20-dən az sənəd var — nisbət hələ etibarlı deyil.
  @elseif ($publish['drop'])
    <b>Diqqət:</b> son 7 günün dərc nisbəti ümumi nisbətdən 15 faiz bəndindən çox aşağıdır.
    Sənədlər yaradılır, lakin reyestrə yazılmır. Ödənişsiz yükləmə üsulunun yayılması ola bilər —
    sənəd brauzerdə render olunur və konsoldan ödəniş bayrağı dəyişdirilə bilər.
  @else
    Nisbət sabitdir. Kəskin enmə ödənişsiz yükləmə üsulunun yayıldığına işarə ola bilər.
  @endif
</p>

@php
  $maxDocs = max(1, max(array_column($days, 'documents')));
  $maxRev  = max(0.01, max(array_column($days, 'revenue')));
  $w = 980; $h = 150; $n = count($days); $gap = 8;
  $bw = ($w - $gap * ($n - 1)) / $n;
@endphp

<div class="chart">
  <h3>Son 14 gün</h3>
  <div class="cap">Sütun — sənəd sayı · xətt — gündəlik gəlir (AZN)</div>
  <svg viewBox="0 0 {{ $w }} {{ $h + 26 }}" role="img" aria-label="Son 14 günün dinamikası">
    <line x1="0" y1="{{ $h }}" x2="{{ $w }}" y2="{{ $h }}" stroke="#d6d1c3" stroke-width="1"/>
    @foreach ($days as $i => $d)
      @php
        $x  = $i * ($bw + $gap);
        $bh = $d['documents'] / $maxDocs * ($h - 22);
      @endphp
      <rect x="{{ round($x, 1) }}" y="{{ round($h - $bh, 1) }}" width="{{ round($bw, 1) }}" height="{{ round($bh, 1) }}"
            fill="#17355d" opacity="{{ $i === $n - 1 ? '1' : '.72' }}"/>
      @if ($d['documents'] > 0)
        <text x="{{ round($x + $bw / 2, 1) }}" y="{{ round($h - $bh - 6, 1) }}" text-anchor="middle"
              font-family="'Plex Mono', monospace" font-size="10" fill="#565a61">{{ $d['documents'] }}</text>
      @endif
      <text x="{{ round($x + $bw / 2, 1) }}" y="{{ $h + 16 }}" text-anchor="middle"
            font-family="'Plex Mono', monospace" font-size="9.5" fill="#8a8c93">{{ $d['label'] }}</text>
    @endforeach

    @php
      $pts = [];
      foreach ($days as $i => $d) {
          $pts[] = round($i * ($bw + $gap) + $bw / 2, 1) . ',' . round($h - $d['revenue'] / $maxRev * ($h - 30), 1);
      }
    @endphp
    <polyline points="{{ implode(' ', $pts) }}" fill="none" stroke="#a3232c" stroke-width="1.6"/>
    @foreach ($pts as $p)
      @php([$px, $py] = explode(',', $p))
      <circle cx="{{ $px }}" cy="{{ $py }}" r="2.4" fill="#a3232c"/>
    @endforeach
  </svg>
</div>

<div class="cols2">
  <div>
    <div class="page-head" style="margin-bottom:12px">
      <h1 style="font-size:17px">Son ödənişlər</h1>
      <div class="right"><a class="btn btn-ghost btn-sm" href="{{ route('admin.payments') }}">Hamısı</a></div>
    </div>
    <div class="tbl-wrap">
      <table class="tbl">
        <tbody>
        @forelse ($recentPayments as $p)
          <tr>
            <td class="mono">{{ $p->order_id }}<br><span class="s">{{ $p->created_at->format('d.m H:i') }}</span></td>
            <td><span class="s">{{ $p->user?->displayName() }}</span></td>
            <td class="num">{{ number_format((float) $p->amount, 2) }} AZN</td>
            <td><span class="pill {{ $p->status === 'paid' ? 'ok' : ($p->status === 'pending' ? 'wait' : 'bad') }}">{{ $p->statusLabel() }}</span></td>
          </tr>
        @empty
          <tr><td class="tbl-empty">Ödəniş yoxdur.</td></tr>
        @endforelse
        </tbody>
      </table>
    </div>
  </div>

  <div>
    <div class="page-head" style="margin-bottom:12px">
      <h1 style="font-size:17px">Son sənədlər</h1>
      <div class="right"><a class="btn btn-ghost btn-sm" href="{{ route('admin.documents') }}">Hamısı</a></div>
    </div>
    <div class="tbl-wrap">
      <table class="tbl">
        <tbody>
        @forelse ($recentDocuments as $d)
          <tr>
            <td>
              <span class="t" style="font-size:13px">{{ \Illuminate\Support\Str::limit($d->title, 40) }}</span>
              <span class="s">{{ $d->reg_no }} · {{ $d->layout }}</span>
            </td>
            <td><span class="pill {{ $d->status === 'published' ? 'ok' : ($d->status === 'removed' ? 'bad' : 'mute') }}">{{ $d->status }}</span></td>
            <td><a class="btn btn-ghost btn-sm" href="{{ route('admin.documents.show', $d->reg_no) }}">Bax</a></td>
          </tr>
        @empty
          <tr><td class="tbl-empty">Sənəd yoxdur.</td></tr>
        @endforelse
        </tbody>
      </table>
    </div>
  </div>
</div>
@endsection
