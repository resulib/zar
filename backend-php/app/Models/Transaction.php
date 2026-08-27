<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    public const TYPE_TOPUP  = 'topup';
    public const TYPE_SPEND  = 'spend';
    public const TYPE_REFUND = 'refund';
    public const TYPE_GRANT  = 'grant';

    protected $fillable = [
        'user_id', 'type', 'credits', 'balance_after',
        'payment_id', 'document_id', 'note',
    ];

    protected function casts(): array
    {
        return [
            'credits'       => 'integer',
            'balance_after' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function payment(): BelongsTo
    {
        return $this->belongsTo(Payment::class);
    }

    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class);
    }

    public function typeLabel(): string
    {
        return match ($this->type) {
            self::TYPE_TOPUP  => 'Balans artımı',
            self::TYPE_SPEND  => 'Sənəd rəsmiləşdirilməsi',
            self::TYPE_REFUND => 'Geri qaytarma',
            self::TYPE_GRANT  => 'Admin tərəfindən verilib',
            default           => $this->type,
        };
    }
}
