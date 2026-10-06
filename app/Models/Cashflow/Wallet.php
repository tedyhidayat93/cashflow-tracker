<?php

namespace App\Models\Cashflow;

use App\Models\Cashflow\BaseModel;
use App\Enums\Cashflow\WalletType;
use Illuminate\Database\Eloquent\SoftDeletes;

class Wallet extends BaseModel
{
    use SoftDeletes;

    protected $table = 'cf_wallets';

    protected $guarded = [
        'id',
        'workspace_id',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected $fillable = [
        'workspace_id',
        'name',
        'type',
        'opening_balance',
        'current_balance',
        'currency',
        'account_number',
        'bank_name',
        'icon',
        'color',
        'description',
        'is_active',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'type' => WalletType::class,
    ];

    public function transactions()
    {
        return $this->hasMany(
            Transaction::class
        );
    }

    public function outgoingTransfers()
    {
        return $this->hasMany(
            WalletTransfer::class,
            'from_wallet_id'
        );
    }

    public function incomingTransfers()
    {
        return $this->hasMany(
            WalletTransfer::class,
            'to_wallet_id'
        );
    }
}