<?php

declare(strict_types=1);

namespace App\Support;

/**
 * Anket cavablarının server tərəfi.
 *
 * Bu sinif `frontend/app.js` faylının GÜZGÜSÜDÜR:
 *   clean() ↔ readFields()   (app.js:606-652)
 *   fill()  ↔ fill()         (app.js:536-542)
 *
 * Preamble serverdə yenidən qurulduğu üçün ikisi hərfi olaraq eyni nəticə
 * verməlidir — fərq olsa, istifadəçinin yüklədiyi PNG ilə reyestrdəki nüsxə
 * uyuşmaz. `tests/security.php` bunu hərfi sətir müqayisəsi ilə qoruyur.
 *
 * Freymvorksuzdur — `tests/logic.php` onu Laravel olmadan yükləyir.
 */
final class Answers
{
    /**
     * Cavabları sahə sxeminə görə təmizləyir.
     *
     * İterasiya `$fields`-dən gedir, girişdən yox: girişdəki naməlum açar
     * heç vaxt oxunmur.
     *
     * @param  mixed  $fields  şablonun `fields` massivi
     * @param  mixed  $input   klientin göndərdiyi `answers` xəritəsi
     * @return array<string, string|list<string>|int>
     */
    public static function clean(mixed $fields, mixed $input): array
    {
        if (! is_array($fields) || ! array_is_list($fields)) {
            return [];
        }

        $in  = is_array($input) ? $input : [];
        $out = [];

        foreach ($fields as $f) {
            if (! is_array($f) || ! isset($f['k'], $f['t']) || ! is_string($f['k'])) {
                continue;
            }

            $k    = $f['k'];
            $t    = $f['t'];
            $opts = is_array($f['opts'] ?? null) ? array_values($f['opts']) : [];
            $max  = is_int($f['max'] ?? null) ? $f['max'] : null;
            $v    = $in[$k] ?? null;

            /* `auto` — admin təyin edib, istifadəçi görmür və dəyişə bilmir. */
            if (isset($f['auto'])) {
                $out[$k] = Sanitizer::text($f['auto'], TemplateSchema::MAX_OPT_LEN);
                continue;
            }

            $out[$k] = match ($t) {
                /* `free: true` olan select-də «Özün yaz…» sərbəst mətn buraxır —
                   check-fields.js bu qapını qəsdən kilidləyib. */
                'select' => ! empty($f['free'])
                    ? Sanitizer::text($v, $max ?? 40)
                    : Sanitizer::pickText($v, $opts, $opts[0] ?? '', TemplateSchema::MAX_OPT_LEN),

                'multi' => Sanitizer::pickList(
                    $v,
                    $opts,
                    1,
                    is_int($f['max'] ?? null) ? $f['max'] : count($opts),
                    TemplateSchema::MAX_OPT_LEN
                ),

                'list' => Sanitizer::list($v, is_int($f['count'] ?? null) ? $f['count'] : 4, $max ?? 40),

                'text' => ! empty($f['person'])
                    ? Sanitizer::person($v, $max ?? 40)
                    : Sanitizer::text($v, $max ?? 40),

                'scale', 'number' => Sanitizer::scale(
                    $v,
                    is_int($f['min'] ?? null) ? $f['min'] : 0,
                    $max ?? 10
                ) ?? (is_int($f['min'] ?? null) ? $f['min'] : 0),

                'time' => Sanitizer::clock($v),

                'date' => self::stamp($v, '/^\d{4}-\d{2}-\d{2}$/'),

                'datetime' => self::stamp($v, '/^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}$/'),

                default => Sanitizer::text($v, $max ?? 40),
            };
        }

        return $out;
    }

    /**
     * `{{açar}}` yer tutucuları. `app.js:536-542` ilə eyni qaydalar:
     * boş və ya yoxdursa «—», massiv `, ` ilə birləşir.
     *
     * @param  array<string, mixed>  $answers
     */
    public static function fill(string $text, array $answers): string
    {
        return (string) preg_replace_callback(
            '/\{\{(\w+)\}\}/u',
            static function (array $m) use ($answers): string {
                $v = $answers[$m[1]] ?? null;

                if (is_array($v)) {
                    return $v === [] ? '—' : implode(', ', $v);
                }

                if ($v === null || $v === '') {
                    return '—';
                }

                return (string) $v;
            },
            $text
        );
    }

    /** Tarix/vaxt sahəsi — format uyğun gəlmirsə boş sətir. */
    private static function stamp(mixed $value, string $pattern): string
    {
        $v = Sanitizer::text($value, 24);

        return preg_match($pattern, $v) === 1 ? $v : '';
    }
}
