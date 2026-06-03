<?php

namespace App\Traits\Models;

use App\Models\Cashflow\Workspace;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

trait BelongsToWorkspace
{
    public function workspace(): BelongsTo
    {
        return $this->belongsTo(
            Workspace::class
        );
    }

    public function scopeWorkspace(
        Builder $query,
        ?int $workspaceId = null
    ): Builder {
        return $query->where(
            'workspace_id',
            $workspaceId ?? current_workspace_id()
        );
    }
}