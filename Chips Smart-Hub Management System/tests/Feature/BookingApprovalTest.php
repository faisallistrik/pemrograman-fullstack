<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\Room;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;
use Tests\TestCase;

class BookingApprovalTest extends TestCase
{
    use RefreshDatabase;

    private function makeBooking(User $owner, Room $room): Booking
    {
        return Booking::create([
            'user_id' => $owner->id,
            'room_id' => $room->id,
            'start_time' => Carbon::now()->addHour(),
            'end_time' => Carbon::now()->addHours(2),
            'purpose' => 'Rapat',
            'status' => 'pending',
        ]);
    }

    public function test_check_in_is_rejected_when_booking_not_yet_approved(): void
    {
        $member = User::factory()->create(['api_token' => Str::random(80)]);
        $room = Room::create(['name' => 'Ruang C', 'capacity' => 5, 'status' => 'Tersedia']);
        $booking = $this->makeBooking($member, $room);

        $this->withHeader('Authorization', 'Bearer ' . $member->api_token)
            ->postJson("/api/bookings/{$booking->id}/check-in")
            ->assertStatus(422);
    }

    public function test_member_cannot_approve_booking(): void
    {
        $member = User::factory()->create(['api_token' => Str::random(80)]);
        $room = Room::create(['name' => 'Ruang D', 'capacity' => 5, 'status' => 'Tersedia']);
        $booking = $this->makeBooking($member, $room);

        $this->withHeader('Authorization', 'Bearer ' . $member->api_token)
            ->postJson("/api/bookings/{$booking->id}/approve")
            ->assertStatus(403);
    }

    public function test_member_cannot_access_other_members_booking(): void
    {
        $owner = User::factory()->create(['api_token' => Str::random(80)]);
        $other = User::factory()->create(['api_token' => Str::random(80)]);
        $room = Room::create(['name' => 'Ruang E', 'capacity' => 5, 'status' => 'Tersedia']);
        $booking = $this->makeBooking($owner, $room);

        $this->withHeader('Authorization', 'Bearer ' . $other->api_token)
            ->getJson("/api/bookings/{$booking->id}")
            ->assertStatus(403);

        $this->withHeader('Authorization', 'Bearer ' . $other->api_token)
            ->deleteJson("/api/bookings/{$booking->id}")
            ->assertStatus(403);
    }

    public function test_full_approval_to_completion_lifecycle_syncs_room_status(): void
    {
        $member = User::factory()->create(['api_token' => Str::random(80)]);
        $admin = User::factory()->admin()->create(['api_token' => Str::random(80)]);
        $room = Room::create(['name' => 'Ruang F', 'capacity' => 5, 'status' => 'Tersedia']);
        $booking = $this->makeBooking($member, $room);

        $this->withHeader('Authorization', 'Bearer ' . $admin->api_token)
            ->postJson("/api/bookings/{$booking->id}/approve")
            ->assertStatus(200)
            ->assertJsonPath('status', 'approved');

        $this->withHeader('Authorization', 'Bearer ' . $member->api_token)
            ->postJson("/api/bookings/{$booking->id}/check-in")
            ->assertStatus(200)
            ->assertJsonPath('status', 'checked_in');

        $this->assertDatabaseHas('rooms', ['id' => $room->id, 'status' => 'Sedang Digunakan']);

        $this->withHeader('Authorization', 'Bearer ' . $member->api_token)
            ->postJson("/api/bookings/{$booking->id}/complete")
            ->assertStatus(200)
            ->assertJsonPath('status', 'completed');

        $this->assertDatabaseHas('rooms', ['id' => $room->id, 'status' => 'Tersedia']);
    }

    public function test_admin_reject_cancels_booking_and_notifies_owner(): void
    {
        $member = User::factory()->create(['api_token' => Str::random(80)]);
        $admin = User::factory()->admin()->create(['api_token' => Str::random(80)]);
        $room = Room::create(['name' => 'Ruang G', 'capacity' => 5, 'status' => 'Tersedia']);
        $booking = $this->makeBooking($member, $room);

        $this->withHeader('Authorization', 'Bearer ' . $admin->api_token)
            ->postJson("/api/bookings/{$booking->id}/reject")
            ->assertStatus(200)
            ->assertJsonPath('status', 'cancelled');

        $this->assertDatabaseHas('notifications', [
            'notifiable_id' => $member->id,
            'type' => \App\Notifications\BookingRejected::class,
        ]);
    }

    public function test_creating_booking_notifies_all_admins(): void
    {
        $member = User::factory()->create(['api_token' => Str::random(80)]);
        $admin = User::factory()->admin()->create();
        $room = Room::create(['name' => 'Ruang H', 'capacity' => 5, 'status' => 'Tersedia']);

        $this->withHeader('Authorization', 'Bearer ' . $member->api_token)
            ->postJson('/api/bookings', [
                'room_id' => $room->id,
                'start_time' => Carbon::now()->addHour()->toDateTimeString(),
                'end_time' => Carbon::now()->addHours(2)->toDateTimeString(),
                'purpose' => 'Diskusi',
            ])
            ->assertStatus(201);

        $this->assertDatabaseHas('notifications', [
            'notifiable_id' => $admin->id,
            'type' => \App\Notifications\NewBookingPending::class,
        ]);

        $this->assertDatabaseHas('activity_logs', [
            'user_id' => $member->id,
            'action' => 'created',
            'subject_type' => 'Booking',
        ]);
    }
}
