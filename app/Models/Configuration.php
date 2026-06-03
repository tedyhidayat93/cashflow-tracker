<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Configuration extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'value',
        'type',
        'label',
        'description',
        'group',
    ];

    protected $casts = [
        'value' => 'string',
        'type' => 'string',
        'label' => 'string',
        'description' => 'string',
        'group' => 'string',
    ];

    /**
     * Scope to get homepage configurations
     */
    public function scopeHomepage(Builder $query): Builder
    {
        return $query->where('group', 'view_homepage');
    }

    /**
     * Scope to get site configurations
     */
    public function scopeSite(Builder $query): Builder
    {
        return $query->where('group', 'site');
    }

    /**
     * Scope to get email configurations
     */
    public function scopeEmail(Builder $query): Builder
    {
        return $query->where('group', 'email');
    }

    /**
     * Scope to get system configurations
     */
    public function scopeSystem(Builder $query): Builder
    {
        return $query->where('group', 'system');
    }

    /**
     * Scope to get payment configurations
     */
    public function scopePayment(Builder $query): Builder
    {
        return $query->where('group', 'payment');
    }

    /**
     * Scope to get shipping configurations
     */
    public function scopeShipping(Builder $query): Builder
    {
        return $query->where('group', 'shipping');
    }

    /**
     * Scope to get other configurations
     */
    public function scopeOther(Builder $query): Builder
    {
        return $query->where('group', 'other');
    }

    /**
     * Get configuration value by key
     */
    public static function getValue(string $key, string $default = ''): string
    {
        $config = static::where('key', $key)->first();
        return $config ? $config->value : $default;
    }

    /**
     * Set configuration value
     */
    public static function setValue(string $key, string $value, string $type = 'text', string $label = '', string $description = '', string $group = 'general'): static
    {
        return static::updateOrCreate(
            ['key' => $key],
            [
                'value' => $value,
                'type' => $type,
                'label' => $label,
                'description' => $description,
                'group' => $group,
            ]
        );
    }
}