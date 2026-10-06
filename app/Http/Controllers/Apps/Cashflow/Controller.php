<?php

namespace App\Http\Controllers\Apps\Cashflow;

use App\Http\Controllers\Controller as BaseController;
use App\Models\Workspace;
use Illuminate\Http\Request;

abstract class Controller extends BaseController
{
    protected function workspacePayload(Workspace $workspace): array
    {
        return [
            'id' => $workspace->id,
            'name' => $workspace->name,
            'slug' => $workspace->slug,
            'currency' => $workspace->currency ?? 'IDR',
            'timezone' => $workspace->timezone ?? 'Asia/Jakarta',
            'description' => $workspace->description,
        ];
    }

    protected function userRole(Request $request, Workspace $workspace): string
    {
        return (int) $workspace->owner_id === (int) $request->user()?->id
            ? 'owner'
            : 'member';
    }
}
