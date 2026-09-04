<?php

declare(strict_types=1);

namespace App\Support;

/**
 * GERB VƏ MÖHÜR — saytın hər iki bölməsi üçün ORTAQ nişan komponentləri.
 *
 * Həndəsə `frontend/doc.js` faylındakı `crest()` və `seal()` funksiyalarından
 * götürülüb: konsentrik halqalar, rozet naxışı, monoqram, lent və qövs boyu
 * yazı. Orada bu dizayn artıq işlənib və yaxşı alınıb; burada eyni dil, amma
 * MƏTNİ PARAMETRDİR — yəni eyni komponent fərqli qurum üçün işlədilir.
 *
 * ULDUZ VƏ ÇƏLƏNG VAR, amma çələnglər YANLARDADIR — aşağıdan qalxmır.
 * Alt tərəfdən başlayan çələng real dövlət gerblərinin ən tanınan cizgisidir;
 * yanlara qoyulanda isə nişan «rəsmi» qalır, lakin konkret bir gerbi
 * xatırlatmır. Qadağa `fiktiv-qurum-qaydalari.md`-də ümumidir: real
 * Azərbaycan dövlət sənədlərinin gerbini KOPYALAMAMAQ. Beşguşəli ulduz və
 * dəfnə budağı ümumi «rəsmilik» dilidir, konkret bir ölkənin nişanı deyil.
 * Azərbaycanın rəsmi nişanı səkkizguşəli ulduz və alovdur — burada onların
 * heç biri yoxdur.
 *
 * Freymvorksuzdur: SVG sətri qaytarır, heç bir fasad çağırmır.
 */
final class Nisan
{
    /** Rozet naxışı — `doc.js rosette()`. Halqalar arasındakı «qiymətli kağız» hissi. */
    private static function rozet(float $cx, float $cy, float $R, int $k, float $amp, int $addim = 360): string
    {
        $d = '';

        for ($i = 0; $i <= $addim; $i++) {
            $t = $i / $addim * M_PI * 2;
            $r = $R * (1 - $amp + $amp * cos($k * $t));
            $d .= ($i ? 'L' : 'M') . number_format($cx + $r * cos($t), 1, '.', '')
                . ' ' . number_format($cy + $r * sin($t), 1, '.', '');
        }

        return $d . 'Z';
    }

    /** Beşguşəli ulduz — `doc.js star5()`. */
    private static function ulduz(float $cx, float $cy, float $rO, float $rI): string
    {
        $d = '';

        for ($i = 0; $i < 10; $i++) {
            $a = -M_PI / 2 + $i * M_PI / 5;
            $rr = ($i % 2) ? $rI : $rO;
            $d .= ($i ? 'L' : 'M') . number_format($cx + $rr * cos($a), 2, '.', '')
                . ' ' . number_format($cy + $rr * sin($a), 2, '.', '');
        }

        return $d . 'Z';
    }

    /**
     * Dəfnə budağı — `doc.js laurel()`. Qövs + üstündə yarpaqlar.
     * Açılar DƏRƏCƏ ilədir və SVG-də 90° aşağını göstərir.
     */
    private static function celeng(float $cx, float $cy, float $R, float $a0, float $a1,
                                   int $n, float $len, string $C): string
    {
        $out = '<g fill="' . $C . '" opacity="0.8"><path d="';

        for ($i = 0; $i <= 20; $i++) {
            $ar = ($a0 + ($a1 - $a0) * $i / 20) * M_PI / 180;
            $out .= ($i ? 'L' : 'M') . number_format($cx + $R * cos($ar), 2, '.', '')
                . ' ' . number_format($cy + $R * sin($ar), 2, '.', '');
        }

        $out .= '" fill="none" stroke="' . $C . '" stroke-width="'
            . number_format($len * 0.22, 2, '.', '') . '" stroke-linecap="round"/>';

        $lr = $R + $len * 0.62;

        for ($i = 0; $i < $n; $i++) {
            $a = $a0 + ($a1 - $a0) * ($i + 0.5) / $n;
            $ar = $a * M_PI / 180;
            $out .= sprintf('<ellipse cx="0" cy="0" rx="%.2f" ry="%.2f"'
                . ' transform="translate(%.2f,%.2f) rotate(%.1f)"/>',
                $len, $len * 0.40, $cx + $lr * cos($ar), $cy + $lr * sin($ar), $a + 104);
        }

        return $out . '</g>';
    }

    /** Kəsik künclü vərəq — büronun öz nişanı, monoqramın altında qalır. */
    private static function vereq(float $cx, float $cy, float $h): string
    {
        $w = $h * 0.78;
        $k = $h * 0.34;                       // kəsik küncün ölçüsü
        $x = $cx - $w / 2;
        $y = $cy - $h / 2;

        return sprintf('M %.1f %.1f H %.1f L %.1f %.1f V %.1f H %.1f Z M %.1f %.1f V %.1f H %.1f',
            $x, $y, $x + $w - $k, $x + $w, $y + $k, $y + $h, $x, $y + $h,
            $x + $w - $k, $y, $y + $k, $x + $w);
    }

    private static function e(string $s): string
    {
        return htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    }

    /**
     * Qurumun gerbi. Kətan 100×100-dür, yəni istənilən ölçüdə itidir.
     *
     * @param  array{ad?:string,alt?:string,lent?:string,reng?:string,rozet?:bool}  $o
     */
    public static function gerb(array $o = []): string
    {
        $ad   = (string) ($o['ad'] ?? 'AFİB');
        $alt  = (string) ($o['alt'] ?? '');
        $lent = (string) ($o['lent'] ?? '');
        $C    = (string) ($o['reng'] ?? 'currentColor');
        $cx = 50.0; $cy = 44.0; $r = 33.0;

        /* ÇƏLƏNG YANLARDADIR: qövs 180°-nin (qərb) ətrafında simmetrikdir,
           yəni budaq sol böyrü tutur və aşağıdan qalxmır. Sağdakı onun
           güzgü nüsxəsidir. `doc.js`-də qövs 96°–202°-dir, yəni aşağıdan
           başlayır — fərq yalnız bu iki rəqəmdədir. */
        $g = '';

        if (($o['celeng'] ?? true) !== false) {
            $lf = self::celeng($cx, $cy, $r * 1.08, 141, 219, 6, $r * 0.125, $C);
            $g .= $lf . sprintf('<g transform="translate(%.2f,0) scale(-1,1)">%s</g>', 2 * $cx, $lf);
        }

        $g .= '<g fill="none" stroke="' . $C . '">';
        $g .= sprintf('<circle cx="%.1f" cy="%.1f" r="%.2f" stroke-width="%.2f"/>', $cx, $cy, $r, $r * 0.055);
        $g .= sprintf('<circle cx="%.1f" cy="%.1f" r="%.2f" stroke-width="%.2f"/>', $cx, $cy, $r * 0.80, $r * 0.030);
        $g .= sprintf('<circle cx="%.1f" cy="%.1f" r="%.2f" stroke-width="%.2f"/>', $cx, $cy, $r * 0.66, $r * 0.022);

        if (($o['rozet'] ?? true) !== false) {
            $g .= '<path d="' . self::rozet($cx, $cy, $r * 0.58, 9, 0.2) . '" stroke-width="0.4" opacity="0.7"/>';
        }
        $g .= '</g>';

        $g .= '<path d="' . self::ulduz($cx, $cy - $r * 0.36, $r * 0.26, $r * 0.115)
            . '" fill="' . $C . '" stroke="none" opacity="0.92"/>';

        $g .= sprintf('<text x="%.1f" y="%.2f" text-anchor="middle" font-size="%.2f" font-weight="700"'
            . ' letter-spacing="%.2f" fill="%s" stroke="none">%s</text>',
            $cx, $cy + $r * 0.26, $r * 0.40, $r * 0.02, $C, self::e($ad));

        if ($alt !== '') {
            $g .= sprintf('<text x="%.1f" y="%.2f" text-anchor="middle" font-size="%.2f"'
                . ' letter-spacing="%.2f" fill="%s" stroke="none">%s</text>',
                $cx, $cy + $r * 0.56, $r * 0.145, $r * 0.03, $C, self::e($alt));
        }

        /* Lent — iki ucu içəri kəsilmiş bayraq. */
        if ($lent !== '') {
            $bw = $r * 1.78; $bh = $r * 0.34; $by = $cy + $r * 0.86; $nt = $r * 0.16;
            $g .= sprintf('<path d="M %.2f %.2f L %.2f %.2f L %.2f %.2f L %.2f %.2f L %.2f %.2f L %.2f %.2f Z"'
                . ' fill="none" stroke="%s" stroke-width="%.2f"/>',
                $cx - $bw / 2, $by, $cx + $bw / 2, $by,
                $cx + $bw / 2 - $nt, $by + $bh / 2, $cx + $bw / 2, $by + $bh,
                $cx - $bw / 2, $by + $bh, $cx - $bw / 2 + $nt, $by + $bh / 2,
                $C, $r * 0.02);
            /* Lentin daxili eni `bw - 2.4·nt`-dir; monoaralıqlı addım 0.6em,
               yəni N simvol üçün ölçü = en / (N · 0.62). Sabit ölçü yazılsaydı,
               uzun bölmə adı lentdən daşardı — ilk cəhddə məhz bu oldu. */
            $ic = $bw - $nt * 2.4;
            $ls = min($r * 0.16, $ic / (max(1, mb_strlen($lent)) * 0.62));
            $g .= sprintf('<text x="%.1f" y="%.2f" text-anchor="middle" font-size="%.2f" font-weight="700"'
                . ' letter-spacing="%.2f" fill="%s" stroke="none">%s</text>',
                $cx, $by + $bh * 0.72, $ls, $ls * 0.06, $C, self::e($lent));
        }

        return $g;
    }

    /**
     * Dairəvi möhür. Qövs boyu yazı üçün `$id` unikal olmalıdır — eyni
     * səhifədə iki möhür olanda id toqquşarsa, ikisi də üst-üstə düşür.
     *
     * @param  array{ust?:string,alt?:string,orta?:string,no?:string,etiket?:string,reng?:string}  $o
     */
    public static function mohur(string $id, array $o = []): string
    {
        $ust    = (string) ($o['ust'] ?? '');
        $alt    = (string) ($o['alt'] ?? '');
        $orta   = (string) ($o['orta'] ?? '');
        $no     = (string) ($o['no'] ?? '');
        $etiket = (string) ($o['etiket'] ?? '');
        $C      = (string) ($o['reng'] ?? 'currentColor');
        $cx = 50.0; $cy = 50.0; $r = 47.0;

        $rU = $r * 0.735;                       // yuxarı qövs
        $rA = $r * 0.700;                       // aşağı qövs

        $s  = '<defs>';
        $s .= sprintf('<path id="%s-u" d="M %.2f %.2f A %.2f %.2f 0 1 1 %.2f %.2f" fill="none"/>',
            $id, $cx - $rU, $cy, $rU, $rU, $cx + $rU, $cy);
        $s .= sprintf('<path id="%s-a" d="M %.2f %.2f A %.2f %.2f 0 0 0 %.2f %.2f" fill="none"/>',
            $id, $cx - $rA, $cy, $rA, $rA, $cx + $rA, $cy);
        $s .= '</defs>';

        $s .= '<g fill="none" stroke="' . $C . '">';
        $s .= sprintf('<circle cx="%.1f" cy="%.1f" r="%.1f" stroke-width="2.7"/>', $cx, $cy, $r);
        $s .= sprintf('<circle cx="%.1f" cy="%.1f" r="%.2f" stroke-width="1"/>', $cx, $cy, $r * 0.876);
        $s .= sprintf('<circle cx="%.1f" cy="%.1f" r="%.2f" stroke-width="1"/>', $cx, $cy, $r * 0.474);
        $s .= '</g>';

        /* Qövs yazısının ölçüsü HESABLANIR: qövsün uzunluğu π·r, monoaralıqlı
           addım 0.6em. Gözlə seçiləndə yazı qövsdən daşır və möhür ləkəyə
           çevrilir — ilk cəhddə məhz bu olmuşdu. */
        $qovs = static fn (string $t, float $rr): float =>
            max(3.6, min(7.4, (M_PI * $rr * 0.92) / max(1, mb_strlen($t)) / 0.68));

        foreach ([['u', $ust, $rU], ['a', $alt, $rA]] as [$k, $t, $rr]) {
            if ($t === '') {
                continue;
            }
            $s .= sprintf('<text font-size="%.2f" font-weight="700" letter-spacing="0.5" fill="%s">'
                . '<textPath href="#%s-%s" startOffset="50%%" text-anchor="middle">%s</textPath></text>',
                $qovs($t, $rr), $C, $id, $k, self::e($t));
        }

        if ($orta !== '') {
            $s .= sprintf('<text x="%.1f" y="%.2f" text-anchor="middle" font-size="%.2f" font-weight="700"'
                . ' letter-spacing="0.4" fill="%s">%s</text>',
                $cx, $cy - ($no !== '' ? $r * 0.10 : -$r * 0.05),
                min($r * 0.27, $r * 1.30 / max(1, mb_strlen($orta)) * 1.5), $C, self::e($orta));
        }

        if ($no !== '') {
            $s .= sprintf('<text x="%.1f" y="%.2f" text-anchor="middle" font-size="%.2f"'
                . ' letter-spacing="0.3" fill="%s">%s</text>', $cx, $cy + $r * 0.19, $r * 0.13, $C, self::e($no));
        }

        if ($etiket !== '') {
            $s .= sprintf('<path d="M %.1f %.2f H %.1f" stroke="%s" stroke-width="0.8"/>',
                $cx - $r * 0.44, $cy + $r * 0.30, $cx + $r * 0.44, $C);
            $s .= sprintf('<text x="%.1f" y="%.2f" text-anchor="middle" font-size="%.2f"'
                . ' letter-spacing="0.4" fill="%s">%s</text>', $cx, $cy + $r * 0.52, $r * 0.125, $C, self::e($etiket));
        }

        return $s;
    }
}
