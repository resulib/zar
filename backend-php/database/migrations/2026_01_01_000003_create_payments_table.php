<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->string('order_id', 40)->unique();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            $table->string('provider', 20);
            $table->string('pack_id', 10);
            $table->decimal('amount', 8, 2);
            $table->string('currency', 3)->default('AZN');
            $table->unsignedInteger('credits');

            // pending · paid · failed · refunded
            $table->string('status', 12)->default('pending')->index();
            $table->string('provider_ref', 120)->nullable();
            $table->json('payload')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
