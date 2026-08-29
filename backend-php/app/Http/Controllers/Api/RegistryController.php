<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Models\Template;
use App\Support\RegistryNumber;
use App\Support\ReplyKinds;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class RegistryController extends Controller
{
    /** Bir zəncirdə göstərilən sənədlərin tavanı. */
    private const CHAIN_LIMIT = 50;

    public function show(Request $request, string $regNo): JsonResponse
    {
        $regNo = strtoupper($regNo);

        if (! RegistryNumber::isValid($regNo)) {
            return response()->json(['error' => 'bad_reg_no'], 400);
        }

        /* `replyTo` sənədin üzərindəki cavab lentinə düşür, `replyCount` isə
           baxış səhifəsindəki «bu sənədə N cavab var» sətrinə. İkisi də burada
           yüklənir ki, `toApiArray()` əlavə sorğu açmasın. */
        $document = Document::query()
            ->published()
            ->with('replyTo:id,reg_no,title')
            ->withCount(['replies' => fn ($q) => $q->published()])
            ->where('reg_no', $regNo)
            ->first();

        if (! $document) {
            return response()->json(['error' => 'not_found'], 404);
        }

        self::countView($request, $document);

        return response()->json($document->toApiArray());
    }

    /**
     * Sənədin cavab zənciri — `/r/{regNo}` səhifəsindəki tarixçə.
     *
     * Yalnız dərc olunmuş sənədlər və yalnız açıq sahələr qaytarılır:
     * `show()` ilə eyni məxfilik səviyyəsi, sahib məlumatı yoxdur.
     */
    public function chain(string $regNo): JsonResponse
    {
        $regNo = strtoupper($regNo);

        if (! RegistryNumber::isValid($regNo)) {
            return response()->json(['error' => 'bad_reg_no'], 400);
        }

        $document = Document::query()->published()->where('reg_no', $regNo)->first();

        if (! $document) {
            return response()->json(['error' => 'not_found'], 404);
        }

        /* Kök `reply_root_id`-də saxlanılır, ona görə bütün zəncir bir SELECT-dir —
           rekursiv sorğuya ehtiyac yoxdur. */
        $root = $document->chainRootId();

        $items = Document::query()
            ->published()
            ->where(fn ($q) => $q->where('id', $root)->orWhere('reply_root_id', $root))
            ->orderBy('reply_depth')
            ->orderBy('id')
            ->limit(self::CHAIN_LIMIT)
            ->get(['id', 'reg_no', 'title', 'date_label', 'template_id',
                   'reply_depth', 'expires_at', 'cancelled_at', 'cancel_reason']);

        $kinds = $this->kindsFor($items->pluck('template_id')->filter()->unique()->all());

        return response()->json([
            'count' => $items->count(),
            'items' => $items->map(fn (Document $d): array => [
                'regNo'     => $d->reg_no,
                'title'     => $d->title,
                'date'      => $d->date_label,
                'depth'     => (int) $d->reply_depth,
                'state'     => $d->state(),
                'kind'      => $kinds[$d->template_id] ?? null,
                'kindLabel' => ReplyKinds::label($kinds[$d->template_id] ?? null),
                'current'   => $d->reg_no === $regNo,
            ])->values()->all(),
        ]);
    }

    /**
     * Şablon slug-ı → cavab niyyəti. Bir sorğu ilə hamısı yüklənir ki,
     * zəncirdə N+1 olmasın.
     *
     * @param  list<string>  $slugs
     * @return array<string, string>
     */
    private function kindsFor(array $slugs): array
    {
        if ($slugs === []) {
            return [];
        }

        return Template::query()
            ->whereIn('slug', $slugs)
            ->whereNotNull('reply_kind')
            ->pluck('reply_kind', 'slug')
            ->all();
    }

    /**
     * Baxış sayğacı ziyarətçi başına saatda bir dəfə artır.
     * Əks halda sadə döngə ilə istənilən sənədin sayğacı şişirdilə bilər.
     */
    public static function countView(Request $request, Document $document): void
    {
        $who = $request->attributes->get('visitor');
        $key = 'view:' . $document->id . ':' . ($who?->id ?? 'ip:' . $request->ip());

        if (Cache::add($key, 1, now()->addHour())) {
            $document->increment('views');
        }
    }
}
