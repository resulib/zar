<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\PaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function __construct(private readonly PaymentService $payments)
    {
    }

    /** Test ödənişi — istehsalatda ALLOW_SIMULATED_PAYMENTS=false ilə söndürülür. */
    public function simulate(Request $request): JsonResponse
    {
        if (! $this->payments->simulationAllowed()) {
            return response()->json(['error' => 'disabled', 'message' => 'Simulyasiya söndürülüb.'], 403);
        }

        $packId = (string) $request->input('packId');

        if (! $this->payments->packs()->has($packId)) {
            return response()->json(['error' => 'bad_pack'], 400);
        }

        $user   = $request->visitor();
        $result = $this->payments->checkout($user, $packId);

        return response()->json([
            'ok'        => true,
            'simulated' => true,
            'orderId'   => $result['payment']->order_id,
            'credits'   => $user->refresh()->credits,
        ]);
    }

    /** Real provayder üçün sifariş — cavabda ödəniş səhifəsinin ünvanı gəlir. */
    public function checkout(Request $request): JsonResponse
    {
        $packId = (string) $request->input('packId');

        if (! $this->payments->packs()->has($packId)) {
            return response()->json(['error' => 'bad_pack'], 400);
        }

        try {
            $result = $this->payments->checkout($request->visitor(), $packId);
        } catch (\Throwable $e) {
            report($e);

            return response()->json(['error' => 'provider_error'], 502);
        }

        return response()->json([
            'orderId'     => $result['payment']->order_id,
            'redirectUrl' => $result['redirectUrl'],
            'autoPaid'    => $result['autoPaid'],
        ]);
    }

    /** Provayder webhook-u. CSRF-dən azaddır, imza ilə qorunur. */
    public function callback(Request $request): JsonResponse
    {
        try {
            $parsed = $this->payments->provider()->parseCallback($request->all());
        } catch (\Throwable $e) {
            logger()->warning('Ödəniş callback rədd edildi', ['error' => $e->getMessage()]);

            return response()->json(['error' => 'bad_callback'], 400);
        }

        if ($parsed['orderId'] === '') {
            return response()->json(['error' => 'no_order'], 400);
        }

        if ($parsed['status'] === 'paid') {
            $this->payments->markPaid($parsed['orderId'], $parsed['providerRef'], $parsed['raw']);
        } else {
            $this->payments->markFailed($parsed['orderId'], $parsed['raw']);
        }

        return response()->json(['ok' => true]);
    }
}
