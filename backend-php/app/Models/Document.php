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
        'powers', 'penalty', 'preamble', 'date_label', 'layout', 'palette',
        'labels', 'status', 'views', 'published_at',
    ];

    protected function casts(): array
    {
        return [
            'labels'       => 'array',
            'views'        => 'integer',
            'published_at' => 'datetime',
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

    public function verifyUrl(): string
    {
        return config('zarafat.public_url') . '/r/' . $this->reg_no;
    }

    /** Frontend-in gözlədiyi forma — Node backend-i ilə eyni müqavilə. */
    public function toApiArray(bool $withOwner = false): array
    {
        $labels = $this->labels ?? [];

        $data = [
            'regNo'        => $this->reg_no,
            'templateId'   => $this->template_id,
            'layout'       => $this->layout,
            'palette'      => $this->palette,
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
