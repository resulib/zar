@extends('layouts.panel')
@section('title', 'Şəkil hovuzu')
@section('bar', 'İdarə paneli')
@section('side-title', 'İdarəetmə')
@section('side') @include('partials.admin-nav') @endsection
@section('nav')<a href="{{ route('admin.dashboard') }}">İdarə paneli</a><a href="{{ url('/') }}">Sayt</a>@endsection
@section('tools')<form method="POST" action="{{ route('admin.logout') }}">@csrf<button class="chip" type="submit">Çıxış</button></form>@endsection

@section('content')
<div class="page-head">
  <div>
    <h1>Şəkil hovuzu</h1>
    <div class="sub">{{ $sekiller->count() }} şəkil · bütün işlər üçün ümumi kitabxana</div>
  </div>
</div>

{{-- Flash-ı layout özü göstərir (layouts/panel.blade.php) — burada təkrarlamırıq. --}}

{{-- HOVUZ İŞLƏRDƏN ASILI DEYİL. Şəkil bir dəfə bura yüklənir, sonra istənilən
     işə «köçür» ilə salınır — işdə adi kitabxana şəkli yaranır (fayl surətlənir),
     ona görə oyunçu yolunun «şəkil bu işə aiddir» qapısı və spoiler qoruması
     olduğu kimi qalır. Hovuzdakı şəkli silmək işlərə köçürülmüş surətlərə
     TOXUNMUR. --}}

<h2 class="sect-h2">Yeni şəkil</h2>
<form method="POST" action="{{ route('admin.hovuz.store') }}" enctype="multipart/form-data" class="qv-hovuz-forma">
  @csrf
  <div class="grid-2">
    <label class="fld"><span>Şəkil faylı (JPEG · PNG · WebP)</span>
      <input class="input" type="file" name="sekil" accept="image/jpeg,image/png,image/webp" required>
    </label>
    <label class="fld"><span>Açar — boş qalsa fayl adından düzəlir</span>
      <input class="input" name="slug" maxlength="60" placeholder="kamera-giris">
    </label>
    <label class="fld"><span>İzah — şəklin altında görünür</span>
      <input class="input" name="izah" maxlength="300" placeholder="00:47, giriş qapısı">
    </label>
    <label class="fld"><span>Görkəm</span>
      <select class="input" name="nov">
        @foreach(config('dossier.sekil_novleri') as $n)
          <option value="{{ $n }}" @selected($n === 'generic')>{{ config('dossier.sekil_labels')[$n] ?? $n }}</option>
        @endforeach
      </select>
    </label>
  </div>
  <p><button class="btn" type="submit">Hovuza yüklə</button></p>
</form>

<h2 class="sect-h2">Hovuzdakı şəkillər</h2>
@if($sekiller->isEmpty())
  <p class="muted">Hovuz boşdur — yuxarıdakı forma ilə şəkil əlavə edin.</p>
@else
  <p class="muted">Şəkli işə salmaq üçün sətirdə işi seçib «Köçür» basın — şəkil həmin
    işin kitabxanasına düşür və sənəd redaktorundakı seçimlərdə görünür.</p>

  <div class="qv-hovuz">
  @foreach($sekiller as $s)
    {{-- Bir sətir üç formadır (redaktə · köçürmə · silmə) və heç biri
         digərinin içində deyil — iç-içə form brauzerdə səssizcə itir. --}}
    <div class="qv-sekil-sətir">
      <img src="{{ route('admin.hovuz.image', [$s, 'kicik']) }}" alt="" width="44" height="44">

      <input class="input input-sm" form="hovuzSaxla{{ $s->id }}" name="slug" maxlength="60" value="{{ $s->slug }}">
      <input class="input input-sm" form="hovuzSaxla{{ $s->id }}" name="izah" maxlength="300" value="{{ $s->caption }}" placeholder="izah">
      <select class="input input-sm" form="hovuzSaxla{{ $s->id }}" name="nov">
        @foreach(config('dossier.sekil_novleri') as $n)
          <option value="{{ $n }}" @selected($s->image_type === $n)>{{ config('dossier.sekil_labels')[$n] ?? $n }}</option>
        @endforeach
      </select>
      <button class="btn btn-sm" form="hovuzSaxla{{ $s->id }}" type="submit">Saxla</button>

      <select class="input input-sm" form="hovuzKocur{{ $s->id }}" name="dossier"
              onchange="this.form.action = this.form.dataset.qelib.replace('DID', this.value)">
        <option value="">— işə köçür… —</option>
        @foreach($isler as $is)
          <option value="{{ $is->id }}">{{ $is->slug }} · {{ \Illuminate\Support\Str::limit($is->title, 22) }}</option>
        @endforeach
      </select>
      <button class="btn btn-sm" form="hovuzKocur{{ $s->id }}" type="submit">Köçür</button>

      <button class="btn btn-ghost btn-sm" form="hovuzSil{{ $s->id }}" type="submit">Sil</button>
    </div>

    <form method="POST" action="{{ route('admin.hovuz.update', $s) }}" id="hovuzSaxla{{ $s->id }}">@csrf</form>
    {{-- Köçürmə formasının ünvanı seçilən işdən asılıdır: qəlib `data-` ilə
         gəlir və `onchange` DID-i əvəz edir. İş seçilməyibsə ünvan boşdur və
         göndərmə heç nə etmir. --}}
    <form method="POST" action="{{ route('admin.hovuz.copy', ['dossier' => 'DID', 'image' => $s]) }}"
          id="hovuzKocur{{ $s->id }}"
          data-qelib="{{ route('admin.hovuz.copy', ['dossier' => 'DID', 'image' => $s]) }}"
          onsubmit="return this.action.indexOf('DID') === -1">@csrf</form>
    <form method="POST" action="{{ route('admin.hovuz.delete', $s) }}" id="hovuzSil{{ $s->id }}">@csrf</form>
  @endforeach
  </div>
@endif
@endsection
