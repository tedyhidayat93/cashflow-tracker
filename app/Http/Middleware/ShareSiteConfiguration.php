<?php
namespace App\Http\Middleware;

use App\Models\Configuration;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\View;
use Inertia\Inertia;

class ShareSiteConfiguration
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // Share site configuration data with all Inertia views
        $siteconfig = Configuration::orderBy('group')
            ->orderBy('label')
            ->get()
            ->map(function ($config) {
                return [
                    // 'id' => $config->id,
                    'key' => $config->key,
                    'value' => $config->value,
                    // 'type' => $config->type,
                    // 'label' => $config->label,
                    // 'description' => $config->description,
                    // 'group' => $config->group,
                ];
            });
        
        Inertia::share('siteconfig', $siteconfig);
        View::share('siteconfig', $siteconfig);

        return $next($request);
    }
}   
