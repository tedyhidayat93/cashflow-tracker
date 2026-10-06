<?php

namespace App\DTOs\Cashflow\Workspace;

readonly class UpdateWorkspaceSettingData
{
    public function __construct(
        public string $name,
        public string $currency = 'IDR',
        public string $timezone = 'Asia/Jakarta',
        public ?string $description = null,
    ) {}
}
