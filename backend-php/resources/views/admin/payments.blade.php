@extends('layouts.panel')
@section('title', 'Ödənişlər')
@section('bar', 'İdarə paneli')
@section('side-title', 'İdarəetmə')
@section('side') @include('partials.admin-nav') @endsection
@section('nav')<a href="{{ route('admin.dashboard') }}">İdarə paneli</a><a href="{{ url('/') }}">Sayt</a>@endsection
@section('tools')<form method="POST" action="{{ route('admin.logout') }}">@csrf<button class="chip" type="submit">Çıxış</button></form>@endsection

@section('content')
<div class="page-head"><div><h1>Ödənişlər</h1><div class="sub">{{ $payments->total() }} sifariş</div></div></div>

<dl class="stats">
  <div class="accent"><dt>Ödənilmiş məbləğ</dt><dd>{{ number_format($totals['paid'], 2) }} <small>AZN</small></dd></div>
  <div><dt>Gözləyən</dt><dd>{{ $totals['pending'] }}</dd></div>
  <div><dt>Uğursuz</dt><dd>{{ $totals['failed'] }}</dd></div>
</dl>

<form class="filters" method="GET">
  <input class="input grow" name="q" value="{{ $filters['q'] }}" placeholder="Sifariş nömrəsi">
  <select class="input" name="status">
    <option value="">Bütün vəziyyətlər</option>
    @foreach (['paid' => 'Ödənilib', 'pending' => 'Gözləyir', 'failed' => 'Uğursuz', 'refunded' => 'Geri qaytarılıb'] as $k => $v)
      <option value="{{ $k }}" @selected($filters['status'] === $k)>{{ $v }}</option>
    @endforeach
  </select>
  <button class="btn btn-sm" type="submit">Süz</button>
  <a class="btn btn-ghost btn-sm" href="{{ route('admin.payments') }}">Sıfırla</a>
</form>

<div class="tbl-wrap">
  <table class="tbl">
    <thead><tr><th>Sifariş</th><th>İstifadəçi</th><th>Paket</th><th class="num">Məbləğ</th><th class="num">Kredit</th><th>Provayder</th><th>Vəziyyət</th></tr></thead>
    <tbody>
    @forelse ($payments as $p)
      <tr>
        <td class="mono">{{ $p->order_id }}<br><span class="s">{{ $p->created_at->format('d.m.Y H:i') }}</span></td>
        <td>
          @if ($p->user)
            <a href="{{ route('admin.users.show', $p->user->uuid) }}">{{ $p->user->displayName() }}</a>
          @else — @endif
        </td>
        <td class="mono">{{ $p->pack_id }}</td>
        <td class="num">{{ number_format((float) $p->amount, 2) }}</td>
        <td class="num">{{ $p->credits }}</td>
        <td class="mono">{{ $p->provider }}</td>
        <td><span class="pill {{ $p->status === 'paid' ? 'ok' : ($p->status === 'pending' ? 'wait' : 'bad') }}">{{ $p->statusLabel() }}</span></td>
      </tr>
    @empty
      <tr><td colspan="7" class="tbl-empty">Ödəniş tapılmadı.</td></tr>
    @endforelse
    </tbody>
  </table>
</div>

<div style="margin-top:16px">{{ $payments->links('partials.pagination') }}</div>
@endsection
