<?php

namespace App\Traits\Models;

use App\Models\Workspace as ModelsWorkspace;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @mixin \Illuminate\Database\Eloquent\Model
 */
trait BelongsToWorkspace
{
    public function workspace(): BelongsTo
    {
        return $this->belongsTo(ModelsWorkspace::class);
    }

    // Method 'scopeForWorkspace' diakses via 'Transaction::forWorkspace()'
    public function scopeForWorkspace(
        Builder $query,
        ?int $workspaceId = null
    ): Builder {
        return $query->where(
            'workspace_id',
            $workspaceId ?? current_workspace_id()
        );
    }
}