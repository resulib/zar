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

    /* ---------------- variant siyahıları ----------------
       Saytda istifadəçi başlığı, bəndləri və cəza bəndini yazmır, adminin
       daxil etdiyi siyahıdan seçir. Açılan siyahı yalnız UI-dır — əsl
       məhdudiyyət bu iki metoddur. */

    /**
     * `pick()`-in mətn variantı. Müqayisədən əvvəl hər iki tərəf normallaşdırılır,
     * çünki HTML gediş-gəlişində ikiqat boşluq itə bilər. Qayıdan dəyər HƏMİŞƏ
     * `$allowed` üzvüdür; uyğun gəlməsə `$fallback`.
     *
     * @param  list<string>  $allowed
     */
    public static function pickText(mixed $value, array $allowed, string $fallback, int $max): string
    {
        $needle = self::text($value, $max);

        if ($needle !== '') {
            foreach ($allowed as $option) {
                if (self::text($option, $max) === $needle) {
                    return self::text($option, $max);
                }
            }
        }

        return self::text($fallback, $max);
    }

    /**
     * Çoxseçim. Sətir (\n ilə) və ya massiv qəbul edir.
     *
     * Nəticənin sırası HƏMİŞƏ `$allowed` sırasıdır — klikləmə sırası deyil.
     * Əks halda istifadəçinin yüklədiyi PNG ilə reyestrdəki nüsxə fərqli
     * sıralanardı (frontend `togglePower()` də eyni qaydanı tətbiq edir).
     *
     * `$min`-dən az üzv qalarsa boş massiv qaytarılır ki, çağıran şablonun
     * öz mətninə düşsün.
     *
     * @param  list<string>  $allowed
     * @return list<string>
     */
    public static function pickList(mixed $value, array $allowed, int $min, int $max, int $lineMax): array
    {
        if (is_array($value)) {
            $raw = $value;
        } elseif (is_scalar($value)) {
            $raw = preg_split('/\R/u', (string) $value) ?: [];
        } else {
            return [];
        }

        $wanted = [];
        foreach ($raw as $item) {
            $v = self::text($item, $lineMax);
            if ($v !== '') {
                $wanted[$v] = true;
            }
        }

        $out = [];
        foreach ($allowed as $option) {
            $v = self::text($option, $lineMax);
            if ($v !== '' && isset($wanted[$v])) {
                $out[] = $v;
            }
            if (count($out) >= $max) {
                break;
            }
        }

        return count($out) >= $min ? $out : [];
    }

    /* ---------------- anket sahələri ----------------
       `text()` massivi boş sətrə çevirir və bu davranış testlə kilidlənib.
       Struktur sahələr üçün ona görə ayrıca metodlar var. */

    /** Ad sahəsi: yalnız hərf, boşluq, defis və apostrof qalır. */
    public static function person(mixed $value, int $max): string
    {
        $v = self::text($value, $max * 2);
        $v = preg_replace("/[^\p{L}\p{M} '\-]/u", '', $v) ?? '';

        return mb_substr(trim($v), 0, $max, 'UTF-8');
    }

    /** «HH:MM» formatı; uyğun gəlmirsə boş sətir. */
    public static function clock(mixed $value): string
    {
        $v = self::text($value, 5);

        return preg_match('/^([01]\d|2[0-3]):[0-5]\d$/', $v) === 1 ? $v : '';
    }

    /** Tam ədəd, verilmiş aralıqda; kənarda və ya rəqəm deyilsə null. */
    public static function scale(mixed $value, int $min, int $max): ?int
    {
        if (! is_scalar($value) || ! preg_match('/^-?\d+$/', (string) $value)) {
            return null;
        }

        $n = (int) $value;

        return ($n >= $min && $n <= $max) ? $n : null;
    }

    /**
     * Ad siyahısı — boş elementlər atılır.
     *
     * @return list<string>
     */
    public static function list(mixed $value, int $maxItems, int $maxLen): array
    {
        if (! is_array($value)) {
            return [];
        }

        $out = [];
        foreach ($value as $item) {
            $v = self::person($item, $maxLen);
            if ($v !== '') {
                $out[] = $v;
            }
            if (count($out) >= $maxItems) {
                break;
            }
        }

        return $out;
    }

    /**
     * Çoxseçimli sahənin cavabları — sərbəst mətn deyil, amma yenə təmizlənir.
     *
     * @return list<string>
     */
    public static function checks(mixed $value, int $maxItems, int $maxLen): array
    {
        if (! is_array($value)) {
            return [];
        }

        $out = [];
        foreach ($value as $item) {
            $v = self::text($item, $maxLen);
            if ($v !== '') {
                $out[] = $v;
            }
            if (count($out) >= $maxItems) {
                break;
            }
        }

        return $out;
    }

    /**
     * Etiket→dəyər cədvəli: hər sətir dəqiq iki elementdir.
     *
     * @return list<array{0:string,1:string}>
     */
    public static function rows(mixed $value, int $maxRows, int $labelMax, int $valueMax): array
    {
        if (! is_array($value)) {
            return [];
        }

        $out = [];
        foreach ($value as $row) {
            if (! is_array($row)) {
                continue;
            }
            $row = array_values($row);
            $label = self::text($row[0] ?? null, $labelMax);
            if ($label === '') {
                continue;
            }
            $out[] = [$label, self::text($row[1] ?? null, $valueMax)];
            if (count($out) >= $maxRows) {
                break;
            }
        }

        return $out;
    }
}
