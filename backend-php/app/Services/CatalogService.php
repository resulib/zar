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
 * Yük DÖRD açara bölünür. Cavab şablonları `templates` açarına düşsə,
 * `applyCatalog()` onları `window.TEMPLATES`-ə tökər, ana səhifənin kateqoriya
 * zolağı və `catsOf`/`tplsOf` süzgəcləri sınardı. Ayırma məhz bunun üçündür.
 */
class CatalogService
{
    /* Yükün forması dəyişdiyi üçün açar da yenilənir — köhnə keşdə
       `replies` yoxdur və sayt cavab kataloqunu boş görərdi. */
    public const CACHE_KEY = 'catalog:v2';

    /** @return array<string, list<array<string, mixed>>> */
    public function payload(): array
    {
        return Cache::rememberForever(self::CACHE_KEY, fn (): array => $this->build());
    }

    public static function forget(): void
    {
        Cache::forget(self::CACHE_KEY);
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

        $cats = function (bool $reply) use ($categories): array {
            return $categories
                ->filter(fn (Category $c): bool => $c->is_reply === $reply)
                ->map(fn (Category $c): array => $c->toCatalogArray())
                ->values()->all();
        };

        $tpls = function (bool $reply) use ($templates, $slugs): array {
            return $templates
                ->filter(fn (Template $t): bool => $t->isReply() === $reply)
                ->map(fn (Template $t): array => $t->toCatalogArray($slugs[$t->category_id] ?? null))
                ->values()->all();
        };

        return [
            'categories'      => $cats(false),
            'templates'       => $tpls(false),
            'replyCategories' => $cats(true),
            'replies'         => $tpls(true),
        ];
    }
}
