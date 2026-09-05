<?php

declare(strict_types=1);

namespace App\Support\Dossier;

/**
 * İşin dərc olunmağa hazır olub-olmadığının yoxlanışı.
 *
 * `BlokSxemi`-nin qardaşıdır və eyni intizamla yazılıb: XƏTA ATMIR, YIĞIR.
 * Bir səhv qalanları görməyə mane olmamalıdır — idarəçi siyahını bir dəfə
 * oxuyub hamısını düzəltməlidir, on dəfə saxlayıb bir-bir tapmamalıdır.
 *
 * İki səviyyə var və fərq mexanikidir:
 *   XƏTA  — dərc etməyə imkan vermir. Oyun onsuz sınıqdır: kilidi açılmayan
 *           vərəq, qatili olmayan iş, tapılası olmayan kod.
 *   QEYD  — yalnız məlumat. Boş vərəq nömrəsi və ya istifadəsiz şəkil oyunu
 *           sındırmır, amma idarəçinin bilməli olduğu şeydir.
 *
 * VƏRƏQ NÖMRƏLƏRİ HƏMİŞƏ SƏTİRDİR. «14» kimi görünən açar PHP massivində
 * səssizcə `int`-ə çevrilir və «14» ilə 14 eyni açar olur; ona görə nömrələr
 * bu sinifdə heç vaxt assosiativ açar kimi işlədilmir, yalnız siyahıda.
 *
 * `App\Support` qaydası: framework yoxdur — girişi çağıran yığır.
 */
final class QovluqYoxlayici
{
    /**
     * @param array{
     *   senedler?: list<array<string,mixed>>,
     *   kodlar?: list<array<string,mixed>>,
     *   subheliler?: list<array<string,mixed>>,
     *   sonluqlar?: list<array<string,mixed>>,
     *   sekiller?: list<array<string,mixed>>
     * } $qovluq
     * @return array{xetalar: list<string>, qeydler: list<string>}
     */
    public static function yoxla(array $qovluq): array
    {
        $senedler   = array_values((array) ($qovluq['senedler'] ?? []));
        $kodlar     = array_values((array) ($qovluq['kodlar'] ?? []));
        $subheliler = array_values((array) ($qovluq['subheliler'] ?? []));
        $sonluqlar  = array_values((array) ($qovluq['sonluqlar'] ?? []));
        $sekiller   = array_values((array) ($qovluq['sekiller'] ?? []));

        $xeta = [];
        $qeyd = [];

        if ($senedler === []) {
            $xeta[] = 'Qovluqda heç bir sənəd yoxdur.';
        }

        [$kodXeta, $kodQeyd] = self::kodXetalari($kodlar, $senedler);
        $xeta = array_merge($xeta, $kodXeta);
        $qeyd = array_merge($qeyd, $kodQeyd);
        $xeta = array_merge($xeta, self::kilidXetalari($senedler, $kodlar));
        $xeta = array_merge($xeta, self::sonluqXetalari($subheliler, $sonluqlar));

        [$nisanXeta, $nisanQeyd] = self::nisanXetalari($senedler, $sekiller);
        $xeta = array_merge($xeta, $nisanXeta);
        $qeyd = array_merge($qeyd, $nisanQeyd);

        [$nomreXeta, $nomreQeyd] = self::nomreXetalari($senedler);
        $xeta = array_merge($xeta, $nomreXeta);
        $qeyd = array_merge($qeyd, $nomreQeyd);

        $qeyd = array_merge($qeyd, self::qaralamaQeydleri($senedler));

        return ['xetalar' => array_values($xeta), 'qeydler' => array_values($qeyd)];
    }

    /**
     * Kodun rəqəmləri göstərilən mənbə vərəqlərdə HƏQİQƏTƏN varmı.
     *
     * Bu, bütün siyahının ən vacib yoxlamasıdır: tapılası olmayan kod oyunu
     * dalana dirəyir və oyunçu bunu ancaq yarım saat axtarandan sonra bilir.
     *
     * @param list<array<string,mixed>> $kodlar
     * @param list<array<string,mixed>> $senedler
     * @return array{0: list<string>, 1: list<string>}
     */
    protected static function kodXetalari(array $kodlar, array $senedler): array
    {
        $err = [];
        $qeyd = [];
        $metn = [];

        foreach ($senedler as $s) {
            $metn[(int) ($s['id'] ?? 0)] = self::senedMetni($s);
        }

        foreach ($kodlar as $k) {
            $kod = trim((string) ($k['code'] ?? ''));
            $ad = self::kodAdi($k);

            if ($kod === '') {
                $err[] = $ad . ': kod boşdur.';

                continue;
            }

            $menbe = array_values(array_filter(array_map('intval', (array) ($k['source_document_ids'] ?? []))));

            /* Mənbə göstərilməməsi XƏTA DEYİL: seed faylı ilə gələn qovluqlarda
               bu məlumat yoxdur və onların hamısını dərc olunmaz etmək səhv
               olardı. Göstərilsə, rəqəmlər həqiqətən orada axtarılır — yəni
               qeyd doldurulanda yoxlama gücə minir. */
            if ($menbe === []) {
                $qeyd[] = $ad . ': kodun hansı vərəqlərdən yığıldığı göstərilməyib —
                    doldursanız, rəqəmlərin həmin vərəqlərdə olduğu yoxlanılacaq.';

                continue;
            }

            /* Rəqəmlər BİR mənbədə yox, mənbələrin CƏMİNDƏ olmalıdır: kod
               adətən üç ayrı vərəqdən bir-bir yığılır. */
            $govde = '';

            foreach ($menbe as $id) {
                if (! array_key_exists($id, $metn)) {
                    $err[] = $ad . ': mənbə kimi göstərilən vərəq bu qovluqda yoxdur.';
                    $govde = null;

                    break;
                }

                $govde .= "\n" . $metn[$id];
            }

            if ($govde === null) {
                continue;
            }

            $eksik = [];

            foreach (self::reqemler($kod) as $r) {
                if (mb_strpos($govde, $r) === false) {
                    $eksik[] = $r;
                }
            }

            if ($eksik !== []) {
                $err[] = $ad . ': «' . implode('», «', $eksik) . '» rəqəmi mənbə vərəqlərin mətnində tapılmır.';
            }
        }

        return [$err, $qeyd];
    }

    /**
     * Kodun tapılası hissələri — AYRI-AYRI RƏQƏMLƏR, tam kod yox.
     *
     * Tam kodu axtarmaq yanlış olardı: kodun mənbə vərəqdə hərfən
     * yazılmaması elə oyunun özüdür («Pink-6» → 6, sayğacın son iki
     * rəqəmi → 81, açarlıq markası → 9). `tools/check-dossier.js` §3 hətta
     * kodun `content` içində GÖRÜNMƏMƏSİNİ tələb edir.
     *
     * Ona görə yoxlama zəifdir, amma doğrudur: hər rəqəm mənbələrin
     * hansındasa görünməlidir. Bu, «mənbə kimi tamam başqa vərəq
     * göstərilib» halını tutur — praktikada ən çox rast gələn səhvi.
     *
     * @return list<string>
     */
    protected static function reqemler(string $kod): array
    {
        return array_values(array_unique(preg_split('//u', $kod, -1, PREG_SPLIT_NO_EMPTY) ?: []));
    }

    /**
     * Hər kilidli vərəqin kodu varmı.
     *
     * @param list<array<string,mixed>> $senedler
     * @param list<array<string,mixed>> $kodlar
     * @return list<string>
     */
    protected static function kilidXetalari(array $senedler, array $kodlar): array
    {
        $err = [];
        $var = [];

        foreach ($kodlar as $k) {
            $var[(int) ($k['id'] ?? 0)] = true;
        }

        foreach ($senedler as $s) {
            if (empty($s['is_locked'])) {
                continue;
            }

            $id = (int) ($s['unlock_code_id'] ?? 0);

            if ($id === 0) {
                $err[] = self::senedAdi($s) . ': kilidlidir, amma kod seçilməyib.';

                continue;
            }

            if (! isset($var[$id])) {
                $err[] = self::senedAdi($s) . ': seçilmiş kod artıq mövcud deyil.';
            }
        }

        return $err;
    }

    /**
     * Qatil, sonluqlar və doğru sonluq.
     *
     * @param list<array<string,mixed>> $subheliler
     * @param list<array<string,mixed>> $sonluqlar
     * @return list<string>
     */
    protected static function sonluqXetalari(array $subheliler, array $sonluqlar): array
    {
        $err = [];

        if ($subheliler === []) {
            return ['Qovluqda şübhəli yoxdur.'];
        }

        $qatil = array_values(array_filter($subheliler, static fn (array $s): bool => ! empty($s['is_culprit'])));

        if ($qatil === []) {
            $err[] = 'Heç bir şübhəli qatil kimi işarələnməyib.';
        } elseif (count($qatil) > 1) {
            $err[] = 'Bir neçə şübhəli qatil kimi işarələnib: ' . self::adlar($qatil) . '.';
        }

        /* Sonluq yoxdursa iş köhnə üç suallıq rejimdədir — bu, səhv deyil.
           Amma BİR sonluq varsa, hamısı olmalıdır: yarımçıq siyahı oyunçunu
           seçdiyi şübhəlidə boş ekranla qoyardı. */
        if ($sonluqlar === []) {
            return $err;
        }

        $bagli = [];

        foreach ($sonluqlar as $e) {
            $bagli[(int) ($e['suspect_id'] ?? 0)] = true;

            if (trim((string) ($e['verdict_text'] ?? '')) === '') {
                $err[] = 'Sonluqlardan birinin hökm mətni boşdur.';
            }
        }

        foreach ($subheliler as $s) {
            if (! isset($bagli[(int) ($s['id'] ?? 0)])) {
                $err[] = '«' . (string) ($s['name'] ?? '?') . '» üçün sonluq yazılmayıb.';
            }
        }

        $dogru = array_values(array_filter($sonluqlar, static fn (array $e): bool => ! empty($e['is_true_ending'])));

        if ($dogru === []) {
            $err[] = 'Heç bir sonluq doğru sonluq kimi işarələnməyib.';
        } elseif (count($dogru) > 1) {
            $err[] = 'Bir neçə sonluq doğru sonluq kimi işarələnib.';
        } elseif ($qatil !== [] && count($qatil) === 1) {
            $qatilId = (int) ($qatil[0]['id'] ?? 0);

            if ((int) ($dogru[0]['suspect_id'] ?? 0) !== $qatilId) {
                $err[] = 'Doğru sonluq qatil kimi işarələnmiş şübhəliyə aid deyil.';
            }
        }

        return $err;
    }

    /**
     * Mətndəki nişanların qarşılığı varmı və kitabxanada artıq şəkil qalıbmı.
     *
     * @param list<array<string,mixed>> $senedler
     * @param list<array<string,mixed>> $sekiller
     * @return array{0: list<string>, 1: list<string>}
     */
    protected static function nisanXetalari(array $senedler, array $sekiller): array
    {
        $err = [];
        $qeyd = [];

        $movcud = [];

        foreach ($sekiller as $s) {
            $movcud[(string) ($s['slug'] ?? '')] = true;
        }

        $islenen = [];

        foreach ($senedler as $s) {
            $nisan = Isare::nisanlar(self::senedMetni($s));
            $bloklar = [];

            foreach ((array) ($s['bloklar'] ?? []) as $b) {
                if (is_array($b) && isset($b['acar']) && is_string($b['acar'])) {
                    $bloklar[$b['acar']] = true;
                }
            }

            foreach ($nisan['sekil'] as $slug) {
                $islenen[$slug] = true;

                if (! isset($movcud[$slug])) {
                    $err[] = self::senedAdi($s) . ': «' . $slug . '» slug-lı şəkil kitabxanada yoxdur.';
                }
            }

            foreach ($nisan['blok'] as $acar) {
                if (! isset($bloklar[$acar])) {
                    $err[] = self::senedAdi($s) . ': «' . $acar . '» açarlı blok sənəddə yoxdur.';
                }
            }
        }

        foreach (array_keys($movcud) as $slug) {
            if (! isset($islenen[$slug])) {
                $qeyd[] = '«' . $slug . '» şəkli heç bir sənəddə istifadə olunmur.';
            }
        }

        return [$err, $qeyd];
    }

    /**
     * Vərəq nömrələri.
     *
     * @param list<array<string,mixed>> $senedler
     * @return array{0: list<string>, 1: list<string>}
     */
    protected static function nomreXetalari(array $senedler): array
    {
        $err = [];
        $qeyd = [];

        /* Nömrələr SƏTİR kimi saxlanılır — assosiativ açar kimi işlədilsəydi,
           «14» ilə 14 eyni açara düşərdi və təkrar görünməzdi. */
        $gorulen = [];

        foreach ($senedler as $s) {
            $no = trim((string) ($s['page'] ?? ''));

            if ($no === '') {
                $qeyd[] = self::senedAdi($s) . ': vərəq nömrəsi boşdur.';

                continue;
            }

            if (in_array($no, $gorulen, true)) {
                $err[] = 'Vərəq nömrəsi təkrarlanır: «' . $no . '».';

                continue;
            }

            $gorulen[] = $no;
        }

        return [$err, $qeyd];
    }

    /**
     * Dərc olunmamış qaralamalar.
     *
     * @param list<array<string,mixed>> $senedler
     * @return list<string>
     */
    protected static function qaralamaQeydleri(array $senedler): array
    {
        $qeyd = [];

        foreach ($senedler as $s) {
            $q = $s['draft_body'] ?? null;

            if ($q !== null && (string) $q !== (string) ($s['body'] ?? '')) {
                $qeyd[] = self::senedAdi($s) . ': dərc olunmamış qaralama var.';
            }
        }

        return $qeyd;
    }

    /**
     * Yoxlamaların oxuduğu mətn — dərc olunmuş gövdə, qaralama yox.
     *
     * BLOKLAR DA DAXİLDİR. Vərəqin mətni iki yerdə ola bilər: `body`
     * (mətn rejimi) və ya `content.bloklar` (blok rejimi — seed ilə gələn
     * 84 vərəq və AI-nin qurduğu hər vərəq belədir). Yalnız `body`
     * oxunsaydı, kodun rəqəmləri bloklu vərəqdə HEÇ VAXT tapılmazdı və
     * hər belə iş dərc olunmaz qalardı.
     */
    protected static function senedMetni(array $s): string
    {
        $metn = (string) ($s['body'] ?? '');

        /* Blokların bütün mətn dəyərləri düzə yığılır: quruluş burada
           əhəmiyyətsizdir, axtarılan yalnız sözlər və rəqəmlərdir. */
        /* Massiv DƏYİŞƏNƏ yığılır: `array_walk_recursive()` birinci arqumenti
           istinadla alır və ifadə ötürülə bilməz. */
        $bloklar = (array) ($s['bloklar'] ?? []);

        array_walk_recursive(
            $bloklar,
            static function ($v) use (&$metn): void {
                if (is_scalar($v)) {
                    $metn .= "\n" . $v;
                }
            }
        );

        return $metn;
    }

    protected static function senedAdi(array $s): string
    {
        $no = trim((string) ($s['page'] ?? ''));
        $ad = trim((string) ($s['name'] ?? ''));

        return '«' . ($no === '' ? '?' : $no) . '» ' . ($ad === '' ? 'adsız vərəq' : $ad);
    }

    protected static function kodAdi(array $k): string
    {
        $ad = trim((string) ($k['label'] ?? ''));

        return 'Kod «' . ($ad === '' ? (string) ($k['code'] ?? '?') : $ad) . '»';
    }

    /** @param list<array<string,mixed>> $rows */
    protected static function adlar(array $rows): string
    {
        return implode(', ', array_map(static fn (array $r): string => (string) ($r['name'] ?? '?'), $rows));
    }
}
