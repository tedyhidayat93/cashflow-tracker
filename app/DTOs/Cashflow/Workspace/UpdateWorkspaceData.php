<?php

namespace App\DTOs\Cashflow\Workspace;

readonly class UpdateWorkspaceData
{
    public function __construct(
        public string $name,
    ) {}
}