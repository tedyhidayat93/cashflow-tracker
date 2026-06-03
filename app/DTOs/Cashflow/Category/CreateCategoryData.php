<?php

namespace App\DTOs\Cashflow\Category;

use App\Enums\Cashflow\CategoryType;

readonly class CreateCategoryData
{
    public function __construct(
        public string $name,
        public CategoryType $type,
        public ?string $icon = null,
        public ?string $color = null,
        public ?string $description = null,
        public bool $isActive = true,
    ) {}
}