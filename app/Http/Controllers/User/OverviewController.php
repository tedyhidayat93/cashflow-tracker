<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OverviewController extends Controller
{
    /**
     * Menampilkan halaman overview / pemilihan workspace & modul untuk user biasa.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        // Ambil daftar workspace aktif tempat user ini terdaftar
        $workspaces = $user->workspaces()
            ->with(['apps' => function ($query) {
                $query->where('is_active', true);
            }])
            ->where('workspace_users.is_active', true)
            ->get()
            ->map(function ($ws) {
                return [
                    'id'          => $ws->id,
                    'name'        => $ws->name,
                    'slug'        => $ws->slug,
                    'logo'        => $ws->logo,
                    'description' => $ws->description,
                    'apps'        => $ws->apps->map(fn ($app) => [
                        'id'         => $app->id,
                        'app_prefix' => $app->app_prefix,
                        'is_active'  => $app->is_active,
                    ]),
                ];
            });

        return Inertia::render('user/overview/index', [
            'workspaces' => $workspaces,
        ]);
    }
}