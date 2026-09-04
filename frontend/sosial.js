/* ==================================================================
   Zarafat Notariat Palatası — SOSİAL KİMLİK KARTLARI kataloqu
   6 kart · 1 kateqoriya · 2 platforma (TikTok · Instagram)

   DİQQƏT: bu fayl `window.CATEGORIES` / `window.TEMPLATES` massivlərinə
   HEÇ NƏ ƏLAVƏ ETMİR — eynilə `replies.js` kimi. `tools/check-templates.js`
   hərfi olaraq «18 kateqoriya · 216 şablon», «hər kateqoriyada düz 12 şablon»
   və «hər kateqoriya 12 dizaynın hamısını əhatə edir» invariantlarını tələb
   edir; 12 layout × 12 şablon artıq bijeksiyadır və boş yer yoxdur
   (CLAUDE.md, «bijection trap»).

   Bazada bunlar adi `templates` sətirləridir: `templates.social_kind`
   doludur və kateqoriyanı `categories.is_social = true` daşıyır.
   `CatalogService::payload()` yükü altı açara bölür.

   Struktur `templates.js` ilə eynidir + iki açar:
     socialKind — hansı platforma ('tiktok' | 'instagram'); boşdursa hər ikisi
     cardStyle  — kartın stili ('resmi' | 'tund' | 'sade'); bax doc.js KART_STILLER

   Kartlar A4 sənəd DEYİL: `DOCGEN.kart()` onları 1080×1350 kətanda, kredit
   kartı nisbətində, iki üzlü çəkir (bax: doc.js «SOSİAL KİMLİK KARTI» bölməsi).
   `DOCGEN.sheet()` dispetçeri `doc.social` görəndə avtomatik ona keçir.

   `layout: 'vesiqe'` yenə də saxlanılır: serverin ağ siyahısı (`Sanitizer::pick`)
   etibarlı dəyər tələb edir və kart hər hansı səbəbdən `a4()`-dən keçsə,
   `vesiqe` onu ən yaxın formada — şəxsiyyət vəsiqəsi kimi — çəkir.

   Yoxlama: node tools/check-sosial.js · node tools/check-copy.js
   ================================================================== */

/* Server tərəfi güzgüsü: backend-php/config/sosial.php `platforms`.
   `logo` YOXDUR — nişanlar `frontend/doc.js` içindədir, çünki doc.js-in
   yeganə xarici asılılığı `qr.js` olmalıdır. */
window.SOSIAL_KINDS = [
  { k: 'tiktok', name: 'TikTok', icon: '♪', prefix: 'SOS',
    hosts: ['tiktok.com', 'www.tiktok.com', 'vm.tiktok.com', 'm.tiktok.com'],
    blurb: 'TikTok profilinizdən kimlik kartı hazırlayın.' },
  { k: 'instagram', name: 'Instagram', icon: '◎', prefix: 'SOS',
    hosts: ['instagram.com', 'www.instagram.com', 'instagr.am'],
    blurb: 'Instagram profilinizdən kimlik kartı hazırlayın.' }
];

window.SOSIAL_CATEGORIES = [
  { id: 's-kart', tone: 'zarafat', isSocial: true, name: 'Sosial kimlik kartı', icon: '▣',
    blurb: 'TikTok və ya Instagram profilinizdən parodiya kimlik kartı — foto, istifadəçi adı və izləyici sayı ilə.' }
];

window.SOSIAL_CARDS = [

/* ==================== ▣ SOSİAL KİMLİK KARTI ====================
   layout: vesiqe · prefiks: SOS
   Qurum ailəsi (3): Rəqəmsal Məzmun Qeydiyyatı · Onlayn Auditoriya Komissiyası ·
   Sosial Şəbəkə Fəaliyyətinin Uçotu Mərkəzi */
{
  id: 's-yaradici', cat: 's-kart', tone: 'zarafat', layout: 'vesiqe', palette: 'steel', cardStyle: 'resmi',
  regPrefix: 'SOS',
  title: 'Rəqəmsal Məzmun Yaradıcısı kimi Qeydiyyata Alınma haqqında Vəsiqə', tag: 'Ən çox seçilən',
  signOrg: 'Rəqəmsal Məzmun Qeydiyyatı üzrə Baş İdarə',
  toLabel: 'KART SAHİBİ', fromLabel: 'PLATFORMA',
  preamble: 'Bu vəsiqə ilə təsdiq olunur ki, {{username}} istifadəçi adlı şəxs {from} platformasında rəqəmsal məzmun yaradıcısı kimi qeydiyyata alınmışdır. Qeydiyyat anına auditoriyanın həcmi {{followers}} təşkil edir və kartın arxa hissəsində göstərilmişdir.',
  powers: 'Sahibi öz profilində məzmun yerləşdirmək səlahiyyətinə malikdir.\nAuditoriya qarşısında verilmiş vədlər qeydiyyata alınır.\nŞərhlərə cavab vermək öhdəliyi kartın ayrılmaz hissəsidir.\nKart yalnız göstərilən istifadəçi adı ilə birlikdə etibarlıdır.',
  penalty: 'Profil silindiyi və ya adı dəyişdirildiyi halda kart avtomatik olaraq qüvvədən düşür və yenidən qeydiyyat tələb olunur.',
  titleOptions: [
    'Rəqəmsal Məzmun Yaradıcısı kimi Qeydiyyata Alınma haqqında Vəsiqə',
    'Məzmun Yaradıcısı Statusunun Rəsmi Təsdiqi haqqında Şəhadətnamə',
    'Profil Fəaliyyətinin Qeydiyyata Alınması haqqında Kimlik Kartı',
    'Rəqəmsal Yaradıcılıq Fəaliyyətinə Buraxılış haqqında Vəsiqə'
  ],
  powersOptions: [
    'Sahibi öz profilində məzmun yerləşdirmək səlahiyyətinə malikdir.',
    'Auditoriya qarşısında verilmiş vədlər qeydiyyata alınır.',
    'Şərhlərə cavab vermək öhdəliyi kartın ayrılmaz hissəsidir.',
    'Kart yalnız göstərilən istifadəçi adı ilə birlikdə etibarlıdır.',
    'Paylaşımın keyfiyyəti barədə mübahisə kartın qüvvəsinə təsir etmir.',
    'İzləyici sayının azalması ayrıca qeydə alınmır.',
    'Profil şəkli dəyişdirildikdə kart yenidən çap olunmur.',
    'Sahibi öz auditoriyası qarşısında şəxsən məsuliyyət daşıyır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Profil silindiyi və ya adı dəyişdirildiyi halda kart avtomatik olaraq qüvvədən düşür və yenidən qeydiyyat tələb olunur.',
    'Bir ay ərzində heç bir paylaşım edilmədikdə kartın qüvvəsi müvəqqəti dayandırılır.',
    'Kartın başqa şəxsə verilməsi qadağandır və aşkarlandıqda qeydiyyat ləğv edilir.'
  ]
},
{
  id: 's-auditoriya', cat: 's-kart', tone: 'zarafat', layout: 'vesiqe', palette: 'gold', cardStyle: 'sade',
  regPrefix: 'SOS',
  title: 'İzləyici Sayının Qeydə Alınması və Təsdiqi haqqında Şəhadətnamə', tag: 'Auditoriya',
  signOrg: 'Onlayn Auditoriya Məsələləri üzrə Komissiya',
  toLabel: 'KART SAHİBİ', fromLabel: 'PLATFORMA',
  preamble: 'Komissiya {from} platformasındakı {{username}} profilinə baxaraq müəyyən etmişdir ki, qeydiyyat anına izləyicilərin sayı {{followers}} təşkil edir. Göstərilən rəqəm həmin an üçün təsbit edilmiş və bu şəhadətnaməyə daxil edilmişdir.',
  powers: 'İzləyici sayı yalnız qeydiyyat anı üçün təsbit edilmiş sayılır.\nRəqəmin sonrakı dəyişməsi şəhadətnamənin qüvvəsinə təsir etmir.\nSahibi göstərilən rəqəmi mübahisə predmetinə çevirə bilməz.\nTəkrar ölçmə istənilən vaxt tələb oluna bilər.',
  penalty: 'Göstərilən rəqəmin süni yolla artırıldığı aşkarlandıqda şəhadətnamə qüvvədən düşür və yenidən verilmir.',
  titleOptions: [
    'İzləyici Sayının Qeydə Alınması və Təsdiqi haqqında Şəhadətnamə',
    'Onlayn Auditoriyanın Həcminin Təsbiti haqqında Rəsmi Vəsiqə',
    'Profil Auditoriyasının Ölçülməsinin Nəticələri üzrə Şəhadətnamə',
    'Auditoriya Göstəricisinin Qeydiyyata Alınması haqqında Kart'
  ],
  powersOptions: [
    'İzləyici sayı yalnız qeydiyyat anı üçün təsbit edilmiş sayılır.',
    'Rəqəmin sonrakı dəyişməsi şəhadətnamənin qüvvəsinə təsir etmir.',
    'Sahibi göstərilən rəqəmi mübahisə predmetinə çevirə bilməz.',
    'Təkrar ölçmə istənilən vaxt tələb oluna bilər.',
    'Ölçmənin nəticəsi yalnız göstərilən profilə şamil edilir.',
    'Rəqəmin yuvarlaqlaşdırılması texniki qayda hesab olunur.',
    'Auditoriyanın fəallığı ayrıca qiymətləndirilmir.',
    'Müqayisəli göstəricilər şəhadətnaməyə daxil edilmir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Göstərilən rəqəmin süni yolla artırıldığı aşkarlandıqda şəhadətnamə qüvvədən düşür və yenidən verilmir.',
    'Profil bağlandıqda ölçmənin nəticəsi arxivə keçirilir və qüvvədən düşür.',
    'Rəqəmin təhrif edilmiş şəkildə yayılması sənədin ləğvi ilə nəticələnir.'
  ]
},
{
  id: 's-fasilesizlik', cat: 's-kart', tone: 'zarafat', layout: 'vesiqe', palette: 'forest', cardStyle: 'resmi',
  regPrefix: 'SOS',
  title: 'Kontent Fasiləsizliyi Öhdəliyinin Qəbul Edilməsi haqqında Kart', tag: 'Öhdəlik',
  signOrg: 'Sosial Şəbəkə Fəaliyyətinin Uçotu üzrə Mərkəz',
  toLabel: 'ÖHDƏLİK GÖTÜRƏN', fromLabel: 'PLATFORMA',
  preamble: 'Mərkəz qeydə alır ki, {{username}} istifadəçi adlı şəxs {from} platformasında məzmun yerləşdirilməsinin fasiləsizliyi barədə öhdəlik götürmüşdür. Öhdəliyin icrası profilin açıq göstəriciləri əsasında izlənilir.',
  powers: 'Həftədə ən azı bir paylaşım yerləşdirilməlidir.\nUzunmüddətli fasilə barədə auditoriya əvvəlcədən məlumatlandırılır.\nSilinmiş paylaşım icra edilmiş sayılmır.\nÖhdəlik yalnız sahibin öz profilinə şamil edilir.',
  penalty: 'Fasilə otuz gündən artıq davam etdikdə kart müvəqqəti qüvvədən düşür və bərpası üçün üç paylaşım tələb olunur.',
  titleOptions: [
    'Kontent Fasiləsizliyi Öhdəliyinin Qəbul Edilməsi haqqında Kart',
    'Müntəzəm Paylaşım Öhdəliyinin Rəsmiləşdirilməsi haqqında Vəsiqə',
    'Profil Fəallığının Saxlanılması Öhdəliyi üzrə Şəhadətnamə',
    'Paylaşım Cədvəlinə Riayət Öhdəliyi haqqında Kimlik Kartı'
  ],
  powersOptions: [
    'Həftədə ən azı bir paylaşım yerləşdirilməlidir.',
    'Uzunmüddətli fasilə barədə auditoriya əvvəlcədən məlumatlandırılır.',
    'Silinmiş paylaşım icra edilmiş sayılmır.',
    'Öhdəlik yalnız sahibin öz profilinə şamil edilir.',
    'Arxivə keçirilmiş paylaşım hesabata daxil edilmir.',
    'Təkrar yerləşdirilən köhnə material yeni sayılmır.',
    'Öhdəliyin icrası aylıq olaraq yekunlaşdırılır.',
    'Məzmunun mövzusu öhdəliyin predmeti deyil.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Fasilə otuz gündən artıq davam etdikdə kart müvəqqəti qüvvədən düşür və bərpası üçün üç paylaşım tələb olunur.',
    'Öhdəlik ardıcıl iki ay pozulduqda uçot qeydi ləğv edilir.',
    'Bildirişsiz fasilə halında kart sahibi auditoriya qarşısında izahat verir.'
  ]
},
{
  id: 's-gece', cat: 's-kart', tone: 'zarafat', layout: 'vesiqe', palette: 'ink', cardStyle: 'tund',
  regPrefix: 'SOS',
  title: 'Gecə Saatlarında Paylaşım Rejiminə Buraxılış haqqında Vəsiqə', tag: 'Gecə rejimi',
  signOrg: 'Rəqəmsal Məzmun Qeydiyyatı üzrə Baş İdarə',
  toLabel: 'BURAXILIŞ SAHİBİ', fromLabel: 'PLATFORMA',
  preamble: 'İdarə {{username}} istifadəçi adlı şəxsə {from} platformasında gecə saatlarında məzmun yerləşdirmək üçün buraxılış verir. Buraxılış sahibin öz istəyi ilə verilmiş və heç bir yuxu rejimi ilə əlaqələndirilməmişdir.',
  powers: 'Gecə saatlarında paylaşım yerləşdirməyə icazə verilir.\nSəhər peşman olmaq buraxılışın qüvvəsinə təsir etmir.\nSilinmiş gecə paylaşımı geri qaytarılmır.\nBuraxılış yalnız göstərilən profilə şamil edilir.',
  penalty: 'Gecə yerləşdirilmiş paylaşım səhər üç dəfədən artıq silindikdə buraxılış otuz gün müddətinə dayandırılır.',
  titleOptions: [
    'Gecə Saatlarında Paylaşım Rejiminə Buraxılış haqqında Vəsiqə',
    'Gecə Məzmun Fəaliyyətinə İcazə Verilməsi haqqında Kimlik Kartı',
    'Gec Saatlarda Profil Fəallığının Rəsmiləşdirilməsi üzrə Vəsiqə',
    'Gecə Rejimində Yerləşdirmə Səlahiyyəti haqqında Şəhadətnamə'
  ],
  powersOptions: [
    'Gecə saatlarında paylaşım yerləşdirməyə icazə verilir.',
    'Səhər peşman olmaq buraxılışın qüvvəsinə təsir etmir.',
    'Silinmiş gecə paylaşımı geri qaytarılmır.',
    'Buraxılış yalnız göstərilən profilə şamil edilir.',
    'Gecə yazılmış şərhlər ayrıca qeydə alınmır.',
    'Yuxusuzluq üzrlü səbəb hesab edilmir.',
    'Buraxılış istənilən vaxt sahibin özü tərəfindən dayandırıla bilər.',
    'Səhər saatlarında əlavə icazə tələb olunmur.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Gecə yerləşdirilmiş paylaşım səhər üç dəfədən artıq silindikdə buraxılış otuz gün müddətinə dayandırılır.',
    'Buraxılışın şərtləri pozulduqda gecə rejimi qeydiyyatdan çıxarılır.',
    'Təkrar pozuntu halında vəsiqə yalnız növbəti ildə bərpa olunur.'
  ]
},
{
  id: 's-reels', cat: 's-kart', tone: 'zarafat', layout: 'vesiqe', palette: 'rose', cardStyle: 'sade',
  regPrefix: 'SOS', socialKind: 'instagram',
  title: 'Qısa Video Marafonu İştirakçısının Qeydiyyatı haqqında Kart', tag: 'Instagram',
  signOrg: 'Onlayn Auditoriya Məsələləri üzrə Komissiya',
  toLabel: 'İŞTİRAKÇI', fromLabel: 'PLATFORMA',
  preamble: 'Komissiya təsdiq edir ki, {{username}} istifadəçi adlı şəxs {from} platformasında qısa video marafonunun iştirakçısı kimi qeydiyyata alınmışdır. İştirakçının profilində hazırda {{posts}} paylaşım yerləşdirilmişdir.',
  powers: 'İştirakçı marafon müddətində qısa video yerləşdirmək hüququna malikdir.\nEyni videonun təkrar yerləşdirilməsi iştirak sayılmır.\nMusiqi seçimi iştirakçının şəxsi məsuliyyətindədir.\nMarafondan çıxmaq barədə qərar istənilən vaxt qəbul edilə bilər.',
  penalty: 'Ardıcıl yeddi gün ərzində heç bir video yerləşdirilmədikdə iştirakçı marafonun qeydiyyatından çıxarılır.',
  titleOptions: [
    'Qısa Video Marafonu İştirakçısının Qeydiyyatı haqqında Kart',
    'Qısa Video Fəaliyyətinə Buraxılış Verilməsi haqqında Vəsiqə',
    'Video Marafonunda İştirakın Rəsmi Təsdiqi üzrə Şəhadətnamə',
    'Qısa Formatlı Məzmun İştirakçısının Kimlik Kartı'
  ],
  powersOptions: [
    'İştirakçı marafon müddətində qısa video yerləşdirmək hüququna malikdir.',
    'Eyni videonun təkrar yerləşdirilməsi iştirak sayılmır.',
    'Musiqi seçimi iştirakçının şəxsi məsuliyyətindədir.',
    'Marafondan çıxmaq barədə qərar istənilən vaxt qəbul edilə bilər.',
    'Videonun uzunluğu iştirakın qiymətləndirilməsinə təsir etmir.',
    'Baxış sayı iştirak şərti kimi tələb olunmur.',
    'İştirakçının profili açıq olmalıdır.',
    'Marafonun nəticələri ayrıca elan edilmir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Ardıcıl yeddi gün ərzində heç bir video yerləşdirilmədikdə iştirakçı marafonun qeydiyyatından çıxarılır.',
    'İştirak şərtləri pozulduqda kart qüvvədən düşür və bərpa edilmir.',
    'Profil bağlandıqda iştirakçının qeydiyyatı dayandırılır.'
  ]
},
{
  id: 's-trend', cat: 's-kart', tone: 'zarafat', layout: 'vesiqe', palette: 'burgundy', cardStyle: 'tund',
  regPrefix: 'SOS', socialKind: 'tiktok',
  title: 'Trend Məzmun Fəaliyyətinə Buraxılış Verilməsi haqqında Vəsiqə', tag: 'TikTok',
  signOrg: 'Sosial Şəbəkə Fəaliyyətinin Uçotu üzrə Mərkəz',
  toLabel: 'BURAXILIŞ SAHİBİ', fromLabel: 'PLATFORMA',
  preamble: 'Mərkəz {{username}} istifadəçi adlı şəxsə {from} platformasında trend məzmun hazırlamaq üçün buraxılış verir. Buraxılış sahibin öz təşəbbüsü ilə rəsmiləşdirilmiş və auditoriyanın gözləntiləri nəzərə alınmışdır.',
  powers: 'Sahibi trend səsləri və formatları istifadə etmək hüququna malikdir.\nTrendin köhnəlməsi buraxılışın qüvvəsinə təsir etmir.\nRəqs elementinin icrası məcburi deyil.\nBuraxılış yalnız göstərilən istifadəçi adına aiddir.',
  penalty: 'Trend məzmunun başqasının profilindən köçürüldüyü aşkarlandıqda buraxılış dərhal qüvvədən düşür.',
  titleOptions: [
    'Trend Məzmun Fəaliyyətinə Buraxılış Verilməsi haqqında Vəsiqə',
    'Trend Formatlarından İstifadə Səlahiyyəti haqqında Kimlik Kartı',
    'Aktual Məzmun Hazırlanmasına İcazə Verilməsi üzrə Şəhadətnamə',
    'Trend İştirakının Rəsmi Qeydiyyatı haqqında Vəsiqə'
  ],
  powersOptions: [
    'Sahibi trend səsləri və formatları istifadə etmək hüququna malikdir.',
    'Trendin köhnəlməsi buraxılışın qüvvəsinə təsir etmir.',
    'Rəqs elementinin icrası məcburi deyil.',
    'Buraxılış yalnız göstərilən istifadəçi adına aiddir.',
    'Trendin mənşəyi barədə mübahisəyə baxılmır.',
    'Baxış sayının azlığı buraxılışın ləğvi üçün əsas deyil.',
    'Eyni trendə təkrar qayıtmaq məhdudlaşdırılmır.',
    'Məzmunun müşayiət mətni sahibin öz seçimidir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Trend məzmunun başqasının profilindən köçürüldüyü aşkarlandıqda buraxılış dərhal qüvvədən düşür.',
    'Buraxılışın şərtləri pozulduqda vəsiqə altmış gün müddətinə dayandırılır.',
    'Profil adı dəyişdirildikdə vəsiqə yenidən rəsmiləşdirilməlidir.'
  ]
}

];

/* ------------------------------------------------------------------
   Link parsinqi — TAM OFLAYN. Serverdə güzgüsü:
   backend-php/app/Support/Sosial/ProfilUrl.php

   Qəbul edilən formalar:
     https://www.tiktok.com/@ad            @ad (tiktok)
     tiktok.com/@ad?is_from=…              ad  (platforma göstərilibsə)
     https://instagram.com/ad/
   Host ağ siyahıdadır — `Devet.mapUrl()` ilə eyni məntiq: naməlum host
   qəbul edilmir ki, sahə istənilən linki daşıya bilməsin.
   ------------------------------------------------------------------ */
window.SOSIAL_PARSE = (function () {
  'use strict';

  var HOSTS = {};
  window.SOSIAL_KINDS.forEach(function (k) {
    k.hosts.forEach(function (h) { HOSTS[h] = k.k; });
  });

  /* Platformaların özlərinin icazə verdiyi simvollar: hərf, rəqəm, alt xətt,
     nöqtə. Nöqtə ilə başlaya/bitə bilməz. */
  function temizAd(s) {
    s = String(s == null ? '' : s).trim().replace(/^@+/, '');
    s = s.replace(/[^A-Za-z0-9._]/g, '').replace(/^\.+|\.+$/g, '');
    return s.slice(0, 30);
  }

  function parse(text, fallbackKind) {
    var t = String(text == null ? '' : text).trim();
    if (!t) return null;

    /* Sadəcə «@ad» yazılıbsa platforma seçimdən götürülür. Nöqtəsiz və
       kəsiksiz mətn də ad sayılır — «instagram.com/ad» aşağıdakı budaqda
       tutulur, çünki onda nöqtə var. */
    if (t.indexOf('/') < 0 && t.indexOf('.') < 0) {
      if (/\s/.test(t)) return null;      /* boşluqlu mətn istifadəçi adı deyil */
      var bare = temizAd(t);
      return bare && fallbackKind ? { platform: fallbackKind, username: bare } : null;
    }

    var m = t.match(/^(?:https?:\/\/)?([^\/?#\s]+)(?:\/([^?#\s]*))?/i);
    if (!m) return null;
    var host = m[1].toLowerCase().replace(/:\d+$/, '');
    if (!Object.prototype.hasOwnProperty.call(HOSTS, host)) return null;

    var seg = String(m[2] || '').split('/').filter(function (x) { return x !== ''; });
    /* /@ad/video/123 → @ad ; /ad/reel/xxx → ad */
    var first = seg.length ? seg[0] : '';
    if (first === 'p' || first === 'reel' || first === 'reels' || first === 'explore') first = '';
    var ad = temizAd(first);
    if (!ad) return null;
    return { platform: HOSTS[host], username: ad };
  }

  return { parse: parse, hosts: HOSTS, clean: temizAd };
})();

/* `{{username}}` · `{{followers}}` · `{{posts}}` · `{{platform}}` üçün dəyərlər.
   Server güzgüsü: DocumentService::sosialVals(). İkisi ayrılsa, endirilmiş PNG
   ilə reyestrdəki nüsxə fərqlənər — təhlükəsizlik mövqeyinin qadağan etdiyi
   yeganə şey. */
window.SOSIAL_VALS = function (s, fmt) {
  s = s || {};
  return {
    username: s.username ? '@' + s.username : '—',
    platform: (window.SOSIAL_KINDS.filter(function (k) { return k.k === s.platform; })[0] || {}).name || '—',
    name: s.name || '—',
    followers: fmt(s.followers),
    following: fmt(s.following),
    posts: fmt(s.posts)
  };
};
