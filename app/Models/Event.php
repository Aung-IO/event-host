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
    'image',
    'reject_reason',
    'host_id',
];

public function user()
{
    return $this->belongsTo(User::class);
}

}
