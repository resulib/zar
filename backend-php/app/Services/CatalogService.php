<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Category;
use App\Models\Template;
use Illuminate\Support\Facades\Cache;

/**
 * Saytın şablon kataloqu.
 *
 * Kataloq hər səhifə açılışında oxunur, ona görə keşlənir; admin paneldəki
 * hər dəyişiklik {@see self::forget()} ilə keşi sıfırlayır.
 *
 * Yük ALTI açara bölünür. Cavab şablonları və sosial kimlik kartları
 * `templates` açarına düşsə, `applyCatalog()` onları `window.TEMPLATES`-ə
 * tökər, ana səhifənin kateqoriya zolağı və `catsOf`/`tplsOf` süzgəcləri
 * sınardı. Ayırma məhz bunun üçündür.
 *
 * Cavablar şablonun öz sütunu (`reply_kind`) ilə, sosial kartlar isə
 * KATEQORİYASININ `is_social` bayrağı ilə ayrılır: `social_kind` boş ola
 * bilər (kart hər iki platformaya uyğundursa), ona görə o, ayırıcı deyil.
 */
class CatalogService
{
    /* Yükün forması dəyişdiyi üçün açar da yenilənir — köhnə keşdə
       `socialCards` yoxdur və sayt sosial kartları boş görərdi. */
    public const CACHE_KEY = 'catalog:v3';

    /** @return array<string, list<array<string, mixed>>> */
    public function payload(): array
    {
        return Cache::rememberForever(self::CACHE_KEY, fn (): array => $this->build());
    }

    public static function forget(): void
    {
        Cache::forget(self::CACHE_KEY);
        Cache::forget('catalog:v2');
        Cache::forget('catalog:v1');
    }

    /** @return array<string, list<array<string, mixed>>> */
    protected function build(): array
    {
        $categories = Category::query()->active()->ordered()->get();
        $slugs      = $categories->pluck('slug', 'id');

        /* Kateqoriyası söndürülmüş şablon saytda görünmür — `whereIn` bunu təmin edir. */
        $templates = Template::query()
            ->active()
            ->whereIn('category_id', $categories->pluck('id'))
            ->ordered()
            ->get();

        $socialCatIds = $categories->filter(fn (Category $c): bool => (bool) $c->is_social)
            ->pluck('id')->all();

        /* 'main' | 'reply' | 'social' — hər kateqoriya və şablon dəqiq birinə düşür. */
        $catBucket = static fn (Category $c): string => $c->is_reply
            ? 'reply'
            : ((bool) $c->is_social ? 'social' : 'main');

        $tplBucket = static fn (Template $t): string => $t->isReply()
            ? 'reply'
            : (in_array($t->category_id, $socialCatIds, true) ? 'social' : 'main');

        $cats = function (string $bucket) use ($categories, $catBucket): array {
            return $categories
                ->filter(fn (Category $c): bool => $catBucket($c) === $bucket)
                ->map(fn (Category $c): array => $c->toCatalogArray())
                ->values()->all();
        };

        $tpls = function (string $bucket) use ($templates, $slugs, $tplBucket): array {
            return $templates
                ->filter(fn (Template $t): bool => $tplBucket($t) === $bucket)
                ->map(fn (Template $t): array => $t->toCatalogArray($slugs[$t->category_id] ?? null))
                ->values()->all();
        };

        return [
            'categories'       => $cats('main'),
            'templates'        => $tpls('main'),
            'replyCategories'  => $cats('reply'),
            'replies'          => $tpls('reply'),
            'socialCategories' => $cats('social'),
            'socialCards'      => $tpls('social'),
        ];
    }
}
