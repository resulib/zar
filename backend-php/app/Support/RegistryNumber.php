<?php

declare(strict_types=1);

namespace App\Support;

/**
 * Qeydiyyat nömrəsi: ZRF-2026-9482.
 * Prefiks qəsdən dövlət reyestri formatına oxşamır.
 */
final class RegistryNumber
{
    public const PATTERN = '/^[A-Z]{2,4}-\d{4}-\d{4}$/';

    /**
     * @param callable(string):bool $exists nömrənin artıq mövcud olub-olmadığını yoxlayır
     * @throws \RuntimeException boş nömrə tapılmadıqda
     */
    public static function generate(string $prefix, int $year, callable $exists, int $attempts = 60): string
    {
        for ($i = 0; $i < $attempts; $i++) {
            $candidate = self::format($prefix, $year, random_int(1000, 9999));
            if (! $exists($candidate)) {
                return $candidate;
            }
        }

        throw new \RuntimeException('Boş qeydiyyat nömrəsi tapılmadı.');
    }

    public static function format(string $prefix, int $year, int $number): string
    {
        return sprintf('%s-%04d-%04d', strtoupper($prefix), $year, $number);
    }

    /**
     * İstifadəçinin yazdığını normal formaya salır. Qəbul edilən variantlar:
     *   " #zrf 2026 9482 " · "ZRF20269482" · "2026-9482" · "9482"
     */
    public static function normalize(string $input, string $prefix, int $currentYear): string
    {
        $v = mb_strtoupper(trim($input), 'UTF-8');
        $v = str_replace('#', '', $v);

        // Boşluq, alt xətt və uzun tire variantlarını adi tire ilə əvəz edirik
        $v = preg_replace('/[\s_\x{2010}-\x{2015}]+/u', '-', $v) ?? '';
        $v = preg_replace('/-+/', '-', $v) ?? '';
        $v = trim($v, '-');

        if (preg_match('/^([A-Z]{2,4})-?(\d{4})-?(\d{4})$/', $v, $m) === 1) {
            return self::format($m[1], (int) $m[2], (int) $m[3]);
        }

        if (preg_match('/^(\d{4})-?(\d{4})$/', $v, $m) === 1) {
            return self::format($prefix, (int) $m[1], (int) $m[2]);
        }

        if (preg_match('/^\d{4}$/', $v) === 1) {
            return self::format($prefix, $currentYear, (int) $v);
        }

        return $v;
    }

    public static function isValid(string $regNo): bool
    {
        return preg_match(self::PATTERN, $regNo) === 1;
    }
}
