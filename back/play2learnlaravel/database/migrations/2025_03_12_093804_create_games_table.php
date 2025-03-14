<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('games', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_level_language');
            $table->foreign('id_level_language')->references('id')->on('level_languages');

            $table->string('uuid');
            $table->integer('password');
            $table->string('name');
            $table->integer('n_rounds');
            $table->integer('max_clues');
            $table->integer('max_time');
            $table->enum('status', ['pending', 'in_progress', 'finished'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('games');
    }
};
