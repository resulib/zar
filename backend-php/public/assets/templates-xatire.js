/* ==================================================================
   Xatirə Sənədləri Palatası — səmimi şablon kitabxanası
   72 şablon · 6 kateqoriya · 10 dizayn · 6 palitra · tone: 'xatire'

   Bu fayl templates.js-dən SONRA yüklənməlidir — kataloqa əlavə edir,
   onu əvəz etmir. Rəsmi quruluş eynidir, yalnız sözlər yumşaqdır:
   möhür, imza, qeydiyyat nömrəsi və QR yerində qalır.
   ================================================================== */
window.CATEGORIES.push(
  { id: 'x-love',      tone: 'xatire', name: 'Sevgi',     icon: '♥', blurb: 'Etiraf, təklif, ildönümü — saxlanılası sənədlər.' },
  { id: 'x-thanks',    tone: 'xatire', name: 'Təşəkkür',  icon: '✎', blurb: 'Minnətdarlıq, fəxri fərman, tərif.' },
  { id: 'x-milestone', tone: 'xatire', name: 'Mərhələ',   icon: '✦', blurb: 'Məzuniyyət, ilk addım, nailiyyət.' },
  { id: 'x-bonds',     tone: 'xatire', name: 'Dostluq',   icon: '❋', blurb: 'Uzunillik dostluğun səmimi qeydi.' },
  { id: 'x-family',    tone: 'xatire', name: 'Ailə',      icon: '⌂', blurb: 'Valideynlər, nənə-baba, bacı-qardaş.' },
  { id: 'x-greetings', tone: 'xatire', name: 'Təbriklər', icon: '✧', blurb: 'Ad günü, yubiley, bayram təbrikləri.' }
);

window.TEMPLATES.push(

/* ==================== SEVGİ ==================== */
{
  id: 'sevgi-etirafnamesi', cat: 'x-love', tone: 'xatire', layout: 'notarial', palette: 'rose',
  title: 'Sevgi Etirafnaməsi', tag: 'Ən çox seçilən',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'SON SÖZ',
  preamble: 'Bu sənədlə təsdiq olunur ki, {from} tərəfindən {to} adlı şəxsə uzun müddət söylənilməmiş, lakin heç vaxt azalmamış bir hiss rəsmi qaydada bəyan olunur. Etiraf könüllüdür, şahid tələb etmir və geri götürülmür.',
  powers: 'Səhər oyananda ilk düşünülən ad dəyişməyib.\nSusmaq da rahatdır — söhbət olmasa da yer isti qalır.\nUzaq şəhərlər yaxınlığı azaltmadı.\nSevinc bölüşəndə böyüyür, qayğı bölüşəndə kiçilir.',
  penalty: 'Bu sənəd illər sonra təsadüfən tapılanda eyni sözlərin yenidən deyilməsi şərti ilə qüvvədə qalır.'
},
{
  id: 'evlilik-teklifi', cat: 'x-love', tone: 'xatire', layout: 'diplom', palette: 'burgundy',
  title: 'Evlilik Təklifi Sənədi', tag: 'Böyük an',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'SON SÖZ',
  preamble: 'Bu sənədlə {from} tərəfindən {to} adlı şəxsə ömrün qalan hissəsini birlikdə keçirmək təklifi rəsmi qaydada təqdim olunur. Təklif düşünülmüş, tələsik olmayan və tam səmimi hesab olunur.',
  powers: 'Birgə keçən illər tələsik qərar üçün yer qoymadı.\nÇətin günlərdə tərəflərin heç biri geri çəkilmədi.\nGələcək planları illərdir eyni cümlə ilə başlayır.\nCavab nə olursa olsun, sual verilməyə dəyərdi.',
  penalty: 'Müsbət cavab halında bu sənəd ailə arxivinin ilk vərəqi kimi saxlanılır və ildönümlərində yenidən oxunur.'
},
{
  id: 'ildonumu-sehadetnamesi', cat: 'x-love', tone: 'xatire', layout: 'sertifikat', palette: 'rose',
  title: 'İldönümü Xatirə Şəhadətnaməsi', tag: 'İldönümü',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'SON SÖZ',
  preamble: 'Bu şəhadətnamə ilə təsdiq olunur ki, {from} və {to} arasındakı birgə yol növbəti ilini tamamlamışdır. Keçən müddət heç bir tərəf üçün itirilmiş sayılmır.',
  powers: 'Bir il daha yan-yana, eyni masa arxasında.\nMübahisələr axşama qədər davam etmədi.\nSevinc xəbərləri həmişə birinci bir-birinə çatdırıldı.\nEv sözü hər ikisi üçün eyni mənanı saxladı.',
  penalty: 'Şəhadətnamə hər il yenilənməlidir — yeniləmə qaydası sadədir: birlikdə bir gün də qalmaq.'
},
{
  id: 'seni-secirem', cat: 'x-love', tone: 'xatire', layout: 'blank', palette: 'burgundy',
  title: '«Səni Seçirəm» Bəyannaməsi', tag: 'Bəyannamə',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'SON SÖZ',
  preamble: 'Bu bəyannamə ilə {from} bildirir ki, {to} adlı şəxsi bir dəfə deyil, hər gün yenidən seçir. Seçim vərdişdən deyil, düşünülmüş qərardan doğur və müddətlə məhdudlaşdırılmır.',
  powers: 'Seçim yorğun günlərdə də dəyişmir.\nDaha rahat variant axtarılmadı və axtarılmayacaq.\nBaşqalarının rəyi bu qərara heç vaxt daxil edilmədi.\nSabah da eyni ad yazılacaq.',
  penalty: 'Bəyannamə müddətsizdir. Ləğvi yalnız hər iki tərəfin razılığı ilə mümkündür, indiyədək belə bir müraciət olmayıb.'
},
{
  id: 'ilk-gorus-qeydi', cat: 'x-love', tone: 'xatire', layout: 'notarial', palette: 'gold',
  title: 'İlk Görüşün Xatirə Qeydi', tag: 'Başlanğıc',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'SON SÖZ',
  preamble: 'Bu qeyd ilə {from} və {to} arasındakı ilk görüşün tarixi, yeri və o günün əhvalı rəsmi qaydada arxivə salınır. Xırda təfərrüatlar unudulmasın deyə yazıya alınmışdır.',
  powers: 'O gün nə deyiləcəyi əvvəlcədən düşünülmüşdü, heç biri deyilmədi.\nSöhbət planlaşdırılandan xeyli uzun sürdü.\nAyrılarkən hər ikisi geri baxdı.\nHəmin axşam telefon uzun müddət əldən yerə qoyulmadı.',
  penalty: 'Qeyd arxivdən çıxarıla bilməz. İllər sonra oxunduqda eyni günün xatirəsi bərpa olunmuş sayılır.'
},
{
  id: 'birge-gelecek', cat: 'x-love', tone: 'xatire', layout: 'diplom', palette: 'gold',
  title: 'Birgə Gələcək Bəyannaməsi', tag: 'Gələcək',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'SON SÖZ',
  preamble: 'Bu bəyannamə ilə {from} və {to} gələcəyə aid planlarını ayrı deyil, birgə qurduqlarını təsdiq edirlər. Sənəd tərəflərin öz iradəsi ilə, kənar təsir olmadan hazırlanmışdır.',
  powers: 'Bütün planlar cəm halında qurulur.\nBöyük qərarlar məsləhətləşmədən verilmir.\nBirinin arzusu digərinin cədvəlinə yazılır.\nUzaq şəhər təklifi yalnız birlikdə nəzərdən keçirilir.',
  penalty: 'Bəyannamə hər yeni mərhələdə könüllü şəkildə təsdiqlənir və ailə arxivində saxlanılır.'
},
{
  id: 'sevgi-etimad-karti', cat: 'x-love', tone: 'xatire', layout: 'lisenziya', palette: 'steel',
  title: 'Sevgi Etimad Kartı', tag: 'Etimad',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'SON SÖZ',
  preamble: 'Bu kart {from} tərəfindən {to} adlı şəxsə tam etimadın nişanəsi kimi verilir. Etimad müddətlə məhdudlaşdırılmır və hər hansı yoxlama tələb etmir.',
  powers: 'Deyilən sözə izahat tələb olunmur.\nGecikməyə səbəb soruşulmadan qəbul edilir.\nSirlər üçüncü şəxsə çatmadı və çatmayacaq.\nÇətin xəbər də birinci bu ünvana deyilir.',
  penalty: 'Kart itirilə bilər, etimad isə yox. Sənədin surəti tələb olunmadan bərpa edilir.'
},
{
  id: 'sevgi-arayisi', cat: 'x-love', tone: 'xatire', layout: 'arayis', palette: 'forest',
  title: 'Səmimi Hisslər Haqqında Arayış', tag: 'Arayış',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'SON SÖZ',
  preamble: 'Arayış {to} adlı şəxsə ona bəslənən hisslərin real, davamlı və dəyişməz olduğunu təsdiq etmək üçün {from} tərəfindən verilir. Təqdim olunduğu yerdən asılı olmayaraq qüvvədədir.',
  powers: 'Hisslər müşahidə dövrü boyunca azalmayıb.\nUzun ayrılıqlar göstəricini dəyişməyib.\nGündəlik qayğılar onu kölgədə qoymayıb.\nİllər ötdükcə yalnız sakitləşib, yox olmayıb.',
  penalty: 'Arayış təkrar müraciət tələb etmir. Şübhə yaranarsa, sadəcə yenidən soruşmaq kifayətdir.'
},
{
  id: 'barisiq-qerari', cat: 'x-love', tone: 'xatire', layout: 'qerar', palette: 'ink',
  title: 'Barışıq Qərarı', tag: 'Barışıq',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'SON SÖZ',
  preamble: 'Baxılan müraciət üzrə müəyyən edildi ki, {from} və {to} arasındakı mübahisənin mövzusu artıq əhəmiyyətini itirmişdir. Tərəflərin hər ikisi barışığın xeyrinə olduğunu bildirmişdir.',
  powers: 'Mübahisənin səbəbi bir həftə sonra xatırlanmadı.\nHər iki tərəf öz payına düşən sözü geri götürdü.\nSusqunluq dövrü hər ikisinə ağır gəldi.\nBarışıq könüllüdür, təzyiq altında qəbul edilməyib.',
  penalty: 'Qərar dərhal qüvvəyə minir. Eyni mövzuya yenidən qayıtmaq məsləhət görülmür.'
},
{
  id: 'birge-heyat-sazisi', cat: 'x-love', tone: 'xatire', layout: 'muqavile', palette: 'burgundy',
  title: 'Birgə Həyat Sazişi', tag: 'Saziş',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'SON SÖZ',
  preamble: 'Bu saziş {from} və {to} arasında bağlanır və birgə həyatın gündəlik qaydalarını səmimi şəkildə qeydə alır. Saziş məcburiyyətdən deyil, qarşılıqlı istəkdən doğur.',
  powers: 'Səhər çayı hər gün növbə ilə hazırlanır.\nAğır gün keçirən tərəf sual verilmədən dinlənilir.\nUzun səfərlərdən əliboş qayıdılmır.\nBayram süfrəsi birlikdə qurulur.',
  penalty: 'Saziş müddətsizdir və hər il yalnız yeni bənd əlavə etməklə dəyişdirilir; bənd çıxarılması nəzərdə tutulmayıb.'
},
{
  id: 'sevgi-teleqrami', cat: 'x-love', tone: 'xatire', layout: 'teleqram', palette: 'rose',
  title: 'Sevgi Teleqramı', tag: 'Qısa mesaj',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'SON SÖZ',
  preamble: 'Təcili çatdırılır. {from} tərəfindən {to} adlı şəxsə ünvanlanmışdır. Mətn qısadır, çünki deyiləcək söz uzun izahat tələb etmir. Çatdırılma təcili qaydada, növbədənkənar aparılmışdır.',
  powers: 'Səni düşünürəm nöqtə\nUzaqlıq müvəqqətidir nöqtə\nQayıdanda hər şey danışılacaq nöqtə\nGözlə nöqtə',
  penalty: 'Teleqram cavab tələb etmir, lakin gələn cavab eyni gün arxivə salınacaq.'
},
{
  id: 'birge-heyat-vesiqesi', cat: 'x-love', tone: 'xatire', layout: 'vesiqe', palette: 'gold',
  title: 'Birgə Həyat Vəsiqəsi', tag: 'Vəsiqə',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'SON SÖZ',
  preamble: 'Vəsiqə {to} adlı şəxsə {from} tərəfindən verilir və birgə həyatın rəsmi olmayan, lakin real qeydiyyatını təsdiq edir. Sənəd daşıyıcının cibində deyil, yaddaşında saxlanılır.',
  powers: 'Qeydiyyat ünvanı: eyni ev, eyni mətbəx.\nDaimi yoldaş statusu təsdiqlənib.\nMüddət: müəyyən edilməyib.\nƏlavə qeyd: yenilənməyə ehtiyac yoxdur.',
  penalty: 'Vəsiqə itirildikdə bərpa üçün müraciət lazım deyil — sahibi onsuz da tanınır.'
},

/* ==================== TƏŞƏKKÜR ==================== */
{
  id: 'tesekkurname', cat: 'x-thanks', tone: 'xatire', layout: 'blank', palette: 'steel',
  title: 'Təşəkkürnamə', tag: 'Klassik',
  toLabel: 'TƏLTİF OLUNAN', fromLabel: 'TƏQDİM EDƏN', powersLabel: 'XİDMƏTLƏR', penaltyLabel: 'QEYD',
  preamble: 'Bu təşəkkürnamə {from} tərəfindən {to} adlı şəxsə göstərdiyi köməyə görə təqdim olunur. Kömək tələb olunmadan, qarşılıq gözlənilmədən göstərilmişdir.',
  powers: 'Ən çətin gündə heç bir sual vermədən yanında oldu.\nÖz işini kənara qoyub vaxt ayırdı.\nVerilən sözü axıra qədər gözlədi.\nKöməyini heç vaxt xatırlatmadı.',
  penalty: 'Təşəkkür gecikmiş sayılmır. Bu sənəd deyilməli olan sözün yazılı formasıdır.'
},
{
  id: 'fexri-ferman', cat: 'x-thanks', tone: 'xatire', layout: 'diplom', palette: 'burgundy',
  title: 'Fəxri Fərman', tag: 'Təltif',
  toLabel: 'TƏLTİF OLUNAN', fromLabel: 'TƏQDİM EDƏN', powersLabel: 'XİDMƏTLƏR', penaltyLabel: 'QEYD',
  preamble: 'Fəxri Fərman {to} adlı şəxsə uzun illər ərzində göstərdiyi vicdanlı əməyə və səmimi münasibətə görə {from} tərəfindən təqdim olunur. Təltif üçün əsaslar uzun müddət toplanmış və mübahisəsiz hesab edilmişdir.',
  powers: 'İşini heç vaxt yarımçıq qoymadı.\nBaşqasının səhvini üzərinə götürməkdən çəkinmədi.\nTərif gözləmədən çalışdı.\nƏtrafındakılar üçün nümunə oldu.',
  penalty: 'Fərman ictimai qaydada oxunmalı və çərçivəyə salınmalıdır. Divarda görünən yerə asılması tövsiyə olunur.'
},
{
  id: 'muellime-minnetdarliq', cat: 'x-thanks', tone: 'xatire', layout: 'notarial', palette: 'forest',
  title: 'Müəllimə Minnətdarlıq Məktubu', tag: 'Müəllim',
  toLabel: 'TƏLTİF OLUNAN', fromLabel: 'TƏQDİM EDƏN', powersLabel: 'XİDMƏTLƏR', penaltyLabel: 'QEYD',
  preamble: 'Bu məktub {from} tərəfindən müəllim {to} adlı şəxsə ünvanlanır. Sinifdə deyilən bəzi sözlərin illər sonra da xatırlandığı bununla təsdiq olunur.',
  powers: 'Sualı təkrar soruşmağa utandırmadı.\nZəif nəticəni deyil, səyi qiymətləndirdi.\nDərsdən sonra da vaxt ayırdı.\nBir cümləsi peşə seçimini dəyişdirdi.',
  penalty: 'Minnətdarlıq müddətsizdir. Bu sənəd məzun olduqdan illər sonra da qüvvəsini saxlayır.'
},
{
  id: 'ilin-anasi', cat: 'x-thanks', tone: 'xatire', layout: 'diplom', palette: 'rose',
  title: '«İlin Anası» Fəxri Fərmanı', tag: 'Ana',
  toLabel: 'TƏLTİF OLUNAN', fromLabel: 'TƏQDİM EDƏN', powersLabel: 'XİDMƏTLƏR', penaltyLabel: 'QEYD',
  preamble: 'Bu fərman {to} adlı şəxsə göstərdiyi qayğıya, səbrə və heç vaxt hesablanmayan əməyə görə {from} tərəfindən təqdim olunur. Seçim yekdilliklə aparılmışdır.',
  powers: 'Yuxusuz gecələr heç vaxt sayılmadı.\nƏn yaxşı tikə həmişə başqasına verildi.\nNarahatlıq gizlədildi, sevinc bölüşüldü.\nQapı hər zaman açıq qaldı.',
  penalty: 'Fərman hər il avtomatik olaraq təsdiqlənir. Namizədliyin yenidən baxılması nəzərdə tutulmayıb.'
},
{
  id: 'hekime-minnetdarliq', cat: 'x-thanks', tone: 'xatire', layout: 'sertifikat', palette: 'steel',
  title: 'Həkimə Minnətdarlıq Sənədi', tag: 'Həkim',
  toLabel: 'TƏLTİF OLUNAN', fromLabel: 'TƏQDİM EDƏN', powersLabel: 'XİDMƏTLƏR', penaltyLabel: 'QEYD',
  preamble: 'Bu sənəd həkim {to} adlı şəxsə {from} tərəfindən göstərdiyi peşəkar köməyə və insani münasibətə görə təqdim olunur. Sənəd ən çətin günlərin yaddaşda qaldığını rəsmi qaydada təsdiq edir.',
  powers: 'Narahatlığı azaltmaq üçün əlavə vaxt ayırdı.\nİzahatı sadə və aydın verdi.\nAğır xəbəri insan kimi çatdırdı.\nNövbədən sonra da telefonu cavabsız qoymadı.',
  penalty: 'Sənəd hesabat tələb etmir. Yeganə istəyi: eyni münasibətin davam etməsidir.'
},
{
  id: 'komandaya-tesekkur', cat: 'x-thanks', tone: 'xatire', layout: 'sertifikat', palette: 'forest',
  title: 'Komandaya Təşəkkür Sertifikatı', tag: 'Komanda',
  toLabel: 'TƏLTİF OLUNAN', fromLabel: 'TƏQDİM EDƏN', powersLabel: 'XİDMƏTLƏR', penaltyLabel: 'QEYD',
  preamble: 'Bu sertifikat {to} adlı komandaya {from} tərəfindən çətin dövrdə göstərdiyi birliyə və dözümə görə təqdim olunur. Nəticə hər kəsin payı ilə əldə edilmişdir.',
  powers: 'Son həftə heç kim işi yarımçıq qoymadı.\nSəhvlər axtarılmadı, düzəldildi.\nUğur şəxsi deyil, ümumi sayıldı.\nGecikən həmkar tək qalmadı.',
  penalty: 'Sertifikat ümumi otaqda saxlanılır. Nüsxə tələb edən hər kəsə verilir.'
},
{
  id: 'ustadliq-lisenziyasi', cat: 'x-thanks', tone: 'xatire', layout: 'lisenziya', palette: 'gold',
  title: 'Ustadlıq Lisenziyası', tag: 'Ustad',
  toLabel: 'TƏLTİF OLUNAN', fromLabel: 'TƏQDİM EDƏN', powersLabel: 'XİDMƏTLƏR', penaltyLabel: 'QEYD',
  preamble: 'Bu lisenziya {to} adlı şəxsə öz işini başqasına öyrətmək bacarığına görə {from} tərəfindən verilir. Sənəd imtahan nəticəsinə deyil, illərin təcrübəsinə əsaslanır.',
  powers: 'Bildiyini gizlətmədi, öyrətdi.\nSəhv edəni utandırmadan düzəltdi.\nÖz üsulunu tələb etmədi, seçim buraxdı.\nŞagirdinin uğuruna öz uğuru kimi sevindi.',
  penalty: 'Lisenziya müddətsizdir. Yeganə şərt: öyrədilənin də bir gün kimisə öyrətməsidir.'
},
{
  id: 'xidmetler-arayisi', cat: 'x-thanks', tone: 'xatire', layout: 'arayis', palette: 'ink',
  title: 'Göstərilən Kömək Haqqında Arayış', tag: 'Arayış',
  toLabel: 'TƏLTİF OLUNAN', fromLabel: 'TƏQDİM EDƏN', powersLabel: 'XİDMƏTLƏR', penaltyLabel: 'QEYD',
  preamble: 'Arayış {to} adlı şəxsə {from} tərəfindən verilir və göstərilən köməyin real, vaxtında və əvəzsiz olduğunu təsdiq edir. Təqdim olunduğu yerdən asılı olmayaraq qüvvədədir.',
  powers: 'Kömək xahiş edilmədən təklif olundu.\nHeç bir mərhələdə qarşılıq gözlənilmədi.\nVəziyyət çətinləşəndə geri çəkilmə olmadı.\nİş bitəndən sonra da soruşub hal-əhval tutuldu.',
  penalty: 'Arayışın etibarlılıq müddəti göstərilmir. Xatırlanma müddəti isə ömürlük müəyyən edilmişdir.'
},
{
  id: 'teltif-qerari', cat: 'x-thanks', tone: 'xatire', layout: 'qerar', palette: 'gold',
  title: 'Təltif Haqqında Qərar', tag: 'Qərar',
  toLabel: 'TƏLTİF OLUNAN', fromLabel: 'TƏQDİM EDƏN', powersLabel: 'XİDMƏTLƏR', penaltyLabel: 'QEYD',
  preamble: 'Baxılan müraciət üzrə müəyyən edildi ki, {to} adlı şəxs göstərdiyi əməyə görə təltifə layiqdir. Qərar {from} tərəfindən təqdim olunan əsaslara istinadən qəbul edilmişdir.',
  powers: 'Əmək uzun müddət diqqətdən kənarda qaldı.\nHeç bir mərhələdə şikayət səsləndirilmədi.\nNəticə göz qabağındadır və mübahisə doğurmur.\nƏtrafdakıların rəyi yekdildir.',
  penalty: 'Qərar elan olunduğu andan qüvvəyə minir və yenidən baxılmaya təqdim olunmur.'
},
{
  id: 'minnetdarliq-sazisi', cat: 'x-thanks', tone: 'xatire', layout: 'muqavile', palette: 'rose',
  title: 'Minnətdarlıq Sazişi', tag: 'Saziş',
  toLabel: 'TƏLTİF OLUNAN', fromLabel: 'TƏQDİM EDƏN', powersLabel: 'XİDMƏTLƏR', penaltyLabel: 'QEYD',
  preamble: 'Bu saziş {from} və {to} arasında bağlanır və göstərilən köməyin qarşılıqlı olaraq unudulmayacağını qeydə alır. Tərəflər borc münasibətinin olmadığını təsdiq edirlər.',
  powers: 'Kömək istənilən vaxt, izahatsız göstərilir.\nGecə yarısı zəngi cavabsız qalmır.\nÇətin xəbər əvvəlcə bir-birinə deyilir.\nHesab aparılmır, sayğac yoxdur.',
  penalty: 'Saziş müddətsizdir. Ləğvi üçün əsas kimi yalnız unutqanlıq göstərilə bilər, o da qəbul edilmir.'
},
{
  id: 'tesekkur-teleqrami', cat: 'x-thanks', tone: 'xatire', layout: 'teleqram', palette: 'burgundy',
  title: 'Təşəkkür Teleqramı', tag: 'Qısa mesaj',
  toLabel: 'TƏLTİF OLUNAN', fromLabel: 'TƏQDİM EDƏN', powersLabel: 'XİDMƏTLƏR', penaltyLabel: 'QEYD',
  preamble: 'Təcili çatdırılır. {from} tərəfindən {to} adlı şəxsə ünvanlanmışdır. Mətn qısadır, minnətdarlıq isə deyil. Sözün uzunu şəxsən deyiləcək, teleqram isə yalnız gecikməmək üçün göndərilir.',
  powers: 'Köməyin çatdı nöqtə\nVaxtında oldu nöqtə\nUnudulmayacaq nöqtə\nBorclu qaldım nöqtə',
  penalty: 'Teleqram cavab tələb etmir. Göstərilən köməyin qarşılığı ilk imkanda ödəniləcək.'
},
{
  id: 'fexri-uzv-vesiqesi', cat: 'x-thanks', tone: 'xatire', layout: 'vesiqe', palette: 'ink',
  title: 'Fəxri Üzv Vəsiqəsi', tag: 'Vəsiqə',
  toLabel: 'TƏLTİF OLUNAN', fromLabel: 'TƏQDİM EDƏN', powersLabel: 'XİDMƏTLƏR', penaltyLabel: 'QEYD',
  preamble: 'Vəsiqə {to} adlı şəxsə {from} tərəfindən verilir və onun fəxri üzv statusunu təsdiq edir. Status göstərilən xidmətlərə görə müddətsiz olaraq təyin edilmişdir.',
  powers: 'Statusun əsası: uzunmüddətli dəstək.\nÜzvlük haqqı alınmır.\nGiriş bütün qapılardan sərbəstdir.\nStatusun ləğvi qaydası nəzərdə tutulmayıb.',
  penalty: 'Vəsiqə şəxsidir və başqasına ötürülmür. Sahibinin adı siyahıdan silinmir.'
},

/* ==================== MƏRHƏLƏ ==================== */
{
  id: 'mezuniyyet-diplomu', cat: 'x-milestone', tone: 'xatire', layout: 'diplom', palette: 'gold',
  title: 'Məzuniyyət Xatirə Diplomu', tag: 'Məzuniyyət',
  toLabel: 'SƏNƏD SAHİBİ', fromLabel: 'TƏQDİM EDƏN', powersLabel: 'QEYDƏ ALINAN', penaltyLabel: 'ARZU',
  preamble: 'Bu diplom {to} adlı şəxsə uzun və çətin bir mərhələni başa vurduğuna görə {from} tərəfindən təqdim olunur. Yol asan olmadı, buna görə də daha qiymətlidir.',
  powers: 'İlk il tərk etmək fikri bir neçə dəfə yarandı.\nGecə hazırlıqları saya gəlmir.\nƏn çətin imtahan ikinci cəhddə verildi.\nSon gün heç kim tələsmək istəmədi.',
  penalty: 'Bundan sonrakı yolda da eyni inad qorunsun; diplom yalnız bir mərhələnin sonudur.'
},
{
  id: 'ilk-addim', cat: 'x-milestone', tone: 'xatire', layout: 'sertifikat', palette: 'rose',
  title: 'İlk Addım Şəhadətnaməsi', tag: 'İlk addım',
  toLabel: 'SƏNƏD SAHİBİ', fromLabel: 'TƏQDİM EDƏN', powersLabel: 'QEYDƏ ALINAN', penaltyLabel: 'ARZU',
  preamble: 'Bu şəhadətnamə ilə təsdiq olunur ki, {to} adlı şəxs ilk addımını atmışdır. Hadisə {from} tərəfindən müşahidə olunmuş və dərhal qeydə alınmışdır.',
  powers: 'Addım qısa idi, məsafə isə əhəmiyyətsiz deyil.\nHamı susdu, sonra hamı birdən danışdı.\nİkinci cəhd birincidən daha inamlı oldu.\nO gün ev daha səsli qaldı.',
  penalty: 'Növbəti addımlar sayılmayacaq qədər çox olsun; bu isə birinci kimi xatırlansın.'
},
{
  id: 'verdisi-tergitme', cat: 'x-milestone', tone: 'xatire', layout: 'sertifikat', palette: 'forest',
  title: 'Vərdişi Tərgitmə Sertifikatı', tag: 'İradə',
  toLabel: 'SƏNƏD SAHİBİ', fromLabel: 'TƏQDİM EDƏN', powersLabel: 'QEYDƏ ALINAN', penaltyLabel: 'ARZU',
  preamble: 'Bu sertifikat {to} adlı şəxsə uzun illər davam edən bir vərdişdən öz iradəsi ilə imtina etdiyinə görə {from} tərəfindən təqdim olunur. Qərar bir gündə verilməyib, aylarla hazırlanıb.',
  powers: 'Qərar kənar təzyiq olmadan verildi.\nİlk həftə ən çətini oldu və keçdi.\nGeri dönüş üçün bəhanə axtarılmadı.\nƏtrafdakılar dəyişikliyi ilk gündən hiss etdi.',
  penalty: 'Bu sertifikat gözə görünən yerdə saxlanılsın — zəif anlarda oxunmaq üçün nəzərdə tutulub.'
},
{
  id: 'idman-nailiyyeti', cat: 'x-milestone', tone: 'xatire', layout: 'sertifikat', palette: 'steel',
  title: 'İdman Nailiyyəti Sənədi', tag: 'İdman',
  toLabel: 'SƏNƏD SAHİBİ', fromLabel: 'TƏQDİM EDƏN', powersLabel: 'QEYDƏ ALINAN', penaltyLabel: 'ARZU',
  preamble: 'Bu sənəd {to} adlı şəxsə göstərdiyi idman nəticəsinə və ona aparan səbrli hazırlığa görə {from} tərəfindən təqdim olunur. Nəticənin arxasında illərlə davam edən gündəlik iş dayanır.',
  powers: 'Səhər məşqləri heç bir hava şəraitində dayanmadı.\nZədədən sonra qayıdış aylarla çəkdi.\nNəticə bir gündə deyil, illərlə qazanıldı.\nUduzulan yarışlardan da nəticə çıxarıldı.',
  penalty: 'Növbəti hədəf bundan bir addım uzaqda olsun; bu sənəd isə başlanğıc nöqtəsi kimi qalsın.'
},
{
  id: 'ilk-is-gunu', cat: 'x-milestone', tone: 'xatire', layout: 'blank', palette: 'ink',
  title: 'İlk İş Günü Xatirə Sənədi', tag: 'İlk iş',
  toLabel: 'SƏNƏD SAHİBİ', fromLabel: 'TƏQDİM EDƏN', powersLabel: 'QEYDƏ ALINAN', penaltyLabel: 'ARZU',
  preamble: 'Bu sənədlə {to} adlı şəxsin ilk iş günü rəsmi qaydada arxivə salınır. Qeyd {from} tərəfindən həmin günün sonunda, təəssüratlar hələ təzə ikən tərtib edilmişdir və dəyişdirilməyə təqdim olunmur.',
  powers: 'Səhər planlaşdırılandan xeyli tez gəlindi.\nBirinci gün ad yadda saxlamaqla keçdi.\nİlk tapşırıq iki dəfə yoxlanıldı.\nAxşam evə qayıdanda yorğunluq xoş idi.',
  penalty: 'İllər sonra bu gün ən sadə günlərdən biri kimi xatırlansın; qarşıdakı yol ondan uzun olsun.'
},
{
  id: 'yeni-ev', cat: 'x-milestone', tone: 'xatire', layout: 'notarial', palette: 'gold',
  title: 'Yeni Ev Xatirə Sənədi', tag: 'Yeni ev',
  toLabel: 'SƏNƏD SAHİBİ', fromLabel: 'TƏQDİM EDƏN', powersLabel: 'QEYDƏ ALINAN', penaltyLabel: 'ARZU',
  preamble: 'Bu sənədlə {to} adlı şəxsin yeni evə köçməsi qeydə alınır. Qeyd {from} tərəfindən ilk axşamın xatirəsinə tərtib edilmişdir. Yeni ünvan bu sənədlə ailənin təqviminə salınır.',
  powers: 'İlk gecə qutuların arasında keçirildi.\nİlk çay hələ açılmamış qutunun üstündə içildi.\nQonşuluq ilk həftədə tanış oldu.\nDivarlar tez bir zamanda öz səsini tapdı.',
  penalty: 'Bu evdə söylənən ilk sözlər xoş olsun; qapısı həmişə tanışlar üçün açıq qalsın.'
},
{
  id: 'ilk-sukan-lisenziyasi', cat: 'x-milestone', tone: 'xatire', layout: 'lisenziya', palette: 'burgundy',
  title: 'İlk Sükan Xatirə Lisenziyası', tag: 'İlk sükan',
  toLabel: 'SƏNƏD SAHİBİ', fromLabel: 'TƏQDİM EDƏN', powersLabel: 'QEYDƏ ALINAN', penaltyLabel: 'ARZU',
  preamble: 'Bu lisenziya {to} adlı şəxsə ilk müstəqil sürüşünün xatirəsinə {from} tərəfindən verilir. Sənəd yol hərəkəti üçün deyil, yaddaş üçün nəzərdə tutulub.',
  powers: 'İlk manevr uzun və ehtiyatlı alındı.\nSərnişin bütün yol boyu susmağa çalışdı.\nİlk park yeri üçüncü cəhddə tapıldı.\nQayıdanda maşın diqqətlə yoxlanıldı.',
  penalty: 'Bütün yollar rahat, qayıdışlar isə vaxtında olsun. Lisenziya sürətə deyil, ehtiyata verilir.'
},
{
  id: 'nailiyyet-arayisi', cat: 'x-milestone', tone: 'xatire', layout: 'arayis', palette: 'steel',
  title: 'Nailiyyət Haqqında Arayış', tag: 'Arayış',
  toLabel: 'SƏNƏD SAHİBİ', fromLabel: 'TƏQDİM EDƏN', powersLabel: 'QEYDƏ ALINAN', penaltyLabel: 'ARZU',
  preamble: 'Arayış {to} adlı şəxsə {from} tərəfindən verilir və qeyd olunan nəticənin təsadüfi olmadığını, uzun və səbrli hazırlığın qanunauyğun davamı olduğunu təsdiq edir. Əlavə təsdiq tələb olunmur.',
  powers: 'Hazırlıq mərhələsi bir neçə il çəkdi.\nAralıq nəticələr heç kimə göstərilmədi.\nUğursuz cəhdlər dayandırmaq üçün əsas sayılmadı.\nSon nəticə gözləniləndən yüksək oldu.',
  penalty: 'Arayış təqdim olunduğu hər yerdə qüvvədədir və təsdiq üçün əlavə sənəd tələb etmir.'
},
{
  id: 'merhele-qerari', cat: 'x-milestone', tone: 'xatire', layout: 'qerar', palette: 'ink',
  title: 'Mərhələnin Tamamlanması Qərarı', tag: 'Qərar',
  toLabel: 'SƏNƏD SAHİBİ', fromLabel: 'TƏQDİM EDƏN', powersLabel: 'QEYDƏ ALINAN', penaltyLabel: 'ARZU',
  preamble: 'Baxılan müraciət üzrə müəyyən edildi ki, {to} adlı şəxsin başladığı mərhələ tam və uğurla tamamlanmışdır. Əsaslar {from} tərəfindən təqdim olunmuşdur.',
  powers: 'Başlanğıc tarixi ilə bitiş tarixi arasında uzun məsafə var.\nAradakı çətinliklər sənədə daxil edilmədi, xatirədə qaldı.\nNəticə mübahisə doğurmur.\nNövbəti mərhələ artıq başlayıb.',
  penalty: 'Qərar dərhal qüvvəyə minir. Növbəti mərhələ üçün yeni müraciət tələb olunmur.'
},
{
  id: 'yeni-baslangic-sazisi', cat: 'x-milestone', tone: 'xatire', layout: 'muqavile', palette: 'forest',
  title: 'Yeni Başlanğıc Sazişi', tag: 'Saziş',
  toLabel: 'SƏNƏD SAHİBİ', fromLabel: 'TƏQDİM EDƏN', powersLabel: 'QEYDƏ ALINAN', penaltyLabel: 'ARZU',
  preamble: 'Bu saziş {from} və {to} arasında bağlanır və yeni mərhələyə keçidin şərtlərini səmimi şəkildə qeydə alır. Keçmiş mərhələ bağlanmış hesab olunur.',
  powers: 'Köhnə səhvlər hesaba alınır, təkrarlanmır.\nYeni plan yazılı şəkildə tərtib olunub.\nDəstək hər mərhələdə davam edir.\nGeri dönüş yolu bağlanmayıb, sadəcə lazım deyil.',
  penalty: 'Saziş bir illik müddətə bağlanır və hər il avtomatik olaraq uzadılır.'
},
{
  id: 'nailiyyet-teleqrami', cat: 'x-milestone', tone: 'xatire', layout: 'teleqram', palette: 'rose',
  title: 'Nailiyyət Teleqramı', tag: 'Qısa mesaj',
  toLabel: 'SƏNƏD SAHİBİ', fromLabel: 'TƏQDİM EDƏN', powersLabel: 'QEYDƏ ALINAN', penaltyLabel: 'ARZU',
  preamble: 'Təcili çatdırılır. {from} tərəfindən {to} adlı şəxsə ünvanlanmışdır. Xəbər gözlənilirdi, buna görə də mətn qısadır. Uzun təbriklər görüş zamanı şəxsən çatdırılacaq.',
  powers: 'Alındı nöqtə\nHamı sevinir nöqtə\nBilirdik nöqtə\nDavamını gözləyirik nöqtə',
  penalty: 'Teleqram arxivə salınır və növbəti nailiyyət xəbəri gələnə qədər saxlanılır.'
},
{
  id: 'yeni-merhele-vesiqesi', cat: 'x-milestone', tone: 'xatire', layout: 'vesiqe', palette: 'burgundy',
  title: 'Yeni Mərhələ Vəsiqəsi', tag: 'Vəsiqə',
  toLabel: 'SƏNƏD SAHİBİ', fromLabel: 'TƏQDİM EDƏN', powersLabel: 'QEYDƏ ALINAN', penaltyLabel: 'ARZU',
  preamble: 'Vəsiqə {to} adlı şəxsə {from} tərəfindən verilir və onun yeni mərhələyə keçdiyini təsdiq edir. Sənəd köhnə mərhələni ləğv etmir, arxivə salır.',
  powers: 'Status: yeni mərhələ, birinci il.\nƏvvəlki mərhələ uğurla bağlanıb.\nMüddət: qarşıdakı bütün illər.\nƏlavə qeyd: geri qaytarılmır.',
  penalty: 'Vəsiqə hər yeni mərhələdə yenilənir. Köhnə nüsxələr məhv edilmir, saxlanılır.'
},

/* ==================== DOSTLUQ ==================== */
{
  id: 'dostluq-sehadetnamesi', cat: 'x-bonds', tone: 'xatire', layout: 'notarial', palette: 'gold',
  title: 'Dostluq Şəhadətnaməsi', tag: 'Klassik',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'SON SÖZ',
  preamble: 'Bu şəhadətnamə ilə təsdiq olunur ki, {from} və {to} arasındakı dostluq uzun illərdir davam edir və heç bir mərhələdə fasilə verməmişdir. Başlanğıc tarixi dəqiq bilinmir, davamı isə şübhə doğurmur.',
  powers: 'Aylarla danışmamaq münasibəti dəyişmədi.\nÇətin gündə zəng birinci ondan gəldi.\nSevinc xəbəri ən əvvəl ona deyildi.\nHeç bir mübahisə dostluğu üstələmədi.',
  penalty: 'Şəhadətnamə müddətsizdir. Yenilənməsi üçün bir telefon zəngi kifayət edir.'
},
{
  id: 'en-yaxsi-dost', cat: 'x-bonds', tone: 'xatire', layout: 'diplom', palette: 'burgundy',
  title: '«Ən Yaxşı Dost» Fəxri Fərmanı', tag: 'Təltif',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'SON SÖZ',
  preamble: 'Bu fərman {to} adlı şəxsə uzun illər ərzində göstərdiyi sarsılmaz dostluğa görə {from} tərəfindən təqdim olunur. Namizədlik müzakirə olunmadı, qərar birmənalı idi.',
  powers: 'Ən pis vəziyyətdə də gülməyə səbəb tapdı.\nHeç vaxt «mən sənə demişdim» demədi.\nKöçmək lazım olanda ilk gələn o oldu.\nSirr saxlamaq bacarığı sınaqdan keçdi.',
  penalty: 'Fərman geri alınmır. Bu ada namizədliyi yenidən baxılmaya təqdim etmək mümkün deyil.'
},
{
  id: 'uzunillik-dostluq', cat: 'x-bonds', tone: 'xatire', layout: 'sertifikat', palette: 'forest',
  title: 'Uzunillik Dostluq Nişanı', tag: 'Uzun illər',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'SON SÖZ',
  preamble: 'Bu nişan {to} adlı şəxsə {from} ilə uzun illər davam edən dostluğa görə təqdim olunur. Müddət hesablanmır, çünki başlanğıc tarixini heç biri dəqiq xatırlamır.',
  powers: 'Tanışlıq təsadüfi başladı, davamı təsadüfi olmadı.\nMəktəb, iş və şəhər dəyişdi, əlaqə dəyişmədi.\nAilələr də bir-birini tanıdı.\nOrtaq xatirələr sayı-hesabı itirdi.',
  penalty: 'Nişan hər onillikdə yenilənir. Yeniləmə mərasimi adətən uzun bir söhbətlə keçirilir.'
},
{
  id: 'hemise-yanimda', cat: 'x-bonds', tone: 'xatire', layout: 'notarial', palette: 'rose',
  title: '«Həmişə Yanımda» Minnətdarlıq Sənədi', tag: 'Dəstək',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'SON SÖZ',
  preamble: 'Bu sənəd {to} adlı şəxsə {from} tərəfindən ən çətin dövrlərdə yanında qaldığına görə təqdim olunur. Dəstək xahiş edilmədən, izahat tələb edilmədən göstərilmişdir.',
  powers: 'Gecə saatında zəng heç vaxt cavabsız qalmadı.\nSusmaq lazım olanda susdu, danışmaq lazım olanda danışdı.\nHeç bir mərhələdə nəsihət verməyə tələsmədi.\nYanında olduğunu sözlə deyil, iş ilə göstərdi.',
  penalty: 'Bu sənəd qarşılıq öhdəliyi yaratmır, lakin eyni davranış hər zaman gözlənilir.'
},
{
  id: 'dost-qrupu', cat: 'x-bonds', tone: 'xatire', layout: 'blank', palette: 'steel',
  title: 'Dost Qrupu Xatirə Sənədi', tag: 'Qrup',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'SON SÖZ',
  preamble: 'Bu sənədlə {from} tərəfindən {to} adlı qrupun uzun illər davam edən birliyi rəsmi qaydada qeydə alınır. Qrupun tərkibi ilk gündən bəri dəyişməyib və dəyişdirilməsi nəzərdə tutulmur.',
  powers: 'İllik görüş heç vaxt tam ləğv olunmadı.\nHər kəsin öz rolu var və dəyişdirilmir.\nKöhnə zarafatlar hələ də işləyir.\nBiri çətinliyə düşəndə qalanları xəbər tutur.',
  penalty: 'Sənəd qrupun bütün üzvləri üçün eyni qüvvəyə malikdir. Nüsxələr bərabər paylanır.'
},
{
  id: 'sirdas-etimadnamesi', cat: 'x-bonds', tone: 'xatire', layout: 'lisenziya', palette: 'ink',
  title: 'Sirdaş Etimadnaməsi', tag: 'Sirdaş',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'SON SÖZ',
  preamble: 'Bu etimadnamə {from} tərəfindən {to} adlı şəxsə verilir və ona tam sirdaş statusu tanıyır. Status uzun illərin sınağından sonra rəsmiləşdirilmişdir.',
  powers: 'Deyilən söz heç vaxt üçüncü şəxsə çatmadı.\nMühakimə etmədən dinləmək bacarığı təsdiqləndi.\nƏn narahat sual ondan gəldi və yerində idi.\nSusmaq lazım olan yeri dəqiq bildi.',
  penalty: 'Etimadnamə müddətsizdir və yalnız sahibinin öz istəyi ilə geri qaytarıla bilər.'
},
{
  id: 'dostluq-arayisi', cat: 'x-bonds', tone: 'xatire', layout: 'arayis', palette: 'gold',
  title: 'Dostluq Haqqında Arayış', tag: 'Arayış',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'SON SÖZ',
  preamble: 'Arayış {to} adlı şəxsə {from} tərəfindən verilir və aralarındakı dostluğun real, uzunmüddətli və şərtsiz olduğunu təsdiq edir. Təqdim olunduğu yerdən asılı olmayaraq qüvvədədir.',
  powers: 'Müşahidə dövrü: uzun illər, fasiləsiz.\nMünasibətdə maddi maraq aşkar edilməyib.\nÇətin dövrlərdə davamlılıq təsdiqlənib.\nƏtrafdakıların rəyi mübahisə doğurmur.',
  penalty: 'Arayışın etibarlılıq müddəti göstərilmir, çünki başa çatması gözlənilmir.'
},
{
  id: 'dostluq-qerari', cat: 'x-bonds', tone: 'xatire', layout: 'qerar', palette: 'burgundy',
  title: 'Dostluğun Təsdiqi Qərarı', tag: 'Qərar',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'SON SÖZ',
  preamble: 'Baxılan müraciət üzrə müəyyən edildi ki, {from} və {to} arasındakı dostluq rəsmi təsdiqə ehtiyac duymayacaq qədər aydındır. Qərar buna baxmayaraq yazılı şəkildə tərtib olunur.',
  powers: 'İllərlə davam edən əlaqə sənədlə təsdiqlənir.\nHeç bir tərəf digərini yarı yolda qoymayıb.\nMübahisələr həmişə həmin gün bağlanıb.\nUzaqlıq əlaqənin keyfiyyətini azaltmayıb.',
  penalty: 'Qərar elan olunduğu andan qüvvəyə minir və şikayət qaydası nəzərdə tutulmur.'
},
{
  id: 'dostluq-sazisi', cat: 'x-bonds', tone: 'xatire', layout: 'muqavile', palette: 'forest',
  title: 'Dostluq Sazişi', tag: 'Saziş',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'SON SÖZ',
  preamble: 'Bu saziş {from} və {to} arasında bağlanır və dostluğun yazılmamış qaydalarını ilk dəfə yazıya alır. Qaydalar illərdir onsuz da tətbiq olunur.',
  powers: 'Zəngə ən geci həmin gün cavab verilir.\nKöçmək və təmir işlərində iştirak məcburidir.\nBorc məsələsi dostluğa daxil edilmir.\nMübahisə heç vaxt başqalarının yanında aparılmır.',
  penalty: 'Saziş müddətsizdir. Bəndlərin sayı artırıla bilər, azaldıla bilməz.'
},
{
  id: 'dostluq-teleqrami', cat: 'x-bonds', tone: 'xatire', layout: 'teleqram', palette: 'steel',
  title: 'Dostluq Teleqramı', tag: 'Qısa mesaj',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'SON SÖZ',
  preamble: 'Təcili çatdırılır. {from} tərəfindən {to} adlı şəxsə ünvanlanmışdır. Uzun müddət yazılmadı, buna görə də mətn qısa tutulub. Qalan sözlər ilk görüşdə, uzun bir söhbətdə deyiləcək.',
  powers: 'Yadımdasan nöqtə\nUzaqlıq problem deyil nöqtə\nGörüş vaxtı gəldi nöqtə\nXəbər gözləyirəm nöqtə',
  penalty: 'Teleqram cavab tələb edir. Cavab gecikərsə, ikinci teleqram göndəriləcək.'
},
{
  id: 'en-yaxsi-dost-vesiqesi', cat: 'x-bonds', tone: 'xatire', layout: 'vesiqe', palette: 'rose',
  title: 'Ən Yaxşı Dost Vəsiqəsi', tag: 'Vəsiqə',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'SON SÖZ',
  preamble: 'Vəsiqə {to} adlı şəxsə {from} tərəfindən verilir və onun ən yaxın dost statusunu təsdiq edir. Status uzun illərin nəticəsidir və müddətlə məhdudlaşdırılmır.',
  powers: 'Status: ən yaxın dost, birinci sırada.\nEtimad dərəcəsi: tam.\nMüddət: müəyyən edilməyib.\nƏlavə qeyd: alternativ namizəd yoxdur.',
  penalty: 'Vəsiqə şəxsidir və başqasına ötürülmür. İtirildikdə sahibi eyni gün yenidən tanınır.'
},
{
  id: 'sedaqet-diplomu', cat: 'x-bonds', tone: 'xatire', layout: 'diplom', palette: 'ink',
  title: 'Sədaqət Diplomu', tag: 'Sədaqət',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'SON SÖZ',
  preamble: 'Bu diplom {to} adlı şəxsə uzun illər ərzində nümayiş etdirdiyi sədaqətə görə {from} tərəfindən təqdim olunur. Sədaqət sınaqlardan keçmiş və təsdiqlənmişdir.',
  powers: 'Arxadan danışmaq halı qeydə alınmayıb.\nSöz verildikdə həmişə yerinə yetirildi.\nÇətin seçim qarşısında tərəf dəyişdirilmədi.\nUzun fasilələr münasibətə xələl gətirmədi.',
  penalty: 'Diplom ictimai qaydada təqdim olunmalıdır. Sahibinin bundan xəbərsiz qalması yolverilməzdir.'
},

/* ==================== AİLƏ ==================== */
{
  id: 'valideynlere-minnetdarliq', cat: 'x-family', tone: 'xatire', layout: 'diplom', palette: 'gold',
  title: 'Valideynlərə Minnətdarlıq Sənədi', tag: 'Valideyn',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'QEYD',
  preamble: 'Bu sənəd {to} adlı şəxslərə {from} tərəfindən illər boyu göstərdikləri qayğıya və heç vaxt hesablanmayan zəhmətə görə təqdim olunur. Sənəd gec deyil, vaxtında verilmiş sayılır.',
  powers: 'Uşaqlıqda çəkilən zəhmət heç vaxt xatırladılmadı.\nÇətin illər övladdan gizlədildi.\nHər uğur öz uğurları kimi qeyd olundu.\nQapı hər zaman, hər saat açıq qaldı.',
  penalty: 'Bu sənəd gec verilmiş sayılmır. Deyilməli olan söz nə vaxt deyilsə, yerinə çatır.'
},
{
  id: 'nene-babaya-xatire', cat: 'x-family', tone: 'xatire', layout: 'notarial', palette: 'rose',
  title: 'Nənə və Babaya Xatirə Sənədi', tag: 'Nənə-baba',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'QEYD',
  preamble: 'Bu sənədlə {from} tərəfindən {to} adlı şəxslərə uşaqlığın ən isti hissəsini onların evində keçirdiyi rəsmi qaydada bildirilir. Həmin evin qoxusu, səsi və süfrəsi yaddaşdan silinməyib.',
  powers: 'Yay tətilləri həmişə eyni həyətdə keçdi.\nDanışılan nağıllar hələ də yadda qalır.\nHeç bir səhv üçün danlanmadı.\nSüfrədə ən yaxşı yer həmişə saxlanıldı.',
  penalty: 'Sənəd ailə arxivində saxlanılır və növbəti nəslə eyni izahatla təhvil verilir.'
},
{
  id: 'baci-qardas-sehadetnamesi', cat: 'x-family', tone: 'xatire', layout: 'sertifikat', palette: 'burgundy',
  title: 'Bacı-Qardaş Şəhadətnaməsi', tag: 'Bacı-qardaş',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'QEYD',
  preamble: 'Bu şəhadətnamə ilə {from} və {to} arasındakı bacı-qardaş bağlılığı rəsmi qaydada təsdiq olunur. Bağlılıq seçilməyib, lakin hər gün yenidən qorunur.',
  powers: 'Uşaqlıq mübahisələri heç bir iz qoymadı.\nÇətin gündə birinci xəbər tutan o oldu.\nValideynlərin yanında tərəf saxlandı.\nOrtaq xatirələr başqasına izah olunmur.',
  penalty: 'Şəhadətnamə hər iki tərəf üçün eyni qüvvəyə malikdir və ləğv edilmir.'
},
{
  id: 'yeni-dogulan-sehadetnamesi', cat: 'x-family', tone: 'xatire', layout: 'sertifikat', palette: 'rose',
  title: 'Yeni Doğulanın Xatirə Şəhadətnaməsi', tag: 'Körpə',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'QEYD',
  preamble: 'Bu şəhadətnamə ilə {to} adlı şəxsin ailəyə qoşulması {from} tərəfindən xatirə üçün qeydə alınır. Həmin gün ailənin təqvimində əbədi yer aldı və hər il ayrıca qeyd olunur.',
  powers: 'Ad uzun müzakirədən sonra seçildi.\nİlk gecə evdə heç kim yatmadı.\nHamı eyni cümləni təkrarladı: gözü aydın.\nEv o gündən daha səsli və daha isti oldu.',
  penalty: 'Şəhadətnamə böyüyəndə sahibinə təqdim olunmaq üçün ailə arxivində saxlanılır.'
},
{
  id: 'aile-birliyi', cat: 'x-family', tone: 'xatire', layout: 'blank', palette: 'forest',
  title: 'Ailə Birliyi Bəyannaməsi', tag: 'Birlik',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'QEYD',
  preamble: 'Bu bəyannamə ilə {from} tərəfindən {to} adlı ailənin birliyi rəsmi qaydada bəyan olunur. Birlik çətin illərdə sınaqdan çıxmış və heç bir mərhələdə zəifləməmişdir.',
  powers: 'Böyük qərarlar ortaq masada verilir.\nHeç kim çətinliyi tək qarşılamadı.\nBayramlar bir ünvanda qeyd olunur.\nMübahisə evdən kənara çıxarılmır.',
  penalty: 'Bəyannamə ailənin bütün üzvləri üçün eyni qüvvəyə malikdir və hər il süfrə arxasında oxunur.'
},
{
  id: 'aile-toplantisi', cat: 'x-family', tone: 'xatire', layout: 'blank', palette: 'ink',
  title: 'Ailə Toplantısı Xatirə Protokolu', tag: 'Protokol',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'QEYD',
  preamble: 'Bu protokol {from} tərəfindən tərtib olunur və {to} adlı ailənin toplantısının gedişatını xatirə üçün qeydə alır. İclas gözləniləndən uzun sürmüşdür.',
  powers: 'Gündəlikdəki bütün məsələlərə baxıldı.\nSöz növbəsi bir dəfə də gözlənilmədi.\nYekun qərar süfrə arxasında qəbul olundu.\nNövbəti toplantının tarixi razılaşdırıldı.',
  penalty: 'Protokol arxivə salınır. Növbəti toplantıda ucadan oxunması təklif olunur.'
},
{
  id: 'aile-uzvu-karti', cat: 'x-family', tone: 'xatire', layout: 'lisenziya', palette: 'steel',
  title: 'Ailə Üzvü Kartı', tag: 'Üzvlük',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'QEYD',
  preamble: 'Bu kart {to} adlı şəxsə {from} tərəfindən verilir və onun ailənin tamhüquqlu üzvü olduğunu təsdiq edir. Üzvlük qan bağına deyil, münasibətə əsaslanır.',
  powers: 'Süfrədə daimi yer ayrılıb.\nBayram siyahısına daxil edilib.\nEvin açarı təhvil verilib.\nAilə söhbətlərindən kənarda saxlanılmır.',
  penalty: 'Kart geri alınmır. Üzvlük statusu ünvan dəyişikliyindən asılı deyil.'
},
{
  id: 'aile-arayisi', cat: 'x-family', tone: 'xatire', layout: 'arayis', palette: 'gold',
  title: 'Ailə Haqqında Arayış', tag: 'Arayış',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'QEYD',
  preamble: 'Arayış {to} adlı şəxsə {from} tərəfindən verilir və onun ailənin ayrılmaz hissəsi olduğunu təsdiq edir. Arayış təqdim olunduğu hər yerdə qüvvədədir.',
  powers: 'Ailə siyahısında adı ilk sıralardadır.\nBütün mühüm günlərdə iştirakı qeydə alınıb.\nÇətin dövrlərdə payına düşən işi görüb.\nƏlaqə heç bir dövrdə kəsilməyib.',
  penalty: 'Arayışın etibarlılıq müddəti göstərilmir. İndiyədək yenilənməsinə ehtiyac yaranmayıb.'
},
{
  id: 'aile-surasi-qerari', cat: 'x-family', tone: 'xatire', layout: 'qerar', palette: 'burgundy',
  title: 'Ailə Şurasının Qərarı', tag: 'Qərar',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'QEYD',
  preamble: 'Baxılan müraciət üzrə müəyyən edildi ki, {to} adlı şəxs ailənin fəxri hesab olunur. Qərar {from} tərəfindən təqdim olunan əsaslara istinadən yekdilliklə qəbul edilmişdir.',
  powers: 'Ailənin bütün üzvləri eyni rəydədir.\nƏsaslar uzun illərin müşahidəsinə söykənir.\nAlternativ təklif səsləndirilmədi.\nQərar süfrə arxasında elan olundu.',
  penalty: 'Qərar elan olunduğu andan qüvvəyə minir və yenidən baxılmaya təqdim olunmur.'
},
{
  id: 'aile-sazisi', cat: 'x-family', tone: 'xatire', layout: 'muqavile', palette: 'steel',
  title: 'Ailə Sazişi', tag: 'Saziş',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'QEYD',
  preamble: 'Bu saziş {from} və {to} arasında bağlanır və ailənin gündəlik qaydalarını səmimi şəkildə qeydə alır. Qaydalar illərdir yazısız tətbiq olunur.',
  powers: 'Şam yeməyi mümkün qədər birlikdə yeyilir.\nHəftədə bir dəfə zəng məcburidir.\nBayramlar bir ünvanda qeyd olunur.\nNarahat xəbər gizlədilmir.',
  penalty: 'Saziş müddətsizdir və ailənin bütün üzvləri üçün eyni dərəcədə qüvvədədir.'
},
{
  id: 'aile-teleqrami', cat: 'x-family', tone: 'xatire', layout: 'teleqram', palette: 'forest',
  title: 'Ailə Teleqramı', tag: 'Qısa mesaj',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'QEYD',
  preamble: 'Təcili çatdırılır. {from} tərəfindən {to} adlı şəxsə ünvanlanmışdır. Uzaq şəhərdən göndərilib, buna görə də mətn qısadır. Ətraflı danışıq ilk görüşə saxlanılır.',
  powers: 'Hamı sağ salamatdır nöqtə\nDarıxırıq nöqtə\nBayrama qədər gəlirik nöqtə\nÖzünüzdən muğayat olun nöqtə',
  penalty: 'Teleqram evdə ucadan oxunmalıdır. Cavab teleqramı eyni gün gözlənilir.'
},
{
  id: 'aile-vesiqesi', cat: 'x-family', tone: 'xatire', layout: 'vesiqe', palette: 'ink',
  title: 'Ailə Vəsiqəsi', tag: 'Vəsiqə',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'QEYD',
  preamble: 'Vəsiqə {to} adlı şəxsə {from} tərəfindən verilir və onun ailəyə mənsubiyyətini təsdiq edir. Sənəd qeydiyyat ünvanından asılı deyil və heç bir mərhələdə yenidən baxılmaya təqdim olunmur.',
  powers: 'Ailə: bir soyad, bir süfrə.\nStatus: daimi üzv.\nMüddət: ömürlük.\nƏlavə qeyd: ünvan dəyişsə də status qalır.',
  penalty: 'Vəsiqə itirildikdə bərpa üçün müraciət tələb olunmur — sahibi onsuz da tanınır.'
},

/* ==================== TƏBRİKLƏR ==================== */
{
  id: 'ad-gunu-tebriknamesi', cat: 'x-greetings', tone: 'xatire', layout: 'diplom', palette: 'rose',
  title: 'Ad Günü Təbriknaməsi', tag: 'Ad günü',
  toLabel: 'TƏBRİK OLUNAN', fromLabel: 'TƏBRİK EDƏN', powersLabel: 'ARZULAR', penaltyLabel: 'QEYD',
  preamble: 'Bu təbriknamə {to} adlı şəxsə ad günü münasibətilə {from} tərəfindən təqdim olunur. Arzular səmimi, ölçülü və tam ürəkdəndir; icrası üçün heç bir şərt qoyulmur.',
  powers: 'Qarşıdakı il əvvəlkindən sakit keçsin.\nPlanlar vaxtında və tələsmədən baş tutsun.\nSevindirən xəbərlər gözlənilmədən gəlsin.\nYaxınlar həmişə əlçatan məsafədə qalsın.',
  penalty: 'Təbriknamə hər il yenilənir. Köhnə nüsxələr saxlanılır və birlikdə oxunur.'
},
{
  id: 'yubiley-fexri-fermani', cat: 'x-greetings', tone: 'xatire', layout: 'diplom', palette: 'gold',
  title: 'Yubiley Fəxri Fərmanı', tag: 'Yubiley',
  toLabel: 'TƏBRİK OLUNAN', fromLabel: 'TƏBRİK EDƏN', powersLabel: 'ARZULAR', penaltyLabel: 'QEYD',
  preamble: 'Bu fərman {to} adlı şəxsə yubiley münasibətilə {from} tərəfindən təqdim olunur. Keçən illər sayılmır, yaşanan günlər sayılır — bu göstəriciyə görə hesabat əladır.',
  powers: 'Qarşıdakı illər bu qədər dolu keçsin.\nSağlamlıq heç bir plana mane olmasın.\nEv həmişə qonaqla dolu olsun.\nƏn yaxşı xəbərlər hələ qabaqdadır.',
  penalty: 'Fərman ictimai qaydada oxunmalı və yubiley süfrəsində saxlanılmalıdır.'
},
{
  id: 'novruz-tebriknamesi', cat: 'x-greetings', tone: 'xatire', layout: 'notarial', palette: 'forest',
  title: 'Novruz Təbriknaməsi', tag: 'Novruz',
  toLabel: 'TƏBRİK OLUNAN', fromLabel: 'TƏBRİK EDƏN', powersLabel: 'ARZULAR', penaltyLabel: 'QEYD',
  preamble: 'Bu təbriknamə {to} adlı şəxsə Novruz bayramı münasibətilə {from} tərəfindən təqdim olunur. Bahar hər il eyni ümidlə qarşılanır və bu ümid indiyədək boşa çıxmayıb.',
  powers: 'Süfrə həmişə bu qədər səxavətli olsun.\nEv isti, qonaq çox olsun.\nKöhnə çətinliklər köhnə ildə qalsın.\nTonqaldan atlanan arzular yerinə yetsin.',
  penalty: 'Təbriknamə bayram süfrəsində oxunur və növbəti Novruza qədər saxlanılır.'
},
{
  id: 'yeni-il-tebriknamesi', cat: 'x-greetings', tone: 'xatire', layout: 'sertifikat', palette: 'burgundy',
  title: 'Yeni İl Təbriknaməsi', tag: 'Yeni il',
  toLabel: 'TƏBRİK OLUNAN', fromLabel: 'TƏBRİK EDƏN', powersLabel: 'ARZULAR', penaltyLabel: 'QEYD',
  preamble: 'Bu təbriknamə {to} adlı şəxsə Yeni il münasibətilə {from} tərəfindən təqdim olunur. Ötən il üçün təşəkkür, gələn il üçün isə səmimi ümid bildirilir. Hesabat qapadılmış sayılır.',
  powers: 'Yeni il əvvəlkindən yüngül keçsin.\nBaşlanan işlər yarımçıq qalmasın.\nMasa arxasında hər kəs öz yerində olsun.\nGözlənilən xəbər nəhayət gəlsin.',
  penalty: 'Təbriknamə gecə yarısından əvvəl təqdim olunmalıdır. Gecikmə qüvvəsini azaltmır.'
},
{
  id: 'bayram-tebriknamesi', cat: 'x-greetings', tone: 'xatire', layout: 'blank', palette: 'gold',
  title: 'Bayram Təbriknaməsi', tag: 'Bayram',
  toLabel: 'TƏBRİK OLUNAN', fromLabel: 'TƏBRİK EDƏN', powersLabel: 'ARZULAR', penaltyLabel: 'QEYD',
  preamble: 'Bu təbriknamə {to} adlı şəxsə bayram münasibətilə {from} tərəfindən təqdim olunur. Bayramın əsl mənası süfrədə deyil, birlikdə keçirilən saatlardadır — bu sənəd məhz onları qeyd edir.',
  powers: 'Bayram süfrəsi hər il eyni adamlarla qurulsun.\nUzaqdakılar bu günə çatsın.\nEvin səsi kəsilməsin.\nKiçiklərin sevinci böyüklərə də keçsin.',
  penalty: 'Təbriknamə bayram günü təqdim olunur və evin görünən yerində saxlanılır.'
},
{
  id: 'sekkiz-mart-tebriknamesi', cat: 'x-greetings', tone: 'xatire', layout: 'sertifikat', palette: 'rose',
  title: '8 Mart Təbriknaməsi', tag: '8 Mart',
  toLabel: 'TƏBRİK OLUNAN', fromLabel: 'TƏBRİK EDƏN', powersLabel: 'ARZULAR', penaltyLabel: 'QEYD',
  preamble: 'Bu təbriknamə {to} adlı şəxsə 8 Mart münasibətilə {from} tərəfindən təqdim olunur. Təbrik bir günlə məhdudlaşmır, sadəcə bu gün yazıya alınır.',
  powers: 'Zəhmət heç vaxt görünməz qalmasın.\nQayğı qarşılıqlı olsun.\nÖzü üçün ayrılan vaxt artsın.\nSevindirən xırdalıqlar tez-tez təkrarlansın.',
  penalty: 'Təbriknamə ildə bir dəfə deyil, ehtiyac olan hər gün oxuna bilər.'
},
{
  id: 'tebrik-karti', cat: 'x-greetings', tone: 'xatire', layout: 'lisenziya', palette: 'steel',
  title: 'Təbrik Kartı', tag: 'Kart',
  toLabel: 'TƏBRİK OLUNAN', fromLabel: 'TƏBRİK EDƏN', powersLabel: 'ARZULAR', penaltyLabel: 'QEYD',
  preamble: 'Bu kart {to} adlı şəxsə {from} tərəfindən təbrik nişanəsi kimi verilir. Kart kiçikdir, arxasındakı istək isə deyil; ölçüsü ilə məzmunu arasında uyğunsuzluq qəsdən buraxılıb.',
  powers: 'Bu gün yalnız xoş xəbər gəlsin.\nPlanlar öz vaxtında baş tutsun.\nYorğunluq axşama qalmasın.\nSəbəb olmadan da sevinmək mümkün olsun.',
  penalty: 'Kart cibdə deyil, gözə görünən yerdə saxlanılmalı və pis günlərdə yenidən oxunmalıdır.'
},
{
  id: 'tebrik-arayisi', cat: 'x-greetings', tone: 'xatire', layout: 'arayis', palette: 'ink',
  title: 'Təbrik Haqqında Arayış', tag: 'Arayış',
  toLabel: 'TƏBRİK OLUNAN', fromLabel: 'TƏBRİK EDƏN', powersLabel: 'ARZULAR', penaltyLabel: 'QEYD',
  preamble: 'Arayış {to} adlı şəxsə {from} tərəfindən verilir və təbrikin rəsmi qaydada, vaxtında və tam səmimi şəkildə bildirildiyini təsdiq edir. Sənəd təqdim olunduğu hər yerdə əlavə yoxlama tələb etmir.',
  powers: 'Təbrik gününə bir gün də gecikməyib.\nArzuların sayı və keyfiyyəti yoxlanılıb.\nSəmimilik dərəcəsi: tam.\nTəkrar təbrik üçün maneə yoxdur.',
  penalty: 'Arayış təqdim olunduğu hər yerdə qüvvədədir və əlavə təsdiq tələb etmir.'
},
{
  id: 'tebrik-qerari', cat: 'x-greetings', tone: 'xatire', layout: 'qerar', palette: 'burgundy',
  title: 'Təbrik Haqqında Qərar', tag: 'Qərar',
  toLabel: 'TƏBRİK OLUNAN', fromLabel: 'TƏBRİK EDƏN', powersLabel: 'ARZULAR', penaltyLabel: 'QEYD',
  preamble: 'Baxılan müraciət üzrə müəyyən edildi ki, {to} adlı şəxs təbrikə layiqdir. Qərar {from} tərəfindən təqdim olunan əsaslara istinadən yekdilliklə qəbul edilmişdir.',
  powers: 'Səbəb aydındır və mübahisə doğurmur.\nƏtrafdakıların rəyi yekdildir.\nTəbrikin gecikdirilməsi yolverilməz sayıldı.\nArzuların icrasına dərhal başlanılır.',
  penalty: 'Qərar elan olunduğu andan qüvvəyə minir və süfrə arxasında oxunur.'
},
{
  id: 'arzular-sazisi', cat: 'x-greetings', tone: 'xatire', layout: 'muqavile', palette: 'forest',
  title: 'Arzular Sazişi', tag: 'Saziş',
  toLabel: 'TƏBRİK OLUNAN', fromLabel: 'TƏBRİK EDƏN', powersLabel: 'ARZULAR', penaltyLabel: 'QEYD',
  preamble: 'Bu saziş {from} və {to} arasında bağlanır və bildirilən arzuların yerinə yetirilməsi üçün qarşılıqlı dəstəyi qeydə alır. Arzular real və əlçatan sayılır.',
  powers: 'Böyük arzu kiçik addımlara bölünür.\nHər mərhələdə dəstək göstərilir.\nGecikmə səbəb sayılmır, davam edilir.\nYerinə yetən arzu qeyd olunur.',
  penalty: 'Saziş bir illik müddətə bağlanır və növbəti təbrik günü yenilənir.'
},
{
  id: 'tebrik-teleqrami', cat: 'x-greetings', tone: 'xatire', layout: 'teleqram', palette: 'gold',
  title: 'Təbrik Teleqramı', tag: 'Qısa mesaj',
  toLabel: 'TƏBRİK OLUNAN', fromLabel: 'TƏBRİK EDƏN', powersLabel: 'ARZULAR', penaltyLabel: 'QEYD',
  preamble: 'Təcili çatdırılır. {from} tərəfindən {to} adlı şəxsə ünvanlanmışdır. Günün əsas xəbəri bu teleqramdır. Uzun təbrik mətni yerinə qısa və dəqiq forma seçilib, səmimilik isə azalmayıb.',
  powers: 'Təbrik edirik nöqtə\nSağlam ol nöqtə\nArzular yerinə yetsin nöqtə\nGörüşənədək nöqtə',
  penalty: 'Teleqram bayram günü çatdırılır və sonra ailə arxivində saxlanılır.'
},
{
  id: 'yubilyar-vesiqesi', cat: 'x-greetings', tone: 'xatire', layout: 'vesiqe', palette: 'steel',
  title: 'Yubilyar Vəsiqəsi', tag: 'Vəsiqə',
  toLabel: 'TƏBRİK OLUNAN', fromLabel: 'TƏBRİK EDƏN', powersLabel: 'ARZULAR', penaltyLabel: 'QEYD',
  preamble: 'Vəsiqə {to} adlı şəxsə {from} tərəfindən verilir və onun günün yubilyarı statusunu təsdiq edir. Status bir gün deyil, bütün həftə qüvvədədir.',
  powers: 'Status: günün yubilyarı.\nSüfrədə baş yer ayrılıb.\nBütün istəklər növbədənkənar yerinə yetirilir.\nMüddət: bayram həftəsi.',
  penalty: 'Vəsiqə hər il yenidən verilir. Köhnə nüsxələr xatirə üçün saxlanılır.'
}

);
