/* ==================================================================
   Zarafat Notariat Palatası — tətbiq məntiqi
   Backend varsa /api/* istifadə edir, yoxdursa localStorage-a düşür.
   ================================================================== */
(function () {
  'use strict';

  var SITE = location.protocol.indexOf('http') === 0 ? location.origin : 'https://zarafat.az';
  var PACKS = [
    { id: 'p1',  credits: 1,  price: 1, label: '1 sənəd',  note: 'Tək sənəd üçün' },
    { id: 'p3',  credits: 3,  price: 2, label: '3 sənəd',  note: 'Ən çox seçilən', best: true },
    { id: 'p10', credits: 10, price: 5, label: '10 sənəd', note: 'Dost qrupu üçün' }
  ];

  /* ---------------- yaddaş qatı ---------------- */
  var LS = {
    get: function (k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v === null ? d : v; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };

  /* Offline rejimdə sənədin vəziyyəti — serverin Document::state() metodu ilə
     eyni məntiq. Onlayn rejimdə vəziyyəti server hesablayır. */
  function docState(d) {
    if (!d) return d;
    d.state = d.cancelledAt ? 'cancelled'
      : (d.expiresAt && d.expiresAt < Date.now() ? 'expired' : 'active');
    return d;
  }

  var API = {
    online: false,
    provider: 'simulation',
    init: function () {
      return fetch('/api/health', { cache: 'no-store' })
        .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
        .then(function (j) { API.online = true; API.provider = j.provider || 'simulation'; })
        .catch(function () { API.online = false; });
    },
    _post: function (url, body) {
      var headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };

      // Laravel backend-i CSRF tələb edir: token ya meta teqdə, ya da XSRF-TOKEN cookie-sindədir.
      var meta = document.querySelector('meta[name="csrf-token"]');
      if (meta && meta.content) headers['X-CSRF-TOKEN'] = meta.content;

      var xsrf = readCookie('XSRF-TOKEN');
      if (xsrf) headers['X-XSRF-TOKEN'] = xsrf;

      return fetch(url, {
        method: 'POST', headers: headers, credentials: 'same-origin',
        body: JSON.stringify(body || {})
      }).then(function (r) {
        // Xəta cavabı həmişə JSON olmur (419 CSRF, 500 səhifəsi, proxy) — mətn kimi oxuyuruq.
        return r.text().then(function (t) {
          var j = null;
          try { j = t ? JSON.parse(t) : null; } catch (e) {}
          if (r.ok) return j;
          return Promise.reject(j && typeof j === 'object' ? j : { error: 'http_' + r.status, status: r.status });
        });
      });
    },

    /* Cavab JSON olmaya bilər: 429 limit səhifəsi, 419 sessiya, proxy xətası.
       `r.json()` birbaşa çağırılsa səhifə tutulmuş istisna ilə dayanır. */
    _json: function (url, fallback) {
      return fetch(url, { headers: { 'Accept': 'application/json' } })
        .then(function (r) { return r.ok ? r.json() : null; })
        .catch(function () { return null; })
        .then(function (j) { return j === null ? fallback : j; });
    },

    credits: function () {
      if (!API.online) return Promise.resolve(LS.get('zrf_credits', 0));
      return API._json('/api/me', null).then(function (j) {
        return j && typeof j.credits === 'number' ? j.credits : 0;
      });
    },
    buy: function (packId) {
      if (!API.online) {
        var p = PACKS.filter(function (x) { return x.id === packId; })[0];
        var c = LS.get('zrf_credits', 0) + p.credits;
        LS.set('zrf_credits', c);
        return Promise.resolve({ credits: c, simulated: true });
      }
      if (API.provider === 'simulation') return API._post('/api/payments/simulate', { packId: packId });
      return API._post('/api/payments/checkout', { packId: packId }).then(function (r) {
        if (r && r.redirectUrl && !r.autoPaid) {
          sessionStorage.setItem('zrf_pending_doc', state.doc ? state.doc.regNo : '');
          location.href = r.redirectUrl;
          return new Promise(function () {});
        }
        return r;
      });
    },
    create: function (payload) {
      if (!API.online) {
        var docs = LS.get('zrf_docs', {});
        var regNo, pfx = regPrefix((payload && payload.regPrefix)
          ? { regPrefix: payload.regPrefix } : (payload && payload.templateId));
        do { regNo = pfx + '-' + new Date().getFullYear() + '-' + String(Math.floor(1000 + Math.random() * 9000)); }
        while (docs[regNo]);
        var doc = Object.assign({}, payload, {
          regNo: regNo, date: fmtDate(new Date()), paid: false,
          createdAt: Date.now(), verifyUrl: SITE + '/r/' + regNo
        });
        docs[regNo] = doc; LS.set('zrf_docs', docs);
        var mine = LS.get('zrf_mine', []); mine.unshift(regNo); LS.set('zrf_mine', mine.slice(0, 50));
        return Promise.resolve(doc);
      }
      return API._post('/api/documents', payload);
    },
    publish: function (regNo) {
      if (!API.online) {
        var c = LS.get('zrf_credits', 0);
        if (c < 1) return Promise.reject({ error: 'no_credits' });
        var docs = LS.get('zrf_docs', {});
        if (!docs[regNo]) return Promise.reject({ error: 'not_found' });
        docs[regNo].paid = true; docs[regNo].publishedAt = Date.now();
        LS.set('zrf_docs', docs); LS.set('zrf_credits', c - 1);
        return Promise.resolve(docs[regNo]);
      }
      return API._post('/api/documents/' + encodeURIComponent(regNo) + '/publish', {});
    },
    /* Ləğv — dərcdən sonrakı yeganə mutasiya. Sənəd reyestrdə qalır, yalnız
       vəziyyəti dəyişir və üzərinə «LƏĞV EDİLDİ» ştampı düşür. */
    cancel: function (regNo, reason) {
      if (!API.online) {
        var docs = LS.get('zrf_docs', {});
        if (!docs[regNo]) return Promise.reject({ error: 'not_found' });
        if (!docs[regNo].paid) return Promise.reject({ error: 'not_published' });
        if (!docs[regNo].cancelledAt) {
          docs[regNo].cancelledAt = Date.now();
          docs[regNo].cancelReason = reason || 'Səbəb göstərilmədi';
          LS.set('zrf_docs', docs);
        }
        return Promise.resolve(docState(docs[regNo]));
      }
      return API._post('/api/documents/' + encodeURIComponent(regNo) + '/cancel', { reason: reason });
    },
    lookup: function (regNo) {
      if (!API.online) {
        var d = LS.get('zrf_docs', {})[regNo];
        if (!d || !d.paid || d.deleted) return Promise.resolve(null);
        return Promise.resolve(docState(d));
      }
      return fetch('/api/registry/' + encodeURIComponent(regNo), { headers: { 'Accept': 'application/json' } })
        .then(function (r) {
          if (r.status === 429) return Promise.reject({ error: 'rate_limited' });
          return r.ok ? r.json() : null;
        });
    },
    mine: function () {
      if (!API.online) {
        var docs = LS.get('zrf_docs', {});
        return Promise.resolve(LS.get('zrf_mine', []).map(function (n) { return docs[n]; })
          .filter(function (d) { return d && !d.deleted; }).map(docState));
      }
      return API._json('/api/me/documents', []);
    },
    report: function (regNo, reason, note) {
      if (!API.online) {
        var mine = LS.get('zrf_mine', []);
        if (mine.indexOf(regNo) >= 0) {
          var docs = LS.get('zrf_docs', {});
          if (docs[regNo]) { docs[regNo].deleted = true; LS.set('zrf_docs', docs); }
          return Promise.resolve({ deleted: true });
        }
        var reps = LS.get('zrf_reports', []); reps.push({ regNo: regNo, reason: reason, note: note, at: Date.now() });
        LS.set('zrf_reports', reps);
        return Promise.resolve({ queued: true });
      }
      return API._post('/api/reports', { regNo: regNo, reason: reason, note: note });
    }
  };

  /* ---------------- yardımçılar ---------------- */
  function readCookie(name) {
    var parts = document.cookie ? document.cookie.split('; ') : [];
    for (var i = 0; i < parts.length; i++) {
      var eq = parts[i].indexOf('=');
      if (parts[i].slice(0, eq) === name) {
        try { return decodeURIComponent(parts[i].slice(eq + 1)); } catch (e) { return parts[i].slice(eq + 1); }
      }
    }
    return null;
  }

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function fmtDate(d) {
    var p = function (n) { return String(n).padStart(2, '0'); };
    return p(d.getDate()) + '.' + p(d.getMonth() + 1) + '.' + d.getFullYear();
  }

  var toastT;
  // Server göndərdiyi izahı göstərir, yoxdursa ümumi mətnə düşür.
  function apiError(e, fallback) {
    if (e && typeof e.message === 'string' && e.message) return e.message;
    if (e && e.errors && typeof e.errors === 'object') {
      var first = Object.keys(e.errors)[0];
      if (first && e.errors[first] && e.errors[first][0]) return e.errors[first][0];
    }
    if (e && e.status === 419) return 'Sessiya bitib — səhifəni yeniləyin.';
    return fallback;
  }

  function toast(msg, kind) {
    var el = $('#toast'), box = el.firstElementChild;
    box.textContent = msg;
    box.className = 'msg' + (kind === 'err' ? ' err' : '');
    el.classList.add('show');
    clearTimeout(toastT);
    toastT = setTimeout(function () { el.classList.remove('show'); }, 3400);
  }
  function openModal(id) { $(id).classList.add('open'); }
  function closeModal(id) { $(id).classList.remove('open'); }

  function svgToBlob(svg, w, h, scale) {
    return new Promise(function (res, rej) {
      var url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));
      var img = new Image();
      img.onload = function () {
        var c = document.createElement('canvas');
        c.width = Math.round(w * scale); c.height = Math.round(h * scale);
        var ctx = c.getContext('2d');
        ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, c.width, c.height);
        ctx.drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        c.toBlob(function (b) { b ? res(b) : rej(new Error('toBlob boş')); }, 'image/png', 0.95);
      };
      img.onerror = function (e) { URL.revokeObjectURL(url); rej(e); };
      img.src = url;
    });
  }
  function saveBlob(blob, name) {
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
  }

  /* ---------------- vəziyyət ---------------- */
  var state = {
    mode: 'zarafat',          // 'zarafat' | 'xatire' — sənədin tonu
    cat: 'couples', tpl: null, doc: null, credits: 0, layout: null, palette: null, q: '',
    answers: {},              // anket cavabları — yalnız `fields` daşıyan şablonlarda
    powerPicks: []            // seçilmiş bəndlər — variant sırasında saxlanılır
  };

  /* Rejimə görə dəyişən sayt mətnləri. Sənədin öz mətnləri doc.js-dədir. */
  var MODE_COPY = {
    zarafat: {
      title:   'Zarafat Notariat Palatası — qeyri-rəsmi sənədlər reyestri',
      mast:    'Zarafat Notariat Palatası',
      mastSub: 'Uydurma qurum · qeyri-rəsmi sənədlər reyestri · zarafat.az',
      govSub:  ' · Qeyri-rəsmi sənədlər vahid reyestri',
      eyebrow: 'Xidmət 01 — sənədin hazırlanması',
      h1:      'Rəsmi görünüşlü sənədlər.<br><em>Heç bir hüquqi qüvvəsi yoxdur.</em>',
      lede:    'Möhürlü, imzalı, ştrix-kodlu sənəd hazırlayın; 1 AZN ödəyib reyestrə yazdırın. ' +
               'Sənədin üzərindəki QR kod istənilən şəxsin onu yoxlamasına imkan verir — ' +
               'yoxlama nəticəsi də eyni dərəcədə ciddi görünür.',
      note:    'Zarafat rejimi: dostlara, cütlüklərə və iş yerinə göndərmək üçün gülməli sənədlər.',
      specTag: 'cütlüklər, dostlar, iş yeri',
      specimen: 'always-right'
    },
    xatire: {
      title:   'Xatirə Sənədləri Palatası — səmimi sənədlər reyestri',
      mast:    'Xatirə Sənədləri Palatası',
      mastSub: 'Uydurma qurum · xatirə sənədləri reyestri · zarafat.az',
      govSub:  ' · Xatirə sənədləri reyestri',
      eyebrow: 'Xidmət 02 — xatirənin rəsmiləşdirilməsi',
      h1:      'Saxlanılası sənədlər.<br><em>Yenə də hüquqi qüvvəsi yoxdur.</em>',
      lede:    'Sevgi, təşəkkür, ad günü və ailə üçün möhürlü, imzalı xatirə sənədi hazırlayın; ' +
               '1 AZN ödəyib reyestrə yazdırın. Quruluş eyni dərəcədə rəsmidir — ' +
               'yalnız sözlər isti və səmimidir.',
      note:    'Xatirə rejimi: çərçivəyə salınmaq və hədiyyə edilmək üçün səmimi sənədlər.',
      specTag: 'sevgi, təşəkkür, ailə, təbriklər',
      specimen: 'sevgi-etirafnamesi'
    }
  };

  /* Kataloq serverdə, admin panelində idarə olunur. Statik templates.js faylı
     toxum və offline ehtiyatdır: server əlçatmazsa (dist rejimi, `file://`)
     sayt onunla işləməyə davam edir.
     Massivlər YERİNDƏ dəyişdirilir — `CATEGORIES` / `TEMPLATES` istinadlarını
     tutan bütün funksiyalar öz-özünə yeni kataloqu görsün deyə. */
  function applyCatalog(payload) {
    if (!payload || !payload.categories || !payload.templates) return false;
    if (!payload.categories.length || !payload.templates.length) return false;

    CATEGORIES.length = 0;
    payload.categories.forEach(function (c) { CATEGORIES.push(c); });
    TEMPLATES.length = 0;
    payload.templates.forEach(function (t) { TEMPLATES.push(t); });
    return true;
  }

  /* Kataloq dəyişəndən sonra bütün görünüşü yenidən qurur. */
  function rebuildCatalogViews() {
    if (!MODE_COPY[state.mode] || !catsOf(state.mode).length) {
      var alt = DOCGEN.TONES.filter(function (t) { return catsOf(t).length; })[0];
      if (alt) { state.mode = alt; LS.set('zrf_mode', alt); }
    }
    var cats = catsOf(state.mode);
    if (!cats.filter(function (c) { return c.id === state.cat; }).length)
      state.cat = cats.length ? cats[0].id : '';

    renderModeSwitch(); applyModeCopy();
    renderTabs(); renderCards(); renderSpecimen();

    var list = tplsOf(state.mode);
    var keep = state.tpl && list.filter(function (t) { return t.id === state.tpl.id; })[0];
    if (keep) pickTemplate(keep.id);
    else if (list.length) pickTemplate(list[0].id);
    else { state.tpl = null; renderDesign(); updatePreview(); }
  }

  function catsOf(mode) {
    return CATEGORIES.filter(function (c) { return c.tone === mode; });
  }
  function tplsOf(mode) {
    return TEMPLATES.filter(function (t) { return t.tone === mode; });
  }

  var LAYOUT_EDGE = {
    notarial: '#b0882a', blank: '#2f5d8a', diplom: '#8d1d33',
    sertifikat: '#1f7a52', lisenziya: '#3b4b6b',
    arayis: '#2f6d7a', qerar: '#5d2b4a', muqavile: '#6b5539',
    teleqram: '#6f7a2f', vesiqe: '#8a5a2b',
    viza: '#2f5d8a', ekspertiza: '#1f7a52'
  };
  /* Şablona görə qeydiyyat prefiksi — backend-php/app/Support/RegistryPrefix.php güzgüsü.
     Yalnız ASCII: nömrə QR kodun URL-inə düşür. */
  var REG_PREFIX = {
    'cole-cixma-vizasi': 'CCV', 'hesab-davasi-qalibi': 'HDQ', 'gorduldu-arayisi': 'GRL',
    'bot-kimi-oynayir': 'BOT', 'immunitet-vesiqesi': 'QSM'
  };
  /* Prefiks kataloqdan gəlir; offline/dist rejimində yuxarıdakı xəritə işləyir. */
  function regPrefix(tpl) {
    if (tpl && tpl.regPrefix) return tpl.regPrefix;
    var id = tpl && tpl.id ? tpl.id : tpl;
    return REG_PREFIX[id] || 'ZRF';
  }

  var PAL_LABEL = { gold: 'Qızılı', steel: 'Polad', burgundy: 'Bordo', forest: 'Zümrüd', ink: 'Qrafit', rose: 'Çəhrayı' };
  var PAL_SWATCH = { gold: '#b0882a', steel: '#2f5d8a', burgundy: '#8d1d33', forest: '#1f7a52', ink: '#3b4b6b', rose: '#a8586b' };

  /* blank formalarının kiçik sxematik nişanları */
  var LAYOUT_ICON = {
    notarial: '<rect x="2.5" y="2.5" width="31" height="21" fill="none" stroke="currentColor"/><rect x="5" y="5" width="26" height="16" fill="none" stroke="currentColor" stroke-width=".6"/><path d="M11 11h14M11 14h14M13 17h10" stroke="currentColor" stroke-width=".9"/>',
    blank:    '<rect x="2.5" y="2.5" width="31" height="21" fill="none" stroke="currentColor"/><path d="M2.5 8h31" stroke="currentColor"/><rect x="22" y="4" width="9" height="3" fill="currentColor" opacity=".35"/><path d="M6 12h24M6 15h24M6 18h24M18 10.5v9" stroke="currentColor" stroke-width=".7"/>',
    diplom:   '<rect x="2.5" y="2.5" width="31" height="21" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="18" cy="8.5" r="3" fill="none" stroke="currentColor" stroke-width=".9"/><path d="M9 14h18M12 17.5h12M13 20.5h10" stroke="currentColor" stroke-width=".9"/>',
    sertifikat:'<rect x="2.5" y="2.5" width="31" height="21" fill="none" stroke="currentColor"/><rect x="2.5" y="2.5" width="6" height="21" fill="currentColor" opacity=".35"/><path d="M12 8h17M12 12h17M12 15.5h11M12 19h14" stroke="currentColor" stroke-width=".9"/>',
    lisenziya:'<rect x="2.5" y="4.5" width="31" height="17" rx="2" fill="none" stroke="currentColor"/><rect x="5.5" y="8" width="8" height="10" fill="none" stroke="currentColor" stroke-width=".8"/><path d="M16 9h14M16 12.5h14M16 16h9" stroke="currentColor" stroke-width=".8"/>',
    arayis:   '<rect x="2.5" y="2.5" width="31" height="21" fill="none" stroke="currentColor"/><circle cx="18" cy="6.5" r="2.4" fill="none" stroke="currentColor" stroke-width=".8"/><path d="M6 10.5h24M6 14h24M6 17h18M22 20.5h8" stroke="currentColor" stroke-width=".7"/>',
    qerar:    '<rect x="2.5" y="2.5" width="31" height="21" fill="none" stroke="currentColor"/><path d="M12 7h12" stroke="currentColor" stroke-width="1.4"/><path d="M6 11.5h9M21 11.5h9" stroke="currentColor" stroke-width=".9"/><path d="M6 15h24M6 18h24M6 21h14" stroke="currentColor" stroke-width=".6"/>',
    muqavile: '<rect x="2.5" y="2.5" width="31" height="21" fill="none" stroke="currentColor"/><rect x="6" y="5.5" width="10" height="6" fill="none" stroke="currentColor" stroke-width=".7"/><rect x="20" y="5.5" width="10" height="6" fill="none" stroke="currentColor" stroke-width=".7"/><path d="M6 15h24M6 17.5h24" stroke="currentColor" stroke-width=".6"/><path d="M6 21h10M20 21h10" stroke="currentColor" stroke-width=".9"/>',
    teleqram: '<rect x="2.5" y="2.5" width="31" height="21" fill="none" stroke="currentColor"/><path d="M2.5 5.5h31M2.5 20.5h31" stroke="currentColor" stroke-width="1.6" stroke-dasharray="2 2"/><path d="M7 10h22M7 13h22M7 16h14" stroke="currentColor" stroke-width=".8"/>',
    vesiqe:   '<rect x="2.5" y="4.5" width="31" height="17" rx="2" fill="none" stroke="currentColor"/><rect x="5.5" y="7.5" width="7" height="8" fill="none" stroke="currentColor" stroke-width=".7"/><path d="M15 8.5h15M15 11.5h15M15 14.5h9" stroke="currentColor" stroke-width=".7"/><path d="M5.5 18h25M5.5 19.8h25" stroke="currentColor" stroke-width=".9" stroke-dasharray="1 1"/>',
    viza:     '<rect x="2.5" y="2.5" width="31" height="21" fill="none" stroke="currentColor"/><rect x="2.5" y="2.5" width="31" height="4.5" fill="currentColor" opacity=".35"/><path d="M6 11h13M6 14h13M6 17h9" stroke="currentColor" stroke-width=".7"/><circle cx="26.5" cy="13" r="4" fill="none" stroke="currentColor" stroke-width=".8"/><path d="M5 21h24" stroke="currentColor" stroke-width="1" stroke-dasharray="1.4 1"/>',
    ekspertiza:'<rect x="2.5" y="2.5" width="31" height="21" fill="none" stroke="currentColor"/><rect x="2.5" y="2.5" width="31" height="6" fill="currentColor" opacity=".35"/><path d="M6 12h11M6 15h11" stroke="currentColor" stroke-width=".7"/><rect x="20" y="10" width="2.6" height="9" fill="currentColor" opacity=".8"/><rect x="24" y="13" width="2.6" height="6" fill="currentColor" opacity=".6"/><rect x="28" y="15.5" width="2.6" height="3.5" fill="none" stroke="currentColor" stroke-width=".7"/>'
  };

  function curLayout()  { return state.layout  || (state.tpl && state.tpl.layout)  || 'notarial'; }
  function curPalette() { return state.palette || (state.tpl && state.tpl.palette) || 'gold'; }

  /* ---------------- rejim ---------------- */
  function renderModeSwitch() {
    var el = $('#modeSwitch');
    if (!el) return;
    el.innerHTML = DOCGEN.TONES.map(function (m) {
      return '<button type="button" role="tab" data-mode="' + m + '" aria-pressed="' + (state.mode === m) + '">' +
        esc(DOCGEN.TONE_NAMES[m]) + '<span class="g">' + tplsOf(m).length + '</span></button>';
    }).join('');
    $$('#modeSwitch button').forEach(function (b) {
      b.onclick = function () { setMode(b.dataset.mode); };
    });
    var copy = MODE_COPY[state.mode];
    if ($('#modeNote')) $('#modeNote').textContent = copy.note;
  }

  /* Rejimə bağlı bütün sayt mətnlərini yeniləyir. */
  function applyModeCopy() {
    var c = MODE_COPY[state.mode];
    document.title = c.title;
    var set = function (sel, val, html) {
      var el = $(sel);
      if (!el) return;
      if (html) el.innerHTML = val; else el.textContent = val;
    };
    set('#mastName', c.mast); set('#mastSub', c.mastSub); set('#govSub', c.govSub);
    set('#heroEyebrow', c.eyebrow); set('#heroTitle', c.h1, true); set('#heroLede', c.lede);
    set('#specTemplates', tplsOf(state.mode).length + ' şablon — ' + c.specTag);
    set('#stepPick', tplsOf(state.mode).length + ' hazır şablondan birini seçin, adları və şərtləri ' +
      'yazın. Önizləmə hər hərfdən sonra yenilənir.');
    set('#specLayouts', DOCGEN.LAYOUTS.length + ' blank forması, ' + DOCGEN.PALETTES.length + ' rəng palitrası');
  }

  function setMode(mode) {
    if (!MODE_COPY[mode] || mode === state.mode) return;
    state.mode = mode;
    LS.set('zrf_mode', mode);
    state.q = '';
    if ($('#fSearch')) $('#fSearch').value = '';
    var first = catsOf(mode)[0];
    state.cat = first ? first.id : '';
    state.tpl = null; state.doc = null; state.layout = null; state.palette = null;
    renderModeSwitch(); applyModeCopy();
    renderTabs(); renderCards(); renderSpecimen();
    var t = tplsOf(mode)[0];
    if (t) pickTemplate(t.id); else { renderDesign(); updatePreview(); }
  }

  /* ---------------- kateqoriya / şablon ---------------- */
  function renderTabs() {
    $('#tabs').innerHTML = catsOf(state.mode).map(function (c) {
      var n = TEMPLATES.filter(function (t) { return t.cat === c.id; }).length;
      return '<button type="button" data-cat="' + c.id + '" aria-pressed="' + (state.cat === c.id) + '">' +
        esc(c.name) + '<span class="n">' + n + '</span></button>';
    }).join('');
    var cat = CATEGORIES.filter(function (c) { return c.id === state.cat; })[0];
    $('#catBlurb').textContent = cat ? cat.blurb : '';
    $$('#tabs button').forEach(function (b) {
      b.onclick = function () {
        state.cat = b.dataset.cat; state.q = ''; $('#fSearch').value = '';
        renderTabs(); renderCards();
      };
    });
  }

  function norm(s) {
    return String(s || '').toLowerCase()
      .replace(/ə/g, 'e').replace(/ğ/g, 'g').replace(/ı/g, 'i').replace(/i̇/g, 'i')
      .replace(/ö/g, 'o').replace(/ş/g, 's').replace(/ü/g, 'u').replace(/ç/g, 'c');
  }
  function matches(t, q) {
    if (!q) return true;
    var hay = norm([t.title, t.tag, t.powers, t.penalty, t.preamble, DOCGEN.LAYOUT_NAMES[t.layout]].join(' '));
    return norm(q).split(/\s+/).every(function (w) { return hay.indexOf(w) >= 0; });
  }

  function renderCards() {
    var q = state.q.trim();
    /* Axtarış da rejim daxilində işləyir — başqa tonun şablonu siyahıya düşmür. */
    var list = tplsOf(state.mode).filter(function (t) { return (q ? true : t.cat === state.cat) && matches(t, q); });
    $('#cardsEmpty').hidden = list.length > 0;
    $('#cards').innerHTML = list.map(function (t, i) {
      var idx = TEMPLATES.indexOf(t) + 1;
      return '<button type="button" class="tmpl" data-tpl="' + t.id + '"' +
        ' aria-pressed="' + (!!state.tpl && state.tpl.id === t.id) + '"' +
        ' style="border-left-color:' + LAYOUT_EDGE[t.layout] + '">' +
        '<span class="code">ZNP-' + String(idx).padStart(3, '0') + ' · ' + esc(t.tag) + '</span>' +
        '<h3>' + esc(t.title) + '</h3>' +
        '<span class="desc">' + esc(t.powers.split('\n')[0]) + '</span>' +
        '<span class="foot"><span>' + esc(DOCGEN.LAYOUT_NAMES[t.layout]) + '</span></span>' +
        '</button>';
    }).join('');
    $$('#cards button').forEach(function (b) { b.onclick = function () { pickTemplate(b.dataset.tpl); }; });
  }

  function pickTemplate(id) {
    var t = TEMPLATES.filter(function (x) { return x.id === id; })[0];
    if (!t) return;
    state.tpl = t; state.doc = null;
    state.layout = null; state.palette = null;
    renderPicks();
    renderFields();
    /* Anketli şablonda bəndlər `notes`-dan gəlir — sərbəst mətn sahəsi yalnız
       qarışıqlıq yaradardı, ona görə gizlədilir. */
    var anket = !!(t.fields && t.fields.length);
    $('#fPowersField').hidden  = anket;
    $('#fTitleField').hidden   = anket;
    $('#fPenaltyField').hidden = anket;
    $('#fNamesRow').hidden     = anket;
    renderCards(); renderDesign(); updatePreview();
  }

  /* ---------------- blank forması seçicisi ---------------- */
  function renderDesign() {
    var L = curLayout(), P = curPalette();
    $('#layoutPicker').innerHTML = DOCGEN.LAYOUTS.map(function (id) {
      return '<button type="button" data-layout="' + id + '" aria-pressed="' + (id === L) + '" title="' + esc(DOCGEN.LAYOUT_NAMES[id]) + '">' +
        '<svg width="36" height="26" viewBox="0 0 36 26" fill="none" style="color:' + (id === L ? LAYOUT_EDGE[id] : '#8a8c93') + '">' +
        LAYOUT_ICON[id] + '</svg>' +
        '<span>' + esc(DOCGEN.LAYOUT_NAMES[id].split(' ')[0]) + '</span></button>';
    }).join('');
    $('#palettePicker').innerHTML = DOCGEN.PALETTES.map(function (id) {
      return '<button type="button" data-palette="' + id + '" aria-pressed="' + (id === P) + '">' +
        '<span class="swatch" style="background:' + PAL_SWATCH[id] + '"></span>' + PAL_LABEL[id] + '</button>';
    }).join('');
    $$('#layoutPicker button').forEach(function (b) {
      b.onclick = function () { state.layout = b.dataset.layout; state.doc = null; renderDesign(); updatePreview(); };
    });
    $$('#palettePicker button').forEach(function (b) {
      b.onclick = function () { state.palette = b.dataset.palette; state.doc = null; renderDesign(); updatePreview(); };
    });
  }

  /* ---------------- şablon variantları (kilidli sahələr) ----------------
     Ziyarətçi yalnız adları sərbəst yazır. Başlıq, bəndlər və cəza bəndi
     adminin daxil etdiyi variantlardan seçilir; variant yoxdursa şablonun öz
     mətni yalnız oxunan şəkildə göstərilir.

     Bu qat yalnız rahatlıq üçündür — əsl məhdudiyyət serverdədir
     (DocumentService::pickTitle/pickPowers/pickPenalty). */

  function optsOf(t, key) {
    var a = t && t[key];
    return Array.isArray(a)
      ? a.filter(function (o) { return typeof o === 'string' && o.trim(); })
      : [];
  }

  function selHtml(id, opts) {
    return '<select id="' + id + '" class="input">' + opts.map(function (o) {
      return '<option value="' + esc(o) + '">' + esc(o) + '</option>';
    }).join('') + '</select>';
  }

  /* Bənd seçiminin sərhədləri — serverdəki `TemplateSchema::pickRange()` güzgüsü. */
  function powRange(t, n) {
    if (!n) return [1, 1];
    var ceil = Math.min(4, n);
    var lo = Math.max(1, Math.min(parseInt(t.powersMin, 10) || 1, ceil));
    var hi = Math.max(lo, Math.min(parseInt(t.powersMax, 10) || 4, ceil));
    return [lo, hi];
  }

  function renderPicks() {
    var t = state.tpl;
    if (!t) return;

    var tOpts = optsOf(t, 'titleOptions');
    var pOpts = optsOf(t, 'powersOptions');
    var qOpts = optsOf(t, 'penaltyOptions');

    $('#fTitleField').innerHTML = '<label class="label" for="fTitle">Sənədin adı</label>' +
      (tOpts.length
        ? selHtml('fTitle', tOpts)
        : '<input id="fTitle" class="input" readonly value="' + esc(t.title || '') + '">' +
          '<span class="hint">Bu şablonun adı dəyişdirilmir.</span>');

    var rng = powRange(t, pOpts.length);
    state.powerPicks = pOpts.slice(0, rng[0]);

    $('#fPowersField').innerHTML = '<label class="label" for="fPowers">Səlahiyyətlər və şərtlər</label>' +
      (pOpts.length
        ? '<div class="checks" role="group" aria-label="Bəndlər">' + pOpts.map(function (o, i) {
            return '<button type="button" data-pow="' + i + '" aria-pressed="' +
              (state.powerPicks.indexOf(o) >= 0) + '">' + esc(o) + '</button>';
          }).join('') + '</div>' +
          '<span class="hint">Ən azı ' + rng[0] + ', ən çoxu ' + rng[1] + ' bənd seçin.</span>' +
          '<textarea id="fPowers" hidden></textarea>'
        : '<textarea id="fPowers" class="textarea" rows="5" readonly></textarea>' +
          '<span class="hint">Bu şablonun bəndləri dəyişdirilmir.</span>');

    $('#fPowers').value = pOpts.length ? state.powerPicks.join('\n') : (t.powers || '');

    $('#fPenaltyField').innerHTML = '<label class="label" for="fPenalty">Cəza bəndi</label>' +
      (qOpts.length
        ? selHtml('fPenalty', qOpts)
        : '<textarea id="fPenalty" class="textarea" rows="3" readonly></textarea>' +
          '<span class="hint">Bu şablonun cəza bəndi dəyişdirilmir.</span>');

    if (!qOpts.length) $('#fPenalty').value = t.penalty || '';
  }

  /* Bənd seçimi. Nəticə HƏMİŞƏ variant sırasındadır — server
     `Sanitizer::pickList()` də eyni sıranı verir; fərqlənsə, yüklənən PNG ilə
     reyestrdəki nüsxə fərqli sıralanardı. */
  function togglePower(i) {
    var t = state.tpl, pOpts = optsOf(t, 'powersOptions');
    var o = pOpts[i];
    if (!o) return;

    var rng = powRange(t, pOpts.length);
    var cur = (state.powerPicks || []).slice(), at = cur.indexOf(o);

    if (at >= 0) {
      if (cur.length <= rng[0]) return toast('Ən azı ' + rng[0] + ' bənd seçilməlidir', 'err');
      cur.splice(at, 1);
    } else {
      if (cur.length >= rng[1]) return toast('Ən çoxu ' + rng[1] + ' bənd seçilə bilər', 'err');
      cur.push(o);
    }

    state.powerPicks = pOpts.filter(function (x) { return cur.indexOf(x) >= 0; });
    $('#fPowers').value = state.powerPicks.join('\n');
    $$('#fPowersField [data-pow]').forEach(function (b, k) {
      b.setAttribute('aria-pressed', state.powerPicks.indexOf(pOpts[k]) >= 0);
    });
  }

  /* ---------------- anket sahələri ----------------
     Şablon `fields[]` daşıyırsa, redaktor formanı ondan qurur. Cavablar iki
     istiqamətə gedir: köhnə mətn sahələrinə (`into`) və sənədin struktur
     bloklarına (`data` / `checks` / `scale`). `fields` olmayan şablonlar
     bugünkü kod yolunda qalır — heç nə dəyişmir. */

  var FIELD_TYPES = ['text', 'select', 'multi', 'list', 'scale', 'number', 'time', 'date', 'datetime'];
  /* Ad sahələri: yalnız hərf, boşluq, defis və apostrof (server `Sanitizer::person` ilə eyni) */
  var PERSON_RE = /[^\p{L}\p{M} '\-]/gu;

  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function clockNow(offsetH) {
    var d = new Date(Date.now() + (offsetH || 0) * 3600000);
    return pad2(d.getHours()) + ':' + pad2(d.getMinutes());
  }
  function defVal(f) {
    if (f.auto) return f.auto;
    if (f.t === 'time') {
      if (f.def === 'now') return clockNow(0);
      var m = String(f.def || '').match(/^\+(\d+)h$/);
      if (m) return clockNow(parseInt(m[1], 10));
      return clockNow(0);
    }
    if (f.t === 'date') return new Date().toISOString().slice(0, 10);
    if (f.t === 'datetime') return new Date().toISOString().slice(0, 16);
    if (f.t === 'scale' || f.t === 'number') return f.def === undefined ? (f.min || 1) : f.def;
    if (f.t === 'multi') return (f.def || []).slice();
    if (f.t === 'list') return (f.def || ['']).slice();
    if (f.t === 'select') return f.def || (f.opts && f.opts[0]) || '';
    return f.def || '';
  }

  /* `{{k}}` yer tutucularını cavablarla əvəz edir. */
  function fill(str, ans) {
    return String(str == null ? '' : str).replace(/\{\{(\w+)\}\}/g, function (m, k) {
      var v = ans[k];
      if (v === undefined || v === null || v === '') return '—';
      return Array.isArray(v) ? v.join(', ') : String(v);
    });
  }

  function renderFields(preserve) {
    var box = $('#fFields'), t = state.tpl;
    if (!box) return;
    if (!t || !t.fields || !t.fields.length) { box.innerHTML = ''; box.hidden = true; state.answers = {}; return; }
    box.hidden = false;
    var prev = preserve ? (state.answers || {}) : {};
    state.answers = {};
    t.fields.forEach(function (f) {
      state.answers[f.k] = prev[f.k] === undefined ? defVal(f) : prev[f.k];
    });

    box.innerHTML = t.fields.map(function (f) {
      if (f.auto) return '';
      var v = state.answers[f.k], id = 'ff-' + f.k, h = '';
      h += '<div class="field" data-fk="' + esc(f.k) + '">';
      h += '<label class="label" for="' + id + '">' + esc(f.label) + (f.opt ? ' <span class="opt">(istəyə bağlı)</span>' : '') + '</label>';

      if (f.t === 'multi') {
        h += '<div class="checks" role="group" aria-label="' + esc(f.label) + '">' + (f.opts || []).map(function (o, i) {
          return '<button type="button" data-fk="' + esc(f.k) + '" data-opt="' + i + '" aria-pressed="' +
            (v.indexOf(o) >= 0) + '">' + esc(o) + '</button>';
        }).join('') + '</div>';
        h += '<span class="hint">Ən azı ' + (f.min || 1) + ', ən çoxu ' + (f.max || (f.opts || []).length) + ' bənd.</span>';
      } else if (f.t === 'list') {
        h += '<div class="list-box" data-fk="' + esc(f.k) + '">' + v.map(function (x, i) {
          return '<div class="list-row"><input class="input" data-fk="' + esc(f.k) + '" data-i="' + i +
            '" maxlength="' + (f.max || 40) + '" value="' + esc(x) + '" placeholder="Ad Soyad">' +
            '<button type="button" class="btn-mini" data-list="del" data-fk="' + esc(f.k) + '" data-i="' + i +
            '" aria-label="Sil">−</button></div>';
        }).join('') + '</div>';
        h += '<button type="button" class="btn-mini" data-list="add" data-fk="' + esc(f.k) + '">+ Ad əlavə et</button>';
      } else if (f.t === 'select') {
        h += '<select id="' + id + '" class="input" data-fk="' + esc(f.k) + '">' +
          (f.opts || []).map(function (o) {
            return '<option value="' + esc(o) + '"' + (o === v ? ' selected' : '') + '>' + esc(o) + '</option>';
          }).join('') + (f.free ? '<option value="__free">Özün yaz…</option>' : '') + '</select>';
        if (f.free) h += '<input class="input free" data-fk="' + esc(f.k) + '" data-free="1" maxlength="' +
          (f.max || 40) + '" placeholder="Öz variantınız" hidden>';
      } else if (f.t === 'scale') {
        h += '<div class="range-wrap"><input id="' + id + '" type="range" class="range" data-fk="' + esc(f.k) +
          '" min="' + (f.min || 1) + '" max="' + (f.max || 10) + '" step="1" value="' + v + '">' +
          '<span class="range-val" data-val="' + esc(f.k) + '">' + v + '/' + (f.max || 10) + '</span></div>';
      } else {
        var type = f.t === 'number' ? 'number' : (f.t === 'time' ? 'time' : (f.t === 'date' ? 'date' : (f.t === 'datetime' ? 'datetime-local' : 'text')));
        h += '<input id="' + id + '" type="' + type + '" class="input" data-fk="' + esc(f.k) + '"' +
          (f.t === 'number' ? ' min="' + (f.min || 0) + '" max="' + (f.max || 999) + '"' : '') +
          (f.t === 'text' ? ' maxlength="' + (f.max || 40) + '"' : '') +
          ' value="' + esc(String(v)) + '">';
      }
      if (f.hint) h += '<span class="hint">' + esc(f.hint) + '</span>';
      return h + '</div>';
    }).join('');
  }

  /* Ad siyahısı dəyişəndə formanı yenidən qurur, amma cavabları sıfırlamır. */
  function renderFieldsKeepFocus(k) {
    renderFields(true);
    var inp = $('#fFields .field[data-fk="' + k + '"] input');
    if (inp) inp.focus();
  }

  /* Formadakı cavabları oxuyub sənədin struktur bloklarını qurur. */
  function readFields() {
    var t = state.tpl, out = { data: [], checks: [], scale: null, notes: null, expiresAt: null, until: null, into: {} };
    if (!t || !t.fields || !t.fields.length) return null;
    var ans = state.answers || {};   /* yalnız oxumaq üçün */

    /* Cavablar `state.answers`-də saxlanılır — DOM-dan deyil, oradan oxunur:
       forma yenidən qurulanda da mənbə tək qalır.
       `state.answers` BURADA DƏYİŞDİRİLMİR: təmizlənmiş dəyərlər yerli `vals`-a
       yığılır, əks halda boş siyahı sətri formadan silinər və istifadəçi ad
       əlavə edə bilməzdi. */
    var vals = {};
    t.fields.forEach(function (f) {
      var v = f.auto ? f.auto : ans[f.k];
      if (f.t === 'multi' || f.t === 'list') v = (v || []).slice();
      if (f.t === 'scale' || f.t === 'number') v = parseInt(v, 10) || (f.min || 0);
      if (v === undefined || v === null) v = '';
      if (f.t === 'text' && f.person) v = String(v).replace(PERSON_RE, '').slice(0, f.max || 40);
      if (f.t === 'list') v = v.map(function (x) { return String(x).replace(PERSON_RE, '').trim(); }).filter(Boolean).slice(0, f.count || 4);
      vals[f.k] = v;

      var shown = Array.isArray(v) ? v.join(', ') : (f.up ? String(v).toLocaleUpperCase('az') : v);
      if (f.into) out.into[f.into] = String(shown);
      if (f.expiry === 'hours') out.untilHours = parseInt(v, 10) || 0;
      else if (f.expiry) out.until = String(v);
      if (f.t === 'multi') out.checks = v.slice();
      else if (f.t === 'scale') out.scale = { label: f.label, v: v, max: f.max || 10 };
      if (!f.hide && f.t !== 'multi' && f.t !== 'scale')
        out.data.push([f.row || f.label, String(shown === '' || shown === undefined ? '—' : shown) + (f.unit ? ' ' + f.unit : '')]);
    });

    /* Etibarlılıq müddəti iki formada verilə bilər:
         expiry: true      — sahə HH:MM saatıdır, ən yaxın gələcək həmin saat
         expiry: 'hours'   — sahə saat sayıdır, indidən o qədər sonra */
    if (out.untilHours) {
      var dh = new Date(Date.now() + out.untilHours * 3600000);
      out.expiresAt = dh.getTime();
      out.until = pad2(dh.getHours()) + ':' + pad2(dh.getMinutes());
    } else if (out.until && /^\d{2}:\d{2}$/.test(out.until)) {
      var p = out.until.split(':'), d = new Date();
      d.setHours(parseInt(p[0], 10), parseInt(p[1], 10), 0, 0);
      if (d.getTime() <= Date.now()) d.setDate(d.getDate() + 1);
      out.expiresAt = d.getTime();
    }
    if (t.notes) out.notes = t.notes.map(function (n) { return fill(n, vals); });
    out.vals = vals;
    return out;
  }

  /* ---------------- sənəd obyekti ---------------- */
  function formDoc(base) {
    var t = state.tpl || TEMPLATES[0];
    var F = readFields();
    /* Gizli sahə sənədə heç nə verməməlidir: anketli şablona keçəndə əvvəl
       yazılmış ad `doc.to`-ya sızırdı. Sahəni təmizləmirik — istifadəçi
       şablonlara baxarkən yazdığı adı itirməsin. */
    var freeNames = !$('#fNamesRow').hidden;
    var to   = (F && F.into.to)   || (freeNames ? $('#fTo').value.trim()   : '') || 'Ad Soyad';
    var from = (F && F.into.from) || (freeNames ? $('#fFrom').value.trim() : '') || 'Ad Soyad';
    var pre = (t.preamble || '').replace(/\{to\}/g, to).replace(/\{from\}/g, from);
    if (F) pre = fill(pre, F.vals);
    /* Hibrid qat: cavablar həm struktur bloklara, həm də `powers`-ə düşür ki,
       anketli şablon istifadəçi dizaynı dəyişdikdə köhnə on dizaynda da oxunsun. */
    var extra = F ? {
      powers: (F.checks.length ? F.checks : (F.notes || [])).join('\n') || t.powers,
      data: F.data, checks: F.checks, scale: F.scale, notes: F.notes,
      /* Təmizlənmiş cavablar — PHP backend preamble-ın `{{açar}}` yer
         tutucularını serverdə bunlardan doldurur (App\Support\Answers). */
      answers: F.vals,
      until: F.until, expiresAt: F.expiresAt,
      signTitle: t.signTitle || null, signOrg: t.signOrg || null,
      share: t.share ? fill(t.share, F.vals) : null,
      state: 'active', cancelReason: null
    } : {};
    return Object.assign({
      templateId: t.id,
      tone: t.tone || 'zarafat',
      layout: curLayout(), palette: curPalette(),
      toLabel: t.toLabel || null, fromLabel: t.fromLabel || null,
      powersLabel: t.powersLabel || null, penaltyLabel: t.penaltyLabel || null,
      title: (F && F.into.title) || $('#fTitle').value.trim() || t.title,
      to: to, from: from,
      powers: $('#fPowers').value,
      penalty: $('#fPenalty').value.trim(),
      /* PHP backend preamble-ı şablondan özü qurur və bu dəyəri oxumur;
         sətir arxiv `backend-node/` üçün saxlanılır. */
      preamble: pre,
      regNo: regPrefix(t) + '-' + new Date().getFullYear() + '-————',
      date: fmtDate(new Date()),
      paid: false, verifyUrl: ''
    }, extra, base || {});
  }

  function updatePreview() {
    var doc = state.doc || formDoc();
    $('#preview').innerHTML = DOCGEN.a4(doc, { idPrefix: 'pv' });
    $('#regBadge').textContent = doc.regNo;
    renderActions();
  }

  /* ---------------- əməliyyatlar ---------------- */
  function renderActions() {
    var box = $('#actions'), note = $('#actionsNote');
    if (!state.doc) {
      box.innerHTML = '<div class="span2 empty" style="padding:16px;font-size:12.5px">' +
        'Yükləmə və reyestr qeydiyyatı «Sənədi rəsmiləşdir» düyməsindən sonra açılır.</div>';
      note.textContent = '';
      return;
    }
    var d = state.doc, html = '';
    html += '<button id="aFree" class="btn btn-ghost" type="button">Pulsuz yüklə</button>';
    if (!d.paid) {
      html += '<button id="aPay" class="btn" type="button">1 AZN — reyestrə yaz</button>';
    } else {
      html += '<button id="aHd" class="btn" type="button">HD PNG yüklə</button>';
      html += '<button id="aStory" class="btn btn-ghost" type="button">Story formatı</button>';
      html += '<button id="aLink" class="btn btn-ghost" type="button">Reyestr linki</button>';
      if (d.share) html += '<button id="aShare" class="btn btn-ghost span2" type="button">Paylaşım mətnini kopyala</button>';
      /* Ləğv yalnız müddəti olan və hələ ləğv edilməmiş sənəddə mənalıdır.
         Arxiv Node backend-ində bu endpoint yoxdur — offline rejimdə də işləyir. */
      if (d.expiresAt && !d.cancelledAt)
        html += '<button id="aCancel" class="btn btn-danger span2" type="button">Vizanı ləğv et</button>';
    }
    html += '<button id="aReport" class="btn btn-danger span2" type="button">Şikayət et / sil</button>';
    box.innerHTML = html;

    note.innerHTML = d.paid
      ? 'Reyestr qeydiyyatı tamamlanıb: <b>' + esc(d.regNo) + '</b>. QR kodu skan edən şəxs birbaşa yoxlama səhifəsinə düşür.'
      : 'Pulsuz variantda sənədin üzərində «NÜMUNƏ» su nişanı qalır və QR kod yaranmır.';

    var b;
    if ((b = $('#aFree')))  b.onclick = function () { download(d, false, 2); };
    if ((b = $('#aHd')))    b.onclick = function () { download(d, false, 3); };
    if ((b = $('#aStory'))) b.onclick = function () { download(d, true, 1); };
    if ((b = $('#aPay')))   b.onclick = function () { payFlow(d); };
    if ((b = $('#aCancel'))) b.onclick = function () { openCancel(d); };
    if ((b = $('#aShare'))) b.onclick = function () {
      var txt = d.share + '\n' + (d.verifyUrl || (SITE + '/r/' + d.regNo));
      navigator.clipboard.writeText(txt)
        .then(function () { toast('Paylaşım mətni kopyalandı'); })
        .catch(function () { toast('Kopyalamaq alınmadı', 'err'); });
    };
    if ((b = $('#aLink')))  b.onclick = function () {
      navigator.clipboard.writeText(d.verifyUrl || (SITE + '/r/' + d.regNo))
        .then(function () { toast('Link kopyalandı'); })
        .catch(function () { toast('Kopyalamaq alınmadı', 'err'); });
    };
    if ((b = $('#aReport'))) b.onclick = function () { openReport(d.regNo); };
  }

  function download(doc, isStory, scale) {
    var svg = isStory ? DOCGEN.story(doc, { idPrefix: 'ex' }) : DOCGEN.a4(doc, { idPrefix: 'ex' });
    var w = isStory ? DOCGEN.STORY_W : DOCGEN.W;
    var h = isStory ? DOCGEN.STORY_H : DOCGEN.H;
    toast('Şəkil hazırlanır…');
    svgToBlob(svg, w, h, scale).then(function (b) {
      saveBlob(b, 'zarafat-' + doc.regNo + (isStory ? '-story' : '') + '.png');
      toast('Yükləndi');
    }).catch(function () { toast('Şəkli yaratmaq alınmadı', 'err'); });
  }

  /* ---------------- ödəniş ---------------- */
  function refreshCredits() {
    return API.credits().then(function (c) { state.credits = c || 0; $('#creditCount').textContent = state.credits; });
  }

  function renderPacks() {
    $('#packs').innerHTML = PACKS.map(function (p) {
      return '<button type="button" class="pack' + (p.best ? ' best' : '') + '" data-pack="' + p.id + '">' +
        '<span><span class="n">' + esc(p.label) + '</span><br><span class="d">' + esc(p.note) + '</span></span>' +
        '<span class="p">' + p.price + ' AZN</span></button>';
    }).join('');
    $$('#packs button').forEach(function (b) {
      b.onclick = function () {
        b.disabled = true; b.style.opacity = .6;
        API.buy(b.dataset.pack)
          .then(refreshCredits)
          .then(function () {
            closeModal('#payModal');
            toast('Ödəniş qeydə alındı — balans: ' + state.credits);
            if (state.doc && !state.doc.paid) payFlow(state.doc);
          })
          .catch(function () { toast('Ödəniş alınmadı', 'err'); })
          .then(function () { b.disabled = false; b.style.opacity = 1; });
      };
    });
  }

  function payFlow(doc) {
    if (state.credits < 1) { renderPacks(); openModal('#payModal'); return; }
    API.publish(doc.regNo).then(function (d) {
      state.doc = d;
      return refreshCredits().then(function () {
        updatePreview(); renderMine();
        toast('Sənəd reyestrə yazıldı: ' + d.regNo);
      });
    }).catch(function (e) {
      if (e && e.error === 'no_credits') { renderPacks(); openModal('#payModal'); }
      else toast(apiError(e, 'Reyestrə yazmaq alınmadı'), 'err');
    });
  }

  /* ---------------- reyestr ---------------- */
  function normReg(v) {
    v = String(v || '').trim().toUpperCase().replace(/^#/, '').replace(/\s+/g, '');
    if (/^\d{4}$/.test(v)) v = 'ZRF-' + new Date().getFullYear() + '-' + v;
    return v;
  }
  /* `long` — bir neçə cümləlik izah üçün: mono əvəzinə sans, daha rahat sətir hündürlüyü. */
  function verdict(kind, title, meta, long) {
    return '<div class="verdict ' + kind + '"><strong>' + title + '</strong>' +
      (meta ? '<div class="meta' + (long ? ' long' : '') + '">' + meta + '</div>' : '') + '</div>';
  }

  function doSearch() {
    var reg = normReg($('#qReg').value);
    $('#searchResult').innerHTML = '';
    if (!/^[A-Z]{2,4}-\d{4}-\d{4}$/.test(reg)) {
      $('#searchMsg').innerHTML = verdict('wait', 'Nömrə formatı yanlışdır', 'Düzgün format: ZRF-2026-9482');
      return;
    }
    $('#searchMsg').innerHTML = verdict('wait', 'Reyestrdə axtarılır…', reg);
    API.lookup(reg).then(function (d) {
      if (!d) {
        /* Bu mətn qəsdən sərtdir: konsolda «düzəldilmiş» sənədin QR kodu məhz
           buraya düşür və sənədin qeydə alınmadığını özü elan edir. */
        $('#searchMsg').innerHTML = verdict('no', 'Bu nömrə reyestrdə qeydə alınmayıb',
          'Əlinizdə bu nömrəni daşıyan sənəd varsa, o, bu reyestrdən çıxarılmayıb: ya heç vaxt ' +
          'rəsmiləşdirilməyib, ya sonradan dəyişdirilib, ya da sahibi tərəfindən silinib. ' +
          'Reyestrdə olmayan sənəd bu qurumun verdiyi sənəd sayılmır.', true);
        return;
      }
      /* Vəziyyət serverdə hesablanır və sənədin üzərindəki ştampı da o seçir —
         reyestr mətni ilə sənədin özü heç vaxt bir-birinə zidd olmur. */
      if (d.state === 'cancelled') {
        $('#searchMsg').innerHTML = verdict('no', 'Sənəd ləğv edilib',
          'Qeydiyyat: ' + esc(d.regNo) + '. Ləğv səbəbi: «' + esc(d.cancelReason || 'göstərilməyib') + '». ' +
          'Ləğv edilmiş sənəd qüvvədə deyil və heç bir öhdəlik yaratmır.', true);
      } else if (d.state === 'expired') {
        $('#searchMsg').innerHTML = verdict('wait', 'Sənədin müddəti bitib',
          'Qeydiyyat: ' + esc(d.regNo) + ' · Tarix: ' + esc(d.date) + '. Sənəd reyestrdədir, ' +
          'lakin etibarlılıq müddəti başa çatdığı üçün qüvvədə deyil.', true);
      } else {
        $('#searchMsg').innerHTML = verdict('ok', 'Rəsmi təsdiq olunub',
          'Qeydiyyat: ' + esc(d.regNo) + ' · Tarix: ' + esc(d.date));
      }
      $('#searchResult').innerHTML =
        '<div class="sheet-wrap"><div class="paper">' + DOCGEN.a4(d, { idPrefix: 'sr', verified: true }) + '</div></div>' +
        '<div style="margin-top:10px"><button id="srReport" class="btn btn-danger btn-sm" type="button">Şikayət et / sil</button></div>';
      $('#srReport').onclick = function () { openReport(d.regNo); };
    }).catch(function (e) {
      $('#searchMsg').innerHTML = e && e.error === 'rate_limited'
        ? verdict('wait', 'Çox sayda sorğu göndərildi', 'Bir dəqiqə gözləyib yenidən yoxlayın.')
        : verdict('no', 'Axtarış zamanı xəta baş verdi', '');
    });
  }

  /* Ləğv modalı — səbəb siyahısı şablondan gəlir. */
  function openCancel(d) {
    var t = state.tpl && state.tpl.id === d.templateId ? state.tpl
      : TEMPLATES.filter(function (x) { return x.id === d.templateId; })[0];
    var reasons = (t && t.cancelReasons) || ['Səbəb göstərilmədi'];
    $('#cnlReason').innerHTML = reasons.map(function (r) {
      return '<option value="' + esc(r) + '">' + esc(r) + '</option>';
    }).join('');
    $('#cnlReg').textContent = d.regNo;
    openModal('#cancelModal');
    $('#cnlSend').onclick = function () {
      $('#cnlSend').disabled = true;
      API.cancel(d.regNo, $('#cnlReason').value).then(function (nd) {
        state.doc = nd || d; closeModal('#cancelModal');
        updatePreview(); renderMine();
        toast('Sənəd ləğv edildi');
      }).catch(function (e) { toast(apiError(e, 'Ləğv edilə bilmədi'), 'err'); })
        .then(function () { $('#cnlSend').disabled = false; });
    };
  }

  /* ---------------- mənim sənədlərim ---------------- */
  function renderMine() {
    return API.mine().then(function (list) {
      if (!list || !list.length) {
        $('#myDocs').innerHTML = '<div class="empty" style="border-top:0">Hələ sənəd hazırlamamısınız.</div>';
        return;
      }
      $('#myDocs').innerHTML = list.map(function (d) {
        return '<div class="doc-row">' +
          '<div><h4>' + esc(d.title) + '</h4>' +
          '<div class="meta">' + esc(d.regNo) + ' · ' + esc(d.date) +
            (d.layout ? ' · ' + esc(DOCGEN.LAYOUT_NAMES[d.layout] || d.layout) : '') + '</div></div>' +
          '<div class="acts">' +
            '<span class="state ' + (d.state === 'cancelled' ? 'dra' : (d.paid ? 'pub' : 'dra')) + '">' +
              (d.state === 'cancelled' ? 'Ləğv edilib'
                : d.state === 'expired' ? 'Müddəti bitib'
                : (d.paid ? 'Reyestrdə' : 'Qaralama')) + '</span>' +
            '<button class="btn btn-ghost btn-sm" data-open="' + d.regNo + '" type="button">Aç</button>' +
            '<button class="btn btn-danger btn-sm" data-rep="' + d.regNo + '" type="button">Sil</button>' +
          '</div></div>';
      }).join('');
      $$('#myDocs [data-open]').forEach(function (b) {
        b.onclick = function () {
          var d = list.filter(function (x) { return x.regNo === b.dataset.open; })[0];
          state.doc = d;
          state.tpl = TEMPLATES.filter(function (t) { return t.id === d.templateId; })[0] || state.tpl;
          state.layout = d.layout || null; state.palette = d.palette || null;
          $('#fTitle').value = d.title; $('#fTo').value = d.to; $('#fFrom').value = d.from;
          $('#fPowers').value = d.powers; $('#fPenalty').value = d.penalty;
          renderDesign(); updatePreview();
          document.getElementById('yarat').scrollIntoView({ behavior: 'smooth' });
        };
      });
      $$('#myDocs [data-rep]').forEach(function (b) { b.onclick = function () { openReport(b.dataset.rep); }; });
    });
  }

  /* ---------------- şikayət ---------------- */
  var repTarget = null;
  function openReport(regNo) {
    repTarget = regNo; $('#repReg').textContent = regNo || '—';
    $('#repNote').value = ''; openModal('#reportModal');
  }

  /* ---------------- hero nümunəsi ---------------- */
  function renderSpecimen() {
    var want = MODE_COPY[state.mode].specimen;
    var t = TEMPLATES.filter(function (x) { return x.id === want; })[0] || tplsOf(state.mode)[0] || TEMPLATES[0];
    var to = 'Günel Şəkərova', from = 'Elvin Məmmədov', reg = 'ZRF-2026-4471';
    var doc = {
      templateId: t.id, tone: t.tone || 'zarafat', layout: t.layout, palette: t.palette,
      toLabel: t.toLabel || null, fromLabel: t.fromLabel || null,
      powersLabel: t.powersLabel || null, penaltyLabel: t.penaltyLabel || null,
      title: t.title, to: to, from: from, powers: t.powers, penalty: t.penalty,
      preamble: t.preamble.replace(/\{to\}/g, to).replace(/\{from\}/g, from),
      regNo: reg, date: fmtDate(new Date()), paid: true,
      verifyUrl: SITE + '/r/' + reg
    };
    var el = $('#heroSpecimen');
    if (el) el.innerHTML = DOCGEN.a4(doc, { idPrefix: 'hs' });
  }

  /* ---------------- başlanğıc ---------------- */
  function init() {
    /* Rejim seçimi yaddaşdan bərpa olunur; naməlum dəyər zarafat-a düşür. */
    var saved = LS.get('zrf_mode', 'zarafat');
    state.mode = MODE_COPY[saved] ? saved : 'zarafat';
    var firstCat = catsOf(state.mode)[0];
    if (firstCat) state.cat = firstCat.id;

    renderModeSwitch(); applyModeCopy();
    renderTabs(); renderCards(); renderDesign();
    var first = tplsOf(state.mode)[0];
    if (first) pickTemplate(first.id);
    renderSpecimen();

    /* Delegasiya olunan dinləyici: `#fFields` hər şablon seçimində yenidən qurulur,
       ona görə element səviyyəsində bağlanan dinləyicilər itərdi. */
    var deb;
    function touch() { state.doc = null; clearTimeout(deb); deb = setTimeout(updatePreview, 180); }

    $('#editorForm').addEventListener('input', function (e) {
      var el = e.target, k = el.getAttribute && el.getAttribute('data-fk');
      if (k && state.answers) {
        if (el.hasAttribute('data-free')) {
          state.answers[k] = el.value;
        } else if (el.hasAttribute('data-i')) {
          state.answers[k] = (state.answers[k] || []).slice();
          state.answers[k][parseInt(el.getAttribute('data-i'), 10)] = el.value;
        } else if (el.type === 'range') {
          state.answers[k] = parseInt(el.value, 10);
          var lbl = $('#fFields [data-val="' + k + '"]');
          if (lbl) lbl.textContent = el.value + '/' + el.max;
        } else if (el.tagName === 'SELECT') {
          var free = $('#fFields [data-fk="' + k + '"][data-free]');
          if (free) free.hidden = el.value !== '__free';
          state.answers[k] = el.value === '__free' ? (free ? free.value : '') : el.value;
        } else {
          state.answers[k] = el.value;
        }
      }
      touch();
    });

    /* Çoxseçim düymələri və ad siyahısının əlavə/sil düymələri */
    $('#editorForm').addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('button') : null;
      if (!b) return;

      /* Bənd variantları anket qatından asılı deyil — aşağıdakı `fields`
         yoxlamasından ƏVVƏL gəlməlidir, yoxsa kliklər udulur. */
      var pi = b.getAttribute('data-pow');
      if (pi !== null) { togglePower(parseInt(pi, 10)); return touch(); }

      if (!state.tpl || !state.tpl.fields) return;
      var k = b.getAttribute('data-fk');
      if (!k) return;
      var f = state.tpl.fields.filter(function (x) { return x.k === k; })[0];
      if (!f) return;

      if (b.hasAttribute('data-opt')) {
        var opt = f.opts[parseInt(b.getAttribute('data-opt'), 10)];
        var cur = (state.answers[k] || []).slice(), at = cur.indexOf(opt);
        if (at >= 0) {
          if (cur.length <= (f.min || 1)) return toast('Ən azı ' + (f.min || 1) + ' bənd seçilməlidir', 'err');
          cur.splice(at, 1);
        } else {
          if (cur.length >= (f.max || f.opts.length)) return toast('Ən çoxu ' + (f.max || f.opts.length) + ' bənd seçilə bilər', 'err');
          cur.push(opt);
        }
        state.answers[k] = cur;
        b.setAttribute('aria-pressed', at < 0);
        return touch();
      }

      var act = b.getAttribute('data-list');
      if (act === 'add') {
        var l = (state.answers[k] || []).slice();
        if (l.length >= (f.count || 4)) return toast('Ən çoxu ' + (f.count || 4) + ' ad', 'err');
        l.push(''); state.answers[k] = l; renderFieldsKeepFocus(k); return touch();
      }
      if (act === 'del') {
        var l2 = (state.answers[k] || []).slice();
        if (l2.length <= (f.minCount || 1)) return toast('Ən azı ' + (f.minCount || 1) + ' ad', 'err');
        l2.splice(parseInt(b.getAttribute('data-i'), 10), 1);
        state.answers[k] = l2; renderFieldsKeepFocus(k); return touch();
      }
    });

    var sdeb;
    $('#fSearch').addEventListener('input', function () {
      state.q = $('#fSearch').value;
      clearTimeout(sdeb); sdeb = setTimeout(renderCards, 140);
    });

    $('#btnResetDesign').onclick = function () {
      state.layout = null; state.palette = null; state.doc = null;
      renderDesign(); updatePreview();
    };

    $('#btnCreate').onclick = function () {
      var payload = formDoc();
      delete payload.regNo; delete payload.date; delete payload.paid; delete payload.verifyUrl;
      /* `state` və `cancelReason` serverdə hesablanır — göndərilmir. */
      delete payload.state; delete payload.cancelReason;
      delete payload.regPrefix;
      $('#btnCreate').disabled = true;
      API.create(payload).then(function (d) {
        state.doc = d; updatePreview(); renderMine();
        toast('Sənəd hazırlandı: ' + d.regNo);
        $('#preview').scrollIntoView({ behavior: 'smooth', block: 'center' });
      }).catch(function (e) { toast(apiError(e, 'Sənəd yaradıla bilmədi'), 'err'); })
        .then(function () { $('#btnCreate').disabled = false; });
    };

    $('#btnRandom').onclick = function () {
      var names = ['Elvin Məmmədov', 'Günel Şəkərova', 'Rəşad Quliyev', 'Aysel Hüseynova', 'Tural Əliyev', 'Nərmin Bağırlı'];
      var pick = function () { return names[Math.floor(Math.random() * names.length)]; };
      var a = pick(), b; do { b = pick(); } while (b === a);
      /* Yalnız cari rejimin şablonlarından — əks halda state.cat başqa rejimin
         kateqoriyasına düşüb tabları pozar. */
      var pool = tplsOf(state.mode);
      var t = pool[Math.floor(Math.random() * pool.length)];
      state.cat = t.cat; state.q = ''; $('#fSearch').value = '';
      renderTabs(); pickTemplate(t.id);
      $('#fTo').value = a; $('#fFrom').value = b;
      state.doc = null; updatePreview();
    };

    $('#btnSearch').onclick = doSearch;
    $('#qReg').addEventListener('keydown', function (e) { if (e.key === 'Enter') doSearch(); });

    $('#balanceBtn').onclick = function () { renderPacks(); openModal('#payModal'); };
    $('#reportOpen').onclick = function () { openReport(state.doc ? state.doc.regNo : ''); };

    $$('[data-close]').forEach(function (b) {
      b.onclick = function () { closeModal('#payModal'); closeModal('#reportModal'); closeModal('#cancelModal'); };
    });
    $$('.modal').forEach(function (m) {
      m.addEventListener('click', function (e) { if (e.target === m) m.classList.remove('open'); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeModal('#payModal'); closeModal('#reportModal'); closeModal('#cancelModal'); }
    });

    $('#repSend').onclick = function () {
      if (!repTarget) { toast('Sənəd nömrəsi yoxdur', 'err'); return; }
      API.report(repTarget, $('#repReason').value, $('#repNote').value).then(function (r) {
        closeModal('#reportModal');
        toast(r && r.deleted ? 'Sənəd silindi' : 'Şikayət qeydə alındı');
        if (r && r.deleted && state.doc && state.doc.regNo === repTarget) { state.doc = null; updatePreview(); }
        renderMine();
      }).catch(function (e) { toast(apiError(e, 'Göndərilə bilmədi'), 'err'); });
    };

    var m = location.pathname.match(/\/r\/([A-Za-z]{2,4}-\d{4}-\d{4})/i) || location.hash.match(/#r\/([A-Za-z]{2,4}-\d{4}-\d{4})/i);
    if (m) {
      $('#qReg').value = m[1].toUpperCase();
      setTimeout(function () { doSearch(); document.getElementById('reyestr').scrollIntoView(); }, 300);
    }

    var pay = new URLSearchParams(location.search).get('payment');
    if (pay) {
      history.replaceState({}, '', location.pathname + location.hash);
      if (pay === 'success') toast('Ödəniş qəbul olundu — balans yeniləndi');
      else toast('Ödəniş tamamlanmadı', 'err');
    }

    API.init().then(function () {
      $('#modeBadge').innerHTML = '<span class="dot' + (API.online ? ' live' : '') + '"></span>' +
        (API.online ? 'Server rejimi' : 'Demo rejimi — lokal yaddaş');

      // Kabinet yalnız backend olduqda mövcuddur
      ['#navAccount', '#mastAccount', '#footAccount'].forEach(function (sel) {
        var el = $(sel);
        if (el) el.hidden = !API.online;
      });
      if (!API.online) return null;
      /* Kataloq açılışı gecikdirməsin: sorğu uğursuz olsa statik fayl qalır. */
      return API._json('/api/catalog', null).then(function (cat) {
        if (applyCatalog(cat)) rebuildCatalogViews();
      });
    }).then(function () {
      return refreshCredits();
    }).then(renderMine).then(function () {
      var pending = sessionStorage.getItem('zrf_pending_doc');
      if (pending && pay === 'success' && state.credits > 0) {
        sessionStorage.removeItem('zrf_pending_doc');
        API.mine().then(function (list) {
          var d = (list || []).filter(function (x) { return x.regNo === pending; })[0];
          if (d && !d.paid) { state.doc = d; payFlow(d); }
        });
      }
    });

    updatePreview();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
