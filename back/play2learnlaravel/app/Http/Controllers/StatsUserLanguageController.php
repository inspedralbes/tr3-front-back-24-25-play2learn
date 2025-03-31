<?php

namespace App\Http\Controllers;

use App\Models\AchievementsUser;
use App\Models\Game;
use App\Models\GameHistoryUsers;
use App\Models\GameUser;
use App\Models\Language;
use App\Models\StatsUserLanguage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

use Illuminate\Http\Request;

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

            $statsLanguages = StatsUserLanguage::with('level', 'language')
                ->where('user_id', $userId)
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
    public function getUserStatsLanguage($language)
    {
        $status = "success";
        try {
            $userId = Auth::user()->id;

            $languageId = Language::where('name', $language)->first()->id;

            $statsLanguage = StatsUserLanguage::with('language', 'level')
                ->where('user_id', $userId)
                ->where('language_id', $languageId)
                ->first();

            $achievements = AchievementsUser::select('achievement_id', 'user_id', 'progress')
                ->with('achievement')
                ->where('user_id', $userId)
                ->get();

            $gamesIds = GameUser::where('user_id', $userId)->pluck('game_id');

            $games = Game::with('participants', 'participants.user', 'language_level', 'language_level.language')
                ->whereIn('id', $gamesIds)
                ->where('status', 'finished')
                ->whereHas('language_level.language', function ($query) use ($language) {
                    $query->where('name', $language);
                })
                ->get();

            $gameHistoryUser = GameHistoryUsers::with('rounds', 'game')
                ->whereIn('game_id', $games->pluck('id'))
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

    public function store(Request $request)
    {
        $rules = [
            'id_language' => 'required',
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            Log::error('Errores de validación:', $validator->errors()->toArray());

            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $status = "success";
        try {
            $userId = Auth::user()->id;
            $idLanguage = $request->input('id_language');
            $statsLanguage = StatsUserLanguage::where('user_id', $userId)
                ->where('language_id', $idLanguage)
                ->first();

            if (!$statsLanguage) {
                $statsUserLanguages = new StatsUserLanguage();
                $statsUserLanguages->user_id = $userId;
                $statsUserLanguages->language_id = $idLanguage;
                $statsUserLanguages->level_id = 1;
                $statsUserLanguages->experience = 0;
                $statsUserLanguages->total_games = 0;
                $statsUserLanguages->total_wins = 0;
                $statsUserLanguages->total_experience = 0;
                $statsUserLanguages->daily_streak = 0;
                $statsUserLanguages->save();
            }

            return response()->json([
                'status' => $status,
                'languageId' => $idLanguage,
                'message' => 'New language stored successfully',
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
