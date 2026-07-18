<?php

namespace Tests\Feature;

use App\Models\Equipment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class PaginationSearchTest extends TestCase
{
    use RefreshDatabase;

    public function test_equipment_index_is_paginated(): void
    {
        $user = User::factory()->create(['api_token' => Str::random(80)]);

        foreach (range(1, 20) as $i) {
            Equipment::create([
                'code' => "EQ-{$i}",
                'name' => "Item {$i}",
                'quantity' => 1,
                'status' => 'Tersedia',
            ]);
        }

        $response = $this->withHeader('Authorization', 'Bearer ' . $user->api_token)
            ->getJson('/api/equipment?per_page=5');

        $response->assertStatus(200)
            ->assertJsonPath('per_page', 5)
            ->assertJsonPath('total', 20)
            ->assertJsonCount(5, 'data');
    }

    public function test_equipment_search_filters_by_name_and_code_case_insensitively(): void
    {
        $user = User::factory()->create(['api_token' => Str::random(80)]);

        Equipment::create(['code' => 'EQ-CAM', 'name' => 'Kamera Mirrorless', 'quantity' => 1, 'status' => 'Tersedia']);
        Equipment::create(['code' => 'EQ-MIC', 'name' => 'Microphone', 'quantity' => 1, 'status' => 'Tersedia']);

        $response = $this->withHeader('Authorization', 'Bearer ' . $user->api_token)
            ->getJson('/api/equipment?search=KAMERA');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.code', 'EQ-CAM');
    }
}
