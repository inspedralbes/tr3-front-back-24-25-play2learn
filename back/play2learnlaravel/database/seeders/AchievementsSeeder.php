<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AchievementsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        DB::table('achievements')->insert([
            [
                'id' => 1,
                'name' => 'Primera Victoria',
                'slug' => Str::slug('Primera Victoria'),
                'description' => 'Logro otorgado por ganar tu primera partida.',
            ],
            [
                'id' => 2,
                'name' => 'Puntuación Perfecta',
                'slug' => Str::slug('Puntuación Perfecta'),
                'description' => 'Logro otorgado por ganar tu puntuación perfecta.',
            ],
            [
                'id' => 3,
                'name' => 'Demonio de la velocidad',
                'slug' => Str::slug('Demonio de la velocidad'),
                'description' => 'Logro otorgado por ganar una partida en menos de un minuto.',
            ],
            [
                'id' => 4,
                'name' => 'Políglota',
                'slug' => Str::slug('Políglota'),
                'description' => 'Logro otorgado por ganar una partida en menos de un minuto.',
            ],
            [
                'id' => 5,
                'name' => 'Maestro de la racha',
                'slug' => Str::slug('Maestro de la racha'),
                'description' => 'Logro otorgado por jugar 30 dias seguidos.',
            ],
            [
                'id' => 6,
                'name' => 'Maestro de vocabulario',
                'slug' => Str::slug('Maestro de vocabulario'),
                'description' => 'Logro otorgado por aprender 100 palabras nuevas.',
            ],
        ]);
    }
}
