<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AdminOnly
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        if (! $user instanceof User || ! $user->is_admin) {
            return redirect()->route('admin.login')->withErrors([
                'email' => 'Bu bölmə yalnız idarəçilər üçündür.',
            ]);
        }

        return $next($request);
    }
}
