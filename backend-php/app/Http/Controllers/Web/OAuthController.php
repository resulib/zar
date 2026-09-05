<?php

declare(strict_types=1);

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\AccountService;
use App\Services\OAuthService;
use App\Services\ProfileService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * Google ilə giriş və avtomatik qonaq qeydiyyatı.
 *
 * BİR KONTROLLER, ÜÇ BÖLMƏ. Kabinet, iş qovluğu və dəvətnamə bölmələri
 * fiziki olaraq ayrıdır və bir-birinə link vermir, LAKİN autentifikasiya
 * məntiqi təkrarlanmır — `DossierAccountController`-in artıq yazdığı qayda.
 * Ziyarətçinin hara qayıdacağı `?davam=` ağ siyahı açarı ilə seçilir və
 * SESSİYADA saxlanılır: Google-un `redirect_uri`-si hərfi müqayisə olunduğu
 * üçün tək və sabit qalmalıdır.
 */
class OAuthController extends Controller
{
    public function __construct(
        private readonly OAuthService $oauth,
        private readonly AccountService $accounts,
        private readonly ProfileService $profiles,
    ) {
    }

    /** Addım 1 — Google-un razılıq səhifəsinə göndərir. */
    public function start(Request $request): RedirectResponse
    {
        $davam = $this->oauth->hedef($request->query('davam'));

        if (! $this->oauth->hazir()) {
            return redirect()->route($this->oauth->marsrut($davam))
                ->withErrors(['email' => 'Google girişi bu saytda qurulmayıb.']);
        }

        /* Ziyarətçi sətri MÜTLƏQ indi yaransın: qayıdışda qonaq sessiyasını
           hesaba birləşdirmək üçün onun id-si lazımdır. */
        $request->visitor();

        return redirect()->away($this->oauth->baslat($request, $davam));
    }

    /** Addım 2 — Google-dan qayıdış. */
    public function callback(Request $request): RedirectResponse
    {
        $davam    = (string) $request->session()->pull(OAuthService::S_QAYIDIS, '');
        $davam    = $this->oauth->hedef($davam !== '' ? $davam : null);
        $marsrut  = $this->oauth->marsrut($davam);
        $ziyaretci = $request->visitor();

        try {
            $netice = $this->oauth->tamamla($request, $ziyaretci);
        } catch (\Throwable $e) {
            report($e);

            return redirect()->route($marsrut)->withErrors(['email' => $e->getMessage()]);
        }

        /** @var User $user */
        $user = $netice['user'];

        if ($user->is_blocked) {
            return redirect()->route($marsrut)->withErrors(['email' => 'Hesab məhdudlaşdırılıb.']);
        }

        Auth::login($user, remember: true);
        $request->session()->regenerate();

        /* İş qovluğu bölməsində hesab profilsiz mənasızdır — vəsiqə,
           rütbə və reytinq ona bağlıdır. Digər bölmələrdə profil
           yaradılmır: oynamamış adam üçün boş sətir açmaq lazım deyil
           (`ProfileService::ensure()`-in öz qaydası). */
        if ($davam === 'is') {
            $this->profiles->ensure($user)->forceFill(['is_public' => true])->save();
        }

        $mesaj = $netice['yeni']
            ? 'Google ilə hesab açıldı. Balansınız və nəticələriniz olduğu kimi qaldı.'
            : 'Xoş gəldiniz.';

        $b = $netice['birlesdi'];
        if ($b['moved_documents'] > 0 || $b['moved_credits'] > 0) {
            $mesaj .= sprintf(
                ' Qonaq sessiyasından %d sənəd və %d kredit köçürüldü.',
                $b['moved_documents'],
                $b['moved_credits']
            );
        }

        return redirect()->route($marsrut)->with('status', $mesaj);
    }

    /**
     * Qonaq kimi davam et.
     *
     * Sətir onsuz da `$request->visitor()` ilə avtomatik yaranır — bu marşrut
     * yalnız SEÇİMİ görünən edir. Əvvəllər qonaq rejimi gizli idi: adam giriş
     * ekranında qeydiyyatdan başqa yol görmürdü, halbuki saytın hər yeri
     * qonaq üçün onsuz da işləyirdi.
     */
    public function guest(Request $request): RedirectResponse
    {
        $user  = $request->visitor();
        $davam = $this->oauth->hedef($request->input('davam'));

        if (! $user->isGuest()) {
            return redirect()->route($this->oauth->marsrut($davam));
        }

        /* Cookie dərhal verilsin ki, ziyarətçi başqa səhifəyə keçəndə
           eyni sətrə düşsün. */
        \App\Http\Middleware\IdentifyVisitor::issueCookie(
            $this->accounts->ensureGuestToken($user)
        );

        if ($davam === 'is') {
            $this->profiles->ensure($user);
        }

        return redirect()->route($this->oauth->marsrut($davam))
            ->with('status', 'Qonaq kimi davam edirsiniz — adınız ' . $user->displayName()
                . '. Nəticələriniz bu brauzerdə saxlanılır; istənilən vaxt hesab aça bilərsiniz.');
    }
}
