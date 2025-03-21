<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use \App\Http\Controllers\AuthenticatorController;

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
        Route::get('/languages', [\App\Http\Controllers\StatsUserLanguageController::class, 'getStatsLanguages']);
        Route::get('/getUserStatsLanguage/{languageId}', [\App\Http\Controllers\StatsUserLanguageController::class, 'getUserStatsLanguage']);
    });

   Route::prefix('/games')->group(function () {
       Route::get('/', [\App\Http\Controllers\GameController::class, 'getList']);
       Route::post('/store', [\App\Http\Controllers\GameController::class, 'store']);
       Route::get('/{gameUUID}', [\App\Http\Controllers\GameController::class, 'getGame']);
       Route::get('/join/{gameUUID}', [\App\Http\Controllers\GameController::class, 'join']);
       Route::get('/leave/{gameUUID}', [\App\Http\Controllers\GameController::class, 'leaveGame']);
   });
});

Route::get('/test', function () {
    return response()->json(['message' => 'Test route is working!']);
});
