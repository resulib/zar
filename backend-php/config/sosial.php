<?php

/*
 * Sosial kimlik kartı — TikTok · Instagram.
 *
 * Ağ siyahılar frontend/sosial.js `SOSIAL_KINDS` ilə eynidir;
 * tools/check-sosial.js ikisini tutuşdurur — biri dəyişib digəri qalsa
 * yoxlama sınır (dəvətnamə bölməsindəki eyni intizam).
 *
 * DİQQƏT — avtomatik doldurma «ən yaxşı cəhd»dir, zəmanət deyil:
 *   TikTok  — açarsız oEmbed yalnız GÖRÜNƏN ADI verir. İzləyici sayı və
 *             avatar yoxdur; profil səhifəsinin özü WAF ilə bağlıdır.
 *   Instagram — `web_profile_info` qeyri-rəsmi endpointdir: hostinq
 *             IP-lərindən tez-tez bağlanır və istənilən gün sına bilər.
 * Ona görə uğursuzluq XƏTA DEYİL: sahələr sadəcə boş qalır və istifadəçi
 * özü doldurur. `SOSIAL_FETCH=false` isə çəkməni tamamilə söndürür və
 * interfeys eyni işləməyə davam edir.
 */

return [
    /*
    |--------------------------------------------------------------------------
    | Avtomatik doldurma
    |--------------------------------------------------------------------------
    */
    'enabled' => (bool) env('SOSIAL_FETCH', true),

    // Kənar sorğunun gözləmə həddi. Qısadır: istifadəçi formanın açılmasını
    // gözləyir, məlumat isə onsuz da redaktə edilə bilən sahələrə düşür.
    'timeout' => (int) env('SOSIAL_TIMEOUT', 6),

    // Eyni profil bir saat ərzində təkrar sorğulanmır (Cache::add idiomu —
    // RegistryController-dəki baxış sayğacı ilə eyni).
    'cache_minutes' => (int) env('SOSIAL_CACHE_MINUTES', 60),

    /*
    |--------------------------------------------------------------------------
    | Ağ siyahılar — Sanitizer::pick bunlara bağlanır
    |--------------------------------------------------------------------------
    | frontend/sosial.js SOSIAL_KINDS ilə bire-bir eyni olmalıdır.
    */
    'platforms' => ['tiktok', 'instagram'],

    'names' => [
        'tiktok'    => 'TikTok',
        'instagram' => 'Instagram',
    ],

    'hosts' => [
        'tiktok'    => ['tiktok.com', 'www.tiktok.com', 'vm.tiktok.com', 'm.tiktok.com'],
        'instagram' => ['instagram.com', 'www.instagram.com', 'instagr.am'],
    ],

    /*
    |--------------------------------------------------------------------------
    | Kənar ünvanlar
    |--------------------------------------------------------------------------
    | Ayrıca konfiqdir ki, test saxta serverə yönəldə bilsin (OPENAI_ENDPOINT
    | ilə eyni üsul — bax: tests/logic.php).
    */
    'endpoints' => [
        'tiktok_oembed'    => env('SOSIAL_TIKTOK_OEMBED', 'https://www.tiktok.com/oembed'),
        'instagram_web'    => env('SOSIAL_INSTAGRAM_WEB', 'https://i.instagram.com/api/v1/users/web_profile_info/'),
        'instagram_app_id' => env('SOSIAL_INSTAGRAM_APP_ID', '936619743392459'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Mətn hədləri
    |--------------------------------------------------------------------------
    | Kartda göstərilən sahələr. `bio` sənədə düşmür, yalnız formada görünür —
    | buna baxmayaraq moderasiyadan keçir.
    */
    'limits' => [
        'username'  => 30,
        'name'      => 40,
        'bio'       => 160,
        'url'       => 200,
        'followers' => 999999999,
    ],

    /*
    |--------------------------------------------------------------------------
    | Avatar
    |--------------------------------------------------------------------------
    | Serverdə şəkil boru xətti yoxdur: brauzer kəsilmiş JPEG hazırlayır və
    | dərc anında yükləyir — dəvətnamənin OG şəkli ilə eyni model. Fayl public
    | kökdən KƏNARDA saxlanılır, kontroller sabit `image/jpeg` başlığı ilə axıdır.
    */
    'avatar' => [
        'path'      => storage_path('app/sosial/avatar'),
        'size'      => 256,
        'max_bytes' => 120 * 1024,

        // Serverin şəkil endirməyə icazə verdiyi hostlar — SONLUQ üzrə.
        // Instagram avatarları dəyişkən alt domenlərdən gəlir
        // (instagram.fgyd12-1.fna.fbcdn.net), ona görə tam siyahı mümkün deyil.
        // Bu ağ siyahı olmasa endpoint açıq SSRF vasitəsi olardı.
        'hosts' => ['.fbcdn.net', '.cdninstagram.com'],

        // Endirilən xam faylın həddi — sıxılmadan ƏVVƏL.
        'fetch_max_bytes' => 3 * 1024 * 1024,
    ],
];
