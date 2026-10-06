<?php

namespace App\Http\Middleware;

use App\Enums\AppIdentifier;
use App\Models\Workspace;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetCurrentWorkspace
{
    public function handle(Request $request, Closure $next): Response
    {
        $workspace = $request->route('workspace');

        if (is_string($workspace) || is_numeric($workspace)) {
            $workspace = Workspace::query()
                ->where('slug', $workspace)
                ->orWhere('id', $workspace)
                ->firstOrFail();

            $request->route()?->setParameter('workspace', $workspace);
        }

        if ($workspace instanceof Workspace) {
            $user = $request->user();

            if (! $user) {
                abort(401);
            }

            $isOwner = $workspace->owner_id === $user->id;
            $isMember = $workspace->users()
                ->where('users.id', $user->id)
                ->where('workspace_users.is_active', true)
                ->exists();

            if (! $isOwner && ! $isMember) {
                abort(403, 'Anda bukan anggota workspace ini.');
            }

            if ($request->is("w/{$workspace->slug}/cf") || $request->is("w/{$workspace->slug}/cf/*")) {
                if (! $workspace->hasApp(AppIdentifier::CASHFLOW->value)) {
                    abort(403, 'Modul Cashflow tidak aktif pada workspace ini.');
                }
            }

            if ((int) $user->current_workspace_id !== (int) $workspace->id) {
                $user->forceFill([
                    'current_workspace_id' => $workspace->id,
                ])->save();
            }

            session(['active_workspace_id' => $workspace->id]);
            setPermissionsTeamId($workspace->id);
        } elseif (session()->has('active_workspace_id')) {
            setPermissionsTeamId((int) session('active_workspace_id'));
        } else {
            setPermissionsTeamId(0);
        }

        return $next($request);
    }
}