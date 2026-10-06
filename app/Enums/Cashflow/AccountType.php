<?php

namespace App\Enums\Cashflow;

enum AccountType: string
{
    case ASSET = 'asset';
    case LIABILITY = 'liability';
    case EQUITY = 'equity';
    case REVENUE = 'revenue';
    case EXPENSE = 'expense';

    public function label(): string
    {
        return match ($this) {
            self::ASSET => 'Aset',
            self::LIABILITY => 'Liabilitas',
            self::EQUITY => 'Ekuitas',
            self::REVENUE => 'Pendapatan',
            self::EXPENSE => 'Beban',
        };
    }

    public static function options(): array
    {
        return collect(self::cases())
            ->map(fn (self $item) => [
                'value' => $item->value,
                'label' => $item->label(),
            ])
            ->values()
            ->toArray();
    }
}
