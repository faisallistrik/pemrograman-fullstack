<?php

use App\Http\Controllers\WebAuthController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('smarthub');
})->name('home');

Route::middleware('guest')->group(function () {
    Route::get('login', [WebAuthController::class, 'showLoginForm'])->name('login');
    Route::post('login', [WebAuthController::class, 'login']);
});

Route::middleware('auth')->group(function () {
    Route::get('dashboard', [WebAuthController::class, 'dashboard'])->name('dashboard');
    Route::post('logout', [WebAuthController::class, 'logout'])->name('logout');
});
