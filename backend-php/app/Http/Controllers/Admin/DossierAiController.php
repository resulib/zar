<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Dossier;
use App\Services\DossierAiService;
use App\Support\Ai\QovluqBrief;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Throwable;

/**
 * «AI ilə iş qur» — iki mərhələli uc nöqtə.
 *
 * Şablon köməkçisindən (`AiController`) fərqli olaraq bu, bazaya YAZIR:
 * nəticə 25-30 vərəqdir və formaya sığmır. Yazılan sətir QARALAMADIR —
 * oyunçuya görünmür — və dərc etmə `QovluqYoxlayici`-dən keçir, yəni AI-nin
 * çıxışı əl işi ilə eyni qapıdan keçir.
 *
 * Hər çağırış BİR OpenAI sorğusudur: altısını bir HTTP sorğusuna yığmaq vaxt
 * aşımı deməkdir. Gedişi brauzer idarə edir və göstərir.
 */
class DossierAiController extends Controller
{
    /** Birinci mərhələ — hekayə, şübhəlilər, suallar və vərəqlərin planı. */
    public function skelet(Request $request, DossierAiService $ai): JsonResponse
    {
        $data = $request->validate([
            'brief'      => ['required', 'string', 'max:1200'],
            'count'      => ['required', 'integer', 'min:' . QovluqBrief::SENED_MIN, 'max:' . QovluqBrief::SENED_MAX],
            'difficulty' => ['required', Rule::in(config('dossier.difficulties'))],
        ], [], ['brief' => 'tapşırıq', 'count' => 'vərəq sayı', 'difficulty' => 'çətinlik']);

        try {
            $dossier = $ai->skelet($data);
        } catch (Throwable $e) {
            /* Xəta LOGA da düşür: brauzerdə yalnız bir sətir görünür və
               modelin nə qaytardığını sonradan araşdırmaq mümkün olmalıdır. */
            Log::warning('qovluq-ai: skelet alınmadı', ['sebeb' => $e->getMessage()]);

            return response()->json(['ok' => false, 'message' => $e->getMessage()], 422);
        }

        return response()->json([
            'ok'       => true,
            'id'       => (int) $dossier->id,
            'slug'     => (string) $dossier->slug,
            'title'    => (string) $dossier->title,
            'total'    => $dossier->documents()->count(),
            'problems' => (array) $dossier->getAttribute('ai_problems'),
            'url'      => route('admin.dossier.form', $dossier),
        ]);
    }

    /** İkinci mərhələ — növbəti partiya vərəqin mətni. */
    public function senedler(Request $request, Dossier $dossier, DossierAiService $ai): JsonResponse
    {
        /* Yalnız QARALAMA doldurula bilər: dərc olunmuş işin vərəqlərini
           model üzərinə yazsaydı, oyunçu oxuduğu mətni ortada dəyişmiş
           görərdi. */
        if ($dossier->status === Dossier::STATUS_PUBLISHED) {
            return response()->json(['ok' => false, 'message' => 'Dərc olunmuş işi AI doldurmur.'], 422);
        }

        try {
            $res = $ai->partiya($dossier);
        } catch (Throwable $e) {
            Log::warning('qovluq-ai: partiya alınmadı', [
                'qovluq' => $dossier->slug, 'sebeb' => $e->getMessage(),
            ]);

            return response()->json(['ok' => false, 'message' => $e->getMessage()], 422);
        }

        return response()->json(['ok' => true] + $res);
    }
}
