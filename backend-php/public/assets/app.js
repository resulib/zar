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

    credits: function () {
      if (!API.online) return Promise.resolve(LS.get('zrf_credits', 0));
      return fetch('/api/me').then(function (r) { return r.json(); }).then(function (j) { return j.credits; });
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
        var regNo;
        do { regNo = 'ZRF-' + new Date().getFullYear() + '-' + String(Math.floor(1000 + Math.random() * 9000)); }
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
    lookup: function (regNo) {
      if (!API.online) {
        var d = LS.get('zrf_docs', {})[regNo];
        if (!d || !d.paid || d.deleted) return Promise.resolve(null);
        return Promise.resolve(d);
      }
      return fetch('/api/registry/' + encodeURIComponent(regNo))
        .then(function (r) { return r.status === 404 ? null : r.json(); });
    },
    mine: function () {
      if (!API.online) {
        var docs = LS.get('zrf_docs', {});
        return Promise.resolve(LS.get('zrf_mine', []).map(function (n) { return docs[n]; })
          .filter(function (d) { return d && !d.deleted; }));
      }
      return fetch('/api/me/documents').then(function (r) { return r.json(); });
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
  var state = { cat: 'couples', tpl: null, doc: null, credits: 0, layout: null, palette: null, q: '' };

  var LAYOUT_EDGE = {
    notarial: '#b0882a', blank: '#2f5d8a', diplom: '#8d1d33',
    sertifikat: '#1f7a52', lisenziya: '#3b4b6b',
    arayis: '#2f6d7a', qerar: '#5d2b4a', muqavile: '#6b5539',
    teleqram: '#6f7a2f', vesiqe: '#8a5a2b'
  };
  var PAL_LABEL = { gold: 'Qızılı', steel: 'Polad', burgundy: 'Bordo', forest: 'Zümrüd', ink: 'Qrafit' };
  var PAL_SWATCH = { gold: '#b0882a', steel: '#2f5d8a', burgundy: '#8d1d33', forest: '#1f7a52', ink: '#3b4b6b' };

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
    vesiqe:   '<rect x="2.5" y="4.5" width="31" height="17" rx="2" fill="none" stroke="currentColor"/><rect x="5.5" y="7.5" width="7" height="8" fill="none" stroke="currentColor" stroke-width=".7"/><path d="M15 8.5h15M15 11.5h15M15 14.5h9" stroke="currentColor" stroke-width=".7"/><path d="M5.5 18h25M5.5 19.8h25" stroke="currentColor" stroke-width=".9" stroke-dasharray="1 1"/>'
  };

  function curLayout()  { return state.layout  || (state.tpl && state.tpl.layout)  || 'notarial'; }
  function curPalette() { return state.palette || (state.tpl && state.tpl.palette) || 'gold'; }

  /* ---------------- kateqoriya / şablon ---------------- */
  function renderTabs() {
    $('#tabs').innerHTML = CATEGORIES.map(function (c) {
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
    var list = TEMPLATES.filter(function (t) { return (q ? true : t.cat === state.cat) && matches(t, q); });
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
    $('#fTitle').value = t.title;
    $('#fPowers').value = t.powers;
    $('#fPenalty').value = t.penalty;
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

  /* ---------------- sənəd obyekti ---------------- */
  function formDoc(base) {
    var t = state.tpl || TEMPLATES[0];
    var to = $('#fTo').value.trim() || 'Ad Soyad';
    var from = $('#fFrom').value.trim() || 'Ad Soyad';
    var pre = (t.preamble || '').replace(/\{to\}/g, to).replace(/\{from\}/g, from);
    return Object.assign({
      templateId: t.id,
      layout: curLayout(), palette: curPalette(),
      toLabel: t.toLabel || null, fromLabel: t.fromLabel || null,
      powersLabel: t.powersLabel || null, penaltyLabel: t.penaltyLabel || null,
      title: $('#fTitle').value.trim() || t.title,
      to: to, from: from,
      powers: $('#fPowers').value,
      penalty: $('#fPenalty').value.trim(),
      preamble: pre,
      regNo: 'ZRF-' + new Date().getFullYear() + '-————',
      date: fmtDate(new Date()),
      paid: false, verifyUrl: ''
    }, base || {});
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
  function verdict(kind, title, meta) {
    return '<div class="verdict ' + kind + '"><strong>' + title + '</strong>' +
      (meta ? '<div class="meta">' + meta + '</div>' : '') + '</div>';
  }

  function doSearch() {
    var reg = normReg($('#qReg').value);
    $('#searchResult').innerHTML = '';
    if (!/^ZRF-\d{4}-\d{4}$/.test(reg)) {
      $('#searchMsg').innerHTML = verdict('wait', 'Nömrə formatı yanlışdır', 'Düzgün format: ZRF-2026-9482');
      return;
    }
    $('#searchMsg').innerHTML = verdict('wait', 'Reyestrdə axtarılır…', reg);
    API.lookup(reg).then(function (d) {
      if (!d) {
        $('#searchMsg').innerHTML = verdict('no', 'Reyestrdə belə sənəd tapılmadı',
          'Yalnız ödənişi tamamlanmış sənədlər reyestrə düşür');
        return;
      }
      $('#searchMsg').innerHTML = verdict('ok', 'Rəsmi təsdiq olunub',
        'Qeydiyyat: ' + esc(d.regNo) + ' · Tarix: ' + esc(d.date));
      $('#searchResult').innerHTML =
        '<div class="sheet-wrap"><div class="paper">' + DOCGEN.a4(d, { idPrefix: 'sr', verified: true }) + '</div></div>' +
        '<div style="margin-top:10px"><button id="srReport" class="btn btn-danger btn-sm" type="button">Şikayət et / sil</button></div>';
      $('#srReport').onclick = function () { openReport(d.regNo); };
    }).catch(function () {
      $('#searchMsg').innerHTML = verdict('no', 'Axtarış zamanı xəta baş verdi', '');
    });
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
            '<span class="state ' + (d.paid ? 'pub' : 'dra') + '">' + (d.paid ? 'Reyestrdə' : 'Qaralama') + '</span>' +
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
    var t = TEMPLATES.filter(function (x) { return x.id === 'always-right'; })[0] || TEMPLATES[0];
    var to = 'Günel Şəkərova', from = 'Elvin Məmmədov', reg = 'ZRF-2026-4471';
    var doc = {
      templateId: t.id, layout: t.layout, palette: t.palette,
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
    renderTabs(); renderCards(); renderDesign();
    pickTemplate(TEMPLATES[0].id);
    renderSpecimen();

    var deb;
    ['#fTitle', '#fTo', '#fFrom', '#fPowers', '#fPenalty'].forEach(function (sel) {
      $(sel).addEventListener('input', function () {
        state.doc = null;
        clearTimeout(deb); deb = setTimeout(updatePreview, 180);
      });
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
      var t = TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)];
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
      b.onclick = function () { closeModal('#payModal'); closeModal('#reportModal'); };
    });
    $$('.modal').forEach(function (m) {
      m.addEventListener('click', function (e) { if (e.target === m) m.classList.remove('open'); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeModal('#payModal'); closeModal('#reportModal'); }
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

    var m = location.pathname.match(/\/r\/(ZRF-\d{4}-\d{4})/i) || location.hash.match(/#r\/(ZRF-\d{4}-\d{4})/i);
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
