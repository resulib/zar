<?php

declare(strict_types=1);

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Invite;
use App\Support\Devet;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * Tədbir sahibinin lövhəsi.
 *
 * `layouts/panel.blade.php` İŞLƏDİLMİR — orada saytın digər məhsulunun adı
 * və stili var. Alıcı burada yalnız öz məhsulunu görməlidir, ona görə
 * bölmənin öz çərçivəsi var (`layouts/devet.blade.php`).
 */
class DevetAccountController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->visitor();

        $invites = Invite::visible()
            ->where('user_id', $user->id)
            ->orderByDesc('id')
            ->limit(60)
            ->get();

        /* Sayğaclar bir sorğu ilə: hər sətir üçün ayrıca sorğu 60 dəvətnamədə
           60 sorğu edərdi. */
        $sayilar = [];
        foreach ($invites as $inv) {
            $sayilar[$inv->id] = Devet::tally($inv->guests()->get(['rsvp', 'rsvp_count']));
        }

        return $this->noindex(response()->view('devet.list', [
            'invites' => $invites,
            'sayilar' => $sayilar,
            'adlar'   => $this->eventNames(),
        ]));
    }

    public function board(Request $request, string $token): Response
    {
        $invite = $this->own($request, $token);
        $guests = $invite->guests()->get();

        return $this->noindex(response()->view('devet.board', [
            'invite' => $invite,
            'yekun'  => Devet::tally($guests),
            'adlar'  => $this->eventNames(),
            /* Toplu kart çəkilişi üçün sənədin özü — brauzer eyni motorla
               hər qonaq üçün adı yazılmış kart hazırlayır. */
            'doc'    => $invite->toApiArray(),
            'siyahi' => $guests->filter(fn ($g) => $g->hasLink())
                ->map(fn ($g) => $g->name)->implode("\n"),
        ]));
    }

    /** Cədvəlin CSV ixracı — Excel-də açılsın deyə BOM əlavə olunur. */
    public function csv(Request $request, string $token): StreamedResponse
    {
        $invite = $this->own($request, $token);
        $guests = $invite->guests()->get();

        $ad = Devet::ogFile($token);
        $ad = 'qonaqlar-' . substr($ad, 0, 8) . '.csv';

        return response()->streamDownload(function () use ($guests): void {
            $out = fopen('php://output', 'wb');
            fwrite($out, "\xEF\xBB\xBF");   // UTF-8 BOM
            fputcsv($out, ['Ad', 'Cavab', 'Nəfər', 'Qeyd', 'Cavab tarixi', 'Açılıb']);

            $etiket = ['gelirem' => 'Gəlir', 'gelmirem' => 'Gələ bilmir', 'bilmirem' => 'Hələ bilmir'];

            foreach ($guests as $g) {
                fputcsv($out, [
                    $g->name,
                    $etiket[$g->rsvp] ?? 'Cavabsız',
                    $g->rsvp_count ?? '',
                    $g->rsvp_note,
                    $g->responded_at?->format('d.m.Y H:i') ?? '',
                    $g->opened_at ? 'bəli' : 'xeyr',
                ]);
            }

            fclose($out);
        }, $ad, ['Content-Type' => 'text/csv; charset=UTF-8']);
    }

    /** @return array<string,string> */
    protected function eventNames(): array
    {
        return [
            'toy' => 'Toy', 'nisan' => 'Nişan', 'xina' => 'Xınayaxdı',
            'sunnet' => 'Sünnət toyu', 'usaq-ad-gunu' => 'Uşaq ad günü',
            'ad-gunu' => 'Ad günü', 'bebi-sauer' => 'Bebi şauer',
            'mezuniyyet' => 'Məzuniyyət', 'acilis' => 'Açılış',
            'korporativ' => 'Korporativ tədbir', 'yeni-il' => 'Yeni il şənliyi',
        ];
    }

    /** Yad adam üçün 404 — «403» cavabı belə tokenin mövcudluğunu bildirərdi. */
    protected function own(Request $request, string $token): Invite
    {
        $invite = Devet::isToken($token)
            ? Invite::visible()->where('token', $token)->first()
            : null;

        abort_if($invite === null || (int) $invite->user_id !== (int) $request->visitor()->id, 404);

        return $invite;
    }

    protected function noindex(Response $response): Response
    {
        return $response->header('X-Robots-Tag', 'noindex, nofollow, noarchive');
    }
}
