<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Equipment;
use Illuminate\Http\Request;

class EquipmentController extends Controller
{
    public function index()
    {
        return Equipment::orderBy('name')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'code' => ['required', 'string', 'max:60', 'unique:equipment,code'],
            'name' => ['required', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:120'],
            'quantity' => ['required', 'integer', 'min:0'],
            'condition' => ['nullable', 'string', 'max:120'],
            'status' => ['nullable', 'string', 'max:120'],
            'description' => ['nullable', 'string'],
        ]);

        return Equipment::create($data);
    }

    public function show(Equipment $equipment)
    {
        return $equipment;
    }

    public function update(Request $request, Equipment $equipment)
    {
        $data = $request->validate([
            'code' => ['sometimes', 'string', 'max:60', 'unique:equipment,code,' . $equipment->id],
            'name' => ['sometimes', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:120'],
            'quantity' => ['sometimes', 'integer', 'min:0'],
            'condition' => ['nullable', 'string', 'max:120'],
            'status' => ['nullable', 'string', 'max:120'],
            'description' => ['nullable', 'string'],
        ]);

        $equipment->update($data);

        return $equipment;
    }

    public function destroy(Equipment $equipment)
    {
        $equipment->delete();

        return response()->json(['message' => 'Equipment berhasil dihapus.']);
    }
}
