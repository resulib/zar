@extends('layouts.panel')
@section('title', 'Sənədlərim')
@section('bar', 'İstifadəçi kabineti')
@section('side-title', 'Kabinet')
@section('side') @include('partials.account-nav', ['navDocCount' => $documents->total()]) @endsection
@section('nav')
  <a href="{{ url('/') }}">Sənəd yarat</a>
  <a href="{{ url('/#reyestr') }}">Reyestr</a>
  <a href="{{ route('account.index') }}">Kabinet</a>
@endsection

@section('content')
<div class="page-head">
  <div><h1>Sənədlərim</h1><div class="sub">{{ $documents->total() }} sənəd</div></div>
  <div class="right"><a class="btn btn-sm" href="{{ url('/') }}">Yeni sənəd</a></div>
</div>

<div class="tbl-wrap">
  <table class="tbl">
    <thead>
      <tr>
        <th>Sənəd</th><th>Forma</th><th>Nömrə</th><th>Vəziyyət</th><th class="num">Baxış</th><th></th>
      </tr>
    </thead>
    <tbody>
    @forelse ($documents as $doc)
      <tr>
        <td>
          <span class="t">{{ $doc->title }}</span>
          <span class="s">{{ $doc->to_name }} ← {{ $doc->from_name }}</span>
        </td>
        <td class="mono">{{ $doc->layout }}/{{ $doc->palette }}<br><span class="s">{{ $doc->tone === 'xatire' ? 'Xatirə' : 'Zarafat' }}</span></td>
        <td class="mono">{{ $doc->reg_no }}<br><span class="s">{{ $doc->date_label }}</span></td>
        <td><span class="pill {{ $doc->isPublished() ? 'ok' : 'mute' }}">{{ $doc->isPublished() ? 'Reyestrdə' : 'Qaralama' }}</span></td>
        <td class="num">{{ $doc->views }}</td>
        <td>
          <div class="acts">
            @if ($doc->isPublished())
              <a class="btn btn-ghost btn-sm" href="{{ $doc->verifyUrl() }}" target="_blank" rel="noopener">Aç</a>
            @else
              <a class="btn btn-ghost btn-sm" href="{{ url('/') }}">Tamamla</a>
            @endif
          </div>
        </td>
      </tr>
    @empty
      <tr><td colspan="6" class="tbl-empty">Hələ sənəd hazırlamamısınız.</td></tr>
    @endforelse
    </tbody>
  </table>
</div>

<div style="margin-top:16px">{{ $documents->links('partials.pagination') }}</div>
@endsection
