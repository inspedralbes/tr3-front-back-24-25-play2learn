<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\GameUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class GameController extends Controller
{
    //
    public function getList()
    {
        try{
            $games = Game::with('participants', 'participants.user')
                ->where('status', 'pending')
                ->get();

            return response()->json([
                'status' => 'success',
                'message' => 'Games list',
                'games' => $games
            ]);
        }catch (\Exception $e){
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        }

    }

    public function store(Request $request)
    {
        $rules = [
            'id_level_language' => 'required',
            'password' => 'required',
            'name' => 'required',
            'n_rounds' => 'required',
            'max_clues' => 'required',
            'max_time' => 'required',
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            Log::error('Errores de validación:', $validator->errors()->toArray());

            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        try{
            //create game with game setting
            $game = new Game();
            $game->id_level_language = $request->input('id_level_language');
            $game->uuid = uuid_create(5);
            $game->password = $request->input('password');
            $game->name = $request->input('name');
            $game->n_rounds = $request->input('n_rounds');
            $game->max_clues = $request->input('max_clues');
            $game->max_time = $request->input('max_time');
            $game->save();

            //create user host for the game
            $gameUser = new GameUser();
            $gameUser->user_id = Auth::user()->id;
            $gameUser->game_id = $game->id;
            $gameUser->clues_usage = 0;
            $gameUser->rol = "host";
            $gameUser->created_at = now();
            $gameUser->updated_at = now();
            $gameUser->save();

            $gameList = Game::with('participants', 'participants.user')
                ->where('status', 'pending')
                ->get();

            return response()->json([
                'status' => 'success',
                'message' => 'Game created',
                'gameCreated' => $game,
                'games' => $gameList
            ]);
        }catch (\Exception $e){
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        }
    }
}
