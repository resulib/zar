<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * İdarəçinin əl ilə verdiyi və ya çıxdığı xal.
 *
 * `transactions` cədvəli ilə eyni məntiq: balans sütunu ayrıca yenilənir,
 * amma SƏBƏB burada qalır və heç vaxt silinmir. `delta` İŞARƏLİDİR — ledger
 * nə edildiyini dürüst saxlamalıdır; profildəki cəm isə sıfırda döşənir.
 */
class XpAdjustment extends Model
{
    protected $fillable = ['profile_id', 'delta', 'reason', 'admin_id', 'balance_after'];

    protected function casts(): array
    {
        return [
            'delta'         => 'integer',
            'balance_after' => 'integer',
        ];
    }

    public function profile(): BelongsTo
    {
        return $this->belongsTo(InvestigatorProfile::class, 'profile_id');
    }

    public function admin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'admin_id');
    }
}
