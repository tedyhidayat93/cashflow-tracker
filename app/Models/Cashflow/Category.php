<?php

namespace App\Models\Cashflow;

use App\Models\Cashflow\BaseModel;
use App\Enums\Cashflow\CategoryType;

class Category extends BaseModel
{
    protected $table = 'cf_categories';

    protected $guarded = [
        'id',
        'workspace_id',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected $fillable = [
        'workspace_id',
        'parent_id',
        'name',
        'type',
        'icon',
        'color',
        'description',
    ];

    protected $casts = [
        'type' => CategoryType::class,
        'is_active' => 'boolean',
    ];

    public function workspace()
    {
        return $this->belongsTo(Workspace::class, 'workspace_id');
    }

    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    public function budgets()
    {
        return $this->hasMany(
            Budget::class
        );
    }

    public function transactions()
    {
        return $this->hasMany(
            Transaction::class
        );
    }
}
