<?php

namespace App\DTOs\Cashflow\Transfer;

final class CreateTransferData
{
    public function __construct(
        public readonly int $fromWalletId,
        public readonly int $toWalletId,
        public readonly float $amount,
        public readonly string $transferDate,
        public readonly float $fee = 0,
        public readonly ?string $title = null,
        public readonly ?string $referenceNumber = null,
        public readonly ?string $description = null,
    ) {
    }
}
