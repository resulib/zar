<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Cavab döngəsinin hadisə jurnalı.
 *
 * `updated_at` yoxdur — sətir yazıldıqdan sonra dəyişmir.
 */
class DocumentEvent extends Model
{
    public const UPDATED_AT = null;

    /** Klientdən qəbul edilən hadisələr — `Api\EventController` ağ siyahısı. */
    public const CLIENT_EVENTS = ['reply_click', 'reply_open', 'reply_shared'];

    /** Serverin özü yazır — klient bunu göndərə bilməz. */
    public const CREATED = 'reply_created';

    protected $fillable = ['document_id', 'user_id', 'event', 'kind', 'cat', 'depth'];

    protected function casts(): array
    {
        return [
            'depth'      => 'integer',
            'created_at' => 'datetime',
        ];
    }

    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Hadisəni yazır. Statistika heç vaxt əsas axını dayandırmamalıdır —
     * cədvəl yoxdursa və ya yazı alınmasa sənəd yaradılması davam edir.
     */
    public static function record(
        ?int $documentId,
        ?int $userId,
        string $event,
        ?string $kind = null,
        ?string $cat = null,
        int $depth = 0,
    ): void {
        try {
            self::create([
                'document_id' => $documentId,
                'user_id'     => $userId,
                'event'       => $event,
                'kind'        => $kind,
                'cat'         => $cat,
                'depth'       => $depth,
            ]);
        } catch (\Throwable) {
            // Ölçmə itir, sənəd itmir.
        }
    }
}
