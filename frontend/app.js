/* ==================================================================
   Zarafat Notariat Palatası — tətbiq məntiqi
   Backend varsa /api/* istifadə edir, yoxdursa localStorage-a düşür.
   ================================================================== */
(function () {
  'use strict';

  var SITE = location.protocol.indexOf('http') === 0 ? location.origin : 'https://zarafat.az';

  /* Cavab kataloqu ayrıca fayldadır (`replies.js`). Fayl hansısa səbəbdən
     yüklənməyibsə sayt cavab qatı olmadan işləməyə davam etməlidir —
     `TEMPLATES` kimi məcburi asılılıq deyil. */
  window.REPLY_KINDS = window.REPLY_KINDS || [];
  window.REPLY_CATEGORIES = window.REPLY_CATEGORIES || [];
  window.REPLIES = window.REPLIES || [];

  /* Sosial kimlik kartları da ayrıca fayldadır (`sosial.js`) — eyni qayda. */
  window.SOSIAL_KINDS = window.SOSIAL_KINDS || [];
  window.SOSIAL_CATEGORIES = window.SOSIAL_CATEGORIES || [];
  window.SOSIAL_CARDS = window.SOSIAL_CARDS || [];

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
        .then(function (j) {
          API.online = true;
          API.provider = j.provider || 'simulation';
          /* Dəvətnamə bölməsi bağlıdırsa altlıqdakı keçid gizlədilir —
             yoxsa yeganə keçidimiz 404-ə aparardı. Şərt BURADA olmalıdır:
             `index.html`-də Blade direktivi yazmaq olmaz (`build-laravel.js`
             onu rədd edir), ona görə vəziyyət `/api/health`-dən gəlir. */
          var b = j.bolmeler || {};
          if (b.devet === false) {
            var fd = document.getElementById('footDevet');
            if (fd) fd.hidden = true;
          }
        })
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
    /* Sosial profil axtarışı. Oflayn rejimdə (dist, `file://`) kənar sorğu
       mümkün deyil — yalnız linkdən platforma və istifadəçi adı çıxarılır və
       istifadəçi qalan sahələri özü doldurur. */
    sosialProfil: function (url, platform) {
      var parsed = window.SOSIAL_PARSE ? window.SOSIAL_PARSE.parse(url, platform) : null;
      if (!API.online) {
        return Promise.resolve(parsed
          ? { ok: true, social: parsed, avatar: null, source: 'əl', note: null }
          : { ok: false, social: {}, avatar: null, source: 'yox',
              note: 'Link tanınmadı. TikTok və ya Instagram profil linkini yapışdırın.' });
      }
      return API._post('/api/sosial/profil', { url: url, platform: platform || null });
    },

    /* Avatar dərcdən SONRA göndərilir: reyestrdəki nüsxə də şəkilli olsun deyə.
       Gövdə xam JPEG-dir — base64 onu 33% şişirdərdi. Uğursuzluq sənədi
       pozmur, sadəcə baxış səhifəsində siluet çıxır. */
    sosialAvatar: function (regNo, blob) {
      if (!API.online || !blob) return Promise.resolve(null);
      var headers = { 'Content-Type': 'image/jpeg', 'Accept': 'application/json' };
      var m = document.querySelector('meta[name=csrf-token]');
      if (m) headers['X-CSRF-TOKEN'] = m.getAttribute('content');
      return fetch('/api/documents/' + regNo + '/avatar', {
        method: 'POST', credentials: 'same-origin', headers: headers, body: blob
      }).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; });
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

  /* Eksport köməkçiləri `export.js`-dədir — baxış səhifəsi də onları işlədir. */

  /* ---------------- vəziyyət ---------------- */
  var state = {
    mode: 'zarafat',          // 'zarafat' | 'xatire' — sənədin tonu
    cat: 'couples', tpl: null, doc: null, credits: 0, layout: null, palette: null, q: '',
    answers: {},              // anket cavabları — yalnız `fields` daşıyan şablonlarda
    powerPicks: [],           // seçilmiş bəndlər — variant sırasında saxlanılır
    storyBlob: null,          // əvvəlcədən hazırlanmış story şəkli (iOS paylaşma jesti üçün)
    replyTo: null,            // cavab rejimi: {regNo, title, to, from, cat, tone}
    social: null,             // sosial rejim: {platform, username, name, bio, followers, posts, verified}
    avatar: null,             // profil şəkli — `data:` URI; sənədə birbaşa yerləşdirilir
    cardStyle: null           // kart stili — istifadəçi seçimi; boşdursa şablonun öz stili
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

    /* Cavab kataloqu ayrıca açardadır (CatalogService::payload). Ana kataloqla
       birləşdirilsəydi cavab şablonları ana səhifənin şəbəkəsinə düşərdi.
       Server bu açarı göndərmirsə statik replies.js olduğu kimi qalır. */
    if (payload.replies && payload.replies.length) {
      REPLIES.length = 0;
      payload.replies.forEach(function (t) { REPLIES.push(t); });
    }
    if (payload.replyCategories && payload.replyCategories.length) {
      REPLY_CATEGORIES.length = 0;
      payload.replyCategories.forEach(function (c) { REPLY_CATEGORIES.push(c); });
    }

    /* Sosial kartlar da ayrıca açardadır — ana kataloqa qarışsalar kateqoriya
       zolağında «Sosial kimlik kartı» tabı çıxar və `tplsOf()` onları adi
       şablon kimi verərdi. */
    if (payload.socialCards && payload.socialCards.length) {
      SOSIAL_CARDS.length = 0;
      payload.socialCards.forEach(function (t) { SOSIAL_CARDS.push(t); });
    }
    if (payload.socialCategories && payload.socialCategories.length) {
      SOSIAL_CATEGORIES.length = 0;
      payload.socialCategories.forEach(function (c) { SOSIAL_CATEGORIES.push(c); });
    }
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
  /* `active: false` — qaralama şablon. Serverdə `CatalogService` onsuz da
     deaktivləri süzür; bu filtr `dist`/offline rejim üçündür, orada kataloq
     statik fayldan gəlir və heç bir server süzgəcindən keçmir. */
  function tplsOf(mode) {
    return TEMPLATES.filter(function (t) { return t.tone === mode && t.active !== false; });
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
    /* Sosial kartlar yalnız `zarafat` tonundadır: ton dəyişəndə rejimdən
       çıxılır, əks halda kart siyahısı boşalar və panel asılı qalardı. */
    if (state.social) { state.social = null; state.avatar = null; state.socialNote = ''; renderSocialPanel(); }
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
    /* Cavab rejimində kateqoriya zolağı niyyət zolağına çevrilir:
       istifadəçi mövzu deyil, «necə cavab verirəm» seçir. */
    if (state.replyTo) {
      var r = state.replyTo;
      $('#tabs').innerHTML = replyKindsFor(r.tone).map(function (k) {
        var n = repliesFor(r.cat, r.tone, k.k).length;
        return '<button type="button" data-kind="' + k.k + '"' +
          ' aria-pressed="' + (state.cat === k.k) + '">' +
          k.icon + ' ' + esc(k.name) + '<span class="n">' + n + '</span></button>';
      }).join('');
      $('#catBlurb').textContent = 'Cavab növünü seçin — sonra sənəd hazırdır.';
      $$('#tabs button').forEach(function (b) {
        b.onclick = function () {
          state.cat = b.dataset.kind;
          renderTabs(); renderCards();
        };
      });
      return;
    }

    /* Sosial rejimdə zolaq platforma seçicisinə çevrilir. */
    if (state.social) {
      $('#tabs').innerHTML = SOSIAL_KINDS.map(function (k) {
        return '<button type="button" data-sk="' + k.k + '"' +
          ' aria-pressed="' + (state.social.platform === k.k) + '">' +
          k.icon + ' ' + esc(k.name) +
          '<span class="n">' + sosialCardsFor(k.k).length + '</span></button>';
      }).join('');
      $('#catBlurb').textContent = 'Kartın dizaynını seçin — məlumatlar profildən gəlir.';
      $$('#tabs button').forEach(function (b) {
        b.onclick = function () {
          state.social.platform = b.dataset.sk;
          state.cat = b.dataset.sk;
          renderTabs(); renderCards(); renderSocialPanel();
          var pool = sosialCardsFor(state.social.platform);
          if (pool.length && (!state.tpl || pool.indexOf(state.tpl) < 0)) pickTemplate(pool[0].id);
          else updatePreview();
        };
      });
      return;
    }

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
    var q = state.q.trim(), list, pool = TEMPLATES;

    if (state.replyTo) {
      /* Cavab rejimi: `state.cat` kateqoriya deyil, seçilmiş niyyətdir.
         Niyyət seçilməyibsə bütün uyğun cavablar göstərilir («öz cavabımı seç»). */
      var r = state.replyTo;
      pool = REPLIES;
      var kind = replyKindsFor(r.tone).some(function (k) { return k.k === state.cat; }) ? state.cat : null;
      list = repliesFor(r.cat, r.tone, kind).filter(function (t) { return matches(t, q); });
    } else if (state.social) {
      /* Sosial rejim: `state.cat` seçilmiş platformadır. */
      pool = SOSIAL_CARDS;
      list = sosialCardsFor(state.social.platform).filter(function (t) { return matches(t, q); });
    } else {
      /* Axtarış da rejim daxilində işləyir — başqa tonun şablonu siyahıya düşmür. */
      list = tplsOf(state.mode).filter(function (t) { return (q ? true : t.cat === state.cat) && matches(t, q); });
    }

    $('#cardsEmpty').hidden = list.length > 0;
    $('#cards').innerHTML = list.map(function (t, i) {
      var idx = pool.indexOf(t) + 1;
      return '<button type="button" class="tmpl" data-tpl="' + t.id + '"' +
        ' aria-pressed="' + (!!state.tpl && state.tpl.id === t.id) + '"' +
        ' style="border-left-color:' + LAYOUT_EDGE[t.layout] + '">' +
        '<span class="code">' + (state.replyTo ? 'CVB-' : (state.social ? 'SOS-' : 'ZNP-')) +
          String(idx).padStart(3, '0') + ' · ' + esc(t.tag) + '</span>' +
        '<h3>' + esc(t.title) + '</h3>' +
        '<span class="desc">' + esc(t.powers.split('\n')[0]) + '</span>' +
        '<span class="foot"><span>' + esc(DOCGEN.LAYOUT_NAMES[t.layout]) + '</span></span>' +
        '</button>';
    }).join('');
    $$('#cards button').forEach(function (b) { b.onclick = function () { pickTemplate(b.dataset.tpl); }; });
  }

  /* ---------------- cavab rejimi ----------------
     `/?cavab=REG&tip=KIND` ilə gəlindikdə redaktor cavab sənədi qurur:
     kart şəbəkəsi uyğun cavab şablonlarını göstərir, adlar orijinaldan
     doldurulur, `formDoc()` isə `replyTo` açarını əlavə edir.

     Kilid burada DEYİL: server valideyni, tonu və kateqoriya uyğunluğunu
     özü yoxlayır (`DocumentService::resolveParent`). Bu qat yalnız rahatlıqdır. */

  /* Orijinalın kateqoriyasına və tona uyğun cavab şablonları.
     `replyCats` yoxdursa şablon universaldır. Mövzuya uyğun şablon tapılmasa
     universal dəst qaytarılır — istifadəçi heç vaxt boş siyahı görmür. */
  function repliesFor(cat, tone, kind) {
    var pool = REPLIES.filter(function (t) {
      if (t.tone !== tone) return false;
      return !kind || t.replyKind === kind;
    });
    var themed = pool.filter(function (t) {
      return Array.isArray(t.replyCats) && t.replyCats.indexOf(cat) >= 0;
    });
    var universal = pool.filter(function (t) { return !t.replyCats; });
    return themed.length ? themed.concat(universal) : universal;
  }

  /* Zəncirin MÖVZU kateqoriyası — serverdəki `DocumentService::topicOf()` güzgüsü.
     Cavab sənədinin öz kateqoriyası niyyət kateqoriyasıdır (`c-redd`) və mövzunu
     göstərmir, ona görə server onu `documents.reply_topic` sütununda saxlayır.
     Adi sənəddə isə mövzu şablonun kateqoriyasıdır. */
  function catOfDoc(d) {
    if (d.replyTopic) return d.replyTopic;
    var t = TEMPLATES.filter(function (x) { return x.id === d.templateId; })[0];
    return t ? t.cat : null;
  }

  function replyKindsFor(tone) {
    return REPLY_KINDS.filter(function (k) { return k.tone === tone; });
  }

  function renderReplyBar() {
    var bar = $('#replyBar'), r = state.replyTo;
    if (!r) { bar.hidden = true; return; }
    bar.innerHTML =
      '<div class="reply-bar-main">' +
        '<b>↩ Cavab sənədi hazırlanır</b>' +
        '<span>Cavab verilir: <a href="/r/' + esc(r.regNo) + '" class="mono">' + esc(r.regNo) + '</a>' +
        (r.title ? ' — «' + esc(r.title) + '»' : '') + '</span>' +
      '</div>' +
      '<div class="reply-bar-acts">' +
        '<button type="button" class="chip btn-sm" id="replyDice">🎲 Mənim yerimə seç</button>' +
        '<button type="button" class="chip btn-sm" id="replyExit">Cavab rejimindən çıx</button>' +
      '</div>';
    bar.hidden = false;

    $('#replyDice').onclick = function () {
      var pool = repliesFor(r.cat, r.tone, null);
      if (!pool.length) return;
      pickTemplate(pool[Math.floor(Math.random() * pool.length)].id);
      $('#preview').scrollIntoView({ behavior: 'smooth', block: 'center' });
    };
    $('#replyExit').onclick = exitReplyMode;
  }

  function exitReplyMode() {
    state.replyTo = null;
    state.doc = null; state.tpl = null; state.layout = null; state.palette = null;
    renderReplyBar();
    renderTabs(); renderCards();
    var t = tplsOf(state.mode)[0];
    if (t) pickTemplate(t.id); else { renderDesign(); updatePreview(); }
  }

  /* ---------------- sosial kimlik kartı rejimi ----------------
     İstifadəçi TikTok/Instagram linkini yapışdırır; `SOSIAL_PARSE` platformanı
     və istifadəçi adını çıxarır, server isə profilin qalan sahələrini «ən yaxşı
     cəhd» ilə gətirir. Gəlməsə heç nə pozulmur — sahələr boş qalır və istifadəçi
     özü doldurur. Bütün dəyərlər onsuz da redaktə edilə biləndir.

     Kilid burada DEYİL: server bloku `Sosial::clean()` ilə təmizləyir, mətni isə
     həmişəki kimi kataloqdan qurur (`DocumentService::create`). */

  /* Seçilmiş platformaya uyğun kartlar. `socialKind` boş olan kart hər ikisinə
     yarayır — istifadəçi heç vaxt boş siyahı görmür. */
  function sosialCardsFor(platform) {
    return SOSIAL_CARDS.filter(function (t) {
      return t.active !== false && (!t.socialKind || t.socialKind === platform);
    });
  }

  function sosialKindOf(k) {
    return SOSIAL_KINDS.filter(function (x) { return x.k === k; })[0] || null;
  }

  /* `{{username}}` · `{{followers}}` · `{{posts}}` dəyərləri.
     Server güzgüsü: App\Support\Sosial\Sosial::vals(). `DOCGEN` say formatını
     ixrac etmir, ona görə eyni funksiya burada da var — üçüncü nüsxə DEYİL,
     `sosial.js` onu `SOSIAL_VALS`-a ötürür. */
  function sosialSayi(n) {
    if (n === null || n === undefined || n === '') return '—';
    n = Number(n);
    if (!isFinite(n) || n < 0) return '—';
    n = Math.floor(n);
    if (n < 1000) return String(n);
    var v = n < 1000000 ? Math.round(n / 100) / 10 : Math.round(n / 100000) / 10;
    return String(v).replace('.', ',') + (n < 1000000 ? ' K' : ' M');
  }

  function sosialVals() {
    if (!state.social || !window.SOSIAL_VALS) return {};
    return window.SOSIAL_VALS(state.social, sosialSayi);
  }

  /* Şəkli mərkəzdən kvadrat kəsib 256×256 JPEG `data:` URI-yə çevirir.
     Serverin avatar yoxlaması məhz bu ölçünü tələb edir. */
  var AVATAR_SIZE = 256;

  function avatarFromFile(file) {
    return new Promise(function (res, rej) {
      if (!file || file.size > 8 * 1024 * 1024) { rej(new Error('böyük')); return; }
      var fr = new FileReader();
      fr.onerror = function () { rej(new Error('oxunmadı')); };
      fr.onload = function () {
        var img = new Image();
        img.onerror = function () { rej(new Error('şəkil deyil')); };
        img.onload = function () {
          var c = document.createElement('canvas');
          c.width = c.height = AVATAR_SIZE;
          var x = c.getContext('2d');
          x.fillStyle = '#ffffff'; x.fillRect(0, 0, AVATAR_SIZE, AVATAR_SIZE);
          var s = Math.min(img.width, img.height);
          x.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, AVATAR_SIZE, AVATAR_SIZE);
          res(c.toDataURL('image/jpeg', 0.88));
        };
        img.src = fr.result;
      };
      fr.readAsDataURL(file);
    });
  }

  /* `data:` URI → Blob. Dərcdən sonra serverə xam JPEG göndərmək üçün. */
  function avatarBlob(uri) {
    if (!uri || uri.indexOf('data:image/jpeg;base64,') !== 0) return null;
    try {
      var bin = atob(uri.slice('data:image/jpeg;base64,'.length));
      var buf = new Uint8Array(bin.length);
      for (var i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
      return new Blob([buf], { type: 'image/jpeg' });
    } catch (e) { return null; }
  }

  /* Kartın üzərində görünən HƏR sahə buradan redaktə oluna bilməlidir —
     `doc.js kartOn()` dördünü də çəkir. */
  var SOSIAL_FIELDS = [
    { k: 'name',      label: 'Görünən ad',    type: 'text',   max: 40 },
    { k: 'followers', label: 'İzləyici sayı', type: 'number' },
    { k: 'posts',     label: 'Paylaşım sayı', type: 'number' },
    { k: 'following', label: 'İzlənilən sayı', type: 'number' }
  ];

  function renderSocialPanel() {
    var box = $('#socialPanel');
    if (!box) return;
    if (!state.social) { box.hidden = true; box.innerHTML = ''; return; }

    var s = state.social, kind = sosialKindOf(s.platform);
    box.hidden = false;
    box.innerHTML =
      '<div class="sos-head">' +
        '<div class="sos-av">' +
          (state.avatar ? '<img src="' + esc(state.avatar) + '" alt="">' : '<span>foto</span>') +
        '</div>' +
        '<div class="sos-id">' +
          '<strong>@' + esc(s.username || '—') + '</strong>' +
          '<span>' + esc(kind ? kind.name : '—') + '</span>' +
        '</div>' +
        '<div class="sos-act">' +
          '<label class="btn ghost sm">Şəkil seç<input type="file" id="sosAvatar" accept="image/*" hidden></label>' +
          (state.avatar ? '<button type="button" class="btn ghost sm" id="sosAvatarDel">Sil</button>' : '') +
          '<button type="button" class="btn ghost sm" id="sosExit">Başqa profil</button>' +
        '</div>' +
      '</div>' +
      '<div class="sos-grid">' + SOSIAL_FIELDS.map(function (f) {
        var v = s[f.k];
        return '<label class="f"><span>' + esc(f.label) + '</span>' +
          '<input type="' + f.type + '" data-sos="' + f.k + '"' +
          (f.max ? ' maxlength="' + f.max + '"' : ' min="0"') +
          ' value="' + esc(v === null || v === undefined ? '' : String(v)) + '"' +
          ' placeholder="—"></label>';
      }).join('') + '</div>' +
      '<p class="hint" id="sosNote">' + esc(state.socialNote || '') + '</p>';

    var file = $('#sosAvatar');
    if (file) file.onchange = function () {
      var f = file.files && file.files[0];
      if (!f) return;
      avatarFromFile(f).then(function (uri) {
        state.avatar = uri; renderSocialPanel(); updatePreview();
      }).catch(function () { toast('Şəkil oxunmadı — başqa fayl seçin', 'err'); });
    };
    var del = $('#sosAvatarDel');
    if (del) del.onclick = function () { state.avatar = null; renderSocialPanel(); updatePreview(); };
    $('#sosExit').onclick = exitSocialMode;

    /* Sahələr `state.social`-ı birbaşa yeniləyir — panel şablon dəyişəndə
       yenidən qurulduğu üçün dinləyici hər dəfə bağlanır. */
    $$('#socialPanel input[data-sos]').forEach(function (el) {
      el.oninput = function () {
        var k = el.dataset.sos, v = el.value;
        if (el.type === 'number') {
          v = v.replace(/[^\d]/g, '');
          state.social[k] = v === '' ? null : Math.min(999999999, parseInt(v, 10));
        } else {
          state.social[k] = v.trim();
        }
        touch();
      };
    });
  }

  function exitSocialMode() {
    state.social = null; state.avatar = null; state.socialNote = ''; state.cardStyle = null;
    state.doc = null; state.tpl = null; state.layout = null; state.palette = null;
    renderSocialPanel();
    renderTabs(); renderCards();
    var t = tplsOf(state.mode)[0];
    if (t) pickTemplate(t.id); else { renderDesign(); updatePreview(); }
  }

  /* Yapışdırılan mətndən kart rejimini açır. */
  function enterSocialMode(paste, platform) {
    if (!SOSIAL_CARDS.length) {
      toast('Sosial kart kataloqu yüklənməyib', 'err');
      return Promise.resolve();
    }
    return API.sosialProfil(paste, platform).then(function (r) {
      if (!r || !r.ok || !r.social || !r.social.username) {
        toast((r && r.note) || 'Link tanınmadı', 'err');
        return;
      }

      /* Kartlar yalnız `zarafat` tonundadır — cavab rejimindəki kimi
         `setMode()` çağırılmır, o sosial vəziyyəti sıfırlayardı. */
      if (state.mode !== 'zarafat' && MODE_COPY.zarafat) {
        state.mode = 'zarafat';
        LS.set('zrf_mode', 'zarafat');
        renderModeSwitch(); applyModeCopy(); renderSpecimen();
      }

      state.replyTo = null;
      state.social = r.social;
      state.avatar = r.avatar || null;
      state.socialNote = r.note || '';
      state.cat = r.social.platform;
      state.q = '';
      if ($('#fSearch')) $('#fSearch').value = '';

      var pool = sosialCardsFor(r.social.platform);
      if (!pool.length) {
        state.social = null;
        toast('Bu platforma üçün kart tapılmadı', 'err');
        return;
      }

      renderSocialPanel();
      renderTabs(); renderCards();
      pickTemplate(pool[0].id);

      $('#yarat').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }).catch(function (e) {
      toast(apiError(e, 'Profil yüklənə bilmədi'), 'err');
    });
  }

  /* Ölçmə — `viewer.js` `track()` ilə eyni müqavilə. Səhvi udur. */
  function track(event, kind, regNo) {
    if (!API.online) return;
    API._post('/api/olcu', { event: event, regNo: regNo || null, kind: kind || null })
      .catch(function () {});
  }

  function enterReplyMode(reg, kind) {
    return API.lookup(normReg(reg)).then(function (d) {
      if (!d || !d.regNo) {
        toast('Cavab verilən sənəd reyestrdə tapılmadı', 'err');
        return;
      }

      var tone = d.tone === 'xatire' ? 'xatire' : 'zarafat';
      var cat  = catOfDoc(d);

      /* Rejim orijinalın tonuna keçir. `setMode()` yaramır — o, cavab
         vəziyyətini də sıfırlayıb istifadəçini adi kataloqa qaytarardı. */
      if (state.mode !== tone && MODE_COPY[tone]) {
        state.mode = tone;
        LS.set('zrf_mode', tone);
        renderModeSwitch(); applyModeCopy(); renderSpecimen();
      }

      /* İki rejim eyni anda ola bilməz — kart şəbəkəsi hansı kataloqdan
         qurulacağını bilməzdi. */
      if (state.social) { state.social = null; state.avatar = null; state.socialNote = ''; renderSocialPanel(); }

      state.replyTo = { regNo: d.regNo, title: d.title, to: d.to, from: d.from, cat: cat, tone: tone };
      state.q = '';
      if ($('#fSearch')) $('#fSearch').value = '';

      var pool = repliesFor(cat, tone, kind === 'random' ? null : kind);
      if (!pool.length) pool = repliesFor(cat, tone, null);
      if (!pool.length) {
        state.replyTo = null;
        toast('Bu sənəd üçün cavab variantı tapılmadı', 'err');
        return;
      }

      var chosen = (kind === 'random' || !kind)
        ? pool[kind === 'random' ? Math.floor(Math.random() * pool.length) : 0]
        : pool[0];

      renderReplyBar();
      renderTabs(); renderCards();
      pickTemplate(chosen.id);

      /* Adlar orijinaldan gəlir — istifadəçi heç nə yazmır (§4).
         Hər ikisi redaktə oluna bilər. */
      if (!$('#fNamesRow').hidden) {
        if (d.to) $('#fTo').value = d.to;
        if (d.from) $('#fFrom').value = d.from;
        updatePreview();
      }

      $('#yarat').scrollIntoView({ behavior: 'smooth', block: 'start' });
      track('reply_open', kind === 'random' ? null : kind, d.regNo);
    }).catch(function () {
      toast('Cavab verilən sənəd yüklənə bilmədi', 'err');
    });
  }

  function pickTemplate(id) {
    /* Cavab rejimində şablon cavab kataloqundan da gələ bilər. */
    var t = TEMPLATES.filter(function (x) { return x.id === id; })[0] ||
      (state.replyTo ? REPLIES.filter(function (x) { return x.id === id; })[0] : null) ||
      (state.social ? SOSIAL_CARDS.filter(function (x) { return x.id === id; })[0] : null);
    if (!t) return;
    state.tpl = t; state.doc = null;
    state.layout = null; state.palette = null; state.cardStyle = null;
    renderPicks();
    renderFields();
    /* Anketli şablonda bəndlər `notes`-dan gəlir — sərbəst mətn sahəsi yalnız
       qarışıqlıq yaradardı, ona görə gizlədilir. */
    var anket = !!(t.fields && t.fields.length);
    $('#fPowersField').hidden  = anket;
    $('#fTitleField').hidden   = anket;
    $('#fPenaltyField').hidden = anket;
    /* Sosial kartda adlar profildən gəlir — sərbəst ad sahələri yalnız
       ziddiyyət yaradardı (panel «Görünən ad»ı onsuz da redaktə edir). */
    $('#fNamesRow').hidden     = anket || !!state.social;
    renderCards(); renderDesign(); updatePreview();
  }

  /* ---------------- blank forması seçicisi ---------------- */
  var KART_ICON = {
    resmi: '<rect x="2" y="4" width="32" height="18" rx="3" stroke="currentColor" stroke-width="1.6"/>' +
           '<rect x="2" y="4" width="32" height="5" fill="currentColor" opacity="0.5"/>' +
           '<rect x="5" y="12" width="8" height="8" rx="1.5" fill="currentColor" opacity="0.35"/>',
    tund:  '<rect x="2" y="4" width="32" height="18" rx="3" fill="currentColor" opacity="0.75"/>' +
           '<rect x="5" y="12" width="8" height="8" rx="1.5" fill="#fff" opacity="0.7"/>' +
           '<circle cx="29" cy="9" r="4" fill="#fff" opacity="0.35"/>',
    sade:  '<rect x="2" y="4" width="32" height="18" rx="3" stroke="currentColor" stroke-width="1.6"/>' +
           '<rect x="2" y="4" width="3" height="18" fill="currentColor"/>' +
           '<rect x="9" y="12" width="8" height="8" rx="1.5" fill="currentColor" opacity="0.3"/>'
  };

  function curCardStyle() {
    return state.cardStyle || (state.tpl && state.tpl.cardStyle) || DOCGEN.KART_STILLER[0];
  }

  function renderDesign() {
    var L = curLayout(), P = curPalette();

    /* Sosial kartda blank forması seçimi mənasızdır — kart `LAYOUTS`
       reyestrindən kənardadır. Onun yerinə kart stilləri göstərilir. */
    if (state.social) {
      var CS = curCardStyle();
      if ($('#designLabel')) $('#designLabel').textContent = 'Kartın stili';
      if ($('#btnResetDesign')) $('#btnResetDesign').textContent = 'Şablonun öz stili';
      $('#layoutPicker').innerHTML = DOCGEN.KART_STILLER.map(function (id) {
        return '<button type="button" data-cardstyle="' + id + '" aria-pressed="' + (id === CS) + '"' +
          ' title="' + esc(DOCGEN.KART_STIL_ADI[id]) + '">' +
          '<svg width="36" height="26" viewBox="0 0 36 26" fill="none" style="color:' +
          (id === CS ? LAYOUT_EDGE.vesiqe : '#8a8c93') + '">' + KART_ICON[id] + '</svg>' +
          '<span>' + esc(DOCGEN.KART_STIL_ADI[id]) + '</span></button>';
      }).join('');
      $('#palettePicker').innerHTML = DOCGEN.PALETTES.map(function (id) {
        return '<button type="button" data-palette="' + id + '" aria-pressed="' + (id === P) + '">' +
          '<span class="swatch" style="background:' + PAL_SWATCH[id] + '"></span>' + PAL_LABEL[id] + '</button>';
      }).join('');
      $$('#layoutPicker button').forEach(function (b) {
        b.onclick = function () { state.cardStyle = b.dataset.cardstyle; state.doc = null; renderDesign(); updatePreview(); };
      });
      $$('#palettePicker button').forEach(function (b) {
        b.onclick = function () { state.palette = b.dataset.palette; state.doc = null; renderDesign(); updatePreview(); };
      });
      return;
    }

    if ($('#designLabel')) $('#designLabel').textContent = 'Blank forması';
    if ($('#btnResetDesign')) $('#btnResetDesign').textContent = 'Şablonun öz forması';

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
    /* Defolt seçim MAKSİMUMDUR, minimum deyil: sənəd variantsız şablonlarda
       olduğu kimi dörd bəndlə açılsın. Minimumla açılsaydı `togglePower()`
       bəndi çıxarmağa da imkan verməzdi (aşağı hədd artıq tutulmuş olardı). */
    state.powerPicks = pOpts.slice(0, rng[1]);

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
    /* Sosial kartda adlar profildən gəlir: `to` — kartın sahibi, `from` —
       platformanın adı, ona görə preamble «{from} platformasında…» oxunur. */
    var sv = sosialVals(), sk = state.social ? sosialKindOf(state.social.platform) : null;
    var to   = (state.social ? (state.social.name || sv.username) : '') ||
               (F && F.into.to)   || (freeNames ? $('#fTo').value.trim()   : '') || 'Ad Soyad';
    var from = (sk ? sk.name : '') ||
               (F && F.into.from) || (freeNames ? $('#fFrom').value.trim() : '') || 'Ad Soyad';
    var pre = (t.preamble || '').replace(/\{to\}/g, to).replace(/\{from\}/g, from);
    if (F) pre = fill(pre, F.vals);
    if (state.social) pre = fill(pre, sv);
    /* Hibrid qat: cavablar həm struktur bloklara, həm də `powers`-ə düşür ki,
       anketli şablon istifadəçi dizaynı dəyişdikdə köhnə on dizaynda da oxunsun. */
    var extra = F ? {
      powers: (F.checks.length ? F.checks : (F.notes || [])).join('\n') || t.powers,
      data: F.data, checks: F.checks, scale: F.scale, notes: F.notes,
      /* Təmizlənmiş cavablar — PHP backend preamble-ın `{{açar}}` yer
         tutucularını serverdə bunlardan doldurur (App\Support\Answers). */
      answers: F.vals,
      until: F.until, expiresAt: F.expiresAt,
      share: t.share ? fill(t.share, F.vals) : null,
      state: 'active', cancelReason: null
    } : {};
    return Object.assign({
      templateId: t.id,
      tone: t.tone || 'zarafat',
      layout: curLayout(), palette: curPalette(),
      /* İmzalayan orqan hər şablonda var — anketli olub-olmamasından asılı deyil. */
      signTitle: t.signTitle || null, signOrg: t.signOrg || null,
      toLabel: t.toLabel || null, fromLabel: t.fromLabel || null,
      powersLabel: t.powersLabel || null, penaltyLabel: t.penaltyLabel || null,
      title: (F && F.into.title) || $('#fTitle').value.trim() || t.title,
      to: to, from: from,
      powers: $('#fPowers').value,
      penalty: $('#fPenalty').value.trim(),
      /* PHP backend preamble-ı şablondan özü qurur və bu dəyəri oxumur;
         sətir arxiv `backend-node/` üçün saxlanılır. */
      preamble: pre,
      /* Cavab bağlantısı. `doc.js` `inner()` məhz bu açara baxıb künc lentini
         çəkir, server isə valideyni bu nömrədən həll edir. */
      replyTo: state.replyTo ? state.replyTo.regNo : null,
      /* Sosial kimlik kartı. `doc.js` `L_vesiqe` bu iki açara baxıb sətirləri
         və foto xanasını dəyişir; ikisi də yoxdursa çıxış əvvəlki kimi qalır. */
      social: state.social || null,
      avatar: state.avatar || null,
      /* Kartın stili şablondan gəlir; istifadəçi onu dizayn seçicisindən dəyişə bilir. */
      cardStyle: state.cardStyle || t.cardStyle || null,
      regNo: regPrefix(t) + '-' + new Date().getFullYear() + '-————',
      date: fmtDate(new Date()),
      paid: false, verifyUrl: ''
    }, extra, base || {});
  }

  /* Önizləməni gecikdirilmiş yeniləyir. Modul səviyyəsindədir, çünki həm
     `init()`-dəki forma dinləyiciləri, həm də `renderSocialPanel()` onu çağırır. */
  var _deb = null;
  function touch() { state.doc = null; clearTimeout(_deb); _deb = setTimeout(updatePreview, 180); }

  function updatePreview() {
    var doc = state.doc || formDoc();
    /* `sheet()` formatı özü seçir: sosial profil varsa kimlik kartı (1080×1350,
       iki üzlü), yoxsa adi A4 sənəd. Çağıran tərəf fərqi bilməməlidir. */
    $('#preview').innerHTML = DOCGEN.sheet(doc, { idPrefix: 'pv' }).svg;
    $('#regBadge').textContent = doc.regNo;
    renderActions();
  }

  /* ---------------- paylaşım mətni ----------------
     `viewer.js` `shareMeta()` ilə eyni qayda: şablonun öz mətni → cavab
     sənədinin viral cümləsi → ümumi mətn. */
  function docLink(d) { return d.verifyUrl || (SITE + '/r/' + d.regNo); }

  function shareLead(d) {
    if (d.share) return d.share;
    if (d.replyTo) return 'Sənədinizə cavab verildi. Reyestrdə yoxlayın 😂';
    return 'Zarafat Notariat Palatası — ' + d.regNo;
  }

  function shareText(d) { return shareLead(d) + '\n' + docLink(d); }

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
    /* PDF sənəd yaradılan kimi əlçatandır; keyfiyyət `paid`-i izləyir — kodda
       tək keyfiyyət anlayışı qalsın deyə eynilə PNG-dəki 2/3 bölgüsü. */
    html += '<button id="aPdf" class="btn btn-ghost" type="button">PDF yüklə</button>';
    if (!d.paid) {
      html += '<button id="aPay" class="btn span2" type="button">1 AZN — reyestrə yaz</button>';
    } else {
      html += '<button id="aHd" class="btn" type="button">HD PNG yüklə</button>';
      html += '<button id="aStory" class="btn btn-ghost" type="button">' +
        (ZEXPORT.canShareFiles() ? 'Story paylaş' : 'Story formatı') + '</button>';
      html += '<button id="aLink" class="btn btn-ghost" type="button">Reyestr linki</button>';
      /* Mesajlaşma tətbiqlərinə birbaşa keçid. `navigator.share` yalnız
         telefonlarda var — bu iki düymə masaüstündə də işləyir. */
      html += '<button id="aWa" class="btn btn-ghost" type="button">WhatsApp</button>';
      html += '<button id="aTg" class="btn btn-ghost" type="button">Telegram</button>';
      if (d.share || d.replyTo)
        html += '<button id="aShare" class="btn btn-ghost span2" type="button">Paylaşım mətnini kopyala</button>';
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
    if ((b = $('#aPdf')))   b.onclick = function () { downloadPdf(d); };
    if ((b = $('#aStory'))) b.onclick = function () { shareStory(d); };
    if ((b = $('#aPay')))   b.onclick = function () { payFlow(d); };
    if ((b = $('#aCancel'))) b.onclick = function () { openCancel(d); };
    if ((b = $('#aShare'))) b.onclick = function () {
      navigator.clipboard.writeText(shareText(d))
        .then(function () { toast('Paylaşım mətni kopyalandı'); })
        .catch(function () { toast('Kopyalamaq alınmadı', 'err'); });
    };
    if ((b = $('#aLink')))  b.onclick = function () {
      navigator.clipboard.writeText(docLink(d))
        .then(function () { toast('Link kopyalandı'); })
        .catch(function () { toast('Kopyalamaq alınmadı', 'err'); });
    };
    if ((b = $('#aWa'))) b.onclick = function () {
      if (d.replyTo) track('reply_shared', null, d.regNo);
      window.open('https://wa.me/?text=' + encodeURIComponent(shareText(d)), '_blank', 'noopener');
    };
    if ((b = $('#aTg'))) b.onclick = function () {
      if (d.replyTo) track('reply_shared', null, d.regNo);
      /* Telegram `url` və `text`-i ayrı gözləyir; link `url`-də getdiyi üçün
         mətnə təkrar salınmır. */
      window.open('https://t.me/share/url?url=' + encodeURIComponent(docLink(d)) +
        '&text=' + encodeURIComponent(shareLead(d)), '_blank', 'noopener');
    };
    if ((b = $('#aReport'))) b.onclick = function () { openReport(d.regNo); };

    /* iOS `navigator.share()`-i yalnız jest tapşırığının İÇİNDƏ qəbul edir,
       rasterləşdirmə isə asinxrondur. Ona görə story şəklini indidən hazırlayıb
       keşləyirik — klik anında hazır olsun. RegNo başına bir dəfə. */
    if (d.paid && ZEXPORT.canShareFiles() &&
        (!state.storyBlob || state.storyBlob.regNo !== d.regNo)) {
      state.storyBlob = { regNo: d.regNo, blob: null };
      (function () { var sh = DOCGEN.share(d, { idPrefix: 'sh' });
      return ZEXPORT.pngBlob(sh.svg, sh.w, sh.h, 1); })()
        .then(function (b) {
          if (state.storyBlob && state.storyBlob.regNo === d.regNo) state.storyBlob.blob = b;
        })
        .catch(function () { state.storyBlob = null; });
    }
  }

  function downloadPdf(doc) {
    toast('PDF hazırlanır…');
    var sh = DOCGEN.sheet(doc, { idPrefix: 'ex' });
    ZEXPORT.pdfBlob(sh.svg, sh.w, sh.h, doc.paid ? 3 : 2, doc.regNo).then(function (b) {
      ZEXPORT.saveBlob(b, 'zarafat-' + ZEXPORT.safeName(doc.regNo) + '.pdf');
      toast('PDF yükləndi');
    }).catch(function () { toast('PDF yaratmaq alınmadı', 'err'); });
  }

  /* Mobildə nativ paylaşma vərəqi, masaüstündə yükləmə. */
  function shareStory(doc) {
    var name = 'zarafat-' + ZEXPORT.safeName(doc.regNo) + '-story.png';
    var meta = { title: 'Zarafat sənədi ' + doc.regNo, text: shareText(doc) };
    if (doc.replyTo) track('reply_shared', null, doc.regNo);

    function fallback(b) { ZEXPORT.saveBlob(b, name); toast('Story şəkli yükləndi'); }

    var cached = state.storyBlob && state.storyBlob.regNo === doc.regNo ? state.storyBlob.blob : null;

    if (cached && ZEXPORT.canShareFiles()) {
      /* Keş isti — sinxron çağırış, iOS jest zəncirini pozmuruq. */
      ZEXPORT.shareFile(cached, name, 'image/png', meta).catch(function (e) {
        if (ZEXPORT.isAbort(e)) return;
        fallback(cached);
      });
      return;
    }

    toast('Şəkil hazırlanır…');
    var shs = DOCGEN.share(doc, { idPrefix: 'sh' });
    ZEXPORT.pngBlob(shs.svg, shs.w, shs.h, 1)
      .then(function (b) {
        if (!ZEXPORT.canShareFiles()) return fallback(b);
        return ZEXPORT.shareFile(b, name, 'image/png', meta).catch(function (e) {
          if (ZEXPORT.isAbort(e)) return;
          fallback(b);
        });
      })
      .catch(function () { toast('Şəkli yaratmaq alınmadı', 'err'); });
  }

  function download(doc, isStory, scale) {
    var o = isStory ? DOCGEN.share(doc, { idPrefix: 'ex' }) : DOCGEN.sheet(doc, { idPrefix: 'ex' });
    toast('Şəkil hazırlanır…');
    ZEXPORT.pngBlob(o.svg, o.w, o.h, scale).then(function (b) {
      ZEXPORT.saveBlob(b, 'zarafat-' + ZEXPORT.safeName(doc.regNo) + (isStory ? '-story' : '') + '.png');
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
      /* Avatar dərcdən SONRA gedir ki, reyestrdəki nüsxə də şəkilli olsun.
         Uğursuzluq sənədi pozmur — baxış səhifəsində sadəcə siluet çıxar. */
      var av = state.avatar ? API.sosialAvatar(d.regNo, avatarBlob(state.avatar)) : Promise.resolve(null);
      return av.then(function () { return refreshCredits(); }).then(function () {
        /* Server `avatarUrl` qaytarır, amma önizləmə onsuz da `state.avatar`
           daşıyır — sənəd obyektindəki `avatar` açarını itirməmək üçün. */
        if (state.avatar) state.doc.avatar = state.avatar;
        if (state.social) state.doc.social = state.social;
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
        '<div class="sheet-wrap"><div class="paper">' + DOCGEN.sheet(d, { idPrefix: 'sr', verified: true }).svg + '</div></div>' +
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
          '<div><h4>' + (d.replyTo ? '↩ ' : '') + esc(d.title) + '</h4>' +
          '<div class="meta">' + esc(d.regNo) + ' · ' + esc(d.date) +
            (d.layout ? ' · ' + esc(DOCGEN.LAYOUT_NAMES[d.layout] || d.layout) : '') +
            /* Cavab sənədində valideynə keçid — zəncir kabinetdən də görünsün. */
            (d.replyTo ? ' · cavab: <a href="/r/' + esc(d.replyTo) + '">' + esc(d.replyTo) + '</a>' : '') +
            (d.replyCount ? ' · ' + d.replyCount + ' cavab' : '') + '</div></div>' +
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
       ona görə element səviyyəsində bağlanan dinləyicilər itərdi.
       `touch()` modul səviyyəsindədir — sosial panel də onu işlədir. */

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

    /* Sosial kart girişi. `sosial.js` yüklənməyibsə qutu heç göstərilmir. */
    if ($('#sosialBox')) {
      $('#sosialBox').hidden = !SOSIAL_CARDS.length;
      $('#sosialGo').onclick = function () {
        var v = $('#sosialUrl').value.trim();
        if (!v) { toast('Profil linkini yapışdırın', 'err'); return; }
        var plat = $('#sosialPlat') ? $('#sosialPlat').value : null;
        $('#sosialGo').disabled = true;
        enterSocialMode(v, plat).then(function () { $('#sosialGo').disabled = false; });
      };
      $('#sosialUrl').addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); $('#sosialGo').click(); }
      });
    }

    $('#btnResetDesign').onclick = function () {
      state.layout = null; state.palette = null; state.cardStyle = null; state.doc = null;
      renderDesign(); updatePreview();
    };

    $('#btnCreate').onclick = function () {
      var payload = formDoc();
      delete payload.regNo; delete payload.date; delete payload.paid; delete payload.verifyUrl;
      /* `state` və `cancelReason` serverdə hesablanır — göndərilmir. */
      delete payload.state; delete payload.cancelReason;
      delete payload.regPrefix;
      /* `replyTo` QALIR — server valideyni məhz bu nömrədən həll edir.
         Adi sənəddə açar boşdur və göndərilmir. */
      if (!payload.replyTo) delete payload.replyTo;
      /* `social` QALIR (server `Sosial::clean()` ilə təmizləyir), `avatar` isə
         YOX: şəkil dərcdən sonra ayrıca, xam JPEG kimi gedir — base64 blob
         sənəd yükünü üç dəfə şişirdərdi. */
      delete payload.avatar;
      if (!payload.social) delete payload.social;
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
      /* Sosial rejimdə təsadüfi seçim profili pozmamalıdır — yalnız kart
         dizaynı dəyişir, adlar profildən gəlməyə davam edir. */
      if (state.social) {
        var sp = sosialCardsFor(state.social.platform);
        if (sp.length) pickTemplate(sp[Math.floor(Math.random() * sp.length)].id);
        state.doc = null; updatePreview();
        return;
      }
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

    /* Deep link. PHP backend-i `/r/`-də ayrıca baxış səhifəsi verir, bu budaq
       isə arxiv `backend-node/` (SPA verir) və `dist/`-in `#r/` forması üçündür.
       Axtarış TAYMERLƏ deyil, `API.init()` bitəndən sonra işə düşür — əks halda
       `/api/health` gecikəndə offline budaq açılıb düzgün sənədi «qeydə
       alınmayıb» kimi göstərirdi. */
    var deepReg = null;
    var m = location.pathname.match(/\/r\/([A-Za-z]{2,4}-\d{4}-\d{4})/i) || location.hash.match(/#r\/([A-Za-z]{2,4}-\d{4}-\d{4})/i);
    if (m) { deepReg = m[1].toUpperCase(); $('#qReg').value = deepReg; }

    var qs = new URLSearchParams(location.search);
    var pay = qs.get('payment');
    if (pay) {
      history.replaceState({}, '', location.pathname + location.hash);
      if (pay === 'success') toast('Ödəniş qəbul olundu — balans yeniləndi');
      else toast('Ödəniş tamamlanmadı', 'err');
    }

    /* `/r/{regNo}` səhifəsindəki cavab modalı bura yönləndirir.
       Query dərhal təmizlənir — `?payment=` ilə eyni nümunə. */
    var replyReg = qs.get('cavab'), replyKind = qs.get('tip');
    if (replyReg) history.replaceState({}, '', location.pathname + location.hash);

    API.init().then(function () {
      $('#modeBadge').innerHTML = '<span class="dot' + (API.online ? ' live' : '') + '"></span>' +
        (API.online ? 'Server rejimi' : 'Demo rejimi — lokal yaddaş');

      // Kabinet yalnız backend olduqda mövcuddur
      ['#navAccount', '#mastAccount', '#footAccount'].forEach(function (sel) {
        var el = $(sel);
        if (el) el.hidden = !API.online;
      });
      if (deepReg) { doSearch(); document.getElementById('reyestr').scrollIntoView(); }
      if (!API.online) return null;
      /* Kataloq açılışı gecikdirməsin: sorğu uğursuz olsa statik fayl qalır. */
      return API._json('/api/catalog', null).then(function (cat) {
        if (applyCatalog(cat)) rebuildCatalogViews();
      });
    }).then(function () {
      /* Kataloq oturduqdan SONRA: cavab şablonları və orijinalın kateqoriyası
         üçün hər ikisi lazımdır. */
      if (replyReg) return enterReplyMode(replyReg, replyKind);
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
