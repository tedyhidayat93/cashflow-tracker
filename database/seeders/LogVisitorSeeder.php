<?php

namespace Database\Seeders;

use App\Models\LogVisitor;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LogVisitorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing log visitors
        DB::table('log_visitors')->delete();

        $countries = [
            'Indonesia', 'United States', 'Singapore', 'Malaysia', 'Japan', 
            'Australia', 'United Kingdom', 'Germany', 'France', 'Canada'
        ];

        $regions = [
            'Jakarta', 'Surabaya', 'Bandung', 'Yogyakarta', 'Semarang',
            'Medan', 'Palembang', 'Makassar', 'Denpasar', 'Bali'
        ];

        $actions = [
            'view_product', 'view_article', 'search', 'browse_category', 
            'view_homepage', 'view_contact', 'view_about', 'view_services'
        ];

        $devices = ['phone', 'tablet', 'pc'];
        $httpMethods = ['GET', 'POST'];

        // Generate visitor data for the last 90 days
        $visitors = [];
        $startDate = now()->subDays(90);

        for ($i = 0; $i < 2000; $i++) {
            $timestamp = $startDate->copy()->addMinutes(rand(0, 90 * 24 * 60));
            
            $visitors[] = [
                'action' => $actions[array_rand($actions)],
                'page' => $this->generateRandomPage(),
                'message' => $this->generateRandomMessage(),
                'ip_address' => $this->generateRandomIP(),
                'provider' => $this->generateRandomProvider(),
                'device' => $devices[array_rand($devices)],
                'user_agent' => $this->generateRandomUserAgent(),
                'latitude' => -6.2088 + (rand(-5, 5) * 0.01),
                'longitude' => 106.8456 + (rand(-5, 5) * 0.01),
                'city' => $regions[array_rand($regions)],
                'region' => $regions[array_rand($regions)],
                'country' => $countries[array_rand($countries)],
                'url_path' => $this->generateRandomPath(),
                'http_method' => $httpMethods[array_rand($httpMethods)],
                'timestamp' => $timestamp,
                'created_at' => $timestamp,
                'updated_at' => $timestamp,
            ];
        }

        // Insert in batches for better performance
        foreach (array_chunk($visitors, 500) as $batch) {
            LogVisitor::insert($batch);
        }
    }

    private function generateRandomPage(): string
    {
        $pages = [
            '/products', '/articles', '/about', '/contact', '/services',
            '/products/laptop-gaming', '/products/smartphone', '/products/electronics',
            '/articles/technology', '/articles/business', '/articles/lifestyle'
        ];
        return $pages[array_rand($pages)];
    }

    private function generateRandomMessage(): string
    {
        $messages = [
            'User visited product page',
            'User browsed article section',
            'User searched for products',
            'User viewed homepage',
            'User accessed contact page',
            'User explored services',
            'User viewed category',
            'User checked about page'
        ];
        return $messages[array_rand($messages)];
    }

    private function generateRandomIP(): string
    {
        return sprintf(
            '%d.%d.%d',
            rand(1, 255),
            rand(1, 255),
            rand(1, 255)
        );
    }

    private function generateRandomProvider(): string
    {
        $providers = [
            'Telkomsel', 'IndiHome', 'XL Axiata', 'Smartfren', 'Tri',
            'Verizon', 'AT&T', 'T-Mobile', 'Sprint', 'Vodafone'
        ];
        return $providers[array_rand($providers)];
    }

    private function generateRandomUserAgent(): string
    {
        $userAgents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15',
            'Mozilla/5.0 (Android 11; Mobile) AppleWebKit/537.36'
        ];
        return $userAgents[array_rand($userAgents)];
    }

    private function generateRandomPath(): string
    {
        $paths = [
            '/products/category/electronics',
            '/articles/latest',
            '/search?q=laptop',
            '/products/123',
            '/articles/technology-trends',
            '/contact',
            '/about/company'
        ];
        return $paths[array_rand($paths)];
    }
}
