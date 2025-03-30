<?php

use App\Http\Controllers\AuthenticatorController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/languages', [\App\Http\Controllers\LanguageController::class, 'index']);
});
Route::prefix('/auth')->group(function () {
    Route::post('/register', [AuthenticatorController::class, 'register']);
    Route::post('/login', [AuthenticatorController::class, 'login']);
    Route::post('/logout', [AuthenticatorController::class, 'logout']);
    Route::get('/google/callback', [AuthenticatorController::class, 'googleLogin']);
    Route::get('/google/redirect', [AuthenticatorController::class, 'googleRedirect']);
    Route::post('/google/save-password', [AuthenticatorController::class, 'saveGooglePassword']);
    Route::post('/change-password', [AuthenticatorController::class, 'changePassword'])->name('change.password');
});


Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::get('/checkAuth', [AuthenticatorController::class, 'checkAuth']);
    Route::prefix('/user')->group(function () {
        Route::post('/languages/store', [\App\Http\Controllers\StatsUserLanguageController::class, 'store']);
        Route::get('/languages', [\App\Http\Controllers\StatsUserLanguageController::class, 'getStatsLanguages']);
        Route::get('/getUserStatsLanguage/{language}', [\App\Http\Controllers\StatsUserLanguageController::class, 'getUserStatsLanguage']);
    });

    Route::prefix('/games')->group(function () {
        Route::get('/', [\App\Http\Controllers\GameController::class, 'getList']);
        Route::get('/{language}', [\App\Http\Controllers\GameController::class, 'getListLanguage']);
        Route::post('/store', [\App\Http\Controllers\GameController::class, 'store']);
        Route::get('/{gameUUID}', [\App\Http\Controllers\GameController::class, 'getGame']);
        Route::get('/join/{gameUUID}', [\App\Http\Controllers\GameController::class, 'join']);
        Route::get('/leave/{gameUUID}', [\App\Http\Controllers\GameController::class, 'leaveGame']);
        Route::post('/start', [\App\Http\Controllers\GameController::class, 'startRoom']);
    });

    Route::post('/game/store/stats', [\App\Http\Controllers\GameController::class, 'storeStats']);
    Route::post('/game/store/stats/user', [\App\Http\Controllers\GameController::class, 'storeStatsUser']);
    Route::post('/game/store/stats/finish', [\App\Http\Controllers\GameController::class, 'storeStatsFinishGame']);
    Route::post('/game/history/round', [\App\Http\Controllers\GameController::class, 'storeHistoryRound']);

});

Route::get('/test', function () {
    return response()->json(['message' => 'Test route is working!']);
});
