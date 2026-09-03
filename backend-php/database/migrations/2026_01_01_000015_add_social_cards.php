<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Sosial kimlik kartı qatı — TikTok · Instagram.
     *
     * Kartlar ayrıca cədvəldə YOX, adi `templates` sətirləridir: cavab
     * şablonları ilə eyni model. Onları ana kataloqdan ayıran yeganə şey
     * `templates.social_kind` və `categories.is_social` sütunlarıdır;
     * `CatalogService::payload()` yükü buna görə bölür.
     *
     * `documents.avatar_ready` — kartın profil şəkli var. Şəklin ÖZÜ bazada
     * saxlanılmır: dəvətnamənin OG şəkli kimi public kökdən kənarda fayl
     * olur, çünki base64 blob JSON sütununu şişirdər və hər API cavabına
     * düşərdi.
     *
     * Bütün sütunlar defaultludur: mövcud sətirlər dəyişmir.
     */
    public function up(): void
    {
        /* Hər sütun ayrıca yoxlanılır (`..._000008` ilə eyni idempotent üslub):
           yarımçıq geri qayıtma və ya təkrar çağırış halında miqrasiya sınmır. */
        Schema::table('templates', function (Blueprint $table) {
            /* Doludursa bu şablon sosial kartdır və ana kataloqdan kənardadır.
               Boş, lakin kateqoriyası `is_social` olan şablon hər iki
               platformaya uyğun gəlir. */
            if (! Schema::hasColumn('templates', 'social_kind')) {
                $table->string('social_kind', 12)->nullable()->index()->after('reply_cats');
            }

            /* Kartın stili — doc.js `KART_STILLER` ('resmi' | 'tund' | 'sade').
               Dizayn siyahısı deyil: kart `LAYOUTS` reyestrindən kənardadır,
               ona görə `layouts` ağ siyahısına qarışmır. */
            if (! Schema::hasColumn('templates', 'card_style')) {
                $table->string('card_style', 12)->nullable()->after('social_kind');
            }
        });

        Schema::table('categories', function (Blueprint $table) {
            if (! Schema::hasColumn('categories', 'is_social')) {
                $table->boolean('is_social')->default(false)->index()->after('is_reply');
            }
        });

        Schema::table('documents', function (Blueprint $table) {
            if (! Schema::hasColumn('documents', 'avatar_ready')) {
                $table->boolean('avatar_ready')->default(false)->after('extra');
            }
        });
    }

    public function down(): void
    {
        /* İndeks sütundan ƏVVƏL silinir: SQLite sütunu atarkən ona işarə edən
           indeksi özü təmizləmir və `no such column` xətası verir. */
        if (Schema::hasColumn('templates', 'social_kind')) {
            Schema::table('templates', function (Blueprint $table) {
                $table->dropIndex(['social_kind']);
                $table->dropColumn(['social_kind', 'card_style']);
            });
        }

        if (Schema::hasColumn('categories', 'is_social')) {
            Schema::table('categories', function (Blueprint $table) {
                $table->dropIndex(['is_social']);
                $table->dropColumn('is_social');
            });
        }

        if (Schema::hasColumn('documents', 'avatar_ready')) {
            Schema::table('documents', function (Blueprint $table) {
                $table->dropColumn('avatar_ready');
            });
        }
    }
};
