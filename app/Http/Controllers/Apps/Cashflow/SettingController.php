<?php

namespace App\Http\Controllers\Apps\Cashflow;

use App\DTOs\Cashflow\Workspace\UpdateWorkspaceSettingData;
use App\Http\Requests\Apps\Cashflow\UpdateSettingRequest;
use App\Models\Workspace;
use App\Services\Cashflow\WorkspaceService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    public function __construct(
        protected WorkspaceService $workspaceService,
    ) {}

    public function index(Workspace $workspace): Response
    {
        return Inertia::render('apps/cashflow/settings/index', [
            'workspace' => $this->workspacePayload($workspace),
        ]);
    }

    public function update(UpdateSettingRequest $request, Workspace $workspace): RedirectResponse
    {
        $this->workspaceService->updateSettings(
            $workspace,
            new UpdateWorkspaceSettingData(
                name: $request->string('name')->toString(),
                currency: strtoupper($request->string('currency')->toString()),
                timezone: $request->string('timezone')->toString(),
                description: $request->input('description'),
            )
        );

        return back()->with('success', 'Pengaturan modul berhasil disimpan.');
    }
}
