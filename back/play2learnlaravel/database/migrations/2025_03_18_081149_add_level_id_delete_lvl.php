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
        Schema::table('stats_user_languages', function (Blueprint $table) {
            $table->dropColumn('level');
            $table->unsignedBigInteger('level_id')->after('language_id');
            $table->foreign('level_id')->references('id')->on('level_experiences');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('stats_user_languages', function (Blueprint $table) {
            //
        });
    }
};
