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

        if ($body !== '' && preg_match_all(Isare::NISAN, $body, $m, PREG_SET_ORDER | PREG_OFFSET_CAPTURE)) {
            foreach ($m as $x) {
                if ($x[1][0] !== 'sekil') {
                    continue;
                }

                $out[] = self::yuva(
                    $x[2][0],
                    'mətndəki nişan',
                    '',
                    null,
                    null,
                    'nisan',
                    /* Nişanın ƏTRAFINDAKI cümlə şəklin nə olduğunu deyir —
                       açar tək başına «kamera-01»dir və heç nə izah etmir. */
                    self::etraf($body, (int) $x[0][1])
                );
            }
        }

        /* 2–3. Bloklar. */
        $bloklar = (array) (($sened['content'] ?? [])['bloklar'] ?? []);

        foreach ($bloklar as $i => $b) {
            $tip = (string) ($b['tip'] ?? '');

            if ($tip === 'foto') {
                $izah = self::temiz((string) ($b['izah'] ?? ''));

                $out[] = self::yuva(
                    trim((string) ($b['sekil'] ?? '')),
                    'foto çərçivəsi',
                    $izah,
                    (int) $i,
                    null,
                    'foto',
                    $izah
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

                /* Əşyanın MƏTNİ şəklin nə göstərməli olduğunu deyir —
                   ad tək başına «Mərmər lövhə»dir, mətn isə ölçüsünü,
                   vəziyyətini və üzərindəki izləri yazır. */
                $metn = self::temiz((string) ($k['metn'] ?? ''));

                $out[] = self::yuva(
                    trim((string) ($k['sekil'] ?? '')),
                    $ad === '' ? 'maddi sübut' : 'maddi sübut: ' . $ad,
                    $ad,
                    (int) $i,
                    (int) $ki,
                    'kart',
                    trim($ad . ($metn !== '' ? ' — ' . $metn : ''), ' -—')
                );
            }
        }

        return $out;
    }

    /**
     * Seed məzmununu yazarkən İDARƏÇİNİN BAĞLADIĞI ŞƏKİLLƏRİ saxlayır.
     *
     * Şəkillər yalnız idarə panelindən yüklənir, yəni `foto` blokunun və
     * maddi sübut kartlarının `sekil` açarı seed faylında HEÇ VAXT olmur —
     * o, bazada yaranır. Məzmun olduğu kimi yazılsaydı, hər `db:seed`
     * bütün bağlamaları silərdi: şəkillər kitabxanada qalar, vərəqlərdə isə
     * çərçivələr boşalardı. Bu, `status`/`sort` qaydasının davamıdır —
     * seed idarəçinin sahib olduğu sahəyə toxunmur.
     *
     * Bağlama BLOKUN YERİNƏ görə köçürülür: bloklar sıralı siyahıdır və
     * seed faylı onların sırasının sahibidir. Blok növü dəyişibsə (məsələn
     * `foto` yerinə `cedvel` gəlibsə) köhnə bağlama ATILIR — yanlış yerə
     * yapışdırmaqdansa boş çərçivə dürüstdür.
     *
     * @param  array<string,mixed>  $yeni   seed faylındakı məzmun
     * @param  array<string,mixed>  $kohne  bazadakı məzmun
     * @return array<string,mixed>
     */
    public static function sekilleriSaxla(array $yeni, array $kohne): array
    {
        $k = (array) ($kohne['bloklar'] ?? []);

        if ($k === []) {
            return $yeni;
        }

        $y = (array) ($yeni['bloklar'] ?? []);

        foreach ($y as $i => $b) {
            $tip = $b['tip'] ?? '';

            if (! isset($k[$i]) || ($k[$i]['tip'] ?? '') !== $tip) {
                continue;
            }

            if ($tip === 'foto') {
                $var = (string) ($k[$i]['sekil'] ?? '');

                if ($var !== '' && ($b['sekil'] ?? '') === '') {
                    $y[$i]['sekil'] = $var;
                }

                continue;
            }

            if ($tip !== 'kart') {
                continue;
            }

            foreach ((array) ($b['kartlar'] ?? []) as $ki => $kart) {
                $var = (string) ($k[$i]['kartlar'][$ki]['sekil'] ?? '');

                if ($var !== '' && ($kart['sekil'] ?? '') === '') {
                    $y[$i]['kartlar'][$ki]['sekil'] = $var;
                }
            }
        }

        $yeni['bloklar'] = $y;

        return $yeni;
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
        ?int $kart = null,
        string $nov = '',
        string $izah = ''
    ): array {
        return [
            'acar'    => $acar,
            'teklif'  => $acar === '' ? Isare::slugla(($ad !== '' ? $ad : $haradan) . '.x') : '',
            'haradan' => $haradan,
            'nov'     => $nov,
            /* İZAH — şəklin NƏ OLMALI olduğunu deyən mətn. Sənədin öz
               sözləridir: foto çərçivəsinin altyazısı, əşyanın təsviri
               və ya nişanın ətrafındakı cümlə. Uydurulmur. */
            'izah'    => $izah,
            'blok'    => $blok,
            'kart'    => $kart,
        ];
    }

    /**
     * Sənəd işarələrini atır: `**qalın**`, `[[qırmızı]]`, `((oxunmaz))` və s.
     * Onlar vərəqin dilidir, şəklin təsviri deyil.
     */
    private static function temiz(string $m): string
    {
        $m = preg_replace('/\{\{[^}]*\}\}/u', '', $m) ?? $m;
        $m = preg_replace('/[*+~%]{2}|\[\[|\]\]|\(\(|\)\)/u', '', $m) ?? $m;

        return trim(preg_replace('/\s+/u', ' ', $m) ?? $m);
    }

    /** Nişanın ətrafındakı cümlə — şəklin kontekstini o verir. */
    private static function etraf(string $body, int $yer): string
    {
        $bas = max(0, $yer - 220);

        return self::temiz(mb_strcut($body, $bas, 440));
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
                    $dolu[$y['acar']]['nov'] ??= $y['nov'];

                    /* İzah BİRİNCİ işlənən yerdən götürülür: sonrakı
                       vərəqlər eyni şəkli təkrar göstərir, təsvir isə
                       birinci dəfə verilir. */
                    if (($dolu[$y['acar']]['izah'] ?? '') === '') {
                        $dolu[$y['acar']]['izah'] = $y['izah'];
                    }

                    $dolu[$y['acar']]['yerler'][] = $yer + ['haradan' => $y['haradan']];

                    continue;
                }

                /* Boş çərçivə birləşdirilə BİLMƏZ: iki fərqli vərəqin boş
                   portret yeri iki fərqli şəkil istəyir. */
                $bos[] = [
                    'acar'   => '',
                    'teklif' => self::bosluqsuz($y['teklif'], $dolu, $bos),
                    'nov'    => $y['nov'],
                    'izah'   => $y['izah'],
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
