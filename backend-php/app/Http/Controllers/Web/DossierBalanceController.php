<?php

declare(strict_types=1);

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Services\PaymentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

/**
 * Bölmənin ÖZ balans ekranı.
 *
 * SƏBƏB: kredit yalnız `/kabinet`-dən alınırdı, o isə zarafat bölməsinin
 * hissəsidir — həm dili və çərçivəsi ilə digər məhsula aiddir, həm də
 * bölmə bağlananda yox olur. Onsuz iş qovluqları satıla bilməzdi.
 *
 * `DossierAccountController` ilə eyni arqument: məntiq TƏKRARLANMIR —
 * eyni `PaymentService` çağırılır, yalnız çərçivə və qayıdış ünvanı
 * bölməyə aiddir.
 */
class DossierBalanceController extends Controller
{
    public function __construct(private readonly PaymentService $payments)
    {
    }

    public function show(Request $request): SymfonyResponse
    {
        $user = $request->visitor();

        return $this->noindex(response()->view('dossier.balans', [
            'user'    => $user,
            'packs'   => $this->payments->packs()->all(),
            'qiymet'  => (int) config('dossier.price_credits'),
            /* Ödəniş provayderindən qayıdış: `?odenis=ugurlu|xeta`. */
            'netice'  => (string) $request->query('odenis', ''),
        ]));
    }

    public function topUp(Request $request): RedirectResponse
    {
        $user = $request->visitor();

        if ($user->is_blocked) {
            return back()->withErrors(['pack' => 'Hesab məhdudlaşdırılıb.']);
        }

        $packId = (string) $request->input('pack');

        if (! $this->payments->packs()->has($packId)) {
            return back()->withErrors(['pack' => 'Naməlum paket.']);
        }

        $base = rtrim((string) config('zarafat.public_url'), '/');

        try {
            /* Ödəniş səhifəsində və qayıdışda BU bölmənin adı görünür —
               oyunçu digər məhsulun adını nə bankda, nə də qayıdanda
               görməməlidir. */
            $result = $this->payments->checkout($user, $packId, [
                'description' => config('dossier.brand') . ' — '
                    . $this->payments->packs()->get($packId)['label'],
                'success'     => $base . '/is/balans?odenis=ugurlu',
                'error'       => $base . '/is/balans?odenis=xeta',
            ]);
        } catch (\Throwable $e) {
            report($e);

            return back()->withErrors(['pack' => 'Ödəniş başladıla bilmədi. Bir azdan yenidən yoxlayın.']);
        }

        if ($result['autoPaid']) {
            return redirect()->route('dossier.balans')
                ->with('status', 'Balans artırıldı (test ödənişi): +' . $result['payment']->credits . ' kredit.');
        }

        return redirect()->away($result['redirectUrl']);
    }

    protected function noindex(Response $response): Response
    {
        return $response->header('X-Robots-Tag', 'noindex, nofollow, noarchive');
    }
}
