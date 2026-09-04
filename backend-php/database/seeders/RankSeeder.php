<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Rank;
use Illuminate\Database\Seeder;

/**
 * Doqquz rütbə.
 *
 * `CatalogSeeder` intizamı, BİR İSTİSNA ilə: `xp_required` hər işə salmada
 * yenidən yazılır. Eşiklər KODUN mülkiyyətidir, idarəçinin yox — düstur
 * dəyişəndə yenidən seed etmək «rütbələri yenidən hesabla» düyməsinin
 * yarısıdır. Buna görə `DatabaseSeeder`-də `DossierSeeder`-dən ƏVVƏL gəlir:
 * profil rütbəyə istinad edir, ona görə rütbələr əvvəlcə mövcud olmalıdır.
 *
 * ƏYRİ artan sürətlədir — Δ həmişə əvvəlkindən böyükdür
 * (40 · 110 · 230 · 420 · 650 · 950 · 1400 · 2200):
 *
 *  · İkinci pillə ZƏMANƏTLİDİR. Pulsuz `orta` işin ƏN PİS nəticəsi (iki
 *    uğursuz cəhd, kod tapılmadan) dəqiq 40 xaldır — yəni ilk işdən sonra
 *    irəliləyiş ortalama hesabla yox, HƏR ZAMAN hiss olunur.
 *  · Yuxarı pillələr 30–50 işlik kataloq üçün ölçülüb. Bu gün cəmi üç iş var
 *    və tavan 474 XP-dir (4-cü rütbə) — 5–9 əlçatmazdır. Bu, QƏSDƏNDİR:
 *    əyrini üç işə sığdırmaq üçün sıxmaq dördüncü iş çıxan gün geri
 *    qaytarılmalı olardı. Profil ekranı kilidli pillələri solğun göstərir.
 */
class RankSeeder extends Seeder
{
    /** @var list<array{int,string,string,int,string,string}> */
    private const RUTBELER = [
        // level, tam ad, qısa ad, XP həddi, nişan, rəng tokeni
        [1, 'Stajçı',                            'Stajçı',        0,    'sirit-bos',    'ink3'],
        [2, 'Kiçik Müstəntiq',                   'K. Müstəntiq',  40,   'sirit-1',      'ink3'],
        [3, 'Müstəntiq',                         'Müstəntiq',     150,  'sirit-2',      'ink2'],
        [4, 'Böyük Müstəntiq',                   'B. Müstəntiq',  380,  'sirit-3',      'ink2'],
        [5, 'Xüsusi Tapşırıqlar üzrə Müstəntiq', 'XT Müstəntiq',  800,  'sirit-3-zol',  'buff3'],
        [6, 'Şöbə Rəisi',                        'Şöbə Rəisi',    1450, 'ulduz-1',      'buff2'],
        [7, 'Baş Müstəntiq',                     'Baş Müstəntiq', 2400, 'ulduz-2',      'buff'],
        [8, 'Ekspert-Kriminalist',               'Ekspert',       3800, 'ulduz-3',      'stamp'],
        [9, 'Baş Müfəttiş',                      'Baş Müfəttiş',  6000, 'ulduz-celeng', 'red'],
    ];

    public function run(): void
    {
        foreach (self::RUTBELER as [$level, $ad, $qisa, $xp, $nisan, $reng]) {
            $rutbe = Rank::query()->firstOrNew(['level' => $level]);

            $rutbe->fill([
                'title_az'      => $ad,
                'title_short'   => $qisa,
                'xp_required'   => $xp,
                'insignia_type' => $nisan,
                'color_token'   => $reng,
            ])->save();
        }

        $this->command?->info('Rütbələr: ' . count(self::RUTBELER) . ' pillə hazırdır.');
    }
}
