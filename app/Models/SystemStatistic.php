<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class SystemStatistic extends Model
{
    protected $fillable = [
        'date',
        'total_visitors',
        'page_views',
        'device_stats',
        'geo_stats',
        'page_stats',
        'orders_count',
        'inquiries_count',
    ];

    protected $casts = [
        'date' => 'date',
        'device_stats' => 'array',
        'geo_stats' => 'array',
        'page_stats' => 'array',
    ];

    /**
     * Get statistics for a specific date range
     */
    public static function getForDateRange($startDate, $endDate)
    {
        return self::whereBetween('date', [$startDate, $endDate])
            ->orderBy('date', 'desc')
            ->get();
    }

    /**
     * Get today's statistics
     */
    public static function getToday()
    {
        return self::where('date', now()->toDateString())->first();
    }

    /**
     * Get yesterday's statistics
     */
    public static function getYesterday()
    {
        return self::where('date', now()->subDay()->toDateString())->first();
    }

    /**
     * Get statistics for the last 7 days
     */
    public static function getLast7Days()
    {
        return self::where('date', '>=', now()->subDays(7))
            ->orderBy('date', 'desc')
            ->get();
    }

    /**
     * Get statistics for the last 30 days
     */
    public static function getLast30Days()
    {
        return self::where('date', '>=', now()->subDays(30))
            ->orderBy('date', 'desc')
            ->get();
    }

    /**
     * Get statistics for current month
     */
    public static function getCurrentMonth()
    {
        return self::where('date', '>=', now()->startOfMonth())
            ->orderBy('date', 'desc')
            ->get();
    }

    /**
     * Get statistics for previous month
     */
    public static function getPreviousMonth()
    {
        return self::where('date', '>=', now()->subMonth()->startOfMonth())
            ->where('date', '<=', now()->subMonth()->endOfMonth())
            ->orderBy('date', 'desc')
            ->get();
    }

    /**
     * Get statistics for current year
     */
    public static function getCurrentYear()
    {
        return self::where('date', '>=', now()->startOfYear())
            ->orderBy('date', 'desc')
            ->get();
    }

    /**
     * Aggregate visitor statistics from LogVisitor table
     */
    public static function aggregateVisitorStats($date)
    {
        $visitorStats = LogVisitor::whereDate('timestamp', $date)
            ->selectRaw('
                COUNT(*) as total_visitors,
                COUNT(DISTINCT ip_address) as unique_visitors
            ')
            ->first();

        // Aggregate device stats
        $deviceStats = LogVisitor::whereDate('timestamp', $date)
            ->whereNotNull('device')
            ->select('device', DB::raw('COUNT(*) as count'))
            ->groupBy('device')
            ->pluck('count', 'device')
            ->toArray();

        return [
            'total_visitors' => $visitorStats->total_visitors ?? 0,
            'unique_visitors' => $visitorStats->unique_visitors ?? 0,
            'device_stats' => $deviceStats,
        ];
    }

    /**
     * Aggregate activity statistics from LogActivity table
     */
    public static function aggregateActivityStats($date)
    {
        // For simplified version, we'll focus on page views from visitor data
        // Activity stats can be expanded later if needed
        return [];
    }

    /**
     * Aggregate page statistics
     */
    public static function aggregatePageStats($date)
    {
        // Get page statistics
        $pageStats = LogVisitor::whereDate('timestamp', $date)
            ->select('page', DB::raw('COUNT(*) as views'))
            ->groupBy('page')
            ->orderBy('views', 'desc')
            ->pluck('views', 'page')
            ->toArray();

        return ['page_stats' => $pageStats];
    }

    /**
     * Aggregate geographic statistics
     */
    public static function aggregateGeographicStats($date)
    {
        // Get geographic statistics (combine cities and countries)
        $geoStats = [];

        // Add cities
        $cities = LogVisitor::whereDate('timestamp', $date)
            ->whereNotNull('city')
            ->where('city', '!=', 'Unknown')
            ->select('city', DB::raw('COUNT(*) as visitors'))
            ->groupBy('city')
            ->orderBy('visitors', 'desc')
            ->limit(10)
            ->pluck('visitors', 'city')
            ->toArray();

        // Add countries
        $countries = LogVisitor::whereDate('timestamp', $date)
            ->whereNotNull('country')
            ->where('country', '!=', 'Unknown')
            ->select('country', DB::raw('COUNT(*) as visitors'))
            ->groupBy('country')
            ->orderBy('visitors', 'desc')
            ->limit(10)
            ->pluck('visitors', 'country')
            ->toArray();

        // Combine into single geo_stats array
        $geoStats = array_merge(
            array_map(function ($count) { return $count; }, $cities),
            array_map(function ($count) { return $count; }, $countries)
        );

        return ['geo_stats' => $geoStats];
    }

    /**
     * Aggregate business metrics
     */
    public static function aggregateBusinessStats($date)
    {
        // For now, return empty array - can be expanded later
        return [
            'orders_count' => 0,
            'inquiries_count' => 0,
        ];
    }

    /**
     * Create or update daily statistics
     */
    public static function createOrUpdateDailyStats($date)
    {
        $stats = self::where('date', $date)->first();

        if (!$stats) {
            $stats = new self(['date' => $date]);
        }

        // Aggregate all statistics
        $visitorStats = self::aggregateVisitorStats($date);
        $pageStats = self::aggregatePageStats($date);
        $geoStats = self::aggregateGeographicStats($date);
        $businessStats = self::aggregateBusinessStats($date);

        // Update statistics
        $stats->total_visitors = $visitorStats['total_visitors'];
        $stats->page_views = $visitorStats['total_visitors']; // Same as total visitors for now
        $stats->device_stats = $visitorStats['device_stats'];
        $stats->page_stats = $pageStats['page_stats'];
        $stats->geo_stats = $geoStats['geo_stats'];
        $stats->orders_count = $businessStats['orders_count'];
        $stats->inquiries_count = $businessStats['inquiries_count'];

        $stats->save();

        return $stats;
    }

    /**
     * Get summary statistics for dashboard
     */
    public static function getDashboardSummary()
    {
        $today = self::getToday();
        $yesterday = self::getYesterday();
        $last7Days = self::getLast7Days();
        $last30Days = self::getLast30Days();

        return [
            'today' => $today,
            'yesterday' => $yesterday,
            'last_7_days' => [
                'total_visitors' => $last7Days->sum('total_visitors'),
                'unique_visitors' => $last7Days->sum('unique_visitors'),
                'page_views' => $last7Days->sum('page_views'),
                'total_activities' => $last7Days->sum('total_activities'),
            ],
            'last_30_days' => [
                'total_visitors' => $last30Days->sum('total_visitors'),
                'unique_visitors' => $last30Days->sum('unique_visitors'),
                'page_views' => $last30Days->sum('page_views'),
                'total_activities' => $last30Days->sum('total_activities'),
            ],
        ];
    }

    /**
     * Get growth percentage compared to previous period
     */
    public function getGrowthPercentage($field, $previousValue)
    {
        if ($previousValue == 0) {
            return $this->$field > 0 ? 100 : 0;
        }

        return round((($this->$field - $previousValue) / $previousValue) * 100, 2);
    }
}
