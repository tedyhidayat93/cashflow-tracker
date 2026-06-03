<?php

namespace App\Models\Cashflow;

use App\Models\User;
use App\Models\Cashflow\BaseModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class WalletTransfer extends BaseModel
{
    use SoftDeletes;

    protected $table = 'cf_wallet_transfers';

    protected $guarded = [
        'id',
        'workspace_id',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected $fillable = [
        'workspace_id',
        'from_wallet_id',
        'to_wallet_id',
        'amount',
        'fee',
        'reference_number',
        'title',
        'description',
        'transfer_date',
        'metadata',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'fee' => 'decimal:2',
        'transfer_date' => 'date',
        'metadata' => 'array',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function fromWallet()
    {
        return $this->belongsTo(
            Wallet::class,
            'from_wallet_id'
        );
    }

    public function toWallet()
    {
        return $this->belongsTo(
            Wallet::class,
            'to_wallet_id'
        );
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

    public function expenseTransaction(): BelongsTo
    {
        return $this->belongsTo(
            Transaction::class,
            'expense_transaction_id'
        );
    }

    public function incomeTransaction(): BelongsTo
    {
        return $this->belongsTo(
            Transaction::class,
            'income_transaction_id'
        );
    }

    public function feeTransaction(): BelongsTo
    {
        return $this->belongsTo(
            Transaction::class,
            'fee_transaction_id'
        );
    }
}