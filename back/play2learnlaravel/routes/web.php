<?php

use App\Http\Controllers\AuthenticatorController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/password/change', [AuthenticatorController::class, 'changePasswordView'])->name('view.change');
