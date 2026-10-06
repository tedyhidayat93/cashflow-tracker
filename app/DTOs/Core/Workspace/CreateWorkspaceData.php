<?php

namespace App\DTOs\Core\Workspace;

readonly class CreateWorkspaceData
{
    public function __construct(
        public string $name,
        public int $ownerId,
    ) {}
}