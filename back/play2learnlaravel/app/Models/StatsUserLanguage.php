<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StatsUserLanguage extends Model
{
    //
    public function language(){
        return $this->belongsTo(Language::class, 'language_id');
    }

    public function user(){
        return $this->belongsTo(User::class, 'user_id');
    }
}
