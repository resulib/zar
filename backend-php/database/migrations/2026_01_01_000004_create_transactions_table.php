<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Kredit hərəkətlərinin tam tarixçəsi — balans buradan izlənilir.
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            // topup · spend · refund · grant (admin əl ilə verir)
            $table->string('type', 12)->index();
            $table->integer('credits');              // müsbət və ya mənfi
            $table->unsignedInteger('balance_after');

            $table->foreignId('payment_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('document_id')->nullable()->constrained()->nullOnDelete();
            $table->string('note', 160)->nullable();
            $table->timestamps();

            $table->index(['user_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
