<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Dossier;
use App\Models\DossierImage;
use App\Models\DossierPoolImage;
use App\Support\Dossier\Isare;
use App\Support\Dossier\Sekil;
use App\Support\Sanitizer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Validation\Rule;
use Illuminate\View\View;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

/**
 * Ümumi şəkil hovuzu — bütün işlər üçün bir kitabxana.
 *
 * Yükləmə və emal `DossierImageController`-in qaydasıdır: üç ölçü, üç ayrı
 * təsadüfi ad, hamısı GD-dən yenidən kodlaşdırılaraq keçir. Fərq yalnız
 * yerdədir — fayllar `hovuz/` qovluğunda yaşayır və heç bir işə bağlı deyil.
 *
 * «İşə köçür» KÖÇÜRMƏDİR, istinad deyil: işdə adi `dossier_images` sətri
 * yaranır və fayl surətlənir. İstinad olsaydı, oyunçu yolunun «şəkil bu işə
 * aiddir» qapısı və spoiler qoruması hovuz üçün yenidən qurulmalı olardı;
 * surət isə mövcud qaydaların hamısını dəyişmədən işlədir.
 */
class DossierPoolController extends Controller
{
    public function index(): View
    {
        return view('admin.dossier.hovuz', [
            'sekiller' => DossierPoolImage::query()->orderByDesc('id')->get(),
            'isler'    => Dossier::query()->orderBy('sort')->get(['id', 'slug', 'title']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $cfg = (array) config('dossier.sekil');

        $request->validate([
            'sekil' => ['required', 'file', 'mimes:jpeg,jpg,png,webp', 'max:' . (int) ($cfg['max_bytes'] / 1024)],
            'slug'  => ['nullable', 'string', 'max:60'],
            'izah'  => ['nullable', 'string', 'max:300'],
            'nov'   => ['nullable', Rule::in(config('dossier.sekil_novleri'))],
        ], [], ['sekil' => 'şəkil', 'slug' => 'açar', 'izah' => 'izah']);

        $file = $request->file('sekil');
        $binary = (string) file_get_contents((string) $file->getRealPath());

        $olcu = Sekil::olcu($binary);

        if ($olcu === null) {
            return back()->withErrors(['sekil' => 'Fayl şəkil deyil.']);
        }

        $yollar = $this->yaz($binary, $cfg);

        if ($yollar === null) {
            return back()->withErrors(['sekil' => 'Şəkil emal olunmadı (GD yoxdur?).']);
        }

        $slug = trim((string) $request->input('slug', ''));
        $slug = $slug === '' ? Isare::slugla((string) $file->getClientOriginalName()) : Isare::slugla($slug . '.x');

        DossierPoolImage::query()->create([
            'slug'       => $this->bosSlug($slug),
            'caption'    => (string) $request->input('izah', ''),
            'image_type' => Sanitizer::pick(
                (string) $request->input('nov', ''),
                (array) config('dossier.sekil_novleri'),
                DossierImage::NOV_GENERIC
            ),
            'width'      => $olcu[0],
            'height'     => $olcu[1],
            'filesize'   => strlen($binary),
        ] + $yollar);

        return back()->with('status', 'Şəkil hovuza əlavə olundu.');
    }

    public function update(Request $request, DossierPoolImage $image): RedirectResponse
    {
        $data = $request->validate([
            'slug' => ['required', 'string', 'max:60'],
            'izah' => ['nullable', 'string', 'max:300'],
            'nov'  => ['required', Rule::in(config('dossier.sekil_novleri'))],
        ], [], ['slug' => 'açar', 'izah' => 'izah', 'nov' => 'növ']);

        $image->forceFill([
            'slug'       => $this->bosSlug(Isare::slugla($data['slug'] . '.x'), (int) $image->id),
            'caption'    => (string) ($data['izah'] ?? ''),
            'image_type' => $data['nov'],
        ])->save();

        return back()->with('status', 'Şəkil yeniləndi.');
    }

    public function destroy(DossierPoolImage $image): RedirectResponse
    {
        $baza = rtrim((string) config('dossier.sekil.path'), '/');

        foreach (['original_path', 'medium_path', 'thumb_path'] as $k) {
            $yol = $baza . '/' . $image->{$k};

            if (is_file($yol)) {
                @unlink($yol);
            }
        }

        $image->delete();

        return back()->with('status', 'Şəkil hovuzdan silindi.');
    }

    /** İdarəçi üçün verilmə — `DossierImageController::show()`-un hovuz əkizi. */
    public function show(DossierPoolImage $image, string $olcu): Response|BinaryFileResponse
    {
        $ad = $image->pathFor($olcu);

        if (preg_match('#^hovuz/[a-f0-9]{32}\.jpg$#', $ad) !== 1) {
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

    /**
     * Hovuzdan işə köçürmə — işdə adi kitabxana şəkli yaranır.
     *
     * Fayllar TƏZƏ təsadüfi adlarla surətlənir: eyni ad iki işi bir-birinə
     * bağlayardı, ad isə heç nəyə işarə etməməlidir. `sahibi` verilibsə şəkil
     * həmin sənədə bağlanır və kilidli vərəqin spoiler qoruması avtomatik
     * işə düşür — yükləmə formasının qaydası.
     */
    public function copy(Request $request, Dossier $dossier, DossierPoolImage $image): RedirectResponse
    {
        $baza = rtrim((string) config('dossier.sekil.path'), '/');
        $qovluq = $baza . '/' . $dossier->id;

        if (! is_dir($qovluq) && ! @mkdir($qovluq, 0775, true) && ! is_dir($qovluq)) {
            return back()->withErrors(['sekil' => 'Qovluq yaradılmadı.']);
        }

        $yollar = [];

        foreach (['original_path', 'medium_path', 'thumb_path'] as $k) {
            $menbe = $baza . '/' . $image->{$k};

            if (! is_file($menbe)) {
                return back()->withErrors(['sekil' => 'Hovuzdakı fayl tapılmadı.']);
            }

            $ad = Sekil::ad();
            copy($menbe, $qovluq . '/' . $ad);
            $yollar[$k] = $dossier->id . '/' . $ad;
        }

        $sekil = new DossierImage([
            'dossier_id'        => $dossier->id,
            'slug'              => $this->isdeBosSlug($dossier, (string) $image->slug),
            'caption'           => (string) $image->caption,
            'image_type'        => (string) $image->image_type,
            'owner_document_id' => $this->oznunSenedi($dossier, $request->input('sahibi')),
            'width'             => (int) $image->width,
            'height'            => (int) $image->height,
            'filesize'          => (int) $image->filesize,
            'sort'              => (int) $dossier->images()->max('sort') + 1,
        ] + $yollar);

        $sekil->save();

        return back()->with('status', '«' . $sekil->slug . '» şəkli işin kitabxanasına köçürüldü.');
    }

    /** Üç ölçünü `hovuz/` qovluğuna yazır. @return array<string,string>|null */
    protected function yaz(string $binary, array $cfg): ?array
    {
        $qovluq = rtrim((string) $cfg['path'], '/') . '/hovuz';

        if (! is_dir($qovluq) && ! @mkdir($qovluq, 0775, true) && ! is_dir($qovluq)) {
            return null;
        }

        $yollar = [];

        foreach (['original_path' => 4000, 'medium_path' => (int) $cfg['orta'], 'thumb_path' => (int) $cfg['kicik']] as $k => $hedd) {
            $jpeg = Sekil::olcule($binary, $hedd, (int) $cfg['keyfiyyet']);

            if ($jpeg === null) {
                return null;
            }

            $ad = Sekil::ad();
            file_put_contents($qovluq . '/' . $ad, $jpeg);
            $yollar[$k] = 'hovuz/' . $ad;
        }

        return $yollar;
    }

    /** Hovuz daxilində unikal slug — təkrarda `-2`, `-3`. */
    protected function bosSlug(string $slug, int $isteqna = 0): string
    {
        $slug = $slug === '' ? 'sekil' : $slug;
        $namizet = $slug;

        for ($i = 2; $i < 500; $i++) {
            $var = DossierPoolImage::query()
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

    /** İş daxilində unikal slug — `DossierImageController::bosSlug()`-un əkizi. */
    protected function isdeBosSlug(Dossier $dossier, string $slug): string
    {
        $slug = $slug === '' ? 'sekil' : $slug;
        $namizet = $slug;

        for ($i = 2; $i < 500; $i++) {
            if (! $dossier->images()->where('slug', $namizet)->exists()) {
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
