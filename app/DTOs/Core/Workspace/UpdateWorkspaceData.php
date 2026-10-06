<?php

namespace App\DTOs\Core\Workspace;

readonly class UpdateWorkspaceData
{
    public function __construct(
        public string $name,
    ) {}
}