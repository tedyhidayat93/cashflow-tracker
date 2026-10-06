<?php

namespace App\Http\Controllers\Superadmin;

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
        return Inertia::render('_superadmin/dashboard');
    }
}