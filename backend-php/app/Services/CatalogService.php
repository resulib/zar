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
 */
class CatalogService
{
    public const CACHE_KEY = 'catalog:v1';

    /** @return array{categories: list<array<string, mixed>>, templates: list<array<string, mixed>>} */
    public function payload(): array
    {
        return Cache::rememberForever(self::CACHE_KEY, fn (): array => $this->build());
    }

    public static function forget(): void
    {
        Cache::forget(self::CACHE_KEY);
    }

    /** @return array{categories: list<array<string, mixed>>, templates: list<array<string, mixed>>} */
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

        return [
            'categories' => $categories->map(fn (Category $c): array => $c->toCatalogArray())->values()->all(),
            'templates'  => $templates
                ->map(fn (Template $t): array => $t->toCatalogArray($slugs[$t->category_id] ?? null))
                ->values()->all(),
        ];
    }
}
