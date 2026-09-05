<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/*
 * Ümumi şəkil hovuzu — işlərdən asılı olmayan, idarəçinin bir dəfə yükləyib
 * istənilən işdə istifadə etdiyi şəkillər.
 *
 * QƏSDƏN AYRI CƏDVƏLDİR, `dossier_images`-də null `dossier_id` deyil:
 * oyunçuya şəkil verən yol («şəkil bu işə aiddir» qapısı, spoiler qoruması)
 * o cədvəlin üstündə qurulub və hovuz ona heç toxunmamalıdır. Hovuzdan işə
 * götürmə KÖÇÜRMƏDİR — işdə adi `dossier_images` sətri yaranır və bütün
 * mövcud qaydalar dəyişmədən işləyir.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dossier_pool_images', function (Blueprint $table): void {
            $table->id();
            $table->string('slug', 60)->unique();
            $table->string('caption', 300)->default('');
            $table->string('image_type', 16)->default('generic');
            $table->string('original_path', 160);
            $table->string('medium_path', 160);
            $table->string('thumb_path', 160);
            $table->unsignedInteger('width')->default(0);
            $table->unsignedInteger('height')->default(0);
            $table->unsignedInteger('filesize')->default(0);
            $table->unsignedInteger('sort')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dossier_pool_images');
    }
};
