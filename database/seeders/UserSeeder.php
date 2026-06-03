<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'name' => 'System Super Admin',
                'email' => 's4dmin@alumodasinergi.com',
                'password' => 'passwordsuperadmin',
                'role' => 'Super Admin',
            ],
            [
                'name' => 'System Admin',
                'email' => 'admin@alumodasinergi.com',
                'password' => 'passwordadmin',
                'role' => 'Admin',
            ],
            [
                'name' => 'Fika',
                'email' => 'fika@alumodasinergi.com',
                'password' => 'passwordfika',
                'role' => 'Admin',
            ],
            [
                'name' => 'Sidiq',
                'email' => 'sidiq@alumodasinergi.com',
                'password' => 'passwordowner',
                'role' => 'Owner',
            ],
            [
                'name' => 'Halo ASKI',
                'email' => 'halo_aski@alumodasinergi.com',
                'password' => 'passwordhaloaski',
                'role' => 'Admin',
            ],
            // [
            //     'name' => 'Editor',
            //     'email' => 'editor@alumodasinergi.com',
            //     'password' => 'passwordeditor',
            //     'role' => 'Editor',
            // ],
            // [
            //     'name' => 'User',
            //     'email' => 'user@alumodasinergi.com',
            //     'password' => 'passworduser',
            //     'role' => 'User',
            // ],
        ];

        foreach ($users as $userData) {

            $user = User::firstOrCreate(
                ['email' => $userData['email']],
                [
                    'name' => $userData['name'],
                    'password' => Hash::make($userData['password']),
                    'email_verified_at' => now(),
                    'is_active' => true,
                ]
            );

            // 🔥 assign role (hindari duplicate)
            if (!$user->hasRole($userData['role'])) {
                $user->assignRole($userData['role']);
            }
        }
    }
}