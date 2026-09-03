<?php

declare(strict_types=1);

namespace App\Support\Dossier;

/**
 * Sənəd mətninin HTML-ə çevrilməsi.
 *
 * Qayda birdir: ƏVVƏLCƏ hər şey escape olunur, SONRA yalnız üç işarə açılır.
 * Belədə məzmun bazadan gəlsə də, sonradan idarə panelindən yazılsa da,
 * heç bir teq keçmir — mətn HTML deyil, mətndir.
 *
 *   **qalın**      → <b>qalın</b>
 *   [[qırmızı]]    → <span class="redpen">qırmızı</span>   (müstəntiqin qələmi)
 *   sətir sonu     → <br>
 *   {{açar}}       → dəyər (özü də escape olunur)
 *
 * `App\Support` altındakı hər şey kimi framework-siz: `e()` yerinə
 * `htmlspecialchars`, ona görə tests/logic.php faylı `require` ilə yoxlaya bilir.
 */
final class Metn
{
    public static function escape(mixed $value): string
    {
        return htmlspecialchars(is_scalar($value) ? (string) $value : '', ENT_QUOTES, 'UTF-8');
    }

    /** @param array<string,string> $vals `{{açar}}` əvəzləmələri */
    public static function inline(mixed $value, array $vals = []): string
    {
        $out = self::escape($value);

        $out = preg_replace('/\*\*(.+?)\*\*/us', '<b>$1</b>', $out) ?? $out;
        $out = preg_replace('/\[\[(.+?)\]\]/us', '<span class="redpen">$1</span>', $out) ?? $out;
        $out = str_replace(["\r\n", "\r", "\n"], '<br>', $out);

        /* Əvəzləmə ƏN AXIRDA gedir: dəyərin içindəki `**` və ya `[[` işarəsi
           heç bir halda markup kimi oxunmasın. Dəyər ayrıca escape olunur. */
        return self::fill($out, $vals);
    }

    /** @param array<string,string> $vals */
    public static function fill(string $html, array $vals): string
    {
        if ($vals === []) {
            return $html;
        }

        $axtar = [];
        $evez = [];

        foreach ($vals as $k => $v) {
            $axtar[] = '{{' . $k . '}}';
            $evez[] = self::escape($v);
        }

        return str_replace($axtar, $evez, $html);
    }
}
