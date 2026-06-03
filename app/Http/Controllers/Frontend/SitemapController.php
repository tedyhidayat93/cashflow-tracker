<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Product;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Traits\TracksVisitors;

class SitemapController extends Controller
{
    use TracksVisitors;
    /**
     * Display the sitemap page
     */
    public function index(Request $request)
    {
        // Track visitor
        $this->trackPageVisit($request, 'Sitemap');
        
        // Get all published articles
        $articles = Article::where('status', 'published')
            ->orderBy('published_at', 'desc')
            ->get(['id', 'title', 'slug', 'published_at']);

        // Get all active products
        $products = Product::where('status', 'published')
            ->orderBy('name')
            ->get(['id', 'name', 'slug', 'created_at']);

        // Navigation links from constants
        $navigation = [
            ['name' => 'Beranda', 'href' => '/'],
            ['name' => 'Layanan', 'href' => '/#services'],
            ['name' => 'Katalog Produk', 'href' => '/catalog'],
            ['name' => 'Artikel', 'href' => '/articles'],
            ['name' => 'Testimoni', 'href' => '/testimonial'],
            ['name' => 'Kontak', 'href' => '/#contact'],
            ['name' => 'Site Map', 'href' => '/sitemap'],
        ];

        return Inertia::render('frontend/sitemap', [
            'articles' => $articles ?? [],
            'products' => $products ?? [],
            'navigation' => $navigation ?? [],
            // 'debug' => [
            //     'siteconfig_from_middleware' => config('app.url'),
            //     'siteconfig_shared' => Inertia::getShared('siteconfig'),
            //     'all_shared' => Inertia::getShared(),
            // ],
        ]);
    }

    /**
     * Generate XML sitemap for search engines
     */
    public function xml()
    {
        $baseUrl = config('app.url');
        
        $sitemap = '<?xml version="1.0" encoding="UTF-8"?>';
        $sitemap .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
        
        // Add homepage
        $sitemap .= '
            <url>
                <loc>' . $baseUrl . '</loc>
                <lastmod>' . now()->toAtomString() . '</lastmod>
                <changefreq>weekly</changefreq>
                <priority>1.0</priority>
            </url>';
        
        // Add static pages
        $staticPages = [
            '/catalog',
            '/#services',
            '/#products',
            '/#articles',
            '/#contact',
            '/sitemap'
        ];
        
        foreach ($staticPages as $page) {
            $sitemap .= '
                <url>
                    <loc>' . $baseUrl . $page . '</loc>
                    <lastmod>' . now()->toAtomString() . '</lastmod>
                    <changefreq>monthly</changefreq>
                    <priority>0.8</priority>
                </url>';
        }
        
        // Add articles
        $articles = Article::where('status', 'published')->get(['slug', 'updated_at']);
        foreach ($articles as $article) {
            $sitemap .= '
                <url>
                    <loc>' . $baseUrl . '/articles/' . $article->slug . '</loc>
                    <lastmod>' . $article->updated_at->toAtomString() . '</lastmod>
                    <changefreq>monthly</changefreq>
                    <priority>0.7</priority>
                </url>';
        }
        
        // Add products
        $products = Product::where('status', 'published')->get(['slug', 'updated_at']);
        foreach ($products as $product) {
            $sitemap .= '
                <url>
                    <loc>' . $baseUrl . '/catalog/' . $product->slug . '</loc>
                    <lastmod>' . $product->updated_at->toAtomString() . '</lastmod>
                    <changefreq>monthly</changefreq>
                    <priority>0.8</priority>
                </url>';
        }
        
        // Add testimonials
        $sitemap .= '
            <url>
                <loc>' . $baseUrl . '/testimonial</loc>
                <lastmod>' . now()->toAtomString() . '</lastmod>
                <changefreq>monthly</changefreq>
                <priority>0.7</priority>
            </url>';
        
        $sitemap .= '</urlset>';
        
        return response($sitemap)
            ->header('Content-Type', 'application/xml')
            ->header('Cache-Control', 'public, max-age=3600');
    }
}