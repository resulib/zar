<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Rütbə yüksəlişi — «əmr» ekranının mənbəyi.
 *
 * `seen_at` ona görə bazadadır ki, əmr BİR DƏFƏ göstərilsin. Bayraq
 * brauzerdə saxlanılsaydı, cookie silinən kimi əmr yenidən çıxardı və
 * paylaşılmağa dəyər an adi bir təkrara çevrilərdi.
 */
class RankHistory extends Model
{
    protected $table = 'rank_history';

    protected $fillable = ['profile_id', 'old_rank_id', 'new_rank_id', 'awarded_at', 'seen_at'];

    protected function casts(): array
    {
        return [
            'awarded_at' => 'datetime',
            'seen_at'    => 'datetime',
        ];
    }

    public function profile(): BelongsTo
    {
        return $this->belongsTo(InvestigatorProfile::class, 'profile_id');
    }

    public function oldRank(): BelongsTo
    {
        return $this->belongsTo(Rank::class, 'old_rank_id');
    }

    public function newRank(): BelongsTo
    {
        return $this->belongsTo(Rank::class, 'new_rank_id');
    }

    /**
     * Əmrin nömrəsi — sətrin öz `id`-sindən çıxarılır, `rand()`-dan yox.
     *
     * `Imza::yol()` ilə eyni qayda: yenidən açılanda dəyişən nömrə sənədi
     * saxta kimi göstərir.
     */
    public function emrNo(): string
    {
        return $this->awarded_at?->format('y') . '-' . sprintf('%04d', (int) $this->id) . '/R';
    }
}
