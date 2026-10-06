<?php

namespace App\Services\Cashflow;

use App\Enums\Cashflow\TransactionType;
use App\Models\Cashflow\Transaction;
use App\Models\Workspace;
use Illuminate\Support\Carbon;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportService
{
    public function build(Workspace $workspace, ?string $dateFrom = null, ?string $dateTo = null): array
    {
        $from = $dateFrom ? Carbon::parse($dateFrom)->startOfDay() : now()->startOfMonth();
        $to = $dateTo ? Carbon::parse($dateTo)->endOfDay() : now()->endOfMonth();

        $query = Transaction::forWorkspace()
            ->with(['category:id,name,type', 'wallet:id,name'])
            ->whereBetween('transaction_date', [$from->toDateString(), $to->toDateString()]);

        $transactions = (clone $query)
            ->orderBy('transaction_date')
            ->get();

        $income = (float) (clone $query)->where('type', TransactionType::INCOME)->sum('amount');
        $expense = (float) (clone $query)->where('type', TransactionType::EXPENSE)->sum('amount');

        // Pengeluaran terbanyak / terbesar
        $topExpense = $transactions
            ->where('type', TransactionType::EXPENSE)
            ->sortByDesc('amount')
            ->first();

        // Rekap per kategori
        $byCategory = $transactions
            ->groupBy(fn (Transaction $transaction) => $transaction->category?->name ?? 'Tanpa Kategori')
            ->map(function ($items, $name) {
                $first = $items->first();

                return [
                    'category' => $name,
                    'type' => $first?->type->value,
                    'total' => (float) $items->sum('amount'),
                    'count' => $items->count(),
                ];
            })
            ->values()
            ->all();

        // Chart per kategori (Khusus Pengeluaran)
        $expenseByCategory = $transactions
            ->where('type', TransactionType::EXPENSE)
            ->groupBy(fn (Transaction $t) => $t->category?->name ?? 'Tanpa Kategori')
            ->map(fn ($items, $name) => [
                'name' => $name,
                'value' => (float) $items->sum('amount'),
            ])
            ->values()
            ->all();

        // Chart tren bulanan (Pemasukan vs Pengeluaran per Bulan)
        $monthlyTrends = $transactions
            ->groupBy(fn (Transaction $t) => Carbon::parse($t->transaction_date)->format('Y-m'))
            ->map(function ($items, $month) {
                return [
                    'month' => Carbon::createFromFormat('Y-m', $month)->translatedFormat('M Y'),
                    'income' => (float) $items->where('type', TransactionType::INCOME)->sum('amount'),
                    'expense' => (float) $items->where('type', TransactionType::EXPENSE)->sum('amount'),
                ];
            })
            ->values()
            ->all();

        return [
            'filters' => [
                'date_from' => $from->toDateString(),
                'date_to' => $to->toDateString(),
            ],
            'summary' => [
                'total_income' => $income,
                'total_expense' => $expense,
                'net' => $income - $expense,
                'transaction_count' => $transactions->count(),
                'top_expense' => $topExpense ? [
                    'title' => $topExpense->title,
                    'amount' => (float) $topExpense->amount,
                    'category' => $topExpense->category?->name,
                    'date' => $topExpense->transaction_date?->toDateString(),
                ] : null,
            ],
            'by_category' => $byCategory,
            'charts' => [
                'expense_by_category' => $expenseByCategory,
                'monthly_trends' => $monthlyTrends,
            ],
            'transactions' => $transactions->map(fn (Transaction $transaction) => [
                'id' => $transaction->id,
                'title' => $transaction->title,
                'type' => $transaction->type->value,
                'amount' => (float) $transaction->amount,
                'date' => $transaction->transaction_date?->toDateString(),
                'category' => $transaction->category?->name,
                'wallet' => $transaction->wallet?->name,
            ])->all(),
        ];
    }

    // exportCsv method tetap sama...
}