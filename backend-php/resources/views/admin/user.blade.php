@extends('layouts.panel')
@section('title', $user->displayName())
@section('bar', 'İdarə paneli')
@section('side-title', 'İdarəetmə')
@section('side') @include('partials.admin-nav') @endsection
@section('nav')<a href="{{ route('admin.dashboard') }}">İdarə paneli</a><a href="{{ url('/') }}">Sayt</a>@endsection
@section('tools')<form method="POST" action="{{ route('admin.logout') }}">@csrf<button class="chip" type="submit">Çıxış</button></form>@endsection

@section('content')
<div class="page-head">
  <div><h1>{{ $user->displayName() }}</h1><div class="sub">{{ $user->uuid }}</div></div>
  <div class="right">
    <a class="btn btn-ghost btn-sm" href="{{ route('admin.users') }}">Siyahıya qayıt</a>
    <form method="POST" action="{{ route('admin.users.block', $user->uuid) }}">@csrf
      <button class="btn btn-danger btn-sm" type="submit">{{ $user->is_blocked ? 'Bloku götür' : 'Blokla' }}</button>
    </form>
  </div>
</div>

<dl class="stats">
  <div class="accent"><dt>Balans</dt><dd>{{ $user->credits }}</dd></div>
  <div><dt>Sənəd</dt><dd>{{ $documents->count() }}</dd></div>
  <div><dt>Ödəniş</dt><dd>{{ $payments->where('status', 'paid')->count() }}</dd></div>
  <div><dt>Məbləğ</dt><dd>{{ number_format((float) $payments->where('status', 'paid')->sum('amount'), 2) }} <small>AZN</small></dd></div>
</dl>

<div class="cols2">
  <div class="panel">
    <div class="panel-head"><span class="label">Hesab</span></div>
    <div class="panel-body">
      <dl class="kv">
        <div><dt>Növ</dt><dd>{{ $user->is_admin ? 'İdarəçi' : ($user->isGuest() ? 'Qonaq' : 'Qeydiyyatlı') }}</dd></div>
        <div><dt>E-poçt</dt><dd>{{ $user->email ?: '—' }}</dd></div>
        <div><dt>Qeydiyyat</dt><dd>{{ $user->created_at->format('d.m.Y H:i') }}</dd></div>
        <div><dt>Son aktivlik</dt><dd>{{ $user->last_seen_at?->format('d.m.Y H:i') ?: '—' }}</dd></div>
        <div><dt>Son IP</dt><dd class="mono">{{ $user->last_ip ?: '—' }}</dd></div>
      </dl>
    </div>
  </div>

  <div class="panel">
    <div class="panel-head"><span class="label">Kredit əlavə et</span></div>
    <div class="panel-body">
      <form method="POST" action="{{ route('admin.users.grant', $user->uuid) }}">
        @csrf
        <div class="field">
          <label class="label" for="credits">Kredit sayı</label>
          <input class="input" id="credits" name="credits" type="number" min="1" max="500" value="1" required>
        </div>
        <div class="field">
          <label class="label" for="note">Qeyd</label>
          <input class="input" id="note" name="note" maxlength="160" placeholder="Məsələn: kompensasiya">
        </div>
        <button class="btn" type="submit">Əlavə et</button>
      </form>
    </div>
  </div>
</div>

@if($profile)
{{-- MÜSTƏNTİQ PROFİLİ.

     XP sütununa birbaşa yazılmır: `RankService::adjust()` ledger sətri yazır
     və rütbəni yenidən hesablayır. Səbəb məcburidir — audit qeydi olmayan
     düzəliş sonradan izah edilə bilmir. --}}
<div class="cols2" style="margin-top:22px">
  <div class="panel">
    <div class="panel-head"><span class="label">Müstəntiq profili</span></div>
    <div class="panel-body">
      <dl class="kv">
        <dt>Nişan</dt><dd class="mono">{{ $profile->badge_number ?? 'verilməyib' }}</dd>
        <dt>Göstərilən ad</dt><dd>{{ $profile->display_name ?: '—' }}</dd>
        <dt>Şöbə</dt><dd>{{ $profile->departmentLabel() ?: '—' }}
          @if($profile->department_locked)<span class="pill mute">kilidli</span>@endif</dd>
        <dt>Rütbə</dt><dd>{{ $profile->rank?->title_az ?? '—' }}</dd>
        <dt>XP</dt><dd class="mono">{{ $profile->xp }}</dd>
        <dt>Bağlanmış iş</dt><dd class="mono">{{ $profile->cases_solved }} / {{ $profile->cases_attempted }}</dd>
        <dt>Birinci cəhddən</dt><dd class="mono">{{ $profile->first_try_solves }}</dd>
        <dt>Yanlış ittiham</dt><dd class="mono">{{ $profile->total_wrong_accusations }}</dd>
        <dt>Reytinqdə</dt><dd>{{ $profile->is_public ? 'görünür' : 'gizli' }}</dd>
        <dt>Mövqe</dt><dd class="mono">{{ $profile->cached_rank_position ?? '—' }}</dd>
        <dt>Avatar</dt><dd>{{ $profile->avatar_status }}
          @if($profile->avatar_reason !== '') · {{ $profile->avatar_reason }} @endif</dd>
      </dl>
    </div>
  </div>

  <div class="panel">
    <div class="panel-head"><span class="label">Xal düzəlişi</span></div>
    <div class="panel-body">
      <form method="POST" action="{{ route('admin.profiles.xp', $profile) }}">
        @csrf
        <div class="field">
          <label class="label" for="delta">Xal (mənfi ola bilər)</label>
          <input class="input" id="delta" name="delta" type="number" min="-100000" max="100000" required>
        </div>
        <div class="field">
          <label class="label" for="sebeb">Səbəb</label>
          <input class="input" id="sebeb" name="sebeb" maxlength="200" required
                 placeholder="Məsələn: səhv hesablamanın düzəlişi">
          <span class="hint">Audit qeydinə yazılır və silinmir.</span>
        </div>
        <button class="btn" type="submit">Yaz</button>
      </form>

      @if($duzelisler->isNotEmpty())
        <dl class="kv" style="margin-top:16px">
          @foreach($duzelisler as $d)
            <dt class="mono">{{ sprintf('%+d', $d->delta) }} → {{ $d->balance_after }}</dt>
            <dd>{{ $d->reason }} <span class="s">{{ $d->created_at?->format('d.m.Y') }}</span></dd>
          @endforeach
        </dl>
      @endif
    </div>
  </div>
</div>

@if($isler->isNotEmpty())
<div style="margin-top:22px">
  <div class="page-head" style="margin-bottom:12px"><h1 style="font-size:17px">İş nəticələri</h1></div>
  <div class="tbl-wrap">
    <table class="tbl">
      <thead><tr><th>İş</th><th>Nəticə</th><th class="num">Yanlış</th>
                 <th class="num">Vaxt</th><th class="num">XP</th><th>Tarix</th></tr></thead>
      <tbody>
      @foreach($isler as $c)
        <tr>
          <td><span class="t">{{ $c->dossier?->title ?? 'Silinmiş iş' }}</span>
              <span class="s mono">{{ $c->dossier?->no ?? '—' }} · {{ $c->difficulty }}</span></td>
          <td><span class="pill {{ $c->is_solved ? 'ok' : 'mute' }}">
              {{ $c->is_solved ? 'bağlandı' : 'bağlanmadı' }}</span></td>
          <td class="num">{{ $c->wrong_attempts }}</td>
          <td class="num">{{ $c->duration_seconds ? \App\Support\Dossier\Dossier::deqiqe($c->duration_seconds) . ' dəq' : '—' }}</td>
          <td class="num">{{ $c->xp_awarded }}</td>
          <td class="mono">{{ $c->completed_at?->format('d.m.Y H:i') }}</td>
        </tr>
      @endforeach
      </tbody>
    </table>
  </div>
</div>
@endif
@endif

<div style="margin-top:22px">
  <div class="page-head" style="margin-bottom:12px"><h1 style="font-size:17px">Əməliyyatlar</h1></div>
  <div class="tbl-wrap">
    <table class="tbl">
      <thead><tr><th>Tarix</th><th>Növ</th><th>Qeyd</th><th class="num">Kredit</th><th class="num">Balans</th></tr></thead>
      <tbody>
      @forelse ($transactions as $tx)
        <tr>
          <td class="mono">{{ $tx->created_at->format('d.m.Y H:i') }}</td>
          <td>{{ $tx->typeLabel() }}</td>
          <td><span class="s">{{ $tx->note ?: '—' }}</span></td>
          <td class="num" style="color:{{ $tx->credits >= 0 ? 'var(--green)' : 'var(--red)' }}">{{ $tx->credits > 0 ? '+' : '' }}{{ $tx->credits }}</td>
          <td class="num">{{ $tx->balance_after }}</td>
        </tr>
      @empty
        <tr><td colspan="5" class="tbl-empty">Əməliyyat yoxdur.</td></tr>
      @endforelse
      </tbody>
    </table>
  </div>
</div>

<div style="margin-top:22px">
  <div class="page-head" style="margin-bottom:12px"><h1 style="font-size:17px">Sənədlər</h1></div>
  <div class="tbl-wrap">
    <table class="tbl">
      <thead><tr><th>Nömrə</th><th>Başlıq</th><th>Vəziyyət</th><th></th></tr></thead>
      <tbody>
      @forelse ($documents as $doc)
        <tr>
          <td class="mono">{{ $doc->reg_no }}</td>
          <td>{{ \Illuminate\Support\Str::limit($doc->title, 46) }}</td>
          <td><span class="pill {{ $doc->status === 'published' ? 'ok' : ($doc->status === 'removed' ? 'bad' : 'mute') }}">{{ $doc->status }}</span></td>
          <td><div class="acts"><a class="btn btn-ghost btn-sm" href="{{ route('admin.documents.show', $doc->reg_no) }}">Bax</a></div></td>
        </tr>
      @empty
        <tr><td colspan="4" class="tbl-empty">Sənəd yoxdur.</td></tr>
      @endforelse
      </tbody>
    </table>
  </div>
</div>
@endsection
