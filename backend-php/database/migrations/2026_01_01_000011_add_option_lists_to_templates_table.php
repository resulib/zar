<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * İstifadəçi seçimləri: saytda ziyarətçi yalnız adları sərbəst yazır,
     * başlıq · bəndlər · cəza bəndi isə bu siyahılardan seçilir.
     * Siyahı boşdursa şablonun öz mətni kilidli göstərilir.
     */
    public function up(): void
    {
        Schema::table('templates', function (Blueprint $table) {
            $table->json('title_options')->nullable()->after('penalty');
            $table->json('powers_options')->nullable()->after('title_options');

            /* NULLABLE DEYİL: boş `<input type="number">` `ConvertEmptyStringsToNull`
               ilə null olur — `templates.tag` ilə eyni tələ. */
            $table->unsignedTinyInteger('powers_min')->default(1)->after('powers_options');
            $table->unsignedTinyInteger('powers_max')->default(4)->after('powers_min');

            $table->json('penalty_options')->nullable()->after('powers_max');
        });
    }

    public function down(): void
    {
        Schema::table('templates', function (Blueprint $table) {
            $table->dropColumn([
                'title_options', 'powers_options', 'powers_min', 'powers_max', 'penalty_options',
            ]);
        });
    }
};
