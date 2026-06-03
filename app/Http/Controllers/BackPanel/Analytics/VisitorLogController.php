<?php

namespace App\Http\Controllers\BackPanel\Analytics;

use App\Http\Controllers\Controller;
use App\Models\LogVisitor;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Gate;

class VisitorLogController extends Controller
{
    public function __construct()
    {
        // Apply permission middleware to all methods
        $this->middleware('permission:visitor-log-list')->only(['index', 'show']);
    }

    public function index(Request $request)
    {
        Gate::authorize('visitor-log-list');
        
        // Build base query with filters
        $baseQuery = LogVisitor::query()
            ->when($request->search, function ($query, $search) {
                return $query->where('page', 'like', "%{$search}%")
                    ->orWhere('ip_address', 'like', "%{$search}%")
                    ->orWhere('device', 'like', "%{$search}%")
                    ->orWhere('user_agent', 'like', "%{$search}%")
                    ->orWhere('city', 'like', "%{$search}%")
                    ->orWhere('country', 'like', "%{$search}%")
                    ->orWhere('url_path', 'like', "%{$search}%");
            })
            ->when($request->device, function ($query, $device) {
                return $query->where('device', $device);
            })
            ->when($request->action, function ($query, $action) {
                return $query->where('action', $action);
            })
            ->when($request->date_from, function ($query, $dateFrom) {
                return $query->whereDate('created_at', '>=', $dateFrom);
            })
            ->when($request->date_to, function ($query, $dateTo) {
                return $query->whereDate('created_at', '<=', $dateTo);
            });

        // Get visitor statistics with same filters
        $visitorStatistics = $this->getVisitorStatistics($baseQuery);

        // Get paginated results
        $perPage = $request->get('per_page', 50);
        $visitorLogs = $baseQuery->orderBy('created_at', 'desc')
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('backpanel/analytics/visitor-logs/index', [
            'visitorLogs' => $visitorLogs,
            'filters' => $request->only(['search', 'device', 'action', 'date_from', 'date_to', 'per_page']),
            'statistics' => $visitorStatistics,
        ]);
    }

    public function show($id)
    {
        Gate::authorize('visitor-log-list');
        
        $visitorLog = LogVisitor::findOrFail($id);
        
        return Inertia::render('backpanel/analytics/visitor-logs/show', [
            'visitorLog' => $visitorLog,
        ]);
    }

    /**
     * Get visitor statistics based on filtered query
     */
    private function getVisitorStatistics($query)
    {
        return [
            'total_visitors' => (clone $query)->count(),
            'unique_ips' => (clone $query)->distinct('ip_address')->count('ip_address'),
            'by_device' => (clone $query)->selectRaw('device, count(*) as count')
                ->groupBy('device')
                ->get()
                ->mapWithKeys(function ($item) {
                    return [$item->device => $item->count];
                }),
            'by_action' => (clone $query)->selectRaw('action, count(*) as count')
                ->groupBy('action')
                ->get()
                ->mapWithKeys(function ($item) {
                    return [$item->action => $item->count];
                }),
            'by_country' => (clone $query)->selectRaw('country, count(*) as count')
                ->whereNotNull('country')
                ->groupBy('country')
                ->orderBy('count', 'desc')
                ->limit(10)
                ->get(),
            'recent_visits' => (clone $query)->orderBy('created_at', 'desc')
                ->limit(5)
                ->get(['page', 'ip_address', 'device', 'created_at']),
        ];
    }
}
