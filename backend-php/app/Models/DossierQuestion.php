<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DossierQuestion extends Model
{
    protected $fillable = [
        'dossier_id', 'prompt', 'options', 'correct_index', 'explanation', 'sort',
    ];

    /**
     * Düzgün cavab və izah heç bir massivə düşmür.
     *
     * Suallar və variantlar səhifədə görünür, düzgün cavab isə yalnız
     * serverdə bilinir; izah da yalnız rəy göndəriləndən SONRA qaytarılır.
     */
    protected $hidden = ['correct_index', 'explanation'];

    protected function casts(): array
    {
        return [
            'options'       => 'array',
            'correct_index' => 'integer',
            'sort'          => 'integer',
        ];
    }

    public function dossier(): BelongsTo
    {
        return $this->belongsTo(Dossier::class);
    }

    public function toListArray(): array
    {
        return [
            'id'      => (int) $this->id,
            'prompt'  => (string) $this->prompt,
            'options' => array_values(array_map('strval', (array) $this->options)),
        ];
    }
}
