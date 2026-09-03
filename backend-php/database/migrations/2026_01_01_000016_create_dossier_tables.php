<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * İş qovluğu bölməsi — AYRI cədvəllər.
 *
 * Səbəb dəvətnamələrdəki ilə eynidir: `documents` reyestrə, kataloqa və idarə
 * panelindəki ümumi siyahıya bağlıdır. İş qovluğu isə nə reyestrə düşür, nə də
 * şablon kataloqundan gəlir — ümumi siyahıya düşməməsinin ən etibarlı yolu
 * həmin siyahının sorğuladığı cədvəldə ümumiyyətlə olmamaqdır.
 *
 * İki sütun BİLƏRƏKDƏN modeldə gizlədilir və heç bir API cavabında yer almır:
 * `dossier_documents.lock_code` və `dossier_questions.correct_index`. Oyunun
 * bütün mənası budur — onlar brauzerə çatsa, bölmə mənasını itirir.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dossiers', function (Blueprint $table): void {
            $table->id();
            // İş nömrəsi «2026/0847»-dir, amma URL-də kəsr işarəsi işləmir:
            // `slug` ünvan üçün («2026-0847»), `no` göstərmək üçündür.
            $table->string('slug', 16)->unique();
            $table->string('no', 16);

            $table->string('title', 120);
            $table->string('blurb', 400)->default('');
            $table->string('difficulty', 12)->default('orta');
            $table->unsignedSmallInteger('read_minutes')->default(30);
            // Birinci qovluq 0-dır: giriş qovluğu hamı üçün pulsuzdur.
            $table->unsignedInteger('price_credits')->default(5);

            // Formaları müxtəlif olduğu üçün JSON: üz qabığı, iş məlumatları,
            // dindirilənlər, gecənin xronologiyası, yekun izah.
            $table->json('cover')->nullable();
            $table->json('meta')->nullable();
            $table->json('suspects')->nullable();
            $table->json('chronology')->nullable();
            $table->json('solution')->nullable();

            $table->string('status', 12)->default('draft')->index();
            $table->unsignedInteger('sort')->default(0);
            $table->timestamps();
        });

        Schema::create('dossier_documents', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('dossier_id')->constrained()->cascadeOnDelete();

            // Vərəq nömrəsi rəqəm deyil: «14–15» kimi aralıq ola bilir.
            $table->string('page', 12)->default('');
            $table->string('name', 160);
            $table->string('kind', 40)->default('');
            $table->string('type', 16);
            $table->unsignedInteger('sort')->default(0);

            $table->boolean('is_locked')->default(false);
            // Kod HTML-ə heç vaxt düşmür — müqayisə yalnız serverdə aparılır.
            $table->string('lock_code', 8)->default('');
            $table->string('lock_hint', 300)->default('');

            $table->json('content')->nullable();
            $table->timestamps();

            $table->index(['dossier_id', 'sort']);
        });

        Schema::create('dossier_questions', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('dossier_id')->constrained()->cascadeOnDelete();

            $table->string('prompt', 200);
            $table->json('options');
            // Düzgün cavab yalnız burada bilinir.
            $table->unsignedTinyInteger('correct_index')->default(0);
            $table->string('explanation', 500)->default('');
            $table->unsignedInteger('sort')->default(0);
            $table->timestamps();

            $table->index(['dossier_id', 'sort']);
        });

        Schema::create('dossier_progress', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('dossier_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            $table->string('investigator', 60)->default('');

            // Girişin açıldığı an — kredit yalnız bir dəfə xərclənir.
            $table->timestamp('access_at')->nullable();
            // Vaxt SERVERDƏ sayılır: brauzerdəki sayğac yalnız göstərmə üçündür.
            $table->timestamp('started_at')->nullable();
            $table->timestamp('finished_at')->nullable();
            $table->unsignedInteger('duration_seconds')->nullable();

            $table->json('read_ids')->nullable();
            $table->json('pinned_ids')->nullable();
            $table->json('unlocked_ids')->nullable();

            $table->unsignedTinyInteger('attempts')->default(0);
            $table->boolean('solved')->default(false);
            // Cəhdlər bitəndə izah açılır, amma sertifikat verilmir.
            $table->boolean('revealed')->default(false);

            $table->string('cert_token', 32)->nullable()->unique();
            $table->boolean('cert_ready')->default(false);
            $table->timestamps();

            $table->unique(['dossier_id', 'user_id']);
            $table->index(['user_id', 'updated_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dossier_progress');
        Schema::dropIfExists('dossier_questions');
        Schema::dropIfExists('dossier_documents');
        Schema::dropIfExists('dossiers');
    }
};
