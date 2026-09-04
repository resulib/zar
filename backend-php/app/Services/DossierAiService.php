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

        $res = $this->cagir(
            QovluqBrief::skeletUser($brief, $say, $cetinlik),
            QovluqBrief::skeletSchema($say),
        );

        ['skelet' => $s, 'problems' => $problem] = QovluqBrief::normalizeSkelet($res['raw'], $say);

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
        $qalan = $hamisi->filter(static fn (DossierDocument $d): bool => trim((string) $d->body) === '');

        if ($qalan->isEmpty()) {
            return ['done' => $hamisi->count(), 'total' => $hamisi->count(), 'model' => ''];
        }

        $partiya = $qalan->take(QovluqBrief::PARTIYA);
        $plan = [];

        foreach ($partiya as $d) {
            $plan[] = [
                'no'        => (int) $d->sort,
                'name'      => (string) $d->name,
                'kind'      => (string) $d->kind,
                'blank_nov' => (string) $d->blank_nov,
                'brief'     => (string) (((array) $d->content)['ai_brief'] ?? ''),
            ];
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

        foreach ($partiya as $d) {
            $m = $metnler[(int) $d->sort] ?? null;

            if ($m === null || $m['body'] === '') {
                /* Model bu vərəqi buraxıb. Boş qalsa, növbəti partiya onu
                   yenidən istəyər və dövrə bağlanardı — ona görə bir sətir
                   yazılır və idarəçi onu redaktorda görür. */
                $d->forceFill(['body' => '[[Mətn qurulmadı — bu vərəqi əl ilə yazın.]]'])->save();

                continue;
            }

            $d->forceFill(['meta_line' => $m['meta_line'], 'body' => $m['body']])->save();
        }

        $bitmis = $dossier->documents()->get()
            ->filter(static fn (DossierDocument $d): bool => trim((string) $d->body) !== '')
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
                if ((int) $d->unlock_code_id === (int) $kod->id) {
                    continue;
                }

                foreach ($reqemler as $r) {
                    if (mb_strpos((string) $d->body, $r) !== false) {
                        $menbe[] = (int) $d->id;

                        break;
                    }
                }
            }

            /* Siyahı yalnız BÜTÜN rəqəmlər tapılanda yazılır — yarımçıq
               mənbə də yoxlayıcı üçün yalandır. */
            $govde = '';

            foreach ($senedler->whereIn('id', $menbe) as $d) {
                $govde .= "\n" . $d->body;
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

    /* ----------------------------------------------------------------
     | Daxili
     |---------------------------------------------------------------- */

    /**
     * @param array<string,mixed> $schema
     * @return array{raw:array<string,mixed>,model:string}
     */
    protected function cagir(string $user, array $schema): array
    {
        if (! $this->enabled()) {
            throw new RuntimeException('AI köməkçisi bağlıdır: `.env` faylına OPENAI_API_KEY yazın.');
        }

        $model = $this->ai->model();

        $client = $this->client ?? new OpenAiClient(
            (string) config('ai.key'),
            (string) config('ai.endpoint'),
            (int) config('ai.timeout'),
        );

        $res = $client->chat([
            ['role' => 'system', 'content' => QovluqBrief::system()],
            ['role' => 'user',   'content' => $user],
        ], [
            'model'                 => $model,
            'max_completion_tokens' => (int) config('ai.max_output_tokens'),
            'temperature'           => config('ai.temperature'),
            'response_format'       => ['type' => 'json_schema', 'json_schema' => $schema],
        ]);

        return [
            'raw'   => $this->decode($res['text']),
            'model' => $res['model'] !== '' ? $res['model'] : $model,
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
