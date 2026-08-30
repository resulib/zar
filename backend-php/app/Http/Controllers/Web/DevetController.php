<?php

declare(strict_types=1);

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Invite;
use App\Services\InviteService;
use App\Support\Devet;
use Illuminate\Http\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

/**
 * Dəvətnamə bölməsi — saytın digər hissəsindən ayrı səhifələr.
 *
 * Bu səhifələr axtarış sistemlərinə düşməməlidir: dəvətnamə yalnız linki
 * bilən adama aiddir. Həm meta teqi, həm `X-Robots-Tag` başlığı verilir —
 * bəzi kəşfiyyatçılar HTML-i oxumadan yalnız başlığa baxır.
 */
class DevetController extends Controller
{
    public function __construct(private readonly InviteService $invites)
    {
    }

    /** Redaktor. Baza sorğusu yoxdur — bütün çəkiliş brauzerdə gedir. */
    public function builder(): Response
    {
        return $this->noindex(response()->view('devet'));
    }

    /**
     * Qonağın gördüyü səhifə.
     *
     * Server HTML-inə YALNIZ sosial önizləmə üçün lazım olan minimum düşür:
     * ad, dəvət cümləsi və tarix. Ünvan, telefon və qonaq siyahısı buraya
     * qoyulmur — onları `devet-view.js` /api/devet/{token}-dan alır, yəni
     * söhbətdəki link önizləməsində məkan və nömrə görünmür.
     */
    public function show(string $token, ?string $guest = null): Response
    {
        $invite = Devet::isToken($token)
            ? Invite::published()->where('token', $token)->first()
            : null;

        $og = $invite?->ogMeta() ?? ['title' => 'Dəvətnamə', 'description' => '', 'image' => ''];

        return $this->noindex(response()->view('devet-view', [
            'og'    => $og,
            'token' => $token,
            'guest' => $guest,
        ]));
    }

    /**
     * WhatsApp önizləmə şəkli.
     *
     * Fayl public kökdən kənarda saxlanılır və buradan SABİT `image/jpeg`
     * başlığı ilə verilir: yüklənən fayl heç bir halda icra oluna bilməz.
     */
    public function preview(string $token): Response|BinaryFileResponse
    {
        $invite = Devet::isToken($token)
            ? Invite::published()->where('token', $token)->first()
            : null;

        $path = $invite === null ? null : $this->invites->ogPath($invite);

        if ($path === null) {
            return response('', 404);
        }

        return response()->file($path, [
            'Content-Type'           => 'image/jpeg',
            'X-Content-Type-Options' => 'nosniff',
            'Cache-Control'          => 'public, max-age=600',
            'X-Robots-Tag'           => 'noindex',
        ]);
    }

    protected function noindex(Response $response): Response
    {
        return $response->header('X-Robots-Tag', 'noindex, nofollow, noarchive');
    }
}
