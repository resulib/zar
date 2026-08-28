<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Models\Setting;
use App\Services\DocumentService;
use App\Support\Moderation;
use App\Support\RegistryNumber;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DocumentController extends Controller
{
    public function __construct(private readonly DocumentService $documents)
    {
    }

    public function store(Request $request): JsonResponse
    {
        $user = $request->visitor();

        if ($user->is_blocked) {
            return response()->json(['error' => 'blocked', 'message' => 'Hesab məhdudlaşdırılıb.'], 403);
        }

        $data = $request->validate([
            'title'        => ['required', 'string', 'max:120'],
            'to'           => ['required', 'string', 'max:60'],
            'from'         => ['required', 'string', 'max:60'],
            'powers'       => ['nullable', 'string', 'max:2000'],
            'penalty'      => ['nullable', 'string', 'max:1000'],
            /* `preamble` QƏBUL OLUNMUR: `validate()` yalnız sadalanan açarları
               qaytarır, deməli saxta preamble `$data`-ya heç çatmır. Sənədin
               ən böyük abzasını server şablondan özü qurur. */
            'templateId'   => ['required', 'string', 'max:40'],
            'layout'       => ['nullable', 'string', 'max:20'],
            'palette'      => ['nullable', 'string', 'max:20'],
            'tone'         => ['nullable', 'string', 'max:10'],
            'toLabel'      => ['nullable', 'string', 'max:40'],
            'fromLabel'    => ['nullable', 'string', 'max:40'],
            'powersLabel'  => ['nullable', 'string', 'max:40'],
            'penaltyLabel' => ['nullable', 'string', 'max:40'],

            /* Anket cavabları. Hamısı `nullable` — anketi olmayan şablonlar
               (və tests/security.php-in minimal sorğusu) toxunulmaz qalır. */
            'data'         => ['nullable', 'array', 'max:14'],
            'data.*'       => ['array', 'size:2'],
            'data.*.*'     => ['nullable', 'string', 'max:80'],
            'checks'       => ['nullable', 'array', 'max:6'],
            'checks.*'     => ['string', 'max:100'],
            'notes'        => ['nullable', 'array', 'max:8'],
            'notes.*'      => ['string', 'max:180'],
            'scale'        => ['nullable', 'array'],
            'scale.label'  => ['nullable', 'string', 'max:40'],
            'scale.v'      => ['nullable', 'integer', 'min:0', 'max:10'],
            'scale.max'    => ['nullable', 'integer', 'min:1', 'max:10'],
            'until'        => ['nullable', 'string', 'max:24'],
            'share'        => ['nullable', 'string', 'max:180'],
            'expiresAt'    => ['nullable', 'integer'],

            /* Anket cavabları — preamble-ın `{{açar}}` yer tutucuları serverdə
               bunlardan doldurulur. Tipini `App\Support\Answers` təyin edir. */
            'answers'      => ['nullable', 'array', 'max:14'],
            'answers.*'    => ['nullable'],
            'answers.*.*'  => ['nullable', 'string', 'max:100'],
        ]);

        $moderation = new Moderation(
            Setting::get('banned_words', (string) config('zarafat.banned_words')) ?? ''
        );

        /* Anket cavabları da istifadəçi mətnidir və SVG-yə düşür — süzgəcdən
           kənarda qalsalar, qadağan olunmuş söz filtri yeni forma ilə keçilərdi. */
        $flat = [];
        foreach ($data['data'] ?? [] as $row) {
            $flat[] = implode(' ', array_map(static fn ($v): string => (string) $v, (array) $row));
        }

        /* Anket cavabları da istifadəçi mətnidir (sərbəst `select` və `text`
           sahələri) və sənədə düşür. `preamble` siyahıda yoxdur — o artıq
           admin mətnidir. `title`/`powers`/`penalty` atılsalar da klient
           sətirləridir; süzgəcdən keçirmək heç nəyə başa gəlmir. */
        $ans     = [];
        $answers = $data['answers'] ?? [];
        array_walk_recursive($answers, static function ($v) use (&$ans): void {
            if (is_scalar($v)) {
                $ans[] = (string) $v;
            }
        });

        $flagged = $moderation->flagged(
            $data['title'], $data['to'], $data['from'],
            $data['powers'] ?? '', $data['penalty'] ?? '',
            implode(' ', $ans),
            implode(' ', $flat),
            implode(' ', $data['checks'] ?? []),
            implode(' ', $data['notes'] ?? []),
            (string) ($data['share'] ?? '')
        );

        if ($flagged) {
            return response()->json([
                'error'   => 'moderation',
                'message' => 'Mətndə qadağan olunmuş ifadə var.',
            ], 422);
        }

        try {
            $document = $this->documents->create($user, $data);
        } catch (\RuntimeException $e) {
            return response()->json([
                'error'   => 'bad_template',
                'message' => 'Şablon tapılmadı — səhifəni yeniləyib yenidən cəhd edin.',
            ], 422);
        }

        return response()->json($document->toApiArray(withOwner: true));
    }

    public function publish(Request $request, string $regNo): JsonResponse
    {
        if ($request->visitor()->is_blocked) {
            return response()->json(['error' => 'blocked', 'message' => 'Hesab məhdudlaşdırılıb.'], 403);
        }

        $regNo = strtoupper($regNo);

        if (! RegistryNumber::isValid($regNo)) {
            return response()->json(['error' => 'bad_reg_no'], 400);
        }

        $document = Document::query()->where('reg_no', $regNo)->first();

        if (! $document) {
            return response()->json(['error' => 'not_found', 'message' => 'Sənəd tapılmadı.'], 404);
        }

        try {
            $document = $this->documents->publish($request->visitor(), $document);
        } catch (\RuntimeException $e) {
            [$code, $message] = match ($e->getMessage()) {
                'no_credits' => [402, 'Balans kifayət etmir.'],
                'forbidden'  => [403, 'Bu sənəd sizə aid deyil.'],
                'removed'    => [410, 'Sənəd silinib.'],
                default      => [500, 'Xəta baş verdi.'],
            };

            return response()->json(['error' => $e->getMessage(), 'message' => $message], $code);
        }

        return response()->json($document->toApiArray(withOwner: true));
    }

    /** Dərc olunmuş sənədi ləğv edir — sahibi üçün ikinci paylaşım anı. */
    public function cancel(Request $request, string $regNo): JsonResponse
    {
        if ($request->visitor()->is_blocked) {
            return response()->json(['error' => 'blocked', 'message' => 'Hesab məhdudlaşdırılıb.'], 403);
        }

        $regNo = strtoupper($regNo);

        if (! RegistryNumber::isValid($regNo)) {
            return response()->json(['error' => 'bad_reg_no'], 400);
        }

        $document = Document::query()->where('reg_no', $regNo)->first();

        if (! $document) {
            return response()->json(['error' => 'not_found', 'message' => 'Sənəd tapılmadı.'], 404);
        }

        $reason = $request->validate([
            'reason' => ['nullable', 'string', 'max:60'],
        ])['reason'] ?? null;

        try {
            $document = $this->documents->cancel($request->visitor(), $document, $reason);
        } catch (\RuntimeException $e) {
            [$code, $message] = match ($e->getMessage()) {
                'forbidden'     => [403, 'Bu sənəd sizə aid deyil.'],
                'removed'       => [410, 'Sənəd silinib.'],
                'not_published' => [409, 'Sənəd hələ reyestrə yazılmayıb.'],
                default         => [500, 'Xəta baş verdi.'],
            };

            return response()->json(['error' => $e->getMessage(), 'message' => $message], $code);
        }

        return response()->json($document->toApiArray(withOwner: true));
    }
}
