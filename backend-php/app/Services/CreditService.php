<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Document;
use App\Models\Payment;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Support\Facades\DB;

/**
 * Kredit balansı və onun tarixçəsi.
 * Balans `users.credits` sütununda saxlanılır, hər dəyişiklik `transactions`-a yazılır —
 * beləliklə kabinetdə və admin paneldə tam tarixçə görünür.
 */
class CreditService
{
    public function topUp(User $user, int $credits, ?Payment $payment = null, ?string $note = null): Transaction
    {
        return $this->apply($user, Transaction::TYPE_TOPUP, abs($credits), [
            'payment_id' => $payment?->id,
            'note'       => $note ?? ($payment ? 'Sifariş ' . $payment->order_id : null),
        ]);
    }

    public function grant(User $user, int $credits, ?string $note = null): Transaction
    {
        return $this->apply($user, Transaction::TYPE_GRANT, abs($credits), ['note' => $note]);
    }

    public function refund(User $user, int $credits, ?Payment $payment = null, ?string $note = null): Transaction
    {
        return $this->apply($user, Transaction::TYPE_REFUND, abs($credits), [
            'payment_id' => $payment?->id,
            'note'       => $note,
        ]);
    }

    /** @throws \RuntimeException balans kifayət etmədikdə */
    public function spend(User $user, int $credits, ?Document $document = null, ?string $note = null): Transaction
    {
        return $this->apply($user, Transaction::TYPE_SPEND, -abs($credits), [
            'document_id' => $document?->id,
            'note'        => $note ?? ($document ? 'Sənəd ' . $document->reg_no : null),
        ]);
    }

    /**
     * Bütün hərəkətlər eyni yoldan keçir: sətir kilidlənir, balans yenilənir,
     * tranzaksiya yazılır. Beləliklə paralel sorğularda balans pozulmur.
     */
    protected function apply(User $user, string $type, int $delta, array $extra = []): Transaction
    {
        return DB::transaction(function () use ($user, $type, $delta, $extra): Transaction {
            /** @var User $locked */
            $locked = User::query()->whereKey($user->getKey())->lockForUpdate()->firstOrFail();

            $balance = $locked->credits + $delta;
            if ($balance < 0) {
                throw new \RuntimeException('no_credits');
            }

            $locked->credits = $balance;
            $locked->save();

            $tx = Transaction::create(array_merge([
                'user_id'       => $locked->id,
                'type'          => $type,
                'credits'       => $delta,
                'balance_after' => $balance,
            ], $extra));

            // Çağıran tərəfdəki obyekt də yenilənsin
            $user->credits = $balance;
            $user->syncOriginalAttribute('credits');

            return $tx;
        });
    }
}
