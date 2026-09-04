<?php

declare(strict_types=1);

namespace App\Support\Dossier;

/**
 * İmza cızması — `frontend/doc.js` faylındakı `signature()` funksiyasının
 * SERVER TƏRƏFİ. Saytın digər bölməsində bu cızma artıq işlənir və yaxşı
 * alınıb; burada eyni əyri, eyni toxum məntiqi ilə qurulur ki, iki bölmənin
 * imzası bir əldən çıxmış kimi görünsün.
 *
 * Alqoritm hərfi köçürülüb: FNV-1a 32-bit hash → xətti konqruent generator →
 * beş kubik seqment → sonda sola-aşağı qayıdan quyruq. Toxum imza sahibinin
 * adıdır, yəni EYNİ AD HƏMİŞƏ EYNİ İMZANI verir. Təsadüfilik olsaydı, vərəq
 * ikinci dəfə açılanda imza dəyişər və sənəd dərhal saxtalığını bildirərdi.
 *
 * `Math.imul` 32-bit işarəli vurmadır; PHP-nin tam ədədləri 64-bitdir, ona
 * görə vurma əl ilə yuxarı və aşağı yarımlara bölünür — əks halda nəticə
 * JS-dəki ilə üst-üstə düşmür.
 *
 * Freymvorksuzdur — `App\Support` qaydası.
 */
final class Imza
{
    public const EN = 150;
    public const HUND = 48;

    /** Cızmanın çəkildiyi sahə — kətanın içində kiçik kənar buraxılır. */
    private const X = 5.0;
    private const Y = 3.0;
    private const W = 136.0;
    private const H = 28.0;

    /** `Math.imul` — 32-bit işarəsiz nəticə. */
    private static function imul(int $a, int $b): int
    {
        $ah = ($a >> 16) & 0xFFFF;
        $al = $a & 0xFFFF;
        $bh = ($b >> 16) & 0xFFFF;
        $bl = $b & 0xFFFF;

        return (($al * $bl) + ((((($ah * $bl) + ($al * $bh)) & 0xFFFF) << 16))) & 0xFFFFFFFF;
    }

    /** FNV-1a. JS `charCodeAt` UTF-16 kod vahidi verir — burada da elədir. */
    private static function hash(string $s): int
    {
        $h = 2166136261;
        $u16 = mb_convert_encoding($s, 'UTF-16BE', 'UTF-8');
        $say = intdiv(strlen($u16), 2);

        for ($i = 0; $i < $say; $i++) {
            $c = (ord($u16[$i * 2]) << 8) | ord($u16[$i * 2 + 1]);
            $h = ($h ^ $c) & 0xFFFFFFFF;
            $h = self::imul($h, 16777619);
        }

        return $h & 0xFFFFFFFF;
    }

    /**
     * Ada görə sabit imza yolu (`<path d="…">`).
     * Ad boş olsa da etibarlı yol qaytarılır.
     */
    public static function yol(string $ad): string
    {
        $s = self::hash($ad === '' ? 'imza' : $ad) ?: 1;

        $r = static function () use (&$s): float {
            $s = (self::imul($s, 1664525) + 1013904223) & 0xFFFFFFFF;

            return ($s >> 8) / 16777216;
        };

        [$x, $y, $w, $h] = [self::X, self::Y, self::W, self::H];
        $n = 5;
        $addim = $w / $n;

        $d = sprintf('M %.2f %.2f', $x, $y + $h * 0.75);

        for ($i = 1; $i <= $n; $i++) {
            $px = $x + $addim * $i;
            $d .= sprintf(' C %.2f %.2f, %.2f %.2f, %.2f %.2f',
                $px - $addim * 0.7, $y + $h * $r(),
                $px - $addim * 0.25, $y + $h * $r(),
                $px, $y + $h * (0.25 + 0.5 * $r()));
        }

        /* Son hərəkət — sola və aşağı qayıdan quyruq. İmzanın «bitdiyi» hissi
           məhz bundan gəlir və `doc.js`-də də eynidir. */
        $d .= sprintf(' q %.2f %.2f %.2f %.2f',
            -$w * 0.55, $h * 0.42, -$w * 0.15, $h * 0.5);

        return $d;
    }
}
