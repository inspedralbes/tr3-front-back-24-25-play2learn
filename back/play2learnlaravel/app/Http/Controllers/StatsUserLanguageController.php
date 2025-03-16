<?php

namespace App\Http\Controllers;

use App\Models\achievementsUser;
use App\Models\GameHistoryUsers;
use App\Models\StatsUserLanguage;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StatsUserLanguageController extends Controller
{
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

            $gameHistoryUser = GameHistoryUsers::where('user_id', $userId)
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
