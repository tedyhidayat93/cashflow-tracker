<?php

namespace App\Http\Controllers\Apps\Cashflow;

use App\Models\Workspace;
use App\Services\Cashflow\DashboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        protected DashboardService $dashboardService,
    ) {}

    public function index(Request $request, Workspace $workspace): Response
    {
        return Inertia::render(
            'apps/cashflow/dashboard/index',
            $this->dashboardService->payload(
                $workspace,
                $this->userRole($request, $workspace)
            )
        );
    }
}
