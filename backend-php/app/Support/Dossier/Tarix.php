<?php

declare(strict_types=1);

namespace App\Support\Dossier;

/**
 * Sənədin tarixi.
 *
 * Blank şablonlarında tarix «____» ____________ 2026-cı il şəklində BOŞ
 * qalırdı — yəni yüzlərlə vərəqdə doldurulmamış forma görünürdü. Tarix
 * sənədin öz məlumatıdır və sənəd onu daşımalıdır.
 *
 * TARİX TÖRƏDİLİR, ƏL İLƏ YAZILMIR. İşdə 44 vərəq var; hər birinə ayrıca
 * tarix yazmaq həm mümkün deyil, həm də ilk redaktədə sürüşərdi. Əvəzinə
 * işin BAŞLANMA tarixindən və vərəqin sırasından hesablanır: istintaq
 * günlərlə davam edir, sənədlər də o günlərə paylanır.
 *
 * DETERMİNİSTDİR — `rand()` yoxdur. Səhifə hər açılışda eyni tarixi
 * göstərməlidir; dəyişən tarix sənədin saxta olduğunu elan edir
 * (`Imza::yol()` ilə eyni qayda).
 */
final class Tarix
{
    /** Bir günə neçə sənəd düşür. İstintaq sürəti — nə bir gündə 44 vərəq, nə də ayda. */
    public const GUNDE = 4;

    /** Dindirilmə protokolu əsas materialın SONUNDAN neçə gün sonra. */
    public const DINDIRME_GUN = 7;

    /** Məhkəmə qərarı əsas materialın SONUNDAN neçə gün sonra — iş məhkəməyə gedir. */
    public const MEHKEME_GUN = 45;

    /** @var array<int,string> */
    public const AYLAR = [
        1 => 'yanvar', 2 => 'fevral', 3 => 'mart', 4 => 'aprel',
        5 => 'may', 6 => 'iyun', 7 => 'iyul', 8 => 'avqust',
        9 => 'sentyabr', 10 => 'oktyabr', 11 => 'noyabr', 12 => 'dekabr',
    ];

    /**
     * Mətndən `gg.aa.iiii` tarixini çıxarır.
     *
     * Mətnin özü sərbəstdir («Başlanıb: 16.08.2026, saat 08:05») — axtarılan
     * yalnız tarix naxışıdır, ona görə üz qabığının cümləsi dəyişəndə bu
     * metod sınmır.
     *
     * @return array{0:int,1:int,2:int}|null [gün, ay, il]
     */
    public static function oxu(?string $metn): ?array
    {
        if ($metn === null || ! preg_match('/(\d{1,2})\.(\d{1,2})\.(\d{4})/', $metn, $m)) {
            return null;
        }

        [$g, $a, $i] = [(int) $m[1], (int) $m[2], (int) $m[3]];

        return checkdate($a, $g, $i) ? [$g, $a, $i] : null;
    }

    /**
     * Tarixə gün əlavə edir. `mktime` ay və il keçidini özü hesablayır —
     * «31 avqust + 5 gün» əl ilə yazılsaydı, sentyabra keçidi unudulardı.
     *
     * @param  array{0:int,1:int,2:int}  $tarix
     * @return array{0:int,1:int,2:int}
     */
    public static function artir(array $tarix, int $gun): array
    {
        [$g, $a, $i] = $tarix;
        $t = mktime(12, 0, 0, $a, $g + $gun, $i);

        return [(int) date('j', $t), (int) date('n', $t), (int) date('Y', $t)];
    }

    /**
     * Adi vərəqin tarixi — sırasına görə.
     *
     * @param  array{0:int,1:int,2:int}  $bas   işin başlanma tarixi
     * @param  int  $sira  vərəqin sırası (0-dan)
     * @return array{0:int,1:int,2:int}
     */
    public static function vereq(array $bas, int $sira): array
    {
        return self::artir($bas, self::gunler($sira));
    }

    /**
     * Sonluq vərəqinin tarixi.
     *
     * ƏSAS MATERİALIN SONUNDAN SAYILIR, işin başlanğıcından yox: ittiham
     * istintaq bitəndən sonra irəli sürülür, məhkəmə isə ondan da sonra
     * baxır. Başlanğıcdan sayılsaydı, dindirilmə protokolu son ekspertiza
     * rəyindən ƏVVƏL tarixlənərdi — qovluq özü ilə ziddiyyətə düşərdi.
     *
     * @param  array{0:int,1:int,2:int}  $bas       işin başlanma tarixi
     * @param  int  $esasSonSira  əsas materialın son vərəqinin sırası
     * @param  int  $sonlukNo     sonluq vərəqləri arasında sırası (0 = dindirilmə)
     * @return array{0:int,1:int,2:int}
     */
    public static function sonluq(array $bas, int $esasSonSira, int $sonlukNo = 0): array
    {
        $son = self::gunler($esasSonSira);

        return self::artir($bas, $son + ($sonlukNo === 0 ? self::DINDIRME_GUN : self::MEHKEME_GUN));
    }

    /** Sıradan gün sayına. */
    private static function gunler(int $sira): int
    {
        return intdiv(max(0, $sira), self::GUNDE);
    }

    /**
     * Blank şablonunun formatı: «16» avqust 2026-cı il.
     *
     * @param  array{0:int,1:int,2:int}|null  $tarix
     */
    public static function yaz(?array $tarix): string
    {
        if ($tarix === null) {
            /* Tarix bilinmirsə boş forma qalır — uydurma tarix yazmaqdansa
               doldurulmamış sətir dürüstdür. */
            return '«____» ____________ 2026-cı il';
        }

        [$g, $a, $i] = $tarix;

        return sprintf('«%02d» %s %d-cı il', $g, self::AYLAR[$a] ?? '', $i);
    }

    /** Qısa forma — sətir daxilində: 16.08.2026 */
    public static function qisa(?array $tarix): string
    {
        return $tarix === null ? '' : sprintf('%02d.%02d.%d', $tarix[0], $tarix[1], $tarix[2]);
    }
}
