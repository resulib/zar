<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Services\AiService;
use App\Services\PaymentService;
use App\Support\Moderation;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function edit(PaymentService $payments, AiService $ai): View
    {
        $words = Setting::get('banned_words', (string) config('zarafat.banned_words')) ?? '';

        return view('admin.settings', [
            'bannedWords' => $words,
            'wordCount'   => count((new Moderation($words))->words()),
            'provider'    => $payments->provider()->name(),
            'simulation'  => $payments->simulationAllowed(),
            'packs'       => $payments->packs()->all(),
            'publicUrl'   => config('zarafat.public_url'),
            /* AI köməkçisi: açar `.env`-dədir və yalnız maskalanmış göstərilir,
               model isə buradan dəyişilir. */
            'aiEnabled'   => $ai->enabled(),
            'aiModel'     => $ai->model(),
            'aiKeyHint'   => $ai->keyHint(),
            'aiSuggested' => (array) config('ai.suggested'),
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

    /**
     * AI modelinin adı. İcazə siyahısı yoxdur — yalnız format yoxlanılır ki,
     * OpenAI yeni model buraxanda kodu dəyişmək lazım gəlməsin.
     */
    public function updateAi(Request $request): RedirectResponse
    {
        $model = trim((string) $request->input('ai_model', ''));

        if ($model !== '' && ! AiService::validModel($model)) {
            return back()->withErrors([
                'ai_model' => 'Model adı yalnız hərf, rəqəm, nöqtə, defis və iki nöqtədən ibarət ola bilər (2–60 simvol).',
            ])->withInput();
        }

        Setting::put('ai_model', $model);

        return back()->with('status', $model === ''
            ? 'Model sıfırlandı — `.env` faylındakı dəyər işlənəcək.'
            : "AI modeli «{$model}» olaraq təyin edildi.");
    }
}
