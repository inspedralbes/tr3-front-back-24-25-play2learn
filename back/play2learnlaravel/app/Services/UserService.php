<?php

namespace App\Services;

use App\Models\ArchievementsUser;
use App\Models\User;
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
        $newUser->username = $user['username'];
        $newUser->password = $user['password'];
        $newUser->save();

        $defaultArchievements = new ArchievementsUser();
        $defaultArchievements->user_id = $user['id'];
        $defaultArchievements->archievement_id = 1;
        $defaultArchievements->progress = 0;
        $defaultArchievements->save();
        return $newUser;
    }
}
