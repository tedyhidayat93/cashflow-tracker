<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Support\Facades\DB;

class VisitorLogPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create or update the visitor-log-list permission
        $permission = Permission::updateOrCreate(
            ['name' => 'visitor-log-list'],
            [
                'guard_name' => 'web',
                'group_name' => 'analytics',
                'description' => 'Melihat log visitor'
            ]
        );

        // Get Super Admin role
        $superAdmin = Role::where('name', 'Super Admin')->first();

        if ($superAdmin) {
            // Assign permission to Super Admin role
            $superAdmin->givePermissionTo($permission);
            $this->command->info('Permission visitor-log-list assigned to Super Admin role');
        } else {
            $this->command->error('Super Admin role not found');
        }
    }
}
