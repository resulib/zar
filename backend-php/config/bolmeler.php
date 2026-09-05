<?php

use App\Support\Bolmeler;

/**
 * Bölmələrin açıq/bağlı olması.
 *
 * Buradakı dəyərlər YALNIZ İLKİN DƏYƏRDİR — canlı parametr `settings`
 * cədvəlindədir və `/admin/parametrler`-dən dəyişilir (`ai_model` naxışı).
 * `.env` ilə də verilə bilər ki, yeni qurulmuş sayt ilk andan düzgün
 * vəziyyətdə qalxsın.
 *
 * BAĞLI BÖLMƏ 404 QAYTARIR, 403 YOX: «icazə yoxdur» cavabının özü ünvanın
 * mövcudluğunu bildirir — bu deponun `imagePath()` və dəvətnamə lövhəsi
 * üçün artıq yazdığı qayda.
 */
return [

    'ilkin' => [
        'is'      => env('BOLME_IS', true),
        'zarafat' => env('BOLME_ZARAFAT', true),
        'devet'   => env('BOLME_DEVET', true),
    ],

    /* Ana səhifə hansı bölmənin girişidir. Bağlıdırsa açıq olan seçilir
       (`Bolmeler::anaSehife()`). */
    'ana' => env('BOLME_ANA', 'zarafat'),

    /* İdarə panelində göstərilən izahlar. Ünvan siyahısı sırf məlumat
       üçündür — həqiqi qapı marşrutlardakı `bolme:` ara qatıdır. */
    'meta' => [
        'is' => [
            'ad'    => 'İş qovluğu',
            'izah'  => 'Onlayn detektiv bölməsi: kataloq, oyun, müstəntiq profili və reytinq.',
            'ana'   => '/is',
            'yollar' => ['/is', '/is/{iş}', '/is/mustentiq', '/is/reyting', '/is/balans', '/api/is/…'],
        ],
        'zarafat' => [
            'ad'    => 'Zarafat sənədləri',
            'izah'  => 'Sənəd generatoru, reyestr və istifadəçi kabineti.',
            'ana'   => '/',
            'yollar' => ['/', '/r/{nömrə}', '/kabinet', '/api/catalog', '/api/documents…'],
        ],
        'devet' => [
            'ad'    => 'Dəvətnamələr',
            'izah'  => 'Dəvətnamə qurucusu, qonaq lövhəsi və paylaşılan dəvət linkləri.',
            'ana'   => '/devetname',
            'yollar' => ['/devetname', '/devetnamelerim', '/d/{token}', '/api/devet/…'],
        ],
    ],

    'acarlar' => Bolmeler::ACARLAR,
];
