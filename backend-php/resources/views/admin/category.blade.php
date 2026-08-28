@extends('layouts.panel')
@section('title', $category->exists ? $category->name : 'Yeni kateqoriya')
@section('bar', 'İdarə paneli')
@section('side-title', 'İdarəetmə')
@section('side') @include('partials.admin-nav') @endsection
@section('nav')<a href="{{ route('admin.catalog.categories') }}">Kateqoriyalar</a><a href="{{ url('/') }}">Sayt</a>@endsection
@section('tools')<form method="POST" action="{{ route('admin.logout') }}">@csrf<button class="chip" type="submit">Çıxış</button></form>@endsection

@section('content')
<div class="page-head">
  <div>
    <h1>{{ $category->exists ? $category->name : 'Yeni kateqoriya' }}</h1>
    <div class="sub">{{ $category->exists ? 'Kateqoriyanın redaktəsi' : 'Saytda yeni tab yaradılır' }}</div>
  </div>
  <div class="acts"><a class="btn btn-ghost btn-sm" href="{{ route('admin.catalog.categories') }}">Geri</a></div>
</div>

@include('partials.flash')

<form method="POST"
      action="{{ $category->exists ? route('admin.catalog.categories.update', $category) : route('admin.catalog.categories.store') }}">
  @csrf
  <div class="panel">
    <div class="panel-head"><span class="label">Məlumatlar</span></div>
    <div class="panel-body">
      <div class="cols2">
        <div class="field">
          <label class="label" for="name">Ad</label>
          <input id="name" class="input" name="name" maxlength="60" required
                 value="{{ old('name', $category->name) }}" placeholder="Cütlüklər">
        </div>
        <div class="field">
          <label class="label" for="slug">Açar (dəyişməz qalsın)</label>
          <input id="slug" class="input mono" name="slug" maxlength="40" required
                 value="{{ old('slug', $category->slug) }}" placeholder="couples"
                 pattern="[a-z0-9\-]+">
          <span class="hint">Yalnız kiçik latın hərfi, rəqəm və defis. Şablonlar buna bağlıdır.</span>
        </div>
      </div>

      <div class="cols2">
        <div class="field">
          <label class="label" for="tone">Ton</label>
          <select id="tone" class="input" name="tone">
            @foreach ($tones as $t)
              <option value="{{ $t }}" @selected(old('tone', $category->tone) === $t)>{{ $t === 'xatire' ? 'Xatirə' : 'Zarafat' }}</option>
            @endforeach
          </select>
          <span class="hint">Ton kateqoriyadakı bütün şablonlara miras qalır.</span>
        </div>
        <div class="field">
          <label class="label" for="icon">Nişan</label>
          <input id="icon" class="input" name="icon" maxlength="8" value="{{ old('icon', $category->icon) }}" placeholder="❦">
        </div>
      </div>

      <div class="field">
        <label class="label" for="blurb">Təsvir</label>
        <textarea id="blurb" class="textarea" name="blurb" rows="2" maxlength="300"
                  placeholder="Tab seçiləndə kartların üstündə görünən bir cümlə.">{{ old('blurb', $category->blurb) }}</textarea>
      </div>

      <div class="cols2">
        <div class="field">
          <label class="label" for="sort">Sıra</label>
          <input id="sort" class="input mono" type="number" name="sort" min="0" max="100000"
                 value="{{ old('sort', $category->sort) }}">
          <span class="hint">Kiçik rəqəm önə düşür.</span>
        </div>
        <div class="field">
          <label class="label">Vəziyyət</label>
          <label class="check">
            <input type="checkbox" name="is_active" value="1" @checked(old('is_active', $category->is_active))>
            <span>Saytda görünsün</span>
          </label>
        </div>
      </div>
    </div>
    <div class="panel-foot">
      <button class="btn" type="submit">Yadda saxla</button>
      <a class="btn btn-ghost" href="{{ route('admin.catalog.categories') }}">İmtina</a>
    </div>
  </div>
</form>

@if ($category->exists)
  <div class="panel" style="margin-top:16px">
    <div class="panel-head">
      <span class="label">Bu kateqoriyanın şablonları</span>
      <span class="right">
        <a class="btn btn-sm" href="{{ route('admin.catalog.templates.create', ['kateqoriya' => $category->id]) }}">Şablon əlavə et</a>
      </span>
    </div>
    <div class="tbl-wrap" style="border:0">
      <table class="tbl">
        <thead><tr><th class="num">Sıra</th><th>Şablon</th><th>Dizayn</th><th>Vəziyyət</th><th></th></tr></thead>
        <tbody>
        @forelse ($templates as $t)
          <tr>
            <td class="num mono">{{ $t->sort }}</td>
            <td>
              <span class="t" style="font-size:13px">{{ $t->title }}</span>
              <span class="s mono">{{ $t->slug }}</span>
            </td>
            <td><span class="mono s">{{ $t->layout }} · {{ $t->palette }}</span></td>
            <td>
              @if ($t->is_active)<span class="pill ok">Aktiv</span>@else<span class="pill mute">Söndürülüb</span>@endif
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
          <tr><td colspan="5" class="tbl-empty">Bu kateqoriyada hələ şablon yoxdur.</td></tr>
        @endforelse
        </tbody>
      </table>
    </div>
  </div>

  <form method="POST" action="{{ route('admin.catalog.categories.delete', $category) }}" style="margin-top:16px">@csrf
    <button class="btn btn-danger btn-sm" type="submit">Kateqoriyanı sil</button>
    <span class="micro">Yalnız içində şablon qalmayıbsa silinir.</span>
  </form>
@endif
@endsection
