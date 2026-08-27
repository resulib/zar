<?php

declare(strict_types=1);

namespace App\Providers;

use App\Models\User;
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
        // $request->visitor() — cari qonaq və ya giriş etmiş istifadəçi
        Request::macro('visitor', function (): User {
            /** @var Request $this */
            $visitor = $this->attributes->get('visitor');

            if (! $visitor instanceof User) {
                abort(500, 'Ziyarətçi tanınmadı — IdentifyVisitor middleware işləmir.');
            }

            return $visitor;
        });

        RateLimiter::for('documents', fn (Request $r) => Limit::perMinute(20)->by($r->visitor()->id));
        RateLimiter::for('payments',  fn (Request $r) => Limit::perMinute(12)->by($r->visitor()->id));
        RateLimiter::for('reports',   fn (Request $r) => Limit::perMinute(10)->by($r->visitor()->id));
    }
}
