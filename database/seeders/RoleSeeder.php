<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing roles
        DB::table('roles')->delete();

        $roles = [
            [
                'name' => 'Super Admin',
                'guard_name' => 'web',
                'description' => 'Super Administrator dengan akses penuh',
                'is_active' => true,
            ],
            [
                'name' => 'Admin',
                'guard_name' => 'web',
                'description' => 'Administrator dengan akses mayoritas fitur',
                'is_active' => true,
            ],
            [
                'name' => 'Owner',
                'guard_name' => 'web',
                'description' => 'Owner Pemilik Perusahaan',
                'is_active' => true,
            ],
            [
                'name' => 'Editor',
                'guard_name' => 'web',
                'description' => 'Editor untuk konten dan artikel',
                'is_active' => true,
            ],
            [
                'name' => 'User',
                'guard_name' => 'web',
                'description' => 'User biasa dengan akses terbatas',
                'is_active' => true,
            ],
        ];

        foreach ($roles as $role) {
            Role::create($role);
        }
    }
}
