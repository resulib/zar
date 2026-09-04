<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\CaseCompletion;
use App\Models\Dossier;
use App\Models\InvestigatorProfile;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

/**
 * Reytinq sorğuları.
 *
 * KEŞ TTL-Ə ƏSASLANIR, AÇIQ LƏĞVƏ YOX. `CACHE_STORE=database` teq
 * dəstəkləmir, yəni `Cache::tags()->flush()` mövcud deyil; 12 sıralama × N
 * səhifə üçün açar manifesti saxlamaq çox kod, çox səhv və sıfır faydadır.
 * Reytinq dünya haqqında fakt deyil, onun OXUNUŞUDUR — beş dəqiqə köhnəlik
 * oyunçuya görünmür. (İdarəçi düyməsindən sonra `RankService::forgetCache()`
 * açarları hər halda silir.)
 *
 * BÜTÜN PƏNCƏRƏLƏR `case_completions` üzərindən aqreqasiya edir — «bütün
 * dövr» də. Profildəki sayğaclar yalnız PROFİL SƏHİFƏSİNİN keşidir; onları
 * burada oxumaq iki fərqli həqiqət mənbəyi yaradardı.
 */
class RankingService
{
    /** Sıralama açarı → SQL ifadəsi. Ağ siyahı `config`-dədir. */
    private const OLCU = [
        'xp'        => 'xp',
        'isler'     => 'isler',
        'sonluqlar' => 'sonluqlar',
        'ilk-cehd'  => 'ilk',
    ];

    /** @return array{setirler:list<array<string,mixed>>,sirala:string,pencere:string} */
    public function board(string $sirala, string $pencere, int $sehife = 1): array
    {
        $sirala  = isset(self::OLCU[$sirala]) ? $sirala : 'xp';
        $pencere = in_array($pencere, (array) config('dossier.reyting.pencereler'), true) ? $pencere : 'hamisi';
        $sehife  = max(1, $sehife);

        $acar = 'reyting:' . $sirala . ':' . $pencere . ':' . $sehife;
        $ttl  = (int) config('dossier.reyting.cache_minutes', 5) * 60;

        $setirler = Cache::remember($acar, $ttl, fn () => $this->query($sirala, $pencere, $sehife));

        return ['setirler' => $setirler, 'sirala' => $sirala, 'pencere' => $pencere];
    }

    /**
     * @return list<array<string,mixed>> Eloquent modeli YOX — verilənlər
     *         bazası keşi `serialize()` edir və köhnəlmiş əlaqə daşımamalıdır.
     */
    protected function query(string $sirala, string $pencere, int $sehife): array
    {
        $limit = (int) config('dossier.reyting.per_page', 50);
        $since = $this->since($pencere);

        $q = CaseCompletion::query()
            ->join('investigator_profiles as p', 'p.id', '=', 'case_completions.profile_id')
            ->leftJoin('ranks as r', 'r.id', '=', 'p.rank_id')
            ->where('p.is_public', true)
            ->whereNotNull('p.badge_number')      // qonaq profili siyahıda yoxdur
            ->groupBy('case_completions.profile_id')
            ->selectRaw('case_completions.profile_id as pid,'
                . ' p.display_name, p.badge_number, p.avatar_status, p.avatar_path, p.id as prof_id,'
                . ' r.title_az as rutbe, r.title_short as rutbe_qisa,'
                . ' r.insignia_type as nisan, r.color_token as reng, r.level as pille,'
                . ' SUM(case_completions.xp_awarded) as xp,'
                . ' SUM(case_completions.is_solved) as isler,'
                . ' SUM(case_completions.is_true_ending) as sonluqlar,'
                . ' SUM(CASE WHEN case_completions.is_solved = 1'
                . ' AND case_completions.wrong_attempts = 0 THEN 1 ELSE 0 END) as ilk');

        if ($since !== null) {
            $q->where('case_completions.completed_at', '>=', $since);
        }

        /* İkinci sıralama HƏMİŞƏ `p.id` — qeyri-sabit bərabərlik həlli
           səhifə sərhədində sətirləri həm təkrarlayır, həm itirir. */
        $q->orderByDesc(self::OLCU[$sirala])->orderBy('p.id');

        $xam = $q->limit($limit)->offset(($sehife - 1) * $limit)->get();

        $out = [];
        $n   = ($sehife - 1) * $limit;

        foreach ($xam as $s) {
            $out[] = [
                'movqe'     => ++$n,
                'id'        => (int) $s->prof_id,
                'ad'        => (string) ($s->display_name !== '' ? $s->display_name : $s->badge_number),
                'nisanNo'   => (string) $s->badge_number,
                'rutbe'     => (string) ($s->rutbe ?? 'Stajçı'),
                'rutbeQisa' => (string) ($s->rutbe_qisa ?? 'Stajçı'),
                'nisan'     => (string) ($s->nisan ?? 'sirit-bos'),
                'reng'      => (string) (config('dossier.reyting.rank_colors')[$s->reng] ?? '#8792A6'),
                'pille'     => (int) ($s->pille ?? 1),
                'avatar'    => $s->avatar_status === InvestigatorProfile::AVATAR_TESDIQ
                    && $s->avatar_path !== null ? (int) $s->prof_id : null,
                'xp'        => (int) $s->xp,
                'isler'     => (int) $s->isler,
                'sonluqlar' => (int) $s->sonluqlar,
                'ilk'       => (int) $s->ilk,
            ];
        }

        return $out;
    }

    protected function since(string $pencere): ?Carbon
    {
        return match ($pencere) {
            'ay'    => Carbon::now()->startOfMonth(),
            'hefte' => Carbon::now()->startOfWeek(),
            default => null,
        };
    }

    /**
     * Oxucunun ÖZ mövqeyi — istənilən sıralamada, keşsiz.
     *
     * Bir indeksli sayımdır: 12 mövqeyi sütunda saxlamaq on bir dəyəri
     * sinxronda saxlamaq deməkdir və onları yalnız bu bir sətir oxuyur.
     * Gizli profil də cavab alır — siyahıda yoxdur, mövqeyini bilir.
     */
    public function myPosition(InvestigatorProfile $p, string $sirala = 'xp', string $pencere = 'hamisi'): ?int
    {
        if (! $p->hasBadge()) {
            return null;
        }

        $sirala = isset(self::OLCU[$sirala]) ? $sirala : 'xp';
        $olcu   = self::OLCU[$sirala];
        $since  = $this->since($pencere);

        $mene = $this->totals($p, $since)[$olcu] ?? 0;

        $alt = CaseCompletion::query()
            ->join('investigator_profiles as p', 'p.id', '=', 'case_completions.profile_id')
            ->whereNotNull('p.badge_number')
            ->groupBy('case_completions.profile_id')
            ->selectRaw('case_completions.profile_id,'
                . ' SUM(case_completions.xp_awarded) as xp,'
                . ' SUM(case_completions.is_solved) as isler,'
                . ' SUM(case_completions.is_true_ending) as sonluqlar,'
                . ' SUM(CASE WHEN case_completions.is_solved = 1'
                . ' AND case_completions.wrong_attempts = 0 THEN 1 ELSE 0 END) as ilk');

        if ($since !== null) {
            $alt->where('case_completions.completed_at', '>=', $since);
        }

        return 1 + (int) DB::query()->fromSub($alt, 'a')->where('a.' . $olcu, '>', $mene)->count();
    }

    /** @return array<string,int> */
    public function totals(InvestigatorProfile $p, ?Carbon $since = null): array
    {
        $q = CaseCompletion::query()->where('profile_id', $p->id);

        if ($since !== null) {
            $q->where('completed_at', '>=', $since);
        }

        $r = $q->selectRaw('SUM(xp_awarded) as xp, SUM(is_solved) as isler,'
            . ' SUM(is_true_ending) as sonluqlar,'
            . ' SUM(CASE WHEN is_solved = 1 AND wrong_attempts = 0 THEN 1 ELSE 0 END) as ilk')
            ->first();

        return [
            'xp'        => (int) ($r->xp ?? 0),
            'isler'     => (int) ($r->isler ?? 0),
            'sonluqlar' => (int) ($r->sonluqlar ?? 0),
            'ilk'       => (int) ($r->ilk ?? 0),
        ];
    }

    /**
     * Bir işin ən sürətli on oyunçusu — təqdimat səhifəsində.
     *
     * `(case_id, duration_seconds)` indeksi bunu skan deyil, axtarış edir.
     * TTL `Dossier::stats()` ilə eynidir: ikisi eyni səhifədə yan-yana durur.
     */
    public function fastest(Dossier $dossier): array
    {
        $limit = (int) config('dossier.reyting.is_reytinq', 10);

        return Cache::remember('reyting:is:' . $dossier->id, 600, function () use ($dossier, $limit): array {
            $xam = CaseCompletion::query()
                ->join('investigator_profiles as p', 'p.id', '=', 'case_completions.profile_id')
                ->leftJoin('ranks as r', 'r.id', '=', 'p.rank_id')
                ->where('case_completions.case_id', $dossier->id)
                ->where('case_completions.is_solved', true)
                ->whereNotNull('case_completions.duration_seconds')
                ->where('p.is_public', true)
                ->whereNotNull('p.badge_number')
                ->orderBy('case_completions.duration_seconds')
                ->orderBy('p.id')
                ->limit($limit)
                ->get(['p.display_name', 'p.badge_number', 'r.title_short as rutbe',
                    'r.color_token as reng', 'case_completions.duration_seconds as saniye',
                    'case_completions.wrong_attempts as sehv']);

            $out = [];
            $n   = 0;

            foreach ($xam as $s) {
                $out[] = [
                    'movqe'   => ++$n,
                    'ad'      => (string) ($s->display_name !== '' ? $s->display_name : $s->badge_number),
                    'nisanNo' => (string) $s->badge_number,
                    'rutbe'   => (string) ($s->rutbe ?? 'Stajçı'),
                    'reng'    => (string) (config('dossier.reyting.rank_colors')[$s->reng] ?? '#8792A6'),
                    'deqiqe'  => \App\Support\Dossier\Dossier::deqiqe((int) $s->saniye),
                    'temiz'   => (int) $s->sehv === 0,
                ];
            }

            return $out;
        });
    }
}
