<?php

namespace App\Services\Cashflow;

use App\DTOs\Cashflow\ActivityLog\CreateActivityLogData;
use App\DTOs\Cashflow\Wallet\CreateWalletData;
use App\DTOs\Cashflow\Wallet\UpdateWalletData;
use App\Models\Cashflow\Wallet;
use Illuminate\Support\Facades\DB;

class WalletService extends BaseService
{
    /**
     * Create wallet.
     */
    public function create(
        CreateWalletData $data
    ): Wallet {

        return DB::transaction(function () use ($data) {

            $wallet = Wallet::create([
                'name' => $data->name,
                'type' => $data->type,
                'currency' => $data->currency,

                'opening_balance' => $data->openingBalance,
                'current_balance' => $data->openingBalance,

                'account_number' => $data->accountNumber,
                'bank_name' => $data->bankName,

                'description' => $data->description,

                'is_active' => $data->isActive,
            ]);

            $this->activityLogService->created(
                $wallet,
                "Membuat wallet {$wallet->name}"
            );

            return $wallet;
        });
    }

    /**
     * Update wallet.
     */
    public function update(
        Wallet $wallet,
        UpdateWalletData $data
    ): Wallet {

        $oldValues = $wallet->only([
            'name',
            'type',
            'currency',
            'account_number',
            'bank_name',
            'description',
            'is_active',
        ]);

        $wallet->update([
            'name' => $data->name,
            'type' => $data->type,
            'currency' => $data->currency,

            'account_number' => $data->accountNumber,
            'bank_name' => $data->bankName,

            'description' => $data->description,

            'is_active' => $data->isActive,
        ]);

        $this->activityLogService->updated(
            subject: $wallet,
            oldValues: $oldValues,
            newValues: $wallet->fresh()->only([
                'name',
                'type',
                'currency',
                'account_number',
                'bank_name',
                'description',
                'is_active',
            ]),
            description: "Mengubah wallet {$wallet->name}"
        );

        return $wallet->fresh();
    }

    /**
     * Archive wallet.
     */
    public function archive(
        Wallet $wallet
    ): Wallet {

        $wallet->update([
            'is_active' => false,
        ]);

        $this->activityLogService->custom(
            event: 'wallet.archived',
            subject: $wallet,
            description: "Mengarsipkan wallet {$wallet->name}"
        );

        return $wallet->fresh();
    }

    /**
     * Activate wallet.
     */
    public function activate(
        Wallet $wallet
    ): Wallet {

        $wallet->update([
            'is_active' => true,
        ]);

        $this->activityLogService->custom(
            event: 'wallet.activated',
            subject: $wallet,
            description: "Mengaktifkan wallet {$wallet->name}"
        );

        return $wallet->fresh();
    }

    /**
     * Soft delete wallet.
     */
    public function delete(
        Wallet $wallet
    ): void {

        $this->activityLogService->deleted(
            $wallet,
            "Menghapus wallet {$wallet->name}"
        );

        $wallet->update([
            'deleted_by' => current_user_id(),
        ]);

        $wallet->delete();
    }

    /**
     * Recalculate wallet balance.
     */
    public function recalculateBalance(
        Wallet $wallet
    ): Wallet {

        $income = $wallet->transactions()
            ->where('type', 'income')
            ->sum('amount');

        $expense = $wallet->transactions()
            ->where('type', 'expense')
            ->sum('amount');

        $wallet->update([
            'current_balance' =>
                $wallet->opening_balance
                + $income
                - $expense,
        ]);

        return $wallet->fresh();
    }

    /**
     * Increase balance.
     */
    public function incrementBalance(
        Wallet $wallet,
        float $amount
    ): void {

        $wallet->increment(
            'current_balance',
            $amount
        );
    }

    /**
     * Decrease balance.
     */
    public function decrementBalance(
        Wallet $wallet,
        float $amount
    ): void {

        $wallet->decrement(
            'current_balance',
            $amount
        );
    }
}