<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\PaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SessionController extends Controller
{
    public function health(PaymentService $payments): JsonResponse
    {
        return response()->json([
            'ok'       => true,
            'provider' => $payments->provider()->name(),
            'time'     => now()->getTimestampMs(),
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->visitor();

        return response()->json([
            'userId'  => $user->uuid,
            'credits' => $user->credits,
            'guest'   => $user->isGuest(),
            'name'    => $user->name,
        ]);
    }

    public function documents(Request $request): JsonResponse
    {
        $docs = $request->visitor()
            ->documents()
            ->visible()
            ->latest()
            ->limit(60)
            ->get()
            ->map(fn ($d) => $d->toApiArray(withOwner: true));

        return response()->json($docs);
    }

    public function packs(PaymentService $payments): JsonResponse
    {
        return response()->json($payments->packs()->all());
    }
}
