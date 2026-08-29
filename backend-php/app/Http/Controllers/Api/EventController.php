<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Models\DocumentEvent;
use App\Models\Template;
use App\Support\RegistryNumber;
use App\Support\ReplyKinds;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Cavab döngəsinin ölçülməsi.
 *
 * Bu, ümumi «hadisə yaz» qapısı DEYİL: `event` ağ siyahıdan seçilir, `kind`
 * mövcud niyyətlərdən biri olmalıdır və başqa heç bir sərbəst mətn qəbul
 * edilmir. Əks halda endpoint bazaya limitsiz yazma yolu olardı.
 */
class EventController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        if ($request->visitor()->is_blocked) {
            return response()->json(['error' => 'blocked'], 403);
        }

        $data = $request->validate([
            'event' => ['required', 'string', 'max:24'],
            'regNo' => ['nullable', 'string', 'max:20'],
            'kind'  => ['nullable', 'string', 'max:12'],
        ]);

        if (! in_array($data['event'], DocumentEvent::CLIENT_EVENTS, true)) {
            return response()->json(['error' => 'bad_event'], 422);
        }

        $kind = ReplyKinds::isValid($data['kind'] ?? null) ? $data['kind'] : null;

        /* Nömrə yalnız dərc olunmuş sənədə həll olunur. Tapılmasa hadisə
           sənədsiz yazılır — ölçmə itməsin, amma uydurma id də düşməsin. */
        $document = $this->resolve($data['regNo'] ?? null);

        DocumentEvent::record(
            $document?->id,
            $request->visitor()->id,
            $data['event'],
            $kind,
            $document === null ? null : $this->categorySlugOf($document),
            (int) ($document->reply_depth ?? 0),
        );

        return response()->json(['ok' => true]);
    }

    private function resolve(?string $regNo): ?Document
    {
        if ($regNo === null) {
            return null;
        }

        $regNo = strtoupper($regNo);

        if (! RegistryNumber::isValid($regNo)) {
            return null;
        }

        return Document::query()->published()->where('reg_no', $regNo)->first();
    }

    private function categorySlugOf(Document $document): ?string
    {
        if ($document->template_id === null) {
            return null;
        }

        return Template::query()
            ->where('slug', $document->template_id)
            ->with('category:id,slug')
            ->first()?->category?->slug;
    }
}
