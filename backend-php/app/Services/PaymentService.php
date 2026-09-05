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

        // Simulyasiya provayderi sifarişi dərhal «ödənilmiş» sayır. İstehsalatda
        // bu, /api/payments/checkout vasitəsilə limitsiz pulsuz kredit deməkdir —
        // ona görə orada ümumiyyətlə qurulmur.
        if ($name !== 'epoint' && app()->environment('production')) {
            throw new \RuntimeException(
                'İstehsalatda simulyasiya provayderi işlədilə bilməz — PAYMENT_PROVIDER=epoint təyin edin.'
            );
        }

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

    /**
     * Test ödənişi balansa pulsuz kredit yazır. İstehsalatda `.env`-də səhvən
     * açıq qalsa belə işləməməlidir — ona görə mühit ayrıca yoxlanılır.
     */
    public function simulationAllowed(): bool
    {
        if (app()->environment('production')) {
            return false;
        }

        return (bool) config('zarafat.payment.allow_simulation');
    }

    /**
     * Sifariş yaradır. Simulyasiya provayderində ödəniş dərhal tətbiq olunur.
     *
     * `$o` HANSI MƏHSULUN SATDIĞINI BİLDİRİR. Kredit hər iki bölmədə
     * işlənir, ödəniş səhifəsi və qayıdış ünvanı isə ALICININ olduğu
     * bölməyə aid olmalıdır: iş qovluğu oynayan adam bank səhifəsində
     * digər məhsulun adını görməməli və ödənişdən sonra onun kabinetinə
     * düşməməlidir (bölmə bağlı ola bilər — o zaman 404 olardı).
     *
     * @param  array{description?:string,success?:string,error?:string}  $o
     * @return array{payment:Payment,redirectUrl:string,autoPaid:bool}
     */
    public function checkout(User $user, string $packId, array $o = []): array
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
                'description' => (string) ($o['description'] ?? 'Zarafat.az — ' . $pack['label']),
                'urls'        => [
                    'success'  => (string) ($o['success'] ?? $base . '/?payment=success'),
                    'error'    => (string) ($o['error'] ?? $base . '/?payment=error'),
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
    public function markPaid(string $orderId, ?string $providerRef, array $raw = [], ?float $amount = null): ?Payment
    {
        return DB::transaction(function () use ($orderId, $providerRef, $raw, $amount): ?Payment {
            /** @var Payment|null $payment */
            $payment = Payment::query()->where('order_id', $orderId)->lockForUpdate()->first();

            if (! $payment || $payment->status !== Payment::STATUS_PENDING) {
                return null;                      // artıq işlənib və ya tapılmadı
            }

            /* Provayder məbləğ bildirirsə, sifarişin məbləği ilə üst-üstə düşməlidir.
               İmza onsuz da yoxlanılıb — bu, provayder tərəfdəki səhvə və ya
               dəyişdirilmiş sifarişə qarşı ikinci qatdır. */
            if ($amount !== null && abs($amount - (float) $payment->amount) > 0.001) {
                logger()->warning('Ödəniş məbləği uyğun gəlmir', [
                    'order_id' => $orderId,
                    'gözlənilən' => (float) $payment->amount,
                    'gələn'      => $amount,
                ]);

                $payment->forceFill([
                    'status'  => Payment::STATUS_FAILED,
                    'payload' => $raw ?: null,
                ])->save();

                return null;
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
