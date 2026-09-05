/* İş qovluğunun qabığı.
   Sənədlərin məzmunu BURADA YOXDUR: hər sənəd açılanda serverdən hazır HTML
   parçası gətirilir. Eyni səbəbdən kilidin kodu və düzgün cavablar da burada
   deyil — hər ikisi yalnız serverdə yoxlanılır.
   İrəliləyiş də bazadadır: localStorage işlədilmir, adam telefonu bağlayıb
   səhər davam edə bilməlidir. */
(function () {
  'use strict';

  var D = window.DOSSIER || {};
  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };

  var S = {
    docs: D.docs || [],
    suspects: [], chrono: [], questions: [], endings: [], spoilers: [],
    read: [], pinned: [], unlocked: [],
    answers: [], cur: null, tick: null, t0: 0,
    solved: false, revealed: false, left: null, solution: null,
    minutes: null, certToken: D.certToken || null, certSent: false
  };

  /* ---------------- API ---------------- */
  var API = {
    csrf: function () {
      var m = document.querySelector('meta[name="csrf-token"]');
      return m ? m.getAttribute('content') : '';
    },
    oxu: function (r) {
      return r.text().then(function (t) {
        var j = null;
        try { j = t ? JSON.parse(t) : null; } catch (e) { j = null; }
        if (!r.ok) throw (j || { error: 'error', message: 'Əlaqə alınmadı (' + r.status + ')' });
        return j;
      });
    },
    get: function (url) {
      return fetch(url, { credentials: 'same-origin', headers: { Accept: 'application/json' } }).then(API.oxu);
    },
    post: function (url, body, xam) {
      var h = { 'X-CSRF-TOKEN': API.csrf(), Accept: 'application/json' };
      h['Content-Type'] = xam ? 'image/jpeg' : 'application/json';
      return fetch(url, {
        method: 'POST', credentials: 'same-origin', headers: h,
        body: xam ? body : JSON.stringify(body || {})
      }).then(API.oxu);
    }
  };

  var BASE = '/api/is/' + D.slug;

  function bildir(mesaj) {
    var el = $('#bildiris');
    if (!el) return;
    el.querySelector('.mesaj').textContent = mesaj;
    el.classList.add('on');
    setTimeout(function () { el.classList.remove('on'); }, 2600);
  }

  function xeta(e) {
    bildir((e && e.message) || 'Əməliyyat alınmadı.');
  }

  /* ---------------- ekranlar ---------------- */
  function go(id) {
    $$('.screen').forEach(function (s) { s.classList.toggle('on', s.id === 's-' + id); });
    $('#main').scrollTop = 0;
    /* Masaüstündə `#main` `overflow:hidden`-dir və sürüşmə ekranın özündədir —
       yuxarıdakı sətir orada təsirsizdir. Telefonda isə ekranlar sürüşən qab
       deyil, yəni bu sətir təsirsizdir. Hər ikisi lazımdır. */
    var t = $('#s-' + id);
    if (t) t.scrollTop = 0;
  }

  function saat() {
    var s = S.t0;
    $('#clock').textContent =
      String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
    S.t0++;
  }

  function sayqacBasla(elapsed) {
    S.t0 = elapsed || 0;
    saat();
    if (S.tick) clearInterval(S.tick);
    S.tick = setInterval(saat, 1000);
  }

  /* ---------------- üz qabığı ---------------- */
  var who = $('#who');
  var openBtn = $('#openBtn');

  if (who && openBtn) {
    who.addEventListener('input', function () {
      openBtn.disabled = who.value.trim().length < 2;
    });
    openBtn.addEventListener('click', function () {
      openBtn.disabled = true;
      API.post(BASE + '/ac', { ad: who.value.trim() })
        .then(function (r) { qur(r); })
        .catch(function (e) { openBtn.disabled = false; xeta(e); });
    });
  }

  /* Serverdən gələn tam yükü qabığa yayır. */
  function qur(r) {
    if (r.docs) S.docs = r.docs;
    if (r.suspects) S.suspects = r.suspects;
    if (r.chronology) S.chrono = r.chronology;
    if (r.questions) S.questions = r.questions;
    /* Sonluq rejimi TÖRƏMƏDİR: server hansı şübhəlilərin sonluğu olduğunu
       bildirir, mətnləri yox. Siyahı boşdursa köhnə üç suallıq rejimdir. */
    if (r.endings) S.endings = r.endings;
    if (r.spoilers) S.spoilers = r.spoilers;
    if (r.meta) meta(r.meta);
    hal(r.state || {});
    S.answers = new Array(S.questions.length).fill(null);

    $('#topbar').classList.add('on');
    $('#tabbar').classList.add('on');
    siyahi(); subheliler(); suallar(); sonluqlar(); nisan(); lentHal();
    sayqacBasla((r.state && r.state.elapsed) || 0);

    if (S.solved || S.revealed) { netice(null); return; }
    $('#ttl').textContent = 'İş materialları';
    go('index');
  }

  function hal(st) {
    S.read = st.read || [];
    S.pinned = st.pinned || [];
    S.unlocked = st.unlocked || [];
    S.solved = !!st.solved;
    S.revealed = !!st.revealed;
    S.left = st.attemptsLeft;
    S.certToken = st.certToken || S.certToken;
    if (st.minutes != null) S.minutes = st.minutes;
    if (st.investigator) D.investigator = st.investigator;
  }

  function meta(rows) {
    $('#meta').innerHTML = rows.map(function (r) {
      return '<dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd>';
    }).join('');
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ---------------- sıra qaydası ----------------
     Bu üç funksiya serverdəki `DossierService::reachable()` və `allRead()`
     metodlarının EYNİSİDİR. Qərarı yenə server verir — buradakı nüsxə yalnız
     lentin və düymələrin görünüşü üçündür; ikisi bir-birindən ayrılsa,
     adam açıq görünən vərəqə tıklayıb 403 alar. */

  /** Vərəq açılırmı: ondan əvvəlkilərin HAMISI keçilməlidir. */
  function sirada(id) {
    for (var i = 0; i < S.docs.length; i++) {
      if (S.docs[i].id === id) return true;
      if (S.read.indexOf(S.docs[i].id) < 0) return false;
    }
    return true;
  }

  /** Bütün vərəqlər keçilibmi — şübhəlilər və yekun rəy bundan sonra açılır. */
  function hamsiKecilib() {
    for (var i = 0; i < S.docs.length; i++) {
      if (S.read.indexOf(S.docs[i].id) < 0) return false;
    }
    return S.docs.length > 0;
  }

  /** Siyahıda növbəti vərəq. Sonuncudan sonra `null`. */
  function novbeti(id) {
    for (var i = 0; i < S.docs.length - 1; i++) {
      if (S.docs[i].id === id) return S.docs[i + 1];
    }
    return null;
  }

  /* ---------------- materiallar ---------------- */
  function siyahi() {
    /* Bir keçiddə həm «oxunub», həm «bağlıdır» hesablanır: ilk keçilməmiş
       vərəqdən SONRAKILARIN hamısı bağlıdır. */
    var acilan = true;

    $('#list').innerHTML = S.docs.map(function (d) {
      var oxunub = S.read.indexOf(d.id) >= 0;
      var qapali = !acilan;
      if (!oxunub) acilan = false;

      var izah = qapali ? 'əvvəlki vərəqi keç'
        : (d.locked ? 'bağlıdır — dördrəqəmli kod' : esc(d.kind));

      return '<button class="docrow ' + (oxunub ? 'read' : '') + ' ' +
        (d.locked ? 'locked' : '') + ' ' + (qapali ? 'qapali' : '') + ' ' +
        (d.id === S.cur ? 'cari' : '') +
        '" data-i="' + d.id + '"' + (qapali ? ' aria-disabled="true"' : '') + '>' +
        '<span class="dr-no">v. ' + esc(d.page) + '</span>' +
        '<span class="dr-mid"><span class="dr-name">' + esc(d.name) + '</span>' +
        '<span class="dr-kind">' + izah + '</span></span>' +
        '<span class="dr-mark">' + (qapali ? '⊘' : (d.locked ? '⌧' : (oxunub ? '✓' : ''))) +
        '</span></button>';
    }).join('');

    $$('#list .docrow').forEach(function (b) {
      b.onclick = function () { ac(+b.getAttribute('data-i')); };
    });
  }

  /** Şübhəlilər və yekun rəy lentləri — bütün vərəqlər keçilənə qədər bağlıdır. */
  function lentHal() {
    var acar = hamsiKecilib() || S.solved || S.revealed;

    $$('.tab').forEach(function (t) {
      var g = t.getAttribute('data-go');
      if (g !== 'suspects' && g !== 'answer') return;
      t.classList.toggle('kilidli', !acar);
      t.setAttribute('aria-disabled', acar ? 'false' : 'true');
    });
  }

  /* Sonluq vərəqləri `S.docs`-da DEYİL — materiallar siyahısı onlarsız
     qalmalıdır. Amma `ac()` ilk sətirdə `tap()` işlədir, ona görə axtarış
     hər iki massivə baxır. */
  function tap(id) {
    for (var i = 0; i < S.docs.length; i++) if (S.docs[i].id === id) return S.docs[i];
    for (var j = 0; j < S.spoilers.length; j++) if (S.spoilers[j].id === id) return S.spoilers[j];
    return null;
  }

  function ac(id) {
    var d = tap(id);
    if (!d) return;

    if (!sirada(id)) {
      bildir('Əvvəlki vərəqi keçmədən bu vərəq açılmır.');
      return;
    }

    S.cur = id;
    /* Siyahı masaüstündə daim açıq qalır, ona görə hansı vərəqin masada
       olduğu görünməlidir. Telefonda `.cari` stilsizdir. */
    $$('#list .docrow').forEach(function (b) {
      b.classList.toggle('cari', +b.getAttribute('data-i') === id);
    });
    $('#ttl').textContent = d.name;
    $('#docbody').innerHTML = '<div class="empty">Açılır…</div>';
    go('doc');

    API.get(BASE + '/sened/' + id).then(function (r) {
      /* KODLU VƏRƏQ DƏ KEÇİLMİŞ SAYILIR — serverdəki `markRead()` ilə eyni.
         Yoxsa kodu hələ tapmamış adam qovluğun qalanını görə bilməzdi.
         Sıra `yaz()`-dan ƏVVƏLdir: altlıq və lentlər yenilənmiş siyahını görsün. */
      if (S.read.indexOf(id) < 0) { S.read.push(id); }
      yaz(r);
      siyahi();
      lentHal();
    }).catch(function (e) {
      $('#docbody').innerHTML = '<div class="empty">Sənəd açılmadı.</div>';
      xeta(e);
    });
  }

  /* Vərəqin altındakı düymələr. «Davam et» KODLU vərəqdə də var: klaviaturanı
     görmək onu keçmək üçün kifayətdir, kodu sonra da tapmaq olar. */
  function altliq(r) {
    var h = '';

    if (!r.locked) {
      var pinli = S.pinned.indexOf(r.id) >= 0;
      h += '<button class="pinbtn ' + (pinli ? 'on' : '') + '" id="pin">' +
        (pinli ? 'Qeydlərdən çıxar' : 'Qeyd dəftərinə sanc') + '</button>';
    }

    /* Sonluq vərəqi sıranın bir hissəsi deyil — «Davam et» mənasızdır və
       «Yekun rəyə keç» oyunçunu artıq keçdiyi ekrana qaytarardı. */
    if (r.spoiler) {
      return h + '<button class="davam" id="geriNetice" type="button">← Nəticəyə qayıt' +
        '<span class="davam-s">işin sonluğu</span></button>';
    }

    var n = novbeti(r.id);

    if (n) {
      h += '<button class="davam" id="davam" data-i="' + n.id + '">Davam et →' +
        '<span class="davam-s">v. ' + esc(n.page) + ' · ' + esc(n.name) + '</span></button>';
    } else {
      h += '<button class="davam" id="davam" data-go="answer">Yekun rəyə keç →' +
        '<span class="davam-s">qovluğun sonu — bütün vərəqlər keçildi</span></button>';
    }

    return h;
  }

  function yaz(r) {
    $('#docbody').innerHTML = r.html + altliq(r);

    var geri = $('#geriNetice');
    if (geri) { geri.onclick = function () { go('result'); }; }

    var dv = $('#davam');
    if (dv) {
      dv.onclick = function () {
        var ni = dv.getAttribute('data-i');
        if (ni) { ac(+ni); return; }
        var t = $$('.tab').filter(function (x) {
          return x.getAttribute('data-go') === 'answer';
        })[0];
        if (t) t.click();
      };
    }

    if (r.locked) { kilid(r.id); return; }

    $('#pin').onclick = function () {
      API.post(BASE + '/qeyd/' + r.id, {}).then(function (p) {
        S.pinned = p.list || [];
        nisan();
        yaz(r);
      }).catch(xeta);
    };
  }

  /* Klaviatura. Rəqəmlər serverə gedir — burada müqayisə yoxdur. */
  function kilid(id) {
    var buf = '';
    var dots = $('#dots');

    function ciz() {
      $$('#dots .dot').forEach(function (d, i) { d.textContent = buf[i] ? '•' : ''; });
    }

    $$('.key').forEach(function (k) {
      k.onclick = function () {
        var v = k.getAttribute('data-k');
        if (v === 'x') { buf = buf.slice(0, -1); ciz(); return; }
        if (v !== 'ok') { if (buf.length < 4) buf += v; ciz(); return; }

        var kod = buf;
        buf = ''; ciz();

        API.post(BASE + '/kilid/' + id, { kod: kod }).then(function (r) {
          S.unlocked.push(id);
          if (r.docs) S.docs = r.docs;
          siyahi();
          lentHal();
          yaz({ id: id, html: r.html, locked: false });
          bildir('Qutu açıldı.');
        }).catch(function (e) {
          $('#lerr').textContent = (e && e.message) || 'Kod uyğun gəlmir';
          dots.classList.add('shake');
          setTimeout(function () { dots.classList.remove('shake'); }, 330);
        });
      };
    });
  }

  /* ---------------- şübhəlilər ---------------- */
  function subheliler() {
    /* Vaxt nişanları MƏLUMATDAN gəlir, koda yazılmır: telefonda onlar hər
       zolağın altındakı təkrarlanan yazıdır, kompüterdə isə bir ortaq oxun
       tərifinə çevrilir — və hər işin gecəsi başqa saatlardadır. */
    var ox = (D.axis && D.axis.length ? D.axis : []).map(function (a) {
      return '<span>' + esc(a) + '</span>';
    }).join('');

    /* `.sus-b` sarğısı YOXDUR: alibi zolağı müstəqil qardaş olmalıdır ki,
       kompüterdə bioqrafiya mətni onun enini təyin etməsin. */
    $('#sus').innerHTML = S.suspects.map(function (s) {
      return '<div class="sus">' +
        '<div class="sus-h"><div class="sus-init">' + esc(s.init) + '</div>' +
        '<div><div class="sus-n">' + esc(s.name) + '</div><div class="sus-r">' + esc(s.role) + '</div></div></div>' +
        '<div class="sus-bio">' + esc(s.bio) + '</div>' +
        '<div class="bar">' + (s.bars || []).map(function (b) {
          return '<i style="left:' + b[0] + '%;width:' + (b[1] - b[0]) + '%"></i>';
        }).join('') + '</div>' +
        '<div class="bar-l">' + ox + '</div>' +
        '<div class="sus-cam"><em>Kamera:</em> ' + esc(s.camera) + '</div>' +
        '</div>';
    }).join('');

    $('#chrono').innerHTML = S.chrono.map(function (c) {
      return '<dt>' + esc(c[0]) + '</dt><dd>' + esc(c[1]) + '</dd>';
    }).join('');
  }

  /* ---------------- qeydlər ---------------- */
  function qeydler() {
    if (!S.pinned.length) {
      $('#notes').innerHTML = '<div class="empty">Qeyd dəftəri boşdur.<br>Sənədi açıb aşağıdakı düymə ilə sanc.</div>';
      return;
    }
    $('#notes').innerHTML = S.pinned.map(function (id) {
      var d = tap(id);
      if (!d) return '';
      return '<div class="note" data-i="' + id + '"><div class="note-t">' + esc(d.name) + '</div>' +
        '<div class="note-s">vərəq ' + esc(d.page) + ' · ' + esc(d.kind) + '</div></div>';
    }).join('');
    $$('.note').forEach(function (n) {
      n.onclick = function () { ac(+n.getAttribute('data-i')); };
    });
  }

  function nisan() {
    var b = $('#nb');
    b.hidden = !S.pinned.length;
    b.textContent = S.pinned.length;
  }

  /* ---------------- cavab ---------------- */
  function suallar() {
    $('#qs').innerHTML = S.questions.map(function (q, qi) {
      return '<div class="q"><div class="q-t">' + (qi + 1) + '. ' + esc(q.prompt) + '</div>' +
        q.options.map(function (o, oi) {
          return '<button class="opt" data-q="' + qi + '" data-o="' + oi + '">' + esc(o) + '</button>';
        }).join('') + '</div>';
    }).join('');

    $$('.opt').forEach(function (b) {
      b.onclick = function () {
        var q = +b.getAttribute('data-q');
        S.answers[q] = +b.getAttribute('data-o');
        $$('.opt[data-q="' + q + '"]').forEach(function (x) { x.classList.remove('sel'); });
        b.classList.add('sel');
        $('#submit').disabled = S.answers.indexOf(null) >= 0;
      };
    });

    qaliq();
  }

  /* ---------------- sonluq rejimi ----------------
     Oyunçu şübhəlilərdən birini seçir və seçiminə uyğun sonluq alır.
     Cəhd limiti yoxdur: hər sonluğu oxumaq oyunun bir hissəsidir. */
  function sonluqlar() {
    var qutu = $('#ends');
    if (!qutu) return;

    var var_ = S.endings && S.endings.length;
    $('#s-answer').classList.toggle('sonluq', !!var_);

    if (!var_) { qutu.innerHTML = ''; return; }

    qutu.innerHTML = S.suspects.map(function (s, i) {
      /* `dossiers.suspects` JSON-unda id yoxdur, cədvəldə var. Serverin
         göndərdiyi `endings` siyahısı id daşıyır, ona görə sıra üzrə
         uyğunlaşdırılır: hər ikisi eyni `sort` ilə düzülür. */
      var id = S.endings[i];
      if (id == null) return '';
      return '<button class="end-s" type="button" data-s="' + id + '">' +
        '<b>' + esc(s.name || '') + '</b><span>' + esc(s.role || '') + '</span></button>';
    }).join('');

    $$('.end-s').forEach(function (b) {
      b.onclick = function () {
        $$('.end-s').forEach(function (x) { x.disabled = true; });
        API.post(BASE + '/sonluq', { subheli: +b.getAttribute('data-s') })
          .then(function (r) { sonluqGoster(r); })
          .catch(function (e) { $$('.end-s').forEach(function (x) { x.disabled = false; }); xeta(e); });
      };
    });
  }

  function sonluqGoster(r) {
    if (S.tick) { clearInterval(S.tick); S.tick = null; }

    S.solved = !!r.dogru;
    S.minutes = r.minutes;
    S.certToken = r.certToken || S.certToken;
    if (r.spoilers) S.spoilers = r.spoilers;

    var ok = !!r.dogru;

    $('#res').innerHTML =
      '<div class="verdict ' + (ok ? 'ok' : 'no') + '">' + esc(r.verdict || '') + '</div>' +
      (ok && r.reveal ? '<div class="sect-h">AÇILIŞ</div><div class="expl">' +
        String(r.reveal).split(/\n{2,}/).map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') +
        '</div>' : '') +
      '<div class="sting" id="sting" hidden></div>' +
      (ok ? sertifikatHtml() + '<button class="btn" id="share">Nəticəni paylaş</button>' : '') +
      sonluqHtml() +
      '<button class="btn ghost" id="yeniden" type="button">Yenidən oyna</button>' +
      '<a class="btn ghost" href="/is" style="text-align:center;text-decoration:none">Başqa qovluq seç</a>';

    /* Sancı sətri ÜÇ SANİYƏ sonra çıxır. Gecikmə yalnız təqdimatdır —
       mətn onsuz da cavabla birlikdə gəlib. */
    if (r.sting) {
      setTimeout(function () {
        var el = $('#sting');
        if (!el) return;
        el.textContent = r.sting;
        el.hidden = false;
      }, 3000);
    }

    var sh = document.getElementById('share');
    if (sh) sh.onclick = payla;
    if (ok) sertifikatGonder();

    var yn = document.getElementById('yeniden');
    if (yn) {
      yn.onclick = function () {
        /* Yalnız seçim sıfırlanır: açılmış kodlar qalır. */
        yn.disabled = true;
        API.post(BASE + '/yeniden', {})
          .then(function () { sonluqlar(); $('#ttl').textContent = 'Yekun qərar'; go('answer'); })
          .catch(function (e) { yn.disabled = false; xeta(e); });
      };
    }

    $('#ttl').textContent = 'Sonluq';
    go('result');
  }

  function qaliq() {
    var el = $('#left');
    if (!el) return;
    el.textContent = (S.left == null || S.solved || S.revealed) ? ''
      : 'Qalan cəhd: ' + S.left + '. Səhv bəndin hansı olduğu göstərilmir.';
  }

  var submit = $('#submit');
  if (submit) {
    submit.onclick = function () {
      submit.disabled = true;
      API.post(BASE + '/rey', { cavablar: S.answers })
        .then(function (r) { netice(r); })
        .catch(function (e) { submit.disabled = false; xeta(e); });
    };
  }

  function netice(r) {
    if (r) {
      S.solved = !!r.solved;
      S.revealed = !!r.revealed;
      S.left = r.left;
      S.minutes = r.minutes;
      S.certToken = r.certToken || S.certToken;
      S.solution = r.solution || null;
      if (r.spoilers) S.spoilers = r.spoilers;
    }

    if (!S.solved && !S.revealed) {
      qaliq();
      bildir('Rəy təsdiqlənmədi. Ən azı bir bənd səhvdir.');
      $('#submit').disabled = S.answers.indexOf(null) >= 0;
      return;
    }

    if (S.tick) { clearInterval(S.tick); S.tick = null; }
    if (S.solution === null && D.solution) S.solution = D.solution;
    if (S.minutes == null && D.minutes != null) S.minutes = D.minutes;

    var ok = S.solved;

    $('#res').innerHTML =
      '<div class="verdict ' + (ok ? 'ok' : 'no') + '">' +
      (ok ? 'Rəy təsdiqləndi. İş üzrə ittiham irəli sürülür.'
          : 'Cəhdlər bitdi. Rəy təsdiqlənmədi — izah aşağıdadır.') + '</div>' +
      (ok ? sertifikatHtml() + '<button class="btn" id="share">Nəticəni paylaş</button>' : '') +
      '<div class="sect-h">İZAH</div>' +
      /* Sonluq bloku `.expl`-dən KƏNARDADIR: `check-dossier-flow.js` iki
         yerdə `.expl p` sayının dəqiq dörd olduğunu yoxlayır. */
      '<div class="expl">' + (S.solution || []).map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') + '</div>' +
      sonluqHtml() +
      '<a class="btn ghost" href="/is" style="text-align:center;text-decoration:none">Başqa qovluq seç</a>';

    var sh = document.getElementById('share');
    if (sh) sh.onclick = payla;
    if (ok) sertifikatGonder();

    $('#ttl').textContent = 'Yekun rəy';
    go('result');
  }

  /* ---------- işin sonluğu ----------
     Qatilin dindirilmə protokolu və məhkəmə qərarı. Onlar QOVLUĞUN ÖZ
     vərəqləridir — eyni blank, eyni möhür, eyni fiktivlik zolağı — amma
     materiallar siyahısında görünmür: adları belə hekayəni açardı.
     Server onları yalnız `solved || revealed` halında göndərir. */
  function sonluqHtml() {
    if (!S.spoilers.length) return '';

    return '<div class="sect-h">İŞİN SONU</div>' +
      '<div class="son-list">' + S.spoilers.map(function (d) {
        return '<button class="son-row" type="button" data-i="' + d.id + '">' +
          '<span class="son-ad">' + esc(d.name) + '</span>' +
          '<span class="son-nov">' + esc(d.kind || '') + '</span></button>';
      }).join('') + '</div>';
  }

  /* Delegasiya: blok `#res` içərisində hər dəfə yenidən çəkilir. */
  document.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('.son-row') : null;
    if (!b) return;
    ac(+b.getAttribute('data-i'));
  });

  /* Sertifikat lövhəsi — həm üç suallıq, həm sonluq rejimindən çağırılır.
     Fiktivlik qeydi BURADADIR: paylaşılan şəkil saytdan kənara çıxır və
     qeydi öz üstündə daşımalıdır. */
  function sertifikatHtml() {
    var st = (D.cover && D.cover.closeStamp) || ['İŞ', 'BAĞLANDI'];

    return '<div class="cert" id="cert">' +
      '<div class="cert-k">AFİB · OYUN NƏTİCƏSİ</div>' +
      '<div class="cert-t">İŞ AÇILDI</div>' +
      '<div class="cert-n">İş № ' + esc(D.no) + ' · ' + esc(D.title) + '</div>' +
      '<div class="cert-g"><div><b>' + esc(S.minutes == null ? '—' : S.minutes) + '</b><small>dəqiqə</small></div>' +
      '<div><b>' + S.pinned.length + '</b><small>sancılmış sənəd</small></div></div>' +
      '<div class="cert-k">' + esc(boyuk(D.investigator || '')) + '</div>' +
      '<div class="cert-f">Nəticə spoiler saxlamır. Paylaşa bilərsən —<br>dostun eyni qovluğu təmiz açacaq.</div>' +
      '<div class="cert-fiktiv" data-fq="1">FİKTİV OYUN SƏNƏDİ — yalnız əyləncə məqsədi ilə hazırlanmışdır. Real hüquqi və ya rəsmi sənəd deyil.</div>' +
      '<div class="stamp" style="position:static;margin:16px auto 0;transform:rotate(-9deg)"><span>' +
      st.map(esc).join('<br>') + '</span></div>' +
      '</div>';
  }

  function boyuk(s) {
    return String(s || '').replace(/i/g, 'İ').replace(/ı/g, 'I').toUpperCase();
  }

  /* ---------------- sertifikat ---------------- */
  function certData() {
    return {
      no: D.no, title: D.title, name: D.investigator || '',
      minutes: S.minutes, pinned: S.pinned.length,
      stamp: ((D.cover && D.cover.closeStamp) || ['İŞ', 'BAĞLANDI']).slice(0, 2),
      link: S.certToken ? (location.origin + '/is/' + D.slug + '/hesabat/' + S.certToken) : ''
    };
  }

  /* OG variantı serverə yüklənir ki, paylaşılan linkin önizləməsi olsun.
     Uğursuzluq oyunu dayandırmır — link şəkilsiz də işləyir. */
  function sertifikatGonder() {
    if (S.certSent || !window.DCERT || !window.ZEXPORT || !S.certToken) return;
    S.certSent = true;
    var d = certData();
    d.link = location.origin + '/is/' + D.slug + '/hesabat/' + S.certToken;
    window.DCERT.ogJpeg(d)
      .then(function (b) { return API.post(BASE + '/sertifikat', b, true); })
      .catch(function () { S.certSent = false; });
  }

  function payla() {
    if (!window.DCERT || !window.ZEXPORT) { bildir('Şəkil çıxarıla bilmədi.'); return; }
    var d = certData();
    var ad = 'is-' + D.slug + '.png';

    window.DCERT.storyPng(d).then(function (blob) {
      if (window.ZEXPORT.canShareFiles()) {
        return window.ZEXPORT.shareFile(blob, ad, 'image/png', {
          title: 'İş № ' + D.no,
          text: 'İş № ' + D.no + ' bağlandı. ' + (d.link || '')
        });
      }
      window.ZEXPORT.saveBlob(blob, ad);
      bildir('Şəkil endirildi.');
    }).catch(function (e) {
      if (window.ZEXPORT.isAbort(e)) return;   /* istifadəçi ləğv etdi — xəta deyil */
      bildir('Şəkil çıxarıla bilmədi.');
    });
  }

  /* ---------------- lentlər ---------------- */
  $$('.tab').forEach(function (t) {
    t.onclick = function () {
      var g = t.getAttribute('data-go');

      /* Şübhəlilər və yekun rəy işi oxumamış açılmır. `disabled` QOYULMUR —
         bağlı düymə klik hadisəsi vermir və adam niyə keçmədiyini bilmir. */
      if ((g === 'suspects' || g === 'answer') && !hamsiKecilib() && !S.solved && !S.revealed) {
        bildir('Əvvəlcə bütün vərəqləri keç.');
        return;
      }

      $$('.tab').forEach(function (x) { x.classList.remove('on'); });
      t.classList.add('on');
      if (g === 'index') { siyahi(); $('#ttl').textContent = 'İş materialları'; }
      if (g === 'suspects') $('#ttl').textContent = 'Şübhəlilər';
      if (g === 'notes') { qeydler(); $('#ttl').textContent = 'İşçi qeydlər'; }
      if (g === 'answer') { $('#ttl').textContent = 'Yekun rəy'; qaliq(); }
      go(g);
    };
  });

  var back = $('#back');
  if (back) {
    back.onclick = function () {
      var a = $$('.tab').filter(function (t) { return t.classList.contains('on'); })[0];
      if (a) a.click();
    };
  }

  /* Səhifə giriş olan halda birbaşa qabıqla açılır. */
  if (D.access) {
    qur({
      docs: D.docs, suspects: D.suspects, chronology: D.chronology,
      questions: D.questions, meta: D.meta, state: D.state, endings: D.endings
    });
  }
})();
