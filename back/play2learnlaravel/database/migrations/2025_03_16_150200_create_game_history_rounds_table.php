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
        Schema::create('game_history_rounds', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('game_history_id');
            $table->foreign('game_history_id')->references('id')->on('game_history_users');
            $table->integer('position');
            $table->string('name');
            $table->integer('score');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('game_history_rounds');
    }
};
