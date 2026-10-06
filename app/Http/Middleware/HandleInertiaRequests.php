<?php

namespace App\Http\Middleware;

use App\Constants\AppMenu;
use App\Enums\AppIdentifier;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        $user = $request->user();

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'csrfToken' => csrf_token(),
            'auth' => [
                'user' => $user,
                'permissions' => $user?->getAllPermissions()->pluck('name') ?? [],
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'appUrl' => config('app.url'),
            'sidebarMenu' => $this->getSidebarMenu($request),
        ];
    }

    /**
     * Mendapatkan struktur menu sidebar secara dinamis berdasarkan URL path dan role.
     *
     * @param Request $request
     * @return array
     */
    protected function getSidebarMenu(Request $request): array
    {
        $path = $request->path();

        // 1. Cek jika mengakses area Superadmin
        if ($request->is('superadmin*')) {
            return AppMenu::superadmin();
        }

        // 2. Cek pola URL workspace: /w/{slug}/{app_prefix}
        if (preg_match('/^w\/([^\/]+)\/([^\/]+)/', $path, $matches)) {
            $workspaceSlug = $matches[1];
            $appPrefix = $matches[2];

            if ($appPrefix === AppIdentifier::CASHFLOW->value) {
                return AppMenu::cashflow($workspaceSlug);
            }

            // Tambahkan pendaftaran modul lain di sini jika ada (misal: inventory, hrm, dll)
        }

        // 3. Fallback pertama: ambil dari config/app_menu.php jika tersedia
        $configMenu = config('app_menu.cpanel');

        if (! empty($configMenu) && is_array($configMenu)) {
            return $configMenu;
        }

        // 4. Fallback terakhir: gunakan struktur menu default jika config/app_menu.php kosong
        return AppMenu::default();
    }
}