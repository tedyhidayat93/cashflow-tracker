<?php

namespace App\Models\Cashflow;

use App\Models\Cashflow\BaseModel;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Enums\Cashflow\BudgetPeriod;

class Budget extends BaseModel
{
    use SoftDeletes;

    protected $table = 'cf_budgets';

    protected $guarded = [
        'id',
        'workspace_id',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected $fillable = [
        'workspace_id',
        'category_id',
        'name',
        'amount',
        'period',
        'start_date',
        'end_date',
        'is_rollover',
        'is_active',
        'created_by',
        'updated_by',
    ];


    protected $casts = [
        'period' => BudgetPeriod::class,
        'amount' => 'decimal:2',
        'is_active' => 'boolean',
        'start_date' => 'date',
        'end_date' => 'date',
    ];
}