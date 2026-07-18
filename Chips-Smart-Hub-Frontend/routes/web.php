<?php

use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

// Dashboard is server-rendered via Inertia (real Inertia usage, not client SPA)
Route::get('/dashboard', [DashboardController::class, 'index']);

// Serve React app for all other routes (SPA approach)
Route::get('{any}', function () {
    return view('app');
})->where('any', '.*');
