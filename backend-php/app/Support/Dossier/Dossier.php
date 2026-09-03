<?php

declare(strict_types=1);

namespace App\Support\Dossier;

/**
 * İş qovluğu bölməsinin saf köməkçiləri.
 *
 * `App\Support` altındakı hər şey kimi bu sinif də framework-siz saxlanılır —
 * facade yox, helper yox. Belədə tests/logic.php faylı sadəcə `require` edib
 * yoxlaya bilir.
 */
final class Dossier
{
    /** Sertifikat linkinin açarı. Təxmin edilə bilməməlidir. */
    public const TOKEN_LEN = 22;
    public const TOKEN_PATTERN = '/^[A-Za-z0-9]{22}$/';

    /** İş nömrəsinin ünvan forması: «2026-0847». */
    public const SLUG_PATTERN = '/^[0-9]{4}-[0-9]{4}$/';

    private const ABC = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

    /**
     * Təxmin edilə bilməyən token.
     *
     * `random_int` (CSPRNG) işlədilir, `mt_rand` yox: sertifikat linki
     * paylaşılan ünvandır və ardıcıllığı görünən generator onu açardı.
     */
    public static function token(int $len = self::TOKEN_LEN): string
    {
        $out = '';
        $max = strlen(self::ABC) - 1;

        for ($i = 0; $i < $len; $i++) {
            $out .= self::ABC[random_int(0, $max)];
        }

        return $out;
    }

    public static function isToken(mixed $value): bool
    {
        return is_string($value) && preg_match(self::TOKEN_PATTERN, $value) === 1;
    }

    public static function isSlug(mixed $value): bool
    {
        return is_string($value) && preg_match(self::SLUG_PATTERN, $value) === 1;
    }

    /** «2026-0847» → «2026/0847». Baza sorğusu olmadan göstərmək üçün. */
    public static function nomre(string $slug): string
    {
        return self::isSlug($slug) ? str_replace('-', '/', $slug) : '';
    }

    /** «2026/0847» → «2026-0847». Seed faylının nömrəsindən ünvan qurur. */
    public static function slug(string $no): string
    {
        $s = str_replace('/', '-', trim($no));

        return self::isSlug($s) ? $s : '';
    }

    public static function certFile(string $token): string
    {
        return $token . '.jpg';
    }

    public static function link(string $base, string $slug): string
    {
        return rtrim($base, '/') . '/is/' . $slug;
    }

    public static function certLink(string $base, string $slug, string $token): string
    {
        return self::link($base, $slug) . '/hesabat/' . $token;
    }

    /**
     * Saniyəni sertifikatdakı dəqiqəyə çevirir.
     *
     * Yuxarı yuvarlaqlaşdırılır və ən azı 1-dir: «0 dəqiqəyə həll etdi»
     * sertifikatda saxta görünür, halbuki 40 saniyəlik oyun mümkün deyil.
     */
    public static function deqiqe(?int $saniye): int
    {
        if ($saniye === null || $saniye <= 0) {
            return 1;
        }

        return (int) max(1, (int) ceil($saniye / 60));
    }
}
