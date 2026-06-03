<?php

namespace App\Models\Cashflow;

use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use App\Models\Cashflow\BaseModel;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Enums\Cashflow\TransactionType;
use App\Enums\Cashflow\TransactionStatus;


class Transaction extends BaseModel
{
    use SoftDeletes;

    protected $table = 'cf_transactions';

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
        'amount',
        'title',
        'description',
        'reference_number',
        'transaction_date',
        'metadata',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'transaction_date' => 'date',
        'metadata' => 'array',
        'type' => TransactionType::class,
        'status' => TransactionStatus::class,
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

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
        return $this->belongsTo(
            User::class,
            'created_by'
        );
    }

    public function updater()
    {
        return $this->belongsTo(
            User::class,
            'updated_by'
        );
    }

    public function attachments()
    {
        return $this->hasMany(
            TransactionAttachment::class
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Scopes
    |--------------------------------------------------------------------------
    */

    public function scopeWorkspace(
        Builder $query,
        int $workspaceId
    ): Builder {
        return $query->where(
            'workspace_id',
            $workspaceId
        );
    }

    public function scopeIncome(
        Builder $query
    ): Builder {
        return $query->where(
            'type',
            'income'
        );
    }

    public function scopeExpense(
        Builder $query
    ): Builder {
        return $query->where(
            'type',
            'expense'
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Accessors
    |--------------------------------------------------------------------------
    */

    public function getFormattedAmountAttribute(): string
    {
        return number_format(
            $this->amount,
            0,
            ',',
            '.'
        );
    }
}