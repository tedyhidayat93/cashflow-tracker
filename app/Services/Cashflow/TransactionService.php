<?php

namespace App\Services\Cashflow;

use App\Services\Cashflow\ActivityLogService;
use App\Services\Cashflow\TransactionAttachmentService;
use App\DTOs\Cashflow\Transaction\CreateTransactionData;
use App\DTOs\Cashflow\Transaction\UpdateTransactionData;
use App\Models\Cashflow\Transaction;
use App\Models\Cashflow\Wallet;
use App\Models\Cashflow\Category;
use App\Enums\Cashflow\TransactionType;
use App\Enums\Cashflow\TransactionStatus;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\DB;

class TransactionService extends BaseService
{
   public function __construct(
        ActivityLogService $activityLogService,
        protected WalletService $walletService,
        protected TransactionAttachmentService $attachmentService,
        // TODO: protected BudgetService $budgetService,

    )
    {
        parent::__construct(
            $activityLogService
        );
    }

    public function create(
        CreateTransactionData $data
    ): Transaction {

        return DB::transaction(function () use ($data) {


            $wallet = Wallet::workspace()
                ->lockForUpdate()   
                ->findOrFail(
                    $data->walletId
                );

            if (
                $data->type === TransactionType::EXPENSE
                && $wallet->current_balance < $data->amount
            ) {
                throw ValidationException::withMessages([
                    'amount' => 'Saldo wallet tidak mencukupi.'
                ]);
            }

            $category = Category::workspace()
                ->findOrFail($data->categoryId);

            $transaction = Transaction::create([
                'wallet_id' => $wallet->id,
                'category_id' => $category->id,

                'type' => $data->type,
                'status' => $data->status,

                'amount' => $data->amount,

                'transaction_date' => $data->transactionDate,

                'description' => $data->description,

                'reference_no' => $data->referenceNo,
            ]);

            $this->applyTransaction(
                $wallet,
                $data->type,
                $data->status,
                $data->amount
            );

            $this->activityLogService->created(
                $transaction,
                sprintf(
                    'Membuat transaksi %s Rp %s (%s)',
                    $transaction->type->label(),
                    number_format($transaction->amount, 0, ',', '.'),
                    $transaction->category->name
                )
            );

            return $transaction;
        }); 
    }

    public function update(
        Transaction $transaction,
        UpdateTransactionData $data
    ): Transaction {

        return DB::transaction(function () use (
            $transaction,
            $data
        ) {

            $this->ensureWorkspaceOwnership(
                $transaction
            );

            $wallet = $transaction->wallet;

            $oldValues = $transaction->only([
                'category_id',
                'type',
                'status',
                'amount',
                'transaction_date',
                'description',
                'reference_no',
            ]);

            /*
            |--------------------------------------------------------------------------
            | Rollback transaksi lama
            |--------------------------------------------------------------------------
            */
            $this->rollbackTransaction(
                $transaction
            );

            /*
            |--------------------------------------------------------------------------
            | Validasi saldo setelah rollback
            |--------------------------------------------------------------------------
            */
            if (
                $data->status === TransactionStatus::POSTED
                && $data->type === TransactionType::EXPENSE
                && $wallet->fresh()->current_balance < $data->amount
            ) {
                throw ValidationException::withMessages([
                    'amount' => 'Saldo wallet tidak mencukupi.'
                ]);
            }

            /*
            |--------------------------------------------------------------------------
            | Update transaksi
            |--------------------------------------------------------------------------
            */
            $category = Category::workspace()
                ->findOrFail($data->categoryId);
            $transaction->update([
                'category_id' => $category->id,

                'type' => $data->type,
                'status' => $data->status,

                'amount' => $data->amount,

                'transaction_date' => $data->transactionDate,

                'description' => $data->description,

                'reference_no' => $data->referenceNo,
            ]);

            /*
            |--------------------------------------------------------------------------
            | Apply transaksi baru
            |--------------------------------------------------------------------------
            */
            $this->applyTransaction(
                $wallet->fresh(),
                $data->type,
                $data->status,
                $data->amount
            );

            $this->activityLogService->updated(
                subject: $transaction,
                oldValues: $oldValues,
                newValues: $transaction
                    ->fresh()
                    ->only([
                        'category_id',
                        'type',
                        'status',
                        'amount',
                        'transaction_date',
                        'description',
                        'reference_no',
                    ]),
                description: 'Mengubah transaksi'
            );

            return $transaction->fresh();
        });
    }

    public function delete(
        Transaction $transaction
    ): void {

        DB::transaction(function () use (
            $transaction
        ) {

            $this->ensureWorkspaceOwnership(
                $transaction
            );

            $this->rollbackTransaction(
                $transaction
            );

            foreach (
                $transaction->attachments as $attachment
            ) {
                $this->attachmentService->delete(
                    $attachment
                );
            }

            $this->activityLogService->deleted(
                $transaction,
                sprintf(
                    'Menghapus transaksi %s Rp %s (%s)',
                    $transaction->type->label(),
                    number_format($transaction->amount, 0, ',', '.'),
                    $transaction->category->name
                )
            );

            $transaction->update([
                'deleted_by' => current_user_id(),
            ]);

            $transaction->delete();
        });
    }

    public function restore(
        Transaction $transaction
    ): Transaction {

        return DB::transaction(function () use (
            $transaction
        ) {

            $this->ensureWorkspaceOwnership(
                $transaction
            );

            if (! $transaction->trashed()) {
                return $transaction;
            }

            if (
                $transaction->type === TransactionType::EXPENSE
                && $transaction->wallet->current_balance < $transaction->amount
            ) {
                throw ValidationException::withMessages([
                    'amount' => 'Saldo wallet tidak mencukupi untuk restore transaksi.'
                ]);
            }

            $transaction->restore();

            $this->applyTransaction(
                $transaction->wallet,
                $transaction->type,
                $transaction->status,
                $transaction->amount
            );

            $this->activityLogService->custom(
                event: 'transaction.restored',
                subject: $transaction,
                description: sprintf(
                    'Memulihkan transaksi %s Rp %s (%s)',
                    $transaction->type->label(),
                    number_format($transaction->amount, 0, ',', '.'),
                    $transaction->category->name
                )
            );

            return $transaction->fresh();
        });
    }

    public function changeStatus(
        Transaction $transaction,
        TransactionStatus $newStatus
    ): Transaction {

        $this->ensureWorkspaceOwnership($transaction);

        return DB::transaction(function () use (
            $transaction,
            $newStatus
        ) {

            $oldStatus = $transaction->status;

            /*
            |--------------------------------------------------------------------------
            | Tidak ada perubahan
            |--------------------------------------------------------------------------
            */
            if ($oldStatus === $newStatus) {
                return $transaction;
            }

            /*
            |--------------------------------------------------------------------------
            | Rollback status lama
            |--------------------------------------------------------------------------
            */
            if (
                $oldStatus === TransactionStatus::POSTED
            ) {
                $this->rollbackTransaction(
                    $transaction
                );
            }

            /*
            |--------------------------------------------------------------------------
            | Apply status baru
            |--------------------------------------------------------------------------
            */
            if (
                $newStatus === TransactionStatus::POSTED
                && $transaction->type === TransactionType::EXPENSE
                && $transaction->wallet->fresh()->current_balance < $transaction->amount
            ) {
                throw ValidationException::withMessages([
                    'amount' => 'Saldo wallet tidak mencukupi.'
                ]);
            }

            if (
                $newStatus === TransactionStatus::POSTED
            ) {
                $this->applyTransaction(
                    $transaction->wallet,
                    $transaction->type,
                    $newStatus,
                    $transaction->amount
                );
            }

            /*
            |--------------------------------------------------------------------------
            | Update status
            |--------------------------------------------------------------------------
            */
            $transaction->update([
                'status' => $newStatus,
            ]);

            /*
            |--------------------------------------------------------------------------
            | Activity Log
            |--------------------------------------------------------------------------
            */
            $this->activityLogService->custom(
                event: 'transaction.status.changed',
                subject: $transaction,
                description: sprintf(
                    'Mengubah status transaksi %s dari %s menjadi %s',
                    $transaction->reference_no ?? "#{$transaction->id}",
                    $oldStatus->label(),
                    $newStatus->label()
                ),
                properties: [
                    'old_status' => $oldStatus->value,
                    'new_status' => $newStatus->value,
                ]
            );

            return $transaction->fresh();
        });
    }

    private function rollbackTransaction(Transaction $transaction): void
    {
        if ($transaction->status !== TransactionStatus::POSTED) {
            return;
        }

        $wallet = $transaction->wallet;

        if ($transaction->type === TransactionType::INCOME) {
            $this->walletService->decrementBalance(
                $wallet,
                $transaction->amount
            );
        }

        if ($transaction->type === TransactionType::EXPENSE) {
            $this->walletService->incrementBalance(
                $wallet,
                $transaction->amount
            );
        }
    }

    private function applyTransaction(
        Wallet $wallet,
        TransactionType $type,
        TransactionStatus $status,
        float $amount
    ): void {

        if ($status !== TransactionStatus::POSTED) {
            return;
        }

        if ($type === TransactionType::INCOME) {
            $this->walletService->incrementBalance(
                $wallet,
                $amount
            );
        }

        if ($type === TransactionType::EXPENSE) {
            $this->walletService->decrementBalance(
                $wallet,
                $amount
            );
        }
    }

    private function ensureWorkspaceOwnership(
        Transaction $transaction
    ): void {

        if (
            $transaction->workspace_id !== current_workspace_id()
        ) {
            abort(403);
        }
    }
}