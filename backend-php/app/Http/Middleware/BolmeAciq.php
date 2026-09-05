<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Models\User;
use App\Services\BolmeService;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

/**
 * Bağlı bölmənin ünvanları MÖVCUD DEYİL.
 *
 * `bolme:zarafat` kimi işlədilir. Cavab **404**-dür, 403 deyil: «icazə
 * yoxdur» mesajının özü ünvanın mövcudluğunu bildirir və bölmənin bağlı
 * olduğunu elan edir — bu deponun `DossierService::imagePath()` və
 * dəvətnamə lövhəsi üçün artıq yazdığı qayda.
 *
 * ADMİN İSTİSNADIR: bağlı bölməni açmadan öncə yoxlamaq mümkün olmalıdır,
 * əks halda parametr «gözü bağlı» çevrilərdi. Admin cavabında
 * `X-Bolme-Bagli` başlığı olur ki, kənardan görünən vəziyyətlə qarışmasın.
 *
 * `$request->visitor()` ÇAĞIRILMIR: o, qonaq sətrini YARADIR, bu ara qat
 * isə hər sorğuda işləyir — cookie qəbul etməyən skript bazanı doldurardı
 * (`IdentifyVisitor`-un öz qaydası). `Auth::user()` yalnız oxuyur.
 */
class BolmeAciq
{
    public function __construct(private readonly BolmeService $bolmeler)
    {
    }

    public function handle(Request $request, Closure $next, string $bolme): Response
    {
        if ($this->bolmeler->aciq($bolme)) {
            return $next($request);
        }

        $user = Auth::user();

        if ($user instanceof User && $user->is_admin) {
            $cavab = $next($request);
            $cavab->headers->set('X-Bolme-Bagli', $bolme);
            /* Bağlı bölmə axtarış sistemlərinə düşməməlidir — admin onu
               açıq brauzerdə gəzdirir və link paylaşa bilər. */
            $cavab->headers->set('X-Robots-Tag', 'noindex, nofollow, noarchive');

            return $cavab;
        }

        abort(404);
    }
}
