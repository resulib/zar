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
        'title'    => 70,
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

    // Sənədin tonu: zarafat — gülməli, xatire — səmimi xatirə sənədi.
    'tones'    => ['zarafat', 'xatire'],

    // Vergüllə ayrılmış ilkin qadağan siyahısı; admin paneldən genişləndirilir.
    'banned_words' => env('BANNED_WORDS', ''),
];
