<?php

declare(strict_types=1);

namespace App\Models;

use App\Support\Devet;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Invite extends Model
{
    public const STATUS_DRAFT = 'draft';
    public const STATUS_PUBLISHED = 'published';
    public const STATUS_REMOVED = 'removed';

    protected $fillable = [
        'token', 'user_id', 'event', 'design', 'palette',
        'host_names', 'title', 'event_at', 'event_time',
        'venue_name', 'venue_address', 'map_url', 'phone', 'note',
        'rsvp_enabled', 'og_ready', 'status', 'views', 'published_at',
    ];

    protected function casts(): array
    {
        return [
            'event_at'     => 'datetime',
            'published_at' => 'datetime',
            'rsvp_enabled' => 'boolean',
            'og_ready'     => 'boolean',
            'views'        => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function guests(): HasMany
    {
        return $this->hasMany(InviteGuest::class)->orderBy('sort')->orderBy('id');
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

    public function link(?string $guestToken = null): string
    {
        return Devet::link((string) config('devet.public_url'), (string) $this->token, $guestToken);
    }

    /** WhatsApp önizləmə şəkli. Yoxdursa boş sətir — meta teqi yazılmır. */
    public function ogUrl(): string
    {
        return $this->og_ready
            ? rtrim((string) config('devet.public_url'), '/') . '/d/' . $this->token . '/on.jpg'
            : '';
    }

    /**
     * Sosial önizləmə mətni.
     *
     * ÜNVAN VƏ TELEFON BURADA YOXDUR. Link önizləməsi hər söhbətdə,
     * hər qrupda görünür; məkan və nömrə isə yalnız dəvəti açan qonağa aiddir.
     * Eyni qayda `invite.js drawOg()`-də şəkil tərəfindən də saxlanılır.
     */
    public function ogMeta(): array
    {
        $tarix = $this->event_at?->format('d.m.Y') ?? '';
        $saat = (string) $this->event_time;

        return [
            'title' => trim((string) $this->host_names) !== ''
                ? (string) $this->host_names
                : 'Dəvətnamə',
            'description' => trim(implode(' · ', array_filter([
                (string) $this->title,
                $tarix . ($saat !== '' ? ', ' . $saat : ''),
            ]))),
            'image' => $this->ogUrl(),
        ];
    }

    /** Qonağa göndərilən məlumat. Yalnız dərc olunmuş dəvətnamə üçün çağırılır. */
    public function toApiArray(bool $withOwner = false): array
    {
        $out = [
            'token'    => $this->token,
            'event'    => $this->event,
            'design'   => $this->design,
            'palette'  => $this->palette,
            'hosts'    => $this->host_names,
            'title'    => $this->title,
            'date'     => $this->event_at?->format('Y-m-d') ?? '',
            'time'     => (string) $this->event_time,
            'venue'    => $this->venue_name,
            'address'  => $this->venue_address,
            'mapUrl'   => $this->map_url,
            'phone'    => $this->phone,
            'note'     => $this->note,
            'rsvp'     => (bool) $this->rsvp_enabled,
            'status'   => $this->status,
            'link'     => $this->link(),
        ];

        if ($withOwner) {
            $out['views'] = (int) $this->views;
            $out['ogReady'] = (bool) $this->og_ready;
            $out['createdAt'] = $this->created_at?->toIso8601String();
        }

        return $out;
    }
}
