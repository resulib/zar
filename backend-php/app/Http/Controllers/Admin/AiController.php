<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\AiService;
use App\Support\Ai\TemplateBrief;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Throwable;

/**
 * Şablon formasının AI köməkçisi.
 *
 * Cavab HEÇ NƏ YAZMIR — sadəcə formanın sahələrini doldurmaq üçün dəyər
 * qaytarır. Şablon yalnız admin «Yadda saxla» düyməsinə basanda dəyişir və
 * o zaman `CatalogController::templateSave()` bütün yoxlamalardan keçirir.
 * Beləliklə AI kataloqa birbaşa yazmır — bu, qəsdən belədir.
 */
class AiController extends Controller
{
    public function draft(Request $request, AiService $ai): JsonResponse
    {
        $data = $request->validate([
            'brief'       => ['required', 'string', 'max:800'],
            'mode'        => ['required', Rule::in(TemplateBrief::MODES)],
            'category_id' => ['nullable', 'integer'],
            'template_id' => ['nullable', 'integer'],
            'layout'      => ['nullable', Rule::in(config('zarafat.layouts'))],
            /* `variant` rejimi üçün mövcud mətn — modelə kontekst kimi gedir. */
            'title'       => ['nullable', 'string', 'max:200'],
            'powers'      => ['nullable', 'string', 'max:1200'],
            'penalty'     => ['nullable', 'string', 'max:600'],
        ], [], ['brief' => 'tapşırıq', 'mode' => 'rejim']);

        try {
            $out = $ai->draft($data);
        } catch (Throwable $e) {
            return response()->json(['ok' => false, 'error' => $e->getMessage()], 422);
        }

        return response()->json([
            'ok'       => true,
            'values'   => $out['values'],
            'warnings' => $out['warnings'],
            'model'    => $out['model'],
            /* Model bir parametri tanımayıb — admin bilsin ki, keyfiyyət
               fərqli ola bilər (məsələn `temperature` atılıb). */
            'dropped'  => $out['dropped'],
            'usage'    => [
                'in'  => (int) ($out['usage']['prompt_tokens'] ?? 0),
                'out' => (int) ($out['usage']['completion_tokens'] ?? 0),
            ],
        ]);
    }
}
