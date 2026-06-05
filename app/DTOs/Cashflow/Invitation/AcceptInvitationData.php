<?php

namespace App\DTOs\Cashflow\Invitation;

readonly class AcceptInvitationData
{
    public function __construct(
        public string $token,
        public int $userId,
    ) {}
}