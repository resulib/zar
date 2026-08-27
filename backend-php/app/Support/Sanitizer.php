<?php

declare(strict_types=1);

namespace App\Support;

/**
 * İstifadəçi mətnlərinin təmizlənməsi. Sənəd SVG-yə düşdüyü üçün
 * sətir sonları və artıq boşluqlar burada normallaşdırılır.
 */
final class Sanitizer
{
    public static function text(mixed $value, int $max): string
    {
        $v = is_scalar($value) ? (string) $value : '';
        $v = preg_replace('/\s+/u', ' ', $v) ?? '';

        return mb_substr(trim($v), 0, $max, 'UTF-8');
    }

    /** Hər sətir ayrı bənddir; boş sətirlər atılır, say və uzunluq məhdudlaşdırılır. */
    public static function multiline(mixed $value, int $max, int $maxLines): string
    {
        $v = is_scalar($value) ? (string) $value : '';
        $v = str_replace(["\r\n", "\r"], "\n", $v);

        $lines = [];
        foreach (explode("\n", $v) as $line) {
            $line = trim(preg_replace('/[ \t]+/u', ' ', $line) ?? '');
            if ($line !== '') {
                $lines[] = $line;
            }
            if (count($lines) >= $maxLines) {
                break;
            }
        }

        return mb_substr(implode("\n", $lines), 0, $max, 'UTF-8');
    }

    /** @param list<string> $allowed */
    public static function pick(mixed $value, array $allowed, string $fallback): string
    {
        $v = is_scalar($value) ? (string) $value : '';

        return in_array($v, $allowed, true) ? $v : $fallback;
    }
}
