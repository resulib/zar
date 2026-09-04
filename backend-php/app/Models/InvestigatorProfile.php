<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Oyunçunun müstəntiq kimliyi.
 *
 * TƏLƏBATA GÖRƏ yaranır — qonaq ilk işi bağlayanda və ya qeydiyyatdan keçən
 * adam profil ekranını açanda. `DossierService::open()`-dan çağırılmır: iş alıb
 * heç vaxt bitirməyən ziyarətçi sətir yaratmamalıdır (qonaq sətirlərinin
 * tənbəl yaradılması ilə eyni intizam).
 *
 * Fayl yolları `$hidden`-dədir: public kökdən kənardadırlar və brauzerə yalnız
 * marşrut linki kimi çıxırlar — `DossierImage` ilə eyni qərar.
 */
class InvestigatorProfile extends Model
{
    public const AVATAR_YOX      = 'none';
    public const AVATAR_GOZLEYIR = 'pending';
    public const AVATAR_TESDIQ   = 'approved';
    public const AVATAR_REDD     = 'rejected';

    protected $fillable = [
        'user_id', 'badge_number', 'display_name', 'department', 'department_locked',
        'avatar_original_path', 'avatar_path', 'avatar_status', 'avatar_reason',
        'rank_id', 'xp', 'cases_solved', 'cases_attempted', 'true_endings',
        'first_try_solves', 'total_wrong_accusations',
        'joined_at', 'last_active_at', 'is_public', 'cached_rank_position',
    ];

    protected $hidden = ['avatar_original_path', 'avatar_path'];

    protected function casts(): array
    {
        return [
            'department_locked'       => 'boolean',
            'is_public'               => 'boolean',
            'xp'                      => 'integer',
            'cases_solved'            => 'integer',
            'cases_attempted'         => 'integer',
            'true_endings'            => 'integer',
            'first_try_solves'        => 'integer',
            'total_wrong_accusations' => 'integer',
            'cached_rank_position'    => 'integer',
            'joined_at'               => 'datetime',
            'last_active_at'          => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function rank(): BelongsTo
    {
        return $this->belongsTo(Rank::class);
    }

    public function completions(): HasMany
    {
        return $this->hasMany(CaseCompletion::class, 'profile_id');
    }

    public function rankHistory(): HasMany
    {
        return $this->hasMany(RankHistory::class, 'profile_id');
    }

    public function adjustments(): HasMany
    {
        return $this->hasMany(XpAdjustment::class, 'profile_id');
    }

    /** Nişan verilibmi. Verilməyibsə şöbə hələ seçilməyib. */
    public function hasBadge(): bool
    {
        return $this->badge_number !== null && $this->badge_number !== '';
    }

    /** Şöbənin tam adı — kod `config('dossier.sobeler')` açarıdır. */
    public function departmentLabel(): string
    {
        $siyahi = (array) config('dossier.sobeler', []);

        return (string) ($siyahi[(string) $this->department] ?? '');
    }

    /** Kartda göstərilən ad. Boşdursa nişan nömrəsinə düşür. */
    public function adi(): string
    {
        $ad = trim((string) $this->display_name);

        if ($ad !== '') {
            return $ad;
        }

        return $this->hasBadge() ? (string) $this->badge_number : 'Müstəntiq';
    }

    /**
     * Avatar İCTİMAİ yerlərdə görünürmü.
     *
     * Sahibi öz şəklini hər vəziyyətdə görür; reytinq və paylaşılan kart isə
     * yalnız təsdiqlənmişi göstərir — moderasiyanın bütün mənası budur.
     */
    public function avatarPublic(): bool
    {
        return $this->avatar_status === self::AVATAR_TESDIQ && $this->avatar_path !== null;
    }

    /** Reytinqdə görünmə şərti: ictimai VƏ nişanlı (yəni qonaq deyil). */
    public function listed(): bool
    {
        return $this->is_public && $this->hasBadge();
    }
}
