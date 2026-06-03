<?php

use App\Models\Cashflow\Workspace;

if (! function_exists('current_workspace_id')) {
    function current_workspace_id(): ?int
    {
        return auth()->user()?->current_workspace_id;
    }
}

if (! function_exists('current_workspace')) {
    function current_workspace(): ?Workspace
    {
        $workspaceId = current_workspace_id();

        if (! $workspaceId) {
            return null;
        }

        return Workspace::find($workspaceId);
    }
}

if (! function_exists('has_workspace')) {
    function has_workspace(): bool
    {
        return ! is_null(
            current_workspace_id()
        );
    }
}