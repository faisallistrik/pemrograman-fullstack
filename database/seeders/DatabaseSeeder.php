<?php

namespace Database\Seeders;

use App\Models\Equipment;
use App\Models\Room;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Admin Smart Hub',
            'email' => 'admin@smart-hub.local',
            'role' => 'admin',
            'api_token' => Str::random(80),
        ]);

        User::factory()->create([
            'name' => 'Member Smart Hub',
            'email' => 'member@smart-hub.local',
            'role' => 'user',
            'api_token' => Str::random(80),
        ]);

        Equipment::create([
            'code' => 'EQ-001',
            'name' => 'Kamera Mirrorless',
            'category' => 'Audio Visual',
            'quantity' => 3,
            'condition' => 'Baik',
            'description' => 'Peralatan studio untuk dokumentasi video.',
        ]);

        Room::create([
            'name' => 'Ruang Studio A',
            'location' => 'Gedung 2, Lantai 1',
            'capacity' => 12,
            'status' => 'Tersedia',
            'description' => 'Ruang kerja untuk produksi konten kreatif.',
        ]);
    }
}

