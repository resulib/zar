<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\CaseCompletion;
use App\Models\Document;
use App\Models\DossierProgress;
use App\Models\InvestigatorProfile;
use App\Models\Payment;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * Qonaq sessiyaları və hesablar.
 *
 * Qonaq — `email`-i boş olan istifadəçi sətri. Qeydiyyat zamanı həmin sətir
 * hesaba çevrilir, ona görə balans və sənədlər öz-özünə qalır.
 * Başqa cihazdan giriş edildikdə isə qonaq sessiyası hesaba birləşdirilir.
 */
class AccountService
{
    public function __construct(
        private readonly ProfileService $profiles,
        private readonly RankService $ranks,
    ) {
    }

    /**
     * Qonağı AVTOMATİK qeydə alır — ziyarətçi heç nə etmir.
     *
     * Sətir onsuz da yaranırdı; yeni olan odur ki, ona dərhal ad da verilir
     * («Qonaq-0148»). Səbəb: iş qovluğu bölməsində müstəntiqin adı vərəqlərə
     * yazılır və reytinqdə görünür, adsız sətir isə orada «—» kimi çıxırdı.
     * Ad `auto_name` ilə işarələnir, ona görə qeydiyyat zamanı istifadəçinin
     * yazdığı ad onu sual vermədən əvəz edir.
     */
    public function newGuest(?string $ip = null): User
    {
        $user = User::create([
            'uuid'         => (string) Str::uuid(),
            'guest_token'  => $this->newToken(),
            'credits'      => 0,
            'last_ip'      => $ip,
            'last_seen_at' => Carbon::now(),
        ]);

        /* Ad id-dən qurulur, təsadüfi rəqəmdən yox: belədə iki qonaq eyni adı
           daşımır və ad sətrin özü ilə birlikdə sabit qalır. */
        $user->forceFill([
            'name'      => self::qonaqAdi($user->id),
            'auto_name' => true,
        ])->save();

        return $user;
    }

    /** «Qonaq-0148» — avtomatik qeydiyyatın verdiyi ad. */
    public static function qonaqAdi(int $id): string
    {
        return 'Qonaq-' . str_pad((string) $id, 4, '0', STR_PAD_LEFT);
    }

    public function findByGuestToken(string $token): ?User
    {
        return User::query()->where('guest_token', $token)->first();
    }

    public function newToken(): string
    {
        return bin2hex(random_bytes(24));
    }

    /** Qonaq sətrini hesaba çevirir — məlumat köçürülmür, elə yerindəcə qalır. */
    /**
     * Qonaq sətri YERİNDƏ hesaba çevrilir.
     *
     * Buna görə müstəntiq profilinə heç nə edilmir və edilməməlidir:
     * `investigator_profiles.user_id` elə həmin sətrə baxır, ona görə qonaq
     * ikən qazanılmış XP, bağlanmış işlər və vaxt nəticələri öz-özünə qalır.
     * Bu, unudulmuş kimi görünür — unudulmayıb.
     */
    public function register(User $guest, string $name, string $email, string $password): User
    {
        $guest->forceFill([
            'name'          => $name,
            'email'         => $email,
            'password'      => $password,     // model `hashed` cast ilə özü hash-layır
            'auth_provider' => 'parol',
            'auto_name'     => false,
        ])->save();

        return $guest->refresh();
    }

    /* ------------------------------------------------------------------ */
    /*  Google ilə giriş                                                   */
    /* ------------------------------------------------------------------ */

    /**
     * Google kimliyini hesaba çevirir və ya mövcud hesaba bağlayır.
     *
     * ÜÇ HAL, BU SIRA İLƏ — sıra təhlükəsizlik məsələsidir:
     *
     *   1. `google_id` ilə hesab tapılır → odur. Bağlama e-poçtla yox, `sub`
     *      ilə gedir, çünki adam Google-da e-poçtunu dəyişsə də `sub` qalır.
     *   2. E-poçt ilə hesab tapılır → `google_id` ona bağlanır. Bu, parolla
     *      açılmış köhnə hesabın sahibinin Google düyməsinə basması halıdır;
     *      `Google::kimlik()` e-poçtun TƏSDİQLƏNMİŞ olmasını tələb etdiyi
     *      üçün bu yolla başqasının hesabı ələ keçirilə bilməz.
     *   3. Heç nə yoxdur → CARİ QONAQ SƏTRİ YERİNDƏ hesaba çevrilir, elə
     *      `register()` kimi. Ona görə krediti, sənədləri, XP-si və bağladığı
     *      işlər olduğu yerdə qalır — köçürmə yoxdur, köçürüləcək bir şey yoxdur.
     *
     * @param  array{sub:string,email:string,name:string}  $kimlik
     * @return array{user:User,yeni:bool,birlesdi:array{moved_documents:int,moved_credits:int}}
     */
    public function googleIle(User $ziyaretci, array $kimlik): array
    {
        $bos = ['moved_documents' => 0, 'moved_credits' => 0];

        $hesab = User::query()->where('google_id', $kimlik['sub'])->first()
            ?? User::query()->whereRaw('lower(email) = ?', [$kimlik['email']])->first();

        if ($hesab === null) {
            /* Ziyarətçi artıq hesabdadırsa (parolla girib) — Google həmin
               hesaba BAĞLANIR, yeni hesab açılmır. */
            $ziyaretci->forceFill([
                'name'          => $ziyaretci->auto_name || ! $ziyaretci->name
                                    ? ($kimlik['name'] !== '' ? $kimlik['name'] : $ziyaretci->name)
                                    : $ziyaretci->name,
                'email'         => $ziyaretci->email ?? $kimlik['email'],
                'google_id'     => $kimlik['sub'],
                'auth_provider' => $ziyaretci->hasPassword() ? $ziyaretci->auth_provider : 'google',
                'auto_name'     => false,
            ])->save();

            return ['user' => $ziyaretci->refresh(), 'yeni' => true, 'birlesdi' => $bos];
        }

        if (! $hesab->hasGoogle()) {
            $hesab->forceFill(['google_id' => $kimlik['sub']])->save();
        }

        /* Adı yalnız avtomatik olduqda əvəz edirik — insan öz adını
           yazıbsa, Google-un yazdığı ad onu üstələməməlidir. */
        if ($hesab->auto_name && $kimlik['name'] !== '') {
            $hesab->forceFill(['name' => $kimlik['name'], 'auto_name' => false])->save();
        }

        $birlesdi = $ziyaretci->isGuest() && $ziyaretci->id !== $hesab->id
            ? $this->mergeGuestInto($ziyaretci, $hesab)
            : $bos;

        return ['user' => $hesab->refresh(), 'yeni' => false, 'birlesdi' => $birlesdi];
    }

    /**
     * Girişdən sonra qonaq sessiyasını hesaba birləşdirir.
     * Qonaqda nə varsa (kredit, sənəd, ödəniş, tarixçə) hesaba keçir, qonaq sətri silinir.
     *
     * @return array{moved_documents:int,moved_credits:int} nəyin köçürüldüyü
     */
    public function mergeGuestInto(User $guest, User $account): array
    {
        if ($guest->id === $account->id) {
            return ['moved_documents' => 0, 'moved_credits' => 0];
        }

        return DB::transaction(function () use ($guest, $account): array {
            $docs = Document::query()->where('user_id', $guest->id)->update(['user_id' => $account->id]);
            Payment::query()->where('user_id', $guest->id)->update(['user_id' => $account->id]);
            Transaction::query()->where('user_id', $guest->id)->update(['user_id' => $account->id]);
            $this->moveDossierProgress($guest, $account);
            $this->moveInvestigatorProfile($guest, $account);

            $credits = (int) $guest->credits;

            if ($credits > 0) {
                /** @var User $locked */
                $locked = User::query()->whereKey($account->id)->lockForUpdate()->firstOrFail();
                $locked->credits += $credits;
                $locked->save();

                Transaction::create([
                    'user_id'       => $locked->id,
                    'type'          => Transaction::TYPE_GRANT,
                    'credits'       => 0,
                    'balance_after' => $locked->credits,
                    'note'          => 'Qonaq sessiyası hesaba birləşdirildi (+' . $credits . ' kredit)',
                ]);

                $account->credits = $locked->credits;
            }

            $guest->forceFill(['guest_token' => null, 'credits' => 0])->save();
            $guest->delete();

            return ['moved_documents' => (int) $docs, 'moved_credits' => $credits];
        });
    }

    /**
     * İş qovluğu irəliləyişini hesaba köçürür.
     *
     * Bu, məcburidir: `dossier_progress.user_id` cascade silinir və metod
     * sonda qonaq sətrini silir — köçürmə olmasa adamın oxuduğu, sancdığı və
     * açdığı hər şey girişlə birlikdə yox olardı.
     *
     * Eyni qovluq üzrə hər iki tərəfdə sətir varsa daha irəlidəki saxlanılır:
     * girişdən əvvəlki qonaq sessiyası adətən yenidir, amma hesabda köhnə
     * yarımçıq iş qala bilər və onu geri atmaq istifadəçi üçün itkidir.
     */
    protected function moveDossierProgress(User $guest, User $account): void
    {
        $mine = DossierProgress::query()->where('user_id', $account->id)->get()->keyBy('dossier_id');

        foreach (DossierProgress::query()->where('user_id', $guest->id)->get() as $row) {
            $var = $mine->get($row->dossier_id);

            if ($var === null) {
                $row->forceFill(['user_id' => $account->id])->save();

                continue;
            }

            if ($this->progressRank($row) > $this->progressRank($var)) {
                $var->delete();
                $row->forceFill(['user_id' => $account->id])->save();

                continue;
            }

            $row->delete();
        }
    }

    /**
     * Müstəntiq profilini hesaba köçürür.
     *
     * MƏCBURİDİR: `investigator_profiles.user_id` cascade silinir və bu metod
     * sonda qonaq sətrini silir — köçürmə olmasa qonağın qazandığı XP,
     * bağladığı işlər və vaxt nəticələri girişlə birlikdə yox olardı.
     *
     * PROFİL SƏTRİ KÖÇÜRÜLMÜR: hesabın öz profili yaradılır və ora yalnız
     * `case_completions` keçir. Belədə heç bir halda başqasının nişan nömrəsi
     * hesaba yapışa bilmir — qonaqda o onsuz da boşdur, çünki nömrə şöbə
     * seçiləndə verilir, şöbə isə yalnız qeydiyyatdan sonra seçilir.
     */
    protected function moveInvestigatorProfile(User $guest, User $account): void
    {
        $qonaq = InvestigatorProfile::query()->where('user_id', $guest->id)->first();

        if ($qonaq === null) {
            return;
        }

        $hedef = $this->profiles->ensure($account);

        if ($hedef->id === $qonaq->id) {
            return;
        }

        $movcud = CaseCompletion::query()->where('profile_id', $hedef->id)->get()->keyBy('case_id');

        foreach (CaseCompletion::query()->where('profile_id', $qonaq->id)->get() as $setir) {
            $var = $movcud->get($setir->case_id);

            if ($var === null) {
                $setir->forceFill(['profile_id' => $hedef->id])->save();

                continue;
            }

            /* Eyni iş hər iki tərəfdə bağlanıbsa DAHA YÜKSƏK XP saxlanılır —
               `progressRank()` ilə eyni məntiq: birləşmə heç kimi geri
               atmamalıdır. */
            if ((int) $setir->xp_awarded > (int) $var->xp_awarded) {
                $var->delete();
                $setir->forceFill(['profile_id' => $hedef->id])->save();

                continue;
            }

            $setir->delete();
        }

        // `rank_history` və `xp_adjustments` cascade ilə gedir.
        $qonaq->delete();

        $this->ranks->recalculate($hedef);
    }

    /** İki irəliləyişdən hansının «daha irəli» olduğunu ölçür. */
    protected function progressRank(DossierProgress $p): int
    {
        return ($p->solved ? 1_000_000 : 0)
            + ($p->hasAccess() ? 100_000 : 0)
            + ((int) $p->attempts * 1_000)
            + count($p->ids('read_ids')) * 10
            + count($p->ids('pinned_ids'));
    }

    /** Hesabın öz qonaq tokeni olsun ki, cookie sabit qalsın. */
    public function ensureGuestToken(User $user): string
    {
        if (! $user->guest_token) {
            $user->forceFill(['guest_token' => $this->newToken()])->save();
        }

        return (string) $user->guest_token;
    }
}
