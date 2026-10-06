<?php

namespace App\Http\Controllers\Apps\Cashflow;

use App\Models\Workspace;
use App\Services\Cashflow\ReportService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportController extends Controller
{
    public function __construct(
        protected ReportService $reportService,
    ) {}

    public function index(Request $request, Workspace $workspace): Response
    {
        $report = $this->reportService->build(
            $workspace,
            $request->string('date_from')->toString() ?: null,
            $request->string('date_to')->toString() ?: null,
        );

        return Inertia::render('apps/cashflow/reports/index', [
            'workspace' => $this->workspacePayload($workspace),
            ...$report,
        ]);
    }

    public function export(Request $request, Workspace $workspace): StreamedResponse
    {
        return $this->reportService->exportCsv(
            $workspace,
            $request->string('date_from')->toString() ?: null,
            $request->string('date_to')->toString() ?: null,
        );
    }
}
