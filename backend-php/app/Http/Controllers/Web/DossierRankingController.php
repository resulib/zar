<?php

declare(strict_types=1);

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Services\ProfileService;
use App\Services\RankingService;
use App\Support\Sanitizer;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

/**
 * Reytinq siyahısı.
 *
 * AXTARIŞA AÇIQDIR — `/is` və `/is/{slug}` kimi satış üzüdür: bir oyunun
 * nə qədər oynandığını göstərən siyahı məhsulun özünün reklamıdır.
 * Görünən yeganə şəxsi məlumat `display_name`-dir və o, istifadəçinin
 * SEÇDİYİ addır; e-poçt, uuid və qeydiyyat tarixi buraya çıxmır.
 *
 * `is_public = false` olan profil siyahıda yoxdur, amma öz mövqeyini
 * profilində görür.
 */
class DossierRankingController extends Controller
{
    public function __construct(
        private readonly RankingService $ranking,
        private readonly ProfileService $profiles,
    ) {
    }

    public function index(Request $request): Response
    {
        $sirala = Sanitizer::pick($request->query('sirala'),
            (array) config('dossier.reyting.siralamalar'), 'xp');
        $pencere = Sanitizer::pick($request->query('pencere'),
            (array) config('dossier.reyting.pencereler'), 'hamisi');

        $lovhe = $this->ranking->board($sirala, $pencere, (int) $request->query('sehife', 1));

        /* Oxucunun ÖZ sətri — siyahıda olmasa da (gizli profil, və ya
           siyahının kənarında qalan mövqe) göstərilir. */
        $user   = $request->visitor();
        $mene   = $user->isGuest() ? null : $this->profiles->find($user);
        $movqem = $mene === null ? null : $this->ranking->myPosition($mene, $sirala, $pencere);

        return response()->view('dossier.reyting', [
            'setirler' => $lovhe['setirler'],
            'sirala'   => $lovhe['sirala'],
            'pencere'  => $lovhe['pencere'],
            'mene'     => $mene,
            'movqem'   => $movqem,
            'menim'    => $mene === null ? [] : $this->ranking->totals($mene,
                $this->pencereBasi($lovhe['pencere'])),
        ]);
    }

    protected function pencereBasi(string $pencere): ?\Illuminate\Support\Carbon
    {
        return match ($pencere) {
            'ay'    => \Illuminate\Support\Carbon::now()->startOfMonth(),
            'hefte' => \Illuminate\Support\Carbon::now()->startOfWeek(),
            default => null,
        };
    }
}
