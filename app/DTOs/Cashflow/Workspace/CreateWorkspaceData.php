<?php

namespace App\DTOs\Cashflow\Workspace;

readonly class CreateWorkspaceData
{
    public function __construct(
        public string $name,
        public int $ownerId,
    ) {}
}