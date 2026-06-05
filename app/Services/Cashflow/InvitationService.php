<?php

namespace App\Services\Cashflow;

use Throwable;
use App\Models\User;
use App\Models\Cashflow\Invitation;
use App\Models\Cashflow\Workspace;

use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

use App\Enums\Cashflow\InvitationStatus;

use App\Services\Cashflow\ActivityLogService;
use App\Services\Cashflow\WorkspaceService;
use App\DTOs\Cashflow\Invitation\CreateInvitationData;
use App\DTOs\Cashflow\Invitation\AcceptInvitationData;

class InvitationService extends BaseService
{
    public function __construct(
        ActivityLogService $activityLogService,
        protected WorkspaceService $workspaceService
    ) {
        parent::__construct(
            $activityLogService
        );
    }

    public function create(
        CreateInvitationData $data
    ): Invitation {

        return DB::transaction(function () use ($data) {

            $workspace = current_workspace();

            /*
            |--------------------------------------------------------------------------
            | Email sudah menjadi member workspace
            |--------------------------------------------------------------------------
            */
            $alreadyMember =
                $workspace
                    ->users()
                    ->where(
                        'email',
                        $data->email
                    )
                    ->exists();

            if ($alreadyMember) {
                throw ValidationException::withMessages([
                    'email' => 'User sudah menjadi anggota workspace.'
                ]);
            }

            /*
            |--------------------------------------------------------------------------
            | Invitation pending sebelumnya
            |--------------------------------------------------------------------------
            */
            $pendingInvitation =
                Invitation::query()
                    ->where(
                        'workspace_id',
                        $workspace->id
                    )
                    ->where(
                        'email',
                        $data->email
                    )
                    ->where(
                        'status',
                        InvitationStatus::PENDING
                    )
                    ->exists();

            if ($pendingInvitation) {
                throw ValidationException::withMessages([
                    'email' => 'Undangan masih aktif.'
                ]);
            }

            $invitation = Invitation::create([
                'workspace_id' => $workspace->id,

                'email' => $data->email,

                'token' => Str::uuid(),

                'role_id' => $data->roleId,

                'status' => InvitationStatus::PENDING,

                'expires_at' => $data->expiresAt,

                'invited_by' => current_user_id(),

                'metadata' => $data->metadata,
            ]);

            $this->activityLogService->created(
                $invitation,
                sprintf(
                    'Mengundang %s ke workspace',
                    $invitation->email
                )
            );

            /*
            |--------------------------------------------------------------------------
            | TODO
            |--------------------------------------------------------------------------
            |
            | Dispatch email invitation
            |
            */
            // SendInvitationMail::dispatch($invitation);

            return $invitation;
        });
    }

    public function accept(
        AcceptInvitationData $data
    ) {

        return DB::transaction(function () use ($data) {

            $invitation = $this->findByToken(
                $data->token
            );

            /*
            |--------------------------------------------------------------------------
            | Status harus pending
            |--------------------------------------------------------------------------
            */
            if (
                $invitation->status !== InvitationStatus::PENDING
            ) {
                throw ValidationException::withMessages([
                    'token' => 'Invitation tidak valid.'
                ]);
            }

            /*
            |--------------------------------------------------------------------------
            | Expired
            |--------------------------------------------------------------------------
            */
            if (
                $invitation->expires_at->isPast()
            ) {

                $invitation->update([
                    'status' => InvitationStatus::EXPIRED,
                ]);

                throw ValidationException::withMessages([
                    'token' => 'Invitation telah kedaluwarsa.'
                ]);
            }

            $user = User::findOrFail(
                $data->userId
            );

            /*
            |--------------------------------------------------------------------------
            | Email harus sama
            |--------------------------------------------------------------------------
            */
            if (
                strtolower($user->email)
                !== strtolower($invitation->email)
            ) {
                throw ValidationException::withMessages([
                    'email' => 'Email tidak sesuai dengan invitation.'
                ]);
            }

            /*
            |--------------------------------------------------------------------------
            | Workspace User
            |--------------------------------------------------------------------------
            */
            $workspaceUser =
                $this->workspaceService->addMember(
                    workspace: $invitation->workspace,
                    user: $user,
                    roleId: $invitation->role_id,
                );

            $invitation->update([
                'status' => InvitationStatus::ACCEPTED,
                'accepted_at' => now(),
                'accepted_by' => $user->id,
            ]);

            $this->activityLogService->custom(
                event: 'invitation.accepted',
                subject: $invitation,
                description: sprintf(
                    '%s menerima invitation workspace',
                    $user->email
                )
            );

            return $workspaceUser;
        });
    }

    public function reject(
        Invitation $invitation,
        User $user
    ): Invitation {

        return DB::transaction(function () use (
            $invitation,
            $user
        ) {

            if (
                $invitation->status !== InvitationStatus::PENDING
            ) {
                throw ValidationException::withMessages([
                    'invitation' => 'Invitation tidak dapat ditolak.'
                ]);
            }

            $invitation->update([
                'status' => InvitationStatus::REJECTED,
                'rejected_at' => now(),
            ]);

            $this->activityLogService->custom(
                event: 'invitation.rejected',
                subject: $invitation,
                description: sprintf(
                    '%s menolak invitation',
                    $user->email
                )
            );

            return $invitation->fresh();
        });
    }

    public function cancel(
        Invitation $invitation
    ): Invitation {

        return DB::transaction(function () use (
            $invitation
        ) {

            if (
                $invitation->status !== InvitationStatus::PENDING
            ) {
                throw ValidationException::withMessages([
                    'invitation' => 'Invitation tidak dapat dibatalkan.'
                ]);
            }

            $invitation->update([
                'status' => InvitationStatus::CANCELLED,
            ]);

            $this->activityLogService->custom(
                event: 'invitation.cancelled',
                subject: $invitation,
                description: sprintf(
                    'Membatalkan invitation %s',
                    $invitation->email
                )
            );

            return $invitation->fresh();
        });
    }

    public function expire(
        Invitation $invitation
    ): Invitation {

        return DB::transaction(function () use (
            $invitation
        ) {

            if (
                $invitation->status !== InvitationStatus::PENDING
            ) {
                return $invitation;
            }

            $invitation->update([
                'status' => InvitationStatus::EXPIRED,
            ]);

            $this->activityLogService->custom(
                event: 'invitation.expired',
                subject: $invitation,
                description: sprintf(
                    'Invitation %s kedaluwarsa',
                    $invitation->email
                )
            );

            return $invitation->fresh();
        });
    }

    public function resend(
        Invitation $invitation
    ): Invitation {

        if (
            $invitation->status !== InvitationStatus::PENDING
        ) {
            throw ValidationException::withMessages([
                'invitation' => 'Invitation tidak dapat dikirim ulang.'
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | TODO
        |--------------------------------------------------------------------------
        |
        | Dispatch email invitation
        |
        */

        // SendInvitationMail::dispatch($invitation);

        $this->activityLogService->custom(
            event: 'invitation.resent',
            subject: $invitation,
            description: sprintf(
                'Mengirim ulang invitation ke %s',
                $invitation->email
            )
        );

        return $invitation;
    }

    public function findByToken(
        string $token
    ): Invitation {

        return Invitation::query()
            ->where(
                'token',
                $token
            )
            ->firstOrFail();
    }

    public function expirePendingInvitations(): int
    {
        $count = 0;

        Invitation::query()
            ->where(
                'status',
                InvitationStatus::PENDING
            )
            ->where(
                'expires_at',
                '<=',
                now()
            )
            ->chunkById(100, function ($items) use (&$count) {

                foreach ($items as $invitation) {

                    try {

                        $this->expire(
                            $invitation
                        );

                        $count++;

                    } catch (Throwable $e) {

                        report($e);
                    }
                }
            });

        return $count;
    }
}