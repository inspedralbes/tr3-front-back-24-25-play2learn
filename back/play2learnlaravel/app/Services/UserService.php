<?php

namespace App\Services;

use App\Models\Archievements;
use App\Models\ArchievementsUser;
use App\Models\StatsUserLanguage;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class UserService
{
    // Agrega la lógica de tu servicio aquí
    /***
     * This function create new user with the default archivments and global stats...
     * Steps: - Create User
     *        - Create Archievements Users
     * @param $user
     * @return User
     */
    public function createUser($user)
    {
        $newUser = new User();
        $newUser->name = $user['name'];
        $newUser->email = $user['email'];
        $newUser->profile_pic = $user['profile_pic'] ?? null;
        $newUser->username = $user['username'];
        $newUser->password = $user['password'];
        $newUser->save();

        //init the active archievements for new user
        $archievements = Archievements::select('id')
            ->where('status', 'active')->get();

        foreach ($archievements as $archievement) {
            $defaultArchievement = new ArchievementsUser();
            $defaultArchievement->user_id = $newUser->id;
            $defaultArchievement->archievement_id = $archievement->id;
            $defaultArchievement->progress = 0.00;
            $defaultArchievement->save();
        }

        //init the default stats for new user
        $statsUserLanguages = new StatsUserLanguage();
        $statsUserLanguages->user_id = $newUser->id;
        $statsUserLanguages->language_id = 1;
        $statsUserLanguages->level = 0;
        $statsUserLanguages->experience = 0;
        $statsUserLanguages->total_games = 0;
        $statsUserLanguages->total_wins = 0;
        $statsUserLanguages->total_experience = 0;
        $statsUserLanguages->daily_streak = 0;
        $statsUserLanguages->save();

        return $newUser;
    }

    public function updateUser($userUpdated)
    {
        $user = User::findOrFail(Auth::user()->id);

        if($userUpdated['name']){
            $user->name = $userUpdated['name'];
        }

        if($userUpdated['email']){
            $user->email = $userUpdated['email'];
        }

        if($userUpdated['username']){
            $user->username = $userUpdated['username'];
        }

        if($userUpdated['password']){
            $user->password = $userUpdated['password'];
        }

        if($userUpdated['profile_pic']){
            $user->profile_pic = $userUpdated['profile_pic'];
        }

        $user->save();

        return $user;
    }

    public function updateStatsUser($statsUserUpdated, $languageId)
    {
        $statsUser = StatsUserLanguage::where('user_id', Auth::user()->id)
            ->where('language_id', $languageId)
            ->first();
//      level	experience	total_games	total_wins	total_experience	daily_streak	created_at	updated_at
        $statsUser->level = $statsUserUpdated['level'];
        $statsUser->experience = $statsUserUpdated['experience'];
        $statsUser->total_games = $statsUserUpdated['total_games'];
        $statsUser->total_wins = $statsUserUpdated['total_wins'];
        $statsUser->total_experience = $statsUserUpdated['total_experience'];
        $statsUser->updated_at = now();
        $statsUser->save();
    }

}
