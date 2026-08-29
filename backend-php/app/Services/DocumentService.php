<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Document;
use App\Models\DocumentEvent;
use App\Models\Template;
use App\Models\User;
use App\Support\Answers;
use App\Support\RegistryNumber;
use App\Support\RegistryPrefix;
use App\Support\ReplyKinds;
use App\Support\Sanitizer;
use App\Support\TemplateSchema;
use Illuminate\Support\Carbon;

class DocumentService
{
    /**
     * Sənəd id → kateqoriya slug-ı. Cavab yaradılarkən eyni dəyər iki dəfə
     * lazım olur (uyğunluq yoxlaması və hadisə jurnalı) — ikinci sorğu artıqdır.
     *
     * @var array<int, string|null>
     */
    private array $catCache = [];

    public function __construct(private readonly CreditService $credits)
    {
    }

    /**
     * @param array<string, mixed> $input
     *
     * @throws \RuntimeException bad_template | bad_reply | reply_too_deep
     */
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

        /* Şablon kataloqdan gəlir. Başlıq, bəndlər, cəza bəndi və preamble
           KLİENTDƏN DEYİL, buradan qurulur — klient yalnız hansı variantı
           seçdiyini bildirir. Açılan siyahılar saytda sadəcə rahatlıqdır. */
        $templateId = Sanitizer::text($input['templateId'] ?? null, 40) ?: null;
        $tpl = $templateId === null ? null : Template::query()->where('slug', $templateId)->first();

        /* `active()` süzgəci qəsdən yoxdur: səhifə açıldıqdan sonra söndürülmüş
           şablon legitim ziyarətçini rədd edərdi, sətir isə hələ də doğru
           variant siyahılarını daşıyır. */
        if (! $tpl) {
            throw new \RuntimeException('bad_template');
        }

        /* Cavab bağlantısı. Klient yalnız qeydiyyat nömrəsi göndərir — valideyn
           sətri, dərinlik və zəncirin kökü burada həll olunur. */
        $parent = $this->resolveParent($input['replyTo'] ?? null, $tpl);
        $topic  = $parent === null ? null : $this->topicOf($parent);

        $to   = Sanitizer::person($input['to'] ?? null, $limits['name']);
        $from = Sanitizer::person($input['from'] ?? null, $limits['name']);

        $answers  = Answers::clean($tpl->fields, $input['answers'] ?? null);
        $preamble = str_replace(
            ['{to}', '{from}'],
            [$to !== '' ? $to : 'Ad Soyad', $from !== '' ? $from : 'Ad Soyad'],
            (string) $tpl->preamble
        );

        $document = Document::create([
            'extra'         => $this->extraFrom($input, $tpl) ?: null,
            'expires_at'    => $this->expiryFrom($input),
            'reg_no'        => $this->nextRegNo($tpl),
            'user_id'       => $user->id,
            'template_id'   => $templateId,
            'reply_to_id'   => $parent?->id,
            'reply_root_id' => $parent?->chainRootId(),
            'reply_depth'   => $parent === null ? 0 : $parent->reply_depth + 1,
            'reply_topic'   => $topic,
            'title'         => $this->pickTitle($tpl, $input, $limits),
            'to_name'       => $to,
            'from_name'     => $from,
            'powers'        => $this->pickPowers($tpl, $input, $limits),
            'penalty'       => $this->pickPenalty($tpl, $input, $limits),
            'preamble'      => Sanitizer::text(Answers::fill($preamble, $answers), $limits['preamble']),
            'date_label'    => Carbon::now()->format('d.m.Y'),
            'layout'        => Sanitizer::pick($input['layout'] ?? null, config('zarafat.layouts'), 'notarial'),
            'palette'       => Sanitizer::pick($input['palette'] ?? null, config('zarafat.palettes'), 'gold'),
            'tone'          => Sanitizer::pick($input['tone'] ?? null, config('zarafat.tones'), 'zarafat'),
            'labels'        => $labels ?: null,
            'status'        => Document::STATUS_DRAFT,
        ]);

        if ($parent !== null) {
            /* Hadisədə də MÖVZU kateqoriyası saxlanılır — «kateqoriya üzrə cavab
               nisbəti» zəncirin dərinliyindən asılı olmamalıdır. */
            DocumentEvent::record(
                $document->id,
                $user->id,
                DocumentEvent::CREATED,
                $tpl->reply_kind,
                $topic,
                $document->reply_depth,
            );
        }

        return $document;
    }

    /* ---------------- cavab zənciri ----------------
       Klient yalnız «hansı sənədə cavab verirəm» deyir. Valideynin özü,
       zəncirin kökü və dərinliyi burada həll olunur — variant kilidi ilə
       eyni fəlsəfə: klient sətri sorğudur, dəyər deyil. */

    /**
     * @throws \RuntimeException bad_reply | reply_too_deep
     */
    protected function resolveParent(mixed $regNo, Template $tpl): ?Document
    {
        $reg = strtoupper(Sanitizer::text($regNo, 20));

        /* Adi şablon cavab kimi göndərilə bilməz, cavab şablonu isə tək başına
           işlədilə bilməz. İkinci qayda cavab şablonlarını ana axından tam
           kənarda saxlayır — kataloq süzgəci yalnız UI-dır, kilid buradadır. */
        if (! $tpl->isReply()) {
            if ($reg !== '') {
                throw new \RuntimeException('bad_reply');
            }

            return null;
        }

        if ($reg === '' || ! RegistryNumber::isValid($reg)) {
            throw new \RuntimeException('bad_reply');
        }

        /* YALNIZ dərc olunmuş sənədə cavab verilir: qaralama reyestrdə yoxdur,
           ona cavab isə mövcud olmayan nömrəyə istinad edən sənəd yaradardı. */
        $parent = Document::query()->published()->where('reg_no', $reg)->first();

        if (! $parent) {
            throw new \RuntimeException('bad_reply');
        }

        // Zarafat cavabı xatirə sənədinə (və əksinə) yapışdırıla bilməz.
        if ($tpl->tone !== $parent->tone) {
            throw new \RuntimeException('bad_reply');
        }

        if (! $tpl->answersCategory($this->topicOf($parent))) {
            throw new \RuntimeException('bad_reply');
        }

        if (ReplyKinds::nextDepth((int) $parent->reply_depth) === null) {
            throw new \RuntimeException('reply_too_deep');
        }

        return $parent;
    }

    /**
     * Zəncirin MÖVZU kateqoriyası — kök sənədin kateqoriyası.
     *
     * Cavab sənədinin öz kateqoriyası `c-redd` kimi niyyət kateqoriyasıdır və
     * heç bir `reply_cats` siyahısında yoxdur. Cavaba cavab verilərkən uyğunluq
     * məhz köke görə yoxlanılmalıdır: zəncir baş-başa eyni mövzudadır —
     * «cütlüklər» mübahisəsi üçüncü səviyyədə də cütlüklər mübahisəsi qalır.
     * Bu olmasa §8-dəki çoxsəviyyəli zəncir ikinci addımda dayanardı.
     */
    protected function topicOf(Document $document): ?string
    {
        /* Cavab sənədində mövzu artıq sətirdə saxlanılıb — sorğu lazım deyil. */
        if ($document->reply_topic !== null) {
            return $document->reply_topic;
        }

        if ($document->reply_root_id === null) {
            return $this->categorySlugOf($document);
        }

        $root = Document::query()->find($document->reply_root_id, ['id', 'template_id', 'reply_topic']);

        return $root === null ? null : $this->topicOf($root);
    }

    /** Sənədin şablonundan kateqoriya slug-ı. Şablon silinibsə null. */
    protected function categorySlugOf(Document $document): ?string
    {
        if (array_key_exists($document->id, $this->catCache)) {
            return $this->catCache[$document->id];
        }

        $slug = $document->template_id === null ? null : Template::query()
            ->where('slug', $document->template_id)
            ->with('category:id,slug')
            ->first()?->category?->slug;

        return $this->catCache[$document->id] = $slug;
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

        /* Səbəb şablonun siyahısındandır — açılan siyahı yalnız UI-dır.
           Siyahı yoxdursa yeganə icazəli dəyər defolt mətndir. */
        $tpl = $document->template_id === null ? null
            : Template::query()->where('slug', $document->template_id)->first();
        $reasons = is_array($tpl?->cancel_reasons) ? array_values($tpl->cancel_reasons) : [];

        $document->forceFill([
            'cancelled_at'  => Carbon::now(),
            'cancel_reason' => Sanitizer::pickText($reason, $reasons, 'Səbəb göstərilmədi', 60),
        ])->save();

        return $document->refresh();
    }

    /* ---------------- variant kilidi ----------------
       Üçü də eyni qaydadadır: siyahı varsa dəyər ondan seçilir, yoxdursa
       şablonun öz mətni işlənir. Klientin göndərdiyi mətn heç vaxt olduğu
       kimi saxlanılmır. */

    protected function pickTitle(Template $tpl, array $input, array $limits): string
    {
        $opts = is_array($tpl->title_options) ? array_values($tpl->title_options) : [];

        return $opts === []
            ? Sanitizer::text($tpl->title, $limits['title'])
            : Sanitizer::pickText($input['title'] ?? null, $opts, (string) $tpl->title, $limits['title']);
    }

    protected function pickPenalty(Template $tpl, array $input, array $limits): string
    {
        $opts = is_array($tpl->penalty_options) ? array_values($tpl->penalty_options) : [];

        return $opts === []
            ? Sanitizer::text($tpl->penalty, $limits['penalty'])
            : Sanitizer::pickText($input['penalty'] ?? null, $opts, (string) $tpl->penalty, $limits['penalty']);
    }

    protected function pickPowers(Template $tpl, array $input, array $limits): string
    {
        $opts = is_array($tpl->powers_options) ? array_values($tpl->powers_options) : [];
        $own  = Sanitizer::multiline($tpl->powers, $limits['powers'], $limits['power_lines']);

        if ($opts === []) {
            return $own;
        }

        [$min, $max] = TemplateSchema::pickRange($tpl->powers_min, $tpl->powers_max, count($opts));
        $picked = Sanitizer::pickList($input['powers'] ?? null, $opts, $min, $max, TemplateSchema::MAX_POWER_LINE);

        return $picked === [] ? $own : implode("\n", $picked);
    }

    /** Anket cavabları — `labels` sütunu ilə eyni nümunə. @return array<string, mixed> */
    protected function extraFrom(array $input, Template $tpl): array
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

        foreach (['until' => 24, 'share' => 180] as $key => $max) {
            $v = Sanitizer::text($input[$key] ?? null, $max);
            if ($v !== '') {
                $extra[$key] = $v;
            }
        }

        /* İmza vəzifəsi və verən qurum KLİENTDƏN DEYİL, kataloqdan gəlir —
           başlıq/bəndlər/preamble ilə eyni qayda. Qurum adı sənədin başlığında
           çıxdığı üçün saxta dəyər real bir qurumun adını sənədə yaza bilərdi. */
        foreach (['signTitle' => ['sign_title', 40], 'signOrg' => ['sign_org', 60]] as $key => [$col, $max]) {
            $v = Sanitizer::text($tpl->{$col}, $max);
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
    protected function nextRegNo(?Template $tpl = null): string
    {
        $fallback = (string) config('zarafat.reg_prefix');

        return RegistryNumber::generate(
            ($tpl?->reg_prefix) ?: RegistryPrefix::for($tpl?->slug, $fallback),
            (int) Carbon::now()->year,
            static fn (string $candidate): bool => Document::query()->where('reg_no', $candidate)->exists(),
        );
    }
}
