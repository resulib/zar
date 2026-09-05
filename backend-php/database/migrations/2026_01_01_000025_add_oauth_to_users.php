<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            /* Google-un `sub` iddiası — DƏYİŞMƏYƏN identifikator. Hesabın
               bağlanması məhz bununla gedir, e-poçtla yox: adam Google-da
               e-poçtunu dəyişsə də `sub` eyni qalır. */
            $table->string('google_id', 40)->nullable()->unique()->after('password');

            /* Hesabın necə açıldığı — «parol» / «google» / boş (qonaq).
               Yalnız məlumat üçün: parolsuz hesaba «parolunuzu yazın»
               deməmək və panelde düzgün sətir göstərmək lazımdır. */
            $table->string('auth_provider', 16)->nullable()->after('google_id');

            /* Avtomatik qonaq qeydiyyatının verdiyi ad («Qonaq-4821»).
               Ayrıca sahə deyil, sadəcə `name` doldurulur — burada yalnız
               həmin adın avtomatik olduğu qeyd olunur ki, qeydiyyatda
               istifadəçinin yazdığı ad onu sual vermədən əvəz etsin. */
            $table->boolean('auto_name')->default(false)->after('auth_provider');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->dropColumn(['google_id', 'auth_provider', 'auto_name']);
        });
    }
};
