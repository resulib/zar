<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * MÜSTƏNTİQ PROFİLİ — iş qovluğu bölməsinin davam edən kimliyi.
 *
 * `users` cədvəlinə TOXUNULMUR: profil ayrıca sətirdir və `user_id` üzərindən
 * bağlanır. Səbəb sadədir — `users` üç məhsulun ortaq cədvəlidir, bu isə
 * yalnız `/is` bölməsinə aiddir; ora sütun əlavə etmək bölmələr arasındakı
 * ayrılığı bazaya sızdırmaq olardı.
 *
 * SQLite qeydləri:
 *  · enum yoxdur — ağ siyahılar `string(N)` + config-dədir;
 *  · MÖVCUD cədvələ FK əlavə etmək cədvəli yenidən qurur, ona görə `rank_id`,
 *    `case_id` və `admin_id` sadə `unsignedBigInteger` + indeksdir və bütövlük
 *    kod tərəfdə saxlanılır (`dossier_documents.unlock_code_id` ilə eyni qərar).
 */
return new class extends Migration
{
    public function up(): void
    {
        /* RÜTBƏLƏR — seed ilə dolur, idarəçi redaktə etmir.
           `xp_required` DƏYİŞƏ BİLƏR: düstur dəyişəndə idarə panelindəki
           «rütbələri yenidən hesabla» düyməsi bütün profilləri sıfırdan qurur,
           ona görə hədd konfiqurasiya deyil, məlumatdır. */
        Schema::create('ranks', function (Blueprint $table): void {
            $table->id();
            $table->unsignedInteger('level')->unique();       // 1…9
            $table->string('title_az', 60);
            $table->string('title_short', 24);
            $table->unsignedInteger('xp_required')->default(0)->index();

            // Nişanın forması. Ağ siyahı: App\Models\Rank::NISANLAR
            $table->string('insignia_type', 16)->default('sirit-bos');

            /* CSS DƏYİŞƏNİ DEYİL, token ADI. Kartın SVG-si <img> ilə kətana
               çəkilir və orada `var(--buff)` həll olunmur — hərfi hex
               `config('dossier.reyting.rank_colors')`-dan gəlir. */
            $table->string('color_token', 16)->default('ink3');
            $table->timestamps();
        });

        Schema::create('investigator_profiles', function (Blueprint $table): void {
            $table->id();

            // YENİ cədvəldir, ona görə constrained() sərbəstdir.
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();

            /* Nişan nömrəsi ŞÖBƏ SEÇİLƏNDƏ verilir, profil yaranan an yox —
               ona görə nullable. Verildikdən sonra DONUR: icazə verilən bir
               şöbə dəyişikliyi onu dəyişmir, çünki paylaşılmış köhnə kartın
               nömrəsi uyğun gəlməlidir. */
            $table->string('badge_number', 12)->nullable()->unique();

            $table->string('display_name', 40)->default('');

            // Şöbənin İKİ HƏRFLİ kodu (CA·TE·KR·KC·XT) — ASCII, çünki nişan
            // nömrəsinə və Code-39 barkoduna girir.
            $table->string('department', 4)->nullable()->index();
            $table->boolean('department_locked')->default(false);

            // Fayl yolları $hidden-dədir; public kökdən kənardadır.
            $table->string('avatar_original_path', 160)->nullable();
            $table->string('avatar_path', 160)->nullable();

            // none · pending · approved · rejected (App\Models\InvestigatorProfile)
            $table->string('avatar_status', 12)->default('none')->index();
            $table->string('avatar_reason', 160)->default('');

            $table->unsignedBigInteger('rank_id')->nullable()->index();

            /* DENORMALLAŞDIRILMIŞ KEŞ. Həqiqət mənbəyi
               Σ case_completions.xp_awarded + Σ xp_adjustments.delta cəmidir;
               bu sütun yalnız sıralama və göstərmə üçündür və hər dəyişiklikdə
               `CreditService::apply()` naxışı ilə (tranzaksiya + sətir kilidi)
               yenidən yazılır. */
            $table->unsignedInteger('xp')->default(0)->index();

            $table->unsignedInteger('cases_solved')->default(0);
            $table->unsignedInteger('cases_attempted')->default(0);
            $table->unsignedInteger('true_endings')->default(0);
            $table->unsignedInteger('first_try_solves')->default(0);
            $table->unsignedInteger('total_wrong_accusations')->default(0);

            $table->timestamp('joined_at')->nullable();
            $table->timestamp('last_active_at')->nullable();
            $table->boolean('is_public')->default(true)->index();

            /* YALNIZ ƏSAS SIRALAMA (ümumi XP · bütün dövr). Qalan 11 sıralamada
               oxucunun öz mövqeyi tələb üzrə bir COUNT ilə hesablanır — 12
               mövqeyi sütunda saxlamaq 12 sinxron dəyər demək olardı. */
            $table->unsignedInteger('cached_rank_position')->nullable();

            $table->timestamps();

            $table->index(['is_public', 'xp']);
        });

        /* BAĞLANMIŞ İŞİN DƏYİŞMƏZ QEYDİ.
           `dossier_progress` oyunun CANLI vəziyyətidir və dəyişir («yenidən
           oyna» seçimi sıfırlayır); bu isə arxivdir və bir dəfə yazılır. */
        Schema::create('case_completions', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('profile_id')->constrained('investigator_profiles')->cascadeOnDelete();

            /* dossiers-ə FK YOX: bu bir arxiv sətridir. İş nə vaxtsa silinsə,
               qazanılmış XP oyunçunun üzərində qalmalıdır. */
            $table->unsignedBigInteger('case_id')->index();

            $table->boolean('is_solved')->default(false);
            $table->unsignedBigInteger('chosen_suspect_id')->nullable();
            $table->boolean('is_true_ending')->default(false);
            $table->unsignedInteger('wrong_attempts')->default(0);
            $table->boolean('all_codes_unlocked')->default(false);

            /* ÇƏTİNLİYİN ANLIQ SURƏTİ. «Yenidən hesabla» düyməsi `xp_awarded`-ı
               DÜSTURDAN yenidən qurur; surət olmasa, idarəçi işin çətinliyini
               sonradan dəyişəndə keçmiş nəticələr səssizcə yenidən yazılardı. */
            $table->string('difficulty', 12)->default('orta');

            $table->unsignedInteger('xp_awarded')->default(0);
            $table->unsignedInteger('duration_seconds')->nullable();
            $table->timestamp('completed_at')->nullable()->index();
            $table->timestamps();

            // Bir iş bir profilə bir dəfə sayılır — təkrar oynamaq xal vermir.
            $table->unique(['profile_id', 'case_id']);

            // İşin öz səhifəsindəki «ən sürətli on nəfər» siyahısı üçün.
            $table->index(['case_id', 'duration_seconds']);
        });

        /* RÜTBƏ TARİXÇƏSİ — «əmr» ekranının mənbəyi.
           `seen_at` ona görə var ki, əmr BİR DƏFƏ göstərilsin: bayraq
           brauzerdə saxlanılsaydı, cookie silinən kimi geri qayıdardı. */
        Schema::create('rank_history', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('profile_id')->constrained('investigator_profiles')->cascadeOnDelete();
            $table->unsignedBigInteger('old_rank_id')->nullable();
            $table->unsignedBigInteger('new_rank_id');
            $table->timestamp('awarded_at');
            $table->timestamp('seen_at')->nullable();
            $table->timestamps();

            $table->index(['profile_id', 'awarded_at']);
        });

        /* İDARƏÇİNİN ƏL İLƏ VERDİYİ / ÇIXDIĞI XAL.
           `transactions` cədvəli ilə eyni məntiq: balans sütunu dəyişir, amma
           SƏBƏB burada qalır. `delta` İŞARƏLİDİR — ledger nə edildiyini
           dürüst saxlamalıdır; profil sütunu isə sıfırda döşənir. */
        Schema::create('xp_adjustments', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('profile_id')->constrained('investigator_profiles')->cascadeOnDelete();
            $table->integer('delta');
            $table->string('reason', 200);
            $table->unsignedBigInteger('admin_id')->nullable();
            $table->unsignedInteger('balance_after')->default(0);
            $table->timestamps();

            $table->index('profile_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('xp_adjustments');
        Schema::dropIfExists('rank_history');
        Schema::dropIfExists('case_completions');
        Schema::dropIfExists('investigator_profiles');
        Schema::dropIfExists('ranks');
    }
};
