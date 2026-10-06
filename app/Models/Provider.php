<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Enums\ProviderType;
use App\Traits\Models\HasAuditColumns;
use Illuminate\Database\Eloquent\SoftDeletes;

class Provider extends Model
{
    use HasFactory;
    use HasAuditColumns;
    use SoftDeletes;

    protected $fillable = [
        'name',
        'code',
        'description',
        'type',
        'logo',
        'is_active',
        'is_default',
        'created_by',
        'updated_by',
        'deleted_by'
    ];

    protected $casts = [
        'type' => ProviderType::class,
        'is_active' => 'boolean',
        'is_default' => 'boolean',
    ];

    public function settings()
    {
        return $this->hasMany(ProviderSetting::class);
    }
}
