<?php

declare(strict_types=1);

namespace App\Support\Dossier;

/**
 * Şəkil faylının qəbulu və ölçülənməsi.
 *
 * Üç iş görür və üçü də təhlükəsizlik məsələsidir:
 *
 *   1. Gələn baytı GD ilə YENİDƏN KODLAŞDIRIR. Yüklənən fayl JPEG başlığı
 *      daşıyıb içində başqa şey gizlədə bilər; `imagecreatefromstring()` →
 *      `imagejpeg()` zənciri yalnız piksel saxlayır, qalan hər şeyi atır.
 *   2. Şəffaflığı AĞ fona yığır. PNG planını birbaşa JPEG-ə yazsaq, şəffaf
 *      sahələr qara çıxar və plan oxunmaz olar.
 *   3. Fayl adını `random_bytes` ilə qurur. Ad heç bir halda məzmunu
 *      bildirməməlidir — qovluqdakı adların siyahısı belə spoylerdir.
 *
 * `App\Support` qaydası: framework yoxdur, ona görə konfiqurasiya parametr
 * kimi ötürülür və `tests/logic.php` sinfi birbaşa yükləyə bilir.
 */
final class Sekil
{
    public const NOVLER = [IMAGETYPE_JPEG, IMAGETYPE_PNG, IMAGETYPE_WEBP];

    /** Diskdəki fayl adı — 32 onaltılıq simvol, həmişə `.jpg`. */
    public static function ad(): string
    {
        return bin2hex(random_bytes(16)) . '.jpg';
    }

    /**
     * Baytın şəkil olduğunu təsdiqlə və ölçüsünü qaytar.
     *
     * @return array{0:int,1:int}|null [en, hündürlük]
     */
    public static function olcu(string $binary): ?array
    {
        $info = @getimagesizefromstring($binary);

        if ($info === false || ! in_array((int) ($info[2] ?? 0), self::NOVLER, true)) {
            return null;
        }

        return [(int) $info[0], (int) $info[1]];
    }

    /**
     * Uzun tərəfi `$hedd` piksel olan JPEG. Şəkil onsuz da kiçikdirsə
     * BÖYÜDÜLMÜR — böyüdülmüş kadr sadəcə bulanıq kadrdır.
     *
     * `null` qaytarır: GD yoxdursa və ya bayt oxunmursa. Çağıran bunu
     * «şəkil qəbul edilmədi» kimi oxumalıdır, «boş şəkil» kimi yox.
     */
    public static function olcule(string $binary, int $hedd, int $keyfiyyet = 88): ?string
    {
        if (! function_exists('imagecreatefromstring')) {
            return null;
        }

        $src = @imagecreatefromstring($binary);

        if ($src === false) {
            return null;
        }

        $w = imagesx($src);
        $h = imagesy($src);
        $nisbet = max($w, $h) > $hedd ? $hedd / max($w, $h) : 1.0;

        $nw = max(1, (int) round($w * $nisbet));
        $nh = max(1, (int) round($h * $nisbet));

        $dst = imagecreatetruecolor($nw, $nh);

        /* Şəffaflıq AĞ fona yığılır: JPEG alfa saxlamır və doldurulmamış
           sahələr qara çıxardı. */
        $ag = imagecolorallocate($dst, 255, 255, 255);
        imagefilledrectangle($dst, 0, 0, $nw, $nh, $ag);
        imagecopyresampled($dst, $src, 0, 0, 0, 0, $nw, $nh, $w, $h);

        ob_start();
        imagejpeg($dst, null, $keyfiyyet);
        $out = (string) ob_get_clean();

        /* `imagedestroy()` ÇAĞIRILMIR: PHP 8.0-dan bəri təsirsizdir və 8.5-də
           deprecated-dir. Obyekt qaytarıldıqda GC onsuz da toplayır — eyni
           səbəbdən `PublicProvider` də `curl_close()` çağırmır. */
        return $out === '' ? null : $out;
    }
}
