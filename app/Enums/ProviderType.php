<?php

namespace App\Enums;

enum ProviderType: string
{
    case EMAIL = 'email';
    case PAYMENT = 'payment';
    case ANALYTICS = 'analytics';
    case COMMUNICATION = 'communication';
    case AI = 'ai';

    public function label(): string
    {
        return match($this) {
            self::EMAIL => 'Email Service',
            self::PAYMENT => 'Payment Gateway',
            self::ANALYTICS => 'Analytics',
            self::COMMUNICATION => 'Communication',
            self::AI => 'Artificial Intelligence',
        };
    }

    public function icon(): string
    {
        return match($this) {
            self::EMAIL => 'heroicon-o-envelope',
            self::PAYMENT => 'heroicon-o-credit-card',
            self::ANALYTICS => 'heroicon-o-chart-bar',
            self::COMMUNICATION => 'heroicon-o-chat-bubble-left-right',
            self::AI => 'heroicon-o-sparkles',
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