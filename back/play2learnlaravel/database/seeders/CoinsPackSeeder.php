<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CoinsPackSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        DB::table('coins_packs')->insert([
            [
                'name' => 'Pack Básico',
                'slug' => Str::slug('Pack Básico'),
                'price' => 4.99,
                'quantity' => 1500,
                'description' => 'Empieza tu aventura con 1,500 monedas para desbloquear poderes y aprender jugando. ¡Diviértete mientras mejoras!'
            ],
            [
                'name' => 'Pack Estandar',
                'slug' => Str::slug('Pack Estandar'),
                'price' => 9.98,
                'quantity' => 3500,
                'description' => 'Obtén 3,500 monedas para desbloquear poderes y avanzar más rápido en tu aprendizaje de idiomas. ¡Hazlo más divertido!'
            ],
            [
                'name' => 'Pack Premium',
                'slug' => Str::slug('Pack Premium'),
                'price' => 19.99,
                'quantity' => 10000,
                'description' => 'Obtén 10,000 monedas para desbloquear más poderes y aprender idiomas aún más rápido. ¡Domina el juego!'
            ],
        ]);
    }
}
