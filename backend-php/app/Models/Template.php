<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Template extends Model
{
    protected $fillable = [
        'slug', 'category_id', 'tone', 'layout', 'palette',
        'title', 'tag', 'preamble', 'powers', 'penalty',
        'to_label', 'from_label', 'powers_label', 'penalty_label',
        'reg_prefix', 'sign_title', 'sign_org', 'share',
        'fields', 'notes', 'cancel_reasons', 'sort', 'is_active',
    ];

    protected function casts(): array
    {
        return [
            'fields'         => 'array',
            'notes'          => 'array',
            'cancel_reasons' => 'array',
            'sort'           => 'integer',
            'is_active'      => 'boolean',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function scopeActive(Builder $q): Builder
    {
        return $q->where('is_active', true);
    }

    public function scopeOrdered(Builder $q): Builder
    {
        return $q->orderBy('sort')->orderBy('id');
    }

    /**
     * Frontend-dəki `window.TEMPLATES` elementinin forması.
     * Boş açarlar buraxılır — statik templates.js faylı ilə eyni görünsün deyə.
     */
    public function toCatalogArray(?string $categorySlug = null): array
    {
        $out = [
            'id'      => $this->slug,
            'cat'     => $categorySlug ?? $this->category?->slug,
            'tone'    => $this->tone,
            'layout'  => $this->layout,
            'palette' => $this->palette,
            'title'   => $this->title,
            'tag'     => $this->tag,
        ];

        foreach ([
            'toLabel'       => $this->to_label,
            'fromLabel'     => $this->from_label,
            'powersLabel'   => $this->powers_label,
            'penaltyLabel'  => $this->penalty_label,
        ] as $key => $value) {
            if ($value !== null && $value !== '') {
                $out[$key] = $value;
            }
        }

        $out['preamble'] = $this->preamble;
        $out['powers']   = $this->powers;
        $out['penalty']  = $this->penalty;

        foreach ([
            'regPrefix'     => $this->reg_prefix,
            'signTitle'     => $this->sign_title,
            'signOrg'       => $this->sign_org,
            'share'         => $this->share,
            'fields'        => $this->fields,
            'notes'         => $this->notes,
            'cancelReasons' => $this->cancel_reasons,
        ] as $key => $value) {
            if ($value !== null && $value !== '' && $value !== []) {
                $out[$key] = $value;
            }
        }

        return $out;
    }
}
