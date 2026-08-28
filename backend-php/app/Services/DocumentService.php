<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Document;
use App\Models\Template;
use App\Models\User;
use App\Support\RegistryNumber;
use App\Support\RegistryPrefix;
use App\Support\Sanitizer;
use Illuminate\Support\Carbon;

class DocumentService
{
    public function __construct(private readonly CreditService $credits)
    {
    }

    /** @param array<string, mixed> $input */
    public function create(User $user, array $input): Document
    {
        $limits = config('zarafat.limits');

        $labels = [];
        foreach (['toLabel', 'fromLabel', 'powersLabel', 'penaltyLabel'] as $key) {
            $value = Sanitizer::text($input[$key] ?? null, 40);
            if ($value !== '') {
                $labels[$key] = $value;
            }
        }

        $templateId = Sanitizer::text($input['templateId'] ?? null, 40) ?: null;

        return Document::create([
            'extra'       => $this->extraFrom($input) ?: null,
            'expires_at'  => $this->expiryFrom($input),
            'reg_no'      => $this->nextRegNo($templateId),
            'user_id'     => $user->id,
            'template_id' => $templateId,
            'title'       => Sanitizer::text($input['title'] ?? null, $limits['title']),
            'to_name'     => Sanitizer::text($input['to'] ?? null, $limits['name']),
            'from_name'   => Sanitizer::text($input['from'] ?? null, $limits['name']),
            'powers'      => Sanitizer::multiline($input['powers'] ?? null, $limits['powers'], $limits['power_lines']),
            'penalty'     => Sanitizer::text($input['penalty'] ?? null, $limits['penalty']),
            'preamble'    => Sanitizer::text($input['preamble'] ?? null, $limits['preamble']),
            'date_label'  => Carbon::now()->format('d.m.Y'),
            'layout'      => Sanitizer::pick($input['layout'] ?? null, config('zarafat.layouts'), 'notarial'),
            'palette'     => Sanitizer::pick($input['palette'] ?? null, config('zarafat.palettes'), 'gold'),
            'tone'        => Sanitizer::pick($input['tone'] ?? null, config('zarafat.tones'), 'zarafat'),
            'labels'      => $labels ?: null,
            'status'      => Document::STATUS_DRAFT,
        ]);
    }

    /**
     * 1 kredit xərcləyib sənədi reyestrə yazır.
     * Təkrar çağırışda kredit yenidən silinmir.
     *
     * @throws \RuntimeException forbidden | removed | no_credits
     */
    public function publish(User $user, Document $document): Document
    {
        if ($document->user_id !== $user->id) {
            throw new \RuntimeException('forbidden');
        }

        if ($document->status === Document::STATUS_REMOVED) {
            throw new \RuntimeException('removed');
        }

        if ($document->isPublished()) {
            return $document;
        }

        $this->rollForward($document);
        $this->credits->spend($user, 1, $document);

        $document->forceFill([
            'status'       => Document::STATUS_PUBLISHED,
            'published_at' => Carbon::now(),
        ])->save();

        return $document->refresh();
    }

    public function remove(Document $document): void
    {
        $document->forceFill(['status' => Document::STATUS_REMOVED])->save();
    }

    /**
     * Sənədi ləğv edir. Yalnız sahibi və yalnız dərc olunmuş sənəd üçün.
     * Təkrar çağırışda vəziyyət dəyişmir.
     *
     * @throws \RuntimeException forbidden | removed | not_published
     */
    public function cancel(User $user, Document $document, mixed $reason): Document
    {
        if ($document->user_id !== $user->id) {
            throw new \RuntimeException('forbidden');
        }

        if ($document->status === Document::STATUS_REMOVED) {
            throw new \RuntimeException('removed');
        }

        if (! $document->isPublished()) {
            throw new \RuntimeException('not_published');
        }

        if ($document->cancelled_at !== null) {
            return $document;
        }

        $document->forceFill([
            'cancelled_at'  => Carbon::now(),
            'cancel_reason' => Sanitizer::text($reason, 60) ?: 'Səbəb göstərilmədi',
        ])->save();

        return $document->refresh();
    }

    /** Anket cavabları — `labels` sütunu ilə eyni nümunə. @return array<string, mixed> */
    protected function extraFrom(array $input): array
    {
        $extra = [];

        $rows = Sanitizer::rows($input['data'] ?? null, 14, 40, 80);
        if ($rows !== []) {
            $extra['data'] = $rows;
        }

        $checks = Sanitizer::checks($input['checks'] ?? null, 6, 100);
        if ($checks !== []) {
            $extra['checks'] = $checks;
        }

        $notes = Sanitizer::checks($input['notes'] ?? null, 8, 180);
        if ($notes !== []) {
            $extra['notes'] = $notes;
        }

        $scale = $input['scale'] ?? null;
        if (is_array($scale)) {
            $max = Sanitizer::scale($scale['max'] ?? null, 1, 10);
            $v   = Sanitizer::scale($scale['v'] ?? null, 0, 10);
            if ($max !== null && $v !== null) {
                $extra['scale'] = [
                    'label' => Sanitizer::text($scale['label'] ?? null, 40),
                    'v'     => min($v, $max),
                    'max'   => $max,
                ];
            }
        }

        foreach (['until' => 24, 'signTitle' => 40, 'signOrg' => 60, 'share' => 180] as $key => $max) {
            $v = Sanitizer::text($input[$key] ?? null, $max);
            if ($v !== '') {
                $extra[$key] = $v;
            }
        }

        return $extra;
    }

    /** Klientdən gələn mütləq vaxt [indi+5dəq, indi+30gün] aralığına sıxılır. */
    protected function expiryFrom(array $input): ?Carbon
    {
        $ms = $input['expiresAt'] ?? null;
        if (! is_int($ms) && ! (is_string($ms) && preg_match('/^\d+$/', $ms))) {
            return null;
        }

        $at  = Carbon::createFromTimestampMs((int) $ms);
        $min = Carbon::now()->addMinutes(5);
        $max = Carbon::now()->addDays(30);

        if ($at->lessThan($min)) {
            return $min;
        }

        return $at->greaterThan($max) ? $max : $at;
    }

    /**
     * Dərc anında müddət artıq keçibsə, gün-gün irəli sürüşdürülür.
     * Sənəddə yazılan saat (məsələn 23:30) beləcə doğru qalır.
     */
    protected function rollForward(Document $document): void
    {
        if ($document->expires_at === null || ! $document->expires_at->isPast()) {
            return;
        }

        $at = $document->expires_at->copy();
        while ($at->isPast()) {
            $at->addDay();
        }

        $document->forceFill(['expires_at' => $at])->save();
    }

    /**
     * Prefiks şablona görə seçilir. Mənbələr sıra ilə:
     * kataloqdakı `templates.reg_prefix` → `RegistryPrefix::MAP` → qlobal prefiks.
     * İkinci addım arxiv/toxum şablonları üçün qalır.
     */
    protected function nextRegNo(?string $templateId = null): string
    {
        $fallback = (string) config('zarafat.reg_prefix');

        $fromCatalog = $templateId === null ? null : Template::query()
            ->where('slug', $templateId)
            ->value('reg_prefix');

        return RegistryNumber::generate(
            $fromCatalog ?: RegistryPrefix::for($templateId, $fallback),
            (int) Carbon::now()->year,
            static fn (string $candidate): bool => Document::query()->where('reg_no', $candidate)->exists(),
        );
    }
}
