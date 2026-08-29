/* ==================================================================
   Sənəd baxış səhifəsi — /r/{regNo}

   Səhifədə yalnız sənəd görünür. `app.js` bura yüklənmir: kataloq,
   redaktor və ödəniş qatı lazım deyil — `doc.js` düz `doc` obyekti alır.

   MÜHÜM: burada `localStorage` ehtiyat budağı YOXDUR. Yalnız serverin
   saxladığı məzmun göstərilir — saxta şəklin QR-ı ya 404 verir, ya da
   serverin nüsxəsini açır (CLAUDE.md, «Known and accepted»).
   ================================================================== */
(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };
  var doc = null, toastT;

  function esc(t) {
    return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function toast(msg, kind) {
    var el = $('vwToast'), box = el.firstElementChild;
    box.textContent = msg;
    box.className = 'msg' + (kind === 'err' ? ' err' : '');
    el.classList.add('show');
    clearTimeout(toastT);
    toastT = setTimeout(function () { el.classList.remove('show'); }, 3400);
  }

  function state(html, bad) {
    var el = $('vwState');
    el.innerHTML = html;
    el.className = 'vw-state' + (bad ? ' bad' : '');
    el.hidden = false;
    $('doc').hidden = true;
    $('vwBanner').hidden = true;
    $('vwBar').hidden = true;
    $('vwReplyRef').hidden = true;
    $('vwCta').hidden = true;
    $('vwChain').hidden = true;
  }

  /* Cavab niyyətləri. Baxış səhifəsinə `replies.js` yüklənmir — burada
     yalnız kartların mətni lazımdır, şablonu SPA seçir. Siyahı
     `frontend/replies.js` REPLY_KINDS və `App\Support\ReplyKinds` ilə
     eyni açarları daşıyır. */
  var KINDS = [
    { k: 'redd',   icon: '❌', name: 'Rədd et',          blurb: 'Bu sənəddə yazılanlarla razı deyiləm.' },
    { k: 'etiraz', icon: '⚖️', name: 'Etiraz et',        blurb: 'Sənədə rəsmi etiraz bildirirəm.' },
    { k: 'tekrar', icon: '🔄', name: 'Yenidən baxılsın', blurb: 'Məsələyə yenidən baxılmasını tələb edirəm.' },
    { k: 'legv',   icon: '🚫', name: 'Ləğv et',          blurb: 'Sənədin qüvvədən düşməsini tələb edirəm.' },
    { k: 'qebul',  icon: '✅', name: 'Qüvvədə saxla',    blurb: 'Sənəd qüvvədə qalsın — təsdiq edirəm.' }
  ];
  var XATIRE_KIND = { k: 'xatire', icon: '💌', name: 'Cavab yaz',
    blurb: 'Bu xatirəyə öz sənədimlə cavab verirəm.' };

  /* Ölçmə. Səhvi udur və heç nə gözləmir — statistika istifadəçini
     ləngitməməlidir. `keepalive` sayəsində sorğu səhifədən çıxarkən də çatır
     (kart kliki dərhal SPA-ya keçid etdiyi üçün bu vacibdir). */
  function track(event, kind) {
    if (!doc) return;
    var body = JSON.stringify({ event: event, regNo: doc.regNo, kind: kind || null });
    try {
      fetch('/api/olcu', {
        method: 'POST', credentials: 'same-origin', headers: csrf(),
        body: body, keepalive: true
      }).catch(function () {});
    } catch (e) { /* ölçmə itir, səhifə işləməyə davam edir */ }
  }

  /* ---------------- vəziyyətlər ---------------- */

  function showNotFound(reg) {
    /* Mətn `app.js`-dəki verdict ilə eynidir və qəsdən sərtdir: konsolda
       «düzəldilmiş» sənədin QR kodu məhz buraya düşür. Yumşaldılmır. */
    state('<strong>Bu nömrə reyestrdə qeydə alınmayıb</strong>' +
      '<span class="vw-mono">' + esc(reg) + '</span><br><br>' +
      'Əlinizdə bu nömrəni daşıyan sənəd varsa, o, bu reyestrdən çıxarılmayıb: ya heç vaxt ' +
      'rəsmiləşdirilməyib, ya sonradan dəyişdirilib, ya da sahibi tərəfindən silinib. ' +
      'Reyestrdə olmayan sənəd bu qurumun verdiyi sənəd sayılmır.' +
      '<br><br><a href="/">zarafat.az</a>', true);
  }

  function showError(rateLimited, reg) {
    if (rateLimited) {
      state('<strong>Çox sayda sorğu göndərildi</strong>Bir dəqiqə gözləyib yenidən yoxlayın.', true);
    } else {
      state('<strong>Yoxlama zamanı xəta baş verdi</strong>' +
        '<span class="vw-mono">' + esc(reg) + '</span>' +
        '<br><button class="vw-btn ghost" id="vwRetry" type="button">Yenidən yoxla</button>', true);
      var r = $('vwRetry');
      if (r) r.onclick = function () { load(reg); };
    }
  }

  function showDoc(d) {
    doc = d;
    $('vwState').hidden = true;

    /* Vəziyyət ştampını `doc.js` özü çəkir (doc.state) — buradakı zolaq
       yalnız səbəbi/tarixi sözlə deyir. Aktiv sənəddə heç nə göstərilmir:
       təsdiq ştampı onsuz da vərəqin üstündədir. */
    var ban = $('vwBanner');
    if (d.state === 'cancelled') {
      ban.className = 'vw-banner';
      ban.innerHTML = '<b>Sənəd ləğv edilib</b>Ləğv səbəbi: «' + esc(d.cancelReason || 'göstərilməyib') +
        '». Ləğv edilmiş sənəd qüvvədə deyil və heç bir öhdəlik yaratmır.';
      ban.hidden = false;
    } else if (d.state === 'expired') {
      ban.className = 'vw-banner wait';
      ban.innerHTML = '<b>Sənədin müddəti bitib</b>Sənəd reyestrdədir, lakin etibarlılıq müddəti ' +
        'başa çatdığı üçün qüvvədə deyil.';
      ban.hidden = false;
    } else {
      ban.hidden = true;
    }

    /* Sənəd özü cavabdırsa — vərəqin üstündə orijinala kliklənən istinad.
       Vərəqin künc lenti eyni nömrəni daşıyır, amma SVG-də link olmur. */
    var ref = $('vwReplyRef');
    if (d.replyTo) {
      ref.innerHTML = '<b>Bu sənəd cavab sənədidir</b>' +
        'Aşağıdakı sənədə cavab olaraq hazırlanıb: <a href="/r/' + esc(d.replyTo) + '">' +
        esc(d.replyTo) + '</a>' + (d.replyToTitle ? ' — ' + esc(d.replyToTitle) : '');
      ref.hidden = false;
    } else {
      ref.hidden = true;
    }

    $('doc').innerHTML = DOCGEN.a4(d, { idPrefix: 'vw', verified: true });
    $('doc').hidden = false;
    $('vwBar').hidden = false;
    $('vwCta').hidden = false;
    document.title = d.title + ' — ' + d.regNo;

    loadChain(d.regNo);

    /* iOS `navigator.share()` jest tapşırığının içində çağırılmalıdır,
       rasterləşdirmə isə asinxrondur — story şəklini indidən hazırlayırıq. */
    if (ZEXPORT.canShareFiles()) {
      ZEXPORT.pngBlob(DOCGEN.story(d, { idPrefix: 'sh' }), DOCGEN.STORY_W, DOCGEN.STORY_H, 1)
        .then(function (b) { storyBlob = b; })
        .catch(function () { storyBlob = null; });
    }
  }

  var storyBlob = null;

  /* ---------------- cavab zənciri ----------------
     Serverdən gələn siyahı `reply_root_id` üzərindən bir SELECT-lə qurulur.
     Burada da `localStorage` ehtiyatı YOXDUR — zəncir yalnız reyestrin
     dediyi qədərdir. */

  /* Orijinalın cavablardan sonrakı görünən vəziyyəti (nöqtənin rəngi).
     Serverdə saxlanılmır: cavab yazmaq hamıya açıqdır, ona görə yad adam
     sizin sənədinizin sətrini dəyişə bilməməlidir. Bax:
     backend-php/app/Support/ReplyKinds.php VERDICT. */
  var VERDICT = {
    redd: ['bad', 'RƏDD EDİLİB'], legv: ['off', 'LƏĞV EDİLİB'],
    etiraz: ['wait', 'BAXILMAQDADIR'], tekrar: ['wait', 'BAXILMAQDADIR'],
    qebul: ['ok', 'QÜVVƏDƏDİR'], xatire: ['ok', 'CAVABLANDIRILIB']
  };

  function chainDot(it) {
    if (it.state === 'cancelled') return 'off';
    if (it.state === 'expired') return 'off';
    return it.kind ? (VERDICT[it.kind] ? VERDICT[it.kind][0] : 'wait') : 'ok';
  }

  function loadChain(reg) {
    var box = $('vwChain');
    box.hidden = true;
    fetch('/api/registry/' + encodeURIComponent(reg) + '/zencir',
      { headers: { 'Accept': 'application/json' } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        if (!j || !j.items || j.count < 2) return;
        renderChain(box, j.items, reg);
      })
      .catch(function () { /* zəncir görünmür, sənəd görünməyə davam edir */ });
  }

  function renderChain(box, items, reg) {
    /* Cari sənədin BİRBAŞA cavabları — «bu sənədə N cavab var» sətri.
       Zəncirin ümumi uzunluğu deyil: sənəd öz budağına cavabdehdir. */
    var me = items.filter(function (i) { return i.regNo === reg; })[0];
    var kids = me ? items.filter(function (i) { return i.depth === me.depth + 1; }).length : 0;

    var head = '<h4>📂 Sənəd tarixçəsi</h4>';
    if (kids) {
      head += '<p>↩ Bu sənədə cavab olaraq hazırlanmış <b>' + kids + '</b> sənəd var.</p>';
    } else {
      head += '<p>Bu sənəd ' + items.length + ' sənədlik cavab zəncirinin bir hissəsidir.</p>';
    }

    box.innerHTML = head + '<ol>' + items.map(function (it) {
      var cls = chainDot(it) + (it.current ? ' here' : '');
      var kind = it.kindLabel ? '<span class="vw-chain-k">' + esc(it.kindLabel) + '</span>' : '';
      var inner = '<span class="vw-chain-n">' + esc(it.regNo) + kind + '</span>' +
        '<span class="vw-chain-t">' + esc(it.title) + '</span>';
      /* Cari sənəd öz səhifəsinə link vermir — kliklənəsi yer deyil. */
      return '<li class="' + cls + '">' +
        (it.current ? '<div>' + inner + '</div>'
                    : '<a href="/r/' + esc(it.regNo) + '">' + inner + '</a>') +
        '</li>';
    }).join('') + '</ol>';
    box.hidden = false;
  }

  /* ---------------- cavab niyyəti seçimi ----------------
     Modal yalnız niyyəti seçir, sonra SPA redaktoruna ötürür. Kataloq,
     kredit və ödəniş qatı bura yüklənmir — səhifə yüngül qalır. */

  function replyKinds() {
    return doc && doc.tone === 'xatire' ? [XATIRE_KIND] : KINDS;
  }

  function openReplyModal() {
    $('vwReplyReg').textContent = doc.regNo;
    $('vwReplyCards').innerHTML = replyKinds().map(function (k) {
      return '<button class="vw-reply-card" type="button" data-kind="' + k.k + '">' +
        '<b><i>' + k.icon + '</i>' + esc(k.name) + '</b>' +
        '<span>' + esc(k.blurb) + '</span></button>';
    }).join('');
    $('vwReplyModal').classList.add('open');
    track('reply_click');
  }

  function closeReplyModal() { $('vwReplyModal').classList.remove('open'); }

  /* `tip` boş → SPA bütün uyğun variantları göstərir;
     `random` → SPA uyğun dəstdən təsadüfi birini seçir. */
  function goReply(kind) {
    track('reply_open', kind === 'random' ? null : kind);
    location.href = '/?cavab=' + encodeURIComponent(doc.regNo) +
      (kind ? '&tip=' + encodeURIComponent(kind) : '');
  }

  function bindReply() {
    $('vwReply').onclick = openReplyModal;
    $('vwReplyBig').onclick = openReplyModal;
    $('vwReplyClose').onclick = closeReplyModal;
    $('vwReplyRandom').onclick = function () { goReply('random'); };
    $('vwReplyAny').onclick = function () { goReply(''); };

    /* Kartlar hər açılışda yenidən qurulur — bir delegasiya dinləyicisi. */
    $('vwReplyCards').addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('[data-kind]') : null;
      if (b) goReply(b.getAttribute('data-kind'));
    });

    $('vwReplyModal').addEventListener('click', function (e) {
      if (e.target === $('vwReplyModal')) closeReplyModal();
    });
  }

  /* ---------------- yükləmə ---------------- */

  function load(reg) {
    state('Reyestrdən oxunur… <span class="vw-mono">' + esc(reg) + '</span>');
    fetch('/api/registry/' + encodeURIComponent(reg), { headers: { 'Accept': 'application/json' } })
      .then(function (r) {
        if (r.status === 429) return { rate: true };
        if (r.status === 404) return { missing: true };
        if (!r.ok) return { fail: true };
        return r.json().then(function (j) { return { doc: j }; });
      })
      .then(function (o) {
        if (o.rate) return showError(true, reg);
        if (o.missing) return showNotFound(reg);
        if (o.fail || !o.doc || !o.doc.regNo) return showError(false, reg);
        showDoc(o.doc);
      })
      .catch(function () { showError(false, reg); });
  }

  /* ---------------- zolaq ---------------- */

  function fileName(suffix, ext) {
    return 'zarafat-' + ZEXPORT.safeName(doc.regNo) + (suffix || '') + '.' + ext;
  }

  function shareMeta() {
    var link = doc.verifyUrl || location.href;
    /* Cavab sənədinin öz paylaşım cümləsi var — viral döngənin mətni budur.
       Şablonun `share` sahəsi varsa yenə də o üstün gəlir. */
    var body = doc.share ? doc.share
      : doc.replyTo ? 'Sənədinizə cavab verildi. Reyestrdə yoxlayın 😂'
      : 'Zarafat Notariat Palatası — ' + doc.regNo;
    return { title: 'Zarafat sənədi ' + doc.regNo, text: body + '\n' + link };
  }

  function bindBar() {
    $('vwPdf').onclick = function () {
      toast('PDF hazırlanır…');
      ZEXPORT.pdfBlob(DOCGEN.a4(doc, { idPrefix: 'ex' }), DOCGEN.W, DOCGEN.H, 3, doc.regNo)
        .then(function (b) { ZEXPORT.saveBlob(b, fileName('', 'pdf')); toast('PDF yükləndi'); })
        .catch(function () { toast('PDF yaratmaq alınmadı', 'err'); });
    };

    $('vwPng').onclick = function () {
      toast('Şəkil hazırlanır…');
      ZEXPORT.pngBlob(DOCGEN.a4(doc, { idPrefix: 'ex' }), DOCGEN.W, DOCGEN.H, 3)
        .then(function (b) { ZEXPORT.saveBlob(b, fileName('', 'png')); toast('Yükləndi'); })
        .catch(function () { toast('Şəkli yaratmaq alınmadı', 'err'); });
    };

    $('vwStory').onclick = function () {
      var name = fileName('-story', 'png');
      if (doc.replyTo) track('reply_shared');
      function fallback(b) { ZEXPORT.saveBlob(b, name); toast('Story şəkli yükləndi'); }

      if (storyBlob && ZEXPORT.canShareFiles()) {
        ZEXPORT.shareFile(storyBlob, name, 'image/png', shareMeta()).catch(function (e) {
          if (ZEXPORT.isAbort(e)) return;
          fallback(storyBlob);
        });
        return;
      }
      toast('Şəkil hazırlanır…');
      ZEXPORT.pngBlob(DOCGEN.story(doc, { idPrefix: 'sh' }), DOCGEN.STORY_W, DOCGEN.STORY_H, 1)
        .then(function (b) {
          if (!ZEXPORT.canShareFiles()) return fallback(b);
          return ZEXPORT.shareFile(b, name, 'image/png', shareMeta()).catch(function (e) {
            if (ZEXPORT.isAbort(e)) return;
            fallback(b);
          });
        })
        .catch(function () { toast('Şəkli yaratmaq alınmadı', 'err'); });
    };

    $('vwLink').onclick = function () {
      var link = doc.verifyUrl || location.href;
      var m = shareMeta();
      if (doc.replyTo) track('reply_shared');
      /* Fayl olmadığı üçün `url` burada uyğundur — rəqabət yoxdur. */
      if (navigator.share) {
        navigator.share({ title: m.title, text: m.text, url: link }).catch(function (e) {
          if (ZEXPORT.isAbort(e)) return;
          copyLink(link);
        });
        return;
      }
      copyLink(link);
    };

    $('vwRep').onclick = openReport;
  }

  function copyLink(link) {
    if (!navigator.clipboard) return toast('Kopyalamaq alınmadı', 'err');
    navigator.clipboard.writeText(link)
      .then(function () { toast('Link kopyalandı'); })
      .catch(function () { toast('Kopyalamaq alınmadı', 'err'); });
  }

  /* ---------------- şikayət ----------------
     CLAUDE.md: «Report/delete flow stays on every document» — bu, hüquqi
     qalxanın hissəsidir və gizli menyuya salınmır. */

  function openReport() {
    $('vwRepReg').textContent = doc.regNo;
    $('vwRepModal').classList.add('open');
  }
  function closeReport() { $('vwRepModal').classList.remove('open'); }

  function csrf() {
    var h = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
    var meta = document.querySelector('meta[name="csrf-token"]');
    if (meta) h['X-CSRF-TOKEN'] = meta.getAttribute('content');
    var m = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    if (m) h['X-XSRF-TOKEN'] = decodeURIComponent(m[1]);
    return h;
  }

  function bindReport() {
    $('vwRepClose').onclick = closeReport;
    $('vwRepCancel').onclick = closeReport;
    $('vwRepModal').addEventListener('click', function (e) {
      if (e.target === $('vwRepModal')) closeReport();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      closeReport();
      closeReplyModal();
    });

    $('vwRepSend').onclick = function () {
      var btn = $('vwRepSend');
      btn.disabled = true;
      fetch('/api/reports', {
        method: 'POST', credentials: 'same-origin', headers: csrf(),
        body: JSON.stringify({
          regNo: doc.regNo,
          reason: $('vwRepReason').value,
          note: $('vwRepNote').value
        })
      })
        .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
        .then(function (j) {
          closeReport();
          if (j && j.deleted) { showNotFound(doc.regNo); return; }
          toast('Şikayət qeydə alındı');
        })
        .catch(function () { toast('Göndərilə bilmədi', 'err'); })
        .then(function () { btn.disabled = false; });
    };
  }

  /* ---------------- başlanğıc ----------------
     `app.js`-dəki 300 ms `setTimeout` yarışı burada struktur olaraq yoxdur:
     nə `API.init()`, nə `/api/health`, nə də taymer var. */

  var m = location.pathname.match(/\/r\/([A-Za-z]{2,4}-\d{4}-\d{4})/i);
  if (!m) {
    showNotFound(location.pathname.replace(/^\/r\//, '') || '—');
  } else {
    bindBar();
    bindReply();
    bindReport();
    load(m[1].toUpperCase());
  }
})();
