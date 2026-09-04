<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\InvestigatorProfile;
use App\Support\Dossier\Byuro;
use App\Support\Dossier\Imza;
use App\Support\Nisan;

/**
 * YAXA VƏSİQƏSİ — profildən SVG.
 *
 * Serverdə çəkilir ki, paylaşılan səhifədə də (giriş olmadan) görünsün;
 * PNG isə brauzerdə `ZEXPORT.pngBlob()` ilə çıxarılır — bu repoda serverdə
 * SVG→PNG çevirici yoxdur və `devet`, `sosial`, sertifikat üçün eyni qərar
 * artıq verilib.
 *
 * ÜÇ QAYDA, hər biri kətan rasterləşdirməsindən çıxır:
 *
 *  1. `@font-face` İŞLƏMİR. Kart <img> ilə kətana çəkiləndə web şriftlər
 *     düşür, ona görə ailələr ümumidir. Ad TƏK DIRNAQLIDIR: cüt dırnaqlı XML
 *     atributunun içindəki cüt dırnaq şəkli SƏSSİZCƏ sındırır (`Event`
 *     qaytarır, xəta yox) — `dossier-cert.js` eyni qaydanı daşıyır.
 *  2. CSS DƏYİŞƏNİ İŞLƏMİR. `var(--buff)` kətanda həll olunmur, ona görə
 *     rütbənin rəngi `Rank::reng()` vasitəsilə hərfi hex kimi gəlir.
 *  3. XARİCİ ŞƏKİL İŞLƏMİR. Avatar `data:` URI kimi yerləşdirilir —
 *     `doc.js` `AVATAR_RE` ilə eyni qayda; xarici link həm PNG ixracını
 *     sındırar, həm də baxanın IP-sini sızdırardı.
 *
 * `$id` MƏCBURİDİR VƏ SƏHİFƏDƏ UNİKALDIR: reytinq bir səhifədə onlarla sətir
 * kartı çəkir və `<pattern>` / `<clipPath>` id-ləri toqquşardı
 * (`Nisan::mohur()`-un öz qaydası).
 */
class CardRenderer
{
    /** Kartın kətanı: 54 × 86 mm nisbəti, vahid = 0.1 mm. */
    public const EN = 540;
    public const HUND = 860;

    /** Sətir variantı — reytinq və şərhlər üçün. */
    public const SETIR_EN = 420;
    public const SETIR_HUND = 96;

    private const MONO = "'Courier New',Courier,monospace";
    private const SANS = "'Helvetica Neue',Helvetica,Arial,sans-serif";

    /** Kağız və mürəkkəb — `dossier.css` vərəq palitrası. */
    private const KAGIZ  = '#F7F8FB';
    private const KAGIZ2 = '#EDF0F6';
    private const MUREKKEB  = '#151B26';
    private const MUREKKEB2 = '#4A5568';
    private const MUREKKEB3 = '#8792A6';

    /** Ad sütununun eni — avtomatik kiçilmənin həddi. */
    private const AD_EN = 276;

    /**
     * Böyük hərflərin em-ə görə eni.
     *
     * PHP-də `measureText` yoxdur və Node təxmini bu ölçmə üçün yararsız
     * sayılıb (`check-title-fit.js`). Bu cədvəl ±8 % dəqiqdir — ölçü SEÇMƏK
     * üçün kifayətdir; daşmanın qarşısını isə `textLength` alır.
     */
    private const HERF_EN = [
        'I' => 0.30, 'İ' => 0.30, 'J' => 0.42, 'L' => 0.55, 'T' => 0.58,
        'M' => 0.86, 'W' => 0.88, 'Ə' => 0.62, ' ' => 0.28, '-' => 0.36,
        '.' => 0.28, "'" => 0.22,
    ];
    private const HERF_EN_VARSAYILAN = 0.62;

    /* ================================================================
     | Tam kart
     |================================================================ */

    public function kart(InvestigatorProfile $p, string $id = 'vsq'): string
    {
        $reng   = $p->rank?->reng() ?? self::MUREKKEB3;
        $nisan  = (string) ($p->rank?->insignia_type ?? 'sirit-bos');
        $rutbe  = (string) ($p->rank?->title_az ?? 'Stajçı');
        $verilb = $p->hasBadge();

        $o  = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' . self::EN . ' ' . self::HUND . '"'
            . ' width="100%" role="img" aria-label="Müstəntiq vəsiqəsi">';

        $o .= $this->defs($id, $reng);

        // Kağız
        $o .= '<rect width="' . self::EN . '" height="' . self::HUND . '" fill="' . self::KAGIZ . '"/>';
        $o .= '<rect width="' . self::EN . '" height="' . self::HUND . '" fill="url(#' . $id . '-tor)"'
            . ' opacity="0.35"/>';

        /* Mərkəzi naxış — `Nisan::naxis()` 100×100 rozet QRUPUDUR, kirəmit
           vahidi deyil: şəbəkəyə düzülsəydi dairəvi zərfi görünən tikişlər
           verərdi. Ona görə vərəqdəki kimi tək böyük nişan kimi işlədilir. */
        $o .= '<g transform="translate(-40 150) scale(6.2)" opacity="0.06">'
            . Nisan::naxis(['reng' => self::MUREKKEB2, 'opaklik' => 1]) . '</g>';

        // Rütbə rəngli kənar zolaqlar — irəliləyişin görünən hissəsi
        $o .= '<rect width="' . self::EN . '" height="14" fill="' . $reng . '"/>';
        $o .= '<rect y="' . (self::HUND - 14) . '" width="' . self::EN . '" height="14" fill="' . $reng . '"/>';

        // Başlıq
        $o .= '<g transform="translate(30 28) scale(0.52)">'
            . Nisan::gerb(['ad' => Byuro::QISA, 'reng' => self::MUREKKEB, 'lent' => '']) . '</g>';
        $o .= $this->t(Byuro::QISA, 96, 58, ['size' => 24, 'weight' => 700, 'ls' => 4.2]);
        $o .= $this->t($this->sigdir(Byuro::AD, 400, 12, 10),
            96, 80, ['size' => 12, 'fill' => self::MUREKKEB2, 'ls' => 0.7]);
        $o .= $this->t('XİDMƏTİ VƏSİQƏ', self::EN - 30, 58,
            ['size' => 12.5, 'fill' => self::MUREKKEB3, 'anchor' => 'end', 'ls' => 1.4]);

        $o .= '<rect x="30" y="102" width="' . (self::EN - 60) . '" height="1.6" fill="' . self::MUREKKEB . '" opacity="0.5"/>';

        // Şəkil
        $o .= $this->foto($p, $id, 36, 124, 168, 224);

        // Ad — iki sətir, avtomatik kiçilmə
        [$soyad, $ad] = $this->adSetirleri($p->adi());
        $o .= $this->boyukAd($soyad, 224, 172);
        $o .= $this->boyukAd($ad, 224, 216);

        $o .= '<rect x="224" y="238" width="120" height="2.4" fill="' . $reng . '"/>';
        $o .= $this->t($this->sigdir($rutbe, self::AD_EN, 17, 11), 224, 268,
            ['size' => min(17.0, $this->olcuSec($rutbe, self::AD_EN, 17, 11)),
             'fill' => self::MUREKKEB2, 'fam' => self::SANS, 'weight' => 600]);

        // Sahələr
        $o .= '<rect x="36" y="380" width="' . (self::EN - 72) . '" height="1" fill="' . self::MUREKKEB . '" opacity="0.28"/>';
        $o .= $this->sahe('ŞÖBƏ', $verilb ? ($p->departmentLabel() ?: '—') : 'təyinat gözləyir', 418);
        $o .= $this->sahe('VƏSİQƏ №', $verilb ? (string) $p->badge_number : '— — —', 462);
        $o .= $this->sahe('QEYDİYYAT', $p->joined_at?->format('d.m.Y') ?? '—', 506);

        /* İMZA — determinist: ad eyni isə cizgi də eyni (`Imza::yol()`).
           Xətt üstündə durur, altında çap adı — boşluqda üzən ad imza yox,
           başlıq kimi oxunur. */
        $o .= '<g transform="translate(36 566) scale(1.30)" opacity="0.88">'
            . '<path d="' . Imza::yol($p->adi()) . '" fill="none" stroke="#17356B"'
            . ' stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></g>';
        $o .= '<path d="M36 634H244" stroke="' . self::MUREKKEB2 . '" stroke-width="1" opacity="0.7"/>';
        $o .= $this->t('İmza', 36, 654, ['size' => 12, 'fill' => self::MUREKKEB3, 'ls' => 1.2]);

        // Rütbə nişanı — imzanın sağında, boş sahədə
        $o .= '<g transform="translate(400 556)">' . $this->nisan($nisan, $reng) . '</g>';

        // Barkod — nişan nömrəsini kodlayır
        if ($verilb) {
            $o .= $this->barkod((string) $p->badge_number, 36, 700, 300, 56);
        } else {
            $o .= '<rect x="36" y="700" width="300" height="56" fill="none" stroke="'
                . self::MUREKKEB3 . '" stroke-width="1.2" stroke-dasharray="5 4" opacity="0.7"/>';
            $o .= $this->t('TƏYİNAT GÖZLƏYİR', 186, 734,
                ['size' => 14, 'fill' => self::MUREKKEB3, 'anchor' => 'middle', 'ls' => 2.2]);
        }

        // Mikromətn + fiktivlik qeydi — HÜQUQİ QALXAN, silinməz
        $o .= $this->mikro(0, 818, self::EN, 5.4);
        $o .= $this->t(Byuro::QEYD_QISA, self::EN / 2, 838,
            ['size' => 8.4, 'fill' => self::MUREKKEB2, 'anchor' => 'middle', 'ls' => 0.5]);

        // Çərçivə
        $o .= '<rect x="0.8" y="0.8" width="' . (self::EN - 1.6) . '" height="' . (self::HUND - 1.6)
            . '" fill="none" stroke="' . self::MUREKKEB . '" stroke-width="1.6" opacity="0.55"/>';

        return $o . '</svg>';
    }

    /* ================================================================
     | Sətir variantı — reytinq və şərhlər
     |================================================================ */

    /**
     * Kompakt sətir.
     *
     * BARKOD VƏ MİKROMƏTN YOXDUR: sətir artefakt deyil, identifikatordur, və
     * 96 vahid hündürlükdə mikromətn boz ləkəyə çevrilib qalxanın lüğətini
     * gücləndirmək əvəzinə zəiflədərdi.
     */
    public function setir(InvestigatorProfile $p, string $id = 'st'): string
    {
        $reng  = $p->rank?->reng() ?? self::MUREKKEB3;
        $rutbe = (string) ($p->rank?->title_short ?? 'Stajçı');

        $o  = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' . self::SETIR_EN . ' ' . self::SETIR_HUND . '"'
            . ' width="100%" role="img" aria-label="' . $this->e($p->adi()) . '">';
        $o .= $this->defs($id, $reng, false);
        $o .= '<rect width="' . self::SETIR_EN . '" height="' . self::SETIR_HUND . '" fill="' . self::KAGIZ . '" rx="4"/>';
        $o .= '<rect width="5" height="' . self::SETIR_HUND . '" fill="' . $reng . '"/>';

        $o .= $this->foto($p, $id, 16, 16, 64, 64);

        $o .= $this->t($this->sigdir($p->adi(), 200, 17, 12), 96, 44,
            ['size' => 17, 'weight' => 600, 'fam' => self::SANS]);
        $o .= $this->t($this->sigdir($rutbe, 200, 12, 9), 96, 68,
            ['size' => 12, 'fill' => self::MUREKKEB2, 'fam' => self::SANS]);

        /* Nişan ƏN SAĞDA, nömrə ondan solda: ikisi eyni sətirdə olsaydı uzun
           nömrə nişanın altına girərdi. */
        $o .= '<g transform="translate(356 22) scale(0.55)">' . $this->nisan(
            (string) ($p->rank?->insignia_type ?? 'sirit-bos'), $reng) . '</g>';

        if ($p->hasBadge()) {
            $o .= $this->t((string) $p->badge_number, 344, 60,
                ['size' => 13, 'fill' => self::MUREKKEB2, 'anchor' => 'end', 'ls' => 0.8]);
        }

        return $o . '</svg>';
    }

    /* ================================================================
     | Hissələr
     |================================================================ */

    /**
     * Qoruyucu naxış — GERÇƏK kirəmit.
     *
     * Paylaşılan `defs()`-ə yazılmır: `doc.js` dərsi — paylaşılan bir def
     * bütün istifadəçilərin baytını dəyişir, ona görə hər kart öz naxışını
     * öz `$id` önəki ilə daşıyır.
     */
    protected function defs(string $id, string $reng, bool $tor = true): string
    {
        $d = '<defs>';

        if ($tor) {
            $d .= '<pattern id="' . $id . '-tor" width="14" height="14"'
                . ' patternUnits="userSpaceOnUse" patternTransform="rotate(24)">'
                . '<path d="M0 0V14M7 0V14" stroke="' . self::MUREKKEB2 . '" stroke-width="0.5" opacity="0.16"/>'
                . '<path d="M0 3.5H14M0 10.5H14" stroke="' . self::MUREKKEB2 . '" stroke-width="0.35" opacity="0.10"/>'
                . '</pattern>';
        }

        $d .= '<clipPath id="' . $id . '-foto"><rect x="0" y="0" width="1" height="1"/></clipPath>';

        return $d . '</defs>';
    }

    /** Şəkil çərçivəsi. Təsdiqlənmiş avatar yoxdursa siluet — fayl deyil, `<path>`. */
    protected function foto(InvestigatorProfile $p, string $id, float $x, float $y, float $w, float $h): string
    {
        $o = '<rect x="' . $x . '" y="' . $y . '" width="' . $w . '" height="' . $h . '"'
            . ' fill="' . self::KAGIZ2 . '" stroke="' . self::MUREKKEB2 . '" stroke-width="1.5" rx="4"/>';

        $uri = $this->avatarUri($p);

        if ($uri !== null) {
            $o .= '<clipPath id="' . $id . '-k"><rect x="' . $x . '" y="' . $y . '" width="' . $w
                . '" height="' . $h . '" rx="4"/></clipPath>'
                . '<image href="' . $this->e($uri) . '" x="' . $x . '" y="' . $y . '" width="' . $w
                . '" height="' . $h . '" preserveAspectRatio="xMidYMid slice"'
                . ' clip-path="url(#' . $id . '-k)"/>';

            return $o;
        }

        // SİLUET — baş və çiyin, şəkil faylı olmadan.
        $cx = $x + $w / 2;
        $o .= '<g fill="' . self::MUREKKEB3 . '" opacity="0.55">'
            . '<circle cx="' . $cx . '" cy="' . ($y + $h * 0.36) . '" r="' . ($w * 0.19) . '"/>'
            . '<path d="M' . ($cx - $w * 0.30) . ' ' . ($y + $h * 0.92)
            . 'a' . ($w * 0.30) . ' ' . ($h * 0.24) . ' 0 0 1 ' . ($w * 0.60) . ' 0z"/></g>';

        return $o;
    }

    /**
     * Avatarın `data:` URI-si.
     *
     * Yalnız TƏSDİQLƏNMİŞ şəkil kartda görünür — kart paylaşıla bilər və
     * moderasiyanın bütün mənası budur. Fayl diskdən oxunur; xarici link
     * heç vaxt qoyulmur (PNG ixracı onu itirər).
     */
    protected function avatarUri(InvestigatorProfile $p): ?string
    {
        if (! $p->avatarPublic()) {
            return null;
        }

        $ad = (string) $p->avatar_path;

        if (preg_match('#^[0-9]+/[a-f0-9]{32}\.jpg$#', $ad) !== 1) {
            return null;
        }

        $yol = rtrim((string) config('dossier.avatar.path'), '/') . '/' . $ad;

        if (! is_file($yol)) {
            return null;
        }

        return 'data:image/jpeg;base64,' . base64_encode((string) file_get_contents($yol));
    }

    /** Etiket solda, dəyər sağda, arada nöqtəli xətt — vərəqin `sahe` bloku. */
    protected function sahe(string $etiket, string $deyer, float $y): string
    {
        $o  = $this->t($etiket, 36, $y, ['size' => 13, 'fill' => self::MUREKKEB3, 'ls' => 2]);
        $o .= '<path d="M36 ' . ($y + 10) . 'H' . (self::EN - 36) . '" stroke="' . self::MUREKKEB3
            . '" stroke-width="0.9" stroke-dasharray="2 3.5" opacity="0.65"/>';
        $o .= $this->t($this->sigdir($deyer, 300, 17, 12), self::EN - 36, $y + 30,
            ['size' => 17, 'anchor' => 'end', 'weight' => 600]);

        return $o;
    }

    /**
     * Adın bir sətri — üç qatlı sığdırma.
     *
     * Ölçü təxminlə seçilir, DAŞMANIN QARŞISINI İSƏ `textLength` alır: o,
     * hansı şrift həll olunursa olsun eni bərkidir, ona görə brauzerdə də,
     * kətanda da nəticə eynidir.
     */
    protected function boyukAd(string $metn, float $x, float $y): string
    {
        if ($metn === '') {
            return '';
        }

        $metn  = $this->boyuk($metn);
        $olcu  = $this->olcuSec($metn, self::AD_EN, 40, 26);
        $kesik = $this->sigdir($metn, self::AD_EN, $olcu, 26);

        /* `data-ad` yalnız NİŞANDIR: uçdan-uca test məhz bu mətnlərin qutudan
           daşmadığını ölçür (mikromətn zolağı qəsdən tam enlidir). */
        return sprintf(
            '<text data-ad="1" x="%.1f" y="%.1f" font-family="%s" font-size="%.1f" font-weight="700"'
            . ' fill="%s" letter-spacing="0.6" textLength="%.1f" lengthAdjust="spacingAndGlyphs">%s</text>',
            $x, $y, self::SANS, $olcu, self::MUREKKEB,
            min(self::AD_EN, $this->en($kesik, $olcu)), $this->e($kesik)
        );
    }

    /** Soyad birinci sətir, ad ikinci — son boşluqdan bölünür. */
    protected function adSetirleri(string $tam): array
    {
        $tam = trim(preg_replace('/\s+/u', ' ', $tam) ?? '');
        $at  = mb_strrpos($tam, ' ');

        if ($at === false) {
            return [$tam, ''];
        }

        return [mb_substr($tam, $at + 1), mb_substr($tam, 0, $at)];
    }

    /** Mətnin təxmini eni — böyük hərf cədvəli üzrə. */
    protected function en(string $metn, float $olcu): float
    {
        $cem = 0.0;
        $n   = mb_strlen($metn);

        for ($i = 0; $i < $n; $i++) {
            $h = mb_substr($metn, $i, 1);
            $cem += self::HERF_EN[$h] ?? self::HERF_EN_VARSAYILAN;
        }

        return $cem * $olcu;
    }

    /** Sığana qədər ölçünü pilləkanla azaldır. */
    protected function olcuSec(string $metn, float $maxEn, float $bas, float $min): float
    {
        for ($o = $bas; $o > $min; $o -= 2) {
            if ($this->en($metn, $o) <= $maxEn) {
                return $o;
            }
        }

        return $min;
    }

    /**
     * Ən kiçik ölçüdə də sığmırsa kəsir.
     *
     * ~70 %-dən sıx yazılmış mətn oxunmur və render səhvi kimi görünür —
     * kəsmək daha yaxşı uğursuzluqdur.
     */
    protected function sigdir(string $metn, float $maxEn, float $bas, float $min): string
    {
        if ($this->en($metn, $min) <= $maxEn) {
            return $metn;
        }

        $hedd = (int) max(3, floor($maxEn / (self::HERF_EN_VARSAYILAN * $min)));

        return mb_substr($metn, 0, $hedd - 1) . '…';
    }

    /**
     * MİKROMƏTN — `doc.js microtext()` funksiyasının bir sətirlik variantı.
     *
     * `textPath` yoxdur (sətir düzdür və o, unikal id tələb edərdi);
     * `textLength` + `lengthAdjust="spacingAndGlyphs"` eni dəqiq bərkidir.
     */
    protected function mikro(float $x, float $y, float $w, float $olcu): string
    {
        $t    = Byuro::QEYD_QISA . ' · ';
        $ted  = (int) max(1, ceil($w / ($olcu * 0.52 * mb_strlen($t))));
        $metn = str_repeat($t, $ted + 1);

        return sprintf(
            '<text x="%.1f" y="%.1f" font-family="%s" font-size="%.2f" fill="%s" opacity="0.55"'
            . ' textLength="%.1f" lengthAdjust="spacingAndGlyphs">%s</text>',
            $x, $y, self::MONO, $olcu, self::MUREKKEB2, $w, $this->e($metn)
        );
    }

    /* ================================================================
     | Code-39 — `frontend/doc.js` portu
     |================================================================ */

    /**
     * Hər simvol 9 elementdir, üçü enli. Öz-özünü yoxlayır — yoxlama rəqəmi
     * lazım deyil. Cədvəl `doc.js` `C39` ilə BAYT-BAYT eyni olmalıdır.
     */
    public const C39 = [
        '0' => 'nnnwwnwnn', '1' => 'wnnwnnnnw', '2' => 'nnwwnnnnw', '3' => 'wnwwnnnnn', '4' => 'nnnwwnnnw',
        '5' => 'wnnwwnnnn', '6' => 'nnwwwnnnn', '7' => 'nnnwnnwnw', '8' => 'wnnwnnwnn', '9' => 'nnwwnnwnn',
        'A' => 'wnnnnwnnw', 'B' => 'nnwnnwnnw', 'C' => 'wnwnnwnnn', 'D' => 'nnnnwwnnw', 'E' => 'wnnnwwnnn',
        'F' => 'nnwnwwnnn', 'G' => 'nnnnnwwnw', 'H' => 'wnnnnwwnn', 'I' => 'nnwnnwwnn', 'J' => 'nnnnwwwnn',
        'K' => 'wnnnnnnww', 'L' => 'nnwnnnnww', 'M' => 'wnwnnnnwn', 'N' => 'nnnnwnnww', 'O' => 'wnnnwnnwn',
        'P' => 'nnwnwnnwn', 'Q' => 'nnnnnnwww', 'R' => 'wnnnnnwwn', 'S' => 'nnwnnnwwn', 'T' => 'nnnnwnwwn',
        'U' => 'wwnnnnnnw', 'V' => 'nwwnnnnnw', 'W' => 'wwwnnnnnn', 'X' => 'nwnnwnnnw', 'Y' => 'wwnnwnnnn',
        'Z' => 'nwwnwnnnn', '-' => 'nwnnnnwnw', '.' => 'wwnnnnwnn', ' ' => 'nwwnnnwnn', '$' => 'nwnwnwnnn',
        '/' => 'nwnwnnnwn', '+' => 'nwnnnwnwn', '%' => 'nnnwnwnwn', '*' => 'nwnnwnwnn',
    ];

    /** @return list<int> cüt indeks = bar, tək = boşluq */
    public static function code39(string $data, int $ratio = 2): array
    {
        $txt = '*' . preg_replace('/[^0-9A-Z\-. $\/+%]/', '-', strtoupper($data)) . '*';
        $els = [];
        $n   = strlen($txt);

        for ($i = 0; $i < $n; $i++) {
            $pat = self::C39[$txt[$i]] ?? self::C39['-'];

            for ($j = 0; $j < 9; $j++) {
                $els[] = $pat[$j] === 'w' ? $ratio : 1;
            }

            if ($i < $n - 1) {
                $els[] = 1;   // simvollararası dar boşluq
            }
        }

        return $els;
    }

    public static function code39Modules(string $data, int $ratio = 2): int
    {
        return array_sum(self::code39($data, $ratio));
    }

    protected function barkod(string $data, float $x, float $y, float $w, float $h): string
    {
        $txt  = strtoupper($data);
        $mods = self::code39Modules($txt);
        $m    = $w / max(1, $mods);
        $els  = self::code39($txt);

        $d  = '';
        $cx = $x;

        foreach ($els as $i => $el) {
            $ew = $el * $m;

            if ($i % 2 === 0) {
                $d .= sprintf('M%.2f %.1fh%.2fv%.1fh%.2fz', $cx, $y, $ew, $h, -$ew);
            }

            $cx += $ew;
        }

        return '<path d="' . $d . '" fill="' . self::MUREKKEB . '"/>'
            . $this->t($txt, $x + $w / 2, $y + $h + 16,
                ['size' => 12, 'fam' => self::MONO, 'fill' => self::MUREKKEB2,
                 'anchor' => 'middle', 'ls' => 1.6]);
    }

    /* ================================================================
     | Rütbə nişanları — 96×96 qutuda
     |================================================================ */

    /**
     * Doqquz forma. Şevronlar aşağı rütbələr, ulduzlar yuxarı.
     *
     * Ən yüksək nişanda çələng `Nisan::celeng()`-dən ÖZ BUCAQLARI ilə gəlir
     * (141°–219°, yanlarda) — belədə «çələng altdan qalxmır» qaydası
     * avtomatik qorunur və AFİB nişanı ilə eyni ailəyə aid olur.
     */
    protected function nisan(string $tip, string $reng): string
    {
        $sevron = static fn (float $y, bool $dolu): string => sprintf(
            '<path d="M20 %.1fL48 %.1fL76 %.1f" fill="none" stroke="%s" stroke-width="%s"'
            . ' stroke-linecap="round" stroke-linejoin="round"/>',
            $y, $y - 16, $y, $reng, $dolu ? '9' : '4'
        );

        $ulduz = static fn (float $cx, float $cy, float $r): string =>
            '<path d="' . Nisan::ulduz($cx, $cy, $r, $r * 0.44) . '" fill="' . $reng . '"/>';

        return match ($tip) {
            'sirit-1'  => $sevron(64, true),
            'sirit-2'  => $sevron(52, true) . $sevron(74, true),
            'sirit-3'  => $sevron(40, true) . $sevron(62, true) . $sevron(84, true),
            'sirit-3-zol' => '<rect x="20" y="14" width="56" height="7" rx="3" fill="' . $reng . '"/>'
                . $sevron(46, true) . $sevron(66, true) . $sevron(86, true),
            'ulduz-1'  => $ulduz(48, 50, 27),
            'ulduz-2'  => $ulduz(31, 50, 22) . $ulduz(65, 50, 22),
            'ulduz-3'  => $ulduz(48, 28, 21) . $ulduz(29, 66, 21) . $ulduz(67, 66, 21),
            'ulduz-celeng' => '<g opacity="0.9">'
                . Nisan::celeng(48, 52, 42, 141, 219, 7, 8, $reng)
                . Nisan::celeng(48, 52, 42, 39, -39, 7, 8, $reng)
                . '</g>' . $ulduz(48, 48, 24),
            default    => $sevron(64, false),
        };
    }

    /* ================================================================
     | Kiçik köməkçilər
     |================================================================ */

    /** @param array<string,mixed> $o */
    protected function t(string $metn, float $x, float $y, array $o = []): string
    {
        return sprintf(
            '<text x="%.1f" y="%.1f" font-family="%s" font-size="%.1f" font-weight="%s" fill="%s"'
            . ' letter-spacing="%.2f"%s>%s</text>',
            $x, $y,
            (string) ($o['fam'] ?? self::MONO),
            (float) ($o['size'] ?? 12),
            (string) ($o['weight'] ?? 400),
            (string) ($o['fill'] ?? self::MUREKKEB),
            (float) ($o['ls'] ?? 0),
            isset($o['anchor']) ? ' text-anchor="' . $o['anchor'] . '"' : '',
            $this->e($metn)
        );
    }

    /** Azərbaycan hərfləri üçün düzgün böyütmə: `i` → `İ`, `ı` → `I`. */
    protected function boyuk(string $s): string
    {
        return mb_strtoupper(strtr($s, ['i' => 'İ', 'ı' => 'I']), 'UTF-8');
    }

    protected function e(string $s): string
    {
        return htmlspecialchars($s, ENT_QUOTES | ENT_XML1, 'UTF-8');
    }
}
