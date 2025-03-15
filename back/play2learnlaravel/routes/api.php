<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('/auth')->group(function () {
    Route::post('/register', [\App\Http\Controllers\AuthenticatorController::class, 'register']);
    Route::post('/login', [\App\Http\Controllers\AuthenticatorController::class, 'login']);
    Route::post('/logout', [\App\Http\Controllers\AuthenticatorController::class, 'logout']);
});

Route::get('/te', function () {
    return response()->json(['message' => 'Test route is working!']);
});
