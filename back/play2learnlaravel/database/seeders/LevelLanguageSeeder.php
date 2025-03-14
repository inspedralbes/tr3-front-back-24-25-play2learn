<?php

namespace Database\Seeders;

use App\Models\Language;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class LevelLanguageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //levels for europe: A1, A2, B1, B2, C1, C2
        $levelsEurope = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
        $languagesId = Language::all(['id']);
        foreach ($languagesId as $languageId) {
            foreach ($levelsEurope as $level) {
                DB::table('level_languages')->insert([
                    'language_id' => $languageId->id,
                    'level' => $level,
                ]);
            }
        }

    }
}
