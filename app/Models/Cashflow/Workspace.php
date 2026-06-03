<?php

namespace App\Models\Cashflow;

use Illuminate\Database\Eloquent\Model;

class Workspace extends Model
{
    protected $table = 'cf_workspaces';
    
    protected $fillable = [
        'owner_id',
        'name',
        'slug',
        'logo',
        'description',
        'currency',
        'timezone',
        'is_active',
    ];

    public function workspaceUsers()
    {
        return $this->hasMany(
            WorkspaceUser::class
        );
    }

    public function users()
    {
        return $this->belongsToMany(
            \App\Models\User::class,
            'cf_workspace_users'
        )
        ->withPivot([
            'joined_at',
            'is_active',
            'invited_by',
        ])
        ->withTimestamps();
    }
}
