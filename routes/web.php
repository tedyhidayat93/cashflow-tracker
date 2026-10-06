<?php

use App\Http\Controllers\Apps\Cashflow\AccountController as CashflowAccountController;
use App\Http\Controllers\Apps\Cashflow\CategoryController as CashflowCategoryController;
use App\Http\Controllers\Apps\Cashflow\DashboardController as CashflowDashboardController;
use App\Http\Controllers\Apps\Cashflow\ExpenseController as CashflowExpenseController;
use App\Http\Controllers\Apps\Cashflow\IncomeController as CashflowIncomeController;
use App\Http\Controllers\Apps\Cashflow\ReportController as CashflowReportController;
use App\Http\Controllers\Apps\Cashflow\SettingController as CashflowSettingController;
use App\Http\Controllers\Apps\Cashflow\TransactionController as CashflowTransactionController;
use App\Http\Controllers\Apps\Cashflow\WalletTransferController as CashflowWalletTransferController;
use App\Http\Controllers\Frontend\HomepageController;
use App\Http\Controllers\Superadmin\Authorization\PermissionController;
use App\Http\Controllers\Superadmin\Authorization\RoleController;
use App\Http\Controllers\Superadmin\Authorization\UserManagementController;
use App\Http\Controllers\Superadmin\DashboardController;
use App\Http\Controllers\Superadmin\Settings\ConfigurationController;
use App\Http\Controllers\Superadmin\Settings\PasswordController;
use App\Http\Controllers\Superadmin\Settings\ProfileController;
use App\Http\Controllers\Superadmin\Settings\SettingsController;
use App\Http\Controllers\Superadmin\Settings\TwoFactorAuthenticationController;
use App\Http\Controllers\User\OverviewController;
use Illuminate\Support\Facades\Route;

// -------------------------------------------------------------
// 1. Frontend (Public)
// -------------------------------------------------------------
// Route::get('/', [HomepageController::class, 'index'])->name('homepage');
Route::get('/', function() {
    return redirect()->route('login');
})->name('homepage');


// -------------------------------------------------------------
// 2. Authenticated Routes (Pengguna Terverifikasi)
// -------------------------------------------------------------
Route::middleware(['auth', 'verified'])->group(function () {

    // ---------------------------------------------------------
    // A. User Overview / Module Selection Page
    // ---------------------------------------------------------
    Route::get('/overview', [OverviewController::class, 'index'])->name('overview');

    // ---------------------------------------------------------
    // B. Tenant / Workspace Modules (App-Scoped Routes)
    // ---------------------------------------------------------
    Route::prefix('w/{workspace:slug}')->name('workspace.')->middleware(\App\Http\Middleware\SetCurrentWorkspace::class)->group(function () {
        
        // Cashflow Tracker Module
        Route::prefix('cf')->name('cashflow.')->group(function () {
            // Dashboard
            Route::get('/', [CashflowDashboardController::class, 'index'])->name('dashboard');

            // Pemasukan (Income)
            Route::prefix('income')->name('income.')->group(function () {
                Route::get('/', [CashflowIncomeController::class, 'index'])->name('index');
                Route::get('/create', [CashflowIncomeController::class, 'create'])->name('create');
                Route::post('/', [CashflowIncomeController::class, 'store'])->name('store');
                Route::get('/{id}/edit', [CashflowIncomeController::class, 'edit'])->name('edit');
                Route::put('/{id}', [CashflowIncomeController::class, 'update'])->name('update');
                Route::delete('/{id}', [CashflowIncomeController::class, 'destroy'])->name('destroy');
            });

            // Pengeluaran (Expense)
            Route::prefix('expense')->name('expense.')->group(function () {
                Route::get('/', [CashflowExpenseController::class, 'index'])->name('index');
                Route::get('/create', [CashflowExpenseController::class, 'create'])->name('create');
                Route::post('/', [CashflowExpenseController::class, 'store'])->name('store');
                Route::get('/{id}/edit', [CashflowExpenseController::class, 'edit'])->name('edit');
                Route::put('/{id}', [CashflowExpenseController::class, 'update'])->name('update');
                Route::delete('/{id}', [CashflowExpenseController::class, 'destroy'])->name('destroy');
            });

            // Semua Transaksi (Transactions)
            Route::prefix('transactions')->name('transactions.')->group(function () {
                Route::get('/', [CashflowTransactionController::class, 'index'])->name('index');
                Route::get('/{id}', [CashflowTransactionController::class, 'show'])->name('show');
            });

            // Kategori Kas (Categories)
            Route::prefix('categories')->name('categories.')->group(function () {
                Route::get('/', [CashflowCategoryController::class, 'index'])->name('index');
                Route::post('/', [CashflowCategoryController::class, 'store'])->name('store');
                Route::put('/{id}', [CashflowCategoryController::class, 'update'])->name('update');
                Route::delete('/{id}', [CashflowCategoryController::class, 'destroy'])->name('destroy');
            });

            Route::prefix('transfers')->name('transfers.')->group(function () {
                Route::get('/', [CashflowWalletTransferController::class, 'index'])->name('index');
                Route::post('/', [CashflowWalletTransferController::class, 'store'])->name('store');
                Route::delete('/{id}', [CashflowWalletTransferController::class, 'destroy'])->name('destroy');
            });

            // Akun / Rekening (Accounts)
            Route::prefix('accounts')->name('accounts.')->group(function () {
                Route::get('/', [CashflowAccountController::class, 'index'])->name('index');
                Route::post('/', [CashflowAccountController::class, 'store'])->name('store');
                Route::put('/{id}', [CashflowAccountController::class, 'update'])->name('update');
                Route::delete('/{id}', [CashflowAccountController::class, 'destroy'])->name('destroy');
            });

            // Laporan Finansial (Reports)
            Route::prefix('reports')->name('reports.')->group(function () {
                Route::get('/', [CashflowReportController::class, 'index'])->name('index');
                Route::get('/export', [CashflowReportController::class, 'export'])->name('export');
            });

            // Pengaturan Modul (Settings)
            Route::prefix('settings')->name('settings.')->group(function () {
                Route::get('/', [CashflowSettingController::class, 'index'])->name('index');
                Route::put('/', [CashflowSettingController::class, 'update'])->name('update');
            });
            
        });

        // Module lain bisa ditambahkan di sini secara modular:
        // Route::prefix('inventory')->name('inventory.')->group(...);
    });

    // ---------------------------------------------------------
    // C. Control Panel (Superadmin Only Area)
    // ---------------------------------------------------------
    Route::prefix('cpanel')->name('cpanel.')->group(function () {
        
        // Dashboard
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
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