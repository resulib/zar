<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->string('reg_no', 20)->unique();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            $table->string('template_id', 40)->nullable();
            $table->string('title', 120);
            $table->string('to_name', 60);
            $table->string('from_name', 60);
            $table->text('powers')->nullable();
            $table->text('penalty')->nullable();
            $table->text('preamble')->nullable();

            $table->string('date_label', 12);
            $table->string('layout', 20)->default('notarial');
            $table->string('palette', 20)->default('gold');
            $table->json('labels')->nullable();

            // draft — ödənilməyib · published — reyestrdə · removed — silinib
            $table->string('status', 12)->default('draft')->index();
            $table->unsignedInteger('views')->default(0);
            $table->timestamp('published_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
