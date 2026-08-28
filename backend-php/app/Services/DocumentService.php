<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Document;
use App\Models\User;
use App\Support\RegistryNumber;
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

        return Document::create([
            'reg_no'      => $this->nextRegNo(),
            'user_id'     => $user->id,
            'template_id' => Sanitizer::text($input['templateId'] ?? null, 40) ?: null,
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

    protected function nextRegNo(): string
    {
        return RegistryNumber::generate(
            (string) config('zarafat.reg_prefix'),
            (int) Carbon::now()->year,
            static fn (string $candidate): bool => Document::query()->where('reg_no', $candidate)->exists(),
        );
    }
}
