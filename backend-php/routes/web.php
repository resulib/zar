<?php

declare(strict_types=1);

use App\Http\Controllers\Admin;
use App\Http\Controllers\Api;
use App\Http\Controllers\Web;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Açıq səhifələr
|--------------------------------------------------------------------------
*/
/* KÖK HEÇ VAXT `bolme:` ARA QATI ALTINDA DEYİL. O, hansı bölmənin açıq
   olduğuna baxıb ora yönləndirir; ara qat altında olsaydı, zarafat
   bağlananda saytın kökü 404 verərdi. */
Route::get('/', [Web\PageController::class, 'home'])->name('home');
/* Reyestr baxıcısı zarafat bölməsinə aiddir: bölmə bağlananda dərc olunmuş
   sənədlərin QR ünvanları da 404 verir. Bu, nəzərdən qaçmış nəticə deyil —
   məhsul gizlədiləndə onun artefaktları da gizlənməlidir. */
Route::get('/r/{regNo}', [Web\PageController::class, 'registry'])
    ->middleware('bolme:zarafat')
    ->where('regNo', '[A-Za-z]{2,4}-\d{4}-\d{4}')
    ->middleware('throttle:registry')
    ->name('registry.show');

/* Sosial kimlik kartının profil şəkli. Public kökdən kənardakı fayl sabit
   `image/jpeg` başlığı ilə axıdılır — dəvətnamənin /d/{token}/on.jpg yolu ilə
   eyni model. */
Route::get('/r/{regNo}/avatar.jpg', [Api\SosialController::class, 'showAvatar'])
    ->middleware('bolme:zarafat')
    ->where('regNo', '[A-Za-z]{2,4}-\d{4}-\d{4}')
    ->middleware('throttle:registry')
    ->name('registry.avatar');

/*
|--------------------------------------------------------------------------
| Dəvətnamələr — ayrı bölmə, ayrı görünüş
|--------------------------------------------------------------------------
| Yollar neytraldır: paylaşılan link qonağa göstərilir.
|
| BÜTÜN BLOK `bolme:devet` ALTINDADIR — bölmə bağlıdırsa bu ünvanlar
| mövcud deyil (404), admin isə yoxlaya bilir.
*/
Route::middleware('bolme:devet')->group(function (): void {
Route::get('/devetname', [Web\DevetController::class, 'builder'])->name('devet.builder');

/* Tədbir sahibinin lövhəsi. Kabinetdən ayrıdır və öz görünüş çərçivəsini
   işlədir — alıcı burada saytın digər məhsulunun adını görməməlidir. */
Route::get('/devetnamelerim', [Web\DevetAccountController::class, 'index'])->name('devet.list');
Route::get('/devetnamelerim/{token}', [Web\DevetAccountController::class, 'board'])
    ->where('token', '[A-Za-z0-9]{22}')->name('devet.board');
Route::get('/devetnamelerim/{token}/cedvel.csv', [Web\DevetAccountController::class, 'csv'])
    ->where('token', '[A-Za-z0-9]{22}')->name('devet.csv');

/* Şəkil marşrutu adlı qonaq marşrutundan ƏVVƏL elan olunur, yoxsa
   `/d/{token}/on.jpg` «q» olmayan seqment kimi tutulmazdı. */
Route::get('/d/{token}/on.jpg', [Web\DevetController::class, 'preview'])
    ->where('token', '[A-Za-z0-9]{22}')
    ->middleware('throttle:devet-read')
    ->name('devet.preview');

Route::get('/d/{token}/q/{guest}', [Web\DevetController::class, 'show'])
    ->where(['token' => '[A-Za-z0-9]{22}', 'guest' => '[A-Za-z0-9]{22}'])
    ->middleware('throttle:devet-read')
    ->name('devet.show.guest');

Route::get('/d/{token}', [Web\DevetController::class, 'show'])
    ->where('token', '[A-Za-z0-9]{22}')
    ->middleware('throttle:devet-read')
    ->name('devet.show');

});

/*
|--------------------------------------------------------------------------
| İş qovluğu — ayrı bölmə, ayrı görünüş
|--------------------------------------------------------------------------
| Saytın digər məhsulu ilə heç bir link paylaşmır. Yollar neytraldır və
| `robots.txt` bunları indeksləməyə bağlayır.
|
| BÜTÜN BLOK `bolme:is` ALTINDADIR.
*/
Route::middleware('bolme:is')->group(function (): void {
Route::get('/is', [Web\DossierController::class, 'index'])->name('dossier.index');

/* Sabit yollar slug marşrutundan ƏVVƏL elan olunur. */
Route::get('/is/qaydalar', [Web\DossierController::class, 'terms'])->name('dossier.terms');

/* Komponent qalereyası — YALNIZ İŞLƏYİCİLƏR ÜÇÜN.
   Marşrut istehsalatda QEYDİYYATDAN KEÇMİR: ünvan orada mövcud deyil və
   404 verir. Parolla qorumaqdansa bu daha etibarlıdır — unudulacaq parol yoxdur. */
if (app()->environment(['local', 'testing']) || env('DOSSIER_GALLERY')) {
    Route::get('/is/qalereya', [Web\DossierController::class, 'gallery'])->name('dossier.gallery');
}

/* MÜSTƏNTİQ PROFİLİ və REYTİNQ.

   Sabit yollardır və `/is/{slug}`-dan ƏVVƏL gəlirlər. Slug şərti
   `[0-9]{4}-[0-9]{4}` olduğu üçün onlar onsuz da udulmazdı, amma faylın
   qaydası budur: geniş yol axırda.

   İNDEKSLƏMƏ İKİ CÜRDÜR: profil və hesab səhifələrində real adamın adı və
   şəkli var — onlar bağlıdır (layout defoltu `noindex`, üstəlik robots.txt).
   Reytinq isə açıqdır: o, `/is` və `/is/{slug}` kimi satış üzüdür. */
Route::get('/is/mustentiq', [Web\DossierProfileController::class, 'show'])
    ->middleware('throttle:dossier-read')->name('dossier.profil');
Route::get('/is/mustentiq/ayarlar', [Web\DossierProfileController::class, 'settings'])
    ->middleware('throttle:dossier-read')->name('dossier.profil.ayarlar');

Route::post('/is/mustentiq/ad', [Web\DossierProfileController::class, 'saveName'])
    ->middleware('throttle:dossier')->name('dossier.profil.ad');
Route::post('/is/mustentiq/sobe', [Web\DossierProfileController::class, 'saveDepartment'])
    ->middleware('throttle:dossier')->name('dossier.profil.sobe');
Route::post('/is/mustentiq/gizlilik', [Web\DossierProfileController::class, 'savePrivacy'])
    ->middleware('throttle:dossier')->name('dossier.profil.gizlilik');
Route::post('/is/mustentiq/emr/{history}', [Web\DossierProfileController::class, 'dismissOrder'])
    ->where('history', '[0-9]+')->middleware('throttle:dossier')->name('dossier.profil.emr');

Route::post('/is/mustentiq/foto', [Web\DossierProfileController::class, 'storeAvatar'])
    ->middleware('throttle:dossier-foto')->name('dossier.profil.foto.store');

/* Şəkil verilməsi: təsdiqlənməmiş avatar üçüncü şəxsə 404 qaytarır —
   «icazə yoxdur» mesajının özü məlumatdır. */
Route::get('/is/mustentiq/{profil}/foto.jpg', [Web\DossierProfileController::class, 'avatar'])
    ->where('profil', '[0-9]+')->middleware('throttle:dossier-read')->name('dossier.profil.foto');

/* KASSA — bölmənin ÖZ balans ekranı. `/kabinet` zarafat bölməsinindir və
   bağlana bilər; onsuz ödənişli qovluqlar satıla bilməzdi. */
Route::get('/is/balans', [Web\DossierBalanceController::class, 'show'])
    ->middleware('throttle:dossier-read')->name('dossier.balans');
Route::post('/is/balans', [Web\DossierBalanceController::class, 'topUp'])
    ->middleware('throttle:payments')->name('dossier.balans.al');

Route::get('/is/reyting', [Web\DossierRankingController::class, 'index'])
    ->middleware('throttle:dossier-read')->name('dossier.reyting');

/* Bölmənin ÖZ qeydiyyat ekranı — `/kabinet`-ə link vermək iki məhsul
   arasındakı ayrılığı pozardı. Eyni `AccountService`-i çağırır. */
Route::get('/is/hesab', [Web\DossierAccountController::class, 'show'])
    ->middleware('throttle:dossier-read')->name('dossier.hesab');
Route::post('/is/qeydiyyat', [Web\DossierAccountController::class, 'register'])
    ->middleware('throttle:register')->name('dossier.register');
Route::post('/is/giris', [Web\DossierAccountController::class, 'login'])
    ->middleware('throttle:login')->name('dossier.login');
Route::post('/is/cixis', [Web\DossierAccountController::class, 'logout'])->name('dossier.logout');

/* Şəkil marşrutu sertifikat səhifəsindən ƏVVƏL elan olunur, yoxsa
   `.../on.jpg` ayrıca seqment kimi tutulmazdı. */
Route::get('/is/{slug}/hesabat/{token}/on.jpg', [Web\DossierController::class, 'certificateImage'])
    ->where(['slug' => '[0-9]{4}-[0-9]{4}', 'token' => '[A-Za-z0-9]{22}'])
    ->middleware('throttle:dossier-read')
    ->name('dossier.cert.image');

Route::get('/is/{slug}/hesabat/{token}', [Web\DossierController::class, 'certificate'])
    ->where(['slug' => '[0-9]{4}-[0-9]{4}', 'token' => '[A-Za-z0-9]{22}'])
    ->middleware('throttle:dossier-read')
    ->name('dossier.cert');

/* Mətndaxili şəkil. `/is/{slug}` marşrutundan ƏVVƏL, çünki üç seqmentdir
   və geniş yol axırda gəlməlidir. Ölçü ağ siyahıdır: `where` şərtindən
   keçməyən dəyər fayl adı quraşdırmağa ümumiyyətlə çatmır. */
Route::get('/is/{slug}/sekil/{id}/{olcu}', [Web\DossierController::class, 'image'])
    ->where(['slug' => '[0-9]{4}-[0-9]{4}', 'id' => '[0-9]+', 'olcu' => 'tam|orta|kicik'])
    ->middleware('throttle:dossier-read')
    ->name('dossier.image');

/* Oyun təqdimat səhifəsindən ƏVVƏL elan olunur: `/is/{slug}/qovluq`
   iki seqmentdir və slug marşrutu onu onsuz da tutmazdı, amma sıra
   oxunuşu asanlaşdırır — geniş yol axırda gəlir. */
Route::get('/is/{slug}/qovluq', [Web\DossierController::class, 'play'])
    ->where('slug', '[0-9]{4}-[0-9]{4}')
    ->middleware('throttle:dossier-read')
    ->name('dossier.play');

Route::get('/is/{slug}', [Web\DossierController::class, 'show'])
    ->where('slug', '[0-9]{4}-[0-9]{4}')
    ->middleware('throttle:dossier-read')
    ->name('dossier.show');

});

/*
|--------------------------------------------------------------------------
| API — frontend ilə eyni müqavilə (Node backend-i ilə uyğun)
|--------------------------------------------------------------------------
| Bu marşrutlar `web` qrupundadır: sessiya, cookie və CSRF qorunması işləyir.
| Yalnız provayder callback-i CSRF-dən azaddır (bootstrap/app.php-də).
*/
Route::prefix('api')->group(function (): void {
    Route::get('/health',        [Api\SessionController::class, 'health']);
    // Bu ikisi lazım gələrsə qonaq sətri yaradır — limitsiz qalsa users cədvəli doldurula bilər.
    Route::get('/me',            [Api\SessionController::class, 'me'])->middleware('throttle:registry');
    /* Sənəd siyahısı zarafat bölməsinindir; balans (`/me`) isə ortaqdır. */
    Route::get('/me/documents',  [Api\SessionController::class, 'documents'])
        ->middleware(['throttle:registry', 'bolme:zarafat']);
    /* PAKETLƏR BÖLMƏYƏ BAĞLI DEYİL: kredit hər iki məhsulda işlənir və
       `/is/balans` də bu siyahını oxuyur. */
    Route::get('/packs',         [Api\SessionController::class, 'packs']);

    /* Zarafat bölməsinin API-si. Bağlı olanda kataloq və sənəd yazma
       yolları da yox olur — əks halda köhnə SPA paketi ilə bağlı məhsuldan
       istifadə etmək mümkün qalardı. */
    Route::middleware('bolme:zarafat')->group(function (): void {
    Route::get('/catalog',       [Api\CatalogController::class, 'index']);

    Route::post('/documents', [Api\DocumentController::class, 'store'])->middleware('throttle:documents');
    Route::post('/documents/{regNo}/publish', [Api\DocumentController::class, 'publish'])->middleware('throttle:documents');
    Route::post('/documents/{regNo}/cancel', [Api\DocumentController::class, 'cancel'])->middleware('throttle:documents');

    /* Sosial kimlik kartı. `profil` kənar sorğu edir — ona görə ayrıca, daha
       dar limit altındadır; avatar yükləmə isə adi sənəd yazma yoludur. */
    Route::post('/sosial/profil', [Api\SosialController::class, 'profil'])->middleware('throttle:sosial');
    Route::post('/documents/{regNo}/avatar', [Api\SosialController::class, 'storeAvatar'])->middleware('throttle:documents');

    Route::get('/registry/{regNo}', [Api\RegistryController::class, 'show'])->middleware('throttle:registry');
    // Cavab zənciri — /r/{regNo} səhifəsindəki «Sənəd tarixçəsi» bölməsi.
    Route::get('/registry/{regNo}/zencir', [Api\RegistryController::class, 'chain'])->middleware('throttle:registry');

    // Cavab döngəsinin ölçülməsi. Hadisə adı ağ siyahıdadır — bax EventController.
    Route::post('/olcu', [Api\EventController::class, 'store'])->middleware('throttle:events');
    });

    Route::post('/payments/simulate', [Api\PaymentController::class, 'simulate'])->middleware('throttle:payments');
    Route::post('/payments/checkout', [Api\PaymentController::class, 'checkout'])->middleware('throttle:payments');
    Route::post('/payments/callback', [Api\PaymentController::class, 'callback']);

    /* ŞİKAYƏT BÖLMƏYƏ BAĞLI DEYİL: hüquqi qalxanın bir hissəsidir və
       bağlı bölmənin artefaktı üçün də açıq qalmalıdır. */
    Route::post('/reports', [Api\ReportController::class, 'store'])->middleware('throttle:reports');

    /* İş qovluğu. Sənədin məzmunu YALNIZ `sened` ucundan çıxır və hər
       çağırışda giriş yoxlanılır — ödəniş qatı yalnız görünüş deyil. */
    Route::middleware('bolme:is')->group(function (): void {
    Route::post('/is/{slug}/ac',           [Api\DossierController::class, 'open'])->middleware('throttle:dossier');
    Route::get('/is/{slug}/sened/{id}',    [Api\DossierController::class, 'document'])->middleware('throttle:dossier-read');
    Route::post('/is/{slug}/qeyd/{id}',    [Api\DossierController::class, 'pin'])->middleware('throttle:dossier');
    Route::post('/is/{slug}/kilid/{id}',   [Api\DossierController::class, 'unlock'])->middleware('throttle:dossier-kilid');
    Route::post('/is/{slug}/rey',          [Api\DossierController::class, 'verdict'])->middleware('throttle:dossier-rey');
    /* Sonluq rejimi — şübhəli seçimi. `rey` ilə eyni limitdə: hər ikisi
       oyunun yekunudur və hər ikisi bütün vərəqlərin keçilməsini tələb edir. */
    Route::post('/is/{slug}/sonluq',       [Api\DossierController::class, 'ending'])->middleware('throttle:dossier-rey');
    Route::post('/is/{slug}/yeniden',      [Api\DossierController::class, 'replay'])->middleware('throttle:dossier');
    Route::post('/is/{slug}/sertifikat',   [Api\DossierController::class, 'certificate'])->middleware('throttle:dossier');
    });

    /* Dəvətnamələr. Yazma yolları `devet`, açıq oxuma `devet-read`,
       qonaq cavabı isə ayrıca `rsvp` limiti ilə gedir — cavab uc nöqtəsi
       hər kəsə açıqdır, ona görə ən sərt limit ondadır. */
    Route::middleware('bolme:devet')->group(function (): void {
    Route::get('/devet/paketler', [Api\DevetController::class, 'packs']);

    Route::post('/devet', [Api\DevetController::class, 'store'])->middleware('throttle:devet');
    Route::post('/devet/{token}', [Api\DevetController::class, 'update'])->middleware('throttle:devet');
    Route::post('/devet/{token}/derc', [Api\DevetController::class, 'publish'])->middleware('throttle:devet');
    Route::post('/devet/{token}/onizleme', [Api\DevetController::class, 'storeOg'])->middleware('throttle:devet');
    Route::post('/devet/{token}/qonaqlar', [Api\DevetController::class, 'syncGuests'])->middleware('throttle:devet');
    Route::get('/devet/{token}/qonaqlar', [Api\DevetController::class, 'guests'])->middleware('throttle:devet-read');

    Route::get('/devet/{token}', [Api\DevetController::class, 'show'])->middleware('throttle:devet-read');
    Route::get('/devet/{token}/q/{guest}', [Api\DevetController::class, 'show'])->middleware('throttle:devet-read');
    Route::post('/devet/{token}/cavab', [Api\DevetController::class, 'rsvp'])->middleware('throttle:rsvp');
    Route::post('/devet/{token}/q/{guest}/cavab', [Api\DevetController::class, 'rsvp'])->middleware('throttle:rsvp');
    });
});

/*
|--------------------------------------------------------------------------
| Giriş yolları — hər üç bölmə üçün ortaq
|--------------------------------------------------------------------------
| Google-un `redirect_uri`-si HƏRFİ müqayisə olunur, ona görə cavab ünvanı
| tək və sabitdir; ziyarətçinin hara qayıdacağı sessiyadadır (`?davam=`,
| ağ siyahı — `config('oauth.qayidis')`).
*/
Route::get('/giris/google', [Web\OAuthController::class, 'start'])
    ->middleware('throttle:oauth')->name('oauth.google');
Route::get('/giris/google/cavab', [Web\OAuthController::class, 'callback'])
    ->middleware('throttle:oauth')->name('oauth.google.callback');
Route::post('/qonaq', [Web\OAuthController::class, 'guest'])
    ->middleware('throttle:qonaq')->name('oauth.guest');

/*
|--------------------------------------------------------------------------
| Kabinet — qonaq üçün də açıqdır
|--------------------------------------------------------------------------
*/
/* Kabinet zarafat bölməsinin hissəsidir — çərçivəsi, naviqasiyası və dili
   ona aiddir. İş qovluğunun öz balans ekranı var (`/is/balans`), ona görə
   bu bölməni bağlamaq kreditin alınmasını dayandırmır. */
Route::middleware('bolme:zarafat')->prefix('kabinet')->name('account.')->group(function (): void {
    Route::get('/',              [Web\AccountController::class, 'index'])->name('index');
    Route::get('/senedler',      [Web\AccountController::class, 'documents'])->name('documents');
    Route::get('/emeliyyatlar',  [Web\AccountController::class, 'transactions'])->name('transactions');
    Route::post('/balans',       [Web\AccountController::class, 'topUp'])->name('topup');

    Route::get('/hesab',         [Web\AccountController::class, 'showAuth'])->name('auth');
    Route::post('/qeydiyyat',    [Web\AccountController::class, 'register'])->middleware('throttle:register')->name('register');
    Route::post('/giris',        [Web\AccountController::class, 'login'])->middleware('throttle:login')->name('login');
    Route::post('/cixis',        [Web\AccountController::class, 'logout'])->name('logout');
});

/*
|--------------------------------------------------------------------------
| Admin panel
|--------------------------------------------------------------------------
*/
Route::prefix('admin')->name('admin.')->group(function (): void {
    Route::get('/giris',  [Admin\AuthController::class, 'showLogin'])->name('login');
    Route::post('/giris', [Admin\AuthController::class, 'login'])->middleware('throttle:login')->name('login.post');
    Route::post('/cixis', [Admin\AuthController::class, 'logout'])->name('logout');

    Route::middleware('admin')->group(function (): void {
        Route::get('/', [Admin\DashboardController::class, 'index'])->name('dashboard');

        Route::get('/senedler',                  [Admin\DocumentController::class, 'index'])->name('documents');
        Route::get('/senedler/{regNo}',          [Admin\DocumentController::class, 'show'])->name('documents.show');
        Route::post('/senedler/{regNo}/sil',     [Admin\DocumentController::class, 'remove'])->name('documents.remove');
        Route::post('/senedler/{regNo}/berpa',   [Admin\DocumentController::class, 'restore'])->name('documents.restore');

        // Cavab döngəsinin ölçüləri — dashboard-dan ayrıdır, çünki ayrı sualı cavablandırır
        Route::get('/statistika',   [Admin\StatsController::class, 'index'])->name('stats');

        Route::get('/odenisler',    [Admin\PaymentController::class, 'index'])->name('payments');
        Route::get('/emeliyyatlar', [Admin\PaymentController::class, 'transactions'])->name('transactions');

        Route::get('/istifadeciler',                 [Admin\UserController::class, 'index'])->name('users');
        Route::get('/istifadeciler/{uuid}',          [Admin\UserController::class, 'show'])->name('users.show');
        Route::post('/istifadeciler/{uuid}/kredit',  [Admin\UserController::class, 'grant'])->name('users.grant');
        Route::post('/istifadeciler/{uuid}/blok',    [Admin\UserController::class, 'toggleBlock'])->name('users.block');

        /* MÜSTƏNTİQ PROFİLLƏRİ.
           İstifadəçi siyahısı `admin.users`-də genişləndirilib — burada yalnız
           onun ifadə edə bilmədikləri var. */
        Route::get('/avatarlar',                        [Admin\ProfileController::class, 'avatars'])->name('avatars');
        Route::get('/avatarlar/{profile}/foto.jpg',     [Admin\ProfileController::class, 'image'])->name('avatars.image');
        Route::post('/avatarlar/{profile}/tesdiq',      [Admin\ProfileController::class, 'approve'])->name('avatars.approve');
        Route::post('/avatarlar/{profile}/imtina',      [Admin\ProfileController::class, 'reject'])->name('avatars.reject');
        Route::post('/mustentiqler/{profile}/xal',      [Admin\ProfileController::class, 'xp'])->name('profiles.xp');
        Route::post('/mustentiqler/yeniden-hesabla',    [Admin\ProfileController::class, 'recalculate'])->name('profiles.recalc');

        Route::get('/sikayetler',                 [Admin\ReportController::class, 'index'])->name('reports');
        Route::post('/sikayetler/{report}/qebul', [Admin\ReportController::class, 'accept'])->name('reports.accept');
        Route::post('/sikayetler/{report}/redd',  [Admin\ReportController::class, 'reject'])->name('reports.reject');

        /* Kataloq — kateqoriyalar və şablonlar */
        Route::get('/kateqoriyalar',                    [Admin\CatalogController::class, 'categories'])->name('catalog.categories');
        Route::get('/kateqoriyalar/yeni',               [Admin\CatalogController::class, 'categoryForm'])->name('catalog.categories.create');
        Route::post('/kateqoriyalar/yeni',              [Admin\CatalogController::class, 'categorySave'])->name('catalog.categories.store');
        Route::get('/kateqoriyalar/{category}',         [Admin\CatalogController::class, 'categoryForm'])->name('catalog.categories.edit');
        Route::post('/kateqoriyalar/{category}',        [Admin\CatalogController::class, 'categorySave'])->name('catalog.categories.update');
        Route::post('/kateqoriyalar/{category}/vezi',   [Admin\CatalogController::class, 'categoryToggle'])->name('catalog.categories.toggle');
        Route::post('/kateqoriyalar/{category}/sil',    [Admin\CatalogController::class, 'categoryDelete'])->name('catalog.categories.delete');

        Route::get('/sablonlar',                    [Admin\CatalogController::class, 'templates'])->name('catalog.templates');
        Route::get('/sablonlar/yeni',               [Admin\CatalogController::class, 'templateForm'])->name('catalog.templates.create');
        Route::post('/sablonlar/yeni',              [Admin\CatalogController::class, 'templateSave'])->name('catalog.templates.store');
        Route::get('/sablonlar/ixrac',              [Admin\CatalogController::class, 'export'])->name('catalog.export');
        Route::get('/sablonlar/{template}',         [Admin\CatalogController::class, 'templateForm'])->name('catalog.templates.edit');
        Route::post('/sablonlar/{template}',        [Admin\CatalogController::class, 'templateSave'])->name('catalog.templates.update');
        Route::post('/sablonlar/{template}/vezi',   [Admin\CatalogController::class, 'templateToggle'])->name('catalog.templates.toggle');
        Route::post('/sablonlar/{template}/nusxe',  [Admin\CatalogController::class, 'templateDuplicate'])->name('catalog.templates.duplicate');
        Route::post('/sablonlar/{template}/sil',    [Admin\CatalogController::class, 'templateDelete'])->name('catalog.templates.delete');

        /* Şablon formasının AI köməkçisi — kataloqa yazmır, yalnız formanı doldurur. */
        Route::post('/sablonlar-ai', [Admin\AiController::class, 'draft'])
            ->middleware('throttle:ai')->name('catalog.ai');

        /* İş qovluqları.

           Sıra vacibdir: `/qovluqlar/yeni` və `/qovluqlar/sekil/…` marşrutları
           `/qovluqlar/{dossier}` -dan ƏVVƏL gəlməlidir, yoxsa geniş yol onları
           udar və «yeni» sözü qovluq açarı kimi oxunar. */
        Route::get('/qovluqlar',      [Admin\DossierController::class, 'index'])->name('dossier');

        /* AI ilə iş qurma — iki mərhələ, hər biri BİR OpenAI çağırışı.
           `throttle:ai` şablon köməkçisi ilə eyni limitdədir: hər çağırış
           real pul xərcləyir. */
        Route::post('/qovluqlar-ai',                     [Admin\DossierAiController::class, 'skelet'])
            ->middleware('throttle:ai')->name('dossier.ai');
        Route::post('/qovluqlar-ai/{dossier}/senedler',   [Admin\DossierAiController::class, 'senedler'])
            ->middleware('throttle:ai')->name('dossier.ai.docs');
        Route::get('/qovluqlar/yeni', [Admin\DossierController::class, 'form'])->name('dossier.new');
        Route::post('/qovluqlar',     [Admin\DossierController::class, 'save'])->name('dossier.create');

        Route::get('/qovluqlar/sekil/{image}/{olcu}', [Admin\DossierImageController::class, 'show'])
            ->where('olcu', 'tam|orta|kicik')->name('dossier.image');

        Route::get('/qovluqlar/{dossier}',            [Admin\DossierController::class, 'form'])->name('dossier.form');
        Route::post('/qovluqlar/{dossier}',           [Admin\DossierController::class, 'save'])->name('dossier.save');
        Route::post('/qovluqlar/{dossier}/arxiv',     [Admin\DossierController::class, 'archive'])->name('dossier.archive');
        Route::post('/qovluqlar/{dossier}/nusxe',     [Admin\DossierController::class, 'duplicate'])->name('dossier.duplicate');
        Route::post('/qovluqlar/{dossier}/sil',       [Admin\DossierController::class, 'destroy'])->name('dossier.delete');
        Route::post('/qovluqlar/{dossier}/sira',      [Admin\DossierController::class, 'reorder'])->name('dossier.reorder');
        Route::post('/qovluqlar/{dossier}/derc',      [Admin\DossierController::class, 'publishAll'])->name('dossier.publishAll');

        Route::get('/qovluqlar/{dossier}/sened',                  [Admin\DossierController::class, 'doc'])->name('dossier.doc.new');
        Route::post('/qovluqlar/{dossier}/sened',                 [Admin\DossierController::class, 'docSave'])->name('dossier.doc.create');
        Route::post('/qovluqlar/{dossier}/onizleme',              [Admin\DossierController::class, 'preview'])->name('dossier.preview');
        Route::get('/qovluqlar/{dossier}/sened/{document}',       [Admin\DossierController::class, 'doc'])->name('dossier.doc');
        Route::post('/qovluqlar/{dossier}/sened/{document}',      [Admin\DossierController::class, 'docSave'])->name('dossier.doc.save');
        Route::post('/qovluqlar/{dossier}/sened/{document}/derc', [Admin\DossierController::class, 'docPublish'])->name('dossier.doc.publish');
        Route::post('/qovluqlar/{dossier}/sened/{document}/sil',  [Admin\DossierController::class, 'docDelete'])->name('dossier.doc.delete');
        Route::post('/qovluqlar/{dossier}/sened/{document}/onizleme', [Admin\DossierController::class, 'preview'])->name('dossier.doc.preview');

        Route::post('/qovluqlar/{dossier}/kod',            [Admin\DossierController::class, 'codeSave'])->name('dossier.code.create');
        Route::post('/qovluqlar/{dossier}/kod/{code}',     [Admin\DossierController::class, 'codeSave'])->name('dossier.code.save');
        Route::post('/qovluqlar/{dossier}/kod/{code}/sil', [Admin\DossierController::class, 'codeDelete'])->name('dossier.code.delete');

        Route::post('/qovluqlar/{dossier}/subheli',                [Admin\DossierController::class, 'suspectSave'])->name('dossier.suspect.create');
        Route::post('/qovluqlar/{dossier}/subheli/{suspect}',      [Admin\DossierController::class, 'suspectSave'])->name('dossier.suspect.save');
        Route::post('/qovluqlar/{dossier}/subheli/{suspect}/sil',  [Admin\DossierController::class, 'suspectDelete'])->name('dossier.suspect.delete');
        Route::post('/qovluqlar/{dossier}/sonluq/{suspect}',       [Admin\DossierController::class, 'endingSave'])->name('dossier.ending.save');

        /* Hekayə məlumatı və yekun suallar — qovluğun mətni, sənədlərin yox. */
        Route::post('/qovluqlar/{dossier}/hekaye',             [Admin\DossierController::class, 'storySave'])->name('dossier.story');
        Route::post('/qovluqlar/{dossier}/sual',               [Admin\DossierController::class, 'questionSave'])->name('dossier.question.create');
        Route::post('/qovluqlar/{dossier}/sual/{question}',     [Admin\DossierController::class, 'questionSave'])->name('dossier.question.save');
        Route::post('/qovluqlar/{dossier}/sual/{question}/sil', [Admin\DossierController::class, 'questionDelete'])->name('dossier.question.delete');

        Route::post('/qovluqlar/{dossier}/sekil',                  [Admin\DossierImageController::class, 'store'])->name('dossier.image.store');
        Route::post('/qovluqlar/{dossier}/sekil/{image}',          [Admin\DossierImageController::class, 'update'])->name('dossier.image.update');
        Route::post('/qovluqlar/{dossier}/sekil/{image}/sil',      [Admin\DossierImageController::class, 'destroy'])->name('dossier.image.delete');

        Route::get('/parametrler',  [Admin\SettingController::class, 'edit'])->name('settings');
        Route::post('/parametrler', [Admin\SettingController::class, 'update'])->name('settings.update');
        Route::post('/parametrler/ai', [Admin\SettingController::class, 'updateAi'])->name('settings.ai');
        Route::post('/parametrler/bolmeler', [Admin\SettingController::class, 'updateSections'])->name('settings.sections');
        Route::post('/parametrler/bolmeler/sifirla', [Admin\SettingController::class, 'resetSections'])->name('settings.sections.reset');
    });
});
