<?php

namespace App\DTOs\Cashflow\ActivityLog;

use Illuminate\Database\Eloquent\Model;

readonly class CreateActivityLogData
{
    public function __construct(
        public string $event,
        public ?Model $subject = null,
        public ?string $description = null,
        public ?array $properties = null,
        public ?array $metadata = null,
        public ?int $workspaceId = null,
        public ?int $userId = null,
    ) {}
}