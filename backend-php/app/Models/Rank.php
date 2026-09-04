<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Müstəntiq rütbəsi. Doqquz pillə, `RankSeeder` ilə dolur.
 *
 * Eşiklər KODUN mülkiyyətidir, idarəçinin yox: `xp_required` hər seed
 * işə salmasında yenidən yazılır (`status`/`sort` intizamından fərqli olaraq),
 * çünki düstur dəyişəndə eşiklərin də dəyişməsi lazımdır və idarə panelindəki
 * «yenidən hesabla» düyməsi məhz bunun üzərində işləyir.
 */
class Rank extends Model
{
    /** Nişanın forması — `CardRenderer` hər biri üçün bir qol daşıyır. */
    public const NISANLAR = [
        'sirit-bos', 'sirit-1', 'sirit-2', 'sirit-3', 'sirit-3-zol',
        'ulduz-1', 'ulduz-2', 'ulduz-3', 'ulduz-celeng',
    ];

    protected $fillable = [
        'level', 'title_az', 'title_short', 'xp_required', 'insignia_type', 'color_token',
    ];

    protected function casts(): array
    {
        return [
            'level'       => 'integer',
            'xp_required' => 'integer',
        ];
    }

    public function profiles(): HasMany
    {
        return $this->hasMany(InvestigatorProfile::class, 'rank_id');
    }

    /**
     * Rütbənin kartda işlədilən HƏRFİ rəngi.
     *
     * `color_token` yalnız addır: kartın SVG-si <img> ilə kətana çəkilir və
     * orada `var(--ink3)` həll olunmur — CSS dəyişəni PNG-də boşluğa çevrilir.
     */
    public function reng(): string
    {
        $xerite = (array) config('dossier.reyting.rank_colors', []);

        return (string) ($xerite[$this->color_token] ?? '#8792A6');
    }

    /** Ən aşağı pillə — profil yaranarkən təyin olunur. */
    public static function ilk(): ?self
    {
        return static::query()->orderBy('level')->first();
    }
}
