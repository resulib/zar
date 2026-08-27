<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Support\RegistryNumber;
use Illuminate\Http\JsonResponse;

class RegistryController extends Controller
{
    public function show(string $regNo): JsonResponse
    {
        $regNo = strtoupper($regNo);

        if (! RegistryNumber::isValid($regNo)) {
            return response()->json(['error' => 'bad_reg_no'], 400);
        }

        $document = Document::query()->published()->where('reg_no', $regNo)->first();

        if (! $document) {
            return response()->json(['error' => 'not_found'], 404);
        }

        $document->increment('views');

        return response()->json($document->toApiArray());
    }
}
