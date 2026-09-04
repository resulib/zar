<?php

declare(strict_types=1);

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\CaseCompletion;
use App\Models\InvestigatorProfile;
use App\Models\Rank;
use App\Models\RankHistory;
use App\Models\User;
use App\Services\CardRenderer;
use App\Services\ProfileService;
use App\Services\RankService;
use App\Support\Dossier\Sekil;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

/**
 * Müstəntiq profili — vəsiqə, rütbə nərdivanı, ayarlar.
 *
 * Səhifə `noindex`-dir və `robots.txt`-də bağlıdır: burada real adamın adı və
 * şəkli var. Reytinq isə açıqdır — o, satış üzüdür.
 *
 * QONAQ üçün vəsiqə YOXDUR: profil sətri ola bilər (ilk işi bağlayanda
 * yaranır), amma nişan nömrəsi verilmir və kart əvəzinə qeydiyyat çağırışı
 * göstərilir. Kartın qazanılan bir şey olması bütün mexanizmin özəyidir.
 */
class DossierProfileController extends Controller
{
    public function __construct(
        private readonly ProfileService $profiles,
        private readonly RankService $ranks,
        private readonly CardRenderer $cards,
    ) {
    }

    public function show(Request $request): Response
    {
        $user = $request->visitor();

        if ($user->isGuest()) {
            return $this->noindex(response()->view('dossier.mustentiq', [
                'user'    => $user,
                'profile' => $this->profiles->find($user),
                'qonaq'   => true,
                'rutbeler' => Rank::query()->orderBy('level')->get(),
            ]));
        }

        $p = $this->profiles->ensure($user);
        $this->profiles->touch($p);

        return $this->noindex(response()->view('dossier.mustentiq', [
            'user'     => $user,
            'profile'  => $p->load('rank'),
            'qonaq'    => false,
            'kart'     => $this->cards->kart($p, 'vsq'),
            'irəli'    => $this->ranks->xpToNextRank($p),
            'rutbeler' => Rank::query()->orderBy('level')->get(),
            'isler'    => CaseCompletion::query()->with('dossier')
                ->where('profile_id', $p->id)->orderByDesc('completed_at')->get(),
            'movqe'    => $this->position($p),
            'emr'      => $this->pendingOrder($p),
        ]));
    }

    public function settings(Request $request): Response
    {
        $user = $request->visitor();

        if ($user->isGuest()) {
            return redirect()->route('dossier.profil');
        }

        $p = $this->profiles->ensure($user);

        return $this->noindex(response()->view('dossier.ayarlar', [
            'user'    => $user,
            'profile' => $p->load('rank'),
            'sobeler' => (array) config('dossier.sobeler'),
        ]));
    }

    /* ----------------------------------------------------------------
     | Yazılar — hamısı eyni qapıdan
     |---------------------------------------------------------------- */

    public function saveName(Request $request): RedirectResponse
    {
        return $this->write($request, function (InvestigatorProfile $p) use ($request): string {
            $this->profiles->setDisplayName($p, $request->input('ad'));

            return 'Ad yeniləndi.';
        });
    }

    public function saveDepartment(Request $request): RedirectResponse
    {
        return $this->write($request, function (InvestigatorProfile $p) use ($request): string {
            $evvel = $p->hasBadge();
            $this->profiles->chooseDepartment($p, $request->input('sobe'));

            return $evvel
                ? 'Şöbə dəyişdirildi. Vəsiqə nömrəsi olduğu kimi qalır.'
                : 'Təyinat verildi. Vəsiqə nömrəniz: ' . $p->refresh()->badge_number;
        });
    }

    public function savePrivacy(Request $request): RedirectResponse
    {
        return $this->write($request, function (InvestigatorProfile $p) use ($request): string {
            $this->profiles->setPrivacy($p, $request->boolean('ictimai'));

            return $p->is_public
                ? 'Profiliniz reytinqdə görünür.'
                : 'Profiliniz reytinqdən çıxarıldı. Öz mövqeyinizi burada görürsünüz.';
        });
    }

    /**
     * PROFİL ŞƏKLİ.
     *
     * `Admin\DossierImageController::store()` naxışı, bir pillə sərt:
     *  · MIME qaydası yalnız İPUCUDUR — hökmü `Sekil::olcu()` verir
     *    (`getimagesizefromstring`), yəni uzantısı dəyişdirilmiş fayl keçmir;
     *  · GD-də yenidən kodlaşdırma faylın içindəki hər şeyi atır;
     *  · şəffaflıq AĞ üzərinə oturdulur, yoxsa PNG qara qayıdır;
     *  · fayl adı 32 təsadüfi hex simvoldur və public kökdən KƏNARDADIR.
     *
     * Vəziyyət `pending` olur: təsdiqə qədər şəkli yalnız sahibi görür.
     */
    public function storeAvatar(Request $request): RedirectResponse
    {
        $user = $request->visitor();

        if ($user->is_blocked) {
            return back()->withErrors(['profil' => 'Hesabınız məhdudlaşdırılıb.']);
        }

        if ($user->isGuest()) {
            return redirect()->route('dossier.hesab');
        }

        $cfg = (array) config('dossier.avatar');

        $request->validate([
            'foto' => ['required', 'file', 'mimes:jpeg,jpg,png,webp',
                'max:' . (int) ($cfg['max_bytes'] / 1024)],
        ], [], ['foto' => 'şəkil']);

        $binary = (string) file_get_contents($request->file('foto')->getRealPath());

        if (Sekil::olcu($binary) === null) {
            return back()->withErrors(['profil' => 'Şəkil oxunmadı. JPEG, PNG və ya WEBP göndərin.']);
        }

        $kvadrat = $this->kvadratKes($binary);

        if ($kvadrat === null) {
            return back()->withErrors(['profil' => 'Şəkil emal edilə bilmədi.']);
        }

        $tam   = Sekil::olcule($kvadrat, (int) $cfg['orijinal'], (int) $cfg['keyfiyyet']);
        $kicik = Sekil::olcule($kvadrat, (int) $cfg['olcu'], (int) $cfg['keyfiyyet']);

        if ($tam === null || $kicik === null) {
            return back()->withErrors(['profil' => 'Şəkil emal edilə bilmədi.']);
        }

        $p       = $this->profiles->ensure($user);
        $qovluq  = rtrim((string) $cfg['path'], '/') . '/' . $p->id;

        if (! is_dir($qovluq)) {
            @mkdir($qovluq, 0775, true);
        }

        $adTam   = Sekil::ad();
        $adKicik = Sekil::ad();
        file_put_contents($qovluq . '/' . $adTam, $tam);
        file_put_contents($qovluq . '/' . $adKicik, $kicik);

        $this->sil($p);

        $p->forceFill([
            'avatar_original_path' => $p->id . '/' . $adTam,
            'avatar_path'          => $p->id . '/' . $adKicik,
            'avatar_status'        => InvestigatorProfile::AVATAR_GOZLEYIR,
            'avatar_reason'        => '',
        ])->save();

        return back()->with('status', 'Şəkil yükləndi. Yoxlamadan sonra vəsiqədə görünəcək.');
    }

    /**
     * Şəkil verilməsi.
     *
     * TƏSDİQLƏNMƏMİŞ şəkli yalnız sahibi və idarəçi görür; başqası üçün
     * cavab **404-dür, 403 deyil** — «icazə yoxdur» mesajının özü məlumatdır
     * (`DossierService::imagePath()` ilə eyni qayda).
     */
    public function avatar(Request $request, int $profil): BinaryFileResponse|Response
    {
        $p = InvestigatorProfile::query()->find($profil);

        if ($p === null || $p->avatar_path === null) {
            return response('', 404);
        }

        $user  = $request->visitor();
        $ozu   = (int) $p->user_id === (int) $user->id;
        $admin = (bool) $user->is_admin;

        if (! $p->avatarPublic() && ! $ozu && ! $admin) {
            return response('', 404);
        }

        $ad = (string) $p->avatar_path;

        if (preg_match('#^[0-9]+/[a-f0-9]{32}\.jpg$#', $ad) !== 1) {
            return response('', 404);
        }

        $yol = rtrim((string) config('dossier.avatar.path'), '/') . '/' . $ad;

        if (! is_file($yol)) {
            return response('', 404);
        }

        return response()->file($yol, [
            'Content-Type'           => 'image/jpeg',
            'X-Content-Type-Options' => 'nosniff',
            'Cache-Control'          => 'private, max-age=600',
            'X-Robots-Tag'           => 'noindex',
        ]);
    }

    /**
     * MƏRKƏZDƏN KVADRAT KƏSİM.
     *
     * `Sekil::olcule()` kəsmir, yalnız kiçildir — yaxa kartındakı çərçivə isə
     * kvadratdır və uzun şəkil sıxılmış görünərdi.
     */
    protected function kvadratKes(string $binary): ?string
    {
        if (! function_exists('imagecreatefromstring')) {
            return null;
        }

        $src = @imagecreatefromstring($binary);

        if ($src === false) {
            return null;
        }

        $w = imagesx($src);
        $h = imagesy($src);
        $k = min($w, $h);

        $dst = imagecreatetruecolor($k, $k);
        // Şəffaflıq AĞ üzərinə — yoxsa PNG qara qayıdır.
        imagefilledrectangle($dst, 0, 0, $k, $k, imagecolorallocate($dst, 255, 255, 255));
        imagecopyresampled($dst, $src, 0, 0,
            (int) (($w - $k) / 2), (int) (($h - $k) / 2), $k, $k, $k, $k);

        ob_start();
        imagejpeg($dst, null, 95);

        return (string) ob_get_clean();
    }

    /** Köhnə faylları silir — hər yükləmə yeni ad alır. */
    protected function sil(InvestigatorProfile $p): void
    {
        $kok = rtrim((string) config('dossier.avatar.path'), '/');

        foreach ([$p->avatar_original_path, $p->avatar_path] as $ad) {
            if ($ad !== null && preg_match('#^[0-9]+/[a-f0-9]{32}\.jpg$#', (string) $ad) === 1) {
                @unlink($kok . '/' . $ad);
            }
        }
    }

    /** «Əmr»i oxunmuş sayır — bir dəfə göstərilir. */
    public function dismissOrder(Request $request, int $history): RedirectResponse
    {
        $user = $request->visitor();
        $p    = $this->profiles->find($user);

        if ($p !== null) {
            RankHistory::query()
                ->where('profile_id', $p->id)
                ->whereKey($history)
                ->whereNull('seen_at')
                ->update(['seen_at' => now()]);
        }

        return redirect()->route('dossier.profil');
    }

    /* ----------------------------------------------------------------
     | Köməkçilər
     |---------------------------------------------------------------- */

    /**
     * Yazı əməliyyatlarının ortaq qapısı.
     *
     * `is_blocked` BURADA yoxlanılır, middleware-də yox — bölmənin qalan yazı
     * uclarında da qayda belədir.
     */
    protected function write(Request $request, \Closure $is): RedirectResponse
    {
        $user = $request->visitor();

        if ($user->is_blocked) {
            return back()->withErrors(['profil' => 'Hesabınız məhdudlaşdırılıb.']);
        }

        if ($user->isGuest()) {
            return redirect()->route('dossier.hesab');
        }

        $p = $this->profiles->ensure($user);

        try {
            $mesaj = $is($p);
        } catch (\RuntimeException $e) {
            return back()->withErrors(['profil' => $this->xetaMetni($e->getMessage())]);
        }

        return back()->with('status', $mesaj);
    }

    protected function xetaMetni(string $kod): string
    {
        return match ($kod) {
            'bad_name'           => 'Bu ad qəbul edilmir. Qısa, real bir ad yazın.',
            'bad_department'     => 'Belə şöbə yoxdur.',
            'department_locked'  => 'Şöbə yalnız bir dəfə dəyişdirilə bilər.',
            default              => 'Əməliyyat alınmadı.',
        };
    }

    /**
     * Öz mövqeyi.
     *
     * `cached_rank_position` yalnız əsas sıralamanı izləyir və gizli profildə
     * də doludur — gizlətmək göstərim seçimidir, rütbə enməsi deyil. Sütun
     * hələ doldurulmayıbsa dəqiq say aparılır.
     */
    protected function position(InvestigatorProfile $p): ?int
    {
        if (! $p->hasBadge()) {
            return null;
        }

        if ($p->cached_rank_position !== null) {
            return (int) $p->cached_rank_position;
        }

        return 1 + InvestigatorProfile::query()
            ->whereNotNull('badge_number')
            ->where('xp', '>', (int) $p->xp)
            ->count();
    }

    /** Göstərilməmiş rütbə əmri. Yalnız YÜKSƏLİŞ yazılır (bax `RankService`). */
    protected function pendingOrder(InvestigatorProfile $p): ?RankHistory
    {
        return RankHistory::query()->with(['oldRank', 'newRank'])
            ->where('profile_id', $p->id)
            ->whereNull('seen_at')
            ->orderByDesc('awarded_at')
            ->first();
    }

    protected function noindex(Response $response): Response
    {
        return $response->header('X-Robots-Tag', 'noindex, nofollow, noarchive');
    }
}
