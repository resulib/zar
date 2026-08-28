/* ==================================================================
   Zarafat Notariat Palatası — şablon kitabxanası
   132 şablon · 11 kateqoriya · 10 dizayn · 5 palitra · tone: 'zarafat'
   Xatirə tonunun şablonları ayrıca fayldadır: templates-xatire.js
   layout:  notarial | blank | diplom | sertifikat | lisenziya
            arayis | qerar | muqavile | teleqram | vesiqe
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
  { id: 'gaming',    tone: 'zarafat', name: 'Oyunçular',            icon: '▶', blurb: 'Rank, komanda seçimi, ekran vaxtı və klaviatura sülhü.' }
];

window.TEMPLATES = [

/* ==================== CÜTLÜKLƏR ==================== */
{
  id: 'weekend-pass', cat: 'couples', tone: 'zarafat', layout: 'notarial', palette: 'gold',
  title: 'Həftəsonu Çölə Çıxma Etibarnaməsi', tag: 'Ən çox paylaşılan',
  preamble: 'Bu etibarnamə ilə təsdiq olunur ki, {from} tərəfindən {to} adlı şəxsə həftəsonu evdən kənara çıxmaq, dostları ilə görüşmək və müəyyən edilmiş saatda geri qayıtmaq səlahiyyəti verilmişdir. Etibarnamə yalnız telefonun şarj səviyyəsi 40%-dən yuxarı olduğu müddətdə qüvvədədir.',
  powers: 'Həftədə bir dəfə, maksimum 4 saat müddətinə evdən çıxmaq.\nHər 45 dəqiqədən bir sağ-salamat olduğunu bildirən mesaj göndərmək.\nQayıdarkən əli boş qayıtmamaq — şirniyyat və ya çiçək məcburi hesab olunur.\nSəsli mesaja ən geci 3 dəqiqə ərzində cavab vermək.',
  penalty: 'Şərtlərin pozulması halında sənəd sahibi növbəti iki həftəsonu qab-qacaq yumaq öhdəliyi daşıyır və pultdan istifadə hüququndan müvəqqəti məhrum edilir.'
},
{
  id: 'always-right', cat: 'couples', tone: 'zarafat', layout: 'qerar', palette: 'burgundy',
  title: 'Həmişə Haqlı Olma Fərmanı', tag: 'Klassik',
  preamble: '{from} bu fərmanla {to} adlı şəxsi, mübahisənin mövzusundan və nəticəsindən asılı olmayaraq, ömürlük haqlı elan edir. Qərar geriyə şamil olunur və bugünədək baş vermiş bütün mübahisələri əhatə edir. Fərman imzalandığı andan qüvvəyə minir.',
  powers: 'İstənilən mübahisədə son sözü demək hüququ.\n«Mən sənə demişdim» ifadəsini limitsiz istifadə etmək.\nXəritəyə baxmadan yol göstərmək və səhv çıxdıqda məsuliyyət daşımamaq.\nSoyuducunun qapısını açıb «yemək yoxdur» demək hüququ.',
  penalty: 'Bu fərmana etiraz edən tərəf 7 gün müddətinə serial seçimi hüququndan məhrum edilir və həmin müddətdə seçim tam olaraq digər tərəfə keçir.'
},
{
  id: 'remote-control', cat: 'couples', tone: 'zarafat', layout: 'sertifikat', palette: 'steel',
  title: 'Pult Üzərində Müstəsna Nəzarət Sertifikatı', tag: 'Ev müharibəsi',
  preamble: 'Bu sertifikat {to} adlı şəxsin televizor pultu üzərində müstəsna və mübahisəsiz nəzarət hüququnu təsdiq edir. Hüquq {from} tərəfindən könüllü şəkildə, heç bir təzyiq olmadan (iddia edildiyinə görə) verilmişdir.',
  powers: 'Kanalı xəbərdarlıq etmədən dəyişmək.\nSerialın növbəti seriyasını tək baxmamaq öhdəliyi ilə seçim etmək.\nReklam zamanı səsi tam söndürmək.\nPultun harada olduğunu bilməmək hüququ (ayda 2 dəfə).',
  penalty: 'Pultun 24 saatdan artıq itkin düşməsi halında nəzarət hüququ avtomatik olaraq digər tərəfə keçir və bərpa olunmur.'
},
{
  id: 'dessert-amnesty', cat: 'couples', tone: 'zarafat', layout: 'blank', palette: 'forest',
  title: 'Şirniyyat Oğurluğuna Görə Amnistiya Aktı', tag: 'Bayram üçün',
  toLabel: 'Amnistiya olunan', fromLabel: 'Amnistiya verən',
  preamble: 'Bu aktla {from} tərəfindən {to} adlı şəxsə, soyuducuda saxlanılan şirniyyat məhsulları ilə bağlı keçmişdə törədilmiş bütün əməllərə görə tam və qeyd-şərtsiz amnistiya elan olunur. Amnistiya paylaşılmamış son dilim də daxil olmaqla bütün epizodları əhatə edir.',
  powers: 'Gecə saat 00:00-dan sonra soyuducuya sərbəst giriş.\nSon dilimi soruşmadan götürmək (ayda 1 dəfə).\n«Mən götürməmişəm» ifadəsindən istifadə hüququ.\nBayram şirniyyatını qonaqlardan əvvəl dadmaq.',
  penalty: 'Amnistiya yalnız keçmişə şamil olunur. Yeni əməllər aşkarlandıqda sənəd sahibi növbəti şirniyyatı öz vəsaiti hesabına almaq öhdəliyi daşıyır.'
},
{
  id: 'snoring-license', cat: 'couples', tone: 'zarafat', layout: 'lisenziya', palette: 'ink',
  title: 'Xoruldama Lisenziyası', tag: 'Gecə növbəsi',
  powersLabel: 'LİSENZİYANIN ƏHATƏ ETDİYİ HALLAR',
  preamble: '{from} uzun illik müşahidə və nəticəsiz mübarizədən sonra {to} adlı şəxsin gecə saatlarında xoruldamaq hüququnu rəsmi olaraq tanıyır. Lisenziya bütün yataq otaqlarında və uzun avtomobil yollarında qüvvədədir.',
  powers: 'Gecə saat 23:00-dan səhər 07:00-a qədər sərbəst xoruldamaq.\nSəhər «mən xoruldamıram» demək hüququ.\nDivana sürgün edilməyə etiraz etmək.\nQulaq tıxacının qiymətini ödəməmək.',
  penalty: 'Səs həddi qonşuların şikayət etdiyi səviyyəni keçdikdə lisenziya bir gecəlik dayandırılır və sahib divana köçürülür.'
},
{
  id: 'ideal-partner', cat: 'couples', tone: 'zarafat', layout: 'diplom', palette: 'burgundy',
  title: 'İdeal Həyat Yoldaşı Diplomu', tag: 'İldönümü',
  preamble: 'Zarafat Notariat Palatası təsdiq edir ki, bu şəxs uzun müddət ərzində səbir, dözüm və vaxtında gətirilmiş çay sahəsində müstəsna nəticələr göstərmişdir. Diplom {from} tərəfindən təqdim olunur.',
  powers: 'Səhər qəhvəsini yataqda təqdim etmək.\nUnudulmuş tarixləri xatırlatmaq.\nMübahisədən sonra ilk addımı atmaq.\nAilə fotolarında həmişə gülümsəmək.',
  penalty: 'Diplom geri alınmır. Lakin təltif olunan şəxs il ərzində ən azı bir dəfə sürpriz təşkil etmək öhdəliyi daşıyır.'
},
{
  id: 'shopping-power', cat: 'couples', tone: 'zarafat', layout: 'notarial', palette: 'steel',
  title: 'Alış-veriş Səlahiyyətnaməsi', tag: 'Büdcə',
  preamble: 'Bu səlahiyyətnamə ilə {from} tərəfindən {to} adlı şəxsə ailə büdcəsi hesabına alış-veriş etmək səlahiyyəti verilir. Səlahiyyət yalnız siyahıda yazılmış məhsullara şamil olunur; siyahıdan kənar alışlar ayrıca izahat tələb edir.',
  powers: 'Siyahıdakı məhsulları müstəqil seçmək.\nEndirimli məhsulu siyahıya sonradan əlavə etmək (1 ədəd).\nÇek itdikdə məbləği yuvarlaqlaşdırmaq.\n«Lazım olacaq» arqumentindən həftədə bir dəfə istifadə etmək.',
  penalty: 'Siyahıdan kənar üç və daha çox məhsul aşkarlandıqda səlahiyyət növbəti ay üçün dayandırılır və alış-veriş birgə həyata keçirilir.'
},
{
  id: 'late-reply', cat: 'couples', tone: 'zarafat', layout: 'vesiqe', palette: 'steel',
  title: 'Mesaja Gec Cavab Vermə Vəsiqəsi', tag: 'Rəqəmsal sülh',
  toLabel: 'VƏSİQƏ SAHİBİ',
  preamble: 'Bu vəsiqə {to} adlı şəxsin mesajları görüb dərhal cavab verməmək hüququnu tanıyır. Vəsiqə {from} tərəfindən, «onlayn» statusunun mübahisə mövzusu olmaması şərti ilə verilmişdir.',
  powers: 'Mesajı oxuyub 30 dəqiqə ərzində cavab verməmək.\n«Telefonu görmədim» ifadəsindən istifadə etmək.\nSəsli mesajı iki dəfə sürətlə dinləmək.\nQrup çatındakı sualı görməzdən gəlmək.',
  penalty: 'Cavabsızlıq 6 saatı aşdıqda vəsiqə müvəqqəti dayandırılır və sahib növbəti görüşün yerini digər tərəfin seçməsinə razılıq verir.'
},
{
  id: 'family-visit', cat: 'couples', tone: 'zarafat', layout: 'arayis', palette: 'ink',
  title: 'Qohum Ziyarəti Protokolu', tag: 'Diplomatiya',
  powersLabel: 'PROTOKOLUN ŞƏRTLƏRİ',
  preamble: 'Tərəflər — {from} və {to} — qohum ziyarətlərinin təşkili, müddəti və çıxış vaxtı barədə aşağıdakı şərtlərlə razılığa gəlmişlər. Protokol hər iki tərəfin ailəsinə bərabər şamil olunur.',
  powers: 'Ziyarətin müddəti 3 saatı keçmir.\nÇıxış siqnalı razılaşdırılmış jestlə verilir və mübahisə edilmir.\nSüfrədə üçüncü dəfə təklif olunan yeməkdən imtina etmək hüququ tanınır.\nYolda mövzu müzakirəsi ən azı 10 dəqiqə təxirə salınır.',
  penalty: 'Çıxış siqnalına iki dəfə əməl edilmədikdə növbəti ziyarətin marşrutunu digər tərəf müəyyən edir.'
},
{
  id: 'sock-treaty', cat: 'couples', tone: 'zarafat', layout: 'muqavile', palette: 'forest',
  title: 'Corab Müqaviləsi', tag: 'Ev qaydası',
  preamble: 'Bu müqavilə ilə {to} adlı şəxs yerə atılmış corabların taleyi ilə bağlı öhdəlik götürür. {from} isə həmin corabları tapdıqda dərhal qeyd etməmək öhdəliyini qəbul edir. Müqavilə bütün otaqlara şamil olunur.',
  powers: 'Corabı çıxardığı yerdə maksimum 30 dəqiqə saxlamaq.\nCüt tapılmadıqda oxşar rəngdən istifadə etmək.\nQonaq gələnə qədər yığışdırmağı təxirə salmaq.\nAyda bir dəfə «bu mənim deyil» demək.',
  penalty: 'Eyni corab üç gün ardıcıl eyni yerdə qaldıqda sahibi həmin həftənin bütün paltar yumasını öz üzərinə götürür.'
},
{
  id: 'gps-authority', cat: 'couples', tone: 'zarafat', layout: 'teleqram', palette: 'gold',
  title: 'Yol Göstərmə Səlahiyyəti', tag: 'Avtomobil',
  preamble: 'Bu sertifikat {to} adlı şəxsin avtomobildə naviqasiya üzrə son sözü demək səlahiyyətini təsdiq edir. Səlahiyyət {from} tərəfindən, uzun mübahisələrdən yorulduqdan sonra verilmişdir.',
  powers: 'Xəritəyə baxmadan istiqamət seçmək.\n«Bu yol qısadır» ifadəsini sübutsuz istifadə etmək.\nNavigatoru söndürmək.\nYanlış dönüşdən sonra mövzunu dəyişmək.',
  penalty: 'Gecikmə 25 dəqiqəni aşdıqda səlahiyyət həmin səfər üçün ləğv olunur və naviqasiya digər tərəfə keçir.'
},
{
  id: 'peace-treaty', cat: 'couples', tone: 'zarafat', layout: 'diplom', palette: 'gold',
  title: 'Barışıq Sazişi', tag: 'Sülh',
  preamble: 'Tərəflər aralarında baş vermiş mübahisəni tam və qeyd-şərtsiz bağlanmış elan edirlər. Saziş {from} tərəfindən təklif olunmuş, {to} tərəfindən qəbul edilmişdir. Keçmiş epizodlar müzakirə mövzusu ola bilməz.',
  powers: 'Mübahisə mövzusuna bir daha qayıtmamaq.\nKöhnə epizodları arqument kimi istifadə etməmək.\nBarışıq şirniyyatını birlikdə bölüşmək.\nGecə yatmazdan əvvəl mövzunu təzələməmək.',
  penalty: 'Saziş pozulduqda pozan tərəf növbəti həftəsonu proqramının tam təşkilini öz üzərinə götürür.'
},

/* ==================== DOSTLAR ==================== */
{
  id: 'friend-traitor', cat: 'friends', tone: 'zarafat', layout: 'qerar', palette: 'burgundy',
  title: 'Dost Satqını Sertifikatı', tag: 'Hit',
  powersLabel: 'TƏSDİQLƏNMİŞ HALLAR',
  preamble: '{from} tərəfindən {to} adlı şəxsə, dostluq öhdəliklərini planlı və təkrarlanan şəkildə pozduğuna görə rəsmi «Dost Satqını» statusu verilir. Status Zarafat Reyestrində əbədi saxlanılır və silinmə müraciəti qəbul edilmir.',
  powers: 'Söz verib gəlməmək — çoxsaylı təsdiqlənmiş epizod.\n«5 dəqiqəyə gəlirəm» deyib iki saat gecikmək.\nOrtaq sirri üçüncü şəxsə «təsadüfən» ötürmək.\nQrup çatında sual verib cavabları oxumadan yox olmaq.',
  penalty: 'Növbəti üç görüşün hesabını tam ödəmək. Ödəniş nağd və ya kartla mümkündür; bəhanə, hekayə və emosional çıxış qəbul edilmir.'
},
{
  id: 'debt-license', cat: 'friends', tone: 'zarafat', layout: 'lisenziya', palette: 'gold',
  title: 'Borc Qaytarmamaq Lisenziyası', tag: 'Təhlükəli',
  toLabel: 'LİSENZİYA SAHİBİ', fromLabel: 'BORC VERƏN',
  preamble: 'Bu lisenziya {to} adlı şəxsə {from} tərəfindən verilmiş borcu qaytarmamaq üçün rəsmi əsas yaradır. Lisenziya yalnız borcun dəqiq məbləği hər iki tərəf tərəfindən unudulduğu halda etibarlıdır.',
  powers: 'Borcun məbləğini yadda saxlamamaq.\n«Bu həftə mütləq» ifadəsini müddətsiz istifadə etmək.\nMövzu açılanda söhbəti hava haqqına yönəltmək.\nQarşı tərəfin mesajını görüb 24 saat cavab verməmək.',
  penalty: 'Borc mövzusu üçüncü şəxs tərəfindən ictimai şəkildə xatırladıldıqda lisenziya dərhal ləğv olunur və ödəmə öhdəliyi bərpa edilir.'
},
{
  id: 'secret-keeper', cat: 'friends', tone: 'zarafat', layout: 'blank', palette: 'steel',
  title: 'Sirr Saxlama Öhdəliyi', tag: 'Rəsmi',
  toLabel: 'Öhdəlik götürən', fromLabel: 'Sirri açıqlayan',
  preamble: 'Bu öhdəliklə {to} adlı şəxs, {from} tərəfindən ona etibar edilmiş məlumatları üçüncü şəxslərə açıqlamamağı öhdəsinə götürür. Öhdəlik səsli mesajlara, ekran şəkillərinə və «mən heç kimə demərəm» vədlərinə də şamil olunur.',
  powers: 'Sirri eşitmək və uyğun reaksiya vermək.\nMəsləhət vermək (istənilib-istənilməməsindən asılı olmayaraq).\nMövzunu bir ay sonra yenidən açmaq.\nDetalları xatırlamamaq hüququ.',
  penalty: 'Sirrin açıqlanması halında öhdəlik sahibi bir aylıq qəhvə xərclərini öz üzərinə götürür və növbəti sirrdən məhrum edilir.'
},
{
  id: 'late-pass', cat: 'friends', tone: 'zarafat', layout: 'vesiqe', palette: 'burgundy',
  title: 'Daimi Gecikmə Vəsiqəsi', tag: 'Sevimli',
  preamble: 'Bu vəsiqə {to} adlı şəxsin bütün görüşlərə gecikmək hüququnu rəsmi olaraq tanıyır. Vəsiqə {from} tərəfindən uzun illik müşahidə nəticəsində, mübarizənin faydasız olduğu qənaətinə gəlindikdən sonra verilmişdir.',
  powers: 'Hər görüşə 40 dəqiqəyədək gecikmək.\n«Yoldayam» yazıb hələ evdə olmaq.\nTrafik, taksi və hava şəraitinə istinad etmək.\nGecikmənin səbəbini izah etməmək.',
  penalty: 'Gecikmə 90 dəqiqəni aşdıqda vəsiqə müvəqqəti dayandırılır və sahib növbəti görüşün yerini digər tərəfin seçməsinə razılıq verir.'
},
{
  id: 'best-friend-diploma', cat: 'friends', tone: 'zarafat', layout: 'diplom', palette: 'gold',
  title: 'Ən Yaxşı Dost Diplomu', tag: 'Hədiyyə',
  preamble: 'Zarafat Notariat Palatası təsdiq edir ki, bu şəxs gecə saat 03:00-da zəngə cavab vermək, səbəbsiz dəstək olmaq və pis fikirdən vaxtında saxlamaq sahəsində müstəsna xidmətlər göstərmişdir. Diplom {from} tərəfindən təqdim olunur.',
  powers: 'İstənilən saatda zəngə cavab vermək.\nPis qərardan vaxtında saxlamaq.\nHekayəni ikinci dəfə də səbirlə dinləmək.\nHeç bir səbəb olmadan yanında olmaq.',
  penalty: 'Diplom geri alınmır. Sahibi yalnız ildə bir dəfə səbəbsiz zəng etmək öhdəliyi daşıyır.'
},
{
  id: 'group-chat', cat: 'friends', tone: 'zarafat', layout: 'teleqram', palette: 'ink',
  title: 'Qrup Çatında Susma Aktı', tag: 'Rəqəmsal',
  powersLabel: 'AKTIN ƏHATƏ ETDİYİ HÜQUQLAR',
  preamble: 'Bu aktla {to} adlı şəxsin qrup çatında 400 mesajı oxumadan «nə oldu?» soruşmaq hüququ rəsmiləşdirilir. Akt {from} tərəfindən, qrupun sabitliyi naminə hazırlanmışdır.',
  powers: 'Mesajları oxumadan mövzuya qoşulmaq.\nSəsli mesajlara emoji ilə cavab vermək.\nPlan müzakirəsində iştirak etmədən nəticəyə etiraz etmək.\nÇatı səssiz rejimə salıb inkar etmək.',
  penalty: 'Eyni sual üç dəfə təkrarlandıqda sənəd sahibi növbəti görüşün yerini rezerv etmək öhdəliyi daşıyır.'
},
{
  id: 'photo-rights', cat: 'friends', tone: 'zarafat', layout: 'sertifikat', palette: 'forest',
  title: 'Şəkil Çəkmə Öhdəliyi', tag: 'İnstaqram',
  preamble: 'Bu sertifikatla {to} adlı şəxs {from} üçün şəkil çəkərkən minimum keyfiyyət standartlarına əməl etməyi öhdəsinə götürür. Öhdəlik bütün səyahət, kafe və küçə çəkilişlərinə şamil olunur.',
  powers: 'Ən azı 15 kadr çəkmək.\nÜfüqi xətti düz saxlamaq.\n«Elə belə yaxşıdır» deməmək.\nÇəkilişi ilk kadrdan sonra dayandırmamaq.',
  penalty: 'Standartlara əməl edilmədikdə növbəti çəkiliş növbəsi ötürülür və öhdəlik sahibi kofe hesabını ödəyir.'
},
{
  id: 'taxi-split', cat: 'friends', tone: 'zarafat', layout: 'arayis', palette: 'forest',
  title: 'Taksi Pulu Bölüşdürmə Protokolu', tag: 'Hesablaşma',
  preamble: 'Tərəflər — {from} və {to} — birgə səfərlərdə taksi xərclərinin bölüşdürülməsi barədə razılığa gəlmişlər. Protokol həm gediş, həm də qayıdış marşrutlarına şamil olunur.',
  powers: 'Xərc məsafəyə görə bölünür, əhval-ruhiyyəyə görə yox.\n«Sonra verərəm» ifadəsi 48 saat qüvvədədir.\nTaksini çağıran şəxs marşrutu seçir.\nGecikən tərəf gözləmə haqqını öz üzərinə götürür.',
  penalty: '48 saatlıq müddət pozulduqda borclu tərəf növbəti səfərin tam məbləğini ödəyir.'
},
{
  id: 'plan-canceller', cat: 'friends', tone: 'zarafat', layout: 'lisenziya', palette: 'ink',
  title: 'Plan Ləğvetmə Lisenziyası', tag: 'Universal',
  toLabel: 'LİSENZİYA SAHİBİ',
  preamble: 'Bu lisenziya {to} adlı şəxsə razılaşdırılmış planları son anda ləğv etmək hüququ verir. Lisenziya {from} tərəfindən, artıq gözlənilən davranışın rəsmiləşdirilməsi məqsədilə təqdim olunmuşdur.',
  powers: 'Görüşdən 30 dəqiqə əvvəl ləğv etmək.\nSəbəb kimi «yorğunam» yazmaq.\nEyni planı üç dəfə təxirə salmaq.\nLəğv etdikdən sonra onlayn görünmək.',
  penalty: 'Ardıcıl üçüncü ləğvdən sonra lisenziya dayandırılır və sahib növbəti görüşü təşkil etmək öhdəliyi daşıyır.'
},
{
  id: 'wedding-table', cat: 'friends', tone: 'zarafat', layout: 'notarial', palette: 'burgundy',
  title: 'Toy Masası Səlahiyyətnaməsi', tag: 'Mövsümi',
  preamble: 'Bu səlahiyyətnamə ilə {from} tərəfindən {to} adlı şəxsə toy məclisində masa idarəçiliyi səlahiyyəti verilir. Səlahiyyət yalnız həmin məclis müddətində qüvvədədir və başqa şəxsə ötürülə bilməz.',
  powers: 'Masada oturma sırasını müəyyən etmək.\nRəqsə ilk çıxmaq növbəsini təyin etmək.\nOrkestrə sifariş vermək (gecədə 2 mahnı).\nQonaqlara «bir dəqiqə» deyib yoxa çıxmaq.',
  penalty: 'Səlahiyyət sui-istifadə edildikdə növbəti məclisdə sahib ən uzaq masaya təyin olunur.'
},
{
  id: 'dietary-oath', cat: 'friends', tone: 'zarafat', layout: 'muqavile', palette: 'forest',
  title: 'Birlikdə Pəhriz Andı', tag: 'Yanvar',
  toLabel: 'And içən', fromLabel: 'Şahid',
  preamble: '{to} adlı şəxs {from} qarşısında pəhriz rejiminə əməl edəcəyinə and içir. And bazar ertəsi qüvvəyə minir və növbəti bazar ertəsinə qədər davam edir.',
  powers: 'Həftədə bir dəfə istisna gün elan etmək.\nBaşqasının boşqabından dadmaq (say hesab edilmir).\nÇəkini yalnız səhər ölçmək.\nPəhrizin başlanğıc tarixini yeniləmək.',
  penalty: 'And pozulduqda pozan tərəf növbəti həftə birgə idmanın bütün təşkilini öz üzərinə götürür.'
},
{
  id: 'gossip-license', cat: 'friends', tone: 'zarafat', layout: 'lisenziya', palette: 'forest',
  title: 'Söhbət Aparma Lisenziyası', tag: 'Padruqa',
  powersLabel: 'İCAZƏ VERİLƏN MÖVZULAR',
  preamble: 'Bu lisenziya {to} adlı şəxsə {from} ilə saatlarla davam edən telefon söhbətləri aparmaq hüququ verir. Lisenziya gecə saatlarında da qüvvədədir və batareya bitənə qədər etibarlıdır.',
  powers: 'Bir mövzudan digərinə xəbərdarlıq etmədən keçmək.\n«Sonuncu bir şey» ifadəsini üç dəfə istifadə etmək.\nSöhbəti 40 dəqiqə uzatmaq.\nHekayəni əvvəldən təkrar danışmaq.',
  penalty: 'Söhbətin mövzusu üçüncü şəxsə çatdıqda lisenziya dayandırılır və bərpası üçün ortaq razılıq tələb olunur.'
},

/* ==================== İŞ YERİ ==================== */
{
  id: 'salary-diploma', cat: 'work', tone: 'zarafat', layout: 'diplom', palette: 'steel',
  title: 'Heç Nə Etmədən Maaş Almaq Diplomu', tag: 'Ofis klassikası',
  preamble: 'Zarafat Notariat Palatası təsdiq edir ki, bu şəxs iş saatları ərzində minimum fəaliyyət göstərməklə maksimum nəticə təəssüratı yaratmaq sahəsində yüksək ixtisas nümayiş etdirmişdir. Diplom {from} tərəfindən təqdim olunur.',
  powers: 'Klaviaturaya səslə toxunaraq məşğul təəssüratı yaratmaq.\nEkranda daim açıq cədvəl saxlamaq.\nToplantıda «razıyam, davam edək» demək.\nHəftəlik hesabatı bir cümlə ilə yazmaq.',
  penalty: 'Fəaliyyətin real yoxlanışı zamanı uyğunsuzluq aşkar edilərsə, diplom sahibi növbəti komanda toplantısının protokolunu yazmaq öhdəliyi daşıyır.'
},
{
  id: 'meeting-silence', cat: 'work', tone: 'zarafat', layout: 'sertifikat', palette: 'ink',
  title: 'Toplantıda Susma Ustalığı Sertifikatı', tag: 'Uzaqdan iş',
  preamble: 'Bu sertifikat {to} adlı şəxsin bir saatlıq toplantı ərzində heç bir söz deməyərək eyni zamanda tam iştirak təəssüratı yaratmaq bacarığını təsdiq edir. Qiymətləndirmə {from} tərəfindən aparılmışdır.',
  powers: 'Kameranı bağlı saxlamaq və «şəbəkə problemi» yazmaq.\nMüvafiq anlarda başını tərpətmək.\nÇatda «+1» yazaraq mövqe bildirmək.\nToplantının sonunda «hər şey aydındır» demək.',
  penalty: 'Sertifikat sahibi toplantıda təsadüfən danışdığı halda həmin mövzunun məsul şəxsi təyin edilir və geri qaytarılma mümkün deyil.'
},
{
  id: 'coffee-authority', cat: 'work', tone: 'zarafat', layout: 'notarial', palette: 'gold',
  title: 'Kofe Maşını Üzərində Nəzarət Səlahiyyəti', tag: 'Strateji',
  preamble: 'Bu sənədlə {from} tərəfindən {to} adlı şəxsə ofis kofe maşını üzərində tam və mübahisəsiz nəzarət səlahiyyəti verilir. Səlahiyyət kollektivin sabitliyi naminə təqdim olunmuşdur.',
  powers: 'Kofe növünü təkbaşına müəyyən etmək.\nMaşını təmizləmək növbəsini digərlərinə həvalə etmək.\nSüd ehtiyatına nəzarət etmək.\nSəhər saat 10:00-a qədər növbədə birinci olmaq.',
  penalty: 'Kofe ehtiyatının nəzarətsizlik ucbatından bitməsi halında səlahiyyət dərhal ləğv olunur və növbəti ay üçün ehtiyat sahibin hesabına alınır.'
},
{
  id: 'tomorrow-promise', cat: 'work', tone: 'zarafat', layout: 'teleqram', palette: 'burgundy',
  title: '«Sabah Göndərərəm» Müddətsiz Vədnaməsi', tag: 'Universal',
  toLabel: 'Vəd verən', fromLabel: 'Vədi gözləyən',
  preamble: 'Bu vədnamə ilə {to} adlı şəxs {from} qarşısında müəyyən edilmiş işi «sabah» göndərməyi öhdəsinə götürür. Tərəflər «sabah» anlayışının konkret tarixə bağlı olmadığını qəbul edirlər.',
  powers: '«Sabah göndərərəm» ifadəsini limitsiz istifadə etmək.\nSon tarixi könüllü olaraq yeniləmək.\nFaylı 95% hazır elan etmək.\nCavabsız mesajları oxunmuş saymamaq.',
  penalty: 'Vədnamənin icrası ardıcıl beş dəfə təxirə salındıqda sənəd sahibi işi həmin gün, iş saatından sonra tamamlamaq öhdəliyi daşıyır.'
},
{
  id: 'deadline-extension', cat: 'work', tone: 'zarafat', layout: 'qerar', palette: 'steel',
  title: 'Son Tarix Uzatma Etibarnaməsi', tag: 'Layihə',
  preamble: 'Bu etibarnamə ilə {from} tərəfindən {to} adlı şəxsə layihənin son tarixini bir dəfə, tərəflərin razılığı olmadan uzatmaq səlahiyyəti verilir. Etibarnamə yalnız bir layihəyə şamil olunur.',
  powers: 'Son tarixi 5 iş günü uzatmaq.\nSəbəb kimi «əlaqəli komandadan cavab gözləyirik» yazmaq.\nStatusu «davam edir» saxlamaq.\nHesabatda faiz göstəricisini yuvarlaqlaşdırmaq.',
  penalty: 'İkinci uzatma tələbi qəbul edilmir; bu halda sənəd sahibi gündəlik status yeniləməsi göndərmək öhdəliyi daşıyır.'
},
{
  id: 'camera-off', cat: 'work', tone: 'zarafat', layout: 'lisenziya', palette: 'steel',
  title: 'Kameranı Açmama Lisenziyası', tag: 'Uzaqdan iş',
  toLabel: 'LİSENZİYA SAHİBİ',
  preamble: 'Bu lisenziya {to} adlı şəxsə onlayn toplantılarda kameranı açmamaq hüququ verir. Lisenziya {from} tərəfindən verilmiş və bütün platformalara şamil olunur.',
  powers: 'Kameranı bütün toplantı boyu bağlı saxlamaq.\nProfil şəklini kamera görüntüsü kimi təqdim etmək.\n«Kamera işləmir» ifadəsini müddətsiz istifadə etmək.\nEkran paylaşımına keçərək mövzunu dəyişmək.',
  penalty: 'Lisenziya rüblük ümumi toplantıya şamil olunmur; həmin toplantıda kamera açılmalıdır.'
},
{
  id: 'cc-authority', cat: 'work', tone: 'zarafat', layout: 'muqavile', palette: 'ink',
  title: '«Cc-də Saxlayıram» Səlahiyyətnaməsi', tag: 'E-poçt',
  preamble: 'Bu səlahiyyətnamə ilə {to} adlı şəxsə istənilən yazışmada üçüncü şəxsləri məlumat üçün kopyaya salmaq səlahiyyəti verilir. Səlahiyyət {from} tərəfindən, məsuliyyətin bölüşdürülməsi məqsədilə təqdim olunmuşdur.',
  powers: 'İstənilən şəxsi kopyaya salmaq.\n«Məlumat üçün» ifadəsi ilə məsuliyyəti paylaşmaq.\nCavabı «hamıya cavabla» göndərmək.\nMövzu sətrini üç dəfə dəyişmək.',
  penalty: 'Kopyaya salınmış şəxslərin sayı on beşi keçdikdə səlahiyyət dayandırılır və yazışma birbaşa ünvana yönləndirilir.'
},
{
  id: 'lunch-king', cat: 'work', tone: 'zarafat', layout: 'vesiqe', palette: 'burgundy',
  title: 'Nahar Fasiləsi Uzatma Vəsiqəsi', tag: 'Gündəlik',
  preamble: 'Bu vəsiqə {to} adlı şəxsə nahar fasiləsini rəsmi müddətdən artıq davam etdirmək hüququ verir. Vəsiqə {from} tərəfindən, məhsuldarlığın nahardan sonra artdığı müşahidəsinə əsasən verilmişdir.',
  powers: 'Fasiləni 20 dəqiqə uzatmaq.\nQayıdışda qəhvə növbəsində dayanmaq.\n«Yoldayam» yazıb hələ kafedə olmaq.\nSonrakı 15 dəqiqəni «yenidən fokuslanma» adlandırmaq.',
  penalty: 'Fasilə iki saatı aşdıqda vəsiqə həmin həftə üçün dayandırılır və sahib komanda üçün qəhvə gətirir.'
},
{
  id: 'printer-master', cat: 'work', tone: 'zarafat', layout: 'sertifikat', palette: 'steel',
  title: 'Printer Ustası Sertifikatı', tag: 'Texniki',
  preamble: 'Bu sertifikat {to} adlı şəxsin ofis printerini kağız sıxışdığı hallarda bərpa etmək sahəsindəki müstəsna bacarığını təsdiq edir. Qiymətləndirmə {from} tərəfindən aparılmışdır.',
  powers: 'Printeri qapağını açıb-bağlamaqla bərpa etmək.\nKartricin bitdiyini gözlə müəyyən etmək.\nNövbəni idarə etmək.\n«Yenidən göndər» məsləhətini rəsmi həll kimi təqdim etmək.',
  penalty: 'Bərpa cəhdi iki dəfə uğursuz olduqda sertifikat sahibi texniki dəstəyə müraciət formasını doldurmaq öhdəliyi daşıyır.'
},
{
  id: 'employee-year', cat: 'work', tone: 'zarafat', layout: 'diplom', palette: 'forest',
  title: 'İlin İşçisi Diplomu', tag: 'Təltif',
  preamble: 'Zarafat Notariat Palatası təsdiq edir ki, bu şəxs heç bir səsvermə keçirilmədən, tamamilə öz təşəbbüsü ilə «İlin İşçisi» adına layiq görülmüşdür. Diplom {from} tərəfindən təqdim olunur.',
  powers: 'Adı iş yerində nümayiş etdirmək.\nToplantılarda titula istinad etmək.\nSəsvermə nəticələrini açıqlamamaq.\nNövbəti il üçün adı avtomatik uzatmaq.',
  penalty: 'Diplom geri alınmır. Sahibi yalnız komandaya bir dəfə şirniyyat gətirmək öhdəliyi daşıyır.'
},
{
  id: 'excuse-registry', cat: 'work', tone: 'zarafat', layout: 'arayis', palette: 'ink',
  title: 'Bəhanə Bankı Qeydiyyat Aktı', tag: 'Arxiv',
  powersLabel: 'QEYDƏ ALINMIŞ BƏHANƏLƏR',
  preamble: 'Bu aktla {to} adlı şəxsin istifadə etdiyi bəhanələr rəsmi qeydiyyata alınır. Qeydiyyat {from} tərəfindən aparılmış və təkrar istifadənin qarşısını almaq məqsədi daşıyır.',
  powers: 'İnternet kəsildi — 12 dəfə istifadə edilib.\nFayl göndərildi, çatmayıb — 9 dəfə.\nTəqvimə düşməyib — 7 dəfə.\nEyni anda iki toplantı var idi — 5 dəfə.',
  penalty: 'Eyni bəhanə üçüncü dəfə istifadə edildikdə akta yeni bəhanə əlavə edilməsi tələb olunur; təkrarlar qəbul edilmir.'
},
{
  id: 'ac-authority', cat: 'work', tone: 'zarafat', layout: 'blank', palette: 'burgundy',
  title: 'Kondisioner Üzərində Nəzarət Fərmanı', tag: 'Yay',
  preamble: 'Bu fərmanla {to} adlı şəxsə ofis kondisionerinin temperaturu üzərində tam nəzarət səlahiyyəti verilir. Fərman {from} tərəfindən, uzunmüddətli temperatur müharibəsinə son qoymaq məqsədilə imzalanmışdır.',
  powers: 'Temperaturu təkbaşına müəyyən etmək.\nPultu görünməyən yerdə saxlamaq.\n«Elə belə normaldır» qərarını qəbul etmək.\nŞikayətləri növbəti günə təxirə salmaq.',
  penalty: 'Ofisdə eyni gündə üç və daha çox şikayət qeydə alındıqda fərman dayandırılır və temperatur ümumi səsvermə ilə müəyyən edilir.'
},

/* ---------------- AİLƏ / UŞAQLAR ---------------- */
{
  id: 'homework-truce', cat: 'family', tone: 'zarafat', layout: 'notarial', palette: 'gold',
  title: 'Dərs Saatı Barışıq Sazişi', tag: 'Axşam sülhü',
  toLabel: 'Dərs oxuyan tərəf', fromLabel: 'Nəzarət edən tərəf',
  preamble: 'Bu sazişlə {from} və {to} arasında dərs saatları ilə bağlı uzun illik münaqişəyə son qoyulur. Tərəflər qışqırmadan, ah-vay etmədən və «bir azdan başlayacam» ifadəsinə müraciət etmədən razılığa gəlmək öhdəliyi götürürlər.',
  powers: 'Dərsə başlamazdan əvvəl 10 dəqiqəlik hazırlıq fasiləsi.\nHər 40 dəqiqədən bir 5 dəqiqəlik rəsmi ara.\nBir sual üçün gündə iki dəfə kömək istəmək.\nRiyaziyyat məsələsindən sonra şirniyyat tələb etmək.',
  penalty: 'Fasilə müddəti üç dəfə artıq işlədildikdə növbəti gün planşetdən istifadə hüququ bir saatlıq dayandırılır.'
},
{
  id: 'screen-time-license', cat: 'family', tone: 'zarafat', layout: 'lisenziya', palette: 'ink',
  title: 'Ekran Vaxtı Lisenziyası', tag: 'Ən çox tələb olunan',
  powersLabel: 'LİSENZİYANIN ƏHATƏ ETDİYİ HALLAR',
  preamble: '{from} tərəfindən {to} adlı şəxsə gündəlik ekran vaxtından istifadə etmək üçün rəsmi lisenziya verilir. Lisenziya yalnız ev tapşırıqları tamamlandıqdan və otaq səliqəyə salındıqdan sonra qüvvəyə minir.',
  powers: 'İş günü 90 dəqiqə, həftəsonu 150 dəqiqə ekran vaxtı.\nMultfilm seçimini təkbaşına etmək.\nSon 5 dəqiqə üçün əlavə vaxt istəmək (gündə 1 dəfə).\nNahar süfrəsində telefonu masaya qoymamaq.',
  penalty: 'Vaxt həddi üç gün ardıcıl aşıldıqda lisenziya bir həftəlik dayandırılır və oxu vaxtı ilə əvəz olunur.'
},
{
  id: 'allowance-contract', cat: 'family', tone: 'zarafat', layout: 'muqavile', palette: 'steel',
  title: 'Cib Xərcliyi Müqaviləsi', tag: 'Maliyyə intizamı',
  preamble: 'Bu müqavilə ilə {from} tərəfindən {to} adlı şəxsə həftəlik cib xərcliyi ayrılır. Vəsaitin sərf olunma istiqaməti sərbəstdir, lakin ay sonunda «pulum yoxdur» ifadəsi ilə əlavə maliyyələşmə tələb etmək hüququ verilmir.',
  powers: 'Həftəlik məbləği bazar ertəsi almaq.\nXərcləri heç kimə izah etməmək.\nYığım etdikdə bonus tələb etmək hüququ.\nAyda bir dəfə avans istəmək (əsaslandırma ilə).',
  penalty: 'Avans üç həftə ardıcıl istənildikdə növbəti ayın xərcliyi hissə-hissə, həftədə iki dəfə ödənilir.'
},
{
  id: 'bedtime-decree', cat: 'family', tone: 'zarafat', layout: 'blank', palette: 'burgundy',
  title: 'Yatma Saatı Fərmanı', tag: 'Gecə rejimi',
  preamble: 'Bu fərmanla {from} tərəfindən {to} adlı şəxs üçün yatma saatı rəsmi olaraq müəyyən edilir. Fərman «bir dəqiqə də oynayım» müraciətlərinə baxmayaraq qüvvədə qalır və gecə saatlarında bütün ev üzvləri üçün məcburidir.',
  powers: 'İş günü saat 22:00, həftəsonu 23:30-da yatmaq.\nYatmazdan əvvəl bir nağıl tələb etmək.\nGecə lampasını söndürməmək hüququ.\nSəhər 10 dəqiqə əlavə yatmaq (həftəsonu).',
  penalty: 'Fərman ardıcıl iki gecə pozulduqda növbəti həftəsonu yatma saatı bir saat qabağa çəkilir.'
},
{
  id: 'room-cleaning-act', cat: 'family', tone: 'zarafat', layout: 'arayis', palette: 'forest',
  title: 'Otaq Təmizliyi Aktı', tag: 'Yoxlama nəticəsi',
  toLabel: 'Otağın sahibi', fromLabel: 'Yoxlamanı aparan',
  preamble: 'Bu aktla təsdiq olunur ki, {to} adlı şəxsin otağı {from} tərəfindən yoxlanılmış və təmizlik səviyyəsi qənaətbəxş hesab edilmişdir. Çarpayının altı və şkafın içi yoxlama zamanı, qarşılıqlı razılıq əsasında, açılmamışdır.',
  powers: 'Otağı həftədə bir dəfə tam təmizləmək.\nCorabları döşəmədən yığmaq (gündəlik).\nStolun üstündə ən çoxu üç stəkan saxlamaq.\nYoxlamadan əvvəl 20 dəqiqə xəbərdarlıq almaq.',
  penalty: 'İki ardıcıl yoxlamada eyni qüsur aşkarlandıqda növbəti həftə ümumi otaqların təmizliyi də həvalə olunur.'
},
{
  id: 'best-child-diploma', cat: 'family', tone: 'zarafat', layout: 'diplom', palette: 'burgundy',
  title: 'İlin Ən Yaxşı Övladı Diplomu', tag: 'Fəxri ad',
  preamble: '{from} tərəfindən {to} adlı şəxsə, il ərzində göstərdiyi nümunəvi davranışa, vaxtında gələn cavab mesajlarına və heç bir xatırlatma olmadan yuyulan qablara görə bu fəxri diplom təqdim olunur.',
  powers: 'İl boyu bir dəfə «mən demişdim» deməmək.\nQonaq gələndə salamlaşmağı unutmamaq.\nAnaya gündə bir dəfə zəng etmək.\nSoyuducunun qapısını uzun müddət açıq saxlamamaq.',
  penalty: 'Diploma layiq olma şərtləri pozulduqda ad növbəti ilə qədər müvəqqəti dayandırılır və divardan asılmır.'
},
{
  id: 'dinner-veto', cat: 'family', tone: 'zarafat', layout: 'sertifikat', palette: 'steel',
  title: 'Şam Yeməyi Veto Səlahiyyəti', tag: 'Menyu hüququ',
  powersLabel: 'VETO HÜQUQUNUN ŞƏRTLƏRİ',
  preamble: 'Bu sertifikatla {to} adlı şəxsə şam yeməyi menyusuna veto qoymaq səlahiyyəti verilir. Səlahiyyət {from} tərəfindən, uzunmüddətli menyu mübahisələrinə son qoymaq məqsədilə könüllü şəkildə həvalə edilmişdir.',
  powers: 'Həftədə bir dəfə menyunu tam dəyişmək.\nEyni yeməyin ardıcıl iki gün verilməsinə etiraz.\nSüfrəyə pendir əlavə olunmasını tələb etmək.\nSupu «sonra içərəm» deyib təxirə salmaq.',
  penalty: 'Veto həftədə ikidən çox işlədildikdə növbəti şam yeməyini veto qoyan şəxs özü hazırlayır.'
},
{
  id: 'parent-verdict', cat: 'family', tone: 'zarafat', layout: 'qerar', palette: 'ink',
  title: 'Valideyn Məhkəməsinin Qərarı', tag: 'Ali instansiya',
  preamble: 'Zarafat Məhkəməsi {from} ilə {to} arasındakı mübahisəyə baxaraq müəyyən etdi ki, tərəflər arasında yaranmış anlaşılmazlıq qarşılıqlı güzəşt yolu ilə həll oluna bilər və heç bir tərəf tam haqlı sayılmır.',
  powers: 'Hər iki tərəf beş dəqiqə fasilə verir.\nSəs tonu normal səviyyəyə endirilir.\nQalan mübahisə səhərə saxlanılır.\nBarışıq şirniyyat ilə rəsmiləşdirilir.',
  penalty: 'Qərar icra olunmadıqda iş yenidən baxılmaq üçün nənəyə göndərilir və onun qərarı qəti sayılır.'
},
{
  id: 'sibling-peace', cat: 'family', tone: 'zarafat', layout: 'muqavile', palette: 'forest',
  title: 'Bacı-Qardaş Sülh Müqaviləsi', tag: 'Sərhəd bölgüsü',
  preamble: 'Bu müqavilə ilə {from} və {to} arasında otaq, oyuncaq və pult üzərində uzun illik münaqişəyə son qoyulur. Tərəflər bir-birinin əşyalarını icazəsiz götürməmək və valideynə şikayət etməzdən əvvəl danışıqlar aparmaq öhdəliyi götürürlər.',
  powers: 'Otağın sərhədi razılaşdırılmış xətt üzrə müəyyən edilir.\nPult növbə ilə, hər biri 40 dəqiqə.\nBorc alınan əşya eyni gün qaytarılır.\nŞikayətdən əvvəl bir dəfə xəbərdarlıq edilir.',
  penalty: 'Sərhəd icazəsiz keçildikdə pozan tərəf növbəti gün pult növbəsindən tam məhrum edilir.'
},
{
  id: 'grade-telegram', cat: 'family', tone: 'zarafat', layout: 'teleqram', palette: 'gold',
  title: 'Qiymət Bildirişi Teleqramı', tag: 'Təcili xəbər',
  preamble: '{from} tərəfindən {to} adlı şəxsə təcili bildiriş göndərilir. Məktəbdən gələn qiymət barədə məlumat rəsmi qaydada çatdırılır və izahat vermək üçün 24 saat müddət ayrılır.',
  powers: 'İzahat şifahi və ya yazılı verilə bilər.\nBir dəfə «müəllim düzgün qiymətləndirmədi» arqumenti qəbul olunur.\nDüzəltmə imtahanı üçün dəstək təmin edilir.\nXəbər nənəyə çatdırılmır (şərtli).',
  penalty: 'İzahat 24 saat ərzində verilmədikdə məlumat bütün ailə qrupuna avtomatik ötürülür.'
},
{
  id: 'junior-id', cat: 'family', tone: 'zarafat', layout: 'vesiqe', palette: 'steel',
  title: 'Kiçik Ailə Üzvü Vəsiqəsi', tag: 'Şəxsiyyət sənədi',
  fromLabel: 'Vəsiqəni verən',
  preamble: 'Bu vəsiqə {to} adlı şəxsin ailənin tamhüquqlu kiçik üzvü olduğunu təsdiq edir. Vəsiqə {from} tərəfindən verilmişdir və soyuducunun qarşısında, süfrə arxasında və pult mübahisələrində etibarlıdır.',
  powers: 'Süfrədə öz daimi yerini tutmaq.\nQonaq gələndə ilk şirniyyatı seçmək.\nAilə qərarlarında bir səsə malik olmaq.\nHəftədə bir dəfə axşam menyusunu təyin etmək.',
  penalty: 'Vəsiqə itirildikdə yenisi verilir, lakin bir həftə ərzində şirniyyat növbəsi sonuncuya keçir.'
},
{
  id: 'chore-authority', cat: 'family', tone: 'zarafat', layout: 'notarial', palette: 'burgundy',
  title: 'Ev İşləri Səlahiyyətnaməsi', tag: 'Növbə cədvəli',
  powersLabel: 'HƏVALƏ OLUNAN İŞLƏR',
  preamble: 'Bu səlahiyyətnamə ilə {from} tərəfindən {to} adlı şəxsə müəyyən ev işlərinin icrası həvalə olunur. Səlahiyyət könüllü qəbul edilmiş sayılır və «mən növbəmi keçən həftə etmişdim» iddiası sənədlə təsdiqlənmədikdə nəzərə alınmır.',
  powers: 'Qabları həftədə üç dəfə yumaq.\nZibili axşam saat 21:00-a qədər çıxarmaq.\nÇarpayını hər səhər yığmaq.\nPaltarları maşından çıxarıb asmaq.',
  penalty: 'Növbə iki dəfə ötürüldükdə növbəti həftə paltar ütüləmək öhdəliyi də əlavə olunur.'
},

/* ---------------- QOHUMLAR / QAYNANA ---------------- */
{
  id: 'mother-in-law-protocol', cat: 'relatives', tone: 'zarafat', layout: 'blank', palette: 'burgundy',
  title: 'Qaynana Ziyarəti Protokolu', tag: 'Ən çox paylaşılan',
  toLabel: 'Ziyarət olunan tərəf', fromLabel: 'Ziyarətə gələn tərəf',
  preamble: 'Bu protokolla {from} tərəfindən {to} adlı şəxsin evinə ediləcək ziyarətin qaydaları müəyyən edilir. Ziyarət əvvəlcədən xəbərdarlıq əsasında baş tutur və mətbəxə giriş yalnız ev sahibinin müşayiəti ilə mümkündür.',
  powers: 'Ziyarətdən ən azı 3 saat əvvəl xəbər vermək.\nMətbəxdə yeməyin duzuna şərh verməmək.\nOtaqların səliqəsi barədə fikir bildirməmək.\nZiyarətin müddəti 4 saatı keçməmək.',
  penalty: 'Protokol pozulduqda növbəti ziyarət qarşı tərəfin evində və onun müəyyən etdiyi vaxtda keçirilir.'
},
{
  id: 'recipe-secret-act', cat: 'relatives', tone: 'zarafat', layout: 'notarial', palette: 'gold',
  title: 'Ailə Reseptinin Sirr Aktı', tag: 'Məxfi sənəd',
  preamble: 'Bu aktla {from} tərəfindən {to} adlı şəxsə ailənin əsrlik plov reseptinin bir hissəsi etibar edilir. Resept şifahi ötürülür, yazıya alınmır və heç bir halda qonşu ailəyə açıqlanmır.',
  powers: 'Resepti yalnız öz mətbəxində tətbiq etmək.\nÖlçüləri «gözəyarı» saxlamaq.\nSirri ən tezi 10 il sonra ötürmək.\nZəfəranın mənbəyini heç kimə deməmək.',
  penalty: 'Sirr üçüncü şəxsə açıqlandıqda akt ləğv edilir və resept sahibinə bayram süfrəsində izahat vermək öhdəliyi qoyulur.'
},
{
  id: 'wedding-advice-license', cat: 'relatives', tone: 'zarafat', layout: 'lisenziya', palette: 'burgundy',
  title: 'Toy Məsləhəti Vermə Lisenziyası', tag: 'Məhdud icazə',
  powersLabel: 'LİSENZİYANIN ƏHATƏ DAİRƏSİ',
  preamble: '{from} tərəfindən {to} adlı şəxsə toy hazırlığı ilə bağlı məsləhət vermək üçün məhdud lisenziya verilir. Lisenziya yalnız soruşulduqda qüvvəyə minir və gəlinin paltar seçiminə şamil edilmir.',
  powers: 'Süfrə menyusu barədə fikir bildirmək.\nQonaq siyahısına bir ad təklif etmək.\nMusiqi seçiminə bir dəfə müdaxilə etmək.\n«Bizim vaxtımızda belə idi» ifadəsini ayda 2 dəfə işlətmək.',
  penalty: 'Soruşulmadan verilən hər üç məsləhətdən sonra lisenziya toy gününə qədər dayandırılır.'
},
{
  id: 'guest-visit-permit', cat: 'relatives', tone: 'zarafat', layout: 'arayis', palette: 'steel',
  title: 'Xəbərsiz Qonaq Gəlmə İcazəsi', tag: 'Xüsusi hal',
  toLabel: 'İcazə verilən şəxs', fromLabel: 'İcazəni verən ev sahibi',
  preamble: 'Bu arayışla təsdiq olunur ki, {to} adlı şəxsə {from} tərəfindən müstəsna hallarda xəbərsiz qonaq gəlmək icazəsi verilmişdir. İcazə ildə iki dəfə istifadə oluna bilər və bayram günlərini əhatə etmir.',
  powers: 'İldə iki dəfə xəbərsiz gəlmək.\nGəlişdən sonra ilk 15 dəqiqə çay gözləmək.\nEvin səliqəsi barədə şərh verməmək.\nQalma müddəti 2 saatı keçməmək.',
  penalty: 'İcazə həddi aşıldıqda növbəti il üçün bütün ziyarətlər əvvəlcədən zənglə razılaşdırılır.'
},
{
  id: 'family-council-decision', cat: 'relatives', tone: 'zarafat', layout: 'qerar', palette: 'ink',
  title: 'Ailə Şurasının Qərarı', tag: 'Yekun qərar',
  preamble: 'Zarafat Məhkəməsi {from} ilə {to} arasında qohumluq münasibətləri üzrə yaranmış mübahisəyə baxaraq müəyyən etdi ki, hər iki tərəfin arqumentləri bayram süfrəsində eyni dərəcədə səslənmişdir və qəti üstünlük yoxdur.',
  powers: 'Mübahisə mövzusu bir il müddətinə bağlanır.\nHər iki tərəf digərinin evinə növbə ilə gedir.\nKöhnə hadisələr xatırladılmır.\nQərar bütün qohumlara eyni formada çatdırılır.',
  penalty: 'Mövzu vaxtından əvvəl açıldıqda açan tərəf növbəti ailə yığıncağını öz evində təşkil edir.'
},
{
  id: 'best-son-in-law', cat: 'relatives', tone: 'zarafat', layout: 'diplom', palette: 'gold',
  title: 'İlin Ən Yaxşı Kürəkəni Diplomu', tag: 'Fəxri ad',
  preamble: '{from} tərəfindən {to} adlı şəxsə, il ərzində göstərdiyi nümunəvi davranışa, vaxtında edilən zənglərə və heç bir xatırlatma olmadan gətirilən şirniyyata görə bu fəxri diplom təqdim olunur.',
  powers: 'Həftədə bir dəfə zəng etmək.\nBayramlarda ilk təbrik edən olmaq.\nSüfrədə plovu tərifləmək (səmimi şəkildə).\nAğır çantaları soruşmadan götürmək.',
  penalty: 'Şərtlər pozulduqda ad növbəti ilədək dayandırılır və qonşu ailənin kürəkəni ilə müqayisə başlanır.'
},
{
  id: 'plov-authority', cat: 'relatives', tone: 'zarafat', layout: 'sertifikat', palette: 'forest',
  title: 'Plov Bişirmə Səlahiyyəti', tag: 'Mətbəx hüququ',
  powersLabel: 'SƏLAHİYYƏTİN HÜDUDLARI',
  preamble: 'Bu sertifikatla {to} adlı şəxsə ailə tədbirlərində plov bişirmək səlahiyyəti verilir. Səlahiyyət {from} tərəfindən uzun illik müşahidə və üç uğurlu sınaqdan sonra rəsmiləşdirilmişdir.',
  powers: 'Qazanı təkbaşına idarə etmək.\nDüyünün növünü seçmək.\nMətbəxə giriş rejimini müəyyən etmək.\nDadına baxmaq növbəsini təyin etmək.',
  penalty: 'Plov iki dəfə ardıcıl uğursuz alındıqda səlahiyyət müvəqqəti olaraq əvvəlki sahibinə qaytarılır.'
},
{
  id: 'holiday-visit-contract', cat: 'relatives', tone: 'zarafat', layout: 'muqavile', palette: 'burgundy',
  title: 'Bayram Ziyarəti Müqaviləsi', tag: 'İllik cədvəl',
  preamble: 'Bu müqavilə ilə {from} və {to} arasında bayram günlərində qarşılıqlı ziyarətlərin ardıcıllığı müəyyən edilir. Tərəflər növbəni pozmamaq və «biz keçən il getmişdik» arqumentini sənədlə əsaslandırmaq öhdəliyi götürürlər.',
  powers: 'Novruz birinci tərəfin evində qeyd olunur.\nQurban bayramı ikinci tərəfdə keçirilir.\nAd günləri ayrıca razılaşdırılır.\nZiyarət müddəti tərəflərin razılığı ilə uzadıla bilər.',
  penalty: 'Növbə əsassız pozulduqda pozan tərəf növbəti iki bayramı öz evində təşkil edir.'
},
{
  id: 'relative-telegram', cat: 'relatives', tone: 'zarafat', layout: 'teleqram', palette: 'forest',
  title: 'Qohumluq Bildirişi Teleqramı', tag: 'Təcili məlumat',
  preamble: '{from} tərəfindən {to} adlı şəxsə təcili bildiriş göndərilir. Qohumluq dərəcəsi, ziyarət tarixi və gətiriləcək şirniyyatın növü barədə məlumat rəsmi qaydada çatdırılır.',
  powers: 'Cavab teleqramı 24 saat ərzində gözlənilir.\nZiyarət tarixi bir dəfə dəyişdirilə bilər.\nŞirniyyat növü müzakirə mövzusu deyil.\nQonaq sayı əvvəlcədən dəqiqləşdirilir.',
  penalty: 'Cavab verilmədikdə ziyarət avtomatik təsdiqlənmiş sayılır və qonaqlar səhər saatlarında gəlirlər.'
},
{
  id: 'bride-id', cat: 'relatives', tone: 'zarafat', layout: 'vesiqe', palette: 'burgundy',
  title: 'Gəlin Vəsiqəsi', tag: 'Şəxsiyyət sənədi',
  fromLabel: 'Vəsiqəni verən',
  preamble: 'Bu vəsiqə {to} adlı şəxsin ailənin tamhüquqlu gəlini olduğunu təsdiq edir. Vəsiqə {from} tərəfindən verilmişdir və bütün ailə tədbirlərində, mətbəxdə və bayram süfrələrində etibarlıdır.',
  powers: 'Süfrədə öz daimi yerini tutmaq.\nMətbəxdə bir yeməyi tam öz üsulu ilə bişirmək.\nAilə qərarlarında səs vermək hüququ.\nQonaq siyahısına bir ad əlavə etmək.',
  penalty: 'Vəsiqə itirildikdə yenisi dərhal verilir, lakin bir ay ərzində çay süfrəsi növbəsi ikiqat olur.'
},
{
  id: 'comparison-ban', cat: 'relatives', tone: 'zarafat', layout: 'blank', palette: 'ink',
  title: 'Müqayisə Qadağası Fərmanı', tag: 'Sinir sülhü',
  preamble: 'Bu fərmanla {from} tərəfindən {to} adlı şəxsin qonşu ailənin uşaqları, kürəkəni və ya gəlini ilə müqayisə edilməsi qadağan olunur. Fərman bütün ailə yığıncaqlarında və telefon danışıqlarında qüvvədədir.',
  powers: 'Müqayisə cümləsi başlanan kimi dayandırılır.\n«Filankəsin oğlu» ifadəsi işlədilmir.\nUğurlar yalnız öz keçmişi ilə müqayisə edilir.\nİldə bir dəfə istisna hüququ saxlanılır.',
  penalty: 'Qadağa pozulduqda pozan tərəf növbəti ailə tədbirində qablı yumaq öhdəliyi daşıyır.'
},
{
  id: 'tea-ceremony-act', cat: 'relatives', tone: 'zarafat', layout: 'notarial', palette: 'steel',
  title: 'Çay Süfrəsi Aktı', tag: 'Süfrə protokolu',
  preamble: 'Bu aktla {from} tərəfindən {to} adlı şəxsə ailə çay süfrəsinin təşkili və idarə olunması həvalə edilir. Aktda armudu stəkanın istifadəsi məcburi, kupanın istifadəsi isə müstəsna hal kimi qeyd olunur.',
  powers: 'Çayı süzmək və növbəni müəyyən etmək.\nMürəbbə növünü seçmək.\nSüfrəyə əlavə şirniyyat gətirmək.\nSöhbətin mövzusunu bir dəfə dəyişmək.',
  penalty: 'Çay soyuq verildikdə növbəti süfrənin təşkili avtomatik olaraq digər tərəfə keçir.'
},

/* ---------------- TƏLƏBƏLƏR / UNİVERSİTET ---------------- */
{
  id: 'exam-luck-certificate', cat: 'student', tone: 'zarafat', layout: 'sertifikat', palette: 'gold',
  title: 'İmtahan Uğuru Sertifikatı', tag: 'Sessiya dövrü',
  powersLabel: 'SERTİFİKATIN VERDİYİ ZƏMANƏTLƏR',
  preamble: 'Bu sertifikatla {from} tərəfindən {to} adlı şəxsə qarşıdakı imtahanda uğur arzulanır və mənəvi dəstək rəsmi qaydada sənədləşdirilir. Sertifikat biletin məzmununa təsir etmir, lakin özünə inamı artırır.',
  powers: 'İmtahandan əvvəl bir stəkan çay pulsuz.\nHər sualdan sonra 30 saniyə düşünmək hüququ.\nBilet dəyişdirmə cəhdi (bir dəfə).\nNəticə elan olunana qədər soruşulmamaq.',
  penalty: 'Sertifikat imtahandan sonra «mən hazır idim» ifadəsi ilə birlikdə istifadə edildikdə etibarsız sayılır.'
},
{
  id: 'konspekt-loan', cat: 'student', tone: 'zarafat', layout: 'muqavile', palette: 'steel',
  title: 'Konspekt Borcu Müqaviləsi', tag: 'Sessiyanın xilaskarı',
  preamble: 'Bu müqavilə ilə {from} tərəfindən {to} adlı şəxsə şəxsi konspekt müvəqqəti istifadəyə verilir. Konspekt üzərində qeyd aparmaq, səhifə qatlamaq və içərisinə çay tökmək qadağandır.',
  powers: 'Konspektdən 48 saat istifadə etmək.\nŞəkil çəkib öz telefonunda saxlamaq.\nOxunmayan yerləri sahibindən soruşmaq.\nİmtahan günü səhər qaytarmaq (son həddir).',
  penalty: 'Konspekt vaxtında qaytarılmadıqda borclu tərəf növbəti semestrin bütün konspektlərini özü yazır.'
},
{
  id: 'dorm-charter', cat: 'student', tone: 'zarafat', layout: 'blank', palette: 'forest',
  title: 'Yataqxana Nizamnaməsi', tag: 'Otaq qaydaları',
  preamble: 'Bu nizamnamə ilə {from} və {to} arasında yataqxana otağında birgə yaşayış qaydaları müəyyən edilir. Sənəd otağın divarına asılır və mübahisə zamanı birinci istinad mənbəyi sayılır.',
  powers: 'Saat 23:00-dan sonra işıq masa lampası ilə.\nQulaqlıqsız musiqi yalnız gündüz.\nSoyuducudakı hər əşyanın sahibi yazılır.\nQonaq gəlişindən 2 saat əvvəl xəbər verilir.',
  penalty: 'Nizamnamə üç dəfə pozulduqda pozan tərəf növbəti ay otağın təmizliyini təkbaşına aparır.'
},
{
  id: 'late-arrival-license', cat: 'student', tone: 'zarafat', layout: 'lisenziya', palette: 'burgundy',
  title: 'Dərsə Gecikmə Lisenziyası', tag: 'Səhər xilası',
  powersLabel: 'LİSENZİYANIN ƏHATƏ ETDİYİ HALLAR',
  preamble: '{from} tərəfindən {to} adlı şəxsə səhər cütlərinə məhdud gecikmə hüququ verilir. Lisenziya yalnız birinci cütə şamil edilir və imtahan günlərində avtomatik dayandırılır.',
  powers: 'Həftədə iki dəfə 10 dəqiqəyə qədər gecikmək.\nAuditoriyaya səssiz daxil olmaq.\nQeydiyyatı fasilədə imzalamaq.\nSəbəb izah etməmək hüququ.',
  penalty: 'Gecikmə 20 dəqiqəni keçdikdə həmin həftənin qalan hissəsində lisenziya qüvvədən düşür.'
},
{
  id: 'attendance-arayis', cat: 'student', tone: 'zarafat', layout: 'arayis', palette: 'steel',
  title: 'Dərsdə İştirak Arayışı', tag: 'Rəsmi təsdiq',
  toLabel: 'Arayış verilir', fromLabel: 'Təsdiq edən qrup yoldaşı',
  preamble: 'Bu arayışla təsdiq olunur ki, {to} adlı şəxs həmin gün auditoriyada fiziki olaraq iştirak etmişdir. {from} tərəfindən verilən bu təsdiq şəxsin diqqətinin harada olduğunu əhatə etmir.',
  powers: 'Qeydiyyatda adı oxunduqda cavab vermək.\nArxa cərgədə oturmaq hüququ.\nFasilədə auditoriyanı tərk etmək.\nSlaydları sonradan istəmək.',
  penalty: 'Arayış yalan məlumat əsasında verildiyi aşkarlandıqda təsdiq edən şəxs bir həftə konspekt paylaşmır.'
},
{
  id: 'deadline-decision', cat: 'student', tone: 'zarafat', layout: 'qerar', palette: 'ink',
  title: 'Təhvil Müddəti üzrə Qərar', tag: 'Son mühlət',
  preamble: 'Zarafat Məhkəməsi {from} ilə {to} arasında işin təhvil müddəti ilə bağlı mübahisəyə baxaraq müəyyən etdi ki, «sabah göndərərəm» ifadəsi hüquqi öhdəlik yaratmır və dəqiq tarix tələb olunur.',
  powers: 'Yeni son mühlət yazılı şəkildə təsbit olunur.\nUzatma yalnız bir dəfə mümkündür.\nHissə-hissə təhvil qəbul edilir.\nGecə saat 23:59 son hədd sayılır.',
  penalty: 'Yeni müddət də pozulduqda iş qrup rəhbərinə ötürülür və növbəti layihədə rol dəyişdirilir.'
},
{
  id: 'group-leader-diploma', cat: 'student', tone: 'zarafat', layout: 'diplom', palette: 'burgundy',
  title: 'Qrup Nümayəndəsi Diplomu', tag: 'Fəxri ad',
  preamble: '{from} tərəfindən {to} adlı şəxsə, semestr boyu qrup çatını idarə etdiyinə, müəllimlə danışıqlar apardığına və heç kimin oxumadığı elanları oxuduğuna görə bu fəxri diplom təqdim olunur.',
  powers: 'Qrup çatında elan yerləşdirmək.\nMüəllimlə imtahan tarixini müzakirə etmək.\nCədvəl dəyişikliyini birinci öyrənmək.\nİlin sonunda təşəkkür tələb etmək.',
  penalty: 'Vacib elan vaxtında paylaşılmadıqda diplom növbəti semestrədək divardan asılmır.'
},
{
  id: 'coffee-night-act', cat: 'student', tone: 'zarafat', layout: 'notarial', palette: 'ink',
  title: 'Gecə Oxuma Aktı', tag: 'Sessiya gecəsi',
  preamble: 'Bu aktla {from} tərəfindən {to} adlı şəxsin imtahandan əvvəlki gecə boyu oxuduğu rəsmi qaydada təsdiq edilir. Aktda oxunan materialın nə qədərinin yadda qaldığı göstərilmir.',
  powers: 'Gecə saat 03:00-a qədər işıq yandırmaq.\nHər 90 dəqiqədən bir kofe hazırlamaq.\nSəhər ikinci cütdə yatmaq (şərti).\n«Mən oxumamışam» deməmək öhdəliyi.',
  penalty: 'Akt imtahandan sonra «heç nə oxumamışdım» ifadəsi ilə birlikdə istifadə olunduqda etibarsız sayılır.'
},
{
  id: 'exam-telegram', cat: 'student', tone: 'zarafat', layout: 'teleqram', palette: 'gold',
  title: 'İmtahan Nəticəsi Teleqramı', tag: 'Təcili xəbər',
  preamble: '{from} tərəfindən {to} adlı şəxsə imtahan nəticəsi barədə təcili bildiriş göndərilir. Məlumat rəsmi qaydada çatdırılır və valideynlərə ötürülməsi ayrıca razılaşdırılır.',
  powers: 'Nəticə ilk növbədə şəxsə çatdırılır.\nİzahat üçün 12 saat müddət verilir.\nApellyasiya cəhdi bir dəfə mümkündür.\nQrup çatında paylaşılması şəxsin öhdəsindədir.',
  penalty: 'Nəticə gizlədildikdə məlumat növbəti ailə söhbətində təsadüfən açıqlanır.'
},
{
  id: 'student-id', cat: 'student', tone: 'zarafat', layout: 'vesiqe', palette: 'forest',
  title: 'Tələbə Şərəf Vəsiqəsi', tag: 'Şəxsiyyət sənədi',
  fromLabel: 'Vəsiqəni verən',
  preamble: 'Bu vəsiqə {to} adlı şəxsin qrupun tamhüquqlu üzvü olduğunu təsdiq edir. Vəsiqə {from} tərəfindən verilmişdir və auditoriyada, kitabxanada və bufetdə etibarlıdır.',
  powers: 'Arxa cərgədə daimi yer tutmaq.\nKonspekt mübadiləsində iştirak etmək.\nQrup qərarlarında bir səsə malik olmaq.\nBufetdə növbəni bir dəfə keçmək.',
  penalty: 'Vəsiqə itirildikdə yenisi verilir, lakin bir həftə konspekt istəmək hüququ dayandırılır.'
},
{
  id: 'presentation-authority', cat: 'student', tone: 'zarafat', layout: 'sertifikat', palette: 'forest',
  title: 'Təqdimat Danışma Səlahiyyəti', tag: 'Komanda işi',
  powersLabel: 'SƏLAHİYYƏTİN HÜDUDLARI',
  preamble: 'Bu sertifikatla {to} adlı şəxsə qrup təqdimatında danışmaq səlahiyyəti verilir. Səlahiyyət {from} və digər komanda üzvləri tərəfindən, slaydları hazırlamaq müqabilində həvalə edilmişdir.',
  powers: 'Giriş və nəticə hissəsini danışmaq.\nSuallara cavab verməyi bölüşdürmək.\nSlayd keçidini idarə etmək.\nVaxt bitdikdə təqdimatı dayandırmaq.',
  penalty: 'Danışan şəxs slaydları oxumaqla kifayətləndikdə səlahiyyət növbəti təqdimatda başqasına keçir.'
},
{
  id: 'retake-amnesty', cat: 'student', tone: 'zarafat', layout: 'blank', palette: 'gold',
  title: 'Təkrar İmtahan Amnistiyası', tag: 'İkinci şans',
  toLabel: 'Amnistiya olunan', fromLabel: 'Amnistiya verən',
  preamble: 'Bu aktla {from} tərəfindən {to} adlı şəxsə keçmiş semestrdə buraxılmış bütün dərslərə görə tam və qeyd-şərtsiz amnistiya elan olunur. Amnistiya yalnız keçmişə şamil edilir.',
  powers: 'Keçmiş qaib sayı müzakirə olunmur.\nTəkrar imtahana hazırlıq üçün 10 gün.\nBir fənn üzrə əlavə məsləhət saatı.\nKeçmiş qiymətlər xatırladılmır.',
  penalty: 'Yeni semestrdə eyni vəziyyət təkrarlandıqda amnistiya ləğv olunur və köhnə hesabat bərpa edilir.'
},

/* ---------------- QONŞULAR / HƏYƏT ---------------- */
{
  id: 'noise-curfew', cat: 'neighbors', tone: 'zarafat', layout: 'blank', palette: 'steel',
  title: 'Səs-Küy Rejimi Fərmanı', tag: 'Gecə sülhü',
  preamble: 'Bu fərmanla {from} tərəfindən {to} adlı şəxs üçün mənzildə səs-küy rejimi müəyyən edilir. Fərman divarın hər iki tərəfi üçün eyni dərəcədə məcburidir və qonşuluq münasibətlərinin əsasını təşkil edir.',
  powers: 'Saat 23:00-dan 08:00-a qədər sükut rejimi.\nMusiqi səviyyəsi qonşu divardan eşidilməyəcək həddə.\nMebel yerdəyişməsi yalnız gündüz.\nBayram günləri istisna hesab olunur.',
  penalty: 'Rejim üç dəfə pozulduqda pozan tərəf növbəti ay pilləkən təmizliyi növbəsini ikiqat çəkir.'
},
{
  id: 'parking-authority', cat: 'neighbors', tone: 'zarafat', layout: 'notarial', palette: 'gold',
  title: 'Park Yeri Səlahiyyətnaməsi', tag: 'Həyət mübahisəsi',
  powersLabel: 'PARK YERİ ÜZRƏ SƏLAHİYYƏTLƏR',
  preamble: 'Bu səlahiyyətnamə ilə {from} tərəfindən {to} adlı şəxsə həyətdəki müəyyən park yerindən istifadə hüququ verilir. Səlahiyyət yalnız bir avtomobilə şamil edilir və qonaq maşınlarını əhatə etmir.',
  powers: 'Razılaşdırılmış yerdən daimi istifadə.\nYer tutulduqda zəng edib xəbər vermək hüququ.\nQonaq maşını üçün 3 saatlıq müvəqqəti icazə.\nQar təmizlənməsində növbədən azad olmaq.',
  penalty: 'Başqasının yeri iki dəfə tutulduqda səlahiyyət bir ay müddətinə dayandırılır.'
},
{
  id: 'stairwell-duty', cat: 'neighbors', tone: 'zarafat', layout: 'arayis', palette: 'forest',
  title: 'Pilləkən Növbəsi Cədvəli', tag: 'Ümumi sahə',
  toLabel: 'Növbəni icra edən', fromLabel: 'Cədvəli təsdiq edən',
  preamble: 'Bu arayışla təsdiq olunur ki, {to} adlı şəxs pilləkən təmizliyi növbəsini vaxtında və keyfiyyətlə icra etmişdir. Təsdiq {from} tərəfindən, mərtəbədəki bütün qonşuların adından verilmişdir.',
  powers: 'Növbəni həftənin istənilən günü icra etmək.\nTəmizlik vasitələrini ümumi büdcədən almaq.\nNövbəni bir dəfə dəyişdirmək hüququ.\nİcra tarixini elan lövhəsinə yazmaq.',
  penalty: 'Növbə iki həftə ardıcıl buraxıldıqda növbəti dövr üçün iki mərtəbə həvalə olunur.'
},
{
  id: 'drill-license', cat: 'neighbors', tone: 'zarafat', layout: 'lisenziya', palette: 'burgundy',
  title: 'Perforator İşlətmə Lisenziyası', tag: 'Təmir mövsümü',
  powersLabel: 'LİSENZİYANIN ƏHATƏ ETDİYİ SAATLAR',
  preamble: '{from} tərəfindən {to} adlı şəxsə mənzildə təmir işləri aparmaq və perforatordan istifadə etmək üçün məhdud lisenziya verilir. Lisenziya yalnız iş günlərində və müəyyən saat aralığında qüvvədədir.',
  powers: 'İş günü 10:00–13:00 və 15:00–18:00 arası.\nFasiləsiz iş müddəti 45 dəqiqədən çox olmamaq.\nBazar günü tam istirahət rejimi.\nİşdən əvvəl qonşulara xəbər vermək.',
  penalty: 'Lisenziya şərtləri pozulduqda növbəti həftə bütün səsli işlər dayandırılır və müddət uzadılmır.'
},
{
  id: 'yard-court-decision', cat: 'neighbors', tone: 'zarafat', layout: 'qerar', palette: 'ink',
  title: 'Həyət Məhkəməsinin Qərarı', tag: 'Skamya hökmü',
  preamble: 'Zarafat Məhkəməsi {from} ilə {to} arasında həyət ərazisindən istifadə üzrə mübahisəyə baxaraq müəyyən etdi ki, hər iki tərəfin iddiası qismən əsaslıdır və ümumi sahə bölünmür.',
  powers: 'Skamya növbə ilə istifadə olunur.\nUşaq meydançası bütün sakinlərə açıqdır.\nAğac altındakı kölgə bölünmür.\nMübahisə birbaşa danışıq yolu ilə həll olunur.',
  penalty: 'Qərar icra olunmadıqda iş həyət ağsaqqalına göndərilir və onun qərarı qəti sayılır.'
},
{
  id: 'best-neighbor-diploma', cat: 'neighbors', tone: 'zarafat', layout: 'diplom', palette: 'gold',
  title: 'İlin Ən Yaxşı Qonşusu Diplomu', tag: 'Fəxri ad',
  preamble: '{from} tərəfindən {to} adlı şəxsə, il ərzində heç bir gecə səs-küy salmadığına, açarı unudulanda qapını açdığına və lifti həmişə mərtəbədə qoyduğuna görə bu fəxri diplom təqdim olunur.',
  powers: 'Bayramlarda ilk təbrik olunan olmaq.\nDuz və çörək borcunda birinci növbə.\nHəyət qərarlarında iki səs hüququ.\nAvtomobili qısa müddət ikinci sırada saxlamaq.',
  penalty: 'Şərtlər pozulduqda ad növbəti ilədək dayandırılır və diplom elan lövhəsindən götürülür.'
},
{
  id: 'balcony-treaty', cat: 'neighbors', tone: 'zarafat', layout: 'muqavile', palette: 'steel',
  title: 'Balkon Sərhəd Müqaviləsi', tag: 'Sərhəd bölgüsü',
  preamble: 'Bu müqavilə ilə {from} və {to} arasında qonşu balkonların sərhədləri və istifadə qaydaları müəyyən edilir. Tərəflər paltar sərməkdən tutmuş güldan yerləşdirməyə qədər bütün məsələləri razılaşdırırlar.',
  powers: 'Paltar yalnız öz bölməsində sərilir.\nSuvarma suyu aşağı mərtəbəyə axıdılmır.\nGüldanlar məhəccərin daxili tərəfində saxlanılır.\nSiqaret çəkmə saatları razılaşdırılır.',
  penalty: 'Sərhəd üç dəfə pozulduqda pozan tərəf növbəti mövsüm balkon təmizliyini hər iki tərəf üçün aparır.'
},
{
  id: 'playground-rules', cat: 'neighbors', tone: 'zarafat', layout: 'sertifikat', palette: 'forest',
  title: 'Uşaq Meydançası Sertifikatı', tag: 'Həyət qaydası',
  powersLabel: 'MEYDANÇADAN İSTİFADƏ ŞƏRTLƏRİ',
  preamble: 'Bu sertifikatla {to} adlı şəxsin ailəsinə həyət uşaq meydançasından istifadə hüququ təsdiq edilir. Sertifikat {from} tərəfindən bütün sakinlərin adından verilmişdir.',
  powers: 'Meydançadan səhər 09:00–axşam 21:00 arası istifadə.\nOyuncaqları oyundan sonra yerinə qoymaq.\nYelləncək növbəsini gözləmək.\nQum qutusuna heyvan buraxmamaq.',
  penalty: 'Qaydalar pozulduqda ailə bir həftə meydança təmizliyi növbəsinə cəlb olunur.'
},
{
  id: 'neighbor-telegram', cat: 'neighbors', tone: 'zarafat', layout: 'teleqram', palette: 'burgundy',
  title: 'Qonşuya Xəbərdarlıq Teleqramı', tag: 'Son xəbərdarlıq',
  preamble: '{from} tərəfindən {to} adlı şəxsə təcili xəbərdarlıq göndərilir. Mübahisə mövzusu, təkrarlanma sayı və gözlənilən düzəliş müddəti rəsmi qaydada çatdırılır.',
  powers: 'Cavab 48 saat ərzində gözlənilir.\nÜzrxahlıq şifahi qəbul olunur.\nBir dəfə izahat vermək hüququ.\nMəsələ ev idarəsinə ötürülmür (şərti).',
  penalty: 'Cavab verilmədikdə məsələ mərtəbə çatına və sonra ev idarəsinə ötürülür.'
},
{
  id: 'resident-id', cat: 'neighbors', tone: 'zarafat', layout: 'vesiqe', palette: 'ink',
  title: 'Həyət Sakini Vəsiqəsi', tag: 'Şəxsiyyət sənədi',
  fromLabel: 'Vəsiqəni verən',
  preamble: 'Bu vəsiqə {to} adlı şəxsin həyətin tamhüquqlu sakini olduğunu təsdiq edir. Vəsiqə {from} tərəfindən verilmişdir və skamyada, park yerində və pilləkən söhbətlərində etibarlıdır.',
  powers: 'Skamyada daimi yer tutmaq.\nHəyət qərarlarında səs vermək.\nQonaq maşını üçün müvəqqəti yer istəmək.\nElan lövhəsinə məlumat yerləşdirmək.',
  penalty: 'Vəsiqə itirildikdə yenisi verilir, lakin bir ay park yeri növbəsi sonuncuya keçir.'
},
{
  id: 'salt-borrow-act', cat: 'neighbors', tone: 'zarafat', layout: 'notarial', palette: 'burgundy',
  title: 'Duz Borcu Aktı', tag: 'Klassik janr',
  preamble: 'Bu aktla {from} tərəfindən {to} adlı şəxsə bir stəkan duz müvəqqəti istifadəyə verilir. Borcun qaytarılma müddəti müəyyən edilmir, lakin qarşılıqlı xoş münasibət şərti saxlanılır.',
  powers: 'Borcu istənilən vaxt qaytarmaq.\nDuz əvəzinə şəkər qaytarmaq (razılıqla).\nBorcu üç dəfəyə qədər yeniləmək.\nQaytarma zamanı çaya dəvət olunmaq.',
  penalty: 'Borc bir il ərzində qaytarılmadıqda növbəti dəfə duz istəyən tərəf öz stəkanını gətirir.'
},
{
  id: 'wifi-sharing-permit', cat: 'neighbors', tone: 'zarafat', layout: 'arayis', palette: 'steel',
  title: 'Wi-Fi Paylaşma İcazəsi', tag: 'Rəqəmsal qonşuluq',
  toLabel: 'İcazə verilən şəxs', fromLabel: 'Şəbəkə sahibi',
  preamble: 'Bu arayışla təsdiq olunur ki, {to} adlı şəxsə {from} tərəfindən məhdud müddətə Wi-Fi şəbəkəsindən istifadə icazəsi verilmişdir. İcazə şifrənin üçüncü şəxslərə ötürülməsini əhatə etmir.',
  powers: 'Şəbəkəyə eyni anda iki cihaz qoşmaq.\nAxşam saatlarında sürət azalmasına etiraz etməmək.\nŞifrəni heç kimə verməmək.\nİnternet kəsildikdə birlikdə gözləmək.',
  penalty: 'Şifrə üçüncü şəxsə ötürüldükdə icazə dərhal ləğv edilir və şəbəkə adı dəyişdirilir.'
},

/* ---------------- BAYRAM, TOY & AD GÜNÜ ---------------- */
{
  id: 'novruz-sweet-quota', cat: 'holiday', tone: 'zarafat', layout: 'blank', palette: 'gold',
  title: 'Novruz Şirniyyat Kvotası', tag: 'Bayram üçün',
  preamble: 'Bu sənədlə {from} tərəfindən {to} adlı şəxs üçün Novruz süfrəsindən götürüləcək şirniyyatın gündəlik həddi müəyyən edilir. Kvota xoncanın ümumi tarazlığını qorumaq məqsədi daşıyır.',
  powers: 'Gündə 3 paxlava, 2 şəkərbura.\nQonaq gələndə kvota müvəqqəti artırılır.\nSəməni bəzəyinə toxunmamaq.\nSon paxlavanı bölüşmək öhdəliyi.',
  penalty: 'Kvota iki gün ardıcıl aşıldıqda növbəti bayram üçün şirniyyat bişirmək öhdəliyi həvalə olunur.'
},
{
  id: 'wedding-table-contract', cat: 'holiday', tone: 'zarafat', layout: 'muqavile', palette: 'burgundy',
  title: 'Toy Masası Müqaviləsi', tag: 'Oturacaq bölgüsü',
  preamble: 'Bu müqavilə ilə {from} və {to} arasında toy məclisində masa bölgüsü və oturacaq düzümü razılaşdırılır. Tərəflər qonaqların bir-biri ilə münasibətini nəzərə alaraq yerləri müəyyən edirlər.',
  powers: 'Hər tərəf öz qonaq siyahısını təqdim edir.\nMübahisəli qonaqlar ayrı masalara oturdulur.\nUşaq masası səhnədən uzaqda yerləşdirilir.\nSon dəyişiklik toydan 3 gün əvvələ qədər.',
  penalty: 'Razılaşdırılmış düzüm pozulduqda pozan tərəf növbəti tədbirin masa bölgüsünü təkbaşına aparır.'
},
{
  id: 'gift-obligation', cat: 'holiday', tone: 'zarafat', layout: 'notarial', palette: 'gold',
  title: 'Hədiyyə Öhdəliyi Aktı', tag: 'Qarşılıqlı borc',
  preamble: 'Bu aktla {from} tərəfindən {to} adlı şəxsə təqdim olunan hədiyyə rəsmi qeydiyyata alınır. Aktda hədiyyənin dəyəri göstərilmir, lakin qarşılıqlı öhdəliyin yarandığı təsbit edilir.',
  powers: 'Hədiyyəni açarkən səmimi sevinc nümayiş etdirmək.\nÇeki soruşmamaq hüququ.\nQarşılıqlı hədiyyəni bir il ərzində vermək.\nHədiyyəni başqasına ötürməmək.',
  penalty: 'Hədiyyə üçüncü şəxsə ötürüldüyü aşkarlandıqda akt ləğv edilir və qarşılıqlı öhdəlik ikiqat artır.'
},
{
  id: 'birthday-decree', cat: 'holiday', tone: 'zarafat', layout: 'blank', palette: 'burgundy',
  title: 'Ad Günü Fərmanı', tag: 'Bir günlük hakimiyyət',
  preamble: 'Bu fərmanla {from} tərəfindən {to} adlı şəxsə ad günü boyunca müstəsna səlahiyyətlər verilir. Fərman gecə saat 00:00-dan növbəti gecə 00:00-a qədər qüvvədədir.',
  powers: 'Menyunu təkbaşına müəyyən etmək.\nHeç bir ev işi görməmək.\nMusiqi seçimində son söz sahibi olmaq.\nTortun ilk dilimini kəsmək.',
  penalty: 'Səlahiyyət ad günündən sonra da işlədilməyə çalışıldıqda fərman geriyə şamil olunmaqla ləğv edilir.'
},
{
  id: 'dance-license', cat: 'holiday', tone: 'zarafat', layout: 'lisenziya', palette: 'gold',
  title: 'Toyda Rəqs Lisenziyası', tag: 'Səhnə hüququ',
  powersLabel: 'LİSENZİYANIN ƏHATƏ ETDİYİ RƏQSLƏR',
  preamble: '{from} tərəfindən {to} adlı şəxsə toy məclisində rəqs etmək üçün lisenziya verilir. Lisenziya bütün janrları əhatə edir, lakin videoçəkiliş zamanı məsuliyyət şəxsin öz üzərinə düşür.',
  powers: 'Meydança açıldıqdan sonra sərbəst rəqs.\nMusiqi sifariş etmək (gecədə 2 dəfə).\nQohumları rəqsə dəvət etmək.\nVideo çəkilişinə etiraz etmək hüququ.',
  penalty: 'Rəqs zamanı masa yaxınlığında qəza baş verdikdə lisenziya həmin gecə üçün dayandırılır.'
},
{
  id: 'guest-list-arayis', cat: 'holiday', tone: 'zarafat', layout: 'arayis', palette: 'steel',
  title: 'Qonaq Siyahısı Arayışı', tag: 'Rəsmi siyahı',
  toLabel: 'Siyahıya daxil edilən', fromLabel: 'Siyahını tərtib edən',
  preamble: 'Bu arayışla təsdiq olunur ki, {to} adlı şəxs {from} tərəfindən tərtib edilmiş rəsmi qonaq siyahısına daxil edilmişdir. Siyahı tədbirdən 10 gün əvvəl qapanır və sonrakı əlavələr müstəsna hal sayılır.',
  powers: 'Özü ilə bir müşayiətçi gətirmək.\nMasa seçimi barədə xahiş etmək.\nMenyu üzrə xüsusi tələb bildirmək.\nGəlişi 3 gün əvvəl təsdiqləmək.',
  penalty: 'Təsdiq verildikdən sonra gəlinmədikdə növbəti tədbirdə siyahıya ehtiyat qaydada daxil edilir.'
},
{
  id: 'toastmaster-diploma', cat: 'holiday', tone: 'zarafat', layout: 'diplom', palette: 'burgundy',
  title: 'Tamada Diplomu', tag: 'Fəxri ad',
  preamble: '{from} tərəfindən {to} adlı şəxsə, məclisi əvvəldən axıra idarə etdiyinə, hər tosta yeni məzmun tapdığına və heç kimi darıxdırmadığına görə bu fəxri diplom təqdim olunur.',
  powers: 'Söz növbəsini müəyyən etmək.\nTostun müddətini məhdudlaşdırmaq.\nMusiqi fasiləsi elan etmək.\nMəclisin bitmə vaxtını təyin etmək.',
  penalty: 'Tost 4 dəqiqəni keçdikdə diplom müvəqqəti dayandırılır və mikrofon növbəti şəxsə keçir.'
},
{
  id: 'holiday-court', cat: 'holiday', tone: 'zarafat', layout: 'qerar', palette: 'ink',
  title: 'Bayram Süfrəsi Məhkəməsinin Qərarı', tag: 'Süfrə hökmü',
  preamble: 'Zarafat Məhkəməsi {from} ilə {to} arasında bayram süfrəsində yaranmış mübahisəyə baxaraq müəyyən etdi ki, son dilimin taleyi ilə bağlı iddiaların hər ikisi qismən əsaslıdır.',
  powers: 'Son dilim iki yerə bölünür.\nMübahisə süfrədən sonra müzakirə olunmur.\nHər iki tərəf bir-birinə çay süzür.\nQərar bütün qonaqlar qarşısında elan edilir.',
  penalty: 'Qərar icra olunmadıqda son dilim üçüncü tərəfə — ən kiçik qonağa təhvil verilir.'
},
{
  id: 'congrats-telegram', cat: 'holiday', tone: 'zarafat', layout: 'teleqram', palette: 'gold',
  title: 'Təbrik Teleqramı', tag: 'Klassik janr',
  preamble: '{from} tərəfindən {to} adlı şəxsə bayram münasibətilə rəsmi təbrik göndərilir. Teleqram köhnə üsulla, tam böyük hərflərlə tərtib olunmuşdur və səmimiyyət dərəcəsi maksimumdur.',
  powers: 'Təbrik mətni dəyişdirilmədən çatdırılır.\nCavab teleqramı gözlənilir, lakin məcburi deyil.\nMətn ailə qrupunda paylaşıla bilər.\nHər il təkrar göndərilməsi mümkündür.',
  penalty: 'Təbrik cavabsız qaldıqda növbəti il teleqram səhər saat 06:00-da çatdırılır.'
},
{
  id: 'guest-id', cat: 'holiday', tone: 'zarafat', layout: 'vesiqe', palette: 'burgundy',
  title: 'Fəxri Qonaq Vəsiqəsi', tag: 'Şəxsiyyət sənədi',
  fromLabel: 'Vəsiqəni verən',
  preamble: 'Bu vəsiqə {to} adlı şəxsin tədbirin fəxri qonağı olduğunu təsdiq edir. Vəsiqə {from} tərəfindən verilmişdir və məclis boyunca bütün masalarda etibarlıdır.',
  powers: 'Baş masada yer tutmaq.\nTost söyləmək növbəsində üstünlük.\nMenyudan əlavə sifariş vermək.\nTədbiri istənilən vaxt tərk etmək.',
  penalty: 'Vəsiqə itirildikdə yenisi verilir, lakin baş masada yer növbəti tədbirə saxlanılır.'
},
{
  id: 'photo-duty-certificate', cat: 'holiday', tone: 'zarafat', layout: 'sertifikat', palette: 'forest',
  title: 'Bayram Fotosu Səlahiyyəti', tag: 'Ailə arxivi',
  powersLabel: 'SƏLAHİYYƏTİN HÜDUDLARI',
  preamble: 'Bu sertifikatla {to} adlı şəxsə bayram tədbirində ailə fotolarını çəkmək səlahiyyəti verilir. Səlahiyyət {from} tərəfindən, arxivin keyfiyyətini qorumaq məqsədilə həvalə edilmişdir.',
  powers: 'Ümumi şəkil üçün hamını bir yerə toplamaq.\nÇəkilişi ən azı üç dəfə təkrarlamaq.\nUğursuz kadrları silmək.\nFotoları 3 gün ərzində paylaşmaq.',
  penalty: 'Fotolar bir həftə ərzində paylaşılmadıqda səlahiyyət növbəti bayramda başqasına keçir.'
},
{
  id: 'leftovers-treaty', cat: 'holiday', tone: 'zarafat', layout: 'muqavile', palette: 'forest',
  title: 'Süfrə Qalığı Müqaviləsi', tag: 'Ədalətli bölgü',
  preamble: 'Bu müqavilə ilə {from} və {to} arasında bayram süfrəsindən qalan yeməklərin bölgüsü razılaşdırılır. Tərəflər qablaşdırma və daşınma məsələlərini də əvvəlcədən müəyyən edirlər.',
  powers: 'Hər tərəf öz gətirdiyi qabı geri aparır.\nDolma bərabər bölünür.\nTort qalığı uşaqlara verilir.\nSalat bölgüsü müzakirə olunmur — qalır.',
  penalty: 'Bölgü pozulduqda növbəti tədbirdə pozan tərəf iki əlavə yemək hazırlayır.'
},

/* ---------------- SƏYAHƏT / YOL ---------------- */
{
  id: 'suitcase-quota', cat: 'travel', tone: 'zarafat', layout: 'blank', palette: 'steel',
  title: 'Çamadan Çəki Kvotası', tag: 'Yığım günü',
  preamble: 'Bu sənədlə {from} tərəfindən {to} adlı şəxs üçün səyahət çamadanının çəki və həcm həddi müəyyən edilir. Kvota «bəlkə lazım olar» prinsipi ilə əlavə edilən əşyalara şamil edilmir.',
  powers: 'Çamadan çəkisi 20 kq-ı keçməmək.\nƏl yükü bir ədəd olmaq.\n«Ehtiyat üçün» ayaqqabı sayı ikidən çox olmamaq.\nSaç fenini götürməmək (oteldə var).',
  penalty: 'Hədd aşıldıqda artıq əşyalar digər tərəfin çamadanına yerləşdirilir və geri qayıdışda o daşınır.'
},
{
  id: 'navigator-authority', cat: 'travel', tone: 'zarafat', layout: 'notarial', palette: 'steel',
  title: 'Naviqasiya Səlahiyyətnaməsi', tag: 'Yol mübahisəsi',
  powersLabel: 'NAVİQATORUN SƏLAHİYYƏTLƏRİ',
  preamble: 'Bu səlahiyyətnamə ilə {from} tərəfindən {to} adlı şəxsə səyahət boyunca marşrutu müəyyən etmək və naviqasiya idarəsi səlahiyyəti verilir. Səhv dönüş halında məsuliyyət bölünmür.',
  powers: 'Marşrutu təkbaşına seçmək.\nDayanacaq yerlərini müəyyən etmək.\nXəritəni yüksək səslə oxumaq.\nSəhv dönüşdən sonra izahat verməmək.',
  penalty: 'Eyni səfərdə üç səhv dönüş baş verdikdə səlahiyyət avtomatik olaraq digər sərnişinə keçir.'
},
{
  id: 'driving-shift-contract', cat: 'travel', tone: 'zarafat', layout: 'muqavile', palette: 'ink',
  title: 'Sürücülük Növbəsi Müqaviləsi', tag: 'Uzun yol',
  preamble: 'Bu müqavilə ilə {from} və {to} arasında uzun məsafəli səfərdə sükan arxasında növbələşmə qaydası müəyyən edilir. Tərəflər yorğunluq hiss etdikdə dərhal xəbər vermək öhdəliyi götürürlər.',
  powers: 'Hər 2 saatdan bir növbə dəyişikliyi.\nSürücü musiqi seçimində üstünlüyə malikdir.\nYorğunluq halında növbə dərhal dəyişir.\nYanacaq xərci bərabər bölünür.',
  penalty: 'Növbə əsassız uzadıldıqda növbəti səfərdə ilk növbə uzadan tərəfə düşür.'
},
{
  id: 'playlist-license', cat: 'travel', tone: 'zarafat', layout: 'lisenziya', palette: 'gold',
  title: 'Yol Musiqisi Lisenziyası', tag: 'Səs hüququ',
  powersLabel: 'LİSENZİYANIN ƏHATƏ ETDİYİ JANRLAR',
  preamble: '{from} tərəfindən {to} adlı şəxsə səfər boyunca avtomobil musiqisini idarə etmək üçün lisenziya verilir. Lisenziya bütün janrları əhatə edir, lakin veto hüququ sürücüdə qalır.',
  powers: 'Mahnı siyahısını əvvəlcədən hazırlamaq.\nHər saatda bir dəfə janr dəyişmək.\nSəs səviyyəsini müəyyən etmək.\nMahnını yarımçıq kəsmək (səfərdə 3 dəfə).',
  penalty: 'Eyni mahnı üç dəfə təkrarlandıqda lisenziya bir saatlıq dayandırılır və radio yandırılır.'
},
{
  id: 'hotel-choice-arayis', cat: 'travel', tone: 'zarafat', layout: 'arayis', palette: 'forest',
  title: 'Otel Seçimi Arayışı', tag: 'Rəsmi təsdiq',
  toLabel: 'Seçimi edən tərəf', fromLabel: 'Razılıq verən tərəf',
  preamble: 'Bu arayışla təsdiq olunur ki, {to} adlı şəxsin etdiyi otel seçimi {from} tərəfindən qəbul edilmişdir. Şəkillərlə reallıq arasındakı fərqə görə məsuliyyət seçimi edən tərəfin üzərinə düşür.',
  powers: 'Oteli təkbaşına seçmək.\nRezervasiyanı öz adına etmək.\nSəhər yeməyi paketini müəyyən etmək.\nOtaq nömrəsini dəyişdirmək tələbi (bir dəfə).',
  penalty: 'Otel gözləntiyə uyğun gəlmədikdə növbəti səfərin oteli digər tərəf tərəfindən seçilir.'
},
{
  id: 'delay-decision', cat: 'travel', tone: 'zarafat', layout: 'qerar', palette: 'burgundy',
  title: 'Gecikməyə Görə Qərar', tag: 'Yola çıxma',
  preamble: 'Zarafat Məhkəməsi {from} ilə {to} arasında yola çıxma vaxtının gecikməsi ilə bağlı mübahisəyə baxaraq müəyyən etdi ki, «5 dəqiqəyə hazıram» ifadəsi ölçü vahidi kimi qəbul edilə bilməz.',
  powers: 'Yeni yola çıxma vaxtı dəqiq təyin edilir.\nGecikən tərəf yanacaq alır.\nBirinci dayanacaqda qəhvə ondan.\nKöhnə gecikmələr xatırladılmır.',
  penalty: 'Yeni vaxt da pozulduqda növbəti səfərdə maşın gecikən tərəf olmadan yola düşür.'
},
{
  id: 'best-traveler-diploma', cat: 'travel', tone: 'zarafat', layout: 'diplom', palette: 'gold',
  title: 'İlin Səyyahı Diplomu', tag: 'Fəxri ad',
  preamble: '{from} tərəfindən {to} adlı şəxsə, il ərzində heç bir uçuşu qaçırmadığına, çamadanı vaxtında yığdığına və heç bir sərhəddə problem yaşamadığına görə bu fəxri diplom təqdim olunur.',
  powers: 'Növbəti səfərdə pəncərə yerini seçmək.\nMarşrut təklifində üstünlük.\nSəyahət büdcəsini idarə etmək.\nŞəkillərin seçimini təsdiqləmək.',
  penalty: 'Bir uçuş qaçırıldıqda ad növbəti ilədək dayandırılır və pəncərə yeri növbəyə qaytarılır.'
},
{
  id: 'photo-stop-certificate', cat: 'travel', tone: 'zarafat', layout: 'sertifikat', palette: 'steel',
  title: 'Foto Dayanacağı Sertifikatı', tag: 'Yol boyu',
  powersLabel: 'DAYANACAQ ŞƏRTLƏRİ',
  preamble: 'Bu sertifikatla {to} adlı şəxsə səfər boyunca foto çəkmək üçün dayanacaq tələb etmək hüququ verilir. Hüquq {from} tərəfindən, uzun mübahisələrdən sonra rəsmiləşdirilmişdir.',
  powers: 'Səfərdə 3 dəfə dayanacaq tələb etmək.\nHər dayanacaq ən çoxu 10 dəqiqə.\nDayanacaq yerini əvvəlcədən bildirmək.\nŞəkilləri sonradan hamıya göndərmək.',
  penalty: 'Dayanacaq 20 dəqiqəni keçdikdə qalan bütün foto dayanacaqları həmin gün üçün ləğv edilir.'
},
{
  id: 'arrival-telegram', cat: 'travel', tone: 'zarafat', layout: 'teleqram', palette: 'forest',
  title: 'Çatma Bildirişi Teleqramı', tag: 'Ana üçün',
  preamble: '{from} tərəfindən {to} adlı şəxsə sağ-salamat çatma barədə təcili bildiriş göndərilir. Teleqram valideynlərin narahatlığını aradan qaldırmaq məqsədi daşıyır və gecikdirilə bilməz.',
  powers: 'Çatan kimi bildiriş göndərmək.\nOtelin adını qeyd etmək.\nBir foto əlavə etmək.\nGündə bir dəfə vəziyyət yeniləməsi.',
  penalty: 'Bildiriş 2 saat gecikdikdə valideynlər tərəfindən ardıcıl zənglər başlayır və dayanmır.'
},
{
  id: 'traveler-id', cat: 'travel', tone: 'zarafat', layout: 'vesiqe', palette: 'steel',
  title: 'Səyahət Yoldaşı Vəsiqəsi', tag: 'Şəxsiyyət sənədi',
  fromLabel: 'Vəsiqəni verən',
  preamble: 'Bu vəsiqə {to} adlı şəxsin etibarlı səyahət yoldaşı olduğunu təsdiq edir. Vəsiqə {from} tərəfindən verilmişdir və bütün marşrutlarda, hava limanlarında və qatar kupelərində etibarlıdır.',
  powers: 'Marşrut müzakirəsində səs vermək.\nÇamadanı təkbaşına yığmaq.\nSəfər büdcəsinə giriş.\nSəhər yeməyi saatını təklif etmək.',
  penalty: 'Vəsiqə itirildikdə yenisi verilir, lakin növbəti səfərdə pəncərə yeri iddiası irəli sürülmür.'
},
{
  id: 'snack-authority', cat: 'travel', tone: 'zarafat', layout: 'notarial', palette: 'burgundy',
  title: 'Yol Ərzağı Səlahiyyəti', tag: 'Bagaj hüququ',
  powersLabel: 'ƏRZAQ ÜZRƏ SƏLAHİYYƏTLƏR',
  preamble: 'Bu səlahiyyətnamə ilə {from} tərəfindən {to} adlı şəxsə yol ərzağının seçimi, qablaşdırılması və paylanması həvalə olunur. Səlahiyyət sürücünün payını əvvəlcədən ayırmaq şərti ilə verilir.',
  powers: 'Ərzaq siyahısını təkbaşına müəyyən etmək.\nPaylama vaxtını təyin etmək.\nSürücüyə birinci vermək.\nSon sendviçin taleyini həll etmək.',
  penalty: 'Ərzaq yolun yarısında bitdikdə növbəti dayanacaqda alış-veriş həmin şəxsin hesabına aparılır.'
},
{
  id: 'window-seat-treaty', cat: 'travel', tone: 'zarafat', layout: 'muqavile', palette: 'gold',
  title: 'Pəncərə Yeri Müqaviləsi', tag: 'Əbədi mübahisə',
  preamble: 'Bu müqavilə ilə {from} və {to} arasında nəqliyyat vasitəsində pəncərə yerindən istifadə növbəsi müəyyən edilir. Müqavilə təyyarə, qatar və avtobus üçün eyni dərəcədə qüvvədədir.',
  powers: 'Gediş və qayıdış yerləri dəyişdirilir.\nUzun səfərdə orta nöqtədə növbə dəyişir.\nPəncərə pərdəsi razılıqla bağlanır.\nFoto çəkmək üçün müvəqqəti yer dəyişikliyi.',
  penalty: 'Növbə pozulduqda növbəti iki səfərdə pəncərə yeri tam olaraq digər tərəfə keçir.'
},

/* ---------------- EV HEYVANLARI ---------------- */
{
  id: 'sofa-rights', cat: 'pets', tone: 'zarafat', layout: 'notarial', palette: 'gold',
  title: 'Divan Hüququ Etibarnaməsi', tag: 'Ən çox mübahisəli',
  toLabel: 'Hüquq verilən', fromLabel: 'Divanın sahibi',
  preamble: 'Bu etibarnamə ilə {from} tərəfindən {to} adlı ev heyvanına divandan istifadə hüququ rəsmi olaraq tanınır. Hüquq uzun illik faktiki istifadə əsasında sənədləşdirilmişdir və geriyə şamil olunur.',
  powers: 'Divanın sağ küncündə daimi yer.\nQonaq gələndə yerini saxlamaq.\nGün ərzində istənilən vaxt yatmaq.\nYastığı özü üçün uyğunlaşdırmaq.',
  penalty: 'Divan örtüyü zədələndikdə hüquq bir həftəlik dayandırılır və xüsusi yataq tətbiq edilir.'
},
{
  id: 'feeding-duty', cat: 'pets', tone: 'zarafat', layout: 'arayis', palette: 'forest',
  title: 'Yemləmə Növbəsi Cədvəli', tag: 'Ailə növbəsi',
  toLabel: 'Növbəni icra edən', fromLabel: 'Cədvəli təsdiq edən',
  preamble: 'Bu arayışla təsdiq olunur ki, {to} adlı şəxs ev heyvanının yemləmə növbəsini vaxtında icra etmişdir. Təsdiq {from} tərəfindən verilmiş və heyvanın razılığı ilə qüvvəyə minmişdir.',
  powers: 'Səhər 08:00 və axşam 19:00-da yemləmək.\nSu qabını gündə iki dəfə dəyişmək.\nƏlavə şirniyyat verməmək.\nNövbəni bir dəfə dəyişdirmək hüququ.',
  penalty: 'Yemləmə iki dəfə gecikdirildikdə heyvan səhər saat 06:00-da müstəqil oyanış rejiminə keçir.'
},
{
  id: 'cat-license', cat: 'pets', tone: 'zarafat', layout: 'lisenziya', palette: 'ink',
  title: 'Pişik Sərbəstlik Lisenziyası', tag: 'Ev qaydası',
  powersLabel: 'LİSENZİYANIN ƏHATƏ ETDİYİ HALLAR',
  preamble: '{from} tərəfindən {to} adlı pişiyə evin bütün otaqlarında sərbəst hərəkət etmək üçün lisenziya verilir. Lisenziya mətbəx masasının üstünü və klaviaturanı əhatə etmir, lakin bu şərt praktikada icra olunmur.',
  powers: 'Bütün otaqlara sərbəst giriş.\nİstənilən qutunun içində oturmaq.\nGecə saat 04:00-da qaçış rejimi.\nƏşyaları masadan aşağı salmaq (gündə 3 ədəd).',
  penalty: 'Bir gündə üçdən çox əşya sındırıldıqda lisenziya bir gecəlik dayandırılır və qapı bağlanır.'
},
{
  id: 'walk-contract', cat: 'pets', tone: 'zarafat', layout: 'muqavile', palette: 'forest',
  title: 'Gəzinti Müqaviləsi', tag: 'Gündəlik öhdəlik',
  preamble: 'Bu müqavilə ilə {from} və {to} arasında ev heyvanının gündəlik gəzinti qaydaları müəyyən edilir. Tərəflər hava şəraitindən asılı olmayaraq gəzintinin baş tutacağını qəbul edirlər.',
  powers: 'Gündə iki gəzinti, hər biri 30 dəqiqə.\nMarşrutu heyvan müəyyən edir.\nHər ağacın yanında dayanmaq hüququ.\nDigər itlərlə salamlaşmaq üçün əlavə vaxt.',
  penalty: 'Gəzinti buraxıldıqda evdə enerji həmin axşam mebel üzərində sərbəst şəkildə boşaldılır.'
},
{
  id: 'good-boy-diploma', cat: 'pets', tone: 'zarafat', layout: 'diplom', palette: 'gold',
  title: 'İlin Ən Yaxşı İti Diplomu', tag: 'Fəxri ad',
  preamble: '{from} tərəfindən {to} adlı ev heyvanına, il ərzində heç bir ayaqqabını yeməmək, qapı zəngində yalnız üç dəfə hürmək və qonaqları qorxutmamaq göstəricilərinə görə bu fəxri diplom təqdim olunur.',
  powers: 'Divanda əlavə bir saat yatmaq.\nHəftədə bir dəfə əlavə şirniyyat.\nGəzinti marşrutunu seçmək.\nQonaqları birinci qarşılamaq.',
  penalty: 'Bir cüt ayaqqabı zədələndikdə ad növbəti ilədək dayandırılır və diploma baxılmır.'
},
{
  id: 'bark-decree', cat: 'pets', tone: 'zarafat', layout: 'blank', palette: 'steel',
  title: 'Hürmə Rejimi Fərmanı', tag: 'Qonşu sülhü',
  preamble: 'Bu fərmanla {from} tərəfindən {to} adlı ev heyvanı üçün hürmə rejimi müəyyən edilir. Fərman qonşularla münasibətlərin qorunması məqsədi daşıyır və gecə saatlarında ciddi tətbiq olunur.',
  powers: 'Qapı zəngində ən çoxu üç dəfə hürmək.\nGecə saat 23:00-dan sonra sükut.\nPəncərədən keçən pişiklərə reaksiya — səssiz.\nPoçtalyona xüsusi münasibət saxlanılır.',
  penalty: 'Rejim gecə pozulduqda növbəti gün gəzinti müddəti 15 dəqiqə uzadılır (enerji üçün).'
},
{
  id: 'vet-visit-arayis', cat: 'pets', tone: 'zarafat', layout: 'arayis', palette: 'steel',
  title: 'Baytar Ziyarəti Arayışı', tag: 'Rəsmi təsdiq',
  toLabel: 'Müayinə olunan', fromLabel: 'Müşayiət edən',
  preamble: 'Bu arayışla təsdiq olunur ki, {to} adlı ev heyvanı {from} tərəfindən baytar müayinəsinə aparılmış və müayinə boyunca nümunəvi davranış nümayiş etdirmişdir (qapıya çatana qədər).',
  powers: 'Müayinədən sonra əlavə şirniyyat.\nEvə qayıdanda bir saat toxunulmazlıq.\nDaşıma qutusuna etiraz etmək hüququ.\nNövbəti ziyarətdən 1 gün əvvəl xəbərdar edilmək.',
  penalty: 'Ziyarət təxirə salındıqda növbəti dəfə daşıma qutusu daha erkən hazırlanır və gizlədilmir.'
},
{
  id: 'pet-court', cat: 'pets', tone: 'zarafat', layout: 'qerar', palette: 'burgundy',
  title: 'Ev Heyvanı Məhkəməsinin Qərarı', tag: 'Vazanın taleyi',
  preamble: 'Zarafat Məhkəməsi {from} ilə {to} arasında evdə baş vermiş hadisə üzrə mübahisəyə baxaraq müəyyən etdi ki, günahsızlıq prezumpsiyası ev heyvanlarına da şamil edilir və birbaşa sübut yoxdur.',
  powers: 'Cavabdeh günahsız hesab olunur.\nVaza itkisi təbii hadisə kimi qeyd edilir.\nHər iki tərəf barışıq şirniyyatı alır.\nMəsələ bir daha qaldırılmır.',
  penalty: 'Eyni hadisə təkrarlandıqda vazalar yüksək rəfə köçürülür və iş yenidən açılmır.'
},
{
  id: 'pet-id', cat: 'pets', tone: 'zarafat', layout: 'vesiqe', palette: 'gold',
  title: 'Ev Heyvanı Vəsiqəsi', tag: 'Şəxsiyyət sənədi',
  fromLabel: 'Vəsiqəni verən sahib',
  preamble: 'Bu vəsiqə {to} adlı ev heyvanının ailənin tamhüquqlu üzvü olduğunu təsdiq edir. Vəsiqə {from} tərəfindən verilmişdir və divanda, mətbəxdə və yataq otağında etibarlıdır.',
  powers: 'Ailə fotolarında iştirak etmək.\nÖz adına çəkilmiş qab istifadə etmək.\nGəzinti marşrutunda səs vermək.\nQonaqlar tərəfindən sığallanmaq.',
  penalty: 'Vəsiqə itirildikdə yenisi dərhal verilir — heyvanın heç bir öhdəliyi yaranmır.'
},
{
  id: 'treat-certificate', cat: 'pets', tone: 'zarafat', layout: 'sertifikat', palette: 'burgundy',
  title: 'Şirniyyat Verilməsi Sertifikatı', tag: 'Mükafat sistemi',
  powersLabel: 'MÜKAFATLANDIRMA ŞƏRTLƏRİ',
  preamble: 'Bu sertifikatla {from} tərəfindən {to} adlı ev heyvanına yaxşı davranışa görə əlavə şirniyyat verilməsi rəsmiləşdirilir. Sertifikat gözlərin yalvarıcı ifadəsini əsas kimi qəbul etmir.',
  powers: 'Günə 2 ədəd mükafat şirniyyatı.\nƏmri yerinə yetirdikdə əlavə 1 ədəd.\nQonaq gələndə xüsusi porsiya.\nSüfrədən yemək tələb etməmək öhdəliyi.',
  penalty: 'Süfrədən icazəsiz yemək götürüldükdə həmin günün bütün mükafatları ləğv edilir.'
},
{
  id: 'lost-toy-telegram', cat: 'pets', tone: 'zarafat', layout: 'teleqram', palette: 'ink',
  title: 'İtmiş Oyuncaq Teleqramı', tag: 'Təcili axtarış',
  preamble: '{from} tərəfindən {to} adlı şəxsə itmiş sevimli oyuncaq barədə təcili bildiriş göndərilir. Axtarış divanın altından başlanır və bütün ev üzvləri səfərbər edilir.',
  powers: 'Axtarış dərhal başlanır.\nDivan qaldırılır, xalça çevrilir.\nTapan şəxs təşəkkür alır.\nTapılmadıqda ehtiyat oyuncaq açılır.',
  penalty: 'Oyuncaq 24 saat ərzində tapılmadıqda evdə gecə yarısı müstəqil axtarış əməliyyatı başlanır.'
},
{
  id: 'bed-sharing-act', cat: 'pets', tone: 'zarafat', layout: 'notarial', palette: 'steel',
  title: 'Yataq Bölüşmə Aktı', tag: 'Gecə sərhədi',
  preamble: 'Bu aktla {from} tərəfindən {to} adlı ev heyvanına gecə saatlarında yataqdan istifadə hüququ tanınır. Aktda sərhədlər müəyyən edilsə də, səhərə qədər qorunacağına zəmanət verilmir.',
  powers: 'Yatağın ayaq tərəfində yer tutmaq.\nGecə bir dəfə yer dəyişmək.\nYorğanın altına girmək (soyuq havalarda).\nSəhər oyatma funksiyasını icra etmək.',
  penalty: 'Yastığın tam işğalı halında akt həmin gecə üçün dayandırılır və yerə xüsusi yataq salınır.'
},

/* ---------------- OYUNÇULAR / GAMER ---------------- */
{
  id: 'rank-certificate', cat: 'gaming', tone: 'zarafat', layout: 'sertifikat', palette: 'ink',
  title: 'Rank Təsdiq Sertifikatı', tag: 'Rəsmi səviyyə',
  powersLabel: 'RANKIN VERDİYİ SƏLAHİYYƏTLƏR',
  preamble: 'Bu sertifikatla {from} tərəfindən {to} adlı oyunçunun mövcud rankı rəsmi olaraq təsdiq edilir. Sertifikat rankın necə qazanıldığını araşdırmır və komanda yoldaşlarının rolunu qeyd etmir.',
  powers: 'Komanda seçimində birinci söz.\nStrategiya barədə fikir bildirmək.\nYeni oyunçulara məsləhət vermək.\nQalibiyyət ekranında birinci görünmək.',
  penalty: 'Rank iki həftə ərzində aşağı düşdükdə sertifikat avtomatik olaraq yeni səviyyəyə uyğunlaşdırılır.'
},
{
  id: 'team-contract', cat: 'gaming', tone: 'zarafat', layout: 'muqavile', palette: 'steel',
  title: 'Komanda Müqaviləsi', tag: 'Transfer sənədi',
  preamble: 'Bu müqavilə ilə {to} adlı oyunçu {from} tərəfindən idarə olunan komandaya qoşulur. Tərəflər mikrofonda sakit danışmaq və məğlubiyyətdən sonra bir-birini günahlandırmamaq öhdəliyi götürürlər.',
  powers: 'Həftədə ən azı üç oyun iştirakı.\nRolun seçimində üstünlük.\nStrategiya müzakirəsində səs vermək.\nOyun vaxtını 24 saat əvvəl bilmək.',
  penalty: 'Oyun ortasında əsassız çıxış edildikdə növbəti üç matçda rol seçimi komanda tərəfindən müəyyən edilir.'
},
{
  id: 'screen-time-decree', cat: 'gaming', tone: 'zarafat', layout: 'blank', palette: 'ink',
  title: 'Ekran Vaxtı Fərmanı', tag: 'Gecə rejimi',
  preamble: 'Bu fərmanla {from} tərəfindən {to} adlı oyunçu üçün gündəlik oyun vaxtı rəsmi olaraq müəyyən edilir. Fərman «son bir matç» ifadəsini vaxt vahidi kimi tanımır.',
  powers: 'İş günü 2 saat, həftəsonu 4 saat.\nBaşlanmış matçı sona çatdırmaq hüququ.\nHər saatdan bir 10 dəqiqə fasilə.\nTurnir günləri istisna hesab olunur.',
  penalty: 'Vaxt həddi üç gün ardıcıl aşıldıqda növbəti həftəsonu ekran vaxtı iki saata endirilir.'
},
{
  id: 'keyboard-peace', cat: 'gaming', tone: 'zarafat', layout: 'notarial', palette: 'steel',
  title: 'Klaviatura Sülh Sazişi', tag: 'Səs-küy sülhü',
  preamble: 'Bu sazişlə {from} və {to} arasında mexaniki klaviaturanın səsi ilə bağlı uzunmüddətli münaqişəyə son qoyulur. Tərəflər səs səviyyəsi və gecə istifadə saatları barədə razılığa gəlirlər.',
  powers: 'Gecə saat 23:00-dan sonra səssiz rejim.\nQulaqlıq daim taxılır.\nMikrofon susdurma düyməsi işlək saxlanılır.\nQələbə anında qışqırıq — qulaqlıqda.',
  penalty: 'Saziş üç dəfə pozulduqda gecə saatlarında klaviatura digər otağa köçürülür.'
},
{
  id: 'mvp-diploma', cat: 'gaming', tone: 'zarafat', layout: 'diplom', palette: 'gold',
  title: 'Matçın Ən Yaxşısı Diplomu', tag: 'Fəxri ad',
  preamble: '{from} tərəfindən {to} adlı oyunçuya, matç boyunca göstərdiyi oyuna, komandanı kritik anda xilas etdiyinə və heç kimi günahlandırmadığına görə bu fəxri diplom təqdim olunur.',
  powers: 'Növbəti matçda rol seçimi.\nStrategiyanı təklif etmək hüququ.\nQələbə ekranında birinci yer.\nBir dəfə «mən demişdim» demək hüququ.',
  penalty: 'Növbəti üç matçda göstərici kəskin düşdükdə ad müvəqqəti olaraq komandaya qaytarılır.'
},
{
  id: 'lag-excuse-license', cat: 'gaming', tone: 'zarafat', layout: 'lisenziya', palette: 'forest',
  title: 'Ping Bəhanəsi Lisenziyası', tag: 'Rəsmi bəhanə',
  powersLabel: 'LİSENZİYANIN ƏHATƏ ETDİYİ BƏHANƏLƏR',
  preamble: '{from} tərəfindən {to} adlı oyunçuya məğlubiyyətdən sonra internet bağlantısına istinad etmək üçün məhdud lisenziya verilir. Lisenziya real ping göstəricisi ilə əsaslandırılmalıdır.',
  powers: 'Gündə iki dəfə pinqə istinad etmək.\nEkran şəkli təqdim etmək hüququ.\n«Router yenidən başladı» arqumenti (həftədə 1).\nKompüterin köhnəliyinə istinad — ayda 1 dəfə.',
  penalty: 'Bəhanə həddi aşıldıqda növbəti həftə bütün məğlubiyyətlər izahatsız qəbul edilir.'
},
{
  id: 'rage-quit-decision', cat: 'gaming', tone: 'zarafat', layout: 'qerar', palette: 'burgundy',
  title: 'Oyunu Tərketmə üzrə Qərar', tag: 'İntizam işi',
  preamble: 'Zarafat Məhkəməsi {from} ilə {to} arasında matç ortasında oyunu tərk etmə hadisəsi üzrə işə baxaraq müəyyən etdi ki, hərəkət qəsdən deyil, emosional vəziyyət səbəbindən baş vermişdir.',
  powers: 'Cavabdeh xəbərdarlıqla buraxılır.\nNövbəti matçda komandaya qayıdır.\nÜzrxahlıq komanda çatında yazılır.\nHadisə arxivə köçürülür.',
  penalty: 'Hadisə təkrarlandıqda oyunçu iki matç ehtiyat heyətə keçirilir və rol seçimi hüququnu itirir.'
},
{
  id: 'loot-split-arayis', cat: 'gaming', tone: 'zarafat', layout: 'arayis', palette: 'gold',
  title: 'Qənimət Bölgüsü Arayışı', tag: 'Ədalətli bölgü',
  toLabel: 'Pay alan tərəf', fromLabel: 'Bölgünü aparan',
  preamble: 'Bu arayışla təsdiq olunur ki, {to} adlı oyunçuya reyddən sonra düşən qənimətdən pay ayrılmışdır. Bölgü {from} tərəfindən komandanın razılığı əsasında aparılmışdır.',
  powers: 'Payını dərhal götürmək.\nBölgüyə bir dəfə etiraz etmək.\nNadir əşya üçün püşk atmaq.\nPayını komanda yoldaşına bağışlamaq.',
  penalty: 'Bölgü qaydası pozulduqda pozan oyunçu növbəti reyddə sonuncu növbəyə keçirilir.'
},
{
  id: 'gg-telegram', cat: 'gaming', tone: 'zarafat', layout: 'teleqram', palette: 'ink',
  title: '«GG» Teleqramı', tag: 'İdman ruhu',
  preamble: '{from} tərəfindən {to} adlı oyunçuya matçın nəticəsi ilə bağlı rəsmi bildiriş göndərilir. Teleqram idman ruhunu ifadə edir və heç bir istehza məzmunu daşımır (iddia olunur).',
  powers: 'Cavab «GG» ilə verilə bilər.\nRevanş matçı təklif etmək hüququ.\nNəticə komanda çatında paylaşılır.\nStatistika ekranı əlavə olunur.',
  penalty: 'Teleqram istehza məqsədi ilə göndərildiyi aşkarlandıqda revanş matçı məcburi qaydada təşkil edilir.'
},
{
  id: 'player-id', cat: 'gaming', tone: 'zarafat', layout: 'vesiqe', palette: 'ink',
  title: 'Oyunçu Vəsiqəsi', tag: 'Şəxsiyyət sənədi',
  fromLabel: 'Vəsiqəni verən komanda',
  preamble: 'Bu vəsiqə {to} adlı şəxsin komandanın tamhüquqlu oyunçusu olduğunu təsdiq edir. Vəsiqə {from} tərəfindən verilmişdir və bütün matçlarda, turnirlərdə və komanda çatında etibarlıdır.',
  powers: 'Komanda heyətində daimi yer.\nRol seçimində səs vermək.\nTurnirlərdə iştirak etmək.\nKomanda strategiyasına təklif vermək.',
  penalty: 'Vəsiqə itirildikdə yenisi verilir, lakin bir həftə rol seçimində sonuncu növbəyə keçirilir.'
},
{
  id: 'controller-authority', cat: 'gaming', tone: 'zarafat', layout: 'sertifikat', palette: 'burgundy',
  title: 'Kontroller Səlahiyyəti', tag: 'Növbə hüququ',
  powersLabel: 'SƏLAHİYYƏTİN HÜDUDLARI',
  preamble: 'Bu sertifikatla {to} adlı şəxsə birinci kontrollerdən istifadə səlahiyyəti verilir. Səlahiyyət {from} tərəfindən, uzun növbə mübahisələrindən sonra rəsmiləşdirilmişdir.',
  powers: 'Birinci kontrolleri seçmək.\nOyunu təkbaşına seçmək (növbədə).\nCanı bitdikdə növbəni ötürmək.\nKontrolleri şarjda saxlamaq öhdəliyi.',
  penalty: 'Kontroller şarjsız qaldıqda növbəti oyunda birinci kontroller digər tərəfə keçir.'
},
{
  id: 'revenge-match-treaty', cat: 'gaming', tone: 'zarafat', layout: 'muqavile', palette: 'burgundy',
  title: 'Revanş Matçı Müqaviləsi', tag: 'İkinci şans',
  preamble: 'Bu müqavilə ilə {from} və {to} arasında revanş matçının şərtləri müəyyən edilir. Tərəflər eyni xəritədə, eyni heyətlə oynamaq və nəticəni qəti qəbul etmək öhdəliyi götürürlər.',
  powers: 'Matç 7 gün ərzində keçirilir.\nXəritə və rejim dəyişdirilmir.\nHeyət eyni saxlanılır.\nQalib nəticəni elan etmək hüququna malikdir.',
  penalty: 'Revanş 7 gün ərzində keçirilmədikdə əvvəlki nəticə yekun sayılır və bir daha müzakirə olunmur.'
},

];
