<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('documents', function (Blueprint $table) {
            // Anket cavablarından qurulan struktur bloklar:
            // data · checks · scale · notes · until · signTitle · signOrg · share
            $table->json('extra')->nullable()->after('labels');

            // Etibarlılıq müddəti olan şablonlar (viza, arayış) üçün.
            // /r/{regNo} səhifəsi möhrü bu üç sütuna görə seçir.
            $table->timestamp('expires_at')->nullable()->after('published_at')->index();
            $table->timestamp('cancelled_at')->nullable()->after('expires_at');
            $table->string('cancel_reason', 60)->nullable()->after('cancelled_at');
        });
    }

    public function down(): void
    {
        Schema::table('documents', function (Blueprint $table) {
            $table->dropIndex(['expires_at']);
            $table->dropColumn(['extra', 'expires_at', 'cancelled_at', 'cancel_reason']);
        });
    }
};
