<?php

declare(strict_types=1);

namespace App\Support\Ai;

use App\Support\TemplateSchema;

/**
 * AI şablon köməkçisinin beyni: prompt · cavab sxemi · təmizləmə · yoxlama.
 *
 * Freymvorksuzdur (`App\Support\*` qaydası) — `tests/logic.php` onu Laravel
 * olmadan yükləyir və saxta cavabla yoxlayır.
 *
 * Burada üç ayrı iş görülür və üçü də bir yerdə olmalıdır, çünki hamısı EYNİ
 * qaydalar dəstini oxuyur:
 *
 *   1. `system()` / `user()` — qaydaları modelə danışır;
 *   2. `normalize()` — cavabı qaydalara ZORLA uyğunlaşdırır (model səhv etsə də,
 *      formaya düşən dəyər invariantları pozmur);
 *   3. `problems()` — düzəldilə bilməyəni admin görsün deyə sadalayır.
 *
 * Modelin cavabına heç vaxt etibar edilmir: `normalize()` kəsir, təkrarı atır,
 * emojini silir və `titleOptions[0] === title` kimi kataloq invariantlarını
 * özü qurur (`tools/copy-rules.js` §10).
 */
final class TemplateBrief
{
    /** Nə doldurulsun. Formadakı açılan siyahı ilə eynidir. */
    public const MODES = ['full', 'metn', 'variant', 'anket'];

    /* ---- vizual hədəf aralıqları — `tools/copy-rules.js` BAND güzgüsü ---- */
    public const TITLE_MIN    = 55;
    public const TITLE_MAX    = 92;
    public const PREAMBLE_MIN = 180;
    public const PREAMBLE_MAX = 330;
    public const PENALTY_MIN  = 80;
    public const PENALTY_MAX  = 230;
    public const POWER_LINE   = 88;
    public const POWER_LINES  = 4;
    public const ORG_MAX      = 56;
    public const TAG_MAX      = 24;

    /** Server hədləri gəlmədikdə istifadə olunan ehtiyat — `config/zarafat.php` güzgüsü. */
    private const FALLBACK_LIMITS = ['title' => 110, 'preamble' => 700, 'penalty' => 300, 'power_lines' => 8];

    /* Nə qədər variant istənilir — `TemplateSchema` hədlərindən aşağıdır,
       çünki 20 bənd variantı oxunaqlı olmur və modelin keyfiyyəti düşür. */
    public const WANT_TITLES   = 5;
    public const WANT_POWERS   = 10;
    public const WANT_PENALTY  = 4;

    /**
     * Real qurumun adı sənədə düşə bilməz — hüquqi qalxanın avtomatlaşdırılmış
     * hissəsi. `tools/check-templates.js` `ORG_BAN` güzgüsü; orada statik
     * kataloq yoxlanılır, burada isə AI-nin cavabı.
     *
     * @var list<string>
     */
    public const ORG_BAN = ['Nazirliy', 'Nazirlər Kabineti', 'Azərbaycan Respublikası',
        'Dövlət Agentliyi', 'Dövlət Komitəsi', 'Prezident', 'Prokurorluq',
        'Polis', 'FIFA', 'UEFA', 'UNESCO', 'Interpol', 'İnterpol'];

    /** Sənədin mətnində emoji olmaz; `share` istisnadır (SVG-yə düşmür). */
    private const EMOJI = '/[\x{2190}-\x{21FF}\x{2300}-\x{23FF}\x{25A0}-\x{27BF}\x{2B00}-\x{2BFF}\x{FE0F}\x{1F000}-\x{1FAFF}]/u';

    /** @var list<string> */
    private const SLANG = ['haha', 'hehe', 'lol', 'wtf', 'omg', ':)', ':(', '))', 'xaxa'];

    /* ==================== prompt ==================== */

    /**
     * Sistem promptu — qaydalar dəsti. Ton, hüquqi qalxan və üslub.
     *
     * @param  array<string,mixed>  $ctx
     */
    public static function system(array $ctx): string
    {
        $tone = ($ctx['tone'] ?? 'zarafat') === 'xatire' ? 'xatire' : 'zarafat';

        $toneRules = $tone === 'xatire'
            ? "TON — «xatirə»: bu sənəd hədiyyədir. İstiqanlı, səmimi, bir az təntənəli yaz.\n"
              . "Rişxənd, sarkazm və «cəza» hissi OLMAZ. Bürokratik forma qalır, amma sözlər mehribandır.\n"
              . "Mövzu: yubiley, təşəkkür, xatirə günü, dostluq, valideynlər, uşağın ilk addımı və s."
            : "TON — «zarafat»: gülüş rəsmi formanın ciddiliyi ilə mövzunun cüzilüyü arasındakı\n"
              . "ziddiyyətdən doğur. Sən ZARAFATI İZAH ETMİRSƏN — tam ciddi katib kimi yazırsan,\n"
              . "gülməli olan isə mövzudur (xoruldama, pultun sahibliyi, süfrə hesabı, gecikmə).\n"
              . "Nida işarəsi, «çox gülməli», «hahaha» kimi şeylər OLMAZ.";

        return <<<TXT
        Sən «Zarafat Notariat Palatası» adlı UYDURMA parodiya idarəsinin katibisən.
        Sayt gülməli və xatirə sənədləri hazırlayır: bunlar HEÇ BİR HÜQUQİ QÜVVƏYƏ MALİK DEYİL.

        DİL: yalnız Azərbaycan dili. Rus və ingilis sözü işlətmə (beynəlxalq termin istisna).
        Orfoqrafiya tam düzgün olmalıdır: ə, ğ, ı, İ, ö, ş, ü, ç hərfləri yerində.
        Üslub: rəsmi-kargüzarlıq dili — «hesab edilir», «müəyyən olunur», «öhdəlik daşıyır».

        {$toneRules}

        MÜTLƏQ QADAĞALAR — pozulması sənədi hüquqi riskə salır:
        • Real dövlət qurumu, nazirlik, komitə, agentlik, polis, prokurorluq, prezident,
          «Azərbaycan Respublikası», dövlət gerbi/bayrağı və hər hansı real reyestr adı.
        • Real şirkət, brend, idman klubu, beynəlxalq təşkilat (FIFA, UEFA, UNESCO, Interpol) adı.
        • Real, tanınan şəxsin adı; siyasi, dini və etnik mövzular.
        • Söyüş, təhqir, cinsi məzmun, alkoqol/narkotik təbliği, real hədə.
        İmzalayan orqan HƏMİŞƏ uydurma və gülməli olmalıdır — məsələn
        «Məişət Səs-Küyü üzrə Baş İdarə», «Divan və Pult Məsələləri Komissiyası».

        FORMAT QAYDALARI:
        • Sənədin mətnində EMOJI OLMAZ (yalnız «share» sahəsində bir dənə ola bilər).
        • Danışıq dili olmaz: haha, lol, ))), omg.
        • Bəndlərdə nömrə yazma — nömrəni blank özü qoyur.
        • Yer tutucular: {to} — sənədi alan, {from} — sənədi verən. Hər ikisi giriş
          cümləsində işlənməlidir (ən azı biri məcburidir).
        • Uydurma rəqəm və maddə nömrələri (məsələn «4.2-ci bənd») ciddiliyi artırır — işlət.

        Cavabı YALNIZ JSON kimi ver. İzah, giriş cümləsi, markdown blokları əlavə etmə.
        TXT;
    }

    /**
     * İstifadəçi promptu — konkret tapşırıq: kateqoriya, blank, hədlər.
     *
     * @param  array<string,mixed>  $ctx
     */
    public static function user(string $brief, array $ctx, string $mode): string
    {
        $tails  = implode(' · ', (array) ($ctx['tails'] ?? []));
        $layout = (string) ($ctx['layoutName'] ?? $ctx['layout'] ?? '');
        $type   = (string) ($ctx['typeWord'] ?? '');
        $cat    = (string) ($ctx['categoryName'] ?? '—');

        $out = "TAPŞIRIQ\n" . trim($brief) . "\n\n";

        $out .= "KONTEKST\n";
        $out .= "Kateqoriya: {$cat}\n";
        $out .= "Blank: {$layout} — sənədin başında «{$type}» sözünü yazır.\n";

        if (($ctx['tone'] ?? '') !== 'xatire' && $tails !== '') {
            $out .= "Ona görə BAŞLIQ mütləq bu sözlərdən biri ilə bitməlidir: {$tails}.\n";
        }

        if (! empty($ctx['layoutNote'])) {
            $out .= "Blankın xüsusiyyəti: {$ctx['layoutNote']}\n";
        }

        if (! empty($ctx['siblingTitles'])) {
            $out .= "\nBu kateqoriyada ARTIQ olan başlıqlar — təkrarlama, mövzunu da təkrarlama:\n";
            foreach ((array) $ctx['siblingTitles'] as $t) {
                $out .= "  · {$t}\n";
            }
        }

        if (! empty($ctx['siblingOrgs'])) {
            $out .= "\nBu kateqoriyanın qurum ailəsi — mümkünsə bunlardan birini işlət:\n";
            foreach ((array) $ctx['siblingOrgs'] as $o) {
                $out .= "  · {$o}\n";
            }
        }

        $out .= "\n" . self::modeBrief($mode, $ctx);

        return $out;
    }

    /** @param array<string,mixed> $ctx */
    private static function modeBrief(string $mode, array $ctx): string
    {
        $t = self::TITLE_MIN . '–' . self::TITLE_MAX;
        $p = self::PREAMBLE_MIN . '–' . self::PREAMBLE_MAX;
        $q = self::PENALTY_MIN . '–' . self::PENALTY_MAX;
        $n = self::POWER_LINES;
        $l = self::POWER_LINE;

        $text = "UZUNLUQ HƏDLƏRİ (simvolla, ciddi riayət et)\n"
            . "  title     {$t}\n"
            . "  preamble  {$p}  — 2-3 cümlə, {to} və {from} işlənməlidir\n"
            . "  powers    tam {$n} bənd, hər biri ≤{$l}, hər biri nöqtə ilə bitir\n"
            . "  penalty   {$q}  — sənədin zərbə cümləsi, ən gülməli hissə\n"
            . "  signOrg   ≤" . self::ORG_MAX . "  — uydurma qurum\n"
            . "  signTitle ≤40  — uydurma vəzifə, məsələn «Baş İnspektor»\n"
            . "  tag       ≤" . self::TAG_MAX . "  — kataloq kartının kiçik nişanı, 1-2 söz\n"
            . "  share     ≤" . TemplateSchema::MAX_SHARE_LEN . " — sosial paylaşım cümləsi, bir emoji olar\n";

        $opts = "VARİANT SİYAHILARI — ziyarətçi açılan siyahıdan seçir\n"
            . "  titleOptions   " . self::WANT_TITLES . " variant; BİRİNCİSİ eynilə «title» olmalıdır\n"
            . "  powersOptions  " . self::WANT_POWERS . " bənd; İLK {$n}-ü eynilə «powers» olmalıdır,\n"
            . "                 qalanları eyni mövzunun BAŞQA gülməli bəndləridir, hər biri ≤{$l}\n"
            . "  penaltyOptions " . self::WANT_PENALTY . " variant; BİRİNCİSİ eynilə «penalty» olmalıdır\n"
            . "  Variantlar bir-birini təkrarlamamalıdır.\n";

        $anket = "ANKET SXEMİ — ziyarətçiyə verilən suallar\n"
            . "  3-6 sahə. Hər sahədə: k (yalnız a-z0-9_), t (tip), label (sual).\n"
            . "  Tiplər: text · select · multi · list · scale · number · time · date · datetime\n"
            . "  select və multi üçün «opts» doldurulmalıdır (3-5 variant).\n"
            . "  multi üçün min/max verilir (1 ≤ min ≤ max ≤ variant sayı), scale üçün min<max≤10.\n"
            . "  «row» — cavabın sənəd cədvəlindəki BÖYÜK HƏRFLƏ adı.\n"
            . "  Ədəd verilmirsə -1, mətn verilmirsə boş sətir yaz.\n"
            . "  Giriş cümləsində sahələrə {{k}} ilə istinad et — hər {{k}} mövcud sahə olmalıdır.\n"
            . "  notes: " . TemplateSchema::MAX_NOTES . "-dən çox olmayan qeyd, hər biri ≤"
            . TemplateSchema::MAX_NOTE_LEN . " simvol.\n";

        return match ($mode) {
            'metn'    => "NƏ İSTƏNİLİR: yalnız şablonun öz mətni.\n\n" . $text,
            'variant' => "NƏ İSTƏNİLİR: mövcud mətnə uyğun variant siyahıları.\n\n"
                         . self::current($ctx) . "\n" . $opts,
            'anket'   => "NƏ İSTƏNİLİR: şablonun mətni və anket sxemi.\n\n" . $text . "\n" . $anket,
            default   => "NƏ İSTƏNİLİR: şablonun mətni və variant siyahıları.\n\n" . $text . "\n" . $opts,
        };
    }

    /** @param array<string,mixed> $ctx */
    private static function current(array $ctx): string
    {
        return "MÖVCUD MƏTN — dəyişdirmə, variantları bunun ətrafında qur:\n"
            . "  title:   " . (string) ($ctx['title'] ?? '') . "\n"
            . "  powers:\n    " . implode("\n    ", (array) ($ctx['powersLines'] ?? [])) . "\n"
            . "  penalty: " . (string) ($ctx['penalty'] ?? '') . "\n";
    }

    /* ==================== cavab sxemi ==================== */

    /**
     * OpenAI `json_schema` (strict) sxemi. Strict rejimdə hər açar `required`
     * olmalıdır, ona görə rejimə uyğun sxem qurulur — modeldən lazımsız
     * sahə istəmirik.
     *
     * @return array<string,mixed>
     */
    public static function schema(string $mode): array
    {
        $s   = static fn (string $d): array => ['type' => 'string', 'description' => $d];
        $arr = static fn (string $d): array => ['type' => 'array', 'description' => $d, 'items' => ['type' => 'string']];

        $props = [];

        if ($mode !== 'variant') {
            $props += [
                'title'     => $s('Sənədin başlığı'),
                'tag'       => $s('Kataloq nişanı, 1-2 söz'),
                'preamble'  => $s('Giriş cümləsi; {to} və {from} işlənir'),
                'powers'    => $arr('Tam ' . self::POWER_LINES . ' bənd, nömrəsiz'),
                'penalty'   => $s('Cəza bəndi — zərbə cümləsi'),
                'signOrg'   => $s('Uydurma imzalayan orqan'),
                'signTitle' => $s('Uydurma vəzifə'),
                'share'     => $s('Sosial paylaşım cümləsi'),
            ];
        }

        if ($mode === 'full' || $mode === 'variant') {
            $props += [
                'titleOptions'   => $arr('Birincisi eynilə title'),
                'powersOptions'  => $arr('İlk ' . self::POWER_LINES . '-ü eynilə powers'),
                'penaltyOptions' => $arr('Birincisi eynilə penalty'),
            ];
        }

        if ($mode === 'anket') {
            $props += [
                'notes'  => $arr('Nömrələnmiş qeydlər'),
                'fields' => [
                    'type'  => 'array',
                    'items' => [
                        'type'                 => 'object',
                        'additionalProperties' => false,
                        'required'             => ['k', 't', 'label', 'row', 'opts', 'min', 'max', 'unit', 'hint'],
                        'properties'           => [
                            'k'     => $s('Açar: yalnız a-z, 0-9, _'),
                            't'     => ['type' => 'string', 'enum' => TemplateSchema::TYPES],
                            'label' => $s('Ziyarətçiyə göstərilən sual'),
                            'row'   => $s('Cədvəl sətrinin adı, BÖYÜK HƏRFLƏ; lazım deyilsə boş'),
                            'opts'  => $arr('select və multi üçün variantlar; digərlərində boş massiv'),
                            'min'   => ['type' => 'integer', 'description' => 'Lazım deyilsə -1'],
                            'max'   => ['type' => 'integer', 'description' => 'Lazım deyilsə -1'],
                            'unit'  => $s('Ölçü vahidi; lazım deyilsə boş'),
                            'hint'  => $s('Sahənin altındakı ipucu; lazım deyilsə boş'),
                        ],
                    ],
                ],
            ];
        }

        return [
            'name'   => 'zarafat_sablon',
            'strict' => true,
            'schema' => [
                'type'                 => 'object',
                'additionalProperties' => false,
                'required'             => array_keys($props),
                'properties'           => $props,
            ],
        ];
    }

    /* ==================== təmizləmə ==================== */

    /**
     * Modelin cavabını forma sahələrinə çevirir və QAYDALARA ZORLA salır.
     * Açarlar formadakı `name` atributları ilə eynidir — JS onları birbaşa yazır.
     *
     * @param  array<string,mixed>  $raw
     * @param  array<string,mixed>  $ctx
     * @return array{values:array<string,string>,warnings:list<string>}
     */
    public static function normalize(array $raw, array $ctx, string $mode): array
    {
        $warn   = [];
        $values = [];

        $doc = static fn (mixed $v, int $max): string => self::clean($v, $max, true);

        if ($mode !== 'variant') {
            $title   = $doc($raw['title'] ?? '', self::lim($ctx, 'title'));
            $powers  = self::lineList($raw['powers'] ?? [], TemplateSchema::MAX_POWER_LINE,
                self::lim($ctx, 'power_lines'), true);
            $penalty = $doc($raw['penalty'] ?? '', self::lim($ctx, 'penalty'));
            $org     = $doc($raw['signOrg'] ?? '', self::ORG_MAX);

            /* Hüquqi qalxan: real qurumun adı gəlibsə sahə BOŞALDILIR.
               Xəbərdarlıqla ötüşmək olmazdı — admin «Yadda saxla»-ya basanda
               həmin ad sənədin başlığının altına düşərdi. */
            foreach (self::ORG_BAN as $ban) {
                if ($org !== '' && mb_stripos($org, $ban) !== false) {
                    $warn[] = "«İmzalayan orqan» real qurumu xatırladırdı («{$ban}») və silindi — özünüz uydurma ad yazın.";
                    $org = '';
                    break;
                }
            }

            /* Kəsilmiş mətn adminin gözündən qaçmasın: fikir yarımçıq qalır. */
            self::cutNote('Başlıq', $raw['title'] ?? '', $title, $warn);
            self::cutNote('Cəza bəndi', $raw['penalty'] ?? '', $penalty, $warn);
            $long = 0;
            foreach (self::lineList($raw['powers'] ?? [], 4000, 99, true) as $i => $src) {
                if (mb_strlen($src) > self::POWER_LINE) {
                    $long++;
                }
            }
            if ($long > 0) {
                $warn[] = $long . ' bənd ' . self::POWER_LINE . ' simvoldan uzun idi və qısaldıldı — '
                    . 'fikir yarımçıq qalıbsa özünüz tamamlayın.';
            }

            $values['title']      = $title;
            $values['tag']        = $doc($raw['tag'] ?? '', self::TAG_MAX);
            $values['preamble']   = $doc($raw['preamble'] ?? '', self::lim($ctx, 'preamble'));
            $values['powers']     = implode("\n", $powers);
            $values['penalty']    = $penalty;
            $values['sign_org']   = $org;
            $values['sign_title'] = $doc($raw['signTitle'] ?? '', 40);
            /* `share` sənədə düşmür — emoji orada icazəlidir. */
            $values['share']      = self::clean($raw['share'] ?? '', TemplateSchema::MAX_SHARE_LEN, false);
        } else {
            $title   = (string) ($ctx['title'] ?? '');
            $powers  = (array) ($ctx['powersLines'] ?? []);
            $penalty = (string) ($ctx['penalty'] ?? '');
        }

        if ($mode === 'full' || $mode === 'variant') {
            /* Kataloq invariantı (`copy-rules.js` §10): ilk variant şablonun ÖZ
               mətnidir. Modeldən xahiş etmək kifayət deyil — burada qurulur. */
            $values['title_options'] = implode("\n", self::options(
                $raw['titleOptions'] ?? [], [$title],
                TemplateSchema::MAX_TITLE_OPTS, self::lim($ctx, 'title'),
            ));
            $values['powers_options'] = implode("\n", self::options(
                $raw['powersOptions'] ?? [], $powers,
                TemplateSchema::MAX_POWER_OPTS, TemplateSchema::MAX_POWER_LINE,
            ));
            $values['penalty_options'] = implode("\n", self::options(
                $raw['penaltyOptions'] ?? [], [$penalty],
                TemplateSchema::MAX_PENALTY_OPTS, self::lim($ctx, 'penalty'),
            ));
            $values['powers_min'] = '2';
            $values['powers_max'] = (string) min(TemplateSchema::MAX_PICK, max(1, count($powers)));
        }

        if ($mode === 'anket') {
            $fields = self::fields($raw['fields'] ?? [], $warn);
            $values['fields'] = $fields === []
                ? ''
                : (string) json_encode($fields, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
            $values['notes'] = implode("\n", self::lineList(
                $raw['notes'] ?? [], TemplateSchema::MAX_NOTE_LEN, TemplateSchema::MAX_NOTES, true,
            ));
            /* Anket və variant siyahıları bir şablonda yaşamır — server rədd edir. */
            $values['title_options'] = '';
            $values['powers_options'] = '';
            $values['penalty_options'] = '';
        }

        return ['values' => $values, 'warnings' => array_merge($warn, self::problems($values, $ctx, $mode))];
    }

    /**
     * Düzəldilməyən, amma adminin bilməli olduğu uyğunsuzluqlar.
     * Bloklamır — formada göstərilir, admin əl gəzdirib saxlayır.
     *
     * @param  array<string,string>  $v
     * @param  array<string,mixed>  $ctx
     * @return list<string>
     */
    public static function problems(array $v, array $ctx, string $mode): array
    {
        $out = [];

        if ($mode === 'variant') {
            return $out;
        }

        $band = static function (string $key, string $label, int $lo, int $hi) use ($v, &$out): void {
            $n = mb_strlen($v[$key] ?? '');
            if ($n === 0) {
                $out[] = "{$label} boş gəldi — təkrar cəhd edin və ya özünüz yazın.";
            } elseif ($n < $lo || $n > $hi) {
                $out[] = "{$label} {$n} simvoldur (hədəf {$lo}–{$hi}) — qısaldın və ya uzadın.";
            }
        };

        $band('title', 'Başlıq', self::TITLE_MIN, self::TITLE_MAX);
        $band('preamble', 'Giriş cümləsi', self::PREAMBLE_MIN, self::PREAMBLE_MAX);
        $band('penalty', 'Cəza bəndi', self::PENALTY_MIN, self::PENALTY_MAX);

        $pre = $v['preamble'] ?? '';
        if ($pre !== '' && ! str_contains($pre, '{to}') && ! str_contains($pre, '{from}')) {
            $out[] = 'Giriş cümləsində nə {to}, nə {from} var — ad sahələri sənədə düşməyəcək.';
        }

        /* Başlığın son sözü blankın yazdığı növ sözü ilə uyuşmalıdır
           (`copy-rules.js` DOC_TYPE) — yalnız `zarafat` tonunda. */
        $tails = (array) ($ctx['tails'] ?? []);
        if (($ctx['tone'] ?? 'zarafat') !== 'xatire' && $tails !== [] && ($v['title'] ?? '') !== '') {
            $words = preg_split('/\s+/u', trim($v['title'])) ?: [];
            $last  = self::lower(trim((string) end($words), '«»"\'.,;:!?()'));
            if (! in_array($last, array_map(self::lower(...), $tails), true)) {
                $out[] = "Başlıq «{$last}» ilə bitir; bu blank üçün gözlənilən: " . implode(' · ', $tails) . '.';
            }
        }

        foreach (['title' => 'Başlıq', 'preamble' => 'Giriş cümləsi', 'penalty' => 'Cəza bəndi'] as $k => $label) {
            foreach (self::SLANG as $s) {
                if (isset($v[$k]) && str_contains(self::lower($v[$k]), $s)) {
                    $out[] = "{$label} danışıq dili daşıyır — «{$s}».";
                    break;
                }
            }
        }

        if (($v['sign_org'] ?? '') === '') {
            $out[] = '«İmzalayan orqan» boşdur — uydurma qurum adı yazın, sənədin mastheadına düşür.';
        }

        foreach (explode("\n", $v['powers'] ?? '') as $i => $line) {
            if (mb_strlen($line) > self::POWER_LINE) {
                $out[] = ($i + 1) . '-ci bənd ' . mb_strlen($line) . ' simvoldur (≤' . self::POWER_LINE . ').';
            }
        }

        return $out;
    }

    /* ==================== köməkçilər ==================== */

    /** Bir sətirlik mətn: boşluqlar yığılır, emoji (istəyə görə) silinir, kəsilir. */
    private static function clean(mixed $value, int $max, bool $stripEmoji): string
    {
        $s = is_scalar($value) ? (string) $value : '';
        $s = str_replace(["\r", "\n", "\t"], ' ', $s);

        if ($stripEmoji) {
            $s = (string) preg_replace(self::EMOJI, '', $s);
        }

        $s = trim((string) preg_replace('/ {2,}/u', ' ', $s));

        return self::cut($s, $max);
    }

    /**
     * Həddi aşan mətni SÖZ SƏRHƏDİNDƏ kəsir.
     *
     * `mb_substr` ilə düz kəsmək sözü ortadan qırır («…təsdiqedic») və nəticə
     * sənədə elə düşür. Ona görə həddən əvvəlki son boşluğa qayıdılır; sonda
     * qalan vergül/tire kimi işarələr də atılır. Bir söz tək başına həddi
     * aşırsa (praktikada olmur) düz kəsməyə qayıdılır.
     */
    private static function cut(string $s, int $max): string
    {
        if ($max < 1 || mb_strlen($s) <= $max) {
            return $s;
        }

        $head = mb_substr($s, 0, $max);
        $sp   = mb_strrpos($head, ' ');

        if ($sp !== false && $sp >= (int) ($max * 0.6)) {
            $head = mb_substr($head, 0, $sp);
        }

        return rtrim($head, " ,;:-–—«(");
    }

    /**
     * Massiv (və ya sətir) → təmiz sətir siyahısı. Təkrar və boş atılır.
     *
     * @return list<string>
     */
    private static function lineList(mixed $value, int $maxLen, int $maxItems, bool $stripEmoji): array
    {
        $items = is_array($value)
            ? $value
            : (preg_split('/\R/u', is_scalar($value) ? (string) $value : '') ?: []);

        $out = [];
        foreach ($items as $item) {
            /* Model bəzən «1. » və ya «- » nömrəsi qoyur — blank onsuz da qoyur. */
            $line = self::clean($item, $maxLen, $stripEmoji);
            $line = (string) preg_replace('/^\s*(?:\d+[.)]|[-–—•])\s*/u', '', $line);
            $line = trim($line);

            if ($line !== '' && ! in_array($line, $out, true)) {
                $out[] = $line;
            }
            if (count($out) >= $maxItems) {
                break;
            }
        }

        return $out;
    }

    /**
     * Variant siyahısı: əvvəldə şablonun ÖZ mətni, sonra modelin təklifləri.
     *
     * @param  list<string>  $head  siyahının başında məcburi duran sətirlər
     * @return list<string>
     */
    private static function options(mixed $value, array $head, int $maxItems, int $maxLen): array
    {
        $head = array_values(array_filter(array_map(
            static fn ($h): string => self::clean($h, $maxLen, true),
            $head,
        ), static fn (string $h): bool => $h !== ''));

        if ($head === []) {
            return [];
        }

        $rest = self::lineList($value, $maxLen, $maxItems + count($head), true);
        $out  = $head;

        foreach ($rest as $line) {
            if (count($out) >= $maxItems) {
                break;
            }
            if (! in_array($line, $out, true)) {
                $out[] = $line;
            }
        }

        /* Tək variantlı siyahı ziyarətçiyə seçim vermir — mənasızdır. */
        return count($out) > count($head) ? $out : [];
    }

    /**
     * Anket sahələri: «-1» və boş sətir «yoxdur» deməkdir (strict sxem hər
     * açarı məcbur edir), ona görə burada təmizlənir.
     *
     * @param  list<string>  $warn
     * @return list<array<string,mixed>>
     */
    private static function fields(mixed $value, array &$warn): array
    {
        if (! is_array($value)) {
            return [];
        }

        $out  = [];
        $keys = [];

        foreach ($value as $f) {
            if (! is_array($f) || count($out) >= TemplateSchema::MAX_FIELDS) {
                continue;
            }

            $k = self::asciiKey(self::clean($f['k'] ?? '', 40, true));
            $t = (string) ($f['t'] ?? '');

            if ($k === '' || ! in_array($t, TemplateSchema::TYPES, true)) {
                continue;
            }
            if (in_array($k, $keys, true)) {
                $warn[] = "Anketdə «{$k}» açarı təkrarlandı — ikinci sahə atıldı.";
                continue;
            }
            $keys[] = $k;

            $row = ['k' => $k, 't' => $t, 'label' => self::clean($f['label'] ?? '', TemplateSchema::MAX_LABEL_LEN, true)];

            foreach (['row' => TemplateSchema::MAX_ROW_LEN, 'unit' => 12, 'hint' => 120] as $key => $max) {
                $v = self::clean($f[$key] ?? '', $max, true);
                if ($v !== '') {
                    $row[$key] = $v;
                }
            }

            if ($t === 'select' || $t === 'multi') {
                $opts = self::lineList($f['opts'] ?? [], TemplateSchema::MAX_OPT_LEN, 12, true);
                if ($opts === []) {
                    $warn[] = "Anketdəki «{$k}» sahəsində variant siyahısı boş gəldi — özünüz doldurun.";
                }
                $row['opts'] = $opts;
            }

            foreach (['min', 'max'] as $key) {
                $n = is_numeric($f[$key] ?? null) ? (int) $f[$key] : -1;
                if ($n >= 0) {
                    $row[$key] = $n;
                }
            }

            /* Tipə görə məcburi olan aralıqlar — `TemplateSchema::validate()`
               onları tələb edir, model isə unuda bilir. */
            if ($t === 'multi') {
                $n = count($row['opts'] ?? []);
                $row['min'] = max(1, min($row['min'] ?? 1, $n ?: 1));
                $row['max'] = max($row['min'], min($row['max'] ?? $n, $n ?: 1));
            }
            if ($t === 'scale') {
                $row['min'] = max(0, min($row['min'] ?? 1, 9));
                $row['max'] = max($row['min'] + 1, min($row['max'] ?? 10, 10));
            }

            $out[] = $row;
        }

        return $out;
    }

    /**
     * Kəsilmə xəbərdarlığı — mənbə mətn nəticədən uzundursa.
     *
     * @param  list<string>  $warn
     */
    private static function cutNote(string $label, mixed $src, string $out, array &$warn): void
    {
        $raw = self::clean($src, 100000, false);

        if ($out !== '' && mb_strlen($raw) > mb_strlen($out)) {
            $warn[] = "{$label} server həddini aşırdı və qısaldıldı — fikir yarımçıq qalıbsa özünüz tamamlayın.";
        }
    }

    /** Server həddi: kontekstdən gəlir (config/zarafat.php `limits`), yoxsa ehtiyat. */
    private static function lim(array $ctx, string $key): int
    {
        $limits = is_array($ctx['limits'] ?? null) ? $ctx['limits'] : [];

        return (int) ($limits[$key] ?? self::FALLBACK_LIMITS[$key]);
    }

    /**
     * Anket açarı: «Təyinat yeri» → «teyinat_yeri».
     * `admin/template.blade.php` içindəki `azSlug()` güzgüsü — kart qurucusu
     * açarı eyni qayda ilə yığır, ona görə AI-nin və adminin nəticəsi üst-üstə düşür.
     */
    private static function asciiKey(string $s): string
    {
        $map = ['ə' => 'e', 'ğ' => 'g', 'ı' => 'i', 'ö' => 'o', 'ş' => 's', 'ü' => 'u', 'ç' => 'c'];
        $out = strtr(self::lower($s), $map);
        $out = (string) preg_replace('/[^a-z0-9]+/u', '_', $out);

        return mb_substr(trim($out, '_'), 0, 20);
    }

    /** Azərbaycan reqistri — `copy-rules.js` `lower()` güzgüsü. */
    private static function lower(string $s): string
    {
        return str_replace("\u{0307}", '', mb_strtolower(str_replace(['İ', 'I'], ['i', 'ı'], $s), 'UTF-8'));
    }
}
