<?php

namespace App\Notifications;

use App\Models\Booking;
use Illuminate\Notifications\Notification;

class NewBookingPending extends Notification
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
            'title' => 'Booking baru menunggu persetujuan',
            'message' => "{$this->booking->user->name} membuat booking baru: \"{$this->booking->purpose}\".",
            'booking_id' => $this->booking->id,
        ];
    }
}
