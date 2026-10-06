<?php

namespace App\Services\Cashflow;

use App\DTOs\Cashflow\ActivityLog\CreateActivityLogData;
use App\Models\Cashflow\ActivityLog;
use Illuminate\Database\Eloquent\Model;

class ActivityLogService
{
    /**
     * Create activity log.
     */
    public function create(
        CreateActivityLogData $data
    ): ActivityLog {

        return ActivityLog::create([
            'workspace_id' => $data->workspaceId
                ?? $this->resolveWorkspaceId($data->subject)
                ?? current_workspace_id(),

            'user_id' => $data->userId
                ?? current_user_id(),

            'event' => $data->event,

            'subject_type' => $data->subject
                ? $data->subject->getMorphClass()
                : null,

            'subject_id' => $data->subject?->getKey(),

            'description' => $data->description,

            'properties' => $data->properties,

            'metadata' => $data->metadata,

            'ip_address' => request()->ip(),

            'user_agent' => request()->userAgent(),
        ]);
    }

    /**
     * Log created model.
     */
    public function created(
        Model $subject,
        ?string $description = null
    ): ActivityLog {

        return $this->create(
            new CreateActivityLogData(
                event: strtolower(class_basename($subject)) . '.created',
                subject: $subject,
                description: $description,
            )
        );
    }

    /**
     * Log updated model.
     */
    public function updated(
        Model $subject,
        array $oldValues = [],
        array $newValues = [],
        ?string $description = null
    ): ActivityLog {

        return $this->create(
            new CreateActivityLogData(
                event: strtolower(class_basename($subject)) . '.updated',
                subject: $subject,
                description: $description,
                properties: [
                    'old' => $oldValues,
                    'new' => $newValues,
                ]
            )
        );
    }

    /**
     * Log deleted model.
     */
    public function deleted(
        Model $subject,
        ?string $description = null
    ): ActivityLog {

        return $this->create(
            new CreateActivityLogData(
                event: strtolower(class_basename($subject)) . '.deleted',
                subject: $subject,
                description: $description,
            )
        );
    }

    /**
     * Log custom event.
     */
    public function custom(
        string $event,
        ?Model $subject = null,
        ?string $description = null,
        ?array $properties = null,
        ?array $metadata = null
    ): ActivityLog {

        return $this->create(
            new CreateActivityLogData(
                event: $event,
                subject: $subject,
                description: $description,
                properties: $properties,
                metadata: $metadata,
            )
        );
    }

    /**
     * Resolve workspace automatically.
     */
    protected function resolveWorkspaceId(
        ?Model $subject
    ): ?int {

        if (! $subject) {
            return null;
        }

        if (
            isset($subject->workspace_id)
        ) {
            return $subject->workspace_id;
        }

        return null;
    }
}