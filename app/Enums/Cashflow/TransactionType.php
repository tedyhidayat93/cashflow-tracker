<?php

namespace App\Enums\Cashflow;

enum TransactionType: string
{
    case INCOME = 'income';
    case EXPENSE = 'expense';

    public function label(): string
    {
        return match ($this) {
            self::INCOME => 'Pemasukan',
            self::EXPENSE => 'Pengeluaran',
        };
    }

    public static function options(): array
    {
        return collect(self::cases())
            ->map(fn (self $item) => [
                'value' => $item->value,
                'label' => $item->label(),
            ])
            ->toArray();
    }
}