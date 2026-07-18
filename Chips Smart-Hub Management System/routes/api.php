<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\EquipmentController;
use App\Http\Controllers\Api\RoomController;
use App\Http\Middleware\EnsureApiTokenIsValid;
use Illuminate\Support\Facades\Route;

Route::post('login', [AuthController::class, 'login']);
Route::post('register', [AuthController::class, 'register']);

Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('reset-password', [AuthController::class, 'resetPassword']);

Route::middleware([EnsureApiTokenIsValid::class])->group(function () {
    Route::get('me', [AuthController::class, 'me']);
    Route::post('logout', [AuthController::class, 'logout']);

    Route::apiResource('equipment', EquipmentController::class)
        ->middlewareFor(['store', 'update', 'destroy'], 'admin');
    Route::apiResource('rooms', RoomController::class)
        ->middlewareFor(['store', 'update', 'destroy'], 'admin');

    Route::apiResource('bookings', BookingController::class);
    Route::post('bookings/{booking}/check-in', [BookingController::class, 'checkIn']);
    Route::post('bookings/{booking}/complete', [BookingController::class, 'complete']);
    Route::post('bookings/{booking}/approve', [BookingController::class, 'approve'])->middleware('admin');
    Route::post('bookings/{booking}/reject', [BookingController::class, 'reject'])->middleware('admin');
});
