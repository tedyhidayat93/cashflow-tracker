<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Permission;
use Illuminate\Support\Facades\DB;
use App\Enums\SystemScopeIdentifierType;


class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing role-permission assignments
        DB::table('role_has_permissions')->delete();

        // Get roles
        $superAdmin = Role::where('name', 'Super Admin')->first();

        // Get all permissions
        $allPermissions = Permission::all();

        // Super Admin gets all permissions
        if ($superAdmin) {
            $superAdmin->givePermissionTo($allPermissions);
        }
    }
}
