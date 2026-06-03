<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LogActivity extends Model
{
    protected $fillable = [
        'action',
        'message',
        'page',
        'ip_address',
        'provider',
        'device',
        'user_agent',
        'latitude',
        'longitude',
        'city',
        'region',
        'country',
        'url_path',
        'http_method',
        'timestamp',
    ];

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'timestamp' => 'datetime',
    ];

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'log_activities';

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = true;

    /**
     * Get the human readable device type.
     *
     * @return string
     */
    public function getDeviceLabelAttribute()
    {
        return match($this->device) {
            'phone' => 'Phone',
            'tablet' => 'Tablet',
            'pc' => 'PC',
            default => 'Unknown',
        };
    }

    /**
     * Get the full location string.
     *
     * @return string
     */
    public function getFullLocationAttribute()
    {
        $parts = array_filter([$this->city, $this->region, $this->country]);
        return implode(', ', $parts);
    }

    /**
     * Scope a query to only include activities from the last 24 hours.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeLast24Hours($query)
    {
        return $query->where('timestamp', '>=', now()->subHours(24));
    }

    /**
     * Scope a query to only include activities from the last 7 days.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeLast7Days($query)
    {
        return $query->where('timestamp', '>=', now()->subDays(7));
    }

    /**
     * Scope a query to only include activities from the last 30 days.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeLast30Days($query)
    {
        return $query->where('timestamp', '>=', now()->subDays(30));
    }
}
