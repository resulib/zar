<?php

declare(strict_types=1);

namespace App\Models;

use App\Support\Dossier\Dossier as Kod;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Cache;

class Dossier extends Model
{
    use SoftDeletes;

    public const STATUS_DRAFT = 'draft';
    public const STATUS_PUBLISHED = 'published';
    public const STATUS_REMOVED = 'removed';
    /* İdarəçinin arxivə saldığı qovluq. `removed` ondan fərqlidir — o,
       moderasiyanın gizlətmə vasitəsidir və panelə çıxarılmır. */
    public const STATUS_ARCHIVED = 'archived';

    protected $fillable = [
        'slug', 'no', 'title', 'blurb', 'place', 'period', 'intro', 'badge', 'is_showcase',
        'difficulty', 'read_minutes', 'price_credits',
        'cover', 'meta', 'suspects', 'chronology', 'axis', 'solution', 'status', 'sort',
        'cover_image_id', 'views_count', 'published_at',
    ];

    protected function casts(): array
    {
        return [
            'cover'         => 'array',
            'meta'          => 'array',
            'suspects'      => 'array',
            'chronology'    => 'array',
            'axis'          => 'array',
            'solution'      => 'array',
            'read_minutes'  => 'integer',
            'price_credits' => 'integer',
            'sort'          => 'integer',
            'is_showcase'   => 'boolean',
            'views_count'   => 'integer',
            'published_at'  => 'datetime',
        ];
    }

    public function documents(): HasMany
    {
        return $this->hasMany(DossierDocument::class)->orderBy('sort')->orderBy('id');
    }

    public function questions(): HasMany
    {
        return $this->hasMany(DossierQuestion::class)->orderBy('sort')->orderBy('id');
    }

    public function progress(): HasMany
    {
        return $this->hasMany(DossierProgress::class);
    }

    public function codes(): HasMany
    {
        return $this->hasMany(DossierCode::class)->orderBy('sort')->orderBy('id');
    }

    public function images(): HasMany
    {
        return $this->hasMany(DossierImage::class)->orderBy('sort')->orderBy('id');
    }

    /**
     * Şübhəli SƏTİRLƏRİ — idarəçinin redaktə etdiyi səth.
     *
     * Tel formatı bu deyil: oyun `suspectList()`-dən keçir, çünki mövcud üç iş
     * hələ `dossiers.suspects` JSON sütununu işlədir.
     */
    public function suspectRows(): HasMany
    {
        return $this->hasMany(DossierSuspect::class)->orderBy('sort')->orderBy('id');
    }

    public function endings(): HasMany
    {
        return $this->hasMany(DossierEnding::class);
    }

    public function coverImage(): BelongsTo
    {
        return $this->belongsTo(DossierImage::class, 'cover_image_id');
    }

    /**
     * Oyunun yekun rejimi TÖRƏMƏDİR.
     *
     * Sonluq sətri varsa oyunçu şübhəlilərdən birini seçir; yoxsa köhnə üç
     * suallıq rəy formasını doldurur. Ayrıca sütun sinxronda saxlanılası
     * ikinci həqiqət olardı — mövcud üç iş sonluq yazmadığı üçün öz axınında
     * qalır və heç bir yoxlama pozulmur.
     */
    public function hasEndings(): bool
    {
        return $this->endings()->exists();
    }

    /**
     * Şübhəlilərin TEL FORMATI — `/api/is/{slug}/ac` cavabındakı şəkil.
     *
     * `dossier.js subheliler()` bu massivi oxuyur və alibi zolaqlarını
     * `dossiers.axis` pəncərəsinə görə çəkir. Cədvəl sətirləri varsa onlardan
     * EYNİ ŞƏKİLLİ massiv qurulur, yoxsa köhnə JSON sütunu qaytarılır —
     * beləliklə mövcud üç iş köçürülmədən işləməyə davam edir.
     *
     * @return list<array<string,mixed>>
     */
    public function suspectList(): array
    {
        $rows = $this->relationLoaded('suspectRows') ? $this->suspectRows : $this->suspectRows()->get();

        if ($rows->isEmpty()) {
            return array_values((array) ($this->suspects ?? []));
        }

        return $rows->map(static fn (DossierSuspect $s): array => [
            'init'   => (string) $s->init,
            'name'   => (string) $s->name,
            'role'   => (string) $s->role,
            'bio'    => (string) $s->bio,
            'bars'   => array_values((array) ($s->bars ?? [])),
            'camera' => (string) $s->camera,
        ])->all();
    }
    public function scopePublished(Builder $q): Builder
    {
        return $q->where('status', self::STATUS_PUBLISHED);
    }

    public function scopeVisible(Builder $q): Builder
    {
        return $q->where('status', '!=', self::STATUS_REMOVED);
    }

    /**
     * Göstərilən nömrənin büro kodu — «AFİB-2026/0847» → «AFİB».
     *
     * Üz qabığı nömrəni ikiyə bölür, çünki `.cov-no` 46px-dir və tam forma
     * (14 simvol × 46 × 0.6 ≈ 386px) 412px çərçivəyə sığmır. Qalan hər yerdə
     * tam `no` işlənir.
     */
    public function kod(): string
    {
        $at = mb_strpos((string) $this->no, '-');

        return $at === false ? '' : mb_substr((string) $this->no, 0, $at);
    }

    /** Göstərilən nömrənin rəqəm hissəsi — «AFİB-2026/0847» → «2026/0847». */
    public function nomre(): string
    {
        $at = mb_strpos((string) $this->no, '-');

        return $at === false ? (string) $this->no : mb_substr((string) $this->no, $at + 1);
    }

    public function isFree(): bool
    {
        return (int) $this->price_credits === 0;
    }

    /** Ana səhifədə ödənişsiz göstərilən vərəqlər. */
    public function samples(): HasMany
    {
        return $this->documents()->where('is_sample', true);
    }

    /** Kataloq lentinin yazısı. Naməlum dəyər lent göstərmir. */
    public function badgeLabel(): string
    {
        return (string) (((array) config('dossier.badge_labels'))[$this->badge] ?? '');
    }

    /** Alibi oxunun vaxt nişanları. Boşdursa zolaqlar nişansız göstərilir. */
    public function axisLabels(): array
    {
        return array_values(array_map('strval', (array) ($this->axis ?? [])));
    }

    /**
     * Neçə nəfər oynayıb və neçə faizi ilk cəhddə tapıb.
     *
     * Sütun deyil, `dossier_progress`-dən hesablanır — sayğac sütunu
     * saxlamaq həm artıq yazma, həm də səhv düşmə riskidir. Nəticə qısa
     * müddətə keşlənir: təqdimat səhifəsi hər açılışda iki COUNT etməməlidir.
     *
     * `firstTry` YALNIZ işi bitirənlərə görə hesablanır: hələ oynayanları
     * məxrəcə salsaq, faiz vaxt keçdikcə süni şəkildə düşərdi.
     *
     * @return array{plays:int,solved:int,firstTry:int|null,show:bool}
     */
    public function stats(): array
    {
        $cfg = (array) config('dossier.stats');

        /** @var array{plays:int,solved:int,first:int} $raw */
        $raw = Cache::remember(
            'dossier:stats:' . $this->id,
            now()->addMinutes((int) ($cfg['cache_minutes'] ?? 10)),
            function (): array {
                $q = DossierProgress::query()->where('dossier_id', $this->id);

                return [
                    'plays'  => (clone $q)->whereNotNull('access_at')->count(),
                    'solved' => (clone $q)->where('solved', true)->count(),
                    'first'  => (clone $q)->where('solved', true)->where('attempts', 1)->count(),
                ];
            }
        );

        return [
            'plays'    => (int) $raw['plays'],
            'solved'   => (int) $raw['solved'],
            'firstTry' => $raw['solved'] > 0 ? (int) round($raw['first'] * 100 / $raw['solved']) : null,
            'show'     => (int) $raw['plays'] >= (int) ($cfg['min_plays'] ?? 0),
        ];
    }

    public function link(): string
    {
        return Kod::link((string) config('dossier.public_url'), (string) $this->slug);
    }

    /**
     * Qovluğun öz önizləmə şəkli.
     *
     * Şəkil build vaxtı hazırlanır (`npm run render:dossier-og`) və public
     * qovluğuna commit olunur — sertifikat şəklindən fərqli olaraq bu, hər
     * qovluq üçün birdəfəlik statik fayldır.
     */
    public function ogUrl(): string
    {
        $dir = trim((string) config('dossier.og.dir'), '/');

        return $this->hasOg()
            ? rtrim((string) config('dossier.public_url'), '/') . '/' . $dir . '/' . $this->slug . '.jpg'
            : '';
    }

    public function hasOg(): bool
    {
        $dir = trim((string) config('dossier.og.dir'), '/');

        return is_file(public_path($dir . '/' . $this->slug . '.jpg'));
    }

    /**
     * Sosial önizləmə mətni.
     *
     * Burada NƏ ŞÜBHƏLİ ADI, NƏ İZAH var: link WhatsApp qrupunda görünür və
     * hələ oynamamış adamın oyununu korlamamalıdır.
     */
    public function ogMeta(): array
    {
        return [
            'title'       => 'İş № ' . $this->no . ' — ' . $this->title,
            'description' => (string) $this->blurb,
            'image'       => $this->ogUrl(),
        ];
    }

    /** Siyahı kartı. Ödəniş olmadan da göstərilir — sirr saxlamır. */
    public function toListArray(): array
    {
        return [
            'slug'       => (string) $this->slug,
            'no'         => (string) $this->no,
            'title'      => (string) $this->title,
            'blurb'      => (string) $this->blurb,
            'place'      => (string) $this->place,
            'period'     => (string) $this->period,
            'badge'      => (string) $this->badge,
            'difficulty' => (string) $this->difficulty,
            'minutes'    => (int) $this->read_minutes,
            'price'      => (int) $this->price_credits,
        ];
    }
}
