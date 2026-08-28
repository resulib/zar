@extends('layouts.panel')
@section('title', 'Şablonlar')
@section('bar', 'İdarə paneli')
@section('side-title', 'İdarəetmə')
@section('side') @include('partials.admin-nav') @endsection
@section('nav')<a href="{{ route('admin.dashboard') }}">İdarə paneli</a><a href="{{ url('/') }}">Sayt</a>@endsection
@section('tools')<form method="POST" action="{{ route('admin.logout') }}">@csrf<button class="chip" type="submit">Çıxış</button></form>@endsection

@section('content')
<div class="page-head">
  <div><h1>Şablonlar</h1><div class="sub">{{ $templates->total() }} qeyd</div></div>
  <div class="acts">
    <a class="btn btn-ghost btn-sm" href="{{ route('admin.catalog.export') }}">Kataloqu ixrac et</a>
    <a class="btn btn-sm" href="{{ route('admin.catalog.templates.create') }}">Yeni şablon</a>
  </div>
</div>

@include('partials.flash')

@if (count($warnings))
  <div class="flash warn">
    Kataloq xəbərdarlıqları (sayt işləyir, amma paylanma natamamdır):
    <ul>
      @foreach ($warnings as $w)
        <li>{{ $w }}</li>
      @endforeach
    </ul>
  </div>
@endif

<form class="filters" method="GET">
  <input class="input grow" name="q" value="{{ $filters['q'] }}" placeholder="Başlıq, açar və ya etiket">
  <select class="input" name="cat">
    <option value="">Bütün kateqoriyalar</option>
    @foreach ($categories as $c)
      <option value="{{ $c->slug }}" @selected($filters['cat'] === $c->slug)>{{ $c->name }}</option>
    @endforeach
  </select>
  <select class="input" name="layout">
    <option value="">Bütün dizaynlar</option>
    @foreach ($layouts as $l)
      <option value="{{ $l }}" @selected($filters['layout'] === $l)>{{ $l }}</option>
    @endforeach
  </select>
  <select class="input" name="status">
    <option value="">Hamısı</option>
    <option value="active" @selected($filters['status'] === 'active')>Aktiv</option>
    <option value="off" @selected($filters['status'] === 'off')>Söndürülmüş</option>
  </select>
  <button class="btn btn-sm" type="submit">Süz</button>
  <a class="btn btn-ghost btn-sm" href="{{ route('admin.catalog.templates') }}">Sıfırla</a>
</form>

<div class="tbl-wrap">
  <table class="tbl">
    <thead><tr><th>Şablon</th><th>Kateqoriya</th><th>Dizayn</th><th>Prefiks</th><th>Vəziyyət</th><th></th></tr></thead>
    <tbody>
    @forelse ($templates as $t)
      <tr>
        <td>
          <span class="t" style="font-size:13px">{{ $t->title }}</span>
          <span class="s mono">{{ $t->slug }}</span>
        </td>
        <td>{{ $t->category?->name ?? '—' }}</td>
        <td><span class="mono s">{{ $t->layout }} · {{ $t->palette }}</span></td>
        <td class="mono">{{ $t->reg_prefix ?: 'ZRF' }}</td>
        <td>
          @if ($t->is_active)
            <span class="pill ok">Aktiv</span>
          @else
            <span class="pill mute">Söndürülüb</span>
          @endif
          @if ($t->fields)<span class="pill info">Anket</span>@endif
        </td>
        <td>
          <div class="acts">
            <a class="btn btn-ghost btn-sm" href="{{ route('admin.catalog.templates.edit', $t) }}">Redaktə</a>
            <form method="POST" action="{{ route('admin.catalog.templates.toggle', $t) }}">@csrf
              <button class="btn btn-ghost btn-sm" type="submit">{{ $t->is_active ? 'Söndür' : 'Aktivləşdir' }}</button>
            </form>
          </div>
        </td>
      </tr>
    @empty
      <tr><td colspan="6" class="tbl-empty">Şablon tapılmadı.</td></tr>
    @endforelse
    </tbody>
  </table>
</div>

<div style="margin-top:16px">{{ $templates->links('partials.pagination') }}</div>
@endsection
