<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Log;

class UserService
{
    // Agrega la lógica de tu servicio aquí
    public function createUser($user)
    {
        $newUser = new User();
        $newUser->name = $user['name'];
        $newUser->email = $user['email'];
        $newUser->username = $user['username'];
        $newUser->password = $user['password'];
        $newUser->save();
//        Log::info($user['name']);
    }
}
