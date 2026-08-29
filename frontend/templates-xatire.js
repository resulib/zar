/* ==================================================================
   Xatirə Sənədləri Palatası — səmimi şablon kitabxanası
   72 şablon · 6 kateqoriya · 12 dizayn · 6 palitra · tone: 'xatire'

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
  title: 'Uzun Müddət Söylənilməmiş Hisslərin Rəsmi Bəyanı haqqında Etirafnamə', tag: 'Ən çox seçilən',
  signOrg: 'Sevgi və Etirafların Qeydiyyatı üzrə Palata',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'SON SÖZ',
  preamble: 'Bu sənədlə təsdiq olunur ki, {from} tərəfindən {to} adlı şəxsə uzun müddət söylənilməmiş, lakin heç vaxt azalmamış bir hiss rəsmi qaydada bəyan olunur. Etiraf könüllüdür, şahid tələb etmir və geri götürülmür.',
  powers: 'Səhər oyananda ilk düşünülən ad dəyişməyib.\nSusmaq da rahatdır — söhbət olmasa da yer isti qalır.\nUzaq şəhərlər yaxınlığı azaltmadı.\nSevinc bölüşəndə böyüyür, qayğı bölüşəndə kiçilir.',
  penalty: 'Bu sənəd illər sonra təsadüfən tapılanda eyni sözlərin yenidən deyilməsi şərti ilə qüvvədə qalır.',
  titleOptions: [
    'Uzun Müddət Söylənilməmiş Hisslərin Rəsmi Bəyanı haqqında Etirafnamə',
    'Vaxtında Deyilməmiş Sözlərin Yazılı Şəkildə Bəyanı haqqında Etirafnamə',
    'Heç Vaxt Azalmamış Bir Hissin Rəsmi Qeydiyyatı haqqında Etirafnamə',
    'Susmaqla Keçən İllərin Yekununda Verilmiş Etirafnamə'
  ],
  powersOptions: [
    'Səhər oyananda ilk düşünülən ad dəyişməyib.',
    'Susmaq da rahatdır — söhbət olmasa da yer isti qalır.',
    'Uzaq şəhərlər yaxınlığı azaltmadı.',
    'Sevinc bölüşəndə böyüyür, qayğı bölüşəndə kiçilir.',
    'Ən çətin günlərdə ünvan həmişə eyni qaldı.',
    'Heç bir izahat tələb olunmadı.',
    'Səhvlər sayılmadı, xatırlanmadı.',
    'Gözləmək ağır gəlmədi.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Bu sənəd illər sonra təsadüfən tapılanda eyni sözlərin yenidən deyilməsi şərti ilə qüvvədə qalır.',
    'Etiraf müddətsizdir və heç bir halda geri götürülmür.',
    'Sənəd ailə arxivinin ilk vərəqi kimi saxlanılır.'
  ]
},
{
  id: 'evlilik-teklifi', cat: 'x-love', tone: 'xatire', layout: 'diplom', palette: 'burgundy',
  title: 'Ömrün Qalan Hissəsini Birlikdə Keçirmək Təklifinin Rəsmi Təqdimatı', tag: 'Böyük an',
  signOrg: 'Sevgi və Etirafların Qeydiyyatı üzrə Palata',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'SON SÖZ',
  preamble: 'Bu sənədlə {from} tərəfindən {to} adlı şəxsə ömrün qalan hissəsini birlikdə keçirmək təklifi rəsmi qaydada təqdim olunur. Təklif düşünülmüş, tələsik olmayan və tam səmimi hesab olunur.',
  powers: 'Birgə keçən illər tələsik qərar üçün yer qoymadı.\nÇətin günlərdə tərəflərin heç biri geri çəkilmədi.\nGələcək planları illərdir eyni cümlə ilə başlayır.\nCavab nə olursa olsun, sual verilməyə dəyərdi.',
  penalty: 'Müsbət cavab halında bu sənəd ailə arxivinin ilk vərəqi kimi saxlanılır və ildönümlərində yenidən oxunur.',
  titleOptions: [
    'Ömrün Qalan Hissəsini Birlikdə Keçirmək Təklifinin Rəsmi Təqdimatı',
    'Düşünülmüş və Tələsik Olmayan Bir Təklifin Rəsmi Sənədi',
    'Birgə Gələcək Barədə Verilmiş Təklifin Qeydiyyatı Sənədi',
    'Uzun İllərin Yekununda İrəli Sürülən Təklifin Sənədi'
  ],
  powersOptions: [
    'Birgə keçən illər tələsik qərar üçün yer qoymadı.',
    'Çətin günlərdə tərəflərin heç biri geri çəkilmədi.',
    'Gələcək planları illərdir eyni cümlə ilə başlayır.',
    'Cavab nə olursa olsun, sual verilməyə dəyərdi.',
    'Ailələr bir-birini çoxdan tanıyır.',
    'Səhər söhbətləri heç vaxt yorucu olmadı.',
    'Susqunluq da rahat keçdi.',
    'Eyni şeylərə gülmək dəyişmədi.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Müsbət cavab halında bu sənəd ailə arxivinin ilk vərəqi kimi saxlanılır və ildönümlərində yenidən oxunur.',
    'Sənəd cavabdan asılı olmayaraq xatirə kimi qalır.',
    'Təklif geri götürülmür və müddətlə məhdudlaşmır.'
  ]
},
{
  id: 'ildonumu-sehadetnamesi', cat: 'x-love', tone: 'xatire', layout: 'sertifikat', palette: 'rose',
  title: 'Birgə Yolun Növbəti İlinin Tamamlanmasını Təsdiq edən Şəhadətnamə', tag: 'İldönümü',
  signOrg: 'Birgə Həyat Xatirələrinin Qeydiyyatı Şöbəsi',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'SON SÖZ',
  preamble: 'Bu şəhadətnamə ilə təsdiq olunur ki, {from} və {to} arasındakı birgə yol növbəti ilini tamamlamışdır. Keçən müddət heç bir tərəf üçün itirilmiş sayılmır və tam olaraq qeydiyyata alınır.',
  powers: 'Bir il daha yan-yana, eyni masa arxasında.\nMübahisələr axşama qədər davam etmədi.\nSevinc xəbərləri həmişə birinci bir-birinə çatdırıldı.\nEv sözü hər ikisi üçün eyni mənanı saxladı.',
  penalty: 'Şəhadətnamə hər il yenilənməlidir — yeniləmə qaydası sadədir: birlikdə bir gün də qalmaq.',
  titleOptions: [
    'Birgə Yolun Növbəti İlinin Tamamlanmasını Təsdiq edən Şəhadətnamə',
    'İldönümü Münasibətilə Verilmiş Xatirə Şəhadətnaməsi',
    'Yan-yana Keçirilmiş Bir İlin Rəsmi Qeydiyyatı Şəhadətnaməsi',
    'Birgə Keçən Müddətin Təsdiqinə dair Xatirə Şəhadətnaməsi'
  ],
  powersOptions: [
    'Bir il daha yan-yana, eyni masa arxasında.',
    'Mübahisələr axşama qədər davam etmədi.',
    'Sevinc xəbərləri həmişə birinci bir-birinə çatdırıldı.',
    'Ev sözü hər ikisi üçün eyni mənanı saxladı.',
    'Səhər çayı vərdişə çevrildi.',
    'Yorğun günlərdə səs tonu qalxmadı.',
    'Planlar hər ikisinin adı ilə qurulur.',
    'Köhnə şəkillərə birlikdə baxıldı.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Şəhadətnamə hər il yenilənməlidir — yeniləmə qaydası sadədir: birlikdə bir gün də qalmaq.',
    'Sənəd ailə arxivində müddətsiz saxlanılır.',
    'Hər ildönümündə üzərinə yeni tarix yazılır.'
  ]
},
{
  id: 'seni-secirem', cat: 'x-love', tone: 'xatire', layout: 'blank', palette: 'burgundy',
  title: 'Seçimin Hər Gün Yenidən Təkrarlandığını Bildirən Rəsmi Bəyannamə', tag: 'Bəyannamə',
  signOrg: 'Səmimi Bəyanatların Təsdiqi üzrə Şura',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'SON SÖZ',
  preamble: 'Bu bəyannamə ilə {from} bildirir ki, {to} adlı şəxsi bir dəfə deyil, hər gün yenidən seçir. Seçim vərdişdən deyil, düşünülmüş qərardan doğur, heç bir müddətlə məhdudlaşdırılmır və kənar rəylərdən asılı deyil.',
  powers: 'Seçim yorğun günlərdə də dəyişmir.\nDaha rahat variant axtarılmadı və axtarılmayacaq.\nBaşqalarının rəyi bu qərara heç vaxt daxil edilmədi.\nSabah da eyni ad yazılacaq.',
  penalty: 'Bəyannamə müddətsizdir. Ləğvi yalnız hər iki tərəfin razılığı ilə mümkündür, indiyədək belə bir müraciət olmayıb.',
  titleOptions: [
    'Seçimin Hər Gün Yenidən Təkrarlandığını Bildirən Rəsmi Bəyannamə',
    'Vərdişdən Deyil, Qərardan Doğan Seçimin Bəyannaməsi',
    'Müddətlə Məhdudlaşdırılmayan Seçim haqqında Bəyannamə',
    'Hər Səhər Yenidən Edilən Seçimin Rəsmi Bəyanı'
  ],
  powersOptions: [
    'Seçim yorğun günlərdə də dəyişmir.',
    'Daha rahat variant axtarılmadı və axtarılmayacaq.',
    'Başqalarının rəyi bu qərara heç vaxt daxil edilmədi.',
    'Sabah da eyni ad yazılacaq.',
    'Seçim heç bir şəraitdən asılı deyil.',
    'Uzaqlıq və vaxt qərarı dəyişdirmədi.',
    'Alternativ variantlar müzakirə edilmədi.',
    'Qərar hər gün eyni asanlıqla təkrarlanır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Bəyannamə müddətsizdir. Ləğvi yalnız hər iki tərəfin razılığı ilə mümkündür, indiyədək belə bir müraciət olmayıb.',
    'Bəyannamə geri götürülmür və dəyişdirilmir.',
    'Sənəd hər il yenidən oxunmaq üçün saxlanılır.'
  ]
},
{
  id: 'ilk-gorus-qeydi', cat: 'x-love', tone: 'xatire', layout: 'viza', palette: 'gold',
  title: 'İlk Görüşün Tarixi və Təfərrüatlarının Xatirə Qaydasında Qeydi', tag: 'Başlanğıc',
  signOrg: 'Birgə Həyat Xatirələrinin Qeydiyyatı Şöbəsi',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'SON SÖZ',
  preamble: 'Bu sənədlə {from} və {to} arasındakı ilk görüşün tarixi, yeri və təfərrüatları xatirə qaydasında qeydə alınır. Həmin gün hər iki tərəf üçün başlanğıc nöqtəsi kimi tanınır və arxivdə saxlanılır.',
  powers: 'O gün heç kim nə olacağını bilmirdi.\nSöhbət gözləniləndən uzun sürdü.\nAyrılarkən hər ikisi geri baxdı.\nHəmin yer indi də eyni cür xatırlanır.',
  penalty: 'Qeyd dəyişdirilmir və silinmir. İllər sonra bu sənəd həmin günü olduğu kimi xatırlatmaq üçün saxlanılır.',
  titleOptions: [
    'İlk Görüşün Tarixi və Təfərrüatlarının Xatirə Qaydasında Qeydi',
    'Hər Şeyin Başladığı Günün Rəsmi Xatirə Qeydiyyatı',
    'İlk Söhbətin və Görüş Yerinin Xatirə Qeydi',
    'Başlanğıc Tarixinin Rəsmi Təsbitinə dair Xatirə Qeydi'
  ],
  powersOptions: [
    'O gün heç kim nə olacağını bilmirdi.',
    'Söhbət gözləniləndən uzun sürdü.',
    'Ayrılarkən hər ikisi geri baxdı.',
    'Həmin yer indi də eyni cür xatırlanır.',
    'İlk mesaj hələ də saxlanılır.',
    'Görüşün saatı dəqiq xatırlanır.',
    'Hava şəraiti də yadda qalıb.',
    'O gündən sonra plan həmişə birgə quruldu.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Qeyd dəyişdirilmir və silinmir. İllər sonra bu sənəd həmin günü olduğu kimi xatırlatmaq üçün saxlanılır.',
    'Sənəd hər ildönümündə yenidən oxunur.',
    'Qeydə yeni təfərrüatlar əlavə edilə bilər.'
  ]
},
{
  id: 'birge-gelecek', cat: 'x-love', tone: 'xatire', layout: 'ekspertiza', palette: 'gold',
  title: 'Birgə Qurulmuş Gələcək Planlarının Rəsmi Qaydada Bəyanı', tag: 'Gələcək',
  signOrg: 'Səmimi Bəyanatların Təsdiqi üzrə Şura',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'SON SÖZ',
  preamble: 'Bu bəyannamə ilə {from} və {to} gələcəyə dair planlarını birgə bəyan edirlər. Planlar hər iki tərəfin iştirakı ilə qurulmuş, heç biri digərinin üzərinə tək başına qoyulmamış və ortaq siyahıda saxlanılır.',
  powers: 'Planlar həmişə cəm şəkildə danışılır.\nHər iki tərəfin arzuları siyahıya salınıb.\nÇətin variantlar da birgə seçilir.\nFikir ayrılığı planı dayandırmır.',
  penalty: 'Planlar dəyişə bilər, lakin onları birgə qurmaq qaydası dəyişmir. Bəyannamə bu qaydanın qeydidir.',
  titleOptions: [
    'Birgə Qurulmuş Gələcək Planlarının Rəsmi Qaydada Bəyanı',
    'Uzunmüddətli Birgə Planların Təsdiqinə dair Bəyannamə',
    'Gələcəyə dair Ortaq Niyyətlərin Rəsmi Bəyanı',
    'Birlikdə Qurulacaq Həyata dair Bəyannamə'
  ],
  powersOptions: [
    'Planlar həmişə cəm şəkildə danışılır.',
    'Hər iki tərəfin arzuları siyahıya salınıb.',
    'Çətin variantlar da birgə seçilir.',
    'Fikir ayrılığı planı dayandırmır.',
    'Ev barədə təsəvvürlər üst-üstə düşür.',
    'Səyahət siyahısı ortaqdır.',
    'Maliyyə qərarları birgə qəbul edilir.',
    'Hər il planlar yenidən nəzərdən keçirilir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Planlar dəyişə bilər, lakin onları birgə qurmaq qaydası dəyişmir. Bəyannamə bu qaydanın qeydidir.',
    'Bəyannamə hər il yenidən müzakirə olunur.',
    'Sənəd birgə arxivdə saxlanılır.'
  ]
},
{
  id: 'sevgi-etimad-karti', cat: 'x-love', tone: 'xatire', layout: 'lisenziya', palette: 'steel',
  title: 'Qarşılıqlı Etimadın Səviyyəsini Təsdiq edən Xatirə Kartı', tag: 'Etimad',
  signOrg: 'Sevgi və Etirafların Qeydiyyatı üzrə Palata',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'SON SÖZ',
  preamble: 'Bu kart {from} və {to} arasındakı etimadın səviyyəsini təsdiq edir. Etimad illər ərzində formalaşmış, heç bir yoxlama tələb etməmiş, kənar rəylərdən asılı olmamış və indiyədək bir dəfə də pozulmamışdır.',
  powers: 'Telefon heç vaxt yoxlanılmadı.\nSual verilmədən inanıldı.\nGecikmə şübhə yaratmadı.\nSirr heç vaxt kənara çıxmadı.',
  penalty: 'Kart müddətsizdir. Etimad qazanılması uzun, itirilməsi asan olduğu üçün bu sənəd xatırlatma kimi saxlanılır.',
  titleOptions: [
    'Qarşılıqlı Etimadın Səviyyəsini Təsdiq edən Xatirə Kartı',
    'Şərtsiz Etibarın Rəsmi Qeydiyyatına dair Xatirə Kartı',
    'Heç Bir Yoxlama Tələb Etməyən Etimadın Kartı',
    'Qarşılıqlı Etibarın Təsdiqinə dair Xatirə Sənədi'
  ],
  powersOptions: [
    'Telefon heç vaxt yoxlanılmadı.',
    'Sual verilmədən inanıldı.',
    'Gecikmə şübhə yaratmadı.',
    'Sirr heç vaxt kənara çıxmadı.',
    'Söz verilib, sözdə durulub.',
    'Ən çətin xəbər də birinci bölüşüldü.',
    'Kənar rəylər nəzərə alınmadı.',
    'Səhv edildikdə birinci özü etiraf etdi.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Kart müddətsizdir. Etimad qazanılması uzun, itirilməsi asan olduğu üçün bu sənəd xatırlatma kimi saxlanılır.',
    'Kart hər iki tərəfə eyni qaydada aiddir.',
    'Sənəd ailə arxivində saxlanılır.'
  ]
},
{
  id: 'sevgi-arayisi', cat: 'x-love', tone: 'xatire', layout: 'arayis', palette: 'forest',
  title: 'Səmimi Hisslərin Mövcudluğu və Davamlılığı haqqında Arayış', tag: 'Arayış',
  signOrg: 'Sevgi və Etirafların Qeydiyyatı üzrə Palata',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'SON SÖZ',
  preamble: 'Verilir {to} adlı şəxsə ondan ötrü ki, {from} tərəfindən bəslənən hisslər uzun müddət ərzində dəyişməmiş, azalmamış və heç bir şəraitdən asılı olmamışdır. Arayış xatirə kimi verilir.',
  powers: 'Hisslər illər ərzində dəyişmədi.\nUzaqlıq və vaxt təsir göstərmədi.\nÇətin günlər yaxınlığı artırdı.\nHeç bir şərt qoyulmadı.',
  penalty: 'Arayış müddətsizdir və yenidən təsdiq tələb etmir. İllər sonra oxunduqda eyni mənanı daşıyacaq.',
  titleOptions: [
    'Səmimi Hisslərin Mövcudluğu və Davamlılığı haqqında Arayış',
    'Uzunmüddətli Hisslərin Təsdiqinə dair Rəsmi Arayış',
    'Münasibətin Vəziyyəti haqqında Xatirə Arayışı',
    'Hisslərin Dəyişməzliyi haqqında Rəsmi Arayış'
  ],
  powersOptions: [
    'Hisslər illər ərzində dəyişmədi.',
    'Uzaqlıq və vaxt təsir göstərmədi.',
    'Çətin günlər yaxınlığı artırdı.',
    'Heç bir şərt qoyulmadı.',
    'Səhər salamı heç vaxt unudulmadı.',
    'Xoş xəbər birinci bölüşüldü.',
    'Yorğunluq səs tonuna çıxmadı.',
    'Adlar həmişə eyni cür səsləndi.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Arayış müddətsizdir və yenidən təsdiq tələb etmir. İllər sonra oxunduqda eyni mənanı daşıyacaq.',
    'Arayış xatirə arxivində saxlanılır.',
    'Sənəd hər iki tərəfə eyni qaydada aiddir.'
  ]
},
{
  id: 'barisiq-qerari', cat: 'x-love', tone: 'xatire', layout: 'qerar', palette: 'ink',
  title: 'Mübahisənin Bitirilməsi və Barışığın Rəsmiləşdirilməsi haqqında Qərar', tag: 'Barışıq',
  signOrg: 'Səmimi Bəyanatların Təsdiqi üzrə Şura',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'SON SÖZ',
  preamble: 'Aparılmış səmimi söhbətdən sonra {from} və {to} arasında barışıq əldə edilmişdir. Hər iki tərəf öz payına düşən səhvi etiraf etmiş və mövzunun arxada qalması barədə razılığa gəlmişdir.',
  powers: 'Hər iki tərəf öz səhvini etiraf etdi.\nKimin birinci başladığı araşdırılmadı.\nDeyilən sözlər geri götürüldü.\nMövzu bir daha qaldırılmayacaq.',
  penalty: 'Qərar qüvvəyə mindiyi andan mübahisə bağlanmış sayılır və gələcəkdə arqument kimi istifadə edilmir.',
  titleOptions: [
    'Mübahisənin Bitirilməsi və Barışığın Rəsmiləşdirilməsi haqqında Qərar',
    'Söhbətin Yekununda Əldə Edilmiş Barışıq haqqında Qərar',
    'Səhvlərin Qarşılıqlı Etirafı haqqında Yekun Qərar',
    'Mübahisənin Arxada Qalması haqqında Rəsmi Qərar'
  ],
  powersOptions: [
    'Hər iki tərəf öz səhvini etiraf etdi.',
    'Kimin birinci başladığı araşdırılmadı.',
    'Deyilən sözlər geri götürüldü.',
    'Mövzu bir daha qaldırılmayacaq.',
    'Söhbət sakit şəraitdə aparıldı.',
    'Üçüncü şəxslər cəlb edilmədi.',
    'Barışıq həmin gün baş verdi.',
    'Hər ikisi ilk addımı atmağa hazır idi.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Qərar qüvvəyə mindiyi andan mübahisə bağlanmış sayılır və gələcəkdə arqument kimi istifadə edilmir.',
    'Qərar hər iki tərəfin razılığı ilə qəbul edilib.',
    'Sənəd xatirə kimi saxlanılır.'
  ]
},
{
  id: 'birge-heyat-sazisi', cat: 'x-love', tone: 'xatire', layout: 'muqavile', palette: 'burgundy',
  title: 'Birgə Həyatın Gündəlik Qaydalarının Razılaşdırılması üzrə Saziş', tag: 'Saziş',
  signOrg: 'Birgə Həyat Xatirələrinin Qeydiyyatı Şöbəsi',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'SON SÖZ',
  preamble: 'Bu sazişlə {from} və {to} birgə həyatın gündəlik qaydalarını razılaşdırırlar. Saziş heç bir tərəfə üstünlük vermir, hər iki tərəfin rahatlığını əsas götürür və yalnız birgə söhbətdən sonra dəyişdirilir.',
  powers: 'Səhər çayı növbə ilə hazırlanır.\nMübahisə axşama saxlanılmır.\nYorğun gün susmaqla keçirilə bilər.\nPlanlar həmişə birlikdə qurulur.',
  penalty: 'Saziş dəyişə bilər, lakin dəyişiklik yalnız birgə söhbətdən sonra edilir. Bu qayda özü sazişin əsas bəndidir.',
  titleOptions: [
    'Birgə Həyatın Gündəlik Qaydalarının Razılaşdırılması üzrə Saziş',
    'Ev və Gündəlik Öhdəliklərin Bölgüsü üzrə Xatirə Sazişi',
    'Birgə Yaşayışın Sadə Qaydaları üzrə Səmimi Saziş',
    'Gündəlik Həyatın Nizamı üzrə Qarşılıqlı Saziş'
  ],
  powersOptions: [
    'Səhər çayı növbə ilə hazırlanır.',
    'Mübahisə axşama saxlanılmır.',
    'Yorğun gün susmaqla keçirilə bilər.',
    'Planlar həmişə birlikdə qurulur.',
    'Ev işləri bərabər bölünür.',
    'Qonaqlar birgə qarşılanır.',
    'Səyahət marşrutu ortaq seçilir.',
    'Maliyyə qərarları birgə qəbul edilir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Saziş dəyişə bilər, lakin dəyişiklik yalnız birgə söhbətdən sonra edilir. Bu qayda özü sazişin əsas bəndidir.',
    'Saziş hər il yenidən oxunur.',
    'Sənəd ailə arxivində saxlanılır.'
  ]
},
{
  id: 'sevgi-teleqrami', cat: 'x-love', tone: 'xatire', layout: 'teleqram', palette: 'rose',
  title: 'Qısa və Səmimi Sözlərin Təcili Çatdırılması haqqında Teleqram', tag: 'Qısa mesaj',
  signOrg: 'Səmimi Bəyanatların Təsdiqi üzrə Şura',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'SON SÖZ',
  preamble: 'Sizə bildiririk ki, {from} tərəfindən {to} adlı şəxsə ünvanlanmış qısa və səmimi mesaj çatdırılır. Mesaj uzun izahat tələb etmir, olduğu kimi qəbul edilməli və xatirə kimi saxlanılmalıdır.',
  powers: 'Düşünülən ad dəyişməyib.\nUzaqlıq heç nəyi azaltmayıb.\nSözlər qısadır, çünki artıq bilinir.\nCavab gözlənilir, lakin tələb edilmir.',
  penalty: 'Teleqram heç bir öhdəlik yaratmır. Yeganə gözlənti — oxunduğu anda eyni hissin xatırlanmasıdır.',
  titleOptions: [
    'Qısa və Səmimi Sözlərin Təcili Çatdırılması haqqında Teleqram',
    'Uzun İzahatsız Deyilmiş Sözlərin Teleqramı',
    'Bir Cümləyə Sığan Hissin Rəsmi Teleqramı',
    'Səmimi Mesajın Təcili Çatdırılması haqqında Teleqram'
  ],
  powersOptions: [
    'Düşünülən ad dəyişməyib.',
    'Uzaqlıq heç nəyi azaltmayıb.',
    'Sözlər qısadır, çünki artıq bilinir.',
    'Cavab gözlənilir, lakin tələb edilmir.',
    'Mesaj gecikmədən göndərilib.',
    'Heç bir şərt qoyulmayıb.',
    'Qısalıq səmimiyyəti azaltmır.',
    'Sənəd xatirə kimi saxlanılır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Teleqram heç bir öhdəlik yaratmır. Yeganə gözlənti — oxunduğu anda eyni hissin xatırlanmasıdır.',
    'Teleqram müddətsizdir və geri götürülmür.',
    'Mesaj olduğu kimi arxivə verilir.'
  ]
},
{
  id: 'birge-heyat-vesiqesi', cat: 'x-love', tone: 'xatire', layout: 'vesiqe', palette: 'gold',
  title: 'Birgə Həyatın Başlanğıcını və Davamını Təsdiq edən Xatirə Vəsiqəsi', tag: 'Vəsiqə',
  signOrg: 'Birgə Həyat Xatirələrinin Qeydiyyatı Şöbəsi',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'SON SÖZ',
  preamble: 'Bu vəsiqə {from} və {to} arasındakı birgə həyatın başlanğıcını və davamını təsdiq edir. Sənəd rəsmi qeydiyyat əvəzinə deyil, xatirə kimi tərtib olunmuş və ailə arxivinə daxil edilmişdir.',
  powers: 'Ünvan hər ikisi üçün eynidir.\nPlanlar ortaq siyahıda saxlanılır.\nÇətin qərarlar birgə qəbul edilir.\nSevinc və qayğı bərabər bölünür.',
  penalty: 'Vəsiqə müddətsizdir. Onun qüvvədə qalması üçün tələb olunan yeganə şərt — birlikdə davam etməkdir.',
  titleOptions: [
    'Birgə Həyatın Başlanğıcını və Davamını Təsdiq edən Xatirə Vəsiqəsi',
    'Ortaq Ünvanın və Birgə Həyatın Təsdiqinə dair Vəsiqə',
    'Birgə Keçirilmiş İllərin Qeydiyyatına dair Xatirə Vəsiqəsi',
    'Ailə Statusunun Xatirə Qaydasında Təsdiqinə dair Vəsiqə'
  ],
  powersOptions: [
    'Ünvan hər ikisi üçün eynidir.',
    'Planlar ortaq siyahıda saxlanılır.',
    'Çətin qərarlar birgə qəbul edilir.',
    'Sevinc və qayğı bərabər bölünür.',
    'Səhər saatları eyni cür başlayır.',
    'Qonaqlar hər ikisini soruşur.',
    'Ailələr bir-birinə yaxınlaşıb.',
    'Gələcək planları eyni cümlə ilə başlayır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Vəsiqə müddətsizdir. Onun qüvvədə qalması üçün tələb olunan yeganə şərt — birlikdə davam etməkdir.',
    'Vəsiqə ailə arxivində saxlanılır.',
    'Sənəd hər ildönümündə yenidən baxılır.'
  ]
},

/* ==================== TƏŞƏKKÜR ==================== */
{
  id: 'tesekkurname', cat: 'x-thanks', tone: 'xatire', layout: 'blank', palette: 'steel',
  title: 'Göstərilmiş Köməyə, Diqqətə və Zəhmətə Görə Rəsmi Təşəkkürnamə', tag: 'Klassik',
  signOrg: 'Minnətdarlıq və Təltiflərin Qeydiyyatı Palatası',
  toLabel: 'TƏLTİF OLUNAN', fromLabel: 'TƏQDİM EDƏN', powersLabel: 'XİDMƏTLƏR', penaltyLabel: 'QEYD',
  preamble: 'Bu təşəkkürnamə ilə {from} tərəfindən {to} adlı şəxsə göstərdiyi kömək və diqqətə görə səmimi minnətdarlıq bildirilir. Kömək xahiş edilmədən göstərilmiş və heç bir qarşılıq gözlənilməmişdir.',
  powers: 'Kömək xahiş edilmədən göstərildi.\nHeç bir qarşılıq gözlənilmədi.\nVaxt və zəhmət əsirgənmədi.\nBu jest unudulmayacaq.',
  penalty: 'Təşəkkürnamə heç bir öhdəlik yaratmır. Onun yeganə məqsədi minnətdarlığın yazılı şəkildə qeydə alınmasıdır.',
  titleOptions: [
    'Göstərilmiş Köməyə, Diqqətə və Zəhmətə Görə Rəsmi Təşəkkürnamə',
    'Xahiş Edilmədən Göstərilən Dəstəyə Görə Rəsmi Təşəkkürnamə',
    'Çətin Anda Yanında Olmağa Görə Verilmiş Təşəkkürnamə',
    'Uzunmüddətli Diqqətə və Qayğıya Görə Təşəkkürnamə'
  ],
  powersOptions: [
    'Kömək xahiş edilmədən göstərildi.',
    'Heç bir qarşılıq gözlənilmədi.',
    'Vaxt və zəhmət əsirgənmədi.',
    'Bu jest unudulmayacaq.',
    'Ən çətin gündə yanında olundu.',
    'Söz verildi və sözdə duruldu.',
    'Heç bir izahat tələb edilmədi.',
    'Kömək sakitcə, səssizcə göstərildi.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Təşəkkürnamə heç bir öhdəlik yaratmır. Onun yeganə məqsədi minnətdarlığın yazılı şəkildə qeydə alınmasıdır.',
    'Sənəd müddətsizdir və geri götürülmür.',
    'Təşəkkür ilk fürsətdə şəxsən də təkrarlanacaq.'
  ]
},
{
  id: 'fexri-ferman', cat: 'x-thanks', tone: 'xatire', layout: 'diplom', palette: 'burgundy',
  title: 'Uzunmüddətli Zəhmətə və Nümunəvi Fəaliyyətə Görə Fəxri Fərman', tag: 'Təltif',
  signOrg: 'Fəxri Adların Təsdiqi üzrə Səmimi Şura',
  toLabel: 'TƏLTİF OLUNAN', fromLabel: 'TƏQDİM EDƏN', powersLabel: 'XİDMƏTLƏR', penaltyLabel: 'QEYD',
  preamble: 'Şura {to} adlı şəxsin uzun illər ərzində göstərdiyi zəhməti və nümunəvi fəaliyyəti qiymətləndirərək təltif haqqında qərar qəbul etmişdir. Fərman {from} tərəfindən təqdim olunur, müddətsizdir və geri alınmır.',
  powers: 'Zəhmət illər boyu fasiləsiz davam etdi.\nNəticələr sözlə deyil, işlə göstərildi.\nÇətinliklər səbrlə qarşılandı.\nNümunə başqaları üçün örnək oldu.',
  penalty: 'Fərman geri alınmır. Təltif olunan şəxs bu sənədi öz arxivində saxlamaq hüququna malikdir.',
  titleOptions: [
    'Uzunmüddətli Zəhmətə və Nümunəvi Fəaliyyətə Görə Fəxri Fərman',
    'İllər Ərzində Göstərilmiş Səyə Görə Verilmiş Fəxri Fərman',
    'Nümunəvi Əməyin Qiymətləndirilməsinə dair Fəxri Fərman',
    'Xüsusi Xidmətlərə Görə Təqdim Edilmiş Fəxri Fərman'
  ],
  powersOptions: [
    'Zəhmət illər boyu fasiləsiz davam etdi.',
    'Nəticələr sözlə deyil, işlə göstərildi.',
    'Çətinliklər səbrlə qarşılandı.',
    'Nümunə başqaları üçün örnək oldu.',
    'Heç bir iş yarımçıq qoyulmadı.',
    'Kömək həmişə vaxtında gəldi.',
    'Tərif gözlənilmədi.',
    'Səhvlər səbrlə düzəldildi.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Fərman geri alınmır. Təltif olunan şəxs bu sənədi öz arxivində saxlamaq hüququna malikdir.',
    'Fərman müddətsizdir və yenidən təsdiq tələb etmir.',
    'Sənəd ailə arxivində saxlanılır.'
  ]
},
{
  id: 'muellime-minnetdarliq', cat: 'x-thanks', tone: 'xatire', layout: 'notarial', palette: 'forest',
  title: 'Müəllim Zəhmətinə Görə Ünvanlanmış Rəsmi Minnətdarlıq Məktubu', tag: 'Müəllim',
  signOrg: 'Göstərilən Əməyin Qiymətləndirilməsi Şöbəsi',
  toLabel: 'TƏLTİF OLUNAN', fromLabel: 'TƏQDİM EDƏN', powersLabel: 'XİDMƏTLƏR', penaltyLabel: 'QEYD',
  preamble: 'Bu məktubla {from} tərəfindən {to} adlı şəxsə müəllim zəhmətinə görə səmimi minnətdarlıq bildirilir. Verilən biliklər və göstərilən səbr illər sonra da yaddan çıxmamış, gündəlik həyatda öz yerini tapmışdır.',
  powers: 'Dərslər illər sonra da xatırlanır.\nSəbr heç vaxt tükənmədi.\nHər şagirdə ayrıca yanaşıldı.\nVerilən bilik həyatda işə yaradı.',
  penalty: 'Bu məktub heç bir öhdəlik yaratmır. O, yalnız vaxtında deyilməmiş sözlərin yazıya alınmasıdır.',
  titleOptions: [
    'Müəllim Zəhmətinə Görə Ünvanlanmış Rəsmi Minnətdarlıq Məktubu',
    'Verilmiş Biliyə və Səbrə Görə Minnətdarlıq Məktubu',
    'İllər Sonra Da Xatırlanan Dərslərə Görə Məktub',
    'Müəllim Əməyinin Qiymətləndirilməsinə dair Məktub'
  ],
  powersOptions: [
    'Dərslər illər sonra da xatırlanır.',
    'Səbr heç vaxt tükənmədi.',
    'Hər şagirdə ayrıca yanaşıldı.',
    'Verilən bilik həyatda işə yaradı.',
    'Çətin sual heç vaxt cavabsız qalmadı.',
    'Səhvlər incidilmədən düzəldildi.',
    'Dərsdən sonra da vaxt ayrıldı.',
    'İnam ilk növbədə müəllimdən gəldi.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Bu məktub heç bir öhdəlik yaratmır. O, yalnız vaxtında deyilməmiş sözlərin yazıya alınmasıdır.',
    'Məktub müddətsizdir və arxivdə saxlanılır.',
    'Minnətdarlıq şəxsən də çatdırılacaq.'
  ]
},
{
  id: 'ilin-anasi', cat: 'x-thanks', tone: 'xatire', layout: 'viza', palette: 'rose',
  title: 'Ana Zəhmətinin Qiymətləndirilməsinə Görə Verilmiş Fəxri Ad', tag: 'Ana',
  signOrg: 'Fəxri Adların Təsdiqi üzrə Səmimi Şura',
  toLabel: 'TƏLTİF OLUNAN', fromLabel: 'TƏQDİM EDƏN', powersLabel: 'XİDMƏTLƏR', penaltyLabel: 'QEYD',
  preamble: 'Şura {to} adlı şəxsin illər boyu göstərdiyi qayğını, səbri və zəhməti qiymətləndirərək fəxri adın verilməsi barədə qərar qəbul etmişdir. Sənəd {from} tərəfindən təqdim olunur və ailə arxivində saxlanılır.',
  powers: 'Gecələr yuxusuz keçdi, şikayət olmadı.\nƏn son özü üçün düşünüldü.\nHər uğur birinci onunla bölüşüldü.\nQayğı heç vaxt azalmadı.',
  penalty: 'Fəxri ad müddətsizdir və heç bir halda geri alınmır. Sənəd ailə arxivinin ən dəyərli vərəqi kimi saxlanılır.',
  titleOptions: [
    'Ana Zəhmətinin Qiymətləndirilməsinə Görə Verilmiş Fəxri Ad',
    'İllər Boyu Göstərilmiş Qayğıya Görə Fəxri Ad',
    'Səbr və Sevgi Sahəsindəki Nəticələrə Görə Fəxri Ad',
    'Ana Əməyinin Rəsmi Tanınmasına dair Fəxri Ad'
  ],
  powersOptions: [
    'Gecələr yuxusuz keçdi, şikayət olmadı.',
    'Ən son özü üçün düşünüldü.',
    'Hər uğur birinci onunla bölüşüldü.',
    'Qayğı heç vaxt azalmadı.',
    'Ev həmişə isti və nizamlı qaldı.',
    'Çətin günlərdə səs ucaldılmadı.',
    'Səhvlər bağışlandı, xatırladılmadı.',
    'Sevgi şərtsiz oldu.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Fəxri ad müddətsizdir və heç bir halda geri alınmır. Sənəd ailə arxivinin ən dəyərli vərəqi kimi saxlanılır.',
    'Ad hər il yenidən təsdiqlənir.',
    'Sənəd nəsildən-nəslə ötürülür.'
  ]
},
{
  id: 'hekime-minnetdarliq', cat: 'x-thanks', tone: 'xatire', layout: 'sertifikat', palette: 'steel',
  title: 'Göstərilmiş Tibbi Yardıma və Diqqətə Görə Minnətdarlıq Sənədi', tag: 'Həkim',
  signOrg: 'Göstərilən Əməyin Qiymətləndirilməsi Şöbəsi',
  toLabel: 'TƏLTİF OLUNAN', fromLabel: 'TƏQDİM EDƏN', powersLabel: 'XİDMƏTLƏR', penaltyLabel: 'QEYD',
  preamble: 'Bu sənədlə {from} tərəfindən {to} adlı şəxsə göstərdiyi tibbi yardıma və insani münasibətə görə səmimi minnətdarlıq bildirilir. Peşəkarlıqla yanaşı göstərilən diqqət ayrıca qeyd olunur.',
  powers: 'Diaqnoz sakit və aydın izah edildi.\nSual vermək üçün vaxt ayrıldı.\nNarahatlıq lazımsız yerə artırılmadı.\nNəticə səbrlə gözlənildi və izah olundu.',
  penalty: 'Sənəd heç bir öhdəlik yaratmır. O, göstərilən diqqətin yazılı qaydada qeydə alınmasıdır.',
  titleOptions: [
    'Göstərilmiş Tibbi Yardıma və Diqqətə Görə Minnətdarlıq Sənədi',
    'Peşəkarlıq və İnsani Münasibətə Görə Minnətdarlıq Sənədi',
    'Çətin Anda Göstərilən Köməyə Görə Rəsmi Sənəd',
    'Həkim Əməyinin Qiymətləndirilməsinə dair Sənəd'
  ],
  powersOptions: [
    'Diaqnoz sakit və aydın izah edildi.',
    'Sual vermək üçün vaxt ayrıldı.',
    'Narahatlıq lazımsız yerə artırılmadı.',
    'Nəticə səbrlə gözlənildi və izah olundu.',
    'Gecə saatlarında da əlaqə saxlanıldı.',
    'Ailə üzvləri məlumatlandırıldı.',
    'Müalicə addım-addım aparıldı.',
    'İnam ilk gündən yarandı.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Sənəd heç bir öhdəlik yaratmır. O, göstərilən diqqətin yazılı qaydada qeydə alınmasıdır.',
    'Minnətdarlıq müddətsizdir.',
    'Sənəd ailə arxivində saxlanılır.'
  ]
},
{
  id: 'komandaya-tesekkur', cat: 'x-thanks', tone: 'xatire', layout: 'ekspertiza', palette: 'forest',
  title: 'Birgə Görülmüş İşə və Komanda Ruhuna Görə Təşəkkür Sertifikatı', tag: 'Komanda',
  signOrg: 'Göstərilən Əməyin Qiymətləndirilməsi Şöbəsi',
  toLabel: 'TƏLTİF OLUNAN', fromLabel: 'TƏQDİM EDƏN', powersLabel: 'XİDMƏTLƏR', penaltyLabel: 'QEYD',
  preamble: 'Bununla təsdiq edilir ki, {to} adlı şəxs birgə görülən işə əhəmiyyətli töhfə vermişdir. Sertifikat {from} tərəfindən komandanın bütün üzvlərinin razılığı ilə, layihənin yekununda təqdim olunur.',
  powers: 'Çətin mərhələdə komanda tərk edilmədi.\nSəhvlər üçün heç kim günahlandırılmadı.\nKömək xahiş edilmədən göstərildi.\nNəticə ortaq sayıldı.',
  penalty: 'Sertifikat komandanın bütün üzvlərinə eyni qaydada aiddir və heç birinin töhfəsini digərindən üstün tutmur.',
  titleOptions: [
    'Birgə Görülmüş İşə və Komanda Ruhuna Görə Təşəkkür Sertifikatı',
    'Çətin Layihənin Birgə Tamamlanmasına Görə Sertifikat',
    'Komanda Daxilində Göstərilən Dəstəyə Görə Sertifikat',
    'Ortaq Nəticəyə Verilən Töhfəyə Görə Sertifikat'
  ],
  powersOptions: [
    'Çətin mərhələdə komanda tərk edilmədi.',
    'Səhvlər üçün heç kim günahlandırılmadı.',
    'Kömək xahiş edilmədən göstərildi.',
    'Nəticə ortaq sayıldı.',
    'Gecə saatlarında da əlaqə saxlanıldı.',
    'Yeni üzvlərə dəstək verildi.',
    'Fikir ayrılığı işə mane olmadı.',
    'Uğur birlikdə qeyd edildi.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Sertifikat komandanın bütün üzvlərinə eyni qaydada aiddir və heç birinin töhfəsini digərindən üstün tutmur.',
    'Sertifikat layihə arxivində saxlanılır.',
    'Təltif növbəti layihədə də təkrarlana bilər.'
  ]
},
{
  id: 'ustadliq-lisenziyasi', cat: 'x-thanks', tone: 'xatire', layout: 'lisenziya', palette: 'gold',
  title: 'Peşəkarlıq Səviyyəsinin və Ustadlığın Tanınmasına dair Lisenziya', tag: 'Ustadlıq',
  signOrg: 'Fəxri Adların Təsdiqi üzrə Səmimi Şura',
  toLabel: 'TƏLTİF OLUNAN', fromLabel: 'TƏQDİM EDƏN', powersLabel: 'XİDMƏTLƏR', penaltyLabel: 'QEYD',
  preamble: '{from} tərəfindən {to} adlı şəxsin öz sahəsindəki ustadlığı rəsmi qaydada tanınır. Lisenziya uzunmüddətli müşahidə, işin nəticələrinin qiymətləndirilməsi və həmkarların rəyi əsasında verilmişdir.',
  powers: 'İş həmişə vaxtında və keyfiyyətlə görülür.\nÇətin tapşırıqdan imtina edilmir.\nTəcrübə heç kimdən gizlədilmir.\nNəticə sözlə deyil, işlə göstərilir.',
  penalty: 'Lisenziya müddətsizdir. Onun qüvvədə qalması üçün yeganə şərt — öyrənməyə davam etməkdir.',
  titleOptions: [
    'Peşəkarlıq Səviyyəsinin və Ustadlığın Tanınmasına dair Lisenziya',
    'Sahədəki Təcrübənin Rəsmi Tanınmasına dair Lisenziya',
    'Ustadlıq Statusunun Təsdiqinə dair Xatirə Lisenziyası',
    'İşin Keyfiyyətinin Qiymətləndirilməsinə dair Lisenziya'
  ],
  powersOptions: [
    'İş həmişə vaxtında və keyfiyyətlə görülür.',
    'Çətin tapşırıqdan imtina edilmir.',
    'Təcrübə heç kimdən gizlədilmir.',
    'Nəticə sözlə deyil, işlə göstərilir.',
    'Yeni gələnlərə həmişə kömək edilir.',
    'Səhv olduqda özü etiraf edilir.',
    'Alət və vasitələr nizamda saxlanılır.',
    'Öyrənmək heç vaxt dayandırılmır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Lisenziya müddətsizdir. Onun qüvvədə qalması üçün yeganə şərt — öyrənməyə davam etməkdir.',
    'Lisenziya hər il yenidən təsdiqlənir.',
    'Sənəd peşə arxivində saxlanılır.'
  ]
},
{
  id: 'xidmetler-arayisi', cat: 'x-thanks', tone: 'xatire', layout: 'arayis', palette: 'ink',
  title: 'Göstərilmiş Köməyin Həcmi və Xarakteri haqqında Rəsmi Arayış', tag: 'Arayış',
  signOrg: 'Minnətdarlıq və Təltiflərin Qeydiyyatı Palatası',
  toLabel: 'TƏLTİF OLUNAN', fromLabel: 'TƏQDİM EDƏN', powersLabel: 'XİDMƏTLƏR', penaltyLabel: 'QEYD',
  preamble: 'Verilir {to} adlı şəxsə ondan ötrü ki, uzun müddət ərzində göstərdiyi kömək {from} tərəfindən qeydə alınmışdır. Arayış həmin köməyin həcmini və xarakterini əks etdirir, qaytarılma tələbi kimi qəbul edilmir.',
  powers: 'Kömək xahiş edilmədən göstərildi.\nHeç bir hesab aparılmadı.\nVaxt və imkan əsirgənmədi.\nBu kömək unudulmayacaq.',
  penalty: 'Arayış heç bir öhdəlik yaratmır və qaytarılma tələbi kimi qəbul edilmir. O, sadəcə qeydə alınmış minnətdarlıqdır.',
  titleOptions: [
    'Göstərilmiş Köməyin Həcmi və Xarakteri haqqında Rəsmi Arayış',
    'Uzunmüddətli Dəstəyin Qeydə Alınması haqqında Arayış',
    'Xahiş Edilmədən Görülən İşlər haqqında Rəsmi Arayış',
    'Göstərilən Yardımın Təsdiqinə dair Xatirə Arayışı'
  ],
  powersOptions: [
    'Kömək xahiş edilmədən göstərildi.',
    'Heç bir hesab aparılmadı.',
    'Vaxt və imkan əsirgənmədi.',
    'Bu kömək unudulmayacaq.',
    'Ən çətin gündə də əlaqə kəsilmədi.',
    'Söz verilib, sözdə duruldu.',
    'Heç nə qarşılıq gözlənilmədi.',
    'Kömək səssizcə göstərildi.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Arayış heç bir öhdəlik yaratmır və qaytarılma tələbi kimi qəbul edilmir. O, sadəcə qeydə alınmış minnətdarlıqdır.',
    'Arayış müddətsizdir.',
    'Sənəd xatirə arxivində saxlanılır.'
  ]
},
{
  id: 'teltif-qerari', cat: 'x-thanks', tone: 'xatire', layout: 'qerar', palette: 'gold',
  title: 'Göstərilmiş Xidmətlərə Görə Təltif Edilməsi haqqında Qərar', tag: 'Qərar',
  signOrg: 'Fəxri Adların Təsdiqi üzrə Səmimi Şura',
  toLabel: 'TƏLTİF OLUNAN', fromLabel: 'TƏQDİM EDƏN', powersLabel: 'XİDMƏTLƏR', penaltyLabel: 'QEYD',
  preamble: 'Şura {to} adlı şəxsin göstərdiyi xidmətləri araşdıraraq təltif edilməsi barədə qərar qəbul etmişdir. Qərar {from} tərəfindən verilmiş təqdimat əsasında və yekdilliklə qəbul olunmuşdur.',
  powers: 'Xidmətlərin həcmi tam qiymətləndirildi.\nTəltif yekdilliklə qəbul edildi.\nHeç bir etiraz daxil olmadı.\nQərar dərhal qüvvəyə minir.',
  penalty: 'Təltif geri alınmır. Qərar təltif olunan şəxsin şəxsi arxivində saxlanılmaq üçün ona təqdim edilir.',
  titleOptions: [
    'Göstərilmiş Xidmətlərə Görə Təltif Edilməsi haqqında Qərar',
    'Nümunəvi Fəaliyyətə Görə Təltif haqqında Yekun Qərar',
    'Xüsusi Töhfənin Qiymətləndirilməsi haqqında Qərar',
    'Fəxri Adın Verilməsi haqqında Rəsmi Qərar'
  ],
  powersOptions: [
    'Xidmətlərin həcmi tam qiymətləndirildi.',
    'Təltif yekdilliklə qəbul edildi.',
    'Heç bir etiraz daxil olmadı.',
    'Qərar dərhal qüvvəyə minir.',
    'Nəticələr sənədlərlə təsdiqləndi.',
    'Kollektivin rəyi soruşuldu.',
    'Təqdimat vaxtında verildi.',
    'Sənəd arxivə daxil edildi.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Təltif geri alınmır. Qərar təltif olunan şəxsin şəxsi arxivində saxlanılmaq üçün ona təqdim edilir.',
    'Qərar müddətsizdir.',
    'Təltif növbəti ildə də təkrarlana bilər.'
  ]
},
{
  id: 'minnetdarliq-sazisi', cat: 'x-thanks', tone: 'xatire', layout: 'muqavile', palette: 'rose',
  title: 'Qarşılıqlı Minnətdarlığın Rəsmi Qaydada Bəyanı üzrə Saziş', tag: 'Saziş',
  signOrg: 'Minnətdarlıq və Təltiflərin Qeydiyyatı Palatası',
  toLabel: 'TƏLTİF OLUNAN', fromLabel: 'TƏQDİM EDƏN', powersLabel: 'XİDMƏTLƏR', penaltyLabel: 'QEYD',
  preamble: 'Bu sazişlə {from} və {to} bir-birinə göstərdikləri dəstəyə görə qarşılıqlı minnətdarlıq bildirirlər. Saziş heç bir tərəfin töhfəsini digərindən üstün tutmur və heç bir öhdəlik yaratmır.',
  powers: 'Kömək hər iki istiqamətdə göstərildi.\nHeç bir hesab aparılmadı.\nÇətin günlərdə əlaqə kəsilmədi.\nMinnətdarlıq qarşılıqlıdır.',
  penalty: 'Saziş heç bir öhdəlik yaratmır. O, yalnız qarşılıqlı minnətdarlığın yazılı qaydada təsbitidir.',
  titleOptions: [
    'Qarşılıqlı Minnətdarlığın Rəsmi Qaydada Bəyanı üzrə Saziş',
    'Bir-Birinə Göstərilən Dəstəyin Təsdiqi üzrə Saziş',
    'Qarşılıqlı Köməyin Qeydə Alınması üzrə Xatirə Sazişi',
    'Ortaq Minnətdarlığın Bəyanı üzrə Səmimi Saziş'
  ],
  powersOptions: [
    'Kömək hər iki istiqamətdə göstərildi.',
    'Heç bir hesab aparılmadı.',
    'Çətin günlərdə əlaqə kəsilmədi.',
    'Minnətdarlıq qarşılıqlıdır.',
    'Söz verilib, sözdə duruldu.',
    'Səhvlər bağışlandı.',
    'Uğurlar birgə qeyd edildi.',
    'Dəstək heç vaxt şərtli olmadı.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Saziş heç bir öhdəlik yaratmır. O, yalnız qarşılıqlı minnətdarlığın yazılı qaydada təsbitidir.',
    'Saziş müddətsizdir.',
    'Sənəd hər iki tərəfdə saxlanılır.'
  ]
},
{
  id: 'tesekkur-teleqrami', cat: 'x-thanks', tone: 'xatire', layout: 'teleqram', palette: 'burgundy',
  title: 'Səmimi Minnətdarlığın Təcili Çatdırılması haqqında Teleqram', tag: 'Qısa mesaj',
  signOrg: 'Minnətdarlıq və Təltiflərin Qeydiyyatı Palatası',
  toLabel: 'TƏLTİF OLUNAN', fromLabel: 'TƏQDİM EDƏN', powersLabel: 'XİDMƏTLƏR', penaltyLabel: 'QEYD',
  preamble: 'Sizə bildiririk ki, {from} tərəfindən {to} adlı şəxsə ünvanlanmış təşəkkür mesajı çatdırılır. Mesaj qısadır, çünki deyiləcək sözlər artıq hər iki tərəfə məlumdur və izahat tələb etmir.',
  powers: 'Kömək vaxtında gəldi.\nHeç nə qarşılıq gözlənilmədi.\nBu jest unudulmayacaq.\nTəşəkkür şəxsən də təkrarlanacaq.',
  penalty: 'Teleqram heç bir öhdəlik yaratmır. Yeganə məqsəd minnətdarlığın vaxtında çatdırılmasıdır.',
  titleOptions: [
    'Səmimi Minnətdarlığın Təcili Çatdırılması haqqında Teleqram',
    'Qısa Sözlərlə Bildirilmiş Təşəkkür haqqında Teleqram',
    'Vaxtında Deyilməmiş Minnətdarlığın Teleqramı',
    'Təşəkkürün Rəsmi Çatdırılması haqqında Teleqram'
  ],
  powersOptions: [
    'Kömək vaxtında gəldi.',
    'Heç nə qarşılıq gözlənilmədi.',
    'Bu jest unudulmayacaq.',
    'Təşəkkür şəxsən də təkrarlanacaq.',
    'Mesaj gecikmədən göndərildi.',
    'Sözlər sadə seçildi.',
    'Heç bir şərt qoyulmadı.',
    'Sənəd xatirə kimi saxlanılır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Teleqram heç bir öhdəlik yaratmır. Yeganə məqsəd minnətdarlığın vaxtında çatdırılmasıdır.',
    'Teleqram müddətsizdir.',
    'Mesaj olduğu kimi arxivə verilir.'
  ]
},
{
  id: 'fexri-uzv-vesiqesi', cat: 'x-thanks', tone: 'xatire', layout: 'vesiqe', palette: 'ink',
  title: 'Fəxri Üzvlük Statusunun Tanınmasına dair Xatirə Vəsiqəsi', tag: 'Vəsiqə',
  signOrg: 'Fəxri Adların Təsdiqi üzrə Səmimi Şura',
  toLabel: 'TƏLTİF OLUNAN', fromLabel: 'TƏQDİM EDƏN', powersLabel: 'XİDMƏTLƏR', penaltyLabel: 'QEYD',
  preamble: 'Bu vəsiqə {to} adlı şəxsin fəxri üzv statusunu təsdiq edir. Sənəd {from} tərəfindən, kollektivə verilən uzunmüddətli töhfə və həmkarların yekdil müsbət rəyi nəzərə alınaraq verilmişdir.',
  powers: 'Töhfə uzun illər davam etdi.\nKollektivin rəyi yekdil oldu.\nHeç bir çətinlikdə geri çəkilmədi.\nStatus müddətsiz tanınır.',
  penalty: 'Vəsiqə müddətsizdir və geri alınmır. Fəxri üzv istənilən vaxt kollektivə qayıtmaq hüququna malikdir.',
  titleOptions: [
    'Fəxri Üzvlük Statusunun Tanınmasına dair Xatirə Vəsiqəsi',
    'Kollektivə Verilən Töhfənin Təsdiqinə dair Vəsiqə',
    'Daimi Fəxri Üzv Statusuna dair Xatirə Vəsiqəsi',
    'Fəxri Adın Rəsmi Təsdiqinə dair Vəsiqə'
  ],
  powersOptions: [
    'Töhfə uzun illər davam etdi.',
    'Kollektivin rəyi yekdil oldu.',
    'Heç bir çətinlikdə geri çəkilmədi.',
    'Status müddətsiz tanınır.',
    'Yeni üzvlərə dəstək göstərildi.',
    'Ənənələr qorunub saxlanıldı.',
    'Tədbirlərdə iştirak fasiləsiz oldu.',
    'Təcrübə həvəslə bölüşüldü.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Vəsiqə müddətsizdir və geri alınmır. Fəxri üzv istənilən vaxt kollektivə qayıtmaq hüququna malikdir.',
    'Vəsiqə kollektiv arxivində saxlanılır.',
    'Status hər il yenidən elan olunur.'
  ]
},

/* ==================== MƏRHƏLƏ ==================== */
{
  id: 'mezuniyyet-diplomu', cat: 'x-milestone', tone: 'xatire', layout: 'diplom', palette: 'gold',
  title: 'Təhsil Mərhələsinin Tamamlanmasını Təsdiq edən Xatirə Diplomu', tag: 'Məzuniyyət',
  signOrg: 'Həyat Mərhələlərinin Qeydiyyatı üzrə Palata',
  toLabel: 'SƏNƏD SAHİBİ', fromLabel: 'TƏQDİM EDƏN', powersLabel: 'QEYDƏ ALINAN', penaltyLabel: 'ARZU',
  preamble: 'Bu diplomla təsdiq olunur ki, {to} adlı şəxs təhsil mərhələsini tamamlamışdır. Sənəd {from} tərəfindən təqdim olunur və keçən illərin zəhmətini, yuxusuz gecələri və qazanılmış dostluqları xatirə qaydasında qeydə alır.',
  powers: 'İllər boyu davam edən zəhmət başa çatdı.\nYuxusuz gecələr öz nəticəsini verdi.\nQazanılan dostluqlar diplomdan qiymətlidir.\nYeni mərhələ artıq başlayıb.',
  penalty: 'Diplom müddətsizdir. Onun əsl dəyəri divarda deyil, illər sonra bu dövrün necə xatırlanmasında ölçülür.',
  titleOptions: [
    'Təhsil Mərhələsinin Tamamlanmasını Təsdiq edən Xatirə Diplomu',
    'Uzun İllərin Zəhmətinin Yekununa dair Xatirə Diplomu',
    'Auditoriyada Keçən Dövrün Qeydiyyatına dair Diplom',
    'Yeni Mərhələyə Keçidi Təsdiq edən Xatirə Diplomu'
  ],
  powersOptions: [
    'İllər boyu davam edən zəhmət başa çatdı.',
    'Yuxusuz gecələr öz nəticəsini verdi.',
    'Qazanılan dostluqlar diplomdan qiymətlidir.',
    'Yeni mərhələ artıq başlayıb.',
    'Ən çətin imtahan arxada qaldı.',
    'Auditoriya və koridorlar yadda qalacaq.',
    'Müəllimlərin adları unudulmayacaq.',
    'Bilik həyatda tətbiq olunacaq.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Diplom müddətsizdir. Onun əsl dəyəri divarda deyil, illər sonra bu dövrün necə xatırlanmasında ölçülür.',
    'Sənəd ailə arxivində saxlanılır.',
    'Diplom hər ildönümündə yenidən oxunur.'
  ]
},
{
  id: 'ilk-addim', cat: 'x-milestone', tone: 'xatire', layout: 'sertifikat', palette: 'rose',
  title: 'İlk Addımın Atıldığı Günün Rəsmi Qaydada Xatirə Şəhadətnaməsi', tag: 'İlk addım',
  signOrg: 'Həyat Mərhələlərinin Qeydiyyatı üzrə Palata',
  toLabel: 'SƏNƏD SAHİBİ', fromLabel: 'TƏQDİM EDƏN', powersLabel: 'QEYDƏ ALINAN', penaltyLabel: 'ARZU',
  preamble: 'Bu şəhadətnamə ilə təsdiq olunur ki, {to} adlı şəxs ilk addımını atmışdır. Sənəd {from} tərəfindən tərtib edilmiş, həmin an bütün ailə üzvləri tərəfindən müşahidə olunmuş və uzun müddət danışılmışdır.',
  powers: 'Addım gözlənilmədən atıldı.\nBütün ailə həmin anda otaqda idi.\nŞəkil çəkilməyə macal olmadı.\nBu an dəfələrlə danışılacaq.',
  penalty: 'Şəhadətnamə müddətsizdir. İllər sonra bu sənəd həmin anı olduğu kimi xatırlatmaq üçün saxlanılır.',
  titleOptions: [
    'İlk Addımın Atıldığı Günün Rəsmi Qaydada Xatirə Şəhadətnaməsi',
    'Ailənin Ən Kiçik Üzvünün İlk Addımına dair Şəhadətnamə',
    'Böyümə Yolundakı İlk Mərhələnin Qeydiyyatı Şəhadətnaməsi',
    'Unudulmayacaq Bir Anın Rəsmi Xatirə Şəhadətnaməsi'
  ],
  powersOptions: [
    'Addım gözlənilmədən atıldı.',
    'Bütün ailə həmin anda otaqda idi.',
    'Şəkil çəkilməyə macal olmadı.',
    'Bu an dəfələrlə danışılacaq.',
    'Əvvəlcə divardan tutuldu.',
    'İkinci addım eyni gün atıldı.',
    'Yıxılma qorxu yaratmadı.',
    'Alqış otağı doldurdu.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Şəhadətnamə müddətsizdir. İllər sonra bu sənəd həmin anı olduğu kimi xatırlatmaq üçün saxlanılır.',
    'Sənəd ailə albomuna əlavə edilir.',
    'Şəhadətnamə uşağa yetkinlik yaşında təqdim olunur.'
  ]
},
{
  id: 'verdisi-tergitme', cat: 'x-milestone', tone: 'xatire', layout: 'ekspertiza', palette: 'forest',
  title: 'Zərərli Vərdişdən İmtina Edilməsini Təsdiq edən Xatirə Sertifikatı', tag: 'Yeni vərdiş',
  signOrg: 'Yeni Başlanğıcların Qeydiyyatı üzrə Şura',
  toLabel: 'SƏNƏD SAHİBİ', fromLabel: 'TƏQDİM EDƏN', powersLabel: 'QEYDƏ ALINAN', penaltyLabel: 'ARZU',
  preamble: 'Bununla təsdiq edilir ki, {to} adlı şəxs uzun müddət davam edən bir vərdişdən imtina etmişdir. Sertifikat {from} tərəfindən, qərarın verildiyi gündən bəri keçən müddət nəzərə alınaraq təqdim olunur.',
  powers: 'Qərar bir dəfə verildi və pozulmadı.\nİlk həftə ən çətini oldu.\nBəhanələr qəbul edilmədi.\nNəticə artıq hiss olunur.',
  penalty: 'Sertifikat müddətsizdir, lakin onun qüvvəsi yalnız qərarın davam etdirilməsi ilə təsdiqlənir.',
  titleOptions: [
    'Zərərli Vərdişdən İmtina Edilməsini Təsdiq edən Xatirə Sertifikatı',
    'Uzun Mübarizədən Sonra Qazanılmış Nəticənin Sertifikatı',
    'Yeni Həyat Rejiminə Keçidi Təsdiq edən Sertifikat',
    'Verilmiş Sözün Yerinə Yetirilməsinə dair Sertifikat'
  ],
  powersOptions: [
    'Qərar bir dəfə verildi və pozulmadı.',
    'İlk həftə ən çətini oldu.',
    'Bəhanələr qəbul edilmədi.',
    'Nəticə artıq hiss olunur.',
    'Ətrafdakılar dəyişikliyi qeyd etdi.',
    'Yeni vərdişlər köhnəsini əvəz etdi.',
    'Geri dönmək fikri yaranmadı.',
    'Bu qərar başqalarına da nümunə oldu.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Sertifikat müddətsizdir, lakin onun qüvvəsi yalnız qərarın davam etdirilməsi ilə təsdiqlənir.',
    'Sənəd şəxsi arxivdə saxlanılır.',
    'Sertifikat hər ildönümündə yenidən oxunur.'
  ]
},
{
  id: 'idman-nailiyyeti', cat: 'x-milestone', tone: 'xatire', layout: 'viza', palette: 'steel',
  title: 'İdman Sahəsində Əldə Edilmiş Nəticənin Rəsmi Qeydiyyatı Sənədi', tag: 'İdman',
  signOrg: 'Nailiyyətlərin Təsdiqi və Qeydiyyatı Şöbəsi',
  toLabel: 'SƏNƏD SAHİBİ', fromLabel: 'TƏQDİM EDƏN', powersLabel: 'QEYDƏ ALINAN', penaltyLabel: 'ARZU',
  preamble: 'Bu sənədlə təsdiq olunur ki, {to} adlı şəxs idman sahəsində nəzərəçarpacaq nəticə əldə etmişdir. Sənəd {from} tərəfindən, uzunmüddətli məşq və göstərilən əzmkarlıq nəzərə alınaraq tərtib olunmuşdur.',
  powers: 'Məşqlər fasiləsiz davam etdi.\nAğrılı günlərdə də dayanılmadı.\nNəticə addım-addım yaxşılaşdı.\nŞəxsi rekord yeniləndi.',
  penalty: 'Sənəd nəticəni deyil, ona aparan yolu qeydə alır. Əsl dəyər məhz həmin yoldadır.',
  titleOptions: [
    'İdman Sahəsində Əldə Edilmiş Nəticənin Rəsmi Qeydiyyatı Sənədi',
    'Uzunmüddətli Məşqin Nəticəsini Təsdiq edən Sənəd',
    'İlk Yarışda Göstərilən Nəticənin Xatirə Sənədi',
    'Şəxsi Rekordun Qeydə Alınmasına dair Sənəd'
  ],
  powersOptions: [
    'Məşqlər fasiləsiz davam etdi.',
    'Ağrılı günlərdə də dayanılmadı.',
    'Nəticə addım-addım yaxşılaşdı.',
    'Şəxsi rekord yeniləndi.',
    'İlk yarış təcrübəsi qazanıldı.',
    'Komanda yoldaşları dəstək oldu.',
    'Məğlubiyyət motivasiyaya çevrildi.',
    'Növbəti hədəf artıq müəyyəndir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Sənəd nəticəni deyil, ona aparan yolu qeydə alır. Əsl dəyər məhz həmin yoldadır.',
    'Sənəd idman arxivində saxlanılır.',
    'Nəticə yeniləndikcə sənəd də yenilənir.'
  ]
},
{
  id: 'ilk-is-gunu', cat: 'x-milestone', tone: 'xatire', layout: 'blank', palette: 'ink',
  title: 'İlk İş Gününün Tarixinin və Təfərrüatlarının Xatirə Qeydi', tag: 'İlk iş günü',
  signOrg: 'Yeni Başlanğıcların Qeydiyyatı üzrə Şura',
  toLabel: 'SƏNƏD SAHİBİ', fromLabel: 'TƏQDİM EDƏN', powersLabel: 'QEYDƏ ALINAN', penaltyLabel: 'ARZU',
  preamble: 'Bu sənədlə {to} adlı şəxsin ilk iş gününün tarixi və təfərrüatları xatirə qaydasında qeydə alınır. Sənəd {from} tərəfindən tərtib olunmuş və həmin günün əhvalını olduğu kimi əks etdirir.',
  powers: 'Səhər hamıdan tez gəlindi.\nAdlar ilk gündə yadda qalmadı.\nİlk tapşırıq gözləniləndən asan oldu.\nAxşam yorğunluq xoş idi.',
  penalty: 'Qeyd dəyişdirilmir. İllər sonra bu sənəd peşə yolunun haradan başladığını xatırlatmaq üçün saxlanılır.',
  titleOptions: [
    'İlk İş Gününün Tarixinin və Təfərrüatlarının Xatirə Qeydi',
    'Peşə Həyatının Başlanğıcına dair Xatirə Sənədi',
    'İlk Əmək Gününün Rəsmi Qeydiyyatı Sənədi',
    'Yeni Kollektivə Qatılma Gününün Xatirə Sənədi'
  ],
  powersOptions: [
    'Səhər hamıdan tez gəlindi.',
    'Adlar ilk gündə yadda qalmadı.',
    'İlk tapşırıq gözləniləndən asan oldu.',
    'Axşam yorğunluq xoş idi.',
    'İş yeri əvvəlcədən hazırlanmışdı.',
    'Kollektiv mehriban qarşıladı.',
    'İlk səhv sakit düzəldildi.',
    'Bu gün uzun müddət xatırlanacaq.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Qeyd dəyişdirilmir. İllər sonra bu sənəd peşə yolunun haradan başladığını xatırlatmaq üçün saxlanılır.',
    'Sənəd şəxsi arxivdə saxlanılır.',
    'Qeydə yeni mərhələlər əlavə edilə bilər.'
  ]
},
{
  id: 'yeni-ev', cat: 'x-milestone', tone: 'xatire', layout: 'notarial', palette: 'gold',
  title: 'Yeni Evə Köçmə Tarixinin və İlk Gecənin Rəsmi Xatirə Qeydi', tag: 'Yeni ev',
  signOrg: 'Yeni Başlanğıcların Qeydiyyatı üzrə Şura',
  toLabel: 'SƏNƏD SAHİBİ', fromLabel: 'TƏQDİM EDƏN', powersLabel: 'QEYDƏ ALINAN', penaltyLabel: 'ARZU',
  preamble: 'Bu sənədlə {to} adlı şəxsin yeni evə köçmə tarixi və ilk gecənin təfərrüatları xatirə qaydasında qeydə alınır. Sənəd {from} tərəfindən tərtib olunmuş və ailə arxivinə daxil edilmişdir.',
  powers: 'İlk gecə qutular arasında keçdi.\nSəhər çayı yerdə içildi.\nİlk qonaqlar həmin həftə gəldi.\nEv tədricən öz görkəmini aldı.',
  penalty: 'Qeyd müddətsizdir. Ev və ünvan dəyişsə də, bu sənəd ilk ocağın xatirəsini olduğu kimi saxlayır.',
  titleOptions: [
    'Yeni Evə Köçmə Tarixinin və İlk Gecənin Rəsmi Xatirə Qeydi',
    'Ocaq Qurulmasının Rəsmi Qeydiyyatına dair Xatirə Sənədi',
    'Yeni Ünvanın Xatirə Qaydasında Təsbitinə dair Sənəd',
    'İlk Qonaqların Qarşılanmasına dair Rəsmi Xatirə Sənədi'
  ],
  powersOptions: [
    'İlk gecə qutular arasında keçdi.',
    'Səhər çayı yerdə içildi.',
    'İlk qonaqlar həmin həftə gəldi.',
    'Ev tədricən öz görkəmini aldı.',
    'Açar ilk dəfə həyəcanla çevrildi.',
    'Divarların rəngi birgə seçildi.',
    'Qonşularla tanışlıq erkən başladı.',
    'Bu ünvan uzun illər xatırlanacaq.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Qeyd müddətsizdir. Ev və ünvan dəyişsə də, bu sənəd ilk ocağın xatirəsini olduğu kimi saxlayır.',
    'Sənəd ailə arxivində saxlanılır.',
    'Qeydə sonrakı ünvanlar da əlavə edilir.'
  ]
},
{
  id: 'ilk-sukan-lisenziyasi', cat: 'x-milestone', tone: 'xatire', layout: 'lisenziya', palette: 'burgundy',
  title: 'İlk Dəfə Sükan Arxasına Keçmə Anının Xatirə Lisenziyası', tag: 'İlk sükan',
  signOrg: 'Nailiyyətlərin Təsdiqi və Qeydiyyatı Şöbəsi',
  toLabel: 'SƏNƏD SAHİBİ', fromLabel: 'TƏQDİM EDƏN', powersLabel: 'QEYDƏ ALINAN', penaltyLabel: 'ARZU',
  preamble: 'Bu lisenziya ilə {to} adlı şəxsin ilk dəfə sükan arxasına keçmə anı xatirə qaydasında qeydə alınır. Sənəd {from} tərəfindən, həmin günün bütün təfərrüatları nəzərə alınmaqla tərtib edilmişdir.',
  powers: 'İlk mühərrik səsi yadda qaldı.\nƏllər sükanı möhkəm tuturdu.\nYanında oturan sakit qalmağa çalışırdı.\nİlk dönüş ehtiyatla edildi.',
  penalty: 'Lisenziya xatirə xarakteri daşıyır və heç bir rəsmi sənədi əvəz etmir. O, yalnız həmin günü saxlayır.',
  titleOptions: [
    'İlk Dəfə Sükan Arxasına Keçmə Anının Xatirə Lisenziyası',
    'Sürücülük Təcrübəsinin Başlanğıcına dair Xatirə Lisenziyası',
    'İlk Müstəqil Səfərin Qeydiyyatına dair Lisenziya',
    'Sükan Arxasındakı İlk Günün Xatirə Sənədi'
  ],
  powersOptions: [
    'İlk mühərrik səsi yadda qaldı.',
    'Əllər sükanı möhkəm tuturdu.',
    'Yanında oturan sakit qalmağa çalışırdı.',
    'İlk dönüş ehtiyatla edildi.',
    'Marşrut əvvəlcədən seçilmişdi.',
    'Sürət heç vaxt artırılmadı.',
    'İlk park cəhdi uzun çəkdi.',
    'Qayıdanda gülüş boldu.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Lisenziya xatirə xarakteri daşıyır və heç bir rəsmi sənədi əvəz etmir. O, yalnız həmin günü saxlayır.',
    'Sənəd şəxsi arxivdə saxlanılır.',
    'Lisenziya ildönümlərində yenidən oxunur.'
  ]
},
{
  id: 'nailiyyet-arayisi', cat: 'x-milestone', tone: 'xatire', layout: 'arayis', palette: 'steel',
  title: 'Əldə Edilmiş Nailiyyətin və Ona Aparan Yolun haqqında Arayış', tag: 'Arayış',
  signOrg: 'Nailiyyətlərin Təsdiqi və Qeydiyyatı Şöbəsi',
  toLabel: 'SƏNƏD SAHİBİ', fromLabel: 'TƏQDİM EDƏN', powersLabel: 'QEYDƏ ALINAN', penaltyLabel: 'ARZU',
  preamble: 'Verilir {to} adlı şəxsə ondan ötrü ki, qarşıya qoyduğu hədəfə çatmışdır. Arayış {from} tərəfindən tərtib olunmuş, nəticə ilə yanaşı ona aparan yolu, çətinlikləri və göstərilən səbri də əks etdirir.',
  powers: 'Hədəf uzun müddət əvvəl qoyulmuşdu.\nYol heç vaxt düz olmadı.\nDayanmaq fikri bir neçə dəfə yarandı.\nNəticə səbrin bəhrəsidir.',
  penalty: 'Arayış nailiyyəti deyil, ona aparan yolu qeydə alır. Bu yol növbəti hədəf üçün də etibarlıdır.',
  titleOptions: [
    'Əldə Edilmiş Nailiyyətin və Ona Aparan Yolun haqqında Arayış',
    'Uzunmüddətli Səyin Nəticəsi haqqında Xatirə Arayışı',
    'Hədəfə Çatma Prosesinin Qeydə Alınması haqqında Arayış',
    'Görülmüş İşin Yekunu haqqında Rəsmi Arayış'
  ],
  powersOptions: [
    'Hədəf uzun müddət əvvəl qoyulmuşdu.',
    'Yol heç vaxt düz olmadı.',
    'Dayanmaq fikri bir neçə dəfə yarandı.',
    'Nəticə səbrin bəhrəsidir.',
    'İlk cəhdlər uğursuz oldu.',
    'Dəstək düzgün anda gəldi.',
    'Plan bir neçə dəfə dəyişdirildi.',
    'Növbəti hədəf artıq müəyyəndir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Arayış nailiyyəti deyil, ona aparan yolu qeydə alır. Bu yol növbəti hədəf üçün də etibarlıdır.',
    'Arayış şəxsi arxivdə saxlanılır.',
    'Sənəd yeni nailiyyətlərlə tamamlanır.'
  ]
},
{
  id: 'merhele-qerari', cat: 'x-milestone', tone: 'xatire', layout: 'qerar', palette: 'ink',
  title: 'Həyat Mərhələsinin Tamamlanmasının Rəsmi Təsbiti haqqında Qərar', tag: 'Qərar',
  signOrg: 'Həyat Mərhələlərinin Qeydiyyatı üzrə Palata',
  toLabel: 'SƏNƏD SAHİBİ', fromLabel: 'TƏQDİM EDƏN', powersLabel: 'QEYDƏ ALINAN', penaltyLabel: 'ARZU',
  preamble: 'Aparılmış qiymətləndirmə nəticəsində müəyyən edilmişdir ki, {to} adlı şəxsin həyatında bir mərhələ tamamlanmışdır. Qərar {from} tərəfindən verilmiş təqdimat əsasında qəbul olunmuş və arxivə daxil edilmişdir.',
  powers: 'Mərhələ tam və layiqincə tamamlandı.\nQazanılan təcrübə itirilmədi.\nSəhvlər dərs kimi qəbul edildi.\nYeni mərhələ açıq elan olunur.',
  penalty: 'Qərar geriyə şamil olunmur. Keçən mərhələ olduğu kimi qalır, yeni mərhələ isə təmiz vərəqdən başlayır.',
  titleOptions: [
    'Həyat Mərhələsinin Tamamlanmasının Rəsmi Təsbiti haqqında Qərar',
    'Bir Dövrün Bağlanması və Yenisinin Başlanması haqqında Qərar',
    'Keçən Mərhələnin Yekununa dair Xatirə Qərarı',
    'Yeni Mərhələyə Keçidin Təsdiqi haqqında Qərar'
  ],
  powersOptions: [
    'Mərhələ tam və layiqincə tamamlandı.',
    'Qazanılan təcrübə itirilmədi.',
    'Səhvlər dərs kimi qəbul edildi.',
    'Yeni mərhələ açıq elan olunur.',
    'Keçən dövr müsbət qiymətləndirilir.',
    'Ətrafdakıların dəstəyi qeyd olunur.',
    'Yarımçıq işlər tamamlandı.',
    'Növbəti hədəflər müəyyən edildi.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Qərar geriyə şamil olunmur. Keçən mərhələ olduğu kimi qalır, yeni mərhələ isə təmiz vərəqdən başlayır.',
    'Qərar şəxsi arxivdə saxlanılır.',
    'Sənəd hər yeni mərhələdə yenilənir.'
  ]
},
{
  id: 'yeni-baslangic-sazisi', cat: 'x-milestone', tone: 'xatire', layout: 'muqavile', palette: 'forest',
  title: 'Yeni Başlanğıcın Şərtlərinin Özü ilə Razılaşdırılması üzrə Saziş', tag: 'Saziş',
  signOrg: 'Yeni Başlanğıcların Qeydiyyatı üzrə Şura',
  toLabel: 'SƏNƏD SAHİBİ', fromLabel: 'TƏQDİM EDƏN', powersLabel: 'QEYDƏ ALINAN', penaltyLabel: 'ARZU',
  preamble: 'Bu sazişlə {to} adlı şəxs yeni başlanğıcın şərtlərini və hədəflərini özü ilə razılaşdırır. Sənəd {from} tərəfindən şahid qismində təsdiqlənmiş və hər iki tərəfin arxivində saxlanılmışdır.',
  powers: 'Hədəflər aydın və konkret yazılıb.\nBəhanələr əvvəlcədən rədd edilib.\nİlk addım tarixi müəyyən olunub.\nGeri çəkilmə variantı nəzərdə tutulmayıb.',
  penalty: 'Saziş yalnız bir şərtlə pozulmuş sayılır: cəhd etməkdən tamamilə imtina edilməsi. Digər bütün hallarda o qüvvədədir.',
  titleOptions: [
    'Yeni Başlanğıcın Şərtlərinin Özü ilə Razılaşdırılması üzrə Saziş',
    'Qarşıya Qoyulan Hədəflərin Təsbiti üzrə Xatirə Sazişi',
    'Yeni Dövrün Qaydalarının Müəyyən Edilməsi üzrə Saziş',
    'Verilən Sözün Yazıya Alınması üzrə Səmimi Saziş'
  ],
  powersOptions: [
    'Hədəflər aydın və konkret yazılıb.',
    'Bəhanələr əvvəlcədən rədd edilib.',
    'İlk addım tarixi müəyyən olunub.',
    'Geri çəkilmə variantı nəzərdə tutulmayıb.',
    'Nəticələr aylıq yoxlanılacaq.',
    'Dəstək lazım olduqda istəniləcək.',
    'Səhv olarsa yenidən başlanılacaq.',
    'Saziş açıq şəkildə elan edilib.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Saziş yalnız bir şərtlə pozulmuş sayılır: cəhd etməkdən tamamilə imtina edilməsi. Digər bütün hallarda o qüvvədədir.',
    'Saziş hər il yenidən oxunur.',
    'Sənəd şəxsi arxivdə saxlanılır.'
  ]
},
{
  id: 'nailiyyet-teleqrami', cat: 'x-milestone', tone: 'xatire', layout: 'teleqram', palette: 'rose',
  title: 'Əldə Edilmiş Nəticə barədə Təxirəsalınmaz Xatirə Teleqramı', tag: 'Qısa mesaj',
  signOrg: 'Nailiyyətlərin Təsdiqi və Qeydiyyatı Şöbəsi',
  toLabel: 'SƏNƏD SAHİBİ', fromLabel: 'TƏQDİM EDƏN', powersLabel: 'QEYDƏ ALINAN', penaltyLabel: 'ARZU',
  preamble: 'Sizə bildiririk ki, {to} adlı şəxs qarşıya qoyduğu hədəfə çatmışdır. Xəbər {from} tərəfindən birinci növbədə çatdırılır, heç bir izahat tələb etmir və təfərrüatlar görüşdə danışılacaqdır.',
  powers: 'Hədəfə çatıldı.\nYol uzun və çətin oldu.\nXəbər birinci sizə çatdırılır.\nTəfərrüatlar görüşdə danışılacaq.',
  penalty: 'Teleqram heç bir öhdəlik yaratmır. Onun yeganə məqsədi xoş xəbərin vaxtında çatdırılmasıdır.',
  titleOptions: [
    'Əldə Edilmiş Nəticə barədə Təxirəsalınmaz Xatirə Teleqramı',
    'Uğur Xəbərinin Birinci Çatdırılması haqqında Teleqram',
    'Qısa Sözlərlə Bildirilmiş Nailiyyət Teleqramı',
    'Xoş Xəbərin Rəsmi Çatdırılması haqqında Teleqram'
  ],
  powersOptions: [
    'Hədəfə çatıldı.',
    'Yol uzun və çətin oldu.',
    'Xəbər birinci sizə çatdırılır.',
    'Təfərrüatlar görüşdə danışılacaq.',
    'Nəticə gözləniləndən yaxşıdır.',
    'Dəstəyə görə minnətdarlıq bildirilir.',
    'Növbəti hədəf artıq seçilib.',
    'Qeyd birgə ediləcək.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Teleqram heç bir öhdəlik yaratmır. Onun yeganə məqsədi xoş xəbərin vaxtında çatdırılmasıdır.',
    'Teleqram xatirə arxivində saxlanılır.',
    'Mesaj olduğu kimi qorunur.'
  ]
},
{
  id: 'yeni-merhele-vesiqesi', cat: 'x-milestone', tone: 'xatire', layout: 'vesiqe', palette: 'burgundy',
  title: 'Yeni Mərhələyə Keçidin Rəsmi Təsdiqinə dair Xatirə Vəsiqəsi', tag: 'Vəsiqə',
  signOrg: 'Həyat Mərhələlərinin Qeydiyyatı üzrə Palata',
  toLabel: 'SƏNƏD SAHİBİ', fromLabel: 'TƏQDİM EDƏN', powersLabel: 'QEYDƏ ALINAN', penaltyLabel: 'ARZU',
  preamble: 'Bu vəsiqə {to} adlı şəxsin yeni həyat mərhələsinə keçidini təsdiq edir. Sənəd {from} tərəfindən verilmiş, keçən dövrün nəticələrini əks etdirir və şəxsi arxivdə müddətsiz saxlanılır.',
  powers: 'Keçən mərhələ layiqincə tamamlandı.\nYeni mərhələ könüllü seçildi.\nTəcrübə özü ilə aparılır.\nDəstək əvvəlki kimi qalır.',
  penalty: 'Vəsiqə müddətsizdir. Onun yeganə funksiyası — illər sonra bu keçidi olduğu kimi xatırlatmaqdır.',
  titleOptions: [
    'Yeni Mərhələyə Keçidin Rəsmi Təsdiqinə dair Xatirə Vəsiqəsi',
    'Həyatın Yeni Dövrünün Qeydiyyatına dair Vəsiqə',
    'Tamamlanmış Mərhələnin Təsdiqinə dair Xatirə Vəsiqəsi',
    'Yeni Statusun Xatirə Qaydasında Təsdiqi Vəsiqəsi'
  ],
  powersOptions: [
    'Keçən mərhələ layiqincə tamamlandı.',
    'Yeni mərhələ könüllü seçildi.',
    'Təcrübə özü ilə aparılır.',
    'Dəstək əvvəlki kimi qalır.',
    'Qazanılan biliklər itirilmir.',
    'Köhnə əlaqələr saxlanılır.',
    'Yeni hədəflər yazıya alınıb.',
    'Geri baxmaq üçün bu sənəd var.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Vəsiqə müddətsizdir. Onun yeganə funksiyası — illər sonra bu keçidi olduğu kimi xatırlatmaqdır.',
    'Vəsiqə şəxsi arxivdə saxlanılır.',
    'Sənəd hər yeni mərhələdə yenilənir.'
  ]
},

/* ==================== DOSTLUQ ==================== */
{
  id: 'dostluq-sehadetnamesi', cat: 'x-bonds', tone: 'xatire', layout: 'notarial', palette: 'gold',
  title: 'Uzunillik Dostluğun Mövcudluğunu Təsdiq edən Xatirə Şəhadətnaməsi', tag: 'Ən çox seçilən',
  signOrg: 'Dostluq Münasibətlərinin Qeydiyyatı üzrə Palata',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'SON SÖZ',
  preamble: 'Bu şəhadətnamə ilə təsdiq olunur ki, {from} və {to} arasındakı dostluq uzun illər davam etmiş, bir neçə dəfə sınaqdan keçmiş və heç bir halda zəifləməmişdir. Sənəd hər iki tərəfin razılığı ilə tərtib edilmişdir.',
  powers: 'Dostluq illərlə sınaqdan keçdi.\nUzaqlıq və vaxt heç nəyi dəyişmədi.\nÇətin gündə ilk zəng bir-birinə edildi.\nHeç bir hesab aparılmadı.',
  penalty: 'Şəhadətnamə müddətsizdir və yenidən təsdiq tələb etmir. Onun yeganə şərti — lazım olanda cavab verməkdir.',
  titleOptions: [
    'Uzunillik Dostluğun Mövcudluğunu Təsdiq edən Xatirə Şəhadətnaməsi',
    'İllərlə Sınaqdan Keçmiş Dostluğun Rəsmi Şəhadətnaməsi',
    'Dostluq Münasibətinin Qeydiyyatına dair Şəhadətnamə',
    'Zamanla Möhkəmlənmiş Bağlılığın Xatirə Şəhadətnaməsi'
  ],
  powersOptions: [
    'Dostluq illərlə sınaqdan keçdi.',
    'Uzaqlıq və vaxt heç nəyi dəyişmədi.',
    'Çətin gündə ilk zəng bir-birinə edildi.',
    'Heç bir hesab aparılmadı.',
    'Səhvlər bağışlandı və xatırladılmadı.',
    'Uğurlar həsədsiz sevindirdi.',
    'Sirr heç vaxt kənara çıxmadı.',
    'Aylarla danışmamaq da münasibəti pozmadı.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Şəhadətnamə müddətsizdir və yenidən təsdiq tələb etmir. Onun yeganə şərti — lazım olanda cavab verməkdir.',
    'Sənəd hər iki tərəfdə saxlanılır.',
    'Şəhadətnamə ildönümlərində yenidən oxunur.'
  ]
},
{
  id: 'en-yaxsi-dost', cat: 'x-bonds', tone: 'xatire', layout: 'diplom', palette: 'burgundy',
  title: 'Ən Yaxşı Dost Adının Verilməsinə dair Rəsmi Fəxri Fərman', tag: 'Təltif',
  signOrg: 'Dostluq Təltiflərinin Qeydiyyatı üzrə Şura',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'SON SÖZ',
  preamble: 'Şura {to} adlı şəxsin illər ərzində göstərdiyi sədaqəti və dəstəyi qiymətləndirərək fəxri adın verilməsi barədə qərar qəbul etmişdir. Fərman {from} tərəfindən təqdim olunur və müddətsizdir.',
  powers: 'Gecə saatlarında edilən zəngə cavab verildi.\nXoşagəlməz həqiqət üzə deyildi.\nKömək izahat tələb etmədən göstərildi.\nİllər keçsə də münasibət dəyişmədi.',
  penalty: 'Fərman geri alınmır. Təltif olunan şəxs bu sənədə istinad edərək istənilən vaxt kömək tələb edə bilər.',
  titleOptions: [
    'Ən Yaxşı Dost Adının Verilməsinə dair Rəsmi Fəxri Fərman',
    'Dostluq Sahəsindəki Xidmətlərə Görə Fəxri Fərman',
    'Uzunmüddətli Sədaqətə Görə Verilmiş Fəxri Fərman',
    'Dostluq Öhdəliklərinin Nümunəvi İcrasına Görə Fərman'
  ],
  powersOptions: [
    'Gecə saatlarında edilən zəngə cavab verildi.',
    'Xoşagəlməz həqiqət üzə deyildi.',
    'Kömək izahat tələb etmədən göstərildi.',
    'İllər keçsə də münasibət dəyişmədi.',
    'Uzun səsli mesajlar sona qədər dinlənildi.',
    'Köhnə söhbətlər lazımsız yerdə xatırladılmadı.',
    'Uğur xəbəri birinci bölüşüldü.',
    'Mübahisədən sonra ilk addım atıldı.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Fərman geri alınmır. Təltif olunan şəxs bu sənədə istinad edərək istənilən vaxt kömək tələb edə bilər.',
    'Fərman müddətsizdir və yenidən təsdiq tələb etmir.',
    'Sənəd hər iki tərəfin arxivində saxlanılır.'
  ]
},
{
  id: 'uzunillik-dostluq', cat: 'x-bonds', tone: 'xatire', layout: 'sertifikat', palette: 'forest',
  title: 'Uzunillik Dostluğa Görə Verilmiş Xatirə Nişanının Sertifikatı', tag: 'Nişan',
  signOrg: 'Dostluq Təltiflərinin Qeydiyyatı üzrə Şura',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'SON SÖZ',
  preamble: 'Bununla təsdiq edilir ki, {from} və {to} arasındakı dostluq uzun illərdir davam edir. Sertifikat dostluğun stajını, keçdiyi mərhələləri və hər iki tərəfin ona verdiyi dəyəri qeydə alır.',
  powers: 'Tanışlıq təsadüfən başladı.\nİlk illər ən yaddaqalanı oldu.\nHəyat yolları ayrılsa da əlaqə qalmadı.\nBu staj artıq geri sayılmır.',
  penalty: 'Nişan müddətsizdir və geri alınmır. O, illərin sayını deyil, onların keyfiyyətini qeydə alır.',
  titleOptions: [
    'Uzunillik Dostluğa Görə Verilmiş Xatirə Nişanının Sertifikatı',
    'On İldən Artıq Davam Edən Dostluğun Nişanı',
    'Zamanın Sınağından Keçmiş Bağlılığın Nişanı',
    'Dostluq Stajının Rəsmi Tanınmasına dair Sertifikat'
  ],
  powersOptions: [
    'Tanışlıq təsadüfən başladı.',
    'İlk illər ən yaddaqalanı oldu.',
    'Həyat yolları ayrılsa da əlaqə qalmadı.',
    'Bu staj artıq geri sayılmır.',
    'Ünvanlar dəyişdi, nömrələr qaldı.',
    'Yeni tanışlar bu yeri tuta bilmədi.',
    'Ailələr bir-birini tanıyır.',
    'Xatirələr ortaq arxivdədir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Nişan müddətsizdir və geri alınmır. O, illərin sayını deyil, onların keyfiyyətini qeydə alır.',
    'Sertifikat hər iki tərəfdə saxlanılır.',
    'Nişan hər beş ildə yenidən qeyd olunur.'
  ]
},
{
  id: 'hemise-yanimda', cat: 'x-bonds', tone: 'xatire', layout: 'viza', palette: 'rose',
  title: 'Çətin Anlarda Göstərilən Dayağa Görə Rəsmi Minnətdarlıq Sənədi', tag: 'Dayaq',
  signOrg: 'Dostluq Münasibətlərinin Qeydiyyatı üzrə Palata',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'SON SÖZ',
  preamble: 'Bu sənədlə {from} tərəfindən {to} adlı şəxsə çətin anlarda göstərdiyi dayağa görə səmimi minnətdarlıq bildirilir. Dəstək heç bir şərt qoyulmadan və izahat tələb edilmədən göstərilmişdir.',
  powers: 'Ən ağır gündə tək qoyulmadı.\nSual verilmədən kömək edildi.\nHeç nə qarşılıq gözlənilmədi.\nBu unudulmayacaq.',
  penalty: 'Sənəd heç bir öhdəlik yaratmır. O, sadəcə vaxtında deyilməmiş sözlərin yazıya alınmasıdır.',
  titleOptions: [
    'Çətin Anlarda Göstərilən Dayağa Görə Rəsmi Minnətdarlıq Sənədi',
    'Heç Vaxt Tək Qoymamağa Görə Verilmiş Minnətdarlıq Sənədi',
    'Ən Ağır Gündə Yanında Olmağa Görə Rəsmi Sənəd',
    'Şərtsiz Dəstəyə Görə Təqdim Edilmiş Sənəd'
  ],
  powersOptions: [
    'Ən ağır gündə tək qoyulmadı.',
    'Sual verilmədən kömək edildi.',
    'Heç nə qarşılıq gözlənilmədi.',
    'Bu unudulmayacaq.',
    'Gecə saatı əngəl olmadı.',
    'Məsafə bəhanə kimi göstərilmədi.',
    'Söz verildi və sözdə duruldu.',
    'Sonradan xatırladılmadı.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Sənəd heç bir öhdəlik yaratmır. O, sadəcə vaxtında deyilməmiş sözlərin yazıya alınmasıdır.',
    'Minnətdarlıq müddətsizdir.',
    'Sənəd xatirə arxivində saxlanılır.'
  ]
},
{
  id: 'dost-qrupu', cat: 'x-bonds', tone: 'xatire', layout: 'blank', palette: 'steel',
  title: 'Dost Qrupunun Tərkibinin və Ənənələrinin Xatirə Qaydasında Qeydi', tag: 'Qrup',
  signOrg: 'Dostluq Münasibətlərinin Qeydiyyatı üzrə Palata',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'SON SÖZ',
  preamble: 'Bu sənədlə {from} və {to} adlı şəxslərin daxil olduğu dost qrupunun tərkibi və ənənələri xatirə qaydasında qeydə alınır. Qrup uzun illərdir mövcuddur və tərkibi demək olar ki, dəyişməmişdir.',
  powers: 'Qrup illərlə eyni tərkibdə qaldı.\nGörüşlər heç vaxt tam dayanmadı.\nHər kəsin öz rolu formalaşdı.\nƏnənələr yazılmadan qorunur.',
  penalty: 'Qeyd dəyişdirilmir. İllər sonra bu sənəd qrupun kimlərdən ibarət olduğunu olduğu kimi xatırladacaq.',
  titleOptions: [
    'Dost Qrupunun Tərkibinin və Ənənələrinin Xatirə Qaydasında Qeydi',
    'Uzunmüddətli Dost Qrupunun Rəsmi Xatirə Sənədi',
    'Qrup Ənənələrinin Qeydə Alınmasına dair Sənəd',
    'Ortaq Xatirələrin Toplanmasına dair Xatirə Sənədi'
  ],
  powersOptions: [
    'Qrup illərlə eyni tərkibdə qaldı.',
    'Görüşlər heç vaxt tam dayanmadı.',
    'Hər kəsin öz rolu formalaşdı.',
    'Ənənələr yazılmadan qorunur.',
    'Qrup söhbəti hələ də canlıdır.',
    'İllik görüş ənənəyə çevrilib.',
    'Yeni üzvlər çətinliklə qəbul olunur.',
    'Köhnə zarafatlar hələ də işləyir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Qeyd dəyişdirilmir. İllər sonra bu sənəd qrupun kimlərdən ibarət olduğunu olduğu kimi xatırladacaq.',
    'Sənəd qrupun ortaq arxivində saxlanılır.',
    'Qeydə yeni üzvlər əlavə edilə bilər.'
  ]
},
{
  id: 'sirdas-etimadnamesi', cat: 'x-bonds', tone: 'xatire', layout: 'lisenziya', palette: 'ink',
  title: 'Sirdaşlıq Statusunun və Etimad Səviyyəsinin Təsdiqinə dair Sənəd', tag: 'Etimad',
  signOrg: 'Sirdaşlıq və Etimadın Təsdiqi üzrə Şöbə',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'SON SÖZ',
  preamble: 'Bu sənədlə {from} tərəfindən {to} adlı şəxsin sirdaş statusu rəsmi qaydada tanınır. Etimad illər ərzində formalaşmış, qarşılıqlı xarakter daşımış və indiyədək bir dəfə də pozulmamışdır.',
  powers: 'Danışılan söz heç vaxt kənara çıxmadı.\nMühakimə edilmədən dinlənildi.\nMəsləhət yalnız soruşulduqda verildi.\nHeç nə sonradan xatırladılmadı.',
  penalty: 'Sənəd müddətsizdir. Etimadın qazanılması uzun, itirilməsi asan olduğu üçün bu qeyd xatırlatma kimi saxlanılır.',
  titleOptions: [
    'Sirdaşlıq Statusunun və Etimad Səviyyəsinin Təsdiqinə dair Sənəd',
    'Danışılan Hər Sözün Qorunmasına dair Etimadnamə',
    'Şərtsiz Etibarın Rəsmi Təsdiqinə dair Sənəd',
    'Sirdaş Statusunun Tanınmasına dair Xatirə Sənədi'
  ],
  powersOptions: [
    'Danışılan söz heç vaxt kənara çıxmadı.',
    'Mühakimə edilmədən dinlənildi.',
    'Məsləhət yalnız soruşulduqda verildi.',
    'Heç nə sonradan xatırladılmadı.',
    'Ən çətin xəbər birinci bölüşüldü.',
    'Susmaq lazım olanda susuldu.',
    'Kənar rəylər söhbətə daxil edilmədi.',
    'Etimad qarşılıqlı oldu.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Sənəd müddətsizdir. Etimadın qazanılması uzun, itirilməsi asan olduğu üçün bu qeyd xatırlatma kimi saxlanılır.',
    'Sənəd hər iki tərəfə eyni qaydada aiddir.',
    'Etimadnamə xatirə arxivində saxlanılır.'
  ]
},
{
  id: 'dostluq-arayisi', cat: 'x-bonds', tone: 'xatire', layout: 'arayis', palette: 'gold',
  title: 'Dostluq Münasibətinin Mövcudluğu və Davamlılığı haqqında Arayış', tag: 'Arayış',
  signOrg: 'Dostluq Münasibətlərinin Qeydiyyatı üzrə Palata',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'SON SÖZ',
  preamble: 'Verilir {to} adlı şəxsə ondan ötrü ki, {from} ilə dostluq münasibəti uzun illərdir davam edir və heç bir fasilə qeydə alınmamışdır. Arayış xatirə kimi verilir və heç bir rəsmi qüvvəyə malik deyil.',
  powers: 'Dostluq stajı uzun illərdir.\nFasilə qeydə alınmayıb.\nMübahisələr həmişə həll olunub.\nƏlaqə heç vaxt tam kəsilməyib.',
  penalty: 'Arayış müddətsizdir və yenidən təsdiq tələb etmir. İllər sonra oxunduqda eyni mənanı daşıyacaq.',
  titleOptions: [
    'Dostluq Münasibətinin Mövcudluğu və Davamlılığı haqqında Arayış',
    'Uzunmüddətli Dostluğun Təsdiqinə dair Rəsmi Arayış',
    'Münasibətin Cari Vəziyyəti haqqında Xatirə Arayışı',
    'Dostluq Stajının Qeydə Alınması haqqında Arayış'
  ],
  powersOptions: [
    'Dostluq stajı uzun illərdir.',
    'Fasilə qeydə alınmayıb.',
    'Mübahisələr həmişə həll olunub.',
    'Əlaqə heç vaxt tam kəsilməyib.',
    'Ünvan dəyişikliyi təsir göstərməyib.',
    'Yeni tanışlar bu yeri tutmayıb.',
    'Görüşlər müntəzəm olub.',
    'Ailələr bir-birini tanıyır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Arayış müddətsizdir və yenidən təsdiq tələb etmir. İllər sonra oxunduqda eyni mənanı daşıyacaq.',
    'Arayış xatirə arxivində saxlanılır.',
    'Sənəd hər iki tərəfə eyni qaydada aiddir.'
  ]
},
{
  id: 'dostluq-qerari', cat: 'x-bonds', tone: 'xatire', layout: 'qerar', palette: 'burgundy',
  title: 'Dostluğun Rəsmi Qaydada Təsdiq Edilməsi haqqında Yekun Qərar', tag: 'Qərar',
  signOrg: 'Dostluq Təltiflərinin Qeydiyyatı üzrə Şura',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'SON SÖZ',
  preamble: 'Şura {from} və {to} arasındakı münasibəti araşdıraraq onun dostluq kimi tanınması barədə qərar qəbul etmişdir. Qərar hər iki tərəfin razılığı ilə, yekdilliklə qəbul olunmuş və arxivə daxil edilmişdir.',
  powers: 'Münasibət dostluq kimi tanınır.\nQərar yekdilliklə qəbul edilib.\nHeç bir etiraz daxil olmayıb.\nQərar imzalandığı andan qüvvədədir.',
  penalty: 'Qərar müddətsizdir. O, yalnız hər iki tərəfin razılığı ilə dəyişdirilə bilər, indiyədək belə bir müraciət olmayıb.',
  titleOptions: [
    'Dostluğun Rəsmi Qaydada Təsdiq Edilməsi haqqında Yekun Qərar',
    'Münasibətin Dostluq kimi Tanınması haqqında Qərar',
    'İllərin Yekununda Qəbul Edilmiş Xatirə Qərarı',
    'Dostluq Statusunun Təsbiti haqqında Rəsmi Qərar'
  ],
  powersOptions: [
    'Münasibət dostluq kimi tanınır.',
    'Qərar yekdilliklə qəbul edilib.',
    'Heç bir etiraz daxil olmayıb.',
    'Qərar imzalandığı andan qüvvədədir.',
    'Staj və keyfiyyət nəzərə alınıb.',
    'Ortaq xatirələr sənədə əlavə edilib.',
    'Hər iki tərəfin mövqeyi eynidir.',
    'Sənəd arxivə daxil edilib.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Qərar müddətsizdir. O, yalnız hər iki tərəfin razılığı ilə dəyişdirilə bilər, indiyədək belə bir müraciət olmayıb.',
    'Qərar hər iki tərəfdə saxlanılır.',
    'Sənəd ildönümlərində yenidən oxunur.'
  ]
},
{
  id: 'dostluq-sazisi', cat: 'x-bonds', tone: 'xatire', layout: 'muqavile', palette: 'forest',
  title: 'Dostluq Münasibətinin Sadə Qaydalarının Razılaşdırılması üzrə Saziş', tag: 'Saziş',
  signOrg: 'Sirdaşlıq və Etimadın Təsdiqi üzrə Şöbə',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'SON SÖZ',
  preamble: 'Bu sazişlə {from} və {to} illərdir yazılmadan işləyən dostluq qaydalarını yazıya alırlar. Saziş heç bir yeni öhdəlik yaratmır, sadəcə uzun illərin mövcud vəziyyətini olduğu kimi qeydə alır.',
  powers: 'Zəngə cavab verilir, gec olsa da.\nSəhvlər üzə deyilir, kənara yox.\nBorc soruşulmadan qaytarılır.\nUğur həsədsiz sevindirilir.',
  penalty: 'Saziş müddətsizdir. Onun pozulması yalnız bir halda mümkündür — lazım olanda cavab verməmək.',
  titleOptions: [
    'Dostluq Münasibətinin Sadə Qaydalarının Razılaşdırılması üzrə Saziş',
    'Qarşılıqlı Öhdəliklərin Təsbiti üzrə Xatirə Sazişi',
    'Dostluğun Yazılmamış Qaydalarının Yazıya Alınması Sazişi',
    'Uzunmüddətli Münasibətin Qaydaları üzrə Saziş'
  ],
  powersOptions: [
    'Zəngə cavab verilir, gec olsa da.',
    'Səhvlər üzə deyilir, kənara yox.',
    'Borc soruşulmadan qaytarılır.',
    'Uğur həsədsiz sevindirilir.',
    'Aylarla danışmamaq pozuntu sayılmır.',
    'Sirr heç bir halda açıqlanmır.',
    'Kömək izahat tələb etmir.',
    'Görüş yeri növbə ilə seçilir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Saziş müddətsizdir. Onun pozulması yalnız bir halda mümkündür — lazım olanda cavab verməmək.',
    'Saziş hər iki tərəfdə saxlanılır.',
    'Qaydalar yenidən müzakirə edilə bilər.'
  ]
},
{
  id: 'dostluq-teleqrami', cat: 'x-bonds', tone: 'xatire', layout: 'teleqram', palette: 'steel',
  title: 'Dostluq Münasibətinin Xatırlanması haqqında Xatirə Teleqramı', tag: 'Qısa mesaj',
  signOrg: 'Dostluq Münasibətlərinin Qeydiyyatı üzrə Palata',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'SON SÖZ',
  preamble: 'Sizə bildiririk ki, {from} tərəfindən {to} adlı şəxsə heç bir səbəb olmadan, sadəcə xatırlandığı üçün mesaj göndərilir. Mesaj qısadır, cavab tələb etmir və xatirə arxivində saxlanılır.',
  powers: 'Xatırlandın, ona görə yazıldı.\nSəbəb yoxdur və lazım deyil.\nCavab gözlənilir, tələb edilmir.\nGörüş vaxtı sonra razılaşdırılacaq.',
  penalty: 'Teleqram heç bir öhdəlik yaratmır. Onun yeganə məqsədi xatırlandığını bildirməkdir.',
  titleOptions: [
    'Dostluq Münasibətinin Xatırlanması haqqında Xatirə Teleqramı',
    'Uzun Fasilədən Sonra Göndərilmiş Xatirə Teleqramı',
    'Qısa Sözlərlə Bildirilmiş Dostluq Teleqramı',
    'Səbəbsiz Göndərilmiş Səmimi Teleqram'
  ],
  powersOptions: [
    'Xatırlandın, ona görə yazıldı.',
    'Səbəb yoxdur və lazım deyil.',
    'Cavab gözlənilir, tələb edilmir.',
    'Görüş vaxtı sonra razılaşdırılacaq.',
    'Uzun fasilə münasibətə təsir etmədi.',
    'Nömrə hələ də yaddadır.',
    'Köhnə söhbətlər xatırlandı.',
    'Növbəti görüş planlaşdırılır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Teleqram heç bir öhdəlik yaratmır. Onun yeganə məqsədi xatırlandığını bildirməkdir.',
    'Teleqram xatirə arxivində saxlanılır.',
    'Mesaj olduğu kimi qorunur.'
  ]
},
{
  id: 'en-yaxsi-dost-vesiqesi', cat: 'x-bonds', tone: 'xatire', layout: 'vesiqe', palette: 'rose',
  title: 'Ən Yaxın Dost Statusunun Tanınmasına dair Xatirə Vəsiqəsi', tag: 'Vəsiqə',
  signOrg: 'Dostluq Təltiflərinin Qeydiyyatı üzrə Şura',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'SON SÖZ',
  preamble: 'Bu vəsiqə {to} adlı şəxsin ən yaxın dost statusunu təsdiq edir. Sənəd {from} tərəfindən verilmişdir, heç bir yenidən baxılma proseduru nəzərdə tutmur və müddətsiz qüvvədə hesab olunur.',
  powers: 'Status uzun illər ərzində qazanılıb.\nSiyahıda yer məhduddur.\nStatus müddətsiz tanınır.\nYenidən baxılma nəzərdə tutulmur.',
  penalty: 'Vəsiqə müddətsizdir və geri alınmır. Statusun saxlanması üçün heç bir əlavə şərt tələb olunmur.',
  titleOptions: [
    'Ən Yaxın Dost Statusunun Tanınmasına dair Xatirə Vəsiqəsi',
    'Daimi Dostluq Statusunun Təsdiqinə dair Vəsiqə',
    'Ən Yaxın Adamlar Siyahısına Daxil Olmağa dair Vəsiqə',
    'Dostluq Statusunun Rəsmi Tanınmasına dair Vəsiqə'
  ],
  powersOptions: [
    'Status uzun illər ərzində qazanılıb.',
    'Siyahıda yer məhduddur.',
    'Status müddətsiz tanınır.',
    'Yenidən baxılma nəzərdə tutulmur.',
    'Çətin gündə birinci zəng edilir.',
    'Xoş xəbər birinci bölüşülür.',
    'Sirr şərtsiz qorunur.',
    'Kömək izahat tələb etmir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Vəsiqə müddətsizdir və geri alınmır. Statusun saxlanması üçün heç bir əlavə şərt tələb olunmur.',
    'Vəsiqə hər iki tərəfdə saxlanılır.',
    'Status ildönümlərində yenidən elan olunur.'
  ]
},
{
  id: 'sedaqet-diplomu', cat: 'x-bonds', tone: 'xatire', layout: 'ekspertiza', palette: 'ink',
  title: 'Uzunmüddətli Sədaqətə və Etibara Görə Verilmiş Fəxri Diplom', tag: 'Sədaqət',
  signOrg: 'Sirdaşlıq və Etimadın Təsdiqi üzrə Şöbə',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'SON SÖZ',
  preamble: 'Palata {to} adlı şəxsin uzun illər ərzində göstərdiyi sədaqəti və etibarlılığı qiymətləndirərək təltif haqqında qərar qəbul etmişdir. Diplom {from} tərəfindən təqdim olunur və geri alınmır.',
  powers: 'Verilən söz heç vaxt pozulmadı.\nÇətinlikdə geri çəkilinmədi.\nEtibar bir dəfə də sarsılmadı.\nBu keyfiyyət nadir hesab olunur.',
  penalty: 'Diplom müddətsizdir. Sədaqət hər gün yenidən qazanıldığı üçün bu sənəd yalnız keçmişi qeydə alır.',
  titleOptions: [
    'Uzunmüddətli Sədaqətə və Etibara Görə Verilmiş Fəxri Diplom',
    'Heç Vaxt Geri Çəkilməməyə Görə Fəxri Diplom',
    'Sözündə Durmağa Görə Verilmiş Fəxri Diplom',
    'Etibarlılıq Sahəsindəki Nəticələrə Görə Diplom'
  ],
  powersOptions: [
    'Verilən söz heç vaxt pozulmadı.',
    'Çətinlikdə geri çəkilinmədi.',
    'Etibar bir dəfə də sarsılmadı.',
    'Bu keyfiyyət nadir hesab olunur.',
    'Gizli saxlanan sirr açılmadı.',
    'Kömək vaxtında gəldi.',
    'Səhv olduqda özü etiraf etdi.',
    'Münasibət kənar rəylərdən asılı olmadı.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Diplom müddətsizdir. Sədaqət hər gün yenidən qazanıldığı üçün bu sənəd yalnız keçmişi qeydə alır.',
    'Diplom hər iki tərəfdə saxlanılır.',
    'Təltif ildönümlərində yenidən oxunur.'
  ]
},

/* ==================== AİLƏ ==================== */
{
  id: 'valideynlere-minnetdarliq', cat: 'x-family', tone: 'xatire', layout: 'diplom', palette: 'gold',
  title: 'Valideyn Zəhmətinə və Qayğısına Görə Rəsmi Minnətdarlıq Sənədi', tag: 'Valideynlər',
  signOrg: 'Ailə Xatirələrinin Qeydiyyatı üzrə Palata',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'QEYD',
  preamble: 'Bu sənədlə {from} tərəfindən {to} adlı şəxsə illər boyu göstərilən qayğıya və çəkilən zəhmətə görə səmimi minnətdarlıq bildirilir. Sözlər gec deyilir, lakin heç bir halda gec sayılmır və geri götürülmür.',
  powers: 'Ən son özünüz üçün düşündünüz.\nÇətinliklər bizdən gizlədildi.\nHər uğur sizin üçün bayram oldu.\nQayğı heç vaxt azalmadı.',
  penalty: 'Sənəd heç bir öhdəlik yaratmır. O, yalnız vaxtında deyilməmiş sözlərin yazıya alınmasıdır.',
  titleOptions: [
    'Valideyn Zəhmətinə və Qayğısına Görə Rəsmi Minnətdarlıq Sənədi',
    'İllər Boyu Göstərilmiş Qayğıya Görə Minnətdarlıq Sənədi',
    'Vaxtında Deyilməmiş Sözlərin Yazıya Alınmasına dair Sənəd',
    'Valideyn Əməyinin Qiymətləndirilməsinə dair Rəsmi Sənəd'
  ],
  powersOptions: [
    'Ən son özünüz üçün düşündünüz.',
    'Çətinliklər bizdən gizlədildi.',
    'Hər uğur sizin üçün bayram oldu.',
    'Qayğı heç vaxt azalmadı.',
    'Səhvlərimiz səbrlə düzəldildi.',
    'Seçimlərimizə hörmət edildi.',
    'Ev həmişə açıq qaldı.',
    'İnam ilk növbədə sizdən gəldi.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Sənəd heç bir öhdəlik yaratmır. O, yalnız vaxtında deyilməmiş sözlərin yazıya alınmasıdır.',
    'Minnətdarlıq müddətsizdir.',
    'Sənəd ailə arxivində saxlanılır.'
  ]
},
{
  id: 'nene-babaya-xatire', cat: 'x-family', tone: 'xatire', layout: 'notarial', palette: 'rose',
  title: 'Nənə və Babaya Ünvanlanmış Rəsmi Xatirə və Minnətdarlıq Sənədi', tag: 'Nəsil',
  signOrg: 'Nəsil və Kök Xatirələrinin Qeydiyyatı Şöbəsi',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'QEYD',
  preamble: 'Bu sənədlə {from} tərəfindən {to} adlı şəxsə uşaqlıq illərində yaradılan xatirələrə və göstərilən qayğıya görə minnətdarlıq bildirilir. Həmin illər ailənin ən isti dövrü kimi qeydə alınır.',
  powers: 'Yay ayları sizin evinizdə keçdi.\nNağıllar heç vaxt təkrarlanmadı.\nƏn yaxşı yemək sizin süfrənizdə idi.\nDanlaq heç vaxt ürəkdən olmadı.',
  penalty: 'Sənəd müddətsizdir. İllər sonra bu vərəq nəslin haradan gəldiyini xatırlatmaq üçün saxlanılır.',
  titleOptions: [
    'Nənə və Babaya Ünvanlanmış Rəsmi Xatirə və Minnətdarlıq Sənədi',
    'Nəsillərarası Bağlılığın Qeydiyyatına dair Xatirə Sənədi',
    'Uşaqlıq Xatirələrinə Görə Verilmiş Minnətdarlıq Sənədi',
    'Ailə Kökünün Xatirə Qaydasında Təsbitinə dair Sənəd'
  ],
  powersOptions: [
    'Yay ayları sizin evinizdə keçdi.',
    'Nağıllar heç vaxt təkrarlanmadı.',
    'Ən yaxşı yemək sizin süfrənizdə idi.',
    'Danlaq heç vaxt ürəkdən olmadı.',
    'Cib xərcliyi gizli verildi.',
    'Səhvlərimiz valideynlərdən gizlədildi.',
    'Bağçadakı ağac hələ də durur.',
    'Həmin ev hələ də xatırlanır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Sənəd müddətsizdir. İllər sonra bu vərəq nəslin haradan gəldiyini xatırlatmaq üçün saxlanılır.',
    'Sənəd ailə arxivində saxlanılır.',
    'Xatirə nəsildən-nəslə ötürülür.'
  ]
},
{
  id: 'baci-qardas-sehadetnamesi', cat: 'x-family', tone: 'xatire', layout: 'sertifikat', palette: 'burgundy',
  title: 'Bacı-Qardaş Bağlılığının Rəsmi Təsdiqinə dair Xatirə Şəhadətnaməsi', tag: 'Bacı-qardaş',
  signOrg: 'Ailə Bağlılığının Təsdiqi üzrə Səmimi Şura',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'QEYD',
  preamble: 'Bu şəhadətnamə ilə {from} və {to} arasındakı bacı-qardaş bağlılığı rəsmi qaydada təsdiq olunur. Bağlılıq uşaqlıq illərində formalaşmış və bütün mübahisələrə baxmayaraq zəifləməmişdir.',
  powers: 'Uşaqlıq mübahisələri heç nəyi pozmadı.\nBir-birini valideynlərdən gizlətdi.\nÇətin gündə ilk zəng bir-birinə edildi.\nBu bağ seçilmir, verilir.',
  penalty: 'Şəhadətnamə müddətsizdir və heç bir halda ləğv edilmir. Bu bağlılıq seçim deyil, verilmiş nemətdir.',
  titleOptions: [
    'Bacı-Qardaş Bağlılığının Rəsmi Təsdiqinə dair Xatirə Şəhadətnaməsi',
    'Birgə Böyümüş Uşaqlıq Dövrünün Xatirə Şəhadətnaməsi',
    'Ailədaxili Bağlılığın Qeydiyyatına dair Şəhadətnamə',
    'Ömürlük Müttəfiqliyin Təsdiqinə dair Şəhadətnamə'
  ],
  powersOptions: [
    'Uşaqlıq mübahisələri heç nəyi pozmadı.',
    'Bir-birini valideynlərdən gizlətdi.',
    'Çətin gündə ilk zəng bir-birinə edildi.',
    'Bu bağ seçilmir, verilir.',
    'Oyuncaqlar bölüşüldü, sonda barışıldı.',
    'Sirlər heç vaxt açılmadı.',
    'Uğurlar həsədsiz sevindirdi.',
    'Ailə süfrəsində yerlər dəyişmədi.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Şəhadətnamə müddətsizdir və heç bir halda ləğv edilmir. Bu bağlılıq seçim deyil, verilmiş nemətdir.',
    'Sənəd ailə arxivində saxlanılır.',
    'Şəhadətnamə ildönümlərində yenidən oxunur.'
  ]
},
{
  id: 'yeni-dogulan-sehadetnamesi', cat: 'x-family', tone: 'xatire', layout: 'ekspertiza', palette: 'rose',
  title: 'Ailənin Yeni Üzvünün Dünyaya Gəlişinə dair Xatirə Şəhadətnaməsi', tag: 'Yeni doğulan',
  signOrg: 'Nəsil və Kök Xatirələrinin Qeydiyyatı Şöbəsi',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'QEYD',
  preamble: 'Bu şəhadətnamə ilə ailənin yeni üzvünün dünyaya gəlişi xatirə qaydasında qeydə alınır. Sənəd {from} tərəfindən tərtib olunmuş, {to} adlı şəxsin adına təqdim edilmiş və ailə arxivinə daxil edilmişdir.',
  powers: 'Gözləmə uzun və həyəcanlı oldu.\nBütün ailə həmin gün bir yerdə idi.\nAd uzun müzakirədən sonra seçildi.\nBu gün heç vaxt unudulmayacaq.',
  penalty: 'Şəhadətnamə müddətsizdir. O, yetkinlik yaşında sənəd sahibinə təqdim olunmaq üçün saxlanılır.',
  titleOptions: [
    'Ailənin Yeni Üzvünün Dünyaya Gəlişinə dair Xatirə Şəhadətnaməsi',
    'Ailəyə Yeni Üzvün Qatılmasının Xatirə Qeydiyyatı',
    'Doğum Gününün və İlk Anların Xatirə Şəhadətnaməsi',
    'Yeni Nəslin Başlanğıcına dair Xatirə Sənədi'
  ],
  powersOptions: [
    'Gözləmə uzun və həyəcanlı oldu.',
    'Bütün ailə həmin gün bir yerdə idi.',
    'Ad uzun müzakirədən sonra seçildi.',
    'Bu gün heç vaxt unudulmayacaq.',
    'İlk şəkil dərhal çəkildi.',
    'Qohumlar həmin gün xəbərdar edildi.',
    'Ev əvvəlcədən hazırlanmışdı.',
    'İlk gecə heç kim yatmadı.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Şəhadətnamə müddətsizdir. O, yetkinlik yaşında sənəd sahibinə təqdim olunmaq üçün saxlanılır.',
    'Sənəd ailə arxivində qorunur.',
    'Şəhadətnamə hər ad günündə yenidən oxunur.'
  ]
},
{
  id: 'aile-birliyi', cat: 'x-family', tone: 'xatire', layout: 'blank', palette: 'forest',
  title: 'Ailə Üzvlərinin Birliyinin və Dayanıqlığının Rəsmi Bəyanı', tag: 'Bəyannamə',
  signOrg: 'Ailə Bağlılığının Təsdiqi üzrə Səmimi Şura',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'QEYD',
  preamble: 'Bu bəyannamə ilə {from} və {to} adlı şəxslərin daxil olduğu ailənin birliyi rəsmi qaydada bəyan edilir. Bəyannamə heç bir üzvü digərindən üstün tutmur və hamıya eyni qaydada aiddir.',
  powers: 'Çətinliklər ailə daxilində həll olunur.\nHeç bir üzv tək qoyulmur.\nQərarlar birgə müzakirə edilir.\nSüfrədə hər kəsin yeri var.',
  penalty: 'Bəyannamə müddətsizdir. Onun qüvvəsi yalnız bir şərtlə saxlanılır — bir-birindən xəbərdar olmaq.',
  titleOptions: [
    'Ailə Üzvlərinin Birliyinin və Dayanıqlığının Rəsmi Bəyanı',
    'Ailənin Bir Yerdə Qalması Prinsipinə dair Bəyannamə',
    'Ortaq Dəyərlərin Təsbiti haqqında Ailə Bəyannaməsi',
    'Ailədaxili Dəstəyin Bəyan Edilməsinə dair Sənəd'
  ],
  powersOptions: [
    'Çətinliklər ailə daxilində həll olunur.',
    'Heç bir üzv tək qoyulmur.',
    'Qərarlar birgə müzakirə edilir.',
    'Süfrədə hər kəsin yeri var.',
    'Uğur birlikdə qeyd olunur.',
    'Səhvlər ailə daxilində qalır.',
    'Bayramlar bir yerdə keçirilir.',
    'Ev hər kəs üçün açıqdır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Bəyannamə müddətsizdir. Onun qüvvəsi yalnız bir şərtlə saxlanılır — bir-birindən xəbərdar olmaq.',
    'Sənəd ailə arxivində saxlanılır.',
    'Bəyannamə hər il yenidən oxunur.'
  ]
},
{
  id: 'aile-toplantisi', cat: 'x-family', tone: 'xatire', layout: 'viza', palette: 'ink',
  title: 'Ailə Toplantısının Keçirilməsinin Xatirə Qaydasında Protokolu', tag: 'Toplantı',
  signOrg: 'Ailə Xatirələrinin Qeydiyyatı üzrə Palata',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'QEYD',
  preamble: 'Bu protokolla {from} və {to} adlı şəxslərin iştirakı ilə keçirilən ailə toplantısı xatirə qaydasında qeydə alınır. Toplantının gündəliyi yoxdur, çünki əsas məqsəd bir yerdə olmaqdır.',
  powers: 'Bütün üzvlər iştirak etdi.\nGündəlik əvvəlcədən müəyyən edilmədi.\nSöhbət gecə yarısına qədər davam etdi.\nŞəkil çəkilməyi hamı unutdu.',
  penalty: 'Protokol dəyişdirilmir. İllər sonra bu sənəd həmin axşamı olduğu kimi xatırlatmaq üçün saxlanılır.',
  titleOptions: [
    'Ailə Toplantısının Keçirilməsinin Xatirə Qaydasında Protokolu',
    'Ailə Süfrəsi Arxasındakı Söhbətlərin Xatirə Protokolu',
    'Bayram Toplantısının Qeydə Alınmasına dair Protokol',
    'Ailə Yığıncağının Xatirə Sənədi'
  ],
  powersOptions: [
    'Bütün üzvlər iştirak etdi.',
    'Gündəlik əvvəlcədən müəyyən edilmədi.',
    'Söhbət gecə yarısına qədər davam etdi.',
    'Şəkil çəkilməyi hamı unutdu.',
    'Köhnə hekayələr yenidən danışıldı.',
    'Uşaqlar ayrı masada oturdu.',
    'Yemək həmişəki kimi çox oldu.',
    'Növbəti toplantının tarixi təyin edildi.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Protokol dəyişdirilmir. İllər sonra bu sənəd həmin axşamı olduğu kimi xatırlatmaq üçün saxlanılır.',
    'Sənəd ailə arxivində saxlanılır.',
    'Protokola şəkillər əlavə edilə bilər.'
  ]
},
{
  id: 'aile-uzvu-karti', cat: 'x-family', tone: 'xatire', layout: 'lisenziya', palette: 'steel',
  title: 'Ailə Üzvlüyünün və Ona Bağlı Hüquqların Təsdiqinə dair Kart', tag: 'Kart',
  signOrg: 'Ailə Bağlılığının Təsdiqi üzrə Səmimi Şura',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'QEYD',
  preamble: 'Bu kart {to} adlı şəxsin ailə üzvlüyünü təsdiq edir. Sənəd {from} tərəfindən verilmişdir, üzvlüyə bağlı bütün hüquqları müddətsiz olaraq tanıyır və məsafədən asılı olmayaraq qüvvədə qalır.',
  powers: 'Süfrədə daimi yer ayrılır.\nEv istənilən vaxt açıqdır.\nÇətinlikdə dəstək şərtsizdir.\nFikir bildirmək hüququ tanınır.',
  penalty: 'Kart müddətsizdir və heç bir halda geri alınmır. Üzvlük məsafə və vaxtdan asılı deyil.',
  titleOptions: [
    'Ailə Üzvlüyünün və Ona Bağlı Hüquqların Təsdiqinə dair Kart',
    'Ailə Daxilində Statusun Təsdiqinə dair Xatirə Kartı',
    'Süfrədə Daimi Yerin Təsdiqinə dair Ailə Kartı',
    'Ailə Üzvünün Hüquqlarının Qeydiyyatı Kartı'
  ],
  powersOptions: [
    'Süfrədə daimi yer ayrılır.',
    'Ev istənilən vaxt açıqdır.',
    'Çətinlikdə dəstək şərtsizdir.',
    'Fikir bildirmək hüququ tanınır.',
    'Bayramlarda iştirak gözlənilir.',
    'Xoş xəbər birinci ailəyə çatdırılır.',
    'Uzaqlıq üzvlüyü dayandırmır.',
    'Yeni üzvlər eyni hüquqlarla qəbul edilir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Kart müddətsizdir və heç bir halda geri alınmır. Üzvlük məsafə və vaxtdan asılı deyil.',
    'Kart ailə arxivində saxlanılır.',
    'Hüquqlar bütün üzvlərə eynidir.'
  ]
},
{
  id: 'aile-arayisi', cat: 'x-family', tone: 'xatire', layout: 'arayis', palette: 'gold',
  title: 'Ailənin Tərkibi və Ortaq Xatirələri haqqında Rəsmi Arayış', tag: 'Arayış',
  signOrg: 'Ailə Xatirələrinin Qeydiyyatı üzrə Palata',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'QEYD',
  preamble: 'Verilir {to} adlı şəxsə ondan ötrü ki, ailənin tərkibi, ənənələri və ortaq xatirələri {from} tərəfindən qeydə alınmışdır. Arayış rəsmi qeydiyyat əvəzinə deyil, yalnız xatirə kimi verilir.',
  powers: 'Ailənin tərkibi sənəddə göstərilib.\nOrtaq xatirələr siyahıya salınıb.\nHər üzvün öz rolu var.\nSiyahı zamanla genişlənir.',
  penalty: 'Arayış müddətsizdir və dəyişdirilmir. Ona yalnız yeni üzvlər və yeni xatirələr əlavə edilir.',
  titleOptions: [
    'Ailənin Tərkibi və Ortaq Xatirələri haqqında Rəsmi Arayış',
    'Ailə Üzvlərinin Siyahısı haqqında Xatirə Arayışı',
    'Ortaq Xatirələrin Qeydə Alınması haqqında Arayış',
    'Ailə Tarixinin Təsbitinə dair Rəsmi Arayış'
  ],
  powersOptions: [
    'Ailənin tərkibi sənəddə göstərilib.',
    'Ortaq xatirələr siyahıya salınıb.',
    'Hər üzvün öz rolu var.',
    'Siyahı zamanla genişlənir.',
    'Köhnə şəkillər arxivə əlavə edilib.',
    'Ənənələr yazıya alınıb.',
    'Doğum tarixləri dəqiqləşdirilib.',
    'Uzaq qohumlar da qeyd olunub.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Arayış müddətsizdir və dəyişdirilmir. Ona yalnız yeni üzvlər və yeni xatirələr əlavə edilir.',
    'Arayış ailə arxivində saxlanılır.',
    'Sənəd hər il yenilənir.'
  ]
},
{
  id: 'aile-surasi-qerari', cat: 'x-family', tone: 'xatire', layout: 'qerar', palette: 'burgundy',
  title: 'Ailə Şurasının Müzakirədən Sonra Qəbul Etdiyi Xatirə Qərarı', tag: 'Şura',
  signOrg: 'Ailə Bağlılığının Təsdiqi üzrə Səmimi Şura',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'QEYD',
  preamble: 'Şura {from} və {to} adlı şəxslərin iştirakı ilə keçirilən müzakirədən sonra qərar qəbul etmişdir. Bütün üzvlərin mövqeyi ayrıca dinlənilmiş və yekun qənaətə birgə, yekdilliklə gəlinmişdir.',
  powers: 'Hər üzvün fikri ayrıca dinlənildi.\nQərar yekdilliklə qəbul edildi.\nUşaqların rəyi də soruşuldu.\nNəticə hamı üçün məqbul oldu.',
  penalty: 'Qərar müddətsizdir. Yeni hallar yarandıqda şura yenidən toplanır və məsələyə birgə baxılır.',
  titleOptions: [
    'Ailə Şurasının Müzakirədən Sonra Qəbul Etdiyi Xatirə Qərarı',
    'Ailə Məsələsi üzrə Yekdilliklə Qəbul Edilmiş Qərar',
    'Uzun Söhbətin Yekununa dair Ailə Qərarı',
    'Ortaq Mövqeyin Təsbitinə dair Xatirə Qərarı'
  ],
  powersOptions: [
    'Hər üzvün fikri ayrıca dinlənildi.',
    'Qərar yekdilliklə qəbul edildi.',
    'Uşaqların rəyi də soruşuldu.',
    'Nəticə hamı üçün məqbul oldu.',
    'Müzakirə sakit şəraitdə keçdi.',
    'Səs tonu heç vaxt qalxmadı.',
    'İştirak etməyənlər sonradan məlumatlandırıldı.',
    'Qərar arxivə daxil edildi.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Qərar müddətsizdir. Yeni hallar yarandıqda şura yenidən toplanır və məsələyə birgə baxılır.',
    'Qərar ailə arxivində saxlanılır.',
    'Sənəd bütün üzvlərə çatdırılır.'
  ]
},
{
  id: 'aile-sazisi', cat: 'x-family', tone: 'xatire', layout: 'muqavile', palette: 'steel',
  title: 'Ailə Daxilində Ortaq Dəyərlərin Razılaşdırılması üzrə Saziş', tag: 'Saziş',
  signOrg: 'Nəsil və Kök Xatirələrinin Qeydiyyatı Şöbəsi',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'QEYD',
  preamble: 'Bu sazişlə {from} və {to} adlı şəxslər ailə daxilində ortaq dəyərləri, ənənələri və bayram qaydalarını razılaşdırırlar. Saziş yeni öhdəlik yaratmır, illərdir mövcud olan qaydaları yazıya alır.',
  powers: 'Bayramlar bir yerdə keçirilir.\nXəstəlik xəbəri gizlədilmir.\nQərarlar birgə qəbul olunur.\nEv hər üzv üçün açıq qalır.',
  penalty: 'Saziş müddətsizdir. Onun yeganə şərti — ənənələri qorumaq və növbəti nəslə ötürməkdir.',
  titleOptions: [
    'Ailə Daxilində Ortaq Dəyərlərin Razılaşdırılması üzrə Saziş',
    'Ailə Ənənələrinin Yazıya Alınması üzrə Xatirə Sazişi',
    'Nəsillərarası Öhdəliklərin Təsbiti üzrə Saziş',
    'Ailə Qaydalarının Razılaşdırılmasına dair Sənəd'
  ],
  powersOptions: [
    'Bayramlar bir yerdə keçirilir.',
    'Xəstəlik xəbəri gizlədilmir.',
    'Qərarlar birgə qəbul olunur.',
    'Ev hər üzv üçün açıq qalır.',
    'Ənənələr növbəti nəslə ötürülür.',
    'Ailə süfrəsi ənənəvi qalır.',
    'Uzaqda olanlar unudulmur.',
    'Köhnə şəkillər qorunur.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Saziş müddətsizdir. Onun yeganə şərti — ənənələri qorumaq və növbəti nəslə ötürməkdir.',
    'Saziş ailə arxivində saxlanılır.',
    'Sənəd hər nəsildə yenidən imzalanır.'
  ]
},
{
  id: 'aile-teleqrami', cat: 'x-family', tone: 'xatire', layout: 'teleqram', palette: 'forest',
  title: 'Ailə Üzvlərinə Ünvanlanmış Rəsmi və Səmimi Xatirə Teleqramı', tag: 'Qısa mesaj',
  signOrg: 'Ailə Xatirələrinin Qeydiyyatı üzrə Palata',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'QEYD',
  preamble: 'Sizə bildiririk ki, {from} tərəfindən {to} adlı şəxsə ailə üzvləri adından səmimi mesaj göndərilir. Mesaj qısadır, çünki əsas sözlər artıq hər kəsə məlumdur və uzun izahat tələb etmir.',
  powers: 'Hamı sağ-salamatdır.\nXatırlanırsınız və gözlənilirsiniz.\nEv əvvəlki kimi durur.\nGörüş tarixi razılaşdırılacaq.',
  penalty: 'Teleqram heç bir öhdəlik yaratmır. Onun yeganə məqsədi xatırlandığını bildirməkdir.',
  titleOptions: [
    'Ailə Üzvlərinə Ünvanlanmış Rəsmi və Səmimi Xatirə Teleqramı',
    'Uzaqdan Göndərilmiş Səmimi Ailə Teleqramı',
    'Qısa Sözlərlə Bildirilmiş Ailə Mesajının Teleqramı',
    'Xatırlandığını Bildirən Rəsmi Ailə Teleqramı'
  ],
  powersOptions: [
    'Hamı sağ-salamatdır.',
    'Xatırlanırsınız və gözlənilirsiniz.',
    'Ev əvvəlki kimi durur.',
    'Görüş tarixi razılaşdırılacaq.',
    'Bayram süfrəsində yeriniz saxlanılır.',
    'Uşaqlar sizi soruşur.',
    'Şəkillər göndəriləcək.',
    'Zəng axşam gözlənilir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Teleqram heç bir öhdəlik yaratmır. Onun yeganə məqsədi xatırlandığını bildirməkdir.',
    'Teleqram ailə arxivində saxlanılır.',
    'Mesaj olduğu kimi qorunur.'
  ]
},
{
  id: 'aile-vesiqesi', cat: 'x-family', tone: 'xatire', layout: 'vesiqe', palette: 'ink',
  title: 'Ailəyə Mənsubluğun və Ortaq Kökün Təsdiqinə dair Xatirə Vəsiqəsi', tag: 'Vəsiqə',
  signOrg: 'Ailə Bağlılığının Təsdiqi üzrə Səmimi Şura',
  toLabel: 'KİMƏ', fromLabel: 'KİMDƏN', powersLabel: 'ƏSASLAR', penaltyLabel: 'QEYD',
  preamble: 'Bu vəsiqə {to} adlı şəxsin ailəyə və ortaq kökə mənsubluğunu təsdiq edir. Sənəd {from} tərəfindən verilmişdir, rəsmi qeydiyyatı əvəz etmir, xatirə xarakteri daşıyır və geri alınmır.',
  powers: 'Ailəyə mənsubluq müddətsiz tanınır.\nOrtaq kök sənəddə göstərilib.\nBütün hüquqlar bərabərdir.\nVəsiqə geri alınmır.',
  penalty: 'Vəsiqə müddətsizdir. O, harada olmağından asılı olmayaraq hara aid olduğunu xatırladır.',
  titleOptions: [
    'Ailəyə Mənsubluğun və Ortaq Kökün Təsdiqinə dair Xatirə Vəsiqəsi',
    'Ailə Adının və Kökünün Qeydiyyatına dair Vəsiqə',
    'Nəslə Mənsubluğun Təsdiqinə dair Xatirə Vəsiqəsi',
    'Ailə Statusunun Rəsmi Tanınmasına dair Vəsiqə'
  ],
  powersOptions: [
    'Ailəyə mənsubluq müddətsiz tanınır.',
    'Ortaq kök sənəddə göstərilib.',
    'Bütün hüquqlar bərabərdir.',
    'Vəsiqə geri alınmır.',
    'Ailə adı nəsildən-nəslə ötürülür.',
    'Xatirələr ortaq arxivdədir.',
    'Ənənələr qorunub saxlanılır.',
    'Yeni üzvlər eyni qaydada qeydə alınır.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Vəsiqə müddətsizdir. O, harada olmağından asılı olmayaraq hara aid olduğunu xatırladır.',
    'Vəsiqə ailə arxivində saxlanılır.',
    'Sənəd hər üzvə ayrıca verilir.'
  ]
},

/* ==================== TƏBRİKLƏR ==================== */
{
  id: 'ad-gunu-tebriknamesi', cat: 'x-greetings', tone: 'xatire', layout: 'diplom', palette: 'rose',
  title: 'Ad Günü Münasibətilə Ünvanlanmış Rəsmi və Səmimi Təbriknamə', tag: 'Ad günü',
  signOrg: 'Yubiley və Əlamətdar Günlərin Qeydiyyatı Şurası',
  toLabel: 'TƏBRİK OLUNAN', fromLabel: 'TƏBRİK EDƏN', powersLabel: 'ARZULAR', penaltyLabel: 'QEYD',
  preamble: 'Bu təbriknamə ilə {from} tərəfindən {to} adlı şəxsə ad günü münasibətilə səmimi təbriklər ünvanlanır. Arzular səmimidir, heç bir qarşılıq gözləmir və yalnız yaxşı niyyətdən doğaraq yazıya alınır.',
  powers: 'Yeni yaş sağlamlıqla başlasın.\nArzular gecikmədən gerçəkləşsin.\nYaxınlar həmişə yanında olsun.\nBu gün hər il eyni sevinclə qeyd olunsun.',
  penalty: 'Təbriknamə heç bir öhdəlik yaratmır. Yeganə gözlənti — növbəti ad gününə qədər sağ-salamat qalmaqdır.',
  titleOptions: [
    'Ad Günü Münasibətilə Ünvanlanmış Rəsmi və Səmimi Təbriknamə',
    'Doğum Günü Münasibətilə Verilmiş Səmimi Təbriknamə',
    'Yeni Yaşın Başlanması Münasibətilə Rəsmi Təbriknamə',
    'Əlamətdar Günün Qeyd Edilməsinə dair Təbriknamə'
  ],
  powersOptions: [
    'Yeni yaş sağlamlıqla başlasın.',
    'Arzular gecikmədən gerçəkləşsin.',
    'Yaxınlar həmişə yanında olsun.',
    'Bu gün hər il eyni sevinclə qeyd olunsun.',
    'Keçən il layiqincə başa çatdı.',
    'Qazanılanlar itirilməsin.',
    'Planlar öz vaxtında gerçəkləşsin.',
    'Sevinc həmişə bölüşülsün.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Təbriknamə heç bir öhdəlik yaratmır. Yeganə gözlənti — növbəti ad gününə qədər sağ-salamat qalmaqdır.',
    'Sənəd xatirə arxivində saxlanılır.',
    'Təbrik hər il yenidən təkrarlanır.'
  ]
},
{
  id: 'yubiley-fexri-fermani', cat: 'x-greetings', tone: 'xatire', layout: 'viza', palette: 'gold',
  title: 'Yubiley Münasibətilə Təqdim Edilən Rəsmi və Fəxri Fərman', tag: 'Yubiley',
  signOrg: 'Yubiley və Əlamətdar Günlərin Qeydiyyatı Şurası',
  toLabel: 'TƏBRİK OLUNAN', fromLabel: 'TƏBRİK EDƏN', powersLabel: 'ARZULAR', penaltyLabel: 'QEYD',
  preamble: 'Şura {to} adlı şəxsin yubileyi münasibətilə təltif haqqında qərar qəbul etmişdir. Fərman {from} tərəfindən təqdim olunur, keçən illərin nəticələrini əks etdirir və müddətsiz hesab edilir.',
  powers: 'Keçən illər layiqincə yaşandı.\nƏtrafdakılar üçün nümunə olundu.\nÇətinliklər ləyaqətlə keçildi.\nQarşıda daha çox yubiley var.',
  penalty: 'Fərman geri alınmır və müddətsizdir. O, növbəti yubileydə yenidən oxunmaq üçün saxlanılır.',
  titleOptions: [
    'Yubiley Münasibətilə Təqdim Edilən Rəsmi və Fəxri Fərman',
    'Əlamətdar Yaş Dönümünə Görə Verilmiş Fəxri Fərman',
    'Keçən İllərin Yekununa dair Rəsmi Yubiley Fərmanı',
    'Yubilyarın Təltif Edilməsi haqqında Fəxri Fərman'
  ],
  powersOptions: [
    'Keçən illər layiqincə yaşandı.',
    'Ətrafdakılar üçün nümunə olundu.',
    'Çətinliklər ləyaqətlə keçildi.',
    'Qarşıda daha çox yubiley var.',
    'Ailə və dostlar həmişə yanında oldu.',
    'Peşə yolu hörmətlə keçildi.',
    'Verilən sözlər yerinə yetirildi.',
    'Təcrübə həvəslə bölüşüldü.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Fərman geri alınmır və müddətsizdir. O, növbəti yubileydə yenidən oxunmaq üçün saxlanılır.',
    'Sənəd ailə arxivində saxlanılır.',
    'Təltif hər yubileydə təkrarlanır.'
  ]
},
{
  id: 'novruz-tebriknamesi', cat: 'x-greetings', tone: 'xatire', layout: 'notarial', palette: 'forest',
  title: 'Novruz Bayramı Münasibətilə Ünvanlanmış Rəsmi Təbriknamə', tag: 'Novruz',
  signOrg: 'Bayram Təbriklərinin Çatdırılması üzrə Şöbə',
  toLabel: 'TƏBRİK OLUNAN', fromLabel: 'TƏBRİK EDƏN', powersLabel: 'ARZULAR', penaltyLabel: 'QEYD',
  preamble: 'Bahar bayramı münasibətilə {from} tərəfindən {to} adlı şəxsə səmimi təbriklər ünvanlanır. Arzular köhnə ənənəyə uyğun olaraq yazılı formada, vaxtında və heç bir qarşılıq gözlənilmədən çatdırılır.',
  powers: 'Bahar evə bərəkət gətirsin.\nSüfrə həmişə dolu olsun.\nQapıdan yalnız xoş xəbər girsin.\nAilə bir yerdə olsun.',
  penalty: 'Təbriknamə heç bir öhdəlik yaratmır. Yeganə xahiş — bu arzuları növbəti nəslə ötürməkdir.',
  titleOptions: [
    'Novruz Bayramı Münasibətilə Ünvanlanmış Rəsmi Təbriknamə',
    'Bahar Bayramı Münasibətilə Verilmiş Səmimi Təbriknamə',
    'Yeni İlin Başlanğıcı Münasibətilə Təbriknamə',
    'Novruz Arzularının Rəsmi Çatdırılmasına dair Sənəd'
  ],
  powersOptions: [
    'Bahar evə bərəkət gətirsin.',
    'Süfrə həmişə dolu olsun.',
    'Qapıdan yalnız xoş xəbər girsin.',
    'Ailə bir yerdə olsun.',
    'Tonqal üstündən sağlamlıqla adlanılsın.',
    'Səməni ilbəil yaşıllaşsın.',
    'Qonşular unudulmasın.',
    'Köhnə küsülər bahara qalmasın.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Təbriknamə heç bir öhdəlik yaratmır. Yeganə xahiş — bu arzuları növbəti nəslə ötürməkdir.',
    'Sənəd xatirə arxivində saxlanılır.',
    'Təbrik hər bayramda yenilənir.'
  ]
},
{
  id: 'yeni-il-tebriknamesi', cat: 'x-greetings', tone: 'xatire', layout: 'sertifikat', palette: 'burgundy',
  title: 'Yeni İl Münasibətilə Ünvanlanmış Rəsmi və Səmimi Təbriknamə', tag: 'Yeni il',
  signOrg: 'Bayram Təbriklərinin Çatdırılması üzrə Şöbə',
  toLabel: 'TƏBRİK OLUNAN', fromLabel: 'TƏBRİK EDƏN', powersLabel: 'ARZULAR', penaltyLabel: 'QEYD',
  preamble: 'Bu təbriknamə ilə {from} tərəfindən {to} adlı şəxsə Yeni il münasibətilə səmimi təbriklər ünvanlanır. Keçən il yola salınır, yeni il isə yaxşı arzular və konkret niyyətlərlə qarşılanır.',
  powers: 'Keçən ilin çətinlikləri geridə qalsın.\nYeni il gözlənilməz sevinclər gətirsin.\nSağlamlıq hər şeydən üstün olsun.\nPlanlar bu dəfə gerçəkləşsin.',
  penalty: 'Təbriknamə heç bir öhdəlik yaratmır. Yeganə gözlənti — növbəti ili birlikdə qarşılamaqdır.',
  titleOptions: [
    'Yeni İl Münasibətilə Ünvanlanmış Rəsmi və Səmimi Təbriknamə',
    'İlin Dəyişməsi Münasibətilə Verilmiş Təbriknamə',
    'Keçən İlin Yekunu və Yeni Arzular haqqında Təbriknamə',
    'Yeni İl Arzularının Rəsmi Çatdırılmasına dair Sənəd'
  ],
  powersOptions: [
    'Keçən ilin çətinlikləri geridə qalsın.',
    'Yeni il gözlənilməz sevinclər gətirsin.',
    'Sağlamlıq hər şeydən üstün olsun.',
    'Planlar bu dəfə gerçəkləşsin.',
    'Ailə süfrəsi bütöv qalsın.',
    'Yolda olanlar sağ-salamat qayıtsın.',
    'Köhnə dostlar unudulmasın.',
    'Yeni tanışlıqlar xoş olsun.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Təbriknamə heç bir öhdəlik yaratmır. Yeganə gözlənti — növbəti ili birlikdə qarşılamaqdır.',
    'Sənəd xatirə arxivində saxlanılır.',
    'Təbrik hər il yenidən yazılır.'
  ]
},
{
  id: 'bayram-tebriknamesi', cat: 'x-greetings', tone: 'xatire', layout: 'blank', palette: 'gold',
  title: 'Bayram Münasibətilə Ünvanlanmış Rəsmi Təbrik Bəyannaməsi', tag: 'Bayram',
  signOrg: 'Bayram Təbriklərinin Çatdırılması üzrə Şöbə',
  toLabel: 'TƏBRİK OLUNAN', fromLabel: 'TƏBRİK EDƏN', powersLabel: 'ARZULAR', penaltyLabel: 'QEYD',
  preamble: 'Bu bəyannamə ilə {from} tərəfindən {to} adlı şəxsə bayram münasibətilə səmimi təbriklər ünvanlanır. Təbrik ailənin bütün üzvləri adından bildirilir və heç bir qarşılıq və ya cavab gözləmir.',
  powers: 'Bayram evə xeyir-bərəkət gətirsin.\nSüfrə arxasında hamı bir yerdə olsun.\nXəstələr sağalsın, uzaqdakılar qayıtsın.\nSevinc paylaşdıqca artsın.',
  penalty: 'Bəyannamə heç bir öhdəlik yaratmır. Onun yeganə məqsədi təbriklərin vaxtında çatdırılmasıdır.',
  titleOptions: [
    'Bayram Münasibətilə Ünvanlanmış Rəsmi Təbrik Bəyannaməsi',
    'Əlamətdar Gün Münasibətilə Verilmiş Təbriknamə',
    'Bayram Arzularının Rəsmi Bəyanına dair Sənəd',
    'Ümumi Bayram Təbriklərinin Çatdırılması Bəyannaməsi'
  ],
  powersOptions: [
    'Bayram evə xeyir-bərəkət gətirsin.',
    'Süfrə arxasında hamı bir yerdə olsun.',
    'Xəstələr sağalsın, uzaqdakılar qayıtsın.',
    'Sevinc paylaşdıqca artsın.',
    'Qonşular və qohumlar unudulmasın.',
    'Köhnə küsülər bayrama qalmasın.',
    'Uşaqların bayram payı əsirgənməsin.',
    'Növbəti bayram daha şən keçsin.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Bəyannamə heç bir öhdəlik yaratmır. Onun yeganə məqsədi təbriklərin vaxtında çatdırılmasıdır.',
    'Sənəd xatirə arxivində saxlanılır.',
    'Təbrik hər bayramda yenidən bildirilir.'
  ]
},
{
  id: 'sekkiz-mart-tebriknamesi', cat: 'x-greetings', tone: 'xatire', layout: 'ekspertiza', palette: 'rose',
  title: 'Bahar və Qadınlar Günü Münasibətilə Ünvanlanmış Təbriknamə', tag: '8 Mart',
  signOrg: 'Təbrik və Arzuların Qeydiyyatı üzrə Palata',
  toLabel: 'TƏBRİK OLUNAN', fromLabel: 'TƏBRİK EDƏN', powersLabel: 'ARZULAR', penaltyLabel: 'QEYD',
  preamble: 'İşbu sənədlə {from} tərəfindən {to} adlı şəxsə bahar və qadınlar günü münasibətilə səmimi təbriklər ünvanlanır. Təbrik yalnız bir günə deyil, ilin bütün qalan günlərinə də şamil olunur.',
  powers: 'Diqqət yalnız bir günlə məhdudlaşmasın.\nZəhmət hər gün qiymətləndirilsin.\nArzular gecikmədən gerçəkləşsin.\nGülüş üzdən əskik olmasın.',
  penalty: 'Təbriknamə heç bir öhdəlik yaratmır, lakin onun ruhu ilin qalan üç yüz altmış dörd gününə də şamil olunur.',
  titleOptions: [
    'Bahar və Qadınlar Günü Münasibətilə Ünvanlanmış Təbriknamə',
    '8 Mart Münasibətilə Verilmiş Rəsmi Təbriknamə',
    'Qadınlar Gününə Həsr Olunmuş Səmimi Təbriknamə',
    'Bahar Bayramı Münasibətilə Təqdim Edilən Sənəd'
  ],
  powersOptions: [
    'Diqqət yalnız bir günlə məhdudlaşmasın.',
    'Zəhmət hər gün qiymətləndirilsin.',
    'Arzular gecikmədən gerçəkləşsin.',
    'Gülüş üzdən əskik olmasın.',
    'Səbir və dözüm boşa getməsin.',
    'Yorğunluq həmişə paylaşılsın.',
    'Sözlər vaxtında deyilsin.',
    'Çiçəklər səbəbsiz də verilsin.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Təbriknamə heç bir öhdəlik yaratmır, lakin onun ruhu ilin qalan üç yüz altmış dörd gününə də şamil olunur.',
    'Sənəd xatirə arxivində saxlanılır.',
    'Təbrik hər il yenidən bildirilir.'
  ]
},
{
  id: 'tebrik-karti', cat: 'x-greetings', tone: 'xatire', layout: 'lisenziya', palette: 'steel',
  title: 'Əlamətdar Gün Münasibətilə Təqdim Edilən Xatirə Təbrik Kartı', tag: 'Kart',
  signOrg: 'Təbrik və Arzuların Qeydiyyatı üzrə Palata',
  toLabel: 'TƏBRİK OLUNAN', fromLabel: 'TƏBRİK EDƏN', powersLabel: 'ARZULAR', penaltyLabel: 'QEYD',
  preamble: 'Bu kartla {from} tərəfindən {to} adlı şəxsə əlamətdar gün münasibətilə səmimi arzular çatdırılır. Kart sadə sözlərlə və öz əli ilə yazılıb, çünki səmimiyyət uzun cümlə tələb etmir.',
  powers: 'Arzular sadə və səmimidir.\nHeç bir qarşılıq gözlənilmir.\nSözlər ürəkdən yazılıb.\nKart saxlanılmaq üçün verilir.',
  penalty: 'Kart heç bir öhdəlik yaratmır. O, yalnız həmin günün xatirəsini saxlamaq üçün verilir.',
  titleOptions: [
    'Əlamətdar Gün Münasibətilə Təqdim Edilən Xatirə Təbrik Kartı',
    'Səmimi Arzuların Yazıya Alınmasına dair Təbrik Kartı',
    'Qısa Təbrikin Rəsmi Formada Təqdimatı Kartı',
    'Xatirə Qaydasında Saxlanılan Təbrik Kartı'
  ],
  powersOptions: [
    'Arzular sadə və səmimidir.',
    'Heç bir qarşılıq gözlənilmir.',
    'Sözlər ürəkdən yazılıb.',
    'Kart saxlanılmaq üçün verilir.',
    'Xətt öz əli ilə yazılıb.',
    'Tarix kartın üzərində qeyd olunub.',
    'Şəkil əlavə edilə bilər.',
    'Kart illər sonra da oxunacaq.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Kart heç bir öhdəlik yaratmır. O, yalnız həmin günün xatirəsini saxlamaq üçün verilir.',
    'Kart xatirə arxivində saxlanılır.',
    'Sənəd hər ildönümündə yenidən oxunur.'
  ]
},
{
  id: 'tebrik-arayisi', cat: 'x-greetings', tone: 'xatire', layout: 'arayis', palette: 'ink',
  title: 'Təbriklərin Vaxtında Çatdırıldığı haqqında Rəsmi Arayış', tag: 'Arayış',
  signOrg: 'Təbrik və Arzuların Qeydiyyatı üzrə Palata',
  toLabel: 'TƏBRİK OLUNAN', fromLabel: 'TƏBRİK EDƏN', powersLabel: 'ARZULAR', penaltyLabel: 'QEYD',
  preamble: 'Verilir {to} adlı şəxsə ondan ötrü ki, əlamətdar günü {from} tərəfindən vaxtında qeyd edilmiş və təbriklər çatdırılmışdır. Arayış heç bir rəsmi qüvvəyə malik deyil, xatirə kimi verilir.',
  powers: 'Təbrik günün ilk saatlarında çatdırıldı.\nArzular ayrıca yazıya alındı.\nHədiyyə ayrıca təqdim ediləcək.\nQeyd birgə ediləcək.',
  penalty: 'Arayış müddətsizdir. O, təbrikin unudulmadığını illər sonra da təsdiq etmək üçün saxlanılır.',
  titleOptions: [
    'Təbriklərin Vaxtında Çatdırıldığı haqqında Rəsmi Arayış',
    'Arzuların Qeydə Alınmasına dair Xatirə Arayışı',
    'Təbrik Faktının Təsdiqinə dair Rəsmi Arayış',
    'Əlamətdar Günün Qeyd Edilməsi haqqında Arayış'
  ],
  powersOptions: [
    'Təbrik günün ilk saatlarında çatdırıldı.',
    'Arzular ayrıca yazıya alındı.',
    'Hədiyyə ayrıca təqdim ediləcək.',
    'Qeyd birgə ediləcək.',
    'Tarix əvvəlcədən yadda saxlanıldı.',
    'Xatırlatma tələb olunmadı.',
    'Yaxınlar da xəbərdar edildi.',
    'Şəkillər arxivə əlavə olundu.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Arayış müddətsizdir. O, təbrikin unudulmadığını illər sonra da təsdiq etmək üçün saxlanılır.',
    'Arayış xatirə arxivində saxlanılır.',
    'Sənəd hər il yenidən tərtib edilir.'
  ]
},
{
  id: 'tebrik-qerari', cat: 'x-greetings', tone: 'xatire', layout: 'qerar', palette: 'burgundy',
  title: 'Əlamətdar Günün Rəsmi Qaydada Qeyd Edilməsi haqqında Qərar', tag: 'Qərar',
  signOrg: 'Yubiley və Əlamətdar Günlərin Qeydiyyatı Şurası',
  toLabel: 'TƏBRİK OLUNAN', fromLabel: 'TƏBRİK EDƏN', powersLabel: 'ARZULAR', penaltyLabel: 'QEYD',
  preamble: 'Şura {to} adlı şəxsin əlamətdar gününün rəsmi qaydada qeyd edilməsi barədə qərar qəbul etmişdir. Qərar {from} tərəfindən verilmiş təqdimat əsasında və yekdilliklə qəbul olunmuşdur.',
  powers: 'Qeyd mərasimi təşkil edilir.\nBütün yaxınlar dəvət olunur.\nTarix dəyişdirilmir.\nQərar hər il təkrarlanır.',
  penalty: 'Qərar müddətsizdir və hər il avtomatik olaraq yenidən qüvvəyə minir. Onun icrası ailənin bütün üzvlərinə həvalə edilir.',
  titleOptions: [
    'Əlamətdar Günün Rəsmi Qaydada Qeyd Edilməsi haqqında Qərar',
    'Təbrik Mərasiminin Təşkili haqqında Xatirə Qərarı',
    'Bayramın Ailə Daxilində Qeyd Edilməsi haqqında Qərar',
    'Əlamətdar Tarixin Təsbiti haqqında Rəsmi Qərar'
  ],
  powersOptions: [
    'Qeyd mərasimi təşkil edilir.',
    'Bütün yaxınlar dəvət olunur.',
    'Tarix dəyişdirilmir.',
    'Qərar hər il təkrarlanır.',
    'Menyu əvvəlcədən razılaşdırılır.',
    'Hədiyyələr ayrıca planlaşdırılır.',
    'Şəkil çəkilişi nəzərdə tutulur.',
    'Uzaqdakılar əlaqə ilə qoşulur.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Qərar müddətsizdir və hər il avtomatik olaraq yenidən qüvvəyə minir. Onun icrası ailənin bütün üzvlərinə həvalə edilir.',
    'Qərar ailə arxivində saxlanılır.',
    'Mərasimin forması hər il dəyişə bilər.'
  ]
},
{
  id: 'arzular-sazisi', cat: 'x-greetings', tone: 'xatire', layout: 'muqavile', palette: 'forest',
  title: 'Qarşılıqlı Arzuların və Diləklərin Bəyanı üzrə Xatirə Sazişi', tag: 'Saziş',
  signOrg: 'Təbrik və Arzuların Qeydiyyatı üzrə Palata',
  toLabel: 'TƏBRİK OLUNAN', fromLabel: 'TƏBRİK EDƏN', powersLabel: 'ARZULAR', penaltyLabel: 'QEYD',
  preamble: 'Bu sazişlə {from} və {to} bir-birinə bildirdikləri arzuları və dilekləri yazıya alırlar. Saziş heç bir öhdəlik yaratmır, sadəcə həmin arzuların illər sonra da xatırlanmasını təmin edir.',
  powers: 'Arzular səmimi və qarşılıqlıdır.\nHeç bir şərt qoyulmayıb.\nSiyahı hər il yenilənir.\nGerçəkləşənlər ayrıca qeyd olunur.',
  penalty: 'Saziş müddətsizdir. Onun yeganə məqsədi arzuların unudulmamasını təmin etməkdir.',
  titleOptions: [
    'Qarşılıqlı Arzuların və Diləklərin Bəyanı üzrə Xatirə Sazişi',
    'Bir-Birinə Bildirilən Arzuların Yazıya Alınması Sazişi',
    'Gələcəyə dair Ortaq Diləklərin Təsbiti üzrə Saziş',
    'Səmimi Arzuların Qarşılıqlı Bəyanına dair Sənəd'
  ],
  powersOptions: [
    'Arzular səmimi və qarşılıqlıdır.',
    'Heç bir şərt qoyulmayıb.',
    'Siyahı hər il yenilənir.',
    'Gerçəkləşənlər ayrıca qeyd olunur.',
    'Arzular sadə sözlərlə yazılıb.',
    'Tarix sənədin üzərində göstərilib.',
    'Hər iki tərəf nüsxə saxlayır.',
    'Siyahıya yeni arzular əlavə edilir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Saziş müddətsizdir. Onun yeganə məqsədi arzuların unudulmamasını təmin etməkdir.',
    'Saziş hər iki tərəfdə saxlanılır.',
    'Siyahı hər il yenidən oxunur.'
  ]
},
{
  id: 'tebrik-teleqrami', cat: 'x-greetings', tone: 'xatire', layout: 'teleqram', palette: 'gold',
  title: 'Təbriklərin Təxirəsalınmaz Çatdırılması haqqında Xatirə Teleqramı', tag: 'Qısa mesaj',
  signOrg: 'Bayram Təbriklərinin Çatdırılması üzrə Şöbə',
  toLabel: 'TƏBRİK OLUNAN', fromLabel: 'TƏBRİK EDƏN', powersLabel: 'ARZULAR', penaltyLabel: 'QEYD',
  preamble: 'Sizə bildiririk ki, {from} tərəfindən {to} adlı şəxsə əlamətdar gün münasibətilə təbrik göndərilir. Mesaj qısadır, çünki əsas arzular artıq hər iki tərəfə yaxşı məlumdur və izahat tələb etmir.',
  powers: 'Təbrik vaxtında çatdırılır.\nArzular səmimidir.\nQarşılıq gözlənilmir.\nGörüşdə şəxsən təkrarlanacaq.',
  penalty: 'Teleqram heç bir öhdəlik yaratmır. Onun yeganə məqsədi təbrikin vaxtında çatdırılmasıdır.',
  titleOptions: [
    'Təbriklərin Təxirəsalınmaz Çatdırılması haqqında Xatirə Teleqramı',
    'Qısa Sözlərlə Bildirilmiş Təbrik Teleqramı',
    'Uzaqdan Göndərilmiş Səmimi Təbrik Teleqramı',
    'Əlamətdar Gün Münasibətilə Göndərilmiş Teleqram'
  ],
  powersOptions: [
    'Təbrik vaxtında çatdırılır.',
    'Arzular səmimidir.',
    'Qarşılıq gözlənilmir.',
    'Görüşdə şəxsən təkrarlanacaq.',
    'Mesaj gecikmədən göndərilib.',
    'Hədiyyə ayrıca çatdırılacaq.',
    'Zəng axşam nəzərdə tutulur.',
    'Şəkillər sonra göndəriləcək.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Teleqram heç bir öhdəlik yaratmır. Onun yeganə məqsədi təbrikin vaxtında çatdırılmasıdır.',
    'Teleqram xatirə arxivində saxlanılır.',
    'Mesaj olduğu kimi qorunur.'
  ]
},
{
  id: 'yubilyar-vesiqesi', cat: 'x-greetings', tone: 'xatire', layout: 'vesiqe', palette: 'steel',
  title: 'Yubilyar Statusunun və Ona Bağlı Güzəştlərin Təsdiqi Vəsiqəsi', tag: 'Vəsiqə',
  signOrg: 'Yubiley və Əlamətdar Günlərin Qeydiyyatı Şurası',
  toLabel: 'TƏBRİK OLUNAN', fromLabel: 'TƏBRİK EDƏN', powersLabel: 'ARZULAR', penaltyLabel: 'QEYD',
  preamble: 'Bu vəsiqə {to} adlı şəxsin yubilyar statusunu təsdiq edir. Sənəd {from} tərəfindən verilmiş və həmin gün ərzində qüvvədə olan bütün xüsusi güzəştləri, hüquq və imtiyazları əhatə edir.',
  powers: 'Günün proqramı özü tərəfindən müəyyən edilir.\nMenyu seçimi mübahisə predmeti deyil.\nSüfrədə baş yer ayrılır.\nİlk tost ona həsr olunur.',
  penalty: 'Vəsiqə bir gün ərzində qüvvədədir, lakin yubilyar statusu ömürlük tanınır və geri alınmır.',
  titleOptions: [
    'Yubilyar Statusunun və Ona Bağlı Güzəştlərin Təsdiqi Vəsiqəsi',
    'Yubiley Günü Verilən Xüsusi Hüquqlara dair Vəsiqə',
    'Yubilyarın Statusunun Rəsmi Tanınmasına dair Vəsiqə',
    'Əlamətdar Yaş Dönümünün Təsdiqinə dair Xatirə Vəsiqəsi'
  ],
  powersOptions: [
    'Günün proqramı özü tərəfindən müəyyən edilir.',
    'Menyu seçimi mübahisə predmeti deyil.',
    'Süfrədə baş yer ayrılır.',
    'İlk tost ona həsr olunur.',
    'Hədiyyə açılış ardıcıllığı özü seçir.',
    'Şəkil çəkilişindən imtina hüququ var.',
    'Musiqi seçimi hüququ tanınır.',
    'Ayrılma vaxtı sərbəst müəyyən edilir.'
  ],
  powersMin: 2, powersMax: 4,
  penaltyOptions: [
    'Vəsiqə bir gün ərzində qüvvədədir, lakin yubilyar statusu ömürlük tanınır və geri alınmır.',
    'Vəsiqə ailə arxivində saxlanılır.',
    'Status hər yubileydə yenidən elan olunur.'
  ]
}

);
