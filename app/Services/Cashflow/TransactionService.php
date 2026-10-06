<?php

namespace App\Services\Cashflow;

use App\DTOs\Cashflow\Transaction\CreateTransactionData;
use App\DTOs\Cashflow\Transaction\UpdateTransactionData;
use App\Enums\Cashflow\TransactionType;
use App\Models\Cashflow\Category;
use App\Models\Cashflow\Transaction;
use App\Models\Cashflow\Wallet;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class TransactionService extends BaseService
{
    public function __construct(
        ActivityLogService $activityLogService,
        protected WalletService $walletService,
        protected TransactionAttachmentService $attachmentService,
    ) {
        parent::__construct($activityLogService);
    }

    public function paginate(
        ?TransactionType $type = null,
        ?string $search = null,
        ?string $dateFrom = null,
        ?string $dateTo = null,
        ?int $walletId = null,
        ?int $categoryId = null,
        int $perPage = 15,
    ): LengthAwarePaginator {
        return Transaction::forWorkspace()
            ->with(['wallet:id,name', 'category:id,name,type'])
            ->when($type, fn ($query) => $query->where('type', $type))
            ->when($walletId, fn ($query) => $query->where('wallet_id', $walletId))
            ->when($categoryId, fn ($query) => $query->where('category_id', $categoryId))
            ->when($search, function ($query, $search) {
                $query->where(function ($inner) use ($search) {
                    $inner->where('title', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhere('reference_number', 'like', "%{$search}%");
                });
            })
            ->when($dateFrom, fn ($query) => $query->whereDate('transaction_date', '>=', $dateFrom))
            ->when($dateTo, fn ($query) => $query->whereDate('transaction_date', '<=', $dateTo))
            ->orderByDesc('transaction_date')
            ->orderByDesc('id')
            ->paginate($perPage)
            ->withQueryString()
            ->through(fn (Transaction $transaction) => $this->present($transaction));
    }

    public function findOrFail(int $id): Transaction
    {
        $transaction = Transaction::forWorkspace()
            ->with(['wallet', 'category', 'attachments'])
            ->findOrFail($id);

        $this->ensureWorkspaceOwnership($transaction);

        return $transaction;
    }

    public function recent(int $limit = 8): array
    {
        return Transaction::forWorkspace()
            ->with(['category:id,name'])
            ->orderByDesc('transaction_date')
            ->orderByDesc('id')
            ->limit($limit)
            ->get()
            ->map(fn (Transaction $transaction) => [
                'id' => $transaction->id,
                'title' => $transaction->title,
                'category' => $transaction->category?->name,
                'amount' => (float) $transaction->amount,
                'type' => $transaction->type->value,
                'date' => $transaction->transaction_date?->toDateString(),
            ])
            ->all();
    }

    public function create(CreateTransactionData $data): Transaction
    {
        return DB::transaction(function () use ($data) {
            $wallet = Wallet::forWorkspace()
                ->lockForUpdate()
                ->findOrFail($data->walletId);

            if (
                $data->type === TransactionType::EXPENSE
                && $wallet->current_balance < $data->amount
            ) {
                throw ValidationException::withMessages([
                    'amount' => 'Saldo wallet tidak mencukupi.',
                ]);
            }

            $category = Category::forWorkspace()->findOrFail($data->categoryId);

            $title = $data->title
                ?: $data->description
                ?: sprintf('Transaksi %s', $data->type->label());

            $transaction = Transaction::create([
                'wallet_id' => $wallet->id,
                'category_id' => $category->id,
                'type' => $data->type,
                'amount' => $data->amount,
                'title' => $title,
                'description' => $data->description,
                'reference_number' => $data->referenceNo,
                'transaction_date' => $data->transactionDate,
            ]);

            $this->applyTransaction($wallet, $data->type, $data->amount);

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

    public function update(Transaction $transaction, UpdateTransactionData $data): Transaction
    {
        return DB::transaction(function () use ($transaction, $data) {
            $this->ensureWorkspaceOwnership($transaction);

            $wallet = Wallet::forWorkspace()
                ->lockForUpdate()
                ->findOrFail($transaction->wallet_id);

            $oldValues = $transaction->only([
                'category_id',
                'type',
                'amount',
                'title',
                'transaction_date',
                'description',
                'reference_number',
            ]);

            $this->rollbackTransaction($transaction);

            if (
                $data->type === TransactionType::EXPENSE
                && $wallet->fresh()->current_balance < $data->amount
            ) {
                throw ValidationException::withMessages([
                    'amount' => 'Saldo wallet tidak mencukupi.',
                ]);
            }

            $category = Category::forWorkspace()->findOrFail($data->categoryId);

            $transaction->update([
                'category_id' => $category->id,
                'type' => $data->type,
                'amount' => $data->amount,
                'title' => $data->title ?: $transaction->title,
                'transaction_date' => $data->transactionDate,
                'description' => $data->description,
                'reference_number' => $data->referenceNo,
            ]);

            $this->applyTransaction($wallet->fresh(), $data->type, $data->amount);

            $this->activityLogService->updated(
                subject: $transaction,
                oldValues: $oldValues,
                newValues: $transaction->fresh()->only([
                    'category_id',
                    'type',
                    'amount',
                    'title',
                    'transaction_date',
                    'description',
                    'reference_number',
                ]),
                description: 'Mengubah transaksi'
            );

            return $transaction->fresh();
        });
    }

    public function delete(Transaction $transaction): void
    {
        DB::transaction(function () use ($transaction) {
            $this->ensureWorkspaceOwnership($transaction);

            $this->rollbackTransaction($transaction);

            foreach ($transaction->attachments as $attachment) {
                $this->attachmentService->delete($attachment);
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

    public function restore(Transaction $transaction): Transaction
    {
        return DB::transaction(function () use ($transaction) {
            $this->ensureWorkspaceOwnership($transaction);

            if (! $transaction->trashed()) {
                return $transaction;
            }

            if (
                $transaction->type === TransactionType::EXPENSE
                && $transaction->wallet->current_balance < $transaction->amount
            ) {
                throw ValidationException::withMessages([
                    'amount' => 'Saldo wallet tidak mencukupi untuk restore transaksi.',
                ]);
            }

            $transaction->restore();

            $this->applyTransaction(
                $transaction->wallet,
                $transaction->type,
                (float) $transaction->amount
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

    public function present(Transaction $transaction): array
    {
        $transaction->loadMissing(['wallet:id,name', 'category:id,name,type']);

        return [
            'id' => $transaction->id,
            'wallet_id' => $transaction->wallet_id,
            'category_id' => $transaction->category_id,
            'title' => $transaction->title,
            'description' => $transaction->description,
            'reference_number' => $transaction->reference_number,
            'amount' => (float) $transaction->amount,
            'type' => $transaction->type->value,
            'transaction_date' => $transaction->transaction_date?->toDateString(),
            'wallet' => $transaction->wallet ? [
                'id' => $transaction->wallet->id,
                'name' => $transaction->wallet->name,
            ] : null,
            'category' => $transaction->category ? [
                'id' => $transaction->category->id,
                'name' => $transaction->category->name,
                'type' => $transaction->category->type->value,
            ] : null,
        ];
    }

    private function rollbackTransaction(Transaction $transaction): void
    {
        $wallet = $transaction->wallet;

        if ($transaction->type === TransactionType::INCOME) {
            $this->walletService->decrementBalance($wallet, (float) $transaction->amount);
        }

        if ($transaction->type === TransactionType::EXPENSE) {
            $this->walletService->incrementBalance($wallet, (float) $transaction->amount);
        }
    }

    private function applyTransaction(Wallet $wallet, TransactionType $type, float $amount): void
    {
        if ($type === TransactionType::INCOME) {
            $this->walletService->incrementBalance($wallet, $amount);
        }

        if ($type === TransactionType::EXPENSE) {
            $this->walletService->decrementBalance($wallet, $amount);
        }
    }

    private function ensureWorkspaceOwnership(Transaction $transaction): void
    {
        if ($transaction->workspace_id !== current_workspace_id()) {
            abort(403);
        }
    }
}
