@extends('layouts.panel')
@section('title', 'İstifadəçilər')
@section('bar', 'İdarə paneli')
@section('side-title', 'İdarəetmə')
@section('side') @include('partials.admin-nav') @endsection
@section('nav')<a href="{{ route('admin.dashboard') }}">İdarə paneli</a><a href="{{ url('/') }}">Sayt</a>@endsection
@section('tools')<form method="POST" action="{{ route('admin.logout') }}">@csrf<button class="chip" type="submit">Çıxış</button></form>@endsection

@section('content')
<div class="page-head"><div><h1>İstifadəçilər</h1><div class="sub">{{ $users->total() }} qeyd</div></div></div>

<form class="filters" method="GET">
  <input class="input grow" name="q" value="{{ $filters['q'] }}" placeholder="E-poçt, ad və ya UUID">
  <select class="input" name="type">
    <option value="">Hamısı</option>
    <option value="registered" @selected($filters['type'] === 'registered')>Qeydiyyatlı</option>
    <option value="guest" @selected($filters['type'] === 'guest')>Qonaq</option>
  </select>
  <button class="btn btn-sm" type="submit">Süz</button>
  <a class="btn btn-ghost btn-sm" href="{{ route('admin.users') }}">Sıfırla</a>
</form>

<div class="tbl-wrap">
  <table class="tbl">
    <thead><tr><th>İstifadəçi</th><th>Növ</th><th class="num">Balans</th><th class="num">Sənəd</th><th class="num">Ödəniş</th><th>Son aktivlik</th><th></th></tr></thead>
    <tbody>
    @forelse ($users as $u)
      <tr>
        <td>
          <span class="t" style="font-size:13px">{{ $u->displayName() }}</span>
          <span class="s mono">{{ substr($u->uuid, 0, 13) }}</span>
        </td>
        <td>
          <span class="pill {{ $u->is_admin ? 'info' : ($u->isGuest() ? 'mute' : 'ok') }}">
            {{ $u->is_admin ? 'İdarəçi' : ($u->isGuest() ? 'Qonaq' : 'Qeydiyyatlı') }}
          </span>
          @if ($u->is_blocked)<span class="pill bad">Bloklu</span>@endif
        </td>
        <td class="num">{{ $u->credits }}</td>
        <td class="num">{{ $u->documents_count }}</td>
        <td class="num">{{ number_format((float) ($u->paid_sum ?? 0), 2) }}</td>
        <td class="mono">{{ $u->last_seen_at?->format('d.m.Y H:i') ?: '—' }}</td>
        <td><div class="acts"><a class="btn btn-ghost btn-sm" href="{{ route('admin.users.show', $u->uuid) }}">Bax</a></div></td>
      </tr>
    @empty
      <tr><td colspan="7" class="tbl-empty">İstifadəçi tapılmadı.</td></tr>
    @endforelse
    </tbody>
  </table>
</div>

<div style="margin-top:16px">{{ $users->links('partials.pagination') }}</div>
@endsection
