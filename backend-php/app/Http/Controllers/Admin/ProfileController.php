<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\InvestigatorProfile;
use App\Services\RankService;
use App\Support\Sanitizer;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

/**
 * Müstəntiq profillərinin idarə edilməsi.
 *
 * İSTİFADƏÇİ SİYAHISI BURADA DEYİL — o, `Admin\UserController`-də genişləndirilib.
 * Bu kontroller yalnız siyahının ifadə edə bilmədiyini daşıyır: avatar
 * moderasiya növbəsi, əl ilə XP düzəlişi və rütbələrin yenidən hesablanması.
 */
class ProfileController extends Controller
{
    public function __construct(private readonly RankService $ranks)
    {
    }

    /** Avatar növbəsi — YALNIZ gözləyənlər. */
    public function avatars(): View
    {
        return view('admin.avatars', [
            'siyahi' => InvestigatorProfile::query()
                ->with('user')
                ->where('avatar_status', InvestigatorProfile::AVATAR_GOZLEYIR)
                ->orderBy('updated_at')
                ->paginate(24),
        ]);
    }

    public function approve(Request $request, InvestigatorProfile $profile): RedirectResponse
    {
        $profile->forceFill([
            'avatar_status' => InvestigatorProfile::AVATAR_TESDIQ,
            'avatar_reason' => '',
        ])->save();

        return back()->with('status', 'Şəkil təsdiqləndi.');
    }

    /**
     * Rədd — fayl SAXLANILIR.
     *
     * Silinsəydi, şikayət halında baxmaq mümkün olmazdı; üstəlik istifadəçi
     * səbəbi görüb yenidən yükləyə bilməlidir.
     */
    public function reject(Request $request, InvestigatorProfile $profile): RedirectResponse
    {
        $profile->forceFill([
            'avatar_status' => InvestigatorProfile::AVATAR_REDD,
            'avatar_reason' => Sanitizer::text($request->input('sebeb'), 160),
        ])->save();

        return back()->with('status', 'Şəkil rədd edildi.');
    }

    /** İdarəçi üçün şəkil — spoiler qapısı yoxdur, amma yol mühafizəsi var. */
    public function image(InvestigatorProfile $profile): BinaryFileResponse|Response
    {
        $ad = (string) ($profile->avatar_original_path ?? $profile->avatar_path);

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
            'Cache-Control'          => 'private, max-age=60',
            'X-Robots-Tag'           => 'noindex',
        ]);
    }

    /**
     * Əl ilə XP — səbəb MƏCBURİDİR.
     *
     * `RankService::adjust()` ledger sətri yazır və rütbəni yenidən hesablayır;
     * kontroller nə XP sütununa toxunur, nə də rütbə seçir.
     */
    public function xp(Request $request, InvestigatorProfile $profile): RedirectResponse
    {
        $data = $request->validate([
            'delta'  => ['required', 'integer', 'min:-100000', 'max:100000', 'not_in:0'],
            'sebeb'  => ['required', 'string', 'max:200'],
        ], [], ['delta' => 'xal', 'sebeb' => 'səbəb']);

        $this->ranks->adjust($profile, (int) $data['delta'],
            Sanitizer::text($data['sebeb'], 200), $request->user());

        return back()->with('status', 'Xal düzəlişi yazıldı. Yeni balans: ' . $profile->fresh()?->xp);
    }

    /**
     * BÜTÜN profilləri düsturdan yenidən hesablayır.
     *
     * `case_completions.difficulty` anlıq surətindən `Xp::hesabla()` ilə
     * hesablanır — köhnə rəqəmlər sadəcə toplanmır. Düymənin mənası budur:
     * düstur dəyişəndə keçmiş nəticələr də yeni qaydaya keçir.
     */
    public function recalculate(): RedirectResponse
    {
        $say = $this->ranks->recalculateAll();

        return back()->with('status', $say . ' profil yenidən hesablandı.');
    }
}
