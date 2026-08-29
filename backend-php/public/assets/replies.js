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
  title: 'Gecikmə Bəhanəsinin Rədd Edilməsi Qərarı', tag: 'Ev diplomatiyası',
  signOrg: 'Cütlüklərarası Mübahisələrin Həlli üzrə Ali Şura',
  toLabel: 'BƏHANƏNİ İRƏLİ SÜRƏN', fromLabel: 'QƏRARI QƏBUL EDƏN',
  preamble: 'Şura {to} adlı şəxsin təqdim etdiyi sənədə baxaraq müəyyən etdi ki, göstərilən səbəb heç bir sənədlə təsdiqlənmir, hadisələrin ardıcıllığı isə əvvəlki üç izahatla ziddiyyət təşkil edir. {from} tərəfindən verilmiş etiraz əsaslı hesab olunur və bəhanə rədd edilir.',
  powers: 'Təqdim edilmiş bəhanə əsassız hesab edilir və qəbul olunmur.\nEyni səbəbin təkrar irəli sürülməsinə növbəti 30 gün ərzində yol verilmir.\nGecikmə faktı qüvvədə qalır və qeydiyyata alınır.\nQərar imzalandığı andan qüvvəyə minir və şikayət mərhələsindən keçmir.',
  penalty: 'Qərara əməl edilmədikdə növbəti həftəsonunun proqramını qarşı tərəf müəyyən edir və seçim mübahisə mövzusuna çevrilmir.'
},
{
  id: 'r-redd-friends', cat: 'c-redd', tone: 'zarafat', layout: 'qerar', palette: 'burgundy',
  replyKind: 'redd', replyCats: ['friends'], regPrefix: 'RDD',
  title: 'Borc Bəhanəsinin Rədd Edilməsi Haqqında Qərar', tag: 'Dost borcu',
  signOrg: 'Dostlararası Mübahisələrin Həlli üzrə Ali Məclis',
  toLabel: 'BORCLU TƏRƏF', fromLabel: 'TƏLƏB EDƏN TƏRƏF',
  preamble: 'Məclis {from} tərəfindən verilmiş müraciəti araşdıraraq müəyyən etdi ki, {to} adlı şəxsin təqdim etdiyi «maaş gecikdi» əsaslandırması altıncı dəfə eyni redaksiyada təkrarlanır. Sənədin mətni dəyişməmiş, yalnız tarixi yenilənmişdir. Bəhanə rədd edilir.',
  powers: 'Təqdim edilmiş əsaslandırma inandırıcı hesab edilmir.\nBorcun məbləği və verilmə tarixi olduğu kimi qüvvədə qalır.\nYeni möhlət verilmir; əvvəlki möhlətlərin sayı sənədə əlavə olunur.\n«Sabah göndərəcəm» ifadəsi bundan sonra sənəd kimi qəbul edilmir.',
  penalty: 'Ödəniş növbəti görüşədək həyata keçirilmədikdə həmin görüşün bütün xərcləri borclu tərəfin üzərinə düşür və bölünmür.'
},
{
  id: 'r-redd-work', cat: 'c-redd', tone: 'zarafat', layout: 'qerar', palette: 'burgundy',
  replyKind: 'redd', replyCats: ['work'], regPrefix: 'RDD',
  title: 'İş Bəhanəsinin Rədd Edilməsi Haqqında Qərar', tag: 'Ofis',
  signOrg: 'Ofisdaxili Münasibətlərin Tənzimlənməsi üzrə Komitə',
  toLabel: 'İZAHAT VERƏN', fromLabel: 'QƏRARI QƏBUL EDƏN',
  preamble: 'Komitə {to} adlı şəxsin «sistem işləmirdi» izahatını araşdırdı. Müəyyən edildi ki, göstərilən vaxt aralığında sistem bütün digər əməkdaşlar üçün işləmiş, mesajlaşma proqramında isə həmin şəxsin statusu aktiv olmuşdur. {from} tərəfindən qaldırılan məsələ təsdiq olunur.',
  powers: 'Təqdim edilmiş izahat qənaətbəxş hesab edilmir.\nTapşırığın son müddəti uzadılmır və dəyişmir.\n«Sabah göndərərəm» ifadəsi hesabat sənədi kimi qəbul edilmir.\nQərar həmin gün saat 18:00-dan qüvvəyə minir.',
  penalty: 'Tapşırıq növbəti iş gününə qədər təhvil verilmədikdə həmin həftənin kofe növbəsi tam olaraq izahat verən tərəfin öhdəsinə keçir.'
},
{
  id: 'r-redd-family', cat: 'c-redd', tone: 'zarafat', layout: 'qerar', palette: 'burgundy',
  replyKind: 'redd', replyCats: ['family'], regPrefix: 'RDD',
  title: 'Ev Bəhanəsinin Rədd Edilməsi Haqqında Qərar', tag: 'Ailə şurası',
  signOrg: 'Evdaxili Münasibətlərin Tənzimlənməsi üzrə Ali Şura',
  toLabel: 'BƏHANƏ GƏTİRƏN', fromLabel: 'QƏRARI VERƏN',
  preamble: 'Ali Şura {to} adlı şəxsin «dərsim var idi» əsaslandırmasını araşdırdı və müəyyən etdi ki, həmin saatlarda otaqdan oyun səsləri gəlmiş, dərs dəftəri isə açılmamış qalmışdır. {from} tərəfindən irəli sürülən tələb əsaslı hesab olunur, bəhanə rədd edilir.',
  powers: 'Təqdim edilmiş bəhanə əsassız hesab edilir.\nEv işlərinin növbəsi dəyişmir və olduğu kimi icra olunur.\nEkran vaxtı bu həftə üçün uzadılmır.\nQərar elan olunduğu andan qüvvəyə minir.',
  penalty: 'Qərara əməl edilmədikdə həftəsonu ekran vaxtı iki saat azaldılır və azaldılmış müddət növbəti həftəyə keçirilmir.'
},
{
  id: 'r-redd-relatives', cat: 'c-redd', tone: 'zarafat', layout: 'qerar', palette: 'burgundy',
  replyKind: 'redd', replyCats: ['relatives'], regPrefix: 'RDD',
  title: 'Ziyarət Bəhanəsinin Rədd Edilməsi Qərarı', tag: 'Qohum protokolu',
  signOrg: 'Qohumluq Münasibətləri üzrə Ali Nəzarət Şurası',
  toLabel: 'ÜZRXAHLIQ EDƏN', fromLabel: 'ETİRAZ EDƏN TƏRƏF',
  preamble: 'Şura {to} adlı şəxsin bayram ziyarətindən yayınmaq üçün göstərdiyi səbəbi araşdırdı. Müəyyən edildi ki, həmin gün sosial şəbəkədə paylaşılmış şəkil ziyarətin mümkün olduğunu təsdiq edir. {from} tərəfindən bildirilən narazılıq əsaslı sayılır.',
  powers: 'Göstərilən səbəb üzrlü hesab edilmir.\nZiyarətin tarixi dəyişdirilmir və təxirə salınmır.\nÇıxış siqnalı bu dəfə üç saatdan tez verilə bilməz.\nSüfrədə ikinci dəfə təklif olunan yeməkdən imtina hüququ dayandırılır.',
  penalty: 'Ziyarətə gəlinmədikdə növbəti bayram süfrəsinin bütün hazırlığı və qonaq siyahısı qarşı tərəf tərəfindən müəyyən edilir.'
},
{
  id: 'r-redd-student', cat: 'c-redd', tone: 'zarafat', layout: 'qerar', palette: 'burgundy',
  replyKind: 'redd', replyCats: ['student'], regPrefix: 'RDD',
  title: 'Tələbə Bəhanəsinin Rədd Edilməsi Qərarı', tag: 'İmtahan sessiyası',
  signOrg: 'Tələbə Bəhanələrinin Araşdırılması üzrə Komissiya',
  toLabel: 'BƏHANƏ TƏQDİM EDƏN', fromLabel: 'QƏRARI VERƏN',
  preamble: 'Komissiya {to} adlı şəxsin «avtobus gecikdi» əsaslandırmasına baxdı. Müəyyən edildi ki, həmin marşrut həmin səhər cədvəl üzrə işləmiş, tələbənin telefonundakı zəngli saat isə heç vaxt qurulmamışdır. {from} tərəfindən qaldırılan məsələ təsdiq edilir.',
  powers: 'Gecikmənin səbəbi üzrlü hesab edilmir.\nDərsə buraxılış qeydi dəyişdirilmir.\nKonspekt borcu qüvvədə qalır və növbəti həftəyə keçirilmir.\n«Növbəti dəfə mütləq» ifadəsi öhdəlik sənədi kimi qəbul edilmir.',
  penalty: 'Konspekt borcu bu həftə bağlanmadıqda növbəti dərsin bütün qeydlərini borclu tərəf aparır və qrupla paylaşır.'
},
{
  id: 'r-redd-neighbors', cat: 'c-redd', tone: 'zarafat', layout: 'qerar', palette: 'burgundy',
  replyKind: 'redd', replyCats: ['neighbors'], regPrefix: 'RDD',
  title: 'Səs-küy Bəhanəsinin Rədd Edilməsi Qərarı', tag: 'Həyət nizamı',
  signOrg: 'Həyətdaxili Nizamın Qorunması üzrə Baş İdarə',
  toLabel: 'İZAHAT VERƏN QONŞU', fromLabel: 'MÜRACİƏT EDƏN QONŞU',
  preamble: 'Baş İdarə {to} adlı şəxsin «təmir işi gedirdi» izahatını araşdırdı və müəyyən etdi ki, gecə saat 23:40-da eşidilən səs təmir alətinə deyil, musiqi avadanlığına aiddir. {from} tərəfindən verilmiş müraciət əsaslı hesab olunur və izahat rədd edilir.',
  powers: 'Təqdim edilmiş izahat qəbul edilmir.\nSakitlik rejimi saat 23:00-dan səhər 08:00-a qədər bərpa olunur.\nPark yerinin növbəsi dəyişdirilmir.\nQərarın surəti pilləkən elan lövhəsinə vurulur.',
  penalty: 'Rejim təkrar pozulduqda növbəti ay ərzində pilləkən təmizliyi növbəsi izahat verən tərəfin üzərində qalır.'
},
{
  id: 'r-redd-holiday', cat: 'c-redd', tone: 'zarafat', layout: 'qerar', palette: 'burgundy',
  replyKind: 'redd', replyCats: ['holiday'], regPrefix: 'RDD',
  title: 'Toy Bəhanəsinin Rədd Edilməsi Haqqında Qərar', tag: 'Toy protokolu',
  signOrg: 'Toy Davranışlarına Nəzarət üzrə Baş İdarə',
  toLabel: 'İMTİNA EDƏN ŞƏXS', fromLabel: 'TƏLƏB EDƏN TƏRƏF',
  preamble: 'Baş İdarə {to} adlı şəxsin toyda oynamaqdan imtina üçün göstərdiyi «ayaqqabım dardır» səbəbini araşdırdı. Müəyyən edildi ki, həmin şəxs eyni ayaqqabı ilə gecə boyu masadan masaya sərbəst hərəkət etmişdir. {from} tərəfindən bildirilən tələb təsdiqlənir.',
  powers: 'Göstərilən səbəb üzrlü hesab edilmir.\nOynama öhdəliyi qüvvədə qalır və ən azı iki mahnını əhatə edir.\nMasadan qalxmamaq hüququ dayandırılır.\nQohumların dəvəti rədd edilə bilməz.',
  penalty: 'Öhdəlik yerinə yetirilmədikdə növbəti toyda yallı sırasının başında durmaq öhdəliyi həmin şəxsin üzərinə düşür.'
},
{
  id: 'r-redd-travel', cat: 'c-redd', tone: 'zarafat', layout: 'qerar', palette: 'burgundy',
  replyKind: 'redd', replyCats: ['travel'], regPrefix: 'RDD',
  title: 'Marşrut Bəhanəsinin Rədd Edilməsi Qərarı', tag: 'Yol mübahisəsi',
  signOrg: 'Səfər və Marşrut Mübahisələri üzrə Ali Komissiya',
  toLabel: 'YOL GÖSTƏRƏN', fromLabel: 'ETİRAZ EDƏN SƏRNİŞİN',
  preamble: 'Komissiya {to} adlı şəxsin «bu yol qısadır» iddiasını araşdırdı və müəyyən etdi ki, seçilmiş marşrut naviqasiya tövsiyəsindən 28 dəqiqə uzun olmuş, üstəlik iki dəfə eyni dairədən keçilmişdir. {from} tərəfindən bildirilən etiraz təsdiq edilir.',
  powers: 'İrəli sürülən əsaslandırma qəbul edilmir.\nNaviqasiya səlahiyyəti bu səfər üçün digər tərəfə keçir.\nMusiqi seçimi gecikmə müddətincə sərnişinə verilir.\nDayanacaq yerini bundan sonra sərnişin müəyyən edir.',
  penalty: 'Yol yenidən naviqasiyasız seçildikdə həmin səfərin yanacaq və qəhvə xərcləri sürücünün üzərində qalır.'
},
{
  id: 'r-redd-pets', cat: 'c-redd', tone: 'zarafat', layout: 'qerar', palette: 'burgundy',
  replyKind: 'redd', replyCats: ['pets'], regPrefix: 'RDD',
  title: 'Heyvan Bəhanəsinin Rədd Edilməsi Qərarı', tag: 'Divan hüququ',
  signOrg: 'Ev Heyvanları Hüquqları üzrə Xüsusi Şura',
  toLabel: 'BƏHANƏ GƏTİRƏN SAHİB', fromLabel: 'MÜRACİƏT EDƏN TƏRƏF',
  preamble: 'Şura {to} adlı şəxsin «pişik özü tullandı» izahatını araşdırdı. Müəyyən edildi ki, divandakı yer əvvəlcədən yorğanla hazırlanmış, qapı isə qəsdən açıq saxlanılmışdır. {from} tərəfindən verilmiş müraciət əsaslı hesab olunur və izahat rədd edilir.',
  powers: 'Təqdim edilmiş izahat qəbul edilmir.\nYemləmə növbəsi dəyişdirilmir və olduğu kimi qalır.\nDivanın yuxarı hissəsi heyvan üçün qadağan zonası kimi qalır.\nGəzinti öhdəliyi səhər saatlarına keçirilir.',
  penalty: 'Növbə təkrar pozulduqda həftəlik gəzinti və yemləmə öhdəliyinin hamısı izahat verən tərəfin üzərinə keçir.'
},
{
  id: 'r-redd-gaming', cat: 'c-redd', tone: 'zarafat', layout: 'qerar', palette: 'burgundy',
  replyKind: 'redd', replyCats: ['gaming'], regPrefix: 'RDD',
  title: 'İnternet Bəhanəsinin Rədd Edilməsi Qərarı', tag: 'Ən çox paylaşılan',
  signOrg: 'Virtual Futbol Bəhanələri üzrə Ali Komissiya',
  toLabel: 'BƏHANƏNİ İRƏLİ SÜRƏN', fromLabel: 'QALİB TƏRƏF',
  preamble: 'Komissiya {to} adlı şəxsin «internet zəif idi» əsaslandırmasını araşdırdı. Müəyyən edildi ki, oyun boyu bağlantı sabit qalmış, eyni şəbəkədən yayım fasiləsiz izlənilmiş, gecikmə isə yalnız qol buraxıldıqdan sonra qeyd olunmuşdur. {from} tərəfindən qaldırılan məsələ təsdiqlənir.',
  powers: 'Bəhanə əsassız hesab edilir və qəbul olunmur.\nOyunun nəticəsi qüvvədə qalır və hesab dəyişdirilmir.\nTəkrar oyun tələbi bu qərarla təmin edilmir.\nQol sevinci arxivdə saxlanılır və istifadəsinə icazə verilir.',
  penalty: 'Nəticə mübahisə edilməyə davam edildikdə növbəti oyunda komanda seçimi tam olaraq qalib tərəfin ixtiyarına keçir.'
},
{
  id: 'r-redd-viral', cat: 'c-redd', tone: 'zarafat', layout: 'qerar', palette: 'burgundy',
  replyKind: 'redd', replyCats: ['viral'], regPrefix: 'RDD',
  title: 'Ekspertiza Rəyinin Rədd Edilməsi Qərarı', tag: 'Viral cavab',
  signOrg: 'Bəhanələrin Ekspertizası üzrə Ali Komissiya',
  toLabel: 'RƏY TƏQDİM EDƏN', fromLabel: 'ETİRAZ EDƏN TƏRƏF',
  preamble: 'Komissiya {to} adlı şəxs tərəfindən təqdim edilmiş sənədə baxdı və müəyyən etdi ki, sənəddəki göstəricilər ölçmə metodikası göstərilmədən qeyd olunmuş, nəticə isə əvvəlcədən yazılmışdır. {from} tərəfindən bildirilən etiraz əsaslı sayılır və rəy rədd edilir.',
  powers: 'Təqdim edilmiş rəy etibarsız hesab edilir.\nGöstərilən bal və faizlər qüvvədən düşür.\nYeni rəy yalnız hər iki tərəfin iştirakı ilə tərtib edilə bilər.\nQərar dərc olunduğu andan qüvvəyə minir.',
  penalty: 'Eyni rəy təkrar dövriyyəyə buraxıldıqda növbəti ekspertizanın bütün şərtlərini etiraz edən tərəf müəyyən edir.'
},
{
  id: 'r-redd-umumi', cat: 'c-redd', tone: 'zarafat', layout: 'qerar', palette: 'burgundy',
  replyKind: 'redd', regPrefix: 'RDD',
  title: 'Sənədin Rədd Edilməsi Haqqında Qərar', tag: 'Universal',
  signOrg: 'Sənədlərə Etirazlar üzrə Ali Apellyasiya Şurası',
  toLabel: 'SƏNƏDİ TƏQDİM EDƏN', fromLabel: 'QƏRARI QƏBUL EDƏN',
  preamble: 'Şura {to} adlı şəxs tərəfindən dövriyyəyə buraxılmış sənədə baxdı və müəyyən etdi ki, sənəd qarşı tərəfin razılığı olmadan tərtib edilmiş, əsaslandırma hissəsi isə tamamilə birtərəflidir. {from} tərəfindən bildirilən etiraz qəbul edilir və sənəd rədd olunur.',
  powers: 'Sənəddə göstərilən öhdəliklər qəbul edilmir.\nSənədin bəndləri qarşı tərəf üçün heç bir nəticə doğurmur.\nEyni məzmunda yeni sənəd 30 gün ərzində tərtib edilə bilməz.\nQərar dərc olunduğu andan qüvvəyə minir.',
  penalty: 'Rədd edilmiş sənəd yenidən paylaşıldıqda mövzunun növbəti müzakirəsinin yeri və vaxtı etiraz edən tərəf tərəfindən müəyyən edilir.'
},

/* ==================== ⚖️ ETİRAZ ====================
   layout: blank · palette: ink · prefiks: ETZ */
{
  id: 'r-etiraz-couples', cat: 'c-etiraz', tone: 'zarafat', layout: 'blank', palette: 'ink',
  replyKind: 'etiraz', replyCats: ['couples'], regPrefix: 'ETZ',
  title: 'Verilmiş İcazəyə Etiraz Ərizəsi', tag: 'Ev diplomatiyası',
  toLabel: 'Ərizəçi', fromLabel: 'Ərizə ünvanlanır',
  powersLabel: 'Etirazın əsasları',
  signOrg: 'Cütlüklərarası Mübahisələrin Həlli üzrə Ali Şura',
  preamble: 'Mən, {to}, verilmiş icazə sənədi ilə tanış oldum və onun şərtləri ilə razılaşmadığımı bildirirəm. Sənəd {from} tərəfindən birtərəfli qaydada tərtib edilmiş, mənim mövqeyim isə heç bir bənddə əks olunmamışdır. Ərizəni baxılmaq üçün təqdim edirəm.',
  powers: 'Sənəd hazırlanarkən mənim razılığım alınmamışdır.\nŞərtlərin müddəti real vəziyyətlə uyğun gəlmir.\nSənəddə qeyd olunan saat aralığı əvvəlcədən razılaşdırılmamışdı.\nEyni məsələ üzrə əvvəllər başqa razılıq mövcud olmuşdur.',
  penalty: 'Ərizə baxılmadan qaldıqda sənədin icrası dayandırılır və mübahisə birbaşa şifahi müzakirə mərhələsinə keçir.'
},
{
  id: 'r-etiraz-friends', cat: 'c-etiraz', tone: 'zarafat', layout: 'blank', palette: 'ink',
  replyKind: 'etiraz', replyCats: ['friends'], regPrefix: 'ETZ',
  title: 'Borc Sənədinə Etiraz Ərizəsi', tag: 'Dost borcu',
  toLabel: 'Ərizəçi', fromLabel: 'Ərizə ünvanlanır',
  powersLabel: 'Etirazın əsasları',
  signOrg: 'Dostlararası Mübahisələrin Həlli üzrə Ali Məclis',
  preamble: 'Mən, {to}, {from} tərəfindən tərtib edilmiş borc sənədinə etiraz edirəm. Sənəddə göstərilən məbləğ hesablanarkən mənim ödədiyim hissə nəzərə alınmamış, ortaq xərclər isə tam olaraq bir tərəfin üzərinə yazılmışdır. Yenidən hesablama aparılmasını xahiş edirəm.',
  powers: 'Göstərilən məbləğ ortaq xərclər çıxılmadan hesablanmışdır.\nƏvvəlki iki ödəniş sənəddə qeyd olunmamışdır.\nBorcun tarixi faktiki tarixdən fərqlidir.\nMöhlət barədə şifahi razılıq sənəddə əks olunmamışdır.',
  penalty: 'Yenidən hesablama aparılmadıqda məsələ növbəti ortaq görüşdə hər iki tərəfin iştirakı ilə açıq müzakirəyə çıxarılır.'
},
{
  id: 'r-etiraz-work', cat: 'c-etiraz', tone: 'zarafat', layout: 'blank', palette: 'ink',
  replyKind: 'etiraz', replyCats: ['work'], regPrefix: 'ETZ',
  title: 'Tapşırıq Qərarına Etiraz Ərizəsi', tag: 'Ofis',
  toLabel: 'Ərizəçi', fromLabel: 'Ərizə ünvanlanır',
  powersLabel: 'Etirazın əsasları',
  signOrg: 'Ofisdaxili Münasibətlərin Tənzimlənməsi üzrə Komitə',
  preamble: 'Mən, {to}, {from} tərəfindən verilmiş tapşırıq sənədi ilə bağlı etirazımı bildirirəm. Tapşırıq iş gününün son on beş dəqiqəsində, əvvəlcədən heç bir xəbərdarlıq olmadan təqdim edilmiş, son müddət isə növbəti səhərə təyin olunmuşdur. Müddətin yenidən müəyyən edilməsini xahiş edirəm.',
  powers: 'Tapşırıq iş gününün sonunda, xəbərdarlıqsız verilmişdir.\nSon müddət işin real həcmi ilə uyğun gəlmir.\nEyni dövrdə üç ayrı tapşırıq eyni müddətə təyin olunmuşdur.\nTələb olunan məlumatın bir hissəsi hələ təqdim edilməmişdir.',
  penalty: 'Müddət yenidən müəyyən edilmədikdə tapşırığın təhvil forması və həcmi ərizəçi tərəfindən müstəqil seçilir.'
},
{
  id: 'r-etiraz-family', cat: 'c-etiraz', tone: 'zarafat', layout: 'blank', palette: 'ink',
  replyKind: 'etiraz', replyCats: ['family'], regPrefix: 'ETZ',
  title: 'Ev Fərmanına Etiraz Ərizəsi', tag: 'Ailə şurası',
  toLabel: 'Ərizəçi', fromLabel: 'Ərizə ünvanlanır',
  powersLabel: 'Etirazın əsasları',
  signOrg: 'Evdaxili Münasibətlərin Tənzimlənməsi üzrə Ali Şura',
  preamble: 'Mən, {to}, {from} tərəfindən elan edilmiş ev fərmanına etiraz edirəm. Fərman ailə şurasının iclası çağırılmadan, yalnız bir tərəfin qərarı ilə qüvvəyə minmiş və mənim səsim heç bir bənddə nəzərə alınmamışdır. Fərmana yenidən baxılmasını tələb edirəm.',
  powers: 'Fərman ailə şurası çağırılmadan qəbul edilmişdir.\nEkran vaxtı ilə bağlı bənd əvvəlki razılığa ziddir.\nEv işlərinin bölgüsü bərabər aparılmamışdır.\nFərmanın müddəti sənəddə ümumiyyətlə göstərilməmişdir.',
  penalty: 'Şura çağırılmadıqda fərmanın icrası dayandırılır və mövcud qaydalar əvvəlki həftədəki formada qüvvədə qalır.'
},
{
  id: 'r-etiraz-relatives', cat: 'c-etiraz', tone: 'zarafat', layout: 'blank', palette: 'ink',
  replyKind: 'etiraz', replyCats: ['relatives'], regPrefix: 'ETZ',
  title: 'Ziyarət Protokoluna Etiraz Ərizəsi', tag: 'Qohum protokolu',
  toLabel: 'Ərizəçi', fromLabel: 'Ərizə ünvanlanır',
  powersLabel: 'Etirazın əsasları',
  signOrg: 'Qohumluq Münasibətləri üzrə Ali Nəzarət Şurası',
  preamble: 'Mən, {to}, {from} tərəfindən tərtib edilmiş ziyarət protokoluna etirazımı bildirirəm. Protokolda ziyarətlərin sayı bir tərəf üçün ikiqat müəyyən edilmiş, çıxış siqnalının şərtləri isə birtərəfli qaydada dəyişdirilmişdir. Protokolun yenidən razılaşdırılmasını xahiş edirəm.',
  powers: 'Ziyarətlərin sayı tərəflər arasında bərabər bölünməmişdir.\nÇıxış siqnalının şərtləri razılaşdırılmadan dəyişdirilmişdir.\nProtokolda bayram günləri ayrıca nəzərə alınmamışdır.\nYol müddəti ziyarət müddətinə daxil edilməmişdir.',
  penalty: 'Protokol yenidən razılaşdırılmadıqda növbəti ziyarətin müddəti və marşrutu ərizəçi tərəfindən müəyyən edilir.'
},
{
  id: 'r-etiraz-student', cat: 'c-etiraz', tone: 'zarafat', layout: 'blank', palette: 'ink',
  replyKind: 'etiraz', replyCats: ['student'], regPrefix: 'ETZ',
  title: 'Qiymətləndirməyə Etiraz Ərizəsi', tag: 'İmtahan sessiyası',
  toLabel: 'Ərizəçi', fromLabel: 'Ərizə ünvanlanır',
  powersLabel: 'Etirazın əsasları',
  signOrg: 'Tələbə Bəhanələrinin Araşdırılması üzrə Komissiya',
  preamble: 'Mən, {to}, {from} tərəfindən aparılmış qiymətləndirməyə etiraz edirəm. Konspekt borcunun hesablanması zamanı mənim qrupla paylaşdığım iki dərs qeydi nəzərə alınmamış, davamiyyət isə səhv cədvəl üzrə yoxlanılmışdır. Yenidən baxılmasını xahiş edirəm.',
  powers: 'Paylaşılmış iki konspekt hesabata daxil edilməmişdir.\nDavamiyyət səhv cədvəl üzrə yoxlanılmışdır.\nQrup işində mənim hissəm ayrıca qeyd olunmamışdır.\nBorc siyahısı sessiyadan sonra dəyişdirilmişdir.',
  penalty: 'Etiraza baxılmadıqda növbəti qrup işinin mövzusu və bölgüsü ərizəçi tərəfindən təklif olunur.'
},
{
  id: 'r-etiraz-neighbors', cat: 'c-etiraz', tone: 'zarafat', layout: 'blank', palette: 'ink',
  replyKind: 'etiraz', replyCats: ['neighbors'], regPrefix: 'ETZ',
  title: 'Həyət Qərarına Etiraz Ərizəsi', tag: 'Həyət nizamı',
  toLabel: 'Ərizəçi', fromLabel: 'Ərizə ünvanlanır',
  powersLabel: 'Etirazın əsasları',
  signOrg: 'Həyətdaxili Nizamın Qorunması üzrə Baş İdarə',
  preamble: 'Mən, {to}, {from} tərəfindən qəbul edilmiş həyət qərarına etirazımı bildirirəm. Qərar sakinlərin ümumi yığıncağı keçirilmədən qəbul edilmiş, park yerlərinin bölgüsü isə yalnız bir mərtəbənin xeyrinə aparılmışdır. Qərarın yenidən müzakirəsini tələb edirəm.',
  powers: 'Qərar ümumi yığıncaq keçirilmədən qəbul edilmişdir.\nPark yerlərinin bölgüsü bərabər aparılmamışdır.\nUşaq meydançasının istifadə saatları razılaşdırılmamışdır.\nElan lövhəsinə vaxtında məlumat yerləşdirilməmişdir.',
  penalty: 'Yığıncaq çağırılmadıqda park yerlərinin növbəsi əvvəlki aylarda tətbiq olunan qaydada bərpa edilir.'
},
{
  id: 'r-etiraz-holiday', cat: 'c-etiraz', tone: 'zarafat', layout: 'blank', palette: 'ink',
  replyKind: 'etiraz', replyCats: ['holiday'], regPrefix: 'ETZ',
  title: 'Toy Öhdəliyinə Etiraz Ərizəsi', tag: 'Toy protokolu',
  toLabel: 'Ərizəçi', fromLabel: 'Ərizə ünvanlanır',
  powersLabel: 'Etirazın əsasları',
  signOrg: 'Toy Davranışlarına Nəzarət üzrə Baş İdarə',
  preamble: 'Mən, {to}, {from} tərəfindən mənim üzərimə qoyulmuş toy öhdəliyinə etiraz edirəm. Öhdəlik mənimlə heç bir razılaşma aparılmadan müəyyən edilmiş, masa yerləşdirilməsi isə əvvəlcədən bildirilmədən dəyişdirilmişdir. Öhdəliyin yenidən müəyyən edilməsini xahiş edirəm.',
  powers: 'Öhdəlik mənimlə razılaşdırılmadan müəyyən edilmişdir.\nMasa yerləşdirilməsi əvvəlcədən bildirilmədən dəyişdirilmişdir.\nMahnı seçimi üzrə mənim təklifim nəzərə alınmamışdır.\nÇıxış vaxtı sənəddə ümumiyyətlə göstərilməmişdir.',
  penalty: 'Öhdəlik yenidən müəyyən edilmədikdə ərizəçinin masası və çıxış vaxtı onun öz seçimi ilə təyin olunur.'
},
{
  id: 'r-etiraz-travel', cat: 'c-etiraz', tone: 'zarafat', layout: 'blank', palette: 'ink',
  replyKind: 'etiraz', replyCats: ['travel'], regPrefix: 'ETZ',
  title: 'Marşrut Qərarına Etiraz Ərizəsi', tag: 'Yol mübahisəsi',
  toLabel: 'Ərizəçi', fromLabel: 'Ərizə ünvanlanır',
  powersLabel: 'Etirazın əsasları',
  signOrg: 'Səfər və Marşrut Mübahisələri üzrə Ali Komissiya',
  preamble: 'Mən, {to}, {from} tərəfindən müəyyən edilmiş marşrut qərarına etirazımı bildirirəm. Marşrut seçilərkən nə naviqasiya tövsiyəsi, nə də sərnişinlərin rəyi nəzərə alınmış, dayanacaq yerləri isə səfər başlayandan sonra dəyişdirilmişdir. Marşrutun yenidən müzakirəsini xahiş edirəm.',
  powers: 'Marşrut seçilərkən sərnişinlərin rəyi soruşulmamışdır.\nNaviqasiya tövsiyəsi nəzərə alınmamışdır.\nDayanacaq yerləri səfər başlayandan sonra dəyişdirilmişdir.\nSürücülük növbəsi bərabər bölünməmişdir.',
  penalty: 'Marşrut yenidən müzakirə edilmədikdə növbəti səfərin dayanacaq yerlərini və musiqisini ərizəçi müəyyən edir.'
},
{
  id: 'r-etiraz-pets', cat: 'c-etiraz', tone: 'zarafat', layout: 'blank', palette: 'ink',
  replyKind: 'etiraz', replyCats: ['pets'], regPrefix: 'ETZ',
  title: 'Heyvan Qaydasına Etiraz Ərizəsi', tag: 'Divan hüququ',
  toLabel: 'Ərizəçi', fromLabel: 'Ərizə ünvanlanır',
  powersLabel: 'Etirazın əsasları',
  signOrg: 'Ev Heyvanları Hüquqları üzrə Xüsusi Şura',
  preamble: 'Mən, {to}, {from} tərəfindən müəyyən edilmiş ev qaydasına etiraz edirəm. Qayda tərtib olunarkən heyvanın illər ərzində formalaşmış vərdişləri nəzərə alınmamış, divanın qadağan zonası isə bir gecədə birtərəfli qaydada elan edilmişdir. Qaydanın yenidən baxılmasını xahiş edirəm.',
  powers: 'Qayda heyvanın mövcud vərdişləri nəzərə alınmadan tərtib edilmişdir.\nQadağan zonası birtərəfli qaydada elan olunmuşdur.\nYemləmə növbəsi bərabər bölünməmişdir.\nGəzinti saatları hava şəraiti nəzərə alınmadan təyin edilmişdir.',
  penalty: 'Qaydaya yenidən baxılmadıqda gəzinti və yemləmə növbəsi əvvəlki ayda tətbiq olunan formada bərpa edilir.'
},
{
  id: 'r-etiraz-gaming', cat: 'c-etiraz', tone: 'zarafat', layout: 'blank', palette: 'ink',
  replyKind: 'etiraz', replyCats: ['gaming'], regPrefix: 'ETZ',
  title: 'Oyun Nəticəsinə Etiraz Ərizəsi', tag: 'Klassik cavab',
  toLabel: 'Ərizəçi', fromLabel: 'Ərizə ünvanlanır',
  powersLabel: 'Etirazın əsasları',
  signOrg: 'Virtual Futbol Bəhanələri üzrə Ali Komissiya',
  preamble: 'Mən, {to}, {from} tərəfindən rəsmiləşdirilmiş oyun nəticəsinə etiraz edirəm. Oyunun ikinci hissəsində bağlantı iki dəfə kəsilmiş, komanda tərkibi isə oyun başlayandan sonra dəyişdirilmişdir. Nəticəyə yenidən baxılmasını tələb edirəm.',
  powers: 'Oyun zamanı bağlantı iki dəfə kəsilmişdir.\nKomanda tərkibi oyun başlayandan sonra dəyişdirilmişdir.\nÇətinlik səviyyəsi əvvəlcədən razılaşdırılmamışdı.\nPultun düymələrindən biri bütün oyun boyu işləməmişdir.',
  penalty: 'Etiraza baxılmadıqda növbəti oyunun komanda seçimi və çətinlik səviyyəsi ərizəçi tərəfindən müəyyən edilir.'
},
{
  id: 'r-etiraz-viral', cat: 'c-etiraz', tone: 'zarafat', layout: 'blank', palette: 'ink',
  replyKind: 'etiraz', replyCats: ['viral'], regPrefix: 'ETZ',
  title: 'Ekspertiza Rəyinə Etiraz Ərizəsi', tag: 'Viral cavab',
  toLabel: 'Ərizəçi', fromLabel: 'Ərizə ünvanlanır',
  powersLabel: 'Etirazın əsasları',
  signOrg: 'Bəhanələrin Ekspertizası üzrə Ali Komissiya',
  preamble: 'Mən, {to}, {from} tərəfindən tərtib edilmiş ekspertiza rəyinə etirazımı bildirirəm. Rəydə göstərilən bal ölçmə metodikası açıqlanmadan verilmiş, müşahidə müddəti isə cəmi bir epizodu əhatə etmişdir. Təkrar ekspertiza keçirilməsini xahiş edirəm.',
  powers: 'Ölçmə metodikası rəydə açıqlanmamışdır.\nMüşahidə müddəti nəticə çıxarmaq üçün kifayət etmir.\nRəy yalnız bir tərəfin iştirakı ilə tərtib olunmuşdur.\nƏks arqumentlər sənədə ümumiyyətlə daxil edilməmişdir.',
  penalty: 'Təkrar ekspertiza keçirilmədikdə mövcud rəyin nəticələri istinad kimi istifadə edilə bilməz.'
},
{
  id: 'r-etiraz-umumi', cat: 'c-etiraz', tone: 'zarafat', layout: 'blank', palette: 'ink',
  replyKind: 'etiraz', regPrefix: 'ETZ',
  title: 'Sənədə Etiraz Ərizəsi', tag: 'Universal',
  toLabel: 'Ərizəçi', fromLabel: 'Ərizə ünvanlanır',
  powersLabel: 'Etirazın əsasları',
  signOrg: 'Sənədlərə Etirazlar üzrə Ali Apellyasiya Şurası',
  preamble: 'Mən, {to}, {from} tərəfindən tərtib edilmiş sənədə etiraz edirəm. Sənəd mənim iştirakım olmadan hazırlanmış, şərtləri isə yalnız bir tərəfin xeyrinə formalaşdırılmışdır. Sənədə yenidən, hər iki tərəfin iştirakı ilə baxılmasını xahiş edirəm.',
  powers: 'Sənəd mənim iştirakım olmadan tərtib edilmişdir.\nŞərtlər yalnız bir tərəfin xeyrinə formalaşdırılmışdır.\nSənədin qüvvədə olma müddəti göstərilməmişdir.\nƏvvəlki razılıqlar sənəddə nəzərə alınmamışdır.',
  penalty: 'Ərizəyə baxılmadıqda sənədin bəndləri ərizəçi üçün heç bir öhdəlik yaratmır və icrası dayandırılır.'
},

/* ==================== 🔄 TƏKRAR BAXIŞ ====================
   layout: ekspertiza · palette: forest · prefiks: TKR */
{
  id: 'r-tekrar-couples', cat: 'c-tekrar', tone: 'zarafat', layout: 'ekspertiza', palette: 'forest',
  replyKind: 'tekrar', replyCats: ['couples'], regPrefix: 'TKR',
  title: 'Münasibətlər üzrə Təkrar Baxış Qərarı', tag: 'Ev diplomatiyası',
  powersLabel: 'TƏKRAR BAXIŞIN ŞƏRTLƏRİ',
  signOrg: 'Cütlüklərarası Mübahisələrin Həlli üzrə Ali Şura',
  preamble: 'Şura {from} tərəfindən daxil olmuş müraciətə əsasən {to} adlı şəxsə aid sənəd üzrə təkrar baxış təyin edir. İlkin qərar yalnız bir tərəfin izahatı əsasında qəbul edilmiş, ikinci tərəfin arqumentləri isə dinlənilməmişdir. Məsələ yenidən araşdırılacaq.',
  powers: 'Sənədin icrası təkrar baxış başa çatanadək dayandırılır.\nHər iki tərəf öz izahatını yazılı formada təqdim edir.\nƏvvəlki razılıqlar və mesaj tarixçəsi araşdırmaya daxil edilir.\nYekun qərar hər iki tərəfin iştirakı ilə elan olunur.',
  penalty: 'Tərəflərdən biri izahat təqdim etmədikdə qərar mövcud materiallar əsasında, onun mövqeyi nəzərə alınmadan çıxarılır.'
},
{
  id: 'r-tekrar-friends', cat: 'c-tekrar', tone: 'zarafat', layout: 'ekspertiza', palette: 'forest',
  replyKind: 'tekrar', replyCats: ['friends'], regPrefix: 'TKR',
  title: 'Borc Məsələsinə Təkrar Baxış Qərarı', tag: 'Dost borcu',
  powersLabel: 'TƏKRAR BAXIŞIN ŞƏRTLƏRİ',
  signOrg: 'Dostlararası Mübahisələrin Həlli üzrə Ali Məclis',
  preamble: 'Məclis {from} tərəfindən verilmiş ərizəyə əsasən {to} adlı şəxslə bağlı borc məsələsinə təkrar baxış təyin edir. İlkin hesablamada ortaq xərclər və qismən ödənişlər nəzərə alınmamış, məbləğ isə yuvarlaqlaşdırılmış formada göstərilmişdir.',
  powers: 'Bütün ortaq xərclər sıfırdan hesablanır.\nQismən ödənişlər tarix ardıcıllığı ilə siyahıya salınır.\nMəbləğ yuvarlaqlaşdırılmadan, dəqiq göstərilir.\nYeni hesablama hər iki tərəf tərəfindən imzalanır.',
  penalty: 'Hesablama üçün lazım olan çeklər təqdim edilmədikdə həmin xərclər ümumi məbləğdən tam olaraq çıxarılır.'
},
{
  id: 'r-tekrar-work', cat: 'c-tekrar', tone: 'zarafat', layout: 'ekspertiza', palette: 'forest',
  replyKind: 'tekrar', replyCats: ['work'], regPrefix: 'TKR',
  title: 'Tapşırıq üzrə Təkrar Araşdırma Qərarı', tag: 'Ofis',
  powersLabel: 'ARAŞDIRMANIN ŞƏRTLƏRİ',
  signOrg: 'Ofisdaxili Münasibətlərin Tənzimlənməsi üzrə Komitə',
  preamble: 'Komitə {from} tərəfindən qaldırılan məsələ üzrə {to} adlı şəxsə aid tapşırıq sənədinə təkrar baxış təyin edir. İlkin qiymətləndirmə tapşırığın həcmi və verilmə vaxtı nəzərə alınmadan aparılmışdır. Araşdırma beş iş günü ərzində tamamlanacaq.',
  powers: 'Tapşırığın real həcmi saatla ölçülür və sənədə yazılır.\nVerilmə vaxtı mesajlaşma tarixçəsi ilə dəqiqləşdirilir.\nParalel tapşırıqların sayı hesabata daxil edilir.\nYekun müddət araşdırmadan sonra yenidən təyin olunur.',
  penalty: 'Araşdırma müddətində yeni tapşırıq verildikdə həmin tapşırığın müddəti avtomatik olaraq bir iş günü uzadılır.'
},
{
  id: 'r-tekrar-family', cat: 'c-tekrar', tone: 'zarafat', layout: 'ekspertiza', palette: 'forest',
  replyKind: 'tekrar', replyCats: ['family'], regPrefix: 'TKR',
  title: 'Ev Qaydalarına Təkrar Baxış Qərarı', tag: 'Ailə şurası',
  powersLabel: 'TƏKRAR BAXIŞIN ŞƏRTLƏRİ',
  signOrg: 'Evdaxili Münasibətlərin Tənzimlənməsi üzrə Ali Şura',
  preamble: 'Ali Şura {from} tərəfindən daxil olmuş müraciətə əsasən {to} adlı şəxsə şamil edilən ev qaydalarına təkrar baxış təyin edir. Qaydalar bir tərəfin qərarı ilə müəyyən edilmiş, dərs cədvəli və ev işlərinin real həcmi isə nəzərə alınmamışdır.',
  powers: 'Ev işlərinin bölgüsü hər iki tərəfin cədvəli əsasında yenidən qurulur.\nEkran vaxtı dərs yükü nəzərə alınmaqla müəyyən edilir.\nHəftəsonu rejimi ayrıca bənd kimi razılaşdırılır.\nYeni qaydalar ailə şurasının iclasında təsdiqlənir.',
  penalty: 'İclas iki həftə ərzində keçirilmədikdə əvvəlki qaydalar avtomatik olaraq qüvvədən düşür və yenisi tətbiq olunmur.'
},
{
  id: 'r-tekrar-relatives', cat: 'c-tekrar', tone: 'zarafat', layout: 'ekspertiza', palette: 'forest',
  replyKind: 'tekrar', replyCats: ['relatives'], regPrefix: 'TKR',
  title: 'Ziyarət Rejiminə Təkrar Baxış Qərarı', tag: 'Qohum protokolu',
  powersLabel: 'TƏKRAR BAXIŞIN ŞƏRTLƏRİ',
  signOrg: 'Qohumluq Münasibətləri üzrə Ali Nəzarət Şurası',
  preamble: 'Şura {from} tərəfindən verilmiş ərizəyə əsasən {to} adlı şəxsə aid ziyarət protokoluna təkrar baxış təyin edir. Mövcud protokolda ziyarətlərin sayı və müddəti tərəflər arasında bərabər bölünməmiş, yol vaxtı isə ümumiyyətlə hesablanmamışdır.',
  powers: 'Ziyarətlərin sayı hər iki ailə üçün bərabər müəyyən edilir.\nYol vaxtı ziyarət müddətindən ayrıca hesablanır.\nBayram günləri üçün xüsusi cədvəl tərtib olunur.\nÇıxış siqnalının şərtləri yenidən razılaşdırılır.',
  penalty: 'Yeni cədvəl razılaşdırılmadıqda növbəti ziyarətin müddəti üç saatla məhdudlaşdırılır və uzadılmır.'
},
{
  id: 'r-tekrar-student', cat: 'c-tekrar', tone: 'zarafat', layout: 'ekspertiza', palette: 'forest',
  replyKind: 'tekrar', replyCats: ['student'], regPrefix: 'TKR',
  title: 'Konspekt Borcuna Təkrar Baxış Qərarı', tag: 'İmtahan sessiyası',
  powersLabel: 'TƏKRAR BAXIŞIN ŞƏRTLƏRİ',
  signOrg: 'Tələbə Bəhanələrinin Araşdırılması üzrə Komissiya',
  preamble: 'Komissiya {from} tərəfindən daxil olmuş ərizəyə əsasən {to} adlı tələbənin konspekt borcuna təkrar baxış təyin edir. İlkin hesabatda qrupla paylaşılmış qeydlər nəzərə alınmamış, davamiyyət isə köhnə cədvəl üzrə yoxlanılmışdır.',
  powers: 'Paylaşılmış bütün qeydlər borc hesabatına daxil edilir.\nDavamiyyət cari semestrin cədvəli üzrə yenidən yoxlanılır.\nQrup işində hər iştirakçının payı ayrıca göstərilir.\nYekun siyahı sessiyadan əvvəl dəyişməz elan olunur.',
  penalty: 'Təkrar baxış nəticəsində borc təsdiqlənərsə, həmin fənn üzrə növbəti dərsin konspekti tam olaraq tələbənin öhdəsinə keçir.'
},
{
  id: 'r-tekrar-neighbors', cat: 'c-tekrar', tone: 'zarafat', layout: 'ekspertiza', palette: 'forest',
  replyKind: 'tekrar', replyCats: ['neighbors'], regPrefix: 'TKR',
  title: 'Həyət Nizamına Təkrar Baxış Qərarı', tag: 'Həyət nizamı',
  powersLabel: 'TƏKRAR BAXIŞIN ŞƏRTLƏRİ',
  signOrg: 'Həyətdaxili Nizamın Qorunması üzrə Baş İdarə',
  preamble: 'Baş İdarə {from} tərəfindən verilmiş müraciətə əsasən {to} adlı şəxsə aid həyət qərarına təkrar baxış təyin edir. Qərar ümumi yığıncaq keçirilmədən qəbul edilmiş, park yerlərinin bölgüsü isə mərtəbələr üzrə qeyri-bərabər aparılmışdır.',
  powers: 'Park yerləri mənzil sayına görə yenidən bölünür.\nSakitlik rejiminin saatları açıq səsvermə ilə müəyyən edilir.\nUşaq meydançasının istifadə cədvəli tərtib olunur.\nYeni qərar elan lövhəsində yeddi gün saxlanılır.',
  penalty: 'Yığıncaq bir ay ərzində keçirilmədikdə park yerlərinin növbəsi əvvəlki qaydada bərpa olunur.'
},
{
  id: 'r-tekrar-holiday', cat: 'c-tekrar', tone: 'zarafat', layout: 'ekspertiza', palette: 'forest',
  replyKind: 'tekrar', replyCats: ['holiday'], regPrefix: 'TKR',
  title: 'Toy Öhdəliyinə Təkrar Baxış Qərarı', tag: 'Toy protokolu',
  powersLabel: 'TƏKRAR BAXIŞIN ŞƏRTLƏRİ',
  signOrg: 'Toy Davranışlarına Nəzarət üzrə Baş İdarə',
  preamble: 'Baş İdarə {from} tərəfindən daxil olmuş ərizəyə əsasən {to} adlı şəxsin toy öhdəliyinə təkrar baxış təyin edir. Öhdəlik razılaşdırılmadan müəyyən edilmiş, masa yerləşdirilməsi və çıxış vaxtı isə sənəddə ümumiyyətlə göstərilməmişdir.',
  powers: 'Oynama öhdəliyinin həcmi hər iki tərəflə razılaşdırılır.\nMasa yerləşdirilməsi əvvəlcədən yazılı formada təsdiqlənir.\nMahnı seçimi üzrə hər qonağa bir təklif hüququ verilir.\nÇıxış vaxtı sənədə ayrıca bənd kimi əlavə olunur.',
  penalty: 'Şərtlər toydan əvvəl razılaşdırılmadıqda öhdəliyin həcmini və çıxış vaxtını ərizəçi özü müəyyən edir.'
},
{
  id: 'r-tekrar-travel', cat: 'c-tekrar', tone: 'zarafat', layout: 'ekspertiza', palette: 'forest',
  replyKind: 'tekrar', replyCats: ['travel'], regPrefix: 'TKR',
  title: 'Marşrut üzrə Təkrar Araşdırma Qərarı', tag: 'Yol mübahisəsi',
  powersLabel: 'ARAŞDIRMANIN ŞƏRTLƏRİ',
  signOrg: 'Səfər və Marşrut Mübahisələri üzrə Ali Komissiya',
  preamble: 'Komissiya {from} tərəfindən verilmiş müraciətə əsasən {to} adlı şəxsin seçdiyi marşrut üzrə təkrar araşdırma təyin edir. İlkin qərar naviqasiya məlumatı olmadan qəbul edilmiş, gecikmənin səbəbləri isə dəqiqləşdirilməmişdir.',
  powers: 'Marşrutun uzunluğu və müddəti naviqasiya tarixçəsi ilə yoxlanılır.\nGecikmənin səbəbləri ayrı-ayrılıqda qeyd olunur.\nSürücülük növbəsi səfərin müddətinə görə yenidən bölünür.\nDayanacaq yerləri hər iki tərəfin razılığı ilə müəyyən edilir.',
  penalty: 'Araşdırma tamamlanana qədər naviqasiya səlahiyyəti müvəqqəti olaraq sərnişində qalır.'
},
{
  id: 'r-tekrar-pets', cat: 'c-tekrar', tone: 'zarafat', layout: 'ekspertiza', palette: 'forest',
  replyKind: 'tekrar', replyCats: ['pets'], regPrefix: 'TKR',
  title: 'Ev Heyvanı Rejiminə Təkrar Baxış', tag: 'Divan hüququ',
  powersLabel: 'TƏKRAR BAXIŞIN ŞƏRTLƏRİ',
  signOrg: 'Ev Heyvanları Hüquqları üzrə Xüsusi Şura',
  preamble: 'Şura {from} tərəfindən daxil olmuş müraciətə əsasən {to} adlı şəxsin müəyyən etdiyi ev rejiminə təkrar baxış təyin edir. Rejim heyvanın mövcud vərdişləri öyrənilmədən tərtib edilmiş, qadağan zonaları isə bir gecədə elan olunmuşdur.',
  powers: 'Heyvanın gündəlik vərdişləri bir həftə müşahidə olunur.\nQadağan zonaları müşahidə nəticəsinə görə yenidən müəyyən edilir.\nYemləmə növbəsi ev üzvləri arasında bərabər bölünür.\nGəzinti saatları hava şəraitinə uyğunlaşdırılır.',
  penalty: 'Müşahidə aparılmadıqda mövcud rejim qüvvədən düşür və heyvanın əvvəlki vərdişləri bərpa olunmuş sayılır.'
},
{
  id: 'r-tekrar-gaming', cat: 'c-tekrar', tone: 'zarafat', layout: 'ekspertiza', palette: 'forest',
  replyKind: 'tekrar', replyCats: ['gaming'], regPrefix: 'TKR',
  title: 'Təkrar Oyun Keçirilməsi Haqqında Qərar', tag: 'Ən çox tələb olunan',
  powersLabel: 'TƏKRAR OYUNUN ŞƏRTLƏRİ',
  signOrg: 'Virtual Futbol Bəhanələri üzrə Ali Komissiya',
  preamble: 'Komissiya {from} tərəfindən verilmiş ərizəyə baxaraq {to} adlı şəxslə keçirilmiş oyun üzrə təkrar görüş təyin edir. Bağlantı kəsintisi qeydə alınmış, lakin nəticəyə təsiri sübuta yetirilməmişdir. Məsələ meydanda həll ediləcək.',
  powers: 'Təkrar oyun yeddi gün ərzində keçirilir.\nHər iki tərəf eyni şəbəkəyə kabellə qoşulur.\nKomanda seçimi oyundan əvvəl yazılı şəkildə təsbit olunur.\nİkinci oyunun nəticəsi yekun sayılır və mübahisə edilmir.',
  penalty: 'Təkrar oyuna çıxmayan tərəf məğlub sayılır və ilkin nəticə avtomatik olaraq qüvvəyə minir.'
},
{
  id: 'r-tekrar-viral', cat: 'c-tekrar', tone: 'zarafat', layout: 'ekspertiza', palette: 'forest',
  replyKind: 'tekrar', replyCats: ['viral'], regPrefix: 'TKR',
  title: 'Təkrar Ekspertiza Təyin Edilməsi Qərarı', tag: 'Viral cavab',
  powersLabel: 'TƏKRAR EKSPERTİZANIN ŞƏRTLƏRİ',
  signOrg: 'Bəhanələrin Ekspertizası üzrə Ali Komissiya',
  preamble: 'Komissiya {from} tərəfindən daxil olmuş etiraza əsasən {to} adlı şəxs barəsində verilmiş rəy üzrə təkrar ekspertiza təyin edir. İlkin rəy bir epizod əsasında tərtib edilmiş, ölçmə metodikası isə sənədə əlavə olunmamışdır.',
  powers: 'Müşahidə müddəti ən azı üç epizodu əhatə edir.\nÖlçmə metodikası rəyin ayrılmaz hissəsi kimi əlavə olunur.\nHər iki tərəf ekspertiza zamanı iştirak edir.\nYekun bal əvvəlki rəydən asılı olmayaraq müəyyən edilir.',
  penalty: 'Təkrar ekspertiza keçirilmədikdə ilkin rəy istinad sənədi kimi istifadə edilə bilməz və arxivə verilir.'
},
{
  id: 'r-tekrar-umumi', cat: 'c-tekrar', tone: 'zarafat', layout: 'ekspertiza', palette: 'forest',
  replyKind: 'tekrar', regPrefix: 'TKR',
  title: 'Sənədə Təkrar Baxış Haqqında Qərar', tag: 'Universal',
  powersLabel: 'TƏKRAR BAXIŞIN ŞƏRTLƏRİ',
  signOrg: 'Sənədlərə Etirazlar üzrə Ali Apellyasiya Şurası',
  preamble: 'Şura {from} tərəfindən verilmiş müraciətə əsasən {to} adlı şəxs tərəfindən tərtib edilmiş sənəd üzrə təkrar baxış təyin edir. Sənəd bir tərəfin iştirakı ilə hazırlanmış, əks arqumentlər isə mətnə daxil edilməmişdir.',
  powers: 'Sənədin icrası təkrar baxış müddətində dayandırılır.\nHər iki tərəf öz mövqeyini yazılı şəkildə təqdim edir.\nSənədin bütün bəndləri ayrı-ayrılıqda müzakirə olunur.\nYekun redaksiya hər iki tərəf tərəfindən təsdiqlənir.',
  penalty: 'Baxış on dörd gün ərzində tamamlanmadıqda sənəd qüvvədən düşür və yeni sənəd tərtib edilir.'
},

/* ==================== 🚫 LƏĞV ====================
   layout: teleqram · palette: steel · prefiks: LGV */
{
  id: 'r-legv-couples', cat: 'c-legv', tone: 'zarafat', layout: 'teleqram', palette: 'steel',
  replyKind: 'legv', replyCats: ['couples'], regPrefix: 'LGV',
  title: 'İcazənin Ləğv Edilməsi Haqqında Bildiriş', tag: 'Ev diplomatiyası',
  signOrg: 'Cütlüklərarası Mübahisələrin Həlli üzrə Ali Şura',
  preamble: '{from} bu bildirişlə {to} adlı şəxsə verilmiş icazənin ləğv edildiyini rəsmi qaydada elan edir. Ləğvin əsası sənəddə göstərilmiş şərtlərin ardıcıl olaraq üç dəfə pozulmasıdır. Bildiriş çatdırıldığı andan icazə qüvvədən düşür.',
  powers: 'İcazə bildirişin çatdırıldığı andan qüvvədən düşür.\nSənəddə göstərilən bütün güzəştlər eyni anda dayandırılır.\nYeni icazə üçün müraciət ən tezi yeddi gündən sonra mümkündür.\nƏvvəlki icazənin nüsxələri etibarsız sayılır.',
  penalty: 'Ləğv edilmiş icazəyə istinad davam etdikdə növbəti iki həftəsonunun proqramı tam olaraq bildirişi verən tərəf tərəfindən müəyyən edilir.'
},
{
  id: 'r-legv-friends', cat: 'c-legv', tone: 'zarafat', layout: 'teleqram', palette: 'steel',
  replyKind: 'legv', replyCats: ['friends'], regPrefix: 'LGV',
  title: 'Möhlətin Ləğv Edilməsi Haqqında Bildiriş', tag: 'Dost borcu',
  signOrg: 'Dostlararası Mübahisələrin Həlli üzrə Ali Məclis',
  preamble: '{from} bu bildirişlə {to} adlı şəxsə verilmiş ödəniş möhlətinin ləğv edildiyini elan edir. Möhlət yaxşı niyyət əsasında verilmiş, lakin razılaşdırılmış tarixdə heç bir ödəniş və ya izahat daxil olmamışdır. Borc dərhal tələb olunan hala keçir.',
  powers: 'Möhlət bildirişin çatdırıldığı andan qüvvədən düşür.\nBorcun tam məbləği dərhal tələb olunan hala keçir.\nYeni möhlət yalnız yazılı formada və şahid iştirakı ilə verilir.\nHissə-hissə ödəniş razılığı ayrıca sənədləşdirilir.',
  penalty: 'Ödəniş yeddi gün ərzində həyata keçirilmədikdə borcun məbləği növbəti ortaq görüşün hesabı qədər artırılmış sayılır.'
},
{
  id: 'r-legv-work', cat: 'c-legv', tone: 'zarafat', layout: 'teleqram', palette: 'steel',
  replyKind: 'legv', replyCats: ['work'], regPrefix: 'LGV',
  title: 'Tapşırıq Möhlətinin Ləğvi Bildirişi', tag: 'Ofis',
  signOrg: 'Ofisdaxili Münasibətlərin Tənzimlənməsi üzrə Komitə',
  preamble: '{from} bu bildirişlə {to} adlı şəxsə verilmiş əlavə müddətin ləğv edildiyini elan edir. Müddət bir dəfə uzadılmış, ikinci uzatma isə əsaslandırılmadan tələb olunmuşdur. Tapşırıq ilkin cədvəl üzrə təhvil verilməlidir.',
  powers: 'Əlavə müddət bildirişin çatdırıldığı andan qüvvədən düşür.\nTapşırıq ilkin cədvəl üzrə təhvil verilir.\n«Az qalıb» ifadəsi hesabat kimi qəbul edilmir.\nTəhvil forması dəyişdirilə bilməz.',
  penalty: 'Tapşırıq ilkin cədvəl üzrə təhvil verilmədikdə növbəti həftənin toplantı protokolunu aparmaq öhdəliyi həmin şəxsin üzərinə düşür.'
},
{
  id: 'r-legv-family', cat: 'c-legv', tone: 'zarafat', layout: 'teleqram', palette: 'steel',
  replyKind: 'legv', replyCats: ['family'], regPrefix: 'LGV',
  title: 'Ev Fərmanının Ləğvi Haqqında Bildiriş', tag: 'Ailə şurası',
  signOrg: 'Evdaxili Münasibətlərin Tənzimlənməsi üzrə Ali Şura',
  preamble: '{from} bu bildirişlə {to} adlı şəxs tərəfindən elan edilmiş ev fərmanının ləğv edildiyini bildirir. Fərman ailə şurası çağırılmadan qüvvəyə minmiş və digər ev üzvlərinin razılığını almamışdır. Fərman bu andan etibarsızdır.',
  powers: 'Fərman bildirişin elan olunduğu andan qüvvədən düşür.\nPult və kanal seçimi üzrə əvvəlki qayda bərpa olunur.\nEv işlərinin bölgüsü şuraya qədər dəyişmir.\nYeni fərman yalnız şura iclasında elan edilə bilər.',
  penalty: 'Ləğv edilmiş fərmana istinad davam etdikdə həmin həftənin bütün ev işləri fərmanı elan edən tərəfin üzərinə keçir.'
},
{
  id: 'r-legv-relatives', cat: 'c-legv', tone: 'zarafat', layout: 'teleqram', palette: 'steel',
  replyKind: 'legv', replyCats: ['relatives'], regPrefix: 'LGV',
  title: 'Ziyarət Möhlətinin Ləğvi Bildirişi', tag: 'Qohum protokolu',
  signOrg: 'Qohumluq Münasibətləri üzrə Ali Nəzarət Şurası',
  preamble: '{from} bu bildirişlə {to} adlı şəxsə verilmiş ziyarət təxirinin ləğv edildiyini elan edir. Təxir bir dəfə verilmiş, lakin sonrakı iki bayramda da eyni səbəb təkrarlanmışdır. Ziyarət bu ay ərzində baş tutmalıdır.',
  powers: 'Ziyarət təxiri bildirişin çatdırıldığı andan qüvvədən düşür.\nZiyarətin tarixi qarşı tərəf tərəfindən müəyyən edilir.\nYol vaxtı bəhanə kimi qəbul edilmir.\nYeni təxir üçün müraciət bu il qəbul olunmur.',
  penalty: 'Ziyarət bu ay baş tutmadıqda növbəti bayram süfrəsinin hazırlığı və qonaq siyahısı təxir istəyən tərəfin öhdəsinə keçir.'
},
{
  id: 'r-legv-student', cat: 'c-legv', tone: 'zarafat', layout: 'teleqram', palette: 'steel',
  replyKind: 'legv', replyCats: ['student'], regPrefix: 'LGV',
  title: 'Konspekt Möhlətinin Ləğvi Bildirişi', tag: 'İmtahan sessiyası',
  signOrg: 'Tələbə Bəhanələrinin Araşdırılması üzrə Komissiya',
  preamble: '{from} bu bildirişlə {to} adlı tələbəyə verilmiş konspekt möhlətinin ləğv edildiyini elan edir. Möhlət sessiyaya qədər verilmiş, lakin bu müddətdə heç bir qeyd qrupla paylaşılmamışdır. Borc dərhal bağlanmalıdır.',
  powers: 'Möhlət bildirişin elan olunduğu andan qüvvədən düşür.\nBütün konspektlər növbəti dərsə qədər qrupla paylaşılır.\nFoto şəklində göndərilən oxunmaz qeydlər qəbul edilmir.\nYeni möhlət bu semestrdə verilmir.',
  penalty: 'Borc növbəti dərsə qədər bağlanmadıqda həmin fənn üzrə bütün semestrin qeydləri tələbənin öhdəsinə keçir.'
},
{
  id: 'r-legv-neighbors', cat: 'c-legv', tone: 'zarafat', layout: 'teleqram', palette: 'steel',
  replyKind: 'legv', replyCats: ['neighbors'], regPrefix: 'LGV',
  title: 'Həyət İcazəsinin Ləğvi Bildirişi', tag: 'Həyət nizamı',
  signOrg: 'Həyətdaxili Nizamın Qorunması üzrə Baş İdarə',
  preamble: '{from} bu bildirişlə {to} adlı şəxsə verilmiş həyət icazəsinin ləğv edildiyini elan edir. İcazə müvəqqəti verilmiş, lakin park yeri razılaşdırılmış müddətdən artıq tutulmuş və sakitlik rejimi iki dəfə pozulmuşdur.',
  powers: 'İcazə bildirişin elan olunduğu andan qüvvədən düşür.\nPark yeri növbə cədvəlinə qaytarılır.\nSakitlik rejimi saat 23:00-dan bərpa olunur.\nBildirişin surəti pilləkən elan lövhəsinə vurulur.',
  penalty: 'İcazə ləğv edildikdən sonra park yeri boşaldılmadıqda həmin yer növbəti ay üçün digər sakinə təhkim olunur.'
},
{
  id: 'r-legv-holiday', cat: 'c-legv', tone: 'zarafat', layout: 'teleqram', palette: 'steel',
  replyKind: 'legv', replyCats: ['holiday'], regPrefix: 'LGV',
  title: 'Toy İcazəsinin Ləğvi Haqqında Bildiriş', tag: 'Toy protokolu',
  signOrg: 'Toy Davranışlarına Nəzarət üzrə Baş İdarə',
  preamble: '{from} bu bildirişlə {to} adlı şəxsə verilmiş «oynamamaq» icazəsinin ləğv edildiyini elan edir. İcazə bir toy üçün verilmiş, lakin sonrakı üç mərasimdə də istifadə olunmuşdur. Bundan sonra icazə qüvvədə deyil.',
  powers: 'İcazə bildirişin çatdırıldığı andan qüvvədən düşür.\nOynama öhdəliyi bərpa olunur və ən azı iki mahnını əhatə edir.\nMasadan qalxmamaq hüququ dayandırılır.\nQohumların dəvəti rədd edilə bilməz.',
  penalty: 'Öhdəlik yerinə yetirilmədikdə həmin şəxs növbəti mərasimin bütün fotolarında ön sırada durmaq öhdəliyi daşıyır.'
},
{
  id: 'r-legv-travel', cat: 'c-legv', tone: 'zarafat', layout: 'teleqram', palette: 'steel',
  replyKind: 'legv', replyCats: ['travel'], regPrefix: 'LGV',
  title: 'Naviqasiya Səlahiyyətinin Ləğvi Bildirişi', tag: 'Yol mübahisəsi',
  signOrg: 'Səfər və Marşrut Mübahisələri üzrə Ali Komissiya',
  preamble: '{from} bu bildirişlə {to} adlı şəxsə verilmiş naviqasiya səlahiyyətinin ləğv edildiyini elan edir. Səlahiyyət etibar əsasında verilmiş, lakin son üç səfərdə ümumi gecikmə bir saatı keçmişdir. Səlahiyyət bu andan qüvvədə deyil.',
  powers: 'Naviqasiya səlahiyyəti bildirişin anından digər tərəfə keçir.\nMarşrut bundan sonra naviqasiya tövsiyəsi ilə seçilir.\nMusiqi seçimi səfər müddətincə sərnişində qalır.\nDayanacaq yerlərini sərnişin müəyyən edir.',
  penalty: 'Səlahiyyət ləğv edildikdən sonra yenidən istifadə edildikdə həmin səfərin bütün xərcləri sürücünün üzərində qalır.'
},
{
  id: 'r-legv-pets', cat: 'c-legv', tone: 'zarafat', layout: 'teleqram', palette: 'steel',
  replyKind: 'legv', replyCats: ['pets'], regPrefix: 'LGV',
  title: 'Divan Hüququnun Ləğvi Haqqında Bildiriş', tag: 'Divan hüququ',
  signOrg: 'Ev Heyvanları Hüquqları üzrə Xüsusi Şura',
  preamble: '{from} bu bildirişlə {to} adlı şəxsin ev heyvanına verilmiş divan hüququnun ləğv edildiyini elan edir. Hüquq şərti qaydada verilmiş, lakin yastıq üç dəfə zədələnmiş və qadağan zonası müntəzəm pozulmuşdur.',
  powers: 'Divan hüququ bildirişin elan olunduğu andan qüvvədən düşür.\nHeyvanın öz yatağı otağın əvvəlki küncünə qaytarılır.\nYemləmə növbəsi sahibin üzərində qalır.\nYeni hüquq üçün müraciət bir aydan sonra mümkündür.',
  penalty: 'Qadağan zonası yenidən pozulduqda bütün həftəlik gəzinti öhdəliyi heyvanın sahibinin üzərinə keçir.'
},
{
  id: 'r-legv-gaming', cat: 'c-legv', tone: 'zarafat', layout: 'teleqram', palette: 'steel',
  replyKind: 'legv', replyCats: ['gaming'], regPrefix: 'LGV',
  title: 'Qələbənin Qüvvədən Düşməsi Bildirişi', tag: 'Rəqəmsal sülh',
  signOrg: 'Virtual Futbol Bəhanələri üzrə Ali Komissiya',
  preamble: '{from} bu bildirişlə {to} adlı şəxsin elan etdiyi qələbənin qüvvədən düşdüyünü bildirir. Oyun razılaşdırılmamış çətinlik səviyyəsində keçirilmiş, komanda tərkibi isə matç başladıqdan sonra dəyişdirilmişdir. Nəticə arxivə verilir.',
  powers: 'Elan edilmiş nəticə bildirişin anından qüvvədən düşür.\nHesab arxivə verilir və istinad kimi işlədilmir.\nQol sevincinin videosu paylaşıla bilməz.\nYeni matç yalnız razılaşdırılmış şərtlərlə keçirilir.',
  penalty: 'Qüvvədən düşmüş nəticə yenidən xatırladıldıqda növbəti matçın komanda seçimi bildirişi verən tərəfə keçir.'
},
{
  id: 'r-legv-viral', cat: 'c-legv', tone: 'zarafat', layout: 'teleqram', palette: 'steel',
  replyKind: 'legv', replyCats: ['viral'], regPrefix: 'LGV',
  title: 'Vizanın Qüvvədən Düşməsi Bildirişi', tag: 'Viral cavab',
  signOrg: 'Bəhanələrin Ekspertizası üzrə Ali Komissiya',
  preamble: '{from} bu bildirişlə {to} adlı şəxsə verilmiş sənədin qüvvədən düşdüyünü elan edir. Sənəddə göstərilmiş qayıdış vaxtı keçmiş, radius isə iki dəfə aşılmışdır. Sənəd bu andan etibarsız hesab olunur.',
  powers: 'Sənəd bildirişin çatdırıldığı andan qüvvədən düşür.\nGöstərilmiş radius və müddət bərpa olunmur.\nMüşayiət siyahısı ləğv edilir.\nYeni sənəd üçün müraciət yalnız yazılı formada qəbul olunur.',
  penalty: 'Qüvvədən düşmüş sənədlə çölə çıxılması halında növbəti həftəsonu üçün heç bir yeni sənəd verilmir.'
},
{
  id: 'r-legv-umumi', cat: 'c-legv', tone: 'zarafat', layout: 'teleqram', palette: 'steel',
  replyKind: 'legv', regPrefix: 'LGV',
  title: 'Sənədin Qüvvədən Düşməsi Bildirişi', tag: 'Universal',
  signOrg: 'Sənədlərə Etirazlar üzrə Ali Apellyasiya Şurası',
  preamble: '{from} bu bildirişlə {to} adlı şəxs tərəfindən dövriyyəyə buraxılmış sənədin qüvvədən düşdüyünü elan edir. Sənəd qarşı tərəfin razılığı olmadan tərtib edilmiş və heç bir mərhələdə təsdiqlənməmişdir. Sənəd etibarsızdır.',
  powers: 'Sənəd bildirişin elan olunduğu andan qüvvədən düşür.\nSənəddə göstərilən öhdəliklər heç bir nəticə doğurmur.\nSənədin paylaşılmış nüsxələri etibarsız sayılır.\nYeni sənəd yalnız qarşılıqlı razılıqla tərtib edilə bilər.',
  penalty: 'Qüvvədən düşmüş sənəd yenidən paylaşıldıqda mövzunun növbəti müzakirəsinin şərtlərini bildirişi verən tərəf müəyyən edir.'
},

/* ==================== ✅ QÜVVƏDƏ SAXLAMA ====================
   layout: sertifikat · palette: gold · prefiks: QVD */
{
  id: 'r-qebul-couples', cat: 'c-qebul', tone: 'zarafat', layout: 'sertifikat', palette: 'gold',
  replyKind: 'qebul', replyCats: ['couples'], regPrefix: 'QVD',
  title: 'İcazənin Qüvvədə Saxlanılması Qərarı', tag: 'Ev diplomatiyası',
  powersLabel: 'TƏSDİQLƏNƏN ŞƏRTLƏR',
  signOrg: 'Cütlüklərarası Mübahisələrin Həlli üzrə Ali Şura',
  preamble: 'Şura {to} adlı şəxsə verilmiş icazə sənədinə baxdı və onun bütün bəndlərini qüvvədə saxlamaq qərarına gəldi. {from} tərəfindən bildirilən narazılıq əsaslı hesab edilmədi: sənəd qarşılıqlı razılıqla tərtib olunmuş və şərtləri hər iki tərəf üçün bərabərdir.',
  powers: 'İcazə tam həcmdə qüvvədə saxlanılır.\nSənəddə göstərilən saat aralığı dəyişdirilmir.\nGüzəştlərin sayı azaldılmır.\nEyni məsələ üzrə yeni etiraz 30 gün ərzində qəbul edilmir.',
  penalty: 'Təsdiqlənmiş icazəyə maneə törədildikdə növbəti həftəsonunun proqramını icazə sahibi müəyyən edir.'
},
{
  id: 'r-qebul-friends', cat: 'c-qebul', tone: 'zarafat', layout: 'sertifikat', palette: 'gold',
  replyKind: 'qebul', replyCats: ['friends'], regPrefix: 'QVD',
  title: 'Borcun Qüvvədə Saxlanılması Qərarı', tag: 'Dost borcu',
  powersLabel: 'TƏSDİQLƏNƏN ŞƏRTLƏR',
  signOrg: 'Dostlararası Mübahisələrin Həlli üzrə Ali Məclis',
  preamble: 'Məclis {to} adlı şəxsə aid borc sənədini araşdırdı və onun qüvvədə saxlanılmasını qərara aldı. {from} tərəfindən təqdim edilmiş etiraz sənədlə təsdiqlənmədi: göstərilən məbləğ ortaq xərclər çıxıldıqdan sonra hesablanmışdır.',
  powers: 'Borcun məbləği və tarixi olduğu kimi qüvvədə qalır.\nHesablama düzgün aparılmış hesab edilir.\nMövcud möhlət pozulmadan davam edir.\nYeni etiraz yalnız çeklə birlikdə qəbul olunur.',
  penalty: 'Ödəniş razılaşdırılmış tarixdə həyata keçirilmədikdə möhlət avtomatik olaraq ləğv edilir və borc tam tələb olunur.'
},
{
  id: 'r-qebul-work', cat: 'c-qebul', tone: 'zarafat', layout: 'sertifikat', palette: 'gold',
  replyKind: 'qebul', replyCats: ['work'], regPrefix: 'QVD',
  title: 'Tapşırıq Qərarının Təsdiqi Sertifikatı', tag: 'Ofis',
  powersLabel: 'TƏSDİQLƏNƏN ŞƏRTLƏR',
  signOrg: 'Ofisdaxili Münasibətlərin Tənzimlənməsi üzrə Komitə',
  preamble: 'Komitə {to} adlı şəxsə ünvanlanmış tapşırıq sənədini araşdırdı və onu qüvvədə saxladı. {from} tərəfindən verilmiş etirazda göstərilən səbəblər tapşırığın həcmi ilə mütənasib hesab edilmədi. Sənəd ilkin redaksiyada qalır.',
  powers: 'Tapşırığın son müddəti dəyişdirilmir.\nİşin həcmi düzgün qiymətləndirilmiş hesab edilir.\nTəhvil forması sənəddə göstərildiyi kimi qalır.\nƏlavə müddət üçün yeni müraciət qəbul olunmur.',
  penalty: 'Tapşırıq müddətində təhvil verilmədikdə növbəti həftənin toplantı gündəliyini həmin şəxs hazırlayır.'
},
{
  id: 'r-qebul-family', cat: 'c-qebul', tone: 'zarafat', layout: 'sertifikat', palette: 'gold',
  replyKind: 'qebul', replyCats: ['family'], regPrefix: 'QVD',
  title: 'Ev Fərmanının Qüvvədə Saxlanılması', tag: 'Ailə şurası',
  powersLabel: 'TƏSDİQLƏNƏN ŞƏRTLƏR',
  signOrg: 'Evdaxili Münasibətlərin Tənzimlənməsi üzrə Ali Şura',
  preamble: 'Ali Şura {to} adlı şəxs tərəfindən elan edilmiş ev fərmanını müzakirə etdi və onu qüvvədə saxlamaq qərarına gəldi. {from} tərəfindən bildirilən etiraz baxıldı, lakin fərmanın bəndləri ailənin mövcud cədvəli ilə uyğun tapıldı.',
  powers: 'Fərman tam həcmdə qüvvədə saxlanılır.\nEv işlərinin bölgüsü dəyişdirilmir.\nEkran vaxtı mövcud formada qalır.\nFərmana yeni etiraz növbəti şura iclasında baxılır.',
  penalty: 'Fərmana əməl edilmədikdə həftəsonu proqramının seçimi bir həftəlik digər ev üzvünə keçir.'
},
{
  id: 'r-qebul-relatives', cat: 'c-qebul', tone: 'zarafat', layout: 'sertifikat', palette: 'gold',
  replyKind: 'qebul', replyCats: ['relatives'], regPrefix: 'QVD',
  title: 'Ziyarət Protokolunun Təsdiqi Qərarı', tag: 'Qohum protokolu',
  powersLabel: 'TƏSDİQLƏNƏN ŞƏRTLƏR',
  signOrg: 'Qohumluq Münasibətləri üzrə Ali Nəzarət Şurası',
  preamble: 'Şura {to} adlı şəxs tərəfindən təqdim edilmiş ziyarət protokolunu araşdırdı və onu qüvvədə saxladı. {from} tərəfindən bildirilən etirazda göstərilən bölgü fərqi hesablamada təsdiqlənmədi: ziyarətlərin sayı hər iki ailə üçün bərabərdir.',
  powers: 'Protokol tam həcmdə qüvvədə saxlanılır.\nZiyarətlərin sayı və müddəti dəyişdirilmir.\nÇıxış siqnalının şərtləri olduğu kimi qalır.\nBayram cədvəli əlavə razılaşma tələb etmir.',
  penalty: 'Protokola əməl edilmədikdə növbəti ziyarətin marşrutunu və müddətini qarşı tərəf müəyyən edir.'
},
{
  id: 'r-qebul-student', cat: 'c-qebul', tone: 'zarafat', layout: 'sertifikat', palette: 'gold',
  replyKind: 'qebul', replyCats: ['student'], regPrefix: 'QVD',
  title: 'Tələbə Bəhanəsinin Qəbul Edilməsi Qərarı', tag: 'Nadir hal',
  powersLabel: 'TƏSDİQLƏNƏN ŞƏRTLƏR',
  signOrg: 'Tələbə Bəhanələrinin Araşdırılması üzrə Komissiya',
  preamble: 'Komissiya {to} adlı tələbənin təqdim etdiyi əsaslandırmaya baxdı və onu — nadir hal olaraq — üzrlü hesab etdi. {from} tərəfindən qaldırılan məsələ öz həllini tapdı: göstərilən səbəb sənədlə təsdiqləndi və qeyd dəyişdirildi.',
  powers: 'Gecikmənin səbəbi üzrlü hesab edilir.\nDavamiyyət qeydi düzəldilir və borc siyahısından çıxarılır.\nKonspekt öhdəliyi bir həftə uzadılır.\nQərar yalnız bu epizoda şamil olunur və nümunə yaratmır.',
  penalty: 'Eyni səbəb bu semestrdə təkrar göstərildikdə həmin əsaslandırma avtomatik olaraq əsassız sayılır.'
},
{
  id: 'r-qebul-neighbors', cat: 'c-qebul', tone: 'zarafat', layout: 'sertifikat', palette: 'gold',
  replyKind: 'qebul', replyCats: ['neighbors'], regPrefix: 'QVD',
  title: 'Həyət Qərarının Qüvvədə Saxlanılması', tag: 'Həyət nizamı',
  powersLabel: 'TƏSDİQLƏNƏN ŞƏRTLƏR',
  signOrg: 'Həyətdaxili Nizamın Qorunması üzrə Baş İdarə',
  preamble: 'Baş İdarə {to} adlı şəxs tərəfindən təqdim edilmiş həyət qərarını araşdırdı və onu qüvvədə saxladı. {from} tərəfindən verilmiş etirazda göstərilən bölgü fərqi mənzil sayı ilə müqayisədə təsdiqlənmədi. Qərar dəyişməz qalır.',
  powers: 'Qərar tam həcmdə qüvvədə saxlanılır.\nPark yerlərinin bölgüsü dəyişdirilmir.\nSakitlik rejiminin saatları olduğu kimi qalır.\nQərarın surəti elan lövhəsində saxlanılır.',
  penalty: 'Qərara əməl edilmədikdə növbəti ay üçün park yeri növbəsi qərara etiraz edən tərəfin sonuna keçirilir.'
},
{
  id: 'r-qebul-holiday', cat: 'c-qebul', tone: 'zarafat', layout: 'sertifikat', palette: 'gold',
  replyKind: 'qebul', replyCats: ['holiday'], regPrefix: 'QVD',
  title: 'Toy İcazəsinin Təsdiq Edilməsi Qərarı', tag: 'Toy protokolu',
  powersLabel: 'TƏSDİQLƏNƏN ŞƏRTLƏR',
  signOrg: 'Toy Davranışlarına Nəzarət üzrə Baş İdarə',
  preamble: 'Baş İdarə {to} adlı şəxsə verilmiş icazəni araşdırdı və onu qüvvədə saxlamaq qərarına gəldi. {from} tərəfindən bildirilən etiraz baxıldı, lakin icazənin şərtləri mərasimin proqramı ilə ziddiyyət təşkil etmir. İcazə dəyişməz qalır.',
  powers: 'İcazə tam həcmdə qüvvədə saxlanılır.\nOynama öhdəliyi bu mərasim üçün tətbiq olunmur.\nMasa yerləşdirilməsi dəyişdirilmir.\nQohumların təkrar dəvəti bir dəfə rədd edilə bilər.',
  penalty: 'İcazəyə baxmayaraq təzyiq davam etdikdə növbəti mərasimin masa bölgüsünü icazə sahibi müəyyən edir.'
},
{
  id: 'r-qebul-travel', cat: 'c-qebul', tone: 'zarafat', layout: 'sertifikat', palette: 'gold',
  replyKind: 'qebul', replyCats: ['travel'], regPrefix: 'QVD',
  title: 'Marşrut Qərarının Təsdiqi Sertifikatı', tag: 'Yol mübahisəsi',
  powersLabel: 'TƏSDİQLƏNƏN ŞƏRTLƏR',
  signOrg: 'Səfər və Marşrut Mübahisələri üzrə Ali Komissiya',
  preamble: 'Komissiya {to} adlı şəxsin seçdiyi marşrutu araşdırdı və qərarı qüvvədə saxladı. {from} tərəfindən bildirilən etiraz naviqasiya məlumatı ilə təsdiqlənmədi: seçilmiş yol həqiqətən qısa olmuş, gecikmə isə tıxacdan qaynaqlanmışdır.',
  powers: 'Marşrut seçimi düzgün hesab edilir.\nNaviqasiya səlahiyyəti sürücüdə qalır.\nDayanacaq yerləri dəyişdirilmir.\nGecikmə sürücünün üzərinə yazılmır.',
  penalty: 'Növbəti səfərdə gecikmə yenidən 25 dəqiqəni aşdıqda naviqasiya səlahiyyəti avtomatik olaraq sərnişinə keçir.'
},
{
  id: 'r-qebul-pets', cat: 'c-qebul', tone: 'zarafat', layout: 'sertifikat', palette: 'gold',
  replyKind: 'qebul', replyCats: ['pets'], regPrefix: 'QVD',
  title: 'Divan Hüququnun Təsdiqi Sertifikatı', tag: 'Divan hüququ',
  powersLabel: 'TƏSDİQLƏNƏN ŞƏRTLƏR',
  signOrg: 'Ev Heyvanları Hüquqları üzrə Xüsusi Şura',
  preamble: 'Şura {to} adlı şəxsin ev heyvanına aid sənədi araşdırdı və divan hüququnu qüvvədə saxladı. {from} tərəfindən bildirilən etirazda göstərilən zədə müşahidə zamanı təsdiqlənmədi. Hüquq mövcud şərtlərlə davam edir.',
  powers: 'Divan hüququ tam həcmdə qüvvədə saxlanılır.\nHeyvanın yeri dəyişdirilmir.\nYemləmə növbəsi mövcud formada qalır.\nGəzinti saatları hava şəraitinə görə tənzimlənir.',
  penalty: 'Yastıq növbəti ay ərzində zədələndikdə divan hüququ avtomatik olaraq bir həftəlik dayandırılır.'
},
{
  id: 'r-qebul-gaming', cat: 'c-qebul', tone: 'zarafat', layout: 'sertifikat', palette: 'gold',
  replyKind: 'qebul', replyCats: ['gaming'], regPrefix: 'QVD',
  title: 'Məğlubiyyətin Qüvvədə Saxlanılması Qərarı', tag: 'Klassik cavab',
  powersLabel: 'TƏSDİQLƏNƏN ŞƏRTLƏR',
  signOrg: 'Virtual Futbol Bəhanələri üzrə Ali Komissiya',
  preamble: 'Komissiya {to} adlı şəxsin oyun nəticəsi ilə bağlı müraciətinə baxdı və nəticəni olduğu kimi qüvvədə saxladı. {from} tərəfindən elan edilmiş qələbə təsdiqlənir. Bağlantı ilə bağlı iddia yoxlanıldı və nəticəyə təsiri müəyyən edilmədi.',
  powers: 'Oyunun hesabı olduğu kimi qüvvədə qalır.\nQələbə rəsmi qeydə alınır və arxivdə saxlanılır.\nTəkrar oyun tələbi təmin edilmir.\nQol sevincinin videosu paylaşıla bilər.',
  penalty: 'Nəticə mübahisə edilməyə davam edildikdə növbəti üç matçda komanda seçimi qalib tərəfin ixtiyarına keçir.'
},
{
  id: 'r-qebul-viral', cat: 'c-qebul', tone: 'zarafat', layout: 'sertifikat', palette: 'gold',
  replyKind: 'qebul', replyCats: ['viral'], regPrefix: 'QVD',
  title: 'Ekspertiza Rəyinin Təsdiqi Sertifikatı', tag: 'Viral cavab',
  powersLabel: 'TƏSDİQLƏNƏN ŞƏRTLƏR',
  signOrg: 'Bəhanələrin Ekspertizası üzrə Ali Komissiya',
  preamble: 'Komissiya {to} adlı şəxs barəsində verilmiş rəyi yenidən araşdırdı və onu qüvvədə saxladı. {from} tərəfindən təqdim edilmiş etirazda göstərilən arqumentlər ölçmə nəticələrini dəyişdirmədi. Rəy ilkin redaksiyada təsdiqlənir.',
  powers: 'Rəydə göstərilən bal və faizlər dəyişdirilmir.\nÖlçmə metodikası düzgün tətbiq edilmiş hesab olunur.\nRəy istinad sənədi kimi istifadə edilə bilər.\nTəkrar ekspertiza üçün yeni müraciət qəbul edilmir.',
  penalty: 'Rəyə etiraz davam etdikdə növbəti ekspertizanın bütün şərtlərini rəyi təqdim edən tərəf müəyyən edir.'
},
{
  id: 'r-qebul-umumi', cat: 'c-qebul', tone: 'zarafat', layout: 'sertifikat', palette: 'gold',
  replyKind: 'qebul', regPrefix: 'QVD',
  title: 'Sənədin Qüvvədə Saxlanılması Qərarı', tag: 'Universal',
  powersLabel: 'TƏSDİQLƏNƏN ŞƏRTLƏR',
  signOrg: 'Sənədlərə Etirazlar üzrə Ali Apellyasiya Şurası',
  preamble: 'Şura {to} adlı şəxs tərəfindən tərtib edilmiş sənədə baxdı və onu tam həcmdə qüvvədə saxladı. {from} tərəfindən bildirilən etirazda göstərilən əsaslar sənədin məzmunu ilə təsdiqlənmədi. Sənəd ilkin redaksiyada qalır.',
  powers: 'Sənəd tam həcmdə qüvvədə saxlanılır.\nBütün bəndlər ilkin redaksiyada qalır.\nSənədin müddəti uzadılmır və qısaldılmır.\nEyni əsaslarla yeni etiraz 30 gün ərzində qəbul edilmir.',
  penalty: 'Təsdiqlənmiş sənədin şərtləri pozulduqda mövzunun növbəti müzakirəsinin yerini və vaxtını sənəd sahibi müəyyən edir.'
},

/* ==================== 💌 XATİRƏ CAVABI ====================
   tone: xatire · palette: rose · prefiks: XCV
   Rədd və etiraz yoxdur: xatirə tonunda cavab da səmimidir. */
{
  id: 'r-xatire-tesekkur', cat: 'c-xatire', tone: 'xatire', layout: 'diplom', palette: 'rose',
  replyKind: 'xatire', regPrefix: 'XCV',
  title: 'Təşəkkür Cavabı', tag: 'Ən çox seçilən',
  powersLabel: 'TƏŞƏKKÜRÜN SƏBƏBLƏRİ',
  signOrg: 'Xatirələrin Qeydiyyatı üzrə Səmimi Şura',
  preamble: 'Bu sənədlə {to} adlı şəxs {from} tərəfindən verilmiş xatirə sənədini aldığını və oxuduğunu təsdiq edir. Yazılanlar gözlənilməz oldu, bir neçə dəfə təkrar oxundu və saxlanılmaq üçün kənara qoyuldu. Cavab olaraq bu təşəkkür sənədi tərtib edilir.',
  powers: 'Sənəd oxundu və qəbul edildi.\nYazılanların səmimiliyinə heç bir şübhə bildirilmir.\nSənəd saxlanılacaq və illər sonra yenidən oxunacaq.\nBu təşəkkür qarşılıqlı və müddətsizdir.',
  penalty: 'Bu sənəd heç bir öhdəlik yaratmır. Yeganə xahiş — belə sənədləri yazmağa davam etməkdir.'
},
{
  id: 'r-xatire-qebul', cat: 'c-xatire', tone: 'xatire', layout: 'sertifikat', palette: 'rose',
  replyKind: 'xatire', regPrefix: 'XCV',
  title: 'Qəbul Edildi Sertifikatı', tag: 'Qısa cavab',
  powersLabel: 'QƏBULUN ŞƏRTLƏRİ',
  signOrg: 'Səmimi Bəyanatların Qeydiyyatı üzrə Palata',
  preamble: 'Bu sertifikat {from} tərəfindən {to} adlı şəxsə ünvanlanmış sənədin qəbul edildiyini təsdiq edir. Sənədin məzmunu ilə tam razılıq bildirilir, əlavə şərt irəli sürülmür və heç bir bəndə etiraz edilmir.',
  powers: 'Sənədin bütün bəndləri qəbul edilir.\nHeç bir bəndə etiraz bildirilmir.\nƏlavə şərt irəli sürülmür.\nQəbul geri götürülmür.',
  penalty: 'Bu sertifikat müddətsizdir. Yalnız bir şərt var: sənədin əsli çərçivəyə salınıb görünən yerdə saxlanılmalıdır.'
},
{
  id: 'r-xatire-qarsiliqli', cat: 'c-xatire', tone: 'xatire', layout: 'notarial', palette: 'rose',
  replyKind: 'xatire', regPrefix: 'XCV',
  title: 'Qarşılıqlı Etirafnamə', tag: 'Cavab etirafı',
  powersLabel: 'QARŞILIQLI ETİRAFLAR',
  signOrg: 'Qarşılıqlı Etirafların Təsdiqi üzrə Şura',
  preamble: '{to} adlı şəxs {from} tərəfindən verilmiş etirafnaməyə cavab olaraq bildirir ki, orada yazılanların hamısı qarşılıqlıdır. Bu sənəd həmin sözlərin eyni ilə, eyni səmimiliklə geri qaytarıldığını təsdiq edir və əvvəlki sənədin ayrılmaz hissəsi sayılır.',
  powers: 'Əvvəlki sənəddə yazılanların hamısı qarşılıqlı hesab olunur.\nHər iki sənəd birlikdə saxlanılır.\nSözlər geri götürülmür və dəyişdirilmir.\nSənəd illər sonra yenidən oxunmaq üçün verilir.',
  penalty: 'Bu sənədin qüvvədə olması üçün heç bir şərt yoxdur. O, yazıldığı gündən etibarən müddətsizdir.'
},
{
  id: 'r-xatire-tesdiq', cat: 'c-xatire', tone: 'xatire', layout: 'arayis', palette: 'rose',
  replyKind: 'xatire', regPrefix: 'XCV',
  title: 'Xatirənin Təsdiqi Arayışı', tag: 'Birlikdə xatırlanan',
  powersLabel: 'TƏSDİQLƏNƏN XATİRƏLƏR',
  signOrg: 'Ortaq Xatirələrin Qeydiyyatı üzrə Baş İdarə',
  preamble: 'Bu arayış {to} adlı şəxsin {from} tərəfindən təqdim edilmiş sənəddə göstərilən hadisələri təsdiq etdiyini bildirir. Hadisələr həqiqətən baş vermiş, tarixlər düzgün göstərilmiş, təfərrüatlar isə hər iki tərəfin yaddaşında eyni cür qalmışdır.',
  powers: 'Sənəddə göstərilən hadisələr təsdiq edilir.\nTarixlər və təfərrüatlar düzgün hesab olunur.\nXatirə hər iki tərəfin arxivinə daxil edilir.\nƏlavə şahid tələb olunmur.',
  penalty: 'Bu arayış heç bir öhdəlik yaratmır. Şərt yalnız odur ki, xatirə hər il ən azı bir dəfə xatırlansın.'
},
{
  id: 'r-xatire-mektub', cat: 'c-xatire', tone: 'xatire', layout: 'teleqram', palette: 'rose',
  replyKind: 'xatire', regPrefix: 'XCV',
  title: 'Cavab Məktubu', tag: 'Teleqram formasında',
  signOrg: 'Səmimi Məktubların Çatdırılması üzrə İdarə',
  preamble: '{from} tərəfindən göndərilmiş sənəd {to} adlı şəxsə çatdırıldı və eyni gün cavablandırıldı. Cavab qısadır, çünki deyiləsi hər şey artıq bir dəfə deyilmişdir. Bu məktub yalnız onu təsdiq edir ki, sözlər ünvanına çatdı.',
  powers: 'Sənəd çatdırıldı və oxundu.\nCavab eyni gün, gecikdirilmədən verildi.\nSözlər ünvanına çatdı və orada qaldı.\nMəktubun surəti hər iki tərəfdə saxlanılır.',
  penalty: 'Məktub müddətsizdir. Geri qaytarılmır, düzəliş edilmir və başqa formada təkrar göndərilmir.'
},
{
  id: 'r-xatire-ohdelik', cat: 'c-xatire', tone: 'xatire', layout: 'muqavile', palette: 'rose',
  replyKind: 'xatire', regPrefix: 'XCV',
  title: 'Öhdəliyin Qəbulu Haqqında Sənəd', tag: 'Qarşılıqlı söz',
  powersLabel: 'QƏBUL EDİLƏN ÖHDƏLİKLƏR',
  signOrg: 'Verilmiş Sözlərin Qeydiyyatı üzrə Palata',
  preamble: 'Bu sənədlə {to} adlı şəxs {from} tərəfindən təqdim edilmiş sənəddəki öhdəlikləri qəbul etdiyini və eyni öhdəlikləri öz üzərinə götürdüyünü bildirir. Öhdəliklər könüllü qaydada, heç bir təzyiq olmadan qəbul edilir.',
  powers: 'Sənəddə göstərilən öhdəliklər tam qəbul edilir.\nEyni öhdəliklər qarşı tərəf üçün də qüvvəyə minir.\nÖhdəliklərin müddəti göstərilmir — deməli müddətsizdir.\nSənəd hər iki tərəfdə bir nüsxə saxlanılır.',
  penalty: 'Öhdəliklərin pozulması halında nəzərdə tutulan yeganə nəticə budur: mövzu açıq danışılır və sənəd yenidən yazılır.'
},

];
