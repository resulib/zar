<?php

declare(strict_types=1);

namespace App\Support\Payments;

/**
 * Test provayderi: real kart əməliyyatı yoxdur, sifariş dərhal ödənilmiş sayılır.
 * İstehsalatda ALLOW_SIMULATED_PAYMENTS=false ilə söndürülür.
 */
final class SimulationProvider implements PaymentProvider
{
    public function name(): string
    {
        return 'simulation';
    }

    public function createOrder(array $order): array
    {
        return [
            'redirectUrl' => $order['urls']['success'] . '&order=' . urlencode($order['orderId']),
            'providerRef' => 'SIM-' . $order['orderId'],
            'autoPaid'    => true,
        ];
    }

    public function parseCallback(array $payload): array
    {
        $orderId = (string) ($payload['order_id'] ?? '');
        if ($orderId === '') {
            throw new \RuntimeException('order_id yoxdur');
        }

        return [
            'orderId'     => $orderId,
            'status'      => ($payload['status'] ?? '') === 'success' ? 'paid' : 'failed',
            'providerRef' => isset($payload['provider_ref']) ? (string) $payload['provider_ref'] : null,
            'raw'         => $payload,
        ];
    }
}
