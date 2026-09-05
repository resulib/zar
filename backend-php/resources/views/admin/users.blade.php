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
  {{-- Axtarış SERVERDƏ aparılır: nişan nömrəsi və göstərilən ad da bura
       düşür, üstəlik Azərbaycan «İ» hərfi brauzerdə düzgün kiçildilmir. --}}
  <input class="input grow" name="q" value="{{ $filters['q'] }}"
         placeholder="E-poçt, ad, UUID və ya nişan nömrəsi">
  <select class="input" name="type">
    <option value="">Hamısı</option>
    <option value="registered" @selected($filters['type'] === 'registered')>Qeydiyyatlı</option>
    <option value="guest" @selected($filters['type'] === 'guest')>Qonaq</option>
  </select>
  <select class="input" name="rutbe">
    <option value="">Bütün rütbələr</option>
    @foreach($rutbeler as $r)
      <option value="{{ $r->level }}" @selected((string) $filters['rutbe'] === (string) $r->level)>
        {{ $r->level }} · {{ $r->title_az }}
      </option>
    @endforeach
  </select>
  <select class="input" name="avatar">
    <option value="">Avatar: hamısı</option>
    <option value="pending"  @selected($filters['avatar'] === 'pending')>Gözləyir</option>
    <option value="approved" @selected($filters['avatar'] === 'approved')>Təsdiqli</option>
    <option value="rejected" @selected($filters['avatar'] === 'rejected')>Rədd edilib</option>
  </select>
  <button class="btn btn-sm" type="submit">Süz</button>
  <a class="btn btn-ghost btn-sm" href="{{ route('admin.users') }}">Sıfırla</a>
</form>

<div class="tbl-wrap">
  <table class="tbl">
    <thead><tr><th>İstifadəçi</th><th>Nişan</th><th>Rütbə</th><th class="num">XP</th><th class="num">İş</th><th>Avatar</th><th class="num">Balans</th><th>Son aktivlik</th><th></th></tr></thead>
    <tbody>
    @forelse ($users as $u)
      <tr>
        <td>
          <span class="t" style="font-size:13px">{{ $u->displayName() }}</span>
          {{-- Hesabın NECƏ açıldığı: qonaq · parol · Google. Dəstək sualı
               «parolumu unutdum» olanda ilk baxılan yer budur — Google ilə
               açılmış hesabda parol ümumiyyətlə yoxdur. --}}
          <span class="s mono">{{ substr($u->uuid, 0, 13) }} ·
            @if($u->isGuest())qonaq@elseif($u->hasGoogle() && $u->hasPassword())Google+parol@elseif($u->hasGoogle())Google@else parol @endif
          </span>
        </td>
        @php($pr = $u->investigatorProfile)
        <td class="mono">
          {{ $pr?->badge_number ?? '—' }}
          @if ($u->is_blocked)<span class="pill bad">Bloklu</span>@endif
        </td>
        <td>
          @if($pr?->rank)
            <span class="t" style="font-size:12.5px">{{ $pr->rank->title_short }}</span>
            <span class="s">{{ $pr->departmentLabel() ?: 'şöbəsiz' }}</span>
          @else
            <span class="pill {{ $u->is_admin ? 'info' : ($u->isGuest() ? 'mute' : 'ok') }}">
              {{ $u->is_admin ? 'İdarəçi' : ($u->isGuest() ? 'Qonaq' : 'Qeydiyyatlı') }}
            </span>
          @endif
        </td>
        <td class="num">{{ $pr?->xp ?? '—' }}</td>
        <td class="num">{{ $pr?->cases_solved ?? '—' }}</td>
        <td>
          @if($pr && $pr->avatar_status !== 'none')
            <span class="pill {{ $pr->avatar_status === 'approved' ? 'ok'
              : ($pr->avatar_status === 'pending' ? 'wait' : 'bad') }}">
              {{ $pr->avatar_status === 'approved' ? 'təsdiqli'
                : ($pr->avatar_status === 'pending' ? 'gözləyir' : 'rədd') }}
            </span>
          @else — @endif
        </td>
        <td class="num">{{ $u->credits }}</td>
        <td class="mono">{{ $u->last_seen_at?->format('d.m.Y H:i') ?: '—' }}</td>
        <td><div class="acts"><a class="btn btn-ghost btn-sm" href="{{ route('admin.users.show', $u->uuid) }}">Bax</a></div></td>
      </tr>
    @empty
      <tr><td colspan="9" class="tbl-empty">İstifadəçi tapılmadı.</td></tr>
    @endforelse
    </tbody>
  </table>
</div>

<div style="margin-top:16px">{{ $users->links('partials.pagination') }}</div>
@endsection
