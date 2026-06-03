<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Frontend\HomepageController;

// Test route for visitor tracking debugging
Route::get('/test-tracking', function (Request $request) {
    // Clear cache to ensure fresh tracking
    \Cache::flush();
    
    // Log test start
    \Log::info('=== TEST TRACKING START ===');
    
    // Test tracking directly
    $controller = new HomepageController();
    $controller->trackPageVisit($request, 'Test Homepage');
    
    // Check if data was saved
    $visitorCount = \App\Models\LogVisitor::count();
    $todayVisitors = \App\Models\LogVisitor::whereDate('timestamp', now())->count();
    
    return response()->json([
        'message' => 'Test tracking completed',
        'total_visitors' => $visitorCount,
        'today_visitors' => $todayVisitors,
        'request_info' => [
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'is_crawler' => class_exists('Jaybizzle\LaravelCrawlerDetect\Facades\LaravelCrawlerDetect') 
                ? \Jaybizzle\LaravelCrawlerDetect\Facades\LaravelCrawlerDetect::isCrawler() 
                : 'N/A',
        ],
        'cache_status' => [
            'visitor_cache' => \Cache::has('visitor_' . $request->ip() . '_' . md5('Test Homepage')),
        ]
    ]);
});

// Test route to check recent visitors
Route::get('/check-visitors', function () {
    $visitors = \App\Models\LogVisitor::latest()
        ->limit(5)
        ->get(['id', 'page', 'ip_address', 'device', 'city', 'country', 'timestamp']);
    
    return response()->json([
        'recent_visitors' => $visitors,
        'total_count' => \App\Models\LogVisitor::count(),
    ]);
});
