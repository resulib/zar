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

    /**
     * QR kodun düşdüyü ünvan — yalnız sənədi göstərən ayrıca səhifə.
     * Baza sorğusu yoxdur: sənədi `viewer.js` `/api/registry/{regNo}`-dan alır,
     * `$regNo` isə yalnız sosial önizləmə başlığında işlənir.
     */
    public function registry(string $regNo): View
    {
        return view('viewer', ['regNo' => strtoupper($regNo)]);
    }
}
