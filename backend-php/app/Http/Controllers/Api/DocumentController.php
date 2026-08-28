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
            'preamble'     => ['nullable', 'string', 'max:2000'],
            'templateId'   => ['nullable', 'string', 'max:40'],
            'layout'       => ['nullable', 'string', 'max:20'],
            'palette'      => ['nullable', 'string', 'max:20'],
            'tone'         => ['nullable', 'string', 'max:10'],
            'toLabel'      => ['nullable', 'string', 'max:40'],
            'fromLabel'    => ['nullable', 'string', 'max:40'],
            'powersLabel'  => ['nullable', 'string', 'max:40'],
            'penaltyLabel' => ['nullable', 'string', 'max:40'],
        ]);

        $moderation = new Moderation(
            Setting::get('banned_words', (string) config('zarafat.banned_words')) ?? ''
        );

        $flagged = $moderation->flagged(
            $data['title'], $data['to'], $data['from'],
            $data['powers'] ?? '', $data['penalty'] ?? ''
        );

        if ($flagged) {
            return response()->json([
                'error'   => 'moderation',
                'message' => 'Mətndə qadağan olunmuş ifadə var.',
            ], 422);
        }

        $document = $this->documents->create($user, $data);

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
}
