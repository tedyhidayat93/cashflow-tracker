<?php

namespace App\Services\Cashflow;

use App\Enums\Cashflow\TransactionType;
use App\Models\Cashflow\Transaction;
use App\Models\Workspace;
use Carbon\Carbon;

class DashboardService
{
    public function __construct(
        protected TransactionService $transactionService,
        protected WalletService $walletService,
        protected WalletTransferService $transferService,
    ) {}

    public function summary(Workspace $workspace): array
    {
        $start = now()->startOfMonth();
        $end = now()->endOfMonth();
        $previousStart = now()->subMonthNoOverflow()->startOfMonth();
        $previousEnd = now()->subMonthNoOverflow()->endOfMonth();

        $income = $this->sumByType(TransactionType::INCOME, $start, $end);
        $expense = $this->sumByType(TransactionType::EXPENSE, $start, $end);
        $previousIncome = $this->sumByType(TransactionType::INCOME, $previousStart, $previousEnd);
        $previousExpense = $this->sumByType(TransactionType::EXPENSE, $previousStart, $previousEnd);

        $currentNet = $income - $expense;
        $previousNet = $previousIncome - $previousExpense;
        $growth = $previousNet == 0.0
            ? ($currentNet > 0 ? 100 : 0)
            : round((($currentNet - $previousNet) / abs($previousNet)) * 100, 1);

        return [
            'total_balance' => $this->walletService->totalBalance(),
            'total_income' => $income,
            'total_expense' => $expense,
            'monthly_growth' => $growth,
        ];
    }

    public function payload(Workspace $workspace, string $userRole = 'member'): array
    {
        return [
            'workspace' => [
                'id' => $workspace->id,
                'name' => $workspace->name,
                'slug' => $workspace->slug,
                'currency' => $workspace->currency ?? 'IDR',
                'timezone' => $workspace->timezone ?? 'Asia/Jakarta',
            ],
            'userRole' => $userRole,
            'summary' => $this->summary($workspace),
            'wallets' => $this->walletService->options($workspace->id),
            'recentTransfers' => $this->transferService->paginate([], 5)->items(),
            'recentTransactions' => $this->transactionService->recent(),
        ];
    }

    private function sumByType(TransactionType $type, Carbon $from, Carbon $to): float
    {
        return (float) Transaction::forWorkspace()
            ->where('type', $type)
            ->whereBetween('transaction_date', [$from->toDateString(), $to->toDateString()])
            ->sum('amount');
    }
}