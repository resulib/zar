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
        'reply_kind', 'reply_cats', 'social_kind', 'card_style',
        'fields', 'notes', 'cancel_reasons',
        'title_options', 'powers_options', 'powers_min', 'powers_max', 'penalty_options',
        'sort', 'is_active',
    ];

    protected function casts(): array
    {
        return [
            'fields'         => 'array',
            'notes'          => 'array',
            'cancel_reasons' => 'array',
            'reply_cats'     => 'array',
            'title_options'   => 'array',
            'powers_options'  => 'array',
            'penalty_options' => 'array',
            'powers_min'      => 'integer',
            'powers_max'      => 'integer',
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

    /** Cavab şablonları ana kataloqdan kənardadır — bax `CatalogService::payload()`. */
    public function scopeReplies(Builder $q): Builder
    {
        return $q->whereNotNull('reply_kind');
    }

    public function scopeNotReplies(Builder $q): Builder
    {
        return $q->whereNull('reply_kind');
    }

    public function isReply(): bool
    {
        return $this->reply_kind !== null && $this->reply_kind !== '';
    }

    /**
     * Bu cavab şablonu həmin orijinal kateqoriyaya cavab verirmi?
     * `reply_cats` boşdursa şablon universaldır və hər kateqoriyaya yarayır.
     */
    public function answersCategory(?string $categorySlug): bool
    {
        $cats = is_array($this->reply_cats) ? array_values($this->reply_cats) : [];

        return $cats === [] || in_array($categorySlug, $cats, true);
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

        /* Variant siyahıları. `powersMin`/`powersMax` yalnız siyahı ilə birlikdə
           göndərilir — əks halda 216 şablona mənasız iki açar əlavə olunardı. */
        if (is_array($this->title_options) && $this->title_options !== []) {
            $out['titleOptions'] = array_values($this->title_options);
        }

        if (is_array($this->powers_options) && $this->powers_options !== []) {
            $out['powersOptions'] = array_values($this->powers_options);
            $out['powersMin']     = $this->powers_min;
            $out['powersMax']     = $this->powers_max;
        }

        if (is_array($this->penalty_options) && $this->penalty_options !== []) {
            $out['penaltyOptions'] = array_values($this->penalty_options);
        }

        /* Sosial kart qatı. Boşdursa kart hər iki platformaya uyğun gəlir,
           ona görə açar heç göndərilmir — statik sosial.js ilə eyni forma. */
        if ($this->social_kind !== null && $this->social_kind !== '') {
            $out['socialKind'] = $this->social_kind;
        }
        if ($this->card_style !== null && $this->card_style !== '') {
            $out['cardStyle'] = $this->card_style;
        }

        /* Cavab qatı — yalnız cavab şablonlarında. `replyCats` boşdursa
           şablon universaldır və açar heç göndərilmir. */
        if ($this->isReply()) {
            $out['replyKind'] = $this->reply_kind;

            if (is_array($this->reply_cats) && $this->reply_cats !== []) {
                $out['replyCats'] = array_values($this->reply_cats);
            }
        }

        return $out;
    }
}
