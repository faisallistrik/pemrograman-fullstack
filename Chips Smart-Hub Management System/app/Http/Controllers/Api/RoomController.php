<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Room;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    public function index(Request $request)
    {
        return Room::query()
            ->when($request->query('search'), function ($query, $search) {
                $needle = '%'.strtolower($search).'%';

                $query->where(function ($query) use ($needle) {
                    $query->whereRaw('LOWER(name) LIKE ?', [$needle])
                        ->orWhereRaw('LOWER(location) LIKE ?', [$needle]);
                });
            })
            ->orderBy('name')
            ->paginate((int) $request->query('per_page', 15));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'capacity' => ['required', 'integer', 'min:1'],
            'status' => ['nullable', 'string', 'max:120'],
            'description' => ['nullable', 'string'],
        ]);

        $room = Room::create($data);

        ActivityLog::record($request->user(), 'created', $room, "Membuat ruangan {$room->name}.");

        return $room;
    }

    public function show(Room $room)
    {
        return $room;
    }

    public function update(Request $request, Room $room)
    {
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'capacity' => ['sometimes', 'integer', 'min:1'],
            'status' => ['nullable', 'string', 'max:120'],
            'description' => ['nullable', 'string'],
        ]);

        $room->update($data);

        ActivityLog::record($request->user(), 'updated', $room, "Memperbarui ruangan {$room->name}.");

        return $room;
    }

    public function destroy(Request $request, Room $room)
    {
        ActivityLog::record($request->user(), 'deleted', $room, "Menghapus ruangan {$room->name}.");

        $room->delete();

        return response()->json(['message' => 'Ruang berhasil dihapus.']);
    }
}
