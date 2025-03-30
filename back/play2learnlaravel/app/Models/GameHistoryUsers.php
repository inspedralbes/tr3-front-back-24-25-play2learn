<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GameHistoryUsers extends Model
{
    //
    public function rounds()
    {
        return $this->hasMany(GameHistoryRounds::class, 'game_history_id', 'id');
    }

    public function game()
    {
        return $this->belongsTo(Game::class, 'game_id', 'id');
    }
}
