<?php

declare(strict_types=1);

namespace App\Support\Dossier;

/**
 * XP DÜSTURU — yeganə həyata keçirmə.
 *
 * Kontrollerlər, görünüşlər və `RankService` bunu TƏKRARLAMIR: xal
 * hesablanması bir yerdə olmasa, düstur dəyişəndə iki nəticə arasında fərq
 * yaranar və oyunçu hansının doğru olduğunu bilməz.
 *
 * Sinif ÇƏRÇİVƏSİZDİR (`config()` çağırmır, parametr kimi alır) — belədə
 * `tests/logic.php` onu birbaşa `require` edib sınaya bilir; `BlokSxemi` və
 * `Rey` ilə eyni intizam.
 *
 * BONUSLAR TOPLANIR, VURULMUR. «Əlavə 50 faiz» və «əlavə 30 faiz» bazanın
 * üzərinə əlavə olunur:
 *
 *     carpan = 1 + dogru_sonluq + ilk_cehd
 *     xp     = max(0, round(baza × carpan) + kodlar − sehv_ceza × səhv)
 *
 * Faizlər ƏVVƏL, sabitlər SONRA tətbiq olunur: kod bonusu çətinlikdən asılı
 * olmayan sabit mükafatdır (kilidi açmaq hər işdə eyni işdir), cəza isə
 * sabitdir ki, asan işdə səhv etmək ucuz olmasın.
 *
 * NƏTİCƏ HEÇ VAXT MƏNFİ OLMUR. Bir işdən qazanılan xal sıfırda döşənir —
 * səhv edən oyunçu əvvəlki işlərində qazandığını itirməməlidir.
 */
final class Xp
{
    /** Düsturun parametrləri olmadıqda işlənən dəyərlər (`config('dossier.xp')` ilə eyni). */
    public const VARSAYILAN = [
        'baza'         => ['asan' => 20, 'orta' => 40, 'cetin' => 70, 'kabus' => 120],
        'dogru_sonluq' => 0.5,
        'ilk_cehd'     => 0.3,
        'kodlar'       => 20,
        'sehv_ceza'    => 10,
    ];

    /** Naməlum çətinlik buraya düşür — seed pozulsa da hesablama dayanmır. */
    public const EHTIYAT_CETINLIK = 'orta';

    /**
     * @param  string  $cetinlik  asan · orta · cetin · kabus
     * @param  bool    $dogru     doğru sonluğa çatıb (sual rejimində: bağlayıb)
     * @param  bool    $ilk       birinci cəhddən bağlayıb
     * @param  bool    $kodlar    bütün kilidli vərəqləri açıb
     * @param  int     $sehv      səhv ittihamların sayı
     * @param  array<string,mixed>  $cfg  `config('dossier.xp')`
     */
    public static function hesabla(
        string $cetinlik,
        bool $dogru,
        bool $ilk,
        bool $kodlar,
        int $sehv,
        array $cfg = []
    ): int {
        $cfg  = $cfg === [] ? self::VARSAYILAN : $cfg;
        $baza = (array) ($cfg['baza'] ?? self::VARSAYILAN['baza']);

        $xal = (int) ($baza[$cetinlik] ?? $baza[self::EHTIYAT_CETINLIK] ?? 40);

        $carpan = 1.0;

        if ($dogru) {
            $carpan += (float) ($cfg['dogru_sonluq'] ?? self::VARSAYILAN['dogru_sonluq']);
        }

        /* İLK CƏHD BONUSU səhv ittiham olmadıqda verilir. İki şərtin birləşməsi
           qəsdəndir: «birinci cəhddən, yanlış şübhəli göstərmədən» bir bacarıq
           göstəricisidir, iki ayrı mükafat deyil. */
        if ($ilk && $sehv === 0) {
            $carpan += (float) ($cfg['ilk_cehd'] ?? self::VARSAYILAN['ilk_cehd']);
        }

        $xal = (int) round($xal * $carpan);

        if ($kodlar) {
            $xal += (int) ($cfg['kodlar'] ?? self::VARSAYILAN['kodlar']);
        }

        $xal -= (int) ($cfg['sehv_ceza'] ?? self::VARSAYILAN['sehv_ceza']) * max(0, $sehv);

        return max(0, $xal);
    }

    /** Bir işdən çıxa biləcək ən yüksək xal — profil ekranındakı «tavan» sətri. */
    public static function tavan(string $cetinlik, array $cfg = []): int
    {
        return self::hesabla($cetinlik, true, true, true, 0, $cfg);
    }
}
