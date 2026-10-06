<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomepageController extends Controller
{
    public function index(
        Request $request
    ): Response {
        $user = $request->user();
        $userWorkspaces = [];

        // Jika user sudah login, ambil daftar workspace & app yang dimilikinya
        if ($user) {
            $userWorkspaces = $user->workspaces()
                ->with('apps')
                ->where('workspace_users.is_active', true)
                ->get()
                ->map(function ($ws) {
                    return [
                        'id' => $ws->id,
                        'name' => $ws->name,
                        'slug' => $ws->slug,
                        'apps' => $ws->apps->map(fn($app) => [
                            'app_prefix' => $app->app_prefix,
                            'is_active' => $app->is_active,
                        ]),
                    ];
                });
        }

        return Inertia::render('public/homepage', [
            'auth' => [
                'user' => $user,
            ],
            'workspaces' => $userWorkspaces,
        ]);
    }

}