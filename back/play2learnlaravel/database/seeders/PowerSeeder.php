<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PowerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        DB::table('powers')->insert([
            [
                'name' => 'Pista',
                'slug' => Str::slug('Pista'),
                'description' => 'Logro otorgado por ganar tu primera partida.',
                'price' => 750
            ],
        ]);
    }
}
