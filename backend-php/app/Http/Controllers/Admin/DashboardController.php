<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Models\Payment;
use App\Models\Report;
use App\Models\User;
use Illuminate\Contracts\View\View;
use Illuminate\Support\Carbon;

class DashboardController extends Controller
{
    public function index(): View
    {
        $today = Carbon::today();

        // Son 14 günün sənəd və gəlir dinamikası (qrafik kitabxanası yoxdur — SVG əl ilə çəkilir)
        $days = [];
        for ($i = 13; $i >= 0; $i--) {
            $day = $today->copy()->subDays($i);

            $days[] = [
                'label'     => $day->format('d.m'),
                'documents' => Document::query()->whereDate('created_at', $day)->count(),
                'revenue'   => (float) Payment::query()
                    ->where('status', Payment::STATUS_PAID)
                    ->whereDate('paid_at', $day)
                    ->sum('amount'),
            ];
        }

        /* Dərc nisbəti — ödəniş divarının aşılmasına qarşı erkən siqnal.
           Sənəd brauzerdə render olunduğu üçün konsol vasitəsilə ödənişsiz
           şəkil almaq mümkündür; belə istifadəçi sənəd yaradır, amma dərc
           etmir. Son 7 günün nisbəti ümumi nisbətdən kəskin aşağı düşərsə,
           baxmağa dəyər. Az sayda sənəddə nisbət səs-küylüdür, ona görə
           xəbərdarlıq üçün minimum həcm şərti var. */
        $week      = $today->copy()->subDays(6);
        $madeAll   = Document::query()->visible()->count();
        $pubAll    = Document::query()->published()->count();
        $made7     = Document::query()->visible()->whereDate('created_at', '>=', $week)->count();
        $pub7      = Document::query()->published()->whereDate('created_at', '>=', $week)->count();

        $rateAll = $madeAll > 0 ? $pubAll / $madeAll * 100 : null;
        $rate7   = $made7 > 0 ? $pub7 / $made7 * 100 : null;

        $rateDrop = $rateAll !== null && $rate7 !== null
            && $made7 >= 20                       // statistik mənalı həcm
            && $rate7 < $rateAll - 15;            // faiz bəndi ilə kəskin enmə

        return view('admin.dashboard', [
            'publish' => [
                'made_all'  => $madeAll,
                'made_7'    => $made7,
                'pub_7'     => $pub7,
                'rate_all'  => $rateAll,
                'rate_7'    => $rate7,
                'drop'      => $rateDrop,
                'thin'      => $made7 < 20,       // həcm azdırsa nisbət etibarsızdır
            ],
            'stats' => [
                'documents_total'     => Document::query()->visible()->count(),
                'documents_published' => Document::query()->published()->count(),
                'documents_today'     => Document::query()->whereDate('created_at', $today)->count(),
                'revenue_total'       => (float) Payment::query()->where('status', Payment::STATUS_PAID)->sum('amount'),
                'revenue_today'       => (float) Payment::query()->where('status', Payment::STATUS_PAID)->whereDate('paid_at', $today)->sum('amount'),
                'users_total'         => User::query()->count(),
                'users_registered'    => User::query()->whereNotNull('email')->count(),
                'reports_open'        => Report::query()->where('status', Report::STATUS_OPEN)->count(),
                'credits_outstanding' => (int) User::query()->sum('credits'),
            ],
            'days'             => $days,
            'recentPayments'   => Payment::query()->with('user')->latest()->limit(8)->get(),
            'recentDocuments'  => Document::query()->with('user')->latest()->limit(8)->get(),
        ]);
    }
}
