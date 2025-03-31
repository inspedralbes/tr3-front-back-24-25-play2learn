<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AchievementsUser extends Model
{
    //
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function achievement()
    {
        return $this->belongsTo(Achievements::class, 'achievement_id');
    }
}
