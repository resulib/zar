<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Bağlanmış işin DƏYİŞMƏZ qeydi — reytinqin və XP-nin həqiqət mənbəyi.
 *
 * `dossier_progress` ilə qarışdırılmamalıdır: o, oyunun CANLI vəziyyətidir
 * və dəyişir («yenidən oyna» seçimi sıfırlayır, kodlar açılır, vərəqlər
 * oxunur). Bu isə arxivdir: bir dəfə yazılır və yalnız düstur dəyişəndə
 * yenidən hesablanır.
 *
 * `(profile_id, case_id)` unikaldır — bir iş bir adama bir dəfə sayılır.
 */
class CaseCompletion extends Model
{
    protected $fillable = [
        'profile_id', 'case_id', 'is_solved', 'chosen_suspect_id', 'is_true_ending',
        'wrong_attempts', 'all_codes_unlocked', 'difficulty',
        'xp_awarded', 'duration_seconds', 'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'is_solved'          => 'boolean',
            'is_true_ending'     => 'boolean',
            'all_codes_unlocked' => 'boolean',
            'chosen_suspect_id'  => 'integer',
            'wrong_attempts'     => 'integer',
            'xp_awarded'         => 'integer',
            'duration_seconds'   => 'integer',
            'completed_at'       => 'datetime',
        ];
    }

    public function profile(): BelongsTo
    {
        return $this->belongsTo(InvestigatorProfile::class, 'profile_id');
    }

    /** FK yoxdur (arxiv sətridir), amma əlaqə oxunuş üçün lazımdır. */
    public function dossier(): BelongsTo
    {
        return $this->belongsTo(Dossier::class, 'case_id');
    }

    /** Birinci cəhddən, heç bir səhv ittiham olmadan bağlanıb. */
    public function firstTry(): bool
    {
        return $this->is_solved && $this->wrong_attempts === 0;
    }
}
