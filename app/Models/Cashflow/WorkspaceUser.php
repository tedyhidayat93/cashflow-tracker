<?php

namespace App\Models\Cashflow;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class WorkspaceUser extends Model
{
    protected $table = 'cf_workspace_users';

    protected $guarded = [
        'id',
        'workspace_id',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected $fillable = [
        'workspace_id',
        'user_id',
        'joined_at',
        'is_active',
        'invited_by',
    ];

    protected $casts = [
        'joined_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function workspace()
    {
        return $this->belongsTo(
            Workspace::class
        );
    }

    public function user()
    {
        return $this->belongsTo(
            User::class
        );
    }

    public function inviter()
    {
        return $this->belongsTo(
            User::class,
            'invited_by'
        );
    }

    public function role()
    {
        return $this->belongsTo(
            Role::class
        );
    }
}