<?php

declare(strict_types=1);

namespace App\Support;

/**
 * Anket sxeminin (`fields`) yoxlanışı.
 *
 * `tools/check-templates.js` faylının 5-ci bölməsinin server tərəfi: admin
 * paneldən yazılan JSON eyni qaydalardan keçir, yoxsa səhv sxem birbaşa
 * saytın redaktoruna düşərdi.
 *
 * Freymvorksuzdur — `tests/logic.php` onu Laravel olmadan yükləyir.
 */
final class TemplateSchema
{
    public const TYPES = ['text', 'select', 'multi', 'list', 'scale', 'number', 'time', 'date', 'datetime'];
    public const INTO  = ['to', 'from', 'title'];

    /** Server `DocumentController::store()` validasiyası ilə eyni hədlər. */
    public const MAX_NOTES      = 8;
    public const MAX_NOTE_LEN   = 180;
    public const MAX_SHARE_LEN  = 180;
    public const MAX_FIELDS     = 14;
    public const MAX_LABEL_LEN  = 40;
    public const MAX_ROW_LEN    = 40;
    public const MAX_OPT_LEN    = 100;

    /* ---------------- variant siyahıları ----------------
       `MAX_PICK` 4-dür, 6 deyil: doc.js-də dizaynlar 4–7 bənd çəkir və beşi
       (lisenziya · arayis · teleqram · muqavile · notarial) cəmi 4 göstərir.
       İstifadəçi dizaynı işləmə vaxtı dəyişə bildiyi üçün yeganə təhlükəsiz
       say minimumdur. `MAX_POWER_LINE` 90: 4 × 90 + 3 = 363 ≤ limits.powers (600). */
    public const MAX_TITLE_OPTS   = 12;
    public const MAX_POWER_OPTS   = 20;
    public const MAX_PENALTY_OPTS = 10;
    public const MAX_POWER_LINE   = 90;
    public const MAX_PICK         = 4;

    /**
     * Sətir-sətir textarea → variant siyahısı.
     * Trim olunur, boş sətir və təkrar atılır, uzunluq kəsilmir (səhv kimi bildirilir).
     *
     * @return list<string>
     */
    public static function parseOptions(?string $raw, int $maxItems, int $maxLen): array
    {
        $raw = trim((string) $raw);

        if ($raw === '') {
            return [];
        }

        $out = [];
        foreach (preg_split('/\R/u', $raw) ?: [] as $line) {
            $line = trim(preg_replace('/[ \t]+/u', ' ', $line) ?? '');
            if ($line === '' || in_array($line, $out, true)) {
                continue;
            }
            $out[] = mb_substr($line, 0, $maxLen, 'UTF-8');
            if (count($out) >= $maxItems) {
                break;
            }
        }

        return $out;
    }

    /**
     * Variant siyahısının səhvləri — admin formasında sətir-sətir göstərilir.
     *
     * @return list<string>
     */
    public static function optionErrors(string $label, ?string $raw, int $maxItems, int $maxLen): array
    {
        $raw = trim((string) $raw);

        if ($raw === '') {
            return [];
        }

        $err  = [];
        $seen = [];
        $n    = 0;

        foreach (preg_split('/\R/u', $raw) ?: [] as $line) {
            $line = trim(preg_replace('/[ \t]+/u', ' ', $line) ?? '');
            if ($line === '') {
                continue;
            }
            $n++;

            if (mb_strlen($line) > $maxLen) {
                $err[] = "{$label}: {$n}-ci sətir {$maxLen} simvolu aşır.";
            }
            if (in_array($line, $seen, true)) {
                $err[] = "{$label}: {$n}-ci sətir təkrarlanır.";
            }
            $seen[] = $line;
        }

        if ($n > $maxItems) {
            $err[] = "{$label}: ən çoxu {$maxItems} sətir ola bilər, {$n} verilib.";
        }

        return $err;
    }

    /**
     * Bənd seçimi üçün say aralığı: 1 ≤ min ≤ max ≤ min(MAX_PICK, variant sayı).
     *
     * @return array{0:int,1:int}
     */
    public static function pickRange(mixed $min, mixed $max, int $count): array
    {
        if ($count < 1) {
            return [1, 1];
        }

        $ceil = min(self::MAX_PICK, $count);
        $lo   = Sanitizer::scale($min, 1, self::MAX_PICK) ?? 1;
        $hi   = Sanitizer::scale($max, 1, self::MAX_PICK) ?? self::MAX_PICK;

        $lo = max(1, min($lo, $ceil));
        $hi = max($lo, min($hi, $ceil));

        return [$lo, $hi];
    }

    /**
     * Sxemi yoxlayır və Azərbaycan dilində səhv siyahısı qaytarır.
     * Boş siyahı — sxem etibarlıdır.
     *
     * @param  mixed  $fields  `fields` massivi (və ya null)
     * @param  list<string>  $notes
     * @return list<string>
     */
    public static function validate(mixed $fields, array $notes = [], ?string $share = null, string $preamble = ''): array
    {
        $err = [];

        if ($fields === null || $fields === []) {
            $err = array_merge($err, self::placeholderErrors([], $notes, $share, $preamble));

            return $err;
        }

        if (! is_array($fields) || ! array_is_list($fields)) {
            return ['Anket sxemi massiv (JSON array) olmalıdır.'];
        }

        if (count($fields) > self::MAX_FIELDS) {
            $err[] = 'Ən çoxu ' . self::MAX_FIELDS . ' sahə ola bilər, ' . count($fields) . ' verilib.';
        }

        $keys   = [];
        $expiry = 0;

        foreach ($fields as $i => $f) {
            $n = $i + 1;

            if (! is_array($f)) {
                $err[] = "{$n}-ci sahə obyekt deyil.";
                continue;
            }

            $k = $f['k'] ?? null;
            $t = $f['t'] ?? null;

            if (! is_string($k) || preg_match('/^[a-z0-9_]{1,20}$/', $k) !== 1) {
                $err[] = "{$n}-ci sahə: «k» yalnız kiçik hərf, rəqəm və alt xətt ola bilər (≤20).";
            } elseif (in_array($k, $keys, true)) {
                $err[] = "{$n}-ci sahə: «{$k}» açarı təkrarlanır.";
            } else {
                $keys[] = $k;
            }

            if (! is_string($t) || ! in_array($t, self::TYPES, true)) {
                $err[] = "{$n}-ci sahə: naməlum tip «" . (is_string($t) ? $t : gettype($t)) . '». İcazəlilər: ' . implode(', ', self::TYPES) . '.';
                continue;
            }

            $auto = $f['auto'] ?? null;

            if ($auto === null && (! isset($f['label']) || ! is_string($f['label']) || trim($f['label']) === '')) {
                $err[] = "{$n}-ci sahə: «label» boş ola bilməz.";
            }

            foreach (['label' => self::MAX_LABEL_LEN, 'row' => self::MAX_ROW_LEN, 'unit' => 12, 'hint' => 120] as $key => $max) {
                if (isset($f[$key]) && is_string($f[$key]) && mb_strlen($f[$key]) > $max) {
                    $err[] = "{$n}-ci sahə: «{$key}» {$max} simvolu aşır.";
                }
            }

            if (isset($f['into']) && ! in_array($f['into'], self::INTO, true)) {
                $err[] = "{$n}-ci sahə: «into» yalnız " . implode(' / ', self::INTO) . ' ola bilər.';
            }

            if (! empty($f['expiry'])) {
                $expiry++;
                if ($f['expiry'] !== true && $f['expiry'] !== 'hours') {
                    $err[] = "{$n}-ci sahə: «expiry» yalnız true (HH:MM) və ya \"hours\" ola bilər.";
                }
                if ($f['expiry'] === true && $t !== 'time') {
                    $err[] = "{$n}-ci sahə: «expiry: true» yalnız «time» tipində işləyir.";
                }
                if ($f['expiry'] === 'hours' && $t !== 'number') {
                    $err[] = "{$n}-ci sahə: «expiry: \"hours\"» yalnız «number» tipində işləyir.";
                }
            }

            $err = array_merge($err, self::typeErrors($n, $t, $f));
        }

        if ($expiry > 1) {
            $err[] = 'Şablonda yalnız bir «expiry» sahəsi ola bilər, ' . $expiry . ' var.';
        }

        $err = array_merge($err, self::placeholderErrors($keys, $notes, $share, $preamble));

        return $err;
    }

    /** @return list<string> */
    private static function typeErrors(int $n, string $t, array $f): array
    {
        $err = [];

        if ($t === 'select' || $t === 'multi') {
            $opts = $f['opts'] ?? null;
            if (! is_array($opts) || $opts === []) {
                $err[] = "{$n}-ci sahə: «opts» siyahısı boş ola bilməz.";

                return $err;
            }
            foreach ($opts as $o) {
                if (! is_string($o) || trim($o) === '') {
                    $err[] = "{$n}-ci sahə: «opts» yalnız mətn elementlərindən ibarət olmalıdır.";
                    break;
                }
                if (mb_strlen($o) > self::MAX_OPT_LEN) {
                    $err[] = "{$n}-ci sahə: variant " . self::MAX_OPT_LEN . ' simvolu aşır.';
                    break;
                }
            }
        }

        if ($t === 'multi') {
            $opts = is_array($f['opts'] ?? null) ? $f['opts'] : [];
            $min  = $f['min'] ?? null;
            $max  = $f['max'] ?? null;

            if (! is_int($min) || ! is_int($max) || $min < 1 || $min > $max || $max > count($opts)) {
                $err[] = "{$n}-ci sahə: «min» və «max» 1 ≤ min ≤ max ≤ variant sayı şərtini ödəməlidir.";
            }

            $def = $f['def'] ?? null;
            if ($def !== null) {
                if (! is_array($def)) {
                    $err[] = "{$n}-ci sahə: «def» massiv olmalıdır.";
                } else {
                    foreach ($def as $d) {
                        if (! in_array($d, $opts, true)) {
                            $err[] = "{$n}-ci sahə: «def» variantlar arasında olmayan dəyər daşıyır.";
                            break;
                        }
                    }
                    if (is_int($min) && count($def) < $min) {
                        $err[] = "{$n}-ci sahə: «def» ən azı {$min} element daşımalıdır.";
                    }
                }
            }
        }

        if ($t === 'scale') {
            $min = $f['min'] ?? null;
            $max = $f['max'] ?? null;
            if (! is_int($min) || ! is_int($max) || $min >= $max || $max > 10 || $min < 0) {
                $err[] = "{$n}-ci sahə: şkala üçün 0 ≤ min < max ≤ 10 olmalıdır.";
            }
        }

        if ($t === 'number') {
            foreach (['min', 'max'] as $key) {
                if (isset($f[$key]) && ! is_int($f[$key])) {
                    $err[] = "{$n}-ci sahə: «{$key}» tam ədəd olmalıdır.";
                }
            }
            if (isset($f['min'], $f['max']) && is_int($f['min']) && is_int($f['max']) && $f['min'] > $f['max']) {
                $err[] = "{$n}-ci sahə: «min» «max»-dan böyükdür.";
            }
        }

        if ($t === 'list') {
            $count = $f['count'] ?? null;
            if ($count !== null && (! is_int($count) || $count < 1 || $count > 8)) {
                $err[] = "{$n}-ci sahə: «count» 1 ilə 8 arasında olmalıdır.";
            }
        }

        return $err;
    }

    /**
     * `{{k}}` yer tutucuları mövcud sahələrə uyğun gəlməlidir, yoxsa sənəddə
     * hərfi «{{k}}» görünər.
     *
     * @param  list<string>  $keys
     * @param  list<string>  $notes
     * @return list<string>
     */
    private static function placeholderErrors(array $keys, array $notes, ?string $share, string $preamble): array
    {
        $err  = [];
        $text = $preamble . ' ' . (string) $share . ' ' . implode(' ', $notes);

        if (preg_match_all('/\{\{(\w+)\}\}/u', $text, $m) === false) {
            return $err;
        }

        foreach (array_unique($m[1] ?? []) as $ref) {
            if (! in_array($ref, $keys, true)) {
                $err[] = $keys === []
                    ? "«{{{$ref}}}» yer tutucusu var, amma şablonda anket sahəsi yoxdur."
                    : "«{{{$ref}}}» yer tutucusu heç bir sahəyə uyğun gəlmir.";
            }
        }

        if (count($notes) > self::MAX_NOTES) {
            $err[] = 'Ən çoxu ' . self::MAX_NOTES . ' qeyd ola bilər, ' . count($notes) . ' verilib.';
        }

        foreach ($notes as $i => $note) {
            if (mb_strlen((string) $note) > self::MAX_NOTE_LEN) {
                $err[] = ($i + 1) . '-ci qeyd ' . self::MAX_NOTE_LEN . ' simvolu aşır.';
            }
        }

        if ($share !== null && mb_strlen($share) > self::MAX_SHARE_LEN) {
            $err[] = 'Paylaşım mətni ' . self::MAX_SHARE_LEN . ' simvolu aşır.';
        }

        return $err;
    }
}
