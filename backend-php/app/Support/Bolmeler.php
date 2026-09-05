<?php

declare(strict_types=1);

namespace App\Support;

/**
 * Saytın bölmələri və hansının açıq olduğu.
 *
 * Bu sinif framework tanımır (`App\Support` qaydası) — yalnız açar
 * siyahısı, təmizləmə və «ana səhifə hansı bölmədir» qərarı. Parametrin
 * özü `Setting`-dədir, oxunması `BolmeService`-dədir.
 *
 * NİYƏ ÜMUMİYYƏTLƏ LAZIMDIR: sayt üç ayrı məhsul daşıyır və onlar bir-birini
 * tanımır. Birini istehsalata buraxıb qalanını hazırlamağa davam etmək
 * istəyəndə yeganə düzgün yol həmin ünvanların MÖVCUD OLMAMASIDIR — kodu
 * silmək və ya `.env`-də şərtlər yığmaq deyil.
 */
final class Bolmeler
{
    /** Sıra ƏHƏMİYYƏTLİDİR: ana səhifə bağlıdırsa, ehtiyat bu sıra ilə seçilir. */
    public const ACARLAR = ['is', 'zarafat', 'devet'];

    /** Naməlum açar heç vaxt qəbul edilmir — `Sanitizer::pick` məntiqi. */
    public static function var(string $acar): bool
    {
        return in_array($acar, self::ACARLAR, true);
    }

    /**
     * Yalnız tanınan açarları saxlayır və hamısına bool dəyər verir.
     *
     * @param  array<string,mixed>  $xam
     * @param  array<string,bool>   $ilkin  parametr yoxdursa işlənən dəyər
     * @return array<string,bool>
     */
    public static function temizle(array $xam, array $ilkin = []): array
    {
        $out = [];

        foreach (self::ACARLAR as $a) {
            $out[$a] = array_key_exists($a, $xam)
                ? filter_var($xam[$a], FILTER_VALIDATE_BOOL)
                : (bool) ($ilkin[$a] ?? true);
        }

        return $out;
    }

    /**
     * Ana səhifə hansı bölməyə aiddir.
     *
     * SEÇİLMİŞ BÖLMƏ BAĞLIDIRSA AÇIQ OLANA KEÇİLİR: əks halda sayt kökü
     * bağlı bölməyə yönləndirər və ziyarətçi 404 alardı — yəni bir parametri
     * səhv qoymaq bütün saytı bağlayardı.
     *
     * @param  array<string,bool>  $aciq
     */
    public static function anaSehife(array $aciq, string $secim): ?string
    {
        if (self::var($secim) && ($aciq[$secim] ?? false)) {
            return $secim;
        }

        foreach (self::ACARLAR as $a) {
            if ($aciq[$a] ?? false) {
                return $a;
            }
        }

        return null;
    }
}
