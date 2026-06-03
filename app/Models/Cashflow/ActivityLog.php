<?php

namespace App\Models\Cashflow;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    protected $table = 'cf_activity_logs';

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
        'event',
        'subject_type',
        'subject_id',
        'description',
        'properties',
        'ip_address',
        'user_agent',
        'metadata',
    ];

    protected $casts = [
        'properties' => 'array',
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

    public function user()
    {
        return $this->belongsTo(
            User::class
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Polymorphic Subject
    |--------------------------------------------------------------------------
    */

    public function subject()
    {
        return $this->morphTo();
    }
}