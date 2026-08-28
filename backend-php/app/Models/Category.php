<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    protected $fillable = ['slug', 'tone', 'name', 'icon', 'blurb', 'sort', 'is_active'];

    protected function casts(): array
    {
        return [
            'sort'      => 'integer',
            'is_active' => 'boolean',
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

    /** Frontend-dəki `window.CATEGORIES` elementinin forması. */
    public function toCatalogArray(): array
    {
        return [
            'id'    => $this->slug,
            'tone'  => $this->tone,
            'name'  => $this->name,
            'icon'  => $this->icon ?? '',
            'blurb' => $this->blurb,
        ];
    }
}
