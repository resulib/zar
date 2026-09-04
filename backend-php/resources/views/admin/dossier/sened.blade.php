@extends('layouts.panel')
@section('title', $doc->exists ? $doc->name : 'Yeni sənəd')
@section('bar', 'İdarə paneli')
@section('side-title', 'İdarəetmə')
@section('side') @include('partials.admin-nav') @endsection
{{-- Bu ekran iki sütunludur və panelin 1180px-lik eninə sığmır. --}}
@section('shell', 'wrap-genis')
@section('nav')<a href="{{ route('admin.dossier.form', $dossier) }}">{{ $dossier->title }}</a><a href="{{ route('admin.dossier') }}">İş qovluqları</a>@endsection
@section('tools')<form method="POST" action="{{ route('admin.logout') }}">@csrf<button class="chip" type="submit">Çıxış</button></form>@endsection

@section('content')
<div class="page-head">
  <div>
    <h1>{{ $doc->exists ? $doc->name : 'Yeni sənəd' }}</h1>
    <div class="sub">{{ $dossier->title }} · {{ $dossier->no }}</div>
  </div>
  <div class="acts">
    @if($doc->exists && $doc->hasDraft())
      <button class="btn btn-sm" form="senedDerc" type="submit">Bu sənədi dərc et</button>
    @endif
    @if($doc->exists)
      <button class="btn btn-ghost btn-sm" form="senedSil" type="submit">Sil</button>
    @endif
  </div>
</div>

@include('partials.flash')

@if($doc->exists)
  <form method="POST" action="{{ route('admin.dossier.doc.publish', [$dossier, $doc]) }}" id="senedDerc">@csrf</form>
  <form method="POST" action="{{ route('admin.dossier.doc.delete', [$dossier, $doc]) }}" id="senedSil">@csrf</form>
  @if($doc->hasDraft())
    <div class="qv-qeyd"><b>Qaralama</b> Bu sənəddə dərc olunmamış dəyişiklik var — oyunçu hələ köhnə mətni görür.</div>
  @endif
@endif

<div class="qv-iki"
     id="qvRedaktor"
     data-onizleme="{{ $doc->exists ? route('admin.dossier.doc.preview', [$dossier, $doc]) : route('admin.dossier.preview', $dossier) }}"
     data-yukle="{{ route('admin.dossier.image.store', $dossier) }}"
     data-sened="{{ $doc->id ?? '' }}">

  {{-- ---------- SOL: sahələr ---------- --}}
  <div class="qv-sol">
    <form method="POST" id="senedForm"
          action="{{ $doc->exists ? route('admin.dossier.doc.save', [$dossier, $doc]) : route('admin.dossier.doc.create', $dossier) }}">
      @csrf
      {{-- Sahələr QRUPLARA bölünür. Uzun, fasiləsiz yığın idarəçinin gözünü
           itirir: burada dörd blok var və hər biri bir sualı cavablandırır —
           vərəq nədir · necə görünür · nə yazılıb · kilidlidirmi. --}}
      <fieldset class="qv-qrup">
        <legend>Vərəq</legend>
        <div class="grid2">
          <label class="fld"><span>Vərəq nömrəsi</span>
            <input class="input" name="page" maxlength="12" value="{{ old('page', $doc->page) }}" placeholder="14–15">
          </label>
          <label class="fld"><span>Növ (panel üçün)</span>
            <select class="input" name="doc_type">
              @foreach($novler as $n)
                <option value="{{ $n }}" @selected(old('doc_type', $doc->doc_type) === $n)>{{ config('dossier.sened_labels')[$n] ?? $n }}</option>
              @endforeach
            </select>
          </label>
        </div>

        <label class="fld"><span>Başlıq</span>
          <input class="input" name="name" maxlength="160" required value="{{ old('name', $doc->name) }}">
        </label>

        <label class="chk"><input type="checkbox" name="is_sample" value="1" @checked(old('is_sample', $doc->is_sample))>
          <span>Pulsuz nümunə — ana səhifədə ödənişsiz göstərilir</span></label>
      </fieldset>

      <fieldset class="qv-qrup">
        <legend>Blank</legend>
        <div class="grid2">
          <label class="fld"><span>Sənədin sözü (oyunçu görür)</span>
            <input class="input" name="kind" maxlength="40" value="{{ old('kind', $doc->kind) }}" placeholder="Protokol">
          </label>
          <label class="fld"><span>Blank növü</span>
            <select class="input" name="blank_nov">
              @foreach($blanklar as $b)
                <option value="{{ $b }}" @selected(old('blank_nov', $doc->blank_nov ?: 'resmi') === $b)>{{ config('dossier.blank_labels')[$b] ?? $b }}</option>
              @endforeach
            </select>
          </label>
        </div>

        <label class="fld"><span>Meta sətri</span>
          <input class="input" name="meta_line" maxlength="200" value="{{ old('meta_line', $doc->meta_line) }}"
                 placeholder="Arayış № AFİB-2026/0501-3 · 12.04.2026, saat 09:20">
        </label>
      </fieldset>

      <fieldset class="qv-qrup">
        <legend>Mətn</legend>

        @if($doc->exists && $doc->govde() === null && ! empty(((array) $doc->content)['bloklar'] ?? []))
          {{-- BLOK REJİMİ. Vərəq `content.bloklar` ardıcıllığı ilə qurulub —
               seed faylından gələn 84 sənədin hamısı belədir. Mətn sahəsinə
               yazılan ilk hərf vərəqi mətn rejiminə keçirir və bloklar
               görünməz olur (bazadan silinmir, sadəcə render edilmir).
               İdarəçi bunu BİLMƏLİDİR, yoxsa hazır vərəqi bir yazı ilə
               səhvən boşaldar. --}}
          <div class="qv-qeyd"><b>Blok rejimi</b>
            Bu vərəq {{ count(((array) $doc->content)['bloklar']) }} blokdan qurulub və mətn sahəsi boşdur.
            Bura nə isə yazsanız, vərəq mətn rejiminə keçəcək və bloklar görünməyəcək —
            onlara <code>@{{ blok:acar }}</code> nişanı ilə müraciət edin.
          </div>
        @endif

        {{-- ALƏT PANELİ. İşarələri əl ilə yazmaq lazım deyil: düymə seçilmiş
             sözü bürüyür, seçim yoxdursa nümunə söz qoyur və onu seçili
             saxlayır — yəni növbəti yazılan hərf onu əvəz edir.

             Sintaksis yenə mətndədir və orada qalmalıdır: bu, WYSIWYG deyil,
             çünki `Metn::inline()` mətni məhz belə oxuyur və vərəq həmişə
             mətndən qurulur. Düymələr sadəcə yazmağı əvəz edir. --}}
        <div class="qv-alet" role="toolbar" aria-label="Mətn işarələri">
          <button type="button" class="qv-a" data-bur="**"   title="Qalın"><b>B</b></button>
          <button type="button" class="qv-a qv-a-qelem" data-bur="[[|]]" title="Müstəntiqin qırmızı qələmi">Qırmızı</button>
          <button type="button" class="qv-a qv-a-el" data-bur="++"  title="Sonradan əl ilə əlavə edilib">Əl ilə</button>
          <button type="button" class="qv-a qv-a-ust" data-bur="~~" title="Üstündən xətt çəkilib">Üstünə xətt</button>
          <button type="button" class="qv-a qv-a-oxu" data-bur="((|))" title="Kseroksda itib, oxunmur">Oxunmaz</button>
          <button type="button" class="qv-a qv-a-daire" data-bur="%%" title="Dairəyə alınıb">Dairəyə al</button>
          <span class="qv-a-ay"></span>
          <button type="button" class="qv-a" data-qoy="{{ '{' }}{{ '{' }}mustentiq}}" title="Oyunçunun yazdığı ad">Oyunçunun adı</button>
          <button type="button" class="qv-a" data-sekil="1" title="Kitabxanadan şəkil seç">Şəkil…</button>
          @if($kartlar !== [])
            @foreach($kartlar as $blok)
              @if($blok['acar'] !== '')
                @php($nisanA = \App\Support\Dossier\Isare::yaz('blok', $blok['acar']))
                <button type="button" class="qv-a" data-qoy="{{ $nisanA }}" title="Maddi sübut siyahısını bura sal">Sübutlar</button>
              @endif
            @endforeach
          @endif
        </div>

        <textarea class="input qv-metn" name="body" id="qvBody" rows="20" maxlength="60000"
                  placeholder="Sənədin mətni. Boş sətir abzası bölür.">{{ old('body', $doc->draft_body ?? $doc->body) }}</textarea>

        {{-- Şəkil seçimi — «Şəkil…» düyməsi açır. Kitabxanadakı hər şəkil
             thumb-ı ilə görünür; klik nişanı kursora salır. --}}
        <div class="qv-sec-sekil" id="qvSecSekil" hidden>
          <div class="qv-sec-bas">Kitabxanadan seç
            <button type="button" class="btn btn-ghost btn-sm" data-bagla="1">Bağla</button>
          </div>
          @if($sekiller->isEmpty())
            <p class="muted">Kitabxana boşdur — aşağıdan şəkil yükləyin.</p>
          @else
            <div class="qv-sec-tor">
              @foreach($sekiller as $sk)
                @php($nisanS = \App\Support\Dossier\Isare::yaz('sekil', $sk->slug))
                <button type="button" class="qv-sekil" data-nisan="{{ $nisanS }}">
                  <img src="{{ route('admin.dossier.image', [$sk, 'kicik']) }}" alt="" loading="lazy">
                  <span>{{ $sk->slug }}</span>
                </button>
              @endforeach
            </div>
          @endif
        </div>
      </fieldset>

      @if($kartlar !== [])
        {{-- MADDİ SÜBUTLAR. `kart` bloku hər sənəddə olmur, ona görə bölmə
             yalnız blok mövcud olduqda görünür.

             HƏR SÜBUTUN ŞƏKİL YERİ VAR və o, boş qalanda da vərəqdə qalır —
             real protokolda əşyanın fotosu üçün yer əvvəlcədən ayrılır.
             Şəkil KİTABXANA AÇARI ilə bağlanır, fayl adı ilə yox. --}}
        <fieldset class="qv-qrup">
          <legend>Maddi sübutlar</legend>
          <p class="muted qv-komek">Adı boşaldılmış sətir silinir. «Yüklə» düyməsi şəkli
            kitabxanaya əlavə edir və dərhal həmin sübuta bağlayır.</p>

          @foreach($kartlar as $blok)
            @if(count($kartlar) > 1)
              <div class="qv-sub-b">Blok {{ $loop->iteration }}</div>
            @endif

            {{-- MƏTN REJİMİNDƏ BLOK ÖZBAŞINA GÖRÜNMÜR. Sənədin `body` sahəsi
                 doludursa, vərəq mətn kimi oxunur və bloklar yalnız nişanla
                 çağırılır. Nişan yazılmasa, sübutlar səssizcə itər — ona görə
                 xəbərdarlıq buradadır və nişanı bir kliklə yapışdırır. --}}
            {{-- Nişan `Isare::yaz()` ilə qurulur. Sətri burada yazmaq OLMAZ:
                 Blade `@php()` blokunun İÇİNDƏ də `{{ … }}` axtarır və
                 `'{{ blok:'` ifadəsini `'<?php echo e(blok:'` -ə çevirir —
                 səhv səssizdir, çünki müqayisə də eyni pozulmuş dəyərlə gedir. --}}
            @php($nisanKart = $blok['acar'] !== '' ? \App\Support\Dossier\Isare::yaz('blok', $blok['acar']) : '')
            @if($doc->govde() !== null && $blok['acar'] !== '' && ! str_contains((string) $doc->govde(), $nisanKart))
              <div class="qv-qeyd"><b>Nişan yoxdur</b>
                Bu sənəd mətn rejimindədir və sübut siyahısı yalnız nişanla görünür.
                <button type="button" class="btn btn-ghost btn-sm qv-nisan-yap"
                        data-nisan="{{ $nisanKart }}">Nişanı mətnə yapışdır</button>
              </div>
            @endif

            <div class="qv-subler" data-blok="{{ $blok['i'] }}">
              @foreach($blok['kartlar'] as $ki => $k)
                <div class="qv-sub">
                  <div class="qv-sub-no">{{ $ki + 1 }}</div>
                  <div class="qv-sub-g">
                    <input class="input input-sm" name="kartlar[{{ $blok['i'] }}][{{ $ki }}][ad]"
                           maxlength="120" value="{{ $k['ad'] ?? '' }}" placeholder="sübutun adı">
                    <textarea class="input input-sm" rows="3" maxlength="2000"
                              name="kartlar[{{ $blok['i'] }}][{{ $ki }}][metn]"
                              placeholder="təsvir">{{ $k['metn'] ?? '' }}</textarea>
                    <div class="qv-sub-s">
                      <select class="input input-sm qv-sub-sek" name="kartlar[{{ $blok['i'] }}][{{ $ki }}][sekil]">
                        <option value="">— foto yoxdur —</option>
                        @foreach($sekiller as $sk)
                          <option value="{{ $sk->slug }}" @selected(($k['sekil'] ?? '') === $sk->slug)>{{ $sk->slug }}</option>
                        @endforeach
                      </select>
                      <label class="btn btn-ghost btn-sm qv-sub-yukle">Yüklə
                        <input type="file" accept="image/jpeg,image/png,image/webp" hidden>
                      </label>
                    </div>
                  </div>
                  <div class="qv-sub-on">
                    @php($sk = collect($sekiller)->firstWhere('slug', $k['sekil'] ?? '~'))
                    @if($sk)
                      <img src="{{ route('admin.dossier.image', [$sk, 'kicik']) }}" alt="">
                    @else
                      <span>foto yoxdur</span>
                    @endif
                  </div>
                </div>
              @endforeach

              {{-- BOŞ SƏTİR. Ayrıca «əlavə et» düyməsi yoxdur: adı yazmaq
                   kifayətdir, boş qalan sətir isə saxlanılanda atılır —
                   silmə də eyni qayda ilə işləyir (adı boşalt). --}}
              @php($yeni = count($blok['kartlar']))
              <div class="qv-sub qv-sub-yeni">
                <div class="qv-sub-no">+</div>
                <div class="qv-sub-g">
                  <input class="input input-sm" name="kartlar[{{ $blok['i'] }}][{{ $yeni }}][ad]"
                         maxlength="120" placeholder="yeni sübutun adı">
                  <textarea class="input input-sm" rows="2" maxlength="2000"
                            name="kartlar[{{ $blok['i'] }}][{{ $yeni }}][metn]"
                            placeholder="təsvir"></textarea>
                  <div class="qv-sub-s">
                    <select class="input input-sm qv-sub-sek" name="kartlar[{{ $blok['i'] }}][{{ $yeni }}][sekil]">
                      <option value="">— foto yoxdur —</option>
                      @foreach($sekiller as $sk)
                        <option value="{{ $sk->slug }}">{{ $sk->slug }}</option>
                      @endforeach
                    </select>
                    <label class="btn btn-ghost btn-sm qv-sub-yukle">Yüklə
                      <input type="file" accept="image/jpeg,image/png,image/webp" hidden>
                    </label>
                  </div>
                </div>
                <div class="qv-sub-on"><span>foto yoxdur</span></div>
              </div>
            </div>
          @endforeach
        </fieldset>
      @else
        {{-- Sənəddə sübut bloku yoxdur. Blok redaktoru bütövlükdə
             qurulmayıb, amma maddi sübutlar istisnadır: onlar məhz
             buradan yazılır, çünki hər əşyanın fotosu var və foto
             yalnız idarə panelindən yüklənə bilər. --}}
        <fieldset class="qv-qrup">
          <legend>Maddi sübutlar</legend>
          <p class="muted qv-komek">Bu sənəddə sübut siyahısı yoxdur.
            Əlavə etsəniz, hər əşya üçün ad, təsvir və foto yeri açılacaq.</p>
          <label class="chk"><input type="checkbox" name="kart_blok" value="1">
            <span>Saxlayanda maddi sübut siyahısı əlavə et</span></label>
        </fieldset>
      @endif
      <fieldset class="qv-qrup">
        <legend>Kilid</legend>

        <label class="chk"><input type="checkbox" name="is_locked" value="1" @checked(old('is_locked', $doc->is_locked))>
          <span>Bu vərəq kodla açılır</span></label>

        <div class="grid2">
          <label class="fld"><span>Kilidin növü</span>
            <select class="input" name="lock_kind">
              @foreach(config('dossier.kilid_novleri') as $k)
                <option value="{{ $k }}" @selected(old('lock_kind', $doc->lock_kind ?: 'reqem') === $k)>{{ config('dossier.kilid_labels')[$k] ?? $k }}</option>
              @endforeach
            </select>
          </label>
          <label class="fld"><span>Kod</span>
            <select class="input" name="unlock_code_id">
              <option value="">— seçilməyib —</option>
              @foreach($kodlar as $k)
                <option value="{{ $k->id }}" @selected((int) old('unlock_code_id', $doc->unlock_code_id) === (int) $k->id)>{{ $k->code }} — {{ $k->label }}</option>
              @endforeach
            </select>
          </label>
        </div>

        <label class="fld"><span>İpucu (oyunçu görür)</span>
          <input class="input" name="lock_hint" maxlength="300" value="{{ old('lock_hint', $doc->lock_hint) }}">
        </label>
      </fieldset>
      <div class="acts">
        <button class="btn" type="submit">Yadda saxla</button>
        <a class="btn btn-ghost btn-sm" href="{{ route('admin.dossier.form', $dossier) }}">Geri</a>
      </div>
    </form>
  </div>

  {{-- ---------- SAĞ: canlı önizləmə ---------- --}}
  <div class="qv-sag">
    <div class="qv-sag-bas">
      <span>Önizləmə</span>
      <span class="qv-hal" id="qvHal">hazır</span>
    </div>
    {{-- ÖNİZLƏMƏ İFRAME-DƏDİR, div-də deyil.

         `dossier.css` oyunun QLOBAL üslub faylıdır: `*`, `body` və `:root`
         seçicilərini yazır. Onu idarə panelinin səhifəsinə yükləmək bütün
         paneli qara fona salır, formaların eni ilə şriftini dəyişir və
         `panel.css`-in üstünə çıxır. Fayla toxunmaq da olmaz — o, oyunun
         özünə aiddir.

         iframe ayrı sənəddir, ona görə iki üslub bir-birini görmür və
         önizləmə oyundakı görkəmin EYNİSİ qalır — sadələşdirilmiş ikinci
         render qatı gec-tez əslindən fərqlənərdi. --}}
    {{-- Yollar KÖK-NİSBİDİR, `asset()` deyil.

         `asset()` linki `APP_URL`-dən qurur; quraşdırmada o, `localhost:8000`
         yazılıb, idarəçi isə `127.0.0.1:8000` ünvanında işləyə bilər. Onda
         iframe üslubu BAŞQA mənbədən istəyir və yükləmə səssizcə uğursuz olur —
         vərəq qapqara görünür. Eyni səbəbdən `viewer.js` avatarı `avatarUrl`
         ilə yox, nisbi yolla çəkir. --}}
    <iframe class="qv-kagiz" id="qvOnizleme" title="Sənədin önizləməsi"
            data-fonts="/assets/dossier-fonts.css"
            data-uslub="/assets/dossier.css"></iframe>
  </div>
</div>

{{-- ---------- ŞƏKİL KİTABXANASI ---------- --}}
<h2 class="sect-h2">Şəkil kitabxanası</h2>
<p class="muted">Şəklin üstünə klikləyin — nişanı mətndə kursorun olduğu yerə yapışdırılacaq.</p>

<div class="qv-kitabxana" id="qvKitabxana">
  @foreach($sekiller as $s)
    {{-- Nişan PHP tərəfdə qurulur: Blade `{{ … }}` ifadəsinin içindəki
         ikinci `}}` ardıcıllığında kəsilir və şablon parse olunmur. --}}
    @php($nisan = \App\Support\Dossier\Isare::yaz('sekil', $s->slug))
    <figure class="qv-sekil" data-nisan="{{ $nisan }}">
      <img src="{{ route('admin.dossier.image', [$s, 'kicik']) }}" alt="{{ $s->slug }}" loading="lazy">
      <figcaption>{{ $s->slug }}</figcaption>
    </figure>
  @endforeach
</div>

<div class="qv-yukle" id="qvYukle">
  <p>Şəkli bura sürüşdürüb atın və ya <label class="qv-sec">seçin<input type="file" id="qvFayl" accept="image/jpeg,image/png,image/webp" hidden></label></p>
</div>

{{-- YÜKLƏMƏ FORMASI — brauzer dialoqu DEYİL.

     Əvvəl üç `prompt()` açılırdı: açar, izah, növ. Onlar səhifəni bloklayır,
     şəkli göstərmir və növün nə demək olduğunu izah etmir — idarəçi boş qutuya
     ingiliscə açar yazmalı idi. Burada isə şəkil dərhal görünür, açar fayl
     adından təklif olunur və növ öz adı ilə seçilir. --}}
<div class="qv-yukle-form" id="qvYukleForm" hidden>
  <div class="qv-yf-bas">Şəkil əlavə et</div>

  <div class="qv-yf-gov">
    <div class="qv-yf-on"><img id="qvYfOn" alt=""></div>

    <div class="qv-yf-sahe">
      <label class="fld"><span>Açar — mətndə nişan kimi işlənəcək</span>
        <input class="input input-sm" id="qvYfSlug" maxlength="60" placeholder="kamera-01">
      </label>

      <label class="fld"><span>İzah — şəklin altında görünür</span>
        <input class="input input-sm" id="qvYfIzah" maxlength="300" placeholder="00:47, giriş qapısı">
      </label>

      <div class="fld"><span>Görkəm</span>
        <div class="qv-yf-nov">
          @foreach(config('dossier.sekil_novleri') as $n)
            <label class="qv-nov-k">
              <input type="radio" name="qvYfNov" value="{{ $n }}" @checked($n === 'generic')>
              <span>{{ config('dossier.sekil_labels')[$n] ?? $n }}</span>
            </label>
          @endforeach
        </div>
      </div>
    </div>
  </div>

  <div class="qv-yf-alt">
    <span class="qv-yukle-hal" id="qvYukleHal"></span>
    <button type="button" class="btn btn-ghost btn-sm" id="qvYfLegv">İmtina</button>
    <button type="button" class="btn btn-sm" id="qvYfOk">Yüklə</button>
  </div>
</div>

@if($sekiller->isNotEmpty())
  <details class="qv-sekil-redakte">
    <summary>Şəkillərin açarını, izahını və növünü dəyiş</summary>
    @foreach($sekiller as $s)
      <form class="qv-sekil-sətir" method="POST" action="{{ route('admin.dossier.image.update', [$dossier, $s]) }}">@csrf
        <img src="{{ route('admin.dossier.image', [$s, 'kicik']) }}" alt="" width="44" height="44">
        <input class="input input-sm" name="slug" maxlength="60" value="{{ $s->slug }}">
        <input class="input input-sm" name="izah" maxlength="300" value="{{ $s->caption }}" placeholder="izah">
        <select class="input input-sm" name="nov">
          @foreach(config('dossier.sekil_novleri') as $n)
            <option value="{{ $n }}" @selected($s->image_type === $n)>{{ config('dossier.sekil_labels')[$n] ?? $n }}</option>
          @endforeach
        </select>
        <select class="input input-sm" name="sahibi">
          <option value="">— ümumi material —</option>
          @foreach($dossier->documents as $d)
            <option value="{{ $d->id }}" @selected((int) $s->owner_document_id === (int) $d->id)>{{ $d->page }} — {{ \Illuminate\Support\Str::limit($d->name, 26) }}</option>
          @endforeach
        </select>
        <button class="btn btn-sm" type="submit">Saxla</button>
        <button class="btn btn-ghost btn-sm" form="sekilSil{{ $s->id }}" type="submit">Sil</button>
      </form>
      <form method="POST" action="{{ route('admin.dossier.image.delete', [$dossier, $s]) }}" id="sekilSil{{ $s->id }}">@csrf</form>
    @endforeach
  </details>
@endif
@endsection

@push('scripts')
<script src="{{ asset('assets/panel-qovluq.js') }}"></script>
@endpush
