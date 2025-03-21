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
            $games = Game::with('participants', 'participants.user', 'language_level', 'language_level.language')
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
        Log::info($request);
        $rules = [
            'id_level_language' => 'required',
            'password' => 'required',
            'name' => 'required',
            'n_rounds' => 'required',
            'max_clues' => 'required',
            'max_time' => 'required',
            'max_players' => 'required',
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
            $game->uuid = uuid_create();
            $game->password = $request->input('password');
            $game->name = $request->input('name');
            $game->n_rounds = $request->input('n_rounds');
            $game->max_clues = $request->input('max_clues');
            $game->max_time = $request->input('max_time');
            $game->max_players = $request->input('max_players');
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

            $gameList = Game::with('participants', 'participants.user', 'language_level', 'language_level.language')
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

    public function getGame($gameUUID)
    {
        try{
            $games = Game::with('participants', 'participants.user', 'language_level', 'language_level.language')
                ->where('status', 'pending')
                ->where('uuid', $gameUUID)
                ->first();


            return response()->json([
                'status' => 'success',
                'game' => $games
            ]);
        }catch (\Exception $e){
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        }
    }

    public function join($gameUUID)
    {
        try{
            $game = Game::where('uuid', $gameUUID)->first();

            $gameUser = new GameUser();
            $gameUser->user_id = Auth::user()->id;
            $gameUser->game_id = $game->id;
            $gameUser->clues_usage = 0;
            $gameUser->rol = "participant";
            $gameUser->created_at = now();
            $gameUser->updated_at = now();
            $gameUser->save();

            $game->load('participants', 'participants.user', 'language_level', 'language_level.language');

            $gameList = Game::with('participants', 'participants.user', 'language_level', 'language_level.language')
                ->where('status', 'pending')
                ->get();
            return response()->json([
                'status' => 'success',
                'games' => $gameList,
                'game' => $game
            ]);

        }catch (\Exception $e){
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        }
    }

    public function leaveGame($gameUUID)
    {
        try{
            $game = Game::where('uuid', $gameUUID)->first();

            $gameUser = GameUser::where('user_id', Auth::user()->id)
                ->where('game_id', $game->id)
                ->first();

            if($gameUser->rol === "host"){
                $gameUsers = GameUser::where('game_id', $game->id)
                    ->get();

                foreach($gameUsers as $gameUser){
                    $gameUser->delete();
                }

                $game->delete();

                $gameList = Game::with('participants', 'participants.user', 'language_level', 'language_level.language')
                    ->where('status', 'pending')
                    ->get();

                return response()->json([
                    'status' => 'success',
                    'games' => $gameList,
                ]);
            }

            $gameUser->delete();

            $game->load('participants', 'participants.user', 'language_level', 'language_level.language');

            $gameList = Game::with('participants', 'participants.user', 'language_level', 'language_level.language')
                ->where('status', 'pending')
                ->get();

            return response()->json([
                'status' => 'success',
                'games' => $gameList,
                'game' => $game
            ]);
        }catch (\Exception $e){
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        }
    }
}
