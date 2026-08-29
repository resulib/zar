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
        /* `provider()` yanlış konfiqurasiyada istisna atır (məs. istehsalatda
           simulyasiya, yaxud açarsız Epoint). Health endpoint-i buna görə
           yıxılmamalıdır — frontend yalnız «server var» siqnalını gözləyir. */
        try {
            $provider = $payments->provider()->name();
            $ready    = true;
        } catch (\Throwable $e) {
            report($e);
            $provider = (string) config('zarafat.payment.provider');
            $ready    = false;
        }

        return response()->json([
            'ok'            => true,
            'provider'      => $provider,
            'paymentsReady' => $ready,
            'time'          => now()->getTimestampMs(),
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
        /* `replyTo` olmadan `toApiArray()` hər cavab sənədi üçün ayrıca sorğu
           açardı — 60 sətirlik siyahıda bu N+1-dir. */
        $docs = $request->visitor()
            ->documents()
            ->visible()
            ->with('replyTo:id,reg_no,title')
            ->withCount(['replies' => fn ($q) => $q->published()])
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
