<?php

namespace App\Models\Cashflow;

use App\Models\Cashflow\BaseModel;
use App\Models\User;

class Invitation extends BaseModel
{
    protected $table = 'cf_invitations';

    protected $guarded = [
        'id',
        'workspace_id',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected $fillable = [
        'workspace_id',
        'email',
        'token',
        'status',
        'expires_at',
        'accepted_at',
        'rejected_at',
        'invited_by',
        'accepted_by',
        'metadata',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'accepted_at' => 'datetime',
        'rejected_at' => 'datetime',
        'metadata' => 'array',
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

    public function inviter()
    {
        return $this->belongsTo(
            User::class,
            'invited_by'
        );
    }

    public function acceptedBy()
    {
        return $this->belongsTo(
            User::class,
            'accepted_by'
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Helpers
    |--------------------------------------------------------------------------
    */

    public function isExpired(): bool
    {
        return now()->greaterThan(
            $this->expires_at
        );
    }

    public function isPending(): bool
    {
        return $this->status === 'pending';
    }
}