<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Permission;
use Illuminate\Support\Facades\DB;

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
        $admin = Role::where('name', 'Admin')->first();
        $owner = Role::where('name', 'Owner')->first();
        $editor = Role::where('name', 'Editor')->first();
        $viewer = Role::where('name', 'Viewer')->first();

        // Get all permissions
        $allPermissions = Permission::all();

        // Super Admin gets all permissions
        if ($superAdmin) {
            $superAdmin->givePermissionTo($allPermissions);
        }

        // Admin gets most permissions except user/role/permission management
        if ($admin) {
            $adminPermissions = Permission::whereNotIn('group_name', ['authorization'])->get();
            $admin->givePermissionTo($adminPermissions);
        }

        // Owner gets view access to dashboard, order, customer, article, product, client, brand, service, testimonial, faq without delete permissions
        if ($owner) {
            $ownerPermissions = Permission::where(function ($query) {
                $query->where('group_name', 'dashboard')
                    ->orWhere('group_name', 'crm')
                    ->orWhere('group_name', 'cms')
                    ->orWhere('group_name', 'analytics');
            })
            ->where('name', 'not like', '%-delete')
            ->where('name', 'not like', '%article-%')
            ->where('name', 'not like', '%category-%')
            ->where('name', 'not like', '%service-%')
            ->where('name', 'not like', '%tag-%')
            ->get();
            $owner->givePermissionTo($ownerPermissions);
        }

        // Editor gets CMS and Dashboard permissions only
        if ($editor) {
            $editorPermissions = Permission::whereIn('group_name', ['dashboard', 'cms'])->get();
            $editor->givePermissionTo($editorPermissions);
        }
    }
}
