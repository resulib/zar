<?php

/*
 * İş qovluğu bölməsi — saytın digər hissəsindən TAMAMİLƏ AYRIDIR.
 *
 * Bu faylda kənar brend sözü yoxdur və olmamalıdır: tools/check-dossier.js
 * bu faylı da, bölmənin bütün frontend fayllarını da şərhlərlə birlikdə
 * tarayır — bir sözlük sızması bütün bölmənin hissini pozur.
 *
 * Ağ siyahılar Sanitizer::pick üçündür: sənəd növü, çətinlik və cavab
 * indeksləri yalnız buradakı dəyərlərdən ola bilər.
 */

return [
    /*
    |--------------------------------------------------------------------------
    | Ünvan
    |--------------------------------------------------------------------------
    | Paylaşılan link və OG şəkilləri bu ünvanla qurulur. Ayrı domen alınsa
    | DOSSIER_URL=https://... — kodda heç nə dəyişmir.
    */
    'public_url' => rtrim((string) env('DOSSIER_URL', env('APP_URL', 'http://localhost:8000')), '/'),

    /*
    |--------------------------------------------------------------------------
    | Bölmənin adı
    |--------------------------------------------------------------------------
    | MÜVƏQQƏTİDİR — ad və loqo hələ seçilməyib. Bilərəkdən YALNIZ burada
    | saxlanılır: Blade-lərdə sabit yazılmır və tools/check-dossier.js bunu
    | yoxlayır, ona görə ad seçiləndə dəyişəcək yeganə yer bu sətirdir.
    */
    'brand' => 'İş Qovluğu',

    // Footer-dəki əlaqə. Boş olanda sətir ümumiyyətlə render olunmur.
    'contact' => (string) env('DOSSIER_CONTACT', ''),

    /*
    |--------------------------------------------------------------------------
    | Ödəniş
    |--------------------------------------------------------------------------
    | Giriş qovluğu `dossiers.price_credits = 0` ilə seed edilir — birinci
    | qovluq hamı üçün pulsuzdur. Qalanları bu dəyəri alır.
    */
    'price_credits' => (int) env('DOSSIER_PRICE_CREDITS', 5),

    /*
    |--------------------------------------------------------------------------
    | Oyun qaydaları
    |--------------------------------------------------------------------------
    */
    // Yekun rəy üçün cəhd sayı. Bitəndə izah açılır, sertifikat verilmir.
    'attempts' => (int) env('DOSSIER_ATTEMPTS', 3),

    // Kilidin kod uzunluğu. Dörd rəqəm brute-force olunandır — qorunma
    // uzunluqda deyil, throttle:dossier-kilid limitindədir.
    'code_length' => 4,

    'token_bytes' => 16,

    /*
    |--------------------------------------------------------------------------
    | Fiktiv qurum — hüquqi qalxan
    |--------------------------------------------------------------------------
    | Qurumun adı və məcburi qeydin MƏTNİ burada deyil, `App\Support\Dossier\Byuro`
    | sinif sabitlərindədir: config `.env`-dən oxuna və gələcək idarə panelindən
    | boşaldıla bilər, hüquqi qeyd isə kodu redaktə etməyən adamın əlində
    | olmamalıdır. Burada yalnız ona istinad var.
    */
    'bureau' => [
        'name'   => \App\Support\Dossier\Byuro::AD,
        'short'  => \App\Support\Dossier\Byuro::QISA,
        'notice' => \App\Support\Dossier\Byuro::QEYD,
    ],

    /*
    | Qadağan ifadələr — DAR qara siyahı.
    |
    | Yalnız ÇOXSÖZLÜ, birmənalı ifadələr. Tək «polis» qadağan olunsaydı, adi
    | cümlə («polis çağırıldı») yazmaq mümkün olmazdı və yoxlama ilk gündən
    | yan keçilərdi. Saytın digər bölməsindəki oxşar siyahı da bu prinsiplədir.
    |
    | Siyahı FOLDED formadadır (ASCII, kiçik hərf): `tools/check-dossier.js`
    | `fold()` transliterasiyası ilə müqayisə edir. Səbəb — `POLİS BÖLMƏSİ`
    | hərfi müqayisədə `Polis` fraqmentinə uyğun gəlmir: JS-in `i` bayrağı
    | «İ» hərfini tutmur və `'İ'.toLowerCase()` iki kod nöqtəsidir.
    */
    'org_ban' => [
        'azerbaycan respublikasi',
        'daxili isler',
        'nazirliy',
        'nazirlerin kabineti',
        'prokurorluq',
        'polis bolmesi',
        'polis idaresi',
        'polis sobesi',
        'dovlet gerbi',
        'edliyye leytenanti',
        'edliyye mayoru',
        'mehkeme-tibb ekspertizasi',
    ],

    /*
    |--------------------------------------------------------------------------
    | Blok növləri — hər biri üçün bir Blade komponenti
    |--------------------------------------------------------------------------
    | Bir sənəd HAZIR ŞABLON DEYİL, blokların ardıcıllığıdır. Render qatı
    | hekayəni tanımır: o yalnız blokları tanıyır, hekayəni baza verir.
    | Yeni sənəd növü = blokların başqa sırası, kod deyil.
    |
    | resources/views/dossier/bloklar/<tip>.blade.php mövcud olmalıdır;
    | tools/check-dossier.js siyahı ilə faylları tutuşdurur.
    */
    'bloklar' => [
        'blank',     // blank başlığı — qurum sətirləri, iş nömrəsi, ayırıcı xətt
        'basliq',    // mərkəzdə sənədin adı, altında kiçik izah
        'sahe',      // sol ad, sağ dəyər, arada nöqtəli xətt (boş dəyər icazəlidir)
        'metn',      // abzaslar; `cerceve` ilə qeyd qutusu olur
        'cedvel',    // sütun sayı sərbəst, vurğulanmış sətirlər, yekun sətri
        'kart',      // nömrələnmiş kartoçkalar — maddi sübutlar, qutunun içindəkilər
        'yazisma',   // söhbət — kağıza çap edilmiş ekran görüntüsü
        'zeng',      // zəng tarixçəsi
        'sxem',      // SVG + ayrıca nişan qatı
        'elyazma',   // qısa əlyazma qeydi, xarakteri parametrdir
        'foto',      // şəkil kartoçkası, altında rəsmi izah və nömrə
        'elave',     // ataçla bərkidilmiş kiçik sənəd — çek, qəbz, bilet
        'imza',      // solda vəzifə və imza, sağda tarix
    ],

    // Əlyazmanın xarakteri. İki ailə + əyilmə/sıxlıq/ölçü ilə qurulur:
    // Azərbaycan hərflərini daşıyan cəmi iki əlyazma ailəsi var.
    'elyazma_xarakterler' => ['sakit', 'telesik', 'yasli', 'esebi'],

    // Əlyazma bloku QISA mətn üçündür. Uzun izahat bununla verilməz —
    // bu həddi aşan mətn yoxlayıcıda xəbərdarlıq alır.
    'elyazma_hedd' => 180,

    // Kənar qeydi blok deyil, hər blokun qəbul etdiyi nişandır.
    'kenar_novleri' => ['qeyd', 'sual', 'xett', 'daire'],
    'kenar_yerler'  => ['sag', 'sol', 'alt'],

    // Yazışmadakı mesaj növləri.
    'mesaj_novleri' => ['metn', 'silinmis', 'sistem', 'sesli', 'sekil', 'sened'],

    // Sxemin üstünə əlavə olunan nişan qatı — sxemin öz kodunda deyil,
    // ayrıca məlumatdır ki, eyni sxem fərqli mərhələlərdə fərqli nişanlarla
    // göstərilə bilsin.
    'nisan_novleri' => ['noqte', 'olcu', 'ox', 'shimal'],

    /*
    |--------------------------------------------------------------------------
    | Fiziki qat
    |--------------------------------------------------------------------------
    | Hamısı CSS və SVG ilə qurulur — hazır şəkil faylı yoxdur, çünki sənəd
    | hər ölçüdə iti qalmalı və mətni seçilə bilən olmalıdır.
    */
    'kagiz_efektler' => ['kohnelme', 'qat', 'leke', 'cirilma', 'kseroks', 'egilme', 'barmaq', 'atac'],

    // Bir sənəddə ÜÇDƏN ÇOX ağır effekt olmaz: hər vərəq ləkəli və qatlanmış
    // olanda heç biri seçilmir və göz yorulur. Yoxlayıcıda xətadır.
    'agir_efektler' => ['leke', 'cirilma', 'kseroks'],
    'agir_hedd'     => 3,

    'leke_novleri'  => ['qehve', 'yag', 'su'],
    'cirilma_yerler' => ['sol', 'sag', 'alt'],
    'atac_yerler'   => ['sol-ust', 'sag-ust', 'sol-alt'],

    // Möhür ayrıca qatdır: bir sənəddə bir neçəsi ola bilər.
    'mohur_formalar' => ['daire', 'duzbucaq'],
    'mohur_rengler'  => ['mor', 'qirmizi', 'mavi', 'qara'],

    /*
    |--------------------------------------------------------------------------
    | Kilid — sənədin növü deyil, XASSƏSİ
    |--------------------------------------------------------------------------
    | İstənilən sənəd kilidli ola bilər: cədvəl də, yazışma da, sxem də.
    | Növ isə tapmacanın formasını seçir.
    */
    'kilid_novleri' => ['reqem', 'soz', 'tarix'],

    'difficulties' => ['asan', 'orta', 'cetin', 'kabus'],

    'difficulty_labels' => ['asan' => 'asan', 'orta' => 'orta', 'cetin' => 'çətin', 'kabus' => 'kabus'],

    /*
    |--------------------------------------------------------------------------
    | Kataloq lentləri
    |--------------------------------------------------------------------------
    | `dossiers.badge` sütunundan gəlir, koda yazılmır. Sanitizer::pick bu
    | siyahıya bağlanır; siyahıda olmayan dəyər lent göstərmir.
    */
    'badges' => ['yeni', 'en-cox', 'cetin', 'kabus'],

    'badge_labels' => [
        'yeni'   => 'YENİ',
        'en-cox' => 'ƏN ÇOX OXUNAN',
        'cetin'  => 'ÇƏTİN',
        'kabus'  => 'KABUS',
    ],

    /*
    |--------------------------------------------------------------------------
    | Statistika
    |--------------------------------------------------------------------------
    | Say və faiz `dossier_progress`-dən hesablanır, sütunda saxlanılmır.
    | `min_plays` — bu saydan aşağıda statistika ÜMUMİYYƏTLƏ göstərilmir.
    | 0-dır, yəni əvvəldən görünür; kiçik say satışa ziyan verirsə, dəyişəcək
    | yeganə şey bu rəqəmdir.
    */
    'stats' => [
        'min_plays'     => (int) env('DOSSIER_STATS_MIN', 0),
        'cache_minutes' => 10,
    ],

    /*
    |--------------------------------------------------------------------------
    | Mətn hədləri
    |--------------------------------------------------------------------------
    */
    'limits' => [
        'investigator' => 26,   // üz qabığındakı ad sahəsi (prototip: maxlength 26)
        'questions'    => 8,
        'options'      => 8,
    ],

    /*
    |--------------------------------------------------------------------------
    | Şəkillər — serverdə çəkilmir, brauzerdən gəlir
    |--------------------------------------------------------------------------
    | Serverdə SVG→PNG çevirmə yoxdur (imagick quraşdırılmayıb). Sertifikat
    | brauzerdə kətanda çəkilir və xam JPEG kimi yüklənir; fayl public
    | kökdən KƏNARDA saxlanılır, kontroller sabit başlıqla axıdır.
    */
    'cert' => [
        'path'      => storage_path('app/dossier/sertifikat'),
        'width'     => 1200,
        'height'    => 630,
        'max_bytes' => 400 * 1024,
    ],

    // Qovluğun öz linki üçün önizləmə şəkli. `npm run render:dossier-og`
    // ilə build vaxtı hazırlanır və git-ə düşür — deploy-da alət lazım deyil.
    'og' => [
        'dir'    => 'assets/dossier-og',
        'width'  => 1200,
        'height' => 630,
    ],

    /*
    |--------------------------------------------------------------------------
    | Tez-tez verilən suallar
    |--------------------------------------------------------------------------
    | Ana səhifədəki açılıb-bağlanan siyahı. Burada saxlanılır ki, mətn
    | Blade-ə toxunmadan dəyişdirilə bilsin.
    */
    'faq' => [
        [
            's' => 'Neçə nəfər oynaya bilər?',
            'c' => 'Qovluq bir nəfər üçün qurulub, amma masada oturub birlikdə oxumaq '
                . 'ən yaxşı işləyən üsuldur. Cavabı bir dəfə birlikdə verirsiniz.',
        ],
        [
            's' => 'Nə qədər çəkir?',
            'c' => 'Materialları diqqətlə oxumaq 30–45 dəqiqə aparır. Yarımçıq qoyub '
                . 'sonra davam etmək olar — oxuduğunuz və sancdığınız hər şey yerində qalır.',
        ],
        [
            's' => 'Telefonda işləyir?',
            'c' => 'Bəli, əsasən telefon üçün qurulub. Sənədlər barmaqla böyüdülə və '
                . 'seçilə bilir. Planşetdə və kompüterdə də tam işləyir; kompüterdə '
                . 'materialların siyahısı solda daim açıq qalır.',
        ],
        [
            's' => 'Cavabı tapa bilmirəmsə, ipucu var?',
            'c' => 'Ayrıca ipucu düyməsi yoxdur — bütün lazım olanlar sənədlərin '
                . 'içindədir. Yekun rəy üçün üç cəhdiniz var; cəhdlər bitəndə iş '
                . 'necə açıldığı sizə tam izah olunur.',
        ],
        [
            's' => 'Dostumla birlikdə oynaya bilərəm?',
            'c' => 'Bəli. Hər kəs eyni qovluğu öz cihazında ayrıca aça bilər. '
                . 'İşi bağlayanda çıxan sertifikat spoiler saxlamır — onu paylaşsanız, '
                . 'dostunuz qovluğu təmiz açacaq.',
        ],
        [
            's' => 'Bu, real hadisələrə əsaslanır?',
            'c' => 'Xeyr. Hər qovluq bədii əsərdir: personajlar, qurumlar, ünvanlar və '
                . 'hadisələr uydurmadır. Real şəxs və ya təşkilatla oxşarlıq təsadüfdür.',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Kredit paketlərinin adları
    |--------------------------------------------------------------------------
    | Ortaq paketlər burada neytral adla göstərilir: bu tərəfdə oxucu başqa
    | məhsulun lüğətini görməməlidir.
    */
    'pack_labels' => [
        'p1'  => ['label' => '1 kredit', 'note' => 'Sınamaq üçün'],
        'p3'  => ['label' => '3 kredit', 'note' => 'Ən çox seçilən'],
        'p10' => ['label' => '10 kredit', 'note' => 'İki qovluq üçün'],
    ],
];
