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
    public const BLANK = ['resmi', 'qerar', 'arayis', 'protokol', 'ekspert', 'izahat'];

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
        }

        return <<<METN
        İşin skeleti:
        {$hekaye}

        Aşağıdakı vərəqlərin MƏTNİNİ yaz. Hər biri üçün `no` (verilmiş nömrə),
        `meta_line` (bir quru sətir: sənəd nömrəsi, tarix, saat) və `body`.

        {$siyahi}
        MƏTN QAYDALARI:
        · Boş sətir abzası bölür.
        · Vacib faktı **iki ulduzla** qalın et.
        · Müstəntiqin qeydini [[iki kvadrat mötərizə]] içinə al.
        · Sonradan əl ilə yazılmış sözü ++iki plyus++ arasına al.
        · Pozulmuş sözü ~~iki tilda~~ arasına al.
        · Kseroksda itmiş hissəni ((iki mötərizə)) arasına al.
        · Dairəyə alınmış rəqəmi %%iki faiz%% arasına al.
        · Başqa heç bir işarə, markdown başlığı və ya siyahı nişanı işlətmə.
        · Hər vərəq 90–220 söz.
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
                    'culprit'      => ['type' => 'integer'],
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

    /** @return array<string,mixed> */
    public static function senedSchema(): array
    {
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
                            'required' => ['no', 'meta_line', 'body'],
                            'properties' => [
                                'no'        => ['type' => 'integer'],
                                'meta_line' => ['type' => 'string'],
                                'body'      => ['type' => 'string'],
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

        /* Qatilin indeksi siyahıdan KƏNARA çıxa bilməz: çıxsaydı, heç kim
           işarələnməzdi və səbəb görünməzdi. */
        $qatil = (int) ($raw['culprit'] ?? 0);
        $qatil = ($subheli !== [] && isset($subheli[$qatil])) ? $qatil : 0;

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
     * Bir partiya vərəq mətni.
     *
     * @param array<string,mixed> $raw
     * @return array<int,array{meta_line:string,body:string}>  vərəq nömrəsi → mətn
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
            ];
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
