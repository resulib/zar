<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Kilid kodunun reyestr sətri — idarəçinin redaktə etdiyi səth.
 *
 * Kodun özü HƏM DƏ sənədin `lock_code` sütununda saxlanılır: `unlock()`
 * müqayisəni orada aparır və `$hidden` qalxanı oradadır. Bu sətir kodun
 * ADINI, idarəçi QEYDİNİ və MƏNBƏ VƏRƏQLƏRİNİ daşıyır — yəni oyunçuya heç
 * vaxt getməyəcək üç şeyi. Ona görə hər üçü `$hidden`-dədir.
 */
class DossierCode extends Model
{
    protected $fillable = [
        'dossier_id', 'code', 'label', 'hint_note', 'source_document_ids', 'sort',
    ];

    /** Sətrin BÜTÜN mənalı hissəsi sirrdir — kod, qeyd və mənbə vərəqlər. */
    protected $hidden = ['code', 'label', 'hint_note', 'source_document_ids'];

    protected function casts(): array
    {
        return [
            'source_document_ids' => 'array',
            'sort'                => 'integer',
        ];
    }

    public function dossier(): BelongsTo
    {
        return $this->belongsTo(Dossier::class);
    }

    /** Bu kodun açdığı vərəqlər — bir kod bir neçəsini aça bilər. */
    public function documents(): HasMany
    {
        return $this->hasMany(DossierDocument::class, 'unlock_code_id');
    }

    /** @return list<int> */
    public function sourceIds(): array
    {
        $raw = (array) ($this->source_document_ids ?? []);

        return array_values(array_unique(array_map('intval', array_filter($raw, 'is_numeric'))));
    }
}
