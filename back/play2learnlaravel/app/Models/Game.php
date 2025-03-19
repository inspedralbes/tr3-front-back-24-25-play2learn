<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    //
    public function participants()
    {
        return $this->hasMany(GameUser::class, 'game_id', 'id');
    }

    public function language_level()
    {
        return $this->belongsTo(LevelLanguage::class, 'id_level_language', 'id');
    }
}
