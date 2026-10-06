<?php

namespace App\DTOs\Cashflow\Account;

use App\Enums\Cashflow\AccountType;

readonly class CreateAccountData
{
    public function __construct(
        public string $code,
        public string $name,
        public AccountType $type,
        public ?string $description = null,
        public bool $isActive = true,
    ) {}
}
