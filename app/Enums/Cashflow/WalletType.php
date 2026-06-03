<?php

namespace App\Enums\Cashflow;

enum WalletType: string
{
    case CASH = 'cash';
    case BANK = 'bank';
    case EWALLET = 'ewallet';
    case CREDIT_CARD = 'credit_card';
    case INVESTMENT = 'investment';

    public function label(): string
    {
        return match ($this) {
            self::CASH => 'Tunai',
            self::BANK => 'Rekening Bank',
            self::EWALLET => 'E-Wallet',
            self::CREDIT_CARD => 'Kartu Kredit',
            
        };
    }

    public static function options(): array
    {
        return collect(self::cases())
            ->map(fn (self $type) => [
                'value' => $type->value,
                'label' => $type->label(),
            ])
            ->values()
            ->toArray();
    }
}