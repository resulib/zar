<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Services\DocumentService;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class DocumentController extends Controller
{
    public function __construct(private readonly DocumentService $documents)
    {
    }

    public function index(Request $request): View
    {
        $q = Document::query()->with('user')->latest();

        if ($search = trim((string) $request->query('q'))) {
            $q->where(function ($sub) use ($search) {
                $sub->where('reg_no', 'like', "%{$search}%")
                    ->orWhere('title', 'like', "%{$search}%")
                    ->orWhere('to_name', 'like', "%{$search}%")
                    ->orWhere('from_name', 'like', "%{$search}%");
            });
        }

        if ($status = (string) $request->query('status')) {
            $q->where('status', $status);
        }

        if ($layout = (string) $request->query('layout')) {
            $q->where('layout', $layout);
        }

        return view('admin.documents', [
            'documents' => $q->paginate(25)->withQueryString(),
            'filters'   => [
                'q'      => $request->query('q', ''),
                'status' => $request->query('status', ''),
                'layout' => $request->query('layout', ''),
            ],
        ]);
    }

    public function show(string $regNo): View
    {
        $document = Document::query()->with(['user', 'reports'])->where('reg_no', strtoupper($regNo))->firstOrFail();

        return view('admin.document', ['document' => $document]);
    }

    public function remove(string $regNo): RedirectResponse
    {
        $document = Document::query()->where('reg_no', strtoupper($regNo))->firstOrFail();
        $this->documents->remove($document);

        return back()->with('status', $document->reg_no . ' reyestrdən çıxarıldı.');
    }

    public function restore(string $regNo): RedirectResponse
    {
        $document = Document::query()->where('reg_no', strtoupper($regNo))->firstOrFail();

        $document->forceFill([
            'status' => $document->published_at ? Document::STATUS_PUBLISHED : Document::STATUS_DRAFT,
        ])->save();

        return back()->with('status', $document->reg_no . ' bərpa edildi.');
    }
}
