<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Dəvətnamələr AYRI cədvəllərdədir, `documents`-in içində deyil.
 *
 * Səbəb məxfilikdir: `documents` reyestrə, axtarışa və idarə panelindəki
 * ümumi siyahıya bağlıdır. Dəvətnamə isə yalnız linki bilən adama aiddir —
 * ümumi siyahıya düşməməsi üçün ən etibarlı yol həmin siyahının sorğuladığı
 * cədvəldə ümumiyyətlə olmamaqdır.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('invites', function (Blueprint $table): void {
            $table->id();
            // Təxmin edilə bilməyən açar — dəvətnamənin yeganə qorunması budur.
            $table->string('token', 32)->unique();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            $table->string('event', 24);
            $table->string('design', 40);
            $table->string('palette', 20);

            $table->string('host_names', 120);
            $table->string('title', 140)->default('');
            $table->dateTime('event_at')->nullable();
            // Saat ayrıca saxlanılır: «18:00» yazan adam saat qurşağı hesabı istəmir.
            $table->string('event_time', 5)->default('');

            $table->string('venue_name', 120)->default('');
            $table->string('venue_address', 200)->default('');
            $table->string('map_url', 300)->default('');
            $table->string('phone', 40)->default('');
            $table->string('note', 300)->default('');

            $table->boolean('rsvp_enabled')->default(true);
            $table->boolean('og_ready')->default(false);

            $table->string('status', 12)->default('draft')->index();
            $table->unsignedInteger('views')->default(0);
            $table->timestamp('published_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'created_at']);
        });

        Schema::create('invite_guests', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('invite_id')->constrained()->cascadeOnDelete();

            // Toplu siyahıdan gələn qonağın öz linki olur; ümumi linkdən özü
            // cavab verən qonaq eyni cədvələ tokensiz düşür — bir lövhə, bir sorğu.
            $table->string('token', 32)->nullable()->unique();
            $table->string('name', 80);

            $table->string('rsvp', 12)->nullable();
            $table->unsignedTinyInteger('rsvp_count')->nullable();
            $table->string('rsvp_note', 200)->default('');
            $table->timestamp('responded_at')->nullable();
            $table->timestamp('opened_at')->nullable();

            $table->unsignedInteger('sort')->default(0);
            $table->timestamps();

            $table->index(['invite_id', 'sort']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('invite_guests');
        Schema::dropIfExists('invites');
    }
};
