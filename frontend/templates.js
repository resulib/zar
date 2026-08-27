/* ==================================================================
   Zarafat Notariat Palatası — şablon kitabxanası
   36 şablon · 3 kateqoriya · 5 dizayn · 5 palitra
   layout:  notarial | blank | diplom | sertifikat | lisenziya
   palette: gold | steel | burgundy | forest | ink
   ================================================================== */
window.CATEGORIES = [
  { id: 'couples', name: 'Cütlüklər',           icon: '❦', blurb: 'Ev daxili diplomatiya, pult müharibələri və həftəsonu danışıqları üçün.' },
  { id: 'friends', name: 'Dostlar / Padruqalar', icon: '✦', blurb: 'Borc, gecikmə, sirr saxlama və dostluq öhdəlikləri üzrə.' },
  { id: 'work',    name: 'İş Yeri / Ofis',       icon: '⚖', blurb: 'Toplantılar, kofe maşını və «sabah göndərərəm» mədəniyyəti.' }
];

window.TEMPLATES = [

/* ==================== CÜTLÜKLƏR ==================== */
{
  id: 'weekend-pass', cat: 'couples', layout: 'notarial', palette: 'gold',
  title: 'Həftəsonu Çölə Çıxma Etibarnaməsi', tag: 'Ən çox paylaşılan',
  preamble: 'Bu etibarnamə ilə təsdiq olunur ki, {from} tərəfindən {to} adlı şəxsə həftəsonu evdən kənara çıxmaq, dostları ilə görüşmək və müəyyən edilmiş saatda geri qayıtmaq səlahiyyəti verilmişdir. Etibarnamə yalnız telefonun şarj səviyyəsi 40%-dən yuxarı olduğu müddətdə qüvvədədir.',
  powers: 'Həftədə bir dəfə, maksimum 4 saat müddətinə evdən çıxmaq.\nHər 45 dəqiqədən bir sağ-salamat olduğunu bildirən mesaj göndərmək.\nQayıdarkən əli boş qayıtmamaq — şirniyyat və ya çiçək məcburi hesab olunur.\nSəsli mesaja ən geci 3 dəqiqə ərzində cavab vermək.',
  penalty: 'Şərtlərin pozulması halında sənəd sahibi növbəti iki həftəsonu qab-qacaq yumaq öhdəliyi daşıyır və pultdan istifadə hüququndan müvəqqəti məhrum edilir.'
},
{
  id: 'always-right', cat: 'couples', layout: 'blank', palette: 'burgundy',
  title: 'Həmişə Haqlı Olma Fərmanı', tag: 'Klassik',
  preamble: '{from} bu fərmanla {to} adlı şəxsi, mübahisənin mövzusundan və nəticəsindən asılı olmayaraq, ömürlük haqlı elan edir. Qərar geriyə şamil olunur və bugünədək baş vermiş bütün mübahisələri əhatə edir. Fərman imzalandığı andan qüvvəyə minir.',
  powers: 'İstənilən mübahisədə son sözü demək hüququ.\n«Mən sənə demişdim» ifadəsini limitsiz istifadə etmək.\nXəritəyə baxmadan yol göstərmək və səhv çıxdıqda məsuliyyət daşımamaq.\nSoyuducunun qapısını açıb «yemək yoxdur» demək hüququ.',
  penalty: 'Bu fərmana etiraz edən tərəf 7 gün müddətinə serial seçimi hüququndan məhrum edilir və həmin müddətdə seçim tam olaraq digər tərəfə keçir.'
},
{
  id: 'remote-control', cat: 'couples', layout: 'sertifikat', palette: 'steel',
  title: 'Pult Üzərində Müstəsna Nəzarət Sertifikatı', tag: 'Ev müharibəsi',
  preamble: 'Bu sertifikat {to} adlı şəxsin televizor pultu üzərində müstəsna və mübahisəsiz nəzarət hüququnu təsdiq edir. Hüquq {from} tərəfindən könüllü şəkildə, heç bir təzyiq olmadan (iddia edildiyinə görə) verilmişdir.',
  powers: 'Kanalı xəbərdarlıq etmədən dəyişmək.\nSerialın növbəti seriyasını tək baxmamaq öhdəliyi ilə seçim etmək.\nReklam zamanı səsi tam söndürmək.\nPultun harada olduğunu bilməmək hüququ (ayda 2 dəfə).',
  penalty: 'Pultun 24 saatdan artıq itkin düşməsi halında nəzarət hüququ avtomatik olaraq digər tərəfə keçir və bərpa olunmur.'
},
{
  id: 'dessert-amnesty', cat: 'couples', layout: 'blank', palette: 'forest',
  title: 'Şirniyyat Oğurluğuna Görə Amnistiya Aktı', tag: 'Bayram üçün',
  toLabel: 'Amnistiya olunan', fromLabel: 'Amnistiya verən',
  preamble: 'Bu aktla {from} tərəfindən {to} adlı şəxsə, soyuducuda saxlanılan şirniyyat məhsulları ilə bağlı keçmişdə törədilmiş bütün əməllərə görə tam və qeyd-şərtsiz amnistiya elan olunur. Amnistiya paylaşılmamış son dilim də daxil olmaqla bütün epizodları əhatə edir.',
  powers: 'Gecə saat 00:00-dan sonra soyuducuya sərbəst giriş.\nSon dilimi soruşmadan götürmək (ayda 1 dəfə).\n«Mən götürməmişəm» ifadəsindən istifadə hüququ.\nBayram şirniyyatını qonaqlardan əvvəl dadmaq.',
  penalty: 'Amnistiya yalnız keçmişə şamil olunur. Yeni əməllər aşkarlandıqda sənəd sahibi növbəti şirniyyatı öz vəsaiti hesabına almaq öhdəliyi daşıyır.'
},
{
  id: 'snoring-license', cat: 'couples', layout: 'lisenziya', palette: 'ink',
  title: 'Xoruldama Lisenziyası', tag: 'Gecə növbəsi',
  powersLabel: 'LİSENZİYANIN ƏHATƏ ETDİYİ HALLAR',
  preamble: '{from} uzun illik müşahidə və nəticəsiz mübarizədən sonra {to} adlı şəxsin gecə saatlarında xoruldamaq hüququnu rəsmi olaraq tanıyır. Lisenziya bütün yataq otaqlarında və uzun avtomobil yollarında qüvvədədir.',
  powers: 'Gecə saat 23:00-dan səhər 07:00-a qədər sərbəst xoruldamaq.\nSəhər «mən xoruldamıram» demək hüququ.\nDivana sürgün edilməyə etiraz etmək.\nQulaq tıxacının qiymətini ödəməmək.',
  penalty: 'Səs həddi qonşuların şikayət etdiyi səviyyəni keçdikdə lisenziya bir gecəlik dayandırılır və sahib divana köçürülür.'
},
{
  id: 'ideal-partner', cat: 'couples', layout: 'diplom', palette: 'burgundy',
  title: 'İdeal Həyat Yoldaşı Diplomu', tag: 'İldönümü',
  preamble: 'Zarafat Notariat Palatası təsdiq edir ki, bu şəxs uzun müddət ərzində səbir, dözüm və vaxtında gətirilmiş çay sahəsində müstəsna nəticələr göstərmişdir. Diplom {from} tərəfindən təqdim olunur.',
  powers: 'Səhər qəhvəsini yataqda təqdim etmək.\nUnudulmuş tarixləri xatırlatmaq.\nMübahisədən sonra ilk addımı atmaq.\nAilə fotolarında həmişə gülümsəmək.',
  penalty: 'Diplom geri alınmır. Lakin təltif olunan şəxs il ərzində ən azı bir dəfə sürpriz təşkil etmək öhdəliyi daşıyır.'
},
{
  id: 'shopping-power', cat: 'couples', layout: 'notarial', palette: 'steel',
  title: 'Alış-veriş Səlahiyyətnaməsi', tag: 'Büdcə',
  preamble: 'Bu səlahiyyətnamə ilə {from} tərəfindən {to} adlı şəxsə ailə büdcəsi hesabına alış-veriş etmək səlahiyyəti verilir. Səlahiyyət yalnız siyahıda yazılmış məhsullara şamil olunur; siyahıdan kənar alışlar ayrıca izahat tələb edir.',
  powers: 'Siyahıdakı məhsulları müstəqil seçmək.\nEndirimli məhsulu siyahıya sonradan əlavə etmək (1 ədəd).\nÇek itdikdə məbləği yuvarlaqlaşdırmaq.\n«Lazım olacaq» arqumentindən həftədə bir dəfə istifadə etmək.',
  penalty: 'Siyahıdan kənar üç və daha çox məhsul aşkarlandıqda səlahiyyət növbəti ay üçün dayandırılır və alış-veriş birgə həyata keçirilir.'
},
{
  id: 'late-reply', cat: 'couples', layout: 'lisenziya', palette: 'steel',
  title: 'Mesaja Gec Cavab Vermə Vəsiqəsi', tag: 'Rəqəmsal sülh',
  toLabel: 'VƏSİQƏ SAHİBİ',
  preamble: 'Bu vəsiqə {to} adlı şəxsin mesajları görüb dərhal cavab verməmək hüququnu tanıyır. Vəsiqə {from} tərəfindən, «onlayn» statusunun mübahisə mövzusu olmaması şərti ilə verilmişdir.',
  powers: 'Mesajı oxuyub 30 dəqiqə ərzində cavab verməmək.\n«Telefonu görmədim» ifadəsindən istifadə etmək.\nSəsli mesajı iki dəfə sürətlə dinləmək.\nQrup çatındakı sualı görməzdən gəlmək.',
  penalty: 'Cavabsızlıq 6 saatı aşdıqda vəsiqə müvəqqəti dayandırılır və sahib növbəti görüşün yerini digər tərəfin seçməsinə razılıq verir.'
},
{
  id: 'family-visit', cat: 'couples', layout: 'blank', palette: 'ink',
  title: 'Qohum Ziyarəti Protokolu', tag: 'Diplomatiya',
  powersLabel: 'PROTOKOLUN ŞƏRTLƏRİ',
  preamble: 'Tərəflər — {from} və {to} — qohum ziyarətlərinin təşkili, müddəti və çıxış vaxtı barədə aşağıdakı şərtlərlə razılığa gəlmişlər. Protokol hər iki tərəfin ailəsinə bərabər şamil olunur.',
  powers: 'Ziyarətin müddəti 3 saatı keçmir.\nÇıxış siqnalı razılaşdırılmış jestlə verilir və mübahisə edilmir.\nSüfrədə üçüncü dəfə təklif olunan yeməkdən imtina etmək hüququ tanınır.\nYolda mövzu müzakirəsi ən azı 10 dəqiqə təxirə salınır.',
  penalty: 'Çıxış siqnalına iki dəfə əməl edilmədikdə növbəti ziyarətin marşrutunu digər tərəf müəyyən edir.'
},
{
  id: 'sock-treaty', cat: 'couples', layout: 'notarial', palette: 'forest',
  title: 'Corab Müqaviləsi', tag: 'Ev qaydası',
  preamble: 'Bu müqavilə ilə {to} adlı şəxs yerə atılmış corabların taleyi ilə bağlı öhdəlik götürür. {from} isə həmin corabları tapdıqda dərhal qeyd etməmək öhdəliyini qəbul edir. Müqavilə bütün otaqlara şamil olunur.',
  powers: 'Corabı çıxardığı yerdə maksimum 30 dəqiqə saxlamaq.\nCüt tapılmadıqda oxşar rəngdən istifadə etmək.\nQonaq gələnə qədər yığışdırmağı təxirə salmaq.\nAyda bir dəfə «bu mənim deyil» demək.',
  penalty: 'Eyni corab üç gün ardıcıl eyni yerdə qaldıqda sahibi həmin həftənin bütün paltar yumasını öz üzərinə götürür.'
},
{
  id: 'gps-authority', cat: 'couples', layout: 'sertifikat', palette: 'gold',
  title: 'Yol Göstərmə Səlahiyyəti', tag: 'Avtomobil',
  preamble: 'Bu sertifikat {to} adlı şəxsin avtomobildə naviqasiya üzrə son sözü demək səlahiyyətini təsdiq edir. Səlahiyyət {from} tərəfindən, uzun mübahisələrdən yorulduqdan sonra verilmişdir.',
  powers: 'Xəritəyə baxmadan istiqamət seçmək.\n«Bu yol qısadır» ifadəsini sübutsuz istifadə etmək.\nNavigatoru söndürmək.\nYanlış dönüşdən sonra mövzunu dəyişmək.',
  penalty: 'Gecikmə 25 dəqiqəni aşdıqda səlahiyyət həmin səfər üçün ləğv olunur və naviqasiya digər tərəfə keçir.'
},
{
  id: 'peace-treaty', cat: 'couples', layout: 'diplom', palette: 'gold',
  title: 'Barışıq Sazişi', tag: 'Sülh',
  preamble: 'Tərəflər aralarında baş vermiş mübahisəni tam və qeyd-şərtsiz bağlanmış elan edirlər. Saziş {from} tərəfindən təklif olunmuş, {to} tərəfindən qəbul edilmişdir. Keçmiş epizodlar müzakirə mövzusu ola bilməz.',
  powers: 'Mübahisə mövzusuna bir daha qayıtmamaq.\nKöhnə epizodları arqument kimi istifadə etməmək.\nBarışıq şirniyyatını birlikdə bölüşmək.\nGecə yatmazdan əvvəl mövzunu təzələməmək.',
  penalty: 'Saziş pozulduqda pozan tərəf növbəti həftəsonu proqramının tam təşkilini öz üzərinə götürür.'
},

/* ==================== DOSTLAR ==================== */
{
  id: 'friend-traitor', cat: 'friends', layout: 'sertifikat', palette: 'burgundy',
  title: 'Dost Satqını Sertifikatı', tag: 'Hit',
  powersLabel: 'TƏSDİQLƏNMİŞ HALLAR',
  preamble: '{from} tərəfindən {to} adlı şəxsə, dostluq öhdəliklərini planlı və təkrarlanan şəkildə pozduğuna görə rəsmi «Dost Satqını» statusu verilir. Status Zarafat Reyestrində əbədi saxlanılır və silinmə müraciəti qəbul edilmir.',
  powers: 'Söz verib gəlməmək — çoxsaylı təsdiqlənmiş epizod.\n«5 dəqiqəyə gəlirəm» deyib iki saat gecikmək.\nOrtaq sirri üçüncü şəxsə «təsadüfən» ötürmək.\nQrup çatında sual verib cavabları oxumadan yox olmaq.',
  penalty: 'Növbəti üç görüşün hesabını tam ödəmək. Ödəniş nağd və ya kartla mümkündür; bəhanə, hekayə və emosional çıxış qəbul edilmir.'
},
{
  id: 'debt-license', cat: 'friends', layout: 'lisenziya', palette: 'gold',
  title: 'Borc Qaytarmamaq Lisenziyası', tag: 'Təhlükəli',
  toLabel: 'LİSENZİYA SAHİBİ', fromLabel: 'BORC VERƏN',
  preamble: 'Bu lisenziya {to} adlı şəxsə {from} tərəfindən verilmiş borcu qaytarmamaq üçün rəsmi əsas yaradır. Lisenziya yalnız borcun dəqiq məbləği hər iki tərəf tərəfindən unudulduğu halda etibarlıdır.',
  powers: 'Borcun məbləğini yadda saxlamamaq.\n«Bu həftə mütləq» ifadəsini müddətsiz istifadə etmək.\nMövzu açılanda söhbəti hava haqqına yönəltmək.\nQarşı tərəfin mesajını görüb 24 saat cavab verməmək.',
  penalty: 'Borc mövzusu üçüncü şəxs tərəfindən ictimai şəkildə xatırladıldıqda lisenziya dərhal ləğv olunur və ödəmə öhdəliyi bərpa edilir.'
},
{
  id: 'secret-keeper', cat: 'friends', layout: 'blank', palette: 'steel',
  title: 'Sirr Saxlama Öhdəliyi', tag: 'Rəsmi',
  toLabel: 'Öhdəlik götürən', fromLabel: 'Sirri açıqlayan',
  preamble: 'Bu öhdəliklə {to} adlı şəxs, {from} tərəfindən ona etibar edilmiş məlumatları üçüncü şəxslərə açıqlamamağı öhdəsinə götürür. Öhdəlik səsli mesajlara, ekran şəkillərinə və «mən heç kimə demərəm» vədlərinə də şamil olunur.',
  powers: 'Sirri eşitmək və uyğun reaksiya vermək.\nMəsləhət vermək (istənilib-istənilməməsindən asılı olmayaraq).\nMövzunu bir ay sonra yenidən açmaq.\nDetalları xatırlamamaq hüququ.',
  penalty: 'Sirrin açıqlanması halında öhdəlik sahibi bir aylıq qəhvə xərclərini öz üzərinə götürür və növbəti sirrdən məhrum edilir.'
},
{
  id: 'late-pass', cat: 'friends', layout: 'lisenziya', palette: 'burgundy',
  title: 'Daimi Gecikmə Vəsiqəsi', tag: 'Sevimli',
  preamble: 'Bu vəsiqə {to} adlı şəxsin bütün görüşlərə gecikmək hüququnu rəsmi olaraq tanıyır. Vəsiqə {from} tərəfindən uzun illik müşahidə nəticəsində, mübarizənin faydasız olduğu qənaətinə gəlindikdən sonra verilmişdir.',
  powers: 'Hər görüşə 40 dəqiqəyədək gecikmək.\n«Yoldayam» yazıb hələ evdə olmaq.\nTrafik, taksi və hava şəraitinə istinad etmək.\nGecikmənin səbəbini izah etməmək.',
  penalty: 'Gecikmə 90 dəqiqəni aşdıqda vəsiqə müvəqqəti dayandırılır və sahib növbəti görüşün yerini digər tərəfin seçməsinə razılıq verir.'
},
{
  id: 'best-friend-diploma', cat: 'friends', layout: 'diplom', palette: 'gold',
  title: 'Ən Yaxşı Dost Diplomu', tag: 'Hədiyyə',
  preamble: 'Zarafat Notariat Palatası təsdiq edir ki, bu şəxs gecə saat 03:00-da zəngə cavab vermək, səbəbsiz dəstək olmaq və pis fikirdən vaxtında saxlamaq sahəsində müstəsna xidmətlər göstərmişdir. Diplom {from} tərəfindən təqdim olunur.',
  powers: 'İstənilən saatda zəngə cavab vermək.\nPis qərardan vaxtında saxlamaq.\nHekayəni ikinci dəfə də səbirlə dinləmək.\nHeç bir səbəb olmadan yanında olmaq.',
  penalty: 'Diplom geri alınmır. Sahibi yalnız ildə bir dəfə səbəbsiz zəng etmək öhdəliyi daşıyır.'
},
{
  id: 'group-chat', cat: 'friends', layout: 'blank', palette: 'ink',
  title: 'Qrup Çatında Susma Aktı', tag: 'Rəqəmsal',
  powersLabel: 'AKTIN ƏHATƏ ETDİYİ HÜQUQLAR',
  preamble: 'Bu aktla {to} adlı şəxsin qrup çatında 400 mesajı oxumadan «nə oldu?» soruşmaq hüququ rəsmiləşdirilir. Akt {from} tərəfindən, qrupun sabitliyi naminə hazırlanmışdır.',
  powers: 'Mesajları oxumadan mövzuya qoşulmaq.\nSəsli mesajlara emoji ilə cavab vermək.\nPlan müzakirəsində iştirak etmədən nəticəyə etiraz etmək.\nÇatı səssiz rejimə salıb inkar etmək.',
  penalty: 'Eyni sual üç dəfə təkrarlandıqda sənəd sahibi növbəti görüşün yerini rezerv etmək öhdəliyi daşıyır.'
},
{
  id: 'photo-rights', cat: 'friends', layout: 'sertifikat', palette: 'forest',
  title: 'Şəkil Çəkmə Öhdəliyi', tag: 'İnstaqram',
  preamble: 'Bu sertifikatla {to} adlı şəxs {from} üçün şəkil çəkərkən minimum keyfiyyət standartlarına əməl etməyi öhdəsinə götürür. Öhdəlik bütün səyahət, kafe və küçə çəkilişlərinə şamil olunur.',
  powers: 'Ən azı 15 kadr çəkmək.\nÜfüqi xətti düz saxlamaq.\n«Elə belə yaxşıdır» deməmək.\nÇəkilişi ilk kadrdan sonra dayandırmamaq.',
  penalty: 'Standartlara əməl edilmədikdə növbəti çəkiliş növbəsi ötürülür və öhdəlik sahibi kofe hesabını ödəyir.'
},
{
  id: 'taxi-split', cat: 'friends', layout: 'blank', palette: 'forest',
  title: 'Taksi Pulu Bölüşdürmə Protokolu', tag: 'Hesablaşma',
  preamble: 'Tərəflər — {from} və {to} — birgə səfərlərdə taksi xərclərinin bölüşdürülməsi barədə razılığa gəlmişlər. Protokol həm gediş, həm də qayıdış marşrutlarına şamil olunur.',
  powers: 'Xərc məsafəyə görə bölünür, əhval-ruhiyyəyə görə yox.\n«Sonra verərəm» ifadəsi 48 saat qüvvədədir.\nTaksini çağıran şəxs marşrutu seçir.\nGecikən tərəf gözləmə haqqını öz üzərinə götürür.',
  penalty: '48 saatlıq müddət pozulduqda borclu tərəf növbəti səfərin tam məbləğini ödəyir.'
},
{
  id: 'plan-canceller', cat: 'friends', layout: 'lisenziya', palette: 'ink',
  title: 'Plan Ləğvetmə Lisenziyası', tag: 'Universal',
  toLabel: 'LİSENZİYA SAHİBİ',
  preamble: 'Bu lisenziya {to} adlı şəxsə razılaşdırılmış planları son anda ləğv etmək hüququ verir. Lisenziya {from} tərəfindən, artıq gözlənilən davranışın rəsmiləşdirilməsi məqsədilə təqdim olunmuşdur.',
  powers: 'Görüşdən 30 dəqiqə əvvəl ləğv etmək.\nSəbəb kimi «yorğunam» yazmaq.\nEyni planı üç dəfə təxirə salmaq.\nLəğv etdikdən sonra onlayn görünmək.',
  penalty: 'Ardıcıl üçüncü ləğvdən sonra lisenziya dayandırılır və sahib növbəti görüşü təşkil etmək öhdəliyi daşıyır.'
},
{
  id: 'wedding-table', cat: 'friends', layout: 'notarial', palette: 'burgundy',
  title: 'Toy Masası Səlahiyyətnaməsi', tag: 'Mövsümi',
  preamble: 'Bu səlahiyyətnamə ilə {from} tərəfindən {to} adlı şəxsə toy məclisində masa idarəçiliyi səlahiyyəti verilir. Səlahiyyət yalnız həmin məclis müddətində qüvvədədir və başqa şəxsə ötürülə bilməz.',
  powers: 'Masada oturma sırasını müəyyən etmək.\nRəqsə ilk çıxmaq növbəsini təyin etmək.\nOrkestrə sifariş vermək (gecədə 2 mahnı).\nQonaqlara «bir dəqiqə» deyib yoxa çıxmaq.',
  penalty: 'Səlahiyyət sui-istifadə edildikdə növbəti məclisdə sahib ən uzaq masaya təyin olunur.'
},
{
  id: 'dietary-oath', cat: 'friends', layout: 'notarial', palette: 'forest',
  title: 'Birlikdə Pəhriz Andı', tag: 'Yanvar',
  toLabel: 'And içən', fromLabel: 'Şahid',
  preamble: '{to} adlı şəxs {from} qarşısında pəhriz rejiminə əməl edəcəyinə and içir. And bazar ertəsi qüvvəyə minir və növbəti bazar ertəsinə qədər davam edir.',
  powers: 'Həftədə bir dəfə istisna gün elan etmək.\nBaşqasının boşqabından dadmaq (say hesab edilmir).\nÇəkini yalnız səhər ölçmək.\nPəhrizin başlanğıc tarixini yeniləmək.',
  penalty: 'And pozulduqda pozan tərəf növbəti həftə birgə idmanın bütün təşkilini öz üzərinə götürür.'
},
{
  id: 'gossip-license', cat: 'friends', layout: 'lisenziya', palette: 'forest',
  title: 'Söhbət Aparma Lisenziyası', tag: 'Padruqa',
  powersLabel: 'İCAZƏ VERİLƏN MÖVZULAR',
  preamble: 'Bu lisenziya {to} adlı şəxsə {from} ilə saatlarla davam edən telefon söhbətləri aparmaq hüququ verir. Lisenziya gecə saatlarında da qüvvədədir və batareya bitənə qədər etibarlıdır.',
  powers: 'Bir mövzudan digərinə xəbərdarlıq etmədən keçmək.\n«Sonuncu bir şey» ifadəsini üç dəfə istifadə etmək.\nSöhbəti 40 dəqiqə uzatmaq.\nHekayəni əvvəldən təkrar danışmaq.',
  penalty: 'Söhbətin mövzusu üçüncü şəxsə çatdıqda lisenziya dayandırılır və bərpası üçün ortaq razılıq tələb olunur.'
},

/* ==================== İŞ YERİ ==================== */
{
  id: 'salary-diploma', cat: 'work', layout: 'diplom', palette: 'steel',
  title: 'Heç Nə Etmədən Maaş Almaq Diplomu', tag: 'Ofis klassikası',
  preamble: 'Zarafat Notariat Palatası təsdiq edir ki, bu şəxs iş saatları ərzində minimum fəaliyyət göstərməklə maksimum nəticə təəssüratı yaratmaq sahəsində yüksək ixtisas nümayiş etdirmişdir. Diplom {from} tərəfindən təqdim olunur.',
  powers: 'Klaviaturaya səslə toxunaraq məşğul təəssüratı yaratmaq.\nEkranda daim açıq cədvəl saxlamaq.\nToplantıda «razıyam, davam edək» demək.\nHəftəlik hesabatı bir cümlə ilə yazmaq.',
  penalty: 'Fəaliyyətin real yoxlanışı zamanı uyğunsuzluq aşkar edilərsə, diplom sahibi növbəti komanda toplantısının protokolunu yazmaq öhdəliyi daşıyır.'
},
{
  id: 'meeting-silence', cat: 'work', layout: 'sertifikat', palette: 'ink',
  title: 'Toplantıda Susma Ustalığı Sertifikatı', tag: 'Uzaqdan iş',
  preamble: 'Bu sertifikat {to} adlı şəxsin bir saatlıq toplantı ərzində heç bir söz deməyərək eyni zamanda tam iştirak təəssüratı yaratmaq bacarığını təsdiq edir. Qiymətləndirmə {from} tərəfindən aparılmışdır.',
  powers: 'Kameranı bağlı saxlamaq və «şəbəkə problemi» yazmaq.\nMüvafiq anlarda başını tərpətmək.\nÇatda «+1» yazaraq mövqe bildirmək.\nToplantının sonunda «hər şey aydındır» demək.',
  penalty: 'Sertifikat sahibi toplantıda təsadüfən danışdığı halda həmin mövzunun məsul şəxsi təyin edilir və geri qaytarılma mümkün deyil.'
},
{
  id: 'coffee-authority', cat: 'work', layout: 'notarial', palette: 'gold',
  title: 'Kofe Maşını Üzərində Nəzarət Səlahiyyəti', tag: 'Strateji',
  preamble: 'Bu sənədlə {from} tərəfindən {to} adlı şəxsə ofis kofe maşını üzərində tam və mübahisəsiz nəzarət səlahiyyəti verilir. Səlahiyyət kollektivin sabitliyi naminə təqdim olunmuşdur.',
  powers: 'Kofe növünü təkbaşına müəyyən etmək.\nMaşını təmizləmək növbəsini digərlərinə həvalə etmək.\nSüd ehtiyatına nəzarət etmək.\nSəhər saat 10:00-a qədər növbədə birinci olmaq.',
  penalty: 'Kofe ehtiyatının nəzarətsizlik ucbatından bitməsi halında səlahiyyət dərhal ləğv olunur və növbəti ay üçün ehtiyat sahibin hesabına alınır.'
},
{
  id: 'tomorrow-promise', cat: 'work', layout: 'blank', palette: 'burgundy',
  title: '«Sabah Göndərərəm» Müddətsiz Vədnaməsi', tag: 'Universal',
  toLabel: 'Vəd verən', fromLabel: 'Vədi gözləyən',
  preamble: 'Bu vədnamə ilə {to} adlı şəxs {from} qarşısında müəyyən edilmiş işi «sabah» göndərməyi öhdəsinə götürür. Tərəflər «sabah» anlayışının konkret tarixə bağlı olmadığını qəbul edirlər.',
  powers: '«Sabah göndərərəm» ifadəsini limitsiz istifadə etmək.\nSon tarixi könüllü olaraq yeniləmək.\nFaylı 95% hazır elan etmək.\nCavabsız mesajları oxunmuş saymamaq.',
  penalty: 'Vədnamənin icrası ardıcıl beş dəfə təxirə salındıqda sənəd sahibi işi həmin gün, iş saatından sonra tamamlamaq öhdəliyi daşıyır.'
},
{
  id: 'deadline-extension', cat: 'work', layout: 'blank', palette: 'steel',
  title: 'Son Tarix Uzatma Etibarnaməsi', tag: 'Layihə',
  preamble: 'Bu etibarnamə ilə {from} tərəfindən {to} adlı şəxsə layihənin son tarixini bir dəfə, tərəflərin razılığı olmadan uzatmaq səlahiyyəti verilir. Etibarnamə yalnız bir layihəyə şamil olunur.',
  powers: 'Son tarixi 5 iş günü uzatmaq.\nSəbəb kimi «əlaqəli komandadan cavab gözləyirik» yazmaq.\nStatusu «davam edir» saxlamaq.\nHesabatda faiz göstəricisini yuvarlaqlaşdırmaq.',
  penalty: 'İkinci uzatma tələbi qəbul edilmir; bu halda sənəd sahibi gündəlik status yeniləməsi göndərmək öhdəliyi daşıyır.'
},
{
  id: 'camera-off', cat: 'work', layout: 'lisenziya', palette: 'steel',
  title: 'Kameranı Açmama Lisenziyası', tag: 'Uzaqdan iş',
  toLabel: 'LİSENZİYA SAHİBİ',
  preamble: 'Bu lisenziya {to} adlı şəxsə onlayn toplantılarda kameranı açmamaq hüququ verir. Lisenziya {from} tərəfindən verilmiş və bütün platformalara şamil olunur.',
  powers: 'Kameranı bütün toplantı boyu bağlı saxlamaq.\nProfil şəklini kamera görüntüsü kimi təqdim etmək.\n«Kamera işləmir» ifadəsini müddətsiz istifadə etmək.\nEkran paylaşımına keçərək mövzunu dəyişmək.',
  penalty: 'Lisenziya rüblük ümumi toplantıya şamil olunmur; həmin toplantıda kamera açılmalıdır.'
},
{
  id: 'cc-authority', cat: 'work', layout: 'notarial', palette: 'ink',
  title: '«Cc-də Saxlayıram» Səlahiyyətnaməsi', tag: 'E-poçt',
  preamble: 'Bu səlahiyyətnamə ilə {to} adlı şəxsə istənilən yazışmada üçüncü şəxsləri məlumat üçün kopyaya salmaq səlahiyyəti verilir. Səlahiyyət {from} tərəfindən, məsuliyyətin bölüşdürülməsi məqsədilə təqdim olunmuşdur.',
  powers: 'İstənilən şəxsi kopyaya salmaq.\n«Məlumat üçün» ifadəsi ilə məsuliyyəti paylaşmaq.\nCavabı «hamıya cavabla» göndərmək.\nMövzu sətrini üç dəfə dəyişmək.',
  penalty: 'Kopyaya salınmış şəxslərin sayı on beşi keçdikdə səlahiyyət dayandırılır və yazışma birbaşa ünvana yönləndirilir.'
},
{
  id: 'lunch-king', cat: 'work', layout: 'lisenziya', palette: 'burgundy',
  title: 'Nahar Fasiləsi Uzatma Vəsiqəsi', tag: 'Gündəlik',
  preamble: 'Bu vəsiqə {to} adlı şəxsə nahar fasiləsini rəsmi müddətdən artıq davam etdirmək hüququ verir. Vəsiqə {from} tərəfindən, məhsuldarlığın nahardan sonra artdığı müşahidəsinə əsasən verilmişdir.',
  powers: 'Fasiləni 20 dəqiqə uzatmaq.\nQayıdışda qəhvə növbəsində dayanmaq.\n«Yoldayam» yazıb hələ kafedə olmaq.\nSonrakı 15 dəqiqəni «yenidən fokuslanma» adlandırmaq.',
  penalty: 'Fasilə iki saatı aşdıqda vəsiqə həmin həftə üçün dayandırılır və sahib komanda üçün qəhvə gətirir.'
},
{
  id: 'printer-master', cat: 'work', layout: 'sertifikat', palette: 'steel',
  title: 'Printer Ustası Sertifikatı', tag: 'Texniki',
  preamble: 'Bu sertifikat {to} adlı şəxsin ofis printerini kağız sıxışdığı hallarda bərpa etmək sahəsindəki müstəsna bacarığını təsdiq edir. Qiymətləndirmə {from} tərəfindən aparılmışdır.',
  powers: 'Printeri qapağını açıb-bağlamaqla bərpa etmək.\nKartricin bitdiyini gözlə müəyyən etmək.\nNövbəni idarə etmək.\n«Yenidən göndər» məsləhətini rəsmi həll kimi təqdim etmək.',
  penalty: 'Bərpa cəhdi iki dəfə uğursuz olduqda sertifikat sahibi texniki dəstəyə müraciət formasını doldurmaq öhdəliyi daşıyır.'
},
{
  id: 'employee-year', cat: 'work', layout: 'diplom', palette: 'forest',
  title: 'İlin İşçisi Diplomu', tag: 'Təltif',
  preamble: 'Zarafat Notariat Palatası təsdiq edir ki, bu şəxs heç bir səsvermə keçirilmədən, tamamilə öz təşəbbüsü ilə «İlin İşçisi» adına layiq görülmüşdür. Diplom {from} tərəfindən təqdim olunur.',
  powers: 'Adı iş yerində nümayiş etdirmək.\nToplantılarda titula istinad etmək.\nSəsvermə nəticələrini açıqlamamaq.\nNövbəti il üçün adı avtomatik uzatmaq.',
  penalty: 'Diplom geri alınmır. Sahibi yalnız komandaya bir dəfə şirniyyat gətirmək öhdəliyi daşıyır.'
},
{
  id: 'excuse-registry', cat: 'work', layout: 'blank', palette: 'ink',
  title: 'Bəhanə Bankı Qeydiyyat Aktı', tag: 'Arxiv',
  powersLabel: 'QEYDƏ ALINMIŞ BƏHANƏLƏR',
  preamble: 'Bu aktla {to} adlı şəxsin istifadə etdiyi bəhanələr rəsmi qeydiyyata alınır. Qeydiyyat {from} tərəfindən aparılmış və təkrar istifadənin qarşısını almaq məqsədi daşıyır.',
  powers: 'İnternet kəsildi — 12 dəfə istifadə edilib.\nFayl göndərildi, çatmayıb — 9 dəfə.\nTəqvimə düşməyib — 7 dəfə.\nEyni anda iki toplantı var idi — 5 dəfə.',
  penalty: 'Eyni bəhanə üçüncü dəfə istifadə edildikdə akta yeni bəhanə əlavə edilməsi tələb olunur; təkrarlar qəbul edilmir.'
},
{
  id: 'ac-authority', cat: 'work', layout: 'sertifikat', palette: 'burgundy',
  title: 'Kondisioner Üzərində Nəzarət Fərmanı', tag: 'Yay',
  preamble: 'Bu fərmanla {to} adlı şəxsə ofis kondisionerinin temperaturu üzərində tam nəzarət səlahiyyəti verilir. Fərman {from} tərəfindən, uzunmüddətli temperatur müharibəsinə son qoymaq məqsədilə imzalanmışdır.',
  powers: 'Temperaturu təkbaşına müəyyən etmək.\nPultu görünməyən yerdə saxlamaq.\n«Elə belə normaldır» qərarını qəbul etmək.\nŞikayətləri növbəti günə təxirə salmaq.',
  penalty: 'Ofisdə eyni gündə üç və daha çox şikayət qeydə alındıqda fərman dayandırılır və temperatur ümumi səsvermə ilə müəyyən edilir.'
}

];
