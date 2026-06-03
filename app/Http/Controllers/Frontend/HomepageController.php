<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Client;
use App\Models\Configuration;
use App\Models\Faq;
use App\Models\Product;
use App\Models\Service;
use App\Models\Testimonial;
use App\Traits\TracksVisitors;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class HomepageController extends Controller
{
    use TracksVisitors;

    /*
    |--------------------------------------------------------------------------
    | Homepage
    |--------------------------------------------------------------------------
    */

    public function index(
        Request $request
    ): Response {

        $this->trackPageVisit(
            $request,
            'Homepage'
        );

        /*
        |--------------------------------------------------------------------------
        | Featured Products
        |--------------------------------------------------------------------------
        */
        $products = Cache::remember(
            'homepage.products',
            now()->addMinutes(30),
            function () {

                $baseQuery = Product::query()
                    ->published()
                    ->with([
                        'brand:id,name',
                        'category:id,name,slug',
                        'coverImage',
                    ]);

                /*
                |--------------------------------------------------------------------------
                | Featured Products
                |--------------------------------------------------------------------------
                */
                $featuredProducts = (clone $baseQuery)
                    ->where('is_featured', true)
                    ->orderBy('is_featured', 'desc')
                    ->orderBy('created_at', 'desc')
                    ->limit(8)
                    ->get();

                /*
                |--------------------------------------------------------------------------
                | Fallback Most Viewed
                |--------------------------------------------------------------------------
                */
                $products = $featuredProducts->isNotEmpty()
                    ? $featuredProducts
                    : (clone $baseQuery)
                        ->orderByDesc('views')
                        ->limit(8)
                        ->get();

                return $products->map(
                    fn ($product) => $this->transformProduct($product)
                );
            }
        );

        /*
        |--------------------------------------------------------------------------
        | Services
        |--------------------------------------------------------------------------
        */
        $services = Cache::remember(
            'homepage.services',
            now()->addHours(12),
            function () {

                return Service::query()
                    ->where('is_active', true)
                    ->orderBy('sequence')
                    ->get([
                        'id',
                        'name',
                        'description',
                        'image',
                    ])
                    ->map(function ($service) {

                        return [
                            'id' => $service->id,

                            'title' => $service->name,

                            'description' =>
                                $service->description ?? '',

                            'image' =>
                                $service->image
                                    ?: '/images/placeholder.png',
                        ];
                    });
            }
        );

        /*
        |--------------------------------------------------------------------------
        | Clients
        |--------------------------------------------------------------------------
        */
        $clients = Cache::remember(
            'homepage.clients',
            now()->addHours(6),
            function () {

                return Client::query()
                    ->where('is_active', true)
                    ->orderBy('sequence')
                    ->get([
                        'id',
                        'name',
                        'image',
                    ])
                    ->map(function ($client) {

                        return [
                            'id' => $client->id,

                            'name' => $client->name,

                            'logo' => $client->image
                                ? '/storage/' . $client->image
                                : '/images/placeholder.png',
                        ];
                    });
            }
        );

        /*
        |--------------------------------------------------------------------------
        | FAQs
        |--------------------------------------------------------------------------
        */
        $faqs = Cache::remember(
            'homepage.faqs',
            now()->addHours(1),
            function () {

                return Faq::query()
                    ->where('is_active', true)
                    ->orderBy('position')
                    ->orderBy('question')
                    ->get([
                        'id',
                        'question',
                        'answer',
                    ]);
            }
        );

        /*
        |--------------------------------------------------------------------------
        | Articles
        |--------------------------------------------------------------------------
        */
        $articles = Cache::remember(
            'homepage.articles',
            now()->addMinutes(20),
            function () {

                return Article::query()
                    ->published()
                    ->headline()
                    ->with([
                        'author:id,name',
                        'category:id,name',
                    ])
                    ->latest('published_at')
                    ->limit(3)
                    ->get()
                    ->map(function ($article) {

                        return [
                            'id' => $article->id,

                            'title' => $article->title,

                            'excerpt' =>
                                $article->excerpt ?? '',

                            'image' =>
                                $article->featured_image
                                    ?: '/images/placeholder.png',

                            'category' =>
                                $article->category?->name
                                    ?? 'Artikel',

                            'date' =>
                                $article->published_at?->format('d M Y')
                                    ?? '',

                            'slug' => $article->slug,
                        ];
                    });
            }
        );

        /*
        |--------------------------------------------------------------------------
        | Testimonials
        |--------------------------------------------------------------------------
        */
        $testimonials = Cache::remember(
            'homepage.testimonials',
            now()->addHours(12),
            function () {

                return Testimonial::query()
                    ->public()
                    ->ordered()
                    ->limit(4)
                    ->get([
                        'id',
                        'nama',
                        'keterangan',
                        'perusahaan',
                        'testimoni',
                        'foto_avatar',
                        'rate_star',
                    ])
                    ->map(function ($testimonial) {

                        return [
                            'id' => $testimonial->id,

                            'name' => $testimonial->nama,

                            'role' => $testimonial->keterangan,

                            'company' => $testimonial->perusahaan,

                            'content' => $testimonial->testimoni,

                            'avatar' =>
                                $testimonial->foto_avatar
                                    ?: '/images/avatar-placeholder.png',

                            'rating' => $testimonial->rate_star,
                        ];
                    });
            }
        );

        /*
        |--------------------------------------------------------------------------
        | SEO
        |--------------------------------------------------------------------------
        */
        $seo = Cache::remember(
            'homepage.seo',
            now()->addHours(12),
            fn () => $this->buildSeo()
        );

        return Inertia::render(
            'frontend/homepage',
            [
                'canRegister' => false,

                'canForgotPassword' => false,

                'products' => $products,

                'services' => $services,

                'clients' => $clients,

                'faqs' => $faqs,

                'articles' => $articles,

                'testimonials' => $testimonials,

                'seo' => $seo,
            ]
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Product Transformer
    |--------------------------------------------------------------------------
    */

    private function transformProduct(
        Product $product
    ): array {

        return [
            'id' => $product->id,

            'name' => $product->name,

            'slug' => $product->slug,

            'type' => $product->type,

            'quantity' => $product->quantity,

            'category' => $product->category,

            'price' => $product->price,

            'compare_at_price' =>
                $product->compare_at_price,

            'stock' =>
                $product->quantity ?? 0,

            'image' => $this->resolveImagePath(
                $product->coverImage?->image_path
            ),

            'description' =>
                $product->short_description
                ?? $product->description
                ?? '',

            'is_bestseller' =>
                $product->is_bestseller ?? false,

            'show_price' =>
                $product->show_price,

            'show_stock' =>
                $product->show_stock,

            'is_new' =>
                $product->is_new ?? false,

            'is_for_sell' =>
                $product->is_for_sell ?? false,

            'is_rent' =>
                $product->is_rent ?? false,
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | Resolve Image
    |--------------------------------------------------------------------------
    */

    private function resolveImagePath(
        ?string $path
    ): string {

        if (!$path) {
            return '/images/placeholder.png';
        }

        $path = str_starts_with(
            $path,
            '/storage/'
        )
            ? $path
            : '/storage/' . ltrim($path, '/');

        return file_exists(
            public_path($path)
        )
            ? $path
            : '/images/placeholder.png';
    }

    /*
    |--------------------------------------------------------------------------
    | SEO Builder
    |--------------------------------------------------------------------------
    */

    private function buildSeo(): array
    {

        $configs = Configuration::query()
            ->whereIn('key', [
                'homepage_meta_title',
                'homepage_meta_description',
                'homepage_meta_keywords',
                'homepage_meta_image',
                'site_name',
                'site_tagline',
                'site_logo',
                'meta_description',
                'meta_keywords'
            ])
            ->pluck('value', 'key');

        return [

            'title' =>
                $configs['homepage_meta_title']
                ?? $configs['site_name']
                ?? 'Alumoda Sinergi Kontainer Indonesia',

            'description' =>
                $configs['homepage_meta_description']
                ?? $configs['meta_description']
                ?? 'Solusi container terpercaya untuk kebutuhan industri, proyek, office container, reefer, dan logistik.',

            'keywords' =>
                $configs['homepage_meta_keywords']
                ?? $configs['meta_keywords']
                ?? 'container, office container, reefer container, jual container, sewa container',

            'image' => match (true) {

                !empty($configs['homepage_meta_image']) => asset(
                    'storage/' . $configs['homepage_meta_image']
                ),

                !empty($configs['site_logo']) => asset(
                    str_starts_with(
                        $configs['site_logo'],
                        'configurations/'
                    )
                        ? 'storage/' . $configs['site_logo']
                        : $configs['site_logo']
                ),

                default => asset('images/logo-main.png'),
            },

            'type' => 'website',
        ];
    }
}