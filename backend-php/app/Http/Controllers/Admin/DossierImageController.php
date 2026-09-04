<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Dossier;
use App\Models\DossierImage;
use App\Support\Dossier\Isare;
use App\Support\Dossier\Sekil;
use App\Support\Sanitizer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

/**
 * Şəkil kitabxanası — yükləmə, redaktə, silmə və idarəçi üçün verilmə.
 *
 * Yükləmə burada MULTIPART-dır, dəvətnamə və sosial kart axınlarından fərqli
 * olaraq: onlarda şəkli brauzer kətanda çəkir və xam bayt kimi göndərir, burada
 * isə idarəçi hazır faylı sürüşdürüb atır.
 *
 * Verilmə isə eyni naxışdadır — fayl public kökdən kənardadır və sabit
 * `image/jpeg` başlığı ilə axıdılır.
 */
class DossierImageController extends Controller
{
    public function store(Request $request, Dossier $dossier): JsonResponse
    {
        $cfg = (array) config('dossier.sekil');

        $request->validate([
            'sekil'  => ['required', 'file', 'mimes:jpeg,jpg,png,webp', 'max:' . (int) ($cfg['max_bytes'] / 1024)],
            'slug'   => ['nullable', 'string', 'max:60'],
            'izah'   => ['nullable', 'string', 'max:300'],
            'nov'    => ['nullable', Rule::in(config('dossier.sekil_novleri'))],
            'sahibi' => ['nullable', 'integer'],
        ], [], ['sekil' => 'şəkil', 'slug' => 'açar', 'izah' => 'izah']);

        $file = $request->file('sekil');
        $binary = (string) file_get_contents((string) $file->getRealPath());

        $olcu = Sekil::olcu($binary);

        if ($olcu === null) {
            return response()->json(['error' => 'bad_image', 'message' => 'Fayl şəkil deyil.'], 422);
        }

        $qovluq = rtrim((string) $cfg['path'], '/') . '/' . $dossier->id;

        if (! is_dir($qovluq) && ! @mkdir($qovluq, 0775, true) && ! is_dir($qovluq)) {
            return response()->json(['error' => 'bad_image', 'message' => 'Qovluq yaradılmadı.'], 500);
        }

        /* Üç ölçü, üç ayrı təsadüfi ad. Orijinal da yenidən kodlaşdırılır:
           gələn faylın içindəki hər şey — metadata, artıq baytlar — atılır. */
        $yollar = [];

        foreach (['original_path' => 4000, 'medium_path' => (int) $cfg['orta'], 'thumb_path' => (int) $cfg['kicik']] as $k => $hedd) {
            $jpeg = Sekil::olcule($binary, $hedd, (int) $cfg['keyfiyyet']);

            if ($jpeg === null) {
                return response()->json(['error' => 'bad_image', 'message' => 'Şəkil emal olunmadı (GD yoxdur?).'], 422);
            }

            $ad = Sekil::ad();
            file_put_contents($qovluq . '/' . $ad, $jpeg);
            $yollar[$k] = $dossier->id . '/' . $ad;
        }

        $slug = trim((string) $request->input('slug', ''));
        $slug = $slug === '' ? Isare::slugla((string) $file->getClientOriginalName()) : Isare::slugla($slug . '.x');

        $sekil = new DossierImage([
            'dossier_id'        => $dossier->id,
            'slug'              => $this->bosSlug($dossier, $slug),
            'caption'           => (string) $request->input('izah', ''),
            'image_type'        => Sanitizer::pick(
                (string) $request->input('nov', ''),
                (array) config('dossier.sekil_novleri'),
                DossierImage::NOV_GENERIC
            ),
            'owner_document_id' => $this->oznunSenedi($dossier, $request->input('sahibi')),
            'width'             => $olcu[0],
            'height'            => $olcu[1],
            'filesize'          => strlen($binary),
            'sort'              => (int) $dossier->images()->max('sort') + 1,
        ] + $yollar);

        $sekil->save();

        return response()->json([
            'ok'    => true,
            'id'    => (int) $sekil->id,
            'slug'  => (string) $sekil->slug,
            'izah'  => (string) $sekil->caption,
            'nov'   => (string) $sekil->image_type,
            'nisan' => Isare::yaz('sekil', (string) $sekil->slug),
            'thumb' => route('admin.dossier.image', [$sekil, 'kicik']),
        ]);
    }

    public function update(Request $request, Dossier $dossier, DossierImage $image): RedirectResponse
    {
        abort_if((int) $image->dossier_id !== (int) $dossier->id, 404);

        $data = $request->validate([
            'slug' => ['required', 'string', 'max:60'],
            'izah' => ['nullable', 'string', 'max:300'],
            'nov'  => ['required', Rule::in(config('dossier.sekil_novleri'))],
        ], [], ['slug' => 'açar', 'izah' => 'izah', 'nov' => 'növ']);

        $slug = Isare::slugla($data['slug'] . '.x');

        $image->forceFill([
            'slug'              => $this->bosSlug($dossier, $slug, (int) $image->id),
            'caption'           => (string) ($data['izah'] ?? ''),
            'image_type'        => $data['nov'],
            'owner_document_id' => $this->oznunSenedi($dossier, $request->input('sahibi')),
        ])->save();

        return back()->with('status', 'Şəkil yeniləndi.');
    }

    public function destroy(Dossier $dossier, DossierImage $image): RedirectResponse
    {
        abort_if((int) $image->dossier_id !== (int) $dossier->id, 404);

        $baza = rtrim((string) config('dossier.sekil.path'), '/');

        foreach (['original_path', 'medium_path', 'thumb_path'] as $k) {
            $yol = $baza . '/' . $image->{$k};

            if (is_file($yol)) {
                @unlink($yol);
            }
        }

        $image->delete();

        return back()->with('status', 'Şəkil silindi.');
    }

    /**
     * İdarəçi üçün verilmə — spoiler yoxlamaları KEÇİLİR.
     *
     * İdarəçi onsuz da bütün məzmunu yazan adamdır; kitabxanadakı thumb-lar
     * kilid vəziyyətinə görə gizlədilsəydi, redaktor işləməzdi.
     */
    public function show(DossierImage $image, string $olcu): Response|BinaryFileResponse
    {
        $ad = $image->pathFor($olcu);

        if (preg_match('#^[0-9]+/[a-f0-9]{32}\.jpg$#', $ad) !== 1) {
            return response('', 404);
        }

        $yol = rtrim((string) config('dossier.sekil.path'), '/') . '/' . $ad;

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

    /** İş daxilində unikal slug — təkrarda `-2`, `-3`. */
    protected function bosSlug(Dossier $dossier, string $slug, int $isteqna = 0): string
    {
        $slug = $slug === '' ? 'sekil' : $slug;
        $namizet = $slug;

        for ($i = 2; $i < 500; $i++) {
            $var = $dossier->images()
                ->where('slug', $namizet)
                ->where('id', '!=', $isteqna)
                ->exists();

            if (! $var) {
                return $namizet;
            }

            $namizet = mb_substr($slug, 0, 56) . '-' . $i;
        }

        return $slug . '-' . bin2hex(random_bytes(2));
    }

    protected function oznunSenedi(Dossier $dossier, mixed $id): ?int
    {
        $id = (int) $id;

        if ($id === 0) {
            return null;
        }

        return $dossier->documents()->whereKey($id)->exists() ? $id : null;
    }
}
