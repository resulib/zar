<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Şəkillər, şübhəlilər və sonluqlar.
 *
 * ŞƏKİL ilə SƏNƏD arasında ayrıca əlaqə cədvəli YOXDUR — bağ mətnin
 * içindəki `{{ sekil:slug }}` nişanından çıxarılır. Bir şəkil bir neçə
 * vərəqdə görünə bilər və nişan silinəndə bağ da yox olur; ayrıca cədvəl
 * yalnız sinxronda saxlanılası ikinci həqiqət olardı.
 *
 * `owner_document_id` isə SPOİLER qorumasıdır, əlaqə deyil: şəkil kilidli
 * vərəqə aiddirsə, kod açılmayınca fayl verilmir. Sahə boşdursa şəkil
 * qovluğun ümumi materialıdır.
 *
 * ŞÜBHƏLİLƏR: `dossiers.suspects` JSON sütunu TEL FORMATI olaraq qalır —
 * `/api/is/{slug}/ac` cavabı və `dossier.js subheliler()` onu oxuyur, alibi
 * zolaqlarının ortaq vaxt oxu ona bağlıdır. Bu cədvəl idarəçinin REDAKTƏ
 * SƏTHİDİR; `Dossier::suspectList()` ikisi arasında körpüdür və mövcud üç iş
 * köçürülmür.
 *
 * SONLUQLAR: sətir varsa oyun şübhəli-seçimi rejimindədir, yoxsa köhnə üç
 * suallıq rejimdə. Rejim TÖRƏMƏDİR — ayrıca sütun bir də sinxronda saxlanılası
 * dəyər olardı.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dossier_images', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('dossier_id')->constrained()->cascadeOnDelete();
            /* Mətnə nişan kimi yazılan açar. İş daxilində unikaldır. */
            $table->string('slug', 60);
            $table->string('caption', 300)->default('');
            $table->string('image_type', 16)->default('generic');
            /* Kilidli vərəqin şəkli — kod açılmayınca 404. */
            $table->unsignedBigInteger('owner_document_id')->nullable();
            /* Fayl adları təsadüfi 32 simvoldur: ad heç vaxt məzmunu bildirmir. */
            $table->string('original_path', 160);
            $table->string('medium_path', 160);
            $table->string('thumb_path', 160);
            $table->unsignedInteger('width')->default(0);
            $table->unsignedInteger('height')->default(0);
            $table->unsignedInteger('filesize')->default(0);
            $table->unsignedInteger('sort')->default(0);
            $table->timestamps();

            $table->unique(['dossier_id', 'slug']);
            $table->index('owner_document_id');
        });

        Schema::create('dossier_suspects', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('dossier_id')->constrained()->cascadeOnDelete();
            $table->string('init', 4)->default('');
            $table->string('name', 80);
            $table->string('role', 120)->default('');
            $table->string('bio', 600)->default('');
            /* Alibi zolaqları: [[başlanğıc %, uzunluq %], …] — `dossiers.axis`
               ilə təyin olunan pəncərənin FAİZLƏRİDİR, saat deyil. */
            $table->json('bars')->nullable();
            $table->string('camera', 200)->default('');
            $table->unsignedBigInteger('photo_id')->nullable();
            $table->boolean('is_culprit')->default(false);
            $table->unsignedInteger('sort')->default(0);
            $table->timestamps();

            $table->index(['dossier_id', 'sort']);
        });

        Schema::create('dossier_endings', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('dossier_id')->constrained()->cascadeOnDelete();
            $table->unsignedBigInteger('suspect_id');
            $table->boolean('is_true_ending')->default(false);
            $table->text('verdict_text');
            /* Yalnız doğru sonluqda göndərilir — modelin `$hidden`-indədir. */
            $table->text('reveal_text')->nullable();
            /* Üç saniyə sonra çıxan tək sətir. Gecikmə brauzerdədir. */
            $table->string('sting_line', 300)->default('');
            $table->timestamps();

            $table->unique(['dossier_id', 'suspect_id']);
        });

        Schema::table('dossier_progress', function (Blueprint $table): void {
            $table->unsignedBigInteger('chosen_suspect_id')->nullable()->after('revealed');
        });
    }

    public function down(): void
    {
        Schema::table('dossier_progress', function (Blueprint $table): void {
            $table->dropColumn('chosen_suspect_id');
        });

        Schema::dropIfExists('dossier_endings');
        Schema::dropIfExists('dossier_suspects');
        Schema::dropIfExists('dossier_images');
    }
};
