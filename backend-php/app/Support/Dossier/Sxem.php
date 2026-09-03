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
}
