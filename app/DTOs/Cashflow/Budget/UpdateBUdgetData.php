<?php

namespace App\DTOs\Cashflow\Budget;

use App\Enums\Cashflow\BudgetPeriod;

readonly class UpdateBudgetData
{
    public function __construct(
        public string $name,
        public float $amount,
        public BudgetPeriod $period,
        public ?string $startDate = null,
        public ?string $endDate = null,
        public bool $isActive = true,
    ) {}
}