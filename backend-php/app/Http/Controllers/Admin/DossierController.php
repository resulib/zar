<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Dossier;
use App\Models\DossierCode;
use App\Models\DossierDocument;
use App\Models\DossierEnding;
use App\Models\DossierImage;
use App\Models\DossierQuestion;
use App\Models\DossierProgress;
use App\Models\DossierSuspect;
use App\Services\DossierService;
use App\Support\Dossier\BlokSxemi;
use App\Support\Dossier\SekilYuvalari;
use App\Support\Dossier\Dossier as Kod;
use App\Support\Dossier\QovluqYoxlayici;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\View\View;

/**
 * İş qovluqlarının idarə paneli.
 *
 * Naxış `Admin\CatalogController`-dəndir: opsional marşrut modeli →
 * `validate()` → domen invariantları → `fill()->save()` → yönləndirmə.
 *
 * BURADA KEŞ SIFIRLAMASI YOXDUR — kataloqdan fərqli olaraq qovluq məzmunu
 * keşlənmir; keşlənən yeganə şey `Dossier::stats()`-dır və o, onsuz da on
 * dəqiqəlikdir.
 */
class DossierController extends Controller
{
    public function __construct(private readonly DossierService $dossiers)
    {
    }

    /* ----------------------------------------------------------------
     | Siyahı
     |---------------------------------------------------------------- */

    public function index(): View
    {
        $list = Dossier::query()
            ->withCount(['documents', 'images'])
            ->orderBy('sort')
            ->orderByDesc('id')
            ->get();

        /* AI paneli yalnız açar varsa göstərilir — `AiService` ilə eyni
           qayda: açarsız düymə yalnız xəta verərdi. */
        return view('admin.dossier.index', [
            'list' => $list,
            'ai'   => app(\App\Services\DossierAiService::class)->enabled(),
        ]);
    }

    /* ----------------------------------------------------------------
     | İşin redaktoru
     |---------------------------------------------------------------- */

    public function form(?Dossier $dossier = null): View
    {
        $dossier ??= new Dossier(['difficulty' => 'orta', 'status' => Dossier::STATUS_DRAFT]);

        return view('admin.dossier.form', [
            'dossier'  => $dossier,
            'docs'     => $dossier->exists ? $dossier->documents()->get() : collect(),
            'kodlar'   => $dossier->exists ? $dossier->codes()->get() : collect(),
            'subhelil' => $dossier->exists ? $dossier->suspectRows()->get() : collect(),
            'sonluql'  => $dossier->exists ? $dossier->endings()->get()->keyBy('suspect_id') : collect(),
            'sekiller' => $dossier->exists ? $dossier->images()->get() : collect(),
            'suallar'  => $dossier->exists ? $dossier->questions()->get() : collect(),
            'rapor'    => $dossier->exists ? $this->yoxla($dossier) : ['xetalar' => [], 'qeydler' => []],
            /* ŞƏKİL YUVALARI — sənədlərin özündən hesablanır. Ayrıca cədvəl
               yoxdur və olmamalıdır: yuva mətndəki nişandan və blokların
               `sekil` açarından doğur, yəni sənəd dəyişəndə siyahı da
               özü dəyişməlidir. */
            'yuvalar'  => $dossier->exists ? $this->sekilYuvalari($dossier) : [],
        ]);
    }

    /**
     * Sənədlərin istədiyi şəkil yuvaları + hər birinin vəziyyəti.
     *
     * SUAL TƏRSİNƏ ÇEVRİLİR. Redaktorda idarəçi şəkli yükləyəndə açarı əl
     * ilə yazır, yəni yuvanın adını qabaqcadan bilməli olur. Halbuki cavab
     * sənədlərin içindədir: `{{ sekil:… }}` nişanı, `foto` blokunun və
     * maddi sübut kartlarının `sekil` açarı. Onları oxuyub siyahı qurmaq
     * idarəçini yadda saxlamaqdan azad edir.
     *
     * @return list<array<string,mixed>>
     */
    protected function sekilYuvalari(Dossier $dossier): array
    {
        $senedler = $dossier->documents()->orderBy('sort')->get()
            ->map(static fn (DossierDocument $d): array => [
                'id'      => (int) $d->id,
                'page'    => (string) $d->page,
                'name'    => (string) $d->name,
                /* Qaralama da taranır: idarəçi hələ dərc etməyib, amma
                   şəkli indidən yükləmək istəyə bilər. */
                'body'    => (string) ($d->draft_body ?: $d->body),
                'content' => (array) $d->content,
            ])->all();

        $var = $dossier->images()->get()->keyBy('slug');

        return array_map(static function (array $y) use ($var): array {
            $y['sekil'] = $y['acar'] === '' ? null : $var->get($y['acar']);

            return $y;
        }, SekilYuvalari::qovluqda($senedler));
    }

    public function save(Request $request, ?Dossier $dossier = null): RedirectResponse
    {
        $dossier ??= new Dossier();

        $data = $request->validate([
            'slug'          => ['required', 'string', 'regex:/^[0-9]{4}-[0-9]{4}$/',
                /* `whereNull('deleted_at')` YAZILMIR: `dossiers.slug` sütununda
                   BAZA SƏVİYYƏSİNDƏ UNIQUE indeks var və o, silinmiş sətirləri də
                   görür. Validasiya indeksdən yumşaq olsaydı, yoxlama keçər,
                   sonra INSERT 500 verərdi. Qaralamanın silinməsi elə buna görə
                   `forceDelete()`-dir — bax `destroy()`. */
                Rule::unique('dossiers', 'slug')->ignore($dossier->id)],
            'title'         => ['required', 'string', 'max:120'],
            'blurb'         => ['nullable', 'string', 'max:400'],
            'place'         => ['nullable', 'string', 'max:120'],
            'period'        => ['nullable', 'string', 'max:60'],
            'intro'         => ['nullable', 'string', 'max:900'],
            'difficulty'    => ['required', Rule::in(config('dossier.difficulties'))],
            'badge'         => ['nullable', Rule::in(config('dossier.badges'))],
            'read_minutes'  => ['required', 'integer', 'min:1', 'max:600'],
            'price_credits' => ['required', 'integer', 'min:0', 'max:1000'],
            'sort'          => ['required', 'integer', 'min:0', 'max:100000'],
            'status'        => ['required', Rule::in([
                Dossier::STATUS_DRAFT, Dossier::STATUS_PUBLISHED, Dossier::STATUS_ARCHIVED,
            ])],
            'cover_image_id' => ['nullable', 'integer'],
        ], [], [
            'slug' => 'açar', 'title' => 'ad', 'intro' => 'giriş mətni',
            'difficulty' => 'çətinlik', 'status' => 'vəziyyət', 'sort' => 'sıra',
        ]);

        /* `ConvertEmptyStringsToNull` boş sahəni null edir, sütun isə NOT NULL-dur. */
        foreach (['blurb', 'place', 'period', 'intro', 'badge'] as $k) {
            $data[$k] = (string) ($data[$k] ?? '');
        }

        /* Üz qabığı şəkli MÜTLƏQ bu qovluğun şəkli olmalıdır: başqa işin id-si
           yazılsa, kataloqda o işin materialı görünərdi. */
        $data['cover_image_id'] = $this->oznunSekli($dossier, $data['cover_image_id'] ?? null);

        $data['no'] = Kod::nomre($data['slug']) === ''
            ? $data['slug']
            : \App\Support\Dossier\Byuro::isNomresi($data['slug']);

        /* DƏRC ETMƏ QAPISI. Yoxlayıcının xətaları varsa status dəyişmir —
           yarımçıq iş oyunçuya çıxmamalıdır. */
        if ($data['status'] === Dossier::STATUS_PUBLISHED && $dossier->exists) {
            $rapor = $this->yoxla($dossier);

            if ($rapor['xetalar'] !== []) {
                return back()
                    ->withErrors(['status' => 'Dərc etmək üçün əvvəlcə xətalar düzəldilməlidir.'])
                    ->withInput();
            }
        }

        if ($data['status'] === Dossier::STATUS_PUBLISHED && $dossier->published_at === null) {
            $data['published_at'] = now();
        }

        $yeni = ! $dossier->exists;
        $dossier->fill($data)->save();

        return redirect()->route('admin.dossier.form', $dossier)
            ->with('status', $yeni ? "«{$dossier->title}» yaradıldı." : "«{$dossier->title}» yeniləndi.");
    }

    public function archive(Dossier $dossier): RedirectResponse
    {
        $dossier->forceFill([
            'status' => $dossier->status === Dossier::STATUS_ARCHIVED
                ? Dossier::STATUS_DRAFT
                : Dossier::STATUS_ARCHIVED,
        ])->save();

        return back()->with('status', $dossier->status === Dossier::STATUS_ARCHIVED
            ? "«{$dossier->title}» arxivləndi."
            : "«{$dossier->title}» arxivdən çıxarıldı.");
    }

    /**
     * İşin silinməsi — YALNIZ dərc olunmamış iş.
     *
     * Dərc olunmuş iş silinmir, arxivlənir: kimsə onu oynayıb və
     * `dossier_progress` sətri `cascadeOnDelete` ilə yox olardı — yəni
     * adamın irəliləyişi və sertifikatı silinərdi. Səhvən yaradılmış
     * qaralamanın isə silinməməsi üçün heç bir səbəb yoxdur.
     *
     * Silmə HƏQİQİDİR (`forceDelete`), soft deyil: `dossiers.slug` sütununda
     * baza səviyyəsində UNIQUE indeks var və gizlədilmiş sətir həmin açarı
     * əbədi bağlayardı — səhvən «2026-0501» yazıb silən idarəçi həmin nömrəni
     * bir daha işlədə bilməzdi. `SoftDeletes` trait-i modeldə qalır, çünki o,
     * BAŞQA yerlərdən gələn təsadüfi `delete()` çağırışını tutur; burada isə
     * niyyət açıqdır və açıq yazılır.
     *
     * Şəkil faylları diskdə qalır — sətir getdiyi üçün onlara heç bir yol
     * qalmır və növbəti təmizlik onları götürə bilər.
     */
    public function destroy(Dossier $dossier): RedirectResponse
    {
        if ($dossier->status === Dossier::STATUS_PUBLISHED) {
            return back()->withErrors(['status' => 'Dərc olunmuş iş silinmir — əvvəlcə arxivləyin.']);
        }

        $ad = (string) $dossier->title;
        $dossier->forceDelete();

        return redirect()->route('admin.dossier')->with('status', "«{$ad}» silindi.");
    }

    /**
     * İşin nüsxəsi — sənədləri, kodları, şübhəliləri, sonluqları və şəkilləri
     * ilə birlikdə.
     *
     * Şəkil FAYLLARI da kopyalanır, yalnız sətirlər yox: iki iş eyni fayla
     * baxsaydı, birindən şəkli silmək digərini sındırardı.
     */
    public function duplicate(Dossier $dossier): RedirectResponse
    {
        $yeni = DB::transaction(function () use ($dossier): Dossier {
            $nusxe = $dossier->replicate(['views_count', 'published_at', 'deleted_at']);
            $nusxe->slug = $this->bosSlug();
            $nusxe->no = \App\Support\Dossier\Byuro::isNomresi($nusxe->slug);
            $nusxe->title = mb_substr($dossier->title . ' (nüsxə)', 0, 120);
            $nusxe->status = Dossier::STATUS_DRAFT;
            $nusxe->is_showcase = false;
            $nusxe->views_count = 0;
            $nusxe->published_at = null;
            $nusxe->cover_image_id = null;
            $nusxe->save();

            /* Şəkillər ƏVVƏL köçürülür: sənədin `owner_document_id`-si sonra
               bağlanacaq, amma şəkil id xəritəsi elə indi lazımdır. */
            $sekilXerite = [];

            foreach ($dossier->images()->get() as $s) {
                $sekilXerite[$s->id] = $this->sekliKopyala($s, $nusxe)?->id;
            }

            $kodXerite = [];

            foreach ($dossier->codes()->get() as $k) {
                $yk = $k->replicate();
                $yk->dossier_id = $nusxe->id;
                $yk->save();
                $kodXerite[$k->id] = $yk->id;
            }

            $senedXerite = [];

            foreach ($dossier->documents()->get() as $d) {
                $yd = $d->replicate();
                $yd->dossier_id = $nusxe->id;
                $yd->unlock_code_id = $kodXerite[$d->unlock_code_id] ?? null;
                $yd->save();
                $senedXerite[$d->id] = $yd->id;
            }

            /* Şəkillərin sahib vərəqi yeni id-lərə bağlanır. */
            foreach ($nusxe->images()->get() as $s) {
                if ($s->owner_document_id !== null) {
                    $s->forceFill(['owner_document_id' => $senedXerite[$s->owner_document_id] ?? null])->save();
                }
            }

            $subheliXerite = [];

            foreach ($dossier->suspectRows()->get() as $s) {
                $ys = $s->replicate();
                $ys->dossier_id = $nusxe->id;
                $ys->photo_id = $sekilXerite[$s->photo_id] ?? null;
                $ys->save();
                $subheliXerite[$s->id] = $ys->id;
            }

            foreach ($dossier->endings()->get() as $e) {
                $ye = $e->replicate();
                $ye->dossier_id = $nusxe->id;
                $ye->suspect_id = $subheliXerite[$e->suspect_id] ?? 0;
                $ye->save();
            }

            foreach ($dossier->questions()->get() as $q) {
                $yq = $q->replicate();
                $yq->dossier_id = $nusxe->id;
                $yq->save();
            }

            if ($dossier->cover_image_id !== null) {
                $nusxe->forceFill(['cover_image_id' => $sekilXerite[$dossier->cover_image_id] ?? null])->save();
            }

            return $nusxe;
        });

        return redirect()->route('admin.dossier.form', $yeni)
            ->with('status', "Nüsxə yaradıldı: «{$yeni->title}».");
    }

    /**
     * Bütün qaralamaları birdən dərc et.
     *
     * Vərəq-vərəq gəzmək əvəzinə bir düymə: dərc olunmuş işi redaktə edən
     * idarəçi adətən beş-on vərəqə toxunur və hamısını eyni anda görünməli
     * edir — yarısı köhnə, yarısı yeni qovluq oxunmur.
     */
    public function publishAll(Dossier $dossier): RedirectResponse
    {
        $say = 0;

        foreach ($dossier->documents()->get() as $d) {
            if ($d->hasDraft()) {
                $d->forceFill(['body' => (string) $d->draft_body, 'draft_body' => null])->save();
                $say++;
            }
        }

        return back()->with('status', $say === 0
            ? 'Dərc olunmamış qaralama yox idi.'
            : "{$say} sənədin qaralaması dərc olundu.");
    }

    /**
     * Hekayə məlumatı — meta sətirləri, xronologiya, alibi oxu və həll.
     *
     * Bunlar qovluğun mətnidir, sənədlərin yox: oyunçu onları «Şübhəlilər»,
     * «Qeydlər» və yekun ekranlarında görür. Seed faylı ilə gələn üç işdə
     * hamısı doludur, amma idarə panelində görünmürdü — yəni hazır işi
     * redaktə etmək mümkün deyildi.
     *
     * Hamısı SƏTİR-SƏTİR yazılır, JSON kimi yox: `CatalogController`-dəki
     * `decodeList()` ilə eyni qərar — idarəçi mötərizə saymamalıdır.
     */
    public function storySave(Request $request, Dossier $dossier): RedirectResponse
    {
        $data = $request->validate([
            'meta'       => ['nullable', 'string', 'max:4000'],
            'chronology' => ['nullable', 'string', 'max:8000'],
            'axis'       => ['nullable', 'string', 'max:200'],
            'solution'   => ['nullable', 'string', 'max:12000'],
        ], [], [
            'meta' => 'məlumat sətirləri', 'chronology' => 'xronologiya',
            'axis' => 'vaxt oxu', 'solution' => 'həll',
        ]);

        $dossier->forceFill([
            'meta'       => self::cutler((string) ($data['meta'] ?? '')),
            'chronology' => self::cutler((string) ($data['chronology'] ?? '')),
            'axis'       => self::setirler((string) ($data['axis'] ?? '')),
            'solution'   => self::setirler((string) ($data['solution'] ?? ''), "\n"),
        ])->save();

        return redirect()->route('admin.dossier.form', $dossier)->with('status', 'Hekayə yeniləndi.');
    }

    /**
     * Yekun sual — üç suallıq rejimin özəyi.
     *
     * QATİL BURADADIR: birinci sualın düzgün variantı odur. Sual redaktoru
     * olmasa, hazır işin cavabını idarə panelindən görmək mümkün deyil.
     */
    public function questionSave(Request $request, Dossier $dossier, ?DossierQuestion $question = null): RedirectResponse
    {
        $question ??= new DossierQuestion(['dossier_id' => $dossier->id]);
        $this->oznu($dossier, $question);

        $data = $request->validate([
            'prompt'      => ['required', 'string', 'max:200'],
            'options'     => ['required', 'string', 'max:2000'],
            'correct'     => ['required', 'integer', 'min:0', 'max:7'],
            'explanation' => ['nullable', 'string', 'max:500'],
            'sort'        => ['nullable', 'integer', 'min:0', 'max:100'],
        ], [], ['prompt' => 'sual', 'options' => 'variantlar', 'correct' => 'düzgün cavab']);

        $variant = self::setirler((string) $data['options']);
        $hedd = (int) config('dossier.limits.options', 8);

        if (count($variant) < 2) {
            return back()->withErrors(['options' => 'Ən azı iki variant lazımdır.'])->withInput();
        }

        $variant = array_slice($variant, 0, $hedd);

        $question->fill([
            'prompt'        => $data['prompt'],
            'options'       => $variant,
            /* Düzgün cavabın indeksi siyahıdan KƏNARA çıxa bilməz: çıxsaydı,
               oyunda heç bir seçim doğru olmazdı və səbəb görünməzdi. */
            'correct_index' => min((int) $data['correct'], count($variant) - 1),
            'explanation'   => (string) ($data['explanation'] ?? ''),
            'sort'          => (int) ($data['sort'] ?? ($dossier->questions()->max('sort') + 1)),
        ])->save();

        return redirect()->route('admin.dossier.form', $dossier)->with('status', 'Sual yadda saxlanıldı.');
    }

    public function questionDelete(Dossier $dossier, DossierQuestion $question): RedirectResponse
    {
        $this->oznu($dossier, $question);
        $question->delete();

        return back()->with('status', 'Sual silindi.');
    }

    /**
     * «ad | dəyər» sətirlərini cütlərə çevirir.
     *
     * @return list<array{0:string,1:string}>
     */
    protected static function cutler(string $metn): array
    {
        $out = [];

        foreach (preg_split('/\r\n|\r|\n/', $metn) ?: [] as $setir) {
            $setir = trim($setir);

            if ($setir === '') {
                continue;
            }

            $par = explode('|', $setir, 2);
            $out[] = [trim($par[0]), trim($par[1] ?? '')];
        }

        return $out;
    }

    /**
     * Sətir-sətir siyahı. `$ayirici` verilsə, boş sətirlə bölünmüş abzaslar.
     *
     * @return list<string>
     */
    protected static function setirler(string $metn, string $ayirici = ''): array
    {
        $parca = $ayirici === ''
            ? (preg_split('/\r\n|\r|\n/', $metn) ?: [])
            : (preg_split('/(\r?\n){2,}/', $metn) ?: []);

        $out = [];

        foreach ($parca as $p) {
            $p = trim((string) $p);

            if ($p !== '') {
                $out[] = $p;
            }
        }

        return $out;
    }
    /* ----------------------------------------------------------------
     | Sənədin redaktoru
     |---------------------------------------------------------------- */

    public function doc(Dossier $dossier, ?DossierDocument $document = null): View
    {
        $document ??= new DossierDocument([
            'dossier_id' => $dossier->id,
            'doc_type'   => 'other',
            'lock_kind'  => 'reqem',
            'blank_nov'  => 'resmi',
            'sort'       => (int) $dossier->documents()->max('sort') + 1,
        ]);

        $this->oznu($dossier, $document);

        return view('admin.dossier.sened', [
            'dossier'  => $dossier,
            'doc'      => $document,
            'kodlar'   => $dossier->codes()->get(),
            'sekiller' => $dossier->images()->get(),
            'kartlar'  => self::kartBloklari($document),
            'fotolar'  => self::fotoBloklari($document),
            'hovuz'    => \App\Models\DossierPoolImage::query()->orderByDesc('id')->get(),
            'novler'   => (array) config('dossier.sened_novleri'),
            'blanklar' => BlokSxemi::BLANK_NOV,
        ]);
    }

    public function docSave(Request $request, Dossier $dossier, ?DossierDocument $document = null): RedirectResponse
    {
        $document ??= new DossierDocument(['dossier_id' => $dossier->id]);
        $this->oznu($dossier, $document);

        $data = $this->senedData($request, $dossier);

        /* QARALAMA MƏNTİQİ. Dərc olunmuş işdə saxlama `draft_body`-yə yazır:
           oyunçu yarımçıq mətn görməməlidir. Qaralama işdə birbaşa `body`-yə
           yazılır — onsuz da heç kim oxumur və iki sahə saxlamaq mənasızdır. */
        $govde = (string) ($request->input('body') ?? '');

        if ($dossier->status === Dossier::STATUS_PUBLISHED && $document->exists) {
            $data['draft_body'] = $govde === (string) $document->body ? null : $govde;
        } else {
            $data['body'] = $govde;
            $data['draft_body'] = null;
        }

        $yeni = ! $document->exists;

        if ($yeni) {
            $data['sort'] = (int) $dossier->documents()->max('sort') + 1;
        }

        $document->fill($data)->save();
        $this->kartlariYaz($document, $request);
        $this->fotolariYaz($document, $request);

        if ($request->boolean('kart_blok')) {
            $this->kartBlokuElaveEt($document);
        }

        return redirect()->route('admin.dossier.doc', [$dossier, $document])
            ->with('status', $yeni ? 'Sənəd yaradıldı.' : 'Sənəd yadda saxlanıldı.');
    }

    /** Bir sənədin qaralamasını dərc et. */
    public function docPublish(Dossier $dossier, DossierDocument $document): RedirectResponse
    {
        $this->oznu($dossier, $document);

        if (! $document->hasDraft()) {
            return back()->with('status', 'Bu sənəddə dərc olunmamış qaralama yoxdur.');
        }

        $document->forceFill(['body' => (string) $document->draft_body, 'draft_body' => null])->save();

        return back()->with('status', 'Sənəd dərc olundu.');
    }

    public function docDelete(Dossier $dossier, DossierDocument $document): RedirectResponse
    {
        $this->oznu($dossier, $document);

        /* Sahibi bu vərəq olan şəkillər qalır, amma sahibsizləşir — silinsəydi,
           idarəçi başqa vərəqdə istifadə etdiyi kadrı da itirərdi. */
        DossierImage::query()->where('owner_document_id', $document->id)
            ->update(['owner_document_id' => null]);

        $document->delete();

        return redirect()->route('admin.dossier.form', $dossier)->with('status', 'Sənəd silindi.');
    }

    /**
     * Sıralama — sürüşdürmədən sonra toplu yeniləmə.
     *
     * Yalnız BU qovluğun sənədləri qəbul edilir: başqa işin id-si göndərilsə,
     * onun sırası səssizcə pozulardı.
     */
    public function reorder(Request $request, Dossier $dossier): JsonResponse
    {
        $ids = array_values(array_filter(array_map('intval', (array) $request->input('ids', []))));
        $oznu = $dossier->documents()->pluck('id')->all();

        $sira = 0;

        foreach ($ids as $id) {
            if (! in_array($id, $oznu, true)) {
                continue;
            }

            DossierDocument::query()->where('id', $id)->update(['sort' => ++$sira]);
        }

        return response()->json(['ok' => true, 'say' => $sira]);
    }

    /**
     * Canlı önizləmə.
     *
     * Oyundakı görkəmin EYNİSİDİR, çünki eyni `renderDocument()` yolundan
     * keçir — sadələşdirilmiş ikinci render qatı gec-tez əslindən fərqlənərdi.
     * `admin: true` yalnız çatışmayan nişanı görünən edir.
     *
     * Sənəd YADDA SAXLANMIR: forma dəyərləri müvəqqəti modelə yazılır.
     */
    public function preview(Request $request, Dossier $dossier, ?DossierDocument $document = null): JsonResponse
    {
        $document ??= new DossierDocument(['dossier_id' => $dossier->id, 'sort' => 1]);
        $this->oznu($dossier, $document);

        $document->fill($this->senedData($request, $dossier));
        $document->body = (string) ($request->input('body') ?? '');
        /* Kartlar və foto bağlamaları da formadan oxunur — YADDA SAXLANMADAN:
           idarəçi şəkli seçən kimi vərəqdə görməlidir. */
        $document->content = self::fotolariBirlesdir(
            self::kartlariBirlesdir((array) $document->content, $request->input('kartlar')),
            $request->input('fotolar'),
        );

        /* Kilid vəziyyəti önizləmədə heç vaxt qapalı olmur: idarəçi mətni
           görmək üçün öz koduna klaviatura döyməməlidir. */
        $p = new DossierProgress([
            'dossier_id'   => $dossier->id,
            'investigator' => 'A.Müstəntiq',
            'unlocked_ids' => $document->exists ? [$document->id] : [],
        ]);

        return response()->json([
            'ok'   => true,
            'html' => $this->dossiers->renderDocument($dossier, $document, $p, true),
        ]);
    }

    /* ----------------------------------------------------------------
     | Kod · şübhəli · sonluq
     |---------------------------------------------------------------- */

    public function codeSave(Request $request, Dossier $dossier, ?DossierCode $code = null): RedirectResponse
    {
        $code ??= new DossierCode(['dossier_id' => $dossier->id]);
        $this->oznu($dossier, $code);

        $data = $request->validate([
            'code'      => ['required', 'string', 'max:12', 'regex:/^[A-Za-z0-9.\-]+$/'],
            'label'     => ['nullable', 'string', 'max:80'],
            'hint_note' => ['nullable', 'string', 'max:400'],
            'sort'      => ['nullable', 'integer', 'min:0', 'max:10000'],
        ], [], ['code' => 'kod', 'label' => 'ad']);

        $data['label'] = (string) ($data['label'] ?? '');
        $data['hint_note'] = (string) ($data['hint_note'] ?? '');
        $data['sort'] = (int) ($data['sort'] ?? 0);
        $data['source_document_ids'] = $this->oznuIdler($dossier, $request->input('source_document_ids', []));

        $code->fill($data)->save();

        /* DENORMALLAŞDIRMA. Kodun avtoritet nüsxəsi vərəqin `lock_code`
           sütunudur — `unlock()` müqayisəni orada `hash_equals` ilə aparır və
           `$hidden` qalxanı oradadır. Kod dəyişəndə onu açan hər vərəq də
           yenilənməlidir, yoxsa iki həqiqət yaranar. */
        DossierDocument::query()
            ->where('unlock_code_id', $code->id)
            ->update(['lock_code' => $code->code]);

        return redirect()->route('admin.dossier.form', $dossier)->with('status', 'Kod yadda saxlanıldı.');
    }

    public function codeDelete(Dossier $dossier, DossierCode $code): RedirectResponse
    {
        $this->oznu($dossier, $code);

        /* FK yoxdur (SQLite cədvəli yenidən qurardı), ona görə bağ əl ilə
           qırılır. `lock_code` toxunulmur: vərəq kilidli qalır və idarəçi ona
           yeni kod seçənə qədər köhnə kodla açılır. */
        DossierDocument::query()->where('unlock_code_id', $code->id)->update(['unlock_code_id' => null]);
        $code->delete();

        return back()->with('status', 'Kod silindi.');
    }

    public function suspectSave(Request $request, Dossier $dossier, ?DossierSuspect $suspect = null): RedirectResponse
    {
        $suspect ??= new DossierSuspect(['dossier_id' => $dossier->id]);
        $this->oznu($dossier, $suspect);

        $data = $request->validate([
            'name'   => ['required', 'string', 'max:80'],
            'init'   => ['nullable', 'string', 'max:4'],
            'role'   => ['nullable', 'string', 'max:120'],
            'bio'    => ['nullable', 'string', 'max:600'],
            'camera' => ['nullable', 'string', 'max:200'],
            'sort'   => ['nullable', 'integer', 'min:0', 'max:10000'],
        ], [], ['name' => 'ad', 'role' => 'rol']);

        foreach (['init', 'role', 'bio', 'camera'] as $k) {
            $data[$k] = (string) ($data[$k] ?? '');
        }

        $data['sort'] = (int) ($data['sort'] ?? 0);
        $data['photo_id'] = $this->oznunSekli($dossier, $request->input('photo_id'));
        $data['is_culprit'] = $request->boolean('is_culprit');
        $suspect->fill($data)->save();

        /* Qatil BİR nəfərdir: yeni işarə qoyulanda köhnəsi götürülür, yoxsa
           yoxlayıcı «bir neçə qatil» xətası verər və idarəçi səbəbini
           axtarardı. */
        if ($data['is_culprit']) {
            DossierSuspect::query()
                ->where('dossier_id', $dossier->id)
                ->where('id', '!=', $suspect->id)
                ->update(['is_culprit' => false]);
        }

        return redirect()->route('admin.dossier.form', $dossier)->with('status', 'Şübhəli yadda saxlanıldı.');
    }

    public function suspectDelete(Dossier $dossier, DossierSuspect $suspect): RedirectResponse
    {
        $this->oznu($dossier, $suspect);
        DossierEnding::query()->where('dossier_id', $dossier->id)->where('suspect_id', $suspect->id)->delete();
        $suspect->delete();

        return back()->with('status', 'Şübhəli silindi.');
    }

    public function endingSave(Request $request, Dossier $dossier, DossierSuspect $suspect): RedirectResponse
    {
        $this->oznu($dossier, $suspect);

        $data = $request->validate([
            'verdict_text' => ['required', 'string', 'max:4000'],
            'reveal_text'  => ['nullable', 'string', 'max:8000'],
            'sting_line'   => ['nullable', 'string', 'max:300'],
        ], [], ['verdict_text' => 'hökm mətni']);

        $data['sting_line'] = (string) ($data['sting_line'] ?? '');
        $data['is_true_ending'] = $request->boolean('is_true_ending');

        $ending = DossierEnding::query()->firstOrNew([
            'dossier_id' => $dossier->id,
            'suspect_id' => $suspect->id,
        ]);

        $ending->fill($data)->save();

        /* Doğru sonluq da birdir — eyni səbəb. */
        if ($data['is_true_ending']) {
            DossierEnding::query()
                ->where('dossier_id', $dossier->id)
                ->where('id', '!=', $ending->id)
                ->update(['is_true_ending' => false]);
        }

        return redirect()->route('admin.dossier.form', $dossier)->with('status', 'Sonluq yadda saxlanıldı.');
    }

    /* ----------------------------------------------------------------
     | Köməkçilər
     |---------------------------------------------------------------- */

    /** @return array{xetalar: list<string>, qeydler: list<string>} */
    protected function yoxla(Dossier $dossier): array
    {
        return QovluqYoxlayici::yoxla([
            'senedler' => $dossier->documents()->get()->map(static fn (DossierDocument $d): array => [
                'id'             => (int) $d->id,
                'page'           => (string) $d->page,
                'name'           => (string) $d->name,
                'body'           => (string) $d->body,
                'draft_body'     => $d->draft_body,
                'is_locked'      => (bool) $d->is_locked,
                'unlock_code_id' => $d->unlock_code_id,
                'bloklar'        => (array) (((array) $d->content)['bloklar'] ?? []),
            ])->all(),
            'kodlar' => $dossier->codes()->get()->map(static fn (DossierCode $k): array => [
                'id'                  => (int) $k->id,
                'code'                => (string) $k->code,
                'label'               => (string) $k->label,
                'source_document_ids' => $k->sourceIds(),
            ])->all(),
            'subheliler' => $dossier->suspectRows()->get()->map(static fn (DossierSuspect $s): array => [
                'id'         => (int) $s->id,
                'name'       => (string) $s->name,
                'is_culprit' => (bool) $s->is_culprit,
            ])->all(),
            'sonluqlar' => $dossier->endings()->get()->map(static fn (DossierEnding $e): array => [
                'suspect_id'     => (int) $e->suspect_id,
                'is_true_ending' => (bool) $e->is_true_ending,
                'verdict_text'   => (string) $e->verdict_text,
            ])->all(),
            'sekiller' => $dossier->images()->get()->map(static fn (DossierImage $s): array => [
                'slug' => (string) $s->slug,
            ])->all(),
        ]);
    }

    /** @return array<string,mixed> */
    protected function senedData(Request $request, Dossier $dossier): array
    {
        $data = $request->validate([
            'page'      => ['nullable', 'string', 'max:12'],
            'name'      => ['required', 'string', 'max:160'],
            'kind'      => ['nullable', 'string', 'max:40'],
            'doc_type'  => ['required', Rule::in(config('dossier.sened_novleri'))],
            'meta_line' => ['nullable', 'string', 'max:200'],
            'blank_nov' => ['required', Rule::in(BlokSxemi::BLANK_NOV)],
            'lock_kind' => ['required', Rule::in(BlokSxemi::KILID_NOV)],
            'lock_hint' => ['nullable', 'string', 'max:300'],
            'body'      => ['nullable', 'string', 'max:60000'],
        ], [], ['name' => 'başlıq', 'doc_type' => 'növ', 'body' => 'mətn']);

        foreach (['page', 'kind', 'meta_line', 'lock_hint'] as $k) {
            $data[$k] = (string) ($data[$k] ?? '');
        }

        unset($data['body']);

        $data['is_locked'] = $request->boolean('is_locked');
        $data['is_sample'] = $request->boolean('is_sample');
        $data['is_spoiler'] = $request->boolean('is_spoiler');

        $kod = $data['is_locked'] ? $this->oznunKodu($dossier, $request->input('unlock_code_id')) : null;
        $data['unlock_code_id'] = $kod?->id;

        /* Kod vərəqə DENORMALLAŞDIRILIR — səbəb `codeSave()`-dədir. */
        $data['lock_code'] = (string) ($kod->code ?? '');

        return $data;
    }

    /**
     * Sənəddəki maddi sübut blokları — idarə formasının qurduğu siyahı.
     *
     * Bir sənəddə bir neçə `kart` bloku ola bilər (qovluqlarda iki-ikidir),
     * ona görə blokun indeksi də qaytarılır: forma sahələri məhz onunla
     * adlanır və yerlərinə qayıdır.
     *
     * @return list<array{i:int, kartlar:list<array<string,mixed>>}>
     */
    public static function kartBloklari(DossierDocument $doc): array
    {
        $out = [];

        foreach ((array) (((array) $doc->content)['bloklar'] ?? []) as $i => $b) {
            if (is_array($b) && ($b['tip'] ?? '') === 'kart') {
                $out[] = [
                    'i'       => (int) $i,
                    'acar'    => (string) ($b['acar'] ?? ''),
                    'kartlar' => array_values((array) ($b['kartlar'] ?? [])),
                ];
            }
        }

        return $out;
    }

    /**
     * Sənədə boş maddi sübut bloku əlavə edir.
     *
     * Blok redaktoru bütövlükdə qurulmayıb — sənəd hələ də bloklar
     * ardıcıllığıdır və onu seed faylı verir. Amma maddi sübutlar
     * istisnadır: onlar məhz idarə panelindən yazılan məzmundur, çünki
     * hər əşyanın öz fotosu var və foto yalnız buradan yüklənə bilər.
     *
     * Bloka `acar` verilir ki, mətn rejimində `{{ blok:subutlar }}` nişanı
     * ilə istənilən yerə salınsın; blok rejimində isə sadəcə sona düşür.
     */
    protected function kartBlokuElaveEt(DossierDocument $doc): void
    {
        $c = (array) $doc->content;
        $bloklar = array_values((array) ($c['bloklar'] ?? []));

        /* Açar sənəd daxilində unikal olmalıdır — nişan onu birbaşa daşıyır. */
        $var = [];

        foreach ($bloklar as $b) {
            if (is_array($b) && isset($b['acar'])) {
                $var[(string) $b['acar']] = true;
            }
        }

        $acar = 'subutlar';

        for ($i = 2; isset($var[$acar]); $i++) {
            $acar = 'subutlar-' . $i;
        }

        $bloklar[] = ['tip' => 'kart', 'acar' => $acar, 'kartlar' => []];
        $c['bloklar'] = $bloklar;

        $doc->forceFill(['content' => $c])->save();
    }

    /** Formadan gələn kartları sənədin `content`-inə yazır. */
    protected function kartlariYaz(DossierDocument $doc, Request $request): void
    {
        $yeni = self::kartlariBirlesdir((array) $doc->content, $request->input('kartlar'));

        if ($yeni !== (array) $doc->content) {
            $doc->forceFill(['content' => $yeni])->save();
        }
    }

    /**
     * Sənəddəki foto blokları — idarə formasının şəkil bağlama siyahısı.
     *
     * Kart naxşının eynisidir: blok redaktoru bütövlükdə yoxdur, amma şəkil
     * yalnız idarə panelindən yüklənə bildiyi üçün foto çərçivəsi istisnadır —
     * tərcümeyi-hal vərəqlərinin portret yeri məhz budur. İzah və nisbət
     * yalnız GÖSTƏRİLİR, redaktə olunmur: onlar vərəqin məzmunudur.
     *
     * @return list<array{i:int, sekil:string, izah:string, nisbet:string}>
     */
    public static function fotoBloklari(DossierDocument $doc): array
    {
        $out = [];

        foreach ((array) (((array) $doc->content)['bloklar'] ?? []) as $i => $b) {
            if (is_array($b) && ($b['tip'] ?? '') === 'foto') {
                $out[] = [
                    'i'      => (int) $i,
                    'sekil'  => (string) ($b['sekil'] ?? ''),
                    'izah'   => (string) ($b['izah'] ?? ''),
                    'nisbet' => (string) ($b['nisbet'] ?? '4:3'),
                ];
            }
        }

        return $out;
    }

    /** Formadan gələn foto bağlamalarını sənədin `content`-inə yazır. */
    protected function fotolariYaz(DossierDocument $doc, Request $request): void
    {
        $yeni = self::fotolariBirlesdir((array) $doc->content, $request->input('fotolar'));

        if ($yeni !== (array) $doc->content) {
            $doc->forceFill(['content' => $yeni])->save();
        }
    }

    /**
     * Formadan gələn foto bağlamalarını mövcud `content` ilə birləşdirir.
     *
     * Yalnız `foto` bloklarının `sekil` açarına toxunur — izah, nömrə və
     * nisbət olduğu kimi qalır. Boş seçim açarı SİLİR: çərçivə «foto əlavə
     * edilməyib» halına qayıdır.
     */
    protected static function fotolariBirlesdir(array $content, mixed $gelen): array
    {
        if (! is_array($gelen) || $gelen === []) {
            return $content;
        }

        $bloklar = (array) ($content['bloklar'] ?? []);

        foreach ($gelen as $i => $f) {
            $i = (int) $i;

            if (! isset($bloklar[$i]) || ! is_array($bloklar[$i]) || ($bloklar[$i]['tip'] ?? '') !== 'foto') {
                continue;
            }

            /* Açar ağ siyahıdan keçmir — kitabxanada olmayan açar render
               zamanı boş çərçivəyə düşür, yəni zərərsizdir. Forması isə
               yoxlanılır: kənar dəyər `BlokSxemi`-ni sındırardı. */
            $sekil = trim((string) (is_array($f) ? ($f['sekil'] ?? '') : ''));

            if ($sekil !== '' && BlokSxemi::acarDuzgun($sekil)) {
                $bloklar[$i]['sekil'] = $sekil;
            } else {
                unset($bloklar[$i]['sekil']);
            }
        }

        $content['bloklar'] = array_values($bloklar);

        return $content;
    }

    /**
     * Formadan gələn kartları mövcud `content` ilə birləşdirir.
     *
     * Yalnız `kart` bloklarına toxunur: qalan on iki blok növü olduğu kimi
     * qalır. Adı boş olan sətir SİLİNMİŞ sayılır — ayrıca «sil» düyməsi
     * əvəzinə bu, formada bir addım azdır.
     *
     * @param array<string,mixed> $content
     * @return array<string,mixed>
     */
    protected static function kartlariBirlesdir(array $content, mixed $gelen): array
    {
        if (! is_array($gelen) || $gelen === []) {
            return $content;
        }

        $bloklar = (array) ($content['bloklar'] ?? []);

        foreach ($gelen as $i => $kartlar) {
            $i = (int) $i;

            if (! isset($bloklar[$i]) || ! is_array($bloklar[$i]) || ($bloklar[$i]['tip'] ?? '') !== 'kart') {
                continue;
            }

            $temiz = [];

            foreach ((array) $kartlar as $k) {
                $ad = trim((string) ($k['ad'] ?? ''));

                if ($ad === '') {
                    continue;
                }

                $kart = [
                    'ad'   => mb_substr($ad, 0, 120),
                    'metn' => mb_substr(trim((string) ($k['metn'] ?? '')), 0, 2000),
                ];

                /* Şəkil açarı ağ siyahıdan keçmir — kitabxanada olmayan açar
                   render zamanı boş çərçivəyə düşür, yəni zərərsizdir. Amma
                   forması yoxlanılır: nişan əlifbasından kənar dəyər
                   `BlokSxemi`-ni sındırardı. */
                $sekil = trim((string) ($k['sekil'] ?? ''));

                if ($sekil !== '' && BlokSxemi::acarDuzgun($sekil)) {
                    $kart['sekil'] = $sekil;
                }

                if (! empty($k['elyazma'])) {
                    $kart['elyazma'] = true;
                }

                $temiz[] = $kart;
            }

            $bloklar[$i]['kartlar'] = $temiz;
        }

        $content['bloklar'] = array_values($bloklar);

        return $content;
    }

    /** Model bu qovluğa aiddirmi — yoxsa 404. */
    protected function oznu(Dossier $dossier, mixed $model): void
    {
        if ($model === null || ! $model->exists) {
            return;
        }

        abort_if((int) $model->dossier_id !== (int) $dossier->id, 404);
    }

    protected function oznunKodu(Dossier $dossier, mixed $id): ?DossierCode
    {
        $id = (int) $id;

        return $id === 0 ? null : $dossier->codes()->whereKey($id)->first();
    }

    protected function oznunSekli(Dossier $dossier, mixed $id): ?int
    {
        $id = (int) $id;

        if ($id === 0 || ! $dossier->exists) {
            return null;
        }

        return $dossier->images()->whereKey($id)->exists() ? $id : null;
    }

    /** @return list<int> */
    protected function oznuIdler(Dossier $dossier, mixed $ids): array
    {
        $ids = array_values(array_unique(array_map('intval', (array) $ids)));

        return array_values($dossier->documents()->whereKey($ids)->pluck('id')->map('intval')->all());
    }

    /** İstifadə olunmayan slug — nüsxə üçün. */
    protected function bosSlug(): string
    {
        $il = (int) date('Y');

        for ($i = 1; $i < 9999; $i++) {
            $slug = $il . '-' . str_pad((string) $i, 4, '0', STR_PAD_LEFT);

            if (! Dossier::withTrashed()->where('slug', $slug)->exists()) {
                return $slug;
            }
        }

        return $il . '-9999';
    }

    /** Şəkil sətrini və ÜÇ FAYLINI yeni qovluğa kopyala. */
    protected function sekliKopyala(DossierImage $s, Dossier $hedef): ?DossierImage
    {
        $baza = rtrim((string) config('dossier.sekil.path'), '/');
        $qovluq = $baza . '/' . $hedef->id;

        if (! is_dir($qovluq) && ! @mkdir($qovluq, 0775, true) && ! is_dir($qovluq)) {
            return null;
        }

        $yeni = $s->replicate();
        $yeni->dossier_id = $hedef->id;

        foreach (['original_path', 'medium_path', 'thumb_path'] as $k) {
            $menbe = $baza . '/' . $s->{$k};
            $ad = \App\Support\Dossier\Sekil::ad();

            if (is_file($menbe)) {
                @copy($menbe, $qovluq . '/' . $ad);
            }

            $yeni->{$k} = $hedef->id . '/' . $ad;
        }

        $yeni->save();

        return $yeni;
    }
}
