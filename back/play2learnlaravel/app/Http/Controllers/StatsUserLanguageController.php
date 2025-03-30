<?php

namespace App\Http\Controllers;

use App\Models\achievementsUser;
use App\Models\GameHistoryUsers;
use App\Models\StatsUserLanguage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

use Illuminate\Http\Request;

class StatsUserLanguageController extends Controller
{
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

            $gameHistoryUser = GameHistoryUsers::with('rounds', 'game')
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
