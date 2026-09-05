<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Dossier;
use App\Models\DossierDocument;
use App\Models\DossierEnding;
use App\Models\DossierImage;
use App\Models\DossierProgress;
use App\Models\Setting;
use App\Models\User;
use App\Support\Dossier\Dossier as Kod;
use App\Support\Dossier\Rey;
use App\Support\Moderation;
use App\Support\Sanitizer;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * İş qovluğu bölməsinin bütün yazıları.
 *
 * İki qayda buradan çıxmır:
 *   1. Sirr serverdə qalır. Kilidin kodu və düzgün cavab heç bir metodun
 *      qaytardığı massivə düşmür; müqayisə yalnız burada aparılır.
 *   2. Vaxt serverdə sayılır. `started_at` bazadadır, `duration_seconds`
 *      burada hesablanır — brauzerdəki sayğac yalnız göstərmə üçündür.
 */
class DossierService
{
    /** @var array<int,list<int>> qovluq id → vərəq id-ləri, sıra ilə */
    protected array $sira = [];

    public function __construct(
        private readonly CreditService $credits,
        private readonly SenedRender $render,
        private readonly RankService $ranks,
    ) {
    }

    public function find(string $slug): ?Dossier
    {
        return Kod::isSlug($slug)
            ? Dossier::published()->where('slug', $slug)->first()
            : null;
    }

    /** Ziyarətçinin bu qovluq üzrə irəliləyişi. Yoxdursa `null` — sətir yaradılmır. */
    public function progress(User $user, Dossier $dossier): ?DossierProgress
    {
        return DossierProgress::query()
            ->where('dossier_id', $dossier->id)
            ->where('user_id', $user->id)
            ->first();
    }

    public function hasAccess(User $user, Dossier $dossier): bool
    {
        return $this->progress($user, $dossier)?->hasAccess() === true;
    }

    /**
     * Qovluğu açır: adı yazır, lazımsa krediti xərcləyir, sayğacı başladır.
     *
     * `DocumentService::publish()` ilə eyni idempotentlik: giriş artıq
     * verilibsə kredit ikinci dəfə silinmir və istifadəçi qovluğa istədiyi
     * qədər qayıda bilər.
     *
     * @throws \RuntimeException moderation | no_credits
     */
    public function open(User $user, Dossier $dossier, mixed $ad): DossierProgress
    {
        $investigator = Sanitizer::person($ad, (int) config('dossier.limits.investigator'));

        if ($investigator !== '' && $this->moderation()->flagged($investigator)) {
            throw new \RuntimeException('moderation');
        }

        return DB::transaction(function () use ($user, $dossier, $investigator): DossierProgress {
            /** @var DossierProgress $p */
            $p = DossierProgress::query()->firstOrNew([
                'dossier_id' => $dossier->id,
                'user_id'    => $user->id,
            ]);

            if ($investigator !== '') {
                $p->investigator = $investigator;
            }

            if ($p->hasAccess()) {
                $p->save();

                return $p;
            }

            $qiymet = (int) $dossier->price_credits;

            if ($qiymet > 0) {
                // `transactions.document_id` sənədə bağlıdır — qovluq qeyddə göstərilir.
                $this->credits->spend($user, $qiymet, null, 'İş qovluğu: ' . $dossier->no);
            }

            $p->forceFill([
                'access_at'  => Carbon::now(),
                'started_at' => $p->started_at ?? Carbon::now(),
            ])->save();

            return $p;
        });
    }

    /* ----------------------------------------------------------------
     | Sənədlər
     |---------------------------------------------------------------- */

    public function document(Dossier $dossier, int $id): ?DossierDocument
    {
        return $dossier->documents()->whereKey($id)->first();
    }

    public function isUnlocked(DossierProgress $p, DossierDocument $doc): bool
    {
        return ! $doc->is_locked || $p->marked('unlocked_ids', (int) $doc->id);
    }

    /**
     * SIRA QAPISI — vərəq yalnız ondan əvvəlkilərin hamısı keçiləndən sonra açılır.
     *
     * Qovluq hekayədir: 28-ci vərəqi birinci açan adam işi oxumur, cavabı
     * axtarır. Qapı SERVERDƏDİR, çünki `dossier.js`-dəki eyni qayda yalnız
     * görünüşdür — `/api/is/{slug}/sened/{id}` birbaşa da çağırıla bilər.
     *
     * KODLA BAĞLI VƏRƏQ SIRANI DAYANDIRMIR: onu «keçmək» üçün klaviaturanı
     * görmək kifayətdir və `markRead()` onu elə orada oxunmuş sayır. Əks halda
     * kodu hələ tapmamış adam qovluğun qalanını heç vaxt görə bilməzdi —
     * yəni bir tapmaca bütün hekayəni bağlayardı.
     */
    public function reachable(Dossier $dossier, DossierDocument $doc, DossierProgress $p): bool
    {
        /* İŞİN SONLUĞU. Bu qapı AÇIQ yazılmalıdır: aşağıdakı döngə sənədi
           sırada tapmasa `true` qaytarır, yəni spoiler vərəqi sıradan
           çıxarmaq onu hamıya AÇARDI. */
        if ($doc->is_spoiler) {
            return (bool) $p->solved || (bool) $p->revealed;
        }

        $read = $p->ids('read_ids');

        foreach ($this->orderedIds($dossier) as $id) {
            if ($id === (int) $doc->id) {
                return true;
            }

            if (! in_array($id, $read, true)) {
                return false;
            }
        }

        /* Sənəd bu qovluğa aid deyilsə buraya düşür — çağıran onsuz da yoxlayır. */
        return true;
    }

    /**
     * Bütün vərəqlər keçilibmi. Şübhəlilər lenti və yekun rəy bundan sonra açılır:
     * işi oxumadan verilən rəy təxmindir, oyun isə təxmin oyunu deyil.
     */
    public function allRead(Dossier $dossier, DossierProgress $p): bool
    {
        $read = $p->ids('read_ids');

        foreach ($this->orderedIds($dossier) as $id) {
            if (! in_array($id, $read, true)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Vərəq id-ləri sıra ilə. Bir sorğudur və eyni istək daxilində təkrarlanmır —
     * `reachable()` hər sənəd açılışında çağırılır.
     *
     * @return list<int>
     */
    protected function orderedIds(Dossier $dossier): array
    {
        $k = (int) $dossier->id;

        if (! isset($this->sira[$k])) {
            /* SPOILER VƏRƏQLƏR SIRAYA DÜŞMÜR və bu, məcburidir: `allRead()`
               bütün sıranın oxunmasını tələb edir, `/rey` və `/sonluq` isə
               `allRead()` qapısındadır. Onlar sıraya düşsəydi, oyunçu həmin
               vərəqləri oxumadan rəy verə bilməzdi — onlar isə yalnız rəydən
               SONRA açılır. Oyun dayanardı. */
            $this->sira[$k] = array_map('intval', $dossier->documents()
                ->where('is_spoiler', false)->pluck('id')->all());
        }

        return $this->sira[$k];
    }

    /**
     * Sənədin HTML gövdəsi. Yalnız bu metod məzmunu brauzerə buraxır.
     *
     * Sənəd şablon deyil: `body` sahəsi doludursa mətn oxunur və içindəki
     * `{{ sekil:… }}` / `{{ blok:… }}` nişanları açılır, boşdursa köhnə yol —
     * `content.bloklar` ardıcıllığı — işləyir. İkinci yol mövcud 84 vərəqi
     * bayt-bayt eyni saxlayır; nə vaxtsa hamısı birinci yola köçürülə bilər.
     */
    public function renderDocument(
        Dossier $dossier,
        DossierDocument $doc,
        DossierProgress $p,
        bool $admin = false
    ): string
    {
        $bagli = ! $this->isUnlocked($p, $doc);
        $c = (array) $doc->content;
        $kagiz = (array) ($c['kagiz'] ?? []);
        $vals = $this->vals($p);

        /* Şəkillər BİR sorğu ilə yığılır və HƏR İKİ yola verilir: mətn
           rejimində `{{ sekil:… }}` nişanı, blok rejimində isə maddi sübut
           kartoçkaları onlara müraciət edir. */
        $sekiller = $dossier->images()->get()->keyBy('slug')->all();

        return view('dossier.sened', [
            'dossier'    => $dossier,
            'doc'        => $doc,
            'c'          => $c,
            'bloklar'    => array_values((array) ($c['bloklar'] ?? [])),
            'govde'      => $bagli ? null : $this->govde($dossier, $doc, $vals, $sekiller, $admin),
            'sekiller'   => $sekiller,
            'slug'       => (string) $dossier->slug,
            'blankNov'   => $this->blankNov($doc),
            'kagiz'      => $kagiz,
            'kagizSinif' => self::kagizSinif($kagiz),
            'egilme'     => isset($kagiz['egilme']) ? (float) $kagiz['egilme'] : null,
            'mohurler'   => array_values((array) ($c['mohurler'] ?? [])),
            'head'       => array_values((array) (($dossier->cover['paperHead'] ?? []) ?: [])),
            'vals'       => $vals,
            'bagli'      => $bagli,
        ])->render();
    }

    /**
     * Mətn rejimində gövdə. `null` — köhnə blok yolu işləsin.
     *
     * @param array<string,string> $vals
     * @param array<string,\App\Models\DossierImage> $sekiller
     */
    protected function govde(
        Dossier $dossier,
        DossierDocument $doc,
        array $vals,
        array $sekiller,
        bool $admin
    ): ?string {
        if ($doc->govde() === null) {
            return null;
        }

        /* Açarlanmış bloklar — `{{ blok:acar }}` nişanının hədəfi. Açarsızlar
           bura düşmür: onlar yalnız köhnə sıra ilə render yolunda mənalıdır. */
        $bloklar = [];

        foreach ((array) (((array) $doc->content)['bloklar'] ?? []) as $b) {
            if (is_array($b) && isset($b['acar']) && is_string($b['acar'])) {
                $bloklar[$b['acar']] = $b;
            }
        }

        return $this->render->render($doc, (string) $dossier->slug, $sekiller, $bloklar, $vals, $admin);
    }

    /**
     * Mətn rejimində letterhead növü.
     *
     * Dəyər komponent adına çevrilir, ona görə ağ siyahıdan MÜTLƏQ keçir —
     * yoxlanmamış dəyər `<x-dynamic-component>`-ə ixtiyari görünüş render
     * etdirərdi. Blok rejimində boşdur: letterhead orada `blank` blokunun
     * özündədir və ikinci dəfə çəkilməməlidir.
     */
    protected function blankNov(DossierDocument $doc): string
    {
        if ($doc->govde() === null) {
            return '';
        }

        return Sanitizer::pick(
            (string) $doc->blank_nov,
            (array) config('dossier.blank_novleri', []),
            'resmi'
        );
    }

    /**
     * Şəkil faylının diskdəki yolu — YA DA `null`.
     *
     * `null` çağıranda 404-ə çevrilir. «İcazə yoxdur» mesajı verilmir, çünki
     * mesajın ÖZÜ spoylerdir: «bu şəkil kilidli sənəddədir» cümləsi oyunçuya
     * hələ tapmadığı bir vərəqin varlığını bildirir.
     *
     * Üç qapı var və üçü də keçilməlidir:
     *   1. Şəkil bu qovluğa aiddir.
     *   2. Ya nümunə vərəqin şəklidir (ödənişsiz), ya da qovluq açılıb.
     *   3. Sahibi kilidli vərəqdirsə, kod açılıb.
     *
     * Sahibi olmayan şəkil qovluğun ümumi materialıdır və ödəniş tələb edir:
     * əks halda id-ləri sırayla yoxlayan adam bütün kitabxananı ödənişsiz
     * görərdi.
     */
    public function imagePath(
        Dossier $dossier,
        DossierImage $sekil,
        ?DossierProgress $p,
        string $olcu,
        bool $admin = false
    ): ?string {
        if ((int) $sekil->dossier_id !== (int) $dossier->id) {
            return null;
        }

        if (! $admin) {
            $owner = $sekil->owner_document_id === null
                ? null
                : $this->document($dossier, (int) $sekil->owner_document_id);

            /* Sonluq vərəqinin şəkli də sonluqla birlikdə açılır — yoxsa
               girişi olan hər kəs onu id sırası ilə görə bilərdi. */
            if ($owner !== null && $owner->is_spoiler
                && ! ((bool) $p?->solved || (bool) $p?->revealed)) {
                return null;
            }

            $numune = $owner !== null && $owner->is_sample && ! $owner->is_locked;

            if (! $numune) {
                if ($p === null || ! $p->hasAccess()) {
                    return null;
                }

                if ($owner !== null && $owner->is_locked && ! $this->isUnlocked($p, $owner)) {
                    return null;
                }
            }
        }

        return $this->sekilFayli($sekil, $olcu);
    }

    /**
     * Diskdəki fayl. Ad bazadan gəlir, amma yenə də formatı yoxlanılır —
     * yol quraşdıran hər sətir traversal namizədidir və yoxlama ucuzdur.
     */
    protected function sekilFayli(DossierImage $sekil, string $olcu): ?string
    {
        $ad = $sekil->pathFor($olcu);

        if (preg_match('#^[0-9]+/[a-f0-9]{32}\.jpg$#', $ad) !== 1) {
            return null;
        }

        $path = rtrim((string) config('dossier.sekil.path'), '/') . '/' . $ad;

        return is_file($path) ? $path : null;
    }

    /** Kağızın CSS sinifləri — dərəcə bildirən effektlər sinif kimi verilir. */
    public static function kagizSinif(array $kagiz): string
    {
        $s = [];

        foreach (['kohnelme', 'kseroks'] as $k) {
            $v = (int) ($kagiz[$k] ?? 0);
            if ($v > 0) {
                $s[] = 'kagiz-' . $k . '-' . min(3, $v);
            }
        }

        if (! empty($kagiz['cirilma'])) {
            $s[] = 'kagiz-cirilma-' . $kagiz['cirilma'];
        }

        return implode(' ', $s);
    }

    /** Sənəd mətnindəki `{{açar}}` əvəzləmələri. @return array<string,string> */
    public function vals(DossierProgress $p): array
    {
        return [
            'mustentiq' => (string) ($p->investigator !== '' ? $p->investigator : '—'),
        ];
    }

    /**
     * Nümunə vərəqin ödənişsiz render olunması.
     *
     * Ana səhifə həqiqi sənəd göstərir — şəkil deyil, saytın öz render qatı.
     * Ona görə giriş yoxlamasından kənar bir yol lazımdır, AMMA o yol yalnız
     * `is_sample` işarəli sənədə açılır: qalanları üçün boş sətir qaytarır.
     * Belədə səhvən yazılmış bir sənəd nömrəsi bütün qovluğu pulsuz etmir.
     */
    public function renderPublic(Dossier $dossier, DossierDocument $doc): string
    {
        if (! $doc->is_sample || $doc->is_locked || $doc->is_spoiler
            || (int) $doc->dossier_id !== (int) $dossier->id) {
            return '';
        }

        /* Keçici irəliləyiş: bazaya yazılmır, yalnız `{{mustentiq}}` əvəzləməsi
           və «kilidli deyil» qərarı üçün lazımdır. */
        $p = new DossierProgress([
            'dossier_id'   => $dossier->id,
            'investigator' => '',
        ]);

        return $this->renderDocument($dossier, $doc, $p);
    }

    /** Ana səhifədə göstərilən vərəqlər, sıra ilə. */
    public function samples(Dossier $dossier): \Illuminate\Support\Collection
    {
        return $dossier->samples()->get();
    }

    public function markRead(DossierProgress $p, DossierDocument $doc): void
    {
        if ($p->mark('read_ids', (int) $doc->id)) {
            $p->save();
        }
    }

    public function togglePin(DossierProgress $p, DossierDocument $doc): bool
    {
        $on = $p->toggle('pinned_ids', (int) $doc->id);
        $p->save();

        return $on;
    }

    /**
     * Kilidin açılması.
     *
     * Kod heç bir cavabda geri qayıtmır və müqayisə `hash_equals` ilə aparılır.
     * Əsl qorunma isə `throttle:dossier-kilid` limitidir: dörd rəqəm onsuz
     * dəqiqələr içində sınanıb tapılardı.
     */
    public function unlock(DossierProgress $p, DossierDocument $doc, mixed $kod): bool
    {
        $gozlenen = (string) $doc->lock_code;
        $verilen = preg_replace('/\D+/', '', is_scalar($kod) ? (string) $kod : '') ?? '';

        if ($gozlenen === '' || ! hash_equals($gozlenen, $verilen)) {
            return false;
        }

        if ($p->mark('unlocked_ids', (int) $doc->id)) {
            $p->save();
        }

        return true;
    }

    /* ----------------------------------------------------------------
     | Yekun rəy
     |---------------------------------------------------------------- */

    /**
     * Rəyi yoxlayır və irəliləyişi yeniləyir.
     *
     * Qaytarılan massivdə HANSI BƏNDİN səhv olduğu yoxdur — üç cəhdlə
     * variantları bir-bir yoxlamağı mümkünsüz edən yeganə şey budur.
     *
     * @return array{ok:bool,tam:bool,attempts:int,left:int,solved:bool,revealed:bool,
     *               minutes:int|null,pinned:int,certToken:string|null,solution:list<string>|null}
     */
    public function submit(Dossier $dossier, DossierProgress $p, array $cavablar): array
    {
        $duzgun = $dossier->questions()->pluck('correct_index')->map('intval')->all();
        $netice = Rey::yoxla($cavablar, $duzgun);

        if ($p->solved || $p->revealed) {
            // Oyun onsuz da bitib: yeni cəhd sayılmır, nəticə saxlanılır.
            return $this->neticeArray($p, $dossier, $p->solved, true);
        }

        if (! $netice['tam']) {
            return $this->neticeArray($p, $dossier, false, false);
        }

        $evvel = (bool) $p->solved;
        $p->attempts = (int) $p->attempts + 1;

        if ($netice['ok']) {
            $p->solved = true;
            $p->finished_at = Carbon::now();
            $p->duration_seconds = $p->started_at === null
                ? null
                : (int) max(0, (int) $p->started_at->diffInSeconds($p->finished_at));
            $p->cert_token = $p->cert_token ?: $this->newCertToken();
        } elseif ($p->attemptsLeft() <= 0) {
            $p->revealed = true;
        }

        $p->save();

        /* XP KEÇİD ANINDA verilir — `false → true`.
           Sətrin özünə baxmaq kifayət deyil: metod ikinci dəfə çağırılanda
           `solved` onsuz da doğrudur. Yuxarıdakı erkən qayıdış birinci
           sipərdir, bu şərt ikincisi, `case_completions`-un unikal indeksi
           isə üçüncüsü.

           Səhv ittiham sayı `attempts - 1`-dir: uğurlu cəhd səhv deyil, və
           `attempts` yalnız forma TAM olduqda artdığı üçün yarımçıq
           göndərmə xala dəymir. */
        if (! $evvel && $p->solved) {
            $this->ranks->awardForCase($p, $dossier, max(0, (int) $p->attempts - 1));
        } elseif ($p->revealed) {
            // Bağlanmadı: xal yoxdur, amma cəhd profildə görünməlidir.
            $this->ranks->recordAttempt($p, $dossier, (int) $p->attempts);
        }

        return $this->neticeArray($p, $dossier, $netice['ok'], true);
    }

    /** @return array<string,mixed> */
    /**
     * Şübhəli seçimi — sonluq rejiminin yekunu.
     *
     * REJİM TÖRƏMƏDİR: işin `dossier_endings` sətri varsa oyunçu şübhəli seçir,
     * yoxsa köhnə üç suallıq rəy formasını doldurur. Ayrıca sütun bir də
     * sinxronda saxlanılası dəyər olardı və mövcud üç iş səhvən yeni axına
     * düşərdi.
     *
     * Cəhd limiti YOXDUR — hər şübhəlinin öz sonluğu var və onları oxumaq
     * oyunun bir hissəsidir. Amma vərəqləri keçmək şərti qalır: işi oxumadan
     * verilən qərar təxmindir.
     *
     * `reveal_text` yalnız DOĞRU sonluqda qaytarılır (modelin `$hidden`-indədir):
     * səhv seçim edən oyunçu hekayənin açılışını görməməlidir.
     *
     * @return array<string,mixed>
     * @throws \RuntimeException `bad_suspect`
     */
    public function chooseSuspect(Dossier $dossier, DossierProgress $p, mixed $subheliId): array
    {
        $id = (int) $subheliId;

        $ending = DossierEnding::query()
            ->where('dossier_id', $dossier->id)
            ->where('suspect_id', $id)
            ->first();

        if ($ending === null) {
            throw new \RuntimeException('bad_suspect');
        }

        $p->chosen_suspect_id = $id;

        /* SƏHV İTTİHAM hər çağırışda yazılır, yalnız udan seçimdə yox.
           Siyahı TƏKRARSIZDIR: cəhd limiti olmadığı və hər sonluğu oxumaq
           oyunun bir hissəsi olduğu üçün eyni şübhəlini ikinci dəfə seçmək
           bir səhvdir, iki yox. */
        if (! $ending->is_true_ending) {
            $p->mark('wrong_suspect_ids', $id);
        }

        $evvel = (bool) $p->solved;

        if ($ending->is_true_ending && ! $p->solved) {
            $p->solved = true;
            $p->finished_at = Carbon::now();
            $p->duration_seconds = $p->started_at === null
                ? null
                : (int) max(0, (int) $p->started_at->diffInSeconds($p->finished_at));
            $p->cert_token = $p->cert_token ?: $this->newCertToken();
        }

        $p->save();

        // `submit()` ilə eyni keçid qapısı.
        if (! $evvel && $p->solved) {
            $this->ranks->awardForCase($p, $dossier, count($p->ids('wrong_suspect_ids')));
        }

        return [
            'ok'        => true,
            'dogru'     => (bool) $ending->is_true_ending,
            'subheli'   => $id,
            'verdict'   => (string) $ending->verdict_text,
            'sting'     => (string) $ending->sting_line,
            'reveal'    => $ending->is_true_ending ? (string) $ending->reveal_text : null,
            'minutes'   => $p->solved ? Kod::deqiqe($p->duration_seconds) : null,
            'certToken' => $p->solved ? (string) $p->cert_token : null,
            /* Sonluq rejimində `revealed` heç vaxt qoyulmur (cəhd limiti
               yoxdur), ona görə şərt yalnız `solved`-dır. */
            'spoilers'  => $p->solved ? $this->spoilerDocs($dossier) : [],
            'state'     => $p->toStateArray(),
        ];
    }

    /**
     * «Yenidən oyna» — YALNIZ seçim sıfırlanır.
     *
     * Açılmış kodlar, oxunmuş vərəqlər və girişin özü toxunulmur: oyunçu
     * tapdığı kodu ikinci dəfə axtarmamalıdır. Həll olunmuş iş də həll olunmuş
     * qalır — sertifikat geri alınmır.
     */
    public function replay(DossierProgress $p): DossierProgress
    {
        /* `wrong_suspect_ids` QƏSDƏN TƏMİZLƏNMİR — açılmış kodlar və
           sertifikatla eyni qayda. Təmizlənsəydi, doğru şübhəlini seçməzdən
           əvvəl bir «yenidən oyna» ilə həm −10 cəzasını, həm də ilk-cəhd
           bonusunu bədavaya almaq olardı. */
        if ($p->chosen_suspect_id !== null) {
            $p->chosen_suspect_id = null;
            $p->save();
        }

        return $p;
    }

    /**
     * Oyunçuya göndərilən sonluq siyahısı — MƏTNSİZ.
     *
     * Yalnız hansı şübhəlilərin sonluğu olduğu bildirilir; hökm mətni seçim
     * ediləndən sonra, `chooseSuspect()` cavabında gəlir. Bütün mətnləri
     * qabaqcadan göndərmək oyunun sonunu DevTools açan hər kəsə verərdi.
     *
     * @return list<int>
     */
    public function endingSuspectIds(Dossier $dossier): array
    {
        return array_values(array_map('intval', $dossier->endings()->pluck('suspect_id')->all()));
    }

    /**
     * İşin sonluğu — yalnız həll olunandan (və ya cəhdlər bitəndən) sonra.
     *
     * Siyahı `toListArray()` şəklindədir ki, qabıq onları materiallar
     * sətirləri kimi çəkə bilsin; sənədin ÖZÜ isə mövcud uc nöqtədən gəlir
     * (`GET /api/is/{slug}/sened/{id}`) və `reachable()` qapısından keçir.
     *
     * @return list<array<string,mixed>>
     */
    public function spoilerDocs(Dossier $dossier): array
    {
        return $dossier->documents()->where('is_spoiler', true)->get()
            ->map(static fn (DossierDocument $d): array => $d->toListArray(true))
            ->all();
    }

    protected function neticeArray(DossierProgress $p, Dossier $dossier, bool $ok, bool $tam): array
    {
        $acildi = $p->solved || $p->revealed;

        return [
            'ok'        => $ok,
            'tam'       => $tam,
            'attempts'  => (int) $p->attempts,
            'left'      => $p->attemptsLeft(),
            'solved'    => (bool) $p->solved,
            'revealed'  => (bool) $p->revealed,
            'minutes'   => $p->solved ? Kod::deqiqe($p->duration_seconds) : null,
            'pinned'    => count($p->ids('pinned_ids')),
            'certToken' => $p->solved ? (string) $p->cert_token : null,
            'solution'  => $acildi ? array_values(array_map('strval', (array) $dossier->solution)) : null,
            'spoilers'  => $acildi ? $this->spoilerDocs($dossier) : [],
        ];
    }

    protected function newCertToken(): string
    {
        do {
            $t = Kod::token();
        } while (DossierProgress::query()->where('cert_token', $t)->exists());

        return $t;
    }

    /* ----------------------------------------------------------------
     | Sertifikat şəkli
     |---------------------------------------------------------------- */

    /**
     * Brauzerdə çəkilmiş sertifikat şəkli.
     *
     * Serverdə şəkil boru xətti yoxdur (imagick quraşdırılmayıb), üstəlik
     * belədə şəkil tam olaraq istifadəçinin gördüyü sertifikatdır. Fayl
     * public kökdən KƏNARDA saxlanılır, kontroller sabit başlıqla axıdır.
     *
     * @throws \RuntimeException bad_image | not_solved
     */
    public function storeCert(DossierProgress $p, string $binary): DossierProgress
    {
        if (! $p->solved || ! $p->cert_token) {
            throw new \RuntimeException('not_solved');
        }

        $cfg = (array) config('dossier.cert');

        if ($binary === '' || strlen($binary) > (int) $cfg['max_bytes']) {
            throw new \RuntimeException('bad_image');
        }

        $info = @getimagesizefromstring($binary);

        if ($info === false
            || ($info[2] ?? 0) !== IMAGETYPE_JPEG
            || (int) $info[0] !== (int) $cfg['width']
            || (int) $info[1] !== (int) $cfg['height']) {
            throw new \RuntimeException('bad_image');
        }

        /* GD varsa şəkil yenidən kodlaşdırılır: bu, JPEG-in içinə yerləşdirilmiş
           hər şeyi (metadata, artıq baytlar) atır. */
        if (function_exists('imagecreatefromstring')) {
            $im = @imagecreatefromstring($binary);

            if ($im === false) {
                throw new \RuntimeException('bad_image');
            }

            ob_start();
            imagejpeg($im, null, 88);
            $binary = (string) ob_get_clean();
            imagedestroy($im);
        }

        $dir = (string) $cfg['path'];

        if (! is_dir($dir) && ! @mkdir($dir, 0775, true) && ! is_dir($dir)) {
            throw new \RuntimeException('bad_image');
        }

        file_put_contents($dir . '/' . Kod::certFile((string) $p->cert_token), $binary);

        $p->forceFill(['cert_ready' => true])->save();

        return $p;
    }

    public function certPath(DossierProgress $p): ?string
    {
        if (! $p->cert_token) {
            return null;
        }

        $path = rtrim((string) config('dossier.cert.path'), '/') . '/' . Kod::certFile((string) $p->cert_token);

        return is_file($path) ? $path : null;
    }

    public function byCertToken(string $token): ?DossierProgress
    {
        return Kod::isToken($token)
            ? DossierProgress::query()->where('cert_token', $token)->where('solved', true)->first()
            : null;
    }

    protected function moderation(): Moderation
    {
        return new Moderation(
            Setting::get('banned_words', (string) config('zarafat.banned_words')) ?? ''
        );
    }
}
