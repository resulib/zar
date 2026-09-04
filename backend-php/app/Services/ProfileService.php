<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\InvestigatorProfile;
use App\Models\Rank;
use App\Models\Setting;
use App\Models\User;
use App\Support\Dossier\VesiqeNo;
use App\Support\Moderation;
use App\Support\Sanitizer;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * Müstəntiq profilinin yaradılması, nişanın verilməsi və şöbə kilidi.
 *
 * Rütbə və XP BURADA HESABLANMIR — o, tamamilə `RankService`-in işidir.
 * Bu sinif kimliyi idarə edir: kim olduğunu, hansı şöbədə olduğunu və hansı
 * nömrəni daşıdığını.
 */
class ProfileService
{
    /**
     * Profil TƏLƏBATA GÖRƏ yaradılır.
     *
     * Yalnız üç yerdən çağırılır: `RankService` (qonaq ilk işi bağlayanda),
     * profil kontrolleri, və `AccountService::mergeGuestInto()`.
     *
     * `DossierService::open()`-dan QƏSDƏN çağırılmır: iş alıb heç vaxt
     * bitirməyən ziyarətçi profil sətri yaratmamalıdır — qonaq sətirlərinin
     * tənbəl yaradılması ilə eyni intizam.
     *
     * NİŞAN NÖMRƏSİ BURADA VERİLMİR. O, şöbə seçiləndə doğulur.
     */
    public function ensure(User $user): InvestigatorProfile
    {
        /** @var InvestigatorProfile $p */
        $p = InvestigatorProfile::query()->firstOrCreate(
            ['user_id' => $user->id],
            [
                'display_name' => Sanitizer::person((string) ($user->name ?? ''), 40),
                'rank_id'      => Rank::ilk()?->id,
                'joined_at'    => Carbon::now(),
                // Qonaq reytinqdə görünmür; nişanı da olmadığı üçün onsuz da
                // siyahıdan kənardadır, amma niyyət açıq yazılır.
                'is_public'    => ! $user->isGuest(),
            ]
        );

        return $p;
    }

    /** Profil varsa qaytarır, yoxsa `null` — sətir yaratmır. */
    public function find(User $user): ?InvestigatorProfile
    {
        return InvestigatorProfile::query()->where('user_id', $user->id)->first();
    }

    public function touch(InvestigatorProfile $p): void
    {
        $p->forceFill(['last_active_at' => Carbon::now()])->saveQuietly();
    }

    /**
     * ŞÖBƏ SEÇİMİ — birinci seçim nişanı doğurur, ikincisi sonuncudur.
     *
     * Bir dəfəlik dəyişiklik kartın ciddiliyini qoruyur: şöbəni istədiyi kimi
     * dəyişən adam üçün şöbə bir bəzəkdir, bir dəfə dəyişən adam üçün isə
     * təyinatdır.
     *
     * NİŞAN NÖMRƏSİ DƏYİŞMİR. Real yenidən təyinat da belədir: nömrə adamın
     * özünə verilir, vəzifəsinə yox — üstəlik paylaşılmış köhnə kartın
     * nömrəsi uyğun gəlməlidir.
     *
     * @throws \RuntimeException `bad_department` · `department_locked`
     */
    public function chooseDepartment(InvestigatorProfile $p, mixed $input): InvestigatorProfile
    {
        $kod = Sanitizer::pick($input, array_keys((array) config('dossier.sobeler', [])), '');

        if ($kod === '') {
            throw new \RuntimeException('bad_department');
        }

        if ($p->department_locked) {
            throw new \RuntimeException('department_locked');
        }

        // Eyni şöbəni yenidən seçmək dəyişiklik sayılmır — kilidi yandırmır.
        if ($p->department === $kod) {
            return $p;
        }

        $ilk = $p->department === null || $p->department === '';

        $p->department        = $kod;
        $p->department_locked = ! $ilk;
        $p->save();

        if ($ilk) {
            $this->issueBadge($p, $kod);
        }

        return $p;
    }

    /**
     * NİŞAN NÖMRƏSİ — bir dəfə verilir və donur.
     *
     * Ardıcıllıq şöbə + il üzrədir. Paralel iki qeydiyyatda boşluq və ya
     * təkrar olmasın deyə maksimum SƏTİR KİLİDİ altında oxunur; `unique`
     * indeks isə son sipərdir.
     *
     * `random_int` QƏSDƏN işlədilmir — nömrə təxmin edilməli deyil, ARDICIL
     * olmalıdır. Sıfırla doldurulmuş sabit en sayəsində `ORDER BY ... DESC`
     * ədədi maksimumu verir (bax `VesiqeNo`).
     */
    public function issueBadge(InvestigatorProfile $p, string $kod): string
    {
        if ($p->hasBadge()) {
            return (string) $p->badge_number;   // DONUB
        }

        $il = (int) Carbon::now()->format('y');

        return DB::transaction(function () use ($p, $kod, $il): string {
            $onek = VesiqeNo::onek($kod, $il);

            $son = InvestigatorProfile::query()
                ->where('badge_number', 'like', $onek . '%')
                ->lockForUpdate()
                ->orderByDesc('badge_number')
                ->value('badge_number');

            $nomre = VesiqeNo::format($kod, $il, VesiqeNo::sira($son) + 1);

            /** @var InvestigatorProfile $kilidli */
            $kilidli = InvestigatorProfile::query()->whereKey($p->id)->lockForUpdate()->firstOrFail();

            if ($kilidli->hasBadge()) {
                $p->badge_number = $kilidli->badge_number;

                return (string) $kilidli->badge_number;
            }

            $kilidli->forceFill(['badge_number' => $nomre])->save();
            $p->badge_number = $nomre;

            return $nomre;
        });
    }

    /**
     * GÖSTƏRİLƏN AD.
     *
     * Bütün müqayisələr SERVERDƏ və `Moderation::normalize()` ilə aparılır:
     * `strtolower` Azərbaycan «İ» hərfini sındırır və brauzerdəki yoxlama
     * onsuz da qorunma deyil.
     *
     * UNİKALLIQ TƏLƏB OLUNMUR: kimlik nişan nömrəsidir, iki «Rəşad» normaldır,
     * qatlanmış Azərbaycan adı üzərində unikallıq isə məhz həmin tələdir.
     *
     * @throws \RuntimeException `bad_name`
     */
    public function setDisplayName(InvestigatorProfile $p, mixed $input): InvestigatorProfile
    {
        $ad = Sanitizer::person($input, 40);

        if (mb_strlen($ad) < 2) {
            throw new \RuntimeException('bad_name');
        }

        // «aaaaaa», «-------» — ad deyil, doldurmadır.
        if (preg_match('/(.)\1{3,}/u', $ad) === 1) {
            throw new \RuntimeException('bad_name');
        }

        // Reklam sətri ad deyil.
        if (count(preg_split('/\s+/u', $ad) ?: []) > 4) {
            throw new \RuntimeException('bad_name');
        }

        if ($this->moderation()->flagged($ad)) {
            throw new \RuntimeException('bad_name');
        }

        $p->display_name = $ad;
        $p->save();

        return $p;
    }

    public function setPrivacy(InvestigatorProfile $p, bool $public): InvestigatorProfile
    {
        $p->is_public = $public;
        $p->save();

        return $p;
    }

    protected function moderation(): Moderation
    {
        return new Moderation(
            Setting::get('banned_words', (string) config('zarafat.banned_words')) ?? ''
        );
    }
}
