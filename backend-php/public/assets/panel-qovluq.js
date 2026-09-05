/* İş qovluğu redaktoru — idarə panelinin JavaScript-i.

   Kitabxana yoxdur: sıralama HTML5 drag&drop, önizləmə fetch, nişan
   yapışdırma `setRangeText`. Panelin qalan səhifələri kimi ES5 üslubunda
   yazılıb (`var`, `function`) — bir fayl bir səhifə üçün.

   BÖYÜK «İ» TƏLƏSİ: burada heç bir slug və ya kod müqayisəsi aparılmır.
   `'İ'.toLowerCase()` JavaScript-də iki kod nöqtəsi verir və `i` bayraqlı
   regex `İ`-ni tutmur, ona görə slug qurma və müqayisə SERVERDƏDİR
   (`App\Support\Dossier\Isare::slugla()`). */
(function () {
  'use strict';

  function $(id) { return document.getElementById(id); }

  function csrf() {
    var m = document.querySelector('meta[name="csrf-token"]');
    return m ? m.getAttribute('content') : '';
  }

  /* ---------- 1. Tablar ---------- */
  var tablar = document.querySelectorAll('.qv-tab');

  if (tablar.length) {
    Array.prototype.forEach.call(tablar, function (t) {
      t.addEventListener('click', function () {
        var ad = t.getAttribute('data-tab');

        Array.prototype.forEach.call(tablar, function (x) { x.classList.remove('on'); });
        t.classList.add('on');

        Array.prototype.forEach.call(document.querySelectorAll('.qv-panel'), function (p) {
          p.classList.toggle('on', p.getAttribute('data-panel') === ad);
        });
      });
    });
  }

  /* ---------- 2. Sənədlərin sıralanması ----------
     Sürüşdürmə bitəndə BÜTÜN sıra göndərilir, yalnız dəyişən sətir yox:
     server tərəfdə `position` sahələri topluca yenilənir və aralıq
     vəziyyət yaranmır. */
  var siyahi = $('qvSenedler');

  if (siyahi) {
    var suruşen = null;

    siyahi.addEventListener('dragstart', function (e) {
      var li = e.target.closest('.qv-row');
      if (!li) return;
      suruşen = li;
      li.classList.add('surusur');
      e.dataTransfer.effectAllowed = 'move';
      /* Firefox sürüşdürməni yalnız data qoyulanda başladır. */
      e.dataTransfer.setData('text/plain', li.getAttribute('data-id'));
    });

    siyahi.addEventListener('dragover', function (e) {
      e.preventDefault();
      var li = e.target.closest('.qv-row');
      if (!li || !suruşen || li === suruşen) return;

      var r = li.getBoundingClientRect();
      var asagi = (e.clientY - r.top) / r.height > 0.5;
      siyahi.insertBefore(suruşen, asagi ? li.nextSibling : li);
    });

    siyahi.addEventListener('dragend', function () {
      if (!suruşen) return;
      suruşen.classList.remove('surusur');
      suruşen = null;
      nomrele();
      yaz();
    });

    function nomrele() {
      Array.prototype.forEach.call(siyahi.querySelectorAll('.qv-sira'), function (s, i) {
        s.textContent = String(i + 1);
      });
    }

    function yaz() {
      var ids = Array.prototype.map.call(siyahi.querySelectorAll('.qv-row'), function (li) {
        return Number(li.getAttribute('data-id'));
      });

      fetch(siyahi.getAttribute('data-url'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrf() },
        body: JSON.stringify({ ids: ids })
      }).catch(function () { /* şəbəkə səhvi — sıra səhifə yenilənəndə bərpa olunur */ });
    }
  }

  /* ---------- 3. Canlı önizləmə ----------
     Server render edilmiş HTML qaytarır və o, oyundakının EYNİSİDİR: eyni
     `renderDocument()` yolundan keçir. İkinci, sadələşdirilmiş render qatı
     gec-tez əslindən fərqlənərdi. */
  var redaktor = $('qvRedaktor');
  var forma = $('senedForm');
  var qutu = $('qvOnizleme');
  var hal = $('qvHal');

  if (redaktor && forma && qutu) {
    var gecikme = null;
    var novbe = false;
    var isleyir = false;

    /* Önizləmə İFRAME-ə yazılır.

       Səbəb təcridetmədir: `dossier.css` oyunun qlobal üslub faylıdır və
       `*`, `body`, `:root` seçicilərini yazır. Onu panelin öz sənədinə
       yükləmək bütün idarə səhifəsini qara fona salır və `panel.css`-in
       üstünə çıxır; faylı dəyişmək isə oyunun görkəmini pozardı.

       Sənəd hər dəfə tam yenidən yazılır (`document.write` yox, `open/write/
       close`), çünki üslub və şrift keşdən gəlir və bu, gözlə görünən
       gecikmə yaratmır. */
    function yaz(html) {
      var d = qutu.contentDocument;
      if (!d) return;

      d.open();
      d.write(
        '<!doctype html><html lang="az"><head><meta charset="utf-8">' +
        '<link rel="stylesheet" href="' + qutu.getAttribute('data-fonts') + '">' +
        '<link rel="stylesheet" href="' + qutu.getAttribute('data-uslub') + '">' +
        /* Oyunda vərəq telefon çərçivəsinin (`.frame`) içindədir və
           `body{display:flex}` onu ORTALAYIR. Burada çərçivə yoxdur, ona görə
           həmin flex ləğv edilir: əks halda sarğı flex elementi olur,
           `max-content` enə açılır və mikromətn haşiyəsi (bir sətirdə,
           `white-space:nowrap`) vərəqi 1600 piksel enə dartır — mətn hər iki
           kənardan kəsilir. */
        '<style>html,body{margin:0;padding:0;height:auto;display:block;background:#191C1A}' +
        '.qv-cerceve{padding:14px;width:100%}</style>' +
        '</head><body><div class="qv-cerceve">' + html + '</div>' +
        /* Ləkənin kənarı üçün turbulentlik süzgəci — oyun qabığında da
           qlobaldır və effekt qatının yeganə ortaq parçasıdır. */
        '<svg width="0" height="0" aria-hidden="true" style="position:absolute">' +
        '<filter id="kagizLeke"><feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="3" seed="7"/>' +
        '<feDisplacementMap in="SourceGraphic" scale="14"/></filter></svg>' +
        '</body></html>'
      );
      d.close();

      olcule();
    }

    /* Hündürlük məzmuna görə. Şriftlər gec gəlir və sətir sayı dəyişir, ona
       görə ölçmə bir neçə dəfə təkrarlanır — sabit hündürlük ya vərəqi kəsər,
       ya da boş sahə qoyardı. */
    function olcule() {
      var say = 0;

      var t = setInterval(function () {
        var d = qutu.contentDocument;

        if (d && d.body) {
          var h = d.body.scrollHeight;
          if (h > 0) { qutu.style.height = Math.min(h, 1400) + 'px'; }
        }

        if (++say >= 6) { clearInterval(t); }
      }, 180);
    }

    function ciz() {
      if (isleyir) { novbe = true; return; }

      isleyir = true;
      hal.textContent = 'yenilənir…';

      var fd = new FormData(forma);

      fetch(redaktor.getAttribute('data-onizleme'), {
        method: 'POST',
        headers: { 'X-CSRF-TOKEN': csrf(), 'Accept': 'application/json' },
        body: fd
      }).then(function (r) {
        return r.ok ? r.json() : r.json().then(function (j) { throw j; });
      }).then(function (j) {
        yaz(j.html || '');
        hal.textContent = 'hazır';
      }).catch(function (j) {
        /* Validasiya səhvi normaldır: idarəçi hələ başlıq yazmayıb. */
        hal.textContent = (j && j.message) ? 'yarımçıq: ' + j.message : 'önizləmə alınmadı';
      }).then(function () {
        isleyir = false;
        if (novbe) { novbe = false; ciz(); }
      });
    }

    function toxun() {
      clearTimeout(gecikme);
      gecikme = setTimeout(ciz, 400);
    }

    forma.addEventListener('input', toxun);
    forma.addEventListener('change', toxun);
    ciz();
  }

  /* ---------- 4. Nişanın yapışdırılması ----------
     `setRangeText` kursorun yerini saxlayır: mətnin sonuna əlavə etmək
     uzun protokolda şəkli tamam başqa yerə salardı. */
  var kitabxana = $('qvKitabxana');
  var metn = $('qvBody');

  if (kitabxana && metn) {
    kitabxana.addEventListener('click', function (e) {
      var fig = e.target.closest('.qv-sekil');
      if (!fig) return;

      yapisdir(fig.getAttribute('data-nisan'));
    });
  }

  function yapisdir(nisan) {
    if (!metn || !nisan) return;

    var evvel = metn.selectionStart;
    var netice = '\n' + nisan + '\n';

    metn.focus();

    if (typeof metn.setRangeText === 'function') {
      metn.setRangeText(netice, evvel, metn.selectionEnd, 'end');
    } else {
      metn.value = metn.value.slice(0, evvel) + netice + metn.value.slice(metn.selectionEnd);
    }

    metn.dispatchEvent(new Event('input', { bubbles: true }));
  }

  /* ---------- Mətn alətləri ----------
     İşarələri əl ilə yazmaq lazım deyil. Düymə seçilmiş sözü bürüyür; seçim
     yoxdursa nümunə söz qoyur və onu SEÇİLİ saxlayır, yəni növbəti yazılan
     hərf onu əvəz edir.

     Bu, WYSIWYG DEYİL və olmamalıdır: vərəq həmişə mətndən qurulur,
     `Metn::inline()` onu məhz bu işarələrlə oxuyur, və canlı önizləmə
     nəticəni onsuz da göstərir. Düymələr yalnız yazmağı əvəz edir. */
  function burü(acar, nümunə) {
    if (!metn) return;

    var par = acar.split('|');
    var sol = par[0];
    var sag = par.length > 1 ? par[1] : par[0];

    var b = metn.selectionStart;
    var s = metn.selectionEnd;
    var secili = metn.value.slice(b, s);
    var vardi = secili !== '';
    var ic = vardi ? secili : (nümunə || 'söz');

    metn.focus();

    if (typeof metn.setRangeText === 'function') {
      metn.setRangeText(sol + ic + sag, b, s, 'end');
    } else {
      metn.value = metn.value.slice(0, b) + sol + ic + sag + metn.value.slice(s);
    }

    /* Nümunə qoyulubsa, o seçili qalır: idarəçi dərhal öz sözünü yaza bilsin. */
    if (!vardi) {
      metn.setSelectionRange(b + sol.length, b + sol.length + ic.length);
    }

    metn.dispatchEvent(new Event('input', { bubbles: true }));
  }

  var alet = document.querySelector('.qv-alet');

  if (alet && metn) {
    alet.addEventListener('click', function (e) {
      var d = e.target.closest('.qv-a');
      if (!d) return;

      if (d.hasAttribute('data-bur')) { burü(d.getAttribute('data-bur'), d.textContent.trim()); return; }
      if (d.hasAttribute('data-qoy')) { yapisdir(d.getAttribute('data-qoy')); return; }

      if (d.hasAttribute('data-sekil')) {
        var q = $('qvSecSekil');
        if (q) { q.hidden = !q.hidden; if (!q.hidden) { q.scrollIntoView({ block: 'nearest' }); } }
      }
    });
  }

  /* Şəkil seçici — nişanı kursora salır və qutunu bağlayır. */
  var secQutu = $('qvSecSekil');

  if (secQutu) {
    secQutu.addEventListener('click', function (e) {
      if (e.target.closest('[data-bagla]')) { secQutu.hidden = true; return; }

      var fig = e.target.closest('.qv-sekil');
      if (!fig) return;

      yapisdir(fig.getAttribute('data-nisan'));
      secQutu.hidden = true;
    });
  }

  /* ---------- 5. Şəkil yükləməsi ----------
     Multipart: idarəçi hazır faylı sürüşdürüb atır. (Dəvətnamə və sosial
     kart axınlarında şəkli brauzer kətanda çəkir və xam bayt göndərir —
     burada belə deyil.) */
  var atma = $('qvYukle');
  var fayl = $('qvFayl');
  var yhal = $('qvYukleHal');

  if (atma && redaktor) {
    ['dragenter', 'dragover'].forEach(function (ev) {
      atma.addEventListener(ev, function (e) { e.preventDefault(); atma.classList.add('uzerinde'); });
    });

    ['dragleave', 'drop'].forEach(function (ev) {
      atma.addEventListener(ev, function (e) { e.preventDefault(); atma.classList.remove('uzerinde'); });
    });

    atma.addEventListener('drop', function (e) {
      if (e.dataTransfer.files && e.dataTransfer.files.length) { yfAc(e.dataTransfer.files[0], null); }
    });

    if (fayl) {
      fayl.addEventListener('change', function () {
        if (fayl.files && fayl.files.length) { yfAc(fayl.files[0], null); fayl.value = ''; }
      });
    }
  }

  /* Nişanı bir kliklə mətnə yapışdırır — xəbərdarlıqdakı düymə. */
  document.addEventListener('click', function (e) {
    var d = e.target.closest ? e.target.closest('.qv-nisan-yap') : null;
    if (!d) return;
    yapisdir(d.getAttribute('data-nisan'));
  });

  /* ---------- 6. Maddi sübutlar ----------
     Hər sətrin öz «Yüklə» düyməsi var: şəkil kitabxanaya düşür VƏ dərhal
     həmin sübuta bağlanır. Dinləyici delegasiya ilə qurulur, çünki sətirlər
     serverdən gəlir və sayı sənəddən-sənədə dəyişir. */
  document.addEventListener('change', function (e) {
    var setir = e.target.closest ? e.target.closest('.qv-sub') : null;
    if (!setir) return;

    if (e.target.matches('.qv-sub-yukle input[type="file"]')) {
      if (e.target.files && e.target.files.length) {
        yfAc(e.target.files[0], setir);
        e.target.value = '';
      }

      return;
    }

    if (e.target.matches('.qv-sub-sek')) {
      var o = e.target.options[e.target.selectedIndex];
      var img = o && o.value
        ? document.querySelector('.qv-sekil[data-nisan*=":' + o.value + ' "] img')
        : null;
      subutOnizleme(setir, img ? img.src : '');
    }
  });

  /* ---------- Şəkil yükləməsi ----------

     BRAUZER DİALOQU YOXDUR. Əvvəl üç `prompt()` açılırdı — açar, izah, növ.
     Onlar səhifəni bloklayır, şəkli göstərmir və növün nə demək olduğunu
     izah etmir; idarəçi boş qutuya ingiliscə açar yazmalı olurdu. İndi
     səhifədaxili forma açılır: şəkil dərhal görünür, açar fayl adından
     təklif edilir, görkəm isə öz adı ilə seçilir. */
  var yfForma = $('qvYukleForm');
  var yfOn = $('qvYfOn');
  var yfSlug = $('qvYfSlug');
  var yfIzah = $('qvYfIzah');
  var seciliFayl = null;
  var seciliSetir = null;

  /* Açar təklifi. SERVER onu yenidən təmizləyir və təkrarda `-2` əlavə edir —
     burada məqsəd yalnız hazır sətir göstərməkdir. Böyük «İ» tələsi də ona
     görə burada qorxulu deyil: son sözü server deyir. */
  function slugTeklif(ad) {
    var cedvel = { 'Ə': 'e', 'ə': 'e', 'Ğ': 'g', 'ğ': 'g', 'İ': 'i', 'I': 'i', 'ı': 'i',
                   'Ö': 'o', 'ö': 'o', 'Ş': 's', 'ş': 's', 'Ü': 'u', 'ü': 'u', 'Ç': 'c', 'ç': 'c' };
    var s = String(ad || '').replace(/\.[^.]+$/, '');
    s = s.replace(/[ƏəĞğİIıÖöŞşÜüÇç]/g, function (c) { return cedvel[c] || c; });
    return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 59);
  }

  function yfAc(fayl, setir) {
    if (!yfForma) return;

    seciliFayl = fayl;
    seciliSetir = setir || null;

    yfSlug.value = slugTeklif(fayl.name);
    yfIzah.value = '';

    /* Sətirdən açılıbsa, görkəm «Foto» olur: maddi sübutun şəkli adətən odur. */
    var nov = document.querySelector('input[name="qvYfNov"][value="' + (setir ? 'photo' : 'generic') + '"]');
    if (nov) { nov.checked = true; }

    var oxu = new FileReader();
    oxu.onload = function () { yfOn.src = oxu.result; };
    oxu.readAsDataURL(fayl);

    if (yhal) { yhal.textContent = ''; }
    yfForma.hidden = false;
    yfForma.scrollIntoView({ block: 'nearest' });
    yfSlug.focus();
    yfSlug.select();
  }

  function yfBagla() {
    if (!yfForma) return;
    yfForma.hidden = true;
    seciliFayl = null;
    seciliSetir = null;
    yfOn.removeAttribute('src');
  }

  function yfGonder() {
    if (!seciliFayl || !redaktor) return;

    var nov = document.querySelector('input[name="qvYfNov"]:checked');

    var fd = new FormData();
    fd.append('sekil', seciliFayl);
    fd.append('slug', yfSlug.value);
    fd.append('izah', yfIzah.value);
    fd.append('nov', nov ? nov.value : 'generic');

    /* Sahib vərəq redaktə olunan sənəddir: belədə kilidli vərəqin şəkli
       avtomatik spoiler qorumasına düşür və idarəçinin unutması mümkün olmur. */
    var sened = redaktor.getAttribute('data-sened');
    if (sened) { fd.append('sahibi', sened); }

    var hedef = seciliSetir;
    if (yhal) { yhal.textContent = 'yüklənir…'; }

    fetch(redaktor.getAttribute('data-yukle'), {
      method: 'POST',
      headers: { 'X-CSRF-TOKEN': csrf(), 'Accept': 'application/json' },
      body: fd
    }).then(function (r) {
      return r.ok ? r.json() : r.json().then(function (j) { throw j; });
    }).then(function (j) {
      elaveEt(j);
      secimeElaveEt(j.slug);

      if (hedef) {
        var sec = hedef.querySelector('.qv-sub-sek');
        if (sec) { sec.value = j.slug; sec.dispatchEvent(new Event('change', { bubbles: true })); }
        subutOnizleme(hedef, j.thumb);
      } else {
        yapisdir(j.nisan);
      }

      yfBagla();
    }).catch(function (j) {
      if (yhal) { yhal.textContent = (j && j.message) ? j.message : 'yüklənmədi'; }
    });
  }

  if (yfForma) {
    $('qvYfOk').addEventListener('click', yfGonder);
    $('qvYfLegv').addEventListener('click', yfBagla);
    yfSlug.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); yfGonder(); }
    });
  }

  /* Yeni şəkil BÜTÜN sübut seçimlərinə əlavə olunur: eyni foto bir neçə
     əşyaya aid ola bilər və səhifəni yeniləmək lazım gəlməməlidir. */
  function secimeElaveEt(slug) {
    Array.prototype.forEach.call(document.querySelectorAll('.qv-sub-sek'), function (sec) {
      if (sec.querySelector('option[value="' + slug + '"]')) return;

      var o = document.createElement('option');
      o.value = slug;
      o.textContent = slug;
      sec.appendChild(o);
    });
  }

  function subutOnizleme(setir, src) {
    var qutu = setir.querySelector('.qv-sub-on');
    if (!qutu) return;

    qutu.innerHTML = '';

    if (!src) { qutu.appendChild(document.createTextNode('foto yoxdur')); return; }

    var img = document.createElement('img');
    img.src = src;
    img.alt = '';
    qutu.appendChild(img);
  }

  function elaveEt(j) {
    if (!kitabxana) return;

    var fig = document.createElement('figure');
    fig.className = 'qv-sekil';
    fig.setAttribute('data-nisan', j.nisan);

    var img = document.createElement('img');
    img.src = j.thumb;
    img.alt = j.slug;

    var cap = document.createElement('figcaption');
    cap.textContent = j.slug;

    fig.appendChild(img);
    fig.appendChild(cap);
    kitabxana.appendChild(fig);
  }

  /* ---------- AI ilə iş qurma ----------

     İKİ MƏRHƏLƏ. 30 vərəqi bir OpenAI cavabına sığdırmaq mümkün deyil, altı
     çağırışı isə bir HTTP sorğusuna sığdırmaq vaxt aşımı deməkdir. Ona görə
     brauzer gedişi idarə edir: əvvəlcə skelet, sonra partiyalar — və hər
     addımda göstərici hərəkət edir. İşi yarıda saxlamaq da mümkündür,
     çünki qaralama artıq bazadadır.

     BİR SORĞU EYNİ ANDA. Server tərəfdə `throttle:ai` var (8/dəq) və
     paralel sorğular onu boş yerə yeyərdi. */
  var aiQutu = $('qvAi');

  if (aiQutu) {
    var aiBasla = $('qvAiBasla');
    var aiHal = $('qvAiHal');
    var aiCubuq = $('qvAiCubuq');
    var aiProblem = $('qvAiProblem');
    var aiIsleyir = false;
    var aiBasladi = 0;
    var aiSaat = null;
    var aiSonMetn = '';

    /* Keçən vaxt SANİYƏ-SANİYƏ yenilənir. Qurma bir neçə dəqiqə çəkir və
       donmuş yazı ilə işləyən proses fərqlənmir — sayğac hərəkət etdiyi
       müddətdə istifadəçi gözləməyin davam etdiyini bilir. */
    function aiGoster(metn) {
      aiSonMetn = metn;
      aiHal.textContent = metn + (aiBasladi ? ' · ' + Math.round((Date.now() - aiBasladi) / 1000) + ' san' : '');
    }

    function aiSaatBasla() {
      aiBasladi = Date.now();
      clearInterval(aiSaat);
      aiSaat = setInterval(function () { aiGoster(aiSonMetn); }, 1000);
    }

    function aiSaatDayan() {
      clearInterval(aiSaat);
      aiSaat = null;
      aiBasladi = 0;
    }

    function aiGedis(bitmis, hamisi) {
      aiCubuq.hidden = false;
      aiCubuq.firstElementChild.style.width =
        (hamisi ? Math.round((bitmis / hamisi) * 100) : 0) + '%';
    }

    function aiProblemler(siyahi) {
      if (!siyahi || !siyahi.length) return;

      aiProblem.hidden = false;
      aiProblem.innerHTML = '';

      siyahi.forEach(function (p) {
        var d = document.createElement('div');
        d.textContent = p;
        aiProblem.appendChild(d);
      });
    }

    function aiSor(url, govde) {
      return fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrf(),
          'Accept': 'application/json'
        },
        body: JSON.stringify(govde || {})
      }).then(function (r) {
        return r.json().then(function (j) {
          if (!r.ok || !j.ok) { throw new Error(j.message || 'Sorğu alınmadı.'); }
          return j;
        });
      });
    }

    function aiPartiya(id, bitmis, hamisi) {
      aiGoster('vərəqlər yazılır — ' + bitmis + '/' + hamisi);
      aiGedis(bitmis, hamisi);

      return aiSor(aiQutu.getAttribute('data-url') + '/' + id + '/senedler')
        .then(function (j) {
          if (j.done >= j.total) {
            aiGedis(j.total, j.total);
            return j;
          }

          return aiPartiya(id, j.done, j.total);
        });
    }

    aiBasla.addEventListener('click', function () {
      if (aiIsleyir) return;

      var brief = $('qvAiBrief').value.trim();

      if (brief === '') { aiGoster('Əvvəlcə tapşırığı yazın.'); return; }

      aiIsleyir = true;
      aiBasla.disabled = true;
      aiProblem.hidden = true;
      aiSaatBasla();
      aiGoster('hekayə qurulur — bu addım ən uzunudur');
      aiGedis(0, 1);

      var url = aiQutu.getAttribute('data-url');
      var hedef = null;

      aiSor(url, {
        brief: brief,
        count: Number($('qvAiSay').value) || 20,
        difficulty: $('qvAiCetin').value
      }).then(function (j) {
        hedef = j;
        aiProblemler(j.problems);

        return aiPartiya(j.id, 0, j.total);
      }).then(function () {
        aiSaatDayan();
        aiGoster('hazırdır — redaktora keçilir…');
        window.location.href = hedef.url;
      }).catch(function (e) {
        aiSaatDayan();
        /* Skelet artıq yaradılıbsa, işi itirmirik: qaralama bazadadır və
           idarəçi onu redaktorda açıb davam edə bilər. */
        aiGoster('alınmadı');

        /* Xəta KİÇİK sətirdə qalmır: səbəb uzun olur (model, limit, açar) və
           istifadəçi onu oxumadan nə edəcəyini bilmir. */
        var setirler = [e.message || 'Naməlum xəta.'];

        if (hedef) {
          setirler.push('Qaralama yaradılıb: «' + hedef.title + '». Redaktorda açıb davam edin: ' + hedef.url);
        }

        setirler.push('Ətraflı: backend-php/storage/logs/laravel.log');
        aiProblemler(setirler);

        aiIsleyir = false;
        aiBasla.disabled = false;
      });
    });
  }
}());
