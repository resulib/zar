@extends('layouts.panel')
@section('title', 'Sənədlər')
@section('bar', 'İdarə paneli')
@section('side-title', 'İdarəetmə')
@section('side') @include('partials.admin-nav') @endsection
@section('nav')<a href="{{ route('admin.dashboard') }}">İdarə paneli</a><a href="{{ url('/') }}">Sayt</a>@endsection
@section('tools')<form method="POST" action="{{ route('admin.logout') }}">@csrf<button class="chip" type="submit">Çıxış</button></form>@endsection

@section('content')
<div class="page-head"><div><h1>Sənədlər</h1><div class="sub">{{ $documents->total() }} qeyd</div></div></div>

<form class="filters" method="GET">
  <input class="input grow" name="q" value="{{ $filters['q'] }}" placeholder="Nömrə, başlıq və ya ad">
  <select class="input" name="status">
    <option value="">Bütün vəziyyətlər</option>
    @foreach (['draft' => 'Qaralama', 'published' => 'Reyestrdə', 'removed' => 'Silinib'] as $k => $v)
      <option value="{{ $k }}" @selected($filters['status'] === $k)>{{ $v }}</option>
    @endforeach
  </select>
  <select class="input" name="layout">
    <option value="">Bütün formalar</option>
    @foreach (config('zarafat.layouts') as $l)
      <option value="{{ $l }}" @selected($filters['layout'] === $l)>{{ $l }}</option>
    @endforeach
  </select>
  <button class="btn btn-sm" type="submit">Süz</button>
  <a class="btn btn-ghost btn-sm" href="{{ route('admin.documents') }}">Sıfırla</a>
</form>

<div class="tbl-wrap">
  <table class="tbl">
    <thead><tr><th>Nömrə</th><th>Sənəd</th><th>İstifadəçi</th><th>Forma</th><th>Vəziyyət</th><th class="num">Baxış</th><th></th></tr></thead>
    <tbody>
    @forelse ($documents as $doc)
      <tr>
        <td class="mono">{{ $doc->reg_no }}<br><span class="s">{{ $doc->created_at->format('d.m.Y H:i') }}</span></td>
        <td>
          <span class="t">{{ \Illuminate\Support\Str::limit($doc->title, 46) }}</span>
          <span class="s">{{ $doc->to_name }} ← {{ $doc->from_name }}</span>
        </td>
        <td><span class="s">{{ $doc->user?->displayName() }}</span></td>
        <td class="mono">{{ $doc->layout }}<br><span class="s">{{ $doc->palette }}</span></td>
        <td><span class="pill {{ $doc->status === 'published' ? 'ok' : ($doc->status === 'removed' ? 'bad' : 'mute') }}">{{ $doc->status }}</span></td>
        <td class="num">{{ $doc->views }}</td>
        <td>
          <div class="acts">
            <a class="btn btn-ghost btn-sm" href="{{ route('admin.documents.show', $doc->reg_no) }}">Bax</a>
          </div>
        </td>
      </tr>
    @empty
      <tr><td colspan="7" class="tbl-empty">Uyğun sənəd tapılmadı.</td></tr>
    @endforelse
    </tbody>
  </table>
</div>

<div style="margin-top:16px">{{ $documents->links('partials.pagination') }}</div>
@endsection
