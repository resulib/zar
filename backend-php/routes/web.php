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
Route::get('/', [Web\PageController::class, 'home'])->name('home');
Route::get('/r/{regNo}', [Web\PageController::class, 'registry'])
    ->where('regNo', '[A-Za-z]{2,4}-\d{4}-\d{4}')
    ->middleware('throttle:registry')
    ->name('registry.show');

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
    Route::get('/me/documents',  [Api\SessionController::class, 'documents'])->middleware('throttle:registry');
    Route::get('/packs',         [Api\SessionController::class, 'packs']);
    Route::get('/catalog',       [Api\CatalogController::class, 'index']);

    Route::post('/documents', [Api\DocumentController::class, 'store'])->middleware('throttle:documents');
    Route::post('/documents/{regNo}/publish', [Api\DocumentController::class, 'publish'])->middleware('throttle:documents');
    Route::post('/documents/{regNo}/cancel', [Api\DocumentController::class, 'cancel'])->middleware('throttle:documents');

    Route::get('/registry/{regNo}', [Api\RegistryController::class, 'show'])->middleware('throttle:registry');

    Route::post('/payments/simulate', [Api\PaymentController::class, 'simulate'])->middleware('throttle:payments');
    Route::post('/payments/checkout', [Api\PaymentController::class, 'checkout'])->middleware('throttle:payments');
    Route::post('/payments/callback', [Api\PaymentController::class, 'callback']);

    Route::post('/reports', [Api\ReportController::class, 'store'])->middleware('throttle:reports');
});

/*
|--------------------------------------------------------------------------
| Kabinet — qonaq üçün də açıqdır
|--------------------------------------------------------------------------
*/
Route::prefix('kabinet')->name('account.')->group(function (): void {
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

        Route::get('/odenisler',    [Admin\PaymentController::class, 'index'])->name('payments');
        Route::get('/emeliyyatlar', [Admin\PaymentController::class, 'transactions'])->name('transactions');

        Route::get('/istifadeciler',                 [Admin\UserController::class, 'index'])->name('users');
        Route::get('/istifadeciler/{uuid}',          [Admin\UserController::class, 'show'])->name('users.show');
        Route::post('/istifadeciler/{uuid}/kredit',  [Admin\UserController::class, 'grant'])->name('users.grant');
        Route::post('/istifadeciler/{uuid}/blok',    [Admin\UserController::class, 'toggleBlock'])->name('users.block');

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

        Route::get('/parametrler',  [Admin\SettingController::class, 'edit'])->name('settings');
        Route::post('/parametrler', [Admin\SettingController::class, 'update'])->name('settings.update');
    });
});
