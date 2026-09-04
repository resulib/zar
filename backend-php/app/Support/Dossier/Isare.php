<?php

declare(strict_types=1);

namespace App\Support\Dossier;

/**
 * Sənəd mətnindəki nişanların parsinqi.
 *
 * Vərəqin mətni bir bütövdür, amma onun içində iki şey mətn deyil:
 *
 *   {{ sekil:kamera-01 }}     → şəkil bloku
 *   {{ blok:zeng-cedveli }}   → mövcud blok render qatına körpü
 *
 * PREFİKS MƏCBURİDİR və bu, təsadüfi seçim deyil. `Metn::fill()` artıq
 * `{{açar}}` formasını dəyər əvəzləməsi üçün işlədir (`{{mustentiq}}` →
 * oyunçunun adı) və müqayisəni `str_replace('{{' . $k . '}}')` ilə, yəni
 * BOŞLUQSUZ və dəqiq aparır. Prefiksli, boşluqlu forma onunla heç bir halda
 * toqquşmur — iki sistem eyni mötərizələri paylaşır və bir-birini yemir.
 *
 * Sinif framework-sizdir (`App\Support` qaydası), ona görə `tests/logic.php`
 * onu sadəcə `require` edir. Blade çağıran hissə `App\Services\SenedRender`-dədir.
 */
final class Isare
{
    /** Tanınan nişan. Əlifba `BlokSxemi::acarDuzgun()` ilə eynidir. */
    public const NISAN = '/\{\{\s*(sekil|blok)\s*:\s*([a-z0-9][a-z0-9-]{0,58})\s*\}\}/u';

    /** Azərbaycan hərflərinin ASCII qarşılığı — böyük «İ» tələsinə görə açıq cədvəl. */
    private const FOLD = [
        'Ə' => 'e', 'ə' => 'e', 'Ğ' => 'g', 'ğ' => 'g', 'İ' => 'i', 'I' => 'i',
        'ı' => 'i', 'Ö' => 'o', 'ö' => 'o', 'Ş' => 's', 'ş' => 's',
        'Ü' => 'u', 'ü' => 'u', 'Ç' => 'c', 'ç' => 'c',
    ];

    /**
     * Mətni parçalara böl. Sıra saxlanılır, heç nə itmir.
     *
     * Bölmə `preg_split` + `PREG_SPLIT_DELIM_CAPTURE` ilə aparılır, `preg_replace`
     * ilə YOX: sətir sağ tərəfi olan əvəzləmə `$$`, `$&` və `$'` ardıcıllıqlarını
     * xüsusi oxuyar və mətndəki dollar işarəsi səssizcə itərdi.
     *
     * @return list<array{nov: string, deyer: string}>
     */
    public static function bol(string $body): array
    {
        $parca = preg_split(self::NISAN, $body, -1, PREG_SPLIT_DELIM_CAPTURE);

        if ($parca === false) {
            return [['nov' => 'metn', 'deyer' => $body]];
        }

        $out = [];
        $say = count($parca);

        /* Bölünmüş massiv belə düzülür: mətn, prefiks, ad, mətn, prefiks, ad, … */
        for ($i = 0; $i < $say; $i++) {
            if ($i % 3 === 0) {
                if ($parca[$i] !== '') {
                    $out[] = ['nov' => 'metn', 'deyer' => $parca[$i]];
                }

                continue;
            }

            if ($i % 3 === 1) {
                $out[] = ['nov' => $parca[$i], 'deyer' => $parca[$i + 1] ?? ''];
            }
        }

        return $out;
    }

    /**
     * Mətndəki bütün nişanlar — yoxlayıcı üçün.
     *
     * @return array{sekil: list<string>, blok: list<string>}
     */
    public static function nisanlar(string $body): array
    {
        $out = ['sekil' => [], 'blok' => []];

        if (preg_match_all(self::NISAN, $body, $m, PREG_SET_ORDER) === false) {
            return $out;
        }

        foreach ($m as $tap) {
            $out[$tap[1]][] = $tap[2];
        }

        $out['sekil'] = array_values(array_unique($out['sekil']));
        $out['blok'] = array_values(array_unique($out['blok']));

        return $out;
    }

    /** Mətnə yapışdırılacaq nişanın hazır forması. */
    public static function yaz(string $nov, string $ad): string
    {
        return '{{ ' . $nov . ':' . $ad . ' }}';
    }

    /**
     * Fayl adından slug təklifi: «Kamera 01.JPG» → «kamera-01».
     *
     * Müqayisə və çevirmə HƏMİŞƏ serverdə aparılır: JavaScript-də
     * `'İ'.toLowerCase()` iki kod nöqtəsi verir və `i` bayraqlı regex onu
     * tutmur, yəni brauzerdə qurulan slug serverdəkindən fərqlənə bilər.
     */
    public static function slugla(string $ad): string
    {
        $at = mb_strrpos($ad, '.');

        if ($at !== false && $at > 0) {
            $ad = mb_substr($ad, 0, $at);
        }

        $ad = strtr($ad, self::FOLD);
        $ad = mb_strtolower($ad, 'UTF-8');
        $ad = preg_replace('/[^a-z0-9]+/', '-', $ad) ?? '';
        $ad = trim($ad, '-');

        if ($ad === '' || preg_match('/^[a-z]/', $ad) !== 1 && preg_match('/^[0-9]/', $ad) !== 1) {
            $ad = 'sekil' . ($ad === '' ? '' : '-' . $ad);
        }

        return mb_substr($ad, 0, 59);
    }
}
