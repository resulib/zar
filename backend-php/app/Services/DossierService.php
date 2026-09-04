<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Dossier;
use App\Models\DossierDocument;
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

    public function __construct(private readonly CreditService $credits)
    {
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
            $this->sira[$k] = array_map('intval', $dossier->documents()->pluck('id')->all());
        }

        return $this->sira[$k];
    }

    /**
     * Sənədin HTML gövdəsi. Yalnız bu metod məzmunu brauzerə buraxır.
     *
     * Sənəd şablon deyil, blokların ardıcıllığıdır: burada heç bir növ
     * seçilmir, `sened.blade.php` sadəcə siyahını gəzir.
     */
    public function renderDocument(Dossier $dossier, DossierDocument $doc, DossierProgress $p): string
    {
        $bagli = ! $this->isUnlocked($p, $doc);
        $c = (array) $doc->content;
        $kagiz = (array) ($c['kagiz'] ?? []);

        return view('dossier.sened', [
            'dossier'    => $dossier,
            'doc'        => $doc,
            'c'          => $c,
            'bloklar'    => array_values((array) ($c['bloklar'] ?? [])),
            'kagiz'      => $kagiz,
            'kagizSinif' => self::kagizSinif($kagiz),
            'egilme'     => isset($kagiz['egilme']) ? (float) $kagiz['egilme'] : null,
            'mohurler'   => array_values((array) ($c['mohurler'] ?? [])),
            'head'       => array_values((array) (($dossier->cover['paperHead'] ?? []) ?: [])),
            'vals'       => $this->vals($p),
            'bagli'      => $bagli,
        ])->render();
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
        if (! $doc->is_sample || $doc->is_locked || (int) $doc->dossier_id !== (int) $dossier->id) {
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

        return $this->neticeArray($p, $dossier, $netice['ok'], true);
    }

    /** @return array<string,mixed> */
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
