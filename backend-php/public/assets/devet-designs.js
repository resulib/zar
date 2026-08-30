/* Dəvətnamə kataloqu — YALNIZ DATA. Çəkiliş məntiqi invite.js-dədir.
   11 tədbir × 3 variant = 33 dizayn. Variantlar 6 üslub × 12 palitra ×
   7 motiv kombinasiyasından qurulur, yəni 33 ədəd əl ilə yazılmış layout yoxdur.

   QAYDA: uşaq tədbirlərində `photo` həmişə false və motiv yalnız
   DAVET_MOTIFS siyahısındandır — multfilm qəhrəmanı, film personajı və
   brend simvolu yoxdur. tools/check-devet-designs.js bunu yoxlayır. */
(function (root) {
  'use strict';

  /* --- Palitralar -----------------------------------------------------
     kagiz/kagiz2 fon, murekkeb/murekkeb2 mətn, vurgu aksent, xett cizgi.
     `qara: true` — fon tünddür, çəkiliş kontrastı ona görə çevrilir. */
  var PALETTES = {
    qizil:    { ad: 'Qızıl',      kagiz: '#fbf8f1', kagiz2: '#f1e9d8', murekkeb: '#2c2921', murekkeb2: '#6d6453', vurgu: '#a6863c', vurguSoft: '#e8dab6', xett: '#d8cbab' },
    sedef:    { ad: 'Sədəf',      kagiz: '#fdf7f5', kagiz2: '#f7e7e3', murekkeb: '#3a2b2b', murekkeb2: '#7d6363', vurgu: '#bf7f76', vurguSoft: '#f0d6d0', xett: '#e6cdc7' },
    zeytun:   { ad: 'Zeytun',     kagiz: '#f8f8f2', kagiz2: '#e8ecdf', murekkeb: '#283024', murekkeb2: '#5f6b57', vurgu: '#6f8552', vurguSoft: '#d7e0c6', xett: '#ccd6bd' },
    lacivert: { ad: 'Lacivərd',   kagiz: '#f7f8fb', kagiz2: '#e5eaf3', murekkeb: '#1b2540', murekkeb2: '#4d5975', vurgu: '#2f4b86', vurguSoft: '#ccd8ee', xett: '#c6d0e2' },
    mercan:   { ad: 'Mərcan',     kagiz: '#fdf6f0', kagiz2: '#f8e2d2', murekkeb: '#3b2a20', murekkeb2: '#7d6353', vurgu: '#c26440', vurguSoft: '#f4d5c2', xett: '#e9cbb6' },
    lavanda:  { ad: 'Lavanda',    kagiz: '#faf7fd', kagiz2: '#ece4f6', murekkeb: '#2f2740', murekkeb2: '#655a7d', vurgu: '#7d5fa8', vurguSoft: '#ded0ef', xett: '#d5c8e6' },
    koku:     { ad: 'Şərab',      kagiz: '#fbf6f4', kagiz2: '#f0dedb', murekkeb: '#331b1f', murekkeb2: '#71484f', vurgu: '#8c2f3d', vurguSoft: '#eccdd0', xett: '#e0c3c5' },
    okean:    { ad: 'Okean',      kagiz: '#f4fafb', kagiz2: '#dcf0f2', murekkeb: '#12333a', murekkeb2: '#456a72', vurgu: '#1f7f8c', vurguSoft: '#c3e5e9', xett: '#bbdde1' },
    gunes:    { ad: 'Günəş',      kagiz: '#fffaef', kagiz2: '#ffeec6', murekkeb: '#3a2c12', murekkeb2: '#7d6733', vurgu: '#e39b1c', vurguSoft: '#ffe2a8', xett: '#f0d79a' },
    nane:     { ad: 'Nanə',       kagiz: '#f4fbf7', kagiz2: '#daf0e5', murekkeb: '#17332a', murekkeb2: '#4a6b5e', vurgu: '#2f8f6b', vurguSoft: '#c4e8d8', xett: '#bee0d0' },
    komur:    { ad: 'Kömür',      kagiz: '#1d1f24', kagiz2: '#2a2d34', murekkeb: '#f2f1ee', murekkeb2: '#a9a7a1', vurgu: '#c9a25a', vurguSoft: '#4a4230', xett: '#3d4048', qara: true },
    gece:     { ad: 'Gecə',       kagiz: '#141d33', kagiz2: '#1f2c4c', murekkeb: '#f4f6fb', murekkeb2: '#a6b0c8', vurgu: '#cbb26a', vurguSoft: '#39406a', xett: '#33405f', qara: true }
  };

  /* --- Motivlər — vektor, brendsiz, ümumi mövzular -------------------- */
  var MOTIFS = ['kosmos', 'dinozavr', 'deniz', 'heyvanlar', 'nagil', 'avtomobil', 'cicek'];

  /* --- Üslublar -------------------------------------------------------- */
  var STYLES = ['klassik', 'zerif', 'modern', 'rengli', 'motiv', 'korporativ'];

  /* --- Tədbirlər -------------------------------------------------------
     `usaq: true` olan tədbirdə foto yükləmə heç vaxt təklif olunmur. */
  var EVENTS = [
    { id: 'toy',          ad: 'Toy',                  nisan: '♥', ust: 'TOY MƏRASİMİ',      usaq: false,
      numune: { adlar: 'Aygün & Rəşad', baslik: 'Xoşbəxtliyimizi sizinlə bölüşmək istəyirik', mekan: 'Gülüstan Şadlıq Sarayı', qeyd: 'Təşrifinizi səbirsizliklə gözləyirik' } },
    { id: 'nisan',        ad: 'Nişan',                nisan: '◆', ust: 'NİŞAN MƏRASİMİ',    usaq: false,
      numune: { adlar: 'Nərmin & Elvin', baslik: 'Nişan şənliyimizə dəvətlisiniz', mekan: 'Zəfər Restoranı', qeyd: 'Sizi aramızda görmək bizim üçün dəyərlidir' } },
    { id: 'xina',         ad: 'Xınayaxdı',            nisan: '❋', ust: 'XINAYAXDI GECƏSİ',  usaq: false,
      numune: { adlar: 'Günel', baslik: 'Xınayaxdı gecəmə dəvətlisiniz', mekan: 'Bağ evi, Mərdəkan', qeyd: 'Qırmızı geyinməyi unutmayın' } },
    { id: 'sunnet',       ad: 'Sünnət toyu',          nisan: '✦', ust: 'SÜNNƏT TOYU',       usaq: true,
      numune: { adlar: 'Kamran', baslik: 'Oğlumuzun sünnət toyuna dəvətlisiniz', mekan: 'Bahar Şadlıq Evi', qeyd: 'Şirin gününüzə şərik olun' } },
    { id: 'usaq-ad-gunu', ad: 'Uşaq ad günü',         nisan: '★', ust: 'AD GÜNÜ',           usaq: true,
      numune: { adlar: 'Nihad 5 yaşında!', baslik: 'Ad günü şənliyimə səni gözləyirəm', mekan: 'Oyun Mərkəzi, Gənclik Mall', qeyd: 'Şirniyyat və oyunlar bizdən' } },
    { id: 'ad-gunu',      ad: 'Ad günü və yubiley',   nisan: '✧', ust: 'AD GÜNÜ',           usaq: false,
      numune: { adlar: 'Sevinc Xanım', baslik: '50 illik yubileyimə dəvətlisiniz', mekan: 'Karvan Restoranı', qeyd: 'Hədiyyə yox, iştirakınız kifayətdir' } },
    { id: 'bebi-sauer',   ad: 'Bebi şauer',           nisan: '❀', ust: 'BEBİ ŞAUER',        usaq: true,
      numune: { adlar: 'Leyla', baslik: 'Kiçik möcüzəmizi birlikdə qarşılayaq', mekan: 'Ev, Yasamal r., Şərifzadə 24', qeyd: 'Mavi yoxsa çəhrayı? Cavabı birlikdə açacağıq' } },
    { id: 'mezuniyyet',   ad: 'Məzuniyyət və son zəng', nisan: '✒', ust: 'MƏZUNİYYƏT',      usaq: false,
      numune: { adlar: '2026-cı il buraxılışı', baslik: 'Son zəng şənliyimizə dəvətlisiniz', mekan: '№ 132 saylı məktəb, akt zalı', qeyd: 'Onbir il bir gün kimi keçdi' } },
    { id: 'acilis',       ad: 'Mağaza / ofis açılışı', nisan: '✂', ust: 'AÇILIŞ MƏRASİMİ',  usaq: false,
      numune: { adlar: '«Ağac» Kafe', baslik: 'Açılış mərasimimizə dəvətlisiniz', mekan: 'Bakı, Xaqani küç. 18', qeyd: 'Açılış günü bütün qonaqlara qəhvə hədiyyə' } },
    { id: 'korporativ',   ad: 'Korporativ tədbir',    nisan: '■', ust: 'KORPORATİV TƏDBİR', usaq: false,
      numune: { adlar: 'İllik Yığıncaq 2026', baslik: 'Komandamızın illik görüşünə dəvətlisiniz', mekan: 'Konfrans zalı, 4-cü mərtəbə', qeyd: 'Proqram saat 19:00-da şam yeməyi ilə yekunlaşır' } },
    { id: 'yeni-il',      ad: 'Yeni il şənliyi',      nisan: '❆', ust: 'YENİ İL ŞƏNLİYİ',   usaq: false,
      numune: { adlar: 'Yeni il gecəsi', baslik: 'İl sonu şənliyimizə dəvətlisiniz', mekan: 'Panorama Restoranı', qeyd: 'Gecə boyu musiqi və rəqs' } }
  ];

  /* --- Dizaynlar -------------------------------------------------------
     Hər tədbir üçün üç variant: zərif · sadə/müasir · rəngli.
     `motiv` yalnız üslubu `motiv` olan dizaynlarda olur. */
  function d(id, event, style, palette, ad, blurb, motiv) {
    return { id: id, event: event, style: style, palette: palette, ad: ad, blurb: blurb,
             motiv: motiv || null, photo: false };
  }

  var DESIGNS = [
    /* Toy */
    d('toy-qizil',     'toy', 'zerif',   'qizil',    'Qızıl zərafət',  'Əl yazısı başlıq, incə qızılı çərçivə'),
    d('toy-sade',      'toy', 'modern',  'zeytun',   'Sadə zeytun',    'Geniş boşluq, təmkinli tipoqrafika'),
    d('toy-koku',      'toy', 'rengli',  'koku',     'Şərab rəngi',    'Dolğun fon, iri display başlıq'),
    /* Nişan */
    d('nisan-sedef',   'nisan', 'zerif',  'sedef',   'Sədəf',          'Çəhrayı-inci ton, əl yazısı adlar'),
    d('nisan-sade',    'nisan', 'modern', 'lacivert','Lacivərd sətir', 'Sola dayaqlı müasir yerləşdirmə'),
    d('nisan-lavanda', 'nisan', 'rengli', 'lavanda', 'Lavanda',        'Yumşaq qradiyent, iri adlar'),
    /* Xınayaxdı */
    d('xina-koku',     'xina', 'klassik', 'koku',    'Qırmızı naxış',  'Ənənəvi çərçivə və ornament'),
    d('xina-mercan',   'xina', 'rengli',  'mercan',  'Mərcan',         'İsti rəng, iri başlıq'),
    d('xina-cicek',    'xina', 'motiv',   'sedef',   'Çiçəkli',        'Çiçək motivli haşiyə', 'cicek'),
    /* Sünnət toyu */
    d('sunnet-qizil',  'sunnet', 'klassik', 'qizil',   'Qızılı çərçivə', 'Klassik ikiqat haşiyə'),
    d('sunnet-okean',  'sunnet', 'modern',  'okean',   'Okean',          'Təmiz, sadə, mavi aksent'),
    d('sunnet-ulduz',  'sunnet', 'motiv',   'lacivert','Kosmos',         'Raket və ulduz motivi', 'kosmos'),
    /* Uşaq ad günü */
    d('usaq-kosmos',   'usaq-ad-gunu', 'motiv', 'lacivert', 'Kosmos',    'Raket, planet, ulduzlar', 'kosmos'),
    d('usaq-dino',     'usaq-ad-gunu', 'motiv', 'nane',     'Dinozavr',  'Dinozavr və yaşıllıq', 'dinozavr'),
    d('usaq-deniz',    'usaq-ad-gunu', 'motiv', 'okean',    'Dəniz',     'Dalğa, balıq, günəş', 'deniz'),
    /* Ad günü və yubiley */
    d('adgunu-qizil',  'ad-gunu', 'klassik', 'qizil',  'Qızılı yubiley', 'Rəsmi, təmkinli çərçivə'),
    d('adgunu-sade',   'ad-gunu', 'modern',  'komur',  'Gecə kömürü',    'Tünd fon, açıq tipoqrafika'),
    d('adgunu-mercan', 'ad-gunu', 'rengli',  'mercan', 'Mərcan',         'Canlı rəng, iri rəqəm'),
    /* Bebi şauer */
    d('bebi-nane',     'bebi-sauer', 'modern', 'nane',    'Nanə',      'Yumşaq yaşıl, sadə yerləşdirmə'),
    d('bebi-sedef',    'bebi-sauer', 'zerif',  'sedef',   'Sədəf',     'İncə, əl yazısı başlıq'),
    d('bebi-heyvan',   'bebi-sauer', 'motiv',  'gunes',   'Heyvanlar', 'Ayı, dovşan, bulud motivi', 'heyvanlar'),
    /* Məzuniyyət */
    d('mezun-lacivert','mezuniyyet', 'klassik', 'lacivert', 'Akademik',  'Rəsmi lacivərd və qızıl'),
    d('mezun-sade',    'mezuniyyet', 'modern',  'komur',    'Sadə',      'Kontrastlı, müasir'),
    d('mezun-gunes',   'mezuniyyet', 'rengli',  'gunes',    'Günəş',     'Parlaq sarı, şən ton'),
    /* Açılış */
    d('acilis-korp',   'acilis', 'korporativ', 'komur',    'Kömür',     'Təmiz şəbəkə, logosuz'),
    d('acilis-qizil',  'acilis', 'klassik',    'qizil',    'Qızılı lent','Rəsmi açılış görünüşü'),
    d('acilis-mercan', 'acilis', 'rengli',     'mercan',   'Mərcan',    'Diqqətçəkən rəng bloku'),
    /* Korporativ */
    d('korp-komur',    'korporativ', 'korporativ', 'komur',    'Kömür',    'Şirkət üslubunda təmkinli'),
    d('korp-lacivert', 'korporativ', 'korporativ', 'lacivert', 'Lacivərd', 'İşgüzar, aydın iyerarxiya'),
    d('korp-sade',     'korporativ', 'modern',     'okean',    'Okean',    'Açıq fon, tək aksent zolağı'),
    /* Yeni il */
    d('yeniil-gece',   'yeni-il', 'rengli',  'gece',     'Gecə',     'Tünd göy fon, qızılı ulduzlar'),
    d('yeniil-qar',    'yeni-il', 'klassik', 'lacivert', 'Qar',      'Qar dənəsi ornamenti'),
    d('yeniil-sade',   'yeni-il', 'modern',  'komur',    'Sadə gecə','Minimal, tünd, aydın')
  ];

  root.DAVET_PALETTES = PALETTES;
  root.DAVET_MOTIFS   = MOTIFS;
  root.DAVET_STYLES   = STYLES;
  root.DAVET_EVENTS   = EVENTS;
  root.DAVET_DESIGNS  = DESIGNS;
})(typeof window !== 'undefined' ? window : this);
