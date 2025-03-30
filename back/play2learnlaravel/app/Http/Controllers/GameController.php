<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\GameUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class GameController extends Controller
{
    //
    /**
     * @group Game
     *
     * Obtiene la lista de juegos que están en estado "pending" (pendiente).
     *
     * Este endpoint devuelve todos los juegos que están en espera de ser iniciados.
     *
     * @response 200 {
     *     "status": "success",
     *     "message": "Games list",
     *     "games": [
     *         {
     *             "id": 1,
     *             "name": "Game 1",
     *             "status": "pending",
     *             "participants": [
     *                 {
     *                     "user": {
     *                         "name": "Player 1",
     *                         "email": "player1@example.com"
     *                     }
     *                 }
     *             ],
     *             "language_level": {
     *                 "language": {
     *                     "name": "English"
     *                 }
     *             }
     *         }
     *     ]
     * }
     *
     * @response 500 {
     *     "status": "error",
     *     "message": "Error al obtener la lista de juegos."
     * }
     */
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

    /**
     * @group Game
     *
     * Crea un nuevo juego.
     *
     * Este endpoint permite crear un nuevo juego, especificando la configuración de este, como el nivel de lenguaje, las rondas, el máximo de pistas, etc.
     *
     * @bodyParam id_level_language integer required El ID del nivel de lenguaje para el juego. Ejemplo: 1
     * @bodyParam password string required La contraseña del juego. Ejemplo: "secreta123"
     * @bodyParam name string required El nombre del juego. Ejemplo: "Trivia Game"
     * @bodyParam n_rounds integer required El número de rondas del juego. Ejemplo: 5
     * @bodyParam max_clues integer required El máximo de pistas por ronda. Ejemplo: 3
     * @bodyParam max_time integer required El tiempo máximo en segundos por ronda. Ejemplo: 60
     * @bodyParam max_players integer required El número máximo de jugadores en el juego. Ejemplo: 4
     *
     * @response 200 {
     *     "status": "success",
     *     "message": "Game created",
     *     "gameCreated": {
     *         "id": 1,
     *         "name": "Trivia Game",
     *         "status": "pending"
     *     },
     *     "games": [...]
     * }
     *
     * @response 422 {
     *     "status": "error",
     *     "errors": {
     *         "name": ["The name field is required."]
     *     }
     * }
     *
     * @response 500 {
     *     "status": "error",
     *     "message": "Error al crear el juego."
     * }
     */
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

    /**
     * @group Game
     *
     * Obtiene los detalles de un juego específico por su UUID.
     *
     * Este endpoint devuelve los detalles del juego, incluyendo los participantes y el nivel de lenguaje, si el juego está en estado "pending" o "in_progress".
     *
     * @urlParam gameUUID string required El UUID del juego. Ejemplo: "123e4567-e89b-12d3-a456-426614174000"
     *
     * @response 200 {
     *     "status": "success",
     *     "game": {
     *         "id": 1,
     *         "name": "Trivia Game",
     *         "status": "pending",
     *         "participants": [...],
     *         "language_level": {
     *             "language": {
     *                 "name": "English"
     *             }
     *         }
     *     }
     * }
     *
     * @response 404 {
     *     "status": "error",
     *     "message": "Game not found"
     * }
     */
    public function getGame($gameUUID)
    {
        try{
            $games = Game::with('participants', 'participants.user', 'language_level', 'language_level.language')
                ->whereIn('status', ['pending', 'in_progress'])
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

    /**
     * @group Game
     *
     * Permite a un usuario unirse a un juego en estado "pending".
     *
     * Este endpoint agrega un usuario al juego como participante.
     *
     * @urlParam gameUUID string required El UUID del juego al que se unirá el usuario. Ejemplo: "123e4567-e89b-12d3-a456-426614174000"
     *
     * @response 200 {
     *     "status": "success",
     *     "games": [...],
     *     "game": {
     *         "id": 1,
     *         "name": "Trivia Game",
     *         "status": "pending"
     *     }
     * }
     *
     * @response 404 {
     *     "status": "error",
     *     "message": "Game not found"
     * }
     */
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

    /**
     * @group Game
     *
     * Permite a un usuario abandonar un juego.
     *
     * Este endpoint permite a un usuario dejar un juego. Si el usuario es el host, se eliminarán todos los participantes y el juego.
     *
     * @urlParam gameUUID string required El UUID del juego. Ejemplo: "123e4567-e89b-12d3-a456-426614174000"
     *
     * @response 200 {
     *     "status": "success",
     *     "games": [...]
     * }
     *
     * @response 404 {
     *     "status": "error",
     *     "message": "Game not found"
     * }
     */
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

    /**
     * @group Game
     *
     * Inicia un juego que está en estado "pending".
     *
     * Este endpoint cambia el estado del juego a "in_progress" y comienza la partida.
     *
     * @bodyParam roomUUID string required El UUID del juego que se va a iniciar. Ejemplo: "123e4567-e89b-12d3-a456-426614174000"
     *
     * @response 200 {
     *     "status": "success",
     *     "message": "Game started",
     *     "data": {
     *         "id": 1,
     *         "name": "Trivia Game",
     *         "status": "in_progress"
     *     }
     * }
     *
     * @response 404 {
     *     "status": "error",
     *     "message": "Game not found"
     * }
     */
    public function startRoom(Request $request)
    {
        // dd($request->all());
        try{
            DB::beginTransaction();
            $game = Game::with('participants')
                ->where('uuid', $request->input('roomUUID'))
                ->first();

            if (!$game) {
                DB::rollBack();
                return response()->json([
                    'status' => 'error',
                    'message' => 'Game not found'
                ]);
            }
            $game->status = 'in_progress';
            $game->save();

            DB::commit();

            $game->load('participants', 'participants.user', 'language_level', 'language_level.language');

            return response()->json([
                'status' => 'success',
                'message' => 'Game started',
                'data' => $game
            ]);
        }catch (\Exception $e){
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        }
    }

    /**
     * @group Game
     *
     * Almacena las estadísticas de los jugadores al final de un juego.
     *
     * Este endpoint permite actualizar las estadísticas de los jugadores, sumando los puntos locales de cada uno.
     *
     * @bodyParam players array required Lista de jugadores con sus ID y puntos locales. Ejemplo:
     * [
     *     { "id": 1, "localPoints": 10 },
     *     { "id": 2, "localPoints": 5 }
     * ]
     *
     * @response 200 {
     *     "status": "success"
     * }
     *
     * @response 500 {
     *     "status": "error",
     *     "message": "Error al almacenar las estadísticas."
     * }
     */
    public function storeStats(Request $request)
    {
        Log::info($request);
        try{
            $players = $request->players;

            foreach ($players as $player) {
                $gameUser = GameUser::findOrFail($player["id"]);
                $gameUser->points += $player["localPoints"];
                $gameUser->save();
            }

            return response()->json([
                'status' => 'success',
            ]);

        }catch (\Exception $e){
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        }

        return $request;

    }
}
