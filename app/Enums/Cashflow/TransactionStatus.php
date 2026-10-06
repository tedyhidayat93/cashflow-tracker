<?php

namespace App\Enums\Cashflow;

enum TransactionStatus: string
{
    case POSTED = 'posted';
    case PENDING = 'pending';
    case CANCELLED = 'cancelled';

    public function label(): string
    {
        return match ($this) {
            self::POSTED => 'Posted',
            self::PENDING => 'Pending',
            self::CANCELLED => 'Cancelled',
        };
    }
}