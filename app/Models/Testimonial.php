<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Testimonial extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'nama',
        'keterangan',
        'perusahaan',
        'foto_avatar',
        'rate_star',
        'testimoni',
        'is_show_public',
        'sequence',
    ];

    protected $casts = [
        'rate_star' => 'integer',
        'is_show_public' => 'boolean',
        'sequence' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    protected $attributes = [
        'rate_star' => 5,
        'is_show_public' => true,
        'sequence' => 0,
    ];

    public function scopePublic($query)
    {
        return $query->where('is_show_public', true);
    }

    public function scopeActive($query)
    {
        return $query->where('is_show_public', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sequence', 'asc')->orderBy('created_at', 'desc');
    }
}
