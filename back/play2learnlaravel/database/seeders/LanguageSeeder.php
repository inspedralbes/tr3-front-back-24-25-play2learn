<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;


class LanguageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        DB::table('languages')->insert([
            [
                'id' => 1,
                'name' => 'Castellano',
                'code' => 'es',
                'slug' => Str::slug('Castellano'),
            ],
            [
                'id' => 2,
                'name' => 'Ingles',
                'code' => 'en',
                'slug' => Str::slug('Ingles'),
            ],
            [
                'id' => 3,
                'name' => 'Francés',
                'code' => 'fr',
                'slug' => Str::slug('Francés'),
            ],
            [
                'id' => 4,
                'name' => 'Aleman',
                'code' => 'de',
                'slug' => Str::slug('Aleman'),
            ],
        ]);
    }
}
