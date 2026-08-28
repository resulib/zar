<?php

declare(strict_types=1);

namespace App\Providers;

use App\Http\Middleware\IdentifyVisitor;
use App\Models\User;
use App\Services\AccountService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        /* Sayt https-dədirsə sessiya cookie-si də yalnız https ilə getsin.
           `APP_URL`-dan törədilir: layihənin config/session.php faylı yoxdur,
           həm də açıq şəkildə true yazmaq http-də işləyən quraşdırmanı sındırardı.
           Eyni məntiq qonaq cookie-sində də var (IdentifyVisitor). */
        if (str_starts_with((string) config('zarafat.public_url'), 'https')) {
            config([
                'session.secure'    => true,
                'session.http_only' => true,
                'session.same_site' => 'lax',
            ]);
        }

        /* $request->visitor() — cari qonaq və ya giriş etmiş istifadəçi.
           Qonaq sətri MƏHZ BURADA, ilk çağırışda yaradılır. IdentifyVisitor
           yalnız tanıyır: belədə cookie qəbul etməyən skript sadəcə GET
           göndərməklə users cədvəlini doldura bilmir. */
        Request::macro('visitor', function (): User {
            /** @var Request $this */
            $visitor = $this->attributes->get('visitor');

            if ($visitor instanceof User) {
                return $visitor;
            }

            /** @var AccountService $accounts */
            $accounts = app(AccountService::class);
            $visitor  = $accounts->newGuest($this->ip());

            IdentifyVisitor::issueCookie((string) $visitor->guest_token);
            $this->attributes->set('visitor', $visitor);

            return $visitor;
        });

        // Limit açarı: ziyarətçi tanınıbsa onun id-si, yoxdursa IP.
        // (Middleware sırası pozulsa belə limit 500 vermir.)
        $key = function (Request $r): string {
            $visitor = $r->attributes->get('visitor');

            return $visitor instanceof User ? 'u:' . $visitor->id : 'ip:' . $r->ip();
        };

        RateLimiter::for('documents', fn (Request $r) => Limit::perMinute(20)->by($key($r)));
        RateLimiter::for('payments',  fn (Request $r) => Limit::perMinute(12)->by($key($r)));
        RateLimiter::for('reports',   fn (Request $r) => Limit::perMinute(10)->by($key($r)));

        // Reyestr açıqdır və qeydiyyat nömrəsi cəmi 4 rəqəmdir — limitsiz qalsa
        // bütün reyestri sadalamaq və baxış sayğacını şişirtmək olar.
        RateLimiter::for('registry', fn (Request $r) => [
            Limit::perMinute(30)->by($key($r)),
            Limit::perMinute(60)->by('ip:' . $r->ip()),
        ]);

        // Parol sınağı: e-poçt+IP cütü üzrə sərt, IP üzrə isə ümumi limit.
        // İkisi birlikdə həm bir hesaba, həm də siyahı üzrə hücumu dayandırır.
        RateLimiter::for('login', fn (Request $r) => [
            Limit::perMinute(5)->by(mb_strtolower((string) $r->input('email')) . '|' . $r->ip()),
            Limit::perMinute(20)->by('ip:' . $r->ip()),
            Limit::perDay(200)->by('ip:' . $r->ip()),
        ]);

        // Qeydiyyat: bir IP-dən kütləvi hesab açılmasının qarşısını alır.
        RateLimiter::for('register', fn (Request $r) => [
            Limit::perMinute(3)->by('ip:' . $r->ip()),
            Limit::perDay(20)->by('ip:' . $r->ip()),
        ]);
    }
}
