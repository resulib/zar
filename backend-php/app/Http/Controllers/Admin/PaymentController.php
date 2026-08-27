<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Transaction;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function index(Request $request): View
    {
        $q = Payment::query()->with('user')->latest();

        if ($status = (string) $request->query('status')) {
            $q->where('status', $status);
        }

        if ($search = trim((string) $request->query('q'))) {
            $q->where('order_id', 'like', "%{$search}%");
        }

        return view('admin.payments', [
            'payments' => $q->paginate(25)->withQueryString(),
            'filters'  => ['q' => $request->query('q', ''), 'status' => $request->query('status', '')],
            'totals'   => [
                'paid'    => (float) Payment::query()->where('status', Payment::STATUS_PAID)->sum('amount'),
                'pending' => Payment::query()->where('status', Payment::STATUS_PENDING)->count(),
                'failed'  => Payment::query()->where('status', Payment::STATUS_FAILED)->count(),
            ],
        ]);
    }

    public function transactions(Request $request): View
    {
        $q = Transaction::query()->with(['user', 'payment', 'document'])->latest();

        if ($type = (string) $request->query('type')) {
            $q->where('type', $type);
        }

        return view('admin.transactions', [
            'transactions' => $q->paginate(40)->withQueryString(),
            'filters'      => ['type' => $request->query('type', '')],
        ]);
    }
}
