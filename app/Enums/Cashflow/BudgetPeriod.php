<?php

namespace App\Enums\Cashflow;

enum BudgetPeriod: string
{
    case WEEKLY = 'weekly';
    case MONTHLY = 'monthly';
    case QUARTERLY = 'quarterly';
    case YEARLY = 'yearly';

    public function label(): string
    {
        return match ($this) {
            self::WEEKLY => 'Mingguan',
            self::MONTHLY => 'Bulanan',
            self::QUARTERLY => 'Triwulan',
            self::YEARLY => 'Tahunan',
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