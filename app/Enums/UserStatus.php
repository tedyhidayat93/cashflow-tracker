<?php

namespace App\Enums;

enum UserStatus: string
{
    case PENDING = 'pending'; // User sudah dibuat tetapi belum aktivasi email / belum di-approve
    case ACTIVE = 'active'; // User dapat login dan menggunakan sistem
    case SUSPENDED = 'suspended'; // User diblokir sementara oleh admin
    case INACTIVE = 'inactive'; // User dinonaktifkan permanen atau tidak dapat login

    public function label(): string
    {
        return match ($this) {
            self::PENDING => 'Menunggu Aktivasi',
            self::ACTIVE => 'Aktif',
            self::SUSPENDED => 'Ditangguhkan',
            self::INACTIVE => 'Tidak Aktif',
        };
    }
}