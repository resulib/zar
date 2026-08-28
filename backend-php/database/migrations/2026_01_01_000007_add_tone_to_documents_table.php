<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('documents', function (Blueprint $table) {
            // zarafat — gülməli sənəd · xatire — səmimi xatirə sənədi
            $table->string('tone', 10)->default('zarafat')->after('palette')->index();
        });
    }

    public function down(): void
    {
        Schema::table('documents', function (Blueprint $table) {
            $table->dropIndex(['tone']);
            $table->dropColumn('tone');
        });
    }
};
