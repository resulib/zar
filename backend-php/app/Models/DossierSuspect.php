<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Şübhəli — idarəçinin redaktə etdiyi sətir.
 *
 * Oyuna gedən tel formatı bu model DEYİL: `Dossier::suspectList()` sətirləri
 * `dossiers.suspects` JSON-unun şəklinə çevirir, çünki `dossier.js` həmin
 * şəkli oxuyur və mövcud üç iş hələ JSON sütununu işlədir.
 *
 * `is_culprit` OYUNÇUYA HEÇ VAXT GETMİR — cavabın özüdür.
 */
class DossierSuspect extends Model
{
    protected $fillable = [
        'dossier_id', 'init', 'name', 'role', 'bio', 'bars', 'camera',
        'photo_id', 'is_culprit', 'sort',
    ];

    protected $hidden = ['is_culprit'];

    protected function casts(): array
    {
        return [
            'bars'       => 'array',
            'is_culprit' => 'boolean',
            'sort'       => 'integer',
        ];
    }

    public function dossier(): BelongsTo
    {
        return $this->belongsTo(Dossier::class);
    }

    public function photo(): BelongsTo
    {
        return $this->belongsTo(DossierImage::class, 'photo_id');
    }

    public function ending(): BelongsTo
    {
        return $this->belongsTo(DossierEnding::class, 'id', 'suspect_id');
    }
}
