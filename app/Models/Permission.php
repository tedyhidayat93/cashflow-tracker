<?php

namespace App\Models;

use Spatie\Permission\Models\Permission as SpatiePermission;

class Permission extends SpatiePermission
{
    protected $fillable = [
        'name',
        'guard_name',
        'group_name',
        'description',
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
