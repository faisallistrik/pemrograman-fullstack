<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Equipment;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        return Booking::with(['user', 'equipment', 'room'])
            ->when(! $request->user()->isAdmin(), fn ($query) => $query->where('user_id', $request->user()->id))
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

        if ($response = $this->ensureBookingAvailability($data)) {
            return $response;
        }

        $data['user_id'] = $request->user()->id;
        $data['status'] = 'pending';

        return Booking::create($data);
    }

    public function show(Request $request, Booking $booking)
    {
        if ($response = $this->ensureOwnership($request, $booking)) {
            return $response;
        }

        return $booking->load(['user', 'equipment', 'room']);
    }

    public function update(Request $request, Booking $booking)
    {
        if ($response = $this->ensureOwnership($request, $booking)) {
            return $response;
        }

        if (! in_array($booking->status, ['pending', 'approved'], true)) {
            return response()->json(['message' => 'Booking hanya dapat diubah selama berstatus pending atau approved.'], 422);
        }

        $data = $request->validate([
            'equipment_id' => ['nullable', 'exists:equipment,id'],
            'room_id' => ['nullable', 'exists:rooms,id'],
            'start_time' => ['sometimes', 'date', 'after_or_equal:now'],
            'end_time' => ['sometimes', 'date'],
            'purpose' => ['sometimes', 'string', 'max:255'],
        ]);

        $startTime = $data['start_time'] ?? $booking->start_time->toDateTimeString();
        $endTime = $data['end_time'] ?? $booking->end_time->toDateTimeString();

        if (strtotime($endTime) <= strtotime($startTime)) {
            return response()->json(['message' => 'End time harus lebih besar dari start time.'], 422);
        }

        $data['equipment_id'] = $data['equipment_id'] ?? $booking->equipment_id;
        $data['room_id'] = $data['room_id'] ?? $booking->room_id;

        if (empty($data['equipment_id']) && empty($data['room_id'])) {
            return response()->json(['message' => 'Booking harus memasukkan equipment atau room.'], 422);
        }

        $availabilityData = [
            'equipment_id' => $data['equipment_id'],
            'room_id' => $data['room_id'],
            'start_time' => $startTime,
            'end_time' => $endTime,
        ];

        if ($response = $this->ensureBookingAvailability($availabilityData, $booking->id)) {
            return $response;
        }

        $booking->update($data);

        return $booking->load(['user', 'equipment', 'room']);
    }

    public function destroy(Request $request, Booking $booking)
    {
        if ($response = $this->ensureOwnership($request, $booking)) {
            return $response;
        }

        $booking->delete();

        return response()->json(['message' => 'Booking berhasil dihapus.']);
    }

    public function approve(Request $request, Booking $booking)
    {
        if ($booking->status !== 'pending') {
            return response()->json(['message' => 'Hanya booking berstatus pending yang dapat disetujui.'], 422);
        }

        $booking->update(['status' => 'approved']);

        return $booking->load(['user', 'equipment', 'room']);
    }

    public function reject(Request $request, Booking $booking)
    {
        if (! in_array($booking->status, ['pending', 'approved'], true)) {
            return response()->json(['message' => 'Booking ini tidak dapat ditolak/dibatalkan.'], 422);
        }

        $booking->update(['status' => 'cancelled']);

        return $booking->load(['user', 'equipment', 'room']);
    }

    public function checkIn(Request $request, Booking $booking)
    {
        if ($response = $this->ensureOwnership($request, $booking)) {
            return $response;
        }

        if ($booking->status !== 'approved') {
            return response()->json(['message' => 'Booking harus disetujui (approved) admin sebelum dapat di-check-in.'], 422);
        }

        $booking->update([
            'status' => 'checked_in',
            'check_in_at' => Carbon::now(),
        ]);

        $this->syncResourceStatus($booking, 'Dipinjam', 'Sedang Digunakan');

        return $booking->load(['user', 'equipment', 'room']);
    }

    public function complete(Request $request, Booking $booking)
    {
        if ($response = $this->ensureOwnership($request, $booking)) {
            return $response;
        }

        if ($booking->status !== 'checked_in') {
            return response()->json(['message' => 'Hanya booking berstatus checked-in yang dapat diselesaikan.'], 422);
        }

        $booking->update(['status' => 'completed']);

        $this->syncResourceStatus($booking, 'Tersedia', 'Tersedia');

        return $booking->load(['user', 'equipment', 'room']);
    }

    private function ensureOwnership(Request $request, Booking $booking): ?JsonResponse
    {
        if (! $request->user()->isAdmin() && $booking->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Anda tidak memiliki akses ke booking ini.'], 403);
        }

        return null;
    }

    private function syncResourceStatus(Booking $booking, string $equipmentStatus, string $roomStatus): void
    {
        if ($booking->equipment_id) {
            Equipment::whereKey($booking->equipment_id)->update(['status' => $equipmentStatus]);
        }

        if ($booking->room_id) {
            Room::whereKey($booking->room_id)->update(['status' => $roomStatus]);
        }
    }

    private function ensureBookingAvailability(array $data, ?int $bookingId = null)
    {
        $overlapConditions = function ($query) use ($data) {
            $query->where(function ($query) use ($data) {
                $query->whereBetween('start_time', [$data['start_time'], $data['end_time']])
                    ->orWhereBetween('end_time', [$data['start_time'], $data['end_time']])
                    ->orWhere(function ($query) use ($data) {
                        $query->where('start_time', '<=', $data['start_time'])
                            ->where('end_time', '>=', $data['end_time']);
                    });
            });
        };

        if (! empty($data['equipment_id'])) {
            $equipmentOverlap = Booking::where('equipment_id', $data['equipment_id'])
                ->whereIn('status', ['pending', 'approved', 'checked_in'])
                ->when($bookingId, fn ($query) => $query->where('id', '!=', $bookingId))
                ->where($overlapConditions)
                ->exists();

            if ($equipmentOverlap) {
                return response()->json(['message' => 'Equipment sudah dibooking pada jadwal tersebut.'], 422);
            }
        }

        if (! empty($data['room_id'])) {
            $roomOverlap = Booking::where('room_id', $data['room_id'])
                ->whereIn('status', ['pending', 'approved', 'checked_in'])
                ->when($bookingId, fn ($query) => $query->where('id', '!=', $bookingId))
                ->where($overlapConditions)
                ->exists();

            if ($roomOverlap) {
                return response()->json(['message' => 'Room sudah dibooking pada jadwal tersebut.'], 422);
            }
        }

        return null;
    }
}
