<?php

namespace App\Services\Cashflow;

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

use App\Models\Cashflow\Wallet;
use App\Models\Cashflow\Category;
use App\Models\Cashflow\Transaction;
use App\Models\Cashflow\RecurringTransaction;

use App\Enums\Cashflow\RecurringStatus;

use App\DTOs\Cashflow\Transaction\CreateRecurringTransactionData;
use App\DTOs\Cashflow\Transaction\UpdateRecurringTransactionData;
use App\DTOs\Cashflow\Transaction\CreateTransactionData;

class RecurringTransactionService extends BaseService
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
        CreateRecurringTransactionData $data
    ): RecurringTransaction {

        return DB::transaction(function () use ($data) {

            $wallet = Wallet::workspace()
                ->findOrFail($data->walletId);

            $category = Category::workspace()
                ->findOrFail($data->categoryId);

            $recurring = RecurringTransaction::create([
                'wallet_id' => $wallet->id,
                'category_id' => $category->id,

                'type' => $data->type,
                'transaction_status' => $data->transactionStatus,

                'title' => $data->title,

                'amount' => $data->amount,

                'frequency' => $data->frequency,

                'day_of_week' => $data->dayOfWeek,
                'day_of_month' => $data->dayOfMonth,

                'start_date' => $data->startDate,
                'end_date' => $data->endDate,

                'next_execution_at' => $data->startDate,

                'reference_number' => $data->referenceNumber,

                'max_occurrences' => $data->maxOccurrences,

                'description' => $data->description,

                'metadata' => $data->metadata,

                'status' => RecurringStatus::ACTIVE,
            ]);

            $this->activityLogService->created(
                $recurring,
                sprintf(
                    'Membuat transaksi berulang %s Rp %s',
                    $data->title,
                    number_format($data->amount, 0, ',', '.')
                )
            );

            return $recurring;
        });
    }

    public function update(
        RecurringTransaction $recurring,
        UpdateRecurringTransactionData $data
    ): RecurringTransaction {

        return DB::transaction(function () use (
            $recurring,
            $data
        ) {

            $wallet = Wallet::workspace()
                ->findOrFail($data->walletId);

            $category = Category::workspace()
                ->findOrFail($data->categoryId);

            $oldValues = $recurring->only([
                'wallet_id',
                'category_id',
                'type',
                'amount',
                'frequency',
                'day_of_week',
                'day_of_month',
                'start_date',
                'end_date',
                'status',
            ]);

            $recurring->update([
                'wallet_id' => $wallet->id,
                'category_id' => $category->id,

                'type' => $data->type,
                'transaction_status' => $data->transactionStatus,

                'title' => $data->title,

                'amount' => $data->amount,

                'frequency' => $data->frequency,

                'day_of_week' => $data->dayOfWeek,
                'day_of_month' => $data->dayOfMonth,

                'start_date' => $data->startDate,
                'end_date' => $data->endDate,

                'reference_number' => $data->referenceNumber,

                'max_occurrences' => $data->maxOccurrences,

                'description' => $data->description,

                'metadata' => $data->metadata,
            ]);

            $this->activityLogService->updated(
                subject: $recurring,
                oldValues: $oldValues,
                newValues: $recurring->fresh()->only([
                    'wallet_id',
                    'category_id',
                    'type',
                    'amount',
                    'frequency',
                    'status',
                ]),
                description: 'Mengubah transaksi berulang'
            );

            return $recurring->fresh();
        });
    }

    public function delete(
        RecurringTransaction $recurring
    ): bool {

        return DB::transaction(function () use ($recurring) {

            $this->activityLogService->deleted(
                $recurring,
                sprintf(
                    'Menghapus transaksi berulang %s',
                    $recurring->title
                )
            );

            $recurring->update([
                'deleted_by' => current_user_id(),
            ]);

            return $recurring->delete();
        });
    }

    public function restore(
        RecurringTransaction $recurring
    ): RecurringTransaction {

        return DB::transaction(function () use ($recurring) {

            $recurring->restore();

            $this->activityLogService->custom(
                event: 'recurring_transaction.restored',
                subject: $recurring,
                description: sprintf(
                    'Memulihkan transaksi berulang %s',
                    $recurring->title
                )
            );

            return $recurring->fresh();
        });
    }

    public function pause(
        RecurringTransaction $recurring
    ): RecurringTransaction {

        return $this->changeStatus(
            $recurring,
            RecurringStatus::PAUSED
        );
    }

    public function resume(
        RecurringTransaction $recurring
    ): RecurringTransaction {

        return $this->changeStatus(
            $recurring,
            RecurringStatus::ACTIVE
        );
    }

    public function cancel(
        RecurringTransaction $recurring
    ): RecurringTransaction {

        return $this->changeStatus(
            $recurring,
            RecurringStatus::CANCELLED
        );
    }

    public function complete(
        RecurringTransaction $recurring
    ): RecurringTransaction {

        return $this->changeStatus(
            $recurring,
            RecurringStatus::COMPLETED
        );
    }

    public function process(
        RecurringTransaction $recurring
    ): Transaction {

        return DB::transaction(function () use ($recurring) {

            if (
                $recurring->status !== RecurringStatus::ACTIVE
            ) {
                throw new \Exception(
                    'Recurring transaction tidak aktif.'
                );
            }

            $transaction = $this->transactionService->create(
                new CreateTransactionData(
                    walletId: $recurring->wallet_id,

                    categoryId: $recurring->category_id,

                    type: $recurring->type,

                    status: $recurring->transaction_status,

                    amount: $recurring->amount,

                    transactionDate: now(),

                    description: $recurring->description,

                    referenceNo: $recurring->reference_number,
                )
            );

            $nextExecution =
                $this->calculateNextExecutionDate(
                    $recurring
                );

            $recurring->increment(
                'occurrences_count'
            );

            $recurring->update([
                'last_executed_at' => now(),
                'next_execution_at' => $nextExecution,
            ]);

            if (
                $recurring->max_occurrences !== null
                && $recurring->occurrences_count >= $recurring->max_occurrences
            ) {

                $recurring->update([
                    'status' => RecurringStatus::COMPLETED,
                ]);
            }

            if (
                $recurring->end_date
                && now()->toDateString() > $recurring->end_date->toDateString()
            ) {

                $recurring->update([
                    'status' => RecurringStatus::COMPLETED,
                ]);
            }

            return $transaction;
        });
    }

    protected function changeStatus(
        RecurringTransaction $recurring,
        RecurringStatus $status
    ): RecurringTransaction {

        return DB::transaction(function () use (
            $recurring,
            $status
        ) {

            $oldStatus = $recurring->status;

            $recurring->update([
                'status' => $status,
            ]);

            $this->activityLogService->custom(
                event: 'recurring_transaction.status_changed',
                subject: $recurring,
                description: sprintf(
                    'Mengubah status recurring dari %s menjadi %s',
                    $oldStatus->label(),
                    $status->label()
                )
            );

            return $recurring->fresh();
        });
    }

    protected function calculateNextExecutionDate(
        RecurringTransaction $recurring
    ): Carbon {

        return match ($recurring->frequency->value) {

            'daily' =>
                now()->addDay(),

            'weekly' =>
                now()->addWeek(),

            'monthly' =>
                now()->addMonth(),

            'yearly' =>
                now()->addYear(),

            default =>
                now()->addMonth(),
        };
    }
}