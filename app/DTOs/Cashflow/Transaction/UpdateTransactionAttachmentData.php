<?php

namespace App\DTOs\Cashflow\Transaction;

use Illuminate\Http\UploadedFile;

readonly class UpdateTransactionAttachmentData
{
    public function __construct(
        public UploadedFile $file,
    ) {}
}