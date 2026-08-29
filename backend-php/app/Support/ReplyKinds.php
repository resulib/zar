<?php

declare(strict_types=1);

namespace App\Support;

/**
 * Cavab niyyətləri.
 *
 * `frontend/replies.js` `REPLY_KINDS` massivinin güzgüsüdür — ikonlar və
 * izahlar orada, burada isə serverin ehtiyac duyduğu ad/etiket/prefiks.
 * Siyahı dəyişəndə hər ikisi eyni anda dəyişməlidir.
 *
 * `App\Support` qəsdən çərçivəsizdir (CLAUDE.md) — `tests/logic.php` bu faylı
 * Laravel olmadan `require` edir. Burada facade və helper işlədilmir.
 */
final class ReplyKinds
{
    /** Zarafat tonunun beş niyyəti + xatirə tonunun yumşaq dəsti. */
    public const KINDS = ['redd', 'etiraz', 'tekrar', 'legv', 'qebul', 'xatire'];

    /** Saytda və admin paneldə görünən adlar. */
    public const LABELS = [
        'redd'   => 'Rədd',
        'etiraz' => 'Etiraz',
        'tekrar' => 'Təkrar baxış',
        'legv'   => 'Ləğv',
        'qebul'  => 'Qüvvədə saxlanılma',
        'xatire' => 'Xatirə cavabı',
    ];

    /**
     * Niyyət üzrə qeydiyyat prefiksi.
     *
     * YALNIZ ASCII: nömrə QR kodun URL-inə düşür, `RegistryNumber::PATTERN`
     * `[A-Z]{2,4}`-dür və `/r/{regNo}` marşrutunun məhdudiyyəti də belədir.
     * Ona görə «TKR», «QVD» — «TƏK», «QÜV» deyil.
     *
     * Bu, `tools/export-catalog.js`-in toxum üçün işlətdiyi xəritədir; canlı
     * dəyər həmişə `templates.reg_prefix` sütunundan gəlir.
     */
    public const PREFIX = [
        'redd'   => 'RDD',
        'etiraz' => 'ETZ',
        'tekrar' => 'TKR',
        'legv'   => 'LGV',
        'qebul'  => 'QVD',
        'xatire' => 'XCV',
    ];

    /**
     * Orijinal sənədin cavablardan sonrakı görünən vəziyyəti (spec §12).
     *
     * QƏSDƏN TÖRƏMƏDİR: orijinalın sətri dəyişdirilmir. Əks halda yad bir
     * ziyarətçi sizin sənədinizin vəziyyətini dəyişə bilərdi — cavab yazmaq
     * hamıya açıqdır. Nişan yalnız zəncir vidcetində göstərilir, SVG-yə düşmür.
     */
    /* Açarların sırası `KINDS` ilə eynidir — `tests/logic.php` bunu yoxlayır,
       beləcə yeni niyyət əlavə edən üç sabitin hamısını yeniləməyi unutmur. */
    public const VERDICT = [
        'redd'   => ['dot' => 'bad',  'label' => 'RƏDD EDİLİB'],
        'etiraz' => ['dot' => 'wait', 'label' => 'BAXILMAQDADIR'],
        'tekrar' => ['dot' => 'wait', 'label' => 'BAXILMAQDADIR'],
        'legv'   => ['dot' => 'off',  'label' => 'LƏĞV EDİLİB'],
        'qebul'  => ['dot' => 'ok',   'label' => 'QÜVVƏDƏDİR'],
        'xatire' => ['dot' => 'ok',   'label' => 'CAVABLANDIRILIB'],
    ];

    /** Zəncirin maksimum dərinliyi — sonsuz cavab döngəsinə qarşı tavan. */
    public const MAX_DEPTH = 12;

    public static function isValid(mixed $kind): bool
    {
        return is_string($kind) && in_array($kind, self::KINDS, true);
    }

    public static function label(?string $kind): string
    {
        return self::LABELS[$kind] ?? '';
    }

    public static function prefix(?string $kind, string $fallback): string
    {
        return self::PREFIX[$kind] ?? $fallback;
    }

    /** @return array{dot: string, label: string}|null */
    public static function verdict(?string $kind): ?array
    {
        return self::VERDICT[$kind] ?? null;
    }

    /**
     * Zəncirin yeni dərinliyi. Tavanı aşırsa null qaytarır — çağıran bunu
     * xətaya çevirir. Ayrıca funksiyadır ki, `tests/logic.php` onu Laravel
     * olmadan yoxlaya bilsin.
     */
    public static function nextDepth(int $parentDepth): ?int
    {
        $next = $parentDepth + 1;

        return $next > self::MAX_DEPTH ? null : $next;
    }
}
