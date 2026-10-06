<?php

namespace App\DTOs\Cashflow\Invitation;

use Carbon\Carbon;

readonly class CreateInvitationData
{
    public function __construct(
        public string $email,
        public ?int $roleId,
        public Carbon $expiresAt,
        public ?array $metadata = null,
    ) {}
}