<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Payment;
use App\Models\User;
use App\Support\Packs;
use App\Support\Payments\EpointProvider;
use App\Support\Payments\PaymentProvider;
use App\Support\Payments\SimulationProvider;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PaymentService
{
    public function __construct(private readonly CreditService $credits)
    {
    }

    public function packs(): Packs
    {
        return new Packs(config('zarafat.packs'));
    }

    public function provider(): PaymentProvider
    {
        $name = strtolower((string) config('zarafat.payment.provider'));

        if ($name === 'epoint') {
            $cfg = config('zarafat.payment.epoint');

            if (empty($cfg['public_key']) || empty($cfg['private_key'])) {
                throw new \RuntimeException('EPOINT_PUBLIC_KEY / EPOINT_PRIVATE_KEY təyin edilməyib.');
            }

            return new EpointProvider(
                (string) $cfg['public_key'],
                (string) $cfg['private_key'],
                (string) ($cfg['endpoint'] ?? 'https://epoint.az/api/1/request'),
            );
        }

        return new SimulationProvider();
    }

    public function simulationAllowed(): bool
    {
        return (bool) config('zarafat.payment.allow_simulation');
    }

    /**
     * Sifariş yaradır. Simulyasiya provayderində ödəniş dərhal tətbiq olunur.
     *
     * @return array{payment:Payment,redirectUrl:string,autoPaid:bool}
     */
    public function checkout(User $user, string $packId): array
    {
        $pack     = $this->packs()->get($packId);
        $provider = $this->provider();
        $base     = rtrim((string) config('zarafat.public_url'), '/');

        $payment = Payment::create([
            'order_id' => $this->newOrderId(),
            'user_id'  => $user->id,
            'provider' => $provider->name(),
            'pack_id'  => $pack['id'],
            'amount'   => $pack['amount'],
            'currency' => (string) config('zarafat.payment.currency'),
            'credits'  => $pack['credits'],
            'status'   => Payment::STATUS_PENDING,
        ]);

        try {
            $result = $provider->createOrder([
                'orderId'     => $payment->order_id,
                'amount'      => (float) $pack['amount'],
                'currency'    => $payment->currency,
                'description' => 'Zarafat.az — ' . $pack['label'],
                'urls'        => [
                    'success'  => $base . '/?payment=success',
                    'error'    => $base . '/?payment=error',
                    'callback' => $base . '/api/payments/callback',
                ],
            ]);
        } catch (\Throwable $e) {
            $this->markFailed($payment->order_id, ['error' => $e->getMessage()]);
            throw $e;
        }

        if ($result['autoPaid']) {
            $this->markPaid($payment->order_id, $result['providerRef'], ['autoPaid' => true]);
            $payment->refresh();
        }

        return [
            'payment'     => $payment,
            'redirectUrl' => $result['redirectUrl'],
            'autoPaid'    => $result['autoPaid'],
        ];
    }

    /**
     * Ödənişi təsdiqləyir. İdempotentdir: eyni sifariş iki dəfə gəlsə də
     * kredit yalnız bir dəfə yazılır.
     */
    public function markPaid(string $orderId, ?string $providerRef, array $raw = []): ?Payment
    {
        return DB::transaction(function () use ($orderId, $providerRef, $raw): ?Payment {
            /** @var Payment|null $payment */
            $payment = Payment::query()->where('order_id', $orderId)->lockForUpdate()->first();

            if (! $payment || $payment->status !== Payment::STATUS_PENDING) {
                return null;                      // artıq işlənib və ya tapılmadı
            }

            $payment->forceFill([
                'status'       => Payment::STATUS_PAID,
                'provider_ref' => $providerRef,
                'payload'      => $raw ?: null,
                'paid_at'      => Carbon::now(),
            ])->save();

            $this->credits->topUp($payment->user, $payment->credits, $payment);

            return $payment;
        });
    }

    public function markFailed(string $orderId, array $raw = []): void
    {
        Payment::query()
            ->where('order_id', $orderId)
            ->where('status', Payment::STATUS_PENDING)
            ->update([
                'status'     => Payment::STATUS_FAILED,
                'payload'    => json_encode($raw, JSON_UNESCAPED_UNICODE),
                'updated_at' => Carbon::now(),
            ]);
    }

    protected function newOrderId(): string
    {
        return 'ZRF' . strtoupper(base_convert((string) time(), 10, 36) . Str::random(5));
    }
}
