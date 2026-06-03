<?php

namespace App\DTOs\Cashflow\WalletTransfer;

use Carbon\Carbon;

readonly class UpdateWalletTransferData
{
    public function __construct(
        public int $fromWalletId,
        public int $toWalletId,

        public float $amount,
        public float $fee = 0,

        public ?string $referenceNumber = null,
        public ?string $title = null,
        public ?string $description = null,

        public Carbon $transferDate,

        public ?array $metadata = null,
    ) {}
}