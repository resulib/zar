{{-- Yazışma — ŞƏKİL DEYİL, HTML. Kağız vərəqin üstünə çap edilmiş ekran
     görüntüsü kimi çərçivəyə salınır. Silinmiş mesaj oyunda dəlildir:
     mətni serverdə sabitdir, məzmundan gəlmir. --}}
@include('dossier.partials.basliq')
@php($chat = (array) ($c['chat'] ?? []))
<div class="shot">
  <div class="shot-bar">
    <div class="shot-av"></div>
    <div class="shot-nm">{{ $chat['name'] ?? '' }}<small>{{ $chat['seen'] ?? '' }}</small></div>
  </div>
  @foreach($chat['days'] ?? [] as $gun)
    <div class="shot-day">{{ $gun['label'] ?? '' }}</div>
    @foreach($gun['messages'] ?? [] as $m)
      @php($kind = (string) ($m['kind'] ?? 'adi'))
      @if($kind === 'silinmis')
        <div class="bub del">Bu mesaj silinib<time>{{ $m['time'] ?? '' }}</time></div>
      @elseif($kind === 'sistem')
        <div class="shot-day">{{ $m['text'] ?? '' }}</div>
      @else
        <div class="bub {{ ($m['yon'] ?? 'gelen') === 'cixan' ? 'i' : 'u' }}">{{ $m['text'] ?? '' }}<time>{{ $m['time'] ?? '' }}</time></div>
      @endif
    @endforeach
  @endforeach
</div>
@if(trim((string) ($c['cap'] ?? '')) !== '')
<div class="cap">{{ $c['cap'] }}</div>
@endif
@include('dossier.partials.qeyd')
