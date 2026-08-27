@extends('layouts.panel')
@section('title', 'Əməliyyatlar')
@section('bar', 'İstifadəçi kabineti')
@section('side-title', 'Kabinet')
@section('side') @include('partials.account-nav') @endsection
@section('nav')
  <a href="{{ url('/') }}">Sənəd yarat</a>
  <a href="{{ url('/#reyestr') }}">Reyestr</a>
  <a href="{{ route('account.index') }}">Kabinet</a>
@endsection

@section('content')
<div class="page-head">
  <div><h1>Əməliyyat tarixçəsi</h1><div class="sub">Cari balans: {{ $user->credits }} kredit</div></div>
</div>

<div class="tbl-wrap">
  <table class="tbl">
    <thead>
      <tr><th>Tarix</th><th>Əməliyyat</th><th>Qeyd</th><th class="num">Kredit</th><th class="num">Balans</th></tr>
    </thead>
    <tbody>
    @forelse ($transactions as $tx)
      <tr>
        <td class="mono">{{ $tx->created_at->format('d.m.Y H:i') }}</td>
        <td>{{ $tx->typeLabel() }}</td>
        <td>
          <span class="s">{{ $tx->note ?: '—' }}</span>
          @if ($tx->payment)
            <br><span class="s mono">{{ $tx->payment->order_id }} · {{ number_format((float) $tx->payment->amount, 2) }} AZN</span>
          @endif
        </td>
        <td class="num" style="color:{{ $tx->credits >= 0 ? 'var(--green)' : 'var(--red)' }}">
          {{ $tx->credits > 0 ? '+' : '' }}{{ $tx->credits }}
        </td>
        <td class="num">{{ $tx->balance_after }}</td>
      </tr>
    @empty
      <tr><td colspan="5" class="tbl-empty">Hələ əməliyyat yoxdur.</td></tr>
    @endforelse
    </tbody>
  </table>
</div>

<div style="margin-top:16px">{{ $transactions->links('partials.pagination') }}</div>
@endsection
