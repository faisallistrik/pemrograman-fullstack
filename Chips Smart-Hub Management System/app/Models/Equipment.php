<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Equipment extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'category',
        'quantity',
        'condition',
        'status',
        'description',
    ];

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }
}
