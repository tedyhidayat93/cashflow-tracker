<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LogVisitor extends Model
{
    protected $fillable = [
        'action',
        'page',
        'message',
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
    protected $table = 'log_visitors';

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
}
