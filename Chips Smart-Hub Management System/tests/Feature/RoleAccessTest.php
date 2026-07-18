<?php

namespace Tests\Feature;

use App\Models\Equipment;
use App\Models\Room;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class RoleAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_member_cannot_create_equipment(): void
    {
        $member = User::factory()->create(['api_token' => Str::random(80)]);

        $response = $this->withHeader('Authorization', 'Bearer ' . $member->api_token)
            ->postJson('/api/equipment', [
                'code' => 'EQ-100',
                'name' => 'Laptop',
                'quantity' => 1,
            ]);

        $response->assertStatus(403);
    }

    public function test_admin_can_create_equipment(): void
    {
        $admin = User::factory()->admin()->create(['api_token' => Str::random(80)]);

        $response = $this->withHeader('Authorization', 'Bearer ' . $admin->api_token)
            ->postJson('/api/equipment', [
                'code' => 'EQ-101',
                'name' => 'Laptop',
                'quantity' => 1,
            ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('equipment', ['code' => 'EQ-101']);
    }

    public function test_member_can_read_equipment_and_room_list_for_booking_picker(): void
    {
        $member = User::factory()->create(['api_token' => Str::random(80)]);
        Equipment::create(['code' => 'EQ-200', 'name' => 'Kamera', 'quantity' => 1, 'status' => 'Tersedia']);
        Room::create(['name' => 'Ruang A', 'capacity' => 10, 'status' => 'Tersedia']);

        $this->withHeader('Authorization', 'Bearer ' . $member->api_token)
            ->getJson('/api/equipment')
            ->assertStatus(200);

        $this->withHeader('Authorization', 'Bearer ' . $member->api_token)
            ->getJson('/api/rooms')
            ->assertStatus(200);
    }

    public function test_member_cannot_delete_room(): void
    {
        $member = User::factory()->create(['api_token' => Str::random(80)]);
        $room = Room::create(['name' => 'Ruang B', 'capacity' => 5, 'status' => 'Tersedia']);

        $this->withHeader('Authorization', 'Bearer ' . $member->api_token)
            ->deleteJson("/api/rooms/{$room->id}")
            ->assertStatus(403);

        $this->assertDatabaseHas('rooms', ['id' => $room->id]);
    }

    public function test_member_cannot_view_activity_logs(): void
    {
        $member = User::factory()->create(['api_token' => Str::random(80)]);

        $this->withHeader('Authorization', 'Bearer ' . $member->api_token)
            ->getJson('/api/activity-logs')
            ->assertStatus(403);
    }

    public function test_admin_can_view_activity_logs(): void
    {
        $admin = User::factory()->admin()->create(['api_token' => Str::random(80)]);

        $this->withHeader('Authorization', 'Bearer ' . $admin->api_token)
            ->getJson('/api/activity-logs')
            ->assertStatus(200);
    }
}
