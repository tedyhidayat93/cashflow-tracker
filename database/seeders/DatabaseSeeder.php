<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            
            // Core System Seeders
            ConfigurationSeeder::class,
            MetaSeoConfigurationSeeder::class,

            // RBAC Seeders
            RoleSeeder::class,
            PermissionSeeder::class,
            RolePermissionSeeder::class,
            UserSeeder::class,
            
            // CMS Seeders
            CategorySeeder::class,
            BlogCategorySeeder::class,
            ProductSeeder::class,
            ServiceSeeder::class,
            // ClientSeeder::class,
            FaqSeeder::class,
            ArticleSeeder::class,

            // Main App Cashflow Tracker Seeders

        ]);
    }
}
