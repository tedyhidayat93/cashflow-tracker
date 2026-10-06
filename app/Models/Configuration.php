<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use App\Traits\Models\HasAuditColumns;
use Illuminate\Database\Eloquent\SoftDeletes;

class Configuration extends Model
{
    use HasFactory;
    use HasAuditColumns;
    use SoftDeletes;

    protected $fillable = [
        'configuration_group_id',
        'key',
        'label',
        'description',
        'value',
        'default_value',
        'type',
        'options',
        'is_required',
        'is_public',
        'is_encrypted',
        'sort_order',
        'created_by',
        'updated_by',
        'deleted_by'
    ];

    protected $casts = [
        'options' => 'array',
        'is_required' => 'boolean',
        'is_public' => 'boolean',
        'is_encrypted' => 'boolean',
    ];

    public function group()
    {
        return $this->belongsTo(ConfigurationGroup::class);
    }

}