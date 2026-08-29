<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Models\DocumentEvent;
use App\Models\Template;
use App\Support\ReplyKinds;
use Illuminate\Contracts\View\View;
use Illuminate\Support\Facades\DB;

/**
 * Cavab döngəsinin ölçüləri.
 *
 * `DashboardController` ümumi biznes rəqəmlərini verir; bu səhifə yalnız
 * cavab sənədi funksiyasının işləyib-işləmədiyini göstərir. Hesablamalar
 * hər açılışda canlı aparılır — ayrıca aqreqasiya cədvəli yoxdur, çünki
 * `document_events` hələ kiçikdir və rəqəmlərin dəqiq olması vacibdir.
 */
class StatsController extends Controller
{
    public function index(): View
    {
        $events = $this->eventCounts();

        $replies = Document::query()->visible()->whereNotNull('reply_to_id');
        $roots   = Document::query()->visible()->whereNull('reply_to_id');

        $repliesTotal = (clone $replies)->count();
        $rootsTotal   = (clone $roots)->count();

        /* Baxılmış sənəd = ən azı bir dəfə açılmış sənəd. `documents.views`
           ziyarətçi başına saatda bir dəfə artır (RegistryController), ona görə
           bu, təxmini deyil, sənəd sayıdır. */
        $viewedDocs = Document::query()->published()->where('views', '>', 0)->count();

        /* Cavab alan sənədlərin sayı — «neçə sənəd cavablandırıldı». */
        $answered = Document::query()->visible()
            ->whereIn('id', Document::query()->visible()->whereNotNull('reply_to_id')->select('reply_to_id'))
            ->count();

        return view('admin.stats', [
            'events' => $events,

            'headline' => [
                'replies'   => $repliesTotal,
                'published' => (clone $replies)->published()->count(),
                'roots'     => $rootsTotal,
                'answered'  => $answered,
                'viewed'    => $viewedDocs,
            ],

            /* Əsas metrik (§14): baxılmış sənədlərin neçə faizi cavab alıb.
               Hər iki tərəf sənəd sayıdır, ona görə nisbət həmişə ≤ 100%.

               Huninin addım nisbətləri QƏSDƏN burada deyil: `/?cavab=…`
               linkini birbaşa açan istifadəçi «klik» addımını atlayır, ona
               görə `yaradıldı / klik` 100%-i aşa bilər və başlıq rəqəmi kimi
               yanıldıcı olardı. Onlar hunidə xam sayla göstərilir. */
            'rates' => [
                'view_to_reply' => $this->pct($answered, $viewedDocs),
                'per_document'  => $rootsTotal > 0 ? round($repliesTotal / $rootsTotal, 2) : 0.0,
                'max_depth'     => (int) Document::query()->visible()->max('reply_depth'),
            ],

            'depths'     => $this->depths(),
            'kinds'      => $this->kinds(),
            'categories' => $this->categories(),
        ]);
    }

    /** @return array<string, int> */
    private function eventCounts(): array
    {
        $rows = DocumentEvent::query()
            ->selectRaw('event, count(*) as n')
            ->groupBy('event')
            ->pluck('n', 'event')
            ->all();

        $out = [];
        foreach (array_merge(DocumentEvent::CLIENT_EVENTS, [DocumentEvent::CREATED]) as $e) {
            $out[$e] = (int) ($rows[$e] ?? 0);
        }

        return $out;
    }

    /**
     * Zəncir dərinliyi bölgüsü — 1-dən başlayır, çünki 0 adi sənəddir.
     *
     * @return list<array{depth: int, n: int}>
     */
    private function depths(): array
    {
        return Document::query()->visible()
            ->where('reply_depth', '>', 0)
            ->selectRaw('reply_depth as depth, count(*) as n')
            ->groupBy('reply_depth')
            ->orderBy('reply_depth')
            ->get()
            ->map(fn ($r): array => ['depth' => (int) $r->depth, 'n' => (int) $r->n])
            ->all();
    }

    /**
     * Ən populyar cavab tipləri. `documents.template_id` slug-dır, ona görə
     * niyyət şablon cədvəlindən bir sorğu ilə gətirilir (N+1 yoxdur).
     *
     * @return list<array{kind: string, label: string, n: int}>
     */
    private function kinds(): array
    {
        $byTemplate = Document::query()->visible()
            ->whereNotNull('reply_to_id')
            ->selectRaw('template_id, count(*) as n')
            ->groupBy('template_id')
            ->pluck('n', 'template_id')
            ->all();

        if ($byTemplate === []) {
            return [];
        }

        $kindOf = Template::query()
            ->whereIn('slug', array_keys($byTemplate))
            ->whereNotNull('reply_kind')
            ->pluck('reply_kind', 'slug')
            ->all();

        $totals = [];
        foreach ($byTemplate as $slug => $n) {
            $k = $kindOf[$slug] ?? null;
            if ($k === null) {
                continue;
            }
            $totals[$k] = ($totals[$k] ?? 0) + (int) $n;
        }

        arsort($totals);

        $out = [];
        foreach ($totals as $k => $n) {
            $out[] = ['kind' => $k, 'label' => ReplyKinds::label($k) ?: $k, 'n' => $n];
        }

        return $out;
    }

    /**
     * Kateqoriya üzrə cavab bölgüsü. Mənbə `document_events.cat` sütunudur —
     * orijinalın kateqoriyası hadisə anında yazılır, ona görə şablon sonradan
     * köçürülsə belə tarixi rəqəm pozulmur.
     *
     * «Klik → cavab» nisbəti QƏSDƏN hesablanmır: `/?cavab=…` linkini birbaşa
     * açan istifadəçi klik hadisəsi yaratmır, ona görə o nisbət 100%-i aşa
     * bilər. Əvəzində hər kateqoriyanın BÜTÜN cavablar içindəki payı verilir —
     * bu, «hansı mövzular döngəni işə salır» sualının doğru cavabıdır.
     *
     * @return list<array{cat: string, clicks: int, created: int, share: float}>
     */
    private function categories(): array
    {
        $rows = DocumentEvent::query()
            ->whereNotNull('cat')
            ->whereIn('event', [DocumentEvent::CREATED, 'reply_click'])
            ->selectRaw('cat, event, count(*) as n')
            ->groupBy('cat', 'event')
            ->get();

        $acc = [];
        foreach ($rows as $r) {
            $acc[$r->cat] ??= ['clicks' => 0, 'created' => 0];
            $key = $r->event === DocumentEvent::CREATED ? 'created' : 'clicks';
            $acc[$r->cat][$key] += (int) $r->n;
        }

        $total = array_sum(array_column($acc, 'created'));

        $out = [];
        foreach ($acc as $cat => $v) {
            $out[] = [
                'cat'     => $cat,
                'clicks'  => $v['clicks'],
                'created' => $v['created'],
                'share'   => $this->pct($v['created'], $total),
            ];
        }

        usort($out, fn ($a, $b): int => $b['created'] <=> $a['created']);

        return $out;
    }

    private function pct(int $part, int $whole): float
    {
        return $whole > 0 ? round($part * 100 / $whole, 1) : 0.0;
    }
}
