<?php

declare(strict_types=1);

namespace App\Support\Dossier;

/**
 * Komponent qalereyasının nümunə məlumatı.
 *
 * Bu, MƏZMUN DEYİL — işləyici üçün nümunədir, ona görə seed qovluğunda yeri
 * yoxdur. Səhifə yalnız lokal mühitdə açılır.
 *
 * Qalereya iki işə yarayır: yeni qovluq yazanda hansı blokun mövcud olduğunu
 * göstərir, və yeni komponent əlavə edəndə əvvəlcə burada sınanır.
 */
final class Qalereya
{
    /** @return list<array{ad:string,izah:string,blok:array<string,mixed>}> */
    public static function bloklar(): array
    {
        return [
            ['ad' => 'blank', 'izah' => 'Blank başlığı — qurum sətirləri və iş nömrəsi. Boş buraxılsa qovluğun öz başlığı işlənir.',
             'blok' => ['tip' => 'blank']],

            ['ad' => 'basliq', 'izah' => 'Sənədin adı və altında kiçik izah sətri.',
             'blok' => ['tip' => 'basliq', 'ad' => 'HADİSƏ YERİNƏ BAXIŞ PROTOKOLU', 'alt' => 'miqyassız, ölçülər metrlədir']],

            ['ad' => 'sahe', 'izah' => 'Sol ad, sağ dəyər, arada nöqtəli xətt. Dəyər BOŞ QALA BİLƏR — real blankda doldurulmamış sahə olur.',
             'blok' => ['tip' => 'sahe', 'setirler' => [
                 ['Baxış başlandı', '08:20'], ['Baxış bitdi', '10:05'],
                 ['Hava', 'açıq, +29°C'], ['İştirak edib', ''],
             ]]],

            ['ad' => 'metn', 'izah' => 'Adi abzaslar. İçindəki işarələr: **qalın**, [[qırmızı]], ++əl ilə++, ~~üstündən~~, ((oxunmaz)), %%dairə%%.',
             'blok' => ['tip' => 'metn', 'abzaslar' => [
                 'Baxış zamanı **mərmər lövhə** götürülmüşdür. Sənəddə ++sonradan əlavə edilmiş++ qeyd var.',
                 'Bir sətir ~~üstündən xətt çəkilmiş~~, bir hissə isə ((kseroksda itmişdir)). Müstəntiq %%generator%% sözünü dairəyə almışdır.',
             ]]],

            ['ad' => 'metn (çərçivəli)', 'izah' => 'Eyni blok, `cerceve: true` ilə qeyd qutusuna çevrilir. Ayrıca blok növü lazım deyil.',
             'blok' => ['tip' => 'metn', 'cerceve' => true, 'abzaslar' => ['[[Müstəntiqin qeydi:]] ayaqqabı təqdim edilməyib.']]],

            ['ad' => 'cedvel', 'izah' => 'Sütun sayı SABİT DEYİL. Vurğulanmış sətirlər və yekun sətri istəyə bağlıdır.',
             'blok' => ['tip' => 'cedvel',
                 'basliqlar' => ['Bilet №', 'Vaxt', 'Marşrut', 'Məbləğ'],
                 'setirler' => [['4469', '22:06', 'Sumqayıt–Bakı', '3,20'],
                                ['4470', '22:12', 'Sumqayıt–Bakı', '3,20'],
                                ['**4471**', '**01:07**', 'Sumqayıt–Bakı', '3,20']],
                 'vurgu' => [2],
                 'yekun' => ['Cəmi', '', '', '9,60']]],

            ['ad' => 'kart', 'izah' => 'Nömrələnmiş kartoçkalar. `elyazma: true` kartı əl yazısına çevirir.',
             'blok' => ['tip' => 'kart', 'kartlar' => [
                 ['ad' => 'Boru açarı', 'metn' => 'Uzunluq 52 sm, çəki 1,9 kq. Başlıq hissəsində qonur ləkə.'],
                 ['ad' => 'Əl yazısı ilə qeyd', 'elyazma' => true, 'metn' => '«Səhər özü ilə danışacam.»'],
             ]]],

            ['ad' => 'yazisma', 'izah' => 'Kağıza çap edilmiş ekran görüntüsü. Altı mesaj növü: adi, silinmiş, sistem, səsli, şəkil, sənəd.',
             'blok' => ['tip' => 'yazisma', 'sohbet' => 'Tofiq müəllim', 'gorulme' => 'son görülmə 00:46',
                 'izah' => 'Şəkil 1 — ekran görüntüsü',
                 'gunler' => [['tarix' => '16 avqust', 'mesajlar' => [
                     ['yon' => 'cixan', 'nov' => 'metn', 'metn' => 'Arxa dəhlizdəyəm, mətbəxin yanı.', 'saat' => '00:19', 'oxunub' => true],
                     ['yon' => 'gelen', 'nov' => 'metn', 'metn' => 'Gəlirəm', 'saat' => '00:23'],
                     ['nov' => 'sistem', 'metn' => 'Nömrə dəyişdirildi'],
                     ['yon' => 'cixan', 'nov' => 'sesli', 'saniye' => 47, 'saat' => '00:31'],
                     ['yon' => 'gelen', 'nov' => 'sekil', 'izah' => 'IMG_2381', 'saat' => '00:34'],
                     ['yon' => 'cixan', 'nov' => 'sened', 'ad' => 'qebz.pdf', 'olcu' => '214 KB', 'saat' => '00:36'],
                     ['yon' => 'gelen', 'nov' => 'silinmis', 'saat' => '00:41'],
                 ]]]]],

            ['ad' => 'zeng', 'izah' => 'Vaxt, istiqamət, abunəçinin telefondakı adı və müddət.',
             'blok' => ['tip' => 'zeng', 'zengler' => [
                 ['saat' => '22:18', 'yon' => 'cixan', 'abunec' => '«Qardaş Elxan»', 'muddet' => '2 dəq 40 san'],
                 ['saat' => '00:44', 'yon' => 'cixan', 'abunec' => '«Nicat oğlum»', 'muddet' => '40 saniyə · son danışıq', 'vurgu' => true],
                 ['saat' => '02:05', 'yon' => 'gelen', 'abunec' => '«Həyat yoldaşı»', 'muddet' => 'cavabsız'],
             ]]],

            ['ad' => 'sxem', 'izah' => 'SVG bazadan gəlir. NİŞANLAR sxemin öz kodunda deyil, ayrıca məlumatdır — eyni sxem fərqli mərhələlərdə fərqli nişanlarla göstərilə bilsin deyə.',
             'blok' => ['tip' => 'sxem',
                 'svg' => '<svg viewBox="0 0 300 200"><g stroke="#26221D" fill="none" stroke-width="1.6">'
                     . '<rect x="20" y="20" width="150" height="110"/><rect x="170" y="20" width="70" height="110"/></g>'
                     . '<g fill="#26221D" font-size="10.5"><text x="28" y="40">SALON</text><text x="178" y="40">DƏHLİZ</text></g></svg>',
                 'nisanlar' => [
                     ['nov' => 'noqte', 'no' => 1, 'x' => 205, 'y' => 92, 'izah' => 'meyitin vəziyyəti'],
                     ['nov' => 'noqte', 'no' => 2, 'x' => 205, 'y' => 112, 'izah' => 'mərmər lövhə'],
                     ['nov' => 'olcu', 'x1' => 20, 'y1' => 148, 'x2' => 170, 'y2' => 148, 'metn' => '9 m'],
                     ['nov' => 'ox', 'x1' => 60, 'y1' => 40, 'x2' => 196, 'y2' => 84, 'metn' => 'çıxış, 23:51'],
                     ['nov' => 'shimal', 'x' => 270, 'y' => 40, 'bucaq' => 0],
                 ]]],

            ['ad' => 'foto', 'izah' => 'Şəkil kartoçkası. Fayl yoxdursa boş çərçivə render olunur — sxem hazırdır, foto sonra gələ bilər.',
             'blok' => ['tip' => 'foto', 'sekil' => null, 'no' => 1, 'nisbet' => '4:3',
                 'izah' => 'mərmər lövhə, götürüldüyü yerdə, miqyas xətkeşi ilə']],

            ['ad' => 'elave', 'izah' => 'Ataçla bərkidilmiş kiçik sənəd: kassa çeki, aptek qəbzi, bilet, kiçik qeyd.',
             'blok' => ['tip' => 'elave', 'nov' => 'qebz', 'bucaq' => -2.5, 'yer' => 'sag',
                 'setirler' => ['«ŞİMAL» PARKI', 'KASSA № 1', '', 'BİLET № 4471', '14.09.2026  01:07', '', '3,20 AZN']]],

            ['ad' => 'imza', 'izah' => 'Solda vəzifə və imza, sağda tarix.',
             'blok' => ['tip' => 'imza', 'vezife' => 'Baxışı aparan, AFİB müstəntiqi',
                 'ad' => 'N.Abbasov', 'tarix' => '16.08.2026']],
        ];
    }

    /** Əlyazmanın dörd xarakteri. @return list<array{ad:string,blok:array<string,mixed>}> */
    public static function elyazma(): array
    {
        $m = 'yoxlanılsın · üzləşdirmə lazımdır · 00:32-də işıq getdi';

        return array_map(
            fn (string $x) => ['ad' => $x, 'blok' => ['tip' => 'elyazma', 'xarakter' => $x, 'metn' => $m]],
            BlokSxemi::XARAKTERLER
        );
    }

    /** Kənar qeydinin dörd növü. @return list<array<string,mixed>> */
    public static function kenar(): array
    {
        return array_map(fn (string $n) => [
            'tip' => 'metn',
            'abzaslar' => ['Kənar qeydi blok deyil — istənilən blokun qəbul etdiyi nişandır.'],
            'kenar' => ['metn' => 'növ: ' . $n, 'nov' => $n, 'yer' => 'sag'],
        ], BlokSxemi::KENAR_NOV);
    }

    /** Fiziki effektlər — tək-tək və birlikdə. @return list<array{ad:string,kagiz:array<string,mixed>}> */
    public static function kagiz(): array
    {
        return [
            ['ad' => 'köhnəlmə 1–3', 'kagiz' => ['kohnelme' => 2]],
            ['ad' => 'qatlanma', 'kagiz' => ['qat' => [0.34, 0.67]]],
            ['ad' => 'ləkə — qəhvə', 'kagiz' => ['leke' => [['nov' => 'qehve', 'x' => 72, 'y' => 30, 'olcu' => 30]]]],
            ['ad' => 'ləkə — yağ', 'kagiz' => ['leke' => [['nov' => 'yag', 'x' => 30, 'y' => 62, 'olcu' => 24]]]],
            ['ad' => 'ləkə — su', 'kagiz' => ['leke' => [['nov' => 'su', 'x' => 52, 'y' => 45, 'olcu' => 40]]]],
            ['ad' => 'cırılma — sağ', 'kagiz' => ['cirilma' => 'sag']],
            ['ad' => 'kseroks 2', 'kagiz' => ['kseroks' => 2]],
            ['ad' => 'əyilmə −1.2°', 'kagiz' => ['egilme' => -1.2]],
            ['ad' => 'barmaq izi', 'kagiz' => ['barmaq' => [['x' => 78, 'y' => 82]]]],
            ['ad' => 'ataç izi', 'kagiz' => ['atac' => 'sol-ust']],
            ['ad' => 'ÜÇ AĞIR EFFEKT — yuxarı hədd', 'kagiz' => [
                'kohnelme' => 2, 'qat' => [0.4], 'leke' => [['nov' => 'qehve', 'x' => 70, 'y' => 24, 'olcu' => 26]],
                'cirilma' => 'sag', 'egilme' => -0.8]],
        ];
    }

    /** Möhürün bütün forma və rəngləri. @return list<array<string,mixed>> */
    public static function mohurler(): array
    {
        $out = [];

        foreach (BlokSxemi::MOHUR_FORMA as $f) {
            foreach (BlokSxemi::MOHUR_RENG as $r) {
                $out[] = ['metn' => [Byuro::QISA, strtoupper($r)], 'forma' => $f, 'reng' => $r,
                          'bucaq' => -11, 'seffaflik' => 0.55, 'x' => 50, 'y' => 50, 'olcu' => 118];
            }
        }

        return $out;
    }
}
