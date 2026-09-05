<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DossierDocument extends Model
{
    protected $fillable = [
        'dossier_id', 'page', 'name', 'kind', 'doc_type', 'meta_line', 'sort',
        'is_locked', 'is_sample', 'is_spoiler', 'lock_kind', 'lock_code', 'lock_hint', 'unlock_code_id',
        'content', 'body', 'draft_body', 'blank_nov',
    ];

    /**
     * `lock_code` və `content` heç bir massivə/JSON-a düşmür.
     *
     * Bu, ikinci müdafiə xəttidir: sənədin məzmunu yalnız `renderDocument()`
     * ilə HTML kimi verilir, kod isə ümumiyyətlə brauzerə çatmır. Modeli
     * səhvən `toArray()`-ə verən kod da sirri sızdırmır.
     *
     * `body` və `draft_body` eyni siniflərdir: mətn `content.bloklar`-dan
     * bura köçəndə sirr də bura köçür. Siyahı UZANA bilər, amma bu dörd
     * açar HEÇ VAXT çıxarılmamalıdır — `tools/check-dossier.js` §4 hər birini
     * ayrıca yoxlayır.
     */
    protected $hidden = ['lock_code', 'content', 'body', 'draft_body'];

    protected function casts(): array
    {
        return [
            'content'   => 'array',
            'is_locked' => 'boolean',
            'is_sample' => 'boolean',
            'is_spoiler' => 'boolean',
            'sort'      => 'integer',
        ];
    }

    public function dossier(): BelongsTo
    {
        return $this->belongsTo(Dossier::class);
    }

    public function code(): BelongsTo
    {
        return $this->belongsTo(DossierCode::class, 'unlock_code_id');
    }

    /**
     * Vərəqin oxunacaq mətni — `body` rejimindədirsə mətn, deyilsə `null`.
     *
     * `null` render qatına «köhnə yolu işlət» deyir: `content.bloklar`
     * ardıcıllığı. Bu ayrım sayəsində mövcud 84 vərəq bayt-bayt eyni qalır.
     */
    public function govde(): ?string
    {
        $m = trim((string) $this->body);

        return $m === '' ? null : $m;
    }

    /** Dərc olunmamış qaralama var — siyahıda sarı nişan göstərilir. */
    public function hasDraft(): bool
    {
        return $this->draft_body !== null && (string) $this->draft_body !== (string) $this->body;
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
            'locked' => $this->isLockedFor($unlocked),
        ];
    }
}
