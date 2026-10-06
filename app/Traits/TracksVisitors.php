<?php

namespace App\Traits;

use App\Models\LogVisitor;
use App\Models\SystemStatistic;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Jaybizzle\LaravelCrawlerDetect\Facades\LaravelCrawlerDetect;

trait TracksVisitors
{
    /**
     * Track visitor information and save to database
     * Uses efficient strategy: detailed logs for short term, aggregated stats for long term
     *
     * @param Request $request
     * @param string $action
     * @param string $page
     * @param string $message
     * @return void
     */
    protected function trackVisitor(Request $request, string $action, string $page, string $message = '')
    {
        try {
            // Debug: Log tracking attempt
            // \Log::info("Visitor tracking attempt", [
            //     'page' => $page,
            //     'action' => $action,
            //     'ip' => $request->ip(),
            //     'user_agent' => $request->userAgent(),
            // ]);

            // Skip tracking for crawlers and bots
            if (class_exists('Jaybizzle\LaravelCrawlerDetect\Facades\LaravelCrawlerDetect')) {
                if (LaravelCrawlerDetect::isCrawler()) {
                    // \Log::info("Visitor skipped: Detected as crawler", [
                    //     'ip' => $request->ip(),
                    //     'user_agent' => $request->userAgent(),
                    // ]);
                    return;
                }
            } else {
                \Log::warning("LaravelCrawlerDetect not available, skipping bot detection");
            }

            // Rate limiting: Skip if same IP visited same page recently (within 1 hour)
            $cacheKey = 'visitor_' . $request->ip() . '_' . md5($page);
            if (Cache::has($cacheKey)) {
                // \Log::info("Visitor skipped: Rate limited", [
                //     'cache_key' => $cacheKey,
                //     'ip' => $request->ip(),
                //     'page' => $page,
                // ]);
                return; // Skip duplicate tracking
            }

            // Get visitor information (minimal for performance)
            $visitorData = $this->getVisitorData($request, $action, $page, $message);

            // Debug: Log visitor data before save
            // \Log::info("Saving visitor data", [
            //     'data_keys' => array_keys($visitorData),
            //     'ip' => $visitorData['ip_address'],
            //     'page' => $visitorData['page'],
            // ]);

            // Save to log_visitors table (will be cleaned up automatically)
            $logVisitor = LogVisitor::create($visitorData);

            // Debug: Log successful save
            // \Log::info("Visitor data saved successfully", [
            //     'log_visitor_id' => $logVisitor->id,
            //     'page' => $page,
            // ]);

            // Set cache to prevent duplicate tracking for 1 hour
            Cache::put($cacheKey, true, 3600);

            // Update real-time statistics (optional, for immediate dashboard updates)
            $this->updateRealtimeStats($page);

        } catch (\Exception $e) {
            // Log detailed error for debugging
            \Log::error('Visitor tracking failed: ' . $e->getMessage(), [
                'exception' => $e,
                'page' => $page,
                'action' => $action,
                'ip' => $request->ip(),
                'trace' => $e->getTraceAsString(),
            ]);
        }
    }

    /**
     * Get visitor data from request (optimized for performance)
     *
     * @param Request $request
     * @param string $action
     * @param string $page
     * @param string $message
     * @return array
     */
    private function getVisitorData(Request $request, string $action, string $page, string $message): array
    {
        $ipAddress = $request->ip();
        $userAgent = $request->userAgent();
        
        // Get location data from IP (with caching)
        $locationData = $this->getLocationFromIP($ipAddress);
        
        // Detect device type (fast regex)
        $device = $this->detectDevice($userAgent);
        
        // Skip ISP info for performance (optional, can be enabled if needed)
        // $provider = $this->getISPInfo($ipAddress);

        return [
            'action' => $action,
            'page' => $page,
            'message' => $message,
            'ip_address' => $ipAddress,
            'provider' => 'Unknown', // Skip ISP for performance
            'device' => $device,
            'user_agent' => $userAgent,
            'latitude' => $locationData['latitude'],
            'longitude' => $locationData['longitude'],
            'city' => $locationData['city'],
            'region' => $locationData['region'],
            'country' => $locationData['country'],
            'url_path' => $request->path(),
            'http_method' => $request->method(),
            'timestamp' => now(),
        ];
    }

    /**
     * Update real-time statistics for immediate dashboard display
     *
     * @param string $page
     * @return void
     */
    private function updateRealtimeStats(string $page): void
    {
        // Update today's statistics in real-time (optional)
        $today = now()->toDateString();
        
        // Use cache for real-time stats to avoid frequent DB writes
        $cacheKey = "stats_{$today}";
        $stats = Cache::get($cacheKey, [
            'total_visitors' => 0,
            'page_stats' => [],
            'device_stats' => [],
            'geo_stats' => []
        ]);
        
        $stats['total_visitors']++;
        
        // Update page stats
        $stats['page_stats'][$page] = ($stats['page_stats'][$page] ?? 0) + 1;
        
        // Update device stats (simplified)
        $device = request()->header('User-Agent') ? 
            (preg_match('/Mobile|Android|iPhone/', request()->header('User-Agent')) ? 'phone' : 'pc') : 'pc';
        $stats['device_stats'][$device] = ($stats['device_stats'][$device] ?? 0) + 1;
        
        // Cache for 5 minutes
        Cache::put($cacheKey, $stats, 300);
    }

    /**
     * Get location information from IP address (with caching)
     *
     * @param string $ip
     * @return array
     */
    private function getLocationFromIP(string $ip): array
    {
        // Cache location data for 24 hours to improve performance
        $cacheKey = 'location_' . md5($ip);
        
        if (Cache::has($cacheKey)) {
            return Cache::get($cacheKey);
        }

        try {
            // Skip for localhost
            if (in_array($ip, ['127.0.0.1', '::1', 'localhost'])) {
                $location = [
                    'latitude' => null,
                    'longitude' => null,
                    'city' => 'Localhost',
                    'region' => 'Development',
                    'country' => 'Local',
                ];
                Cache::put($cacheKey, $location, 86400); // 24 hours
                return $location;
            }

            // Use IP geolocation service with timeout
            $context = stream_context_create([
                'http' => [
                    'timeout' => 2, // 2 seconds timeout
                ]
            ]);
            
            $response = @file_get_contents("http://ip-api.com/json/{$ip}?fields=status,country,regionName,city,lat,lon,query", false, $context);
            
            if ($response) {
                $data = json_decode($response, true);
                
                if ($data && $data['status'] === 'success') {
                    $location = [
                        'latitude' => $data['lat'] ?? null,
                        'longitude' => $data['lon'] ?? null,
                        'city' => $data['city'] ?? 'Unknown',
                        'region' => $data['regionName'] ?? 'Unknown',
                        'country' => $data['country'] ?? 'Unknown',
                    ];
                    Cache::put($cacheKey, $location, 86400); // 24 hours
                    return $location;
                }
            }
        } catch (\Exception $e) {
            \Log::error('IP geolocation failed: ' . $e->getMessage());
        }

        // Default values if geolocation fails
        $location = [
            'latitude' => null,
            'longitude' => null,
            'city' => 'Unknown',
            'region' => 'Unknown',
            'country' => 'Unknown',
        ];
        
        Cache::put($cacheKey, $location, 3600); // 1 hour for failed lookups
        return $location;
    }

    /**
     * Detect device type from user agent
     *
     * @param string $userAgent
     * @return string
     */
    private function detectDevice(string $userAgent): string
    {
        if (preg_match('/Mobile|Android|iPhone|iPad|iPod/', $userAgent)) {
            if (preg_match('/iPad|Tablet/', $userAgent)) {
                return 'tablet';
            }
            return 'phone';
        }
        
        return 'pc';
    }

    /**
     * Get ISP/Provider information from IP
     *
     * @param string $ip
     * @return string
     */
    private function getISPInfo(string $ip): string
    {
        try {
            // Skip for localhost
            if (in_array($ip, ['127.0.0.1', '::1', 'localhost'])) {
                return 'Local Network';
            }

            // You can use various services to get ISP info
            // For now, using ip-api.com which includes ISP info
            $response = @file_get_contents("http://ip-api.com/json/{$ip}?fields=status,isp,query");
            
            if ($response) {
                $data = json_decode($response, true);
                
                if ($data && $data['status'] === 'success') {
                    return $data['isp'] ?? 'Unknown';
                }
            }
        } catch (\Exception $e) {
            \Log::error('ISP detection failed: ' . $e->getMessage());
        }

        return 'Unknown';
    }

    /**
     * Track page visit (convenience method)
     * Optimized for high-traffic pages with rate limiting
     *
     * @param Request $request
     * @param string $pageName
     * @return void
     */
    protected function trackPageVisit(Request $request, string $pageName)
    {
        $this->trackVisitor($request, 'visit', $pageName, "Visited {$pageName} page");
    }

    /**
     * Track specific action (convenience method)
     * For important user actions like form submissions, orders, etc.
     *
     * @param Request $request
     * @param string $action
     * @param string $page
     * @param string $message
     * @return void
     */
    protected function trackAction(Request $request, string $action, string $page, string $message = '')
    {
        $this->trackVisitor($request, $action, $page, $message);
    }

    /**
     * Get real-time statistics from cache (for dashboard)
     * Returns cached stats without hitting database
     *
     * @return array
     */
    public function getRealtimeStats(): array
    {
        $today = now()->toDateString();
        $cacheKey = "stats_{$today}";
        
        return Cache::get($cacheKey, [
            'total_visitors' => 0,
            'page_stats' => [],
            'device_stats' => [],
            'geo_stats' => []
        ]);
    }

    /**
     * Force cleanup of old visitor logs (manual trigger)
     * Useful for testing or immediate cleanup
     *
     * @param int $daysToKeep
     * @return void
     */
    public function forceCleanupOldLogs(int $daysToKeep = 7): void
    {
        \App\Jobs\CleanupLogVisitors::dispatch($daysToKeep);
    }
}
