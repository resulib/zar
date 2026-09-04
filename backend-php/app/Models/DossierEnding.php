<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Bir şübhəli seçildikdə açılan sonluq.
 *
 * `reveal_text` — işin həqiqi açılışı — `$hidden`-dədir: yalnız DOĞRU sonluq
 * seçildikdə, kontrollerin açıq şəkildə əlavə etdiyi açar kimi gedir.
 * Modeli səhvən `toArray()`-ə verən kod bütün hekayəni sızdırmamalıdır.
 *
 * `sting_line` isə yanlış sonluqda üç saniyə sonra çıxan tək sətirdir;
 * gecikmə brauzerdədir, çünki o, yalnız təqdimatdır.
 */
class DossierEnding extends Model
{
    protected $fillable = [
        'dossier_id', 'suspect_id', 'is_true_ending',
        'verdict_text', 'reveal_text', 'sting_line',
    ];

    protected $hidden = ['reveal_text', 'is_true_ending'];

    protected function casts(): array
    {
        return [
            'is_true_ending' => 'boolean',
        ];
    }

    public function dossier(): BelongsTo
    {
        return $this->belongsTo(Dossier::class);
    }

    public function suspect(): BelongsTo
    {
        return $this->belongsTo(DossierSuspect::class, 'suspect_id');
    }
}
