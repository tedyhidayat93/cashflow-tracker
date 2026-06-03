<?php

namespace App\DTOs\Cashflow\Transaction;

use App\Enums\Cashflow\TransactionStatus;
use App\Enums\Cashflow\TransactionType;

readonly class UpdateTransactionData
{
    public function __construct(
        public int $categoryId,
        public TransactionType $type,
        public float $amount,
        public string $transactionDate,
        public ?string $description = null,
        public ?string $referenceNo = null,
        public TransactionStatus $status = TransactionStatus::POSTED,
    ) {}
}