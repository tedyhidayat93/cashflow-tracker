<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Client extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'website',
        'phone',
        'email',
        'address',
        'pic',
        'image',
        'is_active',
        'sequence',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sequence' => 'integer',
        'deleted_at' => 'datetime',
    ];

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sequence', 'asc')->orderBy('name', 'asc');
    }
}
