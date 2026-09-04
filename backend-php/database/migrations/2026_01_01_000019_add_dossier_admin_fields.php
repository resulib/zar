<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * İdarə panelindən qovluq yaratmaq üçün lazım olan sahələr.
 *
 * Bu günə qədər qovluq yalnız seed faylı ilə yaradılırdı: cədvəllər idarə
 * paneli üçün şəkillənmişdi, amma panel qurulmamışdı. Buradakı sütunlar
 * həmin boşluğu doldurur.
 *
 * `status` sütunu `string(12)`-dir, ona görə `archived` dəyəri üçün AYRICA
 * miqrasiya lazım deyil — sadəcə `Dossier::STATUS_ARCHIVED` sabiti əlavə
 * olunur. Köhnə `removed` dəyəri qalır: o, idarəçinin deyil, moderasiyanın
 * gizlətmə vasitəsidir.
 *
 * `body` sənədin yeni əsas formatıdır. Boş qaldıqda render qatı köhnə yolu —
 * `content.bloklar` ardıcıllığını — işlədir, yəni mövcud 84 vərəq bayt-bayt
 * eyni qalır. Dolduqda mətn oxunur və içindəki `{{ sekil:… }}` / `{{ blok:… }}`
 * nişanları açılır.
 *
 * `draft_body` isə dərc olunmuş işi redaktə edərkən oyunçunun yarımçıq mətn
 * görməməsi üçündür: saxlama ora yazır, «dərc et» onu `body`-yə köçürür.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('dossiers', function (Blueprint $table): void {
            /* Üz qabığı şəkli — `dossier_images` sətrinə istinad. FK qoyulmur,
               səbəbi 000020 miqrasiyasında izah olunur. */
            $table->unsignedBigInteger('cover_image_id')->nullable()->after('cover');
            $table->unsignedInteger('views_count')->default(0)->after('sort');
            $table->timestamp('published_at')->nullable()->after('views_count');
            $table->softDeletes();
        });

        Schema::table('dossier_documents', function (Blueprint $table): void {
            /* Sənədin növü — idarə panelində nişan və süzgəc üçün. `kind`
               oyunçuya görünən sərbəst mətndir («Qərar»), bu isə ağ siyahıdır. */
            $table->string('doc_type', 12)->default('other')->after('kind');
            /* Başlığın altındakı quru sətir: arayış nömrəsi, tarix, saat. */
            $table->string('meta_line', 200)->default('')->after('doc_type');
            $table->longText('body')->nullable()->after('content');
            $table->longText('draft_body')->nullable()->after('body');
            /* Blank növü YALNIZ `body` rejimində işlənir — köhnə vərəqlərdə
               letterhead `blank` blokunun özündədir və ikiqat çəkilməməlidir. */
            $table->string('blank_nov', 12)->default('')->after('draft_body');
            $table->unsignedBigInteger('unlock_code_id')->nullable()->after('lock_hint');
            $table->index('unlock_code_id');
        });
    }

    public function down(): void
    {
        Schema::table('dossier_documents', function (Blueprint $table): void {
            $table->dropIndex(['unlock_code_id']);
            $table->dropColumn(['doc_type', 'meta_line', 'body', 'draft_body', 'blank_nov', 'unlock_code_id']);
        });

        Schema::table('dossiers', function (Blueprint $table): void {
            $table->dropSoftDeletes();
            $table->dropColumn(['cover_image_id', 'views_count', 'published_at']);
        });
    }
};
