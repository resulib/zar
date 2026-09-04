@extends('layouts.panel')
@section('title', 'Avatar növbəsi')
@section('bar', 'İdarə paneli')
@section('side-title', 'İdarəetmə')
@section('side') @include('partials.admin-nav') @endsection
@section('nav')<a href="{{ route('admin.dashboard') }}">İdarə paneli</a><a href="{{ url('/') }}">Sayt</a>@endsection
@section('tools')<form method="POST" action="{{ route('admin.logout') }}">@csrf<button class="chip" type="submit">Çıxış</button></form>@endsection

@section('content')
<div class="page-head">
  <div>
    <h1>Avatar növbəsi</h1>
    <div class="sub">Yalnız yoxlama gözləyənlər</div>
  </div>
  <div class="right">
    <form method="POST" action="{{ route('admin.profiles.recalc') }}">
      @csrf
      <button class="btn btn-ghost btn-sm" type="submit">Rütbələri yenidən hesabla</button>
    </form>
  </div>
</div>

{{-- Təsdiqlənənə qədər şəkli yalnız sahibi görür; siyahıda idarəçi
     ORİJİNALI görür, çünki qərar kiçildilmiş surətdən verilməməlidir. --}}
<div class="tbl-wrap">
  <table class="tbl">
    <thead>
      <tr><th style="width:96px">Şəkil</th><th>Müstəntiq</th><th>Nişan</th>
          <th>Yükləndi</th><th style="width:340px">Qərar</th></tr>
    </thead>
    <tbody>
    @forelse($siyahi as $p)
      <tr>
        <td>
          <img src="{{ route('admin.avatars.image', $p) }}" alt=""
               style="width:76px;height:76px;object-fit:cover;border-radius:3px;display:block">
        </td>
        <td>
          <span class="t">{{ $p->display_name !== '' ? $p->display_name : '—' }}</span>
          <span class="s">{{ $p->user?->email ?? 'qonaq' }}</span>
        </td>
        <td class="mono">{{ $p->badge_number ?? '—' }}</td>
        <td class="s">{{ $p->updated_at?->format('d.m.Y H:i') }}</td>
        <td>
          <div class="acts" style="justify-content:flex-start;gap:8px;flex-wrap:wrap">
            <form method="POST" action="{{ route('admin.avatars.approve', $p) }}">
              @csrf<button class="btn btn-sm" type="submit">Təsdiq et</button>
            </form>
            <form method="POST" action="{{ route('admin.avatars.reject', $p) }}"
                  style="display:flex;gap:6px;flex:1 1 200px">
              @csrf
              <input class="input" type="text" name="sebeb" maxlength="160" placeholder="Rədd səbəbi">
              <button class="btn btn-ghost btn-sm" type="submit">Rədd et</button>
            </form>
          </div>
        </td>
      </tr>
    @empty
      <tr><td colspan="5" class="tbl-empty">Gözləyən şəkil yoxdur.</td></tr>
    @endforelse
    </tbody>
  </table>
</div>

{{ $siyahi->links('partials.pagination') }}
@endsection
