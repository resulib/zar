@extends('layouts.panel')
@section('title', $dossier->exists ? $dossier->title : 'Yeni iş')
@section('bar', 'İdarə paneli')
@section('side-title', 'İdarəetmə')
@section('side') @include('partials.admin-nav') @endsection
@section('nav')<a href="{{ route('admin.dossier') }}">İş qovluqları</a><a href="{{ url('/') }}">Sayt</a>@endsection
@section('tools')<form method="POST" action="{{ route('admin.logout') }}">@csrf<button class="chip" type="submit">Çıxış</button></form>@endsection

@section('content')
<div class="page-head">
  <div>
    <h1>{{ $dossier->exists ? $dossier->title : 'Yeni iş' }}</h1>
    <div class="sub">{{ $dossier->exists ? $dossier->no : 'açar «2026-0501» formasındadır' }}</div>
  </div>
  <div class="acts">
    @if($dossier->exists)
      <form method="POST" action="{{ route('admin.dossier.publishAll', $dossier) }}">@csrf
        <button class="btn btn-ghost btn-sm" type="submit">Bütün dəyişiklikləri dərc et</button>
      </form>
      <a class="btn btn-sm" href="{{ route('admin.dossier.doc.new', $dossier) }}">Sənəd əlavə et</a>
    @endif
  </div>
</div>

@include('partials.flash')

@if($dossier->exists)
  {{-- YOXLAMA PANELİ. Səhifənin ƏN YUXARISINDADIR və qatlanmır: dərc etməyə
       mane olan siyahını görmək üçün aşağı sürüşdürmək lazım gəlməməlidir. --}}
  <div class="qv-rapor">
    @if($rapor['xetalar'] === [] && $rapor['qeydler'] === [])
      <div class="qv-ok">Yoxlama təmizdir — iş dərc oluna bilər.</div>
    @endif
    @foreach($rapor['xetalar'] as $x)
      <div class="qv-xeta"><b>Xəta</b> {{ $x }}</div>
    @endforeach
    @foreach($rapor['qeydler'] as $q)
      <div class="qv-qeyd"><b>Qeyd</b> {{ $q }}</div>
    @endforeach
  </div>
@endif

{{-- Beş tab, hər biri oyunun BİR EKRANINA uyğun gəlir. Sayğaclar tabın
     içində nə olduğunu açmadan bildirir. --}}
<div class="qv-tablar" role="tablist">
  <button class="qv-tab on" type="button" data-tab="umumi" role="tab">Ümumi</button>
  <button class="qv-tab" type="button" data-tab="senedler" role="tab">Sənədlər <i>{{ $docs->count() }}</i></button>
  <button class="qv-tab" type="button" data-tab="subheliler" role="tab">Şübhəlilər <i>{{ $subhelil->count() }}</i></button>
  <button class="qv-tab" type="button" data-tab="hekaye" role="tab">Hekayə</button>
  <button class="qv-tab" type="button" data-tab="cavab" role="tab">Cavab <i>{{ $suallar->count() + $sonluql->count() }}</i></button>
</div>

{{-- ---------- 1. ÜMUMİ ---------- --}}
<section class="qv-panel on" data-panel="umumi">
  <p class="qv-izah">Kataloq kartında və təqdimat səhifəsində görünən hər şey.
    <b>Vəziyyət «dərc olunub»</b> qoyulanda iş saytda görünür — yoxlayıcıda xəta varsa keçmir.</p>
  <form method="POST" action="{{ $dossier->exists ? route('admin.dossier.save', $dossier) : route('admin.dossier.create') }}">
    @csrf
    <div class="grid2">
      <label class="fld"><span>Ad</span>
        <input class="input" name="title" maxlength="120" required value="{{ old('title', $dossier->title) }}">
      </label>
      <label class="fld"><span>Açar (slug)</span>
        <input class="input" name="slug" maxlength="9" required placeholder="2026-0501" value="{{ old('slug', $dossier->slug) }}">
      </label>
      <label class="fld"><span>Çətinlik</span>
        <select class="input" name="difficulty">
          @foreach(config('dossier.difficulties') as $c)
            <option value="{{ $c }}" @selected(old('difficulty', $dossier->difficulty) === $c)>{{ config('dossier.difficulty_labels')[$c] ?? $c }}</option>
          @endforeach
        </select>
      </label>
      <label class="fld"><span>Vəziyyət</span>
        <select class="input" name="status">
          <option value="draft" @selected(old('status', $dossier->status) === 'draft')>Qaralama</option>
          <option value="published" @selected(old('status', $dossier->status) === 'published')>Dərc olunub</option>
          <option value="archived" @selected(old('status', $dossier->status) === 'archived')>Arxiv</option>
        </select>
      </label>
      <label class="fld"><span>Yer</span>
        <input class="input" name="place" maxlength="120" value="{{ old('place', $dossier->place) }}">
      </label>
      <label class="fld"><span>Dövr</span>
        <input class="input" name="period" maxlength="60" value="{{ old('period', $dossier->period) }}">
      </label>
      <label class="fld"><span>Nişan</span>
        <select class="input" name="badge">
          <option value="">— yoxdur —</option>
          @foreach(config('dossier.badges') as $b)
            <option value="{{ $b }}" @selected(old('badge', $dossier->badge) === $b)>{{ config('dossier.badge_labels')[$b] ?? $b }}</option>
          @endforeach
        </select>
      </label>
      {{-- ÜZ QABIĞI ŞƏKİLLƏ SEÇİLİR, adla yox. Əvvəl `<select>` idi və
           orada yalnız slug görünürdü — admin hansı şəkli seçdiyini
           yalnız yadda saxlamaqla bilirdi. Şəkil seçimi gözlə edilir.

           Radio düymələri gizlidir, amma DOM-dadır: klaviatura ilə gəzmək
           və ekran oxuyucusu işləməlidir. --}}
      <div class="fld">
        <span>Üz qabığı şəkli</span>
        <p class="qv-ipucu">Kataloq kartında və təqdimat səhifəsində görünür.
          Kadr 21:9 kəsilir — geniş şəkil seçin.</p>

        @if($sekiller->isEmpty())
          <p class="qv-ipucu">Kitabxanada şəkil yoxdur. Aşağıdakı «Şəkillər»
            bölməsindən yükləyin — yükləndikdən sonra burada görünəcək.</p>
        @else
          <div class="qv-qabiqlar">
            <label class="qv-qabiq qv-qabiq-yox">
              <input type="radio" name="cover_image_id" value=""
                     @checked((int) old('cover_image_id', $dossier->cover_image_id) === 0)>
              <span class="qv-qabiq-k">yoxdur</span>
            </label>
            @foreach($sekiller as $s)
              <label class="qv-qabiq">
                <input type="radio" name="cover_image_id" value="{{ $s->id }}"
                       @checked((int) old('cover_image_id', $dossier->cover_image_id) === (int) $s->id)>
                <img src="{{ route('admin.dossier.image', [$s->id, 'kicik']) }}" alt="{{ $s->slug }}" loading="lazy">
                <span class="qv-qabiq-k">{{ $s->slug }}</span>
              </label>
            @endforeach
          </div>
        @endif
      </div>
      <label class="fld"><span>Oxu vaxtı (dəq)</span>
        <input class="input" type="number" name="read_minutes" min="1" max="600" value="{{ old('read_minutes', $dossier->read_minutes ?: 30) }}">
      </label>
      <label class="fld"><span>Qiymət (kredit)</span>
        <input class="input" type="number" name="price_credits" min="0" max="1000" value="{{ old('price_credits', $dossier->price_credits ?? config('dossier.price_credits')) }}">
      </label>
      <label class="fld"><span>Sıra</span>
        <input class="input" type="number" name="sort" min="0" value="{{ old('sort', $dossier->sort ?? 0) }}">
      </label>
    </div>
    <label class="fld"><span>Kartın qısa mətni</span>
      <textarea class="input" name="blurb" rows="2" maxlength="400">{{ old('blurb', $dossier->blurb) }}</textarea>
    </label>
    <label class="fld"><span>Giriş mətni</span>
      <textarea class="input" name="intro" rows="6" maxlength="900">{{ old('intro', $dossier->intro) }}</textarea>
    </label>
    <div class="acts"><button class="btn" type="submit">Yadda saxla</button></div>
  </form>
</section>

{{-- ---------- 2. SƏNƏDLƏR ---------- --}}
<section class="qv-panel" data-panel="senedler">
  @if(! $dossier->exists)
    <p class="muted">Əvvəlcə işi yadda saxlayın.</p>
  @else
    <p class="qv-izah">Oyunçu vərəqləri <b>bu sıra ilə</b> oxuyur və əvvəlkini keçmədən
      növbətini aça bilmir. Sətirləri sürüşdürərək sıranı dəyişin — dərhal yadda saxlanılır.</p>
    <p class="muted qv-komek"><span class="qv-kilid">🔒</span> kodla açılır ·
      <span class="qv-numune">N</span> ana səhifədə pulsuz göstərilir ·
      <span class="qv-sonluq">S</span> işin sonluğu, yalnız həlldən sonra ·
      <span class="qv-qaralama">●</span> dərc olunmamış qaralama var</p>
    <ol class="qv-list" id="qvSenedler" data-url="{{ route('admin.dossier.reorder', $dossier) }}">
      @foreach($docs as $d)
        <li class="qv-row" draggable="true" data-id="{{ $d->id }}">
          <span class="qv-tut" aria-hidden="true">⠿</span>
          <span class="qv-sira">{{ $loop->iteration }}</span>
          <span class="qv-no">{{ $d->page ?: '—' }}</span>
          <a class="qv-ad" href="{{ route('admin.dossier.doc', [$dossier, $d]) }}">{{ $d->name }}</a>
          <span class="qv-nov">{{ $d->doc_type }}</span>
          @if($d->is_locked)<span class="qv-kilid" title="kilidli">🔒</span>@endif
          @if($d->is_sample)<span class="qv-numune" title="pulsuz nümunə">N</span>@endif
          @if($d->is_spoiler)<span class="qv-sonluq" title="işin sonluğu — yalnız həlldən sonra">S</span>@endif
          @if($d->hasDraft())<span class="qv-qaralama" title="dərc olunmamış qaralama">●</span>@endif
        </li>
      @endforeach
    </ol>

    <h2 class="sect-h2">Kodlar</h2>
    {{-- FORMALAR CƏDVƏLDƏN KƏNARDADIR. `<form>` teqi `<td>`-lər arasında
         bölünə bilməz — brauzer onu səssizcə atır və düymə heç nə etmir.
         Ona görə hər forma boş elan olunur, sahələr isə `form=""` atributu
         ilə ona bağlanır. --}}
    @foreach($kodlar as $k)
      <form method="POST" action="{{ route('admin.dossier.code.save', [$dossier, $k]) }}" id="kod{{ $k->id }}">@csrf</form>
      <form method="POST" action="{{ route('admin.dossier.code.delete', [$dossier, $k]) }}" id="kodSil{{ $k->id }}">@csrf</form>
    @endforeach
    <form method="POST" action="{{ route('admin.dossier.code.create', $dossier) }}" id="kodYeni">@csrf</form>

    <div class="tbl-wrap">
      <table class="tbl">
        <thead><tr><th>Kod</th><th>Ad</th><th>Mənbə vərəqlər</th><th>Qeyd</th><th></th></tr></thead>
        <tbody>
          @foreach($kodlar as $k)
            <tr>
              <td><input class="input input-sm" form="kod{{ $k->id }}" name="code" maxlength="12" value="{{ $k->code }}"></td>
              <td><input class="input input-sm" form="kod{{ $k->id }}" name="label" maxlength="80" value="{{ $k->label }}"></td>
              <td>
                <select class="input input-sm" form="kod{{ $k->id }}" name="source_document_ids[]" multiple size="4">
                  @foreach($docs as $d)
                    <option value="{{ $d->id }}" @selected(in_array((int) $d->id, $k->sourceIds(), true))>{{ $d->page }} — {{ \Illuminate\Support\Str::limit($d->name, 30) }}</option>
                  @endforeach
                </select>
              </td>
              <td><input class="input input-sm" form="kod{{ $k->id }}" name="hint_note" maxlength="400" value="{{ $k->hint_note }}"></td>
              <td class="acts">
                <button class="btn btn-sm" form="kod{{ $k->id }}" type="submit">Saxla</button>
                <button class="btn btn-ghost btn-sm" form="kodSil{{ $k->id }}" type="submit">Sil</button>
              </td>
            </tr>
          @endforeach
          <tr>
            <td><input class="input input-sm" form="kodYeni" name="code" maxlength="12" placeholder="6819"></td>
            <td><input class="input input-sm" form="kodYeni" name="label" maxlength="80" placeholder="Birinci kod"></td>
            <td>
              <select class="input input-sm" form="kodYeni" name="source_document_ids[]" multiple size="4">
                @foreach($docs as $d)
                  <option value="{{ $d->id }}">{{ $d->page }} — {{ \Illuminate\Support\Str::limit($d->name, 30) }}</option>
                @endforeach
              </select>
            </td>
            <td><input class="input input-sm" form="kodYeni" name="hint_note" maxlength="400" placeholder="hansı vərəqlərdən yığılır"></td>
            <td><button class="btn btn-sm" form="kodYeni" type="submit">Əlavə et</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  @endif
</section>

{{-- ---------- 3. ŞÜBHƏLİLƏR ---------- --}}
<section class="qv-panel" data-panel="subheliler">
  @if(! $dossier->exists)
    <p class="muted">Əvvəlcə işi yadda saxlayın.</p>
  @else
    <p class="qv-izah">Oyunçu bunları «Şübhəlilər» lentində görür — bioqrafiya,
      kamera qeydi və alibi zolağı ilə. <b>Qatil işarəsi oyunçuya heç vaxt getmir.</b></p>
    @php($qatil = $subhelil->firstWhere('is_culprit', true))
    <div class="qv-rejim">
      @if($qatil)
        Bu işin qatili: <b>{{ $qatil->name }}</b>
      @else
        <b>Qatil işarələnməyib.</b> İş bu halda dərc olunmur.
      @endif
    </div>
    @foreach($subhelil as $s)
      <form class="qv-kart" method="POST" action="{{ route('admin.dossier.suspect.save', [$dossier, $s]) }}">@csrf
        <div class="grid2">
          <label class="fld"><span>Ad</span><input class="input" name="name" maxlength="80" value="{{ $s->name }}" required></label>
          <label class="fld"><span>Rol</span><input class="input" name="role" maxlength="120" value="{{ $s->role }}"></label>
          <label class="fld"><span>Baş hərflər</span><input class="input" name="init" maxlength="4" value="{{ $s->init }}"></label>
          <label class="fld"><span>Foto</span>
            <select class="input" name="photo_id">
              <option value="">— yoxdur —</option>
              @foreach($sekiller as $sk)
                <option value="{{ $sk->id }}" @selected((int) $s->photo_id === (int) $sk->id)>{{ $sk->slug }}</option>
              @endforeach
            </select>
          </label>
        </div>
        <label class="fld"><span>Bioqrafiya</span><textarea class="input" name="bio" rows="3" maxlength="600">{{ $s->bio }}</textarea></label>
        <label class="fld"><span>Kamera qeydi</span><input class="input" name="camera" maxlength="200" value="{{ $s->camera }}"></label>
        <label class="chk"><input type="checkbox" name="is_culprit" value="1" @checked($s->is_culprit)> <span>Qatil budur</span></label>
        <div class="acts">
          <button class="btn btn-sm" type="submit">Saxla</button>
          {{-- Silmə düyməsi AYRI formadadır və `form=""` ilə ona bağlanır:
               iç-içə `<form>` HTML-də mövcud deyil. --}}
          <button class="btn btn-ghost btn-sm" form="subheliSil{{ $s->id }}" type="submit">Sil</button>
        </div>
      </form>
      <form method="POST" action="{{ route('admin.dossier.suspect.delete', [$dossier, $s]) }}" id="subheliSil{{ $s->id }}">@csrf</form>
    @endforeach

    <form class="qv-kart" method="POST" action="{{ route('admin.dossier.suspect.create', $dossier) }}">@csrf
      <h3>Yeni şübhəli</h3>
      <div class="grid2">
        <label class="fld"><span>Ad</span><input class="input" name="name" maxlength="80" required></label>
        <label class="fld"><span>Rol</span><input class="input" name="role" maxlength="120" placeholder="Qonşu, mənzil 34"></label>
      </div>
      <div class="acts"><button class="btn btn-sm" type="submit">Əlavə et</button></div>
    </form>
  @endif
</section>

{{-- ---------- 4. HEKAYƏ ----------
     Qovluğun mətni — sənədlərin yox. Oyunçu bunları «Şübhəlilər», «Qeydlər»
     və yekun ekranlarında görür. --}}
<section class="qv-panel" data-panel="hekaye">
  @if(! $dossier->exists)
    <p class="muted">Əvvəlcə işi yadda saxlayın.</p>
  @else
    <form method="POST" action="{{ route('admin.dossier.story', $dossier) }}">@csrf
      <fieldset class="qv-qrup">
        <legend>Məlumat sətirləri</legend>
        <p class="muted qv-komek">Oyunçu bunları qovluğun üz qabığından sonra görür.
          Hər sətir: <code>ad | dəyər</code></p>
        <textarea class="input qv-metn" name="meta" rows="6" maxlength="4000">@foreach((array) $dossier->meta as $m)
{{ ($m[0] ?? '') . ' | ' . ($m[1] ?? '') }}
@endforeach</textarea>
      </fieldset>

      <fieldset class="qv-qrup">
        <legend>Xronologiya</legend>
        <p class="muted qv-komek">Hadisə gecəsinin gedişi. Hər sətir: <code>saat | hadisə</code></p>
        <textarea class="input qv-metn" name="chronology" rows="10" maxlength="8000">@foreach((array) $dossier->chronology as $c)
{{ ($c[0] ?? '') . ' | ' . ($c[1] ?? '') }}
@endforeach</textarea>
      </fieldset>

      <fieldset class="qv-qrup">
        <legend>Alibi oxu</legend>
        <p class="muted qv-komek">Şübhəlilərin zolaqları bu pəncərəyə görə çəkilir —
          zolaqların faizləri məhz bu aralığın faizidir. Üç sətir, hər sətirdə bir saat.</p>
        <textarea class="input qv-metn" name="axis" rows="3" maxlength="200">@foreach((array) $dossier->axis as $a)
{{ $a }}
@endforeach</textarea>
      </fieldset>

      <fieldset class="qv-qrup">
        <legend>Həll</legend>
        <p class="muted qv-komek"><b>Spoylerdir.</b> Oyunçu yalnız işi bağladıqdan
          və ya üç cəhdi bitirdikdən sonra görür. Boş sətir abzası bölür.</p>
        <textarea class="input qv-metn" name="solution" rows="10" maxlength="12000">{{ implode("\n\n", array_map('strval', (array) $dossier->solution)) }}</textarea>
      </fieldset>

      <div class="acts"><button class="btn" type="submit">Yadda saxla</button></div>
    </form>
  @endif
</section>

{{-- ---------- 5. CAVAB ----------
     İki mexanika yan-yana durur və hansının işlədiyi TÖRƏMƏDİR: sonluq
     sətri varsa şübhəli seçimi, yoxsa üç suallıq rəy. Panel bunu açıq
     yazır, yoxsa idarəçi hansının canlı olduğunu bilmir. --}}
<section class="qv-panel" data-panel="cavab">
  @if(! $dossier->exists)
    <p class="muted">Əvvəlcə işi yadda saxlayın.</p>
  @else
    <div class="qv-rejim">
      @if($sonluql->isNotEmpty())
        <b>Aktiv: şübhəli seçimi.</b> Oyunçu bir şübhəli seçir və uyğun sonluğu alır.
        Aşağıdakı suallar bu işdə işlədilmir.
      @else
        <b>Aktiv: üç suallıq rəy.</b> Oyunçu üç suala cavab verir, üç cəhdi var.
        Sonluq yazsanız, iş avtomatik şübhəli seçiminə keçəcək.
      @endif
    </div>

    <h2 class="sect-h2">Yekun suallar</h2>
    <p class="muted qv-komek">Birinci sualın düzgün variantı <b>qatili</b> göstərir.
      Oyunçuya hansı bəndin səhv olduğu heç vaxt bildirilmir.</p>

    @foreach($suallar as $q)
      <form class="qv-kart" method="POST" action="{{ route('admin.dossier.question.save', [$dossier, $q]) }}">@csrf
        <h3>Sual {{ $loop->iteration }}</h3>
        <label class="fld"><span>Sual</span>
          <input class="input" name="prompt" maxlength="200" required value="{{ $q->prompt }}">
        </label>
        <label class="fld"><span>Variantlar — hər sətirdə biri</span>
          <textarea class="input qv-metn" name="options" rows="4" maxlength="2000">{{ implode("\n", array_map('strval', (array) $q->options)) }}</textarea>
        </label>
        <div class="grid2">
          <label class="fld"><span>Düzgün cavab</span>
            <select class="input" name="correct">
              @foreach((array) $q->options as $oi => $o)
                <option value="{{ $oi }}" @selected((int) $q->correct_index === (int) $oi)>{{ $oi + 1 }}. {{ \Illuminate\Support\Str::limit($o, 46) }}</option>
              @endforeach
            </select>
          </label>
          <label class="fld"><span>Sıra</span>
            <input class="input" type="number" name="sort" min="0" max="100" value="{{ $q->sort }}">
          </label>
        </div>
        <label class="fld"><span>İzah (cəhdlər bitəndə göstərilir)</span>
          <input class="input" name="explanation" maxlength="500" value="{{ $q->explanation }}">
        </label>
        <div class="acts">
          <button class="btn btn-sm" type="submit">Saxla</button>
          <button class="btn btn-ghost btn-sm" form="sualSil{{ $q->id }}" type="submit">Sil</button>
        </div>
      </form>
      <form method="POST" action="{{ route('admin.dossier.question.delete', [$dossier, $q]) }}" id="sualSil{{ $q->id }}">@csrf</form>
    @endforeach

    <form class="qv-kart" method="POST" action="{{ route('admin.dossier.question.create', $dossier) }}">@csrf
      <h3>Yeni sual</h3>
      <label class="fld"><span>Sual</span><input class="input" name="prompt" maxlength="200" required></label>
      <label class="fld"><span>Variantlar — hər sətirdə biri</span>
        <textarea class="input qv-metn" name="options" rows="4" maxlength="2000" required></textarea>
      </label>
      <label class="fld"><span>Düzgün cavabın nömrəsi (1-dən)</span>
        <input class="input" type="number" name="correct" min="1" max="8" value="1" required>
      </label>
      <div class="acts"><button class="btn btn-sm" type="submit">Əlavə et</button></div>
    </form>

    <h2 class="sect-h2">Sonluqlar</h2>
    @if($subhelil->isEmpty())
      <p class="muted">Əvvəlcə şübhəli əlavə edin — hər şübhəli üçün bir sonluq yazılır.</p>
    @else
      <p class="muted qv-komek">Bir sonluq yazan kimi iş şübhəli seçiminə keçir,
        ona görə hamısı doldurulmalıdır.</p>
      @foreach($subhelil as $s)
        @php($e = $sonluql[$s->id] ?? null)
        <form class="qv-kart" method="POST" action="{{ route('admin.dossier.ending.save', [$dossier, $s]) }}">@csrf
          <h3>{{ $s->name }} @if($s->is_culprit)<span class="badge badge-ok">qatil</span>@endif</h3>
          <label class="fld"><span>Hökm mətni</span>
            <textarea class="input" name="verdict_text" rows="4" maxlength="4000" required>{{ $e->verdict_text ?? '' }}</textarea>
          </label>
          <label class="fld"><span>Açılış mətni (yalnız doğru sonluqda göstərilir)</span>
            <textarea class="input" name="reveal_text" rows="5" maxlength="8000">{{ $e->reveal_text ?? '' }}</textarea>
          </label>
          <label class="fld"><span>Sancı sətri (üç saniyə sonra çıxır)</span>
            <input class="input" name="sting_line" maxlength="300" value="{{ $e->sting_line ?? '' }}">
          </label>
          <label class="chk"><input type="checkbox" name="is_true_ending" value="1" @checked($e->is_true_ending ?? false)> <span>Doğru sonluq</span></label>
          <div class="acts"><button class="btn btn-sm" type="submit">Saxla</button></div>
        </form>
      @endforeach
    @endif
  @endif
</section>
@endsection

@push('scripts')
<script src="{{ asset('assets/panel-qovluq.js') }}?v={{ (int) @filemtime(public_path('assets/panel-qovluq.js')) }}"></script>
@endpush
