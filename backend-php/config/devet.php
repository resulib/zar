<?php

/*
 * Dəvətnamə bölməsi — saytın digər hissəsindən TAMAMİLƏ AYRIDIR.
 * Bu faylda kənar brend sözü yoxdur və olmamalıdır: buradakı mətnlər
 * son istifadəçiyə (toy qonağına) görünür.
 *
 * Ağ siyahılar frontend/devet-designs.js ilə eynidir; tools/check-devet-designs.js
 * ikisini tutuşdurur — biri dəyişib digəri qalsa yoxlama sınır.
 */

return [
    /*
    |--------------------------------------------------------------------------
    | Ünvan
    |--------------------------------------------------------------------------
    | Paylaşılan linkin bazası. Ayrı domenə keçmək bir .env sətridir:
    | DEVET_URL=https://davetim.az — kodda heç nə dəyişmir.
    */
    'public_url' => rtrim((string) env('DEVET_URL', env('APP_URL', 'http://localhost:8000')), '/'),

    // Token uzunluğu — random_bytes(16) → 22 simvol base62. Təxmin edilə bilməz.
    'token_bytes' => 16,

    /*
    |--------------------------------------------------------------------------
    | Qiymət
    |--------------------------------------------------------------------------
    | Tədbirə görə BİR DƏFƏ ödənilir: sonra bütün formatlar, paylaşım linki,
    | RSVP və toplu qonaq dəvətnamələri açılır. Hər qonağa ayrıca kredit getmir.
    */
    'price_credits' => (int) env('DEVET_PRICE_CREDITS', 5),

    /*
    |--------------------------------------------------------------------------
    | Önizləmə şəkli (WhatsApp / og:image)
    |--------------------------------------------------------------------------
    | Serverdə şəkil emalı yoxdur: brauzer dərc anında 1200×630 JPEG hazırlayır
    | və yükləyir. Fayl public kökdən KƏNARDA saxlanılır, kontroller axıdır.
    | Şəkildə ünvan və telefon YOXDUR — bax: invite.js drawOg().
    */
    'og' => [
        'path'      => storage_path('app/devet/og'),
        'width'     => 1200,
        'height'    => 630,
        'max_bytes' => 400 * 1024,
    ],

    /*
    |--------------------------------------------------------------------------
    | Ağ siyahılar — Sanitizer::pick bunlara bağlanır
    |--------------------------------------------------------------------------
    */
    'events' => [
        'toy', 'nisan', 'xina', 'sunnet',
        'usaq-ad-gunu', 'ad-gunu', 'bebi-sauer', 'mezuniyyet',
        'acilis', 'korporativ', 'yeni-il',
    ],

    'designs' => [
        'toy-qizil', 'toy-sade', 'toy-koku', 'nisan-sedef',
        'nisan-sade', 'nisan-lavanda', 'xina-koku', 'xina-mercan',
        'xina-cicek', 'sunnet-qizil', 'sunnet-okean', 'sunnet-ulduz',
        'usaq-kosmos', 'usaq-dino', 'usaq-deniz', 'adgunu-qizil',
        'adgunu-sade', 'adgunu-mercan', 'bebi-nane', 'bebi-sedef',
        'bebi-heyvan', 'mezun-lacivert', 'mezun-sade', 'mezun-gunes',
        'acilis-korp', 'acilis-qizil', 'acilis-mercan', 'korp-komur',
        'korp-lacivert', 'korp-sade', 'yeniil-gece', 'yeniil-qar',
        'yeniil-sade',
    ],

    'palettes' => [
        'qizil', 'sedef', 'zeytun', 'lacivert', 'mercan', 'lavanda',
        'koku', 'okean', 'gunes', 'nane', 'komur', 'gece',
    ],

    'styles' => ['klassik', 'zerif', 'modern', 'rengli', 'motiv', 'korporativ'],

    'motifs' => ['kosmos', 'dinozavr', 'deniz', 'heyvanlar', 'nagil', 'avtomobil', 'cicek'],

    'ratios' => ['kart', 'kvadrat', 'hekaye'],

    // Qonaq cavabı — başqa dəyər qəbul edilmir.
    'rsvp' => ['gelirem', 'gelmirem', 'bilmirem'],

    /*
    | Xəritə linki ağ siyahısı. Yalnız bu hostlara icazə verilir, yoxsa
    | dəvətnamə açıq yönləndirmə vasitəsinə çevrilər.
    */
    'map_hosts' => [
        'google.com', 'www.google.com', 'maps.google.com', 'goo.gl', 'maps.app.goo.gl',
        'yandex.com', 'yandex.ru', 'yandex.az', 'waze.com', 'www.waze.com', '2gis.az',
    ],

    /*
    |--------------------------------------------------------------------------
    | Mətn limitləri — server səssizcə kəsir
    |--------------------------------------------------------------------------
    */
    'limits' => [
        'hosts'   => 120,
        'title'   => 140,
        'venue'   => 120,
        'address' => 200,
        'phone'   => 40,
        'note'    => 300,
        'guest'   => 80,
        'map_url' => 300,
        'guests'  => 400,   // bir tədbirdə maksimum qonaq sayı
        'party'   => 20,    // bir cavabda maksimum nəfər sayı
    ],

    /*
    |--------------------------------------------------------------------------
    | Kredit paketləri — neytral adlar
    |--------------------------------------------------------------------------
    | Paket id-ləri ümumi ödəniş konfiqurasiyasındakılarla eynidir (ödəniş
    | infrastrukturu ortaqdır), yalnız görünən adlar dəyişir — qonaq
    | kənar məhsulun lüğətini görməməlidir.
    */
    'pack_labels' => [
        'p1'  => ['label' => '1 kredit',   'note' => 'Tək tədbir üçün'],
        'p3'  => ['label' => '3 kredit',   'note' => 'Ən çox seçilən'],
        'p10' => ['label' => '10 kredit',  'note' => 'Bir neçə tədbir üçün'],
    ],
];
