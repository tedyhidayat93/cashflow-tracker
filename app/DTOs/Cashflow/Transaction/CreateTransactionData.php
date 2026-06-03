<?php

namespace App\DTOs\Cashflow\Transaction;

use App\Enums\Cashflow\TransactionStatus;
use App\Enums\Cashflow\TransactionType;

readonly class CreateTransactionData
{
    public function __construct(
        public int $walletId,
        public int $categoryId,
        public TransactionType $type,
        public float $amount,
        public string $transactionDate,
        public ?string $description = null,
        public ?string $referenceNo = null,
        public ?array $attachments = null,
        public TransactionStatus $status = TransactionStatus::POSTED,
    ) {}
}