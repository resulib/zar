<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Cavab sənədi qatı.
     *
     * Sənəd başqa bir sənədə cavab ola bilər: `reply_to_id` valideyni göstərir,
     * `reply_root_id` isə bütün zəncirin kökünü daşıyır — tarixçəni bir SELECT
     * ilə çıxarmaq üçün (rekursiv sorğu SQLite-da lazımsız mürəkkəblikdir).
     *
     * Bütün sütunlar nullable və ya defaultludur: mövcud sənədlər
     * `reply_to_id = null`, `reply_depth = 0` alır və heç nə dəyişmir.
     */
    public function up(): void
    {
        Schema::table('documents', function (Blueprint $table) {
            $table->foreignId('reply_to_id')->nullable()->after('template_id')
                ->constrained('documents')->nullOnDelete();

            /* Zəncirin kökü. Kökün özündə null qalır — «kök mənəm» deməkdir. */
            $table->foreignId('reply_root_id')->nullable()->after('reply_to_id')
                ->constrained('documents')->nullOnDelete();

            $table->unsignedTinyInteger('reply_depth')->default(0)->after('reply_root_id');

            /* Zəncirin MÖVZU kateqoriyası — kök sənədin kateqoriya slug-ı.
               Denormallaşdırılıb, çünki cavab sənədinin öz kateqoriyası niyyət
               kateqoriyasıdır (`c-redd`) və mövzunu göstərmir. Klient uyğun
               cavab variantlarını məhz buna görə süzür. */
            $table->string('reply_topic', 40)->nullable()->after('reply_depth');

            $table->index(['reply_root_id', 'reply_depth']);
        });

        Schema::table('templates', function (Blueprint $table) {
            /* Doludursa bu şablon cavab şablonudur və ana kataloqdan kənardadır. */
            $table->string('reply_kind', 12)->nullable()->index()->after('reg_prefix');

            /* Hansı orijinal kateqoriyalara cavab verir. null = universal ehtiyat. */
            $table->json('reply_cats')->nullable()->after('reply_kind');
        });

        Schema::table('categories', function (Blueprint $table) {
            /* Cavab kateqoriyaları saytın kateqoriya zolağında görünmür. */
            $table->boolean('is_reply')->default(false)->index()->after('is_active');
        });
    }

    public function down(): void
    {
        /* Yalnız `dropColumn`: SQLite-da `dropForeign`/`dropIndex` ayrıca
           çağırıldıqda istisna atır, sütun silindikdə isə cədvəl onsuz da
           yenidən qurulur və indekslərlə açarlar onunla birlikdə gedir. */
        Schema::table('documents', function (Blueprint $table) {
            $table->dropColumn(['reply_to_id', 'reply_root_id', 'reply_depth', 'reply_topic']);
        });

        Schema::table('templates', function (Blueprint $table) {
            $table->dropColumn(['reply_kind', 'reply_cats']);
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->dropColumn('is_reply');
        });
    }
};
