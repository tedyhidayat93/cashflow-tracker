<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\Models\HasAuditColumns;
use Illuminate\Database\Eloquent\SoftDeletes;

class ConfigurationGroup extends Model
{
    use HasFactory;
    use HasAuditColumns;
    use SoftDeletes;
    
    protected $fillable = [
        'name',
        'description',
        'code',
        'icon',
        'sort_order',
        'created_by',
        'updated_by',
        'deleted_by'
    ];

    public function configurations()
    {
        return $this->hasMany(Configuration::class);
    }
}
