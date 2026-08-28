<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Models\Report;
use App\Services\DocumentService;
use App\Support\RegistryNumber;
use App\Support\Sanitizer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function __construct(private readonly DocumentService $documents)
    {
    }

    public function store(Request $request): JsonResponse
    {
        if ($request->visitor()->is_blocked) {
            return response()->json(['error' => 'blocked', 'message' => 'Hesab məhdudlaşdırılıb.'], 403);
        }

        $regNo = strtoupper((string) $request->input('regNo'));

        if (! RegistryNumber::isValid($regNo)) {
            return response()->json(['error' => 'bad_reg_no'], 400);
        }

        $document = Document::query()->where('reg_no', $regNo)->first();

        if (! $document) {
            return response()->json(['error' => 'not_found'], 404);
        }

        $user = $request->visitor();

        // Sahibi öz sənədini dərhal silir
        if ($document->user_id === $user->id) {
            $this->documents->remove($document);

            return response()->json(['deleted' => true]);
        }

        Report::create([
            'reg_no'      => $regNo,
            'document_id' => $document->id,
            'reporter_id' => $user->id,
            'reason'      => Sanitizer::text($request->input('reason'), 80) ?: null,
            'note'        => Sanitizer::text($request->input('note'), 400) ?: null,
            'status'      => Report::STATUS_OPEN,
        ]);

        return response()->json(['queued' => true]);
    }
}
