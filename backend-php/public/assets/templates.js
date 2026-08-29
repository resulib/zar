/* ==================================================================
   Zarafat Notariat Palatası — şablon kitabxanası
   144 şablon · 12 kateqoriya · 12 dizayn · 5 palitra · tone: 'zarafat'
   Xatirə tonunun şablonları ayrıca fayldadır: templates-xatire.js
   layout:  notarial | blank | diplom | sertifikat | lisenziya
            arayis | qerar | muqavile | teleqram | vesiqe | viza | ekspertiza
   palette: gold | steel | burgundy | forest | ink
   ================================================================== */
window.CATEGORIES = [
  { id: 'couples',   tone: 'zarafat', name: 'Cütlüklər',            icon: '❦', blurb: 'Ev daxili diplomatiya, pult müharibələri və həftəsonu danışıqları üçün.' },
  { id: 'friends',   tone: 'zarafat', name: 'Dostlar / Padruqalar', icon: '✦', blurb: 'Borc, gecikmə, sirr saxlama və dostluq öhdəlikləri üzrə.' },
  { id: 'work',      tone: 'zarafat', name: 'İş Yeri / Ofis',       icon: '⚖', blurb: 'Toplantılar, kofe maşını və «sabah göndərərəm» mədəniyyəti.' },
  { id: 'family',    tone: 'zarafat', name: 'Ailə / Uşaqlar',       icon: '⌂', blurb: 'Valideyn-övlad diplomatiyası, dərs saatı, ekran vaxtı və ev işləri.' },
  { id: 'relatives', tone: 'zarafat', name: 'Qohumlar / Qaynana',   icon: '❉', blurb: 'Gəlin-qaynana protokolu, toy məsləhətləri və bayram ziyarətləri.' },
  { id: 'student',   tone: 'zarafat', name: 'Tələbələr',            icon: '✎', blurb: 'İmtahan, konspekt borcu, yataqxana və dərsə gecikmə üzrə.' },
  { id: 'neighbors', tone: 'zarafat', name: 'Qonşular / Həyət',     icon: '⌗', blurb: 'Səs-küy, park yeri, pilləkən növbəsi və uşaq meydançası.' },
  { id: 'holiday',   tone: 'zarafat', name: 'Bayram & Toy',         icon: '✵', blurb: 'Novruz, toy masası, hədiyyə öhdəlikləri və qonaq qəbulu.' },
  { id: 'travel',    tone: 'zarafat', name: 'Səyahət / Yol',        icon: '✈', blurb: 'Çamadan, naviqasiya səlahiyyəti, sürücülük növbəsi və otel seçimi.' },
  { id: 'pets',      tone: 'zarafat', name: 'Ev heyvanları',        icon: '✿', blurb: 'Pişik-it səlahiyyətnamələri, yemləmə növbəsi və divan hüququ.' },
  { id: 'gaming',    tone: 'zarafat', name: 'Oyunçular',            icon: '▶', blurb: 'Rank, komanda seçimi, ekran vaxtı və klaviatura sülhü.' },
  { id: 'viral',     tone: 'zarafat', name: 'Viral',                icon: '⚡', blurb: 'Anket doldurulur, sənəd cavablardan qurulur: viza, arayış, sertifikat və ekspertiza rəyi.' }
];

window.TEMPLATES = [

/* ==================== CÜTLÜKLƏR ==================== */
{
  id: 'weekend-pass', cat: 'couples', tone: 'zarafat', layout: 'notarial', palette: 'gold',
  title: 'Həftəsonu Evdən Kənara Çıxma Səlahiyyətinin Verilməsi haqqında Etibarnamə', tag: 'Ən çox paylaşılan',
  signOrg: 'Evdaxili Münasibətlərin Tənzimlənməsi üzrə Şura',
  preamble: 'Tərəflər arasında həftəsonu vaxtının bölüşdürülməsi ilə bağlı yaranmış müzakirə nəzərə alınaraq, {from} tərəfindən {to} adlı şəxsə evdən kənara çıxmaq və müəyyən edilmiş saatda geri qayıtmaq səlahiyyəti verilmişdir. Səlahiyyət telefonun şarj səviyyəsi 40 faizdən yuxarı olduğu müddətdə qüvvədə hesab edilir.',
  powers: 'Həftədə bir dəfə, ən çoxu dörd saat müddətinə evdən kənara çıxmaq.\nHər 45 dəqiqədən bir sağ-salamat olduğunu bildirən mesaj göndərmək.\nQayıdarkən əliboş qayıtmamaq: şirniyyat və ya çiçək məcburi hesab edilir.\nSəsli mesaja ən geci üç dəqiqə ərzində cavab vermək.',
  penalty: 'Şərtlərin pozulması halında səlahiyyət növbəti həftəsonu üçün dayandırılır və sənəd sahibi qab-qacaq yuma öhdəliyini öz üzərinə götürmüş hesab edilir.',
  titleOptions: [
    'Həftəsonu Evdən Kənara Çıxma Səlahiyyətinin Verilməsi haqqında Etibarnamə',
    'Həftəsonu Vaxtından Sərbəst İstifadə Səlahiyyəti haqqında Etibarnamə',
    'Dostlarla Görüş Məqsədilə Evdən Kənara Çıxma haqqında Etibarnamə',
    'Müəyyən Saatadək Evə Qayıtmaq Şərti ilə Verilmiş Çıxış Etibarnaməsi'
  ],
  powersOptions: [
    'Həftədə bir dəfə, ən çoxu dörd saat müddətinə evdən kənara çıxmaq.',
    'Hər 45 dəqiqədən bir sağ-salamat olduğunu bildirən mesaj göndərmək.',
    'Qayıdarkən əliboş qayıtmamaq: şirniyyat və ya çiçək məcburi hesab edilir.',
    'Səsli mesaja ən geci üç dəqiqə ərzində cavab vermək.',
    'Qayıdış saatını yalnız bir dəfə və əvvəlcədən xəbər verməklə dəyişmək.',
    'Görüşün keçirildiyi ünvanı tələb olunduqda təsdiq etmək.',
    'Yola düşməzdən əvvəl «çıxıram» ifadəsini səsləndirmək.',
    'Evə qayıdanda gecikmənin səbəbini yazılı izah etməmək hüququ.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Şərtlərin pozulması halında səlahiyyət növbəti həftəsonu üçün dayandırılır və sənəd sahibi qab-qacaq yuma öhdəliyini öz üzərinə götürmüş hesab edilir.',
    'Növbəti həftəsonunun proqramı tam olaraq digər tərəf tərəfindən müəyyən edilir.',
    'Pultdan istifadə hüququ yeddi gün müddətinə dayandırılır.'
  ]
},
{
  id: 'always-right', cat: 'couples', tone: 'zarafat', layout: 'qerar', palette: 'burgundy',
  title: 'Mübahisələrdə Daimi Haqlılıq Statusunun Tanınması haqqında Qərar', tag: 'Klassik',
  signOrg: 'Məişət Mübahisələri üzrə Arbitraj Kollegiyası',
  preamble: 'Kollegiya {to} adlı şəxsin iştirak etdiyi mübahisələrin uzunmüddətli statistikasını araşdıraraq müəyyən etmişdir ki, yekun nəticə mövzudan asılı olmayaraq həmişə eyni olmuşdur. {from} tərəfindən bildirilən razılıq nəzərə alınmaqla məsələ üzrə yekun qərar qəbul edilmişdir.',
  powers: 'İstənilən mübahisədə son sözü demək səlahiyyəti tanınsın.\n«Mən sənə demişdim» ifadəsinin istifadəsinə məhdudiyyət qoyulmasın.\nXəritəyə baxmadan yol göstərmək halı səhv hesab edilməsin.\nQərar geriyə şamil edilsin və keçmiş mübahisələri əhatə etsin.',
  penalty: 'Qərardan narazı tərəfin etirazı qəbul edilir, lakin baxılmaya bilər. Etirazın təkrarlanması halında serial seçimi hüququ yeddi gün müddətinə digər tərəfə keçir.',
  titleOptions: [
    'Mübahisələrdə Daimi Haqlılıq Statusunun Tanınması haqqında Qərar',
    'Ailədaxili Mübahisələr üzrə Son Sözün Bir Tərəfə Verilməsi haqqında Qərar',
    'Keçmiş Mübahisələrə Yenidən Baxılmasının Dayandırılması haqqında Qərar',
    'Haqlılıq Statusunun Müddətsiz Tanınmasına dair Yekun Qətnamə'
  ],
  powersOptions: [
    'İstənilən mübahisədə son sözü demək səlahiyyəti tanınsın.',
    '«Mən sənə demişdim» ifadəsinin istifadəsinə məhdudiyyət qoyulmasın.',
    'Xəritəyə baxmadan yol göstərmək halı səhv hesab edilməsin.',
    'Qərar geriyə şamil edilsin və keçmiş mübahisələri əhatə etsin.',
    'Soyuducunu açıb «yemək yoxdur» demək hüququ qorunsun.',
    'Alış-verişdə seçilmiş rəngin uğursuz olması müzakirə predmeti sayılmasın.',
    'Yolun qısa variantı barədə fikir yekun hesab edilsin.',
    'Serialın sonunu əvvəlcədən demək halı pozuntu kimi qiymətləndirilməsin.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Qərardan narazı tərəfin etirazı qəbul edilir, lakin baxılmaya bilər. Etirazın təkrarlanması halında serial seçimi hüququ yeddi gün müddətinə digər tərəfə keçir.',
    'Etiraz qeydə alınır, lakin qərarın qüvvəsinə təsir göstərmir.',
    'Qərar növbəti mübahisəyə qədər dəyişdirilmədən qüvvədə saxlanılır.'
  ]
},
{
  id: 'remote-control', cat: 'couples', tone: 'zarafat', layout: 'sertifikat', palette: 'steel',
  title: 'Televiziya Pultu üzərində Müstəsna Nəzarət Hüququnun Sertifikatı', tag: 'Ev müharibəsi',
  signOrg: 'Ev Rejimi və Daxili Nizam üzrə Baş İdarə',
  preamble: 'Bununla təsdiq edilir ki, {to} adlı şəxsin televiziya pultu üzərində nəzarəti uzun müddət ərzində fasiləsiz davam etmiş və mübahisə predmetinə çevrilməmişdir. Hüquq {from} tərəfindən könüllü şəkildə, heç bir təzyiq olmadan tanınmışdır.',
  powers: 'Kanalı əvvəlcədən xəbərdarlıq etmədən dəyişmək.\nReklam fasiləsində səsi tam söndürmək.\nSerialın növbəti hissəsini tək baxmamaq öhdəliyi ilə seçmək.\nPultun harada olduğunu bilməmək hüququ — ayda iki dəfə.',
  penalty: 'Pultun 24 saatdan artıq itkin qalması halında nəzarət hüququ avtomatik olaraq digər tərəfə keçir və sertifikat bərpa edilmir.',
  titleOptions: [
    'Televiziya Pultu üzərində Müstəsna Nəzarət Hüququnun Sertifikatı',
    'Axşam Saatlarında Kanal Seçimi Səlahiyyətini Təsdiq edən Sertifikat',
    'Pultun Saxlanma Yeri üzərində Nəzarətin Tanınması Sertifikatı',
    'Baxış Cədvəlinin Müəyyən Edilməsi Səlahiyyətinə dair Şəhadətnamə'
  ],
  powersOptions: [
    'Kanalı əvvəlcədən xəbərdarlıq etmədən dəyişmək.',
    'Reklam fasiləsində səsi tam söndürmək.',
    'Serialın növbəti hissəsini tək baxmamaq öhdəliyi ilə seçmək.',
    'Pultun harada olduğunu bilməmək hüququ — ayda iki dəfə.',
    'Axşam saat 21:00-dan sonra baxış cədvəlini müəyyən etmək.',
    'İdman yayımı zamanı kanalın dəyişdirilməsinə etiraz etmək.',
    'Pultun batareyasını dəyişmək öhdəliyini üzərinə götürməmək.',
    'Qonaq gəldikdə nəzarəti müvəqqəti olaraq həvalə etmək.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Pultun 24 saatdan artıq itkin qalması halında nəzarət hüququ avtomatik olaraq digər tərəfə keçir və sertifikat bərpa edilmir.',
    'Sertifikat qonaqların iştirakı ilə keçirilən baxışlara şamil edilmir.',
    'Hüquq yalnız pultun saxlanma yerinin açıqlanması şərti ilə qüvvədədir.'
  ]
},
{
  id: 'dessert-amnesty', cat: 'couples', tone: 'zarafat', layout: 'blank', palette: 'forest',
  title: 'Soyuducuda Saxlanılan Şirniyyat Epizodlarına Görə Amnistiya Bəyannaməsi', tag: 'Bayram üçün',
  signOrg: 'Ev Rejimi və Daxili Nizam üzrə Baş İdarə',
  toLabel: 'Amnistiya olunan', fromLabel: 'Amnistiya verən',
  preamble: 'Uzunmüddətli müşahidə nəticəsində soyuducuda saxlanılan şirniyyat məhsulları ilə bağlı bir sıra izah edilməmiş epizodlar qeydə alınmışdır. {from} tərəfindən {to} adlı şəxsə həmin epizodların hamısına, o cümlədən paylaşılmamış son dilimə görə tam və qeyd-şərtsiz amnistiya elan olunur.',
  powers: 'Gecə saat 00:00-dan sonra soyuducuya sərbəst giriş.\nSon dilimi soruşmadan götürmək — ayda bir dəfə.\n«Mən götürməmişəm» ifadəsindən istifadə hüququ.\nBayram şirniyyatını qonaqlardan əvvəl dadmaq.',
  penalty: 'Amnistiya yalnız keçmişə şamil edilir. Elan edildiyi tarixdən sonra aşkarlanan yeni epizodlarda sənəd sahibi növbəti şirniyyatı öz vəsaiti hesabına almaq öhdəliyi daşıyır.',
  titleOptions: [
    'Soyuducuda Saxlanılan Şirniyyat Epizodlarına Görə Amnistiya Bəyannaməsi',
    'Paylaşılmamış Son Dilim üzrə Keçmiş Əməllərin Bağışlanması Bəyannaməsi',
    'Gecə Saatlarında Soyuducuya Müraciət Hallarına dair Amnistiya Bildirişi',
    'Mətbəx Sahəsində Törədilmiş Əməllərə Görə Ümumi Amnistiya Bəyannaməsi'
  ],
  powersOptions: [
    'Gecə saat 00:00-dan sonra soyuducuya sərbəst giriş.',
    'Son dilimi soruşmadan götürmək — ayda bir dəfə.',
    '«Mən götürməmişəm» ifadəsindən istifadə hüququ.',
    'Bayram şirniyyatını qonaqlardan əvvəl dadmaq.',
    'Alınmış şirniyyatın miqdarını yuvarlaqlaşdıraraq bildirmək.',
    'Boş qabı soyuducuda saxlamağa görə izahat verməmək.',
    'Çayın yanına götürülən dilimi hesaba daxil etməmək.',
    'Şirniyyatın harada gizlədildiyini açıqlamamaq hüququ.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Amnistiya yalnız keçmişə şamil edilir. Elan edildiyi tarixdən sonra aşkarlanan yeni epizodlarda sənəd sahibi növbəti şirniyyatı öz vəsaiti hesabına almaq öhdəliyi daşıyır.',
    'Yeni epizodların təkrarı halında soyuducuya gecə girişi dayandırılır.',
    'Amnistiya bayram süfrəsində qoyulmuş məhsullara şamil edilmir.'
  ]
},
{
  id: 'snoring-license', cat: 'couples', tone: 'zarafat', layout: 'lisenziya', palette: 'ink',
  title: 'Gecə Saatlarında Səs Effektlərinin Yaradılmasına dair Xüsusi İcazə', tag: 'Gecə növbəsi',
  signOrg: 'Ev Rejimi və Daxili Nizam üzrə Baş İdarə',
  powersLabel: 'LİSENZİYANIN ƏHATƏ ETDİYİ HALLAR',
  preamble: 'Uzunillik müşahidə və nəticəsiz mübarizədən sonra {from} tərəfindən {to} adlı şəxsin gecə saatlarında səs effektləri yaratmaq hüququ rəsmi qaydada tanınmışdır. İcazə bütün yataq otaqlarında və uzunmüddətli avtomobil yollarında qüvvədə hesab edilir.',
  powers: 'Gecə saat 23:00-dan səhər 07:00-dək sərbəst xoruldamaq.\nSəhər «mən xoruldamıram» demək hüququ.\nDivana köçürülmə tədbirinə etiraz etmək.\nQulaq tıxacının dəyərini ödəməmək.',
  penalty: 'Səs həddi qonşuların müraciət etdiyi səviyyəni keçdikdə icazə bir gecəlik dayandırılır və sahib müvəqqəti olaraq divana köçürülür.',
  titleOptions: [
    'Gecə Saatlarında Səs Effektlərinin Yaradılmasına dair Xüsusi İcazə',
    'Yataq Otağında Akustik Fəaliyyətin Rəsmiləşdirilməsi haqqında Lisenziya',
    'Xoruldama Halının Qanuni Fəaliyyət kimi Tanınmasına dair İcazə',
    'Gecə Rejimində Səs Həddinin Aşılmasına dair Müddətsiz Lisenziya'
  ],
  powersOptions: [
    'Gecə saat 23:00-dan səhər 07:00-dək sərbəst xoruldamaq.',
    'Səhər «mən xoruldamıram» demək hüququ.',
    'Divana köçürülmə tədbirinə etiraz etmək.',
    'Qulaq tıxacının dəyərini ödəməmək.',
    'Yatmazdan əvvəl çevrilmə tələbini nəzərə almamaq.',
    'Səs yazısının sübut kimi təqdim edilməsinə etiraz bildirmək.',
    'Yol boyu avtomobildə yuxuya getmək hüququ.',
    'Qonaqlıqda yuxuya getmə halını müzakirəyə çıxarmamaq.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Səs həddi qonşuların müraciət etdiyi səviyyəni keçdikdə icazə bir gecəlik dayandırılır və sahib müvəqqəti olaraq divana köçürülür.',
    'İcazə yalnız yastığın öz yerində saxlanılması şərti ilə qüvvədədir.',
    'Səs yazısının üç gecə ardıcıl təkrarı icazəni qüvvədən salır.'
  ]
},
{
  id: 'ideal-partner', cat: 'couples', tone: 'zarafat', layout: 'diplom', palette: 'burgundy',
  title: 'Səbir və Dözüm Sahəsində Göstərilmiş Nəticələrə Görə Fəxri Diplom', tag: 'İldönümü',
  signOrg: 'Evdaxili Münasibətlərin Tənzimlənməsi üzrə Şura',
  preamble: 'Şura {to} adlı şəxsin uzun müddət ərzində səbir, dözüm və vaxtında gətirilmiş çay sahəsində göstərdiyi nəticələri qiymətləndirərək təltif haqqında qərar qəbul etmişdir. Diplom {from} tərəfindən təqdim olunur və geri alınmır.',
  powers: 'Səhər qəhvəsini yataqda təqdim etmək.\nUnudulmuş tarixləri vaxtında xatırlatmaq.\nMübahisədən sonra ilk addımı atmaq.\nAilə fotolarında həmişə gülümsəmək.',
  penalty: 'Diplom geri alınmır. Lakin təltif olunan şəxs il ərzində ən azı bir dəfə əvvəlcədən xəbər verilməyən sürpriz təşkil etmək öhdəliyi daşıyır.',
  titleOptions: [
    'Səbir və Dözüm Sahəsində Göstərilmiş Nəticələrə Görə Fəxri Diplom',
    'Vaxtında Gətirilmiş Çay Sahəsindəki Nailiyyətlərə Görə Fəxri Diplom',
    'Uzunmüddətli Birgə Həyatda Nümunəvi Davranışa Görə Fəxri Diplom',
    'Mübahisədən Sonra İlk Addımı Atmaq Sahəsində Fəxri Diplom'
  ],
  powersOptions: [
    'Səhər qəhvəsini yataqda təqdim etmək.',
    'Unudulmuş tarixləri vaxtında xatırlatmaq.',
    'Mübahisədən sonra ilk addımı atmaq.',
    'Ailə fotolarında həmişə gülümsəmək.',
    'Uzun söhbəti sona qədər dinləmək.',
    'Alış-veriş siyahısını itirmədən saxlamaq.',
    'Qonaqlar gələnə qədər evi nizama salmaq.',
    'Səhv olduqda bunu birinci etiraf etmək.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Diplom geri alınmır. Lakin təltif olunan şəxs il ərzində ən azı bir dəfə əvvəlcədən xəbər verilməyən sürpriz təşkil etmək öhdəliyi daşıyır.',
    'Təltif növbəti ildönümünə qədər yenidən nəzərdən keçirilmir.',
    'Diplom ailə arxivində saxlanılır və mübahisədə sübut kimi istifadə edilə bilər.'
  ]
},
{
  id: 'shopping-power', cat: 'couples', tone: 'zarafat', layout: 'viza', palette: 'steel',
  title: 'Ailə Büdcəsi Hesabına Alış-veriş Əməliyyatlarının Aparılmasına İcazə', tag: 'Büdcə',
  signOrg: 'Evdaxili Münasibətlərin Tənzimlənməsi üzrə Şura',
  preamble: '{from} tərəfindən {to} adlı şəxsə ailə büdcəsi hesabına alış-veriş etmək səlahiyyəti verilir. Səlahiyyət yalnız əvvəlcədən razılaşdırılmış siyahıya şamil olunur; siyahıdan kənar alışlar ayrıca izahat tələb edir.',
  powers: 'Siyahıda göstərilən məhsulları müstəqil seçmək səlahiyyəti verilir.\nEndirimli bir məhsulu siyahıya sonradan əlavə etmək icazəlidir.\nÇek itdikdə məbləğin yuvarlaqlaşdırılması pozuntu sayılmır.\n«Lazım olacaq» arqumenti həftədə bir dəfə tətbiq edilə bilər.',
  penalty: 'Siyahıdan kənar üç və daha çox məhsul aşkarlandıqda icazə növbəti ay üçün dayandırılır və alış-veriş birgə həyata keçirilir.',
  titleOptions: [
    'Ailə Büdcəsi Hesabına Alış-veriş Əməliyyatlarının Aparılmasına İcazə',
    'Siyahı Üzrə Alış-verişin Müstəqil Həyata Keçirilməsinə dair İcazə',
    'Endirim Dövründə Büdcədən İstifadəyə dair Məhdud Müddətli İcazə',
    'Market Ziyarəti Zamanı Seçim Səlahiyyətinin Verilməsinə dair İcazə'
  ],
  powersOptions: [
    'Siyahıda göstərilən məhsulları müstəqil seçmək səlahiyyəti verilir.',
    'Endirimli bir məhsulu siyahıya sonradan əlavə etmək icazəlidir.',
    'Çek itdikdə məbləğin yuvarlaqlaşdırılması pozuntu sayılmır.',
    '«Lazım olacaq» arqumenti həftədə bir dəfə tətbiq edilə bilər.',
    'Növbədə dayanarkən əlavə məhsul götürmək icazəlidir.',
    'Uşaq bölməsindən keçmək tələb olunmur.',
    'Alınmış məhsulun qiyməti soruşulduqda təxmini rəqəm göstərilə bilər.',
    'Siyahıda olmayan şirniyyat bir ədəd hüdudunda alına bilər.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Siyahıdan kənar üç və daha çox məhsul aşkarlandıqda icazə növbəti ay üçün dayandırılır və alış-veriş birgə həyata keçirilir.',
    'İcazə yalnız çekin saxlanılması şərti ilə qüvvədə hesab edilir.',
    'Büdcənin aşılması halında növbəti alış-veriş siyahısı digər tərəf tərəfindən tərtib edilir.'
  ]
},
{
  id: 'late-reply', cat: 'couples', tone: 'zarafat', layout: 'vesiqe', palette: 'steel',
  title: 'Mesajı Oxuduqdan Sonra Cavab Verməmək Hüququnu Təsdiq edən Vəsiqə', tag: 'Rəqəmsal sülh',
  signOrg: 'Evdaxili Münasibətlərin Tənzimlənməsi üzrə Şura',
  toLabel: 'VƏSİQƏ SAHİBİ',
  preamble: 'Bu vəsiqə {to} adlı şəxsin mesajı oxuduqdan sonra dərhal cavab verməmək hüququnu təsdiq edir. Sənəd {from} tərəfindən, «onlayn» statusunun mübahisə mövzusuna çevrilməməsi şərti ilə verilmişdir və rəqəmsal ünsiyyətin bütün formalarına şamil olunur.',
  powers: 'Mesajı görüb sonra cavablandırmaq hüququ tanınır.\n«Onlayn» statusu izahat tələb edən hal sayılmır.\nSəsli mesaja yazılı cavab vermək icazəlidir.\nCavab müddəti gündəlik məşğulluğa uyğun müəyyən edilir.',
  penalty: 'Vəsiqə sosial şəbəkədə paylaşım edildiyi anda müvəqqəti olaraq qüvvədən düşür və cavab öhdəliyi həmin gün ərzində bərpa olunur.',
  titleOptions: [
    'Mesajı Oxuduqdan Sonra Cavab Verməmək Hüququnu Təsdiq edən Vəsiqə',
    'Onlayn Görünmə Halının Mübahisə Predmeti Sayılmamasına dair Vəsiqə',
    'Rəqəmsal Ünsiyyətdə Fasilə Hüququnu Təsdiq edən Şəhadətnamə',
    'Cavab Müddətinin Sərbəst Müəyyən Edilməsinə dair Vəsiqə'
  ],
  powersOptions: [
    'Mesajı görüb sonra cavablandırmaq hüququ tanınır.',
    '«Onlayn» statusu izahat tələb edən hal sayılmır.',
    'Səsli mesaja yazılı cavab vermək icazəlidir.',
    'Cavab müddəti gündəlik məşğulluğa uyğun müəyyən edilir.',
    'Qrup söhbətindəki mesajlara cavab vermək öhdəliyi yaranmır.',
    'Bildirişlərin söndürülməsi pozuntu kimi qiymətləndirilmir.',
    'Şəkil və video mesajlar ayrıca cavab tələb etmir.',
    'Gecə saatlarında yazılmış mesaj səhər cavablandırıla bilər.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Vəsiqə sosial şəbəkədə paylaşım edildiyi anda müvəqqəti olaraq qüvvədən düşür və cavab öhdəliyi həmin gün ərzində bərpa olunur.',
    'Üç ardıcıl cavabsız gün vəsiqənin yenidən baxılmasına əsas verir.',
    'Vəsiqə təcili hesab edilən mesajlara şamil edilmir.'
  ]
},
{
  id: 'family-visit', cat: 'couples', tone: 'zarafat', layout: 'arayis', palette: 'ink',
  title: 'Qohum Ziyarətinin Müddəti və Şərtlərinin Müəyyən Edilməsi haqqında Arayış', tag: 'Diplomatiya',
  signOrg: 'Məişət Mübahisələri üzrə Arbitraj Kollegiyası',
  powersLabel: 'PROTOKOLUN ŞƏRTLƏRİ',
  preamble: 'Verilir {to} adlı şəxsə ondan ötrü ki, qohum ziyarətlərinin müddəti və şərtləri {from} ilə birgə müzakirə edilmiş və razılaşdırılmışdır. Arayış hər iki tərəfin ziyarətlərinə bərabər şəkildə şamil olunur.',
  powers: 'Ziyarətin müddəti üç saatı keçmir.\nAyrılma vaxtı əvvəlcədən elan edilir və uzadılmır.\nMaaş və evlilik mövzuları müzakirəyə çıxarılmır.\nHər iki ailəyə ziyarət növbə ilə həyata keçirilir.',
  penalty: 'Razılaşdırılmış müddətin bir saatdan artıq aşılması halında növbəti ziyarətin təşkili tam olaraq digər tərəfin səlahiyyətinə keçir.',
  titleOptions: [
    'Qohum Ziyarətinin Müddəti və Şərtlərinin Müəyyən Edilməsi haqqında Arayış',
    'Bayram Ziyarətlərinin Növbəliliyinin Təsdiqi haqqında Arayış',
    'Ziyarət Zamanı Söhbət Mövzularının Məhdudlaşdırılması haqqında Arayış',
    'Qonaqlıqdan Ayrılma Vaxtının Razılaşdırılması haqqında Arayış'
  ],
  powersOptions: [
    'Ziyarətin müddəti üç saatı keçmir.',
    'Ayrılma vaxtı əvvəlcədən elan edilir və uzadılmır.',
    'Maaş və evlilik mövzuları müzakirəyə çıxarılmır.',
    'Hər iki ailəyə ziyarət növbə ilə həyata keçirilir.',
    'Süfrə arxasında müqayisə aparılması qadağandır.',
    'Ziyarətdən əvvəl gedişin dəqiq saatı bildirilir.',
    'Ev sahibinin təklif etdiyi ikinci boşqab rədd edilə bilər.',
    'Gözlənilməz ziyarət ən azı bir saat əvvəl xəbər verilir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Razılaşdırılmış müddətin bir saatdan artıq aşılması halında növbəti ziyarətin təşkili tam olaraq digər tərəfin səlahiyyətinə keçir.',
    'Müddətin aşılması növbəti bayram ziyarətinin ləğvinə əsas verir.',
    'Şərtlərin pozulması halında ziyarət növbəsi bir dövr üçün dayandırılır.'
  ]
},
{
  id: 'sock-treaty', cat: 'couples', tone: 'zarafat', layout: 'muqavile', palette: 'forest',
  title: 'Corabların Saxlanma Yeri və Cütləşdirilməsi üzrə Birgə Müqavilə', tag: 'Ev qaydası',
  signOrg: 'Ev Rejimi və Daxili Nizam üzrə Baş İdarə',
  preamble: 'Tərəflərin mövqeyi nəzərə alınmaqla, {from} və {to} arasında corabların saxlanma yeri, cütləşdirilməsi və itkin düşmüş nüsxələrin axtarışı üzrə məsuliyyətin bölüşdürülməsi barədə razılıq əldə edilmişdir. Müqavilə imzalandığı gündən qüvvəyə minir.',
  powers: 'Corablar yalnız müəyyən edilmiş yerdə saxlanılır.\nCütləşdirmə paltarın qurudulmasından sonra dərhal aparılır.\nİtkin düşmüş nüsxənin axtarışı birgə həyata keçirilir.\nDivanın altından çıxan corab mübahisə predmeti sayılmır.',
  penalty: 'Müqavilənin şərtləri iki dəfə pozulduqda corabların cütləşdirilməsi öhdəliyi növbəti ay üçün tam olaraq pozuntuya yol vermiş tərəfə keçir.',
  titleOptions: [
    'Corabların Saxlanma Yeri və Cütləşdirilməsi üzrə Birgə Müqavilə',
    'Ev Şəraitində Paltarların Yerləşdirilməsi Qaydaları üzrə Müqavilə',
    'İtmiş Corabların Axtarışı üzrə Məsuliyyətin Bölüşdürülməsi Müqaviləsi',
    'Paltaryuyan Maşının Boşaldılması Növbəsi üzrə Saziş'
  ],
  powersOptions: [
    'Corablar yalnız müəyyən edilmiş yerdə saxlanılır.',
    'Cütləşdirmə paltarın qurudulmasından sonra dərhal aparılır.',
    'İtkin düşmüş nüsxənin axtarışı birgə həyata keçirilir.',
    'Divanın altından çıxan corab mübahisə predmeti sayılmır.',
    'Paltaryuyan maşın növbə ilə boşaldılır.',
    'Cütü tapılmayan corab bir ay saxlanılır, sonra çıxarılır.',
    'Yeni corab alınması barədə qərar birgə qəbul edilir.',
    'Qonaq qarşısında corabın rəngi müzakirə edilmir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Müqavilənin şərtləri iki dəfə pozulduqda corabların cütləşdirilməsi öhdəliyi növbəti ay üçün tam olaraq pozuntuya yol vermiş tərəfə keçir.',
    'Pozuntu halında paltaryuyan maşının boşaldılması növbəsi ikiqat hesablanır.',
    'Müqavilə yalnız hər iki tərəfin razılığı ilə ləğv edilə bilər.'
  ]
},
{
  id: 'gps-authority', cat: 'couples', tone: 'zarafat', layout: 'teleqram', palette: 'gold',
  title: 'Avtomobildə Yol Göstərmə Səlahiyyətinin Dayandırılması haqqında Xəbərdarlıq', tag: 'Avtomobil',
  signOrg: 'Məişət Mübahisələri üzrə Arbitraj Kollegiyası',
  preamble: 'Sizə bildiririk ki, {to} adlı şəxsin naviqasiya göstərişlərinə etinasızlıq halları qeydə alınmış və marşrutun uzanmasına səbəb olmuşdur. {from} tərəfindən verilmiş məlumat əsasında yol göstərmə səlahiyyəti müvəqqəti olaraq dayandırılır.',
  powers: 'Marşrut yalnız naviqasiya sistemi üzrə müəyyən edilir.\nŞifahi qısa yol təklifi qəbul edilmir.\nDöngə barədə məlumat üç saniyə əvvəl verilir.\nSəhv döngəyə görə müzakirə açılmır.',
  penalty: 'Səlahiyyət növbəti səyahətdə, yalnız naviqasiyanın göstərişlərinə tam əməl edilməsi şərti ilə bərpa olunur.',
  titleOptions: [
    'Avtomobildə Yol Göstərmə Səlahiyyətinin Dayandırılması haqqında Xəbərdarlıq',
    'Naviqasiya Göstərişlərinə Etinasızlıq Halı haqqında Təcili Xəbərdarlıq',
    'Marşrutun Şifahi Dəyişdirilməsinin Qadağan Edilməsi haqqında Teleqram',
    'Sükan Arxasında Məsləhət Verilməsinin Məhdudlaşdırılması haqqında Teleqram'
  ],
  powersOptions: [
    'Marşrut yalnız naviqasiya sistemi üzrə müəyyən edilir.',
    'Şifahi qısa yol təklifi qəbul edilmir.',
    'Döngə barədə məlumat üç saniyə əvvəl verilir.',
    'Səhv döngəyə görə müzakirə açılmır.',
    'Musiqi seçimi sürücünün səlahiyyətindədir.',
    'Park yeri barədə məsləhət tələb olunduqda verilir.',
    'Yanacaq dayanacağı birgə müəyyən edilir.',
    'Gecikməyə görə məsuliyyət tərəflər arasında bölüşdürülür.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Səlahiyyət növbəti səyahətdə, yalnız naviqasiyanın göstərişlərinə tam əməl edilməsi şərti ilə bərpa olunur.',
    'İkinci pozuntu halında səlahiyyət bir ay müddətinə dayandırılır.',
    'Xəbərdarlıq qeydə alınır və növbəti səyahətdə nəzərə alınır.'
  ]
},
{
  id: 'peace-treaty', cat: 'couples', tone: 'zarafat', layout: 'ekspertiza', palette: 'gold',
  title: 'Mübahisənin Səbəbləri və Aradan Qaldırılması Yolları haqqında Rəy', tag: 'Sülh',
  signOrg: 'Məişət Mübahisələri üzrə Arbitraj Kollegiyası',
  preamble: 'Məsələyə dair aparılmış qiymətləndirmə nəticəsində müəyyən edilmişdir ki, {to} və {from} arasında yaranmış mübahisənin predmeti ilkin ehtimal edildiyindən xeyli kiçikdir. Tərəflərin hər ikisinin qismən haqlı olduğu qənaətinə gəlinmişdir.',
  powers: 'Mübahisənin predmeti əhəmiyyətsiz kateqoriyaya aid edilir.\nHər iki tərəfin qismən haqlı olduğu qeydə alınır.\nSəsin tonu münaqişəni ağırlaşdıran amil kimi qiymətləndirilir.\nBarışıq üçün əlavə tədbirlərə ehtiyac olmadığı müəyyən edilir.',
  penalty: 'Eyni mövzunun otuz gün ərzində yenidən qaldırılması halında rəy qüvvədən düşür və məsələyə yenidən baxılması tələb olunur.',
  titleOptions: [
    'Mübahisənin Səbəbləri və Aradan Qaldırılması Yolları haqqında Rəy',
    'Tərəflər Arasında Yaranmış Gərginliyin Qiymətləndirilməsinə dair Rəy',
    'Barışıq Prosesinin Nəticələrinin Təsdiqi haqqında Yekun Rəy',
    'Mübahisə Predmetinin Əhəmiyyət Dərəcəsinə dair Ekspert Rəyi'
  ],
  powersOptions: [
    'Mübahisənin predmeti əhəmiyyətsiz kateqoriyaya aid edilir.',
    'Hər iki tərəfin qismən haqlı olduğu qeydə alınır.',
    'Səsin tonu münaqişəni ağırlaşdıran amil kimi qiymətləndirilir.',
    'Barışıq üçün əlavə tədbirlərə ehtiyac olmadığı müəyyən edilir.',
    'Keçmiş epizodların xatırladılması təkrar gərginlik yaradan amildir.',
    'Susqunluq mövqe bildirmə forması kimi qəbul edilmir.',
    'Üçüncü şəxslərin rəyi qiymətləndirməyə daxil edilmir.',
    'Barışıq şirniyyat gətirilməsi ilə sürətləndirilə bilər.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Eyni mövzunun otuz gün ərzində yenidən qaldırılması halında rəy qüvvədən düşür və məsələyə yenidən baxılması tələb olunur.',
    'Rəy tərəflərin razılığı ilə istənilən vaxt yenidən nəzərdən keçirilə bilər.',
    'Barışıq şərtləri pozulduqda məsələ təkrar araşdırmaya göndərilir.'
  ]
},

/* ==================== DOSTLAR ==================== */
{
  id: 'friend-traitor', cat: 'friends', tone: 'zarafat', layout: 'qerar', palette: 'burgundy',
  title: 'Dostluq Öhdəliklərinin Pozulması Faktının Təsbit Edilməsi haqqında Qərar', tag: 'Hit',
  signOrg: 'Dostlararası Mübahisələrin Həlli üzrə Ali Məclis',
  powersLabel: 'TƏSDİQLƏNMİŞ HALLAR',
  preamble: 'Məclis {to} adlı şəxsin son üç ay ərzindəki davranışını araşdıraraq müəyyən etmişdir ki, birgə razılaşdırılmış planlardan son anda imtina halları sistemli xarakter almışdır. {from} tərəfindən verilmiş müraciət əsaslı hesab edilir.',
  powers: 'Plandan imtina ən azı bir gün əvvəl bildirilməlidir.\nSon anda göstərilən səbəb yazılı formada təqdim edilir.\nEyni səbəb ayda iki dəfədən artıq irəli sürülmür.\nNövbəti görüşün yeri zərərçəkmiş tərəf tərəfindən seçilir.',
  penalty: 'Qərarın icra edilməməsi halında növbəti üç görüşün yeri, vaxtı və ödəniş qaydası tam olaraq digər tərəf tərəfindən müəyyən edilir.',
  titleOptions: [
    'Dostluq Öhdəliklərinin Pozulması Faktının Təsbit Edilməsi haqqında Qərar',
    'Söz Verib Gəlməmək Halının Dostluq Pozuntusu Sayılması haqqında Qərar',
    'Birgə Plandan Son Anda İmtina Edilməsi haqqında Yekun Qətnamə',
    'Dostluq Statusunun Müvəqqəti Aşağı Salınması haqqında Qərar'
  ],
  powersOptions: [
    'Plandan imtina ən azı bir gün əvvəl bildirilməlidir.',
    'Son anda göstərilən səbəb yazılı formada təqdim edilir.',
    'Eyni səbəb ayda iki dəfədən artıq irəli sürülmür.',
    'Növbəti görüşün yeri zərərçəkmiş tərəf tərəfindən seçilir.',
    'Qrup söhbətində susmaq razılıq kimi qiymətləndirilmir.',
    'Yolda olduğunu bildirən mesaj yerin göstərilməsi ilə təsdiqlənir.',
    'Bilet alınıbsa imtina maliyyə öhdəliyi yaradır.',
    'Üzrxahlıq şirniyyat gətirilməsi ilə müşayiət olunur.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Qərarın icra edilməməsi halında növbəti üç görüşün yeri, vaxtı və ödəniş qaydası tam olaraq digər tərəf tərəfindən müəyyən edilir.',
    'Statusun bərpası üçün ardıcıl üç dəfə vaxtında gəlmək tələb olunur.',
    'Etiraz qəbul edilir, lakin qərarın qüvvəsinə təsir göstərmir.'
  ]
},
{
  id: 'debt-license', cat: 'friends', tone: 'zarafat', layout: 'lisenziya', palette: 'gold',
  title: 'Dostlararası Borcun Qaytarılma Müddətinin Uzadılmasına dair Lisenziya', tag: 'Təhlükəli',
  signOrg: 'Dostlararası Maliyyə Münasibətləri üzrə Şura',
  toLabel: 'LİSENZİYA SAHİBİ', fromLabel: 'BORC VERƏN',
  preamble: '{from} tərəfindən {to} adlı şəxsə verilmiş borcun qaytarılma müddətinin uzadılmasına icazə verilir. Lisenziya məbləğin ilkin razılaşdırılmış həddi aşmaması şərti ilə qüvvədədir, faiz nəzərdə tutmur və üçüncü şəxslərə ötürülmür.',
  powers: 'Borc barədə xatırlatma ayda bir dəfədən artıq edilmir.\nQaytarılma müddəti bir dəfə uzadıla bilər.\nMəbləğ yuvarlaqlaşdırıldıqda fərq tələb olunmur.\nBorc üçüncü şəxslərlə müzakirə edilmir.',
  penalty: 'Borc üç aydan artıq qaytarılmadıqda lisenziya qüvvədən düşür və yeni borc müraciətinə baxılması dayandırılır.',
  titleOptions: [
    'Dostlararası Borcun Qaytarılma Müddətinin Uzadılmasına dair Lisenziya',
    'Borcun Qaytarılmasının Təxirə Salınmasına dair Müddətli Lisenziya',
    '«Maaşdan sonra verərəm» Şərtli Ödəniş Rejiminə dair Lisenziya',
    'Kiçik Məbləğli Borcun Unudulmasına dair Xüsusi İcazə'
  ],
  powersOptions: [
    'Borc barədə xatırlatma ayda bir dəfədən artıq edilmir.',
    'Qaytarılma müddəti bir dəfə uzadıla bilər.',
    'Məbləğ yuvarlaqlaşdırıldıqda fərq tələb olunmur.',
    'Borc üçüncü şəxslərlə müzakirə edilmir.',
    'Hissə-hissə ödəniş qəbul edilir.',
    'Qonaqlıq ödənişi borcun bir hissəsi kimi hesablana bilər.',
    'Yeni borc əvvəlki bağlanmadan verilmir.',
    'Ödəniş tarixi hər iki tərəf tərəfindən qeyd edilir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Borc üç aydan artıq qaytarılmadıqda lisenziya qüvvədən düşür və yeni borc müraciətinə baxılması dayandırılır.',
    'Məbləğin razılaşdırılmış həddi aşması lisenziyanı dərhal ləğv edir.',
    'Lisenziya yalnız ödəniş cədvəlinə əməl edildiyi müddətdə qüvvədədir.'
  ]
},
{
  id: 'secret-keeper', cat: 'friends', tone: 'zarafat', layout: 'blank', palette: 'steel',
  title: 'Etibar Edilmiş Məlumatın Açıqlanmaması Barədə Rəsmi Bəyannamə', tag: 'Rəsmi',
  signOrg: 'Dostluq Öhdəliklərinin Qeydiyyatı üzrə Komissiya',
  toLabel: 'Öhdəlik götürən', fromLabel: 'Sirri açıqlayan',
  preamble: 'Bu bəyannamə ilə {to} adlı şəxs {from} tərəfindən ona etibar edilmiş məlumatı üçüncü şəxslərə açıqlamayacağını bəyan edir. Öhdəlik müddətsizdir, məlumatın aktuallığını itirməsi ilə sona çatmır və yaxın qohumlara da şamil olunur.',
  powers: 'Məlumat heç bir formada üçüncü şəxsə ötürülmür.\nSöhbətin ekran görüntüsü saxlanılmır.\nYaxın qohumlar da üçüncü şəxs sayılır.\n«Bir nəfərə dedim» ifadəsi pozuntu hesab edilir.',
  penalty: 'Bəyannamənin pozulması halında pozuntuya yol vermiş tərəf gələcəkdə heç bir məxfi məlumata etibar edilməyən şəxslər siyahısına daxil edilir.',
  titleOptions: [
    'Etibar Edilmiş Məlumatın Açıqlanmaması Barədə Rəsmi Bəyannamə',
    'Sirrin Üçüncü Şəxslərə Ötürülməməsi Barədə Müddətsiz Bəyannamə',
    'Məxfi Söhbətin Qrup Çatına Çıxarılmaması Barədə Bəyannamə',
    'Etibar Rejiminin Müddətsiz Saxlanılması Barədə Bildiriş'
  ],
  powersOptions: [
    'Məlumat heç bir formada üçüncü şəxsə ötürülmür.',
    'Söhbətin ekran görüntüsü saxlanılmır.',
    'Yaxın qohumlar da üçüncü şəxs sayılır.',
    '«Bir nəfərə dedim» ifadəsi pozuntu hesab edilir.',
    'Məlumatın işarə ilə bildirilməsi də açıqlama sayılır.',
    'Söhbətin mövzusu qrup çatına çıxarılmır.',
    'Sirri bilən şəxslərin siyahısı genişləndirilmir.',
    'Öhdəlik məlumatın köhnəlməsi ilə sona çatmır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Bəyannamənin pozulması halında pozuntuya yol vermiş tərəf gələcəkdə heç bir məxfi məlumata etibar edilməyən şəxslər siyahısına daxil edilir.',
    'Pozuntu halında etibar rejimi bir il müddətinə dayandırılır.',
    'Öhdəliyin qüvvəsi hər iki tərəfə bərabər şəkildə şamil olunur.'
  ]
},
{
  id: 'late-pass', cat: 'friends', tone: 'zarafat', layout: 'vesiqe', palette: 'burgundy',
  title: 'Görüşlərə Sistemli Gecikmə Halının Rəsmiləşdirilməsinə dair Vəsiqə', tag: 'Sevimli',
  signOrg: 'Dostlararası Mübahisələrin Həlli üzrə Ali Məclis',
  preamble: 'Bu vəsiqə {to} adlı şəxsin görüşlərə mütəmadi olaraq gecikməsi faktını rəsmiləşdirir. Sənəd {from} tərəfindən, uzunmüddətli müşahidə nəticəsində gecikmənin artıq təsadüf deyil, sabit xarakteristika olduğu qənaətinə gəlindikdən sonra verilmişdir.',
  powers: 'Görüş saatı təyin edilərkən iyirmi dəqiqə ehtiyat nəzərə alınır.\n«Yoldayam» ifadəsi yerin göstərilməsi ilə təsdiqlənir.\nGecikmənin səbəbi hər dəfə yenidən izah edilmir.\nVaxtında gəlmək halı ayrıca qeydə alınır.',
  penalty: 'Vəsiqə uçuş, qatar və kinoteatr seansı kimi vaxta bağlı hallara şamil edilmir; həmin hallarda gecikmə tam məsuliyyət doğurur.',
  titleOptions: [
    'Görüşlərə Sistemli Gecikmə Halının Rəsmiləşdirilməsinə dair Vəsiqə',
    'Gecikmə Vaxtının Əvvəlcədən Nəzərə Alınmasına dair Vəsiqə',
    'Görüş Saatının Fərdi Qaydada Hesablanmasına dair Şəhadətnamə',
    '«Yoldayam» İfadəsinin Statusunu Təsbit edən Vəsiqə'
  ],
  powersOptions: [
    'Görüş saatı təyin edilərkən iyirmi dəqiqə ehtiyat nəzərə alınır.',
    '«Yoldayam» ifadəsi yerin göstərilməsi ilə təsdiqlənir.',
    'Gecikmənin səbəbi hər dəfə yenidən izah edilmir.',
    'Vaxtında gəlmək halı ayrıca qeydə alınır.',
    'Kinoteatr və uçuş kimi hallar vəsiqədən kənardadır.',
    'İlk gələn masa və yer seçimi hüququ qazanır.',
    'Yarım saatdan artıq gecikmə xəbərdarlıq tələb edir.',
    'Gecikmə müddəti növbəti hesabın ödənilməsində nəzərə alınır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Vəsiqə uçuş, qatar və kinoteatr seansı kimi vaxta bağlı hallara şamil edilmir; həmin hallarda gecikmə tam məsuliyyət doğurur.',
    'Bir saatdan artıq gecikmə vəsiqəni həmin gün üçün qüvvədən salır.',
    'Ardıcıl üç dəfə vaxtında gəlmək vəsiqənin ləğvinə əsas verir.'
  ]
},
{
  id: 'best-friend-diploma', cat: 'friends', tone: 'zarafat', layout: 'diplom', palette: 'gold',
  title: 'Uzunillik Dostluq və Sədaqətə Görə Verilmiş Fəxri Diplom', tag: 'Hədiyyə',
  signOrg: 'Dostluq Öhdəliklərinin Qeydiyyatı üzrə Komissiya',
  preamble: 'Komissiya {to} adlı şəxsin uzun illər ərzində göstərdiyi sədaqəti və çətin anlarda nümayiş etdirdiyi mövqeyi qiymətləndirərək təltif haqqında qərar qəbul etmişdir. Diplom {from} tərəfindən təqdim olunur, müddətsizdir və geri alınmır.',
  powers: 'Gecə saatlarında edilən zəngə cavab vermək.\nXoşagəlməz həqiqəti üzə demək bacarığı.\nHeç bir izahat tələb etmədən köməyə gəlmək.\nİllər keçsə də münasibəti dəyişməmək.',
  penalty: 'Diplom geri alınmır və müddətsizdir. Təltif olunan şəxs bu sənədə istinad edərək istənilən vaxt kömək tələb edə bilər.',
  titleOptions: [
    'Uzunillik Dostluq və Sədaqətə Görə Verilmiş Fəxri Diplom',
    'Çətin Anlarda Yanında Olmaq Sahəsindəki Nəticələrə Görə Diplom',
    'Dostluq Öhdəliklərinin Nümunəvi İcrasına Görə Fəxri Diplom',
    'İllər Ərzində Dəyişməyən Münasibətə Görə Verilmiş Fəxri Nişan'
  ],
  powersOptions: [
    'Gecə saatlarında edilən zəngə cavab vermək.',
    'Xoşagəlməz həqiqəti üzə demək bacarığı.',
    'Heç bir izahat tələb etmədən köməyə gəlmək.',
    'İllər keçsə də münasibəti dəyişməmək.',
    'Uzun səsli mesajı sona qədər dinləmək.',
    'Köhnə söhbətləri lazım olmayanda xatırlatmamaq.',
    'Uğur xəbərini birinci bölüşmək hüququ.',
    'Mübahisədən sonra ilk addımı atmaq.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Diplom geri alınmır və müddətsizdir. Təltif olunan şəxs bu sənədə istinad edərək istənilən vaxt kömək tələb edə bilər.',
    'Diplom yalnız hər iki tərəfin razılığı ilə arxivə verilir.',
    'Təltif ildönümlərində yenidən təsdiq edilir.'
  ]
},
{
  id: 'group-chat', cat: 'friends', tone: 'zarafat', layout: 'teleqram', palette: 'ink',
  title: 'Qrup Söhbətində Uzunmüddətli Susqunluq Halı haqqında Xəbərdarlıq', tag: 'Rəqəmsal',
  signOrg: 'Dostluq Öhdəliklərinin Qeydiyyatı üzrə Komissiya',
  powersLabel: 'AKTIN ƏHATƏ ETDİYİ HÜQUQLAR',
  preamble: 'Sizə bildiririk ki, {to} adlı şəxsin qrup söhbətindəki susqunluğu qeyri-adi müddətə çatmışdır. {from} tərəfindən vəziyyətin aydınlaşdırılması tələb edilir; iştirakçılar arasında narahatlıq yaranmış və müxtəlif ehtimallar irəli sürülmüşdür.',
  powers: 'Susqunluq müddəti yeddi günü keçmişdir.\nOxunmamış mesajların sayı iki yüzdən çoxdur.\nSon fəallıq yalnız reaksiya qoymaqla məhdudlaşıb.\nQrupdan çıxış barədə məlumat verilməyib.',
  penalty: 'Xəbərdarlığa cavab verilmədikdə növbəti görüşün yeri və ödəniş qaydası susqun tərəfin iştirakı olmadan müəyyən edilir.',
  titleOptions: [
    'Qrup Söhbətində Uzunmüddətli Susqunluq Halı haqqında Xəbərdarlıq',
    'Qrupdakı Mesajlara Cavab Verilməməsi haqqında Təcili Teleqram',
    'Bildirişlərin Söndürülməsi Faktının Qeydə Alınması haqqında Xəbərdarlıq',
    'Qrup Söhbətinə Qayıdış Tələbi haqqında Təcili Teleqram'
  ],
  powersOptions: [
    'Susqunluq müddəti yeddi günü keçmişdir.',
    'Oxunmamış mesajların sayı iki yüzdən çoxdur.',
    'Son fəallıq yalnız reaksiya qoymaqla məhdudlaşıb.',
    'Qrupdan çıxış barədə məlumat verilməyib.',
    'Şəxsi mesajlara cavab verildiyi müəyyən edilib.',
    'Səsli mesajların dinlənilmə statusu naməlumdur.',
    'Qrupun adı və şəkli dəyişdirilməyib.',
    'Görüş təklifi cavabsız qalıb.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Xəbərdarlığa cavab verilmədikdə növbəti görüşün yeri və ödəniş qaydası susqun tərəfin iştirakı olmadan müəyyən edilir.',
    'Susqunluq daha yeddi gün davam etsə, qrupun adı dəyişdirilir.',
    'Cavab verildikdə xəbərdarlıq qüvvədən düşür.'
  ]
},
{
  id: 'photo-rights', cat: 'friends', tone: 'zarafat', layout: 'sertifikat', palette: 'forest',
  title: 'Birgə Çəkilmiş Şəkillərin Paylaşılması Qaydalarının Sertifikatı', tag: 'İnstaqram',
  signOrg: 'Dostluq Öhdəliklərinin Qeydiyyatı üzrə Komissiya',
  preamble: 'Bununla təsdiq edilir ki, {to} adlı şəxs birgə çəkilmiş şəkillərin paylaşılması qaydalarına əməl edir. Sertifikat {from} tərəfindən, uzun müddət ərzində heç bir uğursuz kadrın paylaşılmadığı əsas götürülərək verilir.',
  powers: 'Birgə şəkil paylaşılmazdan əvvəl razılıq alınır.\nUğursuz kadr saxlanılmır və göndərilmir.\nOn kadrdan ən azı üçü qarşı tərəf üçün çəkilir.\nŞəklin işlənməsi qarşılıqlı razılaşdırılır.',
  penalty: 'Uğursuz kadrın paylaşılması halında sertifikat dərhal qüvvədən düşür və növbəti altı ay ərzində birgə şəkil çəkilməsi dayandırılır.',
  titleOptions: [
    'Birgə Çəkilmiş Şəkillərin Paylaşılması Qaydalarının Sertifikatı',
    'Uğursuz Kadrların Paylaşılmamasını Təsdiq edən Sertifikat',
    'Şəkil Seçimində Qarşılıqlı Razılıq Rejiminin Sertifikatı',
    'Birgə Kadrların İşlənməsi Qaydalarına dair Şəhadətnamə'
  ],
  powersOptions: [
    'Birgə şəkil paylaşılmazdan əvvəl razılıq alınır.',
    'Uğursuz kadr saxlanılmır və göndərilmir.',
    'On kadrdan ən azı üçü qarşı tərəf üçün çəkilir.',
    'Şəklin işlənməsi qarşılıqlı razılaşdırılır.',
    'Arxiv şəkillər xəbər verilmədən paylaşılmır.',
    'Etiketləmə əvvəlcədən razılaşdırılır.',
    'Şəkil silinmə tələbi bir gün ərzində icra edilir.',
    'Video materiala da eyni qaydalar şamil edilir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Uğursuz kadrın paylaşılması halında sertifikat dərhal qüvvədən düşür və növbəti altı ay ərzində birgə şəkil çəkilməsi dayandırılır.',
    'Razılıqsız paylaşım sertifikatın yenidən baxılmasına əsas verir.',
    'Sertifikat yalnız qarşılıqlı əməletmə şərti ilə qüvvədədir.'
  ]
},
{
  id: 'taxi-split', cat: 'friends', tone: 'zarafat', layout: 'arayis', palette: 'forest',
  title: 'Taksi Xərcinin Bölüşdürülməsi Qaydasının Müəyyən Edilməsi haqqında Arayış', tag: 'Hesablaşma',
  signOrg: 'Dostlararası Maliyyə Münasibətləri üzrə Şura',
  preamble: 'Verilir {to} adlı şəxsə ondan ötrü ki, taksi xərcinin bölüşdürülməsi qaydası {from} ilə birgə müəyyən edilmişdir. Arayış marşrutun uzanması və əlavə dayanacaqlar da daxil olmaqla bütün halları əhatə edir.',
  powers: 'Xərc iştirakçıların sayına bərabər bölünür.\nƏn son düşən şəxs əlavə məsafənin haqqını ödəyir.\nÖdəniş həmin gün ərzində köçürülür.\nQırıq məbləğ ödəyənin xeyrinə yuvarlaqlaşdırılır.',
  penalty: 'Ödəniş üç gün ərzində köçürülmədikdə növbəti səfərin bütün xərci gecikdirən tərəfin üzərinə düşür.',
  titleOptions: [
    'Taksi Xərcinin Bölüşdürülməsi Qaydasının Müəyyən Edilməsi haqqında Arayış',
    'Yol Xərclərinin İştirakçılar Arasında Bölgüsü haqqında Arayış',
    'Ödənişin Sonradan Köçürülməsi Öhdəliyi haqqında Rəsmi Arayış',
    'Marşrutun Uzanmasına Görə Əlavə Xərcin Bölgüsü haqqında Arayış'
  ],
  powersOptions: [
    'Xərc iştirakçıların sayına bərabər bölünür.',
    'Ən son düşən şəxs əlavə məsafənin haqqını ödəyir.',
    'Ödəniş həmin gün ərzində köçürülür.',
    'Qırıq məbləğ ödəyənin xeyrinə yuvarlaqlaşdırılır.',
    'Əlavə dayanacaq təklif edən şəxs fərqi ödəyir.',
    'Ön oturacaq növbə ilə tutulur.',
    'Ödənişi edən şəxs marşrutu seçmək hüququ qazanır.',
    'Sifariş kimin telefonundan verilibsə, hesab ona yazılır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Ödəniş üç gün ərzində köçürülmədikdə növbəti səfərin bütün xərci gecikdirən tərəfin üzərinə düşür.',
    'Borc növbəti sifarişdən avtomatik tutulmuş sayılır.',
    'Arayış yalnız əvvəlcədən razılaşdırılmış marşrutlara şamil edilir.'
  ]
},
{
  id: 'plan-canceller', cat: 'friends', tone: 'zarafat', layout: 'ekspertiza', palette: 'ink',
  title: 'Birgə Planların Ləğvi Səbəblərinin Qiymətləndirilməsi haqqında Rəy', tag: 'Universal',
  signOrg: 'Dostlararası Mübahisələrin Həlli üzrə Ali Məclis',
  toLabel: 'LİSENZİYA SAHİBİ',
  preamble: 'Aparılmış qiymətləndirmə nəticəsində müəyyən edilmişdir ki, {to} adlı şəxsin birgə planlardan imtina səbəbləri təkrarlanan xarakter daşıyır. Rəy {from} tərəfindən verilmiş müraciət əsasında, son altı ayın müşahidələrinə istinadən tərtib edilmişdir.',
  powers: 'İmtina səbəbləri üç əsas kateqoriyaya bölünür.\nƏn çox istifadə olunan səbəb yorğunluqdur.\nİmtina adətən görüşdən iki saat əvvəl bildirilir.\nEvdən çıxma ehtimalı otuz faiz qiymətləndirilir.',
  penalty: 'Rəy növbəti üç görüşdə iştirak təmin edildikdə yenidən nəzərdən keçirilir və göstəricilər müsbət istiqamətdə dəyişdirilir.',
  titleOptions: [
    'Birgə Planların Ləğvi Səbəblərinin Qiymətləndirilməsi haqqında Rəy',
    'Son Anda İmtina Hallarının Statistik Təhlili haqqında Ekspert Rəyi',
    'Plandan İmtina Səbəblərinin Etibarlılıq Dərəcəsinə dair Rəy',
    'Evdən Çıxmaq Niyyətinin Real Ehtimalının Qiymətləndirilməsinə dair Rəy'
  ],
  powersOptions: [
    'İmtina səbəbləri üç əsas kateqoriyaya bölünür.',
    'Ən çox istifadə olunan səbəb yorğunluqdur.',
    'İmtina adətən görüşdən iki saat əvvəl bildirilir.',
    'Evdən çıxma ehtimalı otuz faiz qiymətləndirilir.',
    'Hava şəraiti arqumenti mövsümdən asılı olmadan işlədilir.',
    'Bilet alındıqda imtina ehtimalı kəskin azalır.',
    'Qonaqlıq təklifi iştirak ehtimalını artırır.',
    'Səhər təsdiqlənən plan axşam dəyişdirilir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Rəy növbəti üç görüşdə iştirak təmin edildikdə yenidən nəzərdən keçirilir və göstəricilər müsbət istiqamətdə dəyişdirilir.',
    'İmtina halları davam etdikdə plan siyahısı yenidən tərtib edilir.',
    'Rəy yalnız qeyri-rəsmi görüşlərə şamil edilir.'
  ]
},
{
  id: 'wedding-table', cat: 'friends', tone: 'zarafat', layout: 'notarial', palette: 'burgundy',
  title: 'Toy Mərasimində Masa və Yer Seçimi Səlahiyyətinin Verilməsinə dair Akt', tag: 'Mövsümi',
  signOrg: 'Dostluq Öhdəliklərinin Qeydiyyatı üzrə Komissiya',
  preamble: 'İş üzrə toplanmış məlumatlara əsasən {from} tərəfindən {to} adlı şəxsə toy mərasimində masa və yer seçimi səlahiyyəti verilir. Səlahiyyət yalnız dostlar qrupuna aid masalara şamil olunur və mərasim başa çatanadək qüvvədə qalır.',
  powers: 'Masanın yeri mərasim başlamazdan əvvəl müəyyən edilir.\nSəhnəyə yaxın yerlər növbə ilə tutulur.\nGec gələn qonaq boş qalan yeri seçir.\nMasa dəyişikliyi qrupun razılığı ilə mümkündür.',
  penalty: 'Səlahiyyət sahibi mərasimə gecikdikdə bu hüquq avtomatik olaraq ilk gələn qonağa keçir və geri qaytarılmır.',
  titleOptions: [
    'Toy Mərasimində Masa və Yer Seçimi Səlahiyyətinin Verilməsinə dair Akt',
    'Toy Masasında Yerlərin Bölüşdürülməsi Səlahiyyətinə dair Akt',
    'Mərasim Zamanı Qonaq Yerləşdirilməsi Qaydasına dair Etibarnamə',
    'Toy Masası Arxasında Nizamın Təmin Edilməsinə dair Akt'
  ],
  powersOptions: [
    'Masanın yeri mərasim başlamazdan əvvəl müəyyən edilir.',
    'Səhnəyə yaxın yerlər növbə ilə tutulur.',
    'Gec gələn qonaq boş qalan yeri seçir.',
    'Masa dəyişikliyi qrupun razılığı ilə mümkündür.',
    'Rəqs meydançasına çıxış yolu bağlanmır.',
    'Foto çəkilişi üçün masa müvəqqəti tərk edilə bilər.',
    'Uşaqlı qonaqlara kənar masalar təklif edilir.',
    'Şirniyyat bölgüsü masa daxilində aparılır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Səlahiyyət sahibi mərasimə gecikdikdə bu hüquq avtomatik olaraq ilk gələn qonağa keçir və geri qaytarılmır.',
    'Səlahiyyət yalnız bir mərasim üçün verilir.',
    'Masa nizamının pozulması səlahiyyətin ləğvinə əsasdır.'
  ]
},
{
  id: 'dietary-oath', cat: 'friends', tone: 'zarafat', layout: 'muqavile', palette: 'forest',
  title: 'Birgə Pəhriz Rejiminə Əməl Edilməsi üzrə Qarşılıqlı Müqavilə', tag: 'Yanvar',
  signOrg: 'Dostluq Öhdəliklərinin Qeydiyyatı üzrə Komissiya',
  toLabel: 'And içən', fromLabel: 'Şahid',
  preamble: 'Tərəflərin mövqeyi nəzərə alınmaqla, {from} və {to} arasında birgə pəhriz rejiminə əməl edilməsi barədə razılıq əldə edilmişdir. Müqavilə hər iki tərəfə bərabər öhdəliklər yükləyir və birtərəfli qaydada ləğv edilmir.',
  powers: 'Şirniyyat yalnız birgə qərarla qəbul edilir.\nGecə saat 22:00-dan sonra qidalanma dayandırılır.\nNəticələr həftədə bir dəfə müqayisə edilir.\nPozuntu barədə məlumat könüllü verilir.',
  penalty: 'Müqaviləni birinci pozan tərəf digərinə bir qonaqlıq təşkil etmək öhdəliyi daşıyır və növbəti ayın rejimini müəyyən etmək hüququndan məhrum edilir.',
  titleOptions: [
    'Birgə Pəhriz Rejiminə Əməl Edilməsi üzrə Qarşılıqlı Müqavilə',
    'Şirniyyatdan İmtina Öhdəliyinin Birgə İcrası üzrə Saziş',
    'Pəhriz Dövründə Qarşılıqlı Nəzarət Qaydaları üzrə Müqavilə',
    'Yanvar Ayı üçün Qida Rejiminin Müəyyən Edilməsi üzrə Saziş'
  ],
  powersOptions: [
    'Şirniyyat yalnız birgə qərarla qəbul edilir.',
    'Gecə saat 22:00-dan sonra qidalanma dayandırılır.',
    'Nəticələr həftədə bir dəfə müqayisə edilir.',
    'Pozuntu barədə məlumat könüllü verilir.',
    'Bayram süfrəsi istisna gün kimi qeyd edilir.',
    'Qonaqlıqda təklif edilən yemək pozuntu sayılmır.',
    'Su rejimi ayrıca nəzarətə götürülür.',
    'Birgə idman həftədə iki dəfə planlaşdırılır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Müqaviləni birinci pozan tərəf digərinə bir qonaqlıq təşkil etmək öhdəliyi daşıyır və növbəti ayın rejimini müəyyən etmək hüququndan məhrum edilir.',
    'Hər iki tərəf eyni gün pozuntuya yol verərsə, hal qeydə alınmır.',
    'Müqavilə yalnız qarşılıqlı razılıqla dayandırıla bilər.'
  ]
},
{
  id: 'gossip-license', cat: 'friends', tone: 'zarafat', layout: 'viza', palette: 'forest',
  title: 'Ümumi Tanışlar Barədə Söhbətin Aparılmasına dair Məhdud İcazə', tag: 'Padruqa',
  signOrg: 'Dostlararası Mübahisələrin Həlli üzrə Ali Məclis',
  powersLabel: 'İCAZƏ VERİLƏN MÖVZULAR',
  preamble: '{from} tərəfindən {to} adlı şəxsə ümumi tanışlar barədə söhbət aparmaq üçün məhdud icazə verilir. İcazə yalnız iki tərəf arasında qüvvədədir və üçüncü şəxsin iştirakı ilə keçirilən söhbətlərə şamil edilmir.',
  powers: 'Söhbətin məzmunu heç kimə ötürülmür.\nMənbənin adı heç bir halda açıqlanmır.\nSöhbətin müddəti iki saatı keçmir.\nEkran görüntüsü çəkilmir və saxlanılmır.',
  penalty: 'Söhbətin məzmunu üçüncü şəxsə çatdıqda icazə dərhal qüvvədən düşür və yeni icazə ən azı bir il müddətinə verilmir.',
  titleOptions: [
    'Ümumi Tanışlar Barədə Söhbətin Aparılmasına dair Məhdud İcazə',
    'Məlumat Mübadiləsinin Qapalı Rejimdə Aparılmasına dair İcazə',
    'Söhbətin Mövzu və Müddət Hüdudlarının Müəyyən Edilməsinə dair İcazə',
    'Qarşılıqlı Məlumat Paylaşımının Rəsmiləşdirilməsinə dair İcazə'
  ],
  powersOptions: [
    'Söhbətin məzmunu heç kimə ötürülmür.',
    'Mənbənin adı heç bir halda açıqlanmır.',
    'Söhbətin müddəti iki saatı keçmir.',
    'Ekran görüntüsü çəkilmir və saxlanılmır.',
    'Söhbət yalnız qapalı şəraitdə aparılır.',
    'Yeni məlumat qarşılıqlı əsasda bölüşülür.',
    'Təsdiqlənməmiş məlumat ehtimal kimi göstərilir.',
    'Mövzu iştirakçılardan birinin xahişi ilə dəyişdirilir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Söhbətin məzmunu üçüncü şəxsə çatdıqda icazə dərhal qüvvədən düşür və yeni icazə ən azı bir il müddətinə verilmir.',
    'Mənbənin açıqlanması icazənin müddətsiz ləğvinə əsasdır.',
    'İcazə yalnız qarşılıqlılıq prinsipi gözlənildiyi halda qüvvədədir.'
  ]
},

/* ==================== İŞ YERİ ==================== */
{
  id: 'salary-diploma', cat: 'work', tone: 'zarafat', layout: 'diplom', palette: 'steel',
  title: 'Görünən Fəaliyyət Göstərmədən Nəticə Əldə Etməyə Görə Fəxri Diplom', tag: 'Fəxri ad',
  signOrg: 'Ofis Nizamı və Əmək Rejimi üzrə Baş İdarə',
  preamble: 'Baş İdarə {to} adlı şəxsin iş prosesindəki fəaliyyətini araşdıraraq müəyyən etmişdir ki, nəticə ilə sərf edilmiş görünən səy arasında nadir rast gəlinən nisbət yaranmışdır. Diplom {from} tərəfindən təqdim olunur.',
  powers: 'Toplantıda vaxtında başını tərpətmək bacarığı.\nEkranda həmişə açıq sənəd saxlamaq.\nRəhbər keçəndə klaviaturaya toxunmaq.\nHesabatı son gün, lakin vaxtında təqdim etmək.',
  penalty: 'Diplom geri alınmır. Lakin təltif olunan şəxs il ərzində ən azı bir dəfə könüllü olaraq əlavə tapşırıq götürmək öhdəliyi daşıyır.',
  titleOptions: [
    'Görünən Fəaliyyət Göstərmədən Nəticə Əldə Etməyə Görə Fəxri Diplom',
    'İş Prosesində Minimal Enerji Sərfiyyatına Görə Fəxri Diplom',
    'Monitorun Qarşısında Sabit Mövcudluğa Görə Verilmiş Diplom',
    'Zəruri Anlarda Görünmək Bacarığına Görə Fəxri Diplom'
  ],
  powersOptions: [
    'Toplantıda vaxtında başını tərpətmək bacarığı.',
    'Ekranda həmişə açıq sənəd saxlamaq.',
    'Rəhbər keçəndə klaviaturaya toxunmaq.',
    'Hesabatı son gün, lakin vaxtında təqdim etmək.',
    'Səhər ilk gələnlərdən biri kimi görünmək.',
    'Yazışmada qısa və inandırıcı cavab vermək.',
    'Çətin sualı düzgün şəxsə yönləndirmək.',
    'Nahar fasiləsini dəqiq hesablamaq.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Diplom geri alınmır. Lakin təltif olunan şəxs il ərzində ən azı bir dəfə könüllü olaraq əlavə tapşırıq götürmək öhdəliyi daşıyır.',
    'Diplom yalnız qeyri-rəsmi kollektiv tədbirlərdə nümayiş etdirilir.',
    'Təltif növbəti ilin nəticələrinə görə yenidən baxılır.'
  ]
},
{
  id: 'meeting-silence', cat: 'work', tone: 'zarafat', layout: 'sertifikat', palette: 'ink',
  title: 'Toplantı Zamanı Susmaq və Vaxtı Uzatmamaq Bacarığının Sertifikatı', tag: 'Toplantı',
  signOrg: 'Ofis Nizamı və Əmək Rejimi üzrə Baş İdarə',
  preamble: 'Bununla təsdiq edilir ki, {to} adlı şəxs toplantılar zamanı müzakirəni uzadan sual verməmək bacarığı nümayiş etdirmişdir. Sertifikat {from} tərəfindən, kollektivin ümumi vaxtına göstərilən qayğı nəzərə alınaraq verilir.',
  powers: 'Toplantının sonunda əlavə sual verilmir.\nArtıq razılaşdırılmış məsələ yenidən açılmır.\n«Bir də qısa deyim» ifadəsi işlədilmir.\nEkran paylaşımı vaxtında dayandırılır.',
  penalty: 'Toplantını iyirmi dəqiqədən artıq uzadan sual verildikdə sertifikat həmin rüb üçün qüvvədən düşür və növbəti toplantının protokolu sahib tərəfindən yazılır.',
  titleOptions: [
    'Toplantı Zamanı Susmaq və Vaxtı Uzatmamaq Bacarığının Sertifikatı',
    'Uzun Toplantılarda Diqqətli Görünmə Bacarığının Sertifikatı',
    'Sualı Toplantının Sonunda Verməmək Bacarığına dair Sertifikat',
    'Toplantı Vaxtının Qorunmasına Verilən Töhfənin Şəhadətnaməsi'
  ],
  powersOptions: [
    'Toplantının sonunda əlavə sual verilmir.',
    'Artıq razılaşdırılmış məsələ yenidən açılmır.',
    '«Bir də qısa deyim» ifadəsi işlədilmir.',
    'Ekran paylaşımı vaxtında dayandırılır.',
    'Gündəlikdən kənar mövzu qaldırılmır.',
    'Cavabı yazışma ilə verilə bilən sual səsləndirilmir.',
    'Toplantıya vaxtında qoşulur.',
    'Mikrofon danışılmadıqda söndürülür.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Toplantını iyirmi dəqiqədən artıq uzadan sual verildikdə sertifikat həmin rüb üçün qüvvədən düşür və növbəti toplantının protokolu sahib tərəfindən yazılır.',
    'Sertifikat hər rübün sonunda yenidən qiymətləndirilir.',
    'Vaxtı qorunan toplantı sertifikatın müddətini uzadır.'
  ]
},
{
  id: 'coffee-authority', cat: 'work', tone: 'zarafat', layout: 'notarial', palette: 'gold',
  title: 'Kofe Maşını üzərində Nəzarət Səlahiyyətinin Verilməsinə dair Akt', tag: 'Kofe',
  signOrg: 'Ofis Nizamı və Əmək Rejimi üzrə Baş İdarə',
  preamble: 'İş üzrə toplanmış məlumatlara əsasən {from} tərəfindən {to} adlı şəxsə kofe maşını üzərində nəzarət səlahiyyəti verilir. Səlahiyyət maşının texniki vəziyyətinə və ehtiyatın vaxtında yenilənməsinə görə məsuliyyəti də əhatə edir.',
  powers: 'Son fincanı götürən şəxs yeni porsiya hazırlayır.\nSüd ehtiyatı bitdikdə dərhal xəbər verilir.\nMaşının təmizlənməsi növbə ilə aparılır.\nŞəxsi fincan ümumi rəfdə saxlanılmır.',
  penalty: 'Səlahiyyət sahibi ehtiyatın bitməsinə iki dəfə yol verdikdə nəzarət hüququ kollektivin növbəti üzvünə keçir.',
  titleOptions: [
    'Kofe Maşını üzərində Nəzarət Səlahiyyətinin Verilməsinə dair Akt',
    'Kofe Maşınının Təmizlənməsi Öhdəliyinin Bölüşdürülməsinə dair Akt',
    'Son Fincanı Götürən Şəxsin Öhdəlikləri haqqında Akt',
    'Ofisdə Kofe Ehtiyatının İdarə Edilməsinə dair Etibarnamə'
  ],
  powersOptions: [
    'Son fincanı götürən şəxs yeni porsiya hazırlayır.',
    'Süd ehtiyatı bitdikdə dərhal xəbər verilir.',
    'Maşının təmizlənməsi növbə ilə aparılır.',
    'Şəxsi fincan ümumi rəfdə saxlanılmır.',
    'Kofe növü kollektiv qərarla seçilir.',
    'Qonaqlara kofe növbədənkənar təqdim edilir.',
    'Boş qablar dərhal yuyulur.',
    'Maşının nasazlığı barədə eyni gün məlumat verilir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Səlahiyyət sahibi ehtiyatın bitməsinə iki dəfə yol verdikdə nəzarət hüququ kollektivin növbəti üzvünə keçir.',
    'Səlahiyyət rüblük əsasda yenidən bölüşdürülür.',
    'Maşının təmiz saxlanılması səlahiyyətin uzadılmasına əsasdır.'
  ]
},
{
  id: 'tomorrow-promise', cat: 'work', tone: 'zarafat', layout: 'teleqram', palette: 'burgundy',
  title: '«Sabah Göndərərəm» Vədinin İcra Vəziyyəti haqqında Xəbərdarlıq', tag: 'Vəd',
  signOrg: 'İş Vədləri və İcra Müddətləri üzrə Şura',
  toLabel: 'Vəd verən', fromLabel: 'Vədi gözləyən',
  preamble: 'Sizə bildiririk ki, {to} adlı şəxs tərəfindən verilmiş «sabah göndərərəm» vədinin icra müddəti bir neçə dəfə uzadılmışdır. {from} tərəfindən sənədin faktiki vəziyyəti barədə məlumat verilməsi tələb olunur.',
  powers: 'Vədin verildiyi tarix qeydə alınıb.\nMüddət indiyədək dörd dəfə uzadılıb.\nSənədin hansı mərhələdə olduğu bilinmir.\nYeni müddət göstərilməyib.',
  penalty: 'Sənəd növbəti iş gününün sonuna qədər təqdim edilmədikdə məsələ toplantının gündəliyinə salınır və icra müddəti kənar şəxs tərəfindən müəyyən edilir.',
  titleOptions: [
    '«Sabah Göndərərəm» Vədinin İcra Vəziyyəti haqqında Xəbərdarlıq',
    'Təqdim Edilməmiş Sənədlə Bağlı Təkrar Xatırlatma haqqında Teleqram',
    'Vədin Verildiyi Tarixdən Keçən Müddət haqqında Xəbərdarlıq',
    'İcra Müddətinin Növbəti Dəfə Uzadılması haqqında Bildiriş'
  ],
  powersOptions: [
    'Vədin verildiyi tarix qeydə alınıb.',
    'Müddət indiyədək dörd dəfə uzadılıb.',
    'Sənədin hansı mərhələdə olduğu bilinmir.',
    'Yeni müddət göstərilməyib.',
    'Faylın adı yazışmada qeyd olunub.',
    'İlkin variant heç kimə göndərilməyib.',
    'Əlaqədar şöbə gözləmə rejimindədir.',
    'Növbəti toplantıda məsələ gündəliyə salınacaq.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Sənəd növbəti iş gününün sonuna qədər təqdim edilmədikdə məsələ toplantının gündəliyinə salınır və icra müddəti kənar şəxs tərəfindən müəyyən edilir.',
    'Vədin növbəti dəfə uzadılması qəbul edilmir.',
    'Sənəd təqdim edildikdə xəbərdarlıq arxivə verilir.'
  ]
},
{
  id: 'deadline-extension', cat: 'work', tone: 'zarafat', layout: 'qerar', palette: 'steel',
  title: 'Tapşırığın İcra Müddətinin Növbəti Dəfə Uzadılması haqqında Qərar', tag: 'Son tarix',
  signOrg: 'İş Vədləri və İcra Müddətləri üzrə Şura',
  preamble: 'Şura {to} adlı şəxsin müraciətinə baxaraq müəyyən etmişdir ki, tapşırığın icrasına mane olan hallar qismən obyektiv xarakter daşıyır. {from} tərəfindən bildirilən mövqe nəzərə alınmaqla müddətin uzadılması məqsədəuyğun hesab edilmişdir.',
  powers: 'Müddət beş iş günü uzadılır.\nUzadılma bir dəfə tətbiq edilir.\nAralıq nəticə üç gün ərzində təqdim olunur.\nYeni müddət dəyişdirilmir.',
  penalty: 'Uzadılmış müddət də pozulduqda tapşırıq başqa icraçıya verilir və müddət uzatma müraciətlərinə növbəti rübdə baxılmır.',
  titleOptions: [
    'Tapşırığın İcra Müddətinin Növbəti Dəfə Uzadılması haqqında Qərar',
    'Son Tarixin Yenidən Müəyyən Edilməsi haqqında Yekun Qətnamə',
    'Obyektiv Səbəblərə Görə Müddətin Uzadılması haqqında Qərar',
    'İcra Müddətinin Son Dəfə Uzadılması haqqında Yekun Qərar'
  ],
  powersOptions: [
    'Müddət beş iş günü uzadılır.',
    'Uzadılma bir dəfə tətbiq edilir.',
    'Aralıq nəticə üç gün ərzində təqdim olunur.',
    'Yeni müddət dəyişdirilmir.',
    'İcra planı yazılı formada razılaşdırılır.',
    'Əlavə resurs tələbi ayrıca baxılır.',
    'Gündəlik hesabat tələb olunmur.',
    'Müddət bitməzdən bir gün əvvəl vəziyyət yoxlanılır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Uzadılmış müddət də pozulduqda tapşırıq başqa icraçıya verilir və müddət uzatma müraciətlərinə növbəti rübdə baxılmır.',
    'Aralıq nəticə təqdim edilmədikdə uzadılma ləğv edilir.',
    'Qərardan narazılıq qeydə alınır, lakin müddətə təsir etmir.'
  ]
},
{
  id: 'camera-off', cat: 'work', tone: 'zarafat', layout: 'lisenziya', palette: 'steel',
  title: 'Onlayn Toplantılarda Kameranın Açılmaması Hüququna dair Lisenziya', tag: 'Onlayn',
  signOrg: 'Ofis Nizamı və Əmək Rejimi üzrə Baş İdarə',
  toLabel: 'LİSENZİYA SAHİBİ',
  preamble: '{from} tərəfindən {to} adlı şəxsə onlayn toplantılarda kameranı açmamaq hüququ verilir. Lisenziya toplantıda fəal iştirakı istisna etmir və mikrofonun işlək vəziyyətdə saxlanılması şərti ilə qüvvədədir.',
  powers: 'Kameranın söndürülməsi izahat tələb etmir.\nMikrofon sual verildikdə dərhal açılır.\nFon şəkli əvəzinə boş ekran qəbul edilir.\nBağlantı problemi arqumenti tələb olunmur.',
  penalty: 'Kənar iştirakçıların olduğu təqdimat toplantılarında lisenziya qüvvədən düşür və kameranın açılması tələb olunur.',
  titleOptions: [
    'Onlayn Toplantılarda Kameranın Açılmaması Hüququna dair Lisenziya',
    'Video Bağlantı Zamanı Kameranın Söndürülməsinə dair Lisenziya',
    'Səhər Toplantılarında Yalnız Səslə İştiraka dair Xüsusi İcazə',
    'Kamera Rejiminin Fərdi Müəyyən Edilməsinə dair Lisenziya'
  ],
  powersOptions: [
    'Kameranın söndürülməsi izahat tələb etmir.',
    'Mikrofon sual verildikdə dərhal açılır.',
    'Fon şəkli əvəzinə boş ekran qəbul edilir.',
    'Bağlantı problemi arqumenti tələb olunmur.',
    'Səhər toplantılarında güzəşt genişləndirilir.',
    'Şəkil profildə saxlanılır.',
    'Yazışma ilə iştirak da fəallıq sayılır.',
    'Ekran paylaşımı ayrıca razılaşdırılır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Kənar iştirakçıların olduğu təqdimat toplantılarında lisenziya qüvvədən düşür və kameranın açılması tələb olunur.',
    'Suala cavab verilmədikdə lisenziya həmin toplantı üçün dayandırılır.',
    'Lisenziya rüblük əsasda yenidən nəzərdən keçirilir.'
  ]
},
{
  id: 'cc-authority', cat: 'work', tone: 'zarafat', layout: 'muqavile', palette: 'ink',
  title: 'Elektron Yazışmada Nüsxə Siyahısının Tərtibi Qaydası üzrə Protokol', tag: 'Yazışma',
  signOrg: 'Korporativ Mübahisələr üzrə Arbitraj Komissiyası',
  preamble: 'Tərəflərin mövqeyi nəzərə alınmaqla, {from} və {to} arasında elektron yazışmada nüsxə siyahısının tərtibi, rəhbərliyin əlavə edilməsi və mövzu sətrinin dəqiqləşdirilməsi qaydaları barədə razılıq əldə edilmişdir. Protokol bütün daxili yazışmalara şamil olunur.',
  powers: 'Rəhbərlik yalnız zəruri hallarda nüsxəyə salınır.\nGizli nüsxə sahəsindən istifadə edilmir.\nCavab yazılarkən siyahı genişləndirilmir.\nMövzu sətri hər yazışmada dəqiqləşdirilir.',
  penalty: 'Rəhbərliyin əsassız olaraq nüsxəyə salınması halında pozuntuya yol vermiş tərəf növbəti toplantının protokolunu yazmaq öhdəliyi daşıyır.',
  titleOptions: [
    'Elektron Yazışmada Nüsxə Siyahısının Tərtibi Qaydası üzrə Protokol',
    'Yazışmaya Rəhbərliyin Əlavə Edilməsi Qaydası üzrə Protokol',
    'Nüsxə və Gizli Nüsxə Sahələrindən İstifadə üzrə Müqavilə',
    'Yazışmanın Ünvan Siyahısının Genişləndirilməsi üzrə Saziş'
  ],
  powersOptions: [
    'Rəhbərlik yalnız zəruri hallarda nüsxəyə salınır.',
    'Gizli nüsxə sahəsindən istifadə edilmir.',
    'Cavab yazılarkən siyahı genişləndirilmir.',
    'Mövzu sətri hər yazışmada dəqiqləşdirilir.',
    'Aidiyyəti olmayan şəxs siyahıdan çıxarılır.',
    '«Hamıya cavab» düyməsi ehtiyatla işlədilir.',
    'Fayl ölçüsü hədddən artıq olmamalıdır.',
    'Təcili mesaj ayrıca kanalla bildirilir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Rəhbərliyin əsassız olaraq nüsxəyə salınması halında pozuntuya yol vermiş tərəf növbəti toplantının protokolunu yazmaq öhdəliyi daşıyır.',
    'Protokol yalnız daxili yazışmalara şamil edilir.',
    'Şərtlərin pozulması halında qaydalar yenidən müzakirə olunur.'
  ]
},
{
  id: 'lunch-king', cat: 'work', tone: 'zarafat', layout: 'vesiqe', palette: 'burgundy',
  title: 'Nahar Fasiləsinin Müddəti və Bərpası Qaydasını Təsdiq edən Vəsiqə', tag: 'Nahar',
  signOrg: 'Ofis Nizamı və Əmək Rejimi üzrə Baş İdarə',
  preamble: 'Bu vəsiqə {to} adlı şəxsin nahar fasiləsindən istifadə qaydasını təsbit edir. Sənəd {from} tərəfindən, fasilənin faktiki müddəti ilə rəsmi müddəti arasındakı sabit fərq nəzərə alınaraq rəsmiləşdirilmişdir.',
  powers: 'Fasilənin müddəti bir saat müəyyən edilir.\nNövbəti gün əvəzləmə yolu ilə bərpa edilir.\nNahar yeri kollektiv qərarla seçilir.\nFasilə zamanı iş yazışmalarına cavab verilmir.',
  penalty: 'Fasilə müddətinin ardıcıl olaraq aşılması halında əvəzləmə imkanı dayandırılır və fasilənin başlama vaxtı sabitləşdirilir.',
  titleOptions: [
    'Nahar Fasiləsinin Müddəti və Bərpası Qaydasını Təsdiq edən Vəsiqə',
    'Fasilə Vaxtının Fərdi Müəyyən Edilməsinə dair Vəsiqə',
    'Nahar Yerinin Seçilməsi Səlahiyyətini Təsdiq edən Vəsiqə',
    'Fasilə Müddətinin Bərpası Qaydasına dair Şəhadətnamə'
  ],
  powersOptions: [
    'Fasilənin müddəti bir saat müəyyən edilir.',
    'Növbəti gün əvəzləmə yolu ilə bərpa edilir.',
    'Nahar yeri kollektiv qərarla seçilir.',
    'Fasilə zamanı iş yazışmalarına cavab verilmir.',
    'Fasilə iki hissəyə bölünə bilər.',
    'Kənarda nahar halında əlavə on beş dəqiqə verilir.',
    'Doğum günü süfrəsi fasiləyə daxil edilmir.',
    'Hesab növbə ilə ödənilir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Fasilə müddətinin ardıcıl olaraq aşılması halında əvəzləmə imkanı dayandırılır və fasilənin başlama vaxtı sabitləşdirilir.',
    'Vəsiqə təcili iş günlərində qüvvədən düşür.',
    'Müddətə əməl edilməsi vəsiqənin uzadılmasına əsasdır.'
  ]
},
{
  id: 'printer-master', cat: 'work', tone: 'zarafat', layout: 'ekspertiza', palette: 'steel',
  title: 'Ofis Avadanlığının Bərpası üzrə Bacarıqların Qiymətləndirilməsi Rəyi', tag: 'Texniki',
  signOrg: 'Korporativ Mübahisələr üzrə Arbitraj Komissiyası',
  preamble: 'Aparılmış qiymətləndirmə nəticəsində müəyyən edilmişdir ki, {to} adlı şəxs ofis avadanlığının bərpası sahəsində kollektivdə ən yüksək göstəriciyə malikdir. Rəy {from} tərəfindən verilmiş müraciət əsasında tərtib edilmişdir.',
  powers: 'Kağız sıxışması orta hesabla iki dəqiqəyə aradan qaldırılır.\nKartricin dəyişdirilməsi təlimatsız həyata keçirilir.\nNasazlığın səbəbi səsdən müəyyən edilir.\nCihazın söndürülüb yandırılması son çarə kimi tətbiq olunur.',
  penalty: 'Rəy texniki xidmətin rəsmi öhdəliklərini əvəz etmir; mürəkkəb nasazlıqlarda müraciət səlahiyyətli xidmətə ünvanlanır.',
  titleOptions: [
    'Ofis Avadanlığının Bərpası üzrə Bacarıqların Qiymətləndirilməsi Rəyi',
    'Printerin İşə Salınması Sahəsindəki Bacarıqlara dair Rəy',
    'Texniki Nasazlıqların Aradan Qaldırılması üzrə Ekspert Rəyi',
    'Kağız Sıxışması Hallarının Həlli üzrə Peşəkarlıq Rəyi'
  ],
  powersOptions: [
    'Kağız sıxışması orta hesabla iki dəqiqəyə aradan qaldırılır.',
    'Kartricin dəyişdirilməsi təlimatsız həyata keçirilir.',
    'Nasazlığın səbəbi səsdən müəyyən edilir.',
    'Cihazın söndürülüb yandırılması son çarə kimi tətbiq olunur.',
    'Şəbəkə bağlantısı müstəqil bərpa edilir.',
    'Digər şöbələrə də dəstək göstərilir.',
    'Ehtiyat kartric əvvəlcədən sifariş edilir.',
    'Təlimat kitabçasının yeri məlumdur.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Rəy texniki xidmətin rəsmi öhdəliklərini əvəz etmir; mürəkkəb nasazlıqlarda müraciət səlahiyyətli xidmətə ünvanlanır.',
    'Rəy hər il yenidən qiymətləndirilir.',
    'Avadanlığın zədələnməsi halında rəy qüvvədən düşür.'
  ]
},
{
  id: 'employee-year', cat: 'work', tone: 'zarafat', layout: 'viza', palette: 'forest',
  title: 'İlin İşçisinə Verilən Güzəştlərdən İstifadəyə dair İcazə', tag: 'İlin işçisi',
  signOrg: 'Ofis Nizamı və Əmək Rejimi üzrə Baş İdarə',
  preamble: '{from} tərəfindən {to} adlı şəxsə il ərzində göstərdiyi nəticələrə görə əlavə güzəştlərdən istifadə etmək icazəsi verilir. İcazə növbəti illik qiymətləndirməyə qədər qüvvədə hesab edilir və əsas öhdəliklərin icrası şərti ilə saxlanılır.',
  powers: 'Ayda bir dəfə iş gününü bir saat gec başlamaq.\nToplantı otağını növbədənkənar sifariş etmək.\nNahar fasiləsini yarım saat uzatmaq.\nƏn rahat oturacağı seçmək hüququ.',
  penalty: 'Güzəştlərdən istifadə əsas öhdəliklərin icrasına mane olduqda icazə növbəti qiymətləndirməyə qədər dayandırılır.',
  titleOptions: [
    'İlin İşçisinə Verilən Güzəştlərdən İstifadəyə dair İcazə',
    'İllik Nəticələrə Görə Əlavə Güzəştlərin Tətbiqinə dair İcazə',
    'Fəxri Ada Bağlı İş Rejimi Güzəştlərinə dair İcazə',
    'Nümunəvi İşçi Statusuna Bağlı Səlahiyyətlərə dair İcazə'
  ],
  powersOptions: [
    'Ayda bir dəfə iş gününü bir saat gec başlamaq.',
    'Toplantı otağını növbədənkənar sifariş etmək.',
    'Nahar fasiləsini yarım saat uzatmaq.',
    'Ən rahat oturacağı seçmək hüququ.',
    'İllik məzuniyyət tarixini birinci seçmək.',
    'Kollektiv tədbirin yerini təklif etmək.',
    'Yeni işçiyə mentorluq etmək hüququ.',
    'Kondisionerin rejimi barədə fikir bildirmək.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Güzəştlərdən istifadə əsas öhdəliklərin icrasına mane olduqda icazə növbəti qiymətləndirməyə qədər dayandırılır.',
    'İcazə hər il yenidən verilir.',
    'Güzəştlər başqa şəxsə ötürülə bilməz.'
  ]
},
{
  id: 'excuse-registry', cat: 'work', tone: 'zarafat', layout: 'arayis', palette: 'ink',
  title: 'Gecikmə Səbəbləri üzrə Təqdim Edilmiş İzahatlar haqqında Arayış', tag: 'Bəhanə',
  signOrg: 'İş Vədləri və İcra Müddətləri üzrə Şura',
  powersLabel: 'QEYDƏ ALINMIŞ BƏHANƏLƏR',
  preamble: 'Verilir {to} adlı şəxsə ondan ötrü ki, işə gecikmə səbəbləri üzrə təqdim etdiyi izahatlar {from} tərəfindən qeydə alınmış, kateqoriyalara ayrılmış və ümumiləşdirilmişdir. Arayış son altı ayın məlumatlarını əhatə edir.',
  powers: 'Ən çox istifadə olunan səbəb tıxacdır.\nİkinci yerdə lift nasazlığı göstərilir.\nHava şəraiti arqumenti mövsümdən asılı deyil.\nİzahatların heç biri sənədlə təsdiqlənməyib.',
  penalty: 'Eyni izahatın ayda üç dəfədən artıq təqdim edilməsi halında həmin səbəb sonrakı müraciətlərdə nəzərə alınmır.',
  titleOptions: [
    'Gecikmə Səbəbləri üzrə Təqdim Edilmiş İzahatlar haqqında Arayış',
    'İşə Gecikmə Hallarının Səbəbləri haqqında Ümumiləşdirilmiş Arayış',
    'Təqdim Edilmiş İzahatların Təkrarlanma Tezliyi haqqında Arayış',
    'Nəqliyyat və Yol Amillərinə İstinadlar haqqında Arayış'
  ],
  powersOptions: [
    'Ən çox istifadə olunan səbəb tıxacdır.',
    'İkinci yerdə lift nasazlığı göstərilir.',
    'Hava şəraiti arqumenti mövsümdən asılı deyil.',
    'İzahatların heç biri sənədlə təsdiqlənməyib.',
    'Yeni səbəb son ayda iki dəfə səsləndirilib.',
    'Gecikmənin orta müddəti on iki dəqiqədir.',
    'Cümə günləri göstərici yüksəlir.',
    'Toplantı günlərində gecikmə qeydə alınmır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Eyni izahatın ayda üç dəfədən artıq təqdim edilməsi halında həmin səbəb sonrakı müraciətlərdə nəzərə alınmır.',
    'Arayış yalnız məlumat xarakteri daşıyır.',
    'Göstəricilər yaxşılaşdıqda arayış yenilənir.'
  ]
},
{
  id: 'ac-authority', cat: 'work', tone: 'zarafat', layout: 'blank', palette: 'burgundy',
  title: 'Kondisionerin Rejimi üzrə Kollektiv Qərarın Elan Edilməsi Bildirişi', tag: 'İqlim',
  signOrg: 'Ofis Nizamı və Əmək Rejimi üzrə Baş İdarə',
  preamble: 'Daxil olmuş müraciətə baxılaraq bildirilir ki, ofisdə temperatur rejimi kollektiv qərarla müəyyən edilmişdir. {from} tərəfindən verilmiş təkliflər və {to} adlı şəxsin mövqeyi qərarın qəbulunda nəzərə alınmışdır.',
  powers: 'Temperatur 23 dərəcə səviyyəsində saxlanılır.\nPult ümumi rəfdə saxlanılır.\nRejim dəyişikliyi kollektivə bildirilir.\nBirbaşa hava axını iş yerinə yönəldilmir.',
  penalty: 'Rejimin kollektivə bildirilmədən dəyişdirilməsi halında pultun saxlanma səlahiyyəti növbəti həftə üçün başqa şəxsə həvalə edilir.',
  titleOptions: [
    'Kondisionerin Rejimi üzrə Kollektiv Qərarın Elan Edilməsi Bildirişi',
    'Ofisdə Temperatur Rejiminin Müəyyən Edilməsi haqqında Bildiriş',
    'Kondisionerin Pultunun Saxlanma Yeri haqqında Rəsmi Bildiriş',
    'İqlim Nəzarəti üzrə Səlahiyyətlərin Bölüşdürülməsi Bildirişi'
  ],
  powersOptions: [
    'Temperatur 23 dərəcə səviyyəsində saxlanılır.',
    'Pult ümumi rəfdə saxlanılır.',
    'Rejim dəyişikliyi kollektivə bildirilir.',
    'Birbaşa hava axını iş yerinə yönəldilmir.',
    'Səhər saatlarında rejim yumşaldılır.',
    'Pəncərə açılarkən cihaz söndürülür.',
    'Şikayət yazılı formada bildirilir.',
    'Qonaqların rahatlığı ayrıca nəzərə alınır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Rejimin kollektivə bildirilmədən dəyişdirilməsi halında pultun saxlanma səlahiyyəti növbəti həftə üçün başqa şəxsə həvalə edilir.',
    'Bildiriş hər mövsümün əvvəlində yenilənir.',
    'Şikayətlərin sayı artdıqda rejim yenidən müzakirə edilir.'
  ]
},

/* ---------------- AİLƏ / UŞAQLAR ---------------- */
{
  id: 'homework-truce', cat: 'family', tone: 'zarafat', layout: 'notarial', palette: 'gold',
  title: 'Dərs Hazırlığı Saatlarının Müəyyən Edilməsinə dair Barışıq Aktı', tag: 'Diplomatiya',
  signOrg: 'Valideyn-Övlad Münasibətləri üzrə Ali Şura',
  toLabel: 'Dərs oxuyan tərəf', fromLabel: 'Nəzarət edən tərəf',
  preamble: 'Tərəflərin mövqeyi nəzərə alınmaqla, {from} və {to} arasında dərs hazırlığı saatları, fasilələrin müddəti və telefonun saxlanma yeri barədə razılıq əldə edilmişdir. Akt hər iki tərəfə öhdəlik yükləyir və birtərəfli qaydada dəyişdirilə bilməz.',
  powers: 'Dərs saat 17:00-da başlayır və iki saat davam edir.\nBu müddətdə telefon başqa otaqda saxlanılır.\nHər qırx dəqiqədən sonra on dəqiqə fasilə verilir.\nTapşırıq bitdikdə əlavə tapşırıq verilmir.',
  penalty: 'Aktın şərtləri pozulduqda növbəti gün dərs hazırlığının başlama vaxtı bir saat tezləşdirilir və fasilə müddəti qısaldılır.',
  titleOptions: [
    'Dərs Hazırlığı Saatlarının Müəyyən Edilməsinə dair Barışıq Aktı',
    'Ev Tapşırıqlarının İcra Rejiminin Razılaşdırılmasına dair Akt',
    'Dərs Vaxtı üzrə Yaranmış Gərginliyin Aradan Qaldırılması Aktı',
    'Hazırlıq Saatında Qarşılıqlı Öhdəliklərin Təsbiti haqqında Akt'
  ],
  powersOptions: [
    'Dərs saat 17:00-da başlayır və iki saat davam edir.',
    'Bu müddətdə telefon başqa otaqda saxlanılır.',
    'Hər qırx dəqiqədən sonra on dəqiqə fasilə verilir.',
    'Tapşırıq bitdikdə əlavə tapşırıq verilmir.',
    'Çətin sualda kömək bir dəfə istənilir.',
    'Səs tonu ucaldılmadan izah aparılır.',
    'Həftəsonu hazırlıq günorta saatlarına keçirilir.',
    'Qiymətlər dərs saatında müzakirə edilmir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Aktın şərtləri pozulduqda növbəti gün dərs hazırlığının başlama vaxtı bir saat tezləşdirilir və fasilə müddəti qısaldılır.',
    'Pozuntu halında ekran vaxtı həmin gün üçün yarıya endirilir.',
    'Akt hər tədris rübünün əvvəlində yenidən razılaşdırılır.'
  ]
},
{
  id: 'screen-time-license', cat: 'family', tone: 'zarafat', layout: 'lisenziya', palette: 'ink',
  title: 'Gündəlik Ekran Vaxtından İstifadəyə dair Müddətli Lisenziya', tag: 'Ekran vaxtı',
  signOrg: 'Ev Tapşırıqları və Daxili Nizam üzrə Baş İdarə',
  powersLabel: 'LİSENZİYANIN ƏHATƏ ETDİYİ HALLAR',
  preamble: '{from} tərəfindən {to} adlı şəxsə gündəlik ekran vaxtından istifadə üçün lisenziya verilir. Lisenziyanın müddəti dərs və ev tapşırıqları başa çatdıqdan sonra hesablanmağa başlayır və yatmaq saatında avtomatik olaraq sona çatır.',
  powers: 'Gündəlik limit iki saat müəyyən edilir.\nDərs bitmədən ekran vaxtı başlamır.\nYatmaq saatından bir saat əvvəl ekran bağlanır.\nHəftəsonu limit bir saat artırılır.',
  penalty: 'Limitin gizli şəkildə aşılması aşkarlandıqda lisenziya növbəti üç gün üçün dayandırılır və bərpa yalnız tapşırıqlar tamamlandıqdan sonra mümkündür.',
  titleOptions: [
    'Gündəlik Ekran Vaxtından İstifadəyə dair Müddətli Lisenziya',
    'Telefon və Planşetdən İstifadə Rejiminə dair Lisenziya',
    'Ekran Vaxtının Artırılması Şərtlərinə dair Xüsusi İcazə',
    'Həftəsonu Ekran Rejiminin Genişləndirilməsinə dair Lisenziya'
  ],
  powersOptions: [
    'Gündəlik limit iki saat müəyyən edilir.',
    'Dərs bitmədən ekran vaxtı başlamır.',
    'Yatmaq saatından bir saat əvvəl ekran bağlanır.',
    'Həftəsonu limit bir saat artırılır.',
    'Dərslə bağlı istifadə limitə daxil edilmir.',
    'Qohumlarla video zəng ayrıca hesablanır.',
    'Yaxşı qiymət əlavə otuz dəqiqə qazandırır.',
    'Limit gün ərzində hissə-hissə istifadə edilə bilər.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Limitin gizli şəkildə aşılması aşkarlandıqda lisenziya növbəti üç gün üçün dayandırılır və bərpa yalnız tapşırıqlar tamamlandıqdan sonra mümkündür.',
    'Gecə saatlarında istifadə lisenziyanı bir həftə dayandırır.',
    'Lisenziya hər ay yenidən nəzərdən keçirilir.'
  ]
},
{
  id: 'allowance-contract', cat: 'family', tone: 'zarafat', layout: 'muqavile', palette: 'steel',
  title: 'Cib Xərcliyinin Verilmə Qaydası və Məbləği üzrə Müqavilə', tag: 'Büdcə',
  signOrg: 'Valideyn-Övlad Münasibətləri üzrə Ali Şura',
  preamble: 'Tərəflər arasında aparılmış müzakirə nəticəsində {from} və {to} arasında cib xərcliyinin məbləği, verilmə tarixi və artırılma qaydası barədə razılıq əldə edilmişdir. Müqavilə tədris ili ərzində qüvvədə qalır.',
  powers: 'Xərclik hər ayın birinci günü verilir.\nMəbləğin sərf istiqaməti soruşulmur.\nAvans yalnız bir dəfə və əsaslandırılmış halda verilir.\nArtırılma tədris nəticələrinə əsasən müzakirə edilir.',
  penalty: 'Avansın razılaşdırılmadan tələb edilməsi halında növbəti ayın xərcliyi bir həftə gec verilir və avans imkanı müvəqqəti dayandırılır.',
  titleOptions: [
    'Cib Xərcliyinin Verilmə Qaydası və Məbləği üzrə Müqavilə',
    'Aylıq Cib Xərcliyinin Müəyyən Edilməsi üzrə Ailədaxili Müqavilə',
    'Əlavə Vəsaitin Verilmə Şərtləri üzrə Qarşılıqlı Saziş',
    'Cib Xərcliyinin Artırılması Qaydasına dair Müqavilə'
  ],
  powersOptions: [
    'Xərclik hər ayın birinci günü verilir.',
    'Məbləğin sərf istiqaməti soruşulmur.',
    'Avans yalnız bir dəfə və əsaslandırılmış halda verilir.',
    'Artırılma tədris nəticələrinə əsasən müzakirə edilir.',
    'Ev işlərində köməklik əlavə vəsait qazandırır.',
    'Qalan məbləğ növbəti aya keçirilə bilər.',
    'Hədiyyə üçün ayrıca vəsait nəzərdə tutulur.',
    'İtirilmiş məbləğ bərpa edilmir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Avansın razılaşdırılmadan tələb edilməsi halında növbəti ayın xərcliyi bir həftə gec verilir və avans imkanı müvəqqəti dayandırılır.',
    'Müqavilə tədris ilinin sonunda yenidən bağlanır.',
    'Şərtlərin pozulması artırılma müzakirəsini təxirə salır.'
  ]
},
{
  id: 'bedtime-decree', cat: 'family', tone: 'zarafat', layout: 'blank', palette: 'burgundy',
  title: 'Yatma Saatının Müəyyən Edilməsi və Gecə Rejimi haqqında Bildiriş', tag: 'Gecə rejimi',
  signOrg: 'Ev Tapşırıqları və Daxili Nizam üzrə Baş İdarə',
  preamble: 'Sizə bildiririk ki, {to} adlı şəxs üçün yatma saatı və gecə rejimi müəyyən edilmişdir. Qərar {from} tərəfindən, son həftələrdə səhər oyanma prosesinin nəzərəçarpacaq dərəcədə çətinləşməsi və dərsə gecikmə hallarının artması nəzərə alınaraq qəbul edilmişdir.',
  powers: 'Həftə içi yatma saatı 22:00 müəyyən edilir.\nHəftəsonu bir saat gec yatmağa icazə verilir.\n«Beş dəqiqə də» xahişi gündə bir dəfə qəbul edilir.\nYatmazdan əvvəl bir nağıl oxunur.',
  penalty: 'Rejimin ardıcıl üç gün pozulması halında həftəsonu güzəşti həmin həftə üçün ləğv edilir və yatma saatı bərpa olunur.',
  titleOptions: [
    'Yatma Saatının Müəyyən Edilməsi və Gecə Rejimi haqqında Bildiriş',
    'Gecə Dincliyi Rejiminin Tətbiqi haqqında Rəsmi Bildiriş',
    'Yatma Saatının Həftə İçi və Həftəsonu üzrə Müəyyən Edilməsi Bildirişi',
    '«Beş dəqiqə də» Xahişinin Baxılma Qaydası haqqında Bildiriş'
  ],
  powersOptions: [
    'Həftə içi yatma saatı 22:00 müəyyən edilir.',
    'Həftəsonu bir saat gec yatmağa icazə verilir.',
    '«Beş dəqiqə də» xahişi gündə bir dəfə qəbul edilir.',
    'Yatmazdan əvvəl bir nağıl oxunur.',
    'Su üçün qalxmaq bir dəfə icazəlidir.',
    'Gecə işığı sabaha qədər yandırıla bilər.',
    'Qonaq gələndə rejim yarım saat uzadılır.',
    'Xəstəlik halında rejim tətbiq edilmir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Rejimin ardıcıl üç gün pozulması halında həftəsonu güzəşti həmin həftə üçün ləğv edilir və yatma saatı bərpa olunur.',
    'Rejim bayram günlərində qüvvədən düşür.',
    'Səhər vaxtında oyanmaq güzəştin bərpasına əsas verir.'
  ]
},
{
  id: 'room-cleaning-act', cat: 'family', tone: 'zarafat', layout: 'arayis', palette: 'forest',
  title: 'Otağın Səliqəyə Salınması Öhdəliyinin İcra Vəziyyəti haqqında Arayış', tag: 'Ev işi',
  signOrg: 'Ev Tapşırıqları və Daxili Nizam üzrə Baş İdarə',
  toLabel: 'Otağın sahibi', fromLabel: 'Yoxlamanı aparan',
  preamble: 'Verilir {to} adlı şəxsə ondan ötrü ki, otağın səliqəyə salınması üzrə öhdəliyin icra vəziyyəti {from} tərəfindən yoxlanılmış və nəticələr bu arayışda əks etdirilmişdir. Yoxlama xəbərdarlıq edilmədən aparılmışdır.',
  powers: 'Yataq səhər saatlarında düzəldilir.\nPaltarlar stulda deyil, şkafda saxlanılır.\nMasanın üstü dərsdən sonra boşaldılır.\nYerdə qalan əşyalar axşama qədər yığılır.',
  penalty: 'Növbəti yoxlamada eyni çatışmazlıqlar aşkarlandıqda otağın səliqəyə salınması birgə, lakin sənəd sahibinin iştirakı ilə həyata keçirilir.',
  titleOptions: [
    'Otağın Səliqəyə Salınması Öhdəliyinin İcra Vəziyyəti haqqında Arayış',
    'Otaqda Aparılmış Təmizlik İşlərinin Nəticəsi haqqında Arayış',
    'Paltarların Yerinə Qoyulması Öhdəliyinin İcrası haqqında Arayış',
    'Yataq Düzəldilməsi Vərdişinin Formalaşması haqqında Arayış'
  ],
  powersOptions: [
    'Yataq səhər saatlarında düzəldilir.',
    'Paltarlar stulda deyil, şkafda saxlanılır.',
    'Masanın üstü dərsdən sonra boşaldılır.',
    'Yerdə qalan əşyalar axşama qədər yığılır.',
    'Boş qablar mətbəxə qaytarılır.',
    'Şkafın içi ayda bir dəfə nizama salınır.',
    'Kitablar rəfə öz yerinə qoyulur.',
    'Zibil qabı hər gün boşaldılır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Növbəti yoxlamada eyni çatışmazlıqlar aşkarlandıqda otağın səliqəyə salınması birgə, lakin sənəd sahibinin iştirakı ilə həyata keçirilir.',
    'Üç uğurlu yoxlama arayışın müsbət qiymətləndirilməsinə əsasdır.',
    'Yoxlamanın vaxtı əvvəlcədən bildirilmir.'
  ]
},
{
  id: 'best-child-diploma', cat: 'family', tone: 'zarafat', layout: 'diplom', palette: 'burgundy',
  title: 'Ailədə Nümunəvi Davranış və Köməkliyə Görə Fəxri Diplom', tag: 'Fəxri ad',
  signOrg: 'Valideyn-Övlad Münasibətləri üzrə Ali Şura',
  preamble: 'Şura {to} adlı şəxsin il ərzində ailədə göstərdiyi davranışı və könüllü köməkliyi qiymətləndirərək təltif haqqında qərar qəbul etmişdir. Diplom {from} tərəfindən təqdim olunur və ailə arxivində saxlanılır.',
  powers: 'Xahiş edilmədən süfrəni yığmaq.\nKiçik qardaş-bacıya dərsdə kömək etmək.\nSəhər özü oyanmaq bacarığı.\nVerilən sözü axıra qədər yerinə yetirmək.',
  penalty: 'Diplom geri alınmır. Təltif olunan şəxs il ərzində bir dəfə istədiyi şam yeməyini seçmək hüququ qazanır.',
  titleOptions: [
    'Ailədə Nümunəvi Davranış və Köməkliyə Görə Fəxri Diplom',
    'İl Ərzində Göstərilmiş Nəticələrə Görə Verilmiş Fəxri Diplom',
    'Ev İşlərində Könüllü İştiraka Görə Verilmiş Fəxri Diplom',
    'Xahiş Edilmədən Kömək Etmək Sahəsində Fəxri Diplom'
  ],
  powersOptions: [
    'Xahiş edilmədən süfrəni yığmaq.',
    'Kiçik qardaş-bacıya dərsdə kömək etmək.',
    'Səhər özü oyanmaq bacarığı.',
    'Verilən sözü axıra qədər yerinə yetirmək.',
    'Qonaq qarşısında nümunəvi davranış.',
    'Telefonun özü tərəfindən kənara qoyulması.',
    'Alış-verişdə köməklik göstərmək.',
    'Səhvi vaxtında etiraf etmək.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Diplom geri alınmır. Təltif olunan şəxs il ərzində bir dəfə istədiyi şam yeməyini seçmək hüququ qazanır.',
    'Diplom növbəti ilin nəticələrinə görə yenilənir.',
    'Təltif ailə arxivində müddətsiz saxlanılır.'
  ]
},
{
  id: 'dinner-veto', cat: 'family', tone: 'zarafat', layout: 'sertifikat', palette: 'steel',
  title: 'Şam Yeməyinin Tərkibinə Etiraz Bildirmək Hüququnun Sertifikatı', tag: 'Mətbəx',
  signOrg: 'Uşaq Hüquqlarının Müdafiəsi üzrə Ailə Komissiyası',
  powersLabel: 'VETO HÜQUQUNUN ŞƏRTLƏRİ',
  preamble: 'Bununla təsdiq edilir ki, {to} adlı şəxsə şam yeməyinin tərkibinə etiraz bildirmək hüququ tanınır. Sertifikat {from} tərəfindən, uzun müzakirələrdən sonra və məhdud sayda məhsula şamil edilməklə verilmişdir.',
  powers: 'Həftədə bir dəfə yemək seçimi təklif edilə bilər.\nBir məhsul boşqabın kənarına qoyula bilər.\nŞorbadan imtina ayrıca əsaslandırma tələb edir.\nSertifikat qonaq süfrəsinə şamil edilmir.',
  penalty: 'Sertifikat qonaqların iştirakı ilə keçirilən süfrələrə və bayram tədbirlərinə şamil edilmir; həmin hallarda ümumi qayda tətbiq olunur.',
  titleOptions: [
    'Şam Yeməyinin Tərkibinə Etiraz Bildirmək Hüququnun Sertifikatı',
    'Bəyənilməyən Yeməkdən İmtina Hüququnu Təsdiq edən Sertifikat',
    'Süfrədə Bir Məhsulun Kənara Qoyulması Hüququnun Sertifikatı',
    'Şam Yeməyi Seçimində İştirak Hüququna dair Şəhadətnamə'
  ],
  powersOptions: [
    'Həftədə bir dəfə yemək seçimi təklif edilə bilər.',
    'Bir məhsul boşqabın kənarına qoyula bilər.',
    'Şorbadan imtina ayrıca əsaslandırma tələb edir.',
    'Sertifikat qonaq süfrəsinə şamil edilmir.',
    'Yeni yeməyi bir dəfə dadmaq öhdəliyi qalır.',
    'Şirniyyat şam yeməyini əvəz etmir.',
    'Seçim bir gün əvvəl bildirilir.',
    'Bayram süfrəsində etiraz qəbul edilmir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Sertifikat qonaqların iştirakı ilə keçirilən süfrələrə və bayram tədbirlərinə şamil edilmir; həmin hallarda ümumi qayda tətbiq olunur.',
    'Ardıcıl imtinalar sertifikatın yenidən baxılmasına əsasdır.',
    'Sertifikat mətbəxdə köməklik göstərildiyi müddətdə qüvvədədir.'
  ]
},
{
  id: 'parent-verdict', cat: 'family', tone: 'zarafat', layout: 'qerar', palette: 'ink',
  title: 'Ailədaxili Mübahisə üzrə Aparılmış Baxışın Nəticəsi haqqında Qərar', tag: 'Məhkəmə',
  signOrg: 'Uşaq Hüquqlarının Müdafiəsi üzrə Ailə Komissiyası',
  preamble: 'Şura {to} və {from} arasında yaranmış mübahisəyə hər iki tərəfin izahatını dinləməklə baxmış və müəyyən etmişdir ki, hadisələrin ardıcıllığı barədə ifadələr tam uyğun gəlmir. Məsələ üzrə yekun qərar qəbul edilmişdir.',
  powers: 'Mübahisənin predmeti əhəmiyyətsiz hesab edilir.\nHər iki tərəfin qismən haqlı olduğu müəyyən edilir.\nKimin birinci başladığı məsələsi araşdırılmır.\nBarışıq həmin gün ərzində həyata keçirilir.',
  penalty: 'Qərar qəbul edildikdən sonra eyni mövzunun yenidən qaldırılması halında mübahisə predmeti olan əşya bir həftəlik hər iki tərəfdən alınır.',
  titleOptions: [
    'Ailədaxili Mübahisə üzrə Aparılmış Baxışın Nəticəsi haqqında Qərar',
    'Bacı-Qardaş Arasındakı Mübahisə üzrə Yekun Qətnamə',
    'Kimin Birinci Başladığı Məsələsi üzrə Qəbul Edilmiş Qərar',
    'Ailədaxili Münaqişənin Həlli haqqında Qəti Qərar'
  ],
  powersOptions: [
    'Mübahisənin predmeti əhəmiyyətsiz hesab edilir.',
    'Hər iki tərəfin qismən haqlı olduğu müəyyən edilir.',
    'Kimin birinci başladığı məsələsi araşdırılmır.',
    'Barışıq həmin gün ərzində həyata keçirilir.',
    'Şahid ifadələri bir-birini təsdiqləmir.',
    'Ucadan danışmaq ağırlaşdırıcı hal sayılır.',
    'Əşyanın zədələnməsi ayrıca qeydə alınır.',
    'Üzrxahlıq qarşılıqlı qaydada bildirilir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Qərar qəbul edildikdən sonra eyni mövzunun yenidən qaldırılması halında mübahisə predmeti olan əşya bir həftəlik hər iki tərəfdən alınır.',
    'Qərardan narazılıq qeydə alınır, lakin nəticəyə təsir etmir.',
    'Barışıq şərtləri pozulduqda məsələyə yenidən baxılır.'
  ]
},
{
  id: 'sibling-peace', cat: 'family', tone: 'zarafat', layout: 'ekspertiza', palette: 'forest',
  title: 'Bacı-Qardaş Münasibətlərinin Vəziyyətinin Qiymətləndirilməsi haqqında Rəy', tag: 'Sülh',
  signOrg: 'Uşaq Hüquqlarının Müdafiəsi üzrə Ailə Komissiyası',
  preamble: 'Məsələyə dair aparılmış qiymətləndirmə nəticəsində {to} və {from} arasındakı münasibətlərin ümumi vəziyyəti müsbət qiymətləndirilmişdir. Qeydə alınan mübahisələrin əksəriyyəti qısamüddətli və nəticəsiz xarakter daşıyır.',
  powers: 'Mübahisələrin orta müddəti on beş dəqiqədir.\nBarışıq adətən kənar müdaxilə olmadan baş verir.\nƏşya bölgüsü ən çox rast gəlinən səbəbdir.\nBirgə oyun münasibətləri sabitləşdirən amildir.',
  penalty: 'Rəy hər tədris rübünün sonunda yenidən nəzərdən keçirilir; göstəricilər pisləşdikdə əlavə barışıq tədbirləri tövsiyə olunur.',
  titleOptions: [
    'Bacı-Qardaş Münasibətlərinin Vəziyyətinin Qiymətləndirilməsi haqqında Rəy',
    'Ailədaxili Münaqişələrin Səbəblərinin Təhlili haqqında Rəy',
    'Otaq və Əşya Bölgüsü üzrə Gərginliyin Qiymətləndirilməsinə dair Rəy',
    'Barışıq Prosesinin Nəticələrinin Təsdiqi haqqında Yekun Rəy'
  ],
  powersOptions: [
    'Mübahisələrin orta müddəti on beş dəqiqədir.',
    'Barışıq adətən kənar müdaxilə olmadan baş verir.',
    'Əşya bölgüsü ən çox rast gəlinən səbəbdir.',
    'Birgə oyun münasibətləri sabitləşdirən amildir.',
    'Otağın bölünməsi gərginliyi azaldan tədbirdir.',
    'Böyük tərəfin güzəşti barışığı sürətləndirir.',
    'Valideyn müdaxiləsi hallarının sayı azalmışdır.',
    'Ümumi düşmən yarandıqda münasibətlər yaxşılaşır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Rəy hər tədris rübünün sonunda yenidən nəzərdən keçirilir; göstəricilər pisləşdikdə əlavə barışıq tədbirləri tövsiyə olunur.',
    'Rəy tərəflərin xahişi ilə istənilən vaxt yenilənə bilər.',
    'Mübahisələrin sayı artdıqda əlavə araşdırma aparılır.'
  ]
},
{
  id: 'grade-telegram', cat: 'family', tone: 'zarafat', layout: 'teleqram', palette: 'gold',
  title: 'Tədris Nəticələri barədə Valideynə Ünvanlanmış Təcili Bildiriş', tag: 'Təcili',
  signOrg: 'Valideyn-Övlad Münasibətləri üzrə Ali Şura',
  preamble: 'Sizə bildiririk ki, {to} adlı şəxsin tədris nəticələrində gözlənilməz dəyişiklik qeydə alınmışdır. {from} tərəfindən məsələnin sakit şəraitdə müzakirə edilməsi və qəti tədbirlərdən çəkinilməsi xahiş olunur.',
  powers: 'Nəticə barədə məlumat özü tərəfindən verilib.\nSəbəblərin izahı üçün vaxt tələb olunur.\nDüzəltmək imkanı hələ də mövcuddur.\nDigər fənlər üzrə vəziyyət sabitdir.',
  penalty: 'Vəziyyət növbəti iki həftə ərzində düzəldilmədikdə əlavə hazırlıq rejimi tətbiq edilir və həftəsonu proqramı yenidən nəzərdən keçirilir.',
  titleOptions: [
    'Tədris Nəticələri barədə Valideynə Ünvanlanmış Təcili Bildiriş',
    'Gözlənilməz Qiymət barədə Təcili Xəbərdarlıq',
    'Jurnalda Yeni Qeydin Yaranması haqqında Təcili Teleqram',
    'Tədris Göstəricilərinin Dəyişməsi haqqında Bildiriş'
  ],
  powersOptions: [
    'Nəticə barədə məlumat özü tərəfindən verilib.',
    'Səbəblərin izahı üçün vaxt tələb olunur.',
    'Düzəltmək imkanı hələ də mövcuddur.',
    'Digər fənlər üzrə vəziyyət sabitdir.',
    'Müəllimlə görüş təklif edilir.',
    'Əlavə hazırlıq planı tərtib olunur.',
    'Ekran vaxtı könüllü azaldılır.',
    'Növbəti nəticə iki həftə ərzində gözlənilir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Vəziyyət növbəti iki həftə ərzində düzəldilmədikdə əlavə hazırlıq rejimi tətbiq edilir və həftəsonu proqramı yenidən nəzərdən keçirilir.',
    'Nəticə düzəldildikdə bildiriş arxivə verilir.',
    'Bildiriş yalnız məlumat xarakteri daşıyır.'
  ]
},
{
  id: 'junior-id', cat: 'family', tone: 'zarafat', layout: 'vesiqe', palette: 'steel',
  title: 'Ailənin Kiçik Üzvünün Hüquq və Öhdəliklərini Təsdiq edən Vəsiqə', tag: 'Ailə üzvü',
  signOrg: 'Valideyn-Övlad Münasibətləri üzrə Ali Şura',
  fromLabel: 'Vəsiqəni verən',
  preamble: 'Bu vəsiqə {to} adlı şəxsin ailənin tamhüquqlu kiçik üzvü olduğunu təsdiq edir. Sənəd {from} tərəfindən verilmişdir və ailədaxili qərarların qəbulunda məsləhətçi səs hüququ verir. Vəsiqə ev işləri üzrə öhdəliklərin icrası ilə birlikdə qüvvədə hesab edilir.',
  powers: 'Ailə şurasında fikir bildirmək hüququ tanınır.\nHəftəsonu proqramına bir təklif verilə bilər.\nŞam yeməyi seçimində iştirak hüququ verilir.\nOtağın daxili nizamı özü tərəfindən müəyyən edilir.',
  penalty: 'Vəsiqə ilə verilən hüquqlar öhdəliklərin icrası ilə bağlıdır; tapşırıqların yerinə yetirilməməsi halında məsləhətçi səs hüququ müvəqqəti dayandırılır.',
  titleOptions: [
    'Ailənin Kiçik Üzvünün Hüquq və Öhdəliklərini Təsdiq edən Vəsiqə',
    'Ailə Şurasında Səsvermə Hüququnu Təsdiq edən Vəsiqə',
    'Kiçik Ailə Üzvü Statusunu Təsdiq edən Şəhadətnamə',
    'Ailə Qərarlarında İştirak Hüququna dair Vəsiqə'
  ],
  powersOptions: [
    'Ailə şurasında fikir bildirmək hüququ tanınır.',
    'Həftəsonu proqramına bir təklif verilə bilər.',
    'Şam yeməyi seçimində iştirak hüququ verilir.',
    'Otağın daxili nizamı özü tərəfindən müəyyən edilir.',
    'Qonaq siyahısına bir ad əlavə edilə bilər.',
    'Səyahət marşrutunda bir dayanacaq təklif edilir.',
    'Ailə fotolarında yer seçimi hüququ verilir.',
    'Bayram menyusuna bir yemək daxil edilir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Vəsiqə ilə verilən hüquqlar öhdəliklərin icrası ilə bağlıdır; tapşırıqların yerinə yetirilməməsi halında məsləhətçi səs hüququ müvəqqəti dayandırılır.',
    'Vəsiqə hər il yenidən təsdiq edilir.',
    'Hüquqların həcmi yaşa uyğun olaraq genişləndirilir.'
  ]
},
{
  id: 'chore-authority', cat: 'family', tone: 'zarafat', layout: 'viza', palette: 'burgundy',
  title: 'Ev İşlərinin Bölüşdürülməsi və Növbəliliyinə dair İcazə', tag: 'Ev işləri',
  signOrg: 'Ev Tapşırıqları və Daxili Nizam üzrə Baş İdarə',
  powersLabel: 'HƏVALƏ OLUNAN İŞLƏR',
  preamble: '{from} tərəfindən {to} adlı şəxsə ev işlərinin bölüşdürülməsində iştirak etmək və həftəlik cədvəldən öz növbəsini seçmək səlahiyyəti verilir. İcazə cədvəl çərçivəsində qüvvədədir və tapşırıqların vaxtında icrası şərti ilə uzadılır.',
  powers: 'Həftəlik cədvəldən iki tapşırıq seçilə bilər.\nNövbə bir dəfə başqa günə keçirilə bilər.\nTapşırıq axşam saat 20:00-dək tamamlanır.\nDəyişiklik əvvəlcədən bildirilir.',
  penalty: 'Növbənin ardıcıl iki dəfə buraxılması halında seçim hüququ növbəti həftə üçün dayandırılır və tapşırıqlar cədvəl üzrə təyin edilir.',
  titleOptions: [
    'Ev İşlərinin Bölüşdürülməsi və Növbəliliyinə dair İcazə',
    'Ev Tapşırıqlarının Seçilməsi Səlahiyyətinə dair İcazə',
    'Növbənin Başqa Günə Keçirilməsinə dair Məhdud İcazə',
    'Ev İşlərində İştirak Qaydasının Müəyyən Edilməsinə dair İcazə'
  ],
  powersOptions: [
    'Həftəlik cədvəldən iki tapşırıq seçilə bilər.',
    'Növbə bir dəfə başqa günə keçirilə bilər.',
    'Tapşırıq axşam saat 20:00-dək tamamlanır.',
    'Dəyişiklik əvvəlcədən bildirilir.',
    'İki tapşırıq bir günə birləşdirilə bilər.',
    'Xəstəlik halında növbə avtomatik keçirilir.',
    'Əlavə tapşırıq könüllü əsasda götürülür.',
    'Tapşırığın keyfiyyəti birgə qiymətləndirilir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Növbənin ardıcıl iki dəfə buraxılması halında seçim hüququ növbəti həftə üçün dayandırılır və tapşırıqlar cədvəl üzrə təyin edilir.',
    'İcazə hər ayın əvvəlində yenidən verilir.',
    'Könüllü əlavə tapşırıq buraxılmış növbəni əvəz edir.'
  ]
},

/* ---------------- QOHUMLAR / QAYNANA ---------------- */
{
  id: 'mother-in-law-protocol', cat: 'relatives', tone: 'zarafat', layout: 'blank', palette: 'burgundy',
  title: 'Qaynana Ziyarəti Zamanı Tərəflərin Davranış Qaydaları haqqında Bildiriş', tag: 'Protokol',
  signOrg: 'Qohumluq Münasibətlərinin Tənzimlənməsi üzrə Şura',
  toLabel: 'Ziyarət olunan tərəf', fromLabel: 'Ziyarətə gələn tərəf',
  preamble: 'Daxil olmuş müraciətə baxılaraq bildirilir ki, {to} və {from} arasında ziyarət zamanı tətbiq ediləcək davranış qaydaları müəyyən edilmişdir. Qaydalar hər iki tərəfə bərabər şəkildə şamil olunur və ziyarətin müddətindən asılı olaraq dəyişdirilmir.',
  powers: 'Ziyarət ən azı bir gün əvvəl xəbər verilir.\nMətbəxdəki qablaşdırma qaydası dəyişdirilmir.\nEvin səliqəsi barədə rəy soruşulduqda bildirilir.\nYemək resepti tövsiyə kimi verilir, tələb kimi yox.',
  penalty: 'Qaydaların pozulması halında növbəti ziyarətin vaxtı və müddəti tam olaraq ev sahibi tərəfindən müəyyən edilir.',
  titleOptions: [
    'Qaynana Ziyarəti Zamanı Tərəflərin Davranış Qaydaları haqqında Bildiriş',
    'Ziyarət Zamanı Mətbəxə Müdaxilə Hüdudları haqqında Bildiriş',
    'Evin Səliqəsi barədə Rəyin Bildirilməsi Qaydası haqqında Bildiriş',
    'Ziyarətin Müddəti və Xəbərdarlıq Rejimi haqqında Rəsmi Bildiriş'
  ],
  powersOptions: [
    'Ziyarət ən azı bir gün əvvəl xəbər verilir.',
    'Mətbəxdəki qablaşdırma qaydası dəyişdirilmir.',
    'Evin səliqəsi barədə rəy soruşulduqda bildirilir.',
    'Yemək resepti tövsiyə kimi verilir, tələb kimi yox.',
    'Uşaqların tərbiyəsi mövzusu ayrıca müzakirəyə çıxarılmır.',
    'Şkafların içi yoxlanılmır.',
    'Ziyarətin müddəti əvvəlcədən razılaşdırılır.',
    'Gətirilən yemək evin menyusunu əvəz etmir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Qaydaların pozulması halında növbəti ziyarətin vaxtı və müddəti tam olaraq ev sahibi tərəfindən müəyyən edilir.',
    'Bildiriş hər iki ailənin ziyarətlərinə eyni qaydada şamil edilir.',
    'Şərtlər hər il yenidən razılaşdırılır.'
  ]
},
{
  id: 'recipe-secret-act', cat: 'relatives', tone: 'zarafat', layout: 'notarial', palette: 'gold',
  title: 'Ailə Reseptinin Məxfiliyinin Qorunması Öhdəliyi haqqında Akt', tag: 'Sirr',
  signOrg: 'Qohumluq Münasibətlərinin Tənzimlənməsi üzrə Şura',
  preamble: 'İş üzrə toplanmış məlumatlara əsasən {from} tərəfindən {to} adlı şəxsə ailə reseptinin məxfiliyini qorumaq öhdəliyi həvalə edilir. Öhdəlik müddətsizdir və reseptin yalnız ailə daxilində ötürülməsini nəzərdə tutur.',
  powers: 'Resept yazılı formada üçüncü şəxsə verilmir.\nÖlçülər «gözəyarı» ifadəsi ilə izah edilir.\nBir tərkib hissəsi həmişə açıqlanmamış qalır.\nResept yalnız ailə üzvünə ötürülür.',
  penalty: 'Reseptin tam şəkildə kənar şəxsə ötürülməsi halında öhdəliyi pozan tərəf növbəti bayram süfrəsinin hazırlanmasını təkbaşına həyata keçirir.',
  titleOptions: [
    'Ailə Reseptinin Məxfiliyinin Qorunması Öhdəliyi haqqında Akt',
    'Reseptin Yalnız Ailə Daxilində Ötürülməsinə dair Akt',
    'Ölçülərin Dəqiq Açıqlanmaması Ənənəsinin Təsbiti haqqında Akt',
    'Ailə Mətbəx Sirlərinin Saxlanılması üzrə Etibarnamə'
  ],
  powersOptions: [
    'Resept yazılı formada üçüncü şəxsə verilmir.',
    'Ölçülər «gözəyarı» ifadəsi ilə izah edilir.',
    'Bir tərkib hissəsi həmişə açıqlanmamış qalır.',
    'Resept yalnız ailə üzvünə ötürülür.',
    'Süfrədə sual verildikdə ümumi cavab verilir.',
    'Sosial şəbəkədə paylaşım aparılmır.',
    'Dəyişiklik edilərsə ailəyə bildirilir.',
    'Reseptin mənşəyi barədə mübahisə açılmır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Reseptin tam şəkildə kənar şəxsə ötürülməsi halında öhdəliyi pozan tərəf növbəti bayram süfrəsinin hazırlanmasını təkbaşına həyata keçirir.',
    'Öhdəlik ailənin bütün üzvlərinə bərabər şəkildə şamil olunur.',
    'Pozuntu halında resept yeni variantda yenidən tərtib edilir.'
  ]
},
{
  id: 'wedding-advice-license', cat: 'relatives', tone: 'zarafat', layout: 'lisenziya', palette: 'burgundy',
  title: 'Toy Mərasimi ilə Bağlı Məsləhət Vermək Hüququna dair Lisenziya', tag: 'Toy mövsümü',
  signOrg: 'Qohum Sualları və Sosial Təzyiq üzrə Komissiya',
  powersLabel: 'LİSENZİYANIN ƏHATƏ DAİRƏSİ',
  preamble: '{from} tərəfindən {to} adlı şəxsə toy mərasimi ilə bağlı məsləhət vermək hüququ verilir. Lisenziya məsləhətin tövsiyə xarakteri daşıması və qərar qəbulunda həlledici sayılmaması şərti ilə qüvvədədir.',
  powers: 'Məsləhət yalnız soruşulduqda verilir.\nQonaq siyahısına düzəliş təklif edilə bilər.\nMenyu barədə bir tövsiyə qəbul edilir.\n«Bizim vaxtımızda» ifadəsi arqument sayılmır.',
  penalty: 'Məsləhətin tələbə çevrilməsi halında lisenziya dayandırılır və məsləhətçi statusu mərasim başa çatanadək bərpa edilmir.',
  titleOptions: [
    'Toy Mərasimi ilə Bağlı Məsləhət Vermək Hüququna dair Lisenziya',
    'Mərasim Təşkilinə dair Tövsiyə Vermək Səlahiyyətinə dair Lisenziya',
    'Qonaq Siyahısı barədə Fikir Bildirmək Hüququna dair İcazə',
    'Toy Hazırlığında Məsləhətçi Statusuna dair Xüsusi İcazə'
  ],
  powersOptions: [
    'Məsləhət yalnız soruşulduqda verilir.',
    'Qonaq siyahısına düzəliş təklif edilə bilər.',
    'Menyu barədə bir tövsiyə qəbul edilir.',
    '«Bizim vaxtımızda» ifadəsi arqument sayılmır.',
    'Mərasim yeri barədə fikir yekun hesab edilmir.',
    'Büdcə məsələsi ayrıca müzakirə edilir.',
    'Geyim seçiminə müdaxilə edilmir.',
    'Musiqi proqramı təşkilatçıların səlahiyyətindədir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Məsləhətin tələbə çevrilməsi halında lisenziya dayandırılır və məsləhətçi statusu mərasim başa çatanadək bərpa edilmir.',
    'Lisenziya yalnız bir mərasim üçün verilir.',
    'Məsləhətlərin sayı gündə üçdən artıq olmamalıdır.'
  ]
},
{
  id: 'guest-visit-permit', cat: 'relatives', tone: 'zarafat', layout: 'arayis', palette: 'steel',
  title: 'Əvvəlcədən Xəbər Verilmədən Qonaq Gəlmə Hallarının Tənzimlənməsi Arayışı', tag: 'Qonaq',
  signOrg: 'Bayram Ziyarətləri və Süfrə Nizamı üzrə Baş İdarə',
  toLabel: 'İcazə verilən şəxs', fromLabel: 'İcazəni verən ev sahibi',
  preamble: 'Verilir {to} adlı şəxsə ondan ötrü ki, əvvəlcədən xəbər verilmədən qonaq gəlmə halları {from} ilə birgə müzakirə edilmiş və qəbul şərtləri müəyyən olunmuşdur. Arayış hər iki tərəfin ziyarətlərinə şamil edilir.',
  powers: 'Ziyarətdən ən azı bir saat əvvəl zəng edilir.\nXəbərsiz gələn qonaq süfrə gözləməməlidir.\nZiyarətin müddəti iki saatla məhdudlaşır.\nGecə saat 21:00-dan sonra ziyarət təşkil edilmir.',
  penalty: 'Şərtlərin pozulması halında növbəti ziyarətin vaxtı və müddəti tam olaraq ev sahibi tərəfindən müəyyən edilir.',
  titleOptions: [
    'Əvvəlcədən Xəbər Verilmədən Qonaq Gəlmə Hallarının Tənzimlənməsi Arayışı',
    'Xəbərsiz Ziyarətin Qəbul Edilmə Şərtləri haqqında Arayış',
    'Qonaq Qəbulu üçün Minimal Hazırlıq Müddəti haqqında Arayış',
    'Ziyarət Xəbərdarlığının Formaları haqqında Rəsmi Arayış'
  ],
  powersOptions: [
    'Ziyarətdən ən azı bir saat əvvəl zəng edilir.',
    'Xəbərsiz gələn qonaq süfrə gözləməməlidir.',
    'Ziyarətin müddəti iki saatla məhdudlaşır.',
    'Gecə saat 21:00-dan sonra ziyarət təşkil edilmir.',
    'Yaxınlıqdan keçərkən qısa ziyarət icazəlidir.',
    'Uşaqlı qonaqlar əvvəlcədən xəbər verir.',
    'Ev sahibi məşğuldursa ziyarət təxirə salınır.',
    'Bayram günlərində şərtlər yumşaldılır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Şərtlərin pozulması halında növbəti ziyarətin vaxtı və müddəti tam olaraq ev sahibi tərəfindən müəyyən edilir.',
    'Arayış bayram və hüzn günlərinə şamil edilmir.',
    'Şərtlər hər iki tərəf üçün eyni qaydada tətbiq olunur.'
  ]
},
{
  id: 'family-council-decision', cat: 'relatives', tone: 'zarafat', layout: 'qerar', palette: 'ink',
  title: 'Qohumlar Şurasının Müzakirəsindən Sonra Qəbul Edilmiş Qərar', tag: 'Şura',
  signOrg: 'Qohumluq Münasibətlərinin Tənzimlənməsi üzrə Şura',
  preamble: 'Şura {to} adlı şəxsə aid məsələni müzakirə etmiş və müəyyən etmişdir ki, iştirakçıların mövqeyi tam üst-üstə düşməsə də, ümumi qənaətə gəlmək mümkün olmuşdur. {from} tərəfindən bildirilən mövqe qərarın qəbulunda nəzərə alınmışdır.',
  powers: 'Qərar müzakirənin ümumi nəticəsini əks etdirir.\nSəsvermə aparılmamış, ümumi razılıq əldə edilmişdir.\nMəsələ üzrə əlavə müzakirəyə ehtiyac görülmür.\nQərarın icrasına nəzarət şuranın sədrinə həvalə edilir.',
  penalty: 'Qərardan narazı olan şəxslərin etirazları qəbul edilir və qeydə alınır, lakin qərarın qüvvəsinə təsir göstərmir.',
  titleOptions: [
    'Qohumlar Şurasının Müzakirəsindən Sonra Qəbul Edilmiş Qərar',
    'Ailə Məsələsi üzrə Qohumlar Şurasının Yekun Qətnaməsi',
    'Uzunmüddətli Müzakirədən Sonra Qəbul Edilmiş Yekun Qərar',
    'Şuranın Rəyi Nəzərə Alınmaqla Qəbul Edilmiş Qərar'
  ],
  powersOptions: [
    'Qərar müzakirənin ümumi nəticəsini əks etdirir.',
    'Səsvermə aparılmamış, ümumi razılıq əldə edilmişdir.',
    'Məsələ üzrə əlavə müzakirəyə ehtiyac görülmür.',
    'Qərarın icrasına nəzarət şuranın sədrinə həvalə edilir.',
    'İştirak etməyən üzvlərin mövqeyi sonradan soruşulur.',
    'Qərarın mətni ailə arxivində saxlanılır.',
    'Uşaqların rəyi məsləhət xarakteri daşıyır.',
    'Qərar bayram süfrəsində elan edilir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Qərardan narazı olan şəxslərin etirazları qəbul edilir və qeydə alınır, lakin qərarın qüvvəsinə təsir göstərmir.',
    'Məsələ bir ildən sonra yenidən müzakirəyə çıxarıla bilər.',
    'Yeni hallar aşkarlandıqda şura təkrar toplanır.'
  ]
},
{
  id: 'best-son-in-law', cat: 'relatives', tone: 'zarafat', layout: 'diplom', palette: 'gold',
  title: 'Qohumlar Arasında Nümunəvi Münasibətə Görə Verilmiş Fəxri Diplom', tag: 'Fəxri ad',
  signOrg: 'Qohumluq Münasibətlərinin Tənzimlənməsi üzrə Şura',
  preamble: 'Şura {to} adlı şəxsin qohumlarla münasibətdə uzun müddət ərzində göstərdiyi mövqeyi qiymətləndirərək təltif haqqında qərar qəbul etmişdir. Diplom {from} tərəfindən təqdim olunur və ailə arxivində saxlanılır.',
  powers: 'Bayram ziyarətləri heç vaxt təxirə salınmayıb.\nSüfrə arxasında mövqe həmişə diplomatik olub.\nKömək xahiş edilmədən göstərilib.\nQohum sualları səbirlə qarşılanıb.',
  penalty: 'Diplom geri alınmır. Təltif olunan şəxs ildə bir dəfə ailə süfrəsinin yerini və vaxtını müəyyən etmək hüququ qazanır.',
  titleOptions: [
    'Qohumlar Arasında Nümunəvi Münasibətə Görə Verilmiş Fəxri Diplom',
    'Ailəyə Göstərilən Diqqətə Görə Verilmiş Fəxri Diplom',
    'Bayram Ziyarətlərinin Nizamlı İcrasına Görə Fəxri Diplom',
    'Qohumluq Öhdəliklərinin Nümunəvi İcrasına Görə Fəxri Nişan'
  ],
  powersOptions: [
    'Bayram ziyarətləri heç vaxt təxirə salınmayıb.',
    'Süfrə arxasında mövqe həmişə diplomatik olub.',
    'Kömək xahiş edilmədən göstərilib.',
    'Qohum sualları səbirlə qarşılanıb.',
    'Uzaq qohumların adları düzgün xatırlanıb.',
    'Toy və hüzn mərasimlərində iştirak təmin edilib.',
    'Hədiyyə seçimində diqqət göstərilib.',
    'Ailə söhbətlərində mövzu ustalıqla dəyişdirilib.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Diplom geri alınmır. Təltif olunan şəxs ildə bir dəfə ailə süfrəsinin yerini və vaxtını müəyyən etmək hüququ qazanır.',
    'Təltif növbəti ilin nəticələrinə görə yenidən baxılır.',
    'Diplom ailə arxivində müddətsiz saxlanılır.'
  ]
},
{
  id: 'plov-authority', cat: 'relatives', tone: 'zarafat', layout: 'sertifikat', palette: 'forest',
  title: 'Bayram Süfrəsi üçün Plov Hazırlanması Səlahiyyətinin Sertifikatı', tag: 'Süfrə',
  signOrg: 'Bayram Ziyarətləri və Süfrə Nizamı üzrə Baş İdarə',
  powersLabel: 'SƏLAHİYYƏTİN HÜDUDLARI',
  preamble: 'Bununla təsdiq edilir ki, {to} adlı şəxs bayram süfrəsi üçün plov hazırlanması səlahiyyətinə malikdir. Sertifikat {from} tərəfindən, uzun illik təcrübə və ailə üzvlərinin yekdil rəyi əsas götürülərək verilmişdir.',
  powers: 'Düyünün süzülmə anı təkbaşına müəyyən edilir.\nMətbəxə giriş bu mərhələdə məhdudlaşdırılır.\nQazmağın vəziyyəti müzakirə predmeti deyil.\nƏdviyyat ölçüsü barədə məsləhət qəbul edilmir.',
  penalty: 'Plovun keyfiyyəti ailə üzvlərinin əksəriyyəti tərəfindən qənaətbəxş sayılmadıqda sertifikat növbəti bayrama qədər dayandırılır.',
  titleOptions: [
    'Bayram Süfrəsi üçün Plov Hazırlanması Səlahiyyətinin Sertifikatı',
    'Aş Bişirmə Prosesinə Rəhbərlik Səlahiyyətinin Sertifikatı',
    'Düyünün Süzülməsi Mərhələsinə Nəzarət Hüququnun Sertifikatı',
    'Bayram Menyusunun Əsas Yeməyinə Məsuliyyətə dair Şəhadətnamə'
  ],
  powersOptions: [
    'Düyünün süzülmə anı təkbaşına müəyyən edilir.',
    'Mətbəxə giriş bu mərhələdə məhdudlaşdırılır.',
    'Qazmağın vəziyyəti müzakirə predmeti deyil.',
    'Ədviyyat ölçüsü barədə məsləhət qəbul edilmir.',
    'Odun gücü yalnız sertifikat sahibi tərəfindən dəyişdirilir.',
    'Süfrəyə verilmə vaxtı əvvəlcədən elan edilir.',
    'Yardımçı şəxs sertifikat sahibi tərəfindən seçilir.',
    'Qab seçimi ənənəyə uyğun aparılır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Plovun keyfiyyəti ailə üzvlərinin əksəriyyəti tərəfindən qənaətbəxş sayılmadıqda sertifikat növbəti bayrama qədər dayandırılır.',
    'Sertifikat hər il bayram ərəfəsində yenidən təsdiq edilir.',
    'Mətbəxə icazəsiz müdaxilə sertifikatın qüvvəsinə təsir etmir.'
  ]
},
{
  id: 'holiday-visit-contract', cat: 'relatives', tone: 'zarafat', layout: 'muqavile', palette: 'burgundy',
  title: 'Bayram Ziyarətlərinin Növbəliliyi və Müddəti üzrə Müqavilə', tag: 'Bayram',
  signOrg: 'Bayram Ziyarətləri və Süfrə Nizamı üzrə Baş İdarə',
  preamble: 'Tərəflərin mövqeyi nəzərə alınmaqla, {from} və {to} arasında bayram ziyarətlərinin növbəliliyi barədə razılıq əldə edilmişdir. Müqavilə hər iki ailəyə bərabər sayda ziyarət nəzərdə tutur və birtərəfli dəyişdirilmir.',
  powers: 'Bayramın birinci günü növbə ilə bölünür.\nHər ailəyə ayrılan vaxt bərabərdir.\nMarşrut bayramdan bir həftə əvvəl razılaşdırılır.\nZiyarətin ləğvi hər iki tərəfə eyni gün bildirilir.',
  penalty: 'Növbəliliyin pozulması halında növbəti bayramda ilk ziyarətin ünvanı zərərçəkmiş tərəf tərəfindən müəyyən edilir.',
  titleOptions: [
    'Bayram Ziyarətlərinin Növbəliliyi və Müddəti üzrə Müqavilə',
    'İki Ailə Arasında Ziyarət Növbəsinin Bölüşdürülməsi üzrə Saziş',
    'Bayram Günlərinin Bərabər Bölgüsü üzrə Qarşılıqlı Müqavilə',
    'Ziyarət Marşrutunun Əvvəlcədən Razılaşdırılması üzrə Protokol'
  ],
  powersOptions: [
    'Bayramın birinci günü növbə ilə bölünür.',
    'Hər ailəyə ayrılan vaxt bərabərdir.',
    'Marşrut bayramdan bir həftə əvvəl razılaşdırılır.',
    'Ziyarətin ləğvi hər iki tərəfə eyni gün bildirilir.',
    'Uzaq qohumlara ziyarət ayrıca planlaşdırılır.',
    'Gecələmə variantı əvvəlcədən müzakirə edilir.',
    'Hədiyyə büdcəsi bərabər bölünür.',
    'Yol xərcləri ümumi büdcədən ödənilir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Növbəliliyin pozulması halında növbəti bayramda ilk ziyarətin ünvanı zərərçəkmiş tərəf tərəfindən müəyyən edilir.',
    'Müqavilə hər il bayram ərəfəsində yenidən nəzərdən keçirilir.',
    'Fövqəladə hallarda növbəlilik müvəqqəti dayandırılır.'
  ]
},
{
  id: 'relative-telegram', cat: 'relatives', tone: 'zarafat', layout: 'teleqram', palette: 'forest',
  title: 'Qohum Yığıncağında Gözlənilən Suallar barədə Təcili Xəbərdarlıq', tag: 'Təcili',
  signOrg: 'Qohum Sualları və Sosial Təzyiq üzrə Komissiya',
  preamble: 'Sizə bildiririk ki, {to} adlı şəxsin iştirak edəcəyi qohum yığıncağında şəxsi məzmunlu sualların qaldırılması ehtimalı yüksəkdir. {from} tərəfindən əvvəlcədən hazırlıq görülməsi tövsiyə edilir.',
  powers: 'Ən çox gözlənilən sual evlilik mövzusundadır.\nİkinci yerdə iş və maaş məsələsi gəlir.\nSualların pik vaxtı süfrənin ortasıdır.\nMövzunu dəyişmək üçün iki cəhd nəzərdə tutulur.',
  penalty: 'Hazırlıq görülmədikdə suallar bütün yığıncaq boyu davam edir və növbəti tədbirdə də təkrarlanır.',
  titleOptions: [
    'Qohum Yığıncağında Gözlənilən Suallar barədə Təcili Xəbərdarlıq',
    'Süfrə Arxasında Qaldırılacaq Mövzular haqqında Təcili Teleqram',
    'Elçilik Mövzusunun Gündəliyə Salınması haqqında Xəbərdarlıq',
    'Yığıncağa Hazırlıq Tədbirləri haqqında Təcili Bildiriş'
  ],
  powersOptions: [
    'Ən çox gözlənilən sual evlilik mövzusundadır.',
    'İkinci yerdə iş və maaş məsələsi gəlir.',
    'Sualların pik vaxtı süfrənin ortasıdır.',
    'Mövzunu dəyişmək üçün iki cəhd nəzərdə tutulur.',
    'Uşaqlarla oynamaq etibarlı sığınacaq hesab edilir.',
    'Mətbəxə kömək təklifi mövzunu dayandırır.',
    'Telefon zəngi qısamüddətli çıxış imkanı verir.',
    'Erkən ayrılma səbəbi əvvəlcədən hazırlanır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Hazırlıq görülmədikdə suallar bütün yığıncaq boyu davam edir və növbəti tədbirdə də təkrarlanır.',
    'Xəbərdarlıq yalnız məlumat xarakteri daşıyır.',
    'Mövzu dəyişdirildikdə xəbərdarlıq qüvvədən düşür.'
  ]
},
{
  id: 'bride-id', cat: 'relatives', tone: 'zarafat', layout: 'vesiqe', palette: 'burgundy',
  title: 'Ailəyə Yeni Qatılmış Üzvün Hüquq və Öhdəliklərini Təsdiq edən Vəsiqə', tag: 'Vəsiqə',
  signOrg: 'Qohumluq Münasibətlərinin Tənzimlənməsi üzrə Şura',
  fromLabel: 'Vəsiqəni verən',
  preamble: 'Bu vəsiqə {to} adlı şəxsin ailənin tamhüquqlu üzvü olduğunu təsdiq edir. Sənəd {from} tərəfindən verilmişdir, uyğunlaşma dövründə tətbiq edilən güzəştləri əhatə edir və müddətsiz hesab olunur.',
  powers: 'Ailə ənənələri tədricən mənimsənilir.\nMətbəxdə köməklik könüllü əsasda göstərilir.\nSəhv edildikdə xatırlatma bir dəfə olunur.\nÖz ailəsinə ziyarət maneəsiz həyata keçirilir.',
  penalty: 'Vəsiqə ilə verilən güzəştlər uyğunlaşma dövrü ilə məhdudlaşmır; hüquqlar müddətsiz olaraq qüvvədə saxlanılır.',
  titleOptions: [
    'Ailəyə Yeni Qatılmış Üzvün Hüquq və Öhdəliklərini Təsdiq edən Vəsiqə',
    'Yeni Ailə Üzvü Statusunu Təsdiq edən Rəsmi Vəsiqə',
    'Ailə Ənənələrinə Uyğunlaşma Dövrünü Təsbit edən Vəsiqə',
    'Ailədaxili Hüquqların Tanınmasına dair Şəhadətnamə'
  ],
  powersOptions: [
    'Ailə ənənələri tədricən mənimsənilir.',
    'Mətbəxdə köməklik könüllü əsasda göstərilir.',
    'Səhv edildikdə xatırlatma bir dəfə olunur.',
    'Öz ailəsinə ziyarət maneəsiz həyata keçirilir.',
    'Bayram menyusuna bir yemək təklif edilə bilər.',
    'Evin daxili nizamı barədə fikir bildirilir.',
    'Müqayisə aparılması qadağandır.',
    'Şəxsi vaxt hüququ tanınır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Vəsiqə ilə verilən güzəştlər uyğunlaşma dövrü ilə məhdudlaşmır; hüquqlar müddətsiz olaraq qüvvədə saxlanılır.',
    'Vəsiqə hər iki ailəyə eyni qaydada şamil edilir.',
    'Hüquqların həcmi ailə şurasında genişləndirilə bilər.'
  ]
},
{
  id: 'comparison-ban', cat: 'relatives', tone: 'zarafat', layout: 'ekspertiza', palette: 'ink',
  title: 'Qohumlar Arasında Müqayisə Aparılması Praktikasının Qiymətləndirilməsi Rəyi', tag: 'Müqayisə',
  signOrg: 'Qohum Sualları və Sosial Təzyiq üzrə Komissiya',
  preamble: 'Məsələyə dair aparılmış qiymətləndirmə nəticəsində müəyyən edilmişdir ki, {to} adlı şəxsə münasibətdə tətbiq olunan müqayisələr heç bir müsbət nəticə verməmişdir. Rəy {from} tərəfindən verilmiş müraciət əsasında tərtib edilmişdir.',
  powers: 'Müqayisələrin motivasiya effekti sıfıra bərabərdir.\nMüqayisə edilən şəxslərin real vəziyyəti yoxlanılmayıb.\nUğur hekayələrinin əksəriyyəti təsdiqlənməyib.\nPraktikanın dayandırılması tövsiyə olunur.',
  penalty: 'Rəyin nəticələri nəzərə alınmadıqda məsələ ailə şurasının gündəliyinə salınır və əlavə araşdırma aparılır.',
  titleOptions: [
    'Qohumlar Arasında Müqayisə Aparılması Praktikasının Qiymətləndirilməsi Rəyi',
    '«Filankəsin oğlu» Müqayisələrinin Təsiri haqqında Ekspert Rəyi',
    'Ailədaxili Müqayisələrin Nəticələrinin Təhlili haqqında Rəy',
    'Sosial Təzyiq Amillərinin Qiymətləndirilməsinə dair Yekun Rəy'
  ],
  powersOptions: [
    'Müqayisələrin motivasiya effekti sıfıra bərabərdir.',
    'Müqayisə edilən şəxslərin real vəziyyəti yoxlanılmayıb.',
    'Uğur hekayələrinin əksəriyyəti təsdiqlənməyib.',
    'Praktikanın dayandırılması tövsiyə olunur.',
    'Müqayisələr ən çox süfrə arxasında səsləndirilir.',
    'Nəticə əks istiqamətdə təsir göstərir.',
    'Müqayisə edilən tərəflər bir-birini tanımır.',
    'Praktika nəsillər arasında ötürülür.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Rəyin nəticələri nəzərə alınmadıqda məsələ ailə şurasının gündəliyinə salınır və əlavə araşdırma aparılır.',
    'Rəy hər il yenidən qiymətləndirilir.',
    'Praktikanın dayandırılması rəyin arxivə verilməsinə əsasdır.'
  ]
},
{
  id: 'tea-ceremony-act', cat: 'relatives', tone: 'zarafat', layout: 'viza', palette: 'steel',
  title: 'Çay Süfrəsinin Təşkili və Süfrədən Ayrılma Qaydasına dair İcazə', tag: 'Çay',
  signOrg: 'Bayram Ziyarətləri və Süfrə Nizamı üzrə Baş İdarə',
  preamble: '{from} tərəfindən {to} adlı şəxsə çay süfrəsində iştirak müddətini müstəqil müəyyən etmək icazəsi verilir. İcazə qonaqpərvərlik ənənəsini pozmadan tətbiq edilir və ev sahibinə əvvəlcədən bildirilir.',
  powers: 'İkinci stəkandan sonra imtina qəbul edilir.\nSüfrədən ayrılma vaxtı əvvəlcədən elan edilir.\n«Bir stəkan da» təklifi bir dəfə rədd edilə bilər.\nŞirniyyatdan imtina izahat tələb etmir.',
  penalty: 'İcazə ev sahibinin xüsusi hazırladığı şirniyyata şamil edilmir; həmin halda ən azı bir dəfə dadmaq öhdəliyi qalır.',
  titleOptions: [
    'Çay Süfrəsinin Təşkili və Süfrədən Ayrılma Qaydasına dair İcazə',
    'Üçüncü Stəkandan İmtina Hüququna dair Xüsusi İcazə',
    'Çay Süfrəsində İştirak Müddətinin Müəyyən Edilməsinə dair İcazə',
    'Süfrədən Vaxtında Ayrılmaq Hüququna dair Məhdud İcazə'
  ],
  powersOptions: [
    'İkinci stəkandan sonra imtina qəbul edilir.',
    'Süfrədən ayrılma vaxtı əvvəlcədən elan edilir.',
    '«Bir stəkan da» təklifi bir dəfə rədd edilə bilər.',
    'Şirniyyatdan imtina izahat tələb etmir.',
    'Armudu stəkanın seçimi sərbəstdir.',
    'Çayın dəmi barədə rəy bildirmək icazəlidir.',
    'Söhbətin mövzusu birgə müəyyən edilir.',
    'Süfrənin yığılmasında köməklik göstərilir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'İcazə ev sahibinin xüsusi hazırladığı şirniyyata şamil edilmir; həmin halda ən azı bir dəfə dadmaq öhdəliyi qalır.',
    'İcazə bayram və hüzn süfrələrində qüvvədən düşür.',
    'Şərtlərə əməl edilməsi icazənin uzadılmasına əsasdır.'
  ]
},

/* ---------------- TƏLƏBƏLƏR / UNİVERSİTET ---------------- */
{
  id: 'exam-luck-certificate', cat: 'student', tone: 'zarafat', layout: 'sertifikat', palette: 'gold',
  title: 'İmtahan Ərəfəsində Görülmüş Hazırlıq İşlərini Təsdiq edən Sertifikat', tag: 'İmtahan',
  signOrg: 'Tələbə Öhdəlikləri və İmtahan Rejimi üzrə Şura',
  powersLabel: 'SERTİFİKATIN VERDİYİ ZƏMANƏTLƏR',
  preamble: 'Bununla təsdiq edilir ki, {to} adlı şəxs imtahan ərəfəsində mövcud imkanlar daxilində hazırlıq işləri görmüşdür. Sertifikat {from} tərəfindən, hazırlığın həcmindən asılı olmayaraq nəticənin müsbət olacağı ümidi ilə verilir.',
  powers: 'Konspekt son gecə tam oxunub.\nSuallar siyahısı əldə edilib.\nƏn çətin mövzu axıra saxlanılıb.\nNəticə müəllimin əhvalından da asılıdır.',
  penalty: 'Sertifikat imtahanın nəticəsinə heç bir təsir göstərmir və qiymətin mübahisələndirilməsi üçün əsas sayılmır.',
  titleOptions: [
    'İmtahan Ərəfəsində Görülmüş Hazırlıq İşlərini Təsdiq edən Sertifikat',
    'Bir Gecəlik Hazırlığın Nəticələrini Təsdiq edən Sertifikat',
    'İmtahana Buraxılış Şərtlərinin Yerinə Yetirildiyi Sertifikatı',
    'Uğur Arzusunun Rəsmi Qaydada Çatdırılmasına dair Şəhadətnamə'
  ],
  powersOptions: [
    'Konspekt son gecə tam oxunub.',
    'Suallar siyahısı əldə edilib.',
    'Ən çətin mövzu axıra saxlanılıb.',
    'Nəticə müəllimin əhvalından da asılıdır.',
    'Qrup yoldaşları ilə birgə təkrar aparılıb.',
    'Gecə yatmaq vaxtı qurban verilib.',
    'Bilet seçimi təsadüf amilinə buraxılıb.',
    'Yaddaş mexanizmi son anda işə düşür.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Sertifikat imtahanın nəticəsinə heç bir təsir göstərmir və qiymətin mübahisələndirilməsi üçün əsas sayılmır.',
    'Sertifikat yalnız bir imtahana aiddir.',
    'Nəticə müsbət olduqda sertifikat arxivə verilir.'
  ]
},
{
  id: 'konspekt-loan', cat: 'student', tone: 'zarafat', layout: 'muqavile', palette: 'steel',
  title: 'Konspektin Müvəqqəti İstifadəyə Verilməsi Şərtləri üzrə Müqavilə', tag: 'Konspekt',
  signOrg: 'Tələbə Öhdəlikləri və İmtahan Rejimi üzrə Şura',
  preamble: 'Tərəflərin mövqeyi nəzərə alınmaqla, {from} və {to} arasında konspektin müvəqqəti istifadəyə verilməsi barədə razılıq əldə edilmişdir. Müqavilə materialın vəziyyətinə görə məsuliyyəti də əhatə edir.',
  powers: 'Konspekt iki gün ərzində qaytarılır.\nSəhifələr cırılmır və üzərinə yazılmır.\nSurət yalnız şəxsi istifadə üçün çıxarılır.\nÜçüncü şəxsə ötürülməsi qadağandır.',
  penalty: 'Konspektin vaxtında qaytarılmaması halında növbəti semestrdə material istifadəyə verilmir və müraciətə baxılmır.',
  titleOptions: [
    'Konspektin Müvəqqəti İstifadəyə Verilməsi Şərtləri üzrə Müqavilə',
    'Dərs Materialının Qaytarılma Müddəti üzrə Qarşılıqlı Saziş',
    'Konspektin Surətinin Çıxarılması Qaydası üzrə Müqavilə',
    'Qeydlərin Üçüncü Şəxsə Ötürülməməsi üzrə Protokol'
  ],
  powersOptions: [
    'Konspekt iki gün ərzində qaytarılır.',
    'Səhifələr cırılmır və üzərinə yazılmır.',
    'Surət yalnız şəxsi istifadə üçün çıxarılır.',
    'Üçüncü şəxsə ötürülməsi qadağandır.',
    'İmtahan ərəfəsində müddət bir günə endirilir.',
    'Çatışmayan mövzular birlikdə tamamlanır.',
    'Qaytarılma faktı yazışma ilə təsdiqlənir.',
    'İtirilmə halında yenidən yazılır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Konspektin vaxtında qaytarılmaması halında növbəti semestrdə material istifadəyə verilmir və müraciətə baxılmır.',
    'Müqavilə hər semestr üçün yenidən bağlanır.',
    'Materialın zədələnməsi bərpa öhdəliyi yaradır.'
  ]
},
{
  id: 'dorm-charter', cat: 'student', tone: 'zarafat', layout: 'blank', palette: 'forest',
  title: 'Yataqxana Otağında Birgə Yaşayış Qaydaları haqqında Bəyannamə', tag: 'Yataqxana',
  signOrg: 'Yataqxana Məsələləri üzrə Qarşılıqlı Komissiya',
  preamble: 'Bu bəyannamə ilə {to} və {from} otaqda birgə yaşayış qaydalarını qəbul edirlər. Qaydalar təmizlik növbəsini, gecə rejimini və ümumi ehtiyatın istifadəsini əhatə edir, hər iki tərəfə bərabər şamil olunur və semestrin sonunadək qüvvədə qalır.',
  powers: 'Təmizlik növbəsi həftəlik dəyişdirilir.\nGecə saat 24:00-dan sonra səs həddi azaldılır.\nÜmumi ərzaq soruşulmadan götürülmür.\nQonaq gəlişi əvvəlcədən bildirilir.',
  penalty: 'Qaydaların pozulması halında növbəti həftənin təmizlik növbəsi tam olaraq pozuntuya yol vermiş tərəfin üzərinə düşür.',
  titleOptions: [
    'Yataqxana Otağında Birgə Yaşayış Qaydaları haqqında Bəyannamə',
    'Otaq Yoldaşları Arasında Növbəliliyin Müəyyən Edilməsi Bəyannaməsi',
    'Gecə Rejimi və Səs Həddi Qaydaları haqqında Bildiriş',
    'Ümumi Ərzaq Ehtiyatının İstifadəsi Qaydaları haqqında Bəyannamə'
  ],
  powersOptions: [
    'Təmizlik növbəsi həftəlik dəyişdirilir.',
    'Gecə saat 24:00-dan sonra səs həddi azaldılır.',
    'Ümumi ərzaq soruşulmadan götürülmür.',
    'Qonaq gəlişi əvvəlcədən bildirilir.',
    'İşıq rejimi birgə razılaşdırılır.',
    'Qab-qacaq istifadədən sonra dərhal yuyulur.',
    'Şəxsi əşyalar öz rəfində saxlanılır.',
    'İmtahan dövründə səssizlik rejimi tətbiq olunur.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Qaydaların pozulması halında növbəti həftənin təmizlik növbəsi tam olaraq pozuntuya yol vermiş tərəfin üzərinə düşür.',
    'Bəyannamə hər semestrin əvvəlində yenilənir.',
    'Yeni otaq yoldaşı qaydalara qoşulur.'
  ]
},
{
  id: 'late-arrival-license', cat: 'student', tone: 'zarafat', layout: 'lisenziya', palette: 'burgundy',
  title: 'Dərsə Gecikmə Hallarının Rəsmiləşdirilməsinə dair Məhdud Lisenziya', tag: 'Gecikmə',
  signOrg: 'Auditoriya Nizamı və Davamiyyət üzrə Baş İdarə',
  powersLabel: 'LİSENZİYANIN ƏHATƏ ETDİYİ HALLAR',
  preamble: '{from} tərəfindən {to} adlı şəxsə dərsə gecikmə hallarının rəsmiləşdirilməsi üçün məhdud lisenziya verilir. Lisenziya semestr ərzində müəyyən sayda istifadə nəzərdə tutur və hər hal qeydə alınır.',
  powers: 'Semestr ərzində limit beş gecikmə müəyyən edilir.\nAuditoriyaya səssiz daxil olma şərtdir.\nOn beş dəqiqədən artıq gecikmə qeydə alınmır.\nSəhər cütləri üçün limit ayrıca hesablanır.',
  penalty: 'Limit tükəndikdən sonra hər gecikmə davamiyyət jurnalına yazılır və lisenziya semestrin sonuna qədər bərpa edilmir.',
  titleOptions: [
    'Dərsə Gecikmə Hallarının Rəsmiləşdirilməsinə dair Məhdud Lisenziya',
    'Auditoriyaya Səssiz Daxil Olma Hüququna dair Lisenziya',
    'Səhər Cütlərinə Gecikmənin Tənzimlənməsinə dair İcazə',
    'Gecikmə Limitinin Müəyyən Edilməsinə dair Müddətli Lisenziya'
  ],
  powersOptions: [
    'Semestr ərzində limit beş gecikmə müəyyən edilir.',
    'Auditoriyaya səssiz daxil olma şərtdir.',
    'On beş dəqiqədən artıq gecikmə qeydə alınmır.',
    'Səhər cütləri üçün limit ayrıca hesablanır.',
    'Nəqliyyat problemi ayrıca kateqoriyadır.',
    'Növbəti cütə vaxtında gəlmək tələb olunur.',
    'Yoxlama işi günü lisenziya qüvvədən düşür.',
    'Limit semestrin sonunda sıfırlanır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Limit tükəndikdən sonra hər gecikmə davamiyyət jurnalına yazılır və lisenziya semestrin sonuna qədər bərpa edilmir.',
    'Lisenziya imtahan günlərinə şamil edilmir.',
    'Vaxtında gəlmək limitin bərpasına əsas vermir.'
  ]
},
{
  id: 'attendance-arayis', cat: 'student', tone: 'zarafat', layout: 'arayis', palette: 'steel',
  title: 'Semestr Ərzində Dərslərdə İştirak Vəziyyəti haqqında Arayış', tag: 'Davamiyyət',
  signOrg: 'Auditoriya Nizamı və Davamiyyət üzrə Baş İdarə',
  toLabel: 'Arayış verilir', fromLabel: 'Təsdiq edən qrup yoldaşı',
  preamble: 'Verilir {to} adlı şəxsə ondan ötrü ki, semestr ərzində dərslərdə iştirak vəziyyəti {from} tərəfindən yoxlanılmış və göstəricilər ümumiləşdirilmişdir. Arayış bütün fənləri əhatə edir.',
  powers: 'Ümumi davamiyyət hədd səviyyəsindədir.\nBuraxılmış saatların çoxu səhər cütlərinə düşür.\nSəbəb kimi ən çox nəqliyyat göstərilib.\nİmtahana buraxılış şərti hələ pozulmayıb.',
  penalty: 'Buraxılmış saatların sayı həddi aşdıqda imtahana buraxılış dayandırılır və arayış bu halda əsas kimi qəbul edilmir.',
  titleOptions: [
    'Semestr Ərzində Dərslərdə İştirak Vəziyyəti haqqında Arayış',
    'Davamiyyət Göstəricilərinin Ümumiləşdirilməsi haqqında Arayış',
    'Buraxılmış Saatların Səbəbləri haqqında Rəsmi Arayış',
    'İmtahana Buraxılış Şərtinin Vəziyyəti haqqında Arayış'
  ],
  powersOptions: [
    'Ümumi davamiyyət hədd səviyyəsindədir.',
    'Buraxılmış saatların çoxu səhər cütlərinə düşür.',
    'Səbəb kimi ən çox nəqliyyat göstərilib.',
    'İmtahana buraxılış şərti hələ pozulmayıb.',
    'Praktiki məşğələlərdə iştirak yüksəkdir.',
    'Cümə günləri göstərici aşağı düşür.',
    'Buraxılışın bərpası üçün imkan qalır.',
    'Qeydiyyat jurnalı ilə uyğunluq təsdiqlənib.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Buraxılmış saatların sayı həddi aşdıqda imtahana buraxılış dayandırılır və arayış bu halda əsas kimi qəbul edilmir.',
    'Arayış yalnız cari semestrə aiddir.',
    'Göstəricilər həftəlik yenilənir.'
  ]
},
{
  id: 'deadline-decision', cat: 'student', tone: 'zarafat', layout: 'qerar', palette: 'ink',
  title: 'Kurs İşinin Təhvil Müddətinin Uzadılması haqqında Qərar', tag: 'Təhvil',
  signOrg: 'Tələbə Öhdəlikləri və İmtahan Rejimi üzrə Şura',
  preamble: 'Şura {to} adlı şəxsin müraciətinə baxaraq müəyyən etmişdir ki, işin tamamlanmasına mane olan hallar qismən əsaslıdır. {from} tərəfindən bildirilən mövqe nəzərə alınmaqla müddətin uzadılması məqsədəuyğun hesab edilmişdir.',
  powers: 'Müddət yeddi gün uzadılır.\nUzadılma bir dəfə tətbiq edilir.\nAralıq variant üç gün ərzində təqdim olunur.\nYeni müddət dəyişdirilmir.',
  penalty: 'Uzadılmış müddət də pozulduqda iş növbəti semestrə keçirilir və müddət uzatma müraciətlərinə baxılmır.',
  titleOptions: [
    'Kurs İşinin Təhvil Müddətinin Uzadılması haqqında Qərar',
    'Tapşırığın Təhvil Tarixinin Yenidən Müəyyən Edilməsi haqqında Qərar',
    'Müddət Uzatma Müraciətinə Baxılması haqqında Yekun Qətnamə',
    'Son Tarixin Bir Dəfə Uzadılması haqqında Qərar'
  ],
  powersOptions: [
    'Müddət yeddi gün uzadılır.',
    'Uzadılma bir dəfə tətbiq edilir.',
    'Aralıq variant üç gün ərzində təqdim olunur.',
    'Yeni müddət dəyişdirilmir.',
    'Mövzunun dəyişdirilməsinə icazə verilmir.',
    'Ədəbiyyat siyahısı əvvəlcədən təsdiqlənir.',
    'Həcm tələbi azaldılmır.',
    'Təqdimat tarixi ayrıca müəyyən edilir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Uzadılmış müddət də pozulduqda iş növbəti semestrə keçirilir və müddət uzatma müraciətlərinə baxılmır.',
    'Aralıq variant təqdim edilmədikdə uzadılma ləğv edilir.',
    'Qərardan narazılıq qeydə alınır, lakin müddətə təsir etmir.'
  ]
},
{
  id: 'group-leader-diploma', cat: 'student', tone: 'zarafat', layout: 'diplom', palette: 'burgundy',
  title: 'Qrup Nümayəndəsi Vəzifəsinin İcrasına Görə Verilmiş Fəxri Diplom', tag: 'Nümayəndə',
  signOrg: 'Auditoriya Nizamı və Davamiyyət üzrə Baş İdarə',
  preamble: 'Baş İdarə {to} adlı şəxsin qrup nümayəndəsi kimi yerinə yetirdiyi işi qiymətləndirərək təltif haqqında qərar qəbul etmişdir. Diplom {from} tərəfindən qrupun yekdil rəyi əsasında təqdim olunur.',
  powers: 'Cədvəl dəyişikliyi dərhal çatdırılıb.\nMüəllimlə danışıqlar səbirlə aparılıb.\nQrupun xahişləri vaxtında ötürülüb.\nHeç kim məlumatsız qalmayıb.',
  penalty: 'Diplom geri alınmır. Təltif olunan şəxs növbəti semestrdə vəzifədən imtina etmək hüququnu saxlayır.',
  titleOptions: [
    'Qrup Nümayəndəsi Vəzifəsinin İcrasına Görə Verilmiş Fəxri Diplom',
    'Qrupla Müəllim Arasında Əlaqənin Təmin Edilməsinə Görə Diplom',
    'Cədvəl Dəyişikliklərinin Vaxtında Çatdırılmasına Görə Diplom',
    'Qrupun Maraqlarının Müdafiəsinə Görə Verilmiş Fəxri Nişan'
  ],
  powersOptions: [
    'Cədvəl dəyişikliyi dərhal çatdırılıb.',
    'Müəllimlə danışıqlar səbirlə aparılıb.',
    'Qrupun xahişləri vaxtında ötürülüb.',
    'Heç kim məlumatsız qalmayıb.',
    'Sənədlərin toplanması nizamla aparılıb.',
    'Auditoriya dəyişikliyi əvvəlcədən bildirilib.',
    'İmtahan tarixləri dəqiqləşdirilib.',
    'Qrup söhbətində nizam saxlanılıb.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Diplom geri alınmır. Təltif olunan şəxs növbəti semestrdə vəzifədən imtina etmək hüququnu saxlayır.',
    'Təltif hər semestrin sonunda yenidən verilir.',
    'Diplom qrup arxivində saxlanılır.'
  ]
},
{
  id: 'coffee-night-act', cat: 'student', tone: 'zarafat', layout: 'notarial', palette: 'ink',
  title: 'İmtahan Ərəfəsində Gecə Hazırlığının Aparılması haqqında Akt', tag: 'Gecə',
  signOrg: 'Tələbə Öhdəlikləri və İmtahan Rejimi üzrə Şura',
  preamble: 'İş üzrə toplanmış məlumatlara əsasən müəyyən edilmişdir ki, {to} adlı şəxs imtahan ərəfəsində gecə hazırlığı rejiminə keçmişdir. Akt {from} tərəfindən, prosesin bilavasitə müşahidəsi əsasında tərtib edilmişdir.',
  powers: 'Hazırlıq gecə saat 23:00-da başlayıb.\nİlk iki saat mövzu axtarışına sərf olunub.\nQəhvə ehtiyatı səhərə qədər çatmayıb.\nSon mövzu açılmamış qalıb.',
  penalty: 'Akt hazırlığın keyfiyyətini deyil, yalnız faktını təsbit edir və imtahan nəticəsinə heç bir təsir göstərmir.',
  titleOptions: [
    'İmtahan Ərəfəsində Gecə Hazırlığının Aparılması haqqında Akt',
    'Bir Gecədə Semestrin Mənimsənilməsi Cəhdi haqqında Akt',
    'Gecə Saatlarında Oxu Rejiminin Tətbiqi haqqında Etibarnamə',
    'Səhərə Qədər Davam Edən Hazırlıq haqqında Rəsmi Akt'
  ],
  powersOptions: [
    'Hazırlıq gecə saat 23:00-da başlayıb.',
    'İlk iki saat mövzu axtarışına sərf olunub.',
    'Qəhvə ehtiyatı səhərə qədər çatmayıb.',
    'Son mövzu açılmamış qalıb.',
    'Konspekt son anda əldə edilib.',
    'Qrup söhbətində sual mübadiləsi aparılıb.',
    'Yuxu rejimi tam pozulub.',
    'Səhər imtahana vaxtında gedilib.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Akt hazırlığın keyfiyyətini deyil, yalnız faktını təsbit edir və imtahan nəticəsinə heç bir təsir göstərmir.',
    'Akt yalnız bir imtahan dövrünə aiddir.',
    'Rejimin təkrarı ayrıca qeydə alınır.'
  ]
},
{
  id: 'exam-telegram', cat: 'student', tone: 'zarafat', layout: 'teleqram', palette: 'gold',
  title: 'İmtahan Nəticəsinin Elan Edilməsi haqqında Təcili Teleqram', tag: 'Nəticə',
  signOrg: 'Tələbə Öhdəlikləri və İmtahan Rejimi üzrə Şura',
  preamble: 'Sizə bildiririk ki, {to} adlı şəxsin imtahan nəticəsi elan edilmiş və jurnala salınmışdır. {from} tərəfindən nəticənin sakit şəraitdə qarşılanması, qəti tədbirlərdən çəkinilməsi və apellyasiya müddətinin nəzərə alınması xahiş olunur.',
  powers: 'Nəticə jurnala salınıb.\nApellyasiya müddəti üç gündür.\nDigər fənlər üzrə vəziyyət sabitdir.\nÜmumi orta göstərici saxlanılıb.',
  penalty: 'Nəticə apellyasiya müddəti ərzində mübahisələndirilmədikdə qəti hesab edilir və sonrakı müraciətlərə baxılmır.',
  titleOptions: [
    'İmtahan Nəticəsinin Elan Edilməsi haqqında Təcili Teleqram',
    'Qiymətin Jurnala Salınması haqqında Təcili Bildiriş',
    'Gözlənilən və Faktiki Nəticə Arasındakı Fərq haqqında Teleqram',
    'İmtahan Nəticəsi barədə Ailəyə Ünvanlanmış Xəbərdarlıq'
  ],
  powersOptions: [
    'Nəticə jurnala salınıb.',
    'Apellyasiya müddəti üç gündür.',
    'Digər fənlər üzrə vəziyyət sabitdir.',
    'Ümumi orta göstərici saxlanılıb.',
    'Təkrar imtahan imkanı mövcuddur.',
    'Müəllimlə görüş təyin edilib.',
    'Növbəti fənn üzrə hazırlıq başlayıb.',
    'Səbəblərin təhlili aparılır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Nəticə apellyasiya müddəti ərzində mübahisələndirilmədikdə qəti hesab edilir və sonrakı müraciətlərə baxılmır.',
    'Teleqram yalnız məlumat xarakteri daşıyır.',
    'Nəticə düzəldildikdə teleqram arxivə verilir.'
  ]
},
{
  id: 'student-id', cat: 'student', tone: 'zarafat', layout: 'vesiqe', palette: 'forest',
  title: 'Tələbənin Statusunu və Akademik Vəziyyətini Təsdiq edən Vəsiqə', tag: 'Şərəf',
  signOrg: 'Auditoriya Nizamı və Davamiyyət üzrə Baş İdarə',
  fromLabel: 'Vəsiqəni verən',
  preamble: 'Bu vəsiqə {to} adlı şəxsin tələbə statusunu və cari akademik vəziyyətini təsdiq edir. Sənəd {from} tərəfindən verilmişdir, semestrin sonuna qədər qüvvədə hesab edilir və güzəştlərdən istifadə hüququ verir.',
  powers: 'Kitabxanadan istifadə hüququ tanınır.\nNəqliyyat güzəştindən istifadə edilir.\nAuditoriyaya sərbəst giriş təmin olunur.\nQrup tədbirlərində iştirak hüququ verilir.',
  penalty: 'Vəsiqə ilə tanınan güzəştlər davamiyyət və akademik borc göstəricilərindən asılıdır; şərtlər pozulduqda statusa yenidən baxılır.',
  titleOptions: [
    'Tələbənin Statusunu və Akademik Vəziyyətini Təsdiq edən Vəsiqə',
    'Tələbə Statusunun və Güzəştlərin Təsdiqinə dair Vəsiqə',
    'Akademik Göstəricilərin Cari Vəziyyətinə dair Şəhadətnamə',
    'Kitabxana və Auditoriya Hüquqlarını Təsdiq edən Vəsiqə'
  ],
  powersOptions: [
    'Kitabxanadan istifadə hüququ tanınır.',
    'Nəqliyyat güzəştindən istifadə edilir.',
    'Auditoriyaya sərbəst giriş təmin olunur.',
    'Qrup tədbirlərində iştirak hüququ verilir.',
    'Elmi dərnəklərə üzvlük açıqdır.',
    'İdman zalından istifadə icazəlidir.',
    'Yataqxana növbəsində iştirak hüququ var.',
    'Təqaüd müraciəti verilə bilər.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Vəsiqə ilə tanınan güzəştlər davamiyyət və akademik borc göstəricilərindən asılıdır; şərtlər pozulduqda statusa yenidən baxılır.',
    'Vəsiqə hər semestr yenidən təsdiq edilir.',
    'Akademik borc güzəştləri dayandırır.'
  ]
},
{
  id: 'presentation-authority', cat: 'student', tone: 'zarafat', layout: 'viza', palette: 'forest',
  title: 'Qrup Layihəsinin Təqdim Edilməsi Səlahiyyətinin Verilməsinə dair İcazə', tag: 'Təqdimat',
  signOrg: 'Auditoriya Nizamı və Davamiyyət üzrə Baş İdarə',
  powersLabel: 'SƏLAHİYYƏTİN HÜDUDLARI',
  preamble: '{from} tərəfindən {to} adlı şəxsə qrup layihəsini auditoriyada təqdim etmək səlahiyyəti verilir. İcazə layihənin hazırlanmasında iştirak edən bütün üzvlərin razılığı ilə rəsmiləşdirilmişdir.',
  powers: 'Təqdimat müddəti on dəqiqə müəyyən edilir.\nSuallara komanda adından cavab verilir.\nSlaydlar əvvəlcədən razılaşdırılır.\nHər üzvün adı təqdimatda qeyd olunur.',
  penalty: 'Təqdimatda iştirak etməyən üzvlərin adı çıxışda qeyd edilmir və qiymətləndirmə fərdi qaydada aparılır.',
  titleOptions: [
    'Qrup Layihəsinin Təqdim Edilməsi Səlahiyyətinin Verilməsinə dair İcazə',
    'Layihənin Auditoriyada Danışılması Səlahiyyətinə dair İcazə',
    'Sualların Cavablandırılması Öhdəliyinə dair Xüsusi İcazə',
    'Komanda Adından Çıxış Etmək Hüququna dair İcazə'
  ],
  powersOptions: [
    'Təqdimat müddəti on dəqiqə müəyyən edilir.',
    'Suallara komanda adından cavab verilir.',
    'Slaydlar əvvəlcədən razılaşdırılır.',
    'Hər üzvün adı təqdimatda qeyd olunur.',
    'Çətin sual müvafiq üzvə yönləndirilir.',
    'Texniki hazırlıq bir gün əvvəl yoxlanılır.',
    'Ehtiyat nüsxə saxlanılır.',
    'Qiymət komandaya bərabər yazılır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Təqdimatda iştirak etməyən üzvlərin adı çıxışda qeyd edilmir və qiymətləndirmə fərdi qaydada aparılır.',
    'İcazə yalnız bir layihəyə şamil edilir.',
    'Səlahiyyət komandanın qərarı ilə dəyişdirilə bilər.'
  ]
},
{
  id: 'retake-amnesty', cat: 'student', tone: 'zarafat', layout: 'ekspertiza', palette: 'gold',
  title: 'Təkrar İmtahan Hüququnun Verilməsi Şərtlərinin Qiymətləndirilməsi Rəyi', tag: 'Təkrar',
  signOrg: 'Tələbə Öhdəlikləri və İmtahan Rejimi üzrə Şura',
  toLabel: 'Amnistiya olunan', fromLabel: 'Amnistiya verən',
  preamble: 'Aparılmış qiymətləndirmə nəticəsində müəyyən edilmişdir ki, {to} adlı şəxsin akademik borcu təkrar imtahan yolu ilə bağlanması mümkündür. Rəy {from} tərəfindən verilmiş müraciət əsasında tərtib edilmişdir.',
  powers: 'Borcun bağlanması üçün vaxt kifayətdir.\nTəkrar imtahan bir dəfə verilir.\nHazırlıq planı iki həftəyə hesablanıb.\nDigər fənlərə təsir minimaldır.',
  penalty: 'Təkrar imtahan da uğursuz olduqda fənn növbəti semestrə keçirilir və əlavə müraciətlərə baxılmır.',
  titleOptions: [
    'Təkrar İmtahan Hüququnun Verilməsi Şərtlərinin Qiymətləndirilməsi Rəyi',
    'Akademik Borcun Bağlanması İmkanlarına dair Ekspert Rəyi',
    'Təkrar İmtahana Buraxılış Şərtlərinin Təhlili haqqında Rəy',
    'Semestrin Xilas Edilməsi İmkanlarına dair Yekun Rəy'
  ],
  powersOptions: [
    'Borcun bağlanması üçün vaxt kifayətdir.',
    'Təkrar imtahan bir dəfə verilir.',
    'Hazırlıq planı iki həftəyə hesablanıb.',
    'Digər fənlərə təsir minimaldır.',
    'Konsultasiya saatlarından istifadə tövsiyə olunur.',
    'Ən zəif mövzular əvvəlcədən müəyyən edilib.',
    'Qrup yoldaşlarının köməyi nəzərdə tutulur.',
    'Nəticə ümumi göstəriciyə daxil edilir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Təkrar imtahan da uğursuz olduqda fənn növbəti semestrə keçirilir və əlavə müraciətlərə baxılmır.',
    'Rəy yalnız bir fənnə aiddir.',
    'Hazırlıq planına əməl edilməməsi rəyi qüvvədən salır.'
  ]
},

/* ---------------- QONŞULAR / HƏYƏT ---------------- */
{
  id: 'noise-curfew', cat: 'neighbors', tone: 'zarafat', layout: 'blank', palette: 'steel',
  title: 'Binada Gecə Səs Rejiminin Müəyyən Edilməsi haqqında Bildiriş', tag: 'Səs-küy',
  signOrg: 'Səs-Küy və Gecə Rejimi üzrə Nəzarət İdarəsi',
  preamble: 'Daxil olmuş müraciətə baxılaraq bildirilir ki, binada gecə səs rejimi müəyyən edilmişdir. {from} tərəfindən verilmiş məlumat və {to} adlı şəxsin izahatı qərarın qəbulunda nəzərə alınmışdır.',
  powers: 'Gecə saat 23:00-dan sonra səs həddi azaldılır.\nTəmir işləri yalnız gündüz saatlarında aparılır.\nBayram günləri istisna hal kimi qəbul edilir.\nŞikayət əvvəlcə şifahi bildirilir.',
  penalty: 'Rejimin ardıcıl pozulması halında məsələ bina sakinlərinin ümumi yığıncağının gündəliyinə salınır.',
  titleOptions: [
    'Binada Gecə Səs Rejiminin Müəyyən Edilməsi haqqında Bildiriş',
    'Ümumi İstifadə Saatlarında Səs Həddi haqqında Rəsmi Bildiriş',
    'Təmir İşlərinin Aparılma Vaxtı haqqında Bildiriş',
    'Gecə Dincliyinin Təmin Edilməsi Tədbirləri haqqında Bildiriş'
  ],
  powersOptions: [
    'Gecə saat 23:00-dan sonra səs həddi azaldılır.',
    'Təmir işləri yalnız gündüz saatlarında aparılır.',
    'Bayram günləri istisna hal kimi qəbul edilir.',
    'Şikayət əvvəlcə şifahi bildirilir.',
    'Musiqi səsi qonşu mənzildə eşidilməməlidir.',
    'Ağır əşyalar sürüşdürülmür, qaldırılır.',
    'Uşaq səsləri pozuntu sayılmır.',
    'Tədbir barədə bir gün əvvəl xəbər verilir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Rejimin ardıcıl pozulması halında məsələ bina sakinlərinin ümumi yığıncağının gündəliyinə salınır.',
    'Bildiriş binanın bütün mənzillərinə şamil edilir.',
    'Bayram gecələri rejim müvəqqəti yumşaldılır.'
  ]
},
{
  id: 'parking-authority', cat: 'neighbors', tone: 'zarafat', layout: 'notarial', palette: 'gold',
  title: 'Həyətdə Park Yerindən İstifadə Səlahiyyətinin Verilməsinə dair Akt', tag: 'Park',
  signOrg: 'Ümumi İstifadə Sahələri üzrə Qarşılıqlı Komissiya',
  powersLabel: 'PARK YERİ ÜZRƏ SƏLAHİYYƏTLƏR',
  preamble: 'İş üzrə toplanmış məlumatlara əsasən {from} tərəfindən {to} adlı şəxsə həyətdə park yerindən istifadə səlahiyyəti verilir. Səlahiyyət digər sakinlərin hüquqlarını məhdudlaşdırmır və girişin bağlanmaması şərti ilə qüvvədədir.',
  powers: 'Park yeri girişi bağlamayacaq şəkildə seçilir.\nİki yer birdən tutulmur.\nQonaq avtomobili üçün yer ayrılır.\nUzunmüddətli dayanma barədə xəbər verilir.',
  penalty: 'Girişin bağlanması halında avtomobil sahibinə dərhal müraciət edilir; təkrar hallarda məsələ ümumi yığıncağa çıxarılır.',
  titleOptions: [
    'Həyətdə Park Yerindən İstifadə Səlahiyyətinin Verilməsinə dair Akt',
    'Daimi Park Yerinin Təsbit Edilməsinə dair Rəsmi Akt',
    'Avtomobilin Yerləşdirilməsi Qaydasına dair Etibarnamə',
    'Qonaq Avtomobilləri üçün Yer Ayrılmasına dair Akt'
  ],
  powersOptions: [
    'Park yeri girişi bağlamayacaq şəkildə seçilir.',
    'İki yer birdən tutulmur.',
    'Qonaq avtomobili üçün yer ayrılır.',
    'Uzunmüddətli dayanma barədə xəbər verilir.',
    'Uşaq meydançasının qarşısı boş saxlanılır.',
    'Zibil maşınının yolu bağlanmır.',
    'Nömrə və əlaqə vasitəsi görünən yerdə qoyulur.',
    'Qar təmizləmə günü avtomobil yerdəyişdirilir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Girişin bağlanması halında avtomobil sahibinə dərhal müraciət edilir; təkrar hallarda məsələ ümumi yığıncağa çıxarılır.',
    'Akt yalnız bina sakinlərinə şamil edilir.',
    'Yerlərin bölgüsü hər il yenidən aparılır.'
  ]
},
{
  id: 'stairwell-duty', cat: 'neighbors', tone: 'zarafat', layout: 'arayis', palette: 'forest',
  title: 'Pilləkən Sahəsinin Təmizlik Növbəsinin Müəyyən Edilməsi haqqında Arayış', tag: 'Növbə',
  signOrg: 'Ümumi İstifadə Sahələri üzrə Qarşılıqlı Komissiya',
  toLabel: 'Növbəni icra edən', fromLabel: 'Cədvəli təsdiq edən',
  preamble: 'Verilir {to} adlı şəxsə ondan ötrü ki, pilləkən sahəsinin təmizlik növbəsi {from} ilə birgə müəyyən edilmiş, cədvəl bütün sakinlərə çatdırılmış və girişdəki elan lövhəsində yerləşdirilmişdir.',
  powers: 'Növbə həftəlik olaraq dəyişdirilir.\nCədvəl girişdə elan lövhəsində saxlanılır.\nNövbə dəyişikliyi əvvəlcədən razılaşdırılır.\nÜmumi vəsait ay ərzində toplanır.',
  penalty: 'Növbənin ardıcıl iki dəfə buraxılması halında həmin mənzilin növbəsi ikiqat müddətə təyin edilir.',
  titleOptions: [
    'Pilləkən Sahəsinin Təmizlik Növbəsinin Müəyyən Edilməsi haqqında Arayış',
    'Ümumi Sahələrin Təmizlənməsi Cədvəli haqqında Rəsmi Arayış',
    'Növbənin Mərtəbələr üzrə Bölüşdürülməsi haqqında Arayış',
    'Təmizlik Öhdəliyinin İcra Vəziyyəti haqqında Arayış'
  ],
  powersOptions: [
    'Növbə həftəlik olaraq dəyişdirilir.',
    'Cədvəl girişdə elan lövhəsində saxlanılır.',
    'Növbə dəyişikliyi əvvəlcədən razılaşdırılır.',
    'Ümumi vəsait ay ərzində toplanır.',
    'Yaşlı sakinlər üçün güzəşt tətbiq olunur.',
    'Bayram ərəfəsində əlavə təmizlik aparılır.',
    'Lift kabinəsi ayrıca cədvəldədir.',
    'Zibil qutusu hər gün yoxlanılır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Növbənin ardıcıl iki dəfə buraxılması halında həmin mənzilin növbəsi ikiqat müddətə təyin edilir.',
    'Arayış hər mərtəbə üçün ayrıca tərtib edilir.',
    'Cədvəl hər ay yenidən bölüşdürülür.'
  ]
},
{
  id: 'drill-license', cat: 'neighbors', tone: 'zarafat', layout: 'lisenziya', palette: 'burgundy',
  title: 'Təmir Alətlərindən İstifadə Vaxtının Müəyyən Edilməsinə dair Lisenziya', tag: 'Təmir',
  signOrg: 'Səs-Küy və Gecə Rejimi üzrə Nəzarət İdarəsi',
  powersLabel: 'LİSENZİYANIN ƏHATƏ ETDİYİ SAATLAR',
  preamble: '{from} tərəfindən {to} adlı şəxsə təmir alətlərindən istifadə üçün lisenziya verilir. Lisenziya yalnız müəyyən edilmiş saatlarda qüvvədədir və qonşulara əvvəlcədən xəbər verilməsini şərt kimi nəzərdə tutur.',
  powers: 'İşlər saat 10:00 ilə 18:00 arasında aparılır.\nQonşulara bir gün əvvəl xəbər verilir.\nFasiləsiz iş müddəti iki saatı keçmir.\nHəftəsonu səsli işlər dayandırılır.',
  penalty: 'Lisenziyanın şərtləri pozulduqda icazə növbəti həftə üçün dayandırılır və işlərin davamına yalnız ümumi razılıqla icazə verilir.',
  titleOptions: [
    'Təmir Alətlərindən İstifadə Vaxtının Müəyyən Edilməsinə dair Lisenziya',
    'Perforator İşlərinin Aparılma Rejiminə dair Xüsusi İcazə',
    'Divar İşlərinin Vaxt Hüdudlarına dair Müddətli Lisenziya',
    'Səsli Təmir İşlərinə dair Məhdud İcazə'
  ],
  powersOptions: [
    'İşlər saat 10:00 ilə 18:00 arasında aparılır.',
    'Qonşulara bir gün əvvəl xəbər verilir.',
    'Fasiləsiz iş müddəti iki saatı keçmir.',
    'Həftəsonu səsli işlər dayandırılır.',
    'Nahar saatında iş dayandırılır.',
    'Ümumi sahələrdə tullantı saxlanılmır.',
    'İşin ümumi müddəti əvvəlcədən bildirilir.',
    'Bayram günlərində iş aparılmır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Lisenziyanın şərtləri pozulduqda icazə növbəti həftə üçün dayandırılır və işlərin davamına yalnız ümumi razılıqla icazə verilir.',
    'Lisenziya təmir müddəti ilə məhdudlaşır.',
    'Təcili nasazlıqlar lisenziyadan kənardır.'
  ]
},
{
  id: 'yard-court-decision', cat: 'neighbors', tone: 'zarafat', layout: 'qerar', palette: 'ink',
  title: 'Həyətdə Yaranmış Mübahisə üzrə Sakinlərin Qəbul Etdiyi Qərar', tag: 'Həyət',
  signOrg: 'Həyət və Qonşuluq Mübahisələri üzrə Ali Şura',
  preamble: 'Şura {to} və {from} arasında yaranmış mübahisəyə hər iki tərəfin izahatını dinləməklə baxmış və müəyyən etmişdir ki, məsələ qarşılıqlı güzəşt yolu ilə həll edilə bilər. Yekun qərar qəbul edilmişdir.',
  powers: 'Mübahisə predmeti üzrə güzəşt qarşılıqlıdır.\nHər iki tərəf qismən haqlı hesab edilir.\nÜmumi sahə növbə ilə istifadə olunur.\nBarışıq bir həftə ərzində rəsmiləşdirilir.',
  penalty: 'Eyni mübahisənin təkrarlanması halında məsələ sakinlərin ümumi yığıncağına çıxarılır və qərar səsvermə yolu ilə qəbul edilir.',
  titleOptions: [
    'Həyətdə Yaranmış Mübahisə üzrə Sakinlərin Qəbul Etdiyi Qərar',
    'Qonşuluq Münasibətlərində Gərginliyin Həlli haqqında Qərar',
    'Ümumi Sahələrdən İstifadə Mübahisəsi üzrə Yekun Qətnamə',
    'Sakinlərin Yığıncağının Qəbul Etdiyi Yekun Qərar'
  ],
  powersOptions: [
    'Mübahisə predmeti üzrə güzəşt qarşılıqlıdır.',
    'Hər iki tərəf qismən haqlı hesab edilir.',
    'Ümumi sahə növbə ilə istifadə olunur.',
    'Barışıq bir həftə ərzində rəsmiləşdirilir.',
    'Şahid ifadələri protokola əlavə edilir.',
    'Üçüncü sakinlər müzakirəyə cəlb edilmir.',
    'Zərər dəyibsə birgə bərpa olunur.',
    'Nəticə elan lövhəsində yerləşdirilir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Eyni mübahisənin təkrarlanması halında məsələ sakinlərin ümumi yığıncağına çıxarılır və qərar səsvermə yolu ilə qəbul edilir.',
    'Qərardan narazılıq qeydə alınır, lakin icraya təsir etmir.',
    'Barışıq şərtləri pozulduqda məsələyə yenidən baxılır.'
  ]
},
{
  id: 'best-neighbor-diploma', cat: 'neighbors', tone: 'zarafat', layout: 'diplom', palette: 'gold',
  title: 'Qonşuluq Münasibətlərində Nümunəvi Davranışa Görə Fəxri Diplom', tag: 'Fəxri ad',
  signOrg: 'Həyət və Qonşuluq Mübahisələri üzrə Ali Şura',
  preamble: 'Şura {to} adlı şəxsin qonşuluq münasibətlərində uzun müddət ərzində göstərdiyi davranışı qiymətləndirərək təltif haqqında qərar qəbul etmişdir. Diplom {from} tərəfindən sakinlərin yekdil rəyi ilə təqdim olunur.',
  powers: 'Səs həddi heç vaxt pozulmayıb.\nÜmumi sahələr təmiz saxlanılıb.\nKömək xahiş edilmədən göstərilib.\nMübahisələr sakit həll edilib.',
  penalty: 'Diplom geri alınmır. Təltif olunan şəxs bina yığıncağında birinci söz hüququnu qazanır.',
  titleOptions: [
    'Qonşuluq Münasibətlərində Nümunəvi Davranışa Görə Fəxri Diplom',
    'Ümumi Sahələrin Qorunmasına Verilən Töhfəyə Görə Diplom',
    'Çətin Anlarda Göstərilən Köməyə Görə Verilmiş Fəxri Diplom',
    'Bina Nizamının Qorunmasına Görə Verilmiş Fəxri Nişan'
  ],
  powersOptions: [
    'Səs həddi heç vaxt pozulmayıb.',
    'Ümumi sahələr təmiz saxlanılıb.',
    'Kömək xahiş edilmədən göstərilib.',
    'Mübahisələr sakit həll edilib.',
    'Açar etibar edilə bilən şəxs kimi tanınıb.',
    'Bayramlarda qonşular unudulmayıb.',
    'Yaşlı sakinlərə diqqət göstərilib.',
    'Ümumi vəsait vaxtında ödənilib.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Diplom geri alınmır. Təltif olunan şəxs bina yığıncağında birinci söz hüququnu qazanır.',
    'Təltif hər il yenidən qiymətləndirilir.',
    'Diplom binanın elan lövhəsində yerləşdirilir.'
  ]
},
{
  id: 'balcony-treaty', cat: 'neighbors', tone: 'zarafat', layout: 'muqavile', palette: 'steel',
  title: 'Balkon Sahələrinin İstifadə Sərhədlərinin Müəyyən Edilməsi üzrə Müqavilə', tag: 'Balkon',
  signOrg: 'Ümumi İstifadə Sahələri üzrə Qarşılıqlı Komissiya',
  preamble: 'Tərəflərin mövqeyi nəzərə alınmaqla, {from} və {to} arasında balkon sahələrinin istifadə sərhədləri barədə razılıq əldə edilmişdir. Müqavilə hər iki mənzilə bərabər şəkildə şamil olunur.',
  powers: 'Paltar suyu aşağı mərtəbəyə damcılamır.\nSiqaret tüstüsü pəncərəyə yönəldilmir.\nAğır əşyalar məhəccəngdən asılmır.\nBalkondan heç nə atılmır.',
  penalty: 'Müqavilənin şərtləri pozulduqda zərər dəymiş tərəfin tələbi ilə vəziyyət üç gün ərzində bərpa edilir.',
  titleOptions: [
    'Balkon Sahələrinin İstifadə Sərhədlərinin Müəyyən Edilməsi üzrə Müqavilə',
    'Paltar Qurutma və Siqaret Çəkmə Qaydaları üzrə Saziş',
    'Balkondan Yuxarı Mərtəbəyə Təsirin Tənzimlənməsi üzrə Protokol',
    'Balkon Sahələrinin Qarşılıqlı İstifadəsi üzrə Müqavilə'
  ],
  powersOptions: [
    'Paltar suyu aşağı mərtəbəyə damcılamır.',
    'Siqaret tüstüsü pəncərəyə yönəldilmir.',
    'Ağır əşyalar məhəccəngdən asılmır.',
    'Balkondan heç nə atılmır.',
    'Gül qablarının yeri təhlükəsiz seçilir.',
    'Səs həddi gecə saatlarında azaldılır.',
    'Təmir işi əvvəlcədən bildirilir.',
    'Ümumi görünüş nəzərə alınır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Müqavilənin şərtləri pozulduqda zərər dəymiş tərəfin tələbi ilə vəziyyət üç gün ərzində bərpa edilir.',
    'Müqavilə mənzillərin sahibləri dəyişdikdə yenilənir.',
    'Şərtlər hər iki tərəfə eyni qaydada tətbiq olunur.'
  ]
},
{
  id: 'playground-rules', cat: 'neighbors', tone: 'zarafat', layout: 'sertifikat', palette: 'forest',
  title: 'Uşaq Meydançasından İstifadə Qaydalarının Təsdiqi Sertifikatı', tag: 'Meydança',
  signOrg: 'Həyət və Qonşuluq Mübahisələri üzrə Ali Şura',
  powersLabel: 'MEYDANÇADAN İSTİFADƏ ŞƏRTLƏRİ',
  preamble: 'Bununla təsdiq edilir ki, {to} adlı şəxs uşaq meydançasından istifadə qaydalarına əməl edir. Sertifikat {from} tərəfindən, sakinlərin müraciəti və uzunmüddətli müşahidə əsasında verilmişdir.',
  powers: 'Meydançadan istifadə saat 21:00-dək davam edir.\nAvadanlıq təyinatı üzrə istifadə olunur.\nUşaqlar nəzarətsiz buraxılmır.\nZibil ardınca yığılır.',
  penalty: 'Avadanlığın zədələnməsi halında bərpa xərcləri zədəni törədən tərəfin hesabına təmin edilir.',
  titleOptions: [
    'Uşaq Meydançasından İstifadə Qaydalarının Təsdiqi Sertifikatı',
    'Meydança Avadanlığının Qorunması Öhdəliyinin Sertifikatı',
    'Uşaqların Təhlükəsizliyinin Təmin Edilməsi Sertifikatı',
    'Meydançadan İstifadə Saatlarının Təsdiqinə dair Şəhadətnamə'
  ],
  powersOptions: [
    'Meydançadan istifadə saat 21:00-dək davam edir.',
    'Avadanlıq təyinatı üzrə istifadə olunur.',
    'Uşaqlar nəzarətsiz buraxılmır.',
    'Zibil ardınca yığılır.',
    'Böyük yaşlı uşaqlar kiçiklərə güzəşt edir.',
    'Velosiped meydança daxilində sürülmür.',
    'Nasazlıq barədə dərhal xəbər verilir.',
    'Ev heyvanları meydançaya buraxılmır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Avadanlığın zədələnməsi halında bərpa xərcləri zədəni törədən tərəfin hesabına təmin edilir.',
    'Sertifikat bütün bina sakinlərinə şamil edilir.',
    'Qaydalar hər mövsüm yenidən elan olunur.'
  ]
},
{
  id: 'neighbor-telegram', cat: 'neighbors', tone: 'zarafat', layout: 'teleqram', palette: 'burgundy',
  title: 'Qonşu Mənzildən Gecə Saatlarında Gələn Səs Barədə Təcili Xəbərdarlıq', tag: 'Xəbərdarlıq',
  signOrg: 'Səs-Küy və Gecə Rejimi üzrə Nəzarət İdarəsi',
  preamble: 'Sizə bildiririk ki, {to} adlı şəxsin mənzilindən gələn səs gecə saatlarında qeydə alınmış və digər sakinlər tərəfindən də təsdiqlənmişdir. {from} tərəfindən vəziyyətin aydınlaşdırılması və tədbir görülməsi xahiş olunur.',
  powers: 'Səs saat 01:00-dan sonra qeydə alınıb.\nHal son həftədə üçüncü dəfə təkrarlanıb.\nŞifahi müraciət nəticə verməyib.\nDigər sakinlər də vəziyyəti təsdiqləyir.',
  penalty: 'Xəbərdarlığa reaksiya verilmədikdə məsələ bina sakinlərinin ümumi yığıncağının gündəliyinə salınır.',
  titleOptions: [
    'Qonşu Mənzildən Gecə Saatlarında Gələn Səs Barədə Təcili Xəbərdarlıq',
    'Gecə Saatlarında Qeydə Alınmış Səs Barədə Təcili Teleqram',
    'Su Sızması Ehtimalı Barədə Təxirəsalınmaz Xəbərdarlıq',
    'Ümumi Sahədə Aşkarlanmış Vəziyyət Barədə Təcili Teleqram'
  ],
  powersOptions: [
    'Səs saat 01:00-dan sonra qeydə alınıb.',
    'Hal son həftədə üçüncü dəfə təkrarlanıb.',
    'Şifahi müraciət nəticə verməyib.',
    'Digər sakinlər də vəziyyəti təsdiqləyir.',
    'Səsin mənbəyi dəqiqləşdirilməyib.',
    'Təmir işi ehtimalı istisna edilmir.',
    'Şikayət yazılı formada təqdim edilib.',
    'Növbəti addım yığıncaqda müzakirə olunacaq.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Xəbərdarlığa reaksiya verilmədikdə məsələ bina sakinlərinin ümumi yığıncağının gündəliyinə salınır.',
    'Vəziyyət düzəldildikdə xəbərdarlıq arxivə verilir.',
    'Xəbərdarlıq yalnız məlumat xarakteri daşıyır.'
  ]
},
{
  id: 'resident-id', cat: 'neighbors', tone: 'zarafat', layout: 'vesiqe', palette: 'ink',
  title: 'Bina Sakininin Hüquq və Öhdəliklərini Təsdiq edən Vəsiqə', tag: 'Sakin',
  signOrg: 'Ümumi İstifadə Sahələri üzrə Qarşılıqlı Komissiya',
  fromLabel: 'Vəsiqəni verən',
  preamble: 'Bu vəsiqə {to} adlı şəxsin bina sakini statusunu təsdiq edir. Sənəd {from} tərəfindən verilmişdir və ümumi sahələrdən istifadə hüququ ilə birlikdə müvafiq öhdəlikləri də əhatə edir.',
  powers: 'Ümumi sahələrdən istifadə hüququ tanınır.\nYığıncaqda səs hüququ verilir.\nPark yeri növbəsində iştirak edilir.\nÜmumi vəsait ay ərzində ödənilir.',
  penalty: 'Vəsiqə ilə tanınan hüquqlar ümumi öhdəliklərin icrası ilə bağlıdır; ödənişlər gecikdikdə yığıncaqda səs hüququ müvəqqəti dayandırılır.',
  titleOptions: [
    'Bina Sakininin Hüquq və Öhdəliklərini Təsdiq edən Vəsiqə',
    'Ümumi Sahələrdən İstifadə Hüququnu Təsdiq edən Vəsiqə',
    'Sakinlərin Yığıncağında Səs Hüququna dair Şəhadətnamə',
    'Həyət və Park Yeri Hüquqlarını Təsdiq edən Vəsiqə'
  ],
  powersOptions: [
    'Ümumi sahələrdən istifadə hüququ tanınır.',
    'Yığıncaqda səs hüququ verilir.',
    'Park yeri növbəsində iştirak edilir.',
    'Ümumi vəsait ay ərzində ödənilir.',
    'Elan lövhəsindən istifadə açıqdır.',
    'Təmizlik növbəsində iştirak öhdəlikdir.',
    'Qonaqların davranışına görə məsuliyyət daşınır.',
    'Nasazlıq barədə məlumat vermək tələb olunur.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Vəsiqə ilə tanınan hüquqlar ümumi öhdəliklərin icrası ilə bağlıdır; ödənişlər gecikdikdə yığıncaqda səs hüququ müvəqqəti dayandırılır.',
    'Vəsiqə mənzil sahibi dəyişdikdə yenidən verilir.',
    'Hüquqlar ailənin bütün üzvlərinə şamil olunur.'
  ]
},
{
  id: 'salt-borrow-act', cat: 'neighbors', tone: 'zarafat', layout: 'ekspertiza', palette: 'burgundy',
  title: 'Qonşudan Ərzaq Borc Alma Praktikasının Qiymətləndirilməsi haqqında Rəy', tag: 'Qonşuluq',
  signOrg: 'Həyət və Qonşuluq Mübahisələri üzrə Ali Şura',
  preamble: 'Məsələyə dair aparılmış qiymətləndirmə nəticəsində müəyyən edilmişdir ki, {to} və {from} arasında ərzaq mübadiləsi qarşılıqlı və balanslıdır. Rəy son bir ilin müşahidələrinə əsaslanır.',
  powers: 'Mübadilə hər iki istiqamətdə aparılıb.\nƏn çox borc alınan məhsul duzdur.\nQaytarılma adətən eyni gün baş verib.\nHeç bir tərəfdən şikayət daxil olmayıb.',
  penalty: 'Balans bir tərəfin xeyrinə davamlı pozulduqda vəziyyət qarşılıqlı söhbət yolu ilə bərpa edilir.',
  titleOptions: [
    'Qonşudan Ərzaq Borc Alma Praktikasının Qiymətləndirilməsi haqqında Rəy',
    'Qarşılıqlı Ərzaq Mübadiləsinin Balansı haqqında Ekspert Rəyi',
    'Borc Alınmış Məhsulların Qaytarılma Vəziyyəti haqqında Rəy',
    'Qonşuluq Yardımının Həcminə dair Yekun Rəy'
  ],
  powersOptions: [
    'Mübadilə hər iki istiqamətdə aparılıb.',
    'Ən çox borc alınan məhsul duzdur.',
    'Qaytarılma adətən eyni gün baş verib.',
    'Heç bir tərəfdən şikayət daxil olmayıb.',
    'Bayram ərəfəsində həcm artır.',
    'Qablar həmişə təmiz qaytarılıb.',
    'Miqdar dəqiq ölçülməyib.',
    'Praktika qonşuluğu möhkəmləndirən amildir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Balans bir tərəfin xeyrinə davamlı pozulduqda vəziyyət qarşılıqlı söhbət yolu ilə bərpa edilir.',
    'Rəy yalnız məlumat xarakteri daşıyır.',
    'Göstəricilər hər il yenidən qiymətləndirilir.'
  ]
},
{
  id: 'wifi-sharing-permit', cat: 'neighbors', tone: 'zarafat', layout: 'viza', palette: 'steel',
  title: 'Qonşu Mənzilə İnternet Bağlantısının Paylaşılmasına dair İcazə', tag: 'İnternet',
  signOrg: 'Ümumi İstifadə Sahələri üzrə Qarşılıqlı Komissiya',
  toLabel: 'İcazə verilən şəxs', fromLabel: 'Şəbəkə sahibi',
  preamble: '{from} tərəfindən {to} adlı şəxsə internet bağlantısının paylaşılmasına icazə verilir. İcazə ödənişin bölüşdürülməsi və sürətin hər iki tərəf üçün kifayət qədər qalması şərti ilə qüvvədədir.',
  powers: 'Şifrə üçüncü şəxsə verilmir.\nÖdəniş bərabər bölüşdürülür.\nAğır yükləmələr gecə saatlarına keçirilir.\nNasazlıq barədə dərhal xəbər verilir.',
  penalty: 'Şifrənin üçüncü şəxsə ötürüldüyü aşkarlandıqda icazə dərhal qüvvədən düşür və bağlantı yenidən paylaşılmır.',
  titleOptions: [
    'Qonşu Mənzilə İnternet Bağlantısının Paylaşılmasına dair İcazə',
    'Şəbəkə Şifrəsinin Müvəqqəti Verilməsinə dair Xüsusi İcazə',
    'Bağlantının Birgə İstifadəsi Şərtlərinə dair İcazə',
    'Ödənişin Bölüşdürülməsi Şərti ilə Verilmiş İcazə'
  ],
  powersOptions: [
    'Şifrə üçüncü şəxsə verilmir.',
    'Ödəniş bərabər bölüşdürülür.',
    'Ağır yükləmələr gecə saatlarına keçirilir.',
    'Nasazlıq barədə dərhal xəbər verilir.',
    'Cihazların sayı razılaşdırılır.',
    'Şifrə hər üç ayda bir dəyişdirilir.',
    'Sürət azaldıqda vəziyyət birgə yoxlanılır.',
    'Bağlantının kəsilməsi əvvəlcədən bildirilir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Şifrənin üçüncü şəxsə ötürüldüyü aşkarlandıqda icazə dərhal qüvvədən düşür və bağlantı yenidən paylaşılmır.',
    'İcazə ödəniş vaxtında edildiyi müddətdə qüvvədədir.',
    'Sürətin kritik azalması icazəni dayandırır.'
  ]
},

/* ---------------- BAYRAM, TOY & AD GÜNÜ ---------------- */
{
  id: 'novruz-sweet-quota', cat: 'holiday', tone: 'zarafat', layout: 'blank', palette: 'gold',
  title: 'Bayram Şirniyyatının Bölüşdürülməsi Qaydası haqqında Bildiriş', tag: 'Novruz',
  signOrg: 'Bayram Süfrəsi və Qonaq Qəbulu üzrə Ali Şura',
  preamble: 'Daxil olmuş müraciətə baxılaraq bildirilir ki, bayram şirniyyatının bölüşdürülməsi qaydası müəyyən edilmişdir. {from} tərəfindən {to} adlı şəxsə şəxsi kvota ayrılmış və ehtiyatın bayrama qədər qorunması şərti qoyulmuşdur.',
  powers: 'Gündəlik kvota üç ədəd müəyyən edilir.\nQonaq üçün ayrılmış hissəyə toxunulmur.\nBayramdan əvvəl dadmaq bir dəfə icazəlidir.\nBoş qab dərhal xəbər verilir.',
  penalty: 'Kvotanın gizli şəkildə aşılması aşkarlandıqda növbəti bayram üçün şirniyyat hazırlığında iştirak öhdəliyi tam olaraq həmin şəxsin üzərinə düşür.',
  titleOptions: [
    'Bayram Şirniyyatının Bölüşdürülməsi Qaydası haqqında Bildiriş',
    'Şəkərbura və Paxlavanın Şəxsi Kvotası haqqında Rəsmi Bildiriş',
    'Bayram Ehtiyatının Qorunması Tədbirləri haqqında Bildiriş',
    'Şirniyyat Ehtiyatının Bayramadək Saxlanılması haqqında Bildiriş'
  ],
  powersOptions: [
    'Gündəlik kvota üç ədəd müəyyən edilir.',
    'Qonaq üçün ayrılmış hissəyə toxunulmur.',
    'Bayramdan əvvəl dadmaq bir dəfə icazəlidir.',
    'Boş qab dərhal xəbər verilir.',
    'Qonşuya göndərilən pay ayrıca hesablanır.',
    'Ən yaxşı nüsxələr qonaq üçün saxlanılır.',
    'Gecə saatlarında müraciət qeydə alınır.',
    'Hazırlıqda iştirak edən əlavə pay alır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Kvotanın gizli şəkildə aşılması aşkarlandıqda növbəti bayram üçün şirniyyat hazırlığında iştirak öhdəliyi tam olaraq həmin şəxsin üzərinə düşür.',
    'Bildiriş yalnız bayram ərəfəsində qüvvədədir.',
    'Qonaq gəldikdə kvota müvəqqəti dayandırılır.'
  ]
},
{
  id: 'wedding-table-contract', cat: 'holiday', tone: 'zarafat', layout: 'muqavile', palette: 'burgundy',
  title: 'Toy Masasında Yerlərin və Öhdəliklərin Bölüşdürülməsi üzrə Müqavilə', tag: 'Toy masası',
  signOrg: 'Toy Davranışlarına Nəzarət üzrə Baş İdarə',
  preamble: 'Tərəflərin mövqeyi nəzərə alınmaqla, {from} və {to} arasında toy masasında yerlərin bölüşdürülməsi və süfrə öhdəlikləri barədə razılıq əldə edilmişdir. Müqavilə yalnız bir mərasim üçün bağlanır.',
  powers: 'Masa nömrəsi mərasimdən əvvəl bildirilir.\nQohum və dost qrupları ayrı masalarda oturur.\nSüfrənin doldurulmasına növbə ilə nəzarət edilir.\nBoş yerlər gec gələn qonaqlara verilir.',
  penalty: 'Masa nizamının icazəsiz dəyişdirilməsi halında növbəti mərasimdə yer seçimi hüququ tam olaraq digər tərəfə keçir.',
  titleOptions: [
    'Toy Masasında Yerlərin və Öhdəliklərin Bölüşdürülməsi üzrə Müqavilə',
    'Mərasim Zamanı Masa Nizamının Təmin Edilməsi üzrə Saziş',
    'Qonaqların Yerləşdirilməsi Qaydası üzrə Qarşılıqlı Müqavilə',
    'Toy Süfrəsinin İdarə Edilməsi Qaydası üzrə Protokol'
  ],
  powersOptions: [
    'Masa nömrəsi mərasimdən əvvəl bildirilir.',
    'Qohum və dost qrupları ayrı masalarda oturur.',
    'Süfrənin doldurulmasına növbə ilə nəzarət edilir.',
    'Boş yerlər gec gələn qonaqlara verilir.',
    'Uşaqlı ailələr çıxışa yaxın yerləşdirilir.',
    'Səhnəyə yaxın masalar əvvəlcədən təyin edilir.',
    'Foto çəkilişi növbə ilə təşkil olunur.',
    'Şirniyyat bölgüsü masa daxilində aparılır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Masa nizamının icazəsiz dəyişdirilməsi halında növbəti mərasimdə yer seçimi hüququ tam olaraq digər tərəfə keçir.',
    'Müqavilə mərasim başa çatdıqda qüvvədən düşür.',
    'Fövqəladə hallarda nizam təşkilatçılar tərəfindən dəyişdirilir.'
  ]
},
{
  id: 'gift-obligation', cat: 'holiday', tone: 'zarafat', layout: 'notarial', palette: 'gold',
  title: 'Bayram Hədiyyəsi üzrə Qarşılıqlı Öhdəliklərin Təsbiti haqqında Akt', tag: 'Hədiyyə',
  signOrg: 'Hədiyyə və Təbrik Öhdəlikləri üzrə Komissiya',
  preamble: 'İş üzrə toplanmış məlumatlara əsasən {from} və {to} arasında bayram hədiyyəsi üzrə qarşılıqlı öhdəliklər müəyyən edilmişdir. Akt hədiyyənin dəyərini deyil, verilmə faktını əsas götürür.',
  powers: 'Hədiyyə büdcəsi əvvəlcədən razılaşdırılır.\nAlınan hədiyyə başqasına ötürülmür.\nÇek hədiyyə ilə birlikdə verilmir.\nBəyənilmədikdə bu barədə susulur.',
  penalty: 'Alınmış hədiyyənin üçüncü şəxsə ötürüldüyü aşkarlandıqda növbəti bayramda hədiyyə seçimi tam olaraq zərərçəkmiş tərəfə həvalə edilir.',
  titleOptions: [
    'Bayram Hədiyyəsi üzrə Qarşılıqlı Öhdəliklərin Təsbiti haqqında Akt',
    'Hədiyyə Büdcəsinin Razılaşdırılması haqqında Rəsmi Akt',
    'Təkrar Hədiyyənin Ötürülməsi Praktikasına dair Akt',
    'Hədiyyə Seçimində Qarşılıqlı Məsləhətləşmə haqqında Etibarnamə'
  ],
  powersOptions: [
    'Hədiyyə büdcəsi əvvəlcədən razılaşdırılır.',
    'Alınan hədiyyə başqasına ötürülmür.',
    'Çek hədiyyə ilə birlikdə verilmir.',
    'Bəyənilmədikdə bu barədə susulur.',
    'Hədiyyə siyahısı bir həftə əvvəl bildirilir.',
    'Təkrarlanan hədiyyə dəyişdirilə bilər.',
    'Pul hədiyyəsi ayrıca razılaşdırılır.',
    'Uşaqlara hədiyyə ayrıca planlaşdırılır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Alınmış hədiyyənin üçüncü şəxsə ötürüldüyü aşkarlandıqda növbəti bayramda hədiyyə seçimi tam olaraq zərərçəkmiş tərəfə həvalə edilir.',
    'Akt hər bayram üçün yenidən razılaşdırılır.',
    'Büdcənin aşılması öhdəlik yaratmır.'
  ]
},
{
  id: 'birthday-decree', cat: 'holiday', tone: 'zarafat', layout: 'viza', palette: 'burgundy',
  title: 'Ad Günü Sahibinə Verilən Xüsusi Səlahiyyətlərə dair İcazə', tag: 'Ad günü',
  signOrg: 'Hədiyyə və Təbrik Öhdəlikləri üzrə Komissiya',
  preamble: '{from} tərəfindən {to} adlı şəxsə ad günü münasibətilə xüsusi səlahiyyətlər verilir. İcazə yalnız həmin gün ərzində qüvvədədir, gecə yarısında avtomatik olaraq qüvvədən düşür və istifadə edilməmiş güzəştlər saxlanılmır.',
  powers: 'Günün proqramı tam olaraq özü tərəfindən müəyyən edilir.\nMenyu seçimi mübahisə predmeti deyil.\nQab-qacaq yumaq öhdəliyindən azad edilir.\nMusiqi seçimi hüququ tanınır.',
  penalty: 'İcazə yalnız bir gün ərzində qüvvədədir və növbəti günə keçirilmir; istifadə edilməmiş güzəştlər saxlanılmır.',
  titleOptions: [
    'Ad Günü Sahibinə Verilən Xüsusi Səlahiyyətlərə dair İcazə',
    'Ad Günü Boyu Qərar Qəbulu Səlahiyyətinə dair Xüsusi İcazə',
    'Doğum Günü Sahibinin Güzəştlərindən İstifadəyə dair İcazə',
    'Bir Gün Ərzində Bütün Seçimləri Etmək Hüququna dair İcazə'
  ],
  powersOptions: [
    'Günün proqramı tam olaraq özü tərəfindən müəyyən edilir.',
    'Menyu seçimi mübahisə predmeti deyil.',
    'Qab-qacaq yumaq öhdəliyindən azad edilir.',
    'Musiqi seçimi hüququ tanınır.',
    'Hədiyyə açılış ardıcıllığı özü tərəfindən seçilir.',
    'Foto çəkilişindən imtina hüququ verilir.',
    'Səhər gec oyanmaq icazəlidir.',
    'Bir dəfə hər hansı tapşırığı başqasına ötürmək olar.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'İcazə yalnız bir gün ərzində qüvvədədir və növbəti günə keçirilmir; istifadə edilməmiş güzəştlər saxlanılmır.',
    'İcazə iş və dərs öhdəliklərinə şamil edilmir.',
    'Güzəştlər başqa şəxsə ötürülə bilməz.'
  ]
},
{
  id: 'dance-license', cat: 'holiday', tone: 'zarafat', layout: 'lisenziya', palette: 'gold',
  title: 'Toy Mərasimi Zamanı Rəqs Fəaliyyətindən Azad Edilməyə dair İcazə', tag: 'Toy mövsümü',
  signOrg: 'Toy Davranışlarına Nəzarət üzrə Baş İdarə',
  powersLabel: 'LİSENZİYANIN ƏHATƏ ETDİYİ RƏQSLƏR',
  preamble: '{from} tərəfindən {to} adlı şəxsə toy mərasimi zamanı rəqs fəaliyyətindən azad olmaq icazəsi verilir. Şəxsin hazırkı vəziyyəti və qohumlar tərəfindən gözlənilən sosial təzyiq nəzərə alınmışdır.',
  powers: 'Rəqs meydançasına çıxmaq öhdəliyi aradan qaldırılır.\n«Bir dənə oyna da» müraciəti icazəyə təsir etmir.\nAilə rəqsində iştirak ayrıca razılaşdırılır.\nAlqışla müşayiət etmək kifayət hesab edilir.',
  penalty: 'İcazə bəy və gəlinin birbaşa dəvətinə şamil edilmir; həmin halda ən azı bir rəqsdə iştirak nəzakət qaydası hesab olunur.',
  titleOptions: [
    'Toy Mərasimi Zamanı Rəqs Fəaliyyətindən Azad Edilməyə dair İcazə',
    'Məcburi Rəqsdən Müvəqqəti Azad Edilməyə dair Xüsusi İcazə',
    'Mərasim Zamanı Rəqsdə İştirak Hüdudlarına dair Lisenziya',
    'Rəqs Meydançasına Çıxma Öhdəliyindən Azad Edilməyə dair İcazə'
  ],
  powersOptions: [
    'Rəqs meydançasına çıxmaq öhdəliyi aradan qaldırılır.',
    '«Bir dənə oyna da» müraciəti icazəyə təsir etmir.',
    'Ailə rəqsində iştirak ayrıca razılaşdırılır.',
    'Alqışla müşayiət etmək kifayət hesab edilir.',
    'Fotoya düşmək üçün meydançaya qısa çıxış icazəlidir.',
    'Yaxın qohumun xahişi bir dəfə nəzərə alınır.',
    'Musiqinin növü icazəyə təsir göstərmir.',
    'Masadan qalxmadan iştirak forma sayılır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'İcazə bəy və gəlinin birbaşa dəvətinə şamil edilmir; həmin halda ən azı bir rəqsdə iştirak nəzakət qaydası hesab olunur.',
    'İcazə yalnız bir mərasim üçün verilir.',
    'Könüllü iştirak icazənin qüvvəsinə təsir etmir.'
  ]
},
{
  id: 'guest-list-arayis', cat: 'holiday', tone: 'zarafat', layout: 'arayis', palette: 'steel',
  title: 'Tədbirin Qonaq Siyahısının Tərtibi və Təsdiqi haqqında Arayış', tag: 'Siyahı',
  signOrg: 'Bayram Süfrəsi və Qonaq Qəbulu üzrə Ali Şura',
  toLabel: 'Siyahıya daxil edilən', fromLabel: 'Siyahını tərtib edən',
  preamble: 'Verilir {to} adlı şəxsə ondan ötrü ki, tədbirin qonaq siyahısı {from} ilə birgə tərtib edilmiş, hər iki tərəfin təklifləri nəzərə alınmış, yekun say razılaşdırılmış və dəvətnamələrin göndərilmə tarixi müəyyən edilmişdir.',
  powers: 'Siyahı tədbirdən iki həftə əvvəl bağlanır.\nƏlavə ad qarşılıqlı razılıqla salınır.\nHər tərəfə bərabər sayda yer ayrılır.\nDəvətnamələr eyni gün göndərilir.',
  penalty: 'Siyahı bağlandıqdan sonra əlavə ad salınması halında həmin qonağın yeri və xərci onu təklif edən tərəfin hesabına təmin edilir.',
  titleOptions: [
    'Tədbirin Qonaq Siyahısının Tərtibi və Təsdiqi haqqında Arayış',
    'Dəvətnamələrin Paylanması Vəziyyəti haqqında Rəsmi Arayış',
    'Siyahıya Əlavə Ad Salınması Qaydası haqqında Arayış',
    'Qonaq Sayının Yekunlaşdırılması haqqında Arayış'
  ],
  powersOptions: [
    'Siyahı tədbirdən iki həftə əvvəl bağlanır.',
    'Əlavə ad qarşılıqlı razılıqla salınır.',
    'Hər tərəfə bərabər sayda yer ayrılır.',
    'Dəvətnamələr eyni gün göndərilir.',
    'İştirak təsdiqi bir həftə əvvəl toplanır.',
    'Uşaqlı ailələr ayrıca qeyd edilir.',
    'Gözlənilməz qonaq üçün ehtiyat yer saxlanılır.',
    'Ləğv barədə məlumat dərhal ötürülür.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Siyahı bağlandıqdan sonra əlavə ad salınması halında həmin qonağın yeri və xərci onu təklif edən tərəfin hesabına təmin edilir.',
    'Arayış yalnız bir tədbirə şamil edilir.',
    'Say dəyişikliyi məkanla ayrıca razılaşdırılır.'
  ]
},
{
  id: 'toastmaster-diploma', cat: 'holiday', tone: 'zarafat', layout: 'diplom', palette: 'burgundy',
  title: 'Mərasimin Aparılması Sahəsində Göstərilmiş Nəticələrə Görə Fəxri Diplom', tag: 'Tamada',
  signOrg: 'Toy Davranışlarına Nəzarət üzrə Baş İdarə',
  preamble: 'Baş İdarə {to} adlı şəxsin mərasim aparıcısı kimi göstərdiyi nəticələri qiymətləndirərək təltif haqqında qərar qəbul etmişdir. Diplom {from} tərəfindən təqdim olunur və qonaqların yekdil rəyi ilə təsdiqlənir.',
  powers: 'Sözlər qısa və yerində deyilib.\nHeç bir qonaq unudulmayıb.\nMikrofon vaxtında təhvil verilib.\nProqram cədvəldən kənara çıxmayıb.',
  penalty: 'Diplom geri alınmır. Təltif olunan şəxs növbəti mərasimə dəvət edildikdə imtina hüququnu saxlayır.',
  titleOptions: [
    'Mərasimin Aparılması Sahəsində Göstərilmiş Nəticələrə Görə Fəxri Diplom',
    'Süfrə Arxasında Söz Deməyi Bacarmağa Görə Fəxri Diplom',
    'Tədbirin Nizamlı Keçirilməsinə Verilən Töhfəyə Görə Diplom',
    'Qonaqların Əhval-ruhiyyəsinin Qorunmasına Görə Fəxri Nişan'
  ],
  powersOptions: [
    'Sözlər qısa və yerində deyilib.',
    'Heç bir qonaq unudulmayıb.',
    'Mikrofon vaxtında təhvil verilib.',
    'Proqram cədvəldən kənara çıxmayıb.',
    'Adlar düzgün tələffüz edilib.',
    'Musiqi ilə uyğunlaşma təmin edilib.',
    'Uşaqlar üçün ayrıca vaxt ayrılıb.',
    'Gözlənilməz hallar sakit həll edilib.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Diplom geri alınmır. Təltif olunan şəxs növbəti mərasimə dəvət edildikdə imtina hüququnu saxlayır.',
    'Təltif hər mərasimdən sonra yenidən qiymətləndirilir.',
    'Diplom ailə arxivində saxlanılır.'
  ]
},
{
  id: 'holiday-court', cat: 'holiday', tone: 'zarafat', layout: 'qerar', palette: 'ink',
  title: 'Bayram Süfrəsində Yaranmış Mübahisə üzrə Qəbul Edilmiş Qərar', tag: 'Süfrə',
  signOrg: 'Bayram Süfrəsi və Qonaq Qəbulu üzrə Ali Şura',
  preamble: 'Şura bayram süfrəsində {to} və {from} arasında yaranmış müzakirəyə baxaraq müəyyən etmişdir ki, mövzu bayram gününə uyğun deyil və hər iki tərəfin mövqeyi qismən əsaslıdır. Məsələ üzrə yekun qərar qəbul edilmişdir.',
  powers: 'Müzakirə bayram günü dayandırılır.\nMövzuya bayramdan sonra qayıdıla bilər.\nHər iki tərəf qismən haqlı hesab edilir.\nSüfrə arxasında səs tonu aşağı salınır.',
  penalty: 'Mövzunun həmin gün yenidən qaldırılması halında müzakirəni başlayan tərəf süfrənin yığılmasını təkbaşına həyata keçirir.',
  titleOptions: [
    'Bayram Süfrəsində Yaranmış Mübahisə üzrə Qəbul Edilmiş Qərar',
    'Süfrə Arxasındakı Müzakirənin Dayandırılması haqqında Qərar',
    'Bayram Günü Qaldırılan Mövzu üzrə Yekun Qətnamə',
    'Süfrə Nizamının Bərpası haqqında Təxirəsalınmaz Qərar'
  ],
  powersOptions: [
    'Müzakirə bayram günü dayandırılır.',
    'Mövzuya bayramdan sonra qayıdıla bilər.',
    'Hər iki tərəf qismən haqlı hesab edilir.',
    'Süfrə arxasında səs tonu aşağı salınır.',
    'Uşaqların iştirak etdiyi mövzular seçilmir.',
    'Siyasət və maaş mövzuları gündəlikdən çıxarılır.',
    'Üçüncü şəxslər müzakirəyə cəlb edilmir.',
    'Barışıq çay süfrəsində rəsmiləşdirilir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Mövzunun həmin gün yenidən qaldırılması halında müzakirəni başlayan tərəf süfrənin yığılmasını təkbaşına həyata keçirir.',
    'Qərar yalnız bayram günü üçün qüvvədədir.',
    'Etiraz qeydə alınır, lakin bayram günü baxılmır.'
  ]
},
{
  id: 'congrats-telegram', cat: 'holiday', tone: 'zarafat', layout: 'teleqram', palette: 'gold',
  title: 'Əlamətdar Gün Münasibətilə Ünvanlanmış Rəsmi Təbrik Teleqramı', tag: 'Təbrik',
  signOrg: 'Hədiyyə və Təbrik Öhdəlikləri üzrə Komissiya',
  preamble: 'Sizə bildiririk ki, {to} adlı şəxsin əlamətdar günü {from} tərəfindən qeydə alınmış və rəsmi qaydada təbrik edilməsi qərara alınmışdır. Təbrik səmimidir və heç bir qarşılıq gözləmir.',
  powers: 'Təbrik vaxtında və birinci sırada çatdırılır.\nArzular səmimi və konkretdir.\nHədiyyə ayrıca təqdim ediləcək.\nGecikmiş təbriklər də qəbul edilir.',
  penalty: 'Təbrik heç bir öhdəlik yaratmır. Yeganə gözlənti növbəti əlamətdar gündə eyni diqqətin göstərilməsidir.',
  titleOptions: [
    'Əlamətdar Gün Münasibətilə Ünvanlanmış Rəsmi Təbrik Teleqramı',
    'Bayram Münasibətilə Göndərilmiş Rəsmi Təbrik Teleqramı',
    'Əlamətdar Hadisə ilə Bağlı Təbrik Bildirişi',
    'Uğur Münasibətilə Ünvanlanmış Təcili Təbrik Teleqramı'
  ],
  powersOptions: [
    'Təbrik vaxtında və birinci sırada çatdırılır.',
    'Arzular səmimi və konkretdir.',
    'Hədiyyə ayrıca təqdim ediləcək.',
    'Gecikmiş təbriklər də qəbul edilir.',
    'Təbrik şəxsən təkrarlanacaq.',
    'Zəng günün ilk saatlarında edilir.',
    'Qohumlar ayrıca xəbərdar edilir.',
    'Fotoşəkil xatirə üçün saxlanılır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Təbrik heç bir öhdəlik yaratmır. Yeganə gözlənti növbəti əlamətdar gündə eyni diqqətin göstərilməsidir.',
    'Teleqram yalnız bir tarixə aiddir.',
    'Təbrikin gecikməsi onun səmimiliyinə təsir etmir.'
  ]
},
{
  id: 'guest-id', cat: 'holiday', tone: 'zarafat', layout: 'vesiqe', palette: 'burgundy',
  title: 'Fəxri Qonaq Statusunu və Onunla Bağlı Hüquqları Təsdiq edən Vəsiqə', tag: 'Qonaq',
  signOrg: 'Bayram Süfrəsi və Qonaq Qəbulu üzrə Ali Şura',
  fromLabel: 'Vəsiqəni verən',
  preamble: 'Bu vəsiqə {to} adlı şəxsin fəxri qonaq statusunu təsdiq edir. Sənəd {from} tərəfindən verilmişdir və evin bütün tədbirlərində, xəbərdarlıq edilmədən gəlinən hallar da daxil olmaqla qüvvədədir.',
  powers: 'Süfrədə yer həmişə ayrılmış vəziyyətdə saxlanılır.\nDəvətnamə tələb olunmur.\nSevimli yemək menyuya daxil edilir.\nAyrılma vaxtı özü tərəfindən müəyyən edilir.',
  penalty: 'Vəsiqə ilə verilən hüquqlar qarşılıqlıdır; ev sahibi də eyni statusla qonağın evində qəbul edilir.',
  titleOptions: [
    'Fəxri Qonaq Statusunu və Onunla Bağlı Hüquqları Təsdiq edən Vəsiqə',
    'Süfrədə Xüsusi Yer Hüququnu Təsdiq edən Fəxri Vəsiqə',
    'Daimi Dəvətli Qonaq Statusuna dair Şəhadətnamə',
    'Ev Sahibinin Xüsusi Diqqətinə Layiq Qonaq Vəsiqəsi'
  ],
  powersOptions: [
    'Süfrədə yer həmişə ayrılmış vəziyyətdə saxlanılır.',
    'Dəvətnamə tələb olunmur.',
    'Sevimli yemək menyuya daxil edilir.',
    'Ayrılma vaxtı özü tərəfindən müəyyən edilir.',
    'Gecələmə variantı əvvəlcədən hazırlanır.',
    'Uşaqları ilə birlikdə gəlmək icazəlidir.',
    'Şirniyyatdan pay ayrılır.',
    'Bayram günü birinci sırada təbrik edilir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Vəsiqə ilə verilən hüquqlar qarşılıqlıdır; ev sahibi də eyni statusla qonağın evində qəbul edilir.',
    'Vəsiqə müddətsizdir və geri alınmır.',
    'Status ailənin bütün üzvlərinə şamil olunur.'
  ]
},
{
  id: 'photo-duty-certificate', cat: 'holiday', tone: 'zarafat', layout: 'sertifikat', palette: 'forest',
  title: 'Bayram Tədbirində Foto Çəkiliş Öhdəliyinin İcrasına dair Sertifikat', tag: 'Foto',
  signOrg: 'Hədiyyə və Təbrik Öhdəlikləri üzrə Komissiya',
  powersLabel: 'SƏLAHİYYƏTİN HÜDUDLARI',
  preamble: 'Bununla təsdiq edilir ki, {to} adlı şəxs tədbirdə foto çəkiliş öhdəliyini üzərinə götürmüşdür. Sertifikat {from} tərəfindən, əvvəlki tədbirlərdəki nəticələr əsas götürülərək verilir.',
  powers: 'Ümumi şəkil tədbirin ortasında çəkilir.\nHər qonaqdan ən azı bir kadr alınır.\nUğursuz kadrlar paylaşılmır.\nŞəkillər üç gün ərzində göndərilir.',
  penalty: 'Şəkillərin razılaşdırılmış müddətdə göndərilməməsi halında növbəti tədbirdə foto öhdəliyi başqa şəxsə həvalə edilir.',
  titleOptions: [
    'Bayram Tədbirində Foto Çəkiliş Öhdəliyinin İcrasına dair Sertifikat',
    'Ümumi Şəklin Təşkili Səlahiyyətini Təsdiq edən Sertifikat',
    'Tədbirin Fotoqrafı Statusuna dair Şəhadətnamə',
    'Şəkillərin Paylaşılması Qaydasını Təsdiq edən Sertifikat'
  ],
  powersOptions: [
    'Ümumi şəkil tədbirin ortasında çəkilir.',
    'Hər qonaqdan ən azı bir kadr alınır.',
    'Uğursuz kadrlar paylaşılmır.',
    'Şəkillər üç gün ərzində göndərilir.',
    'Uşaqların şəkilləri ayrıca toplanır.',
    'Ailə qrupları növbə ilə çəkilir.',
    'Video materiala da eyni qayda şamil edilir.',
    'Arxiv nüsxə saxlanılır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Şəkillərin razılaşdırılmış müddətdə göndərilməməsi halında növbəti tədbirdə foto öhdəliyi başqa şəxsə həvalə edilir.',
    'Sertifikat hər tədbir üçün ayrıca verilir.',
    'Razılıqsız paylaşım sertifikatı qüvvədən salır.'
  ]
},
{
  id: 'leftovers-treaty', cat: 'holiday', tone: 'zarafat', layout: 'ekspertiza', palette: 'forest',
  title: 'Bayram Süfrəsindən Qalan Yeməklərin Bölgüsü haqqında Rəy', tag: 'Qalıq',
  signOrg: 'Bayram Süfrəsi və Qonaq Qəbulu üzrə Ali Şura',
  preamble: 'Məsələyə dair aparılmış qiymətləndirmə nəticəsində müəyyən edilmişdir ki, {to} və {from} arasında süfrə qalıqlarının bölgüsü üzrə mövqelər əsasən üst-üstə düşür. Rəy növbəti üç günün menyusunu da nəzərə alır.',
  powers: 'Qalıqlar üç gün ərzində istifadə edilir.\nQonaqlara pay ayrılması üstünlük təşkil edir.\nŞirniyyat ayrıca saxlanılır.\nMenyu təkrarı qaçılmaz hesab edilir.',
  penalty: 'Rəyin nəticələri hər bayramdan sonra yenidən qiymətləndirilir; qalıqların həcmi artdıqda menyu planı əvvəlcədən düzəldilir.',
  titleOptions: [
    'Bayram Süfrəsindən Qalan Yeməklərin Bölgüsü haqqında Rəy',
    'Süfrə Qalıqlarının Saxlanma Müddətinə dair Ekspert Rəyi',
    'Qonaqlara Verilən Payın Həcminə dair Yekun Rəy',
    'Bayramdan Sonrakı Menyu Planlaşdırmasına dair Rəy'
  ],
  powersOptions: [
    'Qalıqlar üç gün ərzində istifadə edilir.',
    'Qonaqlara pay ayrılması üstünlük təşkil edir.',
    'Şirniyyat ayrıca saxlanılır.',
    'Menyu təkrarı qaçılmaz hesab edilir.',
    'Dondurulacaq hissə əvvəlcədən ayrılır.',
    'Ən sevimli yemək bərabər bölünür.',
    'Qab-qacaq eyni gün yuyulur.',
    'Qonşuya göndərilən pay ənənə sayılır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Rəyin nəticələri hər bayramdan sonra yenidən qiymətləndirilir; qalıqların həcmi artdıqda menyu planı əvvəlcədən düzəldilir.',
    'Rəy yalnız bir bayram dövrünə aiddir.',
    'Qalıqların israfı ayrıca qeydə alınır.'
  ]
},

/* ---------------- SƏYAHƏT / YOL ---------------- */
{
  id: 'suitcase-quota', cat: 'travel', tone: 'zarafat', layout: 'blank', palette: 'steel',
  title: 'Səfər Zamanı Baqaj Çəkisinin Bölüşdürülməsi haqqında Bildiriş', tag: 'Çamadan',
  signOrg: 'Baqaj və Yol Ehtiyatları üzrə Komissiya',
  preamble: 'Daxil olmuş müraciətə baxılaraq bildirilir ki, səfər zamanı baqaj çəkisinin bölüşdürülməsi qaydası müəyyən edilmişdir. {from} və {to} arasında ortaq çamadanda yer bölgüsü də razılaşdırılmışdır.',
  powers: 'Ortaq çamadanda yer bərabər bölünür.\nƏlavə çəki haqqını onu yaradan tərəf ödəyir.\nSuvenirlər üçün beş kiloqram ehtiyat saxlanılır.\nAyaqqabı sayı üç cütlə məhdudlaşır.',
  penalty: 'Çəki həddinin aşılması halında əlavə haqq həmin əşyaların sahibi tərəfindən ödənilir və ümumi büdcədən çıxılmır.',
  titleOptions: [
    'Səfər Zamanı Baqaj Çəkisinin Bölüşdürülməsi haqqında Bildiriş',
    'Ortaq Çamadanda Yer Bölgüsü haqqında Rəsmi Bildiriş',
    'Əlavə Baqaj Haqqının Ödənilməsi Qaydası haqqında Bildiriş',
    'Suvenir və Hədiyyə üçün Ayrılan Yer haqqında Bildiriş'
  ],
  powersOptions: [
    'Ortaq çamadanda yer bərabər bölünür.',
    'Əlavə çəki haqqını onu yaradan tərəf ödəyir.',
    'Suvenirlər üçün beş kiloqram ehtiyat saxlanılır.',
    'Ayaqqabı sayı üç cütlə məhdudlaşır.',
    'Dərman və sənədlər əl yükündə saxlanılır.',
    'Qayıdışda çəki yenidən yoxlanılır.',
    '«Bəlkə lazım oldu» əşyalar siyahıdan çıxarılır.',
    'Yığım səfərdən bir gün əvvəl tamamlanır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Çəki həddinin aşılması halında əlavə haqq həmin əşyaların sahibi tərəfindən ödənilir və ümumi büdcədən çıxılmır.',
    'Bildiriş yalnız bir səfərə şamil edilir.',
    'Qayıdış baqajı ayrıca razılaşdırılır.'
  ]
},
{
  id: 'navigator-authority', cat: 'travel', tone: 'zarafat', layout: 'notarial', palette: 'steel',
  title: 'Səfər Zamanı Marşrutun Müəyyən Edilməsi Səlahiyyətinə dair Akt', tag: 'Yol',
  signOrg: 'Yol Hərəkəti və Marşrut Nizamı üzrə Baş İdarə',
  powersLabel: 'NAVİQATORUN SƏLAHİYYƏTLƏRİ',
  preamble: 'İş üzrə toplanmış məlumatlara əsasən {from} tərəfindən {to} adlı şəxsə səfər marşrutunu müəyyən etmək səlahiyyəti verilir. Səlahiyyət dayanacaqların planlaşdırılmasını da əhatə edir.',
  powers: 'Marşrut səfərdən əvvəl razılaşdırılır.\nDəyişiklik sürücü ilə birgə qərara alınır.\nDayanacaqlar hər iki saatdan bir planlaşdırılır.\nAlternativ yol yalnız real üstünlük olduqda seçilir.',
  penalty: 'Marşrutun səbəbsiz uzadılması halında növbəti səfərdə naviqasiya səlahiyyəti tam olaraq digər tərəfə keçir.',
  titleOptions: [
    'Səfər Zamanı Marşrutun Müəyyən Edilməsi Səlahiyyətinə dair Akt',
    'Naviqasiya Cihazına Nəzarət Səlahiyyətinin Verilməsinə dair Akt',
    'Yol Boyu Dayanacaqların Planlaşdırılmasına dair Etibarnamə',
    'Marşrut Dəyişikliyi Qaydasının Müəyyən Edilməsinə dair Akt'
  ],
  powersOptions: [
    'Marşrut səfərdən əvvəl razılaşdırılır.',
    'Dəyişiklik sürücü ilə birgə qərara alınır.',
    'Dayanacaqlar hər iki saatdan bir planlaşdırılır.',
    'Alternativ yol yalnız real üstünlük olduqda seçilir.',
    'Yanacaq dayanacağı əvvəlcədən müəyyən edilir.',
    'Yemək fasiləsi marşruta daxil edilir.',
    'Gecə sürüşü ayrıca razılaşdırılır.',
    'Gəlmə vaxtı təxmini bildirilir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Marşrutun səbəbsiz uzadılması halında növbəti səfərdə naviqasiya səlahiyyəti tam olaraq digər tərəfə keçir.',
    'Akt yalnız bir səfərə şamil edilir.',
    'Yol qapanmaları səlahiyyətə təsir göstərmir.'
  ]
},
{
  id: 'driving-shift-contract', cat: 'travel', tone: 'zarafat', layout: 'muqavile', palette: 'ink',
  title: 'Uzun Yolda Sürücülük Növbəsinin Bölüşdürülməsi üzrə Müqavilə', tag: 'Sükan',
  signOrg: 'Yol Hərəkəti və Marşrut Nizamı üzrə Baş İdarə',
  preamble: 'Tərəflərin mövqeyi nəzərə alınmaqla, {from} və {to} arasında uzun yolda sürücülük növbəsi, dincəlmə fasilələri və yanacaq xərclərinin bölgüsü barədə razılıq əldə edilmişdir. Müqavilə səfər başa çatanadək qüvvədədir.',
  powers: 'Növbə hər iki saatdan bir dəyişdirilir.\nSükan arxasında olan şəxsə məsləhət verilmir.\nYanacaq xərci bərabər bölünür.\nYorğunluq bildirildikdə növbə dərhal dəyişdirilir.',
  penalty: 'Növbədən imtina halında həmin tərəf növbəti səfərin yanacaq xərcinin tam ödənilməsi öhdəliyini daşıyır.',
  titleOptions: [
    'Uzun Yolda Sürücülük Növbəsinin Bölüşdürülməsi üzrə Müqavilə',
    'Sükan Arxasında Növbəliliyin Müəyyən Edilməsi üzrə Saziş',
    'Sürücülərin Dincəlmə Rejimi üzrə Qarşılıqlı Müqavilə',
    'Yanacaq və Yol Xərclərinin Bölgüsü üzrə Protokol'
  ],
  powersOptions: [
    'Növbə hər iki saatdan bir dəyişdirilir.',
    'Sükan arxasında olan şəxsə məsləhət verilmir.',
    'Yanacaq xərci bərabər bölünür.',
    'Yorğunluq bildirildikdə növbə dərhal dəyişdirilir.',
    'Gecə saatlarında növbə qısaldılır.',
    'Musiqi seçimi sürücünün səlahiyyətindədir.',
    'Cərimə onu yaradan tərəf tərəfindən ödənilir.',
    'Avtomobilin vəziyyəti səfərdən əvvəl yoxlanılır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Növbədən imtina halında həmin tərəf növbəti səfərin yanacaq xərcinin tam ödənilməsi öhdəliyini daşıyır.',
    'Müqavilə hər səfər üçün yenidən bağlanır.',
    'Sağlamlıq halları növbədən azad edir.'
  ]
},
{
  id: 'playlist-license', cat: 'travel', tone: 'zarafat', layout: 'lisenziya', palette: 'gold',
  title: 'Yol Boyu Musiqi Seçimi Səlahiyyətinin Verilməsinə dair Lisenziya', tag: 'Musiqi',
  signOrg: 'Səyahət Yoldaşları Arasında Mübahisələr üzrə Şura',
  powersLabel: 'LİSENZİYANIN ƏHATƏ ETDİYİ JANRLAR',
  preamble: '{from} tərəfindən {to} adlı şəxsə yol boyu musiqi seçimi səlahiyyəti verilir. Lisenziya digər sərnişinlərin rahatlığını nəzərə almağı və növbəliliyə əməl etməyi şərt kimi nəzərdə tutur.',
  powers: 'Musiqi növbəsi hər saatdan bir dəyişdirilir.\nMahnı yarımçıq kəsilmir.\nSəs həddi danışığa mane olmur.\nSürücünün etirazı dərhal nəzərə alınır.',
  penalty: 'Eyni mahnının üç dəfədən artıq təkrarlanması halında musiqi seçimi səlahiyyəti növbəti sərnişinə keçir.',
  titleOptions: [
    'Yol Boyu Musiqi Seçimi Səlahiyyətinin Verilməsinə dair Lisenziya',
    'Səsgücləndiricidən İstifadə Növbəsinə dair Xüsusi İcazə',
    'Musiqi Siyahısının Tərtibi Hüququna dair Müddətli Lisenziya',
    'Mahnının Dəyişdirilməsi Qaydasına dair Məhdud İcazə'
  ],
  powersOptions: [
    'Musiqi növbəsi hər saatdan bir dəyişdirilir.',
    'Mahnı yarımçıq kəsilmir.',
    'Səs həddi danışığa mane olmur.',
    'Sürücünün etirazı dərhal nəzərə alınır.',
    'Gecə saatlarında sakit musiqi seçilir.',
    'Təkrarlanan mahnı siyahıdan çıxarılır.',
    'Hər sərnişin ən azı bir mahnı təklif edir.',
    'Səssizlik rejimi də seçim variantıdır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Eyni mahnının üç dəfədən artıq təkrarlanması halında musiqi seçimi səlahiyyəti növbəti sərnişinə keçir.',
    'Lisenziya yalnız bir səfərə şamil edilir.',
    'Sürücünün diqqətinə mane olan seçim dayandırılır.'
  ]
},
{
  id: 'hotel-choice-arayis', cat: 'travel', tone: 'zarafat', layout: 'arayis', palette: 'forest',
  title: 'Yaşayış Yerinin Seçilməsi Prosesinin Nəticələri haqqında Arayış', tag: 'Otel',
  signOrg: 'Səyahət Yoldaşları Arasında Mübahisələr üzrə Şura',
  toLabel: 'Seçimi edən tərəf', fromLabel: 'Razılıq verən tərəf',
  preamble: 'Verilir {to} adlı şəxsə ondan ötrü ki, səfər üçün yaşayış yerinin seçilməsi prosesi {from} ilə birgə aparılmış, variantlar müqayisə edilmiş və yekun qərar qarşılıqlı razılıqla qəbul olunmuşdur.',
  powers: 'Ən azı beş variant müqayisə edilib.\nBüdcə həddi əvvəlcədən müəyyən edilib.\nRəylərin sayı və tarixi nəzərə alınıb.\nMərkəzə yaxınlıq üstünlük sayılıb.',
  penalty: 'Seçilmiş variant gözləntiləri doğrultmadıqda məsuliyyət hər iki tərəf arasında bərabər bölüşdürülür.',
  titleOptions: [
    'Yaşayış Yerinin Seçilməsi Prosesinin Nəticələri haqqında Arayış',
    'Otel Variantlarının Müqayisəsinin Nəticəsi haqqında Arayış',
    'Büdcə və Yerləşmə Şərtlərinin Uzlaşdırılması haqqında Arayış',
    'Rəylərin Nəzərə Alınması Qaydası haqqında Rəsmi Arayış'
  ],
  powersOptions: [
    'Ən azı beş variant müqayisə edilib.',
    'Büdcə həddi əvvəlcədən müəyyən edilib.',
    'Rəylərin sayı və tarixi nəzərə alınıb.',
    'Mərkəzə yaxınlıq üstünlük sayılıb.',
    'Səhər yeməyinin daxil olması yoxlanılıb.',
    'Ləğv şərtləri diqqətlə oxunub.',
    'Şəkillərlə real vəziyyət müqayisə ediləcək.',
    'Ehtiyat variant saxlanılıb.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Seçilmiş variant gözləntiləri doğrultmadıqda məsuliyyət hər iki tərəf arasında bərabər bölüşdürülür.',
    'Arayış yalnız bir səfərə şamil edilir.',
    'Ləğv halında xərclər ümumi büdcədən ödənilir.'
  ]
},
{
  id: 'delay-decision', cat: 'travel', tone: 'zarafat', layout: 'qerar', palette: 'burgundy',
  title: 'Səfərin Başlanmasının Gecikdirilməsi Halı üzrə Qəbul Edilmiş Qərar', tag: 'Gecikmə',
  signOrg: 'Yol Hərəkəti və Marşrut Nizamı üzrə Baş İdarə',
  preamble: 'Şura {to} adlı şəxsin səfərin başlanmasını gecikdirməsi halına baxaraq müəyyən etmişdir ki, göstərilən səbəblərin bir hissəsi obyektivdir. {from} tərəfindən verilmiş müraciət qismən təmin edilir.',
  powers: 'Gecikmə müddəti qırx dəqiqə qeydə alınıb.\nSəbəblərin bir hissəsi obyektiv sayılır.\nYeni yola çıxma vaxtı müəyyən edilir.\nMarşrut buna uyğun düzəldilir.',
  penalty: 'Gecikmənin təkrarlanması halında növbəti səfərdə yola çıxma vaxtı bir saat tez elan edilir.',
  titleOptions: [
    'Səfərin Başlanmasının Gecikdirilməsi Halı üzrə Qəbul Edilmiş Qərar',
    'Yola Çıxma Vaxtının Pozulması üzrə Yekun Qətnamə',
    'Gecikmənin Səbəblərinin Qiymətləndirilməsi haqqında Qərar',
    'Yeni Yola Çıxma Vaxtının Müəyyən Edilməsi haqqında Qərar'
  ],
  powersOptions: [
    'Gecikmə müddəti qırx dəqiqə qeydə alınıb.',
    'Səbəblərin bir hissəsi obyektiv sayılır.',
    'Yeni yola çıxma vaxtı müəyyən edilir.',
    'Marşrut buna uyğun düzəldilir.',
    'Baqajın yığılması gecikmənin əsas səbəbidir.',
    'Xəbərdarlıq vaxtında edilməyib.',
    'Növbəti səfərdə yığım bir gün əvvəl tamamlanır.',
    'Qalan iştirakçıların vaxtı nəzərə alınır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Gecikmənin təkrarlanması halında növbəti səfərdə yola çıxma vaxtı bir saat tez elan edilir.',
    'Qərardan narazılıq qeydə alınır, lakin icraya təsir etmir.',
    'Obyektiv səbəblər sənədlə təsdiqlənməlidir.'
  ]
},
{
  id: 'best-traveler-diploma', cat: 'travel', tone: 'zarafat', layout: 'diplom', palette: 'gold',
  title: 'Səyahət Yoldaşı kimi Göstərilmiş Nəticələrə Görə Fəxri Diplom', tag: 'Fəxri ad',
  signOrg: 'Səyahət Yoldaşları Arasında Mübahisələr üzrə Şura',
  preamble: 'Şura {to} adlı şəxsin səyahət yoldaşı kimi göstərdiyi davranışı qiymətləndirərək təltif haqqında qərar qəbul etmişdir. Diplom {from} tərəfindən, səfər iştirakçılarının yekdil rəyi ilə təqdim olunur.',
  powers: 'Heç vaxt gecikməyib.\nBaqaj çəkisi həddi aşmayıb.\nXərclər vaxtında bölüşdürülüb.\nGözlənilməz hallarda sakitlik saxlanılıb.',
  penalty: 'Diplom geri alınmır. Təltif olunan şəxs növbəti səfərdə pəncərə yerini birinci seçmək hüququ qazanır.',
  titleOptions: [
    'Səyahət Yoldaşı kimi Göstərilmiş Nəticələrə Görə Fəxri Diplom',
    'Yol Boyu Nümunəvi Davranışa Görə Verilmiş Fəxri Diplom',
    'Gözlənilməz Halların Sakit Həllinə Görə Fəxri Diplom',
    'Səfərin Nizamlı Keçməsinə Verilən Töhfəyə Görə Fəxri Nişan'
  ],
  powersOptions: [
    'Heç vaxt gecikməyib.',
    'Baqaj çəkisi həddi aşmayıb.',
    'Xərclər vaxtında bölüşdürülüb.',
    'Gözlənilməz hallarda sakitlik saxlanılıb.',
    'Yol ərzağı bölüşülüb.',
    'Şəkil çəkmə xahişləri rədd edilməyib.',
    'Marşrut dəyişikliyinə etiraz olmayıb.',
    'Sənədlər həmişə əldə saxlanılıb.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Diplom geri alınmır. Təltif olunan şəxs növbəti səfərdə pəncərə yerini birinci seçmək hüququ qazanır.',
    'Təltif hər səfərdən sonra yenidən qiymətləndirilir.',
    'Diplom səfər albomunda saxlanılır.'
  ]
},
{
  id: 'photo-stop-certificate', cat: 'travel', tone: 'zarafat', layout: 'sertifikat', palette: 'steel',
  title: 'Yol Boyu Foto Dayanacaqlarının Sayı və Müddətinə dair Sertifikat', tag: 'Foto',
  signOrg: 'Səyahət Yoldaşları Arasında Mübahisələr üzrə Şura',
  powersLabel: 'DAYANACAQ ŞƏRTLƏRİ',
  preamble: 'Bununla təsdiq edilir ki, {to} adlı şəxs yol boyu foto dayanacaqlarının sayı və müddəti barədə şərtlərə əməl edir. Sertifikat {from} tərəfindən, əvvəlki səfərlərin təcrübəsi əsas götürülərək verilir.',
  powers: 'Foto dayanacağı hər saatda bir dəfə olur.\nDayanma müddəti on dəqiqəni keçmir.\nHər iştirakçıdan ən azı bir kadr alınır.\nSürücü də şəkildə iştirak edir.',
  penalty: 'Dayanacaqların sayı razılaşdırılmış həddi aşdıqda foto fasilələri səfərin qalan hissəsi üçün dayandırılır.',
  titleOptions: [
    'Yol Boyu Foto Dayanacaqlarının Sayı və Müddətinə dair Sertifikat',
    'Mənzərəli Yerlərdə Dayanma Hüququnu Təsdiq edən Sertifikat',
    'Foto Çəkiliş Fasilələrinin Razılaşdırılmasına dair Sertifikat',
    'Səfər Şəkillərinin Paylaşılması Qaydasına dair Şəhadətnamə'
  ],
  powersOptions: [
    'Foto dayanacağı hər saatda bir dəfə olur.',
    'Dayanma müddəti on dəqiqəni keçmir.',
    'Hər iştirakçıdan ən azı bir kadr alınır.',
    'Sürücü də şəkildə iştirak edir.',
    'Təhlükəli yerlərdə dayanma aparılmır.',
    'Uğursuz kadrlar paylaşılmır.',
    'Şəkillər səfərdən sonra bölüşülür.',
    'Video çəkiliş ayrıca razılaşdırılır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Dayanacaqların sayı razılaşdırılmış həddi aşdıqda foto fasilələri səfərin qalan hissəsi üçün dayandırılır.',
    'Sertifikat yalnız bir səfərə şamil edilir.',
    'Mənzərəli yerlər əvvəlcədən siyahıya salınır.'
  ]
},
{
  id: 'arrival-telegram', cat: 'travel', tone: 'zarafat', layout: 'teleqram', palette: 'forest',
  title: 'Təyinat Məntəqəsinə Çatma Faktı haqqında Təcili Teleqram', tag: 'Çatma',
  signOrg: 'Yol Hərəkəti və Marşrut Nizamı üzrə Baş İdarə',
  preamble: 'Sizə bildiririk ki, {to} adlı şəxs təyinat məntəqəsinə sağ-salamat çatmış, baqaj tam şəkildə əldə edilmiş və yerləşmə problemsiz həyata keçirilmişdir. {from} tərəfindən narahatlığa əsas olmadığı bildirilir.',
  powers: 'Yol nəzərdə tutulan müddətdə başa çatıb.\nBaqaj tam şəkildə əldədir.\nYerləşmə problemsiz həyata keçirilib.\nƏlaqə vasitəsi işlək vəziyyətdədir.',
  penalty: 'Bu teleqram göndərildikdən sonra saatbaşı zəng gözləntisi əsassız hesab edilir; növbəti əlaqə razılaşdırılmış qrafik üzrə həyata keçirilir.',
  titleOptions: [
    'Təyinat Məntəqəsinə Çatma Faktı haqqında Təcili Teleqram',
    'Sağ-Salamat Çatma Barədə Ailəyə Ünvanlanmış Teleqram',
    'Yolun Başa Çatması haqqında Təxirəsalınmaz Bildiriş',
    'Gəlmə Vaxtının Təsdiqi haqqında Təcili Xəbərdarlıq'
  ],
  powersOptions: [
    'Yol nəzərdə tutulan müddətdə başa çatıb.',
    'Baqaj tam şəkildə əldədir.',
    'Yerləşmə problemsiz həyata keçirilib.',
    'Əlaqə vasitəsi işlək vəziyyətdədir.',
    'Hava şəraiti əlverişlidir.',
    'Şəkillər axşam göndəriləcək.',
    'Növbəti əlaqə sabah nəzərdə tutulur.',
    'Qayıdış tarixi dəyişməyib.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Bu teleqram göndərildikdən sonra saatbaşı zəng gözləntisi əsassız hesab edilir; növbəti əlaqə razılaşdırılmış qrafik üzrə həyata keçirilir.',
    'Teleqram yalnız məlumat xarakteri daşıyır və öhdəlik yaratmır.',
    'Əlaqə qrafiki tərəflər arasında ayrıca razılaşdırılır.'
  ]
},
{
  id: 'traveler-id', cat: 'travel', tone: 'zarafat', layout: 'vesiqe', palette: 'steel',
  title: 'Səyahət Yoldaşı Statusunu və Öhdəliklərini Təsdiq edən Vəsiqə', tag: 'Yoldaş',
  signOrg: 'Səyahət Yoldaşları Arasında Mübahisələr üzrə Şura',
  fromLabel: 'Vəsiqəni verən',
  preamble: 'Bu vəsiqə {to} adlı şəxsin səyahət qrupuna üzvlüyünü təsdiq edir. Sənəd {from} tərəfindən verilmişdir və ortaq büdcədə iştirak hüququ ilə birlikdə müvafiq öhdəlikləri də əhatə edir.',
  powers: 'Marşrut müzakirəsində səs hüququ tanınır.\nOrtaq büdcəyə pay vaxtında ödənilir.\nBir dayanacaq təklif etmək hüququ verilir.\nSənədlər şəxsən saxlanılır.',
  penalty: 'Vəsiqə ilə tanınan hüquqlar ortaq büdcə öhdəliklərinin icrası ilə bağlıdır; ödəniş gecikdikdə səs hüququ müvəqqəti dayandırılır.',
  titleOptions: [
    'Səyahət Yoldaşı Statusunu və Öhdəliklərini Təsdiq edən Vəsiqə',
    'Səfər İştirakçısının Hüquqlarını Təsdiq edən Vəsiqə',
    'Ortaq Büdcədə İştirak Hüququna dair Şəhadətnamə',
    'Səfər Qrupuna Üzvlüyü Təsdiq edən Vəsiqə'
  ],
  powersOptions: [
    'Marşrut müzakirəsində səs hüququ tanınır.',
    'Ortaq büdcəyə pay vaxtında ödənilir.',
    'Bir dayanacaq təklif etmək hüququ verilir.',
    'Sənədlər şəxsən saxlanılır.',
    'Yemək yerinin seçimində iştirak edilir.',
    'Pəncərə yeri növbə ilə tutulur.',
    'Fövqəladə hallarda qrup bir yerdə qalır.',
    'Ayrılma barədə əvvəlcədən xəbər verilir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Vəsiqə ilə tanınan hüquqlar ortaq büdcə öhdəliklərinin icrası ilə bağlıdır; ödəniş gecikdikdə səs hüququ müvəqqəti dayandırılır.',
    'Vəsiqə hər səfər üçün yenidən verilir.',
    'Qrupdan ayrılma vəsiqəni qüvvədən salır.'
  ]
},
{
  id: 'snack-authority', cat: 'travel', tone: 'zarafat', layout: 'viza', palette: 'burgundy',
  title: 'Yol Ərzağının Hazırlanması və Paylanması Qaydasına dair İcazə', tag: 'Ərzaq',
  signOrg: 'Baqaj və Yol Ehtiyatları üzrə Komissiya',
  powersLabel: 'ƏRZAQ ÜZRƏ SƏLAHİYYƏTLƏR',
  preamble: '{from} tərəfindən {to} adlı şəxsə yol ərzağının hazırlanması, saxlanması və paylanması səlahiyyəti verilir. İcazə ehtiyatın səfərin sonuna qədər çatması və payın bütün iştirakçılara bərabər verilməsi şərti ilə qüvvədədir.',
  powers: 'Ehtiyat yola çıxdıqdan bir saat sonra açılır.\nPay bütün iştirakçılara bərabər verilir.\nSürücünün payı ayrıca saxlanılır.\nZibil torbada toplanır.',
  penalty: 'Ehtiyatın yolun yarısına qədər tükənməsi halında əlavə alış xərcləri onu istifadə edən tərəflər arasında bölüşdürülür.',
  titleOptions: [
    'Yol Ərzağının Hazırlanması və Paylanması Qaydasına dair İcazə',
    'Ehtiyatın Açılma Vaxtının Müəyyən Edilməsinə dair Xüsusi İcazə',
    'Yol Ərzağının Bölüşdürülməsi Qaydasına dair Məhdud İcazə',
    'Ərzaq Ehtiyatına Nəzarət Səlahiyyətinin Verilməsinə dair İcazə'
  ],
  powersOptions: [
    'Ehtiyat yola çıxdıqdan bir saat sonra açılır.',
    'Pay bütün iştirakçılara bərabər verilir.',
    'Sürücünün payı ayrıca saxlanılır.',
    'Zibil torbada toplanır.',
    'Su ehtiyatı ayrıca hesablanır.',
    'İsti içki termosda saxlanılır.',
    'Ehtiyatın qalığı qayıdışa saxlanılır.',
    'Xüsusi pəhriz əvvəlcədən nəzərə alınır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Ehtiyatın yolun yarısına qədər tükənməsi halında əlavə alış xərcləri onu istifadə edən tərəflər arasında bölüşdürülür.',
    'İcazə yalnız bir səfərə şamil edilir.',
    'Ehtiyatın tərkibi əvvəlcədən razılaşdırılır.'
  ]
},
{
  id: 'window-seat-treaty', cat: 'travel', tone: 'zarafat', layout: 'ekspertiza', palette: 'gold',
  title: 'Nəqliyyat Vasitəsində Yerlərin Bölüşdürülməsinə dair Rəy', tag: 'Yer',
  signOrg: 'Səyahət Yoldaşları Arasında Mübahisələr üzrə Şura',
  preamble: 'Məsələyə dair aparılmış qiymətləndirmə nəticəsində müəyyən edilmişdir ki, {to} və {from} arasında pəncərə yeri üzrə mübahisə növbəlilik prinsipi ilə həll edilə bilər. Rəy bütün iştirakçıların rahatlığını nəzərə alır.',
  powers: 'Pəncərə yeri hər iki saatdan bir dəyişdirilir.\nÖn oturacaq ən hündür sərnişinə verilir.\nYuxuya gedən şəxs yerini itirmir.\nDayanacaqda yerdəyişmə aparılır.',
  penalty: 'Növbəliliyin pozulması halında növbəti səfərdə pəncərə yeri tam olaraq zərərçəkmiş tərəfə verilir.',
  titleOptions: [
    'Nəqliyyat Vasitəsində Yerlərin Bölüşdürülməsinə dair Rəy',
    'Pəncərə Yerinin Növbəliliyinə dair Ekspert Rəyi',
    'Oturacaq Seçimi Mübahisəsinin Həllinə dair Yekun Rəy',
    'Uzun Yolda Rahatlığın Bölüşdürülməsinə dair Rəy'
  ],
  powersOptions: [
    'Pəncərə yeri hər iki saatdan bir dəyişdirilir.',
    'Ön oturacaq ən hündür sərnişinə verilir.',
    'Yuxuya gedən şəxs yerini itirmir.',
    'Dayanacaqda yerdəyişmə aparılır.',
    'Xəstəlik halında güzəşt tətbiq edilir.',
    'Şəkil çəkmək üçün müvəqqəti dəyişmə icazəlidir.',
    'Baqaj yerləşdirilməsi yerə təsir etmir.',
    'Qayıdış yolunda növbə tərsinə başlayır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Növbəliliyin pozulması halında növbəti səfərdə pəncərə yeri tam olaraq zərərçəkmiş tərəfə verilir.',
    'Rəy yalnız bir səfərə şamil edilir.',
    'İştirakçıların sayı dəyişdikdə növbə yenidən qurulur.'
  ]
},

/* ---------------- EV HEYVANLARI ---------------- */
{
  id: 'sofa-rights', cat: 'pets', tone: 'zarafat', layout: 'notarial', palette: 'gold',
  title: 'Divanın Müəyyən Hissəsindən İstifadə Hüququnun Verilməsinə dair Akt', tag: 'Divan',
  signOrg: 'Mənzil Daxilində Ərazi Bölgüsü üzrə Komissiya',
  toLabel: 'Hüquq verilən', fromLabel: 'Divanın sahibi',
  preamble: 'İş üzrə toplanmış məlumatlara əsasən {from} tərəfindən {to} adlı şəxsə divanın müəyyən hissəsindən istifadə hüququ verilir. Hüquq uzunmüddətli faktiki istifadə əsasında tanınmışdır.',
  powers: 'Divanın sağ küncü daimi istifadəyə verilir.\nYastıq mübahisə predmeti sayılmır.\nQonaq gəldikdə yer müvəqqəti boşaldılır.\nTük təmizliyi ev sahibinin öhdəsindədir.',
  penalty: 'Hüquq divanın zədələnməməsi şərti ilə qüvvədədir; cırılma halında istifadə sahəsi yenidən müəyyən edilir.',
  titleOptions: [
    'Divanın Müəyyən Hissəsindən İstifadə Hüququnun Verilməsinə dair Akt',
    'Mənzil Daxilində Ərazi Bölgüsünün Təsbit Edilməsinə dair Akt',
    'Yastıq və Ədyalın İstifadə Rejiminə dair Etibarnamə',
    'İstirahət Yerinin Rəsmi Qaydada Tanınmasına dair Akt'
  ],
  powersOptions: [
    'Divanın sağ küncü daimi istifadəyə verilir.',
    'Yastıq mübahisə predmeti sayılmır.',
    'Qonaq gəldikdə yer müvəqqəti boşaldılır.',
    'Tük təmizliyi ev sahibinin öhdəsindədir.',
    'Ədyaldan istifadə soyuq aylarda genişləndirilir.',
    'Günəş düşən hissə növbə ilə tutulur.',
    'Yerdəyişmə xahişi bir dəfə edilir.',
    'Gecə saatlarında yer sərbəst seçilir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Hüquq divanın zədələnməməsi şərti ilə qüvvədədir; cırılma halında istifadə sahəsi yenidən müəyyən edilir.',
    'Akt yeni mebel alındıqda yenidən tərtib edilir.',
    'Hüquq digər ev heyvanlarına şamil edilmir.'
  ]
},
{
  id: 'feeding-duty', cat: 'pets', tone: 'zarafat', layout: 'arayis', palette: 'forest',
  title: 'Ev Heyvanının Yemləmə Növbəsinin Bölüşdürülməsi haqqında Arayış', tag: 'Növbə',
  signOrg: 'Yemləmə və Gəzinti Növbəsi üzrə Baş İdarə',
  toLabel: 'Növbəni icra edən', fromLabel: 'Cədvəli təsdiq edən',
  preamble: 'Verilir {to} adlı şəxsə ondan ötrü ki, ev heyvanının yemləmə növbəsi {from} ilə birgə müəyyən edilmiş, səhər və axşam saatları üzrə cədvəl tərtib olunmuş və bütün ailə üzvlərinə çatdırılmışdır.',
  powers: 'Yemləmə səhər və axşam saatlarında aparılır.\nSu qabı hər gün yenilənir.\nSüfrədən yemək verilmir.\nNövbə dəyişikliyi əvvəlcədən bildirilir.',
  penalty: 'Növbənin ardıcıl iki dəfə buraxılması halında yemləmə öhdəliyi növbəti həftə üçün tam olaraq həmin şəxsin üzərinə düşür.',
  titleOptions: [
    'Ev Heyvanının Yemləmə Növbəsinin Bölüşdürülməsi haqqında Arayış',
    'Yemləmə Cədvəlinin İcra Vəziyyəti haqqında Rəsmi Arayış',
    'Qidalanma Rejiminin Müəyyən Edilməsi haqqında Arayış',
    'Növbənin Ailə Üzvləri Arasında Bölgüsü haqqında Arayış'
  ],
  powersOptions: [
    'Yemləmə səhər və axşam saatlarında aparılır.',
    'Su qabı hər gün yenilənir.',
    'Süfrədən yemək verilmir.',
    'Növbə dəyişikliyi əvvəlcədən bildirilir.',
    'Yem ehtiyatı bitmədən yenilənir.',
    'Porsiya çəkisi dəyişdirilmir.',
    'Əlavə şirniyyat baytarla razılaşdırılır.',
    'Qab yemdən sonra yuyulur.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Növbənin ardıcıl iki dəfə buraxılması halında yemləmə öhdəliyi növbəti həftə üçün tam olaraq həmin şəxsin üzərinə düşür.',
    'Arayış hər ay yenidən tərtib edilir.',
    'Səfər dövründə növbə ayrıca razılaşdırılır.'
  ]
},
{
  id: 'cat-license', cat: 'pets', tone: 'zarafat', layout: 'lisenziya', palette: 'ink',
  title: 'Mənzil Daxilində Sərbəst Hərəkət Hüququna dair Xüsusi İcazə', tag: 'Pişik',
  signOrg: 'Ev Heyvanlarının Hüquqları üzrə Ali Şura',
  powersLabel: 'LİSENZİYANIN ƏHATƏ ETDİYİ HALLAR',
  preamble: '{from} tərəfindən {to} adlı şəxsə mənzil daxilində sərbəst hərəkət hüququ verilir. İcazə mövcud vəziyyətin rəsmiləşdirilməsindən ibarətdir; faktiki olaraq bu hüquq artıq uzun müddətdir tətbiq edilir.',
  powers: 'Bütün otaqlara giriş açıqdır.\nQapılar tam bağlanmır.\nPəncərə önü daimi istifadəyə verilir.\nGecə fəaliyyəti müzakirə predmeti deyil.',
  penalty: 'İcazə qiymətli və kövrək əşyaların yerləşdiyi rəflərə şamil edilmir; həmin sahələr istisna zona kimi saxlanılır.',
  titleOptions: [
    'Mənzil Daxilində Sərbəst Hərəkət Hüququna dair Xüsusi İcazə',
    'Rəflərə və Yüksək Səthlərə Çıxma Hüququna dair Lisenziya',
    'Gecə Saatlarında Fəaliyyət Rejiminə dair Xüsusi İcazə',
    'Qapıların Açıq Saxlanılması Tələbinə dair Lisenziya'
  ],
  powersOptions: [
    'Bütün otaqlara giriş açıqdır.',
    'Qapılar tam bağlanmır.',
    'Pəncərə önü daimi istifadəyə verilir.',
    'Gecə fəaliyyəti müzakirə predmeti deyil.',
    'Klaviaturanın üstündə oturmaq icazəlidir.',
    'Karton qutu sahiblik hüququ yaradır.',
    'Mətbəx rəfi istisna zona kimi qalır.',
    'Yatağın ortası növbə ilə tutulur.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'İcazə qiymətli və kövrək əşyaların yerləşdiyi rəflərə şamil edilmir; həmin sahələr istisna zona kimi saxlanılır.',
    'İcazə müddətsizdir və geri alınmır.',
    'Qonaq gəldikdə hərəkət sahəsi müvəqqəti məhdudlaşdırılır.'
  ]
},
{
  id: 'walk-contract', cat: 'pets', tone: 'zarafat', layout: 'muqavile', palette: 'forest',
  title: 'Gündəlik Gəzintinin Marşrutu, Müddəti və Növbəliliyi üzrə Müqavilə', tag: 'Gəzinti',
  signOrg: 'Yemləmə və Gəzinti Növbəsi üzrə Baş İdarə',
  preamble: 'Tərəflərin mövqeyi nəzərə alınmaqla, {from} və {to} arasında gündəlik gəzintinin marşrutu, müddəti və növbəliliyi barədə razılıq əldə edilmişdir. Müqavilə bütün mövsümlərə şamil olunur.',
  powers: 'Gəzinti gündə iki dəfə həyata keçirilir.\nMüddət ən azı iyirmi dəqiqə olur.\nMarşrut həftədə bir dəfə dəyişdirilir.\nYağışlı hava gəzintini ləğv etmir.',
  penalty: 'Gəzinti növbəsinin buraxılması halında həmin gün ikinci gəzinti öhdəliyi tam olaraq növbəni buraxan tərəfin üzərinə düşür.',
  titleOptions: [
    'Gündəlik Gəzintinin Marşrutu, Müddəti və Növbəliliyi üzrə Müqavilə',
    'Gəzinti Növbəsinin Ailə Üzvləri Arasında Bölgüsü üzrə Saziş',
    'Hava Şəraitinin Nəzərə Alınması Qaydası üzrə Qarşılıqlı Müqavilə',
    'Gəzinti Zamanı Davranış Qaydalarının Müəyyən Edilməsi üzrə Protokol'
  ],
  powersOptions: [
    'Gəzinti gündə iki dəfə həyata keçirilir.',
    'Müddət ən azı iyirmi dəqiqə olur.',
    'Marşrut həftədə bir dəfə dəyişdirilir.',
    'Yağışlı hava gəzintini ləğv etmir.',
    'Digər heyvanlarla görüş nəzarətdə saxlanılır.',
    'Zibil ardınca yığılır.',
    'Su butulkası özü ilə götürülür.',
    'Axşam gəzintisi işıqlı marşrutla aparılır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Gəzinti növbəsinin buraxılması halında həmin gün ikinci gəzinti öhdəliyi tam olaraq növbəni buraxan tərəfin üzərinə düşür.',
    'Müqavilə mövsümə uyğun olaraq dəyişdirilir.',
    'Xəstəlik halında növbə avtomatik keçirilir.'
  ]
},
{
  id: 'good-boy-diploma', cat: 'pets', tone: 'zarafat', layout: 'diplom', palette: 'gold',
  title: 'İl Ərzində Nümunəvi Davranışa Görə Verilmiş Fəxri Diplom', tag: 'Fəxri ad',
  signOrg: 'Ev Heyvanlarının Hüquqları üzrə Ali Şura',
  preamble: 'Şura {to} adlı şəxsin il ərzində ev qaydalarına münasibətdə göstərdiyi davranışı qiymətləndirərək təltif haqqında qərar qəbul etmişdir. Diplom {from} tərəfindən təqdim olunur və ailə arxivində saxlanılır.',
  powers: 'Ayaqqabılar bu il toxunulmaz qalıb.\nQonaqlar həddindən artıq narahat edilməyib.\nÇağırışa cavab verilib.\nGecə səs-küy salınmayıb.',
  penalty: 'Diplom geri alınmır. Təltif olunan bir dəfə əlavə şirniyyat almaq hüququ qazanır.',
  titleOptions: [
    'İl Ərzində Nümunəvi Davranışa Görə Verilmiş Fəxri Diplom',
    'Ev Qaydalarına Əməl Edilməsinə Görə Verilmiş Fəxri Diplom',
    'Qonaqların Qarşılanmasında Göstərilən Nizama Görə Diplom',
    'Sadiqlik və Səbrə Görə Verilmiş Fəxri Nişan'
  ],
  powersOptions: [
    'Ayaqqabılar bu il toxunulmaz qalıb.',
    'Qonaqlar həddindən artıq narahat edilməyib.',
    'Çağırışa cavab verilib.',
    'Gecə səs-küy salınmayıb.',
    'Baytar ziyarətinə müqavimət göstərilməyib.',
    'Yeni yem növü qəbul edilib.',
    'Qonşu heyvanlarla münasibət sabit qalıb.',
    'Uşaqlarla davranış nümunəvi olub.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Diplom geri alınmır. Təltif olunan bir dəfə əlavə şirniyyat almaq hüququ qazanır.',
    'Təltif hər il yenidən qiymətləndirilir.',
    'Diplom ailə arxivində müddətsiz saxlanılır.'
  ]
},
{
  id: 'bark-decree', cat: 'pets', tone: 'zarafat', layout: 'blank', palette: 'steel',
  title: 'Gecə Saatlarında Səs Rejiminin Müəyyən Edilməsi haqqında Bildiriş', tag: 'Səs',
  signOrg: 'Ev Heyvanlarının Hüquqları üzrə Ali Şura',
  preamble: 'Daxil olmuş müraciətə baxılaraq bildirilir ki, {to} adlı şəxs üçün gecə saatlarında səs rejimi müəyyən edilmişdir. Qərar {from} tərəfindən, qonşulardan daxil olmuş müraciətlər nəzərə alınaraq qəbul edilmişdir.',
  powers: 'Gecə saat 23:00-dan sonra səs həddi azaldılır.\nQapı zənginə reaksiya qısa olur.\nPəncərədən keçən şəxslərə reaksiya azaldılır.\nLift səsi təhlükə siqnalı sayılmır.',
  penalty: 'Rejimin ardıcıl pozulması halında gecə saatlarında qalınan otaq dəyişdirilir və gəzinti cədvəli yenidən tərtib olunur.',
  titleOptions: [
    'Gecə Saatlarında Səs Rejiminin Müəyyən Edilməsi haqqında Bildiriş',
    'Qapı Zəngi Zamanı Reaksiya Qaydaları haqqında Bildiriş',
    'Qonşuların Narahat Edilməməsi Tədbirləri haqqında Bildiriş',
    'Səs Həddinin Gecə və Gündüz üzrə Müəyyən Edilməsi Bildirişi'
  ],
  powersOptions: [
    'Gecə saat 23:00-dan sonra səs həddi azaldılır.',
    'Qapı zənginə reaksiya qısa olur.',
    'Pəncərədən keçən şəxslərə reaksiya azaldılır.',
    'Lift səsi təhlükə siqnalı sayılmır.',
    'Qonaq gəlişi əvvəlcədən xəbərdar edilir.',
    'Gündüz saatlarında rejim yumşaldılır.',
    'Digər heyvanların səsi istisna hesab olunur.',
    'Bayram atəşfəşanlığı ayrıca nəzərə alınır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Rejimin ardıcıl pozulması halında gecə saatlarında qalınan otaq dəyişdirilir və gəzinti cədvəli yenidən tərtib olunur.',
    'Bildiriş yalnız gecə saatlarına şamil edilir.',
    'Xəstəlik halında rejim tətbiq edilmir.'
  ]
},
{
  id: 'vet-visit-arayis', cat: 'pets', tone: 'zarafat', layout: 'ekspertiza', palette: 'steel',
  title: 'Baytar Müayinəsinin Nəticələri və Tövsiyələr haqqında Rəy', tag: 'Baytar',
  signOrg: 'Yemləmə və Gəzinti Növbəsi üzrə Baş İdarə',
  toLabel: 'Müayinə olunan', fromLabel: 'Müşayiət edən',
  preamble: 'Aparılmış müayinə nəticəsində {to} adlı şəxsin ümumi sağlamlıq vəziyyəti qənaətbəxş qiymətləndirilmişdir. Rəy {from} tərəfindən verilmiş müraciət əsasında tərtib edilmiş və tövsiyələrlə tamamlanmışdır.',
  powers: 'Ümumi vəziyyət qənaətbəxş hesab edilir.\nÇəki norma həddinin yuxarı sərhədindədir.\nGündəlik hərəkət həcminin artırılması tövsiyə olunur.\nNövbəti müayinə altı aydan sonra planlaşdırılır.',
  penalty: 'Tövsiyələrə əməl edilmədikdə növbəti müayinədə əlavə tədbirlərin görülməsi zəruri hesab ediləcəkdir.',
  titleOptions: [
    'Baytar Müayinəsinin Nəticələri və Tövsiyələr haqqında Rəy',
    'Ümumi Sağlamlıq Vəziyyətinin Qiymətləndirilməsinə dair Rəy',
    'Çəki və Qidalanma Rejiminə dair Ekspert Rəyi',
    'Növbəti Müayinənin Tarixinə dair Yekun Rəy'
  ],
  powersOptions: [
    'Ümumi vəziyyət qənaətbəxş hesab edilir.',
    'Çəki norma həddinin yuxarı sərhədindədir.',
    'Gündəlik hərəkət həcminin artırılması tövsiyə olunur.',
    'Növbəti müayinə altı aydan sonra planlaşdırılır.',
    'Peyvənd cədvəli yenilənib.',
    'Qidalanma rejimi dəyişdirilməlidir.',
    'Diş vəziyyəti nəzarətə götürülüb.',
    'Süfrədən yemək verilməsi dayandırılmalıdır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Tövsiyələrə əməl edilmədikdə növbəti müayinədə əlavə tədbirlərin görülməsi zəruri hesab ediləcəkdir.',
    'Rəy növbəti müayinəyə qədər qüvvədədir.',
    'Vəziyyət dəyişdikdə təkrar müraciət edilir.'
  ]
},
{
  id: 'pet-court', cat: 'pets', tone: 'zarafat', layout: 'qerar', palette: 'burgundy',
  title: 'Ev Heyvanına Aid Edilən Əməl üzrə Aparılmış Baxışın Qərarı', tag: 'Məhkəmə',
  signOrg: 'Ev Heyvanlarının Hüquqları üzrə Ali Şura',
  preamble: 'Şura {to} adlı şəxsə aid edilən əməli araşdıraraq müəyyən etmişdir ki, təqdim edilmiş dəlillər birbaşa təsdiq üçün kifayət deyil. {from} tərəfindən verilmiş müraciət qismən əsaslı hesab olunur.',
  powers: 'Hadisə yerində birbaşa şahid olmayıb.\nDəlillər dolayı xarakter daşıyır.\nDigər ev sakinlərinin iştirakı istisna edilmir.\nŞübhələr təqsirsizlik xeyrinə şərh olunur.',
  penalty: 'Şəxs bəraət almış hesab edilsin. Bununla belə, qiymətli əşyaların daha yüksək rəflərdə saxlanılması tövsiyə olunur.',
  titleOptions: [
    'Ev Heyvanına Aid Edilən Əməl üzrə Aparılmış Baxışın Qərarı',
    'Zədələnmiş Əşya ilə Bağlı Məsələ üzrə Yekun Qətnamə',
    'Günahın Müəyyən Edilməsi Mümkün Olmadığı haqqında Bəraət',
    'Şübhələrin Təsdiqlənməməsi haqqında Yekun Qərar'
  ],
  powersOptions: [
    'Hadisə yerində birbaşa şahid olmayıb.',
    'Dəlillər dolayı xarakter daşıyır.',
    'Digər ev sakinlərinin iştirakı istisna edilmir.',
    'Şübhələr təqsirsizlik xeyrinə şərh olunur.',
    'Əşyanın yerləşdiyi hündürlük nəzərə alınıb.',
    'Hadisənin vaxtı dəqiqləşdirilməyib.',
    'Əvvəlki oxşar hallar sənədləşdirilməyib.',
    'Davranış dəyişikliyi qeydə alınmayıb.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Şəxs bəraət almış hesab edilsin. Bununla belə, qiymətli əşyaların daha yüksək rəflərdə saxlanılması tövsiyə olunur.',
    'Yeni dəlillər aşkarlandıqda məsələyə yenidən baxıla bilər.',
    'Qərar oxşar gələcək hallara şamil edilmir.'
  ]
},
{
  id: 'pet-id', cat: 'pets', tone: 'zarafat', layout: 'vesiqe', palette: 'gold',
  title: 'Ev Heyvanının Ailə Üzvü Statusunu və Hüquqlarını Təsdiq edən Vəsiqə', tag: 'Vəsiqə',
  signOrg: 'Mənzil Daxilində Ərazi Bölgüsü üzrə Komissiya',
  fromLabel: 'Vəsiqəni verən sahib',
  preamble: 'Bu vəsiqə {to} adlı şəxsin ailənin tamhüquqlu üzvü olduğunu təsdiq edir. Sənəd {from} tərəfindən verilmişdir, mənzil daxilində tanınmış hüquqları əhatə edir və müddətsiz hesab olunur.',
  powers: 'Ailə fotolarında iştirak hüququ tanınır.\nDivanda daimi yer ayrılır.\nAd günü qeyd edilir.\nSəfər planlaşdırılarkən nəzərə alınır.',
  penalty: 'Vəsiqə müddətsizdir və heç bir halda geri alınmır; hüquqlar ailənin bütün üzvləri tərəfindən tanınır.',
  titleOptions: [
    'Ev Heyvanının Ailə Üzvü Statusunu və Hüquqlarını Təsdiq edən Vəsiqə',
    'Mənzil Daxilində Hüquq və Ərazilərin Təsdiqinə dair Vəsiqə',
    'Ailə Fotolarında İştirak Hüququnu Təsdiq edən Rəsmi Vəsiqə',
    'Ev Heyvanının Ailədaxili Statusuna dair Şəhadətnamə'
  ],
  powersOptions: [
    'Ailə fotolarında iştirak hüququ tanınır.',
    'Divanda daimi yer ayrılır.',
    'Ad günü qeyd edilir.',
    'Səfər planlaşdırılarkən nəzərə alınır.',
    'Qonaqlara ayrıca təqdim edilir.',
    'Yem növü seçimində reaksiya nəzərə alınır.',
    'Baytar ziyarəti vaxtında təşkil olunur.',
    'Oyuncaqlar mütəmadi yenilənir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Vəsiqə müddətsizdir və heç bir halda geri alınmır; hüquqlar ailənin bütün üzvləri tərəfindən tanınır.',
    'Vəsiqə ailənin bütün üzvlərinə eyni qaydada məlumdur.',
    'Status yeni ev heyvanı gəldikdə də dəyişmir.'
  ]
},
{
  id: 'treat-certificate', cat: 'pets', tone: 'zarafat', layout: 'sertifikat', palette: 'burgundy',
  title: 'Əlavə Yem və Mükafatın Verilməsi Qaydasını Təsdiq edən Sertifikat', tag: 'Mükafat',
  signOrg: 'Yemləmə və Gəzinti Növbəsi üzrə Baş İdarə',
  powersLabel: 'MÜKAFATLANDIRMA ŞƏRTLƏRİ',
  preamble: 'Bununla təsdiq edilir ki, {to} adlı şəxs üçün əlavə yem və mükafatın verilməsi qaydası müəyyən edilmişdir. Sertifikat {from} tərəfindən, baytar tövsiyələri nəzərə alınmaqla verilmişdir.',
  powers: 'Gündəlik mükafat norması üç ədəddir.\nMükafat komandanın icrasından sonra verilir.\nSüfrədən yemək mükafat sayılmır.\nNorma bütün ailə üzvləri üçün ümumidir.',
  penalty: 'Normanın aşılması halında növbəti gün mükafat verilmir və çəki nəzarəti gücləndirilir.',
  titleOptions: [
    'Əlavə Yem və Mükafatın Verilməsi Qaydasını Təsdiq edən Sertifikat',
    'Mükafat Normasının Müəyyən Edilməsinə dair Sertifikat',
    'Komandaların İcrasına Görə Mükafatlandırma Sertifikatı',
    'Gündəlik Şirniyyat Limitinin Təsdiqinə dair Şəhadətnamə'
  ],
  powersOptions: [
    'Gündəlik mükafat norması üç ədəddir.',
    'Mükafat komandanın icrasından sonra verilir.',
    'Süfrədən yemək mükafat sayılmır.',
    'Norma bütün ailə üzvləri üçün ümumidir.',
    'Qonaqlar mükafat vermək hüququna malik deyil.',
    'Gəzintidən sonra əlavə bir ədəd verilir.',
    'Yeni növ tədricən tətbiq edilir.',
    'Baytar tövsiyəsi normadan üstündür.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Normanın aşılması halında növbəti gün mükafat verilmir və çəki nəzarəti gücləndirilir.',
    'Sertifikat baytar müayinəsindən sonra yenilənir.',
    'Xəstəlik dövründə norma dayandırılır.'
  ]
},
{
  id: 'lost-toy-telegram', cat: 'pets', tone: 'zarafat', layout: 'teleqram', palette: 'ink',
  title: 'İtkin Düşmüş Oyuncağın Axtarışı haqqında Təcili Teleqram', tag: 'İtki',
  signOrg: 'Mənzil Daxilində Ərazi Bölgüsü üzrə Komissiya',
  preamble: 'Sizə bildiririk ki, {to} adlı şəxsin sevimli oyuncağı itkin düşmüşdür. {from} tərəfindən axtarış tədbirlərinin dərhal genişləndirilməsi və nəticə barədə məlumat verilməsi tələb olunur.',
  powers: 'Divanın altı yoxlanılıb, nəticə mənfidir.\nŞkafın arxası hələ yoxlanılmayıb.\nSon görülmə yeri dəqiqləşdirilir.\nƏvəzedici variant müvəqqəti təklif edilib.',
  penalty: 'Oyuncaq tapılmadıqda eyni növdən yenisinin alınması qaçılmaz hesab edilir və gecikdirilmir.',
  titleOptions: [
    'İtkin Düşmüş Oyuncağın Axtarışı haqqında Təcili Teleqram',
    'Sevimli Oyuncağın Tapılmaması haqqında Təxirəsalınmaz Bildiriş',
    'Axtarış Tədbirlərinin Genişləndirilməsi haqqında Teleqram',
    'Əvəzedici Oyuncağın Alınması haqqında Təcili Xəbərdarlıq'
  ],
  powersOptions: [
    'Divanın altı yoxlanılıb, nəticə mənfidir.',
    'Şkafın arxası hələ yoxlanılmayıb.',
    'Son görülmə yeri dəqiqləşdirilir.',
    'Əvəzedici variant müvəqqəti təklif edilib.',
    'Digər otaqlar da axtarışa daxil edilib.',
    'Ailə üzvləri məlumatlandırılıb.',
    'Yeni oyuncaq sifarişi nəzərdən keçirilir.',
    'Axtarış üç gün davam etdiriləcək.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Oyuncaq tapılmadıqda eyni növdən yenisinin alınması qaçılmaz hesab edilir və gecikdirilmir.',
    'Teleqram yalnız məlumat xarakteri daşıyır.',
    'Oyuncaq tapıldıqda axtarış dayandırılır.'
  ]
},
{
  id: 'bed-sharing-act', cat: 'pets', tone: 'zarafat', layout: 'viza', palette: 'steel',
  title: 'Yataq Sahəsinin Bölüşdürülməsi və İstifadəsinə dair İcazə', tag: 'Yataq',
  signOrg: 'Mənzil Daxilində Ərazi Bölgüsü üzrə Komissiya',
  preamble: '{from} tərəfindən {to} adlı şəxsə yataq sahəsinin müəyyən hissəsindən istifadə icazəsi verilir. İcazə uzunmüddətli faktiki istifadənin rəsmiləşdirilməsindən ibarətdir və sahənin sərhədlərini dəqiqləşdirir.',
  powers: 'Ayaqucu daimi istifadəyə verilir.\nYastıq sahəsi istisna zona kimi qalır.\nGecə yerdəyişməsi məhdudlaşdırılmır.\nƏdyalın bölgüsü qarşılıqlı razılıqla aparılır.',
  penalty: 'İcazə yatağın təmizliyinin qorunması şərti ilə qüvvədədir; şərt pozulduqda sahə yenidən müəyyən edilir.',
  titleOptions: [
    'Yataq Sahəsinin Bölüşdürülməsi və İstifadəsinə dair İcazə',
    'Gecə Saatlarında Yer Tutma Qaydasına dair Xüsusi İcazə',
    'Yataq Sahəsinin Sərhədlərinin Müəyyən Edilməsinə dair İcazə',
    'Ayaqucunda Daimi Yer Ayrılmasına dair İcazə'
  ],
  powersOptions: [
    'Ayaqucu daimi istifadəyə verilir.',
    'Yastıq sahəsi istisna zona kimi qalır.',
    'Gecə yerdəyişməsi məhdudlaşdırılmır.',
    'Ədyalın bölgüsü qarşılıqlı razılıqla aparılır.',
    'Soyuq aylarda sahə genişləndirilir.',
    'Səhər oyatma qadağan edilmir.',
    'Qonaq gəldikdə yer müvəqqəti dəyişdirilir.',
    'Yatağın dəyişdirilməsi əvvəlcədən bildirilir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'İcazə yatağın təmizliyinin qorunması şərti ilə qüvvədədir; şərt pozulduqda sahə yenidən müəyyən edilir.',
    'İcazə xəstəlik dövründə genişləndirilir.',
    'Sahə bölgüsü hər mövsüm yenidən razılaşdırılır.'
  ]
},

/* ---------------- OYUNÇULAR / GAMER ---------------- */
{
  id: 'rank-certificate', cat: 'gaming', tone: 'zarafat', layout: 'sertifikat', palette: 'ink',
  title: 'Oyunçunun Mövcud Reytinq Səviyyəsini Təsdiq edən Sertifikat', tag: 'Rank',
  signOrg: 'Elektron Oyunlar üzrə Texniki Ekspertiza Mərkəzi',
  powersLabel: 'RANKIN VERDİYİ SƏLAHİYYƏTLƏR',
  preamble: 'Bununla təsdiq edilir ki, {to} adlı şəxsin reytinq səviyyəsi müstəqil qaydada, kənar köməklik olmadan qazanılmışdır. Sertifikat {from} tərəfindən verilmiş müraciət əsasında, oyun tarixçəsinin yoxlanılmasından sonra rəsmiləşdirilmişdir.',
  powers: 'Hesab yalnız sahibi tərəfindən idarə edilib.\nReytinq mövsüm ərzində fasiləsiz artıb.\nKənar xidmətlərdən istifadə aşkarlanmayıb.\nNəticələr matç tarixçəsi ilə uyğun gəlir.',
  penalty: 'Hesabın üçüncü şəxs tərəfindən idarə edildiyi aşkarlandıqda sertifikat qüvvədən düşür və reytinq mövsümün əvvəlinə qaytarılmış hesab edilir.',
  titleOptions: [
    'Oyunçunun Mövcud Reytinq Səviyyəsini Təsdiq edən Sertifikat',
    'Reytinqin Müstəqil Qaydada Qazanıldığını Təsdiq edən Sertifikat',
    'Hesabın Sahibi Tərəfindən İdarə Edildiyini Təsdiq edən Sertifikat',
    'Mövsüm Ərzində Əldə Edilmiş Nəticələrə dair Şəhadətnamə'
  ],
  powersOptions: [
    'Hesab yalnız sahibi tərəfindən idarə edilib.',
    'Reytinq mövsüm ərzində fasiləsiz artıb.',
    'Kənar xidmətlərdən istifadə aşkarlanmayıb.',
    'Nəticələr matç tarixçəsi ilə uyğun gəlir.',
    'Komanda tərkibi mütəmadi dəyişdirilib.',
    'Ardıcıl məğlubiyyət seriyası qeydə alınmayıb.',
    'Oyun saatları normal həddədir.',
    'Şikayət qeydiyyatı təmizdir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Hesabın üçüncü şəxs tərəfindən idarə edildiyi aşkarlandıqda sertifikat qüvvədən düşür və reytinq mövsümün əvvəlinə qaytarılmış hesab edilir.',
    'Sertifikat hər mövsümün sonunda yenidən verilir.',
    'Nəticələr yenidən yoxlanıla bilər.'
  ]
},
{
  id: 'team-contract', cat: 'gaming', tone: 'zarafat', layout: 'muqavile', palette: 'steel',
  title: 'Komanda Daxilində Rolların və Davranış Qaydalarının Müqaviləsi', tag: 'Komanda',
  signOrg: 'Virtual Oyun Nəticələrinə Etirazlar üzrə Şura',
  preamble: 'Tərəflərin mövqeyi nəzərə alınmaqla, {from} və {to} arasında komanda daxilində rolların bölgüsü və matç zamanı ünsiyyət qaydaları barədə razılıq əldə edilmişdir. Müqavilə mövsümün sonuna qədər qüvvədədir.',
  powers: 'Rollar matç başlamazdan əvvəl bölüşdürülür.\nSəhvə görə komanda yoldaşı günahlandırılmır.\nMikrofon lazımsız səs ötürmür.\nMatç yarımçıq tərk edilmir.',
  penalty: 'Matçın yarımçıq tərk edilməsi halında növbəti üç matçda xəritə və rol seçimi qalan iştirakçılar tərəfindən müəyyən edilir.',
  titleOptions: [
    'Komanda Daxilində Rolların və Davranış Qaydalarının Müqaviləsi',
    'Komanda Yoldaşlarının Qarşılıqlı Öhdəlikləri üzrə Saziş',
    'Matç Zamanı Ünsiyyət Qaydalarının Müəyyən Edilməsi üzrə Protokol',
    'Komandadan Ayrılma Şərtlərinin Razılaşdırılması üzrə Müqavilə'
  ],
  powersOptions: [
    'Rollar matç başlamazdan əvvəl bölüşdürülür.',
    'Səhvə görə komanda yoldaşı günahlandırılmır.',
    'Mikrofon lazımsız səs ötürmür.',
    'Matç yarımçıq tərk edilmir.',
    'Növbəti xəritə birgə seçilir.',
    'Uduzulmuş matç müzakirə edilmir.',
    'Yeni oyunçu qrupun razılığı ilə qəbul edilir.',
    'Fasilə hər üç matçdan bir verilir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Matçın yarımçıq tərk edilməsi halında növbəti üç matçda xəritə və rol seçimi qalan iştirakçılar tərəfindən müəyyən edilir.',
    'Müqavilə mövsümün sonunda yenidən bağlanır.',
    'Şərtlərin pozulması komandadan müvəqqəti kənarlaşdırmaya əsasdır.'
  ]
},
{
  id: 'screen-time-decree', cat: 'gaming', tone: 'zarafat', layout: 'blank', palette: 'ink',
  title: 'Gündəlik Oyun Müddətinin Məhdudlaşdırılması haqqında Bildiriş', tag: 'Rejim',
  signOrg: 'Oyun Rejimi və Ekran Vaxtı üzrə Baş İdarə',
  preamble: 'Daxil olmuş müraciətə baxılaraq bildirilir ki, {to} adlı şəxs üçün gündəlik oyun müddəti müəyyən edilmişdir. Qərar {from} tərəfindən, son həftələrdə oyun saatlarının nəzərəçarpacaq dərəcədə artması nəzərə alınaraq qəbul edilmişdir.',
  powers: 'Gündəlik limit üç saat müəyyən edilir.\n«Son matç» bir matç kimi hesablanır.\nGecə saat 01:00-dan sonra oyun dayandırılır.\nHəftəsonu limit bir saat artırılır.',
  penalty: 'Limitin ardıcıl aşılması halında oyun rejimi növbəti iki gün üçün dayandırılır və bərpa yalnız öhdəliklər tamamlandıqdan sonra mümkündür.',
  titleOptions: [
    'Gündəlik Oyun Müddətinin Məhdudlaşdırılması haqqında Bildiriş',
    'Gecə Saatlarında Oyun Rejiminin Dayandırılması haqqında Bildiriş',
    '«Son matç» Anlayışının Hüdudlarının Müəyyən Edilməsi Bildirişi',
    'Oyun və İstirahət Balansının Tənzimlənməsi haqqında Bildiriş'
  ],
  powersOptions: [
    'Gündəlik limit üç saat müəyyən edilir.',
    '«Son matç» bir matç kimi hesablanır.',
    'Gecə saat 01:00-dan sonra oyun dayandırılır.',
    'Həftəsonu limit bir saat artırılır.',
    'Turnir günləri limitdən kənar sayılır.',
    'Dostlarla birgə oyun ayrıca hesablanır.',
    'Yükləmə vaxtı limitə daxil edilmir.',
    'Fasilə hər saatdan bir verilir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Limitin ardıcıl aşılması halında oyun rejimi növbəti iki gün üçün dayandırılır və bərpa yalnız öhdəliklər tamamlandıqdan sonra mümkündür.',
    'Bildiriş hər ay yenidən nəzərdən keçirilir.',
    'Turnir dövründə limit müvəqqəti genişləndirilir.'
  ]
},
{
  id: 'keyboard-peace', cat: 'gaming', tone: 'zarafat', layout: 'notarial', palette: 'steel',
  title: 'Oyun Avadanlığına Qarşı Fiziki Təsirin Dayandırılmasına dair Akt', tag: 'Sülh',
  signOrg: 'Virtual Oyun Nəticələrinə Etirazlar üzrə Şura',
  preamble: 'İş üzrə toplanmış məlumatlara əsasən {from} tərəfindən {to} adlı şəxsə oyun avadanlığının qorunması öhdəliyi həvalə edilir. Öhdəlik məğlubiyyət anlarını da əhatə edir və istisna nəzərdə tutmur.',
  powers: 'Klaviatura masaya vurulmur.\nPult yerə atılmır və divara dəyməz.\nQulaqlıq boyundan çıxarılarkən dartılmır.\nSiçan yalnız təyinatı üzrə işlədilir.',
  penalty: 'Avadanlığın zədələnməsi halında yenisinin alınması tam olaraq zədəni törətmiş tərəfin öz vəsaiti hesabına həyata keçirilir.',
  titleOptions: [
    'Oyun Avadanlığına Qarşı Fiziki Təsirin Dayandırılmasına dair Akt',
    'Klaviatura və Pultun Qorunması üzrə Öhdəliklərə dair Akt',
    'Məğlubiyyət Anında Özünü Saxlamaq Öhdəliyinə dair Etibarnamə',
    'Avadanlığın Zədələnməsinin Qarşısının Alınmasına dair Akt'
  ],
  powersOptions: [
    'Klaviatura masaya vurulmur.',
    'Pult yerə atılmır və divara dəyməz.',
    'Qulaqlıq boyundan çıxarılarkən dartılmır.',
    'Siçan yalnız təyinatı üzrə işlədilir.',
    'Monitor yerindən tərpədilmir.',
    'Kabellər kəskin hərəkətlə çəkilmir.',
    'Stul geri itələnərkən nəzarət saxlanılır.',
    'Zədələnmə halı dərhal bildirilir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Avadanlığın zədələnməsi halında yenisinin alınması tam olaraq zədəni törətmiş tərəfin öz vəsaiti hesabına həyata keçirilir.',
    'Təkrar hal oyun rejiminin dayandırılmasına əsasdır.',
    'Öhdəlik bütün ev avadanlığına şamil olunur.'
  ]
},
{
  id: 'mvp-diploma', cat: 'gaming', tone: 'zarafat', layout: 'diplom', palette: 'gold',
  title: 'Matçda Göstərilmiş Ən Yüksək Nəticəyə Görə Verilmiş Fəxri Diplom', tag: 'Matç',
  signOrg: 'Elektron Oyunlar üzrə Texniki Ekspertiza Mərkəzi',
  preamble: 'Mərkəz {to} adlı şəxsin matçdakı fəaliyyətini təhlil edərək müəyyən etmişdir ki, komandanın nəticəsinə həlledici təsir göstərən şəxs məhz odur. Diplom {from} tərəfindən təqdim olunur və matç tarixçəsi ilə təsdiqlənir.',
  powers: 'Həlledici anlarda düzgün qərar qəbul edilib.\nKomanda yoldaşlarına dəstək göstərilib.\nSəhvlər dərhal düzəldilib.\nMatç sona qədər tərk edilməyib.',
  penalty: 'Diplom bir matç üçün verilir və geri alınmır. Növbəti matçın nəticəsi bu təltifin qüvvəsinə təsir göstərmir.',
  titleOptions: [
    'Matçda Göstərilmiş Ən Yüksək Nəticəyə Görə Verilmiş Fəxri Diplom',
    'Komandanın Qələbəsində Həlledici Rola Görə Fəxri Diplom',
    'Matçın Son Dəqiqələrindəki Fəaliyyətə Görə Fəxri Diplom',
    'Mövsümün Ən Yaxşı Göstəricisinə Görə Verilmiş Fəxri Nişan'
  ],
  powersOptions: [
    'Həlledici anlarda düzgün qərar qəbul edilib.',
    'Komanda yoldaşlarına dəstək göstərilib.',
    'Səhvlər dərhal düzəldilib.',
    'Matç sona qədər tərk edilməyib.',
    'Strategiya matç gedişində uyğunlaşdırılıb.',
    'Ünsiyyət aydın və qısa olub.',
    'Məğlubiyyət riski anında sakitlik saxlanılıb.',
    'Nəticə şəxsi göstərici üzərində qurulmayıb.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Diplom bir matç üçün verilir və geri alınmır. Növbəti matçın nəticəsi bu təltifin qüvvəsinə təsir göstərmir.',
    'Təltif mövsümün sonunda ümumiləşdirilir.',
    'Diplom komanda arxivində saxlanılır.'
  ]
},
{
  id: 'lag-excuse-license', cat: 'gaming', tone: 'zarafat', layout: 'lisenziya', palette: 'forest',
  title: 'Bağlantı Gecikməsinə İstinad Etmək Hüququna dair Məhdud Lisenziya', tag: 'Bəhanə',
  signOrg: 'Virtual Oyun Nəticələrinə Etirazlar üzrə Şura',
  powersLabel: 'LİSENZİYANIN ƏHATƏ ETDİYİ BƏHANƏLƏR',
  preamble: '{from} tərəfindən {to} adlı şəxsə məğlubiyyəti bağlantı gecikməsi ilə izah etmək hüququ verilir. Lisenziya məhdud saylı istifadə nəzərdə tutur, hər hal ayrıca qeydə alınır və göstərici ekran görüntüsü ilə təsdiqlənir.',
  powers: 'İstinad ayda ən çoxu iki dəfə edilə bilər.\nGöstərici ekran görüntüsü ilə təsdiqlənir.\nQalib gəlinən matçda istinad edilmir.\nEyni matçda bir dəfə səsləndirilir.',
  penalty: 'Aylıq limit aşıldıqda lisenziya növbəti ay üçün dayandırılır və bağlantı arqumenti müzakirədə nəzərə alınmır.',
  titleOptions: [
    'Bağlantı Gecikməsinə İstinad Etmək Hüququna dair Məhdud Lisenziya',
    'Texniki Səbəblərə İstinadın Rəsmiləşdirilməsinə dair Lisenziya',
    'Məğlubiyyətin Şəbəkə Amili ilə İzah Edilməsinə dair İcazə',
    'Ping Göstəricisinə İstinad Hüququna dair Müddətli Lisenziya'
  ],
  powersOptions: [
    'İstinad ayda ən çoxu iki dəfə edilə bilər.',
    'Göstərici ekran görüntüsü ilə təsdiqlənir.',
    'Qalib gəlinən matçda istinad edilmir.',
    'Eyni matçda bir dəfə səsləndirilir.',
    'Ev internetinin ümumi vəziyyəti nəzərə alınır.',
    'Digər iştirakçıların göstəriciləri müqayisə edilir.',
    'Yükləmə fonda aparılmamalıdır.',
    'Kabel bağlantısı tövsiyə olunur.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Aylıq limit aşıldıqda lisenziya növbəti ay üçün dayandırılır və bağlantı arqumenti müzakirədə nəzərə alınmır.',
    'Lisenziya hər ayın əvvəlində bərpa olunur.',
    'Təsdiqlənməmiş istinad limitdən iki vahid tutur.'
  ]
},
{
  id: 'rage-quit-decision', cat: 'gaming', tone: 'zarafat', layout: 'qerar', palette: 'burgundy',
  title: 'Matçın Yarımçıq Tərk Edilməsi Halının Qiymətləndirilməsi haqqında Qərar', tag: 'Qərar',
  signOrg: 'Virtual Oyun Nəticələrinə Etirazlar üzrə Şura',
  preamble: 'Şura {to} adlı şəxsin matçı yarımçıq tərk etməsi halına baxaraq müəyyən etmişdir ki, göstərilən səbəb qismən əsaslıdır, lakin komandaya dəymiş zərəri tam kompensasiya etmir. {from} tərəfindən verilmiş müraciət qismən təmin edilir.',
  powers: 'Matçı tərk etmə faktı qeydə alınır.\nGöstərilən səbəb qismən əsaslı hesab edilir.\nKomandaya dəymiş zərər kompensasiya olunmur.\nNövbəti matçda rol seçimi məhdudlaşdırılır.',
  penalty: 'Eyni halın bir ay ərzində təkrarlanması komanda tərkibindən müvəqqəti kənarlaşdırmaya əsas verir.',
  titleOptions: [
    'Matçın Yarımçıq Tərk Edilməsi Halının Qiymətləndirilməsi haqqında Qərar',
    'Oyundan Vaxtından Əvvəl Çıxma Halı üzrə Yekun Qətnamə',
    'Komandanın Natamam Tərkibdə Qalması haqqında Qərar',
    'Matçı Tərk Etmə Səbəbinin Əsaslılığı haqqında Qərar'
  ],
  powersOptions: [
    'Matçı tərk etmə faktı qeydə alınır.',
    'Göstərilən səbəb qismən əsaslı hesab edilir.',
    'Komandaya dəymiş zərər kompensasiya olunmur.',
    'Növbəti matçda rol seçimi məhdudlaşdırılır.',
    'Texniki səbəb sənədlə təsdiqlənməlidir.',
    'Təkrar hal ağırlaşdırıcı şərait sayılır.',
    'Komanda yoldaşlarının rəyi soruşulur.',
    'Üzrxahlıq halı yüngülləşdirən şərait kimi qəbul edilir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Eyni halın bir ay ərzində təkrarlanması komanda tərkibindən müvəqqəti kənarlaşdırmaya əsas verir.',
    'Qərardan narazılıq qeydə alınır, lakin nəticəyə təsir etmir.',
    'Növbəti üç matçda iştirak qərarın icrası sayılır.'
  ]
},
{
  id: 'loot-split-arayis', cat: 'gaming', tone: 'zarafat', layout: 'arayis', palette: 'gold',
  title: 'Birgə Oyun Nəticəsində Əldə Edilmiş Resursların Bölgüsü haqqında Arayış', tag: 'Bölgü',
  signOrg: 'Elektron Oyunlar üzrə Texniki Ekspertiza Mərkəzi',
  toLabel: 'Pay alan tərəf', fromLabel: 'Bölgünü aparan',
  preamble: 'Verilir {to} adlı şəxsə ondan ötrü ki, birgə oyun nəticəsində əldə edilmiş resursların bölgüsü {from} ilə birgə aparılmış, nadir əşya püşkatma yolu ilə müəyyən edilmiş və iştirakçıların heç birindən etiraz daxil olmamışdır.',
  powers: 'Resurslar iştirakçıların sayına bərabər bölünür.\nNadir əşya püşkatma yolu ilə müəyyən edilir.\nİştirak etməyən şəxsə pay ayrılmır.\nBölgü matç bitdikdən dərhal sonra aparılır.',
  penalty: 'Bölgü qaydasının pozulması halında növbəti matçda nadir əşya avtomatik olaraq zərərçəkmiş iştirakçıya verilir.',
  titleOptions: [
    'Birgə Oyun Nəticəsində Əldə Edilmiş Resursların Bölgüsü haqqında Arayış',
    'Komanda Daxilində Qənimət Bölgüsünün Qaydaları haqqında Arayış',
    'Nadir Əşyanın Kimə Çatması Məsələsi haqqında Rəsmi Arayış',
    'Resursların Bərabər Bölünməsi Prinsipi haqqında Arayış'
  ],
  powersOptions: [
    'Resurslar iştirakçıların sayına bərabər bölünür.',
    'Nadir əşya püşkatma yolu ilə müəyyən edilir.',
    'İştirak etməyən şəxsə pay ayrılmır.',
    'Bölgü matç bitdikdən dərhal sonra aparılır.',
    'Əvvəlcədən razılaşdırılmış pay dəyişdirilmir.',
    'Dublikat əşya ehtiyata götürülür.',
    'Satış gəliri ümumi qaydada bölünür.',
    'Mübahisə halında bölgü təxirə salınır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Bölgü qaydasının pozulması halında növbəti matçda nadir əşya avtomatik olaraq zərərçəkmiş iştirakçıya verilir.',
    'Arayış yalnız birgə oyunlara şamil edilir.',
    'Etiraz matçdan sonra bir gün ərzində bildirilir.'
  ]
},
{
  id: 'gg-telegram', cat: 'gaming', tone: 'zarafat', layout: 'teleqram', palette: 'ink',
  title: 'Matçın Nəticəsinin Rəsmi Qaydada Etiraf Edilməsi haqqında Teleqram', tag: 'Qısa mesaj',
  signOrg: 'Elektron Oyunlar üzrə Texniki Ekspertiza Mərkəzi',
  preamble: 'Sizə bildiririk ki, {to} adlı şəxs matçın nəticəsini şərtsiz qəbul edir və heç bir texniki səbəbə istinad etmir. {from} tərəfindən göstərilən üstünlük tam və mübahisəsiz hesab olunur.',
  powers: 'Nəticə şərtsiz qəbul edilir.\nBağlantı amilinə istinad edilmir.\nKomanda tərkibi bəhanə kimi göstərilmir.\nRevanş matçı təklif olunur.',
  penalty: 'Bu teleqram göndərildikdən sonra həmin matçla bağlı hər hansı etiraz və ya izahat qəbul edilmir.',
  titleOptions: [
    'Matçın Nəticəsinin Rəsmi Qaydada Etiraf Edilməsi haqqında Teleqram',
    'Məğlubiyyətin Şərtsiz Qəbul Edilməsi haqqında Təcili Teleqram',
    'Qarşı Tərəfin Üstünlüyünün Tanınması haqqında Teleqram',
    'Matç Nəticəsinə Etirazın Olmaması haqqında Bildiriş'
  ],
  powersOptions: [
    'Nəticə şərtsiz qəbul edilir.',
    'Bağlantı amilinə istinad edilmir.',
    'Komanda tərkibi bəhanə kimi göstərilmir.',
    'Revanş matçı təklif olunur.',
    'Qarşı tərəfin strategiyası uğurlu sayılır.',
    'Səhvlər öz üzərinə götürülür.',
    'Nəticə matç tarixçəsində saxlanılır.',
    'Təbrik dərhal bildirilir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Bu teleqram göndərildikdən sonra həmin matçla bağlı hər hansı etiraz və ya izahat qəbul edilmir.',
    'Teleqram yalnız bir matça şamil edilir.',
    'Revanş matçı ayrıca razılaşdırılır.'
  ]
},
{
  id: 'player-id', cat: 'gaming', tone: 'zarafat', layout: 'vesiqe', palette: 'ink',
  title: 'Oyunçunun Statusunu və Oyun Rejimini Təsdiq edən Vəsiqə', tag: 'Vəsiqə',
  signOrg: 'Oyun Rejimi və Ekran Vaxtı üzrə Baş İdarə',
  fromLabel: 'Vəsiqəni verən komanda',
  preamble: 'Bu vəsiqə {to} adlı şəxsin oyunçu statusunu və qüvvədə olan oyun rejimini təsdiq edir. Sənəd {from} tərəfindən verilmişdir, ev daxilində razılaşdırılmış qaydalara istinad edir və hər ay yenidən nəzərdən keçirilir.',
  powers: 'Oyun saatları əvvəlcədən razılaşdırılıb.\nFasilə hər saatdan bir verilir.\nÖhdəliklər oyundan əvvəl tamamlanır.\nAvadanlıq təyinatı üzrə işlədilir.',
  penalty: 'Vəsiqə ilə tanınan hüquqlar razılaşdırılmış öhdəliklərin icrası şərti ilə qüvvədədir; öhdəliklər pozulduqda rejim yenidən müəyyən edilir.',
  titleOptions: [
    'Oyunçunun Statusunu və Oyun Rejimini Təsdiq edən Vəsiqə',
    'Oyun Hesabının Sahibliyini Təsdiq edən Rəsmi Vəsiqə',
    'Oyunçu Statusunu və Təcrübəsini Təsbit edən Şəhadətnamə',
    'Oyun Rejimi və Fasilə Qaydasına dair Vəsiqə'
  ],
  powersOptions: [
    'Oyun saatları əvvəlcədən razılaşdırılıb.',
    'Fasilə hər saatdan bir verilir.',
    'Öhdəliklər oyundan əvvəl tamamlanır.',
    'Avadanlıq təyinatı üzrə işlədilir.',
    'Turnir günləri ayrıca planlaşdırılır.',
    'Səs həddi gecə saatlarında azaldılır.',
    'Dostların ziyarəti əvvəlcədən bildirilir.',
    'Yeni oyun alışı büdcə ilə razılaşdırılır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Vəsiqə ilə tanınan hüquqlar razılaşdırılmış öhdəliklərin icrası şərti ilə qüvvədədir; öhdəliklər pozulduqda rejim yenidən müəyyən edilir.',
    'Vəsiqə hər ay yenidən təsdiq edilir.',
    'İmtahan dövründə rejim məhdudlaşdırılır.'
  ]
},
{
  id: 'controller-authority', cat: 'gaming', tone: 'zarafat', layout: 'viza', palette: 'burgundy',
  title: 'İkinci Kontrollerdən İstifadə Növbəsinin Müəyyən Edilməsinə dair İcazə', tag: 'Kontroller',
  signOrg: 'Oyun Rejimi və Ekran Vaxtı üzrə Baş İdarə',
  powersLabel: 'SƏLAHİYYƏTİN HÜDUDLARI',
  preamble: '{from} tərəfindən {to} adlı şəxsə kontrollerdən istifadə növbəsini müəyyən etmək icazəsi verilir. İcazə hər iki iştirakçının bərabər vaxt alması şərti ilə qüvvədədir və birtərəfli dəyişdirilmir.',
  powers: 'Növbə hər üç matçdan bir dəyişdirilir.\nİşlək kontroller növbə ilə istifadə edilir.\nBatareya bitdikdə növbə dayandırılmır.\nQonaq gəldikdə növbə ona güzəşt edilir.',
  penalty: 'Növbəliliyin pozulması halında növbəti gün kontroller seçimi tam olaraq zərərçəkmiş tərəfə keçir.',
  titleOptions: [
    'İkinci Kontrollerdən İstifadə Növbəsinin Müəyyən Edilməsinə dair İcazə',
    'Kontrollerin Növbə ilə Bölüşdürülməsinə dair Xüsusi İcazə',
    'Yaxşı Kontrollerin İstifadə Qaydasına dair Məhdud İcazə',
    'Oyun Avadanlığının Növbəliliyinə dair İcazə'
  ],
  powersOptions: [
    'Növbə hər üç matçdan bir dəyişdirilir.',
    'İşlək kontroller növbə ilə istifadə edilir.',
    'Batareya bitdikdə növbə dayandırılmır.',
    'Qonaq gəldikdə növbə ona güzəşt edilir.',
    'Kontroller oyundan sonra yerinə qoyulur.',
    'Zədələnmə halı dərhal bildirilir.',
    'Yeni kontroller ümumi büdcədən alınır.',
    'Tənzimləmələr birgə razılaşdırılır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Növbəliliyin pozulması halında növbəti gün kontroller seçimi tam olaraq zərərçəkmiş tərəfə keçir.',
    'İcazə hər həftə yenidən razılaşdırılır.',
    'Avadanlığın zədələnməsi icazəni dayandırır.'
  ]
},
{
  id: 'revenge-match-treaty', cat: 'gaming', tone: 'zarafat', layout: 'ekspertiza', palette: 'burgundy',
  title: 'Revanş Matçının Təşkili Şərtlərinin Qiymətləndirilməsi haqqında Rəy', tag: 'Revanş',
  signOrg: 'Elektron Oyunlar üzrə Texniki Ekspertiza Mərkəzi',
  preamble: 'Aparılmış qiymətləndirmə nəticəsində müəyyən edilmişdir ki, {to} və {from} arasında keçirilmiş matçın nəticəsi tərəflərin real səviyyəsini tam əks etdirmir. Revanş matçının təşkili məqsədəuyğun hesab edilir.',
  powers: 'Əvvəlki matçda hesab fərqi minimal olub.\nHər iki tərəf oxşar səhvlərə yol verib.\nNəticə son dəqiqələrdə müəyyənləşib.\nRevanş üçün kifayət qədər əsas var.',
  penalty: 'Revanş matçının nəticəsi qəti hesab edilir və həmin mövzuda yeni müraciətlərə növbəti mövsümə qədər baxılmır.',
  titleOptions: [
    'Revanş Matçının Təşkili Şərtlərinin Qiymətləndirilməsi haqqında Rəy',
    'Təkrar Görüşün Keçirilməsi Zərurəti haqqında Ekspert Rəyi',
    'Əvvəlki Matçın Nəticəsinin Təhlili haqqında Yekun Rəy',
    'Revanş Tələbinin Əsaslılığının Qiymətləndirilməsinə dair Rəy'
  ],
  powersOptions: [
    'Əvvəlki matçda hesab fərqi minimal olub.',
    'Hər iki tərəf oxşar səhvlərə yol verib.',
    'Nəticə son dəqiqələrdə müəyyənləşib.',
    'Revanş üçün kifayət qədər əsas var.',
    'Matçın şərtləri əvvəlkindən fərqlənməməlidir.',
    'Tarix hər iki tərəflə razılaşdırılır.',
    'Nəticə yekun hesab edilir.',
    'Üçüncü matç yalnız bərabərlik halında keçirilir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Revanş matçının nəticəsi qəti hesab edilir və həmin mövzuda yeni müraciətlərə növbəti mövsümə qədər baxılmır.',
    'Rəy yalnız bir revanş matçına əsas verir.',
    'Matç keçirilmədikdə əvvəlki nəticə qüvvədə qalır.'
  ]
},

/* ==================== VİRAL ====================
   Anketlə doldurulan şablonlar: istifadəçi sahələri seçir, sənəd cavablardan
   qurulur. `fields` daşıyan şablonda redaktor dinamik forma göstərir; cavablar
   həm `data`/`checks`/`scale` struktur bloklarına, həm də `powers` mətninə düşür
   ki, istifadəçi dizaynı dəyişdikdə sənəd yenə oxunaqlı qalsın. */
{
  id: 'cole-cixma-vizasi', cat: 'viral', tone: 'zarafat', layout: 'viza', palette: 'steel',
  title: 'Evdən Kənara Çıxma və Müəyyən Saatadək Qayıtma Şərtli İcazəsi', tag: 'Ən çox paylaşılan',
  signOrg: 'Gündəlik Həyatın Fövqəladə Halları üzrə Komissiya',
  signTitle: 'Baş İnspektor',
  penaltyLabel: 'VİZANIN LƏĞVİ',
  preamble: '{from} tərəfindən {to} adlı şəxsə {{teyinat}} istiqamətində, {{radius}} hüdudlarında {{qayidis_vaxti}}-a qədər evdən kənara çıxmaq üçün icazə verilir. Şərtlərdən hər hansı biri pozulduqda icazə əlavə qərar tələb edilmədən avtomatik olaraq qüvvədən düşür.',
  powers: 'Hər 45 dəqiqədən bir həyat əlaməti göstərmək.\nZəngə birinci cəhddən cavab vermək.\nGöstərilən radiusdan kənara çıxmamaq.\nQayıdarkən çörək və süd gətirmək.',
  penalty: 'Üçüncü cavabsız zəng icazəni avtomatik ləğv edir. Yeni icazə ən tezi bir həftədən sonra, əvvəlki pozuntunun izahı təqdim edildikdən sonra verilir.',
  share: 'Nəhayət rəsmiləşdirdim. {{qayidis_vaxti}}-a qədər etibarlıdır 🛂',
  cancelReasons: ['Cavabsız zəng', 'Gec qayıtdı', 'Çörək gətirmədi', 'Səbəb göstərilmədi'],
  fields: [
    {
      k: "soyad_ad",
      t: "text",
      label: "Soyad, ad",
      max: 40,
      person: true,
      up: true,
      into: "to",
      row: "SOYAD, AD / SURNAME"
    },
    {
      k: "teyinat",
      t: "select",
      label: "Təyinat yeri",
      free: true,
      max: 40,
      row: "TƏYİNAT YERİ",
      opts: [
        "Çayxana",
        "Mangal",
        "Oğlanlarla görüş",
        "Toy",
        "Bir işim var",
        "Stadion"
      ]
    },
    {
      k: "cixis_vaxti",
      t: "time",
      label: "Çıxış vaxtı",
      def: "now",
      row: "QÜVVƏYƏ MİNİR"
    },
    {
      k: "qayidis_vaxti",
      t: "time",
      label: "Qayıdış vaxtı",
      def: "+3h",
      expiry: true,
      row: "QÜVVƏDƏN DÜŞÜR",
      hint: "Vizanın etibarlılıq müddəti bu saatdan hesablanır."
    },
    {
      k: "giris_sayi",
      t: "select",
      label: "Giriş sayı",
      opts: [
        "01",
        "02",
        "MULTI"
      ],
      row: "GİRİŞ SAYI"
    },
    {
      k: "radius",
      t: "select",
      label: "İcazə verilən radius",
      row: "ETİBARLIDIR",
      opts: [
        "Məhəllə",
        "Şəhər daxili",
        "Bakıdan kənar",
        "Limitsiz"
      ]
    },
    {
      k: "icaze_veren",
      t: "select",
      label: "İcazəni verən",
      into: "from",
      row: "VERƏN ORQAN",
      opts: [
        "Həyat yoldaşı",
        "Ana",
        "Qaynana",
        "Kollektiv qərar"
      ]
    },
    {
      k: "musayiet",
      t: "text",
      label: "Müşayiət edən şəxslər",
      max: 60,
      opt: true,
      row: "MÜŞAYİƏT"
    }
  ],
  notes: [
    'Viza sahibi hər 45 dəqiqədən bir həyat əlaməti göstərməyə — mesaj yazmağa və ya zəngə cavab verməyə borcludur.',
    'Zəngə ikinci cəhddən sonra cavab verilməsi pozuntu sayılır; üçüncü cavabsız zəng vizanın ləğvinə səbəb olur.',
    'Mesaja «görüldü» qoyulub cavab yazılmaması ağırlaşdırıcı hal hesab edilir.',
    'Qayıdış zamanı çörək və süd gətirilməsi vizanın ayrılmaz şərtidir.',
    '{{radius}} hüdudlarından kənara çıxmaq ayrıca yazılı razılıq tələb edir.',
    'Müddətin uzadılması yalnız birinci zəngə cavab verilməklə mümkündür.',
    'Story paylaşılması halında viza sahibinin yeri açıqlanmış sayılır.'
  ]
},
{
  id: 'hesab-davasi-qalibi', cat: 'viral', tone: 'zarafat', layout: 'sertifikat', palette: 'forest',
  title: 'Süfrə Hesabı üzrə Mübahisədə Qalibiyyətin Təsdiqi haqqında Sertifikat', tag: 'Süfrə arbitrajı',
  signOrg: 'Süfrə Mübahisələri üzrə Arbitraj Kollegiyası',
  signTitle: 'Sədr',
  powersLabel: 'SERTİFİKATIN ŞƏRTLƏRİ',
  preamble: 'Bununla təsdiq edilir ki, {{tarix}} tarixində {{mekan}} ünvanında baş vermiş hesab mübahisəsində {to} adlı şəxs qalib gəlmiş və {{mebleg}} AZN məbləğində öhdəliyi könüllü surətdə öz üzərinə götürmüşdür. Qələbə üsulu: {{usul}}.',
  powers: 'Növbəti süfrədə ödəniş öhdəliyi məğlub tərəfə keçir.\nQalib altı ay ərzində bu sənədə istinad edə bilər.\nSertifikat yalnız hesabı faktiki ödəmiş şəxsə verilir.\nHesabın bölünməsi sertifikatı qüvvədən salır.',
  penalty: 'Ödənişin faktiki olaraq bölündüyü aşkarlandıqda sertifikat qüvvədən düşür və mübahisə yenidən açıq elan edilir.',
  share: 'Mübahisə bitdi, sənəd əldədir. Növbəti dəfə siz 🧾',
  fields: [
    {
      k: "qalib",
      t: "text",
      label: "Qalib",
      max: 40,
      person: true,
      into: "to",
      row: "QALİB"
    },
    {
      k: "meglublar",
      t: "list",
      label: "Məğlub tərəflər",
      max: 40,
      count: 4,
      row: "MƏĞLUB TƏRƏFLƏR",
      hint: "Ən çoxu dörd ad."
    },
    {
      k: "mekan",
      t: "text",
      label: "Məkan",
      max: 40,
      row: "MƏKAN"
    },
    {
      k: "mebleg",
      t: "number",
      label: "Məbləğ",
      min: 1,
      max: 999,
      def: 60,
      unit: "AZN",
      row: "MƏBLƏĞ"
    },
    {
      k: "usul",
      t: "select",
      label: "Qələbə üsulu",
      row: "QƏLƏBƏ ÜSULU",
      opts: [
        "Ofisianta əvvəlcədən xəbərdarlıq edilmişdi",
        "Kart əl altında hazır saxlanılmışdı",
        "Tualetə gedib ödənilmişdir",
        "«Mən böyüyəm» arqumenti tətbiq edilmişdir",
        "Fiziki üstünlük",
        "Qarşı tərəf ayaqqabısını bağlayırdı"
      ]
    },
    {
      k: "tarix",
      t: "date",
      label: "Tarix",
      row: "TARİX"
    },
    {
      k: "kollegiya",
      t: "text",
      label: "Kollegiya",
      auto: "Arbitraj Kollegiyası",
      into: "from"
    }
  ],
  notes: [
    'MƏĞLUB TƏRƏFLƏR: {{meglublar}}.',
    'Növbəti süfrədə ödəniş öhdəliyi avtomatik olaraq məğlub tərəflərin üzərinə düşür və mübahisə predmeti sayılmır.',
    'Qalibin bu sertifikata istinad hüququ altı ay qorunur; həmin müddətdə məğlub tərəflər etiraz edə bilməz.',
    'Sertifikat yalnız hesabı faktiki ödəmiş şəxsə verilir. «Mən çıxaracam» deyib əl atmayan şəxs qalib sayılmır.',
    'Ödənişin bölünməsi halında sertifikat qüvvədən düşür.'
  ]
},
{
  id: 'gorduldu-arayisi', cat: 'viral', tone: 'zarafat', layout: 'arayis', palette: 'ink',
  title: 'Mesajın Oxunduğu, Lakin Cavablandırılmadığı Halın Təsdiqi haqqında Arayış', tag: 'Cavab toxunulmazlığı',
  signOrg: 'Rəqəmsal Ünsiyyət və Susqunluq Departamenti',
  signTitle: 'Şöbə müdiri',
  preamble: 'Verilir {to} adlı şəxsə ondan ötrü ki, {from} tərəfindən {{mesaj_tarixi}} tarixində göndərilmiş {{mesaj_novu}} mesaj oxunmuş, lakin cavablandırılmamışdır. Səbəb kimi göstərilir: «{{sebeb}}». Adıçəkilən şəxsə {{susqunluq_saat}} saat cavab toxunulmazlığı verilir.',
  powers: 'Toxunulmazlıq «onlayn» görünmə halında da qüvvədədir.\nSosial şəbəkədə paylaşım arayışı dərhal qüvvədən salır.\nEyni şəxsə ayda iki dəfədən artıq verilmir.\n«Telefonum söndü» izahatı ilə birlikdə işlədilmir.',
  penalty: 'Toxunulmazlıq müddəti bitdikdən sonra cavab yazılmazsa, arayış qüvvədən düşür və sonradan təqdim edilən izahat qəbul edilmir.',
  share: 'Sənədim var, {{susqunluq_saat}} saat mənə toxunmaq olmaz ✓✓',
  cancelReasons: ['Story paylaşdı', 'Onlayn göründü', 'Cavab yazdı', 'Səbəb göstərilmədi'],
  fields: [
    {
      k: "ad",
      t: "text",
      label: "Arayış verilən",
      max: 40,
      person: true,
      into: "to",
      row: "ARAYIŞ VERİLİR"
    },
    {
      k: "qarsi_teref",
      t: "text",
      label: "Mesajı göndərən",
      max: 40,
      person: true,
      into: "from",
      row: "GÖNDƏRƏN"
    },
    {
      k: "mesaj_tarixi",
      t: "datetime",
      label: "Mesajın vaxtı",
      row: "MESAJIN VAXTI"
    },
    {
      k: "mesaj_novu",
      t: "select",
      label: "Mesajın növü",
      row: "MESAJIN NÖVÜ",
      opts: [
        "Yazılı",
        "Səsli",
        "Şəkil",
        "Link",
        "«Salam» (tək söz)"
      ]
    },
    {
      k: "susqunluq_saat",
      t: "number",
      label: "Toxunulmazlıq müddəti",
      min: 1,
      max: 72,
      def: 24,
      unit: "saat",
      row: "TOXUNULMAZLIQ",
      expiry: "hours",
      hint: "Arayışın etibarlılıq müddəti bu saatdan hesablanır."
    },
    {
      k: "sebeb",
      t: "select",
      label: "Səbəb",
      row: "GÖSTƏRİLƏN SƏBƏB",
      opts: [
        "Cavab yazacaqdım, sonra unutdum",
        "Fikirləşirdim",
        "Nə yazacağımı bilmədim",
        "Səsli mesaj idi, əlverişli şərait olmadı",
        "Elə bir şey deyildi ki cavab verim",
        "Əlim dolu idi"
      ]
    }
  ],
  notes: [
    'Toxunulmazlıq şəxsin «onlayn» görünməsi halında da qüvvədədir.',
    'Story və ya status paylaşılması işbu arayışı dərhal qüvvədən salır.',
    'Arayış eyni şəxsə qarşı ayda iki dəfədən artıq verilmir.',
    '«Yazacaqdım, telefonum söndü» izahatı ilə birlikdə istifadə edilə bilməz.'
  ]
},
{
  id: 'bot-kimi-oynayir', cat: 'viral', tone: 'zarafat', layout: 'ekspertiza', palette: 'forest',
  title: 'Oyun Tərzinin Süni İntellekt Davranışından Fərqləndirilməsi haqqında Rəy', tag: 'Texniki ekspertiza',
  signOrg: 'Elektron Oyunlar üzrə Texniki Ekspertiza Mərkəzi',
  signTitle: 'Baş ekspert',
  penaltyLabel: 'NƏTİCƏ',
  preamble: 'Aparılmış texniki müşahidə nəticəsində {to} adlı şəxsin {{oyun}} oyunundakı tərzinin süni intellekt davranışından fərqləndirilməsi mümkün olmamışdır. Rəy {from} tərəfindən verilmiş müraciət əsasında tərtib edilmişdir. Zəiflik dərəcəsi: {{zeiflik}}/10.',
  powers: 'Eyni hərəkəti dövri olaraq təkrarlayır.\nUduzduqda internet bağlantısına istinad edir.\nKomanda yoldaşını günahlandırır.\n«Bir dəfə də» deyib altı dəfə oynayır.',
  penalty: 'Turinq testi keçilməmişdir. Çətinlik səviyyəsinin aşağı salınması və məşq rejiminin bərpası məqsədəuyğun hesab edilir.',
  share: 'Rəsmi ekspertiza hazırdır. Zəiflik dərəcəsi {{zeiflik}}/10 🤖',
  fields: [
    {
      k: "ad",
      t: "text",
      label: "Ekspertizadan keçən",
      max: 40,
      person: true,
      into: "to",
      row: "BARƏSİNDƏ"
    },
    {
      k: "oyun",
      t: "select",
      label: "Oyun",
      free: true,
      max: 24,
      row: "OYUN",
      opts: [
        "FIFA",
        "PES",
        "CS",
        "PUBG",
        "Dota",
        "Valorant",
        "Nərd",
        "Domino",
        "Şahmat"
      ]
    },
    {
      k: "si_seviyye",
      t: "select",
      label: "Süni intellekt səviyyəsi",
      row: "SÜNİ İNTELLEKT SƏVİYYƏSİ",
      opts: [
        "Amatyor",
        "Yarı-professional",
        "Professional",
        "Əfsanəvi"
      ]
    },
    {
      k: "davranislar",
      t: "multi",
      label: "Aşkarlanmış davranış əlamətləri",
      min: 2,
      max: 5,
      def: [
        "Eyni hərəkəti dövri olaraq təkrarlayır",
        "Küncdə dayanıb gözləyir"
      ],
      opts: [
        "Eyni hərəkəti dövri olaraq təkrarlayır",
        "Yalnız bir komanda seçir",
        "Avtomatik müdafiə ilə oynayır",
        "Qapıçı ilə top saxlayır",
        "Küncdə dayanıb gözləyir",
        "Uduzduqda internet bağlantısına istinad edir",
        "Uduzduqda pultu yerə qoyur",
        "«Bir dəfə də» deyib altı dəfə oynayır",
        "Komanda yoldaşını günahlandırır",
        "Mikrofona ağır nəfəs alır"
      ]
    },
    {
      k: "zeiflik",
      t: "scale",
      label: "Zəiflik dərəcəsi",
      min: 1,
      max: 10,
      def: 7
    },
    {
      k: "ekspert",
      t: "text",
      label: "Ekspert",
      auto: "Baş ekspert",
      into: "from",
      row: "EKSPERT"
    }
  ]
},
{
  id: 'immunitet-vesiqesi', cat: 'viral', tone: 'zarafat', layout: 'lisenziya', palette: 'burgundy',
  title: 'Ailə Yığıncaqlarında Şəxsi Suallara Cavab Verməmək Hüququnun Vəsiqəsi', tag: 'Toy mövsümü',
  signOrg: 'Subaylıq Hüquqlarının Müdafiəsi üzrə Komissiya',
  signTitle: 'Komissiya sədri',
  powersLabel: 'İMMUNİTETİN ƏHATƏ ETDİYİ SUALLAR',
  preamble: '{from} tərəfindən {to} adlı şəxsə ({{yas}} yaş) toy, nişan, elçilik və qohum yığıncaqlarında müəyyən suallara cavab verməkdən imtina etmək hüququ verilir. Vəsiqə {{muddet}} müddətinə etibarlıdır və süfrə arxasında da qüvvədə hesab edilir.',
  powers: 'Sualı eşitməmiş kimi davranmaq hüququ tanınır.\nMövzunu nəzakətsizlik sayılmadan dəyişmək icazəlidir.\nSual verəndən bir qutu şirniyyat tələb edilə bilər.\nİstisna: immunitet nənə və babalara şamil edilmir.',
  penalty: '«Mən sənin xeyrini istəyirəm» ifadəsi vəsiqəni qüvvədən salmır. Vəsiqə yalnız göstərilən müddət başa çatdıqda etibarsız hesab edilir.',
  share: 'Bu mövsüm mənə sual yoxdur, sənədim var 🛡️',
  fields: [
    {
      k: "ad_soyad",
      t: "text",
      label: "Ad, soyad",
      max: 40,
      person: true,
      into: "to",
      row: "VƏSİQƏ SAHİBİ"
    },
    {
      k: "yas",
      t: "number",
      label: "Yaş",
      min: 16,
      max: 99,
      def: 27,
      opt: true,
      row: "YAŞ"
    },
    {
      k: "muddet",
      t: "select",
      label: "Etibarlılıq müddəti",
      row: "ETİBARLIDIR",
      opts: [
        "1 toy mövsümü",
        "6 ay",
        "1 il",
        "Novruza qədər"
      ]
    },
    {
      k: "qorunan_suallar",
      t: "multi",
      label: "Qorunan suallar",
      min: 2,
      max: 5,
      def: [
        "«Sənə də qismət olsun»",
        "«Yaşın keçir ha»"
      ],
      opts: [
        "«Sənə də qismət olsun»",
        "«Nə vaxt sənin toyunda oynayacağıq?»",
        "«Yaşın keçir ha»",
        "«Bir tanışım var, çox yaxşı ailədəndir»",
        "«Bizim vaxtımızda bu yaşda iki uşağımız vardı»",
        "«Anan yazıq nə vaxta qədər gözləsin?»",
        "«Seçici olma da bir az»"
      ]
    },
    {
      k: "istisna",
      t: "text",
      label: "İstisna şəxslər",
      auto: "Nənə, baba",
      row: "İSTİSNA"
    },
    {
      k: "komissiya",
      t: "text",
      label: "Verən orqan",
      auto: "Subaylıq Hüquqları Komissiyası",
      into: "from"
    }
  ]
},
{
  id: 'etiraz-erizesi', cat: 'viral', tone: 'zarafat', layout: 'qerar', palette: 'ink',
  title: 'Oyun Hesabından Üçüncü Şəxsin İstifadə Etməsi haqqında Qərar', tag: 'Cavab sənədi',
  signOrg: 'Virtual Oyun Nəticələrinə Etirazlar üzrə Şura',
  preamble: 'Şura {to} adlı şəxsin müraciətinə baxaraq müəyyən etmişdir ki, göstərilən vaxt aralığında oyun hesabından üçüncü şəxsin istifadə etməsi ehtimalı tam istisna edilmir. {from} tərəfindən təqdim edilmiş ekspertiza rəyinə etiraz qismən əsaslı hesab olunur.',
  powers: 'Hesabın üçüncü şəxsə verilməsi sübut edilməlidir.\nÜçüncü şəxsin yaşı və oyun stajı ayrıca göstərilir.\nEkran görüntüsü müstəqil sübut sayılmır.\nEtiraz eyni matç üzrə bir dəfə verilə bilər.',
  penalty: 'Etiraz təkrarlandıqda ekspertiza rəyi qəti qüvvəyə minir və zəiflik dərəcəsi bir bal artırılır.',
  titleOptions: [
    'Oyun Hesabından Üçüncü Şəxsin İstifadə Etməsi haqqında Qərar',
    'Ekspertiza Rəyinə Etirazın Qismən Təmin Edilməsi haqqında Qərar',
    'Oyun Nəticəsinin Yenidən Qiymətləndirilməsi haqqında Qətnamə',
    'Hesabın Müvəqqəti Olaraq Başqasına Verildiyinin Tanınması haqqında Qərar'
  ],
  powersOptions: [
    'Hesabın üçüncü şəxsə verilməsi sübut edilməlidir.',
    'Üçüncü şəxsin yaşı və oyun stajı ayrıca göstərilir.',
    'Ekran görüntüsü müstəqil sübut sayılmır.',
    'Etiraz eyni matç üzrə bir dəfə verilə bilər.',
    'Şahid ifadəsi yalnız oyunda iştirak etməyən şəxsdən qəbul edilir.',
    'Bağlantı jurnalı tələb olunduqda təqdim edilir.',
    'Etirazın baxılma müddəti üç gündür.',
    'Təkrar matç təklifi etirazı əvəz edə bilər.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Etiraz təkrarlandıqda ekspertiza rəyi qəti qüvvəyə minir və zəiflik dərəcəsi bir bal artırılır.',
    'Etiraz təmin edilmədikdə nəticə dəyişdirilmədən qüvvədə saxlanılır.',
    'Sübut təqdim edilmədikdə etirazın baxılması dayandırılır.'
  ]
},
{
  id: 'yuxu-rejimi-vesiqesi', cat: 'viral', tone: 'zarafat', layout: 'vesiqe', palette: 'steel',
  title: 'Səhər Saatlarında Oyanma Hüdudlarının Müəyyən Edilməsinə dair Vəsiqə', tag: 'Səhər toxunulmazlığı',
  signOrg: 'Gecə Saatları üzrə Xüsusi Tənzimləmə İdarəsi',
  preamble: 'Bu vəsiqə {to} adlı şəxsin gecə rejimini və səhər oyanma hüdudlarını təsdiq edir. Sənəd {from} tərəfindən uzunmüddətli müşahidə və nəticəsiz oyatma cəhdlərindən sonra rəsmiləşdirilmişdir. Vəsiqə iş və dərs günlərinə şamil edilmir.',
  powers: 'Səhər saat 10:00-a qədər dinclik hüququ tanınır.\nİkinci zəngdən sonra oyanmaq öhdəliyi yaranır.\n«Beş dəqiqə də» hüququ gündə iki dəfə tətbiq edilir.\nHəftəsonu rejim tamamilə dayandırılır.',
  penalty: 'Vəsiqə sahibi işə və ya dərsə gecikdikdə bu sənədə istinad edə bilməz; həmin hal ayrıca qeydə alınır.',
  titleOptions: [
    'Səhər Saatlarında Oyanma Hüdudlarının Müəyyən Edilməsinə dair Vəsiqə',
    'Gecə Rejimi və Səhər Dincliyi Hüququnu Təsdiq edən Vəsiqə',
    'Oyatma Cəhdlərinin Sayına Məhdudiyyət Qoyulmasına dair Vəsiqə',
    'Həftəsonu Yuxu Rejiminin Sərbəst Müəyyən Edilməsinə dair Vəsiqə'
  ],
  powersOptions: [
    'Səhər saat 10:00-a qədər dinclik hüququ tanınır.',
    'İkinci zəngdən sonra oyanmaq öhdəliyi yaranır.',
    '«Beş dəqiqə də» hüququ gündə iki dəfə tətbiq edilir.',
    'Həftəsonu rejim tamamilə dayandırılır.',
    'Pərdənin açılması oyatma cəhdi sayılır.',
    'Səhər söhbətinə ilk on dəqiqə ərzində başlanılmır.',
    'Qəhvə hazır olmadan sual verilmir.',
    'Gecə yarısından sonra yatma halı izahat tələb etmir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Vəsiqə sahibi işə və ya dərsə gecikdikdə bu sənədə istinad edə bilməz; həmin hal ayrıca qeydə alınır.',
    'Üç ardıcıl gecikmə vəsiqənin yenidən baxılmasına əsas verir.',
    'Vəsiqə səfər və bayram günlərində qüvvədə saxlanılır.'
  ]
},
{
  id: 'story-izleme-muqavilesi', cat: 'viral', tone: 'zarafat', layout: 'muqavile', palette: 'gold',
  title: 'Sosial Şəbəkədə Paylaşımlara Reaksiyanın Qaydaları üzrə Müqavilə', tag: 'Rəqəmsal etiket',
  signOrg: 'Rəqəmsal Ünsiyyət və Susqunluq Departamenti',
  preamble: 'Tərəflərin mövqeyi nəzərə alınmaqla, {from} və {to} arasında sosial şəbəkədə paylaşımlara baxış və reaksiya qaydaları barədə razılıq əldə edilmişdir. Müqavilə hər iki tərəfin hesablarına bərabər şəkildə şamil olunur.',
  powers: 'Paylaşıma baxış avtomatik reaksiya öhdəliyi yaratmır.\nBaxış siyahısında görünmə izahat tələb etmir.\nReaksiya verilməməsi münasibətin göstəricisi sayılmır.\nPaylaşımın ekran görüntüsü üçüncü şəxsə ötürülmür.',
  penalty: 'Müqavilənin şərtləri pozulduqda pozuntuya yol vermiş tərəf növbəti birgə şəklin seçimi hüququndan bir ay müddətinə məhrum edilir.',
  titleOptions: [
    'Sosial Şəbəkədə Paylaşımlara Reaksiyanın Qaydaları üzrə Müqavilə',
    'Paylaşımlara Baxış və Cavab Reaksiyası üzrə Qarşılıqlı Saziş',
    'Rəqəmsal Etiket Qaydalarının Müəyyən Edilməsi üzrə Müqavilə',
    'Baxış Siyahısında Görünmə Halının Tənzimlənməsi üzrə Saziş'
  ],
  powersOptions: [
    'Paylaşıma baxış avtomatik reaksiya öhdəliyi yaratmır.',
    'Baxış siyahısında görünmə izahat tələb etmir.',
    'Reaksiya verilməməsi münasibətin göstəricisi sayılmır.',
    'Paylaşımın ekran görüntüsü üçüncü şəxsə ötürülmür.',
    'Arxiv paylaşımlara reaksiya müddəti məhdudlaşdırılmır.',
    'Səhv qoyulmuş reaksiya bir dəqiqə ərzində geri götürülə bilər.',
    'Birgə şəkil paylaşılmazdan əvvəl razılıq alınır.',
    'Gecə yarısından sonrakı paylaşımlar müzakirə edilmir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Müqavilənin şərtləri pozulduqda pozuntuya yol vermiş tərəf növbəti birgə şəklin seçimi hüququndan bir ay müddətinə məhrum edilir.',
    'Pozuntu halında paylaşım qaydaları yenidən razılaşdırılır.',
    'Müqavilə yalnız hər iki tərəfin razılığı ilə ləğv edilir.'
  ]
},
{
  id: 'qrup-cati-fermani', cat: 'viral', tone: 'zarafat', layout: 'blank', palette: 'steel',
  title: 'Qrup Söhbətində Bildirişlərin Söndürülməsi Hüququna dair Bəyannamə', tag: 'Bildirişlər',
  signOrg: 'Rəqəmsal Ünsiyyət və Susqunluq Departamenti',
  preamble: 'Daxil olmuş müraciətə baxılaraq bildirilir ki, {to} adlı şəxs qrup söhbətindəki bildirişlərin söndürülməsi hüququndan istifadə edir. {from} tərəfindən bu qərarın qrupdan çıxmaq niyyəti kimi şərh edilməyəcəyi barədə təminat verilmişdir.',
  powers: 'Bildirişlərin söndürülməsi qrupu tərk etmək sayılmır.\nOxunmamış mesajların sayı izahat tələb etmir.\nBirbaşa müraciət olunarsa cavab verilir.\nQrup şəklinin dəyişdirilməsi müzakirə edilmir.',
  penalty: 'Təcili hesab edilən məsələ üzrə birbaşa müraciət olunduqda bu bəyannamə həmin gün ərzində qüvvədən düşür.',
  titleOptions: [
    'Qrup Söhbətində Bildirişlərin Söndürülməsi Hüququna dair Bəyannamə',
    'Qrup Söhbətinə Cavab Verməmək Hüququnun Bəyan Edilməsi haqqında Sənəd',
    'Bildiriş Axınının Məhdudlaşdırılması haqqında Rəsmi Bildiriş',
    'Qrupdan Səssiz Rejimə Keçidin Rəsmiləşdirilməsi haqqında Bəyannamə'
  ],
  powersOptions: [
    'Bildirişlərin söndürülməsi qrupu tərk etmək sayılmır.',
    'Oxunmamış mesajların sayı izahat tələb etmir.',
    'Birbaşa müraciət olunarsa cavab verilir.',
    'Qrup şəklinin dəyişdirilməsi müzakirə edilmir.',
    'Səhər salamlaşmasına ayrıca cavab tələb olunmur.',
    'Yönləndirilmiş mesajlar reaksiya öhdəliyi yaratmır.',
    'Səsli mesajın dinlənilmə müddəti məhdudlaşdırılmır.',
    'Qrupdan çıxış barədə qərar əvvəlcədən bildirilir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Təcili hesab edilən məsələ üzrə birbaşa müraciət olunduqda bu bəyannamə həmin gün ərzində qüvvədən düşür.',
    'Bir həftə tam susqunluq halında bəyannaməyə yenidən baxılır.',
    'Bəyannamə iş qruplarına şamil edilmir.'
  ]
},
{
  id: 'gecikme-diplomu', cat: 'viral', tone: 'zarafat', layout: 'diplom', palette: 'gold',
  title: 'Görüş Vaxtının Sistemli Şəkildə Uzadılması Sahəsində Fəxri Diplom', tag: 'Fəxri ad',
  signOrg: 'Sosial Öhdəliklərin Qeydiyyatı üzrə Baş İdarə',
  preamble: 'Uzunmüddətli müşahidə nəticəsində müəyyən edilmişdir ki, {to} adlı şəxs görüş vaxtını sistemli şəkildə uzatmaq sahəsində sabit nəticələr göstərmişdir. Diplom {from} tərəfindən, heç bir gecikmənin təsadüfi olmadığı qənaəti ilə təqdim olunur.',
  powers: '«Beş dəqiqəyə çatıram» ifadəsini yolda deyil, evdə səsləndirmək.\nGecikmənin səbəbini hər dəfə yeni formada təqdim etmək.\nGörüş yerinə çatanda heç bir izahat verməmək.\nBaşqasının gecikməsini qeyd etmək hüququ.',
  penalty: 'Diplom geri alınmır. Lakin sahibi bir dəfə vaxtında gəldikdə bu hal istisna kimi qeydə alınır və diplomun qüvvəsinə təsir göstərmir.',
  titleOptions: [
    'Görüş Vaxtının Sistemli Şəkildə Uzadılması Sahəsində Fəxri Diplom',
    'Gecikmə Sahəsində Uzunmüddətli Nəticələrə Görə Fəxri Diplom',
    '«Beş dəqiqəyə çatıram» İfadəsinin Ustalıqla İşlədilməsinə Görə Diplom',
    'Vaxt Anlayışına Fərdi Yanaşmaya Görə Verilmiş Fəxri Diplom'
  ],
  powersOptions: [
    '«Beş dəqiqəyə çatıram» ifadəsini yolda deyil, evdə səsləndirmək.',
    'Gecikmənin səbəbini hər dəfə yeni formada təqdim etmək.',
    'Görüş yerinə çatanda heç bir izahat verməmək.',
    'Başqasının gecikməsini qeyd etmək hüququ.',
    'Taksinin gec gəlməsi arqumentini ilin istənilən fəslində işlətmək.',
    'Görüş saatını təyin edərkən özünə iyirmi dəqiqə ehtiyat saxlamaq.',
    'Restorana ilk gələnin masa seçməsinə razı olmaq.',
    'Təcili hallarda vaxtında gəlmək bacarığını nümayiş etdirmək.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Diplom geri alınmır. Lakin sahibi bir dəfə vaxtında gəldikdə bu hal istisna kimi qeydə alınır və diplomun qüvvəsinə təsir göstərmir.',
    'Diplom yalnız qeyri-rəsmi görüşlərə şamil edilir.',
    'Ardıcıl üç dəfə vaxtında gəlmək diplomun yenidən baxılmasına əsasdır.'
  ]
},
{
  id: 'internet-teleqrami', cat: 'viral', tone: 'zarafat', layout: 'teleqram', palette: 'ink',
  title: 'Oyun Zamanı Bağlantının Kəsilməsi Halı haqqında Təcili Xəbərdarlıq', tag: 'Təcili bildiriş',
  signOrg: 'Virtual Futbol Bəhanələri üzrə Ali Komissiya',
  preamble: 'Sizə bildiririk ki, {to} adlı şəxsin iştirak etdiyi oyun zamanı internet bağlantısının kəsilməsi halı qeydə alınmışdır. {from} tərəfindən nəticənin qüvvədə saxlanılması tələb edilsə də, məsələ üzrə əlavə araşdırma aparılması zəruri hesab edilir.',
  powers: 'Bağlantının kəsilmə vaxtı dəqiqliklə göstərilir.\nNəticə araşdırma başa çatanadək qüvvədə saxlanılır.\nTəkrar matç yalnız qarşılıqlı razılıqla təşkil edilir.\nModemin yenidən işə salınması sübut sayılmır.',
  penalty: 'Bağlantı problemi eyni oyunçu tərəfindən üç dəfə göstərildikdə bu arqument sonrakı matçlarda nəzərə alınmır.',
  titleOptions: [
    'Oyun Zamanı Bağlantının Kəsilməsi Halı haqqında Təcili Xəbərdarlıq',
    'İnternet Bağlantısının Qeyri-sabitliyi haqqında Təcili Teleqram',
    'Matçın Yarımçıq Dayandırılmasının Səbəbi haqqında Xəbərdarlıq',
    'Bağlantı Problemi ilə Əlaqədar Nəticənin Etibarsızlığı haqqında Teleqram'
  ],
  powersOptions: [
    'Bağlantının kəsilmə vaxtı dəqiqliklə göstərilir.',
    'Nəticə araşdırma başa çatanadək qüvvədə saxlanılır.',
    'Təkrar matç yalnız qarşılıqlı razılıqla təşkil edilir.',
    'Modemin yenidən işə salınması sübut sayılmır.',
    'Sürət ölçmə nəticəsi əlavə sənəd kimi qəbul edilir.',
    'Eyni bəhanə ayda iki dəfədən artıq irəli sürülmür.',
    'Ev internetinin ümumi vəziyyəti nəzərə alınır.',
    'Qonşunun şəbəkəsindən istifadə halı ayrıca qeyd edilir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Bağlantı problemi eyni oyunçu tərəfindən üç dəfə göstərildikdə bu arqument sonrakı matçlarda nəzərə alınmır.',
    'Araşdırma nəticəsində səbəb təsdiqlənməzsə, nəticə qəti qüvvəyə minir.',
    'Xəbərdarlıq qeydə alınır və növbəti matçda nəzərə alınır.'
  ]
},
{
  id: 'soz-verme-akti', cat: 'viral', tone: 'zarafat', layout: 'notarial', palette: 'burgundy',
  title: 'Verilmiş Vədin İcra Edilməməsi Halının Qeydə Alınması haqqında Akt', tag: 'Söz verib gəlmədi',
  signOrg: 'Sosial Öhdəliklərin Qeydiyyatı üzrə Baş İdarə',
  preamble: 'İş üzrə toplanmış məlumatlara əsasən müəyyən edilmişdir ki, {to} adlı şəxs {from} tərəfindən təşkil edilmiş tədbirdə iştirak edəcəyini şifahi qaydada bildirmiş, lakin öhdəliyi yerinə yetirməmişdir. Hal bu aktla qeydə alınır.',
  powers: 'Vəd şahidlərin iştirakı ilə verilmişdir.\nİştirakdan imtina barədə əvvəlcədən məlumat verilməmişdir.\nTəqdim edilən səbəb sənədlə təsdiqlənməmişdir.\nEyni hal son üç ayda ikinci dəfə baş vermişdir.',
  penalty: 'Aktın tərtib edilməsindən sonra növbəti tədbirin yeri və vaxtı tam olaraq zərərçəkmiş tərəf tərəfindən müəyyən edilir.',
  titleOptions: [
    'Verilmiş Vədin İcra Edilməməsi Halının Qeydə Alınması haqqında Akt',
    'Gəlmə Vədinin Yerinə Yetirilməməsi haqqında Rəsmi Akt',
    'Şifahi Öhdəliyin Pozulması Halının Təsbit Edilməsi haqqında Akt',
    '«Mütləq gələcəyəm» İfadəsinin İcra Statusuna dair Akt'
  ],
  powersOptions: [
    'Vəd şahidlərin iştirakı ilə verilmişdir.',
    'İştirakdan imtina barədə əvvəlcədən məlumat verilməmişdir.',
    'Təqdim edilən səbəb sənədlə təsdiqlənməmişdir.',
    'Eyni hal son üç ayda ikinci dəfə baş vermişdir.',
    'Tədbirin təşkilində sənəd sahibinin payı nəzərə alınmışdır.',
    'Yerin əvvəlcədən sifariş edildiyi müəyyən edilmişdir.',
    'Xəbərdarlıq mesajı cavabsız qalmışdır.',
    'Sonradan verilən izahat araşdırmaya daxil edilmişdir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Aktın tərtib edilməsindən sonra növbəti tədbirin yeri və vaxtı tam olaraq zərərçəkmiş tərəf tərəfindən müəyyən edilir.',
    'Üçüncü hal qeydə alındıqda dəvət siyahısı yenidən nəzərdən keçirilir.',
    'Akt könüllü qonaqlıq təşkil edilməsi ilə qüvvədən salına bilər.'
  ]
},

/* ==================== QARALAMALAR (deaktiv) ====================
   `active: false` — bazaya deaktiv yazılır, `/api/catalog`-a düşmür və `dist`
   rejimində süzülür. Admin panelindən bir kliklə açılır. Struktur sayımına
   (216 · hər kateqoriyada 12 · 12 dizayn) daxil deyil. */
{
  id: 'hec-ne-olmayib', cat: 'couples', tone: 'zarafat', layout: 'arayis', palette: 'ink', active: false,
  title: '«Heç nə olmayıb» İfadəsinin Həqiqətə Uyğunluğunun Yoxlanılması haqqında Arayış', tag: '«Yaxşıyam»',
  signOrg: 'Məişət Mübahisələri üzrə Arbitraj Kollegiyası',
  preamble: 'Verilir {to} adlı şəxsə ondan ötrü ki, {from} tərəfindən verilmiş müraciət əsasında «heç nə olmayıb» ifadəsinin həqiqətə uyğunluğu yoxlanılmışdır. Səs tonu, cavab müddəti və göz təması qiymətləndirməyə daxil edilmişdir.',
  powers: 'İfadənin tam təsdiqi üçün kifayət qədər əsas müəyyən edilməmişdir.\nSəs tonundakı dəyişiklik ayrıca hal kimi qeydə alınmışdır.\n«Sonra danışarıq» ifadəsi məsələnin bağlanması sayılmır.\nCavabın orta müddəti adi göstəricidən üç dəfə uzundur.',
  penalty: 'Araşdırma o vaxta qədər açıq qalır ki, tərəflərdən biri məsələni öz təşəbbüsü ilə izah etsin. Bu müddətdə «mən yaxşıyam» ifadəsinə istinad edilə bilməz.',
  titleOptions: [
    '«Heç nə olmayıb» İfadəsinin Həqiqətə Uyğunluğunun Yoxlanılması haqqında Arayış',
    '«Yaxşıyam» Cavabının Etibarlılıq Dərəcəsi haqqında Arayış',
    'Səs Tonundakı Dəyişikliyin Qeydə Alınması haqqında Arayış',
    'Cavabsız Qalmış Sualın Statusu haqqında Rəsmi Arayış'
  ],
  powersOptions: [
    'İfadənin tam təsdiqi üçün kifayət qədər əsas müəyyən edilməmişdir.',
    'Səs tonundakı dəyişiklik ayrıca hal kimi qeydə alınmışdır.',
    '«Sonra danışarıq» ifadəsi məsələnin bağlanması sayılmır.',
    'Cavabın orta müddəti adi göstəricidən üç dəfə uzundur.',
    'Telefonun ekranına baxma tezliyi artmışdır.',
    'Sual iki dəfə təkrarlanmış, cavab dəyişməmişdir.',
    'Otaqdan çıxma halı qeydə alınmışdır.',
    'Söhbətə üçüncü şəxs cəlb edilməmişdir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Araşdırma o vaxta qədər açıq qalır ki, tərəflərdən biri məsələni öz təşəbbüsü ilə izah etsin. Bu müddətdə «mən yaxşıyam» ifadəsinə istinad edilə bilməz.',
    'İzahat verildikdə arayış avtomatik olaraq arxivə verilir.',
    'Sual üçüncü dəfə verilərsə, cavab yazılı formada tələb olunur.'
  ]
},
{
  id: 'serial-xeyaneti', cat: 'couples', tone: 'zarafat', layout: 'qerar', palette: 'burgundy', active: false,
  title: 'Razılaşdırılmış Serialın Tək Baxılması Faktının Təsbiti haqqında Qərar', tag: 'Ən çox paylaşılan',
  signOrg: 'Məişət Mübahisələri üzrə Arbitraj Kollegiyası',
  preamble: 'Kollegiya {to} adlı şəxsin baxış tarixçəsini araşdıraraq müəyyən etmişdir ki, birgə baxılması razılaşdırılmış serialın üç seriyası tək baxılmışdır. {from} tərəfindən verilmiş müraciət əsaslı hesab olunur və hadisə qəsdən törədilmiş sayılır.',
  powers: 'Üç seriyanın tək baxılması faktı təsdiqlənmiş hesab edilsin.\n«Yatmışdım, nə baş verdiyini xatırlamıram» izahatı qəbul edilməsin.\nBaxılmış seriyalar yenidən, birlikdə izlənilsin.\nNövbəti serialın seçimi tam olaraq zərərçəkmiş tərəfə keçsin.',
  penalty: 'Hal təkrarlandıqda hesabın şifrəsi dəyişdirilir və bərpası yalnız birgə baxış cədvəlinin imzalanmasından sonra mümkün olur.',
  titleOptions: [
    'Razılaşdırılmış Serialın Tək Baxılması Faktının Təsbiti haqqında Qərar',
    'Birgə Baxış Öhdəliyinin Pozulması haqqında Yekun Qətnamə',
    'Seriyaların İcazəsiz İzlənilməsi haqqında Rəsmi Qərar',
    'Baxış Tarixçəsinin Araşdırılmasının Nəticəsi haqqında Qərar'
  ],
  powersOptions: [
    'Üç seriyanın tək baxılması faktı təsdiqlənmiş hesab edilsin.',
    '«Yatmışdım, nə baş verdiyini xatırlamıram» izahatı qəbul edilməsin.',
    'Baxılmış seriyalar yenidən, birlikdə izlənilsin.',
    'Növbəti serialın seçimi tam olaraq zərərçəkmiş tərəfə keçsin.',
    'Baxış tarixçəsinin silinməsi ağırlaşdırıcı hal sayılsın.',
    'Sonluğun əvvəlcədən açıqlanması ayrıca pozuntudur.',
    'Fon rejimində oynatma da baxış hesab edilsin.',
    'Sənədli filmlər bu qərarın əhatəsindən kənardır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Hal təkrarlandıqda hesabın şifrəsi dəyişdirilir və bərpası yalnız birgə baxış cədvəlinin imzalanmasından sonra mümkün olur.',
    'Etiraz qeydə alınır, lakin qərarın qüvvəsinə təsir göstərmir.',
    'Qərar serial başa çatanadək qüvvədə saxlanılır.'
  ]
},
{
  id: 'bes-deqiqeye-hazir', cat: 'couples', tone: 'zarafat', layout: 'teleqram', palette: 'steel', active: false,
  title: '«Beş dəqiqəyə hazıram» İfadəsinin İcra Vəziyyəti haqqında Xəbərdarlıq', tag: 'Təcili',
  signOrg: 'Evdaxili Münasibətlərin Tənzimlənməsi üzrə Şura',
  preamble: 'Sizə bildiririk ki, {to} adlı şəxs tərəfindən verilmiş «beş dəqiqəyə hazıram» vədinin üzərindən qırx dəqiqə keçmişdir. {from} tərəfindən vəziyyətin dəqiqləşdirilməsi tələb olunur; taksi gözləyir və sayğac işləməyə davam edir.',
  powers: 'Vəd verildiyi an dəqiq qeydə alınıb.\nBu müddətdə saç düzümü iki dəfə dəyişdirilib.\n«Çıxıram» ifadəsi üç dəfə səsləndirilib.\nAyaqqabı seçimi hələ də davam edir.',
  penalty: 'Növbəti otuz dəqiqə ərzində çıxış baş verməzsə, görüşün yeri və vaxtı tam olaraq gözləyən tərəf tərəfindən yenidən müəyyən edilir.',
  titleOptions: [
    '«Beş dəqiqəyə hazıram» İfadəsinin İcra Vəziyyəti haqqında Xəbərdarlıq',
    'Verilmiş Vədin Müddətinin Aşılması haqqında Təcili Teleqram',
    'Çıxış Vaxtının Növbəti Dəfə Uzadılması haqqında Xəbərdarlıq',
    'Gözləmə Müddətinin Kritik Həddə Çatması haqqında Teleqram'
  ],
  powersOptions: [
    'Vəd verildiyi an dəqiq qeydə alınıb.',
    'Bu müddətdə saç düzümü iki dəfə dəyişdirilib.',
    '«Çıxıram» ifadəsi üç dəfə səsləndirilib.',
    'Ayaqqabı seçimi hələ də davam edir.',
    'Çanta dəyişdirilməsi əlavə vaxt tələb edib.',
    'Güzgü qarşısında son yoxlama aparılır.',
    'Açarlar hələ tapılmayıb.',
    'İşıqların söndürülməsi mərhələsi başlamayıb.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Növbəti otuz dəqiqə ərzində çıxış baş verməzsə, görüşün yeri və vaxtı tam olaraq gözləyən tərəf tərəfindən yenidən müəyyən edilir.',
    'Xəbərdarlıq çıxış anında avtomatik olaraq qüvvədən düşür.',
    'Taksi xərcinin artan hissəsi gecikdirən tərəfin üzərinə düşür.'
  ]
},
{
  id: 'men-sene-demisdim', cat: 'couples', tone: 'zarafat', layout: 'diplom', palette: 'burgundy', active: false,
  title: '«Mən sənə demişdim» İfadəsinin İşlədilməsi Sahəsində Fəxri Diplom', tag: 'Fəxri ad',
  signOrg: 'Evdaxili Münasibətlərin Tənzimlənməsi üzrə Şura',
  preamble: 'Şura {to} adlı şəxsin uzun müddət ərzində topladığı proqnoz statistikasını qiymətləndirərək təltif haqqında qərar qəbul etmişdir. Diplom {from} tərəfindən, öz səhvini könüllü etiraf etməklə birlikdə təqdim olunur.',
  powers: 'Xəbərdarlıq vaxtında və dəfələrlə edilmişdi.\nProqnozun dəqiqliyi sonradan tam təsdiqləndi.\n«Mən sənə demişdim» ifadəsi haqlı olaraq işlədildi.\nSəhv edən tərəf bunu könüllü etiraf etdi.',
  penalty: 'Diplom geri alınmır. Lakin təltif olunan şəxs bu ifadəni ayda üç dəfədən artıq işlətməmək öhdəliyini üzərinə götürür.',
  titleOptions: [
    '«Mən sənə demişdim» İfadəsinin İşlədilməsi Sahəsində Fəxri Diplom',
    'Proqnozların Dəqiqliyinə Görə Verilmiş Fəxri Diplom',
    'Vaxtında Edilmiş Xəbərdarlığa Görə Fəxri Diplom',
    'Uzunmüddətli Haqlılıq Statistikasına Görə Fəxri Nişan'
  ],
  powersOptions: [
    'Xəbərdarlıq vaxtında və dəfələrlə edilmişdi.',
    'Proqnozun dəqiqliyi sonradan tam təsdiqləndi.',
    '«Mən sənə demişdim» ifadəsi haqlı olaraq işlədildi.',
    'Səhv edən tərəf bunu könüllü etiraf etdi.',
    'Xəbərdarlıq sakit tonda çatdırılmışdı.',
    'Alternativ variant əvvəlcədən təklif edilmişdi.',
    'Nəticə üçüncü şəxslər qarşısında müzakirə edilmədi.',
    'Səhv sonradan xatırladılmadı.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Diplom geri alınmır. Lakin təltif olunan şəxs bu ifadəni ayda üç dəfədən artıq işlətməmək öhdəliyini üzərinə götürür.',
    'Təltif hər yeni doğru proqnozdan sonra yenilənir.',
    'Diplom ailə arxivində saxlanılır.'
  ]
},
{
  id: 'yorgan-beyannamesi', cat: 'couples', tone: 'zarafat', layout: 'blank', palette: 'forest', active: false,
  title: 'Yatağın və Yorğanın Bölüşdürülməsi Sərhədləri haqqında Bəyannamə', tag: 'Gecə rejimi',
  signOrg: 'Ev Rejimi və Daxili Nizam üzrə Baş İdarə',
  preamble: 'Bu bəyannamə ilə {from} və {to} arasında yatağın və yorğanın bölüşdürülməsi sərhədləri müəyyən edilir. Sənəd gecə saat 03:00-dan sonra baş verən yerdəyişmələri də əhatə edir və hər iki tərəfə bərabər şamil olunur.',
  powers: 'Yatağın orta xətti sərhəd hesab edilir.\nYorğanın yarısı hər tərəf üçün toxunulmazdır.\nGecə saat 03:00-dan sonrakı işğal ayrıca qeydə alınır.\nSoyuq gecələrdə sərhəd qarşılıqlı razılıqla dəyişdirilir.',
  penalty: 'Sərhədin ardıcıl üç gecə pozulması halında növbəti həftə ərzində ikinci yorğandan istifadə qaydası tətbiq edilir.',
  titleOptions: [
    'Yatağın və Yorğanın Bölüşdürülməsi Sərhədləri haqqında Bəyannamə',
    'Gecə Saatlarında Yer Tutma Qaydası haqqında Bəyannamə',
    'Yataq Sahəsinin Sərhədlərinin Təsbiti haqqında Bildiriş',
    'Yorğanın Bərabər İstifadəsi Prinsipi haqqında Bəyannamə'
  ],
  powersOptions: [
    'Yatağın orta xətti sərhəd hesab edilir.',
    'Yorğanın yarısı hər tərəf üçün toxunulmazdır.',
    'Gecə saat 03:00-dan sonrakı işğal ayrıca qeydə alınır.',
    'Soyuq gecələrdə sərhəd qarşılıqlı razılıqla dəyişdirilir.',
    'Yastığın yeri dəyişdirilmir.',
    'Ayaqların soyuq olması istisna hal kimi qəbul edilir.',
    'Yorğanın dartılması xəbərdarlıq tələb edir.',
    'İkinci yorğan variantı açıq saxlanılır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Sərhədin ardıcıl üç gecə pozulması halında növbəti həftə ərzində ikinci yorğandan istifadə qaydası tətbiq edilir.',
    'Bəyannamə xəstəlik dövründə qüvvədən düşür.',
    'Sərhəd hər mövsüm yenidən razılaşdırılır.'
  ]
},
{
  id: 'hesab-bolgusu', cat: 'friends', tone: 'zarafat', layout: 'arayis', palette: 'forest', active: false,
  title: 'Ümumi Hesabın İştirakçılar Arasında Bölüşdürülməsi haqqında Arayış', tag: 'Süfrə',
  signOrg: 'Dostlararası Maliyyə Münasibətləri üzrə Şura',
  preamble: 'Verilir {to} adlı şəxsə ondan ötrü ki, ümumi hesabın bölüşdürülməsi {from} ilə birgə aparılmışdır. Hesablaşma zamanı sifarişlərin fərdi dəyəri deyil, bərabər bölgü prinsipi əsas götürülmüşdür.',
  powers: 'Hesab iştirakçıların sayına bərabər bölünür.\nYalnız su içən şəxs üçün güzəşt tətbiq edilir.\nÖdəniş həmin gün ərzində köçürülür.\nQırıq məbləğ ödəyənin xeyrinə yuvarlaqlaşdırılır.',
  penalty: 'Ödəniş üç gün ərzində köçürülmədikdə növbəti süfrənin bütün xərci gecikdirən tərəfin üzərinə düşür.',
  titleOptions: [
    'Ümumi Hesabın İştirakçılar Arasında Bölüşdürülməsi haqqında Arayış',
    '«Kim nə yedi» Hesablaşmasının Nəticəsi haqqında Arayış',
    'Bərabər Bölgü Prinsipinin Tətbiqi haqqında Rəsmi Arayış',
    'Süfrə Hesabının Yekunlaşdırılması haqqında Arayış'
  ],
  powersOptions: [
    'Hesab iştirakçıların sayına bərabər bölünür.',
    'Yalnız su içən şəxs üçün güzəşt tətbiq edilir.',
    'Ödəniş həmin gün ərzində köçürülür.',
    'Qırıq məbləğ ödəyənin xeyrinə yuvarlaqlaşdırılır.',
    'Şirniyyat sifarişi ayrıca hesablanır.',
    'Gec gələn şəxs yalnız öz payını ödəyir.',
    'Ödənişi edən növbəti məkanı seçir.',
    'Bahşiş ümumi məbləğdən çıxılır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Ödəniş üç gün ərzində köçürülmədikdə növbəti süfrənin bütün xərci gecikdirən tərəfin üzərinə düşür.',
    'Arayış yalnız əvvəlcədən razılaşdırılmış görüşlərə şamil edilir.',
    'Etiraz həmin axşam bildirilməlidir.'
  ]
},
{
  id: 'dogum-gunu-unutma', cat: 'friends', tone: 'zarafat', layout: 'teleqram', palette: 'burgundy', active: false,
  title: 'Dostun Ad Gününün Vaxtında Qeyd Edilməməsi haqqında Xəbərdarlıq', tag: 'Xəbərdarlıq',
  signOrg: 'Dostluq Öhdəliklərinin Qeydiyyatı üzrə Komissiya',
  preamble: 'Sizə bildiririk ki, {to} adlı şəxs tərəfindən {from} adlı şəxsin ad günü vaxtında qeyd edilməmişdir. Sosial şəbəkə xatırlatması aktiv olmuş, lakin nəzərə alınmamışdır. Vəziyyətin izahı tələb olunur.',
  powers: 'Tarix qrup söhbətində əvvəlcədən elan edilmişdi.\nXatırlatma bildirişi açıq vəziyyətdə idi.\nDigər iştirakçılar təbriki vaxtında çatdırıb.\nGecikmiş təbrik qismən qəbul edilir.',
  penalty: 'Təbrik növbəti üç gün ərzində çatdırılmazsa, gələn ilki qonaqlığın təşkili tam olaraq gecikdirən tərəfin üzərinə düşür.',
  titleOptions: [
    'Dostun Ad Gününün Vaxtında Qeyd Edilməməsi haqqında Xəbərdarlıq',
    'Təbrikin Gecikməsi Halının Qeydə Alınması haqqında Teleqram',
    'Əlamətdar Tarixin Yaddan Çıxması haqqında Təcili Bildiriş',
    'Sosial Şəbəkə Xatırlatmasının Nəzərə Alınmaması haqqında Teleqram'
  ],
  powersOptions: [
    'Tarix qrup söhbətində əvvəlcədən elan edilmişdi.',
    'Xatırlatma bildirişi açıq vəziyyətdə idi.',
    'Digər iştirakçılar təbriki vaxtında çatdırıb.',
    'Gecikmiş təbrik qismən qəbul edilir.',
    'Hədiyyə ilə müşayiət olunan təbrik ağırlaşdırıcı halı aradan qaldırır.',
    'Səsli mesaj yazılı təbriki əvəz etmir.',
    'Qonaqlıq təklifi vəziyyəti tam bərpa edir.',
    'Növbəti il üçün xatırlatma qurulur.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Təbrik növbəti üç gün ərzində çatdırılmazsa, gələn ilki qonaqlığın təşkili tam olaraq gecikdirən tərəfin üzərinə düşür.',
    'Təbrik çatdırıldıqda xəbərdarlıq arxivə verilir.',
    'Xəbərdarlıq qrup söhbətində elan edilir.'
  ]
},
{
  id: 'qonaqliq-novbesi', cat: 'friends', tone: 'zarafat', layout: 'muqavile', palette: 'steel', active: false,
  title: 'Dost Qrupunda Qonaqlıq Növbəsinin Bölüşdürülməsi üzrə Protokol', tag: 'Növbə',
  signOrg: 'Dostluq Öhdəliklərinin Qeydiyyatı üzrə Komissiya',
  preamble: 'Tərəflərin mövqeyi nəzərə alınmaqla, {from} və {to} arasında qonaqlıq növbəsinin bölüşdürülməsi barədə razılıq əldə edilmişdir. Protokol həm ev qonaqlıqlarını, həm də kənar məkanlarda keçirilən görüşləri əhatə edir.',
  powers: 'Növbə qrupun bütün üzvləri arasında bərabər bölünür.\nNövbənin ötürülməsi ən azı bir həftə əvvəl bildirilir.\nMəkan seçimi növbə sahibinin səlahiyyətindədir.\nMenyu qrupla əvvəlcədən razılaşdırılır.',
  penalty: 'Növbənin ardıcıl iki dəfə buraxılması halında həmin şəxs növbəti iki görüşün xərcini tam öz üzərinə götürür.',
  titleOptions: [
    'Dost Qrupunda Qonaqlıq Növbəsinin Bölüşdürülməsi üzrə Protokol',
    'Görüş Yerinin və Ödənişin Növbəliliyi üzrə Qarşılıqlı Saziş',
    'Ev Qonaqlığının Təşkili Qaydası üzrə Protokol',
    'Növbənin Ötürülməsi Şərtləri üzrə Müqavilə'
  ],
  powersOptions: [
    'Növbə qrupun bütün üzvləri arasında bərabər bölünür.',
    'Növbənin ötürülməsi ən azı bir həftə əvvəl bildirilir.',
    'Məkan seçimi növbə sahibinin səlahiyyətindədir.',
    'Menyu qrupla əvvəlcədən razılaşdırılır.',
    'Ev qonaqlığında köməklik könüllü göstərilir.',
    'Buraxılmış növbə növbəti dövrə keçirilir.',
    'Yeni üzv növbəyə üçüncü aydan qoşulur.',
    'Bayram günləri növbədən kənar sayılır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Növbənin ardıcıl iki dəfə buraxılması halında həmin şəxs növbəti iki görüşün xərcini tam öz üzərinə götürür.',
    'Protokol qrupun tərkibi dəyişdikdə yenilənir.',
    'Fövqəladə hallar növbəni dayandırmır, təxirə salır.'
  ]
},
{
  id: 'mesleht-reyi', cat: 'friends', tone: 'zarafat', layout: 'ekspertiza', palette: 'ink', active: false,
  title: 'Verilmiş Məsləhətin Nəticələrinin Qiymətləndirilməsinə dair Rəy', tag: 'Məsləhət',
  signOrg: 'Dostlararası Mübahisələrin Həlli üzrə Ali Məclis',
  preamble: 'Aparılmış qiymətləndirmə nəticəsində müəyyən edilmişdir ki, {from} tərəfindən {to} adlı şəxsə verilmiş məsləhətin nəticələri gözləniləndən fərqli olmuşdur. Rəy hər iki tərəfin izahatı əsasında tərtib edilmişdir.',
  powers: 'Məsləhət könüllü, xahiş olunmadan verilib.\nQərarın son variantı məsləhəti tam əks etdirmir.\nMəsuliyyət tərəflər arasında bərabər bölünür.\nNəticə dostluq münasibətinə təsir göstərmir.',
  penalty: 'Bu rəy əsasında məsləhət verən tərəfə heç bir maliyyə iddiası irəli sürülə bilməz. Növbəti məsləhət isə ayrıca razılaşdırılır.',
  titleOptions: [
    'Verilmiş Məsləhətin Nəticələrinin Qiymətləndirilməsinə dair Rəy',
    'Dost Tövsiyəsinin Praktiki Faydasına dair Ekspert Rəyi',
    'Məsləhətin Nəticəsinə Görə Məsuliyyətin Bölgüsü haqqında Rəy',
    'Tövsiyənin Dəqiqlik Dərəcəsinin Təhlilinə dair Yekun Rəy'
  ],
  powersOptions: [
    'Məsləhət könüllü, xahiş olunmadan verilib.',
    'Qərarın son variantı məsləhəti tam əks etdirmir.',
    'Məsuliyyət tərəflər arasında bərabər bölünür.',
    'Nəticə dostluq münasibətinə təsir göstərmir.',
    'Alternativ variant da təklif edilmişdi.',
    'Qərar tələsik qəbul edilib.',
    'Xəbərdarlıq bəndləri nəzərə alınmayıb.',
    'Növbəti məsləhət yazılı formada veriləcək.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Bu rəy əsasında məsləhət verən tərəfə heç bir maliyyə iddiası irəli sürülə bilməz. Növbəti məsləhət isə ayrıca razılaşdırılır.',
    'Rəy yalnız bir epizoda şamil edilir.',
    'Nəticə yaxşılaşdıqda rəy yenidən baxılır.'
  ]
},
{
  id: 'birlikde-idman', cat: 'friends', tone: 'zarafat', layout: 'sertifikat', palette: 'gold', active: false,
  title: 'Birgə İdman Rejiminə Başlanılması Faktını Təsdiq edən Sertifikat', tag: 'Yanvar',
  signOrg: 'Dostluq Öhdəliklərinin Qeydiyyatı üzrə Komissiya',
  preamble: 'Bununla təsdiq edilir ki, {from} və {to} birgə idman rejiminə başlamışlar. Sertifikat abunənin rəsmiləşdirildiyi gün verilir və rejimin faktiki davam etdirilməsinə heç bir təminat vermir.',
  powers: 'Abunə hər iki tərəf üçün eyni gün rəsmiləşdirilib.\nİlk həftə üçün cədvəl tərtib edilib.\nBir tərəfin buraxdığı gün digərini azad etmir.\nNəticələr həftədə bir dəfə müqayisə edilir.',
  penalty: 'Sertifikat abunə müddəti bitənədək qüvvədədir. Rejim iki həftədən artıq dayandırıldıqda sənəd yalnız xatirə kimi saxlanılır.',
  titleOptions: [
    'Birgə İdman Rejiminə Başlanılması Faktını Təsdiq edən Sertifikat',
    'Zala Yazılma və İlk Həftənin Nəticəsi haqqında Sertifikat',
    'Birgə Motivasiya Öhdəliyinin Qəbulunu Təsdiq edən Sertifikat',
    'Yeni Rejimə Keçidin Rəsmi Təsdiqinə dair Şəhadətnamə'
  ],
  powersOptions: [
    'Abunə hər iki tərəf üçün eyni gün rəsmiləşdirilib.',
    'İlk həftə üçün cədvəl tərtib edilib.',
    'Bir tərəfin buraxdığı gün digərini azad etmir.',
    'Nəticələr həftədə bir dəfə müqayisə edilir.',
    'Səhər rejimi ilk uğursuz variant kimi qeyd olunub.',
    'Zalın yeri hər iki tərəfə yaxın seçilib.',
    'Buraxılmış məşq növbəti günə keçirilir.',
    'Qonaqlıq günləri istisna sayılır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Sertifikat abunə müddəti bitənədək qüvvədədir. Rejim iki həftədən artıq dayandırıldıqda sənəd yalnız xatirə kimi saxlanılır.',
    'Sertifikat abunənin uzadılması ilə yenilənir.',
    'Bir tərəfin çıxması digərinin öhdəliyini dayandırmır.'
  ]
},
{
  id: 'toplanti-mektub', cat: 'work', tone: 'zarafat', layout: 'arayis', palette: 'ink', active: false,
  title: 'Keçirilmiş Toplantının Elektron Məktubla Əvəz Edilməsi İmkanı haqqında Arayış', tag: 'Toplantı',
  signOrg: 'Ofis Nizamı və Əmək Rejimi üzrə Baş İdarə',
  preamble: 'Verilir {to} adlı şəxsə ondan ötrü ki, {from} tərəfindən təşkil edilmiş toplantının məzmunu araşdırılmışdır. Müzakirənin nəticəsi bir elektron məktubla çatdırıla biləcək həcmdə olmuşdur.',
  powers: 'Toplantı qırx beş dəqiqə davam edib.\nİştirakçıların sayı doqquz nəfər olub.\nYekun məlumat iki cümləyə sığır.\nQərar qəbul edilməyib, növbəti toplantıya keçirilib.',
  penalty: 'Arayış toplantı mədəniyyətini məhdudlaşdırmır. Lakin növbəti dəfə gündəlik əvvəlcədən göndərilmədikdə toplantı yarım saatla məhdudlaşır.',
  titleOptions: [
    'Keçirilmiş Toplantının Elektron Məktubla Əvəz Edilməsi İmkanı haqqında Arayış',
    'Toplantının Faktiki Məzmununun Təhlili haqqında Arayış',
    'Sərf Edilmiş Kollektiv Vaxtın Hesablanması haqqında Arayış',
    'Gündəliyin Bir Abzasa Sığması haqqında Rəsmi Arayış'
  ],
  powersOptions: [
    'Toplantı qırx beş dəqiqə davam edib.',
    'İştirakçıların sayı doqquz nəfər olub.',
    'Yekun məlumat iki cümləyə sığır.',
    'Qərar qəbul edilməyib, növbəti toplantıya keçirilib.',
    'İştirakçıların üçdə ikisi söz almayıb.',
    'Ekran paylaşımı texniki səbəbdən gecikib.',
    'Gündəlik əvvəlcədən göndərilməyib.',
    'Növbəti toplantının tarixi təyin edilib.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Arayış toplantı mədəniyyətini məhdudlaşdırmır. Lakin növbəti dəfə gündəlik əvvəlcədən göndərilmədikdə toplantı yarım saatla məhdudlaşır.',
    'Arayış məlumat xarakteri daşıyır və protokola əlavə edilir.',
    'Gündəlik göndərildikdə arayış nəzərə alınmır.'
  ]
},
{
  id: 'cume-tapsirigi', cat: 'work', tone: 'zarafat', layout: 'qerar', palette: 'burgundy', active: false,
  title: 'Cümə Günü İş Vaxtının Sonunda Verilmiş Tapşırıq haqqında Qərar', tag: 'Cümə',
  signOrg: 'İş Vədləri və İcra Müddətləri üzrə Şura',
  preamble: 'Şura {to} adlı şəxsə cümə günü saat 17:50-də verilmiş tapşırığı araşdırmış və müəyyən etmişdir ki, göstərilən təcililik dərəcəsi real vəziyyətlə uyğun gəlmir. {from} tərəfindən verilmiş etiraz əsaslı hesab olunur.',
  powers: 'Tapşırığın təcililik dərəcəsi aşağı salınsın.\nİcra müddəti bazar ertəsi səhərdən başlansın.\nHəftəsonu ərzində hesabat tələb edilməsin.\nİş saatından sonrakı müraciətlər növbəti günə keçirilsin.',
  penalty: 'Həqiqətən təcili hallar bu qərarın əhatəsindən kənardır; belə hallarda müraciət yazılı əsaslandırma ilə birlikdə göndərilir.',
  titleOptions: [
    'Cümə Günü İş Vaxtının Sonunda Verilmiş Tapşırıq haqqında Qərar',
    'Həftəsonuna Keçən Tapşırığın Müddəti haqqında Yekun Qətnamə',
    'Təcililik Dərəcəsinin Yenidən Müəyyən Edilməsi haqqında Qərar',
    'İş Saatından Sonrakı Müraciətlər haqqında Rəsmi Qərar'
  ],
  powersOptions: [
    'Tapşırığın təcililik dərəcəsi aşağı salınsın.',
    'İcra müddəti bazar ertəsi səhərdən başlansın.',
    'Həftəsonu ərzində hesabat tələb edilməsin.',
    'İş saatından sonrakı müraciətlər növbəti günə keçirilsin.',
    'Faktiki son tarix iki həftə sonradır.',
    'Tapşırıq üç gün əvvəl də verilə bilərdi.',
    'Əlaqədar şöbə həftəsonu işləmir.',
    'Təcili hal ayrıca protokolla təsdiqlənir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Həqiqətən təcili hallar bu qərarın əhatəsindən kənardır; belə hallarda müraciət yazılı əsaslandırma ilə birlikdə göndərilir.',
    'Qərardan narazılıq protokola daxil edilir.',
    'Qərar bütün şöbələrə eyni qaydada şamil olunur.'
  ]
},
{
  id: 'soyuducu-yemeyi', cat: 'work', tone: 'zarafat', layout: 'blank', palette: 'forest', active: false,
  title: 'Ümumi Soyuducudan Yeməyin İtməsi Halının Qeydə Alınması Bildirişi', tag: 'Mətbəx',
  signOrg: 'Ofis Nizamı və Əmək Rejimi üzrə Baş İdarə',
  preamble: 'Daxil olmuş müraciətə baxılaraq bildirilir ki, {to} adlı şəxsin ümumi soyuducuda saxladığı nahar aşkarlanmamışdır. Qabın üzərində ad yazılmış, tarix qeyd edilmişdir. {from} tərəfindən vəziyyətin aydınlaşdırılması xahiş olunur.',
  powers: 'Qabın üzərində ad və tarix göstərilmişdi.\nSoyuducuya giriş bütün əməkdaşlar üçün açıqdır.\nKamera qeydiyyatı aparılmır.\nSəhv götürülmə ehtimalı istisna edilmir.',
  penalty: 'Vəziyyət aydınlaşdırılmadıqda ofis mətbəxində fərdi işarələmə qaydası tətbiq olunur və ümumi rəf yenidən bölüşdürülür.',
  titleOptions: [
    'Ümumi Soyuducudan Yeməyin İtməsi Halının Qeydə Alınması Bildirişi',
    'Ad Yazılmış Qabın Aşkarlanmaması haqqında Rəsmi Bildiriş',
    'Ofis Mətbəxində Nizamın Pozulması haqqında Bildiriş',
    'Nahar Ehtiyatının İtkisi haqqında Ümumi Bildiriş'
  ],
  powersOptions: [
    'Qabın üzərində ad və tarix göstərilmişdi.',
    'Soyuducuya giriş bütün əməkdaşlar üçün açıqdır.',
    'Kamera qeydiyyatı aparılmır.',
    'Səhv götürülmə ehtimalı istisna edilmir.',
    'Boş qab yuyulmuş vəziyyətdə tapılıb.',
    'Oxşar hal son ayda ikinci dəfə baş verib.',
    'Ümumi məhsullar ayrıca rəfdə saxlanılır.',
    'Yeni işarələmə qaydası tətbiq ediləcək.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Vəziyyət aydınlaşdırılmadıqda ofis mətbəxində fərdi işarələmə qaydası tətbiq olunur və ümumi rəf yenidən bölüşdürülür.',
    'Bildiriş heç kimə qarşı ittiham xarakteri daşımır.',
    'Yemək qaytarıldıqda məsələ bağlanmış hesab edilir.'
  ]
},
{
  id: 'tez-cixis', cat: 'work', tone: 'zarafat', layout: 'lisenziya', palette: 'steel', active: false,
  title: 'İş Gününün Vaxtından Əvvəl Bitirilməsinə dair Məhdud Lisenziya', tag: 'Güzəşt',
  signOrg: 'Ofis Nizamı və Əmək Rejimi üzrə Baş İdarə',
  preamble: '{from} tərəfindən {to} adlı şəxsə iş gününü vaxtından əvvəl bitirmək üçün məhdud lisenziya verilir. Lisenziya yalnız gündəlik tapşırıqların tam icra edildiyi hallarda və əvvəlcədən xəbərdarlıq şərti ilə qüvvədədir.',
  powers: 'Erkən çıxış həftədə bir dəfə mümkündür.\nBütün tapşırıqlar çıxışdan əvvəl tamamlanır.\nXəbərdarlıq ən azı iki saat əvvəl edilir.\nYazışmalara axşama qədər cavab verilir.',
  penalty: 'Tapşırıqlar tamamlanmadan çıxış aşkarlandıqda lisenziya növbəti ay üçün dayandırılır və bərpa avtomatik həyata keçirilmir.',
  titleOptions: [
    'İş Gününün Vaxtından Əvvəl Bitirilməsinə dair Məhdud Lisenziya',
    'Erkən Çıxış Hüququnun Rəsmiləşdirilməsinə dair Lisenziya',
    'Tapşırıq Bitdikdə Çıxış İcazəsinə dair Müddətli Lisenziya',
    'Cümə Günü Qısaldılmış İş Rejiminə dair İcazə'
  ],
  powersOptions: [
    'Erkən çıxış həftədə bir dəfə mümkündür.',
    'Bütün tapşırıqlar çıxışdan əvvəl tamamlanır.',
    'Xəbərdarlıq ən azı iki saat əvvəl edilir.',
    'Yazışmalara axşama qədər cavab verilir.',
    'Cümə günləri güzəşt genişləndirilir.',
    'Toplantı günü lisenziya qüvvədən düşür.',
    'Növbəti gün iş bir saat tez başlanır.',
    'Uzaqdan iş rejimi ayrıca razılaşdırılır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Tapşırıqlar tamamlanmadan çıxış aşkarlandıqda lisenziya növbəti ay üçün dayandırılır və bərpa avtomatik həyata keçirilmir.',
    'Lisenziya rüblük əsasda yenidən nəzərdən keçirilir.',
    'Təcili layihə dövründə lisenziya müvəqqəti dayandırılır.'
  ]
},
{
  id: 'korporativ-tedbir', cat: 'work', tone: 'zarafat', layout: 'ekspertiza', palette: 'gold', active: false,
  title: 'Məcburi Korporativ Tədbirin Faydalılığının Qiymətləndirilməsinə dair Rəy', tag: 'Tədbir',
  signOrg: 'Korporativ Mübahisələr üzrə Arbitraj Komissiyası',
  preamble: 'Aparılmış qiymətləndirmə nəticəsində müəyyən edilmişdir ki, {from} tərəfindən təşkil edilmiş korporativ tədbirin komanda birliyinə təsiri gözləniləndən aşağı olmuşdur. Rəy {to} adlı şəxsin də daxil olduğu iştirakçı sorğusuna əsaslanır.',
  powers: 'İştirak rəsmən könüllü elan edilmişdi.\nFaktiki iştirak nisbəti doxsan faiz olub.\nTədbirin əsas faydası uzun fasilədə görülüb.\nKomanda birliyinə təsir ölçülə bilməyib.',
  penalty: 'Rəy tədbirlərin keçirilməsinə qarşı deyil. Növbəti tədbirin formatı iştirakçı sorğusunun nəticəsinə uyğun müəyyən edilir.',
  titleOptions: [
    'Məcburi Korporativ Tədbirin Faydalılığının Qiymətləndirilməsinə dair Rəy',
    'Komanda Birliyi Tədbirinin Nəticələrinə dair Ekspert Rəyi',
    'İştirakın Könüllülük Dərəcəsinin Təhlilinə dair Rəy',
    'Tədbirdən Sonrakı Əhval-ruhiyyənin Qiymətləndirilməsi Rəyi'
  ],
  powersOptions: [
    'İştirak rəsmən könüllü elan edilmişdi.',
    'Faktiki iştirak nisbəti doxsan faiz olub.',
    'Tədbirin əsas faydası uzun fasilədə görülüb.',
    'Komanda birliyinə təsir ölçülə bilməyib.',
    'Tədbirin vaxtı iş gününə düşüb.',
    'Fərdi tapşırıqlar həmin gün ləğv edilməyib.',
    'Yemək hissəsi ən yüksək qiymət alıb.',
    'Növbəti tədbir üçün sorğu keçiriləcək.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Rəy tədbirlərin keçirilməsinə qarşı deyil. Növbəti tədbirin formatı iştirakçı sorğusunun nəticəsinə uyğun müəyyən edilir.',
    'Rəy anonim sorğu nəticələrinə əsaslanır.',
    'Nəticələr növbəti planlamada nəzərə alınır.'
  ]
},
{
  id: 'sarj-kabeli', cat: 'family', tone: 'zarafat', layout: 'arayis', palette: 'steel', active: false,
  title: 'Şarj Kabelinin İtməsi Halının Araşdırılmasının Nəticəsi haqqında Arayış', tag: 'İtki',
  signOrg: 'Ev Tapşırıqları və Daxili Nizam üzrə Baş İdarə',
  preamble: 'Verilir {to} adlı şəxsə ondan ötrü ki, evdə şarj kabelinin itməsi halı {from} tərəfindən araşdırılmışdır. Kabelin son dəfə harada görüldüyü dəqiqləşdirilmiş, lakin cari yeri müəyyən edilməmişdir.',
  powers: 'Kabel son dəfə mətbəxdə görülüb.\nHər otaqdan bir kabel yoxa çıxıb.\nÜmumi kabel yalnız icazə ilə götürülür.\nŞəxsi kabellər işarələnməlidir.',
  penalty: 'Kabel üç gün ərzində tapılmadıqda yenisinin alınması onu sonuncu istifadə edən şəxsin hesabına həyata keçirilir.',
  titleOptions: [
    'Şarj Kabelinin İtməsi Halının Araşdırılmasının Nəticəsi haqqında Arayış',
    'Ümumi İstifadə Kabelinin Yerinin Müəyyən Edilməsi haqqında Arayış',
    'Otaqlar Arasında Kabel Dövriyyəsi haqqında Rəsmi Arayış',
    'Şəxsi Kabelin İşarələnməsi Zərurəti haqqında Arayış'
  ],
  powersOptions: [
    'Kabel son dəfə mətbəxdə görülüb.',
    'Hər otaqdan bir kabel yoxa çıxıb.',
    'Ümumi kabel yalnız icazə ilə götürülür.',
    'Şəxsi kabellər işarələnməlidir.',
    'Uzadıcı naqil ayrıca qeydə alınıb.',
    'Yeni kabel alışı büdcəyə salınıb.',
    'Baş ucundakı kabel toxunulmaz elan edilib.',
    'Səyahət kabeli çantada saxlanılır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Kabel üç gün ərzində tapılmadıqda yenisinin alınması onu sonuncu istifadə edən şəxsin hesabına həyata keçirilir.',
    'Arayış heç kimə qarşı ittiham xarakteri daşımır.',
    'Kabel tapıldıqda araşdırma dayandırılır.'
  ]
},
{
  id: 'qonaqda-davranis', cat: 'family', tone: 'zarafat', layout: 'sertifikat', palette: 'burgundy', active: false,
  title: 'Qonaqlıqda Nümunəvi Davranışın Nümayiş Etdirilməsini Təsdiq edən Sertifikat', tag: 'Qonaqlıq',
  signOrg: 'Uşaq Hüquqlarının Müdafiəsi üzrə Ailə Komissiyası',
  preamble: 'Bununla təsdiq edilir ki, {to} adlı şəxs qonaqlıq boyunca nümunəvi davranış nümayiş etdirmişdir. Sertifikat {from} tərəfindən, ev sahiblərinin və digər qonaqların yekdil rəyi əsas götürülərək verilmişdir.',
  powers: 'Süfrə arxasında telefon istifadə edilmədi.\nŞeir demək təklifi rədd edilmədi.\nYeni yeməklərin hamısı dadıldı.\n«Nə vaxt gedirik» sualı verilmədi.',
  penalty: 'Sertifikat növbəti qonaqlıqda əlavə güzəşt qazandırır: sahibinin bir yemək seçimi mübahisəsiz qəbul edilir.',
  titleOptions: [
    'Qonaqlıqda Nümunəvi Davranışın Nümayiş Etdirilməsini Təsdiq edən Sertifikat',
    'Süfrə Arxasında Nizamlı Davranışa Görə Verilmiş Sertifikat',
    'Qonaq Evində Göstərilən Səbrə Görə Şəhadətnamə',
    'Şeir Deməkdən İmtina Etməmə Halına dair Sertifikat'
  ],
  powersOptions: [
    'Süfrə arxasında telefon istifadə edilmədi.',
    'Şeir demək təklifi rədd edilmədi.',
    'Yeni yeməklərin hamısı dadıldı.',
    '«Nə vaxt gedirik» sualı verilmədi.',
    'Salamlaşma hər kəslə ayrıca aparıldı.',
    'Kiçik qonaqlarla oynanıldı.',
    'Süfrənin yığılmasında köməklik göstərildi.',
    'Ayrılarkən təşəkkür bildirildi.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Sertifikat növbəti qonaqlıqda əlavə güzəşt qazandırır: sahibinin bir yemək seçimi mübahisəsiz qəbul edilir.',
    'Sertifikat hər qonaqlıqdan sonra yenidən qiymətləndirilir.',
    'Sənəd ailə arxivində saxlanılır.'
  ]
},
{
  id: 'seher-oyatma', cat: 'family', tone: 'zarafat', layout: 'teleqram', palette: 'gold', active: false,
  title: 'Səhər Oyatma Cəhdlərinin Nəticəsiz Qalması haqqında Təcili Xəbərdarlıq', tag: 'Səhər',
  signOrg: 'Ev Tapşırıqları və Daxili Nizam üzrə Baş İdarə',
  preamble: 'Sizə bildiririk ki, {to} adlı şəxsi oyatmaq üçün edilən cəhdlərin sayı üçə çatmışdır. {from} tərəfindən vəziyyətin dərhal düzəldilməsi tələb olunur; qalan vaxt on beş dəqiqədən azdır və səhər yeməyi hazırdır.',
  powers: 'Birinci cəhd zəng ilə edilib.\nİkinci cəhd pərdənin açılması ilə müşayiət olunub.\nÜçüncü cəhddən sonra cavab alınmayıb.\n«Beş dəqiqə də» hüququ artıq istifadə edilib.',
  penalty: 'Növbəti on dəqiqə ərzində qalxma baş verməzsə, axşam yatma saatı bir saat tezləşdirilir və ekran vaxtı yarıya endirilir.',
  titleOptions: [
    'Səhər Oyatma Cəhdlərinin Nəticəsiz Qalması haqqında Təcili Xəbərdarlıq',
    'Məktəbə Gecikmə Riski haqqında Təxirəsalınmaz Teleqram',
    'Üçüncü Oyatma Cəhdinin Nəticəsi haqqında Xəbərdarlıq',
    'Səhər Rejiminin Pozulması haqqında Təcili Bildiriş'
  ],
  powersOptions: [
    'Birinci cəhd zəng ilə edilib.',
    'İkinci cəhd pərdənin açılması ilə müşayiət olunub.',
    'Üçüncü cəhddən sonra cavab alınmayıb.',
    '«Beş dəqiqə də» hüququ artıq istifadə edilib.',
    'Yorğan iki dəfə geri çəkilib.',
    'İşıq yandırılıb, sonra söndürülüb.',
    'Səhər yeməyi soyumaq üzrədir.',
    'Çanta axşamdan hazırlanmayıb.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Növbəti on dəqiqə ərzində qalxma baş verməzsə, axşam yatma saatı bir saat tezləşdirilir və ekran vaxtı yarıya endirilir.',
    'Xəbərdarlıq qalxma anında qüvvədən düşür.',
    'Xəstəlik halında xəbərdarlıq tətbiq edilmir.'
  ]
},
{
  id: 'yay-tetili-plani', cat: 'family', tone: 'zarafat', layout: 'muqavile', palette: 'forest', active: false,
  title: 'Yay Tətili Proqramının Ailə Üzvləri ilə Razılaşdırılması üzrə Saziş', tag: 'Yay',
  signOrg: 'Valideyn-Övlad Münasibətləri üzrə Ali Şura',
  preamble: 'Tərəflərin mövqeyi nəzərə alınmaqla, {from} və {to} arasında yay tətili proqramı barədə razılıq əldə edilmişdir. Saziş həm istirahət, həm də oxu və ev işləri öhdəliklərini əhatə edir və tətil boyunca qüvvədədir.',
  powers: 'Gündəlik oxu bir saat müəyyən edilir.\nEkran vaxtı oxu tamamlandıqdan sonra başlayır.\nHəftədə bir gün tam sərbəst elan olunur.\nSəyahət marşrutunda bir təklif qəbul edilir.',
  penalty: 'Sazişin şərtləri iki dəfə pozulduqda tətil rejimi dayandırılır və gündəlik cədvəl valideynlər tərəfindən yenidən tərtib edilir.',
  titleOptions: [
    'Yay Tətili Proqramının Ailə Üzvləri ilə Razılaşdırılması üzrə Saziş',
    'Tətil Günlərinin Bölüşdürülməsi Qaydası üzrə Ailə Sazişi',
    'Ekran Vaxtı və Kitab Öhdəliyinin Balansı üzrə Müqavilə',
    'Yay Aylarında Gündəlik Rejim üzrə Qarşılıqlı Protokol'
  ],
  powersOptions: [
    'Gündəlik oxu bir saat müəyyən edilir.',
    'Ekran vaxtı oxu tamamlandıqdan sonra başlayır.',
    'Həftədə bir gün tam sərbəst elan olunur.',
    'Səyahət marşrutunda bir təklif qəbul edilir.',
    'Səhər qalxma saatı bir saat gecikdirilir.',
    'Dost görüşləri əvvəlcədən bildirilir.',
    'Ev tapşırıqları həftəlik cədvəl üzrə bölünür.',
    'Avqustun sonunda rejim tədricən bərpa olunur.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Sazişin şərtləri iki dəfə pozulduqda tətil rejimi dayandırılır və gündəlik cədvəl valideynlər tərəfindən yenidən tərtib edilir.',
    'Saziş hər yay yenidən bağlanır.',
    'Səyahət günləri sazişdən kənar sayılır.'
  ]
},
{
  id: 'ev-isi-diplomu', cat: 'family', tone: 'zarafat', layout: 'diplom', palette: 'steel', active: false,
  title: 'Ev İşlərində Xahiş Edilmədən Göstərilən Köməyə Görə Fəxri Diplom', tag: 'Fəxri ad',
  signOrg: 'Ev Tapşırıqları və Daxili Nizam üzrə Baş İdarə',
  preamble: 'Şura {to} adlı şəxsin ev işlərində xahiş edilmədən göstərdiyi köməyi qiymətləndirərək təltif haqqında qərar qəbul etmişdir. Diplom {from} tərəfindən təqdim olunur və ailə arxivində saxlanılır.',
  powers: 'Süfrə xahiş edilmədən yığıldı.\nZibil vaxtında çıxarıldı.\nOtaq yoxlamadan əvvəl səliqəyə salındı.\nKiçik qardaş-bacıya kömək göstərildi.',
  penalty: 'Diplom geri alınmır. Təltif olunan şəxs il ərzində bir dəfə həftəsonu proqramını seçmək hüququ qazanır.',
  titleOptions: [
    'Ev İşlərində Xahiş Edilmədən Göstərilən Köməyə Görə Fəxri Diplom',
    'Öz Təşəbbüsü ilə Görülmüş İşlərə Görə Fəxri Diplom',
    'Ailə Nizamına Verilən Töhfəyə Görə Verilmiş Diplom',
    'Səliqə Sahəsindəki Nəticələrə Görə Fəxri Nişan'
  ],
  powersOptions: [
    'Süfrə xahiş edilmədən yığıldı.',
    'Zibil vaxtında çıxarıldı.',
    'Otaq yoxlamadan əvvəl səliqəyə salındı.',
    'Kiçik qardaş-bacıya kömək göstərildi.',
    'Qab-qacaq könüllü yuyuldu.',
    'Alış-verişdə köməklik göstərildi.',
    'Ev heyvanına qulluq buraxılmadı.',
    'Səhv olduqda dərhal etiraf edildi.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Diplom geri alınmır. Təltif olunan şəxs il ərzində bir dəfə həftəsonu proqramını seçmək hüququ qazanır.',
    'Təltif hər tədris ilinin sonunda yenilənir.',
    'Diplom ailə arxivində saxlanılır.'
  ]
},
{
  id: 'elcilik-suali', cat: 'relatives', tone: 'zarafat', layout: 'arayis', palette: 'ink', active: false,
  title: '«Nə vaxt evlənirsən?» Sualının Verilmə Tezliyi haqqında Rəsmi Arayış', tag: 'Elçilik',
  signOrg: 'Qohum Sualları və Sosial Təzyiq üzrə Komissiya',
  preamble: 'Verilir {to} adlı şəxsə ondan ötrü ki, son ailə yığıncağında ona ünvanlanan şəxsi sualların sayı {from} tərəfindən qeydə alınmışdır. Sualların əksəriyyəti eyni mövzuya aid olmuş və müxtəlif şəxslər tərəfindən təkrarlanmışdır.',
  powers: 'Eyni sual yeddi dəfə verilib.\nSualların pik vaxtı süfrənin ortasına düşüb.\nCavabların heç biri kifayət hesab edilməyib.\nMövzunu dəyişmək cəhdləri nəticə verməyib.',
  penalty: 'Arayış heç kimi məhdudlaşdırmır. Lakin növbəti yığıncaqda eyni sual beş dəfədən artıq verilərsə, cavab yazılı formada bir dəfə təqdim edilir.',
  titleOptions: [
    '«Nə vaxt evlənirsən?» Sualının Verilmə Tezliyi haqqında Rəsmi Arayış',
    'Şəxsi Suallara Cavab Vermə Öhdəliyinin Həcmi haqqında Arayış',
    'Yığıncaq Boyunca Verilən Sualların Sayı haqqında Arayış',
    'Sosial Təzyiqin Səviyyəsinin Ölçülməsinə dair Arayış'
  ],
  powersOptions: [
    'Eyni sual yeddi dəfə verilib.',
    'Sualların pik vaxtı süfrənin ortasına düşüb.',
    'Cavabların heç biri kifayət hesab edilməyib.',
    'Mövzunu dəyişmək cəhdləri nəticə verməyib.',
    'Uşaqlarla oynamaq müvəqqəti sığınacaq olub.',
    'Mətbəxə kömək təklifi mövzunu dayandırıb.',
    'Telefon zəngi qısamüddətli çıxış imkanı verib.',
    'Növbəti yığıncaq üçün hazırlıq görülür.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Arayış heç kimi məhdudlaşdırmır. Lakin növbəti yığıncaqda eyni sual beş dəfədən artıq verilərsə, cavab yazılı formada bir dəfə təqdim edilir.',
    'Arayış yalnız məlumat xarakteri daşıyır.',
    'Göstəricilər hər yığıncaqdan sonra yenilənir.'
  ]
},
{
  id: 'qohum-adlari', cat: 'relatives', tone: 'zarafat', layout: 'sertifikat', palette: 'gold', active: false,
  title: 'Uzaq Qohumların Adlarının Düzgün Xatırlanmasını Təsdiq edən Sertifikat', tag: 'Yaddaş',
  signOrg: 'Qohumluq Münasibətlərinin Tənzimlənməsi üzrə Şura',
  preamble: 'Bununla təsdiq edilir ki, {to} adlı şəxs son ailə yığıncağında iştirak edən bütün qohumların adlarını və qohumluq dərəcələrini düzgün xatırlamışdır. Sertifikat {from} tərəfindən, nadir hal kimi qiymətləndirilərək verilir.',
  powers: 'Bütün adlar səhvsiz xatırlanıb.\nQohumluq dərəcələri düzgün müəyyən edilib.\nHeç kimlə salamlaşma unudulmayıb.\nUşaqların adları da dəqiq bilinib.',
  penalty: 'Sertifikat növbəti yığıncağa qədər qüvvədədir. Bir addan artıq səhv aşkarlandıqda sənəd yenidən qazanılmalıdır.',
  titleOptions: [
    'Uzaq Qohumların Adlarının Düzgün Xatırlanmasını Təsdiq edən Sertifikat',
    'Qohumluq Dərəcələrinin Dəqiq Müəyyən Edilməsi Sertifikatı',
    'Yığıncaqda Heç Kimin Unudulmamasına dair Sertifikat',
    'Ailə Şəcərəsi Biliyinin Təsdiqinə dair Şəhadətnamə'
  ],
  powersOptions: [
    'Bütün adlar səhvsiz xatırlanıb.',
    'Qohumluq dərəcələri düzgün müəyyən edilib.',
    'Heç kimlə salamlaşma unudulmayıb.',
    'Uşaqların adları da dəqiq bilinib.',
    'Kimin hansı şəhərdə yaşadığı xatırlanıb.',
    'Son görüşün ili düzgün göstərilib.',
    'Sual verilmədən köməklik göstərilib.',
    'Yeni gəlinlərin adları da öyrənilib.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Sertifikat növbəti yığıncağa qədər qüvvədədir. Bir addan artıq səhv aşkarlandıqda sənəd yenidən qazanılmalıdır.',
    'Sertifikat hər yığıncaqdan sonra yenilənir.',
    'Yeni ailə üzvləri sənədə əlavə edilir.'
  ]
},
{
  id: 'sirniyyat-payi', cat: 'relatives', tone: 'zarafat', layout: 'viza', palette: 'forest', active: false,
  title: 'Ziyarətdən Sonra Verilən Şirniyyat Payının Qəbuluna dair İcazə', tag: 'Süfrə',
  signOrg: 'Bayram Ziyarətləri və Süfrə Nizamı üzrə Baş İdarə',
  preamble: '{from} tərəfindən {to} adlı şəxsə ziyarətdən sonra verilən şirniyyat və ərzaq payının qəbulu üçün icazə verilir. İcazə payın həcminə deyil, qabların vaxtında qaytarılmasına şərt qoyur.',
  powers: 'Pay imtina edilmədən qəbul edilir.\nQablar iki həftə ərzində qaytarılır.\nQab boş qaytarılmır, içi doldurulur.\n«Lazım deyil» ifadəsi qəbul edilmir.',
  penalty: 'Qablar iki həftə ərzində qaytarılmadıqda növbəti ziyarətdə pay yalnız birdəfəlik qablarda təqdim olunur.',
  titleOptions: [
    'Ziyarətdən Sonra Verilən Şirniyyat Payının Qəbuluna dair İcazə',
    'Evə Aparılan Ərzaq Payının Həcminə dair Xüsusi İcazə',
    '«Bir az da götür» Təklifinin Tənzimlənməsinə dair İcazə',
    'Qab Qaytarma Öhdəliyinin Müəyyən Edilməsinə dair İcazə'
  ],
  powersOptions: [
    'Pay imtina edilmədən qəbul edilir.',
    'Qablar iki həftə ərzində qaytarılır.',
    'Qab boş qaytarılmır, içi doldurulur.',
    '«Lazım deyil» ifadəsi qəbul edilmir.',
    'Payın həcmi ev sahibi tərəfindən müəyyən edilir.',
    'Xüsusi pəhriz əvvəlcədən bildirilir.',
    'Uşaqlar üçün ayrıca pay ayrılır.',
    'Qablar cütlüklə saxlanılır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Qablar iki həftə ərzində qaytarılmadıqda növbəti ziyarətdə pay yalnız birdəfəlik qablarda təqdim olunur.',
    'İcazə hər ziyarətə şamil edilir.',
    'Qabın itməsi əvəzlənmə öhdəliyi yaradır.'
  ]
},
{
  id: 'bayram-telefonu', cat: 'relatives', tone: 'zarafat', layout: 'teleqram', palette: 'burgundy', active: false,
  title: 'Bayram Günü Zəng Növbəsinin Müəyyən Edilməsi haqqında Xəbərdarlıq', tag: 'Bayram',
  signOrg: 'Bayram Ziyarətləri və Süfrə Nizamı üzrə Baş İdarə',
  preamble: 'Sizə bildiririk ki, {to} adlı şəxs üçün bayram günü zəng növbəsi müəyyən edilmişdir. {from} tərəfindən siyahının əvvəlcədən nəzərdən keçirilməsi və heç bir qohumun unudulmaması xahiş olunur.',
  powers: 'Böyüklərə zəng birinci edilir.\nZənglərin sayı gün ərzində bölüşdürülür.\nSəsli mesaj zəngi əvəz etmir.\nCavabsız zəng növbəti gün təkrarlanır.',
  penalty: 'Siyahıda göstərilən şəxslərdən biri unudulduqda növbəti bayramda zəng növbəsi tam olaraq digər tərəfin üzərinə düşür.',
  titleOptions: [
    'Bayram Günü Zəng Növbəsinin Müəyyən Edilməsi haqqında Xəbərdarlıq',
    'Təbrik Zənglərinin Ardıcıllığı haqqında Təcili Teleqram',
    'Kimin Kimə Birinci Zəng Etməsi haqqında Xəbərdarlıq',
    'Bayram Rabitəsinin Nizamlanması haqqında Bildiriş'
  ],
  powersOptions: [
    'Böyüklərə zəng birinci edilir.',
    'Zənglərin sayı gün ərzində bölüşdürülür.',
    'Səsli mesaj zəngi əvəz etmir.',
    'Cavabsız zəng növbəti gün təkrarlanır.',
    'Video zəng üstünlük təşkil edir.',
    'Uzaq şəhərlərdəki qohumlar səhər saatlarında axtarılır.',
    'Qrup təbriki fərdi zəngi əvəz etmir.',
    'Siyahı hər bayramdan sonra yenilənir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Siyahıda göstərilən şəxslərdən biri unudulduqda növbəti bayramda zəng növbəsi tam olaraq digər tərəfin üzərinə düşür.',
    'Xəbərdarlıq bayram günü qüvvədədir.',
    'Siyahı hər iki ailə üçün ayrıca tərtib olunur.'
  ]
},
{
  id: 'nesihet-reyi', cat: 'relatives', tone: 'zarafat', layout: 'ekspertiza', palette: 'steel', active: false,
  title: 'Verilmiş Nəsihətin Praktiki Tətbiq İmkanlarının Qiymətləndirilməsi Rəyi', tag: 'Nəsihət',
  signOrg: 'Qohum Sualları və Sosial Təzyiq üzrə Komissiya',
  preamble: 'Aparılmış qiymətləndirmə nəticəsində müəyyən edilmişdir ki, {from} tərəfindən {to} adlı şəxsə verilən nəsihətlərin bir hissəsi cari şəraitə tam uyğun gəlmir. Rəy heç bir tərəfin təcrübəsini şübhə altına almır.',
  powers: 'Nəsihətlərin üçdə biri bu gün də aktualdır.\n«Bizim vaxtımızda» arqumenti müqayisə üçün yararlı deyil.\nŞərait və qiymətlər əhəmiyyətli dərəcədə dəyişib.\nNiyyətin səmimiliyinə şübhə yoxdur.',
  penalty: 'Rəy nəsihət verməyi məhdudlaşdırmır. Yalnız tövsiyənin xahişdən sonra verilməsi hər iki tərəf üçün daha faydalı hesab edilir.',
  titleOptions: [
    'Verilmiş Nəsihətin Praktiki Tətbiq İmkanlarının Qiymətləndirilməsi Rəyi',
    '«Bizim vaxtımızda» Arqumentinin Aktuallığına dair Rəy',
    'Nəsillərarası Təcrübə Ötürülməsinin Təhlilinə dair Rəy',
    'Verilən Tövsiyələrin Cari Şəraitə Uyğunluğuna dair Rəy'
  ],
  powersOptions: [
    'Nəsihətlərin üçdə biri bu gün də aktualdır.',
    '«Bizim vaxtımızda» arqumenti müqayisə üçün yararlı deyil.',
    'Şərait və qiymətlər əhəmiyyətli dərəcədə dəyişib.',
    'Niyyətin səmimiliyinə şübhə yoxdur.',
    'Ən faydalı tövsiyələr məişətə aiddir.',
    'Maliyyə tövsiyələri yenidən baxılmalıdır.',
    'Nəsihətlər soruşulduqda daha yaxşı qəbul edilir.',
    'Qarşılıqlı dinləmə nəticəni yaxşılaşdırır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Rəy nəsihət verməyi məhdudlaşdırmır. Yalnız tövsiyənin xahişdən sonra verilməsi hər iki tərəf üçün daha faydalı hesab edilir.',
    'Rəy hər il yenidən qiymətləndirilir.',
    'Nəticələr ailə şurasında müzakirə edilə bilər.'
  ]
},
{
  id: 'qrup-cati-telebe', cat: 'student', tone: 'zarafat', layout: 'blank', palette: 'ink', active: false,
  title: 'Qrup Söhbətində Suala Cavab Verilməməsi Halı haqqında Bildiriş', tag: 'Qrup çatı',
  signOrg: 'Auditoriya Nizamı və Davamiyyət üzrə Baş İdarə',
  preamble: 'Daxil olmuş müraciətə baxılaraq bildirilir ki, {to} adlı şəxsin qrup söhbətində verdiyi sual iki saat ərzində cavabsız qalmışdır. {from} tərəfindən qrupda otuz dörd nəfərin onlayn olduğu qeyd edilir.',
  powers: 'Sual iki saat cavabsız qalıb.\nQrupda onlarla iştirakçı onlayn olub.\nSual sonradan şəxsi mesajla cavablandırılıb.\nCavab verən şəxsə ayrıca təşəkkür bildirilib.',
  penalty: 'Bildiriş heç kimə qarşı ittiham xarakteri daşımır. Lakin cavabsız qalan suallar imtahan dövründə ayrıca qeydə alınır.',
  titleOptions: [
    'Qrup Söhbətində Suala Cavab Verilməməsi Halı haqqında Bildiriş',
    '«Sabah nə var?» Sualının Cavabsız Qalması haqqında Bildiriş',
    'Qrupda Məlumat Paylaşımının Vəziyyəti haqqında Bildiriş',
    'Cədvəl Dəyişikliyinin Çatdırılmaması haqqında Bəyannamə'
  ],
  powersOptions: [
    'Sual iki saat cavabsız qalıb.',
    'Qrupda onlarla iştirakçı onlayn olub.',
    'Sual sonradan şəxsi mesajla cavablandırılıb.',
    'Cavab verən şəxsə ayrıca təşəkkür bildirilib.',
    'Eyni sual əvvəllər də verilib.',
    'Cavab qrupun sabitlənmiş mesajındadır.',
    'Cədvəl dəyişikliyi vaxtında paylaşılmayıb.',
    'Növbəti dəfə nümayəndəyə müraciət ediləcək.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Bildiriş heç kimə qarşı ittiham xarakteri daşımır. Lakin cavabsız qalan suallar imtahan dövründə ayrıca qeydə alınır.',
    'Bildiriş cavab verildikdə arxivə verilir.',
    'Qrupun məlumat qaydaları yenidən elan edilir.'
  ]
},
{
  id: 'son-gece-hazirlig', cat: 'student', tone: 'zarafat', layout: 'ekspertiza', palette: 'burgundy', active: false,
  title: 'Bir Gecəlik Hazırlığın Effektivliyinin Qiymətləndirilməsinə dair Rəy', tag: 'İmtahan',
  signOrg: 'Tələbə Öhdəlikləri və İmtahan Rejimi üzrə Şura',
  preamble: 'Aparılmış qiymətləndirmə nəticəsində müəyyən edilmişdir ki, {to} adlı şəxsin bir gecəlik hazırlıq metodu qısamüddətli nəticə verir. Rəy {from} tərəfindən verilmiş müraciət və müşahidə qeydləri əsasında tərtib olunmuşdur.',
  powers: 'Mənimsəmə səviyyəsi qırx faiz qiymətləndirilir.\nMəlumatın saxlanma müddəti iki gündür.\nƏn çətin mövzu axıra saxlanılıb və açılmayıb.\nMetod imtahandan keçmək üçün kifayət edir.',
  penalty: 'Rəy metodun tətbiqini qadağan etmir. Lakin növbəti semestrdə eyni nəticə üçün daha çox vaxt tələb olunacağı qeyd edilir.',
  titleOptions: [
    'Bir Gecəlik Hazırlığın Effektivliyinin Qiymətləndirilməsinə dair Rəy',
    'Semestrin Bir Gecəyə Sığdırılması Cəhdinə dair Ekspert Rəyi',
    'Qəhvə Sərfiyyatı ilə Nəticə Arasındakı Əlaqəyə dair Rəy',
    'Səhərə Qədər Oxumanın Nəticələrinin Təhlilinə dair Rəy'
  ],
  powersOptions: [
    'Mənimsəmə səviyyəsi qırx faiz qiymətləndirilir.',
    'Məlumatın saxlanma müddəti iki gündür.',
    'Ən çətin mövzu axıra saxlanılıb və açılmayıb.',
    'Metod imtahandan keçmək üçün kifayət edir.',
    'Qəhvə sərfiyyatı norma həddini aşıb.',
    'İlk iki saat mövzu axtarışına gedib.',
    'Qrup söhbətində sual mübadiləsi faydalı olub.',
    'Yuxu rejimi tam pozulub.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Rəy metodun tətbiqini qadağan etmir. Lakin növbəti semestrdə eyni nəticə üçün daha çox vaxt tələb olunacağı qeyd edilir.',
    'Rəy yalnız bir imtahan dövrünə aiddir.',
    'Nəticələr semestrin sonunda yenidən ölçülür.'
  ]
},
{
  id: 'qrup-isi-payi', cat: 'student', tone: 'zarafat', layout: 'muqavile', palette: 'forest', active: false,
  title: 'Qrup Layihəsində İş Bölgüsünün Razılaşdırılması üzrə Protokol', tag: 'Qrup işi',
  signOrg: 'Tələbə Öhdəlikləri və İmtahan Rejimi üzrə Şura',
  preamble: 'Tərəflərin mövqeyi nəzərə alınmaqla, {from} və {to} arasında qrup layihəsində iş bölgüsü barədə razılıq əldə edilmişdir. Protokol hər iştirakçının töhfəsini ayrıca qeydə alır və qiymətləndirmədə nəzərə alınır.',
  powers: 'Hər iştirakçının payı yazılı şəkildə müəyyən edilir.\nSlaydlar və mətn ayrı-ayrı şəxslərə həvalə olunur.\nSon yığım təqdimatdan iki gün əvvəl aparılır.\nİştirak etməyən şəxsin adı çıxışda qeyd edilmir.',
  penalty: 'Öhdəliyini yerinə yetirməyən iştirakçının adı təqdimatda göstərilmir və qiymətləndirmə fərdi qaydada aparılır.',
  titleOptions: [
    'Qrup Layihəsində İş Bölgüsünün Razılaşdırılması üzrə Protokol',
    'Layihə Öhdəliklərinin Bərabər Bölünməsi üzrə Saziş',
    'İştirakçıların Töhfəsinin Qeydə Alınması üzrə Protokol',
    'Təqdimat və Slayd Hazırlığının Bölgüsü üzrə Müqavilə'
  ],
  powersOptions: [
    'Hər iştirakçının payı yazılı şəkildə müəyyən edilir.',
    'Slaydlar və mətn ayrı-ayrı şəxslərə həvalə olunur.',
    'Son yığım təqdimatdan iki gün əvvəl aparılır.',
    'İştirak etməyən şəxsin adı çıxışda qeyd edilmir.',
    'Ədəbiyyat siyahısı birgə tərtib olunur.',
    'Fayl ümumi buludda saxlanılır.',
    'Dizayn işi könüllü əsasda götürülür.',
    'Suallara cavab növbə ilə verilir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Öhdəliyini yerinə yetirməyən iştirakçının adı təqdimatda göstərilmir və qiymətləndirmə fərdi qaydada aparılır.',
    'Protokol yalnız bir layihəyə şamil edilir.',
    'Bölgü qrupun razılığı ilə dəyişdirilə bilər.'
  ]
},
{
  id: 'yataqxana-sesi', cat: 'student', tone: 'zarafat', layout: 'qerar', palette: 'steel', active: false,
  title: 'Yataqxanada Gecə Səs Rejiminin Pozulması haqqında Yekun Qərar', tag: 'Yataqxana',
  signOrg: 'Yataqxana Məsələləri üzrə Qarşılıqlı Komissiya',
  preamble: 'Komissiya {to} adlı şəxsin otağından gələn səs barədə daxil olmuş müraciətə baxmış və müəyyən etmişdir ki, gecə rejimi ardıcıl üç gecə pozulmuşdur. {from} tərəfindən verilmiş şikayət əsaslı hesab olunur.',
  powers: 'Gecə saat 24:00-dan sonra səs həddi azaldılsın.\nİmtahan dövründə tam səssizlik rejimi tətbiq edilsin.\nQonaq qəbulu əvvəlcədən otaq yoldaşları ilə razılaşdırılsın.\nQulaqlıqdan istifadə tövsiyə edilsin.',
  penalty: 'Rejim yenidən pozulduqda məsələ yataqxana müdiriyyətinin gündəliyinə salınır və otaq bölgüsü yenidən nəzərdən keçirilir.',
  titleOptions: [
    'Yataqxanada Gecə Səs Rejiminin Pozulması haqqında Yekun Qərar',
    'İmtahan Dövründə Səssizlik Rejimi haqqında Qərar',
    'Otaqda Qonaq Qəbulu Qaydaları haqqında Yekun Qətnamə',
    'Gecə Saatlarında Musiqi Səsi haqqında Rəsmi Qərar'
  ],
  powersOptions: [
    'Gecə saat 24:00-dan sonra səs həddi azaldılsın.',
    'İmtahan dövründə tam səssizlik rejimi tətbiq edilsin.',
    'Qonaq qəbulu əvvəlcədən otaq yoldaşları ilə razılaşdırılsın.',
    'Qulaqlıqdan istifadə tövsiyə edilsin.',
    'Şikayətlərin sayı protokola daxil edilib.',
    'Səhər saatlarında rejim yumşaldılır.',
    'Doğum günü qeydləri istisna hal sayılır.',
    'Qonşu otaqlar da məlumatlandırılıb.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Rejim yenidən pozulduqda məsələ yataqxana müdiriyyətinin gündəliyinə salınır və otaq bölgüsü yenidən nəzərdən keçirilir.',
    'Qərar bütün otaqlara eyni qaydada şamil olunur.',
    'Etiraz qeydə alınır, lakin rejimi dəyişdirmir.'
  ]
},
{
  id: 'konspekt-diplomu', cat: 'student', tone: 'zarafat', layout: 'diplom', palette: 'gold', active: false,
  title: 'Konspektin Səliqəli Aparılmasına və Paylaşılmasına Görə Fəxri Diplom', tag: 'Fəxri ad',
  signOrg: 'Auditoriya Nizamı və Davamiyyət üzrə Baş İdarə',
  preamble: 'Baş İdarə {to} adlı şəxsin semestr boyunca apardığı qeydləri və onları qrupla paylaşmaq təşəbbüsünü qiymətləndirərək təltif haqqında qərar qəbul etmişdir. Diplom {from} tərəfindən qrupun yekdil rəyi ilə təqdim olunur.',
  powers: 'Konspekt semestr boyunca fasiləsiz aparılıb.\nBuraxılmış dərslərin qeydləri sonradan tamamlanıb.\nMaterial imtahandan əvvəl qrupla paylaşılıb.\nHeç bir əvəz tələb edilməyib.',
  penalty: 'Diplom geri alınmır. Təltif olunan şəxs növbəti semestrdə konspekt aparmaqdan imtina etmək hüququnu saxlayır.',
  titleOptions: [
    'Konspektin Səliqəli Aparılmasına və Paylaşılmasına Görə Fəxri Diplom',
    'Qrupu Xilas Edən Qeydlərə Görə Verilmiş Fəxri Diplom',
    'İmtahan Ərəfəsində Göstərilən Köməyə Görə Diplom',
    'Dərs Materiallarının Sistemləşdirilməsinə Görə Fəxri Nişan'
  ],
  powersOptions: [
    'Konspekt semestr boyunca fasiləsiz aparılıb.',
    'Buraxılmış dərslərin qeydləri sonradan tamamlanıb.',
    'Material imtahandan əvvəl qrupla paylaşılıb.',
    'Heç bir əvəz tələb edilməyib.',
    'Xətt oxunaqlı və səliqəlidir.',
    'Vacib yerlər ayrıca işarələnib.',
    'Müəllimin əlavə qeydləri də yazılıb.',
    'Sxem və cədvəllər əl ilə çəkilib.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Diplom geri alınmır. Təltif olunan şəxs növbəti semestrdə konspekt aparmaqdan imtina etmək hüququnu saxlayır.',
    'Təltif hər semestrin sonunda yenilənir.',
    'Diplom qrup arxivində saxlanılır.'
  ]
},
{
  id: 'lift-qaydalari', cat: 'neighbors', tone: 'zarafat', layout: 'blank', palette: 'forest', active: false,
  title: 'Liftdən İstifadə Qaydalarının Sakinlərə Çatdırılması haqqında Bildiriş', tag: 'Lift',
  signOrg: 'Ümumi İstifadə Sahələri üzrə Qarşılıqlı Komissiya',
  preamble: 'Daxil olmuş müraciətə baxılaraq bildirilir ki, liftdən istifadə qaydaları yenidən müəyyən edilmişdir. {from} tərəfindən verilmiş təkliflər və {to} adlı şəxsin mövqeyi qərarın hazırlanmasında nəzərə alınmışdır.',
  powers: 'Lift qapısı əl ilə saxlanılmır.\nAğır yük daşınarkən qonşulara xəbər verilir.\nKabinədə zibil saxlanılmır.\nUşaqlar tək buraxılmır.',
  penalty: 'Qaydaların pozulması halında məsələ ilk növbədə şifahi bildirilir; təkrarlandıqda ümumi yığıncağın gündəliyinə salınır.',
  titleOptions: [
    'Liftdən İstifadə Qaydalarının Sakinlərə Çatdırılması haqqında Bildiriş',
    'Lift Kabinəsində Nizamın Qorunması haqqında Bildiriş',
    'Ağır Yükün Daşınması Qaydası haqqında Rəsmi Bildiriş',
    'Lift Növbəsində Nəzakət Qaydaları haqqında Bəyannamə'
  ],
  powersOptions: [
    'Lift qapısı əl ilə saxlanılmır.',
    'Ağır yük daşınarkən qonşulara xəbər verilir.',
    'Kabinədə zibil saxlanılmır.',
    'Uşaqlar tək buraxılmır.',
    'Nasazlıq barədə dərhal məlumat verilir.',
    'Təmir işi zamanı pilləkəndən istifadə olunur.',
    'Kabinənin təmizliyi növbə ilə aparılır.',
    'Ev heyvanı ilə istifadə razılaşdırılır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Qaydaların pozulması halında məsələ ilk növbədə şifahi bildirilir; təkrarlandıqda ümumi yığıncağın gündəliyinə salınır.',
    'Bildiriş binanın bütün mənzillərinə şamil edilir.',
    'Qaydalar hər il yenidən elan olunur.'
  ]
},
{
  id: 'qonsu-alet-borcu', cat: 'neighbors', tone: 'zarafat', layout: 'muqavile', palette: 'gold', active: false,
  title: 'Qonşudan Alət və Avadanlıq Borc Alma Qaydası üzrə Protokol', tag: 'Borc',
  signOrg: 'Ümumi İstifadə Sahələri üzrə Qarşılıqlı Komissiya',
  preamble: 'Tərəflərin mövqeyi nəzərə alınmaqla, {from} və {to} arasında alət və avadanlığın borc verilməsi qaydaları barədə razılıq əldə edilmişdir. Protokol qaytarılma müddətini və alətin vəziyyətinə görə məsuliyyəti əhatə edir.',
  powers: 'Alət üç gün ərzində qaytarılır.\nQaytarılma zamanı vəziyyət birgə yoxlanılır.\nZədələnmə halında bərpa borc alanın öhdəsindədir.\nAlət üçüncü şəxsə ötürülmür.',
  penalty: 'Alət razılaşdırılmış müddətdə qaytarılmadıqda növbəti müraciətlərə baxılmır və protokol qüvvədən düşür.',
  titleOptions: [
    'Qonşudan Alət və Avadanlıq Borc Alma Qaydası üzrə Protokol',
    'Borc Alınmış Alətin Qaytarılma Müddəti üzrə Saziş',
    'Alətin Vəziyyətinə Görə Məsuliyyətin Bölgüsü üzrə Protokol',
    'Qarşılıqlı Yardım Qaydalarının Təsbiti üzrə Müqavilə'
  ],
  powersOptions: [
    'Alət üç gün ərzində qaytarılır.',
    'Qaytarılma zamanı vəziyyət birgə yoxlanılır.',
    'Zədələnmə halında bərpa borc alanın öhdəsindədir.',
    'Alət üçüncü şəxsə ötürülmür.',
    'Təcili hallarda müddət qısaldılır.',
    'Sərf materialı borc alan tərəfindən alınır.',
    'Alət təmiz qaytarılır.',
    'İstifadə qaydası əvvəlcədən izah edilir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Alət razılaşdırılmış müddətdə qaytarılmadıqda növbəti müraciətlərə baxılmır və protokol qüvvədən düşür.',
    'Protokol hər iki tərəfə eyni qaydada şamil olunur.',
    'Alətin itməsi əvəzlənmə öhdəliyi yaradır.'
  ]
},
{
  id: 'heyet-mangali', cat: 'neighbors', tone: 'zarafat', layout: 'viza', palette: 'burgundy', active: false,
  title: 'Həyətdə Mangal Qurulması və Tüstünün Tənzimlənməsinə dair İcazə', tag: 'Həyət',
  signOrg: 'Həyət və Qonşuluq Mübahisələri üzrə Ali Şura',
  preamble: '{from} tərəfindən {to} adlı şəxsə həyətdə mangal qurmaq üçün icazə verilir. İcazə tüstünün istiqaməti, tədbirin müddəti və sonrakı təmizlik öhdəliyi ilə bağlı şərtlər çərçivəsində qüvvədədir.',
  powers: 'Tüstü qonşu balkonlara yönəldilmir.\nTədbir saat 22:00-a qədər başa çatdırılır.\nKömür və zibil ardınca yığılır.\nQonşulara əvvəlcədən xəbər verilir.',
  penalty: 'Şərtlərin pozulması halında icazə növbəti mövsümə qədər dayandırılır və yeni müraciətə ümumi yığıncaqda baxılır.',
  titleOptions: [
    'Həyətdə Mangal Qurulması və Tüstünün Tənzimlənməsinə dair İcazə',
    'Açıq Havada Yemək Hazırlanmasına dair Məhdud İcazə',
    'Tüstünün Qonşu Balkonlara Yönəldilməməsinə dair İcazə',
    'Həyət Tədbirinin Vaxt Hüdudlarına dair Xüsusi İcazə'
  ],
  powersOptions: [
    'Tüstü qonşu balkonlara yönəldilmir.',
    'Tədbir saat 22:00-a qədər başa çatdırılır.',
    'Kömür və zibil ardınca yığılır.',
    'Qonşulara əvvəlcədən xəbər verilir.',
    'Uşaq meydançasından kənarda qurulur.',
    'Yanğın təhlükəsizliyi qaydalarına əməl olunur.',
    'Musiqi səsi normal həddə saxlanılır.',
    'Qonşulara pay təklif edilir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Şərtlərin pozulması halında icazə növbəti mövsümə qədər dayandırılır və yeni müraciətə ümumi yığıncaqda baxılır.',
    'İcazə yalnız bir tədbirə şamil edilir.',
    'Külək güclü olduqda icazə qüvvədən düşür.'
  ]
},
{
  id: 'podyezd-qapisi', cat: 'neighbors', tone: 'zarafat', layout: 'teleqram', palette: 'ink', active: false,
  title: 'Giriş Qapısının Açıq Qalması Halı haqqında Təcili Xəbərdarlıq', tag: 'Xəbərdarlıq',
  signOrg: 'Səs-Küy və Gecə Rejimi üzrə Nəzarət İdarəsi',
  preamble: 'Sizə bildiririk ki, binanın giriş qapısı bu həftə üçüncü dəfə açıq vəziyyətdə aşkarlanmışdır. {from} tərəfindən {to} adlı şəxsin də daxil olduğu bütün sakinlərdən diqqətli olmaq xahiş edilir.',
  powers: 'Qapı gecə saatlarında açıq qalıb.\nDomofon kodu kənar şəxslərə verilib.\nQapının bağlayıcısı nasaz vəziyyətdədir.\nTəmir üçün ümumi vəsait ayrılır.',
  penalty: 'Hal təkrarlandıqda bağlayıcının təmiri üçün ümumi vəsait toplanır və domofon kodu bütün sakinlər üçün dəyişdirilir.',
  titleOptions: [
    'Giriş Qapısının Açıq Qalması Halı haqqında Təcili Xəbərdarlıq',
    'Domofon Kodunun Kənar Şəxslərə Verilməsi haqqında Teleqram',
    'Binanın Təhlükəsizlik Rejiminin Pozulması haqqında Xəbərdarlıq',
    'Qapının Bağlanmaması Halının Təkrarı haqqında Bildiriş'
  ],
  powersOptions: [
    'Qapı gecə saatlarında açıq qalıb.',
    'Domofon kodu kənar şəxslərə verilib.',
    'Qapının bağlayıcısı nasaz vəziyyətdədir.',
    'Təmir üçün ümumi vəsait ayrılır.',
    'Kuryerlərə kod bir dəfəlik verilir.',
    'Qonaqlar şəxsən qarşılanır.',
    'Nasazlıq barədə idarəyə məlumat verilib.',
    'Kameranın quraşdırılması müzakirə olunur.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Hal təkrarlandıqda bağlayıcının təmiri üçün ümumi vəsait toplanır və domofon kodu bütün sakinlər üçün dəyişdirilir.',
    'Xəbərdarlıq elan lövhəsində yerləşdirilir.',
    'Vəziyyət düzəldildikdə xəbərdarlıq arxivə verilir.'
  ]
},
{
  id: 'qonsu-kediyi', cat: 'neighbors', tone: 'zarafat', layout: 'arayis', palette: 'steel', active: false,
  title: 'Qonşu Ev Heyvanının Balkona Keçidi Halı haqqında Rəsmi Arayış', tag: 'Heyvan',
  signOrg: 'Həyət və Qonşuluq Mübahisələri üzrə Ali Şura',
  preamble: 'Verilir {to} adlı şəxsə ondan ötrü ki, {from} adlı şəxsə məxsus ev heyvanının balkona keçid halları qeydə alınmışdır. Keçidlər zərər vurmamış, lakin gül qablarının yeri dəyişdirilmişdir.',
  powers: 'Keçid halları son ayda dörd dəfə qeydə alınıb.\nHeç bir zərər vurulmayıb.\nGül qablarının yeri dəyişdirilib.\nHeyvan hər dəfə öz balkonuna qayıdıb.',
  penalty: 'Arayış heç bir tələb irəli sürmür. Zərər hallarında məsələ qonşuluq qaydası üzrə birbaşa söhbətlə həll edilir.',
  titleOptions: [
    'Qonşu Ev Heyvanının Balkona Keçidi Halı haqqında Rəsmi Arayış',
    'Ev Heyvanının Ərazi Sərhədlərini Aşması haqqında Arayış',
    'Qonşuluqda Heyvan Davranışının Qeydə Alınması haqqında Arayış',
    'Balkonlar Arasında Keçid Halları haqqında Rəsmi Arayış'
  ],
  powersOptions: [
    'Keçid halları son ayda dörd dəfə qeydə alınıb.',
    'Heç bir zərər vurulmayıb.',
    'Gül qablarının yeri dəyişdirilib.',
    'Heyvan hər dəfə öz balkonuna qayıdıb.',
    'Keçid vaxtı əsasən günorta saatlarına düşür.',
    'Yemləmə cəhdi qeydə alınmayıb.',
    'Tor çəkilməsi variantı müzakirə olunur.',
    'Sahibə məlumat verilib.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Arayış heç bir tələb irəli sürmür. Zərər hallarında məsələ qonşuluq qaydası üzrə birbaşa söhbətlə həll edilir.',
    'Arayış yalnız məlumat xarakteri daşıyır.',
    'Tor çəkildikdə arayış arxivə verilir.'
  ]
},
{
  id: 'toy-devetnamesi', cat: 'holiday', tone: 'zarafat', layout: 'arayis', palette: 'steel', active: false,
  title: 'Toy Dəvətnaməsinin Çatdırılması və İştirak Təsdiqi haqqında Arayış', tag: 'Dəvət',
  signOrg: 'Toy Davranışlarına Nəzarət üzrə Baş İdarə',
  preamble: 'Verilir {to} adlı şəxsə ondan ötrü ki, mərasim dəvətnaməsinin çatdırılması {from} tərəfindən yoxlanılmışdır. Dəvətnamə vaxtında göndərilmiş, çatdırılma faktı isə yazışma ilə təsdiqlənmişdir.',
  powers: 'Dəvətnamə mərasimdən üç həftə əvvəl göndərilib.\nÇatdırılma faktı yazışma ilə təsdiqlənib.\nİştirak təsdiqi bir həftə əvvəl toplanıb.\n«Bizi çağırmadılar» iddiası əsassız hesab edilir.',
  penalty: 'Arayış heç bir iddianı bağlamır. Lakin dəvətnaməni almadığını bildirən şəxslər yazışma qeydlərinə istinad edə bilməz.',
  titleOptions: [
    'Toy Dəvətnaməsinin Çatdırılması və İştirak Təsdiqi haqqında Arayış',
    'Dəvətnamənin Kimə Çatdığının Dəqiqləşdirilməsi haqqında Arayış',
    'İştirak Təsdiqinin Toplanması Vəziyyəti haqqında Arayış',
    '«Bizi çağırmadılar» İddiasının Yoxlanılması haqqında Arayış'
  ],
  powersOptions: [
    'Dəvətnamə mərasimdən üç həftə əvvəl göndərilib.',
    'Çatdırılma faktı yazışma ilə təsdiqlənib.',
    'İştirak təsdiqi bir həftə əvvəl toplanıb.',
    '«Bizi çağırmadılar» iddiası əsassız hesab edilir.',
    'Uzaq qohumlara ayrıca zəng edilib.',
    'Uşaqlı ailələr ayrıca qeyd olunub.',
    'Dəvətnamədə masa nömrəsi göstərilib.',
    'Ünvan və vaxt iki dəfə təkrarlanıb.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Arayış heç bir iddianı bağlamır. Lakin dəvətnaməni almadığını bildirən şəxslər yazışma qeydlərinə istinad edə bilməz.',
    'Arayış yalnız bir mərasimə şamil edilir.',
    'Yeni dəlillər aşkarlandıqda yoxlama təkrarlanır.'
  ]
},
{
  id: 'bayram-temizliyi', cat: 'holiday', tone: 'zarafat', layout: 'muqavile', palette: 'forest', active: false,
  title: 'Bayram Ərəfəsi Təmizlik İşlərinin Bölüşdürülməsi üzrə Protokol', tag: 'Hazırlıq',
  signOrg: 'Bayram Süfrəsi və Qonaq Qəbulu üzrə Ali Şura',
  preamble: 'Tərəflərin mövqeyi nəzərə alınmaqla, {from} və {to} arasında bayram ərəfəsi təmizlik işlərinin bölüşdürülməsi barədə razılıq əldə edilmişdir. Protokol həm iş həcmini, həm də icra müddətini əhatə edir.',
  powers: 'Pəncərələr bayramdan üç gün əvvəl yuyulur.\nXalça işi hər iki tərəf tərəfindən birgə görülür.\nŞkafların içi könüllü əsasda nizama salınır.\nBişirmə işi təmizlikdən sonra başlanır.',
  penalty: 'Öhdəliyini vaxtında yerinə yetirməyən tərəf bayram süfrəsinin yığılmasını təkbaşına həyata keçirir.',
  titleOptions: [
    'Bayram Ərəfəsi Təmizlik İşlərinin Bölüşdürülməsi üzrə Protokol',
    'Ev Hazırlığı Öhdəliklərinin Bərabər Bölgüsü üzrə Saziş',
    'Təmizlik Cədvəlinin Bayramadək İcrası üzrə Protokol',
    'Pəncərə və Xalça İşlərinin Növbəliliyi üzrə Müqavilə'
  ],
  powersOptions: [
    'Pəncərələr bayramdan üç gün əvvəl yuyulur.',
    'Xalça işi hər iki tərəf tərəfindən birgə görülür.',
    'Şkafların içi könüllü əsasda nizama salınır.',
    'Bişirmə işi təmizlikdən sonra başlanır.',
    'Şirniyyat hazırlığı ayrıca planlaşdırılır.',
    'Uşaqlara yüngül tapşırıqlar verilir.',
    'Qonaq otağı ən sonda hazırlanır.',
    'Alış-veriş siyahısı birgə tərtib olunur.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Öhdəliyini vaxtında yerinə yetirməyən tərəf bayram süfrəsinin yığılmasını təkbaşına həyata keçirir.',
    'Protokol hər bayram üçün yenidən bağlanır.',
    'Xəstəlik halında öhdəlik keçirilir.'
  ]
},
{
  id: 'novruz-tonqal', cat: 'holiday', tone: 'zarafat', layout: 'lisenziya', palette: 'gold', active: false,
  title: 'Novruz Tonqalının Qurulması və Üzərindən Atlanmasına dair İcazə', tag: 'Novruz',
  signOrg: 'Bayram Süfrəsi və Qonaq Qəbulu üzrə Ali Şura',
  preamble: '{from} tərəfindən {to} adlı şəxsə Novruz tonqalının qurulması üçün icazə verilir. İcazə tonqalın ölçüsü, yeri və atlanma proseduru ilə bağlı təhlükəsizlik şərtləri çərçivəsində qüvvədədir.',
  powers: 'Tonqalın hündürlüyü diz səviyyəsini keçmir.\nUşaqlar yalnız böyüklərin müşayiəti ilə atlanır.\nSu ehtiyatı əvvəlcədən hazırlanır.\nAlov tam sönmədən həyət tərk edilmir.',
  penalty: 'Şərtlərin pozulması halında icazə dərhal qüvvədən düşür və növbəti il üçün müraciətə ümumi yığıncaqda baxılır.',
  titleOptions: [
    'Novruz Tonqalının Qurulması və Üzərindən Atlanmasına dair İcazə',
    'Bayram Tonqalının Təhlükəsiz Qurulmasına dair Lisenziya',
    'Atlanma Prosedurunun Yaş Hədlərinə dair Xüsusi İcazə',
    'Həyətdə Açıq Alov İşlərinə dair Müddətli Lisenziya'
  ],
  powersOptions: [
    'Tonqalın hündürlüyü diz səviyyəsini keçmir.',
    'Uşaqlar yalnız böyüklərin müşayiəti ilə atlanır.',
    'Su ehtiyatı əvvəlcədən hazırlanır.',
    'Alov tam sönmədən həyət tərk edilmir.',
    'Tonqal binadan uzaqda qurulur.',
    'Sintetik material yandırılmır.',
    'Qonşulara əvvəlcədən xəbər verilir.',
    'Şəkil çəkilişi təhlükəsiz məsafədən aparılır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Şərtlərin pozulması halında icazə dərhal qüvvədən düşür və növbəti il üçün müraciətə ümumi yığıncaqda baxılır.',
    'İcazə yalnız bayram gecəsinə şamil edilir.',
    'Külək güclü olduqda icazə avtomatik dayandırılır.'
  ]
},
{
  id: 'bayram-menyusu', cat: 'holiday', tone: 'zarafat', layout: 'ekspertiza', palette: 'ink', active: false,
  title: 'Bayram Süfrəsi Menyusunun Həcminin Qiymətləndirilməsinə dair Rəy', tag: 'Menyu',
  signOrg: 'Bayram Süfrəsi və Qonaq Qəbulu üzrə Ali Şura',
  preamble: 'Aparılmış qiymətləndirmə nəticəsində müəyyən edilmişdir ki, {from} tərəfindən planlaşdırılan bayram menyusunun həcmi gözlənilən qonaq sayını iki dəfədən çox üstələyir. Rəy {to} adlı şəxsin müraciəti əsasında tərtib olunmuşdur.',
  powers: 'Menyu qonaq sayını iki dəfə üstələyir.\nQalıqların üç günə bəs edəcəyi hesablanır.\nÜç yeməyin siyahıdan çıxarılması tövsiyə olunur.\n«Az olar» ehtimalı statistik olaraq təsdiqlənmir.',
  penalty: 'Rəy menyuya müdaxilə etmir. Lakin qalıqların həcmi proqnozu aşarsa, növbəti bayramda planlama birgə aparılır.',
  titleOptions: [
    'Bayram Süfrəsi Menyusunun Həcminin Qiymətləndirilməsinə dair Rəy',
    'Hazırlanan Yeməyin Qonaq Sayına Uyğunluğuna dair Rəy',
    'Süfrə Qalıqlarının Proqnozlaşdırılmasına dair Ekspert Rəyi',
    'Menyunun Optimallaşdırılması İmkanlarına dair Yekun Rəy'
  ],
  powersOptions: [
    'Menyu qonaq sayını iki dəfə üstələyir.',
    'Qalıqların üç günə bəs edəcəyi hesablanır.',
    'Üç yeməyin siyahıdan çıxarılması tövsiyə olunur.',
    '«Az olar» ehtimalı statistik olaraq təsdiqlənmir.',
    'Şirniyyat həcmi ayrıca hesablanıb.',
    'Qonşulara pay ayrılması nəzərə alınıb.',
    'Dondurulacaq hissə əvvəlcədən müəyyən edilib.',
    'Xüsusi pəhrizlər siyahıya salınıb.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Rəy menyuya müdaxilə etmir. Lakin qalıqların həcmi proqnozu aşarsa, növbəti bayramda planlama birgə aparılır.',
    'Rəy hər bayramdan sonra yenidən hesablanır.',
    'Qonaq sayı dəyişdikdə rəy yenilənir.'
  ]
},
{
  id: 'tebrik-siyahisi', cat: 'holiday', tone: 'zarafat', layout: 'vesiqe', palette: 'burgundy', active: false,
  title: 'Bayram Təbriki Göndəriləcək Şəxslərin Siyahısını Təsdiq edən Vəsiqə', tag: 'Təbrik',
  signOrg: 'Hədiyyə və Təbrik Öhdəlikləri üzrə Komissiya',
  preamble: 'Bu vəsiqə {to} adlı şəxsin bayram təbriki göndərəcəyi şəxslərin siyahısını təsdiq edir. Sənəd {from} tərəfindən tərtib olunmuş, hər iki ailənin qohumlarını əhatə edir və bayram günü boyunca qüvvədədir.',
  powers: 'Siyahı hər iki ailənin qohumlarını əhatə edir.\nBöyüklər siyahının əvvəlində yerləşdirilir.\nQrup təbriki fərdi mesajı əvəz etmir.\nSiyahı hər bayramdan sonra yenilənir.',
  penalty: 'Siyahıdakı şəxslərdən biri unudulduqda növbəti bayramda təbrik öhdəliyi tam olaraq digər tərəfin üzərinə düşür.',
  titleOptions: [
    'Bayram Təbriki Göndəriləcək Şəxslərin Siyahısını Təsdiq edən Vəsiqə',
    'Təbrik Növbəsinin və Ardıcıllığının Təsdiqinə dair Vəsiqə',
    'Heç Kimin Unudulmamasını Təmin edən Xatirə Vəsiqəsi',
    'Təbrik Öhdəliyinin Bölgüsünə dair Rəsmi Vəsiqə'
  ],
  powersOptions: [
    'Siyahı hər iki ailənin qohumlarını əhatə edir.',
    'Böyüklər siyahının əvvəlində yerləşdirilir.',
    'Qrup təbriki fərdi mesajı əvəz etmir.',
    'Siyahı hər bayramdan sonra yenilənir.',
    'Uzaq şəhərlərdəki qohumlar səhər axtarılır.',
    'Yeni tanışlar siyahıya növbəti il salınır.',
    'Cavabsız zənglər axşam təkrarlanır.',
    'Video zəng üstünlük təşkil edir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Siyahıdakı şəxslərdən biri unudulduqda növbəti bayramda təbrik öhdəliyi tam olaraq digər tərəfin üzərinə düşür.',
    'Vəsiqə hər bayram üçün yenidən tərtib edilir.',
    'Siyahıya əlavə hər iki tərəfin razılığı ilə edilir.'
  ]
},
{
  id: 'sened-yoxlanisi', cat: 'travel', tone: 'zarafat', layout: 'arayis', palette: 'ink', active: false,
  title: 'Səfər Sənədlərinin Tamlığının Yoxlanılmasının Nəticəsi haqqında Arayış', tag: 'Sənəd',
  signOrg: 'Baqaj və Yol Ehtiyatları üzrə Komissiya',
  preamble: 'Verilir {to} adlı şəxsə ondan ötrü ki, səfər sənədlərinin tamlığı {from} ilə birgə yoxlanılmışdır. Yoxlama yola çıxmazdan əvvəl aparılmış və bütün sənədlərin mövcudluğu təsdiqlənmişdir.',
  powers: 'Pasportların etibarlılıq müddəti yoxlanılıb.\nBiletlərin elektron nüsxəsi saxlanılıb.\nSənədlər bir nəfərdə cəmləşdirilib.\nEhtiyat surətlər buludda saxlanılır.',
  penalty: 'Arayış səfər boyunca qüvvədədir. Sənədlərin yeri dəyişdirildikdə hər iki tərəf dərhal məlumatlandırılır.',
  titleOptions: [
    'Səfər Sənədlərinin Tamlığının Yoxlanılmasının Nəticəsi haqqında Arayış',
    'Pasport və Biletlərin Mövcudluğu haqqında Rəsmi Arayış',
    'Yola Çıxmazdan Əvvəl Son Yoxlamanın Nəticəsi haqqında Arayış',
    'Sənədlərin Kimdə Saxlanılması haqqında Rəsmi Arayış'
  ],
  powersOptions: [
    'Pasportların etibarlılıq müddəti yoxlanılıb.',
    'Biletlərin elektron nüsxəsi saxlanılıb.',
    'Sənədlər bir nəfərdə cəmləşdirilib.',
    'Ehtiyat surətlər buludda saxlanılır.',
    'Sığorta sənədi ayrıca qovluqdadır.',
    'Sürücülük vəsiqəsi əldə saxlanılır.',
    'Uşaqların sənədləri ayrıca yoxlanılıb.',
    'Otel təsdiqi çap edilib.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Arayış səfər boyunca qüvvədədir. Sənədlərin yeri dəyişdirildikdə hər iki tərəf dərhal məlumatlandırılır.',
    'Arayış yalnız bir səfərə şamil edilir.',
    'Sənəd itdikdə yoxlama yenidən aparılır.'
  ]
},
{
  id: 'otel-nomresi', cat: 'travel', tone: 'zarafat', layout: 'ekspertiza', palette: 'steel', active: false,
  title: 'Otel Nömrəsinin Şəkillərlə Uyğunluğunun Qiymətləndirilməsinə dair Rəy', tag: 'Otel',
  signOrg: 'Səyahət Yoldaşları Arasında Mübahisələr üzrə Şura',
  preamble: 'Aparılmış qiymətləndirmə nəticəsində müəyyən edilmişdir ki, {to} və {from} tərəfindən seçilmiş otel nömrəsi elandakı şəkillərlə qismən uyğun gəlir. Fərqlər əsasən ölçü və mənzərə üzrə qeydə alınmışdır.',
  powers: 'Nömrənin ölçüsü şəkildəkindən kiçikdir.\nMənzərə vədi qismən yerinə yetirilib.\nTəmizlik səviyyəsi qənaətbəxşdir.\nSəhər yeməyi rəylərdən yaxşıdır.',
  penalty: 'Rəy seçim edən tərəfə qarşı iddia üçün əsas vermir. Növbəti səfərdə variantlar birgə müqayisə edilir.',
  titleOptions: [
    'Otel Nömrəsinin Şəkillərlə Uyğunluğunun Qiymətləndirilməsinə dair Rəy',
    'Rəylərin Real Vəziyyətlə Müqayisəsinə dair Ekspert Rəyi',
    'Mənzərə Vədinin Faktiki İcrasına dair Yekun Rəy',
    'Nömrənin Ölçüsünün Elandakı Məlumatla Uyğunluğu Rəyi'
  ],
  powersOptions: [
    'Nömrənin ölçüsü şəkildəkindən kiçikdir.',
    'Mənzərə vədi qismən yerinə yetirilib.',
    'Təmizlik səviyyəsi qənaətbəxşdir.',
    'Səhər yeməyi rəylərdən yaxşıdır.',
    'Şəkillər geniş bucaqlı obyektivlə çəkilib.',
    'Mərkəzə məsafə düzgün göstərilib.',
    'Kondisioner işlək vəziyyətdədir.',
    'Səs izolyasiyası orta səviyyədədir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Rəy seçim edən tərəfə qarşı iddia üçün əsas vermir. Növbəti səfərdə variantlar birgə müqayisə edilir.',
    'Rəy yalnız bir səfərə aiddir.',
    'Nömrə dəyişdirildikdə rəy yenilənir.'
  ]
},
{
  id: 'suvenir-alisi', cat: 'travel', tone: 'zarafat', layout: 'qerar', palette: 'gold', active: false,
  title: 'Səfərdən Gətiriləcək Suvenirlərin Siyahısı haqqında Yekun Qərar', tag: 'Suvenir',
  signOrg: 'Baqaj və Yol Ehtiyatları üzrə Komissiya',
  preamble: 'Şura {to} və {from} arasında suvenir alışı barədə yaranmış müzakirəyə baxaraq müəyyən etmişdir ki, ilkin siyahı baqaj çəkisi həddini əhəmiyyətli dərəcədə aşır. Məsələ üzrə yekun qərar qəbul edilmişdir.',
  powers: 'Suvenir siyahısı on iki nəfərlə məhdudlaşdırılsın.\nHər suvenirin çəkisi əvvəlcədən nəzərə alınsın.\nAlış son gün deyil, əvvəlcədən aparılsın.\nBüdcə həddi aşıldıqda siyahı qısaldılsın.',
  penalty: 'Baqaj çəkisi həddi aşıldıqda əlavə haqq siyahını genişləndirən tərəfin hesabına ödənilir.',
  titleOptions: [
    'Səfərdən Gətiriləcək Suvenirlərin Siyahısı haqqında Yekun Qərar',
    'Hədiyyə Büdcəsinin və Sayının Müəyyən Edilməsi haqqında Qərar',
    'Suvenir Alışının Baqaj Çəkisinə Təsiri haqqında Qərar',
    'Kimə Nə Alınacağı Məsələsi üzrə Yekun Qətnamə'
  ],
  powersOptions: [
    'Suvenir siyahısı on iki nəfərlə məhdudlaşdırılsın.',
    'Hər suvenirin çəkisi əvvəlcədən nəzərə alınsın.',
    'Alış son gün deyil, əvvəlcədən aparılsın.',
    'Büdcə həddi aşıldıqda siyahı qısaldılsın.',
    'Yerli məhsullar üstünlük təşkil etsin.',
    'Eyni hədiyyə bir neçə nəfərə verilə bilər.',
    'Kövrək əşyalar əl yükündə daşınsın.',
    'Uşaqlara ayrıca büdcə ayrılsın.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Baqaj çəkisi həddi aşıldıqda əlavə haqq siyahını genişləndirən tərəfin hesabına ödənilir.',
    'Qərar yalnız bir səfərə şamil edilir.',
    'Siyahı yola çıxmazdan əvvəl təsdiqlənir.'
  ]
},
{
  id: 'yolda-yuxu', cat: 'travel', tone: 'zarafat', layout: 'lisenziya', palette: 'forest', active: false,
  title: 'Sərnişin Qismində Yol Boyu Yuxuya Getmək Hüququna dair Lisenziya', tag: 'Yol',
  signOrg: 'Yol Hərəkəti və Marşrut Nizamı üzrə Baş İdarə',
  preamble: '{from} tərəfindən {to} adlı şəxsə uzun yol boyunca sərnişin qismində yuxuya getmək hüququ verilir. Lisenziya sürücünün öz növbəsi zamanı deyil, yalnız sərnişin mövqeyində qüvvədə hesab edilir.',
  powers: 'Yuxu yalnız sərnişin mövqeyində icazəlidir.\nSürücü yorulduqda dərhal oyanılır.\nNaviqasiya növbəsi əvvəlcədən ötürülür.\nDayanacaqlarda oyaq qalınır.',
  penalty: 'Sürücünün yorğunluq bildirdiyi anda lisenziya dərhal qüvvədən düşür və növbə dəyişikliyi həyata keçirilir.',
  titleOptions: [
    'Sərnişin Qismində Yol Boyu Yuxuya Getmək Hüququna dair Lisenziya',
    'Sürücüyə Yoldaşlıq Öhdəliyinin Hüdudlarına dair Lisenziya',
    'Uzun Yolda İstirahət Rejiminə dair Xüsusi İcazə',
    'Söhbətə Fasilə Verilməsi Hüququna dair Müddətli Lisenziya'
  ],
  powersOptions: [
    'Yuxu yalnız sərnişin mövqeyində icazəlidir.',
    'Sürücü yorulduqda dərhal oyanılır.',
    'Naviqasiya növbəsi əvvəlcədən ötürülür.',
    'Dayanacaqlarda oyaq qalınır.',
    'Musiqi səsi yuxuya mane olmamalıdır.',
    'Ön oturacaqda yuxu ayrıca razılaşdırılır.',
    'Sürücüyə hər saat söhbət təklif edilir.',
    'Gecə sürüşündə lisenziya dayandırılır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Sürücünün yorğunluq bildirdiyi anda lisenziya dərhal qüvvədən düşür və növbə dəyişikliyi həyata keçirilir.',
    'Lisenziya yalnız bir səfərə şamil edilir.',
    'Xəstəlik halında lisenziya genişləndirilir.'
  ]
},
{
  id: 'gec-catma', cat: 'travel', tone: 'zarafat', layout: 'teleqram', palette: 'burgundy', active: false,
  title: 'Təyinat Məntəqəsinə Gecikmə Riski haqqında Təcili Xəbərdarlıq', tag: 'Gecikmə',
  signOrg: 'Yol Hərəkəti və Marşrut Nizamı üzrə Baş İdarə',
  preamble: 'Sizə bildiririk ki, {to} adlı şəxsin iştirak etdiyi səfərdə gəlmə vaxtı ilkin planı iki saat üstələyir. {from} tərəfindən qarşılayan tərəfin dərhal məlumatlandırılması tələb olunur.',
  powers: 'Ləngimənin səbəbi yol vəziyyətidir.\nYeni gəlmə vaxtı hesablanıb.\nQarşılayan tərəf məlumatlandırılıb.\nMarşrut dəyişdirilməyib.',
  penalty: 'Gəlmə vaxtı bir daha dəyişərsə, qarşılayan tərəfin gözləmə yeri və şərtləri yenidən razılaşdırılır.',
  titleOptions: [
    'Təyinat Məntəqəsinə Gecikmə Riski haqqında Təcili Xəbərdarlıq',
    'Yolda Yaranmış Ləngimə haqqında Təxirəsalınmaz Teleqram',
    'Gəlmə Vaxtının Yenidən Hesablanması haqqında Xəbərdarlıq',
    'Qarşılayan Tərəfin Məlumatlandırılması haqqında Teleqram'
  ],
  powersOptions: [
    'Ləngimənin səbəbi yol vəziyyətidir.',
    'Yeni gəlmə vaxtı hesablanıb.',
    'Qarşılayan tərəf məlumatlandırılıb.',
    'Marşrut dəyişdirilməyib.',
    'Yanacaq dayanacağı planlaşdırıldığından uzun çəkib.',
    'Yemək fasiləsi qısaldılıb.',
    'Naviqasiya alternativ yol təklif edib.',
    'Növbəti məlumat bir saatdan sonra veriləcək.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Gəlmə vaxtı bir daha dəyişərsə, qarşılayan tərəfin gözləmə yeri və şərtləri yenidən razılaşdırılır.',
    'Xəbərdarlıq çatma anında qüvvədən düşür.',
    'Fövqəladə hallar ayrıca bildirilir.'
  ]
},
{
  id: 'heyvan-adi', cat: 'pets', tone: 'zarafat', layout: 'sertifikat', palette: 'gold', active: false,
  title: 'Ev Heyvanına Verilmiş Adın Rəsmi Qaydada Təsdiqi Sertifikatı', tag: 'Ad',
  signOrg: 'Ev Heyvanlarının Hüquqları üzrə Ali Şura',
  preamble: 'Bununla təsdiq edilir ki, {to} adlı şəxsə verilmiş ad ailə üzvləri arasında razılaşdırılmışdır. Sertifikat {from} tərəfindən verilir və gündəlik istifadədə formalaşmış ləqəbləri də qeydə alır.',
  powers: 'Ad ailə üzvləri arasında yekdilliklə seçilib.\nAda reaksiya üçüncü həftədən qeydə alınıb.\nGündəlik ləqəblər ayrıca siyahıya salınıb.\nRəsmi ad baytar sənədlərində göstərilib.',
  penalty: 'Sertifikat müddətsizdir. Rəsmi ad dəyişdirilmir, lakin yeni ləqəblərin əlavə edilməsi məhdudlaşdırılmır.',
  titleOptions: [
    'Ev Heyvanına Verilmiş Adın Rəsmi Qaydada Təsdiqi Sertifikatı',
    'Ailə Üzvləri Arasında Ad Seçiminin Razılaşdırılması Sertifikatı',
    'Çağırış Adının və Ləqəblərin Qeydiyyatı Sertifikatı',
    'Ada Reaksiyanın Yoxlanılmasına dair Şəhadətnamə'
  ],
  powersOptions: [
    'Ad ailə üzvləri arasında yekdilliklə seçilib.',
    'Ada reaksiya üçüncü həftədən qeydə alınıb.',
    'Gündəlik ləqəblər ayrıca siyahıya salınıb.',
    'Rəsmi ad baytar sənədlərində göstərilib.',
    'Ad qısa və çağırışa uyğun seçilib.',
    'Uşaqların təklifi nəzərə alınıb.',
    'Ləqəblərin sayı beşi keçmir.',
    'Ad dəyişikliyi nəzərdə tutulmur.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Sertifikat müddətsizdir. Rəsmi ad dəyişdirilmir, lakin yeni ləqəblərin əlavə edilməsi məhdudlaşdırılmır.',
    'Sənəd ailə arxivində saxlanılır.',
    'Ləqəb siyahısı hər il yenilənir.'
  ]
},
{
  id: 'baytar-qorxusu', cat: 'pets', tone: 'zarafat', layout: 'arayis', palette: 'steel', active: false,
  title: 'Baytar Ziyarəti Zamanı Göstərilən Müqavimətin Qeydə Alınması Arayışı', tag: 'Baytar',
  signOrg: 'Yemləmə və Gəzinti Növbəsi üzrə Baş İdarə',
  preamble: 'Verilir {to} adlı şəxsə ondan ötrü ki, baytar ziyarəti zamanı göstərdiyi müqavimət {from} tərəfindən qeydə alınmışdır. Ziyarət başa çatmış, bütün prosedurlar tam və uğurla yerinə yetirilmişdir.',
  powers: 'Daşıma qutusuna giriş qırx dəqiqə çəkib.\nKlinikada tam sakitlik nümayiş etdirilib.\nEvə qayıtdıqdan sonra üç saat danışılmayıb.\nBütün prosedurlar uğurla başa çatıb.',
  penalty: 'Arayış heç bir öhdəlik yaratmır. Növbəti ziyarətdə qutuya alışdırma prosesinin bir həftə əvvəldən başlanması tövsiyə olunur.',
  titleOptions: [
    'Baytar Ziyarəti Zamanı Göstərilən Müqavimətin Qeydə Alınması Arayışı',
    'Klinikaya Aparılma Prosesinin Təhlili haqqında Arayış',
    'Daşıma Qutusuna Giriş Mərhələsi haqqında Rəsmi Arayış',
    'Ziyarətdən Sonrakı Davranışın Qeydiyyatı haqqında Arayış'
  ],
  powersOptions: [
    'Daşıma qutusuna giriş qırx dəqiqə çəkib.',
    'Klinikada tam sakitlik nümayiş etdirilib.',
    'Evə qayıtdıqdan sonra üç saat danışılmayıb.',
    'Bütün prosedurlar uğurla başa çatıb.',
    'Qutu əvvəlcədən otağın ortasına qoyulub.',
    'Mükafat prosedurdan sonra verilib.',
    'Növbəti ziyarət altı aya planlaşdırılıb.',
    'Sakitləşdirici tövsiyə edilməyib.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Arayış heç bir öhdəlik yaratmır. Növbəti ziyarətdə qutuya alışdırma prosesinin bir həftə əvvəldən başlanması tövsiyə olunur.',
    'Arayış hər ziyarətdən sonra tərtib edilir.',
    'Vəziyyət yaxşılaşdıqda qeydlər yenilənir.'
  ]
},
{
  id: 'heyvan-qonaqliq', cat: 'pets', tone: 'zarafat', layout: 'viza', palette: 'burgundy', active: false,
  title: 'Ev Heyvanının Qonaqlarla Ünsiyyət Qaydalarına dair İcazə', tag: 'Qonaq',
  signOrg: 'Mənzil Daxilində Ərazi Bölgüsü üzrə Komissiya',
  preamble: '{from} tərəfindən {to} adlı şəxsə qonaqlarla ünsiyyət üçün icazə verilir. İcazə qonaqların rahatlığını pozmamaq, süfrəyə yaxınlaşmamaq və uşaqlı ailələrdə nəzarəti gücləndirmək şərtləri çərçivəsində qüvvədədir.',
  powers: 'Qonaqlar öz istəyi ilə yaxınlaşdıqda ünsiyyət icazəlidir.\nSüfrəyə yaxınlaşmaq qadağandır.\nQonağın dizinə çıxmaq üçün razılıq alınır.\nHeyvandan çəkinən qonaqlar əvvəlcədən bildirilir.',
  penalty: 'Qonaqlardan biri narahatlıq bildirdikdə icazə həmin ziyarət müddətinə dayandırılır və ayrıca otaq rejimi tətbiq edilir.',
  titleOptions: [
    'Ev Heyvanının Qonaqlarla Ünsiyyət Qaydalarına dair İcazə',
    'Qonaq Gəldikdə Davranış Rejiminə dair Xüsusi İcazə',
    'Qonağın Yeməyinə Maraq Göstərilməsinə dair Məhdud İcazə',
    'Qonaq Otağına Girişin Tənzimlənməsinə dair İcazə'
  ],
  powersOptions: [
    'Qonaqlar öz istəyi ilə yaxınlaşdıqda ünsiyyət icazəlidir.',
    'Süfrəyə yaxınlaşmaq qadağandır.',
    'Qonağın dizinə çıxmaq üçün razılıq alınır.',
    'Heyvandan çəkinən qonaqlar əvvəlcədən bildirilir.',
    'Uşaqlı qonaqlarda nəzarət gücləndirilir.',
    'Qapı zənginə reaksiya qısa olur.',
    'Ayrıca otaq variantı hazır saxlanılır.',
    'Ziyarətdən sonra otaq havalandırılır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Qonaqlardan biri narahatlıq bildirdikdə icazə həmin ziyarət müddətinə dayandırılır və ayrıca otaq rejimi tətbiq edilir.',
    'İcazə hər ziyarətə şamil edilir.',
    'Alerji halları ayrıca nəzərə alınır.'
  ]
},
{
  id: 'itmis-corab', cat: 'pets', tone: 'zarafat', layout: 'ekspertiza', palette: 'ink', active: false,
  title: 'Ev Əşyalarının Zədələnməsi Səbəblərinin Qiymətləndirilməsinə dair Rəy', tag: 'Araşdırma',
  signOrg: 'Mənzil Daxilində Ərazi Bölgüsü üzrə Komissiya',
  preamble: 'Aparılmış qiymətləndirmə nəticəsində müəyyən edilmişdir ki, {to} adlı şəxsə aid edilən zədələnmə hadisəsində birbaşa dəlil mövcud deyil. Rəy {from} tərəfindən verilmiş müraciət əsasında tərtib olunmuşdur.',
  powers: 'Əşyanın zədələnmə xarakteri müəyyən edilib.\nHadisə yerində birbaşa şahid olmayıb.\nDigər ev sakinlərinin iştirakı istisna edilmir.\nŞübhələr təqsirsizlik xeyrinə şərh olunur.',
  penalty: 'Rəy heç kimi məsuliyyətə cəlb etmir. Təkrar hallarda əşyaların saxlanma yeri yenidən müəyyən edilir.',
  titleOptions: [
    'Ev Əşyalarının Zədələnməsi Səbəblərinin Qiymətləndirilməsinə dair Rəy',
    'Zədələnmiş Əşyanın Vəziyyətinin Texniki Təhlilinə dair Rəy',
    'Hadisə Yerindəki Əlamətlərin Qiymətləndirilməsinə dair Rəy',
    'Məsuliyyətin Müəyyən Edilməsi İmkanlarına dair Yekun Rəy'
  ],
  powersOptions: [
    'Əşyanın zədələnmə xarakteri müəyyən edilib.',
    'Hadisə yerində birbaşa şahid olmayıb.',
    'Digər ev sakinlərinin iştirakı istisna edilmir.',
    'Şübhələr təqsirsizlik xeyrinə şərh olunur.',
    'Əşyanın yerləşdiyi hündürlük nəzərə alınıb.',
    'Hadisənin təxmini vaxtı müəyyənləşdirilib.',
    'Oxşar hallar əvvəllər qeydə alınmayıb.',
    'Qiymətli əşyaların köçürülməsi tövsiyə olunur.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Rəy heç kimi məsuliyyətə cəlb etmir. Təkrar hallarda əşyaların saxlanma yeri yenidən müəyyən edilir.',
    'Rəy yalnız bir hadisəyə aiddir.',
    'Yeni dəlillər aşkarlandıqda rəy yenilənir.'
  ]
},
{
  id: 'heyvan-seyahet', cat: 'pets', tone: 'zarafat', layout: 'muqavile', palette: 'forest', active: false,
  title: 'Səfər Dövründə Ev Heyvanına Qulluq Öhdəliyinin Bölgüsü üzrə Saziş', tag: 'Səfər',
  signOrg: 'Yemləmə və Gəzinti Növbəsi üzrə Baş İdarə',
  preamble: 'Tərəflərin mövqeyi nəzərə alınmaqla, {from} və {to} arasında səfər dövründə ev heyvanına qulluq öhdəliyi barədə razılıq əldə edilmişdir. Saziş yemləmə, gəzinti və fövqəladə halları əhatə edir.',
  powers: 'Baxıcı səfərdən bir həftə əvvəl təyin edilir.\nYemləmə cədvəli yazılı formada ötürülür.\nBaytar əlaqəsi baxıcıya verilir.\nGündəlik şəkil hesabatı gözlənilir.',
  penalty: 'Baxıcı öhdəliyini yerinə yetirmədikdə növbəti səfər üçün alternativ variant əvvəlcədən hazırlanır.',
  titleOptions: [
    'Səfər Dövründə Ev Heyvanına Qulluq Öhdəliyinin Bölgüsü üzrə Saziş',
    'Baxıcının Təyin Edilməsi və Təlimatı üzrə Qarşılıqlı Saziş',
    'Yemləmə və Gəzinti Cədvəlinin Ötürülməsi üzrə Protokol',
    'Səfər Müddətində Məsuliyyətin Müəyyən Edilməsi Müqaviləsi'
  ],
  powersOptions: [
    'Baxıcı səfərdən bir həftə əvvəl təyin edilir.',
    'Yemləmə cədvəli yazılı formada ötürülür.',
    'Baytar əlaqəsi baxıcıya verilir.',
    'Gündəlik şəkil hesabatı gözlənilir.',
    'Yem ehtiyatı səfər müddətinə hesablanır.',
    'Açar etibarlı şəxsə verilir.',
    'Fövqəladə hallarda dərhal əlaqə saxlanılır.',
    'Qayıdışdan sonra vəziyyət birgə yoxlanılır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Baxıcı öhdəliyini yerinə yetirmədikdə növbəti səfər üçün alternativ variant əvvəlcədən hazırlanır.',
    'Saziş yalnız bir səfərə şamil edilir.',
    'Səfər uzadıldıqda şərtlər yenidən razılaşdırılır.'
  ]
},
{
  id: 'mikrofon-sesi', cat: 'gaming', tone: 'zarafat', layout: 'blank', palette: 'steel', active: false,
  title: 'Səsli Söhbətdə Fon Səslərinin Tənzimlənməsi haqqında Bildiriş', tag: 'Səs',
  signOrg: 'Oyun Rejimi və Ekran Vaxtı üzrə Baş İdarə',
  preamble: 'Daxil olmuş müraciətə baxılaraq bildirilir ki, {to} adlı şəxsin səsli söhbətdəki fon səsləri komandanın ünsiyyətinə mane olur. {from} tərəfindən vəziyyətin düzəldilməsi xahiş edilir.',
  powers: 'Danışılmadıqda mikrofon söndürülür.\nFon musiqisi kanala ötürülmür.\nKlaviatura səsi azaldılır.\nYemək fasiləsində kanal tərk edilir.',
  penalty: 'Vəziyyət düzəldilmədikdə həmin iştirakçının mikrofonu matç boyunca komanda tərəfindən söndürülür.',
  titleOptions: [
    'Səsli Söhbətdə Fon Səslərinin Tənzimlənməsi haqqında Bildiriş',
    'Mikrofonun Söndürülməsi Qaydası haqqında Rəsmi Bildiriş',
    'Komanda Kanalında Nizamın Qorunması haqqında Bildiriş',
    'Fon Səs-Küyünün Azaldılması Tədbirləri haqqında Bəyannamə'
  ],
  powersOptions: [
    'Danışılmadıqda mikrofon söndürülür.',
    'Fon musiqisi kanala ötürülmür.',
    'Klaviatura səsi azaldılır.',
    'Yemək fasiləsində kanal tərk edilir.',
    'Ailə üzvlərinin səsi kanala düşməməlidir.',
    'Qulaqlıqdan istifadə tövsiyə olunur.',
    'Səs səviyyəsi matçdan əvvəl yoxlanılır.',
    'Texniki problem barədə əvvəlcədən xəbər verilir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Vəziyyət düzəldilmədikdə həmin iştirakçının mikrofonu matç boyunca komanda tərəfindən söndürülür.',
    'Bildiriş bütün komanda üzvlərinə şamil edilir.',
    'Texniki nasazlıq halında bildiriş tətbiq olunmur.'
  ]
},
{
  id: 'yeni-oyun-alisi', cat: 'gaming', tone: 'zarafat', layout: 'muqavile', palette: 'gold', active: false,
  title: 'Yeni Oyun Alışının Büdcə ilə Razılaşdırılması üzrə Müqavilə', tag: 'Büdcə',
  signOrg: 'Oyun Rejimi və Ekran Vaxtı üzrə Baş İdarə',
  preamble: 'Tərəflərin mövqeyi nəzərə alınmaqla, {from} və {to} arasında yeni oyun alışı barədə razılıq əldə edilmişdir. Müqavilə endirim dövrlərini və kitabxanadakı oynanılmamış oyunların sayını nəzərə alır.',
  powers: 'Yeni alış oynanılmamış oyun sayı üçdən az olduqda mümkündür.\nEndirim dövründə limit iki oyunla məhdudlaşır.\nAlış əvvəlcədən bildirilir.\nÖn sifariş yalnız razılaşdırma ilə verilir.',
  penalty: 'Limit aşıldıqda növbəti alış oynanılmamış oyunların ən azı ikisi tamamlanana qədər dayandırılır.',
  titleOptions: [
    'Yeni Oyun Alışının Büdcə ilə Razılaşdırılması üzrə Müqavilə',
    'Endirim Dövründə Alış Limitinin Müəyyən Edilməsi Sazişi',
    'Oynanılmamış Oyunların Sayına dair Qarşılıqlı Protokol',
    'Kitabxananın Genişləndirilməsi Qaydası üzrə Müqavilə'
  ],
  powersOptions: [
    'Yeni alış oynanılmamış oyun sayı üçdən az olduqda mümkündür.',
    'Endirim dövründə limit iki oyunla məhdudlaşır.',
    'Alış əvvəlcədən bildirilir.',
    'Ön sifariş yalnız razılaşdırma ilə verilir.',
    'Pulsuz oyunlar limitə daxil edilmir.',
    'Hədiyyə edilən oyunlar ayrıca hesablanır.',
    'Abunə xidmətləri ayrıca müzakirə olunur.',
    'Kitabxana rüblük nəzərdən keçirilir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Limit aşıldıqda növbəti alış oynanılmamış oyunların ən azı ikisi tamamlanana qədər dayandırılır.',
    'Müqavilə hər rübdə yenidən nəzərdən keçirilir.',
    'Doğum günü hədiyyəsi limitdən kənardır.'
  ]
},
{
  id: 'komanda-secimi', cat: 'gaming', tone: 'zarafat', layout: 'arayis', palette: 'forest', active: false,
  title: 'Komanda Yoldaşlarının Seçilməsi Prosesinin Nəticəsi haqqında Arayış', tag: 'Komanda',
  signOrg: 'Virtual Oyun Nəticələrinə Etirazlar üzrə Şura',
  preamble: 'Verilir {to} adlı şəxsə ondan ötrü ki, son otuz matçda komanda yoldaşlarının seçilməsi prosesi {from} tərəfindən təhlil edilmişdir. Nəticələr tərkibin sabitliyi ilə qələbə nisbəti arasında əlaqə göstərir.',
  powers: 'Sabit tərkiblə qələbə nisbəti daha yüksəkdir.\nTəsadüfi yoldaşlarla nəticə dəyişkəndir.\nÜnsiyyət olan matçlarda göstərici artır.\nGecə saatlarında nəticə aşağı düşür.',
  penalty: 'Arayış heç bir oyunçuya qarşı qiymətləndirmə xarakteri daşımır. Nəticələr yalnız tərkib planlaması üçün istifadə olunur.',
  titleOptions: [
    'Komanda Yoldaşlarının Seçilməsi Prosesinin Nəticəsi haqqında Arayış',
    'Sıralama Matçlarında Tərkib Seçimi haqqında Rəsmi Arayış',
    'Təsadüfi Yoldaşlarla Oyun Nəticələri haqqında Arayış',
    'Komanda Uyğunluğunun Qiymətləndirilməsi haqqında Arayış'
  ],
  powersOptions: [
    'Sabit tərkiblə qələbə nisbəti daha yüksəkdir.',
    'Təsadüfi yoldaşlarla nəticə dəyişkəndir.',
    'Ünsiyyət olan matçlarda göstərici artır.',
    'Gecə saatlarında nəticə aşağı düşür.',
    'Rol bölgüsü matçdan əvvəl aparılmalıdır.',
    'Yeni oyunçular sınaq matçında qiymətləndirilir.',
    'Ardıcıl məğlubiyyətdən sonra fasilə tövsiyə olunur.',
    'Statistika həftəlik yenilənir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Arayış heç bir oyunçuya qarşı qiymətləndirmə xarakteri daşımır. Nəticələr yalnız tərkib planlaması üçün istifadə olunur.',
    'Arayış hər ay yenidən hesablanır.',
    'Göstəricilər komanda ilə paylaşılır.'
  ]
},
{
  id: 'yeni-movsum', cat: 'gaming', tone: 'zarafat', layout: 'teleqram', palette: 'ink', active: false,
  title: 'Yeni Mövsümün Başlaması və Reytinqin Sıfırlanması haqqında Xəbərdarlıq', tag: 'Mövsüm',
  signOrg: 'Elektron Oyunlar üzrə Texniki Ekspertiza Mərkəzi',
  preamble: 'Sizə bildiririk ki, yeni mövsümün başlaması ilə {to} adlı şəxsin reytinqi sıfırlanmışdır. {from} tərəfindən mövsüm mükafatlarının vaxtında alınması və yeni sıralama matçlarının planlaşdırılması tövsiyə edilir.',
  powers: 'Reytinq mövsüm qaydalarına uyğun sıfırlanıb.\nMövsüm mükafatları hesaba köçürülüb.\nSıralama matçları yenidən başlanır.\nƏvvəlki nəticələr arxivə salınıb.',
  penalty: 'Mövsüm mükafatları göstərilən müddətdə alınmadıqda avtomatik olaraq ləğv edilir və bərpa edilmir.',
  titleOptions: [
    'Yeni Mövsümün Başlaması və Reytinqin Sıfırlanması haqqında Xəbərdarlıq',
    'Mövsüm Mükafatlarının Alınma Müddəti haqqında Teleqram',
    'Reytinqin Yenidən Qazanılması Zərurəti haqqında Xəbərdarlıq',
    'Mövsüm Sonu Hesabatının Elanı haqqında Təcili Bildiriş'
  ],
  powersOptions: [
    'Reytinq mövsüm qaydalarına uyğun sıfırlanıb.',
    'Mövsüm mükafatları hesaba köçürülüb.',
    'Sıralama matçları yenidən başlanır.',
    'Əvvəlki nəticələr arxivə salınıb.',
    'Mükafatların alınma müddəti iki həftədir.',
    'Yeni xəritələr sıralamaya daxil edilib.',
    'Tərkib dəyişikliyi tövsiyə olunur.',
    'İlk on matç həlledicidir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Mövsüm mükafatları göstərilən müddətdə alınmadıqda avtomatik olaraq ləğv edilir və bərpa edilmir.',
    'Xəbərdarlıq mövsümün əvvəlində göndərilir.',
    'Mükafat alındıqda xəbərdarlıq arxivə verilir.'
  ]
},
{
  id: 'oyun-fasilesi', cat: 'gaming', tone: 'zarafat', layout: 'lisenziya', palette: 'burgundy', active: false,
  title: 'Uzunmüddətli Oyun Seansı Zamanı Fasilə Verilməsinə dair Lisenziya', tag: 'Fasilə',
  signOrg: 'Oyun Rejimi və Ekran Vaxtı üzrə Baş İdarə',
  preamble: '{from} tərəfindən {to} adlı şəxsə uzunmüddətli oyun seansı zamanı fasilə vermək hüququ verilir. Lisenziya komanda matçlarında fasilənin əvvəlcədən bildirilməsi şərti ilə qüvvədədir.',
  powers: 'Hər saatdan sonra on dəqiqə fasilə verilir.\nFasilə komandaya əvvəlcədən bildirilir.\nSu ehtiyatı masanın yanında saxlanılır.\nMatç ortasında fasilə verilmir.',
  penalty: 'Fasilə verilmədən üç saatdan artıq davam edən seansda oyun rejimi həmin gün üçün dayandırılır.',
  titleOptions: [
    'Uzunmüddətli Oyun Seansı Zamanı Fasilə Verilməsinə dair Lisenziya',
    'Ardıcıl Matçlar Arasında İstirahət Rejiminə dair Lisenziya',
    'Gözlərin və Bilək Nahiyəsinin Qorunmasına dair İcazə',
    'Su və Qidalanma Fasiləsinin Tənzimlənməsinə dair Lisenziya'
  ],
  powersOptions: [
    'Hər saatdan sonra on dəqiqə fasilə verilir.',
    'Fasilə komandaya əvvəlcədən bildirilir.',
    'Su ehtiyatı masanın yanında saxlanılır.',
    'Matç ortasında fasilə verilmir.',
    'Gözlər üçün uzağa baxma tövsiyə olunur.',
    'Qidalanma fasiləsi ayrıca hesablanır.',
    'Gecə seanslarında fasilə tezləşdirilir.',
    'Pəncərə saatda bir dəfə açılır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Fasilə verilmədən üç saatdan artıq davam edən seansda oyun rejimi həmin gün üçün dayandırılır.',
    'Lisenziya turnir günlərində genişləndirilir.',
    'Sağlamlıq halları fasiləni məcburi edir.'
  ]
},
{
  id: 'qrup-sekli', cat: 'viral', tone: 'zarafat', layout: 'sertifikat', palette: 'gold', active: false,
  title: 'Qrup Şəklində Bütün İştirakçıların Bəyəndiyi Kadrın Sertifikatı', tag: 'Foto',
  signOrg: 'Sosial Öhdəliklərin Qeydiyyatı üzrə Baş İdarə',
  preamble: 'Bununla təsdiq edilir ki, {from} tərəfindən çəkilmiş qrup şəkli bütün iştirakçılar, o cümlədən {to} adlı şəxs tərəfindən bəyənilmişdir. Nəticə on iki cəhddən sonra əldə edilmiş və nadir hal kimi qeydə alınmışdır.',
  powers: 'Heç kimin gözü qapanmayıb.\nArxa planda kənar şəxs yoxdur.\nİşıq bütün iştirakçılar üçün uyğundur.\nKadr yekdilliklə qəbul edilib.',
  penalty: 'Sertifikat yalnız bu kadra aiddir. Şəklin işlənmiş variantının paylaşılması ayrıca razılıq tələb edir.',
  titleOptions: [
    'Qrup Şəklində Bütün İştirakçıların Bəyəndiyi Kadrın Sertifikatı',
    'On İki Cəhddən Sonra Əldə Edilmiş Kadrın Sertifikatı',
    'Heç Kimin Gözünün Qapanmadığı Kadra dair Şəhadətnamə',
    'Qrup Fotosunun Yekdilliklə Qəbulunu Təsdiq edən Sertifikat'
  ],
  powersOptions: [
    'Heç kimin gözü qapanmayıb.',
    'Arxa planda kənar şəxs yoxdur.',
    'İşıq bütün iştirakçılar üçün uyğundur.',
    'Kadr yekdilliklə qəbul edilib.',
    'Çəkiliş on iki cəhddən sonra alınıb.',
    'Taymer üç dəfə yenidən qurulub.',
    'Şəkil eyni gün paylaşılıb.',
    'Digər kadrlar arxivə verilib.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Sertifikat yalnız bu kadra aiddir. Şəklin işlənmiş variantının paylaşılması ayrıca razılıq tələb edir.',
    'Sertifikat bütün iştirakçılara eyni qaydada aiddir.',
    'Yeni kadr çəkildikdə sənəd yenilənir.'
  ]
},
{
  id: 'gorus-legvi', cat: 'viral', tone: 'zarafat', layout: 'teleqram', palette: 'steel', active: false,
  title: 'Planlaşdırılmış Görüşün Son Anda Ləğv Edilməsi haqqında Xəbərdarlıq', tag: 'Ləğv',
  signOrg: 'Gündəlik Həyatın Fövqəladə Halları üzrə Komissiya',
  preamble: 'Sizə bildiririk ki, {to} adlı şəxs planlaşdırılmış görüşü yola çıxıldıqdan sonra ləğv etmişdir. {from} tərəfindən artıq yolun yarısının qət edildiyi və taksi haqqının ödənildiyi bildirilir.',
  powers: 'İmtina yola çıxıldıqdan sonra bildirilib.\nSəbəb kimi yorğunluq göstərilib.\nEyni hal son ayda ikinci dəfə baş verib.\nYol xərci artıq ödənilib.',
  penalty: 'Növbəti görüşün yeri, vaxtı və ödəniş qaydası tam olaraq zərərçəkmiş tərəf tərəfindən müəyyən edilir.',
  titleOptions: [
    'Planlaşdırılmış Görüşün Son Anda Ləğv Edilməsi haqqında Xəbərdarlıq',
    'İmtina Bildirişinin Gecikməsi haqqında Təcili Teleqram',
    'Yola Çıxdıqdan Sonra Gələn İmtina haqqında Xəbərdarlıq',
    'Görüş Öhdəliyinin Pozulması haqqında Təcili Bildiriş'
  ],
  powersOptions: [
    'İmtina yola çıxıldıqdan sonra bildirilib.',
    'Səbəb kimi yorğunluq göstərilib.',
    'Eyni hal son ayda ikinci dəfə baş verib.',
    'Yol xərci artıq ödənilib.',
    'Görüş bir həftə əvvəl razılaşdırılmışdı.',
    'Səhər təsdiq mesajı göndərilmişdi.',
    'Alternativ tarix təklif edilməyib.',
    'Digər iştirakçılar məlumatlandırılıb.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Növbəti görüşün yeri, vaxtı və ödəniş qaydası tam olaraq zərərçəkmiş tərəf tərəfindən müəyyən edilir.',
    'Xəbərdarlıq üzrxahlıqdan sonra arxivə verilir.',
    'Fövqəladə hallar bu xəbərdarlıqdan kənardır.'
  ]
},
{
  id: 'sifre-unutma', cat: 'viral', tone: 'zarafat', layout: 'arayis', palette: 'ink', active: false,
  title: 'Hesab Şifrəsinin Unudulması Halının Araşdırılması haqqında Arayış', tag: 'Şifrə',
  signOrg: 'Rəqəmsal Ünsiyyət və Susqunluq Departamenti',
  preamble: 'Verilir {to} adlı şəxsə ondan ötrü ki, hesab şifrəsinin unudulması halı {from} tərəfindən araşdırılmışdır. Bərpa kodu artıq istifadə edilməyən nömrəyə göndərilmiş, təhlükəsizlik sualının cavabı isə xatırlanmamışdır.',
  powers: 'Şifrə son dəfə iki il əvvəl dəyişdirilib.\nBərpa kodu köhnə nömrəyə göndərilib.\nTəhlükəsizlik sualının cavabı xatırlanmayıb.\nEhtiyat e-poçt ünvanı da əlçatan deyil.',
  penalty: 'Arayış girişi bərpa etmir. Yeganə tövsiyə — şifrələrin ayrıca və etibarlı yerdə saxlanılmasıdır.',
  titleOptions: [
    'Hesab Şifrəsinin Unudulması Halının Araşdırılması haqqında Arayış',
    'Bərpa Kodunun Köhnə Nömrəyə Getməsi haqqında Arayış',
    'Təhlükəsizlik Sualının Cavabının Unudulması haqqında Arayış',
    'Hesaba Girişin Bərpası Prosesi haqqında Rəsmi Arayış'
  ],
  powersOptions: [
    'Şifrə son dəfə iki il əvvəl dəyişdirilib.',
    'Bərpa kodu köhnə nömrəyə göndərilib.',
    'Təhlükəsizlik sualının cavabı xatırlanmayıb.',
    'Ehtiyat e-poçt ünvanı da əlçatan deyil.',
    'Brauzerdə saxlanmış variant köhnəlib.',
    'Kağızda qeyd aparılmayıb.',
    'İki mərhələli doğrulama aktiv olub.',
    'Yeni hesab yaradılması müzakirə olunur.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Arayış girişi bərpa etmir. Yeganə tövsiyə — şifrələrin ayrıca və etibarlı yerdə saxlanılmasıdır.',
    'Giriş bərpa edildikdə arayış arxivə verilir.',
    'Arayış yalnız bir hesaba aiddir.'
  ]
},
{
  id: 'abune-legvi', cat: 'viral', tone: 'zarafat', layout: 'qerar', palette: 'forest', active: false,
  title: 'Unudulmuş Abunələrin Ləğv Edilməsi haqqında Yekun Qərar', tag: 'Abunə',
  signOrg: 'Sosial Öhdəliklərin Qeydiyyatı üzrə Baş İdarə',
  preamble: 'Komissiya {to} adlı şəxsin bank çıxarışını araşdıraraq müəyyən etmişdir ki, aylıq ödənilən xidmətlərin bir hissəsi altı aydır istifadə edilmir. {from} tərəfindən verilmiş müraciət əsaslı hesab olunur.',
  powers: 'İstifadə edilməyən abunələr ləğv edilsin.\nSınaq müddəti bitən xidmətlər dayandırılsın.\nÖdəniş tarixləri bir siyahıda toplansın.\nYeni abunə yalnız razılaşdırma ilə açılsın.',
  penalty: 'Qərarın icrasından sonra aylıq xərclərdə yaranan qənaət ayrıca hesablanır və növbəti planlamada nəzərə alınır.',
  titleOptions: [
    'Unudulmuş Abunələrin Ləğv Edilməsi haqqında Yekun Qərar',
    'Aylıq Ödənişlərin Yenidən Nəzərdən Keçirilməsi haqqında Qərar',
    'İstifadə Edilməyən Xidmətlərin Dayandırılması haqqında Qərar',
    'Sınaq Müddətindən Sonrakı Ödənişlər haqqında Yekun Qətnamə'
  ],
  powersOptions: [
    'İstifadə edilməyən abunələr ləğv edilsin.',
    'Sınaq müddəti bitən xidmətlər dayandırılsın.',
    'Ödəniş tarixləri bir siyahıda toplansın.',
    'Yeni abunə yalnız razılaşdırma ilə açılsın.',
    'Bank çıxarışı hər ay yoxlanılsın.',
    'Ailə paketləri üstünlük təşkil etsin.',
    'İllik ödəniş variantı müqayisə edilsin.',
    'Ləğv tarixi əvvəlcədən qeyd olunsun.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Qərarın icrasından sonra aylıq xərclərdə yaranan qənaət ayrıca hesablanır və növbəti planlamada nəzərə alınır.',
    'Qərar hər rübdə yenidən nəzərdən keçirilir.',
    'Ailə üzvlərinin abunələri ayrıca müzakirə olunur.'
  ]
},
{
  id: 'sifarisin-gecikmesi', cat: 'viral', tone: 'zarafat', layout: 'ekspertiza', palette: 'burgundy', active: false,
  title: 'Çatdırılma Müddətinin Aşılması Halının Qiymətləndirilməsinə dair Rəy', tag: 'Sifariş',
  signOrg: 'Gündəlik Həyatın Fövqəladə Halları üzrə Komissiya',
  preamble: 'Aparılmış qiymətləndirmə nəticəsində müəyyən edilmişdir ki, {to} adlı şəxsin sifarişinin çatdırılma müddəti vəd edilən vaxtı iki dəfə üstələmişdir. Rəy {from} tərəfindən verilmiş müraciət və tətbiq qeydləri əsasında tərtib olunmuşdur.',
  powers: 'Vəd edilən müddət otuz dəqiqə idi.\nFaktiki çatdırılma altmış dörd dəqiqə çəkib.\nKuryer xəritədə on beş dəqiqə hərəkətsiz qalıb.\nYemək qismən soyumuş vəziyyətdə təhvil verilib.',
  penalty: 'Rəy heç bir tələb irəli sürmür. Növbəti sifarişdə pik saatlardan kənar vaxt seçilməsi tövsiyə olunur.',
  titleOptions: [
    'Çatdırılma Müddətinin Aşılması Halının Qiymətləndirilməsinə dair Rəy',
    'Vəd Edilmiş və Faktiki Çatdırılma Vaxtına dair Ekspert Rəyi',
    'Kuryerin Xəritədəki Hərəkətinin Təhlilinə dair Rəy',
    'Sifarişin Vəziyyətinin Yenidən Qiymətləndirilməsinə dair Rəy'
  ],
  powersOptions: [
    'Vəd edilən müddət otuz dəqiqə idi.',
    'Faktiki çatdırılma altmış dörd dəqiqə çəkib.',
    'Kuryer xəritədə on beş dəqiqə hərəkətsiz qalıb.',
    'Yemək qismən soyumuş vəziyyətdə təhvil verilib.',
    'Sifariş pik saatlarına düşüb.',
    'Ünvan düzgün göstərilib.',
    'Zəng edilməyib, qapı döyülüb.',
    'Növbəti sifarişdə vaxt ehtiyatı nəzərə alınacaq.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Rəy heç bir tələb irəli sürmür. Növbəti sifarişdə pik saatlardan kənar vaxt seçilməsi tövsiyə olunur.',
    'Rəy yalnız bir sifarişə aiddir.',
    'Göstəricilər hər sifarişdən sonra yenilənir.'
  ]
}
];
