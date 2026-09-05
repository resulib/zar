<?php

declare(strict_types=1);

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Services\AccountService;
use App\Services\OAuthService;
use App\Services\ProfileService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;
use Illuminate\Validation\Rule;

/**
 * Bölmənin öz qeydiyyat ekranı.
 *
 * SƏBƏB: qeydiyyat yalnız `/kabinet`-dədir və o, saytın DİGƏR məhsuludur.
 * Ora link vermək iki bölmə arasındakı fiziki ayrılığı pozardı — indiyə
 * qədər onların bir-birinə nə linki var, nə də adı. Eyni problem
 * dəvətnamə bölməsində də həll olunub (`DevetAccountController`).
 *
 * AUTENTİFİKASİYA MƏNTİQİ TƏKRARLANMIR: bu kontroller eyni
 * `AccountService`-i çağırır, ona görə qeydiyyat, giriş və qonaq
 * birləşdirilməsi hər iki bölmədə tam eynidir və yeni təhlükəsizlik səthi
 * yaranmır.
 */
class DossierAccountController extends Controller
{
    public function __construct(
        private readonly AccountService $accounts,
        private readonly ProfileService $profiles,
        private readonly OAuthService $oauth,
    ) {
    }

    /* Qonağa GÖRÜNÜŞ, hesablıya YÖNLƏNDİRMƏ qaytarır — ikisinin ortaq
       atası Symfony Response-dur. `Illuminate\Http\Response` yazılsa
       (əvvəl belə idi) hesablı ziyarətçi bu ünvana girəndə 500 alır:
       `RedirectResponse` ondan törəmir. */
    public function show(Request $request): SymfonyResponse
    {
        $user = $request->visitor();

        if (! $user->isGuest()) {
            return redirect()->route('dossier.profil');
        }

        /* Qonağın nə qazandığı GÖSTƏRİLİR: «nəyi itirəcəksən» sualının
           cavabı qeydiyyat üçün ən güclü arqumentdir. */
        $p = $this->profiles->find($user);

        return $this->noindex(response()->view('dossier.hesab', [
            'profile' => $p,
            'xp'      => (int) ($p->xp ?? 0),
            'isler'   => (int) ($p->cases_solved ?? 0),
            'google'  => $this->oauth->hazir(),
            'ad'      => $user->displayName(),
        ]));
    }

    public function register(Request $request): RedirectResponse
    {
        $guest = $request->visitor();

        if (! $guest->isGuest()) {
            return redirect()->route('dossier.profil');
        }

        $data = $request->validate([
            'name'     => ['required', 'string', 'max:60'],
            'email'    => ['required', 'email', 'max:120', Rule::unique('users', 'email')],
            'password' => ['required', 'string', 'min:8', 'max:100', 'confirmed'],
        ], [], [
            'name'     => 'ad',
            'email'    => 'e-poçt',
            'password' => 'parol',
        ]);

        $user = $this->accounts->register($guest, $data['name'], $data['email'], $data['password']);

        Auth::login($user, remember: true);
        $request->session()->regenerate();

        /* Profil qonaq ikən yaranmışdısa, sətir YERİNDƏ hesaba çevrildiyi
           üçün XP olduğu kimi qalır — heç nə köçürülmür. */
        $p = $this->profiles->ensure($user);
        $p->forceFill(['is_public' => true])->save();

        return redirect()->route('dossier.profil')
            ->with('status', 'Hesab yaradıldı. İndi şöbə seçin — vəsiqəniz veriləcək.');
    }

    public function login(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $guest = $request->visitor();

        if (! Auth::attempt($data, remember: true)) {
            return back()->withErrors(['email' => 'E-poçt və ya parol yanlışdır.'])->onlyInput('email');
        }

        $request->session()->regenerate();
        $account = Auth::user();

        /* Başqa cihazdan giriş: qonaq sessiyasındakı işlər hesaba keçir və
           XP yenidən hesablanır (`AccountService::moveInvestigatorProfile`). */
        if ($guest->isGuest() && $account !== null) {
            $this->accounts->mergeGuestInto($guest, $account);
        }

        return redirect()->route('dossier.profil')->with('status', 'Xoş gəldiniz.');
    }

    public function logout(Request $request): RedirectResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('dossier.index');
    }

    protected function noindex(Response $response): Response
    {
        return $response->header('X-Robots-Tag', 'noindex, nofollow, noarchive');
    }
}
