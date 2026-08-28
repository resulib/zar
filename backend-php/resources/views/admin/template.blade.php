@extends('layouts.panel')
@section('title', $template->exists ? $template->title : 'Yeni şablon')
@section('bar', 'İdarə paneli')
@section('side-title', 'İdarəetmə')
@section('side') @include('partials.admin-nav') @endsection
@section('nav')<a href="{{ route('admin.catalog.templates') }}">Şablonlar</a><a href="{{ url('/') }}">Sayt</a>@endsection
@section('tools')<form method="POST" action="{{ route('admin.logout') }}">@csrf<button class="chip" type="submit">Çıxış</button></form>@endsection

@php
  $jsonOf = static function ($value): string {
      return $value === null || $value === []
          ? ''
          : json_encode($value, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
  };
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

<div class="tpl-edit">
<form method="POST" id="tplForm"
      action="{{ $template->exists ? route('admin.catalog.templates.update', $template) : route('admin.catalog.templates.store') }}">
  @csrf

  <div class="panel">
    <div class="panel-head"><span class="label">Yerləşmə</span></div>
    <div class="panel-body">
      <div class="cols2">
        <div class="field">
          <label class="label" for="title">Başlıq</label>
          <input id="title" class="input" name="title" maxlength="120" required
                 value="{{ old('title', $template->title) }}" placeholder="Həftəsonu Çölə Çıxma Etibarnaməsi">
          <span class="hint">Rahat oxunması üçün 52 simvoldan qısa saxlayın.</span>
        </div>
        <div class="field">
          <label class="label" for="slug">Açar</label>
          <input id="slug" class="input mono" name="slug" maxlength="40" required pattern="[a-z0-9\-]+"
                 value="{{ old('slug', $template->slug) }}" placeholder="weekend-pass">
          <span class="hint">Sənədlərdə saxlanılır — mövcud şablonda dəyişdirməyin.</span>
        </div>
      </div>

      <div class="cols2">
        <div class="field">
          <label class="label" for="category_id">Kateqoriya</label>
          <select id="category_id" class="input" name="category_id" required>
            @foreach ($categories as $c)
              <option value="{{ $c->id }}" data-tone="{{ $c->tone }}"
                      @selected((int) old('category_id', $template->category_id) === $c->id)>
                {{ $c->name }} ({{ $c->tone === 'xatire' ? 'xatirə' : 'zarafat' }})
              </option>
            @endforeach
          </select>
          <span class="hint">Ton kateqoriyadan miras alınır.</span>
        </div>
        <div class="field">
          <label class="label" for="tag">Etiket</label>
          <input id="tag" class="input" name="tag" maxlength="40" value="{{ old('tag', $template->tag) }}"
                 placeholder="Ən çox paylaşılan">
        </div>
      </div>

      <div class="cols2">
        <div class="field">
          <label class="label" for="layout">Dizayn</label>
          <select id="layout" class="input" name="layout">
            @foreach ($layouts as $l)
              <option value="{{ $l }}" @selected(old('layout', $template->layout) === $l)>{{ $l }}</option>
            @endforeach
          </select>
        </div>
        <div class="field">
          <label class="label" for="palette">Palitra</label>
          <select id="palette" class="input" name="palette">
            @foreach ($palettes as $p)
              <option value="{{ $p }}" @selected(old('palette', $template->palette) === $p)>{{ $p }}</option>
            @endforeach
          </select>
        </div>
      </div>

      <div class="cols2">
        <div class="field">
          <label class="label" for="sort">Sıra</label>
          <input id="sort" class="input mono" type="number" name="sort" min="0" max="100000"
                 value="{{ old('sort', $template->sort) }}">
        </div>
        <div class="field">
          <label class="label">Vəziyyət</label>
          <label class="check">
            <input type="checkbox" name="is_active" value="1" @checked(old('is_active', $template->is_active))>
            <span>Saytda görünsün</span>
          </label>
        </div>
      </div>
    </div>
  </div>

  <div class="panel" style="margin-top:16px">
    <div class="panel-head"><span class="label">Sənədin mətni</span></div>
    <div class="panel-body">
      <div class="field">
        <label class="label" for="preamble">Preamble</label>
        <textarea id="preamble" class="textarea" name="preamble" rows="4" maxlength="700" required
                  placeholder="{from} tərəfindən {to} adlı şəxsə …">{{ old('preamble', $template->preamble) }}</textarea>
        <span class="hint">
          <code>{to}</code> və <code>{from}</code> ad sahələri ilə əvəzlənir — ən azı biri olmalıdır.
          Anket sahələri üçün <code>@{{açar}}</code> yazılır.
        </span>
      </div>

      <div class="field">
        <label class="label" for="powers">Bəndlər</label>
        <textarea id="powers" class="textarea mono" name="powers" rows="5" maxlength="600" required
                  placeholder="Hər bəndi yeni sətirdən yazın">{{ old('powers', $template->powers) }}</textarea>
        <span class="hint">Hər sətir bir bənddir. Sənədə ilk 6 bənd düşür, server 8 sətirdə kəsir.</span>
      </div>

      <div class="field">
        <label class="label" for="penalty">Cəza bəndi</label>
        <textarea id="penalty" class="textarea" name="penalty" rows="3" maxlength="300" required
                  >{{ old('penalty', $template->penalty) }}</textarea>
      </div>

      <div class="cols2">
        <div class="field">
          <label class="label" for="to_label">«Kimə» etiketi</label>
          <input id="to_label" class="input" name="to_label" maxlength="40" value="{{ old('to_label', $template->to_label) }}">
          <span class="hint">Boş qalsa dizaynın öz adı işlənir.</span>
        </div>
        <div class="field">
          <label class="label" for="from_label">«Kimdən» etiketi</label>
          <input id="from_label" class="input" name="from_label" maxlength="40" value="{{ old('from_label', $template->from_label) }}">
        </div>
      </div>
      <div class="cols2">
        <div class="field">
          <label class="label" for="powers_label">Bəndlərin başlığı</label>
          <input id="powers_label" class="input" name="powers_label" maxlength="40" value="{{ old('powers_label', $template->powers_label) }}">
        </div>
        <div class="field">
          <label class="label" for="penalty_label">Cəza bəndinin başlığı</label>
          <input id="penalty_label" class="input" name="penalty_label" maxlength="40" value="{{ old('penalty_label', $template->penalty_label) }}">
        </div>
      </div>
    </div>
  </div>

  <div class="panel" style="margin-top:16px">
    <div class="panel-head"><span class="label">Anket və paylaşım</span></div>
    <div class="panel-body">
      <p class="micro" style="margin-bottom:14px;line-height:1.65">
        Anket sahəsi doldurulubsa, redaktorda azad mətn sahələri əvəzinə forma qurulur və sənəd
        cavablardan yığılır. Boş qoysanız şablon adi mətn şablonu kimi işləyir.
        İcazəli tiplər: <code>{{ implode('</code> · <code>', $types) }}</code>.
      </p>

      <div class="field">
        <label class="label" for="fields">Anket sxemi (JSON massiv)</label>
        <textarea id="fields" class="textarea mono" name="fields" rows="12" spellcheck="false"
                  placeholder='[{"k": "teyinat", "t": "select", "label": "Təyinat yeri", "row": "TƏYİNAT YERİ", "opts": ["Çayxana", "Mangal"]}]'>{{ old('fields', $jsonOf($template->fields)) }}</textarea>
        <span class="hint">
          Hər sahədə <code>k</code> (açar) və <code>t</code> (tip) məcburidir.
          Modifikatorlar: <code>label · row · opts · min · max · def · into · hide · auto · person · up · unit · hint · free · count · expiry</code>.
          <code>expiry</code> şablonda yalnız bir dəfə ola bilər: <code>true</code> — saat sahəsi, <code>"hours"</code> — saat sayı.
        </span>
      </div>

      <div class="cols2">
        <div class="field">
          <label class="label" for="notes">Qeydlər (JSON mətn siyahısı)</label>
          <textarea id="notes" class="textarea mono" name="notes" rows="6" spellcheck="false"
                    placeholder='["Birinci qeyd", "İkinci qeyd"]'>{{ old('notes', $jsonOf($template->notes)) }}</textarea>
          <span class="hint">Viza və ekspertiza dizaynlarında nömrələnmiş bəndlər kimi çıxır. Ən çoxu 8 × 180 simvol.</span>
        </div>
        <div class="field">
          <label class="label" for="cancel_reasons">Ləğv səbəbləri (JSON mətn siyahısı)</label>
          <textarea id="cancel_reasons" class="textarea mono" name="cancel_reasons" rows="6" spellcheck="false"
                    placeholder='["Cavabsız zəng", "Gec qayıtdı"]'>{{ old('cancel_reasons', $jsonOf($template->cancel_reasons)) }}</textarea>
          <span class="hint">Yalnız <code>expiry</code> sahəsi olan şablonda mənalıdır.</span>
        </div>
      </div>

      <div class="cols2">
        <div class="field">
          <label class="label" for="sign_title">İmza vəzifəsi</label>
          <input id="sign_title" class="input" name="sign_title" maxlength="40"
                 value="{{ old('sign_title', $template->sign_title) }}" placeholder="Baş İnspektor">
        </div>
        <div class="field">
          <label class="label" for="sign_org">İmzalayan orqan</label>
          <input id="sign_org" class="input" name="sign_org" maxlength="60"
                 value="{{ old('sign_org', $template->sign_org) }}" placeholder="Miqrasiya və Çöl İşləri Baş İdarəsi">
        </div>
      </div>

      <div class="cols2">
        <div class="field">
          <label class="label" for="share">Paylaşım mətni</label>
          <input id="share" class="input" name="share" maxlength="180"
                 value="{{ old('share', $template->share) }}" placeholder="Nəhayət rəsmiləşdirdim 🛂">
          <span class="hint">Ödənişdən sonra «Paylaşım mətnini kopyala» düyməsi ilə verilir.</span>
        </div>
        <div class="field">
          <label class="label" for="reg_prefix">Qeydiyyat prefiksi</label>
          <input id="reg_prefix" class="input mono" name="reg_prefix" maxlength="4" pattern="[A-Z]{2,4}"
                 value="{{ old('reg_prefix', $template->reg_prefix) }}" placeholder="CCV">
          <span class="hint">2–4 böyük latın hərfi. Boş qalsa qlobal <code>{{ config('zarafat.reg_prefix') }}</code>.</span>
        </div>
      </div>
    </div>
    <div class="panel-foot">
      <button class="btn" type="submit">Yadda saxla</button>
      <a class="btn btn-ghost" href="{{ route('admin.catalog.templates') }}">İmtina</a>
    </div>
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
    (və ya ilk) dəyəri götürülür — istifadəçi başqa seçim edə bilər.
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
/* Canlı önizləmə: forma dəyişdikcə sənəd yenidən çəkilir.
   Saytdakı `formDoc()` ilə eyni məntiq, sadəcə ad sahələri nümunə adlarla
   doldurulur və anket cavabları sahələrin defolt dəyərlərindən götürülür. */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var box = $('prevDoc');
  if (!box || !window.DOCGEN) return;

  var TO = 'Günel Şəkərova', FROM = 'Elvin Məmmədov';
  var TYPES = @json($types);

  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function today() {
    var d = new Date();
    return pad2(d.getDate()) + '.' + pad2(d.getMonth() + 1) + '.' + d.getFullYear();
  }
  function clock(offsetH) {
    var d = new Date(Date.now() + (offsetH || 0) * 3600000);
    return pad2(d.getHours()) + ':' + pad2(d.getMinutes());
  }
  function esc(t) {
    return String(t).replace(/[&<>]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c];
    });
  }

  /* Sahənin nümunə dəyəri — istifadəçinin görəcəyi ilk hal. */
  function sample(f) {
    if (f.auto) return f.auto;
    if (f.t === 'multi') {
      var def = (f.def && f.def.length) ? f.def : (f.opts || []).slice(0, f.min || 2);
      return def;
    }
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
  function parseJson(id, label, out) {
    var raw = ($(id).value || '').trim();
    if (!raw || raw === 'null' || raw === '[]') return null;
    var v;
    try { v = JSON.parse(raw); }
    catch (e) { out.push(label + ': JSON oxunmadı — ' + e.message); return null; }
    if (!Array.isArray(v)) { out.push(label + ': massiv gözlənilir, məsələn [ … ].'); return null; }
    return v;
  }

  function checkFields(fields, out) {
    var keys = {}, expiry = 0;
    fields.forEach(function (f, i) {
      var n = (i + 1) + '-ci sahə';
      if (!f || typeof f !== 'object') return out.push(n + ': obyekt deyil.');
      if (!/^[a-z0-9_]{1,20}$/.test(f.k || '')) out.push(n + ': «k» yanlışdır.');
      else if (keys[f.k]) out.push(n + ': «' + f.k + '» açarı təkrarlanır.');
      else keys[f.k] = 1;
      if (TYPES.indexOf(f.t) < 0) return out.push(n + ': naməlum tip «' + f.t + '».');
      if (!f.label && !f.auto) out.push(n + ': «label» boşdur.');
      if ((f.t === 'select' || f.t === 'multi') && (!f.opts || !f.opts.length))
        out.push(n + ': «opts» siyahısı boşdur.');
      if (f.t === 'multi' && f.opts &&
          !(f.min >= 1 && f.min <= f.max && f.max <= f.opts.length))
        out.push(n + ': multi «min»/«max» aralığı yanlışdır.');
      if (f.t === 'scale' && !(f.min < f.max && f.max <= 10))
        out.push(n + ': şkala üçün min < max ≤ 10 olmalıdır.');
      if (f.expiry) expiry++;
    });
    if (expiry > 1) out.push('Yalnız bir «expiry» sahəsi ola bilər.');
    return keys;
  }

  function build() {
    var errs = [];
    var fields = parseJson('fields', 'Anket sxemi', errs) || [];
    var notes  = parseJson('notes', 'Qeydlər', errs) || null;
    parseJson('cancel_reasons', 'Ləğv səbəbləri', errs);

    var keys = Array.isArray(fields) ? checkFields(fields, errs) : {};

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
    var text = $('preamble').value + ' ' + $('share').value + ' ' + (notes || []).join(' ');
    (text.match(/\{\{(\w+)\}\}/g) || []).forEach(function (r) {
      var k = r.slice(2, -2);
      if (!keys[k] && errs.indexOf('«' + r + '» heç bir sahəyə uyğun gəlmir.') < 0)
        errs.push('«' + r + '» heç bir sahəyə uyğun gəlmir.');
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
      layout: $('layout').value, palette: $('palette').value,
      toLabel: $('to_label').value || null, fromLabel: $('from_label').value || null,
      powersLabel: $('powers_label').value || null, penaltyLabel: $('penalty_label').value || null,
      title: into.title || $('title').value || '—',
      to: to, from: from,
      powers: (checks.length ? checks : (notes || [])).join('\n') || $('powers').value,
      penalty: $('penalty').value,
      preamble: fill(pre, vals),
      data: data.length ? data : null,
      checks: checks.length ? checks : null,
      scale: scale,
      notes: notes ? notes.map(function (n) { return fill(n, vals); }) : null,
      signTitle: $('sign_title').value || null,
      signOrg: $('sign_org').value || null,
      state: 'active',
      regNo: regNo, date: today(),
      paid: $('prevPaid').checked,
      verifyUrl: $('prevPaid').checked ? location.origin + '/r/' + regNo : ''
    };

    return { doc: doc, errs: errs, regNo: regNo };
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
    $('prevMsg').innerHTML = r.errs.length
      ? '<div class="prev-err">Yadda saxlamağa mane olacaq:<ul>' +
        r.errs.map(function (m) { return '<li>' + esc(m) + '</li>'; }).join('') + '</ul></div>'
      : '<div class="prev-ok">Sxem qaydasındadır.</div>';
  }

  var deb;
  function touch() { clearTimeout(deb); deb = setTimeout(render, 200); }
  ['input', 'change'].forEach(function (ev) {
    document.getElementById('tplForm').addEventListener(ev, touch);
  });
  ['prevPaid', 'prevVerified'].forEach(function (id) {
    $(id).addEventListener('change', render);
  });
  render();
})();
</script>
@endpush
