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

        return view('admin.dashboard', [
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
