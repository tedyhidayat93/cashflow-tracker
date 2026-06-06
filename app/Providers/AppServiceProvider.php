<?php

namespace App\Providers;
use Illuminate\Http\Request;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\View;
use Illuminate\Cache\RateLimiting\Limit;
use App\Observers\ArticleObserver;
use App\Models\Configuration;
use App\Models\Article;

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

        // Article::observe(
        //     ArticleObserver::class
        // );


        View::share('siteconfig',
            Cache::rememberForever('siteconfig.public', function () {
                return Configuration::orderBy('group')
                    ->orderBy('label')
                    ->get()
                    ->mapWithKeys(fn ($config) => [
                        $config->key => $config->value
                    ]);
            })
        );
    }
}
