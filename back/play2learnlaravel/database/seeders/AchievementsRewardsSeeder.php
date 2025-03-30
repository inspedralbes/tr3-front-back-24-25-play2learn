<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AchievementsRewardsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        DB::table('achievements_rewards')->insert([
            [
                'achievement_id' => 1,
                'type' => 'coins',
                'quantity' => 100,
            ],
            [
                'achievement_id' => 1,
                'type' => 'experience',
                'quantity' => 1000,
            ],
            [
                'achievement_id' => 2,
                'type' => 'coins',
                'quantity' => 50,
            ],
            [
                'achievement_id' => 2,
                'type' => 'experience',
                'quantity' => 500,
            ],
            [
                'achievement_id' => 3,
                'type' => 'coins',
                'quantity' => 150,
            ],
            [
                'achievement_id' => 3,
                'type' => 'experience',
                'quantity' => 1500,
            ],
            [
                'achievement_id' => 3,
                'type' => 'coins',
                'quantity' => 150,
            ],
            [
                'achievement_id' => 3,
                'type' => 'experience',
                'quantity' => 1500,
            ],
            [
                'achievement_id' => 4,
                'type' => 'coins',
                'quantity' => 100,
            ],
            [
                'achievement_id' => 4,
                'type' => 'experience',
                'quantity' => 1000,
            ],
            [
                'achievement_id' => 5,
                'type' => 'coins',
                'quantity' => 100,
            ],
            [
                'achievement_id' => 5,
                'type' => 'experience',
                'quantity' => 1000,
            ],
            [
                'achievement_id' => 6,
                'type' => 'coins',
                'quantity' => 200,
            ],
            [
                'achievement_id' => 6,
                'type' => 'experience',
                'quantity' => 2000,
            ],
        ]);

    }
}
