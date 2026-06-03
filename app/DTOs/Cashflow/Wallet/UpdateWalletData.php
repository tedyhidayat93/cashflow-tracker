<?php

namespace App\DTOs\Cashflow\Wallet;

readonly class UpdateWalletData
{
    public function __construct(
        public string $name,
        public string $type,
        public string $currency = 'IDR',
        public ?string $accountNumber = null,
        public ?string $bankName = null,
        public ?string $description = null,
        public bool $isActive = true,
    ) {}
}