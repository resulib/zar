@extends('layouts.panel')
@section('title', $document->reg_no)
@section('bar', 'İdarə paneli')
@section('side-title', 'İdarəetmə')
@section('side') @include('partials.admin-nav') @endsection
@section('nav')<a href="{{ route('admin.dashboard') }}">İdarə paneli</a><a href="{{ url('/') }}">Sayt</a>@endsection
@section('tools')<form method="POST" action="{{ route('admin.logout') }}">@csrf<button class="chip" type="submit">Çıxış</button></form>@endsection

@section('content')
<div class="page-head">
  <div><h1>{{ $document->title }}</h1><div class="sub">{{ $document->reg_no }}</div></div>
  <div class="right">
    <a class="btn btn-ghost btn-sm" href="{{ route('admin.documents') }}">Siyahıya qayıt</a>
    @if ($document->isPublished())
      <a class="btn btn-ghost btn-sm" href="{{ $document->verifyUrl() }}" target="_blank" rel="noopener">Reyestrdə aç</a>
    @endif
    @if ($document->status === 'removed')
      <form method="POST" action="{{ route('admin.documents.restore', $document->reg_no) }}">@csrf
        <button class="btn btn-sm" type="submit">Bərpa et</button>
      </form>
    @else
      <form method="POST" action="{{ route('admin.documents.remove', $document->reg_no) }}"
            onsubmit="return confirm('Sənəd reyestrdən çıxarılsın?')">@csrf
        <button class="btn btn-danger btn-sm" type="submit">Reyestrdən çıxar</button>
      </form>
    @endif
  </div>
</div>

<div class="cols2">
  <div class="panel">
    <div class="panel-head"><span class="label">Sənəd məlumatları</span></div>
    <div class="panel-body">
      <dl class="kv">
        <div><dt>Vəziyyət</dt><dd><span class="pill {{ $document->status === 'published' ? 'ok' : ($document->status === 'removed' ? 'bad' : 'mute') }}">{{ $document->status }}</span></dd></div>
        <div><dt>Kimə verilir</dt><dd>{{ $document->to_name }}</dd></div>
        <div><dt>Kimdən verilir</dt><dd>{{ $document->from_name }}</dd></div>
        <div><dt>Ton</dt><dd>{{ $document->tone === 'xatire' ? 'Xatirə' : 'Zarafat' }}</dd></div>
        <div><dt>Blank forması</dt><dd>{{ $document->layout }} / {{ $document->palette }}</dd></div>
        <div><dt>Şablon</dt><dd>{{ $document->template_id ?: '—' }}</dd></div>
        <div><dt>Yaradılıb</dt><dd>{{ $document->created_at->format('d.m.Y H:i') }}</dd></div>
        <div><dt>Reyestrə düşüb</dt><dd>{{ $document->published_at?->format('d.m.Y H:i') ?: '—' }}</dd></div>
        <div><dt>Baxış sayı</dt><dd>{{ $document->views }}</dd></div>
        {{-- Cavab zənciri: valideyn və birbaşa cavablar --}}
        <div><dt>Cavab verdiyi sənəd</dt><dd>
          @if ($document->replyTo)
            <a href="{{ route('admin.documents.show', $document->replyTo->reg_no) }}">{{ $document->replyTo->reg_no }}</a>
            <div class="sub">səviyyə {{ $document->reply_depth }}</div>
          @else — @endif
        </dd></div>
        <div><dt>Ona verilən cavablar</dt><dd>
          @php($kids = $document->replies()->visible()->orderBy('id')->get(['id', 'reg_no', 'title']))
          @forelse ($kids as $k)
            <div><a href="{{ route('admin.documents.show', $k->reg_no) }}">{{ $k->reg_no }}</a>
              <span class="sub">{{ \Illuminate\Support\Str::limit($k->title, 40) }}</span></div>
          @empty — @endforelse
        </dd></div>
        <div><dt>İstifadəçi</dt><dd>
          @if ($document->user)
            <a href="{{ route('admin.users.show', $document->user->uuid) }}">{{ $document->user->displayName() }}</a>
          @else — @endif
        </dd></div>
      </dl>
    </div>
  </div>

  <div class="panel">
    <div class="panel-head"><span class="label">Mətn</span></div>
    <div class="panel-body">
      <div class="label" style="margin-bottom:6px">Preambula</div>
      <p class="small" style="margin-bottom:16px">{{ $document->preamble ?: '—' }}</p>

      <div class="label" style="margin-bottom:6px">Səlahiyyətlər</div>
      <ol style="margin:0 0 16px;padding-left:18px" class="small">
        @forelse (array_filter(explode("\n", (string) $document->powers)) as $line)
          <li>{{ $line }}</li>
        @empty
          <li>—</li>
        @endforelse
      </ol>

      <div class="label" style="margin-bottom:6px">Cəza bəndi</div>
      <p class="small">{{ $document->penalty ?: '—' }}</p>
    </div>
  </div>
</div>

@if ($document->reports->isNotEmpty())
  <div style="margin-top:22px">
    <div class="page-head" style="margin-bottom:12px"><h1 style="font-size:17px">Bu sənədə şikayətlər</h1></div>
    <div class="tbl-wrap">
      <table class="tbl">
        <thead><tr><th>Tarix</th><th>Səbəb</th><th>Qeyd</th><th>Vəziyyət</th></tr></thead>
        <tbody>
        @foreach ($document->reports as $r)
          <tr>
            <td class="mono">{{ $r->created_at->format('d.m.Y H:i') }}</td>
            <td>{{ $r->reason ?: '—' }}</td>
            <td><span class="s">{{ $r->note ?: '—' }}</span></td>
            <td><span class="pill {{ $r->status === 'open' ? 'wait' : 'mute' }}">{{ $r->status }}</span></td>
          </tr>
        @endforeach
        </tbody>
      </table>
    </div>
  </div>
@endif
@endsection
