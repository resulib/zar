@extends('layouts.panel')
@section('title', 'Əməliyyatlar')
@section('bar', 'İdarə paneli')
@section('side-title', 'İdarəetmə')
@section('side') @include('partials.admin-nav') @endsection
@section('nav')<a href="{{ route('admin.dashboard') }}">İdarə paneli</a><a href="{{ url('/') }}">Sayt</a>@endsection
@section('tools')<form method="POST" action="{{ route('admin.logout') }}">@csrf<button class="chip" type="submit">Çıxış</button></form>@endsection

@section('content')
<div class="page-head"><div><h1>Kredit əməliyyatları</h1><div class="sub">{{ $transactions->total() }} qeyd</div></div></div>

<form class="filters" method="GET">
  <select class="input" name="type">
    <option value="">Bütün növlər</option>
    @foreach (['topup' => 'Balans artımı', 'spend' => 'Xərclənmə', 'grant' => 'Admin verib', 'refund' => 'Geri qaytarma'] as $k => $v)
      <option value="{{ $k }}" @selected($filters['type'] === $k)>{{ $v }}</option>
    @endforeach
  </select>
  <button class="btn btn-sm" type="submit">Süz</button>
  <a class="btn btn-ghost btn-sm" href="{{ route('admin.transactions') }}">Sıfırla</a>
</form>

<div class="tbl-wrap">
  <table class="tbl">
    <thead><tr><th>Tarix</th><th>İstifadəçi</th><th>Növ</th><th>Bağlantı</th><th class="num">Kredit</th><th class="num">Balans</th></tr></thead>
    <tbody>
    @forelse ($transactions as $tx)
      <tr>
        <td class="mono">{{ $tx->created_at->format('d.m.Y H:i') }}</td>
        <td>
          @if ($tx->user)
            <a href="{{ route('admin.users.show', $tx->user->uuid) }}">{{ $tx->user->displayName() }}</a>
          @else — @endif
        </td>
        <td>{{ $tx->typeLabel() }}<br><span class="s">{{ $tx->note ?: '' }}</span></td>
        <td class="mono">
          @if ($tx->payment){{ $tx->payment->order_id }}@endif
          @if ($tx->document)<a href="{{ route('admin.documents.show', $tx->document->reg_no) }}">{{ $tx->document->reg_no }}</a>@endif
          @if (! $tx->payment && ! $tx->document)—@endif
        </td>
        <td class="num" style="color:{{ $tx->credits >= 0 ? 'var(--green)' : 'var(--red)' }}">{{ $tx->credits > 0 ? '+' : '' }}{{ $tx->credits }}</td>
        <td class="num">{{ $tx->balance_after }}</td>
      </tr>
    @empty
      <tr><td colspan="6" class="tbl-empty">Əməliyyat yoxdur.</td></tr>
    @endforelse
    </tbody>
  </table>
</div>

<div style="margin-top:16px">{{ $transactions->links('partials.pagination') }}</div>
@endsection
