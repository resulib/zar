<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\User;
use App\Services\CreditService;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function __construct(private readonly CreditService $credits)
    {
    }

    public function index(Request $request): View
    {
        $q = User::query()
            ->withCount(['documents as documents_count' => fn ($d) => $d->where('status', '!=', 'removed')])
            ->withSum(['payments as paid_sum' => fn ($p) => $p->where('status', Payment::STATUS_PAID)], 'amount')
            ->latest();

        if ($search = trim((string) $request->query('q'))) {
            $q->where(function ($sub) use ($search) {
                $sub->where('email', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%")
                    ->orWhere('uuid', 'like', "%{$search}%");
            });
        }

        if ($request->query('type') === 'registered') {
            $q->whereNotNull('email');
        } elseif ($request->query('type') === 'guest') {
            $q->whereNull('email');
        }

        return view('admin.users', [
            'users'   => $q->paginate(30)->withQueryString(),
            'filters' => ['q' => $request->query('q', ''), 'type' => $request->query('type', '')],
        ]);
    }

    public function show(string $uuid): View
    {
        $user = User::query()->where('uuid', $uuid)->firstOrFail();

        return view('admin.user', [
            'user'         => $user,
            'documents'    => $user->documents()->latest()->limit(20)->get(),
            'transactions' => $user->transactions()->latest()->limit(20)->get(),
            'payments'     => $user->payments()->latest()->limit(20)->get(),
        ]);
    }

    public function grant(Request $request, string $uuid): RedirectResponse
    {
        $data = $request->validate([
            'credits' => ['required', 'integer', 'min:1', 'max:500'],
            'note'    => ['nullable', 'string', 'max:160'],
        ]);

        $user = User::query()->where('uuid', $uuid)->firstOrFail();
        $this->credits->grant($user, (int) $data['credits'], $data['note'] ?? 'Admin tərəfindən verildi');

        return back()->with('status', $data['credits'] . ' kredit əlavə edildi.');
    }

    public function toggleBlock(string $uuid): RedirectResponse
    {
        $user = User::query()->where('uuid', $uuid)->firstOrFail();
        $user->forceFill(['is_blocked' => ! $user->is_blocked])->save();

        return back()->with('status', $user->is_blocked ? 'Hesab bloklandı.' : 'Blok götürüldü.');
    }
}
