<?php

declare(strict_types=1);

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Response;

/**
 * Dəvətnamə bölməsi — saytın digər hissəsindən ayrı səhifələr.
 *
 * Buradakı səhifələr axtarış sistemlərinə düşməməlidir: dəvətnamə yalnız
 * linki bilən adama aiddir. Meta teqi görünüşdədir, başlıq isə burada —
 * ikisi birlikdə lazımdır, çünki bəzi kəşfiyyatçılar HTML-i oxumur.
 */
class DevetController extends Controller
{
    /** Redaktor. Baza sorğusu yoxdur — bütün iş brauzerdə gedir. */
    public function builder(): Response
    {
        return response()
            ->view('devet')
            ->header('X-Robots-Tag', 'noindex, nofollow, noarchive');
    }
}
