<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * İrəliləyiş BAZADA saxlanılır, brauzerin yaddaşında yox.
 *
 * Səbəb sadədir: adam telefonu bağlayıb səhər davam edə bilməlidir.
 * Eyni səbəbdən vaxt da buradadır — `started_at` serverdə yazılır,
 * `duration_seconds` serverdə hesablanır; brauzerdəki sayğac yalnız
 * göstərmə üçündür və nəticəyə təsir etmir.
 */
class DossierProgress extends Model
{
    protected $table = 'dossier_progress';

    protected $fillable = [
        'dossier_id', 'user_id', 'investigator',
        'access_at', 'started_at', 'finished_at', 'duration_seconds',
        'read_ids', 'pinned_ids', 'unlocked_ids', 'wrong_suspect_ids',
        'attempts', 'solved', 'revealed', 'chosen_suspect_id', 'cert_token', 'cert_ready',
    ];

    protected function casts(): array
    {
        return [
            'access_at'        => 'datetime',
            'started_at'       => 'datetime',
            'finished_at'      => 'datetime',
            'duration_seconds' => 'integer',
            'read_ids'         => 'array',
            'pinned_ids'       => 'array',
            'unlocked_ids'     => 'array',
            'wrong_suspect_ids' => 'array',
            'attempts'         => 'integer',
            'solved'           => 'boolean',
            'revealed'         => 'boolean',
            'cert_ready'       => 'boolean',
            'chosen_suspect_id' => 'integer',
        ];
    }

    public function dossier(): BelongsTo
    {
        return $this->belongsTo(Dossier::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function hasAccess(): bool
    {
        return $this->access_at !== null;
    }

    /** @return list<int> */
    public function ids(string $key): array
    {
        $raw = (array) ($this->{$key} ?? []);

        return array_values(array_unique(array_map('intval', array_filter($raw, 'is_numeric'))));
    }

    public function marked(string $key, int $id): bool
    {
        return in_array($id, $this->ids($key), true);
    }

    /**
     * Siyahıya əlavə edir. Dəyişiklik olmayıbsa `false` qaytarır ki,
     * hər sənəd açılışında lazımsız UPDATE getməsin.
     */
    public function mark(string $key, int $id): bool
    {
        $list = $this->ids($key);

        if (in_array($id, $list, true)) {
            return false;
        }

        $list[] = $id;
        $this->{$key} = $list;

        return true;
    }

    /** Sancır / çıxarır. Qaytardığı dəyər yeni vəziyyətdir. */
    public function toggle(string $key, int $id): bool
    {
        $list = $this->ids($key);
        $at = array_search($id, $list, true);

        if ($at === false) {
            $list[] = $id;
            $this->{$key} = $list;

            return true;
        }

        unset($list[$at]);
        $this->{$key} = array_values($list);

        return false;
    }

    /** Neçə cəhd qalıb. Mənfi olmur. */
    public function attemptsLeft(): int
    {
        return (int) max(0, (int) config('dossier.attempts') - (int) $this->attempts);
    }

    /**
     * Qabığa ötürülən vəziyyət.
     *
     * Sənəd məzmunu, kod və cavablar BURADA YOXDUR — səhifənin mənbə koduna
     * baxan adam yalnız öz irəliləyişini görür.
     */
    public function toStateArray(): array
    {
        return [
            'investigator' => (string) $this->investigator,
            'startedAt'    => $this->started_at?->toIso8601String(),
            'elapsed'      => $this->started_at === null ? 0 : (int) max(0, (int) $this->started_at->diffInSeconds(now())),
            'read'         => $this->ids('read_ids'),
            'pinned'       => $this->ids('pinned_ids'),
            'unlocked'     => $this->ids('unlocked_ids'),
            'attempts'     => (int) $this->attempts,
            'attemptsLeft' => $this->attemptsLeft(),
            'solved'       => (bool) $this->solved,
            'minutes'      => $this->solved ? \App\Support\Dossier\Dossier::deqiqe($this->duration_seconds) : null,
            'revealed'     => (bool) $this->revealed,
            'chosen'       => $this->chosen_suspect_id === null ? null : (int) $this->chosen_suspect_id,
            'certToken'    => $this->solved ? (string) $this->cert_token : null,
        ];
    }
}
