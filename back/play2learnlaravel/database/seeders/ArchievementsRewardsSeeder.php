<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ArchievementsRewardsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        DB::table('archievements_rewards')->insert([
            [
                'archievement_id' => 1,
                'type' => 'coins',
                'quantity' => 100,
            ],
            [
                'archievement_id' => 1,
                'type' => 'experience',
                'quantity' => 1000,
            ],
            [
                'archievement_id' => 2,
                'type' => 'coins',
                'quantity' => 50,
            ],
            [
                'archievement_id' => 2,
                'type' => 'experience',
                'quantity' => 500,
            ],
            [
                'archievement_id' => 3,
                'type' => 'coins',
                'quantity' => 150,
            ],
            [
                'archievement_id' => 3,
                'type' => 'experience',
                'quantity' => 1500,
            ],
            [
                'archievement_id' => 3,
                'type' => 'coins',
                'quantity' => 150,
            ],
            [
                'archievement_id' => 3,
                'type' => 'experience',
                'quantity' => 1500,
            ],
            [
                'archievement_id' => 4,
                'type' => 'coins',
                'quantity' => 100,
            ],
            [
                'archievement_id' => 4,
                'type' => 'experience',
                'quantity' => 1000,
            ],
            [
                'archievement_id' => 5,
                'type' => 'coins',
                'quantity' => 100,
            ],
            [
                'archievement_id' => 5,
                'type' => 'experience',
                'quantity' => 1000,
            ],
            [
                'archievement_id' => 6,
                'type' => 'coins',
                'quantity' => 200,
            ],
            [
                'archievement_id' => 6,
                'type' => 'experience',
                'quantity' => 2000,
            ],
        ]);

    }
}
