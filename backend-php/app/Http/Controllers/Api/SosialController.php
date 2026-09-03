<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Services\SosialService;
use App\Support\RegistryNumber;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

/**
 * Sosial kimlik kartı — profil axtarışı və kartın profil şəkli.
 *
 * `profil()` kənar sorğu edir, ona görə `throttle:sosial` altındadır: hər
 * çağırış platformanın IP limitindən yeyir (AI panelindəki eyni məntiq).
 *
 * Şəkil axını `InviteService::storeOg()` modelindədir: fayl public kökdən
 * KƏNARDA saxlanılır və buradan SABİT `image/jpeg` başlığı ilə verilir, ona
 * görə yüklənən fayl heç bir halda icra oluna bilməz.
 */
class SosialController extends Controller
{
    public function __construct(private readonly SosialService $sosial) {}

    /** Yapışdırılan linkdən profil bloku. Uğursuzluq 200-dür, xəta deyil. */
    public function profil(Request $request): JsonResponse
    {
        $user = $request->visitor();

        if ($user->is_blocked) {
            return response()->json(['error' => 'blocked', 'message' => 'Hesab məhdudlaşdırılıb.'], 403);
        }

        $data = $request->validate([
            'url'      => ['required', 'string', 'max:' . (int) config('sosial.limits.url', 200)],
            'platform' => ['nullable', 'string', 'max:12'],
        ]);

        $fallback = in_array($data['platform'] ?? '', (array) config('sosial.platforms'), true)
            ? (string) $data['platform']
            : null;

        return response()->json($this->sosial->lookup($data['url'], $fallback));
    }

    /**
     * Kartın profil şəkli. Gövdə xam JPEG-dir (base64 deyil) — 256×256 şəkil
     * onsuz da kiçikdir, base64 onu 33% şişirdərdi.
     *
     * Brauzer şəkli özü kəsib göndərir: serverdə şəkil boru xətti yoxdur və
     * onu yazmaq 33 dizaynı PHP-də yenidən qurmaq qədər əsassız olardı.
     */
    public function storeAvatar(Request $request, string $regNo): JsonResponse
    {
        $user = $request->visitor();

        if ($user->is_blocked) {
            return response()->json(['error' => 'blocked', 'message' => 'Hesab məhdudlaşdırılıb.'], 403);
        }

        $regNo = strtoupper($regNo);
        if (! RegistryNumber::isValid($regNo)) {
            return response()->json(['error' => 'bad_reg_no'], 400);
        }

        $document = Document::query()->where('reg_no', $regNo)->first();

        if ($document === null || (int) $document->user_id !== (int) $user->id) {
            /* 404, 403 yox: 403 sənədin mövcudluğunu təsdiqləyərdi. */
            return response()->json(['error' => 'not_found'], 404);
        }

        $cfg    = (array) config('sosial.avatar');
        $binary = $request->getContent();

        if (! is_string($binary) || $binary === '' || strlen($binary) > (int) $cfg['max_bytes']) {
            return response()->json(['error' => 'bad_image'], 422);
        }

        $info = @getimagesizefromstring($binary);
        $size = (int) $cfg['size'];

        if ($info === false
            || (int) ($info[2] ?? 0) !== IMAGETYPE_JPEG
            || (int) $info[0] !== $size
            || (int) $info[1] !== $size) {
            return response()->json(['error' => 'bad_image'], 422);
        }

        /* GD varsa şəkil yenidən kodlaşdırılır: bu, JPEG-in içinə yerləşdirilmiş
           hər şeyi (metadata, artıq baytlar) atır. */
        if (function_exists('imagecreatefromstring')) {
            $im = @imagecreatefromstring($binary);
            if ($im === false) {
                return response()->json(['error' => 'bad_image'], 422);
            }
            ob_start();
            imagejpeg($im, null, 88);
            $binary = (string) ob_get_clean();
            imagedestroy($im);
        }

        $dir = (string) $cfg['path'];
        if (! is_dir($dir) && ! @mkdir($dir, 0775, true) && ! is_dir($dir)) {
            return response()->json(['error' => 'bad_image'], 422);
        }

        file_put_contents(self::pathFor($document), $binary);
        $document->forceFill(['avatar_ready' => true])->save();

        return response()->json(['ok' => true, 'avatarUrl' => $document->refresh()->avatarUrl()]);
    }

    /** Dərc olunmuş kartın şəkli — baxış səhifəsi bunu SVG-yə yerləşdirir. */
    public function showAvatar(string $regNo): Response|BinaryFileResponse
    {
        $regNo = strtoupper($regNo);

        $document = RegistryNumber::isValid($regNo)
            ? Document::query()->where('reg_no', $regNo)->where('status', Document::STATUS_PUBLISHED)->first()
            : null;

        if ($document === null || ! $document->avatar_ready) {
            return response('', 404);
        }

        $path = self::pathFor($document);
        if (! is_file($path)) {
            return response('', 404);
        }

        return response()->file($path, [
            'Content-Type'           => 'image/jpeg',
            'X-Content-Type-Options' => 'nosniff',
            'Cache-Control'          => 'public, max-age=600',
            'X-Robots-Tag'           => 'noindex',
        ]);
    }

    /** Fayl adı qeydiyyat nömrəsindəndir — `RegistryNumber::PATTERN` onsuz da ASCII-dir. */
    private static function pathFor(Document $document): string
    {
        return rtrim((string) config('sosial.avatar.path'), '/') . '/' . $document->reg_no . '.jpg';
    }
}
