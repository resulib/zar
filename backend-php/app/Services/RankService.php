<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\CaseCompletion;
use App\Models\Dossier;
use App\Models\DossierProgress;
use App\Models\InvestigatorProfile;
use App\Models\Rank;
use App\Models\RankHistory;
use App\Models\User;
use App\Models\XpAdjustment;
use App\Support\Dossier\Xp;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

/**
 * XP və rütbə — YEGANƏ yazı yolu.
 *
 * Kontrollerlər rütbə hesablamır və `investigator_profiles.xp` sütununa
 * birbaşa yazmır. Səbəb kredit balansındakı ilə eynidir: bir sütunu iki
 * yerdən yazmaq, gec-tez iki fərqli qayda deməkdir.
 *
 * XP TÖRƏMƏDİR, LEDGER DEYİL:
 *
 *     xp = Σ case_completions.xp_awarded + Σ xp_adjustments.delta
 *
 * Sütun yalnız keşdir. Bu üç şeyi pulsuz edir: idarəçinin «yenidən hesabla»
 * düyməsi, qonağın hesaba birləşməsi, və audit. Yarımçıq qalan yazı balansı
 * həmişəlik pozmur — növbəti yenidən hesablama onu bərpa edir.
 *
 * QEYD — `is_true_ending` «UDAN NƏTİCƏYƏ ÇATDI» deməkdir: sonluq rejimində
 * doğru şübhəli, sual rejimində isə `solved` (`revealed`-dən fərqli olaraq).
 * Yəni bu gün, sonluq işlədən iş olmadığı üçün, o hər bağlanan işdə doğrudur
 * və `+50 %` faktiki olaraq bazanın bir hissəsidir; xalı həqiqətən dəyişən
 * qollar ilk-cəhd bonusu, kod bonusu və səhv cəzasıdır. Bu, ARTIQLIQ DEYİL —
 * `dossier_endings` işlədən iş çıxan gün iki qol bir-birindən ayrılacaq.
 */
class RankService
{
    public function __construct(private readonly ProfileService $profiles)
    {
    }

    /* ----------------------------------------------------------------
     | Mükafat
     |---------------------------------------------------------------- */

    /**
     * Bağlanmış iş üçün xal verir.
     *
     * `(profile_id, case_id)` unikaldır və sətir artıq varsa metod `null`
     * qaytarır: TƏKRAR OYNAMAQ XAL GƏTİRMİR, yalnız birinci həll sayılır.
     *
     * Çağıran tərəf keçid qapısını (`! $evvel && $p->solved`) özü qoyur —
     * burada ikinci sipər unikal indeksdir.
     */
    public function awardForCase(DossierProgress $p, Dossier $dossier, int $wrong): ?CaseCompletion
    {
        $user = $p->user;

        if (! $user instanceof User) {
            return null;
        }

        $profile = $this->profiles->ensure($user);

        return DB::transaction(function () use ($p, $dossier, $wrong, $profile): ?CaseCompletion {
            /** @var InvestigatorProfile $kilidli */
            $kilidli = InvestigatorProfile::query()->whereKey($profile->id)->lockForUpdate()->firstOrFail();

            $movcud = CaseCompletion::query()
                ->where('profile_id', $kilidli->id)
                ->where('case_id', $dossier->id)
                ->first();

            // Artıq bağlanıb: nə ikinci sətir, nə ikinci xal.
            if ($movcud !== null && $movcud->is_solved) {
                return null;
            }

            $cetinlik = (string) $dossier->difficulty;
            $ilk      = $wrong === 0;
            $kodlar   = $this->allCodesUnlocked($dossier, $p);

            $xal = Xp::hesabla($cetinlik, true, $ilk, $kodlar, $wrong, (array) config('dossier.xp'));

            $setir = $movcud ?? new CaseCompletion([
                'profile_id' => $kilidli->id,
                'case_id'    => $dossier->id,
            ]);

            $setir->fill([
                'profile_id'         => $kilidli->id,
                'case_id'            => $dossier->id,
                'is_solved'          => true,
                'chosen_suspect_id'  => $p->chosen_suspect_id,
                'is_true_ending'     => true,
                'wrong_attempts'     => $wrong,
                'all_codes_unlocked' => $kodlar,
                'difficulty'         => $cetinlik,
                'xp_awarded'         => $xal,
                'duration_seconds'   => $p->duration_seconds,
                'completed_at'       => $p->finished_at ?? Carbon::now(),
            ])->save();

            $this->recalculate($kilidli);
            $this->scheduleSync();

            return $setir;
        });
    }

    /**
     * Bağlanmayan cəhdi qeyd edir (üç səhv cəhddən sonra izah açılanda).
     *
     * XAL VERİLMİR, amma `cases_attempted` artır: profil «neçə işə
     * baxdığını» göstərməlidir, yoxsa yarımçıq qalan iş yoxa çıxır.
     */
    public function recordAttempt(DossierProgress $p, Dossier $dossier, int $wrong): ?CaseCompletion
    {
        $user = $p->user;

        if (! $user instanceof User) {
            return null;
        }

        $profile = $this->profiles->ensure($user);

        return DB::transaction(function () use ($p, $dossier, $wrong, $profile): ?CaseCompletion {
            /** @var InvestigatorProfile $kilidli */
            $kilidli = InvestigatorProfile::query()->whereKey($profile->id)->lockForUpdate()->firstOrFail();

            $setir = CaseCompletion::query()
                ->where('profile_id', $kilidli->id)
                ->where('case_id', $dossier->id)
                ->first();

            // Bağlanmış işin qeydi bir daha «bağlanmadı»ya çevrilmir.
            if ($setir !== null && $setir->is_solved) {
                return $setir;
            }

            $setir ??= new CaseCompletion();

            $setir->fill([
                'profile_id'         => $kilidli->id,
                'case_id'            => $dossier->id,
                'is_solved'          => false,
                'chosen_suspect_id'  => $p->chosen_suspect_id,
                'is_true_ending'     => false,
                'wrong_attempts'     => $wrong,
                'all_codes_unlocked' => $this->allCodesUnlocked($dossier, $p),
                'difficulty'         => (string) $dossier->difficulty,
                'xp_awarded'         => 0,
                'duration_seconds'   => $p->duration_seconds,
                'completed_at'       => Carbon::now(),
            ])->save();

            $this->recalculate($kilidli);

            return $setir;
        });
    }

    /**
     * BÜTÜN KİLİDLƏR AÇILIBMI.
     *
     * Kilidli vərəqi OLMAYAN iş `true` sayılır — əks halda `+20` yalnız
     * kodlu işlərə düşərdi və bonus qalan işlər üçün cəzaya çevrilərdi.
     */
    public function allCodesUnlocked(Dossier $dossier, DossierProgress $p): bool
    {
        $kilidli = $dossier->documents()
            ->whereNotNull('lock_code')
            ->where('lock_code', '!=', '')
            ->pluck('id')
            ->map('intval')
            ->all();

        if ($kilidli === []) {
            return true;
        }

        return array_diff($kilidli, $p->ids('unlocked_ids')) === [];
    }

    /* ----------------------------------------------------------------
     | Yenidən hesablama
     |---------------------------------------------------------------- */

    /**
     * Profili SIFIRDAN qurur: XP, beş sayğac və rütbə.
     *
     * `CreditService::apply()` naxışı — sətir kilidi altında, tranzaksiya
     * içində. Rütbə dəyişibsə `rank_history` sətri yazılır və qaytarılır ki,
     * çağıran tərəf «əmr» ekranını göstərə bilsin.
     */
    public function recalculate(InvestigatorProfile $profile): ?RankHistory
    {
        return DB::transaction(function () use ($profile): ?RankHistory {
            /** @var InvestigatorProfile $p */
            $p = InvestigatorProfile::query()->whereKey($profile->id)->lockForUpdate()->firstOrFail();

            $isler = CaseCompletion::query()->where('profile_id', $p->id)->get();
            $elave = (int) XpAdjustment::query()->where('profile_id', $p->id)->sum('delta');

            $xp = (int) $isler->sum('xp_awarded') + $elave;

            $p->xp                      = max(0, $xp);   // sütun işarəsizdir
            $p->cases_attempted         = $isler->count();
            $p->cases_solved            = $isler->where('is_solved', true)->count();
            $p->true_endings            = $isler->where('is_true_ending', true)->count();
            $p->first_try_solves        = $isler->filter(fn (CaseCompletion $c) => $c->firstTry())->count();
            $p->total_wrong_accusations = (int) $isler->sum('wrong_attempts');

            $kohne = $p->rank_id === null ? null : (int) $p->rank_id;
            $yeni  = $this->rankFor($p->xp);

            $p->rank_id = $yeni?->id;
            $p->save();

            // Çağıran tərəfdəki obyekt də yenilənsin (CreditService qaydası).
            $profile->xp      = $p->xp;
            $profile->rank_id = $p->rank_id;
            $profile->syncOriginalAttribute('xp');

            if ($yeni === null || $kohne === (int) $yeni->id) {
                return null;
            }

            /* Rütbə ENDİ (idarəçi xal çıxdı) — tarixçəyə yazılır, amma bu,
               «əmr» deyil: yalnız yüksəliş göstərilir. */
            $kohneRutbe = $kohne === null ? null : Rank::query()->find($kohne);

            if ($kohneRutbe !== null && (int) $kohneRutbe->level > (int) $yeni->level) {
                return null;
            }

            return RankHistory::query()->create([
                'profile_id'  => $p->id,
                'old_rank_id' => $kohne,
                'new_rank_id' => $yeni->id,
                'awarded_at'  => Carbon::now(),
            ]);
        });
    }

    /**
     * İdarəçinin düyməsi: BÜTÜN profilləri düsturdan yenidən hesablayır.
     *
     * `xp_awarded` köhnə rəqəm kimi toplanmır — `case_completions.difficulty`
     * anlıq surətindən `Xp::hesabla()` ilə YENİDƏN qurulur. Düymənin bütün
     * mənası budur: düstur dəyişəndə keçmiş nəticələr də yeni qaydaya keçir.
     */
    public function recalculateAll(): int
    {
        $cfg = (array) config('dossier.xp');
        $say = 0;

        CaseCompletion::query()->chunkById(500, function ($setirler) use ($cfg): void {
            foreach ($setirler as $c) {
                $xal = $c->is_solved
                    ? Xp::hesabla((string) $c->difficulty, (bool) $c->is_true_ending,
                        $c->wrong_attempts === 0, (bool) $c->all_codes_unlocked,
                        (int) $c->wrong_attempts, $cfg)
                    : 0;

                if ((int) $c->xp_awarded !== $xal) {
                    $c->forceFill(['xp_awarded' => $xal])->save();
                }
            }
        });

        InvestigatorProfile::query()->chunkById(500, function ($profiller) use (&$say): void {
            foreach ($profiller as $p) {
                $this->recalculate($p);
                $say++;
            }
        });

        $this->syncPositions();
        $this->forgetCache();

        return $say;
    }

    /** XP-ə uyğun ən yüksək rütbə. */
    public function rankFor(int $xp): ?Rank
    {
        return Rank::query()
            ->where('xp_required', '<=', max(0, $xp))
            ->orderByDesc('xp_required')
            ->orderByDesc('level')
            ->first();
    }

    /**
     * Növbəti rütbəyə nə qalıb.
     *
     * @return array{rank:?Rank,next:?Rank,need:int,have:int,span:int,percent:int}
     */
    public function xpToNextRank(InvestigatorProfile $p): array
    {
        $indiki = $p->rank ?? $this->rankFor((int) $p->xp);

        $novbeti = Rank::query()
            ->where('xp_required', '>', (int) $p->xp)
            ->orderBy('xp_required')
            ->first();

        if ($novbeti === null) {
            return ['rank' => $indiki, 'next' => null, 'need' => 0,
                'have' => (int) $p->xp, 'span' => 0, 'percent' => 100];
        }

        $dib  = (int) ($indiki->xp_required ?? 0);
        $span = max(1, (int) $novbeti->xp_required - $dib);
        $var  = max(0, (int) $p->xp - $dib);

        return [
            'rank'    => $indiki,
            'next'    => $novbeti,
            'need'    => max(0, (int) $novbeti->xp_required - (int) $p->xp),
            'have'    => (int) $p->xp,
            'span'    => $span,
            'percent' => (int) min(100, round($var / $span * 100)),
        ];
    }

    /**
     * İdarəçinin əl ilə verdiyi / çıxdığı xal — səbəb məcburidir.
     *
     * `delta` ledgerdə İŞARƏLİ qalır (nə edildiyi dürüst yazılır), profildəki
     * cəm isə sıfırda döşənir.
     */
    public function adjust(InvestigatorProfile $p, int $delta, string $reason, ?User $admin = null): XpAdjustment
    {
        return DB::transaction(function () use ($p, $delta, $reason, $admin): XpAdjustment {
            $setir = XpAdjustment::query()->create([
                'profile_id' => $p->id,
                'delta'      => $delta,
                'reason'     => $reason,
                'admin_id'   => $admin?->id,
            ]);

            $this->recalculate($p);
            $setir->forceFill(['balance_after' => (int) $p->fresh()?->xp])->save();

            $this->forgetCache();

            return $setir;
        });
    }

    /* ----------------------------------------------------------------
     | Mövqe
     |---------------------------------------------------------------- */

    /**
     * `cached_rank_position` — YALNIZ əsas sıralama (ümumi XP, bütün dövr).
     *
     * Gizli profillər sıralamaya DAXİLDİR: gizlətmək göstərim seçimidir,
     * rütbə enməsi deyil, və gizli adam öz mövqeyini görməlidir. Oxuma
     * sorğusu onları siyahıdan süzür.
     */
    public function syncPositions(): int
    {
        $movqe = 0;

        InvestigatorProfile::query()
            ->whereNotNull('badge_number')
            ->orderByDesc('xp')
            ->orderByDesc('cases_solved')
            ->orderBy('id')
            ->chunk(500, function ($profiller) use (&$movqe): void {
                foreach ($profiller as $p) {
                    $movqe++;

                    if ((int) $p->cached_rank_position !== $movqe) {
                        $p->forceFill(['cached_rank_position' => $movqe])->saveQuietly();
                    }
                }
            });

        return $movqe;
    }

    /**
     * Mövqe yenilənməsini SEYRƏKLƏŞDİRİR.
     *
     * `Cache::add()` atomik «yoxdursa yaz»dır: beş dəqiqədə bir dəfədən çox
     * işə düşmür, nə qədər adam eyni anda iş bağlasa da. Bu repoda planlayıcı
     * yoxdur və kosmetik bir rəqəm üçün infrastruktur qurulmur.
     */
    protected function scheduleSync(): void
    {
        if (Cache::add('reyting:kilid', 1, 300)) {
            $this->syncPositions();
            $this->forgetCache();
        }
    }

    /**
     * Reytinq keşi TTL ilə köhnəlir, açıq ləğv edilmir
     * (`CACHE_STORE=database` teq dəstəkləmir), amma idarəçi düyməsindən sonra
     * gözləmək mənasızdır — açarlar bir-bir silinir.
     */
    public function forgetCache(): void
    {
        foreach ((array) config('dossier.reyting.siralamalar', []) as $s) {
            foreach ((array) config('dossier.reyting.pencereler', []) as $w) {
                for ($sehife = 1; $sehife <= 5; $sehife++) {
                    Cache::forget('reyting:' . $s . ':' . $w . ':' . $sehife);
                }
            }
        }
    }
}
