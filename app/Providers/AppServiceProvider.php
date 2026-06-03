<?php

namespace App\Providers;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Cache;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\View;
use App\Models\Product;
use App\Models\Article;
use App\Models\Order;
use App\Models\Service;
use Inertia\Inertia;
use App\Models\Configuration;
use App\Observers\ProductObserver;
use App\Observers\ArticleObserver;


class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {

        // Product::observe(
        //     ProductObserver::class
        // );

        // Article::observe(
        //     ArticleObserver::class
        // );

        // RateLimiter::for('product-order', function (Request $request) {
        //     // User akan:
        //     // dibatasi per IP
        //     // dibatasi per email
        //     // anti spam
        //     // anti brute force

        //     return [

        //         // Max 5 request per menit per IP
        //         Limit::perMinute(5)->by($request->ip()),

        //         // Max 20 request per jam per email
        //         Limit::perHour(20)->by(
        //             $request->input('email')
        //         ),

        //     ];
        // });


        // Inertia::share([
        //     /*
        //     |--------------------------------------------------------------------------
        //     | Footer Products
        //     |--------------------------------------------------------------------------
        //     */

        //     'footerProducts' => fn () => Cache::remember(
        //         'shared.footer.products',
        //         now()->addHours(1),
        //         fn () => Product::getBestsellerForFooter()
        //     ),

        //     /*
        //     |--------------------------------------------------------------------------
        //     | Footer Articles
        //     |--------------------------------------------------------------------------
        //     */

        //     'footerArticles' => fn () => Cache::remember(
        //         'shared.footer.articles',
        //         now()->addHours(1),
        //         fn () => Article::getMostReadForFooter()
        //     ),

        //     /*
        //     |--------------------------------------------------------------------------
        //     | Footer Services
        //     |--------------------------------------------------------------------------
        //     */

        //     'footerServices' => fn () => Cache::remember(
        //         'shared.footer.services',
        //         now()->addHours(6),
        //         fn () => Service::getAllForFooter()
        //     ),

        // ]);

        // View::share('siteconfig',
        //     Cache::rememberForever('siteconfig.public', function () {
        //         return Configuration::orderBy('group')
        //             ->orderBy('label')
        //             ->get()
        //             ->mapWithKeys(fn ($config) => [
        //                 $config->key => $config->value
        //             ]);
        //     })
        // );
    }
}
