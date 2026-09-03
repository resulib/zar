<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DossierDocument extends Model
{
    protected $fillable = [
        'dossier_id', 'page', 'name', 'kind', 'type', 'sort',
        'is_locked', 'is_sample', 'lock_code', 'lock_hint', 'content',
    ];

    /**
     * `lock_code` və `content` heç bir massivə/JSON-a düşmür.
     *
     * Bu, ikinci müdafiə xəttidir: sənədin məzmunu yalnız `renderDocument()`
     * ilə HTML kimi verilir, kod isə ümumiyyətlə brauzerə çatmır. Modeli
     * səhvən `toArray()`-ə verən kod da sirri sızdırmır.
     */
    protected $hidden = ['lock_code', 'content'];

    protected function casts(): array
    {
        return [
            'content'   => 'array',
            'is_locked' => 'boolean',
            'is_sample' => 'boolean',
            'sort'      => 'integer',
        ];
    }

    public function dossier(): BelongsTo
    {
        return $this->belongsTo(Dossier::class);
    }

    /** Sənədin özü kodla bağlıdır və hələ açılmayıb. */
    public function isLockedFor(bool $unlocked): bool
    {
        return $this->is_locked && ! $unlocked;
    }

    /**
     * Materiallar siyahısındakı sətir.
     *
     * Adı və vərəq nömrəsi ödənişdən əvvəl də görünür — promptun tələbi budur:
     * «sənədlərin siyahısı adları ilə görünsün amma açılmasın».
     */
    public function toListArray(bool $unlocked = false): array
    {
        return [
            'id'     => (int) $this->id,
            'page'   => (string) $this->page,
            'name'   => (string) $this->name,
            'kind'   => (string) $this->kind,
            'type'   => (string) $this->type,
            'locked' => $this->isLockedFor($unlocked),
        ];
    }
}
