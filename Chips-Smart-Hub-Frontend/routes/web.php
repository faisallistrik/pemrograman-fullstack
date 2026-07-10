<?php

use Illuminate\Support\Facades\Route;

// Serve React app for all routes (SPA approach)
Route::get('{any}', function () {
    return view('app');
})->where('any', '.*');
