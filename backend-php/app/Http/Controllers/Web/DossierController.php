<?php

declare(strict_types=1);

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Dossier;
use App\Models\DossierProgress;
use App\Models\User;
use App\Services\DossierService;
use App\Support\Dossier\Dossier as Kod;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

/**
 * İş qovluğu bölməsinin səhifələri.
 *
 * Üç üz var və üçü də ayrı işə yarayır:
 *   `/is`                 — satış üzü: hero, necə işləyir, kataloq, nümunə vərəqlər
 *   `/is/{slug}`          — bir işin təqdimatı: spoiler yox, statistika var
 *   `/is/{slug}/qovluq`   — oyunun özü
 *
 * İLK İKİSİ AXTARIŞA AÇIQDIR, sonuncu deyil. Bölmə əvvəllər tam bağlı idi,
 * çünki qayda dəvətnamə bölməsindən köçürülmüşdü — orada səbəb məxfilikdir
 * (qonağın ünvanı, telefonu). İş qovluğu kataloqu isə satılan məhsuldur:
 * tapılmayan satış üzü satış üzü deyil.
 */
class DossierController extends Controller
{
    public function __construct(private readonly DossierService $dossiers)
    {
    }

    /** Ana səhifə. Kataloq onun bir bölməsidir. */
    public function index(Request $request): Response
    {
        $list = Dossier::published()->withCount('documents')
            ->orderBy('sort')->orderBy('id')->get();

        $showcase = $list->firstWhere('is_showcase', true) ?? $list->first();

        /* Nümunə vərəqlər BURADA render olunur, Blade-də yox: servis çağırışı
           görünüşdə yeri deyil və eyni sənəd həm hero-da, həm lentdə lazımdır. */
        $numune = $showcase === null ? [] : $this->dossiers->samples($showcase)
            ->map(fn ($d) => ['doc' => $d, 'html' => $this->dossiers->renderPublic($showcase, $d)])
            ->filter(fn ($n) => $n['html'] !== '')
            ->values()->all();

        return response()->view('dossier.ana', [
            'list'     => $list,
            'acilan'   => $this->opened($request),
            'showcase' => $showcase,
            'numune'   => $numune,
            'hero'     => $numune[0]['html'] ?? '',
            'yazisma'  => collect($numune)->firstWhere(fn ($n) => $n['doc']->type === 'yazisma')['html'] ?? '',
            /* SONUNCU sual, birinci deyil: onun variantları sənəd adlarıdır,
               şübhəli adları yox. `reorder()` mütləqdir — `questions()`
               münasibəti onsuz da `sort ASC` tətbiq edir və `orderByDesc`
               ona yalnız ikinci açar kimi əlavə olunardı. */
            'sual'     => $showcase?->questions()->reorder('sort', 'desc')->first(),
        ]);
    }

    /**
     * İşin təqdimat səhifəsi.
     *
     * Materialların ADLARI görünür, məzmunu yox — adam nə alacağını görür,
     * hekayəni yox. Statistika buradadır, çünki «neçə faizi ilk cəhddə tapıb»
     * bu səhifənin ən güclü arqumentidir.
     */
    public function show(Request $request, string $slug): Response
    {
        $dossier = $this->dossiers->find($slug);

        abort_if($dossier === null, 404);

        $user = $this->viewer($request);
        $p = $user === null ? null : $this->dossiers->progress($user, $dossier);

        return response()->view('dossier.teqdimat', [
            'dossier' => $dossier,
            'docs'    => $dossier->documents,
            'stats'   => $dossier->stats(),
            'access'  => $p?->hasAccess() === true,
            'solved'  => $p?->solved === true,
        ]);
    }

    /** Oyunun özü. Bura axtarışa bağlıdır. */
    public function play(Request $request, string $slug): Response
    {
        $dossier = $this->dossiers->find($slug);

        abort_if($dossier === null, 404);

        $user = $this->viewer($request);
        $p = $user === null ? null : $this->dossiers->progress($user, $dossier);
        $access = $p?->hasAccess() === true;

        /* Ödəniş olmayana yalnız üz qabığı, təsvir və sənəd ADLARI gedir.
           Şübhəlilər, xronologiya, suallar və sənəd məzmunu serverdən
           ümumiyyətlə çıxmır — gizlədilmir, göndərilmir. */
        $data = [
            'slug'   => (string) $dossier->slug,
            'no'     => (string) $dossier->no,
            'title'  => (string) $dossier->title,
            'blurb'  => (string) $dossier->blurb,
            'price'  => (int) $dossier->price_credits,
            'cover'  => (array) $dossier->cover,
            'axis'   => $dossier->axisLabels(),
            'access' => $access,
            'docs'   => $dossier->documents->map(
                fn ($d) => $d->toListArray($p !== null && $this->dossiers->isUnlocked($p, $d))
            )->all(),
        ];

        if ($access && $p !== null) {
            $data['meta'] = (array) $dossier->meta;
            $data['suspects'] = (array) $dossier->suspects;
            $data['chronology'] = (array) $dossier->chronology;
            $data['questions'] = $dossier->questions->map->toListArray()->all();
            $data['state'] = $p->toStateArray();
            $data['solution'] = ($p->solved || $p->revealed)
                ? array_values(array_map('strval', (array) $dossier->solution))
                : null;
        }

        return $this->noindex(response()->view('dossier.oyun', [
            'dossier' => $dossier,
            'data'    => $data,
            'access'  => $access,
        ]));
    }

    /** Şərtlər və məxfilik — qısa səhifə. */
    public function terms(): Response
    {
        return response()->view('dossier.qaydalar');
    }

    /**
     * Sertifikat səhifəsi — paylaşılan link.
     *
     * SPOILER SAXLAMIR: qatilin adı, motiv və sənəd məzmunu burada yoxdur,
     * çünki bu link dosta göndərilir və onun oyununu korlamamalıdır.
     * Axtarışa bağlıdır — link istifadəçinin adını daşıyır.
     */
    public function certificate(string $slug, string $token): Response
    {
        $dossier = $this->dossiers->find($slug);
        $p = $dossier === null ? null : $this->dossiers->byCertToken($token);

        abort_if($dossier === null || $p === null || (int) $p->dossier_id !== (int) $dossier->id, 404);

        return $this->noindex(response()->view('dossier.hesabat', [
            'dossier' => $dossier,
            'p'       => $p,
            'minutes' => Kod::deqiqe($p->duration_seconds),
            'pinned'  => count($p->ids('pinned_ids')),
            'og'      => [
                'title'       => 'İş № ' . $dossier->no . ' bağlandı',
                'description' => ($p->investigator !== '' ? $p->investigator . ' — ' : '')
                    . Kod::deqiqe($p->duration_seconds) . ' dəqiqə, '
                    . count($p->ids('pinned_ids')) . ' sancılmış sənəd.',
                'image'       => $p->cert_ready
                    ? Kod::certLink((string) config('dossier.public_url'), (string) $dossier->slug, (string) $p->cert_token) . '/on.jpg'
                    : '',
            ],
        ]));
    }

    /**
     * Sertifikat şəkli.
     *
     * Fayl public kökdən kənarda saxlanılır və buradan SABİT `image/jpeg`
     * başlığı ilə verilir: yüklənən fayl heç bir halda icra oluna bilməz.
     */
    public function certificateImage(string $slug, string $token): Response|BinaryFileResponse
    {
        $dossier = $this->dossiers->find($slug);
        $p = $dossier === null ? null : $this->dossiers->byCertToken($token);

        if ($dossier === null || $p === null || (int) $p->dossier_id !== (int) $dossier->id) {
            return response('', 404);
        }

        $path = $this->dossiers->certPath($p);

        if ($path === null) {
            return response('', 404);
        }

        return response()->file($path, [
            'Content-Type'           => 'image/jpeg',
            'X-Content-Type-Options' => 'nosniff',
            'Cache-Control'          => 'public, max-age=600',
            'X-Robots-Tag'           => 'noindex',
        ]);
    }

    /* ----------------------------------------------------------------
     | Köməkçilər
     |---------------------------------------------------------------- */

    /** @return array<int,bool> qovluq id → həll olunub? */
    protected function opened(Request $request): array
    {
        $user = $this->viewer($request);

        if ($user === null) {
            return [];
        }

        return DossierProgress::query()
            ->where('user_id', $user->id)
            ->whereNotNull('access_at')
            ->pluck('solved', 'dossier_id')
            ->all();
    }

    /**
     * Tanınmış ziyarətçi — YOXDURSA yaradılmır.
     *
     * `$request->visitor()` sətri özü yaradır; sadə GET sorğusunda bunu
     * çağırmaq axtarış robotları üçün `users` cədvəlini doldurardı.
     */
    protected function viewer(Request $request): ?User
    {
        $v = $request->attributes->get('visitor');

        return $v instanceof User ? $v : null;
    }

    protected function noindex(Response $response): Response
    {
        return $response->header('X-Robots-Tag', 'noindex, nofollow, noarchive');
    }
}
