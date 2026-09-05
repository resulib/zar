<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Dossier;
use App\Models\DossierDocument;
use App\Models\DossierProgress;
use App\Models\User;
use App\Services\DossierService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * İş qovluğunun API-si.
 *
 * Hər sorğu eyni üç addımdan keçir: ziyarətçi tanınır → qovluq tapılır →
 * GİRİŞ YOXLANILIR. Sonuncu olmadan sənədlərin məzmunu ödəniş etməmiş
 * adama gedərdi, yəni ödəniş qatı yalnız görünüş olardı.
 */
class DossierController extends Controller
{
    public function __construct(private readonly DossierService $dossiers)
    {
    }

    /** Qovluğu açır: adı yazır, lazımsa krediti xərcləyir, sayğacı başladır. */
    public function open(Request $request, string $slug): JsonResponse
    {
        $user = $request->visitor();

        if ($user->is_blocked) {
            return $this->err('blocked', 'Hesab məhdudlaşdırılıb.', 403);
        }

        $dossier = $this->dossiers->find($slug);

        if ($dossier === null) {
            return $this->err('not_found', 'Qovluq tapılmadı.', 404);
        }

        try {
            $p = $this->dossiers->open($user, $dossier, $request->input('ad'));
        } catch (\RuntimeException $e) {
            return $this->fromException($e);
        }

        return response()->json([
            'ok'         => true,
            'state'      => $p->toStateArray(),
            'credits'    => (int) $user->credits,
            'meta'       => (array) $dossier->meta,
            /* Şübhəlilər KÖRPÜDƏN keçir: mövcud üç iş `dossiers.suspects`
               JSON sütununu, idarə panelindən qurulan işlər isə
               `dossier_suspects` cədvəlini işlədir. Tel formatı eynidir,
               ona görə `dossier.js` heç nə bilmir. */
            'suspects'   => $dossier->suspectList(),
            'chronology' => (array) $dossier->chronology,
            /* Sonluq rejimi TÖRƏMƏDİR — sonluğu olan şübhəlilərin id-ləri.
               MƏTN GÖNDƏRİLMİR: hökmlər seçimdən sonra gəlir, yoxsa oyunun
               sonu DevTools açan hər kəsə çatardı. */
            'endings'    => $this->dossiers->endingSuspectIds($dossier),
            'questions'  => $dossier->questions->map->toListArray()->all(),
            /* SONLUQ VƏRƏQLƏRİ SİYAHIDA YOXDUR — adı belə sızmamalıdır. */
            'docs'       => $dossier->documents->where('is_spoiler', false)->map(
                fn ($d) => $d->toListArray($this->dossiers->isUnlocked($p, $d))
            )->all(),
        ]);
    }

    /** Bir sənədin gövdəsi. Məzmun YALNIZ buradan çıxır. */
    public function document(Request $request, string $slug, int $id): JsonResponse
    {
        [$err, $dossier, $p, $user] = $this->giris($request, $slug);

        if ($err !== null) {
            return $err;
        }

        $doc = $this->dossiers->document($dossier, $id);

        if ($doc === null) {
            return $this->err('not_found', 'Sənəd tapılmadı.', 404);
        }

        /* SIRA QAPISI. Qabıq da bunu göstərir, amma qərarı server verir —
           bu ünvan birbaşa da çağırıla bilər. */
        if (! $this->dossiers->reachable($dossier, $doc, $p)) {
            return $this->err('sira', 'Əvvəlki vərəqi keçmədən bu vərəq açılmır.', 403);
        }

        $this->dossiers->markRead($p, $doc);

        return response()->json([
            'ok'     => true,
            'id'     => (int) $doc->id,
            'name'   => (string) $doc->name,
            'page'   => (string) $doc->page,
            'locked' => ! $this->dossiers->isUnlocked($p, $doc),
            'spoiler' => (bool) $doc->is_spoiler,
            'pinned' => $p->marked('pinned_ids', (int) $doc->id),
            'html'   => $this->dossiers->renderDocument($dossier, $doc, $p),
        ]);
    }

    /** Qeyd dəftərinə sancır / çıxarır. */
    public function pin(Request $request, string $slug, int $id): JsonResponse
    {
        [$err, $dossier, $p] = $this->giris($request, $slug);

        if ($err !== null) {
            return $err;
        }

        $doc = $this->dossiers->document($dossier, $id);

        if ($doc === null) {
            return $this->err('not_found', 'Sənəd tapılmadı.', 404);
        }

        return response()->json([
            'ok'     => true,
            'pinned' => $this->dossiers->togglePin($p, $doc),
            'list'   => $p->ids('pinned_ids'),
        ]);
    }

    /**
     * Kilidin açılması.
     *
     * Səhv koda cavab qısadır: nə kod, nə də ipucu qaytarılır. Dörd rəqəm
     * onsuz da az variantdır — qorunma `throttle:dossier-kilid` limitidir.
     */
    public function unlock(Request $request, string $slug, int $id): JsonResponse
    {
        [$err, $dossier, $p] = $this->giris($request, $slug);

        if ($err !== null) {
            return $err;
        }

        $doc = $this->dossiers->document($dossier, $id);

        if ($doc === null || ! $doc->is_locked) {
            return $this->err('not_found', 'Sənəd tapılmadı.', 404);
        }

        if (! $this->dossiers->unlock($p, $doc, $request->input('kod'))) {
            return response()->json(['ok' => false, 'message' => 'Kod uyğun gəlmir'], 422);
        }

        return response()->json([
            'ok'   => true,
            'html' => $this->dossiers->renderDocument($dossier, $doc, $p),
            'docs' => $dossier->documents->where('is_spoiler', false)->map(
                fn (DossierDocument $d) => $d->toListArray($this->dossiers->isUnlocked($p, $d))
            )->all(),
        ]);
    }

    /** Yekun rəy. Hansı bəndin səhv olduğu heç vaxt qaytarılmır. */
    public function verdict(Request $request, string $slug): JsonResponse
    {
        [$err, $dossier, $p] = $this->giris($request, $slug);

        if ($err !== null) {
            return $err;
        }

        /* Bütün vərəqlər keçilməyibsə rəy qəbul edilmir — və bu, CƏHD DƏ SAYILMIR.
           Yoxsa qapını tanımayan qabıq üç cəhdi boş yerə yandırardı. */
        if (! $this->dossiers->allRead($dossier, $p)) {
            return $this->err('sira', 'Bütün vərəqləri oxumadan yekun rəy verilmir.', 403);
        }

        $cavablar = $request->input('cavablar');

        if (! is_array($cavablar)) {
            return $this->err('bad_answers', 'Cavablar oxunmadı.', 422);
        }

        return response()->json(['ok' => true] + $this->dossiers->submit($dossier, $p, $cavablar));
    }

    /**
     * Şübhəli seçimi — sonluq rejimi.
     *
     * `verdict()` ilə eyni qapıdan keçir: bütün vərəqlər oxunmayıbsa 403.
     * İşin sonluğu yoxdursa bu uc nöqtə ümumiyyətlə işləmir — rejim
     * törəmədir və qabıq onu göstərmir, amma qabığın bilməməsi qorunma
     * deyil, ona görə yoxlama serverdədir.
     */
    public function ending(Request $request, string $slug): JsonResponse
    {
        [$err, $dossier, $p] = $this->giris($request, $slug);

        if ($err !== null) {
            return $err;
        }

        if (! $dossier->hasEndings()) {
            return $this->err('no_endings', 'Bu iş sonluq rejimində deyil.', 404);
        }

        if (! $this->dossiers->allRead($dossier, $p)) {
            return $this->err('sira', 'Bütün vərəqləri oxumadan qərar verilmir.', 403);
        }

        try {
            return response()->json($this->dossiers->chooseSuspect($dossier, $p, $request->input('subheli')));
        } catch (\RuntimeException $e) {
            return $this->fromException($e);
        }
    }

    /**
     * «Yenidən oyna».
     *
     * Yalnız seçimi sıfırlayır: açılmış kodlar və oxunmuş vərəqlər qalır —
     * «sessiyadakı açılmış kodlar sıfırlanmasın».
     */
    public function replay(Request $request, string $slug): JsonResponse
    {
        [$err, , $p] = $this->giris($request, $slug);

        if ($err !== null) {
            return $err;
        }

        return response()->json(['ok' => true, 'state' => $this->dossiers->replay($p)->toStateArray()]);
    }

    /** Sertifikat şəkli — gövdə xam JPEG-dir (base64 deyil). */
    public function certificate(Request $request, string $slug): JsonResponse
    {
        [$err, $dossier, $p, $user] = $this->giris($request, $slug);

        if ($err !== null) {
            return $err;
        }

        try {
            $p = $this->dossiers->storeCert($p, (string) $request->getContent());
        } catch (\RuntimeException $e) {
            return $this->fromException($e);
        }

        return response()->json(['ok' => true, 'certToken' => (string) $p->cert_token]);
    }

    /* ----------------------------------------------------------------
     | Köməkçilər
     |---------------------------------------------------------------- */

    /**
     * Ziyarətçi + qovluq + giriş yoxlaması.
     *
     * @return array{0:JsonResponse|null,1:Dossier,2:DossierProgress,3:User}|array{0:JsonResponse,1:null,2:null,3:null}
     */
    protected function giris(Request $request, string $slug): array
    {
        $user = $request->visitor();

        if ($user->is_blocked) {
            return [$this->err('blocked', 'Hesab məhdudlaşdırılıb.', 403), null, null, null];
        }

        $dossier = $this->dossiers->find($slug);

        if ($dossier === null) {
            return [$this->err('not_found', 'Qovluq tapılmadı.', 404), null, null, null];
        }

        $p = $this->dossiers->progress($user, $dossier);

        if ($p === null || ! $p->hasAccess()) {
            return [$this->err('locked', 'Qovluq hələ açılmayıb.', 403), null, null, null];
        }

        return [null, $dossier, $p, $user];
    }

    protected function fromException(\RuntimeException $e): JsonResponse
    {
        [$code, $message, $status] = match ($e->getMessage()) {
            'no_credits' => ['no_credits', 'Kredit çatmır.', 402],
            'moderation' => ['moderation', 'Adda qadağan olunmuş ifadə var.', 422],
            'bad_image'  => ['bad_image', 'Sertifikat şəkli qəbul edilmədi.', 422],
            'bad_suspect' => ['bad_suspect', 'Belə şübhəli yoxdur.', 422],
            'not_solved' => ['not_solved', 'İş hələ bağlanmayıb.', 409],
            default      => ['error', 'Əməliyyat alınmadı.', 500],
        };

        return $this->err($code, $message, $status);
    }

    protected function err(string $code, string $message, int $status): JsonResponse
    {
        return response()->json(['error' => $code, 'message' => $message], $status);
    }
}
