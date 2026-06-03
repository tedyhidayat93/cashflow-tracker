<?php

namespace App\Enums\Cashflow;

enum WalletTransferStatus: string
{
    case DRAFT = 'draft';
    case POSTED = 'posted';
    case CANCELLED = 'cancelled';

    public function label(): string
    {
        return match ($this) {
            self::DRAFT => 'Draft',
            self::POSTED => 'Posted',
            self::CANCELLED => 'Dibatalkan',
        };
    }
}