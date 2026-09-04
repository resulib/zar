<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * SƏHV İTTİHAMLAR — sonluq rejimində seçilmiş, amma doğru olmayan şübhəlilər.
 *
 * Sayğac deyil, TƏKRARSIZ SİYAHI saxlanılır: sonluq rejimində cəhd limiti
 * yoxdur və hər sonluğu oxumaq oyunun bir hissəsidir, ona görə eyni şübhəlini
 * ikinci dəfə seçmək bir səhv sayılmalıdır, iki yox.
 *
 * Sual rejimində bu sütun BOŞ QALIR — orada səhv sayı onsuz da `attempts`
 * sütunundadır.
 *
 * SQLite: indekssiz və FK-sız sadə JSON sütunu mövcud cədvəli yenidən qurmur.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('dossier_progress', 'wrong_suspect_ids')) {
            return;
        }

        Schema::table('dossier_progress', function (Blueprint $table): void {
            $table->json('wrong_suspect_ids')->nullable();
        });
    }

    public function down(): void
    {
        if (! Schema::hasColumn('dossier_progress', 'wrong_suspect_ids')) {
            return;
        }

        // İndeks yoxdur, ona görə dropIndex lazım deyil (bax ..._000015).
        Schema::table('dossier_progress', function (Blueprint $table): void {
            $table->dropColumn('wrong_suspect_ids');
        });
    }
};
