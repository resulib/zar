<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Sənəd mətninə yerləşdirilən şəkil.
 *
 * ŞƏKİL ilə SƏNƏD arasında əlaqə cədvəli yoxdur: bağ mətnin içindəki
 * `{{ sekil:slug }}` nişanındandır. `owner_document_id` əlaqə deyil, SPOİLER
 * QORUMASIDIR — şəkil kilidli vərəqə aiddirsə, kod açılmayınca fayl verilmir.
 *
 * Fayl yolları `$hidden`-dədir: onlar public kökdən kənardadır və brauzerə
 * yalnız marşrut linki kimi çıxır. Diskdəki yolu göndərmək həm mənasız,
 * həm də serverin quruluşu haqqında məlumat verməkdir.
 */
class DossierImage extends Model
{
    /** Ağ siyahı `config('dossier.sekil_novleri')`-dədir. */
    public const NOV_GENERIC = 'generic';

    protected $fillable = [
        'dossier_id', 'slug', 'caption', 'image_type', 'owner_document_id',
        'original_path', 'medium_path', 'thumb_path',
        'width', 'height', 'filesize', 'sort',
    ];

    protected $hidden = ['original_path', 'medium_path', 'thumb_path'];

    protected function casts(): array
    {
        return [
            'width'    => 'integer',
            'height'   => 'integer',
            'filesize' => 'integer',
            'sort'     => 'integer',
        ];
    }

    public function dossier(): BelongsTo
    {
        return $this->belongsTo(Dossier::class);
    }

    /** Şəkil hansı kilidli vərəqə aiddir. Boşdursa qovluğun ümumi materialıdır. */
    public function ownerDocument(): BelongsTo
    {
        return $this->belongsTo(DossierDocument::class, 'owner_document_id');
    }

    /** Diskdəki fayl adı. Üç ölçü, üç ayrı təsadüfi ad. */
    public function pathFor(string $olcu): string
    {
        return match ($olcu) {
            'kicik' => (string) $this->thumb_path,
            'orta'  => (string) $this->medium_path,
            default => (string) $this->original_path,
        };
    }

    /** Oyunçuya verilən link — fayl adı deyil, marşrut. */
    public function url(string $slug, string $olcu = 'orta'): string
    {
        return '/is/' . $slug . '/sekil/' . (int) $this->id . '/' . $olcu;
    }
}
