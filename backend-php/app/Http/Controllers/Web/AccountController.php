<?php

declare(strict_types=1);

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\AccountService;
use App\Services\PaymentService;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

/**
 * İstifadəçi kabineti. Qonaq üçün də tam işləyir — giriş tələb olunmur.
 */
class AccountController extends Controller
{
    public function __construct(
        private readonly AccountService $accounts,
        private readonly PaymentService $payments,
    ) {
    }

    public function index(Request $request): View
    {
        $user = $request->visitor();

        return view('account.index', [
            'user'         => $user,
            'documents'    => $user->documents()->visible()->latest()->limit(12)->get(),
            'transactions' => $user->transactions()->latest()->limit(12)->get(),
            'payments'     => $user->payments()->latest()->limit(6)->get(),
            'docCount'     => $user->documents()->visible()->count(),
            'publishedCount' => $user->documents()->published()->count(),
            'spent'        => (float) $user->payments()->where('status', 'paid')->sum('amount'),
            'packs'        => $this->payments->packs()->all(),
        ]);
    }

    public function documents(Request $request): View
    {
        return view('account.documents', [
            'user'      => $request->visitor(),
            'documents' => $request->visitor()->documents()->visible()->latest()->paginate(20),
        ]);
    }

    public function transactions(Request $request): View
    {
        return view('account.transactions', [
            'user'         => $request->visitor(),
            'transactions' => $request->visitor()->transactions()->with('payment')->latest()->paginate(25),
        ]);
    }

    /* ------------------------------------------------------------------ */
    /*  Hesab                                                              */
    /* ------------------------------------------------------------------ */

    public function showAuth(Request $request): View
    {
        return view('account.auth', ['user' => $request->visitor()]);
    }

    public function register(Request $request): RedirectResponse
    {
        $guest = $request->visitor();

        if (! $guest->isGuest()) {
            return redirect()->route('account.index');
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

        return redirect()->route('account.index')
            ->with('status', 'Hesab yaradıldı. Balansınız və sənədləriniz olduğu kimi qaldı.');
    }

    public function login(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $guest = $request->visitor();

        if (! Auth::attempt(['email' => $data['email'], 'password' => $data['password']], remember: true)) {
            throw ValidationException::withMessages([
                'email' => 'E-poçt və ya parol yanlışdır.',
            ]);
        }

        /** @var User $account */
        $account = Auth::user();

        $moved = ['moved_documents' => 0, 'moved_credits' => 0];
        if ($guest->isGuest()) {
            $moved = $this->accounts->mergeGuestInto($guest, $account);
        }

        $request->session()->regenerate();

        $message = 'Xoş gəldiniz.';
        if ($moved['moved_documents'] > 0 || $moved['moved_credits'] > 0) {
            $message .= sprintf(
                ' Qonaq sessiyasından %d sənəd və %d kredit köçürüldü.',
                $moved['moved_documents'],
                $moved['moved_credits']
            );
        }

        return redirect()->route('account.index')->with('status', $message);
    }

    public function logout(Request $request): RedirectResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/')->with('status', 'Hesabdan çıxdınız.');
    }

    /* ------------------------------------------------------------------ */
    /*  Balans                                                             */
    /* ------------------------------------------------------------------ */

    public function topUp(Request $request): RedirectResponse
    {
        if ($request->visitor()->is_blocked) {
            return back()->withErrors(['pack' => 'Hesab məhdudlaşdırılıb.']);
        }

        $packId = (string) $request->input('pack');

        if (! $this->payments->packs()->has($packId)) {
            return back()->withErrors(['pack' => 'Naməlum paket.']);
        }

        try {
            $result = $this->payments->checkout($request->visitor(), $packId);
        } catch (\Throwable $e) {
            report($e);

            return back()->withErrors(['pack' => 'Ödəniş başladıla bilmədi. Bir azdan yenidən yoxlayın.']);
        }

        if ($result['autoPaid']) {
            return redirect()->route('account.index')
                ->with('status', 'Balans artırıldı (test ödənişi): +' . $result['payment']->credits . ' kredit.');
        }

        return redirect()->away($result['redirectUrl']);
    }
}
