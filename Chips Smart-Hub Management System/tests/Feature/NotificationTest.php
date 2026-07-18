<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\Room;
use App\Models\User;
use App\Notifications\NewBookingPending;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;
use Tests\TestCase;

class NotificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_list_and_mark_notification_as_read(): void
    {
        $admin = User::factory()->admin()->create(['api_token' => Str::random(80)]);
        $member = User::factory()->create();
        $room = Room::create(['name' => 'Ruang N', 'capacity' => 5, 'status' => 'Tersedia']);

        $booking = Booking::create([
            'user_id' => $member->id,
            'room_id' => $room->id,
            'start_time' => Carbon::now()->addHour(),
            'end_time' => Carbon::now()->addHours(2),
            'purpose' => 'Rapat',
            'status' => 'pending',
        ]);

        $admin->notify(new NewBookingPending($booking));

        $listResponse = $this->withHeader('Authorization', 'Bearer ' . $admin->api_token)
            ->getJson('/api/notifications');

        $listResponse->assertStatus(200)->assertJsonPath('unread_count', 1);

        $notificationId = $listResponse->json('notifications.0.id');

        $this->withHeader('Authorization', 'Bearer ' . $admin->api_token)
            ->postJson("/api/notifications/{$notificationId}/read")
            ->assertStatus(200);

        $this->withHeader('Authorization', 'Bearer ' . $admin->api_token)
            ->getJson('/api/notifications')
            ->assertStatus(200)
            ->assertJsonPath('unread_count', 0);
    }
}
