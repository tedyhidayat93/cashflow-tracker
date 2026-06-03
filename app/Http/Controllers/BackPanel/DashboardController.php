<?php

namespace App\Http\Controllers\BackPanel;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Service;
use App\Models\Customer;
use App\Models\Order;
use App\Models\Article;
use App\Models\Testimonial;
use App\Models\LogVisitor;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('backpanel/dashboard', [
            'stats' => $this->getStats(),
            'topSearchedProducts' => $this->getTopSearchedProducts(),
            'latestProducts' => $this->getLatestProducts(),
            'recentOrders' => $this->getRecentOrders(),
            'websiteTrafficData' => $this->buildWebsiteTrafficData(),
            'countryStats' => $this->getCountryStats(),
            'regionStats' => $this->getRegionStats(),
        ]);
    }

    // ================= STATS =================
    private function getStats(): array
    {
        return [
            [
                'name' => 'Total Produk',
                'value' => Product::count(),
                'icon' => 'Package',
                'change' => '+12%',
                'changeType' => 'increase',
                'color' => 'bg-blue-500 text-white',
                'link' => '/cpanel/cms/product'
            ],
            [
                'name' => 'Total Artikel',
                'value' => Article::count(),
                'icon' => 'FileText',
                'change' => '+5%',
                'changeType' => 'increase',
                'color' => 'bg-green-500 text-white',
                'link' => '/cpanel/cms/article'
            ],
            [
                'name' => 'Total Pelanggan',
                'value' => Customer::count(),
                'icon' => 'Users',
                'change' => '+8.2%',
                'changeType' => 'increase',
                'color' => 'bg-purple-500 text-white',
                'link' => '/cpanel/crm/customer'
            ],
            [
                'name' => 'Semua Pesanan',
                'value' => Order::count(),
                'icon' => 'ShoppingCart',
                'change' => '-2.1%',
                'changeType' => 'decrease',
                'color' => 'bg-orange-500 text-white',
                'link' => '/cpanel/crm/orders'
            ],
            [
                'name' => 'Total Ulasan',
                'value' => Testimonial::count(),
                'icon' => 'StarIcon',
                'change' => '+3.5%',
                'changeType' => 'increase',
                'color' => 'bg-orange-300 text-white',
                'link' => '/cpanel/cms/testimonial'
            ],
            [
                'name' => 'Total Pengunjung',
                'value' => LogVisitor::count(),
                'icon' => 'Eye',
                'change' => '+15%',
                'changeType' => 'increase',
                'color' => 'bg-cyan-500 text-white',
                'link' => '/cpanel/analytics/visitor-logs'
            ],
        ];
    }

    // ================= PRODUCTS =================
    private function getLatestProducts()
    {
        return Product::with('category')
            ->latest()
            ->take(5)
            ->get()
            ->map(fn ($product) => [
                'id' => $product->id,
                'name' => $product->name,
                'sku' => $product->sku,
                'added' => $product->created_at->diffForHumans(),
                'status' => $product->is_active ? 'active' : 'draft',
                'edit_url' => ''
            ]);
    }

    private function getTopSearchedProducts(): array
    {
        $products = Product::with(['category', 'coverImage'])
            ->where('views', '>', 0)
            ->where('status', 'published')
            ->orderByDesc('views')
            ->take(10)
            ->get();

        if ($products->every(fn ($p) => $p->views == 0)) {
            return [];
        }

        return $products->map(fn ($product) => [
            'id' => $product->id,
            'name' => $product->name,
            'searches' => $product->views,
            'image_path' => $this->resolveImagePath($product->coverImage?->image_path)
        ])->toArray();
    }

    private function resolveImagePath(?string $path): string
    {
        if (!$path) return '/images/placeholder.png';

        if (!str_starts_with($path, '/storage/')) {
            $path = '/storage/' . ltrim($path, '/');
        }

        return file_exists(public_path($path)) ? $path : '/images/placeholder.png';
    }

    // ================= ORDERS =================
    private function getRecentOrders()
    {
        return Order::getWaitingToCheckRecentOrders();
    }

    // ================= COUNTRY & REGION =================
    private function getCountryStats(): array
    {
        return LogVisitor::selectRaw('country, COUNT(*) as visitors')
            ->whereNotNull('country')
            ->groupBy('country')
            ->orderByDesc('visitors')
            ->limit(10)
            ->get()
            ->toArray();
    }

    private function getRegionStats(): array
    {
        return LogVisitor::selectRaw('region, COUNT(*) as visitors')
            ->whereNotNull('region')
            ->groupBy('region')
            ->orderByDesc('visitors')
            ->limit(10)
            ->get()
            ->toArray();
    }

    // ================= TRAFFIC =================
    private function buildWebsiteTrafficData(): array
    {
        return [
            'today' => $this->getTodayTraffic(),
            'thisMonth' => $this->getMonthlyTraffic(),
            'last3Months' => $this->getLastMonthsTraffic(3),
            'thisYear' => $this->getYearlyTraffic(),
        ];
    }

    private function getTodayTraffic(): array
    {
        $data = LogVisitor::whereDate('timestamp', today())
            ->selectRaw('HOUR(timestamp) as hour, COUNT(*) as visitors')
            ->groupBy('hour')
            ->pluck('visitors', 'hour');

        return collect(range(0, 23))->map(fn ($hour) => [
            'time' => sprintf('%02d:00', $hour),
            'visitors' => $data[$hour] ?? 0,
        ])->toArray();
    }

    private function getMonthlyTraffic(): array
    {
        $now = now();

        $data = LogVisitor::whereMonth('timestamp', $now->month)
            ->whereYear('timestamp', $now->year)
            ->selectRaw('DAY(timestamp) as day, COUNT(*) as visitors')
            ->groupBy('day')
            ->pluck('visitors', 'day');

        return collect(range(1, $now->daysInMonth))->map(function ($day) use ($data, $now) {
            $date = Carbon::create($now->year, $now->month, $day);

            return [
                'date' => $date->format('d M'),
                'visitors' => $data[$day] ?? 0,
            ];
        })->toArray();
    }

    private function getLastMonthsTraffic(int $months): array
    {
        return collect(range(0, $months - 1))
            ->reverse()
            ->map(function ($i) {
                $month = now()->copy()->subMonths($i);

                return [
                    'date' => $month->format('M'),
                    'visitors' => LogVisitor::whereMonth('timestamp', $month->month)
                        ->whereYear('timestamp', $month->year)
                        ->count(),
                ];
            })
            ->values()
            ->toArray();
    }

    private function getYearlyTraffic(): array
    {
        return collect(range(1, 12))->map(function ($month) {
            $date = Carbon::create(now()->year, $month, 1);

            return [
                'date' => $date->format('M'),
                'visitors' => LogVisitor::whereMonth('timestamp', $month)
                    ->whereYear('timestamp', now()->year)
                    ->count(),
            ];
        })->toArray();
    }

    public function getRecentOrdersStats()
    {
        return response()->json([
            'recentOrders' =>
                Order::getWaitingToCheckRecentOrders(),
        ]);
    }
}