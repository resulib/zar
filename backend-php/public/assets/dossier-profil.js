/* MÜSTƏNTİQ PROFİLİ — vəsiqənin PNG kimi endirilməsi.

   Serverdə SVG→PNG çevirici yoxdur (bax `dossier-cert.js`, `invite.js`):
   kart serverdə SVG kimi qurulur, şəkilə isə BRAUZER çevirir. `ZEXPORT`
   onsuz da bu bölmədə yüklənir və eyni işi sertifikat üçün görür.

   Kartın SVG-si qəsdən özü-özünə yetərlidir — CSS dəyişəni, `@font-face`
   ailəsi və xarici şəkil yoxdur, ona görə kətanda olduğu kimi çıxır. */
(function () {
  'use strict';

  var kok = document.getElementById('vesiqe');
  var dug = document.getElementById('kartEndir');

  if (!kok || !dug) return;

  function bildir(m) {
    var q = document.getElementById('bildiris');
    if (!q) return;
    q.querySelector('.mesaj').textContent = m;
    q.classList.add('gorunur');
    setTimeout(function () { q.classList.remove('gorunur'); }, 2600);
  }

  dug.addEventListener('click', function () {
    var svg = kok.querySelector('svg');

    if (!svg || !window.ZEXPORT) {
      bildir('Şəkil çıxarıla bilmədi.');
      return;
    }

    var w = svg.viewBox.baseVal.width || 540;
    var h = svg.viewBox.baseVal.height || 860;
    var ad = 'vesiqe-' + window.ZEXPORT.safeName(
      (dug.getAttribute('data-no') || 'mustentiq'), 'mustentiq') + '.png';

    dug.disabled = true;

    /* Ölçək 2: 540×860 → 1080×1720. Mikromətn zolağı hüquqi qalxanın
       hissəsidir və daha kiçik ölçəkdə oxunmaz hala düşür. */
    window.ZEXPORT.pngBlob(new XMLSerializer().serializeToString(svg), w, h, 2)
      .then(function (blob) {
        if (window.ZEXPORT.canShareFiles()) {
          return window.ZEXPORT.shareFile(blob, ad, 'image/png', {
            title: 'Müstəntiq vəsiqəsi'
          }).catch(function (e) {
            if (window.ZEXPORT.isAbort(e)) return;
            window.ZEXPORT.saveBlob(blob, ad);
          });
        }

        window.ZEXPORT.saveBlob(blob, ad);
        bildir('Vəsiqə endirildi.');
      })
      .catch(function (e) {
        if (window.ZEXPORT.isAbort(e)) return;   // istifadəçi ləğv etdi — xəta deyil
        bildir('Şəkil çıxarıla bilmədi.');
      })
      .then(function () { dug.disabled = false; });
  });
})();
