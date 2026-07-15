<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\Equipment;
use App\Models\Room;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Illuminate\Support\Carbon;
use Tests\TestCase;

class BookingWorkflowTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_create_booking_and_check_in(): void
    {
        $user = User::factory()->create(['api_token' => Str::random(80)]);
        $equipment = Equipment::create([
            'code' => 'EQ-001',
            'name' => 'Projector',
            'category' => 'A/V',
            'quantity' => 2,
            'condition' => 'Baik',
            'status' => 'Tersedia',
        ]);

        $startTime = Carbon::now()->addHour()->toDateTimeString();
        $endTime = Carbon::now()->addHours(2)->toDateTimeString();

        $createResponse = $this->withHeader('Authorization', 'Bearer ' . $user->api_token)
            ->postJson('/api/bookings', [
                'equipment_id' => $equipment->id,
                'start_time' => $startTime,
                'end_time' => $endTime,
                'purpose' => 'Uji coba alat',
            ]);

        $createResponse->assertStatus(201)
            ->assertJsonPath('equipment_id', $equipment->id)
            ->assertJsonPath('status', 'pending');

        $bookingId = $createResponse->json('id');

        $checkInResponse = $this->withHeader('Authorization', 'Bearer ' . $user->api_token)
            ->postJson("/api/bookings/{$bookingId}/check-in");

        $checkInResponse->assertStatus(200)
            ->assertJsonPath('status', 'checked_in')
            ->assertJsonStructure(['id', 'check_in_at']);
    }

    public function test_booking_overlap_is_prevented_for_same_equipment(): void
    {
        $user = User::factory()->create(['api_token' => Str::random(80)]);
        $equipment = Equipment::create([
            'code' => 'EQ-002',
            'name' => 'Microphone',
            'category' => 'Audio',
            'quantity' => 1,
            'condition' => 'Baik',
            'status' => 'Tersedia',
        ]);

        $startTime = Carbon::now()->addHour();
        $endTime = Carbon::now()->addHours(2);

        $this->withHeader('Authorization', 'Bearer ' . $user->api_token)
            ->postJson('/api/bookings', [
                'equipment_id' => $equipment->id,
                'start_time' => $startTime->toDateTimeString(),
                'end_time' => $endTime->toDateTimeString(),
                'purpose' => 'Pertemuan',
            ]);

        $overlapResponse = $this->withHeader('Authorization', 'Bearer ' . $user->api_token)
            ->postJson('/api/bookings', [
                'equipment_id' => $equipment->id,
                'start_time' => $startTime->addMinutes(30)->toDateTimeString(),
                'end_time' => $endTime->addHour()->toDateTimeString(),
                'purpose' => 'Booking tumpang tindih',
            ]);

        $overlapResponse->assertStatus(422)
            ->assertJson(['message' => 'Equipment sudah dibooking pada jadwal tersebut.']);
    }
}
