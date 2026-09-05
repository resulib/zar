<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Ümumi şəkil hovuzunun bir şəkli — heç bir işə bağlı deyil.
 *
 * Hovuz YALNIZ idarəçi tərəfidir: oyunçuya bu cədvəldən heç nə verilmir.
 * Şəkil bir işdə lazım olanda KÖÇÜRÜLÜR — `dossier_images`-də adi sətir
 * yaranır və oyunçu yolunun bütün qapıları (iş üzvlüyü, spoiler qoruması)
 * dəyişmədən işləyir. Ona görə burada `owner_document_id` də yoxdur.
 *
 * Fayl yolları `$hidden`-dədir — `DossierImage`-in qaydası.
 */
class DossierPoolImage extends Model
{
    protected $fillable = [
        'slug', 'caption', 'image_type',
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

    /** Diskdəki fayl adı. Üç ölçü, üç ayrı təsadüfi ad — `DossierImage` kimi. */
    public function pathFor(string $olcu): string
    {
        return match ($olcu) {
            'kicik' => (string) $this->thumb_path,
            'orta'  => (string) $this->medium_path,
            default => (string) $this->original_path,
        };
    }
}
