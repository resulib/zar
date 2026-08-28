@extends('layouts.panel')
@section('title', 'Kateqoriyalar')
@section('bar', 'İdarə paneli')
@section('side-title', 'İdarəetmə')
@section('side') @include('partials.admin-nav') @endsection
@section('nav')<a href="{{ route('admin.dashboard') }}">İdarə paneli</a><a href="{{ url('/') }}">Sayt</a>@endsection
@section('tools')<form method="POST" action="{{ route('admin.logout') }}">@csrf<button class="chip" type="submit">Çıxış</button></form>@endsection

@section('content')
<div class="page-head">
  <div><h1>Kateqoriyalar</h1><div class="sub">{{ $categories->count() }} kateqoriya · saytdakı tab çubuğunu bunlar qurur</div></div>
  <div class="acts"><a class="btn btn-sm" href="{{ route('admin.catalog.categories.create') }}">Yeni kateqoriya</a></div>
</div>

@include('partials.flash')

<form class="filters" method="GET">
  <select class="input" name="tone">
    <option value="">Bütün tonlar</option>
    <option value="zarafat" @selected($filters['tone'] === 'zarafat')>Zarafat</option>
    <option value="xatire" @selected($filters['tone'] === 'xatire')>Xatirə</option>
  </select>
  <button class="btn btn-sm" type="submit">Süz</button>
  <a class="btn btn-ghost btn-sm" href="{{ route('admin.catalog.categories') }}">Sıfırla</a>
</form>

<div class="tbl-wrap">
  <table class="tbl">
    <thead><tr><th class="num">Sıra</th><th>Kateqoriya</th><th>Ton</th><th class="num">Şablon</th><th>Vəziyyət</th><th></th></tr></thead>
    <tbody>
    @forelse ($categories as $c)
      <tr>
        <td class="num mono">{{ $c->sort }}</td>
        <td>
          <span class="t" style="font-size:13px">{{ $c->icon }} {{ $c->name }}</span>
          <span class="s mono">{{ $c->slug }}</span>
        </td>
        <td><span class="pill {{ $c->tone === 'xatire' ? 'info' : 'mute' }}">{{ $c->tone === 'xatire' ? 'Xatirə' : 'Zarafat' }}</span></td>
        <td class="num">
          <a href="{{ route('admin.catalog.templates', ['cat' => $c->slug]) }}">{{ $c->active_templates_count }} / {{ $c->templates_count }}</a>
        </td>
        <td>
          @if ($c->is_active)
            <span class="pill ok">Aktiv</span>
          @else
            <span class="pill mute">Söndürülüb</span>
          @endif
        </td>
        <td>
          <div class="acts">
            <a class="btn btn-ghost btn-sm" href="{{ route('admin.catalog.categories.edit', $c) }}">Şablonlar</a>
            <form method="POST" action="{{ route('admin.catalog.categories.toggle', $c) }}">@csrf
              <button class="btn btn-ghost btn-sm" type="submit">{{ $c->is_active ? 'Söndür' : 'Aktivləşdir' }}</button>
            </form>
          </div>
        </td>
      </tr>
    @empty
      <tr><td colspan="6" class="tbl-empty">Kateqoriya yoxdur.</td></tr>
    @endforelse
    </tbody>
  </table>
</div>

<p class="micro" style="margin-top:14px;line-height:1.6">
  Kateqoriya söndürüləndə həm özü, həm də bütün şablonları saytdan yığışdırılır — heç nə silinmir.
  Silmək yalnız kateqoriya boş olduqda mümkündür.
</p>
@endsection
