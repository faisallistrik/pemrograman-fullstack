<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Room;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    public function index()
    {
        return Room::orderBy('name')->get();
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

        return Room::create($data);
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

        return $room;
    }

    public function destroy(Room $room)
    {
        $room->delete();

        return response()->json(['message' => 'Ruang berhasil dihapus.']);
    }
}
