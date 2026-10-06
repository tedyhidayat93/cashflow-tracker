<?php

namespace Database\Seeders;

use App\Enums\AppIdentifier;
use App\Enums\UserStatus;
use App\Models\User;
use App\Models\Workspace as ModelsWorkspace;
use App\Models\WorkspaceApp;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\PermissionRegistrar;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Super Admin (Global - workspace_id = 0)
        app(PermissionRegistrar::class)->setPermissionsTeamId(0);

        $superAdmin = User::firstOrCreate(
            ['email' => 's4dmin@aturduit.com'],
            [
                'name' => 'System Super Admin',
                'password' => Hash::make('passwordsuperadmin'),
                'email_verified_at' => now(),
                'status' => UserStatus::ACTIVE,
            ]
        );

        if (!$superAdmin->hasRole('Super Admin')) {
            $superAdmin->assignRole('Super Admin');
        }

        // 2. User Tedy
        $owner = User::firstOrCreate(
            ['email' => 'tedy@gmail.com'],
            [
                'name' => 'Tedy Hidayat',
                'password' => Hash::make('passwordtedy'),
                'email_verified_at' => now(),
                'status' => UserStatus::ACTIVE,
            ]
        );

        // 3. Workspace Utama: tedybrenndaworkspace
        $workspace = ModelsWorkspace::firstOrCreate(
            ['slug' => 'tedybrenndaworkspace'],
            [
                'owner_id'    => $owner->id,
                'name'        => 'tedybrenndaworkspace',
                'description' => 'Workspace area kerja bersama Tedy & Brenda',
                'currency'    => 'IDR',
                'timezone'    => 'Asia/Jakarta',
                'is_active'   => true,
            ]
        );

        // 4. Daftarkan App Cashflow
        WorkspaceApp::firstOrCreate([
            'workspace_id' => $workspace->id,
            'app_prefix'   => AppIdentifier::CASHFLOW,
        ], [
            'is_active'     => true,
            'subscribed_at' => now(),
        ]);

        // 5. User Brenda
        $brenda = User::firstOrCreate(
            ['email' => 'brenda@gmail.com'],
            [
                'name' => 'Brenda',
                'password' => Hash::make('passwordbrenda'),
                'email_verified_at' => now(),
                'status' => UserStatus::ACTIVE,
            ]
        );

        $members = [
            $owner->id => 'Cashflow Owner',
            $brenda->id => 'Cashflow Admin',
        ];

        foreach ($members as $userId => $roleName) {
            if (!$workspace->users()->where('user_id', $userId)->exists()) {
                $workspace->users()->attach($userId, [
                    'joined_at'  => now(),
                    'is_active'  => true,
                    'invited_by' => $owner->id,
                ]);
            }

            User::where('id', $userId)->update([
                'current_workspace_id' => $workspace->id,
            ]);
        }

        // 6. Assign Roles terikat Workspace
        app(PermissionRegistrar::class)->setPermissionsTeamId($workspace->id);

        if (!$owner->hasRole('Cashflow Owner')) {
            $owner->assignRole('Cashflow Owner');
        }

        if (!$brenda->hasRole('Cashflow Admin')) {
            $brenda->assignRole('Cashflow Admin');
        }
    }
}