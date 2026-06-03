<?php

namespace App\Models\Cashflow;

use App\Models\User;
use App\Models\Cashflow\BaseModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class RecurringTransaction extends BaseModel
{
    use SoftDeletes;

    protected $table = 'cf_recurring_transactions';

    protected $guarded = [
        'id',
        'workspace_id',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected $fillable = [
        'workspace_id',
        'wallet_id',
        'category_id',
        'type',
        'title',
        'amount',
        'description',
        'frequency',
        'day_of_month',
        'day_of_week',
        'start_date',
        'end_date',
        'last_executed_at',
        'next_execution_at',
        'is_active',
        'metadata',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'start_date' => 'date',
        'end_date' => 'date',
        'last_executed_at' => 'date',
        'next_execution_at' => 'date',
        'metadata' => 'array',
        'is_active' => 'boolean',
    ];

    public function wallet()
    {
        return $this->belongsTo(Wallet::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}