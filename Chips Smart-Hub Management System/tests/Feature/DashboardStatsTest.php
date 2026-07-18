<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\Equipment;
use App\Models\Room;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;
use Tests\TestCase;

class DashboardStatsTest extends TestCase
{
    use RefreshDatabase;

    public function test_dashboard_stats_reflect_current_data_and_scope_by_role(): void
    {
        $admin = User::factory()->admin()->create(['api_token' => Str::random(80)]);
        $memberA = User::factory()->create(['api_token' => Str::random(80)]);
        $memberB = User::factory()->create(['api_token' => Str::random(80)]);

        Equipment::create(['code' => 'EQ-A', 'name' => 'A', 'quantity' => 1, 'status' => 'Tersedia']);
        Equipment::create(['code' => 'EQ-B', 'name' => 'B', 'quantity' => 1, 'status' => 'Dipinjam']);
        Room::create(['name' => 'R1', 'capacity' => 5, 'status' => 'Tersedia']);

        Booking::create([
            'user_id' => $memberA->id,
            'room_id' => 1,
            'start_time' => Carbon::now()->addHour(),
            'end_time' => Carbon::now()->addHours(2),
            'purpose' => 'A pending',
            'status' => 'pending',
        ]);

        Booking::create([
            'user_id' => $memberB->id,
            'room_id' => 1,
            'start_time' => Carbon::now()->addHours(3),
            'end_time' => Carbon::now()->addHours(4),
            'purpose' => 'B checked in',
            'status' => 'checked_in',
        ]);

        $adminStats = $this->withHeader('Authorization', 'Bearer ' . $admin->api_token)
            ->getJson('/api/dashboard/stats')
            ->assertStatus(200)
            ->json();

        $this->assertSame(2, $adminStats['total_equipment']);
        $this->assertSame(1, $adminStats['available_equipment']);
        $this->assertSame(1, $adminStats['pending_bookings']);
        $this->assertSame(1, $adminStats['active_bookings']);
        $this->assertTrue($adminStats['is_admin']);

        $memberAStats = $this->withHeader('Authorization', 'Bearer ' . $memberA->api_token)
            ->getJson('/api/dashboard/stats')
            ->assertStatus(200)
            ->json();

        $this->assertSame(1, $memberAStats['pending_bookings']);
        $this->assertSame(0, $memberAStats['active_bookings']);
        $this->assertFalse($memberAStats['is_admin']);
    }
}
