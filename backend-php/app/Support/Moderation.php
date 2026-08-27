<?php

declare(strict_types=1);

namespace App\Support;

/**
 * Sadə qadağan siyahısı süzgəci.
 * Azərbaycan hərflərini normallaşdırır ki, "QADAĞAN" və "qadagan" eyni sayılsın.
 */
final class Moderation
{
    /** @var list<string> */
    private array $words;

    /** @param list<string>|string $words vergüllə ayrılmış sətir və ya massiv */
    public function __construct(array|string $words)
    {
        $list = is_string($words) ? explode(',', $words) : $words;

        $this->words = array_values(array_filter(array_map(
            fn ($w) => self::normalize((string) $w),
            $list
        ), static fn (string $w): bool => $w !== ''));
    }

    public function flagged(string ...$texts): bool
    {
        if ($this->words === []) {
            return false;
        }

        $haystack = self::normalize(implode(' ', $texts));

        foreach ($this->words as $word) {
            if (str_contains($haystack, $word)) {
                return true;
            }
        }

        return false;
    }

    /** @return list<string> */
    public function words(): array
    {
        return $this->words;
    }

    /**
     * Azərbaycan hərflərini latın qarşılığına salır və kiçildir.
     * mb_strtolower tək başına «İ» hərfini düzgün emal etmir, ona görə əvvəlcə əvəzləyirik.
     */
    public static function normalize(string $text): string
    {
        $map = [
            'Ə' => 'e', 'ə' => 'e', 'Ğ' => 'g', 'ğ' => 'g',
            'İ' => 'i', 'ı' => 'i', 'I' => 'i', 'Ö' => 'o', 'ö' => 'o',
            'Ş' => 's', 'ş' => 's', 'Ü' => 'u', 'ü' => 'u', 'Ç' => 'c', 'ç' => 'c',
        ];

        $text = strtr($text, $map);
        $text = mb_strtolower($text, 'UTF-8');

        return trim(preg_replace('/\s+/u', ' ', $text) ?? '');
    }
}
