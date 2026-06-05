<?php

namespace App\DTOs\Cashflow\Transaction;

use Carbon\Carbon;

use App\Enums\Cashflow\TransactionType;
use App\Enums\Cashflow\TransactionStatus;
use App\Enums\Cashflow\RecurringFrequency;

readonly class CreateRecurringTransactionData
{
    public function __construct(
        public int $walletId,
        public int $categoryId,

        public TransactionType $type,
        public TransactionStatus $transactionStatus,

        public string $title,

        public float $amount,

        public RecurringFrequency $frequency,

        public Carbon $startDate,
        public ?Carbon $endDate,

        public ?int $dayOfWeek,
        public ?int $dayOfMonth,

        public ?string $referenceNumber,

        public ?int $maxOccurrences,

        public ?string $description,

        public ?array $metadata,
    ) {}
}