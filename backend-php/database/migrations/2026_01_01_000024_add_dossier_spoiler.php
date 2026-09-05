<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * İşin sonluğu — yalnız həll olunandan sonra açılan vərəqlər.
 *
 * Qatilin dindirilmə protokolu və məhkəmə qərarı qovluğun bir hissəsidir:
 * eyni blank, eyni möhür, eyni fiktivlik zolağı. Ona görə ayrıca cədvəl yox,
 * bayraq — onlar render qatının EYNİ yolundan keçir.
 *
 * `is_locked` ilə QARIŞDIRILMIR. Kilid `dossier_progress.unlocked_ids`-ə
 * baxır, bu isə `solved || revealed`-ə: iki ayrı ölçüdür və bir vərəq hər
 * ikisini daşıya bilər.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('dossier_documents', function (Blueprint $table): void {
            // Materiallar siyahısında GÖRÜNMÜR — adı belə sızmır.
            $table->boolean('is_spoiler')->default(false)->after('is_sample');
        });
    }

    public function down(): void
    {
        Schema::table('dossier_documents', function (Blueprint $table): void {
            $table->dropColumn('is_spoiler');
        });
    }
};
