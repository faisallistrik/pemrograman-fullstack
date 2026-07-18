<?php

namespace App\Notifications;

use App\Models\Booking;
use Illuminate\Notifications\Notification;

class BookingApproved extends Notification
{
    public function __construct(private readonly Booking $booking)
    {
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'title' => 'Booking disetujui',
            'message' => "Booking Anda \"{$this->booking->purpose}\" telah disetujui admin.",
            'booking_id' => $this->booking->id,
        ];
    }
}
