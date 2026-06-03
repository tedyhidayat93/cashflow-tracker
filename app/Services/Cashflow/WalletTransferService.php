<?php

namespace App\Services\Cashflow;

use App\DTOs\Cashflow\WalletTransfer\CreateWalletTransferData;
use App\DTOs\Cashflow\WalletTransfer\UpdateWalletTransferData;
use App\DTOs\Cashflow\Transaction\CreateTransactionData;

use App\Models\Cashflow\Wallet;
use App\Models\Cashflow\WalletTransfer;

use App\Enums\Cashflow\TransactionType;
use App\Enums\Cashflow\TransactionStatus;

use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class WalletTransferService extends BaseService
{
    public function __construct(
        ActivityLogService $activityLogService,
        protected TransactionService $transactionService,
    ) {
        parent::__construct(
            $activityLogService
        );
    }

    public function create(
        CreateWalletTransferData $data
    ): WalletTransfer {

        return DB::transaction(function () use ($data) {

            $fromWallet = Wallet::workspace()
                ->lockForUpdate()
                ->findOrFail(
                    $data->fromWalletId
                );

            $toWallet = Wallet::workspace()
                ->lockForUpdate()
                ->findOrFail(
                    $data->toWalletId
                );

            $this->validateWallets(
                $fromWallet,
                $toWallet
            );

            $expenseTransaction =
                $this->createExpenseTransaction(
                    $fromWallet,
                    $toWallet,
                    $data
                );

            $incomeTransaction =
                $this->createIncomeTransaction(
                    $fromWallet,
                    $toWallet,
                    $data
                );

            $feeTransaction = null;

            if ($data->fee > 0) {
                $feeTransaction =
                    $this->createFeeTransaction(
                        $fromWallet,
                        $data
                    );
            }

            $transfer = WalletTransfer::create([
                'from_wallet_id' => $fromWallet->id,
                'to_wallet_id' => $toWallet->id,

                'expense_transaction_id' => $expenseTransaction->id,
                'income_transaction_id' => $incomeTransaction->id,
                'fee_transaction_id' => $feeTransaction?->id,

                'amount' => $data->amount,
                'fee' => $data->fee,

                'reference_number' => $data->referenceNumber,

                'title' => $data->title,
                'description' => $data->description,

                'transfer_date' => $data->transferDate,

                'metadata' => $data->metadata,
            ]);

            $this->activityLogService->created(
                $transfer,
                sprintf(
                    'Transfer dana Rp %s dari %s ke %s',
                    number_format(
                        $transfer->amount,
                        0,
                        ',',
                        '.'
                    ),
                    $fromWallet->name,
                    $toWallet->name
                )
            );

            return $transfer;
        });
    }

    public function update(
        WalletTransfer $transfer,
        UpdateWalletTransferData $data
    ): WalletTransfer {

        return DB::transaction(function () use (
            $transfer,
            $data
        ) {

            $oldValues = $transfer->only([
                'from_wallet_id',
                'to_wallet_id',
                'amount',
                'fee',
                'reference_number',
                'title',
                'description',
                'transfer_date',
            ]);

            /*
            |--------------------------------------------------------------------------
            | Hapus transaksi lama
            |--------------------------------------------------------------------------
            */
            $this->deleteLinkedTransactions(
                $transfer
            );

            $fromWallet = Wallet::workspace()
                ->lockForUpdate()
                ->findOrFail(
                    $data->fromWalletId
                );

            $toWallet = Wallet::workspace()
                ->lockForUpdate()
                ->findOrFail(
                    $data->toWalletId
                );

            $this->validateWallets(
                $fromWallet,
                $toWallet
            );

            $expenseTransaction =
                $this->createExpenseTransaction(
                    $fromWallet,
                    $toWallet,
                    $data
                );

            $incomeTransaction =
                $this->createIncomeTransaction(
                    $fromWallet,
                    $toWallet,
                    $data
                );

            $feeTransaction = null;

            if ($data->fee > 0) {

                $feeTransaction =
                    $this->createFeeTransaction(
                        $fromWallet,
                        $data
                    );
            }

            $transfer->update([
                'from_wallet_id' => $fromWallet->id,
                'to_wallet_id' => $toWallet->id,

                'expense_transaction_id' => $expenseTransaction->id,
                'income_transaction_id' => $incomeTransaction->id,
                'fee_transaction_id' => $feeTransaction?->id,

                'amount' => $data->amount,
                'fee' => $data->fee,

                'reference_number' => $data->referenceNumber,

                'title' => $data->title,
                'description' => $data->description,

                'transfer_date' => $data->transferDate,

                'metadata' => $data->metadata,
            ]);

            $this->activityLogService->updated(
                subject: $transfer,
                oldValues: $oldValues,
                newValues: $transfer
                    ->fresh()
                    ->only([
                        'from_wallet_id',
                        'to_wallet_id',
                        'amount',
                        'fee',
                        'reference_number',
                        'title',
                        'description',
                        'transfer_date',
                    ]),
                description: 'Mengubah transfer dana'
            );

            return $transfer->fresh();
        });
    }

    public function delete(
        WalletTransfer $transfer
    ): bool {

        return DB::transaction(function () use (
            $transfer
        ) {

            $this->deleteLinkedTransactions(
                $transfer
            );

            $this->activityLogService->deleted(
                $transfer,
                sprintf(
                    'Menghapus transfer dana Rp %s',
                    number_format(
                        $transfer->amount,
                        0,
                        ',',
                        '.'
                    )
                )
            );

            $transfer->update([
                'deleted_by' => current_user_id(),
            ]);

            return $transfer->delete();
        });
    }

    public function restore(
        WalletTransfer $transfer
    ): WalletTransfer {

        return DB::transaction(function () use (
            $transfer
        ) {

            $transfer->restore();

            $this->transactionService->restore(
                $transfer->expenseTransaction
            );

            $this->transactionService->restore(
                $transfer->incomeTransaction
            );

            if ($transfer->feeTransaction) {

                $this->transactionService->restore(
                    $transfer->feeTransaction
                );
            }

            $this->activityLogService->custom(
                event: 'wallet_transfer.restored',
                subject: $transfer,
                description: 'Memulihkan transfer dana'
            );

            return $transfer->fresh();
        });
    }

    private function validateWallets(
        Wallet $fromWallet,
        Wallet $toWallet
    ): void {

        if (
            $fromWallet->id === $toWallet->id
        ) {
            throw ValidationException::withMessages([
                'to_wallet_id' => 'Wallet tujuan harus berbeda.'
            ]);
        }
    }

    private function deleteLinkedTransactions(
        WalletTransfer $transfer
    ): void {

        $this->transactionService->delete(
            $transfer->expenseTransaction
        );

        $this->transactionService->delete(
            $transfer->incomeTransaction
        );

        if ($transfer->feeTransaction) {

            $this->transactionService->delete(
                $transfer->feeTransaction
            );
        }
    }

    private function createExpenseTransaction(
        Wallet $fromWallet,
        Wallet $toWallet,
        CreateWalletTransferData|UpdateWalletTransferData $data
    ) {
        return $this->transactionService->create(
            new CreateTransactionData(
                walletId: $fromWallet->id,
                categoryId: transfer_out_category_id(),

                type: TransactionType::EXPENSE,
                status: TransactionStatus::POSTED,

                amount: $data->amount,

                transactionDate: $data->transferDate,

                description: sprintf(
                    'Transfer ke %s',
                    $toWallet->name
                ),

                referenceNo: $data->referenceNumber,
            )
        );
    }

    private function createIncomeTransaction(
        Wallet $fromWallet,
        Wallet $toWallet,
        CreateWalletTransferData|UpdateWalletTransferData $data
    ) {
        return $this->transactionService->create(
            new CreateTransactionData(
                walletId: $toWallet->id,
                categoryId: transfer_in_category_id(),

                type: TransactionType::INCOME,
                status: TransactionStatus::POSTED,

                amount: $data->amount,

                transactionDate: $data->transferDate,

                description: sprintf(
                    'Transfer dari %s',
                    $fromWallet->name
                ),

                referenceNo: $data->referenceNumber,
            )
        );
    }

    private function createFeeTransaction(
        Wallet $fromWallet,
        CreateWalletTransferData|UpdateWalletTransferData $data
    ) {
        return $this->transactionService->create(
            new CreateTransactionData(
                walletId: $fromWallet->id,
                categoryId: transfer_fee_category_id(),

                type: TransactionType::EXPENSE,
                status: TransactionStatus::POSTED,

                amount: $data->fee,

                transactionDate: $data->transferDate,

                description: 'Biaya transfer',

                referenceNo: $data->referenceNumber,
            )
        );
    }
}