<?php

namespace App\Enums;

enum SystemScopeIdentifierType: string
{
    case SYSTEM = 'system'; // untuk core system (superadmin)
    case WORKSPACE = 'workspace'; // untuk masing masing workspace app

    public function label(): string
    {
        return match($this) {
            self::SYSTEM => 'System',
            self::WORKSPACE => 'Workspace',
        };
    }

    public static function options(): array
    {
        return collect(self::cases())
            ->mapWithKeys(fn (self $type) => [
                $type->value => $type->label()
            ])
            ->toArray();
    }
}