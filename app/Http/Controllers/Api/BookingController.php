<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Equipment;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        return Booking::with(['user', 'equipment', 'room'])
            ->when($request->query('status'), fn ($query, $status) => $query->where('status', $status))
            ->orderByDesc('start_time')
            ->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'equipment_id' => ['nullable', 'exists:equipment,id', 'required_without:room_id'],
            'room_id' => ['nullable', 'exists:rooms,id', 'required_without:equipment_id'],
            'start_time' => ['required', 'date', 'after_or_equal:now'],
            'end_time' => ['required', 'date', 'after:start_time'],
            'purpose' => ['required', 'string', 'max:255'],
        ]);

        if (! empty($data['equipment_id'])) {
            $equipment = Equipment::find($data['equipment_id']);

            if ($equipment && $equipment->quantity < 1) {
                return response()->json(['message' => 'Kuantitas equipment tidak mencukupi.'], 422);
            }
        }

        $data['user_id'] = $request->user()->id;
        $data['status'] = 'pending';

        return Booking::create($data);
    }

    public function show(Booking $booking)
    {
        return $booking->load(['user', 'equipment', 'room']);
    }

    public function update(Request $request, Booking $booking)
    {
        $data = $request->validate([
            'equipment_id' => ['nullable', 'exists:equipment,id'],
            'room_id' => ['nullable', 'exists:rooms,id'],
            'start_time' => ['sometimes', 'date', 'after_or_equal:now'],
            'end_time' => ['sometimes', 'date'],
            'purpose' => ['sometimes', 'string', 'max:255'],
            'status' => ['nullable', 'in:pending,approved,checked_in,completed,cancelled'],
        ]);

        if (! empty($data['start_time']) && ! empty($data['end_time']) && strtotime($data['end_time']) <= strtotime($data['start_time'])) {
            return response()->json(['message' => 'End time harus lebih besar dari start time.'], 422);
        }

        $booking->update($data);

        return $booking->load(['user', 'equipment', 'room']);
    }

    public function destroy(Booking $booking)
    {
        $booking->delete();

        return response()->json(['message' => 'Booking berhasil dihapus.']);
    }

    public function checkIn(Booking $booking)
    {
        if ($booking->status === 'checked_in') {
            return response()->json(['message' => 'Booking sudah check-in.'], 422);
        }

        $booking->update([
            'status' => 'checked_in',
            'check_in_at' => Carbon::now(),
        ]);

        return $booking->load(['user', 'equipment', 'room']);
    }
}
