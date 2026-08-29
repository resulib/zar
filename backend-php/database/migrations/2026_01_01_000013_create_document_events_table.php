<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Cavab döngəsinin ölçülməsi.
     *
     * `documents.views` yalnız «neçə dəfə baxıldı» sualına cavab verir; cavab
     * döngəsinin konversiyası üçün hadisə-səviyyəsində qeyd lazımdır: düymə
     * klikləndi → redaktor açıldı → sənəd yarandı → paylaşıldı.
     *
     * `updated_at` yoxdur — sətir yazıldıqdan sonra dəyişmir.
     */
    public function up(): void
    {
        Schema::create('document_events', function (Blueprint $table) {
            $table->id();

            /* Hadisənin aid olduğu sənəd. Sənəd silinsə hadisə statistikada qalır. */
            $table->foreignId('document_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();

            // reply_click · reply_open · reply_created · reply_shared
            $table->string('event', 24)->index();

            // Cavab niyyəti: redd · etiraz · tekrar · legv · qebul · xatire
            $table->string('kind', 12)->nullable();

            // Orijinal sənədin kateqoriyası — «kateqoriya üzrə cavab nisbəti» üçün
            $table->string('cat', 40)->nullable();

            $table->unsignedTinyInteger('depth')->default(0);

            $table->timestamp('created_at')->nullable();

            $table->index(['event', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('document_events');
    }
};
