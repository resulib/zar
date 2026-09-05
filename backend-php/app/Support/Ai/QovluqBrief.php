<?php

declare(strict_types=1);

namespace App\Support\Ai;

use App\Support\Dossier\Byuro;

/**
 * İş qovluğunun AI ilə qurulması — prompt, sxem və NORMALLAŞDIRMA.
 *
 * `TemplateBrief` ilə eyni intizamda: model bir mətn generatorudur, hakim
 * deyil. Ona görə `normalize*()` metodları cavabı KƏSİR, TƏMİZLƏYİR və
 * bir sıra dəyəri ÜMUMİYYƏTLƏ SORUŞMUR — özü qurur:
 *
 *   · `cover` (qurum sətirləri, möhür, təyinat) — `Byuro` sabitlərindən;
 *   · suallar — şübhəli siyahısından və qatilin indeksindən;
 *   · vərəq nömrələri — sıradan.
 *
 * Səbəb sadədir: bunlar hüquqi qalxanın və oyun mexanikasının hissəsidir.
 * Modeldən soruşulsaydı, o, nə vaxtsa «Daxili İşlər Nazirliyi» yazacaq və ya
 * birinci sualın variantlarını şübhəli adlarının sırasından çıxaracaqdı —
 * hər ikisi səssiz sınıqdır.
 *
 * Qovluq İKİ MƏRHƏLƏDƏ qurulur, çünki 25-30 sənədi bir cavaba sığdırmaq
 * mümkün deyil: əvvəlcə skelet (hekayə + vərəqlərin planı), sonra vərəqlərin
 * mətni partiyalarla. Hər partiya ayrıca HTTP sorğusudur — brauzer gedişi
 * göstərir və heç bir sorğu vaxt aşımına düşmür.
 *
 * `App\Support` qaydası: framework yoxdur.
 */
final class QovluqBrief
{
    /** Bir partiyada neçə vərəqin mətni istənilir. */
    public const PARTIYA = 4;

    public const SENED_MIN = 6;
    public const SENED_MAX = 40;

    /**
     * Qadağan olunmuş qurum ifadələri — `config('dossier.org_ban')` güzgüsü.
     *
     * İki nüsxə QƏSDƏNDİR: config siyahısı statik məzmunu qoruyur, bu isə
     * modelin çıxışını. `TemplateBrief::ORG_BAN` ilə eyni məntiq.
     */
    public const ORG_BAN = [
        'azərbaycan respublikası', 'daxili işlər', 'nazirlik', 'nazirliyi',
        'nazirlərin kabineti', 'prokurorluq', 'polis bölməsi', 'polis idarəsi',
        'polis şöbəsi', 'dövlət gerbi', 'ədliyyə leytenantı', 'ədliyyə mayoru',
        'məhkəmə-tibb ekspertizası',
    ];

    /** Vərəqin blank növləri — `config('dossier.blank_novleri')` güzgüsü. */
    public const BLANK = ['resmi', 'qerar', 'arayis', 'protokol', 'ekspert', 'izahat', 'mehkeme'];

    /** Sənəd növləri — `config('dossier.sened_novleri')` güzgüsü. */
    public const NOV = [
        'testimony', 'expertise', 'camera', 'chat', 'log',
        'receipt', 'plan', 'protocol', 'other',
    ];

    /* ----------------------------------------------------------------
     | Prompt
     |---------------------------------------------------------------- */

    public static function system(): string
    {
        $ad = Byuro::AD;
        $qisa = Byuro::QISA;
        $mehkeme = Byuro::MEHKEME;

        return <<<METN
        Sən Azərbaycan dilində detektiv iş qovluqları yazan redaktorsan.

        MƏHSUL. Oyunçu telefonda rəsmi görünüşlü sənədləri oxuyur, ziddiyyəti
        tapır və qatili adlandırır. Sənədlər quru, protokol dilində yazılır —
        bədii təsvir yox, faktura. Cümlələr qısadır.

        QURUM. Bütün sənədləri UYDURMA bir qurum verir: «{$ad}» ({$qisa}).
        Real qurum, nazirlik, prokurorluq, polis bölməsi, dövlət rütbəsi
        ADI ÇƏKİLMİR. Vəzifələr yalnız belə olur: «{$qisa} müstəntiqi»,
        «{$qisa} bölmə rəisi», «{$qisa} tibbi eksperti».
        Şəhər adları realdır (Xırdalan, Sumqayıt, Bakı) — küçə, obyekt və
        şəxs adları uydurmadır.

        DİL. Yalnız Azərbaycan dili. Emoji yoxdur. Başlıqlar böyük hərflə
        qışqırmır. Hər ad tam addır: «Mehdiyev Tofiq Zahid oğlu».

        HƏLL EDİLƏ BİLƏN OLMALIDIR. Qatili göstərən dəlil iki sənədin
        ZİDDİYYƏTİNDƏ olmalıdır: biri bir vaxtı və ya faktı yazır, digəri onu
        təkzib edir. Bu ziddiyyət açıq yazılmır — oxucu özü tapır.
        METN;
    }

    /** Skelet üçün istifadəçi mesajı. */
    public static function skeletUser(string $brief, int $say, string $cetinlik): string
    {
        return <<<METN
        Tapşırıq: {$brief}

        {$say} vərəqlik bir iş qovluğu qur. Çətinlik: {$cetinlik}.

        Vərəqlərin planını ver — hər vərəq üçün ad, sənəd növü, blank növü və
        BİR CÜMLƏLİK məzmun tapşırığı (`brief`). Plan hekayəni açsın:
        əvvəldə qərar və hadisə yeri protokolu, ortada ifadələr, ekspertizalar,
        kamera və texniki arayışlar, sonda yekun sənədlər.

        İki vərəq bir-birini TƏKZİB ETSİN — həlli sübut edən ziddiyyət odur.

        `culprit` qatilin TAM ADIDIR və şübhəlilər siyahısındakı adlardan biri
        ilə HƏRFİ-HƏRFİNƏ eyni olmalıdır. `motive` və `proof` mətnləri məhz
        HƏMİN şəxsdən danışmalıdır — başqa şübhəlinin adını çəkməsi qovluğu
        ziddiyyətli edir.

        Bir vərəqi kodla bağla: dörd rəqəmli kod, və kodun rəqəmləri BAŞQA
        vərəqlərin mətnində gizlənsin. `lock.sources` həmin vərəqlərin sıra
        nömrələridir (1-dən).

        Dörd şübhəli ver. Hər birinin alibi zolağı `bars` faizlə göstərilir və
        `axis`-dəki üç saatın arasındakı pəncərəyə aiddir.
        METN;
    }

    /**
     * Bir partiya vərəq üçün istifadəçi mesajı.
     *
     * @param array<string,mixed> $skelet
     * @param list<array<string,mixed>> $plan
     */
    public static function senedUser(array $skelet, array $plan): string
    {
        $mehkeme = Byuro::MEHKEME;

        $hekaye = json_encode([
            'title'      => $skelet['title'] ?? '',
            'place'      => $skelet['place'] ?? '',
            'period'     => $skelet['period'] ?? '',
            'suspects'   => $skelet['suspects'] ?? [],
            'chronology' => $skelet['chronology'] ?? [],
            'solution'   => $skelet['solution'] ?? [],
        ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

        $siyahi = '';

        foreach ($plan as $p) {
            $siyahi .= sprintf(
                "  #%d · «%s» (%s, blank: %s)\n     tapşırıq: %s\n",
                (int) ($p['no'] ?? 0),
                (string) ($p['name'] ?? ''),
                (string) ($p['kind'] ?? ''),
                (string) ($p['blank_nov'] ?? 'resmi'),
                (string) ($p['brief'] ?? ''),
            );

            /* KİLİD RƏQƏMİ. Kod tapılası olmalıdır: rəqəm mətnə dairəyə
               alınmış formada yerləşdirilir (`%%N%%`), yəni oxucu onu görür,
               amma nə üçün olduğunu bilmir. Bu göstəriş olmadan model
               rəqəmləri heç yerə qoymur və kilid həll edilə bilməz olur. */
            if (isset($p['kilid_reqemi'])) {
                $siyahi .= sprintf(
                    "     BU VƏRƏQDƏ «%%%%%s%%%%» rəqəmi görünsün — nömrə, ölçü və ya\n"
                    . "     seriya kimi, dairəyə alınmış halda. Nə üçün olduğu yazılmır.\n",
                    (string) $p['kilid_reqemi'],
                );
            }
        }

        return <<<METN
        İşin skeleti:
        {$hekaye}

        Aşağıdakı vərəqlərin MƏTNİNİ yaz. Hər biri üçün `no` (verilmiş nömrə),
        `meta_line` (bir quru sətir: sənəd nömrəsi, tarix, saat) və `body`.

        {$siyahi}
        VƏRƏQİN QURULUŞU. Hər vərəq eyni görünməməlidir — sənədin növünə görə
        ƏLAVƏ SAHƏLƏRİ doldur, qalanlarını `null` burax:

        · İfadə və izahat → `body` (mətn) + `sahe` + `imza`. `sahe` yalnız
          BURADA işlənir: «Kimdən» (ifadəni verən şəxsin tam adı),
          «Vəzifə» (onun işi, müstəntiqin yox), «Alınma vaxtı».
        · Qərar, protokol, ekspertiza rəyi, arayış → `body` + `imza`.
          `sahe` YAZILMIR — bu sənədlərdə rekvizit sətri olmur.
        · Yazışma (WhatsApp, mesaj) → `yazisma`: söhbətin adı və mesajlar
          siyahısı. `body` yalnız bir-iki cümlə giriş olsun. `yon` = «cixan»
          telefonun sahibindən gedən, «gelen» ona gələn mesajdır.
        · Zəng detallaşdırması → `zeng`: saat, istiqamət, abunəçi, müddət.
        · Jurnal, qəbz, iz cədvəli, növbə cədvəli → `cedvel`: başlıqlar və
          sətirlər. Hər sətrin xana sayı başlıqların sayına bərabər olsun.
        · Maddi sübutların siyahısı → `kart`: hər əşyanın adı və təsviri.
        · Hadisə yeri baxışı, kamera çıxarışı → `foto`: bir-iki kadrın izahı
          (şəkil sonra əlavə olunacaq, indi yalnız izah lazımdır).

        İŞİN SONLUĞU. İki vərəq oyunçuya YALNIZ iş bağlandıqdan sonra göstərilir
        və tapşırığında bu yazılır:
        · Dindirilmə protokolu — qatilin etirafı. `body` SUAL-CAVAB formasındadır:
          hər sual «**Sual:** …», hər cavab «**Cavab:** …» sətri ilə başlayır.
          Qatil cinayəti necə hazırladığını, necə işlətdiyini və sonra nə
          etdiyini danışır. Peşmanlıq və ya soyuqqanlılıq — hekayənin tonuna
          uyğun. `sahe` doldurulur, `imza` müstəntiqindir.
        · Məhkəmə qərarı — «{$mehkeme}» adından çıxarılır.
          Təqsirli bilinir, AZADLIQDAN MƏHRUMETMƏ MÜDDƏTİ İLLƏRLƏ yazılır
          (məsələn «11 (on bir) il»). Cəza əməlin ağırlığına uyğun olsun.
          `imza` sədrindir: vəzifə «AFİB fiktiv məhkəmə sədri».

        İMZA. Rəsmi sənədlərin hamısı imzalanır: `imza.vezife` yalnız
        «AFİB müstəntiqi», «AFİB bölmə rəisi» və ya «AFİB tibbi eksperti»
        ola bilər; `imza.ad` isə «A.Soyadov» formasındadır. Yazışma və zəng
        çıxarışı imzalanmır — onlar texniki əlavələrdir.

        MƏTN QAYDALARI (`body` üçün):
        · Boş sətir abzası bölür.
        · Vacib faktı **iki ulduzla** qalın et.
        · Müstəntiqin qeydini [[iki kvadrat mötərizə]] içinə al.
        · Sonradan əl ilə yazılmış sözü ++iki plyus++ arasına al.
        · Pozulmuş sözü ~~iki tilda~~ arasına al.
        · Kseroksda itmiş hissəni ((iki mötərizə)) arasına al.
        · Dairəyə alınmış rəqəmi %%iki faiz%% arasına al.
        · Başqa heç bir işarə, markdown başlığı və ya siyahı nişanı işlətmə.
        · Mətn vərəqi 60–200 söz; struktur sahəsi olan vərəqdə daha qısa.
        METN;
    }

    /* ----------------------------------------------------------------
     | Sxemlər
     |---------------------------------------------------------------- */

    /** @return array<string,mixed> */
    public static function skeletSchema(int $say): array
    {
        return [
            'name'   => 'is_qovlugu_skeleti',
            'strict' => true,
            'schema' => [
                'type'                 => 'object',
                'additionalProperties' => false,
                'required' => [
                    'title', 'place', 'period', 'blurb', 'intro', 'suspects', 'culprit',
                    'motive', 'motive_wrong', 'proof', 'proof_wrong',
                    'chronology', 'axis', 'solution', 'documents', 'lock',
                ],
                'properties' => [
                    'title'  => ['type' => 'string'],
                    'place'  => ['type' => 'string'],
                    'period' => ['type' => 'string'],
                    'blurb'  => ['type' => 'string'],
                    'intro'  => ['type' => 'string'],
                    'suspects' => [
                        'type' => 'array', 'minItems' => 4, 'maxItems' => 4,
                        'items' => [
                            'type' => 'object', 'additionalProperties' => false,
                            'required' => ['init', 'name', 'role', 'bio', 'camera', 'bars'],
                            'properties' => [
                                'init'   => ['type' => 'string'],
                                'name'   => ['type' => 'string'],
                                'role'   => ['type' => 'string'],
                                'bio'    => ['type' => 'string'],
                                'camera' => ['type' => 'string'],
                                'bars'   => [
                                    'type' => 'array', 'minItems' => 1, 'maxItems' => 3,
                                    'items' => [
                                        'type' => 'array', 'minItems' => 2, 'maxItems' => 2,
                                        'items' => ['type' => 'integer'],
                                    ],
                                ],
                            ],
                        ],
                    ],
                    /* İNDEKS DEYİL, AD. Model `culprit: 3` yazıb motivdə
                       başqa şəxsi adlandıra bilər — iki dəyər arasında heç bir
                       bağ yoxdur və uyğunsuzluq səssiz qalır. Ad isə mətnlə
                       birbaşa tutuşdurula bilir. */
                    'culprit'      => ['type' => 'string'],
                    'motive'       => ['type' => 'string'],
                    'motive_wrong' => ['type' => 'array', 'minItems' => 3, 'maxItems' => 3, 'items' => ['type' => 'string']],
                    'proof'        => ['type' => 'string'],
                    'proof_wrong'  => ['type' => 'array', 'minItems' => 3, 'maxItems' => 3, 'items' => ['type' => 'string']],
                    'chronology'   => [
                        'type' => 'array', 'minItems' => 6, 'maxItems' => 16,
                        'items' => [
                            'type' => 'array', 'minItems' => 2, 'maxItems' => 2,
                            'items' => ['type' => 'string'],
                        ],
                    ],
                    'axis'     => ['type' => 'array', 'minItems' => 3, 'maxItems' => 3, 'items' => ['type' => 'string']],
                    'solution' => ['type' => 'array', 'minItems' => 3, 'maxItems' => 6, 'items' => ['type' => 'string']],
                    'documents' => [
                        'type' => 'array', 'minItems' => $say, 'maxItems' => $say,
                        'items' => [
                            'type' => 'object', 'additionalProperties' => false,
                            'required' => ['name', 'kind', 'doc_type', 'blank_nov', 'brief'],
                            'properties' => [
                                'name'      => ['type' => 'string'],
                                'kind'      => ['type' => 'string'],
                                'doc_type'  => ['type' => 'string', 'enum' => self::NOV],
                                'blank_nov' => ['type' => 'string', 'enum' => self::BLANK],
                                'brief'     => ['type' => 'string'],
                            ],
                        ],
                    ],
                    'lock' => [
                        'type' => 'object', 'additionalProperties' => false,
                        'required' => ['code', 'hint', 'doc', 'sources'],
                        'properties' => [
                            'code'    => ['type' => 'string'],
                            'hint'    => ['type' => 'string'],
                            'doc'     => ['type' => 'integer'],
                            'sources' => ['type' => 'array', 'minItems' => 1, 'maxItems' => 4, 'items' => ['type' => 'integer']],
                        ],
                    ],
                ],
            ],
        ];
    }

    /**
     * Vərəq partiyasının sxemi.
     *
     * Model YALNIZ MƏLUMAT verir — blokları biz qururuq (`bloklar()`).
     * Ona blok JSON-u yazdırmaq on üç növün açar cədvəlini əzbərlətmək
     * deməkdir və o, gec-tez `BlokSxemi`-nin rədd edəcəyi bir şey qaytarardı.
     * Burada isə hər sahə sadə siyahıdır: cədvəl xanaları, mesajlar, zənglər.
     *
     * Boş sahələr `null` ilə gəlir: OpenAI-nin strict rejimi hər açarı
     * `required` tələb edir, ona görə «yoxdur» yalnız növ kimi ifadə oluna
     * bilər.
     *
     * @return array<string,mixed>
     */
    public static function senedSchema(): array
    {
        $metn = ['type' => 'string'];
        $siyahi = ['type' => 'array', 'items' => $metn];

        return [
            'name'   => 'is_qovlugu_senedleri',
            'strict' => true,
            'schema' => [
                'type'                 => 'object',
                'additionalProperties' => false,
                'required'             => ['documents'],
                'properties' => [
                    'documents' => [
                        'type' => 'array', 'minItems' => 1, 'maxItems' => self::PARTIYA,
                        'items' => [
                            'type' => 'object', 'additionalProperties' => false,
                            'required' => ['no', 'meta_line', 'body', 'sahe', 'cedvel', 'yazisma', 'zeng', 'kart', 'foto', 'imza'],
                            'properties' => [
                                'no'        => ['type' => 'integer'],
                                'meta_line' => $metn,
                                'body'      => $metn,

                                /* Sahə sətirləri: «Kimdən … Vəzifə … Alınma vaxtı». */
                                'sahe' => ['type' => ['array', 'null'], 'items' => [
                                    'type' => 'object', 'additionalProperties' => false,
                                    'required' => ['ad', 'deyer'],
                                    'properties' => ['ad' => $metn, 'deyer' => $metn],
                                ]],

                                'cedvel' => ['type' => ['object', 'null'], 'additionalProperties' => false,
                                    'required' => ['basliqlar', 'setirler'],
                                    'properties' => [
                                        'basliqlar' => $siyahi,
                                        'setirler'  => ['type' => 'array', 'items' => $siyahi],
                                    ],
                                ],

                                'yazisma' => ['type' => ['object', 'null'], 'additionalProperties' => false,
                                    'required' => ['sohbet', 'gorulme', 'mesajlar'],
                                    'properties' => [
                                        'sohbet'  => $metn,
                                        'gorulme' => $metn,
                                        'mesajlar' => ['type' => 'array', 'items' => [
                                            'type' => 'object', 'additionalProperties' => false,
                                            'required' => ['saat', 'yon', 'metn'],
                                            'properties' => [
                                                'saat' => $metn,
                                                'yon'  => ['type' => 'string', 'enum' => ['cixan', 'gelen']],
                                                'metn' => $metn,
                                            ],
                                        ]],
                                    ],
                                ],

                                'zeng' => ['type' => ['array', 'null'], 'items' => [
                                    'type' => 'object', 'additionalProperties' => false,
                                    'required' => ['saat', 'yon', 'abunec', 'muddet'],
                                    'properties' => [
                                        'saat'    => $metn,
                                        'yon'     => ['type' => 'string', 'enum' => ['cixan', 'gelen']],
                                        'abunec'  => $metn,
                                        'muddet'  => $metn,
                                    ],
                                ]],

                                'kart' => ['type' => ['array', 'null'], 'items' => [
                                    'type' => 'object', 'additionalProperties' => false,
                                    'required' => ['ad', 'metn'],
                                    'properties' => ['ad' => $metn, 'metn' => $metn],
                                ]],

                                'foto' => ['type' => ['array', 'null'], 'items' => [
                                    'type' => 'object', 'additionalProperties' => false,
                                    'required' => ['izah'],
                                    'properties' => ['izah' => $metn],
                                ]],

                                'imza' => ['type' => ['object', 'null'], 'additionalProperties' => false,
                                    'required' => ['vezife', 'ad'],
                                    'properties' => ['vezife' => $metn, 'ad' => $metn],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ];
    }

    /* ----------------------------------------------------------------
     | Normallaşdırma — modelə ETİBAR EDİLMİR
     |---------------------------------------------------------------- */

    /**
     * @param array<string,mixed> $raw
     * @return array{skelet: array<string,mixed>, problems: list<string>}
     */
    public static function normalizeSkelet(array $raw, int $say): array
    {
        $problem = [];

        $subheli = [];

        foreach (array_slice((array) ($raw['suspects'] ?? []), 0, 4) as $s) {
            $subheli[] = [
                'init'   => self::qisa(self::metn($s['init'] ?? ''), 4),
                'name'   => self::qisa(self::metn($s['name'] ?? ''), 80),
                'role'   => self::qisa(self::metn($s['role'] ?? ''), 120),
                'bio'    => self::qisa(self::metn($s['bio'] ?? ''), 600),
                'camera' => self::qisa(self::metn($s['camera'] ?? ''), 200),
                'bars'   => self::zolaqlar($s['bars'] ?? []),
            ];
        }

        if (count($subheli) !== 4) {
            $problem[] = 'Model dörd şübhəli qaytarmadı — əskik olanları əl ilə əlavə edin.';
        }

        /* Qatil ADA görə tapılır. Tapılmasa birinci şübhəli götürülür və
           idarəçiyə deyilir — heç kim işarələnməsəydi, səbəb görünməzdi. */
        $qatilAd = self::metn($raw['culprit'] ?? '');
        $qatil = self::qatilIndeksi($qatilAd, $subheli);

        if ($qatil === null) {
            $problem[] = 'Qatilin adı («' . $qatilAd . '») şübhəlilər siyahısında yoxdur — birinci şübhəli işarələndi.';
            $qatil = 0;
        }

        /* Motiv və sübut mətnləri BAŞQA şübhəlini adlandırırsa, qovluq öz-özü
           ilə ziddiyyətlidir: birinci sual bir adı, ikinci sual başqasını
           göstərir. Səssizcə düzəltmək olmaz — mətni idarəçi oxumalıdır. */
        $problem = array_merge($problem, self::qatilZiddiyyeti($raw, $subheli, $qatil));

        $senedler = [];
        $i = 0;

        foreach (array_slice((array) ($raw['documents'] ?? []), 0, $say) as $d) {
            $i++;

            $senedler[] = [
                'no'        => $i,
                /* Vərəq nömrəsi SIRADAN qurulur, modeldən soruşulmur:
                   o, nömrələri təkrarlaya və ya boşluq buraxa bilər. */
                'page'      => (string) $i,
                'name'      => self::qisa(self::metn($d['name'] ?? ''), 160),
                'kind'      => self::qisa(self::metn($d['kind'] ?? ''), 40),
                'doc_type'  => in_array($d['doc_type'] ?? '', self::NOV, true) ? (string) $d['doc_type'] : 'other',
                'blank_nov' => in_array($d['blank_nov'] ?? '', self::BLANK, true) ? (string) $d['blank_nov'] : 'resmi',
                'brief'     => self::qisa(self::metn($d['brief'] ?? ''), 400),
            ];
        }

        if (count($senedler) < $say) {
            $problem[] = 'Model ' . count($senedler) . ' vərəq qaytardı, ' . $say . ' istənilmişdi.';
        }

        /* Kilid: kod dörd rəqəm olmalıdır və hədəf vərəq mövcud olmalıdır. */
        $kilid = null;
        $k = (array) ($raw['lock'] ?? []);
        $kod = preg_replace('/\D+/', '', (string) ($k['code'] ?? '')) ?? '';

        if (strlen($kod) === 4 && $senedler !== []) {
            $hedef = (int) ($k['doc'] ?? 0);
            $hedef = isset($senedler[$hedef - 1]) ? $hedef : count($senedler);

            $menbe = [];

            foreach ((array) ($k['sources'] ?? []) as $m) {
                $m = (int) $m;

                if ($m !== $hedef && isset($senedler[$m - 1])) {
                    $menbe[] = $m;
                }
            }

            $kilid = [
                'code'    => $kod,
                'hint'    => self::qisa(self::metn($k['hint'] ?? ''), 300),
                'doc'     => $hedef,
                'sources' => array_values(array_unique($menbe)),
            ];
        } else {
            $problem[] = 'Kilid kodu qurulmadı — vərəqlərdən birini əl ilə kodla bağlaya bilərsiniz.';
        }

        $skelet = [
            'title'      => self::qisa(self::metn($raw['title'] ?? ''), 120),
            'place'      => self::qisa(self::metn($raw['place'] ?? ''), 120),
            'period'     => self::qisa(self::metn($raw['period'] ?? ''), 60),
            'blurb'      => self::qisa(self::metn($raw['blurb'] ?? ''), 400),
            'intro'      => self::qisa(self::metn($raw['intro'] ?? ''), 900),
            'suspects'   => $subheli,
            'culprit'    => $qatil,
            'chronology' => self::cutler($raw['chronology'] ?? []),
            'axis'       => self::sətirlər($raw['axis'] ?? [], 3, 12),
            'solution'   => self::sətirlər($raw['solution'] ?? [], 6, 1200),
            'questions'  => self::suallar($raw, $subheli, $qatil),
            'documents'  => $senedler,
            'lock'       => $kilid,
        ];

        $problem = array_merge($problem, self::qurumProblemi($skelet));

        return ['skelet' => $skelet, 'problems' => $problem];
    }

    /**
     * Bir partiya vərəq — xam məlumat, hələ blok deyil.
     *
     * @param array<string,mixed> $raw
     * @return array<int,array<string,mixed>>  vərəq nömrəsi → məlumat
     */
    public static function normalizeSenedler(array $raw): array
    {
        $out = [];

        foreach ((array) ($raw['documents'] ?? []) as $d) {
            $no = (int) ($d['no'] ?? 0);

            if ($no <= 0) {
                continue;
            }

            $out[$no] = [
                'meta_line' => self::qisa(self::metn($d['meta_line'] ?? ''), 200),
                'body'      => self::govde((string) ($d['body'] ?? '')),
                'sahe'      => $d['sahe'] ?? null,
                'cedvel'    => $d['cedvel'] ?? null,
                'yazisma'   => $d['yazisma'] ?? null,
                'zeng'      => $d['zeng'] ?? null,
                'kart'      => $d['kart'] ?? null,
                'foto'      => $d['foto'] ?? null,
                'imza'      => $d['imza'] ?? null,
            ];
        }

        return $out;
    }

    /**
     * Vərəqin BLOKLARINI qurur — modelin verdiyi məlumatdan.
     *
     * Model blok JSON-u yazmır və yazmamalıdır: on üç növün açar cədvəli var,
     * `BlokSxemi` naməlum açarı XƏTA sayır, və model gec-tez uyduracaq bir
     * açar əlavə edəcək. Burada isə hər blok bizim əlimizlə yığılır — yəni
     * çıxış həmişə sxemə uyğundur.
     *
     * Vərəqin quruluşu real sənədin quruluşudur: blank → başlıq → rekvizit
     * sətirləri → mətn → struktur (cədvəl / yazışma / zəng / sübut / foto) →
     * imza. Fiziki qat (möhür, kağız, holoqram) da buradan gəlir, çünki onsuz
     * bütün vərəqlər eyni təmiz blank kimi görünür.
     *
     * @param array<string,mixed> $d
     * @return array<string,mixed>  `content` sütununun dəyəri
     */
    public static function bloklar(array $d, string $ad, string $blankNov, int $no, string $isNo): array
    {
        $bloklar = [];

        /* 1. Blank — sənədin növünə uyğun letterhead. */
        $bloklar[] = ['tip' => 'blank', 'nov' => in_array($blankNov, self::BLANK, true) ? $blankNov : 'resmi'];

        /* 2. Başlıq. Meta sətri altda kiçik yazı olur. */
        $basliq = ['tip' => 'basliq', 'ad' => self::qisa(self::metn($ad), 160)];
        $alt = self::qisa(self::metn($d['meta_line'] ?? ''), 200);

        if ($alt !== '') {
            $basliq['alt'] = $alt;
        }

        $bloklar[] = $basliq;

        /* 3. Rekvizit sətirləri — «Kimdən … Vəzifə … Alınma vaxtı». */
        $sahe = self::saheler($d['sahe'] ?? null);

        if ($sahe !== []) {
            $bloklar[] = ['tip' => 'sahe', 'setirler' => $sahe];
        }

        /* 4. Mətn. */
        $abzaslar = self::abzaslar((string) ($d['body'] ?? ''));

        if ($abzaslar !== []) {
            $bloklar[] = ['tip' => 'metn', 'abzaslar' => $abzaslar];
        }

        /* 5. Struktur — vərəqi digərlərindən ayıran hissə. */
        $bloklar = array_merge($bloklar, self::strukturBloklari($d));

        /* 6. İmza. */
        $imza = self::imza($d['imza'] ?? null);

        if ($imza !== null) {
            $bloklar[] = $imza;
        }

        return [
            'bloklar'  => $bloklar,
            'mohurler' => self::mohurler($no, $isNo, $blankNov),
            'kagiz'    => self::kagiz($no),
            /* Holoqram YALNIZ təsdiqedici sənədlərdə: folqa bahalıdır və hər
               vərəqdə olan qoruma qoruma deyil. */
            'holoqram' => in_array($blankNov, ['qerar', 'ekspert'], true),
        ];
    }

    /* ---------- blok qurucuları ---------- */

    /** @return list<array<string,mixed>> */
    protected static function strukturBloklari(array $d): array
    {
        $out = [];

        /* Cədvəl — jurnal, qəbz, iz siyahısı. Xana sayı başlıq sayına
           BƏRABƏRLƏŞDİRİLİR: `BlokSxemi` fərqi xəta sayır və model tez-tez
           bir xananı unudur. */
        $c = $d['cedvel'] ?? null;

        if (is_array($c)) {
            $basliqlar = self::sətirlər($c['basliqlar'] ?? [], 6, 40);
            $setirler = [];

            foreach (array_slice((array) ($c['setirler'] ?? []), 0, 24) as $sr) {
                $sr = self::sətirlər($sr, count($basliqlar), 120);

                while (count($sr) < count($basliqlar)) {
                    $sr[] = '—';
                }

                $setirler[] = $sr;
            }

            if ($basliqlar !== [] && $setirler !== []) {
                $out[] = ['tip' => 'cedvel', 'basliqlar' => $basliqlar, 'setirler' => $setirler];
            }
        }

        /* Yazışma — ekran görüntüsü. `gunler` quruluşu `BlokSxemi`-nindir;
           model isə düz mesaj siyahısı verir və günə bölməni biz edirik. */
        $y = $d['yazisma'] ?? null;

        if (is_array($y)) {
            $mesajlar = [];

            foreach (array_slice((array) ($y['mesajlar'] ?? []), 0, 30) as $m) {
                if (! is_array($m)) {
                    continue;
                }

                $metn = self::qisa(self::metn($m['metn'] ?? ''), 300);

                if ($metn === '') {
                    continue;
                }

                $mesajlar[] = [
                    'nov'  => 'metn',
                    'yon'  => in_array($m['yon'] ?? '', ['cixan', 'gelen'], true) ? (string) $m['yon'] : 'gelen',
                    'metn' => $metn,
                    /* Yalnız HH:MM. Model bura tez-tez tarix yazır («14 noyabr»)
                       və o, mesaj baloncuğunun altında saat kimi görünərək
                       ekran görüntüsünü yalan edir. */
                    'saat' => self::saat($m['saat'] ?? ''),
                ];
            }

            if ($mesajlar !== []) {
                $blok = [
                    'tip'    => 'yazisma',
                    'sohbet' => self::qisa(self::metn($y['sohbet'] ?? ''), 60) ?: 'Yazışma',
                    'gunler' => [['tarix' => '', 'mesajlar' => $mesajlar]],
                ];

                $gor = self::qisa(self::metn($y['gorulme'] ?? ''), 60);

                if ($gor !== '') {
                    $blok['gorulme'] = $gor;
                }

                $out[] = $blok;
            }
        }

        /* Zəng detallaşdırması. */
        $zengler = [];

        foreach (array_slice((array) ($d['zeng'] ?? []), 0, 20) as $z) {
            if (! is_array($z)) {
                continue;
            }

            $saat = self::saat($z['saat'] ?? '');
            $abunec = self::qisa(self::metn($z['abunec'] ?? ''), 60);

            if ($saat === '' || $abunec === '') {
                continue;
            }

            $zengler[] = [
                'saat'   => $saat,
                'yon'    => in_array($z['yon'] ?? '', ['cixan', 'gelen'], true) ? (string) $z['yon'] : 'gelen',
                'abunec' => $abunec,
                'muddet' => self::qisa(self::metn($z['muddet'] ?? ''), 24),
            ];
        }

        if ($zengler !== []) {
            $out[] = ['tip' => 'zeng', 'zengler' => $zengler];
        }

        /* Maddi sübutlar — hər əşyanın foto yeri ilə. */
        $kartlar = [];

        foreach (array_slice((array) ($d['kart'] ?? []), 0, 12) as $k) {
            if (! is_array($k)) {
                continue;
            }

            $kad = self::qisa(self::metn($k['ad'] ?? ''), 120);

            if ($kad === '') {
                continue;
            }

            $kartlar[] = ['ad' => $kad, 'metn' => self::qisa(self::metn($k['metn'] ?? ''), 900)];
        }

        if ($kartlar !== []) {
            $out[] = ['tip' => 'kart', 'acar' => 'subutlar', 'kartlar' => $kartlar];
        }

        /* Foto yerləri — şəkil sonra yüklənir, çərçivə isə indidən durur. */
        $i = 0;

        foreach (array_slice((array) ($d['foto'] ?? []), 0, 4) as $ft) {
            if (! is_array($ft)) {
                continue;
            }

            $izah = self::qisa(self::metn($ft['izah'] ?? ''), 200);

            if ($izah === '') {
                continue;
            }

            $out[] = ['tip' => 'foto', 'no' => ++$i, 'nisbet' => '4:3', 'izah' => $izah];
        }

        return $out;
    }

    /** @return array<string,mixed>|null */
    protected static function imza(mixed $xam): ?array
    {
        if (! is_array($xam)) {
            return null;
        }

        $vezife = self::qisa(self::metn($xam['vezife'] ?? ''), 80);

        if ($vezife === '') {
            return null;
        }

        $blok = ['tip' => 'imza', 'vezife' => $vezife];
        $ad = self::qisa(self::metn($xam['ad'] ?? ''), 60);

        if ($ad !== '') {
            $blok['ad'] = $ad;
        }

        return $blok;
    }

    /** @return list<array{0:string,1:string}> */
    protected static function saheler(mixed $xam): array
    {
        $out = [];

        foreach (array_slice((array) $xam, 0, 6) as $x) {
            if (! is_array($x)) {
                continue;
            }

            $ad = self::qisa(self::metn($x['ad'] ?? ''), 40);

            if ($ad === '') {
                continue;
            }

            $out[] = [$ad, self::qisa(self::metn($x['deyer'] ?? ''), 120)];
        }

        return $out;
    }

    /** @return list<string> */
    protected static function abzaslar(string $metn): array
    {
        $out = [];

        foreach (preg_split('/\n{2,}/u', $metn) ?: [] as $a) {
            $a = trim($a);

            if ($a !== '') {
                $out[] = self::qisa($a, 1600);
            }
        }

        return $out;
    }

    /**
     * Möhür qatı.
     *
     * Yer və bucaq vərəqin NÖMRƏSİNDƏN törəyir: `rand()` işlədilsəydi, vərəq
     * ikinci dəfə açılanda möhür yerini dəyişər və sənəd özünü saxta elan
     * edərdi — `Imza::yol()` ilə eyni qayda. Möhür imza zonasındadır, çünki
     * möhür imzanı təsdiq edir.
     *
     * @return list<array<string,mixed>>
     */
    protected static function mohurler(int $no, string $isNo, string $blankNov): array
    {
        $orta = $blankNov === 'qerar' ? 'TƏSDİQ EDİRƏM' : 'QEYDƏ ALINIB';

        return [[
            'forma'      => 'daire',
            'reng'       => $blankNov === 'qerar' ? 'mor' : 'mavi',
            'seffaflik'  => 0.5,
            'metn'       => [
                Byuro::QISA . ' · İSTİNTAQ BÖLMƏSİ',
                $orta,
                $isNo,
                'FİKTİV',
                'OYUN MATERİALI',
            ],
            'x'          => 62 + ($no * 7) % 16,
            'y'          => 78 + ($no * 5) % 6,
            'olcu'       => 148 + ($no * 11) % 20,
            'bucaq'      => -16 + ($no * 13) % 26,
        ]];
    }

    /**
     * Fiziki qat — köhnəlmə və qat izi.
     *
     * Ağır effektlər (`leke`, `cirilma`, `kseroks`) İŞLƏDİLMİR: onların
     * yerini məzmun müəllifi seçməlidir, yoxsa hər vərəq eyni ləkə ilə çıxır
     * və effekt təsadüfi deyil, şablon kimi oxunur.
     *
     * @return array<string,mixed>
     */
    protected static function kagiz(int $no): array
    {
        $out = ['kohnelme' => 1 + $no % 2];

        if ($no % 3 === 0) {
            $out['qat'] = [0.34 + ($no % 4) * 0.08];
        }

        if ($no % 5 === 0) {
            $out['atac'] = ['sol-ust', 'sag-ust', 'sol-alt'][$no % 3];
        }

        return $out;
    }
    /**
     * Vərəqin mətni.
     *
     * Modelin sevdiyi iki şey atılır: markdown başlıqları (`##`) və siyahı
     * nişanları (`- `, `* `). Vərəq protokoldur, blog yazısı deyil; həm də
     * `Metn::inline()` onları tanımır və oxucuya hərfi-hərfinə göstərərdi.
     */
    public static function govde(string $metn): string
    {
        $metn = self::emojisiz($metn);
        $metn = str_replace(["\r\n", "\r"], "\n", $metn);
        $metn = preg_replace('/^#{1,6}\s*/mu', '', $metn) ?? $metn;
        $metn = preg_replace('/^\s*[-*•]\s+/mu', '', $metn) ?? $metn;
        $metn = preg_replace('/\n{3,}/u', "\n\n", $metn) ?? $metn;

        return trim($metn);
    }

    /* ----------------------------------------------------------------
     | Köməkçilər
     |---------------------------------------------------------------- */

    /**
     * Üç sual — MODELDƏN SORUŞULMUR, qurulur.
     *
     * Birinci sualın variantları şübhəli adlarının EYNİ sırasıdır və düzgün
     * cavab qatili göstərir: bütün qovluqlarda belədir və idarə paneli qatili
     * məhz bu uyğunluqdan çıxarır. Modeldən soruşulsaydı, o, nə vaxtsa sıranı
     * qarışdıracaq və qatil səssizcə səhv görünəcəkdi.
     *
     * @param array<string,mixed> $raw
     * @param list<array<string,mixed>> $subheli
     * @return list<array{prompt:string,options:list<string>,correct:int,explanation:string}>
     */
    protected static function suallar(array $raw, array $subheli, int $qatil): array
    {
        $adlar = array_map(static fn (array $s): string => (string) $s['name'], $subheli);

        $motiv = self::qisa(self::metn($raw['motive'] ?? ''), 120);
        $motivYalan = self::sətirlər($raw['motive_wrong'] ?? [], 3, 120);

        $subut = self::qisa(self::metn($raw['proof'] ?? ''), 160);
        $subutYalan = self::sətirlər($raw['proof_wrong'] ?? [], 3, 160);

        return [
            [
                'prompt'      => 'Ölüm kimin əlindən olub?',
                'options'     => $adlar,
                'correct'     => $qatil,
                'explanation' => '',
            ],
            [
                'prompt'      => 'Motiv nə olub?',
                'options'     => array_values(array_filter(array_merge([$motiv], $motivYalan))),
                'correct'     => 0,
                'explanation' => '',
            ],
            [
                'prompt'      => 'Hansı iki sənədin ziddiyyəti bunu sübut edir?',
                'options'     => array_values(array_filter(array_merge([$subut], $subutYalan))),
                'correct'     => 0,
                'explanation' => '',
            ],
        ];
    }

    /**
     * Şübhəlinin indeksi — ada görə.
     *
     * Əvvəlcə tam uyğunluq, sonra soyad axtarılır: model bəzən «Hüseynli
     * Kamran» yazır, siyahıda isə «Hüseynli Kamran Ənvər oğlu» durur.
     *
     * @param list<array<string,mixed>> $subheli
     */
    protected static function qatilIndeksi(string $ad, array $subheli): ?int
    {
        if ($ad === '' || $subheli === []) {
            return null;
        }

        foreach ($subheli as $i => $s) {
            if ((string) $s['name'] === $ad) {
                return $i;
            }
        }

        $soyad = self::soyad($ad);

        foreach ($subheli as $i => $s) {
            if ($soyad !== '' && $soyad === self::soyad((string) $s['name'])) {
                return $i;
            }
        }

        return null;
    }

    /**
     * Motiv və sübut mətni BAŞQA şübhəlini adlandırırmı.
     *
     * @param array<string,mixed> $raw
     * @param list<array<string,mixed>> $subheli
     * @return list<string>
     */
    protected static function qatilZiddiyyeti(array $raw, array $subheli, int $qatil): array
    {
        $out = [];

        foreach (['motive' => 'Motiv', 'proof' => 'Sübut'] as $acar => $ad) {
            $metn = self::metn($raw[$acar] ?? '');

            foreach ($subheli as $i => $sb) {
                $soyad = self::soyad((string) $sb['name']);

                if ($i !== $qatil && $soyad !== '' && mb_strpos($metn, $soyad) !== false) {
                    $out[] = $ad . ' mətni «' . $sb['name'] . '»-dan danışır, qatil isə «'
                        . $subheli[$qatil]['name'] . '» işarələnib. Cavab tabında düzəldin.';

                    break;
                }
            }
        }

        return $out;
    }

    /** Tam addan soyad — «Hüseynli Kamran Ənvər oğlu» → «Hüseynli». */
    protected static function soyad(string $ad): string
    {
        $par = preg_split('/\s+/u', trim($ad)) ?: [];

        return $par === [] ? '' : (string) $par[0];
    }

    /**
     * Real qurum adı qalıbmı.
     *
     * Qara siyahı DARDIR və qəsdən belədir: bircə «polis» sözünü qadağan
     * etsək, «polis çağırıldı» cümləsi mümkünsüz olar və qayda bir həftəyə
     * yan keçiləcək. `config('dossier.org_ban')` ilə eyni siyahı.
     *
     * @param array<string,mixed> $skelet
     * @return list<string>
     */
    protected static function qurumProblemi(array $skelet): array
    {
        $govde = mb_strtolower(json_encode($skelet, JSON_UNESCAPED_UNICODE) ?: '', 'UTF-8');
        $tapilan = [];

        foreach (self::ORG_BAN as $q) {
            if (mb_strpos($govde, $q) !== false) {
                $tapilan[] = $q;
            }
        }

        if ($tapilan === []) {
            return [];
        }

        return ['Mətndə real qurum adı var: «' . implode('», «', $tapilan)
            . '». Dərc etməzdən əvvəl dəyişdirin.'];
    }

    /** @return list<array{0:string,1:string}> */
    protected static function cutler(mixed $xam): array
    {
        $out = [];

        foreach ((array) $xam as $c) {
            $c = array_values((array) $c);

            if (count($c) < 2) {
                continue;
            }

            $out[] = [self::qisa(self::metn($c[0]), 20), self::qisa(self::metn($c[1]), 200)];
        }

        return $out;
    }

    /** @return list<string> */
    protected static function sətirlər(mixed $xam, int $say, int $uzunluq): array
    {
        $out = [];

        foreach (array_slice((array) $xam, 0, $say) as $s) {
            $s = self::qisa(self::metn($s), $uzunluq);

            if ($s !== '') {
                $out[] = $s;
            }
        }

        return $out;
    }

    /**
     * Alibi zolaqları — faiz cütləri, 0–100 aralığında.
     *
     * @return list<array{0:int,1:int}>
     */
    protected static function zolaqlar(mixed $xam): array
    {
        $out = [];

        foreach (array_slice((array) $xam, 0, 3) as $z) {
            $z = array_values((array) $z);

            if (count($z) < 2) {
                continue;
            }

            $bas = max(0, min(100, (int) $z[0]));
            $uzun = max(1, min(100 - $bas, (int) $z[1]));
            $out[] = [$bas, $uzun];
        }

        return $out === [] ? [[0, 30]] : $out;
    }

    /* Kəsmə emoji silindikdən SONRA gedir: əks halda emojinin yerində
       qalan boşluq sətrin sonunda ilişib qalır. */
    /**
     * Saat — «HH:MM». Uyğun gəlməyən dəyər BOŞ qalır.
     *
     * Sərbəst mətn saxlansaydı, «14 noyabr» mesajın altında saat kimi
     * görünərdi və ekran görüntüsü öz-özünü təkzib edərdi.
     */
    protected static function saat(mixed $v): string
    {
        return preg_match('/\b([01]?\d|2[0-3]):[0-5]\d\b/', self::metn($v), $m) === 1 ? $m[0] : '';
    }

    protected static function metn(mixed $v): string
    {
        return trim(self::emojisiz(is_scalar($v) ? (string) $v : ''));
    }

    /** Emoji sənəddə olmaz: vərəq rəsmi blankdır. */
    protected static function emojisiz(string $s): string
    {
        return preg_replace('/[\x{1F000}-\x{1FAFF}\x{2600}-\x{27BF}\x{FE0F}\x{2190}-\x{21FF}]/u', '', $s) ?? $s;
    }

    protected static function qisa(string $s, int $hedd): string
    {
        return mb_substr($s, 0, $hedd);
    }
}
