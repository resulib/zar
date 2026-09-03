<?php

declare(strict_types=1);

namespace App\Support\Dossier;

/**
 * Hadisə yeri sxemi — serverdə saxlanan SVG.
 *
 * SVG olduğu kimi çıxarılır (`{!! !!}`), ona görə süzgəcdən keçir. Bu gün
 * məzmun yalnız seed faylından gəlir və etibarlıdır; süzgəc sabah idarə
 * panelindən yazılacağı üçün indidən qoyulub — o gün əlavə edilsə gec olar.
 *
 * Ağ siyahı yox, qara siyahı işlədilir və nəticə `<svg` ilə başlamalıdır:
 * fayl SVG deyilsə heç nə qaytarılmır.
 */
final class Sxem
{
    public static function temizle(mixed $value): string
    {
        $svg = is_string($value) ? trim($value) : '';

        if ($svg === '' || stripos($svg, '<svg') !== 0) {
            return '';
        }

        // DOCTYPE, xarici entity və şərhlər
        $svg = (string) preg_replace('#<!(?:DOCTYPE|ENTITY)[^>]*>#i', '', $svg);
        $svg = (string) preg_replace('#<!--.*?-->#s', '', $svg);

        // İcra olunan və kənar məzmun gətirən teqlər — bağlı formaları
        $svg = (string) preg_replace(
            '#<\s*(script|foreignObject|iframe|object|embed|handler)\b.*?<\s*/\s*\1\s*>#is',
            '',
            $svg
        );

        // ...və tək formaları
        $svg = (string) preg_replace(
            '#<\s*/?\s*(script|foreignObject|iframe|object|embed|image|use|animate|set|handler)\b[^>]*>#i',
            '',
            $svg
        );

        // Hadisə atributları: onclick, onload, onmouseover...
        $svg = (string) preg_replace('#\son[a-z-]+\s*=\s*("[^"]*"|\'[^\']*\'|[^\s>]+)#i', '', $svg);

        // Kənar ünvanlar. Yalnız sənədin öz daxili istinadı (`#id`) qalır.
        $svg = (string) preg_replace(
            '#\s(?:xlink:)?href\s*=\s*(?:"(?!\#)[^"]*"|\'(?!\#)[^\']*\'|[^\s>"\']+)#i',
            '',
            $svg
        );

        return trim($svg);
    }

    /**
     * Sxemin üstünə nişan qatı əlavə edir.
     *
     * Nişanlar sxemin ÖZ KODUNDA DEYİL, ayrıca məlumatdır — eyni sxemi
     * müxtəlif mərhələlərdə fərqli nişanlarla göstərmək mümkün olsun deyə.
     * Koordinatlar sxemin öz `viewBox` sistemindədir.
     *
     * @param  list<array<string,mixed>>  $nisanlar
     */
    public static function nisanla(string $svg, array $nisanlar): string
    {
        $son = strrpos($svg, '</svg>');

        if ($son === false || $nisanlar === []) {
            return $svg;
        }

        $qat = '<g class="sxem-nisan">';

        foreach ($nisanlar as $i => $n) {
            $qat .= match ($n['nov'] ?? '') {
                'noqte'  => self::noqte($n, $i),
                'olcu'   => self::olcu($n),
                'ox'     => self::ox($n, $i),
                'shimal' => self::shimal($n),
                default  => '',
            };
        }

        return substr($svg, 0, $son) . $qat . '</g>' . substr($svg, $son);
    }

    private static function noqte(array $n, int $i): string
    {
        $x = (float) ($n['x'] ?? 0);
        $y = (float) ($n['y'] ?? 0);
        $no = (string) ($n['no'] ?? $i + 1);

        return '<circle cx="' . $x . '" cy="' . $y . '" r="9" fill="#A8382C"/>'
            . '<text x="' . $x . '" y="' . ($y + 3.6) . '" fill="#fff" font-size="10"'
            . ' font-weight="600" text-anchor="middle">' . self::esc($no) . '</text>';
    }

    private static function olcu(array $n): string
    {
        [$x1, $y1, $x2, $y2] = self::xett($n);
        /* Ölçü xətti: iki ucunda qısa dırnaq, ortasında rəqəm. */
        $ox = $y1 === $y2 ? 0 : 4;
        $oy = $y1 === $y2 ? 4 : 0;

        return '<g stroke="#5D564A" stroke-width="0.9">'
            . '<line x1="' . $x1 . '" y1="' . $y1 . '" x2="' . $x2 . '" y2="' . $y2 . '"/>'
            . '<line x1="' . ($x1 - $ox) . '" y1="' . ($y1 - $oy) . '" x2="' . ($x1 + $ox) . '" y2="' . ($y1 + $oy) . '"/>'
            . '<line x1="' . ($x2 - $ox) . '" y1="' . ($y2 - $oy) . '" x2="' . ($x2 + $ox) . '" y2="' . ($y2 + $oy) . '"/>'
            . '</g>'
            . '<text x="' . (($x1 + $x2) / 2) . '" y="' . ((($y1 + $y2) / 2) - 4) . '" fill="#5D564A"'
            . ' font-size="9" text-anchor="middle">' . self::esc((string) ($n['metn'] ?? '')) . '</text>';
    }

    private static function ox(array $n, int $i): string
    {
        [$x1, $y1, $x2, $y2] = self::xett($n);
        $id = 'ox' . $i;

        return '<defs><marker id="' . $id . '" viewBox="0 0 8 8" refX="7" refY="4"'
            . ' markerWidth="6" markerHeight="6" orient="auto">'
            . '<path d="M0 0L8 4L0 8z" fill="#24417E"/></marker></defs>'
            . '<line x1="' . $x1 . '" y1="' . $y1 . '" x2="' . $x2 . '" y2="' . $y2 . '"'
            . ' stroke="#24417E" stroke-width="1.4" stroke-dasharray="5 4" marker-end="url(#' . $id . ')"/>'
            . ((string) ($n['metn'] ?? '') === '' ? ''
                /* Ox sxemin yuxarı kənarına yaxın bitirsə, yazı çərçivədən
                   kənara düşərdi — belə halda altdan yazılır. */
                : '<text x="' . $x2 . '" y="' . ($y2 < 30 ? $y2 + 13 : $y2 - 7) . '" fill="#24417E"'
                . ' font-size="9.5" text-anchor="end">' . self::esc((string) $n['metn']) . '</text>');
    }

    private static function shimal(array $n): string
    {
        $x = (float) ($n['x'] ?? 0);
        $y = (float) ($n['y'] ?? 0);
        $b = (float) ($n['bucaq'] ?? 0);

        return '<g transform="rotate(' . $b . ' ' . $x . ' ' . $y . ')" stroke="#26221D" fill="#26221D">'
            . '<line x1="' . $x . '" y1="' . ($y + 14) . '" x2="' . $x . '" y2="' . ($y - 12) . '" stroke-width="1.2"/>'
            . '<path d="M' . ($x - 4) . ' ' . ($y - 6) . 'L' . $x . ' ' . ($y - 15) . 'L' . ($x + 4) . ' ' . ($y - 6) . 'z"/>'
            . '<text x="' . $x . '" y="' . ($y + 24) . '" font-size="9" stroke="none" text-anchor="middle">Ş</text>'
            . '</g>';
    }

    /** @return array{0:float,1:float,2:float,3:float} */
    private static function xett(array $n): array
    {
        return [(float) ($n['x1'] ?? 0), (float) ($n['y1'] ?? 0),
                (float) ($n['x2'] ?? 0), (float) ($n['y2'] ?? 0)];
    }

    private static function esc(string $s): string
    {
        return htmlspecialchars($s, ENT_QUOTES, 'UTF-8');
    }
}
