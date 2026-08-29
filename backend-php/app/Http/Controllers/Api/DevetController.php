<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invite;
use App\Models\InviteGuest;
use App\Models\Setting;
use App\Services\InviteService;
use App\Support\Devet;
use App\Support\Moderation;
use App\Support\Packs;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Dəvətnamə API-si.
 *
 * Açıq uc nöqtələr (`show`, `rsvp`) YALNIZ dərc olunmuş dəvətnaməni görür və
 * tokeni bilməyən adam heç nə tapa bilmir — dəvətnamə nə reyestrdə, nə
 * kataloqda, nə də ümumi siyahıdadır.
 */
class DevetController extends Controller
{
    public function __construct(private readonly InviteService $invites)
    {
    }

    /* ------------------------------------------------------------------ */
    /*  Sahib                                                              */
    /* ------------------------------------------------------------------ */

    public function store(Request $request): JsonResponse
    {
        $user = $request->visitor();

        if ($user->is_blocked) {
            return $this->err('blocked', 'Hesab məhdudlaşdırılıb.', 403);
        }

        $data = $this->validated($request);

        if ($bad = $this->moderate($data)) {
            return $bad;
        }

        try {
            $invite = $this->invites->create($user, $data);
        } catch (\RuntimeException $e) {
            return $this->fromException($e);
        }

        return response()->json($invite->toApiArray(withOwner: true));
    }

    public function update(Request $request, string $token): JsonResponse
    {
        $user = $request->visitor();

        if ($user->is_blocked) {
            return $this->err('blocked', 'Hesab məhdudlaşdırılıb.', 403);
        }

        $invite = $this->find($token);
        if ($invite === null) {
            return $this->err('not_found', 'Dəvətnamə tapılmadı.', 404);
        }

        $data = $this->validated($request);

        if ($bad = $this->moderate($data)) {
            return $bad;
        }

        try {
            $invite = $this->invites->update($user, $invite, $data);
        } catch (\RuntimeException $e) {
            return $this->fromException($e);
        }

        return response()->json($invite->toApiArray(withOwner: true));
    }

    public function publish(Request $request, string $token): JsonResponse
    {
        $user = $request->visitor();

        if ($user->is_blocked) {
            return $this->err('blocked', 'Hesab məhdudlaşdırılıb.', 403);
        }

        $invite = $this->find($token);
        if ($invite === null) {
            return $this->err('not_found', 'Dəvətnamə tapılmadı.', 404);
        }

        try {
            $invite = $this->invites->publish($user, $invite);
        } catch (\RuntimeException $e) {
            /* Kredit çatmayanda NEÇƏSİ çatmadığını da deyirik: paketlər
               1/3/10 kreditlikdir, tədbir isə bundan bahadır — «kredit
               çatmır» deyib susmaq istifadəçini yetərsiz paket alıb
               eyni pəncərəyə qayıtmağa məcbur edərdi. */
            if ($e->getMessage() === 'no_credits') {
                return response()->json([
                    'error'   => 'no_credits',
                    'message' => 'Kredit çatmır.',
                    'need'    => (int) config('devet.price_credits'),
                    'have'    => (int) $user->refresh()->credits,
                ], 402);
            }

            return $this->fromException($e);
        }

        return response()->json($invite->toApiArray(withOwner: true));
    }

    /**
     * Sosial önizləmə şəkli. Gövdə xam JPEG-dir (base64 deyil) — 1200×630
     * şəkil onsuz da ~100 KB-dır, base64 onu 33% şişirdərdi.
     */
    public function storeOg(Request $request, string $token): JsonResponse
    {
        $user = $request->visitor();

        if ($user->is_blocked) {
            return $this->err('blocked', 'Hesab məhdudlaşdırılıb.', 403);
        }

        $invite = $this->find($token);
        if ($invite === null) {
            return $this->err('not_found', 'Dəvətnamə tapılmadı.', 404);
        }

        try {
            $invite = $this->invites->storeOg($user, $invite, $request->getContent());
        } catch (\RuntimeException $e) {
            return $this->fromException($e);
        }

        return response()->json(['ok' => true, 'ogReady' => true]);
    }

    /** Sahibin qonaq siyahısı — cavablarla birlikdə. */
    public function guests(Request $request, string $token): JsonResponse
    {
        $user = $request->visitor();
        $invite = $this->find($token);

        if ($invite === null || (int) $invite->user_id !== (int) $user->id) {
            return $this->err('not_found', 'Dəvətnamə tapılmadı.', 404);
        }

        $guests = $invite->guests()->get();

        return response()->json([
            'guests' => $guests->map(fn (InviteGuest $g) => $g->toApiArray() + [
                'link' => $g->hasLink() ? $invite->link((string) $g->token) : null,
            ])->all(),
            'yekun' => Devet::tally($guests),
        ]);
    }

    public function syncGuests(Request $request, string $token): JsonResponse
    {
        $user = $request->visitor();

        if ($user->is_blocked) {
            return $this->err('blocked', 'Hesab məhdudlaşdırılıb.', 403);
        }

        $invite = $this->find($token);
        if ($invite === null) {
            return $this->err('not_found', 'Dəvətnamə tapılmadı.', 404);
        }

        $moderation = $this->moderation();
        $names = $request->input('names');

        if ($moderation->flagged(is_array($names) ? implode(' ', array_map('strval', $names)) : (string) $names)) {
            return $this->err('moderation', 'Siyahıda qadağan olunmuş ifadə var.', 422);
        }

        try {
            $this->invites->syncGuests($user, $invite, $names);
        } catch (\RuntimeException $e) {
            return $this->fromException($e);
        }

        return $this->guests($request, $token);
    }

    /* ------------------------------------------------------------------ */
    /*  Qonaq — açıq                                                       */
    /* ------------------------------------------------------------------ */

    /**
     * Dəvətnamənin tam məzmunu. ÜNVAN VƏ TELEFON MƏHZ BURADAN gəlir —
     * server HTML-ində və sosial önizləmədə yoxdur, yəni yalnız linki
     * açan adam görür.
     */
    public function show(Request $request, string $token, ?string $guestToken = null): JsonResponse
    {
        $invite = $this->findPublished($token);

        if ($invite === null) {
            return $this->err('not_found', 'Dəvətnamə tapılmadı.', 404);
        }

        $out = $invite->toApiArray();
        $out['guest'] = null;

        if ($guestToken !== null && Devet::isToken($guestToken)) {
            $guest = $invite->guests()->where('token', $guestToken)->first();

            if ($guest !== null) {
                $this->invites->markOpened($guest);
                $out['guest'] = [
                    'name'  => $guest->name,
                    'rsvp'  => $guest->rsvp,
                    'count' => $guest->rsvp_count,
                    'note'  => $guest->rsvp_note,
                ];
            }
        }

        $this->countView($request, $invite);

        return response()->json($out);
    }

    public function rsvp(Request $request, string $token, ?string $guestToken = null): JsonResponse
    {
        $invite = $this->findPublished($token);

        if ($invite === null) {
            return $this->err('not_found', 'Dəvətnamə tapılmadı.', 404);
        }

        $data = $request->validate([
            'rsvp'  => ['required', 'string', 'max:12'],
            'count' => ['nullable', 'integer', 'min:1', 'max:' . (int) config('devet.limits.party')],
            'name'  => ['nullable', 'string', 'max:' . (int) config('devet.limits.guest')],
            'note'  => ['nullable', 'string', 'max:200'],
        ]);

        if ($this->moderation()->flagged((string) ($data['name'] ?? ''), (string) ($data['note'] ?? ''))) {
            return $this->err('moderation', 'Mətndə qadağan olunmuş ifadə var.', 422);
        }

        $guest = null;
        if ($guestToken !== null && Devet::isToken($guestToken)) {
            $guest = $invite->guests()->where('token', $guestToken)->first();
        }

        try {
            $this->invites->rsvp($invite, $guest, $data);
        } catch (\RuntimeException $e) {
            return $this->fromException($e);
        }

        return response()->json(['ok' => true]);
    }

    /** Neytral adlı kredit paketləri — qonaq kənar məhsulun lüğətini görməməlidir. */
    public function packs(): JsonResponse
    {
        $packs = (new Packs((array) config('zarafat.packs')))->all();
        $labels = (array) config('devet.pack_labels');

        return response()->json([
            'packs' => array_values(array_map(static function (array $p) use ($labels): array {
                $l = $labels[$p['id']] ?? [];

                return [
                    'id'      => $p['id'],
                    'credits' => $p['credits'],
                    'amount'  => $p['amount'],
                    'label'   => $l['label'] ?? ($p['credits'] . ' kredit'),
                    'note'    => $l['note'] ?? '',
                    'best'    => (bool) ($p['best'] ?? false),
                ];
            }, $packs)),
            'price' => (int) config('devet.price_credits'),
        ]);
    }

    /* ------------------------------------------------------------------ */
    /*  Daxili                                                             */
    /* ------------------------------------------------------------------ */

    protected function validated(Request $request): array
    {
        return $request->validate([
            'event'   => ['nullable', 'string', 'max:24'],
            'design'  => ['required', 'string', 'max:40'],
            'palette' => ['nullable', 'string', 'max:20'],
            'hosts'   => ['nullable', 'string', 'max:' . (int) config('devet.limits.hosts')],
            'title'   => ['nullable', 'string', 'max:' . (int) config('devet.limits.title')],
            'date'    => ['nullable', 'string', 'max:10'],
            'time'    => ['nullable', 'string', 'max:5'],
            'venue'   => ['nullable', 'string', 'max:' . (int) config('devet.limits.venue')],
            'address' => ['nullable', 'string', 'max:' . (int) config('devet.limits.address')],
            'mapUrl'  => ['nullable', 'string', 'max:' . (int) config('devet.limits.map_url')],
            'phone'   => ['nullable', 'string', 'max:' . (int) config('devet.limits.phone')],
            'note'    => ['nullable', 'string', 'max:' . (int) config('devet.limits.note')],
            'rsvp'    => ['nullable', 'boolean'],
        ]);
    }

    protected function moderation(): Moderation
    {
        return new Moderation(
            Setting::get('banned_words', (string) config('zarafat.banned_words')) ?? ''
        );
    }

    /* Dəvətnamə mətni açıq səhifədə görünür — süzgəcdən kənarda qalan
       hər yeni sahə qadağan olunmuş söz filtrini keçmək üçün açıq qapıdır. */
    protected function moderate(array $data): ?JsonResponse
    {
        $flagged = $this->moderation()->flagged(
            (string) ($data['hosts'] ?? ''),
            (string) ($data['title'] ?? ''),
            (string) ($data['venue'] ?? ''),
            (string) ($data['address'] ?? ''),
            (string) ($data['note'] ?? ''),
        );

        return $flagged
            ? $this->err('moderation', 'Mətndə qadağan olunmuş ifadə var.', 422)
            : null;
    }

    protected function find(string $token): ?Invite
    {
        return Devet::isToken($token)
            ? Invite::visible()->where('token', $token)->first()
            : null;
    }

    protected function findPublished(string $token): ?Invite
    {
        return Devet::isToken($token)
            ? Invite::published()->where('token', $token)->first()
            : null;
    }

    /** Bir saatda bir ziyarətçidən bir baxış — RegistryController ilə eyni qayda. */
    protected function countView(Request $request, Invite $invite): void
    {
        $who = $request->attributes->get('visitor')?->id ?? $request->ip();

        if (\Illuminate\Support\Facades\Cache::add('devet:' . $invite->id . ':' . $who, 1, now()->addHour())) {
            $invite->increment('views');
        }
    }

    protected function fromException(\RuntimeException $e): JsonResponse
    {
        [$code, $message, $status] = match ($e->getMessage()) {
            'forbidden'     => ['forbidden', 'Bu dəvətnamə sizin deyil.', 403],
            'removed'       => ['removed', 'Dəvətnamə silinib.', 410],
            'no_credits'    => ['no_credits', 'Kredit çatmır.', 402],
            'bad_design'    => ['bad_design', 'Dizayn tapılmadı — səhifəni yeniləyin.', 422],
            'bad_image'     => ['bad_image', 'Önizləmə şəkli qəbul edilmədi.', 422],
            'bad_rsvp'      => ['bad_rsvp', 'Cavab düzgün deyil.', 422],
            'rsvp_off'      => ['rsvp_off', 'Bu dəvətnamədə cavab yığımı bağlıdır.', 409],
            'not_published' => ['not_published', 'Dəvətnamə hələ dərc olunmayıb.', 409],
            default         => ['error', 'Əməliyyat alınmadı.', 500],
        };

        return $this->err($code, $message, $status);
    }

    protected function err(string $code, string $message, int $status): JsonResponse
    {
        return response()->json(['error' => $code, 'message' => $message], $status);
    }
}
