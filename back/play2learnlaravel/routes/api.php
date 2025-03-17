<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use \App\Http\Controllers\AuthenticatorController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('/auth')->group(function () {
    Route::post('/register', [AuthenticatorController::class, 'register']);
    Route::post('/login', [AuthenticatorController::class, 'login']);
    Route::post('/logout', [AuthenticatorController::class, 'logout']);
    Route::post('/google/callback', [AuthenticatorController::class, 'googleLogin']);
    Route::get('/google/redirect', [AuthenticatorController::class, 'googleRedirect']);
});

Route::get('/test', function () {
    return response()->json(['message' => 'Test route is working!']);
});
