<?php

namespace App\Http\Controllers;

use App\Models\achievementsUser;
use App\Models\GameHistoryUsers;
use App\Models\StatsUserLanguage;
use Illuminate\Support\Facades\Auth;

class StatsUserLanguageController extends Controller
{
    /**
     * @group StatsUserLanguage
     *
     * Obtiene las estadísticas de los idiomas de un usuario.
     *
     * Este endpoint devuelve las estadísticas de los idiomas aprendidos por el usuario autenticado, junto con la información del idioma.
     *
     * @response 200 {
     *     "status": "success",
     *     "statsLanguages": [
     *         {
     *             "id": 1,
     *             "user_id": 1,
     *             "language_id": 1,
     *             "level": 5,
     *             "language": {
     *                 "id": 1,
     *                 "name": "English"
     *             }
     *         }
     *     ]
     * }
     *
     * @response 500 {
     *     "status": "error",
     *     "message": "Error al obtener las estadísticas de idiomas."
     * }
     */
    public function getStatsLanguages()
    {
        $status = "success";
        try {
            $userId = Auth::user()->id;

            $statsLanguages = StatsUserLanguage::where('user_id', $userId)
                ->with('language')
                ->get();

            return response()->json([
                'status' => $status,
                'statsLanguages' => $statsLanguages,
            ]);
        } catch (\Exception $exception) {
            $status = "error";
            return response()->json([
                'status' => $status,
                'message' => $exception->getMessage(),
            ]);
        }
    }

    //

    /**
     * @group StatsUserLanguage
     *
     * Obtiene las estadísticas de un idioma específico de un usuario.
     *
     * Este endpoint devuelve las estadísticas de un idioma específico del usuario, los logros relacionados con ese idioma y el historial de juegos más recientes del usuario.
     *
     * @urlParam languageId integer required El ID del idioma para obtener las estadísticas del usuario. Ejemplo: 1
     *
     * @response 200 {
     *     "status": "success",
     *     "statsLanguage": {
     *         "id": 1,
     *         "user_id": 1,
     *         "language_id": 1,
     *         "level": 5
     *     },
     *     "achievements": [
     *         {
     *             "achievement_id": 1,
     *             "progress": 80,
     *             "achievement": {
     *                 "name": "Proficient in English"
     *             }
     *         }
     *     ],
     *     "gameHistoryUser": [
     *         {
     *             "id": 1,
     *             "user_id": 1,
     *             "created_at": "2025-03-28T12:00:00",
     *             "rounds": [
     *                 {
     *                     "score": 10,
     *                     "duration": 30
     *                 }
     *             ]
     *         }
     *     ]
     * }
     *
     * @response 404 {
     *     "status": "error",
     *     "message": "Language stats not found"
     * }
     *
     * @response 500 {
     *     "status": "error",
     *     "message": "Error al obtener las estadísticas del idioma."
     * }
     */
    public function getUserStatsLanguage($languageId)
    {
        $status = "success";
        try {
            $userId = Auth::user()->id;

            $statsLanguage = StatsUserLanguage::where('user_id', $userId)
                ->where('language_id', $languageId)
                ->first();

            $achievements = AchievementsUser::select('achievement_id', 'user_id', 'progress')
                ->with('achievement')
                ->where('user_id', $userId)
                ->get();

            $gameHistoryUser = GameHistoryUsers::with('rounds')
                ->where('user_id', $userId)
                ->orderBy('created_at', 'desc')
                ->limit(3)
                ->get();

            return response()->json([
                'status' => $status,
                'statsLanguage' => $statsLanguage,
                'achievements' => $achievements,
                'gameHistoryUser' => $gameHistoryUser,
            ]);
        } catch (\Exception $exception) {
            $status = "error";
            return response()->json([
                'status' => $status,
                'message' => $exception->getMessage(),
            ]);
        }

    }
}
