/* Dəvətnamə redaktoru — səhifə məntiqi.
   invite.js (DAVET), devet-designs.js və export.js (ZEXPORT) tələb edir.

   Bu fayl saytın digər səhifələrinin kodundan asılı deyil və onun
   qlobal dəyişənlərinə toxunmur: bölmə tam müstəqildir. */
(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };
  var D = window.DAVET;

  var state = {
    event: 'toy',
    design: 'toy-qizil',
    palette: null,          /* null → dizaynın öz palitrası */
    ratio: 'kart',
    paid: false,
    online: false,        /* backend varmı — dist/statik rejimdə yoxdur */
    token: null,          /* dərc olunmuş dəvətnamənin açarı */
    link: '',
    price: 0,
    m: {                    /* forma məlumatları */
      hosts: '', title: '', date: '', time: '',
      venue: '', address: '', phone: '', note: '', guest: ''
    }
  };

  var SAHELER = { hosts: 'fHosts', title: 'fTitle', date: 'fDate', time: 'fTime',
                  venue: 'fVenue', address: 'fAddress', phone: 'fPhone',
                  note: 'fNote', guest: 'fGuest' };

  /* ---------- kömək ---------- */

  function bildir(mesaj) {
    var b = $('bildiris');
    b.querySelector('.mesaj').textContent = mesaj;
    b.classList.add('gorunur');
    clearTimeout(bildir._t);
    bildir._t = setTimeout(function () { b.classList.remove('gorunur'); }, 3200);
  }

  function dpr() { return Math.min(2, window.devicePixelRatio || 1); }

  /* Çəkiliş motoruna verilən obyekt. Boş sahələr nümunə mətnlə əvəz olunur ki,
     ilk açılışda önizləmə boş kağız kimi görünməsin. */
  function sened() {
    var ev = D.eventOf(state.event), n = ev.numune || {};
    var m = state.m;
    return {
      design: state.design,
      palette: state.palette || D.designOf(state.design).palette,
      event: state.event,
      guest: m.guest,
      hosts: m.hosts || n.adlar || '',
      title: m.title || n.baslik || '',
      date: m.date, time: m.time,
      venue: m.venue || n.mekan || '',
      address: m.address || 'Bakı, Nizami küç. 12',
      phone: m.phone || '',
      note: m.note || n.qeyd || ''
    };
  }

  /* ---------- 1. tədbirlər ---------- */

  function tedbirleriCiz() {
    var kok = $('tedbirler');
    kok.innerHTML = '';
    window.DAVET_EVENTS.forEach(function (ev) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'tedbir';
      b.setAttribute('aria-pressed', String(ev.id === state.event));
      b.dataset.event = ev.id;
      b.innerHTML = '<span class="nisan" aria-hidden="true"></span><span class="ad"></span>';
      b.querySelector('.nisan').textContent = ev.nisan;
      b.querySelector('.ad').textContent = ev.ad;
      kok.appendChild(b);
    });
  }

  function tedbirSec(id) {
    if (id === state.event) return;
    state.event = id;
    var ilk = window.DAVET_DESIGNS.filter(function (d) { return d.event === id; })[0];
    state.design = ilk ? ilk.id : state.design;
    state.palette = null;
    tedbirleriCiz();
    dizaynlariCiz();
    palitralariCiz();
    onizle();
    var q = $('dizaynQeyd');
    var ev = D.eventOf(id);
    q.textContent = ev.usaq
      ? 'Uşaq tədbirlərində şəkil yükləmə yoxdur; motivlər ümumi mövzulardır.'
      : 'Hər tədbir üçün üç fərqli variant var.';
  }

  /* ---------- 2. dizayn variantları ---------- */

  /* Kiçik önizləmələr eyni motorla çəkilir — kartda gördüyünüz nəticədir,
     ayrıca hazırlanmış şəkil deyil. */
  function dizaynlariCiz() {
    var kok = $('dizaynlar');
    kok.innerHTML = '';
    var list = window.DAVET_DESIGNS.filter(function (d) { return d.event === state.event; });
    var W = 260, k = dpr();

    list.forEach(function (d) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'dizayn';
      b.dataset.design = d.id;
      b.setAttribute('aria-pressed', String(d.id === state.design));

      var kart = document.createElement('div');
      kart.className = 'kart';
      var cv = document.createElement('canvas');
      var r = D.RATIOS.kart;
      var sc = W / r.w;
      cv.width = Math.round(r.w * sc * k);
      cv.height = Math.round(r.h * sc * k);
      kart.appendChild(cv);

      var ad = document.createElement('span'); ad.className = 'ad'; ad.textContent = d.ad;
      var bl = document.createElement('span'); bl.className = 'blurb'; bl.textContent = d.blurb;
      b.appendChild(kart); b.appendChild(ad); b.appendChild(bl);
      kok.appendChild(b);

      var inv = sened();
      inv.design = d.id; inv.palette = d.palette; inv.guest = '';
      D.draw(cv.getContext('2d'), inv, { ratio: 'kart', scale: sc * k });
    });
  }

  function dizaynSec(id) {
    state.design = id;
    state.palette = null;
    Array.prototype.forEach.call($('dizaynlar').children, function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.design === id));
    });
    palitralariCiz();
    onizle();
  }

  /* ---------- palitralar ---------- */

  function palitralariCiz() {
    var kok = $('palitralar');
    kok.innerHTML = '';
    var cari = state.palette || D.designOf(state.design).palette;
    Object.keys(window.DAVET_PALETTES).forEach(function (id) {
      var P = window.DAVET_PALETTES[id];
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'palitra';
      b.dataset.palette = id;
      b.title = P.ad;
      b.setAttribute('aria-label', P.ad);
      b.setAttribute('aria-pressed', String(id === cari));
      b.style.background = 'linear-gradient(135deg,' + P.kagiz + ' 0 50%,' + P.vurgu + ' 50% 100%)';
      kok.appendChild(b);
    });
  }

  /* ---------- 3. önizləmə ---------- */

  var NISBETLER = ['kart', 'kvadrat', 'hekaye'];

  function nisbetleriCiz() {
    var kok = $('nisbetler');
    kok.innerHTML = '';
    NISBETLER.forEach(function (r) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'nisbet';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-selected', String(r === state.ratio));
      b.dataset.ratio = r;
      b.textContent = D.RATIOS[r].qisa;
      kok.appendChild(b);
    });
  }

  /* Önizləmə ekran ölçüsündə çəkilir, amma yerləşdirmə məntiqi tam ölçüdədir —
     yəni ekranda gördüyünüz ilə yüklənən fayl eyni kompozisiyadır. */
  function onizle() {
    var cv = $('onizleme'), r = D.RATIOS[state.ratio], k = dpr();
    var enMax = state.ratio === 'hekaye' ? 380 : 560;
    var sc = enMax / r.w;
    cv.width = Math.round(r.w * sc * k);
    cv.height = Math.round(r.h * sc * k);
    cv.style.width = Math.round(r.w * sc) + 'px';
    D.draw(cv.getContext('2d'), sened(), { ratio: state.ratio, scale: sc * k, suNisani: !state.paid });
    $('onizlemeQeyd').textContent = state.paid
      ? 'Təmiz variant hazırdır.'
      : 'Pulsuz variantda su nişanı olur. Təmiz variant ödənişlidir.';
  }

  var t;
  function toxun() { clearTimeout(t); t = setTimeout(onizle, 160); }

  /* ---------- 4. yükləmə ---------- */

  function faylAdi(ratio, uz) {
    var ad = ZEXPORT.safeName((state.m.hosts || D.eventOf(state.event).ad).replace(/\s+/g, '-'), 'devetname');
    return ad + '-' + ratio + '.' + uz;
  }

  function tamKetan(ratio) {
    var r = D.RATIOS[ratio];
    var cv = document.createElement('canvas');
    cv.width = r.w; cv.height = r.h;
    D.draw(cv.getContext('2d'), sened(), { ratio: ratio, suNisani: !state.paid });
    return cv;
  }

  function png(ratio) {
    return D.ready().then(function () {
      var cv = tamKetan(ratio);
      return new Promise(function (res, rej) {
        cv.toBlob(function (b) { b ? res(b) : rej(new Error('kətan alınmadı')); }, 'image/png');
      });
    });
  }

  function yukle(ratio, tip) {
    var d = tip === 'pdf'
      ? D.ready().then(function () {
          var sehife = ratio === 'kvadrat' ? ZEXPORT.PAGE.kvadrat : ZEXPORT.PAGE.a6;
          return ZEXPORT.canvasPdf(tamKetan(ratio), faylAdi(ratio, '').slice(0, -1),
            { pw: sehife.pw, ph: sehife.ph, producer: 'Devetname', fallback: 'devetname' });
        })
      : png(ratio);

    return d.then(function (blob) {
      ZEXPORT.saveBlob(blob, faylAdi(ratio, tip));
    }).catch(function (e) {
      bildir('Fayl hazırlanmadı: ' + (e && e.message ? e.message : 'naməlum xəta'));
    });
  }

  function hamisiniYukle() {
    var b = $('btnHamisi');
    b.disabled = true;
    var kohne = b.textContent;
    b.textContent = 'Hazırlanır…';
    /* Ardıcıl gedir: eyni anda üç böyük kətan zəif telefonda yaddaşı doldurur. */
    NISBETLER.reduce(function (p, r) {
      return p.then(function () { return yukle(r, 'png'); })
              .then(function () { return new Promise(function (res) { setTimeout(res, 380); }); });
    }, Promise.resolve()).then(function () {
      b.disabled = false; b.textContent = kohne;
      bildir('Üç format da yükləndi.');
    });
  }

  /* ---------- API ---------- */

  var API = {
    csrf: function () {
      var m = document.querySelector('meta[name=csrf-token]');
      return m ? m.getAttribute('content') : '';
    },

    post: function (url, govde, xam) {
      var bas = { 'X-CSRF-TOKEN': API.csrf(), 'Accept': 'application/json' };
      if (!xam) bas['Content-Type'] = 'application/json';
      else bas['Content-Type'] = 'image/jpeg';
      return fetch(url, {
        method: 'POST', credentials: 'same-origin', headers: bas,
        body: xam ? govde : JSON.stringify(govde)
      }).then(API.oxu);
    },

    get: function (url) {
      return fetch(url, { credentials: 'same-origin', headers: { 'Accept': 'application/json' } })
        .then(API.oxu);
    },

    /* Cavab əvvəlcə mətn kimi oxunur: 419/500 səhifələri həmişə JSON olmur. */
    oxu: function (r) {
      return r.text().then(function (t) {
        var j = null;
        try { j = JSON.parse(t); } catch (e) { /* HTML səhifəsi */ }
        if (!r.ok) {
          var xeta = new Error((j && j.message) || 'Əməliyyat alınmadı.');
          xeta.kod = j && j.error;
          xeta.status = r.status;
          xeta.data = j || {};
          throw xeta;
        }
        return j || {};
      });
    }
  };

  /* Serverə göndərilən sahələr. Dizayn, palitra və tədbir server tərəfdə
     ağ siyahıdan keçir — buradan gələn sətir XAHİŞDİR, dəyər deyil. */
  function govde() {
    var m = state.m, n = D.eventOf(state.event).numune || {};
    return {
      event: state.event,
      design: state.design,
      palette: state.palette || D.designOf(state.design).palette,
      hosts: m.hosts || n.adlar || '',
      title: m.title || n.baslik || '',
      date: m.date, time: m.time,
      venue: m.venue || n.mekan || '',
      address: m.address,
      phone: m.phone,
      note: m.note || n.qeyd || '',
      rsvp: true
    };
  }

  /* ---------- dərc ---------- */

  /* Önizləmə şəkli brauzerdə hazırlanır və serverə xam JPEG kimi gedir:
     serverdə şəkil çəkən motor yoxdur, üstəlik belədə önizləmə tam olaraq
     istifadəçinin gördüyü kartdır. Ünvan və telefon bu şəkildə YOXDUR. */
  function onizlemeGonder(token) {
    return D.ready().then(function () {
      var cv = document.createElement('canvas');
      cv.width = D.OG.w; cv.height = D.OG.h;
      D.drawOg(cv.getContext('2d'), sened());
      return new Promise(function (res) { cv.toBlob(res, 'image/jpeg', 0.88); });
    }).then(function (blob) {
      if (!blob) return null;
      return API.post('/api/devet/' + token + '/onizleme', blob, true);
    }).catch(function () {
      /* Önizləmə şəkli olmasa link yenə işləyir — sadəcə söhbətdə şəkilsiz görünür. */
      return null;
    });
  }

  function dercEt() {
    var b = $('btnDerc');
    b.disabled = true;
    var kohne = b.textContent;
    b.textContent = 'Hazırlanır…';

    var addim = state.token
      ? API.post('/api/devet/' + state.token, govde())
      : API.post('/api/devet', govde());

    return addim.then(function (inv) {
      state.token = inv.token;
      return API.post('/api/devet/' + inv.token + '/derc', {});
    }).then(function (inv) {
      state.paid = true;
      state.link = inv.link;
      $('odenisModal').hidden = true;
      linkGoster();
      onizle();
      return onizlemeGonder(inv.token).then(function () { bildir('Link hazırdır.'); });
    }).catch(function (e) {
      if (e.kod === 'no_credits') odenisAc(e.data.need, e.data.have);
      else bildir(e.message);
    }).then(function () {
      b.disabled = false; b.textContent = kohne;
    });
  }

  function linkGoster() {
    $('paylasEvvel').hidden = true;
    $('paylasSonra').hidden = false;
    $('linkSahe').value = state.link;
    $('btnBax').href = state.link;
    $('btnWa').href = 'https://wa.me/?text=' + encodeURIComponent(
      (state.m.hosts || D.eventOf(state.event).ad) + ' — dəvətnamə: ' + state.link);
    $('paylasHal').textContent = 'Dəvətnamə yalnız bu linki bilən adama görünür.';
    $('yukleQeyd').textContent = 'Ödəniş edilib — fayllar su nişanısız yüklənir.';
  }

  function linkKopyala() {
    var s = $('linkSahe');
    s.select();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(s.value)
        .then(function () { bildir('Link kopyalandı.'); })
        .catch(function () { bildir('Linki əl ilə kopyalayın.'); });
    } else { bildir('Linki əl ilə kopyalayın.'); }
  }

  /* ---------- ödəniş ---------- */

  /* Neçə kredit lazımdır və neçəsi var — ikisi də göstərilir, çatmayan
     paketlər isə söndürülür. Əks halda istifadəçi yetərsiz paket alıb
     eyni pəncərəyə qayıdar və səbəbini anlamaz. */
  function odenisAc(lazim, var_) {
    state.price = lazim || state.price;
    var catismir = Math.max(0, state.price - (var_ || 0));

    $('odenisModal').hidden = false;
    $('odenisQeyd').textContent = 'Bu tədbir üçün ' + state.price + ' kredit lazımdır' +
      (var_ ? ' — sizdə ' + var_ + ' var.' : '.') +
      ' Ödəniş bir dəfə olur: sonra bütün formatlar, paylaşım linki və qonaq cavabları açılır.';

    Array.prototype.forEach.call($('paketler').children, function (b) {
      var kifayet = parseInt(b.dataset.credits, 10) >= catismir;
      b.disabled = !kifayet;
      b.classList.toggle('paket-az', !kifayet);
      var q = b.querySelector('.paket-qeyd');
      if (!kifayet) q.textContent = 'Bu tədbir üçün kifayət etmir';
      else q.textContent = b.dataset.note;
    });
  }

  function paketleriCiz(list) {
    var kok = $('paketler');
    kok.innerHTML = '';
    list.forEach(function (p) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'paket';
      b.dataset.pack = p.id;
      b.dataset.credits = p.credits;
      b.dataset.note = p.note;
      var sol = document.createElement('span');
      sol.innerHTML = '<span class="paket-ad"></span><br><span class="paket-qeyd"></span>';
      sol.querySelector('.paket-ad').textContent = p.label;
      sol.querySelector('.paket-qeyd').textContent = p.note;
      var sag = document.createElement('span');
      sag.className = 'paket-qiymet';
      sag.textContent = Number(p.amount).toFixed(2) + ' AZN';
      b.appendChild(sol); b.appendChild(sag);
      kok.appendChild(b);
    });
  }

  /* Əvvəlcə test ödənişi sınanır; istehsalatda o söndürülüdür və sorğu
     403 verir — həmin halda real provayderin səhifəsinə yönləndirilir. */
  function paketAl(id) {
    return API.post('/api/payments/simulate', { packId: id }).then(function (r) {
      if (r && r.redirectUrl) { location.href = r.redirectUrl; return; }
      bildir('Kredit əlavə olundu.');
      return dercEt();
    }).catch(function () {
      return API.post('/api/payments/checkout', { packId: id }).then(function (r) {
        if (r && r.redirectUrl) location.href = r.redirectUrl;
        else bildir('Ödəniş başlanmadı.');
      }).catch(function (e) { bildir(e.message); });
    });
  }

  /* Backend varmı? Yoxdursa paylaşma bölməsi ümumiyyətlə göstərilmir —
     yükləmə isə serversiz də işləyir. */
  function serveriYoxla() {
    return API.get('/api/devet/paketler').then(function (r) {
      state.online = true;
      state.price = r.price || 0;
      paketleriCiz(r.packs || []);
      $('paylas').hidden = false;
      $('qiymetQeyd').textContent = 'Bir tədbir üçün ' + state.price + ' kredit.';
    }).catch(function () {
      state.online = false;
    });
  }

  /* ---------- nümunə mətnlər ---------- */

  function numuneDoldur() {
    var n = D.eventOf(state.event).numune || {};
    state.m.hosts = n.adlar || '';
    state.m.title = n.baslik || '';
    state.m.venue = n.mekan || '';
    state.m.note = n.qeyd || '';
    if (!state.m.date) {
      /* Bu gündən bir ay sonra — yalnız forma doldurmaq üçün, çəkilişdə deyil. */
      var d = new Date(); d.setMonth(d.getMonth() + 1);
      state.m.date = d.toISOString().slice(0, 10);
    }
    if (!state.m.time) state.m.time = '18:00';
    if (!state.m.address) state.m.address = 'Bakı, Nizami küç. 12';
    Object.keys(SAHELER).forEach(function (k) { $(SAHELER[k]).value = state.m[k]; });
    onizle();
    bildir('Nümunə mətnlər dolduruldu — üzərində dəyişiklik edin.');
  }

  /* ---------- bağlantılar ---------- */

  function bagla() {
    $('tedbirler').addEventListener('click', function (e) {
      var b = e.target.closest('.tedbir');
      if (b) tedbirSec(b.dataset.event);
    });

    $('dizaynlar').addEventListener('click', function (e) {
      var b = e.target.closest('.dizayn');
      if (b) dizaynSec(b.dataset.design);
    });

    $('palitralar').addEventListener('click', function (e) {
      var b = e.target.closest('.palitra');
      if (!b) return;
      state.palette = b.dataset.palette;
      palitralariCiz();
      onizle();
    });

    $('nisbetler').addEventListener('click', function (e) {
      var b = e.target.closest('.nisbet');
      if (!b) return;
      state.ratio = b.dataset.ratio;
      nisbetleriCiz();
      onizle();
    });

    /* Bir dinləyici bütün forma üçün: sahələr artırılanda kod dəyişmir. */
    $('forma').addEventListener('input', function (e) {
      var id = e.target.id;
      for (var k in SAHELER) {
        if (SAHELER[k] === id) { state.m[k] = e.target.value; toxun(); return; }
      }
    });

    $('btnNumune').addEventListener('click', numuneDoldur);
    $('btnDerc').addEventListener('click', dercEt);
    $('btnKopyala').addEventListener('click', linkKopyala);

    $('paketler').addEventListener('click', function (e) {
      var b = e.target.closest('.paket');
      if (b) paketAl(b.dataset.pack);
    });
    $('odenisModal').addEventListener('click', function (e) {
      if (e.target === e.currentTarget || e.target.closest('[data-bagla]')) {
        $('odenisModal').hidden = true;
      }
    });
    $('btnHamisi').addEventListener('click', hamisiniYukle);

    document.addEventListener('click', function (e) {
      var b = e.target.closest('[data-yukle]');
      if (b) yukle(b.dataset.yukle, b.dataset.tip);
    });

    window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(onizle, 220); });
  }

  /* ---------- açılış ---------- */

  function bas() {
    tedbirleriCiz();
    nisbetleriCiz();
    palitralariCiz();
    bagla();
    /* Şriftlər gəlməmiş çəkilən mətn fallback şriftlə görünər, sonra sıçrayar —
       ona görə birinci çəkiliş şrift hazır olandan sonra aparılır. */
    D.ready().then(function () {
      dizaynlariCiz();
      onizle();
    });
    serveriYoxla();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bas);
  else bas();
})();
