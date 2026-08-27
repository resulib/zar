<?php

declare(strict_types=1);

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Contracts\View\View;

class PageController extends Controller
{
    /** Sənəd generatoru (tək səhifəli tətbiq). */
    public function home(): View
    {
        return view('spa');
    }

    /** QR kodun düşdüyü ünvan — eyni səhifə, nömrə JS tərəfindən oxunur. */
    public function registry(string $regNo): View
    {
        return view('spa');
    }
}
