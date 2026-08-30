/* Tədbir sahibinin lövhəsi: qonaq siyahısı, cavablar və toplu kart ixracı.
   Səhifə `window.DEVET_TOKEN` və `window.DEVET_INV` dəyişənlərini verir. */
(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };
  var D = window.DAVET;
  var TOKEN = window.DEVET_TOKEN;
  var INV = window.DEVET_INV || {};
  var qonaqlar = [];
  var legvEdildi = false;

  var CAVAB_AD = { gelirem: 'Gəlir', gelmirem: 'Gələ bilmir', bilmirem: 'Hələ bilmir' };

  function bildir(mesaj) {
    var b = $('bildiris');
    b.querySelector('.mesaj').textContent = mesaj;
    b.classList.add('gorunur');
    clearTimeout(bildir._t);
    bildir._t = setTimeout(function () { b.classList.remove('gorunur'); }, 3200);
  }

  function csrf() {
    var m = document.querySelector('meta[name=csrf-token]');
    return m ? m.getAttribute('content') : '';
  }

  function api(url, govde) {
    var o = govde
      ? { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrf(), 'Accept': 'application/json' }, body: JSON.stringify(govde) }
      : { headers: { 'Accept': 'application/json' } };
    o.credentials = 'same-origin';
    return fetch(url, o).then(function (r) {
      return r.text().then(function (t) {
        var j = null;
        try { j = JSON.parse(t); } catch (e) { /* HTML səhifəsi */ }
        if (!r.ok) throw new Error((j && j.message) || 'Əməliyyat alınmadı.');
        return j || {};
      });
    });
  }

  function kopyala(metn, mesaj) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(metn)
        .then(function () { bildir(mesaj); })
        .catch(function () { bildir(metn); });
    } else { bildir(metn); }
  }

  /* ---------- cədvəl ---------- */

  function hucre(metn, sinif) {
    var td = document.createElement('td');
    if (sinif) td.className = sinif;
    td.textContent = metn;
    return td;
  }

  function cedveliCiz() {
    var tb = $('qonaqCedvel').querySelector('tbody');
    tb.innerHTML = '';

    if (!qonaqlar.length) {
      var tr = document.createElement('tr');
      var td = document.createElement('td');
      td.colSpan = 6;
      td.style.color = 'var(--murekkeb3)';
      td.textContent = 'Hələ qonaq yoxdur. Yuxarıdakı siyahını doldurun və ya ümumi linki paylaşın.';
      tr.appendChild(td); tb.appendChild(tr);
      return;
    }

    qonaqlar.forEach(function (g) {
      var tr = document.createElement('tr');
      tr.appendChild(hucre(g.name, 'ad'));

      var td = document.createElement('td');
      var n = document.createElement('span');
      var kod = g.rsvp || 'cavabsiz';
      n.className = 'nisan-cavab nisan-' + kod;
      n.textContent = CAVAB_AD[g.rsvp] || 'Cavabsız';
      td.appendChild(n);
      tr.appendChild(td);

      tr.appendChild(hucre(g.count ? String(g.count) : '—'));
      tr.appendChild(hucre(g.note || '—'));
      tr.appendChild(hucre(g.link || '—', 'link-hucre'));

      var son = document.createElement('td');
      if (g.link) {
        var sira = document.createElement('div');
        sira.className = 'sira';

        var k = document.createElement('button');
        k.type = 'button'; k.className = 'dugme-kicik';
        k.textContent = 'Kopyala';
        k.onclick = function () { kopyala(g.link, 'Link kopyalandı.'); };

        var w = document.createElement('a');
        w.className = 'dugme-kicik';
        w.target = '_blank'; w.rel = 'noopener';
        w.textContent = 'WhatsApp';
        w.href = 'https://wa.me/?text=' + encodeURIComponent(waMetn(g));

        sira.appendChild(k); sira.appendChild(w);
        son.appendChild(sira);
      }
      tr.appendChild(son);
      tb.appendChild(tr);
    });
  }

  /* Hazır mətn: qonağın adı ilə salamlama + link. Tək düymə ilə göndərilir. */
  function waMetn(g) {
    var kim = INV.hosts || '';
    var tarix = INV.date ? D.tarixSetri(INV.date) : '';
    return 'Əziz ' + g.name + ', ' +
      (kim ? kim + ' — ' : '') + 'dəvətnaməniz hazırdır' +
      (tarix ? ' (' + tarix + ')' : '') + ':\n' + g.link;
  }

  function yekunuYenile(y) {
    if (!y) return;
    var d = document.querySelectorAll('.yekun dd');
    if (d.length >= 5) {
      d[0].textContent = y.gelirem;
      d[1].textContent = y.nefer;
      d[2].textContent = y.gelmirem;
      d[3].textContent = y.bilmirem;
      d[4].textContent = y.cavabsiz;
    }
  }

  function yukle() {
    return api('/api/devet/' + TOKEN + '/qonaqlar').then(function (r) {
      qonaqlar = r.guests || [];
      yekunuYenile(r.yekun);
      cedveliCiz();
    }).catch(function (e) { bildir(e.message); });
  }

  /* ---------- siyahı ---------- */

  function siyahiYaz() {
    var b = $('siyahiYaz');
    b.disabled = true;
    var kohne = b.textContent;
    b.textContent = 'Yazılır…';

    api('/api/devet/' + TOKEN + '/qonaqlar', { names: $('qonaqMetn').value })
      .then(function (r) {
        qonaqlar = r.guests || [];
        yekunuYenile(r.yekun);
        cedveliCiz();
        bildir(qonaqlar.length + ' qonaq üçün ayrıca link hazırdır.');
      })
      .catch(function (e) { bildir(e.message); })
      .then(function () { b.disabled = false; b.textContent = kohne; });
  }

  /* ---------- toplu kart ixracı ---------- */

  /* Kartlar ARDICIL çəkilir: 200 qonaqda eyni anda 200 böyük kətan açmaq
     telefonun yaddaşını doldurar. Hər addımdan sonra idarə brauzerə
     qaytarılır ki, səhifə donmasın və ləğv düyməsi işləsin. */
  function zipYukle() {
    var linkli = qonaqlar.filter(function (g) { return !!g.link; });
    if (!linkli.length) { bildir('Əvvəlcə qonaq siyahısını yadda saxlayın.'); return; }

    var b = $('zipYukle'), p = $('proqres'), bar = p.querySelector('span');
    var kohne = b.textContent;
    legvEdildi = false;
    b.textContent = 'Ləğv et';
    p.hidden = false;
    bar.style.width = '0%';

    var fayllar = [];
    var r = D.RATIOS.kart;
    var cv = document.createElement('canvas');
    cv.width = r.w; cv.height = r.h;
    var ctx = cv.getContext('2d');

    function addim(i) {
      if (legvEdildi) { bitir('Ləğv edildi.'); return; }
      if (i >= linkli.length) {
        var blob = window.ZIPZ.qur(fayllar);
        ZEXPORT.saveBlob(blob, D.asciiAd(INV.hosts, 'devetname') + '-qonaqlar.zip');
        bitir(linkli.length + ' kart arxivə yığıldı.');
        return;
      }

      var g = linkli[i];
      D.draw(ctx, sened(g.name), { ratio: 'kart' });
      cv.toBlob(function (blob) {
        if (!blob) { addim(i + 1); return; }
        blob.arrayBuffer().then(function (buf) {
          var nomre = String(i + 1);
          while (nomre.length < 3) nomre = '0' + nomre;
          fayllar.push({ ad: nomre + '-' + D.asciiAd(g.name, 'qonaq') + '.png', data: new Uint8Array(buf) });
          bar.style.width = Math.round((i + 1) / linkli.length * 100) + '%';
          setTimeout(function () { addim(i + 1); }, 0);
        });
      }, 'image/png');
    }

    function bitir(mesaj) {
      b.textContent = kohne;
      p.hidden = true;
      bildir(mesaj);
    }

    D.ready().then(function () { addim(0); });
  }

  function sened(ad) {
    return {
      design: INV.design, palette: INV.palette, event: INV.event,
      guest: ad || '',
      hosts: INV.hosts, title: INV.title,
      date: INV.date, time: INV.time,
      venue: INV.venue, address: INV.address,
      phone: INV.phone, note: INV.note
    };
  }

  /* ---------- açılış ---------- */

  function bas() {
    $('siyahiYaz').addEventListener('click', siyahiYaz);
    $('zipYukle').addEventListener('click', function () {
      if ($('zipYukle').textContent === 'Ləğv et') { legvEdildi = true; return; }
      zipYukle();
    });
    $('umumiLink').addEventListener('click', function (e) {
      kopyala(e.currentTarget.dataset.link, 'Ümumi link kopyalandı.');
    });
    yukle();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bas);
  else bas();
})();
