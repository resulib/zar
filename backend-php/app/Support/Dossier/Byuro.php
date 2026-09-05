<?php

declare(strict_types=1);

namespace App\Support\Dossier;

/**
 * AFİB — bölmənin uydurma istintaq bürosu.
 *
 * Bu bölmənin bütün dəyəri rəsmi sənədin vizual dilini inandırıcı təqlid
 * etməsindədir. Təqlid nə qədər yaxşıdırsa, ekran görüntüsünün kontekstdən
 * qopub REAL sənəd kimi yayılma riski o qədər böyükdür. Ona görə fiktivlik
 * artefaktın ÖZ ÜZƏRİNDƏ oxunmalıdır — ətrafındakı saytda yox.
 *
 * Sabitlər bilərəkdən `config` deyil: config `.env`-dən oxuya bilər və
 * gələcək idarə panelindən boşaldıla bilər. Hüquqi qeydin mətni kodu
 * redaktə etməyən adamın dəyişə biləcəyi yerdə durmamalıdır.
 * `config/dossier.php` bu sinfə İSTİNAD edir, yəni mənbə yenə təkdir.
 *
 * Qeyd: AFİB dünyadaxili qurumdur, MƏHSULUN BRENDİ DEYİL. Məhsulun adı
 * hələ seçilməyib və `config('dossier.brand')`-dədir; ikisi qarışdırılmır.
 */
final class Byuro
{
    public const AD = 'AZƏRBAYCAN FİKTİV İSTİNTAQ BÜROSU';
    public const QISA = 'AFİB';
    public const BOLME = 'İSTİNTAQ BÖLMƏSİ';
    /**
     * Hökmü çıxaran uydurma orqan.
     *
     * İşin sonluğunda məhkəmə qərarı var və onu büro çıxara bilməz — istintaq
     * ittiham irəli sürür, cəzanı isə məhkəmə verir. Ad SİNİF SABİTİDİR,
     * config deyil: hüquqi qalxanın mətni idarə panelindən dəyişdirilə
     * bilməməlidir.
     *
     * «Azərbaycan Respublikası» ifadəsi BURADA OLA BİLMƏZ — `org_ban`
     * siyahısındadır. «Fiktiv» sözü isə adın içindədir, yəni ekranda
     * göründüyü hər yerdə uydurma olduğunu özü deyir.
     */
    public const MEHKEME = 'AFİB FİKTİV MƏHKƏMƏ KOLLEGİYASI';

    public const ARXIV = 'OYUN MATERİALLARI ARXİVİ';

    /** Hər render olunan sənədin üzərindəki məcburi qeyd. Mətn hərfidir. */
    public const QEYD = 'FİKTİV OYUN SƏNƏDİ — yalnız əyləncə məqsədi ilə hazırlanmışdır. '
        . 'Real hüquqi və ya rəsmi sənəd deyil.';

    /** Qısa forma — şəkillərdə və dar yerlərdə. */
    public const QEYD_QISA = 'FİKTİV OYUN SƏNƏDİ · REAL RƏSMİ SƏNƏD DEYİL';

    /** Üz qabığının dairəvi möhürü. «FİKTİV» sözü məcburidir. */
    public const MOHUR = ['AFİB', 'FİKTİV', 'OYUN', 'MATERİALI'];

    /** Sertifikat və kataloq kartının üst sətri. */
    public const BASLIQ = 'AFİB · OYUN NƏTİCƏSİ';

    /** Üz qabığının üç qurum sətri. */
    public static function qurumSetirleri(): array
    {
        return [self::AD, self::QISA . ' · ' . self::BOLME, self::ARXIV];
    }

    /** Vərəq başlığının iki sətri. `$no` göstərilən iş nömrəsidir. */
    public static function verqBasligi(string $no): array
    {
        return [
            self::AD . ' (' . self::QISA . ')',
            self::BOLME . ' · İŞ № ' . $no,
        ];
    }

    /** «2026-0847» → «AFİB-2026/0847». Göstərilən forma, ünvan deyil. */
    public static function isNomresi(string $slug): string
    {
        $n = Dossier::nomre($slug);

        return $n === '' ? '' : self::QISA . '-' . $n;
    }
}
