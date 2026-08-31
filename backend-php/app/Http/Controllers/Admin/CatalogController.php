<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Template;
use App\Services\AiService;
use App\Services\CatalogService;
use App\Support\ReplyKinds;
use App\Support\TemplateSchema;
use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

/**
 * Şablon kataloqunun idarəsi.
 *
 * Baza əsas mənbədir; `frontend/templates.js` yalnız toxum və offline
 * ehtiyatdır. Hər dəyişiklikdən sonra kataloq keşi sıfırlanır.
 */
class CatalogController extends Controller
{
    /* ==================== KATEQORİYALAR ==================== */

    public function categories(Request $request): View
    {
        $tone = (string) $request->query('tone', '');

        $categories = Category::query()
            ->withCount(['templates', 'templates as active_templates_count' => fn ($q) => $q->where('is_active', true)])
            ->when(in_array($tone, config('zarafat.tones'), true), fn ($q) => $q->where('tone', $tone))
            ->ordered()
            ->get();

        return view('admin.categories', [
            'categories' => $categories,
            'filters'    => ['tone' => $tone],
        ]);
    }

    public function categoryForm(?Category $category = null): View
    {
        return view('admin.category', [
            'category' => $category ?? new Category(['tone' => 'zarafat', 'is_active' => true, 'sort' => $this->nextSort(Category::query())]),
            'tones'    => config('zarafat.tones'),
            /* Kateqoriya səhifəsindən birbaşa öz şablonlarına keçmək üçün */
            'templates' => $category?->templates()->ordered()->get() ?? collect(),
        ]);
    }

    public function categorySave(Request $request, ?Category $category = null): RedirectResponse
    {
        $category ??= new Category();

        $data = $request->validate([
            'slug'      => ['required', 'string', 'max:40', 'regex:/^[a-z0-9-]+$/',
                            Rule::unique('categories', 'slug')->ignore($category->id)],
            'tone'      => ['required', Rule::in(config('zarafat.tones'))],
            'name'      => ['required', 'string', 'max:60'],
            'icon'      => ['nullable', 'string', 'max:8'],
            'blurb'     => ['nullable', 'string', 'max:300'],
            'sort'      => ['required', 'integer', 'min:0', 'max:100000'],
            'is_active' => ['nullable', 'boolean'],
            'is_reply'  => ['nullable', 'boolean'],
        ], [], ['slug' => 'açar', 'tone' => 'ton', 'name' => 'ad', 'sort' => 'sıra']);

        /* `ConvertEmptyStringsToNull` boş sahəni null edir, sütun isə NOT NULL-dur. */
        $data['blurb']     = (string) ($data['blurb'] ?? '');
        $data['is_active'] = $request->boolean('is_active');
        $data['is_reply']  = $request->boolean('is_reply');

        /* Cavab bayrağı kateqoriya boş DEYİLKƏN dəyişdirilə bilməz: içindəki
           şablonlar bir anda ana kataloqa tökülər (və ya oradan yox olar). */
        if ($category->exists && $category->is_reply !== $data['is_reply']
            && $category->templates()->count() > 0) {
            return back()->withErrors([
                'is_reply' => 'Kateqoriyada şablon olduğu müddətdə cavab bayrağı dəyişdirilə bilməz. '
                    . 'Əvvəlcə şablonları köçürün.',
            ])->withInput();
        }
        $wasNew = ! $category->exists;

        $category->fill($data)->save();
        CatalogService::forget();

        return redirect()
            ->route('admin.catalog.categories')
            ->with('status', $wasNew ? "«{$category->name}» kateqoriyası yaradıldı." : "«{$category->name}» yeniləndi.");
    }

    public function categoryToggle(Category $category): RedirectResponse
    {
        $category->forceFill(['is_active' => ! $category->is_active])->save();
        CatalogService::forget();

        return back()->with('status', "«{$category->name}» " . ($category->is_active ? 'aktivləşdirildi.' : 'söndürüldü — saytda görünmür.'));
    }

    public function categoryDelete(Category $category): RedirectResponse
    {
        $n = $category->templates()->count();

        if ($n > 0) {
            return back()->withErrors([
                'slug' => "«{$category->name}» silinmir: içində {$n} şablon var. Əvvəlcə onları köçürün və ya silin.",
            ]);
        }

        $name = $category->name;
        $category->delete();
        CatalogService::forget();

        return redirect()->route('admin.catalog.categories')->with('status', "«{$name}» silindi.");
    }

    /* ==================== ŞABLONLAR ==================== */

    public function templates(Request $request): View
    {
        $filters = [
            'q'      => trim((string) $request->query('q', '')),
            'cat'    => (string) $request->query('cat', ''),
            'layout' => (string) $request->query('layout', ''),
            'status' => (string) $request->query('status', ''),
        ];

        $templates = Template::query()
            ->with('category')
            ->when($filters['q'] !== '', function ($q) use ($filters) {
                $like = '%' . $filters['q'] . '%';
                $q->where(fn ($w) => $w->where('title', 'like', $like)->orWhere('slug', 'like', $like)->orWhere('tag', 'like', $like));
            })
            ->when($filters['cat'] !== '', fn ($q) => $q->whereHas('category', fn ($c) => $c->where('slug', $filters['cat'])))
            ->when(in_array($filters['layout'], config('zarafat.layouts'), true), fn ($q) => $q->where('layout', $filters['layout']))
            ->when($filters['status'] === 'active', fn ($q) => $q->where('is_active', true))
            ->when($filters['status'] === 'off', fn ($q) => $q->where('is_active', false))
            ->orderBy('category_id')->ordered()
            ->paginate(40)
            ->withQueryString();

        return view('admin.templates', [
            'templates'  => $templates,
            'categories' => Category::query()->ordered()->get(),
            'layouts'    => config('zarafat.layouts'),
            'filters'    => $filters,
            'warnings'   => $this->catalogWarnings(),
        ]);
    }

    public function templateForm(Request $request, ?Template $template = null, ?AiService $ai = null): View
    {
        /* `?kateqoriya=` ilə gəlindikdə kateqoriya öncədən seçilir və yeni şablon
           həmin kateqoriyanın sonuna düşür. */
        $preCat = $request->integer('kateqoriya') ?: null;

        return view('admin.template', [
            'template'   => $template ?? new Template([
                'tone' => 'zarafat', 'layout' => 'notarial', 'palette' => 'gold',
                'is_active' => true, 'category_id' => $preCat,
                'sort' => $preCat
                    ? ((int) Template::query()->where('category_id', $preCat)->max('sort')) + 10
                    : $this->nextSort(Template::query()),
            ]),
            'categories' => Category::query()->ordered()->get(),
            'layouts'    => config('zarafat.layouts'),
            'palettes'   => config('zarafat.palettes'),
            'tones'      => config('zarafat.tones'),
            'types'      => TemplateSchema::TYPES,
            /* Yalnız görünüş üçün: dizaynın azərbaycanca adı, yazdığı növ sözü
               və tələsi; palitranın adı və üç rəngi. İcazə siyahısı yuxarıdadır. */
            'layoutMeta'  => config('zarafat.layout_meta'),
            'paletteMeta' => config('zarafat.palette_meta'),
            /* AI köməkçisi yalnız açar qoyulubsa görünür. */
            'aiEnabled'   => ($ai ?? app(AiService::class))->enabled(),
            'aiModel'     => ($ai ?? app(AiService::class))->model(),
            /* Cavab qatı: niyyət siyahısı və hədəf kateqoriyalar.
               Hədəflər YALNIZ ana kateqoriyalardır — cavaba cavab zəncirin
               özü ilə idarə olunur, `reply_cats` ilə deyil. */
            'replyKinds'   => ReplyKinds::LABELS,
            'replyTargets' => Category::query()->notReplies()->ordered()->get(['slug', 'name', 'tone']),
        ]);
    }

    public function templateSave(Request $request, ?Template $template = null): RedirectResponse
    {
        $template ??= new Template();
        $limits = config('zarafat.limits');

        $data = $request->validate([
            'slug'          => ['required', 'string', 'max:40', 'regex:/^[a-z0-9-]+$/',
                                Rule::unique('templates', 'slug')->ignore($template->id)],
            'category_id'   => ['required', 'integer', Rule::exists('categories', 'id')],
            'layout'        => ['required', Rule::in(config('zarafat.layouts'))],
            'palette'       => ['required', Rule::in(config('zarafat.palettes'))],
            'title'         => ['required', 'string', 'max:' . $limits['title']],
            'tag'           => ['nullable', 'string', 'max:40'],
            'preamble'      => ['required', 'string', 'max:' . $limits['preamble']],
            'powers'        => ['required', 'string', 'max:' . $limits['powers']],
            'penalty'       => ['required', 'string', 'max:' . $limits['penalty']],
            'to_label'      => ['nullable', 'string', 'max:40'],
            'from_label'    => ['nullable', 'string', 'max:40'],
            'powers_label'  => ['nullable', 'string', 'max:40'],
            'penalty_label' => ['nullable', 'string', 'max:40'],
            'reg_prefix'    => ['nullable', 'string', 'regex:/^[A-Z]{2,4}$/'],
            /* Cavab qatı. `reply_kind` dolu olan şablon ana kataloqdan çıxır. */
            'reply_kind'    => ['nullable', Rule::in(ReplyKinds::KINDS)],
            'reply_cats'    => ['nullable', 'array', 'max:24'],
            'reply_cats.*'  => ['string', 'max:40'],
            'sign_title'    => ['nullable', 'string', 'max:40'],
            'sign_org'      => ['nullable', 'string', 'max:60'],
            'share'         => ['nullable', 'string', 'max:' . TemplateSchema::MAX_SHARE_LEN],
            'sort'          => ['required', 'integer', 'min:0', 'max:100000'],
            'is_active'     => ['nullable', 'boolean'],
            'fields'        => ['nullable', 'string'],
            'notes'         => ['nullable', 'string'],
            'cancel_reasons' => ['nullable', 'string'],

            /* İstifadəçi seçimləri — sətir-sətir textarea */
            'title_options'   => ['nullable', 'string', 'max:2000'],
            'powers_options'  => ['nullable', 'string', 'max:4000'],
            'penalty_options' => ['nullable', 'string', 'max:4000'],
            'powers_min'      => ['nullable', 'integer', 'min:1', 'max:' . TemplateSchema::MAX_PICK],
            'powers_max'      => ['nullable', 'integer', 'min:1', 'max:' . TemplateSchema::MAX_PICK],
        ], [], [
            'slug' => 'açar', 'category_id' => 'kateqoriya', 'layout' => 'dizayn', 'palette' => 'palitra',
            'title' => 'başlıq', 'preamble' => 'preamble', 'powers' => 'bəndlər', 'penalty' => 'cəza bəndi',
            'reg_prefix' => 'prefiks', 'sort' => 'sıra',
            'title_options' => 'başlıq variantları', 'powers_options' => 'bənd variantları',
            'penalty_options' => 'cəza bəndi variantları',
            'powers_min' => 'ən azı seçilən', 'powers_max' => 'ən çoxu seçilən',
        ]);

        /* Bəndlər sənəddə sətir-sətir render olunur — say həddi serverdəki ilə eynidir. */
        $powerLines = preg_split('/\R/u', trim($data['powers'])) ?: [];
        $powerLines = array_values(array_filter(array_map('trim', $powerLines), fn ($l) => $l !== ''));

        if (count($powerLines) < 1 || count($powerLines) > $limits['power_lines']) {
            throw ValidationException::withMessages([
                'powers' => 'Bəndlər 1 ilə ' . $limits['power_lines'] . ' sətir arasında olmalıdır (' . count($powerLines) . ' verilib).',
            ]);
        }

        $fields = $this->decodeJson($data['fields'] ?? null, 'fields', 'Anket sxemi');
        /* Bu ikisi sadə mətn siyahısıdır — admin sətir-sətir yazır. Köhnə
           JSON formatı da qəbul olunur ki, kataloqdan kopyalanan dəyər
           («["Bir","İki"]») itməsin. */
        $notes   = $this->decodeList($data['notes'] ?? null, 'notes', 'Qeydlər');
        $reasons = $this->decodeList($data['cancel_reasons'] ?? null, 'cancel_reasons', 'Ləğv səbəbləri');

        /* İstifadəçi seçimləri */
        $optErr = array_merge(
            TemplateSchema::optionErrors('Başlıq variantları', $data['title_options'] ?? null,
                TemplateSchema::MAX_TITLE_OPTS, $limits['title']),
            TemplateSchema::optionErrors('Bənd variantları', $data['powers_options'] ?? null,
                TemplateSchema::MAX_POWER_OPTS, TemplateSchema::MAX_POWER_LINE),
            TemplateSchema::optionErrors('Cəza bəndi variantları', $data['penalty_options'] ?? null,
                TemplateSchema::MAX_PENALTY_OPTS, $limits['penalty']),
        );

        $titleOpts = TemplateSchema::parseOptions($data['title_options'] ?? null,
            TemplateSchema::MAX_TITLE_OPTS, $limits['title']);
        $powerOpts = TemplateSchema::parseOptions($data['powers_options'] ?? null,
            TemplateSchema::MAX_POWER_OPTS, TemplateSchema::MAX_POWER_LINE);
        $penaltyOpts = TemplateSchema::parseOptions($data['penalty_options'] ?? null,
            TemplateSchema::MAX_PENALTY_OPTS, $limits['penalty']);

        /* İki sistem eyni şablonda işləmir: anket cavabları onsuz da bəndləri qurur. */
        if ($fields !== null && $fields !== [] && ($titleOpts || $powerOpts || $penaltyOpts)) {
            $optErr[] = 'Anket sxemi olan şablonda variant siyahıları işləmir — biri boş qalmalıdır.';
        }

        if ($powerOpts !== [] && (int) ($data['powers_min'] ?? 1) > (int) ($data['powers_max'] ?? TemplateSchema::MAX_PICK)) {
            $optErr[] = '«Ən azı seçilən» «ən çoxu seçilən»dən böyük ola bilməz.';
        }

        if ($powerOpts !== [] && (int) ($data['powers_max'] ?? 0) > count($powerOpts)) {
            $optErr[] = '«Ən çoxu seçilən» variant sayından (' . count($powerOpts) . ') böyük ola bilməz.';
        }

        if ($optErr !== []) {
            throw ValidationException::withMessages(['powers_options' => $optErr]);
        }

        [$pMin, $pMax] = TemplateSchema::pickRange($data['powers_min'] ?? null, $data['powers_max'] ?? null, count($powerOpts));

        $schemaErrors = TemplateSchema::validate($fields, $notes ?? [], $data['share'] ?? null, $data['preamble']);

        if ($schemaErrors !== []) {
            throw ValidationException::withMessages(['fields' => $schemaErrors]);
        }

        $category = Category::query()->findOrFail($data['category_id']);

        /* Cavab şablonu YALNIZ cavab kateqoriyasında yaşayır və əksinə.
           İkisi ayrılsa `CatalogService::payload()` şablonu bir açara, onun
           kateqoriyasını isə başqa açara yazar — sayt onu heç vaxt göstərməz. */
        $kind = $data['reply_kind'] ?? null;

        if ($category->is_reply && $kind === null) {
            throw ValidationException::withMessages([
                'reply_kind' => 'Cavab kateqoriyasındakı şablon üçün cavab niyyəti seçilməlidir.',
            ]);
        }

        if (! $category->is_reply && $kind !== null) {
            throw ValidationException::withMessages([
                'reply_kind' => 'Cavab niyyəti yalnız cavab kateqoriyasındakı şablonda ola bilər.',
            ]);
        }

        /* Hədəf kateqoriyalar ana kataloqdan seçilir: cavaba cavab niyyəti
           `reply_cats` ilə deyil, zəncirin özü ilə idarə olunur. */
        $cats = array_values(array_unique(array_filter((array) ($data['reply_cats'] ?? []))));

        if ($cats !== []) {
            $known = Category::query()->notReplies()->pluck('slug')->all();
            $unknown = array_values(array_diff($cats, $known));

            if ($unknown !== []) {
                throw ValidationException::withMessages([
                    'reply_cats' => 'Naməlum kateqoriya: ' . implode(', ', $unknown),
                ]);
            }
        }

        $data['reply_kind'] = $kind;
        $data['reply_cats'] = $cats ?: null;      // boş = universal

        /* Ton kateqoriyadan miras alınır — uyğunsuzluq tab çubuğunu sındırır. */
        $data['tone']           = $category->tone;
        $data['tag']            = (string) ($data['tag'] ?? '');
        $data['is_active']      = $request->boolean('is_active');
        $data['powers']         = implode("\n", $powerLines);
        $data['fields']          = $fields;
        $data['notes']           = $notes;
        $data['cancel_reasons']  = $reasons;
        $data['title_options']   = $titleOpts ?: null;
        $data['powers_options']  = $powerOpts ?: null;
        $data['penalty_options'] = $penaltyOpts ?: null;
        $data['powers_min']      = $pMin;
        $data['powers_max']      = $pMax;

        $wasNew = ! $template->exists;
        $template->fill($data)->save();
        CatalogService::forget();

        return redirect()
            ->route('admin.catalog.templates')
            ->with('status', $wasNew ? "«{$template->title}» şablonu yaradıldı." : "«{$template->title}» yeniləndi.");
    }

    public function templateToggle(Template $template): RedirectResponse
    {
        $template->forceFill(['is_active' => ! $template->is_active])->save();
        CatalogService::forget();

        return back()->with('status', "«{$template->title}» " . ($template->is_active ? 'aktivləşdirildi.' : 'söndürüldü — saytda görünmür.'));
    }

    public function templateDuplicate(Template $template): RedirectResponse
    {
        $copy = $template->replicate();
        $copy->slug = $this->uniqueSlug($template->slug);
        $copy->title = mb_substr($template->title . ' (nüsxə)', 0, 120);
        $copy->is_active = false;
        $copy->sort = $template->sort + 1;
        $copy->save();
        CatalogService::forget();

        return redirect()
            ->route('admin.catalog.templates.edit', $copy)
            ->with('status', 'Nüsxə yaradıldı — söndürülmüş vəziyyətdədir.');
    }

    public function templateDelete(Template $template): RedirectResponse
    {
        $title = $template->title;
        $template->delete();
        CatalogService::forget();

        return redirect()->route('admin.catalog.templates')->with('status', "«{$title}» silindi.");
    }

    /* ==================== İXRAC ==================== */

    /**
     * Cari kataloqu `tools/export-catalog.js` formatında verir.
     * Developer onu `database/seeders/catalog.json` kimi saxlayıb `dist`
     * bundle-ını yeniləyə bilər.
     */
    public function export(): JsonResponse
    {
        $categories = Category::query()->ordered()->get();
        $slugs      = $categories->pluck('slug', 'id');

        $payload = [
            'categories' => $categories->map(fn (Category $c): array => [
                'slug' => $c->slug, 'tone' => $c->tone, 'name' => $c->name,
                'icon' => $c->icon, 'blurb' => $c->blurb, 'sort' => $c->sort,
                'is_reply' => $c->is_reply,
            ])->values(),
            'templates' => Template::query()->orderBy('category_id')->ordered()->get()
                ->map(fn (Template $t): array => [
                    'slug' => $t->slug, 'category' => $slugs[$t->category_id] ?? null, 'tone' => $t->tone,
                    'layout' => $t->layout, 'palette' => $t->palette, 'title' => $t->title, 'tag' => $t->tag,
                    'preamble' => $t->preamble, 'powers' => $t->powers, 'penalty' => $t->penalty,
                    'to_label' => $t->to_label, 'from_label' => $t->from_label,
                    'powers_label' => $t->powers_label, 'penalty_label' => $t->penalty_label,
                    'reg_prefix' => $t->reg_prefix,
                    'reply_kind' => $t->reply_kind, 'reply_cats' => $t->reply_cats,
                    'sign_title' => $t->sign_title,
                    'sign_org' => $t->sign_org, 'share' => $t->share,
                    'fields' => $t->fields, 'notes' => $t->notes, 'cancel_reasons' => $t->cancel_reasons,
                    'title_options' => $t->title_options, 'powers_options' => $t->powers_options,
                    'powers_min' => $t->powers_min, 'powers_max' => $t->powers_max,
                    'penalty_options' => $t->penalty_options,
                    'sort' => $t->sort,
                ])->values(),
        ];

        return response()->json($payload, 200, [
            'Content-Disposition' => 'attachment; filename="catalog.json"',
        ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    }

    /* ==================== köməkçilər ==================== */

    private function decodeJson(?string $raw, string $field, string $label): ?array
    {
        $raw = trim((string) $raw);

        if ($raw === '' || $raw === 'null' || $raw === '[]') {
            return null;
        }

        $value = json_decode($raw, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw ValidationException::withMessages([
                $field => $label . ': JSON oxunmadı — ' . json_last_error_msg(),
            ]);
        }

        if (! is_array($value) || ! array_is_list($value)) {
            throw ValidationException::withMessages([
                $field => $label . ': massiv (JSON array) gözlənilir, məsələn [ … ].',
            ]);
        }

        return $value;
    }

    /**
     * Sətir-sətir mətn siyahısı. Köhnə JSON massivi də oxunur — admin
     * kataloqdan kopyaladığı dəyəri yapışdıra bilir.
     *
     * @return list<string>|null
     */
    private function decodeList(?string $raw, string $field, string $label): ?array
    {
        $raw = trim((string) $raw);

        if ($raw === '' || $raw === 'null' || $raw === '[]') {
            return null;
        }

        if (str_starts_with($raw, '[')) {
            $value = $this->decodeJson($raw, $field, $label) ?? [];

            if (array_filter($value, fn ($v) => ! is_string($v))) {
                throw ValidationException::withMessages([
                    $field => $label . ': yalnız mətn sətirləri ola bilər.',
                ]);
            }
        } else {
            $value = preg_split('/\R/u', $raw) ?: [];
        }

        $out = [];
        foreach ($value as $line) {
            $line = trim(preg_replace('/[ \t]+/u', ' ', (string) $line) ?? '');
            if ($line !== '') {
                $out[] = $line;
            }
        }

        return $out ?: null;
    }

    private function uniqueSlug(string $base): string
    {
        $base = mb_substr($base, 0, 34);

        for ($i = 2; $i < 99; $i++) {
            $slug = $base . '-' . $i;
            if (! Template::query()->where('slug', $slug)->exists()) {
                return $slug;
            }
        }

        return $base . '-' . bin2hex(random_bytes(2));
    }

    private function nextSort($query): int
    {
        return ((int) $query->max('sort')) + 10;
    }

    /**
     * Kataloqun «yumşaq» invariantları. Bunlar admini bloklamır — sayt onlarsız
     * da işləyir — amma `tools/check-templates.js` statik kataloqda onları tələb
     * edir, ona görə fərq göz önündə olmalıdır.
     *
     * @return list<string>
     */
    private function catalogWarnings(): array
    {
        $out     = [];
        $layouts = config('zarafat.layouts');

        $cats = Category::query()->active()->with(['templates' => fn ($q) => $q->where('is_active', true)])->ordered()->get();

        foreach ($cats as $c) {
            /* Cavab kateqoriyaları «12 dizayn · 5 palitra» qaydalarına tabe
               deyil — onlar bir niyyətin seriyasıdır və qəsdən eyni görünür.
               `tools/check-replies.js` onları öz qaydaları ilə yoxlayır. */
            if ($c->is_reply) {
                continue;
            }

            $n = $c->templates->count();

            if ($n === 0) {
                $out[] = "«{$c->name}»: aktiv şablon yoxdur — kateqoriya saytda boş görünəcək.";
                continue;
            }

            $used    = $c->templates->pluck('layout')->unique();
            $missing = array_values(array_diff($layouts, $used->all()));

            if ($missing !== []) {
                $out[] = "«{$c->name}»: " . count($missing) . ' dizayn işlənmir (' . implode(', ', array_slice($missing, 0, 4))
                    . (count($missing) > 4 ? ', …' : '') . ').';
            }

            if ($c->templates->pluck('palette')->unique()->count() < 5) {
                $out[] = "«{$c->name}»: 5-dən az palitra işlənir.";
            }
        }

        /* Cavab şablonları niyyət başına BİR prefiks paylaşır (RDD, ETZ, …) —
           bu, qəsdən belədir və təkrar xəbərdarlığı yalançı olardı. */
        $dupPrefix = Template::query()->whereNotNull('reg_prefix')->notReplies()
            ->selectRaw('reg_prefix, count(*) as n')->groupBy('reg_prefix')->havingRaw('count(*) > 1')->pluck('reg_prefix');

        foreach ($dupPrefix as $p) {
            $out[] = "«{$p}» prefiksi birdən çox şablonda işlənir — nömrə fəzası paylaşılır.";
        }

        return $out;
    }
}
