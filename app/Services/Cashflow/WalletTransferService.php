<?php

namespace App\Services\Cashflow;

use App\DTOs\Cashflow\Category\CreateCategoryData;
use App\DTOs\Cashflow\Wallet\CreateWalletTransferData;
use App\DTOs\Cashflow\Wallet\UpdateWalletTransferData;
use App\DTOs\Cashflow\Transaction\CreateTransactionData;
use App\Enums\Cashflow\CategoryType;
use App\Models\Cashflow\Wallet;
use App\Models\Cashflow\WalletTransfer;
use App\Enums\Cashflow\TransactionType;
use App\Enums\Cashflow\TransactionStatus;
use App\Models\Cashflow\Category;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class WalletTransferService extends BaseService
{
    public function __construct(
        ActivityLogService $activityLogService,
        protected TransactionService $transactionService,
        protected CategoryService $categoryService,
    ) {
        parent::__construct(
            $activityLogService
        );
    }

    public function create(
        CreateWalletTransferData $data
    ): WalletTransfer {

        return DB::transaction(function () use ($data) {

            $fromWallet = Wallet::forWorkspace()
                ->lockForUpdate()
                ->findOrFail(
                    $data->fromWalletId
                );

            $toWallet = Wallet::forWorkspace()
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

            $fromWallet = Wallet::forWorkspace()
                ->lockForUpdate()
                ->findOrFail(
                    $data->fromWalletId
                );

            $toWallet = Wallet::forWorkspace()
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

    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return WalletTransfer::query()
            ->forWorkspace()
            ->with(['fromWallet:id,name,currency', 'toWallet:id,name,currency'])
            ->when($filters['wallet_id'] ?? null, function ($q, $v) {
                $q->where(fn ($q) => $q->where('from_wallet_id', $v)->orWhere('to_wallet_id', $v));
            })
            ->when($filters['date_from'] ?? null, fn ($q, $v) => $q->whereDate('transfer_date', '>=', $v))
            ->when($filters['date_to'] ?? null, fn ($q, $v) => $q->whereDate('transfer_date', '<=', $v))
            ->when($filters['search'] ?? null, function ($q, $s) {
                $q->where(fn ($q) => $q->where('title', 'like', "%{$s}%")
                    ->orWhere('reference_number', 'like', "%{$s}%"));
            })
            ->orderByDesc('transfer_date')
            ->orderByDesc('id')
            ->paginate($perPage)
            ->withQueryString();
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
        $category = $this->getOrCreateCategory('Transfer Keluar', CategoryType::EXPENSE);

        return $this->transactionService->create(
            new CreateTransactionData(
                walletId: $fromWallet->id,
                categoryId: $category->id,

                type: TransactionType::EXPENSE,
                status: TransactionStatus::POSTED,

                amount: $data->amount,
                transactionDate: $data->transferDate,
                description: sprintf('Transfer ke %s', $toWallet->name),
                referenceNo: $data->referenceNumber,
            )
        );
    }

    private function createIncomeTransaction(
        Wallet $fromWallet,
        Wallet $toWallet,
        CreateWalletTransferData|UpdateWalletTransferData $data
    ) {
        $category = $this->getOrCreateCategory('Transfer Masuk', CategoryType::INCOME);

        return $this->transactionService->create(
            new CreateTransactionData(
                walletId: $toWallet->id,
                categoryId: $category->id,

                type: TransactionType::INCOME,
                status: TransactionStatus::POSTED,

                amount: $data->amount,
                transactionDate: $data->transferDate,
                description: sprintf('Transfer dari %s', $fromWallet->name),
                referenceNo: $data->referenceNumber,
            )
        );
    }

    private function createFeeTransaction(
        Wallet $fromWallet,
        CreateWalletTransferData|UpdateWalletTransferData $data
    ) {
        $category = $this->getOrCreateCategory('Biaya Transfer', CategoryType::EXPENSE);

        return $this->transactionService->create(
            new CreateTransactionData(
                walletId: $fromWallet->id,
                categoryId: $category->id,

                type: TransactionType::EXPENSE,
                status: TransactionStatus::POSTED,

                amount: $data->fee,
                transactionDate: $data->transferDate,
                description: 'Biaya transfer',
                referenceNo: $data->referenceNumber,
            )
        );
    }

    private function getOrCreateCategory(string $name, CategoryType $type): Category
    {
        $category = Category::forWorkspace()
            ->where('name', $name)
            ->where('type', $type->value)
            ->first();

        if ($category) {
            return $category;
        }

        // Pass semua argumen wajib atau gunakan Named Arguments yang sesuai DTO
        return $this->categoryService->create(
            new CreateCategoryData(
                parentId: null, // Argumen 1 (wajib)
                name: $name,    // Argumen 2 (wajib)
                type: $type,    // Argumen 3 (wajib bertipe CategoryType)
                description: "Kategori sistem untuk {$name}",
                isActive: true,
            )
        );
    }
}