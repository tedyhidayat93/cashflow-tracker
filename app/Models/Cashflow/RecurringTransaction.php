<?php

namespace App\Models\Cashflow;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

use App\Enums\Cashflow\TransactionType;
use App\Enums\Cashflow\TransactionStatus;
use App\Enums\Cashflow\RecurringFrequency;
use App\Enums\Cashflow\RecurringStatus;

class RecurringTransaction extends BaseModel
{
    use SoftDeletes;

    protected $table = 'cf_recurring_transactions';

    protected $guarded = [
        'id',
    ];

    protected $fillable = [
        'workspace_id',

        'wallet_id',
        'category_id',

        'type',
        'transaction_status',

        'reference_number',

        'title',

        'amount',

        'description',

        'frequency',

        'day_of_week',
        'day_of_month',

        'start_date',
        'end_date',

        'last_executed_at',
        'next_execution_at',

        'max_occurrences',
        'occurrences_count',

        'status',

        'metadata',

        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected $casts = [
        'type' => TransactionType::class,

        'transaction_status' => TransactionStatus::class,

        'frequency' => RecurringFrequency::class,

        'status' => RecurringStatus::class,

        'amount' => 'decimal:2',

        'start_date' => 'date',
        'end_date' => 'date',

        'last_executed_at' => 'datetime',
        'next_execution_at' => 'datetime',

        'max_occurrences' => 'integer',
        'occurrences_count' => 'integer',

        'metadata' => 'array',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relations
    |--------------------------------------------------------------------------
    */

    public function wallet(): BelongsTo
    {
        return $this->belongsTo(
            Wallet::class
        );
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(
            Category::class
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Helpers
    |--------------------------------------------------------------------------
    */

    public function isActive(): bool
    {
        return $this->status === RecurringStatus::ACTIVE;
    }

    public function isPaused(): bool
    {
        return $this->status === RecurringStatus::PAUSED;
    }

    public function isCompleted(): bool
    {
        return $this->status === RecurringStatus::COMPLETED;
    }

    public function isCancelled(): bool
    {
        return $this->status === RecurringStatus::CANCELLED;
    }

    public function hasReachedMaxOccurrences(): bool
    {
        if (
            $this->max_occurrences === null
        ) {
            return false;
        }

        return $this->occurrences_count >=
            $this->max_occurrences;
    }

    public function hasExpired(): bool
    {
        if (
            empty($this->end_date)
        ) {
            return false;
        }

        return now()->gt(
            $this->end_date
        );
    }
}