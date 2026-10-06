<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use Illuminate\Support\Facades\DB;
use App\Enums\SystemScopeIdentifierType;
use App\Enums\AppIdentifier;

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
                'code' => 'sys_superadmin',
                'name' => 'Super Admin',
                'guard_name' => 'web',
                'description' => 'Super Administrator dengan akses penuh',
                'type' => SystemScopeIdentifierType::SYSTEM,
                'is_default' => true,
                'is_active' => true,
            ],
            [
                'code' => 'ws_cf_owner', // ws (workspace) cf (cashflow app prefix)
                'app_prefix' => AppIdentifier::CASHFLOW,
                'name' => 'Cashflow Owner',
                'guard_name' => 'web',
                'description' => 'Owner Pemilik Perusahaan',
                'type' => SystemScopeIdentifierType::WORKSPACE,
                'is_default' => true,
                'is_active' => true,
            ],
            [
                'code' => 'ws_cf_admin',
                'app_prefix' => AppIdentifier::CASHFLOW,
                'name' => 'Cashflow Admin',
                'guard_name' => 'web',
                'description' => 'Administrator Aplikasi Cashflow',
                'type' => SystemScopeIdentifierType::WORKSPACE,
                'is_default' => true,
                'is_active' => true,
            ],
            [
                'code' => 'ws_cf_user',
                'app_prefix' => AppIdentifier::CASHFLOW,
                'name' => 'Cashflow User',
                'guard_name' => 'web',
                'description' => 'Pengguna Aplikasi Cashflow',
                'type' => SystemScopeIdentifierType::WORKSPACE,
                'is_default' => true,
                'is_active' => true,
            ],
        ];

        foreach ($roles as $role) {
            Role::create($role);
        }
    }
}
