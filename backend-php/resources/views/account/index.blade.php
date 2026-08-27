@extends('layouts.panel')
@section('title', 'Kabinet')
@section('bar', 'İstifadəçi kabineti')
@section('side-title', 'Kabinet')
@section('side') @include('partials.account-nav', ['navDocCount' => $docCount]) @endsection
@section('nav')
  <a href="{{ url('/') }}">Sənəd yarat</a>
  <a href="{{ url('/#reyestr') }}">Reyestr</a>
  <a href="{{ route('account.index') }}">Kabinet</a>
@endsection

@section('content')
<div class="page-head">
  <div>
    <h1>Ümumi baxış</h1>
    <div class="sub">{{ $user->isGuest() ? 'Qonaq sessiyası · ' . substr($user->uuid, 0, 8) : $user->email }}</div>
  </div>
  <div class="right">
    <a class="btn btn-ghost btn-sm" href="{{ url('/') }}">Yeni sənəd</a>
  </div>
</div>

<dl class="stats">
  <div class="accent"><dt>Balans</dt><dd>{{ $user->credits }} <small>sənəd</small></dd></div>
  <div><dt>Hazırlanıb</dt><dd>{{ $docCount }}</dd></div>
  <div><dt>Reyestrdə</dt><dd>{{ $publishedCount }}</dd></div>
  <div><dt>Ödənilib</dt><dd>{{ number_format($spent, 2) }} <small>AZN</small></dd></div>
</dl>

@if ($user->isGuest())
  <div class="notice" style="margin-bottom:22px">
    <div class="t">Qonaq sessiyası</div>
    <p>
      Hər şey işləyir — sənəd yarada və ödəniş edə bilərsiniz. Lakin balans yalnız bu brauzerdə saxlanılır:
      cookie silinsə itə bilər. İstəsəniz <a href="{{ route('account.auth') }}">hesab aça bilərsiniz</a> —
      mövcud balans və sənədlər olduğu kimi qalır.
    </p>
  </div>
@endif

<div class="panel" style="margin-bottom:22px">
  <div class="panel-head"><span class="label">Balans artır</span><span class="right label">1 kredit = 1 sənəd</span></div>
  <div class="panel-body">
    <form method="POST" action="{{ route('account.topup') }}" class="pack-grid">
      @csrf
      @foreach ($packs as $pack)
        <button class="pack {{ ($pack['best'] ?? false) ? 'best' : '' }}" name="pack" value="{{ $pack['id'] }}" type="submit">
          <span>
            <span class="n">{{ $pack['label'] }}</span><br>
            <span class="d">{{ $pack['note'] ?? '' }}</span>
          </span>
          <span class="p">{{ number_format((float) $pack['amount'], 2) }} AZN</span>
        </button>
      @endforeach
    </form>
  </div>
</div>

<div class="cols2">
  <div>
    <div class="page-head" style="margin-bottom:12px">
      <h1 style="font-size:17px">Son sənədlər</h1>
      <div class="right"><a class="btn btn-ghost btn-sm" href="{{ route('account.documents') }}">Hamısı</a></div>
    </div>
    <div class="tbl-wrap">
      <table class="tbl">
        <tbody>
        @forelse ($documents as $doc)
          <tr>
            <td>
              <span class="t">{{ $doc->title }}</span>
              <span class="s">{{ $doc->reg_no }} · {{ $doc->date_label }}</span>
            </td>
            <td class="num">
              <span class="pill {{ $doc->isPublished() ? 'ok' : 'mute' }}">
                {{ $doc->isPublished() ? 'Reyestrdə' : 'Qaralama' }}
              </span>
            </td>
          </tr>
        @empty
          <tr><td class="tbl-empty">Hələ sənəd hazırlamamısınız.</td></tr>
        @endforelse
        </tbody>
      </table>
    </div>
  </div>

  <div>
    <div class="page-head" style="margin-bottom:12px">
      <h1 style="font-size:17px">Son əməliyyatlar</h1>
      <div class="right"><a class="btn btn-ghost btn-sm" href="{{ route('account.transactions') }}">Hamısı</a></div>
    </div>
    <div class="tbl-wrap">
      <table class="tbl">
        <tbody>
        @forelse ($transactions as $tx)
          <tr>
            <td>
              <span class="t" style="font-size:13px">{{ $tx->typeLabel() }}</span>
              <span class="s">{{ $tx->created_at->format('d.m.Y H:i') }}{{ $tx->note ? ' · ' . $tx->note : '' }}</span>
            </td>
            <td class="num" style="color:{{ $tx->credits >= 0 ? 'var(--green)' : 'var(--red)' }}">
              {{ $tx->credits > 0 ? '+' : '' }}{{ $tx->credits }}
            </td>
            <td class="num">{{ $tx->balance_after }}</td>
          </tr>
        @empty
          <tr><td class="tbl-empty">Əməliyyat yoxdur.</td></tr>
        @endforelse
        </tbody>
      </table>
    </div>
  </div>
</div>
@endsection
