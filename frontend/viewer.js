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

    $('doc').innerHTML = DOCGEN.a4(d, { idPrefix: 'vw', verified: true });
    $('doc').hidden = false;
    $('vwBar').hidden = false;
    document.title = d.title + ' — ' + d.regNo;

    /* iOS `navigator.share()` jest tapşırığının içində çağırılmalıdır,
       rasterləşdirmə isə asinxrondur — story şəklini indidən hazırlayırıq. */
    if (ZEXPORT.canShareFiles()) {
      ZEXPORT.pngBlob(DOCGEN.story(d, { idPrefix: 'sh' }), DOCGEN.STORY_W, DOCGEN.STORY_H, 1)
        .then(function (b) { storyBlob = b; })
        .catch(function () { storyBlob = null; });
    }
  }

  var storyBlob = null;

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
    return {
      title: 'Zarafat sənədi ' + doc.regNo,
      text: (doc.share ? doc.share + '\n' : 'Zarafat Notariat Palatası — ' + doc.regNo + '\n') + link
    };
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
      if (e.key === 'Escape') closeReport();
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
    bindReport();
    load(m[1].toUpperCase());
  }
})();
