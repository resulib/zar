<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Ümumi
    |--------------------------------------------------------------------------
    */
    'public_url' => rtrim(env('APP_URL', 'http://localhost:8000'), '/'),

    // Qeydiyyat nömrəsi prefiksi — dövlət reyestri formatını təqlid etməməlidir.
    'reg_prefix' => env('ZARAFAT_REG_PREFIX', 'ZRF'),

    // Qonaq cookie-si
    'guest_cookie'  => 'zrf_uid',
    'guest_lifetime' => 60 * 24 * 365,   // dəqiqə (1 il)

    /*
    |--------------------------------------------------------------------------
    | Kredit paketləri
    |--------------------------------------------------------------------------
    | Frontend-dəki PACKS massivi ilə eyni saxlanmalıdır (GET /api/packs).
    */
    'packs' => [
        'p1'  => ['id' => 'p1',  'credits' => 1,  'amount' => 1.00, 'label' => '1 sənəd',  'note' => 'Tək sənəd üçün'],
        'p3'  => ['id' => 'p3',  'credits' => 3,  'amount' => 2.00, 'label' => '3 sənəd',  'note' => 'Ən çox seçilən', 'best' => true],
        'p10' => ['id' => 'p10', 'credits' => 10, 'amount' => 5.00, 'label' => '10 sənəd', 'note' => 'Dost qrupu üçün'],
    ],

    /*
    |--------------------------------------------------------------------------
    | Ödəniş
    |--------------------------------------------------------------------------
    */
    'payment' => [
        'provider'         => env('PAYMENT_PROVIDER', 'simulation'),   // simulation | epoint

        // Test ödənişi pulsuz kredit deməkdir — default BAĞLIDIR və istehsalatda
        // bayraqdan asılı olmayaraq açıla bilmir (bax: PaymentService::simulationAllowed).
        'allow_simulation' => env('ALLOW_SIMULATED_PAYMENTS', false),
        'currency'         => 'AZN',

        'epoint' => [
            'public_key'  => env('EPOINT_PUBLIC_KEY'),
            'private_key' => env('EPOINT_PRIVATE_KEY'),
            'endpoint'    => env('EPOINT_ENDPOINT', 'https://epoint.az/api/1/request'),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Sənəd və moderasiya limitləri
    |--------------------------------------------------------------------------
    */
    'limits' => [
        'title'    => 110,
        'name'     => 42,
        'powers'   => 600,
        'penalty'  => 300,
        'preamble' => 700,
        'power_lines' => 8,
    ],

    'layouts'  => [
        'notarial', 'blank', 'diplom', 'sertifikat', 'lisenziya',
        'arayis', 'qerar', 'muqavile', 'teleqram', 'vesiqe',
        'viza', 'ekspertiza',
    ],
    'palettes' => ['gold', 'steel', 'burgundy', 'forest', 'ink', 'rose'],

    /*
    |--------------------------------------------------------------------------
    | Dizayn və palitranın insan üzü
    |--------------------------------------------------------------------------
    | YALNIZ admin panelin görünüşü üçündür — icazə siyahısı yuxarıdakı
    | 'layouts' / 'palettes' massivləridir və `Sanitizer::pick` onlara baxır.
    |
    |   name  — `doc.js` LAYOUT_NAMES / app.js PAL_LABEL güzgüsü
    |   type  — dizaynın sənədə YAZDIĞI növ sözü (şablon deyil, dizayn seçir)
    |   tail  — başlığın bitməli olduğu sözlər (tools/copy-rules.js DOC_TYPE)
    |   note  — dizaynın tələsi: admin şablonu yazmazdan əvvəl bilməlidir
    |   colors — sırası ilə kağız · başlıq · aksent (doc.js PALETTES)
    */
    'layout_meta' => [
        'notarial'   => ['name' => 'Notarial akt', 'type' => 'ETİBARNAMƏ',
                         'tail' => 'etibarnaməsi · aktı · vəkalətnaməsi', 'note' => 'Sənəddə 4 bənd görünür.'],
        'blank'      => ['name' => 'Rəsmi blank', 'type' => 'ƏRİZƏ',
                         'tail' => 'ərizəsi · bildirişi · bəyannaməsi', 'note' => ''],
        'diplom'     => ['name' => 'Diplom', 'type' => 'DİPLOM',
                         'tail' => 'diplomu · fərmanı · nişanı', 'note' => ''],
        'sertifikat' => ['name' => 'Sertifikat', 'type' => 'SERTİFİKAT',
                         'tail' => 'sertifikatı · şəhadətnaməsi · sənədi', 'note' => ''],
        'lisenziya'  => ['name' => 'Lisenziya kartı', 'type' => 'LİSENZİYA',
                         'tail' => 'lisenziyası · icazəsi · vəsiqəsi',
                         'note' => 'Preamble cəmi 3 sətir göstərir, 4 bənd çıxır.'],
        'arayis'     => ['name' => 'Arayış', 'type' => 'ARAYIŞ',
                         'tail' => 'arayışı · məlumatı', 'note' => 'Sənəddə 4 bənd görünür.'],
        'qerar'      => ['name' => 'Məhkəmə qərarı', 'type' => 'QƏRAR',
                         'tail' => 'qərarı · qətnaməsi · hökmü',
                         'note' => 'İmzalayan orqana «· UYDURMA ORQAN» əlavə olunur.'],
        'muqavile'   => ['name' => 'Müqavilə', 'type' => 'MÜQAVİLƏ',
                         'tail' => 'müqaviləsi · sazişi · öhdəliyi', 'note' => 'Sənəddə 4 bənd görünür.'],
        'teleqram'   => ['name' => 'Teleqram', 'type' => 'TELEQRAM',
                         'tail' => 'teleqramı · xəbərdarlığı · bildirişi', 'note' => 'Sənəddə 4 bənd görünür.'],
        'vesiqe'     => ['name' => 'Vəsiqə', 'type' => 'VƏSİQƏ',
                         'tail' => 'vəsiqəsi · kartı · şəhadətnaməsi',
                         'note' => 'DİQQƏT: bəndləri ÇƏKMİR — fikri preamble və cəza bəndinə yazın.'],
        'viza'       => ['name' => 'Viza', 'type' => 'VİZA',
                         'tail' => 'vizası · icazəsi',
                         'note' => 'DİQQƏT: preamble-ı çəkmir; bəndlər «QEYDLƏR» siyahısı kimi çıxır.'],
        'ekspertiza' => ['name' => 'Ekspertiza rəyi', 'type' => 'RƏY',
                         'tail' => 'rəyi · nəticəsi · aktı · protokolu',
                         'note' => 'Cədvəl, siyahı və şkala bloklarını göstərən iki dizayndan biri.'],
    ],

    'palette_meta' => [
        'gold'     => ['name' => 'Qızılı',  'colors' => ['#fbf7ec', '#132644', '#b0882a']],
        'steel'    => ['name' => 'Polad',   'colors' => ['#ffffff', '#0f2740', '#2f5d8a']],
        'burgundy' => ['name' => 'Bordo',   'colors' => ['#fdf6ef', '#5a1220', '#8d1d33']],
        'forest'   => ['name' => 'Zümrüd',  'colors' => ['#fbfdfa', '#123a2a', '#1f7a52']],
        'ink'      => ['name' => 'Qrafit',  'colors' => ['#f7f8fb', '#101828', '#3b4b6b']],
        'rose'     => ['name' => 'Çəhrayı', 'colors' => ['#fdf7f4', '#6b2233', '#a8586b']],
    ],

    // Sənədin tonu: zarafat — gülməli, xatire — səmimi xatirə sənədi.
    'tones'    => ['zarafat', 'xatire'],

    // Vergüllə ayrılmış ilkin qadağan siyahısı; admin paneldən genişləndirilir.
    'banned_words' => env('BANNED_WORDS', ''),
];
