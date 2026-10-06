<?php

namespace App\Models;

use Spatie\Permission\Models\Permission as SpatiePermission;
use App\Enums\AppIdentifier;

class Permission extends SpatiePermission
{
    protected $fillable = [
        'name',
        'guard_name',
        'type',
        'code',
        'app_prefix',
        'group_name',
        'description',
        'is_default',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_default' => 'boolean',
        'app_prefix' => AppIdentifier::class
    ];

    public function scopeByGroup($query, $group)
    {
        return $query->where('group_name', $group);
    }

    public function scopeWithoutGroup($query)
    {
        return $query->whereNull('group_name');
    }

    public function scopeWithGroup($query)
    {
        return $query->whereNotNull('group_name');
    }
}
