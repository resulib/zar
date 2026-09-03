<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Satış üzü üçün lazım olan sahələr.
 *
 * Oyun tərəfi bunlarsız da işləyirdi; bunlar qovluğu SATMAQ üçündür —
 * təqdimat səhifəsinin mətni, kataloq kartının nişanı və ana səhifədə
 * pulsuz göstərilən nümunə vərəqlər.
 *
 * `axis` ayrıca izah istəyir: alibi zolaqlarının vaxt nişanları bu günə
 * qədər `dossier.js`-ə sabit yazılmışdı («23:30 / 00:30 / 01:30»). Telefonda
 * onlar hər şəxsin öz zolağının altındakı təkrarlanan yazıdır, kompüterdə isə
 * BİR ORTAQ OXUN tərifinə çevrilir — və ikinci işin gecəsi başqa saatlardadır.
 * Məlumatdan gəlməsə, ikinci işdə ox səssizcə yanlış olardı.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('dossiers', function (Blueprint $table): void {
            $table->string('place', 120)->default('')->after('blurb');
            $table->string('period', 60)->default('')->after('place');
            // Təqdimat səhifəsinin giriş mətni. `blurb` qısa qalır — o, kartdadır.
            $table->string('intro', 900)->default('')->after('period');
            // Kataloq lenti: yeni · en-cox · cetin. Ağ siyahı config-dədir.
            $table->string('badge', 16)->default('')->after('intro');
            // Ana səhifədəki hero və nümunə vərəqlər bu qovluqdan gəlir.
            $table->boolean('is_showcase')->default(false)->after('badge');
            $table->json('axis')->nullable()->after('chronology');
        });

        Schema::table('dossier_documents', function (Blueprint $table): void {
            // Ana səhifədə ödənişsiz göstərilən vərəq. Hekayənin açarını
            // verməyən sənədlər seçilir — tools/check-dossier.js yoxlayır.
            $table->boolean('is_sample')->default(false)->after('is_locked');
        });
    }

    public function down(): void
    {
        Schema::table('dossier_documents', function (Blueprint $table): void {
            $table->dropColumn('is_sample');
        });

        Schema::table('dossiers', function (Blueprint $table): void {
            $table->dropColumn(['place', 'period', 'intro', 'badge', 'is_showcase', 'axis']);
        });
    }
};
