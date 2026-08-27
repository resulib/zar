<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    public const STATUS_PENDING  = 'pending';
    public const STATUS_PAID     = 'paid';
    public const STATUS_FAILED   = 'failed';
    public const STATUS_REFUNDED = 'refunded';

    protected $fillable = [
        'order_id', 'user_id', 'provider', 'pack_id', 'amount', 'currency',
        'credits', 'status', 'provider_ref', 'payload', 'paid_at',
    ];

    protected function casts(): array
    {
        return [
            'payload' => 'array',
            'amount'  => 'decimal:2',
            'credits' => 'integer',
            'paid_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function statusLabel(): string
    {
        return match ($this->status) {
            self::STATUS_PAID     => 'Ödənilib',
            self::STATUS_PENDING  => 'Gözləyir',
            self::STATUS_FAILED   => 'Uğursuz',
            self::STATUS_REFUNDED => 'Geri qaytarılıb',
            default               => $this->status,
        };
    }
}
