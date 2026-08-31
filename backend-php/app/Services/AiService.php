<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Category;
use App\Models\Setting;
use App\Models\Template;
use App\Support\Ai\OpenAiClient;
use App\Support\Ai\TemplateBrief;
use App\Support\Moderation;
use RuntimeException;

/**
 * Admin panelin «AI ilə hazırla» köməkçisi.
 *
 * Vəzifə bölgüsü:
 *   · `TemplateBrief` — prompt, sxem, təmizləmə (freymvorksuz, test olunur)
 *   · `OpenAiClient`  — HTTP və model uyğunluğu (freymvorksuz, test olunur)
 *   · bu sinif        — konfiqurasiya, kontekstin bazadan yığılması, moderasiya
 *
 * Açar YALNIZ `.env`-dədir. Bazada saxlanılsaydı, kataloq ixracı və baza
 * ehtiyat nüsxəsi ilə birlikdə yayılardı — Epoint açarları ilə eyni qayda.
 * Model isə `settings` cədvəlindədir: OpenAI model adları tez dəyişir və
 * bunun üçün deploy gözləmək lazım deyil.
 */
class AiService
{
    /** Model adının formatı. İcazə siyahısı DEYİL — yeni model kodsuz işləsin deyə. */
    private const MODEL_RE = '/^[A-Za-z0-9][A-Za-z0-9._:-]{1,59}$/';

    public function __construct(private readonly ?OpenAiClient $client = null) {}

    public function enabled(): bool
    {
        return (bool) config('ai.enabled') && $this->key() !== '';
    }

    public function model(): string
    {
        $stored = (string) (Setting::get('ai_model') ?? '');

        return self::validModel($stored) ? $stored : (string) config('ai.model');
    }

    public static function validModel(string $model): bool
    {
        return preg_match(self::MODEL_RE, $model) === 1;
    }

    /** Açarın olub-olmadığını göstərmək üçün — tam dəyər heç vaxt qaytarılmır. */
    public function keyHint(): string
    {
        $key = $this->key();

        if ($key === '') {
            return '';
        }

        /* Qısa açarda «ilk 3 + son 4» açarın demək olar hamısını göstərərdi. */
        if (mb_strlen($key) < 16) {
            return str_repeat('•', 8);
        }

        return mb_substr($key, 0, 6) . str_repeat('•', 8) . mb_substr($key, -4);
    }

    /**
     * Bir qaralama hazırlayır.
     *
     * @param  array<string,mixed>  $input  brief · mode · category_id · layout · title · powers · penalty
     * @return array{values:array<string,string>,warnings:list<string>,model:string,usage:array<string,mixed>,dropped:list<string>}
     */
    public function draft(array $input): array
    {
        if (! $this->enabled()) {
            throw new RuntimeException('AI köməkçisi bağlıdır: `.env` faylına OPENAI_API_KEY yazın.');
        }

        $mode = in_array($input['mode'] ?? '', TemplateBrief::MODES, true) ? (string) $input['mode'] : 'full';
        $brief = trim((string) ($input['brief'] ?? ''));

        if ($brief === '') {
            throw new RuntimeException('Nə istədiyinizi bir cümlə ilə yazın.');
        }

        $ctx    = $this->context($input);
        $model  = $this->model();
        $client = $this->client ?? new OpenAiClient(
            $this->key(),
            (string) config('ai.endpoint'),
            (int) config('ai.timeout'),
        );

        $res = $client->chat([
            ['role' => 'system', 'content' => TemplateBrief::system($ctx)],
            ['role' => 'user',   'content' => TemplateBrief::user($brief, $ctx, $mode)],
        ], [
            'model'                 => $model,
            'max_completion_tokens' => (int) config('ai.max_output_tokens'),
            'temperature'           => config('ai.temperature'),
            'response_format'       => [
                'type'        => 'json_schema',
                'json_schema' => TemplateBrief::schema($mode),
            ],
        ]);

        $raw = $this->decode($res['text']);
        $out = TemplateBrief::normalize($raw, $ctx, $mode);

        /* Moderasiya süzgəci ziyarətçi mətninə tətbiq olunur — AI-nin cavabı da
           mətndir və eyni siyahıdan keçməlidir. */
        $words = Setting::get('banned_words', (string) config('zarafat.banned_words')) ?? '';

        if ((new Moderation($words))->flagged(...array_values($out['values']))) {
            throw new RuntimeException('Cavab moderasiya siyahısındakı ifadə daşıyır və göstərilmədi. Tapşırığı dəyişib təkrar cəhd edin.');
        }

        return $out + [
            'model'   => $res['model'] !== '' ? $res['model'] : $model,
            'usage'   => $res['usage'],
            'dropped' => $res['dropped'],
        ];
    }

    /**
     * Modelin cavabı — JSON. Bəzi modellər onu ```json bloku ilə bükür.
     *
     * @return array<string,mixed>
     */
    private function decode(string $text): array
    {
        $text = trim($text);

        if ($text === '') {
            throw new RuntimeException('Model boş cavab qaytardı. Təkrar cəhd edin.');
        }

        if (str_starts_with($text, '```')) {
            $text = trim((string) preg_replace('/^```[a-z]*\s*|\s*```$/i', '', $text));
        }

        $json = json_decode($text, true);

        if (! is_array($json)) {
            throw new RuntimeException('Modelin cavabı JSON deyil. Təkrar cəhd edin və ya başqa model seçin.');
        }

        return $json;
    }

    /**
     * Prompt üçün kontekst: blankın xüsusiyyətləri, kateqoriya, qonşu şablonlar.
     *
     * @param  array<string,mixed>  $input
     * @return array<string,mixed>
     */
    private function context(array $input): array
    {
        $layouts = config('zarafat.layouts');
        $layout  = in_array($input['layout'] ?? '', $layouts, true) ? (string) $input['layout'] : $layouts[0];
        $meta    = config('zarafat.layout_meta')[$layout] ?? [];

        $category = isset($input['category_id'])
            ? Category::query()->find((int) $input['category_id'])
            : null;

        /* Qonşu şablonlar: başlıqlar təkrarı, qurumlar isə «qurum ailəsi»
           qaydasını (copy-rules.js BAND.orgPerCat) modelə göstərir. */
        $siblings = $category
            ? Template::query()
                ->where('category_id', $category->id)
                ->when(! empty($input['template_id']), fn ($q) => $q->whereKeyNot((int) $input['template_id']))
                ->orderBy('sort')->limit(14)->get(['title', 'sign_org'])
            : collect();

        return [
            'tone'         => $category?->tone ?? 'zarafat',
            'layout'       => $layout,
            'layoutName'   => (string) ($meta['name'] ?? $layout),
            'typeWord'     => (string) ($meta['type'] ?? ''),
            'layoutNote'   => (string) ($meta['note'] ?? ''),
            'tails'        => array_values(array_filter(array_map('trim', explode('·', (string) ($meta['tail'] ?? ''))))),
            'categoryName' => $category?->name ?? '',
            'limits'       => config('zarafat.limits'),
            'siblingTitles' => $siblings->pluck('title')->filter()->values()->all(),
            'siblingOrgs'  => $siblings->pluck('sign_org')->filter()->unique()->values()->all(),
            /* `variant` rejimi mövcud mətnin ətrafında işləyir. */
            'title'        => trim((string) ($input['title'] ?? '')),
            'penalty'      => trim((string) ($input['penalty'] ?? '')),
            'powersLines'  => array_values(array_filter(array_map(
                'trim',
                preg_split('/\R/u', (string) ($input['powers'] ?? '')) ?: [],
            ))),
        ];
    }

    private function key(): string
    {
        return trim((string) config('ai.key'));
    }
}
