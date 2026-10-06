<?php

namespace App\Enums;

enum Gender: string
{
    case MALE = 'male';
    case FEMALE = 'female';
    case PREFER_NOT_TO_SAY = 'prefer_not_to_say';

    public function label(): string
    {
        return match ($this) {
            self::MALE => 'Laki-laki',
            self::FEMALE => 'Perempuan',
            self::PREFER_NOT_TO_SAY => 'Tidak ingin memberitahu',
        };
    }
}