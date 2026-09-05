<?php

declare(strict_types=1);

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Services\BolmeService;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class PageController extends Controller
{
    public function __construct(private readonly BolmeService $bolmeler)
    {
    }

    /**
     * Saytın kökü.
     *
     * KÖK `bolme:` ARA QATI ALTINDA DEYİL və olmamalıdır: zarafat bağlananda
     * `/` özü 404 verərdi, yəni bir parametr bütün saytı bağlayardı. Əvəzinə
     * kök hansı bölmənin ana olduğuna baxır.
     *
     * YÖNLƏNDİRMƏ, TƏKRAR RENDER DEYİL: eyni məzmunu həm `/`, həm `/is`
     * ünvanında vermək iki kanonik ünvan yaradar və axtarış sistemi üçün
     * təkrar səhifə olardı. `/is` onsuz da indekslənən satış səhifəsidir.
     *
     * 302, 301 DEYİL: parametr idarə panelindən dəyişir, 301-i isə brauzer
     * qeyri-müəyyən müddətə yadda saxlayır — bölmə açılandan sonra ziyarətçi
     * hələ də köhnə hədəfə düşərdi.
     */
    public function home(): SymfonyResponse|View
    {
        $ana = $this->bolmeler->anaSehife();

        if ($ana === 'zarafat') {
            return view('spa');
        }

        if ($ana === 'is') {
            return redirect()->route('dossier.index');
        }

        if ($ana === 'devet') {
            return redirect()->route('devet.builder');
        }

        /* Heç bir bölmə açıq deyil — sayt texniki fasilədədir. 404 səhv
           mesaj olardı: ünvan var, məzmun müvəqqəti yoxdur. */
        return response()->view('bagli', [], 503);
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
