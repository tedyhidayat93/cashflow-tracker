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
}