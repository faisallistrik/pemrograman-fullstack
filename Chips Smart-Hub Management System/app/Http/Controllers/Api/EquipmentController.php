<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Equipment;
use Illuminate\Http\Request;

class EquipmentController extends Controller
{
    public function index(Request $request)
    {
        return Equipment::query()
            ->when($request->query('search'), function ($query, $search) {
                $needle = '%'.strtolower($search).'%';

                $query->where(function ($query) use ($needle) {
                    $query->whereRaw('LOWER(name) LIKE ?', [$needle])
                        ->orWhereRaw('LOWER(code) LIKE ?', [$needle]);
                });
            })
            ->orderBy('name')
            ->paginate((int) $request->query('per_page', 15));
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

        $equipment = Equipment::create($data);

        ActivityLog::record($request->user(), 'created', $equipment, "Membuat equipment {$equipment->code} - {$equipment->name}.");

        return $equipment;
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

        ActivityLog::record($request->user(), 'updated', $equipment, "Memperbarui equipment {$equipment->code} - {$equipment->name}.");

        return $equipment;
    }

    public function destroy(Request $request, Equipment $equipment)
    {
        ActivityLog::record($request->user(), 'deleted', $equipment, "Menghapus equipment {$equipment->code} - {$equipment->name}.");

        $equipment->delete();

        return response()->json(['message' => 'Equipment berhasil dihapus.']);
    }
}
