<?php

namespace App\Enums;

enum AppIdentifier: string
{
    case CASHFLOW = 'cf';

    public function label(): string
    {
        return match($this) {
            self::CASHFLOW => 'Cashflow APP',
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