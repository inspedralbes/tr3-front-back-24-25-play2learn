<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LevelExperienceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $levels = $this->generateLevels(50, 250, 1.3); // 50 niveles, experiencia base 100, factor de crecimiento 1.1

        DB::table('level_experiences')->insert($levels);
    }

    /**
     * Genera los niveles con experiencia requerida de forma exponencial.
     *
     * @param int $maxLevels Número máximo de niveles.
     * @param int $baseExperience Experiencia base para el nivel 0.
     * @param float $growthFactor Factor de crecimiento exponencial.
     * @return array
     */
    private function generateLevels(int $maxLevels, int $baseExperience, float $growthFactor): array
    {
        $levels = [];

        for ($id = 1; $id <= $maxLevels; $id++) {
            $level = $id - 1; // El nivel comienza desde 0
            $experience = $this->roundToNearestTen(
                (int) round($baseExperience * pow($growthFactor, $level)) // Fórmula exponencial
            );
            $levels[] = [
                'id' => $id,
                'level' => $level,
                'experience' => $experience,
            ];
        }

        return $levels;
    }

    /**
     * Redondea un número al múltiplo más cercano de 10.
     *
     * @param int $number Número a redondear.
     * @return int
     */
    private function roundToNearestTen(int $number): int
    {
        return round($number / 10) * 10;
    }
}