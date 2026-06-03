<?php

use App\Http\Controllers\Frontend\HomepageController;
use App\Http\Controllers\Frontend\CatalogController;
use App\Http\Controllers\Frontend\TestimonialController as TestimonialFrontendController;
use App\Http\Controllers\BackPanel\DashboardController;
use App\Http\Controllers\Frontend\BlogController;
use App\Http\Controllers\Frontend\SitemapController;
use App\Http\Controllers\BackPanel\CMS\CategoryController;
use App\Http\Controllers\BackPanel\CMS\ServiceController;
use App\Http\Controllers\BackPanel\CMS\BrandController;
use App\Http\Controllers\BackPanel\CMS\TagController;
use App\Http\Controllers\BackPanel\CMS\FaqController;
use App\Http\Controllers\BackPanel\CMS\ClientController;
use App\Http\Controllers\BackPanel\CMS\TestimonialController;
use App\Http\Controllers\BackPanel\CMS\ProductController;
use App\Http\Controllers\BackPanel\CMS\ArticleController;
use App\Http\Controllers\BackPanel\CRM\OrderController;
use App\Http\Controllers\BackPanel\CRM\CustomerController;
use App\Http\Controllers\BackPanel\Settings\{
    ProfileController,
    PasswordController,
    TwoFactorAuthenticationController,
    SettingsController,
    ConfigurationController 
};
use App\Http\Controllers\BackPanel\Analytics\VisitorLogController;
use App\Http\Controllers\BackPanel\Authorization\{
    RoleController,
    PermissionController,
    UserManagementController
};
use Illuminate\Support\Facades\Route;

// API Configuration for Frontend
Route::get('/api/configurations/{group?}', [App\Http\Controllers\Frontend\ConfigurationController::class, 'index'])->name('api.configurations');

// Frontend (Public)
Route::get('/', [HomepageController::class, 'index'])->name('homepage');

Route::get('/testimonial', [TestimonialFrontendController::class, 'index'])->name('testimonial.index');
Route::match(['get', 'post'], '/testimonial/send-your-testimoni', [TestimonialFrontendController::class, 'submit'])->name('testimonial.submit');
Route::get('/testimonial/maps', [TestimonialFrontendController::class, 'maps'])->name('testimonial.maps');

Route::get('/catalog', [CatalogController::class, 'index'])->name('catalog.index');

Route::post('/catalog/order', [CatalogController::class, 'order'])->name('catalog.order')->middleware('throttle:product-order');

Route::get('/catalog/{id}', [CatalogController::class, 'show'])
    ->name('catalog.show');
    
Route::get('/catalog/{category}', function($category) {
    return 'Catalog category: ' . $category;
})->name('catalog.category');

Route::prefix('articles')->name('article.')->group(function () {
    Route::get('/', [BlogController::class, 'index'])->name('index');
    Route::get('/{slug}', [BlogController::class, 'show'])->name('show');
    Route::get('/category/{slug}', [BlogController::class, 'category'])->name('category');
    Route::get('/tag/{slug}', [BlogController::class, 'tag'])->name('tag');
});

// Sitemap
Route::get('/sitemap', [SitemapController::class, 'index'])->name('sitemap');
Route::get('/sitemap.xml', [SitemapController::class, 'xml'])->name('sitemap.xml');


// Control Panel (Admin)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('cpanel')->group(function () {
        
        // Get stats order for dashboard
        Route::get('/dashboard/recent-orders', [DashboardController::class, 'getRecentOrdersStats'])->name('recent-orders.stats');

        // Dashboard
        Route::get('', [DashboardController::class, 'index'])->name('dashboard');
        
        // CMS Management
        Route::prefix('cms')->name('cms.')->group(function () {
            // Categories
            Route::prefix('category')->name('category.')->group(function () {
                Route::get('/', [CategoryController::class, 'index'])->name('index');
                Route::get('/create', [CategoryController::class, 'create'])->name('create');
                Route::post('/', [CategoryController::class, 'store'])->name('store');
                Route::get('/{id}', [CategoryController::class, 'show'])->name('show');
                Route::get('/edit/{id}', [CategoryController::class, 'edit'])->name('edit');
                Route::match(['post', 'put'], '/{id}', [CategoryController::class, 'update'])->name('update');
                Route::delete('/{id}', [CategoryController::class, 'destroy'])->name('destroy');
                Route::patch('/{id}/toggle-status', [CategoryController::class, 'toggleStatus'])->name('toggle-status');
                Route::get('/tree', [CategoryController::class, 'getTree'])->name('tree');
            });

            // Services
            Route::prefix('service')->name('service.')->group(function () {
                Route::get('', [ServiceController::class, 'index'])->name('index');
                Route::get('create', [ServiceController::class, 'create'])->name('create');
                Route::post('', [ServiceController::class, 'store'])->name('store');
                Route::get('{id}', [ServiceController::class, 'show'])->name('show');
                Route::get('edit/{id}', [ServiceController::class, 'edit'])->name('edit');
                Route::match(['post', 'put'], '{id}', [ServiceController::class, 'update'])->name('update');
                Route::delete('{id}', [ServiceController::class, 'destroy'])->name('destroy');
                Route::patch('{id}/toggle-status', [ServiceController::class, 'toggleStatus'])->name('toggle-status');
                Route::patch('{id}/toggle-featured', [ServiceController::class, 'toggleFeatured'])->name('toggle-featured');
            });

            // Clients
            Route::prefix('client')->name('client.')->group(function () {
                Route::get('', [ClientController::class, 'index'])->name('index');
                Route::get('create', [ClientController::class, 'create'])->name('create');
                Route::post('', [ClientController::class, 'store'])->name('store');
                Route::get('{id}', [ClientController::class, 'show'])->name('show');
                Route::get('edit/{id}', [ClientController::class, 'edit'])->name('edit');
                Route::match(['post', 'put'], '{id}', [ClientController::class, 'update'])->name('update');
                Route::delete('{id}', [ClientController::class, 'destroy'])->name('destroy');
                Route::patch('{id}/toggle-status', [ClientController::class, 'toggleStatus'])->name('toggle-status');
            });

            // Testimonials
            Route::prefix('testimonial')->name('testimonial.')->group(function () {
                Route::get('', [TestimonialController::class, 'index'])->name('index');
                Route::get('create', [TestimonialController::class, 'create'])->name('create');
                Route::post('', [TestimonialController::class, 'store'])->name('store');
                Route::get('{id}', [TestimonialController::class, 'show'])->name('show');
                Route::get('edit/{id}', [TestimonialController::class, 'edit'])->name('edit');
                Route::match(['post', 'put'], '{id}', [TestimonialController::class, 'update'])->name('update');
                Route::delete('{id}', [TestimonialController::class, 'destroy'])->name('destroy');
                Route::patch('{id}/toggle-status', [TestimonialController::class, 'toggleStatus'])->name('toggle-status');
            });

            // Brands
            Route::prefix('brand')->name('brand.')->group(function () {
                Route::get('', [BrandController::class, 'index'])->name('index');
                Route::get('create', [BrandController::class, 'create'])->name('create');
                Route::post('', [BrandController::class, 'store'])->name('store');
                Route::get('{id}', [BrandController::class, 'show'])->name('show');
                Route::get('edit/{id}', [BrandController::class, 'edit'])->name('edit');
                Route::match(['post', 'put'], '{id}', [BrandController::class, 'update'])->name('update');
                Route::delete('{id}', [BrandController::class, 'destroy'])->name('destroy');
                Route::patch('{id}/toggle-status', [BrandController::class, 'toggleStatus'])->name('toggle-status');
                Route::patch('update-position', [BrandController::class, 'updatePosition'])->name('update-position');
            });

            // Tags
            Route::prefix('tag')->name('tag.')->group(function () {
                Route::get('', [TagController::class, 'index'])->name('index');
                Route::get('create', [TagController::class, 'create'])->name('create');
                Route::post('', [TagController::class, 'store'])->name('store');
                Route::get('{id}', [TagController::class, 'show'])->name('show');
                Route::get('edit/{id}', [TagController::class, 'edit'])->name('edit');
                Route::match(['post', 'put'], '{id}', [TagController::class, 'update'])->name('update');
                Route::delete('{id}', [TagController::class, 'destroy'])->name('destroy');
            });

            // FAQs
            Route::prefix('faq')->name('faq.')->group(function () {
                Route::get('', [FaqController::class, 'index'])->name('index');
                Route::get('create', [FaqController::class, 'create'])->name('create');
                Route::post('', [FaqController::class, 'store'])->name('store');
                Route::get('{id}', [FaqController::class, 'show'])->name('show');
                Route::get('edit/{id}', [FaqController::class, 'edit'])->name('edit');
                Route::match(['post', 'put'], '{id}', [FaqController::class, 'update'])->name('update');
                Route::delete('{id}', [FaqController::class, 'destroy'])->name('destroy');
                Route::patch('{id}/toggle-status', [FaqController::class, 'toggleStatus'])->name('toggle-status');
                Route::patch('update-position', [FaqController::class, 'updatePosition'])->name('update-position');
            });

            // Products
            Route::prefix('product')->name('product.')->group(function () {
                Route::get('', [ProductController::class, 'index'])->name('index');
                Route::get('create', [ProductController::class, 'create'])->name('create');
                Route::post('', [ProductController::class, 'store'])->name('store');
                Route::get('{id}', [ProductController::class, 'show'])->name('show');
                Route::get('edit/{id}', [ProductController::class, 'edit'])->name('edit');
                Route::match(['post', 'put'], '{id}', [ProductController::class, 'update'])->name('update');
                Route::delete('{id}', [ProductController::class, 'destroy'])->name('destroy');
                Route::patch('{id}/toggle-status', [ProductController::class, 'toggleStatus'])->name('toggle-status');
                Route::patch('{id}/toggle-featured', [ProductController::class, 'toggleFeatured'])->name('toggle-featured');
                Route::patch('{id}/toggle-bestseller', [ProductController::class, 'toggleBestseller'])->name('toggle-bestseller');
                Route::patch('update-position', [ProductController::class, 'updatePosition'])->name('update-position');
            });

            // Articles
            Route::prefix('article')->name('article.')->group(function () {
                Route::get('', [ArticleController::class, 'index'])->name('index');
                Route::get('create', [ArticleController::class, 'create'])->name('create');
                Route::post('', [ArticleController::class, 'store'])->name('store');
                Route::get('{id}', [ArticleController::class, 'show'])->name('show');
                Route::get('edit/{id}', [ArticleController::class, 'edit'])->name('edit');
                Route::match(['post', 'put'], '{id}', [ArticleController::class, 'update'])->name('update');
                Route::delete('{id}', [ArticleController::class, 'destroy'])->name('destroy');
                Route::patch('{id}/toggle-status', [ArticleController::class, 'toggleStatus'])->name('toggle-status');
                Route::patch('update-position', [ArticleController::class, 'updatePosition'])->name('update-position');
            });    
        });
    
        // CRM
        Route::prefix('crm')->name('crm.')->group(function () {
            // Orders
            Route::prefix('orders')->name('orders.')->group(function () {
                Route::get('', [OrderController::class, 'index'])->name('index');
                Route::get('create', [OrderController::class, 'create'])->name('create');
                Route::post('', [OrderController::class, 'store'])->name('store');
                Route::get('{id}', [OrderController::class, 'show'])->name('show');
                Route::get('edit/{id}', [OrderController::class, 'edit'])->name('edit');
                Route::match(['post', 'put'], '{id}', [OrderController::class, 'update'])->name('update');
                Route::delete('{id}', [OrderController::class, 'destroy'])->name('destroy');
                Route::patch('{id}/status', [OrderController::class, 'updateStatus'])->name('updateStatus');
                Route::post('{id}/resend-email', [OrderController::class, 'resendEmail']) ->name('resendEmail');
            });
            
            // Customers
            Route::prefix('customer')->name('customer.')->group(function () {
                Route::get('', [CustomerController::class, 'index'])->name('index');
                Route::get('create', [CustomerController::class, 'create'])->name('create');
                Route::post('', [CustomerController::class, 'store'])->name('store');
                Route::get('{id}', [CustomerController::class, 'show'])->name('show');
                Route::get('edit/{id}', [CustomerController::class, 'edit'])->name('edit');
                Route::match(['post', 'put'], '{id}', [CustomerController::class, 'update'])->name('update');
                Route::delete('{id}', [CustomerController::class, 'destroy'])->name('destroy');
                Route::patch('{id}/toggle-status', [CustomerController::class, 'toggleStatus'])->name('toggle-status');
            });
        });
    
        // Analytics
        Route::prefix('analytics')->name('analytics.')->group(function () {
            // Visitor Logs
            Route::prefix('visitor-logs')->name('visitor-logs.')->group(function () {
                Route::get('', [VisitorLogController::class, 'index'])->name('index');
                Route::get('{id}', [VisitorLogController::class, 'show'])->name('show');
            });
        });
    
        // Authorization Management
        Route::prefix('authorization')->name('authorization.')->group(function () {
            // User Management
            Route::prefix('user-management')->name('users.')->group(function () {
                Route::get('', [UserManagementController::class, 'index'])->name('index');
                Route::get('create', [UserManagementController::class, 'create'])->name('create');
                Route::post('', [UserManagementController::class, 'store'])->name('store');
                Route::get('{id}', [UserManagementController::class, 'show'])->name('show');
                Route::get('{id}/edit', [UserManagementController::class, 'edit'])->name('edit');
                Route::match(['post', 'put'], '{id}', [UserManagementController::class, 'update'])->name('update');
                Route::delete('{id}', [UserManagementController::class, 'destroy'])->name('destroy');
                Route::patch('{id}/toggle-status', [UserManagementController::class, 'toggleStatus'])->name('toggle-status');
            });

            // Role Management
            Route::prefix('roles')->name('roles.')->group(function () {
                Route::get('', [RoleController::class, 'index'])->name('index');
                Route::get('create', [RoleController::class, 'create'])->name('create');
                Route::post('', [RoleController::class, 'store'])->name('store');
                Route::get('{id}', [RoleController::class, 'show'])->name('show');
                Route::get('edit/{id}', [RoleController::class, 'edit'])->name('edit');
                Route::match(['post', 'put'], '{id}', [RoleController::class, 'update'])->name('update');
                Route::delete('{id}', [RoleController::class, 'destroy'])->name('destroy');
                Route::patch('{id}/toggle-status', [RoleController::class, 'toggleStatus'])->name('toggle-status');
                Route::get('{id}/permissions', [RoleController::class, 'permissions'])->name('permissions');
                Route::put('{id}/permissions', [RoleController::class, 'syncPermissions'])->name('sync-permissions');
            });

            // Permission Management
            Route::prefix('permissions')->name('permissions.')->group(function () {
                Route::get('', [PermissionController::class, 'index'])->name('index');
                Route::get('create', [PermissionController::class, 'create'])->name('create');
                Route::post('', [PermissionController::class, 'store'])->name('store');
                Route::get('{id}', [PermissionController::class, 'show'])->name('show');
                Route::get('edit/{id}', [PermissionController::class, 'edit'])->name('edit');
                Route::match(['post', 'put'], '{id}', [PermissionController::class, 'update'])->name('update');
                Route::delete('{id}', [PermissionController::class, 'destroy'])->name('destroy');
                Route::get('groups', [PermissionController::class, 'groups'])->name('groups');
            });
        });

        // Settings
        Route::prefix('settings')->name('settings.')->group(function () {
            Route::get('/', [SettingsController::class, 'index'])->name('index');
            Route::get('profile', [ProfileController::class, 'edit'])->name('profile.edit');
            Route::put('profile', [ProfileController::class, 'update'])->name('profile.update');
            Route::delete('profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
            Route::get('password', [PasswordController::class, 'edit'])->name('password.edit');
            Route::put('password', [PasswordController::class, 'update'])->name('password.update');
            Route::get('two-factor', [TwoFactorAuthenticationController::class, 'show'])->name('two-factor.show');
            Route::get('appearance', [SettingsController::class, 'editAppearance'])->name('appearance.edit');
            
            // Configuration
            Route::prefix('configuration')->name('configuration.')->group(function () {
                Route::get('/', [ConfigurationController::class, 'index'])->name('index');
                Route::get('{group}', [ConfigurationController::class, 'show'])->name('show');
                Route::post('{group}', [ConfigurationController::class, 'store'])->name('store');
                Route::put('{group}', [ConfigurationController::class, 'update'])->name('update');
                Route::delete('{group}/{id}', [ConfigurationController::class, 'destroy'])->name('destroy');
            });
        });    
    });
});