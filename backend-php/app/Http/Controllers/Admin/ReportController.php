<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Report;
use App\Services\DocumentService;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;

class ReportController extends Controller
{
    public function __construct(private readonly DocumentService $documents)
    {
    }

    public function index(Request $request): View
    {
        $status = (string) $request->query('status', Report::STATUS_OPEN);

        $q = Report::query()->with(['document.user', 'reporter'])->latest();
        if ($status !== 'all') {
            $q->where('status', $status);
        }

        return view('admin.reports', [
            'reports' => $q->paginate(25)->withQueryString(),
            'status'  => $status,
            'counts'  => [
                'open'     => Report::query()->where('status', Report::STATUS_OPEN)->count(),
                'resolved' => Report::query()->where('status', Report::STATUS_RESOLVED)->count(),
                'rejected' => Report::query()->where('status', Report::STATUS_REJECTED)->count(),
            ],
        ]);
    }

    /** Şikayəti qəbul edir: sənəd reyestrdən çıxarılır. */
    public function accept(Report $report): RedirectResponse
    {
        if ($report->document) {
            $this->documents->remove($report->document);
        }

        $this->close($report, Report::STATUS_RESOLVED);

        return back()->with('status', 'Şikayət qəbul edildi, sənəd silindi.');
    }

    /** Şikayəti rədd edir: sənəd yerində qalır. */
    public function reject(Report $report): RedirectResponse
    {
        $this->close($report, Report::STATUS_REJECTED);

        return back()->with('status', 'Şikayət rədd edildi.');
    }

    protected function close(Report $report, string $status): void
    {
        $report->forceFill([
            'status'     => $status,
            'handled_by' => Auth::id(),
            'handled_at' => Carbon::now(),
        ])->save();
    }
}
