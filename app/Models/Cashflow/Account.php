<?php

namespace App\Models\Cashflow;

use App\Models\Cashflow\BaseModel;
use App\Models\User;
use App\Enums\Cashflow\AccountType;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Account extends BaseModel
{
    protected $table = 'cf_accounts';

    protected $fillable = [
        'workspace_id',
        'code',
        'name',
        'type',
        'description',
        'is_active',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'type' => AccountType::class,
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}