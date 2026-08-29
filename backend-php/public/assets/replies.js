/* ==================================================================
   Zarafat Notariat Palatası — CAVAB SƏNƏDLƏRİ kataloqu
   71 şablon · 6 kateqoriya · 6 niyyət

   DİQQƏT: bu fayl `window.CATEGORIES` / `window.TEMPLATES` massivlərinə
   HEÇ NƏ ƏLAVƏ ETMİR. Cavab şablonları ayrıca qlobal dəyişənlərdə yaşayır,
   çünki `tools/check-templates.js` hərfi olaraq «18 kateqoriya · 216 şablon»,
   «hər kateqoriyada düz 12 şablon» və «hər kateqoriya 12 dizaynın hamısını
   əhatə edir» invariantlarını tələb edir — 12 layout × 12 şablon artıq
   bijeksiyadır və boş yer yoxdur (CLAUDE.md, «bijection trap»).

   Bazada isə bunlar adi `templates` sətirləridir: `templates.reply_kind`
   doludur və kateqoriyaları `categories.is_reply = true` daşıyır.
   `CatalogService::payload()` yükü dörd açara bölür, ona görə cavablar
   ana səhifənin kateqoriya zolağına düşmür.

   Struktur `templates.js` ilə eynidir + iki açar:
     replyKind — hansı niyyət (redd · etiraz · tekrar · legv · qebul · xatire)
     replyCats — hansı orijinal kateqoriyalara cavab verir; yoxdursa universal

   Yoxlama: node tools/check-replies.js
   ================================================================== */

/* Baxış səhifəsindəki kartlar bu siyahıdan qurulur.
   Server tərəfi güzgüsü: backend-php/app/Support/ReplyKinds.php */
window.REPLY_KINDS = [
  { k: 'redd',   tone: 'zarafat', icon: '❌', name: 'Rədd et',
    blurb: 'Bu sənəddə yazılanlarla razı deyiləm.' },
  { k: 'etiraz', tone: 'zarafat', icon: '⚖️', name: 'Etiraz et',
    blurb: 'Sənədə rəsmi etiraz bildirirəm.' },
  { k: 'tekrar', tone: 'zarafat', icon: '🔄', name: 'Yenidən baxılsın',
    blurb: 'Məsələyə yenidən baxılmasını tələb edirəm.' },
  { k: 'legv',   tone: 'zarafat', icon: '🚫', name: 'Ləğv et',
    blurb: 'Sənədin qüvvədən düşməsini tələb edirəm.' },
  { k: 'qebul',  tone: 'zarafat', icon: '✅', name: 'Qüvvədə saxla',
    blurb: 'Sənəd qüvvədə qalsın — təsdiq edirəm.' },
  { k: 'xatire', tone: 'xatire',  icon: '💌', name: 'Cavab yaz',
    blurb: 'Bu xatirəyə öz sənədimlə cavab verirəm.' }
];

window.REPLY_CATEGORIES = [
  { id: 'c-redd',   tone: 'zarafat', isReply: true, name: 'Cavab — Rədd',            icon: '✖',
    blurb: 'Bəhanənin, iddianın və ya sənədin rədd edilməsi haqqında qərarlar.' },
  { id: 'c-etiraz', tone: 'zarafat', isReply: true, name: 'Cavab — Etiraz',          icon: '⚖',
    blurb: 'Verilmiş sənədə rəsmi etiraz ərizələri.' },
  { id: 'c-tekrar', tone: 'zarafat', isReply: true, name: 'Cavab — Təkrar baxış',    icon: '↻',
    blurb: 'Məsələyə yenidən baxılması və təkrar araşdırma qərarları.' },
  { id: 'c-legv',   tone: 'zarafat', isReply: true, name: 'Cavab — Ləğv',            icon: '⌫',
    blurb: 'Sənədin qüvvədən düşməsi haqqında bildirişlər.' },
  { id: 'c-qebul',  tone: 'zarafat', isReply: true, name: 'Cavab — Qüvvədə saxlama', icon: '✓',
    blurb: 'Sənədin qüvvədə saxlanılması və təsdiqi haqqında qərarlar.' },
  { id: 'c-xatire', tone: 'xatire',  isReply: true, name: 'Xatirə cavabı',           icon: '❤',
    blurb: 'Xatirə sənədinə səmimi cavab: təşəkkür, qəbul və qarşılıqlı etiraf.' }
];

window.REPLIES = [

/* ==================== ❌ RƏDD ====================
   layout: qerar · palette: burgundy · prefiks: RDD */
{
  id: 'r-redd-couples', cat: 'c-redd', tone: 'zarafat', layout: 'qerar', palette: 'burgundy',
  replyKind: 'redd', replyCats: ['couples'], regPrefix: 'RDD',
  title: 'Gecikmənin Səbəbi kimi Göstərilmiş Halın Rədd Edilməsi haqqında Qərar', tag: 'Ev diplomatiyası',
  signOrg: 'Cütlüklərarası Mübahisələrin Həlli üzrə Ali Şura',
  toLabel: 'BƏHANƏNİ İRƏLİ SÜRƏN', fromLabel: 'QƏRARI QƏBUL EDƏN',
  preamble: 'Şura {to} adlı şəxsin təqdim etdiyi sənədə baxaraq müəyyən etmişdir ki, gecikmənin səbəbi kimi göstərilən hal heç bir mənbə ilə təsdiqlənmir və hadisələrin ardıcıllığı əvvəlki izahatlarla ziddiyyət təşkil edir. {from} tərəfindən verilmiş etiraz əsaslı hesab olunur.',
  powers: 'Gecikmənin səbəbi kimi göstərilən hal əsassız hesab edilir.\nEyni izahatın otuz gün ərzində təkrarlanmasına yol verilmir.\nGecikmə faktı qüvvədə qalır və qeydiyyata alınır.\nQərar imzalandığı andan qüvvəyə minir.',
  penalty: 'Qərara əməl edilmədikdə növbəti həftəsonunun proqramı tam olaraq digər tərəf tərəfindən müəyyən edilir və seçim mübahisə predmetinə çevrilmir.',
  titleOptions: [
    'Gecikmənin Səbəbi kimi Göstərilmiş Halın Rədd Edilməsi haqqında Qərar',
    'Evə Gec Qayıtma Səbəbinin Əsassız Sayılması haqqında Qərar',
    'Təqdim Edilmiş İzahatın Qəbul Edilməməsi haqqında Yekun Qətnamə',
    'Həftəsonu Səlahiyyətinin Pozulması Faktının Təsbiti haqqında Qərar'
  ],
  powersOptions: [
    'Gecikmənin səbəbi kimi göstərilən hal əsassız hesab edilir.',
    'Eyni izahatın otuz gün ərzində təkrarlanmasına yol verilmir.',
    'Gecikmə faktı qüvvədə qalır və qeydiyyata alınır.',
    'Qərar imzalandığı andan qüvvəyə minir.',
    'Telefonun şarj səviyyəsi arqumenti nəzərə alınmır.',
    'Yol vəziyyəti barədə məlumat sənədlə təsdiqlənməlidir.',
    'Cavabsız zənglərin sayı ayrıca qeydə alınır.',
    'Sonradan verilən izahat araşdırmaya daxil edilmir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Qərara əməl edilmədikdə növbəti həftəsonunun proqramı tam olaraq digər tərəf tərəfindən müəyyən edilir və seçim mübahisə predmetinə çevrilmir.',
    'Etiraz qeydə alınır, lakin qərarın qüvvəsinə təsir göstərmir.',
    'Qərar növbəti mübahisəyə qədər dəyişdirilmədən qüvvədə saxlanılır.'
  ]
},
{
  id: 'r-redd-friends', cat: 'c-redd', tone: 'zarafat', layout: 'qerar', palette: 'burgundy',
  replyKind: 'redd', replyCats: ['friends'], regPrefix: 'RDD',
  title: 'Borcun Qaytarılmaması üçün Göstərilmiş Səbəbin Rədd Edilməsi haqqında Qərar', tag: 'Borc',
  signOrg: 'Dostlararası Mübahisələrin Həlli üzrə Ali Məclis',
  toLabel: 'BORCLU TƏRƏF', fromLabel: 'TƏLƏB EDƏN TƏRƏF',
  preamble: 'Məclis {to} adlı şəxsin müraciətinə baxaraq müəyyən etmişdir ki, borcun qaytarılmaması üçün göstərilən səbəb əvvəlki üç müraciətdə də eyni formada təqdim edilmişdir. {from} tərəfindən bildirilən etiraz əsaslı hesab olunur.',
  powers: 'Göstərilən səbəb əsassız hesab edilir və qəbul olunmur.\nBorcun məbləği və tarixi dəyişdirilmədən qüvvədə qalır.\nYeni möhlət müraciətinə otuz gün ərzində baxılmır.\nÖdəniş cədvəli hər iki tərəf tərəfindən imzalanır.',
  penalty: 'Ödəniş növbəti otuz gün ərzində həyata keçirilmədikdə borc məsələsi ümumi dost qrupunun müzakirəsinə çıxarılır.',
  titleOptions: [
    'Borcun Qaytarılmaması üçün Göstərilmiş Səbəbin Rədd Edilməsi haqqında Qərar',
    'Ödəniş Möhlətinin Uzadılması Müraciətinin Rədd Edilməsi Qərarı',
    '«Maaşdan sonra verərəm» İzahatının Qəbul Edilməməsi haqqında Qərar',
    'Borc Öhdəliyinin Qüvvədə Saxlanılması haqqında Yekun Qətnamə'
  ],
  powersOptions: [
    'Göstərilən səbəb əsassız hesab edilir və qəbul olunmur.',
    'Borcun məbləği və tarixi dəyişdirilmədən qüvvədə qalır.',
    'Yeni möhlət müraciətinə otuz gün ərzində baxılmır.',
    'Ödəniş cədvəli hər iki tərəf tərəfindən imzalanır.',
    'Hissə-hissə ödəniş variantı təklif edilir.',
    'Qonaqlıq ödənişi borcun bir hissəsi kimi hesablanmır.',
    'Xatırlatma qaydası əvvəlki kimi saxlanılır.',
    'Yeni borc müraciətinə baxılması dayandırılır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Ödəniş növbəti otuz gün ərzində həyata keçirilmədikdə borc məsələsi ümumi dost qrupunun müzakirəsinə çıxarılır.',
    'Etiraz qəbul edilir, lakin ödəniş öhdəliyini dayandırmır.',
    'Qərar borc tam qaytarılanadək qüvvədə qalır.'
  ]
},
{
  id: 'r-redd-work', cat: 'c-redd', tone: 'zarafat', layout: 'qerar', palette: 'burgundy',
  replyKind: 'redd', replyCats: ['work'], regPrefix: 'RDD',
  title: 'Tapşırığın İcra Edilməməsi üçün Göstərilmiş Səbəbin Rədd Edilməsi Qərarı', tag: 'Ofis',
  signOrg: 'Ofisdaxili Münasibətlərin Tənzimlənməsi üzrə Komitə',
  toLabel: 'İZAHAT VERƏN', fromLabel: 'QƏRARI QƏBUL EDƏN',
  preamble: 'Komitə {to} adlı şəxsin müraciətinə baxaraq müəyyən etmişdir ki, tapşırığın icra edilməməsi üçün göstərilən səbəb əvvəlki uzadılmalarla eyni məzmundadır və yeni hal ehtiva etmir. {from} tərəfindən bildirilən mövqe əsaslı hesab olunur.',
  powers: 'Göstərilən səbəb icra müddətinə təsir göstərmir.\nSon tarix dəyişdirilmədən qüvvədə saxlanılır.\nAralıq nəticə iki iş günü ərzində təqdim edilir.\nYeni uzadılma müraciətinə baxılmır.',
  penalty: 'Aralıq nəticə də təqdim edilmədikdə tapşırıq başqa icraçıya verilir və müddət uzatma müraciətlərinə növbəti rübdə baxılmır.',
  titleOptions: [
    'Tapşırığın İcra Edilməməsi üçün Göstərilmiş Səbəbin Rədd Edilməsi Qərarı',
    'Müddət Uzatma Müraciətinin Təmin Edilməməsi haqqında Qərar',
    '«Sabah göndərərəm» İzahatının Qəbul Edilməməsi haqqında Qərar',
    'İcra Müddətinin Dəyişdirilməməsi haqqında Yekun Qətnamə'
  ],
  powersOptions: [
    'Göstərilən səbəb icra müddətinə təsir göstərmir.',
    'Son tarix dəyişdirilmədən qüvvədə saxlanılır.',
    'Aralıq nəticə iki iş günü ərzində təqdim edilir.',
    'Yeni uzadılma müraciətinə baxılmır.',
    'Əlavə resurs tələbi ayrıca qiymətləndirilir.',
    'Tapşırıq başqa icraçıya verilə bilər.',
    'Gündəlik hesabat rejimi tətbiq olunur.',
    'Məsələ toplantının gündəliyinə salınır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Aralıq nəticə də təqdim edilmədikdə tapşırıq başqa icraçıya verilir və müddət uzatma müraciətlərinə növbəti rübdə baxılmır.',
    'Etiraz protokola daxil edilir, lakin müddəti dayandırmır.',
    'Qərar tapşırıq təhvil verilənədək qüvvədə qalır.'
  ]
},
{
  id: 'r-redd-family', cat: 'c-redd', tone: 'zarafat', layout: 'qerar', palette: 'burgundy',
  replyKind: 'redd', replyCats: ['family'], regPrefix: 'RDD',
  title: 'Ev Tapşırığının Yerinə Yetirilməməsi Səbəbinin Rədd Edilməsi Qərarı', tag: 'Ailə',
  signOrg: 'Evdaxili Münasibətlərin Tənzimlənməsi üzrə Ali Şura',
  toLabel: 'BƏHANƏ GƏTİRƏN', fromLabel: 'QƏRARI VERƏN',
  preamble: 'Şura {to} adlı şəxsin müraciətinə baxmış və müəyyən etmişdir ki, ev tapşırığının yerinə yetirilməməsi üçün göstərilən səbəb yoxlanış zamanı təsdiqlənməmişdir. {from} tərəfindən təqdim edilmiş məlumat əsaslı hesab olunur.',
  powers: 'Göstərilən səbəb əsassız hesab edilir.\nTapşırıq həmin gün ərzində tamamlanır.\nEkran vaxtı tapşırıq bitənədək başlamır.\nNövbəti yoxlama xəbərdarlıq edilmədən aparılır.',
  penalty: 'Tapşırıq həmin gün tamamlanmadıqda ekran vaxtı növbəti iki gün üçün dayandırılır və həftəsonu güzəşti ləğv edilir.',
  titleOptions: [
    'Ev Tapşırığının Yerinə Yetirilməməsi Səbəbinin Rədd Edilməsi Qərarı',
    'Ekran Vaxtının Artırılması Müraciətinin Rədd Edilməsi Qərarı',
    'Dərs Hazırlığından Yayınma Səbəbinin Əsassız Sayılması Qərarı',
    'Ev Qaydalarına Edilən Etirazın Təmin Edilməməsi Qərarı'
  ],
  powersOptions: [
    'Göstərilən səbəb əsassız hesab edilir.',
    'Tapşırıq həmin gün ərzində tamamlanır.',
    'Ekran vaxtı tapşırıq bitənədək başlamır.',
    'Növbəti yoxlama xəbərdarlıq edilmədən aparılır.',
    'Dərs hazırlığı cədvəli dəyişdirilmir.',
    'Yatma saatı əvvəlki qaydada qalır.',
    'Cib xərcliyinin verilmə tarixi saxlanılır.',
    'Ailə şurasında məsələ yenidən müzakirə edilə bilər.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Tapşırıq həmin gün tamamlanmadıqda ekran vaxtı növbəti iki gün üçün dayandırılır və həftəsonu güzəşti ləğv edilir.',
    'Etiraz qeydə alınır, lakin qərarın icrasını dayandırmır.',
    'Qərar tapşırıq tamamlananadək qüvvədə qalır.'
  ]
},
{
  id: 'r-redd-relatives', cat: 'c-redd', tone: 'zarafat', layout: 'qerar', palette: 'burgundy',
  replyKind: 'redd', replyCats: ['relatives'], regPrefix: 'RDD',
  title: 'Qohum Ziyarətindən İmtina Səbəbinin Rədd Edilməsi haqqında Qərar', tag: 'Qohumlar',
  signOrg: 'Qohumluq Münasibətləri üzrə Ali Nəzarət Şurası',
  toLabel: 'ÜZRXAHLIQ EDƏN', fromLabel: 'ETİRAZ EDƏN TƏRƏF',
  preamble: 'Nəzarət Şurası {to} adlı şəxsin müraciətinə baxaraq müəyyən etmişdir ki, ziyarətdən imtina üçün göstərilən səbəb eyni bayram dövründə ikinci dəfə irəli sürülür. {from} tərəfindən bildirilən etiraz əsaslı hesab olunur.',
  powers: 'İmtina səbəbi əsassız hesab edilir.\nZiyarət növbəsi dəyişdirilmədən qüvvədə qalır.\nZiyarətin tarixi bir həftə əvvəl təsdiqlənir.\nMüddət razılaşdırılmış həddə saxlanılır.',
  penalty: 'Ziyarət yenidən təxirə salındıqda növbəti bayramda ilk ziyarətin ünvanı tam olaraq digər tərəf tərəfindən müəyyən edilir.',
  titleOptions: [
    'Qohum Ziyarətindən İmtina Səbəbinin Rədd Edilməsi haqqında Qərar',
    'Ziyarətin Təxirə Salınması Müraciətinin Rədd Edilməsi Qərarı',
    'Bayram Ziyarəti Növbəsinin Dəyişdirilməməsi haqqında Qərar',
    'Ziyarətdən Yayınma Səbəbinin Əsassız Sayılması haqqında Qərar'
  ],
  powersOptions: [
    'İmtina səbəbi əsassız hesab edilir.',
    'Ziyarət növbəsi dəyişdirilmədən qüvvədə qalır.',
    'Ziyarətin tarixi bir həftə əvvəl təsdiqlənir.',
    'Müddət razılaşdırılmış həddə saxlanılır.',
    'Hər iki ailəyə ziyarət bərabər sayda planlaşdırılır.',
    'Gecikmə barədə əvvəlcədən xəbər verilir.',
    'Hədiyyə öhdəliyi ayrıca qalır.',
    'Uzaq qohumlara ziyarət ayrıca müzakirə edilir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Ziyarət yenidən təxirə salındıqda növbəti bayramda ilk ziyarətin ünvanı tam olaraq digər tərəf tərəfindən müəyyən edilir.',
    'Etiraz qəbul edilir, lakin növbəliliyə təsir göstərmir.',
    'Qərar növbəti bayram dövrünə qədər qüvvədədir.'
  ]
},
{
  id: 'r-redd-student', cat: 'c-redd', tone: 'zarafat', layout: 'qerar', palette: 'burgundy',
  replyKind: 'redd', replyCats: ['student'], regPrefix: 'RDD',
  title: 'İmtahana Hazırlaşmamaq üçün Göstərilmiş Səbəbin Rədd Edilməsi Qərarı', tag: 'Tələbə',
  signOrg: 'Tələbə Bəhanələrinin Araşdırılması üzrə Komissiya',
  toLabel: 'BƏHANƏ TƏQDİM EDƏN', fromLabel: 'QƏRARI VERƏN',
  preamble: 'Komissiya {to} adlı şəxsin müraciətinə baxaraq müəyyən etmişdir ki, göstərilən səbəb davamiyyət jurnalı ilə uyğun gəlmir və sənədlə təsdiqlənməmişdir. {from} tərəfindən bildirilən mövqe əsaslı hesab olunur.',
  powers: 'Göstərilən səbəb qəbul edilmir.\nTəhvil müddəti dəyişdirilmədən qüvvədə qalır.\nBuraxılmış saatlar jurnalda saxlanılır.\nYeni möhlət müraciətinə baxılmır.',
  penalty: 'Müddət pozulduqda iş növbəti semestrə keçirilir və uzatma müraciətlərinə həmin semestr ərzində baxılmır.',
  titleOptions: [
    'İmtahana Hazırlaşmamaq üçün Göstərilmiş Səbəbin Rədd Edilməsi Qərarı',
    'Təhvil Müddətinin Uzadılması Müraciətinin Rədd Edilməsi Qərarı',
    'Dərsə Gəlməmək Səbəbinin Əsassız Sayılması haqqında Qərar',
    'Konspekt Borcuna dair İzahatın Qəbul Edilməməsi haqqında Qərar'
  ],
  powersOptions: [
    'Göstərilən səbəb qəbul edilmir.',
    'Təhvil müddəti dəyişdirilmədən qüvvədə qalır.',
    'Buraxılmış saatlar jurnalda saxlanılır.',
    'Yeni möhlət müraciətinə baxılmır.',
    'Konspekt borcu semestrin sonuna qədər bağlanır.',
    'Konsultasiya saatlarından istifadə tövsiyə olunur.',
    'Təkrar imtahan imkanı ayrıca qiymətləndirilir.',
    'Qrup nümayəndəsi məlumatlandırılır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Müddət pozulduqda iş növbəti semestrə keçirilir və uzatma müraciətlərinə həmin semestr ərzində baxılmır.',
    'Etiraz qeydə alınır, lakin müddəti dayandırmır.',
    'Qərar borc bağlananadək qüvvədə qalır.'
  ]
},
{
  id: 'r-redd-neighbors', cat: 'c-redd', tone: 'zarafat', layout: 'qerar', palette: 'burgundy',
  replyKind: 'redd', replyCats: ['neighbors'], regPrefix: 'RDD',
  title: 'Səs-Küy Şikayətinə Verilmiş İzahatın Rədd Edilməsi haqqında Qərar', tag: 'Qonşuluq',
  signOrg: 'Həyətdaxili Nizamın Qorunması üzrə Baş İdarə',
  toLabel: 'İZAHAT VERƏN QONŞU', fromLabel: 'MÜRACİƏT EDƏN QONŞU',
  preamble: 'Baş İdarə {to} adlı şəxsin izahatına baxaraq müəyyən etmişdir ki, göstərilən səbəb digər sakinlərin müraciətləri ilə uyğun gəlmir və hadisənin vaxtı ilə üst-üstə düşmür. {from} tərəfindən verilmiş şikayət əsaslı hesab olunur.',
  powers: 'Təqdim edilmiş izahat qəbul edilmir.\nGecə səs rejimi dəyişdirilmədən qüvvədə qalır.\nTəmir işləri yalnız gündüz saatlarında aparılır.\nNövbəti pozuntu ümumi yığıncağa çıxarılır.',
  penalty: 'Rejim yenidən pozulduqda məsələ bina sakinlərinin ümumi yığıncağının gündəliyinə salınır və qərar səsvermə ilə qəbul edilir.',
  titleOptions: [
    'Səs-Küy Şikayətinə Verilmiş İzahatın Rədd Edilməsi haqqında Qərar',
    'Gecə Rejiminin Pozulması Səbəbinin Əsassız Sayılması Qərarı',
    'Təmir İşlərinin Davam Etdirilməsi Müraciətinin Rədd Edilməsi Qərarı',
    'Park Yeri Mübahisəsi üzrə Etirazın Təmin Edilməməsi Qərarı'
  ],
  powersOptions: [
    'Təqdim edilmiş izahat qəbul edilmir.',
    'Gecə səs rejimi dəyişdirilmədən qüvvədə qalır.',
    'Təmir işləri yalnız gündüz saatlarında aparılır.',
    'Növbəti pozuntu ümumi yığıncağa çıxarılır.',
    'Şikayətlərin sayı qeydə alınır.',
    'Digər sakinlərin ifadələri protokola əlavə edilir.',
    'Xəbərdarlıq elan lövhəsində yerləşdirilir.',
    'Bayram günləri istisna kimi saxlanılır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Rejim yenidən pozulduqda məsələ bina sakinlərinin ümumi yığıncağının gündəliyinə salınır və qərar səsvermə ilə qəbul edilir.',
    'Etiraz qəbul edilir, lakin rejimi dəyişdirmir.',
    'Qərar bütün mənzillərə eyni qaydada şamil olunur.'
  ]
},
{
  id: 'r-redd-holiday', cat: 'c-redd', tone: 'zarafat', layout: 'qerar', palette: 'burgundy',
  replyKind: 'redd', replyCats: ['holiday'], regPrefix: 'RDD',
  title: 'Mərasimdə Rəqsdən İmtina Səbəbinin Rədd Edilməsi haqqında Qərar', tag: 'Toy',
  signOrg: 'Toy Davranışlarına Nəzarət üzrə Baş İdarə',
  toLabel: 'İMTİNA EDƏN ŞƏXS', fromLabel: 'TƏLƏB EDƏN TƏRƏF',
  preamble: 'Baş İdarə {to} adlı şəxsin müraciətinə baxaraq müəyyən etmişdir ki, mərasimdə rəqsdən imtina üçün göstərilən səbəb həmin axşam çəkilmiş görüntülərlə uyğun gəlmir. {from} tərəfindən bildirilən etiraz əsaslı hesab olunur.',
  powers: 'Göstərilən səbəb əsassız hesab edilir.\nAilə rəqsində iştirak öhdəliyi qüvvədə qalır.\nMasa nizamı dəyişdirilmir.\nHədiyyə öhdəliyi ayrıca saxlanılır.',
  penalty: 'Qərara əməl edilmədikdə növbəti mərasimdə masa və yer seçimi hüququ tam olaraq digər tərəfə keçir.',
  titleOptions: [
    'Mərasimdə Rəqsdən İmtina Səbəbinin Rədd Edilməsi haqqında Qərar',
    'Toy Mərasiminə Gəlməmək Səbəbinin Əsassız Sayılması Qərarı',
    'Hədiyyə Öhdəliyindən Azad Edilmə Müraciətinin Rədd Edilməsi Qərarı',
    'Masa Dəyişikliyi Tələbinin Təmin Edilməməsi haqqında Qərar'
  ],
  powersOptions: [
    'Göstərilən səbəb əsassız hesab edilir.',
    'Ailə rəqsində iştirak öhdəliyi qüvvədə qalır.',
    'Masa nizamı dəyişdirilmir.',
    'Hədiyyə öhdəliyi ayrıca saxlanılır.',
    'Mərasimə gəlmə vaxtı əvvəlcədən təsdiqlənir.',
    'Foto çəkilişində iştirak tələb olunur.',
    'Erkən ayrılma barədə xəbər verilir.',
    'Qonaq siyahısı dəyişdirilmir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Qərara əməl edilmədikdə növbəti mərasimdə masa və yer seçimi hüququ tam olaraq digər tərəfə keçir.',
    'Etiraz qeydə alınır, lakin mərasim proqramına təsir etmir.',
    'Qərar yalnız bir mərasimə şamil edilir.'
  ]
},
{
  id: 'r-redd-travel', cat: 'c-redd', tone: 'zarafat', layout: 'qerar', palette: 'burgundy',
  replyKind: 'redd', replyCats: ['travel'], regPrefix: 'RDD',
  title: 'Marşrutun Dəyişdirilməsi Tələbinin Rədd Edilməsi haqqında Qərar', tag: 'Səfər',
  signOrg: 'Səfər və Marşrut Mübahisələri üzrə Ali Komissiya',
  toLabel: 'YOL GÖSTƏRƏN', fromLabel: 'ETİRAZ EDƏN SƏRNİŞİN',
  preamble: 'İş üzrə toplanmış məlumatlara əsasən müəyyən edilmişdir ki, {to} adlı şəxsin marşrutun dəyişdirilməsi barədə tələbi real vaxt qazancı yaratmır və yol vəziyyəti ilə təsdiqlənmir. {from} tərəfindən bildirilən mövqe əsaslı hesab olunur.',
  powers: 'Marşrut razılaşdırılmış formada saxlanılır.\nDayanacaqların sayı və yeri dəyişdirilmir.\nYola çıxma vaxtı qüvvədə qalır.\nBaqaj çəkisi həddi artırılmır.',
  penalty: 'Marşrutdan icazəsiz kənara çıxıldıqda əlavə yol xərcləri tam olaraq həmin qərarı verən tərəfin üzərinə düşür.',
  titleOptions: [
    'Marşrutun Dəyişdirilməsi Tələbinin Rədd Edilməsi haqqında Qərar',
    'Səfərin Təxirə Salınması Müraciətinin Rədd Edilməsi Qərarı',
    'Baqaj Çəkisinin Artırılması Tələbinin Təmin Edilməməsi Qərarı',
    'Sürücülük Növbəsindən İmtina Səbəbinin Rədd Edilməsi Qərarı'
  ],
  powersOptions: [
    'Marşrut razılaşdırılmış formada saxlanılır.',
    'Dayanacaqların sayı və yeri dəyişdirilmir.',
    'Yola çıxma vaxtı qüvvədə qalır.',
    'Baqaj çəkisi həddi artırılmır.',
    'Sürücülük növbəsi cədvəl üzrə davam edir.',
    'Yanacaq xərcinin bölgüsü dəyişdirilmir.',
    'Yemək fasiləsi planda saxlanılır.',
    'Gəlmə vaxtı barədə məlumat verilir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Marşrutdan icazəsiz kənara çıxıldıqda əlavə yol xərcləri tam olaraq həmin qərarı verən tərəfin üzərinə düşür.',
    'Etiraz qəbul edilir, lakin marşruta təsir göstərmir.',
    'Qərar yalnız cari səfərə şamil edilir.'
  ]
},
{
  id: 'r-redd-pets', cat: 'c-redd', tone: 'zarafat', layout: 'qerar', palette: 'burgundy',
  replyKind: 'redd', replyCats: ['pets'], regPrefix: 'RDD',
  title: 'Ev Heyvanına Aid Edilən Əməlin İnkarının Rədd Edilməsi haqqında Qərar', tag: 'Ev heyvanı',
  signOrg: 'Ev Heyvanları Hüquqları üzrə Xüsusi Şura',
  toLabel: 'BƏHANƏ GƏTİRƏN SAHİB', fromLabel: 'MÜRACİƏT EDƏN TƏRƏF',
  preamble: 'Xüsusi Şura {to} adlı şəxsin adından təqdim edilmiş izahata baxaraq müəyyən etmişdir ki, hadisə yerində başqa iştirakçının olması ehtimalı sənədlə təsdiqlənmir. {from} tərəfindən verilmiş müraciət əsaslı hesab olunur.',
  powers: 'Təqdim edilmiş izahat qəbul edilmir.\nZədələnmiş əşyanın bərpası ev sahibinin öhdəsindədir.\nDivan hüququnun sərhədləri dəyişdirilmir.\nGündəlik mükafat norması artırılmır.',
  penalty: 'Eyni hal təkrarlandıqda mənzil daxilində sərbəst hərəkət sahəsi yenidən müəyyən edilir və istisna zonalar genişləndirilir.',
  titleOptions: [
    'Ev Heyvanına Aid Edilən Əməlin İnkarının Rədd Edilməsi haqqında Qərar',
    'Zədələnmiş Əşya üzrə Verilmiş İzahatın Qəbul Edilməməsi Qərarı',
    'Divan Hüququnun Genişləndirilməsi Tələbinin Rədd Edilməsi Qərarı',
    'Əlavə Mükafat Müraciətinin Təmin Edilməməsi haqqında Qərar'
  ],
  powersOptions: [
    'Təqdim edilmiş izahat qəbul edilmir.',
    'Zədələnmiş əşyanın bərpası ev sahibinin öhdəsindədir.',
    'Divan hüququnun sərhədləri dəyişdirilmir.',
    'Gündəlik mükafat norması artırılmır.',
    'Qiymətli əşyalar daha yüksək rəflərə köçürülür.',
    'Gəzinti cədvəli əvvəlki qaydada qalır.',
    'Yemləmə rejimi baytar tövsiyəsi ilə müəyyən edilir.',
    'Oyuncaqların sayı artırılmır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Eyni hal təkrarlandıqda mənzil daxilində sərbəst hərəkət sahəsi yenidən müəyyən edilir və istisna zonalar genişləndirilir.',
    'Etiraz qeydə alınır, lakin qərarın icrasına təsir etmir.',
    'Yeni dəlillər aşkarlandıqda məsələyə yenidən baxılır.'
  ]
},
{
  id: 'r-redd-gaming', cat: 'c-redd', tone: 'zarafat', layout: 'qerar', palette: 'burgundy',
  replyKind: 'redd', replyCats: ['gaming'], regPrefix: 'RDD',
  title: 'Məğlubiyyətin Texniki Səbəblərlə İzah Edilməsinin Rədd Edilməsi Qərarı', tag: 'Oyun',
  signOrg: 'Virtual Futbol Bəhanələri üzrə Ali Komissiya',
  toLabel: 'BƏHANƏNİ İRƏLİ SÜRƏN', fromLabel: 'QALİB TƏRƏF',
  preamble: 'Təqdim edilmiş məlumatlar nəzərdən keçirilərək müəyyən edilmişdir ki, {to} adlı şəxsin iştirak etdiyi matç zamanı bağlantı göstəricilərində qeyri-adi dəyişiklik qeydə alınmamışdır. {from} tərəfindən bildirilən etiraz əsaslı hesab olunur.',
  powers: 'Texniki səbəbə istinad qəbul edilmir.\nMatçın nəticəsi dəyişdirilmədən qüvvədə qalır.\nReytinq düzəlişi aparılmır.\nRevanş matçı ayrıca razılaşdırılır.',
  penalty: 'Eyni istinad üçüncü dəfə irəli sürüldükdə həmin arqument sonrakı matçlarda ümumiyyətlə nəzərə alınmır.',
  titleOptions: [
    'Məğlubiyyətin Texniki Səbəblərlə İzah Edilməsinin Rədd Edilməsi Qərarı',
    'Bağlantı Gecikməsinə İstinadın Əsassız Sayılması haqqında Qərar',
    'Matç Nəticəsinin Dəyişdirilməsi Tələbinin Rədd Edilməsi Qərarı',
    'Hesabdan Üçüncü Şəxsin İstifadəsi İddiasının Rədd Edilməsi Qərarı'
  ],
  powersOptions: [
    'Texniki səbəbə istinad qəbul edilmir.',
    'Matçın nəticəsi dəyişdirilmədən qüvvədə qalır.',
    'Reytinq düzəlişi aparılmır.',
    'Revanş matçı ayrıca razılaşdırılır.',
    'Bağlantı jurnalı əlavə sübut kimi qəbul edilmir.',
    'Komanda tərkibi arqumenti nəzərə alınmır.',
    'Eyni istinad ayda iki dəfədən artıq irəli sürülmür.',
    'Ekran görüntüsü müstəqil sübut sayılmır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Eyni istinad üçüncü dəfə irəli sürüldükdə həmin arqument sonrakı matçlarda ümumiyyətlə nəzərə alınmır.',
    'Etiraz qəbul edilir, lakin nəticəni dəyişdirmir.',
    'Qərar mövsümün sonuna qədər qüvvədədir.'
  ]
},
{
  id: 'r-redd-viral', cat: 'c-redd', tone: 'zarafat', layout: 'qerar', palette: 'burgundy',
  replyKind: 'redd', replyCats: ['viral'], regPrefix: 'RDD',
  title: 'Ekspertiza Rəyinə Verilmiş Etirazın Rədd Edilməsi haqqında Qərar', tag: 'Ekspertiza',
  signOrg: 'Bəhanələrin Ekspertizası üzrə Ali Komissiya',
  toLabel: 'RƏY TƏQDİM EDƏN', fromLabel: 'ETİRAZ EDƏN TƏRƏF',
  preamble: 'Komissiya {to} adlı şəxsin etirazına baxaraq müəyyən etmişdir ki, təqdim edilmiş yeni məlumatlar ilkin rəyin nəticələrini dəyişdirmək üçün kifayət deyil. {from} tərəfindən verilmiş rəy qüvvədə saxlanılır.',
  powers: 'Etiraz əsassız hesab edilir və təmin olunmur.\nİlkin rəyin nəticələri dəyişdirilmir.\nTəkrar ekspertiza təyin edilmir.\nRəy qəti qüvvəyə minir.',
  penalty: 'Etirazın təkrarlanması halında rəydəki göstəricilər bir vahid ağırlaşdırılır və müraciət hüququ müvəqqəti dayandırılır.',
  titleOptions: [
    'Ekspertiza Rəyinə Verilmiş Etirazın Rədd Edilməsi haqqında Qərar',
    'Rəyin Nəticələrinin Dəyişdirilməsi Tələbinin Rədd Edilməsi Qərarı',
    'Təkrar Ekspertiza Müraciətinin Təmin Edilməməsi haqqında Qərar',
    'Verilmiş Vizanın Şərtlərinə Etirazın Rədd Edilməsi Qərarı'
  ],
  powersOptions: [
    'Etiraz əsassız hesab edilir və təmin olunmur.',
    'İlkin rəyin nəticələri dəyişdirilmir.',
    'Təkrar ekspertiza təyin edilmir.',
    'Rəy qəti qüvvəyə minir.',
    'Yeni məlumatlar ayrıca qeydə alınır.',
    'Şahid ifadələri qiymətləndirməyə daxil edilmir.',
    'Göstəricilər dəyişdirilmədən saxlanılır.',
    'Növbəti müraciətə altı aydan sonra baxılır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Etirazın təkrarlanması halında rəydəki göstəricilər bir vahid ağırlaşdırılır və müraciət hüququ müvəqqəti dayandırılır.',
    'Etiraz protokola daxil edilir, lakin nəticəyə təsir etmir.',
    'Rəy növbəti qiymətləndirməyə qədər qüvvədədir.'
  ]
},
{
  id: 'r-redd-umumi', cat: 'c-redd', tone: 'zarafat', layout: 'qerar', palette: 'burgundy',
  replyKind: 'redd', regPrefix: 'RDD',
  title: 'Təqdim Edilmiş Sənədin Rədd Edilməsi haqqında Yekun Qərar', tag: 'Universal',
  signOrg: 'Sənədlərə Etirazlar üzrə Ali Apellyasiya Şurası',
  toLabel: 'SƏNƏDİ TƏQDİM EDƏN', fromLabel: 'QƏRARI QƏBUL EDƏN',
  preamble: 'Şura {to} adlı şəxsin təqdim etdiyi sənədə baxaraq müəyyən etmişdir ki, orada göstərilən əsaslar kifayət qədər sənədləşdirilməmiş və qarşı tərəflə razılaşdırılmamışdır. {from} tərəfindən verilmiş etiraz əsaslı hesab olunur.',
  powers: 'Sənəddə göstərilən əsaslar qəbul edilmir.\nSənəd hüquqi nəticə doğurmur.\nEyni məzmunlu müraciətə otuz gün ərzində baxılmır.\nQərar imzalandığı andan qüvvəyə minir.',
  penalty: 'Rədd edilmiş sənədin yenidən, dəyişiklik edilmədən təqdim olunması halında müraciət baxılmadan qaytarılır.',
  titleOptions: [
    'Təqdim Edilmiş Sənədin Rədd Edilməsi haqqında Yekun Qərar',
    'Sənəddə Göstərilən Əsasların Qəbul Edilməməsi haqqında Qərar',
    'Müraciətin Təmin Edilməməsi haqqında Yekun Qətnamə',
    'Sənədin Hüquqi Nəticə Doğurmaması haqqında Qərar'
  ],
  powersOptions: [
    'Sənəddə göstərilən əsaslar qəbul edilmir.',
    'Sənəd hüquqi nəticə doğurmur.',
    'Eyni məzmunlu müraciətə otuz gün ərzində baxılmır.',
    'Qərar imzalandığı andan qüvvəyə minir.',
    'Sənədin surəti arxivə verilir.',
    'Razılaşdırılmamış bəndlər ayrıca qeyd olunur.',
    'Yeni sənəd hər iki tərəfin iştirakı ilə tərtib edilir.',
    'Etiraz müddəti üç gündür.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Rədd edilmiş sənədin yenidən, dəyişiklik edilmədən təqdim olunması halında müraciət baxılmadan qaytarılır.',
    'Etiraz qeydə alınır, lakin qərarın qüvvəsinə təsir göstərmir.',
    'Qərar yeni razılaşma əldə edilənədək qüvvədədir.'
  ]
},

/* ==================== ⚖️ ETİRAZ ====================
   layout: blank · palette: ink · prefiks: ETZ */
{
  id: 'r-etiraz-couples', cat: 'c-etiraz', tone: 'zarafat', layout: 'blank', palette: 'ink',
  replyKind: 'etiraz', replyCats: ['couples'], regPrefix: 'ETZ',
  title: 'Verilmiş İcazənin Şərtlərinə Etiraz Bildirilməsi haqqında Ərizə', tag: 'Ev diplomatiyası',
  signOrg: 'Cütlüklərarası Mübahisələrin Həlli üzrə Ali Şura',
  toLabel: 'Ərizəçi', fromLabel: 'Ərizə ünvanlanır', powersLabel: 'Etirazın əsasları',
  preamble: 'Mən, {to}, {from} tərəfindən verilmiş sənədə etiraz edirəm. Sənəd mənimlə razılaşdırılmadan tərtib edilmiş, şərtlər birtərəfli qaydada müəyyən olunmuş və mənim mövqeyim heç bir bənddə əks etdirilməmişdir.',
  powers: 'Sənəd hər iki tərəfin iştirakı olmadan tərtib edilib.\nŞərtlər əvvəlcədən müzakirə olunmayıb.\nMüddət birtərəfli qaydada müəyyən edilib.\nSənədin yenidən baxılması tələb olunur.',
  penalty: 'Etiraz baxılmadan qaytarıldıqda mübahisə predmeti olan məsələ üzrə əvvəlki qaydalar bərpa edilmiş hesab olunur.',
  titleOptions: [
    'Verilmiş İcazənin Şərtlərinə Etiraz Bildirilməsi haqqında Ərizə',
    'İcazənin Müddəti və Hüdudlarına Etiraz haqqında Rəsmi Ərizə',
    'Sənəddə Göstərilməmiş Şərtlərin Əlavə Edilməsi haqqında Ərizə',
    'Birtərəfli Qaydada Tərtib Edilmiş Sənədə Etiraz Ərizəsi'
  ],
  powersOptions: [
    'Sənəd hər iki tərəfin iştirakı olmadan tərtib edilib.',
    'Şərtlər əvvəlcədən müzakirə olunmayıb.',
    'Müddət birtərəfli qaydada müəyyən edilib.',
    'Sənədin yenidən baxılması tələb olunur.',
    'Cəza bəndi mütənasib deyil.',
    'Əvvəlki razılaşmalar nəzərə alınmayıb.',
    'Şahid ifadəsi toplanmayıb.',
    'Etiraz müddəti üç gündür.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Etiraz baxılmadan qaytarıldıqda mübahisə predmeti olan məsələ üzrə əvvəlki qaydalar bərpa edilmiş hesab olunur.',
    'Etiraza baxılana qədər sənədin icrası dayandırılır.',
    'Yeni sənəd hər iki tərəfin imzası ilə tərtib edilir.'
  ]
},
{
  id: 'r-etiraz-friends', cat: 'c-etiraz', tone: 'zarafat', layout: 'blank', palette: 'ink',
  replyKind: 'etiraz', replyCats: ['friends'], regPrefix: 'ETZ',
  title: 'Borc Sənədində Göstərilmiş Məbləğ və Müddətə Etiraz Ərizəsi', tag: 'Borc',
  signOrg: 'Dostlararası Mübahisələrin Həlli üzrə Ali Məclis',
  toLabel: 'Ərizəçi', fromLabel: 'Ərizə ünvanlanır', powersLabel: 'Etirazın əsasları',
  preamble: 'Mən, {to}, {from} tərəfindən tərtib edilmiş borc sənədinə etiraz edirəm. Sənəddə göstərilən məbləğ əvvəllər həyata keçirilmiş qismən ödənişləri nəzərə almır və ödəniş cədvəli mənimlə razılaşdırılmamışdır.',
  powers: 'Göstərilən məbləğ qismən ödənişləri əks etdirmir.\nÖdəniş cədvəli razılaşdırılmayıb.\nFaiz nəzərdə tutulmadığı halda əlavə tələb irəli sürülüb.\nMəbləğin yenidən hesablanması tələb olunur.',
  penalty: 'Hesablama düzəldilmədikdə ödəniş yalnız təsdiqlənmiş məbləğ həcmində həyata keçirilir və qalan hissə mübahisəli sayılır.',
  titleOptions: [
    'Borc Sənədində Göstərilmiş Məbləğ və Müddətə Etiraz Ərizəsi',
    'Ödəniş Cədvəlinin Birtərəfli Müəyyən Edilməsinə Etiraz Ərizəsi',
    'Borcun Məbləğinin Dəqiqləşdirilməsi haqqında Rəsmi Ərizə',
    'Əvvəlki Ödənişlərin Nəzərə Alınmaması haqqında Ərizə'
  ],
  powersOptions: [
    'Göstərilən məbləğ qismən ödənişləri əks etdirmir.',
    'Ödəniş cədvəli razılaşdırılmayıb.',
    'Faiz nəzərdə tutulmadığı halda əlavə tələb irəli sürülüb.',
    'Məbləğin yenidən hesablanması tələb olunur.',
    'Ödəniş qəbzləri əlavə olunur.',
    'Qonaqlıq xərcləri ayrıca qeyd edilir.',
    'Borcun tarixi dəqiqləşdirilir.',
    'Üçüncü şəxsin şahidliyi təklif olunur.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Hesablama düzəldilmədikdə ödəniş yalnız təsdiqlənmiş məbləğ həcmində həyata keçirilir və qalan hissə mübahisəli sayılır.',
    'Etiraza baxılana qədər ödəniş müddəti dayandırılır.',
    'Yekun məbləğ birgə hesablama ilə müəyyən edilir.'
  ]
},
{
  id: 'r-etiraz-work', cat: 'c-etiraz', tone: 'zarafat', layout: 'blank', palette: 'ink',
  replyKind: 'etiraz', replyCats: ['work'], regPrefix: 'ETZ',
  title: 'Tapşırığın İcra Müddəti və Həcminə Etiraz Bildirilməsi haqqında Ərizə', tag: 'Ofis',
  signOrg: 'Ofisdaxili Münasibətlərin Tənzimlənməsi üzrə Komitə',
  toLabel: 'Ərizəçi', fromLabel: 'Ərizə ünvanlanır', powersLabel: 'Etirazın əsasları',
  preamble: 'Mən, {to}, {from} tərəfindən verilmiş tapşırığın müddətinə və həcminə etiraz edirəm. Tapşırıq üçün zəruri olan resurslar ayrılmamış, əlaqədar şöbələrlə razılaşdırma aparılmamışdır.',
  powers: 'Tapşırıq üçün resurs ayrılmayıb.\nSon tarix real icra müddətinə uyğun deyil.\nƏlaqədar şöbələrlə razılaşdırma aparılmayıb.\nMüddətin yenidən müəyyən edilməsi tələb olunur.',
  penalty: 'Etiraz nəzərə alınmadıqda tapşırıq mövcud resurslar həcmində icra edilir və çatışmazlıqlar protokolda qeyd olunur.',
  titleOptions: [
    'Tapşırığın İcra Müddəti və Həcminə Etiraz Bildirilməsi haqqında Ərizə',
    'Resurs Ayrılmadan Verilmiş Tapşırığa Etiraz haqqında Ərizə',
    'İş Bölgüsünün Qeyri-bərabərliyi haqqında Rəsmi Ərizə',
    'Son Tarixin Real Olmaması haqqında Etiraz Ərizəsi'
  ],
  powersOptions: [
    'Tapşırıq üçün resurs ayrılmayıb.',
    'Son tarix real icra müddətinə uyğun deyil.',
    'Əlaqədar şöbələrlə razılaşdırma aparılmayıb.',
    'Müddətin yenidən müəyyən edilməsi tələb olunur.',
    'İş həcmi digər tapşırıqlarla üst-üstə düşür.',
    'Texniki dəstək təmin edilməyib.',
    'Aralıq nəticə üçün vaxt nəzərdə tutulmayıb.',
    'Toplantıda məsələ qaldırılıb.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Etiraz nəzərə alınmadıqda tapşırıq mövcud resurslar həcmində icra edilir və çatışmazlıqlar protokolda qeyd olunur.',
    'Etiraza baxılana qədər son tarix dayandırılır.',
    'Yeni müddət birgə razılaşdırma ilə müəyyən edilir.'
  ]
},
{
  id: 'r-etiraz-family', cat: 'c-etiraz', tone: 'zarafat', layout: 'blank', palette: 'ink',
  replyKind: 'etiraz', replyCats: ['family'], regPrefix: 'ETZ',
  title: 'Ev Qaydalarında Edilmiş Dəyişikliyə Etiraz Bildirilməsi haqqında Ərizə', tag: 'Ailə',
  signOrg: 'Evdaxili Münasibətlərin Tənzimlənməsi üzrə Ali Şura',
  toLabel: 'Ərizəçi', fromLabel: 'Ərizə ünvanlanır', powersLabel: 'Etirazın əsasları',
  preamble: 'Mən, {to}, {from} tərəfindən ev qaydalarında edilmiş dəyişikliyə etiraz edirəm. Dəyişiklik ailə şurasında müzakirə olunmadan qəbul edilmiş, mənim mövqeyim soruşulmamış və əvvəlki razılaşmanın müddəti hələ başa çatmamışdır.',
  powers: 'Dəyişiklik ailə şurasında müzakirə olunmayıb.\nƏvvəlki razılaşma müddəti başa çatmayıb.\nÖhdəliklərin icrası nəzərə alınmayıb.\nQaydaların yenidən müzakirəsi tələb olunur.',
  penalty: 'Etiraz nəzərə alınmadıqda yeni qaydalar qüvvədə qalır, lakin növbəti ailə şurasında məsələ mütləq gündəliyə salınır.',
  titleOptions: [
    'Ev Qaydalarında Edilmiş Dəyişikliyə Etiraz Bildirilməsi haqqında Ərizə',
    'Ekran Vaxtı Limitinin Azaldılmasına Etiraz haqqında Ərizə',
    'Yatma Saatının Dəyişdirilməsinə Etiraz haqqında Rəsmi Ərizə',
    'Ev Tapşırıqlarının Bölgüsünə Etiraz Ərizəsi'
  ],
  powersOptions: [
    'Dəyişiklik ailə şurasında müzakirə olunmayıb.',
    'Əvvəlki razılaşma müddəti başa çatmayıb.',
    'Öhdəliklərin icrası nəzərə alınmayıb.',
    'Qaydaların yenidən müzakirəsi tələb olunur.',
    'Tədris nəticələri sabit qalıb.',
    'Ev tapşırıqları vaxtında yerinə yetirilib.',
    'Həftəsonu güzəşti ləğv edilib.',
    'Şuranın növbəti iclası tələb olunur.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Etiraz nəzərə alınmadıqda yeni qaydalar qüvvədə qalır, lakin növbəti ailə şurasında məsələ mütləq gündəliyə salınır.',
    'Etiraza baxılana qədər əvvəlki qaydalar tətbiq olunur.',
    'Qaydalar hər rübün sonunda yenidən razılaşdırılır.'
  ]
},
{
  id: 'r-etiraz-relatives', cat: 'c-etiraz', tone: 'zarafat', layout: 'blank', palette: 'ink',
  replyKind: 'etiraz', replyCats: ['relatives'], regPrefix: 'ETZ',
  title: 'Ziyarət Protokolunun Şərtlərinə Etiraz Bildirilməsi haqqında Ərizə', tag: 'Qohumlar',
  signOrg: 'Qohumluq Münasibətləri üzrə Ali Nəzarət Şurası',
  toLabel: 'Ərizəçi', fromLabel: 'Ərizə ünvanlanır', powersLabel: 'Etirazın əsasları',
  preamble: 'Mən, {to}, {from} tərəfindən tərtib edilmiş ziyarət protokoluna etiraz edirəm. Protokolda ziyarətlərin sayı bərabər bölünməmiş və hər iki ailənin marşrutu eyni qaydada nəzərə alınmamışdır.',
  powers: 'Ziyarətlərin sayı bərabər bölünməyib.\nMarşrut yalnız bir tərəfin təklifi ilə qurulub.\nMüddət hüdudları göstərilməyib.\nProtokolun yenidən tərtibi tələb olunur.',
  penalty: 'Etiraz nəzərə alınmadıqda ziyarətlər mövcud protokol üzrə davam edir, lakin növbəti bayramda növbəlilik tərsinə başlayır.',
  titleOptions: [
    'Ziyarət Protokolunun Şərtlərinə Etiraz Bildirilməsi haqqında Ərizə',
    'Ziyarət Növbəsinin Qeyri-bərabər Bölgüsünə Etiraz Ərizəsi',
    'Ziyarət Müddətinin Uzadılmasına Etiraz haqqında Ərizə',
    'Bayram Marşrutunun Razılaşdırılmaması haqqında Ərizə'
  ],
  powersOptions: [
    'Ziyarətlərin sayı bərabər bölünməyib.',
    'Marşrut yalnız bir tərəfin təklifi ilə qurulub.',
    'Müddət hüdudları göstərilməyib.',
    'Protokolun yenidən tərtibi tələb olunur.',
    'Uzaq qohumlara ziyarət planda yoxdur.',
    'Yol xərcləri bölüşdürülməyib.',
    'Gecələmə variantı müzakirə olunmayıb.',
    'Bayram günlərinin sayı nəzərə alınmayıb.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Etiraz nəzərə alınmadıqda ziyarətlər mövcud protokol üzrə davam edir, lakin növbəti bayramda növbəlilik tərsinə başlayır.',
    'Etiraza baxılana qədər ziyarət növbəsi dayandırılır.',
    'Yeni protokol hər iki ailənin iştirakı ilə tərtib edilir.'
  ]
},
{
  id: 'r-etiraz-student', cat: 'c-etiraz', tone: 'zarafat', layout: 'blank', palette: 'ink',
  replyKind: 'etiraz', replyCats: ['student'], regPrefix: 'ETZ',
  title: 'Qiymətləndirmənin Nəticələrinə Etiraz Bildirilməsi haqqında Ərizə', tag: 'Tələbə',
  signOrg: 'Tələbə Bəhanələrinin Araşdırılması üzrə Komissiya',
  toLabel: 'Ərizəçi', fromLabel: 'Ərizə ünvanlanır', powersLabel: 'Etirazın əsasları',
  preamble: 'Mən, {to}, {from} tərəfindən aparılmış qiymətləndirmənin nəticələrinə etiraz edirəm. Qiymətləndirmədə iş üzrə təqdim edilmiş bütün materiallar nəzərə alınmamış və aralıq nəticələr hesaba daxil edilməmişdir.',
  powers: 'Təqdim edilmiş bütün materiallar nəzərə alınmayıb.\nAralıq nəticələr hesaba daxil edilməyib.\nQiymətləndirmə meyarları əvvəlcədən elan olunmayıb.\nNəticənin yenidən baxılması tələb olunur.',
  penalty: 'Etiraz təmin edilmədikdə nəticə qüvvədə qalır və növbəti müraciətə yalnız yeni materiallar təqdim edildikdə baxılır.',
  titleOptions: [
    'Qiymətləndirmənin Nəticələrinə Etiraz Bildirilməsi haqqında Ərizə',
    'İmtahan Nəticəsinin Yenidən Baxılması haqqında Rəsmi Ərizə',
    'Davamiyyət Qeydlərinin Dəqiqləşdirilməsi haqqında Ərizə',
    'Təhvil Müddətinin Qısa Müəyyən Edilməsinə Etiraz Ərizəsi'
  ],
  powersOptions: [
    'Təqdim edilmiş bütün materiallar nəzərə alınmayıb.',
    'Aralıq nəticələr hesaba daxil edilməyib.',
    'Qiymətləndirmə meyarları əvvəlcədən elan olunmayıb.',
    'Nəticənin yenidən baxılması tələb olunur.',
    'Davamiyyət qeydləri jurnalla uyğun gəlmir.',
    'Praktiki iş ayrıca qiymətləndirilməyib.',
    'Konsultasiyada verilən tövsiyələr nəzərə alınmayıb.',
    'Apellyasiya müddəti pozulmayıb.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Etiraz təmin edilmədikdə nəticə qüvvədə qalır və növbəti müraciətə yalnız yeni materiallar təqdim edildikdə baxılır.',
    'Etiraza baxılana qədər nəticə ilkin hesab edilir.',
    'Yenidən baxış üç gün ərzində aparılır.'
  ]
},
{
  id: 'r-etiraz-neighbors', cat: 'c-etiraz', tone: 'zarafat', layout: 'blank', palette: 'ink',
  replyKind: 'etiraz', replyCats: ['neighbors'], regPrefix: 'ETZ',
  title: 'Həyət Yığıncağının Qərarına Etiraz Bildirilməsi haqqında Ərizə', tag: 'Qonşuluq',
  signOrg: 'Həyətdaxili Nizamın Qorunması üzrə Baş İdarə',
  toLabel: 'Ərizəçi', fromLabel: 'Ərizə ünvanlanır', powersLabel: 'Etirazın əsasları',
  preamble: 'Mən, {to}, {from} tərəfindən elan edilmiş həyət qərarına etiraz edirəm. Qərar sakinlərin əksəriyyətinin iştirakı olmadan qəbul edilmiş və elan lövhəsində vaxtında yerləşdirilməmişdir.',
  powers: 'Qərar sakinlərin əksəriyyəti olmadan qəbul edilib.\nElan lövhəsində vaxtında yerləşdirilməyib.\nSəsvermə nəticələri açıqlanmayıb.\nQərarın yenidən müzakirəsi tələb olunur.',
  penalty: 'Etiraz nəzərə alınmadıqda qərar qüvvədə qalır, lakin növbəti ümumi yığıncaqda məsələ mütləq gündəliyə salınır.',
  titleOptions: [
    'Həyət Yığıncağının Qərarına Etiraz Bildirilməsi haqqında Ərizə',
    'Park Yeri Bölgüsünə Etiraz haqqında Rəsmi Ərizə',
    'Təmizlik Növbəsinin Qeyri-bərabərliyi haqqında Ərizə',
    'Ümumi Vəsaitin Xərclənməsinə Etiraz Ərizəsi'
  ],
  powersOptions: [
    'Qərar sakinlərin əksəriyyəti olmadan qəbul edilib.',
    'Elan lövhəsində vaxtında yerləşdirilməyib.',
    'Səsvermə nəticələri açıqlanmayıb.',
    'Qərarın yenidən müzakirəsi tələb olunur.',
    'Park yerlərinin bölgüsü qeyri-bərabərdir.',
    'Təmizlik növbəsi bəzi mənzilləri əhatə etmir.',
    'Ümumi vəsaitin xərclənməsi hesabatı verilməyib.',
    'Yaşlı sakinlərin güzəşti nəzərə alınmayıb.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Etiraz nəzərə alınmadıqda qərar qüvvədə qalır, lakin növbəti ümumi yığıncaqda məsələ mütləq gündəliyə salınır.',
    'Etiraza baxılana qədər qərarın icrası dayandırılır.',
    'Yeni səsvermə bütün sakinlərin iştirakı ilə keçirilir.'
  ]
},
{
  id: 'r-etiraz-holiday', cat: 'c-etiraz', tone: 'zarafat', layout: 'blank', palette: 'ink',
  replyKind: 'etiraz', replyCats: ['holiday'], regPrefix: 'ETZ',
  title: 'Mərasim Öhdəliklərinin Bölgüsünə Etiraz Bildirilməsi haqqında Ərizə', tag: 'Toy',
  signOrg: 'Toy Davranışlarına Nəzarət üzrə Baş İdarə',
  toLabel: 'Ərizəçi', fromLabel: 'Ərizə ünvanlanır', powersLabel: 'Etirazın əsasları',
  preamble: 'Mən, {to}, {from} tərəfindən müəyyən edilmiş mərasim öhdəliklərinin bölgüsünə etiraz edirəm. Öhdəliklər mənimlə razılaşdırılmadan təyin edilmiş və qonaq siyahısı birtərəfli qaydada tərtib olunmuşdur.',
  powers: 'Öhdəliklər razılaşdırılmadan təyin edilib.\nQonaq siyahısı birtərəfli tərtib olunub.\nBüdcə hüdudları müzakirə edilməyib.\nBölgünün yenidən aparılması tələb olunur.',
  penalty: 'Etiraz nəzərə alınmadıqda mövcud bölgü qüvvədə qalır, lakin növbəti mərasimdə öhdəliklərin təyini digər tərəfə keçir.',
  titleOptions: [
    'Mərasim Öhdəliklərinin Bölgüsünə Etiraz Bildirilməsi haqqında Ərizə',
    'Qonaq Siyahısının Tərtibinə Etiraz haqqında Rəsmi Ərizə',
    'Hədiyyə Büdcəsinin Müəyyən Edilməsinə Etiraz Ərizəsi',
    'Masa Bölgüsünün Razılaşdırılmaması haqqında Ərizə'
  ],
  powersOptions: [
    'Öhdəliklər razılaşdırılmadan təyin edilib.',
    'Qonaq siyahısı birtərəfli tərtib olunub.',
    'Büdcə hüdudları müzakirə edilməyib.',
    'Bölgünün yenidən aparılması tələb olunur.',
    'Masa nizamı əvvəlcədən bildirilməyib.',
    'Hədiyyə büdcəsi bərabər bölünməyib.',
    'Mərasim proqramı razılaşdırılmayıb.',
    'Foto öhdəliyi tək tərəfə həvalə edilib.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Etiraz nəzərə alınmadıqda mövcud bölgü qüvvədə qalır, lakin növbəti mərasimdə öhdəliklərin təyini digər tərəfə keçir.',
    'Etiraza baxılana qədər öhdəliklərin icrası dayandırılır.',
    'Bölgü hər iki tərəfin imzası ilə təsdiqlənir.'
  ]
},
{
  id: 'r-etiraz-travel', cat: 'c-etiraz', tone: 'zarafat', layout: 'blank', palette: 'ink',
  replyKind: 'etiraz', replyCats: ['travel'], regPrefix: 'ETZ',
  title: 'Səfər Planında Müəyyən Edilmiş Şərtlərə Etiraz haqqında Ərizə', tag: 'Səfər',
  signOrg: 'Səfər və Marşrut Mübahisələri üzrə Ali Komissiya',
  toLabel: 'Ərizəçi', fromLabel: 'Ərizə ünvanlanır', powersLabel: 'Etirazın əsasları',
  preamble: 'Mən, {to}, {from} tərəfindən tərtib edilmiş səfər planına etiraz edirəm. Marşrut, dayanacaqlar və növbəlilik mənimlə razılaşdırılmadan müəyyən edilmiş, təkliflərim isə plana daxil edilməmişdir.',
  powers: 'Marşrut razılaşdırılmadan tərtib edilib.\nDayanacaqların yeri təkbaşına seçilib.\nSürücülük növbəsi qeyri-bərabər bölünüb.\nPlanın yenidən tərtibi tələb olunur.',
  penalty: 'Etiraz nəzərə alınmadıqda səfər mövcud plan üzrə həyata keçirilir, lakin qayıdış marşrutu digər tərəf tərəfindən müəyyən edilir.',
  titleOptions: [
    'Səfər Planında Müəyyən Edilmiş Şərtlərə Etiraz haqqında Ərizə',
    'Marşrutun Birtərəfli Tərtibinə Etiraz haqqında Rəsmi Ərizə',
    'Baqaj Bölgüsünün Qeyri-bərabərliyi haqqında Ərizə',
    'Sürücülük Növbəsinin Təyininə Etiraz Ərizəsi'
  ],
  powersOptions: [
    'Marşrut razılaşdırılmadan tərtib edilib.',
    'Dayanacaqların yeri təkbaşına seçilib.',
    'Sürücülük növbəsi qeyri-bərabər bölünüb.',
    'Planın yenidən tərtibi tələb olunur.',
    'Baqaj bölgüsü nəzərə alınmayıb.',
    'Yanacaq xərcinin bölgüsü göstərilməyib.',
    'Yemək fasilələri planda yoxdur.',
    'Gəlmə vaxtı real deyil.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Etiraz nəzərə alınmadıqda səfər mövcud plan üzrə həyata keçirilir, lakin qayıdış marşrutu digər tərəf tərəfindən müəyyən edilir.',
    'Etiraza baxılana qədər yola çıxma vaxtı dayandırılır.',
    'Plan hər iki tərəfin razılığı ilə təsdiqlənir.'
  ]
},
{
  id: 'r-etiraz-pets', cat: 'c-etiraz', tone: 'zarafat', layout: 'blank', palette: 'ink',
  replyKind: 'etiraz', replyCats: ['pets'], regPrefix: 'ETZ',
  title: 'Ev Heyvanına Aid Edilmiş Qaydalara Etiraz Bildirilməsi haqqında Ərizə', tag: 'Ev heyvanı',
  signOrg: 'Ev Heyvanları Hüquqları üzrə Xüsusi Şura',
  toLabel: 'Ərizəçi', fromLabel: 'Ərizə ünvanlanır', powersLabel: 'Etirazın əsasları',
  preamble: 'Mən, {to} adından, {from} tərəfindən müəyyən edilmiş qaydalara etiraz bildirirəm. Qaydalar uzunmüddətli faktiki vəziyyəti nəzərə almadan tərtib edilmiş və mövcud hüquqları məhdudlaşdırmışdır.',
  powers: 'Qaydalar faktiki vəziyyəti nəzərə almır.\nDivan sahəsi əsassız olaraq daraldılıb.\nMükafat norması baytar rəyi olmadan azaldılıb.\nQaydaların yenidən baxılması tələb olunur.',
  penalty: 'Etiraz nəzərə alınmadıqda yeni qaydalar qüvvədə qalır, lakin növbəti baytar müayinəsindən sonra mütləq yenidən nəzərdən keçirilir.',
  titleOptions: [
    'Ev Heyvanına Aid Edilmiş Qaydalara Etiraz Bildirilməsi haqqında Ərizə',
    'Divan Hüququnun Məhdudlaşdırılmasına Etiraz haqqında Ərizə',
    'Mükafat Normasının Azaldılmasına Etiraz Ərizəsi',
    'Gəzinti Cədvəlinin Dəyişdirilməsinə Etiraz haqqında Ərizə'
  ],
  powersOptions: [
    'Qaydalar faktiki vəziyyəti nəzərə almır.',
    'Divan sahəsi əsassız olaraq daraldılıb.',
    'Mükafat norması baytar rəyi olmadan azaldılıb.',
    'Qaydaların yenidən baxılması tələb olunur.',
    'Gəzinti müddəti qısaldılıb.',
    'Yem növü xəbərdarlıq edilmədən dəyişdirilib.',
    'Oyuncaqların sayı azaldılıb.',
    'Yataq sahəsi məhdudlaşdırılıb.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Etiraz nəzərə alınmadıqda yeni qaydalar qüvvədə qalır, lakin növbəti baytar müayinəsindən sonra mütləq yenidən nəzərdən keçirilir.',
    'Etiraza baxılana qədər əvvəlki qaydalar tətbiq edilir.',
    'Qaydalar hər mövsüm yenidən razılaşdırılır.'
  ]
},
{
  id: 'r-etiraz-gaming', cat: 'c-etiraz', tone: 'zarafat', layout: 'blank', palette: 'ink',
  replyKind: 'etiraz', replyCats: ['gaming'], regPrefix: 'ETZ',
  title: 'Matçın Nəticəsinin Qeydə Alınması Qaydasına Etiraz Ərizəsi', tag: 'Oyun',
  signOrg: 'Virtual Futbol Bəhanələri üzrə Ali Komissiya',
  toLabel: 'Ərizəçi', fromLabel: 'Ərizə ünvanlanır', powersLabel: 'Etirazın əsasları',
  preamble: 'Mən, {to}, {from} tərəfindən qeydə alınmış matç nəticəsinə etiraz edirəm. Matçın şərtləri başlanğıcda razılaşdırılmamış, xəritə seçimi birtərəfli aparılmış və texniki fasilə nəzərə alınmamışdır.',
  powers: 'Matçın şərtləri əvvəlcədən razılaşdırılmayıb.\nXəritə seçimi birtərəfli aparılıb.\nTexniki fasilə nəzərə alınmayıb.\nNəticənin yenidən qiymətləndirilməsi tələb olunur.',
  penalty: 'Etiraz təmin edilmədikdə nəticə qüvvədə qalır, lakin revanş matçının şərtləri tam olaraq etiraz edən tərəf tərəfindən müəyyən edilir.',
  titleOptions: [
    'Matçın Nəticəsinin Qeydə Alınması Qaydasına Etiraz Ərizəsi',
    'Komanda Tərkibinin Müəyyən Edilməsinə Etiraz haqqında Ərizə',
    'Reytinq Düzəlişinin Aparılmamasına Etiraz Ərizəsi',
    'Matçın Şərtlərinin Razılaşdırılmaması haqqında Ərizə'
  ],
  powersOptions: [
    'Matçın şərtləri əvvəlcədən razılaşdırılmayıb.',
    'Xəritə seçimi birtərəfli aparılıb.',
    'Texniki fasilə nəzərə alınmayıb.',
    'Nəticənin yenidən qiymətləndirilməsi tələb olunur.',
    'Komanda tərkibi matç ərzində dəyişdirilib.',
    'Bağlantı jurnalı təqdim edilib.',
    'Şahid oyunçuların ifadəsi əlavə olunur.',
    'Revanş matçı təklif edilir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Etiraz təmin edilmədikdə nəticə qüvvədə qalır, lakin revanş matçının şərtləri tam olaraq etiraz edən tərəf tərəfindən müəyyən edilir.',
    'Etiraza baxılana qədər reytinq düzəlişi aparılmır.',
    'Yeni matç şərtləri birgə razılaşdırılır.'
  ]
},
{
  id: 'r-etiraz-viral', cat: 'c-etiraz', tone: 'zarafat', layout: 'blank', palette: 'ink',
  replyKind: 'etiraz', replyCats: ['viral'], regPrefix: 'ETZ',
  title: 'Ekspertiza Rəyinin Metodikasına Etiraz Bildirilməsi haqqında Ərizə', tag: 'Ekspertiza',
  signOrg: 'Bəhanələrin Ekspertizası üzrə Ali Komissiya',
  toLabel: 'Ərizəçi', fromLabel: 'Ərizə ünvanlanır', powersLabel: 'Etirazın əsasları',
  preamble: 'Mən, {to}, {from} tərəfindən tərtib edilmiş ekspertiza rəyinin metodikasına etiraz edirəm. Müşahidə müddəti qısa olmuş, nümunə sayı kifayət etməmiş və nəticələr tək epizod üzərində qurulmuşdur.',
  powers: 'Müşahidə müddəti qısa olub.\nNümunə sayı kifayət etməyib.\nNəticələr tək epizod üzərində qurulub.\nTəkrar ekspertizanın təyini tələb olunur.',
  penalty: 'Etiraz təmin edilmədikdə rəy qüvvədə qalır, lakin göstəricilər növbəti qiymətləndirmədə mütləq yenidən ölçülür.',
  titleOptions: [
    'Ekspertiza Rəyinin Metodikasına Etiraz Bildirilməsi haqqında Ərizə',
    'Rəydəki Göstəricilərin Dəqiqləşdirilməsi haqqında Rəsmi Ərizə',
    'Müşahidə Müddətinin Qısa Olmasına Etiraz Ərizəsi',
    'Təkrar Ekspertiza Təyin Edilməsi haqqında Ərizə'
  ],
  powersOptions: [
    'Müşahidə müddəti qısa olub.',
    'Nümunə sayı kifayət etməyib.',
    'Nəticələr tək epizod üzərində qurulub.',
    'Təkrar ekspertizanın təyini tələb olunur.',
    'Müqayisə üçün kontrol qrup götürülməyib.',
    'Xarici amillər qiymətləndirməyə daxil edilməyib.',
    'Göstəricilərin hesablanma qaydası açıqlanmayıb.',
    'Yeni məlumatlar əlavə edilir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Etiraz təmin edilmədikdə rəy qüvvədə qalır, lakin göstəricilər növbəti qiymətləndirmədə mütləq yenidən ölçülür.',
    'Etiraza baxılana qədər rəy ilkin hesab edilir.',
    'Təkrar ekspertiza müstəqil ekspert tərəfindən aparılır.'
  ]
},
{
  id: 'r-etiraz-umumi', cat: 'c-etiraz', tone: 'zarafat', layout: 'blank', palette: 'ink',
  replyKind: 'etiraz', regPrefix: 'ETZ',
  title: 'Təqdim Edilmiş Sənədə Rəsmi Etiraz Bildirilməsi haqqında Ərizə', tag: 'Universal',
  signOrg: 'Sənədlərə Etirazlar üzrə Ali Apellyasiya Şurası',
  toLabel: 'Ərizəçi', fromLabel: 'Ərizə ünvanlanır', powersLabel: 'Etirazın əsasları',
  preamble: 'Mən, {to}, {from} tərəfindən tərtib edilmiş sənədə rəsmi etiraz bildirirəm. Sənəd mənimlə razılaşdırılmadan hazırlanmış, şərtləri birtərəfli müəyyən edilmiş və mənim mövqeyim heç bir bənddə əks olunmamışdır.',
  powers: 'Sənəd razılaşdırılmadan tərtib edilib.\nŞərtlər birtərəfli müəyyən olunub.\nMövqeyim sənəddə əks etdirilməyib.\nSənədin yenidən tərtibi tələb olunur.',
  penalty: 'Etiraza baxılmadıqda sənəd qüvvədə qalır, lakin onun əsasında irəli sürülən tələblər mübahisəli hesab edilir.',
  titleOptions: [
    'Təqdim Edilmiş Sənədə Rəsmi Etiraz Bildirilməsi haqqında Ərizə',
    'Sənədin Razılaşdırılmadan Tərtibinə Etiraz haqqında Ərizə',
    'Sənəddəki Şərtlərin Yenidən Baxılması haqqında Ərizə',
    'Bir Tərəfin Mövqeyinin Əks Etdirilməməsi haqqında Ərizə'
  ],
  powersOptions: [
    'Sənəd razılaşdırılmadan tərtib edilib.',
    'Şərtlər birtərəfli müəyyən olunub.',
    'Mövqeyim sənəddə əks etdirilməyib.',
    'Sənədin yenidən tərtibi tələb olunur.',
    'Cəza bəndi mütənasib deyil.',
    'Müddət hüdudları göstərilməyib.',
    'Əvvəlki razılaşmalar nəzərə alınmayıb.',
    'Etiraz müddəti üç gündür.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Etiraza baxılmadıqda sənəd qüvvədə qalır, lakin onun əsasında irəli sürülən tələblər mübahisəli hesab edilir.',
    'Etiraza baxılana qədər sənədin icrası dayandırılır.',
    'Yeni sənəd hər iki tərəfin imzası ilə tərtib edilir.'
  ]
},

/* ==================== 🔄 TƏKRAR BAXIŞ ====================
   layout: ekspertiza · palette: forest · prefiks: TKR */
{
  id: 'r-tekrar-couples', cat: 'c-tekrar', tone: 'zarafat', layout: 'ekspertiza', palette: 'forest',
  replyKind: 'tekrar', replyCats: ['couples'], regPrefix: 'TKR',
  title: 'Ev Daxilində Qüvvədə Olan Razılaşmanın Yenidən Qiymətləndirilməsi Rəyi', tag: 'Ev diplomatiyası',
  signOrg: 'Cütlüklərarası Mübahisələrin Həlli üzrə Ali Şura',
  powersLabel: 'TƏKRAR BAXIŞIN ŞƏRTLƏRİ',
  preamble: 'Məsələyə dair aparılmış təkrar qiymətləndirmə nəticəsində müəyyən edilmişdir ki, {to} və {from} arasında qüvvədə olan razılaşma tərtib edildiyi vaxtdan bəri dəyişmiş şəraiti əks etdirmir. Sənədin yenidən nəzərdən keçirilməsi məqsədəuyğun hesab olunur.',
  powers: 'Razılaşmanın şərtləri hazırkı şəraitə uyğun deyil.\nTərəflərin gündəlik cədvəli dəyişib.\nƏvvəlki cəza bəndi mütənasibliyini itirib.\nSənədin yeni redaksiyada tərtibi tövsiyə olunur.',
  penalty: 'Təkrar baxış nəticəsində yeni sənəd tərtib edilməzsə, əvvəlki razılaşma dəyişdirilmədən qüvvədə qalır.',
  titleOptions: [
    'Ev Daxilində Qüvvədə Olan Razılaşmanın Yenidən Qiymətləndirilməsi Rəyi',
    'Tərəflərin Mövqelərində Baş Vermiş Dəyişikliyə dair Ekspert Rəyi',
    'Əvvəlki Sənədin Aktuallığının Yoxlanılmasına dair Yekun Rəy',
    'Razılaşmanın Şərtlərinin Təkrar Araşdırılmasına dair Rəy'
  ],
  powersOptions: [
    'Razılaşmanın şərtləri hazırkı şəraitə uyğun deyil.',
    'Tərəflərin gündəlik cədvəli dəyişib.',
    'Əvvəlki cəza bəndi mütənasibliyini itirib.',
    'Sənədin yeni redaksiyada tərtibi tövsiyə olunur.',
    'Qüvvədəolma müddəti uzun müəyyən edilib.',
    'Bəzi bəndlər praktikada tətbiq olunmayıb.',
    'Yeni hallar sənəddə əks olunmayıb.',
    'Hər iki tərəf yenidən baxışa razıdır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Təkrar baxış nəticəsində yeni sənəd tərtib edilməzsə, əvvəlki razılaşma dəyişdirilmədən qüvvədə qalır.',
    'Rəy tərəflərin razılığı ilə istənilən vaxt yenilənə bilər.',
    'Yeni sənəd hər iki tərəfin imzası ilə qüvvəyə minir.'
  ]
},
{
  id: 'r-tekrar-friends', cat: 'c-tekrar', tone: 'zarafat', layout: 'ekspertiza', palette: 'forest',
  replyKind: 'tekrar', replyCats: ['friends'], regPrefix: 'TKR',
  title: 'Borc Öhdəliyinin Şərtlərinin Təkrar Araşdırılmasına dair Rəy', tag: 'Borc',
  signOrg: 'Dostlararası Mübahisələrin Həlli üzrə Ali Məclis',
  powersLabel: 'TƏKRAR BAXIŞIN ŞƏRTLƏRİ',
  preamble: 'Təqdim edilmiş məlumatlar nəzərdən keçirilərək müəyyən edilmişdir ki, {to} və {from} arasındakı borc öhdəliyi üzrə qismən ödənişlər aparılmış, lakin cədvəldə əks etdirilməmişdir. Məsələnin təkrar araşdırılması zəruri hesab olunur.',
  powers: 'Qismən ödənişlər cədvəldə əks olunmayıb.\nQalıq məbləğ yenidən hesablanmalıdır.\nÖdəniş tarixləri dəqiqləşdirilir.\nYeni cədvəl hər iki tərəflə razılaşdırılır.',
  penalty: 'Təkrar araşdırma başa çatanadək əvvəlki ödəniş cədvəli qüvvədə qalır və gecikmə hesablanmır.',
  titleOptions: [
    'Borc Öhdəliyinin Şərtlərinin Təkrar Araşdırılmasına dair Rəy',
    'Ödəniş Cədvəlinin Yenidən Qurulması İmkanlarına dair Rəy',
    'Borcun Qalıq Məbləğinin Dəqiqləşdirilməsinə dair Yekun Rəy',
    'Möhlət Müddətinin Yenidən Hesablanmasına dair Ekspert Rəyi'
  ],
  powersOptions: [
    'Qismən ödənişlər cədvəldə əks olunmayıb.',
    'Qalıq məbləğ yenidən hesablanmalıdır.',
    'Ödəniş tarixləri dəqiqləşdirilir.',
    'Yeni cədvəl hər iki tərəflə razılaşdırılır.',
    'Qəbzlər araşdırmaya daxil edilib.',
    'Hissə-hissə ödəniş variantı qiymətləndirilir.',
    'Faiz tətbiq edilmədiyi təsdiqlənib.',
    'Üçüncü şəxsin şahidliyi nəzərə alınıb.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Təkrar araşdırma başa çatanadək əvvəlki ödəniş cədvəli qüvvədə qalır və gecikmə hesablanmır.',
    'Yekun məbləğ birgə hesablama ilə təsdiqlənir.',
    'Rəy yeni cədvəl imzalananadək qüvvədədir.'
  ]
},
{
  id: 'r-tekrar-work', cat: 'c-tekrar', tone: 'zarafat', layout: 'ekspertiza', palette: 'forest',
  replyKind: 'tekrar', replyCats: ['work'], regPrefix: 'TKR',
  title: 'Tapşırığın İcra Şərtlərinin Təkrar Qiymətləndirilməsinə dair Rəy', tag: 'Ofis',
  signOrg: 'Ofisdaxili Münasibətlərin Tənzimlənməsi üzrə Komitə',
  powersLabel: 'ARAŞDIRMANIN ŞƏRTLƏRİ',
  preamble: 'Aparılmış təkrar qiymətləndirmə nəticəsində müəyyən edilmişdir ki, {to} adlı şəxsə həvalə edilmiş tapşırığın həcmi ilə ayrılmış resurslar arasında uyğunsuzluq mövcuddur. Rəy {from} tərəfindən verilmiş müraciət əsasında tərtib olunmuşdur.',
  powers: 'Tapşırığın həcmi ilə resurslar uyğun gəlmir.\nSon tarix real icra müddətindən qısadır.\nƏlaqədar şöbələrin yükü nəzərə alınmayıb.\nŞərtlərin yenidən müəyyən edilməsi tövsiyə olunur.',
  penalty: 'Təkrar qiymətləndirmənin nəticələri qəbul edilmədikdə tapşırıq mövcud şərtlərlə icra edilir və çatışmazlıqlar protokolda göstərilir.',
  titleOptions: [
    'Tapşırığın İcra Şərtlərinin Təkrar Qiymətləndirilməsinə dair Rəy',
    'Resurs Təminatının Yenidən Araşdırılmasına dair Ekspert Rəyi',
    'İş Bölgüsünün Bərabərliyinin Qiymətləndirilməsinə dair Rəy',
    'Son Tarixin Real Olub-Olmamasına dair Yekun Rəy'
  ],
  powersOptions: [
    'Tapşırığın həcmi ilə resurslar uyğun gəlmir.',
    'Son tarix real icra müddətindən qısadır.',
    'Əlaqədar şöbələrin yükü nəzərə alınmayıb.',
    'Şərtlərin yenidən müəyyən edilməsi tövsiyə olunur.',
    'Aralıq nəticə mərhələləri təklif edilir.',
    'Texniki dəstək zərurəti qeyd olunur.',
    'Digər tapşırıqlarla üst-üstə düşmə aşkarlanıb.',
    'İcraçıların sayının artırılması müzakirə edilir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Təkrar qiymətləndirmənin nəticələri qəbul edilmədikdə tapşırıq mövcud şərtlərlə icra edilir və çatışmazlıqlar protokolda göstərilir.',
    'Rəy yeni müddət təsdiqlənənədək qüvvədədir.',
    'Şərtlər toplantıda yenidən müzakirə olunur.'
  ]
},
{
  id: 'r-tekrar-family', cat: 'c-tekrar', tone: 'zarafat', layout: 'ekspertiza', palette: 'forest',
  replyKind: 'tekrar', replyCats: ['family'], regPrefix: 'TKR',
  title: 'Ev Qaydalarının Aktuallığının Təkrar Qiymətləndirilməsinə dair Rəy', tag: 'Ailə',
  signOrg: 'Evdaxili Münasibətlərin Tənzimlənməsi üzrə Ali Şura',
  powersLabel: 'TƏKRAR BAXIŞIN ŞƏRTLƏRİ',
  preamble: 'Mövcud vəziyyət qiymətləndirildikdən sonra müəyyən edilmişdir ki, {to} adlı şəxsə tətbiq olunan ev qaydaları son aylarda dəyişmiş tədris yükünü nəzərə almır. Rəy {from} tərəfindən verilmiş müraciət əsasında tərtib olunmuşdur.',
  powers: 'Qaydalar dəyişmiş tədris yükünü nəzərə almır.\nEkran vaxtı limiti yenidən hesablanmalıdır.\nÖhdəliklərin icrası müsbət qiymətləndirilir.\nQaydaların yeni redaksiyası tövsiyə olunur.',
  penalty: 'Təkrar baxış nəticəsində yeni qaydalar qəbul edilməzsə, mövcud rejim dəyişdirilmədən qüvvədə qalır.',
  titleOptions: [
    'Ev Qaydalarının Aktuallığının Təkrar Qiymətləndirilməsinə dair Rəy',
    'Ekran Vaxtı Limitinin Yenidən Hesablanmasına dair Rəy',
    'Yatma Saatı Rejiminin Uyğunluğuna dair Ekspert Rəyi',
    'Ev Tapşırıqları Bölgüsünün Təkrar Baxışına dair Rəy'
  ],
  powersOptions: [
    'Qaydalar dəyişmiş tədris yükünü nəzərə almır.',
    'Ekran vaxtı limiti yenidən hesablanmalıdır.',
    'Öhdəliklərin icrası müsbət qiymətləndirilir.',
    'Qaydaların yeni redaksiyası tövsiyə olunur.',
    'Yatma saatı yaşa uyğun dəqiqləşdirilir.',
    'Həftəsonu rejimi ayrıca müəyyən edilir.',
    'Cib xərcliyinin məbləği yenidən baxılır.',
    'Ailə şurasının iclası təklif olunur.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Təkrar baxış nəticəsində yeni qaydalar qəbul edilməzsə, mövcud rejim dəyişdirilmədən qüvvədə qalır.',
    'Rəy növbəti ailə şurasınadək qüvvədədir.',
    'Qaydalar hər tədris rübünün sonunda yenilənir.'
  ]
},
{
  id: 'r-tekrar-relatives', cat: 'c-tekrar', tone: 'zarafat', layout: 'ekspertiza', palette: 'forest',
  replyKind: 'tekrar', replyCats: ['relatives'], regPrefix: 'TKR',
  title: 'Ziyarət Rejiminin Təkrar Araşdırılması və Yenidən Qurulmasına dair Rəy', tag: 'Qohumlar',
  signOrg: 'Qohumluq Münasibətləri üzrə Ali Nəzarət Şurası',
  powersLabel: 'TƏKRAR BAXIŞIN ŞƏRTLƏRİ',
  preamble: 'İş üzrə toplanmış məlumatlara əsasən müəyyən edilmişdir ki, {to} və {from} arasındakı ziyarət rejimi son bir ildə bərabər tətbiq olunmamışdır. Məsələnin təkrar araşdırılması məqsədəuyğun hesab edilir.',
  powers: 'Ziyarətlərin sayı bərabər bölünməyib.\nBir ailəyə ziyarətlər üstünlük təşkil edib.\nMarşrut yol vaxtını nəzərə almır.\nRejimin yenidən qurulması tövsiyə olunur.',
  penalty: 'Təkrar araşdırma nəticəsində yeni cədvəl razılaşdırılmazsa, növbəlilik növbəti bayramda tərsinə başlayır.',
  titleOptions: [
    'Ziyarət Rejiminin Təkrar Araşdırılması və Yenidən Qurulmasına dair Rəy',
    'Bayram Növbəliliyinin Bərabərliyinin Qiymətləndirilməsinə dair Rəy',
    'Ziyarət Müddətlərinin Yenidən Müəyyən Edilməsinə dair Rəy',
    'Marşrutun Optimallaşdırılması İmkanlarına dair Ekspert Rəyi'
  ],
  powersOptions: [
    'Ziyarətlərin sayı bərabər bölünməyib.',
    'Bir ailəyə ziyarətlər üstünlük təşkil edib.',
    'Marşrut yol vaxtını nəzərə almır.',
    'Rejimin yenidən qurulması tövsiyə olunur.',
    'Gecələmə variantı ayrıca planlaşdırılır.',
    'Uzaq qohumlar cədvələ daxil edilir.',
    'Yol xərclərinin bölgüsü dəqiqləşdirilir.',
    'Bayram günlərinin sayı yenidən hesablanır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Təkrar araşdırma nəticəsində yeni cədvəl razılaşdırılmazsa, növbəlilik növbəti bayramda tərsinə başlayır.',
    'Rəy hər bayram dövründən sonra yenilənir.',
    'Yeni cədvəl hər iki ailənin razılığı ilə təsdiqlənir.'
  ]
},
{
  id: 'r-tekrar-student', cat: 'c-tekrar', tone: 'zarafat', layout: 'ekspertiza', palette: 'forest',
  replyKind: 'tekrar', replyCats: ['student'], regPrefix: 'TKR',
  title: 'Akademik Borcun Bağlanması İmkanlarının Təkrar Qiymətləndirilməsi Rəyi', tag: 'Tələbə',
  signOrg: 'Tələbə Bəhanələrinin Araşdırılması üzrə Komissiya',
  powersLabel: 'TƏKRAR BAXIŞIN ŞƏRTLƏRİ',
  preamble: 'Müvafiq hallar nəzərə alınaraq müəyyən edilmişdir ki, {to} adlı şəxsin akademik borcu qalan müddət ərzində bağlana bilər. Rəy {from} tərəfindən verilmiş müraciət və konsultasiya qeydləri əsasında tərtib olunmuşdur.',
  powers: 'Borcun bağlanması üçün vaxt kifayətdir.\nZəif mövzuların siyahısı müəyyən edilib.\nHazırlıq planı iki həftəyə hesablanıb.\nTəkrar imtahan tarixi təklif olunur.',
  penalty: 'Hazırlıq planına əməl edilmədikdə rəy qüvvədən düşür və fənn növbəti semestrə keçirilir.',
  titleOptions: [
    'Akademik Borcun Bağlanması İmkanlarının Təkrar Qiymətləndirilməsi Rəyi',
    'Konspekt Borcunun Vəziyyətinin Yenidən Araşdırılmasına dair Rəy',
    'Təhvil Müddətinin Yenidən Hesablanmasına dair Ekspert Rəyi',
    'Təkrar İmtahan İmkanlarının Qiymətləndirilməsinə dair Rəy'
  ],
  powersOptions: [
    'Borcun bağlanması üçün vaxt kifayətdir.',
    'Zəif mövzuların siyahısı müəyyən edilib.',
    'Hazırlıq planı iki həftəyə hesablanıb.',
    'Təkrar imtahan tarixi təklif olunur.',
    'Konsultasiya saatlarından istifadə tövsiyə edilir.',
    'Qrup yoldaşlarının köməyi nəzərdə tutulur.',
    'Digər fənlərə təsir minimaldır.',
    'Davamiyyət göstəricisi bərpa oluna bilər.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Hazırlıq planına əməl edilmədikdə rəy qüvvədən düşür və fənn növbəti semestrə keçirilir.',
    'Rəy yalnız cari semestrə aiddir.',
    'Nəticələr hər iki həftədən bir yoxlanılır.'
  ]
},
{
  id: 'r-tekrar-neighbors', cat: 'c-tekrar', tone: 'zarafat', layout: 'ekspertiza', palette: 'forest',
  replyKind: 'tekrar', replyCats: ['neighbors'], regPrefix: 'TKR',
  title: 'Həyət Nizamı üzrə Qəbul Edilmiş Qaydaların Təkrar Baxışına dair Rəy', tag: 'Qonşuluq',
  signOrg: 'Həyətdaxili Nizamın Qorunması üzrə Baş İdarə',
  powersLabel: 'TƏKRAR BAXIŞIN ŞƏRTLƏRİ',
  preamble: 'Daxil olmuş müraciətlərə baxılaraq müəyyən edilmişdir ki, {to} və {from} arasında mübahisə doğuran həyət qaydaları sakinlərin sayındakı dəyişikliyi əks etdirmir. Qaydaların təkrar baxışı zəruri hesab olunur.',
  powers: 'Qaydalar sakinlərin sayındakı dəyişikliyi əks etdirmir.\nPark yerlərinin bölgüsü yenidən aparılmalıdır.\nTəmizlik növbəsi bəzi mənzilləri əhatə etmir.\nQaydaların yeni redaksiyası tövsiyə olunur.',
  penalty: 'Təkrar baxış nəticəsində yeni qaydalar qəbul edilməzsə, mövcud nizam dəyişdirilmədən qüvvədə qalır.',
  titleOptions: [
    'Həyət Nizamı üzrə Qəbul Edilmiş Qaydaların Təkrar Baxışına dair Rəy',
    'Park Yerlərinin Bölgüsünün Yenidən Araşdırılmasına dair Rəy',
    'Təmizlik Növbəsinin Bərabərliyinin Qiymətləndirilməsinə dair Rəy',
    'Səs Rejiminin Aktuallığının Təkrar Yoxlanılmasına dair Rəy'
  ],
  powersOptions: [
    'Qaydalar sakinlərin sayındakı dəyişikliyi əks etdirmir.',
    'Park yerlərinin bölgüsü yenidən aparılmalıdır.',
    'Təmizlik növbəsi bəzi mənzilləri əhatə etmir.',
    'Qaydaların yeni redaksiyası tövsiyə olunur.',
    'Yaşlı sakinlər üçün güzəşt nəzərdə tutulur.',
    'Ümumi vəsaitin hesabatı tələb edilir.',
    'Elan lövhəsinin yenilənməsi təklif olunur.',
    'Səsvermə qaydası dəqiqləşdirilir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Təkrar baxış nəticəsində yeni qaydalar qəbul edilməzsə, mövcud nizam dəyişdirilmədən qüvvədə qalır.',
    'Rəy növbəti ümumi yığıncağadək qüvvədədir.',
    'Qaydalar hər il yenidən nəzərdən keçirilir.'
  ]
},
{
  id: 'r-tekrar-holiday', cat: 'c-tekrar', tone: 'zarafat', layout: 'ekspertiza', palette: 'forest',
  replyKind: 'tekrar', replyCats: ['holiday'], regPrefix: 'TKR',
  title: 'Mərasim Öhdəliklərinin Bölgüsünün Təkrar Qiymətləndirilməsinə dair Rəy', tag: 'Toy',
  signOrg: 'Toy Davranışlarına Nəzarət üzrə Baş İdarə',
  powersLabel: 'TƏKRAR BAXIŞIN ŞƏRTLƏRİ',
  preamble: 'Tərəflərin mövqeyi nəzərə alınmaqla müəyyən edilmişdir ki, {to} və {from} arasında mərasim öhdəliklərinin bölgüsü qonaqların faktiki sayına uyğun gəlmir. Bölgünün təkrar qiymətləndirilməsi məqsədəuyğun hesab olunur.',
  powers: 'Öhdəliklərin bölgüsü qonaq sayına uyğun deyil.\nBüdcə hüdudları yenidən hesablanmalıdır.\nMasa nizamı dəyişdirilməlidir.\nYeni bölgünün razılaşdırılması tövsiyə olunur.',
  penalty: 'Təkrar qiymətləndirmə nəticəsində yeni bölgü razılaşdırılmazsa, mövcud öhdəliklər dəyişdirilmədən icra edilir.',
  titleOptions: [
    'Mərasim Öhdəliklərinin Bölgüsünün Təkrar Qiymətləndirilməsinə dair Rəy',
    'Qonaq Siyahısının Yenidən Tərtibi İmkanlarına dair Rəy',
    'Hədiyyə Büdcəsinin Yenidən Hesablanmasına dair Ekspert Rəyi',
    'Masa Bölgüsünün Təkrar Araşdırılmasına dair Yekun Rəy'
  ],
  powersOptions: [
    'Öhdəliklərin bölgüsü qonaq sayına uyğun deyil.',
    'Büdcə hüdudları yenidən hesablanmalıdır.',
    'Masa nizamı dəyişdirilməlidir.',
    'Yeni bölgünün razılaşdırılması tövsiyə olunur.',
    'Foto öhdəliyi ayrıca müzakirə edilir.',
    'Hədiyyə siyahısı yenidən tərtib olunur.',
    'Mərasim proqramı dəqiqləşdirilir.',
    'Ehtiyat yerlərin sayı artırılır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Təkrar qiymətləndirmə nəticəsində yeni bölgü razılaşdırılmazsa, mövcud öhdəliklər dəyişdirilmədən icra edilir.',
    'Rəy yalnız cari mərasimə aiddir.',
    'Bölgü hər iki tərəfin imzası ilə təsdiqlənir.'
  ]
},
{
  id: 'r-tekrar-travel', cat: 'c-tekrar', tone: 'zarafat', layout: 'ekspertiza', palette: 'forest',
  replyKind: 'tekrar', replyCats: ['travel'], regPrefix: 'TKR',
  title: 'Səfər Marşrutunun və Növbəliliyin Təkrar Araşdırılmasına dair Rəy', tag: 'Səfər',
  signOrg: 'Səfər və Marşrut Mübahisələri üzrə Ali Komissiya',
  powersLabel: 'ARAŞDIRMANIN ŞƏRTLƏRİ',
  preamble: 'Uzunmüddətli müşahidə nəticəsində müəyyən edilmişdir ki, {to} və {from} arasında razılaşdırılmış marşrut faktiki yol şəraitini əks etdirmir. Marşrutun və növbəliliyin təkrar araşdırılması tövsiyə olunur.',
  powers: 'Marşrut faktiki yol şəraitini əks etdirmir.\nDayanacaqların sayı artırılmalıdır.\nSürücülük növbəsi qeyri-bərabər bölünüb.\nYeni planın tərtibi tövsiyə olunur.',
  penalty: 'Təkrar araşdırma nəticəsində yeni plan razılaşdırılmazsa, səfər mövcud marşrut üzrə həyata keçirilir.',
  titleOptions: [
    'Səfər Marşrutunun və Növbəliliyin Təkrar Araşdırılmasına dair Rəy',
    'Dayanacaqların Sayının Yenidən Müəyyən Edilməsinə dair Rəy',
    'Sürücülük Növbəsinin Bərabərliyinin Qiymətləndirilməsinə dair Rəy',
    'Yol Xərclərinin Bölgüsünün Təkrar Baxışına dair Ekspert Rəyi'
  ],
  powersOptions: [
    'Marşrut faktiki yol şəraitini əks etdirmir.',
    'Dayanacaqların sayı artırılmalıdır.',
    'Sürücülük növbəsi qeyri-bərabər bölünüb.',
    'Yeni planın tərtibi tövsiyə olunur.',
    'Yanacaq xərcinin bölgüsü dəqiqləşdirilir.',
    'Yemək fasilələri plana salınır.',
    'Gecə sürüşü ayrıca müzakirə edilir.',
    'Gəlmə vaxtı yenidən hesablanır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Təkrar araşdırma nəticəsində yeni plan razılaşdırılmazsa, səfər mövcud marşrut üzrə həyata keçirilir.',
    'Rəy yalnız cari səfərə aiddir.',
    'Yeni plan hər iki tərəfin razılığı ilə təsdiqlənir.'
  ]
},
{
  id: 'r-tekrar-pets', cat: 'c-tekrar', tone: 'zarafat', layout: 'ekspertiza', palette: 'forest',
  replyKind: 'tekrar', replyCats: ['pets'], regPrefix: 'TKR',
  title: 'Ev Heyvanına Tətbiq Olunan Rejimin Təkrar Qiymətləndirilməsinə dair Rəy', tag: 'Ev heyvanı',
  signOrg: 'Ev Heyvanları Hüquqları üzrə Xüsusi Şura',
  powersLabel: 'TƏKRAR BAXIŞIN ŞƏRTLƏRİ',
  preamble: 'Aparılmış baytar müayinəsinin nəticələri nəzərə alınaraq müəyyən edilmişdir ki, {to} adlı şəxsə tətbiq olunan rejim cari sağlamlıq göstəricilərinə uyğun gəlmir. Rəy {from} tərəfindən verilmiş müraciət əsasında tərtib olunmuşdur.',
  powers: 'Rejim cari sağlamlıq göstəricilərinə uyğun deyil.\nGündəlik hərəkət həcmi artırılmalıdır.\nMükafat norması yenidən müəyyən edilir.\nYeni cədvəlin tərtibi tövsiyə olunur.',
  penalty: 'Təkrar qiymətləndirmənin tövsiyələrinə əməl edilmədikdə növbəti müayinədə əlavə tədbirlər zəruri hesab ediləcəkdir.',
  titleOptions: [
    'Ev Heyvanına Tətbiq Olunan Rejimin Təkrar Qiymətləndirilməsinə dair Rəy',
    'Yemləmə və Gəzinti Cədvəlinin Yenidən Baxışına dair Rəy',
    'Divan və Yataq Hüquqlarının Təkrar Araşdırılmasına dair Rəy',
    'Mükafat Normasının Yenidən Müəyyən Edilməsinə dair Ekspert Rəyi'
  ],
  powersOptions: [
    'Rejim cari sağlamlıq göstəricilərinə uyğun deyil.',
    'Gündəlik hərəkət həcmi artırılmalıdır.',
    'Mükafat norması yenidən müəyyən edilir.',
    'Yeni cədvəlin tərtibi tövsiyə olunur.',
    'Yem növü tədricən dəyişdirilir.',
    'Gəzinti müddəti uzadılır.',
    'Çəki nəzarəti gücləndirilir.',
    'Növbəti müayinə tarixi təyin edilir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Təkrar qiymətləndirmənin tövsiyələrinə əməl edilmədikdə növbəti müayinədə əlavə tədbirlər zəruri hesab ediləcəkdir.',
    'Rəy növbəti baytar müayinəsinədək qüvvədədir.',
    'Cədvəl hər mövsüm yenidən razılaşdırılır.'
  ]
},
{
  id: 'r-tekrar-gaming', cat: 'c-tekrar', tone: 'zarafat', layout: 'ekspertiza', palette: 'forest',
  replyKind: 'tekrar', replyCats: ['gaming'], regPrefix: 'TKR',
  title: 'Matçın Nəticəsinin və Şərtlərinin Təkrar Qiymətləndirilməsinə dair Rəy', tag: 'Oyun',
  signOrg: 'Virtual Futbol Bəhanələri üzrə Ali Komissiya',
  powersLabel: 'TƏKRAR OYUNUN ŞƏRTLƏRİ',
  preamble: 'Məsələyə dair aparılmış təkrar araşdırma nəticəsində müəyyən edilmişdir ki, {to} və {from} arasında keçirilmiş matçda şərtlər hər iki tərəf üçün eyni olmamışdır. Təkrar matçın keçirilməsi məqsədəuyğun hesab olunur.',
  powers: 'Matçın şərtləri hər iki tərəf üçün eyni olmayıb.\nXəritə seçimi birtərəfli aparılıb.\nTexniki fasilə qeydə alınıb.\nTəkrar matçın keçirilməsi tövsiyə olunur.',
  penalty: 'Təkrar matç keçirilmədikdə əvvəlki nəticə qəti qüvvəyə minir və mövzu üzrə yeni müraciətlərə baxılmır.',
  titleOptions: [
    'Matçın Nəticəsinin və Şərtlərinin Təkrar Qiymətləndirilməsinə dair Rəy',
    'Təkrar Matçın Keçirilməsi Zərurətinə dair Ekspert Rəyi',
    'Bağlantı Göstəricilərinin Yenidən Araşdırılmasına dair Rəy',
    'Komanda Tərkibinin Təsirinin Qiymətləndirilməsinə dair Rəy'
  ],
  powersOptions: [
    'Matçın şərtləri hər iki tərəf üçün eyni olmayıb.',
    'Xəritə seçimi birtərəfli aparılıb.',
    'Texniki fasilə qeydə alınıb.',
    'Təkrar matçın keçirilməsi tövsiyə olunur.',
    'Bağlantı jurnalı araşdırmaya daxil edilib.',
    'Komanda tərkibi matç ərzində dəyişib.',
    'Reytinq düzəlişi təxirə salınıb.',
    'Yeni matçın tarixi razılaşdırılır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Təkrar matç keçirilmədikdə əvvəlki nəticə qəti qüvvəyə minir və mövzu üzrə yeni müraciətlərə baxılmır.',
    'Rəy yalnız bir təkrar matça əsas verir.',
    'Yeni matçın şərtləri birgə müəyyən edilir.'
  ]
},
{
  id: 'r-tekrar-viral', cat: 'c-tekrar', tone: 'zarafat', layout: 'ekspertiza', palette: 'forest',
  replyKind: 'tekrar', replyCats: ['viral'], regPrefix: 'TKR',
  title: 'Təkrar Ekspertizanın Təyin Edilməsi Zərurətinə dair Yekun Rəy', tag: 'Ekspertiza',
  signOrg: 'Bəhanələrin Ekspertizası üzrə Ali Komissiya',
  powersLabel: 'TƏKRAR EKSPERTİZANIN ŞƏRTLƏRİ',
  preamble: 'Təqdim edilmiş yeni materiallar nəzərdən keçirilərək müəyyən edilmişdir ki, {to} barəsində verilmiş ilkin rəy qısa müşahidə dövrünə əsaslanmışdır. {from} tərəfindən təkrar ekspertizanın təyin edilməsi tələbi əsaslı hesab olunur.',
  powers: 'İlkin rəy qısa müşahidə dövrünə əsaslanıb.\nNümunə sayı statistik həddə çatmayıb.\nXarici amillər qiymətləndirməyə daxil edilməyib.\nTəkrar ekspertizanın təyini tövsiyə olunur.',
  penalty: 'Təkrar ekspertiza keçirilmədikdə ilkin rəy qəti qüvvəyə minir və göstəricilər dəyişdirilmədən saxlanılır.',
  titleOptions: [
    'Təkrar Ekspertizanın Təyin Edilməsi Zərurətinə dair Yekun Rəy',
    'İlkin Rəyin Metodikasının Yenidən Yoxlanılmasına dair Rəy',
    'Müşahidə Müddətinin Uzadılması Zərurətinə dair Ekspert Rəyi',
    'Göstəricilərin Yenidən Ölçülməsinə dair Yekun Rəy'
  ],
  powersOptions: [
    'İlkin rəy qısa müşahidə dövrünə əsaslanıb.',
    'Nümunə sayı statistik həddə çatmayıb.',
    'Xarici amillər qiymətləndirməyə daxil edilməyib.',
    'Təkrar ekspertizanın təyini tövsiyə olunur.',
    'Müşahidə müddəti iki həftəyə uzadılır.',
    'Kontrol qrup müəyyən edilir.',
    'Göstəricilərin hesablanma qaydası açıqlanır.',
    'Müstəqil ekspert cəlb olunur.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Təkrar ekspertiza keçirilmədikdə ilkin rəy qəti qüvvəyə minir və göstəricilər dəyişdirilmədən saxlanılır.',
    'Rəy təkrar ekspertiza başa çatanadək qüvvədədir.',
    'Nəticələr hər iki tərəfə eyni gün çatdırılır.'
  ]
},
{
  id: 'r-tekrar-umumi', cat: 'c-tekrar', tone: 'zarafat', layout: 'ekspertiza', palette: 'forest',
  replyKind: 'tekrar', regPrefix: 'TKR',
  title: 'Sənədin Şərtlərinin Yenidən Baxılması Zərurətinə dair Yekun Rəy', tag: 'Universal',
  signOrg: 'Sənədlərə Etirazlar üzrə Ali Apellyasiya Şurası',
  powersLabel: 'TƏKRAR BAXIŞIN ŞƏRTLƏRİ',
  preamble: 'Mövcud vəziyyət qiymətləndirildikdən sonra müəyyən edilmişdir ki, {to} və {from} arasında qüvvədə olan sənəd tərtib olunduğu vaxtdan bəri dəyişmiş halları əks etdirmir. Şərtlərin yenidən baxılması məqsədəuyğun hesab olunur.',
  powers: 'Sənəd dəyişmiş halları əks etdirmir.\nBəzi bəndlər praktikada tətbiq olunmayıb.\nMüddət hüdudları dəqiqləşdirilməlidir.\nYeni redaksiyanın tərtibi tövsiyə olunur.',
  penalty: 'Təkrar baxış nəticəsində yeni sənəd tərtib edilməzsə, mövcud şərtlər dəyişdirilmədən qüvvədə qalır.',
  titleOptions: [
    'Sənədin Şərtlərinin Yenidən Baxılması Zərurətinə dair Yekun Rəy',
    'Sənədin Aktuallığının Təkrar Qiymətləndirilməsinə dair Rəy',
    'Şəraitin Dəyişməsinin Sənədə Təsirinə dair Ekspert Rəyi',
    'Sənədin Yeni Redaksiyada Tərtibi Zərurətinə dair Rəy'
  ],
  powersOptions: [
    'Sənəd dəyişmiş halları əks etdirmir.',
    'Bəzi bəndlər praktikada tətbiq olunmayıb.',
    'Müddət hüdudları dəqiqləşdirilməlidir.',
    'Yeni redaksiyanın tərtibi tövsiyə olunur.',
    'Cəza bəndinin mütənasibliyi yoxlanılır.',
    'Tərəflərin mövqeyi yenidən soruşulur.',
    'Əvvəlki razılaşmalar arxivə salınır.',
    'Yeni sənədin layihəsi hazırlanır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Təkrar baxış nəticəsində yeni sənəd tərtib edilməzsə, mövcud şərtlər dəyişdirilmədən qüvvədə qalır.',
    'Rəy yeni sənəd imzalananadək qüvvədədir.',
    'Yenidən baxış hər iki tərəfin iştirakı ilə aparılır.'
  ]
},

/* ==================== 🚫 LƏĞV ====================
   layout: teleqram · palette: steel · prefiks: LGV */
{
  id: 'r-legv-couples', cat: 'c-legv', tone: 'zarafat', layout: 'teleqram', palette: 'steel',
  replyKind: 'legv', replyCats: ['couples'], regPrefix: 'LGV',
  title: 'Verilmiş İcazənin Qüvvədən Düşməsi haqqında Təcili Xəbərdarlıq', tag: 'Ev diplomatiyası',
  signOrg: 'Cütlüklərarası Mübahisələrin Həlli üzrə Ali Şura',
  preamble: 'Sizə bildiririk ki, {to} adlı şəxsə verilmiş icazənin şərtləri pozulmuş və sənəd qüvvədən düşmüş hesab edilir. {from} tərəfindən qərar qəbul edilmiş, icazənin bərpası üçün yeni yazılı müraciət tələb olunur.',
  powers: 'İcazə qüvvədən düşmüş hesab edilir.\nŞərtlərin pozulma vaxtı qeydə alınıb.\nYeni icazə ən tezi bir həftədən sonra verilir.\nBərpa üçün yazılı müraciət tələb olunur.',
  penalty: 'Ləğv qərarına etiraz üç gün ərzində bildirilə bilər; etiraz baxılana qədər icazə bərpa edilmir.',
  titleOptions: [
    'Verilmiş İcazənin Qüvvədən Düşməsi haqqında Təcili Xəbərdarlıq',
    'Həftəsonu Səlahiyyətinin Dayandırılması haqqında Teleqram',
    'Sənədin Şərtlərinin Pozulması Səbəbindən Ləğvi haqqında Bildiriş',
    'İcazənin Müddətindən Əvvəl Dayandırılması haqqında Xəbərdarlıq'
  ],
  powersOptions: [
    'İcazə qüvvədən düşmüş hesab edilir.',
    'Şərtlərin pozulma vaxtı qeydə alınıb.',
    'Yeni icazə ən tezi bir həftədən sonra verilir.',
    'Bərpa üçün yazılı müraciət tələb olunur.',
    'Cavabsız zənglərin sayı əsas götürülüb.',
    'Qayıdış saatı bir saatdan artıq aşılıb.',
    'Əvvəlcədən xəbərdarlıq edilməyib.',
    'Sənədin surəti arxivə verilib.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Ləğv qərarına etiraz üç gün ərzində bildirilə bilər; etiraz baxılana qədər icazə bərpa edilmir.',
    'Bərpa yalnız yeni şərtlərin qəbulu ilə mümkündür.',
    'Ləğv qərarı imzalandığı andan qüvvəyə minir.'
  ]
},
{
  id: 'r-legv-friends', cat: 'c-legv', tone: 'zarafat', layout: 'teleqram', palette: 'steel',
  replyKind: 'legv', replyCats: ['friends'], regPrefix: 'LGV',
  title: 'Ödəniş Möhlətinin Qüvvədən Düşməsi haqqında Təcili Xəbərdarlıq', tag: 'Borc',
  signOrg: 'Dostlararası Mübahisələrin Həlli üzrə Ali Məclis',
  preamble: 'Bununla məlumat verilir ki, {to} adlı şəxsə verilmiş ödəniş möhləti razılaşdırılmış cədvəlin iki dəfə pozulması səbəbindən qüvvədən düşmüşdür. {from} tərəfindən borcun tam məbləğinin qaytarılması tələb olunur.',
  powers: 'Ödəniş möhləti qüvvədən düşür.\nBorcun tam məbləği tələb olunur.\nYeni möhlət müraciətinə baxılmır.\nÖdəniş tarixi yenidən müəyyən edilir.',
  penalty: 'Ödəniş yeddi gün ərzində həyata keçirilmədikdə məsələ ümumi dost qrupunun müzakirəsinə çıxarılır.',
  titleOptions: [
    'Ödəniş Möhlətinin Qüvvədən Düşməsi haqqında Təcili Xəbərdarlıq',
    'Borc üzrə Verilmiş Güzəştin Ləğvi haqqında Teleqram',
    'Möhlətin Müddətindən Əvvəl Dayandırılması haqqında Bildiriş',
    'Ödəniş Cədvəlinin Qüvvədən Düşməsi haqqında Xəbərdarlıq'
  ],
  powersOptions: [
    'Ödəniş möhləti qüvvədən düşür.',
    'Borcun tam məbləği tələb olunur.',
    'Yeni möhlət müraciətinə baxılmır.',
    'Ödəniş tarixi yenidən müəyyən edilir.',
    'Razılaşdırılmış cədvəl iki dəfə pozulub.',
    'Xatırlatmalar cavabsız qalıb.',
    'Qismən ödəniş qeydə alınıb.',
    'Yeni borc verilməsi dayandırılıb.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Ödəniş yeddi gün ərzində həyata keçirilmədikdə məsələ ümumi dost qrupunun müzakirəsinə çıxarılır.',
    'Ləğv qərarına etiraz ödəniş öhdəliyini dayandırmır.',
    'Möhlət yalnız tam ödənişdən sonra yenidən verilə bilər.'
  ]
},
{
  id: 'r-legv-work', cat: 'c-legv', tone: 'zarafat', layout: 'teleqram', palette: 'steel',
  replyKind: 'legv', replyCats: ['work'], regPrefix: 'LGV',
  title: 'Tapşırıq üzrə Verilmiş Müddət Uzadılmasının Ləğvi haqqında Xəbərdarlıq', tag: 'Ofis',
  signOrg: 'Ofisdaxili Münasibətlərin Tənzimlənməsi üzrə Komitə',
  preamble: 'Təcili qaydada bildirilir ki, {to} adlı şəxsə verilmiş müddət uzadılması aralıq nəticənin təqdim edilməməsi səbəbindən ləğv edilmişdir. {from} tərəfindən ilkin son tarixin bərpası barədə qərar qəbul olunmuşdur.',
  powers: 'Müddət uzadılması ləğv edilir.\nİlkin son tarix bərpa olunur.\nAralıq nəticə dərhal təqdim edilir.\nYeni uzadılma müraciətinə baxılmır.',
  penalty: 'Bərpa edilmiş müddət də pozulduqda tapşırıq tam olaraq başqa icraçıya verilir və nəticə protokolda göstərilir.',
  titleOptions: [
    'Tapşırıq üzrə Verilmiş Müddət Uzadılmasının Ləğvi haqqında Xəbərdarlıq',
    'İcra Müddətinin Bərpa Edilməsi haqqında Təcili Teleqram',
    'Güzəştli Rejimin Dayandırılması haqqında Rəsmi Bildiriş',
    'Tapşırığın Başqa İcraçıya Verilməsi haqqında Xəbərdarlıq'
  ],
  powersOptions: [
    'Müddət uzadılması ləğv edilir.',
    'İlkin son tarix bərpa olunur.',
    'Aralıq nəticə dərhal təqdim edilir.',
    'Yeni uzadılma müraciətinə baxılmır.',
    'Gündəlik hesabat rejimi tətbiq olunur.',
    'Məsələ toplantının gündəliyinə salınır.',
    'Tapşırıq başqa icraçıya verilə bilər.',
    'Əlaqədar şöbələr məlumatlandırılır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Bərpa edilmiş müddət də pozulduqda tapşırıq tam olaraq başqa icraçıya verilir və nəticə protokolda göstərilir.',
    'Ləğvə etiraz protokola daxil edilir, lakin müddəti dayandırmır.',
    'Uzadılma yalnız yeni əsaslar təqdim edildikdə bərpa olunur.'
  ]
},
{
  id: 'r-legv-family', cat: 'c-legv', tone: 'zarafat', layout: 'teleqram', palette: 'steel',
  replyKind: 'legv', replyCats: ['family'], regPrefix: 'LGV',
  title: 'Ev Qaydaları üzrə Verilmiş Güzəştin Ləğvi haqqında Bildiriş', tag: 'Ailə',
  signOrg: 'Evdaxili Münasibətlərin Tənzimlənməsi üzrə Ali Şura',
  preamble: 'Nəzərinizə çatdırılır ki, {to} adlı şəxsə verilmiş güzəşt öhdəliklərin yerinə yetirilməməsi səbəbindən ləğv edilmişdir. {from} tərəfindən əvvəlki rejimin bərpası barədə qərar qəbul olunmuşdur.',
  powers: 'Güzəşt ləğv edilir.\nƏvvəlki rejim bərpa olunur.\nEkran vaxtı limiti azaldılır.\nBərpa öhdəliklərin icrasından sonra mümkündür.',
  penalty: 'Güzəşt üç gün ardıcıl olaraq öhdəliklərin icrasından sonra yenidən verilə bilər.',
  titleOptions: [
    'Ev Qaydaları üzrə Verilmiş Güzəştin Ləğvi haqqında Bildiriş',
    'Ekran Vaxtı Güzəştinin Dayandırılması haqqında Teleqram',
    'Həftəsonu Rejiminin Qüvvədən Düşməsi haqqında Xəbərdarlıq',
    'Verilmiş İcazənin Müddətindən Əvvəl Ləğvi haqqında Bildiriş'
  ],
  powersOptions: [
    'Güzəşt ləğv edilir.',
    'Əvvəlki rejim bərpa olunur.',
    'Ekran vaxtı limiti azaldılır.',
    'Bərpa öhdəliklərin icrasından sonra mümkündür.',
    'Ev tapşırıqları vaxtında yerinə yetirilməyib.',
    'Dərs hazırlığı cədvəli pozulub.',
    'Xəbərdarlıq iki dəfə edilib.',
    'Ailə şurası məlumatlandırılıb.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Güzəşt üç gün ardıcıl olaraq öhdəliklərin icrasından sonra yenidən verilə bilər.',
    'Ləğvə etiraz ailə şurasında müzakirə edilir.',
    'Bərpa avtomatik həyata keçirilmir.'
  ]
},
{
  id: 'r-legv-relatives', cat: 'c-legv', tone: 'zarafat', layout: 'teleqram', palette: 'steel',
  replyKind: 'legv', replyCats: ['relatives'], regPrefix: 'LGV',
  title: 'Ziyarətin Təxirə Salınması Güzəştinin Ləğvi haqqında Bildiriş', tag: 'Qohumlar',
  signOrg: 'Qohumluq Münasibətləri üzrə Ali Nəzarət Şurası',
  preamble: 'Rəsmi qaydada xəbər verilir ki, {to} adlı şəxsə verilmiş ziyarət möhləti müddətin ikinci dəfə uzadılması səbəbindən ləğv edilmişdir. {from} tərəfindən ziyarətin cari bayram dövründə həyata keçirilməsi tələb olunur.',
  powers: 'Ziyarət möhləti ləğv edilir.\nZiyarət cari bayram dövründə həyata keçirilir.\nTarix bir həftə əvvəl təsdiqlənir.\nYeni möhlət verilmir.',
  penalty: 'Ziyarət yenidən təxirə salındıqda növbəti bayramda ilk ziyarətin ünvanı digər tərəf tərəfindən müəyyən edilir.',
  titleOptions: [
    'Ziyarətin Təxirə Salınması Güzəştinin Ləğvi haqqında Bildiriş',
    'Ziyarət Növbəsinin Bərpası haqqında Təcili Teleqram',
    'Verilmiş Möhlətin Qüvvədən Düşməsi haqqında Xəbərdarlıq',
    'Bayram Ziyarəti Öhdəliyinin Bərpası haqqında Bildiriş'
  ],
  powersOptions: [
    'Ziyarət möhləti ləğv edilir.',
    'Ziyarət cari bayram dövründə həyata keçirilir.',
    'Tarix bir həftə əvvəl təsdiqlənir.',
    'Yeni möhlət verilmir.',
    'Əvvəlki iki möhlət qeydə alınıb.',
    'Marşrut dəyişdirilmir.',
    'Hədiyyə öhdəliyi qüvvədə qalır.',
    'Hər iki ailə məlumatlandırılıb.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Ziyarət yenidən təxirə salındıqda növbəti bayramda ilk ziyarətin ünvanı digər tərəf tərəfindən müəyyən edilir.',
    'Ləğvə etiraz növbəliliyə təsir göstərmir.',
    'Möhlət yalnız fövqəladə hallarda bərpa olunur.'
  ]
},
{
  id: 'r-legv-student', cat: 'c-legv', tone: 'zarafat', layout: 'teleqram', palette: 'steel',
  replyKind: 'legv', replyCats: ['student'], regPrefix: 'LGV',
  title: 'Konspekt Borcu üzrə Verilmiş Möhlətin Ləğvi haqqında Bildiriş', tag: 'Tələbə',
  signOrg: 'Tələbə Bəhanələrinin Araşdırılması üzrə Komissiya',
  preamble: 'Daxil olmuş məlumata əsasən bildirilir ki, {to} adlı şəxsə verilmiş möhlət imtahan dövrünün yaxınlaşması səbəbindən ləğv edilmişdir. {from} tərəfindən materialın dərhal qaytarılması tələb olunur.',
  powers: 'Möhlət ləğv edilir.\nMaterial dərhal qaytarılır.\nYeni möhlət verilmir.\nQaytarılma faktı yazışma ilə təsdiqlənir.',
  penalty: 'Material qaytarılmadıqda növbəti semestrdə konspekt istifadəyə verilmir və müraciətə baxılmır.',
  titleOptions: [
    'Konspekt Borcu üzrə Verilmiş Möhlətin Ləğvi haqqında Bildiriş',
    'Təhvil Müddəti Güzəştinin Dayandırılması haqqında Teleqram',
    'Materialın Dərhal Qaytarılması Tələbi haqqında Xəbərdarlıq',
    'Verilmiş Möhlətin Qüvvədən Düşməsi haqqında Bildiriş'
  ],
  powersOptions: [
    'Möhlət ləğv edilir.',
    'Material dərhal qaytarılır.',
    'Yeni möhlət verilmir.',
    'Qaytarılma faktı yazışma ilə təsdiqlənir.',
    'İmtahan tarixi yaxınlaşıb.',
    'Materialın surəti çıxarıla bilər.',
    'Çatışmayan mövzular ayrıca qeyd olunub.',
    'Növbəti semestrdə material verilmir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Material qaytarılmadıqda növbəti semestrdə konspekt istifadəyə verilmir və müraciətə baxılmır.',
    'Ləğvə etiraz qaytarılma öhdəliyini dayandırmır.',
    'Möhlət yalnız imtahandan sonra yenidən verilə bilər.'
  ]
},
{
  id: 'r-legv-neighbors', cat: 'c-legv', tone: 'zarafat', layout: 'teleqram', palette: 'steel',
  replyKind: 'legv', replyCats: ['neighbors'], regPrefix: 'LGV',
  title: 'Həyətdə Verilmiş İcazənin Qüvvədən Düşməsi haqqında Bildiriş', tag: 'Qonşuluq',
  signOrg: 'Həyətdaxili Nizamın Qorunması üzrə Baş İdarə',
  preamble: 'Diqqətinizə çatdırırıq ki, {to} adlı şəxsə verilmiş icazə sakinlərdən daxil olmuş müraciətlər əsasında ləğv edilmişdir. {from} tərəfindən vəziyyətin üç gün ərzində bərpası tələb olunur.',
  powers: 'İcazə qüvvədən düşür.\nİşlər dərhal dayandırılır.\nVəziyyət üç gün ərzində bərpa edilir.\nYeni icazə ümumi razılıqla verilir.',
  penalty: 'Vəziyyət bərpa edilmədikdə məsələ bina sakinlərinin ümumi yığıncağının gündəliyinə salınır.',
  titleOptions: [
    'Həyətdə Verilmiş İcazənin Qüvvədən Düşməsi haqqında Bildiriş',
    'Təmir İşləri İcazəsinin Ləğvi haqqında Təcili Teleqram',
    'Park Yeri Səlahiyyətinin Dayandırılması haqqında Xəbərdarlıq',
    'Verilmiş Güzəştin Müddətindən Əvvəl Ləğvi haqqında Bildiriş'
  ],
  powersOptions: [
    'İcazə qüvvədən düşür.',
    'İşlər dərhal dayandırılır.',
    'Vəziyyət üç gün ərzində bərpa edilir.',
    'Yeni icazə ümumi razılıqla verilir.',
    'Sakinlərin müraciətləri protokola əlavə edilib.',
    'Pozuntu vaxtı dəqiqləşdirilib.',
    'Elan lövhəsində məlumat yerləşdirilib.',
    'Ümumi yığıncaq məlumatlandırılıb.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Vəziyyət bərpa edilmədikdə məsələ bina sakinlərinin ümumi yığıncağının gündəliyinə salınır.',
    'Ləğvə etiraz üç gün ərzində bildirilə bilər.',
    'İcazə yalnız yeni şərtlərlə bərpa olunur.'
  ]
},
{
  id: 'r-legv-holiday', cat: 'c-legv', tone: 'zarafat', layout: 'teleqram', palette: 'steel',
  replyKind: 'legv', replyCats: ['holiday'], regPrefix: 'LGV',
  title: 'Mərasimlə Bağlı Verilmiş İcazənin Ləğvi haqqında Bildiriş', tag: 'Toy',
  signOrg: 'Toy Davranışlarına Nəzarət üzrə Baş İdarə',
  preamble: 'Bununla xəbər verilir ki, {to} adlı şəxsə verilmiş icazə mərasimin proqramında baş vermiş dəyişiklik səbəbindən ləğv edilmişdir. {from} tərəfindən yeni şərtlərin mərasimdən əvvəl qəbulu tələb olunur.',
  powers: 'İcazə ləğv edilir.\nAilə rəqsində iştirak öhdəliyi bərpa olunur.\nYeni şərtlər mərasimdən əvvəl bildirilir.\nGüzəşt yenidən verilmir.',
  penalty: 'Yeni şərtlər qəbul edilmədikdə mərasimdə iştirak qaydası tam olaraq təşkilatçılar tərəfindən müəyyən edilir.',
  titleOptions: [
    'Mərasimlə Bağlı Verilmiş İcazənin Ləğvi haqqında Bildiriş',
    'Rəqsdən Azad Edilmə İcazəsinin Dayandırılması haqqında Teleqram',
    'Öhdəlikdən Azad Edilmənin Qüvvədən Düşməsi haqqında Xəbərdarlıq',
    'Mərasim Güzəştinin Ləğvi haqqında Rəsmi Bildiriş'
  ],
  powersOptions: [
    'İcazə ləğv edilir.',
    'Ailə rəqsində iştirak öhdəliyi bərpa olunur.',
    'Yeni şərtlər mərasimdən əvvəl bildirilir.',
    'Güzəşt yenidən verilmir.',
    'Mərasim proqramı dəyişdirilib.',
    'Qonaq sayı artıb.',
    'Masa nizamı yenidən qurulub.',
    'Foto öhdəliyi ayrıca müəyyən edilib.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Yeni şərtlər qəbul edilmədikdə mərasimdə iştirak qaydası tam olaraq təşkilatçılar tərəfindən müəyyən edilir.',
    'Ləğvə etiraz mərasim günü baxılmır.',
    'İcazə yalnız növbəti mərasim üçün bərpa oluna bilər.'
  ]
},
{
  id: 'r-legv-travel', cat: 'c-legv', tone: 'zarafat', layout: 'teleqram', palette: 'steel',
  replyKind: 'legv', replyCats: ['travel'], regPrefix: 'LGV',
  title: 'Marşrut üzrə Verilmiş Səlahiyyətin Ləğvi haqqında Bildiriş', tag: 'Səfər',
  signOrg: 'Səfər və Marşrut Mübahisələri üzrə Ali Komissiya',
  preamble: 'Təcili məlumat verilir ki, {to} adlı şəxsə verilmiş marşrut səlahiyyəti yolun əsassız uzadılması səbəbindən ləğv edilmişdir. {from} tərəfindən səlahiyyətin digər tərəfə keçməsi barədə qərar qəbul olunmuşdur.',
  powers: 'Marşrut səlahiyyəti ləğv edilir.\nSəlahiyyət digər tərəfə keçir.\nMarşrut naviqasiya üzrə müəyyən edilir.\nDayanacaqlar plan üzrə saxlanılır.',
  penalty: 'Səlahiyyət növbəti səfərdə, yalnız naviqasiyanın göstərişlərinə tam əməl edilməsi şərti ilə bərpa olunur.',
  titleOptions: [
    'Marşrut üzrə Verilmiş Səlahiyyətin Ləğvi haqqında Bildiriş',
    'Naviqasiya Səlahiyyətinin Dayandırılması haqqında Teleqram',
    'Sürücülük Növbəsinin Yenidən Bölüşdürülməsi haqqında Xəbərdarlıq',
    'Səfər Planının Qüvvədən Düşməsi haqqında Bildiriş'
  ],
  powersOptions: [
    'Marşrut səlahiyyəti ləğv edilir.',
    'Səlahiyyət digər tərəfə keçir.',
    'Marşrut naviqasiya üzrə müəyyən edilir.',
    'Dayanacaqlar plan üzrə saxlanılır.',
    'Yolun uzanma müddəti qeydə alınıb.',
    'Alternativ yol real üstünlük verməyib.',
    'Yanacaq sərfiyyatı artıb.',
    'Gəlmə vaxtı pozulub.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Səlahiyyət növbəti səfərdə, yalnız naviqasiyanın göstərişlərinə tam əməl edilməsi şərti ilə bərpa olunur.',
    'Ləğvə etiraz cari səfərdə baxılmır.',
    'Səlahiyyət qayıdış yolunda bərpa edilmir.'
  ]
},
{
  id: 'r-legv-pets', cat: 'c-legv', tone: 'zarafat', layout: 'teleqram', palette: 'steel',
  replyKind: 'legv', replyCats: ['pets'], regPrefix: 'LGV',
  title: 'Ev Heyvanına Verilmiş Güzəştin Qüvvədən Düşməsi haqqında Bildiriş', tag: 'Ev heyvanı',
  signOrg: 'Ev Heyvanları Hüquqları üzrə Xüsusi Şura',
  preamble: 'Məlumat üçün bildirilir ki, {to} adlı şəxsə verilmiş güzəşt şərtlərin pozulması səbəbindən qüvvədən düşmüşdür. {from} tərəfindən əvvəlki qaydaların tam həcmdə bərpası barədə qərar qəbul olunmuşdur.',
  powers: 'Güzəşt qüvvədən düşür.\nƏvvəlki qaydalar bərpa edilir.\nİstisna zonalar genişləndirilir.\nBərpa baytar rəyindən sonra mümkündür.',
  penalty: 'Güzəşt növbəti baytar müayinəsinin nəticələri müsbət olduqda yenidən verilə bilər.',
  titleOptions: [
    'Ev Heyvanına Verilmiş Güzəştin Qüvvədən Düşməsi haqqında Bildiriş',
    'Divan Hüququnun Müvəqqəti Dayandırılması haqqında Teleqram',
    'Mükafat Normasının Ləğvi haqqında Rəsmi Xəbərdarlıq',
    'Yataq Sahəsi İcazəsinin Dayandırılması haqqında Bildiriş'
  ],
  powersOptions: [
    'Güzəşt qüvvədən düşür.',
    'Əvvəlki qaydalar bərpa edilir.',
    'İstisna zonalar genişləndirilir.',
    'Bərpa baytar rəyindən sonra mümkündür.',
    'Zədələnmə halı qeydə alınıb.',
    'Xəbərdarlıq iki dəfə edilib.',
    'Gəzinti cədvəli dəyişdirilib.',
    'Çəki nəzarəti gücləndirilib.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Güzəşt növbəti baytar müayinəsinin nəticələri müsbət olduqda yenidən verilə bilər.',
    'Ləğvə etiraz qaydaların bərpasını dayandırmır.',
    'Bərpa avtomatik həyata keçirilmir.'
  ]
},
{
  id: 'r-legv-gaming', cat: 'c-legv', tone: 'zarafat', layout: 'teleqram', palette: 'steel',
  replyKind: 'legv', replyCats: ['gaming'], regPrefix: 'LGV',
  title: 'Matç Nəticəsinin Qüvvədən Düşməsi haqqında Təcili Xəbərdarlıq', tag: 'Oyun',
  signOrg: 'Virtual Futbol Bəhanələri üzrə Ali Komissiya',
  preamble: 'Xəbərdarlıq qaydasında bildirilir ki, {to} adlı şəxsin xeyrinə qeydə alınmış matç nəticəsi şərtlərin pozulması səbəbindən qüvvədən düşmüşdür. {from} tərəfindən matçın etibarsız sayılması barədə qərar qəbul olunmuşdur.',
  powers: 'Matç nəticəsi qüvvədən düşür.\nReytinq düzəlişi geri alınır.\nMatç etibarsız sayılır.\nTəkrar matç razılaşdırılır.',
  penalty: 'Təkrar matç yeddi gün ərzində keçirilmədikdə nəticə bərabərlik kimi qeydə alınır.',
  titleOptions: [
    'Matç Nəticəsinin Qüvvədən Düşməsi haqqında Təcili Xəbərdarlıq',
    'Qeydə Alınmış Qələbənin Ləğvi haqqında Teleqram',
    'Reytinq Düzəlişinin Geri Alınması haqqında Xəbərdarlıq',
    'Matçın Etibarsız Sayılması haqqında Rəsmi Bildiriş'
  ],
  powersOptions: [
    'Matç nəticəsi qüvvədən düşür.',
    'Reytinq düzəlişi geri alınır.',
    'Matç etibarsız sayılır.',
    'Təkrar matç razılaşdırılır.',
    'Şərtlərin pozulma anı qeydə alınıb.',
    'Komanda tərkibi matç ərzində dəyişib.',
    'Xəritə seçimi razılaşdırılmayıb.',
    'Şahid oyunçular məlumatlandırılıb.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Təkrar matç yeddi gün ərzində keçirilmədikdə nəticə bərabərlik kimi qeydə alınır.',
    'Ləğvə etiraz reytinqi bərpa etmir.',
    'Yeni matçın şərtləri birgə müəyyən edilir.'
  ]
},
{
  id: 'r-legv-viral', cat: 'c-legv', tone: 'zarafat', layout: 'teleqram', palette: 'steel',
  replyKind: 'legv', replyCats: ['viral'], regPrefix: 'LGV',
  title: 'Verilmiş Sənədin Şərtlərinin Pozulması Səbəbindən Ləğvi haqqında Bildiriş', tag: 'Ekspertiza',
  signOrg: 'Bəhanələrin Ekspertizası üzrə Ali Komissiya',
  preamble: 'İşbu teleqramla bildirilir ki, {to} adlı şəxsə verilmiş sənədin şərtləri pozulmuş və sənəd müddətindən əvvəl qüvvədən düşmüşdür. {from} tərəfindən yeni müraciətin ayrıca qaydada verilməsi tələb olunur.',
  powers: 'Sənəd müddətindən əvvəl qüvvədən düşür.\nPozuntunun vaxtı qeydə alınıb.\nYeni sənəd ayrıca müraciətlə verilir.\nBərpa avtomatik həyata keçirilmir.',
  penalty: 'Yeni müraciət ən tezi yeddi gündən sonra, əvvəlki pozuntunun izahı təqdim edildikdən sonra qəbul edilir.',
  titleOptions: [
    'Verilmiş Sənədin Şərtlərinin Pozulması Səbəbindən Ləğvi haqqında Bildiriş',
    'Vizanın Müddətindən Əvvəl Qüvvədən Düşməsi haqqında Teleqram',
    'Toxunulmazlıq Müddətinin Dayandırılması haqqında Xəbərdarlıq',
    'Ekspertiza Rəyinin Etibarsız Sayılması haqqında Bildiriş'
  ],
  powersOptions: [
    'Sənəd müddətindən əvvəl qüvvədən düşür.',
    'Pozuntunun vaxtı qeydə alınıb.',
    'Yeni sənəd ayrıca müraciətlə verilir.',
    'Bərpa avtomatik həyata keçirilmir.',
    'Sosial şəbəkədə paylaşım aşkarlanıb.',
    'Şərtlərdən biri açıq şəkildə pozulub.',
    'Xəbərdarlıq əvvəlcədən edilib.',
    'Sənədin surəti arxivə verilib.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Yeni müraciət ən tezi yeddi gündən sonra, əvvəlki pozuntunun izahı təqdim edildikdən sonra qəbul edilir.',
    'Ləğvə etiraz üç gün ərzində bildirilə bilər.',
    'Sənəd yalnız yeni şərtlərlə bərpa olunur.'
  ]
},
{
  id: 'r-legv-umumi', cat: 'c-legv', tone: 'zarafat', layout: 'teleqram', palette: 'steel',
  replyKind: 'legv', regPrefix: 'LGV',
  title: 'Verilmiş Sənədin Qüvvədən Düşməsi haqqında Rəsmi Xəbərdarlıq', tag: 'Universal',
  signOrg: 'Sənədlərə Etirazlar üzrə Ali Apellyasiya Şurası',
  preamble: 'Bildirişlə məlumat verilir ki, {to} adlı şəxsə verilmiş sənəd şərtlərin pozulması səbəbindən qüvvədən düşmüş hesab edilir. {from} tərəfindən sənədin hüquqi nəticə doğurmaması barədə qərar qəbul olunmuşdur.',
  powers: 'Sənəd qüvvədən düşmüş hesab edilir.\nOnun əsasında irəli sürülən tələblər dayandırılır.\nYeni sənəd ayrıca razılaşdırılır.\nQərar imzalandığı andan qüvvəyə minir.',
  penalty: 'Ləğv qərarına etiraz üç gün ərzində bildirilə bilər; etiraz baxılana qədər sənəd bərpa edilmir.',
  titleOptions: [
    'Verilmiş Sənədin Qüvvədən Düşməsi haqqında Rəsmi Xəbərdarlıq',
    'Sənədin Müddətindən Əvvəl Ləğv Edilməsi haqqında Təcili Teleqram',
    'Verilmiş Səlahiyyətin Dayandırılması haqqında Rəsmi Bildiriş',
    'Sənədin Hüquqi Nəticə Doğurmaması haqqında Xəbərdarlıq'
  ],
  powersOptions: [
    'Sənəd qüvvədən düşmüş hesab edilir.',
    'Onun əsasında irəli sürülən tələblər dayandırılır.',
    'Yeni sənəd ayrıca razılaşdırılır.',
    'Qərar imzalandığı andan qüvvəyə minir.',
    'Pozuntunun vaxtı və məzmunu qeydə alınıb.',
    'Xəbərdarlıq əvvəlcədən edilib.',
    'Sənədin surəti arxivə verilib.',
    'Hər iki tərəf məlumatlandırılıb.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Ləğv qərarına etiraz üç gün ərzində bildirilə bilər; etiraz baxılana qədər sənəd bərpa edilmir.',
    'Bərpa yalnız yeni razılaşma ilə mümkündür.',
    'Qərar hər iki tərəfə eyni gün çatdırılır.'
  ]
},

/* ==================== ✅ QÜVVƏDƏ SAXLAMA ====================
   layout: sertifikat · palette: gold · prefiks: QVD */
{
  id: 'r-qebul-couples', cat: 'c-qebul', tone: 'zarafat', layout: 'sertifikat', palette: 'gold',
  replyKind: 'qebul', replyCats: ['couples'], regPrefix: 'QVD',
  title: 'Verilmiş İcazənin Qüvvədə Saxlanılmasını Təsdiq edən Sertifikat', tag: 'Ev diplomatiyası',
  signOrg: 'Cütlüklərarası Mübahisələrin Həlli üzrə Ali Şura',
  powersLabel: 'TƏSDİQLƏNƏN ŞƏRTLƏR',
  preamble: 'Bununla təsdiq edilir ki, {to} adlı şəxsə verilmiş sənədin şərtləri {from} tərəfindən tam həcmdə qəbul edilmişdir. Sənəd üzrə heç bir etiraz daxil olmamış, şərtlər dəyişdirilmədən qüvvədə saxlanılmışdır.',
  powers: 'Sənədin şərtləri tam həcmdə qəbul edilir.\nHeç bir bəndə etiraz bildirilmir.\nSənəd müddəti bitənədək qüvvədə qalır.\nŞərtlər birtərəfli qaydada dəyişdirilmir.',
  penalty: 'Sertifikat verildikdən sonra sənədin şərtlərinə etiraz yalnız hər iki tərəfin razılığı ilə mümkündür.',
  titleOptions: [
    'Verilmiş İcazənin Qüvvədə Saxlanılmasını Təsdiq edən Sertifikat',
    'Sənədin Şərtlərinin Tam Qəbul Edilməsini Təsdiq edən Sertifikat',
    'Razılaşmanın Dəyişdirilmədən Qüvvədə Qalması Sertifikatı',
    'Tərəflərin Mövqelərinin Üst-üstə Düşməsinə dair Şəhadətnamə'
  ],
  powersOptions: [
    'Sənədin şərtləri tam həcmdə qəbul edilir.',
    'Heç bir bəndə etiraz bildirilmir.',
    'Sənəd müddəti bitənədək qüvvədə qalır.',
    'Şərtlər birtərəfli qaydada dəyişdirilmir.',
    'Cəza bəndi də qəbul edilmiş sayılır.',
    'Müddət uzadılması ayrıca razılaşdırılır.',
    'Sənədin surəti hər iki tərəfdə saxlanılır.',
    'Yeni hallar yarandıqda əlavə tərtib edilir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Sertifikat verildikdən sonra sənədin şərtlərinə etiraz yalnız hər iki tərəfin razılığı ilə mümkündür.',
    'Sertifikat sənədin müddəti ilə birlikdə qüvvədən düşür.',
    'Şərtlərin dəyişdirilməsi yeni sənəd tələb edir.'
  ]
},
{
  id: 'r-qebul-friends', cat: 'c-qebul', tone: 'zarafat', layout: 'sertifikat', palette: 'gold',
  replyKind: 'qebul', replyCats: ['friends'], regPrefix: 'QVD',
  title: 'Borc Öhdəliyinin Şərtlərinin Təsdiq Edilməsi haqqında Sertifikat', tag: 'Borc',
  signOrg: 'Dostlararası Mübahisələrin Həlli üzrə Ali Məclis',
  powersLabel: 'TƏSDİQLƏNƏN ŞƏRTLƏR',
  preamble: 'Təqdim edilmiş hesablama əsasında təsdiq olunur ki, {to} adlı şəxs borc öhdəliyini və ödəniş cədvəlini tam həcmdə tanıyır. {from} ilə razılaşma əldə edilmiş, məbləğ üzrə mübahisə qalmamışdır.',
  powers: 'Borcun məbləği mübahisəsiz tanınır.\nÖdəniş cədvəli qəbul edilir.\nFaiz tətbiq edilmir.\nÖdəniş razılaşdırılmış tarixdə həyata keçirilir.',
  penalty: 'Ödəniş cədvəlinə əməl edildiyi müddətdə borc üzrə heç bir əlavə tələb irəli sürülmür.',
  titleOptions: [
    'Borc Öhdəliyinin Şərtlərinin Təsdiq Edilməsi haqqında Sertifikat',
    'Ödəniş Cədvəlinin Qəbul Edilməsini Təsdiq edən Sertifikat',
    'Borcun Məbləğinin Tanınmasına dair Rəsmi Şəhadətnamə',
    'Öhdəliyin Mübahisəsiz Qəbulunu Təsdiq edən Sertifikat'
  ],
  powersOptions: [
    'Borcun məbləği mübahisəsiz tanınır.',
    'Ödəniş cədvəli qəbul edilir.',
    'Faiz tətbiq edilmir.',
    'Ödəniş razılaşdırılmış tarixdə həyata keçirilir.',
    'Hissə-hissə ödəniş variantı saxlanılır.',
    'Qismən ödənişlər cədvəldə əks olunub.',
    'Xatırlatma qaydası dəyişdirilmir.',
    'Ödəniş qəbzləri saxlanılır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Ödəniş cədvəlinə əməl edildiyi müddətdə borc üzrə heç bir əlavə tələb irəli sürülmür.',
    'Sertifikat borc tam ödənilənədək qüvvədədir.',
    'Yeni möhlət ayrıca razılaşdırılır.'
  ]
},
{
  id: 'r-qebul-work', cat: 'c-qebul', tone: 'zarafat', layout: 'sertifikat', palette: 'gold',
  replyKind: 'qebul', replyCats: ['work'], regPrefix: 'QVD',
  title: 'Tapşırıq üzrə Qəbul Edilmiş Qərarın Təsdiqi haqqında Sertifikat', tag: 'Ofis',
  signOrg: 'Ofisdaxili Münasibətlərin Tənzimlənməsi üzrə Komitə',
  powersLabel: 'TƏSDİQLƏNƏN ŞƏRTLƏR',
  preamble: 'Bununla təsdiq olunur ki, {to} adlı şəxs tapşırıq üzrə qəbul edilmiş qərarı və icra müddətini şərtsiz qəbul edir. {from} tərəfindən müəyyən edilmiş şərtlərə etiraz bildirilməmişdir.',
  powers: 'Tapşırığın həcmi və müddəti qəbul edilir.\nAralıq nəticə cədvəl üzrə təqdim olunur.\nƏlavə resurs tələbi irəli sürülmür.\nNəticə son tarixədək təhvil verilir.',
  penalty: 'Şərtlərə əməl edildiyi müddətdə tapşırıq üzrə əlavə nəzarət tədbirləri tətbiq edilmir.',
  titleOptions: [
    'Tapşırıq üzrə Qəbul Edilmiş Qərarın Təsdiqi haqqında Sertifikat',
    'İcra Müddətinin Qəbul Edilməsini Təsdiq edən Sertifikat',
    'İş Bölgüsünün Razılaşdırıldığına dair Şəhadətnamə',
    'Tapşırığın Şərtsiz Qəbulunu Təsdiq edən Sertifikat'
  ],
  powersOptions: [
    'Tapşırığın həcmi və müddəti qəbul edilir.',
    'Aralıq nəticə cədvəl üzrə təqdim olunur.',
    'Əlavə resurs tələbi irəli sürülmür.',
    'Nəticə son tarixədək təhvil verilir.',
    'İcra planı yazılı formada razılaşdırılıb.',
    'Əlaqədar şöbələr məlumatlandırılıb.',
    'Gündəlik hesabat tələb olunmur.',
    'Toplantıda məsələ qapadılıb.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Şərtlərə əməl edildiyi müddətdə tapşırıq üzrə əlavə nəzarət tədbirləri tətbiq edilmir.',
    'Sertifikat tapşırıq təhvil verilənədək qüvvədədir.',
    'Müddət dəyişikliyi yeni razılaşma tələb edir.'
  ]
},
{
  id: 'r-qebul-family', cat: 'c-qebul', tone: 'zarafat', layout: 'sertifikat', palette: 'gold',
  replyKind: 'qebul', replyCats: ['family'], regPrefix: 'QVD',
  title: 'Ev Qaydalarının Qüvvədə Saxlanılmasını Təsdiq edən Sertifikat', tag: 'Ailə',
  signOrg: 'Evdaxili Münasibətlərin Tənzimlənməsi üzrə Ali Şura',
  powersLabel: 'TƏSDİQLƏNƏN ŞƏRTLƏR',
  preamble: 'Ailə şurasının qərarı ilə təsdiq olunur ki, {to} adlı şəxs qüvvədə olan ev qaydalarını və öhdəlikləri könüllü qaydada qəbul edir. {from} tərəfindən müəyyən edilmiş rejimə etiraz bildirilməmişdir.',
  powers: 'Ev qaydaları dəyişdirilmədən qəbul edilir.\nEkran vaxtı limiti tanınır.\nDərs hazırlığı cədvəli saxlanılır.\nYatma saatı rejimi qüvvədə qalır.',
  penalty: 'Qaydalara ardıcıl əməl edildikdə növbəti ailə şurasında güzəştlərin genişləndirilməsi müzakirə edilir.',
  titleOptions: [
    'Ev Qaydalarının Qüvvədə Saxlanılmasını Təsdiq edən Sertifikat',
    'Rejimin Dəyişdirilmədən Qəbul Edilməsi Sertifikatı',
    'Ailə Şurasının Qərarının Təsdiqinə dair Şəhadətnamə',
    'Öhdəliklərin Könüllü Qəbulunu Təsdiq edən Sertifikat'
  ],
  powersOptions: [
    'Ev qaydaları dəyişdirilmədən qəbul edilir.',
    'Ekran vaxtı limiti tanınır.',
    'Dərs hazırlığı cədvəli saxlanılır.',
    'Yatma saatı rejimi qüvvədə qalır.',
    'Həftəsonu güzəşti saxlanılır.',
    'Ev tapşırıqları cədvəl üzrə icra olunur.',
    'Cib xərcliyinin tarixi dəyişmir.',
    'Şurada məsələ qapadılıb.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Qaydalara ardıcıl əməl edildikdə növbəti ailə şurasında güzəştlərin genişləndirilməsi müzakirə edilir.',
    'Sertifikat tədris rübünün sonuna qədər qüvvədədir.',
    'Qaydaların dəyişdirilməsi şura qərarı tələb edir.'
  ]
},
{
  id: 'r-qebul-relatives', cat: 'c-qebul', tone: 'zarafat', layout: 'sertifikat', palette: 'gold',
  replyKind: 'qebul', replyCats: ['relatives'], regPrefix: 'QVD',
  title: 'Ziyarət Protokolunun Şərtlərinin Təsdiqi haqqında Sertifikat', tag: 'Qohumlar',
  signOrg: 'Qohumluq Münasibətləri üzrə Ali Nəzarət Şurası',
  powersLabel: 'TƏSDİQLƏNƏN ŞƏRTLƏR',
  preamble: 'Hər iki ailənin razılığı ilə təsdiq edilir ki, {to} adlı şəxs ziyarət protokolunun şərtlərini tam qəbul edir. {from} tərəfindən tərtib edilmiş növbəlilik və marşrut üzrə heç bir etiraz daxil olmamışdır.',
  powers: 'Ziyarət növbəliliyi qəbul edilir.\nMarşrut razılaşdırılmış formada saxlanılır.\nMüddət hüdudları tanınır.\nHədiyyə öhdəliyi qüvvədə qalır.',
  penalty: 'Protokola əməl edildiyi müddətdə növbəlilik dəyişdirilmir və əlavə ziyarət tələb olunmur.',
  titleOptions: [
    'Ziyarət Protokolunun Şərtlərinin Təsdiqi haqqında Sertifikat',
    'Ziyarət Növbəliliyinin Qəbul Edilməsi Sertifikatı',
    'Bayram Marşrutunun Razılaşdırıldığına dair Şəhadətnamə',
    'Protokolun Mübahisəsiz Qəbulunu Təsdiq edən Sertifikat'
  ],
  powersOptions: [
    'Ziyarət növbəliliyi qəbul edilir.',
    'Marşrut razılaşdırılmış formada saxlanılır.',
    'Müddət hüdudları tanınır.',
    'Hədiyyə öhdəliyi qüvvədə qalır.',
    'Gecələmə variantı planda saxlanılır.',
    'Yol xərcləri bərabər bölünür.',
    'Uzaq qohumlar cədvələ daxildir.',
    'Hər iki ailə məlumatlandırılıb.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Protokola əməl edildiyi müddətdə növbəlilik dəyişdirilmir və əlavə ziyarət tələb olunmur.',
    'Sertifikat bayram dövrü başa çatanadək qüvvədədir.',
    'Növbəlilik növbəti ildə yenidən razılaşdırılır.'
  ]
},
{
  id: 'r-qebul-student', cat: 'c-qebul', tone: 'zarafat', layout: 'sertifikat', palette: 'gold',
  replyKind: 'qebul', replyCats: ['student'], regPrefix: 'QVD',
  title: 'Təqdim Edilmiş İzahatın Əsaslı Sayılması haqqında Sertifikat', tag: 'Tələbə',
  signOrg: 'Tələbə Bəhanələrinin Araşdırılması üzrə Komissiya',
  powersLabel: 'TƏSDİQLƏNƏN ŞƏRTLƏR',
  preamble: 'Bu sənədlə təsdiq olunur ki, {to} adlı şəxsin təqdim etdiyi izahat əsaslı hesab edilir. {from} tərəfindən aparılmış yoxlama nəticəsində göstərilən səbəb sənədlə təsdiqlənmiş və jurnala müvafiq qeyd salınmışdır.',
  powers: 'Təqdim edilmiş izahat əsaslı hesab edilir.\nBuraxılmış saatlar üzrlü sayılır.\nDavamiyyət göstəricisi bərpa olunur.\nİmtahana buraxılış şərti pozulmur.',
  penalty: 'Sertifikat yalnız göstərilən tarixlərə şamil edilir; sonrakı buraxılışlar ayrıca əsaslandırma tələb edir.',
  titleOptions: [
    'Təqdim Edilmiş İzahatın Əsaslı Sayılması haqqında Sertifikat',
    'Buraxılmış Saatların Üzrlü Sayılması Sertifikatı',
    'Təhvil Müddətinin Qəbul Edilməsinə dair Şəhadətnamə',
    'İzahatın Sənədlə Təsdiqləndiyini Bildirən Sertifikat'
  ],
  powersOptions: [
    'Təqdim edilmiş izahat əsaslı hesab edilir.',
    'Buraxılmış saatlar üzrlü sayılır.',
    'Davamiyyət göstəricisi bərpa olunur.',
    'İmtahana buraxılış şərti pozulmur.',
    'Təsdiqedici sənəd jurnala əlavə edilib.',
    'Konspekt borcu ayrıca qeyd olunub.',
    'Qrup nümayəndəsi məlumatlandırılıb.',
    'Konsultasiya saatı təyin edilib.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Sertifikat yalnız göstərilən tarixlərə şamil edilir; sonrakı buraxılışlar ayrıca əsaslandırma tələb edir.',
    'Sertifikat cari semestrə aiddir.',
    'Yeni izahat ayrıca qaydada təqdim olunur.'
  ]
},
{
  id: 'r-qebul-neighbors', cat: 'c-qebul', tone: 'zarafat', layout: 'sertifikat', palette: 'gold',
  replyKind: 'qebul', replyCats: ['neighbors'], regPrefix: 'QVD',
  title: 'Həyət Yığıncağının Qərarının Təsdiqi haqqında Sertifikat', tag: 'Qonşuluq',
  signOrg: 'Həyətdaxili Nizamın Qorunması üzrə Baş İdarə',
  powersLabel: 'TƏSDİQLƏNƏN ŞƏRTLƏR',
  preamble: 'Sakinlərin mövqeyi nəzərə alınmaqla təsdiq edilir ki, {to} adlı şəxs həyət yığıncağının qərarını tam qəbul edir. {from} tərəfindən elan olunmuş qaydalar üzrə heç bir etiraz daxil olmamışdır.',
  powers: 'Yığıncağın qərarı tam qəbul edilir.\nSəs rejimi tanınır və pozulmur.\nTəmizlik növbəsi cədvəl üzrə icra olunur.\nPark yeri bölgüsü qüvvədə qalır.',
  penalty: 'Qaydalara əməl edildiyi müddətdə əlavə nəzarət tədbirləri tətbiq olunmur və məsələ yığıncağa çıxarılmır.',
  titleOptions: [
    'Həyət Yığıncağının Qərarının Təsdiqi haqqında Sertifikat',
    'Qaydaların Bütün Sakinlər Tərəfindən Qəbulu Sertifikatı',
    'Park Yeri Bölgüsünün Təsdiqinə dair Şəhadətnamə',
    'Səs Rejiminin Qəbul Edilməsini Təsdiq edən Sertifikat'
  ],
  powersOptions: [
    'Yığıncağın qərarı tam qəbul edilir.',
    'Səs rejimi tanınır və pozulmur.',
    'Təmizlik növbəsi cədvəl üzrə icra olunur.',
    'Park yeri bölgüsü qüvvədə qalır.',
    'Ümumi vəsait vaxtında ödənilir.',
    'Elan lövhəsindəki məlumat oxunub.',
    'Yaşlı sakinlərin güzəşti saxlanılır.',
    'Nasazlıq barədə məlumat verilir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Qaydalara əməl edildiyi müddətdə əlavə nəzarət tədbirləri tətbiq olunmur və məsələ yığıncağa çıxarılmır.',
    'Sertifikat növbəti ümumi yığıncağadək qüvvədədir.',
    'Qaydalar hər il yenidən təsdiqlənir.'
  ]
},
{
  id: 'r-qebul-holiday', cat: 'c-qebul', tone: 'zarafat', layout: 'sertifikat', palette: 'gold',
  replyKind: 'qebul', replyCats: ['holiday'], regPrefix: 'QVD',
  title: 'Mərasim Öhdəliklərinin Qəbul Edilməsi haqqında Sertifikat', tag: 'Toy',
  signOrg: 'Toy Davranışlarına Nəzarət üzrə Baş İdarə',
  powersLabel: 'TƏSDİQLƏNƏN ŞƏRTLƏR',
  preamble: 'İşbu sənədlə təsdiq olunur ki, {to} adlı şəxs mərasim öhdəliklərini, qonaq siyahısını və masa bölgüsünü tam qəbul edir. {from} tərəfindən müəyyən edilmiş bölgüyə etiraz bildirilməmişdir.',
  powers: 'Mərasim öhdəlikləri tam qəbul edilir.\nQonaq siyahısı təsdiqlənir.\nMasa nizamı dəyişdirilmir.\nHədiyyə büdcəsi razılaşdırılmış həcmdə saxlanılır.',
  penalty: 'Öhdəliklərə əməl edildiyi müddətdə bölgü dəyişdirilmir və əlavə tələb irəli sürülmür.',
  titleOptions: [
    'Mərasim Öhdəliklərinin Qəbul Edilməsi haqqında Sertifikat',
    'Qonaq Siyahısının Təsdiqinə dair Rəsmi Sertifikat',
    'Masa Bölgüsünün Qəbul Edilməsi Sertifikatı',
    'Mərasim Proqramının Razılaşdırıldığına dair Şəhadətnamə'
  ],
  powersOptions: [
    'Mərasim öhdəlikləri tam qəbul edilir.',
    'Qonaq siyahısı təsdiqlənir.',
    'Masa nizamı dəyişdirilmir.',
    'Hədiyyə büdcəsi razılaşdırılmış həcmdə saxlanılır.',
    'Foto öhdəliyi bölüşdürülüb.',
    'Mərasim proqramı təsdiqlənib.',
    'Ehtiyat yerlərin sayı müəyyən edilib.',
    'Dəvətnamələr eyni gün göndərilib.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Öhdəliklərə əməl edildiyi müddətdə bölgü dəyişdirilmir və əlavə tələb irəli sürülmür.',
    'Sertifikat mərasim başa çatanadək qüvvədədir.',
    'Dəyişikliklər hər iki tərəfin razılığı ilə edilir.'
  ]
},
{
  id: 'r-qebul-travel', cat: 'c-qebul', tone: 'zarafat', layout: 'sertifikat', palette: 'gold',
  replyKind: 'qebul', replyCats: ['travel'], regPrefix: 'QVD',
  title: 'Səfər Planının və Marşrutun Təsdiqi haqqında Sertifikat', tag: 'Səfər',
  signOrg: 'Səfər və Marşrut Mübahisələri üzrə Ali Komissiya',
  powersLabel: 'TƏSDİQLƏNƏN ŞƏRTLƏR',
  preamble: 'Səfər iştirakçılarının razılığı ilə təsdiq edilir ki, {to} adlı şəxs səfər planını, marşrutu və sürücülük növbəliliyini tam qəbul edir. {from} tərəfindən tərtib edilmiş plana etiraz bildirilməmişdir.',
  powers: 'Səfər planı və marşrut qəbul edilir.\nSürücülük növbəsi cədvəl üzrə icra olunur.\nYanacaq xərci bərabər bölünür.\nBaqaj kvotası tanınır.',
  penalty: 'Plana əməl edildiyi müddətdə marşrut dəyişdirilmir və əlavə dayanacaq tələb olunmur.',
  titleOptions: [
    'Səfər Planının və Marşrutun Təsdiqi haqqında Sertifikat',
    'Sürücülük Növbəsinin Qəbul Edilməsi Sertifikatı',
    'Yol Xərclərinin Bölgüsünün Təsdiqinə dair Şəhadətnamə',
    'Baqaj Kvotasının Razılaşdırıldığına dair Sertifikat'
  ],
  powersOptions: [
    'Səfər planı və marşrut qəbul edilir.',
    'Sürücülük növbəsi cədvəl üzrə icra olunur.',
    'Yanacaq xərci bərabər bölünür.',
    'Baqaj kvotası tanınır.',
    'Dayanacaqların yeri təsdiqlənib.',
    'Yemək fasilələri plana daxildir.',
    'Yola çıxma vaxtı razılaşdırılıb.',
    'Gəlmə vaxtı bildirilib.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Plana əməl edildiyi müddətdə marşrut dəyişdirilmir və əlavə dayanacaq tələb olunmur.',
    'Sertifikat cari səfərə aiddir.',
    'Qayıdış marşrutu ayrıca razılaşdırılır.'
  ]
},
{
  id: 'r-qebul-pets', cat: 'c-qebul', tone: 'zarafat', layout: 'sertifikat', palette: 'gold',
  replyKind: 'qebul', replyCats: ['pets'], regPrefix: 'QVD',
  title: 'Ev Heyvanına Tanınmış Hüquqların Təsdiqi haqqında Sertifikat', tag: 'Ev heyvanı',
  signOrg: 'Ev Heyvanları Hüquqları üzrə Xüsusi Şura',
  powersLabel: 'TƏSDİQLƏNƏN ŞƏRTLƏR',
  preamble: 'Baytar tövsiyələri nəzərə alınmaqla təsdiq olunur ki, {to} adlı şəxsə tanınmış hüquqlar {from} tərəfindən tam həcmdə qəbul edilir. Mövcud sərhədlərə və rejimə heç bir etiraz bildirilməmişdir.',
  powers: 'Tanınmış hüquqlar tam həcmdə qəbul edilir.\nDivan və yataq sahələri dəyişdirilmir.\nYemləmə rejimi saxlanılır.\nMükafat norması tanınır.',
  penalty: 'Rejimə əməl edildiyi müddətdə hüquqların həcmi azaldılmır və əlavə məhdudiyyət tətbiq olunmur.',
  titleOptions: [
    'Ev Heyvanına Tanınmış Hüquqların Təsdiqi haqqında Sertifikat',
    'Divan və Yataq Hüquqlarının Təsdiqinə dair Sertifikat',
    'Yemləmə Rejiminin Qəbul Edilməsi Sertifikatı',
    'Mükafat Normasının Təsdiqinə dair Şəhadətnamə'
  ],
  powersOptions: [
    'Tanınmış hüquqlar tam həcmdə qəbul edilir.',
    'Divan və yataq sahələri dəyişdirilmir.',
    'Yemləmə rejimi saxlanılır.',
    'Mükafat norması tanınır.',
    'Gəzinti cədvəli qüvvədə qalır.',
    'İstisna zonalar genişləndirilmir.',
    'Baytar tövsiyələri əsas götürülür.',
    'Oyuncaqların sayı saxlanılır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Rejimə əməl edildiyi müddətdə hüquqların həcmi azaldılmır və əlavə məhdudiyyət tətbiq olunmur.',
    'Sertifikat növbəti baytar müayinəsinədək qüvvədədir.',
    'Hüquqlar ailənin bütün üzvləri tərəfindən tanınır.'
  ]
},
{
  id: 'r-qebul-gaming', cat: 'c-qebul', tone: 'zarafat', layout: 'sertifikat', palette: 'gold',
  replyKind: 'qebul', replyCats: ['gaming'], regPrefix: 'QVD',
  title: 'Matçın Nəticəsinin Şərtsiz Qəbul Edilməsi haqqında Sertifikat', tag: 'Oyun',
  signOrg: 'Virtual Futbol Bəhanələri üzrə Ali Komissiya',
  powersLabel: 'TƏSDİQLƏNƏN ŞƏRTLƏR',
  preamble: 'Matç tarixçəsinə istinadən təsdiq edilir ki, {to} adlı şəxs nəticəni şərtsiz qəbul edir və heç bir texniki səbəbə istinad etmir. {from} tərəfindən göstərilən üstünlük tam və mübahisəsiz hesab olunur.',
  powers: 'Matçın nəticəsi şərtsiz qəbul edilir.\nTexniki səbəbə istinad edilmir.\nReytinq düzəlişi tələb olunmur.\nKomanda tərkibi bəhanə kimi göstərilmir.',
  penalty: 'Sertifikat verildikdən sonra həmin matçla bağlı hər hansı etiraz və ya izahat qəbul edilmir.',
  titleOptions: [
    'Matçın Nəticəsinin Şərtsiz Qəbul Edilməsi haqqında Sertifikat',
    'Məğlubiyyətin Etirazsız Tanınmasını Təsdiq edən Sertifikat',
    'Reytinq Göstəricisinin Qəbul Edilməsi Sertifikatı',
    'Qarşı Tərəfin Üstünlüyünün Tanınmasına dair Şəhadətnamə'
  ],
  powersOptions: [
    'Matçın nəticəsi şərtsiz qəbul edilir.',
    'Texniki səbəbə istinad edilmir.',
    'Reytinq düzəlişi tələb olunmur.',
    'Komanda tərkibi bəhanə kimi göstərilmir.',
    'Qarşı tərəfin strategiyası uğurlu sayılır.',
    'Səhvlər öz üzərinə götürülür.',
    'Revanş matçı ayrıca razılaşdırılır.',
    'Nəticə tarixçədə saxlanılır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Sertifikat verildikdən sonra həmin matçla bağlı hər hansı etiraz və ya izahat qəbul edilmir.',
    'Sertifikat yalnız bir matça aiddir.',
    'Revanş matçının şərtləri birgə müəyyən edilir.'
  ]
},
{
  id: 'r-qebul-viral', cat: 'c-qebul', tone: 'zarafat', layout: 'sertifikat', palette: 'gold',
  replyKind: 'qebul', replyCats: ['viral'], regPrefix: 'QVD',
  title: 'Ekspertiza Rəyinin Nəticələrinin Təsdiqi haqqında Sertifikat', tag: 'Ekspertiza',
  signOrg: 'Bəhanələrin Ekspertizası üzrə Ali Komissiya',
  powersLabel: 'TƏSDİQLƏNƏN ŞƏRTLƏR',
  preamble: 'Aparılmış yoxlama əsasında təsdiq olunur ki, {to} adlı şəxs ekspertiza rəyinin nəticələrini tam qəbul edir. {from} tərəfindən tətbiq edilmiş metodikaya və göstəricilərə etiraz bildirilməmişdir.',
  powers: 'Rəyin nəticələri tam qəbul edilir.\nGöstəricilər dəyişdirilmədən tanınır.\nTəkrar ekspertiza tələb olunmur.\nRəy qəti qüvvəyə minir.',
  penalty: 'Sertifikat verildikdən sonra rəyin nəticələrinə etiraz yalnız yeni materiallar təqdim edildikdə mümkündür.',
  titleOptions: [
    'Ekspertiza Rəyinin Nəticələrinin Təsdiqi haqqında Sertifikat',
    'Rəydəki Göstəricilərin Qəbul Edilməsi Sertifikatı',
    'Ekspertiza Metodikasının Tanınmasına dair Şəhadətnamə',
    'Rəyin Qəti Qüvvəyə Minməsini Təsdiq edən Sertifikat'
  ],
  powersOptions: [
    'Rəyin nəticələri tam qəbul edilir.',
    'Göstəricilər dəyişdirilmədən tanınır.',
    'Təkrar ekspertiza tələb olunmur.',
    'Rəy qəti qüvvəyə minir.',
    'Metodika və nümunə sayı qəbul edilib.',
    'Müşahidə müddəti kifayət sayılıb.',
    'Tövsiyələr icraya qəbul olunub.',
    'Növbəti qiymətləndirmə tarixi təyin edilib.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Sertifikat verildikdən sonra rəyin nəticələrinə etiraz yalnız yeni materiallar təqdim edildikdə mümkündür.',
    'Sertifikat növbəti qiymətləndirməyədək qüvvədədir.',
    'Tövsiyələrin icrası ayrıca yoxlanılır.'
  ]
},
{
  id: 'r-qebul-umumi', cat: 'c-qebul', tone: 'zarafat', layout: 'sertifikat', palette: 'gold',
  replyKind: 'qebul', regPrefix: 'QVD',
  title: 'Təqdim Edilmiş Sənədin Qüvvədə Saxlanılması haqqında Sertifikat', tag: 'Universal',
  signOrg: 'Sənədlərə Etirazlar üzrə Ali Apellyasiya Şurası',
  powersLabel: 'TƏSDİQLƏNƏN ŞƏRTLƏR',
  preamble: 'Hər iki tərəfin mövqeyi əsasında təsdiq edilir ki, {to} adlı şəxs təqdim edilmiş sənədin şərtlərini tam həcmdə qəbul edir. {from} tərəfindən tərtib olunmuş sənəd üzrə heç bir etiraz daxil olmamışdır.',
  powers: 'Sənədin şərtləri tam həcmdə qəbul edilir.\nHeç bir bəndə etiraz bildirilmir.\nSənəd müddəti bitənədək qüvvədə qalır.\nŞərtlər birtərəfli dəyişdirilmir.',
  penalty: 'Sertifikat verildikdən sonra sənədin şərtlərinə etiraz yalnız hər iki tərəfin razılığı ilə mümkündür.',
  titleOptions: [
    'Təqdim Edilmiş Sənədin Qüvvədə Saxlanılması haqqında Sertifikat',
    'Sənədin Şərtlərinin Tam Qəbulunu Təsdiq edən Sertifikat',
    'Tərəflər Arasında Mübahisənin Qalmadığına dair Şəhadətnamə',
    'Sənədin Etirazsız Qəbul Edilməsi Sertifikatı'
  ],
  powersOptions: [
    'Sənədin şərtləri tam həcmdə qəbul edilir.',
    'Heç bir bəndə etiraz bildirilmir.',
    'Sənəd müddəti bitənədək qüvvədə qalır.',
    'Şərtlər birtərəfli dəyişdirilmir.',
    'Cəza bəndi də qəbul edilmiş sayılır.',
    'Sənədin surəti hər iki tərəfdə saxlanılır.',
    'Yeni hallar üçün əlavə tərtib edilir.',
    'Müddət uzadılması ayrıca razılaşdırılır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Sertifikat verildikdən sonra sənədin şərtlərinə etiraz yalnız hər iki tərəfin razılığı ilə mümkündür.',
    'Sertifikat sənədin müddəti ilə birlikdə qüvvədən düşür.',
    'Şərtlərin dəyişdirilməsi yeni sənəd tələb edir.'
  ]
},

/* ==================== 💌 XATİRƏ CAVABI ====================
   tone: xatire · palette: rose · prefiks: XCV
   Rədd və etiraz yoxdur: xatirə tonunda cavab da səmimidir. */
{
  id: 'r-xatire-tesekkur', cat: 'c-xatire', tone: 'xatire', layout: 'diplom', palette: 'rose',
  replyKind: 'xatire', regPrefix: 'XCV',
  title: 'Alınmış Xatirə Sənədinə Cavab olaraq Verilmiş Təşəkkürnamə', tag: 'Ən çox seçilən',
  signOrg: 'Xatirələrin Qeydiyyatı üzrə Səmimi Şura',
  powersLabel: 'TƏŞƏKKÜRÜN SƏBƏBLƏRİ',
  preamble: 'Bu sənədlə {to} adlı şəxs {from} tərəfindən verilmiş xatirə sənədini aldığını və oxuduğunu təsdiq edir. Yazılanlar gözlənilməz oldu, bir neçə dəfə təkrar oxundu və saxlanılmaq üçün kənara qoyuldu.',
  powers: 'Sənəd oxundu və qəbul edildi.\nYazılanların səmimiliyinə şübhə bildirilmir.\nSənəd saxlanılacaq və illər sonra yenidən oxunacaq.\nBu təşəkkür qarşılıqlı və müddətsizdir.',
  penalty: 'Bu sənəd heç bir öhdəlik yaratmır. Yeganə xahiş — belə sənədləri yazmağa davam etməkdir.',
  titleOptions: [
    'Alınmış Xatirə Sənədinə Cavab olaraq Verilmiş Təşəkkürnamə',
    'Yazılanların Oxunduğunu və Saxlanıldığını Bildirən Təşəkkürnamə',
    'Gözlənilməz Sənədə Cavab olaraq Bildirilən Minnətdarlıq',
    'Sözlərin Yerinə Çatdığını Təsdiq edən Təşəkkürnamə'
  ],
  powersOptions: [
    'Sənəd oxundu və qəbul edildi.',
    'Yazılanların səmimiliyinə şübhə bildirilmir.',
    'Sənəd saxlanılacaq və illər sonra yenidən oxunacaq.',
    'Bu təşəkkür qarşılıqlı və müddətsizdir.',
    'Sözlər gözlənilmədən gəldi.',
    'Cavab yazmaq üçün vaxt lazım oldu.',
    'Sənəd ailə arxivinə əlavə edildi.',
    'Eyni sözlər şəxsən də deyiləcək.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Bu sənəd heç bir öhdəlik yaratmır. Yeganə xahiş — belə sənədləri yazmağa davam etməkdir.',
    'Təşəkkür müddətsizdir və geri götürülmür.',
    'Sənəd hər iki tərəfin arxivində saxlanılır.'
  ]
},
{
  id: 'r-xatire-qebul', cat: 'c-xatire', tone: 'xatire', layout: 'sertifikat', palette: 'rose',
  replyKind: 'xatire', regPrefix: 'XCV',
  title: 'Bəyan Edilmiş Hisslərin Qəbul Edildiyini Təsdiq edən Sertifikat', tag: 'Qəbul',
  signOrg: 'Səmimi Bəyanatların Qeydiyyatı üzrə Palata',
  powersLabel: 'QƏBULUN ŞƏRTLƏRİ',
  preamble: 'Bununla təsdiq edilir ki, {to} adlı şəxs {from} tərəfindən bəyan edilmiş hissləri tam və şərtsiz qəbul edir. Sənəddə yazılanlara heç bir etiraz bildirilmir, əksinə, eyni hisslər qarşılıqlı olaraq təsdiqlənir.',
  powers: 'Yazılanlar tam və şərtsiz qəbul edilir.\nHeç bir bəndə etiraz bildirilmir.\nEyni hisslər qarşılıqlı olaraq təsdiqlənir.\nSənəd müddətsiz qüvvədə saxlanılır.',
  penalty: 'Sertifikat müddətsizdir. Onun qüvvədən düşməsi yalnız hər iki tərəfin razılığı ilə mümkündür.',
  titleOptions: [
    'Bəyan Edilmiş Hisslərin Qəbul Edildiyini Təsdiq edən Sertifikat',
    'Yazılanların Şərtsiz Qəbulunu Təsdiq edən Sertifikat',
    'Sənədin Etirazsız Qəbul Edilməsinə dair Şəhadətnamə',
    'Deyilənlərin Eyni Formada Qarşılıqlı Olduğunu Bildirən Sertifikat'
  ],
  powersOptions: [
    'Yazılanlar tam və şərtsiz qəbul edilir.',
    'Heç bir bəndə etiraz bildirilmir.',
    'Eyni hisslər qarşılıqlı olaraq təsdiqlənir.',
    'Sənəd müddətsiz qüvvədə saxlanılır.',
    'Cavab gecikdi, lakin dəyişmədi.',
    'Sözlər üçün uyğun an gözlənildi.',
    'Sənəd bir neçə dəfə oxundu.',
    'Nüsxə hər iki tərəfdə saxlanılır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Sertifikat müddətsizdir. Onun qüvvədən düşməsi yalnız hər iki tərəfin razılığı ilə mümkündür.',
    'Qəbul geri götürülmür.',
    'Sənəd ildönümlərində yenidən oxunur.'
  ]
},
{
  id: 'r-xatire-qarsiliqli', cat: 'c-xatire', tone: 'xatire', layout: 'notarial', palette: 'rose',
  replyKind: 'xatire', regPrefix: 'XCV',
  title: 'Eyni Hisslərin Qarşılıqlı Bəyanına dair Cavab Etirafnaməsi', tag: 'Qarşılıqlı',
  signOrg: 'Qarşılıqlı Etirafların Təsdiqi üzrə Şura',
  powersLabel: 'QARŞILIQLI ETİRAFLAR',
  preamble: 'Bu sənədlə təsdiq olunur ki, {to} adlı şəxs {from} tərəfindən verilmiş etirafa cavab olaraq eyni hissləri bəyan edir. Hər iki tərəf uzun müddət susmuş, lakin heç biri fikrini dəyişməmişdir.',
  powers: 'Eyni hisslər qarşılıqlı olaraq bəyan edilir.\nSusmaq heç nəyi dəyişməmişdi.\nHər iki tərəf eyni anı gözləyirdi.\nEtiraf könüllüdür və geri götürülmür.',
  penalty: 'Bu etirafnamə illər sonra tapılanda eyni sözlərin yenidən deyilməsi şərti ilə qüvvədə qalır.',
  titleOptions: [
    'Eyni Hisslərin Qarşılıqlı Bəyanına dair Cavab Etirafnaməsi',
    'Alınmış Etirafa Cavab olaraq Verilmiş Etirafnamə',
    'Hisslərin Hər İki Tərəfdən Təsdiqinə dair Sənəd',
    'Susmaqla Keçən İllərin Qarşılıqlı Etirafnaməsi'
  ],
  powersOptions: [
    'Eyni hisslər qarşılıqlı olaraq bəyan edilir.',
    'Susmaq heç nəyi dəyişməmişdi.',
    'Hər iki tərəf eyni anı gözləyirdi.',
    'Etiraf könüllüdür və geri götürülmür.',
    'İlk addımı atmaq çətin oldu.',
    'Sözlər çoxdan hazır idi.',
    'Şahid tələb olunmadı.',
    'Sənəd birgə arxivə verildi.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Bu etirafnamə illər sonra tapılanda eyni sözlərin yenidən deyilməsi şərti ilə qüvvədə qalır.',
    'Etiraf müddətsizdir və dəyişdirilmir.',
    'Sənəd hər iki tərəfdə saxlanılır.'
  ]
},
{
  id: 'r-xatire-tesdiq', cat: 'c-xatire', tone: 'xatire', layout: 'arayis', palette: 'rose',
  replyKind: 'xatire', regPrefix: 'XCV',
  title: 'Sənəddə Göstərilən Xatirənin Doğruluğunu Təsdiq edən Arayış', tag: 'Təsdiq',
  signOrg: 'Ortaq Xatirələrin Qeydiyyatı üzrə Baş İdarə',
  powersLabel: 'TƏSDİQLƏNƏN XATİRƏLƏR',
  preamble: 'Verilir {to} adlı şəxsə ondan ötrü ki, {from} tərəfindən təqdim edilmiş sənəddə göstərilən xatirə doğrudur. Təfərrüatlar yoxlanılmış, kiçik fərqlər aşkarlansa da, mahiyyət tam üst-üstə düşmüşdür.',
  powers: 'Xatirənin mahiyyəti tam təsdiqlənir.\nTarix və yer düzgün göstərilib.\nKiçik təfərrüat fərqləri əhəmiyyət daşımır.\nXatirə ortaq arxivə daxil edilir.',
  penalty: 'Arayış müddətsizdir. Xatirənin təfərrüatları illər keçdikcə dəyişə bilər, mahiyyəti isə dəyişməz qalır.',
  titleOptions: [
    'Sənəddə Göstərilən Xatirənin Doğruluğunu Təsdiq edən Arayış',
    'Ortaq Xatirənin Hər İki Tərəf Tərəfindən Təsdiqi Arayışı',
    'Yazılanların Faktlara Uyğunluğu haqqında Arayış',
    'Xatirənin Təfərrüatlarının Dəqiqləşdirilməsi haqqında Arayış'
  ],
  powersOptions: [
    'Xatirənin mahiyyəti tam təsdiqlənir.',
    'Tarix və yer düzgün göstərilib.',
    'Kiçik təfərrüat fərqləri əhəmiyyət daşımır.',
    'Xatirə ortaq arxivə daxil edilir.',
    'Şəkillər sənədə əlavə olunub.',
    'Hava şəraiti də eyni xatırlanır.',
    'İştirakçıların siyahısı dəqiqləşdirilib.',
    'Xatirə hər il yenidən danışılır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Arayış müddətsizdir. Xatirənin təfərrüatları illər keçdikcə dəyişə bilər, mahiyyəti isə dəyişməz qalır.',
    'Arayış ortaq arxivdə saxlanılır.',
    'Yeni təfərrüatlar sənədə əlavə edilə bilər.'
  ]
},
{
  id: 'r-xatire-mektub', cat: 'c-xatire', tone: 'xatire', layout: 'teleqram', palette: 'rose',
  replyKind: 'xatire', regPrefix: 'XCV',
  title: 'Alınmış Sənədə Cavab olaraq Göndərilmiş Səmimi Teleqram', tag: 'Cavab məktubu',
  signOrg: 'Səmimi Məktubların Çatdırılması üzrə İdarə',
  preamble: 'Sizə bildiririk ki, {to} adlı şəxs {from} tərəfindən göndərilmiş sənədi almışdır. Cavab qısadır, çünki deyiləcək sözlərin çoxu artıq həmin sənəddə yazılıb və təkrar izahat tələb etmir.',
  powers: 'Sənəd alındı və oxundu.\nSözlər yerinə çatdı.\nCavab qısadır, lakin səmimidir.\nQalanı görüşdə danışılacaq.',
  penalty: 'Teleqram heç bir öhdəlik yaratmır. Onun yeganə məqsədi sənədin yerinə çatdığını bildirməkdir.',
  titleOptions: [
    'Alınmış Sənədə Cavab olaraq Göndərilmiş Səmimi Teleqram',
    'Qısa Sözlərlə Verilmiş Cavab Teleqramı',
    'Sənədin Alındığını Bildirən Səmimi Teleqram',
    'Cavabın Təxirəsalınmaz Çatdırılması haqqında Teleqram'
  ],
  powersOptions: [
    'Sənəd alındı və oxundu.',
    'Sözlər yerinə çatdı.',
    'Cavab qısadır, lakin səmimidir.',
    'Qalanı görüşdə danışılacaq.',
    'Sənəd bir neçə dəfə oxundu.',
    'Cavab yazmaq üçün vaxt lazım oldu.',
    'Nüsxə saxlanılır.',
    'Görüş tarixi razılaşdırılacaq.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Teleqram heç bir öhdəlik yaratmır. Onun yeganə məqsədi sənədin yerinə çatdığını bildirməkdir.',
    'Teleqram xatirə arxivində saxlanılır.',
    'Mesaj olduğu kimi qorunur.'
  ]
},
{
  id: 'r-xatire-ohdelik', cat: 'c-xatire', tone: 'xatire', layout: 'muqavile', palette: 'rose',
  replyKind: 'xatire', regPrefix: 'XCV',
  title: 'Sənəddə Göstərilən Öhdəliyin Qəbul Edilməsi üzrə Cavab Sazişi', tag: 'Öhdəlik',
  signOrg: 'Verilmiş Sözlərin Qeydiyyatı üzrə Palata',
  powersLabel: 'QƏBUL EDİLƏN ÖHDƏLİKLƏR',
  preamble: 'Bu sazişlə {to} adlı şəxs {from} tərəfindən təqdim edilmiş sənəddə göstərilən öhdəliyi qəbul edir və eyni öhdəliyi öz üzərinə götürür. Saziş hər iki tərəfə bərabər şərtlərlə şamil olunur.',
  powers: 'Öhdəlik tam və şərtsiz qəbul edilir.\nEyni öhdəlik qarşılıqlı olaraq götürülür.\nŞərtlər hər iki tərəf üçün eynidir.\nSaziş müddətsizdir.',
  penalty: 'Saziş yalnız hər iki tərəfin razılığı ilə dəyişdirilə bilər. İndiyədək belə bir müraciət daxil olmayıb.',
  titleOptions: [
    'Sənəddə Göstərilən Öhdəliyin Qəbul Edilməsi üzrə Cavab Sazişi',
    'Verilmiş Sözün Qarşılıqlı Təsdiqinə dair Saziş',
    'Öhdəliyin Hər İki Tərəf Tərəfindən Qəbulu Sazişi',
    'Alınmış Sənədə Cavab olaraq Bağlanmış Saziş'
  ],
  powersOptions: [
    'Öhdəlik tam və şərtsiz qəbul edilir.',
    'Eyni öhdəlik qarşılıqlı olaraq götürülür.',
    'Şərtlər hər iki tərəf üçün eynidir.',
    'Saziş müddətsizdir.',
    'Söz yazılı formada təsdiqləndi.',
    'Şahid tələb olunmadı.',
    'Nüsxə hər iki tərəfdə saxlanılır.',
    'Şərtlər əlavə müzakirə tələb etmir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Saziş yalnız hər iki tərəfin razılığı ilə dəyişdirilə bilər. İndiyədək belə bir müraciət daxil olmayıb.',
    'Saziş xatirə arxivində saxlanılır.',
    'Öhdəlik hər il yenidən təsdiqlənir.'
  ]
},

];
