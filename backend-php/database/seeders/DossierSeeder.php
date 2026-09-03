<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Dossier;
use App\Models\DossierDocument;
use App\Models\DossierQuestion;
use App\Support\Dossier\BlokSxemi;
use App\Support\Sanitizer;
use Illuminate\Database\Seeder;

/**
 * İş qovluqlarının bazaya köçürülməsi.
 *
 * Mənbə: `database/seeders/dossier/*.json` — hər qovluq bir fayldır.
 * İkinci və üçüncü qovluq yalnız yeni JSON faylı deməkdir; kodda heç bir
 * yerdə məzmun sabit yazılmır.
 *
 * Sənədlər və suallar hər dəfə tam yenidən yazılır (`slug` + `sort` açarı ilə),
 * qovluğun özündə isə `status` və `sort` yalnız sətir ilk dəfə yaradılanda
 * təyin olunur — CatalogSeeder-dəki eyni intizam: idarəçinin sonradan
 * söndürdüyü qovluq təkrar seed ilə geri qayıtmır.
 */
class DossierSeeder extends Seeder
{
    public function run(): void
    {
        $dir = __DIR__ . '/dossier';

        if (! is_dir($dir)) {
            $this->command?->error('database/seeders/dossier qovluğu tapılmadı.');

            return;
        }

        $files = glob($dir . '/*.json') ?: [];
        sort($files);

        if ($files === []) {
            $this->command?->warn('İş qovluğu faylı yoxdur.');

            return;
        }

        $sayi = 0;

        foreach ($files as $file) {
            $data = json_decode((string) file_get_contents($file), true);

            if (! is_array($data) || ! isset($data['slug'], $data['documents'])) {
                $this->command?->error(basename($file) . ' oxunmadı.');

                continue;
            }

            /* Blok quruluşu bazaya YÜKLƏNMƏZDƏN ƏVVƏL yoxlanılır: qovluqları
               əl ilə yazan adam səhv etsə, bunu dərhal bilməli, render zamanı
               ağ ekran görməməlidir. Bir səhv varsa fayl ÜMUMİYYƏTLƏ yüklənmir
               — yarımçıq qovluq yüklənmiş qovluqdan pisdir. */
            if (! $this->sxemYoxla($data)) {
                continue;
            }

            $sayi += $this->qovluq($data) ? 1 : 0;
        }

        $this->command?->info($sayi . ' iş qovluğu seed edildi.');
    }

    /**
     * Faylın bütün sənədlərini `BlokSxemi` ilə yoxlayır.
     *
     * Xətalar birdən yazılır — bir qovluqda on səhv varsa, onunu birdən
     * görmək lazımdır, bir-bir deyil.
     *
     * @param array<string,mixed> $data
     */
    protected function sxemYoxla(array $data): bool
    {
        $err = [];
        $xeb = [];

        foreach ((array) ($data['documents'] ?? []) as $sened) {
            [$e, $x] = BlokSxemi::yoxla((array) $sened);
            $err = array_merge($err, $e);
            $xeb = array_merge($xeb, $x);
        }

        foreach ($xeb as $x) {
            $this->command?->warn('  ~ ' . $data['slug'] . ' ' . $x);
        }

        if ($err === []) {
            return true;
        }

        $this->command?->error($data['slug'] . ' — blok quruluşunda ' . count($err) . ' səhv, fayl yüklənmədi:');

        foreach ($err as $e) {
            $this->command?->error('    ' . $e);
        }

        return false;
    }

    /** @param array<string,mixed> $data */
    protected function qovluq(array $data): bool
    {
        $dossier = Dossier::query()->firstOrNew(['slug' => (string) $data['slug']]);
        $yeni = ! $dossier->exists;

        $dossier->fill([
            'no'            => (string) ($data['no'] ?? ''),
            'title'         => (string) ($data['title'] ?? ''),
            'blurb'         => (string) ($data['blurb'] ?? ''),
            'place'         => (string) ($data['place'] ?? ''),
            'period'        => (string) ($data['period'] ?? ''),
            'intro'         => (string) ($data['intro'] ?? ''),
            'badge'         => Sanitizer::pick($data['badge'] ?? '', (array) config('dossier.badges'), ''),
            'is_showcase'   => (bool) ($data['showcase'] ?? false),
            'difficulty'    => Sanitizer::pick($data['difficulty'] ?? '', (array) config('dossier.difficulties'), 'orta'),
            'read_minutes'  => (int) ($data['readMinutes'] ?? 30),
            'price_credits' => (int) ($data['priceCredits'] ?? config('dossier.price_credits')),
            'cover'         => (array) ($data['cover'] ?? []),
            'meta'          => (array) ($data['meta'] ?? []),
            'suspects'      => (array) ($data['suspects'] ?? []),
            'chronology'    => (array) ($data['chronology'] ?? []),
            'axis'          => (array) ($data['axis'] ?? []),
            'solution'      => (array) ($data['solution'] ?? []),
        ]);

        if ($yeni) {
            $dossier->status = (string) ($data['status'] ?? Dossier::STATUS_DRAFT);
            $dossier->sort = (int) ($data['sort'] ?? 0);
        }

        $dossier->save();

        $this->senedler($dossier, (array) $data['documents']);
        $this->suallar($dossier, (array) ($data['questions'] ?? []));

        return true;
    }

    /** @param list<array<string,mixed>> $rows */
    protected function senedler(Dossier $dossier, array $rows): void
    {
        $qalan = $dossier->documents()->pluck('id', 'sort')->all();

        foreach (array_values($rows) as $i => $row) {
            $sort = $i + 1;
            $kilid = (array) ($row['kilid'] ?? []);

            $doc = DossierDocument::query()->firstOrNew([
                'dossier_id' => $dossier->id,
                'sort'       => $sort,
            ]);

            $doc->fill([
                'page'      => (string) ($row['page'] ?? ''),
                'name'      => (string) ($row['name'] ?? ''),
                'kind'      => (string) ($row['kind'] ?? ''),
                'is_locked' => (bool) ($row['locked'] ?? false),
                'is_sample' => (bool) ($row['sample'] ?? false),
                'lock_kind' => Sanitizer::pick($kilid['nov'] ?? 'reqem', BlokSxemi::KILID_NOV, 'reqem'),
                'lock_code' => (string) ($kilid['kod'] ?? ''),
                'lock_hint' => (string) ($kilid['ipucu'] ?? ''),
                'content'   => (array) ($row['content'] ?? []),
            ])->save();

            unset($qalan[$sort]);
        }

        // Fayldan çıxarılmış sənəd bazada qalmamalıdır.
        if ($qalan !== []) {
            DossierDocument::query()->whereIn('id', array_values($qalan))->delete();
        }
    }

    /** @param list<array<string,mixed>> $rows */
    protected function suallar(Dossier $dossier, array $rows): void
    {
        $qalan = $dossier->questions()->pluck('id', 'sort')->all();

        foreach (array_values($rows) as $i => $row) {
            $sort = $i + 1;
            $options = array_values(array_map('strval', (array) ($row['options'] ?? [])));

            $q = DossierQuestion::query()->firstOrNew([
                'dossier_id' => $dossier->id,
                'sort'       => $sort,
            ]);

            $q->fill([
                'prompt'        => (string) ($row['prompt'] ?? ''),
                'options'       => $options,
                'correct_index' => max(0, min(count($options) - 1, (int) ($row['correct'] ?? 0))),
                'explanation'   => (string) ($row['explanation'] ?? ''),
            ])->save();

            unset($qalan[$sort]);
        }

        if ($qalan !== []) {
            DossierQuestion::query()->whereIn('id', array_values($qalan))->delete();
        }
    }
}
