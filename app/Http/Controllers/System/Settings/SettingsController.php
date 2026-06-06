<?php

namespace App\Http\Controllers\BackPanel\Settings;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function index()
    {
        return redirect()->route('profile.edit');
    }

    public function editProfile()
    {
        return Inertia::render('backpanel/settings/profile/edit');
    }

    public function updateProfile(Request $request)
    {
        // Logika update profile
    }

    public function destroyProfile(Request $request)
    {
        // Logika hapus profile
    }

    public function editAppearance()
    {
        return Inertia::render('backpanel/settings/appearance');
    }
}