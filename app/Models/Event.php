<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $fillable = [
        'title',
        'description',
        'start_date',
        'end_date',
        'location',
        'capacity',
        'price',
        'tags',
        'image',
        'host_id',
        'status',
        'approved_by',
        'approved_at',
        'rejected_at',
        'reject_reason',
    ];

    protected $casts = [
        'tags' => 'array',
        'approved_at' => 'datetime',
        'rejected_at' => 'datetime',
    ];

    protected $appends = ['available_spots'];

    /**
     * Computed available spots = capacity minus confirmed registrations.
     * registrations_count is loaded via loadCount('registrations') in the controller.
     */
    public function getAvailableSpotsAttribute(): int
    {
        return max(0, $this->capacity - ($this->registrations_count ?? 0));
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'host_id');
    }

    public function registrations()
    {
        return $this->hasMany(\App\Models\EventRegistration::class);
    }
}
