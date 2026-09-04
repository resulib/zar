<?php

declare(strict_types=1);

namespace App\Support\Dossier;

/**
 * Xidmət vəsiqəsinin nömrəsi: `CA-26-0147`.
 *
 * İki hərfli ŞÖBƏ KODU · qeydiyyat ilinin son iki rəqəmi · dörd rəqəmli
 * ARDICIL nömrə. Ardıcıllıq təsadüfilikdən qəsdən üstün tutulur: real xidmət
 * nişanında boşluq yoxdur və təsadüfi nömrə kartı oyuncağa çevirir.
 *
 * SIFIRLA DOLDURULMA SƏHV DEYİL, ŞƏRTDİR. Sabit en sayəsində leksikoqrafik
 * sıra ədədi sıra ilə üst-üstə düşür və `ProfileService::issueBadge()` növbəti
 * nömrəni sadə `ORDER BY badge_number DESC` ilə tapa bilir — mətn parsinqi və
 * ya ayrıca sayğac sütunu olmadan. `tests/logic.php` bunu ayrıca yoxlayır.
 *
 * Kod ASCII-dir, çünki nömrə Code-39 barkoduna girir (`RegistryPrefix::MAP`
 * ilə eyni səbəb: prefiks `CCV`-dir, `ÇÇV` deyil).
 */
final class VesiqeNo
{
    public const NIZAM = '/^[A-Z]{2}-\d{2}-\d{4}$/';

    /** Dörd rəqəmin tavanı. Dövr etmir — bu həddə format dəyişməlidir. */
    public const TAVAN = 9999;

    public static function format(string $kod, int $il, int $n): string
    {
        return strtoupper(substr($kod, 0, 2))
            . '-' . sprintf('%02d', $il % 100)
            . '-' . sprintf('%04d', max(1, min(self::TAVAN, $n)));
    }

    /** @return array{kod:string,il:int,n:int}|null */
    public static function parse(string $no): ?array
    {
        if (preg_match(self::NIZAM, $no) !== 1) {
            return null;
        }

        return [
            'kod' => substr($no, 0, 2),
            'il'  => (int) substr($no, 3, 2),
            'n'   => (int) substr($no, 6, 4),
        ];
    }

    public static function keceli(string $no): bool
    {
        return preg_match(self::NIZAM, $no) === 1;
    }

    /** Şöbə + il önəki — `issueBadge()` maksimumu bununla axtarır. */
    public static function onek(string $kod, int $il): string
    {
        return strtoupper(substr($kod, 0, 2)) . '-' . sprintf('%02d', $il % 100) . '-';
    }

    /** Nömrənin ardıcıl hissəsi. Format pozuqdursa 0. */
    public static function sira(?string $no): int
    {
        return $no !== null && self::keceli($no) ? (int) substr($no, 6, 4) : 0;
    }
}
