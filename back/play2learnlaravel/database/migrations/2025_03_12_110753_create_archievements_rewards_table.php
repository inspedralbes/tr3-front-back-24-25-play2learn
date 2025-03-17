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
        Schema::create('archievements_rewards', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('archievement_id');
            $table->foreign('archievement_id')->references('id')->on('archievements');

            $table->string('type');
            $table->integer('quantity');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('archievements_rewards');
    }
};
