<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Document extends Model
{
    public const STATUS_DRAFT     = 'draft';
    public const STATUS_PUBLISHED = 'published';
    public const STATUS_REMOVED   = 'removed';

    protected $fillable = [
        'reg_no', 'user_id', 'template_id', 'title', 'to_name', 'from_name',
        'powers', 'penalty', 'preamble', 'date_label', 'layout', 'palette', 'tone',
        'labels', 'extra', 'status', 'views', 'published_at',
        'expires_at', 'cancelled_at', 'cancel_reason',
    ];

    protected function casts(): array
    {
        return [
            'labels'       => 'array',
            'extra'        => 'array',
            'views'        => 'integer',
            'published_at' => 'datetime',
            'expires_at'   => 'datetime',
            'cancelled_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function reports(): HasMany
    {
        return $this->hasMany(Report::class);
    }

    public function isPublished(): bool
    {
        return $this->status === self::STATUS_PUBLISHED;
    }

    public function scopePublished(Builder $q): Builder
    {
        return $q->where('status', self::STATUS_PUBLISHED);
    }

    public function scopeVisible(Builder $q): Builder
    {
        return $q->where('status', '!=', self::STATUS_REMOVED);
    }

    /**
     * Reyestrdəki vəziyyət: active · expired · cancelled.
     * Sənədin üzərindəki möhrü bu seçir — hesablama serverdədir, doc.js-də deyil.
     */
    public function state(): string
    {
        if ($this->cancelled_at !== null) {
            return 'cancelled';
        }

        if ($this->expires_at !== null && $this->expires_at->isPast()) {
            return 'expired';
        }

        return 'active';
    }

    public function verifyUrl(): string
    {
        return config('zarafat.public_url') . '/r/' . $this->reg_no;
    }

    /** Frontend-in gözlədiyi forma — Node backend-i ilə eyni müqavilə. */
    public function toApiArray(bool $withOwner = false): array
    {
        $labels = $this->labels ?? [];
        $extra  = $this->extra ?? [];

        $data = [
            'regNo'        => $this->reg_no,
            'templateId'   => $this->template_id,
            'layout'       => $this->layout,
            'palette'      => $this->palette,
            'tone'         => $this->tone,
            'toLabel'      => $labels['toLabel'] ?? null,
            'fromLabel'    => $labels['fromLabel'] ?? null,
            'powersLabel'  => $labels['powersLabel'] ?? null,
            'penaltyLabel' => $labels['penaltyLabel'] ?? null,
            'title'        => $this->title,
            'to'           => $this->to_name,
            'from'         => $this->from_name,
            'powers'       => $this->powers,
            'penalty'      => $this->penalty,
            'preamble'     => $this->preamble,
            'data'         => $extra['data']      ?? null,
            'checks'       => $extra['checks']    ?? null,
            'scale'        => $extra['scale']     ?? null,
            'notes'        => $extra['notes']     ?? null,
            'until'        => $extra['until']     ?? null,
            'signTitle'    => $extra['signTitle'] ?? null,
            'signOrg'      => $extra['signOrg']   ?? null,
            'share'        => $extra['share']     ?? null,
            'state'        => $this->state(),
            'expiresAt'    => $this->expires_at?->getTimestampMs(),
            'cancelledAt'  => $this->cancelled_at?->getTimestampMs(),
            'cancelReason' => $this->cancel_reason,
            'date'         => $this->date_label,
            'paid'         => $this->isPublished(),
            'verifyUrl'    => $this->verifyUrl(),
            'createdAt'    => $this->created_at?->getTimestampMs(),
            'publishedAt'  => $this->published_at?->getTimestampMs(),
        ];

        if ($withOwner) {
            $data['views'] = $this->views;
        }

        return $data;
    }
}
