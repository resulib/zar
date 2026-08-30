/* Qonağın gördüyü səhifə.
   invite.js (DAVET) və export.js (ZEXPORT) tələb edir.

   Bu səhifənin YEREL EHTİYAT NÜSXƏSİ YOXDUR: nə localStorage, nə statik
   məlumat. Yalnız serverin verdiyini göstərir — dərcdən çıxarılmış və ya
   silinmiş dəvətnamə dərhal görünməz olur. */
(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };
  var D = window.DAVET;

  var TOKEN = null, GUEST = null, inv = null, secim = null;

  var CAVAB = [
    { id: 'gelirem',  ad: 'Gəlirəm' },
    { id: 'gelmirem', ad: 'Gələ bilmirəm' },
    { id: 'bilmirem', ad: 'Hələ bilmirəm' }
  ];

  /* ---------- kömək ---------- */

  function bildir(mesaj) {
    var b = $('bildiris');
    b.querySelector('.mesaj').textContent = mesaj;
    b.classList.add('gorunur');
    clearTimeout(bildir._t);
    bildir._t = setTimeout(function () { b.classList.remove('gorunur'); }, 3200);
  }

  function hal(baslik, metn) {
    $('hal').innerHTML = '';
    var h = document.createElement('h1'); h.textContent = baslik;
    var p = document.createElement('p'); p.textContent = metn;
    $('hal').appendChild(h); $('hal').appendChild(p);
    $('hal').hidden = false;
    $('mezmun').hidden = true;
  }

  function csrf() {
    var m = document.querySelector('meta[name=csrf-token]');
    return m ? m.getAttribute('content') : '';
  }

  function post(url, govde) {
    return fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrf(), 'Accept': 'application/json' },
      body: JSON.stringify(govde)
    }).then(function (r) {
      return r.text().then(function (t) {
        var j = null;
        try { j = JSON.parse(t); } catch (e) { /* 419/500 səhifəsi JSON olmaya bilər */ }
        if (!r.ok) throw new Error((j && j.message) || 'Əməliyyat alınmadı.');
        return j || {};
      });
    });
  }

  /* ---------- çəkiliş ---------- */

  function kartCiz() {
    var cv = $('kart'), r = D.RATIOS.kart;
    var en = Math.min(460, Math.max(240, window.innerWidth - 44));
    var k = Math.min(2, window.devicePixelRatio || 1);
    var sc = en / r.w;
    cv.width = Math.round(r.w * sc * k);
    cv.height = Math.round(r.h * sc * k);
    cv.style.width = Math.round(r.w * sc) + 'px';
    D.draw(cv.getContext('2d'), sened(), { ratio: 'kart', scale: sc * k });
  }

  function sened() {
    return {
      design: inv.design, palette: inv.palette, event: inv.event,
      guest: inv.guest ? inv.guest.name : '',
      hosts: inv.hosts, title: inv.title,
      date: inv.date, time: inv.time,
      venue: inv.venue, address: inv.address,
      phone: inv.phone, note: inv.note
    };
  }

  /* ---------- məlumat sətirləri ---------- */

  function setir(baslik, deyer, iri) {
    if (!deyer) return null;
    var d = document.createElement('div');
    var dt = document.createElement('dt'); dt.textContent = baslik;
    var dd = document.createElement('dd'); dd.textContent = deyer;
    if (iri) dd.className = 'iri';
    d.appendChild(dt); d.appendChild(dd);
    return d;
  }

  function lovheCiz() {
    var kok = $('setirler');
    kok.innerHTML = '';
    var tarix = D.tarixSetri(inv.date);
    var saat = inv.time ? D.saatSetri(inv.time) : '';

    [setir('Tarix', tarix + (saat ? ' · ' + saat : ''), true),
     setir('Məkan', inv.venue, true),
     setir('Ünvan', inv.address),
     setir('Əlaqə', inv.phone),
     setir('Qeyd', inv.note)
    ].forEach(function (n) { if (n) kok.appendChild(n); });

    var x = $('xerite');
    if (inv.mapUrl) { x.href = inv.mapUrl; x.hidden = false; }

    var z = $('zeng');
    if (inv.phone) { z.href = 'tel:' + inv.phone.replace(/[^\d+]/g, ''); z.hidden = false; }
  }

  /* ---------- cavab ---------- */

  function secimleriCiz() {
    var kok = $('secimler');
    kok.innerHTML = '';
    CAVAB.forEach(function (c) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'secim';
      b.dataset.rsvp = c.id;
      b.setAttribute('aria-pressed', String(c.id === secim));
      b.innerHTML = '<span class="qutu" aria-hidden="true"></span><span></span>';
      b.lastChild.textContent = c.ad;
      kok.appendChild(b);
    });
  }

  function cavabQur() {
    if (!inv.rsvp) return;
    $('cavabBlok').hidden = false;

    var g = inv.guest;
    if (g && g.name) $('cavabBasliq').textContent = g.name + ', gələcəksiniz?';

    /* Adlı link varsa ad soruşulmur — kimin cavab verdiyi onsuz da bəllidir.
       Ümumi linkdə isə ad məcburidir, yoxsa lövhədə anonim sətir qalar. */
    $('adSahe').hidden = !!g;

    if (g && g.rsvp) {
      secim = g.rsvp;
      $('cQeyd').value = g.note || '';
      if (g.count) $('cNefer').value = g.count;
      yaxsiHal('Cavabınız qeydə alınıb. İstəsəniz dəyişə bilərsiniz.');
    }

    secimleriCiz();
    if (secim) detalGoster();
  }

  function detalGoster() {
    $('cavabDetal').hidden = false;
    $('neferSahe').hidden = secim !== 'gelirem';
  }

  function yaxsiHal(metn) {
    var h = $('cavabHal');
    h.textContent = metn;
    h.className = 'cavab-hal yaxsi';
  }

  function cavabGonder() {
    if (!secim) { bildir('Əvvəlcə cavabı seçin.'); return; }

    var ad = $('cAd').value.trim();
    if (!inv.guest && !ad) { bildir('Adınızı yazın.'); $('cAd').focus(); return; }

    var b = $('cGonder');
    b.disabled = true;
    var kohne = b.textContent;
    b.textContent = 'Göndərilir…';

    var url = '/api/devet/' + TOKEN + (GUEST ? '/q/' + GUEST : '') + '/cavab';
    post(url, {
      rsvp: secim,
      count: secim === 'gelirem' ? parseInt($('cNefer').value, 10) || 1 : null,
      name: ad,
      note: $('cQeyd').value.trim()
    }).then(function () {
      yaxsiHal(secim === 'gelirem'
        ? 'Təşəkkürlər, cavabınız göndərildi. Sizi gözləyirik.'
        : 'Cavabınız göndərildi. Təşəkkürlər.');
      bildir('Cavab göndərildi.');
    }).catch(function (e) {
      bildir(e.message);
    }).then(function () {
      b.disabled = false; b.textContent = kohne;
    });
  }

  /* ---------- alt düymələr ---------- */

  function kartYukle() {
    D.ready().then(function () {
      var r = D.RATIOS.kart;
      var cv = document.createElement('canvas');
      cv.width = r.w; cv.height = r.h;
      D.draw(cv.getContext('2d'), sened(), { ratio: 'kart' });
      cv.toBlob(function (blob) {
        if (!blob) { bildir('Şəkil hazırlanmadı.'); return; }
        var ad = ZEXPORT.safeName((inv.hosts || 'devetname').replace(/\s+/g, '-'), 'devetname');
        ZEXPORT.saveBlob(blob, ad + '.png');
      }, 'image/png');
    });
  }

  function linkKopyala() {
    var url = location.href;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url)
        .then(function () { bildir('Link kopyalandı.'); })
        .catch(function () { bildir(url); });
    } else { bildir(url); }
  }

  /* ---------- açılış ---------- */

  function bagla() {
    $('secimler').addEventListener('click', function (e) {
      var b = e.target.closest('.secim');
      if (!b) return;
      secim = b.dataset.rsvp;
      secimleriCiz();
      detalGoster();
    });
    $('cGonder').addEventListener('click', cavabGonder);
    $('yukleKart').addEventListener('click', kartYukle);
    $('linkKopyala').addEventListener('click', linkKopyala);

    var t;
    window.addEventListener('resize', function () {
      clearTimeout(t);
      t = setTimeout(function () { if (inv) kartCiz(); }, 200);
    });
  }

  function yukle() {
    var m = location.pathname.match(/^\/d\/([A-Za-z0-9]{22})(?:\/q\/([A-Za-z0-9]{22}))?/);
    if (!m) { hal('Dəvətnamə tapılmadı', 'Link natamam görünür.'); return; }
    TOKEN = m[1]; GUEST = m[2] || null;

    fetch('/api/devet/' + TOKEN + (GUEST ? '/q/' + GUEST : ''), {
      credentials: 'same-origin', headers: { 'Accept': 'application/json' }
    }).then(function (r) {
      if (r.status === 404) { hal('Dəvətnamə tapılmadı', 'Link köhnəlmiş və ya səhv ola bilər.'); return null; }
      if (r.status === 429) { hal('Bir az gözləyin', 'Çox sayda sorğu göndərildi. Bir dəqiqədən sonra yeniləyin.'); return null; }
      if (!r.ok) { hal('Açmaq alınmadı', 'Səhifəni yeniləyin.'); return null; }
      return r.json();
    }).then(function (j) {
      if (!j) return;
      inv = j;
      return D.ready().then(function () {
        $('hal').hidden = true;
        $('mezmun').hidden = false;
        kartCiz();
        lovheCiz();
        cavabQur();
        if (inv.hosts) document.title = inv.hosts;
      });
    }).catch(function () {
      hal('Açmaq alınmadı', 'İnternet bağlantınızı yoxlayıb yenidən cəhd edin.');
    });
  }

  function bas() { bagla(); yukle(); }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bas);
  else bas();
})();
