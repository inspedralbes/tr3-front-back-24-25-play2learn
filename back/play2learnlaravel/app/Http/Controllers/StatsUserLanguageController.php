<?php

namespace App\Http\Controllers;

use App\Models\achievementsUser;
use App\Models\GameHistoryUsers;
use App\Models\StatsUserLanguage;
use Illuminate\Support\Facades\Auth;

class StatsUserLanguageController extends Controller
{
    public function getStatsLanguages(){
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
        }catch (\Exception $exception){
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
        }catch (\Exception $exception){
            $status = "error";
            return response()->json([
                'status' => $status,
                'message' => $exception->getMessage(),
            ]);
        }

    }
}
