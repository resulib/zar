@extends('layouts.panel')
@section('title', $template->exists ? $template->title : 'Yeni şablon')
@section('bar', 'İdarə paneli')
@section('side-title', 'İdarəetmə')
@section('side') @include('partials.admin-nav') @endsection
@section('nav')<a href="{{ route('admin.catalog.templates') }}">Şablonlar</a><a href="{{ url('/') }}">Sayt</a>@endsection
@section('tools')<form method="POST" action="{{ route('admin.logout') }}">@csrf<button class="chip" type="submit">Çıxış</button></form>@endsection

@php
  $linesOf = static function ($value): string {
      return is_array($value) ? implode("\n", $value) : '';
  };
  $jsonOf = static function ($value): string {
      return $value === null || $value === []
          ? ''
          : json_encode($value, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
  };
  $L = config('zarafat.limits');
@endphp

@section('content')
<div class="page-head">
  <div>
    <h1>{{ $template->exists ? $template->title : 'Yeni şablon' }}</h1>
    <div class="sub">
      {{ $template->exists ? $template->slug : 'Kataloqa yeni sənəd növü əlavə olunur' }}
    </div>
  </div>
  <div class="acts"><a class="btn btn-ghost btn-sm" href="{{ route('admin.catalog.templates') }}">Geri</a></div>
</div>

@include('partials.flash')

{{-- Qısa təlimat. Yeni şablonda açıq, mövcud şablonda bağlı gəlir — bir dəfə
     oxuyan admin hər dəfə eyni mətnə baxmasın. --}}
<details class="guide"@if (! $template->exists) open @endif>
  <summary>Bu forma necə işləyir? <span class="mono">(qısa təlimat)</span></summary>
  <div class="guide-body">
    <ol>
      <li><b>Yerləşmə</b> — şablon hansı kateqoriyada, hansı adla və hansı sıra ilə görünür.
        Ton kateqoriyadan gəlir, ayrıca seçilmir.</li>
      <li><b>Blank</b> — sənədin görünüşü. Sənədin növ sözünü (QƏRAR, SERTİFİKAT, TELEQRAM…)
        şablon yox, <b>blank</b> yazır, ona görə başlıq blanka uyğun sözlə bitməlidir.
        Kartın altındakı qeyd hər blankın tələsini göstərir.</li>
      <li><b>Sənədin mətni</b> — şablonun öz mətni. Ziyarətçi bunu dəyişə bilmir;
        aşağıdakı variant siyahıları boşdursa, sənəddə eynilə bu mətn çıxır.</li>
      <li><b>Ziyarətçi seçimləri</b> — açılan siyahılar. <b>Hər siyahının birinci sətri
        defoltdur</b> — kataloq kartında görünən sənəd elə odur.</li>
      <li><b>Anket</b> — sual-cavab forması. Doldurulubsa, redaktorda mətn sahələri əvəzinə
        forma qurulur. <b>Variant siyahıları ilə birlikdə işləmir</b> — biri boş qalmalıdır.</li>
    </ol>
    <p>Sağdakı vərəq canlıdır: hər dəyişiklikdən sonra yenidən çəkilir və altında
      yadda saxlamağa mane olacaq səhvlər sadalanır. Vərəq boş qalırsa, əvvəlcə
      həmin səhvləri düzəldin.</p>
  </div>
</details>

<div class="tpl-edit">
<form method="POST" id="tplForm"
      action="{{ $template->exists ? route('admin.catalog.templates.update', $template) : route('admin.catalog.templates.store') }}">
  @csrf

@if ($aiEnabled)
  {{-- AI köməkçisi. Formanın İÇİNDƏDİR (iç-içə <form> olmaz), amma sahələrin
       `name` atributu yoxdur — şablonla birlikdə serverə getmirlər.
       Cavab heç nə saxlamır, sadəcə aşağıdakı sahələri doldurur. --}}
  <div class="panel ai-panel">
    <div class="panel-head">
      <span class="label">AI ilə hazırla</span>
      <span class="right label mono" id="aiModelName">{{ $aiModel }}</span>
    </div>
    <div class="panel-body">
      <div class="field">
        <label class="label" for="aiBrief">Nə istəyirsiniz?</label>
        <textarea id="aiBrief" class="textarea" rows="3" maxlength="800"
                  placeholder="Gecə saat 2-dən sonra xoruldayan ər üçün lisenziya. Arvad rəsmi şikayət verə bilər, amma yalnız yazılı formada."></textarea>
        <span class="hint">
          Bir-iki cümlə kifayətdir. Kateqoriya, blank və ton yuxarıdakı seçimlərdən götürülür —
          əvvəlcə onları seçin, sonra düyməyə basın.
        </span>
      </div>
      <div class="ai-row">
        <select id="aiMode" class="input" aria-label="Nə doldurulsun">
          <option value="full">Mətn + variant siyahıları</option>
          <option value="metn">Yalnız şablonun mətni</option>
          <option value="variant">Yalnız variant siyahıları</option>
          <option value="anket">Mətn + anket sxemi</option>
        </select>
        <button type="button" class="btn" id="aiRun">Qaralama hazırla</button>
        <span class="ai-state" id="aiState"></span>
      </div>
      <div id="aiMsg"></div>
      <p class="micro" style="margin-top:12px;line-height:1.6">
        Nəticə birbaşa formaya yazılır və <b>heç nə saxlanılmır</b> — vərəqə baxın, əl gəzdirin,
        sonra «Yadda saxla» düyməsinə basın. Modeli
        <a href="{{ route('admin.settings') }}">Parametrlərdən</a> dəyişə bilərsiniz.
      </p>
    </div>
  </div>
@endif

  <div class="panel"@if ($aiEnabled) style="margin-top:16px"@endif>
    <div class="panel-head"><span class="label">1 · Yerləşmə</span></div>
    <div class="panel-body">
      <div class="cols2">
        <div class="field">
          <label class="label" for="title">Başlıq</label>
          <input id="title" class="input" name="title" maxlength="{{ $L['title'] }}" required
                 value="{{ old('title', $template->title) }}" placeholder="Həftəsonu Çölə Çıxma Etibarnaməsi">
          <span class="hint">Kataloq kartında və sənədin üstündə görünür. Rahat oxunması üçün 52 simvoldan qısa saxlayın.</span>
        </div>
        <div class="field">
          <label class="label" for="slug">Açar</label>
          <input id="slug" class="input mono" name="slug" maxlength="40" required pattern="[a-z0-9\-]+"
                 value="{{ old('slug', $template->slug) }}" placeholder="weekend-pass"
                 @if (! $template->exists) data-slug-from="title" @endif>
          <span class="hint">
            Yalnız kiçik latın hərfi, rəqəm və defis.
            @if ($template->exists)
              <b>Mövcud şablonda dəyişdirməyin</b> — yaradılmış sənədlər bu açara bağlıdır.
            @else
              Başlıqdan avtomatik yığılır, istəsəniz düzəldin.
            @endif
          </span>
        </div>
      </div>

      <div class="cols2">
        <div class="field">
          <label class="label" for="category_id">Kateqoriya</label>
          <select id="category_id" class="input" name="category_id" required>
            @foreach ($categories as $c)
              <option value="{{ $c->id }}" data-tone="{{ $c->tone }}" data-reply="{{ $c->is_reply ? '1' : '' }}"
                      @selected((int) old('category_id', $template->category_id) === $c->id)>
                {{ $c->name }}{{ $c->is_reply ? ' · cavab' : '' }} ({{ $c->tone === 'xatire' ? 'xatirə' : 'zarafat' }})
              </option>
            @endforeach
          </select>
          <span class="hint">Ton kateqoriyadan miras alınır — ayrıca seçilmir.</span>
        </div>
        <div class="field">
          <label class="label" for="tag">Etiket <span class="opt">(istəyə bağlı)</span></label>
          <input id="tag" class="input" name="tag" maxlength="40" value="{{ old('tag', $template->tag) }}"
                 placeholder="Ən çox paylaşılan">
          <span class="hint">Kataloq kartının küncündəki kiçik nişan. Boş qala bilər.</span>
        </div>
      </div>

      <div class="cols2">
        <div class="field">
          <label class="label" for="sort">Sıra</label>
          <input id="sort" class="input mono" type="number" name="sort" min="0" max="100000"
                 value="{{ old('sort', $template->sort) }}">
          <span class="hint">Kiçik rəqəm yuxarıda durur. Ara saxlamaq üçün 10-luq addım işlədin.</span>
        </div>
        <div class="field">
          <label class="label">Vəziyyət</label>
          <label class="check switch">
            <input type="checkbox" name="is_active" value="1" @checked(old('is_active', $template->is_active))>
            <span>Saytda görünsün</span>
          </label>
          <span class="hint">Söndürülmüş şablon kataloqda çıxmır, amma bazada qalır — istənilən vaxt qaytarılır.</span>
        </div>
      </div>
    </div>
  </div>

  <div class="panel" style="margin-top:16px">
    <div class="panel-head"><span class="label">2 · Blank və rəng</span></div>
    <div class="panel-body">
      <div class="field">
        <label class="label">Blank</label>
        <div class="pick-grid" role="radiogroup" aria-label="Blank">
          @foreach ($layouts as $l)
            @php($m = $layoutMeta[$l] ?? ['name' => $l, 'type' => '', 'tail' => '', 'note' => ''])
            <label class="pick" data-layout="{{ $l }}">
              <input type="radio" name="layout" value="{{ $l }}" required
                     @checked(old('layout', $template->layout) === $l)>
              <span class="pick-in">
                <span class="pick-name">{{ $m['name'] }}</span>
                <span class="pick-type mono">{{ $m['type'] }}</span>
                <span class="pick-slug mono">{{ $l }}</span>
              </span>
            </label>
          @endforeach
        </div>
        <div class="pick-note" id="layoutNote" aria-live="polite"></div>
      </div>

      <div class="field" style="margin-bottom:0">
        <label class="label">Palitra</label>
        <div class="pick-grid pal" role="radiogroup" aria-label="Palitra">
          @foreach ($palettes as $p)
            @php($m = $paletteMeta[$p] ?? ['name' => $p, 'colors' => ['#fff', '#333', '#999']])
            <label class="pick" data-palette="{{ $p }}">
              <input type="radio" name="palette" value="{{ $p }}" required
                     @checked(old('palette', $template->palette) === $p)>
              <span class="pick-in">
                <span class="pal-swatch" aria-hidden="true">
                  @foreach ($m['colors'] as $col)<i style="background:{{ $col }}"></i>@endforeach
                </span>
                <span class="pick-name">{{ $m['name'] }}</span>
                <span class="pick-slug mono">{{ $p }}</span>
              </span>
            </label>
          @endforeach
        </div>
        <span class="hint">Ziyarətçi saytda hər ikisini dəyişə bilir — buradakı seçim şablonun açılış görünüşüdür.</span>
      </div>
    </div>
  </div>

  <div class="panel" style="margin-top:16px">
    <div class="panel-head"><span class="label">3 · Sənədin mətni</span></div>
    <div class="panel-body">
      <div class="field">
        <label class="label" for="preamble">Giriş cümləsi <span class="opt">(preamble)</span></label>
        <textarea id="preamble" class="textarea" name="preamble" rows="4" maxlength="{{ $L['preamble'] }}" required
                  placeholder="{from} tərəfindən {to} adlı şəxsə …">{{ old('preamble', $template->preamble) }}</textarea>
        <div class="chips" id="phChips" aria-label="Yer tutucular"></div>
        <span class="hint">
          Sənədin ilk abzası. Yuxarıdakı düymələr yer tutucu əlavə edir:
          <code>{to}</code> və <code>{from}</code> ziyarətçinin yazdığı adlarla,
          <code>@{{açar}}</code> isə anket cavabı ilə əvəzlənir. Adlardan ən azı biri olmalıdır.
        </span>
      </div>

      <div class="field">
        <label class="label" for="powers">Bəndlər</label>
        <textarea id="powers" class="textarea mono" name="powers" rows="5" maxlength="{{ $L['powers'] }}" required
                  data-lines="{{ $L['power_lines'] }},{{ \App\Support\TemplateSchema::MAX_POWER_LINE }}"
                  placeholder="Hər bəndi yeni sətirdən yazın">{{ old('powers', $template->powers) }}</textarea>
        <span class="hint">
          Hər sətir bir bənddir — nömrəni özünüz yazmayın, blank qoyur.
          Ən çoxu {{ $L['power_lines'] }} sətir; bəzi blanklar sənəddə cəmi 4-ünü göstərir.
        </span>
      </div>

      <div class="field">
        <label class="label" for="penalty">Cəza bəndi</label>
        <textarea id="penalty" class="textarea" name="penalty" rows="3" maxlength="{{ $L['penalty'] }}" required
                  placeholder="Şərtlər pozulduqda …">{{ old('penalty', $template->penalty) }}</textarea>
        <span class="hint">Sənədin sonundakı «nəticə» cümləsi — zarafatın zərbə sətri adətən buradadır.</span>
      </div>

      <details class="sub-block">
        <summary>Sütun etiketləri <span class="mono">(istəyə bağlı — boş qalsa blankın öz sözləri işlənir)</span></summary>
        <div class="sub-body">
          <div class="cols2">
            <div class="field">
              <label class="label" for="to_label">«Kimə» etiketi</label>
              <input id="to_label" class="input" name="to_label" maxlength="40" value="{{ old('to_label', $template->to_label) }}"
                     placeholder="SƏNƏDİ ALAN">
            </div>
            <div class="field">
              <label class="label" for="from_label">«Kimdən» etiketi</label>
              <input id="from_label" class="input" name="from_label" maxlength="40" value="{{ old('from_label', $template->from_label) }}"
                     placeholder="SƏNƏDİ VERƏN">
            </div>
          </div>
          <div class="cols2">
            <div class="field">
              <label class="label" for="powers_label">Bəndlərin başlığı</label>
              <input id="powers_label" class="input" name="powers_label" maxlength="40" value="{{ old('powers_label', $template->powers_label) }}"
                     placeholder="SƏLAHİYYƏTLƏR">
            </div>
            <div class="field" style="margin-bottom:0">
              <label class="label" for="penalty_label">Cəza bəndinin başlığı</label>
              <input id="penalty_label" class="input" name="penalty_label" maxlength="40" value="{{ old('penalty_label', $template->penalty_label) }}"
                     placeholder="MƏSULİYYƏT">
            </div>
          </div>
        </div>
      </details>
    </div>
  </div>

  <div class="panel" style="margin-top:16px">
    <div class="panel-head"><span class="label">4 · Ziyarətçi seçimləri</span></div>
    <div class="panel-body">
      <p class="note-box">
        Saytda ziyarətçi yalnız adları sərbəst yazır. Başlıq, bəndlər və cəza bəndi
        buradakı variantlardan seçilir. Sahəni boş qoysanız, şablonun yuxarıdakı öz mətni
        <b>dəyişdirilə bilməyən</b> şəkildə göstərilir — sayt beləcə də təhlükəsizdir.
        <br><b>Hər siyahının birinci sətri defoltdur:</b> ziyarətçi heç nə seçməsə sənəddə o çıxır,
        ona görə birinci sətir yuxarıdakı öz mətni ilə eyni olmalıdır.
      </p>

      <div class="field">
        <label class="label" for="title_options">Başlıq variantları</label>
        <textarea id="title_options" class="textarea mono" name="title_options" rows="4" spellcheck="false"
                  data-lines="{{ \App\Support\TemplateSchema::MAX_TITLE_OPTS }},{{ $L['title'] }}"
                  data-first="title"
                  placeholder="Hər sətir bir variant">{{ old('title_options', $linesOf($template->title_options)) }}</textarea>
        <span class="hint">Ən çoxu {{ \App\Support\TemplateSchema::MAX_TITLE_OPTS }} sətir × {{ $L['title'] }} simvol. Təkrar sətirlər atılır.</span>
      </div>

      <div class="field">
        <label class="label" for="powers_options">Bənd variantları</label>
        <textarea id="powers_options" class="textarea mono" name="powers_options" rows="8" spellcheck="false"
                  data-lines="{{ \App\Support\TemplateSchema::MAX_POWER_OPTS }},{{ \App\Support\TemplateSchema::MAX_POWER_LINE }}"
                  data-first="powers"
                  placeholder="Hər sətir bir bənd">{{ old('powers_options', $linesOf($template->powers_options)) }}</textarea>
        <span class="hint">
          Ən çoxu {{ \App\Support\TemplateSchema::MAX_POWER_OPTS }} sətir × {{ \App\Support\TemplateSchema::MAX_POWER_LINE }} simvol.
          İlk «ən çoxu seçilən» qədər sətir açılışda işarəli gəlir — onlar yuxarıdakı bəndlərlə eyni olmalıdır.
        </span>
      </div>

      <div class="cols2">
        <div class="field">
          <label class="label" for="powers_min">Ən azı seçilən</label>
          <input id="powers_min" class="input mono" type="number" name="powers_min"
                 min="1" max="{{ \App\Support\TemplateSchema::MAX_PICK }}"
                 value="{{ old('powers_min', $template->powers_min ?? 1) }}">
          <span class="hint">Ziyarətçi bundan az bənd qoya bilməz.</span>
        </div>
        <div class="field">
          <label class="label" for="powers_max">Ən çoxu seçilən</label>
          <input id="powers_max" class="input mono" type="number" name="powers_max"
                 min="1" max="{{ \App\Support\TemplateSchema::MAX_PICK }}"
                 value="{{ old('powers_max', $template->powers_max ?? \App\Support\TemplateSchema::MAX_PICK) }}">
          <span class="hint">
            Ən çoxu {{ \App\Support\TemplateSchema::MAX_PICK }} — bəzi blanklar sənəddə yalnız
            {{ \App\Support\TemplateSchema::MAX_PICK }} bənd göstərir, ziyarətçi isə blankı dəyişə bilir.
          </span>
        </div>
      </div>

      <div class="field" style="margin-bottom:0">
        <label class="label" for="penalty_options">Cəza bəndi variantları</label>
        <textarea id="penalty_options" class="textarea mono" name="penalty_options" rows="5" spellcheck="false"
                  data-lines="{{ \App\Support\TemplateSchema::MAX_PENALTY_OPTS }},{{ $L['penalty'] }}"
                  data-first="penalty"
                  placeholder="Hər sətir bir variant">{{ old('penalty_options', $linesOf($template->penalty_options)) }}</textarea>
        <span class="hint">Ən çoxu {{ \App\Support\TemplateSchema::MAX_PENALTY_OPTS }} sətir × {{ $L['penalty'] }} simvol.</span>
      </div>
    </div>
  </div>

  <div class="panel" style="margin-top:16px">
    <div class="panel-head">
      <span class="label">5 · Anket <span class="opt">(istəyə bağlı)</span></span>
      <span class="right label mono" id="fbCount">0 sahə</span>
    </div>
    <div class="panel-body">
      <p class="note-box">
        Anket doldurulubsa, redaktorda azad mətn sahələri əvəzinə forma qurulur və sənəd
        cavablardan yığılır. Boş qoysanız şablon adi mətn şablonu kimi işləyir.
        <br>Cədvəl, işarə siyahısı və şkala blokları yalnız <b>Viza</b> və <b>Ekspertiza rəyi</b>
        blanklarında görünür; digər blanklarda cavablar giriş cümləsinə və bəndlərə düşür —
        ona görə vacib dəyərləri giriş cümləsinə <code>@{{açar}}</code> ilə də yazın.
      </p>

      <div id="fbList" class="fb-list"></div>
      <div id="fbErr" class="fb-err" hidden></div>

      <div class="fb-add">
        <label class="label" for="fbType">Yeni sahə</label>
        <div class="fb-add-row">
          <select id="fbType" class="input"></select>
          <button type="button" class="btn btn-ghost btn-sm" id="fbAdd">+ Sahə əlavə et</button>
        </div>
        <span class="hint" id="fbTypeHint"></span>
      </div>

      <details class="sub-block" id="fieldsRaw">
        <summary>JSON mətni <span class="mono">(mütəxəssislər üçün — kartlar bunu yazır)</span></summary>
        <div class="sub-body">
          <div class="field" style="margin-bottom:0">
            <textarea id="fields" class="textarea mono" name="fields" rows="12" spellcheck="false"
                      placeholder='[{"k": "teyinat", "t": "select", "label": "Təyinat yeri", "row": "TƏYİNAT YERİ", "opts": ["Çayxana", "Mangal"]}]'>{{ old('fields', $jsonOf($template->fields)) }}</textarea>
            <span class="hint">
              Burada edilən düzəliş dərhal kartlara oxunur. JSON pozulubsa kartlar yenilənmir —
              səhv mətnin altında yazılır. İcazəli tiplər: <code>{{ implode('</code> · <code>', $types) }}</code>.
            </span>
          </div>
        </div>
      </details>
    </div>
  </div>

  <div class="panel" style="margin-top:16px">
    <div class="panel-head"><span class="label">6 · Qeydlər və ləğv</span></div>
    <div class="panel-body">
      <div class="cols2">
        <div class="field">
          <label class="label" for="notes">Qeydlər <span class="opt">(hər sətir bir qeyd)</span></label>
          <textarea id="notes" class="textarea" name="notes" rows="6" spellcheck="false"
                    data-lines="{{ \App\Support\TemplateSchema::MAX_NOTES }},{{ \App\Support\TemplateSchema::MAX_NOTE_LEN }}"
                    placeholder="Sənəd yalnız göstərilən müddətdə qüvvədədir.&#10;Nüsxə çıxarmaq qadağandır.">{{ old('notes', $linesOf($template->notes)) }}</textarea>
          <span class="hint">
            Viza və ekspertiza blanklarında nömrələnmiş bəndlər kimi çıxır.
            Ən çoxu {{ \App\Support\TemplateSchema::MAX_NOTES }} sətir × {{ \App\Support\TemplateSchema::MAX_NOTE_LEN }} simvol.
            İçində <code>@{{açar}}</code> işlədilə bilər.
          </span>
        </div>
        <div class="field">
          <label class="label" for="cancel_reasons">Ləğv səbəbləri <span class="opt">(hər sətir bir səbəb)</span></label>
          <textarea id="cancel_reasons" class="textarea" name="cancel_reasons" rows="6" spellcheck="false"
                    data-lines="8,120"
                    placeholder="Cavabsız zəng&#10;Gec qayıtdı">{{ old('cancel_reasons', $linesOf($template->cancel_reasons)) }}</textarea>
          <span class="hint">
            Sənədin sahibi onu vaxtından əvvəl ləğv edərkən bu siyahıdan seçir.
            Yalnız müddəti olan (anketdə <b>expiry</b> sahəsi işarələnmiş) şablonda mənalıdır.
          </span>
        </div>
      </div>
    </div>
  </div>

  <div class="panel" style="margin-top:16px">
    <div class="panel-head"><span class="label">7 · İmza, paylaşım və nömrə</span></div>
    <div class="panel-body">
      <div class="cols2">
        <div class="field">
          <label class="label" for="sign_org">İmzalayan orqan</label>
          <input id="sign_org" class="input" name="sign_org" maxlength="56"
                 value="{{ old('sign_org', $template->sign_org) }}" placeholder="Miqrasiya və Çöl İşləri Baş İdarəsi">
          <span class="hint">
            Sənədin başlığının altındakı sətir. <b>Uydurma olmalıdır</b> — həqiqi nazirlik,
            komitə və ya notariat adı yazmaq olmaz. Ən çoxu 56 simvol.
          </span>
        </div>
        <div class="field">
          <label class="label" for="sign_title">İmza vəzifəsi</label>
          <input id="sign_title" class="input" name="sign_title" maxlength="40"
                 value="{{ old('sign_title', $template->sign_title) }}" placeholder="Baş İnspektor">
          <span class="hint">İmza xəttinin altındakı vəzifə. Boş qalsa blankın öz sözü işlənir.</span>
        </div>
      </div>

      <div class="cols2">
        <div class="field">
          <label class="label" for="share">Paylaşım mətni</label>
          <input id="share" class="input" name="share" maxlength="{{ \App\Support\TemplateSchema::MAX_SHARE_LEN }}"
                 value="{{ old('share', $template->share) }}" placeholder="Nəhayət rəsmiləşdirdim 🛂">
          <span class="hint">
            Ödənişdən sonra «Paylaşım mətnini kopyala» düyməsi ilə verilir.
            <code>@{{açar}}</code> işlədilə bilər.
          </span>
        </div>
        <div class="field">
          <label class="label" for="reg_prefix">Qeydiyyat prefiksi</label>
          <input id="reg_prefix" class="input mono" name="reg_prefix" maxlength="4" pattern="[A-Z]{2,4}"
                 value="{{ old('reg_prefix', $template->reg_prefix) }}" placeholder="CCV">
          <span class="hint">
            2–4 <b>böyük latın</b> hərfi — nömrə QR kodun ünvanına düşür, ona görə <code>Ə</code>,
            <code>Ç</code>, <code>Ş</code> olmaz. Boş qalsa qlobal <code>{{ config('zarafat.reg_prefix') }}</code>.
          </span>
        </div>
      </div>

      {{-- Cavab qatı. Yalnız cavab kateqoriyası seçildikdə mənalıdır;
           görünürlüyü aşağıdakı skript `data-reply` atributuna görə idarə edir. --}}
      <div class="field" id="replyKindField">
        <label class="label" for="reply_kind">Cavab niyyəti</label>
        <select id="reply_kind" class="input" name="reply_kind">
          <option value="">— cavab şablonu deyil —</option>
          @foreach ($replyKinds as $k => $label)
            <option value="{{ $k }}" @selected(old('reply_kind', $template->reply_kind) === $k)>{{ $label }}</option>
          @endforeach
        </select>
        <span class="hint">
          Dolu olan şablon ana kataloqdan çıxır və yalnız «Cavab ver» axınında görünür.
          Cavab kateqoriyasındakı hər şablonda seçilməlidir.
        </span>
      </div>
      <div class="field" id="replyCatsField" style="margin-bottom:0">
        <label class="label">Hansı kateqoriyalara cavab verir</label>
        @php($chosen = old('reply_cats', $template->reply_cats ?? []))
        <div class="opt-grid">
          @foreach ($replyTargets as $rt)
            <label class="check">
              <input type="checkbox" name="reply_cats[]" value="{{ $rt->slug }}"
                     @checked(in_array($rt->slug, (array) $chosen, true))>
              <span>{{ $rt->name }} <small class="mono">{{ $rt->tone }}</small></span>
            </label>
          @endforeach
        </div>
        <span class="hint">
          Heç biri seçilməsə şablon <b>universaldır</b> — mövzuya uyğun cavab tapılmayanda
          ehtiyat kimi çıxır. Hər niyyətin ən azı bir universal şablonu olmalıdır.
        </span>
      </div>
    </div>
  </div>

  <div class="save-bar">
    <button class="btn" type="submit">Yadda saxla</button>
    <a class="btn btn-ghost" href="{{ route('admin.catalog.templates') }}">İmtina</a>
    <span class="save-state" id="saveState"></span>
  </div>
</form>

<div class="tpl-preview">
  <div class="panel">
    <div class="panel-head">
      <span class="label">Canlı önizləmə</span>
      <span class="right label mono" id="prevReg">—</span>
    </div>
    <div class="prev-bar">
      <label class="check"><input type="checkbox" id="prevPaid"><span>Ödənişli</span></label>
      <label class="check"><input type="checkbox" id="prevVerified"><span>Reyestr təsdiqi</span></label>
    </div>
    <div class="panel-body">
      <div class="sheet-wrap"><div class="paper" id="prevDoc"></div></div>
    </div>
    <div id="prevMsg"></div>
  </div>
  <p class="micro" style="margin-top:10px;line-height:1.6">
    Ad sahələri nümunə adlarla doldurulur. Anket sahələri üçün hər sahənin defolt
    (və ya ilk) dəyəri götürülür — ziyarətçi başqa seçim edə bilər.
  </p>
</div>
</div>

@if ($template->exists)
  <div class="acts" style="margin-top:16px">
    <form method="POST" action="{{ route('admin.catalog.templates.duplicate', $template) }}">@csrf
      <button class="btn btn-ghost btn-sm" type="submit">Nüsxə çıxar</button>
    </form>
    <form method="POST" action="{{ route('admin.catalog.templates.delete', $template) }}">@csrf
      <button class="btn btn-danger btn-sm" type="submit">Şablonu sil</button>
    </form>
  </div>
  <p class="micro" style="margin-top:10px">
    Silmək əvəzinə söndürmək daha təhlükəsizdir: bu şablonla yaradılmış sənədlər reyestrdə qalır.
  </p>
@endif
@endsection

@push('scripts')
<script src="{{ asset('assets/qr.js') }}"></script>
<script src="{{ asset('assets/doc.js') }}"></script>
<script>
/* Şablon redaktoru — admin paneli.

   Üç hissədən ibarətdir və hamısı EYNİ formanı oxuyur:
     1) erqonomika  — sayğaclar, açarın avtomatik yığılması, blank qeydi
     2) anket qurucusu — kartlar ⇄ `#fields` JSON sahəsi (JSON hələ də mənbədir)
     3) canlı önizləmə — saytdakı `formDoc()` ilə eyni məntiq

   Qurucu JSON-u ƏVƏZ ETMİR, onu yazır: server hər halda `TemplateSchema`-dan
   keçirir, ona görə kartlar sadəcə rahat yazı üsuludur. */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var form = $('tplForm');
  if (!form) return;

  var TYPES       = @json($types);
  var LAYOUT_META = @json($layoutMeta);
  var MAX_PICK    = {{ \App\Support\TemplateSchema::MAX_PICK }};
  var LIM         = @json($L);

  var TO = 'Günel Şəkərova', FROM = 'Elvin Məmmədov';

  /* ==================== ümumi köməkçilər ==================== */

  function esc(t) {
    return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function lines(v) {
    return String(v == null ? '' : v).split(/\r?\n/)
      .map(function (l) { return l.trim(); }).filter(Boolean);
  }
  /* Radio qrupu da, select də eyni yolla oxunur. */
  function val(name) {
    var el = form.elements[name];
    return el && el.value != null ? el.value : '';
  }
  /* Azərbaycan hərflərini ASCII açara çevirir: «Təyinat yeri» → «teyinat_yeri».
     `İ`/`ı` üçün ayrıca xəritə lazımdır — NFD onları parçalamır. */
  function azSlug(s, sep) {
    sep = sep || '-';
    var out = String(s == null ? '' : s).toLowerCase()
      .replace(/ə/g, 'e').replace(/ı/g, 'i')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, sep);
    while (out.charAt(0) === sep) out = out.slice(1);
    while (out.charAt(out.length - 1) === sep) out = out.slice(0, -1);
    return out;
  }

  /* ==================== 1 · erqonomika ==================== */

  /* Simvol sayğacı — `maxlength` olan hər sahəyə özü qoşulur. */
  Array.prototype.forEach.call(form.querySelectorAll('input[maxlength], textarea[maxlength]'), function (el) {
    var max = parseInt(el.getAttribute('maxlength'), 10);
    if (!max) return;
    var out = document.createElement('span');
    out.className = 'cnt';
    el.parentNode.insertBefore(out, el.nextSibling);
    function up() {
      var n = el.value.length;
      out.textContent = n + ' / ' + max;
      out.className = 'cnt' + (n >= max ? ' bad' : (n > max * 0.9 ? ' warn' : ''));
    }
    el.addEventListener('input', up);
    up();
  });

  /* Sətir sayğacı — «hər sətir bir bənd» tipli sahələr üçün. */
  Array.prototype.forEach.call(form.querySelectorAll('[data-lines]'), function (el) {
    var p = el.getAttribute('data-lines').split(',');
    var maxN = parseInt(p[0], 10), maxL = parseInt(p[1], 10);
    var out = document.createElement('div');
    out.className = 'lines-cnt';
    el.parentNode.insertBefore(out, el.nextSibling);
    function up() {
      var ls = lines(el.value), longest = 0, over = 0, i;
      for (i = 0; i < ls.length; i++) {
        if (ls[i].length > longest) longest = ls[i].length;
        if (ls[i].length > maxL) over++;
      }
      var bad = ls.length > maxN || over > 0;
      out.className = 'lines-cnt' + (bad ? ' bad' : '');
      out.textContent = ls.length + ' / ' + maxN + ' sətir · ən uzun sətir ' + longest + ' / ' + maxL +
        (over ? ' · ' + over + ' sətir hədi aşır' : '');
    }
    el.addEventListener('input', up);
    up();
  });

  /* Yeni şablonda açar başlıqdan yığılır; admin əl gəzdirən kimi dayanır.
     Başlığı AI də doldura bilir, ona görə açar dəyişəndə `input` atılır —
     sayğac və önizləmə yenilənsin. `self` bayrağı olmasa həmin hadisə
     avtomatik doldurmanı öz-özünə «əl ilə yazıldı» sayardı. */
  (function () {
    var slug = form.querySelector('[data-slug-from]');
    if (!slug) return;
    var src = $(slug.getAttribute('data-slug-from')), locked = false, self = false;
    slug.addEventListener('input', function () { if (!self) locked = true; });
    src.addEventListener('input', function () {
      if (locked) return;
      self = true;
      slug.value = azSlug(src.value, '-').slice(0, 40).replace(/-+$/, '');
      slug.dispatchEvent(new Event('input', { bubbles: true }));
      self = false;
    });
  })();

  /* Blank kartının altındakı qeyd: sənədə hansı növ sözünü yazır, başlıq nə ilə
     bitməlidir, hansı tələsi var. */
  function layoutNote() {
    var m = LAYOUT_META[val('layout')];
    var box = $('layoutNote');
    if (!m) { box.innerHTML = ''; return; }
    var h = '<b>' + esc(m.name) + '</b> — sənədə «' + esc(m.type) + '» sözünü yazır. ' +
      'Başlıq bu sözlərdən biri ilə bitməlidir: <span class="mono">' + esc(m.tail) + '</span>.';
    if (m.note) h += '<span class="pick-warn">' + esc(m.note) + '</span>';
    box.innerHTML = h;
  }
  form.addEventListener('change', function (e) {
    if (e.target.name === 'layout') layoutNote();
  });
  layoutNote();

  /* Cavab sahələri yalnız cavab kateqoriyasında mənalıdır. Bu, sadəcə
     görünürlükdür — həqiqi kilid `CatalogController::templateSave()`-dədir. */
  function syncReply() {
    var opt = $('category_id').selectedOptions[0];
    var isReply = !!(opt && opt.getAttribute('data-reply'));
    $('replyKindField').hidden = !isReply;
    $('replyCatsField').hidden = !isReply;
    if (!isReply) $('reply_kind').value = '';
  }
  $('category_id').addEventListener('change', syncReply);
  syncReply();

  /* Yadda saxlanmamış dəyişiklik göstəricisi. */
  var dirty = false;
  form.addEventListener('input', function (e) {
    /* AI briefi kimi köməkçi sahələrin `name`-i yoxdur — serverə getmirlər,
       deməli şablonu da «dəyişmiş» etmirlər. */
    if (dirty || !e.target.name) return;
    dirty = true;
    $('saveState').textContent = 'Yadda saxlanmamış dəyişiklik var.';
  });
  form.addEventListener('submit', function () { dirty = false; });

  /* ==================== 2 · anket qurucusu ==================== */

  /* [açar, ad, izah, əsas parametrlər] */
  var FT = [
    ['text',     'Mətn',              'Bir sətir sərbəst yazı'],
    ['select',   'Siyahıdan seçim',   'Hazır variantlardan biri seçilir'],
    ['multi',    'Çoxlu seçim',       'Bir neçə bənd işarələnir'],
    ['list',     'Ad siyahısı',       'Ziyarətçi bir neçə ad əlavə edir'],
    ['scale',    'Şkala',             'Sürüşdürücü — 0-dan 10-a qədər'],
    ['number',   'Rəqəm',             'Tam ədəd'],
    ['time',     'Saat',              'HH:MM formatında saat'],
    ['date',     'Tarix',             'Təqvimdən gün'],
    ['datetime', 'Tarix və saat',     'Gün və saat birlikdə']
  ];
  function ftName(t) {
    for (var i = 0; i < FT.length; i++) if (FT[i][0] === t) return FT[i][1];
    return t;
  }
  function ftHint(t) {
    for (var i = 0; i < FT.length; i++) if (FT[i][0] === t) return FT[i][2];
    return '';
  }

  var raw = $('fields'), host = $('fbList'), fbErr = $('fbErr');
  var MODEL = [], writing = false;

  /* Açarı hələ də etiketdən yığılan sahələr. Kart indeksi köçmə/silmə ilə
     sürüşdüyü üçün sahənin ÖZÜ yadda saxlanılır. JSON-dan gələn sahələr
     buraya düşmür — orada açar qəsdən seçilmiş olur və yer tutucular ona
     bağlıdır. */
  var AUTOKEY = new WeakSet();

  /* Serializasiya sırası — JSON insan üçün oxunaqlı qalsın. */
  var ORDER = ['k', 't', 'label', 'row', 'opts', 'min', 'max', 'def', 'count',
               'unit', 'hint', 'into', 'auto', 'hide', 'person', 'up', 'free', 'expiry'];

  function prune(f) {
    var o = {}, i, k, v;
    for (i = 0; i < ORDER.length; i++) {
      k = ORDER[i];
      v = f[k];
      if (v === undefined || v === null || v === '' ) continue;
      if (Array.isArray(v) && !v.length) continue;
      if (v === false) continue;
      o[k] = v;
    }
    /* Sxemdə yeri olmayan açarlar da itməsin (JSON-dan yapışdırılıb ola bilər). */
    for (k in f) {
      if (Object.prototype.hasOwnProperty.call(f, k) && ORDER.indexOf(k) < 0 &&
          f[k] !== undefined && f[k] !== null && f[k] !== '') o[k] = f[k];
    }
    return o;
  }

  function readRaw() {
    var v = (raw.value || '').trim();
    if (!v || v === 'null' || v === '[]') return [];
    try {
      var a = JSON.parse(v);
      return Array.isArray(a) ? a : null;
    } catch (e) { return null; }
  }

  /* JSON → kartlar. Pozuq JSON kartları SİLMİR — admin yazdığını itirməsin. */
  function load() {
    var a = readRaw();
    if (a === null) {
      fbErr.hidden = false;
      fbErr.textContent = 'JSON oxunmadı — kartlar yenilənmədi. «JSON mətni» bölməsindəki səhvi düzəldin.';
      return;
    }
    fbErr.hidden = true;
    MODEL = a;
    draw();
  }

  /* Kartlar → JSON. `input` hadisəsi formaya qalxır və önizləməni yeniləyir. */
  function sync() {
    writing = true;
    raw.value = MODEL.length ? JSON.stringify(MODEL.map(prune), null, 2) : '';
    raw.dispatchEvent(new Event('input', { bubbles: true }));
    writing = false;
    chips();
    $('fbCount').textContent = MODEL.length + ' sahə';
  }

  function uniqKey(base, skip) {
    var k = base || 'sahe', n = 2, taken = {};
    MODEL.forEach(function (f, i) { if (i !== skip && f.k) taken[f.k] = 1; });
    var out = k;
    while (taken[out]) out = k + '_' + (n++);
    return out.slice(0, 20);
  }

  function optRow(label, prop, v, extra) {
    return '<label class="fb-f"><span>' + esc(label) + '</span>' +
      '<input class="input" data-p="' + prop + '"' + (extra || '') +
      ' value="' + esc(v == null ? '' : v) + '"></label>';
  }
  function numRow(label, prop, v, extra) {
    return '<label class="fb-f"><span>' + esc(label) + '</span>' +
      '<input class="input mono" type="number" data-p="' + prop + '" data-num="1"' + (extra || '') +
      ' value="' + (v === undefined || v === null || v === '' ? '' : esc(v)) + '"></label>';
  }
  function listRow(label, prop, v, rows, ph) {
    return '<label class="fb-f wide"><span>' + esc(label) + '</span>' +
      '<textarea class="textarea mono" rows="' + (rows || 4) + '" data-p="' + prop + '" data-list="1"' +
      ' placeholder="' + esc(ph || 'Hər sətir bir variant') + '">' +
      esc((v || []).join('\n')) + '</textarea></label>';
  }
  function chk(label, prop, on, title) {
    return '<label class="check fb-c"' + (title ? ' title="' + esc(title) + '"' : '') + '>' +
      '<input type="checkbox" data-p="' + prop + '"' + (on ? ' checked' : '') + '>' +
      '<span>' + esc(label) + '</span></label>';
  }
  function sel(label, prop, v, opts) {
    return '<label class="fb-f"><span>' + esc(label) + '</span><select class="input" data-p="' + prop + '">' +
      opts.map(function (o) {
        return '<option value="' + esc(o[0]) + '"' + (String(v == null ? '' : v) === o[0] ? ' selected' : '') +
          '>' + esc(o[1]) + '</option>';
      }).join('') + '</select></label>';
  }

  function cardHtml(f, i) {
    var t = f.t || 'text', body = '', h = '';

    h += '<div class="fb-card" data-i="' + i + '">';
    h += '<div class="fb-head">';
    h += '<span class="fb-n">' + (i + 1) + '</span>';
    h += '<select class="input fb-type" data-p="t" aria-label="Sahə tipi">' +
      FT.map(function (x) {
        return '<option value="' + x[0] + '"' + (x[0] === t ? ' selected' : '') + '>' + esc(x[1]) + '</option>';
      }).join('') + '</select>';
    h += '<input class="input fb-label" data-p="label" placeholder="Sual — məsələn «Təyinat yeri»" value="' +
      esc(f.label || '') + '">';
    h += '<span class="fb-key mono" title="Giriş cümləsində bu açarla işlənir">' +
      esc('@{{' + (f.k || '?') + '}}') + '</span>';
    h += '<span class="fb-btns">' +
      '<button type="button" class="btn-mini" data-act="up" title="Yuxarı" aria-label="Yuxarı">↑</button>' +
      '<button type="button" class="btn-mini" data-act="down" title="Aşağı" aria-label="Aşağı">↓</button>' +
      '<button type="button" class="btn-mini danger" data-act="del" title="Sil" aria-label="Sil">×</button>' +
      '</span>';
    h += '</div>';

    /* --- tipə görə əsas parametrlər --- */
    if (t === 'select') {
      body += listRow('Variantlar', 'opts', f.opts, 4, 'Çayxana\nMangal\nToy');
      body += chk('«Özün yaz…» variantı da olsun', 'free', !!f.free,
        'Ziyarətçi siyahıda olmayan cavab yaza bilər.');
    } else if (t === 'multi') {
      body += listRow('Variantlar', 'opts', f.opts, 5, 'Qab yumaq\nSəhər durmaq');
      body += numRow('Ən azı seçilir', 'min', f.min, ' min="1"');
      body += numRow('Ən çoxu seçilir', 'max', f.max, ' min="1"');
    } else if (t === 'scale') {
      body += numRow('Ən kiçik', 'min', f.min, ' min="0" max="10"');
      body += numRow('Ən böyük', 'max', f.max, ' min="1" max="10"');
    } else if (t === 'number') {
      body += numRow('Ən kiçik', 'min', f.min);
      body += numRow('Ən böyük', 'max', f.max);
      body += optRow('Vahid (sənəddə rəqəmdən sonra)', 'unit', f.unit, ' maxlength="12" placeholder="saat"');
    } else if (t === 'list') {
      body += numRow('Ən çoxu neçə ad', 'count', f.count, ' min="1" max="8"');
      body += numRow('Bir adın uzunluğu', 'max', f.max, ' min="1" max="60"');
    } else if (t === 'text') {
      body += numRow('Ən çoxu neçə simvol', 'max', f.max, ' min="1" max="120"');
      body += chk('Ad sahəsidir', 'person', !!f.person, 'Yalnız hərf, boşluq, defis və apostrof qəbul olunur.');
    }

    if (body) h += '<div class="fb-body">' + body + '</div>';

    /* --- əlavə tənzimləmələr --- */
    var adv = '';
    adv += optRow('Cədvəl sətrinin adı', 'row', f.row, ' maxlength="40" placeholder="' + esc(f.label || 'TƏYİNAT YERİ') + '"');
    if (t === 'multi' || t === 'list') adv += listRow('Defolt cavab', 'def', f.def, 3, 'Boş qala bilər');
    else if (t === 'scale' || t === 'number') adv += numRow('Defolt cavab', 'def', f.def);
    else adv += optRow('Defolt cavab', 'def', f.def, ' maxlength="60"' +
      (t === 'time' ? ' placeholder="now və ya +3h"' : ''));
    adv += optRow('Sahənin altındakı ipucu', 'hint', f.hint, ' maxlength="120"');
    adv += optRow('Açar', 'k', f.k, ' maxlength="20" pattern="[a-z0-9_]+"');
    adv += sel('Cavabı hara yazsın', 'into', f.into, [
      ['', '— heç yerə, yalnız cədvələ —'], ['to', '«Kimə» adına'], ['from', '«Kimdən» adına'], ['title', 'Sənədin başlığına']
    ]);
    if (t === 'time' || t === 'number') {
      adv += sel('Etibarlılıq müddəti', 'expiry', f.expiry === true ? 'true' : (f.expiry || ''),
        t === 'time' ? [['', '— yox —'], ['true', 'Bəli, bu saata qədər']]
                     : [['', '— yox —'], ['hours', 'Bəli, bu qədər saat']]);
    }
    adv += optRow('Sabit dəyər (soruşulmur)', 'auto', f.auto, ' maxlength="60"');
    adv += '<div class="fb-checks">' +
      chk('Cədvəldə göstərmə', 'hide', !!f.hide, 'Cavab yalnız giriş cümləsində işlənir.') +
      chk('BÖYÜK HƏRFLƏ', 'up', !!f.up) +
      '</div>';

    h += '<details class="fb-adv"><summary>Əlavə tənzimləmələr</summary><div class="fb-body">' + adv + '</div></details>';
    h += '</div>';
    return h;
  }

  function draw() {
    if (!MODEL.length) {
      host.innerHTML = '<div class="fb-empty">Anket sahəsi yoxdur — şablon adi mətn şablonu kimi işləyir. ' +
        'Ziyarətçiyə sual vermək istəyirsinizsə, aşağıdan sahə əlavə edin.</div>';
    } else {
      host.innerHTML = MODEL.map(cardHtml).join('');
    }
    $('fbCount').textContent = MODEL.length + ' sahə';
    chips();
  }

  function cardIndex(el) {
    var c = el.closest ? el.closest('.fb-card') : null;
    return c ? parseInt(c.getAttribute('data-i'), 10) : -1;
  }

  function setProp(f, p, el) {
    var v;
    if (el.type === 'checkbox') v = el.checked ? true : null;
    else if (el.getAttribute('data-num')) {
      v = el.value.trim() === '' ? null : parseInt(el.value, 10);
      if (isNaN(v)) v = null;
    } else if (el.getAttribute('data-list')) {
      v = lines(el.value);
      if (!v.length) v = null;
    } else {
      v = el.value.trim() === '' ? null : el.value.trim();
    }
    if (p === 'expiry') v = el.value === 'true' ? true : (el.value === 'hours' ? 'hours' : null);
    if (v === null) delete f[p]; else f[p] = v;
  }

  host.addEventListener('input', function (e) {
    var el = e.target, p = el.getAttribute && el.getAttribute('data-p');
    if (!p || el.type === 'checkbox' || el.tagName === 'SELECT') return;
    var i = cardIndex(el), f = MODEL[i];
    if (!f) return;

    if (p === 'label') {
      /* Açar əl ilə dəyişdirilməyibsə etiketlə birlikdə gedir. */
      var wasAuto = !f.k || AUTOKEY.has(f) || f.k === azSlug(f.label || '', '_');
      f.label = el.value.trim() === '' ? undefined : el.value;
      if (wasAuto) {
        f.k = uniqKey(azSlug(f.label || '', '_') || 'sahe', i);
        var kIn = el.closest('.fb-card').querySelector('[data-p="k"]');
        if (kIn) kIn.value = f.k;
        var chip = el.closest('.fb-card').querySelector('.fb-key');
        if (chip) chip.textContent = '@{{' + f.k + '}}';
      }
    } else {
      setProp(f, p, el);
      if (p === 'k') {
        AUTOKEY.delete(f);          /* admin açarı özü yazdı — artıq izlənmir */
        f.k = azSlug(el.value, '_').slice(0, 20);
        var chip2 = el.closest('.fb-card').querySelector('.fb-key');
        if (chip2) chip2.textContent = '@{{' + (f.k || '?') + '}}';
      }
    }
    sync();
  });

  host.addEventListener('change', function (e) {
    var el = e.target, p = el.getAttribute && el.getAttribute('data-p');
    if (!p) return;
    var i = cardIndex(el), f = MODEL[i];
    if (!f) return;

    if (p === 't') {
      /* Tip dəyişəndə tipə bağlı parametrlər mənasını itirir. */
      var keep = { k: f.k, t: el.value, label: f.label, row: f.row, hint: f.hint,
                   into: f.into, hide: f.hide, up: f.up, auto: f.auto };
      MODEL[i] = keep;
      if (AUTOKEY.has(f)) AUTOKEY.add(keep);
      if (el.value === 'multi') { keep.opts = f.opts || []; keep.min = 1; keep.max = Math.max(1, (f.opts || []).length || 1); }
      if (el.value === 'select') keep.opts = f.opts || [];
      if (el.value === 'scale') { keep.min = 1; keep.max = 10; }
      sync();
      draw();
      return;
    }
    if (el.type === 'checkbox' || el.tagName === 'SELECT') {
      setProp(f, p, el);
      sync();
    }
  });

  host.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('[data-act]') : null;
    if (!b) return;
    var i = cardIndex(b), act = b.getAttribute('data-act');
    if (i < 0) return;
    if (act === 'del') {
      if (!window.confirm('«' + (MODEL[i].label || MODEL[i].k || 'Sahə') + '» silinsin?')) return;
      MODEL.splice(i, 1);
    } else if (act === 'up' && i > 0) {
      MODEL.splice(i - 1, 0, MODEL.splice(i, 1)[0]);
    } else if (act === 'down' && i < MODEL.length - 1) {
      MODEL.splice(i + 1, 0, MODEL.splice(i, 1)[0]);
    } else return;
    sync();
    draw();
  });

  /* Yeni sahə */
  $('fbType').innerHTML = FT.map(function (x) {
    return '<option value="' + x[0] + '">' + esc(x[1]) + '</option>';
  }).join('');
  function typeHint() { $('fbTypeHint').textContent = ftHint($('fbType').value); }
  $('fbType').addEventListener('change', typeHint);
  typeHint();

  $('fbAdd').addEventListener('click', function () {
    var t = $('fbType').value;
    var f = { k: uniqKey(azSlug(ftName(t), '_'), -1), t: t, label: ftName(t) };
    AUTOKEY.add(f);
    if (t === 'select') f.opts = ['Birinci variant', 'İkinci variant'];
    if (t === 'multi') { f.opts = ['Birinci bənd', 'İkinci bənd']; f.min = 1; f.max = 2; }
    if (t === 'scale') { f.min = 1; f.max = 10; }
    MODEL.push(f);
    sync();
    draw();
    var last = host.querySelector('.fb-card:last-child .fb-label');
    if (last) { last.focus(); last.select(); }
  });

  /* JSON sahəsi əl ilə dəyişəndə kartlar yenidən qurulur. */
  raw.addEventListener('input', function () { if (!writing) load(); });

  /* Giriş cümləsinə yer tutucu əlavə edən düymələr. */
  function chips() {
    var box = $('phChips'), h = '';
    h += '<button type="button" class="chip-ph" data-ins="{from}">{from}</button>';
    h += '<button type="button" class="chip-ph" data-ins="{to}">{to}</button>';
    MODEL.forEach(function (f) {
      if (!f.k) return;
      h += '<button type="button" class="chip-ph" data-ins="' + esc('@{{' + f.k + '}}') + '">' +
        esc('@{{' + f.k + '}}') + '</button>';
    });
    h += '<span class="chip-note">kursorun yerinə əlavə edir</span>';
    box.innerHTML = h;
  }
  $('phChips').addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('[data-ins]') : null;
    if (!b) return;
    var ta = $('preamble'), ins = b.getAttribute('data-ins');
    var a = ta.selectionStart == null ? ta.value.length : ta.selectionStart;
    var z = ta.selectionEnd == null ? a : ta.selectionEnd;
    ta.value = ta.value.slice(0, a) + ins + ta.value.slice(z);
    ta.focus();
    ta.selectionStart = ta.selectionEnd = a + ins.length;
    ta.dispatchEvent(new Event('input', { bubbles: true }));
  });

  load();

  /* ==================== 2b · AI köməkçisi ====================
     Cavab yalnız formanı doldurur — heç nə saxlanılmır. Server tərəfdə
     `AiController` + `TemplateBrief::normalize()` dəyəri onsuz da qaydalara
     salır, burada isə sadəcə sahələrə yazılır və hadisələr atılır ki,
     qurucu və önizləmə özlərini yeniləsin. */
  (function () {
    var runBtn = $('aiRun');
    if (!runBtn) return;               /* açar qoyulmayıbsa panel yoxdur */

    var briefEl = $('aiBrief'), modeEl = $('aiMode'), stateEl = $('aiState'), msgEl = $('aiMsg');
    var URL = @json(route('admin.catalog.ai'));
    var TOKEN = (document.querySelector('meta[name="csrf-token"]') || {}).content || '';
    var busy = false;

    function setVal(name, v) {
      var el = form.elements[name];
      if (!el || v === undefined || v === null) return;
      el.value = v;
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function say(kind, html) { msgEl.innerHTML = '<div class="ai-' + kind + '">' + html + '</div>'; }

    function list(title, items) {
      return title + '<ul>' + items.map(function (m) { return '<li>' + esc(m) + '</li>'; }).join('') + '</ul>';
    }

    function run() {
      if (busy) return;
      var brief = briefEl.value.trim();
      if (!brief) { briefEl.focus(); say('err', 'Əvvəlcə nə istədiyinizi yazın.'); return; }

      busy = true;
      runBtn.disabled = true;
      stateEl.textContent = 'Model işləyir…';
      msgEl.innerHTML = '';

      fetch(URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': TOKEN, 'Accept': 'application/json' },
        body: JSON.stringify({
          brief: brief,
          mode: modeEl.value,
          category_id: $('category_id').value,
          template_id: @json($template->exists ? $template->id : null),
          layout: val('layout'),
          /* `variant` rejimi mövcud mətnin ətrafında işləyir. */
          title: $('title').value,
          powers: $('powers').value,
          penalty: $('penalty').value
        })
      })
        .then(function (r) { return r.text().then(function (t) { return { ok: r.ok, body: t }; }); })
        .then(function (r) {
          var d;
          try { d = JSON.parse(r.body); }
          catch (e) { throw new Error('Server JSON qaytarmadı (' + r.body.slice(0, 120) + ')'); }
          if (!d.ok) throw new Error(d.error || (d.message || 'Naməlum xəta'));

          Object.keys(d.values).forEach(function (k) { setVal(k, d.values[k]); });

          var h = 'Qaralama forma sahələrinə yazıldı — yoxlayın və «Yadda saxla» düyməsinə basın.';
          if (d.dropped && d.dropped.length)
            h += ' Model «' + esc(d.dropped.join(', ')) + '» parametrini tanımadı, o atıldı.';
          say('ok', h);
          if (d.warnings && d.warnings.length)
            msgEl.innerHTML += '<div class="ai-warn">' + list('Baxılmalıdır:', d.warnings) + '</div>';

          $('aiModelName').textContent = d.model || $('aiModelName').textContent;
          stateEl.textContent = d.usage ? (d.usage.in + ' + ' + d.usage.out + ' token') : '';
        })
        .catch(function (e) {
          say('err', esc(e.message));
          stateEl.textContent = '';
        })
        .finally(function () { busy = false; runBtn.disabled = false; });
    }

    runBtn.addEventListener('click', run);
    /* Ctrl/⌘ + Enter — brief sahəsindən birbaşa işə salır. */
    briefEl.addEventListener('keydown', function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); run(); }
    });
  })();

  /* ==================== 3 · canlı önizləmə ==================== */

  var box = $('prevDoc');
  if (!box || !window.DOCGEN) return;

  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function today() {
    var d = new Date();
    return pad2(d.getDate()) + '.' + pad2(d.getMonth() + 1) + '.' + d.getFullYear();
  }
  function clock(offsetH) {
    var d = new Date(Date.now() + (offsetH || 0) * 3600000);
    return pad2(d.getHours()) + ':' + pad2(d.getMinutes());
  }

  /* Sahənin nümunə dəyəri — ziyarətçinin görəcəyi ilk hal. */
  function sample(f) {
    if (f.auto) return f.auto;
    if (f.t === 'multi') return (f.def && f.def.length) ? f.def : (f.opts || []).slice(0, f.min || 2);
    if (f.t === 'list') return (f.def && f.def.length) ? f.def : [TO];
    if (f.t === 'select') return f.def || (f.opts && f.opts[0]) || '—';
    if (f.t === 'scale' || f.t === 'number') return f.def === undefined ? (f.min || 1) : f.def;
    if (f.t === 'time') {
      var m = String(f.def || '').match(/^\+(\d+)h$/);
      return m ? clock(parseInt(m[1], 10)) : clock(0);
    }
    if (f.t === 'date') return today();
    if (f.t === 'datetime') return today() + ', ' + clock(0);
    return f.def || (f.person ? TO : '—');
  }

  function fill(str, vals) {
    return String(str == null ? '' : str).replace(/\{\{(\w+)\}\}/g, function (m, k) {
      var v = vals[k];
      if (v === undefined || v === null || v === '') return '—';
      return Array.isArray(v) ? v.join(', ') : String(v);
    });
  }

  /* Klient tərəfi sürətli yoxlama — son sözü server `TemplateSchema` deyir. */
  function checkFields(fields, out) {
    var keys = {}, expiry = 0;
    fields.forEach(function (f, i) {
      var n = (i + 1) + '-ci sahə';
      if (!f || typeof f !== 'object') return out.push(n + ': obyekt deyil.');
      if (!/^[a-z0-9_]{1,20}$/.test(f.k || '')) out.push(n + ': açar yanlışdır (yalnız kiçik hərf, rəqəm, alt xətt).');
      else if (keys[f.k]) out.push(n + ': «' + f.k + '» açarı təkrarlanır.');
      else keys[f.k] = 1;
      if (TYPES.indexOf(f.t) < 0) return out.push(n + ': naməlum tip «' + f.t + '».');
      if (!f.label && !f.auto) out.push(n + ': sual mətni boşdur.');
      if ((f.t === 'select' || f.t === 'multi') && (!f.opts || !f.opts.length))
        out.push(n + ': variant siyahısı boşdur.');
      if (f.t === 'multi' && f.opts &&
          !(f.min >= 1 && f.min <= f.max && f.max <= f.opts.length))
        out.push(n + ': «ən azı»/«ən çoxu» aralığı yanlışdır (1 ≤ az ≤ çox ≤ variant sayı).');
      if (f.t === 'scale' && !(f.min < f.max && f.max <= 10))
        out.push(n + ': şkala üçün ən kiçik < ən böyük ≤ 10 olmalıdır.');
      if (f.expiry) expiry++;
    });
    if (expiry > 1) out.push('Şablonda yalnız bir «etibarlılıq müddəti» sahəsi ola bilər.');
    return keys;
  }

  /* Variant siyahılarının sürətli yoxlaması — serverdəki `optionErrors()` güzgüsü. */
  function checkOptions(tOpts, pOpts, qOpts, hasFields, out) {
    [['Başlıq variantları', tOpts, {{ \App\Support\TemplateSchema::MAX_TITLE_OPTS }}, LIM.title],
     ['Bənd variantları', pOpts, {{ \App\Support\TemplateSchema::MAX_POWER_OPTS }}, {{ \App\Support\TemplateSchema::MAX_POWER_LINE }}],
     ['Cəza bəndi variantları', qOpts, {{ \App\Support\TemplateSchema::MAX_PENALTY_OPTS }}, LIM.penalty]].forEach(function (x) {
      var label = x[0], list = x[1], maxN = x[2], maxL = x[3], seen = {};
      if (list.length > maxN) out.push(label + ': ən çoxu ' + maxN + ' sətir ola bilər, ' + list.length + ' verilib.');
      list.forEach(function (o, i) {
        if (o.length > maxL) out.push(label + ': ' + (i + 1) + '-ci sətir ' + maxL + ' simvolu aşır.');
        if (seen[o]) out.push(label + ': ' + (i + 1) + '-ci sətir təkrarlanır.');
        seen[o] = 1;
      });
    });
    if (hasFields && (tOpts.length || pOpts.length || qOpts.length))
      out.push('Anket sahəsi olan şablonda variant siyahıları işləmir — biri boş qalmalıdır.');
    var pMin = parseInt($('powers_min').value, 10) || 1, pMax = parseInt($('powers_max').value, 10) || MAX_PICK;
    if (pOpts.length && pMin > pMax) out.push('«Ən azı seçilən» «ən çoxu seçilən»dən böyük ola bilməz.');
    if (pOpts.length && pMax > pOpts.length)
      out.push('«Ən çoxu seçilən» variant sayından (' + pOpts.length + ') böyük ola bilməz.');
  }

  /* Bloklamayan tövsiyələr: kataloq invariantları (tools/check-copy.js §10).
     Server bunları tələb etmir, amma pozulanda ziyarətçi kartda gördüyü
     sənədlə redaktorda açılan sənədi fərqli görür. */
  function advice(tOpts, pOpts, qOpts, warn) {
    var pMax = parseInt($('powers_max').value, 10) || MAX_PICK;
    if (tOpts.length && tOpts[0] !== $('title').value.trim())
      warn.push('Başlıq variantlarının 1-ci sətri yuxarıdakı başlıqla eyni deyil — kataloq kartı başqa ad göstərəcək.');
    if (qOpts.length && qOpts[0] !== $('penalty').value.trim())
      warn.push('Cəza bəndi variantlarının 1-ci sətri yuxarıdakı cəza bəndi ilə eyni deyil.');
    if (pOpts.length) {
      var own = lines($('powers').value).slice(0, pMax);
      var head = pOpts.slice(0, pMax);
      if (own.join('\n') !== head.join('\n'))
        warn.push('Bənd variantlarının ilk ' + pMax + ' sətri yuxarıdakı bəndlərlə eyni deyil — açılışda başqa mətn işarəli gələcək.');
    }
    var m = LAYOUT_META[val('layout')];
    if (m && m.tail) {
      var last = ($('title').value.trim().split(/\s+/).pop() || '').toLocaleLowerCase('az');
      if (last && m.tail.split(' · ').indexOf(last) < 0)
        warn.push('Başlıq «' + last + '» ilə bitir; ' + m.name + ' blankı üçün gözlənilən: ' + m.tail + '.');
    }
    if (!$('sign_org').value.trim())
      warn.push('«İmzalayan orqan» boşdur — sənədin başlığının altındakı sətir blankın öz mətni ilə qalacaq.');
  }

  function build() {
    var errs = [], warn = [];
    var fields = readRaw();
    if (fields === null) { errs.push('Anket sxemi: JSON oxunmadı.'); fields = []; }
    var notes = lines($('notes').value);

    var keys = checkFields(fields, errs);

    /* Admin ziyarətçinin açılışda gördüyü halı görməlidir: ilk variantlar. */
    var tOpts = lines($('title_options').value),
        pOpts = lines($('powers_options').value),
        qOpts = lines($('penalty_options').value);
    var pMinPick = Math.max(1, Math.min(parseInt($('powers_min').value, 10) || 1, pOpts.length || 1));
    checkOptions(tOpts, pOpts, qOpts, !!(fields && fields.length), errs);
    advice(tOpts, pOpts, qOpts, warn);

    var vals = {}, data = [], checks = [], scale = null, into = {};
    fields.forEach(function (f) {
      if (!f || !f.k) return;
      var v = sample(f);
      vals[f.k] = v;
      var shown = Array.isArray(v) ? v.join(', ')
        : (f.up ? String(v).toLocaleUpperCase('az') : v);
      if (f.into) into[f.into] = String(shown);
      if (f.t === 'multi') checks = v.slice();
      else if (f.t === 'scale') scale = { label: f.label, v: v, max: f.max || 10 };
      if (!f.hide && f.t !== 'multi' && f.t !== 'scale')
        data.push([f.row || f.label || f.k,
          String(shown === '' ? '—' : shown) + (f.unit ? ' ' + f.unit : '')]);
    });

    /* Yer tutucular mövcud sahəyə uyğun gəlməlidir */
    var text = $('preamble').value + ' ' + $('share').value + ' ' + notes.join(' ');
    (text.match(/\{\{(\w+)\}\}/g) || []).forEach(function (r) {
      var k = r.slice(2, -2);
      var msg = '«' + r + '» heç bir anket sahəsinə uyğun gəlmir.';
      if (!keys[k] && errs.indexOf(msg) < 0) errs.push(msg);
    });

    var to   = into.to   || TO;
    var from = into.from || FROM;
    var opt  = $('category_id').selectedOptions[0];
    var tone = (opt && opt.getAttribute('data-tone')) || 'zarafat';
    var pre  = $('preamble').value.replace(/\{to\}/g, to).replace(/\{from\}/g, from);
    var prefix = ($('reg_prefix').value || 'ZRF').toUpperCase();
    if (!/^[A-Z]{2,4}$/.test(prefix)) prefix = 'ZRF';
    var regNo = prefix + '-' + new Date().getFullYear() + '-9482';

    var doc = {
      templateId: $('slug').value, tone: tone,
      layout: val('layout') || 'notarial', palette: val('palette') || 'gold',
      toLabel: $('to_label').value || null, fromLabel: $('from_label').value || null,
      powersLabel: $('powers_label').value || null, penaltyLabel: $('penalty_label').value || null,
      title: into.title || tOpts[0] || $('title').value || '—',
      to: to, from: from,
      powers: (checks.length ? checks : notes).join('\n')
        || (pOpts.length ? pOpts.slice(0, pMinPick).join('\n') : $('powers').value),
      penalty: qOpts[0] || $('penalty').value,
      preamble: fill(pre, vals),
      data: data.length ? data : null,
      checks: checks.length ? checks : null,
      scale: scale,
      notes: notes.length ? notes.map(function (n) { return fill(n, vals); }) : null,
      signTitle: $('sign_title').value || null,
      signOrg: $('sign_org').value || null,
      state: 'active',
      regNo: regNo, date: today(),
      paid: $('prevPaid').checked,
      verifyUrl: $('prevPaid').checked ? location.origin + '/r/' + regNo : ''
    };

    return { doc: doc, errs: errs, warn: warn, regNo: regNo };
  }

  function render() {
    var r;
    try { r = build(); }
    catch (e) {
      $('prevMsg').innerHTML = '<div class="prev-err">Önizləmə qurulmadı: ' + esc(e.message) + '</div>';
      return;
    }
    try {
      box.innerHTML = DOCGEN.a4(r.doc, { idPrefix: 'adm', verified: $('prevVerified').checked });
    } catch (e) {
      $('prevMsg').innerHTML = '<div class="prev-err">Render xətası: ' + esc(e.message) + '</div>';
      return;
    }
    $('prevReg').textContent = r.regNo;

    var h = r.errs.length
      ? '<div class="prev-err">Yadda saxlamağa mane olacaq:<ul>' +
        r.errs.map(function (m) { return '<li>' + esc(m) + '</li>'; }).join('') + '</ul></div>'
      : '<div class="prev-ok">Sxem qaydasındadır — yadda saxlaya bilərsiniz.</div>';
    if (r.warn.length)
      h += '<div class="prev-warn">Tövsiyə:<ul>' +
        r.warn.map(function (m) { return '<li>' + esc(m) + '</li>'; }).join('') + '</ul></div>';
    $('prevMsg').innerHTML = h;
  }

  var deb;
  function touch() { clearTimeout(deb); deb = setTimeout(render, 200); }
  ['input', 'change'].forEach(function (ev) { form.addEventListener(ev, touch); });
  ['prevPaid', 'prevVerified'].forEach(function (id) { $(id).addEventListener('change', render); });
  render();
})();
</script>
@endpush
