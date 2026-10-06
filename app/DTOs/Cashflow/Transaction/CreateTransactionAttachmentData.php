<?php

namespace App\DTOs\Cashflow\Transaction;

use Illuminate\Http\UploadedFile;

readonly class CreateTransactionAttachmentData
{
    public function __construct(
        public int $transactionId,
        public UploadedFile $file,
    ) {}
}