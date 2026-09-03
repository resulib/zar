<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    protected $fillable = ['slug', 'tone', 'name', 'icon', 'blurb', 'sort', 'is_active', 'is_reply', 'is_social'];

    protected function casts(): array
    {
        return [
            'sort'      => 'integer',
            'is_active' => 'boolean',
            'is_reply'  => 'boolean',
            'is_social' => 'boolean',
        ];
    }

    public function templates(): HasMany
    {
        return $this->hasMany(Template::class);
    }

    public function scopeActive(Builder $q): Builder
    {
        return $q->where('is_active', true);
    }

    public function scopeOrdered(Builder $q): Builder
    {
        return $q->orderBy('sort')->orderBy('id');
    }

    /* Cavab kateqoriyaları saytın kateqoriya zolağında görünmür və
       `check-templates.js`-in «12 şablon · 12 dizayn» qaydalarına tabe deyil. */

    public function scopeReplies(Builder $q): Builder
    {
        return $q->where('is_reply', true);
    }

    public function scopeNotReplies(Builder $q): Builder
    {
        return $q->where('is_reply', false);
    }

    /** Frontend-dəki `window.CATEGORIES` elementinin forması. */
    public function toCatalogArray(): array
    {
        $out = [
            'id'    => $this->slug,
            'tone'  => $this->tone,
            'name'  => $this->name,
            'icon'  => $this->icon ?? '',
            'blurb' => $this->blurb,
        ];

        /* Yalnız cavab kateqoriyalarında göndərilir — 18 adi kateqoriyanın
           yükü olduğu kimi qalsın deyə. */
        if ($this->is_reply) {
            $out['isReply'] = true;
        }

        if ($this->is_social) {
            $out['isSocial'] = true;
        }

        return $out;
    }
}
