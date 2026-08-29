<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InviteGuest extends Model
{
    protected $fillable = [
        'invite_id', 'token', 'name', 'rsvp', 'rsvp_count', 'rsvp_note',
        'responded_at', 'opened_at', 'sort',
    ];

    protected function casts(): array
    {
        return [
            'responded_at' => 'datetime',
            'opened_at'    => 'datetime',
            'rsvp_count'   => 'integer',
            'sort'         => 'integer',
        ];
    }

    public function invite(): BelongsTo
    {
        return $this->belongsTo(Invite::class);
    }

    /** Toplu siyahıdan gələn qonağın öz linki var; özü cavab verən qonağın yoxdur. */
    public function hasLink(): bool
    {
        return is_string($this->token) && $this->token !== '';
    }

    public function toApiArray(): array
    {
        return [
            'id'        => $this->id,
            'name'      => $this->name,
            'token'     => $this->token,
            'rsvp'      => $this->rsvp,
            'count'     => $this->rsvp_count,
            'note'      => $this->rsvp_note,
            'responded' => $this->responded_at?->toIso8601String(),
            'opened'    => $this->opened_at?->toIso8601String(),
        ];
    }
}
