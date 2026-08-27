@extends('layouts.panel')
@section('title', 'Şikayətlər')
@section('bar', 'İdarə paneli')
@section('side-title', 'İdarəetmə')
@section('side') @include('partials.admin-nav') @endsection
@section('nav')<a href="{{ route('admin.dashboard') }}">İdarə paneli</a><a href="{{ url('/') }}">Sayt</a>@endsection
@section('tools')<form method="POST" action="{{ route('admin.logout') }}">@csrf<button class="chip" type="submit">Çıxış</button></form>@endsection

@section('content')
<div class="page-head"><div><h1>Şikayətlər</h1><div class="sub">{{ $counts['open'] }} açıq · {{ $counts['resolved'] }} qəbul · {{ $counts['rejected'] }} rədd</div></div></div>

<form class="filters" method="GET">
  <select class="input" name="status">
    @foreach (['open' => 'Açıq', 'resolved' => 'Qəbul edilib', 'rejected' => 'Rədd edilib', 'all' => 'Hamısı'] as $k => $v)
      <option value="{{ $k }}" @selected($status === $k)>{{ $v }}</option>
    @endforeach
  </select>
  <button class="btn btn-sm" type="submit">Göstər</button>
</form>

<div class="tbl-wrap">
  <table class="tbl">
    <thead><tr><th>Tarix</th><th>Sənəd</th><th>Səbəb</th><th>Qeyd</th><th>Vəziyyət</th><th></th></tr></thead>
    <tbody>
    @forelse ($reports as $r)
      <tr>
        <td class="mono">{{ $r->created_at->format('d.m.Y H:i') }}</td>
        <td class="mono">
          <a href="{{ route('admin.documents.show', $r->reg_no) }}">{{ $r->reg_no }}</a>
          @if ($r->document)<br><span class="s">{{ \Illuminate\Support\Str::limit($r->document->title, 34) }}</span>@endif
        </td>
        <td>{{ $r->reason ?: '—' }}</td>
        <td><span class="s">{{ \Illuminate\Support\Str::limit($r->note, 90) ?: '—' }}</span></td>
        <td><span class="pill {{ $r->status === 'open' ? 'wait' : ($r->status === 'resolved' ? 'ok' : 'mute') }}">{{ $r->status }}</span></td>
        <td>
          @if ($r->status === 'open')
            <div class="acts">
              <form method="POST" action="{{ route('admin.reports.accept', $r) }}"
                    onsubmit="return confirm('Sənəd silinsin?')">@csrf
                <button class="btn btn-danger btn-sm" type="submit">Qəbul et və sil</button>
              </form>
              <form method="POST" action="{{ route('admin.reports.reject', $r) }}">@csrf
                <button class="btn btn-ghost btn-sm" type="submit">Rədd et</button>
              </form>
            </div>
          @else
            <span class="s">{{ $r->handled_at?->format('d.m.Y H:i') }}</span>
          @endif
        </td>
      </tr>
    @empty
      <tr><td colspan="6" class="tbl-empty">Şikayət yoxdur.</td></tr>
    @endforelse
    </tbody>
  </table>
</div>

<div style="margin-top:16px">{{ $reports->links('partials.pagination') }}</div>
@endsection
