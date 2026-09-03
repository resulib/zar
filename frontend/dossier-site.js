/* Satış səhifəsinin kiçik JS-i: kataloq süzgəcləri və nümunə vərəqlərinin keçidi.
   Oyunun `dossier.js` faylı ilə qarışdırılmır — o, `window.DOSSIER` və oyunun
   DOM-u olmadan işləmir.

   Səhifədə giriş animasiyası, sürüşərək görünən bölmə və sayğac YOXDUR:
   məhsulun tonu buna ziddir. */
(function () {
  'use strict';

  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };

  /* ---------------- kataloq süzgəcləri ----------------
     Süzgəclər yalnız iş sayı üçdən çox olanda render olunur, ona görə
     burada da yoxdursa heç nə edilmir. Süzmə səhifə yenilənmədən,
     `data-` atributları üzərində aparılır. */
  var suzgec = $('#suzgec');

  if (suzgec) {
    var secim = { cetinlik: '', deqiqe: '' };

    var uygun = function (kart) {
      if (secim.cetinlik && kart.getAttribute('data-cetinlik') !== secim.cetinlik) return false;

      if (secim.deqiqe) {
        var hedd = secim.deqiqe.split('-');
        var d = parseInt(kart.getAttribute('data-deqiqe'), 10) || 0;
        if (d < +hedd[0] || d > +hedd[1]) return false;
      }

      return true;
    };

    var suz = function () {
      var gorunen = 0;

      $$('#kataloq .kart').forEach(function (k) {
        var ok = uygun(k);
        k.hidden = !ok;
        if (ok) gorunen++;
      });

      var bos = $('#kataloqBos');
      if (bos) bos.hidden = gorunen > 0;
    };

    $$('.suzgec-d').forEach(function (b) {
      b.onclick = function () {
        var sahe = b.getAttribute('data-sahe');
        secim[sahe] = b.getAttribute('data-deyer');

        $$('.suzgec-d[data-sahe="' + sahe + '"]').forEach(function (x) {
          x.classList.remove('on');
        });
        b.classList.add('on');

        suz();
      };
    });
  }

  /* ---------------- nümunə vərəqləri ----------------
     Telefonda barmaqla sürüşdürülür (CSS `scroll-snap`), kompüterdə
     oxlarla. Yəni sürüşmə hər iki halda brauzerin öz sürüşməsidir —
     burada yalnız oxlar bağlanır. */
  var lent = $('#numuneLent');

  if (lent) {
    var verq = function () {
      var v = lent.querySelector('.numune-verq');
      return v ? v.getBoundingClientRect().width + 16 : lent.clientWidth;
    };

    var suru = function (yon) {
      lent.scrollBy({ left: yon * verq(), behavior: 'smooth' });
    };

    var sol = $('#numuneSol');
    var sag = $('#numuneSag');

    if (sol) sol.onclick = function () { suru(-1); };
    if (sag) sag.onclick = function () { suru(1); };

    /* Kənara çatanda ox söndürülür — basılıb heç nə etməyən düymə pisdir. */
    var oxlar = function () {
      var son = lent.scrollWidth - lent.clientWidth - 4;
      if (sol) sol.disabled = lent.scrollLeft <= 4;
      if (sag) sag.disabled = lent.scrollLeft >= son;
    };

    lent.addEventListener('scroll', oxlar, { passive: true });
    window.addEventListener('resize', oxlar);
    oxlar();
  }
})();
