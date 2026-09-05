<?php

declare(strict_types=1);

namespace App\Support\Dossier;

/**
 * Qovluğun SƏNƏDLƏRİNDƏ İSTİFADƏ OLUNAN şəkil yuvaları.
 *
 * Redaktorda şəkli yükləyəndə açarı idarəçi əl ilə yazır — yəni yuvanın
 * adını qabaqcadan bilməli olur. Bu sinif sualı tərsinə çevirir: sənədlər
 * onsuz da hansı şəkilləri istəyir? Cavab sənədlərin özündədir və
 * hesablana bilir.
 *
 * ÜÇ MƏNBƏ VAR VƏ ÜÇÜ DƏ TARANMALIDIR — biri unudulsa, o yuva siyahıda
 * görünməz və idarəçi onu yalnız boş çərçivə kimi tapar:
 *   1. `{{ sekil:acar }}` nişanı — sənədin mətnində (`Isare::NISAN`);
 *   2. `foto` bloku — `sekil` açarı;
 *   3. `kart` bloku — hər maddi sübutun `sekil` açarı.
 *
 * `yazisma` blokunun `sekil` növlü mesajı BURAYA DAXİL DEYİL: onun şəkil
 * açarı yoxdur, yalnız «şəkil göndərildi» yer tutucusudur.
 *
 * Framework-siz — `tests/logic.php` onu birbaşa yükləyir.
 */
final class SekilYuvalari
{
    /**
     * Bir sənədin istədiyi açarlar.
     *
     * @param  array<string,mixed>  $sened  ['body' => …, 'content' => ['bloklar' => …]]
     * @return list<array<string,mixed>> yuva sətirləri
     */
    public static function senedde(array $sened): array
    {
        $out = [];

        /* 1. Mətndəki nişanlar. */
        $body = (string) ($sened['body'] ?? '');

        if ($body !== '' && preg_match_all(Isare::NISAN, $body, $m, PREG_SET_ORDER)) {
            foreach ($m as $x) {
                if ($x[1] === 'sekil') {
                    $out[] = self::yuva($x[2], 'mətndəki nişan', '');
                }
            }
        }

        /* 2–3. Bloklar. */
        $bloklar = (array) (($sened['content'] ?? [])['bloklar'] ?? []);

        foreach ($bloklar as $i => $b) {
            $tip = (string) ($b['tip'] ?? '');

            if ($tip === 'foto') {
                $out[] = self::yuva(
                    trim((string) ($b['sekil'] ?? '')),
                    'foto çərçivəsi',
                    trim((string) ($b['izah'] ?? '')),
                    (int) $i
                );

                continue;
            }

            if ($tip !== 'kart') {
                continue;
            }

            foreach ((array) ($b['kartlar'] ?? []) as $ki => $k) {
                /* Əşyanın adı yuvanı tanıdır: «kamera-01» tək başına heç nə
                   demir, «kamera-01 — Mətbəx dəhlizi» isə deyir. */
                $ad = trim((string) ($k['ad'] ?? ''));

                $out[] = self::yuva(
                    trim((string) ($k['sekil'] ?? '')),
                    $ad === '' ? 'maddi sübut' : 'maddi sübut: ' . $ad,
                    $ad,
                    (int) $i,
                    (int) $ki
                );
            }
        }

        return $out;
    }

    /**
     * Bir yuva sətri.
     *
     * BOŞ ÇƏRÇİVƏ DƏ YUVADIR. Əvvəl yalnız açarı olan yuvalar sayılırdı,
     * yəni tərcümeyi-hal vərəqlərinin boş portret yerləri siyahıda heç
     * görünmürdü — halbuki məhz onlar şəkil gözləyir. Açar yoxdursa
     * TƏKLİF edilir: idarəçi ad yazmır, yalnız faylı seçir.
     *
     * @return array<string,mixed>
     */
    private static function yuva(
        string $acar,
        string $haradan,
        string $ad,
        ?int $blok = null,
        ?int $kart = null
    ): array {
        return [
            'acar'    => $acar,
            'teklif'  => $acar === '' ? Isare::slugla(($ad !== '' ? $ad : $haradan) . '.x') : '',
            'haradan' => $haradan,
            'blok'    => $blok,
            'kart'    => $kart,
        ];
    }

    /**
     * Bütün qovluq üzrə yuvalar.
     *
     * Eyni açar bir neçə vərəqdə işlənə bilər — şəkil bir dəfə yüklənir,
     * hər yerdə görünür. Ona görə nəticə açara görə qruplaşır.
     *
     * @param  list<array<string,mixed>>  $senedler  hər biri: page, name, body, content
     * @return list<array<string,mixed>>
     */
    public static function qovluqda(array $senedler): array
    {
        $dolu = [];   // açarı olan yuvalar — açara görə birləşir
        $bos  = [];   // açarı olmayan çərçivələr — hər biri ayrıca sətirdir

        foreach ($senedler as $s) {
            $yer = [
                'id'   => (int) ($s['id'] ?? 0),
                'page' => (string) ($s['page'] ?? ''),
                'name' => (string) ($s['name'] ?? ''),
            ];

            foreach (self::senedde($s) as $y) {
                if ($y['acar'] !== '') {
                    /* Eyni açar bir neçə vərəqdə işlənə bilər — şəkil bir
                       dəfə yüklənir, hər yerdə görünür. */
                    $dolu[$y['acar']]['acar'] = $y['acar'];
                    $dolu[$y['acar']]['yerler'][] = $yer + ['haradan' => $y['haradan']];

                    continue;
                }

                /* Boş çərçivə birləşdirilə BİLMƏZ: iki fərqli vərəqin boş
                   portret yeri iki fərqli şəkil istəyir. */
                $bos[] = [
                    'acar'   => '',
                    'teklif' => self::bosluqsuz($y['teklif'], $dolu, $bos),
                    'yerler' => [$yer + ['haradan' => $y['haradan']]],
                    'blok'   => $y['blok'],
                    'kart'   => $y['kart'],
                ];
            }
        }

        /* Sıra SABİTDİR: səhifə hər açılışda eyni görünməlidir. Boşlar
           ƏVVƏLDƏ — onlar iş tələb edir, dolular isə yalnız məlumatdır. */
        ksort($dolu);

        return array_merge($bos, array_values($dolu));
    }

    /**
     * Təklif olunan açarı təkrarlanmayan hala salır.
     *
     * İki tərcümeyi-hal vərəqi eyni adlı ola bilər; eyni açar isə ikinci
     * şəkli birincinin üstünə yazardı.
     *
     * @param  array<string,mixed>  $dolu
     * @param  list<array<string,mixed>>  $bos
     */
    private static function bosluqsuz(string $teklif, array $dolu, array $bos): string
    {
        $teklif = $teklif !== '' ? $teklif : 'sekil';
        $var = array_keys($dolu);

        foreach ($bos as $b) {
            $var[] = (string) $b['teklif'];
        }

        if (! in_array($teklif, $var, true)) {
            return $teklif;
        }

        for ($i = 2; $i < 200; $i++) {
            if (! in_array($teklif . '-' . $i, $var, true)) {
                return $teklif . '-' . $i;
            }
        }

        return $teklif;
    }
}
