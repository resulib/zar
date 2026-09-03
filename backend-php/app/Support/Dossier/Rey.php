<?php

declare(strict_types=1);

namespace App\Support\Dossier;

/**
 * Yekun rəyin yoxlanması.
 *
 * Saf funksiyadır və BİLƏRƏKDƏN yalnız «düzdür / düz deyil» qaytarır:
 * hansı bəndin səhv olduğunu açsaydı, üç cəhd variantları bir-bir
 * yoxlamağa çatardı və oyun bitərdi.
 */
final class Rey
{
    /**
     * @param  array<int,mixed>  $cavablar  ziyarətçinin seçimləri (sual sırası ilə)
     * @param  list<int>         $duzgun    yalnız serverdə bilinən düzgün indekslər
     * @return array{ok:bool,tam:bool}      `tam` — bütün suallara cavab verilib
     */
    public static function yoxla(array $cavablar, array $duzgun): array
    {
        $verilen = self::normalize($cavablar, count($duzgun));

        foreach ($duzgun as $i => $d) {
            if ($verilen[$i] === null) {
                return ['ok' => false, 'tam' => false];
            }
        }

        foreach ($duzgun as $i => $d) {
            if ($verilen[$i] !== (int) $d) {
                return ['ok' => false, 'tam' => true];
            }
        }

        return ['ok' => true, 'tam' => true];
    }

    /**
     * Seçimləri sual sayına görə normallaşdırır.
     *
     * @param  array<int,mixed>  $cavablar
     * @return list<int|null>
     */
    public static function normalize(array $cavablar, int $say): array
    {
        $out = [];
        $list = array_values($cavablar);

        for ($i = 0; $i < $say; $i++) {
            $v = $list[$i] ?? null;
            $out[] = is_numeric($v) && (int) $v >= 0 ? (int) $v : null;
        }

        return $out;
    }
}
