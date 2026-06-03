<?php

namespace App\DTOs\Cashflow\Wallet;

use App\Enums\Cashflow\WalletType;

readonly class CreateWalletData
{
    public function __construct(
        public string $name,
        public WalletType $type,
        public float $openingBalance = 0,
        public string $currency = 'IDR',
        public ?string $accountNumber = null,
        public ?string $bankName = null,
        public ?string $description = null,
        public bool $isActive = true,
    ) {}
}