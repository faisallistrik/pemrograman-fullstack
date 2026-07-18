<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Equipment;
use App\Models\Room;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats(Request $request)
    {
        $user = $request->user();

        $bookingQuery = Booking::query();

        if (! $user->isAdmin()) {
            $bookingQuery->where('user_id', $user->id);
        }

        return response()->json([
            'total_equipment' => Equipment::count(),
            'available_equipment' => Equipment::where('status', 'Tersedia')->count(),
            'total_rooms' => Room::count(),
            'available_rooms' => Room::where('status', 'Tersedia')->count(),
            'active_bookings' => (clone $bookingQuery)->where('status', 'checked_in')->count(),
            'pending_bookings' => (clone $bookingQuery)->where('status', 'pending')->count(),
            'is_admin' => $user->isAdmin(),
        ]);
    }
}
