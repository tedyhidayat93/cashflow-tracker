<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\Models\HasAuditColumns;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProviderSetting extends Model
{
    use HasFactory;
    use HasAuditColumns;
    use SoftDeletes;

    protected $fillable = [
        'provider_id',
        'label',
        'key',
        'value',
        'default_value',
        'options',
        'type',
        'sort_order',
        'description',
        'is_required',
        'is_public',
        'is_encrypted',
        'sort_order',
        'created_by',
        'updated_by',
        'deleted_by'
    ];

    protected $casts = [
        'is_encrypted' => 'boolean',
    ];

    public function provider()
    {
        return $this->belongsTo(Provider::class);
    }
}
