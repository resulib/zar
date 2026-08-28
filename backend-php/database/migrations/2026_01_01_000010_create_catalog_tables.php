<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Şablon kataloqu bazaya köçürülür — admin paneldən idarə olunsun deyə.
     * `frontend/templates.js` toxum və offline ehtiyat kimi qalır.
     */
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('slug', 40)->unique();       // frontend-dəki `id`
            $table->string('tone', 10)->default('zarafat')->index();
            $table->string('name', 60);
            $table->string('icon', 8)->nullable();
            $table->string('blurb', 300)->default('');
            $table->unsignedInteger('sort')->default(0);
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
        });

        Schema::create('templates', function (Blueprint $table) {
            $table->id();
            $table->string('slug', 40)->unique();       // frontend-dəki `id`
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->string('tone', 10)->default('zarafat')->index();
            $table->string('layout', 20)->default('notarial');
            $table->string('palette', 20)->default('gold');

            $table->string('title', 120);
            $table->string('tag', 40)->default('');
            $table->text('preamble');
            $table->text('powers');
            $table->text('penalty');

            // İstəyə bağlı etiket üstələmələri — sənəddə `labels` JSON-una çevrilir
            $table->string('to_label', 40)->nullable();
            $table->string('from_label', 40)->nullable();
            $table->string('powers_label', 40)->nullable();
            $table->string('penalty_label', 40)->nullable();

            // Şablona xas qeydiyyat prefiksi: CCV, HDQ, … Boşdursa qlobal ZRF.
            $table->string('reg_prefix', 4)->nullable();

            // Anket qatı
            $table->string('sign_title', 40)->nullable();
            $table->string('sign_org', 60)->nullable();
            $table->string('share', 180)->nullable();
            $table->json('fields')->nullable();
            $table->json('notes')->nullable();
            $table->json('cancel_reasons')->nullable();

            $table->unsignedInteger('sort')->default(0);
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();

            $table->index(['category_id', 'sort']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('templates');
        Schema::dropIfExists('categories');
    }
};
