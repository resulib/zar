<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\DossierDocument;
use App\Models\DossierImage;
use App\Support\Dossier\BlokSxemi;
use App\Support\Dossier\Isare;
use App\Support\Dossier\Metn;
use App\Support\Sanitizer;
use Illuminate\Support\Facades\View;

/**
 * Vərəqin mətnini HTML-ə çevirən qat.
 *
 * `App\Support\Dossier\Isare` mətni parçalara bölür — o, framework-sizdir və
 * `tests/logic.php` onu birbaşa yükləyir. Bu sinif isə Blade çağırır, ona görə
 * `app/Services/`-dədir: `App\Support` altında facade və helper işlətmək
 * qadağandır.
 *
 * VƏRƏQİN ÇƏRÇİVƏSİ BURADA DEYİL. Mikromətn haşiyəsi, gilyoş, kağız qatı,
 * möhür qatı və fiktivlik zolağı `sened.blade.php` sarğısındadır və hər üç
 * yol — kilid ekranı, bloklar, mətn — onun içindən keçir. Bu sinif yalnız
 * ortadakı məzmunu qaytarır.
 */
class SenedRender
{
    /**
     * Sənədin gövdəsi.
     *
     * @param array<string,DossierImage>  $sekiller  slug → şəkil
     * @param array<string,array<string,mixed>> $bloklar `acar` → blok
     * @param array<string,string> $vals `{{açar}}` əvəzləmələri
     * @param bool $admin idarə önizləməsi — çatışmayan nişan görünür
     */
    public function render(
        DossierDocument $doc,
        string $slug,
        array $sekiller,
        array $bloklar,
        array $vals,
        bool $admin = false
    ): string {
        $body = $doc->govde();

        if ($body === null) {
            return '';
        }

        $out = '';

        foreach (Isare::bol($body) as $parca) {
            $out .= match ($parca['nov']) {
                'sekil' => $this->sekil($parca['deyer'], $slug, $sekiller, $admin),
                'blok'  => $this->blok($parca['deyer'], $bloklar, $vals, $slug, $sekiller, $admin),
                default => $this->metn($parca['deyer'], $vals),
            };
        }

        return $out;
    }

    /**
     * Adi mətn — boş sətir abzası bölür.
     *
     * Abzaslar `Metn::inline()`-dan keçir, yəni `**qalın**`, `[[qırmızı]]`,
     * `((oxunmaz))` və qalan işarələr burada da işləyir: mətn `content.bloklar`
     * içindən `body`-yə köçəndə markup dili dəyişmir.
     */
    protected function metn(string $metn, array $vals): string
    {
        $abzaslar = preg_split('/\n[ \t]*\n/u', trim($metn, "\n")) ?: [];
        $govde = '';

        foreach ($abzaslar as $a) {
            $a = trim($a);

            if ($a === '') {
                continue;
            }

            $govde .= '<p>' . Metn::inline($a, $vals) . '</p>';
        }

        return $govde === '' ? '' : '<div class="p-body">' . $govde . '</div>';
    }

    /** Şəkil nişanı — növ ağ siyahıdan keçir, çünki görünüş adına çevrilir. */
    protected function sekil(string $ad, string $slug, array $sekiller, bool $admin): string
    {
        $sekil = $sekiller[$ad] ?? null;

        if (! $sekil instanceof DossierImage) {
            return $this->yoxdur('sekil', $ad, 'Bu açarla şəkil kitabxanada yoxdur.', $admin);
        }

        $nov = Sanitizer::pick(
            (string) $sekil->image_type,
            (array) config('dossier.sekil_novleri', []),
            DossierImage::NOV_GENERIC
        );

        return View::make('dossier.sekiller.' . $nov, [
            'sekil' => $sekil,
            'src'   => $sekil->url($slug, 'orta'),
            'izah'  => (string) $sekil->caption,
            'damga' => $this->damga($sekil),
            'bucaq' => $this->bucaq($sekil),
        ])->render();
    }

    /**
     * Blok nişanı — mətnin ortasına mövcud blok render qatını çağırır.
     *
     * Bloklar hansısa yeni sistem deyil: on üç növün hamısı elə həmin
     * `views/dossier/bloklar/` fayllarıdır. Yeni olan yalnız çağırış yeridir.
     */
    protected function blok(
        string $ad,
        array $bloklar,
        array $vals,
        string $slug,
        array $sekiller,
        bool $admin
    ): string
    {
        $b = $bloklar[$ad] ?? null;

        if (! is_array($b)) {
            return $this->yoxdur('blok', $ad, 'Bu açarla blok sənədin bloklar siyahısında yoxdur.', $admin);
        }

        $tip = (string) ($b['tip'] ?? '');

        if (! in_array($tip, BlokSxemi::BLOKLAR, true)) {
            return $this->yoxdur('blok', $ad, 'Blokun növü tanınmır: «' . $tip . '».', $admin);
        }

        /* Görünüş adı ƏVVƏLCƏ dəyişənə yığılır: `tests/audit.php` §5 yalnız
           `@include('literal')` formasını oxuyur və hesablanmış adı görməməlidir. */
        $blokView = 'dossier.bloklar.' . $tip;

        /* Blok görünüşləri şəkil xəritəsini də görür: maddi sübut kartoçkası
           öz fotosunu ondan götürür. */
        return View::make($blokView, [
            'b'        => $b,
            'vals'     => $vals,
            'sekiller' => $sekiller,
            'slug'     => $slug,
        ])->render();
    }

    /**
     * Tapılmayan nişan.
     *
     * Oyunçuda BOŞ SƏTİRDİR: yarımçıq redaktə oxucuya xəta kimi görünməməlidir.
     * İdarə önizləməsində isə qırmızı bloka çevrilir — orada gizlətmək
     * səhvi gec tapmaq deməkdir.
     */
    protected function yoxdur(string $nov, string $ad, string $mesaj, bool $admin): string
    {
        if (! $admin) {
            return '';
        }

        return View::make('dossier.sekiller.yoxdur', [
            'nov'   => $nov,
            'ad'    => $ad,
            'mesaj' => $mesaj,
        ])->render();
    }

    /**
     * Kamera kadrının künc damğası — izahın içindəki ilk saat.
     *
     * Ayrıca sütun açmırıq: saat onsuz da izahda yazılır («00:47, giriş qapısı»)
     * və iki yerdə saxlanılan dəyər gec-tez fərqlənir.
     */
    protected function damga(DossierImage $sekil): string
    {
        if (preg_match('/\b([01]?\d|2[0-3]):[0-5]\d(:[0-5]\d)?\b/', (string) $sekil->caption, $m) === 1) {
            return $m[0];
        }

        return '';
    }

    /**
     * Surətin əyilik bucağı — şəklin id-sindən törəyir.
     *
     * `rand()` OLMAZ: vərəq ikinci dəfə açılanda bucaq dəyişsə, sənəd özünü
     * saxta elan edər. Eyni intizam `Imza::yol()`-dadır.
     */
    protected function bucaq(DossierImage $sekil): string
    {
        $q = ((int) $sekil->id * 37) % 9;

        return number_format(($q - 4) * 0.35, 2, '.', '');
    }
}
