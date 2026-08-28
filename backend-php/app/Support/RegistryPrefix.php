<?php

declare(strict_types=1);

namespace App\Support;

/**
 * Şablona görə qeydiyyat prefiksi.
 *
 * Viral şablonların hər biri öz prefiksini daşıyır — nömrənin özü sənədin
 * növünü bildirir. Xəritədə olmayan bütün şablonlar qlobal prefiksdə qalır.
 *
 * Prefikslər qəsdən yalnız ASCII hərflərdən ibarətdir: nömrə QR kodun URL-inə
 * düşür və {@see RegistryNumber::PATTERN} ilə route məhdudiyyəti [A-Z]{2,4}
 * tələb edir. «ÇÖLƏ ÇIXMA VİZASI» üçün ÇÇV yox, CCV işlədilir.
 */
final class RegistryPrefix
{
    /** @var array<string, string> templateId → prefiks */
    public const MAP = [
        'cole-cixma-vizasi'   => 'CCV',
        'hesab-davasi-qalibi' => 'HDQ',
        'gorduldu-arayisi'    => 'GRL',
        'bot-kimi-oynayir'    => 'BOT',
        'immunitet-vesiqesi'  => 'QSM',
    ];

    /** Naməlum və ya boş şablon üçün qlobal prefiks qaytarılır. */
    public static function for(?string $templateId, string $fallback): string
    {
        if ($templateId === null || $templateId === '') {
            return $fallback;
        }

        return self::MAP[$templateId] ?? $fallback;
    }
}
