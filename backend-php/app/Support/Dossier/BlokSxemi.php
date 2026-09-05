<?php

declare(strict_types=1);

namespace App\Support\Dossier;

/**
 * Sənədin blok quruluşunun yoxlanışı.
 *
 * `tools/check-dossier.js` faylının blok bölməsinin server tərəfi: qovluq
 * JSON-u bazaya YÜKLƏNMƏZDƏN ƏVVƏL buradan keçir. Səbəb sadədir — qovluqları
 * əl ilə yazan adam səhv etsə, bunu dərhal bilməli, render zamanı ağ ekran
 * görməməlidir.
 *
 * Bu, mövcud davranışdan ciddi fərqdir: əvvəllər naməlum növ sətri səssizcə
 * buraxılırdı və `content`-in forması ümumiyyətlə yoxlanmırdı.
 *
 * Freymvorksuzdur — `tests/logic.php` onu Laravel olmadan yükləyir, ona görə
 * ağ siyahılar `config()` ilə deyil, sinif sabitləri ilə verilir.
 */
final class BlokSxemi
{
    public const BLOKLAR = ['blank', 'basliq', 'sahe', 'metn', 'cedvel', 'kart',
        'yazisma', 'zeng', 'sxem', 'elyazma', 'foto', 'elave', 'imza'];

    public const XARAKTERLER = ['sakit', 'telesik', 'yasli', 'esebi'];
    public const KENAR_NOV   = ['qeyd', 'sual', 'xett', 'daire'];
    public const KENAR_YER   = ['sag', 'sol', 'alt'];
    public const MESAJ_NOV   = ['metn', 'silinmis', 'sistem', 'sesli', 'sekil', 'sened'];
    public const YON         = ['cixan', 'gelen'];
    public const NISAN_NOV   = ['noqte', 'olcu', 'ox', 'shimal'];
    public const KILID_NOV   = ['reqem', 'soz', 'tarix'];
    /** Blank başlığının növləri — `config('dossier.blank_novleri')` ilə eyni. */
    public const BLANK_NOV   = ['resmi', 'qerar', 'arayis', 'protokol', 'ekspert', 'izahat', 'mehkeme'];

    /* Mətndaxili şəkil növləri. Şəkil BLOK DEYİL — `{{ sekil:slug }}` nişanı
       ilə çağırılır və `BLOKLAR` sayına toxunmur. Siyahı burada saxlanılır,
       çünki `config/dossier.php` və `tools/check-dossier.js` onunla tutuşdurulur. */
    public const SEKIL_NOV   = ['camera_still', 'scan', 'plan', 'micro', 'photo', 'generic'];
    public const MOHUR_FORMA = ['daire', 'duzbucaq'];
    public const MOHUR_RENG  = ['mor', 'qirmizi', 'mavi', 'qara'];
    public const LEKE_NOV    = ['qehve', 'yag', 'su'];
    public const CIRILMA     = ['sol', 'sag', 'alt'];
    public const ATAC        = ['sol-ust', 'sag-ust', 'sol-alt'];

    /** Ağır effektlər: üçdən çoxu bir vərəqdə heç birini seçilməz edir. */
    public const AGIR = ['leke', 'cirilma', 'kseroks'];
    public const AGIR_HEDD = 3;

    /** Əlyazma bloku qısa mətn üçündür — bu hədd XƏBƏRDARLIQ verir. */
    public const ELYAZMA_HEDD = 180;

    /** Blok növünə görə: [məcburi açarlar, icazəli açarlar]. */
    private const ACARLAR = [
        'blank'   => [[], ['setirler', 'nov']],
        'basliq'  => [['ad'], ['alt']],
        'sahe'    => [['setirler'], []],
        'metn'    => [['abzaslar'], ['duz', 'cerceve']],
        'cedvel'  => [['basliqlar', 'setirler'], ['vurgu', 'yekun']],
        'kart'    => [['kartlar'], []],
        'yazisma' => [['sohbet', 'gunler'], ['gorulme', 'izah']],
        'zeng'    => [['zengler'], []],
        'sxem'    => [['svg'], ['nisanlar']],
        'elyazma' => [['metn'], ['xarakter', 'bucaq']],
        'foto'    => [['izah'], ['sekil', 'no', 'nisbet']],
        'elave'   => [['setirler'], ['nov', 'bucaq', 'yer']],
        'imza'    => [['vezife'], ['ad', 'tarix']],
    ];

    /**
     * Bir sənədi yoxlayır və Azərbaycan dilində səhv siyahısı qaytarır.
     * Boş siyahı — sənəd etibarlıdır.
     *
     * Xətalar YIĞILIR, atılmır: bir qovluqda on səhv varsa, onunu birdən
     * görmək lazımdır.
     *
     * @param  array<string,mixed>  $sened  seed faylındakı sənəd obyekti
     * @return array{0:list<string>,1:list<string>}  [xətalar, xəbərdarlıqlar]
     */
    public static function yoxla(array $sened): array
    {
        $yer = '«' . (string) ($sened['page'] ?? '?') . '»';
        $err = [];
        $xeb = [];

        /* Render olunan hər şey `content`-in içindədir — bazadakı sütun da
           odur. Sənəd səviyyəsində yalnız kataloq məlumatı və kilid qalır. */
        $c = (array) ($sened['content'] ?? []);
        $bloklar = $c['bloklar'] ?? null;

        if (! is_array($bloklar) || ! array_is_list($bloklar) || $bloklar === []) {
            return [[$yer . ': «bloklar» boş olmayan massiv olmalıdır.'], []];
        }

        foreach ($bloklar as $i => $b) {
            $n = $i + 1;
            $bas = $yer . ' · blok ' . $n;

            if (! is_array($b)) {
                $err[] = $bas . ': obyekt deyil.';
                continue;
            }

            $tip = $b['tip'] ?? null;

            if (! is_string($tip) || ! isset(self::ACARLAR[$tip])) {
                $err[] = $bas . ': naməlum blok növü «' . (is_string($tip) ? $tip : gettype($tip))
                    . '». İcazəlilər: ' . implode(', ', self::BLOKLAR) . '.';
                /* Növ bilinmirsə qalan qaydalar mənasızdır — bir səhv on səhv doğurmasın. */
                continue;
            }

            $bas .= ' (' . $tip . ')';
            [$mecburi, $icaze] = self::ACARLAR[$tip];

            foreach ($mecburi as $k) {
                if (! isset($b[$k])) {
                    $err[] = $bas . ': «' . $k . '» açarı yoxdur.';
                }
            }

            /* Naməlum açar XƏTADIR: yazı səhvi səssizcə itməməlidir.

               Üç açar HƏR blokda icazəlidir: `tip` növü seçir, `kenar` kənar
               qeydini bağlayır, `acar` isə bloka mətnin içindən
               `{{ blok:acar }}` nişanı ilə müraciət etməyə imkan verir.
               Açarsız bloklar əvvəlki kimi sıra ilə render olunur.

               Nişan açarı `acar` adlanır, `ad` YOX: `ad` artıq `basliq`
               blokunun başlıq mətnidir və `imza` blokunda imzalayanın
               adıdır. İki mənalı açar birinci gün işləyər, ikinci gün
               səhv verər. */
            $taninan = array_merge($mecburi, $icaze, ['tip', 'kenar', 'acar']);
            foreach (array_keys($b) as $k) {
                if (! in_array($k, $taninan, true)) {
                    $err[] = $bas . ': naməlum açar «' . $k . '».';
                }
            }

            if (isset($b['acar']) && ! self::acarDuzgun($b['acar'])) {
                $err[] = $bas . ': «acar» yalnız kiçik hərf, rəqəm və defis ola bilər.';
            }

            $err = array_merge($err, self::tipXetalari($bas, $tip, $b, $xeb));
            $err = array_merge($err, self::kenarXetalari($bas, $b['kenar'] ?? null));
        }

        $err = array_merge($err, self::kagizXetalari($yer, $c['kagiz'] ?? null));
        $err = array_merge($err, self::mohurXetalari($yer, $c['mohurler'] ?? null));
        $err = array_merge($err, self::kilidXetalari($yer, $sened['kilid'] ?? null));

        return [array_values($err), array_values($xeb)];
    }

    /**
     * @param  list<string>  $xeb
     * @return list<string>
     */
    private static function tipXetalari(string $bas, string $tip, array $b, array &$xeb): array
    {
        $err = [];

        if ($tip === 'sahe' || $tip === 'blank' || $tip === 'elave') {
            $s = $b['setirler'] ?? [];
            if (! is_array($s)) {
                return [$bas . ': «setirler» massiv olmalıdır.'];
            }
            if ($tip === 'sahe') {
                foreach ($s as $j => $cut) {
                    /* Boş DƏYƏR icazəlidir — real blankda boş sahə olur. */
                    if (! is_array($cut) || count($cut) !== 2 || ! is_string($cut[0] ?? null)) {
                        $err[] = $bas . ': ' . ($j + 1) . '-ci sətir [ad, dəyər] cütü olmalıdır.';
                        break;
                    }
                }
            }
        }

        if ($tip === 'blank' && isset($b['nov']) && ! in_array($b['nov'], self::BLANK_NOV, true)) {
            $err[] = $bas . ': naməlum blank növü. İcazəlilər: ' . implode(', ', self::BLANK_NOV) . '.';
        }

        if ($tip === 'metn') {
            $a = $b['abzaslar'] ?? [];
            if (! is_array($a) || $a === []) {
                $err[] = $bas . ': «abzaslar» boş ola bilməz.';
            } else {
                foreach ($a as $p) {
                    if (! is_string($p)) {
                        $err[] = $bas . ': «abzaslar» yalnız mətn elementlərindən ibarətdir.';
                        break;
                    }
                }
            }
        }

        if ($tip === 'cedvel') {
            $h = $b['basliqlar'] ?? [];
            $r = $b['setirler'] ?? [];
            $say = is_array($h) ? count($h) : 0;

            if ($say === 0) {
                $err[] = $bas . ': «basliqlar» boş ola bilməz.';
            }

            if (! is_array($r) || $r === []) {
                $err[] = $bas . ': «setirler» boş ola bilməz.';
            } else {
                foreach ($r as $j => $row) {
                    if (! is_array($row) || ($say > 0 && count($row) !== $say)) {
                        $err[] = $bas . ': sətir ' . ($j + 1) . '-də '
                            . (is_array($row) ? count($row) : 0) . ' xana var, başlıq ' . $say . '-dir.';
                        break;
                    }
                }
                foreach ((array) ($b['vurgu'] ?? []) as $v) {
                    if (! is_int($v) || $v < 0 || $v >= count($r)) {
                        $err[] = $bas . ': «vurgu» indeksi aralıqdan kənardadır (' . json_encode($v) . ').';
                        break;
                    }
                }
            }

            if (isset($b['yekun']) && (! is_array($b['yekun']) || ($say > 0 && count($b['yekun']) !== $say))) {
                $err[] = $bas . ': «yekun» sətri ' . $say . ' xanadan ibarət olmalıdır.';
            }
        }

        if ($tip === 'kart') {
            foreach ((array) ($b['kartlar'] ?? []) as $j => $k) {
                if (! is_array($k) || ! isset($k['ad'], $k['metn'])) {
                    $err[] = $bas . ': kart ' . ($j + 1) . '-də «ad» və ya «metn» yoxdur.';
                    break;
                }

                /* Sübutun şəkli — kitabxanadakı açar. Fayl adı DEYİL: şəkil
                   sətri silinib yenidən yüklənəndə fayl adı dəyişir, açar isə
                   qalır. Boş sətir «şəkil yoxdur» deməkdir və icazəlidir —
                   qovluqda hər əşyanın fotosu olmaya bilər. */
                if (isset($k['sekil']) && $k['sekil'] !== '' && ! self::acarDuzgun($k['sekil'])) {
                    $err[] = $bas . ': kart ' . ($j + 1) . '-də «sekil» açarı düzgün deyil.';
                    break;
                }

                foreach (array_keys($k) as $ak) {
                    if (! in_array($ak, ['ad', 'metn', 'sekil', 'elyazma'], true)) {
                        $err[] = $bas . ': kart ' . ($j + 1) . '-də naməlum açar «' . $ak . '».';
                        break 2;
                    }
                }
            }
        }

        /* Foto blokunun şəkli də kitabxana açarıdır — kartın qaydası: fayl
           adı və ya URL deyil, yenidən yükləmədə sağ qalan açar. `null` və
           boş sətir «foto əlavə edilməyib» deməkdir və icazəlidir. */
        if ($tip === 'foto' && isset($b['sekil']) && $b['sekil'] !== null
            && $b['sekil'] !== '' && ! self::acarDuzgun($b['sekil'])) {
            $err[] = $bas . ': «sekil» kitabxana açarı olmalıdır (kiçik hərf, rəqəm, defis).';
        }

        if ($tip === 'zeng') {
            foreach ((array) ($b['zengler'] ?? []) as $j => $z) {
                if (! is_array($z) || ! isset($z['saat'], $z['abunec'])) {
                    $err[] = $bas . ': zəng ' . ($j + 1) . '-də «saat» və ya «abunec» yoxdur.';
                    break;
                }
            }
        }

        if ($tip === 'yazisma') {
            $err = array_merge($err, self::yazismaXetalari($bas, $b));
        }

        if ($tip === 'sxem') {
            if (! is_string($b['svg'] ?? null) || stripos(trim((string) ($b['svg'] ?? '')), '<svg') !== 0) {
                $err[] = $bas . ': «svg» «<svg» ilə başlamalıdır.';
            }
            foreach ((array) ($b['nisanlar'] ?? []) as $j => $ni) {
                $e = self::nisanXetasi($ni);
                if ($e !== '') {
                    $err[] = $bas . ': nişan ' . ($j + 1) . ' — ' . $e;
                    break;
                }
            }
        }

        if ($tip === 'elyazma') {
            $m = (string) ($b['metn'] ?? '');
            if (trim($m) === '') {
                $err[] = $bas . ': «metn» boş ola bilməz.';
            } elseif (mb_strlen($m) > self::ELYAZMA_HEDD) {
                /* XƏBƏRDARLIQ, xəta deyil: uzun izahat əlyazma ilə verilməz,
                   amma seed-i dayandırmaq da lazım deyil. */
                $xeb[] = $bas . ': əlyazma ' . self::ELYAZMA_HEDD . ' simvolu aşır ('
                    . mb_strlen($m) . '). Uzun izahatı «metn» bloku ilə ver.';
            }
            if (isset($b['xarakter']) && ! in_array($b['xarakter'], self::XARAKTERLER, true)) {
                $err[] = $bas . ': naməlum xarakter. İcazəlilər: ' . implode(', ', self::XARAKTERLER) . '.';
            }
        }

        if ($tip === 'imza' && ! is_string($b['vezife'] ?? null)) {
            $err[] = $bas . ': «vezife» mətn olmalıdır.';
        }

        return $err;
    }

    /** @return list<string> */
    private static function yazismaXetalari(string $bas, array $b): array
    {
        $err = [];
        $gunler = $b['gunler'] ?? [];

        if (! is_array($gunler) || $gunler === []) {
            return [$bas . ': «gunler» boş ola bilməz.'];
        }

        foreach ($gunler as $gi => $gun) {
            if (! is_array($gun) || ! is_array($gun['mesajlar'] ?? null)) {
                $err[] = $bas . ': gün ' . ($gi + 1) . '-də «mesajlar» yoxdur.';
                break;
            }

            foreach ($gun['mesajlar'] as $mi => $m) {
                $yeri = $bas . ': gün ' . ($gi + 1) . ', mesaj ' . ($mi + 1);

                if (! is_array($m)) {
                    $err[] = $yeri . ' obyekt deyil.';
                    break;
                }

                $nov = $m['nov'] ?? 'metn';

                if (! in_array($nov, self::MESAJ_NOV, true)) {
                    $err[] = $yeri . ': naməlum mesaj növü «' . (is_string($nov) ? $nov : gettype($nov)) . '».';
                    break;
                }

                /* Sistem qeydinin istiqaməti yoxdur — o, söhbətin ortasındadır. */
                if ($nov !== 'sistem' && isset($m['yon']) && ! in_array($m['yon'], self::YON, true)) {
                    $err[] = $yeri . ': «yon» yalnız ' . implode(' / ', self::YON) . ' ola bilər.';
                    break;
                }

                $lazim = match ($nov) {
                    'metn', 'sistem' => ['metn'],
                    'sesli'          => ['saniye'],
                    'sened'          => ['ad'],
                    default          => [],
                };

                foreach ($lazim as $k) {
                    if (! isset($m[$k])) {
                        $err[] = $yeri . ': «' . $nov . '» növü üçün «' . $k . '» açarı lazımdır.';
                        break 2;
                    }
                }
            }
        }

        return $err;
    }

    private static function nisanXetasi(mixed $ni): string
    {
        if (! is_array($ni)) {
            return 'obyekt deyil.';
        }

        $nov = $ni['nov'] ?? null;

        if (! in_array($nov, self::NISAN_NOV, true)) {
            return 'naməlum nişan növü. İcazəlilər: ' . implode(', ', self::NISAN_NOV) . '.';
        }

        $lazim = $nov === 'olcu' || $nov === 'ox' ? ['x1', 'y1', 'x2', 'y2'] : ['x', 'y'];

        foreach ($lazim as $k) {
            if (! isset($ni[$k]) || ! is_numeric($ni[$k])) {
                return '«' . $k . '» rəqəm olmalıdır (sxemin öz viewBox koordinatı).';
            }
        }

        return '';
    }

    /** @return list<string> */
    private static function kenarXetalari(string $bas, mixed $k): array
    {
        if ($k === null) {
            return [];
        }

        if (! is_array($k) || ! isset($k['metn'])) {
            return [$bas . ': «kenar» üçün «metn» lazımdır.'];
        }

        $err = [];

        if (isset($k['nov']) && ! in_array($k['nov'], self::KENAR_NOV, true)) {
            $err[] = $bas . ': naməlum kənar növü. İcazəlilər: ' . implode(', ', self::KENAR_NOV) . '.';
        }

        if (isset($k['yer']) && ! in_array($k['yer'], self::KENAR_YER, true)) {
            $err[] = $bas . ': naməlum kənar yeri. İcazəlilər: ' . implode(', ', self::KENAR_YER) . '.';
        }

        return $err;
    }

    /** @return list<string> */
    private static function kagizXetalari(string $yer, mixed $k): array
    {
        if ($k === null) {
            return [];
        }

        if (! is_array($k)) {
            return [$yer . ': «kagiz» obyekt olmalıdır.'];
        }

        $err = [];
        $taninan = ['kohnelme', 'qat', 'leke', 'cirilma', 'kseroks', 'egilme', 'barmaq', 'atac'];

        foreach (array_keys($k) as $a) {
            if (! in_array($a, $taninan, true)) {
                $err[] = $yer . ': «kagiz» içində naməlum açar «' . $a . '».';
            }
        }

        foreach (['kohnelme', 'kseroks'] as $a) {
            if (isset($k[$a]) && (! is_int($k[$a]) || $k[$a] < 0 || $k[$a] > 3)) {
                $err[] = $yer . ': «' . $a . '» 0–3 aralığında olmalıdır.';
            }
        }

        if (isset($k['cirilma']) && ! in_array($k['cirilma'], self::CIRILMA, true)) {
            $err[] = $yer . ': «cirilma» yalnız ' . implode(' / ', self::CIRILMA) . ' ola bilər.';
        }

        if (isset($k['atac']) && ! in_array($k['atac'], self::ATAC, true)) {
            $err[] = $yer . ': «atac» yalnız ' . implode(' / ', self::ATAC) . ' ola bilər.';
        }

        foreach ((array) ($k['leke'] ?? []) as $l) {
            if (! is_array($l) || ! in_array($l['nov'] ?? null, self::LEKE_NOV, true)) {
                $err[] = $yer . ': «leke.nov» yalnız ' . implode(' / ', self::LEKE_NOV) . ' ola bilər.';
                break;
            }
        }

        /* ÜÇDƏN ÇOX AĞIR EFFEKT OLMAZ. Hər vərəq ləkəli və qatlanmış olanda
           heç biri seçilmir. Bu, dizayn qaydasıdır — xəbərdarlıq yox, xəta. */
        $agir = 0;
        foreach (self::AGIR as $a) {
            if (! empty($k[$a])) {
                $agir++;
            }
        }
        if (! empty($k['kohnelme']) && (int) $k['kohnelme'] >= 2) {
            $agir++;
        }

        if ($agir > self::AGIR_HEDD) {
            $err[] = $yer . ': ' . $agir . ' ağır fiziki effekt var, ən çoxu '
                . self::AGIR_HEDD . ' ola bilər (ləkə · cırılma · kseroks · köhnəlmə ≥ 2).';
        }

        return $err;
    }

    /** @return list<string> */
    private static function mohurXetalari(string $yer, mixed $m): array
    {
        if ($m === null) {
            return [];
        }

        if (! is_array($m) || ! array_is_list($m)) {
            return [$yer . ': «mohurler» massiv olmalıdır.'];
        }

        $err = [];

        foreach ($m as $i => $mo) {
            $bas = $yer . ' · möhür ' . ($i + 1);

            if (! is_array($mo) || ! is_array($mo['metn'] ?? null) || $mo['metn'] === []) {
                $err[] = $bas . ': «metn» boş olmayan massiv olmalıdır.';
                break;
            }

            if (isset($mo['forma']) && ! in_array($mo['forma'], self::MOHUR_FORMA, true)) {
                $err[] = $bas . ': naməlum forma. İcazəlilər: ' . implode(', ', self::MOHUR_FORMA) . '.';
                break;
            }

            if (isset($mo['reng']) && ! in_array($mo['reng'], self::MOHUR_RENG, true)) {
                $err[] = $bas . ': naməlum rəng. İcazəlilər: ' . implode(', ', self::MOHUR_RENG) . '.';
                break;
            }

            if (isset($mo['seffaflik']) && (! is_numeric($mo['seffaflik'])
                || $mo['seffaflik'] < 0.15 || $mo['seffaflik'] > 0.9)) {
                /* Möhür mətnin üstünə düşəndə mətn oxunaqlı qalmalıdır. */
                $err[] = $bas . ': «seffaflik» 0.15–0.9 aralığında olmalıdır (mətn oxunaqlı qalsın).';
                break;
            }
        }

        return $err;
    }

    /** @return list<string> */
    private static function kilidXetalari(string $yer, mixed $k): array
    {
        if ($k === null) {
            return [];
        }

        if (! is_array($k)) {
            return [$yer . ': «kilid» obyekt olmalıdır.'];
        }

        $nov = $k['nov'] ?? null;
        $kod = (string) ($k['kod'] ?? '');
        $err = [];

        if (! in_array($nov, self::KILID_NOV, true)) {
            return [$yer . ': naməlum kilid növü. İcazəlilər: ' . implode(', ', self::KILID_NOV) . '.'];
        }

        if ($kod === '') {
            $err[] = $yer . ': kilidin «kod» açarı boş ola bilməz.';
        } elseif ($nov === 'reqem' && preg_match('/^\d{4}$/', $kod) !== 1) {
            $err[] = $yer . ': «reqem» kilidi üçün kod dörd rəqəm olmalıdır.';
        } elseif ($nov === 'tarix' && preg_match('/^\d{2}\.\d{2}\.\d{4}$/', $kod) !== 1) {
            $err[] = $yer . ': «tarix» kilidi üçün kod GG.AA.İİİİ formasında olmalıdır.';
        } elseif ($nov === 'soz' && mb_strlen($kod) < 3) {
            $err[] = $yer . ': «soz» kilidi üçün kod ən azı üç hərf olmalıdır.';
        }

        if (! isset($k['ipucu']) || trim((string) $k['ipucu']) === '') {
            $err[] = $yer . ': kilidin ipucu olmalıdır — yoxsa tapmaca həll edilə bilməz.';
        }

        return $err;
    }

    /**
     * Blokun nişan açarı `{{ blok:acar }}` nişanına düşür, ona görə nişan
     * əlifbası ilə eyni olmalıdır: kiçik hərf, rəqəm, defis. Böyük «İ» tələsi
     * buradadır — müqayisə açıq əlifba ilə edilir, `strtolower` ilə yox.
     */
    public static function acarDuzgun(mixed $acar): bool
    {
        return is_string($acar) && preg_match('/^[a-z0-9][a-z0-9-]{0,58}$/', $acar) === 1;
    }
}
