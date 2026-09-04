<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Sənəd sabit şablon olmaqdan çıxıb blokların ardıcıllığına keçir.
 *
 * `type` sütunu düşür: doqquz «növ» birinci qovluğun formasına görə
 * yazılmışdı və artıq deqradasiya etmişdi — `ekspert` şablonunun bütün
 * məzmunu bir sətir idi, `@include('protokol')`. İkinci qovluqda qəbz lenti
 * və açar jurnalı `cedvel` şablonuna sığdırıldı, çünki başqa yer yox idi.
 *
 * `content` sütununun ADI DƏYİŞMİR — bloklar onun içindədir. Səbəb iki
 * mövcud yoxlamadır: `check-dossier.js` `$hidden = ['lock_code','content']`
 * sətrini hərfi regeksle yoxlayır, və «kilidin kodu content-in içində
 * təkrarlanmır» yoxlaması da həmin açara baxır. Sütunu adlandırmaq hər
 * ikisini səssizcə söndürərdi.
 *
 * `lock_kind` isə kilidi növ olmaqdan xassəyə çevirir: istənilən sənəd
 * kilidli ola bilər və tapmacanın forması parametrdir.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('dossier_documents', function (Blueprint $table): void {
            $table->string('lock_kind', 8)->default('reqem')->after('is_sample');
        });

        Schema::table('dossier_documents', function (Blueprint $table): void {
            $table->dropColumn('type');
        });
    }

    public function down(): void
    {
        Schema::table('dossier_documents', function (Blueprint $table): void {
            $table->string('type', 16)->default('metn');
        });

        Schema::table('dossier_documents', function (Blueprint $table): void {
            $table->dropColumn('lock_kind');
        });
    }
};
