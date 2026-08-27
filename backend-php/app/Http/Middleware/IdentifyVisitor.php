<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Models\User;
use App\Services\AccountService;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Symfony\Component\HttpFoundation\Response;

/**
 * Hər sorğuda ziyarətçini tanıyır.
 *
 *   1. Giriş etmiş istifadəçi varsa — odur.
 *   2. Yoxdursa, `zrf_uid` cookie-si ilə qonaq sətri tapılır.
 *   3. O da yoxdursa, yeni qonaq yaradılır və cookie qoyulur.
 *
 * Nəticə `$request->visitor()` kimi (macro) və `visitor()` helper-i ilə əlçatandır.
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
        $issue      = false;

        $user = Auth::user();

        if (! $user instanceof User) {
            $user = is_string($token) && $token !== ''
                ? $this->accounts->findByGuestToken($token)
                : null;

            if (! $user) {
                $user  = $this->accounts->newGuest($request->ip());
                $token = $user->guest_token;
                $issue = true;
            }
        } else {
            // Giriş etmiş istifadəçinin də sabit qonaq tokeni olsun
            $accountToken = $this->accounts->ensureGuestToken($user);
            if ($token !== $accountToken) {
                $token = $accountToken;
                $issue = true;
            }
        }

        // Bloklanmış istifadəçi yalnız oxuya bilər — yazma controller-lərdə dayandırılır
        $request->attributes->set('visitor', $user);

        if ($user->last_seen_at === null || $user->last_seen_at->diffInMinutes(Carbon::now()) > 15) {
            $user->forceFill([
                'last_seen_at' => Carbon::now(),
                'last_ip'      => $request->ip(),
            ])->saveQuietly();
        }

        $response = $next($request);

        if ($issue && is_string($token)) {
            Cookie::queue(Cookie::make(
                name: $cookieName,
                value: $token,
                minutes: (int) config('zarafat.guest_lifetime'),
                path: '/',
                secure: str_starts_with((string) config('zarafat.public_url'), 'https'),
                httpOnly: true,
                sameSite: 'lax',
            ));
        }

        return $response;
    }
}
