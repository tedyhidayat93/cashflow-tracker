<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Permission;
use Illuminate\Support\Facades\DB;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing permissions
        DB::table('permissions')->delete();

        $permissions = [
            // Dashboard
            ['name' => 'dashboard-view', 'guard_name' => 'web', 'group_name' => 'dashboard', 'description' => 'Melihat dashboard'],
            
            // CRM (Customer Relationship Management)
            ['name' => 'order-list', 'guard_name' => 'web', 'group_name' => 'crm', 'description' => 'Melihat daftar pesanan'],
            ['name' => 'order-create', 'guard_name' => 'web', 'group_name' => 'crm', 'description' => 'Membuat pesanan baru'],
            ['name' => 'order-edit', 'guard_name' => 'web', 'group_name' => 'crm', 'description' => 'Mengedit pesanan'],
            ['name' => 'order-delete', 'guard_name' => 'web', 'group_name' => 'crm', 'description' => 'Menghapus pesanan'],
            
            ['name' => 'customer-list', 'guard_name' => 'web', 'group_name' => 'crm', 'description' => 'Melihat daftar pelanggan'],
            ['name' => 'customer-create', 'guard_name' => 'web', 'group_name' => 'crm', 'description' => 'Membuat pelanggan baru'],
            ['name' => 'customer-edit', 'guard_name' => 'web', 'group_name' => 'crm', 'description' => 'Mengedit pelanggan'],
            ['name' => 'customer-delete', 'guard_name' => 'web', 'group_name' => 'crm', 'description' => 'Menghapus pelanggan'],
            
            // CMS (Content Management System)
            ['name' => 'article-list', 'guard_name' => 'web', 'group_name' => 'cms', 'description' => 'Melihat daftar artikel'],
            ['name' => 'article-create', 'guard_name' => 'web', 'group_name' => 'cms', 'description' => 'Membuat artikel baru'],
            ['name' => 'article-edit', 'guard_name' => 'web', 'group_name' => 'cms', 'description' => 'Mengedit artikel'],
            ['name' => 'article-delete', 'guard_name' => 'web', 'group_name' => 'cms', 'description' => 'Menghapus artikel'],
            
            ['name' => 'product-list', 'guard_name' => 'web', 'group_name' => 'cms', 'description' => 'Melihat daftar produk'],
            ['name' => 'product-create', 'guard_name' => 'web', 'group_name' => 'cms', 'description' => 'Membuat produk baru'],
            ['name' => 'product-edit', 'guard_name' => 'web', 'group_name' => 'cms', 'description' => 'Mengedit produk'],
            ['name' => 'product-delete', 'guard_name' => 'web', 'group_name' => 'cms', 'description' => 'Menghapus produk'],
            
            ['name' => 'client-list', 'guard_name' => 'web', 'group_name' => 'cms', 'description' => 'Melihat daftar klien'],
            ['name' => 'client-create', 'guard_name' => 'web', 'group_name' => 'cms', 'description' => 'Membuat klien baru'],
            ['name' => 'client-edit', 'guard_name' => 'web', 'group_name' => 'cms', 'description' => 'Mengedit klien'],
            ['name' => 'client-delete', 'guard_name' => 'web', 'group_name' => 'cms', 'description' => 'Menghapus klien'],
            
            ['name' => 'brand-list', 'guard_name' => 'web', 'group_name' => 'cms', 'description' => 'Melihat daftar merek'],
            ['name' => 'brand-create', 'guard_name' => 'web', 'group_name' => 'cms', 'description' => 'Membuat merek baru'],
            ['name' => 'brand-edit', 'guard_name' => 'web', 'group_name' => 'cms', 'description' => 'Mengedit merek'],
            ['name' => 'brand-delete', 'guard_name' => 'web', 'group_name' => 'cms', 'description' => 'Menghapus merek'],
            
            ['name' => 'service-list', 'guard_name' => 'web', 'group_name' => 'cms', 'description' => 'Melihat daftar layanan'],
            ['name' => 'service-create', 'guard_name' => 'web', 'group_name' => 'cms', 'description' => 'Membuat layanan baru'],
            ['name' => 'service-edit', 'guard_name' => 'web', 'group_name' => 'cms', 'description' => 'Mengedit layanan'],
            ['name' => 'service-delete', 'guard_name' => 'web', 'group_name' => 'cms', 'description' => 'Menghapus layanan'],
            
            ['name' => 'category-list', 'guard_name' => 'web', 'group_name' => 'cms', 'description' => 'Melihat daftar kategori'],
            ['name' => 'category-create', 'guard_name' => 'web', 'group_name' => 'cms', 'description' => 'Membuat kategori baru'],
            ['name' => 'category-edit', 'guard_name' => 'web', 'group_name' => 'cms', 'description' => 'Mengedit kategori'],
            ['name' => 'category-delete', 'guard_name' => 'web', 'group_name' => 'cms', 'description' => 'Menghapus kategori'],
            
            ['name' => 'tag-list', 'guard_name' => 'web', 'group_name' => 'cms', 'description' => 'Melihat daftar tag'],
            ['name' => 'tag-create', 'guard_name' => 'web', 'group_name' => 'cms', 'description' => 'Membuat tag baru'],
            ['name' => 'tag-edit', 'guard_name' => 'web', 'group_name' => 'cms', 'description' => 'Mengedit tag'],
            ['name' => 'tag-delete', 'guard_name' => 'web', 'group_name' => 'cms', 'description' => 'Menghapus tag'],
            
            ['name' => 'faq-list', 'guard_name' => 'web', 'group_name' => 'cms', 'description' => 'Melihat daftar FAQ'],
            ['name' => 'faq-create', 'guard_name' => 'web', 'group_name' => 'cms', 'description' => 'Membuat FAQ baru'],
            ['name' => 'faq-edit', 'guard_name' => 'web', 'group_name' => 'cms', 'description' => 'Mengedit FAQ'],
            ['name' => 'faq-delete', 'guard_name' => 'web', 'group_name' => 'cms', 'description' => 'Menghapus FAQ'],
            
            ['name' => 'testimonial-list', 'guard_name' => 'web', 'group_name' => 'cms', 'description' => 'Melihat daftar testimonial'],
            ['name' => 'testimonial-create', 'guard_name' => 'web', 'group_name' => 'cms', 'description' => 'Membuat testimonial baru'],
            ['name' => 'testimonial-edit', 'guard_name' => 'web', 'group_name' => 'cms', 'description' => 'Mengedit testimonial'],
            ['name' => 'testimonial-delete', 'guard_name' => 'web', 'group_name' => 'cms', 'description' => 'Menghapus testimonial'],
            
            // Authorization Management
            ['name' => 'user-list', 'guard_name' => 'web', 'group_name' => 'authorization', 'description' => 'Melihat daftar user'],
            ['name' => 'user-create', 'guard_name' => 'web', 'group_name' => 'authorization', 'description' => 'Membuat user baru'],
            ['name' => 'user-edit', 'guard_name' => 'web', 'group_name' => 'authorization', 'description' => 'Mengedit user'],
            ['name' => 'user-delete', 'guard_name' => 'web', 'group_name' => 'authorization', 'description' => 'Menghapus user'],
            
            ['name' => 'role-list', 'guard_name' => 'web', 'group_name' => 'authorization', 'description' => 'Melihat daftar role'],
            ['name' => 'role-create', 'guard_name' => 'web', 'group_name' => 'authorization', 'description' => 'Membuat role baru'],
            ['name' => 'role-edit', 'guard_name' => 'web', 'group_name' => 'authorization', 'description' => 'Mengedit role'],
            ['name' => 'role-delete', 'guard_name' => 'web', 'group_name' => 'authorization', 'description' => 'Menghapus role'],
            
            ['name' => 'permission-list', 'guard_name' => 'web', 'group_name' => 'authorization', 'description' => 'Melihat daftar permission'],
            ['name' => 'permission-create', 'guard_name' => 'web', 'group_name' => 'authorization', 'description' => 'Membuat permission baru'],
            ['name' => 'permission-edit', 'guard_name' => 'web', 'group_name' => 'authorization', 'description' => 'Mengedit permission'],
            ['name' => 'permission-delete', 'guard_name' => 'web', 'group_name' => 'authorization', 'description' => 'Menghapus permission'],
            
            // Analytics
            ['name' => 'visitor-log-list', 'guard_name' => 'web', 'group_name' => 'analytics', 'description' => 'Melihat log visitor'],
            
            // Settings
            ['name' => 'setting-configuration-list', 'guard_name' => 'web', 'group_name' => 'settings', 'description' => 'Melihat pengaturan konfigurasi'],
            ['name' => 'setting-configuration-create', 'guard_name' => 'web', 'group_name' => 'settings', 'description' => 'Menambah pengaturan konfigurasi'],
            ['name' => 'setting-configuration-edit', 'guard_name' => 'web', 'group_name' => 'settings', 'description' => 'Mengedit pengaturan konfigurasi'],
        ];

        foreach ($permissions as $permission) {
            Permission::create($permission);
        }
    }
}
    