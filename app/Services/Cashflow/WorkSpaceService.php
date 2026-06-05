<?php

namespace App\Services\Cashflow;

use App\DTOs\Cashflow\Workspace\CreateWorkspaceData;
use App\DTOs\Cashflow\Workspace\UpdateWorkspaceData;
use App\Models\Cashflow\Workspace;
use App\Models\Cashflow\WorkspaceUser;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;

class WorkspaceService
{
    public function __construct(
        protected ActivityLogService $activityLogService
    ) {}

    /**
     * Create workspace.
     */
    public function create(
        CreateWorkspaceData $data
    ): Workspace {
        return DB::transaction(function () use ($data) {

            /*
            |--------------------------------------------------------------------------
            | Create Workspace
            |--------------------------------------------------------------------------
            */
            $workspace = Workspace::create([
                'name' => $data->name,
                'owner_id' => $data->ownerId,
                'is_active' => true,
            ]);

            /*
            |--------------------------------------------------------------------------
            | Attach Owner
            |--------------------------------------------------------------------------
            */
            WorkspaceUser::create([
                'workspace_id' => $workspace->id,
                'user_id' => $data->ownerId,
                'joined_at' => now(),
                'is_active' => true,
            ]);

            /*
            |--------------------------------------------------------------------------
            | Set Current Workspace
            |--------------------------------------------------------------------------
            */
            User::query()
                ->whereKey($data->ownerId)
                ->update([
                    'current_workspace_id' => $workspace->id,
                ]);

            /*
            |--------------------------------------------------------------------------
            | Assign Owner Role
            |--------------------------------------------------------------------------
            */
            $owner = User::findOrFail(
                $data->ownerId
            );

            $role = Role::query()
                ->where('name', 'owner')
                ->first();

            if ($role) {
                $owner->assignRole($role);
            }

            /*
            |--------------------------------------------------------------------------
            | Activity Log
            |--------------------------------------------------------------------------
            */
            $this->activityLogService->created(
                $workspace,
                'Workspace berhasil dibuat'
            );

            return $workspace;
        });
    }

    /**
     * Update workspace.
     */
    public function update(
        Workspace $workspace,
        UpdateWorkspaceData $data
    ): Workspace {

        $old = $workspace->only([
            'name',
        ]);

        $workspace->update([
            'name' => $data->name,
        ]);

        $this->activityLogService->updated(
            subject: $workspace,
            oldValues: $old,
            newValues: $workspace->fresh()->only([
                'name',
            ]),
            description: 'Workspace diperbarui'
        );

        return $workspace->fresh();
    }

    /**
     * Archive workspace.
     */
    public function archive(
        Workspace $workspace
    ): void {

        $workspace->update([
            'is_active' => false,
        ]);

        $this->activityLogService->log(
            event: 'workspace.archived',
            subject: $workspace,
            description: 'Workspace diarsipkan'
        );
    }

    /**
     * Restore workspace.
     */
    public function activate(
        Workspace $workspace
    ): void {

        $workspace->update([
            'is_active' => true,
        ]);

        $this->activityLogService->log(
            event: 'workspace.activated',
            subject: $workspace,
            description: 'Workspace diaktifkan'
        );
    }

    /**
     * Switch active workspace.
     */
    public function switchWorkspace(
        User $user,
        Workspace $workspace
    ): void {

        $exists = WorkspaceUser::query()
            ->where('workspace_id', $workspace->id)
            ->where('user_id', $user->id)
            ->exists();

        if (! $exists) {
            abort(
                403,
                'Anda bukan anggota workspace ini.'
            );
        }

        $user->update([
            'current_workspace_id' => $workspace->id,
        ]);

        $this->activityLogService->log(
            event: 'workspace.switched',
            subject: $workspace,
            description: 'Berpindah workspace'
        );
    }

    /**
     * Delete workspace.
     */
    public function delete(
        Workspace $workspace
    ): void {

        $this->activityLogService->deleted(
            $workspace,
            'Workspace dihapus'
        );

        $workspace->delete();
    }

    /**
    * Add member to workspace.
    */
    public function addMember(
        Workspace $workspace,
        User $user,
        ?int $roleId = null
    ): WorkspaceUser {

        return DB::transaction(function () use (
            $workspace,
            $user,
            $roleId
        ) {

            $exists = WorkspaceUser::query()
                ->where('workspace_id', $workspace->id)
                ->where('user_id', $user->id)
                ->exists();

            if ($exists) {
                throw ValidationException::withMessages([
                    'user' => 'User sudah menjadi anggota workspace.'
                ]);
            }

            $workspaceUser = WorkspaceUser::create([
                'workspace_id' => $workspace->id,
                'user_id' => $user->id,
                'role_id' => $roleId,
                'joined_at' => now(),
                'is_active' => true,
            ]);

            if ($roleId) {

                $role = Role::findOrFail(
                    $roleId
                );

                $user->syncRoles([
                    $role
                ]);
            }

            $this->activityLogService->created(
                $workspaceUser,
                sprintf(
                    '%s bergabung ke workspace %s',
                    $user->email,
                    $workspace->name
                )
            );

            return $workspaceUser;
        });
    }

    /**
    * Remove member from workspace.
    */
    public function removeMember(
        WorkspaceUser $workspaceUser
    ): void {

        DB::transaction(function () use (
            $workspaceUser
        ) {

            if (
                $workspaceUser->workspace->owner_id ===
                $workspaceUser->user_id
            ) {
                throw ValidationException::withMessages([
                    'user' => 'Owner workspace tidak dapat dihapus.'
                ]);
            }

            $this->activityLogService->deleted(
                $workspaceUser,
                sprintf(
                    'Menghapus anggota %s dari workspace',
                    $workspaceUser->user->email
                )
            );

            $workspaceUser->delete();
        });
    }

    /**
    * Change member role in workspace.
    */
    public function changeMemberRole(
        WorkspaceUser $workspaceUser,
        int $roleId
    ): WorkspaceUser {

        return DB::transaction(function () use (
            $workspaceUser,
            $roleId
        ) {

            $oldRole = $workspaceUser->role?->name;

            $role = Role::findOrFail(
                $roleId
            );

            $workspaceUser->update([
                'role_id' => $role->id,
            ]);

            $workspaceUser
                ->user
                ->syncRoles([
                    $role
                ]);

            $this->activityLogService->custom(
                event: 'workspace.member.role.changed',
                subject: $workspaceUser,
                description: sprintf(
                    'Role anggota diubah dari %s menjadi %s',
                    $oldRole ?? '-',
                    $role->name
                )
            );

            return $workspaceUser->fresh();
        });
    }

    /**
    * Activate member in workspace.
    */
    public function activateMember(
        WorkspaceUser $workspaceUser
    ): WorkspaceUser {

        return DB::transaction(function () use (
            $workspaceUser
        ) {

            $workspaceUser->update([
                'is_active' => true,
            ]);

            $this->activityLogService->custom(
                event: 'workspace.member.activated',
                subject: $workspaceUser,
                description: sprintf(
                    'Mengaktifkan anggota %s',
                    $workspaceUser->user->email
                )
            );

            return $workspaceUser->fresh();
        });
    }

    /**
    * Deactivate member from workspace.
    */
    public function deactivateMember(
        WorkspaceUser $workspaceUser
    ): WorkspaceUser {

        return DB::transaction(function () use (
            $workspaceUser
        ) {

            if (
                $workspaceUser->workspace->owner_id ===
                $workspaceUser->user_id
            ) {
                throw ValidationException::withMessages([
                    'user' => 'Owner workspace tidak dapat dinonaktifkan.'
                ]);
            }

            $workspaceUser->update([
                'is_active' => false,
            ]);

            $this->activityLogService->custom(
                event: 'workspace.member.deactivated',
                subject: $workspaceUser,
                description: sprintf(
                    'Menonaktifkan anggota %s',
                    $workspaceUser->user->email
                )
            );

            return $workspaceUser->fresh();
        });
    }

    
}