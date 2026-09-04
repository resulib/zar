<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Kod reyestri — idarəçinin redaktə etdiyi səth.
 *
 * Kod bu günə qədər sənədin öz `lock_code` sütununda idi. Bu, seed üçün
 * kifayət edirdi, amma idarə panelində üç şey çatışmır: kodun ADI (idarəçi
 * onu «Birinci kod — saxta qeyd» kimi tanıyır), kodun HARADAN yığıldığına dair
 * QEYD, və rəqəmlərin həqiqətən həmin vərəqlərdə olub-olmadığını yoxlamaq üçün
 * MƏNBƏ SƏNƏD siyahısı. Bir kod bir neçə sənədi də aça bilməlidir.
 *
 * BUNA BAXMAYARAQ `lock_code` sütunu qalır və AVTORİTETDİR: saxlama zamanı
 * `code` dəyəri ora köçürülür (cavab qatındakı `reply_topic` naxışı).
 * Səbəb — `DossierService::unlock()` `hash_equals($doc->lock_code, …)` işlədir
 * və `check-dossier.js` `$hidden = ['lock_code','content']` sətrini HƏRFİ
 * regekslə yoxlayır. Denormallaşdırma hər ikisini toxunulmadan saxlayır.
 *
 * `unlock_code_id` üçün baza səviyyəsində FK QOYULMUR — yalnız indeksli
 * nullable sütun. SQLite-da mövcud cədvələ FK əlavə etmək cədvəli tamamilə
 * yenidən qurur; silinmə idarəçi kontrollerində `unlock_code_id = null` ilə
 * idarə olunur.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dossier_codes', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('dossier_id')->constrained()->cascadeOnDelete();
            $table->string('code', 12);
            /* Yalnız idarəçi görür — oyunçuya heç vaxt getmir. */
            $table->string('label', 80)->default('');
            $table->string('hint_note', 400)->default('');
            /* Hansı vərəqlərdən yığılır. Yoxlayıcı rəqəmləri həmin vərəqlərin
               mətnində axtarır — kodun tapılası olduğunu sübut edən yeganə şey. */
            $table->json('source_document_ids')->nullable();
            $table->unsignedInteger('sort')->default(0);
            $table->timestamps();

            $table->index(['dossier_id', 'sort']);
        });

        /* Mövcud kilidli vərəqlərdən reyestr qurulur: kod dəyişmir, sadəcə
           idarəçinin görə biləcəyi bir sətir qazanır. */
        $senedler = DB::table('dossier_documents')
            ->where('is_locked', true)
            ->where('lock_code', '<>', '')
            ->orderBy('dossier_id')
            ->orderBy('sort')
            ->get(['id', 'dossier_id', 'name', 'lock_code', 'lock_hint']);

        $sira = [];

        foreach ($senedler as $s) {
            $d = (int) $s->dossier_id;
            $sira[$d] = ($sira[$d] ?? 0) + 1;

            $codeId = DB::table('dossier_codes')->insertGetId([
                'code'                => (string) $s->lock_code,
                'dossier_id'          => $d,
                'label'               => mb_substr((string) $s->name, 0, 80),
                'hint_note'           => (string) $s->lock_hint,
                'source_document_ids' => json_encode([], JSON_UNESCAPED_UNICODE),
                'sort'                => $sira[$d],
                'created_at'          => now(),
                'updated_at'          => now(),
            ]);

            DB::table('dossier_documents')->where('id', $s->id)->update(['unlock_code_id' => $codeId]);
        }
    }

    public function down(): void
    {
        DB::table('dossier_documents')->update(['unlock_code_id' => null]);
        Schema::dropIfExists('dossier_codes');
    }
};
