<?php

/**
 * Xarici kimlik provayderləri.
 *
 * AÇARLAR YALNIZ `.env`-DƏDİR, bazada heç vaxt saxlanılmır — `OPENAI_API_KEY`
 * ilə eyni qayda: baza ehtiyat nüsxəsi və idarə panelinin ixracı onları
 * özü ilə aparardı. Açar boşdursa düymə ümumiyyətlə render olunmur.
 */
return [

    'google' => [
        'client_id'     => env('GOOGLE_CLIENT_ID', ''),
        'client_secret' => env('GOOGLE_CLIENT_SECRET', ''),

        /* Google «redirect_uri»-ni HƏRFİ müqayisə edir. Boş buraxsanız
           cari sorğunun host-undan qurulur — o zaman Google konsolunda
           həm `localhost`, həm `127.0.0.1` variantı qeydiyyatda olmalıdır.
           İstehsalatda birbaşa yazmaq daha etibarlıdır. */
        'redirect'      => env('GOOGLE_REDIRECT', ''),

        /* YALNIZ TEST ÜÇÜN. Saxta Google serverini göstərir, `OPENAI_ENDPOINT`
           ilə eyni naxış. İstehsalatda BOŞ olmalıdır — dolu olsa tokenlər
           kənar ünvana göndərilər. */
        'token_url'     => env('GOOGLE_TOKEN_URL', ''),
    ],

    /* Girişdən sonra hara qayıtmaq. AÇIQ YÖNLƏNDİRMƏ OLMASIN deyə bu ağ
       siyahıdır: `?davam=` parametri marşrut ADI yox, buradakı açardır. */
    'qayidis' => [
        'kabinet' => 'account.index',
        'is'      => 'dossier.profil',
        'devet'   => 'devet.list',
    ],

    'qayidis_default' => 'kabinet',
];
