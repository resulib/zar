<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Services\PaymentService;
use App\Support\Moderation;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function edit(PaymentService $payments): View
    {
        $words = Setting::get('banned_words', (string) config('zarafat.banned_words')) ?? '';

        return view('admin.settings', [
            'bannedWords' => $words,
            'wordCount'   => count((new Moderation($words))->words()),
            'provider'    => $payments->provider()->name(),
            'simulation'  => $payments->simulationAllowed(),
            'packs'       => $payments->packs()->all(),
            'publicUrl'   => config('zarafat.public_url'),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'banned_words' => ['nullable', 'string', 'max:4000'],
        ]);

        Setting::put('banned_words', $data['banned_words'] ?? '');

        return back()->with('status', 'Moderasiya siyahısı yeniləndi.');
    }
}
