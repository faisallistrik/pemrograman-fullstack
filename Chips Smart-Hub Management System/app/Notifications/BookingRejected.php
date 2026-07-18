<?php

namespace App\Notifications;

use App\Models\Booking;
use Illuminate\Notifications\Notification;

class BookingRejected extends Notification
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
            'title' => 'Booking ditolak',
            'message' => "Booking Anda \"{$this->booking->purpose}\" ditolak/dibatalkan admin.",
            'booking_id' => $this->booking->id,
        ];
    }
}
