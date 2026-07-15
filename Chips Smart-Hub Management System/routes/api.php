<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\EquipmentController;
use App\Http\Controllers\Api\RoomController;
use App\Http\Middleware\EnsureApiTokenIsValid;
use Illuminate\Support\Facades\Route;

Route::post('login', [AuthController::class, 'login']);
Route::post('register', [AuthController::class, 'register']);

Route::middleware([EnsureApiTokenIsValid::class])->group(function () {
    Route::get('me', [AuthController::class, 'me']);
    Route::post('logout', [AuthController::class, 'logout']);

    Route::apiResource('equipment', EquipmentController::class);
    Route::apiResource('rooms', RoomController::class);
    Route::apiResource('bookings', BookingController::class);
    Route::post('bookings/{booking}/check-in', [BookingController::class, 'checkIn']);
});
