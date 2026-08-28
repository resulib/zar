<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Models\User;
use App\Services\AccountService;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

/**
 * Hər sorğuda ziyarətçini TANIYIR — lakin yaratmır.
 *
 *   1. Giriş etmiş istifadəçi varsa — odur.
 *   2. Yoxdursa, `zrf_uid` cookie-si ilə qonaq sətri tapılır.
 *   3. O da yoxdursa, heç nə edilmir.
 *
 * Qonaq sətri yalnız `$request->visitor()` ilk dəfə çağırılanda yaradılır
 * (AppServiceProvider-dəki makro). Əvvəllər hər sorğuda yaradılırdı və
 * cookie qəbul etməyən sadə skript bazanı limitsiz doldura bilirdi.
 *
 * Nəticə `$request->visitor()` kimi əlçatandır.
 */
class IdentifyVisitor
{
    public function __construct(private readonly AccountService $accounts)
    {
    }

    public function handle(Request $request, Closure $next): Response
    {
        $cookieName = (string) config('zarafat.guest_cookie');
        $token      = $request->cookie($cookieName);

        $user = Auth::user();

        if (! $user instanceof User) {
            $user = is_string($token) && $token !== ''
                ? $this->accounts->findByGuestToken($token)
                : null;
        } else {
            // Giriş etmiş istifadəçinin də sabit qonaq tokeni olsun
            $accountToken = $this->accounts->ensureGuestToken($user);
            if ($token !== $accountToken) {
                self::issueCookie($accountToken);
            }
        }

        // Bloklanmış istifadəçi yalnız oxuya bilər — yazma controller-lərdə dayandırılır
        if ($user instanceof User) {
            $request->attributes->set('visitor', $user);
            self::touch($user, $request->ip());
        }

        return $next($request);
    }

    /** Son görünmə vaxtını 15 dəqiqədən bir yeniləyir. */
    public static function touch(User $user, ?string $ip): void
    {
        if ($user->last_seen_at !== null && $user->last_seen_at->diffInMinutes(Carbon::now()) <= 15) {
            return;
        }

        $user->forceFill([
            'last_seen_at' => Carbon::now(),
            'last_ip'      => $ip,
        ])->saveQuietly();
    }

    /** Qonaq cookie-si — sayt https-dədirsə yalnız https ilə göndərilir. */
    public static function issueCookie(string $token): void
    {
        \Illuminate\Support\Facades\Cookie::queue(\Illuminate\Support\Facades\Cookie::make(
            name: (string) config('zarafat.guest_cookie'),
            value: $token,
            minutes: (int) config('zarafat.guest_lifetime'),
            path: '/',
            secure: str_starts_with((string) config('zarafat.public_url'), 'https'),
            httpOnly: true,
            sameSite: 'lax',
        ));
    }
}
