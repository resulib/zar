<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Support\RegistryNumber;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class RegistryController extends Controller
{
    public function show(Request $request, string $regNo): JsonResponse
    {
        $regNo = strtoupper($regNo);

        if (! RegistryNumber::isValid($regNo)) {
            return response()->json(['error' => 'bad_reg_no'], 400);
        }

        $document = Document::query()->published()->where('reg_no', $regNo)->first();

        if (! $document) {
            return response()->json(['error' => 'not_found'], 404);
        }

        self::countView($request, $document);

        return response()->json($document->toApiArray());
    }

    /**
     * Baxış sayğacı ziyarətçi başına saatda bir dəfə artır.
     * Əks halda sadə döngə ilə istənilən sənədin sayğacı şişirdilə bilər.
     */
    public static function countView(Request $request, Document $document): void
    {
        $who = $request->attributes->get('visitor');
        $key = 'view:' . $document->id . ':' . ($who?->id ?? 'ip:' . $request->ip());

        if (Cache::add($key, 1, now()->addHour())) {
            $document->increment('views');
        }
    }
}
