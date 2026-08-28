<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\CatalogService;
use Illuminate\Http\JsonResponse;

class CatalogController extends Controller
{
    /** Saytın kataloqu — yalnız aktiv kateqoriyalar və şablonlar. */
    public function index(CatalogService $catalog): JsonResponse
    {
        return response()->json($catalog->payload());
    }
}
