<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Dossier;
use App\Models\DossierCode;
use App\Models\DossierDocument;
use App\Models\DossierQuestion;
use App\Models\DossierSuspect;
use App\Models\Setting;
use App\Support\Ai\OpenAiClient;
use App\Support\Ai\QovluqBrief;
use App\Support\Dossier\Byuro;
use App\Support\Moderation;
use App\Support\Sanitizer;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use RuntimeException;

/**
 * İş qovluğunun AI ilə qurulması.
 *
 * `AiService`-dən bir cəhətlə fərqlənir və fərq qəsdəndir: şablon köməkçisi
 * kataloqa HEÇ NƏ YAZMIR, formanı doldurur. Burada isə nəticə 25-30 vərəqdir
 * və heç bir formaya sığmır, ona görə QARALAMA qovluq bazada yaradılır.
 *
 * Bu, nəzarəti zəiflətmir: qaralama oyunçuya görünmür (`status = draft`),
 * dərc etmə isə `QovluqYoxlayici`-dən keçir — yəni AI-nin çıxışı da hər hansı
 * əl işi kimi eyni qapıdan keçir. Dəyişən yalnız odur ki, baxış «yadda saxla»
 * anından «dərc et» anına sürüşür.
 *
 * İKİ MƏRHƏLƏ. Bir cavaba 30 vərəq sığmır və bir HTTP sorğusuna altı OpenAI
 * çağırışı sığmır (vaxt aşımı). Ona görə: `skelet()` bir dəfə, sonra
 * `partiya()` brauzerin təkrar çağırışları ilə. Gedişi brauzer göstərir.
 */
class DossierAiService
{
    public function __construct(
        private readonly AiService $ai,
        private readonly ?OpenAiClient $client = null,
    ) {
    }

    public function enabled(): bool
    {
        return $this->ai->enabled();
    }

    /**
     * Birinci mərhələ — hekayə və vərəqlərin planı.
     *
     * @param array<string,mixed> $input brief · count · difficulty
     */
    public function skelet(array $input): Dossier
    {
        $brief = trim((string) ($input['brief'] ?? ''));

        if ($brief === '') {
            throw new RuntimeException('Nə istədiyinizi bir-iki cümlə ilə yazın.');
        }

        $say = max(QovluqBrief::SENED_MIN, min(QovluqBrief::SENED_MAX, (int) ($input['count'] ?? 20)));
        $cetinlik = Sanitizer::pick($input['difficulty'] ?? '', (array) config('dossier.difficulties'), 'orta');

        Log::info('qovluq-ai: skelet başladı', [
            'say' => $say, 'cetinlik' => $cetinlik, 'model' => $this->ai->model(),
        ]);

        $res = $this->cagir(
            QovluqBrief::skeletUser($brief, $say, $cetinlik),
            QovluqBrief::skeletSchema($say),
            /* Skelet ƏN AĞIR çağırışdır: hekayə + bütün vərəqlərin planı bir
               cavabdadır. Ölçülüb — 8 vərəq ≈ 4100 token və 45 saniyə, yəni
               40 vərəqdə həm 6000 tokenlik defolt hədd, həm də 90 saniyəlik
               timeout aşılardı və cavab YARIMÇIQ JSON kimi gələrdi. */
            max((int) config('ai.max_output_tokens'), 2000 + $say * 320),
            max((int) config('ai.timeout'), 40 + $say * 6),
        );

        ['skelet' => $s, 'problems' => $problem] = QovluqBrief::normalizeSkelet($res['raw'], $say);

        Log::info('qovluq-ai: skelet hazırdır', [
            'ad'       => $s['title'],
            'senedler' => count($s['documents']),
            'subheli'  => count($s['suspects']),
            'kilid'    => $s['lock'] !== null,
            'problem'  => $problem,
        ] + $res['stat']);

        $this->moderasiya($s);

        return DB::transaction(fn (): Dossier => $this->qovluqYarat($s, $cetinlik, $say, $problem, $brief));
    }

    /**
     * İkinci mərhələ — mətni olmayan növbəti partiya vərəq.
     *
     * @return array{done:int,total:int,model:string}
     */
    public function partiya(Dossier $dossier): array
    {
        $hamisi = $dossier->documents()->get();
        /* «Hələ yazılmayıb» ölçüsü `ai_brief` açarıdır, `body` deyil:
           vərəqlər BLOK rejimindədir və `body` həmişə boş qalır. Açar
           tapşırıqdır; yerinə yetiriləndə silinir. */
        $qalan = $hamisi->filter(
            static fn (DossierDocument $d): bool => isset(((array) $d->content)['ai_brief'])
        );

        if ($qalan->isEmpty()) {
            return ['done' => $hamisi->count(), 'total' => $hamisi->count(), 'model' => ''];
        }

        $partiya = $qalan->take(QovluqBrief::PARTIYA);
        $plan = [];

        $reqemler = $this->kilidReqemleri($dossier);

        foreach ($partiya as $d) {
            $sətir = [
                'no'        => (int) $d->sort,
                'name'      => (string) $d->name,
                'kind'      => (string) $d->kind,
                'blank_nov' => (string) $d->blank_nov,
                'brief'     => (string) (((array) $d->content)['ai_brief'] ?? ''),
            ];

            if (isset($reqemler[(int) $d->sort])) {
                $sətir['kilid_reqemi'] = $reqemler[(int) $d->sort];
            }

            $plan[] = $sətir;
        }

        /* İkinci mərhələyə hekayənin özü kontekst kimi gedir: modelin
           yaddaşı yoxdur və hər partiya ayrıca çağırışdır. */
        $res = $this->cagir(
            QovluqBrief::senedUser([
                'title'      => (string) $dossier->title,
                'place'      => (string) $dossier->place,
                'period'     => (string) $dossier->period,
                'suspects'   => $dossier->suspectList(),
                'chronology' => (array) $dossier->chronology,
                'solution'   => (array) $dossier->solution,
            ], $plan),
            QovluqBrief::senedSchema(),
        );

        $metnler = QovluqBrief::normalizeSenedler($res['raw']);
        $this->moderasiya($metnler);

        Log::info('qovluq-ai: partiya yazıldı', [
            'qovluq'   => $dossier->slug,
            'isteneni' => $partiya->pluck('sort')->all(),
            'geleni'   => array_keys($metnler),
        ] + $res['stat']);

        foreach ($partiya as $d) {
            $m = $metnler[(int) $d->sort] ?? null;

            /* Model bu vərəqi buraxıb. Tapşırıq qalsa, növbəti partiya onu
               yenidən istəyər və dövrə bağlanardı — ona görə tapşırıq silinir
               və vərəqə bir sətir yazılır ki, idarəçi redaktorda görsün. */
            if ($m === null) {
                $m = ['meta_line' => '', 'body' => '[[Mətn qurulmadı — bu vərəqi əl ilə yazın.]]'];
            }

            $content = QovluqBrief::bloklar(
                $m,
                (string) $d->name,
                (string) $d->blank_nov,
                (int) $d->sort,
                (string) $dossier->nomre(),
            );

            /* Kilidli vərəqin klaviatura ekranı üçün başlıq. */
            if ($d->is_locked) {
                $content['lockTitle'] = mb_substr((string) $d->name, 0, 60);
                $content['lockSub'] = 'Dörd rəqəmli kod';
            }

            $d->forceFill([
                'meta_line' => $m['meta_line'],
                'content'   => $content,
            ])->save();
        }

        $bitmis = $dossier->documents()->get()
            ->filter(static fn (DossierDocument $d): bool => ! isset(((array) $d->content)['ai_brief']))
            ->count();

        /* Bütün vərəqlər yazılandan SONRA kodun mənbələri dəqiqləşdirilir:
           model rəqəmləri hansı vərəqə qoyduğunu ƏVVƏLCƏDƏN söyləyir, amma
           mətni sonra yazır və sözünü tuta bilməz. Yoxlayıcı isə mənbələri
           hərfi-hərfinə yoxlayır, yəni yalan mənbə işi dərc olunmaz edərdi. */
        if ($bitmis >= $hamisi->count()) {
            $this->kodMenbeleri($dossier);
        }

        return ['done' => $bitmis, 'total' => $hamisi->count(), 'model' => $res['model']];
    }

    /**
     * Kodun rəqəmləri hansı vərəqə düşür.
     *
     * Skelet mərhələsi mənbə vərəqləri təyin edir; rəqəmlər onların arasında
     * NÖVBƏ İLƏ paylanır. Bu olmadan model rəqəmləri heç yerə qoymur və kilid
     * həll edilə bilmir — ipucu «rəqəmlər vərəqlərdə görünür» deyir, amma
     * görünmür.
     *
     * @return array<int,string>  vərəq sırası → rəqəm
     */
    protected function kilidReqemleri(Dossier $dossier): array
    {
        $kod = $dossier->codes()->first();

        if ($kod === null) {
            return [];
        }

        $menbe = $dossier->documents()->whereKey($kod->sourceIds())->pluck('sort')->all();
        $reqem = preg_split('//u', (string) $kod->code, -1, PREG_SPLIT_NO_EMPTY) ?: [];

        if ($menbe === [] || $reqem === []) {
            return [];
        }

        sort($menbe);
        $out = [];

        foreach ($reqem as $i => $r) {
            $sort = (int) $menbe[$i % count($menbe)];
            /* Bir vərəqə bir neçə rəqəm düşərsə, onlar birləşdirilir. */
            $out[$sort] = ($out[$sort] ?? '') . $r;
        }

        return $out;
    }

    /**
     * Kodun mənbə vərəqləri — İDDİADAN yox, MƏTNDƏN.
     *
     * Skelet mərhələsində model «rəqəmlər 2 və 3-cü vərəqdədir» deyir, amma
     * həmin vərəqlərin mətnini bir addım sonra yazır və çox vaxt sözünü
     * tutmur. Ona görə mənbələr sonda YENİDƏN HESABLANIR: kodun hər rəqəmi
     * hansı vərəqlərdə görünürsə, onlar mənbədir.
     *
     * Heç bir vərəqdə tapılmasa siyahı BOŞ qalır — o zaman yoxlayıcı «mənbə
     * göstərilməyib» qeydini verir (xəta yox) və idarəçi ya rəqəmləri mətnə
     * özü yerləşdirir, ya da kodu dəyişir. Yalan mənbə yazmaq isə işi dərc
     * olunmaz edərdi.
     */
    protected function kodMenbeleri(Dossier $dossier): void
    {
        $senedler = $dossier->documents()->get();

        foreach ($dossier->codes()->get() as $kod) {
            $reqemler = array_values(array_unique(
                preg_split('//u', (string) $kod->code, -1, PREG_SPLIT_NO_EMPTY) ?: []
            ));

            $menbe = [];

            foreach ($senedler as $d) {
                /* Kodun ÖZ vərəqi mənbə ola bilməz: rəqəmlər başqa yerdə
                   gizlənməlidir, yoxsa kilid mənasını itirir. */
                /* SONLUQ VƏRƏQLƏRİ də mənbə ola bilməz: onlar yalnız iş həll
                   olunandan sonra açılır, yəni kodu tapmaq üçün əvvəlcə kodu
                   tapmaq lazım gələrdi. */
                if ((int) $d->unlock_code_id === (int) $kod->id || $d->is_spoiler) {
                    continue;
                }

                $metn = self::senedMetni($d);

                /* DAİRƏYƏ ALINMIŞ rəqəmə üstünlük verilir. Adi rəqəm 24
                   vərəqin hamısında var (tarix, saat, nömrə) — belə mənbə
                   siyahısı «hər yerdə» deməkdir və ipucunu mənasız edir. */
                foreach ($reqemler as $r) {
                    if (mb_strpos($metn, '%%' . $r . '%%') !== false) {
                        $menbe[] = (int) $d->id;

                        break;
                    }
                }
            }

            /* Siyahı yalnız BÜTÜN rəqəmlər tapılanda yazılır — yarımçıq
               mənbə də yoxlayıcı üçün yalandır. */
            $govde = '';

            foreach ($senedler->whereIn('id', $menbe) as $d) {
                $govde .= "\n" . self::senedMetni($d);
            }

            foreach ($reqemler as $r) {
                if (mb_strpos($govde, $r) === false) {
                    $menbe = [];

                    break;
                }
            }

            $kod->forceFill(['source_document_ids' => array_values(array_unique($menbe))])->save();
        }
    }

    /**
     * Vərəqin axtarıla bilən mətni.
     *
     * `QovluqYoxlayici::senedMetni()` ilə EYNİ olmalıdır: yalnız `body` və
     * `content.bloklar`. Möhür qatı və kağız effektləri də rəqəm daşıyır —
     * onları saymaq mənbə siyahısını YALAN edərdi, çünki yoxlayıcı onlara
     * baxmır və eyni rəqəmi orada tapa bilməzdi.
     */
    protected static function senedMetni(DossierDocument $d): string
    {
        $metn = (string) $d->body;
        $bloklar = (array) (((array) $d->content)['bloklar'] ?? []);

        array_walk_recursive($bloklar, static function ($v) use (&$metn): void {
            if (is_scalar($v)) {
                $metn .= "\n" . $v;
            }
        });

        return $metn;
    }

    /* ----------------------------------------------------------------
     | Daxili
     |---------------------------------------------------------------- */

    /**
     * @param array<string,mixed> $schema
     * @return array{raw:array<string,mixed>,model:string,stat:array<string,mixed>}
     */
    protected function cagir(string $user, array $schema, ?int $token = null, ?int $timeout = null): array
    {
        $basladi = microtime(true);

        if (! $this->enabled()) {
            throw new RuntimeException('AI köməkçisi bağlıdır: `.env` faylına OPENAI_API_KEY yazın.');
        }

        $model = $this->ai->model();

        $client = $this->client ?? new OpenAiClient(
            (string) config('ai.key'),
            (string) config('ai.endpoint'),
            $timeout ?? (int) config('ai.timeout'),
        );

        $res = $client->chat([
            ['role' => 'system', 'content' => QovluqBrief::system()],
            ['role' => 'user',   'content' => $user],
        ], [
            'model'                 => $model,
            'max_completion_tokens' => $token ?? (int) config('ai.max_output_tokens'),
            'temperature'           => config('ai.temperature'),
            'response_format'       => ['type' => 'json_schema', 'json_schema' => $schema],
        ]);

        return [
            'raw'   => $this->decode($res['text']),
            'model' => $res['model'] !== '' ? $res['model'] : $model,
            /* Loga düşən ölçülər: hansı model, neçə token, neçə saniyə.
               Qurma bir neçə dəqiqə çəkir və brauzerdə yalnız göstərici var —
               nəyin nə qədər çəkdiyini yalnız log deyir. */
            'stat'  => [
                'model'   => $res['model'] !== '' ? $res['model'] : $model,
                'saniye'  => round(microtime(true) - $basladi, 1),
                'token_in'  => (int) ($res['usage']['prompt_tokens'] ?? 0),
                'token_out' => (int) ($res['usage']['completion_tokens'] ?? 0),
                'atilan'  => $res['dropped'],
            ],
        ];
    }

    /** @return array<string,mixed> */
    protected function decode(string $text): array
    {
        $text = trim($text);

        if ($text === '') {
            throw new RuntimeException('Model boş cavab qaytardı. Təkrar cəhd edin.');
        }

        /* Bəzi modellər JSON-u ```json bloku ilə bükür. */
        if (str_starts_with($text, '```')) {
            $text = trim(preg_replace('/^```[a-z]*\s*|\s*```$/i', '', $text) ?? $text);
        }

        $json = json_decode($text, true);

        if (! is_array($json)) {
            throw new RuntimeException('Modelin cavabı oxunmadı. Təkrar cəhd edin.');
        }

        return $json;
    }

    /**
     * Moderasiya süzgəci — AI-nin çıxışı da mətndir.
     *
     * @param array<mixed> $data
     */
    protected function moderasiya(array $data): void
    {
        $words = Setting::get('banned_words', (string) config('zarafat.banned_words')) ?? '';
        $duz = [];

        array_walk_recursive($data, static function ($v) use (&$duz): void {
            if (is_string($v)) {
                $duz[] = $v;
            }
        });

        if ($duz !== [] && (new Moderation($words))->flagged(...$duz)) {
            throw new RuntimeException('Cavab moderasiya siyahısındakı ifadə daşıyır. Tapşırığı dəyişib təkrar cəhd edin.');
        }
    }

    /**
     * Qovluq, şübhəlilər, suallar, vərəqlər və kilid.
     *
     * @param array<string,mixed> $s
     * @param list<string> $problem
     */
    protected function qovluqYarat(array $s, string $cetinlik, int $say, array $problem, string $brief): Dossier
    {
        $slug = $this->bosSlug();

        $dossier = new Dossier([
            'slug'          => $slug,
            'no'            => Byuro::isNomresi($slug),
            'title'         => $s['title'] !== '' ? $s['title'] : 'Adsız iş',
            'blurb'         => $s['blurb'],
            'place'         => $s['place'],
            'period'        => $s['period'],
            'intro'         => $s['intro'],
            'badge'         => '',
            'difficulty'    => $cetinlik,
            'read_minutes'  => max(10, $say * 2),
            'price_credits' => (int) config('dossier.price_credits'),
            /* ÜZ QABIĞI MODELDƏN SORUŞULMUR. Qurum sətirləri, möhür və
               təyinat hüquqi qalxanın hissəsidir — `Byuro` sabitlərindən
               qurulur ki, model nə vaxtsa real nazirlik yazsa belə, blankın
               başlığı fiktiv qalsın. */
            'cover'         => $this->coverQur(),
            'meta'          => $this->metaQur($s),
            /* JSON sütunu TEL FORMATIDIR — `dossier.js` onu oxuyur.
               Cədvəl sətirləri aşağıda ayrıca yazılır. */
            'suspects'      => $s['suspects'],
            'chronology'    => $s['chronology'],
            'axis'          => $s['axis'],
            'solution'      => $s['solution'],
            'status'        => Dossier::STATUS_DRAFT,
            'sort'          => (int) Dossier::max('sort') + 1,
        ]);

        $dossier->save();

        /* Şübhəlilər — qatil işarəsi ilə. */
        foreach ($s['suspects'] as $i => $x) {
            DossierSuspect::query()->create($x + [
                'dossier_id' => $dossier->id,
                'is_culprit' => $i === $s['culprit'],
                'sort'       => $i + 1,
            ]);
        }

        foreach ($s['questions'] as $i => $q) {
            DossierQuestion::query()->create([
                'dossier_id'    => $dossier->id,
                'prompt'        => $q['prompt'],
                'options'       => $q['options'],
                'correct_index' => $q['correct'],
                'explanation'   => $q['explanation'],
                'sort'          => $i + 1,
            ]);
        }

        /* Kilid kodu — vərəqlərdən əvvəl, çünki vərəq ona istinad edir. */
        $kodId = null;

        if ($s['lock'] !== null) {
            $kod = DossierCode::query()->create([
                'dossier_id'          => $dossier->id,
                'code'                => $s['lock']['code'],
                'label'               => 'AI qurdu',
                'hint_note'           => $s['lock']['hint'],
                'source_document_ids' => [],
                'sort'                => 1,
            ]);

            $kodId = (int) $kod->id;
        }

        $xerite = [];

        foreach ($s['documents'] as $d) {
            $kilidli = $s['lock'] !== null && $s['lock']['doc'] === $d['no'];

            $sened = DossierDocument::query()->create([
                'dossier_id'     => $dossier->id,
                'sort'           => $d['no'],
                'page'           => $d['page'],
                'name'           => $d['name'],
                'kind'           => $d['kind'],
                'doc_type'       => $d['doc_type'],
                'blank_nov'      => $d['blank_nov'],
                'is_locked'      => $kilidli,
                'lock_kind'      => 'reqem',
                'lock_code'      => $kilidli ? $s['lock']['code'] : '',
                'lock_hint'      => $kilidli ? $s['lock']['hint'] : '',
                'unlock_code_id' => $kilidli ? $kodId : null,
                /* Vərəqin tapşırığı `content`-də saxlanılır: ikinci mərhələ
                   onu oxuyur. Render qatı bu açarı tanımır və görməzdən gəlir. */
                'content'        => ['ai_brief' => $d['brief']],
                'body'           => '',
            ]);

            $xerite[$d['no']] = (int) $sened->id;
        }

        $this->sonluqVereqleri($dossier, $s, count($s['documents']));

        /* Mənbə vərəqlər indi id-lərlə bağlanır. */
        if ($kodId !== null && $s['lock']['sources'] !== []) {
            DossierCode::query()->whereKey($kodId)->update([
                'source_document_ids' => json_encode(
                    array_values(array_filter(array_map(
                        static fn (int $n): ?int => $xerite[$n] ?? null,
                        $s['lock']['sources'],
                    ))),
                ),
            ]);
        }

        /* Tapşırıq və modelin problemləri qovluğun `meta`-sında qalmır —
           onlar idarəçi üçündür və `meta` oyunçuya gedir. `blurb` boşdursa
           tapşırığın özü müvəqqəti mətn olur. */
        if ($dossier->blurb === '') {
            $dossier->forceFill(['blurb' => mb_substr($brief, 0, 400)])->save();
        }

        $dossier->setAttribute('ai_problems', $problem);

        return $dossier;
    }

    /**
     * İşin sonluğu — qatilin dindirilməsi və məhkəmə qərarı.
     *
     * Bunlar skelet sxemində SORUŞULMUR. Səbəb: `skeletSchema()`-dakı
     * `documents` massivinin `minItems` və `maxItems` dəyəri istənilən vərəq
     * sayına bərabərdir — modelə «24 istəyirəm, 26 ver» demək olmaz. Halbuki
     * bu iki vərəqin TAPŞIRIĞI onsuz da bizdədir: qatil, motiv və sübut
     * skeletdə artıq var. Ona görə sətirlər burada qurulur, mətnini isə
     * `partiya()` qalan vərəqlər kimi doldurur — ayrıca axın yoxdur.
     *
     * `kilid_reqemi` onlara HEÇ VAXT verilmir (`kilidReqemleri()` yalnız
     * kodun mənbə vərəqlərinə baxır) və `kodMenbeleri()` onları atlayır.
     *
     * @param array<string,mixed> $s
     */
    protected function sonluqVereqleri(Dossier $dossier, array $s, int $say): void
    {
        $qatil = (string) ($s['suspects'][$s['culprit']]['name'] ?? '');
        $motiv = (string) ($s['questions'][1]['options'][0] ?? '');
        $subut = (string) ($s['questions'][2]['options'][0] ?? '');

        $vereqler = [
            [
                'name'      => 'Təqsirləndirilən şəxsin dindirilmə protokolu',
                'kind'      => 'Protokol',
                'doc_type'  => 'testimony',
                'blank_nov' => 'protokol',
                'brief'     => 'Qatilin — ' . $qatil . ' — etirafı. Sual-cavab formasında:'
                    . ' cinayəti necə hazırladığı, həmin gecə nə etdiyi, sonra izləri necə'
                    . ' gizlətməyə çalışdığı. Motiv: ' . $motiv . '. Onu ifşa edən sübut: '
                    . $subut . '. Ən azı beş sual-cavab cütü.',
            ],
            [
                'name'      => 'Məhkəmə qərarı',
                'kind'      => 'Qərar',
                'doc_type'  => 'protocol',
                'blank_nov' => 'mehkeme',
                'brief'     => $qatil . ' təqsirli bilinir. Əməlin təsviri, məhkəmənin'
                    . ' gəldiyi nəticə və AZADLIQDAN MƏHRUMETMƏ MÜDDƏTİ İLLƏRLƏ.'
                    . ' Digər şübhəlilər barəsində iş xitam edilir.',
            ],
        ];

        foreach ($vereqler as $i => $v) {
            $no = $say + $i + 1;

            /* `brief` sütun deyil — tapşırıq `content`-də yaşayır və
               `partiya()` onu oradan oxuyur. */
            $tapsiriq = $v['brief'];
            unset($v['brief']);

            DossierDocument::query()->create($v + [
                'dossier_id' => $dossier->id,
                'sort'       => $no,
                'page'       => (string) $no,
                'is_spoiler' => true,
                'lock_kind'  => 'reqem',
                'content'    => ['ai_brief' => $tapsiriq],
                'body'       => '',
            ]);
        }
    }

    /**
     * Üz qabığı — `Byuro` sabitlərindən, modeldən yox.
     *
     * @return array<string,mixed>
     */
    protected function coverQur(): array
    {
        return [
            'org'        => Byuro::qurumSetirleri(),
            'kind'       => 'İSTİNTAQ MATERİALI',
            'opened'     => 'AÇILDI',
            'stamp'      => Byuro::MOHUR,
            'assign'     => ['İstintaq qrupunun rəhbəri', Byuro::QISA . ' müstəntiqi'],
            'paperHead'  => [Byuro::AD, Byuro::QISA . ' · İSTİNTAQ BÖLMƏSİ'],
            'closeStamp' => ['İŞ', 'BAĞLANDI'],
        ];
    }

    /**
     * @param array<string,mixed> $s
     * @return list<array{0:string,1:string}>
     */
    protected function metaQur(array $s): array
    {
        $out = [];

        if ($s['place'] !== '') {
            $out[] = ['Yer', $s['place']];
        }

        if ($s['period'] !== '') {
            $out[] = ['Tarix', $s['period']];
        }

        $out[] = ['Vərəq sayı', (string) count($s['documents'])];

        return $out;
    }

    /** İstifadə olunmayan slug. `Admin\DossierController::bosSlug()` ilə eyni qayda. */
    protected function bosSlug(): string
    {
        $il = (int) date('Y');

        for ($i = 1; $i < 9999; $i++) {
            $slug = $il . '-' . str_pad((string) $i, 4, '0', STR_PAD_LEFT);

            if (! Dossier::withTrashed()->where('slug', $slug)->exists()) {
                return $slug;
            }
        }

        throw new RuntimeException('Boş iş nömrəsi tapılmadı.');
    }
}
