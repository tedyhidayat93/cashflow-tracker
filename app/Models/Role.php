<?php

namespace App\Models;

use Spatie\Permission\Models\Role as SpatieRole;
use App\Enums\AppIdentifier;

class Role extends SpatieRole
{
    protected $fillable = [
        'code',
        'type',
        'app_prefix',
        'name',
        'guard_name',
        'description',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_default' => 'boolean',
        'app_prefix' => AppIdentifier::class
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeInactive($query)
    {
        return $query->where('is_active', false);
    }
}
