<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Template;
use App\Services\CatalogService;
use Illuminate\Database\Seeder;

/**
 * Kataloqun ilkin doldurulması.
 *
 * Mənbə: `database/seeders/catalog.json` — onu `node tools/export-catalog.js`
 * statik `frontend/templates.js` faylından yaradır.
 *
 * Seeder `updateOrCreate` işlədir və **admin dəyişikliklərini pozmur**:
 * mövcud sətirlərdə yalnız toxumda olan sahələr yenilənir, `is_active` və `sort`
 * isə yalnız sətir ilk dəfə yaradılanda təyin olunur.
 */
class CatalogSeeder extends Seeder
{
    public function run(): void
    {
        $file = __DIR__ . '/catalog.json';

        if (! is_file($file)) {
            $this->command?->error('catalog.json tapılmadı — əvvəlcə: node tools/export-catalog.js');

            return;
        }

        $data = json_decode((string) file_get_contents($file), true);

        if (! is_array($data) || ! isset($data['categories'], $data['templates'])) {
            $this->command?->error('catalog.json oxunmadı.');

            return;
        }

        $catIds = [];

        foreach ($data['categories'] as $c) {
            $cat = Category::query()->firstOrNew(['slug' => $c['slug']]);
            $new = ! $cat->exists;

            $cat->fill([
                'tone'  => $c['tone'],
                'name'  => $c['name'],
                'icon'  => $c['icon'] ?? null,
                'blurb' => $c['blurb'] ?? '',
                /* Cavab kateqoriyası bayrağı toxumun bir hissəsidir: səhv
                   dəyər cavab şablonlarını ana səhifənin şəbəkəsinə tökərdi. */
                'is_reply' => (bool) ($c['is_reply'] ?? false),
            ]);

            if ($new) {
                $cat->sort      = $c['sort'] ?? 0;
                $cat->is_active = true;
            }

            $cat->save();
            $catIds[$c['slug']] = $cat->id;
        }

        foreach ($data['templates'] as $t) {
            if (! isset($catIds[$t['category']])) {
                continue;
            }

            $tpl = Template::query()->firstOrNew(['slug' => $t['slug']]);
            $new = ! $tpl->exists;

            $tpl->fill([
                'category_id'    => $catIds[$t['category']],
                'tone'           => $t['tone'],
                'layout'         => $t['layout'],
                'palette'        => $t['palette'],
                'title'          => $t['title'],
                'tag'            => $t['tag'] ?? '',
                'preamble'       => $t['preamble'],
                'powers'         => $t['powers'],
                'penalty'        => $t['penalty'],
                'to_label'       => $t['to_label'] ?? null,
                'from_label'     => $t['from_label'] ?? null,
                'powers_label'   => $t['powers_label'] ?? null,
                'penalty_label'  => $t['penalty_label'] ?? null,
                'reg_prefix'     => $t['reg_prefix'] ?? null,
                /* Cavab qatı. Variant siyahılarından fərqli olaraq QORUNMUR:
                   `reply_kind` şablonun kimliyidir — onu adminin dəyişməsi
                   nəzərdə tutulmayıb, toxum isə həmişə doğru dəyəri daşıyır. */
                'reply_kind'     => $t['reply_kind'] ?? null,
                'reply_cats'     => $t['reply_cats'] ?? null,
                'sign_title'     => $t['sign_title'] ?? null,
                'sign_org'       => $t['sign_org'] ?? null,
                'share'          => $t['share'] ?? null,
                'fields'         => $t['fields'] ?? null,
                'notes'          => $t['notes'] ?? null,
                'cancel_reasons' => $t['cancel_reasons'] ?? null,
            ]);

            /* Variant siyahıları QORUNUR: köhnə catalog.json-da hamısı null olur və
               `fill()`-ə qoyulsalar, növbəti `db:seed` adminin daxil etdiyi bütün
               variantları sükutla silərdi — sayt xəbərsiz açılardı. Yalnız toxumda
               həqiqi dəyər varsa yazılır. */
            foreach (['title_options', 'powers_options', 'penalty_options', 'powers_min', 'powers_max'] as $key) {
                if (array_key_exists($key, $t) && $t[$key] !== null) {
                    $tpl->{$key} = $t[$key];
                }
            }

            /* `is_active` YALNIZ sətir ilk dəfə yaradılanda toxumdan götürülür —
               mövcud sətirdə adminin açıb-bağladığı vəziyyət toxunulmaz qalır.
               Qaralama şablonlar toxumda `is_active: false` ilə gəlir. */
            if ($new) {
                $tpl->sort      = $t['sort'] ?? 0;
                $tpl->is_active = $t['is_active'] ?? true;
            }

            $tpl->save();
        }

        /* `CatalogService::payload()` `rememberForever` işlədir — keş sıfırlanmasa
           sayt seed-dən sonra da köhnə kataloqu verməyə davam edər. Admin yazıları
           bunu özləri edir, seeder isə etmirdi. */
        CatalogService::forget();

        $this->command?->info(
            'Kataloq: ' . Category::query()->count() . ' kateqoriya · ' . Template::query()->count() . ' şablon'
            . ' · kataloq keşi sıfırlandı'
        );
    }
}
